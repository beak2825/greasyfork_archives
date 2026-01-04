// ==UserScript==
// @name         RuTracker Full-Text Search in Topics
// @namespace    copyMister
// @version      1.4
// @description  Allows to search for text on all pages of RuTracker topics
// @description:ru  Позволяет искать текст на всех страницах тем на Рутрекере
// @author       copyMister
// @license      MIT
// @match        https://rutracker.org/forum/viewtopic.php*
// @match        https://rutracker.net/forum/viewtopic.php*
// @match        https://rutracker.nl/forum/viewtopic.php*
// @match        https://rutracker.lib/forum/viewtopic.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rutracker.org
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @homepageURL  https://rutracker.org/forum/viewtopic.php?t=4717182
// @downloadURL https://update.greasyfork.org/scripts/484622/RuTracker%20Full-Text%20Search%20in%20Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/484622/RuTracker%20Full-Text%20Search%20in%20Topics.meta.js
// ==/UserScript==

var waitTime = 500; // сколько мс ждать между запросами страниц (по умолчанию 0.5 сек)
var postDb = [];
var dbReversed = false;
var searchBtn, searchInput, perPage, allPage, curPage, progLine, foundNum, topicUrl, topicMain, checkNick, checkDesc, count;
var postSelect = '#topic_main > tbody[id^="post_"]';

function clearPosts() {
    document.querySelectorAll(postSelect).forEach(function(post) {
        post.remove();
    });
}

function hidePagination() {
    document.querySelectorAll('h1.maintitle + div.small, #pagination').forEach(function(div) {
        div.style.display = 'none';
    });
}

function saveCheckValues() {
    if (checkNick.checked) {
        GM_setValue('nickValue', 'checked');
    } else {
        GM_setValue('nickValue', '');
    }

    if (checkDesc.checked) {
        GM_setValue('descValue', 'checked');
    } else {
        GM_setValue('descValue', '');
    }
}

function processResults() {
    var query = searchInput.value.trim().toLowerCase();
    var queryReg = new RegExp(query, 'gi');
    var found = 0;
    var fragment = new DocumentFragment();

    if (checkDesc.checked !== dbReversed) {
        postDb.reverse();
        dbReversed = checkDesc.checked;
    }

    postDb.forEach(function(post) {
        var postCopy = post.cloneNode(true);
        var postAuthor = postCopy.querySelector('.poster_info > p.nick');
        var postBody = postCopy.querySelector('.post_body');
        var postSign = postCopy.querySelector('.signature');
        var postText = '';

        if (checkNick.checked) {
            postText = postAuthor.textContent.trim() + ' ';
        }

        for (var node of postBody.childNodes) {
            node = node.textContent.trim();
            if (node.length > 0) {
                postText += node + ' ';
            }
        }

        if (postText.toLowerCase().includes(query)) {
            found++;
            if (checkNick.checked) {
                postAuthor.innerHTML = postAuthor.innerHTML.replaceAll(queryReg, '<mark>$&</mark>');
            }
            postBody.innerHTML = postBody.innerHTML.replaceAll(queryReg, '<mark>$&</mark>');
            fragment.append(postCopy);
            if (unsafeWindow.BB) {
                unsafeWindow.BB.initPost(postBody);
                if (postSign) {
                    unsafeWindow.BB.initPost(postSign);
                }
            }
        }
    });

    topicMain.append(fragment);
    searchBtn.disabled = false;
    searchInput.style.backgroundColor = 'lightyellow';
    foundNum.textContent = found;
    foundNum.parentElement.style.opacity = 1;
}

function fetchPage() {
    var xhr = new XMLHttpRequest();
    var url = topicUrl + '&start=' + count * perPage;
    if (count === 0) {
        url = topicUrl;
    }

    count++;
    curPage.textContent = count;
    progLine.value = (100 / allPage) * count;

    xhr.open('get', url, true);
    xhr.responseType = 'document';
    xhr.onload = function() {
        xhr.response.querySelectorAll(postSelect).forEach(function(post) {
            postDb.push(post);
        });

        if (count === allPage) processResults();
    };
    xhr.send();
}

function startSearch() {
    saveCheckValues();

    if (searchInput.value.trim().length > 0) {
        searchBtn.disabled = true;
        clearPosts();

        if (postDb.length > 0) {
            processResults();
        } else {
            hidePagination();
            count = 0;

            for (var page = 0; page < allPage; page++) {
                setTimeout(function() {
                    fetchPage();
                }, page * waitTime);
            }
        }
    }
}

(function() {
    'use strict';

    var cssCode = [
        '.fsearch-wrapper { position: absolute; z-index: 1; width: 100%; top: 3px; display: flex; justify-content: center; }',
        '.fsearch-text { width: 250px; border: 1px solid #c0c0c0; padding: 2px; margin-right: 2px; font-size: 12px; }',
        '.fsearch-text:focus { outline: 2px solid #4d90fe; outline-offset: -2px; }',
        '.fsearch-prog { width: 90px; font-size: 9px; display: flex; flex-direction: column; align-items: center; margin-right: 5px; user-select: none; }',
        '.fsearch-prog > label { margin: 0; cursor: auto; }',
        '.fsearch-btn { width: 50px; margin-right: 5px; }',
        '.fsearch-res { width: 90px; display: flex; align-items: center; font-size: 10px; opacity: 0; user-select: none; }',
        '.fsearch-opt { background-color: buttonface; border: 1px solid #c0c0c0; border-radius: 3px; margin-right: 2px; font-size: 14px; width: 21px; }',
        '.fsearch-menu { border-spacing: 1px; }',
        '.fsearch-menu label { margin-right: 0; }',
        '.fsearch-menu label:first-child { margin-top: 0; }',
    ].join('\n');
    GM_addStyle(cssCode);

    var container = document.querySelector('#soc-container');
    var searchHtml = '<div class="fsearch-wrapper"><a href="#fsearch-menu" class="fsearch-opt menu-root menu-alt1">⚙</a><input id="fsearch-text" class="fsearch-text" type="text" placeholder="искать в теме..." accesskey="ф"><input id="fsearch-btn" class="fsearch-btn" type="button" value="поиск"><div class="fsearch-prog"><label for="prog"><span id="cur-page">0</span> из <span id="all-page">1</span> стр.</label><progress id="prog" max="100" value="0">0%</progress></div><div class="fsearch-res">Найдено:&nbsp;<span id="found-num">0</span></div></div>';

    var nickValue = GM_getValue('nickValue', '');
    var descValue = GM_getValue('descValue', '');

    container.parentElement.style.cssText = 'position: relative; padding: 0; height: 26px;';
    container.insertAdjacentHTML('beforebegin', searchHtml);

    document.body.insertAdjacentHTML('beforeend', '<div id="fsearch-menu" class="menu-sub"><table class="fsearch-menu"><tbody><tr><th class="pad_4">Опции поиска</th></tr><tr><td class="pad_4"><label><input type="checkbox" id="check-nick" ' + nickValue + '>искать по никам авторов</a></label><label><input type="checkbox" id="check-desc" ' + descValue + '>новые сообщения вверху</label></td></tr></table></div>');

    topicUrl = document.querySelector('#topic-title').href;
    curPage = document.querySelector('#cur-page');
    progLine = document.querySelector('#prog');
    foundNum = document.querySelector('#found-num');
    checkNick = document.querySelector('#check-nick');
    checkDesc = document.querySelector('#check-desc');
    topicMain = document.querySelector('#topic_main');

    if (unsafeWindow.BB) {
        perPage = parseInt(unsafeWindow.BB.PG_PER_PAGE);
    }
    if (!perPage) {
        perPage = 30;
    }

    allPage = document.querySelector('#pagination b:nth-child(2)');
    if (allPage) {
        allPage = parseInt(allPage.textContent);
    } else {
        allPage = 1;
    }

    document.querySelector('#all-page').textContent = allPage;

    searchBtn = document.querySelector('#fsearch-btn');
    searchBtn.addEventListener('click', function() {
        startSearch();
    });

    searchInput = document.querySelector('#fsearch-text');
    searchInput.addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {
            startSearch();
        }
    });

})();