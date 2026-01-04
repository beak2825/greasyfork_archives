// ==UserScript==
// @name         Reddit Watcher
// @namespace    https://lawrenzo.com/p/reddit-watcher
// @description  Consolidated mutation observer handler for use by other reddit userscripts. By itself doesn't do much, but other scripts and use hooks to avoid redundant observers on the same thing.
// @version      1.3.2
// @author       Lawrence Sim
// @license      WTFPL (http://www.wtfpl.net)
// @grant        unsafeWindow
// @match        *://*.reddit.com/*
// @downloadURL https://update.greasyfork.org/scripts/441177/Reddit%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/441177/Reddit%20Watcher.meta.js
// ==/UserScript==
(function() {
    if(unsafeWindow && !unsafeWindow.redditWatcher) {
        var debug = false;
        function watcherAbstract(funcs, opts, name) {
            if(typeof funcs === "function") funcs = {get: funcs};
            return {
                name: name || "unnamed",
                defaultOpts: opts || {childList:true},
                hooks: {
                    update: [],
                    change: []
                },
                onUpdate: function(task) {
                    this.hooks.update.push(task);
                },
                update: function(mutated) {
                    if(debug) console.log(this.name + " updated");
                    this.hooks.update.forEach(task => task(this.watching, mutated));
                },
                onChange: function(task) {
                    this.hooks.change.push(task);
                },
                changed: function() {
                    if(debug) console.log(this.name + " changed");
                    this.hooks.change.forEach(task => task(this.watching));
                },
                un: function(func) {
                    let index = this.hooks.update.indexOf(func);
                    while(~index) {
                        this.hooks.update = this.hooks.splice(index, 1);
                        index = this.hooks.update.indexOf(func);
                    }
                    index = this.hooks.change.indexOf(func);
                    while(~index) {
                        this.hooks.change = this.change.splice(index, 1);
                        index = this.hooks.change.indexOf(func);
                    }
                },
                watching: null,
                watcher: null,
                get: funcs.get,
                reset: function() {
                    if(debug) console.log(this.name + " reset");
                    if(!this.watcher) {
                        this.watcher = new MutationObserver(this.update.bind(this));
                    } else {
                        this.watcher.disconnect();
                    }
                    this.update();
                    this.observe(this.watching, this.defaultOpts);
                },
                observe: function(elem, opts) {
                    if(this.watcher) this.watcher.observe(elem, opts);
                },
                wasChanged: funcs.changed,
                check: function() {
                    if(debug) console.log("checking " + this.name);
                    if(!this.watching || !document.body.contains(this.watching)) {
                        let requery = this.get();
                        if(requery && requery !== this.watching) {
                            this.watching = requery;
                            this.changed();
                            this.reset();
                            return true;
                        }
                    }
                    if(this.wasChanged && this.wasChanged(this.watching)) {
                        this.changed();
                        return true;
                    }
                }
            };
        }
        var lastFeed = null,
            lastFirstPost = null;
        var feedWatcher = watcherAbstract(
            {
                get: function() {
                    let listing = document.querySelector(".ListingLayout-outerContainer"),
                        posts = listing.querySelectorAll("div[data-testid='post-container']"),
                        feed = posts && posts.length > 1 && posts[0].parentNode;
                    while(feed && !feed.nextSibling) {
                        if(feed == listing) return null;
                        feed = feed.parentNode || null;
                    }
                    return feed && feed.parentNode;
                },
                changed: function(feed) {
                    if(lastFeed && lastFeed != feed) {
                        lastFeed = feed;
                        return false;
                    }
                    if(!lastFeed) lastFeed = feed;
                    let firstPost = lastFeed && lastFeed.querySelector("div[data-testid='post-container']");
                    if(firstPost !== lastFirstPost) {
                        lastFirstPost = firstPost;
                        return true;
                    }
                }
            },
            {childList:true},
            "feed"
        );
        var listingWatcher = watcherAbstract(
            {get: () => document.querySelector(".ListingLayout-outerContainer")},
            {childList:true, subtree:true},
            "listing"
        );
        var bodyWatcher = watcherAbstract(
            {get: () => document.body},
            {childList:true},
            "body"
        );
        listingWatcher.onChange(() => feedWatcher.check());
        listingWatcher.onUpdate(() => feedWatcher.check());
        listingWatcher.check();
        var wasInFeed = !!listingWatcher.watching;
        bodyWatcher.onUpdate(body => {
            if(body.querySelectorAll(".ListingLayout-outerContainer div[data-testid='post-container']").length > 1) {
                wasInFeed ? listingWatcher.check() : listingWatcher.reset();
                wasInFeed = true;
            } else {
                if(wasInFeed) listingWatcher.watcher && listingWatcher.watcher.disconnect();
                wasInFeed = false;
            }
        });
        bodyWatcher.check();
        unsafeWindow.redditWatcher = {
            body:    bodyWatcher,
            listing: listingWatcher,
            feed:    feedWatcher,
            update:  function() { this.body.update(); }
        };
    }
})();