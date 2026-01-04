// ==UserScript==
// @name         Better Rule34
// @name:fr      Meilleure règle 34
// @namespace    http://tampermonkey.net/
// @version      0.85
// @description  A script to improve the use of rule34!
// @description:fr Un script pour améliorer l'utilisation de rule34!
// @author       You
// @match        https://rule34.xxx/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504211/Better%20Rule34.user.js
// @updateURL https://update.greasyfork.org/scripts/504211/Better%20Rule34.meta.js
// ==/UserScript==

const defaultConfig = {
    imageResizeNotice: false,
    theme: "dark",
    undeletePosts: true,
    clickAnywhereToStart: false,
    htmlVideoPlayer: false,
    dynamicResizing: false,
    scrollPostsIntoView: false,
    downloadFullSizedImages: false,
    fitImageToScreen: false,
    hideAlerts: false
};

function initializeSettings(defaultConfig) {
    Object.keys(defaultConfig).forEach(key => {
        if (GM_getValue(key) === undefined) {
            GM_setValue(key, defaultConfig[key]);
        }
    });
}

initializeSettings(defaultConfig);

const dark = {
    "primary": "#121212",
    "secondary": "#000011",
    "contrast" : "#4a4a4a",
    "complementary" : "#666666",
    "tableBackground" : "transparent",
    "linkColor" : "#00f"
};

const themes = {
    "dark": dark
}

if(GM_getValue("dynamicResizing", "false") == "true"){
    const css2 = `
    div.sidebar {
        max-width: 30%;
    }
    div.sidebar li {
        font-size: 120%;
    }
    div.content {
        width: 100%;
    }
    .thumb {
        height: 20%;
        width: auto;
    }
    `
    GM_addStyle(css2);
}

// Añadir el enlace "Add to favorites" en la esquina superior derecha si la URL coincide con el patrón
const urlPattern = /^https:\/\/rule34\.xxx\/index\.php\?page=post&s=view&id=/;
if (urlPattern.test(window.location.href)) {
    const addToFavLink = document.querySelector("a[onclick^=\"post_vote\"][onclick*=\"addFav\"]");
    if (addToFavLink) {
        addToFavLink.style.position = 'fixed';
        addToFavLink.style.top = '10px';
        addToFavLink.style.right = '10px';
        addToFavLink.style.zIndex = '1000';
    }
}

const params = new URLSearchParams(window.location.search);

const settingsData = `{
        "settings": [
            {
                "name": "imageResizeNotice",
                "description": "Remove the image resize notice",
                "type": "dropdown",
                "options": ["resize", "no-resize"]
            },
            {
                "name": "theme",
                "description": "Theme selection",
                "type": "dropdown",
                "options": ["dark", "light", "auto"]
            },
            {
                "name": "undeletePosts",
                "description": "Display deleted posts",
                "type": "checkbox"
            },
            {
                "name": "clickAnywhereToStart",
                "description": "Click anywhere on the page to start the video",
                "type": "checkbox"
            },
            {
                "name": "htmlVideoPlayer",
                "description": "Use HTML video player instead of the Fluid Player",
                "type": "checkbox"
            },
            {
                "name": "dynamicResizing",
                "description": "Dynamically resize the page for odd aspect ratios or large screens",
                "type": "checkbox"
            },
            {
                "name": "scrollPostsIntoView",
                "description": "Scroll posts into view",
                "type": "checkbox"
            },
            {
                "name": "downloadFullSizedImages",
                "description": "Download the full resolution image when saving the image",
                "type": "checkbox"
            },
            {
                "name": "fitImageToScreen",
                "description": "Fit image to screen (buggy)",
                "type": "checkbox"
            },
            {
                "name": "hideAlerts",
                "description": "Hide script warnings",
                "type": "checkbox"
            }
        ]
    }`;

// Parse the settings JSON
const settingsObj = JSON.parse(settingsData);

// Function to create and display the settings overlay
function openSettings() {
    // Create the overlay div
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000'; // Ensures it overlays everything else

    // Create the centered div
    const centeredDiv = document.createElement('div');
    centeredDiv.style.width = '25vw';
    centeredDiv.style.backgroundColor = 'white';
    centeredDiv.style.padding = '20px';
    centeredDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    centeredDiv.style.textAlign = 'left';
    centeredDiv.style.display = 'flex';
    centeredDiv.style.flexDirection = 'column';
    centeredDiv.style.justifyContent = 'center';
    centeredDiv.style.alignItems = 'stretch';

    // Create form elements for each setting
    settingsObj.settings.forEach(setting => {
        const settingDiv = document.createElement('div');
        settingDiv.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.innerText = setting.description;
        label.style.display = 'block';
        label.style.marginBottom = '5px';

        settingDiv.appendChild(label);

        if (setting.type === "checkbox") {
            // Create a checkbox for boolean values
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = GM_getValue(setting.name, "false") === "true";
            checkbox.addEventListener('change', () => {
                GM_setValue(setting.name, checkbox.checked.toString());
            });
            settingDiv.appendChild(checkbox);
        } else if (setting.type === "dropdown") {
            // Create a dropdown for other values
            const dropdown = document.createElement('select');
            const currentValue = GM_getValue(setting.name, setting.options[0]);
            setting.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option;
                optionElement.innerText = option;
                if (option === currentValue) {
                    optionElement.selected = true;
                }
                dropdown.appendChild(optionElement);
            });
            dropdown.addEventListener('change', () => {
                GM_setValue(setting.name, dropdown.value);
            });
            settingDiv.appendChild(dropdown);
        }

        centeredDiv.appendChild(settingDiv);
    });

    // Append the centered div to the overlay
    overlay.appendChild(centeredDiv);

    // Append the overlay to the body
    document.body.appendChild(overlay);

    // Optionally, add a click event to close the overlay when clicking outside the centered div
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

function setTheme(){
    let currentTheme = themes[GM_getValue("theme", "false")];
    if(currentTheme){
        const css = `

            table a:link {
                color: ${currentTheme.linkColor};
            }

            table a:visited {
                color: ${currentTheme.linkColor};
            }

            body {
                background-color: ${currentTheme.primary};
            }
            .flat-list{
                background-color: ${currentTheme.secondary};
            }
            div#header ul#subnavbar {
                background-color: ${currentTheme.secondary};
            }
            div#header ul#navbar li.current-page {
                background-image: url(https://imgs.search.brave.com/77L3MmxBu09NuN5WiX4HlbmWjjUe7eAsmBbakS7-DTo/rs:fit:120:120:1/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy90/aHVtYi8wLzAyL1Ry/YW5zcGFyZW50X3Nx/dWFyZS5zdmcvMTIw/cHgtVHJhbnNwYXJl/bnRfc3F1YXJlLnN2/Zy5wbmc);;
            }
            .current-page {
                background-color: ${currentTheme.secondary};
                background-color: brightness(110%);
            }
            .manual-page-chooser>input[type=text]{
                background-color: ${currentTheme.secondary};
            }
            .manual-page-chooser>input[type=submit]{
                background-color: ${currentTheme.secondary};
                color: ${currentTheme.contrast};
            }
            div.tag-search input[type=text]{
                background-color: ${currentTheme.secondary};
                color: ${currentTheme.contrast};
            }
            div.tag-search input[type=submit]{
                background-color: ${currentTheme.secondary};
                color: ${currentTheme.contrast};
            }
            .col2 {
                color: ${currentTheme.contrast};
            }
            h6 {
                color: ${currentTheme.contrast};
            }
            h5 {
                color: ${currentTheme.contrast};
            }
            .tag-count {
                color: ${currentTheme.contrast};
            }
            b {
                color: ${currentTheme.contrast};
            }
            li {
                color: ${currentTheme.contrast};
            }
            ul {
                color: ${currentTheme.contrast};
            }
            button {
                background-color: ${currentTheme.secondary};
                color: ${currentTheme.contrast};
                box-sizing: border-box;
                border: 1px solid;
                margin-top: 3px;
                border-color: ${currentTheme.contrast};
            }
            table.highlightable td {
                color: ${currentTheme.contrast};
            }
            h2 {
                color: ${currentTheme.contrast};
            }
            table.form p {
                color: ${currentTheme.contrast};
            }
            table {
                color: ${currentTheme.contrast};
            }
            label {
                color: ${currentTheme.contrast};
            }
            table {
                background-color: ${currentTheme.tableBackground};
            }
            div {
                color: gray;
            }
        `;
        GM_addStyle(css);
        const thumbs = document.querySelectorAll(".thumb");
        thumbs.forEach(thumb => {
            const images = thumb.getElementsByTagName("img");
            for (let i = 0; i < images.length; i++) {
                images[i].style.border = `3px solid ${currentTheme.complementary}`;
            }
        });

        const e=document.getElementById("user-index");e&&[...e.getElementsByTagName("p")].map(e=>(e.style.color=currentTheme.contrast));


        if(GM_getValue("resizePosts", "false") == "true" && window.location.href.startsWith("https://rule34.xxx/index.php?page=post&s=view")){
            GM_addStyle(".content{max-height: 45%; max-width: 45%; overflow: auto;}");
            document.getElementById("image").style.maxHeight = "50%";
            document.getElementById("image").style.maxWidth = "fit-content";
            document.getElementById("image").style.overflow = "auto";
        }
    }
}

let randNum

function getFromRule34(tags, index, limit, useBlacklist = false) {
    if (tags == "all") {
        tags = "";
    }
    let pid = index;
    if (useBlacklist) {
        tags += (" -" + decodeURIComponent(getCookie("tag_blacklist")).replaceAll("%20", " -").replaceAll("%2F", "/"));
    }
    console.log(tags);
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${encodeURIComponent(tags)}&limit=${limit}&pid=${pid}&json=1`;

    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const data = JSON.parse(response.responseText);
                    console.log(data);
                    resolve(data);
                } else {
                    reject(new Error(`HTTP error! Status: ${response.status}`));
                }
            },
            onerror: function(error) {
                reject(new Error(`Network error! ${error}`));
            }
        });
    });
}

function getFromRule34WithId(id) {
    const url = `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&id=${id}&json=1`;

    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const data = JSON.parse(response.responseText);
                    resolve(data[0]);
                } else {
                    reject(new Error(`HTTP error! Status: ${response.status}`));
                }
            },
            onerror: function(error) {
                reject(new Error(`Network error! ${error}`));
            }
        });
    });
}


function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function getTagsFromUrl(currentUrl) {
    if(currentUrl.startsWith("https://rule34.xxx/index.php?page=post&s=list&tags=")) {
        return currentUrl.replace("https://rule34.xxx/index.php?page=post&s=list&tags=", "");
    }
}

function creatLinks() {
    try {
        if (window.location.href.startsWith("https://rule34.xxx/index.php?page=post&s=list&tags=")) {
            var anchors = document.getElementsByClassName("image-list")[0].getElementsByTagName("a");

            if (anchors.length > 0) {
                for (var i = 0; i < anchors.length; i++) {
                    const urlParams = new URLSearchParams(window.location.search);
                    let pageNum = parseInt(urlParams.get("pid"));
                    if(!pageNum){pageNum=0}
                    anchors[i].href = (anchors[i].href + "&srchTags=" + getTagsFromUrl(window.location.href) + "&index=" + (i + pageNum).toString()).replace(/[\?&]pid=\d*/g, '');;
                }
            } else {
                throw new Error("No elements found with class name 'image-list' or no anchor elements found within that class.");
            }
        } else {
            throw new Error("The current URL does not start with 'https://rule34.xxx/index.php?page=post&s=list&tags='.");
        }
    } catch (error) {
        console.error("An error occurred in creatLinks: " + error);
    }
}


var preloadedData; // Variable to store the preloaded JSON data

// Function to preload data for the next post
function preloadNextPost(srchTags, nextIndex, limit) {
    getFromRule34(srchTags, nextIndex, limit, true)
        .then(jsonInfo => {
        console.log(jsonInfo)
        preloadedData = jsonInfo;
        console.log(preloadedData)
    })
        .catch(error => {
        console.error("An error occurred during API request:", error);
    });
}

// Function to navigate to the next post using preloaded data
function navigateToNextPost(srchTags, nextIndex) {
    if (!preloadedData || !preloadedData.length) {
        console.error("No preloaded data available. Cannot proceed.");
        return;
    }

    const nextPostId = preloadedData[0].id;
    const newUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${nextPostId}&srchTags=${encodeURIComponent(srchTags)}&index=${nextIndex}`;

    window.location.href = newUrl;
}

// Event listener for the "DOMContentLoaded" event
setTimeout(function(){
    const urlParams = new URLSearchParams(window.location.search);
    const srchTags = urlParams.get("srchTags");
    const currentIndex = parseInt(urlParams.get("index"));

    if (!srchTags || isNaN(currentIndex)) {
        console.error("Invalid URL parameters. Cannot proceed.");
        return;
    }

    const nextIndex = currentIndex + 1;
    console.log(nextIndex)
    const limit = 1000;

    // Preload data for the next post
    preloadNextPost(srchTags, nextIndex, 1);

    // Event listener for when the user tries to navigate to the next post
    document.getElementById("nextButton").addEventListener("click", () => {
        navigateToNextPost(srchTags, nextIndex);
    });
},1000);



function backPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const srchTags = urlParams.get("srchTags");
    const currentIndex = parseInt(urlParams.get("index"), 10);

    if (!srchTags || isNaN(currentIndex)) {
        console.error("Invalid URL parameters. Cannot proceed.");
        return;
    }

    const nextIndex = currentIndex - 1;
    const limit = 1;

    getFromRule34(srchTags, nextIndex, limit)
        .then(jsonInfo => {
        if (!jsonInfo || !jsonInfo.length) {
            console.error("No data received from API. Cannot proceed.");
            return;
        }

        const nextPostId = jsonInfo[0].id;
        const newUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${nextPostId}&srchTags=${encodeURIComponent(srchTags)}&index=${nextIndex}`;

        window.location.href = newUrl;
    })
        .catch(error => {
        console.error("An error occurred during API request:", error);
    });
}


async function randomVideo() {
    const urlParams = new URLSearchParams(window.location.search);
    let srchTags = urlParams.get("tags");

    if (!srchTags) {
        // If tags parameter is not found in the URL, get the value from the input element
        const tagsInput = document.querySelector("input[name='tags']");
        srchTags = tagsInput.value.replace(/ /g, "+");
    }

    const posts = await getFromRule34(srchTags, 0, 1000);

    if (posts.length === 0) {
        console.error("No posts found for the given tags. Cannot proceed.");
        return;
    }

    const randNum = Math.floor(Math.random() * posts.length);
    const postId = posts[randNum].id;

    const newUrl = `https://rule34.xxx/index.php?page=post&s=view&id=${postId}&tags=${encodeURIComponent(srchTags)}&index=${randNum}`;
    window.location.href = newUrl;
}

async function downloadAllPostFiles() {
    const urlParams = new URLSearchParams(window.location.search);
    let srchTags = urlParams.get("tags");

    if (!srchTags) {
        // If tags parameter is not found in the URL, get the value from the input element
        const tagsInput = document.querySelector("input[name='tags']");
        srchTags = tagsInput.value.replace(/ /g, "+");
    }

    const posts = await getFromRule34(srchTags, 0, 1000);

    if (posts.length === 0) {
        console.error("No posts found for the given tags. Cannot proceed.");
        return;
    }

    // Loop through each post and download the file
    for (const post of posts) {
        const postId = post.image;
        const fileUrl = post.file_url;

        try {
            downloadFile(fileUrl, postId)
        } catch (error) {
            console.error(`Error downloading post ${postId}:`, error);
        }
    }
}



function makeButtons(){
    let btn = document.createElement("button");
    btn.innerHTML = "Random";
    btn.onclick = randomVideo;
    let btn4 = document.createElement("button");
    btn4.innerHTML = "↓";
    btn4.onclick = downloadAllPostFiles;
    if(document.getElementsByClassName("tag-search")[0]){document.getElementsByClassName("tag-search")[0].appendChild(btn); document.getElementsByClassName("tag-search")[0].appendChild(btn4)};
    if(document.getElementsByClassName("image-sublinks")[0]){
        let btn3 = document.createElement("button");
        btn3.innerHTML = "back";
        btn3.onclick = backPost;
        document.getElementsByClassName("image-sublinks")[0].appendChild(btn3);
        let btn2 = document.createElement("button");
        btn2.innerHTML = "next";
        btn2.id = "nextButton"
        document.getElementsByClassName("image-sublinks")[0].appendChild(btn2);
    }
}

function allowInputResize(){
    const awesompleteElement = document.getElementsByClassName("awesomplete")[0].childNodes[0];

    // Add input event listener
    awesompleteElement.addEventListener('input', resizeInput.bind(awesompleteElement));

    // Add click event listener
    awesompleteElement.addEventListener('click', resizeInput.bind(awesompleteElement));

    // Add blur (focus loss) event listener
    awesompleteElement.addEventListener('blur', restoreNormalSize.bind(awesompleteElement));

    awesompleteElement.style.position = "relative"
    awesompleteElement.style.zIndex = 99

    // The resizeInput function
    function resizeInput() {
        this.style.minWidth = "100%"
        this.style.width = this.value.length + "ch";
    }

    // Function to restore normal size
    function restoreNormalSize() {
        this.style.width = "100%"; // Clear the inline width style
    }
}

const imageSublinks = document.getElementsByClassName("image-sublinks")[0];
if (imageSublinks) {
    document.addEventListener("keydown", function(event) {
        // Check if the active element is an input element
        const activeElement = document.activeElement;
        const isInputElement = activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA";

        // If it's an input element, don't execute the functions
        if (isInputElement) {
            return;
        }

        // If it's not an input element, execute the functions based on the key press
        if (event.keyCode === 39) {
            const urlParams = new URLSearchParams(window.location.search);
            const srchTags = urlParams.get("srchTags");
            const currentIndex = parseInt(urlParams.get("index"));
            const nextIndex = currentIndex + 1;
            navigateToNextPost(srchTags, nextIndex);
        } else if (event.keyCode === 37) {
            backPost();
        }
    });
}


async function addDeletedPosts(id) {
    let statusNotices = document.getElementsByClassName("status-notice");

    if (statusNotices.length > 0) {
        let foundDeletedPost = false;

        // Iterate through each status notice
        for (let i = 0; i < statusNotices.length; i++) {
            let statusNotice = statusNotices[i];
            if (statusNotice.firstChild.data.startsWith("This post was")) {
                foundDeletedPost = true;
                try {
                    const mediaJson = await getFromRule34WithId(id);
                    const mediaUrl = mediaJson.file_url;
                    const mediaType = mediaUrl.split('.').pop().toLowerCase();

                    const videoExtensions = [
                        "mp4", "webm", "ogg", "mov", "avi", "wmv", "flv", "mkv",
                        "3gp", "m4v", "mpg", "mpeg", "swf", "vob", "m2ts"
                    ];
                    const imageExtensions = [
                        "jpg", "jpeg", "png", "gif", "bmp", "tiff", "tif", "svg",
                        "webp", "heic", "heif", "ico", "raw", "psd", "ai", "eps"
                    ];

                    if (videoExtensions.includes(mediaType)) {
                        let video = document.createElement("video");
                        video.src = mediaUrl;
                        video.controls = true;
                        video.style.maxHeight = "70%";
                        video.style.maxWidth = "70%";
                        video.style.overflow = "auto";
                        document.getElementById("fit-to-screen").appendChild(video);
                    } else if (imageExtensions.includes(mediaType)) {
                        let image = document.createElement("img");
                        image.src = mediaUrl;
                        image.style.maxHeight = "70%";
                        image.style.maxWidth = "70%";
                        image.style.overflow = "auto";
                        document.getElementById("fit-to-screen").appendChild(image);
                    }

                    statusNotice.remove();
                } catch (e) {
                    console.error(e);
                }
                // Exit loop after handling first deleted post
                break;
            }
        }

        if (!foundDeletedPost) {
            console.log("This post is not deleted.");
        }
    } else {
        console.log("The status-notices element is not present on this page.");
    }
}

async function downloadFile(fileUrl, filename) {
    return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
            method: 'GET',
            url: fileUrl,
            responseType: 'blob',
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const blob = response.response;
                    // Create a temporary link element to trigger the download
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = filename; // Use the provided filename
                    link.click();

                    // Clean up the temporary URL object
                    URL.revokeObjectURL(link.href);
                    resolve();
                } else {
                    reject(new Error(`HTTP error! Status: ${response.status}`));
                }
            },
            onerror: function(error) {
                reject(new Error(`Network error! ${error}`));
            }
        });
    });
}

function getLinksInDiv(element) {
    var elements = element.parentNode.querySelectorAll("a");
    return(elements[elements.length - 1])
}

function resizePostPopup(){
    try {
        if(GM_getValue("imageResizeNotice", "false") == "resize"){$('resized_notice').hide()}
        if(GM_getValue("imageResizeNotice", "false") == "orignal"){Post.highres(); $('resized_notice').hide();}
    } catch (e) {
        console.error(e);
    }
}

function startVideo(){
    if (document.getElementById("gelcomVideoPlayer_fluid_initial_play")) {
        document.getElementById("gelcomVideoPlayer").autoplay = true;
    }
}

function addTagButtons(){
    const classList = ["tag-type-copyright", "tag-type-general", "tag-type-character", "tag-type-artist","tag-type-metadata"]
    for (const curClass of classList) {
        const elements = document.getElementsByClassName(curClass);

        for (const element of elements) {
            const button = document.createElement("button");
            button.innerHTML = "+";
            button.onclick = function() {console.log(" " + getLinksInDiv(this).innerText); document.getElementsByName("tags")[0].value += " " + (getLinksInDiv(this).innerText.trim()).replaceAll(" ","_")}
            element.insertBefore(button, element.firstChild);
        }
    }
}

function stretchyDiv(isImage){
    let div;
    if(isImage == 0){div = document.getElementById("fluid_video_wrapper_gelcomVideoPlayer")} else {div = document.getElementById("image")}
    if(isImage == 1){
        let newDiv = document.createElement("div");
        newDiv.style.position = "relative";
        div.parentNode.insertBefore(newDiv, div);
        newDiv.appendChild(div);
        div = newDiv;
        document.getElementById("image").maxHeight = 9999
    }
    const resizer = document.createElement("div");
    resizer.style.width = "10px";
    resizer.style.height = "10px";
    resizer.style.backgroundColor = "white";
    resizer.style.position = "absolute";
    resizer.style.bottom = "0";
    resizer.style.right = "0";
    resizer.style.cursor = "se-resize";
    resizer.style.zIndex = "10";


    let isResizing = false;
    let currentX;
    let currentY;
    let initialWidth;
    let initialHeight;

    resizer.addEventListener("mousedown", function(e) {
        document.body.style.userSelect = 'none';
        isResizing = true;
        currentX = e.clientX;
        currentY = e.clientY;
        initialWidth = parseFloat(getComputedStyle(div, null).getPropertyValue("width").replace("px", ""));
        initialHeight = parseFloat(getComputedStyle(div, null).getPropertyValue("height").replace("px", ""));
    });

    document.addEventListener("mouseup", function() {
        document.body.style.userSelect = '';
        isResizing = false;
    });

    document.addEventListener("mousemove", function(e) {
        if (isResizing) {
            let inner = div.getElementsByTagName("img")[0];
            let newWidth = initialWidth + (e.clientX - currentX);
            let newHeight = initialHeight + (e.clientY - currentY);
            if (!e.shiftKey) {
                // Resize both width and height at the same rate
                let ratio = initialWidth / initialHeight;
                newHeight = newWidth / ratio;
            }
            if(isImage == 1){inner.style.width = newWidth + "px"; inner.style.height = newHeight + "px";}
            div.style.width = newWidth + "px";
            div.style.height = newHeight + "px";
            div.style.maxHeight = "1000vh"
            if(document.getElementById("gelcomVideoPlayer")){
                document.getElementById("gelcomVideoPlayer").style.maxHeight = "1000vh"
                document.getElementById("gelcomVideoPlayer").style.height = "100%";
            }
            if(document.getElementById("image")){
                document.getElementById("image").style.width = newWidth + "px";
                document.getElementById("image").style.height = newHeight + "px";
                document.getElementById("image").style.maxHeight = "1000vh"
            }
        }
    });

    let strechySquare = div.appendChild(resizer);
}

function addInputBox(){
    let inputBox = document.createElement("input");
    let tagsElement = document.querySelector("[name='tags']");
    inputBox.type = "text"
    tagsElement.after(inputBox);
}

setTimeout(function(){
    if (document.getElementById("fluid_video_wrapper_gelcomVideoPlayer")) {
        stretchyDiv(0);
    } else if (document.getElementById("image")) {
        stretchyDiv(1);
    }
}, 300);

function setTags(tags){
    document.getElementsByName("tags")[0].value = tags
}

async function htmlVideoPlayer(id) {
    if (document.getElementById("gelcomVideoContainer")) {
        try {
            const videoUrl = await getFromRule34WithId(id);

            // Create video element
            let video = document.createElement("video");
            video.src = videoUrl.file_url;
            video.controls = true;
            video.style.maxHeight = "70%";
            video.style.maxWidth = "70%";
            video.style.overflow = "auto";

            // Append video after gelcomVideoContainer
            let gelcomVideoContainer = document.getElementById("gelcomVideoContainer");
            gelcomVideoContainer.parentNode.insertBefore(video, gelcomVideoContainer.nextSibling);

            // Remove gelcomVideoContainer
            gelcomVideoContainer.remove();

            // Remove status-notices if present
            let statusNotices = document.getElementById("status-notices");
            if (statusNotices) {
                statusNotices.remove();
            }
        } catch (e) {
            console.error(e);
        }
    }
}


function addCloseButtonToStatusNotice() {
    const statusNoticeElements = document.querySelectorAll('.status-notice');

    statusNoticeElements.forEach(element => {
        const closeButton = document.createElement('button');
        closeButton.textContent = 'x';
        closeButton.addEventListener('click', () => {
            element.parentNode.removeChild(element);
        });
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        element.appendChild(closeButton);
    });
}

async function overlayFullSizeImage(){
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    const postJson = await getFromRule34WithId(id);

    // Get the element with id "image"
    const originalImage = document.getElementById("image");

    // Create a new transparent image element
    const newImage = document.createElement("img");
    newImage.src = postJson.file_url;
    newImage.style.opacity = "0"; // Set opacity to 0 for transparency

    // Set the size of the new image to match the size of the original image
    newImage.style.width = originalImage.width + "px";
    newImage.style.height = originalImage.height + "px";

    // Position the new image on top of the original image
    newImage.style.position = "absolute";
    newImage.style.top = originalImage.offsetTop + "px";
    newImage.style.left = originalImage.offsetLeft + "px";
    newImage.style.zIndex = "1"; // Set a higher z-index to overlay on top

    // Insert the new transparent image before the original image
    originalImage.parentNode.insertBefore(newImage, originalImage);

}

function convertSearchToLink(){
    document.getElementsByName("commit")[0].innerHTML = `<a href="https://rule34.xxx/index.php?page=post&s=list&tags=all">${document.getElementsByName("commit")[0].innerHTML}</a>`
}

function fitPostToScreen(){
    if(GM_getValue("downloadFullSizedImages", "false") == "true" && GM_getValue("hideAlerts", "false") == "false"){window.alert(`downloadFullSizedImage and fitImageToScreen often cause bugs when used together.  To disable this alert turn hide alerts on in settings.`)}
    let postElement
    if(document.getElementById("fluid_video_wrapper_gelcomVideoPlayer")){postElement = document.getElementById("fluid_video_wrapper_gelcomVideoPlayer")} else {postElement = document.getElementById("image")}
    postElement.style.maxHeight = "85vh"
    postElement.style.width = "auto"
    if(document.getElementById("gelcomVideoPlayer")){
        document.getElementById("gelcomVideoPlayer").style.maxHeight = "85vh"
        document.getElementById("gelcomVideoPlayer").style.width = "auto"
    }
}

function addDownloadButtonToPosts(){
    // CSS for the spinner
    const style = document.createElement('style');
    style.innerHTML = `
        .spinner {
            border: 2px solid #f3f3f3; /* Light grey */
            border-top: 2px solid #3498db; /* Blue */
            border-radius: 50%;
            width: 12px;
            height: 12px;
            animation: spin 1s linear infinite;
            display: none; /* Initially hidden */
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading .spinner {
            display: inline-block; /* Show spinner */
        }
        .loading .button-text {
            display: none; /* Hide button text */
        }
    `;
    document.head.appendChild(style);

    // Get all elements with the class "thumb"
    const thumbElements = document.querySelectorAll('.thumb');

    thumbElements.forEach(thumb => {
        // Create a button element
        const button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.top = '0';
        button.style.right = '0';

        // Create span for button text
        const buttonText = document.createElement('span');
        buttonText.classList.add('button-text');
        buttonText.innerHTML = '↓'; // Down arrow ASCII char
        button.appendChild(buttonText);

        // Create spinner element
        const spinner = document.createElement('div');
        spinner.classList.add('spinner');
        button.appendChild(spinner);

        // Add an event listener to the button
        button.addEventListener('click', async () => {
            button.classList.add('loading'); // Add loading class
            try {
                const aElement = thumb.querySelector('a');
                if (aElement) {
                    const id = aElement.id;
                    const modifiedId = id.substring(1); // Remove the first character
                    const data = await getFromRule34WithId(modifiedId);
                    if (data && data.file_url) {
                        const filename = data.file_url.split('/').pop();
                        await downloadFile(data.file_url, filename);
                    }
                } else {
                    alert('No <a> element found within this thumb element.');
                }
            } catch (error) {
                console.error('Error downloading file:', error);
            } finally {
                button.classList.remove('loading'); // Remove loading class
            }
        });

        // Append the button to the thumb element
        thumb.style.position = 'relative'; // Ensure the thumb element is positioned relatively
        thumb.appendChild(button);
    });
}

async function displayMediaData() {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get("id");
    const postJson = await getFromRule34WithId(id);
    const mediaURL = postJson.file_url;
    const mediaType = mediaURL.split('.').pop().toLowerCase();

    // Create a container for the tooltip
    const tooltipContent = document.createElement('div');

    if (mediaType === 'jpg' || mediaType === 'jpeg' || mediaType === 'png' || mediaType === 'gif') {
        // Handle images
        const img = new Image();
        img.src = mediaURL;

        img.onload = () => {
            const width = img.width;
            const height = img.height;

            // Fetch the image using GM.xmlHttpRequest to get its size
            GM.xmlHttpRequest({
                method: 'GET',
                url: mediaURL,
                responseType: 'blob',
                onload: (response) => {
                    const imageSizeBytes = response.response.size;
                    const imageSizeKB = imageSizeBytes / 1024;
                    const imageSizeMB = imageSizeKB / 1024;

                    let sizeInfo = '';
                    if (imageSizeMB >= 1) {
                        sizeInfo = `${imageSizeMB.toFixed(2)} MB`;
                    } else {
                        sizeInfo = `${imageSizeKB.toFixed(2)} KB`;
                    }

                    // Create the tooltip content
                    tooltipContent.innerHTML = `
                        <div>Media URL: ${mediaURL}</div>
                        <div>Media Type: ${mediaType}</div>
                        <div>Width: ${width}px</div>
                        <div>Height: ${height}px</div>
                        <div>Size: ${sizeInfo}</div>
                    `;

                    appendTooltipToPage(tooltipContent);
                },
                onerror: (error) => {
                    console.error('Failed to fetch image size:', error);
                }
            });
        };

        img.onerror = (error) => {
            console.error('Failed to load image:', error);
        };

    } else if (mediaType === 'mp4' || mediaType === 'webm' || mediaType === 'ogg') {
        // Handle videos
        const video = document.createElement('video');
        video.src = mediaURL;

        video.onloadedmetadata = () => {
            const width = video.videoWidth;
            const height = video.videoHeight;
            const duration = video.duration;

            // Fetch the video using GM.xmlHttpRequest to get its size
            GM.xmlHttpRequest({
                method: 'GET',
                url: mediaURL,
                responseType: 'blob',
                onload: (response) => {
                    const videoSizeBytes = response.response.size;
                    const videoSizeKB = videoSizeBytes / 1024;
                    const videoSizeMB = videoSizeKB / 1024;

                    let sizeInfo = '';
                    if (videoSizeMB >= 1) {
                        sizeInfo = `${videoSizeMB.toFixed(2)} MB`;
                    } else {
                        sizeInfo = `${videoSizeKB.toFixed(2)} KB`;
                    }

                    // Calculate frame rate using approximate method
                    video.currentTime = 1;
                    video.onseeked = () => {

                        // Create the tooltip content
                        tooltipContent.innerHTML = `
                            <div>Media URL: ${mediaURL}</div>
                            <div>Media Type: ${mediaType}</div>
                            <div>Width: ${width}px</div>
                            <div>Height: ${height}px</div>
                            <div>Size: ${sizeInfo}</div>
                        `;

                        appendTooltipToPage(tooltipContent);
                    };
                },
                onerror: (error) => {
                    console.error('Failed to fetch video size:', error);
                }
            });
        };

        video.onerror = (error) => {
            console.error('Failed to load video:', error);
        };
    } else {
        console.error('Unsupported media type:', mediaType);
    }
}

function appendTooltipToPage(tooltipContent) {
    // Create the information icon element
    const infoIcon = document.createElement('span');
    infoIcon.innerHTML = 'ℹ️';
    infoIcon.style.cursor = 'pointer';
    infoIcon.style.marginLeft = '10px';
    infoIcon.title = 'Media Information';

    // Create the tooltip element
    const tooltip = document.createElement('div');
    tooltip.appendChild(tooltipContent);
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#fff';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '10px';
    tooltip.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    tooltip.style.display = 'none';
    tooltip.style.zIndex = '1000';

    // Append the tooltip to the info icon
    infoIcon.appendChild(tooltip);

    // Show the tooltip on hover
    infoIcon.onmouseover = () => {
        tooltip.style.display = 'block';
    };
    infoIcon.onmouseout = () => {
        tooltip.style.display = 'none';
    };

    // Append the info icon to the element with class "image-sublinks"
    const imageSublinks = document.querySelector('.image-sublinks');
    if (imageSublinks) {
        imageSublinks.appendChild(infoIcon);
    }
}

if(window.location.href.startsWith("https://rule34.xxx/index.php?page=post&s=view")){
    setTags(params.get("srchTags"))
} else if(window.location.href.startsWith("https://rule34.xxx/index.php?page=post&s=list")){
    setTags(params.get("tags"))
}

let isFirstClick = true;

document.addEventListener("click", function() {
    if (isFirstClick) {
        startVideo()
        isFirstClick = false;
    }
});

if(GM_getValue("scrollPostsIntoView", "false")){
    // Function to scroll an element into view
    function scrollIntoView(element) {
        if (element) {
            setTimeout(function(){element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })},250);
        }
    }

    // Try to find the element with id "image"
    var imageElement = document.querySelector('#image');

    // If not found, try to find the element with id "gelcomVideoPlayer"
    if (!imageElement) {
        var videoPlayerElement = document.querySelector('#gelcomVideoPlayer');
        scrollIntoView(videoPlayerElement);
    } else {
        scrollIntoView(imageElement);
    }
}

GM_registerMenuCommand('Settings', openSettings);
makeButtons();
creatLinks()
addCloseButtonToStatusNotice()
setTheme()
setTimeout(resizePostPopup, 100)
setTimeout(addTagButtons, 100)
setTimeout(allowInputResize, 100)

if (GM_getValue("undeletePosts", "false") === "true") {
    setTimeout(() => addDeletedPosts(window.location.href.split("&").find(part => part.startsWith("id=")).replace("id=", "")), 500);
}
if (GM_getValue("htmlVideoPlayer", "false") === "true") {
    setTimeout(() => htmlVideoPlayer(window.location.href.split("&").find(part => part.startsWith("id=")).replace("id=", "")), 500);
}
if (GM_getValue("downloadFullSizedImages", "false") === "true") {
    setTimeout(overlayFullSizeImage, 500);
}
if (GM_getValue("fitImageToScreen", "false") === "true") {
    setTimeout(fitPostToScreen, 500);
}

setTimeout(displayMediaData, 500);

setTimeout(addDownloadButtonToPosts, 500);

let noteBoxes = document.querySelectorAll(".note-box");
noteBoxes.forEach(function(noteBox) {
    noteBox.style.zIndex = "999";
});
