// ==UserScript==
// @name         antizapret.info links
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  Adds hyperlinks to the blocked pages for your very important browsing purposes
// @author       紫
// @match        https://antizapret.info/
// @match        https://antizapret.info/?*
// @match        https://antizapret.info/org.php*
// @match        https://antizapret.info/minjust.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/24614/antizapretinfo%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/24614/antizapretinfo%20links.meta.js
// ==/UserScript==

// jshint esversion: 6
(function() {
    'use strict';

    // function section

    const replaceWildcard = s => /\*\..+/.exec(s) ? s.replace(/\*\.(.+)/, "$1") : s;
    const replaceNoDomain = (url, ip) => url.includes("только ip") ? ip : url;

    const extSiteLink = (link_url, link_ip) => {
        let link_node, img_node;

        img_node = document.createElement('img');
        img_node.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFZJREFUeF59z4EJADEIQ1F36k7u5E7ZKXeUQPACJ3wK7UNokVxVk9kHnQH7bY9hbDyDhNXgjpRLqFlo4M2GgfyJHhjq8V4agfrgPQX3JtJQGbofmCHgA/nAKks+JAjFAAAAAElFTkSuQmCC';
        link_node = document.createElement('a');
        link_node.style.marginRight = '5px';
        link_node.href = 'http://';

        if (link_url.length >= 40) {
            new GM_xmlhttpRequest({
                method: 'GET',
                url: `http://api.${location.host}/get.php?type=json&item=${encodeURIComponent(link_url)}`,
                onload(response) {
                    link_node.href = JSON.parse(response.responseText).register[0].url;
                }
            });
        } else {
            link_node.href = 'http://' + replaceWildcard(replaceNoDomain(link_url, link_ip));
        }

        link_node.target = '_blank';
        link_node.appendChild(img_node);

        return link_node;
    };

    // executed code section

    let trs = document.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let tr of trs) {
        let linkTd = tr.getElementsByTagName('td')[1];
        let linkField = linkTd.getElementsByTagName('a')[0];

        let ipTd = tr.getElementsByTagName('td')[2];
        let ipField = ipTd.getElementsByTagName('a')[0];

        linkTd.insertBefore(extSiteLink(linkField.text, ipField.text), linkField);
    }
})();