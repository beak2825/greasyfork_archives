// ==UserScript==
// @name         JackboxReminder
// @name:ru      JackboxReminder
// @name:en      JackboxReminder
// @namespace    yes
// @version      1.1
// @description  notifies you when jackbox-game ends
// @description:ru Показывает вам уведомление, когда игра в Jackbox закончена.
// @author       lenchik-lox
// @include      http*://jackbox.*/*
// @include      http*://jackbox.fun/*
// @icon         https://www.google.com/s2/favicons?domain=jackbox.fun
// @grant        GM_notification
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/431159/JackboxReminder.user.js
// @updateURL https://update.greasyfork.org/scripts/431159/JackboxReminder.meta.js
// ==/UserScript==

(function() {
    var interval;
    var labeltext;
    var isTVhost = location.host == "jackbox.tv";
    if (isTVhost) {
        labeltext = "Notify me when game ends";
    }
    else {
        labeltext = "Уведомить меня когда игра закончится";
    }
     function CheckGameState() {
        let code = document.querySelector('#roomcode').value;
        let req = new XMLHttpRequest();
        req.open('GET','https://blobcast.jackboxgames.com/room/'+code);
        req.responseType = "json";

        req.onreadystatechange = function () {
            console.log('e');
            if (req.readyState == XMLHttpRequest.DONE) {
                var resp = req.response
                if (resp.success == false) {
                    GM_notification(`Click to open ${location.host} tab`,`Game ${code} has ended`,'https://www.google.com/s2/favicons?domain=jackbox.fun',openJackboxTab);
                    clearInterval(interval)
                    document.querySelector('#chkbx').checked = false;
                }
            }
        }
        req.send();
    }
    function openJackboxTab() {
        GM_openInTab(location.href,{
            active:true
        })
    }

    setTimeout(()=>{
        'use strict';
        var style = document.createElement('style');
        style.type = "text/css";
        style.innerText = `
        .CGSContainer {
            margin-top:10px;
        }
        .CGSContainer .label {
            user-select:none;
            padding-left:20px !important;
        }
        .CGSContainer .checkbox {
            position:absolute;
        }

        `;
        var chkbx = document.createElement('input');
        chkbx.type = "checkbox";
        chkbx.className = "checkbox";
        chkbx.id = "chkbx";
        var label = document.createElement('label');
        label.className = "label text-signin jbg";
        label.innerText = labeltext;
        label.setAttribute('for',chkbx.id);
        label.setAttribute('data-v-2ba6adc4','');
        var div = document.createElement('div');
        div.className = "CGSContainer";
        div.style.display = "none";
        if (isTVhost) {
            div.style.marginTop = "-5px";
        }
        else {
            div.style.marginTop = "10px";
        }

        chkbx.onchange = (e) => {
            if (e.target.checked) {
                interval = setInterval(CheckGameState,1000);
            }
            else {
                clearInterval(interval);
            }
        }
        document.querySelector('#roomcode').oninput = (e) => {
            if (document.querySelector('#roomcode').value.length != 4) {
                div.style.display = "none";
            }
            else {
                div.style.display = "";
            }
            document.querySelector('#chkbx').checked = false;
            clearInterval(interval)
        }

        div.append(chkbx,label);
        document.head.append(style)
        document.querySelector('#roomcode').after(div);
    },500)
})();