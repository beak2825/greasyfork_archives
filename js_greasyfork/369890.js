// ==UserScript==
// @name         Modded Highscore
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        flappybird.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369890/Modded%20Highscore.user.js
// @updateURL https://update.greasyfork.org/scripts/369890/Modded%20Highscore.meta.js
// ==/UserScript==

(function() {
    'use strict';

    localStorage.setItem("highScore", "ur a thot");

    restart = function(){$("canvas").trigger("gameRestart");pipes.removeAllChildren();createjs.Tween.get(start).to({y:start.y+10},50).call(removeStart);counter.text=6000000;counterOutline.text=6000000;counterOutline.alpha=0;counter.alpha=0;counter.font="86px 'Flappy Bird'";counterOutline.font=counter.font;counter.y=150+outerPadding;counterOutline.y=counter.y;counterShow=false;highScore.alpha=0;highScoreOutline.alpha=0;pipeDelay=masterPipeDelay;dead=false;started=false;startJump=false;createjs.Tween.removeTweens(bird);bird.x=startX;bird.y=startY;bird.scaleX=-0.4;bird.scaleY=-0.4;bird.rotation=0;rd=0;createjs.Tween.get(bird,{loop:true}).to({y:startY+wiggleDelta},380,createjs.Ease.sineInOut).to({y:startY},380,createjs.Ease.sineInOut);}

    manifest = [{src:"img/bird.png",id:"bird"},{src:"https://pics.me.me/fox-man-breaks-in-to-houses-to-ews-exterminate-thots-25859356.png",id:"background"},{src:"http://1.bp.blogspot.com/-S2r6WiqLZEw/U5ZIM3dhjuI/AAAAAAAAAcs/6E1SPHADXS4/s1600/thot.jpg",id:"ground"},{src:"https://pbs.twimg.com/media/DTZ1HgjW4AAK9m7.jpg",id:"pipe"},{src:"img/restart.png",id:"start"},{src:"img/score.png",id:"score"},{src:"img/share.png",id:"share"},{src:"img/add-to-leaderboard.png",id:"leaderboard"},{src:"fonts/FB.eot"},{src:"fonts/FB.svg"},{src:"fonts/FB.ttf"},{src:"fonts/FB.woff"}];
    loader.loadManifest(manifest);
    bird.scaleX = -0.4;
    bird.scaleY = -0.4;
})();