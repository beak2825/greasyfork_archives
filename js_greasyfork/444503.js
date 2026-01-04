// ==UserScript==
// @name         Re:AcT Schedule Filter
// @namespace    https://github.com/AyeBee/ReAcTScheduleFilter
// @version      0.1
// @description  Re:AcT Schedule にメンバー別のフィルター機能を追加する。
// @author       ayebee
// @match        https://schedule.v-react.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v-react.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444503/Re%3AAcT%20Schedule%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/444503/Re%3AAcT%20Schedule%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TODO: 公式チャンネルがこのままだと表示されない

    const makeCheckbox = (label, onChangeEvent) => {
        const control = document.createElement('input');
        control.type = 'checkbox';
        control.value = label;
        control.checked = true;
        if (onChangeEvent) {
            control.addEventListener('change', onChangeEvent);
        }

        const labelText = document.createElement('span');
        labelText.textContent = label;

        const wrapper = document.createElement('label');
        wrapper.style.paddingRight = '1em';
        wrapper.style.whiteSpace = 'nowrap';
        wrapper.append(control);
        wrapper.append(labelText);

        return [control, wrapper, labelText];
    };

    const toggleVisiblityAllStream = () => {
        const visible = Array.from(filters.querySelectorAll('input')).filter(i => i.checked).map(i => i.value);

        for (const row of document.querySelectorAll('.scheduleItemArea > .row')) {
            let visibleChildrenCount = row.children.length;

            for (const col of row.children) {
                // 配信者・参加者の一覧に, 表示対象の配信者が含まれない場合, その配信を非表示にする
                const streamers = Array.from(col.querySelectorAll('.item__appearances .appearancesIcon'))
                        .map(e => e.alt?.trim());
                if (streamers.filter(v => visible.includes(v)).length === 0) {
                    col.style.display = 'none';
                    visibleChildrenCount--;
                } else {
                    col.style.display = 'block';
                }
            }

            // 当日の配信が1件もない場合, その日の列を非表示にする
            if (visibleChildrenCount === 0) {
                row.parentNode.parentNode.style.display = 'none';
            } else {
                row.parentNode.parentNode.style.display = 'flex';
            }
        }
    };

    const visibleAllStreams = () => {
        for (const row of document.querySelectorAll('.scheduleItemArea > .row')) {
            for (const col of row.children) {
                col.style.display = 'block';
            }
            row.parentNode.parentNode.style.display = 'flex';
        }
    };

    const resize = () => {
        document.querySelector('.v-main__wrap > div').style.paddingBottom = filtersWrapper.clientHeight + 'px';
    };

    const filters = document.createElement('div');

    const [filterAll, filterAllLabel,] = makeCheckbox('すべて選択', e => {
        if (e.target.checked) {
            Array.from(filters.querySelectorAll('input')).forEach(item => item.checked = true);
        } else {
            Array.from(filters.querySelectorAll('input')).forEach(item => item.checked = false);
        }
        toggleVisiblityAllStream();
    });

    filters.append(filterAllLabel);

    [   '射貫まとい', '宇佐美ユノ', '獅子神レオナ', '花鋏キョウ', '水瓶ミア', '夢川かなう',
        '天川はの', '姫熊りぼん', '丸餅つきみ', '風海みかん', '月紫アリア', '猫乃ユキノ',
        '皇ロゼ', '九楽ライ', 'かしこまり', '魔光リサ', '彩雲のの', '稀羽すう',
        '紅龍イサナ', '美睡シュカ', 'ククルア・クレイユ', '音伽ねむ', '神輿たらん',
        /*
        '雷輝アンタレス', '鞍馬つむぎ', '琴みゆり', '綺羅星ウタ', '早乙女ぽえむ',
        '折緒コウヤ', '星屑れん', '美影ルクス', '湊音みなみ',
        '丑牡てぃあ', '双理マイ', '多々星シエル', '天秤はかり', '夜霧メイ',
        '皇噛ユカリ', '唯牙コハク', 'ゆにゆにこ', '瀧上りと', '白音ゆき', '黒音よみ',
        '犬望チロル',  '出雲めぐる', '久檻夜くぅ', '碧那アイル',
        '黄葉いおり', '輝澄カレン', '猫海せな',
        */
    ].forEach(item => {
        const [,wrapper,] = makeCheckbox(item, toggleVisiblityAllStream);
        filters.append(wrapper);
    });

    const [useFilteringCheckbox, useFilteringWrapper, useFilteringLabel] = makeCheckbox(
            'フィルタを無効にする ▼', e => {
        if (useFilteringCheckbox.checked) {
            useFilteringLabel.textContent = 'フィルタを無効にする ▼';
            filters.style.display = 'block';
            toggleVisiblityAllStream();
        } else {
            useFilteringLabel.textContent = 'フィルタを有効にする ▲';
            filters.style.display = 'none';
            visibleAllStreams();
        }
        resize();
    });
    useFilteringCheckbox.style.display = 'none';

    useFilteringWrapper.style.display = 'block';
    useFilteringWrapper.style.backgroundColor = '#272727';

    const filtersWrapper = document.createElement('div');
    filtersWrapper.style.fontSize = '12px';
    filtersWrapper.style.width = '100%';
    filtersWrapper.style.backgroundColor = '#333';
    filtersWrapper.style.boxShadow = '0 0px 10px 0 rgb(0 0 0 / 80%)';
    filtersWrapper.style.color = '#fff';
    filtersWrapper.style.position = 'fixed';
    filtersWrapper.style.bottom = 0;
    filtersWrapper.style.zIndex = 9999;
    filtersWrapper.append(useFilteringWrapper);
    filtersWrapper.append(filters);
    document.querySelector('.v-main__wrap > div').append(filtersWrapper);

    window.addEventListener('resize', resize);
    useFilteringCheckbox.click();
    resize();
})();
