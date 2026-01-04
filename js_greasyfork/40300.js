// ==UserScript==
// @name     下集按钮/风车动漫
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给风车动漫增加播放下一集的按钮
// @author       tumuyan
// @match        http://www.fengchedm.com/playd/*
// @match        http://www.fengchedm.com/play*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40300/%E4%B8%8B%E9%9B%86%E6%8C%89%E9%92%AE%E9%A3%8E%E8%BD%A6%E5%8A%A8%E6%BC%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/40300/%E4%B8%8B%E9%9B%86%E6%8C%89%E9%92%AE%E9%A3%8E%E8%BD%A6%E5%8A%A8%E6%BC%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

var thisURL = document.URL;
var after=thisURL.replace(/.*-\d*-/,"");
var before=thisURL.replace(after,"");
var process = parseInt(after);
    after=after.replace(process,"");
process++;
    //alert(process);
var nextURL = before+process+after;
// alert(thisURL+'\n'+nextURL);
    var div = document.createElement("div");
    div.id="nextBottom";
div.innerHTML = '<a id="nextbot" href='+ nextURL + '>NEXT</a>';
document.body.appendChild(div);

var cssbot = document.createElement("style");
    cssbot.type="text/css";
 //   cssbot.innerHTML =' a#nextbot {color: #eec !important;position: fixed !important;display: block !important;padding: 4px !important;border-radius: 16px 0px 0px 16px;width: 66px !important;max-height: 120px !important;overflow: hidden !important;top: 140px;right: -12px;font-size: 18px !important;line-height: 30px !important;background: #456 !important;box-shadow: 5px 3px 6px #808080;-o-transition: .3s ease-in;-moz-transition: .3s ease-in;-webkit-transition: .3s ease-in;z-index: 999 !important;} a#nextbot:hover    {color: #233 !important; border-radius: 16px 0px 0px 16px;  ;background: #eec !important;box-shadow: 5px 3px 6px #996;;  -o-transition: .3s ease-in;-moz-transition: .3s ease-in;-webkit-transition: .3s ease-in;} ';
// cssbot.innerHTML =' body > div:hover > a#nextbot{    color: #eeeecc !important;    position: fixed !important;    display: block !important;    padding: 4px !important;    border-radius: 16px 0px 0px 16px;    width: 66px !important;    max-height: 120px !important;    overflow: hidden !important;    top: 140px;    right: -12px;    font-size: 18px !important;    line-height: 30px !important;    background: #445566 !important;    box-shadow: 5px 3px 6px #808080;    -o-transition: .3s ease-in;    -moz-transition: .3s ease-in;    -webkit-transition: .3s ease-in;    z-index: 999 !important;}   body > div > a#nextbot{    color: #eeeecc00 !important;    position: fixed !important;    display: block !important;    padding: 4px !important;    border-radius: 16px 0px 0px 16px;    width: 66px !important;    max-height: 120px !important;    overflow: hidden !important;    top: 140px;    right: -12px;    font-size: 18px !important;    line-height: 30px !important;    background: #44556600 !important;    -o-transition: .3s ease-in;    -moz-transition: .3s ease-in;    -webkit-transition: .3s ease-in;    z-index: 999 !important;} ';
  cssbot.innerHTML =' body > div#nextBottom:hover > a#nextbot{    color: #eeeecc !important;    position: fixed !important;    display: block !important;    padding: 4px !important;    border-radius: 16px 0px 0px 16px;    width: 66px !important;    max-height: 120px !important;    overflow: hidden !important;    top: 140px;    right: -12px;    font-size: 18px !important;    line-height: 30px !important;    background: #445566 !important;    box-shadow: 5px 3px 6px #808080;    -o-transition: .3s ease-in;    -moz-transition: .3s ease-in;    -webkit-transition: .3s ease-in;    z-index: 999 !important;}   body > div#nextBottom > a#nextbot{    color: #eeeecc00 !important;    position: fixed !important;    display: block !important;    padding: 4px !important;    border-radius: 16px 0px 0px 16px;    width: 66px !important;    max-height: 120px !important;    overflow: hidden !important;    top: 140px;    right: -12px;    font-size: 18px !important;    line-height: 30px !important;    background: #44556600 !important;    -o-transition: .3s ease-in;    -moz-transition: .3s ease-in;    -webkit-transition: .3s ease-in;    z-index: 999 !important;}  body > div#nextBottom {    color: #ffffff00 !important;    position: fixed !important;    display: block !important;    padding:0px !important;       width: 166px !important;  height: 100% !important;    overflow: hidden !important;    top:  0px;    right: 0px;    background: #ffffff00 !important;       z-index: 998 !important;}  ';
    document.head.appendChild(cssbot);
})();

