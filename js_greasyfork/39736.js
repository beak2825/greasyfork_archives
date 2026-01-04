// ==UserScript==
// @name         gImage
// @namespace    gimage
// @version      2.4.1
// @description  This script brings back the Image button from the Google Image Search, and it does it better than anyone else!
// @author       pipe01
// @match        *://www.google.com/*tbm=isch*
// @match        *://www.google.es/*tbm=isch*
// @grant        none
// @license MIT
// @copyright 2018, pipe01 (https://github.com/pipe01)
// @downloadURL https://update.greasyfork.org/scripts/39736/gImage.user.js
// @updateURL https://update.greasyfork.org/scripts/39736/gImage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const VisitButtonSelector = ".irc_vpl";
    const ImageSelector = ".irc_mi";

    //Thanks to https://github.com/danklammer
    const IconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="10" height="10" fill="none" stroke="currentcolor" stroke-linecap="round" stroke-width="2"><path d="M20 24 L12 16 2 26 2 2 30 2 30 24 M16 20 L22 14 30 22 30 30 2 30 2 24" /><circle cx="10" cy="9" r="3" /></svg>';

    function getParent(node, level)
    {
        var ret = node;
        while (level-- > 0)
        {
            ret = ret.parentNode;

            if (ret == null) return node;
        }
        return ret;
    }

    //Wait for the page to fully load
    var interval = setInterval(() =>
    {
        if (document.querySelectorAll(VisitButtonSelector).length > 0)
        {
            clearInterval(interval);
            main();
        }
    }, 100);

    function main()
    {
        var l = document.querySelectorAll(VisitButtonSelector);
        for (var i in l)
        {
            var btn = l[i].parentNode.cloneNode(true);
            var parent = l[i].parentNode.parentNode;
            parent.insertBefore(btn, parent.children[0]);
 
            if (l[i].children == null) continue;

            l[i].children[0].innerHTML = IconSVG;
            l[i].children[1].innerHTML = "&nbsp;Image";

            var func = function(e)
            {
                var ll = document.querySelectorAll(ImageSelector);
                for (var ii in ll)
                {
                    if (!(ll[ii] instanceof Element)) continue;

                    if (getParent(ll[ii], 5) == getParent(this, 8))
                    {
                        e.stopPropagation();
                        this.href = ll[ii].src;
                    }
                }
            };

            //Better safe than sorry
            l[i].onmousedown = l[i].oncontextmenu = l[i].onmouseover = func;
        }
    }
})();
