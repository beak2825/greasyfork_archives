// ==UserScript==
// @name Netflix Mark Watched
// @namespace watched_netflix
// @version 2.1
// @description Mark Netflix shows as watched.
// @include https://www.netflix.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant GM_registerMenuCommand
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @grant GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477428/Netflix%20Mark%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/477428/Netflix%20Mark%20Watched.meta.js
// ==/UserScript==

// Function to migrate data from localStorage (old) to GM storage (new)
function migrateWatchedData() {
    var migrated = false;
    // Iterate through all localStorage keys
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith("watched_")) {
            var value = localStorage.getItem(key);
            // Store the value using GM_setValue
            GM_setValue(key, value);
            console.log("Migrated:", key, value);
            migrated = true;
        }
    }

    if (migrated) {
        // Delete migrated entries from localStorage
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key.startsWith("watched_")) {
                localStorage.removeItem(key);
                console.log("Deleted from localStorage:", key);
            }
        }
        alert("Migration of watched data to new GM storage completed.");
    } else {
        console.log("No watched shows data found in localStorage to migrate.");
    }
}

// Function to add the watched button
function addWatchedButton(element) {
    var id = JSON.parse(decodeURI(element.data('ui-tracking-context'))).video_id;
    var watched = GM_getValue("watched_" + id, 'false');

    if (watched === 'true') {
        element.closest('.title-card-container').addClass('g_watched');
    }

    var watchedEye = $('<div class="watched_eye">&#128065;</div>');

    watchedEye.click(function () {
        var cardContainer = $(this).closest('.title-card-container');
        var isWatched = cardContainer.hasClass('g_watched');

        if (isWatched) {
            cardContainer.removeClass('g_watched');
            markAsUnwatched(id);
        } else {
            cardContainer.addClass('g_watched');
            markAsWatched(id);
        }
    });

    element.closest('.title-card-container').append(watchedEye);
}

// Function to mark a show as watched
function markAsWatched(videoId) {
    GM_setValue("watched_" + videoId, "true");
}

// Function to mark a show as unwatched
function markAsUnwatched(videoId) {
    GM_setValue("watched_" + videoId, "false");
}

// Backup data related to watched shows to a JSON file
function backupWatchedShows() {
    var watchedData = {};
    GM_listValues().forEach(function (key) {
        if (key.startsWith("watched_")) {
            watchedData[key] = GM_getValue(key);
        }
    });

    var data = JSON.stringify(watchedData);
    var blob = new Blob([data], { type: "application/json" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = "watchedShowsBackup.json";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Restore data related to watched shows from a JSON file
function restoreWatchedShows() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.click();

    input.addEventListener("change", function () {
        var file = input.files[0];
        var reader = new FileReader();

        reader.onload = function () {
            try {
                var data = JSON.parse(reader.result);
                var existingKeys = GM_listValues().filter(key => key.startsWith("watched_"));

                var action = prompt("Choose an action: 'overwrite' or 'merge'. Type 'overwrite' to replace existing data or 'merge' to combine with existing data.", "overwrite");
                if (action === "overwrite") {
                    for (var key in data) {
                        GM_setValue(key, data[key]);
                    }
                    alert("Watched data has been overwritten successfully.");
                } else if (action === "merge") {
                    for (var key in data) {
                        if (!existingKeys.includes(key)) {
                            GM_setValue(key, data[key]);
                        }
                    }
                    alert("Watched data has been merged successfully.");
                } else {
                    alert("Invalid action specified. No changes were made.");
                }
            } catch (e) {
                alert("Error restoring data: " + e);
            }
        };

        if (file) {
            reader.readAsText(file);
        }
    });
}

$(document).ready(function () {
    // Run migration on script start
    migrateWatchedData();

    // Initial execution for the elements present on the page load
    $('[data-ui-tracking-context]').each(function () {
        addWatchedButton($(this));
    });

    // Add a MutationObserver to detect when new elements are added
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes) {
                $(mutation.addedNodes).find('[data-ui-tracking-context]').each(function () {
                    addWatchedButton($(this));
                });
            }
        });
    });

    // Observe changes in the DOM, including dynamically loaded content
    observer.observe(document.body, { childList: true, subtree: true });

    GM_registerMenuCommand("Backup Watched", backupWatchedShows);
    GM_registerMenuCommand("Restore Watched", restoreWatchedShows);

    $('head').append(`
    <style>
    .watched_eye {
      font-size: 57px;
      padding: 10px;
      position: absolute;
      bottom: -40px;
      left: 0;
      background: gray;
      border-radius: 6px;
      height: 30px;
      line-height: 30px;
    }
    .watched_eye:hover {
      opacity: 0.3;
      cursor: pointer;
    }
    .title-card-container.g_watched {
      opacity: 0.3;
    }
    </style>
  `);
});