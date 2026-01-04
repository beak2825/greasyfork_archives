// ==UserScript==
// @name         GitHub Repo Age
// @description  Displays repository creation date/time/age.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.5
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*/*
// @grant        GM_xmlhttpRequest
// @connect      api.codetabs.com
// @connect      api.cors.lol
// @connect      api.allorigins.win
// @connect      everyorigin.jwvbremen.nl
// @connect      api.github.com
// @require      https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js
// @downloadURL https://update.greasyfork.org/scripts/535591/GitHub%20Repo%20Age.user.js
// @updateURL https://update.greasyfork.org/scripts/535591/GitHub%20Repo%20Age.meta.js
// ==/UserScript==

;(() => {
  const CACHE_KEY_PREFIX = "github_repo_created_"

  const proxyServices = [
    {
      name: "Direct GitHub API",
      url: "https://api.github.com/repos/",
      parseResponse: (response) => {
        return JSON.parse(response)
      },
    },
    {
      name: "CodeTabs Proxy",
      url: "https://api.codetabs.com/v1/proxy/?quest=https://api.github.com/repos/",
      parseResponse: (response) => {
        return JSON.parse(response)
      },
    },
    {
      name: "CORS.lol Proxy",
      url: "https://api.cors.lol/?url=https://api.github.com/repos/",
      parseResponse: (response) => {
        return JSON.parse(response)
      },
    },
    {
      name: "AllOrigins Proxy",
      url: "https://api.allorigins.win/get?url=https://api.github.com/repos/",
      parseResponse: (response) => {
        const parsed = JSON.parse(response)
        return JSON.parse(parsed.contents)
      },
    },
    {
      name: "EveryOrigin Proxy",
      url: "https://everyorigin.jwvbremen.nl/api/get?url=https://api.github.com/repos/",
      parseResponse: (response) => {
        const parsed = JSON.parse(response)
        return JSON.parse(parsed.html)
      },
    },
  ]

  const selectors = {
    desktop: [".BorderGrid-cell .hide-sm.hide-md .f4.my-3", ".BorderGrid-cell"],
    mobile: [
      ".d-block.d-md-none.mb-2.px-3.px-md-4.px-lg-5 .f4.mb-3.color-fg-muted",
      ".d-block.d-md-none.mb-2.px-3.px-md-4.px-lg-5 .d-flex.gap-2.mt-n3.mb-3.flex-wrap",
      ".d-block.d-md-none.mb-2.px-3.px-md-4.px-lg-5",
    ],
  }

  let currentRepoPath = ""

  function formatDate(isoDateStr) {
    const createdDate = new Date(isoDateStr)
    const now = new Date()
    
    const datePart = dateFns.format(createdDate, "dd MMM yyyy")
    
    const timePart = dateFns.format(createdDate, "HH:mm")
    
    const diffYears = dateFns.differenceInYears(now, createdDate)
    const tempDate = dateFns.addYears(createdDate, diffYears)
    
    const diffMonths = dateFns.differenceInMonths(now, tempDate)
    const tempDate2 = dateFns.addMonths(tempDate, diffMonths)
    
    const diffDays = dateFns.differenceInDays(now, tempDate2)
    const tempDate3 = dateFns.addDays(tempDate2, diffDays)
    
    const diffHours = dateFns.differenceInHours(now, tempDate3)
    const tempDate4 = dateFns.addHours(tempDate3, diffHours)
    
    const diffMinutes = dateFns.differenceInMinutes(now, tempDate4)
    
    let ageText = ""
    
    if (diffYears > 0) {
      ageText = `${diffYears} year${diffYears !== 1 ? "s" : ""}`
      if (diffMonths > 0) {
        ageText += ` ${diffMonths} month${diffMonths !== 1 ? "s" : ""}`
      }
    } else if (dateFns.differenceInMonths(now, createdDate) > 0) {
      const totalMonths = dateFns.differenceInMonths(now, createdDate)
      ageText = `${totalMonths} month${totalMonths !== 1 ? "s" : ""}`
      if (diffDays > 0) {
        ageText += ` ${diffDays} day${diffDays !== 1 ? "s" : ""}`
      }
    } else if (dateFns.differenceInDays(now, createdDate) > 0) {
      const totalDays = dateFns.differenceInDays(now, createdDate)
      ageText = `${totalDays} day${totalDays !== 1 ? "s" : ""}`
      if (diffHours > 0 && totalDays < 7) {
        ageText += ` ${diffHours} hour${diffHours !== 1 ? "s" : ""}`
      }
    } else if (dateFns.differenceInHours(now, createdDate) > 0) {
      const totalHours = dateFns.differenceInHours(now, createdDate)
      ageText = `${totalHours} hour${totalHours !== 1 ? "s" : ""}`
      if (diffMinutes > 0) {
        ageText += ` ${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`
      }
    } else {
      const totalMinutes = dateFns.differenceInMinutes(now, createdDate)
      ageText = `${totalMinutes} minute${totalMinutes !== 1 ? "s" : ""}`
    }

    return `${datePart} - ${timePart} (${ageText} ago)`
  }

  const cache = {
    getKey: (user, repo) => `${CACHE_KEY_PREFIX}${user}_${repo}`,

    get: function (user, repo) {
      try {
        const key = this.getKey(user, repo)
        const cachedValue = localStorage.getItem(key)
        if (!cachedValue) return null
        return cachedValue
      } catch (err) {
        return null
      }
    },

    set: function (user, repo, value) {
      try {
        const key = this.getKey(user, repo)
        localStorage.setItem(key, value)
      } catch (err) {

      }
    },
  }

  async function fetchFromApi(proxyService, user, repo) {
    const apiUrl = `${proxyService.url}${user}/${repo}`

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
              const data = proxyService.parseResponse(response.responseText)
              const createdAt = data.created_at
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

  async function getRepoCreationDate(user, repo) {
    const cachedDate = cache.get(user, repo)
    if (cachedDate) {
      return cachedDate
    }

    for (let i = 0; i < proxyServices.length; i++) {
      const proxyService = proxyServices[i]
      const result = await fetchFromApi(proxyService, user, repo)

      if (result.success) {
        cache.set(user, repo, result.data)
        return result.data
      }
    }

    return null
  }

  async function insertCreatedDate() {
    const match = window.location.pathname.match(/^\/([^/]+)\/([^/]+)/)
    if (!match) return false

    const [_, user, repo] = match
    const repoPath = `${user}/${repo}`

    currentRepoPath = repoPath

    const createdAt = await getRepoCreationDate(user, repo)
    if (!createdAt) return false

    const formattedDate = formatDate(createdAt)
    let insertedCount = 0

    document.querySelectorAll(".repo-created-date").forEach((el) => el.remove())

    for (const [view, selectorsList] of Object.entries(selectors)) {
      for (const selector of selectorsList) {
        const element = document.querySelector(selector)
        if (element && !element.querySelector(`.repo-created-${view}`)) {
          insertDateElement(element, formattedDate, view, createdAt)
          insertedCount++
          break
        }
      }
    }

    return insertedCount > 0
  }

  function insertDateElement(targetElement, formattedDate, view, isoDateStr) {
    const p = document.createElement("p")
    p.className = `f6 color-fg-muted repo-created-date repo-created-${view}`
    p.dataset.createdAt = isoDateStr
    p.style.marginTop = "4px"
    p.style.marginBottom = "8px"
    p.innerHTML = `<strong>Created</strong> ${formattedDate}`

    if (view === "mobile") {
      const flexWrap = targetElement.querySelector(".flex-wrap")
      if (flexWrap) {
        flexWrap.parentNode.insertBefore(p, flexWrap.nextSibling)
        return
      }

      const dFlex = targetElement.querySelector(".d-flex")
      if (dFlex) {
        dFlex.parentNode.insertBefore(p, dFlex.nextSibling)
        return
      }
    }

    targetElement.insertBefore(p, targetElement.firstChild)
  }

  function updateAges() {
    document.querySelectorAll(".repo-created-date").forEach((el) => {
      const createdAt = el.dataset.createdAt
      if (createdAt) {
        const formattedDate = formatDate(createdAt)
        const strongElement = el.querySelector("strong")
        if (strongElement) {
          el.innerHTML = `<strong>Created</strong> ${formattedDate}`
        } else {
          el.innerHTML = formattedDate
        }
      }
    })
  }

  function checkAndInsertWithRetry(retryCount = 0, maxRetries = 5) {
    insertCreatedDate().then((inserted) => {
      if (!inserted && retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 500
        setTimeout(() => checkAndInsertWithRetry(retryCount + 1, maxRetries), delay)
      }
    })
  }

  function checkForRepoChange() {
    const match = window.location.pathname.match(/^\/([^/]+)\/([^/]+)/)
    if (!match) return

    const [_, user, repo] = match
    const repoPath = `${user}/${repo}`

    if (repoPath !== currentRepoPath) {
      checkAndInsertWithRetry()
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => checkAndInsertWithRetry())
  } else {
    checkAndInsertWithRetry()
  }

  const originalPushState = history.pushState
  history.pushState = function () {
    originalPushState.apply(this, arguments)
    setTimeout(checkForRepoChange, 100)
  }

  const originalReplaceState = history.replaceState
  history.replaceState = function () {
    originalReplaceState.apply(this, arguments)
    setTimeout(checkForRepoChange, 100)
  }

  window.addEventListener("popstate", () => {
    setTimeout(checkForRepoChange, 100)
  })

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (
        mutation.type === "childList" &&
        (mutation.target.id === "js-repo-pjax-container" || mutation.target.id === "repository-container-header")
      ) {
        setTimeout(checkForRepoChange, 100)
        break
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
  
  setInterval(updateAges, 60000)
})()