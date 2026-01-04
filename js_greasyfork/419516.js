// ==UserScript==
// @name         自动填分区
// @namespace    https://github.com/spacemeowx2
// @version      0.1
// @description  自动选b站开播分区
// @author       You
// @match        https://link.bilibili.com/p/center/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419516/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%88%86%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/419516/%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%88%86%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function retry(cb) {
        return new Promise((res, rej) => {
            const f = () => {
                try {
                    const r = cb()
                    if (r) {
                        res(r)
                    } else {
                        setTimeout(f, 500)
                    }
                } catch (e) {
                    rej(e)
                }
            }
            f()
        })
    }

    retry(() => {
        const b = document.querySelector('.blink.blue.category-toggle')
        if (!b) return
        if (b.textContent === '选择分类') {
            return b
        } else {
            throw new Error('already select')
        }
    }).then(btn => {
        console.log('btn', btn)
        btn.click()
        return retry(() => {
            const b = document.querySelector('.p-relative.latest .p-relative')
            if (!b) return
            return b
        })
    }).then(btn => {
        btn.click()
    })
})();