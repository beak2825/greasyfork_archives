// ==UserScript==
// @name        Omegle Grabber
// @description Get IP addresses on multiple video chat sites
// @version     0.7.0
// @author      Adam Thompson-Sharpe
// @namespace   MysteryBlokHed
// @license     GPL-3.0
// @copyright   2022 Adam Thomspon-Sharpe
// @homepageURL https://gitlab.com/MysteryBlokHed/userscripts/-/tree/main/OmegleGrabber
// @supportURL  https://gitlab.com/MysteryBlokHed/userscripts/-/issues
// @match       *://*.omegle.com/*
// @match       *://*.ome.tv/*
// @match       *://*.chathub.cam/*
// @match       *://*.emeraldchat.com/*
// @match       *://*.camsurf.com/*
// @match       *://*.strangercam.com/*
// @match       *://*.allotalk.com/*
// @require     https://greasyfork.org/scripts/440463-greasetools/code/greasetools.js?version=1021292
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/440464/Omegle%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/440464/Omegle%20Grabber.meta.js
// ==/UserScript==
/// <reference types="greasetools" />
;(() => {
  const { xhrPromise } = GreaseTools
  const SiteMap = {
    'www.omegle.com': 'omegle',
    'ome.tv': 'ometv',
    'chathub.cam': 'chathub',
    'www.emeraldchat.com': 'emeraldchat',
    'camsurf.com': 'camsurf',
    'strangercam.com': 'strangerOrAllo',
    'app.strangercam.com': 'strangerOrAllo',
    'randomchat.allotalk.com': 'strangerOrAllo',
  }
  let currentIp = 'Not Found'
  const srflxIp = candidate => {
    var _a
    if (!candidate.candidate || !candidate.candidate.includes('typ srflx'))
      return null
    const addresses = candidate.candidate.match(
      /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g,
    )
    return addresses
      ? (_a = addresses[0]) !== null && _a !== void 0
        ? _a
        : null
      : null
  }
  const removeWhenExists = getEl => {
    const interval = setInterval(() => {
      const el = getEl()
      if (el) {
        el.remove()
        clearInterval(interval)
      }
    }, 500)
  }
  const Sites = {
    omegle: {
      getIp: srflxIp,
      onload() {
        removeWhenExists(() => document.querySelector('#videologo'))
      },
      addIpInfo(message) {
        const chatbox = document.querySelector('.logbox .logitem')
        if (!chatbox) return
        chatbox.innerText = message
      },
    },
    ometv: {
      lastCandidateType: 'relay',
      onload() {
        removeWhenExists(() =>
          document.querySelector('.remote-video__watermark'),
        )
      },
      getIp(candidate) {
        const lastCandidateType = this.lastCandidateType
        this.lastCandidateType = candidate.type
        if (candidate.type === 'relay' && lastCandidateType !== 'relay')
          return candidate.address
        return null
      },
      addIpInfo(message) {
        const chat = document.querySelector('.message.system')
        if (!chat) return
        const messageContainer = document.createElement('div')
        messageContainer.className = 'message in'
        messageContainer.style.textAlign = 'center'
        const messageEl = document.createElement('span')
        messageEl.innerText = message
        messageContainer.appendChild(messageEl)
        chat.prepend(messageContainer)
      },
    },
    chathub: {
      getIp: srflxIp,
      addIpInfo(message) {
        const chatbox = document.querySelector('#message-section')
        if (!chatbox) return
        const messageEl = document.createElement('p')
        messageEl.style.textAlign = 'center'
        messageEl.innerText = message
        chatbox.prepend(messageEl)
      },
    },
    emeraldchat: {
      getIp: srflxIp,
      addIpInfo(message) {
        if (!this.ipInfoEl) {
          const chatbox = document.querySelector('#messages')
          if (!chatbox) return
          this.ipInfoEl = document.createElement('p')
          this.ipInfoEl.style.textAlign = 'center'
          chatbox.prepend(this.ipInfoEl)
        }
        this.ipInfoEl.innerText = message
      },
      rtcClose() {
        this.addIpInfo(currentIp)
      },
    },
    camsurf: {
      getIp: srflxIp,
      addIpInfo(message) {
        const chatbox = document.querySelector('.rv_head.chat-ava > p')
        console.log(chatbox)
        if (!chatbox) return
        chatbox.innerText = message
      },
    },
    strangerOrAllo: {
      getIp: srflxIp,
      addIpInfo(message) {
        const chatBody = document.querySelector('.chat-body')
        if (!chatBody) return
        const remoteChat = document.createElement('div')
        remoteChat.className = 'remote-chat'
        const container = document.createElement('div')
        const ipInfo = document.createElement('span')
        ipInfo.className = 'server-msg'
        ipInfo.innerText = message
        container.appendChild(ipInfo)
        remoteChat.appendChild(container)
        chatBody.prepend(remoteChat)
      },
    },
  }
  /**
   * Get the active site
   * @returns The active site
   * @throws {Error} Thrown if an unsupported site is visited
   */
  const getSite = () => {
    if (location.hostname in SiteMap) return SiteMap[location.hostname]
    throw new Error(`Activated on unsupported site (${location.hostname})`)
  }
  /** The active site */
  const site = getSite()
  window.addEventListener('load', () => {
    var _a, _b
    return (_b = (_a = Sites[site]).onload) === null || _b === void 0
      ? void 0
      : _b.call(_a)
  })
  /** Some sites hijack most logging functions, but they tend to forget about groups */
  const groupLog = (...data) => {
    console.groupCollapsed(...data)
    console.groupEnd()
  }
  /**
   * @param code A two-letter country code
   * @returns A Promise that resolves with the country's full name and its flag emoji,
   * or rejects with the message returned by the API in case of failure
   */
  const fullCountry = code =>
    new Promise(async (resolve, reject) => {
      const result = await fetch(
        `https://restcountries.com/v3.1/alpha/${code.toUpperCase()}`,
      )
      const response = JSON.parse(await result.text())[0]
      if (result.status !== 200) reject(response.text)
      resolve(
        `${response.name.common} ${response.flag} (${code.toUpperCase()})`,
      )
    })
  /** Look up ip info */
  const findIpInfo = ip =>
    new Promise(resolve => {
      xhrPromise({
        method: 'GET',
        url: `https://ipinfo.io/${ip}/json`,
      })
        .then(async ({ responseText }) => {
          const info = JSON.parse(responseText)
          resolve({
            ip,
            country: await fullCountry(info.country).catch(() => info.country),
            region: info.region,
            city: info.city,
            org: info.org,
            loc: info.loc,
            tz: info.timezone,
          })
        })
        .catch(() => {
          groupLog('Failed to get IP info from ipinfo.io')
          resolve({ ip })
        })
    })
  const defaultInfo = ({ ip, country, region, city, org, loc, tz }) => {
    return {
      ip,
      country: country !== null && country !== void 0 ? country : 'Not Found',
      region: region !== null && region !== void 0 ? region : 'Not Found',
      city: city !== null && city !== void 0 ? city : 'Not Found',
      org: org !== null && org !== void 0 ? org : 'Not Found',
      loc: loc !== null && loc !== void 0 ? loc : 'Not Found',
      tz: tz !== null && tz !== void 0 ? tz : 'Not Found',
    }
  }
  const getTime = timeZone => new Date().toLocaleString('en-US', { timeZone })
  /** Add IP info to the chatbox */
  const addIpInfo = info => {
    const { ip, country, region, city, org, loc, tz } = defaultInfo(info)
    Sites[site].addIpInfo(`\
IP: ${ip}
Country: ${country}
Region: ${region}
City: ${city}
Org: ${org}
APPROX Coords: ${loc}
Timezone: ${tz}
Time (When First Connected): ${getTime(tz)}
\n`)
  }
  /**
   * Proxy handler for the RTCPeerConnection.prototype.addIceCandidate function
   */
  const addIceCandidateHandler = {
    apply(target, thisArg, args) {
      const candidate = args[0]
      console.groupCollapsed('Candidate', candidate, 'added')
      groupLog('Type:\t\t', candidate.type)
      groupLog('Address:\t', candidate.address)
      groupLog('Related:\t', candidate.relatedAddress)
      console.groupEnd()
      const ip = Sites[site].getIp(candidate)
      if (ip && ip !== currentIp) {
        currentIp = ip
        groupLog('IP FOUND:', currentIp)
        findIpInfo(currentIp).then(info => {
          groupLog('IP INFO:', info)
          addIpInfo(info)
        })
      }
      return Reflect.apply(target, thisArg, args)
    },
  }
  /**
   * Proxy handler for the RTCPeerConnection.prototype.close function
   */
  const closeHandler = {
    apply(target, thisArg, args) {
      var _a, _b
      currentIp = 'Not Found'
      // Call rtcClose if defined
      ;(_b = (_a = Sites[site]).rtcClose) === null || _b === void 0
        ? void 0
        : _b.call(_a)
      return Reflect.apply(target, thisArg, args)
    },
  }
  RTCPeerConnection.prototype.addIceCandidate = new Proxy(
    RTCPeerConnection.prototype.addIceCandidate,
    addIceCandidateHandler,
  )
  RTCPeerConnection.prototype.close = new Proxy(
    RTCPeerConnection.prototype.close,
    closeHandler,
  )
})()
