//infinite-voz.js
// ==UserScript==
// @name         Infinite Scroll VOZ
// @namespace    http://vozforums.com/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://vozforums.com/forumdisplay.php?f=*
// @match        https://vozforums.com/showthread.php?t=*
// @match        https://vozforums.com/showthread.php?p=*
// @match        http://vozforums.com/forumdisplay.php?f=*
// @match        http://vozforums.com/showthread.php?t=*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26055/Infinite%20Scroll%20VOZ.user.js
// @updateURL https://update.greasyfork.org/scripts/26055/Infinite%20Scroll%20VOZ.meta.js
// ==/UserScript==
GM_addStyle(".hide {display: none} .show{display: block} ");

(function() {
    'use strict';
    var parser = new DOMParser();
    var threads = document.getElementById('threadslist');
    var posts = document.getElementById('posts');
    var currentPage = +getCurrentPage();
    var lastPage = +getLastPage();
    var isLoading = false;
    const PAGE_REG = /Page \d+/;
    const BUFFER_HEIGHT = 300; // Magic number, to load next page before reach the end.
    const loadingSpinHTML = '<div class="" style="width: 100px; margin: 0 auto;">Loading... <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="/></div>';
    const loadingSpin = document.createElement("div");
    loadingSpin.innerHTML = loadingSpinHTML;
    loadingSpin.className = "hide";

    //==========================================================================
    // Load Thread
    //==========================================================================
    if (threads) {
        var boxId = getParameterByName('f', window.location.href);
        var innerThreadList = document.getElementById('threadbits_forum_' + boxId);
        var threadListOffsetTop = getCoords(threads).top;

        insertAfter(threads, loadingSpin);
        window.addEventListener('scroll', function() {
            if (window.scrollY + window.innerHeight + BUFFER_HEIGHT >= threads.offsetHeight + threadListOffsetTop) {
                if (isLoadable()) {
                    loadingSpin.className = "show";
                    isLoading = true;
                    loadBoxPage(boxId, ++currentPage,function(loadedDoc) {
                        pushState(currentPage);
                        innerThreadList.innerHTML += '<tr><td colspan="2">Page ' + currentPage + '</td></tr>';
                        innerThreadList.innerHTML += loadedDoc.getElementById('threadbits_forum_' + boxId).innerHTML;
                        lastPage = getLastPage(loadedDoc);
                        updatePageNavigator(loadedDoc.querySelector("div.pagenav").innerHTML);
                        isLoading = false;
                        loadingSpin.className = "hide";
                    });
                }
            }
        });
    //==========================================================================
    // Load Post
    //==========================================================================
    } else if (posts) {
        var postsOffsetTop = getCoords(posts).top;

        var threadId = getParameterByName('t', window.location.href) || threadid;
        insertAfter(posts, loadingSpin);
        window.addEventListener('scroll', function() {
            if (window.scrollY + window.innerHeight + BUFFER_HEIGHT >= posts.offsetHeight + postsOffsetTop) {
                if (isLoadable()) {
                    loadingSpin.className = "show";
                    isLoading = true;
                    loadThreadPage(threadId, ++currentPage, function(loadedDoc) {
                        pushState(currentPage);
                        permalink(loadedDoc);
                        removeRedirect(loadedDoc);
                        posts.innerHTML += '<div>Page' + currentPage + '</div>';
                        posts.innerHTML += loadedDoc.getElementById('posts').innerHTML;
                        lastPage = getLastPage(loadedDoc);
                        updatePageNavigator(loadedDoc.querySelector("div.pagenav").innerHTML);
                        isLoading = false;
                        loadingSpin.className = "hide";
                        //Multiquote init
                        mq_init(fetch_object("posts"));
                    });
                }
            }
        });

        // Create permalink for the first time
        permalink(document);
        removeRedirect(posts);

        // Add quick reply widget
        quickReply();
        setFixedPageNavigation();

        bindShortcutKey();
    }

    function setFixedPageNavigation() {
        const pagenav = document.querySelectorAll('.pagenav');
        if (pagenav.length) {
            // pagenav[1] => the bottom pagenav
            Object.assign(pagenav[1].style, {
                position: 'fixed',
                bottom: 0,
                right: 0
            });
        }
    }

    /**
     * Add Esc and F1 shortcut.
     * F1: Show quick reply box with quoted comments
     * Esc: to hide quick reply box
     *
     * @author ReeganExE https://github.com/ReeganExE
     */
    function bindShortcutKey() {
        const textbox = document.querySelector('textarea[name="message"]');
        const reply = document.querySelector('a[href^="newreply.php"]'); // find the Reply button and take its href

        if (!textbox || !reply) {
            return;
        }

        const replyHref = reply.href;

        // Press Esc to hide the quick reply box
        textbox.addEventListener('keydown', e => {
            e.keyCode === 27 && toggle_collapse('quickreply');
        }, false);

        // Press F1 to show replybox with quotes
        document.addEventListener('keydown', e => {
            if (e.keyCode !== 112) { // F1
                return;
            }

            e.preventDefault();

            // Show quick reply box
            toggle_collapse('quickreply');
            textbox.focus();

            // Load quotes
            const quotes = fetch_cookie("vbulletin_multiquote");

            if (quotes) { // check whether user has quoted
                textbox.disabled = true;
                loadQuotes(replyHref, q => {
                    let val = textbox.value;
                    if (q) {
                        val = val ? (val + '\n' + q) : q;
                    }

                    textbox.value = val;
                    textbox.disabled = false;
                    textbox.focus();

                    // Reset quotes
                    document.cookie = 'vbulletin_multiquote=;';
                    quotes.split(',').forEach(id => change_mq_image(id, false));
                }, () => (textbox.disabled = false));
            }
        }, false);
    }

    /**
     * https://github.com/ReeganExE/voz-permalink
     * @author ReeganExE
     */
    function permalink(document) {
        const { origin, pathname, search } = location;
        const root = [origin, pathname, search].join('');

        document.querySelectorAll('.thead a:not([href])').forEach(a => {
          a.href = root + '#' + a.name;
          if (a.nextSibling) {
            a.appendChild(a.nextSibling);
          }
        });
    }

    /**
     * Remove external link redirection.
     *
     * https://github.com/ReeganExE
     * @param {HtmlDoc} document Document or fragment
     * @author ReeganExE
     */
    function removeRedirect(document) {
        document.querySelectorAll('a[href^="/redirect/index.php"]').forEach(a => {
            a.href = decodeURIComponent(a.href.split('link=')[1]);
        });
    }

    /**
     * Add Quick Reply widget.
     * https://github.com/ReeganExE
     *
     * @author ReeganExE
     */
    function quickReply() {
        var replyForm = document.getElementById('qrform');
        if (replyForm) {
            if (!document.getElementById('collapseimg_quickreply').src.endsWith('collapsed.gif')) {
                toggle_collapse('quickreply');
            }
            Object.assign(replyForm.style, { position: 'fixed', top: '2px', right: '2px' });
        }
    }

    function pushState(currentPage) {
        const query = location.search.slice(1).split('&').reduce((o, v) => { const [key, val] = v.split('='); o[key] = val; return o;}, {});
        const { origin, pathname } = location;

        query.page = currentPage;
        const search = Object.keys(query).map(k => `${k}=${query[k]}`).join('&');
        let path = `${origin}${pathname}?${search}`, title = document.title;

        if (PAGE_REG.test(title)) {
            title = title.replace(PAGE_REG, 'Page ' + currentPage);
        } else {
            title = `${title} Page ${currentPage}`;
        }
        history.pushState({}, title, path);
        document.title = title;
    }

    function isLoadable() {
        return (!isLoading && currentPage < lastPage);
    }

    function getCurrentPage() {
        var pages = document.querySelector("div.pagenav tbody");
        if (pages) {
            return pages.querySelectorAll('tr:first-child td.alt2 strong')[0].innerHTML;
        }
        return 1;
    }

    function updatePageNavigator(newHtmlNav) {
        var pageNavs = document.querySelectorAll("div.pagenav");
        for (var i = 0; i < pageNavs.length; i++) {
            pageNavs[i].innerHTML = newHtmlNav;
        }
    }

    function getLastPage(doc) {
        if (!doc) doc = document;
        var pages = doc.querySelector("div.pagenav tbody");

        if (!pages) {
            return 1;
        }

        var pageInfo = pages.querySelector('tr:first-child td.vbmenu_control').innerText;
        var pageInfoWords = pageInfo.split(" ");
        return (pageInfoWords[pageInfoWords.length - 1]);
    }

    function getParameterByName(name, url) {
        if (!url) {
            url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function getCoords(elem) { // crossbrowser version
        var box = elem.getBoundingClientRect();

        var body = document.body;
        var docEl = document.documentElement;

        var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

        var clientTop = docEl.clientTop || body.clientTop || 0;
        var clientLeft = docEl.clientLeft || body.clientLeft || 0;

        var top  = box.top +  scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left) };
    }

    function loadQuotes(href, callback, onerror) {
        ajax('GET', href, loadSuccess, onerror);
        function loadSuccess(xhr) {
            const doc = parser.parseFromString(xhr.responseText, "text/html");
            const txt = doc.querySelector('textarea[name="message"]');
            callback(txt ? txt.value : txt);
        }
    }

    function loadBoxPage(boxId, pageNo, callback) {
        ajax('GET', 'https://vozforums.com/forumdisplay.php?f=' + boxId + '&order=desc&page=' + pageNo, loadSuccess);
        function loadSuccess(xhr) {
            callback(parser.parseFromString(xhr.responseText, "text/html"));
        }
	}

    function loadThreadPage(threadId, pageNo, callback) {
        ajax('GET', 'https://vozforums.com/showthread.php?t=' + threadId + '&page=' + pageNo, loadSuccess);

        function loadSuccess(xhr) {
            callback(parser.parseFromString(xhr.responseText, "text/html"));
        }
    }

    function ajax(method, url, callback, onerror) {
        var xhr = new XMLHttpRequest();
		xhr.open(method, url);
		xhr.send(null);
		xhr.onreadystatechange = function () {
			var DONE = 4; // readyState 4 means the request is done.
			var OK = 200; // status 200 is a successful return.
			if (xhr.readyState === DONE) {
				if (xhr.status === OK) {
                    callback(xhr);
				} else {
					console.log('Error: ' + xhr.status); // An error occurred during the request.
				}
			}
        };
        xhr.onerror = onerror;
    }

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

})();