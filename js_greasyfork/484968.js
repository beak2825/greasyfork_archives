// ==UserScript==
// @name         B站顶部栏 - 旧版历史的分类样式
// @namespace    mscststs
// @version      1.1
// @license      ISC
// @description  修改新版顶部栏历史的分类样式
// @author       mscststs
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484968/B%E7%AB%99%E9%A1%B6%E9%83%A8%E6%A0%8F%20-%20%E6%97%A7%E7%89%88%E5%8E%86%E5%8F%B2%E7%9A%84%E5%88%86%E7%B1%BB%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/484968/B%E7%AB%99%E9%A1%B6%E9%83%A8%E6%A0%8F%20-%20%E6%97%A7%E7%89%88%E5%8E%86%E5%8F%B2%E7%9A%84%E5%88%86%E7%B1%BB%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = document.URL;

    if(url.startsWith("https://space.bilibili.com/") || url.startsWith("https://www.bilibili.com/v/") || url.startsWith("https://www.bilibili.com/video/") || url.startsWith("https://search.bilibili.com/") || url.startsWith("https://www.bilibili.com/bangumi/play/") || url.startsWith("https://live.bilibili.com/") || url.startsWith("https://www.bilibili.com/c/") || url.startsWith("https://www.bilibili.com/bangumi/media/") || url.startsWith("https://www.bilibili.com/watchlater/")) {
        StartObservePanel();
        async function StartObservePanel(){
            function addPanel(index) {
                var panelElement = document.querySelectorAll(".history-panel-popover .header-tabs-panel__item")[index];
                var panelContent = panelElement.innerHTML;
                if(!panelContent.match(/历史/)) {
                    panelContent += "历史";
                    panelElement.innerHTML = panelContent;
                    //alert(panelContent);
                }
            }

            function subPanel() {
                var panelElements = document.querySelectorAll(".history-panel-popover .header-tabs-panel__item");
                for (var i = 0; i < panelElements.length; i++) {
                    var panelContent = panelElements[i].innerHTML;
                    if(panelContent.match(/历史/)) {
                        panelElements[i].innerHTML = panelContent.substring(0, 2);
                    }
                }
            }

            function operatePanel(Panel, index) {
                var Content = Panel.innerHTML;
                if(!Content.match(/历史/)) {
                    subPanel();
                    addPanel(index);
                }
            }

            await mscststs.wait(".history-panel-popover .header-tabs-panel__item");
            addPanel(0);

            var entryText = document.querySelectorAll(".bili-header .right-entry__outside")[5];
            entryText.addEventListener('mouseover', function() {
                //alert(123);
                subPanel();
                addPanel(0);
            });

            var viedoIndex = 0;
            var viedoPanel = document.querySelectorAll(".history-panel-popover .header-tabs-panel__item")[viedoIndex];
            viedoPanel.onclick = function() {
                operatePanel(viedoPanel, viedoIndex);
            }

            var liveIndex = 1;
            var livePanel = document.querySelectorAll(".history-panel-popover .header-tabs-panel__item")[liveIndex];
            livePanel.onclick = function() {
                operatePanel(livePanel, liveIndex);
            }

            var columnIndex = 2;
            var columnPanel = document.querySelectorAll(".history-panel-popover .header-tabs-panel__item")[columnIndex];
            columnPanel.onclick = function() {
                operatePanel(columnPanel, columnIndex);
            }
        }
    }
})();