// ==UserScript==
// @name         WME E97 Copy address button
// @name:uk      WME 🇺🇦 E97 Copy address button
// @name:ru      WME 🇺🇦 E97 Copy address button
// @version      0.5.1
// @description  One button and one shortcut for copy POI address
// @description:uk Це лише кнопка, щоб копіювати адресу обраного POI
// @description:ru Просто кнопка, чтобы копировать адрес выбранного POI
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/22648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-e97/issues
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         data:image/png;base64,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
// @grant        GM.setClipboard
// @require      https://update.greasyfork.org/scripts/450160/1704233/WME-Bootstrap.js
// @require      https://update.greasyfork.org/scripts/450221/1691071/WME-Base.js
// @require      https://update.greasyfork.org/scripts/450320/1688694/WME-UI.js
// @downloadURL https://update.greasyfork.org/scripts/391499/WME%20E97%20Copy%20address%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/391499/WME%20E97%20Copy%20address%20button.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* global require */
/* global $, jQuery */
/* global I18n */
/* global WMEBase, WMEUI, WMEUIHelper */
/* global Node$1, Segment, Venue, VenueAddress, WmeSDK */

(function () {
  'use strict'

  const NAME = 'E97'

  // translation structure
  const TRANSLATION = {
    'en': {
      title: 'Copy address',
      description: 'Copy name and address of the selected POI to clipboard',
    },
    'uk': {
      title: 'Копіювати адресу',
      description: 'Копіювати до буферу обміну назву та адресу обраного POI',
    },
    'ru': {
      title: 'Копировать адрес',
      description: 'Копировать в буфер название и адрес выбранного POI',
    }
  }

  WMEUI.addTranslation(NAME, TRANSLATION)

  const STYLE = '.e97 { float: right; z-index: 100; top: 0; right: 0; margin: 0 1px; border: 0; background: none; }'

  WMEUI.addStyle(STYLE)

  class E97 extends WMEBase {
    constructor (name) {
      super(name)

      this.createButton()

      this.createShortcut()
    }

    /**
     * Handler for `venue.wme` event
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Venue} model
     * @return {Null}
     */
    onVenue(event, element, model) {
      if (element.querySelector('div.external-providers-control > wz-label')) {
        element
          .querySelector('div.external-providers-control > wz-label')
          .append(this.button)
      }
    }

    /**
     * Create `copy` button for external providers
     */
    createButton () {
      let icon = document.createElement('i')
      icon.className = 'fa fa-copy w-clickable'

      this.button = document.createElement('button')
      this.button.className = 'e97'
      this.button.title = I18n.t(NAME).title
      this.button.append(icon)
      this.button.onclick = () => this.copyAddress()
    }

    /**
     * Create the shortcut
     */
    createShortcut () {
      let shortcut = {
        callback: () => this.copyAddress(),
        description: I18n.t(this.name).description,
        shortcutId: this.id,
        shortcutKeys: 'C+D',
      };

      if (this.wmeSDK.Shortcuts.areShortcutKeysInUse({ shortcutKeys: shortcut.shortcutKeys })) {
        this.log('Shortcut already in use')
        shortcut.shortcutKeys = null
      }
      this.wmeSDK.Shortcuts.createShortcut(shortcut);
    }

    /**
     * Copy the venue address to the clipboard
     * @return {boolean}
     */
    copyAddress () {
      let venues = this.getSelectedVenues()
      if (venues.length === 0) {
        return false
      }

      let venue = venues[0]
      let address = this.wmeSDK.DataModel.Venues.getAddress( { venueId: venue.id } )

      let parts = [
        address.houseNumber,
        address.street.name,
        address.city.name,
      ]

      let text = parts.filter(el => el != null).join(', ')

      GM.setClipboard(text)

      this.log('copied "' + text + '"')

      $('wz-button.external-provider-add-new').click()
      return false
    }
  }

  $(document).on('bootstrap.wme', () => {
    new E97(NAME)
  })
})();
