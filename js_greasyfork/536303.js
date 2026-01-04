// ==UserScript==
// @name        T3.chat  -  Autofocus message input
// @namespace   Violentmonkey Scripts
// @match       https://beta.t3.chat/*
// @match       https://t3.chat/*
// @grant       none
// @version     2025-05-19_12:27
// @author      koza.dev
// @description Automatically focuses the message input field when you start writing or pasting.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536303/T3chat%20%20-%20%20Autofocus%20message%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/536303/T3chat%20%20-%20%20Autofocus%20message%20input.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('keydown', function(e) {
        // Ignore if modifier keys are pressed, or if default is already prevented
        if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || e.defaultPrevented) {
            return
        }

        // We're interested in single, printable characters
        if (e.key.length !== 1) {
            return
        }

        const chatInput = document.getElementById('chat-input')
        if (!chatInput) {
            return // Chat input not found
        }

        const active = document.activeElement

        // If chatInput is ALREADY focused, let the browser handle everything natively.
        // This is key for Svelte's reactivity to work as expected.
        if (active === chatInput) {
            return
        }

        // If another input, textarea, or contenteditable element is focused, do nothing.
        if (
            active &&
            (active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable)
        ) {
            return
        }

        // If we're here, a printable key was pressed, chatInput exists,
        // it's not focused, and no other editable field is focused.
        // So, we'll take over.

        e.preventDefault() // Prevent typing into the body or triggering shortcuts

        chatInput.focus()

        const character = e.key
        const currentVal = chatInput.value
        const selectionStart = chatInput.selectionStart
        const selectionEnd = chatInput.selectionEnd

        // Insert character, replacing selection if any
        chatInput.value =
            currentVal.substring(0, selectionStart) +
            character +
            currentVal.substring(selectionEnd)

        // Move cursor after the inserted character
        const newCursorPos = selectionStart + character.length
        chatInput.selectionStart = newCursorPos
        chatInput.selectionEnd = newCursorPos

        // Dispatch a detailed 'input' event that Svelte should recognize
        chatInput.dispatchEvent(
            new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                data: character,
                inputType: 'insertText'
            })
        )

        // Dispatch 'change' event for good measure, though 'input' is usually primary
        chatInput.dispatchEvent(new Event('change', { bubbles: true }))
    })

    // Handle paste events the same way
    window.addEventListener('paste', function(e) {
        const chatInput = document.getElementById('chat-input')
        if (!chatInput) {
            return
        }

        const active = document.activeElement

        if (active === chatInput) {
            return
        }

        if (
            active &&
            (active.tagName === 'INPUT' ||
                active.tagName === 'TEXTAREA' ||
                active.isContentEditable)
        ) {
            return
        }

        e.preventDefault()
        chatInput.focus()

        const clipboardData = e.clipboardData || window.clipboardData
        const pasteData = clipboardData.getData('text')

        const currentVal = chatInput.value
        const selectionStart = chatInput.selectionStart
        const selectionEnd = chatInput.selectionEnd

        chatInput.value =
            currentVal.substring(0, selectionStart) +
            pasteData +
            currentVal.substring(selectionEnd)

        const newCursorPos = selectionStart + pasteData.length
        chatInput.selectionStart = newCursorPos
        chatInput.selectionEnd = newCursorPos

        chatInput.dispatchEvent(
            new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                data: pasteData,
                inputType: 'insertText'
            })
        )

        chatInput.dispatchEvent(new Event('change', { bubbles: true }))
    })
})()