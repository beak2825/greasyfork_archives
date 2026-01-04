// ==UserScript==
// @name         ctfshow-auxiliary
// @namespace    http://peterzhang.top/
// @version      0.3
// @description  show again!
// @author       PeterZhang<1809909143@qq.com>
// @match        https://ctf.show/challenges
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434797/ctfshow-auxiliary.user.js
// @updateURL https://update.greasyfork.org/scripts/434797/ctfshow-auxiliary.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const prefix = 't-';

    // style
    $('head').append(
        `<style>
            .content-index-outer{
                position: absolute;
                right: -80px;
                top: 120px;
                height: 100%;
            }
            .content-index{
                position: sticky;
                position: -webkit-sticky;
                top: 80px;
                padding: 5px;
                background-color: #eeeeee;
                overflow-y: scroll;
            }
            .my-link{
                cursor: pointer;
                font-size: 0.8em;
            }
            .my-link:hover{
                background-color: #b9bcbf;
            }
        </style>`
    );

    function refreshContentIndex(records, observer) {
        if (records[0].target.style.display !== 'none' || $('#challenges-board .category-header h3').length < 1) {
            return;
        }
        const outerDiv = $(`<div class="content-index-outer"></div></div>`);
        const div = $(`<div class="content-index">`);
        div[0].style.maxHeight = (window.innerHeight - 100) + 'px';
        outerDiv.append(div);
        $('#challenges-board').append(outerDiv);
        $('#challenges-board .category-header h3').each(function () {
            $(this).attr('id', `${prefix}${$(this).text()}`);
            const a = $(`
                    <div class="my-link">${$(this).text()}</div>
                `);
            a.click(() => {
                $('html, body').animate({scrollTop: $(this).offset().top - 80}, 200);
            });
            div.append(a);
        });
    }

    let observer = new MutationObserver(refreshContentIndex);
    observer.observe($('#chall-load-spinner')[0], {attributes: true});

    // 一些优化
    $('#pages-board').css('top', '70px');
})();