// ==UserScript==
// @name         Page Centering
// @namespace    https://greasyfork.org/users/1009-kengo321
// @version      4
// @description  ウェブページを中央配置
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @match        *://*/*
// @license      MIT
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/15722/Page%20Centering.user.js
// @updateURL https://update.greasyfork.org/scripts/15722/Page%20Centering.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  var createObject = function(prototype, properties) {
    var descriptors = function() {
      return Object.keys(properties).reduce(function(descriptors, key) {
        descriptors[key] = Object.getOwnPropertyDescriptor(properties, key)
        return descriptors
      }, {})
    }
    return Object.defineProperties(Object.create(prototype), descriptors())
  }
  var invoke = function(methodName, args) {
    return function(target) {
      return target[methodName].apply(target, args)
    }
  }

  var EventEmitter = (function() {
    var EventEmitter = function() {
      this._eventNameToListeners = new Map()
    }
    EventEmitter.prototype = {
      on(eventName, listener) {
        var m = this._eventNameToListeners
        var v = m.get(eventName)
        if (v) {
          v.add(listener)
        } else {
          m.set(eventName, new Set([listener]))
        }
        return this
      },
      off(eventName, listener) {
        var v = this._eventNameToListeners.get(eventName)
        if (v) v.delete(listener)
        return this
      },
      emit(eventName) {
        var m = this._eventNameToListeners
        var args = Array.from(arguments).slice(1)
        for (var l of m.get(eventName) || []) l(...args)
      },
    }
    return EventEmitter
  })()

  var PageCentering = (function() {
    var PageCentering = function(obj) {
      this.url = obj.url
      this.maxWidth = obj.maxWidth
      this.matched = false
    }
    PageCentering.prototype = {
      setMatchedIfStarted(url) {
        this.matched = url.startsWith(this.url)
        return this
      },
      center(doc) {
        var s = doc.documentElement.style
        s.maxWidth = this.maxWidth
        s.position = 'relative'
        s.margin = '0px auto'
      },
    }
    Object.assign(PageCentering, {
      clear(doc) {
        var s = doc.documentElement.style
        s.maxWidth = ''
        s.position = ''
        s.margin = ''
      },
      MATCHED_URL_ORDER(o1, o2) {
        if (o1.matched && !o2.matched) return -1
        if (!o1.matched && o2.matched) return 1
        if (o1.url < o2.url) return -1
        if (o1.url > o2.url) return 1
        return 0
      },
      takeLongerURL(o1, o2) {
        if (o1) return o1.url.length >= o2.url.length ? o1 : o2
        return o2
      },
    })
    return PageCentering
  })()

  var Config = (function(_super) {
    var Config = function(get, set) {
      _super.call(this)
      this.get = get
      this.set = set
    }
    Config.prototype = createObject(_super.prototype, {
      async _getPageCenteringObjs() {
        return JSON.parse(await this.get('pageCenterings', '[]'))
      },
      async getPageCenterings() {
        return (await this._getPageCenteringObjs()).map(function(o) {
          return new PageCentering(o)
        })
      },
      async _emitPageCenteringsChanged() {
        this.emit('pageCenteringsChanged', await this.getPageCenterings())
      },
      async setPageCentering(pageCentering) {
        var f = function(o) { return o.url !== pageCentering.url }
        var newObj = {url: pageCentering.url, maxWidth: pageCentering.maxWidth}
        var newObjs = (await this._getPageCenteringObjs()).filter(f).concat(newObj)
        await this.set('pageCenterings', JSON.stringify(newObjs))
        await this._emitPageCenteringsChanged()
      },
      async deletePageCentering(url) {
        var f = function(o) { return o.url !== url }
        var newObjs = (await this._getPageCenteringObjs()).filter(f)
        await this.set('pageCenterings', JSON.stringify(newObjs))
        await this._emitPageCenteringsChanged()
      },
    })
    return Config
  })(EventEmitter)

  var ConfigDialog = (function(_super) {
    var initUrlCell = function(urlCell, pageCentering) {
      urlCell.textContent = pageCentering.url
      if (pageCentering.matched) urlCell.className = 'matched'
    }
    var focusAndSelect = function(elem) {
      elem.focus()
      elem.select()
    }
    var ENTER_KEY = 13
    var ESCAPE_KEY = 27
    var invokeIf = function(key, func) {
      return function(event) {
        if (event.which === key) func()
      }
    }
    var ConfigDialog = function(doc) {
      _super.call(this)
      this.doc = doc
      this.targetURL = this._currentURL
      this._addEventListeners()
      focusAndSelect(this.targetUrlInput)
    }
    ConfigDialog.prototype = createObject(_super.prototype, {
      get _currentURL() {
        return this.doc.defaultView.frameElement.ownerDocument.location.href
      },
      _addEventListeners() {
        var emitPageCenteringChangedIfValid
          = this._emitPageCenteringChangedIfValid.bind(this)
        ;[[this.closeButton, [
            ['click', this._close.bind(this)],
          ]],
          [this.changeButton, [
            ['click', emitPageCenteringChangedIfValid],
          ]],
          [this.targetUrlInput, [
            ['keydown', invokeIf(ENTER_KEY, emitPageCenteringChangedIfValid)],
          ]],
          [this.maxWidthInput, [
            ['keydown', invokeIf(ENTER_KEY, emitPageCenteringChangedIfValid)],
            ['input', this._updateMaxWidthInputValidity.bind(this)],
            ['input', this._updateChangeButtonDisabled.bind(this)],
          ]],
          [this.doc, [
            ['keydown', invokeIf(ESCAPE_KEY, this._close.bind(this))],
          ]],
        ].forEach(function(a) {
          a[1].forEach(function(b) {
            a[0].addEventListener(b[0], b[1])
          })
        })
      },
      get targetUrlInput() {
        return this.doc.getElementById('targetUrlInput')
      },
      get targetURL() {
        return this.targetUrlInput.value
      },
      set targetURL(targetURL) {
        this.targetUrlInput.value = targetURL
      },
      get maxWidthInput() {
        return this.doc.getElementById('maxWidthInput')
      },
      get maxWidth() {
        return this.maxWidthInput.value
      },
      set maxWidth(maxWidth) {
        this.maxWidthInput.value = maxWidth
      },
      get closeButton() {
        return this.doc.getElementById('closeButton')
      },
      get changeButton() {
        return this.doc.getElementById('changeButton')
      },
      _emitPageCenteringChangedIfValid() {
        if (!this._hasValidMaxWidth()) return
        var o = {url: this.targetURL, maxWidth: this.maxWidth}
        this.emit('pageCenteringChanged', new PageCentering(o))
      },
      _sort(pageCenterings) {
        return pageCenterings
          .map(invoke('setMatchedIfStarted', [this._currentURL]))
          .sort(PageCentering.MATCHED_URL_ORDER)
      },
      _initDelCell(delCell, pageCentering) {
        delCell.textContent = '削除'
        delCell.addEventListener('click', function() {
          this.emit('pageCenteringDeleted', pageCentering.url)
        }.bind(this))
      },
      _initSettingCell(settingCell, pageCentering) {
        settingCell.textContent = 'セット'
        settingCell.addEventListener('click', function() {
          this.targetURL = pageCentering.url
          this.maxWidth = pageCentering.maxWidth
          focusAndSelect(this.maxWidthInput)
          this._updateMaxWidthInputValidity()
          this._updateChangeButtonDisabled()
        }.bind(this))
      },
      get dataTable() {
        return this.doc.getElementById('dataTable')
      },
      set pageCenterings(pageCenterings) {
        var t = this.dataTable
        for (var r of Array.from(t.rows)) r.remove()
        for (var c of this._sort(pageCenterings)) {
          var tr = t.insertRow(-1)
          initUrlCell(tr.insertCell(-1), c)
          tr.insertCell(-1).textContent = c.maxWidth
          this._initSettingCell(tr.insertCell(-1), c)
          this._initDelCell(tr.insertCell(-1), c)
        }
      },
      _close() {
        this.doc.defaultView.frameElement.remove()
        this.emit('closed')
      },
      _hasValidMaxWidth() {
        var e = this.doc.createElement('div')
        e.style.maxWidth = this.maxWidthInput.value
        return e.style.maxWidth !== ''
      },
      _updateMaxWidthInputValidity() {
        var MESSAGE = 'CSS の max-width プロパティに有効な値のみを設定できます。'
        if (this._hasValidMaxWidth()) {
          this.maxWidthInput.setCustomValidity('')
        } else {
          this.maxWidthInput.setCustomValidity(MESSAGE)
        }
      },
      _updateChangeButtonDisabled() {
        this.changeButton.disabled = !this._hasValidMaxWidth()
      },
    })
    var frameLoaded = function(frame, back, config) {
      var set = function(target, propName) {
        return function(value) { target[propName] = value }
      }
      var clear = function(updateDialog) {
        return function() {
          back.remove()
          config.off('pageCenteringsChanged', updateDialog)
        }
      }
      return async function() {
        var dialog = new ConfigDialog(frame.contentDocument)
          .on('pageCenteringDeleted', config.deletePageCentering.bind(config))
          .on('pageCenteringChanged', config.setPageCentering.bind(config))
        dialog.pageCenterings = await config.getPageCenterings()
        var updateDialog = set(dialog, 'pageCenterings')
        config.on('pageCenteringsChanged', updateDialog)
        dialog.on('closed', clear(updateDialog))
      }
    }
    ConfigDialog.show = function(doc, config) {
      var MAX_Z_INDEX = 2147483647
      var back = doc.createElement('div')
      back.style.backgroundColor = 'black'
      back.style.opacity = '0.5'
      back.style.zIndex = MAX_Z_INDEX - 1
      back.style.position = 'fixed'
      back.style.top = '0'
      back.style.left = '0'
      back.style.width = '100%'
      back.style.height = '100%'
      doc.body.appendChild(back)
      var f = doc.createElement('iframe')
      f.style.position = 'fixed'
      f.style.top = '0'
      f.style.left = '0'
      f.style.width = '100%'
      f.style.height = '100%'
      f.style.zIndex = MAX_Z_INDEX
      f.srcdoc = ConfigDialog.SRC_DOC
      f.addEventListener('load', frameLoaded(f, back, config))
      doc.body.appendChild(f)
    }
    ConfigDialog.SRC_DOC = `<!doctype html>
<html><head><style>
  html {
    margin: 0 auto;
    max-width: 50em;
    height: 100%;
    line-height: 1.5em;
  }
  body {
    height: 100%;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  p {
    margin: 0;
  }
  #dialog {
    overflow: auto;
    padding: 8px;
    background-color: white;
  }
  #top {
    text-align: right;
  }
  #targetUrlInput {
    width: 100%;
  }
  #maxWidthInput:invalid {
    color: red;
    font-weight: bold;
  }
  #dataTable {
    border-collapse: collapse;
  }
  #dataTable td {
    border: solid thin;
    padding: 0 0.5em;
    line-height: 1.5em;
  }
  #dataTable td:nth-child(1) {
    word-break: break-all;
  }
  #dataTable td:nth-child(2) {
    text-align: right;
    white-space: nowrap;
  }
  #dataTable td:nth-child(3),
  #dataTable td:nth-child(4) {
    text-decoration: underline;
    cursor: pointer;
    white-space: nowrap;
  }
  .matched {
    font-weight: bold;
  }
</style></head><body>
  <div id=dialog>
    <p id=top><input type=button value=閉じる id=closeButton></p>
    <p><label for=targetUrlInput>対象URL(前方一致):</label></p>
    <p><input type=url id=targetUrlInput></p>
    <p><label for=maxWidthInput>最大幅:</label></p>
    <p><input value=1000px id=maxWidthInput></p>
    <p><input type=button value=追加／変更 id=changeButton></p>
    <table id=dataTable></table>
  </div>
</body></html>`
    return ConfigDialog
  })(EventEmitter)

  function addConfigButtonIfScriptPage(config) {
    if (!location.href.startsWith('https://greasyfork.org/ja/scripts/15722-page-centering'))
      return
    const add = () => {
      const e = document.createElement('button')
      e.type = 'button'
      e.textContent = '設定'
      e.addEventListener('click', function() {
        ConfigDialog.show(document, config)
      })
      document.querySelector('#script-info > header > h2').appendChild(e)
    }
    if (['interactive', 'complete'].includes(document.readyState))
      add()
    else
      document.addEventListener('DOMContentLoaded', add)
  }
  var main = async function() {
    const [get, set] = typeof GM_getValue === 'undefined'
                       ? [GM.getValue, GM.setValue]
                       : [GM_getValue, GM_setValue]
    var config = new Config(get, set)
    var updateCentering = function(pageCenterings) {
      var c = pageCenterings
        .map(invoke('setMatchedIfStarted', [document.location.href]))
        .filter(function(c) { return c.matched })
        .reduce(PageCentering.takeLongerURL, null)
      if (c) c.center(document); else PageCentering.clear(document)
    }
    updateCentering(await config.getPageCenterings())
    config.on('pageCenteringsChanged', updateCentering)
    if (typeof GM_registerMenuCommand !== 'undefined') {
      GM_registerMenuCommand('Page Centering 設定', function() {
        ConfigDialog.show(document, config)
      })
    }
    addConfigButtonIfScriptPage(config)
  }

  main()
})()
