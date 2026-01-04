// ==UserScript==
// @name        wnacg-Viewer
// @description wnacg-Viewer 功能：1. 書架管理—快速加入/移除書架；2. 幻燈片模式—自動切換，優化圖片載入；3. 專輯鏈接自動更新—連結至下拉閱讀；4. 關鍵字搜尋—輕鬆查找相關作品。
// @version     2.6.2
// @author      MrDaDaDo
// @match       https://wnacg.com/*
// @match       https://www.wnacg.com/*
// @run-at      document-end
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @namespace   https://github.com/MrDaDaDo/wnacg-Viewer
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/506140/wnacg-Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/506140/wnacg-Viewer.meta.js
// ==/UserScript==

(() => {
    const $ = window.jQuery;

    const genFavBtnId = favId => `add-to-fav-btn-${favId}`;

    const getAid = () => window.location.href.match(/photos-slide-aid-(\d+)\.html/)[1];

    const addToFav = favId => {
        const aid = getAid();
        $.post(`https://www.wnacg.com/users-save_fav-id-${aid}.html`, { favc_id: favId })
            .done(() => {
                const $btn = $(`#${genFavBtnId(favId)}`);
                $btn.addClass('cur');
                alert('加入書架成功');
                setIsInFav(aid, favId);
            })
            .fail(() => {
                alert('加入書架失敗');
            });
    };

    const deleteFav = (favId, link) => {
        const postData = {
            ajax: true,
            _t: Math.random(),
        };
        $.post(link, postData)
            .done(() => {
                alert('移出書架成功');
                const $btn = $(`#${genFavBtnId(favId)}`);
                $btn.removeClass('cur');
                $btn.off('click').on('click', () => addToFav(favId));
            })
            .fail(() => {
                alert('移出書架失敗');
            });
    };

    const setIsInFav = async (aid, favId, page = 1) => {
        const data = await $.get(`https://www.wnacg.com/users-users_fav-page-${page}-c-${favId}.html`);
        if (data.indexOf(`photos-index-aid-${aid}.html`) >= 0) {
            const $btn = $(`#${genFavBtnId(favId)}`);
            $btn.addClass('cur');
            $btn.off('click');
            const $data = $(data);
            $data.find('.box_cel.u_listcon').each(function () {
                const $div = $(this);
                const $targetLink = $div.find(`a[href*='photos-index-aid-${aid}.html']`);
                if ($targetLink.length > 0) {
                    const onclickValue = $div.find("a[onclick*='Mui.box.show']").attr('onclick');
                    const deleteLinkMatch = onclickValue.match(/Mui\.box\.show\('(.+?)'\)/);
                    if (deleteLinkMatch && deleteLinkMatch[1]) {
                        const deleteLink = deleteLinkMatch[1];
                        $btn.on('click', () => deleteFav(favId, deleteLink));
                    }
                }
            });
        } else if (data.indexOf('>後頁') >= 0) {
            setIsInFav(aid, favId, page + 1);
        } else {
            const $btn = $(`#${genFavBtnId(favId)}`);
            $btn.off('click').on('click', () => addToFav(favId));
        }
    };

    const initAddToFavBtn = async ($parent, aid) => {
        const data = await $.get('https://www.wnacg.com/users-users_fav.html');
        const regex = /<label class="nav_label">書架分類：<\/label>([\s\S]*?)<a class="btn_blue" href="\/\?ctl=users&act=favclass">管理分類<\/a>/;
        const match = data.match(regex);
        const favHtml = match[1];
        const favRegex = /users-users_fav-c-(\d+).html ">(.*?)</g;
        let favMatch;
        while ((favMatch = favRegex.exec(favHtml)) !== null) {
            const [favId, favName] = [favMatch[1], favMatch[2]];
            const btnId = genFavBtnId(favId);
            const $btn = $(`<a id="${btnId}">${favName}</a>`);
            $parent.append($btn);
            $btn.css('cursor', 'pointer');
            $(`#${btnId}`).click(() => addToFav(favId));
            setIsInFav(getAid(), favId, aid);
        }
    };

    const genImageDivHtml = (imageSrc, index, total) => `
        <div style="text-align:center;color:#999;padding-bottom:10px;font-size:13px;">
            <img src="${imageSrc}" width="960px"><br>
            <span>${index}/${total}</span>
        </div>
    `;

    const viewSlide = imageSrcList => {
        $('#shareBox, #control_block, #mask_panel, #cite_vote, #page_scale, .header, .footer').remove();
        const $parent = $('#img_list').parent();
        $('#img_list, #img_load').remove();
        const $favLabel = $('<label class="nav_list" style="display: block; text-align: center; margin: 0 auto;"></label>');
        $parent.append($favLabel);
        initAddToFavBtn($favLabel);
        const $imgDiv = $('<div id="wnacg-viewer-img-list"></div>');
        $parent.append($imgDiv);
        const title = document.title.replace(' - 列表 - 紳士漫畫-專註分享漢化本子|邪惡漫畫', '');
        const $titleDiv = $('<div id="wnacg-viewer-title" style="text-align:center;color:#999;padding-bottom:10px;font-size:26px;"></div>');
        const regex = /\[([^\[\]]+?)\]/g;
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(title)) !== null) {
            if (match.index > lastIndex) {
                $titleDiv.append(title.slice(lastIndex, match.index));
            }
            const searchKeyword = match[1];
            const $link = $(`<a href="https://www.wnacg.com/search/?q=${searchKeyword}&f=_all&s=create_time_DESC&syn=yes" target="_blank" style="color: #4A90E2;">${searchKeyword}</a>`);
            $titleDiv.append('[').append($link).append(']');
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < title.length) {
            $titleDiv.append(title.slice(lastIndex));
        }
        $imgDiv.append($titleDiv);

        const batchSize = 10;
        let currentBatch = 0;
        const loadNextBatch = () => {
            const startIndex = currentBatch * batchSize;
            const endIndex = Math.min(startIndex + batchSize, imageSrcList.length);
            for (let i = startIndex; i < endIndex; i++) {
                $imgDiv.append(genImageDivHtml(imageSrcList[i], i + 1, imageSrcList.length));
            }
            currentBatch++;
            if (startIndex < imageSrcList.length) {
                setTimeout(loadNextBatch, 2000);
            }
        };
        loadNextBatch();
    };

    const goSlide = () => {
        const photosGalleryScriptUrl = location.href.replace('photos-slide-aid', 'photos-gallery-aid');
        $.get(photosGalleryScriptUrl, scripts => {
            const imageSrcList = scripts.split('\n')
                .filter(script => script.includes('var imglist'))
                .flatMap(script => script.match(/\/\/[^"]+/gm).map(urlString => urlString.replace('\\', '')));
            viewSlide(imageSrcList);
        });
    };

    const goAlbums = () => {
        $('.pic_box a').each((index, element) => {
            const $linkElement = $(element);
            const href = $linkElement.attr('href');
            $linkElement.attr('href', href.replace('index', 'slide'));
        });
    };

    const url = window.location.href;
    if (url === 'https://www.wnacg.com/' || url.startsWith('https://www.wnacg.com/albums') || url.startsWith('https://www.wnacg.com/search')) {
        goAlbums();
    } else if (url.startsWith('https://www.wnacg.com/photos-slide-aid')) {
        goSlide();
    }
})();