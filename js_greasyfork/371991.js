// ==UserScript==
// @name           What.CD: YAVAH
// @namespace      hateradio)))
// @author         hateradio
// @version        7.2
// @description    Yet Another Various Artists Helper
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY0NDMyN0UzOUEwQzExRTA4REU5OUY2M0Q5RDZGNTQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY0NDMyN0U0OUEwQzExRTA4REU5OUY2M0Q5RDZGNTQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjQ0MzI3RTE5QTBDMTFFMDhERTk5RjYzRDlENkY1NDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjQ0MzI3RTI5QTBDMTFFMDhERTk5RjYzRDlENkY1NDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6q1rvzAAAEMElEQVR42uyaP0gcQRTG12CpYBkVUkWto22CYqtiq7FWrNVervdPK5r2oq2orSiptQkE1LRqkSooBNIk+xvyLe/m9la9XDzIvoFh9mZnZme+973vvRE7enp6kjKXF3/aD2n9VbJa4eAdKQPepu2nkhJgAAa8KrEHvHyRlLw4AA6AA+AAOAAOgAPgADgADoAD4AA4AA6AA+AAOAAOgAPgADgADoAD4AA4AA6AA+AAOAAOgAPQmjI7O5scHx8nq6urWd/o6Gjoo/JeZWFhIfTRtqIsLS3VfaNtDOju7s6ep6amcvsnJiZCe3Bw0JJvjoyMhPbi4iL3fedzHPzm5ia0XV1doR0cHEyGh4eTu7u7cHj1Awq/T09Pk9vb21wAsSjsoVxeXiaVSqVmLCzT+729vWztvPXapgGiIwe1DNDGT05Ocg+/tbWVjRGQy8vL2e+1tbWa9zMzM2EeQLcVAH2czVCxPn2Hh4ehv7e3N2MF/QImBo1x5+fnyfj4eLK4uBj6BwYGMvZo/tzcXBjDWMrV1VXDvXU+p+WhIwcBBOhpgRkbGwvPAiUusuz6+npGfw4Zv2e+1mUMoNC2FQBLP0SO37u7u+E39AQYDsBzHgAAhPUp9/f3ud/Qe+mN7WtE/7ZEAYlc3gHpB4SiIsorvMXhUqoPoGLF9fV1exnAoaT4tLK+rCMRtOK3v78f2unp6TAHGqMTCJ2dq7V4D4iTk5Oh2lKkAc8eBWIri9IcQKKF3wKKpS7hTu8pPK+srGRrbWxsZO+tK7FGEav4X+H3aVstaSb87tEMIAbjc/heXppbrVZr4rnSXJv+QmH1S6Di1Jh1rDbgCvTLJeJCf/yOeUVzmnIBCRcb1UE50Pz8fBaeRDUrTIxRgeYaY/vtHMKjzeP1LRsJVOQqsY9LKIt8/8kAIDYSLImM2LC5uZn5n01YFIpsri+/7uvrq0tyAEh3AAACbMZrTgxaf39/Xegr6v9rEZSwAACHZ0P0adMWnO3t7WzjsohYYGO01tOcmBGsf3Z2VgdaUZz/JwwQC6Cwwg1WRn1jS7JpDqqNDQ0N1TFA8VpzcDGxBssrgxPz7JzYvXBDaQtVgBbF/6bD4NHRUc1NzAoPWR4A7ezshD5Zzlpb11KyP/q5sDDHWl+XJcV4zYk1wDIrrzyGAU9OhCRiWMvGVytYsfpay2lTjOUmF98LOLwsayOIAKAyVtqiy48dQyR5KP43zQBtzvqdBKvoEmQB1Fzd3mxmGGdxjXL+Rv6ft7+WMkAfsP5lQ5ilsuK4rsDycaWtEjlZykYDXXdtHsK30RPWka7ENz0JpdyvpQxQLGbDsWDFOX5sbSuE2rRETmujB9b3bdEcGaARAx66NXoq3Gwq7H8WdwD+XwB+lPj8PwHgOK3fSnj4r2n9TB7wPa1v0ko0eF2Sw39J60fY/1uAAQDAo7S7+Gt3nAAAAABJRU5ErkJggg==
// @include        /https://redacted\.sh/(torrents\.php(\?|\?page=\d+&)id=\d+(&torrentid=\d+)?(#comments)?|upload\.php(\?requestid=\d+)?|requests\.php*)/
// @include        /https://orpheus\.network/(torrents\.php(\?|\?page=\d+&)id=\d+(&torrentid=\d+)?(#comments)?|upload\.php(\?requestid=\d+)?|requests\.php*)/
// @include        /https://notwhat\.cd/(torrents\.php(\?|\?page=\d+&)id=\d+(&torrentid=\d+)?(#comments)?|upload\.php(\?requestid=\d+)?|requests\.php*)/
// #updated        26 Nov 2024
// #since          18 Jun 2010
// @downloadURL https://update.greasyfork.org/scripts/371991/WhatCD%3A%20YAVAH.user.js
// @updateURL https://update.greasyfork.org/scripts/371991/WhatCD%3A%20YAVAH.meta.js
// ==/UserScript==

(() => {

    if (!Element.prototype.matches)
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector

    if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
            let el = this
            if (!document.documentElement.contains(el)) return null
            do {
                if (el.matches(s)) return el
                el = el.parentElement || el.parentNode
            } while (el !== null && el.nodeType === 1)
            return null
        }
    }

    const _ = {
        css: text => {
            if (!this.style) {
                this.style = document.createElement('style')
                this.style.type = 'text/css'
                document.body.appendChild(this.style)
            }
            this.style.appendChild(document.createTextNode(`${text}\n`))
        },
        js: func => {
            const script = document.createElement('script')
            script.type = 'application/javascript'
            script.textContent = `;(${func})();`
            document.body.appendChild(script)
            document.body.removeChild(script)
        },
        debounce: (func, wait) => {
            let timeout
            return function (...args) {
                const run = () => {
                    timeout = null
                    func.apply(this, args)
                }

                clearTimeout(timeout)
                timeout = setTimeout(run, wait)
            }
        },
        on: (element, type, selector, listener) => {
            element.addEventListener(type, event => {
                const found = event.target.closest(selector)
                if (found) listener.call(found, event)
            }, false)
        }
    }

    class YavaMenu {

        constructor() {
            this.sibling = document.querySelector('.box_addartists, #artist_tr')
            this.setup()
            YavaMenu.check = document.getElementById('yavah_semi')
        }

        get types() {
            return ['Main', 'Guest', 'Remixer', 'Composer', 'Conductor', 'DJ / Compiler', 'Producer']
        }

        setup() {
            if (!this.sibling) return

            const box = document.createElement('div')
            box.id = 'YAVAH'
            _.on(box, 'click', 'a', this.toggle)

            this.boxSetup(box)

            box.querySelector('a').click()
            this.box = box
        }

        boxSetup(box) {
            box.className = 'box'
            box.innerHTML = `
                <div class="head">
                    <strong><abbr title="Yet Another Various Artists Helper">YAVAH</abbr></strong>
                </div>
                <div style="padding: 3px 6px 6px">
                    ${this.generateInputs()}
                </div>`

            this.sibling.parentElement.insertBefore(box, this.sibling)
        }

        toggle(e) {
            e.preventDefault()
            const tog = this.parentElement.nextElementSibling.classList.toggle('hidden')
            this.innerHTML = `<code>${tog ? '+' : '-'}</code> ${this.dataset.type}`
        }

        generateInputs() {
            // let yavahtog = this.nextElementSibling.classList.toggle('hidden');
            // this.firstElementChild.innerHTML = '<code>' + (yavahtog ? '+' : '-') + '</code> ' + this.firstElementChild.dataset.type
            const boxes = this.types.map(type => {
                return `<p><a href="#" data-type="${type}"><code>+</code> ${type}</a></p><textarea class="noWhutBB yavahtext hidden"></textarea>`
            }).join('')

            return `
            <p>Enter artists, one per line.</p>
            <p>
                <input type="checkbox" id="yavah_semi"> <label for="yavah_semi">Split semi-colons</label>
            </p>
            ${boxes}
            <p>Review the changes below.</p>`
        }

        addEvent(cb) {
            return this.box && !this.box.addEventListener('input', _.debounce(cb, 250), false)
        }

    }

    class YavaMenuTr extends YavaMenu {
        boxSetup(box) {
            box.innerHTML = this.generateInputs()

            const tr = document.createElement('tr')
            tr.innerHTML = '<td class="label">YAVAH</td><td></td>'
            tr.lastElementChild.appendChild(box)

            this.sibling.parentElement.insertBefore(tr, this.sibling)
        }
    }

    class Yavah {

        constructor() {
            this.selector = 'input[name="aliasname[]"]:last-of-type, input[name="artists[]"]:last-of-type'
            this.add = document.querySelector('.box_addartists a, #artistfields a.brackets')
            this.inputs = document.querySelector('#AddArtists, #artistfields')

            if (!this.inputs)
                return

            _.css('#YAVAH p a { display:block } .yavahtext{width: 90%; height: 6em}')

            this.stored = this.inputs.innerHTML
            this.event = this.event.bind(this)
        }

        regex() {
            if (YavaMenu.check.checked)
                return /[^\r\n;]+/g
            return /[^\r\n]+/g
        }

        /**
         *
         * @param {HTMLTextAreaElement} textarea
         * @param {number} index Index of HTMLOptionElement within HTMLSelectElement to set (Main, Guest, Composer, etc.)
         */
        fill(textarea, index) {
            const lines = textarea.value.match(this.REGEX) || []
            const unique = new Set(lines.map(_ => _.trim()))
            unique.delete('')

            unique.forEach(name => {
                this.inputs.querySelector(this.selector).value = name
                this.inputs.querySelector('select:last-of-type').value = index + 1
                this.add.click()
            })
        }

        event() {
            // Reset the artist box
            this.inputs.innerHTML = this.stored
            _.js(() => window.ArtistFieldCount = -1000)

            const textareas = document.querySelectorAll('#YAVAH textarea')
            this.REGEX = this.regex()
            Array.from(textareas).forEach(this.fill, this)
        }

        static main() {
            const yava = new Yavah()
            const menu = /(?:requests\.php|upload\.php)/.test(document.location.pathname) ? new YavaMenuTr : new YavaMenu
            menu.addEvent(yava.event)

            if (document.location.hash === '#yavah-test') {
                new YavaTest(yava)
            }
        }

    }

    class YavaTest {
        constructor(yavah) {
            this.y = yavah

            this.indices = '1-1-1-2-2-2-3-3-3-4-4-4-5-5-5-6-6-6-7-7-7-1'
            this.values = 'A1;A1.1-A2-A3-B1;B1.1-B2-B3-C1;C1.1-C2-C3-D1;D1.1-D2-D3-E1;E1.1-E2-E3-F1;F1.1-F2-F3-G1;G1.1-G2-G3-'

            this.indicesSemi =  '1-1-1-1-2-2-2-2-3-3-3-3-4-4-4-4-5-5-5-5-6-6-6-6-7-7-7-7-1'
            this.valuesSemi = this.values.replaceAll(';', '-')

            this.testInit()
            this.testRegular()
            this.testSemi()
        }

        testInit() {
            console.log('YAVAH TEST!')

            // asume if no inputs, then there is nothing to do
            if (!this.y.inputs)
                return

            // fill data
            const textareas = Array.from(document.querySelectorAll('.yavahtext'))
            textareas.forEach((t, i) => {
                const ch = String.fromCharCode(65 + i);
                t.value = `${ch}1;${ch}1.1\n${ch}2\n${ch}3`
            })

            // go for it!
            this.y.event()
        }

        selects(indices) {
            // assert dropdowns
            console.group('YAVAH DROPDOWN TEST')

            const selects = document.querySelectorAll('#AddArtists select, #artistfields select')

            if (selects.length === indices.split('-').length)
                console.debug('[Passed] Valid number of dropdowns')
            else
                console.warn('Invalid number of dropdowns')

            if (Array.from(selects).map(_ => _.value).join('-') === indices)
                console.debug('[Passed] Valid values for dropdowns')
            else
                console.warn('Invalid values for dropdowns')

            console.groupEnd()
        }

        inputs(values) {
            // assert inputs
            console.group('YAVAH INPUT TEST')

            const inputs = document.querySelectorAll('input[name="aliasname[]"], input[name="artists[]"]')

            if (inputs.length === values.split('-').length)
                console.debug('[Passed] Valid number of inputs')
            else
                console.warn('Invalid number of inputs')

            if (Array.from(inputs).map(_ => _.value).join('-') === values)
                console.debug('[Passed] Valid values for inputs')
            else
                console.warn('Invalid values for inputs')
            
            console.groupEnd()
        }

        testRegular() {
            console.info('Starting Regular Test')
            this.selects(this.indices)
            this.inputs(this.values)
        }

        testSemi() {
            console.info('Starting Semicolon Test')
            YavaMenu.check.checked = true
            this.y.event()
            this.selects(this.indicesSemi)
            this.inputs(this.valuesSemi)
        }

    }

    Yavah.main()

})()