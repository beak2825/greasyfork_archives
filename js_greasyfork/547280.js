// ==UserScript==
// @name         .org +rep script
// @namespace    http://tampermonkey.net/
// @version      purna
// @description  script for org rotters
// @author       Zeref
// @match        https://looksmax.org/*
// @grant        GM_addStyle
// @license      Zeref
// @downloadURL https://update.greasyfork.org/scripts/547280/org%20%2Brep%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/547280/org%20%2Brep%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let repUsers = JSON.parse(localStorage.getItem('repUsers') || '[]');

    function saveRepList() {
        localStorage.setItem('repUsers', JSON.stringify(repUsers));
    }

    let panel = document.createElement('div');
    panel.id = 'repPanel';
    panel.innerHTML = `<h4>Rep List</h4><ul id="repUsers"></ul>`;
    document.body.appendChild(panel);

    GM_addStyle(`
        #repPanel {
            position: fixed;
            top: 50px;
            right: 20px;
            width: 220px;
            background: #fff;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
        }
        #repPanel ul {list-style:none; padding:0; max-height:300px; overflow-y:auto;}
        #repPanel li {margin:5px 0; display:flex; justify-content:space-between;}
        .addRepBtn {
            display:block;
            font-size:12px;
            color: #007bff;
            cursor:pointer;
            margin-top: 2px;
        }
        .addRepBtn:hover { text-decoration: underline; }
        .removeBtn {font-size:12px; color:red; cursor:pointer;}
    `);

    function updatePanel() {
        let ul = document.getElementById('repUsers');
        ul.innerHTML = '';
        repUsers.forEach(u => {
            let li = document.createElement('li');
            li.textContent = u;

            let remove = document.createElement('span');
            remove.textContent = 'x';
            remove.className = 'removeBtn';
            remove.addEventListener('click', () => {
                repUsers = repUsers.filter(r => r !== u);
                saveRepList();
                updatePanel();
            });

            li.appendChild(remove);
            ul.appendChild(li);
        });
    }

    function addButtons() {
        let usernames = document.querySelectorAll('.username, .username a');
        usernames.forEach(u => {
            if(u.parentNode.querySelector('.addRepBtn')) return;
            let btn = document.createElement('span');
            btn.textContent = '+Add to Rep List';
            btn.className = 'addRepBtn';
            btn.addEventListener('click', () => {
                let username = u.textContent.trim();
                if(!repUsers.includes(username)) {
                    repUsers.push(username);
                    saveRepList();
                    updatePanel();
                    alert(username + ' added to rep list!');
                    autoRepPage(); // click +1 immediately
                }
            });
            u.parentNode.appendChild(btn);
        });
    }


    async function autoRepPage() {
        let messages = document.querySelectorAll('.message');
        for (let msg of messages) {
            try {
                let usernameEl = msg.querySelector('.username, .username a');
                if (!usernameEl) continue;
                let username = usernameEl.textContent.trim();

                if (repUsers.includes(username)) {
                    let plusBtn = msg.querySelector('a.ReactionTooltip--container, a.ReactionTooltip, a[href*="react"]');
                    if (plusBtn && !plusBtn.classList.contains('tm-clicked')) {
                        plusBtn.click();
                        plusBtn.classList.add('tm-clicked');
                        console.log('+Rep clicked for:', username);
                        await new Promise(r => setTimeout(r, 2000));
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    }


    updatePanel();
    addButtons();

    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });

})();
