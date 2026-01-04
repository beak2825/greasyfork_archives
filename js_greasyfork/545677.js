// ==UserScript==
// @name         Toonily Manhwa Tracker
// @namespace    https://github.com/Sheikhlipu123
// @version      1.0
// @description  Track manhwa reading progress on Toonily.com
// @author       Sheikhlipu123
// @match        https://toonily.com/*
// @grant        none
// @run-at       document-end
// @homepage     https://github.com/Sheikhlipu123/Toonily-Manhwa-Tracker/
// @supportURL   https://github.com/Sheikhlipu123/Toonily-Manhwa-Tracker/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545677/Toonily%20Manhwa%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/545677/Toonily%20Manhwa%20Tracker.meta.js
// ==/UserScript==

;(() => {
  // Storage key for localStorage
  const STORAGE_KEY = "toonily_manhwa_tracker"

  // Initialize or get existing data
  function getTrackedData() {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  }

  // Save data to localStorage
  function saveTrackedData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // Extract manhwa name from URL
  function getManhwaNameFromUrl(url = window.location.href) {
    const match = url.match(/\/serie\/([^/]+)/)
    if (match) {
      return match[1].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    }
    return null
  }

  // Extract chapter number from URL
  function getChapterFromUrl(url = window.location.href) {
    const match = url.match(/\/chapter-(\d+(?:\.\d+)?)/)
    return match ? match[1] : null
  }

  // Get manhwa thumbnail
  function getManhwaThumbnail() {
    const imgElement = document.querySelector(".summary_image img")
    if (imgElement) {
      return imgElement.getAttribute("data-src") || imgElement.src
    }
    return null
  }

  // Get manhwa title from breadcrumb or page title
  function getManhwaTitle() {
    const breadcrumbLink = document.querySelector('.c-breadcrumb a[href*="/serie/"]')
    if (breadcrumbLink) {
      return breadcrumbLink.textContent.trim()
    }

    const titleElement = document.querySelector("h1, .post-title")
    if (titleElement) {
      return titleElement.textContent.trim()
    }

    return getManhwaNameFromUrl()
  }

  // Track current page
  function trackCurrentPage() {
    const manhwaName = getManhwaNameFromUrl()
    if (!manhwaName) return

    const chapter = getChapterFromUrl()
    const data = getTrackedData()
    const now = new Date().toISOString()
    const currentUrl = window.location.href

    if (!data[manhwaName]) {
      data[manhwaName] = {
        title: getManhwaTitle() || manhwaName,
        thumbnail: getManhwaThumbnail(),
        serieUrl: `https://toonily.com/serie/${manhwaName.toLowerCase().replace(/\s+/g, "-")}/`,
        chapters: {},
        lastVisited: now,
        firstVisited: now,
      }
    }

    // Update last visited
    data[manhwaName].lastVisited = now

    // If we're on a chapter page, track it
    if (chapter) {
      if (!data[manhwaName].chapters[chapter]) {
        data[manhwaName].chapters[chapter] = {
          firstRead: now,
          readCount: 0,
          url: currentUrl,
        }
      }

      data[manhwaName].chapters[chapter].lastRead = now
      data[manhwaName].chapters[chapter].readCount++
      data[manhwaName].chapters[chapter].url = currentUrl
    }

    // Update thumbnail if we're on serie page and don't have one
    if (!data[manhwaName].thumbnail && currentUrl.includes("/serie/")) {
      const thumbnail = getManhwaThumbnail()
      if (thumbnail) {
        data[manhwaName].thumbnail = thumbnail
      }
    }

    saveTrackedData(data)
  }

  // Create tracker panel
  function createTrackerPanel() {
    // Create panel container
    const panel = document.createElement("div")
    panel.id = "manhwa-tracker-panel"
    panel.innerHTML = `
            <div id="tracker-toggle" style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                background: #2c3e50;
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                font-family: Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                user-select: none;
            ">
                📚 Tracker
            </div>
            
            <div id="tracker-popup" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                z-index: 10001;
                display: none;
                font-family: Arial, sans-serif;
            ">
                <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    width: 90%;
                    max-width: 1000px;
                    height: 80%;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 5px 25px rgba(0,0,0,0.5);
                ">
                    <div style="
                        background: #34495e;
                        color: white;
                        padding: 15px 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h2 style="margin: 0; font-size: 18px;">Manhwa Tracker</h2>
                        <div>
                            <button id="export-data" style="
                                background: #27ae60;
                                color: white;
                                border: none;
                                padding: 8px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                margin-right: 10px;
                                font-size: 12px;
                            ">Export</button>
                            <button id="import-data" style="
                                background: #3498db;
                                color: white;
                                border: none;
                                padding: 8px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                margin-right: 10px;
                                font-size: 12px;
                            ">Import</button>
                            <span id="close-tracker" style="
                                cursor: pointer;
                                font-size: 24px;
                                font-weight: bold;
                            ">&times;</span>
                        </div>
                    </div>
                    <div id="tracker-content" style="
                        padding: 20px;
                        height: calc(100% - 70px);
                        overflow-y: auto;
                    "></div>
                </div>
            </div>
        `

    document.body.appendChild(panel)

    // Event listeners
    document.getElementById("tracker-toggle").addEventListener("click", showTracker)
    document.getElementById("close-tracker").addEventListener("click", hideTracker)
    document.getElementById("export-data").addEventListener("click", exportData)
    document.getElementById("import-data").addEventListener("click", importData)

    // Close on background click
    document.getElementById("tracker-popup").addEventListener("click", function (e) {
      if (e.target === this) hideTracker()
    })
  }

  // Show tracker popup
  function showTracker() {
    document.getElementById("tracker-popup").style.display = "block"
    updateTrackerContent()
  }

  // Hide tracker popup
  function hideTracker() {
    document.getElementById("tracker-popup").style.display = "none"
  }

  // Update tracker content
  function updateTrackerContent() {
    const data = getTrackedData()
    const content = document.getElementById("tracker-content")

    if (Object.keys(data).length === 0) {
      content.innerHTML =
        '<p style="text-align: center; color: #666; margin-top: 50px;">No manhwa tracked yet. Visit some manhwa pages to start tracking!</p>'
      return
    }

    let html = `
            <div style="margin-bottom: 20px;">
                <h3>Tracked Manhwa (${Object.keys(data).length})</h3>
                <input type="text" id="search-manhwa" placeholder="Search manhwa..." style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    margin-bottom: 15px;
                    font-size: 14px;
                ">
            </div>
            <div id="manhwa-list">
        `

    // Sort manhwa by last visited
    const sortedManhwa = Object.entries(data).sort((a, b) => new Date(b[1].lastVisited) - new Date(a[1].lastVisited))

    sortedManhwa.forEach(([key, manhwa]) => {
      const chapterCount = Object.keys(manhwa.chapters).length
      const latestChapter = chapterCount > 0 ? Math.max(...Object.keys(manhwa.chapters).map(Number)) : 0
      const lastVisited = new Date(manhwa.lastVisited).toLocaleDateString()

      html += `
                <div class="manhwa-item" style="
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin-bottom: 15px;
                    padding: 15px;
                    background: #f9f9f9;
                ">
                    <div style="display: flex; gap: 15px;">
                        <div style="flex-shrink: 0;">
                            ${
                              manhwa.thumbnail
                                ? `
                                <img src="${manhwa.thumbnail}" alt="${manhwa.title}" style="
                                    width: 80px;
                                    height: 110px;
                                    object-fit: cover;
                                    border-radius: 5px;
                                    border: 1px solid #ddd;
                                ">
                            `
                                : `
                                <div style="
                                    width: 80px;
                                    height: 110px;
                                    background: #ddd;
                                    border-radius: 5px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    color: #666;
                                    font-size: 12px;
                                ">No Image</div>
                            `
                            }
                        </div>
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">
                                <a href="${manhwa.serieUrl}" target="_blank" style="text-decoration: none; color: inherit;">
                                    ${manhwa.title}
                                </a>
                            </h4>
                            <div style="color: #666; font-size: 13px; margin-bottom: 10px;">
                                <div><strong>Chapters Read:</strong> ${chapterCount}</div>
                                <div><strong>Latest Chapter:</strong> ${latestChapter || "None"}</div>
                                <div><strong>Last Visited:</strong> ${lastVisited}</div>
                            </div>
                            <button onclick="showChapterDetails('${key}')" style="
                                background: #3498db;
                                color: white;
                                border: none;
                                padding: 6px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                                margin-right: 10px;
                            ">View Chapters</button>
                            <button onclick="deleteManhwa('${key}')" style="
                                background: #e74c3c;
                                color: white;
                                border: none;
                                padding: 6px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">Delete</button>
                        </div>
                    </div>
                    <div id="chapters-${key}" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;"></div>
                </div>
            `
    })

    html += "</div>"
    content.innerHTML = html

    // Add search functionality
    document.getElementById("search-manhwa").addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase()
      const manhwaItems = document.querySelectorAll(".manhwa-item")

      manhwaItems.forEach((item) => {
        const title = item.querySelector("h4").textContent.toLowerCase()
        item.style.display = title.includes(searchTerm) ? "block" : "none"
      })
    })
  }

  // Show chapter details
  window.showChapterDetails = (manhwaKey) => {
    const data = getTrackedData()
    const manhwa = data[manhwaKey]
    const chaptersDiv = document.getElementById(`chapters-${manhwaKey}`)

    if (chaptersDiv.style.display === "none") {
      let chaptersHtml = '<h5 style="margin: 0 0 10px 0;">Chapter History:</h5>'

      if (Object.keys(manhwa.chapters).length === 0) {
        chaptersHtml += '<p style="color: #666; font-style: italic;">No chapters read yet.</p>'
      } else {
        chaptersHtml += '<div style="max-height: 200px; overflow-y: auto;">'

        // Sort chapters by number
        const sortedChapters = Object.entries(manhwa.chapters).sort((a, b) => Number(b[0]) - Number(a[0]))

        sortedChapters.forEach(([chapterNum, chapterData]) => {
          const firstRead = new Date(chapterData.firstRead).toLocaleDateString()
          const lastRead = chapterData.lastRead ? new Date(chapterData.lastRead).toLocaleDateString() : firstRead

          chaptersHtml += `
                        <div style="
                            background: white;
                            padding: 8px 12px;
                            margin-bottom: 5px;
                            border-radius: 4px;
                            border: 1px solid #eee;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        ">
                            <div>
                                <strong>Chapter ${chapterNum}</strong>
                                <div style="font-size: 11px; color: #666;">
                                    First: ${firstRead} | Last: ${lastRead} | Read ${chapterData.readCount}x
                                </div>
                            </div>
                            <a href="${chapterData.url}" target="_blank" style="
                                background: #27ae60;
                                color: white;
                                text-decoration: none;
                                padding: 4px 8px;
                                border-radius: 3px;
                                font-size: 11px;
                            ">Read</a>
                        </div>
                    `
        })

        chaptersHtml += "</div>"
      }

      chaptersDiv.innerHTML = chaptersHtml
      chaptersDiv.style.display = "block"
    } else {
      chaptersDiv.style.display = "none"
    }
  }

  // Delete manhwa
  window.deleteManhwa = (manhwaKey) => {
    if (confirm("Are you sure you want to delete this manhwa from tracking?")) {
      const data = getTrackedData()
      delete data[manhwaKey]
      saveTrackedData(data)
      updateTrackerContent()
    }
  }

  // Export data
  function exportData() {
    const data = getTrackedData()
    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(dataBlob)
    link.download = `toonily-tracker-${new Date().toISOString().split("T")[0]}.json`
    link.click()
  }

  // Import data
  function importData() {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"

    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          const currentData = getTrackedData()

          // Merge data
          const mergedData = { ...currentData, ...importedData }
          saveTrackedData(mergedData)

          alert("Data imported successfully!")
          updateTrackerContent()
        } catch (error) {
          alert("Error importing data: Invalid JSON file")
        }
      }
      reader.readAsText(file)
    }

    input.click()
  }

  // Initialize
  function init() {
    // Track current page
    trackCurrentPage()

    // Create tracker panel
    createTrackerPanel()

    // Track navigation changes (for SPA-like behavior)
    let currentUrl = window.location.href
    setInterval(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href
        setTimeout(trackCurrentPage, 1000) // Delay to let page load
      }
    }, 1000)
  }

  // Wait for page to load completely
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }
})()