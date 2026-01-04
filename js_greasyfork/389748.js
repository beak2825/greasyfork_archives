// ==UserScript==
// @name         console-message-v2
// @description  Rich text console logging
// @version      2.0.0
// ==/UserScript==

(() => {

  // Properties whose values have a CSS type
  // of either <integer> or <number>
  const CSS_NUMERIC_PROPERTIES = new Set([
    'animation-iteration-count',
    'border-image-slice',
    'border-image-outset',
    'border-image-width',
    'column-count',
    'counter-increment',
    'fill-opacity',
    'flex-grow',
    'flex-shrink',
    'font-size-adjust',
    'font-weight',
    'grid-column',
    'grid-row',
    'initial-letters',
    'line-clamp',
    'line-height',
    'max-lines',
    'opacity',
    'order',
    'orphans',
    'stop-opacity',
    'stroke-dashoffset',
    'stroke-miterlimit',
    'stroke-opacity',
    'stroke-width',
    'tab-size',
    'widows',
    'z-index',
    'zoom'
  ])

  const _SIMPLE_METHODS = new Set(['groupEnd', 'trace'])
  const _TEXT_METHODS = new Set(['log', 'info', 'warn', 'error'])

  // ----------------------------------------------------------

  // const toCamelCase = s => s.replace(/-\w/g, match => match.charAt(1).toUpperCase())
  const toKebabCase = s => s.replace(/[A-Z]/g, match => '-' + match.toLowerCase())

  function getStyleForCssProps(cssProps) {
    return Object.entries(cssProps)
      .map(([ key, value ]) => {
        const cssProp = toKebabCase(key)

        if (typeof value === 'number' && !CSS_NUMERIC_PROPERTIES.has(cssProp)) {
          value = value + 'px'
        }

        return cssProp + ': ' + value
      })
      .join('; ')
  }

  // ----------------------------------------------------------

  var support = (function () {
    // Taken from https://github.com/jquery/jquery-migrate/blob/master/src/core.js
    function uaMatch(ua) {
      ua = ua.toLowerCase()

      var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || []

      return {
        browser: match[1] || "",
        version: match[2] || "0"
      }
    }
    var browserData = uaMatch(navigator.userAgent)

    return {
      isIE: browserData.browser == 'msie' || (browserData.browser == 'mozilla' && parseInt(browserData.version, 10) == 11)
    }
  })()

  // ----------------------------------------------------------

  class ConsoleMessage {
    /** @type ConsoleMessage | null */
    static _currentMessage = null

    static debug = false

    // ----------------------------------------

    constructor () {
      this._rootNode = {
        type: 'root',
        parentNode: null,
        styles: {},
        children: []
      }

      this._currentParent = this._rootNode

      this._calls = new MethodCalls()

      this._waiting = 0
      this._readyCallback = null
    }

    // ----------------------------------------

    extend(obj = {}) {
      const proto = Object.getPrototypeOf(this)
      Object.assign(proto, obj)
      return this
    }

    // ----------------------------------------

    /**
     * Begins a group. By default the group is expanded. Provide false if you want the group to be collapsed.
     * @param {boolean} [expanded = true] -
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    group (collapsed = false) {
      return this._appendNode(collapsed ? 'groupCollapsed' : 'group')
    }

    // ----------------------------------------

    /**
     * Ends the group and returns to writing to the parent message.
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    groupEnd () {
      return this._appendNode('groupEnd')
    }

    // ----------------------------------------

    /**
     * Starts a span with particular style and all appended text after it will use the style.
     * @param {Object} styles - The CSS styles to be applied to all text until endSpan() is called
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    span (styles = {}) {
      const parentNode = this._currentParent

      const span = {
        type: 'span',
        parentNode,
        previousStyles: {
          ...parentNode.styles
        },
        styles: {
          ...parentNode.styles,
          ...styles
        },
        children: []
      }

      parentNode.children.push(span)

      this._currentParent = span

      return this
    }

    // ----------------------------------------

    /**
     * Ends the current span styles and backs to the previous styles or the root if there are no other parents.
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    spanEnd () {
      if (this._currentParent.type === 'root') {
        throw new Error(`Cannot call spanEnd() without a span`)
      }

      this._currentParent = this._currentParent.parentNode
      return this
    }

    // ----------------------------------------

    /**
     * Appends a text to the current message. All styles in the current span are applied.
     * @param {string} text - The text to be appended
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    text (message, styles) {
      if (typeof styles !== 'object') {
        return this._appendNode('text', { message })
      }

      this.span(styles)

      this._appendNode('text', { message })

      this.spanEnd()

      return this
    }

    // ----------------------------------------

    /**
     * Adds a new line to the output.
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    line (method = 'log') {
      return this._appendNode('line', { method })
    }

    // ----------------------------------------

    /**
     * Adds an interactive DOM element to the output.
     * @param {HTMLElement} element - The DOM element to be added.
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    element (element) {
      return this._appendNode('element', { element })
    }

    // ----------------------------------------

    /**
     * Adds an interactive object tree to the output.
     * @param {*} object - A value to be added to the output.
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    object (object) {
      return this._appendNode('object', { object })
    }

    // ----------------------------------------

    /**
     * Adds an error message and stack trace to the output.
     * @param {Error} error - An error to be added to the output.
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    error (error) {
      return this._appendNode('error', { error })
    }

    // ----------------------------------------

    /**
     * Write a stack trace to the console.
     * @returns {ConsoleMessage} - Returns the message object itself to allow chaining.
     */
    trace() {
      return this._appendNode('trace')
    }

    // ----------------------------------------

    _appendNode (type, props = {}) {
      const child = {
        type,
        parentNode: this._currentParent,
        ...props
      }

      this._currentParent.children.push(child)

      return this
    }

    // ----------------------------------------

    /**
     * Prints the message to the console.
     * Until print() is called there will be no result to the console.
     */
    print () {
      if (ConsoleMessage.debug) {
        console.group(`this._rootNode`)
        console.dir(this._rootNode)
      }

      try {
        this._generateMethodCalls(this._rootNode)

        if (ConsoleMessage.debug) {
          console.dir(this._calls)
          console.groupEnd()
        }

        this._calls.executeAll()
      } catch (ex) {
        console.warn(ex)

        if (ConsoleMessage.debug) {
          console.groupEnd()
        }
      }

      ConsoleMessage._currentMessage = null
    }

    // ----------------------------------------

    _generateMethodCalls (node) {
      const calls = this._calls

      switch (node.type) {
        case 'root':
        case 'span':
          calls.appendStyle(node.styles)

          for (const child of node.children) {
            this._generateMethodCalls(child)
          }

          if (node.previousStyles != null) {
            calls.appendStyle(node.previousStyles)
          }

          break

        case 'line':
          calls
            .addCall(node.method)
          break

        case 'group':
        case 'groupCollapsed':
        case 'groupEnd':
        case 'trace':
          calls
            .addCall(node.type)
            .addCall()
          break

        case 'text':
          calls
            .appendText(node.message)
          break

        case 'element':
          calls
            .appendText('%o')
            .addArg(node.element)
          break

        case 'object':
          calls
            .appendText('%O')
            .addArg(node.object)
          break

        case 'error':
          calls
            .addCall('error')
            .addArg(node.error)
            .addCall()
          break
      }
    }
  }

  // ----------------------------------------------------------

  class MethodCalls {
    constructor () {
      this.methodCalls = [
        new MethodCall('log')
      ]
    }

    // ----------------------------------------

    get currentCall () {
      return this.methodCalls[ this.methodCalls.length - 1 ]
    }

    // ----------------------------------------

    addCall (methodName = 'log') {
      if (_TEXT_METHODS.has(methodName) && this.currentCall.canChangeMethod) {
        this.currentCall.changeMethod(methodName)
      } else {
        this.methodCalls.push(new MethodCall(methodName))
      }

      return this
    }

    // ----------------------------------------

    appendText (text) {
      this.currentCall.appendText(text)
      return this
    }

    // ----------------------------------------

    appendStyle (cssProps) {
      this.currentCall.appendStyle(cssProps)
      return this
    }

    // ----------------------------------------

    addArg (arg) {
      this.currentCall.addArg(arg)
      return this
    }

    // ----------------------------------------

    executeAll () {
      this.methodCalls
        .filter(c => c.canExecute)
        .forEach(c => {
          c.execute()
        })
    }
  }

  // ----------------------------------------------------------

  class MethodCall {
    constructor (methodName = 'log') {
      this.methodName = methodName

      this.isSimple = _SIMPLE_METHODS.has(methodName)
      this.canChangeMethod = _TEXT_METHODS.has(methodName)

      this.text = ''
      this.args = []
    }

    // ----------------------------------------

    get lastArg () {
      return this.args[ this.args.length - 1 ]
    }

    // ----------------------------------------

    changeMethod (newMethodName) {
      if (!this.canChangeMethod) {
        throw new Error(`Cannot change method call`)
      }

      if (!_TEXT_METHODS.has(newMethodName)) {
        throw new Error(`Cannot change method call to "${newMethodName}"`)
      }

      this.methodName = newMethodName
      this.canChangeMethod = false
    }

    // ----------------------------------------

    _throwIfSimple () {
      if (this.isSimple) {
        throw new Error(`Calls to console.${this.methodName} cannot have arguments`)
      }
    }

    // ----------------------------------------

    appendText (text, styles) {
      this._throwIfSimple()

      this.text += text
      this.canChangeMethod = false

      return this
    }

    // ----------------------------------------

    appendStyle (cssProps) {
      this._throwIfSimple()

      const css = getStyleForCssProps(cssProps)

      if (this.text.endsWith('%c')) {
        this.args[ this.args.length - 1 ] = css
      } else {
        this.text += '%c'
        this.args.push(css)
      }

      this.canChangeMethod = false

      return this
    }

    // ----------------------------------------

    // updateLastArg (newValue) {
    //   if (this.args.length) {
    //     this.args[ this.args.length ] = newValue
    //   }
    //   return this
    // }

    // ----------------------------------------

    addArg (newArg) {
      this._throwIfSimple()

      this.args.push(newArg)
      this.canChangeMethod = false

      return this
    }

    // ----------------------------------------

    get canExecute () {
      return this.isSimple
        ? true
        : this.text.length > 0 && this.text !== '%c'
    }

    // ----------------------------------------

    execute () {
      const method = console[this.methodName].bind(console)
      method(this.text, ...this.args)
      return this
    }
  }

  // ----------------------------------------------------------

  // console.message().text('woo').text('blue',{color:'#05f'}).line('info').element(document.body).print()

  /**
   * Returns or creates the current message object.
   *
   * @returns {ConsoleMessage} - The message object
   */
  function message() {
    if (ConsoleMessage._currentMessage === null) {
      ConsoleMessage._currentMessage = new ConsoleMessage()
    }

    return ConsoleMessage._currentMessage
  }

  if (window) {
    if (window.console) {
      window.console.message = message
    }

    window.ConsoleMessage = ConsoleMessage
    window.ConsoleMessage.message = message
  }

})()
