// ==UserScript==
// @name         Extensions Manager
// @namespace    Openresty
// @version      v1.0.0
// @description  Сделай свой жизнь на LolzTeam проще!
// @author       https://zelenka.guru/lays (openresty)
// @match        https://zelenka.guru/*
// @grant        GM_xmlhttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @connect      lzt.hasanbek.ru
// @run-at       document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476908/Extensions%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/476908/Extensions%20Manager.meta.js
// ==/UserScript==

const
    ext_version         = "1.0.0"

let nickname,
    userid;

(async function() {
    window.addEventListener("DOMContentLoaded",async (event) => {
        renderSettings();
        userid   = document.querySelector("input[name=_xfToken").value.split(",")[0];
        nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim();
    })
    renderFunctions();
})();


function request(url) {
    return new Promise((resolve, reject) => GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: response => resolve(response.responseText),
        onerror: error => resolve(error)
    }));
}

function getUID() {
    return document.querySelector("input[name=_xfToken").value.split(",")[0];
}


function renderSettings() {
    if (document.querySelector(".secondaryContent a.button.block[href='account/personal-details']")) {
        let profileeditbtn = document.createElement('a')
        profileeditbtn.classList.add('block');
        profileeditbtn.classList.add('button');
        profileeditbtn.onclick = function () {
            dialogWindow();
        };
        profileeditbtn.innerHTML = 'Магазин расширений';
        document.querySelector(".topblock .secondaryContent").append(profileeditbtn)
    }
}

function renderFunctions() {
    unsafeWindow.nickname = nickname;
    unsafeWindow.ext_version = ext_version;
    unsafeWindow.request = request;
    unsafeWindow.extmanager = true;
    let torender = [dialogWindow];
    let funcs = torender.map(e => e.toString());
    let script = document.createElement('script');
    script.appendChild(document.createTextNode(funcs.join("")));
    document.head.appendChild(script);
}

async function dialogWindow() {
    nickname = document.querySelector(".accountUsername.username").firstElementChild.innerText.trim().replace(/<[^>]*>/g, ' ').replace(/\s{2,}/g, ' ').trim().replace(" Premium", "").trim();

    let htmlall = `
        <iframe src='https://lzt.hasanbek.ru/extmanager/index.html' frameborder='0' width='100%' height='100%' id='areaext'>
        <script>
            window.addEventListener('message', function(event) {
                if (event.data == 'auth') {
                    iframe = document.querySelectorAll('#areaext');  
                    iframe.forEach(function (e){
                        e.contentWindow.postMessage(XenForo.visitor.user_id, "*");
                    })
                }else {

                }
            });
        </script>
        <style>
        .errorOverlay>.baseHtml {
            padding: 0px;
            height: 350px;
        }
        .xenOverlay .errorOverlay .errorDetails {
            padding: 0px;
            white-space: normal
        }
        </style>
    `
    let html_prem = `
    ${htmlall}
    `;
    return  XenForo.alert(
        `${html_prem}`, 'Менеджер расширений'
    )
}
