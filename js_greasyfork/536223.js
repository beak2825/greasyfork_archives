// ==UserScript==
// @name         Activity Graph
// @namespace    http://tampermonkey.net/
// @version      2025-05-16
// @description  linux.do activity graph
// @author       You
// @match        https://linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536223/Activity%20Graph.user.js
// @updateURL https://update.greasyfork.org/scripts/536223/Activity%20Graph.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Constants
  const STEP = 5 // Step size for color levels
  const COLORS = [
    '#ebedf0',  // 0
    '#9be9a8',  // 1
    '#40c463',  // 2
    '#30a14e',  // 3
    '#216e39',  // 4
    '#1b5e2e',  // 5
    '#154c25',  // 6
    '#0f3a1c',  // 7
    '#0a2813',  // 8
    '#05160a',  // 9
    '#030d06',  // 10
    '#020a04',  // 11
    '#010703',  // 12
    '#010502',  // 13
    '#000401',  // 14
    '#000301',  // 15
    '#000201',  // 16
    '#000100',  // 17
    '#000000'   // 18+
  ]

  // Inject styles
  const styles = `
.activity-graph {
  display: grid;
  grid-template-columns: repeat(53, 1fr);
  gap: 3px;
  padding: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  margin-bottom: 30px;
}

.activity-day {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  transition: transform 0.2s ease;
}

.activity-day:hover {
  transform: scale(1.5);
  z-index: 1;
}

.tooltip {
  position: fixed;
  display: none;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  z-index: 1000;
  white-space: nowrap;
  transform: translate(10px, -50%);
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tooltip-date {
  font-weight: bold;
}

.tooltip-counts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.tooltip-count-item {
  color: #ccc;
}

.tooltip-total {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-weight: bold;
  color: #9be9a8;
}
`

  // Create and inject style element
  const styleElement = document.createElement('style')
  styleElement.textContent = styles
  document.head.appendChild(styleElement)

  // Function to process the data and create activity map
  function processActivityData(data) {
    const activityMap = new Map()

    data.user_actions.forEach(action => {
      const date = new Date(action.created_at).toISOString().split('T')[0]
      if (!activityMap.has(date)) {
        activityMap.set(date, {
          count: 0,
          posts: new Map()
        })
      }
      const dayData = activityMap.get(date)
      dayData.count++

      // Group by action type
      if (!dayData.posts.has(action.action_type)) {
        dayData.posts.set(action.action_type, 0)
      }
      dayData.posts.set(action.action_type, dayData.posts.get(action.action_type) + 1)
    })

    return activityMap
  }

  // Function to create empty activity map
  function createEmptyActivityMap() {
    const activityMap = new Map()
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      activityMap.set(dateStr, {
        count: 0,
        posts: new Map()
      })
    }
    return activityMap
  }

  // Function to update graph with new data
  function updateGraph(activityMap) {
    const days = document.querySelectorAll('.activity-day')

    days.forEach(day => {
      const date = day.getAttribute('data-date')
      const dayData = activityMap.get(date) || { count: 0, posts: new Map() }
      const count = dayData.count

      // Calculate color index based on count and step
      let colorIndex = 0
      if (count > 0) {
        colorIndex = Math.min(Math.ceil(count / STEP), COLORS.length - 1)
      }
      day.style.backgroundColor = COLORS[colorIndex]

      // Update tooltip content
      const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      let tooltipContent = `<div class="tooltip-date">${formattedDate}</div>`

      if (dayData.posts.size > 0) {
        tooltipContent += '<div class="tooltip-counts">'
        // Show 赞 (type 1) first
        const likeCount = dayData.posts.get(1) || 0
        if (likeCount > 0) {
          tooltipContent += `<div class="tooltip-count-item">赞: ${likeCount}</div>`
        }
        // Show 话题 (type 4) second
        const topicCount = dayData.posts.get(4) || 0
        if (topicCount > 0) {
          tooltipContent += `<div class="tooltip-count-item">话题: ${topicCount}</div>`
        }
        // Show 帖子 (type 5) third
        const postCount = dayData.posts.get(5) || 0
        if (postCount > 0) {
          tooltipContent += `<div class="tooltip-count-item">帖子: ${postCount}</div>`
        }
        tooltipContent += `<div class="tooltip-total">Total: ${dayData.count}</div>`
        tooltipContent += '</div>'
      }

      day.setAttribute('data-tooltip', tooltipContent)
    })
  }

  // Function to create the activity graph
  function createActivityGraph(activityMap) {
    const container = document.createElement('div')
    container.className = 'activity-graph'

    // Create tooltip element
    const tooltip = document.createElement('div')
    tooltip.className = 'tooltip'
    document.body.appendChild(tooltip)

    // Get the last 365 days
    const today = new Date()
    const days = []
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.unshift(date.toISOString().split('T')[0])
    }

    // Create the graph
    days.forEach(date => {
      const day = document.createElement('div')
      day.className = 'activity-day'
      day.setAttribute('data-date', date)
      const dayData = activityMap.get(date) || { count: 0, posts: new Map() }
      const count = dayData.count

      // Calculate color index based on count and step
      let colorIndex = 0
      if (count > 0) {
        colorIndex = Math.min(Math.ceil(count / STEP), COLORS.length - 1)
      }
      day.style.backgroundColor = COLORS[colorIndex]

      // Add hover events for tooltip
      day.addEventListener('mousemove', (e) => {
        tooltip.innerHTML = day.getAttribute('data-tooltip')
        tooltip.style.display = 'block'

        // Position tooltip at cursor
        tooltip.style.left = `${e.pageX}px`
        tooltip.style.top = `${e.pageY}px`
      })

      day.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none'
      })

      container.appendChild(day)
    })

    return container
  }

  // Function to fetch data with pagination
  async function fetchAllData() {
    const allData = { user_actions: [] }
    const limit = 30
    const urlParams = new URLSearchParams(window.location.search)
    const fetchCount = parseInt(urlParams.get('count')) || 10 // Get count from URL or fallback to 10

    try {
      // Get username from URL
      const username = window.location.pathname.split('/')[2]

      for (let i = 0; i < fetchCount; i++) {
        const offset = i * limit
        const response = await fetch(`https://linux.do/user_actions.json?offset=${offset}&username=${username}&filter=1,4,5`)
        const data = await response.json()
        allData.user_actions = [...allData.user_actions, ...data.user_actions]

        // Update graph with new data
        const activityMap = processActivityData(allData)
        updateGraph(activityMap)
      }
      return allData
    } catch (error) {
      console.error('Error fetching data:', error)
      return allData
    }
  }

  // Function to check if URL matches pattern
  function isUserSummaryPage() {
    return window.location.pathname.match(/^\/u\/[^/]+\/summary$/)
  }

  // Function to remove existing graph
  function removeExistingGraph() {
    const existingGraph = document.querySelector('.activity-graph')
    if (existingGraph) {
      existingGraph.remove()
    }
  }

  // Function to get target container
  function getTargetContainer() {
    return document.querySelector('#user-content') || document.querySelector('.user-content')
  }

  // Fetch data and create graph
  async function init() {
    if (!isUserSummaryPage()) {
      return
    }

    try {
      removeExistingGraph()

      // Wait for target container to be available
      let container = getTargetContainer()
      if (!container) {
        // Wait for DOM to be ready
        await new Promise(resolve => {
          const observer = new MutationObserver((mutations, obs) => {
            container = getTargetContainer()
            if (container) {
              obs.disconnect()
              resolve()
            }
          })
          observer.observe(document.body, {
            childList: true,
            subtree: true
          })
        })
      }

      // Create and show empty graph immediately
      const emptyActivityMap = createEmptyActivityMap()
      const graph = createActivityGraph(emptyActivityMap)
      container.prepend(graph)

      // Fetch and update data
      await fetchAllData()
    } catch (error) {
      console.error('Error creating graph:', error)
    }
  }

  // Initialize the graph
  init()

  // Monitor URL changes
  let lastUrl = location.href
  new MutationObserver(() => {
    const currentUrl = location.href
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl
      init()
    }
  }).observe(document, { subtree: true, childList: true })
})();