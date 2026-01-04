// ==UserScript==
// @name         TM Color Change(Beta)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  自由变更TM的颜色！包括字体颜色和背景颜色！
// @author       紫竹FC,湖南湘涛
// @match        https://trophymanager.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495660/TM%20Color%20Change%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495660/TM%20Color%20Change%28Beta%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get color from localStorage or use default
    function getColorFromStorage(key, defaultValue) {
        return localStorage.getItem(key) || defaultValue;
    }

    // Function to save color to localStorage
    function saveColorToStorage(key, color) {
        localStorage.setItem(key, color);
    }

    // Create color pickers and labels
    const container = document.createElement('div');
    const bgColorLabel = document.createElement('label');
    const bgColorPicker = document.createElement('input');
    const textColorLabel = document.createElement('label');
    const textColorPicker = document.createElement('input');
    const toggleButton = document.createElement('button');
    const resetButton = document.createElement('button');
    const pictureInverseLabel = document.createElement('label');
    const pictureInversePicker = document.createElement('input');

    toggleButton.textContent = '展开/隐藏';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = 10000;
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';

    resetButton.textContent = '重置';
    resetButton.style.backgroundColor = '#007bff';
    resetButton.style.color = '#fff';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '5px';
    resetButton.style.cursor = 'pointer';

    container.style.position = 'fixed';
    container.style.top = '50px';
    container.style.left = '10px';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    container.style.padding = '10px';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.zIndex = 10000;
    container.style.display = 'none'; // Start hidden
    container.style.flexDirection = 'column'; // Make it a column flex container

    const bgColorContainer = document.createElement('div');
    const textColorContainer = document.createElement('div');
    const pictureInverserContainer = document.createElement('div');
    bgColorContainer.style.marginBottom = '10px'; // Add some space between the rows

    bgColorLabel.textContent = '背景颜色:';
    bgColorLabel.style.marginRight = '10px';
    bgColorPicker.type = 'color';
    bgColorPicker.value = getColorFromStorage('bgColor', '#353839'); // default background color

    textColorLabel.textContent = '文字颜色:';
    textColorLabel.style.marginRight = '10px';
    textColorPicker.type = 'color';
    textColorPicker.value = getColorFromStorage('textColor', '#ffffff'); // default text color

    pictureInverseLabel.textContent = '图片变色:';
    pictureInverseLabel.style.marginRight = '10px';
    pictureInversePicker.type = 'range';
    pictureInversePicker.min = 0;
    pictureInversePicker.max = 360;
    pictureInversePicker.value = getColorFromStorage('pictureInverse', 0);

    bgColorContainer.appendChild(bgColorLabel);
    bgColorContainer.appendChild(bgColorPicker);

    textColorContainer.appendChild(textColorLabel);
    textColorContainer.appendChild(textColorPicker);

    pictureInverserContainer.appendChild(pictureInverseLabel);
    pictureInverserContainer.appendChild(pictureInversePicker);

    container.appendChild(bgColorContainer);
    container.appendChild(textColorContainer);
    container.appendChild(pictureInverserContainer);
    container.appendChild(resetButton);

    document.body.appendChild(toggleButton);
    document.body.appendChild(container);

    toggleButton.addEventListener('click', () => {
        container.style.display = container.style.display === 'none' ? 'flex' : 'none';
    });

    function updateColors(newBgColor, newTextColor, pictureInverse) {
        // Update styles with the new colors
        GM_addStyle(`
            tr,
            a,
            input,
            p,
            .background_gradient,
            .background_gradient_hover,
            div.std,
            .ui-state-default,
            .ui-widget-content .ui-state-default,
            .ui-widget-header .ui-state-default,
            div.buddy_list_new,
            div.inner,
            div.suggestion,
            .top_user_info .notification_content{
                background-color: ${newBgColor} !important;
            }
            body,
            html{
                background-color: ${newBgColor} !important;
                color: ${newTextColor} !important;
            }
            #suggest_clubs_box {
                background-color: ${newBgColor} !important;
            }
            div.co_parms {
                background-color: transparent !important;
                color: ${newTextColor} !important;
            }
            img {
                filter: hue-rotate(${pictureInverse}deg);
            }
        `);

        document.body.style.backgroundColor = newBgColor;
        document.body.style.color = newTextColor;

        saveColorToStorage('bgColor', newBgColor);
        saveColorToStorage('textColor', newTextColor);
        saveColorToStorage('pictureInverse', pictureInverse);
    }

    resetButton.addEventListener('click', () => {
        updateColors('#336E03', '#ffffff', 0);
        bgColorPicker.value = '#336E03';
        textColorPicker.value = '#ffffff';
        pictureInversePicker.value = 0;
    });

    // Initial color update
    updateColors(bgColorPicker.value, textColorPicker.value, pictureInversePicker.value);

    // Update colors on color change
    bgColorPicker.addEventListener('input', (event) => {
        const newBgColor = event.target.value;
        saveColorToStorage('bgColor', newBgColor);
        updateColors(newBgColor, textColorPicker.value, pictureInversePicker.value);
    });
    textColorPicker.addEventListener('input', (event) => {
        const newTextColor = event.target.value;
        saveColorToStorage('textColor', newTextColor);
        updateColors(bgColorPicker.value, newTextColor, pictureInversePicker.value);
    });
    pictureInversePicker.addEventListener('input', (event) => {
        const pictureInverse = event.target.value;
        saveColorToStorage('pictureInverser', pictureInverse);
        updateColors(bgColorPicker.value, textColorPicker.value, pictureInverse);
    });

    // Additional styles
    GM_addStyle(`
        div {
            background-color: transparent !important;
        }
        #tlpop_hischat {
            background-color: rgb(51, 51, 51) !important;
        }
        #tlpop_status {
            background-color: gray !important;
        }
        #tooltip {
            background-color: #333 !important;
        }
        div.away.color {
            background-color: rgb(10, 5, 76) !important;
        }
        #mystarbox.home.color,
        #myxp.home.color,
        div.home.color {
            background-color: rgb(127, 127, 127) !important;
        }
        div.tabs_new,
        div.tabs,
        div.body_end,
        div.body_foot,
        div.box_head,
        div.box_footer,
        div.overlay,
        .box_footer div,
        #top_menu,
        #top_menu_sub,
        body,
        .box_head h2.std,
        #tactics_field,
        #tactics_subs,
        div.text_fade_overlay {
            background-image: none !important;
        }
        .background_gradient {
            background: none !important;
        }
    `);
})();
