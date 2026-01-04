// ==UserScript==
// @name         HWMDaily nickname to id
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  к инпуту по айди добавляется конвертер ника в айди
// @author       Something begins
// @license      yo momma so fat she works at a movie theater. She is one of the screens
// @match        https://daily.heroeswm.ru/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heroeswm.ru
// @downloadURL https://update.greasyfork.org/scripts/537845/HWMDaily%20nickname%20to%20id.user.js
// @updateURL https://update.greasyfork.org/scripts/537845/HWMDaily%20nickname%20to%20id.meta.js
// ==/UserScript==

(function() {
    let idInput = document.querySelector(`input[name="id"]`);
    if (!idInput) idInput = document.querySelector(`input[name="pid"]`);
    if (!idInput) return;
    idInput.insertAdjacentHTML("afterend", "<div style = 'margin: 10px'><input id='nick_to_id' placeholder='Ник -> id'></input><button id = 'id_convert'> Конвертировать </button> </div>");
    document.querySelector("#id_convert").addEventListener("click", event => {
        event.preventDefault();
        const nick = document.querySelector("#nick_to_id").value;
        const url = `https://www.heroeswm.ru/search.php?key=${encodeURIComponent(nick)}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                console.log(response);
                const id = response.finalUrl.split("id=")[1];
                idInput.value = id;
            },
            onerror: function(error) {
                console.error("Error fetching:", error);
            }
        });
    })

})();