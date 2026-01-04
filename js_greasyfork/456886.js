// ==UserScript==
// @name         WME E87 Inconsistent direction
// @name:uk      WME 🇺🇦 E87 Inconsistent direction
// @name:ru      WME 🇺🇦 E87 Inconsistent direction
// @version      0.2.2
// @description  Solves the inconsistent direction problem
// @description:uk Дозволяє вирішувати проблему різнонаправлених сегментів
// @description:ru Позволяет решить проблему разнонаправленных сегментов
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-template/issues
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         data:image/png;base64,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Z2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6ZDRiNjNhYzgtYmMyOC00ODg2LThlNDgtYTNkM2YxNzJmNmU2IgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVlOTUyNDgwLWRmMTAtNDVhMS1iYWY3LTEzMTUzNTJjNWQ0ZCIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmIyOWI4Y2FmLTc3OTctNDZhZi1hMjljLTdhMzQ1ZDJmZGNlOSIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09Ik1hYyBPUyIKICAgR0lNUDpUaW1lU3RhbXA9IjE2NzE1NDk5MDM4MTk2NDkiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zMiIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjI6MTI6MjBUMTY6MjU6MDMrMDE6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIyOjEyOjIwVDE2OjI1OjAzKzAxOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDU0ZmRjNDgtNjg1MC00OTg0LTkxMzItY2M2YjdmNDg1MjkxIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKE1hYyBPUykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjItMTItMjBUMTY6MjU6MDMrMDE6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+lrIRmQAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YMFA8ZAx8XwGkAAAZ4SURBVHja7ZpvTFRXFsB/w/8/CypSmFGmWpRotKASMRSkgVrTZrsplrVqa7XY1IC0UdovtjTrELdpv7QftJuGaiO4RohDGkY2Jl34QGlnCKm1Eyi2TWUkVWAe/4cpdHVxeP1AeXA74AAqOzu8XzLJO/edd+89Z94959ybByoqKioqKioqKioqCxGNcnUMPzQUALuArciT7vmGpTJgBoxo+JhiRiduGtBhwFJWUybb++yyr2Lvs8tlNWUyBiwY0E12gPnyj5flhcLlHy/LGDCPvRgG8krTS0tyt+cC0NDSwLnGc5R0lPjUCshfns++1H2kPZoGQFltGQcsB/I0GKi3H7Y/ro3SYvnOwtbPtvp00DP/1Ux6YjpSv4TupO5LP3/8M7RRWgA+NX/q81F/3EZtlBZ//DP8dP46JdqXdZX5vAMm26jz12n8FnodEDATpZwlOayLXjenAZy3nZy8cXLKe4eWH+LJtU+yImYFMjKDw4PYJBulzaU03mp00z/y8BEigiNmNX5zTzPVjup7c8De5L3kZOTMyQGdvZ2c/IfogD3Rezi+4zgJcQlu+tvYxr5t+6j8spKXLS8L997KfgvtUu2sxq+oq6C6/h4dcD9JDUmlJLeERX9aNK1OaHAo+7fvJzAgkBfrX3yg85n3GPDhXz50M753sBd7n51b/70ltO/M2MmOxTv+9zHgj/QN9tEmtc1It2ewR5A3JWwSZGO9kd11uwHIXpzNmVfOEBUZBUBgQCC7N+7G9IUJgKbrTbT3tt91vOhF0azUrlTkbmf3/XdAm9RGSkXKrJ87/PBhQoNDJwLksFMxHuCi4yLmFjPPpj2rtK3WrVaun770tMcxbhy6oVx39HZQaC30niUQGRwpyMO3ht10vu/8XpzgLDL1R5s/Qh+rV+Tz9ee9KwaMyqOeJ/QHg2VZnnH/L2S8oFy3d7dz9Luj3uWA91vfZ+TOiCKHh4S76azVrRXT6EDnjPo+l3GOpYuWKnK5udz7soCMzJWfrkwsifBIKrdVCikybX2aIo/cGeFM4xmP/W4J2UL2Y9mKbO+zc7T56IzmNKcgGLs4lgtZFzzqOYYd5H2dJ7S9++93KV9RTmR4pJLqbKtsOH91ska/RgiSJosJk8PkcZyijCIiwiYqxJpvax5sGtTH6oVgMx1Sn+TmgEuDlzjyzyO8+dSbJMYnAhC/LF5Ms84+qhqqONh40OMYQZogntj0hJBZci253lsIASyLWEZ4cPj0lWBQKKu1q0kNSfXY1+n008K/b7lq8e5K8L3171G8p5j45fFKZmjtaMXaasU57AQgLCSMzI2ZGF8xsiVky137y0rKEuRTDacefCV4s/smjT80etQbGB4Q5OTgZF575jUCAwKVIPdB1QcUXS0CIMYvhtq9tSStShpbajF63nn8HbJrsqfs/3X96+hjJpaircM2o5hxzw7oGuhiV92uWT+XtyGPyLCJYsh6zaoYD9A92s2xfx3DVDhhROaGTJgmpuUkizvUb659492boaSVSYJsk2xuOhcdF+lx9Aip8rklz03Z34ZVGwT5QtMF73ZAgL/4wtl6bVPquVwuQV4fvd5NJzc2V9k0jW/QqgaqvH87PJmEhxKmbB+PEXcrh7MSxODXZm+b0xzm1QFD/xkSZO0S99Od7RHbhZIW4ITthHvJvFwsma93XZ+/84DYJbEYs4wz1i+3lmNymGj6uYnMjZkTpe+6VA40HKC0q1RpMzxlEJ5t72lnSB5yryWilwlyS0fL/DlAH6MX0o8nmtubMTlMFFoLeSnzJeUfDg4M5pODn/DGjTe4PXIbbZSWuIfihGfrmuqm3lqHiVtraUj6/zgSO1VzijuuO8J6T4xPZPOazW7Gt9nb2G/eP7UDwkUHnO48PX9vwL1QdLUIDRoK/lzgZsRkrNesFHxW8OAz00yUzK1mXKOuOQ/S0iOuz7evvo2x1Uj+xnySH0kmJiqGIP8g+n/pR+qXqG6q5sTPJ+7aZ2V95X1xgCbueJx88283x4Ri3/omYtpzieKxtKr/ux4/u8suTy4ufJ3JNtpddtnPhesrqX8sgr669VWfd8C4jVK/hAvXV37A+c+vfA5AemI6lp0W8uPyx74e8qFfflw+lp0W0hPTAfjd5t+PjRfwJzLjdcDzKRUpDWdrzzK+HHwRqV/ibO1ZUipSGoDnYaF+JifzMccZRUVFRUVFRUVFRUVlwfIbL4zT3SPCFmYAAAAASUVORK5CYII=
// @grant        none
// @require      https://update.greasyfork.org/scripts/389765/1090053/CommonUtils.js
// @require      https://update.greasyfork.org/scripts/450160/1704233/WME-Bootstrap.js
// @require      https://update.greasyfork.org/scripts/450221/1691071/WME-Base.js
// @require      https://update.greasyfork.org/scripts/450320/1688694/WME-UI.js
// @downloadURL https://update.greasyfork.org/scripts/456886/WME%20E87%20Inconsistent%20direction.user.js
// @updateURL https://update.greasyfork.org/scripts/456886/WME%20E87%20Inconsistent%20direction.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

/* global require */
/* global $, jQuery */
/* global I18n */
/* global WMEBase */
/* global WMEUI, WMEUIHelper, WMEUIHelperPanel, WMEUIHelperModal, WMEUIHelperTab, WMEUIHelperFieldset */
/* global Container, Settings, SimpleCache, Tools  */
/* global Node$1, Segment, Venue, VenueAddress, WmeSDK */

(function () {
  'use strict'

  // Script name, uses as unique index
  const NAME = 'E87'

  // Translations
  const TRANSLATION = {
    'en': {
      title: 'Direction →',
      description: 'Plugin WME E87 solves the inconsistent direction problem.<br/>Choose one or more segment to change direction.',
      buttons: {
        toggle: 'Change direction',
        forward: 'A → B',
        reverse: 'B → A',
      },
    },
    'uk': {
      title: 'Напрямки →',
      description: 'Плагін WME E87 для вирішення проблеми різно направлених вулиць.<br/>Оберіть один або декілька сегментів щоб застосувати зміни.',
      buttons: {
        toggle: 'Змінити напрямок',
        forward: 'A → B',
        reverse: 'B → A',
      },
    },
    'ru': {
      title: 'Направления →',
      description: 'Плагин WME E87 для решения проблемы разнонаправленных улиц.<br/>Выберите один или несколько сегментов, чтобы внести изменения.',
      buttons: {
        toggle: 'Изменить направление',
        forward: 'A → B',
        reverse: 'B → A',
      },
    }
  }

  WMEUI.addTranslation(NAME, TRANSLATION)

  const STYLE =
    '.lanes-tab div.e87 { border: 1px solid var(--hairline); border-radius: 6px; margin-bottom: 16px; padding: 8px 16px 18px; } ' +
    'button.waze-btn.e87 { background: #f2f4f7; border: 1px solid #ccc; margin: 2px; } ' +
    'button.waze-btn.e87:hover { background: #ffffff; transition: background-color 100ms linear; box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1), inset 0 0 100px 100px rgba(255, 255, 255, 0.3); } ' +
    'button.waze-btn.e87:focus { background: #f2f4f7; } ' +
    'button.e87-forward, button.e87-reverse { margin: 2px 8px; }' +
    'div.e87-container { display: flex; flex: auto; justify-content: space-evenly; } ' +
    'p.e87-info { border-top: 1px solid #ccc; color: #777; font-size: x-small; margin-top: 15px; padding-top: 10px; text-align: center; }' +
    '#sidebar p.e87-blue { background-color:#0057B8;color:white;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }' +
    '#sidebar p.e87-yellow { background-color:#FFDD00;color:black;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }'

  WMEUI.addStyle(STYLE)

  const BUTTONS = {
    toggle: {
      title: I18n.t(NAME).buttons.toggle,
      description: I18n.t(NAME).buttons.toggle,
      shortcut: null,
    },
  }

  // Default settings
  const SETTINGS = {}

  class E87 extends WMEBase {
    constructor (name, settings = null, buttons = null) {
      super(name, settings)

      this.initHelper()

      this.initTab()

      this.initPanel(buttons)
    }

    initHelper() {
      this.helper = new WMEUIHelper(this.name)
    }

    initTab() {
      /** @type {WMEUIHelperTab} */
      let tab = this.helper.createTab(
        I18n.t(this.name).title,
        {
          sidebar: this.wmeSDK.Sidebar,
          image: GM_info.script.icon
        }
      )
      tab.addText('description', I18n.t(this.name).description)
      tab.addText('info', '<a href="' + GM_info.scriptUpdateURL + '">' + GM_info.script.name + '</a> ' + GM_info.script.version)
      tab.addText('blue', 'made in')
      tab.addText('yellow', 'Ukraine')
      tab.inject()
    }

    /**
     * Init button for selection of the segment
     * @param buttons
     */
    initPanel (buttons) {
      /** @type {WMEUIHelperPanel} */
      this.panel = this.helper.createPanel(I18n.t(this.name).title)

      buttons.toggle.callback = (e) => {
        e.preventDefault()
        this.getSelectedSegments().forEach(
          segment => this.invert(segment)
        )
      }

      this.panel.addButtons(buttons)
    }

    /**
     * Handler for `segment.wme` event
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Segment} model
     * @return {void}
     */
    onSegment (event, element, model) {
      // Skip for walking trails and blocked roads
      if ( this.wmeSDK.DataModel.Segments.isRoadTypeDrivable({ roadType: model.roadType })
        && this.wmeSDK.DataModel.Segments.hasPermissions({ segmentId: model.id })
      ) {
        element.prepend(this.panel.html())
      } else {
        // Remove the panel
        element.querySelector('div.form-group.e87')?.remove()
      }
    }

    /**
     * Handler for `segments.wme` event
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Array} models
     * @return {void}
     */
    onSegments (event, element, models) {
      // Skip walking trails or locked roads
      if (models.filter((model) =>
        this.wmeSDK.DataModel.Segments.isRoadTypeDrivable({ roadType: model.roadType })
        && this.wmeSDK.DataModel.Segments.hasPermissions({ segmentId: model.id })
      ).length === 0) {
        // Remove the panel
        element.querySelector('div.form-group.e87')?.remove()
        return
      }

      let reversed = this.wmeSDK.DataModel.Segments.getReversedSegments({
        segmentIds: this.wmeSDK.Editing.getSelection().ids
      })

      if (reversed.length === models.length || reversed.length === 0) {
        // you can reverse all selected segments
        element.prepend(this.panel.html())
        return
      }

      let reversedIds = reversed.map((segment) => segment.id)

      let forward = models.filter((model) => reversedIds.indexOf(model.id) === -1)

      let forwardIds = forward.map((segment) => segment.id)

      if (forwardIds.length && reversedIds.length) {
        this.log('Inconsistent direction detected: forward = ' + forwardIds.length + ' backward = ' + reversedIds.length)

        let buttonToForward = document.createElement('button')
        buttonToForward.type = 'button'
        buttonToForward.title = I18n.t(NAME).buttons.toggle
        buttonToForward.className = 'waze-btn waze-btn-small waze-btn-white e87 e87-forward'
        buttonToForward.innerText = I18n.t(NAME).buttons.forward + ' (' + reversedIds.length + ')'
        buttonToForward.onclick = (e) => {
          e.preventDefault()
          reversed.forEach(el => this.invert(el))
          buttonToForward.innerText = I18n.t(NAME).buttons.forward + ' (0)'
          buttonToForward.disabled = true
        }
        let buttonToReverse = document.createElement('button')
        buttonToReverse.type = 'button'
        buttonToReverse.title = I18n.t(NAME).buttons.toggle
        buttonToReverse.className = 'waze-btn waze-btn-small waze-btn-white e87 e87-reverse'
        buttonToReverse.innerText = I18n.t(NAME).buttons.reverse + ' (' + forwardIds.length + ')'
        buttonToReverse.onclick = (e) => {
          e.preventDefault()
          forward.forEach(el => this.invert(el))
          buttonToReverse.innerText = I18n.t(NAME).buttons.reverse + ' (0)'
          buttonToReverse.disabled = true
        }

        this.container?.remove();

        this.container = document.createElement('div')
        this.container.className = 'e87-container'
        this.container.append(buttonToForward)
        this.container.append(buttonToReverse)

        $('wz-alert.sidebar-alert.inconsistent-direction-alert > div')
          .after(this.container)
      }
    }

    /**
     * Invert direction of the segment
     * @param {Segment} segment of the segment
     */
    invert (segment) {
      if (!this.wmeSDK.DataModel.Segments.hasPermissions({ segmentId: segment.id })) {
        this.log('Locked by higher rank')
        return
      }
      this.group('invert segment ' + segment.id)

      let isReverse = this.wmeSDK.DataModel.Segments.getReversedSegments({
        segmentIds: [segment.id]
      }).length > 0

      // setup and reverse geometry
      let attributes = {
        segmentId: segment.id,
        geometry: {
          type: "LineString",
          coordinates: segment.geometry.coordinates.slice().reverse()
        }
      }

      // reverse the Direction
      // direction: SegmentDirection: { A_TO_B: "A_TO_B"; B_TO_A: "B_TO_A"; TWO_WAY: "TWO_WAY" }
      if (!segment.isTwoWay) {
        if (segment.isAtoB) {
          attributes.direction = "B_TO_A"
        } else {
          attributes.direction = "A_TO_B"
        }
      }

      // exchange the Speed Limits
      if (segment.revSpeedLimit !== segment.fwdSpeedLimit) {
        attributes.fwdSpeedLimit = segment.revSpeedLimit
        attributes.revSpeedLimit = segment.fwdSpeedLimit
      }

      // exchange the Lanes' Info
      if (segment.fromLanesInfo || segment.toLanesInfo) {
        attributes.fromLanesInfo = segment.toLanesInfo
        attributes.toLanesInfo = segment.fromLanesInfo
      }

      this.wmeSDK.DataModel.Segments.updateSegment(attributes)

      this.groupEnd()
    }
  }

  $(document).on('bootstrap.wme', () => {
    new E87(NAME, SETTINGS, BUTTONS)
  })
})()
