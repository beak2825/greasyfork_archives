// ==UserScript==
// @name         WME EntryPoint
// @version      0.0.1
// @description  Library for Waze Map Editor Greasy Fork scripts
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-entrypoint/issues
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://anton.shevchuk.name&size=64
// @grant        none
// ==/UserScript==

/* jshint esversion: 8 */

class entryPoint {
  constructor () {
    let {
      point = { type: 'Point', coordinates: [0, 0] },
      entry = true,
      exit = false,
      primary = false,
      name = ''
    } = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}

    this._point = point
    this._entry = entry
    this._exit = exit
    this._isPrimary = primary
    this._name = name
  }

  with () {
    let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
    return new entryPoint(Object.assign(this.toJSON(), e))
  }

  getPoint () {
    return this._point
  }

  getEntry () {
    return this._entry
  }

  getExit () {
    return this._exit
  }

  getName () {
    return this._name
  }

  isPrimary () {
    return this._isPrimary
  }

  toJSON () {
    return {
      entry: this._entry,
      exit: this._exit,
      name: this._name,
      point: this._point,
      primary: this._isPrimary
    }
  }

  clone () {
    return this.with()
  }

  equals (e) {
    return this._point.type === e._point.type
      && this._point.coordinates[0] === e._point.coordinates[0]
      && this._point.coordinates[1] === e._point.coordinates[1]
      && this._name === e._name
      && this._isPrimary === e._isPrimary
      && this._entry === e._entry
      && this._exit === e._exit
  }
}
