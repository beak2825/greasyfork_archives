// ==UserScript==
// @name         Google Images Randomizer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33846/Google%20Images%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/33846/Google%20Images%20Randomizer.meta.js
// ==/UserScript==

/**
 *
 *
 */

////////////////////////////////////////////////////////////////////////
//                       RANDOM-GOOGLE-IMAGES.JS                      //
////////////////////////////////////////////////////////////////////////

(function(){
    'use strict';

    /*
        USAGE:
            ..
    */

    const host = document.querySelector('#sfdiv');
    const ston = (s)=>Number('0x'+s);
    const mask = (l)=>ston('ffffffffffffffff'.substr(0,l||0));
    const rand_fd = function(l,e){
        return Math.floor(Math.random()*mask(l)).toString(16)+e;
    };

    const next = ()=>'https://www.google.de/search?client=windows&hs=8TF&tbm=isch&sa=1&q=%22'+rand_fd(8,'.')+'%22';
    window.rurl = next();

////////////////////////////////////////////////////////////////////////

    const button = document.createElement('div');

    button.innerHTML=`
    <div id="random_web" onclick="window.location.href=rurl">
        <style>
            #random_web     {
                width: 35px;
                height: 35px;
                background-color: gray;
                background-image: url(https://cdn.discordapp.com/avatars/147556783412477952/50d3f9d47bbe9ec84ce1e157ce812a64.png?size=128);
                position: absolute;
                background-position: 50%;
                z-index: 50000;
                background-size: 100%;
                top: 5px;
                right: -41px;
            }
        </style>
    </div>
    `;

////////////////////////////////////////////////////////////////////////

    host.appendChild(button);

})();