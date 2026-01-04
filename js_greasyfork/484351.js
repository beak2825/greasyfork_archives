// ==UserScript==
// @name         WaniMaru fix
// @namespace    http://tampermonkey.net/
// @version      2024-01-09.1
// @description  Temporary hotfix for WaniMaru by spynder. Replaces event.path with event.composedPath().
// @author       EinarW
// @match        https://spynder.github.io/WaniMaru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/484351/WaniMaru%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/484351/WaniMaru%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    async function checkItemClicks2(event) {
        if(event.composedPath().findIndex(el => el.id == "info" || el.id == "apiModal") !== -1) return; // If clicked on info or modal is on don't propagate
        let pos = getMousePos(event);
        let clickedItem;
        for (let i in drawnItems) {
            let item = drawnItems[i];
            let radius = i==0 ? CIRCLE_CENTER_SIZE : (ITEM_WIDTH+STACK_POWER)/1.5
            if(isInside(pos, item, radius)) {
                clickedItem = item;
                break;
            }
        }
        if(clickedItem) {
            boundTo = clickedItem;
            function generateInfoHeader(boundTo) {
                let hours_until = Math.ceil(boundTo.seconds_until/3600);
                let srsString = ["Lesson", "Apprentice 1", "Apprentice 2", "Apprentice 3", "Apprentice 4", "Guru 1", "Guru 2", "Master", "Enlightened", "Burned"][boundTo.srs];
                let timeString = hours_until < 24 ? `${hours_until} hours` : `${Math.ceil(hours_until/24)} days`;
                let timer = `Incoming in <span class="highlight">${timeString}</span>`;
                if(!hours_until) timer = `<span class="highlight">Already waiting for you!</span>`;
                if(boundTo.srs==9) {
                    timer = `Burned ${Math.floor(boundTo.seconds_until)} days ago`;
                }

                return $(`
                <div class="header">
                    <p class="srs">SRS stage: ${srsString}</p>
                    <p class="timer">${timer}</p>
                </div>
            `);
            }

            function generateInfoItem(subject) {
                let text = subject.data.characters;
                if(!text) text = `<img src="${subject.data.character_images.find(img => img.metadata.dimensions == "64x64").url}">`;
                return $(`<a class="item ${subject.object}" href="${subject.data.document_url}">${text}</a>`);
            }

            infoBlock.empty().removeClass().addClass(boundTo.color).append(generateInfoHeader(boundTo)).show();
            moveInfo();

            let subjects = await fetchData("https://api.wanikani.com/v2/subjects?ids=" + boundTo.ids.join(), "subjects");
            subjects.data.sort(function(a,b) {
                let typeA = a.object;
                let typeB = b.object;
                const order = {radical: 0, kanji: 1, vocabulary: 2};
                return order[typeA] - order[typeB];
            });
            subjects.data.forEach(function(subject) {
                infoBlock.append(generateInfoItem(subject));
            });
            moveInfo();
        } else {
            infoBlock.hide();
            boundTo = undefined;
        }
    }

    function getMousePos(event) {
        let rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left),
            y: (event.clientY - rect.top)
        };
    }

    function isInside(pos, obj, radius) {
        return Math.sqrt((pos.x-obj.x)**2 + (pos.y-obj.y)**2) < radius;
    }

    let infoBlock = $("#info");
    infoBlock.css({"max-height": INFO_MAXHEIGHT});

    let canvas = document.getElementById("can");

    document.addEventListener("click", checkItemClicks2, false);


})();