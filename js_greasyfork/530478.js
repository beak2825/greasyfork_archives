// ==UserScript==
// @name         AH End Time
// @namespace    heartflower.torn
// @version      1.0
// @description  Displays AH's end time in your own timezone
// @author       Heartflower [2626587]
// @match        https://www.torn.com/amarket.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530478/AH%20End%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/530478/AH%20End%20Time.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findAuctionHouse() {
        let itemsList = document.body.querySelector('#auction-house-tabs .tabContainer .items-list-wrap .items-list');
        if (!itemsList) {
            setTimeout(findAuctionHouse, 100);
            return;
        }

        createObserver(itemsList);

        let validItems = Array.from(itemsList.children).filter(item => !item.classList.contains("last") && !item.classList.contains("clear"));
        if (validItems.length < 1) {
            setTimeout(findAuctionHouse, 100);
            return;
        }

        let items = itemsList.querySelectorAll('li');
        for (let item of items) {
            findTimer(item);
        }
    }

    function findTimer(item) {
        if (item.classList.contains('last')) return;
        if (item.classList.contains('clear')) return;

        let timeWrap = item.querySelector('.time-wrap');
        if (!timeWrap) {
            setTimeout(() => findAuctionHouse, 100);
            return;
        }

        let span = timeWrap.querySelector('span');
        let formattedTime = convertStringToTime(span.title.trim());
        addTimeColumn(item, formattedTime)
    }

    function convertStringToTime(string) {
        string = string.replace('Ends on ', '');

        let [time, date] = string.split(' - '); // Split time and date
        let [hours, minutes, seconds] = time.split(':').map(Number);
        let [day, month, year] = date.split('/').map(Number);

        // Construct the Date object (assuming input is UTC)
        let auctionDateUTC = new Date(Date.UTC(year + 2000, month - 1, day, hours, minutes, seconds));

        // Convert to local timezone
        let localDate = new Date(auctionDateUTC);
        let formattedTime = `${String(localDate.getDate()).padStart(2, '0')}/${String(localDate.getMonth() + 1).padStart(2, '0')}\n${String(localDate.getHours()).padStart(2, '0')}:${String(localDate.getMinutes()).padStart(2, '0')}`;

        return formattedTime;
    }

    function addTimeColumn(item, time) {
        let currentSpan = item.querySelector('.hf-lt-timer');
        if (currentSpan) return;

        let sellerWrap = item.querySelector('.seller-wrap');
        sellerWrap.style.width = '172px';

        let delimiter = sellerWrap.querySelector('.delimiter');
        delimiter.style.width = '172px';

        let mobWrap = item.querySelector('.mob-wrap');

        let div = document.createElement('div');
        div.classList.add('time-wrap');
        div.style.paddingTop = '0px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.paddingLeft = '3px';
        div.style.lineHeight = 'normal';

        let span = document.createElement('span');
        span.classList.add('hf-lt-timer');
        span.innerHTML = 'Ends on<br>' + time;
        div.appendChild(span);

        item.insertBefore(div, mobWrap);
    }

    function editTimeCell(element) {
        let timer = element.parentNode.parentNode;
        let time = convertStringToTime(timer.title.trim());
        let li = element.closest('li');

        let timeCell = li.querySelector('.hf-lt-timer');

        timeCell.innerHTML = 'Ends on<br>' + time;
    }

    function createObserver(element) {
        let target = element;
        if (!target) {
            console.error(`Target not found.`);
            return;
        }

        let observer = new MutationObserver(function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    if (mutation.target.classList.contains('dh-time')) {
                        editTimeCell(mutation.target);
                    } else if (mutation.target.tagName === "LI") {
                        findTimer(mutation.target);
                    }
                }
            }
        });

        let config = { attributes: true, childList: true, subtree: true, characterData: true };
        observer.observe(target, config);
    }

    findAuctionHouse();

})();