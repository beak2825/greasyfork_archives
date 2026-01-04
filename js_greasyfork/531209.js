// ==UserScript==
// @name         WME E50 Fetch POI Data
// @name:uk      WME 🇺🇦 E50 Fetch POI Data
// @name:ja      WME 🇯🇵 E50 POIデータ取得
// @version      0.10.22
// @description  Fetch information about the POI from external sources
// @description:uk Скрипт дозволяє отримувати інформацію про POI зі сторонніх ресурсів
// @description:ja POIに関する情報を外部ソースから取得します
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-e50/issues
// @match        https://www.waze.com/ja/editor?*
// @exclude      https://*.waze.com/user/editor*
// @connect      api.here.com
// @connect      api.visicom.ua
// @connect      nominatim.openstreetmap.org
// @connect      catalog.api.2gis.com
// @connect      dev.virtualearth.net
// @connect      maps.googleapis.com
// @connect      stat.waze.com.ua
// @grant        GM.xmlHttpRequest
// @grant        GM.setClipboard
// @require      https://update.greasyfork.org/scripts/389765/1090053/CommonUtils.js
// @require      https://update.greasyfork.org/scripts/450160/1218867/WME-Bootstrap.js
// @require      https://update.greasyfork.org/scripts/452563/1218878/WME.js
// @require      https://update.greasyfork.org/scripts/450221/1137043/WME-Base.js
// @require      https://update.greasyfork.org/scripts/450320/1555446/WME-UI.js
// @require      https://update.greasyfork.org/scripts/480123/1281900/WME-EntryPoint.js
// @downloadURL https://update.greasyfork.org/scripts/531209/WME%20E50%20Fetch%20POI%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/531209/WME%20E50%20Fetch%20POI%20Data.meta.js
// ==/UserScript==

/* jshint esversion: 8 */
/* global require */
/* global $, jQuery, jQuery.Event */
/* global W, W.model */
/* global I18n */
/* global OpenLayers */
/* global NavigationPoint */
/* global WME, WMEBase, WMEUI, WMEUIHelper, WMEUIHelperFieldset */
/* global Container, Settings, SimpleCache, Tools  */

(function () {
  'use strict'

  let vectorPoint, vectorLine

  const NAME = 'E50'

  // translation structure
  const TRANSLATION = {
    'en': {
      title: 'Information 📍',
      notFound: 'Not found',
      options: {
        title: 'Options',
        modal: 'Use modal window',
        transparent: 'Transparent modal window',
        entryPoint: 'Create Entry Point if not exists',
        copyData: 'Copy POI data to clipboard on click',
        lock: 'Lock POI to 2 level',
        keys: 'API keys',
      },
      ranges: {
        title: 'Additional',
        collapse: 'Collapse the lists longer than',
      },
      providers: {
        title: 'Providers',
        magic: 'Closest Segment',
        osm: 'Open Street Map',
        gis: '2GIS',
        bing: 'Bing',
        here: 'HERE',
        google: 'Google',
        visicom: 'Visicom',
        ua: 'UA Adresses',
      },
      questions: {
        changeName: 'Are you sure to change the name?',
        changeCity: 'Are you sure to change the city?',
        changeStreet: 'Are you sure to change the street name?',
        changeNumber: 'Are you sure to change the house number?',
        notFoundCity: 'City not found in the current location, are you sure to apply this city name?',
        notFoundStreet: 'Street not found in the current location, are you sure to apply this street name?'
      }
    },
    'ja': {
      title: '情報 📍',
      notFound: '見つかりません',
      options: {
        title: 'オプション',
        modal: 'モーダルウィンドウを使用',
        transparent: '半透明モーダル',
        entryPoint: '存在しない場合は入口ポイントを作成',
        copyData: 'クリック時にPOIデータをコピー',
        lock: 'POIをレベル2でロック',
        keys: 'APIキー',
      },
      ranges: {
        title: '追加設定',
        collapse: 'リストの折りたたみ上限',
      },
      providers: {
        title: 'プロバイダー',
        magic: '最寄りの道路',
        osm: 'OpenStreetMap',
        gis: '2GIS',
        bing: 'Bing',
        here: 'HERE',
        google: 'Google',
        visicom: 'Visicom',
        ua: 'UAアドレス',
      },
      questions: {
        changeName: '名称を変更しますか？',
        changeCity: '市区町村を変更しますか？',
        changeStreet: '通り名を変更しますか？',
        changeNumber: '番地を変更しますか？',
        notFoundCity: '現在地で市区町村が見つかりません。この名称を使用しますか？',
        notFoundStreet: '現在地で通りが見つかりません。この名称を使用しますか？'
      }
    }
  }

  const SETTINGS = {
    options: {
      modal: true,
      transparent: false,
      entryPoint: true,
      copyData: true,
      lock: true,
    },
    ranges: {
      collapse: 3,
    },
    providers: {
      magic: true,
      osm: false,
      gis: false,
      bing: false,
      here: false,
      google: true,
      visicom: false,
      ua: false,
    },
    keys: {
      // Russian warship, go f*ck yourself!
      visicom: 'da' + '0110' + 'e25fac44b1b9c849296387dba8',
      gis: 'rubnkm' + '7490',
      here: 'GCFmOOrSp8882vFwTxEm' + ':' + 'O-LgGkoRfypnRuik0WjX9A',
      bing: 'AuBfUY8Y1Nzf' + '3sRgceOYxaIg7obOSaqvs' + '0k5dhXWfZyFpT9ArotYNRK7DQ_qZqZw',
      google: 'AIzaSyBWB3' + 'jiUm1dkFwvJWy4w4ZmO7K' + 'PyF4oUa0', // extract it from WME
      ua: 'E50'
    }
  }

  const LOCALE = {
    // Japan
    73: {
      country: 'jp',
      language: 'ja',
      locale: 'ja_JP'
    }
  }

  // Road Types
  //   I18n.translations.uk.segment.road_types
  //   I18n.translations.en.segment.road_types
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

  // OpenLayer styles
  const STYLE =
    '.e50 .header h5 { padding: 16px 16px 0; font-size: 16px }' +
    '.e50 .body { overflow-y: auto; max-height: 420px; padding: 4px 0; }' +
    // モーダルウィンドウを右下に配置するスタイルを追加
    '.wme-ui-modal.e50 { position: fixed !important; right: 20px !important; bottom: 20px !important; top: auto !important; left: auto !important; }' +
    '.wme-ui-modal.e50 .header { cursor: move; }' +

    '.e50 .button-toolbar legend { border: 1px solid #e5e5e5; width: 94%; margin: 0 auto; } ' +
    '.e50 .button-toolbar fieldset { margin-bottom: 8px } ' +

    '.e50 fieldset { border: 1px solid #ddd; max-height: 300px; overflow-y: auto; }' +
    '.e50 fieldset legend { cursor:pointer; font-size: 12px; font-weight: bold; margin: 0; padding: 0 8px; background-color: #f6f7f7; border-top: 1px solid #e5e5e5; }' +
    '.e50 fieldset legend::after { display: inline-block; text-rendering: auto; content: ""; float: right; font-size: 10px; line-height: inherit; position: relative; right: 3px; } ' +
    '.e50 fieldset.collapsed legend::after { content: "" }' +
    '.e50 fieldset.collapsed ul { display: none } ' +
    '.e50 fieldset legend span { font-weight: bold; background-color: #fff; border-radius: 5px; color: #ed503b; display: inline-block; font-size: 12px; line-height: 14px; max-width: 30px; padding: 1px 5px; text-align: center; } ' +

    '.e50 ul { padding: 8px; margin: 0 }' +
    '.e50 li { padding: 0; margin: 0; list-style: none; margin-bottom: 2px }' +
    '.e50 li a { display: block; padding: 2px 4px; text-decoration: none; border: 1px solid #e4e4e4; }' +
    '.e50 li a:hover { background: rgba(255, 255, 200, 1) }' +
    '.e50 li a.noaddress { background: rgba(255, 200, 200, 0.5) }' +
    '.e50 li a.noaddress:hover { background: rgba(255, 200, 200, 1) }' +

    '.e50 div.controls { padding: 8px; }' +
    '.e50 div.controls:empty, #panel-container .archive-panel .body:empty { min-height: 20px; }' +
    '.e50 div.controls:empty::after, #panel-container .archive-panel .body:empty::after { color: #ccc; padding: 0 8px; content: "' + I18n.t(NAME).notFound + '" }' +
    '.e50 div.controls label { white-space: normal; font-weight: 400; margin-top: 5px; }' +
    '.e50 div.controls input[type="text"] { float:right; }' +

    '.e50 .e50-collapse label, .e50 .e50-collapse label { font-weight: 400 }' +
    '.e50 .e50-collapse label::after { content: attr(data-after); display: inline-block; padding: 2px; margin: 2px; }' +
    '.e50 .e50-collapse label::after { content: attr(data-after); display: inline-block; padding: 2px; margin: 2px; }' +

    'p.e50-info { border-top: 1px solid #ccc; color: #777; font-size: x-small; margin-top: 15px; padding-top: 10px; text-align: center; }'

  WMEUI.addStyle(STYLE)

  let WazeActionUpdateObject
  let WazeActionUpdateFeatureAddress

  let E50Instance, E50Cache, vectorLayer

  class E50 extends WMEBase {
    constructor (name, settings) {
      super(name, settings)

      this.helper = new WMEUIHelper(name)

      this.modal = this.helper.createModal(I18n.t(name).title)

      this.panel = this.helper.createPanel(I18n.t(name).title)

      this.tab = this.helper.createTab(
        I18n.t(name).title,
        {
          image: GM_info.script.icon
        }
      )

      // Setup options
      /** @type {WMEUIHelperFieldset} */
      let fsOptions = this.helper.createFieldset(I18n.t(name).options.title)
      for (let item in settings.options) {
        if (settings.options.hasOwnProperty(item)) {
          fsOptions.addCheckbox(
            item,
            I18n.t(name).options[item],
            (event) => this.settings.set(['options', item], event.target.checked),
            this.settings.get('options', item)
          )
        }
      }
      this.tab.addElement(fsOptions)

      // Setup ranges
      /** @type {WMEUIHelperFieldset} */
      let fsRanges = this.helper.createFieldset(I18n.t(name).ranges.title)
      for (let item in settings.ranges) {
        if (settings.ranges.hasOwnProperty(item)) {
          let range = fsRanges.addRange(
            item,
            I18n.t(name).ranges[item],
            (event) => {
              this.settings.set(['ranges', item], event.target.value)
              event.target.nextSibling.setAttribute('data-after', event.target.value)
            },
            this.settings.get('ranges', item),
            0,
            10,
            1
          )
          range.html()
            .getElementsByTagName('label')[0]
            .setAttribute('data-after', this.settings.get('ranges', item))

        }
      }
      this.tab.addElement(fsRanges)

      // Setup providers settings
      /** @type {WMEUIHelperFieldset} */
      let fsProviders = this.helper.createFieldset(I18n.t(name).providers.title)
      for (let item in settings.providers) {
        if (settings.providers.hasOwnProperty(item)) {
          fsProviders.addCheckbox(
            item,
            I18n.t(NAME).providers[item],
            (event) => this.settings.set(['providers', item], event.target.checked),
            this.settings.get('providers', item)
          )
        }
      }
      this.tab.addElement(fsProviders)

      // Setup providers key's
      /** @type {WMEUIHelperFieldset} */
      let fsKeys = this.helper.createFieldset(I18n.t(name).options.keys)
      let keys = this.settings.get('keys')
      for (let item in keys) {
        if (keys.hasOwnProperty(item)) {
          fsKeys.addInput(
            'key-' + item,
            I18n.t(name).providers[item],
            (event) => this.settings.set(['keys', item], event.target.value),
            this.settings.get('keys', item)
          )
        }
      }
      this.tab.addElement(fsKeys)

      this.tab.addText(
        'info',
        '<a href="' + GM_info.scriptUpdateURL + '">' + GM_info.script.name + '</a> ' + GM_info.script.version
      )

      this.tab.inject()
    }

    /**
     * Handler for `none.wme` event
     * @param {jQuery.Event} event
     * @return {Null}
     */
    onNone (event) {
      if (this.settings.get('options', 'modal')) {
        this.modal.html().remove()
      }
    }

    /**
     * Handler for `venue.wme` event
     *  - create and fill the modal panel
     *
     * @param {jQuery.Event} event
     * @param {HTMLElement} element
     * @param {W.model} model
     * @return {null|void}
     */
    onVenue (event, element, model) {
      let container, parent
      if (this.settings.get('options', 'modal')) {
        parent = this.modal.html()
        container = parent.querySelector('.wme-ui-body')
      } else {
        parent = this.panel.html()
        container = parent.querySelector('.controls')
      }

      // Clear container
      try {
        if (container)
        while (container.hasChildNodes()) {
          container.removeChild(container.lastChild)
        }
      } catch (e) {
        console.error(e)
      }

      let poi = getSelectedPOI()

      if (!poi) {
        return
      }

      let selected = poi.getOLGeometry().getCentroid().clone()
      selected.transform('EPSG:900913', 'EPSG:4326')

      let providers = []

      let country = W.model.getTopCountry().getID() // or 232 is Ukraine

      let settings = LOCALE[country]

      this.group(
        '📍' + selected.x + ' ' + selected.y
      )

      if (this.settings.get('providers', 'magic')) {
        let Magic = new MagicProvider(container, settings)
        let providerPromise = Magic
          .search(selected.x, selected.y)
          .then(() => Magic.render())
          .catch(() => this.log(':('))
        providers.push(providerPromise)
      }

      if (this.settings.get('providers', 'ua')) {
        let UaAddresses = new UaAddressesProvider(container, settings, this.settings.get('keys', 'ua'))
        let providerPromise = UaAddresses
          .search(selected.x, selected.y)
          .then(() => UaAddresses.render())
          .catch(() => this.log(':('))
        providers.push(providerPromise)
      }

      if (this.settings.get('providers', 'osm')) {
        let Osm = new OsmProvider(container, settings)
        let providerPromise = Osm
          .search(selected.x, selected.y)
          .then(() => Osm.render())
          .catch(() => this.log(':('))
        providers.push(providerPromise)
      }

      if (this.settings.get('providers', 'gis')) {
        let Gis = new GisProvider(container, settings, this.settings.get('keys', 'gis'))
        let providerPromise = Gis
          .search(selected.x, selected.y)
          .then(() => Gis.render())
          .catch(() => this.log(':('))
        providers.push(providerPromise)
      }

      if (this.settings.get('providers', 'visicom')) {
        let Visicom = new VisicomProvider(container, settings, this.settings.get('keys', 'visicom'))
        let providerPromise = Visicom
          .search(selected.x, selected.y)
          .then(() => Visicom.render())
          .catch(() => this.log(':('))
        providers.push(providerPromise)
      }

      if (this.settings.get('providers', 'here')) {
        let Here = new HereProvider(container, settings, this.settings.get('keys', 'here'))
        let providerPromise = Here
          .search(selected.x, selected.y)
          .then(() => Here.render())
          .catch(() => this.log(':('))
        providers.push(providerPromise)
      }

      if (this.settings.get('providers', 'bing')) {
        let Bing = new BingProvider(container, settings, this.settings.get('keys', 'bing'))
        let providerPromise = Bing
          .search(selected.x, selected.y)
          .then(() => Bing.render())
          .catch(() => this.log(':('))
        providers.push(providerPromise)
      }

      if (this.settings.get('providers', 'google')) {
        let Google = new GoogleProvider(container, settings, this.settings.get('keys', 'google'))
        let providerPromise = Google
          .search(selected.x, selected.y)
          .then(() => Google.render())
          .catch(() => this.log(':('))
        providers.push(providerPromise)
      }

      Promise
        .all(providers)
        .then(() => this.groupEnd())

      if (this.settings.get('options', 'modal')) {
        if (this.settings.get('options', 'transparent')) {
          parent.style.opacity = '0.6'
          parent.onmouseover = () => (parent.style.opacity = '1')
          parent.onmouseout = () => (parent.style.opacity = '0.6')
        }
        this.modal.container().append(parent)
      } else {
        element.prepend(parent)
      }
    }
  }

  /**
   * Basic Provider class
   */
  class Provider {
    constructor (uid, container, settings) {
      this.uid = uid
      this.response = []
      this.settings = settings
      // prepare DOM
      this.panel = this._panel()
      this.container = container
      this.container.append(this.panel)
    }

    /**
     * @param {String} url
     * @param {Object} data
     * @returns {Promise<unknown>}
     */
    async makeRequest (url, data) {
      let query = new URLSearchParams(data).toString()

      if (query.length) {
        url = url + '?' + query
      }

      return new Promise((resolve, reject) => {
        GM.xmlHttpRequest({
          method: 'GET',
          responseType: 'json',
          url: url,
          onload: response => response && response.response && resolve(response.response) || reject(response),
          onabort: response => reject(response),
          onerror: response => reject(response),
          ontimeout: response => reject(response),
        })
      })
    }

    /**
     * @param  {Number} lon
     * @param  {Number} lat
     * @return {Promise<array>}
     */
    async request (lon, lat) {
      throw new Error('Abstract method')
    }

    /**
     * @param  {Number} lon
     * @param  {Number} lat
     * @return {Promise<void>}
     */
    async search (lon, lat) {
      let key = this.uid + ':' + lon + ',' + lat
      if (E50Cache.has(key)) {
        this.response = E50Cache.get(key)
      } else {
        this.response = await this.request(lon, lat).catch(e => console.error(this.uid, 'search return error', e))
        E50Cache.set(key, this.response)
      }

      return new Promise((resolve, reject) => {
        if (this.response) {
          resolve()
        } else {
          reject()
        }
      })
    }

    /**
     * @param  {Array} res
     * @return {Array}
     */
    collection (res) {
      let result = []
      for (let i = 0; i < res.length; i++) {
        result.push(this.item(res[i]))
      }
      result = result.filter(x => x)
      return result
    }

    /**
     * Should return {Object}
     * @param  {Object} res
     * @return {Object}
     */
    item (res) {
      throw new Error('Abstract method')
    }

    /**
     * @param  {Number} lon
     * @param  {Number} lat
     * @param  {String} city
     * @param  {String} street
     * @param  {String} number
     * @param  {String} name
     * @return {{number: *, city: *, street: *, name: *, raw: *, lon: *, title: *, lat: *}}
     */
    element (lon, lat, city, street, number, name = '') {
      // Raw data from provider
      let raw = [street, number, name].filter(x => !!x).join(', ')
      console.groupCollapsed(city, street, number, name)
      {
        city = normalizeCity(city)
        street = normalizeStreet(street)
        number = normalizeNumber(number)
        name = normalizeName(name)
      }
      console.groupEnd()
      let title = [street, number, name].filter(x => !!x).join(', ')
      return {
        lat: lat,
        lon: lon,
        city: city,
        street: street,
        number: number,
        name: name,
        title: title,
        raw: raw,
      }
    }

    /**
     * Render result to target element
     */
    render () {
      if (this.response.length === 0) {
        // remove empty panel
        this.panel.remove()
        return
      }

      this.panel.append(this._fieldset())
    }

    /**
     * Create div for all items
     * @return {HTMLDivElement}
     * @private
     */
    _panel () {
      let div = document.createElement('div')
      div.id = NAME + '-' + this.uid
      div.className = 'e50'
      return div
    }

    /**
     * Build fieldset with the list of the response items
     * @return {HTMLFieldSetElement}
     * @protected
     */
    _fieldset () {
      let fieldset = document.createElement('fieldset')
      let list = document.createElement('ul')

      let collapse = parseInt(E50Instance.settings.get('ranges', 'collapse'))

      if (collapse && this.response.length > collapse) {
        fieldset.className = 'collapsed'
      } else {
        fieldset.className = ''
      }


      for (let i = 0; i < this.response.length; i++) {
        let item = document.createElement('li')
        item.append(this._link(this.response[i]))
        list.append(item)
      }

      let legend = document.createElement('legend')
      legend.innerHTML = this.uid + ' <span>' + this.response.length + '</span>'
      legend.onclick = function () {
        this.parentElement.classList.toggle("collapsed")
        return false
      }
      fieldset.append(legend, list)
      return fieldset
    }

    /**
     * Build link by {Object}
     * @param  {Object} item
     * @return {HTMLAnchorElement}
     * @protected
     */
    _link (item) {
      let a = document.createElement('a')
      a.href = '#'
      a.dataset.lat = item.lat
      a.dataset.lon = item.lon
      a.dataset.city = item.city
      a.dataset.street = item.street
      a.dataset.number = item.number
      a.dataset.name = item.name
      a.innerText = item.title
      a.title = item.raw
      a.className = NAME + '-link'
      if (!item.city || !item.street || !item.number) {
        a.className += ' noaddress'
      }
      return a
    }
  }

  /**
   * Based on closest segment and city
   */
  class MagicProvider extends Provider {
    constructor (container, settings) {
      super(I18n.t(NAME).providers.magic, container, settings)
    }

    async request (lon, lat) {
      let city = null
      let street = ''
      let segment = findClosestSegment(new OpenLayers.Geometry.Point(lon, lat).transform('EPSG:4326', 'EPSG:900913'), true, true)
      if (segment) {
        city = segment.getAddress(W.model).getCity()
        street = segment.getAddress(W.model).getStreetName()

        // to lon, lat
        let point = segment.closestPoint.transform('EPSG:900913', 'EPSG:4326')
        lon = point.x
        lat = point.y
      }

      if (!city) {
        let cities = W.model.cities.getObjectArray()
          .filter(c => c.getName()) // not empty city name
          .filter(c => c.getName() !== 'поза НП') // not "no" city (hardcoded mistake)
          .filter(c => c.getID() !== 55344) // not EMPTY city for Ukraine
        city = cities.length ? cities.shift() : null
      }
      if (!street) {
        return []
      }

      console.groupCollapsed(this.uid)
      // lon, lat, city, street, number, name
      let result = [
        this.element(
          lon,
          lat,
          city ? city.getName() : '',
          street,
          '',
          ''
        )
      ]
      console.groupEnd()
      return result
    }
  }

  /**
   * US Addresses
   */
  class UaAddressesProvider extends Provider {
    constructor (container, settings, key) {
      super(I18n.t(NAME).providers.ua, container, settings)
      this.key = key
    }

    async request (lon, lat) {
      let url = 'https://stat.waze.com.ua/address_map/address_map.php'
      let data = {
        lon: lon,
        lat: lat,
        script: this.key
      }
      let response = await this.makeRequest(url, data).catch(e => console.error(this.uid, 'return error', e))

      if (!response || !response.result || response.result !== 'success') {
        return []
      }

      console.groupCollapsed(this.uid)
      let result = this.collection(response.data.polygons.Default)
      console.groupEnd()
      return result
    }

    item (res) {
      let data = res.name.split(", ")

      data = data.filter(part => {
        return !part.trim().match(/^\D+\sобл\.$/)
        && !part.trim().match(/^\D+\sр-н?$/)
        && !part.trim().match(/^р-н\s+\D+$/)
        }
      )

      if (data.length < 3) {
        return false
      }

      let number = data.pop()
      let street = data.pop()
      let city = data.pop()

      let parser = new OpenLayers.Format.WKT()
      parser.internalProjection = W.map.getProjectionObject()
      //parser.externalProjection = new OpenLayers.Projection('EPSG:4326')

      let feature = parser.read(res.polygon)
      let centerPoint = feature.geometry.getCentroid()

      return this.element(centerPoint.x, centerPoint.y, city, street, number)
    }
  }

  /**
   * visicom.ua
   */
  class VisicomProvider extends Provider {
    constructor (container, settings, key) {
      super('Visicom', container, settings)
      this.key = key
    }

    async request (lon, lat) {
      let url = 'https://api.visicom.ua/data-api/5.0/uk/geocode.json'
      let data = {
        near: lon + ',' + lat,
        categories: 'adr_address',
        order: 'distance',
        radius: 100,
        limit: 10,
        key: this.key,
      }

      let response = await this.makeRequest(url, data).catch(e => console.error(this.uid, 'return error', e))

      if (!response || !response.features || !response.features.length) {
        return []
      }

      console.groupCollapsed(this.uid)
      let result = this.collection(response.features)
      console.groupEnd()
      return result
    }

    item (res) {
      let city = ''
      let street = ''
      let number = ''
      if (res.properties.settlement) {
        city = res.properties.settlement
      }
      if (res.properties.street) {
        street = res.properties.street_type + ' ' + res.properties.street
      }
      if (res.properties.name) {
        number = res.properties.name
      }
      return this.element(res.geo_centroid.coordinates[0], res.geo_centroid.coordinates[1], city, street, number)
    }
  }

  /**
   * Open Street Map
   */
  class OsmProvider extends Provider {
    constructor (container, settings) {
      super('OSM', container, settings)
    }

    async request (lon, lat) {
      let url = 'https://nominatim.openstreetmap.org/reverse'
      let data = {
        lon: lon,
        lat: lat,
        zoom: 18,
        addressdetails: 1,
        countrycodes: this.settings.language,
        'accept-language': this.settings.locale,
        format: 'json',
      }

      let response = await this.makeRequest(url, data).catch(e => console.error(this.uid, 'return error', e))

      if (!response || !response.address || !response.address.house_number) {
        return []
      }

      console.groupCollapsed(this.uid)
      let result = [this.item(response)]
      console.groupEnd()
      return result
    }

    item (res) {
      let city = ''
      let street = ''
      let number = ''
      if (res.address.city) {
        city = res.address.city
      } else if (res.address.town) {
        city = res.address.town
      }
      if (res.address.road) {
        street = res.address.road
      }
      if (res.address.house_number) {
        number = res.address.house_number
      }
      return this.element(res.lon, res.lat, city, street, number)
    }
  }

  /**
   * 2GIS
   * @link https://docs.2gis.com/ru/api/search/geocoder/reference/2.0/geo/search#/default/get_2_0_geo_search
   */
  class GisProvider extends Provider {
    constructor (container, settings, key) {
      super('2Gis', container, settings)
      this.key = key
    }

    async request (lon, lat) {
      let url = 'https://catalog.api.2gis.com/2.0/geo/search'
      let data = {
        point: lon + ',' + lat,
        radius: 20,
        type: 'building',
        fields: 'items.address,items.adm_div,items.geometry.centroid',
        locale: this.settings.locale,
        format: 'json',
        key: this.key,
      }

      let response = await this.makeRequest(url, data).catch(e => console.error(this.uid, 'return error', e))

      if (!response || !response.result || !response.result.items.length) {
        return []
      }

      console.groupCollapsed(this.uid)
      let result = this.collection(response.result.items)
      console.groupEnd()
      return result
    }

    item (res) {
      let output = []
      let city = ''
      let street = ''
      let number = ''
      if (res.adm_div.length) {
        for (let i = 0; i < res.adm_div.length; i++) {
          if (res.adm_div[i].type === 'city') {
            city = res.adm_div[i].name
          }
        }
      }
      if (res.address.components) { // optional
        street = res.address.components[0].street
        number = res.address.components[0].number
      } else if (res.address_name) { // optional
        output.push(res.address_name)
      } else if (res.name) {
        output.push(res.name)
      }
      // e.g. POINT(36.401143 49.916814)
      let center = res.geometry.centroid.substring(6, res.geometry.centroid.length - 1).split(' ')
      let lon = center[0]
      let lat = center[1]

      let element = this.element(lon, lat, city, street, number, output.join(', '))
      if (res.purpose_name) {
        element.raw += ', ' + res.purpose_name
      }
      return element
    }
  }

  /**
   * Here Maps
   * @link https://developer.here.com/documentation/geocoder/topics/quick-start-geocode.html
   * @link https://www.here.com/docs/bundle/geocoder-api-developer-guide/page/topics/resource-reverse-geocode.html
   */
  class HereProvider extends Provider {
    constructor (container, settings, key) {
      super('Here', container, settings)
      this.key = key.split(':')
    }

    async request (lon, lat) {
      let url = 'https://reverse.geocoder.api.here.com/6.2/reversegeocode.json'
      let data = {
        app_id: this.key[0],
        app_code: this.key[1],
        prox: lat + ',' + lon + ',10',
        mode: 'retrieveAddresses',
        locationattributes: 'none,ar',
        addressattributes: 'str,hnr'
      }

      let response = await this.makeRequest(url, data).catch(e => console.error(this.uid, 'return error', e))

      if (!response
        || !response.Response
        || !response.Response.View
        || !response.Response.View
        || !response.Response.View[0]
        || !response.Response.View[0].Result) {
        return []
      }

      console.groupCollapsed(this.uid)
      let result = this.collection(response.Response.View[0].Result.filter(x => x.MatchLevel === 'houseNumber'))
      console.groupEnd()
      return result
    }

    item (res) {
      return this.element(
        res.Location.DisplayPosition.Longitude,
        res.Location.DisplayPosition.Latitude,
        res.Location.Address.City,
        res.Location.Address.Street,
        res.Location.Address.HouseNumber
      )
    }
  }

  /**
   * Bing Maps
   * @link https://docs.microsoft.com/en-us/bingmaps/rest-services/locations/find-a-location-by-point
   * http://dev.virtualearth.net/REST/v1/Locations/50.03539,36.34732?o=xml&key=AuBfUY8Y1Nzf3sRgceOYxaIg7obOSaqvs0k5dhXWfZyFpT9ArotYNRK7DQ_qZqZw&c=uk
   * http://dev.virtualearth.net/REST/v1/Locations/50.03539,36.34732?o=xml&key=AuBfUY8Y1Nzf3sRgceOYxaIg7obOSaqvs0k5dhXWfZyFpT9ArotYNRK7DQ_qZqZw&c=uk&includeEntityTypes=Address
   */
  class BingProvider extends Provider {
    constructor (container, settings, key) {
      super('Bing', container, settings)
      this.key = key
    }

    async request (lon, lat) {
      let url = 'https://dev.virtualearth.net/REST/v1/Locations/' + lat + ',' + lon
      let data = {
        includeEntityTypes: 'Address',
        c: this.settings.country,
        key: this.key,
      }

      let response = await this.makeRequest(url, data).catch(e => console.error(this.uid, 'return error', e))

      if (!response || !response.resourceSets || !response.resourceSets[0]) {
        return []
      }

      console.groupCollapsed(this.uid)
      let result = this.collection(response.resourceSets[0].resources.filter(el => el.address.addressLine && el.address.addressLine.indexOf(',') > 0))
      console.groupEnd()
      return result
    }

    item (res) {
      let address = res.address.addressLine.split(',')
      return this.element(
        res.point.coordinates[1],
        res.point.coordinates[0],
        res.address.locality,
        address[0],
        address[1]
      )
    }
  }

  /**
   * Google Place
   * @link https://developers.google.com/places/web-service/search
   */
  class GoogleProvider extends Provider {
    constructor (container, settings, key) {
      super('Google', container, settings)
      this.key = key
    }

    async request (lon, lat) {
      let response = await this.makeAPIRequest(lat, lon).catch(e => console.error(this.uid, 'return error', e))

      if (!response || !response.length) {
        return []
      }

      console.groupCollapsed(this.uid)
      let result = this.collection(response)
      console.groupEnd()
      return result
    }

    async makeAPIRequest (lat, lon) {
      let center = new google.maps.LatLng(lat, lon)

      let map = new google.maps.Map(document.createElement('div'), { center: center })

      let request = {
        location: center,
        radius: '100',
        type: 'point_of_interest',
        // doesn't work
        // fields: ['name', 'address_component', 'geometry'],
        // language: this.settings.country,
      }

      let service = new google.maps.places.PlacesService(map)
      return new Promise((resolve, reject) => {
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve(results)
          } else {
            reject(status)
          }
        })
      })
    }

    item (res) {
      let address = res.vicinity.split(',')
      address = address.map(str => str.trim())

      // looks like hell
      let street = address[0] && address[0].length > 4 ? address[0] : ''
      let number = address[1] && address[1].length < 13 ? address[1] : ''
      let city = address[2] ? address[2] : ''

      return this.element(
        res.geometry.location.lng(),
        res.geometry.location.lat(),
        city,
        street,
        number,
        res.name
      )
    }
  }

  $(document)
    .on('bootstrap.wme', ready)
    .on('click', '.' + NAME + '-link', applyData)
    .on('mouseenter', '.' + NAME + '-link', showVector)
    .on('mouseleave', '.' + NAME + '-link', hideVector)
    .on('none.wme', hideVector)

  function ready () {
    WazeActionUpdateObject = require('Waze/Action/UpdateObject')
    WazeActionUpdateFeatureAddress = require('Waze/Action/UpdateFeatureAddress')

    E50Instance = new E50(NAME, SETTINGS)
    E50Cache = new SimpleCache()
  }

  /**
   *
   * @return {null|Object}
   */
  function getSelectedPOI () {
    let venue = WME.getSelectedVenue()
      // For TEST ENV only!
      // venue = W.selectionManager.getSelectedDataModelObjects()[0]
    if (!venue) {
      return null
    }
    let except = ['NATURAL_FEATURES']
    if (except.indexOf(venue.getMainCategory()) === -1) {
      return venue
    }
    return null
  }

  /**
   * Returns an array of all segments in the current extent
   * @function WazeWrap.Model.getOnscreenSegments
   */
  function getOnscreenSegments () {
    let segments = W.model.segments.objects
    let mapExtent = W.map.getExtent()
    let onScreenSegments = []
    let seg

    for (let s in segments) {
      if (!segments.hasOwnProperty(s))
        continue

      seg = W.model.segments.getObjectById(s)
      if (mapExtent.intersectsBounds(seg.getOLGeometry().getBounds()))
        onScreenSegments.push(seg)
    }
    return onScreenSegments
  }

  /**
   * Finds the closest on-screen drivable segment to the given point, ignoring PLR and PR segments if the options are set
   * @function WazeWrap.Geometry.findClosestSegment
   * @param {OpenLayers.Geometry.Point} geometry The given point to find the closest segment to
   * @param {boolean} ignorePLR If true, Parking Lot Road segments will be ignored when finding the closest segment
   * @param {boolean} ignoreUnnamedPR If true, Private Road segments will be ignored when finding the closest segment
   */
  function findClosestSegment (geometry, ignorePLR, ignoreUnnamedPR) {
    let onscreenSegments = getOnscreenSegments()
    let minDistance = Infinity
    let closestSegment

    for (let s in onscreenSegments) {
      if (!onscreenSegments.hasOwnProperty(s))
        continue

      let segmentType = onscreenSegments[s].attributes.roadType

      if (segmentType === TYPES.boardwalk
        || segmentType === TYPES.stairway
        || segmentType === TYPES.railroad
        || segmentType === TYPES.runway)
        continue

      // parking lots
      if (ignorePLR && segmentType === TYPES.parking) //PLR
        continue

      // private roads
      if (ignoreUnnamedPR && segmentType === TYPES.private)
        continue

      // unnamed roads, f**ing magic number
      if (
        !onscreenSegments[s].getAddress(W.model).getStreet().getID() ||
        onscreenSegments[s].getAddress(W.model).getStreet().getID() === 8325397)
        continue

      let distanceToSegment = geometry.distanceTo(onscreenSegments[s].getOLGeometry(), { details: true })

      if (distanceToSegment.distance < minDistance) {
        minDistance = distanceToSegment.distance
        closestSegment = onscreenSegments[s]
        closestSegment.closestPoint = new OpenLayers.Geometry.Point(distanceToSegment.x1, distanceToSegment.y1)
      }
    }

    return closestSegment
  }

  /**
   * Apply data to current selected POI
   * @param event
   */
  function applyData (event) {
    event.preventDefault()
    let poi = getSelectedPOI()

    if (!poi.isGeometryEditable()) {
      return
    }

    E50Instance.group('Apply data')

    let lat = this.dataset.lat
    let lon = this.dataset.lon
    let name = this.dataset.name
    let city = this.dataset.city
    let street = this.dataset.street
    let number = this.dataset.number

    if (E50Instance.settings.get('options', 'copyData')) {
      toClipboard([name, number, street, city].filter(x => !!x).join(' '))
    }

    // POI Name
    let newName
    // If exists name ask user to replace it or not
    // If not exists - use name or house number as name
    if (poi.attributes.name) {
      if (name && name !== poi.attributes.name) {
        if (window.confirm(I18n.t(NAME).questions.changeName + '\n«' + poi.attributes.name + '» ⟶ «' + name + '»?')) {
          newName = name
        }
      } else if (number && number !== poi.attributes.name) {
        if (window.confirm(I18n.t(NAME).questions.changeName + '\n«' + poi.attributes.name + '» ⟶ «' + number + '»?')) {
          newName = number
        }
      }
    } else if (name) {
      newName = name
    } else if (number) {
      newName = number
      // Update alias for korpus
      if ((new RegExp('[0-9]+[а-яі]?к[0-9]+', 'i')).test(number)) {
        let alias = number.replace('к', ' корпус ')
        let aliases = poi.attributes.aliases.slice()
        if (aliases.indexOf(alias) === -1) {
          aliases.push(alias)
          W.model.actionManager.add(new WazeActionUpdateObject(poi, { aliases: aliases }))
        }
      }
    }
    if (newName) {
      W.model.actionManager.add(new WazeActionUpdateObject(poi, { name: newName }))
    }

    // POI Address Street Name
    let newStreet
    let addressStreet = poi.getAddress(W.model).getStreet()?.getName() || ''
    if (street) {
      let existStreet = detectStreet(street)

      if (existStreet) {
        // We found street, all OK
        console.log('✅ Street detected, is «' + existStreet + '»')
        street = existStreet
      } else if (!window.confirm(I18n.t(NAME).questions.notFoundStreet + '\n«' + street + '»?')) {
        street = null
      }

      // Check the current POI street name, and ask to rewrite it
      if (street) {
        if (addressStreet) {
          if (addressStreet !== street &&
            window.confirm(I18n.t(NAME).questions.changeStreet + '\n«' + addressStreet + '» ⟶ «' + street + '»?')) {
            newStreet = street
          }
        } else {
          newStreet = street
        }
      }
    }

    // POI Address City
    let newCity
    let addressCity = poi.getAddress(W.model).getCity()?.getName() || ''

    // hardcoded value of common issue
    if (addressCity === 'поза НП') {
      addressCity = ''
    }

    if (city) {
      // Try to find the city in the current location
      let existCity = detectCity(city)

      if (existCity) {
        // We found city, all OK
        console.log('✅ City detected, is «' + existCity + '»')
        city = existCity
      } else if(!window.confirm(I18n.t(NAME).questions.notFoundCity + '\n«' + city + '»?')) {
        // We can't find city, and will ask to create new one, but not needed
        city = null
      }

      if (city) {
        if (addressCity) {
          if (addressCity !== city &&
            window.confirm(I18n.t(NAME).questions.changeCity + '\n«' + addressCity + '» ⟶ «' + city + '»?')) {
            newCity = city
          }
        } else {
          newCity = city
        }
      }
    }

    // Update Address
    if (newCity || newStreet) {
      let address = {
        countryID: W.model.getTopCountry().getID(),
        stateID: W.model.getTopState().getID(),
        cityName: newCity ? newCity : addressCity,
        streetName: newStreet ? newStreet : poi.getAddress(W.model).getStreetName()
      }
      W.model.actionManager.add(new WazeActionUpdateFeatureAddress(poi, address))
    }

    // POI Address HouseNumber
    let newHN
    let addressHN = poi.getAddress(W.model).attributes.houseNumber
    if (number) {
      // Normalize «korpus»
      number = number.replace(/^(\d+)к(\d+)$/i, '$1-$2')
      // Check number for invalid format for Waze
      if ((new RegExp('^[0-9]+[а-яі][к|/][0-9]+$', 'i')).test(number)) {
        // Skip this step
        console.log(
          '%c' + NAME + ': %cskipped «' + number + '»',
          'color: #0DAD8D; font-weight: bold',
          'color: dimgray; font-weight: normal'
        )
      } else if (addressHN) {
        if (addressHN !== number &&
          window.confirm(I18n.t(NAME).questions.changeNumber + '\n«' + addressHN + '» ⟶ «' + number + '»?')) {
          newHN = number
        }
      } else {
        newHN = number
      }
      if (newHN) {
        W.model.actionManager.add(new WazeActionUpdateObject(poi, { houseNumber: newHN }))
      }
    }

    // If no entry point we would create it
    if (E50Instance.settings.get('options', 'entryPoint') && poi.attributes.entryExitPoints.length === 0) {
      // Create point based on data from external source
      let point = new OpenLayers.Geometry.Point(lon, lat).transform('EPSG:4326', 'EPSG:900913')

      // Check intersection with selected POI
      if (!poi.isPoint() && !poi.getOLGeometry().intersects(point)) {
        point = poi.getOLGeometry().getCentroid()
      }

      // Create entry point
      let navPoint = new entryPoint({primary: true, point: W.userscripts.toGeoJSONGeometry(point)})
      W.model.actionManager.add(new WazeActionUpdateObject(poi, { entryExitPoints: [navPoint] }))
    }

    // Lock to level 2
    if (E50Instance.settings.get('options', 'lock') && poi.attributes.lockRank < 1 && W.loginManager.user.getRank() > 0) {
      W.model.actionManager.add(new WazeActionUpdateObject(poi, { lockRank: 1 }))
    }

    if (newName || newHN || newStreet || newCity) {
      W.selectionManager.setSelectedModels([poi])
    }

    E50Instance.groupEnd()
  }

  /**
   * Normalize the string:
   *  - remove the double quotes
   *  - remove double space
   * @param   {String} str
   * @returns {String}
   */
  function normalizeString (str) {
    // Clear space symbols and double quotes
    str = str.trim()
      .replace(/["“”]/g, '')
      .replace(/\s{2,}/g, ' ')

    // Clear accents/diacritics, but "\u0306" needed for "й"
    // str = str.normalize('NFD').replace(/[\u0300-\u0305\u0309-\u036f]/g, '');
    return str
  }

  /**
   * Normalize the name:
   *  - remove № and #chars
   *  - remove dots
   * @param  {String} name
   * @return {String}
   */
  function normalizeName (name) {
    name = normalizeString(name)
    name = name.replace(/[№#]/g, '')
    name = name.replace(/\.$/, '')
    return name
  }

  /**
   * Normalize the city name
   * @param  {String} city
   * @return {String}
   */
  function normalizeCity (city) {
    return normalizeString(city)
  }

  /**
   * Search the city name from available in editor area
   * @param  {String} city
   * @return {String|null}
   */
  function detectCity(city) {
    // Get list of all available cities
    let cities = W.model.cities.getObjectArray()
      .filter(city => city.getName())
      .filter(city => city.getName() !== 'поза НП')
      .map(city => city.getName())

    // More than one city, use city with best matching score
    // Remove text in the "( )", Waze puts region name to the pair brackets
    let best = findBestMatch(city, cities.map(city => city.replace(/( ?\(.*\))/gi, '')))

    if (best > -1) {
      console.log('✅ City detected')
      return cities[best]
    } else if (cities.length === 1) {
      console.log('❎ City doesn\'t found, uses default city')
      return cities.shift()
    } else {
      console.log('❌ City doesn\'t found')
      return null
    }
  }

  /**\
   * Normalize the street name by UA rules
   * @param  {String} street
   * @return {String}
   */
  function normalizeStreet (street) {
    street = normalizeString(street)

    if (street === '') {
      return ''
    }

    // Prepare street name
    street = street.replace(/[’']/, '\'')
    // Remove text in the "( )", OSM puts alternative name to the pair brackets
    street = street.replace(/( ?\(.*\))/gi, '')
    // Normalize title
    let regs = {
      '(^| )бульвар( |$)': '$1б-р$2',         // normalize
      '(^| )вїзд( |$)': '$1в\'їзд$2',         // fix mistakes
      '(^| )в\'ізд( |$)': '$1в\'їзд$2',       // fix mistakes
      '(^|.+?) ?вулиця ?(.+|$)': 'вул. $1$2', // normalize, but ignore Lviv rules
      '(^|.+?) ?улица ?(.+|$)': 'вул. $1$2',  // translate, but ignore Lviv rules
      '^(.+) в?ул\.?$': 'вул. $1',            // normalize and translate, but ignore Lviv rules
      '^в?ул.? (.+)$': 'вул. $1',             // normalize and translate, but ignore Lviv rules
      '(^| )дорога( |$)': '$1дор.$2',         // normalize
      '(^| )мікрорайон( |$)': '$1мкрн.$2',    // normalize
      '(^| )набережна( |$)': '$1наб.$2',      // normalize
      '(^| )площадь( |$)': '$1площа$2',       // translate
      '(^| )провулок провулок( |$)': '$1пров.$2', // O_o
      '(^| )провулок( |$)': '$1пров.$2',      // normalize
      //'(^| )проїзд( |$)': '$1пр.$2',          // normalize
      '(^| )проспект( |$)': '$1просп.$2',     // normalize
      '(^| )район( |$)': '$1р-н$2',           // normalize
      '(^| )станція( |$)': '$1ст.$2',         // normalize
    }

    for (let key in regs) {
      let re = new RegExp(key, 'gi')
      if (re.test(street)) {
        street = street.replace(re, regs[key])
        break
      }
    }

    return street
  }

  /**
   * Search the street name from available in editor area
   * Normalize the street name by UA rules
   * @param  {String} street
   * @return {String|null}
   */
  function detectStreet (street) {
    street = normalizeStreet(street)

    // Get all streets
    let streets = W.model.streets.getObjectArray().filter(m => m.getName()).map(m => m.getName())

    // Get type and create RegExp for filter streets
    let reTypes = new RegExp('(алея|б-р|в\'їзд|вул\\.|дор\\.|мкрн|наб\\.|площа|пров\\.|проїзд|просп\\.|р-н|ст\\.|тракт|траса|тупик|узвіз|шосе)', 'gi')
    let matches = [...street.matchAll(reTypes)]
    let types = []

    // Detect type(s)
    if (matches.length === 0) {
      types.push('вул.') // setup basic type
      street = 'вул. ' + street
    } else {
      types = matches.map(match => match[0].toLowerCase())
    }
    // Filter streets by detected type(s)
    let filteredStreets = streets.filter(street => types.some(type => street.indexOf(type) > -1))
    // Matching names without type(s)
    let best = findBestMatch(
      street.replace(reTypes, '').toLowerCase().trim(),
      filteredStreets.map(street => street.replace(reTypes, '').toLowerCase().trim())
    )
    if (best > -1) {
      street = filteredStreets[best]
    } else {
      // Matching with type
      best = findBestMatch(
        street.toLowerCase().trim(),
        streets.map(street => street.toLowerCase().trim())
      )
      if (best > -1) {
        street = streets[best]
      } else {
        return null
      }
    }
    return street
  }

  /**
   * Normalize the number by UA rules
   * @param  {String} number
   * @return {String}
   */
  function normalizeNumber (number) {
    // 日本の住所表記対応
    number = number.replace(/^番地?/i, '')
    number = number.replace(/^No\.?/i, '')
    number = number.replace(/号$/i, '')
    // process "д."
    number = number.replace(/^д\. ?/i, '')
    // process "дом"
    number = number.replace(/^дом ?/i, '')
    // process "буд."
    number = number.replace(/^буд\. ?/i, '')
    // remove spaces
    number = number.trim().replace(/\s/g, '')
    number = number.toUpperCase()
    // process Latin to Cyrillic
    number = number.replace('A', 'А')
    number = number.replace('B', 'В')
    number = number.replace('E', 'Е')
    number = number.replace('I', 'І')
    number = number.replace('K', 'К')
    number = number.replace('M', 'М')
    number = number.replace('H', 'Н')
    number = number.replace('О', 'О')
    number = number.replace('P', 'Р')
    number = number.replace('C', 'С')
    number = number.replace('T', 'Т')
    number = number.replace('Y', 'У')
    // process і,з,о
    number = number.replace('І', 'і')
    number = number.replace('З', 'з')
    number = number.replace('О', 'о')
    // process "корпус" to "к"
    number = number.replace(/(.*)к(?:орп|орпус)?(\d+)/gi, '$1к$2')
    // process "N-M" or "N/M" to "NM"
    number = number.replace(/(.*)[-/]([а-яі])/gi, '$1$2')
    // valid number format
    //  123А  123А/321 123А/321Б 123к1 123Ак2
    if (!number.match(/^\d+[а-яі]?([/к]\d+[а-яі]?)?$/gi)) {
      return ''
    }
    // process Latin to Cyrillic
    number = number.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)) // 全角英数を半角に
    return number
  }

  /**
   * Copy to clipboard
   * @param text
   */
  function toClipboard (text) {
    // normalize
    text = normalizeString(text)
    text = text.replace(/'/g, '')
    GM.setClipboard(text)
    console.log(
      '%c' + NAME + ': %ccopied «' + text + '»',
      'color: #0DAD8D; font-weight: bold',
      'color: dimgray; font-weight: normal'
    )
  }

  /**
   * Calculates the distance between given points, returned in meters
   * @function WazeWrap.Geometry.calculateDistance
   * @param {Array<OpenLayers.Geometry.Point>} pointArray An array of OpenLayers.Geometry.Point with which to measure the total distance. A minimum of 2 points is needed.
   */
  function calculateDistance (pointArray) {
    if (pointArray.length < 2) {
      return 0
    }

    let line = new OpenLayers.Geometry.LineString(pointArray)
    return line.getGeodesicLength(W.map.getProjectionObject()) // multiply by 3.28084 to convert to feet
  }

  /**
   * Get vector layer
   * @return {OpenLayers.Layer.Vector}
   */
  function getVectorLayer () {
    if (!vectorLayer) {
      // Create layer for vectors
      vectorLayer = new OpenLayers.Layer.Vector('E50VectorLayer', {
        displayInLayerSwitcher: false,
        uniqueName: '__E50VectorLayer'
      })
      W.map.addLayer(vectorLayer)
    }
    return vectorLayer
  }

  /**
   * Show vector from the center of the selected POI to point by lon and lat
   */
  function showVector () {
    let poi = getSelectedPOI()
    if (!poi) {
      return
    }
    let from = poi.getOLGeometry().getCentroid()
    let to = new OpenLayers.Geometry.Point(this.dataset.lon, this.dataset.lat).transform('EPSG:4326', 'EPSG:900913')
    let distance = Math.round(calculateDistance([to, from]))

    vectorLine = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([from, to]), {}, {
      strokeWidth: 4,
      strokeColor: '#fff',
      strokeLinecap: 'round',
      strokeDashstyle: 'dash',
      label: distance + 'm',
      labelOutlineColor: '#000',
      labelOutlineWidth: 3,
      labelAlign: 'cm',
      fontColor: '#fff',
      fontSize: '24px',
      fontFamily: 'Courier New, monospace',
      fontWeight: 'bold',
      labelYOffset: 24
    })
    vectorPoint = new OpenLayers.Feature.Vector(to, {}, {
      pointRadius: 8,
      fillOpacity: 0.5,
      fillColor: '#fff',
      strokeColor: '#fff',
      strokeWidth: 2,
      strokeLinecap: 'round'
    })
    getVectorLayer().addFeatures([vectorLine, vectorPoint])
    // getVectorLayer().setZIndex(1001)
    getVectorLayer().setVisibility(true)
  }

  /**
   * Hide and clear all vectors
   */
  function hideVector () {
    if (vectorLayer) {
      vectorLayer.removeAllFeatures()
      vectorLayer.setVisibility(false)
    }
  }

  /**
   * @link   https://github.com/aceakash/string-similarity
   * @param  {String} first
   * @param  {String} second
   * @return {Number}
   */
  function compareTwoStrings (first, second) {
    first = first.replace(/\s+/g, '')
    second = second.replace(/\s+/g, '')

    if (!first.length && !second.length) return 1           // if both are empty strings
    if (!first.length || !second.length) return 0           // if only one is empty string
    if (first === second) return 1                          // identical
    if (first.length === 1 && second.length === 1) return 0 // both are 1-letter strings
    if (first.length < 2 || second.length < 2) return 0     // if either is a 1-letter string

    let firstBigrams = new Map()
    for (let i = 0; i < first.length - 1; i++) {
      const bigram = first.substring(i, i + 2)
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1

      firstBigrams.set(bigram, count)
    }

    let intersectionSize = 0
    for (let i = 0; i < second.length - 1; i++) {
      const bigram = second.substring(i, i + 2)
      const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0

      if (count > 0) {
        firstBigrams.set(bigram, count - 1)
        intersectionSize++
      }
    }
    return (2.0 * intersectionSize) / (first.length + second.length - 2)
  }

  /**
   * @param  {String} mainString
   * @param  {String[]} targetStrings
   * @return {Number}
   */
  function findBestMatch (mainString, targetStrings) {
    let bestMatch = ''
    let bestMatchRating = 0
    let bestMatchIndex = -1

    for (let i = 0; i < targetStrings.length; i++) {
      let rating = compareTwoStrings(mainString, targetStrings[i])
      if (rating > bestMatchRating) {
        bestMatch = targetStrings[i]
        bestMatchRating = rating
        bestMatchIndex = i
      }
    }
    if (bestMatch === '' || bestMatchRating < 0.35) {
      console.log('❌', mainString, '🆚', targetStrings)
      return -1
    } else {
      console.log('✅', mainString, '🆚', bestMatch, ':', bestMatchRating)
      return bestMatchIndex
    }
  }
})()

