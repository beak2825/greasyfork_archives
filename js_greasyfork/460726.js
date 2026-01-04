// ==UserScript==
// @name         Destiny Emblem Vault
// @namespace    https://d2ev.hitokagemya.com/
// @version      0.1
// @description  Beta Version
// @author       Hitokage
// @match        https://www.bungie.net/*
// @match        https://d2ev.hitokagemya.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bungie.net
// @grant       GM.cookie
// @grant       GM_openInTab
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_xmlhttpRequest
// @require     https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require     https://unpkg.com/sweetalert2@11.7.2/dist/sweetalert2.js
// @run-at      document-end
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/460726/Destiny%20Emblem%20Vault.user.js
// @updateURL https://update.greasyfork.org/scripts/460726/Destiny%20Emblem%20Vault.meta.js
// ==/UserScript==

let toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: false,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
});

const message = {
    success: (text) => {
        toast.fire({title: text, icon: 'success'});
    },
    error: (text) => {
        toast.fire({title: text, icon: 'error'});
    },
    warning: (text) => {
        toast.fire({title: text, icon: 'warning'});
    },
    info: (text) => {
        toast.fire({title: text, icon: 'info'});
    },
    question: (text) => {
        toast.fire({title: text, icon: 'question'});
    }
};

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function jumpToBungie() {
    GM_openInTab("https://www.bungie.net/7/en/Codes/Redeem", { active: true, setParent: true, insert: true });

}

async function getCookie() {
    let bungleatk;
    let bungled;
    bungleatk = await GM.cookie.list({ name: "bungleatk"});
    bungled = await GM.cookie.list({ name: "bungled"});
    if (bungleatk.length) {bungleatk = bungleatk[0].value} else {bungleatk = null};
    if (bungled.length) {bungled = bungled[0].value} else {bungled = null};
    return { "bungleatk": bungleatk, "bungled": bungled }
}

async function getUserUniqueName(cookie) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.bungie.net/Platform/User/GetBungieNetUser/?lc=zh-cht&fmt=true&lcin=true",
            anonymous: true,
            headers: {
                'X-API-KEY': '10E792629C2A47E19356B8A79EEFA640',
                'X-CSRF': cookie["bungled"],
                'Content-Type': 'text/plain',
                'Origin': 'https://www.bungie.net',
                "Cookie": "bungled=" + cookie["bungled"] + "; bungleatk=" + cookie["bungleatk"],
              },
            onload: function(response) {
                resolve(JSON.parse(response.responseText).Response.user.uniqueName);
            },
          onerror: function(error) {
            reject(error);
          }
        });
      });
}

function sendRedeempetionRequest(cookie) {
    var data = {
        "hash": GM_getValue("d2ev_hash"),
        "password": GM_getValue("d2ev_password"),
        "user": {
            "bungleatk": cookie["bungleatk"],
            "bungled": cookie["bungled"],
        }
    }
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://d2ev.hitokagemya.com/api/vault/emblem/redeem",
            anonymous: true,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: function(response) {
                const resp = JSON.parse(response.responseText);
                Swal.fire({
                    title: "Redeem Result",
                    html: "Item name: " + resp["data"]["emblem_info"] + "<br/>Message: " + resp["data"]["message"]
                });
                resolve(resp);
            },
          onerror: function(error) {
            reject(error);
          }
        });
      });
}

async function submitRedeempetion(cookie) {
    const uniqueName = await getUserUniqueName(cookie);
    Swal.fire({
        title: 'Do you want submit code redeempetion request now?',
        html: 'Please confirm current username:<br/>' + uniqueName,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({title: "Please wait", text: "Redeempetion request has been submitted"}, '', 'success')
          GM_setValue("d2ev_wait_use", false);
          sendRedeempetionRequest(cookie);
        } else if (result.isDenied) {
          Swal.fire('Redeempetion request has been cancelled', '', 'info')
          GM_setValue("d2ev_wait_use", false);
        }
      })
}

const checkCurrentUrl = async function () {
    let currentUrl = window.location.href;
    var urlRedeemPattern = /^((https|http)?:\/\/)d2ev.hitokagemya.com\/vault\/redeem/;
    var urlBungiePattern = /^((https|http)?:\/\/)www.bungie.net/;
    var urlHomePage = /^((https|http)?:\/\/)d2ev.hitokagemya.com\/vault/;
    if (urlRedeemPattern.test(currentUrl)) {
        document.getElementById("tips").remove();
        GM_setValue("d2ev_wait_use", false);
        var hashPattern = /hash=(\w{32})/;
        var pwPattern = /password=(\w{0,99})/;
        var hash = hashPattern.exec(currentUrl);
        var password = pwPattern.exec(currentUrl);
        if (password) {password = password[1]} else {password = ""};
        GM_setValue("d2ev_password", password);
        if (hash) {
            GM_setValue("d2ev_wait_use", true);
            GM_setValue("d2ev_hash", hash[1]);
            jumpToBungie();
        } else {
            message.error("Parse hash failed, please check and retry");
            sleep(2000).then(() => {
                showInput();
            });
        }
    } else if (urlBungiePattern.test(currentUrl) && GM_getValue("d2ev_wait_use")) {
        var cookie = await getCookie();
        if (!cookie["bungleatk"] || !cookie["bungled"]) {
            Swal.fire('After sign in please refresh page to continue auto redeem progress');
        } else {
            submitRedeempetion(cookie);
        }
    } else if (urlHomePage.test(currentUrl)) {
        document.getElementById("tips").remove();
        showInput();
    }
}

function showInput() {
    let dom = '', btn = '';
    dom += `<label class="pl-setting-label"><div class="pl-label">Hash</div><input type="text" placeholder="" class="pl-input listener-hash" value="${GM_getValue('d2ev_hash')}"></label>`;
    dom += `<label class="pl-setting-label"><div class="pl-label">Password</div><input type="text" placeholder="Optional" class="pl-input listener-password" value="${GM_getValue('d2ev_password')}"></label>`;
    dom = '<div>' + dom + '</div>';

    Swal.fire({
        title: 'Redeem Emblem',
        html: dom,
        icon: 'info',
        showCloseButton: false,
        showConfirmButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            message.success('Got it!');
            window.location.replace("https://d2ev.hitokagemya.com/vault/redeem?hash=" + GM_getValue('d2ev_hash') + "&password=" + GM_getValue('d2ev_password'))
        }
    });

    $(document).on('input', '.listener-hash', async (e) => {
        GM_setValue('d2ev_hash', e.target.value);
    });
    $(document).on('input', '.listener-password', async (e) => {
        GM_setValue('d2ev_password', e.target.value);
    });
}

checkCurrentUrl();