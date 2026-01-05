// ==UserScript==
// @name          Speedrun.com Games Parser
// @namespace     dsrhswb
// @version       1.00
// @description   Makes games in the API readable
// @run-at        document-end
// @include       https://www.speedrun.com/api/v1/games*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/28840/Speedruncom%20Games%20Parser.user.js
// @updateURL https://update.greasyfork.org/scripts/28840/Speedruncom%20Games%20Parser.meta.js
// ==/UserScript==

var charset = document.createElement("meta"); //Add character encoding?
charset.setAttribute("charset", "utf-8");
document.getElementsByTagName("head")[0].appendChild(charset);

var stylesheet1 = document.createElement("link"); //Add themes
stylesheet1.setAttribute("rel", "stylesheet");
stylesheet1.setAttribute("type", "text/css");
stylesheet1.setAttribute("href", "/assets/css/vendor-speedruncom.min.css");
document.getElementsByTagName("head")[0].appendChild(stylesheet1);
var stylesheet2 = document.createElement("link");
stylesheet2.setAttribute("rel", "stylesheet");
stylesheet2.setAttribute("type", "text/css");
stylesheet2.setAttribute("href", "/assets/theme.php?theme=default");
document.getElementsByTagName("head")[0].appendChild(stylesheet2);

var elem = document.getElementsByTagName("BODY")[0].firstChild;
elem.style.visibility = "hidden";
elem.style.position = "absolute"; //Hiding the raw data without destroying it
var raw = JSON.parse(elem.innerHTML);
var data = raw.data;
var mainDiv = document.createElement("div");
mainDiv.className = "resultListing";

data.forEach(function(game) {
    var gameDiv = document.createElement("div");
    gameDiv.className = "listcell";
//  gameDiv.style = "min-height: 230px";
    mainDiv.appendChild(gameDiv);
    
    var a = document.createElement("a");
    a.href = "/" + game.weblink.split("/")[3];
    gameDiv.appendChild(a);
    
    var img = document.createElement("img");
    img.className = "cover-128 border";
    img.src = "/themes/" + game.weblink.split("/")[3] + "/cover-128.png";
    img.onerror = function(){img.src = "/themes/404/cover-128.png"};
    img.alt = "";
    a.appendChild(img);
    
    var name = document.createElement("div");
    name.innerHTML = game.names.international;
    a.appendChild(name);
});
document.getElementsByTagName("BODY")[0].appendChild(mainDiv);

var pager = document.createElement("div");
pager.className = "pager";

var page0 = document.createElement("a");
if (raw.pagination.links[0].rel == "next") {
    page0.className = "next";
    page0.innerHTML = "Next";
} else {
    page0.className = "prev";
    page0.innerHTML = "Previous";
}
page0.href = raw.pagination.links[0].uri;
pager.appendChild(page0);

if (raw.pagination.links[1] != undefined && raw.pagination.links[1].rel == "next") {
    var page1 = document.createElement("a");
    page1.className = "next";
    page1.innerHTML = "Next";
    page1.href = raw.pagination.links[1].uri;
    pager.appendChild(page1);
}

document.getElementsByTagName("BODY")[0].appendChild(pager);
