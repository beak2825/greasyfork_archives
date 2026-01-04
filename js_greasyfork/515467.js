// ==UserScript==
// @name         Disney+ Mark Watched
// @namespace    watched_disneyplus
// @version      1.5
// @description  Mark Disney+ shows as watched.
// @include      https://www.disneyplus.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515467/Disney%2B%20Mark%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/515467/Disney%2B%20Mark%20Watched.meta.js
// ==/UserScript==

(function() {
    // Migrate data from localStorage to GM storage
    function migrateWatchedData() {
        let migrated = false;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("watched_")) {
                GM_setValue(key, localStorage.getItem(key));
                console.log("Migrated:", key);
                localStorage.removeItem(key);
                migrated = true;
            }
        }

        if (migrated) {
            alert("Migration of watched data to new GM storage completed.");
        } else {
            console.log("No watched shows data found in localStorage to migrate.");
        }
    }

    // Add the watched button to an element
    function addWatchedButton(element) {
        const videoId = element.attr('data-item-id');
        if (!videoId) {
            console.log("Video ID not found for element", element);
            return;
        }

        const watched = GM_getValue("watched_" + videoId, 'false');
        const thumbnailWrapper = $('<div class="thumbnail-wrapper"></div>').append(element.children().first());
        element.append(thumbnailWrapper);

        if (watched === 'true') thumbnailWrapper.addClass('g_watched');

        const watchedEye = $('<div class="watched_eye">👁</div>').click(function (event) {
            event.preventDefault();
            event.stopPropagation();

            const isWatched = thumbnailWrapper.toggleClass('g_watched').hasClass('g_watched');
            isWatched ? markAsWatched(videoId) : markAsUnwatched(videoId);
            console.log(`Marked as ${isWatched ? 'watched' : 'unwatched'}:`, videoId);
        });

        element.append(watchedEye);
    }

    function markAsWatched(videoId) {
        GM_setValue("watched_" + videoId, "true");
    }

    function markAsUnwatched(videoId) {
        GM_setValue("watched_" + videoId, "false");
    }

    function backupWatchedShows() {
        const watchedData = {};
        GM_listValues().forEach(key => {
            if (key.startsWith("watched_")) watchedData[key] = GM_getValue(key);
        });

        const blob = new Blob([JSON.stringify(watchedData)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "watchedShowsBackup.json";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function restoreWatchedShows() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";

        input.click();
        input.addEventListener("change", function () {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function () {
                try {
                    const data = JSON.parse(reader.result);
                    const existingKeys = GM_listValues().filter(key => key.startsWith("watched_"));

                    const action = prompt("Choose an action: 'overwrite' or 'merge'.", "overwrite");
                    if (action === "overwrite") {
                        for (const key in data) GM_setValue(key, data[key]);
                        alert("Watched data has been overwritten successfully.");
                    } else if (action === "merge") {
                        for (const key in data) {
                            if (!existingKeys.includes(key)) GM_setValue(key, data[key]);
                        }
                        alert("Watched data has been merged successfully.");
                    } else {
                        alert("Invalid action specified. No changes were made.");
                    }
                } catch (e) {
                    alert("Error restoring data: " + e);
                }
            };
            reader.readAsText(file);
        });
    }

    $(document).ready(function () {
        migrateWatchedData();
        $('[data-item-id]').each(function () {
            addWatchedButton($(this));
        });

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(mutation => {
                $(mutation.addedNodes).find('[data-item-id]').each(function () {
                    addWatchedButton($(this));
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
        GM_registerMenuCommand("Backup Watched", backupWatchedShows);
        GM_registerMenuCommand("Restore Watched", restoreWatchedShows);

        $('head').append(`
            <style>
                .thumbnail-wrapper { position: relative; }
                .g_watched { filter: blur(5px); transition: filter 0.3s ease; }
                .watched_eye {
                    position: absolute; top: 10px; right: 10px; z-index: 10;
                    font-size: 24px; padding: 5px; background: gray; border-radius: 6px;
                    height: 40px; width: 60px; line-height: 30px; display: flex;
                    justify-content: center; align-items: center; cursor: pointer;
                }
                .watched_eye:hover { opacity: 0.7; }
            </style>
        `);
    });
})();