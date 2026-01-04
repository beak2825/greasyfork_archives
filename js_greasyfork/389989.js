// ==UserScript==
// @name         Search Cross
// @namespace    https://github.com/saplf/search-cross
// @version      0.8
// @description  不同搜索引擎间的切换，自用
// @author       saplf
// @license      GPL-3.0
// @supportURL   https://github.com/saplf/search-cross
// @home-url     https://greasyfork.org/zh-CN/scripts/389989-search-cross
// @match        *://www.baidu.com/s?*
// @match        *://www.google.com/search?*
// @match        *://www.bing.com/search?*
// @match        *://www.so.com/s?*
// @match        *://github.com/search?*
// @match        *://www.zhihu.com/search?*
// @match        *://search.bilibili.com/*
// @match        *://zh.wikipedia.org/wiki/*
// @match        *://www.sogou.com/web?*
// @match        *://www.douban.com/search?*
// @match        *://mijisou.com/?*
// @match        *://duckduckgo.com/?*
// @match        *://s.taobao.com/search?*
// @note         2020.01.10-v0.3 修复github下样式问题
// @note         2020.06.29-v0.4 切换图标源，减小源码体积；添加中文维基
// @note         2020.06.29-v0.5 由于 Github 的安全策略，外部样式代码改由代码下载
// @note         2020.06.29-v0.6 添加部分搜索引擎
// @note         2020.07.27-v0.7 添加部分搜索引擎；添加设置面板
// @note         2020.09.28-v0.8 修复 Safari 浏览器不支持反向预查正则的 bug
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      at.alicdn.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389989/Search%20Cross.user.js
// @updateURL https://update.greasyfork.org/scripts/389989/Search%20Cross.meta.js
// ==/UserScript==

var config = {
    default: {
        position: 'left', // 'left' or 'right'
        height: 54,
        top: '120px',
        peekSize: 30,
        delayEnter: 120,
        delayLeave: 400,
        zIndex: 9999,
        triggleVer: '10px',
        triggleHor: '20px',
    },
    'www.google.com': {
        top: '140px',
    },
};

var engines = {
    'www.baidu.com': {
        name: '百度',
        icon: 'sc-baidu',
        url: 'https://www.baidu.com/s?wd={q}',
        match: /(?:wd=)([^&]+)(?=&|$)/,
    },
    'www.google.com': {
        name: 'Google',
        icon: 'sc-google',
        url: 'https://www.google.com/search?q={q}',
        match: /(?:q=)([^&]+)(?=&|$)/,
    },
    'www.bing.com': {
        name: 'Bing',
        icon: 'sc-bing',
        url: 'https://cn.bing.com/search?q={q}',
        match: /(?:q=)([^&]+)(?=&|$)/,
    },
    'github.com': {
        name: 'GitHub',
        icon: 'sc-github',
        url: 'https://github.com/search?q={q}',
        match: /(?:q=)([^&]+)(?=&|$)/,
    },
    'www.zhihu.com': {
        name: '知乎',
        icon: 'sc-zhihu',
        url: 'https://www.zhihu.com/search?q={q}',
        match: /(?:q=)([^&]+)(?=&|$)/,
    },
    'search.bilibili.com': {
        name: 'bilibili',
        icon: 'sc-bilibili',
        url: 'https://search.bilibili.com/all?keyword={q}',
        match: /(?:keyword=)([^&]+)(?=&|$)/,
    },
    'zh.wikipedia.org': {
        name: '维基中文',
        icon: 'sc-wiki',
        url: 'https://zh.wikipedia.org/wiki/{q}',
        match: /(?:wiki\/)([^?&]+)(?=&|$|\?)/,
    },
    'www.so.com': {
        name: '360',
        icon: 'sc-360',
        url: 'https://www.so.com/s?q={q}',
        match: /(?:q=)([^&]+)(?=&|$)/,
    },
    'www.sogou.com': {
        name: '搜狗',
        icon: 'sc-sougou',
        url: 'https://www.sogou.com/web?query={q}',
        match: /(?:query=)([^&]+)(?=&|$)/,
    },
    'www.douban.com': {
        name: '豆瓣',
        icon: 'sc-douban',
        url: 'https://www.douban.com/search?q={q}',
        match: /(?:q=)([^&]+)(?=&|$)/,
    },
    'mijisou.com': {
        name: '秘迹',
        icon: 'sc-mj',
        url: 'https://mijisou.com/?q={q}',
        match: /(?:q=)([^&]+)(?=&|$)/,
    },
    'duckduckgo.com': {
        name: 'Duck',
        icon: 'sc-ddg',
        url: 'https://duckduckgo.com/?q={q}',
        match: /(?:q=)([^&]+)(?=&|$)/,
    },
    's.taobao.com': {
        name: '淘宝',
        icon: 'sc-taobao',
        url: 'https://s.taobao.com/search?q={q}',
        match: /(?:q=)([^&]+)(?=&|$)/,
    },
};
var enginesArray = Object.entries(engines);

// var configCached = GM_getValue('config', config);
// GM_setValue('config', configCached);
// var setting = Object.assign(config.default, configCached.default, configCached[location.host]);
// engines = GM_getValue('sites', engines);
// GM_setValue('sites', engines);
var setting = config.default;

// 标记用于重置存储数据的计数量
var appClearCounter = 1;
var cacheClearCounter = GM_getValue('cacheClearCounter', 0);
var enabledSites;
if (cacheClearCounter < appClearCounter) {
    GM_setValue('cacheClearCounter', appClearCounter);
    enabledSites = enginesArray.map(function (it) { return it[0] });
} else {
    enabledSites = GM_getValue('enabledSites', enginesArray.map(function (it) { return it[0] }));
}

function appendStyles() {
    var isLeft = setting.position === 'left';
    var offsetSignal = isLeft ? '-' : '';
    GM_addStyle(`
#sc-panel {
  position: fixed;
  ${setting.position}: ${setting.peekSize}px;
  top: ${setting.top};
  padding: 0 20px 0 80px;
  transform: translate(${offsetSignal}100%, -50%);
  transition: all .2s;
  height: ${setting.height}px;
  border-radius: ${setting.height / 2}px;
  opacity: .6;
  background: red;
  z-index: ${setting.zIndex};

  display: flex;
  flex-direction: row;
  align-items: stretch;
}

#sc-panel.active {
  transform: translate(${offsetSignal}${setting.peekSize * 2}px, -50%);
  box-shadow: 0 0 10px rgba(255, 0, 0, .4);
  opacity: 1;
}

#sc-panel-triggle {
  position: absolute;
  left: -${isLeft ? 0 : setting.triggleHor};
  right: -${isLeft ? setting.triggleHor : 0};
  top: -${setting.triggleVer};
  bottom: -${setting.triggleVer};
  z-index: ${setting.zIndex - 1};
}

#sc-panel .sc-panel-item {
  position: relative;
  z-index: ${setting.zIndex + 1};
  color: white;
  font-size: 12px;
  box-sizing: content-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  transition: background .3s;
}

#sc-panel .sc-panel-item:hover {
  background: rgba(255, 255, 255, .2);
}

#sc-panel .scf {
  font-size: 2em;
  margin-bottom: 2px;
}

#sc-panel .scf-setting {
  position: absolute;
  top: 50%;
  left: 48px;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, .6);
  transition: all .2s;
  cursor: pointer;
  z-index: ${setting.zIndex + 1};
  padding: 4px;
  border-radius: 50%;
}

#sc-panel .scf-setting:hover {
  color: rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, .2);
}

#sc-panel .sc-setting {
  font-size: 1.4em;
}

#sc-panel-setting {
  z-index: ${setting.zIndex + 2};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, .6);
  opacity: 0;
  transition: opacity .2s;
}

#sc-panel-setting.active {
  opacity: 1;
}

#sc-panel-setting.none {
  display: none;
}

#sc-setting-box {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);

  width: 500px;
  height: 420px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.6);

  display: flex;
  flex-direction: column;
  align-items: stretch;
}

#sc-setting-box h3 {
  flex: 0 0 auto;

  box-sizing: border-box;
  font-weight: normal;
  font-size: x-large;
  padding: 16px 16px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

#sc-tab {
  flex-grow: 1;
  overflow: auto;
}

#sc-tab .sc-list {
  padding: 16px;
}

#sc-tab .sc-list li {
  padding: 8px 4px;
  display: flex;
  align-items: baseline;
  transition: background-color .2s;
}

#sc-tab .sc-list li:hover {
  background-color: rgba(0, 0, 0, .1);
}

#sc-tab .sc-list label {
  flex-grow: 1;
  display: inline-block;
  margin: 0 4px;
}

#sc-tab .sc-list .sc-name {
  margin-left: 2px;
}

#sc-setting-box .btn-panel {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 10px 16px;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
}

#sc-setting-box .btn-panel > * {
  margin: 0 4px;
}
`);
}

function appendPanel() {
    var body = document.body;
    if (!body) return;

    var panel = generateEle('div', {
        id: 'sc-panel',
        // className: 'active',
    });

    // panel triggle
    var triggle = generateEle('div', { id: 'sc-panel-triggle' });
    var timerEnter = null;
    var timerLeave = null;
    var funcEnter = function() { addClassName(panel, 'active'); };
    var funcLeave = function() { removeClassName(panel, 'active'); };
    panel.onmouseenter = function() {
        clearTimeout(timerLeave);
        timerEnter = setTimeout(funcEnter, setting.delayEnter);
    }
    panel.onmouseleave = function() {
        clearTimeout(timerEnter);
        timerLeave = setTimeout(funcLeave, setting.delayLeave);
    }
    panel.appendChild(triggle);

    // engines
    enginesArray.forEach(function(entry) {
        var key = entry[0];
        if (key === location.host || !enabledSites.includes(key)) return;
        var engine = entry[1];
        var ele = generateEle('a', {
            className: 'sc-panel-item',
            href: engine.url.replace(/\{q\}/, queryParam()),
        });
        var iconI = generateEle('i', { className: 'scf ' + engine.icon });
        var name = generateEle('span', { innerText: engine.name });
        ele.appendChild(iconI);
        ele.appendChild(name);
        panel.appendChild(ele);
    });

    // setting trigger
    var settingBox = generateEle('div', {
        className: 'scf-setting',
        onclick: showPanelSetting,
    });
    var settingIcon = generateEle('i', { className: 'scf sc-setting' });
    settingBox.appendChild(settingIcon);
    panel.appendChild(settingBox);

    body.appendChild(panel);
}

function appendPanelSetting() {
    var body = document.body;
    if (!body) return;

    var panel = document.getElementById('sc-panel-setting');
    if (panel) return;

    panel = generateEle('div', {
        id: 'sc-panel-setting',
        // className: 'active',
        onclick: hidePanelSetting,
    });

    panel.addEventListener('transitionend', function () {
        if (panel.getAttribute('hide')) {
            addClassName(panel, 'none');
        }
    });

    var box = generateEle('div', {
        id: 'sc-setting-box',
        onclick: function (e) { e.stopPropagation() },
    });

    var title = generateEle('h3', {
        innerText: '搜索引擎配置',
    });
    var settingTab = generateEle('div', { id: 'sc-tab' });

    var listBox = generateEle('ul', {
        className: 'sc-list',
    });
    enginesArray.forEach(function(entry, index) {
        var key = entry[0];
        var item = entry[1];
        var cusId = 'sc-check-' + index;
        var listItem = generateEle('li', {});

        var checkbox = generateEle('input', {
            className: 'sc-site-enabled',
            type: 'checkbox',
            name: key,
            id: cusId,
        });
        var label = generateEle('label', {});
        label.setAttribute('for', cusId);
        var icon = generateEle('i', { className: 'scf ' + item.icon });
        var name = generateEle('span', {
            className: 'sc-name',
            innerText: item.name,
        });
        var suffix = generateEle('a', {
            className: 'sc-href',
            target: '_blank',
            href: 'https://' + key,
            innerText: key,
        });

        label.appendChild(icon);
        label.appendChild(name);
        listItem.appendChild(checkbox);
        listItem.appendChild(label);
        listItem.appendChild(suffix);
        listBox.appendChild(listItem);
    });
    settingTab.appendChild(listBox);

    var buttonPanel = generateEle('div', { className: 'btn-panel' });
    var hint = generateEle('span', {
        innerText: '保存后刷新生效',
    });
    var saveBtn = generateEle('button', {
        innerText: '仅保存',
        onclick: function () {
            storeEnabledSites(panel);
            hidePanelSetting();
        },
    });
    var refreshBtn = generateEle('button', {
        innerText: '保存并刷新',
        onclick: function () {
            storeEnabledSites(panel);
            hidePanelSetting();
            location.reload();
        },
    });
    buttonPanel.appendChild(hint);
    buttonPanel.appendChild(saveBtn);
    buttonPanel.appendChild(refreshBtn);

    box.appendChild(title);
    box.appendChild(settingTab);
    box.appendChild(buttonPanel);
    panel.appendChild(box);
    body.appendChild(panel);
    return panel;
}

function assignEnabledSites(panel) {
    var list = panel.getElementsByClassName('sc-site-enabled');
    for (var i = 0; i < list.length; i++) {
        var input = list[i];
        input.checked = enabledSites.includes(input.name);
    }
}

function storeEnabledSites(panel) {
    var list = panel.getElementsByClassName('sc-site-enabled');
    var results = [];
    for (var i = 0; i < list.length; i++) {
        var input = list[i];
        if (input.checked) {
            results.push(input.name);
        }
    }
    GM_setValue('enabledSites', results);
}

function showPanelSetting() {
    var panel = document.getElementById('sc-panel-setting');
    if (!panel) {
        panel = appendPanelSetting();
    }
    assignEnabledSites(panel);
    panel.setAttribute('hide', '');
    removeClassName(panel, 'none');
    setTimeout(function () {
        addClassName(panel, 'active');
    }, 0);
}

function hidePanelSetting() {
    var panel = document.getElementById('sc-panel-setting');
    if (!panel) {
        panel = appendPanelSetting();
    }
    panel.setAttribute('hide', '1');
    removeClassName(panel, 'active');
}

function generateEle(name, properties) {
    var ele = document.createElement(name);
    Object.entries(properties).forEach(function(it) {
        ele[it[0]] = it[1];
    });
    return ele;
}

function addClassName(ele, name) {
    var classes = (ele.className || '').split(' ').filter(function (it) { return it });
    if (!classes.includes(name)) {
        classes.push(name);
    }
    ele.className = classes.join(' ');
}

function removeClassName(ele, name) {
    var classes = (ele.className || '')
        .split(' ')
        .filter(function (it) { return it && it !== name });
    ele.className = classes.join(' ');
}

function toggleClassName(ele, name) {
    var classes = (ele.className || '')
        .split(' ')
        .filter(function (it) { return it });
    if (classes.includes(name)) {
        classes = classes.filter(function (it) { return it && it !== name });
    } else {
        classes.push(name);
    }
    ele.className = classes.join(' ');
}

function queryParam() {
    var current = engines[location.host];
    if (!current) return '';
    var result = location.href.match(current.match);
    return result && (result[1] || result[0]);
}

function appendExtraCss(url) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload(args) {
            GM_addStyle(args.responseText);
        },
    });
}

(function() {
    'use strict';
    if (!enabledSites.includes(location.host)) return;

    appendStyles();
    appendPanel();
    appendExtraCss('//at.alicdn.com/t/font_1911184_1ib7wqdqydk.css');
})();
