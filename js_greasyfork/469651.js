// ==UserScript==
// @name         s1体验优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @match        https://www.saraba1st.com/*
// @description  去除一些不想看到的东西
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469651/s1%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469651/s1%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取用户设置
    var removeSearchBox = GM_getValue('removeSearchBox', true);
    var removeRecommendTopics = GM_getValue('removeRecommendTopics', true);
    var removeSections = GM_getValue('removeSections', true);
    var removeThread = GM_getValue('removeThread', true);

    // 创建设置弹窗
    function createSettingsPopup() {
        // 创建弹窗容器
        var popupContainer = document.createElement('div');
        popupContainer.id = 'remove-elements-settings-popup';

        // 创建父容器
        var titlecontainer = document.createElement('div');
        titlecontainer.style.display = 'flex';
        titlecontainer.style.flexDirection = 'row';
        titlecontainer.style.justifyContent = 'space-between';
        titlecontainer.style.alignItems = 'center';

        // 创建标题
        var title = document.createElement('h3');
        title.textContent = '设置';

        // 创建复选框和标签
        var searchBoxCheckbox = createCheckbox('remove-search-box', '移除搜索', removeSearchBox);
        var recommendTopicsCheckbox = createCheckbox('remove-recommend-topics', '移除推荐', removeRecommendTopics);
        var sectionsCheckbox = createCheckbox('remove-sections', '移除分区', removeSections);
        var ThreadCheckbox = createCheckbox('remove-Thread', '移除分类', removeThread);

        // 创建保存按钮
        var saveButton = document.createElement('button');
        saveButton.textContent = '保存设置';
        saveButton.addEventListener('click', saveSettings);
        saveButton.style.alignItems

        //创建关闭按钮
        var closeButton = document.createElement('closebutton');
        closeButton.textContent = '✖';
        closeButton.addEventListener('click', closeSettingsPopup);

        // 添加元素到弹窗容器
        titlecontainer.appendChild(title);
        titlecontainer.appendChild(closeButton);
        popupContainer.appendChild(titlecontainer);
        popupContainer.appendChild(searchBoxCheckbox);
        popupContainer.appendChild(recommendTopicsCheckbox);
        popupContainer.appendChild(sectionsCheckbox);
        popupContainer.appendChild(ThreadCheckbox);
        popupContainer.appendChild(saveButton);

        // 添加弹窗样式
        GM_addStyle(`
            #remove-elements-settings-popup {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: white;
                border: 1px solid #ccc;
                padding: 20px;
                z-index: 9999;
            }
            #remove-elements-settings-popup h3 {
                font-size: 18px;
                margin-bottom: 10px;
            }
            #remove-elements-settings-popup label {
                display: block;
                margin-bottom: 10px;
            }
            #remove-elements-settings-popup button {
                padding: 5px 10px;
                background-color: #4caf50;
                color: white;
                border: none;
                cursor: pointer;
            }
            #remove-elements-settings-popup closebutton {
                padding: 1px 5px;
                background-color: black;
                color: white;
                border: none;
                cursor: pointer;
                margin-bottom: 10px;
                border-radius: 50%;
            }
        `);

        // 插入弹窗容器到页面
        document.body.appendChild(popupContainer);
    }

    // 创建复选框
    function createCheckbox(id, label, checked) {
        var checkbox = document.createElement('input');
        checkbox.id = id;
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.style.margin = '0';
        checkbox.style.marginRight = '15px';
        checkbox.style.verticalAlign = 'middle';

        var checkboxLabel = document.createElement('label');
        checkboxLabel.setAttribute('for', id);
        checkboxLabel.textContent = label;
        checkboxLabel.style.margin = '0';
        checkboxLabel.style.marginRight = '15px';
        checkboxLabel.style.verticalAlign = 'middle';

        var container = document.createElement('div');
        container.appendChild(checkbox);
        container.appendChild(checkboxLabel);
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginBottom = '10px';

        container.appendChild(checkbox);
        container.appendChild(checkboxLabel);

        return container;
    }

    // 保存设置
    function saveSettings() {
        removeSearchBox = document.getElementById('remove-search-box').checked;
        removeRecommendTopics = document.getElementById('remove-recommend-topics').checked;
        removeSections = document.getElementById('remove-sections').checked;
        removeThread = document.getElementById('remove-Thread').checked;

        GM_setValue('removeSearchBox', removeSearchBox);
        GM_setValue('removeRecommendTopics', removeRecommendTopics);
        GM_setValue('removeSections', removeSections);
        GM_setValue('removeThread', removeSections);

        closeSettingsPopup();
        location.reload();
    }

    // 关闭设置弹窗
    function closeSettingsPopup() {
        var popupContainer = document.getElementById('remove-elements-settings-popup');
        if (popupContainer) {
            popupContainer.parentNode.removeChild(popupContainer);
        }
    }

    // 显示设置弹窗
    function showSettingsPopup() {
        closeSettingsPopup();
        createSettingsPopup();
    }

    // 添加设置菜单
    GM_registerMenuCommand('Open Remove Elements Settings', showSettingsPopup);

    // 根据用户设置进行移除
    if (removeSearchBox) {
        removeSearchBoxElement();
    }
    if (removeRecommendTopics) {
        removeRecommendTopicsElement();
    }
    if (removeSections) {
        removeSectionsElement();
    }
    if (removeThread) {
        removeThreadElement();
    }



    // 移除搜索框
    function removeSearchBoxElement() {
        var searchBox = document.querySelector('#scbar');
        if (searchBox) {
            searchBox.parentNode.removeChild(searchBox);
        }
    }

    // 移除推荐主题
    function removeRecommendTopicsElement() {
        var recommendTopics = document.querySelector('.bmw');
        if (recommendTopics) {
            recommendTopics.parentNode.removeChild(recommendTopics);
        }
    }

    // 移除分区
    function removeSectionsElement() {
        var sections = document.querySelector('.bml');
        if (sections) {
            sections.parentNode.removeChild(sections);
        }
    }
        // 移除分类
    function removeThreadElement() {
        var sections = document.querySelector('#thread_types');
        if (sections) {
            sections.parentNode.removeChild(sections);
        }
    }



    // 创建打开设置按钮
    var openSettingsButton = document.createElement('button');
    openSettingsButton.textContent = '⚙️';
    openSettingsButton.style.backgroundColor = 'transparent';
    openSettingsButton.style.color = 'white';
    openSettingsButton.style.border = 'none';
    openSettingsButton.style.cursor = 'pointer';
    openSettingsButton.addEventListener('click', openSettings);

    var toptbElement = document.querySelector('#toptb');

    // 添加打开设置按钮到页面
    if (toptbElement) {
        toptbElement.appendChild(openSettingsButton);
    }

    // 打开脚本设置
    function openSettings() {
        createSettingsPopup();
    }

})();
