// ==UserScript==
// @name           Reddit - Top Comments Preview
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
// @author         jesuis-parapluie, Erik Wannebo, gavin19
// @version        2.04
// @description    Preview to the top comments on Reddit (+ optional: autoload comments, autoload images, autohide sidebar)
// @homepage       https://github.com/mationic/userscripts/blob/master/Reddit%20-%20Top%20Comments%20Preview.readme.md
// @include        /^https?:\/\/(.+\.)?reddit\.com\/?.*$/
// @exclude        /^https?:\/\/(.+\.)?reddit\.com\/.+\/comments\/.*$/
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/28462/Reddit%20-%20Top%20Comments%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/28462/Reddit%20-%20Top%20Comments%20Preview.meta.js
// ==/UserScript==


(function () {
    'use strict';
    /*jslint browser:true, newcap:true */
    /*global GM_getValue, GM_setValue  */

    var options = {
            /* Number of comments to display */
            topComments: 5,
            /* sortings: top, best, new, hot, controversial, old */
            commentSorting: 'top',
            /* Comments not matched by array will be added at the top                 */
            /* Comments matched by corresponding expandos will be added at the bottom */
            /* Options: 'selftext', 'image', 'video-muted' (gif/gfy etc), 'video'     */
            commentsAtBottom_autoLoad: ['selftext', 'image', 'video-muted', 'video'],
            commentsAtBottom_topLinks: [],
            /* Disable option for hiding the sidebar. */
            disableSidebarButton: true,
            /* Disable option for autoloading images and comments. */
            disableAutoloadButton: false,
            /* Disable RES keyboard shortcut ('t') to show comments */
            disableShortCut: true
        },


        helper = {
            cointainSameElement: function (a1, a2) {
                var i = 0;
                for (i = 0; i < a1.length; i += 1) {
                    if (a2 !== null && a2.contains(a1[i])) {
                        return true;
                    }
                }
                return false;
            },
            toggleView: function (className) {
                (function (style) {
                    style.display = style.display === 'none' ? '' : 'none';
                }(document.querySelector(className).style));
            }
        },
        onloadJSON = function (response) {
            var i, content, score, contentDiv, author, permalink,
                newHTML = '',
                comments = JSON.parse(response.responseText),
                commentsLength = comments[1].data.children.length,
                len = options.topComments < commentsLength ? options.topComments : commentsLength,
                articleID = comments[0].data.children[0].data.id,
                threadLink = comments[0].data.children[0].data.permalink,
                article = document.querySelector('#preview' + articleID);
            if (article && article.classList.contains('loading')) {
                for (i = 0; i < len; i += 1) {
                    content = comments[1].data.children[i].data.body_html;
                    if (content) {
                        contentDiv = document.createElement('div');
                        contentDiv.innerHTML = content;
                        content = contentDiv.firstChild.textContent;
                        author = comments[1].data.children[i].data.author;
                        score = comments[1].data.children[i].data.score;
                        permalink = threadLink + comments[1].data.children[i].data.id;
                        newHTML += (i > 0 ? '<hr>' : '');
                        newHTML += '<a class="ulink" target="_blank" href="/u/' + author;
                        newHTML += '">' + author + '</a>';
                        newHTML += '<span class="points">| score: ' + score + '</span>';
                        newHTML += '<a class="permalink" target="_blank" href="' + permalink + '">permalink</a><br />' + content;
                    }
                }
                article.classList.remove('loading');
                article.innerHTML = newHTML;
            }
        },
        retrieveTopComments = function (ele, articleID) {
            var url, xhr, expando,
                addToBottom = false,
                commentPosition = options.commentsAtBottom_autoLoad,
                comments = document.querySelector('#preview' + articleID),
                entry = ele.parentNode.parentNode.parentNode;

            if (comments === null) {
                comments = document.createElement('div');
                comments.setAttribute('id', 'preview' + articleID);
                comments.classList.add('commentbox');
                comments.classList.add('loading');
                expando = entry.querySelector('.expando-button');

                if (ele.classList.contains('clicked')) {
                    commentPosition = options.commentsAtBottom_topLinks;
                }

                if (expando !== null && expando.classList && helper.cointainSameElement(commentPosition, expando.classList)) {
                    addToBottom = true;
                }

                if (addToBottom) {
                    entry.appendChild(comments);
                } else {
                    entry.insertBefore(comments, entry.querySelector('.res-expando-box'));
                }
            }
            if (comments.classList.contains('loading')) {
                url = '//' + document.domain + '/comments/' + articleID + '/.json?limit=' + (options.topComments + 5) + '&sort=' + options.commentSorting;
                xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function () {
                    var retries = 0;
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            onloadJSON(xhr);
                        } else {
                            if (ele.hasAttribute('data-retries')) {
                                retries = parseInt(ele.getAttribute('data-retries'), 10);
                            }
                            ele.setAttribute('data-retries', retries + 1);
                            if (retries > 5) {
                                comments.classList.remove('loading');
                                comments.classList.add('loaderror');
                                ele.setAttribute('data-retries', 0);
                            } else {
                                setTimeout(retrieveTopComments(ele, articleID), 2000);
                            }
                        }
                    }
                };
                xhr.onerror = function () {
                    comments.classList.remove('loading');
                    comments.classList.add('loaderror');
                    ele.setAttribute('data-retries', 0);
                };
                xhr.send(null);
            } else {
                comments.parentNode.removeChild(comments);
            }

        },
        addListener = function (link, articleID) {
            link.addEventListener('click', function () {
                this.classList.add('clicked');
                retrieveTopComments(this, articleID);
                this.classList.remove('clicked');
            });
        },
        addTopLinks = function () {
            var i, link, li, articleID, parent, tmp = 'java',
                a = document.querySelectorAll('.linklisting .thing:not(.NERdupe) .comments:not(.empty)');
            for (i = 0; i < a.length; i += 1) {
                if (!a[i].parentNode.parentNode.querySelector('.toplink') && /[0-9]/.test(a[i])) {
                    articleID = a[i].getAttribute('href');
                    articleID = articleID.substring(articleID.indexOf('/comments/') + 10, articleID.indexOf('/comments/') + 16);
                    link = document.createElement('a');
                    li = document.createElement('li');
                    li.appendChild(link);
                    link.className = 'toplink';
                    link.href = tmp + 'script:;';
                    link.setAttribute('id', 'toplink' + articleID);
                    link.textContent = ' ' + options.commentSorting;
                    parent = a[i].parentNode.parentNode;
                    addListener(link, articleID);
                    parent.insertBefore(li, parent.querySelector('.first + li'));
                    if (GM_getValue('autoLoadComments', false)) {
                        retrieveTopComments(link, articleID);
                    }
                }
            }
        },
        addStyle = function () {
            var style = document.createElement('style'),
                sheet = [
                    ".aubox a.disabled{color:#995F5F;font-weight:400} .aubox a.enabled{color:#009D2D;font-weight:400} a#sidebarswitch{cursor:pointer}",
                    "div[id^=preview]{-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;background:#fff;border-radius:5px;border:1px solid #dbdbdb;white-space:normal;padding:5px;display:inline-block;margin:8px 0}",
                    "div[id^=preview] .md{border:1px solid #ddd;background:#f0f0f0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;margin:3px 0;box-sizing:border-box;padding:2px 8px}",
                    ".loaderror:before{content:\" loading failed \";color:red} .loading:before{content:\"Loading...\"} .res-nightmode .loaderror:before{content:\" loading failed \";color:#E63A3A}",
                    "div[id^=preview] .md *{white-space:normal} div[id^=preview] .md code{white-space:pre} div[id^=preview] .md pre{overflow:visible} div[id^=preview]>*{font-size:small}",
                    "div[id^=preview] .ulink,div[id^=preview] .md a{font-weight:700;color:#369!important} .listing-page .buttons li{vertical-align:top} .toplink{color:#FF4500!important;text-decoration:none}",
                    ".permalink{float:right;color:#666} .points{color:#333;font-weight:700;margin-left:.5em}",
                    ".res-nightmode div[id^=preview] pre,.res-nightmode div[id^=preview] code,.res-nightmode .link .md pre{border:1px solid #222!important;background:#282828!important;background-color:#282828!important}",
                    ".res-nightmode div[id^=preview] .ulink,.res-nightmode div[id^=preview] .md a{color:#1496dc!important} .res-nightmode div[id^=preview]{background:#333!important;border-color:#666!important}",
                    ".res-nightmode div[id^=preview] .md{background:#555!important;border-color:#222!important} .res-nightmode .toplink{color:#eee!important}",
                    ".res-nightmode div[id^=preview] .points{color:#ddd!important} .res-nightmode div[id^=preview] .permalink{color:#ccc!important}",
                    ".res-nightmode div[id^=preview] .md blockquote, .res-nightmode div[id^=preview] .md del{color:#8C8C8C!important} .res-nightmode div[id^=preview] hr{border-color:#777!important};}",
                    ".res-nightmode div[id^=preview] hr{border-color:#777!important;}"
                ].join("");
            style.type = 'text/css';
            style.textContent = sheet;
            document.querySelector('head').appendChild(style);
        },
        init = function () {
            var sidebar, loadbar, spanImages, spanComments,
                status = 'hide',
                buttonStatus = 'disabled';

            if (!options.disableSidebarButton) {

                sidebar = document.createElement('li');
                if (GM_getValue('sideBarToggle', true)) {
                    status = 'show';
                    helper.toggleView('.side');
                }
                sidebar.innerHTML = '<a id="sidebarswitch">' + status + ' sidebar</a>';
                sidebar.addEventListener('click', function () {
                    status = 'hide';
                    helper.toggleView('.side');
                    GM_setValue('sideBarToggle', !GM_getValue('sideBarToggle', true));
                    if (GM_getValue('sideBarToggle')) {
                        status = 'show';
                    }
                    document.querySelector('#sidebarswitch').innerHTML = status + ' sidebar';
                });
                document.querySelector('.tabmenu').appendChild(sidebar);
            } else {
                GM_setValue('sideBarToggle', false);
                document.querySelector('.side').style.display = '';
            }


            if (!options.disableAutoloadButton) {
                loadbar = document.createElement('li');
                loadbar.className = 'aubox';
                loadbar.innerHTML = '<a>load</a>';
                if (document.querySelector('#RESConsoleVersion') !== null) {
                    if (GM_getValue('autoExpandImages', false)) {
                        buttonStatus = 'enabled';
                    }
                    spanImages = document.createElement('span');
                    spanImages.innerHTML = '<a href="#" class="' + buttonStatus + '">images</a>';
                    spanImages.addEventListener('click', function () {
                        GM_setValue('autoExpandImages', !GM_getValue('autoExpandImages', false));
                        location.reload();
                    });
                    loadbar.appendChild(spanImages);
                }

                buttonStatus = 'disabled';
                if (GM_getValue('autoLoadComments', false)) {
                    buttonStatus = 'enabled';
                }
                spanComments = document.createElement('span');
                spanComments.innerHTML = '<a href="#" class="' + buttonStatus + '">comments</a>';
                spanComments.addEventListener('click', function () {
                    GM_setValue('autoLoadComments', !GM_getValue('autoLoadComments', false));
                    location.reload();
                });
                loadbar.appendChild(spanComments);
                document.querySelector('.tabmenu').appendChild(loadbar);
            } else {
                GM_setValue('autoExpandImages', false);
                GM_setValue('autoLoadComments', false);
            }


            if (!options.disableShortCut && document.querySelector('#RESConsoleVersion') !== null) {
                window.addEventListener('keyup', function (e) {
                    if (e.keyCode === 84 && document.querySelector('.RES-keyNav-activeElement')) { //t: keycode 84
                        document.querySelector('.RES-keyNav-activeElement .toplink').click();
                    }
                });
            }


            if (GM_getValue('autoExpandImages', false)) {
                document.querySelector('.res-show-images a').click();
            }

            document.body.addEventListener('DOMNodeInserted', function (e) {
                if ((e.target.tagName === 'DIV') && (e.target.getAttribute('id') && e.target.getAttribute('id').indexOf('siteTable') !== -1)) {

                    addTopLinks();

                } else if (GM_getValue('autoLoadComments', false) && (e.target.tagName === 'DIV') && e.target.parentNode && e.target.parentNode.classList.contains('res-expando-box')) {
                    setTimeout(function () {
                        var comments = e.target.parentNode.parentNode.querySelector('.commentbox'),
                            expando = e.target.parentNode.parentNode.querySelector('.expando-button'),
                            parent = comments.parentNode;

                        if (!comments.classList.contains('clicked') && expando !== null && helper.cointainSameElement(options.commentsAtBottom_autoLoad, expando.classList)) {
                            parent.removeChild(comments);
                            parent.appendChild(comments);
                        }
                    }, 20);
                }

            }, true);

            addStyle();
            addTopLinks();
        };

    if (document.body) {
        setTimeout(function () {
            init();
        }, 300);
    } else {
        window.addEventListener('load', function () {
            init();
        }, false);
    }

}());