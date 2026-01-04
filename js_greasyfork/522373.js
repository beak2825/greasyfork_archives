// ==UserScript==
// @name         GitHub Profile Icon
// @description  Add a clickable profile icon to identify personal or organizational accounts.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.8
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.codetabs.com
// @connect      api.cors.lol
// @connect      api.allorigins.win
// @connect      everyorigin.jwvbremen.nl
// @connect      api.github.com
// @downloadURL https://update.greasyfork.org/scripts/522373/GitHub%20Profile%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/522373/GitHub%20Profile%20Icon.meta.js
// ==/UserScript==

;(() => {
  const CACHE_KEY = "userTypeCache_v1"
  const RATE_LIMIT_KEY = "userTypeRateLimit"
  const RATE_LIMIT_DURATION = 60 * 60 * 1000

  const proxyServices = [
    {
      name: "Direct GitHub API",
      url: "https://api.github.com/users/",
      parseResponse: (response) => {
        return JSON.parse(response)
      },
    },
    {
      name: "CodeTabs Proxy",
      url: "https://api.codetabs.com/v1/proxy/?quest=https://api.github.com/users/",
      parseResponse: (response) => {
        return JSON.parse(response)
      },
    },
    {
      name: "CORS.lol Proxy",
      url: "https://api.cors.lol/?url=https://api.github.com/users/",
      parseResponse: (response) => {
        return JSON.parse(response)
      },
    },
    {
      name: "AllOrigins Proxy",
      url: "https://api.allorigins.win/get?url=https://api.github.com/users/",
      parseResponse: (response) => {
        const parsed = JSON.parse(response)
        return JSON.parse(parsed.contents)
      },
    },
    {
      name: "EveryOrigin Proxy",
      url: "https://everyorigin.jwvbremen.nl/api/get?url=https://api.github.com/users/",
      parseResponse: (response) => {
        const parsed = JSON.parse(response)
        return JSON.parse(parsed.html)
      },
    },
  ]

  const style = document.createElement("style")
  style.textContent = `
        .icon-wrapper {
            position: relative !important;
            display: inline-block !important;
            margin-left: 4px !important;
        }
        .profile-icon-tooltip {
            visibility: hidden;
            position: fixed !important;
            background: #212830 !important;
            color: white !important;
            padding: 4px 8px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            white-space: nowrap !important;
            z-index: 9999 !important;
            pointer-events: none !important;
            transform: translateX(-50%) !important;
        }
        .profile-icon-tooltip::after {
            content: '';
            position: absolute !important;
            top: 100% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            border: 5px solid transparent !important;
            border-top-color: #212830 !important;
        }
        .icon-wrapper:hover .profile-icon-tooltip {
            visibility: visible !important;
        }
        .fork-icon {
            width: 10px !important;
            height: 10px !important;
            opacity: 1 !important;
        }
        .non-fork-icon {
            opacity: 0.575 !important;
        }
        .fork-wrapper {
            margin-left: 8px !important;
        }
        .search-title {
            display: flex !important;
            align-items: flex-start !important;
        }
        .search-title .icon-wrapper {
            margin-left: 8px !important;
            display: inline-flex !important;
            align-items: center !important;
            margin-top: 3px !important;
        }
    `
  document.head.appendChild(style)

  const ICONS = {
    user: "M11.1,8.7c2.5,1.2,4.1,3.6,4.2,6.3c0,0.5-0.3,0.9-0.9,1c-0.5,0-0.9-0.3-1-0.9c0,0,0,0,0,0c-0.1-3.1-2.7-5.4-5.8-5.3c-2.9,0.1-5.1,2.4-5.3,5.3c0,0.5-0.5,0.9-1,0.9c-0.5,0-0.9-0.4-0.9-0.9c0.1-2.7,1.8-5.2,4.2-6.3C2.8,7,2.5,3.9,4.2,1.8s4.8-2.4,6.9-0.6s2.4,4.8,0.6,6.9C11.6,8.3,11.4,8.5,11.1,8.7z M11.1,4.9c0-1.7-1.4-3.1-3.1-3.1S4.9,3.2,4.9,4.9S6.3,8,8,8S11.1,6.6,11.1,4.9z",
    organization:
      "M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z",
  }

  function isRateLimited() {
    try {
      const rateLimitData = GM_getValue(RATE_LIMIT_KEY)
      if (!rateLimitData) return false

      const { timestamp, duration } = rateLimitData
      const now = Date.now()

      if (now - timestamp > duration) {
        GM_setValue(RATE_LIMIT_KEY, null)
        return false
      }

      return true
    } catch (e) {
      return false
    }
  }

  function setRateLimit(duration = RATE_LIMIT_DURATION) {
    try {
      GM_setValue(RATE_LIMIT_KEY, {
        timestamp: Date.now(),
        duration: duration,
      })
    } catch (e) {
    }
  }

  function readCache() {
    try {
      return GM_getValue(CACHE_KEY, {})
    } catch (e) {
      return {}
    }
  }

  function writeCache(cacheData) {
    try {
      GM_setValue(CACHE_KEY, cacheData)
    } catch (e) {
    }
  }

  function getCachedUserType(username) {
    const cache = readCache()
    return cache[username] || null
  }

  function cacheUserType(username, type) {
    const cache = readCache()
    cache[username] = type
    writeCache(cache)
  }

  async function fetchFromApi(proxyService, username) {
    const apiUrl = `${proxyService.url}${username}`

    return new Promise((resolve) => {
      if (typeof GM_xmlhttpRequest === "undefined") {
        resolve({ success: false, error: "GM_xmlhttpRequest is not defined" })
        return
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        onload: (response) => {
          if (response.responseText.includes("limit") && response.responseText.includes("API")) {
            resolve({
              success: false,
              error: "Rate limit exceeded",
              isRateLimit: true,
            })
            return
          }

          if (response.status >= 200 && response.status < 300) {
            try {
              const userData = proxyService.parseResponse(response.responseText)
              const userType = userData.type?.toLowerCase() === "organization" ? "organization" : "user"
              resolve({ success: true, data: userType })
            } catch (e) {
              resolve({ success: false, error: "JSON parse error" })
            }
          } else {
            resolve({
              success: false,
              error: `Status ${response.status}`,
            })
          }
        },
        onerror: () => {
          resolve({ success: false, error: "Network error" })
        },
        ontimeout: () => {
          resolve({ success: false, error: "Timeout" })
        },
      })
    })
  }

  async function checkUserType(username) {
    if (isRateLimited()) {
      return null
    }

    const cachedType = getCachedUserType(username)
    if (cachedType) {
      return cachedType
    }

    let rateLimitCount = 0

    for (let i = 0; i < proxyServices.length; i++) {
      const proxyService = proxyServices[i]
      const result = await fetchFromApi(proxyService, username)

      if (result.success) {
        cacheUserType(username, result.data)
        return result.data
      }

      if (result.isRateLimit) {
        rateLimitCount++
      }
    }

    if (rateLimitCount >= Math.ceil(proxyServices.length / 2)) {
      setRateLimit()
    }

    return null
  }

  async function createIcon(username, wrapper, isFork = false) {
    const type = await checkUserType(username)

    if (!type) {
      wrapper.remove()
      return
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("viewBox", "0 0 16 16")
    svg.style.cssText = `width:${isFork ? "10px" : "14px"};height:${
      isFork ? "10px" : "14px"
    };cursor:pointer;fill:currentColor;transition:transform .1s`

    if (isFork) {
      svg.classList.add("fork-icon")
      wrapper.classList.add("fork-wrapper")
    } else {
      svg.classList.add("non-fork-icon")
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", ICONS[type])

    const tooltip = document.createElement("div")
    tooltip.className = "profile-icon-tooltip"
    tooltip.textContent = username

    wrapper.addEventListener("mouseenter", () => {
      svg.style.transform = "scale(1.1)"
      const rect = wrapper.getBoundingClientRect()
      tooltip.style.left = `${rect.left + rect.width / 2}px`
      tooltip.style.top = `${rect.top - 35}px`
    })

    wrapper.addEventListener("mouseleave", () => {
      svg.style.transform = "scale(1)"
    })

    wrapper.addEventListener("mousemove", () => {
      const rect = wrapper.getBoundingClientRect()
      tooltip.style.left = `${rect.left + rect.width / 2}px`
      tooltip.style.top = `${rect.top - 35}px`
    })

    wrapper.addEventListener("click", () => window.open(`https://github.com/${username}`, "_blank"))

    svg.appendChild(path)
    wrapper.appendChild(svg)
    wrapper.appendChild(tooltip)
  }

  async function addGitHubIcons() {
    const tasks = []

    const isSearchPage = window.location.pathname === "/search" || window.location.pathname.startsWith("/search/")

    if (isSearchPage) {
      document.querySelectorAll(".search-title").forEach((titleDiv) => {
        if (titleDiv.querySelector(".icon-wrapper")) return
        const link = titleDiv.querySelector("a")
        if (!link) return
        const href = link.getAttribute("href")
        if (!href) return
        const username = href.split("/").filter(Boolean)[0]
        const wrapper = document.createElement("div")
        wrapper.className = "icon-wrapper"
        titleDiv.appendChild(wrapper)
        tasks.push(createIcon(username, wrapper, false))
      })
    } else {
      const repoNav = document.querySelector("#repository-container-header")

      document.querySelectorAll("h3:not(.search-title)").forEach((h3) => {
        if (h3.closest("#readme") || h3.closest("article")) return

        if (repoNav && !h3.closest("#repository-container-header")) return

        if (h3.querySelector(".icon-wrapper")) return
        const link = h3.querySelector("a")
        if (!link) return
        const href = link.getAttribute("href")
        if (!href || !href.startsWith("/")) return
        const username = href.split("/").filter(Boolean)[0]
        const wrapper = document.createElement("div")
        wrapper.className = "icon-wrapper"
        h3.appendChild(wrapper)
        tasks.push(createIcon(username, wrapper, false))
      })

      document.querySelectorAll(".f6.color-fg-muted.mb-1").forEach((forkInfo) => {
        if (forkInfo.querySelector(".icon-wrapper")) return
        const link = forkInfo.querySelector("a.Link--muted")
        if (!link || !link.href.includes("/")) return
        const username = link.getAttribute("href").split("/").filter(Boolean)[0]
        const wrapper = document.createElement("div")
        wrapper.className = "icon-wrapper"
        link.insertAdjacentElement("afterend", wrapper)
        tasks.push(createIcon(username, wrapper, true))
      })
    }

    await Promise.all(tasks)
  }

  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const debouncedAddIcons = debounce(addGitHubIcons, 300)

  debouncedAddIcons()

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((m) => m.addedNodes.length)) {
      debouncedAddIcons()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  const originalPushState = history.pushState
  history.pushState = function () {
    const result = originalPushState.apply(this, arguments)
    debouncedAddIcons()
    return result
  }

  const originalReplaceState = history.replaceState
  history.replaceState = function () {
    const result = originalReplaceState.apply(this, arguments)
    debouncedAddIcons()
    return result
  }

  window.addEventListener("popstate", debouncedAddIcons)
})()