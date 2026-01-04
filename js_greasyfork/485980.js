// ==UserScript==
// @name        4chan-IDficator
// @namespace   Violentmonkey Scripts
// @match       *://boards.4chan.org/*
// @grant       none
// @version     0.51
// @author      Doomkek
// @include     http://boards.4chan.org/*
// @include     https://boards.4chan.org/*
// @include     http://sys.4chan.org/*
// @include     https://sys.4chan.org/*
// @include     http://www.4chan.org/*
// @include     https://www.4chan.org/*
// @include     http://boards.4channel.org/*
// @include     https://boards.4channel.org/*
// @include     http://sys.4channel.org/*
// @include     https://sys.4channel.org/*
// @include     http://www.4channel.org/*
// @include     https://www.4channel.org/*
// @connect     https://giggers.moe
// @description Allow users to bring IDs into boards that does not have them.
// @license     MIT
// @homepageURL https://github.com/doomkek/4chan-IDficator
// @downloadURL https://update.greasyfork.org/scripts/485980/4chan-IDficator.user.js
// @updateURL https://update.greasyfork.org/scripts/485980/4chan-IDficator.meta.js
// ==/UserScript==

(function () {
    var SERVICE_URL = "https://giggers.moe";
    var IS_4CHANX = false;
    var menuNode;

    const config = {
        USE_ID: true,

        saveConfig: function () { localStorage.setItem("4chan-id.config", JSON.stringify(config)); },
        loadConfig: () => {
            var conf = JSON.parse(localStorage.getItem("4chan-id.config"))
            if (!conf)
                return;

            for (const key in config) {
                if (conf.hasOwnProperty(key)) {
                    config[key] = conf[key];
                }
            }
        },
    };

    const filters = {
        hiddenIDs: [],
        saveFilters: () => {
            var storageFilters = JSON.parse(localStorage.getItem("4chan-id.filters"));
            if (storageFilters == null) {
                localStorage.setItem("4chan-id.filters", JSON.stringify(filters.hiddenIDs));
            } else {
                var otherFilters = storageFilters.filter(p => p.boardId != thread.boardId && p.threadId != thread.threadId);
                localStorage.setItem("4chan-id.filters", JSON.stringify(otherFilters.concat(filters.hiddenIDs)));
            }
        },
        loadFilters: () => {
            var storageFilters = JSON.parse(localStorage.getItem("4chan-id.filters"));
            if (storageFilters != null) { //                                                                                                        2 weeks 
                filters.hiddenIDs = storageFilters.filter(p => p.boardId == thread.boardId && p.threadId == thread.threadId && Date.now() - p.ts < 14 * 24 * 60 * 60 * 1000);
            }
        },
        addFilter: (userId) => {
            if (filters.isUserIdFiltered(userId))
                return;

            filters.hiddenIDs.push({ boardId: thread.boardId, threadId: thread.threadId, userId: userId, ts: Date.now() });
            filters.saveFilters();
        },
        removeFilter: (userId) => {
            var index = filters.hiddenIDs.findIndex(p => p.userId == userId);
            if (index != -1) {
                filters.hiddenIDs.splice(index, 1);
                filters.saveFilters();
            }
        },
        isUserIdFiltered: (userId) => filters.hiddenIDs.some(p => p.userId == userId),
        changePostHideState: function (postId, hide) {
            if (IS_4CHANX) {
                var post = document.getElementById('sa' + postId);
                if (hide && document.getElementById('pc' + postId).querySelector('.stub') == null || !hide && document.getElementById('pc' + postId).querySelector('.stub') != null)
                    document.getElementById('sa' + postId).querySelector('.hide-reply-button').click();
            } else {
                var post = document.getElementById('pc' + postId);
                if (hide && !post.classList.contains("post-hidden") || !hide && post.classList.contains("post-hidden"))
                    post.classList.toggle("post-hidden");
            }
        }
    };

    const thread = {
        boardId: Main.board,
        threadId: Main.tid,
        posts: [],

        init: function () {
            config.loadConfig();
            filters.loadFilters();
            menu.createMenu();
            api.getShitposts(data => thread.applyShitposts(data));
        },

        getPostById: (postId) => thread.posts.find(p => p.postId == postId),
        getPostsByUserId: (userId) => thread.posts.filter(p => p.userId == userId),

        applyShitposts: function (data) {
            //TODO: need to check all local posts as well, because one of them could've been deleted on server side 
            for (var i = 0; i < data.length; i++) {
                var { postId: postId, userHash: userId } = data[i];
                var post = thread.getPostById(postId);
                if (!post) {
                    post = {
                        postId,
                        userId,
                        // this element could be missing sometimes, because giggers service is faster than 4chan
                        // that lead to scrip thinking that this post already exists in DOM because giggers service told so 
                        // but it does not, so have to check it every time before using it
                        rootElement: document.getElementById('pc' + postId),
                        idElement: null,
                        setIdElement: function (element) {
                            if (!this.rootElement)
                                return;

                            var p = this.rootElement.querySelector('.postNum.desktop');
                            p.insertAdjacentElement('afterend', this.idElement = element);
                        },
                        scrollIntoView: function () {
                            if (!this.rootElement)
                                return;

                            this.idElement.scrollIntoView({ behavior: 'instant', block: 'center' })
                        },
                        showMenu: function () {
                            menuNode.id = "menu_" + this.postId + "_" + this.userId;
                            menuNode.style.left = Math.round(this.idElement.getBoundingClientRect().left) + "px";
                            this.idElement.insertAdjacentElement('afterend', menuNode);
                        },
                        isHidden: function () {
                            if (!this.rootElement)
                                return true;

                            if (this.rootElement.querySelector('.stub'))
                                return true;

                            if (this.rootElement.classList.contains('post-hidden'))
                                return true;

                            if (this.rootElement.hasAttribute('hidden'))
                                return true;

                            return false;
                        }
                    }

                    thread.posts.push(post);
                    thread.applyId(post);
                } else if (!post.rootElement) {
                    post.rootElement = document.getElementById('pc' + postId);
                    thread.applyId(post);
                }

                if (filters.isUserIdFiltered(userId))
                    filters.changePostHideState(postId, true);
            }
        },
        applyId: function (post) {
            var a = document.createElement('span');
            a.id = "shitpost_" + post.postId
            a.className = post.userId;
            a.innerText = post.userId;
            a.style.backgroundColor = "#" + post.userId;
            a.style.color = "white";
            a.style.textShadow = "black 0.5px 0.5px";
            a.style.marginLeft = "4px";
            a.style.cursor = "pointer";
            a.style.paddingRight = a.style.paddingLeft = "6px";
            a.style.borderRadius = "10px";

            a.onmouseenter = function (e) {
                var posts = thread.getPostsByUserId(post.userId);
                a.title = posts.length + (posts.length > 1 ? " posts" : " post") + " by this ID";
            };

            a.onmouseleave = function (e) { a.title = ""; };

            a.onclick = function (e) {
                post.showMenu();

                if (menuNode.style.display == "block") {
                    menuNode.style.display = "none";
                    document.removeEventListener('click', menu.handleMenuClick);
                } else {
                    menuNode.style.display = "block";
                    document.addEventListener('click', menu.handleMenuClick);
                }
            };

            post.setIdElement(a);
        }
    };

    const menu = {
        createMenu: function () {
            if (menuNode)
                menuNode.remove();

            menuNode = document.createElement('div');
            menuNode.style.width = "80px";
            menuNode.style.position = "absolute";
            menuNode.style.boxShadow = "0 1px 2px rgba(0, 0, 0, .15)";
            menuNode.style.background = IS_4CHANX ? "var(--fcsp-background)" : "#b7c5d9";
            menuNode.style.color = IS_4CHANX ? "var(--fcsp-text)" : "#000";
            menuNode.style.border = IS_4CHANX ? "1px solid var(--fcsp-border)" : "1px solid #b7c5d9";
            menuNode.style.display = "none";
            menuNode.getPostId = function () { return menuNode.id.split('_')[1]; }
            menuNode.getUserId = function () { return menuNode.id.split('_')[2]; }

            menu.insertMenuItem("Highlight", function () {
                var posts = document.getElementsByClassName(menuNode.getUserId());
                for (var i = 0; i < posts.length; i++) {
                    var parentId = posts[i].id.split('_')[1];
                    var parent = document.getElementById('p' + parentId);
                    parent.classList.toggle("highlight");
                }
            });

            menu.insertMenuItem("↑ Prev", function () {
                var id = menuNode.getPostId();
                var posts = thread.getPostsByUserId(menuNode.getUserId());
                for (var i = posts.length - 1; i >= 0; i--) {
                    if (i == 0) {
                        var nextPost = posts.findLast(p => !p.isHidden());
                        if (nextPost) {
                            nextPost.showMenu();
                            nextPost.scrollIntoView();
                        }
                    }

                    if (posts[i].isHidden()) {
                        continue;
                    }

                    if (posts[i].postId < id) {
                        posts[i].showMenu();
                        posts[i].scrollIntoView();
                        break;
                    }
                }
            });

            menu.insertMenuItem("↓ Next", function () {
                var postId = menuNode.getPostId();
                var posts = thread.getPostsByUserId(menuNode.getUserId());
                for (var i = 0; i < posts.length; i++) {
                    if (i + 1 == posts.length) {
                        var nextPost = posts.find(p => !p.isHidden());
                        if (nextPost) {
                            nextPost.showMenu();
                            nextPost.scrollIntoView();
                        }
                    }

                    if (posts[i].isHidden()) {
                        continue;
                    }

                    if (posts[i].postId > postId) {
                        posts[i].showMenu();
                        posts[i].scrollIntoView();
                        break;
                    }
                }
            });

            var toggleHide = function (hide) {
                var userId = menuNode.getUserId();
                var posts = thread.getPostsByUserId(userId);

                if (hide) {
                    filters.addFilter(userId);
                } else {
                    filters.removeFilter(userId);
                }

                for (var i = 0; i < posts.length; i++) {
                    filters.changePostHideState(posts[i].postId, hide);
                }
            }

            menu.insertMenuItem("Hide ID", () => { toggleHide(true); menuNode.style.display = "none"; });
            menu.insertMenuItem("Unhide ID", () => { toggleHide(false); menuNode.style.display = "none"; });
        },
        handleMenuClick: function (e) {
            if (!e.target.id.startsWith('shitpost_') && !e.target.id.startsWith('menu_item_') && menuNode.style.display == "block" && e.target != menuNode) {
                menuNode.style.display = "none";
                document.removeEventListener('click', menu.handleMenuClick);
            }
        },
        insertMenuItem: function (name, handler) {
            var menuItem = document.createElement('div');
            menuItem.innerText = name;
            menuItem.id = "menu_item_" + name.replace(' ', '');
            menuItem.style.height = IS_4CHANX ? "21px" : "18px";
            menuItem.style.cursor = "pointer";
            menuItem.style.paddingLeft = "4px";
            menuItem.style.color = IS_4CHANX ? "var(--fcsp-text)" : "#000";
            menuItem.style.background = IS_4CHANX ? "var(--fcsp-background)" : "#d6daf0";
            menuItem.style.userSelect = "none";

            menuItem.addEventListener('mouseover', function () { menuItem.style.background = IS_4CHANX ? "var(--fcsp-border)" : "#eef2ff"; });
            menuItem.addEventListener('mouseout', function () { menuItem.style.background = IS_4CHANX ? "var(--fcsp-background)" : "#d6daf0"; });
            menuItem.addEventListener('click', handler);

            menuNode.appendChild(menuItem);
        }
    };

    const api = {
        getShitposts: function (callback) {
            const url = `${SERVICE_URL}/getShitposts/${thread.boardId}/${thread.threadId}`;

            fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
                .then(response => response.json())
                .then(data => callback(data));
        },
        addPost: function (postId) {
            if (!config.USE_ID)
                return;

            fetch(`${SERVICE_URL}/addPost?boardId=${thread.boardId}&threadId=${thread.threadId}&postId=${postId}`, { method: 'POST' });
        }
    };

    const utils = {};

    document.addEventListener('4chanXInitFinished', function (e) {
        IS_4CHANX = true;
        thread.init();
    });

    document.addEventListener('4chanThreadUpdated', function (e) { api.getShitposts(data => thread.applyShitposts(data)); });
    document.addEventListener('ThreadUpdate', function (e) {
        // can't think of a better way to detect 4chanX userscript
        //TODO: need to react to this change, like if it was false but now true then reinit menu? is it enough?
        if (!IS_4CHANX && (IS_4CHANX = document.getElementsByClassName('fcsp-chan-x-controls').length > 0)) {
            console.log("4chan-x detected");
            menu.createMenu();
        }

        if (e.detail.newPosts.length == 0)
            return;
        api.getShitposts(data => thread.applyShitposts(data));
    });

    document.addEventListener('QRPostSuccessful', function (e) { api.addPost(e.detail.postID); });
    document.addEventListener('4chanQRPostSuccess', function (e) { api.addPost(e.detail.postId); });

    // need for tracking non 4chan-x QR being added to the DOM
    var doom = function (e) {
        if (e.target.id != "quickReply")
            return;

        var cbID = document.createElement('span');
        cbID.id = 'cbID';
        cbID.innerHTML = '<label>[<input type="checkbox" checked="' + config.USE_ID + '" name="cbID">Use ID?]</label>';
        cbID.addEventListener("change", function (e) {
            config.USE_ID = cbID.querySelector('input').checked;
            config.saveConfig();
        });
        e.target.querySelector('#qrSpoiler').insertAdjacentElement('afterend', cbID);
        cbID.querySelector('input').checked = config.USE_ID;
    };

    document.addEventListener('QRDialogCreation', function (e) {
        var cbID = document.createElement('label');
        cbID.id = 'cbID';
        cbID.innerHTML = '<input type="checkbox" checked="' + config.USE_ID + '" name="cbID">Use ID?</input>';
        cbID.addEventListener("change", function (e) {
            config.USE_ID = cbID.querySelector('input').checked;
            config.saveConfig();
        });

        e.target.querySelector('.move').appendChild(cbID);
        cbID.querySelector('input').checked = config.USE_ID;
        document.getElementsByTagName('body')[0].removeEventListener('DOMNodeInserted', doom);
    });

    document.getElementsByTagName('body')[0].addEventListener("DOMNodeInserted", doom);

    thread.init();
})();