// ==UserScript==
// @name            MyAnimeList(MAL) - Com-to-Com Links
// @version         1.2.1
// @description	    Add Com-to-Com link between user and comment user for every comment.
// @author          Cpt_mathix & N_Ox
// @match           *://myanimelist.net/profile*
// @match           *://myanimelist.net/comments*
// @exclude         *://myanimelist.net/profile/*/*
// @grant           none
// @namespace       https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/13133/MyAnimeList%28MAL%29%20-%20Com-to-Com%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/13133/MyAnimeList%28MAL%29%20-%20Com-to-Com%20Links.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* jshint scripturl:true */

if (document.location.href.indexOf('profile') > -1) {
	var element = document.getElementById('lastcomment').getElementsByTagName('a');
	for (var i = 0; i < element.length; i++) {
		if (element[i] && element[i].innerHTML.indexOf("All Comments") > -1) {
			comtocom(element[i].href);
			break;
		}
	}
} else {
	comtocom(document.location.href);
}

function parseProfileHTML(html) {
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(html, "text/html");
    const section = htmlDocument.documentElement.querySelector("#message").outerHTML;

    const regex = new RegExp(/uid:(\d+)/g);
    return regex.exec(section)[1];
}

async function getProfileIdAsync(profile) {
    return fetch(profile)
        .then(response => response.text())
        .then(text => parseProfileHTML(text));
}

function getProfileIdSync(profile) {
    var request = new XMLHttpRequest();
    request.open('GET', profile, false);
    request.send(null);

    if (request.status === 200) {
        return parseProfileHTML(request.responseText);
    }
}

async function comtocom(url) {
	url = url.replace(/&*show=\d*/g, "");
	var i = url.indexOf('id=');
	if (i == -1) return;
	url = '/comtocom.php?id1=' + url.substr(i + 3) + '&id2=';

	if (document.location.href.indexOf('profile') > -1) {
		document.querySelectorAll('div[id^=comBox]').forEach(function (el) {
			if (el.getElementsByClassName('postActions ar mt4').length !== 0) {
				return;
			}

			var profile = el.querySelector('.image').href;
            if (!profile) return;

			var div = document.createElement('div');
			div.className = 'postActions ar mt4 mr12';

			var link = document.createElement('a');
			link.innerHTML = "Conversation";
            link.href="javascript:void(0);";

            link.onclick = async (event) => {
                if (!link.href.includes('comtocom.php')) {
                    link.style.cursor = "progress";
                    link.href = url + await getProfileIdAsync(profile);
                    link.style.cursor = "pointer";
                    window.location.href = link.href;
                }
            };
            link.onauxclick = (event) => {
                if (!link.href.includes('comtocom.php')) {
                    link.href = url + getProfileIdSync(profile);
                }
            };
            link.oncontextmenu = (event) => {
                if (!link.href.includes('comtocom.php')) {
                    link.href = url + getProfileIdSync(profile);
                }
            };

			div.appendChild(link);
			el.appendChild(div);
		});
	} else {
        // console.log(document.querySelectorAll('div[id^=comBox] > table > tbody > tr'));
        // console.log(document.querySelectorAll('div[id^=comBox]'));
		document.querySelectorAll('div[id^=comBox] > table > tbody > tr').forEach(function (el) {
			var com = el.querySelector('div[id^=com]:not([id^=comtext])');
			if (!com) return;
			if (com.children.length == 3) return;

			var profile = el.querySelector('.picSurround > a').href;
            if (!profile) return;

			com.insertAdjacentHTML("beforeend", '<div style="margin-top:10px" align="right"><a href="javascript:void(0);" class="conversation">Conversation</a></div>');

            const link = com.querySelector(".conversation");

            link.onclick = async (event) => {
                if (!link.href.includes('comtocom.php')) {
                    link.style.cursor = "progress";
                    link.href = url + await getProfileIdAsync(profile);
                    link.style.cursor = "pointer";
                    window.location.href = link.href;
                }
            };
            link.onauxclick = (event) => {
                if (!link.href.includes('comtocom.php')) {
                    link.href = url + getProfileIdSync(profile);
                }
            };
            link.oncontextmenu = (event) => {
                if (!link.href.includes('comtocom.php')) {
                    link.href = url + getProfileIdSync(profile);
                }
            };
		});
	}
}
