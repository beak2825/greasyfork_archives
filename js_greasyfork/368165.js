// ==UserScript==
// @name        New YouTube Pic Link
// @description Adds buttons that link to YT thumbnail images next to the title
// @match        https://www.youtube.com/*
// @grant        none
// @version 0.0.8
// @namespace https://greasyfork.org/users/8233
// @downloadURL https://update.greasyfork.org/scripts/368165/New%20YouTube%20Pic%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/368165/New%20YouTube%20Pic%20Link.meta.js
// ==/UserScript==

function refreshPicLinks(objs, mutob) {
    var url = new URL(document.location.href);
    var c = url.searchParams.get('v');
    var maxlink = document.getElementById('frex-maxlink');
    maxlink.href = 'https://i.ytimg.com/vi/' + c + '/maxresdefault.jpg';
    var hqlink = document.getElementById('frex-hqlink');
    hqlink.href = 'https://i.ytimg.com/vi/' + c + '/hqdefault.jpg';
}

function addPicLinks(events, observer) {
    if (document.getElementById('frex-maxlink') !== null) {
        observer.disconnect();
        return;
    }

    var ytfmtstr = document.querySelector('h1.ytd-watch-metadata');
    if (!ytfmtstr)
        return;

    var a = ytfmtstr.parentElement;
    var url = new URL(document.location.href);
    var c = url.searchParams.get('v');
    var maxlink = document.createElement('a');
    maxlink.href = 'https://i.ytimg.com/vi/' + c + '/maxresdefault.jpg';
    maxlink.id = 'frex-maxlink';
    a.insertBefore(maxlink, a.children[0]);
    var myclassname = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading';
    var maxbut = document.createElement('button');
    maxbut.innerText = 'Max Picture (big)';
    maxbut.className = myclassname;
    maxbut.style.display = 'inline';
    maxlink.appendChild(maxbut);
    var hqlink = document.createElement('a');
    hqlink.href = 'https://i.ytimg.com/vi/' + c + '/hqdefault.jpg';
    hqlink.id = 'frex-hqlink';
    a.insertBefore(hqlink, maxlink);
    var hqbut = document.createElement('button');
    hqbut.innerText = 'HQ Picture (small)';
    hqbut.className = myclassname;
    hqbut.style.display = 'inline';
    hqlink.appendChild(hqbut);
    var mutob = new MutationObserver(refreshPicLinks);
    mutob.observe(ytfmtstr, { childList: true, attributes: true, characterData: true, subtree: true });
}

var observer = new MutationObserver(addPicLinks);
observer.observe(document.body, { childList: true, subtree: true });
