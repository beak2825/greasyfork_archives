// ==UserScript==

// @name         InstagramSubscriber
// @version      0.1
// @author       Stepan
// @match        https://www.instagram.com/*
// @grant        none
// @description  Instagram Subscriber

// @namespace https://greasyfork.org/users/181794
// @downloadURL https://update.greasyfork.org/scripts/381180/InstagramSubscriber.user.js
// @updateURL https://update.greasyfork.org/scripts/381180/InstagramSubscriber.meta.js
// ==/UserScript==


var SubLimit = 5; // сколько подписать

var SleepBetweenSubMin = 2; // мин. время задержки в c
var SleepBetweenSubMax = 5; // макс. время задержки в c


var reloadTime = 30 * 60 * 1000;

function CheckTime() {


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


        document.getElementsByTagName('section')[1].getElementsByTagName('li')[1].children[0].click();
        document.getElementsByClassName('PZuss')[0].getElementsByTagName('li');


        start();
        clearInterval(f);



    } catch (e) {}

}, 1000);


function UpdateList() {
    var list = document.getElementsByClassName('PZuss')[0].getElementsByTagName('li');
    document.getElementsByClassName('PZuss')[0].getElementsByTagName('li')[document.getElementsByClassName('PZuss')[0].getElementsByTagName('li').length-1].scrollIntoView();

    return list;
}


async function start() {

    var SubTime = reloadTime / SubLimit;

    console.log(SubTime);


    var SubCount = 0;

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

    async function Sub() {

        var list = UpdateList();

        var btn = list[i].getElementsByTagName('button')[0];

        i++;


        if (btn.innerText.includes("Подписаться")) {

            console.log(btn);
            console.log('subscribing..');
            btn.click();
            SubCount++;


            if (SubCount >= SubLimit) {
                console.log('end');
                return;
            }

            list = UpdateList();

            btn.scrollIntoView();

            setTimeout(Sub, parseInt(SubTime));

        }else
        {

            Sub();
            return;
        }

    }

    Sub();




}




function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}