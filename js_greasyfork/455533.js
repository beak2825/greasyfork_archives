// ==UserScript==
// @name        Taimanin Screen
// @description 対魔忍のゲーム画面以外を疎放的に非表示にするスクリプト。
// @author      Ginoa AI
// @namespace   https://greasyfork.org/ja/users/119008-ginoa-ai
// @version     4.1
// @match       https://pc-play.games.dmm.com/play/taimanin_rpg/
// @match       https://pc-play.games.dmm.co.jp/play/taimanin_rpgx/
// @match       https://play.games.dmm.co.jp/game/taimanin_rpgx
// @icon        https://www.lilith-soft.com/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/455533/Taimanin%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/455533/Taimanin%20Screen.meta.js
// ==/UserScript==
var css = function(){/*
  html {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  #game_frame {
    scrolling: no;
    position: fixed;
    width: 1280px !important;
    height: 751px !important;
    left: 0px;
    top: 0px;
    z-index: 2147483646 !important;
  }
  dialog {
    overflow: scroll;
    width: 98% !important;
    height: 100vh !important;
    padding: 1% !important;
    left: 0px !important;
    top: 0px !important;
    z-index: 2147483647 !important;
  }
*/}.toString().match(/\n([\s\S]*)\n/)[1];
var style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);

document.querySelector('link[rel="icon"]').href = "https://www.lilith-soft.com/images/favicon.ico";

var canvas = "<div style=\"background-color: #FFFFFF; z-index: 2147483645; width: 100%; height: 100vh; left: 0%; top: 0%;\"></div>";
document.documentElement.insertAdjacentHTML("afterbegin", canvas);

var game;
var MarginTop;
var GameWidth;
var GameHeight;
var observer = new MutationObserver(() => {
    game = document.querySelector('iframe[id="game_frame"]');
    if (game) {
        observer.disconnect();
        MarginTop = -31;
        GameWidth = 1280;
        GameHeight = 720;
        game.style.cssText += "margin-top: " + MarginTop + "px !important;";
        game.setAttribute("scrolling", "no");
        resize();
    }
});
observer.observe(document.body, { childList: true, subtree: true });

var resize = function(){
    var Scale = Math.min.apply(null, [
        window.innerWidth / GameWidth,
        window.innerHeight / GameHeight,
    ]);
    game.style.transform = "scale(" + Scale + ")";

    var ChangeLeft = (GameWidth - (GameWidth * Scale)) / 2;
    var ChangeMarginTop = (game.getBoundingClientRect().top - parseInt(game.style.marginTop) - (MarginTop * Scale)) * -1;
    game.style.left = -ChangeLeft + "px";
    game.style.cssText += "margin-top: " + ChangeMarginTop + "px !important;";
};

window.onresize=function(){
    resize();
};