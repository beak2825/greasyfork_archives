// ==UserScript==
// @name        Asurascans bookmark saver
// @namespace   TestScript
// @author      Sieyk
// @grant       none
// @license     MIT
// @match       https://www.asurascans.com/*
// @noframes
// @require     https://openuserjs.org/src/libs/ls18502857770.gmail.com/FileSaver.js
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @run-at      document-end
// @version     1.3.1
// @description  This script adds two buttons to the bookmarks page. One button will export the list of titles in your bookmarks, the other will import a list of titles and overwrite your bookmarks. Your last read chapter for bookmarks will also be tracked automatically and displayed on your bookmarks page.
// @downloadURL https://update.greasyfork.org/scripts/448190/Asurascans%20bookmark%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/448190/Asurascans%20bookmark%20saver.meta.js
// ==/UserScript==
(function () {
    "use strict";

    // Return if url is not bookmarks
    if (window.location.href != "https://www.asurascans.com/bookmarks/") {
        return;
    }

    window.addEventListener('load', () => {
        $("body").append ( `
        <input id="filePick" type="file" hidden=true>
        ` );

        // Get div element with class "releases"
        var div = document.getElementsByClassName("releases")[0];

        // Create a new div element
        var newDiv = document.createElement("div");
        newDiv.className = "button-container";

        // Append newDiv to div
        div.appendChild(newDiv);

        // Move delete button with id "hapus" into newDiv
        var deleteButton = document.getElementById("hapus");
        newDiv.appendChild(deleteButton);

        // Delete button

        addButton('Save Bookmarks', saveBookmarks)
        addButton('Import Bookmarks', importBookmarks)
    })

    // Add a button next to an existing button with id "hapus"
    function addButton(text, onclick) {
        var button = document.createElement('button');
        button.innerHTML = text;
        button.onclick = onclick;
        // Make the button float right
        button.style.cssFloat = 'right';

        // Find the button with id "hapus"
        var hapus = document.getElementById('hapus');

        // Use the style of the "hapus" button, but change the colour to #913fe2
        button.setAttribute('style', button.style.cssText + '; color: #ffffff; background-color: #913fe2;');

        // Remove the button border
        button.style.border = 'none';
        button.style.borderRadius = '0px';

        // Give the button rounded borders
        button.style.borderTopLeftRadius = '3px';
        button.style.borderTopRightRadius = '3px';
        button.style.borderBottomLeftRadius = '3px';
        button.style.borderBottomRightRadius = '3px';

        // Make the button taller
        button.style.height = '24px';

        // Add a margin beside the button
        button.style.marginLeft = '10px';

        // Pad the space beside the button text
        button.style.paddingLeft = '20px';
        button.style.paddingRight = '20px';

        document.getElementById('hapus').parentNode.insertBefore(button, document.getElementById('hapus'));
    }

    function saveBookmarks() {
        // var bkm_recent = {};
        var bookmarks = localStorage.getItem("bookmark");
        var recent = localStorage.getItem("last-chapter");
        if (recent != null) {
            var bkm_recent = new Blob([JSON.stringify({'bookmarks': bookmarks,
            'recent': JSON.parse(recent)})], { type: "text/plain;charset=utf-8" });
        } else {
            var bkm_recent = new Blob([JSON.stringify({'bookmarks': bookmarks, 'recent': {}})], { type: "text/plain;charset=utf-8" });
        }
        saveAs(bkm_recent, "bookmarks.txt")
    }

    async function importBookmarks() {
        // open file picker
        const input = document.getElementById('filePick');
        try {
            input.value = "";
            input.showPicker();
            console.debug(input.value);
            while (input.value == "") {
                await new Promise(r => setTimeout(r, 100));
            };
        } catch(error) {
            window.alert(input);
            return
        }
        console.debug(input.files);
        var reader = new FileReader();
        reader.readAsText(input.files[0]);
        while (reader.readyState != 2) {
            await new Promise(r => setTimeout(r, 100));
        }
        try {
            var ret_dict = JSON.parse(reader.result);
        } catch(error) {
            window.alert("Invalid data type for bookmarks! Must be an Array.");
            return
        }
        var test = JSON.stringify(JSON.parse(ret_dict.bookmarks))
        var test2 = ret_dict.recent
        if (ret_dict.bookmarks && ret_dict.recent) {
            localStorage.setItem("bookmark", JSON.stringify(JSON.parse(ret_dict.bookmarks)));
            localStorage.setItem("last-chapter", JSON.stringify(ret_dict.recent));
            window.location.reload();
        }
        else {
            window.alert("Invalid data type for bookmarks! Must be an Array.");
            return
        }
    }
}());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// top level await function

(async () => {
    try {
        'use strict';

    // Return if url is not bookmarks
    if (window.location.href != "https://www.asurascans.com/bookmarks/") {
        return;
    }

    var divs = [];

    while (divs.length == 0) {
        await sleep(100)
        divs = document.getElementsByClassName("bsx");
    }

    // For each div element with class "bs", add a link to the bottom of the div that points to the last-chapter dict stored in local storage
    var lastChapterDict = localStorage.getItem("last-chapter");

    if (lastChapterDict == null) {
        return;
    }
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];

        var newDiv = document.createElement("div");

        // link.href = localStorage.getItem("last-chapter")[div.id];
        if (lastChapterDict.includes(div.dataset.id)) {
            var link = document.createElement("a");

            // get the "data-id" html attribute of the div
            link.href = JSON.parse(lastChapterDict)[div.dataset.id];
            link.innerHTML = "Last Read";
            link.style.float = "right";
            link.style.marginRight = "10px";
            link.style.marginTop = "10px";
            link.style.marginBottom = "10px";
            link.style.color = "#913fe2";
            link.style.fontWeight = "bold";
            link.style.fontSize = "14px";
            link.style.textDecoration = "none";
            link.style.fontFamily = "Roboto, sans-serif";
            link.style.fontStyle = "normal";
            link.style.fontVariant = "normal";
            link.style.fontWeight = "500";
            link.style.textTransform = "none";
            newDiv.append(link);
            div.parentNode.append(newDiv);
        } else {
            // append unread text
            var unread = document.createElement("p");
            unread.innerHTML = "Unread";
            unread.style.float = "right";
            unread.style.marginRight = "10px";
            unread.style.marginTop = "10px";
            unread.style.marginBottom = "10px";
            newDiv.append(unread);
            div.parentNode.append(newDiv);
        }
    }
    } catch (e) {
        // Deal with the fact the chain failed
    }
    // `text` is not available here
})();

(function () {
    'use strict';

    // Return if url is not a chapter
    if (window.location.href == "https://www.asurascans.com/bookmarks/" ||
        window.location.href.startsWith("https://www.asurascans.com/manga/")) {
        return;
    }

    // Wait for all elements to load
    window.addEventListener('load', () => {
        // get the chapter number; it is the last element of the url, separated by "-" and trailed by "/"
        var chapter = window.location.href.split("/").pop().split("-").pop();

        // get chapter id; it is in a link with rel="shortlink"
        var chapter_id = document.querySelector('link[rel="shortlink"]').href.split("=").pop();

        // get manga id; it is in the bm_history dict stored in local storage
        var manga_id = JSON.parse(localStorage.getItem("bm_history"))[chapter_id].manga_ID;

        // create a new dict with the manga id and the chapter url in local storage if it doesn't exist, append otherwise
        var last_chapter = JSON.parse(localStorage.getItem("last-chapter"));
        if (last_chapter == null) {
            last_chapter = {};
        }
        last_chapter[manga_id] = window.location.href;
        localStorage.setItem("last-chapter", JSON.stringify(last_chapter));
    });

})();