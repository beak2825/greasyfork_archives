// ==UserScript==
// @name         Infinite Folders
// @namespace    N/A
// @version      DR-1
// @description  A modification for Infinite Craft that adds folders. Composed entirely by @coolkase (https://coolkase.dev)
// @author       coolkase
// @match        https://neal.fun/infinite-craft/*
// @icon         https://i.imgur.com/eWYOeEb.png
// @grant        unsafeWindow
// @license      GPL2
// @downloadURL https://update.greasyfork.org/scripts/493218/Infinite%20Folders.user.js
// @updateURL https://update.greasyfork.org/scripts/493218/Infinite%20Folders.meta.js
// ==/UserScript==

class Toast {
    constructor(defaultTimeoutMiliseconds) {
        this.timeout = defaultTimeoutMiliseconds
        const _style = `

        #toast
        {
            left: 0px;
            top: 20px;
            right: 0px;
            width: 100%;
            z-index: 20;
            height: 100%;
            color: white;
            padding: 15px;
            font-size: 18px;
            max-width: 450px;
            max-height: 60px;
            margin-left: auto;
            visibility: hidden;
            margin-right: auto;
            position: absolute;
            border-radius: 16px;
            text-align: center left;
            border: 2px solid #1F79FF;
            backdrop-filter: blur(6px);
            background: rgba(38, 125, 255, 0.5);
            box-shadow: 0px 0px 64px 4px rgba(0,0,0,0.75);
            -moz-box-shadow: 0px 0px 64px 4px rgba(0,0,0,0.75);
            -webkit-box-shadow: 0px 0px 64px 4px rgba(0,0,0,0.75);
            text-shadow: 0px 0px 12px rgba(0, 0, 0, 1), 0px 0px 6px rgba(0, 0, 0, 0.75);
        }

        #toast.show
        {
            visibility: visible;
            animation: fadein 0.5s, fadeout 0.5s 2.5s forwards;
            -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s forwards;
        }

        @keyframes fadein
        {
            from
            {
                transform: translateY(20px);
                opacity: 0%;
            }

            to
            {
                transform: translateY(0px);
                opacity: 100%;
            }
        }

        @keyframes fadeout
        {
            from
            {
                transform: translateY(0px);
                opacity: 100%;
            }

            to
            {
                transform: translateY(20px);
                opacity: 0%;
            }
        }

        #toast.success
        {
            border: 2px solid #01E17B;
            background: rgba(0, 237, 81, 0.5);
        }

        #toast.error
        {
            border: 2px solid #F04349;
            background: rgba(240, 66, 72, 0.5);
        }

        #toast.warning
        {
            border: 2px solid #FFD21F;
            background: rgba(255, 212, 38, 0.5);
        }

        @keyframes background-pan
        {
            from
            {
                background-position: 0% center;
            }

            to
            {
                background-position: -200% center;
            }
        }

        #toast.top
        {
            top: 20px;
            bottom: auto;
        }

        #toast.bottom
        {
            top: auto;
            bottom: 20px;
        }

        #toast.right
        {
            left: auto;
            right: 40px;
        }

        #toast.left
        {
            left: 20px;
            right: auto;
        }

        `

        document.head.insertAdjacentHTML('beforeend', `<style>${_style}</style>`)
        document.body.insertAdjacentHTML('beforeend', `<div id='toast'></div>`)
    }

    pop(toastMessage, toastPosition, toastType) {
        setTimeout(() => {
            const toast = document.getElementById('toast')
            const toastClassName = ` show ${toastPosition} ${toastType}`

            toast.innerHTML = toastMessage
            toast.className += toastClassName

            setTimeout(() => {
                toast.className = toast.className.replace(toastClassName, '')
            }, this.timeout)
        }, 200)
    }
}

const ToastLibrary = new Toast(3000)

const themes = {
    Folders: `
       hr {
               height: 1px !important;
               border: 0 !important;
               background-color: rgba(255, 255, 255, 0.5);
               -webkit-filter: contrast(2) !important;
               filter: contrast(2) !important;
            }

    `,
}

class ThemeManager {
    constructor() {
        this.currentTheme = themes.Folders
        this.themeChangeAnimation = `

            .particles,
            .logo,
            .clear,
            .sound,
            .site-title,
            .coffee,
            .container,
            .items,
            .sidebar-input,
            .sidebar,
            .sidebar-sorting-item,
            .reset,
            .instruction,
            .sidebar-input-close
            {
                transition: all 400ms ease-in-out;
            }

            :root
            {
                transition: all 400ms ease-in-out;
            }

            .item
            {
                transition: border-radius 400ms ease-in-out,
                background 400ms ease-in-out,
                color 400ms ease-in-out;
            }

        `

        document.head.insertAdjacentHTML('beforeend', `<style>${this.themeChangeAnimation}</style>`)
    }

    change(themeId) {
        const theme = themes[themeId]
        if (!theme) {
            ToastLibrary.pop(`Attempt to apply invalid theme '${themeId}'.`, 'top right', 'error')
            return
        }

        document.head.insertAdjacentHTML('beforeend', `<style>${theme}</style>`)

        ToastLibrary.pop(`Applied folder style. Note that this is a developer release and that changes are NOT final.`, 'top right', 'success')
    }
}

const Theme = new ThemeManager

setTimeout(() => {
    Theme.change('Folders')
}, 200)

// folder stuff

const insertAfter = (el, htmlString) =>
    el.insertAdjacentHTML('afterend', htmlString);

if (typeof(Storage) !== "undefined") {
    if (unsafeWindow.localStorage.getItem("infiniteCraft_folders") == null) {
        unsafeWindow.localStorage.setItem("infiniteCraft_folders", "{}")
    }
} else {
    alert('Your browser does not support web storage, folders will not save. You can try using a Chromium browser instead of the one you are using.')
}

var folders = JSON.parse(unsafeWindow.localStorage.getItem("infiniteCraft_folders"))
var revert = '';

function makeFolderHTML(title) {
    return `
  <br>
  <hr>
  <br><br>
  <span><i>${title}</i></span>
  <br>`
}

function stringToHex(inputString) {
    var hexString = '';
    for (var i = 0; i < inputString.length; i++) {
        // Get the Unicode code point of the character
        var charCode = inputString.charCodeAt(i);
        // Convert the Unicode code point to hexadecimal representation
        var hexValue = charCode.toString(16).toUpperCase();
        // Add leading zeros if necessary to ensure each character is represented by two hexadecimal digits
        hexValue = ('00' + hexValue).slice(-2);
        // Append the hexadecimal representation to the result string
        hexString += hexValue + ' ';
    }
    // Trim any trailing space and return the hexadecimal string
    return hexString.trim();
}

function getElementHTML(name) {
    const items = document.getElementsByClassName("item")
    for (var i = 0; i < items.length; i++) {
        var itemName = items[i].textContent.replace(/([^a-z0-9]+)|\u002d|\s/gi, '').trim();
        console.log(stringToHex(name))
        console.log(stringToHex(itemName))
        if (itemName == name.replace(/([^a-z0-9]+)|\s/gi, '-').trim()) {
            return items[i].outerHTML
        }
    }
    return ''
}

function render() {
    const sidebar = document.getElementsByClassName('items')[0]
    sidebar.innerHTML = revert

    const items = document.getElementsByClassName("item")
    const folderNames = Object.keys(folders)

    for (var j = 0; j < folderNames.length; j++) {
        var html = `<br><br><span><i>${folderNames[j]}</i></span><br>`
        for (var item = 0; item < folders[folderNames[j]].length; item++) {
            html += getElementHTML(folders[folderNames[j]][item])
            console.log(folders[folderNames[j]][item])
        }
        html += `<br>
  <hr>`
        sidebar.innerHTML = html + sidebar.innerHTML;
    }
}

function addItem() {
    let item = prompt('Input the name of the element you want to store:')
    let folder = prompt(`Input the name of the folder you want to store "${item}" in:`)
    if (folders[folder] != null) {
        folders[folder].push(item)
    } else {
        folders[folder] = []
        folders[folder].push(item)
    }
    unsafeWindow.localStorage.setItem("infiniteCraft_folders", JSON.stringify(folders))
    render()
}

window.addEventListener('load', function() {
    const sidebar = document.getElementsByClassName('items')[0]
    revert = sidebar.innerHTML
    render()
})

if (document.addEventListener) {
    document.addEventListener('contextmenu', function(e) {
        addItem()
        e.preventDefault();
    }, false);
} else {
    document.attachEvent('oncontextmenu', function() {
        addItem()
        window.event.returnValue = false;
    });
}