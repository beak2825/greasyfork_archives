// ==UserScript==
// @name         sugar2
// @namespace    http://tampermonkey.net/
// @version      2025-03-12
// @description  sugar
// @author       You
// @match        https://sugarloafgames.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sugarloafgames.com
// @grant        none
// @licesne      fart
// @downloadURL https://update.greasyfork.org/scripts/535069/sugar2.user.js
// @updateURL https://update.greasyfork.org/scripts/535069/sugar2.meta.js
// ==/UserScript==

let overlayHTML = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet">
<div id="box">
    <div class="main" id="box2">
        <center><p class="pdark" id="pdark"> KhanHack </p></center>
        <center>
            <button onclick="document.getElementsByClassName('btn play-btn btn-free-play freePaySignupAdd')[0].click()">Send Code</button>
        </center>
        <button id="getPlay">Get Play</button>
    </div>
</div>

<style>
#box {
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
}
#box2 {
    padding: 15px;
    margin-bottom: 5px;
    display: grid;
    border-radius: 25px;
}
section {
    display: flex;
    justify-content: space-between;
    margin: 5px;
}
.main {
    background-color: #66a83d;
    letter-spacing: 2px;
    font-size: 11px;
    font-family: 'Roboto', sans-serif;
    color: white;
    -webkit-user-select: all;
}
.pdark {
    border-bottom: 2px solid white;
}

#iframeMainContainer {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 10px;
    margin-top: 50px;
}

.iframe-container {
    position: relative; /* <-- remove 'fixed' */
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
}
iframe {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
`

if(window.location.href == "https://sugarloafgames.com/home") {
    window.location.href = "https://sugarloafgames.com"
}
function get(x) { return document.getElementById(x); }

// Add overlay to page
let overlay = document.createElement("div");
overlay.innerHTML = overlayHTML;
document.body.appendChild(overlay);



jQuery.validator.methods.validEmail = function (value, element) {
      if (value == "") return true;
      var temp1;
      temp1 = true;
      var ind = value.indexOf("@");
      var str2 = value.substr(ind + 1);
      var str3 = str2.substr(0, str2.indexOf("."));
      if (
        str3.lastIndexOf("-") == str3.length - 1 ||
        str3.indexOf("-") != str3.lastIndexOf("-")
      )
        return false;
      var str1 = value.substr(0, ind);
      if (
        str1.lastIndexOf("_") == str1.length - 1 ||
        str1.lastIndexOf(".") == str1.length - 1 ||
        str1.lastIndexOf("-") == str1.length - 1
      )
        return false;
      str =
        /(^[a-zA-Z0-9\+\._-]{0,1})+([a-zA-Z0-9\+\._-]{0,1})+@([a-zA-Z0-9]+[-]{0,1})+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,9})$/;
      temp1 = str.test(value);
      return temp1;
    }





// Add a flexbox container to hold all iframes side by side
let mainContainer = document.createElement("div");
mainContainer.id = "iframeMainContainer";
document.body.appendChild(mainContainer);

// Track iframe count
let iframeCount = 0;

document.getElementById("getPlay").addEventListener("click", function() {
    iframeCount++;

    let rand = (Math.random() + 1).toString(36).substring(2).replace(/[0-9]/g, '');
    let pass = 'Sfnhjfg$17285@#hnsjf';

    const container = document.createElement("div");
    container.className = "iframe-container";

    const iframe = document.createElement("iframe");
    iframe.id = 'iframeId_' + iframeCount;
    iframe.src = "https://sugarloafgames.com/";

    container.appendChild(iframe);
    document.getElementById('iframeMainContainer').appendChild(container);

    setTimeout(function() {
        let content = document.getElementById('iframeId_' + iframeCount).contentWindow;
        content.document.getElementById('firstName').value = 'firstname';
        content.document.getElementById('email').value = "kyrayagami42+" + rand + "@gmail.com";
        content.document.getElementById('password').value = pass;
        content.document.getElementById("password_confirmation").value = pass;
    }, 1000);
});

