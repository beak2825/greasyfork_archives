// ==UserScript==
// @name         removed.edm - SyrebralVibes YouTube Extension
// @description  Adds all SyrebralVibes videos from removed.edm dynamically to the VORAPIS YouTube layout.
// @author       removededm
// @match        https://www.youtube.com/channel/UCi0LydWaEUy3Vx8flL29ebQ/videos*
// @icon         https://github.com/removededm/removededm/blob/main/logo.png?raw=true
// @grant        none
// @version 0.0.1.20240816082249
// @namespace https://greasyfork.org/users/1352592
// @downloadURL https://update.greasyfork.org/scripts/503814/removededm%20-%20SyrebralVibes%20YouTube%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/503814/removededm%20-%20SyrebralVibes%20YouTube%20Extension.meta.js
// ==/UserScript==
(function() {
    'use strict';

const newItems = [
        {date: "Dec 18, 2013",href: "-3q4bGJYo7o",imgSrc: "e/e7/-3q4bGJYo7o.jpg",views: "10,862 views",time: "0:00",title: "[Electro] Sultan & Ned Shepard (Feat. Zella Day & Sam Martin) - All These Roads (FIXYN Remix)",},
        {date: "Dec 29, 2013",href: "MtEwMs88osE",imgSrc: "3/3f/MtEwMs88osE.jpg",views: "3,626 views", time: "5:05",title: "[Trap] Curious Kontrol - All Yours",},
        {date: "Dec 30, 2013",href: "s0-26VPTNfE",imgSrc: "9/98/s0-26VPTNfE.jpg",views: "3,291 views", time: "5:05",title: "[EDM] Miami Horror - Real Slow (Gold Fields Remix)",},
        {date: "Dec 31, 2013",href: "5AD3GwPOPhQ",imgSrc: "8/8e/5AD3GwPOPhQ.jpg",views: "36,899 views",time: "4:02",title: "[House] Timeflies (Feat. Various) - I Choose You (3LAU Bootleg)",},
        {date: "Jan 3, 2014", href: "ktpb7vqUpKw",imgSrc: "b/b1/ktpb7vqUpKw.jpg",views: "1,713 views", time: "4:28",title: "[EDM] Lenno, Sub Focus & Kele - Turn It Around, Rebirth (TBMA Bootleg)",},
        {date: "Jan 15, 2014",href: "Rh09D68Aqyk",imgSrc: "d/da/Rh09D68Aqyk.jpg",views: "6,526 views", time: "3:44",title: "[House] Soulero (Feat. Christopher Sletto) - Out Of Luck",},
        {date: "Jan 20, 2014",href: "3PEjUlrgdrw",imgSrc: "f/fd/3PEjUlrgdrw.jpg",views: "61,787 views",time: "3:52",title: "[House] Ellie Goulding - Goodness Gracious (The Chainsmokers Remix)",},
        {date: "May 22, 2014",href: "HzRFaakTX2k",imgSrc: "",                    views: "3,011 views", time: "3:44",title: "[Nu-Disco / Indie Dance] Miami Horror - Colours In The Sky (That's Nice Remix)",},
        {date: "May 29, 2014",href: "8wZC9kQx3Bw",imgSrc: "8/80/8wZC9kQx3Bw.jpg",views: "14,483 views",time: "4:12",title: "[Future] Duke Dumont - Need U (100%) (Black Boots Remix)",},
        {date: "Jun 30, 2014",href: "tSvyOOgEaa8",imgSrc: "4/4d/tSvyOOgEaa8.jpg",views: "unk views",   time: "0:00",title: "[Future] Jailo & Vices - Loving You (Long Time)",},
        {date: "Jul 6, 2014", href: "S9m1G2YilNI",imgSrc: "b/b5/S9m1G2YilNI.jpg",views: "4,050 views", time: "3:01",title: "[Future] WRLD - Rapids // Moving Castle 002",},
        {date: "Jul 28, 2014",href: "TrbmKbamSNg",imgSrc: "",                    views: "unk views",   time: "0:00",title: "[Future] Rusko - Sunshower",},
        {date: "Sep 1, 2014", href: "CvFn4nvJDCI",imgSrc: "3/36/CvFn4nvJDCI.jpg",views: "unk views",   time: "0:00",title: "[EDM] Varien & 7 Minutes Dead - Mirai Sekai Pt. 1: Neo-Seoul",},
        {date: "Nov 22, 2014",href: "h1QOJHMSBJs",imgSrc: "8/8c/h1QOJHMSBJs.jpg",views: "unk views",   time: "0:00",title: "[EDM] NΣΣT - Prologue/Hanabi",},
        {date: "Nov 26, 2014",href: "nb1beB0cOtA",imgSrc: "2/23/nb1beB0cOtA.jpg",views: "unk views",   time: "3:03",title: "ScHoolboy Q - Studio (Vices & Yung Wall Street Remix)",},
        {date: "Dec 24, 2014",href: "3oDUhXza2Vs",imgSrc: "5/5b/3oDUhXza2Vs.jpg",views: "unk views",   time: "0:00",title: "Gregory Esayan - Monday Night (Volant Remix)",},
        {date: "Jan 12, 2015",href: "VgqvqM8dev8",imgSrc: "a/a3/VgqvqM8dev8.jpg",views: "unk views",   time: "0:00",title: "Porter Robinson - Sad Machine (Live Version with Song of Storms & Easy)",},
        {date: "Jan 28, 2015",href: "XaZ0eIcDnVE",imgSrc: "7/7b/XaZ0eIcDnVE.jpg",views: "6,200 views", time: "5:01",title: "Stwo - Eden (Oshi Remix)",},
        {date: "Jan 28, 2015",href: "vyYi3PgYHYA",imgSrc: "d/d3/vyYi3PgYHYA.jpg",views: "unk views",   time: "0:00",title: "Seven Lions (Feat. Lynn Gunn) - Lose Myself",},
        {date: "Mar 10, 2015",href: "MJ3t_u2x7UM",imgSrc: "2/21/MJ3t_u2x7UM.jpg",views: "6 views",     time: "4:28",title: "Kaskade & John Dahlback - A Little More (Zeelaa Heaven Trap Edit)",},
        {date: "Mar 31, 2015",href: "TstbFoWwBDg",imgSrc: "b/b6/TstbFoWwBDg.jpg",views: "unk views",   time: "0:00",title: "San Holo - BWU",},
        // Add more items as needed
    ];














































































    const addedItemUrls = new Set();

    function parseDate(dateString) {
        const months = {
            'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
            'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
        };
        const [month, day, year] = dateString.split(' ');
        return new Date(`${year}-${months[month]}-${day}`);
    }

    function formatDate(date) {
        const months = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    }

    function generateItemHTML(item) {
        const formattedDate = formatDate(item.date);

        return `
<li class="channels-content-item yt-shelf-grid-item">
  <div class="context-data-item yt-lockup clearfix yt-lockup-grid yt-lockup-video" bis_skin_checked="1">
    <div class="yt-lockup-thumbnail" bis_skin_checked="1">
      <a class="ux-thumb-wrap contains-addto " href="https://removededm.com/${item.href}">
        <span class="video-thumb yt-thumb yt-thumb-185 yt-thumb-fluid">
          <span class="yt-thumb-default">
            <span class="yt-thumb-clip">
              <span class="yt-thumb-clip-inner">
                <img alt="Thumbnail" src="https://removededm.com/w/img_auth.php/${item.imgSrc}" width="185">
                <span class="vertical-align"></span>
              </span>
            </span>
          </span>
        </span>
        <span class="video-time">${item.time}</span>
        <button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default addto-button video-actions addto-watch-later-button yt-uix-button-size-small yt-uix-button-empty">
          <span class="yt-uix-button-content">
            <img src="//s.ytimg.com/yts/img/pixel-vfl3z5WfW.gif">
          </span>
        </button>
      </a>
    </div>
    <div class="yt-lockup-content" bis_skin_checked="1">
      <h3 class="yt-lockup-title">
        <a class="yt-uix-sessionlink yt-uix-tile-link yt-ui-ellipsis yt-ui-ellipsis-2 g-hovercard" dir="ltr" title="${item.title}" href="https://removededm.com/${item.href}">
          <span class="yt-ui-ellipsis-wrapper">${item.title}</span>
        </a>
      </h3>
      <div class="yt-lockup-meta yt-ui-ellipsis yt-ui-ellipsis-2" bis_skin_checked="1">
        <ul class="yt-lockup-meta-info">
          <li class="view-count-stat">${item.views}</li>
          <li class="yt-lockup-deemphasized-text">${formattedDate}</li>
        </ul>
      </div>
    </div>
  </div>
</li>`;
    }

    function insertNewItems() {
        const existingItems = Array.from(document.querySelectorAll('li.channels-content-item.yt-shelf-grid-item'));

        // Extract existing dates and elements
        const existingItemsWithDates = existingItems.map(item => {
            const dateText = item.querySelector('.yt-lockup-deemphasized-text')?.textContent.trim();
            return {
                element: item,
                date: dateText ? parseDate(dateText) : new Date(0)
            };
        });

        // Sort new items by date
        const sortedNewItems = newItems.map(item => ({
            ...item,
            date: parseDate(item.date)
        })).sort((a, b) => a.date - b.date);

        sortedNewItems.forEach(newItem => {
            if (!addedItemUrls.has(newItem.href)) {
                // Check the position for the new item
                const position = existingItemsWithDates.findIndex(existingItem => newItem.date <= existingItem.date);

                if (position === -1) {
                    // If no items are on the list, append to the end
                    const container = document.querySelector('ul.channels-content-item-list');
                    if (container) {
                        container.insertAdjacentHTML('beforeend', generateItemHTML(newItem));
                        addedItemUrls.add(newItem.href);
                    }
                } else {
                    // Insert the item before the found position
                    const nextItem = existingItemsWithDates[position]?.element;
                    if (nextItem) {
                        // Ensure there is an item after the new one to avoid inconsistencies
                        const hasNextItem = existingItemsWithDates[position + 1]?.element;
                        if (hasNextItem || position === existingItemsWithDates.length - 1) {
                            nextItem.insertAdjacentHTML('beforebegin', generateItemHTML(newItem));
                            addedItemUrls.add(newItem.href);
                        }
                    }
                }
            }
        });
    }

    function observeNewItems() {
        const container = document.querySelector('ul.channels-content-item-list');

        if (!container) {
            setTimeout(observeNewItems, 1000);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    insertNewItems();
                }
            });
        });

        observer.observe(container, {
            childList: true,
            subtree: true
        });
    }

    function setupObserver() {
        const observer = new MutationObserver(() => {
            observeNewItems();
            insertNewItems(); // Initial insert in case new items are already present
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    function waitForElement() {
        const targetElementExists = document.querySelector('li.channels-content-item.yt-shelf-grid-item div.context-data-item.yt-lockup.clearfix.yt-lockup-grid.yt-lockup-video img[src="https://i.ytimg.com/vi/3e08AnK9zW8/maxresdefault.jpg"]');

        if (targetElementExists) {
            setupObserver();
        } else {
            setTimeout(waitForElement, 1000);
        }
    }

    waitForElement();
})();
