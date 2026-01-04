// ==UserScript==
// @name         ridethepinee
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  make money online
// @author       Bboy Tech
// @include      https://ridethepinee.com/*
// @icon         https://www.google.com/s2/favicons?domain=ridethepinee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432629/ridethepinee.user.js
// @updateURL https://update.greasyfork.org/scripts/432629/ridethepinee.meta.js
// ==/UserScript==

(function script() {
    'use strict';
    if(location.href.match("/7/")) {
           var claimbTimer = setInterval (function() {playb(); }, Math.floor(Math.random() * 1000) + 11000);
           var claimTimer = setInterval (function() {play(); }, Math.floor(Math.random() * 50000) + 50100);

        }
    else if(location.href.match("/top-6-running-backs-of-all-time/")){
            document.getElementsByClassName("attachment-random-thumbnails-sidebar size-random-thumbnails-sidebar wp-post-image")[0].click();
    }
    else if(location.href.match("ridethepinee.com/top")){
        var interval3 = setInterval(function() {interval4(); }, Math.floor(Math.random() * 1000) + 11000);
        var refTimer = setInterval (function() {ref(); }, Math.floor(Math.random() * 60000) + 60100);
    }
    else{
        document.getElementsByClassName("attachment-post-thumbnail size-post-thumbnail wp-post-image")[0].click();
    }
    function interval4()
    {
            document.getElementsByClassName("temp-wraper visible display-none")[0].click();
            var claimcTimer = setTimeout (function() {playc(); }, Math.floor(Math.random() * 100) + 200);
    }

    function playc()
    {
       var test = document.getElementsByClassName("col-xs-12 col-md-8 col-lg-8")[0].innerHTML;
        if(test.match('class="btn n-btn" style='))
        {

        }
        else{ var link = window.location.href;
                        if(location.href.match("/6/")) {
                            link = link.replace("6/?", "7/?");
                            location.href = link;
                        }
                        else if(location.href.match("/5/")) {
                            link = link.replace("5/?", "6/?");
                            location.href = link;
                        }
                        else if(location.href.match("/4/")) {
                            link = link.replace("4/?", "5/?");
                            location.href = link;
                        }
                        else if(location.href.match("/3/")) {
                            link = link.replace("3/?", "4/?");
                            location.href = link;
                        }
                        else if(location.href.match("/2/")) {
                            link = link.replace("2/?", "3/?");
                            location.href = link;
                        }
                        else {
                            link = link.replace("/?", "/2/?");
                            location.href = link;
                        } }
    }
    function playb(){
        var test = document.getElementsByClassName("seconds")[0].innerHTML;
        if(Number(test) == "00"){
            document.getElementsByClassName("btn n-btn")[0].click();
        }

    }
    function play(){
            document.getElementsByClassName("btn n-btn")[0].click();
        }
    function ref(){
           var linka = window.location.href;
           location.href = linka;
        }


})();