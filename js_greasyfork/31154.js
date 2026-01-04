// ==UserScript==
// @name         greatshack
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Vire colonne droite et change taille image noel shack avec "I" + active les gif
// @author       You
// @match        http://www.jeuxvideo.com/forums/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31154/greatshack.user.js
// @updateURL https://update.greasyfork.org/scripts/31154/greatshack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('forum-right-col').outerHTML = "";
    document.getElementById('forum-main-col').removeAttribute('class');
    let imgs = document.getElementsByClassName('img-shack');
    let curs = 0;
    (function()
     {
        let i = 0;
        while(i<imgs.length)
        {
            imgs[i].onerror = function(){
                this.onerror = function(){
                    this.src = this.src.replace('.gif', '.png');
                    this.src = this.src.replace('fichiers', 'minis');};
                this.src = this.src.replace('minis', 'fichiers');
            };
            imgs[i].src = imgs[i].src.replace('.png', '.gif');
            i++;
        }
    })();

    let normal = function(){
        let i = 0;
        while(i<imgs.length)
        {
            imgs[i].src = imgs[i].src.replace('fichiers', 'minis');
            imgs[i].src = imgs[i].src.replace('.jpg', '.png');
            imgs[i].src = imgs[i].src.replace('.jpeg', '.png');
            imgs[i].src = imgs[i].src.replace('.gif', '.png');
            imgs[i].height = 51;
            imgs[i].width = 68;
            i++;
        }
    };
    let grand = function(){
        let i = 0;
        while(i<imgs.length)
        {
            imgs[i].onerror = function(){
                this.src = this.src.replace('.png', '.jpg');
                this.onerror = function(){
                    this.src = this.src.replace('.jpg', '.gif');
                    this.onerror = function(){
                        this.src = this.src.replace('.gif', '.jpeg');
                    };
                };
            };
            imgs[i].src = imgs[i].src.replace('minis', 'fichiers');
            imgs[i].height = 200;
            imgs[i].width = 200;
            i++;
        }
    };
    let reel = function(){
        let i = 0;
        while(i<imgs.length)
        {
            imgs[i].removeAttribute('height');
            imgs[i].removeAttribute('width');
            i++;
        }
    };
    window.onkeypress = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        //console.log(key);
        if(key === 105)
            curs = (curs == 2) ? 0 : curs+1;
        if (curs === 0)
            normal();
        if (curs === 1)
            grand();
        if (curs === 2)
            reel();
    };
})();