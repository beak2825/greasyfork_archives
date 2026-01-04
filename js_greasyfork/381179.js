// ==UserScript==
// @name         InstagramUnSubscriber
// @version      0.1
// @author       Stepan
// @match        https://www.instagram.com/*
// @grant        none
// @description  Instagram UnSubscriber
// @namespace https://greasyfork.org/users/181794
// @downloadURL https://update.greasyfork.org/scripts/381179/InstagramUnSubscriber.user.js
// @updateURL https://update.greasyfork.org/scripts/381179/InstagramUnSubscriber.meta.js
// ==/UserScript==


var UnSubLimit = 3; // сколько отписать в час

var SleepBetweenSubMin = 2; // мин. время задержки в c
var SleepBetweenSubMax = 5; // макс. время задержки в c


var reloadTime = 30 * 60 * 1000;

function CheckTime() {

    return true;

    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    console.log(h + 'h ' + m + "m");

    if ((h > 21 | h < 9) | (h == 21 & m < 30)) {
        console.log('waiting next day...');

        return false;

    }

    console.log('time is fine');
    return true;

}




var f = setInterval(function() {

    try {

        document.getElementsByTagName('ul')[0].getElementsByTagName('li')[2].children[0].click();
        document.getElementsByClassName('PZuss')[0].getElementsByTagName('li');


        start();
        clearInterval(f);



    } catch (e) {}

}, 1000);


function UpdateList() {
    var list = document.getElementsByClassName('PZuss')[0].getElementsByTagName('li');
    document.getElementsByClassName('PZuss')[0].getElementsByTagName('li')[document.getElementsByClassName('PZuss')[0].getElementsByTagName('li').length - 1].scrollIntoView();

    return list;
}

var unsubTime = 0;

async function start() {
    unsubTime = reloadTime / UnSubLimit;

    console.log(unsubTime);



    var UnSubCount = 0;

    var i = 0;



    if (CheckTime() == false) {
        console.log('reloading in 5s');
        await sleep(5000);
        window.location.reload();
        return;
    }
    setTimeout(async function() {

        console.log('reloading');
        await sleep(3000);
        window.location.reload();

    }, reloadTime);

    async function UnSub() {

        var list = UpdateList();

        var btn;

        while (true) {
            try {
                btn = list[i].getElementsByTagName('button')[0];
                i++;
                break;
            } catch (e) {
                await sleep(100);
            }
        }

        if (btn.innerText.includes("Подписки")) {
            console.log('unsubscribing..');
            btn.click();
            UnSubCount++;

            console.log(btn);

            setTimeout(async function() {

                var btns = document.getElementsByTagName('button');

                for (var b = 0; b < btns.length; b++) {

                    if (btns[b].innerText.includes('Отменить подписку')) {

                        btns[b].click();
                        await sleep(500);

                        break;
                    }

                }

                if (UnSubCount >= UnSubLimit) {
                    //alert('Закончено!');
                    return;
                }

                list = UpdateList();

                btn.scrollIntoView();

                //await sleep(1000);


                setTimeout(UnSub, unsubTime);
            }, 1000);

        }

    }

    UnSub();




}




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}