/*globals imgur, Imgur, album*/
// ==UserScript==
// @name         Imgur Album Ops
// @namespace    nImgur
// @version      1.4.1
// @description  Adds a few questionably useful management functions to imgur albums.
// @author       noccu
// @match        *://imgur.com/a/*
// @match        *://*.imgur.com
// @run-at       document-idle
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415755/Imgur%20Album%20Ops.user.js
// @updateURL https://update.greasyfork.org/scripts/415755/Imgur%20Album%20Ops.meta.js
// ==/UserScript==

var ALBUMS,
    ALBUM_LAST_UPDATE = 0;
var OBSERVER;
var SELECTED = [], //Array of selected image IDs
    CURRENT_ALBUM,
    TARGET_ALBUM,
    COUNTER;
var DEBUG = true;

function load() {
    return new Promise((r, x) => {
        if (ALBUMS) { //Already loaded, early term.
            r();
            return;
        }

        ALBUMS = JSON.parse(localStorage.getItem("albums"));
        ALBUM_LAST_UPDATE = localStorage.getItem("lastUpdate") || 0;
        if (!ALBUMS || Date.now() - ALBUM_LAST_UPDATE > 604800000) { //7 days
            console.log("Updating albums.");
            updateAlbums().then(r, x);
        }
        else {
            r();
        }
    });
}

function save() {
    localStorage.setItem("albums", JSON.stringify(ALBUMS));
    localStorage.setItem("lastUpdate", ALBUM_LAST_UPDATE);
}

function createXhr(method, url, load, error) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.withCredentials = true;

    xhr.addEventListener("load", load, {once:true, passive:true});
    xhr.addEventListener("error", e => error(e), {once:true, passive:true});
    xhr.open(method, url);
    xhr.setRequestHeader("Authorization", "Client-ID "+imgur._.apiClientId);
    return xhr;
}

function updateAlbums() {
    function req (r, x) {
        function complete(e) {
            if (e.target.response.success) {
                debugLog(e);
                parse(e.target.response);
                r();
            }
            else {
                console.error(e.target.response);
                x(e.target.response.status);
            }
        }
        function parse(resp) {
            ALBUMS = resp.data.reduce((a, v) => {a.push({name: v.title || "Untitled",
                                                         id: v.id,
                                                         count: v.images_count,
                                                         views: v.views,
                                                         order: v.order});
                                                 return a;},
                                      []);
            ALBUMS.sort((a, b) => a.order - b.order);
            ALBUM_LAST_UPDATE = Date.now();
            save();
        }
        let xhr = createXhr("GET",
                            "https://api.imgur.com/3/account/me/albums?perPage=100",
                            complete,
                            x);
        xhr.send();
    }

    return new Promise(req);
}

function findAlbum(id) {
    return ALBUMS.find(x => x.id == id);
}

function addToAlbum() {
    function req(r, x) {
        function complete(e) {
            if (e.target.response.success) {
                let ta = findAlbum(TARGET_ALBUM),
                    dropdown = document.querySelector(`#albOpsAlbumSel option[value='${TARGET_ALBUM}']`);
                ta.count += SELECTED.length;
                dropdown.textContent = `${ta.name} (${ta.count} images)`;
//                populateAlbumList(); //update counts
                save();

                r();
            }
            else {
                console.error(e.target.response);
                x(e.target.response.status);
            }
        }

        let xhr = createXhr("POST",
                            `https://api.imgur.com/3/album/${TARGET_ALBUM}/add`,
                            complete,
                            x);

        var form = new FormData();
        for (let id of SELECTED) {
            form.append("ids[]", id);
        }
        xhr.send(form);
    }

    return new Promise(req);
}

function moveToAlbum() {
    return addToAlbum()
           .then(removeFromAlbum, function() {console.error("Error adding to album.");
                                              return;});
}

function removeFromAlbum () {
    function req (r, x) {
        function complete(e) {
            if (e.target.response.success) {
                let ca = findAlbum(CURRENT_ALBUM),
                    dropdown = document.querySelector(`#albOpsAlbumSel option[value='${CURRENT_ALBUM}']`);
                ca.count -= SELECTED.length;
                dropdown.textContent = `${ca.name} (${ca.count} images)`;
                
                save();
                r();
            }
            else {
                console.error(e.target.response);
                x(e.target.response.status);
            }
        }

        let xhr = createXhr("DELETE",
                            `https://api.imgur.com/3/album/${CURRENT_ALBUM}/remove_images?ids=${SELECTED.join()}`,
                            complete,
                            x);

        xhr.send();
    }
    function removeFromView() {
        //Also update Imgur's JS data, we use it sometimes and yknow, it's just polite.
        let imgs = Imgur.Environment.image.album_images.images;

        function findIdx (id) {
            return imgs.findIndex(x => x.hash == id);
        }

        for (let id of SELECTED) {
            let img = document.getElementById(id),
                next = img.nextElementSibling;
            img.remove();
            if (next.nodeName == "LABEL") {
                next.remove();
            }

            let idx = findIdx(id);
            if (idx != -1) {
                imgs.splice(idx, 1);
            }
        }
    }

    let upd = new Promise(req);
    return upd.then(removeFromView);
}

function clearAlbum() {
    SELECTED = Imgur.Environment.image.album_images.images.reduce((acc, cur) => {
        acc.push(cur.hash);
        return acc;
    }, []);
    removeFromAlbum()
    .then( function(){
        document.querySelectorAll(".post-images  label[for='add-between']")
        .forEach(el => el.remove());
        SELECTED = [];
        findAlbum(CURRENT_ALBUM).count = 0;
        save();
    } );
}

function injectCSS() {
    if (document.getElementById("albOps-style")) {
        return;
    }
    var css = document.createElement("style");
    css.id = "albOps-style";
    css.innerHTML =
        `.post-image-container {
            position: relative;
          }
         input.albOpsMark {
            position: absolute;
            top: 0;
            left: 0;
          }
        .albOpsUI {
            margin-top: 1em;
        }
        .albOpsUI ul {
            padding: 0;
        }
        .albOpsHeader {
            background-color: #1bb76e;
            padding: 0.3em;
            text-align: center;
        }
        .danger {
            color: rgb(208, 2, 98);
        }
        #albOpsAlbumSel {
            width: 100%
        }
        .albOps-newViews {
            color: #1bb76e;
        }

        /* Maximizing re-order dialogue space */
        /* TODO: Fix dragging
        span .post-grid-image {
            display: inline-block;
            transform: unset !important;
            margin: 3px;
        }
        .upload-global-post {
            width: 100%;
        }
        .upload-global-post #right-content {
            display: inline-block;
            max-width: 15%;
            min-width: 75px;
        }
        .upload-global-post .post-pad {
            display: inline-block;
            max-width: 85%;
            min-width: 50%;
        }*/`;
    document.head.append(css);
}

function createCheckbox (id) {
    var el = document.createElement("input");
    el.type = "checkbox";
    el.className = "albOpsMark";
    el.value = id;
    return el;
}

function addSelectors () {
    var images = document.querySelectorAll("div.post-image-container");
    for (let img of images) {
        addSelector(img);
    }
}

function addSelector(el) {
    let checkbox = createCheckbox(el.id);
    el.appendChild(checkbox);
    return checkbox;
}

function handleChange(mList) { //Deals with the UI adding and removing images from the DOM upon scrolling, keeps our selection checkboxes intact.
    function isIdInAlbum(id) {
        return Boolean(Imgur.Environment.image.album_images.images.find(x => x.hash == id));
    }
    function process(node) {
        if (node.className == "post-image-container") {
            if (!node.id) {
                console.warn("No ID on", node);
                return;
            }
            if (node.getElementsByClassName("albOpsMark").length > 0) {
                debugInfo("Already processed", node);
                return;
            }

            let box = addSelector(node);
            if (SELECTED.includes(node.id)) {
                box.checked = true;
            }
            debugInfo(`Added selector for img ${node.id}`);

            if (!isIdInAlbum(node.id)) { //Dealing with NEW images added through the site interface.
                //Update Imgur JS (an attempt was made) cause it doesn't seem to update on its own(TODO: check) and I sometimes use it.
                Imgur.Environment.image.album_images.images.push({hash: node.id});
                CURRENT_ALBUM.count++;
                save();
            }
        }
    }
    
    for (let m of mList) {
        if (m.type == "childList" && m.addedNodes.length > 0) {
            for (let node of m.addedNodes) {
                process(node);
            }
        }
        else if (m.type == "attributes" && m.attributeName == "id") {
            process(m.target);
        }
    }
}

function clearSelected() {
    SELECTED = [];
    let marks = document.body.getElementsByClassName("albOpsMark");
    for (let el of marks) {
        el.checked = false;
    }
    COUNTER.textContent = "0";
}

function handleAction (e) {
    if (e.target.classList.contains("extra-option")) {
        switch(e.target.dataset.action) {
            case "move":
                moveToAlbum()
                .then(clearSelected);
                break;
            case "copy":
                addToAlbum()
                .then(clearSelected);
                break;
            case "upd":
                updateAlbums()
                .then(populateAlbumList);
                console.log("Manual album update triggered.");
                break;
            case "clear":
                clearAlbum();
        }
    }
}

function injectUI() {
    injectCSS();
    addSelectors();

    let sidebar = document.querySelector("#post-options > div:first-child");
    sidebar.insertAdjacentHTML("beforeend",
       `<div class="albOpsUI">
            <div class="albOpsHeader">ImgOps (Selected: <span id="albOpsCounter">0</span>)</div>
            <select id="albOpsAlbumSel"></select>
            <ul id="albOpsActions" class="post-options-extra">
                <li class="extra-option" data-action="move">Move selected</li>
                <li class="extra-option" data-action="copy">Copy selected</li>
                <li class="extra-option" data-action="upd">Update albums</li>
                <li class="extra-option danger" data-action="clear">Clear current album</li>
            </ul>
        </div>`);
    document.getElementById("albOpsActions").addEventListener("click", handleAction);
    COUNTER = document.getElementById("albOpsCounter");

    //Events//
    //Dynamic DOM changes + new image additions
    let container = document.body.querySelector(".post-images > div:first-child");
    OBSERVER = new MutationObserver(handleChange);
    OBSERVER.observe(container, {childList: true});

    //Delegated selection checkboxes
    container.addEventListener("change", function(e) {
        if (e.target.className == "albOpsMark") {
            if (e.target.checked) {
                if (!SELECTED.includes(e.target.value)) {
                    SELECTED.push(e.target.value);
                }
                else {
                    console.warn("Attempted adding duplicate image ID to selection.");
                }
            }
            else {
                let idx = SELECTED.indexOf(e.target.value);
                if (idx != -1) {
                    SELECTED.splice(idx, 1);
                }
            }
            COUNTER.textContent = SELECTED.length;
        }
    }, {passive: true});
}

function populateAlbumList() {
    let albumList = document.getElementById("albOpsAlbumSel"),
        newEntry,
        reset = false;
    if (albumList.options.length > 0) {
        albumList.innerHTML = "";
        reset = true;
    }
    for (let album of ALBUMS) {
        newEntry = document.createElement("option");
        newEntry.textContent = `${album.name} (${album.count} images)`;
        newEntry.value = album.id;
        albumList.add(newEntry);
    }
    TARGET_ALBUM = albumList.value;
    if (!reset) {
        albumList.addEventListener("change", e => TARGET_ALBUM = e.target.value, {passive: true});
    }
}

function init() {
    if (!imgur._.auth.hasAccess) {
        debugLog("Abort: we don't own this album.");
        return;
    }

    function _init() {
        CURRENT_ALBUM = imgur._.hash;
        if (!CURRENT_ALBUM) {
            console.error("Couldn't get album id.");
            return;
        }
        injectUI();
        populateAlbumList();

        //Trigger cache update if new owned album or images changed. TODO: Add image changed part, need to deal with that in album ops as well
        if (!ALBUMS.find(x => x.id == Imgur.Environment.hash)) {
            ALBUM_LAST_UPDATE = 0;
            load(); //No need to do anything afterwards
        }
    }

    load()
    .then(_init)
    .catch(e => console.error("Error: ", e));
}

if (location.pathname == "/" && (Imgur.Environment.auth && Imgur.Environment.auth.hasAccess)) {
    debugLog("Album overview page", Imgur);
//    checkAlbumViewChanges();
    var checkAlbumLoad = setInterval(checkAlbumViewChanges, 500);
    var albumLoadTO = setTimeout(() => clearInterval(checkAlbumLoad), 15000);
}
else {
    debugLog("Album page, initing operations", Imgur, location);
    init();
}

function checkAlbumViewChanges() {
    function notifyViewChange (node, val) {
        let el = document.createElement("span");
        el.className = "albOps-newViews";
        el.textContent = ` (${val} new)`;
        node.appendChild(el);
    }
    //Diff host URL means diff localStorage.
    //Imgur responds with CORS headers that cause a normal request (as per global load()) to be blocked from the user page when trying to send login cookies to see hidden/secret albums (allow-origin=* + credentials used for login)
    //So since we have the important info in the page anyway, we rebuild a bit...
    function load() { 
        if (!ALBUMS) {
            ALBUMS = JSON.parse(localStorage.getItem("albums")) || [];
            //We do our own management using the page info later on so no need to update with api, since we can't.
        }
    }
    function save() {
        localStorage.setItem("albums", JSON.stringify(ALBUMS));
    }

    var albums;        
    if (album) { //Imgur global
        albums = document.querySelectorAll(".album");
        let target = Math.min(album._.albumsPerPage, album._.totalAlbumsCount);
        if (albums.length < target ) {
            return;
        }
        else {
            clearInterval(checkAlbumLoad);
            clearTimeout(albumLoadTO);
        }
    }
    else {
        return;
    }
    debugLog("Could we find albums?", albums);
    load();
    injectCSS();

    //Main proccesing
    let updated = false;
    for (let alb of albums) {
        let id = alb.id.slice(6);
        let meta = alb.getElementsByClassName("metadata")[0];
        let views = parseInt(meta.innerText.match(/(\d+) view/)[1]);

        let storedAlb = findAlbum(id);

        if (storedAlb) {
            let diff = views - (storedAlb.views || 0);
            if (diff > 0) {
                notifyViewChange(meta, diff);
                storedAlb.views = views;
                updated = true;
            }
        }
        else {
            ALBUMS.push({id, views});
            updated = true;
        }
    }
    if (updated) {
        save();
        console.info("Album view info updated.");
    }
}

function debugLog() {
    if (DEBUG) {
        console.log(... arguments);
    }
}
function debugInfo() {
    if (DEBUG) {
        console.info(... arguments);
    }
}
function debugError() {
    if (DEBUG) {
        console.error(... arguments);
    }
}
window.debugAlbOps = function () {
    console.log("Albums:", ALBUMS, "Last update:", ALBUM_LAST_UPDATE, "Selected:", SELECTED, "Current:", CURRENT_ALBUM, "Target:", TARGET_ALBUM);
};
window.logViews = function () {
    console.log(Imgur.Environment.image.views);
};
