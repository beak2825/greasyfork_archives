// ==UserScript==
// @name         Copy okgg VLESS Node Info
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy node information to VLESS link
// @author       Your Name
// @match        *://*.okgg.top/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/502124/Copy%20okgg%20VLESS%20Node%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/502124/Copy%20okgg%20VLESS%20Node%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createCopyButton() {
        const button = document.createElement('button');
        button.textContent = '复制节点信息';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        button.onclick = copyNodeInfo;
        document.body.appendChild(button);
    }

    function copyNodeInfo() {
        const tip = document.querySelector('.node-tip.cust-model.cust-modelin.fade-delay');
        if (!tip || tip.style.display === 'none') {
            alert('没有找到节点信息弹窗');
            return;
        }

        const protocol = tip.querySelector('.nodename').textContent.trim();
        const type = getValueFromTip(tip, '类型 Protocol');
        const name = getValueFromTip(tip, '名字 Name');
        const address = getValueFromTip(tip, '地址 Address');
        const userId = getValueFromTip(tip, '用户Id ID');
        const flow = getValueFromTip(tip, '流控 Flow');
        const port = getValueFromTip(tip, '端口 Port');
        const encryption = getValueFromTip(tip, '加密 Encryption');
        const network = getValueFromTip(tip, '传输协议 Network');
        const typeMasquerade = getValueFromTip(tip, '伪装类型 Type');
        const host = getValueFromTip(tip, '伪装 Host Quic加密方式');
        const tls = getValueFromTip(tip, 'Tls传输');
        const fingerprint = getValueFromTip(tip, 'FigerPrint 指纹');
        const sni = getValueFromTip(tip, 'SNI');

        const vlessLink = `vless://${userId}@${address}:${port}?type=${network}&security=${tls}&flow=${flow}&sni=${sni}&fp=${fingerprint}&host=${host}&type=${typeMasquerade}#${name}`;

        GM_setClipboard(vlessLink);
        alert('节点信息已复制');
    }

    function getValueFromTip(tip, label) {
        const element = Array.from(tip.querySelectorAll('p')).find(p => p.textContent.includes(label));
        return element ? element.querySelector('span').textContent.trim() : '';
    }

    createCopyButton();
})();
