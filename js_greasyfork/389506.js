// ==UserScript==
// @name           What.CD: YAVAH
// @namespace      hateradio)))
// @author         hateradio
// @version        5.1
// @description    Yet Another Various Artists Helper
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY0NDMyN0UzOUEwQzExRTA4REU5OUY2M0Q5RDZGNTQ1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY0NDMyN0U0OUEwQzExRTA4REU5OUY2M0Q5RDZGNTQ1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjQ0MzI3RTE5QTBDMTFFMDhERTk5RjYzRDlENkY1NDUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjQ0MzI3RTI5QTBDMTFFMDhERTk5RjYzRDlENkY1NDUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6q1rvzAAAEMElEQVR42uyaP0gcQRTG12CpYBkVUkWto22CYqtiq7FWrNVervdPK5r2oq2orSiptQkE1LRqkSooBNIk+xvyLe/m9la9XDzIvoFh9mZnZme+973vvRE7enp6kjKXF3/aD2n9VbJa4eAdKQPepu2nkhJgAAa8KrEHvHyRlLw4AA6AA+AAOAAOgAPgADgADoAD4AA4AA6AA+AAOAAOgAPgADgADoAD4AA4AA6AA+AAOAAOgAPQmjI7O5scHx8nq6urWd/o6Gjoo/JeZWFhIfTRtqIsLS3VfaNtDOju7s6ep6amcvsnJiZCe3Bw0JJvjoyMhPbi4iL3fedzHPzm5ia0XV1doR0cHEyGh4eTu7u7cHj1Awq/T09Pk9vb21wAsSjsoVxeXiaVSqVmLCzT+729vWztvPXapgGiIwe1DNDGT05Ocg+/tbWVjRGQy8vL2e+1tbWa9zMzM2EeQLcVAH2czVCxPn2Hh4ehv7e3N2MF/QImBo1x5+fnyfj4eLK4uBj6BwYGMvZo/tzcXBjDWMrV1VXDvXU+p+WhIwcBBOhpgRkbGwvPAiUusuz6+npGfw4Zv2e+1mUMoNC2FQBLP0SO37u7u+E39AQYDsBzHgAAhPUp9/f3ud/Qe+mN7WtE/7ZEAYlc3gHpB4SiIsorvMXhUqoPoGLF9fV1exnAoaT4tLK+rCMRtOK3v78f2unp6TAHGqMTCJ2dq7V4D4iTk5Oh2lKkAc8eBWIri9IcQKKF3wKKpS7hTu8pPK+srGRrbWxsZO+tK7FGEav4X+H3aVstaSb87tEMIAbjc/heXppbrVZr4rnSXJv+QmH1S6Di1Jh1rDbgCvTLJeJCf/yOeUVzmnIBCRcb1UE50Pz8fBaeRDUrTIxRgeYaY/vtHMKjzeP1LRsJVOQqsY9LKIt8/8kAIDYSLImM2LC5uZn5n01YFIpsri+/7uvrq0tyAEh3AAACbMZrTgxaf39/Xegr6v9rEZSwAACHZ0P0adMWnO3t7WzjsohYYGO01tOcmBGsf3Z2VgdaUZz/JwwQC6Cwwg1WRn1jS7JpDqqNDQ0N1TFA8VpzcDGxBssrgxPz7JzYvXBDaQtVgBbF/6bD4NHRUc1NzAoPWR4A7ezshD5Zzlpb11KyP/q5sDDHWl+XJcV4zYk1wDIrrzyGAU9OhCRiWMvGVytYsfpay2lTjOUmF98LOLwsayOIAKAyVtqiy48dQyR5KP43zQBtzvqdBKvoEmQB1Fzd3mxmGGdxjXL+Rv6ft7+WMkAfsP5lQ5ilsuK4rsDycaWtEjlZykYDXXdtHsK30RPWka7ENz0JpdyvpQxQLGbDsWDFOX5sbSuE2rRETmujB9b3bdEcGaARAx66NXoq3Gwq7H8WdwD+XwB+lPj8PwHgOK3fSnj4r2n9TB7wPa1v0ko0eF2Sw39J60fY/1uAAQDAo7S7+Gt3nAAAAABJRU5ErkJggg==
// @include        /https://redacted\.ch/(torrents\.php(\?|\?page=\d+&)id=\d+(&torrentid=\d+)?(#comments)?|upload\.php(\?requestid=\d+)?)/
// @include        /https://orpheus\.network/(torrents\.php(\?|\?page=\d+&)id=\d+(&torrentid=\d+)?(#comments)?|upload\.php(\?requestid=\d+)?)/
// @include        /https://notwhat\.cd/(torrents\.php(\?|\?page=\d+&)id=\d+(&torrentid=\d+)?(#comments)?|upload\.php(\?requestid=\d+)?)/
// @include        /https://dicmusic\.clud/(torrents\.php(\?|\?page=\d+&)id=\d+(&torrentid=\d+)?(#comments)?|upload\.php(\?requestid=\d+)?)/
// #updated        19 Dec 2018
// #since          18 Jun 2010
// @downloadURL https://update.greasyfork.org/scripts/389506/WhatCD%3A%20YAVAH.user.js
// @updateURL https://update.greasyfork.org/scripts/389506/WhatCD%3A%20YAVAH.meta.js
// ==/UserScript==

(() => {

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
            return function () {
                const context = this, args = arguments
                const run = () => {
                    timeout = null
                    func.call(context, ...args)
                }
    
                clearTimeout(timeout)
                timeout = setTimeout(run, wait)
            }
        }
    }

    class YavaMenu {

        constructor() {
            this.types = ['Main', 'Guest', 'Remixer', 'Composer', 'Conductor', 'DJ / Compiler', 'Producer']
            this.sibling = document.querySelector('.box_addartists, #dynamic_form')
            if (!this.sibling) return false

            this.boxSetup()
        }

        boxSetup() {
            const box = document.createElement('div')
            box.className = 'box'
            box.id = 'YAVAH'
            box.innerHTML = '<div class="head"><strong><abbr title="Yet Another Various Artists Helper">YAVAH</abbr></strong></div>'
            box.appendChild(this.menu())

            this.box = box
            this.sibling.parentElement.insertBefore(this.box, this.sibling)
        }

        menu() {
            const m = document.createElement('div')
            m.setAttribute('style', 'padding: 3px 6px 6px')
            m.innerHTML = this.generateBoxes()
            m.querySelector('textarea').className = 'noWhutBB yavahtext'
            return m
        }

        addEvent(cb) {
            return this.box && !this.box.addEventListener('input', _.debounce(cb, 250), false)
        }

        generateBoxes() {
            const t = ['<p>Enter artists, one per line. (Toggle.)</p>']

            this.types.forEach(type => {
                t.push(`<p onclick="$(this).nextElementSibling().toggleClass('hidden')"><a href="#" onclick="return false">${type}</a></p><textarea class="noWhutBB yavahtext hidden"></textarea>`)
            })

            t.push('<p>Review the changes below.</p>')
            return t.join('')
        }

    }

    class Yavah {

        constructor() {
            this.selector = 'input[name="aliasname[]"]:last-of-type, input[name="artists[]"]:last-of-type'
            this.a = document.querySelector('.box_addartists a, #artistfields a.brackets')
            this.inputs = document.querySelector('#AddArtists, #artistfields')

            _.css('#YAVAH p a { display:block } .yavahtext{max-width: 90% height: 50px}')

            this.stored = this.inputs.innerHTML
            this.event = this.event.bind(this)
        }

        /**
         *
         * @param {HTMLTextAreaElement} textarea
         * @param {number} index Index of HTMLOptionElement within HTMLSelectElement to set
         */
        fill(textarea, index) {
            const lines = textarea.value.match(/[^\r\n]+/g) || []

            lines.map(line => line && line.trim()).forEach((line, i) => {
                if (line) {
                    if (i > 0 || this.inputs.querySelector(this.selector).value) {
                        this.a.click()
                    }
                    this.inputs.querySelector(this.selector).value = line
                    this.inputs.querySelector('select:last-of-type').value = index
                }
            })
        }

        event() {
            // Reset the artist box
            this.inputs.innerHTML = this.stored
            _.js(() => window.ArtistFieldCount = -1000)

            const textareas = document.querySelectorAll('#YAVAH textarea')
            Array.from(textareas).forEach((e, i) => this.fill(e, i + 1))
        }

        static main() {
            const yava = new Yavah()
            const menu = new YavaMenu()
            menu.addEvent(yava.event)
        }

    }

    Yavah.main()

})()