// ==UserScript==
// @name         Shootz.io Hack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Powerful Shootz.io Hack
// @author       coder x64
// @match        *://*.shootz.io/
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420895/Shootzio%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/420895/Shootzio%20Hack.meta.js
// ==/UserScript==

document.title = "Shootz.io Hacked"
$('div[style*="width:336; height: 280"]').remove()
$('th#col1[style*="display"]').remove()
$('th#youtubeCol2').remove()
$('th#youtubeCol3').remove()
$('a#server1').remove()
$('a#server2').remove()
$('a#server3').remove()
$('a#server4').remove()

$("button#signDiv-signIn.button").css("background-color", "red");
$("button#signDiv-signIn.button").html("Lets Hack");
$("div#server").append("<b>Servers List:-</b><br><li><a onclick=goToServer('na') style=cursor:pointer;>North America</a></li><li><a onclick=goToServer('eu') style=cursor:pointer;>Europe</a></li>");
$("div#server").height(80);
$("b").css("color", "red");
$("a").css("color", "purple");
$("li").css("color", "purple");
$("div#spawnMessage").css("color", "red");

signDivSignIn['onclick'] = function() {
    signDivSignIn['style']['display'] = 'none';
    signDivLoading['style']['display'] = 'inline-block';
        socket['emit']('signIn', {
            username: signDivUsername['value'],
            skin: selectedSkin
        })};

spawnMessage["innerHTML"] = "Shootz.io Hacked"

var button1 = "<button onclick=signDivSignIn[&quot;onclick&quot;]() style=position:absolute;top:100;left:80;cursor:pointer;>Safe Respawn</button>";
var button2 = "<button onclick=socket['emit']('signIn'); style=position:absolute;top:140;left:80;cursor:pointer;>Restart Server</button>";
$("body").append(button1, button2);