// ==UserScript==
// @name         Andy's WORDLE Finder
// @namespace    https://greasyfork.org/users/471937
// @version      0.2
// @description  adds simple filters for wordle support
// @author       You
// @match        https://www.ssynth.co.uk/~gay/cgi-bin/nph-wf*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ssynth.co.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443360/Andy%27s%20WORDLE%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/443360/Andy%27s%20WORDLE%20Finder.meta.js
// ==/UserScript==

(function () {
    var pool = document.querySelector('#contentcolumn pre')
    var title = document.querySelector('#contentcolumn h3')

    var input_with, input_without, input_reset, btn_filter, btn_reset;

    create_br(2)
    title.appendChild(create_text(' With:'))
    title.appendChild(input_with = create_input('char, repeat for multi count'))
    create_br(1)
    title.appendChild(create_text('Without:'))
    title.appendChild(input_without = create_input('char'))
    title.appendChild(btn_filter = create_button('Filter', main))
    create_br(2)
    title.appendChild(input_reset = create_input('new pattern'))
    title.appendChild(btn_reset = create_button('Refresh', reset))

    // ====== events ======

    document.addEventListener('keydown', e => {
        if (e.keyCode != 13) return
        var target = document.activeElement
        if (target == input_with || target == input_without || target == btn_filter) btn_filter.click()
        else if (target == input_reset || target == btn_reset) btn_reset.click()
    })

    function main() {
        // TODO: multi appear
        var w_with = input_with.value.toLowerCase();
        var w_out = input_without.value.toLowerCase()
        input_with.value = input_without.value = ''
        var crit = null
        for (var c of Object.values(count_word(w_with))) crit = crit_and(crit, crit_with(c))
        for (c of w_out) crit = crit_and(crit, crit_without(c))

        filter_words(crit)
    }

    function reset() {
        var pattern = input_reset.value
        if (pattern.length == 0) return
        location.search = `?n=${pattern.length}&l=${pattern}`
    }

    // ====== UI ======

    function create_text(txt) {
        var t = document.createElement('span')
        t.innerText = txt
        return t
    }

    function create_input(txt) {
        var t = document.createElement('input')
        if (txt) t.placeholder = txt
        return t
    }

    function create_button(txt, func) {
        var t = document.createElement('button')
        t.innerText = txt
        t.addEventListener('click', func)
        return t
    }

    function create_br(n) {
        while (n--) title.appendChild(document.createElement('br'))
    }

    // ====== word process ======

    function sort_word(w) {
        return Array.from(w).sort().join('')
    }

    function count_word(w) {
        var res = {}
        for (var c of w) {
            res[c] = (res[c] || '') + c
        }
        return res
    }

    function crit_with(char) {
        return w => w.toLowerCase().indexOf(char) >= 0
    }

    function crit_without(char) {
        return w => w.toLowerCase().indexOf(char) < 0
    }

    function crit_and(a, b) {
        if (!a) return b
        return w => (a(w) && b(w))
    }

    function filter_words(crit) {
        if (!crit) return
        var res = []
        for (var w of pool.innerText.split('\n')) {
            if (w.length == 0) continue
            var w1 = sort_word(w)
            if (crit(w1)) res.push(w)
        }
        pool.innerText = res.join('\n') + '\n'
    }
})();