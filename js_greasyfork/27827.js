// ==UserScript==
// @name        vk.com mark as read
// @namespace   limizin.userscripts
// @description mark posts as read (помечает посты как прочитанные)
// @include     https://vk.com*
// @version     2.4
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/27827/vkcom%20mark%20as%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/27827/vkcom%20mark%20as%20read.meta.js
// ==/UserScript==
(function() {
    var postwall = document.getElementById('page_wall_posts');
    if (!postwall)
        return;

    globals = {};
    globals.firefox = navigator.userAgent.toLowerCase().indexOf('firefox') != -1;
    globals.postwall = postwall;
    globals.storageKey = 'usernameReadPost/' + hashCode(location.pathname) + hashCode(reverse(location.pathname));
    globals.top_shadow_post_id = null;
    globals.shadowMark = false;
    globals.maxAutoscrollPosts = 150;
    globals.autoscrolling = false;
    globals.scrollOnLoad = false;
    globals.unreadCount = 0;
    globals.readPostNumId = 0; //second num after _ in id

    //add styles
    if (!document.querySelector('style#usernameReadPost')) {
        var head = document.querySelector('head');
        stl = head.appendChild(document.createElement('style'));
        stl.id = 'usernameReadPost';
        stl.innerHTML = `
.usernameReadPost, .usernameReadPost ~ * {background-color: silver !important;}  
.usernameReadBtn {background-color: #507299; color: #ffffff; border: thin solid #C4C4C4; cursor: pointer;}  
.usernameReadPostBtn {top:0; right:0; position: absolute;}
@keyframes blink {    
  0% { color: white; }
  100% { color: #507299; }
}
@-webkit-keyframes blink {
  0% { color: white; }
  100% { color: #507299; }
}
.blink {
  -webkit-animation: blink 500ms linear infinite;
  -moz-animation: blink 500ms linear infinite;
  animation: blink 500ms linear infinite;
}`;
    }

    //scroll section
    var buttonBlock = document.createElement('div');
    buttonBlock.style.display = 'inline';
    buttonBlock.style.marginLeft = '-58px';
    buttonBlock.style.marginRight = '7px';
    buttonBlock.style.marginTop = '10px';
    buttonBlock.style.float = 'left';

    var scrollOnLoadChBox = buttonBlock.appendChild(document.createElement('input'));
    scrollOnLoadChBox.type = 'checkbox';
    scrollOnLoadChBox.style.verticalAlign = 'middle';
    scrollOnLoadChBox.title = 'прокрутить до прочитанного при загрузке странице';
    globals.scrollOnLoadChBox = scrollOnLoadChBox;
    scrollOnLoadChBox.click = addEventListener('change', function(e) {
        globals.scrollOnLoad = globals.scrollOnLoadChBox.checked;
        saveSettings();
    });

    var scrollToReadBtn = createButton('', scrollToRead, 'прокрутить до прочитанного');
    scrollToReadBtn.style.width = '30px';
    var scrollButtonText = scrollToReadBtn.appendChild(document.createElement('span'));
    scrollButtonText.textContent = '>';
    globals.scrollButtonText = scrollButtonText;
    globals.scrollButton = scrollToReadBtn;

    buttonBlock.appendChild(scrollToReadBtn);
    document.querySelector('div.head_nav_item').appendChild(buttonBlock);

    //add buttons ol load
    _addButtons(document.querySelectorAll('#page_wall_posts > div.post'));

    loadSettings();

    //shadow posts on load
    if (globals.top_shadow_post_id) {
        var post = document.getElementById(globals.top_shadow_post_id);
        if (post) {
            _markReadPost(post);
            globals.shadowMark = true;
        }
    }

    //wall observer
    observer = new MutationObserver(
        function(mutations) {
            var newPosts = new Array();
            mutations.forEach(function(mutation) {
                if (mutation.type != 'childList')
                    return;
                if (mutation.addedNodes) {
                    for (i = 0; i < mutation.addedNodes.length; i++) {
                        var post = mutation.addedNodes[i];
                        if (post.classList.contains('no_posts'))
                            continue;
                        newPosts.push(post);
                    }
                }
            });

            if (newPosts) {
                _addButtons(newPosts);

                if (globals.readPostNumId != 0) {
                    var unreadCount = globals.unreadCount;
                    //console.log(unreadCount);
                    for (var i = 0; i < newPosts.length; ++i) {
                        var newPost = newPosts[i];
                        var newPostNumId = _extractPostNumId(newPost);
                        if (newPostNumId > globals.readPostNumId) {
                            unreadCount += 1;
                        }
                    }
                    if (unreadCount > globals.unreadCount) {
                        globals.unreadCount = unreadCount;
                        globals.scrollButtonText.textContent = globals.unreadCount;
                    }
                }
                _shadowSubloadedPosts(newPosts);
                if (globals.autoscrolling) {
                    scrollToRead(null);
                }
            }
        }
    );
    observer.observe(globals.postwall, {
        attributes: false,
        childList: true,
        characterData: false
    });


    //scroll on load
    if (globals.scrollOnLoad) {
        scrollToRead(null);
    }


    function loadSettings() {
        var value = GM_getValue(globals.storageKey);
        if (value) {
            var chunks = value.split('|');
            globals.top_shadow_post_id = chunks[0];
            globals.scrollOnLoad = (chunks[1] == '1');
            globals.scrollOnLoadChBox.checked = globals.scrollOnLoad;
        }
    }

    function saveSettings() {
        var readPostId = globals.top_shadow_post_id;
        var checked = (globals.scrollOnLoad) ? '1' : '0';
        var value = readPostId + '|' + checked;
        GM_setValue(globals.storageKey, value);
    }

    function scrollToRead(event) {
        var post = document.querySelector('div.usernameReadPost');
        if (post) {
            var postYOffset = post.offsetTop;
            var median = window.innerHeight / 2;
            var scrollTo = postYOffset - median;
            if (scrollTo < 0) {
                scrollTo = 0;
            }
            window.scrollTo(0, scrollTo);
            changeSrollState(false);
        } else {
            if (globals.maxAutoscrollPosts >= globals.postwall.childElementCount) {
                changeSrollState(true);
                var prevPostsBtn = document.getElementById('wall_more_link');
                if (prevPostsBtn) {
                    prevPostsBtn.click();
                } else {
                    changeSrollState(false);
                }
            } else {
                alert(globals.maxAutoscrollPosts + ' постов было загружено. Последний прочитанный пост среди них не найден');
                changeSrollState(false);
            }
        }
    }

    function changeSrollState(start) {
        if (start) {
            globals.autoscrolling = true;
            globals.scrollButtonText.classList.add('blink');
            globals.scrollButton.click = null;
        } else {
            globals.autoscrolling = false;
            globals.scrollButtonText.classList.remove('blink');
            globals.scrollButton.click = scrollToRead;
        }
    }

    function _shadowSubloadedPosts(posts) {
        if (globals.shadowMark || !globals.top_shadow_post_id) {
            return;
        }
        for (var i = 0; i < posts.length; ++i) {
            var post = posts[i];
            var postId = post.getAttribute('id');
            if (postId == globals.top_shadow_post_id) {
                _markReadPost(post);
                break;
            }
        }
    }

    function markSelectedAsRead(event) {
        var xpath = './ancestor::div[contains(@class, "post") and not(@id="page_wall_posts")]';
        var post = document.evaluate(xpath, event.currentTarget, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (post) {
            globals.top_shadow_post_id = post.getAttribute('id');
            saveSettings();
            var prevPostsXpath = './preceding-sibling::div[contains(@class, "usernameReadPost")]';
            var prevPosts = document.evaluate(prevPostsXpath, post, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < prevPosts.snapshotLength; i++) {
                var prevPost = prevPosts.snapshotItem(i);
                prevPost.classList.remove('usernameReadPost');
            }
            _markReadPost(post);
            globals.shadowMark = true;
        }
    }

    function _markReadPost(post) {
        post.classList.add('usernameReadPost');
        globals.readPostNumId = _extractPostNumId(post);
        var prevPostsXpath = 'count(./preceding-sibling::div[contains(@class, "post") and not(@id="page_wall_posts")])';
        var prevPosts = document.evaluate(prevPostsXpath, post, null, XPathResult.NUMBER_TYPE, null);
        globals.unreadCount = prevPosts.numberValue;
        globals.scrollButtonText.textContent = globals.unreadCount;
    }

    function _addButtons(posts) {
        for (var i = 0; i < posts.length; ++i) {
            var post = posts[i];
            var btn = createButton('+', markSelectedAsRead, 'mark as read');
            btn.classList.add('usernameReadPostBtn');
            post.appendChild(btn);
        }
    }

    /////////// utils ///////////

    function _extractPostNumId(post) {
        var num = post.getAttribute('data-post-id').split('_')[1];
        return parseInt(num);
    }

    function hashCode(value) {
        var hash = 0;
        if (value.length == 0) return hash;
        for (i = 0; i < value.length; i++) {
            char = value.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    function reverse(value) {
        return value.split('').reverse().join('');
    }

    function xpathResultToArray(xpathResult) {
        var nodes = new Array();
        var nextNode = xpathResult.iterateNext();
        while (nextNode) {
            nodes.push(nextNode);
            nextNode = xpathResult.iterateNext();
        }
        return nodes;
    }

    function createButton(content, handler, title) {
        var btn = document.createElement('button');
        btn.textContent = content;
        btn.onclick = handler;
        btn.title = title;
        btn.className = 'usernameReadBtn';
        if (globals.firefox) {
            btn.style.paddingBottom = '2px';
        }
        return btn;
    }
})();