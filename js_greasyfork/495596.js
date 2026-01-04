// ==UserScript==
// @name         Check Notification ASED
// @namespace    https://sed.volganet.ru/*
// @version      0.5
// @license      MIT
// @description  HTML5 уведомления для системы АСЭД
// @author       Alexandr Grishin
// @match        https://sed.volganet.ru/*
// @icon         data:image/gif;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495596/Check%20Notification%20ASED.user.js
// @updateURL https://update.greasyfork.org/scripts/495596/Check%20Notification%20ASED.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (Notification.permission !== 'granted')
    {
        Notification.requestPermission();
    }

    let isCheck = true;
    let isNotifLock = false;

    let countdownfunc;
    let timer;
    let timeToReload = 30;
    let isTiming = true;

    let btnTitle = "";

    console.log('init');

    function add(type = "button", idElem = "toggle-btn", caption = "X Выключить уведомления") {
        var element = document.createElement("input");
        element.type = type;
        element.id = idElem;
        element.className = "DButtonPrimary small";
        element.value = caption;
        element.name = idElem;
        element.onclick = function() {
            toggleCheck();
        };
        var foo = document.getElementById("user-info");
        foo.appendChild(element);
    }

    function reloadTimer() {
        console.log('Reload Timer Init');
        btnTitle = document.getElementById("toggle-btn").value;
        timer = setTimeout(() => { if(isTiming) location.reload(); }, 30000);
        countdownfunc = setInterval(countDown, 1000);
    }

    function countDown() {
        let btn = document.getElementById("toggle-btn");
        btn.value = btnTitle + ' ' + timeToReload;
        console.log(btn.value);
        timeToReload--;
    }

    setTimeout(add, 400);

    //add("button", "toggle-btn", "X Выключить уведомления");

    let interval = setInterval(checkNotification, 5000);


    setTimeout(reloadTimer, 450);

    function checkNotification()
    {
        if(!isNotifLock)
        {
            let iconNotification = document.getElementsByClassName("Icon__withEvent header-item")[1].childNodes[0].getAttribute("alt");
            console.log(iconNotification);
            if(iconNotification === "notifActiveSvg")
            {
                sendNotification("АСЭД", {
                    body: 'В системе АСЭД есть новое уведомеление',
                    icon: 'data:image/gif;base64,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',
                    dir: 'auto'
                });
            }
        }
    }

    function toggleCheck()
    {
        let btnToggle = document.getElementById("toggle-btn");
        if(isCheck){
            clearTimeout(interval);
            clearTimeout(countdownfunc);
            clearTimeout(timer);
            isCheck = false;
            isTiming = false;
            console.log('check off');
            btnToggle.value = "✓ Включить уведомления";
        }
        else
        {
            interval = setInterval(checkNotification, 5000);
            isCheck = true;
            isTiming = true;
            btnToggle.value = "X Выключить уведомления";
            timeToReload = 30;
            reloadTimer();
            console.log('check on');
        }
    }

    function sendNotification(title, options) {
        if (Notification.permission === "granted") {
            var notification = new Notification(title, options);
            function closeNotif() { isNotifLock = false; }
            function showNotif() { isNotifLock = true; }
            notification.onclose = closeNotif;
            notification.onshow = showNotif;
        }
        else if (Notification.permission === 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    var notification = new Notification(title, options);

                } else {
                    console.log('Вы запретили показывать уведомления');
                }
            });
        } else {
            // Пользователь ранее отклонил наш запрос на показ уведомлений
        }
    }

})();