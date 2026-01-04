// ==UserScript==
// @name         Bookie Highlighter
// @namespace    heartflower.torn
// @version      1.1
// @description  Highlights bookie bets based on presets, adds a prebet button
// @author       Heartflower [2626587]
// @match        https://www.torn.com/page.php?sid=bookie*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492316/Bookie%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/492316/Bookie%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variable to use later
    let COLOR_PRESETS = [];

    // Fetch the current sport
    let HASH = window.location.hash;
    HASH = fetchSport(HASH);

    // Fetch the correct stored information
    let localStorageKey = `hf-bookie-${HASH}-preset`;
    COLOR_PRESETS = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // Check what sport page we're on
    function checkHash() {
        let currentHash = window.location.hash;
        currentHash = fetchSport(currentHash);

        if (currentHash.startsWith(HASH)) {
            // Sport is the same
            return;
        }

        // Change hash to current hash
        HASH = currentHash;

        // Change color presets
        COLOR_PRESETS = [];
        let localStorageKey = `hf-bookie-${HASH}-preset`;
        COLOR_PRESETS = JSON.parse(localStorage.getItem(localStorageKey)) || [];

        // Create new preset container
        createPresetWrapper();
        setTimeout(fetchFirstMatch, 100);
    }

    // Fetch sport based on hash
    function fetchSport(hash) {
        hash = hash.substring(2);
        let slashIndex = hash.indexOf('/');
        if (slashIndex !== -1) {
            hash = hash.substring(0, slashIndex);
        }

        return hash;
    }

    // Create observer to check if bet containers are opened
    function createObserver() {
        let targetNode = document.body.querySelector('.bookie-games-boxes');
        if (!targetNode) {
            setTimeout(createObserver, 100);
            return;
        }

        let config = { attributes: false, childList: true, subtree: true };
        let observer = new MutationObserver(mutationObserved);
        observer.observe(targetNode, config);
    }

    // Check if mutation is because a bet container was opened
    function mutationObserved(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('bets-wrap')) {
                        fetchBets(node);
                        fetchNextMatch(node);
                    }
                });
            }
        }
    }

    // Fetch the first match
    function fetchFirstMatch() {
        let ul = document.body.querySelector('.pop-list');

        if (!ul) {
            setTimeout(fetchFirstMatch, 100);
            return;
        }

        let firstLI = ul.querySelector('.c-pointer');


        // Upon clicking downwards key, open the first match
        function clickHandler(event) {
            if (event.keyCode !== 40) {
                return;
            }

            event.preventDefault();

            let ahref = firstLI.querySelector('a');

            ahref.click();
            ahref.dispatchEvent(new Event('click', { bubbles: true }));

            document.removeEventListener('keydown', clickHandler);
        }

        document.addEventListener('keydown', clickHandler);
    }

    // Fetch the next match
    function fetchNextMatch(betsWrap) {
        let infoWrap = betsWrap.parentNode;

        if (!infoWrap) {
            return;
        }

        let li = infoWrap.parentNode;
        let next = li.nextSibling;
        let previous = li.previousSibling;

        // Upon clicking downwards key, open the next match
        function keyDown(event) {
            if (event.keyCode !== 40) {
                return;
            }

            event.preventDefault();

            let ahref = next.querySelector('a');

            ahref.click();
            ahref.dispatchEvent(new Event('click', { bubbles: true }));

            document.removeEventListener('keydown', keyDown);
        }

        // Upon clicking upwards key, open the previous match
        function keyUp(event) {
            if (event.keyCode !== 38) {
                return;
            }

            event.preventDefault();

            let ahref = previous.querySelector('a');

            ahref.click();
            ahref.dispatchEvent(new Event('click', { bubbles: true }));

            document.removeEventListener('keyup', keyUp);
        }

        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);
    }

    function clickLi(li) {
        li.click();
    }

    // Fetch all possible bets and their multipliers
    function fetchBets(wrap) {
        let bets = wrap.querySelectorAll('.bets');
        if (!bets || bets.length < 2) {
            setTimeout(function() {
                fetchBets(wrap);
            }, 100);
            return;
        }

        // Highlight bets based on preset
        bets.forEach(bet => {
            highlightBet(bet);
            moneyThings(bet);
        });
    }

    function highlightBet(bet) {
        let multiplierElement = bet.querySelector('.multiplier___dfyoN');
        if (!multiplierElement) {
            return;
        }

        // Fetch multiplier and its color based on the preset
        let multiplier = parseFloat(multiplierElement.textContent.replace('Multiplier: x', ''));
        let color = fetchColor(multiplier);

        if (color === 'none') {
            bet.style.background = '';
        } else {
            let transparentColor = hexToRGBA(color, 0.15);
            bet.style.background = transparentColor;
        }
    }

    function moneyThings(bet) {
        let existingButton = bet.querySelector('.hf-preset-button');
        if (existingButton) {
            return;
        }

        let multiplierElement = bet.querySelector('.multiplier___dfyoN');
        if (!multiplierElement) {
            return;
        }

        // Fetch multiplier and its prebet based on the preset
        let multiplier = parseFloat(multiplierElement.textContent.replace('Multiplier: x', ''));

        let inputContainer = bet.querySelector('.inputContainer___iyrOg');
        let inputMoneyGroup = bet.querySelector('.input-money-group');

        if (!inputMoneyGroup) {
            return;
        }

        let span = inputMoneyGroup.querySelector('span');
        let betButton = inputContainer.querySelector('.input-btn');

        let inputs = inputMoneyGroup.querySelectorAll('input');


        let button = document.createElement('button');
        button.textContent = 'PreBet';
        button.className = 'torn-btn hf-preset-button';
        button.style.height = '24px';
        button.style.setProperty('height', '24px', 'important');

        inputContainer.appendChild(button);

        // Add click listener on the button
        button.addEventListener('click', function() {
            span.dispatchEvent(new Event('click', { bubbles: true }));

            // Watch for the input trigger, then delete the listener after
            function inputHandler(event) {
                const input = event.target;
                if (input.value == '') {
                    return;
                }
                let prebet = fetchPrebet(multiplier);
                input.value = prebet;
                input.removeEventListener('input', inputHandler);
            }

            inputs.forEach(input => {
                input.addEventListener('input', inputHandler);
            });

            // Set a timeout, cause it needs to run twice for some reason
            setTimeout(function() {
                span.dispatchEvent(new Event('click', { bubbles: true }));

                inputs.forEach(input => {
                    input.addEventListener('input', inputHandler);
                });
            }, 10);

            // Click the bet button
            setTimeout(function() {
                betButton.dispatchEvent(new Event('click', { bubbles: true }));
            }, 10);
        });
    }

    // Fetch color based on number and preset
    function fetchColor(number) {
        for (let preset of COLOR_PRESETS) {
            if (number >= preset.min && number < preset.max) {
                return preset.color;
            }
        }

        return 'none';
    }

    function fetchPrebet(number) {
        for (let preset of COLOR_PRESETS) {
            if (number >= preset.min && number < preset.max) {
                return preset.prebet;
            }
        }

        return 100;
    }

    // Create preset container
    function createPresetWrapper() {
        let wrapper = document.body.querySelector('.appHeaderWrapper___uyPti');
        if (!wrapper) {
            // If the page hasn't fully loaded in yet, try again in a few
            setTimeout(createPresetWrapper, 100);
            return;
        }

        // Remove previous elements
        let currentTitle = document.body.querySelector('.hf-preset-title');
        if (currentTitle) {
            currentTitle.remove();
        }

        let currentContainer = document.body.querySelector('.hf-preset-container');
        if (currentContainer) {
            currentContainer.remove();
        }

        let parent = wrapper.parentNode;
        let lastChild = parent.lastChild;

        // Create a title element
        let title = document.createElement('div');
        title.className = 'title-black top-round hf-preset-title';
        title.textContent = 'Bet highlighter settings';

        // Fetch the open/closed status of the container
        let openContainer = 'true';

        let existingSetting = localStorage.getItem('hf-bookie-show-container');
        if (existingSetting) {
            openContainer = existingSetting;
        }

        // Append an arrow style for clarity
        let span = document.createElement('span');
        span.className = 'hf-preset-collapse';

        if (openContainer === 'true') {
            span.textContent = '►';
        } else {
            span.textContent = '▼';
        }

        title.appendChild(span);

        // Create a container element
        let container = document.createElement('div');
        container.className = 't-blue-cont h cont-gray bottom-round hf-preset-container';

        parent.insertBefore(title, lastChild);
        parent.insertBefore(container, lastChild);

        // Create an event listener on the title for collapsing
        title.addEventListener('click', function() {
            if (openContainer === 'true') {
                span.textContent = '►';
                title.classList.add('hf-preset-closed');
                container.classList.add('hf-preset-closed');
                openContainer = 'false';
                localStorage.setItem('hf-bookie-show-container', 'false');
            } else {
                span.textContent = '▼';
                title.classList.remove('hf-preset-closed');
                container.classList.remove('hf-preset-closed');
                openContainer = 'true';
                localStorage.setItem('hf-bookie-show-container', 'true');
            }
        });

        // Create an ul to append presets to
        let ul = document.createElement('ul');
        ul.className = 'hf-preset-ul';
        container.appendChild(ul);

        // Create LIs based on previously saved preset
        createPresetLIs(ul);

        // Create LI to add new color
        let li = document.createElement('li');
        li.className = 'hf-preset-new-li';
        ul.appendChild(li);

        // Create 'Add new color' button
        let button = document.createElement('button');
        button.className = 'torn-btn hf-preset-new-button';
        button.textContent = 'Add new color';
        li.appendChild(button);

        // If the button is clicked, add the new LI
        button.addEventListener('click', function() {
            createLI(ul);
        });
    }

    // Create LI's based on previously saved presets
    function createPresetLIs(ul) {
        COLOR_PRESETS.forEach(preset => {
            createLI(ul, preset.color, preset.min, preset.max, preset.prebet);
        });
    }

    function createLI(ul, color, min, max, prebet) {
        let li = document.createElement('li');
        li.className = 'hf-preset-color-li';

        // Insert before 'Add new color' button
        let lastChild = ul.lastElementChild;
        ul.insertBefore(li, lastChild);

        if (!color && !min && !max && !prebet) {
            // Add new preset
            let preset = { min: 0, max: 0, color: '#000000', prebet: 100 };
            COLOR_PRESETS.push(preset);

            // Save in local Storage for future use
            let localStorageKey = `hf-bookie-${HASH}-preset`;
            localStorage.setItem(localStorageKey, JSON.stringify(COLOR_PRESETS));

            color = '#000000';
            prebet = 100;
        }

        // Create the content of the LI
        createColorPicker(li, color);
        createTitleSpan(li, 'Multiplier:')
        createNumberInput(li, 'min', min);
        createDashSpan(li);
        createNumberInput(li, 'max', max);
        createTitleSpan(li, 'Prebet:');
        createValueInput(li, prebet);
        createRemoveButton(li);
    }

    // Create a color picker
    function createColorPicker(li, color) {
        let input = document.createElement('input');
        input.className = 'hf-preset-color-picker';
        input.type = 'color';
        input.value = color;

        li.appendChild(input);

        // If the user changes the color...
        input.addEventListener('change', function() {
            let index = COLOR_PRESETS.findIndex(preset => preset.color.toLowerCase() === color);
            let selectedColor = input.value;
            color = selectedColor;

            // Change the color in the saved preset
            COLOR_PRESETS[index].color = selectedColor;
            let localStorageKey = `hf-bookie-${HASH}-preset`;
            localStorage.setItem(localStorageKey, JSON.stringify(COLOR_PRESETS));

            // Change the currently open bets if there are any
            let betsWrap = document.body.querySelector('.bets-wrap');
            if (betsWrap) {
                fetchBets(betsWrap);
            }
        });
    }

    // Change a hex value to a RGBA value (to not have 100% opacity on the bet backgrounds)
    function hexToRGBA(hex, opacity) {
        hex = hex.replace('#', '');
        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Create a number input
    function createNumberInput(li, type, value) {
        let input = document.createElement('input');
        input.className = 'hf-preset-number-input';
        input.type = 'number';
        input.step = '0.01';
        input.min = 0;
        input.value = value;

        if (type === 'min') {
            input.classList.add('hf-min-input');
        } else if (type === 'max') {
            input.classList.add('hf-max-input');
        }

        li.appendChild(input);

        // If the user changes the value...
        input.addEventListener('change', function() {
            let selectedValue = parseFloat(input.value);

            // Find the index in the saved presets
            let colorPicker = li.querySelector('.hf-preset-color-picker');
            let color = colorPicker.value;
            let index = COLOR_PRESETS.findIndex(preset => preset.color.toLowerCase() === color);

            // Update the preset with the new change
            if (type === 'min') {
                COLOR_PRESETS[index].min = selectedValue;
            } else if (type === 'max') {
                COLOR_PRESETS[index].max = selectedValue;
            }

            // Change it in local storage as well
            let localStorageKey = `hf-bookie-${HASH}-preset`;
            localStorage.setItem(localStorageKey, JSON.stringify(COLOR_PRESETS));

            // If there are any bets open, update those
            let betsWrap = document.body.querySelector('.bets-wrap');
            if (betsWrap) {
                fetchBets(betsWrap);
            }
        });
    }

    function createTitleSpan(li, title) {
        let span = document.createElement('span');
        span.textContent = title;
        span.className = 'hf-preset-title-span';

        if (title === 'Prebet:') {
            span.style.marginLeft = '5px';
        }

        li.appendChild(span);
    }

    function createValueInput(li, value) {
        // Change to formatted number
        value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Create text input so the user can use ,
        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'hf-preset-value-input';
        input.value = value;
        li.appendChild(input);

        // Change to formatted number for readability upon changing the value
        input.addEventListener('input', function() {
            let value = input.value;

            if (value == '') {
                input.value = 0;
            } else {
                value = value.replace(/,/g, '');
                value = interpretAbbreviation(value);

                value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                input.value = value;
            }
        });

        // Save the number upon changing it
        input.addEventListener('change', function() {
            let value = input.value;
            value = value.replace(/\D/g, '');

            // Find the index in the saved presets
            let colorPicker = li.querySelector('.hf-preset-color-picker');
            let color = colorPicker.value;
            let index = COLOR_PRESETS.findIndex(preset => preset.color.toLowerCase() === color);

            COLOR_PRESETS[index].prebet = value;

            // Change it in local storage as well
            let localStorageKey = `hf-bookie-${HASH}-preset`;
            localStorage.setItem(localStorageKey, JSON.stringify(COLOR_PRESETS));
        });

        // If the user clicks arrow up, do number + 1
        input.addEventListener('keyup', function(event) {
            if (event.keyCode === 38) {
                let value = input.value;
                value = parseInt(value.replace(/\D/g, ''));
                value++;
                value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                input.value = value;
            }
        });

        // If the user clicks arrow down, do number -1
        input.addEventListener('keydown', function(event) {
            if (event.keyCode === 40) {
                let value = input.value;
                value = parseInt(value.replace(/\D/g, ''));
                value--;
                value = Math.max(0, value);
                value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                input.value = value;
            }
        });
    }

    // Interpret what 1k, 1m etc mean
    function interpretAbbreviation(value) {
        // Regular expression to match abbreviated numbers like "1k", "2m", etc.
        let regex = /^(\d+)([kmb])$/i;
        let match = value.match(regex);

        if (match) {
            let number = parseInt(match[1]);
            let modifier = match[2].toLowerCase();

            // Convert the abbreviated number to its numeric value
            if (modifier == 'k') {
                return number * 1000;
            } else if (modifier == 'm') {
                return number * 1000000;
            } else if (modifier == 'b') {
                return number * 1000000000;
            }
        }

        // If the value is not in an abbreviated format, return it as is
        return parseInt(value.replace(/\D/g, ''));
    }

    // Create the dash between two number inputs
    function createDashSpan(li) {
        let span = document.createElement('span');
        span.className = 'hf-preset-dash-span';
        span.textContent = '─';
        li.appendChild(span);
    }

    // Create a 'Remove LI' button
    function createRemoveButton(li) {
        let button = document.createElement('button');
        button.className = 'torn-btn hf-preset-remove-button';
        button.textContent = 'X';
        li.appendChild(button);

        // Hover starts
        button.addEventListener('mouseover', function(event) {
            li.style.background = 'var(--default-bg-panel-active-color)';
        });

        // Hover ends
        button.addEventListener('mouseout', function(event) {
            li.style.background = '';
        });

        // Button is clicked
        button.addEventListener('click', function() {
            // Remove the li
            li.remove();

            // Find the preset
            let colorPicker = li.querySelector('.hf-preset-color-picker');
            let color = colorPicker.value;
            let index = COLOR_PRESETS.findIndex(preset => preset.color.toLowerCase() === color);

            // Remove the preset
            COLOR_PRESETS.splice(index, 1);

            // Save the updated presets to localStorage
            let localStorageKey = `hf-bookie-${HASH}-preset`;
            localStorage.setItem(localStorageKey, JSON.stringify(COLOR_PRESETS));

            // If there are bets visible, change them
            let betsWrap = document.body.querySelector('.bets-wrap');
            if (betsWrap) {
                fetchBets(betsWrap);
            }
        });
    }

    // Functions to run upon page load
    createObserver();
    createPresetWrapper();
    fetchFirstMatch();

    // Check if the hash changed when the user clicks on the page
    document.body.addEventListener('click', function() {
        setTimeout(checkHash, 100);
    });

    // CSS
    let styles = `
		.hf-preset-title {
			margin-top: 10px;
			background: var(--default-bg-20-gradient) !important;
            display: flex;
            justify-content: space-between;
            cursor: pointer;
		}

		.hf-preset-container {
			padding: 10px;
		}

		.hf-preset-ul {
			display: flex;
			flex-wrap: wrap;
		}

		.hf-preset-new-li {
			margin-top: 5px;
			width: 100%;
		}

		.hf-preset-new-button {
			font-size: 12px;
			line-height: normal;
			height: 26px;
		}

		.hf-preset-color-li {
			display: flex;
			align-items: center;
			margin-top: 5px;
			margin-right: 20px;
		}

		.hf-preset-color-picker {
			background: none !important;
			border: none !important;
			border-radius: 0px !important;
			width: 21px;
			height: 25px;
			margin-right: 5px;
		}

		.hf-preset-number-input {
			padding: 5px;
			width: 60px;
            margin: 0px 5px;
		}

        .hf-preset-value-input {
            padding: 5px;
            width: 80px;
            margin-left: 5px;
        }

		.hf-preset-remove-button {
			margin-left: 10px;
			font-size: 12px;
			line-height: normal;
			height: 26px;
		}

        .hf-preset-collapse {
            margin-right: 10px;
        }

        .hf-preset-container.hf-preset-closed {
            display: none;
        }

        .hf-preset-title.hf-preset-closed {
            border-radius: 5px !important;
        }

        .hf-preset-title.hf-preset-closed::before {
            display: none !important;
        }

        .hf-preset-button {
            line-height: normal;
            margin-left: 5px;
            font-size: 12px;
            padding: 8px;
            display: inline-flex;
            align-items: center;
        }

        .hf-preset-title-span {
            font-weight: bold;
        }
	`;

    // Append CSS to document
    let styleSheet = document.createElement('style');
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet)

})();