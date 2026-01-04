// ==UserScript==
// @name         GitHub Release Downloads
// @description  Shows total downloads for releases.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.1
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
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536991/GitHub%20Release%20Downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/536991/GitHub%20Release%20Downloads.meta.js
// ==/UserScript==

;(() => {
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

    async function fetchFromApi(proxyService, owner, repo, tag) {
        const apiUrl = `${proxyService.url}${owner}/${repo}/releases/tags/${tag}`

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
                            const releaseData = proxyService.parseResponse(response.responseText)
                            resolve({ success: true, data: releaseData })
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

    async function getReleaseData(owner, repo, tag) {
        for (let i = 0; i < proxyServices.length; i++) {
            const proxyService = proxyServices[i]
            const result = await fetchFromApi(proxyService, owner, repo, tag)

            if (result.success) {
                return result.data
            }
        }
        return null
    }

    function createDownloadCounter() {
        const getThemeColor = () => {
            const isDarkTheme = document.documentElement.getAttribute('data-color-mode') === 'dark' || 
                               document.body.classList.contains('dark') ||
                               window.matchMedia('(prefers-color-scheme: dark)').matches
            return isDarkTheme ? '#3fb950' : '#1a7f37'
        }
        
        const downloadCounter = document.createElement('span')
        downloadCounter.className = 'download-counter-simple'
        downloadCounter.style.cssText = `
            margin-left: 8px;
            color: ${getThemeColor()};
            font-size: 14px;
            font-weight: 400;
            display: inline;
        `
        
        const downloadIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 384 512" fill="currentColor" style="margin-right: 2px; vertical-align: -2px;">
                <path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7 160 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 178.7 73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/>
            </svg>
        `        
        downloadCounter.innerHTML = `${downloadIcon}Loading...`
        
        return downloadCounter
    }

    function getCachedDownloads(owner, repo, tag) {
        const key = `ghdl_${owner}_${repo}_${tag}`
        const cached = localStorage.getItem(key)
        return cached ? parseInt(cached, 10) : null
    }

    function setCachedDownloads(owner, repo, tag, count) {
        const key = `ghdl_${owner}_${repo}_${tag}`
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, count)
        }
    }

    function updateDownloadCounter(counter, totalDownloads, diff) {
        const formatNumber = (num) => {
            return num.toLocaleString('en-US')
        }
        const isDarkTheme = document.documentElement.getAttribute('data-color-mode') === 'dark' || 
            document.body.classList.contains('dark') ||
            window.matchMedia('(prefers-color-scheme: dark)').matches
        const diffColor = isDarkTheme ? '#888' : '#1f2328'
        const downloadIcon = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 384 512" fill="currentColor" style="margin-right: 2px; vertical-align: -2px;">
                <path d="M32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l320 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 480zM214.6 342.6c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 242.7 160 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 178.7 73.4-73.4c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3l-128 128z"/>
            </svg>
        `
        let diffText = ''
        if (typeof diff === 'number' && diff > 0) {
            diffText = ` <span class="download-diff" style="color:${diffColor};font-size:12px;">(+${formatNumber(diff)})</span>`
        }
        counter.innerHTML = `${downloadIcon}${formatNumber(totalDownloads)}${diffText}`
        counter.style.fontWeight = '600'
    }

    function setupThemeObserver(counter) {
        const getThemeColor = () => {
            const isDarkTheme = document.documentElement.getAttribute('data-color-mode') === 'dark' || 
                document.body.classList.contains('dark') ||
                window.matchMedia('(prefers-color-scheme: dark)').matches
            return isDarkTheme ? '#3fb950' : '#1a7f37'
        }
        const getDiffColor = () => {
            const isDarkTheme = document.documentElement.getAttribute('data-color-mode') === 'dark' || 
                document.body.classList.contains('dark') ||
                window.matchMedia('(prefers-color-scheme: dark)').matches
            return isDarkTheme ? '#888' : '#1f2328'
        }
        const updateCounterColor = () => {
            if (counter) {
                counter.style.color = getThemeColor()
                const diffSpan = counter.querySelector('.download-diff')
                if (diffSpan) {
                    diffSpan.style.color = getDiffColor()
                }
            }
        }
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'data-color-mode' || 
                     mutation.attributeName === 'class')) {
                    updateCounterColor()
                }
            })
        })
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-color-mode', 'class']
        })
        
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        })
        
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.addEventListener('change', updateCounterColor)
    }

    async function addDownloadCounter() {
        if (isProcessing) {
            return
        }
        isProcessing = true
        const currentUrl = window.location.href
        const urlMatch = currentUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/releases\/tag\/([^\/\?]+)/)
        if (!urlMatch) {
            isProcessing = false
            return
        }
        const [, owner, repo, tag] = urlMatch
        const existingCounter = document.querySelector('.download-counter-simple')
        if (existingCounter) {
            isProcessing = false
            return
        }
        let attempts = 0
        const maxAttempts = 50
        const waitForBreadcrumb = () => {
            return new Promise((resolve) => {
                const checkBreadcrumb = () => {
                    const selectedBreadcrumb = document.querySelector('.breadcrumb-item-selected a')
                    if (selectedBreadcrumb) {
                        resolve(selectedBreadcrumb)
                        return
                    }
                    attempts++
                    if (attempts < maxAttempts) {
                        setTimeout(checkBreadcrumb, 100)
                    } else {
                        resolve(null)
                    }
                }
                checkBreadcrumb()
            })
        }
        const selectedBreadcrumb = await waitForBreadcrumb()
        if (!selectedBreadcrumb) {
            isProcessing = false
            return
        }
        const downloadCounter = createDownloadCounter()
        selectedBreadcrumb.appendChild(downloadCounter)
        setupThemeObserver(downloadCounter)
        try {
            const releaseData = await getReleaseData(owner, repo, tag)
            if (!releaseData) {
                downloadCounter.remove()
                isProcessing = false
                return
            }
            const totalDownloads = releaseData.assets.reduce((total, asset) => {
                return total + asset.download_count
            }, 0)
            const cached = getCachedDownloads(owner, repo, tag)
            let diff = null
            if (cached !== null && totalDownloads > cached) {
                diff = totalDownloads - cached
            }
            updateDownloadCounter(downloadCounter, totalDownloads, diff)
            setCachedDownloads(owner, repo, tag, totalDownloads)
        } catch (error) {
            downloadCounter.remove()
        } finally {
            isProcessing = false
        }
    }

    let navigationTimeout = null
    let lastUrl = window.location.href
    let isProcessing = false

    function handleNavigation() {
        const currentUrl = window.location.href
        
        if (navigationTimeout) {
            clearTimeout(navigationTimeout)
        }
        
        if (currentUrl === lastUrl && isProcessing) {
            return
        }
        
        lastUrl = currentUrl
        
        navigationTimeout = setTimeout(() => {
            const existingCounters = document.querySelectorAll('.download-counter-simple')
            existingCounters.forEach(counter => counter.remove())
            
            if (currentUrl.includes('/releases/tag/')) {
                addDownloadCounter()
            }
        }, 300)
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', handleNavigation)
        } else {
            handleNavigation()
        }
        
        document.addEventListener('turbo:load', handleNavigation)
        document.addEventListener('turbo:render', handleNavigation)
        document.addEventListener('turbo:frame-load', handleNavigation)
        
        document.addEventListener('pjax:end', handleNavigation)
        document.addEventListener('pjax:success', handleNavigation)
        
        window.addEventListener('popstate', handleNavigation)
        
        const originalPushState = history.pushState
        const originalReplaceState = history.replaceState
        
        history.pushState = function(...args) {
            originalPushState.apply(history, args)
            setTimeout(handleNavigation, 100)
        }
        
        history.replaceState = function(...args) {
            originalReplaceState.apply(history, args)  
            setTimeout(handleNavigation, 100)
        }
    }

    init()
})()