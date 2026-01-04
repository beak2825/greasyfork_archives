// ==UserScript==
// @name               Show Console Messages
// @name:zh-CN         显示控制台消息
// @name:zh-TW         顯示控制台消息
// @name:fr            Afficher les messages de la console
// @name:es            Mostrar mensajes de la consola
// @name:ru            Отображение сообщений консоли
// @name:ja            コンソールメッセージを表示
// @name:ko            콘솔 메시지 표시
// @description        Displays console messages (`console.*`) on screen with styled notifications.
// @description:zh-CN  在屏幕上显示控制台消息（`console.*`），并提供样式化的通知。
// @description:zh-TW  在螢幕上顯示控制台消息（`console.*`），並提供樣式化的通知。
// @description:fr     Affiche les messages de la console (`console.*`) à l'écran avec des notifications stylisées.
// @description:es     Muestra los mensajes de la consola (`console.*`) en pantalla con notificaciones con estilo.
// @description:ru     Отображает сообщения консоли (`console.*`) на экране со стилизованными уведомлениями.
// @description:ja     コンソールメッセージ（`console.*`）を画面に表示し、スタイリッシュな通知を提供します。
// @description:ko     콘솔 메시지 (`console.*`)를 화면에 스타일된 알림으로 표시합니다。
// @namespace          Kyan Violentmonkey Scripts
// @match              *://*.ccugame.app/*
// @match              *://*.reddit.com/*
// @grant              none
// @license            MIT
// @version            2.0.1
// @author             Kyan
// @downloadURL https://update.greasyfork.org/scripts/507749/Show%20Console%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/507749/Show%20Console%20Messages.meta.js
// ==/UserScript==
(function () {
    'use strict'

    // CSS styles
    let console_msg_styles = document.createElement('style')
    console_msg_styles.innerHTML = `
        .console-message-div {
            position: fixed;
            z-index: 999;
            bottom: 2em;
            right: 2em;
            background: transparent;
            display: flex;
            flex-wrap: wrap;
            flex-direction: column-reverse;
            transition: all 1s ease-out;  /* for slide_show() */
            overflow: hidden;  /* for slide_show() */
            pointer-events: none;
        }
        .console-message-wrapper {
            width: 100%;
            background: transparent;
            transition: all 1s ease-out;
            position: relative;
        }
        .console-message-wrapper-progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            border-radius: 5px;
            z-index: -1;
            overflow: hidden;  /* hide border-radius of .console-message-wrapper-progress */
        }
        .console-message-wrapper-progress {
            height: 100%;
            background-color: rgba(94, 129, 172, 0.5);  /* nord10 Frost (Darkest) */
            width: 100%;
            transition: all 1s linear;
            transform-origin: right;
        }
        .console-message-text {
            float: right;
            padding: 5px;
            margin: 5px;
            border-radius: 5px;
            width: fit-content;
            font-size: small;
            transition: all 1s ease-out;
            font-family: monospace, sans-serif;
            white-space: pre-wrap;  /* Preserve whitespace but allow wrapping */
            /* white-space: nowrap;  /* Prevent line breaks */
            word-break: break-word;  /* Break long words */
            overflow: hidden;     /* Hide overflowed content */
            text-overflow: ellipsis;  /* Show ellipsis for overflowed content */
            max-width: 62vw;
            pointer-events: auto;
            text-shadow: 0px 0px 5px #2e3440;  /* nord0 Polar Night (Darkest) */
        }
        .cursor-pointer {
            cursor: pointer;
        }
        .bg-blur {
            backdrop-filter: blur(5px);
        }
    `;
    document.head.appendChild(console_msg_styles);

    // create a div to show console log
    let console_msg_div = document.createElement('div');
    console_msg_div.classList.add('console-message-div');
    document.body.appendChild(console_msg_div);


    // override the default console.log function
    let original_console_log = console.log;
    let original_console_error = console.error;
    let original_console_warn = console.warn;
    let original_console_info = console.info;
    let original_console_debug = console.debug;

    const exit_to_right = (ele) => {
        if (typeof ele !== 'undefined') {
            ele.style.opacity = 0;
            ele.style.transform = 'translateX(200%)';
            setTimeout(() => ele.remove(), 1000);
        }
    }
    const slide_show = (ele) => {
        if (typeof ele !== 'undefined') {
          let ele_height = window.getComputedStyle(ele).height  // Get real height (including padding)
          ele.style.height = '0'  // Init height with 0px
          // ele.offsetHeight  // Trigger a browser repaint and force reflow to ensure the height of 0px is calculated
          requestAnimationFrame(() => {  // Executed on next repaint cycle
              ele.style.height = ele_height  // Recover element height
          })
        }
    }

    const console_call = (type, original_function, ...args) => {
        original_function(...args)
        let skip_next = false  // If next arg is %c styles
        let message = args.map(arg => {
            if (skip_next) {
                skip_next = false
                return
            }
            if (typeof arg === 'string' && arg.includes('%c')) {  // If arg has %c in it
                skip_next = true  // Next arg will be the %c styles
                return arg.replace(/%c/g, '')  // Remove %c from message
            }
            if (typeof arg === 'object' && arg !== null) {
                if (arg instanceof Error) {
                    return arg.message
                }
                return JSON.stringify(arg, null, 4)
            }
            return String(arg)
        }).join('\n')
        if (message === 'bl') {
            return
        }
        // Check if the last message is the same as the current one
        let last_msglet_wrapper = console_msg_div.lastChild  // document.querySelector('.console-message-wrapper')
        if (last_msglet_wrapper) {
            let last_msglet_message = last_msglet_wrapper.querySelector('.msglet-message').textContent
            let last_msglet_count = last_msglet_wrapper.querySelector('.msglet-count')

            if (last_msglet_message === message) {
                // If the messages are the same, update the count
                let count = parseInt(last_msglet_wrapper.getAttribute('data-dup-count'))
                count += 1
                last_msglet_wrapper.setAttribute('data-dup-count', count)
                last_msglet_count.textContent = `×${count}`
                return  // Exit, no need to create a new message
            }
        }

        // Create new msglet
        let msglet_wrapper = document.createElement('div')
        msglet_wrapper.classList.add('console-message-wrapper')
        msglet_wrapper.setAttribute('data-dup-count', 1)
        let msglet = document.createElement('div')
        msglet.classList.add('console-message-text', 'bg-blur', 'cursor-pointer')
        msglet.addEventListener('click', () => exit_to_right(msglet_wrapper))

        // add flair and style
        let flair = ''
        let transparency = 0.618
        switch (type) {
            case 'log':
                flair = '💡'
                msglet.style.color = 'white'
                msglet.style.backgroundColor = `rgba(46, 52, 64, ${transparency})`  // nord0 Polar Night (Darkest)
                break
            case 'error':
                flair = '❌'
                msglet.style.color = 'white'
                msglet.style.backgroundColor = `rgba(191, 97, 106, ${transparency})`  // nord11 Aurora (Red)
                break
            case 'warn':
                flair = '⚠️'
                msglet.style.color = '#EBCB8B'  // nord13 Aurora (Yellow)
                msglet.style.backgroundColor = `rgba(46, 52, 64, ${transparency})`
                break
            case 'info':
                flair = 'ℹ️'
                msglet.style.color = 'white'
                msglet.style.backgroundColor = `rgba(163, 190, 140, ${transparency})`  // nord14 Aurora (Green)
                break
            case 'debug':
                flair = '🐛'
                msglet.style.color = 'white'
                msglet.style.backgroundColor = `rgba(180, 142, 173, ${transparency})`  // nord15 Aurora (Purple)
                break
            default:
                flair = `[${type}]`
                msglet.style.color = '#ECEFF4'  // nord6 Snow Storm (Lightest)
                msglet.style.backgroundColor = `rgba(46, 52, 64, ${transparency})`  // nord0 Polar Night (Darkest)
                break
        }
        msglet.innerHTML = `<span>${flair}</span> <span class='msglet-message'>${message}</span> <span class='msglet-count'><span>`
        msglet_wrapper.appendChild(msglet)
        console_msg_div.prepend(msglet_wrapper)
        slide_show(msglet_wrapper)
        // Calculate the time left of the message
        let lifespan = Math.min(1000 + message.length * 100, 5000)
        // Generate a progress bar
        let progress_bar = document.createElement('div')
        progress_bar.classList.add('console-message-wrapper-progress-bar')
        let progress = document.createElement('div')
        progress.classList.add('console-message-wrapper-progress')
        progress_bar.appendChild(progress)
        msglet.appendChild(progress_bar)
        progress.style.transitionDuration = lifespan + 'ms'
        // Animate the progress bar
        setTimeout(() => {
            progress.style.transform = 'scaleX(0)'
        }, 100)
        // Force hidden after focus changed back
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                document.querySelectorAll('div.console-message-wrapper').forEach(ele => {
                    exit_to_right(ele)
                });
            }
        })
        // Easeout the message after few seconds
        progress.addEventListener('transitionend', () => {
            if (progress.style.transform === 'scaleX(0)') {
                exit_to_right(msglet_wrapper)
            }
        })
    }


    // Monkey Patch
    if (window.location.hostname !== 'localhost') {  // Only works on host other than localhost
      console.log = (...args) => console_call('log', original_console_log, ...args)
      console.error = (...args) => console_call('error', original_console_error, ...args)
      console.warn = (...args) => console_call('warn', original_console_warn, ...args)
      console.info = (...args) => console_call('info', original_console_info, ...args)
      console.debug = (...args) => console_call('debug', original_console_debug, ...args)
    }
})();