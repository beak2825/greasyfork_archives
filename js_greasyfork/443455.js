// ==UserScript==
// @name         Youtube-Geofind button for google maps
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  add a button to open Youtube-Geofind at the actual google maps coordinates
// @author       Guile93 (twitch.tv/Guile)
// @license MIT 
// @match        https://www.google.com/maps/*
// @match        https://www.google.fr/maps/*
// @icon         https://mattw.io/youtube-geofind/img/icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443455/Youtube-Geofind%20button%20for%20google%20maps.user.js
// @updateURL https://update.greasyfork.org/scripts/443455/Youtube-Geofind%20button%20for%20google%20maps.meta.js
// ==/UserScript==
(function() {
    var css = `
      .btn{
            background-color: #CC0000;
            border: 1px solid brown;
            height:30px;
            margin-right:5px;
            border-radius: 6px;
            box-shadow: rgba(27, 31, 35, .1) 0 1px 0;
            box-sizing: border-box;
            color: #fff;
            cursor: pointer;
            display: inline-block;
            font-family: -apple-system,system-ui,"Segoe UI\",Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji";
            font-size: 12px;
            font-weight: 600;
            line-height: 20px;
            padding: 0px 16px;
            position: relative;
            float: right;
            text-align: center;
            touch-action: manipulation;
            vertical-align: middle;
          }
          .btn:hover {
            background-color: #FF0000;
          }
          `
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.appendChild(document.createTextNode(css));
    head.appendChild(s);
    let btn = document.createElement("button");
    btn.innerHTML = "YG";
    btn.name="goGeofind";
    btn.className="btn";
    btn.addEventListener("click", function () {
        let regexp = /(-?\d+\.\d+),(-?\d+\.\d+)/gi;
        let txt=window.location.href;
        let coords = txt.match(regexp)
        if(coords){
            window.open('https://mattw.io/youtube-geofind/location?location='+coords+'&radius=5&doSearch=true');
        }else{alert('erreur de coordonnées veuillez vous déplacer ou rafraichir');}
    });
    var target=document.getElementById("downgrade");
    target.appendChild(btn);
})();