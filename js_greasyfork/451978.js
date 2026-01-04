// ==UserScript==
// @name        mhrise-skill-sim-hide-remove-all-charm-button
// @description 「MHRise:Sunbreak スキルシミュ(泣)」の「お守りを全て削除」ボタンを非表示にします。
// @license     MIT
// @namespace   https://twitter.com/yumisendesu
// @version     0.0.2
// @author      yumisendesu
// @match       https://mhrise.wiki-db.com/sim/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/451978/mhrise-skill-sim-hide-remove-all-charm-button.user.js
// @updateURL https://update.greasyfork.org/scripts/451978/mhrise-skill-sim-hide-remove-all-charm-button.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    let ui = document.getElementById('ui')
    let observer = new MutationObserver(records => {
        // 要素にidやclassが無いので仕方なく

        // お守りタブ以外なら処理中断
        let tab = document.querySelector('.active a').innerText
        if (tab != 'お守り') return

        // ボタンを非表示
        let buttons = Array.from(document.querySelectorAll('#charm-table button'))
        let removeButton = buttons.find(b => b.innerText == 'お守りを全て削除')
        removeButton.style.display = 'none'

        // ボタンを非表示にしたことで、不要になった横線を非表示
        let hr = document.querySelector('#charm-table + hr')
        hr.style.display = 'none'
    })
    observer.observe(ui, {
        childList: true,
        subtree: true,
    })
})()
