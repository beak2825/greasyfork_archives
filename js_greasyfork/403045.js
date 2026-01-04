// ==UserScript==
// @name         dmhy-bangumi-current-season
// @name:zh-CN   动漫花园新番索引更新脚本
// @namespace    https://github.com/VegeHime/dmhy-bangumi-current-season
// @version      0.4.3
// @description  update data of new season bangumi on dmhy
// @description:zh-CN 更新动漫花园新番列表及搜索关键词
// @author       Masaiki
// @match        *://dmhy.org/*
// @match        *://www.dmhy.org/*
// @match        *://share.dmhy.org/*
// @match        *://dmhy.anoneko.com/*
// @match        *://dmhy.ye1213.com/*
// @match        *://share.dongmanhuayuan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403045/dmhy-bangumi-current-season.user.js
// @updateURL https://update.greasyfork.org/scripts/403045/dmhy-bangumi-current-season.meta.js
// ==/UserScript==

(function () {
    'use strict';
    Element.prototype.empty = function () {
        while (this.firstChild) this.removeChild(this.firstChild);
        return this;
    }
    function createElementWithAttr(TagName, Attrs = {}, Text = '') {
        let element = document.createElement(TagName);
        for (let attr in Attrs)
            element[attr] = Attrs[attr];
        element.textContent = Text;
        return element;
    }
    function loadJS(url, callback) {
        let script = document.createElement('script'),
            fn = callback || function () { };
        script.type = 'text/javascript';
        script.onload = function () {
            fn();
        };
        script.src = url;
        document.head.appendChild(script);
    }
    let ShowAllBangumi = localStorage.ShowAllBangumi !== "false";
    let today = new Date();
    let day = today.getDay();
    let trs = [];
    let panel = document.querySelector(".jmd");
    function data2doms() {
        trs = [];
        for (let i = 0; i < bangumi_data.length; i++) {
            let td = document.createElement('td');
            for (let j = 0; j < bangumi_data[i].length; j++) {
                if (bangumi_data[i][j][2] && today < new Date(bangumi_data[i][j][2])) continue;
                if (bangumi_data[i][j][3] && today > new Date(bangumi_data[i][j][3])) continue;
                let name = bangumi_data[i][j][0];
                let keyword = bangumi_data[i][j][1] || name;
                let link = createElementWithAttr('a', {
                    'href': `/topics/list?keyword=${encodeURIComponent(keyword)}`
                }, name);
                td.appendChild(link);
            }
            let tr = document.createElement('tr');
            let th = createElementWithAttr('th', null, bangumi_group_name[i]);
            tr.appendChild(th);
            tr.appendChild(td);
            trs.push(tr);
        }
        trs[day].classList.add('today');
    }
    function bangumiRefresh() {
        panel.empty();
        if (ShowAllBangumi)
            trs.forEach((item) => { panel.appendChild(item); });
        else {
            for (let i = 5; i <= 8; ++i)
                panel.appendChild(trs[(day + i) % 7]);
            for (let i = 7; i < bangumi_data.length; ++i)
                panel.appendChild(trs[i]);
        }
        panel.childNodes.forEach((item, index) => {
            if (index % 2) item.classList.add("odd");
            else item.classList.add("even");
        });
    }
    document.querySelector("div[id$='_ad']").removeAttribute('align');
    let DataURL = localStorage.DataURL || 'https://aliyun-wb-bai621pis7-klt02wd7.oss-cn-shanghai.aliyuncs.com/dmhy-bangumi-current-season-master/bangumi-data.js';
    loadJS(DataURL, function () {
        data2doms();
        bangumiRefresh();
    });
    let switchButton = createElementWithAttr('a', {
        'href': "javascript:;",
        'style': "margin-right:2px;"
    }, '顯示切換');
    switchButton.onclick = () => {
        ShowAllBangumi = !ShowAllBangumi;
        localStorage.ShowAllBangumi = ShowAllBangumi;
        bangumiRefresh();
    };
    let select = createElementWithAttr('select', { 'style': 'margin-right:2px; background-color:#247; color:#FFF' });
    select.onchange = (e) => {
        localStorage.DataURL = history_list.urls[select.selectedIndex];
        location.reload();
    };
    document.querySelector('.nav_title').style.paddingBottom = '5px';
    let block = document.querySelector('span.fr');
    block.insertBefore(switchButton, block.firstChild);
    block.insertBefore(select, block.firstChild);
    loadJS('https://aliyun-wb-bai621pis7-klt02wd7.oss-cn-shanghai.aliyuncs.com/dmhy-bangumi-current-season-master/history-list.js', function () {
        for (let i = 0; i < history_list.values.length; i++) {
            let option = createElementWithAttr('option', { 'value': history_list.values[i] }, history_list.names[i]);
            select.add(option);
        }
        let selectedIndex = history_list.urls.indexOf(DataURL);
        if (selectedIndex !== -1) select.value = history_list.values[selectedIndex];
    });
})();