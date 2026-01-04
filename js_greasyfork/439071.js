// ==UserScript==
// @name        Reddit Chemo
// @namespace   https://lawrenzo.com/p/reddit-chemo
// @version     2.2.0
// @description Filter, block, and remove unwanted subreddit posts of your choosing and remove ads on the Reddit feed.
// @author      Lawrence Sim
// @license     WTFPL (http://www.wtfpl.net)
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @match       *://*.reddit.com/*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/439071/Reddit%20Chemo.user.js
// @updateURL https://update.greasyfork.org/scripts/439071/Reddit%20Chemo.meta.js
// ==/UserScript==
(function() {
    //-------------------------------------------------------------------------------------
    // Prepare styles
    //-------------------------------------------------------------------------------------
    let styles = {
        ".rchemo-post": {
            background:        "rgb(255 240 240)"
        },
        ".rchemo-dark .rchemo-post": {
            background:        "rgb(80 70 70)"
        },
        ".rchemo-post.rchemo-card": {
            height:            "2em"
        },
        ".rchemo-post div[data-click-id='background']": {
            background:        "none !important",
            color:             "rgb(163 149 149)",
            'font-size':       "0.7em",
            height:            "1.6em",
            'line-height':     "1.7em"
        },
        ".rchemo-post.rchemo-classic div[data-click-id='background']": {
            padding:           "0.1em 0 0.15em 0.7em"
        },
        ".rchemo-post.rchemo-compact div[data-click-id='background']": {
            padding:           "0",
            "font-size":       "0.6em"
        },
        ".rchemo-post.rchemo-card div[data-click-id='background']": {
            'border-left':     "none",
            padding:           "0.2em 0.4em",
            "font-size":       "0.95em"
        },
        ".rchemo-post button[data-click-id='downvote'] .icon": {
            top:               "2px",
            left:              "2px",
            'line-height':     "14px",
            'font-size':       "14px"
        },
        ".rchemo-post.rchemo-classic .voteButton, .rchemo-post.rchemo-classic .voteButton span": {
            width:             "46px"
        },
        ".rchemo-post.rchemo-card button[data-click-id='downvote'] .icon": {
            top:               "8px",
            left:              "2px",
            'line-height':     "20px",
            'font-size':       "20px"
        },
        ".rchemo-post.rchemo-card .voteButton, .rchemo-post.rchemo-card .voteButton span": {
            width:             "46px",
            height:            "36px"
        },
        ".rchemo-unban": {
            margin:            "0",
            'margin-left':     "0.6em",
            padding:           "0.1em 0.4em",
            background:        "rgb(135 158 200)",
            'border-radius':   "2px",
            color:             "#fff",
            'line-height':     "normal"
        },
        ".rchemo-dark .rchemo-unban": {
            background:        "rgb(145 125 125)",
            color:             "#000"
        },
        ".rchemo-post.rchemo-compact .rchemo-unban": {
            padding:           "0 0.4em",
            'line-height':     "1.2em"
        },
        ".rchemo-post.rchemo-card .rchemo-unban": {
            'font-size':      "0.85em"
        },
        ".rchemo-unban:hover": {
            background:        "rgb(185 200 220)"
        },
        ".rchemo-dark .rchemo-unban:hover": {
            background:        "rgb(205 180 180)"
        },
        ".rchemo-join, .rchemo-ban": {
            'border-radius':   "0.9em"
        },
        ".rchemo-classic .rchemo-join, .rchemo-compact .rchemo-join": {
            'min-height':      "auto",
            padding:           "0.3em 0.6em",
            'line-height':     "0.8em",
            'font-size':       "0.7em"
        },
        ".rchemo-ban": {
            margin:            "0 0.2em 0 0.4em",
            background:        "rgb(120 45 45)",
            padding:           "0.34em 1.2em",
            color:             "#fff",
            'line-height':     "1.2em",
            'font-size':       "1.06em"
        },
        ".rchemo-ban:hover": {
            background:      "rgb(180 85 85)"
        },
        ".rchemo-classic .rchemo-ban, .rchemo-compact .rchemo-ban": {
            padding:           "0.2em 0.6em",
            'line-height':     "0.8em",
            'font-size':       "0.75em"
        },
        ".rchemo-compact .rchemo-ban": {
            'font-size':       "0.85em"
        },
        ".rchemo-counter": {
            position:          "fixed",
            top:               "60px",
            right:             "25px",
            width:             "120px",
            "z-index":         "70",
            background:        "rgb(255 240 240)",
            border:            "1px solid rgb(123, 106, 109)",
            "border-radius":   "0.2em",
            padding:           "0.2em 0.4em",
            "text-align":      "center",
            "font-size":       "0.75em",
            color:             "#333"
        },
        ".rchemo-dark .rchemo-counter": {
            background:        "rgb(80 70 70)",
            border:            "1px solid rgb(123, 106, 109)",
            color:             "#ddd"
        },
        ".rchemo-counter-content": {
            "margin-top":      "0.4em",
            display:           "none"
        },
        ".rchemo-counter:hover > .rchemo-counter-content": {
            display:           "block"
        },
        ".rchemo-counter p": {
            padding:           "0",
            margin:            "0"
        },
        ".rchemo-counter button": {
            "margin-bottom":   "0.2em"
        },
        ".rchemo-btn-showhide, .rchemo-btn-editlist": {
            "margin-top":      "0.2em",
            "text-decoration": "underline",
            color:             "rgb(77, 113, 68)"
        },
        ".rchemo-dark .rchemo-btn-showhide, .rchemo-dark .rchemo-btn-editlist": {
            color:             "rgb(182, 198, 178)"
        },
        ".rchemo-btn-showhide:hover, .rchemo-btn-editlist:hover": {
            color:             "rgb(141, 187, 128) !important"
        },
        ".rchemo-btn-darkmode": {
            "margin-top":      "0.2em",
            background:        "rgb(135, 158, 200)",
            color:             "#eee",
            padding:           "0.2em 0.5em",
            "border-radius":   "0.6em",
            "border":          "1px solid #888"
        },
        ".rchemo-btn-darkmode:hover": {
            "border-color":    "#444"
        },
        ".rchemo-dark .rchemo-btn-darkmode": {
            background:        "rgb(0 0 0)",
            color:             "#aaa"
        },
        ".rchemo-dark .rchemo-btn-darkmode:hover": {
            "border-color":    "#fff"
        },
        ".rchemo-btn-support": {
            "text-decoration": "underline",
            "font-size":       "0.85em",
            color:             "rgb(90, 108, 140)"
        },
        ".rchemo-btn-support:hover": {
            color:             "rgb(135, 158, 200)"
        },
        ".rchemo-dark .rchemo-btn-support": {
            color:             "rgb(135, 158, 200)"
        },
        ".rchemo-dark .rchemo-btn-support:hover": {
            color:             "rgb(208, 225, 255)"
        },
        ".rchemo-edit-container": {
            position:          "fixed",
            top:               "50%",
            left:              "50%",
            transform:         "translate(-50%,-50%)",
            "z-index":         "90",
            width:             "240px",
            background:        "rgb(255 240 240)",
            'border-radius':   "0.2em",
            border:            "1px solid rgb(123, 106, 109)",
            padding:           "0.2em 0",
            "font-size":       "0.9em",
            color:             "#333",
            'user-select':     "none",
            cursor:            "default"
        },
        ".rchemo-dark .rchemo-edit-container": {
            background:        "rgb(80 70 70)",
            border:            "1px solid rgb(123, 106, 109)",
            color:             "#ddd"
        },
        ".rchemo-edit-container p": {
            padding:           "0 0.2em"
        },
        ".rchemo-edit-container ul": {
            height:            "240px",
            width:             "100%",
            'overflow-y':      "scroll",
            'overflow-x':      "hidden",
            background:        "#fff",
            'border-top':      "1px solid #333",
            'border-bottom':   "1px solid #333",
            "box-sizing":      "border-box",
            "list-style":      "none"
        },
        ".rchemo-dark  .rchemo-edit-container ul": {
            background:        "#222",
            'font-size':       "0.95em",
            padding:           "0 0.2em",
            'user-select':     "none",
            'border-color':    "#bbb"
        },
        ".rchemo-edit-container li": {
            position:          "relative",
            cursor:            "pointer",
            padding:           "0.2em",
            'padding-left':    "1.2em",
            cursor:            "pointer"
        },
        ".rchemo-dark .rchemo-edit-container li:hover": {
            background:        "rgb(36, 43, 49)"
        },
        ".rchemo-edit-container li:hover": {
            background:        "rgb(238, 246, 253)"
        },
        ".rchemo-edit-container li.checked": {
            background:        "rgb(200, 223, 244)"
        },
        ".rchemo-dark .rchemo-edit-container li.checked": {
            background:        "rgb(79, 91, 102)"
        },
        ".rchemo-edit-container li.checked::before": {
            position:          "absolute",
            left:              "0.2em",
            content:           "'\\2713'",
            color:             "rgb(43, 151, 20)"
        },
        ".rchemo-dark .rchemo-edit-container li.checked::before": {
            color:             "rgb(129, 238, 106)"
        },
        ".rchemo-edit-buttons": {
            'text-align':      "right",
            margin:            "0.4em 0 0.2em 0",
            'padding-right':   "0.5em"
        },
        ".rchemo-edit-cancel, .rchemo-edit-submit": {
            color:             "#eee",
            padding:           "0.2em 0.5em",
            "border-radius":   "0.1em",
            'font-size':       "0.9em"
        },
        ".rchemo-edit-cancel": {
            background:        "rgb(135, 135, 135)"
        },
        ".rchemo-edit-cancel:hover": {
            background:        "rgb(90, 90, 90)"
        },
        ".rchemo-edit-submit": {
            background:        "rgb(135, 158, 200)",
            "margin-left":     "0.6em",
        },
        ".rchemo-edit-submit:hover": {
            background:        "rgb(67, 104, 170)"
        }
    };
    let styletxt = "";
    for(let selector in styles) {
        styletxt += `${selector} {`;
        for(let skey in styles[selector]) {
            styletxt += `${skey}: ${styles[selector][skey]};`;
        }
        styletxt += "}";
    }
    let styleElem = document.createElement('style');
    styleElem.className = 'rchemo-styles';
    styleElem.innerText = styletxt;
    document.body.appendChild(styleElem);
    var cssRules = Array.from(document.styleSheets[document.styleSheets.length-1].cssRules);
    //-------------------------------------------------------------------------------------
    // handlers for banned list
    //-------------------------------------------------------------------------------------
    GM_getValue = GM_getValue || GM.getValue;
    GM_setValue = GM_setValue || GM.setValue;
    var banSubreddits = refreshBanned();
    function refreshBanned() {
        banSubreddits = (
            (GM_getValue("banned") && GM_getValue("banned").split("|"))
            || window.bannedSubreddits
            || (unsafeWindow && unsafeWindow.bannedSubreddits)
            || []
        );
        banSubreddits = banSubreddits.map(n => n.trim().toLowerCase())
                                     .map(n => n.startsWith("r/") ? n : `r/${n}`);
        banSubreddits.sort();
        return banSubreddits;
    }
    function addBanned(subreddit) {
        banSubreddits.push(subreddit.trim().toLowerCase().startsWith("r/") ? subreddit : `r/${subreddit}`);
        banSubreddits.sort();
        GM_setValue("banned", banSubreddits.join("|"));
    }
    function removeBanned(subreddit) {
        subreddit = subreddit.startsWith("r/") ? subreddit : `r/${subreddit}`;
        let index = banSubreddits.indexOf(subreddit);
        if(~index) {
            banSubreddits.splice(index, 1);
            GM_setValue("banned", banSubreddits.join("|"));
        }
    }
    //-------------------------------------------------------------------------------------
    // control element and options
    //-------------------------------------------------------------------------------------
    var controlElem = document.createElement('div');
    controlElem.className = 'rchemo-counter';
    controlElem.innerHTML = (
        "<p style='font-weight:bold'>Reddit Chemo</p>" +
        "<div class='rchemo-counter-content'>" +
          "<p>Posts blocked: <span class='rchemo-count'>0</span></p>" +
          "<p>Ads blocked: <span class='rchemo-adcount'>0</span></p>" +
          "<button class='rchemo-btn-showhide'></button>" +
          "<button class='rchemo-btn-editlist'>Edit banned list</button>" +
          "<button class='rchemo-btn-darkmode'>light mode</button>" +
          "<a href=\"https://ko-fi.com/F1F25YGLA\" rel=\"nofollow\" target=\"blank\"><button class='rchemo-btn-support'>Buy me a coffee</button></a>" +
        "</div>"
    );
    document.body.appendChild(controlElem);
    function showControl() { controlElem.style.display = ""; }
    function hideControl() { controlElem.style.display = "none"; }

    var countElem = controlElem.querySelector(".rchemo-count"),
        adCountElem = controlElem.querySelector(".rchemo-adcount"),
        adblockCount = 0,
        blockCount = 0;
    function resetCount() { countElem.innerHTML = blockCount = adblockCount = 0; }
    function incrementCount() { countElem.innerHTML = ++blockCount; }
    function incrementAdCount() { adCountElem.innerHTML = ++adblockCount; }

    var showHideBtn = controlElem.querySelector(".rchemo-btn-showhide"),
        postCssRule = cssRules.filter(r => r.selectorText == ".rchemo-post")[0],
        showBanned  = GM_getValue("showbanned");
    if(showBanned === null || typeof showBanned === "undefined") showBanned = true;
    function setShowBanned(visible) {
        showBanned = !!visible;
        GM_setValue("showbanned", showBanned);
        showHideBtn.innerHTML = (showBanned ? "Hide" : "Show") + " blocked posts";
        postCssRule.style.display = showBanned ? "" : "none";
    };
    setShowBanned(showBanned);
    showHideBtn.addEventListener('click', () => setShowBanned(!showBanned));

    var darkBtn = controlElem.querySelector(".rchemo-btn-darkmode"),
        darkmode = GM_getValue("darkmode");
    function setDarkMode(darkOn) {
        darkmode = !!darkOn;
        GM_setValue("darkmode", darkOn);
        if(darkmode) {
            document.body.classList.add("rchemo-dark");
            darkBtn.innerHTML = "dark mode";
        } else {
            document.body.classList.remove("rchemo-dark");
            darkBtn.innerHTML = "light mode";
        }
    }
    setDarkMode(darkmode);
    darkBtn.addEventListener('click', () => setDarkMode(!darkmode));
    //-------------------------------------------------------------------------------------
    // editing the list
    //-------------------------------------------------------------------------------------
    var editBtn = controlElem.querySelector(".rchemo-btn-editlist");
    editBtn.addEventListener('click', evt => {
        evt.stopPropagation();
        openEditor();
    });
    var editWindow = null;
    function closeEditor(unbanList) {
        if(editWindow) {
            editWindow.remove();
            editWindow = null;
        }
        if(!unbanList || !unbanList.length) return;
        unbanList.forEach(subreddit => removeBanned(subreddit));
    }
    function openEditor() {
        if(editWindow) closeEditor();
        editWindow = document.createElement('div');
        editWindow.className = 'rchemo-edit-container';
        editWindow.innerHTML = (
            "<p style='font-weight:bold'>Reddit Chemo (Ban List)</p>" +
            "<p style='margin:0.4em 0;font-size:0.9em;'>Select/highlight subreddits to remove from the ban list below. (A refresh will be required to show previously hidden posts.)</p>" +
            "<ul class='rchemo-edit-list'></ul>" +
            "<div class='rchemo-edit-buttons'>" +
              "<button class='rchemo-edit-cancel'>Cancel</button>" +
              "<button class='rchemo-edit-submit'>Apply</button>" +
            "</div>"
        );
        var listElem = editWindow.querySelector(".rchemo-edit-list"),
            unban = [];
        banSubreddits.forEach(subreddit => {
            let listSubreddit = document.createElement("li");
            listSubreddit.innerHTML = subreddit;
            listSubreddit.addEventListener('click', () => {
                let ubindex = unban.indexOf(subreddit);
                if(~ubindex) {
                    unban.splice(ubindex, 1);
                    listSubreddit.classList.remove("checked");
                } else {
                    unban.push(subreddit);
                    listSubreddit.classList.add("checked");
                }
            });
            listElem.append(listSubreddit);
        });
        editWindow.querySelector(".rchemo-edit-cancel").addEventListener('click', closeEditor);
        editWindow.querySelector(".rchemo-edit-submit").addEventListener('click', () => closeEditor(unban));
        document.body.appendChild(editWindow);
    }
    document.body.addEventListener('click', evt => {
        if(!editWindow) return;
        if(!editWindow.contains(evt.target)) closeEditor();
    });
    //-------------------------------------------------------------------------------------
    // block post function
    //-------------------------------------------------------------------------------------
    function blockPost(post, sub, mode) {
        post.classList.add("rchemo-post");
        if(mode == 'compact') post = post.children[0];
        let child, voteElem, subelm, icon;
        Array.from(post.children).forEach(child => {
            if(child.getAttribute("data-click-id") === "background") {
                child.innerHTML = `Post from ${sub} removed`;
                let rmvBtn = document.createElement("button");
                rmvBtn.innerHTML = `Remove ban`;
                rmvBtn.classList.add("rchemo-unban");
                rmvBtn.addEventListener('click', function() {
                    this.parentNode.innerHTML = `Post from ${sub} removed from banned list (refresh for reload)`;
                    this.remove();
                    removeBanned(sub);
                });
                child.append(rmvBtn);
                return;
            }
            let downvote = child.querySelectorAll("#vote-arrows-"+post.id + " button[data-click-id='downvote']");
            if(downvote && downvote.length) {
                child.style.top = "-0.7em";
                for(let j = 0; j < downvote.length; ++j) {
                    let voteElem = downvote[j].parentNode;
                    voteElem.style.margin = 0;
                    voteElem.style.padding = 0;
                    voteElem.parentNode.style.border = "none";
                    voteElem.innerHTML = "";
                    voteElem.append(downvote[j]);
                }
                return;
            }
            child.remove()
        });
        incrementCount();
    }
    //-------------------------------------------------------------------------------------
    // watchers as React will sometimes restore/readd posts
    //-------------------------------------------------------------------------------------
    var emptyObserver = new MutationObserver(mutated => {
        mutated.forEach(mutant => {
            if(mutant.target.children.length) {
                mutant.target.innerHTML = "";
                mutant.target.style.border = "none";
                mutant.target.style.fill = "none";
            }
        });
    });
    var blockObserver = new MutationObserver(mutated => {
        mutated.forEach(mutant => {
            if(mutant.target.children.length) {
                let post = mutant.target.closest("div[data-testid='post-container']");
                blockPost(post, post.getAttribute("chemo"));
            }
        });
    });
    function refreshObservers() {
        emptyObserver.disconnect();
        blockObserver.disconnect();
    };
    //-------------------------------------------------------------------------------------
    // resolvers for when post data is not yet loaded
    //-------------------------------------------------------------------------------------
    function watchPost(post) {
        (new MutationObserver((mutated, observer) => {
            if(checkAd(post)) return observer.disconnect();
            let subreddit = getSubredditNode(post);
            if(checkBanned(post, subreddit)) return observer.disconnect();
        })).observe(post, {childList:true, subtree:true});
    }
    function watchSubreddit(post, subreddit) {
        (new MutationObserver((mutated, observer) => {
            if(checkBanned(post, subreddit)) observer.disconnect();
        })).observe(subreddit, {childList:true, attributes:true});
    }
    //-------------------------------------------------------------------------------------
    // process/check post functions
    //-------------------------------------------------------------------------------------
    function checkAd(post) {
        if(
            Array.from(post.querySelectorAll("span"))
                 .find(span => span.innerText && span.innerText.toLowerCase() === "promoted")
        ) {
            post.innerHTML = "";
            post.style.border = "none";
            post.style.fill = "none";
            console.log("Ad removed.");
            emptyObserver.observe(post, {childList:true});
            incrementAdCount();
            return 1;
        }
        return 0;
    }
    function checkBanned(post, subreddit) {
        let mode = 'classic';
        if(post.children.length === 1) {
            mode = 'compact';
            post.classList.add("rchemo-compact");
        } else if(post.querySelectorAll("a[data-click-id='subreddit']").length > 1) {
            mode = 'card';
            post.classList.add("rchemo-card");
        } else {
            post.classList.add("rchemo-classic");
        }
        if(subreddit && subreddit.innerText) {
            let subname = subreddit.innerText.toLowerCase();
            if(~banSubreddits.indexOf(subname)) {
                post.setAttribute("chemo", subreddit.innerText);
                blockPost(post, subname, mode);
                console.log(`Banned subreddit (${subname}) post removed.`);
                blockObserver.observe(
                    post.querySelector("div[data-click-id='background']"),
                    {childList:true}
                );
                return 1;
            }
            let addBtn = document.createElement("button");
            addBtn.innerHTML = `Ban`;
            addBtn.classList.add("rchemo-ban");
            addBtn.addEventListener('click', function() {
                this.remove();
                addBanned(subname);
                blockPost(post, subname, mode);
            });
            let subscribeBtn = post.querySelector("#subscribe-button-"+post.id);
            if(subscribeBtn) {
                subscribeBtn.after(addBtn);
                subscribeBtn.classList.add("rchemo-join");
            } else if(mode == 'compact') {
                subreddit.after(addBtn);
            }
            return -1;
        }
        return 0;
    }
    function getSubredditNode(post) {
        let subreddit = post.querySelectorAll("a[data-click-id='subreddit']");
        if(!subreddit || !subreddit.length) return null;
        for(let i = 0; i < subreddit.length; ++i) {
            // card layout has two subreddit click elements, one with icon/image
            if(!subreddit[i].children.length) return subreddit[i];
        }
    }
    function processNodes(nodes, refresh) {
        if(!nodes || !nodes.length) {
            if(refresh) hideControl();
            return;
        }
        let found = 0;
        nodes.forEach(node => {
            if(!node || !node.querySelectorAll) return;
            node.querySelectorAll("div[data-testid='post-container']").forEach(post => {
                ++found;
                if(post.getAttribute("chemo")) return;
                post.setAttribute("chemo", 1);
                if(checkAd(post)) return;
                let subreddit = getSubredditNode(post);
                if(!subreddit) return watchPost(post);
                if(!checkBanned(post, subreddit)) watchSubreddit(post, subreddit);
            });
        });
        if(refresh) {
            found > 1 ? showControl() : hideControl();
        }
    }
    //-------------------------------------------------------------------------------------
    // init
    //-------------------------------------------------------------------------------------
    processNodes([document.querySelector(".ListingLayout-outerContainer")], true);
    //-------------------------------------------------------------------------------------
    // if Reddit Watcher available, use it for update/change hooks
    //-------------------------------------------------------------------------------------
    let redditWatcher = window.redditWatcher || (unsafeWindow && unsafeWindow.redditWatcher);
    if(redditWatcher) {
        redditWatcher.feed.onChange(feed => {
            resetCount();
            refreshObservers();
            processNodes([feed], true);
        });
        redditWatcher.feed.onUpdate((feed, mutated) => {
            mutated && mutated.forEach(mutant => processNodes(mutant.addedNodes));
        });
        return;
    }
    //-------------------------------------------------------------------------------------
    // otherwise manually create watcher
    //-------------------------------------------------------------------------------------
    function getFeedWrapper() {
        let listingLayout = document.querySelector(".ListingLayout-outerContainer"),
            firstPost     = listingLayout && listingLayout.querySelector("div[data-testid='post-container']"),
            feedWrapper   = firstPost && firstPost.parentNode;
        while(feedWrapper && !feedWrapper.nextSibling) {
            if(feedWrapper == listingLayout) return null;
            feedWrapper = feedWrapper.parentNode || null;
        }
        return feedWrapper && feedWrapper.parentNode;
    }
    var feedWatcher = new MutationObserver(mutated => mutated.forEach(mutant => processNodes(mutant.addedNodes))),
        lastFeedWrapper = null;
    (new MutationObserver(() => {
        let feedWrapper = getFeedWrapper();
        if(feedWrapper !== lastFeedWrapper) {
            resetCount();
            refreshObservers();
            feedWatcher.disconnect();
            if(feedWrapper) {
                processNodes([feedWrapper], true);
                feedWatcher.observe(feedWrapper, {childList:true});
                lastFeedWrapper = feedWrapper;
            }
        }
    })).observe(document.body, {childList:true, subtree:true});
})();
