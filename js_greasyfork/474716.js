// ==UserScript==
// @name         test
// @description  test用
// @namespace    test
// @version      0.5
// @author       You
// @match        https://unitemate.com/*
// @grant        none
// @license      claris
// @downloadURL https://update.greasyfork.org/scripts/474716/test.user.js
// @updateURL https://update.greasyfork.org/scripts/474716/test.meta.js
// ==/UserScript==
//var alrtSound = new Audio ("https://docs.google.com/uc?id=1sA9DziyxjyaJL9LJhaLlydtXGb-2OcHZ");
//alrtSound.muted = true;
(function() {
    //Notification.requestPermission();
    //var notification = new Notification('test');
    setInterval(function(){
        //alrtSound.muted = false;
        //alrtSound.play ();

        const soundEffect = new Audio();
        soundEffect.autoplay = true;
        soundEffect.src = "https://docs.google.com/uc?id=1sA9DziyxjyaJL9LJhaLlydtXGb-2OcHZ";
        //var notification = new Notification('test');
    }, 950);
})();