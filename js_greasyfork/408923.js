// ==UserScript==
// @name           9gagNotifications
// @namespace      http://diveintomark.org/projects/greasemonkey/
// @version        0.1
// @description    Hide notifications for followed post comments
// @author         taipignas
// @include        *9gag.com/*
// @downloadURL https://update.greasyfork.org/scripts/408923/9gagNotifications.user.js
// @updateURL https://update.greasyfork.org/scripts/408923/9gagNotifications.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var bellNode = null;
    var goodNotiFound = false;
    var bellDeclicked = false;
    var goodCount = 0;

    const goodNotiFoundFunc = () => {
        let updateBell = document.querySelector('a.bell');
        updateBell.classList.add('new');
        updateBell.textContent = goodCount;
    }

    const bellNodeChangeTriggered = (mutations, observer) => {
        console.log("Hiding...");

        let notiList = bellNode.querySelector('.notification-list')?.querySelectorAll('li');
        if (notiList != undefined) {
            notiList.forEach(el => {
                if (el.innerText.includes('comment you followed'))
                    el.style.display = 'none';
                else if (el.querySelector('a.unread') != undefined) {
                    goodNotiFound = true;
                    goodCount++;
                }
            });

            let bellNewNotis = bellNode.querySelector('a.bell.new');
            if (bellNewNotis != undefined) bellNewNotis.classList.remove('new');

            if ([...notiList].length > 10 && bellDeclicked === false) {
                bellNode.querySelector('a.bell').click();
                bellDeclicked = true;
                if (goodNotiFound === true) setTimeout(goodNotiFoundFunc, 1000);
            }
        }
    }

    const attachObserver = (bell) => {
        console.log("Attaching observer...");
        var observer = new MutationObserver(bellNodeChangeTriggered);

        observer.observe(bell, {
            subtree: true,
            childList: true
        });

        bell.querySelector('a.bell').click();
    }

    while (bellNode == undefined && document.getElementById('top-nav') != undefined) {
        console.log("While...");

        let bell = document.querySelector('.user-function');
        if (bell != undefined) {
            bellNode = bell;
            attachObserver(bell);
        }
    }

})();