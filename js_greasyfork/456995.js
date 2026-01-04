// ==UserScript==
    // @name         Twitter Move Community UI to bottom
    // @namespace    http://tampermonkey.net/
    // @version      0.3
    // @description  move ui
    // @author       You
    // @match        https://twitter.com/*
    // @match        https://*.x.com/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
    // @grant        none
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456995/Twitter%20Move%20Community%20UI%20to%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/456995/Twitter%20Move%20Community%20UI%20to%20bottom.meta.js
    // ==/UserScript==

    //alert('ha');

    document.addEventListener("DOMContentLoaded", ready);
    function ready() {


        function fuckyou(){
            //aria-label="社群"
            var userid = document.querySelector('[class="css-1dbjc4n r-1adg3ll r-bztko3"]').outerHTML.split('UserAvatar-Container-')[1].split('\" style')[0];
            console.log(userid);
            var element = document.querySelector('[href="/'+ userid +'/communities"]');
            element.setAttribute('style', 'order:1;')}

        setTimeout(fuckyou,1000);
    }

    var zNode = document.createElement('div');
    zNode.innerHTML = '<button id="myButton" type="button" style=z-index:10;>'
        + 'For Pete\'s sake, don\'t click me!</button>'
        ;
    zNode.setAttribute('id', 'myContainer');
    zNode.setAttribute('style', 'z-index: 9999;position: absolute;top:0;left:0;display:none;');

    document.body.appendChild(zNode);

    //document.getElementsByClassName('css-1dbjc4n r-1pi2tsx r-1wtj0ep r-1rnoaur r-1e081e0 r-f9dfq4')[0].appendChild (zNode);

    //--- Activate the newly added button.
    document.getElementById("myButton").addEventListener(
        "click", ready, false
    );
    document.getElementById("myButton").click();

/*
    function ButtonClickAction(zEvent) {
        // For our dummy action, we'll just add a line of text to the top of the screen.
        var zNode = document.createElement('p');
        zNode.innerHTML = 'The button was clicked.';
        document.getElementById("myContainer").appendChild(zNode);
    }


    (function () {
        'use strict';
        var x = document.querySelectorAll("a [href='/notifications']");
        x[0].style.backgroundColor = "red";
        x.remove();
        // Your code here...
    })();*/