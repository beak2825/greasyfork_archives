// ==UserScript==
// @name     https://dotnettutorials.net/ - Marking items complete
// @description    Allows marking lessons as completed in the site: dotnettutorials.net
// @version  1
// @license MIT
// @namespace vivek201
// @grant    GM.getValue
// @grant    GM.setValue
// @include  https://dotnettutorials.net/*
// @downloadURL https://update.greasyfork.org/scripts/445709/https%3Adotnettutorialsnet%20-%20Marking%20items%20complete.user.js
// @updateURL https://update.greasyfork.org/scripts/445709/https%3Adotnettutorialsnet%20-%20Marking%20items%20complete.meta.js
// ==/UserScript==
(() => {
    let completedItems = [];

    async function init() {
        completedItems = [...JSON.parse(await GM.getValue("completedItems", "[]"))];
        console.log('Starting setup...');

        setupStyle();

        let courseOutline = document.querySelector('.llms-course-outline');
        if (courseOutline) {
            console.log('Course outline found...');
            let lessons = Array.from(courseOutline.querySelectorAll('.llms-section .llms-lesson li'));

            if (lessons.length && completedItems.length) {
                console.log('Completed items found...');
                console.log('Checking completed items...');

                let completedLessons = lessons.filter(x => completedItems.includes(x.innerText.trim()));
                completedLessons.forEach(x => {
                    x.querySelector('.llms-lesson-complete').classList.add('checked');
                });
            }

            console.log('Setting up handler for functionality...');

            courseOutline.addEventListener('click', onClick);
        }
    }

    async function onClick(e) {
        let item;
        if (e.target.tagName.toUpperCase() == "I") {
            item = e.target.parentElement;
        } else if (e.target.tagName.toUpperCase() == "SPAN" && e.target.classList.contains("llms-lesson-complete")) {
            item = e.target;
        }

        if (item) {
            let lessonTitle = item.parentElement.querySelector('.lesson-title').innerText.trim();
            console.log('Clicked...', lessonTitle);
            if (item.classList.contains("checked")) {
                console.log('Uncompleting...');
                completedItems = completedItems.filter(x => x != lessonTitle);
            } else {
                console.log('Completing...')
                completedItems.push(lessonTitle);
            }
            completedItems = [...new Set(completedItems)];
            await GM.setValue("completedItems", JSON.stringify(completedItems));

            item.classList.toggle('checked');
        }
    }

    function setupStyle() {
        console.log('Setting up styles...');

        let styles = `.llms-lesson-complete { cursor: pointer; } .llms-lesson-complete.checked { color: green; }`;
        let $styles = document.createElement('style');
        $styles.innerText = styles;
        document.body.appendChild($styles);

        console.log('Completed setting up styles...');
    }

    init();
})();
