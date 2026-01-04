// ==UserScript==
// @name         Swiggy & Zomato: Non Veg dishes only
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  On Swiggy and Zomato you can select to show vegetarian dishes only, this script does the reverse: it allows you to hide vegetarian dishes. Rate individual dishes and keep a private history of what you like and what you hated
// @author       cuzi
// @copyright    2021, cuzi (https://openuserjs.org/users/cuzi)
// @license      GPL-3.0-or-later
// @match        https://www.swiggy.com/*
// @match        https://www.zomato.com/*
// @icon         https://res.cloudinary.com/swiggy/image/upload/portal/c/icon-192x192.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/string-similarity@4.0.4/umd/string-similarity.min.js
// @resource     thumbUp https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/1F44D.svg
// @resource     thumbDown https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/1F44E.svg
// @resource     star https://cdn.jsdelivr.net/npm/openmoji@14.0.0/color/svg/2B50.svg
// @downloadURL https://update.greasyfork.org/scripts/425352/Swiggy%20%20Zomato%3A%20Non%20Veg%20dishes%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/425352/Swiggy%20%20Zomato%3A%20Non%20Veg%20dishes%20only.meta.js
// ==/UserScript==

/*
    Copyright (C) 2021, cuzi (https://openuserjs.org/users/cuzi)
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* globals Node, GM, GM_getResourceText, stringSimilarity */

(function () {
  'use strict'

  const DEFAULT_DATA = '{"restaurants": {}}'

  function timeSince (date) {
    // https://stackoverflow.com/a/72973090/
    const MINUTE = 60
    const HOUR = MINUTE * 60
    const DAY = HOUR * 24
    const WEEK = DAY * 7
    const MONTH = DAY * 30
    const YEAR = DAY * 365
    const secondsAgo = Math.round((Date.now() - Number(date)) / 1000)
    if (secondsAgo < MINUTE) {
      return secondsAgo + ` second${secondsAgo !== 1 ? 's' : ''} ago`
    }
    let divisor
    let unit = ''
    if (secondsAgo < HOUR) {
      [divisor, unit] = [MINUTE, 'minute']
    } else if (secondsAgo < DAY) {
      [divisor, unit] = [HOUR, 'hour']
    } else if (secondsAgo < WEEK) {
      [divisor, unit] = [DAY, 'day']
    } else if (secondsAgo < MONTH) {
      [divisor, unit] = [WEEK, 'week']
    } else if (secondsAgo < YEAR) {
      [divisor, unit] = [MONTH, 'month']
    } else {
      [divisor, unit] = [YEAR, 'year']
    }
    const count = Math.floor(secondsAgo / divisor)
    return `${count} ${unit}${count > 1 ? 's' : ''} ago`
  }

  function symmetricDifference (setA, setB) {
    const _difference = new Set(setA)
    for (const elem of setB) {
      if (_difference.has(elem)) {
        _difference.delete(elem)
      } else {
        _difference.add(elem)
      }
    }
    return _difference
  }

  function compareNames (s0, s1) {
    let r = 0
    s0 = s0.toLowerCase().trim()
    s1 = s1.toLowerCase().trim()
    if (s0 === s1) {
      return 2
    }
    const set0 = new Set(s0.split(/\s+/))
    const set1 = new Set(s1.split(/\s+/))
    r -= symmetricDifference(set0, set1).size
    if (r < 0) {
      r += stringSimilarity.compareTwoStrings(s0, s1)
    }
    return r
  }

  function getThumbs (onUpClick, onDownClick) {
    const thumbs = document.createElement('div')
    thumbs.classList.add('thumbscontainer')
    const thumbUpSVG = document.createElement('div')
    thumbUpSVG.style.width = '40px'
    thumbUpSVG.style.height = '40px'
    thumbUpSVG.style.float = 'left'
    thumbUpSVG.style.cursor = 'pointer'
    thumbUpSVG.innerHTML = GM_getResourceText('thumbUp').replace('id="emoji"', 'id="thumbUp' + Math.random() + '"')
    thumbUpSVG.querySelector('#skin polygon').setAttribute('fill', '#cccccc')
    thumbUpSVG.addEventListener('click', onUpClick)
    thumbs.appendChild(thumbUpSVG)
    const thumbDownSVG = document.createElement('div')
    thumbDownSVG.style.width = '40px'
    thumbDownSVG.style.height = '40px'
    thumbDownSVG.style.float = 'left'
    thumbDownSVG.style.cursor = 'pointer'
    thumbDownSVG.innerHTML = GM_getResourceText('thumbDown').replace('id="emoji"', 'id="thumbDown' + Math.random() + '"')
    thumbDownSVG.querySelector('#skin polygon').setAttribute('fill', '#cccccc')
    thumbDownSVG.addEventListener('click', onDownClick)
    thumbs.appendChild(thumbDownSVG)
    thumbs.appendChild(document.createElement('div')).style.clear = 'left'
    return [thumbs, thumbUpSVG, thumbDownSVG]
  }

  function clearAllRatings () {
    const promises = []
    for (const gmKey of ['swiggy', 'zomato']) {
      promises.push(GM.setValue(gmKey, DEFAULT_DATA))
    }
    Promise.all(promises).then(() => {
      window.alert('All ratings cleared\n\nReload the page to see the changes')
      document.location.reload()
    })
  }
  async function clearRestaurantRatings (node) {
    const gmKey = node.dataset.gmKey
    const restaurantId = node.dataset.restaurantId
    const restaurantName = node.dataset.restaurantName

    if (!gmKey || !restaurantId) {
      return false
    }

    if (!window.confirm('Clear all ratings for this restaurant?\n\n' + restaurantName + '\n\nThis cannot be undone!')) {
      return false
    }

    const data = JSON.parse(await GM.getValue(gmKey, DEFAULT_DATA))
    if ((restaurantId in data.restaurants)) {
      delete data.restaurants[restaurantId]
    }
    await GM.setValue(gmKey, JSON.stringify(data))
    return true
  }

  async function listRatings (mGmKey, selectedRestaurantId) {
    const showRestaurantDishes = function (data, listDiv, restaurantId, gmKey) {
      const info = data.restaurants[restaurantId].info
      const dishes = data.restaurants[restaurantId].dishes
      if (!dishes) {
        return
      }
      const restaDiv = listDiv.appendChild(document.createElement('div'))
      restaDiv.classList.add('restaurant_container')
      const metaDiv = restaDiv.appendChild(document.createElement('div'))
      metaDiv.classList.add('ratings_meta')
      const ra = metaDiv.appendChild(document.createElement('a'))
      ra.href = info.url
      const label = 'name' in info ? info.name : info.url
      ra.appendChild(document.createTextNode(label))
      if ('location' in info && info.location && info.location.trim()) {
        const span = metaDiv.appendChild(document.createElement('span'))
        span.appendChild(document.createTextNode(` (${info.location})`))
      }
      const lastOverallRatingSpan = metaDiv.appendChild(document.createElement('span'))
      const clearButton = metaDiv.appendChild(document.createElement('button'))
      clearButton.style.fontSize = 'small'
      clearButton.style.marginLeft = '3px'
      clearButton.addEventListener('click', function () {
        clearRestaurantRatings(this).then(function (cleared) {
          if (cleared) {
            document.location.reload()
          }
        })
      })
      clearButton.dataset.restaurantId = restaurantId
      clearButton.dataset.gmKey = gmKey
      clearButton.dataset.restaurantName = label
      clearButton.appendChild(document.createTextNode('Clear'))
      const listDivUp = restaDiv.appendChild(document.createElement('div'))
      const listDivDown = restaDiv.appendChild(document.createElement('div'))
      listDivUp.classList.add('ratings_list', 'up')
      listDivDown.classList.add('ratings_list', 'down')
      restaDiv.appendChild(document.createElement('div')).style.clear = 'left'
      let lastRating = null
      for (const dishName in dishes) {
        const dish = dishes[dishName]
        const div = dish.rating > 0 ? listDivUp : listDivDown
        const le = div.appendChild(document.createElement('div'))
        le.classList.add('ratings_item')
        le.appendChild(document.createTextNode(dishName))
        if ('price' in dish && dish.price) {
          le.appendChild(document.createTextNode(` ₹${dish.price}`))
        }
        if ('veg' in dish && dish.veg) {
          const span = le.appendChild(document.createElement('span'))
          if (dish.veg === 'veg') {
            span.classList.add('veggy_icon')
            span.appendChild(document.createTextNode('\u23FA'))
          } else {
            span.classList.add('nonveggy_icon')
            span.appendChild(document.createTextNode('\u2BC5'))
          }
        }
        const date = new Date(dish.lastRating)
        const dateStr = 'Rated: ' + date.toLocaleDateString() + ' ' + timeSince(date)
        le.setAttribute('title', dateStr)
        if (lastRating == null || date > lastRating) {
          lastRating = date
        }
      }
      if (lastRating) {
        const dateStr = ' ' + lastRating.toLocaleDateString() + ' ' + timeSince(lastRating)
        lastOverallRatingSpan.appendChild(document.createTextNode(dateStr))
      }
    }

    let listDiv = document.getElementById('ratings_container')
    if (!listDiv) {
      createMainContainer(mGmKey, selectedRestaurantId)
      listDiv = document.getElementById('ratings_container')
    }
    listDiv.innerHTML = ''

    for (const gmKey of ['swiggy', 'zomato']) {
      const data = JSON.parse(await GM.getValue(gmKey, DEFAULT_DATA))
      if (selectedRestaurantId && selectedRestaurantId in data.restaurants) {
        // Show current restaurant first
        showRestaurantDishes(data, listDiv, selectedRestaurantId, gmKey)
      }
      for (const restaurantId in data.restaurants) {
        if (!selectedRestaurantId || selectedRestaurantId !== restaurantId) {
          showRestaurantDishes(data, listDiv, restaurantId, gmKey)
        }
      }
    }
  }

  function crossCheckNames (name, data) {
    const results = []
    for (const restaurantId in data.restaurants) {
      if (!('name' in data.restaurants[restaurantId].info)) {
        continue
      }
      const r = compareNames(data.restaurants[restaurantId].info.name, name)
      if (r > -2) {
        results.push([r, data.restaurants[restaurantId]])
      }
    }
    return results.sort((a, b) => b[0] - a[0]).map(v => v[1])
  }

  async function crossCheck (restaurantId, restaurantInfo, gmKey) {
    if (!('name' in restaurantInfo) || !restaurantInfo.name) {
      return
    }

    const data = JSON.parse(await GM.getValue(gmKey === 'swiggy' ? 'zomato' : 'swiggy', DEFAULT_DATA))

    const results = crossCheckNames(restaurantInfo.name, data)
    showCrossCheckResults(gmKey, restaurantId, results)
  }

  function showCrossCheckResultsWide () {
    document.getElementById('cross_check_results').classList.add('fullscreen')
    try {
      this.remove()
    } catch (e) {}

    document.head.appendChild(document.createElement('style')).innerHTML = `
    #cross_check_results.fullscreen {
      top: 5px;
      right:5px;
      height: 95%;
      width: 95%;
      max-width: 95%;
      max-height: 95%;
    }

    #cross_check_results.fullscreen .ratings_list {
      width:45%;
      float:left;
    }
    `
  }

  function showCrossCheckResults (gmKey, restaurantId, results) {
    if (!results.length) {
      return
    }
    const div = createMainContainer(gmKey, restaurantId)

    const resultsHead = div.appendChild(document.createElement('div'))
    resultsHead.appendChild(document.createTextNode('Similar named restaurants you voted on ' + (gmKey === 'swiggy' ? 'Zomato' : 'Swiggy')))
    resultsHead.style.fontWeight = 'bold'

    const resultsDiv = div.appendChild(document.createElement('div'))
    results.forEach(function (restaurant, i) {
      const restaurantDiv = resultsDiv.appendChild(document.createElement('div'))
      if (i % 2 === 0) {
        restaurantDiv.style.backgroundColor = '#ddd'
      }
      const restaurantName = restaurantDiv.appendChild(document.createElement('div'))
      restaurantName.appendChild(document.createTextNode(restaurant.info.name))
      const restaurantLoc = restaurantDiv.appendChild(document.createElement('div'))
      restaurantLoc.appendChild(document.createTextNode(restaurant.info.location || ''))
      restaurantLoc.style.fontSize = '10pt'
      const restaurantLink = restaurantDiv.appendChild(document.createElement('a'))
      restaurantLink.appendChild(document.createTextNode(restaurant.info.url))
      restaurantLink.setAttribute('href', restaurant.info.url)
      restaurantLink.style.fontSize = '7pt'
    })
  }

  function createMainContainer (gmKey = 'swiggy', restaurantId = null, clear = false) {
    let div = document.getElementById('cross_check_results')
    if (!div) {
      div = document.body.appendChild(document.createElement('div'))
      div.setAttribute('id', 'cross_check_results')
      document.head.appendChild(document.createElement('style')).innerHTML = `
      #cross_check_results {
        z-index:1200;
        position:fixed;
        top: 100px;
        right:5px;
        max-height: 70%;
        max-width: 20%;
        overflow: auto;
        border:2px solid #223075;
        background:white;
        font-size:12pt
      }
      #cross_check_results button {
        border: 1px solid #777;
        border-radius: 4px;
        background: #e0e0e0;
      }
      #cross_check_results button:hover {
        border: 1px solid #000;
        border-radius: 4px;
        background: #f0f0f0;
      }

      #cross_check_results a:link {
        text-decoration:underline;
        color:#06c;
      }
      #cross_check_results a:visited {
        text-decoration:underline;
        color:#06c;
      }

      #cross_check_results .restaurant_container {
        border-bottom: 2px solid #848484;
      }

      #cross_check_results .ratings_meta {
        background-color:#f4e9bc;
        background-image: linear-gradient(to right, white , #f4e9bc);
        margin-top:3px;
      }

      #cross_check_results .ratings_list {
        float:left;
        margin: 2px;
      }
      #cross_check_results .ratings_list.up {
        background-color:#e6ffe6;
      }
      #cross_check_results .ratings_list.down {
        background-color:#fbd5d5;
        margin-left: 5px;
      }
      #cross_check_results .ratings_item:nth-child(2n+2){
        background-color:#0000000f;
      }
      #cross_check_results .veggy_icon {
        color: #0f8a65;
        border: 2px solid #0f8a65;
        font-size: 8px;
        height: 13px;
        display: inline-block;
        font-weight: 1000;
        width: 12px;
        vertical-align: middle;
        margin: 1px;
      }
      #cross_check_results .nonveggy_icon {
        color: #e43b4f;
        border: 2px solid #e43b4f;
        font-size: 8px;
        height: 13px;
        display: inline-block;
        font-weight: 1000;
        width: 12px;
        vertical-align: middle;
        margin: 1px;
      }

      #cross_check_results .ratings_meta span {
        color: #555;
        font-size: 10pt;
      }

      `

      const controlsDiv = div.appendChild(document.createElement('div'))
      controlsDiv.setAttribute('id', 'controls_container')

      const closeButton = controlsDiv.appendChild(document.createElement('button'))
      closeButton.appendChild(document.createTextNode('Close'))
      closeButton.addEventListener('click', function () {
        removeMainContainer()
        showCrossCheckResults(gmKey, restaurantId, [])
      })

      const clearButton = controlsDiv.appendChild(document.createElement('button'))
      clearButton.appendChild(document.createTextNode('Clear all'))
      clearButton.addEventListener('click', function () {
        if (window.confirm('Delete ratings for all restaurants?') && window.confirm('Delete ratings for ALL restaurants?\n\nAre you sure?')) {
          clearAllRatings()
        }
      })

      const fullscreenButton = controlsDiv.appendChild(document.createElement('button'))
      fullscreenButton.appendChild(document.createTextNode('\u27F7'))
      fullscreenButton.addEventListener('click', showCrossCheckResultsWide)

      const listDiv = div.appendChild(document.createElement('div'))
      listDiv.setAttribute('id', 'ratings_container')
      const listButton = listDiv.appendChild(document.createElement('button'))
      listButton.appendChild(document.createTextNode('View ratings'))
      listButton.addEventListener('click', () => listRatings(gmKey, restaurantId))
    }

    if (clear) {
      div.classList.remove('fullscreen')
      div.innerHTML = ''
    }

    div.style.display = 'block'

    return div
  }

  function removeMainContainer () {
    const div = document.getElementById('cross_check_results')
    if (div) {
      div.remove()
    }
  }

  if (document.location.hostname.endsWith('.swiggy.com')) {
    let crossCheckDone = false
    const getRestaurantInfo = function () {
      const results = {}
      const h1 = document.querySelector('[class*="RestaurantNameAddress_name"]')
      if (h1) {
        results.name = h1.textContent.trim()
      }
      try {
        results.location = document.querySelector('[class*="RestaurantNameAddress_area"]').textContent.trim()
      } catch (e) {
        console.log(e)
      }
      return results
    }
    const addRatingsButton = function () {
      if (document.getElementById('nav_rating_button')) {
        return
      }
      if (document.querySelector('.global-nav a[href*="/support"]')) {
        const orgLi = document.querySelector('.global-nav a[href*="/support"]').parentNode.parentNode
        const li = orgLi.cloneNode(true)
        orgLi.parentNode.appendChild(li)
        li.setAttribute('id', 'nav_rating_button')
        li.addEventListener('click', function (ev) {
          ev.preventDefault()
          listRatings('swiggy', null)
        })
        li.querySelector('a').href = '#'
        const svg = li.querySelector('svg')
        const span = svg.parentNode
        span.parentNode.replaceChild(document.createTextNode('Ratings'), span.nextSibling)
        const starSVG = document.createElement('div')
        starSVG.style.width = '22px'
        starSVG.style.height = '22px'
        starSVG.style.cursor = 'pointer'
        starSVG.innerHTML = GM_getResourceText('star').replace('id="emoji"', 'id="starSVG' + Math.random() + '"')
        starSVG.querySelector('#color polygon').setAttribute('fill', '#ffffff')
        starSVG.querySelector('#line polygon').setAttribute('stroke', '#3d4152')
        starSVG.querySelector('#line polygon').setAttribute('stroke-width', '6')
        span.replaceChild(starSVG, svg)
      } else if (!document.getElementById('cross_check_results')) {
        createMainContainer('swiggy', null)
      }
    }
    const addRatings = async function () {
      const m = document.location.pathname.match(/\/restaurants\/[\w-]+-(\d+)/)
      if (!m) {
        return
      }
      const restaurantId = m[1]

      let data = JSON.parse(await GM.getValue('swiggy', DEFAULT_DATA))
      if (!(restaurantId in data.restaurants)) {
        data.restaurants[restaurantId] = { dishes: {}, info: { id: restaurantId, url: document.location.href } }
      }

      if (!crossCheckDone) {
        crossCheckDone = true
        crossCheck(restaurantId, getRestaurantInfo(), 'swiggy')
      }

      document.querySelectorAll('[data-testid*="dish-item"]').forEach(function (menuItem) {
        if ('userscriptprocessed' in menuItem.dataset) {
          return
        }
        menuItem.dataset.userscriptprocessed = 1
        const dishName = menuItem.querySelector('[class*=itemNameText]').textContent.trim()
        const saveRating = async function (rating) {
          let price = null
          try {
            price = parseInt(menuItem.querySelector('.rupee').textContent.trim())
          } catch (e) {
            console.log(e)
          }
          let veg = null
          const icon = menuItem.querySelector('[class*=styles_icon]')
          if (icon && icon.className.match(/icon-?([a-z]+)/i)) {
            veg = icon.className.match(/icon-?([a-z]+)/i)[1].toLowerCase() // "veg", "nonveg"
          }
          data = JSON.parse(await GM.getValue('swiggy', DEFAULT_DATA))
          if (!(restaurantId in data.restaurants)) {
            data.restaurants[restaurantId] = { dishes: {}, info: { id: restaurantId, url: document.location.href } }
          }
          if (!(dishName in data.restaurants[restaurantId].dishes)) {
            data.restaurants[restaurantId].dishes[dishName] = {
              name: dishName,
              price,
              veg,
              lastRating: new Date().toJSON().toString()
            }
          }
          data.restaurants[restaurantId].dishes[dishName].rating = rating
          data.restaurants[restaurantId].info = Object.assign(data.restaurants[restaurantId].info, getRestaurantInfo())
          await GM.setValue('swiggy', JSON.stringify(data))
        }

        const onUp = function () {
          saveRating(1).then(function () {
            thumbUp.querySelector('#skin polygon').setAttribute('fill', '#50c020')
            thumbDown.querySelector('#skin polygon').setAttribute('fill', '#cccccc')
          })
        }
        const onDown = function () {
          saveRating(-1).then(function () {
            thumbUp.querySelector('#skin polygon').setAttribute('fill', '#cccccc')
            thumbDown.querySelector('#skin polygon').setAttribute('fill', '#e60000')
          })
        }

        const [thumbs, thumbUp, thumbDown] = getThumbs(onUp, onDown)
        const parentContainer = menuItem.querySelector('[class*=itemImageContainer]')
        thumbs.style.position = 'relative'
        thumbs.style.zIndex = 1
        if (parentContainer.className.indexOf('NoImage') === -1) {
          thumbs.style.marginTop = '20pt'
        }
        parentContainer.appendChild(thumbs)
        if (dishName in data.restaurants[restaurantId].dishes) {
          if (data.restaurants[restaurantId].dishes[dishName].rating > 0) {
            thumbUp.querySelector('#skin polygon').setAttribute('fill', '#50c020')
          } else if (data.restaurants[restaurantId].dishes[dishName].rating < 0) {
            thumbDown.querySelector('#skin polygon').setAttribute('fill', '#e60000')
          }
          const dateDiv = thumbs.appendChild(document.createElement('div'))
          const date = new Date(data.restaurants[restaurantId].dishes[dishName].lastRating)
          const dateStr = date.toLocaleDateString() + ' ' + timeSince(date)
          dateDiv.style.fontSize = '10px'
          dateDiv.appendChild(document.createTextNode(dateStr))
        }
      })
    }
    const addNonVegToggle = function () {
      let orgDiv
      let newDiv
      let isActive
      const orgClick = function () {
        if (isActive) {
          console.debug('orgClick: already non-veg, reset it')
          resetNonVeg()
        }
      }
      const resetNonVeg = function () {
        document.querySelectorAll('.hiddenbyscript').forEach(function (menuItem) {
          menuItem.classList.remove('hiddenbyscript')
          menuItem.style.display = ''
        })
        isActive = false
        newDiv.querySelector('[class*="ToggleSwitch_toggleBar"]').style.backgroundColor = ''
        newDiv.querySelector('[class*="ToggleSwitch_toggleThumb"]').style.backgroundColor = ''
        newDiv.querySelector('[class*="ToggleSwitch_toggleThumb"]').style.transform = ''
      }
      const enableNonVeg = function (ev) {
        if (ev) {
          ev.preventDefault()
          ev.stopPropagation()
        }
        if (isActive) {
          console.debug('enableNonVeg: already non-veg, reset it')
          window.setTimeout(resetNonVeg, 100)
          return
        }

        if (orgDiv.querySelector('[class*="toggleThumbActive"]')) {
          console.debug('enableNonVeg: org checkbox is checked, click it and wait')
          orgDiv.querySelector('button').click()
          window.setTimeout(enableNonVeg, 500)
          newDiv.querySelector('[class*="ToggleSwitch_toggleBar"]').style.backgroundColor = '#87d'
          return
        }

        console.debug('enableNonVeg: hide menu items')
        document.querySelectorAll('[data-testid*="dish-item"]').forEach(function (menuItem) {
          const icon = menuItem.querySelector('[class*=styles_icon]')
          if (icon && icon.className.match(/icon-?veg/i)) {
            menuItem.classList.add('hiddenbyscript')
            menuItem.style.display = 'none'
          }
        })
        isActive = true
        newDiv.querySelector('[class*="ToggleSwitch_toggleBar"]').style.backgroundColor = '#e43b4f'
        newDiv.querySelector('[class*="ToggleSwitch_toggleThumb"]').style.backgroundColor = '#e43b4f'
        newDiv.querySelector('[class*="ToggleSwitch_toggleThumb"]').style.transform = 'translate3d(18px,0,0)'
      }
      const labels = document.querySelectorAll('[data-testid*="filter-switch"]')
      labels.forEach(function (label) {
        if (label.className.indexOf('vegOnly') !== -1) {
          orgDiv = label
          orgDiv.parentNode.style.justifyContent = 'flex-start'
          newDiv = orgDiv.parentNode.appendChild(label.cloneNode(true))
          newDiv.style.marginLeft = '1em'
          newDiv.setAttribute('id', 'nonVegToggle')
          newDiv.querySelector('[class*="Label_"]').textContent = 'Non veg'
          newDiv.querySelector('button').addEventListener('click', enableNonVeg)
          orgDiv.querySelector('button').addEventListener('click', orgClick)
        }
      })
    }
    window.setInterval(function () {
      addRatingsButton()
      addRatings()
      if (!document.getElementById('nonVegToggle')) {
        addNonVegToggle()
      }
    }, 1000)
  } else if (document.location.hostname.endsWith('.zomato.com')) {
    let crossCheckDone = false
    const getRestaurantInfo = function () {
      const results = {}
      const h1 = document.querySelector('div#root main section>div>div>div>h1')
      if (h1) {
        results.name = h1.textContent.trim()
      }
      try {
        results.location = h1.parentNode.nextElementSibling.firstChild.nextElementSibling.textContent.trim()
      } catch (e) {
        console.log(e)
      }
      return results
    }
    const addRatingsButton = function () {
      if (document.getElementById('nav_rating_button')) {
        return
      }
      if (document.querySelector('ul[id*=navigation]')) {
        const orgLi = document.querySelector('ul[id*=navigation]').querySelector('li:last-child')
        const li = orgLi.cloneNode(true)
        orgLi.parentNode.appendChild(li)
        li.setAttribute('id', 'nav_rating_button')
        li.addEventListener('click', function (ev) {
          ev.preventDefault()
          listRatings('zomato', null)
        })
        const a = li.querySelector('a')
        a.innerHTML = ''
        a.style.fontSize = '10px'
        const starSVG = document.createElement('div')
        starSVG.style.width = '22px'
        starSVG.style.height = '22px'
        starSVG.style.cursor = 'pointer'
        starSVG.style.margin = 'auto'
        starSVG.style.marginTop = '-35px'
        starSVG.innerHTML = GM_getResourceText('star').replace('id="emoji"', 'id="starSVG' + Math.random() + '"')
        starSVG.querySelector('#color polygon').setAttribute('fill', '#EF4F5F')
        a.appendChild(starSVG)
        a.appendChild(document.createTextNode('Ratings'))
      } else if (!document.getElementById('cross_check_results')) {
        createMainContainer('zomato', null)
      }
    }
    const addRatings = async function () {
      const m = document.location.pathname.match(/([\w-]+\/[\w-]+)\/order/)
      if (!m) {
        return
      }
      const restaurantId = m[1]

      let data = JSON.parse(await GM.getValue('zomato', DEFAULT_DATA))
      if (!(restaurantId in data.restaurants)) {
        data.restaurants[restaurantId] = { dishes: {}, info: { id: restaurantId, url: document.location.href } }
      }

      if (!crossCheckDone) {
        crossCheckDone = true
        crossCheck(restaurantId, getRestaurantInfo(), 'zomato')
      }

      document.querySelectorAll('[type="veg"],[type="non-veg"]').forEach(function (symbol) {
        const menuItem = symbol.parentNode.parentNode.parentNode
        if ('userscriptprocessed' in menuItem.dataset) {
          return
        }
        menuItem.dataset.userscriptprocessed = 1
        const dishName = menuItem.querySelector('h4').textContent.trim()
        const saveRating = async function (rating) {
          let price = null
          try {
            price = parseInt(menuItem.textContent.match(/₹\s*(\d+)/)[1])
          } catch (e) {
            console.log(e)
          }
          const veg = symbol.getAttribute('type').toLowerCase().replace('-', '') // "veg", "nonveg"
          data = JSON.parse(await GM.getValue('zomato', DEFAULT_DATA))
          if (!(restaurantId in data.restaurants)) {
            data.restaurants[restaurantId] = { dishes: {}, info: { id: restaurantId, url: document.location.href } }
          }
          if (!(dishName in data.restaurants[restaurantId].dishes)) {
            data.restaurants[restaurantId].dishes[dishName] = {
              name: dishName,
              price,
              veg, // "veg", "nonveg"
              lastRating: new Date().toJSON().toString()
            }
          }
          data.restaurants[restaurantId].dishes[dishName].rating = rating
          data.restaurants[restaurantId].info = Object.assign(data.restaurants[restaurantId].info, getRestaurantInfo())
          await GM.setValue('zomato', JSON.stringify(data))
        }

        const onUp = function () {
          saveRating(1).then(function () {
            thumbUp.querySelector('#skin polygon').setAttribute('fill', '#50c020')
            thumbDown.querySelector('#skin polygon').setAttribute('fill', '#cccccc')
          })
        }
        const onDown = function () {
          saveRating(-1).then(function () {
            thumbUp.querySelector('#skin polygon').setAttribute('fill', '#cccccc')
            thumbDown.querySelector('#skin polygon').setAttribute('fill', '#e60000')
          })
        }

        const [thumbs, thumbUp, thumbDown] = getThumbs(onUp, onDown)
        thumbs.style.marginTop = '20pt'
        menuItem.firstChild.appendChild(thumbs)
        if (dishName in data.restaurants[restaurantId].dishes) {
          if (data.restaurants[restaurantId].dishes[dishName].rating > 0) {
            thumbUp.querySelector('#skin polygon').setAttribute('fill', '#50c020')
          } else if (data.restaurants[restaurantId].dishes[dishName].rating < 0) {
            thumbDown.querySelector('#skin polygon').setAttribute('fill', '#e60000')
          }
          const dateDiv = thumbs.appendChild(document.createElement('div'))
          const date = new Date(data.restaurants[restaurantId].dishes[dishName].lastRating)
          const dateStr = date.toLocaleDateString() + ' ' + timeSince(date)
          dateDiv.style.fontSize = '10px'
          dateDiv.appendChild(document.createTextNode(dateStr))
        }
      })
    }
    const addNonVegToggle = function () {
      let label
      let orgDiv
      let newDiv
      let newCheckbox
      const orgClick = function () {
        if (newCheckbox.checked) {
          console.debug('orgClick: already non-veg, reset it')
          resetNonVeg()
        }
      }
      const resetNonVeg = function () {
        document.querySelectorAll('.hiddenbyscript').forEach(function (menuItem) {
          menuItem.classList.remove('hiddenbyscript')
          menuItem.style.display = ''
        })
        newCheckbox.checked = false
        newCheckbox.style.backgroundColor = ''
      }
      const enableNonVeg = function (ev) {
        if (ev) {
          ev.preventDefault()
          ev.stopPropagation()
        }
        newCheckbox.style.backgroundColor = '#87d'
        window.setTimeout(function () {
          if (newCheckbox.checked) {
            console.debug('enableNonVeg: already non-veg, reset it')
            window.setTimeout(resetNonVeg, 200)
            return
          }

          if (orgDiv.checked) {
            console.debug('enableNonVeg: org checkbox is checked, click it and wait')
            orgDiv.click()
            window.setTimeout(enableNonVeg, 500)
            return
          }

          console.debug('enableNonVeg: hide menu items')
          document.querySelectorAll('[type="veg"]').forEach(function (symbol) {
            const menuItem = symbol.parentNode.parentNode.parentNode
            menuItem.classList.add('hiddenbyscript')
            menuItem.style.display = 'none'
          })
          newCheckbox.checked = true
          newCheckbox.style.backgroundColor = ''
        }, 100)
      }
      const labels = document.querySelectorAll('label')
      labels.forEach(function (l) {
        if (l.textContent.toLowerCase().indexOf('veg') !== -1 && l.textContent.toLowerCase().indexOf('only') !== -1) {
          label = l
          orgDiv = label
          newDiv = orgDiv.cloneNode(true)
          label.parentNode.appendChild(newDiv)
          label.parentNode.style.width = (label.parentNode.clientWidth + newDiv.clientWidth + 17) + 'px'
          newCheckbox = newDiv.querySelector('input[type=checkbox]')
          newCheckbox.checked = false
          newDiv.setAttribute('id', 'nonVegToggle')
          newDiv.childNodes.forEach(function (c) {
            if (c.nodeType === Node.TEXT_NODE && c.textContent.toLowerCase().indexOf('veg') !== -1) {
              c.textContent = 'Non veg'
            }
          })
          newDiv.addEventListener('click', enableNonVeg)
          orgDiv.addEventListener('click', orgClick)
        }
      })
    }
    window.setInterval(function () {
      addRatingsButton()
      addRatings()
      if (!document.getElementById('nonVegToggle')) {
        addNonVegToggle()
      }
    }, 1000)
  }
})()
