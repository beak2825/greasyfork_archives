// ==UserScript==
// @name         Refined Aneo Progessi
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  UserScript that enhances the Progessi of Aneo
// @author       Estéban Soubiran (https://github.com/barbapapazes)
// @license      MIT
// @match        https://aneo.progessi.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=progessi.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469655/Refined%20Aneo%20Progessi.user.js
// @updateURL https://update.greasyfork.org/scripts/469655/Refined%20Aneo%20Progessi.meta.js
// ==/UserScript==

(function () {
  'use strict'
  let waitingLoading

  function hideUselessData() {
    // on /home/control/timesheetByLine
    const unityPerDay = document.querySelectorAll('div.infocell > div:nth-child(2)')
    unityPerDay.forEach((item) => {
      item.style.display = 'none'
    })

    const emptyLabel = document.querySelector('div.fc-totals > div.fc-info > div > div:nth-child(1)')
    if (emptyLabel)
      emptyLabel.style.display = 'none'

    const dLabel = document.querySelector('div.fc-totals > div.fc-info > div > div:nth-child(2)')
    if (dLabel)
      dLabel.style.display = 'none'

    const emptyDay = document.querySelectorAll('div.fc-totals > div > div:nth-child(3)')
    emptyDay.forEach((item) => {
      item.style.display = 'none'
    })

    const hourTotal = document.querySelector('div.fc-totals > div.fc-info > div > div:nth-child(3)')
    if (hourTotal)
      hourTotal.style.display = 'none'

    const hLabel = document.querySelector('div.fc-totals > div.fc-info > div > div:nth-child(4)')
    if (hLabel)
      hLabel.style.display = 'none'

    const emptyHour = document.querySelectorAll('div.fc-totals > div > div:nth-child(4)')
    emptyHour.forEach((item) => {
      item.style.display = 'none'
    })

    const firstActions = document.querySelector('#content-main-section > div.ng-scope > div > div > form > div:nth-child(1)')
    if (firstActions)
      firstActions.style.display = 'none'

    const searchBar = document.getElementById('search-bar')
    if (searchBar)
      searchBar.style.display = 'none'

    const badgeNotifications = document.querySelector('#notification_count')
    if (badgeNotifications)
      badgeNotifications.style.display = 'none'

    // on /home/control/main
    const stops = document.querySelector('[ofbiz-portal-portlet-id=DASHBOARD_HOME_P04]')
    if (stops)
      stops.style.display = 'none'
    const trombi = document.querySelector('[ofbiz-portal-portlet-id=DASHB_TROMBI_WELCOME]')
    if (trombi)
      trombi.style.display = 'none'
    const projects = document.querySelector('[ofbiz-portal-portlet-id=DASHB_PRJ_WELCOME]')
    if (projects)
      projects.style.display = 'none'
    const fav = document.querySelector('[ofbiz-portal-portlet-id=DASHBOARD_HOME_FAV]')
    if (fav)
      fav.style.display = 'none'
    const documents = document.querySelector('[ofbiz-portal-portlet-id=DASHBOARD_HOME_P09]')
    if (documents)
      documents.style.display = 'none'
    const pRate = document.querySelector('[ofbiz-portal-portlet-id=DASHB_P_RATE_WELCOME]')
    if (pRate)
      pRate.style.display = 'none'
    const stDoc = document.querySelector('[ofbiz-portal-portlet-id=DASHB_ST_DOC_WELCOME]')
    if (stDoc)
      stDoc.style.display = 'none'
    const expensya = document.querySelector('[ofbiz-portal-portlet-id=DASHBOARD_EXPENSYA]')
    if (expensya)
      expensya.style.display = 'none'

    const header = document.querySelector('body > div.page-wrapper > div.page-header.navbar.navbar-fixed-top > div > div.hor-menu.hidden-sm.hidden-xs > ul')
    const aExpensya = document.createElement('a')
    aExpensya.href = 'https://app.expensya.com/Portal/#/Login'
    aExpensya.textContent = 'Expensya'
    aExpensya.class = 'dropdown-toggle'
    const liHeader = document.createElement('li')
    liHeader.append(aExpensya)
    header.append(liHeader)

    const vacations = document.querySelector('#portalContainer_HOME_INT_PROFILE_grid-stack > div:nth-child(3) > div > div > div > div.tile-info')
    if (vacations)
      vacations.style.display = 'none'

    clearInterval(waitingLoading)
  }

  function createImportCSVInput() {
    const input = document.createElement('input')
    input.type = 'file'
    input.id = 'file'
    input.accept = '.csv'
    input.title = 'Importer un fichier CSV'

    input.classList.add('btn', 'btn-primary', 'btn-sm')

    return input
  }

  function addImportCSV() {
    // on /home/control/timesheetByLine
    const input = createImportCSVInput()

    input.addEventListener('change', (e) => {
      const file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        const lines = e.target.result.split('\n')

        const header = lines[0].split(',')

        // Parse CSV

        const content = new Map() // Key is line name and value is an object with day as key and time as value

        // Start at 1 to skip header
        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(',')

          const lineName = cells[0].toLowerCase() // First cell is line name
          const data = {}

          // Start at 1 to skip line name
          for (let j = 1; j < cells.length; j++) {
            const day = header[j]
            const time = cells[j]

            data[day] = time
          }

          content.set(lineName, data)
        }

        const timelines = document.querySelectorAll('div.fc-timeline')

        // Fill inputs
        timelines.forEach((timeline) => {
          const lineSelect = timeline.querySelector('select')
          // const lineValue = lineSelect.options[lineSelect.selectedIndex].value
          const lineSelectName = lineSelect.options[lineSelect.selectedIndex].text

          const subLineSelect = timeline.querySelector('select + select')

          let lineName = lineSelectName.toLowerCase()

          if (subLineSelect) {
            const subLineSelectName = subLineSelect.options[subLineSelect.selectedIndex].text
            lineName += ` - ${subLineSelectName.toLowerCase()}`
          }

          const days = timeline.querySelectorAll('.dayparent')

          // Line name could be a part of the content key
          const contentKeys = Array.from(content.keys())
          let csvKey = ''

          contentKeys.find((key) => {
            if (lineName.includes(key)) {
              csvKey = key
              return true
            }

            return false
          })

          if (!csvKey) {
            console.warn('No key found for line name', lineName)
          }
          else {
            const csvContent = content.get(csvKey)
            days.forEach((day) => {
              const dayName = day.querySelector('.day-numbers').textContent
              const dayInput = day.querySelector('input')
              const spanValue = day.querySelector('input + span')

              const dayValue = csvContent[dayName]
              if (dayValue) {
                dayInput.title = dayValue / 100
                dayInput.value = dayValue / 100
                spanValue.textContent = dayValue / 100

                // trigger change event
                const event = new Event('change')
                dayInput.dispatchEvent(event)
              }
            })
          }
        })

        input.value = ''
      }

      reader.readAsText(file)
    })

    // Add input after the first button in actions
    const actions = document.querySelectorAll('.fc-addcontrol')
    const action = actions[1].querySelector('button')
    action.after(input)
  }

  waitingLoading = setTimeout(() => {
    hideUselessData()
    addImportCSV()
  }, 50)
})()
