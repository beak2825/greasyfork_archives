// ==UserScript==
// @name         佣金辅助
// @namespace    http://ocrcloud.cn/
// @version      0.3
// @description  自动获取头条商品佣金信息 有bug请加qq 176737759
// @author       ada1984
// @match        *://temai.snssdk.com/*
// @grant        none
// @require      https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/31406/%E4%BD%A3%E9%87%91%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/31406/%E4%BD%A3%E9%87%91%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var clipboardDemos = new Clipboard('[data-clipboard-demo]'); clipboardDemos.on('success', function (e) { e.clearSelection(); console.info('Action:', e.action); console.info('Text:', e.text); console.info('Trigger:', e.trigger); showTooltip(e.trigger, 'Copied!'); }); clipboardDemos.on('error', function (e) { console.error('Action:', e.action); console.error('Trigger:', e.trigger); showTooltip(e.trigger, fallbackMessage(e.action)); });

var figures = document.querySelectorAll('#article > figure');

for (var i = 0; i < figures.length; i++) {
    var figure = figures[i]
    var vPrice = document.createElement("h2");
    var textPrice = figure.children[0].getAttribute("_price");
    vPrice.textContent = "价格: " + textPrice + "  ";
    var productLink = figure.children[0].getAttribute("_href");

    var vProductLink = document.createElement("a");
    vProductLink.setAttribute("href", productLink);
    vProductLink.setAttribute("target", "_blank");
    vProductLink.textContent = figure.children[0].textContent;

    var vClip = document.createElement("button");
    vClip.setAttribute("class", "btn");
    vClip.setAttribute("data-clipboard-text", productLink);
    vClip.setAttribute("data-clipboard-demo", "");
    vClip.setAttribute("data-clipboard-action", "copy");
    vClip.textContent = "拷贝到剪切板";

    figure.appendChild(vPrice);
    figure.appendChild(vProductLink);
    figure.appendChild(vClip);

}