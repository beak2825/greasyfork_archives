// ==UserScript==
// @name         Amazon Link Shortener
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a shortlink to applicable amazon pages.
// @author       noeatnosleep
// @include      https://*amazon.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/22006/Amazon%20Link%20Shortener.user.js
// @updateURL https://update.greasyfork.org/scripts/22006/Amazon%20Link%20Shortener.meta.js
// ==/UserScript==


(function() {
    function pathAsArray(pathname) {
        return pathname.split('/').filter(function(part){return Boolean(part);});
    }
    function lastPartOfPath(pathname) {
        var info = pathAsArray(pathname);
        return info[info.length-1];
    }
    function parseAmazonLinks() {
        var parser = document.createElement('a');
        parser.href = window.location.href;
        var pathArray = pathAsArray(parser.pathname);
        var retval = null;
        if (lastPartOfPath(parser.pathname).startsWith('ref=')) {
            if (Boolean(/^[A-Z0-9]+$/.exec(pathArray[pathArray.length-2]))) {
                retval = "https://amzn.com/" + pathArray[pathArray.length-2];
            }
        } else {
            if (Boolean(/^[A-Z0-9]+$/.exec(pathArray[pathArray.length-1]))) {
                retval = "https://amzn.com/" + pathArray[pathArray.length-1];
            }
        }
        return retval;
    }
    function makeEl(val) {
        var div = document.createElement('div');
        var data = document.createElement('div');
        data.copyval = val;
        data.appendChild(document.createTextNode(val));
        data.setAttribute('id', 'acl_shortlink');
        data.setAttribute('class', 'a-box');
        data.style.textAlign = "center";
        data.style.cursor = "pointer";
        data.onclick = function() {
            GM_setClipboard(data.copyval);
        };
        div.style.marginBottom = "12px";
        div.setAttribute('class', 'a-box');
        div.appendChild(document.createTextNode('Shortlink provided by '));
        var ref = document.createElement('a');
        ref.href = 'http://noeatnosleep.me/alc';
        ref.innerHTML = 'noeatnosleep';
        div.appendChild(ref);
        div.appendChild(document.createTextNode('.'));
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createTextNode('Click to copy!'));
        div.style.textAlign = "center";
        div.appendChild(data);
        var parent = document.getElementById('rightCol');
        parent.insertBefore(div, parent.firstChild);
    }
    var shortened = parseAmazonLinks();
    if (shortened !== null) {
        makeEl(shortened);
    }
})();