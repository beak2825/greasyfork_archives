// ==UserScript==
// @name        Google Sheets Stopwatch
// @namespace   Violentmonkey Scripts
// @match       https://docs.google.com/spreadsheets/d/*/edit
// @grant       none
// @version     1.0
// @author      -
// @description 1/7/2022, 9:06:21 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438178/Google%20Sheets%20Stopwatch.user.js
// @updateURL https://update.greasyfork.org/scripts/438178/Google%20Sheets%20Stopwatch.meta.js
// ==/UserScript==
  function mountTimer(mountToEl) {
    const $ = (...args) => {
      if (args.length > 1) args.reverse()
      const [query, parent = document] = args
      return Array.from(parent.querySelectorAll(query))
    }

    $.create = (html) => {
      const div = document.createElement('div')
      div.innerHTML = html
      return div.children[0]
    }

    const unique = (arr) => [...new Set(arr)]

    const uniqueId = (() => {
      let id = 1
      return () => id++
    })()

    const normalizeEventName = (name) =>
      name.trim().toLowerCase().replace(/^on/, '')

    const mount = (root, elem) => {
      root.innerHTML = ''
      root.appendChild(elem)
    }

    const REGEXES = {
      openingHtmlTags: /<[^\/].*?>/gm,
      nameAndFunc: /\s(on[A-Z].+?\})/gm,
    }

    function renderWithEvents(htmlStr, events) {
      const eventStore = {}

      const newHtmlStr = htmlStr.replace(REGEXES.openingHtmlTags, (tag) => {
        const tagId = uniqueId()
        return tag.replace(REGEXES.nameAndFunc, (nameAndFunc) => {
          const [eventNameCamel, funcName] = nameAndFunc
            .replace(/[\{\}]/g, '')
            .split('=')

          eventStore[tagId + '-' + normalizeEventName(eventNameCamel)] =
            funcName
          return ' data-id="' + tagId + '"'
        })
      })

      const root = $.create(newHtmlStr)

      const allEventNames = unique(
        Object.keys(eventStore).map((v) => v.split('-')[1])
      )

      allEventNames.forEach((eventName) => {
        root.addEventListener(eventName, (e) => {
          const funcName =
            eventStore[e.target.getAttribute('data-id') + '-' + eventName]

          funcName && events[funcName] && events[funcName](e)
        })
      })

      return $(root, '[id]').reduce(
        (acc, el) => {
          acc['$' + el.id] = el
          return acc
        },
        { $root: root }
      )
    }
    const padZero = (val, n) =>
      val.toString().length > n ? val : ('0' + val).slice(n * -1)

    const startOfDay = (date) => new Date(new Date(date).setHours(0, 0, 0, 0))

    const secsToTime = (secs, withSeconds = false) => {
      const mmss = new Date(startOfDay(new Date()).getTime() + secs * 1000)
        .toString()
        .substr(19, withSeconds ? 5 : 2)
      const hh = padZero(Math.floor(secs / 60 / 60), 2)

      return [hh, mmss].join(':')
    }

    const createInterval = () => {
      let interval = null
      const start = (cb, delay) =>
        !interval && (interval = setInterval(cb, delay))
      const stop = () => {
        clearInterval(interval)
        interval = null
      }
      return { start, stop }
    }

    const createTimer = (initial, delay = 1000) => {
      const interval = createInterval()
      let duration = initial
      let lastPlay = null

      const play = (cb) => {
        interval.start(() => {
          cb((duration += new Date().getTime() / 1000 - lastPlay))
          lastPlay = new Date().getTime() / 1000
        }, delay)

        lastPlay = new Date().getTime() / 1000
      }
      const pause = () => interval.stop()

      return { play, pause }
    }

    let timer = createTimer(0, 1000)

    const state = {
      status: 'paused',
      duration: '00:00:00',
    }

    function updateState(fresh) {
      Object.assign(state, fresh)
      render(state)
    }

    const DOMEvents = {
      startStop() {
        const newStatus = state.status === 'playing' ? 'paused' : 'playing'

        newStatus === 'playing'
          ? timer.play((seconds) =>
              updateState({ duration: secsToTime(seconds, true) })
            )
          : timer.pause()

        updateState({
          status: newStatus,
        })
      },

      reset() {
        timer.pause()
        timer = createTimer(0, 1000)
        updateState({
          duration: '00:00:00',
          status: 'paused',
        })
      },
    }

    function render(state) {
      const style = {
        base: [
          'border-radius: 100px',
          'border:none',
          'padding: 6px 16px',
          'color: #fff',
          'text-decoration: none',
          'font-size: 16px',
          'cursor: pointer',
          'background: #D2D2D2',
        ].join(';'),
        active: ['background: #76B3FA'].join(';'),
      }

      const template = `
          <div>
            <button id='timer' style="${[
              style.base,
              state.status === 'playing' ? style.active : '',
            ].join(';')}" onClick={startStop}>${state.duration}</button>
            <button onClick={reset} style="${style.base}">x</button>
          </div>
        `

      const { $root } = renderWithEvents(template, DOMEvents)
      mount(mountToEl, $root)
    }

    render(state)
  }

  const div = document.createElement('div')
  mountTimer(div)
  document.querySelector('.docs-titlebar-buttons').prepend(div)