// ==UserScript==
// @name         MyAnimeList(MAL) - PM Enhancement Suite
// @version      1.1.0
// @description  Change the message layout to that of the comment section.
// @author       Cpt_mathix
// @match        *://myanimelist.net/mymessages.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/16684/MyAnimeList%28MAL%29%20-%20PM%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/16684/MyAnimeList%28MAL%29%20-%20PM%20Enhancement%20Suite.meta.js
// ==/UserScript==

var messages;
var url = document.location.href;
if (url.indexOf("go=read") > -1 && url.indexOf("threadid") > -1) {
    messages = document.querySelector('#content > div > div > div > table');
    init();
} else if (url.indexOf("go=send") > -1 && url.indexOf("threadid") > -1) {
    messages = document.querySelector('#content > div > div > table');
    init();
}

async function init() {
    messages.setAttribute("cellspacing", "0");

    var count = 0;
    var elements = messages.querySelectorAll('tbody > tr:nth-child(n)');

    for (var i = 0; i < elements.length; i++) {
        var time = elements[i].querySelector('td:nth-child(1)').textContent;
        var name = elements[i].querySelector('td:nth-child(2)').textContent.replace(':','');
        var link = elements[i].querySelector('td:nth-child(2)').innerHTML.replace(/:|ml8|mr8/g,'');
        var text = elements[i].querySelector('td:nth-child(3)').innerHTML;

        var thumb;
        if (GM_getValue('PM_EnhancementSuite_V0#' + name) === undefined) {
            thumb = await getUserThumb(name);
            if (thumb) {
                GM_setValue('PM_EnhancementSuite_V0#' + name, thumb);
            }
        } else {
            thumb = GM_getValue('PM_EnhancementSuite_V0#' + name);
        }

        count++;
        elements[i].innerHTML = changeStyle(time, name, link, text, count, thumb);

        if (count == 1) {
            count = -1;
        }
    }
    messages.setAttribute("table-layout", "fixed");
    messages.setAttribute("style", "width:" + messages.parentNode.style.width);

    var images = messages.querySelectorAll("img");
    for (var j = 0; j < images.length; j++) {
        images[j].onload = function(el) {
            if (el.target.width > 744) {
                el.target.width = 744;
            }
        };
    }
}

function changeStyle(time, name, link, text, bgColor, thumb) {
    var strVar = "";
    strVar += "<tr width=\"810px\" class=\"borderClass bgColor" + bgColor + "\">";
    strVar += "		<td valign=\"top\" width=\"60\" class=\"borderClass bgColor" + bgColor + "\" style=\"border: 0;\"><div class=\"picSurround\">";
    strVar += " 		<a href=\"\/profile\/" + name + "\"><img src=\"" + thumb + "\" border=\"0\"><\/a><\/div><\/td>";
    strVar += "		<td class=\"borderClass bgColor" + bgColor + "\" align=\"left\" style=\"border: 0;\" valign=\"top\">";
    strVar += "			<div>";
    strVar += "				<div><a href=\"\/profile\/" + name + "\">" + link + "<\/a> <small><span style=\"font-weight: normal;\"> | " + time + "<\/span><\/small><\/div>";
    strVar += "				<div class=\"spaceit\">" + text + "<\/div>";
    strVar += "			<\/div>";
    strVar += "		<\/td>";
    strVar += "<\/tr>";

    return strVar;
}

async function getUserThumb(name) {
    var response = await fetch("https://myanimelist.net/search/prefix.json?type=user&keyword=" + name + "&v=1", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });

    response = await response.json();

    var results = response.categories[0];
    if (results.type === "user") {
        return results.items[0].thumbnail_url;
    }

    return false;
}

