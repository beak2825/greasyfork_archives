// ==UserScript==
// @name        Arusu_SFX
// @namespace   https://arusu.astr.moe
// @version     1.5
// @description play sound effect when tagged and vote
// @author      Pohan
// @match       https://arusu.astr.moe/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/400385/Arusu_SFX.user.js
// @updateURL https://update.greasyfork.org/scripts/400385/Arusu_SFX.meta.js
// ==/UserScript==

/* 被標註時的音效 */
const TAG_AUDIO = {
  url: 'https://freesound.org/data/previews/511/511485_6890478-lq.ogg',
  volume : 1.0
}
/* 投票時的音效 */
const VOTE_AUDIO = {
  url: 'https://freesound.org/data/previews/495/495674_3979548-lq.ogg',
  volume : 0.7
}

window.onload = () => {
  setTimeout(() => {
    const tagAudioPlayer = new AudioPlayer(TAG_AUDIO.url).setVolume(TAG_AUDIO.volume)
    const voteAudioPlayer = new AudioPlayer(VOTE_AUDIO.url).setVolume(VOTE_AUDIO.volume)
    let location = window.location.href
    let arusuSFX = null
    const tryCreate = (location) => {
      if (location.match(/https:\/\/.+\/.+/)) {
        console.log('[Arusu_SFX] You are in room now.')
        arusuSFX = new Arusu_SFX(tagAudioPlayer, voteAudioPlayer)
      } else {
        console.log('[Arusu_SFX] You are in lobby now.')
      }
    }
    tryCreate(location)
    const observer = new MutationObserver(_ => {
      const current = window.location.href
      if (location !== current) {
        location = current
        tryCreate(location)
      }
    })
    observer.observe(document.getElementById('__layout').children[0], { childList: true })
  }, 100)
}

class Arusu_SFX {
  constructor(tagAudioPlayer, voteAudioPlayer) {
    this.tagAudioPlayer = tagAudioPlayer
    this.voteAudioPlayer = voteAudioPlayer
    this.init = this.init.bind(this)
    this.detectTag = this.detectTag.bind(this)
    console.log('[Arusu_SFX] Create Arusu_SFX class.')
    this.prepare()
      .then(this.init)
  }

  prepare() {
    return new Promise(resolve => {
      let spinnerHasFound = this.spinnerIsFound
      const timer = setInterval(() => {
        if (!spinnerHasFound && this.spinnerIsFound) {
          spinnerHasFound = true
        } else if (spinnerHasFound && !this.spinnerIsFound) {
          clearInterval(timer)
          resolve()
        }
      }, 100)
    })
  }

  get spinnerIsFound() {
    const el = document.getElementsByClassName('modal-wrapper')
    return el.length > 0
  }

  init() {
    this.detectName()
    this.detectTag()
    this.detectVote()
  }

  detectName() {
    this.findByClasses('form-control mr-2')
    .then(res => {
      this.nameInput = res
      console.log(`[Arusu_SFX] Hello, ${res.value}!`)
    })
  }

  detectTag() {
    const classes = 'table b-table messages align-middle table-borderless table-sm'
    this.findByClasses(classes)
    .then(res => res.children[1])
    .then(res => {
      this.Observer(res, _ => {
        const message = res.children[0].children[1].children[0].children[0].innerHTML
        if (message.includes('@' + this.nameInput.value)) {
          this.tagAudioPlayer.play()
          console.log('[Arusu_SFX] You have been tagged.')
        }
      }, true)
    })
  }

  detectVote() {
    this.findByClasses('d-none d-sm-block')
    .then(res => {
      let trigger = true
      this.Observer(res, _ => {
        const btn = res.getElementsByTagName('button')[0]
        if (trigger && btn) {
          trigger = false
          this.voteAudioPlayer.play()
          console.log('[Arusu_SFX] Vote starts.')
        } else if (!trigger && !btn) {
          trigger = true
        }
      }, true)
    })
  }

  findByClasses(classes, parent = document, duration = 1000) {
    return new Promise(resolve => {
      const find = callback => {
        const el = parent.getElementsByClassName(classes)
        if (el.length > 0) {
          resolve(el[0])
          callback()
        }
      }
      find()
      const timer = setInterval(() => {
        find(() => { clearInterval(timer) })
      }, duration)
    })
  }

  Observer(el, callback, subtree = false) {
    const observer = new MutationObserver((mutations, observer) => {
      callback(mutations, observer)
    })
    observer.observe(el, { childList: true, subtree: subtree })
  }
}

class AudioPlayer {
  constructor(src) {
    this.player = document.createElement('audio')
    this.player.setAttribute('src', src)
    this.player.setAttribute('muted', '')
    document.body.appendChild(this.player)
  }

  play() {
    this.player.load()
    this.player.play()
    return this
  }

  setVolume(value) {
    this.player.volume = value
    return this
  }
}
