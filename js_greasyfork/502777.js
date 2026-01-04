// ==UserScript==
// @name         Xuanwu Helper
// @namespace    http://tampermonkey.net/
// @version      2024-08-06
// @description  Make xuanhu easier to use.
// @author       wuhua
// @match        https://boss.amh-group.com/sec-xuanwu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amh-group.com
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.12/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.12/plugin/customParseFormat.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.12/plugin/localeData.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502777/Xuanwu%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/502777/Xuanwu%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    dayjs.extend(window.dayjs_plugin_customParseFormat)
    dayjs.extend(window.dayjs_plugin_localeData)
    // Your code here...
    // Default refresh interval (in seconds)
    // watch refreshInterval from localStorage
    let refreshInterval = 60;
    let selectedPreset;
    let menu;
    let menuState = false;
    let hoverball;
    let hoverballState = false;
    // 初始化当前URL
    let currentUrl = window.location.href;

    // 页面加载时运行一次
    handleUrlChange(currentUrl);

    // 创建一个MutationObserver来监听URL变化
    const observer = new MutationObserver(() => {
        if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            handleUrlChange(currentUrl);
        }
    });

    // 配置观察器并观察document.body
    observer.observe(document.body, { childList: true, subtree: true });

    // 函数：在URL匹配时运行脚本
    function handleUrlChange(url) {
        if (url.includes('/dynamicPreception/alertManager')) {
            // 在匹配的页面上运行脚本
            runScript();
        } else {
            // 执行清理操作
            cleanupScript();
        }
    }

    // 实际运行脚本的函数
    function runScript() {
        // Create the hoverball
        createHoverball();
    }

    // 清理脚本的函数
    function cleanupScript() {
        closeMenu();
        closeHoverball();
    }

    const savedInterval = localStorage.getItem('refreshInterval');
    if (savedInterval) {
        refreshInterval = parseInt(savedInterval);
    }
    // Function to refresh the page
    function refreshPage() {
        const refershButton = document.querySelector('#app > section > section > main > form > div:nth-child(4) > div > button:nth-child(5)')
        refershButton.click();
    }
    // get react handler from elementId
    function getReactHandlerById(elementId) {
        const element = document.getElementById(elementId);
        const handlerName = getReactHandlerKey(element);
        return element[handlerName];
    }

    // get react handler from selector
    function getReactHandlerBySelector(selector) {
        const element = document.querySelector(selector);
        const handlerName = getReactHandlerKey(element);
        return element[handlerName];
    }


    function getReactHandlerKey(element) {
        return Object.keys(element).find(key => key.startsWith('__reactEventHandlers'));

    }

    // read dropdown value from this page.
    // each preset is a key-value pair
    // user can save many preset by naming them
    // user can load the preset by selecting the name from dropdown
    function readPresetFromPage() {
        const preset = {};
        // ask user to name the preset
        const presetName = prompt('输入预设名称');
        if (!presetName) {
            return;
        }
        preset[presetName] = {};
        // read rule id
        const ruleIdHandlers = getReactHandlerById('alert-manager-form_ruleId');
        const ruleId = ruleIdHandlers.children._owner.memoizedState.value[0];
        if (ruleId !== undefined) {
            preset[presetName].ruleId = ruleId;
        }
        // read rule risk
        const ruleRiskHandlers = getReactHandlerBySelector('#app > section > section > main > form > div:nth-child(1) > div:nth-child(2) > div > div.ant-col.ant-form-item-control-wrapper > div > span > span')
        const ruleRisk = ruleRiskHandlers.children[0]._owner.child.memoizedState.value
        if (ruleRisk.length > 0) {
            preset[presetName].ruleRisk = ruleRisk;
        }
        // read alarm description
        const alarmDescriptionHandlers = getReactHandlerById('alert-manager-form_alarmDesc');
        const alarmDescription = alarmDescriptionHandlers.value;
        if (alarmDescription) {
            preset[presetName].alarmDescription = alarmDescription;
        }
        // read risk level
        const riskLevelHandlers = getReactHandlerBySelector('#alert-manager-form_riskLevel > div > div');
        const riskLevel = riskLevelHandlers.children[0]._owner.memoizedState.value;
        if (riskLevel.length > 0) {
            preset[presetName].riskLevel = riskLevel;
        }
        // read sourceIpList
        const sourceIPListHandlers = getReactHandlerById('alert-manager-form_sourceIpList');
        const sourceIpList = sourceIPListHandlers.value;
        if (sourceIpList) {
            preset[presetName].sourceIpList = sourceIpList;
        }
        // read destIpList
        const destIpListHandlers = getReactHandlerById('alert-manager-form_destIpList');
        const destIpList = destIpListHandlers.value;
        if (destIpList) {
            preset[presetName].destIpList = destIpList;
        }
        // read attack result
        const attackResultHandlers = getReactHandlerBySelector('#alert-manager-form_isEffectiveAlarm > div > div');
        const attackResult = attackResultHandlers.children[0]._owner.memoizedState.value;
        if (attackResult.length > 0) {
            preset[presetName].attackResult = attackResult;
        }
        // read manage status
        const manageStatusHandlers = getReactHandlerBySelector('#alert-manager-form_manageStatus > div > div');
        const manageStatus = manageStatusHandlers.children[0]._owner.memoizedState.value;
        if (manageStatus.length > 0) {
            preset[presetName].manageStatus = manageStatus;
        }
        // read dataSourceIdList
        const dataSourceIdListHandlers = getReactHandlerById('alert-manager-form_dataSourceIdList');
        const dataSourceIdList = dataSourceIdListHandlers.children._owner.memoizedState.value;
        if (dataSourceIdList.length > 0) {
            preset[presetName].dataSourceIdList = dataSourceIdList;
        }
        // read alarmUser
        const alarmUserHandlers = getReactHandlerById('alert-manager-form_alarmUser');
        const alarmUser = alarmUserHandlers.value;
        if (alarmUser) {
            preset[presetName].alarmUser = alarmUser;
        }
        // read alarmType
        const alarmTypeHandlers = getReactHandlerBySelector('#alert-manager-form_alarmType > div > div');
        const alarmType = alarmTypeHandlers.children[0]._owner.memoizedState.value;
        if (alarmType.length > 0) {
            preset[presetName].alarmType = alarmType;
        }
        // read onGuardList
        const onGuardListHandlers = getReactHandlerBySelector('#alert-manager-form_onGuardList > div > div');
        const onGuardList = onGuardListHandlers.children[0]._owner.memoizedState.value;
        if (onGuardList.length > 0) {
            preset[presetName].onGuardList = onGuardList;
        }
        // // read alarmTimeList
        // const alarmTimeListHandlers = getReactHandlerBySelector('#alert-manager-form_alarmTimeList > span')
        // const alarmTimeList = alarmTimeListHandlers.children[0]._owner.memoizedState.value;
        // if (alarmTimeList.length > 0) {
        //     preset[presetName].alarmTimeList = alarmTimeList;
        // }
        // localStorage.setItem('preset', JSON.stringify(preset));
        return preset;
    }

    function loadPreset(preset) {
        // load the preset to the page
        // set rule id
        const ruleIdHandlers = getReactHandlerById('alert-manager-form_ruleId');
        ruleIdHandlers.children._owner.memoizedProps.onChange(preset.ruleId);
        // set risk id
        const ruleRiskHandlers = getReactHandlerBySelector('#app > section > section > main > form > div:nth-child(1) > div:nth-child(2) > div > div.ant-col.ant-form-item-control-wrapper > div > span > span')
        ruleRiskHandlers.children[0]._owner.child.memoizedProps.onChange(preset.ruleRisk, [{ __IS_FILTERED_OPTION: false }])
        // set alarm description
        const alarmDescriptionHandlers = getReactHandlerById('alert-manager-form_alarmDesc');
        alarmDescriptionHandlers.onChange({ target: { value: preset.alarmDescription } });
        // set risk level
        const riskLevelHandlers = getReactHandlerBySelector('#alert-manager-form_riskLevel > div > div');
        riskLevelHandlers.children[0]._owner.memoizedProps.onChange(preset.riskLevel);
        // set sourceIpList
        const sourceIPListHandlers = getReactHandlerById('alert-manager-form_sourceIpList');
        sourceIPListHandlers.onChange({ target: { value: preset.sourceIpList } });
        // set destIpList
        const destIpListHandlers = getReactHandlerById('alert-manager-form_destIpList');
        destIpListHandlers.onChange({ target: { value: preset.destIpList } });
        // set attack result
        const attackResultHandlers = getReactHandlerBySelector('#alert-manager-form_isEffectiveAlarm > div > div');
        attackResultHandlers.children[0]._owner.memoizedProps.onChange(preset.attackResult);
        // set manage status
        const manageStatusHandlers = getReactHandlerBySelector('#alert-manager-form_manageStatus > div > div');
        manageStatusHandlers.children[0]._owner.memoizedProps.onChange(preset.manageStatus);
        // set dataSourceIdList
        const dataSourceIdListHandlers = getReactHandlerById('alert-manager-form_dataSourceIdList');
        dataSourceIdListHandlers.children._owner.memoizedProps.onChange(preset.dataSourceIdList);
        // set alarmUser
        const alarmUserHandlers = getReactHandlerById('alert-manager-form_alarmUser');
        alarmUserHandlers.onChange({ target: { value: preset.alarmUser } });
        // set alarmType
        const alarmTypeHandlers = getReactHandlerBySelector('#alert-manager-form_alarmType > div > div');
        alarmTypeHandlers.children[0]._owner.memoizedProps.onChange(preset.alarmType);
        // set onGuardList
        const onGuardListHandlers = getReactHandlerBySelector('#alert-manager-form_onGuardList > div > div');
        onGuardListHandlers.children[0]._owner.memoizedProps.onChange(preset.onGuardList);
        // // set alarmTimeList
        // const alarmTimeListHandlers = getReactHandlerBySelector('#alert-manager-form_alarmTimeList > span')

    }

    function createNotification(message) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '50px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#000';
        notification.style.color = '#fff';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        notification.innerHTML = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    function createHoverball() {
        hoverball = document.createElement('div');
        hoverball.style.position = 'fixed';
        hoverball.style.bottom = '20px';
        hoverball.style.right = '20px';
        hoverball.style.width = '50px';
        hoverball.style.height = '50px';
        hoverball.style.borderRadius = '50%';
        hoverball.style.backgroundColor = '#ff5733';
        hoverball.style.color = 'white';
        hoverball.style.textAlign = 'center';
        hoverball.style.lineHeight = '50px';
        hoverball.style.cursor = 'pointer';
        hoverball.style.zIndex = '9999';
        hoverball.innerHTML = '⚙️';
        document.body.appendChild(hoverball);
        hoverballState = true;
        hoverball.addEventListener('click', () => {
            // close the settings menu if it's already open
            if (!window.location.href.includes('/dynamicPreception/alertManager')) {

                createNotification('请在告警管理页面使用');
                closeHoverball();
                return;
            }
            if (menuState) {
                closeMenu();
                return;
            }
            showSettingsMenu();
            menuState = true;
        });
    }
    function closeMenu() {
        if (!menuState)
            return;
        document.body.removeChild(menu);
        menuState = false;
    }
    function closeHoverball() {
        if (!hoverballState)
            return;
        document.body.removeChild(hoverball);
        hoverballState = false;
    }
    function savePreset() {
        // read dropdown value from this page
        const dropdown = document.querySelector('select');

    }
    // make menu global so we can close it from outside

    function showSettingsMenu() {
        menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.bottom = '80px';
        menu.style.right = '20px';
        menu.style.width = '250px';
        menu.style.padding = '10px';
        menu.style.backgroundColor = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
        menu.style.zIndex = '9999';
        const title = document.createElement('h3');
        title.innerHTML = '设置';
        title.style.marginBottom = '10px';
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.gap = '20px'; // 设置按钮之间的间距
        // a button can save the dropdown value of this page
        const savePresetButton = document.createElement('button');
        savePresetButton.innerHTML = '保存预设';
        savePresetButton.style.width = '40%';
        savePresetButton.style.padding = '10px';
        savePresetButton.style.backgroundColor = '#ff5733';
        savePresetButton.style.color = '#fff';
        savePresetButton.style.border = 'none';
        savePresetButton.style.cursor = 'pointer';
        savePresetButton.style.marginBottom = '10px';
        savePresetButton.style.marginRight = 'auto';

        savePresetButton.addEventListener('click', () => {
            const userPreset = readPresetFromPage();
            // append userPreset to localStorage
            const preset = JSON.parse(localStorage.getItem('preset')) || {};
            const newPreset = { ...preset, ...userPreset };
            localStorage.setItem('preset', JSON.stringify(newPreset));
            createNotification(`预设 ${Object.keys(userPreset)[0]} 已保存`);
            closeMenu();
        });
        menu.appendChild(title);
        // a dropdown can load the preset value of this page
        const loadPresetDropdown = document.createElement('select');
        loadPresetDropdown.style.width = '100%';
        loadPresetDropdown.style.padding = '10px';
        loadPresetDropdown.style.marginBottom = '10px';
        const preset = JSON.parse(localStorage.getItem('preset')) || {};
        for (const key in preset) {
            const option = document.createElement('option');
            option.value = key;
            option.innerHTML = key;
            loadPresetDropdown.appendChild(option);
        }
        loadPresetDropdown.addEventListener('change', (e) => {
            selectedPreset = preset[e.target.value];
        });
        selectedPreset = preset[loadPresetDropdown.value];
        menu.appendChild(loadPresetDropdown);
        // a button can load the dropdown value of this page
        const loadPresetButton = document.createElement('button');
        loadPresetButton.innerHTML = '加载预设';
        loadPresetButton.style.width = '40%';
        loadPresetButton.style.padding = '10px';
        loadPresetButton.style.backgroundColor = '#ff5733';
        loadPresetButton.style.color = '#fff';
        loadPresetButton.style.border = 'none';
        loadPresetButton.style.cursor = 'pointer';
        loadPresetButton.style.marginBottom = '10px';
        loadPresetButton.style.marginLeft = 'auto';
        loadPresetButton.addEventListener('click', () => {
            loadPreset(selectedPreset);
            createNotification(`预设 ${loadPresetDropdown.value} 已加载`);
            closeMenu();
        });
        buttonContainer.appendChild(loadPresetButton);
        buttonContainer.appendChild(savePresetButton);

        menu.appendChild(buttonContainer);
        // add delete preset button and clear all preset button in one row
        const clearButtonContainer = document.createElement('div');
        clearButtonContainer.style.display = 'flex';
        clearButtonContainer.style.justifyContent = 'center';
        clearButtonContainer.style.alignItems = 'center';
        clearButtonContainer.style.gap = '20px'; // 设置按钮之间的间距
        const deletePresetButton = document.createElement('button');
        deletePresetButton.innerHTML = '删除预设';
        deletePresetButton.style.width = '40%';
        deletePresetButton.style.padding = '10px';
        deletePresetButton.style.backgroundColor = '#ff5733';
        deletePresetButton.style.color = '#fff';
        deletePresetButton.style.border = 'none';
        deletePresetButton.style.cursor = 'pointer';
        deletePresetButton.style.marginBottom = '10px';
        deletePresetButton.style.marginLeft = 'auto';
        deletePresetButton.addEventListener('click', () => {
            const preset = JSON.parse(localStorage.getItem('preset')) || {};
            const newPreset = Object.keys(preset).reduce((acc, key) => {
                if (key !== loadPresetDropdown.value) {
                    acc[key] = preset[key];
                }
                return acc;
            }, {});
            localStorage.setItem('preset', JSON.stringify(newPreset));
            createNotification(`预设 ${loadPresetDropdown.value} 已删除`);
            closeMenu();
        });
        clearButtonContainer.appendChild(deletePresetButton);
        const clearAllPresetButton = document.createElement('button');
        clearAllPresetButton.innerHTML = '清空预设';
        clearAllPresetButton.style.width = '40%';
        clearAllPresetButton.style.padding = '10px';
        clearAllPresetButton.style.backgroundColor = '#ff5733';
        clearAllPresetButton.style.color = '#fff';
        clearAllPresetButton.style.border = 'none';
        clearAllPresetButton.style.cursor = 'pointer';
        clearAllPresetButton.style.marginBottom = '10px';
        clearAllPresetButton.style.marginRight = 'auto';
        clearAllPresetButton.addEventListener('click', () => {
            localStorage.removeItem('preset');
            createNotification('所有预设已清空');
            closeMenu();
        }
        );
        clearButtonContainer.appendChild(clearAllPresetButton);
        menu.appendChild(clearButtonContainer);



        // 创建包含label和checkbox的容器
        const checkboxContainer = document.createElement('div');
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.alignItems = 'center';
        checkboxContainer.style.marginBottom = '10px'; // 设置底部边距，使其与其他元素保持一致

        // 创建启用自动刷新标签
        const enableAutoRefreshLabel = document.createElement('label');
        enableAutoRefreshLabel.innerHTML = '启用自动刷新';
        enableAutoRefreshLabel.style.marginRight = '5px'; // 设置右侧边距，使其与checkbox保持一些距离
        checkboxContainer.appendChild(enableAutoRefreshLabel);

        // 创建启用自动刷新的复选框
        const enableAutoRefreshCheckbox = document.createElement('input');
        enableAutoRefreshCheckbox.type = 'checkbox';
        enableAutoRefreshCheckbox.checked = refreshInterval > 0;
        checkboxContainer.appendChild(enableAutoRefreshCheckbox);

        // 将容器添加到菜单中
        menu.appendChild(checkboxContainer);
        const refreshIntervalLabel = document.createElement('label');
        refreshIntervalLabel.innerHTML = '刷新间隔(秒)';
        refreshIntervalLabel.style.display = 'block';
        refreshIntervalLabel.style.marginBottom = '5px';
        menu.appendChild(refreshIntervalLabel);
        const input = document.createElement('input');
        input.type = 'number';
        input.value = refreshInterval;
        input.style.width = '100%';
        input.style.marginBottom = '10px';

        // create a checkbox to enable/disable the auto-refresh
        const saveButton = document.createElement('button');
        saveButton.innerHTML = '保存配置';
        saveButton.style.width = '50%';
        saveButton.style.padding = '10px';
        saveButton.style.backgroundColor = '#ff5733';
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.cursor = 'pointer';

        saveButton.addEventListener('click', () => {
            refreshInterval = parseInt(input.value);
            if (!enableAutoRefreshCheckbox.checked) {
                localStorage.setItem('refreshInterval', -1);
                refreshInterval = -1;
                clearInterval(refreshTimer);
            } else {
                if (isNaN(refreshInterval)) {
                    createNotification('无效的刷新间隔');
                    return;
                }
                if (refreshInterval < 10) {
                    createNotification('刷新间隔必须大于10秒');
                    return;
                }
                localStorage.setItem('refreshInterval', refreshInterval);
                refreshInterval = parseInt(input.value);
                clearInterval(refreshTimer);
                refreshTimer = setInterval(refreshPage, refreshInterval * 1000);
            }


            closeMenu();
            createNotification('配置已保存');
        });

        menu.appendChild(input);
        menu.appendChild(saveButton);
        document.body.appendChild(menu);
    }




    // Start the refresh timer
    if (refreshInterval > 0) {
        var refreshTimer = setInterval(refreshPage, refreshInterval * 1000);
    }
})();