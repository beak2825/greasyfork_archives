// ==UserScript==
// @name         WME E95
// @name:uk      WME 🇺🇦 E95
// @name:ru      WME 🇺🇦 E95
// @version      0.10.2
// @description  Setup road properties with templates
// @description:uk Швидке налаштування атрибутів вулиці за шаблонами
// @description:ru Настройка атрибутов улиц по шаблонам
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-e95/issues
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         data:image/png;base64,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
// @grant        none
// @require      https://update.greasyfork.org/scripts/389765/1090053/CommonUtils.js
// @require      https://update.greasyfork.org/scripts/450160/1704233/WME-Bootstrap.js
// @require      https://update.greasyfork.org/scripts/450221/1691071/WME-Base.js
// @require      https://update.greasyfork.org/scripts/450320/1688694/WME-UI.js
// @downloadURL https://update.greasyfork.org/scripts/382614/WME%20E95.user.js
// @updateURL https://update.greasyfork.org/scripts/382614/WME%20E95.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* global require */
/* global $, jQuery */
/* global I18n */
/* global WMEBase, WMEUI, WMEUIHelper, WMEUIHelperControlButton */
/* global Container, Settings, SimpleCache, Tools  */
/* global Node$1, Segment, Venue, VenueAddress, WmeSDK */

(function () {
  'use strict'

  // Script name, uses as unique index
  const NAME = 'E95'

  // Translations
  const TRANSLATION = {
    'en': {
      title: 'Quick Properties',
      description: 'Apply the road\'s settings by one click',
      help: 'You can use the <strong>Keyboard shortcuts</strong> to apply the settings. It\'s more convenient than clicking on the buttons.',
      layers: {
        speedLimit: 'Speed Limit',
        headlights: 'Headlights'
      }
    },
    'uk': {
      title: 'Швидкі налаштування',
      description: 'Застосовуйте швидкі налаштування для доріг за один клік',
      help: 'Використовуйте <strong>гарячі клавіши</strong>, це значно швидше ніж використовувати кнопки',
      layers: {
        speedLimit: 'Обмеження Швидкості',
        headlights: 'Ввімкнені фари'
      }
    },
    'ru': {
      title: 'Быстрые настройки',
      description: 'Применяйте быстрые настройки для дорог в один клик',
      help: 'Используйте <strong>комбинации клавиш</strong>, и не надо будет клацать кнопки',
      layers: {
        speedLimit: 'Ограничение скорости',
        headlights: 'Включены фары'
      }
    }
  }

  WMEUI.addTranslation(NAME, TRANSLATION)

  const STYLE =
    'polyline.warning { stroke: #ff0000; stroke-dasharray: 2 8; stroke-opacity: 0.8; stroke-width: 2; }' +
    '.e95 .controls { display: grid; grid-template-columns: repeat(6, 44px); gap: 6px; padding: 0; }' +
    '.e95 button.e95 { width:44px;margin:0;padding:2px;display:flex;justify-content:center;border:1px solid #eee;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.1);white-space:nowrap;color:#333; } ' +
    '.e95 button.e95:hover { box-shadow:0 2px 8px 0 rgba(0,0,0,.1),inset 0 0 100px 100px rgba(255,255,255,.3) } ' +
    'p.e95-info { border-top: 1px solid #ccc; color: #777; font-size: x-small; margin-top: 15px; padding-top: 10px; text-align: center; }' +
    '#sidebar p.e95-blue { background-color:#0057B8;color:white;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }' +
    '#sidebar p.e95-yellow { background-color:#FFDD00;color:black;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }'

  WMEUI.addStyle(STYLE)

  const SETTINGS = {
    styleContext: {
      color: (context) => {
        const style = context?.feature?.properties?.style;
        if (!style)
          return style;
        return style?.color;
      },
    },
    styleRules: [
        {
          predicate: (properties) => properties.styleName === "stylePolyline",
          style: {
            stroke: true,
            strokeColor: '${color}',
            strokeDashstyle: 'longdash',
            strokeLinecap: 'round', // [butt | round | square]
            strokeOpacity: 1,
            strokeWidth: 4,
          },
        }
      ],
  };

  const LAYERS = {
    speedLimit: {
      enabled: false,
      color: '#f00',
      callback: function(segment) {
        // one-way road and speed limit do not exist
        if (segment.isAtoB && !segment.fwdSpeedLimit) {
          return true
        }
        // one-way road and speed limit do not exist
        if (segment.isBtoA && !segment.revSpeedLimit) {
          return true
        }
        // two-way road
        return segment.isTwoWay && (!segment.fwdSpeedLimit || !segment.revSpeedLimit);
      }
    },
    headlights: {
      enabled: false,
      color: '#88ffee',
      callback: (segment) => segment.flagAttributes.headlights
    },
  }

  // Road Types
  // https://www.waze.com/editor/sdk/variables/index.SDK.ROAD_TYPE.html
  const TYPES = {
    street: 1,
    primary: 2,
    freeway: 3,
    ramp: 4,
    trail: 5,
    major: 6,
    minor: 7,
    offroad: 8,
    walkway: 9,
    boardwalk: 10,
    ferry: 15,
    stairway: 16,
    private: 17,
    railroad: 18,
    runway: 19,
    parking: 20,
    narrow: 22
  }

  // Road colors by type
  const COLORS = {
    '1': '#ffffeb',
    '2': '#f0ea58',
    '3': '#bd74c9',
    '4': '#ababab',
    '5': '#ffffff',
    '6': '#45b1c8',
    '7': '#63b27f',
    '8': '#867342',
    // ...
    '17': '#beba6c',
    // ...
    '20': '#ababab'
  }

  // Road Flags
  // https://www.waze.com/editor/sdk/interfaces/index.SDK.SegmentFlagAttributes.html
  /*
  const FLAGS = {
    beacons: false,
    fwdLanesEnabled: false,
    fwdSpeedCamera: false,
    headlights: false,
    nearbyHOV: false,
    revLanesEnabled: false,
    revSpeedCamera: false,
    tunnel: false,
    unpaved: false
  }
  */

  //
  // Buttons:
  //   title - for buttons
  //   shortcut:
  //    - keys for shortcuts, by default, are Alt + (1..9)
  //    - https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
  //   options:
  //    - detectCity - try to detect the city name by closures segments
  //    - clearCity - clear the city and the street
  //   attributes:
  //    - https://www.waze.com/editor/sdk/classes/index.SDK.Segments.html#updatesegment
  //
  //   A | B | C | D | E | F
  //   G | H | I | J | K | L
  //
  const BUTTONS = {
    A: {
      title: 'PR 5',
      shortcut: 'A+1',
      options: {
        detectCity: true,
      },
      attributes: {
        fwdSpeedLimit: 5,
        revSpeedLimit: 5,
        roadType: TYPES.private,
        lockRank: 0,
      }
    },
    B: {
      title: 'PR20',
      shortcut: 'A+2',
      options: {
        detectCity: true,
      },
      attributes: {
        fwdSpeedLimit: 20,
        revSpeedLimit: 20,
        roadType: TYPES.private,
        lockRank: 0,
      }
    },
    C: {
      title: 'PR50',
      shortcut: 'A+3',
      options: {
        detectCity: true,
      },
      attributes: {
        fwdSpeedLimit: 50,
        revSpeedLimit: 50,
        roadType: TYPES.private,
        lockRank: 0,
      }
    },
    D: {
      title: 'St50',
      shortcut: 'A+4',
      options: {
        detectCity: true,
      },
      attributes: {
        fwdSpeedLimit: 50,
        revSpeedLimit: 50,
        roadType: TYPES.street,
        lockRank: 0,
      }
    },
    E: {
      title: 'PS50',
      shortcut: 'A+5',
      options: {
        detectCity: true,
      },
      attributes: {
        fwdSpeedLimit: 50,
        revSpeedLimit: 50,
        roadType: TYPES.primary,
        lockRank: 1,
      }
    },
    F: {
      title: 'mH50',
      shortcut: null,
      options: {
        detectCity: true,
      },
      attributes: {
        fwdSpeedLimit: 50,
        revSpeedLimit: 50,
        roadType: TYPES.minor,
        lockRank: 2,
      }
    },
    G: {
      title: 'PLR',
      shortcut: 'A+6',
      options: {
        detectCity: true,
      },
      attributes: {
        fwdSpeedLimit: 5,
        revSpeedLimit: 5,
        roadType: TYPES.parking,
        lockRank: 0,
      }
    },
    H: {
      title: 'OR',
      shortcut: 'A+7',
      options: {},
      attributes: {
        fwdSpeedLimit: 90,
        revSpeedLimit: 90,
        roadType: TYPES.offroad,
        lockRank: 0,
      }
    },
    I: {
      title: 'PR90',
      shortcut: 'A+8',
      options: {},
      attributes: {
        fwdSpeedLimit: 90,
        revSpeedLimit: 90,
        roadType: TYPES.private,
        lockRank: 0,
      }
    },
    J: {
      title: 'St90',
      shortcut: 'A+9',
      options: {},
      attributes: {
        fwdSpeedLimit: 90,
        revSpeedLimit: 90,
        roadType: TYPES.street,
        lockRank: 0,
      }
    },
    K: {
      title: 'PS90',
      shortcut: 'A+0',
      options: {},
      attributes: {
        fwdSpeedLimit: 90,
        revSpeedLimit: 90,
        roadType: TYPES.primary,
        lockRank: 1,
      }
    },
    L: {
      title: 'mH90',
      shortcut: null,
      options: {},
      attributes: {
        fwdSpeedLimit: 90,
        revSpeedLimit: 90,
        roadType: TYPES.minor,
        lockRank: 2,
      }
    }
  }

  // codes of countries
  const COUNTRIES = {
    none: 0,
    albania: 2,
    greece: 85,
    hungary: 99,
    portugal: 181,
    ukraine: 232
  }

  // country specified buttons config
  const CONFIGS = {
    // None use the default configuration
    0: {},
    // Albania
    2: {
      A: {
        title: 'PLR',
        shortcut: 'A+7',
        options: {
          detectCity: true,
        },
        attributes: {
          fwdSpeedLimit: 5,
          revSpeedLimit: 5,
          roadType: TYPES.parking,
          lockRank: 0,
        }
      },
      B: {
        title: 'Pr40',
        attributes: {
          fwdSpeedLimit: 40,
          revSpeedLimit: 40,
          roadType: TYPES.private,
          lockRank: 1,
        }
      },
      C: {
        title: 'St40',
        attributes: {
          fwdSpeedLimit: 40,
          revSpeedLimit: 40,
          roadType: TYPES.street,
          lockRank: 1,
        }
      },
      D: {
        title: 'PS40',
        attributes: {
          fwdSpeedLimit: 40,
          revSpeedLimit: 40,
          roadType: TYPES.primary,
          lockRank: 1,
        }
      },
      E: {
        title: 'mH40',
        attributes: {
          fwdSpeedLimit: 40,
          revSpeedLimit: 40,
          roadType: TYPES.minor,
          lockRank: 2,
        }
      },
      F: {
        title: 'MH40',
        attributes: {
          fwdSpeedLimit: 40,
          revSpeedLimit: 40,
          roadType: TYPES.major,
          lockRank: 3,
        },
      },
      G: {
        title: 'FW90',
        attributes: {
          fwdSpeedLimit: 90,
          revSpeedLimit: 90,
          roadType: TYPES.freeway,
          lockRank: 4,
        }
      },
      H: {
        title: 'Pr80',
        attributes: {
          fwdSpeedLimit: 80,
          revSpeedLimit: 80,
          roadType: TYPES.private,
          lockRank: 1,
        }
      },
      I: {
        title: 'St80',
        attributes: {
          fwdSpeedLimit: 80,
          revSpeedLimit: 80,
          roadType: TYPES.street,
          lockRank: 1,
        }
      },
      J: {
        title: 'PS80',
        attributes: {
          fwdSpeedLimit: 80,
          revSpeedLimit: 80,
          roadType: TYPES.primary,
          lockRank: 1,
        }
      },
      K: {
        title: 'mH80',
        attributes: {
          fwdSpeedLimit: 80,
          revSpeedLimit: 80,
          roadType: TYPES.minor,
          lockRank: 2,
        }
      },
      L: {
        title: 'MH80',
        attributes: {
          fwdSpeedLimit: 80,
          revSpeedLimit: 80,
          roadType: TYPES.major,
          lockRank: 3,
        }
      }
    },
    // Greece
    85: {
      D: {
        title: 'ST30',
        attributes: {
          fwdSpeedLimit: 30,
          revSpeedLimit: 30,
          roadType: TYPES.street,
        },
      },
      E: {
        title: 'ST50',
        attributes: {
          fwdSpeedLimit: 50,
          revSpeedLimit: 50,
          roadType: TYPES.street,
        },
      },
      F: {
        title: 'ST90',
        attributes: {
          fwdSpeedLimit: 90,
          revSpeedLimit: 90,
          roadType: TYPES.street,
        },
      },
      J: {
        title: 'PR30',
        options: {},
        attributes: {
          fwdSpeedLimit: 30,
          revSpeedLimit: 30,
          roadType: TYPES.primary,
        },
      },
      K: {
        title: 'PR50',
        options: {},
        attributes: {
          fwdSpeedLimit: 50,
          revSpeedLimit: 50,
          roadType: TYPES.primary,
        },
      },
      L: {
        title: 'PR90',
        options: {},
        attributes: {
          fwdSpeedLimit: 90,
          revSpeedLimit: 90,
          roadType: TYPES.primary,
        },
      },
      M: {
        title: 'PRV',
        attributes: {
          roadType: TYPES.private,
        },
      },
      N: {
        title: 'UN',
        options: {},
        attributes: {
          flagAttributes: { unpaved: true },
          roadType: TYPES.street,
        },
      },
      O: {
        title: 'UN40',
        attributes: {
          flagAttributes: { unpaved: true },
          fwdSpeedLimit: 40,
          revSpeedLimit: 40,
          roadType: TYPES.street,
        },
      },
      P: {
        title: 'ST',
        options: {},
        attributes: {
          roadType: TYPES.street,
        },
      },
    },
    // Hungary
    99: {
      A: {
        title: 'PR20',
        attributes: {
          fwdSpeedLimit: 20,
          revSpeedLimit: 20,
        }
      },
      B: {
        title: 'PR30',
        attributes: {
          fwdSpeedLimit: 30,
          revSpeedLimit: 30,
        }
      },
      G: {
        title: 'PLR',
        attributes: {
          fwdSpeedLimit: 20,
          revSpeedLimit: 20
        }
      },
    },
    // Portugal
    181: {
      G: {
        title: 'PLR',
        attributes: {
          fwdSpeedLimit: 30,
          revSpeedLimit: 30,
        }
      },
      H: {
        title: 'OR',
        attributes: {
          fwdSpeedLimit: 30,
          revSpeedLimit: 30,
        }
      }
    },
    // Ukraine
    232: {
      H: {
        options: {
          clearCity: true
        },
        attributes: {
          flagAttributes: {
            headlights: true
          }
        }
      },
      I: {
        attributes: {
          flagAttributes: {
            headlights: true
          }
        }
      },
      J: {
        attributes: {
          flagAttributes: {
            headlights: true
          }
        }
      },
      K: {
        attributes: {
          flagAttributes: {
            headlights: true
          }
        }
      },
      L: {
        attributes: {
          flagAttributes: {
            headlights: true
          }
        }
      },
    }
  }

  class E95 extends WMEBase {
    constructor (name, layers, buttons, config) {
      super(name, { layers })

      this.buttons = null
      this.panel = null
      this.layers = {}

      this.initHelper()
      this.initTab()
      this.initLayers()
      this.initHandlers(buttons, config)
    }

    /**
     * Initialization of WMEUIHelper
     */
    initHelper() {
      this.helper = new WMEUIHelper(this.name)
    }

    /**
     * Initialization of WMEUIHelperTab
     */
    initTab () {
      let tab = this.helper.createTab(
        I18n.t(this.name).title,
        {
          sidebar: this.wmeSDK.Sidebar,
          image: GM_info.script.icon
        }
      )
      tab.addText('description', I18n.t(this.name).description)
      tab.addDiv('text', I18n.t(this.name).help)
      tab.addText(
        'info',
        '<a href="' + GM_info.scriptUpdateURL + '">' + GM_info.script.name + '</a> ' + GM_info.script.version
      )
      tab.addText('blue', 'made in')
      tab.addText('yellow', 'Ukraine')
      tab.inject().then(() => this.log('Script Tab Initialized') )
    }

    /**
     * Initial the layers
     */
    initLayers () {
      let layers = this.settings.get('layers')

      for (let layerName in layers) {
        if (layers.hasOwnProperty(layerName)) {
          this.initLayer(layerName)
        }
      }
    }

    /**
     * Initial the layer: set visibility to true and add the checkbox for this layer
     */
    initLayer (layerName) {
      this.layers[layerName] = this.name + ': ' + I18n.t(NAME)['layers'][layerName]

      this.wmeSDK.Map.addLayer({
        layerName: this.layers[layerName],
        styleRules: SETTINGS.styleRules,
        styleContext: SETTINGS.styleContext
      });

      this.wmeSDK.Map.setLayerVisibility({ layerName: this.layers[layerName], visibility: this.settings.get('layers', layerName, 'enabled')});

      this.wmeSDK.LayerSwitcher.addLayerCheckbox({ name: this.layers[layerName] });
      this.wmeSDK.LayerSwitcher.setLayerCheckboxChecked({ name: this.layers[layerName], isChecked: this.settings.get('layers', layerName, 'enabled') })

      if (this.settings.get('layers', layerName, 'enabled')) {
        this.wmeSDK.Events.trackDataModelEvents({ dataModelName: "segments" })
      }
    }

    initHandlers (buttons, config) {
      // initial loading
      this.wmeSDK.Events.on({
        eventName: "wme-map-data-loaded",
        eventHandler: () => {
          if (this.wmeSDK.DataModel.Countries.getTopCountry()?.id
            && !this.buttons) {
            this.initButtons(buttons, config)
            this.initShortcuts()
          }
        }
      })

      // the layer toggled
      this.wmeSDK.Events.on({
        eventName: "wme-layer-checkbox-toggled",
        eventHandler: (e) => {
          if (Object.values(this.layers).includes(e.name)) {
            let layerKey = Object.keys(this.layers).find(key => this.layers[key] === e.name)
            this.wmeSDK.Map.setLayerVisibility({ layerName: e.name, visibility: e.checked });
            this.settings.set(['layers', layerKey, 'enabled'], e.checked)

            let layers = this.settings.get('layers')

            let enabledLayers = false

            for (let layerName in layers) {
              if (layers.hasOwnProperty(layerName) && layers[layerName].enabled) {
                enabledLayers = true
                break
              }
            }

            if (enabledLayers) {
              this.wmeSDK.Events.trackDataModelEvents({ dataModelName: "segments" })
              this.highlightSegments()
            } else {
              this.wmeSDK.Events.stopDataModelEventsTracking({ dataModelName: "segments" })
            }
          }
        }
      })

      // added a new model
      this.wmeSDK.Events.on({
        eventName: "wme-data-model-objects-added",
        eventHandler: (e) => {
          if (e.dataModelName === 'segments' && e.objectIds.length) {
            for (let i = 0; i < e.objectIds.length; i++) {
              let segmentId = e.objectIds[i]
              let segment = this.wmeSDK.DataModel.Segments.getById({ segmentId })
              this.highlightSegment(segment)
            }
          }
        }
      })

      // changed a model
      this.wmeSDK.Events.on({
        eventName: "wme-data-model-objects-changed",
        eventHandler: (e) => {
          // segments were changed
          if (e.dataModelName === 'segments' && e.objectIds.length) {
            for (let i = 0; i < e.objectIds.length; i++) {
              let segmentId = e.objectIds[i]
              this.removeHighlight(segmentId)

              let segment = this.wmeSDK.DataModel.Segments.getById({ segmentId })
              // try to highlight a changed segment
              this.highlightSegment(segment)
            }
          }
        }
      })

      // remove a model
      this.wmeSDK.Events.on({
        eventName: "wme-data-model-objects-removed",
        eventHandler: (e) => {
          if (e.dataModelName === 'segments' && e.objectIds.length) {
            for (let i = 0; i < e.objectIds.length; i++) {
              this.removeHighlight(e.objectIds[i])
            }
          }
        }
      })
    }

    /**
     * Preparation of the buttons
     * @param {Object} buttons
     * @param {Object} config
     */
    initButtons (buttons, config) {
      // check country configuration
      let country = this.wmeSDK.DataModel.Countries.getTopCountry()?.id

      this.log("Load configuration for County with ID: " + country)
      // test buttons layout for the country:
      // country = COUNTRIES.greece

      // load country configuration if needed
      if (country && config[country]) {
        buttons = Tools.mergeDeep(buttons, config[country])
      }

      this.buttons = {}

      // reload buttons
      for (let key in buttons) {
        let button = buttons[key]

        this.buttons[key] = {
          title: button.title,
          color: COLORS[button.attributes.roadType],
          callback: () => this.buttonCallback(button),
          shortcut: buttons[key].shortcut,
          description: button.title + ' - ' +
            I18n.t('segment.road_types')[button.attributes.roadType] + '; ' +
            I18n.t('edit.segment.fields.speed_limit') + ' ' +
            I18n.t('measurements.speed.km', { speed: button.attributes.fwdSpeedLimit })
        }
      }
      // this.log('Buttons loaded')
    }

    /**
     * Initialization of the Shortcuts
     */
    initShortcuts () {
      for (let key in this.buttons) {
        if (this.buttons.hasOwnProperty(key)) {
          let button = this.buttons[key]
          if (button.hasOwnProperty('shortcut')) {
            let shortcut = {
              callback: button.callback,
              description: button.description,
              shortcutId: this.id + '-' + key,
              shortcutKeys: button.shortcut,
            };

            if (shortcut.shortcutKeys && this.wmeSDK.Shortcuts.areShortcutKeysInUse({ shortcutKeys: shortcut.shortcutKeys })) {
              this.log('Shortcut already in use')
              shortcut.shortcutKeys = null
            }
            this.wmeSDK.Shortcuts.createShortcut(shortcut);
          }
        }
      }
    }

    /**
     * Get HTML of the panel
     * @return {HTMLElement}
     */
    getPanel () {
      if (this.panel) {
       return this.panel
      }

      // Build panel
      // Container for buttons
      let controls = document.createElement('div')
          controls.className = 'controls'
      // Create buttons
      for (let key in this.buttons) {
        let button = this.buttons[key]

        let UIButton = new WMEUIHelperControlButton(
          this.id,
          key,
          button.title,
          button.description,
          () => button.callback()
        )
        let buttonElement = UIButton.html()
        buttonElement.dataset[NAME] = key
        buttonElement.style.backgroundColor = button.color
        controls.appendChild(buttonElement)
      }
      let label = document.createElement('wz-label')
      label.htmlFor = ''
      label.innerText = I18n.t(NAME).title

      this.panel = document.createElement('div')
      this.panel.className = 'form-group ' + this.id
      this.panel.appendChild(label)
      this.panel.appendChild(controls)

      return this.panel
    }

    /**
     * Draw segments without Speed Limits
     */
    highlightSegments () {
      let segments = this.getAllSegments()

      for (let i = 0; i <= segments.length; i++ ) {
        this.highlightSegment(segments[i])
      }
    }

    /**
     * Draw a segment on the E95 Layer
     * @param segment
     */
    highlightSegment (segment) {
      if (!segment?.id) {
        return
      }
      if (segment.id < 0) {
        return
      }
      // skip not drivable segments
      if (!this.wmeSDK.DataModel.Segments.isRoadTypeDrivable({ roadType: segment.roadType })) {
        return
      }

      let layers = this.settings.get('layers')

      for (let layerName in layers) {
        if (layers.hasOwnProperty(layerName)) {
          let layer = layers[layerName]
          if (layer.enabled && layer.callback(segment)) {
            if (!this.wmeSDK.Map.getFeatureDomElement({ layerName: this.layers[layerName], featureId: segment.id })) {
              // add a new feature to the layer
              let feature = turf.lineString(
                segment.geometry.coordinates,
                { styleName: "stylePolyline", style: { color: layer.color } },
                { id: segment.id })
              this.wmeSDK.Map.addFeatureToLayer({ layerName: this.layers[layerName], feature: feature });
            }
          }
        }
      }
    }

    /**
     * Remove a segment from the E95 Layer
     * @param segmentId
     */
    removeHighlight (segmentId) {
      if (!segmentId) {
        return
      }

      let layers = this.settings.get('layers')

      for (let layerName in layers) {
        if (layers.hasOwnProperty(layerName)) {
          if (this.wmeSDK.Map.getFeatureDomElement({ layerName: this.layers[layerName], featureId: segmentId })) {
            this.wmeSDK.Map.removeFeatureFromLayer({ layerName: this.layers[layerName], featureId: segmentId })
          }
        }
      }
    }

    /**
     * Handler for `segment.wme` event
     * Create UI controls every time when updated DOM of sidebar
     * Uses native JS function for better performance
     *
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Segment} model
     * @return {void}
     */
    onSegment (event, element, model) {
      // Skip for walking trails and blocked roads
      if ( this.wmeSDK.DataModel.Segments.isRoadTypeDrivable({ roadType: model.roadType })
        && this.wmeSDK.DataModel.Segments.hasPermissions({ segmentId: model.id, permission: 'EDIT_PROPERTIES' })
      ) {
        element.prepend( this.getPanel() )
      } else {
        // Remove the panel
        element.querySelector('div.form-group.e95')?.remove()
      }
    }

    /**
     * Handler for `segments.wme` event
     * Create UI controls every time when updated DOM of sidebar
     * Uses native JS function for better performance
     *
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Array<Segment>} models
     * @return {void}
     */
    onSegments (event, element, models) {
      // Skip for walking trails or locked roads
      if (models.filter((model) =>
        this.wmeSDK.DataModel.Segments.isRoadTypeDrivable({ roadType: model.roadType })
        && this.wmeSDK.DataModel.Segments.hasPermissions({ segmentId: model.id, permission: 'EDIT_PROPERTIES' })
      ).length > 0) {
        element.prepend( this.getPanel() )
      } else {
        // Remove the panel
        element.querySelector('div.form-group.e95')?.remove()
      }
    }

    /**
     * Handler for Road buttons
     * @param button
     */
    buttonCallback (button) {
      this.group('apply "' + button.title + '"')
      // Get all selected segments
      let segments = this.getSelectedSegments()
      let options = button.options
      let attributes = button.attributes

      // Try to detect the city, if needed
      if (options.detectCity) {
        let cityId = null
        for (let i = 0, total = segments.length; i < total; i++) {
          cityId = this.detectCity(segments[i])
          if (cityId) {
            options.cityId = cityId
            this.log('detected city id: ' + cityId)
            break
          }
        }
      }

      // Apply settings to all segments
      for (let i = 0, total = segments.length; i < total; i++) {
        this.updateSegment(segments[i], options, attributes)
      }
      this.groupEnd()
    }

    /**
     * Update segment attributes
     * @param {Object} segment
     * @param {Object} options
     * @param {Object} attributes
     */
    updateSegment (segment, options, attributes = {}) {
      const getEmptyCity = () => {
        return this.wmeSDK.DataModel.Cities.getCity({
            countryId: this.wmeSDK.DataModel.Countries.getTopCountry().id,
            cityName: ''
          })
          || this.wmeSDK.DataModel.Cities.addCity({
            countryId: this.wmeSDK.DataModel.Countries.getTopCountry().id,
            cityName: ''
          })
      }

      const getEmptyStreet = (cityId) => {
        return this.wmeSDK.DataModel.Streets.getStreet({
            cityId: cityId,
            streetName: '',
          })
          || this.wmeSDK.DataModel.Streets.addStreet({
            cityId: cityId,
            streetName: ''
          })
      }

      // current segment address
      let address = this.wmeSDK.DataModel.Segments.getAddress({ segmentId: segment.id})

      // check address information
      let cityId = address.city?.id || null
      let streetId = address.street?.id || null

      // set flags
      let cityIsEmpty = address.city ? address.city.isEmpty : true
      let streetIsEmpty = address.street ? address.street.isEmpty : true

      if (options.clearCity) {
        // clear the city option
        cityId = getEmptyCity().id
        streetId = getEmptyStreet(cityId)?.id
        this.log('clear city and use the empty city id: ' + cityId)
      } else if (cityIsEmpty && options.detectCity && options.cityId) {
        // detect the city option
        cityId = options.cityId
        this.log('use the detected city id: ' + cityId)
      } else if (cityIsEmpty && options.detectCity) {
        // top city
        // cityId = this.wmeSDK.DataModel.Cities.getTopCity()?.id
        // this.log('use the top city if available: ' + cityId)
        this.log('city not detected, skip')
      }

      // empty city
      if (!cityId) {
        cityId = getEmptyCity().id
        this.log('use the empty city id: ' + cityId)
      }

      // empty street
      if (!streetId || streetIsEmpty) {
        streetId = getEmptyStreet(cityId)?.id
        this.log('use the empty street id: ' + streetId)
      }

      // update street
      if (streetId !== address.street?.id) {
        this.wmeSDK.DataModel.Segments.updateAddress({
          segmentId: segment.id,
          primaryStreetId: streetId
        })
        this.log('apply the street id: ' + streetId)
      }

      // keep the current lock level if it is higher than in the config's attributes
      if (segment.lockRank > attributes.lockRank) {
        attributes.lockRank = segment.lockRank
        this.log('use current lock rank: ' + (attributes.lockRank + 1) + ' ⚠️')
      }

      // use user lock rank if it lower than we want to apply
      if (attributes.lockRank > this.wmeSDK.State.getUserInfo().rank) {
        attributes.lockRank = this.wmeSDK.State.getUserInfo().rank
        this.log('use user lock rank: ' + (attributes.lockRank + 1) + ' ⚠️')
      }

      // need more logs
      this.log('set road type to "' + I18n.t('segment.road_types')[attributes.roadType] + '"')

      // Get the keys from the source object you want to check
      const keysToCompare = Object.keys(attributes);

      // Use .some() to find if *any* key has a different value.
      // .some() stops looping as soon as it finds one `true` match.
      const shouldUpdate = keysToCompare.some(key => {
        return attributes[key] !== segment[key];
      });

      if (shouldUpdate) {
        attributes.segmentId = segment.id
        this.wmeSDK.DataModel.Segments.updateSegment(attributes)
        this.log("segment updated");
      } else {
        this.log("no update needed");
      }
    }

    /**
     * Detect city ID by connected segments
     * @param {Object} segment
     * @return {Number|null}
     */
    detectCity (segment) {
      this.log('detect a city')
      let address = this.wmeSDK.DataModel.Segments.getAddress({ segmentId: segment.id })

      // check the city of the segment
      if (address.city?.name && !address.city?.isEmpty) {
        return address.city.id
      }

      // check the city of the connected segments
      let connected = []

      connected = connected.concat(this.wmeSDK.DataModel.Segments.getConnectedSegments({ segmentId: segment.id }))
      connected = connected.concat(this.wmeSDK.DataModel.Segments.getConnectedSegments({ segmentId: segment.id, reverseDirection: true }))

      let cities = connected.map(segment => this.wmeSDK.DataModel.Segments.getAddress({ segmentId: segment.id }).city)

      // cities of the connected segments
      cities = cities.filter(city => city) // filter segments w/out city
      cities = cities.filter(city => !city.isEmpty) // filter empty city name
      cities = cities.map(city => city.id) // extract cities id
      cities = [...new Set(cities)] // unique cities

      if (cities.length) {
        return cities.shift() // use the first one
      }
      return null
    }
  }

  $(document).on('bootstrap.wme', () => {
    new E95(NAME, LAYERS, BUTTONS, CONFIGS)
  })
})()
