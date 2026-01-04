// ==UserScript==
// @name         TorrentBD - SeedBonus to Upload Credit Converter & Tab to Indent
// @namespace    Violentmonkey Scripts
// @version      1.01
// @description  Take a quick look at how much Upload Credit you would have if converted your SeedBonus amount. Press Tab to indent instead of going to the next input field
// @author       ac1d10.sk
// @icon         data:image/pngbase64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhEQ0QxMEFEM0FFRTExRUFBMzAwQzI2REE1MEFBNTJEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhEQ0QxMEFFM0FFRTExRUFBMzAwQzI2REE1MEFBNTJEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6OERDRDEwQUIzQUVFMTFFQUEzMDBDMjZEQTUwQUE1MkQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6OERDRDEwQUMzQUVFMTFFQUEzMDBDMjZEQTUwQUE1MkQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4l3CaDAAADIUlEQVR42rRXv09aURQ+FsHWCg2RIAwSm6okJZSmi4tLKUZjw+TC6H9RN7vRTu3CYOzSxXY0JozCQgJ1KNSENKQ1jRB/1GJMKaBAyOs5z3vN8/mAdwVO8oXAu/d8H/f8uOcNgH4bQbxEPEc8RTxEPGDP/iJ+ITKIOCKKKEOPbBKxzhxKOlFmeya7Ib6LeIOoCRCrQXvfMl9C9giR7oJYjbTIaTxDHPeQnOOY+e4Y75M+kHOctDuJeyyLpT7jG+OSbVAh4DXC1+mILBYLGAwGMBqNMDw8DENDQ5eOBi9dXVxcQK1Wg3q9Do1GQ0a5fK0inzCuV/RlQJF03xHGa4U/MiKTOJ1O8Pl8MDMzA4FAAKanp3VncyaTgXg8DolEArLZLBSLRRLVKJVKj/HxT75unR8RkkpIKIVCISkWi0n9ML/fT1wfOLmZNxkiDwaDUr9tfn6eNyszBW4RcV9WYjbD1tZWT9pntVqFzc1N2N/fh7GxMZibm4Px8XEIh8Ows7MDjHORBLzgmyje3VoqlYLl5WU4OjoCjPON5FUlpcyd4vG3Wq1SpVK5cWT5fF5aXV2V8yIajbY82nQ6LfsQKEnihj/KHz0ej5x8uVxOWllZkdxut4Tqr56Pjo62FICVItoTiFvssqFETSaTmgLsdrvwZXVHNMYUv/Pzc82koyYkaiSgJLKBksnr9fZq1iiRgD2RHZTJNpvtxu+3rKA9ErArsoPugHbiBG2XBGyL7DCZTC0bT7PZFBWwfa0V68HExIRmBVCvEKyACnHTCfxDfBbJAS07ODgQ/fefiJuXIQ2fDT27+L2vtsPDQxHyBhtWgQuge/ldN/VEl46AvUf8UArgE9HubQUUCgXdmc+4QC2A2tsS78+iRrefDiPfS5izVS0BgA8oFAuI36ICzs7OOi0hnwuMAzQFMBFf8WNWNBynp6edjn2W+W5tuOAK7HWKMrWuvq61jOZIjVqv81czpW/mv70AxcIpNrRS45DnA7VFIhH5mlYQV9nQOaXlU0iAYgO9nodcLtdHnOvynHxjY6PpcDiK+OwLYo3W0Np2vpQC/gswALqtfOgnVs/UAAAAAElFTkSuQmCC
// @include      https://*.torrentbd.*/*
// @run-at       document-end
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/450815/TorrentBD%20-%20SeedBonus%20to%20Upload%20Credit%20Converter%20%20Tab%20to%20Indent.user.js
// @updateURL https://update.greasyfork.org/scripts/450815/TorrentBD%20-%20SeedBonus%20to%20Upload%20Credit%20Converter%20%20Tab%20to%20Indent.meta.js
// ==/UserScript==

//CreateElement function
const CreateElement = (initObj) => {
    var element = document.createElement(initObj.Tag)
    for (var prop in initObj) {
        if (prop === "childNodes") {
            initObj.childNodes.forEach(node => {
                element.appendChild(node);
                return
            })
        }
        if (prop === "attributes") {
            initObj.attributes.forEach(attr => {
                element.setAttribute(attr.key, attr.value);
                return
            })
        }
        element[prop] = initObj[prop];
    }
    return element;
}

//Tab to indent
var textareas = document.getElementsByTagName('textarea')
var count = textareas.length
for (var i = 0; i < count; i++) {
    textareas[i].onkeydown = e => {
        if (e.keyCode == 9 || e.which == 9) {
            e.preventDefault()
            var s = this.selectionStart
            this.value = this.value.substring(0, this.selectionStart) + "        " + this.value.substring(this.selectionEnd)
            this.selectionEnd = s + 8
        }
    }
}

//SB calc
const sb = document.querySelector("#user-sb")
if (sb.typeOf == 'undefined') console.log('SB error state: ' + sb)
let sbAmt = parseFloat(sb.innerText)
let calc = parseInt(sbAmt / 100000) * 300
let metric = "GiB"

if (calc >= 1048576) {
    calc = (calc / 1048576).toFixed(2)
    metric = "PiB"
} else if (calc >= 1024) {
    calc = (calc / 1024).toFixed(2)
    metric = "TiB"
}
const infoTable = document.querySelector('.table.profile-info-table tbody')

const insertedRow = CreateElement({
    Tag: 'tr',
    childNodes: [(CreateElement({
            Tag: 'td',
            innerText: 'Converts to',
        })),
        (CreateElement({
            Tag: 'td',
            innerHTML: `:
				  <a href="seedbonus.php">${calc} ${metric}</a>
				  `,
        }))
    ],
})
infoTable.insertBefore(insertedRow, infoTable.childNodes[9])
