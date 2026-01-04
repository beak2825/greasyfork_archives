// ==UserScript==
// @name         タグ整列
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  タグの色付けと整列
// @match        https://main.next-engine.com/Userjyuchu/jyuchuInp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537670/%E3%82%BF%E3%82%B0%E6%95%B4%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/537670/%E3%82%BF%E3%82%B0%E6%95%B4%E5%88%97.meta.js
// ==/UserScript==

(function() {

    const TAG_COLORS = {
        "モール未処理":      { bg: "rgb(251, 246, 173)", color: "rgb(0, 0, 0)" },
        "モールキャンセル":  { bg: "rgb(255, 161, 10)", color: "rgb(0, 0, 0)" },
        "楽天チャット":      { bg: "rgb(177, 22, 25)", color: "rgb(255, 255, 255)" },
        "LINE":             { bg: "rgb(63, 255, 10)", color: "rgb(0, 0, 0)" },
        "返品or交換":        { bg: "rgb(29, 147, 6)", color: "rgb(255, 255, 255)" },
        "住所不明":          { bg: "rgb(224, 128, 209)", color: "rgb(0, 0, 0)" },
        "入荷待ち":          { bg: "rgb(227, 255, 10)", color: "rgb(0, 0, 0)" },
        "Yahooチャット":     { bg: "rgb(255, 133, 10)", color: "rgb(0, 0, 0)" },
        "キャンセル伺い":    { bg: "rgb(243, 79, 108)", color: "rgb(0, 0, 0)" },
        "モール保留":        { bg: "rgb(69, 211, 84)", color: "rgb(0, 0, 0)" }
    };

    function addCustomStyles() {
        if (document.getElementById('custom-tag-input-style')) return;
        const style = document.createElement('style');
        style.id = 'custom-tag-input-style';
        style.textContent = `
#tag_input.custom-style {
    -webkit-text-size-adjust: 100%;
    --color-capturing: #8f8;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #333333;
    font-size: 11px;
    line-height: 18px;
    box-sizing: border-box;
    padding: 3px 6px 2px 6px;
    width: 100%;
    background-color: #fdfdfd;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    letter-spacing: 0;
    position: relative;
}
#tag_input.custom-style a {
    -webkit-text-size-adjust: 100%;
    --color-capturing: #8f8;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 11px;
    box-sizing: border-box;
    color: #000;
    border: 1px solid #000;
    border-radius: 9px;
    display: inline-block;
    font-weight: bold;
    letter-spacing: normal;
    line-height: 1.2;
    margin-bottom: 4px;
    margin-right: 4px;
    text-decoration: none;
    padding: 1px 4px;
    outline: none;
    word-break: break-all;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    transition: background-color 0.2s ease;
}
#tag_input.custom-style a.selected-tag {
    outline: 2px solid #0078d7 !important;
    box-shadow: 0 0 0 3px rgba(0,120,215,0.25);
    position: relative;
}
#tag_input.custom-style a.selected-tag::after {
    content: "✓";
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 13px;
    color: #0078d7;
    border: 2px solid #0078d7;
    background: #fff;
    border-radius: 50%;
    padding: 0 2px;
    font-weight: bold;
    box-sizing: border-box;
}
    `;
        document.head.appendChild(style);
    }

    function isOldStyle() {
        const items = document.querySelectorAll('ul.sub_menu li.style-change');
        for (const item of items) {
            if (item.getAttribute('data-style-id') === '0' && item.classList.contains('style-checked')) {
                return true;
            }
        }
        return false;
    }

    function getSelectedTags() {
        const jyuchuTagTextarea = document.getElementById('jyuchu_tag');
        if (!jyuchuTagTextarea) return [];
        const rawText = jyuchuTagTextarea.value || '';
        const matches = rawText.match(/\[([^\]]+)\]/g);
        if (!matches) return [];
        const tags = matches.map(s => s.replace(/^\[|\]$/g, '').trim()).filter(s => s.length > 0);
        return tags;
    }

    function applyCustomStyle() {
        const tagInput = document.getElementById('tag_input');
        if (!tagInput) return;

        tagInput.classList.add('custom-style');

        const selectedTags = getSelectedTags();

        const anchors = tagInput.querySelectorAll('a');
        anchors.forEach(a => {
            const text = a.textContent.trim();

            if (TAG_COLORS.hasOwnProperty(text)) {
                a.style.backgroundColor = TAG_COLORS[text].bg;
                a.style.color = TAG_COLORS[text].color;
                a.style.border = '1.5px solid #000';
            } else {
                a.style.backgroundColor = '';
                a.style.color = '';
                a.style.border = '';
            }

            if (selectedTags.includes(text)) {
                a.classList.add('selected-tag');
            } else {
                a.classList.remove('selected-tag');
            }

            if (!a.dataset.listenerAdded) {
                a.addEventListener('click', function(e) {
                    const jyuchuTagTextarea = document.getElementById('jyuchu_tag');
                    if (!jyuchuTagTextarea) return;

                    if (a.classList.contains('selected-tag')) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();

                        const tagPattern = new RegExp(`\\s*\\[${escapeRegExp(text)}\\]\\s*`, "g");
                        jyuchuTagTextarea.value = jyuchuTagTextarea.value.replace(tagPattern, " ");
                        jyuchuTagTextarea.value = jyuchuTagTextarea.value.replace(/\s+/g, " ").trim();

                        const event = new Event('input', { bubbles: true });
                        jyuchuTagTextarea.dispatchEvent(event);

                    } else {
                        const event = new Event('input', { bubbles: true });
                        jyuchuTagTextarea.dispatchEvent(event);
                    }

                    setTimeout(applyCustomStyle, 10);
                }, true);

                a.dataset.listenerAdded = 'true';
            }

        });
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }


    function observeTagInput() {
        const tagInput = document.getElementById('tag_input');
        if (!tagInput || tagInput.dataset.observerAdded) return;

        const observer = new MutationObserver(() => {
            applyCustomStyle();
        });

        observer.observe(tagInput, { childList: true, subtree: true });
        tagInput.dataset.observerAdded = 'true';
    }

    let prevDenpyoNo = null;
    setInterval(() => {
        const denpyoInput = document.getElementById('jyuchu_denpyo_no');
        if (!denpyoInput) return;
        const nowNo = denpyoInput.value;
        if (prevDenpyoNo !== nowNo) {
            prevDenpyoNo = nowNo;
            applyCustomStyle();
        }
    }, 700);

    window.addEventListener('load', () => {
        if (isOldStyle()) {
            addCustomStyles();
            applyCustomStyle();
            observeTagInput();

            const jyuchuTagTextarea = document.getElementById('jyuchu_tag');
            if (jyuchuTagTextarea) {
                jyuchuTagTextarea.addEventListener('input', () => {
                    applyCustomStyle();
                });
            }
        }
    });

})();
