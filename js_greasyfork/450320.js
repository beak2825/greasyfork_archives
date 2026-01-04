// ==UserScript==
// @name         WME UI
// @version      0.4.2
// @description  UI Library for Waze Map Editor Greasy Fork scripts
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-ui/issues
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://anton.shevchuk.name&size=64
// @grant        none
// ==/UserScript==

/* jshint esversion: 8 */
/* global I18n */

// WARNING: this is unsafe!
let unsafePolicy = {
  createHTML: string => string
}

// Feature testing
if (window.trustedTypes && window.trustedTypes.createPolicy) {
  unsafePolicy = window.trustedTypes.createPolicy('unsafe', {
    createHTML: string => string,
  })
}

class WMEUI {
  /**
   * Normalize title or UID
   * @param string
   * @returns {string}
   */
  static normalize (string) {
    return string.replace(/\W+/gi, '-').toLowerCase()
  }

  /**
   * Inject CSS styles
   * @param {String} css
   * @return void
   */
  static addStyle (css) {
    let style = document.createElement('style')
    style.type = 'text/css' // is required
    style.innerHTML = unsafePolicy.createHTML(css)
    document.querySelector('head').appendChild(style)
  }

  /**
   * Add translation for the I18n object
   * @param {String} uid
   * @param {Object} data
   * @return void
   */
  static addTranslation (uid, data) {
    if (!data.en) {
      console.error('Default translation `en` is required')
    }
    let locale = I18n.currentLocale()
    I18n.translations[locale][uid] = data[locale] || data.en
  }
}

/**
 * God class, create it once
 */
class WMEUIHelper {
  constructor (uid) {
    this.uid = WMEUI.normalize(uid)
    this.index = 0
  }

  /**
   * Generate unque ID
   * @return {string}
   */
  generateId () {
    this.index++
    return this.uid + '-' + this.index
  }

  /**
   * Create a panel for the sidebar
   * @param {String} title
   * @param {Object} attributes
   * @return {WMEUIHelperPanel}
   */
  createPanel (title, attributes = {}) {
    return new WMEUIHelperPanel(this.uid, this.generateId(), title, attributes)
  }

  /**
   * Create a tab for the sidebar
   * @param {String} title
   * @param {Object} attributes
   * @return {WMEUIHelperTab}
   */
  createTab (title, attributes = {}) {
    return new WMEUIHelperTab(this.uid, this.generateId(), title, attributes)
  }

  /**
   * Create a modal window
   * @param {String} title
   * @param {Object} attributes
   * @return {WMEUIHelperModal}
   */
  createModal (title, attributes = {}) {
    return new WMEUIHelperModal(this.uid, this.generateId(), title, attributes)
  }

  /**
   * Create a field set
   * @param {String} title
   * @param {Object} attributes
   * @return {WMEUIHelperFieldset}
   */
  createFieldset (title, attributes = {}) {
    return new WMEUIHelperFieldset(this.uid, this.generateId(), title, attributes)
  }
}

/**
 * Basic for all UI elements
 */
class WMEUIHelperElement {
  constructor (uid, id, title = null, attributes = {}) {
    this.uid = uid
    this.id = id
    this.title = title
    // HTML attributes
    this.attributes = attributes
    // DOM element
    this.element = null
    // Children
    this.elements = []
  }

  /**
   * Add WMEUIHelperElement to container
   * @param {WMEUIHelperElement} element
   * @return {WMEUIHelperElement} element
   */
  addElement (element) {
    this.elements.push(element)
    return element
  }

  /**
   * @param {HTMLElement} element
   * @return {HTMLElement}
   */
  applyAttributes (element) {
    for (let attr in this.attributes) {
      if (this.attributes.hasOwnProperty(attr)) {
        element[attr] = this.attributes[attr]
      }
    }
    return element
  }

  /**
   * @return {HTMLElement}
   */
  html () {
    if (!this.element) {
      this.element = this.toHTML()
      this.element.className += ' ' + this.uid + ' ' + this.uid + '-' + this.id
    }
    return this.element
  }

  /**
   * Build and return HTML elements for injection
   * @return {HTMLElement}
   */
  toHTML () {
    throw new Error('Abstract method')
  }
}

/**
 * Basic for all UI containers
 */
class WMEUIHelperContainer extends WMEUIHelperElement {
  /**
   * Create and add button
   * For Tab Panel Modal Fieldset
   * @param {String} id
   * @param {String} title
   * @param {String} description
   * @param {Function} callback
   * @return {WMEUIHelperElement} element
   */
  addButton (id, title, description, callback) {
    return this.addElement(
      new WMEUIHelperControlButton(this.uid, id, title, description, callback)
    )
  }

  /**
   * Create buttons
   * @param {Object} buttons
   */
  addButtons (buttons) {
    for (let key in buttons) {
      if (buttons.hasOwnProperty(key)) {
        this.addButton(
          key,
          buttons[key].title,
          buttons[key].description,
          buttons[key].callback,
        )
      }
    }
  }

  /**
   * Create checkbox
   * For Tab, Panel, Modal, or Fieldset
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {Boolean} checked
   * @return {WMEUIHelperElement} element
   */
  addCheckbox (id, title, callback, checked = false) {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'onclick': callback,
        'type': 'checkbox',
        'value': 1,
        'checked': checked,
      })
    )
  }

  /**
   * Create and add WMEUIHelperDiv element
   * @param {String} id
   * @param {String} innerHTML
   * @param {Object} attributes
   * @return {WMEUIHelperElement} element
   */
  addDiv (id, innerHTML = null, attributes = {}) {
    return this.addElement(
      new WMEUIHelperDiv(this.uid, id, innerHTML, attributes)
    )
  }

  /**
   * Create and add WMEUIHelperFieldset element
   * For Tab, Panel, Modal
   * @param {String} id
   * @param {String} title
   * @return {WMEUIHelperElement} element
   */
  addFieldset (id, title) {
    return this.addElement(
      new WMEUIHelperFieldset(this.uid, id, title)
    )
  }

  /**
   * Create text input
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {String} value
   * @return {WMEUIHelperElement} element
   */
  addInput (id, title, callback, value = '') {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'onchange': callback,
        'type': 'text',
        'value': value,
      })
    )
  }

  /**
   * Create number input
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {Number} value
   * @param {Number} min
   * @param {Number} max
   * @param {Number} step
   * @return {WMEUIHelperElement} element
   */
  addNumber (id, title, callback, value = 0, min, max, step = 10) {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'onchange': callback,
        'type': 'number',
        'value': value,
        'min': min,
        'max': max,
        'step': step,
      })
    )
  }

  /**
   * Create radiobutton
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {String} name
   * @param {String} value
   * @param {Boolean} checked
   * @return {WMEUIHelperElement} element
   */
  addRadio (id, title, callback, name, value, checked = false) {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'name': name,
        'onclick': callback,
        'type': 'radio',
        'value': value,
        'checked': checked,
      })
    )
  }

  /**
   * Create range input
   * @param {String} id
   * @param {String} title
   * @param {Function} callback
   * @param {Number} value
   * @param {Number} min
   * @param {Number} max
   * @param {Number} step
   * @return {WMEUIHelperElement} element
   */
  addRange (id, title, callback, value, min, max, step = 10) {
    return this.addElement(
      new WMEUIHelperControlInput(this.uid, id, title, {
        'id': this.uid + '-' + id,
        'onchange': callback,
        'type': 'range',
        'value': value,
        'min': min,
        'max': max,
        'step': step,
      })
    )
  }

  /**
   * Create and add WMEUIHelperText element
   * @param {String} id
   * @param {String} text
   * @return {WMEUIHelperElement} element
   */
  addText (id, text) {
    return this.addElement(new WMEUIHelperText(this.uid, id, text))
  }
}

class WMEUIHelperFieldset extends WMEUIHelperContainer {
  toHTML () {
    // Fieldset legend
    let legend = document.createElement('legend')
    legend.innerHTML = unsafePolicy.createHTML(this.title)

    // Container for buttons
    let controls = document.createElement('div')
    controls.className = 'controls'
    // Append buttons to container
    this.elements.forEach(element => controls.append(element.html()))

    let fieldset = document.createElement('fieldset')
    fieldset = this.applyAttributes(fieldset)
    fieldset.append(legend)
    fieldset.append(controls)
    return fieldset
  }
}

class WMEUIHelperPanel extends WMEUIHelperContainer {
  container () {
    return document.getElementById('edit-panel')
  }

  inject () {
    this.container().append(this.html())
  }

  toHTML () {
    // Label of the panel
    let label = document.createElement('wz-label')
    label.htmlFor = ''
    label.innerHTML = unsafePolicy.createHTML(this.title)
    // Container for buttons
    let controls = document.createElement('div')
    controls.className = 'controls'
    // Append buttons to panel
    this.elements.forEach(element => controls.append(element.html()))
    // Build the panel
    let group = document.createElement('div')
    group.className = 'form-group'
    group.append(label)
    group.append(controls)
    return group
  }
}

class WMEUIHelperTab extends WMEUIHelperContainer {
  constructor (uid, id, title, attributes = {}) {
    super(uid, id, title, attributes)
    this.sidebar = attributes.sidebar
    this.icon = attributes.icon
    this.image = attributes.image
  }

  async inject () {
    this.sidebar
      .registerScriptTab(this.uid)
      .then(({ tabLabel, tabPane }) => {

        tabLabel.innerText = this.title
        tabLabel.title = this.title

        tabPane.append(this.html())
      })
  }

  toHTML () {
    // Label of the panel
    let header = document.createElement('div')
    header.className = 'panel-header-component settings-header'
    header.style.alignItems = 'center'
    header.style.display = 'flex'
    header.style.gap = '9px'
    header.style.justifyContent = 'stretch'
    header.style.padding = '8px'
    header.style.width = '100%'

    if (this.icon) {
      let icon = document.createElement('i')
      icon.className = 'w-icon panel-header-component-icon w-icon-' + this.icon
      icon.style.fontSize = '24px'
      header.append(icon)
    }

    if (this.image) {
      let img = document.createElement('img')
      img.style.height = '42px'
      img.src = this.image
      header.append(img)
    }

    let title = document.createElement('div')
    title.className = 'feature-id-container'
    title.innerHTML = unsafePolicy.createHTML(
      '<div class="feature-id-container"><wz-overline>' + this.title + '</wz-overline></div>'
    )
    header.append(title)

    // Container for buttons
    let controls = document.createElement('div')
    controls.className = 'button-toolbar'

    // Append buttons to container
    this.elements.forEach(element => controls.append(element.html()))

    // Build a form group
    let group = document.createElement('div')
    group.className = 'form-group'
    group.append(header)
    group.append(controls)

    return group
  }
}

class WMEUIHelperModal extends WMEUIHelperContainer {
  container () {
    return document.getElementById('tippy-container')
  }

  inject () {
    this.container().append(this.html())
  }

  toHTML () {
    // Header and close button
    let close = document.createElement('button')
    close.className = 'wme-ui-close-panel'
    close.style.background = '#fff'
    close.style.border = '1px solid #ececec'
    close.style.borderRadius = '100%'
    close.style.cursor = 'pointer'
    close.style.fontSize = '20px'
    close.style.height = '20px'
    close.style.lineHeight = '16px'
    close.style.position = 'absolute'
    close.style.right = '14px'
    close.style.textIndent = '-2px'
    close.style.top = '14px'
    close.style.transition = 'all 150ms'
    close.style.width = '20px'
    close.style.zIndex = '99'
    close.innerText = '×'
    close.onclick = function () {
      panel.remove()
    }

    let title = document.createElement('h5')
    title.style.padding = '16px 16px 0'
    title.innerHTML = unsafePolicy.createHTML(this.title)

    let header = document.createElement('div')
    header.className = 'wme-ui-header'
    header.style.position = 'relative'
    header.prepend(title)
    header.prepend(close)

    // Body
    let body = document.createElement('div')
    body.className = 'wme-ui-body'
    body.style.maxHeight = '70vh'
    body.style.overflow = 'auto'

    // Append buttons to panel
    this.elements.forEach(element => body.append(element.html()))

    // Footer
    let footer = document.createElement('div')
    footer.className = 'wme-ui-footer'
    footer.style.padding = '4px 0'

    // Container
    let container = document.createElement('div')
    container.className = 'wme-ui-panel-container'
    container.append(header)
    container.append(body)
    container.append(footer)

    // Panel
    let panel = document.createElement('div')
    panel.style.width = '320px'
    panel.style.background = '#fff'
    panel.style.margin = '15px'
    panel.style.borderRadius = '5px'
    panel.className = 'wme-ui-panel'
    panel.append(container)

    return panel
  }
}

/**
 * Just div, can be with text
 */
class WMEUIHelperDiv extends WMEUIHelperElement {
  toHTML () {
    let div = document.createElement('div')
    div = this.applyAttributes(div)
    div.id = this.uid + '-' + this.id
    if (this.title) {
      div.innerHTML = unsafePolicy.createHTML(this.title)
    }
    return div
  }
}

/**
 * Just a paragraph with text
 */
class WMEUIHelperText extends WMEUIHelperElement {
  toHTML () {
    let p = document.createElement('p')
    p = this.applyAttributes(p)
    p.innerHTML = unsafePolicy.createHTML(this.title)
    return p
  }
}

/**
 * Base class for controls
 */
class WMEUIHelperControl extends WMEUIHelperElement {
  constructor (uid, id, title, attributes = {}) {
    super(uid, id, title, attributes)
    if (!attributes.name) {
      this.attributes.name = this.id
    }
  }
}

/**
 * Input with label inside the div
 */
class WMEUIHelperControlInput extends WMEUIHelperControl {
  toHTML () {
    let input = document.createElement('input')
    input = this.applyAttributes(input)

    let label = document.createElement('label')
    label.htmlFor = input.id
    label.innerHTML = unsafePolicy.createHTML(this.title)

    let container = document.createElement('div')
    container.className = 'controls-container'
    container.append(input)
    container.append(label)
    return container
  }
}

/**
 * Button with shortcut if needed
 */
class WMEUIHelperControlButton extends WMEUIHelperControl {
  constructor (uid, id, title, description, callback) {
    super(uid, id, title)
    this.description = description
    this.callback = callback
  }

  toHTML () {
    let button = document.createElement('button')
    button.className = 'waze-btn waze-btn-small waze-btn-white'
    button.innerHTML = unsafePolicy.createHTML(this.title)
    button.title = this.description
    button.onclick = this.callback
    return button
  }
}
