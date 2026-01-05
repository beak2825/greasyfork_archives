// ==UserScript==
// @name       OnVista Depot Beautifier
// @namespace  http://*onvista.de/
// @version    0.3
// @description  makes the onvista depot look prettier
// @include        http://my.onvista.de/*
// @run-at         document-body
// @copyright  2014+, Daniel Kirstenpfad
// @downloadURL https://update.greasyfork.org/scripts/4425/OnVista%20Depot%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/4425/OnVista%20Depot%20Beautifier.meta.js
// ==/UserScript==

var alliFrames, thisiFrame,css;

function remove(id)
{
    return (elem=document.getElementById(id)).parentNode.removeChild(elem);
}

function replaceContentInContainer(matchClass, content) {
    var elems = document.getElementsByTagName('*'), i;
    for (i in elems) {
        if((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ')
                > -1) {
            elems[i].innerHTML = content;
            elems[i].id = "";
            elems[i].className = "";
        }
    }
}

document.getElementById('ONVISTA').style.paddingTop="0px";

css = document.getElementById('PROMOLINK');
css = "";

document.getElementById('WALLPAPER').style.height="0px";

alliFrames = document.getElementsByTagName('iframe');
for (var i = 0; i < alliFrames.length; i++) {
    thisiFrame = alliFrames[i];
    // do something with iFrame
	thisiFrame.width = 0;
	thisiFrame.height = 0;
}

replaceContentInContainer("FOOTER_BANNER","");
replaceContentInContainer("MEGASIZE_BANNER","");
replaceContentInContainer("SKYSCRAPER","");
replaceContentInContainer("LINK_LISTE FEEDBACK_FAQ","");
replaceContentInContainer("CONTAINER2","");
replaceContentInContainer("PROMOLINK","");
replaceContentInContainer("SOCIALMEDIA_USER_STATUS","");
replaceContentInContainer("BREADCRUMB","");