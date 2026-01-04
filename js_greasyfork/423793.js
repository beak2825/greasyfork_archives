// ==UserScript==
// @name         Wanikani Forums: Emoter
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  Custom emote handler
// @author       Kumirei
// @include      https://community.wanikani.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/423793/Wanikani%20Forums%3A%20Emoter.user.js
// @updateURL https://update.greasyfork.org/scripts/423793/Wanikani%20Forums%3A%20Emoter.meta.js
// ==/UserScript==

;(function () {
    const COMMAND_TEMPLATE = /!emote\s+(\w+)\s+(\w+)\s+(["“„](\S+)["”])?/i
    const EMOTE_TEMPLATE = /<abbr title="\w+">!\[(\w+)\|\d+x\d+\]\([^)]+\)<\/abbr>/g

    let prettyTextEmoji

    waitForRequire().then(() => {
        registerEmotes()
        setInterval(prepareEditor, 1000)
    })

    // Waits for window.require to be available
    function waitForRequire() {
        return new Promise((res, rej) => {
            const interval = setInterval(() => {
                try {
                    if (!window.require) return
                    prettyTextEmoji = window.require('pretty-text/emoji')
                    if (!prettyTextEmoji?.registerEmoji) return // Wait until we can register emotes, too
                    clearInterval(interval)
                } catch (error) {}
                res()
            }, 100)
        })
    }

    // Register emotes in Discord
    function registerEmotes() {
        const cache = get_local()
        const register = prettyTextEmoji?.registerEmoji
        for (let [name, { url }] of Object.entries(cache.emotes)) register?.(name, url, 'Emoter')
    }

    // Fetch local storage cache
    function get_local() {
        const cache = JSON.parse(localStorage.getItem('Emoter') || '{}')
        return Object.assign({ size: 40, emotes: {} }, cache)
    }

    // Set up the editor to show the input and the preview to render the real content
    function prepareEditor() {
        const editor = document.querySelector('.d-editor-input')
        if (!editor || editor.emoter?.ready) return

        // Sets or wraps getters and setters of textarea element's "value" property
        let set = (text) => {
            text = unModifyText(text)
            return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(editor), 'value').set.call(editor, text)
        }
        let get = () => {
            const text = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(editor), 'value').get.call(editor)
            return modifyText(text)
        }
        const oldSet = Object.getOwnPropertyDescriptor(editor, 'value')?.set
        const oldGet = Object.getOwnPropertyDescriptor(editor, 'value')?.get
        if (oldSet) set = (text) => oldSet(unModifyText(text))
        if (oldGet) get = () => modifyText(oldGet())
        Object.defineProperty(editor, 'value', {
            set(text) {
                return set(text)
            },
            get() {
                return get()
            },
            configurable: true,
        })

        editor.value = editor.value // Trigger unModify and modify

        editor.emoter = { ready: true }
    }

    // Replaces cooked emotes with :name:
    function unModifyText(text) {
        return text.replace(EMOTE_TEMPLATE, ':$1:')
    }

    // Replaces :emotes: and !emotelist and other !commands
    function modifyText(text) {
        const cache = get_local()
        text = process_command(text, cache) // Just need to process one command at a time
        text = replace_emotes(text, cache)
        text = replace_list(text, cache)
        return text
    }

    // Handles commands
    function process_command(text, cache) {
        const command = text.match(COMMAND_TEMPLATE)
        if (!command) return text
        const emotes = cache.emotes
        let [_, word, name, __, value] = command
        word = word.toLowerCase()
        switch (word) {
            case 'new': // !emote new NAME "URL"
                if (value) {
                    emotes[name] = { url: value }
                    prettyTextEmoji?.registerEmoji(name, value, 'Emoter')
                }
                break
            case 'size': // !emote size NAME "SIZE"
                if (value && !value.match(/\d+(x\d+)?/i)) break
                if (name === 'default') cache.size = value
            case 'url': // !emote url NAME "URL"
                if (value && emotes[name]) {
                    emotes[name][word] = value
                    prettyTextEmoji?.extendedEmojiList().set(name, value)
                }
                break
            case 'remove': // !emote remove NAME
                prettyTextEmoji?.extendedEmojiList().delete(name)
                delete emotes[name]
                break
            case 'rename': // !emote rename NAME "NAME"
                if (value && emotes[name]) {
                    delete Object.assign(emotes, { [value]: emotes[name] })[name]
                    prettyTextEmoji?.extendedEmojiList().delete(name)
                    prettyTextEmoji?.registerEmoji(value, emotes[name].url, 'Emoter')
                }
                break
        }
        set_local(cache)

        if (value || word === 'remove') {
            return text.replace(COMMAND_TEMPLATE, ':$2:')
        }

        return text
    }

    // Replaces :emotes: with images
    function replace_emotes(text, cache) {
        return text.replace(/:(\w+):/g, (original, word) => {
            const emote = cache.emotes[word]
            return emote ? get_image(emote.url, word, emote?.size || cache.size) : original
        })
    }

    // Create a table of the available emotes
    function replace_list(raw, cache) {
        const list = Object.entries(cache.emotes)
            .map((e) => get_image(e[1].url, e[0], e[1].size || cache.size).replace('|', `\\|`) + `|` + e[0])
            .join('\n')
        const table = `Image|Name\n-|-\n${list}</table>`
        return raw.replace(/!emotelist/i, table)
    }

    // Creates an image for the emote
    function get_image(url, name, size) {
        let w = size,
            h = size
        if (size.match && size.match(/\d+x\d+/i)) [w, h] = size.split('x')
        return `<abbr title="${name}">![${name}|${w}x${h}](${url})</abbr>`
    }

    // Saves to local storage
    function set_local(cache) {
        localStorage.setItem('Emoter', JSON.stringify(cache))
    }
})()
