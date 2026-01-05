// ==UserScript==
// @name         Youtube Comments Sidebar
// @namespace    http://ronnyjohn.work
// @version      1.0
// @description  Swaps the comments and related videos sections, so you can read the comments while watching the video.
// @author       Ronny John
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21391/Youtube%20Comments%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/21391/Youtube%20Comments%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    var mutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var watchModeObserver, sidebarAdObserver, page, sidebar, ads, related, relatedParent, relatedWrapper, comments, footer;
    var onResizeFunc = function() { setPositions(); setHeights(); console.log('resize'); };
    var onScrollFunc = function() { setHeights(); };
    var modificationDone = false;
    
    if (typeof mutationObserver === 'undefined') return;
    
    // a little style adjustment
    if (typeof(GM_addStyle) === typeof(Function)) {
        GM_addStyle('#watch7-sidebar-contents.sidebar-comments { position: fixed; z-index: 1; } #watch-discussion.sidebar-comments { position: fixed; padding: 0 6px; overflow: hidden; overflow-y: auto; z-index: 2; } #watch-discussion.sidebar-comments .comment-section-renderer-paginator { margin: 0; } #watch7-sidebar { -moz-transition: all 0s !important; -webkit-transition: all 0s !important; -o-transition: all 0s !important; transition: all 0s !important; }');
    }
    
    initialize();
    
    var contentObserver = createContentObserver();
    contentObserver.observe(document.getElementById('content'), {childList: true, subtree: true});
    
    function initialize() {
        page = document.getElementById('page');
        sidebar = document.getElementById('watch7-sidebar-contents');
        related = document.getElementById('watch-related');
        comments = document.getElementById('watch-discussion');
        footer = document.getElementById('footer-container');
        
        // if modification is already done, stop initialization (can be cached on browser navigate back and forward)
        if (related && comments && related.parentNode.parentNode == comments.parentNode) {
            return;
        }
        
        removeListeners();
        if (watchModeObserver) watchModeObserver.disconnect();
        if (sidebarAdObserver) sidebarAdObserver.disconnect();
              
        // skip if no video is shown or playlist is open
        if (!sidebar || !comments || !related || document.getElementById('watch-appbar-playlist')) {
            return;
        }
        
        relatedParent = related.parentNode;
        
        watchModeObserver = createWatchModeObserver();
        watchModeObserver.observe(page, {attributes: true});
        
        // if stage mode is active, do not run modifications
        if (page.classList.contains('watch-stage-mode')) {
            return;
        }
        
        runModifications();
        
        // if ads are inserted in the sidebar, the position of the comments must be updated
        ads = document.getElementById('google_companion_ad_div');
        if (ads) {
            sidebarAdObserver = createSidebarAdObserver();
            sidebarAdObserver.observe(ads, {childList: true});
        }
    }
    
    function runModifications() {
        // move ads and related
        relatedWrapper = document.createElement('div');
        relatedWrapper.className = comments.className;
        relatedWrapper.appendChild(related);
        comments.parentNode.insertBefore(relatedWrapper, comments);

        // comments node can't be moved, because loading of replies is not working properly then
        sidebar.classList.add('sidebar-comments');
        comments.className = 'sidebar-comments';
        
        window.addEventListener('resize', onResizeFunc);
        window.addEventListener('scroll', onScrollFunc);
        
        onResizeFunc();
        modificationDone = true;
    }
    
    function revertModifications() {
        sidebar.classList.remove('sidebar-comments');
        sidebar.style.width = 'auto';
        sidebar.style.height = 'auto';
        relatedParent.appendChild(related);
        comments.className = relatedWrapper.className;
        comments.style.width = 'auto';
        comments.style.height = 'auto';
        relatedWrapper.remove();
        
        removeListeners();
        
        modificationDone = false;
    }
        
    function removeListeners() {
        window.removeEventListener('resize', onResizeFunc);
        window.removeEventListener('scroll', onScrollFunc);
    }
        
    function setPositions() {        
        var sidebarParentRect = sidebar.parentNode.getBoundingClientRect();
        sidebar.style.top = (sidebarParentRect.top + scrollY) + 'px';
        sidebar.style.left = sidebarParentRect.left + 'px';
        sidebar.style.width = (sidebarParentRect.right - sidebarParentRect.left) + 'px';

        var containerRect = relatedParent.getBoundingClientRect();
        comments.style.top = containerRect.bottom + 'px';
        comments.style.left = containerRect.left + 'px';
        comments.style.width = (containerRect.right - containerRect.left) + 'px';
    }
    
    function setHeights() {
        var sidebarRect = sidebar.getBoundingClientRect();
        var containerRect = relatedParent.getBoundingClientRect();
        var footerRect = footer.getBoundingClientRect();
        var bottom = document.documentElement.clientHeight;
        
        if (footerRect.top < bottom) {
            bottom = footerRect.top;   
        }
        
        var commentsHeight = bottom - containerRect.bottom - 20;
        sidebar.style.height = (containerRect.bottom - sidebarRect.top + commentsHeight + 10) + 'px';
        comments.style.height = commentsHeight + 'px';
    }
    
    function createContentObserver() {
        return new mutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes !== null) {
                    for (var i=0; i < mutation.addedNodes.length; i++) {
                        var node = mutation.addedNodes[i];
                        if (node.id == 'watch7-container' || node.id == 'watch7-main-container') {
                            initialize();
                            break;
                        }
                    }
                }
            });
        });
    }
    
    function createWatchModeObserver() {
        return new mutationObserver(function(mutations) {
            for (var i=0; i<mutations.length; i++) {
                if (mutations[i].attributeName === "class") {
                    if (page.classList.contains('watch-stage-mode') && modificationDone) {
                        revertModifications();
                    } else if (!page.classList.contains('watch-stage-mode') && !modificationDone) {
                        runModifications();   
                    }
                }
            }
        });
    }
    
    function createSidebarAdObserver() {
        return new mutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes !== null) {
                    onResizeFunc();
                }
            });
        });
    }
})();