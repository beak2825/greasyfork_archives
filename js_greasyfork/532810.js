// ==UserScript==
// @name         Zabbix Tools: Copy MAC and IP
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Копирование MAC-адреса и IP-адреса без порта
// @match        http://109.248.236.92:18002/zabbix/imap.php*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532810/Zabbix%20Tools%3A%20Copy%20MAC%20and%20IP.user.js
// @updateURL https://update.greasyfork.org/scripts/532810/Zabbix%20Tools%3A%20Copy%20MAC%20and%20IP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enhanceIPElements() {
        document.querySelectorAll('.host_interfaces_line').forEach(line => {
            if (!line.querySelector('.zabbix-copy-btn') && !line.querySelector('.zabbix-ssh-link')) {
                const ipMatch = line.textContent.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
                if (ipMatch && !line.textContent.includes('SNMP')) {
                    const textSpan = document.createElement('span');
                    textSpan.textContent = line.textContent;
                    line.innerHTML = '';
                    line.appendChild(textSpan);
                    addCopyButton(line, ipMatch[0], '📋');
                    addSSHLink(line, ipMatch[0]);
                }
            }
        });

        document.querySelectorAll('.host_inventory_line_r').forEach(line => {
            if (!line.querySelector('.zabbix-copy-btn')) {
                const text = line.textContent.trim();
                if (text !== 'SNMP' && text !== 'IP' && text !== 'DNS' && text !== 'Port' && text !== 'Interface' && text !== 'Type' && !text.startsWith('SNMP:')) {
                    const textSpan = document.createElement('span');
                    textSpan.textContent = line.textContent;
                    line.innerHTML = '';
                    line.appendChild(textSpan);
                    addCopyButton(line, text, '📋');
                }
            }
        });

        document.querySelectorAll('.link_menu').forEach(link => {
            if (!link.querySelector('.zabbix-copy-name-btn') && link.textContent.trim() !== 'Действия') {
                const name = link.textContent.trim();
                if (!name.includes('SNMP')) {
                    const textSpan = document.createElement('span');
                    textSpan.textContent = link.textContent;
                    link.innerHTML = '';
                    link.appendChild(textSpan);
                    addCopyNameButton(link, name, '📋');
                }
            }
        });
    }

    function addCopyButton(parent, text, emoji) {
        const btn = document.createElement('button');
        btn.innerHTML = emoji;
        btn.className = 'zabbix-copy-btn';
        btn.title = 'Копировать';
        btn.style.cssText = `margin-left:6px; padding:0 4px; background:transparent; border:none; cursor:pointer; opacity:0.7; transition:opacity 0.2s;`;
        btn.onclick = (e) => {
            e.stopPropagation();
            GM_setClipboard(text, 'text');
            btn.innerHTML = '✨';
            setTimeout(() => btn.innerHTML = emoji, 1000);
        };
        parent.appendChild(btn);
    }

    function addSSHLink(parent, ip) {
        const sshLink = document.createElement('a');
        sshLink.textContent = '🔌';
        sshLink.title = 'Подключиться напрямую (без диалога)';
        sshLink.style.cssText = 'margin-left:5px; cursor:pointer; color:#06c; text-decoration:none;';
        sshLink.className = 'zabbix-ssh-link';

        sshLink.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = `ssh://${ip}:22`;
            window.open(url, '_self');
        };
        parent.appendChild(sshLink);
    }

    function addCopyNameButton(parent, text, emoji) {
        const btn = document.createElement('button');
        btn.innerHTML = emoji;
        btn.className = 'zabbix-copy-name-btn';
        btn.title = 'Копировать';
        btn.style.cssText = `margin-left:6px; padding:0 4px; background:transparent; border:none; cursor:pointer; opacity:0.7; transition:opacity 0.2s;`;
        btn.onclick = (e) => {
            e.stopPropagation();
            GM_setClipboard(text, 'text');
            btn.innerHTML = '✨';
            setTimeout(() => btn.innerHTML = emoji, 1000);
        };
        parent.appendChild(btn);
    }

    enhanceIPElements();
    new MutationObserver(enhanceIPElements).observe(document.body, { childList: true, subtree: true });
})();