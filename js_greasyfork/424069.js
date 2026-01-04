// ==UserScript==
// @name            Highlight RMS supporters
// @description     Highlights those who have signed the RMS Support letter
// @include         https://github.com/*
// @author          stick
// @version         2
// @homepageURL     https://github.com/sticks-stuff/highlight-RMS-supporters
// @namespace       https://greasyfork.org/users/710818
// @grant           GM.xmlHttpRequest
// @connect         api.github.com
// @connect         codeload.github.com
// @require         https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.0.0/js-yaml.min.js
// @downloadURL https://update.greasyfork.org/scripts/424069/Highlight%20RMS%20supporters.user.js
// @updateURL https://update.greasyfork.org/scripts/424069/Highlight%20RMS%20supporters.meta.js
// ==/UserScript==
const RMS_LETTER_DOWNLOAD = "https://api.github.com/repos/rms-support-letter/rms-support-letter.github.io/zipball/";
const UPDATE_INTERVAL = 3600;

async function iterateDirectory(dir, cb) {
    let filename, relativePath, file;
    let promises = [];
    for (filename in dir.files) {
        if (!dir.files.hasOwnProperty(filename)) {
            continue;
        }

        file = dir.files[filename];
        relativePath = filename.slice(dir.root.length, filename.length);


        if (relativePath && filename.slice(0, dir.root.length) === dir.root) {
            promises.push(cb(file));
        }
    }
    await Promise.all(promises);
}

function linkToGithubUsername(rawLink) {
    // if the link is a link to a GitHub user, return the username in
    // URI-escaped form. otherwise, return `null`.
    if (!(typeof rawLink === 'string' || rawLink instanceof String)) {
        // the link is not a string
        return null;
    }

    // truncate to avoid maliciously excessively long URLs
    try {
        var link = new URL(rawLink.slice(0, 100));
    } catch (e) {
        return null;
    }

    if (!(link.protocol == 'http:' || link.protocol == 'https:')) {
        // link is not HTTP(S)
        return null;
    }
    if (!(link.host == 'github.com' || link.host == 'www.github.com')) {
        // link is not github.com
        return null;
    }

    // we `.slice(1)` to remove the leading backslash
    let pathParts = link.pathname.slice(1).split('/');
    if (pathParts.length != 1) {
        // link has the wrong number of path parts
        return null;
    }

    // url.parse automatically performs URI escaping
    return pathParts[0];
}

function getUpdates(db) {
    // We need to use GM_xmlhttpRequest here because our request is cross-origin.
    GM.xmlHttpRequest({
        url: RMS_LETTER_DOWNLOAD,
        method: "GET",
        nocache: true, // This request should never be cached
        responseType: "arraybuffer",
        onload: async (data) => {
            let zip = await JSZip.loadAsync(data.response);
            // The name of the directory that the signature folder is in will vary depending on the signature of the github repo (which changes every time it updates)
            // We can ensure we always get the right directory by using a regex.
            // This makes the assumption that the signatures are under _data/signed, so if they changed this location in the future, we will need to change it here too.
            let signature_folder = zip.folder(zip.folder(/^rms-support-letter.*_data\/signed\/$/g)[0].name);
            await iterateDirectory(signature_folder, async (file) => {
                let content = await file.async("string");
                let transaction = db.transaction(["signatures"], "readwrite");
                let signatures = transaction.objectStore("signatures");
                let username = linkToGithubUsername(jsyaml.load(content).link);
                if (username === null) return;
                signatures.put(0, username.toLowerCase());
            })
            window.localStorage.setItem("last_updated", new Date().getTime() / 1000);
            highlightNames(db);
        },
        onerror: (e) => {
            // TODO: We should notify the user of the error
            console.error(e);
        }
    });
}

function highlightNames(db) {
    let links = document.getElementsByTagName("a");
    for (const element of links) {
        let text = element.innerHTML.toLowerCase();
        let signatures = db.transaction(["signatures"], "readwrite").objectStore("signatures");
        // onsuccess will only fire when the key exists
        signatures.getKey(text).onsuccess = (event) => {
            if (event.target.result !== text) return;
            element.style.backgroundColor = "crimson";
        }
    };
}

var request = window.indexedDB.open("RMSSignatures", 3);
request.onerror = function(event) {
    console.error("Database error: " + event.target.errorCode);
};
request.onupgradeneeded = function(event) {
    let db = event.target.result;
    db.createObjectStore("signatures");
};
request.onsuccess = function(event) {
    let db = event.target.result;
    let transaction = db.transaction(["signatures"], "readwrite");
    let signatures = transaction.objectStore("signatures");

    if (window.localStorage.getItem("last_updated") === null) {
        window.localStorage.setItem("last_updated", 0);
    }
    if (new Date().getTime() / 1000 >= parseFloat(window.localStorage.getItem("last_updated")) + UPDATE_INTERVAL) {
        signatures.clear();
        try {
        	return getUpdates(db);
        }
        catch (e) {
           console.error(e);
        }
    }

    highlightNames(db);
    let observer = new MutationObserver(() => highlightNames(db));
    observer.observe(document.body, {
        childList: true
    });
}