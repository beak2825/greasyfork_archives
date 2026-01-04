// ==UserScript==
// @author       Lete114
// @version      0.1
// @license      MIT License
// @name         Console Importer
// @description  Easily import JS and CSS resources from Chrome console.
// @match        *://*/*
// @icon         data:image/png;base64,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
// @namespace    https://github.com/Lete114/my-tampermonkey-scripts
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/467465/Console%20Importer.user.js
// @updateURL https://update.greasyfork.org/scripts/467465/Console%20Importer.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // https://github.com/pd4d10/console-importer
  const window = unsafeWindow
  const tiza = new Tiza()
  const PREFIX_TEXT = '[$i]: '
  const prefix = tiza.color('blue').text
  const strong = tiza.color('blue').bold().text
  const error = tiza.color('red').text
  const log = (...args) => tiza.log(prefix(PREFIX_TEXT), ...args)
  const logError = (...args) => tiza.log(error(PREFIX_TEXT), ...args)

  /**
   * @type { Set<string> | null }
   */
  let lastGlobalVariableSet = null

  /**
   *
   * @param { string } name
   * @returns
   */
  function createBeforeLoad(name) {
    return () => {
      lastGlobalVariableSet = new Set(Object.keys(window))
      log(strong(name), ' is loading, please be patient...')
    }
  }

  /**
   *
   * @param { string } name
   * @param { string? } url
   * @returns
   */
  function createOnLoad(name, url) {
    return () => {
      const urlText = url ? `(${url})` : ''
      log(strong(name), `${urlText} is loaded.`)

      const currentGlobalVariables = Object.keys(window)
      const newGlobalVariables = currentGlobalVariables.filter(
        (key) => !lastGlobalVariableSet?.has(key)
      )
      if (newGlobalVariables.length > 0) {
        log(
          'The new global variables are as follows: ',
          strong(newGlobalVariables.join(',')),
          ' . Maybe you can use them.'
        )
      } else {
        // maybe css request or script loaded already
      }
      // Update global variable list
      lastGlobalVariableSet = new Set(currentGlobalVariables)
    }
  }

  /**
   *
   * @param { string } name
   * @param { string? } url
   * @returns
   */
  function createOnError(name, url) {
    return () => {
      const urlText = url ? `(${strong(url)})` : ''
      logError(
        'Fail to load ',
        strong(name),
        ', is this URL',
        urlText,
        ' correct?'
      )
    }
  }

  // Try to remove referrer for security
  // https://imququ.com/post/referrer-policy.html
  // https://www.w3.org/TR/referrer-policy/
  function addNoReferrerMeta() {
    const originMeta =
      document.querySelector < HTMLMetaElement > 'meta[name=referrer]'

    if (originMeta) {
      // If there is already a referrer policy meta tag, save origin content
      // and then change it, call `remove` to restore it
      const content = originMeta.content
      originMeta.content = 'no-referrer'
      return function remove() {
        originMeta.content = content
      }
    } else {
      // Else, create a new one, call `remove` to delete it
      const meta = document.createElement('meta')
      meta.name = 'referrer'
      meta.content = 'no-referrer'
      document.head.appendChild(meta)
      return function remove() {
        // Removing meta tag directly not work, should set it to default first
        meta.content = 'no-referrer-when-downgrade'
        document.head.removeChild(meta)
      }
    }
  }

  /**
   * Insert script tag
   * @param { sting } url
   * @param { function } onload
   * @param { function } onerror
   */
  function injectScript(url, onload, onerror) {
    const remove = addNoReferrerMeta()
    const script = document.createElement('script')
    script.src = url
    script.onload = onload
    script.onerror = onerror
    document.body.appendChild(script)
    remove()
    document.body.removeChild(script)
  }

  /**
   * Insert link tag
   * @param { string } url
   * @param { function } onload
   * @param { function } onerror
   */
  function injectStyle(url, onload, onerror) {
    const remove = addNoReferrerMeta()
    const link = document.createElement('link')
    link.href = url
    link.rel = 'stylesheet'
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#Stylesheet_load_events
    link.onload = onload
    link.onerror = onerror
    document.head.appendChild(link)
    remove()
    // Should not remove <link> tag, unlike <script>
  }

  /**
   *
   * @param { string } url
   * @param {*} beforeLoad
   * @param {*} onload
   * @param {*} onerror
   * @returns
   */
  function inject(
    url,
    beforeLoad = createBeforeLoad(url),
    onload = createOnLoad(url),
    onerror = createOnError(url)
  ) {
    beforeLoad()

    // Handle CSS
    if (/\.css$/.test(url)) {
      return injectStyle(url, onload, onerror)
    }

    // Handle JS
    return injectScript(url, onload, onerror)
  }

  /**
   * From cdnjs
   * https://cdnjs.com/
   * @param { string } name
   */
  function cdnjs(name) {
    log('Searching for ', strong(name), ', please be patient...')
    fetch(`https://api.cdnjs.com/libraries?search=${name}`, {
      referrerPolicy: 'no-referrer'
    })
      .then((res) => res.json())
      .then(({ results }) => {
        if (results.length === 0) {
          logError(
            'Sorry, ',
            strong(name),
            ' not found, please try another keyword.'
          )
          return
        }

        const matchedResult = results.filter((item) => item.name === name)
        const { name: exactName, latest: url } = matchedResult[0] || results[0]
        if (name !== exactName) {
          log(
            strong(name),
            ' not found, import ',
            strong(exactName),
            ' instead.'
          )
        }

        inject(
          url,
          createBeforeLoad(exactName),
          createOnLoad(exactName, url),
          createOnError(exactName, url)
        )
      })
      .catch(() => {
        logError(
          'There appears to be some trouble with your network. If you think this is a bug, please report an issue:'
        )
        logError('https://github.com/pd4d10/console-importer/issues')
      })
  }

  /**
   * From unpkg
   * https://unpkg.com
   * @param { string } name
   */
  function unpkg(name) {
    createBeforeLoad(name)()
    const url = `https://unpkg.com/${name}`
    injectScript(url, createOnLoad(name, url), createOnError(name, url))
  }

  /**
   * https://www.jsdelivr.com/esm
   * @param { string } name
   * @returns
   */
  async function esm(name) {
    log(strong(name), '(esm) is loading, please be patient...')
    const res = await import(`https://esm.run/${name}`)
    return res
  }

  /**
   * Entry
   * @param { string } originName
   * @returns
   */
  function importer(originName) {
    if (typeof originName !== 'string') {
      throw new Error('Argument should be a string, please check it.')
    }

    // Trim string
    const name = originName.trim()

    // If it is a valid URL, inject it directly
    if (/^https?:\/\//.test(name)) {
      return inject(name)
    }

    // If version specified, try unpkg
    if (name.indexOf('@') !== -1) {
      return unpkg(name)
    }

    return cdnjs(name)
  }

  importer.cdnjs = cdnjs
  importer.unpkg = unpkg
  importer.esm = esm

  // Do not output annoying ugly string of function content
  importer.toString = () => '$i'

  // Assign to console
  console.$i = importer

  // Do not break existing $i
  const win = window
  if (typeof win.$i === 'undefined') {
    win.$i = importer
  } else {
    log('$i is already in use, please use `console.$i` instead')
  }

  function Tiza(currentStyles, texts, styles) {
    if (currentStyles === void 0) {
      currentStyles = []
    }
    if (texts === void 0) {
      texts = []
    }
    if (styles === void 0) {
      styles = []
    }
    var _this = this
    // Get method
    this.getCurrentStyles = function () {
      return _this._currentStyles
    }
    this.getTexts = function () {
      return _this._texts
    }
    this.getStyles = function () {
      return _this._styles
    }
    // Push a style to current Styles
    this.style = function (s) {
      return new Tiza(
        _this._currentStyles.concat([s]),
        _this._texts,
        _this._styles
      )
    }
    // Alias for style method
    this.color = function (c) {
      return _this.style('color:' + c)
    }
    this.bgColor = function (c) {
      return _this.style('background-color:' + c)
    }
    this.bold = function () {
      return _this.style('font-weight:bold')
    }
    this.italic = function () {
      return _this.style('font-style:italic')
    }
    this.size = function (n) {
      var s = typeof n === 'number' ? n + 'px' : n // Convert number to px
      return _this.style('font-size:' + s)
    }
    // Clear all current styles
    this.reset = function () {
      return new Tiza([], _this._texts, _this._styles)
    }
    this.text = function () {
      var args = []
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i]
      }
      var texts = _this._texts.slice()
      var styles = _this._styles.slice()
      args.forEach(function (arg) {
        if (arg instanceof Tiza) {
          texts.push.apply(texts, arg.getTexts())
          styles.push.apply(styles, arg.getStyles())
        } else {
          texts.push(arg)
          styles.push(_this._currentStyles.join(';'))
        }
      })
      return new Tiza(_this._currentStyles, texts, styles)
    }
    this.space = function (count) {
      if (count === void 0) {
        count = 1
      }
      return _this.text(repeat(' ', count))
    }
    this.newline = function (count) {
      if (count === void 0) {
        count = 1
      }
      return _this.text(repeat('\n', count))
    }
    this._output = function (type) {
      return function () {
        var args = []
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i]
        }
        var ins = _this.text.apply(_this, args)
        console[type].apply(
          console,
          [
            ins
              .getTexts()
              .map(function (t) {
                return '%c' + t
              })
              .join('')
          ].concat(ins._styles)
        )
        return new Tiza(ins.getCurrentStyles())
      }
    }
    this.log = this._output('log')
    this.info = this._output('info')
    this.warn = this._output('warn')
    this.error = this._output('error')
    this._currentStyles = currentStyles
    this._texts = texts
    this._styles = styles
  }
})()
