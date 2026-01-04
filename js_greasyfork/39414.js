// ==UserScript==
// @name         WTRS工数自动填写
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  A script help you input work time automatically, enjoy!
// @author       贝克街的流浪猫
// @match        *://*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/39414/WTRS%E5%B7%A5%E6%95%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/39414/WTRS%E5%B7%A5%E6%95%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function () {
    //Constant
    const SYSTEM_MATCH_PREFIX = 'wtrs-cn';
    const WORK_MODE_VALUE_KEY = 'WORK_MODE';
    const FAVORITE_PROJECTS_SIZE_VALUE_KEY = 'FAVORITE_PROJECT_SIZE';
    const DEVELOPER_WORK_MODE = 0;
    const QA_WORK_MODE = 1;
    const DEVELOP_SWITCH_MENU_TITLE = 'WTRS工数填写插件->切换到开发模式';
    const QA_SWITCH_MENU_TITLE = 'WTRS工数填写插件->切换到QA模式';
    const TIPS_MENU_TITLE = 'WTRS工数填写插件->查看注意事项';
    const FAVORITE_PROJECT_SIZE_MENU_TITLE = 'WTRS工数填写插件->设置"気に入り項目"数量';
    const TIPS = '如果您是第一次使用或使用时出现了问题, 请查阅使用教程!\nhttp://works.do/5c1F32';
    const WORKING_DAY_FLAG = '出勤';

    //Variable
    let workMode = GM_getValue(WORK_MODE_VALUE_KEY) || DEVELOPER_WORK_MODE;
    let favoriteProjectsSize = GM_getValue(FAVORITE_PROJECTS_SIZE_VALUE_KEY) || 1;
    let workModeSwitchMenuId = undefined;
    let favoriteProjectSizeMenuId = undefined;

    //Methods
    let isWTRSSystem = () => {
        return window.location.host.startsWith(SYSTEM_MATCH_PREFIX);
    };

    let registerAllMenu = () => {
        registerTipsMenu();
        registerModeSwitchMenuByCurrentWorkMode();
    };

    let registerModeSwitchMenuByCurrentWorkMode = () => {
        if (workMode === QA_WORK_MODE) {
            registerModeSwitchMenu(DEVELOPER_WORK_MODE, DEVELOP_SWITCH_MENU_TITLE, TIPS);
            registerFavoriteProjectSizeMenu();
        } else {
            registerModeSwitchMenu(QA_WORK_MODE, QA_SWITCH_MENU_TITLE, TIPS);
        }
    };

    let registerModeSwitchMenu = (modeType, menuTitle, modeTips) => {
        workModeSwitchMenuId = GM_registerMenuCommand(menuTitle,
            () => {
                alert(modeTips);
                if (workModeSwitchMenuId) {
                    GM_unregisterMenuCommand(workModeSwitchMenuId);
                }
                if (favoriteProjectSizeMenuId) {
                    GM_unregisterMenuCommand(favoriteProjectSizeMenuId);
                    favoriteProjectSizeMenuId = undefined;
                }
                GM_setValue(WORK_MODE_VALUE_KEY, modeType);
                workMode = modeType;
                if (modeType === DEVELOPER_WORK_MODE) {
                    favoriteProjectsSize = 1;
                    GM_setValue(FAVORITE_PROJECTS_SIZE_VALUE_KEY, 1);
                }
                registerModeSwitchMenuByCurrentWorkMode();
                alert('已切换到' + (workMode === DEVELOPER_WORK_MODE ? '开发' : 'QA') + '模式');
            }
        );
    };

    let registerTipsMenu = () => {
        GM_registerMenuCommand(TIPS_MENU_TITLE, () => {
            alert(TIPS);
        });
    };

    let registerFavoriteProjectSizeMenu = () => {
        favoriteProjectSizeMenuId = GM_registerMenuCommand(FAVORITE_PROJECT_SIZE_MENU_TITLE,
            () => {
                let size = prompt('请输入您设置的"気に入り項目"数量');
                try {
                    if (size === '') {
                        alert('输入数据无效，操作取消！');
                        return;
                    }
                    size = parseInt(Number(size));
                    if (Number.isInteger(size)) {
                        if (size < 2) {
                            alert('"気に入り項目"数量应该至少为2个，第一个是业务项目，第二个为加班项目！');
                            return;
                        }
                        favoriteProjectsSize = size;
                        GM_setValue(FAVORITE_PROJECTS_SIZE_VALUE_KEY, size);
                        alert('"気に入り項目"数量已设置为' + size + '个');
                    } else {
                        alert('输入数据无效，操作取消！');
                    }
                } catch (e) {
                    alert('输入数据无效，操作取消！');
                }
            }
        );
    };

    let addWorkButton = () => {
        let runButton = document.createElement("BUTTON");
        let runButtonSpan = document.createElement("SPAN");
        runButtonSpan.appendChild(document.createTextNode("自动填写工数"));
        runButton.appendChild(runButtonSpan);
        runButtonSpan.className = "ui-button-text";
        runButton.className = "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only";
        runButton.onclick = doWork;
        $('#logoutBtn')[0].parentElement.appendChild(runButton);
    };

    let doWork = () => {
        alert(TIPS);
        if (!isAllInputRowLoaded()) {
            rowsDisplayToggle();
            setInterval(loopWaitInputRowLoadedAndInputWorkTime, 100);
        } else {
            loopWaitInputRowLoadedAndInputWorkTime();
        }
    };

    let loopWaitInputRowLoadedAndInputWorkTime = () => {
        if (isAllInputRowLoaded()) {
            inputWorkTime();
            rowsDisplayToggle();
            clearInterval();
        }
    };

    let getAllRows = () => {
        with (document.getElementById('mainWin').contentWindow) {
            return $('.ui-widget-content.jqgrow.ui-row-ltr:not(.ui-state-disabled,.selected-row)');
        }
    };

    let getInputElement = (index) => {
        with (document.getElementById('mainWin').contentWindow) {
            return $('#' + (index) + '_times');
        }
    };

    let getDataRows = () => {
        let result = [];
        let searchResult = getAllRows();
        for (let i = 0; i < searchResult.length; i++) {
            if (searchResult[i].id.indexOf('LINE') === -1) {
                result.push(searchResult[i]);
            }
        }
        return result;
    };

    let getInputRows = () => {
        let result = [];
        let searchResult = getAllRows();
        for (let i = 0; i < searchResult.length; i++) {
            if (searchResult[i].id.indexOf('LINE') !== -1) {
                result.push(searchResult[i]);
            }
        }
        return result;
    };

    let rowsDisplayToggle = () => {
        let rows = getAllRows();
        for (let i = 0; i < rows.length; i++) {
            rows[i].children[1].click();
        }
    };

    let isAllInputRowLoaded = () => {
        return getDataRows().length * favoriteProjectsSize === getInputRows().length;
    };

    let inputWorkTime = () => {
        let rows = getAllRows();
        for (let j = 0; j < rows.length; j++) {
            let value = parseFloat(rows[j].children[8].innerText);
            if (workMode === DEVELOPER_WORK_MODE) {
                j += favoriteProjectsSize;
                rows[j].children[6].click();
                getInputElement(favoriteProjectsSize).val(value).trigger('change');
                rows[j].children[5].click();
            } else {
                let isWorkInHoliday = rows[j].children[5].innerText !== WORKING_DAY_FLAG;
                if (isWorkInHoliday) {
                    for (let k = 0; k < favoriteProjectsSize - 1; k++) {
                        j++;
                        rows[j].children[1].children[0].click();
                    }
                    j++;
                    if (value >= 3) {
                        rows[j].children[6].click();
                        getInputElement(favoriteProjectsSize).val(value >= 7 ? 8 : 4).trigger('change');
                        rows[j].children[5].click();
                    } else {
                        rows[j].children[1].children[0].click();
                    }
                } else {
                    let isWorkThan8Hours = value > 8;
                    let normalWorkTime;
                    let overTime;
                    if (isWorkThan8Hours) {
                        normalWorkTime = 8;
                        overTime = (value - 8).toFixed(2);
                    } else {
                        normalWorkTime = value;
                        overTime = 0;
                    }
                    let usedTime = 0;
                    for (let k = 0; k < favoriteProjectsSize - 1; k++) {
                        let itemTime;
                        if (k !== favoriteProjectsSize - 1) {
                            itemTime = (normalWorkTime / (favoriteProjectsSize - 1)).toFixed(2);
                            usedTime += itemTime;
                        } else {
                            itemTime = (normalWorkTime - usedTime);
                        }
                        j++;
                        rows[j].children[6].click();
                        getInputElement(k + 1).val(itemTime).trigger('change');
                        rows[j].children[5].click();
                    }
                    j++;
                    if (overTime > 1) {
                        rows[j].children[6].click();
                        getInputElement(favoriteProjectsSize).val(overTime.toFixed(0)).trigger('change');
                        rows[j].children[5].click();
                    } else {
                        rows[j].children[1].children[0].click();
                    }
                }
            }
        }
    };

    //Main
    if (!isWTRSSystem()) {
        return;
    }
    console.log('当前插件工作模式为' + (workMode === DEVELOPER_WORK_MODE ? '开发模式' : 'QA模式'));
    console.log('喜欢的项目数量应为' + favoriteProjectsSize);
    registerAllMenu();
    addWorkButton();
})();