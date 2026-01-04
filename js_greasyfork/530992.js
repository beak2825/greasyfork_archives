// ==UserScript==
// @name         GitHub Join Date
// @description  Displays user's join date/time/age.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.5
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.codetabs.com
// @connect      api.cors.lol
// @connect      api.allorigins.win
// @connect      everyorigin.jwvbremen.nl
// @connect      api.github.com
// @require      https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/530992/GitHub%20Join%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/530992/GitHub%20Join%20Date.meta.js
// ==/UserScript==

;(() => {
  const ELEMENT_ID = "userscript-join-date-display"
  const CACHE_KEY = "githubUserJoinDatesCache_v1"

  let isProcessing = false
  let observerDebounceTimeout = null

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

  function readCache() {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY)
      return cachedData ? JSON.parse(cachedData) : {}
    } catch (e) {
      return {}
    }
  }

  function writeCache(cacheData) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (e) {

    }
  }

  function formatDate(isoDateStr) {
    const joinDate = new Date(isoDateStr)
    const now = new Date()
    
    const datePart = dateFns.format(joinDate, "dd MMM yyyy")
    const timePart = dateFns.format(joinDate, "HH:mm")
    
    let ageText = ""
    
    if (dateFns.differenceInYears(now, joinDate) > 0) {
      const years = dateFns.differenceInYears(now, joinDate)
      ageText = `${years} year${years !== 1 ? "s" : ""}`
    } else if (dateFns.differenceInMonths(now, joinDate) > 0) {
      const months = dateFns.differenceInMonths(now, joinDate)
      ageText = `${months} month${months !== 1 ? "s" : ""}`
    } else if (dateFns.differenceInDays(now, joinDate) > 0) {
      const days = dateFns.differenceInDays(now, joinDate)
      ageText = `${days} day${days !== 1 ? "s" : ""}`
    } else if (dateFns.differenceInHours(now, joinDate) > 0) {
      const hours = dateFns.differenceInHours(now, joinDate)
      ageText = `${hours} hour${hours !== 1 ? "s" : ""}`
    } else {
      const minutes = dateFns.differenceInMinutes(now, joinDate)
      ageText = `${minutes} minute${minutes !== 1 ? "s" : ""}`
    }

    return `${datePart} - ${timePart} (${ageText} ago)`
  }

  async function fetchFromApi(proxyService, username) {
    const apiUrl = `${proxyService.url}${username}`

    return new Promise((resolve) => {
      if (typeof GM_xmlhttpRequest === "undefined") {
        console.error("GM_xmlhttpRequest is not defined. Make sure your userscript manager supports it.")
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
              const createdAt = userData.created_at
              if (createdAt) {
                resolve({ success: true, data: createdAt })
              } else {
                resolve({ success: false, error: "Missing creation date" })
              }
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

  async function getGitHubJoinDate(username) {
    for (let i = 0; i < proxyServices.length; i++) {
      const proxyService = proxyServices[i]
      const result = await fetchFromApi(proxyService, username)

      if (result.success) {
        return result.data
      }
    }
    return null
  }

  function removeExistingElement() {
    const existingElement = document.getElementById(ELEMENT_ID)
    if (existingElement) {
      existingElement.remove()
    }
  }
  
  function formatJoinDateElement(createdAtISO) {
    return `<strong>Joined</strong> <span style="font-weight: normal;">${formatDate(createdAtISO)}</span>`
  }
  
  function updateJoinDateDisplay() {
    const joinElement = document.getElementById(ELEMENT_ID)
    if (!joinElement || !joinElement.dataset.joinDate) return
    
    joinElement.innerHTML = formatJoinDateElement(joinElement.dataset.joinDate)
  }

  async function addOrUpdateJoinDateElement() {
    if (document.getElementById(ELEMENT_ID) && !isProcessing) {
      updateJoinDateDisplay()
      return
    }
    if (isProcessing) {
      return
    }

    const pathParts = window.location.pathname.split("/").filter((part) => part)
    if (
      pathParts.length < 1 ||
      pathParts.length > 2 ||
      (pathParts.length === 2 && !["sponsors", "followers", "following"].includes(pathParts[1]))
    ) {
      removeExistingElement()
      return
    }

    const usernameElement =
      document.querySelector(".p-nickname.vcard-username") || document.querySelector("h1.h2.lh-condensed")

    if (!usernameElement) {
      removeExistingElement()
      return
    }

    const username = pathParts[0].toLowerCase()

    isProcessing = true
    let joinElement = document.getElementById(ELEMENT_ID)
    let createdAtISO = null
    let fromCache = false

    try {
      const cache = readCache()
      if (cache[username]) {
        createdAtISO = cache[username]
        fromCache = true
      }

      if (!joinElement) {
        joinElement = document.createElement("div")
        joinElement.id = ELEMENT_ID
        joinElement.innerHTML = fromCache ? "..." : "Loading..."
        joinElement.style.color = "var(--color-fg-muted)"
        joinElement.style.fontSize = "14px"
        joinElement.style.fontWeight = "normal"

        if (usernameElement.classList.contains("h2")) {
          joinElement.style.marginTop = "0px"

          const colorFgMuted = usernameElement.nextElementSibling?.classList.contains("color-fg-muted")
            ? usernameElement.nextElementSibling
            : null

          if (colorFgMuted) {
            const innerDiv = colorFgMuted.querySelector("div") || colorFgMuted
            innerDiv.appendChild(joinElement)
          } else {
            usernameElement.insertAdjacentElement("afterend", joinElement)
          }
        } else {
          joinElement.style.marginTop = "8px"
          usernameElement.insertAdjacentElement("afterend", joinElement)
        }
      }

      if (!fromCache) {
        createdAtISO = await getGitHubJoinDate(username)
        joinElement = document.getElementById(ELEMENT_ID)
        if (!joinElement) {
          return
        }

        if (createdAtISO) {
          const currentCache = readCache()
          currentCache[username] = createdAtISO
          writeCache(currentCache)
        } else {
          removeExistingElement()
          return
        }
      }

      if (createdAtISO && joinElement) {
        joinElement.dataset.joinDate = createdAtISO
        joinElement.innerHTML = formatJoinDateElement(createdAtISO)
      } else if (!createdAtISO && joinElement) {
        removeExistingElement()
      }
    } catch (error) {
      removeExistingElement()
    } finally {
      isProcessing = false
    }
  }

  function handlePotentialPageChange() {
    clearTimeout(observerDebounceTimeout)
    observerDebounceTimeout = setTimeout(() => {
      addOrUpdateJoinDateElement()
    }, 600)
  }

  addOrUpdateJoinDateElement()

  const observer = new MutationObserver((mutationsList) => {
    let potentiallyRelevantChange = false
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
        const targetNode = mutation.target
        if (targetNode && targetNode.matches?.("main, main *, .Layout-sidebar, .Layout-sidebar *, body")) {
          let onlySelfChange = false
          if (
            (mutation.addedNodes.length === 1 &&
              mutation.addedNodes[0].id === ELEMENT_ID &&
              mutation.removedNodes.length === 0) ||
            (mutation.removedNodes.length === 1 &&
              mutation.removedNodes[0].id === ELEMENT_ID &&
              mutation.addedNodes.length === 0)
          ) {
            onlySelfChange = true
          }
          if (!onlySelfChange) {
            potentiallyRelevantChange = true
            break
          }
        }
      }
    }
    if (potentiallyRelevantChange) {
      handlePotentialPageChange()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
  
  setInterval(updateJoinDateDisplay, 60000)
})()