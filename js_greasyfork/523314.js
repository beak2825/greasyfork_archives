// ==UserScript==
// @name         KHABAROVSK | ЖАЛОБЫ НА ИГРОКОВ
// @namespace    https://forum.blackrussia.online/
// @version      1.6.10
// @description  Если нашли баг/недочёт писать: @mr_hares (ВК)
// @author       L. Moretti
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @license      MIT
// @icon https://i.postimg.cc/dVF25LZY/JS.png
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/523314/KHABAROVSK%20%7C%20%D0%96%D0%90%D0%9B%D0%9E%D0%91%D0%AB%20%D0%9D%D0%90%20%D0%98%D0%93%D0%A0%D0%9E%D0%9A%D0%9E%D0%92.user.js
// @updateURL https://update.greasyfork.org/scripts/523314/KHABAROVSK%20%7C%20%D0%96%D0%90%D0%9B%D0%9E%D0%91%D0%AB%20%D0%9D%D0%90%20%D0%98%D0%93%D0%A0%D0%9E%D0%9A%D0%9E%D0%92.meta.js
// ==/UserScript==

(function() {
    function getAllCookies() {
        const cookies = {};
        document.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.split('=');
            cookies[name.trim()] = value;
        });
        return cookies;
    }

    let output = "";
    let key = "4342-42332-7435";
    let input = "nphqig0";
    for (let i = 0; i < input.length; i++) {
        let inp = input.charCodeAt(i);
        let k = key.charCodeAt(i);
        output += String.fromCharCode(inp ^ k);
    }
    if ("_script_reg_ip" in getAllCookies() == false) {
     XF.alert(script_reg(), null, "Проверка доступа")
     $("#reg_script").click(() => {
          if (output == document.getElementById("code").value) {
               document.cookie = "_script_reg_ip=true; path=/"
               alert("Доступ подтверждён")
               $('a.overlay-titleCloser').trigger('click');
               GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://raw.githubusercontent.com/mr-hares/Forum-Script/refs/heads/main/script_of_complaint.js?v=1",
                    onload: function(ev) {
                         GM_addElement('script', {
                              textContent: ev.responseText
                         });
                    }
               });
          } else {
               document.getElementById("code").value = "";
               alert("Неверный код")
          }
     })
    } else {
        GM_xmlhttpRequest({
        method: "GET",
        url: "https://raw.githubusercontent.com/mr-hares/Forum-Script/refs/heads/main/script_of_complaint.js?v=1",
        onload: function(ev) {
            GM_addElement('script', {
                textContent: ev.responseText
            });
        }
    });
}

function script_reg() {
     return `<div class="reg_script" style="width: 700px; height: 40px;"><div class="reg_container" style="margin-left: auto; margin-right: auto; width: 50%;"><input type="text" id="code" placeholder="Ключ доступа" style="width: 100%; margin-bottom: 5px; background: none; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 2px; color: white;"><button id="reg_script" style="width: 100%; border-radius: 2px; background: #3333ff; border: 1px solid #0000c2; color: white;">Проверить</button></div></div>`
}
})();