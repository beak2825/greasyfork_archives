// ==UserScript==
// @name         WME Address Point Helper
// @name:uk      WME 🇺🇦 Address Point Helper
// @name:ru      WME 🇺🇦 Address Point Helper
// @description  Creates point with an address of the selected venue
// @description:uk Створення точок з адресою обраного POI
// @description:ru Создание точек с адресом выбранного POI
// @version      3.1.1
// @license      MIT License
// @author       Andrei Pavlenko, Anton Shevchuk
// @namespace    https://greasyfork.org/ru/users/160654-waze-ukraine
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         data:image/png;base64,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
// @grant        none
// @require      https://update.greasyfork.org/scripts/389765/1090053/CommonUtils.js
// @require      https://update.greasyfork.org/scripts/450160/1704233/WME-Bootstrap.js
// @require      https://update.greasyfork.org/scripts/450221/1691071/WME-Base.js
// @require      https://update.greasyfork.org/scripts/450320/1688694/WME-UI.js
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @downloadURL https://update.greasyfork.org/scripts/45339/WME%20Address%20Point%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/45339/WME%20Address%20Point%20Helper.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* global require */
/* global GM_info */
/* global $, jQuery */
/* global I18n */
/* global WMEBase, WMEUI, WMEUIHelper, WMEUIHelperTab */
/* global Container, Settings, SimpleCache, Tools  */
/* global turf */

(function () {
  'use strict'

  // Script name, uses as unique index
  const NAME = 'Address Point Helper'

  const TRANSLATION = {
    'en': {
      title: 'APH📍',
      description: 'Address Point Helper 📍',
      buttons: {
        createPoint: 'Clone to Point',
        createResidential: 'Clone to Residential',
      },
      settings: {
        title: 'Options',
        addNavigationPoint: 'Add entry point',
        inheritNavigationPoint: 'Inherit parent\'s landmark entry point',
        autoSetHNToName: 'Copy house number into name',
        noDuplicates: 'Do not create duplicates',
      }
    },
    'uk': {
      title: 'APH📍',
      description: 'Address Point Helper 📍',
      buttons: {
        createPoint: 'Клон до POI',
        createResidential: 'Клон до АТ',
      },
      settings: {
        title: 'Налаштування',
        addNavigationPoint: 'Додавати точку в\'їзду',
        inheritNavigationPoint: 'Наслідувати точку в\'їзду від POI',
        autoSetHNToName: 'Копіювати номер будинку в назву',
        noDuplicates: 'Не створювати дублікатів',
      }
    },
    'ru': {
      title: 'APH📍',
      description: 'Address Point Helper 📍',
      buttons: {
        createPoint: 'Клон в POI',
        createResidential: 'Клон в АТ',
      },
      settings: {
        title: 'Настройки',
        addNavigationPoint: 'Создавать точку въезда',
        inheritNavigationPoint: 'Наследовать точку въезда от POI',
        autoSetHNToName: 'Копировать номер дома в название',
        noDuplicates: 'Не создавать дубликатов',
      }
    }
  }

  WMEUI.addTranslation(NAME, TRANSLATION)

  const STYLE = '.address-point-helper legend { cursor:pointer; font-size: 12px; font-weight: bold; width: auto; text-align: right; border: 0; margin: 0; padding: 0 8px; }' +
    '.address-point-helper fieldset { border: 1px solid #ddd; padding: 4px; }' +
    '.address-point-helper fieldset div.controls label { white-space: normal; }' +
    'button.waze-btn.address-point-helper { border: 1px solid #ddd; margin-right: 2px; padding: 3px 8px; }' +
    'button.waze-btn.address-point-helper .chip { align-items: center; display: flex; gap: 5px; }' +
    'p.address-point-helper-info { border-top: 1px solid #ccc; color: #777; font-size: x-small; margin-top: 15px; padding-top: 10px; text-align: center; }' +
    '#sidebar p.address-point-helper-blue { background-color:#0057B8;color:white;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }' +
    '#sidebar p.address-point-helper-yellow { background-color:#FFDD00;color:black;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }'


  WMEUI.addStyle(STYLE)

  // default settings
  const SETTINGS = {
    addNavigationPoint: true,
    inheritNavigationPoint: true,
    autoSetHNToName: true,
    noDuplicates: true,
  }

  const BUTTONS = {
    A: {
      title: '<span class="chip"><i class="w-icon w-icon-node"></i>' + I18n.t(NAME).buttons.createPoint + '</span>',
      description: I18n.t(NAME).buttons.createPoint,
      shortcut: 'A+G',
      callback: () => createPoint()
    },
    B: {
      title: '<span class="chip"><i class="w-icon w-icon-home"></i>' + I18n.t(NAME).buttons.createResidential +'</span>',
      description: I18n.t(NAME).buttons.createResidential,
      shortcut: 'A+H',
      callback: () => createResidential()
    },
  }

  let scriptSettings = new Settings(NAME, SETTINGS)

  class APH extends WMEBase {
    constructor (name, settings, buttons) {
      super(name, settings)

      this.helper = new WMEUIHelper(NAME)

      this.initHelper()

      this.initTab()

      this.initShortcuts(buttons)

      this.initPanel(buttons)

      this.initHandlers()
    }

    initHelper() {
      /** @type {WMEUIHelper} */
      this.helper = new WMEUIHelper(this.name)
    }

    /**
     * Initial UI elements
     */
    initTab () {
      /** @type {WMEUIHelperTab} */
      let tab = this.helper.createTab(
        I18n.t(this.name).title,
        {
          sidebar: this.wmeSDK.Sidebar,
          image: GM_info.script.icon
        }
      )

      // Setup options
      let fieldsetSettings = this.helper.createFieldset(I18n.t(this.name).settings.title)

      for (let item in this.settings.container) {
        if (this.settings.container.hasOwnProperty(item)
          && I18n.t(this.name).settings[item]
          ) {
          fieldsetSettings.addCheckbox(
            item,
            I18n.t(this.name).settings[item],
            event => this.settings.set([item], event.target.checked),
            this.settings.get(item)
          )
        }
      }
      tab.addElement(fieldsetSettings)

      tab.addText(
        'info',
        '<a href="' + GM_info.scriptUpdateURL + '">' + GM_info.script.name + '</a> ' + GM_info.script.version
      )

      tab.addText('blue', 'made in')
      tab.addText('yellow', 'Ukraine')
      tab.inject()
    }

    initShortcuts (buttons) {
      for (let btn in buttons) {
        if (buttons.hasOwnProperty(btn)) {
          let button = buttons[btn]
          if (button.shortcut) {
            let shortcut = {
              callback: button.callback,
              description: button.description,
              shortcutId: this.id + '-' + btn,
              shortcutKeys: button.shortcut,
            };

            if (this.wmeSDK.Shortcuts.areShortcutKeysInUse({ shortcutKeys: shortcut.shortcutKeys })) {
              this.log('Shortcut already in use')
              shortcut.shortcutKeys = null
            }
            this.wmeSDK.Shortcuts.createShortcut(shortcut);
          }
        }
      }
    }

    initPanel (buttons) {
      // Create a panel for POI
      this.panel = this.helper.createPanel(I18n.t(NAME).title)
      this.panel.addButtons(buttons)
    }

    initHandlers() {
      this.wmeSDK.Events.trackDataModelEvents({ dataModelName: "venues" })
      this.wmeSDK.Events.on({
        eventName: "wme-data-model-objects-changed",
        eventHandler: ({dataModelName, objectIds}) => {
          $('button.address-point-helper-A').prop('disabled', !this.validateForPoint())
          $('button.address-point-helper-B').prop('disabled', !this.validateForResidential())
        }
      })
    }

    /**
     * Handler for `venue.wme` event
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Venue} model
     * @return {null|void}
     */
    onVenue (event, element, model) {
      if (!this.wmeSDK.DataModel.Venues.hasPermissions({ venueId: model.id })) {
        return
      }
      if (element.querySelector('div.form-group.address-point-helper')) {
        return
      }
      element.prepend(
        this.panel.html()
      )

      $('button.address-point-helper-A').prop('disabled', !this.validateForPoint())
      $('button.address-point-helper-B').prop('disabled', !this.validateForResidential())
    }

    /**
     * Checks if a POI can be cloned as a point: always true if "CopyPOI" is enabled, otherwise requires a house number.
     */
    validateForPoint () {
      let venue = this.getSelectedVenue()
      if (!venue) return false

      let address = this.getSelectedVenueAddress()
      if (!address?.houseNumber) return false

      if (this.settings.get('noDuplicates')) {
        return !hasDuplicate(address?.houseNumber, address.street?.id, address?.houseNumber, false)
      }
      return true
    }

    validateForResidential () {
      let venue = this.getSelectedVenue()
      if (!venue || venue.isResidential) return false

      let address = this.getSelectedVenueAddress()
      if (!address?.houseNumber) return false

      return !hasDuplicate(address?.houseNumber, address.street?.id, address?.houseNumber, true)
    }

    getPointLockRank () {
      let selectedLandmark = this.getSelectedVenue()
      let parentFeatureLockRank = selectedLandmark.lockRank
      let userRank = this.wmeSDK.State.getUserInfo().rank

      if (userRank >= parentFeatureLockRank) {
        return parentFeatureLockRank
      } else if (userRank >= 1) {
        return 1
      } else {
        return 0
      }
    }
  }

  let APHInstance

  $(document).on('bootstrap.wme', () => {
    APHInstance = new APH(NAME, scriptSettings, BUTTONS)
  })

  function createPoint (isResidential = false) {
    console.groupCollapsed(
      '%c' + NAME + ': 📍%c try to create ' + (isResidential ? 'residential ' : '') + 'point',
      'color: #0DAD8D; font-weight: bold',
      'color: dimgray; font-weight: normal'
    )

    if ((!APHInstance.validateForPoint() && !isResidential)
      || (!APHInstance.validateForResidential() && isResidential)) {
      console.log('Invalid point')
      console.groupEnd()
      return
    }

    let venue = APHInstance.getSelectedVenue()
    let address = APHInstance.getSelectedVenueAddress()

    let newPoint = turf.centroid(venue.geometry)
    newPoint.geometry.coordinates[0] += 0.00005
    newPoint.geometry.coordinates[1] += 0.00005

    let newName = ''
    if (APHInstance.settings.get('autoSetHNToName')) {
      newName = address.houseNumber ?? ''
    }

    if (!newName && isResidential) {
      newName = venue.name ?? ''
    }

    if (!newName && !isResidential) {
      newName = venue.name ? venue.name + ' (copy)' : ''
    }

    let newVenue = {
      name: newName
    }

    let lockRank = APHInstance.getPointLockRank()

    if (lockRank) {
      newVenue.lockRank = lockRank
    }

    let newAddress = {
      houseNumber: address.houseNumber,
      streetId: address.street.id,
    }

    if (APHInstance.settings.get('noDuplicates')
      && hasDuplicate(newVenue.name, newAddress.streetId, newAddress.houseNumber, isResidential)) {
      console.log('This point already exists.')
      console.groupEnd()
      return
    }

    let venueId = APHInstance.wmeSDK.DataModel.Venues.addVenue(
      {
        category: 'OTHER',
        geometry: newPoint.geometry
      }
    )
    newVenue.venueId = String(venueId)
    newAddress.venueId = String(venueId)

    APHInstance.wmeSDK.DataModel.Venues.updateVenue(newVenue)
    APHInstance.wmeSDK.DataModel.Venues.updateAddress(newAddress)
    APHInstance.wmeSDK.DataModel.Venues.updateVenueIsResidential({
      venueId: String(venueId),
      isResidential: isResidential,
    })

    if (APHInstance.settings.get('addNavigationPoint')) {
      // the primary entry point is always one and always on the first position
      let newEntryPoint, parentEntryPoint = venue.navigationPoints?.[0]
      if (APHInstance.settings.get('inheritNavigationPoint') && parentEntryPoint) {
        newEntryPoint = turf.point(parentEntryPoint.point.coordinates)
      } else {
        newEntryPoint = turf.point(newPoint.geometry.coordinates)
      }

      // create navigation point
      let navigationPoint =  {
        isEntry: true,
        isExit: true,
        isPrimary: true,
        name: parentEntryPoint?.name ?? "",
        point: newEntryPoint.geometry
      }

      APHInstance.wmeSDK.DataModel.Venues.replaceNavigationPoints({
        venueId: String(venueId),
        navigationPoints: [navigationPoint]
      })
    }

    APHInstance.wmeSDK.Editing.setSelection({ selection: {
      ids:[ String(venueId) ],
      objectType: 'venue'
    }})

    console.log('The point was created.')
    console.groupEnd()
  }

  function createResidential () {
    createPoint(true)
  }

  function hasDuplicate (name, streetId, houseNumber, isResidential) {
    const venues = APHInstance.getAllVenues()

    for (let i = 0; i < venues.length; i++) {
      const venue = venues[i]
      const address = APHInstance.wmeSDK.DataModel.Venues.getAddress({ venueId: venue.id })

      let equalNames = true // or empty for residential
      if (!isResidential && !!venue.name && !!name) {
        if (venue.name.toLowerCase().trim() !== name.toLowerCase().trim()) {
          equalNames = false
        }
      }

      if (
        equalNames
        && venue.isResidential === isResidential
        && address.street?.id === streetId
        && address.houseNumber === houseNumber
      ) {
        return true
      }
    }

    return false
  }
})()
