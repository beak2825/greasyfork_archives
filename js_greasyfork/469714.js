// ==UserScript==
// @name         Random reddit post
// @description  Load a random reddit post from your subs
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Random reddit post
// @author       John
// @match        https://old.reddit.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at     document-idle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/469714/Random%20reddit%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/469714/Random%20reddit%20post.meta.js
// ==/UserScript==
// a == random subreddit post
// s == random post

const verbose = true;
const LOG_PREFIX = "[Random Reddit]:";

function navigate(currentDoc, path) {
    if (verbose) console.log(LOG_PREFIX, "Navigating to:", path);
    currentDoc.location = path;
}

function createButton(name) {
    let btn = document.createElement("a");
    btn.innerHTML = name;
    btn.style = "text-decoration: none; font-size: 1.4em"
    btn.style.padding = "3px 3px 3px 3px";
    // btn.style.border = "thick solid #FFFFFF";
    // btn.style.margin = "3px 3px 3px 3px";
    btn.href = "javascript:void(0)"
    let div = document.getElementById("header-bottom-right");
    if (div) {
        div.insertBefore(btn, div.firstChild);
    } else {
        if (verbose) console.log(LOG_PREFIX, "header not ready");
    }
    return btn;
}
function updateImages() {
    let maxHeight = window.innerHeight / 2.5;
    let width = '100%';

    let linkElements = document.getElementsByClassName("link");

    for (let linkElement of linkElements) {
        // linkElement.marginBottom = '10px';
        // linkElement.width = width;
        // linkElement.style.maxWidth = width;
        // linkElement.style.width = width;
    }

    let thumbnailElements = document.getElementsByClassName("thumbnail");
    // if (verbose) console.log(LOG_PREFIX, "thumbnails:", thumbnailElements)

    for (let thumbnailElement of thumbnailElements) {
        // thumbnailElement.style.maxWidth = width;
        thumbnailElement.style.width = "20%";
        // thumbnailElement.style.width = 'auto';
        // thumbnailElement.style.height = 'auto';
        // thumbnailElement.style.height = '100px';
        // thumbnailElement.width = '600px';
        // thumbnailElement.marginBottom = '20%';
        let img = thumbnailElement.childNodes.item("");
        if (img) {
            var url = thumbnailElement.parentElement.getAttribute("data-url")
            // if (verbose) console.log(LOG_PREFIX, "url:", url)
            if (url != undefined && url != null &&
                (url.includes(".jpg")
                || url.includes(".png")
                || url.includes(".jpeg"))
                ) {
                // if (verbose) console.log(LOG_PREFIX, "Setting url:", url)
                img.src = url;
            }
            // console.log(LOG_PREFIX, "img:", img)
            // img.style.maxHeight = '100%';
            // img.maxWidth = width;
            // img.width = width;
            img.style.maxWidth = width;
            img.style.width = width;
            // img.style.width = '640px';
            // img.style.width = '600px';
            // img.style.maxHeight = '70%';
            img.style.height = 'auto';
            img.style.maxHeight = `${maxHeight}px`;
            img.style.objectFit = 'contain';
        } else {
            // console.log(LOG_PREFIX, "No img");
        }
    }
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Blacklist, useful when overloaded with one subreddit
const BLACKLIST_SR = [
    "hentai"
];

function parsePosts(posts, filterMedia, startTime, getParams) {
    const prefix = window.location.protocol + "//" + window.location.host;
    if (filterMedia) {
        posts = posts.filter(function (post) {
            var isCrosspostVideo = false;
            var crosspostParent = post.data.crosspost_parent_list || undefined;
            // console.log("Post:", post)
            try {
                while (crosspostParent != undefined) {
                    crosspostParent = crosspostParent[0];
                    // console.log("Crosspost parent:", crosspostParent);
                    var postHint = crosspostParent.post_hint || "";
                    var url = crosspostParent.url || crosspostParent.link_url;
                    if (postHint.includes("video") || url.includes(".mp4") || url.includes(".gif")) {
                        isCrosspostVideo = true;
                        console.log("isCrosspostVideo:", isCrosspostVideo)
                        break;
                    }
                    crosspostParent = crosspostParent.crosspost_parent_list || undefined;
                }
            } catch (e) { }
            var postHint = post.data.post_hint || "";
            var url = post.data.url || post.data.link_url;
            // console.log("Post:", postHint, url, post.data);
            // console.log("isCrosspostVideo 2:", isCrosspostVideo)
            // console.log("Post:", post.data.subreddit);
            var isValidPost = BLACKLIST_SR.some((sr) => window.location.href.includes(sr)) || !BLACKLIST_SR.includes(post.data.subreddit);
            return (postHint.includes("video") || url.includes(".mp4") || url.includes(".gif") || isCrosspostVideo || post.data.media) && isValidPost;
        });
        if (verbose) console.log(LOG_PREFIX, 'Filter animated: ', posts);
    }
    if (verbose) console.log(LOG_PREFIX, 'Media posts: ', posts);
    if (posts.length > 0) {
        shuffleArray(posts);
        var randPost = posts[Math.floor(Math.random()*posts.length)];
        // var randPostLink = prefix + randPost.data.permalink + `?${PREFIX_KEY}=` + (getParams || "");
        var randPostLink = prefix + randPost.data.permalink + (getParams || "");
        // console.log(LOG_PREFIX, randPost, randPostUrl);
        if (verbose) console.log(LOG_PREFIX, "Random post link:", randPostLink);
        navigate(document, randPostLink);
    } else {
        $("body").css("cursor", "default");
        console.log("No media post")
    }
    var endTime = performance.now();
    if (verbose) console.log(`Random post time taken: ${endTime - startTime} milliseconds`);
}

const PREFIX_KEY="prefix"
const SEARCH_KEY="q"

function randomPost(extraPath, filterMedia, getParams, onlyTop) {
    var startTime = performance.now()
    $("body").css("cursor", "progress");
    if (verbose) console.log(LOG_PREFIX, "Random post:", extraPath, ", filter:", filterMedia, ", prefix:", getParams, ", only top:", onlyTop);

    const durationArray = ["all", "month", "week", "year"];
    var duration = durationArray[Math.floor(Math.random()*durationArray.length)];
    if (extraPath.startsWith("saved")) {
        duration = "all";
    }

    // const sortArray = ["top", "new", "hot", "gilded"];
    var sortArray = ["top", "new", "hot"];
    var sortArrayWeights = [8, 2, 5];
    if (onlyTop) {
        sortArray = ["top"];
        sortArrayWeights = [1];
    }
    // var sortType = sortArray[Math.floor(Math.random()*sortArray.length)];
    var sortType = "";
    const savedPath = extraPath.startsWith("saved")
    if (!savedPath) {
        sortType = weighted_random(sortArray, sortArrayWeights);
    }
    // const maxPostLimit = 100;
    // const minPostLimit = 25;
    // var postLimit = Math.floor(Math.random() * (maxPostLimit - minPostLimit + 1)) + minPostLimit;
    var postLimit = 100;
    if (verbose) console.log(LOG_PREFIX, "Sort type:", sortType, "post limit:", postLimit);

    var fetchUrl = `https://old.reddit.com/` + extraPath;
    fetchUrl += `${sortType}.json?`;
    if (getParams && getParams.includes("q")) {
        // Search
        fetchUrl = `https://old.reddit.com/` + `${extraPath}.json` + getParams + `&sort=${sortType}`;
    }
    fetchUrl += `&t=all&limit=${postLimit}`;
    if (verbose) console.log(LOG_PREFIX, "Fetch 1:", fetchUrl);
    fetch(fetchUrl)
        .then(result => result.json())
        .then((output) => {
            if (verbose) console.log(LOG_PREFIX, 'Output: ', output);
            var posts = output.data.children;
            var lastPost = posts.at(-1);
            console.log("Last path:", lastPost.data.name);
            
            var fetchUrl = `https://old.reddit.com/` + extraPath;
            fetchUrl += `${sortType}.json?`;
            if (getParams && getParams.includes("q")) {
                // Search
                fetchUrl = `https://old.reddit.com/` + `${extraPath}.json` + getParams + `&sort=${sortType}`;
            }
            fetchUrl += `&t=${duration}&limit=${postLimit}&after=${lastPost.data.name}`;
            if (verbose) console.log(LOG_PREFIX, "Fetch 2:", fetchUrl);
            fetch(fetchUrl)
                .then(result => result.json())
                .then((output) => {
                    if (verbose) console.log(LOG_PREFIX, 'Output: ', output);
                    // var posts = output.data.children;
                    // console.log(LOG_PREFIX, 'All posts: ', posts);
                    posts = posts.concat(output.data.children);
                    // console.log(LOG_PREFIX, 'All posts: ', posts);
                    // if (savedPath) {
                        var lastPost = posts.at(-1);
                        console.log("Last path:", lastPost.data.name);

                        var fetchUrl = `https://old.reddit.com/` + extraPath;
                        fetchUrl += `${sortType}.json?`;
                        if (getParams && getParams.includes("q")) {
                            // Search
                            fetchUrl = `https://old.reddit.com/` + `${extraPath}.json` + getParams + `&sort=${sortType}`;
                        }
                        fetchUrl += `&t=${duration}&limit=${postLimit}&after=${lastPost.data.name}`;
                        if (verbose) console.log(LOG_PREFIX, "Fetch 3:", fetchUrl);
                        fetch(fetchUrl)
                            .then(result => result.json())
                            .then((output) => {
                                if (verbose) console.log(LOG_PREFIX, 'Output: ', output);
                                // var posts = output.data.children;
                                posts = posts.concat(output.data.children);
                                // console.log(LOG_PREFIX, 'All posts: ', posts);
                                parsePosts(posts, filterMedia, startTime, getParams);
                        }).catch(err => console.error(err))
                    // } else {
                    //     parsePosts(posts, filterMedia, startTime);
                    // }
            }).catch(err => console.error(err))
    }).catch(err => console.error(err))
}

function openInNewTab(url) {
    window.open(url, '_blank').focus();
}
function openFirstVideo() {
    // Tries to open first video element
    var titleElements = document.getElementsByClassName("title");
    for (let titleElement of titleElements) {
        try {
            if (titleElement.tagName == "A") {
                var videoLink = titleElement.href || titleElement.data-href-url;
                console.log("Opening video:", videoLink);
                // navigate(document, videoLink);
                openInNewTab(videoLink);
                break;
            }
        } catch (e) {
            console.error("Failed to open video:", e);
        }
    }
}

if (!window.location.pathname.includes("comments")) {
    var interval = setInterval(function(){
        updateImages();
    }, 1000);
} else {
    var maxHeight = 550;
    var maxWidth = 300;
    try {
        var items = document.getElementsByClassName("expando");
        // items[0].style.maxWidth = "100px";
        // items[0].style.maxHeight = "1139px";
        // items[0].style.maxHeight = "600px";
        // // items[0].style.maxWidth = "811px";
        // items[0].style.maxWidth = "300px";
        items[0].style.maxHeight = `${maxHeight}px`;
        // items[0].style.maxWidth = `${maxWidth}px`;
    } catch (e) {
        // console.error("Failed to set video width:", e);
    }
    function allDescendants (node) {
        try {
            for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
                allDescendants(child);
                child.style.maxHeight = `${maxHeight}px`;
                // child.style.maxWidth = `${maxWidth}px`;
                // child.style.maxHeight = "600px";
                // child.style.maxWidth = "300px";
            }
        } catch (e) {
            // console.error("Failed to set video width:", e);
        }
    }
    allDescendants(items[0]);

    console.log("items:", items)
    var videoList = document.getElementsByTagName("video");
    console.log("Videos:", videoList)
    for (var e of videoList) {
        // e.setAttribute('style', "width: 100px; height: 100px");
        try {
            // var newHeight = document.body.clientHeight * 0.75;
            // console.log("New height:", newHeight);
            // e.parentElement.parentElement.parentElement.style = `height: ${newHeight}px` 
            var videoWidth = e.parentElement.parentElement.parentElement.offsetWidth;
            e.setAttribute('style', `width: ${videoWidth}px`);
            console.log("New videoWidth:", videoWidth);
        } catch (e) {
            console.error("Failed to set video width:", e);
        }
    }
}

// var videoList = document.getElementsByTagName("video");
// console.log("Videos:", videoList)
// for (var e of videoList) {
//     // e.setAttribute('style', "width: 100px; height: 100px");
//     try {
//         var newHeight = document.body.clientHeight * 0.75;
//         console.log("New height:", newHeight);
//         e.parentElement.parentElement.parentElement.style = `height: ${newHeight}px` 
//         var videoWidth = e.parentElement.parentElement.parentElement.offsetWidth;
//         e.setAttribute('style', `width: ${videoWidth}px`);
//     } catch (e) {
//         console.error("Failed to set video width:", e);
//     }
// }
// window.addEventListener('load', function() {
//     console.log("Window loaded");
//     setTimeout(function(){}, 1000)
//     var videoList = document.getElementsByTagName("video");
//     console.log("Videos:", videoList)
//     for (var e of videoList) {
//         // e.setAttribute('style', "width: 100px; height: 100px");
//         try {
//             var newHeight = document.body.clientHeight * 0.75;
//             console.log("New height:", newHeight);
//             e.parentElement.parentElement.parentElement.style = `height: ${newHeight}px` 
//             // var videoWidth = e.parentElement.parentElement.parentElement.offsetWidth;
//             // e.setAttribute('style', `width: ${videoWidth}px`);
//         } catch (e) {
//             console.error("Failed to set video width:", e);
//         }
//     }
// });

    // var observer = new MutationObserver(function(mutations) {
    //     console.log("Mutations:", mutations)
    //     // if (document.contains(myElement)) {
    //     //     console.log("It's in the DOM!");
    //     //     observer.disconnect();
    //     // }
    //     setTimeout(function(){}, 1000)
    //     var videoList = document.getElementsByTagName("video");
    //     for (var e of videoList) {
    //         // e.setAttribute('style', "width: 100px; height: 100px");
    //         try {
    //             var newHeight = document.body.clientHeight * 0.75;
    //             console.log("New height:", newHeight);
    //             e.parentElement.parentElement.parentElement.style = `height: ${newHeight}px` 
    //             // var videoWidth = e.parentElement.parentElement.parentElement.offsetWidth;
    //             // e.setAttribute('style', `width: ${videoWidth}px`);
    //         } catch (e) {
    //             console.error("Failed to set video width:", e);
    //         }
    //     }
    // });
    
    // observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
    // observer.observe(document, {attributes: true, childList: true, characterData: false, subtree:true});
 

// window.addEventListener('load', function() {
    const randSavedPostBtn = createButton("Saved (Q)");
    randSavedPostBtn.onclick = () => {
        randomPost("saved/");
    };
    const randSavedMediaPostBtn = createButton("Media saved (W)");
    randSavedMediaPostBtn.onclick = () => {
        randomPost("saved/", filterMedia = true);
    };
    const randPostBtn = createButton("Rand post (S)");
    randPostBtn.onclick = () => {
        randomPost("");
    };
    var randSrPostPath = "";
    if (window.location.pathname != "/") {
        var pathArray = window.location.pathname.split('/');
        const randSrPostBtn = createButton("Sr post (A)");
        randSrPostBtn.onclick = () => {
            randomPost(`r/${pathArray[2]}/`);
        };
    }
    const randMediaPostBtn = createButton("Media (B)");
    randMediaPostBtn.onclick = () => {
        randomPost("", filterMedia = true);
    };
    if (window.location.pathname != "/") {
        var pathArray = window.location.pathname.split('/');
        const randSrMediaPostBtn = createButton("Media sr (V)");
        randSrMediaPostBtn.onclick = () => {
            randomPost(`r/${pathArray[2]}/`, filterMedia = true);
        };
    }
    const openVideoBtn = createButton("Open video");
    openVideoBtn.onclick = () => {
        openFirstVideo();
    };


    document.onkeyup = function (e) {
        console.log("event:", e);
        e = e || window.event;
        var charCode = e.charCode || e.keyCode,
            character = String.fromCharCode(charCode);

        var tagName = e.target.nodeName.toLowerCase();
        // if (tagName == "input" || tagName == "textarea" || e.shiftKey || e.ctrlKey) {
        if (tagName == "input" || tagName == "textarea" || e.ctrlKey) {
            if (verbose) console.log(LOG_PREFIX, "Ignoring input");
            return;
        }
        if (e.code === 'Enter' && e.ctrlKey) {
        // if (e.code === 'Enter') {
            openFirstVideo();
            return;
        }
        const onlyTop = !e.shiftKey;

        if (verbose) console.log(LOG_PREFIX, "Key press:", character);
        if (character.toUpperCase() == 'A') {
            if (window.location.pathname != "/") {
                var pathArray = window.location.pathname.split('/');
                if (window.location.pathname.endsWith("search")) {
                    // var path = parse_query_string(window.location.search.substring(1))[SEARCH_KEY]
                    var prefix = window.location.search + `&${PREFIX_KEY}=${window.location.pathname}`
                    randomPost(`${window.location.pathname}`, true, prefix, onlyTop);
                } else if (window.location.search.includes(PREFIX_KEY)) {
                    var path = parse_query_string(window.location.search.substring(1))[PREFIX_KEY]
                    randomPost(`${path}`, true, window.location.search, onlyTop);
                } else if (window.location.pathname.includes("user/") && window.location.pathname.includes("m/")) {
                    // 1 to 4
                    var path = pathArray.slice(1,5).join("/")
                    randomPost(`${path}/`, null, `?${PREFIX_KEY}=${window.location.pathname}`, onlyTop);
                } else {
                    randomPost(`r/${pathArray[2]}/`, null, null, onlyTop);
                }
            }
        }
        if (character.toUpperCase() == 'S') {
            randomPost("", null, null, onlyTop);
        }
        if (character.toUpperCase() == 'V') {
            if (window.location.pathname != "/") {
                var pathArray = window.location.pathname.split('/');
                if (window.location.pathname.endsWith("search")) {
                    // var path = parse_query_string(window.location.search.substring(1))[SEARCH_KEY]
                    var prefix = window.location.search + `&${PREFIX_KEY}=${window.location.pathname}`
                    randomPost(`${window.location.pathname}`, filterMedia = true, prefix, onlyTop);
                } else if (window.location.search.includes(PREFIX_KEY)) {
                    var path = parse_query_string(window.location.search.substring(1))[PREFIX_KEY]
                    randomPost(`${path}`, true, window.location.search, onlyTop);
                } else if (window.location.pathname.includes("user/") && window.location.pathname.includes("m/")) {
                    // 1 to 4
                    var path = pathArray.slice(1,5).join("/")
                    randomPost(`${path}/`, true, `?${PREFIX_KEY}=${window.location.pathname}`, onlyTop);
                } else {
                    randomPost(`r/${pathArray[2]}/`, filterMedia = true, undefined, onlyTop);
                }
            }
        }
        if (character.toUpperCase() == 'B') {
            randomPost("", filterMedia = true, undefined, onlyTop);
        }
        if (character.toUpperCase() == 'Q') {
            randomPost("saved/", null, null, onlyTop);
        }
        if (character.toUpperCase() == 'W') {
            randomPost("saved/", filterMedia = true, null, onlyTop);
        }
    };
// }, false);


function parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        var key = decodeURIComponent(pair.shift());
        var value = decodeURIComponent(pair.join("="));
        // If first entry with this name
        if (typeof query_string[key] === "undefined") {
        query_string[key] = value;
        // If second entry with this name
        } else if (typeof query_string[key] === "string") {
        var arr = [query_string[key], value];
        query_string[key] = arr;
        // If third or later entry with this name
        } else {
        query_string[key].push(value);
        }
    }
    return query_string;
}

// https://old.reddit.com/r/javascript/top.json?t=all

// &sort=desc

// &limit=250

function weighted_random(items, weights) {
    var i;

    for (i = 0; i < weights.length; i++)
        weights[i] += weights[i - 1] || 0;
    
    var random = Math.random() * weights[weights.length - 1];
    
    for (i = 0; i < weights.length; i++)
        if (weights[i] > random)
            break;
    
    return items[i];
}


function toggleHentai() {
    console.log("toggleHentai");
    var enableHentai = GM_getValue("enable_hentai");
    if (!enableHentai) {
        console.log("init enableHentai")
        GM_setValue("enable_hentai", true);
        enableHentai = true;
    }
    console.log("enableHentai:", enableHentai)
    // [].forEach.call(
    //     ['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'],
    //     function(event) {
    //         document.addEventListener(event, function(e) { e.stopPropagation(); }, true);
    //     }
    // );
}

function enableCommandMenu() {
    var commandMenu = true;
    try {
        if (typeof(GM_registerMenuCommand) == undefined) {
            return;
        } else {
            if (commandMenu == true ) {

                GM_registerMenuCommand('Toggle Hentai', function() {
                    toggleHentai();
                });
            }
        }
    }
    catch(err) {
        console.log(err);
    }
}

function init() {
    enableCommandMenu();}

init();

// $("body").css("cursor", "default");

// var prefix = "https://old.reddit.com/";
// var sortArray = ["top", "new", "hot", "gilded"];
// var sortType = sortArray[Math.floor(Math.random()*sortArray.length)];
// // var sortArrayWeights = [8, 3, 4, 4];
// // var sortType = weighted_random(sortArray, sortArrayWeights);
// console.log("Sort type:", sortType);
// fetch(`https://old.reddit.com/r/javascript/${sortType}.json?t=all&limit=250`)
//     .then(result => result.json())
//     .then((output) => {
//         console.log('Output: ', output);
//         var posts = output.data.children;
//         posts = posts.filter(function (post) {
//             var postHint = post.data.post_hint || "";
//             var url = post.data.url || post.data.link_url;
//             console.log("Post:", postHint, url, post.data);
//             return postHint.includes("video") || url.includes(".mp4") || url.includes(".gif");
//         });
//         if (posts.length > 0) {
//             var randPost = posts[Math.floor(Math.random()*posts.length)];
//             var randPostLink = prefix + randPost.data.permalink;
//             console.log(randPost, randPostLink);
//         } else {
//             console.log("No media post")
//         }
// }).catch(err => console.error(err));


//https://old.reddit.com/r/javascript/top.json?t=all