// ==UserScript==
// @name         Netflix Shuffle
// @version      1.2
// @author       Cooper
// @description  an ok netflix shuffler
// @match        https://www.netflix.com/browse/my-list
// @namespace    github.com/cppcooper
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/381000/Netflix%20Shuffle.user.js
// @updateURL https://update.greasyfork.org/scripts/381000/Netflix%20Shuffle.meta.js
// ==/UserScript==
//I'd make a repo, but it's too simple to go to the trouble. I may make some early updates on greasyfork, but I'll probably just keep the gist below up-to-date
//https://gist.github.com/cppcooper/3e74fc3450eacd5b7d61de28c5b11a34

(function() {
    'use strict';
    //I know the autoscroll is annoying, but it's enabled by default so you'll know it's there /shrug
    /*to comment out auto-scrolling/loading remove ->*/
    var i1 = window.setInterval(autoScroll, 333);
    var i2 = window.setInterval(checkAutoScroll,50);
    /*^^^ activates auto-scrolling code ^^^*/
    var lastScrollHeight = 0;
    var check_count = 0;
    function autoScroll() {
        var sh = document.documentElement.scrollHeight;
        if (sh != lastScrollHeight) {
            check_count = 0;
            lastScrollHeight = sh;
            document.documentElement.scrollTop = sh;
        } else {
            check_count++;
            document.documentElement.scrollTop = 0
        }
    }
    function checkAutoScroll() {
        if(check_count > 10){
            window.clearInterval(i1);
            window.clearInterval(i2);
        }
    }

    function shuffle(array) {
        var idx = array.length, temporaryValue, randomIndex;
        while (idx !== 0) {
            var rnd = Math.floor(Math.random() * idx);
            idx -= 1;
            var temp = array[idx].innerHTML;
            array[idx].innerHTML = array[rnd].innerHTML;
            array[rnd].innerHTML = temp;
        }
    }
    let button = document.createElement("button");
    button.textContent = "Shuffle";
    button.classList.add('shuffle-button')
    var Title = document.querySelector('.galleryHeader .title');
    Title.innerHTML+="  ";
    Title.appendChild(button);
    $('.shuffle-button').click(function(){shuffle($('.slider-item'));});
})();