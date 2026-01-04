// ==UserScript==
// @name         EZ Navigation
// @version      1.3
// @description  Replace old links & adds new links for easier navigation.
// @author       Misery / bukubanz#9152
// @include      /fairview\.deadfrontier\.com/
// @exclude      fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21
// @exclude      https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21
// @grant        none
// @require      https://greasyfork.org/scripts/32816-append-script/code/Append%20Script.js?version=215508
// @noframes
// @run-at       document-idle
// @namespace
// @license License Type; License Homepage
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/431742/EZ%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/431742/EZ%20Navigation.meta.js
// ==/UserScript==

(function() {
    var elements = {};
    function appendScript(scriptContent) {
        var script = document.createElement("script");
        script.text = scriptContent;
        document.getElementsByTagName("body")[0].appendChild(script);
    }
    appendScript(appendScript.toString());
// Outpost
    var outpostImg = document.createElement("img");
    outpostImg.src = "https://i.imgur.com/O3oqMPN.png";
    outpostImg.src = "https://i.imgur.com/O3oqMPN.png";
    outpostImg.height = "60";
    elements.outpostLink = document.createElement("a");
    elements.outpostLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php";
    elements.outpostLink.appendChild(outpostImg);
    elements.outpostLink.style.float += " left";
    elements.outpostLink.style.textAlign = "center";
    elements.outpostLink.style.marginLeft = "-6px";
// Credit Shop
    var creditImg = document.createElement("img");
    creditImg.src = "https://i.imgur.com/OI9zSwX.png";
    creditImg.src = "https://i.imgur.com/OI9zSwX.png";
    creditImg.height = "60";
    elements.creditLink = document.createElement("a");
    elements.creditLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=28";
    elements.creditLink.appendChild(creditImg);
    elements.creditLink.style.float += " left";
    elements.creditLink.style.textAlign = "center";
    elements.creditLink.style.marginLeft = "-13px";
// Forum
    var forumImg = document.createElement("img");
    forumImg.src = "https://i.imgur.com/vWR4foN.png";
    forumImg.src = "https://i.imgur.com/vWR4foN.png";
    forumImg.height = "60";
    elements.forumLink = document.createElement("a");
    elements.forumLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum";
    elements.forumLink.appendChild(forumImg);
    elements.forumLink.style.float += " left";
    elements.forumLink.style.textAlign = "center";
    elements.forumLink.style.marginLeft = "-13px";
// Market
    var marketImg = document.createElement("img");
    marketImg.src = "https://i.imgur.com/GxniNWY.png";
    marketImg.src = "https://i.imgur.com/GxniNWY.png";
    marketImg.height = "60";
    elements.marketLink = document.createElement("a");
    elements.marketLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35";
    elements.marketLink.appendChild(marketImg);
    elements.marketLink.style.float += " left";
    elements.marketLink.style.textAlign = "center";
    elements.marketLink.style.marginLeft = "-13px";
// Bank
    var bankImg = document.createElement("img");
    bankImg.src = "https://i.imgur.com/ZfFSTkE.png";
    bankImg.src = "https://i.imgur.com/ZfFSTkE.png";
    bankImg.height = "60";
    elements.bankLink = document.createElement("a");
    elements.bankLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=15";
    elements.bankLink.appendChild(bankImg);
    elements.bankLink.style.float += " left";
    elements.bankLink.style.textAlign = "center";
    elements.bankLink.style.marginLeft = "-13px";
// Storage
    var storageImg = document.createElement("img");
    storageImg.src = "https://i.imgur.com/4Y5Zsiz.png";
    storageImg.src = "https://i.imgur.com/4Y5Zsiz.png";
    storageImg.height = "60";
    elements.storageLink = document.createElement("a");
    elements.storageLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50";
    elements.storageLink.appendChild(storageImg);
    elements.storageLink.style.float += " left";
    elements.storageLink.style.textAlign = "center";
    elements.storageLink.style.marginLeft = "-13px";
// Logout
    var logoutImg = document.createElement("img");
    logoutImg.src = "https://i.imgur.com/hRgTcyV.png";
    logoutImg.src = "https://i.imgur.com/hRgTcyV.png";
    logoutImg.height = "60";
    elements.logoutLink = document.createElement("a");
    elements.logoutLink.href = getLogoutLink();
    elements.logoutLink.appendChild(logoutImg);
    elements.logoutLink.style.float = "right";
    elements.logoutLink.style.marginRight = "-6px";
    elements.logoutLink.style.textAlign = "center";
// Profile
    var profileImg = document.createElement("img");
    profileImg.src = "https://i.imgur.com/cTQxxz4.png";
    profileImg.src = "https://i.imgur.com/cTQxxz4.png";
    profileImg.height = "60";
    elements.profileLink = document.createElement("a");
    elements.profileLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=profile";
    elements.profileLink.style.float = "right";
    elements.profileLink.appendChild(profileImg);
    elements.profileLink.style.textAlign = "center";
    elements.profileLink.style.marginRight = "-13px";
// The Yard
    var yardImg = document.createElement("img");
    yardImg.src = "https://i.imgur.com/ynkDl0H.png";
    yardImg.src = "https://i.imgur.com/ynkDl0H.png";
    yardImg.height = "60";
    elements.yardLink = document.createElement("a");
    elements.yardLink.href = "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24";
    elements.yardLink.style.float = "right";
    elements.yardLink.appendChild(yardImg);
    elements.yardLink.style.textAlign = "center";
    elements.yardLink.style.marginRight = "-13px";

    function getLogoutLink(){
        return $("img[name=logout]").parent()[0].href;
    }

    var table = document.getElementsByTagName("table")[7];
    table.innerHTML = "<div id=navigation_holder>";
    dst = document.getElementById("navigation_holder");
    dst.style.overflow = "hidden";

    for(var element in elements){
        if(element.indexOf("Link") > -1){
            dst.appendChild(elements[element]);
        }
    }
    table.style.backgroundImage = "url()";
    table.style.transform = "scaleY(1.2)";
    table.style.position = "relative";
    table.style.top = "0px";

    var cookieCrumble = document.getElementsByTagName("tr")[1];
    cookieCrumble.style.height = "220px";
})();