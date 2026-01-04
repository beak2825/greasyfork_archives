// ==UserScript==
// @name         Stop bilibili autoplay in 253874
// @namespace    797D0A5C-F30F-4468-A173-D2A505B19F42
// @version      0.1
// @description  as the title
// @author       heroboy
// @match        https://www.253874.net/*
// @icon         https://www.253874.net/favicon.ico
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/477810/Stop%20bilibili%20autoplay%20in%20253874.user.js
// @updateURL https://update.greasyfork.org/scripts/477810/Stop%20bilibili%20autoplay%20in%20253874.meta.js
// ==/UserScript==

(function ()
{
    'use strict';
    const m = new MutationObserver(changes =>
    {
        for (const c of changes)
        {
            if (c && c.addedNodes)
            {
                for (const node of c.addedNodes)
                {
                    if (node instanceof HTMLElement)
                    {
                        for (const embedNode of node.querySelectorAll('embed,iframe'))
                        {
                            processEmbed(embedNode);
                        }
                    }
                }
            }
        }
    });
    m.observe(document.body, {
        subtree: true,
        childList: true
    });


    for (const embedNode of document.body.querySelectorAll('embed,iframe'))
    {
        processEmbed(embedNode);
    }

    function processEmbed(elem)
    {
        if (elem && typeof elem.src === 'string')
        {
            let src = elem.src;
            let lsrc = src.toLowerCase();
            if (lsrc.indexOf('bilibili.com') >= 0 && lsrc.indexOf('autoplay') < 0)
            {
                if (src.indexOf('?') >= 0)
                {
                    src += '&autoplay=0';
                }
                else
                {
                    src += '?autoplay=0';
                }
            }
            elem.src = src;
        }
    }
})();