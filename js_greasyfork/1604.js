// ==UserScript==
// @name           E-Hentai Automated Downloads
// @description    Automates downloads through the Doggie Bag Archiver
// @include        http://e-hentai.org/*
// @include        https://e-hentai.org/*
// @include        http://g.e-hentai.org/*
// @include        https://g.e-hentai.org/*
// @include        http://exhentai.org/*
// @include        https://exhentai.org/*
// @grant          GM_xmlhttpRequest
// @grant          GM.xmlHttpRequest
// @grant          GM_openInTab
// @grant          GM.openInTab
// @run-at         document-start
// @author         etc
// @version        2.2.0
// @namespace      https://greasyfork.org/users/2168
// @downloadURL https://update.greasyfork.org/scripts/1604/E-Hentai%20Automated%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/1604/E-Hentai%20Automated%20Downloads.meta.js
// ==/UserScript==

if (typeof(Promise) === 'undefined') {
    console.warn('Browser does not support promises, aborting.');
    return;
}

/*-----------------------
  Assets (icons and GIFs)
  -----------------------*/

var ASSETS = {
    downloadIcon: generateSvgIcon(1500, 'rgb(0,0,0)', 'M370.333 0h200q21 0 35.5 14.5t14.5 35.5v550h291q21 0 26 11.5t-8 27.5l-427 522q-13 16-32 16t-32-16l-427-522q-13-16-8-27.5t26-11.5h291V50q0-21 14.5-35.5t35.5-14.5z'),
    torrentIcon: generateSvgIcon(1300, 'rgb(0,0,0)', 'M932 12.667l248 230q14 14 14 35t-14 35l-248 230q-14 14-24.5 10t-10.5-25v-150H497v-200h400v-150q0-21 10.5-25t24.5 10zm-735 365h-50q-21 0-35.5-14.5t-14.5-35.5v-100q0-21 14.5-35.5t35.5-14.5h50v200zm200 0H297v-200h100v200zm-382 365l247-230q14-14 24.5-10t10.5 25v150h400v200H297v150q0 21-10.5 25t-24.5-10l-247-230q-15-14-15-35t15-35zm882 135H797v-200h100v200zm100-200h51q20 0 34.5 14.5t14.5 35.5v100q0 21-14.5 35.5t-34.5 14.5h-51v-200z'),
    doneIcon: generateSvgIcon(1800, 'rgb(0,0,0)', 'M1412 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zm252 162q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z'),
    loadingIcon: generateSvgIcon(1900, 'rgb(0,0,0)', 'M462 1394q0 53-37.5 90.5T334 1522q-52 0-90-38t-38-90q0-53 37.5-90.5T334 1266t90.5 37.5T462 1394zm498 206q0 53-37.5 90.5T832 1728t-90.5-37.5T704 1600t37.5-90.5T832 1472t90.5 37.5T960 1600zM256 896q0 53-37.5 90.5T128 1024t-90.5-37.5T0 896t37.5-90.5T128 768t90.5 37.5T256 896zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5T1202 1394t37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zM494 398q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5T1536 1024t-90.5-37.5T1408 896t37.5-90.5T1536 768t90.5 37.5T1664 896zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136T832 0t136 56 56 136zm530 206q0 93-66 158.5T1330 622q-93 0-158.5-65.5T1106 398q0-92 65.5-158t158.5-66q92 0 158 66t66 158z')
};

/*---------
  Utilities
  ---------*/

function generateSvgIcon(size, color, data) {
    return format('url("data:image/svg+xml,' +
        '<svg width=\'{0}\' height=\'{0}\' viewBox=\'0 0 {0} {0}\' xmlns=\'http://www.w3.org/2000/svg\'>' +
        '<path fill=\'{1}\' d=\'{2}\'/></svg>")', size, color, data);
}

function createButton(data) {
    var result = document.createElement(data.hasOwnProperty('type') ? data.type : 'a');
    if (data.hasOwnProperty('className')) result.className = data.className;
    if (data.hasOwnProperty('title')) result.title = data.title;
    if (data.hasOwnProperty('onClick')) {
        result.addEventListener('mousedown', data.onClick, false);
        result.addEventListener('click', function(e) { e.preventDefault(); }, false);
        result.addEventListener('contextmenu', function(e) { e.preventDefault(); }, false);
    }
    if (data.hasOwnProperty('parent')) data.parent.appendChild(result);
    if (data.hasOwnProperty('target')) result.setAttribute('target',data.target);
    if (data.hasOwnProperty('style'))
        result.style.cssText = Object.keys(data.style).map(function(x) { return x + ': ' + data.style[x] + 'px'; }).join('; ');
    return result;
}

function format(varargs) {
    var pattern = arguments[0];
    for (var i=1;i<arguments.length;++i)
        pattern = pattern.replace(new RegExp('\\{' + (i-1) + '\\}', 'g'), arguments[i]);
    return pattern;
}

function xhr(data) {
    return new Promise(function(resolve, reject) {
        var request = {
            method: data.method,
            url: data.url,
            onload: function() { resolve.apply(this, arguments); },
            onerror: function() { reject.apply(this, arguments); }
        };
        if (data.headers) request.headers = data.headers;
        if (data.body && data.body.constructor == String) request.data = data.body;
        else if (data.body) request.data = JSON.stringify(data.body);
        if (typeof(GM_xmlhttpRequest) !== 'undefined') GM_xmlhttpRequest(request);
        else if (typeof(GM) !== 'undefined' && GM.xmlHttpRequest) GM.xmlHttpRequest(request);
        else reject(new Error('Could not submit XHR request'));
    });
}

function parseHTML(html) {
    var div = document.createElement('div');
    div.innerHTML = html.replace(/src=/g, 'no-src=');
    return div;
}

function updateUI(data) {
    if (!data || data.error) return;
    var temp = (data.isTorrent ? torrentQueue[data.galleryId] : archiveQueue[data.galleryId]);
    temp.button.className = temp.button.className.replace(/\s*working/, '') + ' requested';
}

function handleFailure(data) {
    if (!data) return;
    var temp = (data.isTorrent ? torrentQueue[data.galleryId] : archiveQueue[data.galleryId]);
    temp.button.className = temp.button.className.replace(/\s*working/, '');
    if (data.error !== 'aborted')
        alert('Could not complete operation.\nReason: ' + (data.error || 'unknown'));
}

function xpathFind(root, nodeType, text) {
    return document.evaluate('.//' + (nodeType || '*') + '[contains(text(), "' + text + '")]', root, null, 9, null).singleNodeValue;
}

function pickTorrent(candidates, lastUpdateDate) {
    var currentScore = 0, currentCandidate = null;
    // Get max values
    var maxSeeds = candidates.reduce(function(p,n) { return Math.max(p, n.seeds); }, 0);
    var maxSize  = candidates.reduce(function(p,n) { return Math.max(p, n.size); }, 0);
    var newest   = candidates.reduce(function(p,n) { return Math.max(p, n.date.valueOf()); }, 0);
    // Calculate scores
    candidates.forEach(function(candidate) {
        var seedScore = candidate.seeds / maxSeeds;
        var sizeScore = candidate.size / maxSize;
        var dateScore = 1;
        if (lastUpdateDate && newest > lastUpdateDate) {
            dateScore = (candidate.date.valueOf() - lastUpdateDate) / (newest - lastUpdateDate);
            if (dateScore < 0) dateScore = 0.1; // galleries posted before the last update automatically get 0.1
        }
        // Total score
        var score = seedScore * sizeScore * dateScore;
        if (currentScore >= score) return;
        currentScore = score;
        currentCandidate = candidate;
    });
    return currentCandidate;
}

/*--------------
  Download Steps
  --------------*/

								  
				
					  
													
																										  
								
												   
																	
																   
			  
																			 
																	   
											  
		 
													
						 
	   
 

function obtainTorrentFile(data) {
    return xhr({
        method: 'GET',
        url: format('{0}//{1}/gallerytorrents.php?gid={2}&t={3}',
            window.location.protocol, window.location.host, data.galleryId, data.galleryToken)
    }).then(function(response) {
        var div = parseHTML(response.responseText);
        var forms = div.querySelectorAll('form'), candidates = [ ];
        var findValue = function(text) {
            var target = xpathFind(forms[i], 'span', text);
            return (target ? target.nextSibling.textContent.trim() : null);
        };
        for (var i=0;i<forms.length;++i) {
            var link = forms[i].querySelector('a');
            if (!link) continue;
            // Gather torrent data
            var posted = new Date(findValue('Posted')), size = findValue('Size'),
                seeds = parseInt(findValue('Seeds'), 10) || 0;
            size = parseFloat(size, 10) * (/MB/i.test(size) ? 1024 : (/GB/i.test(size) ? 1024 * 1024 : 1));
            if (size !== 0) candidates.push({ link: link.href, date: posted, size: size, seeds: seeds });
        }
        if (candidates.length === 0) data.error = 'could not find any suitable torrent';
        else data.fileUrl = pickTorrent(candidates, data.date).link;
        if (data.error) return Promise.reject(data);
        else return data;
    });
}

function confirmDownloadRequest(data) {
    return xhr({
        method: 'GET',
        url: format('{0}//{1}/archiver.php?gid={2}&token={3}',
            window.location.protocol, window.location.host, data.galleryId, data.galleryToken)
												
    }).then(function(response) {
        var div = parseHTML(response.responseText);
        var costLabel = xpathFind(div, '*', 'Download Cost:');
        var sizeLabel = xpathFind(div, '*', 'Estimated Size:');
        if (!costLabel || !sizeLabel)
            return data;
        var cost = costLabel.textContent.replace(/^.+:/, '').trim();
        var size = sizeLabel.textContent.replace(/^.+:/, '').trim();
        var proceed = confirm(format('Size: {0}\nCost: {1}\n\nProceed?', size, cost));
        if (proceed) return data;
        data.error = 'aborted';
        return Promise.reject(data);
    });
}

function submitDownloadRequest(data) {
    return xhr({
        method: 'POST',
        url: format('{0}//{1}/archiver.php?gid={2}&token={3}',
            window.location.protocol, window.location.host, data.galleryId, data.galleryToken),
												 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'dltype=org&dlcheck=Download+Original+Archive',
    }).then(function(response) {
        var div = parseHTML(response.responseText);
        var url, target = div.querySelector('#continue > a');
        if (target) url = target.href;
        else {
            var targets = div.querySelectorAll('script');
            for (var i=0;i<targets.length;++i) {
                var match = targets[i].textContent.match(/location\s*=\s*"(.+?)"/);
                if (!match) continue;
                url = match[1];
                break;
            }
        }
        if (url) data.archiverUrl = url;
        else data.error = 'could not resolve archiver URL';
        if (data.error) return Promise.reject(data);
        else return data;
    });
}

function waitForDownloadLink(data) {
    return xhr({
        method: 'GET',
        url: data.archiverUrl
    }).then(function(response) {
        if (/The file was successfully prepared/i.test(response.responseText)) {
            var div = parseHTML(response.responseText);
            var target = div.querySelector('#db a');
            if (target) {
                var archiverUrl = new URL(data.archiverUrl);
                data.fileUrl = archiverUrl.protocol + '//' + archiverUrl.host + target.getAttribute('href');
            } else data.error = 'could not resolve file URL';
        } else
            data.error = 'archiver did not provide file URL';
        if (data.error) return Promise.reject(data);
        else return data;
    }).catch(function() {
        if (data.error) return Promise.reject(data);
        data.error = 'could not contact archiver';
        if (/https/.test(window.location.protocol)) {
            data.error += '; this is most likely caused by mixed-content security policies enforced by the' +
                ' browser that need to be disabled by the user. If you have no clue how to do that, you' +
                ' should probably Google "how to disable mixed-content blocking".';
        } else {
            data.error += '; please check whether your browser is not blocking XHR requests towards' +
                ' 3rd-party URLs';
        }
        return Promise.reject(data);
    });
}

function downloadFile(data) {
    downloadQueue = downloadQueue.then(function() {
        if (typeof(GM_openInTab) !== 'undefined') GM_openInTab(data.fileUrl, true);
        else if (typeof(GM) !== 'undefined' && GM.openInTab) GM.openInTab(data.fileUrl, true);
        else {
            var a = document.createElement('a');
            a.href = data.fileUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        return new Promise(function(resolve) { setTimeout(resolve, 500); });
    });
    return Promise.resolve(data);
}

/*----------------
  State Management
  ----------------*/

var archiveQueue = { }, torrentQueue = { };
var downloadQueue = Promise.resolve();

function requestDownload(e) {
    var isTorrent = /torrentLink/.test(e.target.className);
    if (/working|requested/.test(e.target.className)) return;
    if (isTorrent && e.which !== 1) return;
    e.preventDefault();
    e.stopPropagation();
    e.target.className += ' working';
    var tokens = e.target.getAttribute('target').match(/\/g\/(\d+)\/([0-9a-z]+)/i);
    var galleryId = parseInt(tokens[1], 10), galleryToken = tokens[2];
    var askConfirmation = (!isTorrent && e.which === 3);
    if (!isTorrent) {
        archiveQueue[galleryId] = { token: galleryToken, button: e.target };
        var promise = Promise.resolve({ galleryId: galleryId, galleryToken: galleryToken, isTorrent: false });
        if (askConfirmation) promise = promise.then(confirmDownloadRequest);
        promise
            .then(submitDownloadRequest)
            .then(waitForDownloadLink)
            .then(downloadFile)
            .then(updateUI)
            .catch(handleFailure);
    } else {
        // Try to find out gallery's last update date if possible
        var galleryDate = xpathFind(document, 'td', 'Posted:'); // gallery page
        if (galleryDate) galleryDate = galleryDate.nextSibling;
        else // thumbnail mode
            galleryDate = document.evaluate('./ancestor::tr/td[@class="itd"]', e.target, null, 9, null).singleNodeValue;
        if (galleryDate !== null) galleryDate = new Date(galleryDate.textContent.trim());
        // Gather data
        torrentQueue[galleryId] = { token: galleryToken, button: e.target };
        obtainTorrentFile({ galleryId: galleryId, galleryToken: galleryToken, isTorrent: true, date: galleryDate })
            .then(downloadFile)
            .then(updateUI)
            .catch(handleFailure);
    }
    return false;
}

/*--------
  UI Setup
  --------*/

window.addEventListener('load', function() {

    // button generation (thumbnail / extended)
    var thumbnails = document.querySelectorAll('.gl3t, .gl1e > div'), n = thumbnails.length;
    while (n-- > 0) {
        createButton({
            title: 'Automated download',
            target: thumbnails[n].querySelector('a').href,
            className: 'automatedButton downloadLink',
            onClick: requestDownload,
            style: { bottom: 0, right: -2 },
            parent: thumbnails[n]
        });
        createButton({
            title: 'Torrent download',
            target: thumbnails[n].querySelector('a').href,
            className: 'automatedButton torrentLink',
            onClick: requestDownload,
            style: { bottom: 0, left: -1 },
            parent: thumbnails[n]
        });
    }

    // button generation (gallery)
    var bigThumbnail = document.querySelector('#gd1 > div');
    if (bigThumbnail !== null) {
        createButton({
            title: 'Automated download',
            target: window.location.href,
            className: 'automatedButton downloadLink',
            onClick: requestDownload,
            style: { bottom: 0, right: 0 },
            parent: bigThumbnail
        });
        createButton({
            title: 'Torrent download',
            target: window.location.href,
            className: 'automatedButton torrentLink',
            onClick: requestDownload,
            style: { bottom: 0, left: 0 },
            parent: bigThumbnail
        });
    }

    // document style
    var style = document.createElement('style');
    style.innerHTML =
        // Icons and colors
        '.downloadLink:not(.working)  { background-image: ' + ASSETS.downloadIcon + '; background-color: rgb(220,98,98); background-position: 7px 7px; }' +
        '.torrentLink:not(.working)  { background-image: ' + ASSETS.torrentIcon + '; background-color: rgb(98,182,210); background-position: 5px 6px; }' +
        '.requested  { background-image: ' + ASSETS.doneIcon + ' !important; background-position: 4px 5px !important; }' +
        '.requested { background-color: rgba(128,226,126,1) !important; }' +
        '.working { background-color: rgba(255,128,192,1) !important; }' +
        '.working:before {' +
            'content: ""; top: 1px; left: 0; width: 28px; height: 28px; position: absolute; animation: eh-spin 2s linear infinite;' +
            'background-image: ' + ASSETS.loadingIcon + '; background-size: 20px 20px; background-position: 5px 5px; background-repeat: no-repeat;' +
        '}' +
        '.automatedButton:hover { background-color: rgba(255,199,139,1) }' +
        // Positioning
        '#gd1 > div, .gl3t, .gl1e > div { position: relative; }' +
        // Backgrounds
        '.automatedButton { background-size: 20px 20px; background-repeat: no-repeat; }' +
        // Others (thumbnail mode)
        '.automatedButton {' +
            'display: none; position: absolute; text-align: left; cursor: pointer;' +
            'color: white; margin-right: 1px; font-size: 20px; line-height: 11px; width: 28px; height: 28px;' +
        '}' +
        '.automatedButton.downloadLink  { border-radius: 0 0 5px 0 !important; }' +
        '.automatedButton.torrentLink  { border-radius: 0 0 0 5px !important; }' +
        '#gd1 > div > .automatedButton { border-radius: 0 0 0 0 !important; }' +
        '.automatedButton.working { font-size: 0px; }' +
        '#gd1 > div:hover .automatedButton, .gl3t:hover .automatedButton, .gl1e > div:hover .automatedButton, .automatedButton.working, .automatedButton.requested { display: block !important; }' +
        '@keyframes eh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }' +
        '@-webkit-keyframes eh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }' +
        '@-moz-keyframes eh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
    document.head.appendChild(style);

}, false);