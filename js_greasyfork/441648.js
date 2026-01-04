// ==UserScript==
// @name         colgThemeFilter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  使用正则表达式根据用户设置的关键词过滤主题
// @author       Genmaicha
// @license      MIT
// @match        https://bbs.colg.cn/forum*
// @icon         https://static.colg.cn/image/mobile/images/app-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441648/colgThemeFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/441648/colgThemeFilter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const searchUrl = "https://bbs.colg.cn/search.php?mod=forum_list&";

    var platformType;
    const platform = {
        "电脑版": {
            "userMenu": "#um",
            "threadList": "#threadlisttableid",
            "titleBlock": "tbody",
            "titleTag": ".s.xst",
            "newTitleBlock": ".newthread"
        },
        "触屏版": {
            "userMenu": ".footer",
            "threadList": ".threadlist",
            "titleBlock": "li",
            "titleTag": "a",
            "newTitleBlock": ""
        },
        "标准版": {
            "userMenu": ".pd2",
            "threadList": ".bm",
            "titleBlock": ".bm_c",
            "titleTag": "a",
            "newTitleBlock": ""
        }
    }
    const titleStyle = [{
        "id": "prefer",
        "head": "偏好主题",
        "styles": {
            "高亮": "background: #2B65B7;color: #fff;",
            "红色": "font-weight: bold;color: #EE1B2E;",
            "自定义": ""
        }
    }, {
        "id": "disgust",
        "head": "厌恶主题",
        "styles": {
            "删除线": "text-decoration-line: line-through;",
            "隐藏": "display: none;",
            "自定义": ""
        }
    }]

    Main();

    function Main() {
        checkPlatForm();
        createSettingAnchor();
        updateAllTheme();
        observeNewTheme();
    }

    function checkPlatForm() {
        for (let key in platform) {
            let queryStr = platform[key];
            let userMenu = document.querySelector(queryStr["userMenu"]);
            if (userMenu) {
                platformType = key;
                continue;
            }
        }
        if (!platformType) {
            alert("未识别平台类型，无法获取页面信息");
            return;
        }
        window.addEventListener('load', function() {
            if (platformType == "触屏版") {
                try {
                    // 简化界面
                    let callUpContainer = document.getElementById("callUpContainer");
                    callUpContainer.style.display = "none";
                    // 搜索选项
                    let logo = document.querySelector('.logo-icon');
                    logo.outerHTML = `<select>
                    <option value=3>全文</option>
                    <option value=4>标题</option>
                    <option value=2>用户</option>
                    </select>`
                    // 搜索框
                    let serchContainer = document.querySelector('.search-container');
                    serchContainer.removeAttribute('onclick');
                    serchContainer.style = "margin-left: 15px;";
                    let marquee = serchContainer.querySelector('.marquee');
                    marquee.style.display = 'none';
                    let input = serchContainer.querySelector('input');
                    input.type = "search";
                    input.addEventListener('search',onSearchButtonClick);
                } catch (e) {
                    window.console.log(e);
                }
            }
        })
    }

    async function onSearchButtonClick(e){
        let select = e.target.parentElement.previousElementSibling;
        let type = select.options[select.selectedIndex].value;
        let keyword = e.target.value;
        let url = searchUrl + `type=${type}&keyword=${keyword}`;
        window.location.href = url;
    }

    function createSettingAnchor() {
        let anchor = document.createElement('a');
        anchor.href = "javascript:void(0);";
        anchor.textContent = "主题过滤器";
        anchor.addEventListener('click', callDialog);
        let userMenu = document.querySelector((platform[platformType])["userMenu"]);
        let p = userMenu.querySelector('p');
        if (!p) {
            userMenu.appendChild(anchor);
            return;
        }
        p.appendChild(anchor);
    }

    function callDialog() {
        let userMenu = document.querySelector((platform[platformType])["userMenu"]);
        let dialog = userMenu.querySelector('dialog');
        if (!dialog) {
            let closeButton = document.createElement('button');
            closeButton.textContent = "x";
            closeButton.style = "position:absolute;top:0;right:0;border:none;";
            closeButton.addEventListener('click', closeDialog);
            let form = createSettingForm();
            dialog = document.createElement('dialog');
            dialog.appendChild(closeButton);
            dialog.appendChild(form);
            userMenu.appendChild(dialog);
        }
        if (typeof dialog.showModal != 'function') {
            alert("不支持dialog API,请升级你的浏览器");
            return;
        }
        dialog.showModal();
    }

    function createSettingForm() {
        let div = document.createElement('div');
        let setting = !localStorage.setting ? {} : JSON.parse(localStorage.setting);
        for (let item of titleStyle) {
            let ul = document.createElement('ul');
            ul.id = item.id;
            let headli = document.createElement('li');
            headli.innerHTML = item.head;
            ul.appendChild(headli);
            let selectli = document.createElement('li');
            let select = document.createElement('select');
            let subsetting = setting[item.id] || {};
            for (let key in item.styles) {
                let option = document.createElement('option');
                if (subsetting && subsetting.head && subsetting.head == key) {
                    option.setAttribute('selected', "");
                    option.value = subsetting.style;
                } else {
                    option.value = (item.styles)[key];
                }
                option.textContent = key;
                select.appendChild(option);
            }
            select.addEventListener('change', function(e) {
                let input = e.target.nextElementSibling;
                input.value = e.target.options[select.selectedIndex].value;
            });
            let input = document.createElement('input');
            input.size = 35;
            input.style = "margin-left:10px;"
            input.value = select.options[select.selectedIndex].value;
            selectli.appendChild(select);
            selectli.appendChild(input);
            ul.appendChild(selectli);
            let datali = document.createElement('li');
            let keyword = !subsetting ? "" : subsetting["keyword"];
            datali.innerHTML = `关键词</br><textarea rows="5" cols="50" placeholder="任意关键词1|关键词2|关键词3">${keyword}</textarea>`
            ul.appendChild(datali);
            div.appendChild(ul);
        }
        let p = document.createElement('p');
        p.style = "text-align: center;";
        p.appendChild(createButton("保存", onSaveButtonClick));
        p.appendChild(createButton("取消", closeDialog));
        div.appendChild(p);
        return div;
    }

    function createButton(text, event) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style = "margin-right:30px;";
        button.addEventListener('click', event);
        return button;
    }

    function onSaveButtonClick(e) {
        let p = e.target.parentElement;
        let div = p.parentElement;
        let uls = div.querySelectorAll('ul');
        let setting = {};
        for (let i = 0; i < uls.length; i++) {
            let ul = uls[i];
            let select = ul.querySelector('select');
            let input = ul.querySelector('input');
            let textarea = ul.querySelector('textarea');
            setting[ul.id] = {
                "head": select.options[select.selectedIndex].text,
                "style": input.value,
                "keyword": textarea.value
            }
        }
        localStorage.setting = JSON.stringify(setting);
        localStorage.themeRecord = "";
        closeDialog();
        alert("保存成功");
        updateAllTheme();
    }

    function closeDialog() {
        let dialog = document.querySelector('dialog');
        if (!dialog) {
            return;
        }
        dialog.close();
    }

    function updateAllTheme() {
        let threadList = document.querySelector((platform[platformType])["threadList"]);
        if (!threadList) {
            return;
        }
        let anchorParent = threadList.querySelectorAll((platform[platformType])["titleBlock"]);
        updateThemeStyle(anchorParent);
    }

    function observeNewTheme() {
        let threadList = document.querySelector((platform[platformType])["threadList"]);
        if(!threadList){
            return;
        }
        const config = { childList: true };
        const threadListOBS = new MutationObserver(updatePartTheme);
        threadListOBS.observe(threadList, config);
    }

    function updatePartTheme() {
        let threadList = document.querySelector((platform[platformType])["threadList"]);
        let anchorParent = threadList.querySelectorAll((platform[platformType])["newTitleBlock"]);
        if(!anchorParent){
            return;
        }
        updateThemeStyle(anchorParent);
    }

    function updateThemeStyle(anchorParent) {
        if (!localStorage.setting) {
            alert("请点击主题过滤器设置关键词");
            return;
        }
        let setting = JSON.parse(localStorage.setting);
        let themeRecord = !localStorage.themeRecord ? {} : JSON.parse(localStorage.themeRecord);
        for (let parent of anchorParent) {
            let anchor = parent.querySelector((platform[platformType])["titleTag"]);
            if (!anchor) {
                continue;
            }
            let id = anchor.href.match("\\d{2,}").toString();
            let title = anchor.textContent;
            if (themeRecord[id]) {
                anchor.style = themeRecord[id];
            } else {
                for (var key in setting) {
                    let subsetting = setting[key];
                    let keyword = subsetting["keyword"];
                    if (title.search(keyword) != -1) {
                        let style = subsetting["style"];
                        anchor.style = style;
                        themeRecord[id] = style;
                    }
                }
            }
            if (anchor.style.display == 'none') {
                block.style.display = 'none';
            }
        }
        localStorage.themeRecord = JSON.stringify(themeRecord);
    }

})();