// ==UserScript==
// @name         data-cache.js
// @version      1.0.0
// @description  A Map sub-class backed by a persistant store
// ==/UserScript==

/* jshint asi: true, esnext: true */

DataCache = (() => {

  const NORMAL = 'font-weight: normal; text-decoration: none; color: black'
  const ERROR = 'font-weight: bold; color: #f4f'
  const LINK = 'color: #05f; text-decoration: underline'
  const BOLD = 'font-weight: bold'
  const BLUE = 'color: #05f'

  // --------------------------------------------------------------------

  function* entries(v) {
    if (typeof v !== 'object') {
      throw new TypeError(`Non-object argument passed to entries(v)`, v)
    }

    if (typeof v.entries === 'function') {
      yield* v.entries()
    } else {
      for (const k of Object.keys(v)) {
        const val = [ k, v[k] ]
        yield val
      }
    }
  }

  // --------------------------------------------------------------------------

  class DataCache extends Map {
    constructor({ getter, setter = null, key = null, debug = false }) {
      super()

      setter = setter || getter

      if (key) {
        this._getter = () => getter(key)
        this._setter = value => setter(key, value)
      } else {
        this._getter = getter
        this._setter = setter || getter
      }

      this._key = key
      this._debug = typeof setter === 'boolean' ? setter : debug

      this.load()
    }

    // ------------------------------------------

    _set(k, v) {
      if (v === super.get(k)) {
        return false
      }

      super.set(k, v)
      return true
    }

    // ------------------------------------------

    set(k, v) {
      if (this._set(k, v)) {
        this.save()
      }
    }

    // ------------------------------------------

    delete(k) {
      if (super.has(k)) {
        super.delete(k)
        this.save()
      }
    }

    // ------------------------------------------

    clear() {
      if (this.size > 0) {
        super.clear()
        this.save()
      }
    }

    // ------------------------------------------

    update(obj) {
      let changed = false

      for (const [ k, v ] of entries(obj)) {
        changed = this._set(k, v) || changed
      }

      if (changed) {
        this.save()
      }

      return changed
    }

    // ------------------------------------------

    replace(obj) {
      let changed = false

      if (this.size > 0) {
        super.clear()
        changed = true
      }

      for (const [ k, v ] of entries(obj)) {
        changed = this._set(k, v) || changed
      }

      if (changed) {
        this.save()
      }

      return changed
    }

    // ------------------------------------------

    toJSON() {
      return [...this.entries()]
        .reduce((obj, [ k, v ]) => Object.assign(obj, { [k]: v }), {})
    }

    // ------------------------------------------

    save() {
      try {
        const json = this.toJSON()
        const jstr = JSON.stringify(json, null, this._debug * 2)

        // GM_setValue(this._key, jstr)
        this._setter(json)

        this._log(`save(): ${this.size} items\n\n${jstr}`)
      } catch (ex) {
        this._log(`save(): error: ${ex}`)
      }
    }

    // ------------------------------------------

    load(json) {
      super.clear()

      try {
        // json = json || JSON.parse(GM_getValue(this._key))
        json = json || this._getter()

        for (const [ k, v ] of entries(json)) {
          super.set(k, v)
        }

        this._log(`load(): ${this.size} items\n\n${JSON.stringify(json, null, 2)}`)
      }
      catch (ex) {
        this._log(`load(): error: ${ex}`)
      }
    }

    // ------------------------------------------

    edit(text) {
      const res = window.prompt(text, JSON.stringify(this.toJSON(), null, 2))

      if (typeof res !== 'string') return

      try {
        const json = JSON.parse(res)

        if (this.replace(json)) {
          this._log(`edit(): ${this.size} items\n\n${JSON.stringify(json, null, 2)}`)
        }
      } catch (ex) {
        this._log(`edit(): error: ${ex}`)
      }
    }

    // ------------------------------------------

    _log(msg) {
      if (this._debug) {
        const ks = this._key ? `key: %c'${this._key}'%c` : '%c%c'
        console.info(`DataCache(${ks}): ${msg}`, LINK, NORMAL)
      }
    }

    // ------------------------------------------

    toString() {
      const ks = this._key ? `key: '${this._key}', ` : ''
      const kl = [...this.keys()].map(String).join(', ')

      return `DataCache(${ks}debug: ${this._debug}): [ ${kl} ]`
    }

    // ------------------------------------------

    dump() {
      // this._log(JSON.stringify(this.toJSON(), null, 2))
      const el = [...this.entries()]
        .map(([ key, value ]) => ({ key, value }))

      console.table(el)
    }
  }

  DataCache[Symbol.toStringTag] = 'DataCache'

  // --------------------------------------------------------------------------

  return DataCache

})()
