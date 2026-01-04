// ==UserScript==
// @name        8chan-buffs
// @namespace   Violentmonkey Scripts
// @match       https://8chan.se/*/res/*.html
// @match       https://8chan.moe/*/res/*.html
// @grant       none
// @version     1.3
// @author      doomkek
// @license MIT 
// @description Collection of schizo-scripts and imrovements
// @downloadURL https://update.greasyfork.org/scripts/533136/8chan-buffs.user.js
// @updateURL https://update.greasyfork.org/scripts/533136/8chan-buffs.meta.js
// ==/UserScript==

(function () {
    var uidsPostCount = {};

    const config = {
        video: {
            VOLUME: 0.3,
            MUTED: false,
        },
        unreadLine: {},
        saveConfig: function () { localStorage.setItem("8chan-buffs", JSON.stringify(config)); },
        loadConfig: () => {
            var conf = JSON.parse(localStorage.getItem("8chan-buffs"))

            if (!conf)
                return;

            for (const key in config) {
                if (conf.hasOwnProperty(key)) {
                    config[key] = conf[key];
                }
            }

        },
    };

    const utils = {
        appendStyle: function (style) {
            var s = document.createElement("style");
            s.appendChild(document.createTextNode(style));
            document.body.appendChild(s);
        }
    };

    const css = `
        .uploadCell > details[open]
        .downloadFileButton::before {
            content: "\\e04E";
        }

        .downloadFileButton {
            pointer-events: all;
        }
    `;

    config.loadConfig();

    var volume = config.video.VOLUME;
    var muted = config.video.MUTED;

    var videos = document.querySelectorAll("video");

    for (let i = 0; i < videos.length; i++) {
        let v = videos[i];
        var postId = v.closest(".postCell, .opCell").id;
        v.volume = volume;
        v.muted = muted;

        var imgLink = document.getElementById(postId).querySelector(".imgLink");

        new MutationObserver(mutations => {
            for (var mutation of mutations) {
                if (mutation.attributeName === "style") {
                    var display = getComputedStyle(v).display;
                    if (display == "inline") {
                        v.volume = volume;
                        v.muted = muted;
                    }
                }
            }
        }).observe(v, {
            attributes: true,
            attributeFilter: ["style"]
        });

        var timeoutRunning = false;
        v.addEventListener("volumechange", (e) => {
            volume = e.target.volume;
            muted = e.target.muted;

            if (!timeoutRunning) {
                timeoutRunning = true;
                setTimeout(() => {
                    config.video.VOLUME = volume;
                    config.video.MUTED = muted;
                    config.saveConfig();
                    timeoutRunning = false;
                }, 1000);
            }
        });

        imgLink.addEventListener("click", (e) => {
            v.volume = volume;
            v.muted = muted;
        });
    }

    function newPostsHandler(newPosts) {
        for (let i = 0; i < newPosts.length; i++) {
            var post = document.getElementById(newPosts[i]);
            var postUid = post.querySelector(".labelId").textContent;
            if (uidsPostCount.hasOwnProperty(postUid)) {
                uidsPostCount[postUid]++;
                //if (uidsPostCount[postUid] > 1) // restore opacity for this uid
            } else { // 1ptbid can do something here
                uidsPostCount[postUid] = 1;
            }

            if (focusOnId)
                post.style.display = "none";
        }
    }

    setTimeout(() => {
        initThread();
        utils.appendStyle(css);
    }, 500);

    function throttle(fn, limit) {
        let inThrottle = false;

        return function (...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    var threadId = `${thread.refreshParameters.boardUri}/${thread.refreshParameters.threadId}`;

    function initThread() {
        var posts = document.querySelectorAll(".postCell");
        for (let i = 0; i < posts.length; i++) {
            var post = posts[i];

            // init UIDS
            var postUid = post.querySelector(".labelId").textContent.substr(0, 6);
            if (uidsPostCount.hasOwnProperty(postUid))
                uidsPostCount[postUid]++;
            else
                uidsPostCount[postUid] = 1;
        }
    }

    var focusOnId = false;
    document.addEventListener("click", (e) => {
        if (e.target.tagName == "SPAN" && e.target.classList && e.target.classList.contains("labelId")) {
            var posts = document.querySelectorAll(".postCell");
            focusOnId = !focusOnId;

            var targetLbl = e.target.textContent.substr(0, 6);

            for (let i = 0; i < posts.length; i++) {
                var post = posts[i];

                if (focusOnId) {
                    var postLbl = post.querySelector(".labelId").textContent.substr(0, 6);
                    if (postLbl != targetLbl) {
                        post.style.display = "none";
                    }
                } else {
                    if (!post.querySelector(".hidden"))
                        post.style.display = "block";

                    e.target.scrollIntoView({ behavior: "instant", block: "center" });
                }

                if (post.querySelector(".markedPost"))
                    post.querySelector(".markedPost").classList.toggle("markedPost");
            }

            if (focusOnId)
                e.target.closest(".innerPost").classList.toggle("markedPost");
        }
    });

    var targetNode = document.getElementsByClassName("divPosts")[0];
    new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                if (mutation.addedNodes.length > 0) {
                    var newPosts = [];
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        var addedNode = mutation.addedNodes[i];

                        if (!addedNode.classList || !addedNode.classList.contains("postCell"))
                            continue;

                        newPosts.push(addedNode.id);
                    }

                    if (newPosts.length > 0)
                        newPostsHandler(newPosts);
                }
            }
        }
    }).observe(targetNode, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });
})();