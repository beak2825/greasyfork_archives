// ==UserScript==
// @name         LZT_Share
// @namespace    MeloniuM/LZT
// @version      1.3
// @description  Добавляет кнопку "Поделиться"
// @author       MeloniuM
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517057/LZT_Share.user.js
// @updateURL https://update.greasyfork.org/scripts/517057/LZT_Share.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const selector = '.threadCounters, .discussionListItem, .controls, .messageMeta .publicControls, .commentControls .publicControls, .threadLastPost';
    $("<style/>").text(`
    .shareButton .icon:hover {
        background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9InJnYigwLCAxODYsIDEyMCkiPjwhLS0hRm9udCBBd2Vzb21lIEZyZWUgNi42LjAgYnkgQGZvbnRhd2Vzb21lIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20gTGljZW5zZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tL2xpY2Vuc2UvZnJlZSBDb3B5cmlnaHQgMjAyNCBGb250aWNvbnMsIEluYy4tLT48cGF0aCBkPSJNMzA3IDM0LjhjLTExLjUgNS4xLTE5IDE2LjYtMTkgMjkuMmwwIDY0LTExMiAwQzc4LjggMTI4IDAgMjA2LjggMCAzMDRDMCA0MTcuMyA4MS41IDQ2Ny45IDEwMC4yIDQ3OC4xYzIuNSAxLjQgNS4zIDEuOSA4LjEgMS45YzEwLjkgMCAxOS43LTguOSAxOS43LTE5LjdjMC03LjUtNC4zLTE0LjQtOS44LTE5LjVDMTA4LjggNDMxLjkgOTYgNDE0LjQgOTYgMzg0YzAtNTMgNDMtOTYgOTYtOTZsOTYgMCAwIDY0YzAgMTIuNiA3LjQgMjQuMSAxOSAyOS4yczI1IDMgMzQuNC01LjRsMTYwLTE0NGM2LjctNi4xIDEwLjYtMTQuNyAxMC42LTIzLjhzLTMuOC0xNy43LTEwLjYtMjMuOGwtMTYwLTE0NGMtOS40LTguNS0yMi45LTEwLjYtMzQuNC01LjR6Ii8+PC9zdmc+")
    }
    .shareButton .icon {
        width: 24px;
        height: 24px;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9InJnYigxNDAsIDE0MCwgMTQwKSI+PCEtLSFGb250IEF3ZXNvbWUgRnJlZSA2LjYuMCBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIENvcHlyaWdodCAyMDI0IEZvbnRpY29ucywgSW5jLi0tPjxwYXRoIGQ9Ik0zMDcgMzQuOGMtMTEuNSA1LjEtMTkgMTYuNi0xOSAyOS4ybDAgNjQtMTEyIDBDNzguOCAxMjggMCAyMDYuOCAwIDMwNEMwIDQxNy4zIDgxLjUgNDY3LjkgMTAwLjIgNDc4LjFjMi41IDEuNCA1LjMgMS45IDguMSAxLjljMTAuOSAwIDE5LjctOC45IDE5LjctMTkuN2MwLTcuNS00LjMtMTQuNC05LjgtMTkuNUMxMDguOCA0MzEuOSA5NiA0MTQuNCA5NiAzODRjMC01MyA0My05NiA5Ni05Nmw5NiAwIDAgNjRjMCAxMi42IDcuNCAyNC4xIDE5IDI5LjJzMjUgMyAzNC40LTUuNGwxNjAtMTQ0YzYuNy02LjEgMTAuNi0xNC43IDEwLjYtMjMuOHMtMy44LTE3LjctMTAuNi0yMy44bC0xNjAtMTQ0Yy05LjQtOC41LTIyLjktMTAuNi0zNC40LTUuNHoiLz48L3N2Zz4=")
    }
    .discussionListMainPage .threadCounters .shareButton.counter {
        padding: 0 10px;
    }
    .threadLastPost .shareButton{
        display: flex;
        align-items: center;
        margin-right: 0;
        margin-left: auto;
        z-index: 10;
    }
    .controls .shareButton .icon{
        padding: 0px 5px;
        background-image: none;
        color: rgb(82, 80, 80);
    }
    .controls .shareButton .icon:hover{
        color: rgb(148, 148, 148);
    }
    .controls .shareButton .icon:before{
        content: "\\f064";
        font-size: 16px;
    }
    .conversationItem {
        padding: 8px 15px;
        overflow: hidden;
        cursor: pointer;
    }
    .share-modal {
        background-color: rgb(39, 39, 39);
        border-radius: 10px;
        margin: 0;
    }
    .share-modal .shareTo{
        margin: 10px 10px;
        padding: 0 10px;
        background: #2f2f2f;
        border-radius: 8px;
        line-height: 40px;
        display: inline-block;
        font-weight: 800;
        width: 100%;
        height: 50px;
        max-width: -webkit-fill-available;
        text-decoration: none;
        align-content: center;
    }
    .share-modal .shareTo:hover{
        cursor: pointer;
        background: #363636;
    }
    .share-modal .shareTo > div{
        display: flex;
        text-align: center;
        justify-content: center;
        vertical-align: middle;
        line-height: normal;
        align-items: center;
    }
    .shareTo .tg_icon {
        font-size: 20px;
        line-height: 42px;
        float: left;
        margin: 0 5px;
    }
    .shareTo .tg_icon::before {
        content: '\\f3fe';
        color: rgb(34, 142, 93);
        display: inline-block;
    }
    .shareTo .repost_icon {
        font-size: 16px;
        line-height: 42px;
        float: left;
        margin: 0 10px;
    }
    .shareTo .repost_icon::before{
        content: '\\f079';
        color: rgb(34, 142, 93);
        display: inline-block;
    }
    .share-modal .conversationItem .title {
        display: flex;
        justify-content: space-between;
    }
    `).appendTo("head");
    XenForo.scriptLoader.loadCssAsync(['conversation'], "css.php?css=__sentinel__&style=30&dir=LTR")

    XenForo.addShareButton = function($element) {
    if ($element.find('.shareButton').length === 0) {

        const $button = $(`<a class="shareButton item control counter Tooltip" title="Поделиться" data-placement="bottom"><span class="icon"></span></a>`);
        let href = ''
        if ($element.is('.controls')) {
            $element = $element.closest('.discussionListItem').first();//костыль для разделов кроме кроме mainpage
        }
        if ($element.is('.threadCounters')) {//в других разделах
            $element = $element.siblings('.controls_prefixes').find('.controls').first();
            href = $element.closest('.discussionListItem').find('.threadHeaderTitle a').attr('href');
        } else if ($element.is('.discussionListItem:not(:has(.threadCounters))')) {//в других разделах
            $element = $element.find('.controls').first();
            href = $element.siblings('.main').attr("href")
        } else if ($element.is('.messageMeta .publicControls') && !$element.closest('#ProfilePostList').length) {//пост в теме
            href = $element.siblings('.privateControls').find('.datePermalink').data('href').replace('permalink', '');
            //кажетя проще из id ссылку делать $element.closest('.message').attr('id').replace('-', 's/')
        } else if ($element.is('.commentControls .publicControls')) {//коммент
            if ($element.closest('#ProfilePostList').length) { //в профиле
                href = $element.closest('.comment').attr('id').replace('profile-post-comment-', 'profile-posts/comments/');
            } else {
                href = $element.siblings('.datePermalink').attr("href");//в теме
            }
        } else if ($element.is('.threadLastPost')) {//коммент на главной странице
            href = $element.find('.threadLastPost--date').attr("href");
        } else if ($element.closest('#ProfilePostList').length) {//сообщение в профиле
            href = $element.closest('#ProfilePostList').find('.messageSimple .post-header .messageInfo .item.muted').attr("href");
        }

        if (!href) {
            return;
        }
        $button.attr("data-href", href);

        // Можно добавить обработчик клика для кнопки, если это нужно
        $button.on('click', function(e) {
            e.preventDefault();
            // Логика, которая должна выполняться при клике на кнопку
            XenForo.ajax('/conversations/', {}, function(ajaxData) {
                if ($(".tippy-popper").length) {
                    $(".tippy-popper").remove();
                }
                let $ShareList = $(ajaxData.templateHtml);
                let $modal = $(`<div class=\"sectionMain\"><h2 class=\"heading h1\">Поделиться</h2>
                <div style="display: flex;">
                 <a href="tg://msg_url?url=${encodeURIComponent(`${location.origin}/${$button.data('href')}`)}" class="shareTo" target="_blank">
                  <div>
                    <span class="fab tg_icon"></span>
                    <div>Отправить в Telegram</div>
                  </div>
                 </a>
                 <div class="shareTo repost">
                  <div>
                    <span class="fa repost_icon"></span>
                    <div>Репост на стену</div>
                  </div>
                 </div>
                </div>
                <div class="messagesGroupDate" style="opacity: 1;"><span class="messagesGroupDateSpan">или отправить в лс</span></div>
                <ul class="ShareList"></ul></div>`);
                $modal.find('.ShareList').append($ShareList);
                $modal.find('.shareTo.repost').on('click', (e) => {
                    XenForo.ajax(`/members/${XenForo.visitor.user_id}/post`, {message_html: `[unfurl]${location.origin}/${$button.data('href')}[/unfurl]`});
                    $button.data("overlay").close();
                })
                let conversationItem = $modal.find('.conversationItem')
                conversationItem.on('click', (e) => {
                    let $target = $(e.currentTarget);
                    XenForo.ajax(`${$target.data('href')}/insert-reply`, {message_html: `[unfurl]${location.origin}/${$button.data('href')}[/unfurl]`});
                    $button.data("overlay").close();
                })
                new XenForo.ExtLoader(ajaxData, function() {
                    if ($button.data("overlay")) {
                        $button.data("overlay").getOverlay().children('.sectionMain').replaceWith($modal)
                        $button.data("overlay").load();
                        return;
                    }
                    XenForo.createOverlay(null, $modal, {
                        className: "share-modal",
                        trigger: $button,
                        severalModals: true
                    });

                    $button.data("overlay").load();
                });
            });
        });
        // Добавляем кнопку в нужное место внутри элемента
        $element.append($button).xfActivate();
    }
};

    XenForo.register(selector, 'XenForo.addShareButton');

    // Чё оно сразу не активируется?
    $(selector).each(function(index) {
        XenForo.create('XenForo.addShareButton', $(this));
    });

})();
