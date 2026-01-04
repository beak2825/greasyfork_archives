// ==UserScript==
// @name        wormate.io anti anti ad blocker
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @version     0.2
// @description wormate.io anti anti ad blocker (use to bypass "Oops.. Looks like you're using an ad blocker.. Please disable your ad blocker! Ads help us to keep the game active and growing. The game will continue in .. n")
// @author      BZZZZ
// @include     https://wormate.io/
// @include     http://wormate.io/
// @grant       none
// @run-at      document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/421480/wormateio%20anti%20anti%20ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/421480/wormateio%20anti%20anti%20ad%20blocker.meta.js
// ==/UserScript==

{
    const stl = document.createElement("STYLE");
    stl.textContent = "DIV#mm-action-buttons{display:none!important;}DIV#mm-action-login{width:320px;}INPUT[type=\"button\"].aabi{width:100%;height:60px;font-size:xx-large;}";
    document.getElementsByTagName("HEAD")[0].appendChild(stl);
    const ma = document.getElementById("mm-action-buttons");
    ma.style.display = "none";
    const mp = document.createElement("INPUT");
    mp.type = "button";
    mp.value = "Play";
    mp.setAttribute("onclick", "document.getElementById(\"adbl-continue\").click();");
    mp.classList.add("aabi");
    ma.parentNode.appendChild(mp);
    const ml = document.getElementById("mm-action-login");
    const mlo = document.createElement("INPUT");
    mlo.type = "button";
    mlo.value = "LogIn";
    mlo.classList.add("aabi");
    ml.replaceChild(mlo, ml.children[0]);
    ma.removeChild(ml);
    const mlc = document.createElement("CENTER");
    mlc.appendChild(ml);
    document.getElementById("settings-view").appendChild(mlc);
}