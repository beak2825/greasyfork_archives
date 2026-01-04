// ==UserScript==
// @name         s0urce.io Target List Sorter
// @namespace    s0urce.io Target List Sorter
// @version      0.1
// @description  Adds sorting functionality to the target list in s0urce.io
// @author       NoT BoT
// @match        https://s0urce.io/*
// @icon         https://s0urce.io/icons/s0urce.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531417/s0urceio%20Target%20List%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/531417/s0urceio%20Target%20List%20Sorter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentSort = {
        field: null,
        direction: 'asc'
    };

    function addSortingControls() {
        const existingControls = document.querySelector('.sort-controls');
        let style = document.getElementById("STYYYYYLES");
        if (!style) {
            style = document.createElement('style');
            style.id = "STYYYYYLES";
            style.innerText = `
#list > .wrapper:not(.npc-premium) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 10px
}

#list > .wrapper:not(.npc-premium) > div{
  order: 4;
}
#list > .wrapper:not(.npc-premium) > .icon.flag{
  order: 5;
}
#list > .wrapper:not(.npc-premium) >.badge{
  order: 2;
}
#list > .wrapper:not(.npc-premium) > img.icon[src*="premium.svg"] {
  order: 3;
  margin-left: auto;
}`;
            document.head.appendChild(style);
        }

        if (existingControls) return;

        const sortingControls = `
            <div class="sort-controls" style="display: flex; gap: 5px; margin-bottom: 5px; flex-wrap: wrap;">
                <div class="sort svelte-1cv9i3z" data-sort="username" style="padding: 4px 8px; border-radius: 2px; background-color: var(--color-darkgrey); cursor: pointer;">Name</div>
                <div class="sort svelte-1cv9i3z" data-sort="username-length" style="padding: 4px 8px; border-radius: 2px; background-color: var(--color-darkgrey); cursor: pointer;">Length</div>
                <div class="sort svelte-1cv9i3z" data-sort="level" style="padding: 4px 8px; border-radius: 2px; background-color: var(--color-darkgrey); cursor: pointer;">Lvl</div>
                <div class="sort svelte-1cv9i3z" data-sort="country" style="padding: 4px 8px; border-radius: 2px; background-color: var(--color-darkgrey); cursor: pointer;">Flag</div>
                <div class="sort-reset svelte-1cv9i3z" style="padding: 4px 8px; border-radius: 2px; background-color: var(--color-darkgrey); cursor: pointer;">Reset</div>
            </div>
        `;

        const targetWindow = document.querySelector('.window:has([src="icons/targetList.svg"])');
        if (!targetWindow) return;

        const listElement = targetWindow.querySelector('#list');
        if (!listElement) return;

        listElement.insertAdjacentHTML('beforebegin', sortingControls);

        targetWindow.querySelectorAll('.sort').forEach(button => {
            button.addEventListener('click', function () {
                const sortBy = this.getAttribute('data-sort');

                if (currentSort.field === sortBy) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.field = sortBy;
                    currentSort.direction = 'asc';
                }

                sortTargetList(sortBy, currentSort.direction);

                localStorage.setItem('lastTargetSort', sortBy);
                localStorage.setItem('lastSortDirection', currentSort.direction);

                targetWindow.querySelectorAll('.sort, .sort-reset').forEach(btn => {
                    btn.style.backgroundColor = 'var(--color-darkgrey)';
                    btn.textContent = btn.textContent.replace(' ▲', '').replace(' ▼', '');
                });
                this.style.backgroundColor = 'var(--color-blue)';

                const directionIndicator = currentSort.direction === 'asc' ? ' ▲' : ' ▼';
                this.textContent = this.textContent.replace(' ▲', '').replace(' ▼', '') + directionIndicator;
            });
        });

        const resetButton = targetWindow.querySelector('.sort-reset');
        if (resetButton) {
            resetButton.addEventListener('click', function () {
                currentSort.field = null;
                currentSort.direction = 'asc';

                localStorage.removeItem('lastTargetSort');
                localStorage.removeItem('lastSortDirection');

                resetTargetList(targetWindow);

                targetWindow.querySelectorAll('.sort, .sort-reset').forEach(btn => {
                    btn.style.backgroundColor = 'var(--color-darkgrey)';
                    btn.textContent = btn.textContent.replace(' ▲', '').replace(' ▼', '');
                });

                this.style.backgroundColor = 'var(--color-blue)';
            });
        }

        const lastSort = localStorage.getItem('lastTargetSort');
        const lastDirection = localStorage.getItem('lastSortDirection') || 'asc';
        if (lastSort) {
            currentSort.field = lastSort;
            currentSort.direction = lastDirection;
            sortTargetList(lastSort, lastDirection);

            const activeButton = targetWindow.querySelector(`.sort[data-sort="${lastSort}"]`);
            if (activeButton) {
                activeButton.style.backgroundColor = 'var(--color-blue)';
                const directionIndicator = lastDirection === 'asc' ? ' ▲' : ' ▼';
                activeButton.textContent = activeButton.textContent.replace(' ▲', '').replace(' ▼', '') + directionIndicator;
            }
        }

        observeListChanges();
    }

    function resetTargetList(targetWindow) {
        const listElement = targetWindow.querySelector('#list');
        if (!listElement) return;

        const items = Array.from(listElement.querySelectorAll('.wrapper'));
        items.forEach(item => {
            item.style.order = '';
        });

        listElement.style.display = '';
        listElement.style.flexDirection = '';
        listElement.style.height = '';
        listElement.style.maxHeight = '';
        listElement.style.overflow = 'auto';
    }

    function sortTargetList(sortBy, direction = 'asc') {
        const targetWindow = document.querySelector('.window:has([src="icons/targetList.svg"])');
        if (!targetWindow) return;

        const listElement = targetWindow.querySelector('#list');
        if (!listElement) return;

        const scrollTop = listElement.scrollTop;

        let all = listElement.querySelectorAll('.wrapper');
        for (let i = 0; i < all.length; i++) {
            all[i].style.flexShrink = '0';
            all[i].style.paddingRight = '10px';
        }

        const items = Array.from(listElement.querySelectorAll('.wrapper:not(.npc, .npc-premium, [style="width: 100%; height: 1px; background-color: var(--color-lightgrey); margin: 15px 0px;"]'));

        items.forEach(item => {
            item.style.order = '';
        });

        const sortedItems = items.map((item, index) => ({
            item,
            index
        }));

        const measureElement = document.createElement('span');
        measureElement.style.visibility = 'hidden';
        measureElement.style.position = 'absolute';
        measureElement.style.whiteSpace = 'nowrap';
        document.body.appendChild(measureElement);

        function getTextWidth(text, element) {
            const usernameElement = element.querySelector('.username');
            if (usernameElement) {
                const styles = window.getComputedStyle(usernameElement);
                measureElement.style.font = styles.font;
                measureElement.style.fontSize = styles.fontSize;
                measureElement.style.fontFamily = styles.fontFamily;
                measureElement.style.fontWeight = styles.fontWeight;
            }

            measureElement.textContent = text;
            return measureElement.getBoundingClientRect().width;
        }

        sortedItems.sort((a, b) => {
            let result = 0;

            if (sortBy === 'username') {
                const usernameA = a.item.querySelector('.username')?.textContent.trim() || '';
                const usernameB = b.item.querySelector('.username')?.textContent.trim() || '';
                result = usernameA.localeCompare(usernameB);
            }
            else if (sortBy === 'username-length') {
                const usernameA = a.item.querySelector('.username')?.textContent.trim() || '';
                const usernameB = b.item.querySelector('.username')?.textContent.trim() || '';

                const widthA = getTextWidth(usernameA, a.item);
                const widthB = getTextWidth(usernameB, b.item);

                result = widthA - widthB;
            }
            else if (sortBy === 'level') {
                const levelA = parseInt(a.item.querySelector('div')?.textContent.trim()) || 0;
                const levelB = parseInt(b.item.querySelector('div')?.textContent.trim()) || 0;
                result = levelB - levelA;
            }
            else if (sortBy === 'country') {
                const flagA = a.item.querySelector('.flag');
                const flagB = b.item.querySelector('.flag');
                const countryA = flagA ? flagA.getAttribute('alt')?.replace(' Flag', '') || 'ZZ' : 'ZZ';
                const countryB = flagB ? flagB.getAttribute('alt')?.replace(' Flag', '') || 'ZZ' : 'ZZ';
                result = countryA.localeCompare(countryB);
            }

            if (sortBy === 'level') {
                return direction === 'desc' ? -result : result;
            } else {
                return direction === 'desc' ? -result : result;
            }
        });

        document.body.removeChild(measureElement);

        sortedItems.forEach((item, newIndex) => {
            item.item.style.order = newIndex;
        });

        listElement.style.display = 'flex';
        listElement.style.flexDirection = 'column';

        const parentContainer = listElement.parentElement;
        if (parentContainer) {
            const parentStyle = window.getComputedStyle(parentContainer);
            const parentHeight = parentStyle.height;

            listElement.style.height = parentHeight;
            listElement.style.maxHeight = 'none';
            listElement.style.overflow = 'auto';

            items.forEach(item => {
                item.style.flexShrink = '0';
            });
        }

        listElement.scrollTop = scrollTop;
    }

    function observeListChanges() {
        const targetWindow = document.querySelector('.window:has([src="icons/targetList.svg"])');
        if (!targetWindow) return;

        const listElement = targetWindow.querySelector('#list');
        if (!listElement) return;

        const observer = new MutationObserver(() => {
            if (currentSort.field) {
                sortTargetList(currentSort.field, currentSort.direction);
            }
        });

        observer.observe(listElement, { childList: true, subtree: true });
    }

    function checkForTargetList() {
        const targetWindow = document.querySelector('.window:has([src="icons/targetList.svg"])');
        if (targetWindow) {
            addSortingControls();
        }
    }

    setInterval(checkForTargetList, 1000);

    document.addEventListener('click', function (e) {
        if (e.target.closest('[src="icons/targetList.svg"]')) {
            setTimeout(addSortingControls, 100);
        }
    });
})();