// ==UserScript==
// @name         Sower ID Filter
// @namespace    http://real.gunjobiyori.com/
// @version      0.1
// @description  人狼物語＠リア充で特定のIDの発言を非表示にします
// @author       euro_s
// @match        http://real.gunjobiyori.com/sow.cgi*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405986/Sower%20ID%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/405986/Sower%20ID%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 非表示にしたいIDを設定してください。
    const FILTER_ID = ['nobumasa', '龍臣', 'ことら', 'nobusama'];

    // Your code here...
    function main() {
        const els = document.querySelectorAll('.message_filter div div:nth-child(2) .mesname');
        els.forEach((el) => {
            FILTER_ID.forEach((id) => {
                if (el.innerHTML.match(id)) {
                    el.parentElement.parentElement.parentElement.style.display = 'none';
                }
            });
        });
    }

    new MutationObserver(main).observe(
        document.querySelector('.inframe'), { childList: true }
    );

    main();
})();