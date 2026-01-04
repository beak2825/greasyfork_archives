// ==UserScript==
// @name         Brofist.io Hack | Брофист.ио Чит
// @namespace    Brofist.io Hack
// @version      3.5.4
// @description  Hack Hide And Seek Brofist.io
// @author       Andranik Yeritsya(Злой Морти)
// @match        http://brofist.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40275/Brofistio%20Hack%20%7C%20%D0%91%D1%80%D0%BE%D1%84%D0%B8%D1%81%D1%82%D0%B8%D0%BE%20%D0%A7%D0%B8%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/40275/Brofistio%20Hack%20%7C%20%D0%91%D1%80%D0%BE%D1%84%D0%B8%D1%81%D1%82%D0%B8%D0%BE%20%D0%A7%D0%B8%D1%82.meta.js
// ==/UserScript==
document.onkeydown=function(e){
    var kc=e.keyCode;
    if(kc==109){
  mode.player.gpData.p.gravityScale=-1.5;
  mode.player.gpData.p.collisionResponse=0;
    }
 if(kc==107){
  mode.player.gpData.p.collisionResponse=0;
    }
};
document.onkeyup=function(e){
    var kc=e.keyCode;
    if(kc==109){
  mode.player.gpData.p.gravityScale=1;
  mode.player.gpData.p.collisionResponse=1;
    }
 if(kc==107){
  mode.player.gpData.p.collisionResponse=1;
    }
};