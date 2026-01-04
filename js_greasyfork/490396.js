// ==UserScript==
// @name         Neon Hydrogen
// @namespace    N/A
// @version      1.1.0
// @description  A modification for Infinite Craft that adds neon-looking elements. Based on the Hydrogen theme by LofiHD.
// @author       coolkase
// @match        https://neal.fun/infinite-craft/*
// @icon         https://i.imgur.com/9wzoOH4.png
// @grant        none
// @license      GPL2
// @downloadURL https://update.greasyfork.org/scripts/490396/Neon%20Hydrogen.user.js
// @updateURL https://update.greasyfork.org/scripts/490396/Neon%20Hydrogen.meta.js
// ==/UserScript==

class Toast
{
    constructor(defaultTimeoutMiliseconds)
    {
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

    pop(toastMessage, toastPosition, toastType)
    {
        setTimeout(() => {
            const toast = document.getElementById('toast')
            const toastClassName = ` show ${toastPosition} ${toastType}`

            toast.innerHTML = toastMessage
            toast.className += toastClassName

            setTimeout(() => {toast.className = toast.className.replace(toastClassName, '')}, this.timeout)
        }, 200)
    }
}

const ToastLibrary = new Toast(3000)

const themes = {
    NeonHydrogen: `
        @import url('https://fonts.googleapis.com/css2?family=Tilt+Neon');


        * {
            font-family: Tilt Neon, sans-serif;
        }

        body
        {
            overflow: hidden !important;
            -ms-overflow-style: none !important;
        }

        .container
        {
            background-color: #13181D !important;
        }

        .items
        {
            background-color: #070C10 !important;
            align-items: center !important;
            display: ruby-text !important;
            z-index: 501 !important;
        }

        .reset
        {
            color: white !important;
        }

        .item
        {
            background: #070C10 !important;
            border-radius: 25px !important;
            -webkit-box-shadow: 0px 0px 48px 6px rgba(0,0,0,0.75) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(0,0,0,0.75) !important;
            box-shadow: 0px 0px 48px 6px rgba(0,0,0,0.75) !important;
            color: white !important;
            transition: border-radius 400ms ease-in-out, background 400ms ease-in-out, scale 200ms ease-in-out, backdrop-filter 400ms ease-in-out !important;
            border: 2px solid #6e1717 !important;
            font-family: Tilt Neon, sans-serif;
        }

        .item-discovered
        {
            background: #070C10 !important;
            border: 2px solid #8c6200 !important;
            border-radius: 25px !important;
            -webkit-box-shadow: 0px 0px 64px 4px rgba(245, 159, 0,0.5) !important;
            -moz-box-shadow: 0px 0px 64px 4px rgba(245, 159, 0,0.25) !important;
            box-shadow: 0px 0px 64px 4px rgba(245, 159, 0,0.25) !important;
            color: white !important;
            transition: border-radius 400ms ease-in-out, background 400ms ease-in-out, scale 200ms ease-in-out, backdrop-filter 400ms ease-in-out !important;
        }

        .item:has(.instance-discovered-text)
        {
            background: #070C10 !important;
            border-radius: 25px !important;
            -webkit-box-shadow: 0px 0px 48px 6px rgba(245, 159, 0, 1) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(245, 159, 0, 1) !important;
            border: 2px solid #f59f00 !important;
            box-shadow: 0px 0px 64px 4px rgba(255,255,0,0.5) !important;
            color: white !important;
            transition: border-radius 400ms ease-in-out, background 400ms ease-in-out, scale 200ms ease-in-out, backdrop-filter 400ms ease-in-out !important;
        }

        .instance
        {
            -webkit-box-shadow: 0px 0px 48px 6px rgba(255,0,0,0.5) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(255,0,0,0.5) !important;
            border: 2px solid #e03131 !important;
        }

        .instance:has(.instance-discovered-text):hover
        {
            background: rgba(38, 38, 17, .5) !important;
            backdrop-filter: blur(8px) !important;
            scale: 1.05 1.05 !important;
        }


        .item:hover
        {
            background: rgba(44, 10, 17, .5) !important;
            backdrop-filter: blur(8px) !important;
            scale: 1.05 1.05 !important;
        }

        .item-discovered:hover
        {
            background: rgba(38, 38, 17, .5) !important;
            backdrop-filter: blur(8px) !important;
            scale: 1.05 1.05 !important;
        }

        .sidebar-sorting-item
        {
            color: white !important;
            background: #020508 !important;
            -webkit-box-shadow: 0px 0px 48px 6px rgba(0,0,0,0.75) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(0,0,0,0.75) !important;
            box-shadow: 0px 0px 48px 6px rgba(0,0,0,0.75) !important;
        }

        .sidebar-input-close
        {
            filter: invert(1) !important;
        }

        .sidebar-input
        {
            font-family: Tilt Neon, sans-serif !important;
            background-color: #020508 !important;
            color: white !important;
            -webkit-box-shadow: 0px 0px 48px 6px rgba(0,187,0.33) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(0,187,0,0.33) !important;
            box-shadow: 0px 0px 48px 6px rgba(0,187,0,0.33) !important;
        }

        div .sidebar-input {
            border: 1px solid #0b0 !important;
        }

        .sidebar-input-close
        {
            filter: invert(1) !important;
            visibility: hidden !important;
        }

        .sidebar-input::after
        {
            visibility: hidden !important;
            border-color: #800000 !important;
        }

        .empty-sidebar-icon
        {
            filter: invert(1) !important;
        }

        .empty-sidebar
        {
            color: white !important;
        }

        .instance-discovered-text
        {
            -webkit-animation: background-pan 3s linear infinite !important;
            animation: background-pan 3s linear infinite !important;
            background: linear-gradient(
                to right,
                #e67700,
                #f59f00,
                #fcc419,
                #e67700
            ) !important;
            -webkit-background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            white-space: nowrap !important;
            z-index: 200;
            font-weight: bold !important;
            font-size: 16px !important;
            width: 200px !important;
            background-size: 200% !important;
        }

        .instance-discovered-emoji
        {
            filter: brightness(0) invert(1) sepia(1) hue-rotate(-60deg) saturate(10000%) grayscale(0) contrast(1) !important;
        }

        .sidebar-sorting-icon
        {
            filter: invert(1) !important;
        }

        .instruction-icon
        {
            filter: invert(1) !important;
        }

        .instruction
        {
            color: white !important;
        }

        .particles,
        .logo,
        .clear,
        .sound,
        .site-title,
        .coffee
        {
            filter: invert(1) !important;
        }

        .logo, .version {
            z-index: 500;
        }

        .sidebar
        {
            border-left: 1px solid #800000 !important;
            -webkit-box-shadow: 0px 0px 48px 6px rgba(255,0,0,0.5) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(255,0,0,0.5) !important;
            box-shadow: 0px 0px 48px 6px rgba(255,0,0,0.5) !important;
            -ms-overflow-style: none !important;
            border-color: #800000 !important;
        }

        div.sidebar-sorting {
            border-top: none;
            grid-gap: 0 !important;
        }

        .sidebar-discoveries.sidebar-sorting-item {
            border-left: none !important;
        }

        .settings-content
        {
            background: #020508 !important;
            color: white !important;
            -webkit-box-shadow: 0px 0px 48px 6px rgba(0,0,187,0.5) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(0,0,187,0.5) !important;
            box-shadow: 0px 0px 48px 6px rgba(0,0,187,0.5) !important;
            z-index: 200 !important;
            width: 184px !important;
        }

        .settings-details {
            background-color: #020508 !important;
            border-color: #00e !important;
            -webkit-box-shadow: 0px 0px 48px 6px rgba(0,0,187,0.75) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(0,0,187,0.75) !important;
            box-shadow: 0px 0px 48px 6px rgba(0,0,187,0.75) !important;
        }

        div .settings-content {
            border-color: #00c;
            -webkit-box-shadow: 0px 0px 48px 6px rgba(0,0,187,0.5) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(0,0,187,0.5) !important;
            box-shadow: 0px 0px 48px 6px rgba(0,0,187,0.5) !important;
            clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
        }

        .setting
        {
            text-align: left !important;
            display: block !important;
            border-color: #00c !important;
        }

        .setting > img
        {
            position: absolute !important;
            right: 16px !important;
        }

        .sidebar-controls::after
        {
            background: linear-gradient(180deg,hsla(0,0%,100%,0), hsla(234, 96%, 11%, 0.125)) !important;
        }

        .sidebar-header
        {
            background: #020508 !important;
            color: white !important;
            -webkit-box-shadow: 0px 0px 48px 6px rgba(0,0,0,0.75) !important;
            -moz-box-shadow: 0px 0px 48px 6px rgba(0,0,0,0.75) !important;
            box-shadow: 0px 0px 48px 6px rgba(0,0,0,0.75) !important;
            border-color: #800000 !important;
             z-index: -500;
            /* overflow: hidden; */
        }

        .container.dark-mode {
            --border-color: #ff0000 !important;
        }

    `,
}

class ThemeManager
{
    constructor()
    {
        this.currentTheme = themes.NeonHydrogen
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

    change(themeId)
    {
        const theme = themes[themeId]
        if (!theme)
        {
            ToastLibrary.pop(`Attempt to apply invalid theme '${themeId}'.`, 'top right', 'error')
            return
        }

        document.head.insertAdjacentHTML('beforeend', `<style>${theme}</style>`)

        ToastLibrary.pop(`Theme '${themeId}' applied.\nThanks for using!`, 'top right', 'success')
    }
}

const Theme = new ThemeManager

setTimeout(() => {Theme.change('NeonHydrogen')}, 200)
