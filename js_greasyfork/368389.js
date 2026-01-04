// ==UserScript==
// @name            YouTube Time Remaining
// @description     Display the remaining time of a YouTube video during playback.
// @version         1.9.4
// @author          stinkrock
// @license         MIT
// @namespace       patchmonkey
// @match           https://www.youtube.com/*
// @run-at          document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/368389/YouTube%20Time%20Remaining.user.js
// @updateURL https://update.greasyfork.org/scripts/368389/YouTube%20Time%20Remaining.meta.js
// ==/UserScript==


const STREAM = '.video-stream.html5-main-video'

const CONTAINER = 'ytd-video-primary-info-renderer #container #info, #above-the-fold #top-row'

const PLAYER = 'yt-player-updated'

const PAGE = 'yt-page-data-updated'


const create = x => document.createElement(x)

const text = x => document.createTextNode(x)

const append = (x, y) => x.appendChild(y)

const query = x => y => y.querySelector(x)


const comp = (f, g) => x => g(f(x))

const compose = (...f) => f.reduce(comp)


const each = x => f => f(x)

const list = (...f) => x => f.map(each(x))

const map = f => x => x.map(f)

const join = x => y => y.join(x)


const digits = x => x < 10 ? '0' + x : x

const hours = x => Math.trunc(x / 3600)

const minutes = x => Math.trunc(x % 3600 / 60)

const seconds = x => Math.ceil(x % 3600 % 60)


const target = x => x.target

const delta = x => (x.duration - x.currentTime) / x.playbackRate

const percent = x => 100 * x.currentTime / x.duration

const number = x => isFinite(x) ? x : 0

const fixed = x => y => y.toFixed(x)

const add = x => y => y + x

const data = x => y => x.data = y

const insert = x => y => y.parentNode.insertBefore(x, y)

const timer = f => x => x.ontimeupdate = f


const convert = list(hours, minutes, seconds)

const format = compose(map(digits), join(':'))

const symbol = compose(fixed(2), add('%'))

const time = compose(delta, number, convert, format)

const progress = compose(percent, number, symbol)


const element = create('div')

const string = append(element, text(''))


const update = compose(list(time, progress), join(' • '), data(string))

const display = compose(query(CONTAINER), insert(element))

const listen = compose(query(STREAM), timer(compose(target, update)))


element.style.cssText = 'display:flex;font-size:1.6rem;font-weight:400;line-height:2rem;color:#e91e63;'

element.className = 'time-remaining-renderer'


window.addEventListener(PAGE, compose(target, display))

window.addEventListener(PLAYER, compose(target, listen))


Promise.resolve(document.body).then(display).catch(e => e)

Promise.resolve(document.body).then(listen).catch(e => e)