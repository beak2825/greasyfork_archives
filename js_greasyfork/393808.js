// ==UserScript==
// @name           The Missing Cover Initiative
// @namespace      tmci
// @description    Adds a link to report missing covers.
// @include        http*://redacted.sh/torrents.php?id=*
// @include        http*://redacted.sh/better.php?method=artwork
// @include        http*://redacted.sh/collages.php?id=20036
// @version        1.0.7
// @date           2020-03-18
// @downloadURL https://update.greasyfork.org/scripts/393808/The%20Missing%20Cover%20Initiative.user.js
// @updateURL https://update.greasyfork.org/scripts/393808/The%20Missing%20Cover%20Initiative.meta.js
// ==/UserScript==

(async function () {
	const torrentPage = window.location.href.match(/torrents\.php\?id=(\d+)/);
    const betterPage = window.location.href.match(/better\.php\?method=artwork/);
    const collagePage = window.location.href.match(/collages\.php\?id=20036/);
	const linkReportText = 'Report missing cover';
    const linkSearchText = 'Search Cover';
	const collageUrl = 'https://redacted.ch/collages.php';
	const collageId = 20036;
    const linkregex = /torrents\.php\?id=(\d+)/i;
    const artistregex = /artist\.php\?id=(\d+)/i;
	let alreadyAddedLinks = false;
    let userAuth = '';

	addLinks();
	function addLinks() {
		if (alreadyAddedLinks === true) {
			return;
		}
		if (torrentPage) {
            userAuth = document.getElementsByName('auth')[0].value;
			let coversDiv = document.getElementsByClassName('additional_add_artists')[0];
			createReportLink(coversDiv, userAuth);
		}

        if (betterPage || collagePage) {
			const alltorrents = [];
            for (let i = 0; i < document.links.length; i++) {
                alltorrents.push(document.links[i]);
            }

            for (let i = 0; i < alltorrents.length; i++) {
                if (linkregex.exec(alltorrents[i])) {
                    const id = RegExp.$1;
                    createSearchLink(alltorrents[i]);
                }
            }
		}

		alreadyAddedLinks = true;
	}

    function createSearchLink(linkelement) {
		let a = document.createElement('a');
        if (linkelement.previousElementSibling == null) {
            return;
        }
        if (!artistregex.exec(linkelement.previousElementSibling)) {
            return;
        }
		a.href = 'https://anonym.to/?' + encodeURIComponent('https://www.google.com/search?tbm=isch&q=' + linkelement.previousElementSibling.innerHTML + ' ' + linkelement.innerHTML + ' cover');
		a.title = linkSearchText;
        a.target = '_blank';
		a.className = 'search_cover';
		a.appendChild(document.createTextNode(linkSearchText));
        if (betterPage) {
            linkelement.parentNode.appendChild(document.createTextNode(' | '));
            linkelement.parentNode.appendChild(a);
        } else {
            linkelement.parentNode.nextElementSibling.appendChild(a);
            linkelement.parentNode.nextElementSibling.appendChild(document.createTextNode(' | '));
        }
	}

	function createReportLink(linkelement) {
		let a = document.createElement('a');
        let newline = document.createElement('br');
        let clearfix = document.createElement('div');
		a.href = 'javascript:;';
		a.title = linkReportText;
		a.id = 'report_cover';
		a.className = 'brackets';
		a.appendChild(document.createTextNode(linkReportText));
		a.addEventListener('click', addToCollage, false);
		linkelement.appendChild(newline);
        linkelement.appendChild(a);
        clearfix.style.clear = 'both';
        linkelement.parentNode.appendChild(clearfix);
	}

	function addToCollage() {
		var params = 'action=add_torrent&collageid=' + collageId + '&auth=' + userAuth + '&url=' + window.location.href;
		var xhr = new XMLHttpRequest();
		xhr.open('POST', collageUrl, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send(params);
		document.getElementById('report_cover').innerHTML = 'Cover has been reported!';
	}
})();