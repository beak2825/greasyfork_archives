// ==UserScript==
// @name         显示网站 IP 和 ISP 信息
// @namespace    https://tools.0x5c0f.cc/
// @version      1.5.0
// @description  显示当前网站的 IP、ISP 信息，支持自定义 DNS 查询并可拖动窗口。当前脚本由 ChatGpt 生成
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      tools.0x5c0f.cc
// @downloadURL https://update.greasyfork.org/scripts/544881/%E6%98%BE%E7%A4%BA%E7%BD%91%E7%AB%99%20IP%20%E5%92%8C%20ISP%20%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/544881/%E6%98%BE%E7%A4%BA%E7%BD%91%E7%AB%99%20IP%20%E5%92%8C%20ISP%20%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_BASE = '//tools.0x5c0f.cc/rz/api/v1/utils/resolve';
    const DEFAULT_DNS = '8.8.8.8';
    const STORAGE_KEYS = {
        LEFT: 'panel_left',
        TOP: 'panel_top',
        DNS: 'dns_server',
    };

    const domain = location.hostname;

    function getStoredDNS() {
        return GM_getValue(STORAGE_KEYS.DNS, DEFAULT_DNS);
    }

    function savePosition(left, top) {
        GM_setValue(STORAGE_KEYS.LEFT, left + 'px');
        GM_setValue(STORAGE_KEYS.TOP, top + 'px');
    }

    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'ip-info-panel';
        panel.style.position = 'fixed';
        panel.style.zIndex = '9999999';
        panel.style.background = 'rgba(0,0,0,0.5)';
        panel.style.color = 'white';
        panel.style.padding = '10px';
        panel.style.borderRadius = '8px';
        panel.style.fontSize = '14px';
        panel.style.maxWidth = '300px';
        panel.style.maxHeight = '60vh';
        panel.style.overflowY = 'auto';
        panel.style.cursor = 'move';
        panel.style.userSelect = 'none';

        const left = GM_getValue(STORAGE_KEYS.LEFT, '10px');
        const top = GM_getValue(STORAGE_KEYS.TOP, '10px');
        panel.style.left = left;
        panel.style.top = top;

        document.body.appendChild(panel);
        enableDrag(panel);
        return panel;
    }

    function enableDrag(el) {
        let offsetX = 0, offsetY = 0, dragging = false;

        el.addEventListener('mousedown', e => {
            if (e.target.tagName === 'INPUT') return;
            dragging = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
        });

        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            el.style.left = `${e.clientX - offsetX}px`;
            el.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            savePosition(el.offsetLeft, el.offsetTop);
        });
    }

    function fetchIPInfo(dnsServer, callback) {
        const url = `${API_BASE}?domain=${domain}&dns_server=${encodeURIComponent(dnsServer)}&show_ipinfo=false`;

        GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: (res) => {
                try {
                    const data = JSON.parse(res.responseText);
                    callback(null, data);
                } catch (err) {
                    callback(err);
                }
            },
            onerror: (err) => callback(err)
        });
    }

    function renderPanel(panel, data, dnsServer) {
        let html = `<strong>${data.domain}</strong><br>`;
        html += `DNS: ${dnsServer}<br>`;
        html += `IPv4: ${data.ipv4_addresses.length} | IPv6: ${data.ipv6_addresses.length}<br>`;
        html += `<em id="toggle-detail" style="cursor:pointer;">(点击展开详情)</em>`;

        let detailHTML = '<div id="ip-info-detail" style="display:none; margin-top:8px; line-height:1.5; padding:6px; border-top:1px solid #ccc; background-color: rgba(255,255,255,0.05); word-break: break-all;">';
        data.ipv4_addresses.forEach(ip => {
            detailHTML += `<div><strong>IPv4</strong>: ${ip}</div>`;
        });
        data.ipv6_addresses.forEach(ip => {
            detailHTML += `<div><strong>IPv6</strong>: ${ip}</div>`;
        });
        data.ipinfo.forEach(info => {
            detailHTML += `<div style="margin-top:6px; padding:4px 0; border-bottom:1px solid #666;">`;
            detailHTML += `<div><strong>IP</strong>: ${info.ip}</div>`;
            if (info.org) detailHTML += `<div><strong>ISP</strong>: ${info.org}</div>`;
            if (info.country) detailHTML += `<div><strong>国家</strong>: ${info.country}</div>`;
            detailHTML += `</div>`;
        });
        detailHTML += '</div>';

        html += detailHTML;
        html += `<input id="dns-input" type="text" placeholder="DNS 服务器 (默认 8.8.8.8)" value="${dnsServer}" style="width:100%;margin-top:8px;padding:4px;border:none;border-bottom:1px solid white;background:transparent;color:white;outline:none;box-sizing:border-box;">`;

        panel.innerHTML = html;

        document.getElementById('dns-input').addEventListener('change', e => {
            const newDns = e.target.value || DEFAULT_DNS;
            GM_setValue(STORAGE_KEYS.DNS, newDns);
            fetchIPInfo(newDns, (err, newData) => {
                if (!err) renderPanel(panel, newData, newDns);
            });
        });

        document.getElementById('toggle-detail').addEventListener('click', () => {
            const detail = document.getElementById('ip-info-detail');
            const toggle = document.getElementById('toggle-detail');
            const showing = detail.style.display !== 'none';
            detail.style.display = showing ? 'none' : 'block';
            toggle.textContent = showing ? '(点击展开详情)' : '(点击关闭详情)';
        });
    }

    const panel = createPanel();
    const storedDNS = getStoredDNS();
    fetchIPInfo(storedDNS, (err, data) => {
        if (err || !data) {
            panel.innerHTML = '<strong>获取 IP 信息失败</strong>';
            return;
        }
        renderPanel(panel, data, storedDNS);
    });
})();