// ==UserScript==
// @name         定型文入力補助
// @namespace    http://tampermonkey.net/
// @version      1.05
// @description  定型文を各入力欄にペーストする機能を追加
// @license      MIT
// @match        *://plus-nao.com/forests/*/mainedit/*
// @match        *://plus-nao.com/forests/*/registered_mainedit/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/509243/%E5%AE%9A%E5%9E%8B%E6%96%87%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/509243/%E5%AE%9A%E5%9E%8B%E6%96%87%E5%85%A5%E5%8A%9B%E8%A3%9C%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
.template-list {
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 5px 10px;
    z-index: 10000;
    position: absolute;
    top: 117px;
    left: -8px;
    width: 480px;
    max-height: 350px;
    overflow: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: none;
}

.template-list div {
    word-break: break-word;
}

.template-div {
    padding-top: 300px;
    padding: 3px 0;
    border-top: 1px solid #ddd;
}

.template-div:first-child {
    border-top: none;
}

.short-text-div {
        flex-grow: 1;
        cursor: pointer;
}

    .template-content {
        height: 0;
        opacity: 0;
        overflow: hidden;
        transition: height 0.3s ease, opacity 0.3s ease;
        font-size: 12px;
        padding-left: 10px;
        color: #333;
    }

    .template-content.show {
        height: auto;
        opacity: 1;
        padding: 5px 0;
    }


.short-text-div, .paste-button-template {
    display: inline-block;

}

.paste-button-template {
    background-color: #ffffff;
    color: #4CAF50;
    border: 1px solid #4CAF50;
    padding: 5px;
    cursor: pointer;
    font-size: 12px;
    margin-left: 5px;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: relative;
    vertical-align: middle;
    transform: scale(0.95);
    text-align: center;
}

.paste-button-template::before {
    content: '📑';
    font-size: 14px;
    display: block;
    position: relative;
    top: -1px;
    left: 1px;
}

.paste-button-template::after {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 34px;
    height: 34px;
    z-index: 0;
}

.paste-button-template:hover {
    background-color: #4CAF50;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.paste-button-template:active {
    background-color: #388E3C;
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.template-button {
    background-color: transparent;
    color: #333;
    border: 1px solid #ccc;
    padding: 4px 10px;
    cursor: pointer;
    font-size: 12px;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: auto;
    width: auto;
    position: absolute;
    bottom: 0;
    left: -170px;
    margin: 0;
}

.template-button::before {
    content: '';
}

.template-button::after {
    content: attr(data-text);
    display: block;
    font-weight: bold;
}

.template-button:hover {
    background-color: #f0f0f0;
    color: #000;
    border-color: #bbb;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.template-button:active {
    background-color: #e0e0e0;
    color: #000;
    border-color: #aaa;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

#content {
    overflow: visible;
}

`);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const templateListDivs = document.querySelectorAll('.template-list');
            templateListDivs.forEach(function(templateListDiv) {
                if (templateListDiv.style.display === 'block') {
                    templateListDiv.style.display = 'none';
                }
            });
        }
    });

    document.addEventListener('click', function(event) {
        const templateListDivs = document.querySelectorAll('.template-list');
        templateListDivs.forEach(function(templateListDiv) {
            if (templateListDiv.style.display === 'block' && !templateListDiv.contains(event.target)) {
                templateListDiv.style.display = 'none';
            }
        });
    });

    function addTemplateButton(targetTextareaId, templates) {

        const targetTextarea = document.getElementById(targetTextareaId);
        if (!targetTextarea) {
            return;
        }

        const container = targetTextarea.parentElement;
        if (!container) {
            return;
        }

        container.style.position = 'relative';

        if (container.querySelector(`button[data-target="${targetTextareaId}"]`)) {
            return;
        }

        const templateButton = document.createElement('button');
        templateButton.textContent = '定型文一覧を表示';
        templateButton.dataset.target = targetTextareaId;
        templateButton.className = 'template-button';

        const templateListDiv = document.createElement('div');
        templateListDiv.className = 'template-list';
        templateListDiv.dataset.target = targetTextareaId;

        templates.forEach(template => {
            const templateDiv = document.createElement('div');
            templateDiv.className = 'template-div';

            const shortTextDiv = document.createElement('div');
            shortTextDiv.className = 'short-text-div';
            shortTextDiv.textContent = template.shortText;

            const templateContentDiv = document.createElement('div');
            templateContentDiv.className = 'template-content';
            templateContentDiv.textContent = template.fullText;
            templateContentDiv.style.whiteSpace = 'pre-wrap';

            shortTextDiv.addEventListener('click', function() {
                const isVisible = templateContentDiv.classList.contains('show');
                if (isVisible) {
                    templateContentDiv.classList.remove('show');
                } else {
                    templateContentDiv.classList.add('show');
                }
            });

            const pasteButton = document.createElement('button');
            pasteButton.className = 'paste-button-template';

            pasteButton.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();

                const existingText = targetTextarea.value;
                if (existingText) {
                    targetTextarea.value += '\n' + template.fullText;
                } else {
                    targetTextarea.value += template.fullText;
                }

                templateListDiv.style.display = 'none';
            });

            templateDiv.appendChild(shortTextDiv);
            templateDiv.appendChild(pasteButton);

            templateListDiv.appendChild(templateDiv);
            templateListDiv.appendChild(templateContentDiv);
        });

        function adjustScrollPosition(templateListDiv) {
            const rect = templateListDiv.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            if (rect.top < 0) {
                window.scrollBy(0, rect.top);
            }

            if (rect.bottom > viewportHeight) {
                window.scrollBy(0, rect.bottom - viewportHeight);
            }
        }

        templateButton.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();

            const isVisible = templateListDiv.style.display === 'block';
            templateListDiv.style.display = isVisible ? 'none' : 'block';

            if (!isVisible) {
                adjustScrollPosition(templateListDiv);
            }

        });

        container.appendChild(templateButton);
        container.appendChild(templateListDiv);
    }

    function adjustTemplateListSize() {
        const templateListDiv = document.querySelector('.template-list');
        const maxWidth = 480;

        const templateDivs = templateListDiv.querySelectorAll('div');
        let maxWidthNeeded = maxWidth;

        templateDivs.forEach(div => {
            const divWidth = div.offsetWidth;
            if (divWidth > maxWidthNeeded) {
                maxWidthNeeded = divWidth;
            }
        });

        templateListDiv.style.width = `${Math.min(maxWidthNeeded, maxWidth)}px`;
    }

    window.addEventListener('load', (event) => {
        const sizeTemplates = [
            { shortText: '【サイズ表提示】', fullText: '画像をご参照ください。' },
            { shortText: '【メンズインナー】', fullText: '商品のタグ表記や在庫表は海外サイズとなっておりますが、\n在庫表の【】内が一般的な日本サイズでございます。' },
            { shortText: '【カップが共通のブラジャー】', fullText: 'カップサイズは〜まで共通です。\nアンダーバストのサイズでお選びください。\n各カップサイズは選択できませんのでご注意ください。' }
        ];

        const colorTemplates = [
            { shortText: '【カラーが選べない場合】', fullText: '※カラーはランダムとなります。色の指定はできませんのでご注意ください。\n　セット商品や複数ご注文いただいた場合でも、全て同じ色の場合もございます。' }
        ];

        const supplementTemplates = [
            { shortText: '【ニット、レース製品、下着、ブラ等】', fullText: '※商品の性質上、手洗いでのお洗濯をお勧めしております。' },
            { shortText: '【色落ちについて】', fullText: '※色落ちする場合がございます。\n　手洗い後、ご着用くださいますようお願い致します。' },
            { shortText: '【タイツ・ストッキング】', fullText: '※稀に織傷がある場合がございます。' },
            { shortText: '【肌に直接貼るアイテム】', fullText: '※肌の弱い方はご使用をお控えください。' },
            { shortText: '【組み立て式／①絶対組み立てる必要があるとき】', fullText: '※ご自身で組み立てる必要がございます※' },
            { shortText: '【組み立て式／②もしかしたら組み立て式かもしれない時】', fullText: '※ご自身での組み立てが必要になる場合もございます※' },
            { shortText: '【透明なプラスチック製品について】', fullText: '傷防止のため、ビニールコーティングしている場合がございますので、\n剥がしてからご使用お願いいたします。' },
            { shortText: '【大型商品】', fullText: '【北海道、沖縄、離島地域にお届けの際は、別途送料が必要になりますので、\n　ご注文前にお問い合わせお願いいたします】' },
            { shortText: '【IQOS製品のアクセサリー】', fullText: '※IQOS本体は付属いたしません。\n※IQOSはフィリップモリスプロダクツS.A.が所有する商標です。\n　本製品は、IQOS純正部品ではありません。\n　純正部品に該当しないアクセサリーは、フィリップモリスプロダクツS.A.の推奨、\n　精査又は支持を一切受けておらず、当該製品に関する一切の責任は、\n　当該製品の販売業者、流通業者、製造業者にあります。\n※無許諾の電子アクセサリーを使用すると、\n　純正IQOSブランド製品の保証が無効になることがあります。' },
            { shortText: '【電池使用商品／簡単に電池を外せる場合】', fullText: '※電池は付属しておりません。' },
            { shortText: '【電池使用商品／簡単に電池を外せない場合】', fullText: '※テスト用電池が入っております。' },
            { shortText: '【殻付き卵の保管用商品】', fullText: '※こちらの製品は、殻付き卵の保管目的でご使用ください。' },
            { shortText: '【対象年齢について／12歳以上】', fullText: '※対象年齢：12歳以上' },
            { shortText: '【対象年齢について／6歳以上】', fullText: '※対象年齢：6歳以上' },
            { shortText: '【火傷しそうな商品について】', fullText: '完全断熱素材ではありませんので、ご使用の際は火傷にご注意ください。' }
        ];

        addTemplateButton('TbMainproductサイズについて', sizeTemplates);
        addTemplateButton('TbMainproductカラーについて', colorTemplates);
        addTemplateButton('TbMainproduct補足説明PC', supplementTemplates);

        adjustTemplateListSize();
    });

})();