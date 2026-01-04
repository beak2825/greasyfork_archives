// ==UserScript==
// @name         2ch-thread-list
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  thread list instead of board list for 2ch
// @author       anonimuslegion
// @match        https://2ch.hk/*/res/*.html
// @match        http://2ch.hk/*/res/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2ch.hk
// @grant        none
// @license      GNU GPL
// @downloadURL https://update.greasyfork.org/scripts/479258/2ch-thread-list.user.js
// @updateURL https://update.greasyfork.org/scripts/479258/2ch-thread-list.meta.js
// ==/UserScript==
let currentBoard = window.location.pathname.split('/')[1];

function getThreadsList(board, numOfThreads) {
    var threadsList = []
    $.getJSON(`https://2ch.hk/${currentBoard}/catalog.json`, function(data) {
        for (const [key, value] of Object.entries(data.threads)) {
            threadsList.push([value['subject'], value['num'], value['posts_count'], value['files'][0]['thumbnail'], value['comment']])
        }
        generateThreadsCards(threadsList, numOfThreads)
    })
}

function generateThreadsCards(thList, numOfCards) {
    $('#fmenu').empty()
    $('#fmenu').append(`<li class="fm__item">
                          <div class="fm__header" data-header="other">Треды /${currentBoard}/</div>
                          <ul class="fm__sub" id="fm__other" style="padding-left:0px;">
                          </ul>
                        </li>`)
    for (const element of thList.slice(0, numOfCards)) {
        $("#fm__other").append(`
        <li>
          <div class="thread_card" style=" background-color:var(--theme_default_postbg); padding:4px; margin:5px 0px 5px 0px;height:100px;border-radius:3px">
            <div class="thread_card_header" style="display: flex; justify-content: space-between; padding-bottom:3px">
              <a href="/${currentBoard}/res/${element[1]}.html" style="margin:0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"><b>${element[0]}</b></a>
            </div>
            <img src="${element[3]}" style="float:left; object-fit: cover; width: 70px; height: 70px; border-radius: 4px;vertical-align: top;">
            <span style="word-wrap: break-word; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
            text-overflow: ellipsis;padding-left:4px;">${element[4].replace(/<(?!(br|span|strong|a|p)[ >])[a-zA-Z][^>]*>.*?<\/[^>]*>/g,'')}</span>
          </div>
        </li>
        `)
    }
}

$('.cntnt__aside').css('max-width', '18%')
getThreadsList(currentBoard, 50);