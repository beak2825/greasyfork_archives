// ==UserScript==
// @name         WME E40 Geometry
// @name:uk      WME 🇺🇦 E40 Geometry
// @name:ru      WME 🇺🇦 E40 Geometry
// @version      0.10.5
// @description  A script that allows aligning, scaling, and copying POI geometry
// @description:uk За допомогою цього скрипта ви можете легко змінювати площу та вирівнювати POI
// @description:ru Данный скрипт позволяет изменять площадь POI, выравнивать и копировать геометрию
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-e40/issues
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         data:image/png;base64,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
// @grant        none
// @require      https://update.greasyfork.org/scripts/389765/1090053/CommonUtils.js
// @require      https://update.greasyfork.org/scripts/450160/1704233/WME-Bootstrap.js
// @require      https://update.greasyfork.org/scripts/450221/1691071/WME-Base.js
// @require      https://update.greasyfork.org/scripts/450320/1688694/WME-UI.js
//
// @require      https://cdn.jsdelivr.net/npm/@turf/turf@7.2.0/turf.min.js
// @downloadURL https://update.greasyfork.org/scripts/388271/WME%20E40%20Geometry.user.js
// @updateURL https://update.greasyfork.org/scripts/388271/WME%20E40%20Geometry.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* global require */
/* global $, jQuery */
/* global I18n */
/* global WMEBase, WMEUI, WMEUIHelper, WMEUIHelperFieldset */
/* global Container, Settings, SimpleCache, Tools */
/* global Node$1, Segment, Venue, VenueAddress, WmeSDK */
/* global turf */

(function () {
  'use strict'

  // Script name, uses as unique index
  const NAME = 'E40'

  // User level required for apply geometry for all entities in the view area
  const REQUIRED_LEVEL = 2

  // Translations
  const TRANSLATION = {
    'en': {
      title: 'POI Geometry',
      description: 'Change geometry in the current view area',
      options: {
        title: 'Navigation Points',
        navigationPoint: 'Highlight entrance for selected place',
        navigationPointAll: 'Highlight all entrances for selected place',
        navigationPointOnHover: 'Highlight entrance on hover',
      },
      warning: '⚠️ This option is available for editors with a rank higher than ' + REQUIRED_LEVEL,
      help: 'You can use the <strong>Keyboard shortcuts</strong> to apply the settings. It\'s more convenient than clicking on the buttons.',
      orthogonalize: 'Orthogonalize',
      smooth: 'Smooth',
      simplify: 'Simplify',
      scale: 'Scale',
      rotate: 'Rotate',
      circle: 'Circle',
      square: 'Square',
      copy: 'Copy',
      about: '<a href="https://greasyfork.org/uk/scripts/388271-wme-e40-geometry">WME E40 Geometry</a>',
    },
    'uk': {
      title: 'Геометрія POI',
      description: 'Змінити геометрію об’єктів у поточному розташуванні',
      options: {
        title: 'Точки навігації',
        navigationPoint: 'Підсвічувати навігацію до місця',
        navigationPointAll: 'Підсвічувати навігацію до всіх точок входу',
        navigationPointOnHover: 'Підсвічувати навігацію за наведенням мишки',
      },
      warning: '⚠️ Ця опція доступна лише для редакторів з рангом вищім ніж ' + REQUIRED_LEVEL,
      help: 'Використовуйте <strong>гарячі клавіши</strong>, це значно швидше ніж використовувати кнопки',
      orthogonalize: 'Вирівняти',
      smooth: 'Згладити',
      simplify: 'Спростити',
      scale: 'Масштабувати',
      rotate: 'Повернути',
      circle: 'Круг',
      square: 'Квадрат',
      copy: 'Копіювати',
      about: '<a href="https://greasyfork.org/uk/scripts/388271-wme-e40-geometry">WME E40 Geometry</a>',
    },
    'ru': {
      title: 'Геометрия POI',
      description: 'Изменить геометрию объектов в текущем расположении',
      options: {
        title: 'Точки навигации',
        navigationPoint: 'Показывать навигацию до выбранного места',
        navigationPointAll: 'Показывать навигацию ко всем точкам входа',
        navigationPointOnHover: 'Подсвечивать навигацию при наведении мыши',
      },
      warning: '⚠️ Эта опция доступна для редакторов с рангов выше ' + REQUIRED_LEVEL,
      help: 'Используйте <strong>комбинации клавиш</strong>, и не надо будет клацать кнопки',
      orthogonalize: 'Выровнять',
      smooth: 'Сгладить',
      simplify: 'Упростить',
      scale: 'Масштабировать',
      rotate: 'Повернуть',
      circle: 'Круг',
      square: 'Квадрат',
      copy: 'Копировать',
      about: '<a href="https://greasyfork.org/uk/scripts/388271-wme-e40-geometry">WME E40 Geometry</a>',
    }
  }
  const SETTINGS = {
    options: {
      navigationPoint: true,
      navigationPointAll: false,
      navigationPointOnHover: false,
    },
  }

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

  WMEUI.addTranslation(NAME, TRANSLATION)

  const STYLE =
    '.e40 .controls { display: grid; grid-template-columns: repeat(6, 44px); gap: 6px; padding: 0; }' +
    '.e40 .button-toolbar { display: flex; flex-wrap: wrap; gap: 0 6px; align-items: center; }' +
    '.e40 .button-toolbar button.e40 { min-height: 30px; line-height: 25px; margin-bottom: 16px; }' +
    '.e40 button.e40 { width:44px;margin:0;padding:2px;display:flex;justify-content:center;border:1px solid #eee;cursor:pointer;box-shadow:0 1px 2px rgba(0,0,0,.1);white-space:nowrap;color:#333; flex-wrap: wrap; align-content: center;} ' +
    '.e40 button.e40:hover { box-shadow:0 2px 8px 0 rgba(0,0,0,.1),inset 0 0 100px 100px rgba(255,255,255,.3) } ' +
    '.e40 button.e40-M, .e40 button.e40-N, .e40 button.e40-O, .e40 button.e40-P, .e40 button.e40-R, .e40 button.e40-S { min-height: 50px; } ' +

    '.form-group.e40 legend { cursor:pointer; font-size: 12px; font-weight: bold; width: auto; text-align: right; border: 0; margin: 0; padding: 0 8px; }' +
    '.form-group.e40 fieldset { border: 1px solid #ddd; padding: 8px; width: 100%; margin-bottom: 16px; }' +

    'section.tab-pane .form-group.e40 div.controls { display: block; padding: 8px; }' +
    'section.tab-pane .form-group.e40 div.controls:empty, #panel-container .archive-panel .body:empty { min-height: 20px; }' +
    'section.tab-pane .form-group.e40 div.controls:empty::after, #panel-container .archive-panel .body:empty::after { color: #ccc; padding: 0 8px; content: "' + I18n.t(NAME).notFound + '" }' +
    'section.tab-pane .form-group.e40 div.controls label { white-space: normal; font-weight: normal; margin-top: 5px; line-height: 18px; font-size: 13px; }' +
    'section.tab-pane .form-group.e40 div.controls input[type="text"] { float:right; }' +
    'section.tab-pane .form-group.e40 div.controls input[type="number"] { float:right; width: 60px; text-align:right; }' +

    '#sidebar p.e40 { width: 100%; }' +
    '#sidebar p.e40-info { border-top: 1px solid #ccc; color: #777; font-size: x-small; margin-top: 15px; padding-top: 10px; text-align: center; }' +
    '#sidebar p.e40-warning { color: #f77 }' +
    '#sidebar p.e40-blue { background-color:#0057B8;color:white;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }' +
    '#sidebar p.e40-yellow { background-color:#FFDD00;color:black;height:32px;text-align:center;line-height:32px;font-size:24px;margin:0; }'

  WMEUI.addStyle(STYLE)

  const layerConfig = {
    styleContext: {},
    styleRules: [
      {
        predicate: (properties) => properties.styleName === "styleNode",
        style: {
          pointRadius: 4,
          fillColor: '#ffffff',
          strokeColor: '#14e2d9',
          strokeWidth: 3,
          strokeLinecap: 'round',
          // graphicName: 'x',
          graphicZIndex: 9999,
        },
      },
      {
        predicate: (properties) => properties.styleName === "styleLine",
        style: {
          strokeWidth: 3,
          strokeColor: '#14e2d9',
          strokeLinecap: 'round',
          graphicZIndex: 9999,
        }
      },
      {
        predicate: (properties) => properties.styleName === "styleSecondaryLine",
        style: {
          strokeWidth: 2,
          strokeColor: '#ffffff',
          strokeLinecap: 'round',
          graphicZIndex: 9999,
        }
      },
      {
        predicate: (properties) => properties.styleName === "styleDashedLine",
        style: {
          strokeWidth: 2,
          strokeColor: '#ffffff',
          strokeLinecap: 'round',
          strokeDashstyle: 'dash',
          graphicZIndex: 9999,
        }
      },
      {
        predicate: (properties) => properties.styleName === "styleDashedSecondaryLine",
        style: {
          strokeWidth: 1,
          strokeColor: '#ffffff',
          strokeLinecap: 'round',
          strokeDashstyle: 'dash',
          graphicZIndex: 9999,
        }
      }
    ],
  };

  // https://fontawesome.com/v4/icons/
  const placeButtons = {
    A: {
      title: '<i class="fa fa-circle-thin" aria-hidden="true"></i>',
      description: I18n.t(NAME).smooth,
      shortcut: 'S+49',
      callback: () => smooth()
    },
    B: {
      title: '<i class="fa fa-square-o" aria-hidden="true"></i>',
      description: I18n.t(NAME).orthogonalize,
      shortcut: 'S+50',
      callback: () => orthogonalize()
    },
    C: {
      title: '1️⃣ 📐',
      description: I18n.t(NAME).simplify + ' (tolerance = 0.00001)',
      shortcut: null,
      callback: () => simplify(0.00001)
    },
    D: {
      title: '3️⃣ 📐',
      description: I18n.t(NAME).simplify + ' (tolerance = 0.00003)',
      shortcut: null,
      callback: () => simplify(0.00003)
    },
    E: {
      title: '5️⃣ 📐',
      description: I18n.t(NAME).simplify + ' (tolerance = 0.00005)',
      shortcut: null,
      callback: () => simplify(0.00005)
    },
    F: {
      title: '<i class="fa fa-clone" aria-hidden="true"></i>',
      description: I18n.t(NAME).copy,
      shortcut: null,
      callback: () => copyPlaces()
    },
    G: {
      title: '<i class="fa fa-repeat" aria-hidden="true"></i>',
      description: I18n.t(NAME).rotate,
      shortcut: 'S+51',
      callback: () => enablePolygonRotation()
    },
    H: {
      title: '<i class="fa fa-expand" aria-hidden="true"></i>',
      description: I18n.t(NAME).scale,
      shortcut: 'S+52',
      callback: () => enablePolygonResize()
    },
    I: {
      title: '500m²',
      description: I18n.t(NAME).scale + ' 500m²',
      shortcut: 'S+53',
      callback: () => scale(500)
    },
    J: {
      title: '650m²',
      description: I18n.t(NAME).scale + ' 650m²',
      shortcut: 'S+54',
      callback: () => scale(650)
    },
    K: {
      title: '650+',
      description: I18n.t(NAME).scale + ' 650+',
      shortcut: 'S+55',
      callback: () => scale(650, true)
    },
  }

  const pointButtons = {
    M: {
      title: '<i class="fa fa-circle-thin fa-2x" aria-hidden="true"></i> 500m²',
      description: I18n.t(NAME).circle,
      shortcut: null,
      callback: () => circle(503, 32)
    },
    N: {
      title: '<i class="fa fa-circle-thin fa-2x" aria-hidden="true"></i> 650m²',
      description: I18n.t(NAME).circle,
      shortcut: null,
      callback: () => circle(651, 64)
    },
    O: {
      title: '<i class="fa fa-circle-thin fa-2x" aria-hidden="true"></i> R=20m',
      description: I18n.t(NAME).circle,
      shortcut: null,
      callback: () => circle(1256.64, 64)
    },
    P: {
      title: '<i class="fa fa-square-o fa-2x" aria-hidden="true"></i> 500m²',
      description: I18n.t(NAME).square,
      shortcut: null,
      callback: () => square(500)
    },
    R: {
      title: '<i class="fa fa-square-o fa-2x" aria-hidden="true"></i> 650m²',
      description: I18n.t(NAME).square,
      shortcut: null,
      callback: () => square(650)
    },
    S: {
      title: '<i class="fa fa-square-o fa-2x" aria-hidden="true"></i> 1000m²',
      description: I18n.t(NAME).square,
      shortcut: null,
      callback: () => square(1000)
    },
  }

  const tabButtons = {
    A: {
      title: '<i class="fa fa-square-o" aria-hidden="true"></i>',
      description: I18n.t(NAME).orthogonalize,
      callback: () => orthogonalizeAll()
    },
    B: {
      title: '1️⃣ 📐',
      description: I18n.t(NAME).simplify,
      callback: () => simplifyAll(0.00001)
    },
    C: {
      title: '3️⃣ 📐',
      description: I18n.t(NAME).simplify,
      callback: () => simplifyAll(0.00003)
    },
    D: {
      title: '5️⃣ 📐',
      description: I18n.t(NAME).simplify,
      callback: () => simplifyAll(0.00005)
    },
    E: {
      title: '500+',
      description: I18n.t(NAME).scale + ' 500m²+',
      callback: () => scaleAll(500, true)
    }
  }

  class E40 extends WMEBase {
    constructor (name, settings, tabButtons, placeButtons, pointButtons) {
      super(name, settings)

      this.initHelper()

      this.initTab(tabButtons)

      this.initPlacePanel(placeButtons)

      this.initShortcuts(placeButtons)

      this.initPointPanel(pointButtons)

      this.initLayer()

      this.initHandlers()
    }

    /**
     * Initializes the helper instance for the class
     * by creating a new WMEUIHelper object.
     */
    initHelper() {
      this.helper = new WMEUIHelper(this.name)
    }

    /**
     * Initialize the tab with buttons
     * @param {Object} buttons
     */
    initTab (buttons) {
      let tab = this.helper.createTab(
        I18n.t(this.name).title,
        {
          sidebar: this.wmeSDK.Sidebar,
          image: GM_info.script.icon
        }
      )

      tab.addText('description', I18n.t(this.name).description)
      if (this.wmeSDK.State.getUserInfo().rank >= REQUIRED_LEVEL) {
        tab.addButtons(buttons)
      } else {
        tab.addText('warning', I18n.t(this.name).warning)
      }

      /** @type {WMEUIHelperFieldset} */
      let fsOptions = this.helper.createFieldset(I18n.t(this.name).options.title)
      let options = this.settings.get('options')
      for (let item in options) {
        if (options.hasOwnProperty(item)) {
          fsOptions.addCheckbox(
            item,
            I18n.t(this.name).options[item],
            (event) => this.settings.set(['options', item], event.target.checked),
            this.settings.get('options', item)
          )
        }
      }
      tab.addElement(fsOptions)

      tab.addDiv('text', I18n.t(this.name).help)

      tab.addText(
        'info',
        '<a href="' + GM_info.scriptUpdateURL + '">' + GM_info.script.name + '</a> ' + GM_info.script.version
      )
      tab.addText('blue', 'made in')
      tab.addText('yellow', 'Ukraine')
      tab.inject()
    }

    initPlacePanel (buttons) {
      this.placePanel = this.helper.createPanel(
        I18n.t(this.name).title
      )
      this.placePanel.addButtons(buttons)
    }

    initPointPanel (buttons) {
      this.pointPanel = this.helper.createPanel(
        I18n.t(this.name).title
      )
      this.pointPanel.addButtons(buttons)
    }

    initShortcuts (buttons) {
      for (let btn in buttons) {
        if (buttons.hasOwnProperty(btn)) {
          let button = buttons[btn]
          if (button.hasOwnProperty('shortcut')) {
            let shortcut = {
              callback: button.callback,
              description: button.description,
              shortcutId: this.id + '-' + btn,
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

    initLayer () {
      this.wmeSDK.Map.addLayer({
        layerName: this.name,
        styleRules: layerConfig.styleRules,
        styleContext: layerConfig.styleContext
      });
      this.wmeSDK.Map.setLayerVisibility({ layerName: this.name, visibility: false });
    }

    initHandlers () {
      this.wmeSDK.Events.trackDataModelEvents({ dataModelName: "venues" });
      this.wmeSDK.Events.on({
        eventName: "wme-data-model-objects-changed",
        eventHandler: ({dataModelName, objectIds}) => {
          this.refreshPanel()

          let selected = this.getSelectedVenue()

          if (
            dataModelName === 'venues'
            && selected
            && objectIds.length > 0
            && objectIds.indexOf(selected.id) !== -1
            && this.settings.get('options', 'navigationPoint')
          ) {
            this.removeVectors()
            this.showVector(selected.id)
          }
        }
      });

      if (this.settings.get('options', 'navigationPointOnHover')) {
        this.wmeSDK.Events.trackLayerEvents({ layerName: "venues" });

        this.wmeSDK.Events.on({
          eventName: "wme-layer-feature-mouse-enter",
          eventHandler: ({ featureId }) => {
            this.showVector(featureId)
          },
        });

        this.wmeSDK.Events.on({
          eventName: "wme-layer-feature-mouse-leave",
          eventHandler: ({ featureId }) => {
            let selected = this.getSelectedVenue()
            if (selected?.id !== featureId) {
              this.removeVector(
                this.wmeSDK.DataModel.Venues.getById({ venueId : featureId })
              )
            }
          },
        });
      }
    }

    showVector (featureId) {
      let venue = this.wmeSDK.DataModel.Venues.getById({ venueId : featureId })

      let center, entrance, intersection, intersectionDistance

      if (venue.geometry.type === 'Polygon') {
        center = turf.centroid(venue.geometry).geometry.coordinates
      } else {
        center = venue.geometry.coordinates
      }

      let segments = this.wmeSDK.DataModel.Segments.getAll()
      let except = [TYPES.boardwalk, TYPES.stairway, TYPES.railroad, TYPES.runway]

      segments = segments.filter(segment => except.indexOf(segment.roadType) === -1)

      if (venue.navigationPoints.length) {

        for (let i = 0; i < venue.navigationPoints.length; i++) {
          let point = venue.navigationPoints[i].point.coordinates
          let nearestPoint = this.findNearestPoint(segments, point)

          this.createVector(featureId + '_' + i, center, point, (i === 0) ? 'styleDashedLine' : 'styleDashedSecondaryLine')
          this.createVector(featureId + '_' + i, point, nearestPoint, (i === 0) ? 'styleLine' : 'styleSecondaryLine')

          if (i === 0
            && !this.settings.get('options', 'navigationPointAll')) {
            break
          }
        }

      } else {
        let nearestPoint = this.findNearestPoint(segments, center)
        this.createVector(featureId, center, nearestPoint, 'styleLine')
      }
      this.showLayer()
    }

    /**
     * Finds the nearest point to a given point from a set of segments.
     *
     * @param {Array} segments - An array of segments where each segment contains a geometry property representing a line.
     * @param {Object} point - The reference point to find the nearest point to.
     * @return {Array} An array representing the coordinates of the nearest point to the given point.
     */
    findNearestPoint(segments, point) {
      let nearestPoint, nearestPointCoordinates = [], nearestPointDistance

      for (let i = 0; i < segments.length; i++) {
        let segment = segments[i]

        try {
          nearestPoint = turf.nearestPointOnLine(segment.geometry, point)

          let distance = turf.distance(
            nearestPoint,
            point,
            {
              units: 'meters'
            }
          )

          if (nearestPointDistance === undefined || distance < nearestPointDistance) {
            nearestPointDistance = distance
            nearestPointCoordinates = nearestPoint.geometry.coordinates
          }
        } catch (e) {
          this.log('Error while finding nearest point')
        }
      }

      return nearestPointCoordinates
    }

    /**
     * Create the vector by coordinates
     * @param {String} featureId
     * @param {[Number,Number]} from coordinates
     * @param {[Number,Number]} to coordinates
     * @param {String} styleName style name
     */
    createVector (featureId, from, to, styleName = 'styleLine') {
      const A = turf.point(from, { styleName: "styleNode" }, { id: `${styleName}_from_${featureId}` });
      const B = turf.point(to, { styleName: "styleNode" }, { id: `${styleName}_to_${featureId}` });

      this.wmeSDK.Map.addFeatureToLayer({ layerName: this.name, feature: A });
      this.wmeSDK.Map.addFeatureToLayer({ layerName: this.name, feature: B });

      const lineCoordinates = [
        A.geometry.coordinates,
        B.geometry.coordinates,
      ];

      // https://www.waze.com/editor/sdk/interfaces/index.SDK.FeatureStyle.html
      const line = turf.lineString(lineCoordinates, {
        styleName: styleName,
      }, { id: `${styleName}_line_${featureId}` });

      this.wmeSDK.Map.addFeatureToLayer({ layerName: this.name, feature: line });
    }

    /**
     * Remove all vectors from the layer for the current venue
     */
    removeVector (venue) {
      let featureIds = []

      if (venue.navigationPoints?.length) {
        for (let i = 0; i < venue.navigationPoints.length; i++) {
          let featureId = venue.id + '_' + i

          if (i === 0) {
            featureIds.push(`styleLine_from_${featureId}`)
            featureIds.push(`styleLine_to_${featureId}`)
            featureIds.push(`styleLine_line_${featureId}`)
            featureIds.push(`styleDashedLine_from_${featureId}`)
            featureIds.push(`styleDashedLine_to_${featureId}`)
            featureIds.push(`styleDashedLine_line_${featureId}`)
          } else {
            featureIds.push(`styleSecondaryLine_from_${featureId}`)
            featureIds.push(`styleSecondaryLine_to_${featureId}`)
            featureIds.push(`styleSecondaryLine_line_${featureId}`)
            featureIds.push(`styleDashedSecondaryLine_from_${featureId}`)
            featureIds.push(`styleDashedSecondaryLine_to_${featureId}`)
            featureIds.push(`styleDashedSecondaryLine_line_${featureId}`)
          }
        }
      } else {
        let featureId = venue.id
        featureIds = [
          `styleLine_from_${featureId}`,
          `styleLine_to_${featureId}`,
          `styleLine_line_${featureId}`,
        ]
      }

      this.wmeSDK.Map.removeFeaturesFromLayer({ layerName: this.name, featureIds });
    }

    /**
     * Remove all vectors from the layer
     */
    removeVectors () {
      this.wmeSDK.Map.removeAllFeaturesFromLayer({ layerName: this.name });
    }

    /**
     * Show the Layer
     */
    showLayer () {
      this.wmeSDK.Map.setLayerVisibility({ layerName: this.name, visibility: true });
    }

    /**
     * Hide the Layer
     */
    hideLayer () {
      this.wmeSDK.Map.setLayerVisibility({ layerName: this.name, visibility: false });
    }

    /**
     * Handler for `place.wme` event
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Venue} model
     */
    onPlace (event, element, model) {
      if (this.wmeSDK.DataModel.Venues.hasPermissions({ venueId: model.id })) {
        this.createPlacePanel(event, element)
      }
    }

    /**
     * Handler for `point.wme` event
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Venue} model
     */
    onPoint (event, element, model) {
      if (this.wmeSDK.DataModel.Venues.hasPermissions({ venueId: model.id })) {
        this.createPointPanel(event, element)
      }
    }

    /**
     * Handler for `venue.wme` event
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Venue} model
     */
    onVenue (event, element, model) {
      if (this.settings.get('options', 'navigationPoint')) {
        this.showVector(model.id)
      }
    }

    /**
     * Handler for `venues.wme` event
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {Venue[]} models
     * @return {Null}
     */
    onVenues (event, element, models) {
      models = models.filter(model => !model.isResidential
        && this.wmeSDK.DataModel.Venues.hasPermissions({ venueId: model.id }))

      if (models.length > 0) {
        if (models[0].geometry.type === 'Polygon') {
          this.createPlacePanel(event, element)
        } else {
          this.createPointPanel(event, element)
        }
      }
    }

    /**
     * Handler for `none.wme` event
     * @return {Null}
     */
    onNone() {
      this.removeVectors()
      this.hideLayer()
    }

    /**
     * @param {String[]} except
     * @return {Venue[]} models
     */
    getAllPlaces(except = []) {
      let venues = this.getAllVenues(except)
      return venues.filter(venue => venue.geometry.type === 'Polygon')
    }

    /**
     * @return {Venue[]} models
     */
    getSelectedPlaces() {
      let venues = this.getSelectedVenues()
      return venues.filter(venue => venue.geometry.type === 'Polygon')
    }

    /**
     * Create the panel with buttons
     * @param event
     * @param {HTMLElement} element
     */
    createPlacePanel (event, element) {
      if (element?.querySelector('div.form-group.e40')) {
        return
      }

      element?.prepend(this.placePanel.html())
      this.updateLabel()
    }

    /**
     * Create the panel with buttons
     * @param event
     * @param {HTMLElement} element
     */
    createPointPanel (event, element) {
      if (element?.querySelector('div.form-group.e40')) {
        return
      }

      element?.prepend(this.pointPanel.html())
      this.updateLabel()
    }

    /**
     * Refresh the panel if something was changed
     */
    refreshPanel () {
      let venue = this.getSelectedVenue()

      let element = document.getElementById('venue-edit-general')
          element?.querySelector('div.form-group.e40')?.remove()

      if (venue) {
        if (venue.geometry.type === 'Polygon') {
          this.createPlacePanel(null, element)
        } else {
          this.createPointPanel(null, element)
        }
      }
    }

    /**
     * Updated label
     */
    updateLabel () {
      let places = this.getSelectedVenues()

      if (places.length === 0) {
        return
      }
      let info = []
      for (let i = 0; i < places.length; i++) {
        let place = places[i]
        if (place.geometry.type === 'Polygon') {
          info.push(Math.round(turf.area(place.geometry)) + 'm²')
        }
      }
      let label = I18n.t(NAME).title
      if (info.length) {
        label += ' (' + info.join(', ') + ')'
      }

      let elm = document.querySelector('div.form-group.e40 wz-label')
      if (elm) elm.innerText = label
    }

    /**
     * Scale places to X m²
     * @param {Venue[]} elements
     * @param {Number} x square meters
     * @param {Boolean} orMore flag
     */
    scale (elements, x, orMore = false) {
      this.group('scale ' + (elements.length) + ' element(s) to ' + x + 'm²')

      let total = 0
      for (let i = 0; i < elements.length; i++) {
        try {
          let scale = Math.sqrt((x + 5) / turf.area(elements[i].geometry))
          if (scale < 1 && orMore) {
            continue
          }

          let geometry = turf.transformScale(elements[i].geometry, scale)

          this.wmeSDK.DataModel.Venues.updateVenue({
            venueId: elements[i].id, geometry
          })

          total++
        } catch (e) {
          this.log('skipped', e)
        }
      }
      this.log(total + ' element(s) was scaled')
      this.groupEnd()
    }

    /**
     * Orthogonalize place(s)
     * @param {Venue[]} elements
     */
    orthogonalize (elements) {
      this.group('orthogonalize ' + (elements.length) + ' element(s)')
      let total = 0
      // skip points
      for (let i = 0; i < elements.length; i++) {
        try {
          let geometry = elements[i].geometry
          let area = turf.area(elements[i].geometry)

          geometry = simplifyPolygon(geometry)
          geometry = normalizeRightAngles(geometry)

          let scale = Math.sqrt(area / turf.area(geometry))

          this.log('Apply scale ' + scale)

          geometry = turf.transformScale(geometry, scale)

          if (!this.compare(elements[i].geometry.coordinates[0], geometry.coordinates[0])) {
            this.wmeSDK.DataModel.Venues.updateVenue({
              venueId: elements[i].id, geometry
            })
            total++
          }
        } catch (e) {
          this.log('skipped', e)
        }
      }
      this.log(total + ' element(s) was orthogonalized')
      this.groupEnd()
    }


    /**
     * Smooth place(s)
     * @param {Venue[]} elements
     */
    smooth (elements) {
      this.group('smooth ' + (elements.length) + ' element(s)')

      let total = 0
      for (let i = 0; i < elements.length; i++) {
        try {
          let geometry = turf.polygonSmooth(elements[i].geometry).features[0].geometry;

          if (geometry.coordinates[0].length !== elements[i].geometry.coordinates[0].length) {
            this.wmeSDK.DataModel.Venues.updateVenue({
              venueId: elements[i].id, geometry
            })
            total++
          }
        } catch (e) {
          this.log('skipped', e)
        }
      }
      this.log(total + ' element(s) was smoothed')
      this.groupEnd()
    }

    /**
     * Simplify place(s)
     * @param {Venue[]} elements
     * @param {Number} tolerance
     */
    simplify (elements, tolerance = 0.00001) {
      this.group('simplify ' + (elements.length) + ' element(s) with < tolerance=' + tolerance + ' >')

      let total = 0
      for (let i = 0; i < elements.length; i++) {
        try {
          let geometry = turf.simplify(elements[i].geometry, { tolerance })

          if (geometry.coordinates[0].length !== elements[i].geometry.coordinates[0].length) {
            this.wmeSDK.DataModel.Venues.updateVenue({
              venueId: elements[i].id, geometry
            })
            total++
          }
        } catch (e) {
          this.log('skipped', e)
        }
      }
      this.log(total + ' element(s) was simplified')
      this.groupEnd()
    }

    /**
     * Transform the Point to circle place
     *
     * @param {Venue[]} elements
     * @param {Number} area in square meters
     * @param {Number} steps
     */
    circle (elements, area, steps = 64) {
      this.group('transform ' + (elements.length) + ' element(s) to circle')

      let total = 0
      for (let i = 0; i < elements.length; i++) {
        try {
          let place = elements[i]
          let geometry = place.geometry

          if (geometry.type !== 'Point') {
            geometry = turf.centroid(geometry).geometry
          }

          let circle = createCirclePolygon(geometry, area, steps)

          this.wmeSDK.DataModel.Venues.updateVenue({
            venueId: place.id, geometry: circle.geometry
          })
          total++
        } catch (e) {
          this.log('skipped', e)
        }
      }

      this.log(total + ' element(s) was transformed')
      this.groupEnd()

      this.selectVenues(elements.map(e => String(e.id)))
    }

    /**
     * Transform the Point(s) to square place
     *
     * @param {Venue[]} elements
     * @param {Number} area in square meters
     */
    square (elements, area) {
      this.group('transform ' + (elements.length) + ' element(s) to square')

      let total = 0
      for (let i = 0; i < elements.length; i++) {
        try {
          let place = elements[i]

          let geometry = place.geometry

          if (geometry.type !== 'Point') {
            geometry = turf.centroid(geometry).geometry
          }

          let square = createSquarePolygon(geometry, area)

          this.wmeSDK.DataModel.Venues.updateVenue({
            venueId: place.id, geometry: square.geometry
          })

          total++
        } catch (e) {
          this.log('skipped', e)
        }
      }

      this.log(total + ' element(s) was transformed')
      this.groupEnd()

      this.selectVenues(elements.map(e => String(e.id)))
    }

    /**
     * @param {String[]} ids of venues
     */
    selectVenues(ids) {
      this.wmeSDK.Editing.clearSelection()

      // select changed elements
      setTimeout(() =>
        this.wmeSDK.Editing.setSelection({ selection: {
            ids: ids,
            objectType: 'venue'
          }}), 100)
    }

    /**
     * Create copy for place
     * @param {Venue} venue
     * @return {String}
     */
    copyPlace (venue) {
      this.log('created a copy of the POI ' + venue.name)

      let geometry = turf.transformTranslate(venue.geometry, 0.01, 0.005)

      let venueId = this.wmeSDK.DataModel.Venues.addVenue(
        {
          category: venue.categories[0],
          geometry: geometry
        }
      )

      venueId = String(venueId)

      this.wmeSDK.DataModel.Venues.updateVenue({
        venueId,
        name: venue.name + ' (copy)',
        // isAdLocked: venue.isAdLocked,
        // isResidential: venue.isResidential,
      })

      let address = E40Instance.wmeSDK.DataModel.Venues.getAddress( { venueId: venue.id } )

      if (address?.street?.id) {
        this.wmeSDK.DataModel.Venues.updateAddress(
          {
            venueId,
            streetId: address.street.id,
          }
        )
      }

      return venueId
    }

    /**
     * Compare two polygons point-by-point
     *
     * @param {Array} coordinates1
     * @param {Array} coordinates2
     * @return boolean
     */
    compare (coordinates1, coordinates2) {
      if (coordinates1.length !== coordinates2.length) {
        return false
      }
      for (let i = 0; i < coordinates1.length; i++) {
        if (Math.abs(coordinates1[i][0] - coordinates2[i][0]) > .00001
          || Math.abs(coordinates1[i][1] - coordinates2[i][1]) > .00001) {
          return false
        }
      }
      return true
    }
  }

  let E40Instance

  $(document).on('bootstrap.wme', () => {
    E40Instance = new E40(NAME, SETTINGS, tabButtons, placeButtons, pointButtons)
  })

  /**
   * Scale selected place(s) to X m²
   * @param {Number} x square meters
   * @param {Boolean} orMore flag
   * @return {boolean}
   */
  function scale (x, orMore = false) {
    E40Instance.scale(E40Instance.getSelectedPlaces(), x, orMore)
    return false
  }

  /**
   * Scale all places in the editor area to X m²
   * @param {Number} x square meters
   * @param {Boolean} orMore flag
   * @return {boolean}
   */
  function scaleAll (x = 650, orMore = true) {
    E40Instance.scale(E40Instance.getAllPlaces(), x, orMore)
    return false
  }

  /**
   * Orthogonalize selected place(s)
   * @return {boolean}
   */
  function orthogonalize () {
    E40Instance.orthogonalize(
      E40Instance.getSelectedPlaces()
    )
    return false
  }

  /**
   * Orthogonalize all places in the editor area
   * @return {boolean}
   */
  function orthogonalizeAll () {
    // skip parking, natural and outdoors
    // TODO: make options for filters
    E40Instance.orthogonalize(
      E40Instance.getAllPlaces([
        'CAMPING_TRAILER_PARK',
        'FOREST_GROVE',
        'JUNCTION_INTERCHANGE',
        'NATURAL_FEATURES',
        'OUTDOORS',
        'PARKING_LOT',
        'PLAYGROUND',
      ])
    )
    return false
  }

  /**
   * Smooth selected place(s)
   * @return {boolean}
   */
  function smooth () {
    E40Instance.smooth(
      E40Instance.getSelectedPlaces()
    )
    return false
  }

  /**
   * Simplify selected place(s)
   * @param {Number} tolerance
   * @return {boolean}
   */
  function simplify (tolerance = 0.00001) {
    E40Instance.simplify(
      E40Instance.getSelectedPlaces(),
      tolerance
    )
    return false
  }

  /**
   * Simplify all places in the editor area
   * @param {Number} tolerance
   * @return {boolean}
   */
  function simplifyAll (tolerance = 0.00001) {
    // skip parking, natural and outdoors
    E40Instance.simplify(
      E40Instance.getAllPlaces(['OUTDOORS', 'PARKING_LOT', 'NATURAL_FEATURES']),
      tolerance
    )
    return false
  }

  /**
   * Transform the Point to circle place
   * @param {Number} area in square meters
   * @param {Number} steps
   */
  function circle (area, steps = 64) {
    E40Instance.circle(
      E40Instance.getSelectedVenues(),
      area,
      steps
    )
    return false
  }

  /**
   * Transform the Point to square place
   * @param {Number} area in square meters
   */
  function square (area) {
    E40Instance.square(
      E40Instance.getSelectedVenues(),
      area
    )
    return false
  }

  /**
   * Copy selected places
   * Last of them will be chosen
   */
  function copyPlaces () {
    let venues = E40Instance.getSelectedPlaces()
    let ids = []
    for (let i = 0; i < venues.length; i++) {
      let id = E40Instance.copyPlace(venues[i])
      ids.push(id)
    }

    E40Instance.selectVenues(ids)
  }

  /**
   * wmeSDK.Map.enablePolygonResize()
   */
  function enablePolygonResize () {
    console.log(
      '%c' + NAME + ': %cenable resize for Polygon',
      'color: #0DAD8D; font-weight: bold',
      'color: dimgray; font-weight: normal'
    )
    let places = E40Instance.getSelectedPlaces()
    if (places.length) {
      E40Instance.wmeSDK.Map.enablePolygonResize()
    }
  }

  /**
   * wmeSDK.Map.enablePolygonRotation()
   */
  function enablePolygonRotation() {
    console.log(
      '%c' + NAME + ': %cenable rotation for Polygon',
      'color: #0DAD8D; font-weight: bold',
      'color: dimgray; font-weight: normal'
    )
    let places = E40Instance.getSelectedPlaces()
    if (places.length) {
      E40Instance.wmeSDK.Map.enablePolygonRotation()
    }
  }

  /**
   * Creates a GeoJSON Polygon representing a circle centered at a given point
   * with a radius calculated from a desired area in square meters.
   *
   * @param {object} centerPoint - A GeoJSON Point feature (e.g., turf.point([lon, lat])).
   * @param {number} areaSqMeters - The desired area of the circle in square meters (m²).
   * @param {number} [steps=64] - The number of steps/segments to create the circle (higher = smoother).
   * @returns {object} A GeoJSON Polygon Feature representing the circle.
   */
  function createCirclePolygon(centerPoint, areaSqMeters, steps = 64) {
    if (centerPoint.type !== 'Point') {
      throw new Error('Invalid centerPoint: Must be a GeoJSON Point feature.');
    }
    if (typeof areaSqMeters !== 'number' || areaSqMeters <= 0) {
      throw new Error('Invalid areaSqMeters: Must be a positive number.');
    }

    // 1. Calculate the required radius (R) from the Area (A)
    // The formula for the area of a circle is: A = π * R²
    // Rearranging for the radius: R = sqrt(A / π)
    const radiusMeters = Math.sqrt(areaSqMeters / Math.PI);

    // 2. Convert the radius from meters to kilometers (Turf.js default unit)
    const radiusKilometers = radiusMeters / 1000;

    // 3. Use turf.circle to create the polygon
    return turf.circle(centerPoint, radiusKilometers, {
      steps: steps,
      units: 'kilometers' // Explicitly set units, though it's the default
    });
  }

  /**
   * Creates a GeoJSON Polygon representing a square centered at a given point
   * with a side length calculated from a desired area in square meters.
   *
   * @param {object} centerPoint - A GeoJSON Point feature (e.g., turf.point([lon, lat])).
   * @param {number} areaSqMeters - The desired area of the square in square meters (m²).
   * @returns {object} A GeoJSON Polygon Feature representing the square.
   */
  function createSquarePolygon(centerPoint, areaSqMeters) {
    if (centerPoint.type !== 'Point') {
      throw new Error('Invalid centerPoint: Must be a GeoJSON Point feature.');
    }
    if (typeof areaSqMeters !== 'number' || areaSqMeters <= 0) {
      throw new Error('Invalid areaSqMeters: Must be a positive number.');
    }

    // 1. Calculate the required Side Length (S) from the Area (A)
    // The formula for the area of a square is: A = S²
    // Rearranging for the side length: S = sqrt(A)
    const sideLengthMeters = Math.sqrt(areaSqMeters);

    // 2. Calculate the distance from the center to any edge of the square
    // This is half the side length: HalfSide = S / 2
    const halfSideMeters = sideLengthMeters / 2;

    // 3. Since Turf.js typically handles distances in kilometers, convert the half-side.
    const halfSideKilometers = halfSideMeters / 1000;

    // 4. Calculate the bounding box (bbox) coordinates
    // We can use a combination of `turf/destination` or, more simply for a centered square,
    // manually calculate the offsets using Turf's distance handling for min/max coordinates.
    // However, a simpler approach is to calculate the bounding box for the square's corners.

    // A centered square's extent is defined by its center coordinates +/- (half-side in distance units).
    // The `turf/bbox` function is often used to get the extent of a feature, but here we need
    // to calculate the BBOX based on a distance from the center point.

    // Calculate the geographic bounding box [west, south, east, north]
    // Due to the complexities of Earth's curvature, calculating precise coordinates
    // by simply adding/subtracting distances (especially for large squares) is difficult.
    // A robust, though slightly over-engineered, way is to use the `turf/buffer` function
    // to approximate the square's corners.

    // A simpler approach for small, localized areas is to calculate the min/max coordinates
    // by using the `turf/transformScale` on a unit square. However, this is more complex.

    // A common and practical approximation for *small* areas:
    // const [lon, lat] = centerPoint.coordinates;

    // For simplicity, we'll use an approximation based on latitude/longitude differences.
    // WARNING: This approximation is only accurate for very small areas or near the equator.
    // For a highly accurate square, you would use geodesic distance functions (like turf/destination)
    // to find the four corners based on the center point and the half-side distance.

    // --- Robust Geodesic Calculation for the Four Corners ---
    const options = { units: 'kilometers' };

    // 45 degrees: Northeast, 135 degrees: Northwest, 225 degrees: Southwest, 315 degrees: Southeast
    const cornerNE = turf.destination(centerPoint, halfSideKilometers * Math.SQRT2, 45, options);
    const cornerSW = turf.destination(centerPoint, halfSideKilometers * Math.SQRT2, 225, options);

    const minLon = cornerSW.geometry.coordinates[0];
    const minLat = cornerSW.geometry.coordinates[1];
    const maxLon = cornerNE.geometry.coordinates[0];
    const maxLat = cornerNE.geometry.coordinates[1];

    // The BBOX format is [minX, minY, maxX, maxY] => [west, south, east, north]
    const calculatedBbox = [minLon, minLat, maxLon, maxLat];

    // 5. Use turf.bboxPolygon to create the square polygon from the bounding box
    return turf.bboxPolygon(calculatedBbox);
  }

  /**
   * Iteratively simplifies a GeoJSON Polygon ring by removing points that form
   * an angle between 175° and 180° with their neighbors.
   * @param {object} geojsonObject A GeoJSON Feature<Polygon> or Polygon geometry object.
   * @returns {object} The simplified GeoJSON Polygon geometry object (type: "Polygon").
   */
  function simplifyPolygon(geojsonObject) {
    let points = geojsonObject.coordinates[0].slice()
    const MIN_UNIQUE_POINTS = 4; // A, B, C, A (length 4) means 3 unique points (a triangle)
    const MIN_ANGLE = 175.0;
    const MAX_ANGLE = 185.0;
    let pointsRemoved = 0;
    let iteration = 0;

    console.log("--- Starting Polygon Simplification (175° to 185° removal) ---");

    while (points.length > MIN_UNIQUE_POINTS) {
      iteration++;
      let pointIndexToRemove = -1;

      // Check points from index 1 up to length - 2.
      for (let i = 1; i < points.length - 1; i++) {
        const angle = GeoUtils.findAngle(points[i - 1], points[i], points[i + 1]);

        if (angle >= MIN_ANGLE && angle <= MAX_ANGLE) {
          pointIndexToRemove = i;
          console.log(`[Iter ${iteration}] Found point to remove at index ${i} (${points[i].map(c => c.toFixed(2)).join(', ')}). Angle: ${angle.toFixed(4)}°`);
          break; // Remove only one point per iteration
        }
      }

      if (pointIndexToRemove !== -1) {
        points.splice(pointIndexToRemove, 1);
        pointsRemoved++;

        // Update the closure point
        points[points.length - 1] = points[0];
        console.log(`[Iter ${iteration}] Point removed. New length: ${points.length}. Unique points remaining: ${points.length - 1}.`);
      } else {
        console.log(`[Iter ${iteration}] No point found in the angle range [${MIN_ANGLE}°, ${MAX_ANGLE}°]. Stopping.`);
        break;
      }
    }

    if (points.length <= MIN_UNIQUE_POINTS) {
      console.log(`Reached minimum size of 3 unique points (array length ${points.length}). Stopping.`);
    }

    console.log(`--- Simplification Finished. Total points removed: ${pointsRemoved} ---`);

    return {
      type: "Polygon",
      coordinates: [points]
    };
  }

  /**
   * Moves vertices (P_curr) that form a near-90° angle (85-89.9 or 90.1-95)
   * to a new position (P'_curr) that forms exactly 90°.
   * @param {object} geojsonObject A GeoJSON Feature<Polygon> or Polygon geometry object.
   * @returns {object} The angle-normalized GeoJSON Polygon geometry object.
   */
  function normalizeRightAngles(geojsonObject) {
    let points = geojsonObject.coordinates[0].slice()

    let pointsAdjusted = 0;
    let totalIterations = 0;
    let changedInPass = true;

    console.log("--- Starting Angle Normalization (Near 90° adjustment) ---");

    // Iterate until no points are adjusted in a full pass
    while (changedInPass && totalIterations < 10) { // Safety limit for iterations
      changedInPass = false;
      totalIterations++;

      console.log(`[Iter ${totalIterations}] Start`)

      // Check points from index 1 up to length - 2.
      for (let i = 1; i < points.length; i++) {
        const pPrev = points[i - 1];
        const pCurr = points[i];
        const pNext = (i === points.length - 1) ? points[1] : points[i + 1];

        const angle = GeoUtils.findAngle(pPrev, pCurr, pNext);

        console.log(`[Point ${i}] Angle:`, angle.toFixed(4))

        // Check if the angle is in the target normalization ranges
        const inRange1 = angle >= 75.0 && angle <= 89.9;
        const inRange2 = angle >= 90.1 && angle <= 105.0;

        if (inRange1 || inRange2) {

          // Round coordinates to 6 decimal places for GeoJSON compatibility
          points[i] = GeoUtils.findRightAngleIntersection(pPrev, pCurr, pNext)

          let new_angle = GeoUtils.findAngle(pPrev, points[i], pNext);

          pointsAdjusted++;
          changedInPass = true;
          console.log(`[Point ${i}] Angle ${angle.toFixed(4)}° adjusted to ${new_angle.toFixed(4)}°.`);

          // The loop continues in the same pass. If points[i] is adjusted,
          // it affects the angle calculations for P_{i-1} and P_{i+1} in the next passes.
        }
      }
    }

    // Ensure the closure point is updated after all adjustments
    points[points.length - 1] = points[0];

    console.log(`--- Normalization Finished. Total points adjusted: ${pointsAdjusted} in ${totalIterations} passes. ---`);

    return {
      type: "Polygon",
      coordinates: [points]
    };
  }

  /**
   * A utility class for spherical geometry (geodesy).
   * Assumes points are [longitude, latitude] in degrees.
   */
  class GeoUtils {
    /**
     * @param {number} degrees
     * @return {number} radians
     * @private
     */
    static _toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }

    /**
     * @param {number} radians
     * @return {number} degrees
     * @private
     */
    static _toDegrees(radians) {
      return radians * (180 / Math.PI);
    }

    /**
     * Normalizes an angle to the range -180 to +180 degrees.
     *
     * @param {number} degrees
     * @return {number} degrees
     */
    static _normalizeAngle(degrees) {
      return (degrees + 540) % 360 - 180;
    }

    /**
     * Calculates the initial bearing from pA to pB.
     *
     * @param {[number,number]} pA - [lon, lat] of start point.
     * @param {[number,number]} pB - [lon, lat] of end point.
     * @returns {number} Initial bearing in degrees (0-360).
     */
    static getBearing(pA, pB) {
      const latA = GeoUtils._toRadians(pA[1]);
      const lonA = GeoUtils._toRadians(pA[0]);
      const latB = GeoUtils._toRadians(pB[1]);
      const lonB = GeoUtils._toRadians(pB[0]);

      const deltaLon = lonB - lonA;

      const y = Math.sin(deltaLon) * Math.cos(latB);
      const x = Math.cos(latA) * Math.sin(latB) -
        Math.sin(latA) * Math.cos(latB) * Math.cos(deltaLon);

      const bearingRad = Math.atan2(y, x);

      // Convert from -180/+180 to 0-360
      return (GeoUtils._toDegrees(bearingRad) + 360) % 360;
    }

    /**
     * Calculates the interior angle at vertex p2.
     *
     * @param {[number,number]} p1
     * @param {[number,number]} p2
     * @param {[number,number]} p3
     */
    static findAngle(p1, p2, p3) {
      const bearing21 = GeoUtils.getBearing(p2, p1);
      const bearing23 = GeoUtils.getBearing(p2, p3);
      let angle = Math.abs(bearing21 - bearing23);

      if (angle > 180) {
        angle = 360 - angle;
      }
      return angle;
    }

    /**
     * Calculate the approximate distance between two coordinates (lat/lon)
     *
     * @param {[number,number]} pA - [lon, lat] of start point.
     * @param {[number,number]} pB - [lon, lat] of end point.
     * @return {number} The distance in meters.
     */
    static getDistance (pA, pB) {
      return GeoUtils.getAngularDistance(pA, pB) * 6371000
    }

    /**
     * Calculates the angular distance between two points using the Haversine formula.
     *
     * @param {[number,number]} pA - [lon, lat] of start point.
     * @param {[number,number]} pB - [lon, lat] of end point.
     * @returns {number} The angular distance in radians.
     */
    static getAngularDistance(pA, pB) {
      const latA = GeoUtils._toRadians(pA[1]);
      const lonA = GeoUtils._toRadians(pA[0]);
      const latB = GeoUtils._toRadians(pB[1]);
      const lonB = GeoUtils._toRadians(pB[0]);

      const deltaLat = latB - latA;
      const deltaLon = lonB - lonA;

      const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(latA) * Math.cos(latB) *
        Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

      // c is the angular distance in radians
      return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    /**
     * Calculates the destination point given a start point, bearing, and distance.
     * @param {[number,number]} startPoint - [lon, lat] of start point.
     * @param {number} bearing - Bearing in degrees (0-360).
     * @param {number} distanceRad - Angular distance in radians.
     * @returns {number[]} The destination point [lon, lat] in degrees.
     */
    static getDestination(startPoint, bearing, distanceRad) {
      const lat1 = GeoUtils._toRadians(startPoint[1]);
      const lon1 = GeoUtils._toRadians(startPoint[0]);
      const brng = GeoUtils._toRadians(bearing);
      const d = distanceRad;

      const lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(d) +
        Math.cos(lat1) * Math.sin(d) * Math.cos(brng)
      );

      const lon2 = lon1 + Math.atan2(
        Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
        Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
      );

      // Normalize longitude to -180 to +180
      const lon2Deg = GeoUtils._toDegrees(lon2);
      const lat2Deg = GeoUtils._toDegrees(lat2);

      return [(lon2Deg + 540) % 360 - 180, lat2Deg];
    }

    /**
     * Finds the intersection of two great-circle paths.
     * Path 1: Defined by p1 and p2.
     * Path 2: Defined by p3 and an internal angle at p3.
     *
     * @param {[number,number]} p1 - First point of Line 1 [lon, lat].
     * @param {[number,number]} p2 - Second point of Line 1 [lon, lat].
     * @param {[number,number]} p3 - Start point of Line 2 [lon, lat].
     * @param {number} angle - The SIGNED internal angle at p2 (in degrees).
     * @returns {[number,number] | null} The intersection point [lon, lat], or null if lines are parallel.
     */
    static findIntersection(p1, p2, p3, angle) {
      // 1. Define the triangle P1-P3-X (A-C-B)
      //    A = p1, C = p3, B = X (intersection)

      // 2. Find known bearings
      const brng1_2 = GeoUtils.getBearing(p1, p2); // Bearing of Line 1
      const brng1_3 = GeoUtils.getBearing(p1, p3); // Bearing from p1 to p3

      // 3. Calculate internal angles A (at p1) and C (at p3)
      const angleA = GeoUtils._normalizeAngle(brng1_2 - brng1_3);
      const angleB = angle
      const angleC = GeoUtils._normalizeAngle(180 - angleA - angleB)

      // 4. Calculate known side b (angular distance p1-p3)
      const dist_b = GeoUtils.getAngularDistance(p1, p3); // in radians

      // Check for parallel lines
      if (Math.sin(GeoUtils._toRadians(angleA)) === 0 && Math.sin(GeoUtils._toRadians(angleC)) === 0) {
        return null; // Collinear
      }

      // 5. Find internal angle B (at intersection X) using Law of Cosines for angles
      const angleA_rad = GeoUtils._toRadians(angleA);
      const angleB_rad = GeoUtils._toRadians(angleB);
      const angleC_rad = GeoUtils._toRadians(angleC);

      // 5a. Find internal angle B (at intersection X) using Law of Cosines for angles
      let cos_B = -Math.cos(angleA_rad) * Math.cos(angleC_rad) +
        Math.sin(angleA_rad) * Math.sin(angleC_rad) * Math.cos(dist_b);
      cos_B = Math.max(-1, Math.min(1, cos_B)); // Clamp
      // angleB_rad = Math.acos(cos_B);

      // Check for parallel/collinear lines (angleB is 0 or 180)
      if (Math.abs(Math.sin(angleB_rad)) < 1e-9) {
        return null;
      }

      // 5b. Find side c (distance p1-X) using Law of Cosines (NOT Sines)
      //     cos(c) = (cos(C) + cos(A)cos(B)) / (sin(A)sin(B))
      let cos_c = (Math.cos(angleC_rad) + Math.cos(angleA_rad) * cos_B) /
        (Math.sin(angleA_rad) * Math.sin(angleB_rad));

      cos_c = Math.max(-1, Math.min(1, cos_c)); // Clamp
      const dist_c = Math.acos(cos_c); // This is dist_p1_X in radians

      // 6. Calculate the final intersection point X
      //    We have start (p1), bearing (brng1_X), and distance (dist_c)
      return GeoUtils.getDestination(p1, brng1_2, dist_c);
    }

    /**
     * Calculates the coordinates of point D in a right-angled spherical triangle ADC,
     * using Angle A and the hypotenuse AC.
     * Triangle ADC has a right angle at D (angle D = 90 deg),
     * and angle A and side AC are preserved from the original triangle ABC.
     *
     * @param {[number,number]} pA - [lon, lat] of point A.
     * @param {[number,number]} pB - [lon, lat] of point B (used to calculate angle A).
     * @param {[number,number]} pC - [lon, lat] of point C.
     * @returns {[number,number]} The coordinates [lon, lat] of point D.
     */
    static findRightAngleIntersection(pA, pB, pC) {
      // 1. Calculate the required angle at A (angle A_ABC)
      // The angle at A in triangle ABC is the interior angle at pA.
      const angleA_deg = GeoUtils.findAngle(pB, pA, pC);
      const angleA_rad = GeoUtils._toRadians(angleA_deg);

      // 2. Calculate the common side AC (side 'b' in spherical triangle ADC)
      // This is the hypotenuse of the right triangle ADC.
      const distAC_rad = GeoUtils.getAngularDistance(pA, pC);

      // 3. Use Napier's Rules to find side 'c' (distance AD)
      // In right triangle ADC: D = 90 deg, angle A is known, hypotenuse b (AC) is known.
      // We want to find side 'c' (distance AD), which is adjacent to angle A.
      // The correct spherical formula relating adjacent side 'c', hypotenuse 'b', and angle 'A' is:
      // cos(A) = tan(c) / tan(b)

      // Therefore, tan(c) = cos(A) * tan(b)
      // Where:
      // c = distAD_rad (unknown side)
      // b = distAC_rad (hypotenuse)
      // A = angleA_rad (known angle)

      const tan_c = Math.cos(angleA_rad) * Math.tan(distAC_rad);
      const distAD_rad = Math.atan(tan_c);

      // 4. Determine the bearing from A to D
      // The bearing from A to D is the bearing from A to C, adjusted by the angle A.
      const bearingAC_deg = GeoUtils.getBearing(pA, pC);

      // The bearing A->D must be rotated from A->C such that D forms a right angle with CD.
      // This requires D to be along the great circle arc that is perpendicular to C->D.

      // Bearing from A to B
      const bearingAB_deg = GeoUtils.getBearing(pA, pB);

      // Calculate the signed difference: bearingAC - bearingAB
      const angleCAB_raw_diff = GeoUtils._normalizeAngle(bearingAC_deg - bearingAB_deg);

      let bearingAD_deg;

      // The point D is found by rotating the bearing A->C away from B, by the interior angle A.
      if (angleCAB_raw_diff >= 0) {
        // B is counter-clockwise from AC (left side)
        // D needs to be on the other side of AC
        bearingAD_deg = GeoUtils._normalizeAngle(bearingAC_deg - angleA_deg);
      } else {
        // B is clockwise from AC (right side)
        // D needs to be on the other side of AC
        bearingAD_deg = GeoUtils._normalizeAngle(bearingAC_deg + angleA_deg);
      }

      // 5. Calculate the destination point D
      // Start point: pA
      // Bearing: bearingAD_deg
      // Distance: distAD_rad
      return GeoUtils.getDestination(pA, bearingAD_deg, distAD_rad);
    }
  }

})()
