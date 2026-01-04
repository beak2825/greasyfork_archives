// ==UserScript==
// @name         Mastodon Timeline Counter
// @version      1.2.1
// @description  Indicates the number of remaining posts on the timeline.
// @namespace    http://tampermonkey.net/
// @author       Bene Laszlo
// @match        https://mastodon.social/@*
// @match        https://mastodon.online/@*
// @match        https://mas.to/@*
// @icon         https://mastodon.social/packs/media/icons/favicon-16x16-c58fdef40ced38d582d5b8eed9d15c5a.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468729/Mastodon%20Timeline%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/468729/Mastodon%20Timeline%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var list, listContainerEl, // list of all post containers; element containing the posts
        boxEl, counterEl, textEl, // output box element; output counter element; output additional text element

        // number of post container packs already displayed.
        // 20* post containers get created every time scrolling reaches bottom. (* less than 20 at the end of the timeline)
        // so a PCP has 20 post containers that get filled or unfilled with posts according to scroll position
        // (i.e. count = actual count rounded up to 20)
        count,

        lastCount=0, // buffered count from previous iteration
        subCount, // number of already seen posts inside a post container pack
        placeholdersJustCreated, // the moment a new pack was created
        output, // the counter on the screen showing posts left
        total, // estimated total number of posts collected from the timeline header
        pack, packSize, // the last 20 elements of "list" (or less than 20 at the end of the timeline); size of the pack (in the manner just mentioned)
        scrollCount=0, // counter for only every 12th scroll to take effect
        lastPos, // buffered scroll position from previous iteration
        firstContentFound, // the place inside the pack where the re-hidden posts
        first = true, // if chit turns false, the addition text changes from "total" to "more to go"
        theme; // site theme (used for setting color of additional text)

    preInit();

    // wait for timeline to load before anything can happen
    function preInit() {
        var t = setInterval(function() {
            var coll = document.getElementsByClassName('item-list');
            if (coll.length) {
                listContainerEl = coll[0];
                clearTimeout(t);
                init();
            }
        }, 200);
    }

    function init() {
        // set the colors according to the theme
        for (const name of ['default','contrast','mastodon-light']) {
            if (document.body.classList.contains('theme-'+name)) {
                theme = name;
                break;
            }
        }

        // info from timeline header as source for total number of posts
        var totalEl = document.getElementsByClassName('account__header__extra__links')[0].firstElementChild;
        output = total = totalEl.getAttribute('title').replace(',', '');

        // THE COUNTER ELEMENT
        var navPanel = document.getElementsByClassName('navigation-panel')[0];
        var boxX = navPanel.getBoundingClientRect().left;
        // counter container
        boxEl = document.createElement("div");
        boxEl.style.position = 'fixed';
        boxEl.style.left = (boxX+12)+'px';
        boxEl.style.bottom = '10px';
        boxEl.style.display = 'flex';
        boxEl.style.gap = '4px';
        boxEl.style.alignItems = 'flex-end';
        // counter
        counterEl = document.createElement("div");
        counterEl.style.fontSize = '40px';
        counterEl.style.lineHeight = '.9em';
        counterEl.style.fontWeight = '500';
        // additional text
        textEl = document.createElement("div");
        textEl.innerText = 'total';
        var textColor;
        switch (theme) {
            case 'default': textColor='#606984'; break;
            case 'contrast': textColor='#c2cede'; break;
            case 'mastodon-light': textColor='#444b5d'; break;
        }
        textEl.style.color = textColor;
        boxEl.append(counterEl);
        boxEl.append(textEl);

        // featured hashtags should move aside
        for (var el of document.getElementsByClassName('getting-started__trends')) {
            el.style.position = 'relative';
            el.style.top = '-70px';
            el.style.borderBottom = '1px solid #393f4f';
        }

        putOutput(total);

        document.body.appendChild(boxEl);

        document.addEventListener('scroll', handleScroll);
    }

    // SCROLL EVENT, THE MAIN FUNCTION
    function handleScroll() {
        if (window.scrollY <= lastPos) return; // scolling up or not scrolling further down

        // update the counter (at every 12 scrolls)
        if (scrollCount == 0)
        {
            // if new pack of post placeholders was just created by the site (1 pack = 20 placeholders)
            placeholdersJustCreated = false;
            // the full collection of post placeholders
            list = listContainerEl.getElementsByTagName('article');
            // The number of visible post placeholders.
            // This is not equal to the actual count, because 20 placeholders are created at a time.
            count = list.length;

            // new post placeholders have just been created
            if (count != lastCount)
            {
                placeholdersJustCreated = true;

                // get the newly created post placeholders
                packSize = count-lastCount; // size of the new post placeholder pack
                pack = Array.prototype.slice.call(list, -packSize); // the last part of that size of the full post placeholder collection

                // buffer the previous count
                lastCount = count;
            }

            // SUBCOUNT (COUNT PER PACK [= 20 post placeholders])
            // figuring out how many of the new post placeholder pack was already seen
            //
            // set-up of a pack:
            // - already re-emptied post placeholders (if any), because they're scrolled past
            // - loaded post(s)
            // - still empty post placeholders, because they're not yet scrolled to
            if (!placeholdersJustCreated)
            {
                firstContentFound = false; // the pointer where the re-emptied placeholders are over
                for (var i in pack)
                {
                    const article = pack[i];
                    const isEmpty = article.style.overflow && article.style.overflow=='hidden';

                    // posts scrolled past, which are ALREADY re-unloaded
                    if (!firstContentFound && isEmpty) continue;

                    // first post after the empty placeholders
                    firstContentFound = true;

                    // first post that is STILL unloaded
                    if (isEmpty) break;
                }

                // the number of seen posts inside the pack is the loop index
                subCount = firstContentFound ? i : 0; // (I don't remember whether there is actually a "0" state, but let's just leave it here)
            }
            else {
                subCount = 0;
            }

            // THE ACTUAL COUNT
            // - count: total number of post placeholders (i.e. seen posts rounded up to 20)
            // - packSize: usually 20; 20 or less if it's the end of the timeline
            // - subCount: the number of posts scrolled past inside the pack
            // - packSize-subCount: excludes the placeholders that are not yet scrolled to from the pack
            var realCount = count-(packSize-subCount);

            // The last pack is recognized by having less than 20 posts. (This has a 95% chance of working.)
            // The last post of this pack makes the counter come to a close, and zeroes itself down with an animation.
            if (packSize<20 && realCount==count-1) {end(output); return;}

            // THE OUTPUT: POSTS LEFT
            output = total-realCount;
            if (output!=total) output++; // a post is digested when the NEXT post is loaded and its top is already visible

            // on first post scroll, alter the additional text
            if (first && subCount>1) {
                textEl.innerText = 'more to go';
                first = false;
            }
        }

        // every 12th scroll takes effect (when scrollCount is 0)
        scrollCount ++;
        if (scrollCount==12) scrollCount = 0;
        lastPos = window.scrollY; // buffering the scroll position for next iteration

        // putting output on screen
        putOutput(output);
    }

    // PUTTING OUTPUT ON SCREEN
    function putOutput(n) {
        // displaying output while fixing bad kerning of number 1 (really fucked with my OCD)
        var outputStr = '';
        const digits = Array.from(n.toString());
        for (const [j, d] of digits.entries()) {
            // modified digit is 1 if it's not the last digit
            outputStr += (d!=1 || j==digits.length-1) ? d : '<span>'+d+'</span>';
        }
        counterEl.innerHTML = outputStr;
        for (var el of counterEl.getElementsByTagName('span')) { // inline styling of <span> doesn't take effect FSR
            el.style.position = 'relative';
            el.style.left = '1px';
        }
    }

    // zeroing the counter when the timeline has ended, with a fancy animation
    // necessary because this userscript relies on the timeline header about the number of posts, which is never exact
    function end(n) {
        document.removeEventListener('scroll', handleScroll);
        var t = setInterval(function() {
            n--;
            putOutput(n);
            if (n<=0) clearTimeout(t);
        }, 60);
    }
})();