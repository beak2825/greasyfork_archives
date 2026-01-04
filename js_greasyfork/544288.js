// ==UserScript==
// @name         Отправки жалобы админу
// @namespace    https://forum.blackrussia.online
// @version      3.1
// @description  Кнопка "Отправить админу" Tolya
// @author       Prokhor Adzinets
// @license MIT
// @match        https://forum.blackrussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544288/%D0%9E%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B8%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/544288/%D0%9E%D1%82%D0%BF%D1%80%D0%B0%D0%B2%D0%BA%D0%B8%20%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D1%83.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    if (document.getElementById('send-admin-btn')) return;
 
    let users = [];
 
    // 1. Получаем данные из Google Sheets
    async function fetchUsers() {
        const url = 'https://docs.google.com/spreadsheets/d/1dnDn3I0I9PkZbtcYro3s76GdE0YGpeHNqLo5Yy56Eqk/export?format=csv&gid=21780060';
        const resp = await fetch(url);
        const text = await resp.text();
        // Парсим CSV
        users = text.split('\n').slice(1).map(row => {
            const cols = row.split(',');
            return {
                nick: cols[1]?.trim(), // Столбец B
                vkid: cols[6]?.trim()  // Столбец G
            };
        }).filter(u => u.nick && u.vkid);
    }
 
    // 2. Создаём кнопку
    let statusBlock = document.querySelector('.blockStatus-message--locked');
    let insertAfter = statusBlock || document.querySelector('.block-outer') || document.body.firstElementChild;
 
    const adminBtn = document.createElement('button');
    adminBtn.id = 'send-admin-btn';
    adminBtn.textContent = 'Отправить админу';
    adminBtn.style = 'display:block;margin:18px auto 0 auto;padding:6px 18px;background:#ff1212;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,0.08);transition:background 0.2s;';
    adminBtn.onmouseover = () => adminBtn.style.background = '#d01010';
    adminBtn.onmouseout = () => adminBtn.style.background = '#ff1212';
    insertAfter.parentNode.insertBefore(adminBtn, insertAfter.nextSibling);
 
    // 3. Модалка
    if (!document.getElementById('admin-modal')) {
        // Добавим стили через <style>
        const style = document.createElement('style');
        style.textContent = `
#admin-modal-modern {
  display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;
  background:rgba(0,0,0,0.35);z-index:9999;
}
#admin-modal-modern .modal-content {
  background:#fff;
  padding: 20px 24px 18px 24px;
  border-radius: 14px;
  max-width: 340px;
  margin: 60px auto 0 auto;
  position: relative;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18), 0 1.5px 6px rgba(0,0,0,0.08);
  animation: modalIn 0.22s cubic-bezier(.4,1.4,.6,1) both;
}
@keyframes modalIn {
  from { transform: translateY(-30px) scale(0.98); opacity: 0; }
  to   { transform: none; opacity: 1; }
}
#admin-modal-modern h2 {
  margin: 0 0 10px 0;
  font-size: 19px;
  font-weight: 700;
  color: #222;
  letter-spacing: 0.01em;
}
#admin-modal-modern label {
  font-weight: 500;
  display: block;
  margin-bottom: 7px;
  color: #444;
  font-size: 14px;
}
#admin-nick {
  width: 100%;
  margin-bottom: 8px;
  padding: 8px 10px;
  border-radius: 7px;
  border: 1.2px solid #e0e0e0;
  color: #222;
  background: #fafbfc;
  font-size: 15px;
  transition: border 0.18s;
  outline: none;
  box-sizing: border-box;
}
#admin-nick:focus {
  border: 1.2px solid #6c63ff;
  background: #fff;
}
#nick-list {
  max-height: 140px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 7px;
  display: none;
  background: #fff;
  color: #222;
  position: absolute;
  width: calc(100% - 48px);
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  margin-top: -2px;
  font-size: 15px;
}
#nick-list .nick-item {
  padding: 7px 12px;
  cursor: pointer;
  background: #fff;
  color: #222;
  border-bottom: 1px solid #f2f2f2;
  transition: background 0.13s;
}
#nick-list .nick-item:last-child { border-bottom: none; }
#nick-list .nick-item:hover {
  background: #f3f6ff;
  color: #2a2a2a;
}
#admin-modal-modern .modal-btn {
  border: none;
  border-radius: 7px;
  padding: 8px 20px;
  font-size: 15px;
  font-weight: 500;
  margin-right: 8px;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}
#admin-modal-modern .modal-btn.send {
  background: #4caf50;
  color: #fff;
}
#admin-modal-modern .modal-btn.send:hover {
  background: #388e3c;
}
#admin-modal-modern .modal-btn.cancel {
  background: #e0e0e0;
  color: #333;
}
#admin-modal-modern .modal-btn.cancel:hover {
  background: #bdbdbd;
}
#admin-status {
  margin-top: 10px;
  color: #d00;
  font-size: 14px;
  min-height: 18px;
}
        `;
        document.head.appendChild(style);
 
        // Модалка
        const modal = document.createElement('div');
        modal.id = 'admin-modal-modern';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Отправить админу</h2>
                <label for="admin-nick">Выберите ник:</label>
                <input type="text" id="admin-nick" placeholder="Начните вводить ник..." autocomplete="off">
                <div id="nick-list"></div>
                <button id="admin-send" class="modal-btn send">Отправить</button>
                <button id="admin-cancel" class="modal-btn cancel">Отмена</button>
                <div id="admin-status"></div>
            </div>
        `;
        document.body.appendChild(modal);
 
        // Закрыть модалку
        document.getElementById('admin-cancel').onclick = function() {
            modal.style.display = 'none';
            document.getElementById('admin-status').textContent = '';
        };
 
        // Поиск и автодополнение
        const nickInput = document.getElementById('admin-nick');
        const nickList = document.getElementById('nick-list');
        let selectedVKID = null;
 
        nickInput.oninput = function() {
            const val = nickInput.value.trim().toLowerCase();
            if (!val) {
                nickList.style.display = 'none';
                selectedVKID = null;
                return;
            }
            const filtered = users.filter(u => u.nick.toLowerCase().includes(val));
            if (filtered.length === 0) {
                nickList.style.display = 'none';
                selectedVKID = null;
                return;
            }
            nickList.innerHTML = filtered.map(u =>
                `<div class="nick-item" data-vkid="${u.vkid}">${u.nick}</div>`
            ).join('');
            nickList.style.display = 'block';
            // Клик по нику + подсветка при наведении
            Array.from(nickList.children).forEach(div => {
                div.onclick = function() {
                    nickInput.value = div.textContent;
                    selectedVKID = div.getAttribute('data-vkid');
                    nickList.style.display = 'none';
                };
            });
        };
 
        // Скрывать список при клике вне
        document.addEventListener('click', function(e) {
            if (!nickInput.contains(e.target) && !nickList.contains(e.target)) {
                nickList.style.display = 'none';
            }
        });
 
        // Отправить
        document.getElementById('admin-send').onclick = async function() {
            const statusDiv = document.getElementById('admin-status');
            statusDiv.textContent = '';
            const nick = nickInput.value.trim();
            const vkid = users.find(u => u.nick === nick)?.vkid || selectedVKID;
            if (!vkid) {
                statusDiv.textContent = 'Выберите ник из списка!';
                return;
            }
            const complaintLink = window.location.href;
            const vkToken = 'vk1.a.Rph2L4Z0MLM8uaBk_QtznU3C7DpHxt5uyp--N15U6oXaBmINDyAyiqo_QLiWKXv0qzla1WqYwjLtGS6DkIa0oIVy5TO7Ebw-ISqdLVkAeUESax9IsRw1dd_VVgXA8pO4IFBBaQ84myxTExWnYq6UHBMZWYD7y4H9Dm57tcajSnlPavH-pmyGiVWHp4x7ca0xwdCpTyOvafmhD6sIMxJljg';
            const message = `Привет, на тебя поступила жалоба, скинь доказательства!\n\n${complaintLink}`;
            statusDiv.textContent = 'Отправка...';
            try {
                const resp = await fetch('https://85.198.83.81/send-vk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: vkid, message, vkToken })
                });
                const data = await resp.json();
                if (data.response) {
                    statusDiv.style.color = '#28a745';
                    statusDiv.textContent = 'Жалоба успешно отправлена!';
                    setTimeout(() => { modal.style.display = 'none'; statusDiv.textContent = ''; }, 1500);
                } else {
                    statusDiv.style.color = '#d00';
                    statusDiv.textContent = 'Ошибка отправки: ' + (data.error?.error_msg || 'Неизвестная ошибка');
                }
            } catch (e) {
                statusDiv.style.color = '#d00';
                statusDiv.textContent = 'Ошибка сети: ' + e.message;
            }
        };
    }
 
    // Открыть модалку
    adminBtn.onclick = async function() {
        if (users.length === 0) {
            await fetchUsers();
        }
        document.getElementById('admin-modal-modern').style.display = 'block';
        document.getElementById('admin-nick').focus();
    };
})();