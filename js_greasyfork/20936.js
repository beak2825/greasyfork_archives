// ==UserScript==
// @name soup.io: BetterNSFW
// @namespace    http://xcvbnm.org/
// @author Nordern
// @description Makes the NSFW filters toggleable and saves bandwidth
// @version 1.0
// @match http://*.soup.io/*
// @match https://*.soup.io/*
// @exclude     http://www.soup.io/frames/*
// @exclude     http://www.soup.io/remote/*
// @license public domain
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/20936/soupio%3A%20BetterNSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/20936/soupio%3A%20BetterNSFW.meta.js
// ==/UserScript==
// Available on github under: https://github.com/edave64/souplements/blob/master/betterNSFW.js
function betterNSFW () {
/**
 * This code snippet allows you to intercept the loading of new elements and modify the loaded posts.
 * The basic idea is to allow filtering out posts before they are inserted into the dom, and thus before their assets
 * are loaded. This reduces stress on both the client and the asset servers.
 *
 * To use the filter, register the event "processBatch" in SOUP.Endless.
 * Example:
 *
 *     SOUP.Endless.on("processBatch", function (doc) {
 *         // your code here
 *     });
 *
 * The doc argument represents a temporary HTMLDocument node, storing the new loaded posts. You can work with it
 * like you can work with ''document''.
 *
 * Be careful to never remove all posts, otherwise Soup will assume you reached the end.
 *
 * Please keep in mind that soup already has some filters build in: http://faq.soup.io/post/4328678
 * These are probably easier on the servers.
 *
 * Licence: Public domain
 *
 * UPDATE 1.1:
 * The soup event-api was used! I just used it wrong. It is supposed to be a template. The event is now fired on
 * SOUP.Endless instead of SOUP.Events
 *
 * UPDATE 1.2:
 * Also trigger for loaded in reactions
 */
(function () {
    // Add events to SOUP.Endless
    if (!SOUP.Endless.trigger) {
        SOUP.tools.extend(SOUP.Endless, SOUP.Events);
    }

    if (Ajax.Request._EndlessFilter) return;

    var oldRequest = Ajax.Request;

    function getLoadAboveURL() {
        var url = $("endless_top_post").href;
        return url.match(/[&?]newer=1/) ? url : url + (url.indexOf("?") >= 0 ? "&" : "?") + "newer=1";
    }

    function getLoadBelowURL() {
        return SOUP.Endless.next_url.replace(/&?newer=1&?/g, "");
    }

    function catchBatchLoad (path, options) {
        var oldSuccess = options.onSuccess;
        options.onSuccess = function (response) {
            var text = response.responseText,
                pipePosition = text.indexOf("|"),
                nextPath = text.substring(0, pipePosition),
                content = text.substring(pipePosition + 1),
                parser = new DOMParser(),
                xmlDoc = parser.parseFromString(content, "text/html"),
                root = xmlDoc.body;

            root.setAttribute("id", "posts");
            SOUP.Endless.trigger("processBatch", xmlDoc);

            response.responseText = nextPath + "|" + root.innerHTML;

            return oldSuccess.apply(this, arguments);
        };

        return oldRequest.apply(this, arguments);
    }

    function catchPreviewLoad (path, options) {
        var oldSuccess = options.onSuccess;
        options.onSuccess = function (response) {
            var content = response.responseText,
                parser = new DOMParser(),
                xmlDoc = parser.parseFromString(content, "text/html"),
                root = xmlDoc.body;

            root.setAttribute("id", "posts");
            SOUP.Endless.trigger("processBatch", xmlDoc);

            response.responseText = root.innerHTML;

            return oldSuccess.apply(this, arguments);
        };

        return oldRequest.apply(this, arguments);
    }

    Ajax.Request = function (path, options) {
        var aboveURL = getLoadAboveURL();
        var belowURL = getLoadBelowURL();

        if (path === aboveURL || path === belowURL) {
            return catchBatchLoad.apply(this, arguments);
        }
        if (path.startsWith("http://" + document.location.host + "/preview/")) {
            return catchPreviewLoad.apply(this, arguments);
        }
        return oldRequest.apply(this, arguments);
    };
    Ajax.Request._EndlessFilter = true;
    Ajax.Request.Events = oldRequest.Events;
    Ajax.Request.prototype = oldRequest.prototype;
}());
/**
 * Requires endlessFilter
 *
 * This script allows define functions that get called for every post and judge whether it will be kept. It can either
 * remove a post without a trace, or replace it with a toggle that allows to show it anyways.
 *
 * Licence: Public domain
 */
(function () {
    "use strict";

    if (SOUP.Hider) return;

    SOUP.Hider = {
        _filters: {},

        /**
         * Registers a new Filter
         *
         * @param {SOUP.Hider~filterCallback} filterCallback
         * @param {String} filterName
         * @param {Boolean} keepToggle
         */
        registerFilter: function (filterCallback, filterName, keepToggle) {
            if (this._filters[filterName]) return;

            this._filters[filterName] = [filterCallback, keepToggle];
            SOUP.Hider._applyFilterToDoc(document, filterCallback, filterName, keepToggle);
        },

        /**
         * Deactivates a filter with the given name. If it was toggleable, the effects are also reverted.
         *
         * @param {String} filterName
         */
        unregisterFilter: function (filterName) {
            if (this._filters[filterName]) {
                var filter = this._filters[filterName];
                if (filter[1]) {
                    SOUP.Hider._removeFilterFromDoc(document, filterName);
                }
            }
            delete this._filters[filterName];
        },

        /**
         * Applies all registered filters to the given document
         *
         * @param {Document} doc
         */
        applyFilters: function (doc) {
            for (var name in SOUP.Hider._filters) {
                if (!SOUP.Hider._filters.hasOwnProperty(name)) continue;
                var filter = SOUP.Hider._filters[name];
                this._applyFilterToDoc(doc, filter[0], name, filter[1]);
            }
        },

        /**
         * Applies a given filter to a given document.
         *
         * @param {Document} doc
         * @param {SOUP.Hider~filterCallback} filterCallback
         * @param {String} filterName
         * @param {Boolean} keepToggle
         * @private
         */
        _applyFilterToDoc: function (doc, filterCallback, filterName, keepToggle) {
            var posts = doc.querySelectorAll(".post");
            for (var i = 0; i < posts.length; ++i) {
                var post = posts[i];
                var applyFilter = filterCallback(post);
                if (applyFilter) {
                    if (keepToggle) {
                        this._makeCollapseable(post, filterName);
                    } else {
                        this._removePost(post, filterName);
                    }
                }
            }
        },

        /**
         * Removes the effects of a filter from the documents, if possible.
         *
         * @param {Document} doc
         * @param {String} filterName
         * @private
         */
        _removeFilterFromDoc: function (doc, filterName) {
            var posts = doc.querySelectorAll(".post[data-hider-filter=" + filterName + "]");
            for (var i = 0; i < posts.length; ++i) {
                var post = posts[i];
                SOUP.Hider._stopCollapseable(post);
            }
        },

        /**
         * Removes all contents of a given post.
         *
         * @param {Element} post
         * @param {String} filterName
         * @private
         */
        _removePost: function (post, filterName) {
            post.setAttribute("data-hider-filter", filterName);
            var postContent = post.getElementsByClassName("content")[0];
            postContent.innerHTML = "";
            post.style.display = "none";
            post.setAttribute("data-hider-removed", "true");
        },

        /**
         * Makes a given post toggleable.
         *
         * @param {Element} post
         * @param {String} filterName
         * @private
         */
        _makeCollapseable: function (post, filterName) {
            var doc = post.ownerDocument;
            post.setAttribute("data-hider-filter", filterName);
            var postContent = post.getElementsByClassName("content")[0];
            var toggleTarget = "this.parentElement.parentElement";
            if (!postContent) {
                /* Preview posts do not have a content element. So wrap one around it. */
                postContent = doc.createElement("div");
                postContent.classList.add("content");
                while (post.childNodes.length > 0) {
                    postContent.appendChild(post.childNodes[0]);
                }
                post.appendChild(postContent);
                toggleTarget = "this.parentElement";
            }
            var toggle = doc.createElement("div");
            toggle.classList.add("hiderToggle");
            toggle.innerHTML = "<span class='hiderType'>" + filterName + "</span> <span class='hiderText'></span>";
            toggle.setAttribute("onclick", "SOUP.Hider._toggle(" + toggleTarget + ")");
            postContent.parentNode.insertBefore(toggle, postContent);
            SOUP.Hider._collapePost(post);
        },

        /**
         * Makes a given post not toggleable anymore.
         *
         * @param {Element} post
         * @private
         */
        _stopCollapseable: function (post) {
            if (post.getAttribute("data-hider-collapsed") === "true") {
                SOUP.Hider._expandPost(post);
            }
            post.removeAttribute("data-hider-filter");
            /** @type {Element} */
            var toggle = post.getElementsByClassName("hiderToggle")[0];
            toggle.parentNode.removeChild(toggle);
        },

        /**
         * Toggles a given post.
         *
         * @param {Element} post
         * @private
         */
        _toggle: function (post) {
            if (post.getAttribute("data-hider-collapsed") === "true") {
                SOUP.Hider._expandPost(post);
            } else {
                SOUP.Hider._collapePost(post);
            }
        },

        /**
         * Collapses a given post.
         *
         * @param {Element} post
         * @private
         */
        _collapePost: function (post) {
            var doc = post.ownerDocument;
            var postContent = post.getElementsByClassName("content")[0];
            var hiderText = post.getElementsByClassName("hiderText")[0];
            var commentContent = postContent.innerHTML.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            post.appendChild(doc.createComment("content:" + commentContent));
            postContent.innerHTML = "";
            hiderText.innerHTML = "hidden";
            post.setAttribute("data-hider-collapsed", "true");
        },

        /**
         * Expands a given post.
         * 
         * @param {Element} post
         * @private
         */
        _expandPost: function (post) {
            var postContent = post.getElementsByClassName("content")[0];
            var hiderText = post.getElementsByClassName("hiderText")[0];
            var postData;

            for (var i = post.childNodes.length - 1; i >= 0; --i) {
                var node = post.childNodes[i];
                if (node.nodeType === Node.COMMENT_NODE && node.textContent.startsWith("content:")) {
                    postData = node;
                    break;
                }
            }

            if (!postData) return;

            var commentContent = postData.textContent.substring(8).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
            post.removeChild(postData);
            postContent.innerHTML = commentContent;
            hiderText.innerHTML = "shown";
            post.setAttribute("data-hider-collapsed", "false");
        }

        /**
         * A filter callback
         * @callback SOUP.Hider~filterCallback
         * @param {Element} post element
         * @returns {Boolean}
         */
    };

    var style = document.createElement("style");
    style.innerHTML = ".hiderToggle { background: transparent url('/skins/default/black30.png') repeat scroll 0 0;padding:2px;text-align:center}";
    document.head.appendChild(style);

    SOUP.Endless.on("processBatch", function (doc) {
        SOUP.Hider.applyFilters(doc);
    });
}());
/**
 * Requires hider
 *
 * Replaces the usual soup NSFW filters with one based on the hider script. This not only means that you can toggle
 * individual posts to be visible again, but also saves bandwidth by commenting the post content out, not just setting
 * them to not visible.
 */
(function () {
    if (SOUP.BetterNSFW) return;
    SOUP.BetterNSFW = true;

    function importFilters () {
        var map = SOUP.Public.haider_map.slice(0);
        for (var i = 0; i < map.length; ++i) {
            SOUP.Public.showPostsWithSelector(map[i]);
            addFilter(map[i]);
        }
    }

    function removeFilter (selector) {
        if (selector === "#posts .post.f_nsfw") {
            SOUP.Hider.unregisterFilter("NSFW");
        } else {
            SOUP.Hider.unregisterFilter(selector);
        }
    }

    function addFilter (selector) {
        if (selector === "#posts .post.f_nsfw") {
            SOUP.Hider.registerFilter(function (post) {
                return post.matches(selector);
            }, "NSFW", true);
        } else {
            SOUP.Hider.registerFilter(function (post) {
                return post.matches(selector);
            }, selector, false);
        }
    }

    importFilters();

    SOUP.Public.showPostsWithSelector = removeFilter;
    SOUP.Public.hidePostsWithSelector = addFilter;
}());
}

var script = document.createElement("script");
script.innerHTML = betterNSFW.toString() + ";betterNSFW()";
document.body.appendChild(script);