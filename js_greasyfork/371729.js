// ==UserScript==
// @name         Strange Mod for ZOMBS.io
// @version      0.7
// @description  When the button play will be clicked, strange things will start...
// @author       DemostanisYt
// @match        http://zombs.io/*
// @namespace https://greasyfork.org/users/205154
// @downloadURL https://update.greasyfork.org/scripts/371729/Strange%20Mod%20for%20ZOMBSio.user.js
// @updateURL https://update.greasyfork.org/scripts/371729/Strange%20Mod%20for%20ZOMBSio.meta.js
// ==/UserScript==

function strangeMode() {
    document.getElementsByClassName('hud-intro-guide')[0].innerHTML = '<h1> Strange mod enabled! </h1>';
document.getElementsByClassName('btn btn-green hud-intro-play')[0].onclick = function(){
        setInterval(() => Game.currentGame.world.localPlayer.entity.fromTick.yaw = NaN)
  };
}
    document.getElementsByClassName('hud-intro-guide')[0].innerHTML = '<button class="btn btn-red strange-mod" style="width: 100%;">Enable strange mod</button><br><br>';

document.querySelector(".strange-mod").addEventListener("click", strangeMode)

                                                          /***********************************************************************\
                                                          //**********************script made by demostanis**********************\\
                                                          \***********************************************************************/