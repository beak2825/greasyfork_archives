// ==UserScript==
// @name         Book Club Manager
// @version      0.5.2
// @description  Management tool for running a book club on a Discourse forum.
// @namespace    https://kurifuri.com/
// @license MIT
// @match        https://community.wanikani.com/*
// @match        https://forums.learnnatively.com/*
// @grant      GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/481646/Book%20Club%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/481646/Book%20Club%20Manager.meta.js
// ==/UserScript==

/* globals
  Interface,
  loadFromFileText,
  loadFromStorage,
  Macro,
  series,
  Template
*/

(function () {
  'use strict'

GM_addStyle(`body#kfbc-form {
    height: 100vh;
}

#kfbc-form select {
    height: 1.5em;
}
#kfbc-form button {
    height: 1.7em;
}
#kfbc-form #kfbc-series-buttons button + button,
#kfbc-form #kfbc-volume-buttons button + button,
#kfbc-form #kfbc-add-new-template-container button{
    margin-left: 4px;
}

#kfbc-form #kfbc-layout {
    display: grid;
    grid-template-columns: min-content auto;
    grid-template-rows: min-content auto;
    grid-column-gap: 0px;
    grid-row-gap: 0px;
}
#kfbc-form #kfbc-target { grid-area: 1 / 1 / 2 / 2; }
#kfbc-form #kfbc-buttons { grid-area: 2 / 1 / 3 / 2; }
#kfbc-form #kfbc-content { grid-area: 1 / 2 / 4 / 3; padding-left: 15px; }

#kfbc-form #kfbc-buttons button, select.menu { height: 2em; width: 100%; margin-bottom: 5px; }

#kfbc-form #kfbc-volumes { margin-top: 1em; }
#kfbc-form #kfbc-volumes-list {
    min-width: 100px;
}
#kfbc-form #kfbc-add-new-volume { margin-bottom: 4px; }

#kfbc-form #kfbc-templates { margin-top: 1em; }
#kfbc-form #kfbc-template-tables { padding: 0 10px; }
#kfbc-form #kfbc-add-new-template-container { margin-bottom: 3px; }
#kfbc-form #kfbc-templates td { vertical-align: top; }
#kfbc-form #kfbc-template-volume-thread textarea { height: 300px; width: 600px; }

#kfbc-form #kfbc-templateslist li:hover,
#kfbc-form summary:hover,
#kfbc-form .kfbc-clickable { cursor: pointer; }

#kfbc-form label:after { content: ":"; }
#kfbc-form #kfbc-vocabulary label:after { content: ""; }

/* Website icons */

#kfbc-form .kfbc-favicon {
    background-size: 16px;
    background-repeat: no-repeat;
    background-position: left;
    min-height: 16px;
    padding-left: 20px;
}

#kfbc-form .kfbc-favicon.kfbc-amazon { background-image: url("https://www.amazon.com/favicon.ico"); }
#kfbc-form .kfbc-favicon.kfbc-book-walker { background-image: url("https://bookwalker.jp/favicon.ico"); }
#kfbc-form .kfbc-favicon.kfbc-cd-japan { background-image: url("https://www.cdjapan.co.jp/favicon.ico"); }
#kfbc-form .kfbc-favicon.kobo, .kfbc-favicon.kfbc-rakuten { background-image: url("https://www.rakuten.com/favicon.ico"); }
#kfbc-form .kfbc-favicon.kfbc-natively { background-image: url("https://d1sbtzet6n43nd.cloudfront.net/favicon_io/favicon-32x32.35341b5780fe.png"); }
#kfbc-form .kfbc-favicon.kfbc-pixiv { background-image: url("https://www.pixiv.net/favicon.ico"); }
#kfbc-form .kfbc-favicon.kfbc-yahoo { background-image: url("https://www.yahoo.co.jp/favicon.ico"); }

#kfbc-form #kfbc-show-volume-links {
    display: none;
}

#kfbc-form #kfbc-book-list {
    width: auto;
    min-width: 220px;
}

textarea[name="kfbc-template-markdown"] {
    width: 100%;
}

#kfbc-form table[name="kfbc-chapters"] td:nth-child(3) {
    text-align: center;
}

/* Discourse/WaniKani-specific styles */
#kfbc-form {
    background-color: var(--blend-primary-secondary-5);
    border: thin solid var(--primary-300);
    border-left-width: 5px;
    padding: 5px 18px;
    margin-bottom: 14px;
}
`)
GM_addStyle(`/* https://cssgrid-generator.netlify.app/ */

/* Series Grid */

#kfbc-form #kfbc-series {
    display: grid;
    grid-template-columns: repeat(5, fit-content(10em));
    grid-template-rows: repeat(5, 1fr);
    grid-gap: 5px;
    margin-top: 5px;
}

#kfbc-form #kfbc-series label {text-align: right;}

#kfbc-form #kfbc-series *:nth-child(1) { grid-area: 1 / 1 / 2 / 2; }
#kfbc-form #kfbc-series *:nth-child(2) { grid-area: 1 / 2 / 2 / 4; }
#kfbc-form #kfbc-series *:nth-child(3) { grid-area: 1 / 4 / 2 / 5; }
#kfbc-form #kfbc-series *:nth-child(4) { grid-area: 1 / 5 / 2 / 6; }
#kfbc-form #kfbc-series *:nth-child(5) { grid-area: 2 / 1 / 3 / 2; }
#kfbc-form #kfbc-series *:nth-child(6) { grid-area: 2 / 2 / 3 / 6; }
#kfbc-form #kfbc-series *:nth-child(7) { grid-area: 3 / 1 / 4 / 2; }
#kfbc-form #kfbc-series *:nth-child(8) { grid-area: 3 / 2 / 4 / 6; }
#kfbc-form #kfbc-series *:nth-child(9) { grid-area: 4 / 1 / 5 / 2; }
#kfbc-form #kfbc-series *:nth-child(10) { grid-area: 4 / 2 / 5 / 3; }
#kfbc-form #kfbc-series *:nth-child(11) { grid-area: 4 / 3 / 5 / 5; }
#kfbc-form #kfbc-series *:nth-child(12) { grid-area: 4 / 5 / 5 / 6; }
#kfbc-form #kfbc-series *:nth-child(13) { grid-area: 5 / 1 / 6 / 2; }
#kfbc-form #kfbc-series *:nth-child(14) { grid-area: 5 / 2 / 6 / 3; }
#kfbc-form #kfbc-series *:nth-child(15) { grid-area: 5 / 3 / 6 / 5; }
#kfbc-form #kfbc-series *:nth-child(16) { grid-area: 5 / 5 / 6 / 6; }


#kfbc-form .kfbc-volume-container>div
{
    margin: 5px 0;
}


/* Volume Grid */

#kfbc-form .kfbc-volume-container>div[name="kfbc-volume"] {
    display: grid;
    grid-template-columns: max-content max-content;
    grid-gap: 5px;
}

#kfbc-form .kfbc-volume-container>div[name="kfbc-volume"] input {
    width: 500px;
}
#kfbc-form .volumeContainer>div[name="kfbc-volume"] select {
    width: 300px;
}



/* Chapters Section */

#kfbc-form table[name="kfbc-chapters"] input#kfbc-number {
    width: 5em;
}
#kfbc-form table[name="kfbc-chapters"] input#kfbc-title {
    width: 30em;
}


/* Weeks Grid */

#kfbc-form table[name="kfbc-weeks"] input#kfbc-number {
    width: 5em;
}
#kfbc-form table[name="kfbc-weeks"] input#kfbc-week-thread {
    width: 5em;
}
#kfbc-form table[name="kfbc-weeks"] input#kfbc-start-date {
    width: 10em;
}
#kfbc-form table[name="kfbc-weeks"] input#kfbc-chapters {
    width: 7em;
}
#kfbc-form table[name="kfbc-weeks"] input#kfbc-start-page {
    width: 7em;
}
#kfbc-form table[name="kfbc-weeks"] input#kfbc-end-page {
    width: 7em;
}
`)

/* eslint-disable no-unused-vars */

/* globals
  confirm,
  displayVolume,
  ErrorMessage,
  Interface,
  isDate,
  loadFromFileText,
  localStorage,
  storagePrefix,
  Template,
  Volume
*/

/**
 * A series contains one or more volumes.
 */
class Series {
  constructor (bookTitle) {
    this.bookTitle = bookTitle
    this.bookEmoji = ''
    this.bookClub = ''
    this.seriesHomeThread = null
    this.shortDateFormat = ''
    this.longDateFormat = ''
    this.chapterNumberPrefix = ''
    this.chapterNumberSuffix = ''
    this.volumes = {}
    this.templates = {}
    this.vocabularySheet = {}
    this.selectedVolumeNumber = -1
  }

  static fromJson (json) {
    let s = new Series(json.bookTitle)

    s.bookEmoji = json.bookEmoji
    s.bookClub = json.bookClub
    s.seriesHomeThread = json.seriesHomeThread
    s.shortDateFormat = json.shortDateFormat
    s.longDateFormat = json.longDateFormat
    s.chapterNumberPrefix = json.chapterNumberPrefix
    s.chapterNumberSuffix = json.chapterNumberSuffix
    s.vocabularySheet = json.vocabularySheet

    if (json.volumes !== undefined) {
      for (const [volumeNumber, volumeJson] of Object.entries(json.volumes)) {
        let volume = Volume.fromJson(volumeJson)
        s.volumes[volume.volumeNumber] = volume
      }
    } else {
      s.volumes[1] = new Volume(1)
    }

    if (json.templates !== undefined) {
      for (const [templateName, templateMarkdown] of Object.entries(json.templates)) {
        s.templates[templateName] = templateMarkdown
      }
    }

    return s
  }

  static load (seriesTitle) {
    // Load a blank entry if there is no title.
    if (seriesTitle === '') {
      return this.fromJson({})
    }

    return this.fromJson(JSON.parse(localStorage.getItem(`${storagePrefix}${seriesTitle}`)))
  }

  selectedVolume () {
    // TODO: Handle selectedVolumeNumber better so it will always have the proper value.
    if (this.selectedVolumeNumber === -1) {
      this.selectedVolumeNumber = Object.keys(this.volumes).pop()
    }
    if (this.selectedVolumeNumber in this.volumes) {
      return this.volumes[this.selectedVolumeNumber]
    } else {
      return null
    }
  }

  /**
   * The current volume being read, based on today's date.
   * @returns The current volume or next volume if there is no current.
   */
  currentVolume () {
    let today = new Date()
    let soonestVolume = null
    let soonestFutureVolume = null
    for (const [volumeNumber, volume] of Object.entries(this.volumes)) {
      const startDate = volume.startDate()

      // Skip if there isn't a date set.
      if (!isDate(startDate)) {
        continue
      }

      // Skip future volumes.
      if (today < Date.parse(startDate)) {
        // This assumes the volumes are in order.  The first future volume will be returned.
        if (soonestFutureVolume === null) {
          soonestFutureVolume = volume
        }
        continue
      }

      // This assumes the volumes are in order.  The last volume not skipped will be returned.
      soonestVolume = volume
    }

    // If there is no current volume, pick the earliest future volume.
    if (soonestVolume === null) {
        return soonestFutureVolume
    }

    return soonestVolume
  }

  /**
   * The next volume to be read, based on today's date.
   * @returns The next volume to be read.
   */
  nextVolume () {
    // Assume that a volume thread will be posted before the start date, but no later than one week after the start date.
    // By this logic, the next volume's thread should be gotten a thread with a date after "today - 7 days".
    let today = new Date()
    let oldestDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
    let soonestVolume = null
    for (const [volumeNumber, volume] of Object.entries(this.volumes)) {
      const startDate = volume.startDate()

      if (!isDate(startDate)) {
        continue
      }

      // Skip much older dates.
      if (startDate < oldestDate) {
        continue
      }
      // Take the first avaialble date.
      if (soonestVolume == null) {
        soonestVolume = volume
        continue
      }
      // Take subsequent dates if they are older than the first available date.  This is unlikely, but could happen.
      if (startDate < soonestVolume.startDate) {
        soonestVolume = volume
        continue
      }
    }
    return soonestVolume
  }

  /**
   * Creates an HTML <select> containing a list of available templates.
   * @param {*} templateTypeName The ID and name to assign the <select> element.
   * @param {*} selectedItemText The template to show as the selected value.
   * @returns HTML select element.
   */
  templatesToHtml (templateTypeID, templateTypeName, selectedItemText) {
    const selectElement = document.createElement('select')
    selectElement.id = `kfbc-${templateTypeID}`
    selectElement.name = `${templateTypeName}`
    const blankOption = document.createElement('option')
    selectElement.appendChild(blankOption)
    // TODO: Need to get these at the series level.
    for (const templateName in this.templates) {
      const templateOption = document.createElement('option')
      templateOption.textContent = templateName
      selectElement.appendChild(templateOption)
    }
    selectElement.value = selectedItemText

    return selectElement
  }

  /**
   * Synchronizes changes to the HTML page back to the Series object.
   * @param {*} object Object to update the value of.
   * @returns Function to update the Series object.
   */
  syncValue (object) {
    return function () {
      object[this.name] = this.value
    }
  }

  syncChecked (object) {
    return function () {
      object[this.name] = this.checked
    }
  }

  toHtml () {
    // When creating a new series, why all values undefined?
    if (this.vocabularySheet === undefined) {
      this.bookTitle = ''
      this.bookEmoji = ''
      this.bookClub = ''
      this.seriesHomeThread = null
      this.shortDateFormat = ''
      this.longDateFormat = ''
      this.chapterNumberPrefix = ''
      this.chapterNumberSuffix = ''
      this.volumes = {}
      this.templates = {}
      this.vocabularySheet = {}
      this.selectedVolumeNumber = -1
    }

    const contentElement = Interface.createDiv('content')

    // Add buttons.
    const seriesButtonsDiv = Interface.createDiv('series-buttons')
    seriesButtonsDiv.appendChild(Interface.createButton('show-series', 'Series', () => { Interface.showSeriesSection('series') }))
    const showVolumesButton = Interface.createButton('show-volumes', 'Volumes', () => { Interface.showSeriesSection('volumes') })
    showVolumesButton.style.color = 'blue'
    seriesButtonsDiv.appendChild(showVolumesButton)
    seriesButtonsDiv.appendChild(Interface.createButton('show-templates', 'Templates', () => { Interface.showSeriesSection('templates') }))
    seriesButtonsDiv.appendChild(Interface.createButton('show-vocabulary', 'Vocabulary', () => { Interface.showSeriesSection('vocabulary') }))

    contentElement.appendChild(seriesButtonsDiv)

    // Add series section.
    const seriesDiv = Interface.createDiv('series', 'none')
    seriesDiv.appendChild(Interface.createLabel('book-title', 'Title'))
    seriesDiv.appendChild(Interface.createInput('book-title', 'bookTitle', this.bookTitle, this.syncValue(this)))
    seriesDiv.appendChild(Interface.createLabel('book-emoji', 'Emoji'))
    seriesDiv.appendChild(Interface.createInput('book-emoji', 'bookEmoji', this.bookEmoji, this.syncValue(this)))
    seriesDiv.appendChild(Interface.createLabel('book-club', 'Club'))

    const bookClubSelect = document.createElement('select')
    bookClubSelect.id = 'kfbc-book-club'
    bookClubSelect.setAttribute('name', 'bookClub')
    const emptyOption = document.createElement('option')
    bookClubSelect.appendChild(emptyOption)
    const absoluteBeginnerOption = document.createElement('option')
    absoluteBeginnerOption.value = 'abbc'
    absoluteBeginnerOption.textContent = 'Absolute Beginner'
    bookClubSelect.appendChild(absoluteBeginnerOption)
    const beginnerOption = document.createElement('option')
    beginnerOption.value = 'bbc'
    beginnerOption.textContent = 'Beginner'
    bookClubSelect.appendChild(beginnerOption)
    const intermediateOption = document.createElement('option')
    intermediateOption.value = 'ibc'
    intermediateOption.textContent = 'Intermediate'
    bookClubSelect.appendChild(intermediateOption)
    const advancedOption = document.createElement('option')
    advancedOption.value = 'abc'
    advancedOption.textContent = 'Advanced'
    bookClubSelect.appendChild(advancedOption)
    bookClubSelect.value = this.bookClub
    bookClubSelect.addEventListener('input', this.syncValue(this))
    seriesDiv.appendChild(bookClubSelect)

    seriesDiv.appendChild(Interface.createLabel('series-home-thread', 'Home Thread'))
    seriesDiv.appendChild(Interface.createInput('series-home-thread', 'seriesHomeThread', this.seriesHomeThread, this.syncValue(this)))
    seriesDiv.appendChild(Interface.createLabel('short-date-format', 'Short date format'))
    seriesDiv.appendChild(Interface.createInput('short-date-format', 'shortDateFormat', this.shortDateFormat, this.syncValue(this)))
    seriesDiv.appendChild(Interface.createLabel('long-date-format', 'Long date format'))
    seriesDiv.appendChild(Interface.createInput('long-date-format', 'longDateFormat', this.longDateFormat, this.syncValue(this)))
    seriesDiv.appendChild(Interface.createLabel('chapter-number-prefix', 'Chapter # prefix'))
    seriesDiv.appendChild(Interface.createInput('chapter-number-prefix', 'chapterNumberPrefix', this.chapterNumberPrefix, this.syncValue(this)))
    seriesDiv.appendChild(Interface.createLabel('chapter-number-suffix', 'Chapter # suffix'))
    seriesDiv.appendChild(Interface.createInput('chapter-number-suffix', 'chapterNumberPrefix', this.chapterNumberSuffix, this.syncValue(this)))
    contentElement.appendChild(seriesDiv)

    // Add vocabulary section.
    const vocabularyDiv = Interface.createDiv('vocabulary')
    vocabularyDiv.style.display = 'none'

    const showTitleRowLabel = Interface.createLabel('show-title-row')
    vocabularyDiv.appendChild(showTitleRowLabel)
    showTitleRowLabel.appendChild(Interface.createInput('show-title-row', 'showTitleRow', this.vocabularySheet.showTitleRow, this.syncValue(this.vocabularySheet), 'checkbox'))
    showTitleRowLabel.appendChild(document.createTextNode(' Show title row'))
    vocabularyDiv.appendChild(showTitleRowLabel)

    const useBandingLabel = Interface.createLabel('use-banding')
    vocabularyDiv.appendChild(useBandingLabel)
    useBandingLabel.appendChild(Interface.createInput('use-banding', 'useBanding', this.vocabularySheet.useBanding, this.syncValue(this.vocabularySheet), 'checkbox'))
    useBandingLabel.appendChild(document.createTextNode(' Alternate row colors'))
    vocabularyDiv.appendChild(useBandingLabel)

    const colorUnsureUnknownLabel = Interface.createLabel('color-unsure-unknown')
    vocabularyDiv.appendChild(colorUnsureUnknownLabel)
    colorUnsureUnknownLabel.appendChild(Interface.createInput('color-unsure-unknown', 'colorUnsureUnknown', this.vocabularySheet.colorUnsureUnknown, this.syncValue(this.vocabularySheet), 'checkbox'))
    colorUnsureUnknownLabel.appendChild(document.createTextNode(' Color unsure and unknown'))
    vocabularyDiv.appendChild(colorUnsureUnknownLabel)

    const colorPageNumbersLabel = Interface.createLabel('color-page-numbers')
    colorPageNumbersLabel.setAttribute('for', 'kfbc-color-page-numbers')
    vocabularyDiv.appendChild(colorPageNumbersLabel)
    colorPageNumbersLabel.appendChild(Interface.createInput('color-page-numbers', 'colorPageNumbers', this.vocabularySheet.colorPageNumbers, this.syncValue(this.vocabularySheet), 'checkbox'))
    colorPageNumbersLabel.appendChild(document.createTextNode(' Color page numbers'))
    vocabularyDiv.appendChild(colorPageNumbersLabel)

    contentElement.appendChild(vocabularyDiv)

    // Add volumes section.
    const volumesDiv = Interface.createDiv('volumes')
    volumesDiv.style.display = 'grid' // none
    const volumeSelectionDiv = Interface.createDiv()
    volumeSelectionDiv.appendChild(document.createTextNode('Volume: '))
    const currentVolume = this.currentVolume()
    const volumeSelect = document.createElement('select')
    volumeSelect.id = 'kfbc-volumes-list'
    volumeSelect.onchange = () => { Interface.displayVolume(volumeSelect, this) }
    for (const [volumeNumber, volume] of Object.entries(this.volumes)) {
      const volumeOption = document.createElement('option')
      volumeOption.value = `volume${volumeNumber}`
      volumeOption.textContent = `Volume ${volumeNumber}`
      if (currentVolume !== null && volumeNumber == currentVolume.volumeNumber) {
        volumeOption.setAttribute('selected', 'selected')
      }
      volumeSelect.appendChild(volumeOption)
    }

    volumeSelectionDiv.appendChild(volumeSelect)

    volumeSelectionDiv.appendChild(Interface.createButton('add-new-volume', '➕ Add a volume', () => { Interface.addNewVolume(this) }))
    // TODO: Support removing a volume.

    volumesDiv.appendChild(volumeSelectionDiv)

    const volumeButtonsDiv = Interface.createDiv('volume-buttons')

    volumeButtonsDiv.appendChild(Interface.createButton('show-volume', 'Volume', () => { Interface.showVolumeSection('volume', this) }))
    volumeButtonsDiv.appendChild(Interface.createButton('show-volume-links', 'Links', () => { Interface.showVolumeSection('links', this) }))
    volumeButtonsDiv.appendChild(Interface.createButton('show-chapters', 'Chapters', () => { Interface.showVolumeSection('chapters', this) }))
    volumeButtonsDiv.appendChild(Interface.createButton('show-weeks', 'Weeks', () => { Interface.showVolumeSection('weeks', this) }))

    // TODO: Need to add a new link to the current volume in the series object.
    volumeButtonsDiv.appendChild(Interface.createButton('add-new-volume-link', '➕ Add a link', () => { Interface.addNewVolumeLink(this) }, 'none'))
    volumeButtonsDiv.appendChild(Interface.createButton('add-new-chapter', '➕ Add a chapter', () => { Interface.addNewChapter(this) }, 'none'))
    volumeButtonsDiv.appendChild(Interface.createButton('add-new-week', '➕ Add a week', () => { Interface.addNewWeek(this) }, 'none'))
    volumesDiv.appendChild(volumeButtonsDiv)

    const volumesContainer = Interface.createDiv('volumes-container')
    const volumesInnerContainer = Interface.createDiv()

    for (const [volumeNumber, volume] of Object.entries(this.volumes)) {
      const currentVolumeNumber = (currentVolume !== null) ? currentVolume.volumeNumber : volumeNumber
      volumesInnerContainer.appendChild(volume.toHtml(this, currentVolumeNumber))
    }

    volumesContainer.appendChild(volumesInnerContainer)
    volumesDiv.appendChild(volumesContainer)

    contentElement.appendChild(volumesDiv)

    // Add templates section.
    const templatesDiv = Interface.createDiv('templates', 'none')

    const templateDiv = Interface.createDiv('add-new-template-container')
    templateDiv.appendChild(document.createTextNode('Template: '))
    const templatesListSelect = document.createElement('select')
    templatesListSelect.id = 'kfbc-templates-list'
    for (const [templateName, template] of Object.entries(this.templates)) {
      const templateOption = document.createElement('option')
      templateOption.value = templateName.replaceAll(' ', '')
      templateOption.textContent = templateName
      templatesListSelect.appendChild(templateOption)
    }
    templatesListSelect.addEventListener('input', () => {
      const templateKey = `kfbc-template-${templatesListSelect.value}`
      const templateName = templatesListSelect.options[templatesListSelect.selectedIndex].text
      const templateTables = document.getElementById('kfbc-template-tables').getElementsByTagName('table')
      for (const templateTable of templateTables) {
        templateTable.style.display = (templateTable.id === templateKey) ? 'table' : 'none'
      }
    })
    templateDiv.appendChild(templatesListSelect)
    templateDiv.appendChild(Interface.createButton('add-new-template', '➕ Add a template', () => { Interface.addNewTemplate() }))
    templateDiv.appendChild(Interface.createButton('remove-selected-template', '➖ Remove selected template', () => { Interface.removeSelectedTemplate() }))
    templatesDiv.appendChild(templateDiv)

    const templateTablesDiv = Interface.createDiv('template-tables')

    const firstTemplateName = Object.keys(this.templates)[0]
    for (const [templateName, templateMarkdown] of Object.entries(this.templates)) {
      templateTablesDiv.appendChild(Template.toHtml(templateName, templateMarkdown, templateName === firstTemplateName, series))
    }

    templatesDiv.appendChild(templateTablesDiv)

    contentElement.appendChild(templatesDiv)

    return contentElement
  }

  /**
 * Saves book club information in JSON format.
 */
  download () {
    ErrorMessage.clear()

    let filename = this.bookTitle
    if (!filename) {
      ErrorMessage.set('Cannot save without a series title.')
      return
    }

    let text = JSON.stringify(this)

    let element = document.createElement('a')
    element.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(text)}`)
    element.setAttribute('download', `${filename}.json`)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  save () {
    ErrorMessage.clear()

    if (!this.bookTitle) {
      ErrorMessage.set('Cannot save without a series title.')
      return
    }

    const bookList = document.getElementById('kfbc-book-list')

    let storageKey = storagePrefix + this.bookTitle
    localStorage.setItem(storageKey, JSON.stringify(this))

    // Add a new entry to the dropdown list.
    const isNewSeries = (bookList.selectedIndex === 0)
    if (isNewSeries) {
      let listAlreadyContainsBook = false
      for (let i = 0; i < bookList.length; ++i) {
        if (bookList[i].value === this.bookTitle) {
          listAlreadyContainsBook = true
          break
        }
      }
      if (listAlreadyContainsBook) {
        const response = confirm('There is already an entry for this book/series stored in the browser.  This entry will be replaced by the displayed book/series.')
        if (response) {
          bookList.value = this.bookTitle
        } else {
          ErrorMessage.set('Save to browser cancelled.')
          return
        }
      }
    }

    const titleChanged = (bookList.selectedIndex !== 0 && bookList.value !== this.bookTitle)

    // If the title changed, delete the old entry and update the book list.
    if (titleChanged) {
      this.deleteFromStorage(false)
    }
    if (titleChanged || isNewSeries) {
      // Add and select new book list entry
      const bookEntry = document.createElement('option')
      bookEntry.textContent = this.bookTitle
      bookList.appendChild(bookEntry)
      bookList.value = this.bookTitle
    }
  }

  deleteFromStorage (clearValues) {
    ErrorMessage.clear()

    const bookList = document.getElementById('kfbc-book-list')

    if (!clearValues) {
      const response = confirm(`The entry ${bookList.value} will be deleted from the browser.`)
      if (!response) {
        ErrorMessage.set('Delete from browser cancelled.')
        return
      }
    }

    localStorage.removeItem(`${storagePrefix}${bookList.value}`)

    bookList.remove(bookList.selectedIndex)
    bookList.selectedIndex = 0
    if (clearValues) {
      loadFromFileText('{}')
      Interface.refreshButtons()
    }
  }

}


let series = new Series('')
/* eslint-disable no-unused-vars */

const storagePrefix = 'wkbcm_'

/**
 * Checks to see if an object is a date.
 * @param {*} date The object to check.
 * @returns True if the object is a date.
 */
function isDate (date) {
  return (new Date(date) !== 'Invalid Date') && !isNaN(new Date(date))
}

/* eslint-disable no-unused-vars */

/* globals
  addChaptersTable,
  addLink,
  addTemplateListItem,
  addTemplateTable,
  addVolumeToList,
  addWeeksTable,
  displayTemplate,
  Chapter,
  isDate,
  localStorage,
  prompt,
  storagePrefix,
  templatesList,
  Volume,
  Week
*/

class Interface {
  /** Streamlined creation of div elements. */
  static createDiv (id = '', display = 'block') {
    const div = document.createElement('div')
    // TODO: Are any of these DIV IDs required, or can this be removed?
    if (id !== '') {
      div.id = `kfbc-${id}`
    }
    div.style.display = display
    return div
  }

  /** Streamlined creation of input elements. */
  static createInput (id, name, value, inputHandler, type = 'text') {
    const input = document.createElement('input')
    input.setAttribute('id', `kfbc-${id}`)
    input.setAttribute('name', name)
    input.setAttribute('type', type)
    if (type === 'checkbox') {
      input.checked = value
    } else {
      input.value = value
    }
    input.addEventListener('input', inputHandler)
    return input
  }

  /** Streamlined creation of label elements. */
  static createLabel (forId, text) {
    const label = document.createElement('label')
    label.setAttribute('for', `kfbc-${forId}`)
    label.textContent = text
    return label
  }

  /** Streamlined creation of button elements. */
  static createButton (id, text, inputHandler, display = '') {
    const button = document.createElement('button')
    button.id = `kfbc-${id}`
    button.textContent = text
    button.classList.add('btn', 'btn-icon-text', 'btn-primary', 'create')
    if (display !== '') {
      button.style.display = display
    }
    button.addEventListener('click', inputHandler)
    return button
  }

  static showBookList () {
    // TODO: Have a "new series" button that clears out current fields.  Need to request series name which cannot(?) be
    // changed after.  Or allow name change, but then the key changes, so the old entry needs to be removed at the time
    // of saving.
    const keys = Object.keys(localStorage)
    const bookList = document.getElementById('kfbc-book-list')

    for (let key of keys) {
      if (!key.startsWith(storagePrefix)) {
        continue
      }
      if (localStorage.getItem(key) == null) {
        continue
      }
      const value = JSON.parse(localStorage.getItem(key))

      const bookEntry = document.createElement('option')
      bookEntry.textContent = value.bookTitle
      bookList.appendChild(bookEntry)
    }
  }

  static refreshButtons () {
    document.getElementById('kfbc-delete-storage').disabled = document.getElementById('kfbc-book-list').selectedIndex === 0

    document.getElementById('kfbc-save-storage').disabled = false
    document.getElementById('kfbc-download-file').disabled = false
    document.getElementById('kfbc-copy-sheets-macro').disabled = false
    document.getElementById('kfbc-copy-volume-thread').disabled = false
    document.getElementById('kfbc-copy-week-thread').disabled = false
  }

  static showSeriesSection (sectionToShow) {
    const volumes = document.getElementById('kfbc-content')
    if (volumes.childElementCount === 0) {
      return
    }
    volumes.querySelector('div[id="kfbc-series"]').style.display = 'none'
    volumes.querySelector('div[id="kfbc-volumes"]').style.display = 'none'
    volumes.querySelector('div[id="kfbc-templates"]').style.display = 'none'
    volumes.querySelector('div[id="kfbc-vocabulary"]').style.display = 'none'

    volumes.querySelector('button[id="kfbc-show-series"]').style.removeProperty('color')
    volumes.querySelector('button[id="kfbc-show-volumes"]').style.removeProperty('color')
    volumes.querySelector('button[id="kfbc-show-templates"]').style.removeProperty('color')
    volumes.querySelector('button[id="kfbc-show-vocabulary"]').style.removeProperty('color')

    volumes.querySelector(`div[id="kfbc-${sectionToShow}"]`).style.display = 'grid'
    volumes.querySelector(`button[id="kfbc-show-${sectionToShow}"]`).style.color = 'blue'
  }

  static showVolumeSection (sectionToShow, seriesREMOVEME) {
    const volume = series.volumes[document.getElementById('kfbc-volumes-list').value.replace('volume', '')]

    Array.from(['volume', 'links', 'chapters', 'weeks']).forEach(function (name) {
      const elementByName = document.querySelector(`div[id="kfbc-volume${volume.volumeNumber}"] div[name="kfbc-${name}"]`)
      if (elementByName === null) {
        return
      }
      elementByName.style.display = 'none'
    })

    // Hide add buttons except for what's for the current section.
    document.getElementById('kfbc-add-new-volume-link').style.display = 'none'
    document.getElementById('kfbc-add-new-chapter').style.display = 'none'
    document.getElementById('kfbc-add-new-week').style.display = 'none'

    let display = 'grid'

    let sectionButtonName = null
    switch (sectionToShow) {
      case 'links':
        sectionButtonName = 'kfbc-add-new-volume-link'
        display = 'block'
        break
      case 'chapters':
        sectionButtonName = 'kfbc-add-new-chapter'
        display = 'block'
        break
      case 'weeks':
        sectionButtonName = 'kfbc-add-new-week'
        display = 'block'
        break
    }
    if (sectionButtonName != null) {
      document.getElementById(sectionButtonName).style.removeProperty('display')
    }

    // TODO: Handle if querySelector does not return a value.
    document.querySelector(`div[id="kfbc-volume${volume.volumeNumber}"] div[name="kfbc-${sectionToShow}"]`).style.display = display
  }

  static allVolumes () {
    return document.getElementsByClassName('kfbc-volume-container')
  }

  /** Returns the current volume's container element. */
  static currentVolume () {
    const volumeElements = Interface.allVolumes()
    let currentElement = null

    Array.from(volumeElements).forEach(function (element) {
      if (element.style.display === 'none') {
        return
      }
      currentElement = element
    })

    return currentElement
  }

  static addNewVolume (series) {
    // Add a new volume to the volumes list.
    const volumesList = document.getElementById('kfbc-volumes-list')
    const volumesListItems = volumesList.getElementsByTagName('option')
    let lastVolumeNumber = 0
    if (0 < volumesListItems.length) {
      lastVolumeNumber = volumesListItems[volumesListItems.length - 1].value.replace('volume', '')
    }
    const newVolumeNumber = Number(lastVolumeNumber) + 1

    series.volumes[newVolumeNumber] = new Volume(newVolumeNumber)
    series.selectedVolumeNumber = newVolumeNumber

    const volumesElement = document.getElementById('kfbc-volumes-container')
    volumesElement.appendChild(series.volumes[newVolumeNumber].toHtml(series, newVolumeNumber))

    addVolumeToList(volumesList, newVolumeNumber, true)
    Interface.displayVolume(volumesList, series)
  }

  /** Hide all volumes except for the one to show. */
  static displayVolume (volumeList, series) {
    const volumes = Interface.allVolumes()
    Array.from(volumes).forEach(function (element) {
      console.log()
      console.log(element)
      console.log(element.id)
      console.log(volumeList.value)
      if (volumeList.value === element.id.replace('kfbc-', '')) {
        element.style.removeProperty('display')
        // TODO: Add the volume number as a dataset value on the element.
        // eslint-disable-next-line no-global-assign, no-native-reassign
        series.selectedVolumeNumber = element.id.replace('kfbc-volume', '')
      } else {
        element.style.display = 'none'
      }
    })

    console.log('displayVolume<3>')
    // Switch view to volume.
    Interface.showVolumeSection('volume')
  }

  // TODO: When updating a chapter number, it needs to update in the dataset and the series object.
  static addNewChapter (series) {
    const selectedVolume = series.selectedVolume()
    const chaptersContainer = document.querySelector(`div[id="kfbc-volume${selectedVolume.volumeNumber}"] table[name="kfbc-chapters"]`)
    const tableBody = chaptersContainer.getElementsByTagName('tbody')[0]
    let lastChapterNumber = Object.keys(selectedVolume.chapters).pop()
    if (lastChapterNumber === undefined) {
      // Get the last numeric chapter from the prior volume if available.
      if ((selectedVolume.volumeNumber - 1) in series.volumes) {
        lastChapterNumber = Object.keys(series.volumes[selectedVolume.volumeNumber - 1].chapters).pop()
      }
    }
    let newChapterNumber = 1
    if (!isNaN(lastChapterNumber)) {
      newChapterNumber = Number(lastChapterNumber) + 1
    }
    selectedVolume.chapters[newChapterNumber] = new Chapter(newChapterNumber)
    tableBody.appendChild(selectedVolume.chapters[newChapterNumber].toHtml(series))
  }

  static addNewVolumeLink (series) {
    // TODO: Use a modal for this.
    let linkAddress = prompt('Enter address to add:')

    if (linkAddress === null) {
      return
    }

    // TODO: Add to series object.
    addLink(linkAddress)
  }

  static addNewWeek (series) {
    const selectedVolume = series.selectedVolume()
    const weeksContainer = document.querySelector(`div[id="kfbc-volume${selectedVolume.volumeNumber}"] table[name="kfbc-weeks"]`)
    const tableBody = weeksContainer.getElementsByTagName('tbody')[0]
    // TODO: Handle if there are no prior weeks.
    let lastWeekNumber = Object.keys(selectedVolume.weeks).pop()
    let newWeekNumber = 1
    if (lastWeekNumber !== undefined) {
      newWeekNumber = Number(lastWeekNumber) + 1
    }
    // Add a week to the date.
    selectedVolume.weeks[newWeekNumber] = new Week(newWeekNumber)
    if (lastWeekNumber !== undefined && isDate(selectedVolume.weeks[lastWeekNumber].startDate)) {
      let thisWeekStartDate = new Date(Date.parse(selectedVolume.weeks[lastWeekNumber].startDate) + 7 * 24 * 60 * 60 * 1000)
      selectedVolume.weeks[newWeekNumber].startDate = thisWeekStartDate.toISOString()
    }
    tableBody.appendChild(selectedVolume.weeks[newWeekNumber].toHtml(series))
  }

  static removeVolumeLink (element) {
    element.parentNode.parentNode.remove()
  }

  static addNewTemplate () {
    // Add a new template to the templates list.  Ask for template name.

    // Ask for the name of the template.
    // TODO: Disallow any characters that will cause an issue for templates.  Maybe allow only alphanumeric characters?
    let newTemplateName = prompt('Name of new template:')
    if (newTemplateName == null || newTemplateName.trim() === '') {
      return
    }

    // Remove leading and trailing whitespace to ensure it doesn't cause any issues.
    newTemplateName = newTemplateName.trim()

    addTemplateTable(newTemplateName, '', true)
    addTemplateListItem(newTemplateName, true)
    // Are the two following lines needed?
    const templatesList = document.getElementById('kfbc-templates-list')
    displayTemplate(templatesList)

    // TODO: Add a template to all selects with the name "volumeTemplate".
  }

  static removeSelectedTemplate () {
    // TODO: Remove selected template.
    // TODO: Disable remove button.
    // TODO: Enable remove button when a template has been selected.

    const templatesList = document.getElementById('kfbc-templates-list')

    // Remove the template table.
    const templateTableId = `kfbc-template-${templatesList.value}`
    const table = document.getElementById(templateTableId)
    if (table != null) {
      table.remove()
    }

    // Remove from the template list.
    for (var i = 0; i < templatesList.length; i++) {
      if (templatesList.options[i].selected) {
        templatesList.remove(i)
        break
      }
    }

    // Select the first template from the list.
    if (0 < templatesList.childElementCount) {
      templatesList.firstChild.selected = true
      displayTemplate(templatesList)
    }

    // TODO: Remove the template from all selects with the name "volumeTemplate".
  }
}

/* eslint-disable no-unused-vars */

/* globals
  Interface
*/

class Chapter {
  constructor (chapterNumber) {
    this.chapterNumber = chapterNumber.toString()
    this.number = chapterNumber.toString()
    this.title = ''
  }

  static fromJson (json) {
    let chapter = new Chapter(json.number)
    chapter.title = json.title

    return chapter
  }

  syncValue (object) {
    return function () {
      object[this.name] = this.value
    }
  }

  toHtml (series) {
    const tableRow = document.createElement('tr')
    tableRow.dataset.number = this.number

    const numberCell = document.createElement('td')
    numberCell.appendChild(Interface.createInput('number', 'number', this.number, this.syncValue(this)))
    tableRow.appendChild(numberCell)

    const titleCell = document.createElement('td')
    titleCell.appendChild(Interface.createInput('title', 'title', this.title, this.syncValue(this)))
    tableRow.appendChild(titleCell)

    const removeCell = document.createElement('td')
    removeCell.textContent = '➖'
    removeCell.classList.add('kfbc-clickable')
    removeCell.addEventListener('click', () => { this.removeChapter(removeCell, series) })
    tableRow.appendChild(removeCell)

    return tableRow
  }

  removeChapter (element, series) {
    const selectedVolume = series.selectedVolume()
    const chapterNumber = element.parentElement.dataset.number
    if (chapterNumber in selectedVolume.chapters) {
      delete selectedVolume.chapters[chapterNumber]
    }
    element.parentElement.remove()
  }
}


/* eslint-disable no-unused-vars */

class ErrorMessage {
  static set (message) {
    if (message !== '') {
      message = `Error: ${message}`
    }

    document.getElementById('kfbc-errors').textContent = message
  }
  static clear () {
    document.getElementById('kfbc-errors').textContent = ''
  }
}

/* eslint-disable no-unused-vars */

/* globals
  ErrorMessage
*/

// TODO: Handle error when there is no "currentVolume" due to no dates set in the weeks.

class Macro {
  // TODO: Support different templates for the guidelines sheet.
  // TODO: Lock the guidelines sheet.
  // TODO: Support an option for whether or not to include the title row.

  static copySheetsMacro (series) {
    navigator.clipboard.writeText('')
    ErrorMessage.clear()

    // Create a new Google Sheet document.
    // Select the "Extentions" menu, then the "Apps Scripts" submenu.
    // This should open a new tab, showing an untitled project in Apps Scripts.
    // There should be a function named myFunction() already created.
    // Paste the copied text into this function.
    // Click on "Run" button.  You will need to give the Apps Script access to the Sheets document.

    const currentVolume = series.nextVolume()

    let macroCode = ''

    macroCode += `
var workbook = SpreadsheetApp.getActive();

// Delete existing sheets except for the first sheet.  This normally isn't needed, but can be useful when rerunning the script on the same Sheets document after modifying book club values.
var sheets = workbook.getSheets();
for (i = 1; i < sheets.length; i++) {
  workbook.deleteSheet(sheets[i]);
}
sheets[0].setName('Remove Me');
`

    // For now, assume we're going with one spreadsheet per chapter.  Missing support: Weekly where multiple chapters are on one sheet, and weekly where split chapters put one chapter across multiple sheets.

    for (const chapterKey in currentVolume.chapters) {
      const chapter = currentVolume.chapters[chapterKey]
      const chapterNumber = ((series.chapterNumberPrefix == null) ? 'Chapter ' : series.chapterNumberPrefix) + chapterKey + series.chapterNumberSuffix
      macroCode += Macro.insertChapterSheet(chapter, chapterNumber, series.vocabularySheet)
    }

    macroCode += Macro.insertGuidelinesSheet()

    macroCode += `
// Remove the initial sheet.
workbook.deleteSheet(SpreadsheetApp.getActive().getSheetByName('Remove Me'));
`

    navigator.clipboard.writeText(macroCode)
    console.log(macroCode)
  }

  static insertChapterSheet (chapter, chapterNumber, vocabularySheet) {
    let chapterSheetMacroCode = ''

    chapterSheetMacroCode += `
chapterSheet = workbook.insertSheet('` + chapterNumber + `');

// Remove excess colums.
chapterSheet.deleteColumns(6, 21);

// Set the widths of columns.
chapterSheet.setColumnWidth(1, 120);
chapterSheet.setColumnWidth(2, 150);
chapterSheet.setColumnWidth(3, 350);
chapterSheet.setColumnWidth(4, 50);
chapterSheet.setColumnWidth(5, 570);

var currentRow = 1;
`

    if (vocabularySheet.showTitleRow) {
      chapterSheetMacroCode += `
// This format uses a header row with the chapter's number and title.
chapterSheet.getRange('A1:E1').mergeAcross();
chapterSheet.setRowHeight(1, 40);
// TODO: Test if this is working when there is an apostrophe in the title.
chapterSheet.getRange(1, 1)
  .setValue('　${chapterNumber} ${chapter.title.replaceAll("'", "\\\'")}')
  .setFontSize(18)
  .setFontWeight("bold")
  .setVerticalAlignment('middle');
currentRow++;
`
    }

    chapterSheetMacroCode += `
// Freeze header.
chapterSheet.setFrozenRows(currentRow);

// Populate header row values.
chapterSheet.getRange(currentRow, 1).setValue('Vocab (Kanji)');
chapterSheet.getRange(currentRow, 2).setValue('Vocab (Kana)');
chapterSheet.getRange(currentRow, 3).setValue('Meaning');
chapterSheet.getRange(currentRow, 4).setValue('Page #');
chapterSheet.getRange(currentRow, 5).setValue('Notes');

// Format header row.
chapterSheet.getRange(currentRow, 1, 1, 5)
  .setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID)
  .setFontWeight("bold")
  .setHorizontalAlignment('center');

// Set font defaults.
chapterSheet.getRange(currentRow, 1, chapterSheet.getMaxRows() - currentRow, 2)
  .setFontSize(12)
  .setFontFamily('Zen Kaku Gothic New');
`

    const firstRow = vocabularySheet.showTitleRow ? 3 : 2
    let lastRow = 1000
    if (vocabularySheet.useBanding) {
      chapterSheetMacroCode += Macro.insertBanding(firstRow - 1, firstRow)
    }
    chapterSheetMacroCode += Macro.insertConditionalFormatting(firstRow, lastRow, vocabularySheet)

    return chapterSheetMacroCode
  }

  static insertBanding (firstRow, lastRow) {
    let banding = ''
    // TODO: Properly handle column letters.
    banding += `

chapterSheet.getRange('A` + firstRow + `:E` + lastRow + `')
  .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY)
`

    return banding
  }

  static insertConditionalFormatting (firstRow, lastRow, vocabularySheet) {
    let conditionalFormatting = ''
    conditionalFormatting += `
var conditionalFormatRules = chapterSheet.getConditionalFormatRules();
`
    // TODO: Allow selecting which conditional formatting to use.
    if (vocabularySheet.colorUnsureUnknown) { // use unknown and unsure row colors
      conditionalFormatting += Macro.insertUnsureAndUnknownConditionalFormatting(firstRow, lastRow)
    }
    if (vocabularySheet.colorPageNumbers) { // use pastel page numbers
      conditionalFormatting += Macro.insertPastelPageNumbersConditionalFormatting(firstRow, lastRow)
    }
    conditionalFormatting += `
chapterSheet.setConditionalFormatRules(conditionalFormatRules);
`

    return conditionalFormatting
  }

  static insertUnsureAndUnknownConditionalFormatting (firstRow, lastRow) {
  // TODO: Find a better way to handle column letters.
    let kanjiColumn = 'A'
    let kanaColumn = 'B'
    let englishColumn = 'C'
    let pageColumn = 'D'
    let notesColumn = 'E'

    return `
conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('` + kanjiColumn + firstRow + `:` + notesColumn + lastRow + `')])
  .whenFormulaSatisfied('=AND(ISTEXT($` + kanaColumn + firstRow + `),ISBLANK($` + englishColumn + firstRow + `),ISNUMBER($` + pageColumn + firstRow + `))')
  .setBackground('#E06666')
  .build());
conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('` + kanjiColumn + firstRow + `:` + notesColumn + lastRow + `')])
  .whenFormulaSatisfied('=SEARCH("unsure",$` + notesColumn + firstRow + `,1)')
  .setBackground('#FFD966')
  .build());
conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('` + kanjiColumn + firstRow + `:` + notesColumn + lastRow + `')])
  .whenFormulaSatisfied('=AND(ISTEXT($` + kanjiColumn + firstRow + `),ISBLANK($` + kanaColumn + firstRow + `),ISNUMBER($` + pageColumn + firstRow + `))')
  .setBackground('#E06666')
  .build());
`
  }

  static insertPastelPageNumbersConditionalFormatting (firstRow, lastRow) {
    return `
conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('D` + firstRow + `:D` + lastRow + `')])
  .whenCellEmpty()
  .build());

conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('D` + firstRow + `:D` + lastRow + `')])
  .whenFormulaSatisfied('=MOD(count(unique($D$` + firstRow + `:D` + firstRow + `)),6)=1')
  .setBackground('#F4CCCC')
  .build());

conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('D` + firstRow + `:D` + lastRow + `')])
  .whenFormulaSatisfied('=MOD(count(unique($D$` + firstRow + `:D` + firstRow + `)),6)=2')
  .setBackground('#FCE5CD')
  .build());

conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('D` + firstRow + `:D` + lastRow + `')])
  .whenFormulaSatisfied('=MOD(count(unique($D$` + firstRow + `:D` + firstRow + `)),6)=3')
  .setBackground('#FFF2CC')
  .build());

conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('D` + firstRow + `:D` + lastRow + `')])
  .whenFormulaSatisfied('=MOD(count(unique($D$` + firstRow + `:D` + firstRow + `)),6)=4')
  .setBackground('#D9EAD3')
  .build());

conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('D` + firstRow + `:D` + lastRow + `')])
  .whenFormulaSatisfied('=MOD(count(unique($D$` + firstRow + `:D` + firstRow + `)),6)=5')
  .setBackground('#D0E0E3')
  .build());

conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([chapterSheet.getRange('D` + firstRow + `:D` + lastRow + `')])
  .whenFormulaSatisfied('=MOD(count(unique($D$` + firstRow + `:D` + firstRow + `)),6)=0')
  .setBackground('#D9D2E9')
  .build());
`
  }

  static insertGuidelinesSheet () {
    let guidelinesSheetMacroCode = `
// Create the guidelines sheet.
guidelinesSheet = workbook.insertSheet('Guidelines', 1);

// Remove excess colums and rows.
guidelinesSheet.deleteColumns(2, 25);
guidelinesSheet.deleteRows(12, 989);

guidelinesSheet.setColumnWidth(1, 1212);
guidelinesSheet.getRange(1, 1, 9, 1).setFontSize(11);
guidelinesSheet.getRange(1, 1, 11, 1).setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);

// Populate guidelines.

guidelinesSheet.getRange(1, 1).setRichTextValue(SpreadsheetApp.newRichTextValue()
  .setText('How to contribute to this vocab sheet\\n\\nThe more people contribute to the vocab sheet, the more helpful it is for everyone, so please don’t feel shy about adding to it!\\n\\nPlease read these guidelines carefully before you start adding words so that the vocab sheet remains easy for everyone to read and use.')
  .setTextStyle(0, 37, SpreadsheetApp.newTextStyle().setBold(true).setUnderline(true).build())
  .setTextStyle(169, 208, SpreadsheetApp.newTextStyle().setBold(true).build())
  .setTextStyle(208, 214, SpreadsheetApp.newTextStyle().setBold(true).setUnderline(true).build())
  .build());

guidelinesSheet.getRange(3, 1).setRichTextValue(SpreadsheetApp.newRichTextValue()
  .setText('When to add an entry\\nIf you are reasonably confident of the word itself and the appropriate meanings or translation within the context, go for it!\\n\\nIf you are unsure of a word’s meaning, feel free to add it to the vocab sheet, but type "Unsure" into the Notes column. This will automatically highlight the row in yellow to alert folks that the word may require attention. Similarly, if you’ve tried hard but still cannot find the meaning or the reading of a word, feel free to add it without a definition/reading, and put in the page number where the word was found. This will automatically highlight the word in red to alert folks that this word requires extra attention.*\\n\\nTry not to add the same word more than once in a given week’s reading.')
  .setTextStyle(0, 20, SpreadsheetApp.newTextStyle().setBold(true).setUnderline(true).build())
  .setTextStyle(148, 185, SpreadsheetApp.newTextStyle().setBold(true).build())
  .setTextStyle(313, 319, SpreadsheetApp.newTextStyle().setBold(true).setForegroundColor('#fbbc04').build())
  .setTextStyle(612, 616, SpreadsheetApp.newTextStyle().setBold(true).setForegroundColor('#ea4335').build())
  .build());

guidelinesSheet.getRange(5, 1).setRichTextValue(SpreadsheetApp.newRichTextValue()
  .setText('What to add\\n\\nPlease add all words in dictionary form.\\nFor example, if the book uses 行きます, please enter 行く. If the book uses 寒かった, please enter 寒い.\\n\\nIn the \\'kana\\' column, please enter the kana used in the book.\\n\\nIn General: Grammar is not vocabulary and should NOT be included in this list.  Please use the forums to ask/post grammar related questions.')
  .setTextStyle(0, 11, SpreadsheetApp.newTextStyle().setBold(true).setUnderline(true).build())
  .setTextStyle(37, 52, SpreadsheetApp.newTextStyle().setBold(true).build())
  .setTextStyle(211, 351, SpreadsheetApp.newTextStyle().setBold(true).setItalic(true).build())
  .build());

guidelinesSheet.getRange(7, 1).setRichTextValue(SpreadsheetApp.newRichTextValue()
  .setText('How to define words\\n\\nTo keep things consistent, please use definitions from Jisho or a similar JP > EN dictionary.\\n\\nPlease only include the relevant meanings for the context, and remove alternative spellings (e.g. keep only "colour" or "color", not both).\\n\\nFor clarity\\'s sake, there should never be enough meanings that it wraps onto a second line; remove meanings to keep the length to one column-width maximum. If there is no way around a longer definition wrapping onto a second line, that is acceptable. Just keep it reasonable.')
  .setTextStyle(0, 19, SpreadsheetApp.newTextStyle().setBold(true).setUnderline(true).build())
  .setTextStyle(123, 157, SpreadsheetApp.newTextStyle().setBold(true).build())
  .setTextStyle(179, 207, SpreadsheetApp.newTextStyle().setBold(true).build())
  .setTextStyle(368, 411, SpreadsheetApp.newTextStyle().setBold(true).build())
  .build());

guidelinesSheet.getRange(9, 1).setRichTextValue(SpreadsheetApp.newRichTextValue()
  .setText('General Tips\\n\\nUse the notes column to add helpful or interesting information, such as if the word used in the book is colloquial, or from a particular dialect.\\n\\nDouble-click into a cell before pasting to enter unformatted text.')
  .setTextStyle(0, 14, SpreadsheetApp.newTextStyle().setBold(true).setUnderline(true).build())
  .setTextStyle(161, 173, SpreadsheetApp.newTextStyle().setBold(true).build())
  .build());

guidelinesSheet.getRange(11, 1).setRichTextValue(SpreadsheetApp.newRichTextValue()
  .setText('*Note: If you are having problems with this function, or you simply don\\'t want this kind of formatting in the sheet, you can duplicate the unformatted sheet instead! This will mean that any cell highlights for entries requiring extra attention will have to be highlighted manually.\\n\\nIf the function is not working as intended, please make a post describing the issue in the Tips for Running a WaniKani Book Club on the forums!')
  .setTextStyle(1, 5, SpreadsheetApp.newTextStyle().setBold(true).setUnderline(true).build())
  .setTextStyle(244, 283, SpreadsheetApp.newTextStyle().setBold(true).build())
  .setTextStyle(374, 411, SpreadsheetApp.newTextStyle().setForegroundColor('#1155cc').setUnderline(true).build())
  .build());

var protection = guidelinesSheet
  .protect()
  .setDescription('Guidelines');
`

    return guidelinesSheetMacroCode
  }
}

/* eslint-disable no-unused-vars */

/* globals
  ErrorMessage,
  Interface,
  isDate
*/

// TODO: need template dropdowns to update when adding/deleting a template

class Template {

  static simulateButtonClick(buttonElement, title, body) {
    // Trigger the button click.
    buttonElement.click()

    // Set up a MutationObserver to watch for the created textarea.
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (!document.querySelector('textarea[id^="ember"].d-editor-input')) {
          return
        }

        // Disconnect the observer once the textarea is created.
        observer.disconnect()

        if (title !== null) {
          Template.copySubjectToReplyBox(title)
        }
        Template.copyTextToClipboardOrReplyBox(body)

      })
    })

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true })
  }

  static openButtonAndPopulate(title, body) {

    // If there is a textarea already, use it.
    if (Template.copyTextToClipboardOrReplyBox(body)) {
      Template.copySubjectToReplyBox(title)
      return
    }

    // Open a new thread if possible.
    const newThreadButton = document.querySelector('#create-topic')
    if (newThreadButton !== null) {
      Template.simulateButtonClick(
        newThreadButton,
        title,
        body)
      return
    }

    // Open a new reply if possible.
    const replyButton = document.querySelector('.reply-to-post')
    if (replyButton !== null) {
      Template.simulateButtonClick(
        replyButton,
        null,
        body)
      return
    }

  }

  static copySubjectToReplyBox (template) {
    // If this is on a Discourse forum and there is an open post textbox, replace the subject with the template text.  Otherwise, do nothing.

    const discourseTopicTitleTextbox = document.querySelector('#reply-title')
    if (discourseTopicTitleTextbox === null) {
      return
    }

    discourseTopicTitleTextbox.value = template
  }

  static copyTextToClipboardOrReplyBox (template) {
    // If this is on a Discourse forum and there is an open post textbox, replace its contents with the template text.  Otherwise, copy text to clipboard.

    const discourseTextArea = document.querySelector('textarea[id^="ember"].d-editor-input')
    if (discourseTextArea === null) {
      navigator.clipboard.writeText(template)
      return false
    }

    discourseTextArea.value = template
    discourseTextArea.dispatchEvent(new Event('input', { bubbles: true }))

    return true
  }

  static copyVolumeThread (series) {
    navigator.clipboard.writeText('')
    ErrorMessage.clear()

    const currentVolume = series.nextVolume()
    if (currentVolume === null) {
      ErrorMessage.set("Add the next volume and its first week's start date to copy template.")
      return
    }

    let template = series.templates[currentVolume.volumeTemplate]
    if (undefined === template) {
      ErrorMessage.set('A volume template needs to be selected first.')
      return
    }

    template = template.replaceAll('{Book Title}', series.bookTitle)
    template = template.replace('{Book Image}', currentVolume.coverImage)
    template = template.replace('{Volume Number}', currentVolume.volumeNumber)
    const startDate = currentVolume.startDate()
    if (isDate(startDate)) {
      template = template.replace('{Volume Start Date}', startDate)
      template = template.replace('{Volume Start Timestamp}', `[date=${(new Date(startDate)).toISOString().split('T')[0]} timezone="Japan"]`)
    }
    template = Template.formatVolumeThreadJoin(template, series)
    template = Template.formatVolumeThreadWhereToBuy(template)
    template = Template.formatVolumeThreadReadingSchedule(template, currentVolume.weeks, currentVolume.chapters, series.shortDateFormat)
    template = Template.formatVolumeThreadVocabularyList(template, currentVolume)
    template = Template.formatVolumeThreadDiscussionRules(template)
    template = template.replaceAll('{Series Home Link}', `https://community.wanikani.com/t/${series.seriesHomeThread}`)

    Template.openButtonAndPopulate(`${series.bookTitle} Volume ${currentVolume.volumeNumber}`, template)

  }

  static copyWeekThread (series) {
    navigator.clipboard.writeText('')
    ErrorMessage.clear()

    let currentVolume = series.currentVolume()
    if (currentVolume === null) {
      console.log('Could not find current volume.')
      return
    }

    // Determine the current week based on the date.  The week's start date should be between "today - 6 days" and "today + 6 days".
    let currentWeek = currentVolume.currentWeek()

    if (currentWeek === undefined) {
    // It's possible this is the first week of a new volume.
      currentVolume = series.nextVolume()
      currentWeek = currentVolume.currentWeek()
    }

    if (currentWeek === undefined) {
    // TODO: Show an error message about being unable to determine the week?  Or else ask for week number?
      console.log('Could not find current week.')
      return
    }

    const weekChapters = []
    for (const chapterKey in currentVolume.chapters) {
      if (!currentWeek.chapters.includes(chapterKey)) {
        continue
      }
      weekChapters.push(chapterKey)
    }
    // If there are no chapters defined, get the chapter numbers from the week definition.
    if (weekChapters.length === 0) {
      for (const weekKey in currentWeek.chapters) {
        weekChapters.push(currentWeek.chapters[weekKey])
      }
    }

    let template = series.templates[currentVolume.weeklyTemplate]
    if (undefined === template) {
      ErrorMessage.set('A weekly template needs to be selected first.')
      return
    }

    let chaptersText = ''

    // TODO: Is this necessary?
    if (series.chapterNumberPrefix === null) {
      series.chapterNumberPrefix = ''
    }
    if (series.chapterNumberSuffix === null) {
      series.chapterNumberSuffix = ''
    }

    switch (weekChapters.length) {
      case 0:
        break
      case 1:
        chaptersText = ((series.chapterNumberPrefix === '') ? 'Chapter ' : series.chapterNumberPrefix) + weekChapters[0] + series.chapterNumberSuffix
        // TODO: Handle this properly.
        const showTitle = 0 < weekChapters.length && 0 < Object.keys(currentVolume.chapters).length && currentVolume.chapters[weekChapters[0]].title !== ''
        if (showTitle) {
          chaptersText += '　' + currentVolume.chapters[weekChapters[0]].title
        }

        break
      case 2:
        chaptersText = ((series.chapterNumberPrefix === '') ? 'Chapters ' : series.chapterNumberPrefix) + weekChapters.join(' and ') + series.chapterNumberSuffix
        break
      default:
        chaptersText = ((series.chapterNumberPrefix === '') ? 'Chapter ' : series.chapterNumberPrefix) + weekChapters[0] + '–' + weekChapters[weekChapters.length - 1] + series.chapterNumberSuffix
    }
    template = template.replaceAll('{Chapters}', chaptersText.trim())

    template = template.replace('{Week Number}', currentWeek.number)
    template = template.replace('{Week Start Page}', currentWeek.startPage)
    template = template.replace('{Week End Page}', currentWeek.endPage)
    template = template.replace('{Week Start Date}', Template.formatDate(currentWeek.startDate, series.shortDateFormat))
    template = template.replace('{Week Start Timestamp}', `[date=${(new Date(currentWeek.startDate)).toISOString().split('T')[0]} timezone="Japan"]`)

    Template.openButtonAndPopulate(null, template)
  }

  static formatDate (unparsedDate, format) {
  // Get local time offset and add it to the date to avoid a timezone date difference.
    const parsedLocalDate = new Date(unparsedDate)

    let output = ''
    let remainingFormat = format
    while (0 < remainingFormat.length) {
      if (remainingFormat.startsWith('DD')) {
        output += ('0' + parsedLocalDate.getUTCDate()).slice(-2)
        remainingFormat = remainingFormat.substring(2)
      } else if (remainingFormat.startsWith('D')) {
        output += parsedLocalDate.getUTCDate()
        remainingFormat = remainingFormat.substring(1)
      } else if (remainingFormat.startsWith('YYYY')) {
        output += parsedLocalDate.getFullYear()
        remainingFormat = remainingFormat.substring(4)
      } else if (remainingFormat.startsWith('YY')) {
        output += ('' + parsedLocalDate.getFullYear()).slice(-2)
        remainingFormat = remainingFormat.substring(2)
      } else if (remainingFormat.startsWith('MMMM')) {
        output += parsedLocalDate.toLocaleString('default', { month: 'long' })
        remainingFormat = remainingFormat.substring(4)
      } else if (remainingFormat.startsWith('MMM')) {
        output += parsedLocalDate.toLocaleString('default', { month: 'short' })
        remainingFormat = remainingFormat.substring(3)
      } else if (remainingFormat.startsWith('MM')) {
        output += ('0' + parsedLocalDate.getUTCMonth()).slice(-2)
        remainingFormat = remainingFormat.substring(2)
      } else if (remainingFormat.startsWith('M')) {
        output += parsedLocalDate.getUTCMonth()
        remainingFormat = remainingFormat.substring(1)
      } else {
        output += remainingFormat.substring(0, 1)
        remainingFormat = remainingFormat.substring(1)
      }
    }

    return output
  }

  static formatVolumeThreadJoin (template, series) {
    let clubName = 'Unknown'
    let clubID = ''
    switch (series.bookClub) {
      case 'abbc':
        clubName = 'Absolute Beginner'
        clubID = '34698'
        break
      case 'bbc':
        clubName = 'Beginner'
        clubID = '19766'
        break
      case 'ibc':
        clubName = 'Intermediate'
        clubID = '18908'
        break
      case 'abc':
        clubName = 'Advanced'
        clubID = '44685'
        break
    }

    return template
      .replace('{Club Level}', clubName)
      .replace('{Club Link}', `https://community.wanikani.com/t/${clubID}`)
  }

  static formatVolumeThreadWhereToBuy (template) {
    return template
  }

  static formatVolumeThreadReadingSchedule (template, weeks, chapters, shortDateFormat) {
    const regex = /{Week}(.*){\/Week}/i
    const weekTemplate = template.match(regex)

    if (weekTemplate === null) {
      return template
    }

    let weekMarkdown = ''

    for (const weekKey in weeks) {
      const currentWeek = weeks[weekKey]
      const weekChapters = []
      for (const chapterKey in chapters) {
        if (!currentWeek.chapters.replace(' ', '').split(',').includes(chapterKey)) {
          continue
        }

        let prefix = 'Ch '
        if (isNaN(chapterKey)) {
          prefix = ''
        }
        weekChapters.push((`${prefix}${chapterKey} ${chapters[chapterKey].title}`).trim())
      }
      // TODO: If chapters are not set up, get chapters from the week.

      // TODO: If there are no chapter titles, should the delimiter be ", " instead?
      // TODO: Support Start Page and End Page.

      weekMarkdown += weekTemplate[1]
        .replace('{Week Number}', weekKey)
        .replace('{Week Start Date}', Template.formatDate(currentWeek.startDate, shortDateFormat))
        .replace('{Start Page}', currentWeek.startPage)
        .replace('{End Page}', currentWeek.endPage)
        .replace('{Week Chapters}', weekChapters.join('<br/>'))
        .replace('{Page Count}', (currentWeek.endPage - currentWeek.startPage + 1)) +
      '\n'
      // TODO: Separate {Chapters} (volume) and {Chapters} (weekly).
    }

    return template.replace(weekTemplate[0], weekMarkdown.trim())
  }

  static formatVolumeThreadVocabularyList (template, currentVolume) {
    return template.replace('{Vocabulary List}', currentVolume.vocabularyList)
  }

  static formatVolumeThreadDiscussionRules (template) {
    return template
  }

  static toHtml (templateName, templateMarkdown, show, series) {
    const templateTableTable = document.createElement('table')
    templateTableTable.id = `kfbc-template-${templateName.replaceAll(' ', '')}`
    // Show the first template.
    if (!show) {
      templateTableTable.style.display = 'none'
    }

    templateTableTable.classList.add('kfbc-template-table')

    // TODO: Replace the column group with styling via CSS.
    const columnGroup = document.createElement('colgroup')
    const nameColumn = document.createElement('col')
    nameColumn.style.width = '10em'
    columnGroup.appendChild(nameColumn)
    const markdownColumn = document.createElement('col')
    markdownColumn.style.width = '50em'
    columnGroup.appendChild(markdownColumn)
    templateTableTable.appendChild(columnGroup)

    const nameRow = document.createElement('tr')
    const nameLabelCell = document.createElement('td')
    const nameLabel = Interface.createLabel('templateName', 'Template name')
    nameLabelCell.appendChild(nameLabel)
    nameRow.appendChild(nameLabelCell)
    const nameValueCell = document.createElement('td')
    // TODO: Allow editing the template name?
    const nameValue = document.createElement('span')
    nameValue.setAttribute('name', 'kfbc-template-name')
    nameValue.textContent = templateName
    nameValueCell.appendChild(nameValue)
    nameRow.appendChild(nameValueCell)
    templateTableTable.appendChild(nameRow)

    const markdownRow = document.createElement('tr')
    const markdownLabelCell = document.createElement('td')
    const markdownLabel = Interface.createLabel('template-markdown', 'Template markdown')
    markdownLabelCell.appendChild(markdownLabel)
    markdownRow.appendChild(markdownLabelCell)
    const markdownValueCell = document.createElement('td')
    const markdownTextArea = document.createElement('textarea')
    markdownTextArea.setAttribute('name', 'kfbc-template-markdown')
    markdownTextArea.setAttribute('rows', '10')
    markdownTextArea.setAttribute('cols', '100')
    markdownTextArea.textContent = templateMarkdown
    // Sync updates back to the series object.
    markdownTextArea.addEventListener('input', (e) => { series.templates[templateName] = e.target.value })
    markdownValueCell.appendChild(markdownTextArea)
    markdownRow.appendChild(markdownValueCell)
    templateTableTable.appendChild(markdownRow)
    return templateTableTable
  }
}

/* eslint-disable no-unused-vars */

/* globals
  Chapter,
  Interface,
  Week
*/

class Volume {
  constructor (volumeNumber) {
    this.volumeNumber = volumeNumber.toString()
    this.volumeHomeThread = ''
    this.coverImage = ''
    this.vocabularyList = ''
    this.volumeTemplate = ''
    this.weeklyTemplate = ''
    // this.links = []
    this.chapters = {}
    this.weeks = {}
  }

  static fromJson (json) {
    let volume = new Volume(json.volumeNumber)
    volume.volumeHomeThread = json.volumeHomeThread
    volume.coverImage = json.coverImage
    volume.vocabularyList = json.vocabularyList
    volume.volumeTemplate = json.volumeTemplate
    volume.weeklyTemplate = json.weeklyTemplate

    // TODO: Links

    for (const [chapterNumber, chapterJson] of Object.entries(json.chapters)) {
      let chapter = Chapter.fromJson(chapterJson)
      volume.chapters[chapter.chapterNumber] = chapter
    }

    for (const [weekNumber, weekJson] of Object.entries(json.weeks)) {
      let week = Week.fromJson(weekJson)
      volume.weeks[week.weekNumber] = week
    }

    return volume
  }

  currentWeek () {
    let today = new Date()
    let oldestDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
    let newestDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)

    for (const weekKey in this.weeks) {
      if (oldestDate < new Date(Date.parse(this.weeks[weekKey].startDate)) && new Date(Date.parse(this.weeks[weekKey].startDate)) < newestDate) {
        return this.weeks[weekKey]
      }
    }
  }

  startDate () {
    if (Object.keys(this.weeks).length === 0) {
      return
    }

    return this.weeks[Object.keys(this.weeks).sort()[0]].startDate
  }

  syncValue (object) {
    return function () {
      object[this.name] = this.value
    }
  }

  toHtml (series, currentVolumeNumber) {
    const volumeDiv = Interface.createDiv(`volume${this.volumeNumber}`)
    volumeDiv.classList.add('kfbc-volume-container')
    // Hide if not the current volume.
    if (this.volumeNumber != currentVolumeNumber) {
      volumeDiv.style.display = 'none'
    }

    const volumeDetailsDiv = Interface.createDiv()
    volumeDetailsDiv.setAttribute('name', 'kfbc-volume')
    volumeDetailsDiv.style.display = 'grid'

    volumeDetailsDiv.appendChild(Interface.createLabel('volume-number', 'Volume Number'))
    volumeDetailsDiv.appendChild(Interface.createInput('volume-number', 'volumeNumber', this.volumeNumber, this.syncValue(this)))

    volumeDetailsDiv.appendChild(Interface.createLabel('volume-home-thread', 'Thread'))
    volumeDetailsDiv.appendChild(Interface.createInput('volume-home-thread', 'volumeHomeThread', this.volumeHomeThread, this.syncValue(this)))

    volumeDetailsDiv.appendChild(Interface.createLabel('cover-image', 'Cover Image'))
    volumeDetailsDiv.appendChild(Interface.createInput('cover-image', 'coverImage', this.coverImage, this.syncValue(this)))

    volumeDetailsDiv.appendChild(Interface.createLabel('vocabulary-list', 'Vocabulary List'))
    volumeDetailsDiv.appendChild(Interface.createInput('vocabulary-list', 'vocabularyList', this.vocabularyList, this.syncValue(this)))

    volumeDetailsDiv.appendChild(Interface.createLabel('volume-template', 'Volume Template'))
    const volumeTemplates = series.templatesToHtml('volume-template', 'volumeTemplate', this.volumeTemplate)
    volumeTemplates.addEventListener('change', this.syncValue(this))
    volumeDetailsDiv.appendChild(volumeTemplates)

    volumeDetailsDiv.appendChild(Interface.createLabel('weekly-template', 'Weekly Template'))
    const weeklyTemplates = series.templatesToHtml('weekly-template', 'weeklyTemplate', this.weeklyTemplate)
    weeklyTemplates.addEventListener('change', this.syncValue(this))
    volumeDetailsDiv.appendChild(weeklyTemplates)

    volumeDiv.appendChild(volumeDetailsDiv)

    // TODO: Add links section.

    // Chapters
    const chaptersDiv = Interface.createDiv()
    chaptersDiv.setAttribute('name', 'kfbc-chapters')
    chaptersDiv.style.display = 'none'
    const chaptersTable = document.createElement('table')
    chaptersTable.setAttribute('name', 'kfbc-chapters')

    const chaptersTableHead = document.createElement('thead')

    const chaptersHeaderRow = document.createElement('tr')
    const chapterHeaders = [
      'Number',
      'Title',
      'Remove']
    chapterHeaders.forEach(headerText => {
      const headerElement = document.createElement('th')
      headerElement.textContent = headerText
      chaptersHeaderRow.appendChild(headerElement)
    })
    chaptersTableHead.append(chaptersHeaderRow)
    chaptersTable.appendChild(chaptersTableHead)

    const chaptersTableBody = document.createElement('tbody')
    for (const [chapterNumber, chapter] of Object.entries(this.chapters)) {
      chaptersTableBody.appendChild(chapter.toHtml(series))
    }
    chaptersTable.appendChild(chaptersTableBody)
    chaptersDiv.appendChild(chaptersTable)
    volumeDiv.appendChild(chaptersDiv)

    // Weeks
    const weeksDiv = Interface.createDiv()
    weeksDiv.setAttribute('name', 'kfbc-weeks')
    weeksDiv.style.display = 'none'
    const weeksTable = document.createElement('table')
    weeksTable.setAttribute('name', 'kfbc-weeks')

    const weeksTableHead = document.createElement('thead')

    const weeksHeaderRow = document.createElement('tr')
    const weekHeaders = [
      'Week',
      'Thread',
      'Start Date',
      'Chapters',
      'Start Page',
      'End Page',
      'Remove']
    weekHeaders.forEach(headerText => {
      const headerElement = document.createElement('th')
      headerElement.textContent = headerText
      weeksHeaderRow.appendChild(headerElement)
    })
    weeksTableHead.appendChild(weeksHeaderRow)
    weeksTable.appendChild(weeksTableHead)

    const weeksTableBody = document.createElement('tbody')
    for (const [weekNumber, week] of Object.entries(this.weeks)) {
      weeksTableBody.appendChild(week.toHtml(series))
    }
    weeksTable.appendChild(weeksTableBody)
    weeksDiv.appendChild(weeksTable)
    volumeDiv.appendChild(weeksDiv)

    return volumeDiv
  }
}


/* eslint-disable no-unused-vars */

/* globals
  Interface
*/

class Week {
  constructor (weekNumber) {
    this.weekNumber = weekNumber.toString()
    this.number = weekNumber.toString()
    this.weekThread = ''
    this.startDate = ''
    this.chapters = ''
    this.startPage = ''
    this.endPage = ''
  }

  static fromJson (json) {
    let week = new Week(json.number)
    week.number = json.number
    week.weekThread = json.weekThread
    week.startDate = json.startDate
    week.chapters = json.chapters
    week.startPage = json.startPage
    week.endPage = json.endPage

    return week
  }

  syncValue (object) {
    return function () {
      object[this.name] = this.value
    }
  }

  toHtml (series) {
    const tableRow = document.createElement('tr')
    tableRow.dataset.number = this.number

    const numberCell = document.createElement('td')
    numberCell.appendChild(Interface.createInput('number', 'number', this.number, this.syncValue(this)))
    tableRow.appendChild(numberCell)

    const threadCell = document.createElement('td')
    threadCell.appendChild(Interface.createInput('week-thread', 'weekThread', this.weekThread, this.syncValue(this)))
    tableRow.appendChild(threadCell)

    const startDateCell = document.createElement('td')
    startDateCell.appendChild(Interface.createInput('start-date', 'startDate', this.startDate.substring(0, 10), this.syncValue(this), 'date'))
    tableRow.appendChild(startDateCell)

    const chaptersCell = document.createElement('td')
    chaptersCell.appendChild(Interface.createInput('chapters', 'chapters', this.chapters, this.syncValue(this)))
    tableRow.appendChild(chaptersCell)

    const startPageCell = document.createElement('td')
    startPageCell.appendChild(Interface.createInput('start-page', 'startPage', this.startPage, this.syncValue(this)))
    tableRow.appendChild(startPageCell)

    const endPageCell = document.createElement('td')
    endPageCell.appendChild(Interface.createInput('end-page', 'endPage', this.endPage, this.syncValue(this)))
    tableRow.appendChild(endPageCell)

    const removeCell = document.createElement('td')
    removeCell.textContent = '➖'
    removeCell.classList.add('kfbc-clickable')
    removeCell.addEventListener('click', () => { this.removeWeek(removeCell, series) })
    tableRow.appendChild(removeCell)

    return tableRow
  }

  removeWeek (element, series) {
    const selectedVolume = series.selectedVolume()
    const weekNumber = element.parentElement.dataset.number
    if (weekNumber in selectedVolume.weeks) {
      delete selectedVolume.weeks[weekNumber]
    }
    element.parentElement.remove()
  }
}


/* eslint-disable no-unused-vars */

/* globals
  ErrorMessage,
  FileReader,
  Interface,
  localStorage,
  Series,
  series,
  showVolumes,
  storagePrefix,
  Template
*/

// Ensure there is file API support.
if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
  ErrorMessage.set('File APIs are not fully supported.')
}

let dropZone = document.getElementsByTagName('body')[0]

// Show copy icon when dragging over.
dropZone.addEventListener('dragover', (e) => {
  e.stopPropagation()
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
})

// Get the file data on drop.
dropZone.addEventListener('drop', (e) => {
  ErrorMessage.clear()

  e.stopPropagation()
  e.preventDefault()

  if (e.dataTransfer.files.length !== 1) {
    ErrorMessage.set('Please drag only one file.')
    return
  }

  // Get first dragged file.
  let file = e.dataTransfer.files[0]

  if (!file.type.match('application/json')) {
    ErrorMessage.set('Please drag a JSON file.')
    return
  }

  let reader = new FileReader()

  reader.onload = function (e2) {
    loadFromFileText(e2.target.result)
    const bookList = document.getElementById('kfbc-book-list')
    bookList.selectedIndex = 0
  }

  reader.readAsText(file)
})

function loadFromStorage (title) {
  const fileText = localStorage.getItem(`${storagePrefix}${title}`)

  if (fileText == null) {
    loadFromFileText('{}')
    return
  }

  // eslint-disable-next-line no-global-assign, no-native-reassign
  series = Series.load(title)
  const currentVolume = series.currentVolume()
  // eslint-disable-next-line no-global-assign, no-native-reassign
  if (currentVolume !== null) {
    series.selectedVolumeNumber = currentVolume.volumeNumber
  }

  const targetDiv = document.getElementById('kfbc-content')
  targetDiv.replaceWith(series.toHtml(series))

  Interface.refreshButtons()
}

function loadFromFileText (text) {
  // eslint-disable-next-line no-global-assign, no-native-reassign
  series = Series.fromJson(JSON.parse(text))

  const targetDiv = document.getElementById('kfbc-content')
  targetDiv.replaceWith(series.toHtml(series))

  document.getElementById('kfbc-content').style.removeProperty('display')

  Interface.showSeriesSection('series')
  Interface.refreshButtons()
}

function addTemplateListItem (templateName, selectItem) {
  const templatesList = document.getElementById('kfbc-templates-list')

  const templateListItem = document.createElement('option')

  if (selectItem) {
    templateListItem.selected = true
  }

  templateListItem.textContent = templateName
  templateListItem.value = templateName.replaceAll(' ', '')
  templatesList.appendChild(templateListItem)
}

function addTemplateTable (templateName, templateText, isFirstTemplate) {
  series.templates[templateName] = templateText
  const templateTables = document.getElementById('kfbc-template-tables')
  templateTables.appendChild(Template.toHtml(templateName, templateText, true, series))
}

// Hide all templates except for the one to show.
function displayTemplate (templateList) {
  const templates = document.getElementsByClassName('kfbc-template-table')
  Array.from(templates).forEach(function (element) {
    if (`kfbc-template-${templateList.value}` === element.id) {
      element.style.removeProperty('display')
    } else {
      element.style.display = 'none'
    }
  })
}

function addVolumeToList (volumesList, volumeNumber, selectVolume) {
  const volumeListItem = document.createElement('option')

  if (selectVolume) {
    volumeListItem.selected = true
  }

  volumeListItem.textContent = `Volume ${volumeNumber}`
  volumeListItem.value = `volume${volumeNumber}`
  volumesList.appendChild(volumeListItem)
}

function addLink (address, volumeContainer) {
  if (undefined === volumeContainer) {
    volumeContainer = Interface.currentVolume()
  }

  const tableBodyElement = volumeContainer.querySelector('div[name="kfbc-links"]>table[name="kfbc-links"]>tbody')

  const url = new URL(address)

  let sitename = `Unknown (${url.hostname})`
  let tokens = {}
  // TODO: Move these to a JSON file?  This can allow for multiple token checks, such as for Amazon physical versus digital.
  switch (url.hostname) {
    case 'www.amazon.co.jp':
      sitename = 'Amazon'
      tokens = {
        'Purchase Physical': /\/dp\/([0-9][^/]*)/,
        'Purchase Digital': /\/dp\/([A-z][^/]*)/
      }
      // TODO: Determine if physical or digital.
      break
    case 'bookwalker.jp':
      sitename = 'Book Walker'
      tokens = {'Purchase Digital': /\/([^/]*)/}
      break
    case 'www.cdjapan.co.jp':
      sitename = 'CD Japan'
      tokens = {'Purchase Physical': /\/product\/([^/]*)/}
      break
    case 'www.kobo.com':
      sitename = 'Kobo'
      tokens = {'Purchase Digital': /\/ebook\/([^/]*)/}
      break
    case 'books.rakuten.co.jp':
      sitename = 'Rakuten'
      tokens = {
        'Purchase Physical': /\/rb\/([^/]*)/,
        'Purchase Digital': /\/rk\/([^/]*)/
      }
      break
    case 'comic.pixiv.net':
      sitename = 'Pixiv'
      tokens = {'Purchase Digital': /\/store\/variants\/([^/]*)/}
      break
    case 'ebookjapan.yahoo.co.jp':
      sitename = 'Yahoo'
      tokens = {'Purchase Physical': /\/books\/([^/]*\/[^/]*)/}
      break
    case 'learnnatively.com':
      sitename = 'Natively'
      tokens = {
        'Book': /\/book\/([^/]*)/,
        'Series': /\/series\/([^/]*)/
      }
      break
  }

  const rowElement = document.createElement('tr')

  const linkCellElement = document.createElement('td')
  linkCellElement.classList.add('kfbc-favicon')
  linkCellElement.classList.add(`kfbc-${sitename.toLowerCase().replace(' ', '-')}`)

  const linkElement = document.createElement('a')
  linkElement.href = address
  linkElement.textContent = `${sitename}`
  linkCellElement.appendChild(linkElement)
  rowElement.appendChild(linkCellElement)

  // Seek a matching token.
  let tokenType = 'Unknown'
  if (undefined !== tokens) {
    for (let token in tokens) {
      const match = url.pathname.match(tokens[token])

      if (match === null || match.length === 0) {
        continue
      }

      // A match was found.
      tokenType = token
      break
    }
  }

  const typeCellElement = document.createElement('td')
  typeCellElement.textContent = tokenType
  rowElement.appendChild(typeCellElement)

  // TODO: There should also be a field to enter in what text should be shown.  This is useful for when there are
  // multiple releases (such as b&w vs color).

  const removeItemCellElement = document.createElement('td')
  const removeItem = document.createElement('span')
  removeItem.classList.add('kfbc-clickable')
  removeItem.textContent = '➖'
  removeItem.onclick = function () { Interface.removeVolumeLink(this) }
  removeItemCellElement.appendChild(removeItem)
  rowElement.appendChild(removeItemCellElement)

  tableBodyElement.appendChild(rowElement)
}

function loadLinks (links, volumeContainer) {
  return

  // const linksList = addLinksList(volumeContainer).firstChild

  // for (let address of links) {
  // addLink(address, volumeContainer)
  // }
}



  const iconId = 'kf-bc-icon'
  const formId = 'kfbc-form'
  const closedIcon = '📓'
  const openIcon = '📖'

  window.addEventListener('load', function () {addBookClubManagerIcon()})

  // Add a button to the right of .title-wrapper > h1 to add a book club based on current page
  function addBookClubManagerIcon () {
    const iconList = document.querySelector('[id^="ember"] nav ul')

    const listItem = document.createElement('li')
    listItem.id = iconId
    listItem.style.fontSize = '16px'
    listItem.style.cursor = 'pointer'
    listItem.textContent = closedIcon
    listItem.addEventListener('click', () => { showHideBookClubManager() })
    iconList.append(listItem)
  }

  function showHideBookClubManager () {
    const initialStatus = document.getElementById(iconId).textContent
    if (initialStatus === closedIcon) {
      showBookClubManager()
    } else {
      hideBookClubManager()
    }
  }

  function showBookClubManager () {
    document.getElementById(iconId).textContent = openIcon

    let popup = document.createElement('div')
    popup.id = formId
    popup.innerHTML = `
<p>Series: <select id="kfbc-book-list"><option hidden disabled selected value>Select Book/Series</option></select></p>

<div id="kfbc-errors"></div>

<div id="kfbc-layout">

  <div id="kfbc-target"></div>

  <div id="kfbc-buttons">
    <button class="btn btn-icon-text btn-primary create" id="kfbc-save-storage" disabled>💾&nbsp;Save&nbsp;to&nbsp;Browser</button>
    <button class="btn btn-icon-text btn-primary create" id="kfbc-download-file" disabled>💾&nbsp;Save&nbsp;to&nbsp;File</button>
    <button class="btn btn-icon-text btn-primary create" id="kfbc-delete-storage" disabled>❌&nbsp;Delete&nbsp;from&nbsp;Browser</button>
    <button class="btn btn-icon-text btn-primary create" id="kfbc-load-file">📁&nbsp;Load&nbsp;from&nbsp;File</button>
    <br/>
    <br/>
    <button class="btn btn-icon-text btn-primary create" id="kfbc-copy-sheets-macro" disabled style="height: 2em;">📋&nbsp;Copy&nbsp;Sheets&nbsp;Macro</button>
    <button class="btn btn-icon-text btn-primary create" id="kfbc-copy-volume-thread" disabled style="height: 2em;">📋&nbsp;Create&nbsp;Volume&nbsp;Thread</button>
    <button class="btn btn-icon-text btn-primary create" id="kfbc-copy-week-thread" disabled style="height: 2em;">📋&nbsp;Create&nbsp;Week&nbsp;Post</button>
  </div>

  <div id="kfbc-content" style="display: none;"></div>
   <!-- TODO: Support removing a volume. -->

</div>
`

    // Display book club manager.
    document.querySelector('#main-container').append(popup)

    // --- Begin copied from local file. -------------------- //
    series = new Series('')

    document.getElementById('kfbc-save-storage').onclick = function () { series.save() }
    document.getElementById('kfbc-delete-storage').onclick = function () { series.deleteFromStorage(true) }
    document.getElementById('kfbc-download-file').onclick = function () { series.download() }
    document.getElementById('kfbc-load-file').onclick = async () => {
        const fileHandle = await showOpenFilePicker.call(undefined, {
            types: [ { description: "JSON files", accept: {"json/*": [".json"]} } ],
            multiple: false
        })
        //const data = JSON.parse(await (await fileHandle[0].getFile()).text())
        const data = await (await fileHandle[0].getFile()).text()
        console.log(data)
        loadFromFileText(data)
    }

    document.getElementById('kfbc-copy-volume-thread').onclick = function () { Template.copyVolumeThread(series) }
    document.getElementById('kfbc-copy-sheets-macro').onclick = function () { Macro.copySheetsMacro(series) }
    document.getElementById('kfbc-copy-week-thread').onclick = function () { Template.copyWeekThread(series) }

    document.getElementById('kfbc-book-list').onchange = function () { loadFromStorage(this.value) }

    Interface.showBookList()

    // Load an empty book club.
    loadFromFileText('{}')
    // --- End copied from local file. ---------------------- //
  }

  function hideBookClubManager () {
    const popUp = document.getElementById(formId)
    popUp.parentElement.removeChild(popUp)
    document.getElementById(iconId).textContent = closedIcon
  }
})()
