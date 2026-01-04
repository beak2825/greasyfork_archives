// ==UserScript==
// @name         Japanese Reading Tracker
// @description  Keeps track of characters read in popular japanese websites like syosetu.com, etc.
// @version      1.3.1
// @author       nenlitiochristian
// @match        https://syosetu.org/*
// @match        https://kakuyomu.jp/*
// @match        https://ncode.syosetu.com/*
// @license      MIT
// @namespace    JP_reading_tracker_nc
// @downloadURL https://update.greasyfork.org/scripts/512137/Japanese%20Reading%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/512137/Japanese%20Reading%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // credit to cademcniven for this
    function countJapaneseCharacters(japaneseText) {
        const regex = /[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤ヶ]+/g
        return [...japaneseText.matchAll(regex)].join('').length
    }

    /**
     * @typedef {Object} Chapter
     * @property {string} title - The title of the chapter.
     * @property {number} characters - The number of characters read in the chapter.
     */

    /**
     * @typedef {Object} Novel
     * @property {Object.<string, Chapter>} readChapters - A map where the key is the chapter ID and the value is a `Chapter` object.
     */

    /**
     * Makes a new empty novel
     * @returns {Novel} 
     */
    function newNovel() {
        return {
            readChapters: {},
        }
    }

    /**
     * @param {string} id - The unique identifier for the novel.
     */
    function initializeStorage(id) {
        localStorage.setItem(id, JSON.stringify(newNovel()));
    }

    /**
     * @param {Novel} novel
     * @returns {number}
     */
    function countTotalCharacters(novel) {
        let counter = 0;
        // Sum up the character count from all chapters
        Object.entries(novel.readChapters).forEach(([_, value]) => {
            counter += value.characters;
        });
        return counter;
    }

    /**
     * @param {Novel} novel
     * @returns {string}
     */
    function exportCSV(novel) {
        let string = "";
        Object.entries(novel.readChapters).forEach(([key, value]) => {
            string += `${key},${value.title},${value.characters}\n`
        });
    }

    /**
     * @returns {string}
     */
    function getHostname() {
        return window.location.hostname;
    }

    class SiteStrategy {
        isInNovelPage() {
            throw new Error("Method not implemented.");
        }
        getNovelId() {
            throw new Error("Method not implemented.");
        }
        handleOldNovel(id) {
            throw new Error("Method not implemented.");
        }

        /**
         * @param {string} id
         * @param {Novel} novelData 
         */
        renderCounter(id, novelData) {
            // inject styles 
            const styles = `#tracker-button { position: fixed; bottom: 20px; right: 20px; background-color: #333; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; z-index: 1000; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5); user-select: none; } 
            .overlay-container { position: fixed; left: 0; top: 0; width: 100%; height: 100%; justify-content: center; align-items: center; display: none; z-index: 1001; font-size: 16px; background: rgba(0, 0, 0, 0.5); }
            #tracker-popup { height: 90%; width: calc(200px + 40%); background-color: #222; color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0,0,0,0.5); display: flex; flex-direction: column; }
            #tracker-popup h2 { border-bottom: 1px solid #444; padding-bottom: 10px; } 
            .table-list { padding-top: 4px; margin-bottom: auto; width: 100%; display: block; overflow-y: auto; } 
            .table-list th, .table-list td { padding: 5px; } 
            .delete-button { background-color: #ff6347; color: #fff; border: none; padding: 5px; cursor: pointer; border-radius: 3px; } 
            .close-button { background-color: #444; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px; width: fit-content; } `;

            const styleSheet = document.createElement("style");
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);

            // add button to display the popup
            const button = document.createElement('button');
            button.id = 'tracker-button';
            button.textContent = `🍞`;

            document.body.appendChild(button);

            const overlayContainer = document.createElement('div');
            overlayContainer.classList.add('overlay-container');

            const popup = document.createElement('div');
            popup.id = 'tracker-popup';

            // Add content to the popup
            const title = document.createElement('h2');
            title.textContent = `合計文字数：${countTotalCharacters(novelData)}`;
            popup.appendChild(title);

            // List of tracked chapters
            const chapterList = document.createElement('table');
            chapterList.classList.add('table-list');



            const listHeader = document.createElement('thead');
            listHeader.innerHTML = `<tr>
                <th style="width:32px;">#</th> <th style="width:75%;">タイトル</th> <th>文字数</th> <th style="width:64px;"></th>
            </tr>`;

            chapterList.append(listHeader);

            const listBody = document.createElement('tbody');
            chapterList.append(listBody);

            let index = 1;
            Object.entries(novelData.readChapters).sort((a, b) => parseInt(a) - parseInt(b)).forEach(([key, chapter]) => {
                const listItem = document.createElement('tr');
                listItem.innerHTML = `
                <td>${index}</td> <td style="width:auto;">${chapter.title}</td> <td>${chapter.characters}</td>
                <td>
                    <button data-chapter="${key}" class="delete-button">削除</button>
                </td>`;

                listItem.querySelector('button').addEventListener('click', () => {
                    const { [key]: _, ...updatedChapters } = novelData.readChapters;
                    novelData.readChapters = updatedChapters;
                    localStorage.setItem(id, JSON.stringify(novelData)); // Update the novel data in localStorage
                    window.location.reload(); // Reload to update UI
                });

                listBody.appendChild(listItem);
                index++;
            });

            popup.appendChild(chapterList);

            // Add close button
            const closeButton = document.createElement('button');
            closeButton.textContent = '閉じる';
            closeButton.classList.add('close-button');

            closeButton.addEventListener('click', () => {
                overlayContainer.style.display = 'none';
            });

            popup.appendChild(closeButton);

            overlayContainer.appendChild(popup);
            document.body.appendChild(overlayContainer);

            button.addEventListener('click', () => {
                overlayContainer.style.display = overlayContainer.style.display === 'none' ? 'flex' : 'none';
            });
        }

    }

    class SyosetuOrg extends SiteStrategy {
        // https://syosetu.org/novel/{id}/{chapter}.html
        // split by "/"
        // 1 -> gets "novel"
        // 2 -> gets {id}
        // 3 -> gets {chapter}
        isInNovelPage() {
            return window.location.pathname.split("/")[1] === "novel";
        }

        getNovelId() {
            return window.location.pathname.split("/")[2];
        }

        handleOldNovel(id) {
            // get the current chapter from the URL (if any)
            let chapterId = window.location.pathname.split("/")[3];
            const currentNovelData = JSON.parse(localStorage.getItem(id));

            // if we are not in a chapter page, just return the existing novel data
            if (!chapterId) {
                return currentNovelData;
            }

            // syosetu.org has .html attached to the number, we remove it
            chapterId = chapterId.split(".")[0];

            // Get the chapter content and calculate the character count
            const chapterContent = document.querySelector("#honbun");
            const chapterText = [...chapterContent.childNodes].map((node) => node.textContent).join("");

            // Create a new chapter entry
            // syosetu.org has 2 utterly different html pages for desktop and mobile
            const titles = document.querySelectorAll('span[style="font-size:120%"]')
            let newChapter = {};

            // if desktop
            if (titles.length === 2) {
                newChapter.title = titles[1].textContent ?? "Unknown"
                newChapter.characters = countJapaneseCharacters(chapterText)
            }
            // if mobile
            else {
                newChapter.title = document.querySelector("h2").textContent ?? "Unknown"
                newChapter.characters = countJapaneseCharacters(chapterText)
            }

            // Update the novel data with the new chapter and store it in localStorage
            currentNovelData.readChapters = { ...currentNovelData.readChapters, [chapterId]: newChapter };
            localStorage.setItem(id, JSON.stringify(currentNovelData));

            return currentNovelData;
        }
    }


    class KakuyomuJp extends SiteStrategy {
        // https://kakuyomu.jp/works/{novel}/episodes/{chapter}
        // split by /
        // 1 -> works
        // 2 -> {novel}
        // 4 -> {chapter}
        isInNovelPage() {
            return window.location.pathname.split("/")[1] === "works";
        }

        getNovelId() {
            return window.location.pathname.split("/")[2];
        }

        handleOldNovel(id) {
            // get the current chapter from the URL (if any)
            let chapterId = window.location.pathname.split("/")[4];
            const currentNovelData = JSON.parse(localStorage.getItem(id));

            // if we are not in a chapter page, just return the existing novel data
            if (!chapterId) {
                return currentNovelData;
            }

            // Get the chapter content and calculate the character count
            const chapterContent = document.querySelector(".widget-episodeBody");
            const chapterText = [...chapterContent.childNodes].map((node) => node.textContent).join("");

            const newChapter = {
                title: document.querySelector(".widget-episodeTitle").textContent,
                characters: countJapaneseCharacters(chapterText),
            }

            // Update the novel data with the new chapter and store it in localStorage
            currentNovelData.readChapters = { ...currentNovelData.readChapters, [chapterId]: newChapter };
            localStorage.setItem(id, JSON.stringify(currentNovelData));

            return currentNovelData;
        }
    }

    class SyosetuCom extends SiteStrategy {
        // https://ncode.syosetu.com/{novel}/{chapter}/
        // split by /
        // 1 -> {novel}
        // 2 -> {chapter}
        isInNovelPage() {
            return window.location.hostname === "ncode.syosetu.com";
        }

        getNovelId() {
            return window.location.pathname.split("/")[1];
        }

        handleOldNovel(id) {
            // get the current chapter from the URL (if any)
            let chapterId = window.location.pathname.split("/")[2];
            const currentNovelData = JSON.parse(localStorage.getItem(id));

            // if we are not in a chapter page, just return the existing novel data
            if (!chapterId) {
                return currentNovelData;
            }

            // Get the chapter content and calculate the character count
            const chapterContent = document.querySelector(".p-novel__text");
            const chapterText = [...chapterContent.childNodes].map((node) => node.textContent).join("");

            // in mobile mode, the title uses the class p-novel__subtitle-episode instead
            let title = document.querySelector(".p-novel__title")?.textContent ?? null
            if (!title) {
                title = document.querySelector(".p-novel__subtitle-episode").textContent
            }
            const newChapter = {
                title,
                characters: countJapaneseCharacters(chapterText),
            }

            // Update the novel data with the new chapter and store it in localStorage
            currentNovelData.readChapters = { ...currentNovelData.readChapters, [chapterId]: newChapter };
            localStorage.setItem(id, JSON.stringify(currentNovelData));

            return currentNovelData;
        }
    }

    /**
     * @param {string} hostname 
     * @returns {SiteStrategy}
     */
    function getHandlerByHost(hostname) {
        if (hostname.endsWith("syosetu.org")) {
            return new SyosetuOrg();
        }
        else if (hostname.endsWith("syosetu.com")) {
            return new SyosetuCom();
        }
        else if (hostname.endsWith("kakuyomu.jp")) {
            return new KakuyomuJp();
        }
        throw new Error("Site not supported!");
    }

    function main() {
        const hostname = getHostname();
        const handler = getHandlerByHost(hostname);

        // if we're not currently in a novel-related page where we can get the id, we do nothing
        // i.e in home page or settings, etc
        if (!handler.isInNovelPage()) {
            return;
        }

        const novelId = handler.getNovelId();
        if (localStorage.getItem(novelId) === null) {
            initializeStorage(novelId);
        }

        const currentNovel = handler.handleOldNovel(novelId);
        handler.renderCounter(novelId, currentNovel);
    }

    main();
})();