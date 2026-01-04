// ==UserScript==
// @name         （公式対応につき廃止）ニコニコ動画（Re:仮）動画10連ガチャ増設
// @namespace    https://twitter.com/kiritannplum
// @version      1.3
// @description  ニコニコ動画（Re:仮）の動画視聴ページに動画10連ガチャを設置します　※公式が同じ機能を追加してくれました。コメントアウトにて機能停止しています。
// @author       @kiritannplum
// @match        https://www.nicovideo.jp/watch_tmp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497962/%EF%BC%88%E5%85%AC%E5%BC%8F%E5%AF%BE%E5%BF%9C%E3%81%AB%E3%81%A4%E3%81%8D%E5%BB%83%E6%AD%A2%EF%BC%89%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%EF%BC%88Re%3A%E4%BB%AE%EF%BC%89%E5%8B%95%E7%94%BB10%E9%80%A3%E3%82%AC%E3%83%81%E3%83%A3%E5%A2%97%E8%A8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/497962/%EF%BC%88%E5%85%AC%E5%BC%8F%E5%AF%BE%E5%BF%9C%E3%81%AB%E3%81%A4%E3%81%8D%E5%BB%83%E6%AD%A2%EF%BC%89%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%8B%95%E7%94%BB%EF%BC%88Re%3A%E4%BB%AE%EF%BC%89%E5%8B%95%E7%94%BB10%E9%80%A3%E3%82%AC%E3%83%81%E3%83%A3%E5%A2%97%E8%A8%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ガチャを挿入する
    function appendGacha() {
        // 要素を挿入する要素
        var mainElement = document.querySelector('main').firstElementChild;

        const gachaContainer = document.createElement('div');
        mainElement.appendChild(gachaContainer);
        gachaContainer.classList.add('d_flex', 'flex_column');
        gachaContainer.setAttribute('id', 'gacha-container');

        // ボタンが押された時の処理
        const handler = gachaButtonClick;

        // ボタンを作成
        const buttonContainer = createButtonContainer('動画10連ガチャを回す', handler);
        gachaContainer.appendChild(buttonContainer);
    }

    // ボタンがクリックされた
    async function gachaButtonClick() {
        // APIのURL
        const gachaApiUrl = 'https://nvapi.nicovideo.jp/v1/tmp/videos?count=10&_frontendId=6&_frontendV';

        // APIからJSONデータを取得する
        let result = await fetch(gachaApiUrl)
        .then((response) => {
            //ここでBodyからJSONを返す
            return response.json()
        })

        const gachaContainer = document.getElementById('gacha-container');

        if(result.meta.status == 200){
            const gachaResultContainer = document.createElement('div');
            gachaResultContainer.classList.add('pos_relative', 'p_16px_0', 'min-h_calc({sizes.VideoCard.height}_*_2_+_16px_*_3)');

            const resultList = document.createElement('ul');
            gachaResultContainer.appendChild(resultList);
            resultList.classList.add('d_flex', 'flex-wrap_wrap', 'justify_center', 'gap_16px');

            const videos = result.data.videos;
            videos.forEach(video => {
                const listItem = document.createElement('li');
                resultList.appendChild(listItem);

                const item_a = document.createElement('a');
                listItem.appendChild(item_a);
                // 動画URL
                item_a.href = `/watch_tmp/${video.id}`;
                item_a.classList.add('text_inherit', 'text-decor_none', '[&amp;:hover]:text-decor_underline');

                const item_a_div = document.createElement('div');
                item_a.appendChild(item_a_div);
                item_a_div.classList.add(
                    'ssOnly:w_calc(100dvw_-_16px_*_2)',
                    'sm:w_224px',
                    'ssOnly:max-w_360px',
                    'sm:max-w_auto',
                    'ssOnly:min-h_auto',
                    'sm:min-h_{sizes.VideoCard.height}',
                    'pos_relative',
                    'd_flex',
                    'flex_column',
                    'gap_8px',
                    'overflow_hidden',
                    'rounded_8px',
                    'shadow_1px_2px_3px_rgba(0,_0,_0,_0.25)'
                );

                const item_a_div_div1 = document.createElement('div');
                item_a_div.appendChild(item_a_div_div1);
                item_a_div_div1.classList.add('pos_relative', 'w_100%', 'aspect_16_/_9', 'bg_#000');
                // リスト用動画サムネURL
                item_a_div_div1.style.backgroundImage = `url('${video.thumbnail.listingUrl}')`;
                item_a_div_div1.style.backgroundSize = 'contain';
                item_a_div_div1.style.backgroundPosition = 'center center';
                item_a_div_div1.style.backgroundRepeat = 'no-repeat';

                const item_a_div_div1_span = document.createElement('span');
                item_a_div_div1.appendChild(item_a_div_div1_span);
                item_a_div_div1_span.classList.add(
                    'font_alnum',
                    'rounded_4px',
                    'pos_absolute',
                    'right_8px',
                    'bottom_8px',
                    'bg_rgba(38,_38,_38,_0.8)',
                    'border_1px_solid_#333',
                    'text_#fff',
                    'fs_11px',
                    'p_1px_5px'
                );
                // 動画の長さ
                item_a_div_div1_span.innerHTML = secToTime(video.duration);

                const item_a_div_div2 = document.createElement('div');
                item_a_div.appendChild(item_a_div_div2);
                item_a_div_div2.classList.add('d_flex', 'flex_column', 'gap_4px', 'p_0_8px_8px');

                const item_a_div_div2_h2 = document.createElement('h2');
                item_a_div_div2.appendChild(item_a_div_div2_h2);
                item_a_div_div2_h2.classList.add('fs_13px', 'm_0', 'max-h_calc(2_*_1.5em)', 'leading_1.5em', 'clamp_2', 'overflow_hidden');
                // 動画タイトル
                item_a_div_div2_h2.innerHTML = video.title;

                const item_a_div_div2_p1 = document.createElement('p');
                item_a_div_div2.appendChild(item_a_div_div2_p1);
                item_a_div_div2_p1.classList.add('fs_11px', 'text_#666', 'max-h_calc(3_*_1.5em)', 'leading_1.5em', 'clamp_3', 'overflow_hidden');
                // 動画説明文冒頭
                item_a_div_div2_p1.innerHTML = video.shortDescription;

                const item_a_div_div2_p2 = document.createElement('p');
                item_a_div_div2.appendChild(item_a_div_div2_p2);
                item_a_div_div2_p2.classList.add('fs_11px', 'text_#666', 'h_calc(1_*_1.5em)', 'leading_1.5em', 'clamp_1', 'overflow_hidden');
                // 謎のpタグ

                const item_a_div_p = document.createElement('p');
                item_a_div.appendChild(item_a_div_p);
                item_a_div_p.classList.add('pos_absolute', 'right_8px', 'bottom_8px', 'fs_11px', 'text_#666', 'max-h_calc(1_*_1.5em)', 'leading_1.5em');
                // 投稿日時
                item_a_div_p.innerHTML = iso8601ToString(video.registeredAt);
            });

            if (gachaContainer.childElementCount < 2) {
                // 初回ガチャなら
                // ガチャリザルトを挿入
                gachaContainer.appendChild(gachaResultContainer);

                // ボタンのテキストを変更
                const buttonText = gachaContainer.firstElementChild.querySelector('span');
                buttonText.innerHTML = 'もう一度10連ガチャを回す';
            } else {
                const oldResult = gachaContainer.children[1];

                // 新しい結果で差し替える
                gachaContainer.replaceChild(gachaResultContainer, oldResult);
            }

        } else {
            // 通常通りに取得できなければ

            const oldResult = gachaContainer.children[1];

            const newResult = document.createElement('div');
            newResult.style.alignSelf = 'center';
            newResult.style.fontWeight = 'bold';
            newResult.style.color = 'red';

            const resultSpan = document.createElement('span');
            newResult.appendChild(resultSpan);
            // エラー表示
            resultSpan.innerHTML = `動画取得エラー:${result.meta.status}`

            // 新しい結果で差し替える
            gachaContainer.replaceChild(newResult, oldResult);
        }

        gachaContainer.scrollIntoView({
            behavior: 'smooth'
        });
    }

    // 秒数を時間表記にする
    function secToTime(seconds) {
        const hour = Math.floor(seconds / 3600);
        const min = Math.floor(seconds % 3600 / 60);
        const sec = seconds % 60;

        const hh = hour.toString().padStart(2, '0');
        const mm = min.toString().padStart(2, '0');
        const ss = sec.toString().padStart(2, '0');

        let time = '';
        if(hour !==0 ) {
            time = `${hh}:${mm}:${ss}`;
        } else {
            time = `${mm}:${ss}`;
        }
        return time;
    }

    // ISO8601文字列を既定形式の文字列に起こす
    function iso8601ToString(iso8601) {
        const date = new Date(iso8601);

        const yyyy = date.getFullYear().toString();
        // 月は0始まりなので1足す
        const MM = (date.getMonth() + 1).toString().padStart(2, '0');
        const dd = date.getDay().toString().padStart(2, '0');

        const hh = date.getHours().toString().padStart(2, '0');
        const mm = date.getMinutes().toString().padStart(2, '0');
        //const ss = date.getSeconds().toString().padStart(2, '0');

        const text = `${yyyy}/${MM}/${dd} ${hh}:${mm}`;
        return text;
    }

    // ガチャボタン周りを作成
    function createButtonContainer(text, handler) {
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('self_center', 'justify-self_center');

        // button作成
        const button = document.createElement('button');
        buttonContainer.appendChild(button);
        button.classList.add('d_flex', 'items_center', 'cursor_pointer', 'fs_14px', 'gap_4px', 'active:transform_translate(1px,_1px)')
        // onclickイベントを登録
        button.addEventListener('click', handler);

        // リロードマーク作成
        const iconSvg = document.createElementNS('http://www.w3.org/2000/svg','svg');
        button.appendChild(iconSvg);
        iconSvg.setAttribute('width','24');
        iconSvg.setAttribute('height','24');
        iconSvg.setAttribute('viewBox','0 0 24 24');
        iconSvg.classList.add('cursor_pointer', 'fill_#888', 'p_2px', 'w_1.8em', 'h_1.8em');

        // リロードマークのパス
        const svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        iconSvg.appendChild(svgPath);
        svgPath.setAttribute('d', 'M16.25 6.64a6.84 6.84 0 1 0 1.99 8.18.7.7 0 0 1 1.07-.28l.6.43c.28.2.37.58.23.89A9.02 9.02 0 0 1 3 12a9 9 0 0 1 15.12-6.6l1.38-.9a.72.72 0 0 1 1.11.55l.39 5.72a.72.72 0 0 1-1.05.69l-5.09-2.62a.72.72 0 0 1-.07-1.24z');
        // ボタンのテキスト
        const buttonText = document.createElement('span');
        button.appendChild(buttonText);
        buttonText.innerHTML = text;

        return buttonContainer;
    }

    // ガチャを挿入する
    // 公式で10連ガチャ機能を追加してくれたので廃止します。
    //setTimeout(appendGacha,1000);
})();
