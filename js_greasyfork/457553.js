// ==UserScript==
// @name         WME Switch Uturns
// @name:uk      WME 🇺🇦 Switch Uturns
// @name:ru      WME 🇺🇦 Switch Uturns
// @version      2025.11.29.001
// @description  Switches U-turns for selected node or segment.
// @description:uk Перемикач розворотів для обраної точки або сегменту.
// @description:ru Переключатель разворотов для выбранной точки или сегмента.
// @author       ixxvivxxi, uranik, turbopirate, AntonShevchuk
// @namespace    https://greasyfork.org/users/160654-waze-ukraine
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         data:image/png;base64,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JD9NIZcD3s/omzJA/y3Qs+b21tzH6QOQoq4SN8DBITCSp+x1j3d3tff275lmfz+vBXK/GI2+FAAADXppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOkdJTVA9Imh0dHA6Ly93d3cuZ2ltcC5vcmcveG1wLyIKICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICB4bXBNTTpEb2N1bWVudElEPSJnaW1wOmRvY2lkOmdpbXA6NjhjZGRhYmMtYzdiNi00YWRmLWFiOGYtMWFmNzAzOTdhZjc0IgogICB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU4NmI4ZWUwLTQ3NTMtNDY0Yy1hNjhlLWYwODMyOWFkZDQ0MiIKICAgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjAwM2VhNDhmLTJiNDgtNGQ4ZC04ZTVlLTdjNjI0ZmY2MjI1ZSIKICAgZGM6Rm9ybWF0PSJpbWFnZS9wbmciCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09Ik1hYyBPUyIKICAgR0lNUDpUaW1lU3RhbXA9IjE2NzIyMTk0MDI2MTQ2MzAiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zMiIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjI6MTI6MjhUMTA6MjM6MjIrMDE6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIyOjEyOjI4VDEwOjIzOjIyKzAxOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YzgwZjNjNDUtNmYxYS00ODlmLTlkYTUtYmJlM2JiYTNhOGVhIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKE1hYyBPUykiCiAgICAgIHN0RXZ0OndoZW49IjIwMjItMTItMjhUMTA6MjM6MjIrMDE6MDAiLz4KICAgIDwvcmRmOlNlcT4KICAgPC94bXBNTTpIaXN0b3J5PgogIDwvcmRmOkRlc2NyaXB0aW9uPgogPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+NKPOngAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YMHAkXFi1wXVEAAAx8SURBVHja5Zt5WNTX1cc/Mwyzsg2E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
// @grant        none
// @require      https://update.greasyfork.org/scripts/450160/1704233/WME-Bootstrap.js
// @require      https://update.greasyfork.org/scripts/450221/1691071/WME-Base.js
// @require      https://update.greasyfork.org/scripts/450320/1688694/WME-UI.js
// @downloadURL https://update.greasyfork.org/scripts/457553/WME%20Switch%20Uturns.user.js
// @updateURL https://update.greasyfork.org/scripts/457553/WME%20Switch%20Uturns.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* global require */
/* global $, jQuery */
/* global I18n */
/* global WMEBase, WMEUI, WMEUIHelper, WMEUIHelperTab */
/* global Node$1, Segment, Venue, VenueAddress, WmeSDK */

(function () {
  'use strict'

  // Script name, uses as unique index
  const NAME = 'Switch U-turns'

  // Translations
  const TRANSLATION = {
    'en': {
      title: 'Switch U-Turns',
      description: 'Choose a segment or a node to switch U-turns with <strong>Keyboard shortcuts</strong> or buttons',
      count: 'Count nodes and U-Turns',
      switch: 'Switch U-turn at point',
      nodes: 'Nodes',
      allowed: 'Allowed',
      disallowed: 'Disallowed',
      allow: 'Allow all U-turns',
      disallow: 'Disallow all U-turns',
    },
    'uk': {
      title: 'Керування розворотами',
      description: 'Оберіть сегмент або вузол, щоб змінити розвороти за допомогою <strong>гарячих клавіш</strong> або кнопок',
      count: 'Порахувати вузли та розвороти',
      switch: 'Змінити розворот у вузлі',
      nodes: 'Вузли',
      allowed: 'Дозволено',
      disallowed: 'Заборонено',
      allow: 'Дозволити всі розвороти',
      disallow: 'Заборонити всі розвороти',
    },
    'ru': {
      title: 'Управление разворотами',
      description: 'Выберите сегмент или узел для изменения разворотов с помощью <strong>комбинаций клавиш</strong> или кнопок',
      count: 'Посчитать узлы и развороты',
      switch: 'Изменить разворот в узле',
      nodes: 'Узлы',
      allowed: 'Разрешено',
      disallowed: 'Запрещено',
      allow: 'Разрешить все развороты',
      disallow: 'Запретить все развороты',
    }
  }

  WMEUI.addTranslation(NAME, TRANSLATION)

  const STYLE =
    'p.switch-u-turns-counter { margin-top: 15px; padding-left: 15px; }' +
    'p.switch-u-turns-info { border-top: 1px solid #ccc; color: #777; font-size: x-small; margin-top: 15px; padding-top: 10px; text-align: center; }' +
    '#switch-u-turns { padding: 16px; }' +
    '#sidebar p.switch-u-turns-blue { background-color:#0057B8;color:white;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }' +
    '#sidebar p.switch-u-turns-yellow { background-color:#FFDD00;color:black;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }'

  WMEUI.addStyle(STYLE)

  const ALLOW = true
  const DISALLOW = false

  class UTurns extends WMEBase {
    constructor (name, settings = null) {
      super(name, settings)

      this.initHelper()

      this.initTab()

      this.initShortcuts()

      this.initHandlers()
    }

    initHelper() {
      /** @type {WMEUIHelper} */
      this.helper = new WMEUIHelper(this.name)
    }

    initTab() {
      /** @type {WMEUIHelperTab} */
      this.tab = this.helper.createTab(
        I18n.t(this.name).title,
        {
          sidebar: this.wmeSDK.Sidebar,
          image: GM_info.script.icon
        }
      )
      this.tab.addText('description', I18n.t(this.name).description)
      let button = this.tab.addButton(
        this.name,
        I18n.t(this.name).count,
        '',
        () => this.updateTabUI(this.countUturns())
      )
      button.html().className += ' waze-btn-blue'

      this.tab.addText('counter', '')
      this.tab.addText(
        'info',
        '<a href="' + GM_info.scriptUpdateURL + '">' + GM_info.script.name + '</a> ' + GM_info.script.version
      )
      this.tab.addText('blue', 'made in')
      this.tab.addText('yellow', 'Ukraine')
      // Inject custom HTML to container in the WME interface
      this.tab.inject()
    }

    initShortcuts () {
      let shortcuts = [
        // Hotkeys for node manipulation
        {
          callback: () => this.switchNodeUturn(true),
          description: I18n.t(NAME).allow,
          shortcutId: this.id + '-node-allow',
          shortcutKeys: 'A+A',
        },
        {
          callback: () => this.switchNodeUturn(false),
          description: I18n.t(NAME).disallow,
          shortcutId: this.id + '-node-disallow',
          shortcutKeys: 'A+S',
        },
        // Hotkeys for segment manipulation
        {
          callback: () => this.switchSegmentUturn('A'),
          description: I18n.t(NAME).switch + ' A',
          shortcutId: this.id + '-segment-a',
          shortcutKeys: 'A+Q',
        },
        {
          callback: () => this.switchSegmentUturn('B'),
          description: I18n.t(NAME).switch + ' B',
          shortcutId: this.id + '-segment-b',
          shortcutKeys: 'A+W',
        },
      ]

      for (let i = 0; i < shortcuts.length; i++) {
        let shortcut = shortcuts[i]

        if (this.wmeSDK.Shortcuts.areShortcutKeysInUse({ shortcutKeys: shortcut.shortcutKeys })) {
          this.log('Shortcut already in use')
          shortcut.shortcutKeys = null
        }
        this.wmeSDK.Shortcuts.createShortcut(shortcut);
      }
    }

    /**
     * Update count of UTurns on events
     */
    initHandlers () {
      this.wmeSDK.Events.on({
        eventName: "wme-after-undo",
        eventHandler: () => this.updateNodeUI(),
      });
      this.wmeSDK.Events.on({
        eventName: "wme-after-redo-clear",
        eventHandler: () => this.updateNodeUI(),
      });
    }

    /**
     * Handler for `node.wme` event
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Node$1} node
     * @return {void}
     */
    onNode (event, element, node) {
      if (node.connectedSegmentIds.length < 2 ) {
        return
      }

      if (!this.wmeSDK.DataModel.Nodes.canEditTurns({ nodeId: node.id })) {
        this.log('You don\'t have permissions to edit this turns')
        return
      }

      this.removePanel(element)
      this.createPanel(element)
      this.updateNodeUI()
    }

    /**
     * Added controls
     * @param {HTMLElement} element
     */
    createPanel (element) {
      // Container
      let container = document.createElement('div')
      container.id = this.id
      // Separator space
      container.append(document.createElement('hr'))
      // Title
      let title = document.createElement('p')
      title.innerText = I18n.t(NAME).title
      container.append(title)
      // Text
      this.text = document.createElement('p')
      container.append(this.text)
      // Allow button
      this.allow = document.createElement('wz-button')
      this.allow.color = 'shadowed'
      this.allow.innerText = I18n.t(NAME).allow
      this.allow.onclick = () => this.switchNodeUturn(ALLOW)
      this.allow.style.marginBottom = '4px'
      container.append(this.allow)
      // Disallow button
      this.disallow = document.createElement('wz-button')
      this.disallow.color = 'shadowed'
      this.disallow.innerText = I18n.t(NAME).disallow
      this.disallow.onclick = () => this.switchNodeUturn(DISALLOW)
      container.append(this.disallow)

      element.parentNode.append(container)
    }

    /**
     * Remove controls
     * @param {HTMLElement} element
     */
    removePanel(element) {
      element.parentNode.querySelector('#' + this.id)?.remove()
    }

    /**
     * Update counter for the plugin tab
     * @param {Object} counter
     */
    updateTabUI (counter) {
      this.tab.html().querySelector('p.switch-uturns-counter').innerHTML = '' +
        I18n.t(NAME).nodes + ': ' + counter.nodes + '<br/>' +
        I18n.t(NAME).allowed + ': ' + counter.allowed + '<br/>' +
        I18n.t(NAME).disallowed + ': ' + counter.disallowed
    }

    /**
     * Updated buttons status and counters
     */
    updateNodeUI () {
      let node = this.getSelectedNode()

      if (!node) {
        return
      }
      let counter = this.countNodeUturns(node)

      // Change display properties of the buttons
      this.allow.style.display = counter.disallowed ? 'flex' : 'none'
      this.disallow.style.display = counter.allowed ? 'flex' : 'none'

      // Change text
      this.text.innerHTML =
        I18n.t(NAME).allowed + ': ' + counter.allowed + '<br/>' +
        I18n.t(NAME).disallowed + ': ' + counter.disallowed
    }

    /**
     * @return {{nodes: number, allowed: number, disallowed: number}}
     */
    countUturns () {
      let counters = {
        nodes: 0,
        allowed: 0,
        disallowed: 0
      }

      let nodes = this.getAllNodes()

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i]
        let counter = this.countNodeUturns(node)
            counters.nodes++
            counters.allowed += counter.allowed
            counters.disallowed += counter.disallowed
      }

      return counters
    }

    /**
     * @param {Object} node
     * @return {{allowed: number, disallowed: number}}
     */
    countNodeUturns (node) {
      let turns = this.wmeSDK.DataModel.Turns.getTurnsThroughNode( { nodeId: node.id } )
      turns = turns.filter( turn => turn.isUTurn )

      return  {
        allowed: turns.filter( turn => turn.isAllowed ).length,
        disallowed: turns.filter( turn => !turn.isAllowed ).length
      }
    }

    /**
     * Handler for selected node
     * @param {Boolean} status ALLOW or DISALLOW
     */
    switchNodeUturn (status) {
      let node = this.getSelectedNode()

      if (!node) {
        return
      }

      if (!this.wmeSDK.DataModel.Turns.canEditTurnsThroughNode( { nodeId: node.id } )) {
        return
      }

      let turns = this.wmeSDK.DataModel.Turns.getTurnsThroughNode( { nodeId: node.id } )
      turns = turns.filter( turn => turn.isUTurn )
      turns = turns.filter( turn => turn.isAllowed !== status )
      if (turns.length === 0) {
        this.log('Node ID=' + node.id + ': all u-turns are ' + (status ? 'ALLOW' : 'DISALLOW'))
      }

      for (let i = 0; i < turns.length; i++) {
        let turn = turns[i]
        if (this.wmeSDK.DataModel.Turns.getById({ turnId: turn.id })) {
          this.wmeSDK.DataModel.Turns.updateTurn({ turnId: turn.id, isAllowed: status })
          this.log('Turn ID=' + turn.id + ' switched to ' + (status ? 'ALLOW' : 'DISALLOW'))
        } else {
          this.log('Turn ID=' + turn.id + ' Not Found')
        }
      }

      this.updateNodeUI()

      this.log('Node ID=' + node.id + ': ' + turns.length + ' u-turns have switched to ' + (status ? 'ALLOW' : 'DISALLOW'))
    }

    /**
     * Handler for selected segments
     * @param direction
     */
    switchSegmentUturn (direction = 'A') {
      let segments = this.getSelectedSegments()
      for (let i = 0, total = segments.length; i < total; i++) {
        let segment = segments[i]
        if (!segment.isTwoWay) {
          continue;
        }
        let nodeId = (direction === 'A') ? segment.fromNodeId : segment.toNodeId

        if (!this.wmeSDK.DataModel.Turns.canEditTurnsThroughNode( { nodeId: nodeId } )) {
          return
        }

        let status = this.wmeSDK.DataModel.Turns.isTurnAllowed({ fromSegmentId: segment.id, nodeId: nodeId, toSegmentId: segment.id })

        let turns = this.wmeSDK.DataModel.Turns.getTurnsThroughNode( { nodeId: nodeId } )
        turns = turns.filter( turn => turn.isUTurn )
        turns = turns.filter( turn => turn.fromSegmentId === segment.id && turn.toSegmentId === segment.id )

        if (turns.length === 0) {
          continue
        }

        // it should be always only one turn, but who knows
        for (let i = 0; i < turns.length; i++) {
          let turn = turns[i]

          if (this.wmeSDK.DataModel.Turns.getById({ turnId: turn.id })) {
            this.wmeSDK.DataModel.Turns.updateTurn({ turnId: turn.id, isAllowed: !status })
          }
        }

        this.log('U-turn in the point ' + direction + ' switched to ' + (status ? 'ALLOW' : 'DISALLOW'))
      }
    }
  }

  $(document)
    .on('bootstrap.wme', () => {
      new UTurns(NAME)
    })
})()
