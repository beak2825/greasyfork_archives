// ==UserScript==
// @name         Twitch Scroll Wheel Volume
// @description  Scroll wheel volume control for Twitch
// @include      https://www.twitch.tv/*
// @include      https://*.ext-twitch.tv/*
// @run-at       document-idle
// @allFrames    true
// @version 0.0.1.20260104195902
// @namespace https://greasyfork.org/users/286737
// @downloadURL https://update.greasyfork.org/scripts/420862/Twitch%20Scroll%20Wheel%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/420862/Twitch%20Scroll%20Wheel%20Volume.meta.js
// ==/UserScript==

class Player {
    constructor() {
        this.wheelVolume = new WheelVolume()
    }

    async init() {
        let $root

        while (!($root = $('.root-scrollable__wrapper'))) await wait(2000)

        this.$root = $root

        const onRootMutation = this.onRootMutation.bind(this)

        new MutationObserver(onRootMutation).observe($root, {childList: true})

        onRootMutation()
    }

    onRootMutation() {
        const $player = $('.persistent-player', this.$root)

        if ($player == this.$player) return

        this.$player = $player

        if ($player) this.onNewPlayer()
    }

    async onNewPlayer() {
        const api = await this.getApi()
        const $eventCatcher = $('.video-ref', this.$player)

        this.wheelVolume.init(api, $eventCatcher)
    }

    async getApi() {
        const playerSel = 'div[data-a-target="player-overlay-click-handler"], .video-player'
        let $el, api

        while (!($el = $(playerSel, unsafeWindow.document))) await wait(2000)
        while (!(api = this.getReactPlayerApi($el))) await wait(500)

        return api
    }

    getReactPlayerApi($el) {
        let instance

        for (const key in $el) {
            if (key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$')) {
                instance = $el[key]
            }
        }

        let parent = instance.return

        for (let i = 0; i < 50; i++) {
            const player = parent.memoizedProps.mediaPlayerInstance

            if (player) return player.core

            parent = parent.return
        }
    }
}

class WheelVolume {
    constructor() {
        this.onWheelHandler = this.onWheel.bind(this)
        this.onMousedownHandler = this.onMousedown.bind(this)

        this.events = {
            mouseout: new Event('mouseout', {bubbles: true}),
            focusin: new Event('focusin', {bubbles: true})
        }

        const onExtMessage = this.onExtMessage.bind(this)

        addEventListener('message', onExtMessage)
    }

    init(api, $eventCatcher) {
        this.api = api
        this.$eventCatcher = $eventCatcher

        $eventCatcher.addEventListener('wheel', this.onWheelHandler)
        $eventCatcher.addEventListener('mousedown', this.onMousedownHandler)
    }

    onWheel(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        this.updateVolume(e.deltaY < 0)
    }

    onMousedown(e) {
        if (e.which != 2) return

        e.preventDefault()

        this.toggleMute()
    }

    onExtMessage(e) {
        const event = e.data.wheelEvent

        if (!event) return

        switch (event) {
            case 'up':
                this.updateVolume(true)
                break
            case 'down':
                this.updateVolume(false)
                break
            case 'click':
                this.toggleMute()
        }
    }

    updateVolume(shouldIncrease) {
        this.show()

        const api = this.api, volume = api.getVolume()

        if (api.isMuted()) api.setMuted(false)

        if ((volume == 0 && !shouldIncrease) || (volume == 1 && shouldIncrease)) return

        const now = Date.now(), since = now - this.prevScrollDate
        const step = (shouldIncrease ? 1 : -1) * (since < 50 ? 4 : 1) * .01

        api.setVolume(volume + step)

        this.prevScrollDate = now
    }

    toggleMute() {
        this.show()

        const api = this.api

        api.setMuted(!api.isMuted())
    }

    show() {
        let $volumeBar = this.$volumeBar

        if (!this.$eventCatcher.contains($volumeBar)) {
            $volumeBar = this.$volumeBar = $('[data-a-target="player-volume-slider"]', this.$eventCatcher)

            if (!$volumeBar) return
        }

        const events = this.events

        clearTimeout(this.showTimeout)

        $volumeBar.dispatchEvent(events.focusin)

        this.showTimeout = setTimeout(() => $volumeBar.dispatchEvent(events.mouseout), 1000)
    }
}

class ExtFrame {
    init() {
        const onWheel = this.onWheel.bind(this)
        const onMousedown = this.onMousedown.bind(this)

        addEventListener('wheel', onWheel, {passive: false})
        addEventListener('mousedown', onMousedown, {passive: false})
    }

    onWheel(e) {
        e.preventDefault()
        e.stopPropagation()

        this.sendEvent(e.deltaY < 0 ? 'up' : 'down')
    }

    onMousedown(e) {
        if (e.which != 2) return

        e.preventDefault()

        this.sendEvent('click')
    }

    sendEvent(name) {
        parent.postMessage({wheelEvent: name}, 'https://supervisor.ext-twitch.tv/')
    }
}

const init = () => {
    if (location.host == 'www.twitch.tv') return new Player().init()

    const params = new URLSearchParams(location.search)

    if (params.get('anchor') == 'video_overlay') new ExtFrame().init()
}


const $ = (sel, el = document) => el.querySelector(sel)

const wait = async (ms) => await new Promise(r => setTimeout(r, ms))


init()