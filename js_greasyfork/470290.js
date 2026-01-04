// ==UserScript==
// @name         T.M.D
// @namespace    http://larch.liu/
// @version      0.0.3
// @description  T.M.D Social Media
// @author       Alex Liu (https://github.com/LarchLiu)
// @license      MIT
// @homepageURL  https://github.com/LarchLiu/tmd
// @supportURL   https://github.com/LarchLiu/tmd
// @match        https://twitter.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        GM_xmlhttpRequest
// @grant        window.onurlchange
// @run-at       document-start
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/470290/TMD.user.js
// @updateURL https://update.greasyfork.org/scripts/470290/TMD.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const threadsSrc = 'data:image/svg+xml,%3csvg fill="000" height="100%" viewBox="0 0 192 192" width="100%" xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%3e%3cpath d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"%3e%3c/path%3e%3c/svg%3e'
  const mastondonSrc = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="256" height="274" viewBox="0 0 256 274"%3E%3Cpath fill="%233088D4" d="M249.874 164.085c-3.753 19.307-33.613 40.438-67.908 44.533c-17.883 2.134-35.49 4.095-54.266 3.234c-30.705-1.407-54.933-7.33-54.933-7.33c0 2.99.184 5.836.553 8.498c3.992 30.302 30.047 32.118 54.728 32.964c24.912.852 47.094-6.142 47.094-6.142l1.023 22.521s-17.425 9.357-48.465 11.078c-17.116.94-38.369-.43-63.122-6.983c-53.686-14.21-62.92-71.436-64.332-129.502c-.43-17.24-.165-33.497-.165-47.094c0-59.375 38.903-76.779 38.903-76.779C58.6 4.074 92.259.286 127.25 0h.86c34.991.286 68.673 4.074 88.287 13.083c0 0 38.901 17.404 38.901 76.78c0 0 .488 43.807-5.425 74.222"%2F%3E%3Cpath fill="%23FFF" d="M209.413 94.469v71.894H180.93V96.582c0-14.71-6.19-22.176-18.57-22.176c-13.687 0-20.547 8.857-20.547 26.37v38.195h-28.315v-38.195c0-17.513-6.862-26.37-20.55-26.37c-12.379 0-18.568 7.466-18.568 22.176v69.78H45.897V94.47c0-14.694 3.741-26.37 11.256-35.009c7.75-8.638 17.898-13.066 30.496-13.066c14.575 0 25.613 5.602 32.911 16.808l7.095 11.893l7.096-11.893c7.296-11.206 18.334-16.808 32.911-16.808c12.597 0 22.745 4.428 30.496 13.066c7.513 8.639 11.255 20.315 11.255 35.009"%2F%3E%3C%2Fsvg%3E'
  const elkSrc = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' xmlns:svg=\'http://www.w3.org/2000/svg\' width=\'250\' height=\'250\' fill=\'none\' version=\'1.1\' id=\'svg30\'%3E%3Cdefs id=\'defs34\'/%3E%3Cmask id=\'a\' width=\'240\' height=\'234\' x=\'4\' y=\'1\' maskUnits=\'userSpaceOnUse\' style=\'mask-type:alpha\'%3E%3Cpath fill=\'white\' d=\'M244 123c0 64.617-38.383 112-103 112-64.617 0-103-30.883-103-95.5C38 111.194-8.729 36.236 8 16 29.46-9.959 88.689 6 125 6c64.617 0 119 52.383 119 117Z\' id=\'path19\'/%3E%3C/mask%3E%3Cg mask=\'url(%23a)\' id=\'g28\' transform=\'matrix(0.90923731,0,0,1.0049564,13.520015,-3.1040835)\'%3E%3Cpath fill=\'%23ea9e44\' d=\'m 116.94,88.1 c -13.344,1.552 -20.436,-2.019 -24.706,10.71 0,0 14.336,21.655 52.54,21.112 -2.135,8.848 -1.144,15.368 -1.144,23.207 0,26.079 -20.589,48.821 -65.961,48.821 -23.03,0 -51.015,4.191 -72.367,15.911 -15.175,8.305 -27.048,20.336 -32.302,37.023 l 5.956,8.461 11.4,0.155 v 47.889 l -13.91,21.966 3.998,63.645 H -6.364 L -5.22,335.773 C 1.338,331.892 16.36,321.802 29.171,306.279 46.557,285.4 59.902,255.052 44.193,217.486 l 11.744,-5.045 c 12.887,30.814 8.388,57.514 -2.898,79.013 21.58,-0.698 40.11,-2.095 55.819,-4.734 l -3.584,-43.698 12.659,-1.087 L 129.98,387 h 13.116 l 2.212,-94.459 c 10.447,-4.502 34.239,-21.034 45.372,-78.47 1.372,-6.986 2.135,-12.885 2.516,-17.93 1.754,-12.806 2.745,-27.243 3.051,-43.698 l -18.683,-5.976 h 57.42 l 5.567,-12.807 c -5.414,0.233 -11.896,-2.639 -11.896,-2.639 l 1.297,-6.209 H 242 L 176.801,90.428 c -7.244,2.794 -14.87,6.442 -20.208,10.866 -4.27,-3.105 -19.063,-12.807 -39.653,-13.195 z\' id=\'path22\'/%3E%3Cpath fill=\'%23c16929\' d=\'M 6.217,24.493 18.494,21 c 5.948,21.577 13.345,33.375 22.648,39.352 8.388,5.099 19.75,5.239 31.799,4.579 C 69.433,63.767 66.154,62.137 63.104,59.886 56.317,54.841 50.522,46.458 46.175,31.246 l 12.201,-3.649 c 3.279,11.488 7.092,18.085 12.201,21.888 5.11,3.726 11.286,4.657 18.606,5.433 13.726,1.553 30.884,2.174 52.312,12.264 2.898,1.086 5.872,2.483 8.769,4.036 -0.381,-0.776 -0.762,-1.553 -1.296,-2.406 -3.66,-5.822 -10.828,-11.953 -24.097,-16.92 l 4.27,-12.109 c 21.581,7.917 30.121,19.171 33.553,28.097 3.965,10.168 1.525,18.124 1.525,18.124 -3.05,1.009 -6.1,2.406 -9.608,3.492 -6.634,-4.579 -12.887,-8.033 -18.835,-10.75 C 113.814,70.442 92.31,76.108 73.246,77.893 58.91,79.213 45.794,78.591 34.432,71.295 23.222,64.155 13.385,50.495 6.217,24.493 Z\' id=\'path24\'/%3E%3Cpath fill=\'%23c16929\' d=\'M 90.098,45.294 C 87.582,39.55 86.057,32.487 86.743,23.794 l 12.659,0.932 c -0.763,10.555 2.897,17.696 7.015,22.353 -5.338,-0.931 -10.447,-1.04 -16.319,-1.785 z m 80.069,-1.32 8.312,-9.702 c 21.58,19.094 8.159,46.415 8.159,46.415 l -11.819,-1.32 c -0.382,-6.24 -1.144,-17.836 -6.635,-24.371 3.584,1.84 6.635,3.865 9.99,6.908 0,-5.666 -1.754,-12.341 -8.007,-17.93 z\' id=\'path26\'/%3E%3C/g%3E%3C/svg%3E'

  let userList = []

  function followingList(nodes) {
    const els = Array.from(nodes)

    els.filter((el) => {
      return !el.querySelector('#tmd')
    }).forEach((node) => {
      const button = node.querySelector('div[dir=\'auto\']')
      const parent = button ? button.parentElement : null
      if (parent) {
        const links = parent.querySelectorAll('a[role=\'link\']')
        let twitterName = ''
        let mastondonName = ''
        let threadsName = ''
        for (let i = 0; i < links.length; i++) {
          if (links[i].textContent.includes('@')) {
            twitterName = links[i].textContent.slice(1)
            break
          }
        }
        if (twitterName && userList) {
          for (let i = 0; i < userList.length; i++) {
            if (userList[i] && userList[i].length && userList[i][0] === twitterName) {
              if (userList[i].length > 1)
                mastondonName = userList[i][1]
              if (userList[i].length > 2)
                threadsName = userList[i][2]
              break
            }
          }
        }
        const div = document.createElement('div')
        Object.assign(div.style, {
          display: 'flex',
          gap: '0.5em',
        })

        const mastondon = document.createElement('a')
        mastondon.target = '_blank'
        mastondon.href = `https://mas.to/@${mastondonName}`
        mastondon.innerText = ''
        Object.assign(mastondon.style, {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5em',
          cursor: 'pointer',
        })

        const mastondonIcon = document.createElement('img')
        mastondonIcon.src = mastondonSrc
        mastondonIcon.height = 24

        const elk = document.createElement('a')
        elk.target = '_blank'
        elk.href = `https://elk.zone/mas.to/@${mastondonName}`
        elk.innerText = ''
        Object.assign(elk.style, {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5em',
          cursor: 'pointer',
        })

        const elkIcon = document.createElement('img')
        elkIcon.src = elkSrc
        elkIcon.height = 28

        const threads = document.createElement('a')
        threads.target = '_blank'
        threads.href = `https://www.threads.net/@${threadsName}`
        threads.innerText = ''
        Object.assign(threads.style, {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5em',
          cursor: 'pointer',
        })

        const threadsIcon = document.createElement('img')
        threadsIcon.src = threadsSrc
        threadsIcon.height = 24

        const text = document.createElement('span')
        text.innerText = ''
        text.id = 'tmd'
        Object.assign(text.style, {
          display: 'none',
        })
        elk.prepend(elkIcon)
        elk.prepend(text)
        mastondon.prepend(mastondonIcon)
        mastondon.prepend(text)
        threads.prepend(threadsIcon)
        threads.prepend(text)
        if (mastondonName) {
          div.appendChild(elk)
          div.appendChild(mastondon)
        }
        if (threadsName)
          div.appendChild(threads)
        if (mastondonName || threadsName)
          parent.appendChild(div)
      }
    })
    return false
  }

  function getUserList() {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://raw.githubusercontent.com/LarchLiu/tmd/main/userList',
      headers: {
        'Content-Type': 'application/json',
      },
      onload(response) {
        userList = response.responseText.split('\n').map((str) => {
          return str.split(',').map(u => u.trim())
        })
      },
    })
  }

  let observer
  function core() {
    const primaryColumn = document.querySelector('div[data-testid=\'primaryColumn\']')
    if (primaryColumn) {
      if (observer)
        observer.disconnect()
      observer = new MutationObserver((mutations) => {
        mutations.forEach((m) => {
          if (m.target.className === '' && m.target.nodeName === 'DIV' && m.addedNodes && m.addedNodes.length)
            followingList(m.addedNodes)
        })
      })
      observer.observe(primaryColumn, { childList: true, subtree: true })
      if (!userList.length)
        getUserList()
    }
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (window.location.pathname.match(/([^\/]*\/following)/g))
        core()
    }, 1000)
  })

  if (window.onurlchange === null) {
    // feature is supported
    window.addEventListener('urlchange', () => {
      setTimeout(() => {
        if (window.location.pathname.match(/([^\/]*\/following)/g))
          core()
      }, 1000)
    })
  }
})()
