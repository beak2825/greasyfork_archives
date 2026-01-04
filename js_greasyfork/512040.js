// ==UserScript==
// @name         Boosty socionic style
// @namespace    http://tampermonkey.net/
// @version      2024-10-06
// @description  Добавление тима рядом с именем, увеличение ширины страницы, небольшие визуальные корректировки
// @author       IDtwelve
// @match        https://boosty.to/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512040/Boosty%20socionic%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/512040/Boosty%20socionic%20style.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
    'use strict';

    // Cache selectors that do not change
    const layoutGrid = document.querySelector('.Layout_grid_vmyYz');
    const layoutGridLeft = document.querySelector('.Layout_threeColsLeft_H_mjN');
    const layoutGridCenter = document.querySelector('.Layout_threeColsCenter_UVHo0');
    const layoutContent = document.querySelector('.Layout_content_DHSAI');
    const layoutPosts = document.querySelectorAll('.Post_root_0fEms');

    // Use a map for tims
    const timMap = new Map([
        ['Дон Кихот', []],
        ['Дюма', []],
        ['Гюго', ['Ася Б.']],
        ['Робеспьер', []],
        ['Гамлет', []],
        ['Максим', []],
        ['Жуков', []],
        ['Есенин', []],
        ['Наполеон', []],
        ['Бальзак', []],
        ['Джек', []],
        ['Драйзер', []],
        ['Штирлиц', []],
        ['Достоевский', []],
        ['Гексли', []],
        ['Габен', []],
    ]);

    // Styles for tims
    const timStyles = {
        'Дон Кихот': { backgroundColor: '#479a3c', boxShadow: '0 0.2rem 0.3rem #326030' },
        'Дюма': { backgroundColor: '#326030', boxShadow: '0 0.2rem 0.3rem #479a3c' },
        'Гюго': { backgroundColor: '#588973', boxShadow: '0 0.2rem 0.3rem #5aa982' },
        'Робеспьер': { backgroundColor: '#5aa982', boxShadow: '0 0.2rem 0.3rem #588973' },
        'Гамлет': { backgroundColor: '#c5702b', boxShadow: '0 0.2rem 0.3rem #a7431f' },
        'Максим': { backgroundColor: '#a7431f', boxShadow: '0 0.2rem 0.3rem #c5702b' },
        'Жуков': { backgroundColor: '#dda338', boxShadow: '0 0.2rem 0.3rem #e3c644' },
        'Есенин': { backgroundColor: '#e3c644', boxShadow: '0 0.2rem 0.3rem #dda338' },
        'Наполеон': { backgroundColor: '#a1336f', boxShadow: '0 0.2rem 0.3rem #9d3774' },
        'Бальзак': { backgroundColor: '#9d3774', boxShadow: '0 0.2rem 0.3rem #a1336f' },
        'Джек': { backgroundColor: '#8a211d', boxShadow: '0 0.2rem 0.3rem #b92d2c' },
        'Драйзер': { backgroundColor: '#b92d2c', boxShadow: '0 0.2rem 0.3rem #8a211d' },
        'Штирлиц': { backgroundColor: '#5030a8', boxShadow: '0 0.2rem 0.3rem #492893' },
        'Достоевский': { backgroundColor: '#492893', boxShadow: '0 0.2rem 0.3rem #5030a8' },
        'Гексли': { backgroundColor: '#262dbe', boxShadow: '0 0.2rem 0.3rem #181e93' },
        'Габен': { backgroundColor: '#181e93', boxShadow: '0 0.2rem 0.3rem #262dbe' },
    };

    // Function to apply styles to name elements
    function applyStylesToNames() {
        const nameElements = document.querySelectorAll('.CommentView_name_rDuK_');
        nameElements.forEach(nameElement => {
            // Skip if already styled
            if (nameElement.getAttribute('data-styled') === 'true') return;

            nameElement.style.fontWeight = 'bold';
            timMap.forEach((names, tim) => {
                if (names.includes(nameElement.textContent)) {
                    const elemSpan = document.createElement('span');
                    elemSpan.textContent = tim;
                    elemSpan.classList.add('tim');
                    nameElement.insertAdjacentElement('afterend', elemSpan);
                    // Apply styles
                    const styles = timStyles[tim];
                    if (styles) {
                        elemSpan.style.backgroundColor = styles.backgroundColor;
                        elemSpan.style.boxShadow = styles.boxShadow;
                    }
                    elemSpan.style.position = 'relative';
                    elemSpan.style.marginRight = '5px';
                    elemSpan.style.fontSize = '10px';
                    elemSpan.style.padding = '2px';
                    elemSpan.style.color = 'white';
                }
            });

            // Mark as styled
            nameElement.setAttribute('data-styled', 'true');
        });

        // Set styles for layout and posts
        layoutPosts.forEach(post => {
            post.style.width = '675px';
        });

        layoutGrid.style.justifyContent = 'center';
        layoutGridLeft.style.marginRight = '0px';
        layoutGridCenter.style.marginRight = '20px';
        layoutGridCenter.style.marginLeft = '20px';
        layoutGridCenter.style.width = '675px';
        layoutContent.style.width = '1440px';
    }

    // Initial application of styles
    applyStylesToNames();

    // Use MutationObserver to handle dynamically shown content
    const observer = new MutationObserver(applyStylesToNames);
    observer.observe(document.body, { childList: true, subtree: true });

});
