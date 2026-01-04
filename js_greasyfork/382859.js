// ==UserScript==
// @name         missing settings for sourcegraph(MSFS)
// @namespace    https://greasyfork.org
// @version      1.0.0
// @description  add extra settings to sourcegraph
// @author       pot-code
// @match        https://sourcegraph.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382859/missing%20settings%20for%20sourcegraph%28MSFS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382859/missing%20settings%20for%20sourcegraph%28MSFS%29.meta.js
// ==/UserScript==

// TODO:
//  - 切换主题时，需要重新绑定
//  - 切换文件时，重新绑定

;(function() {
  'use strict'
  const PREFIX = 'MSFS'
  const noop = function() {}
  const { logger, LogLevels } = (function() {
    let defaultLevel = 3 // warn level
    let logMethods = ['trace', 'debug', 'info', 'warn', 'error']

    function Logger() {
      const self = this

      function replaceLogMethod(level) {
        logMethods.forEach((methodName, index) => {
          this[methodName] =
            index < level
              ? noop
              : console[methodName === 'debug' ? 'log' : methodName].bind(
                  console,
                  `[${PREFIX}][${methodName.toUpperCase()}]:`
                )
        })
      }

      self.setLevel = level => {
        replaceLogMethod.call(self, level)
      }

      replaceLogMethod.call(self, defaultLevel)
    }
    return {
      logger: new Logger(),
      LogLevels: logMethods.reduce((acc, cur, index) => {
        acc[cur] = index
        return acc
      }, {})
    }
  })()
  function offsetToBody(element) {
    let offsetTop = 0,
      offsetLeft = 0

    while (element !== document.body) {
      offsetLeft += element.offsetLeft
      offsetTop += element.offsetTop
      element = element.offsetParent
    }

    return {
      offsetLeft,
      offsetTop
    }
  }

  /**
   * hepler function to iterate map object
   * @param {Map|Object} mapLikeObject
   * @param {(key, value)=>any} fn function to call on map entry
   */
  function mapIterator(mapLikeObject, fn) {
    if (Object.prototype.toString.call(mapLikeObject) === '[object Map]') {
      mapLikeObject.forEach((value, key) => fn(key, value))
    } else {
      Object.keys(mapLikeObject).forEach(key => fn(key, mapLikeObject[key]))
    }
  }

  function mapAddEntry(mapLikeObject, key, value) {
    if (Object.prototype.toString.call(mapLikeObject) === '[object Map]') {
      mapLikeObject.set(key, value)
    } else {
      mapLikeObject[key] = value
    }
  }

  function createFontController({ codeArea, dropdown }) {
    const DEFAULT_SIZE = '12'
    const fontSizeController = document.createElement('div'),
      label = document.createElement('span'),
      input = document.createElement('input'),
      indicator = document.createElement('span')

    label.innerText = 'font-size'

    input.type = 'range'
    input.min = DEFAULT_SIZE
    input.max = '17'
    input.step = '1'
    input.value = DEFAULT_SIZE
    input.style.margin = '0 0.5rem'

    indicator.style.display = 'inline-block'
    // prevent layout from changing while the character is not monospaced
    indicator.style.width = '17px'
    indicator.innerText = DEFAULT_SIZE

    fontSizeController.appendChild(label)
    fontSizeController.appendChild(input)
    fontSizeController.appendChild(indicator)

    function sizeChangeHandlerFactory(_codeArea) {
      return function() {
        const newSize = input.value

        indicator.innerText = newSize
        _codeArea.style.fontSize = `${newSize}px`
        // logger.debug(`new font size is ${newSize}`);
      }
    }

    let sizeChangeHandler = sizeChangeHandlerFactory(codeArea)

    input.addEventListener('input', sizeChangeHandler)
    dropdown.dom.appendChild(fontSizeController)
    return {
      root: fontSizeController,
      reload: function({ codeArea }) {
        input.removeEventListener('input', sizeChangeHandler)

        sizeChangeHandler = sizeChangeHandlerFactory(codeArea)
        input.addEventListener('input', sizeChangeHandler)
        sizeChangeHandler()
      }
    }
  }

  function initNavItem(navRoot) {
    function create_nav_button(actionName) {
      return `
<div class="popover-button popover-button__btn popover-button__anchor" style="margin: .425rem .175rem;padding: 0 .425rem;color: #566e9f;">
  <span class="popover-button__container">
    ${actionName}
    <svg class="mdi-icon icon-inline popover-button__icon" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M7,10L12,15L17,10H7Z"></path>
    </svg>
  </span>
</div>`
    }

    const navItem = document.createElement('li')

    navItem.classList.add('nav-item')
    navItem.innerHTML = create_nav_button('settings')
    navRoot.appendChild(navItem)

    return {
      dom: navItem
    }
  }

  function initDropdownMenu(navItem) {
    let openState = false // dropdown state

    const container = document.createElement('div')
    const { offsetTop } = offsetToBody(navItem.dom)

    // create container
    container.className = `popover popover-button2__popover rounded ${PREFIX}-settings`
    container.style.transform = `translateY(${offsetTop + navItem.dom.offsetHeight}px)`

    const toggle = event => {
      if (event) {
        event.stopPropagation()
      }
      container.style.display = ((openState = !openState), openState) ? 'block' : 'none'
    }

    // document.body click fix
    document.body.addEventListener('click', event => {
      if (event.target === container) {
        toggle()
      } else {
        if (openState === true) {
          toggle()
        }
      }
    })
    navItem.dom.addEventListener('click', toggle)
    container.addEventListener('click', event => {
      event.stopPropagation()
    })

    logger.debug('dropdown container initialized')
    // insert DOM
    document.body.appendChild(container)
    return {
      dom: container,
      toggle
    }
  }

  function getNavRoot() {
    return document.querySelector(
      '#root > div.layout > div.layout__app-router-container.layout__app-router-container--full-width > div > nav > ul:nth-child(7)'
    )
  }

  function getCodeArea() {
    return document.querySelector('div.blob.blob-page__blob')
  }

  function patch_style(definition) {
    const style = document.createElement('style')

    style.innerHTML = definition
    document.head.appendChild(style)
    logger.debug('======================patched styles======================')
    logger.debug(definition)
    logger.debug('==========================================================')
  }

  const plugin = (function createPlugin() {
    function Plugin() {
      const self = this
      const defaultStyles = `
  .${PREFIX}-settings{
    padding: 0.3em 0.5em;
    position: absolute;
    display: none;
    top: 0;
    right: 10px;
  }
  .${PREFIX}-settings__item{
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
  .${PREFIX}-settings__item:last-child{
    margin-bottom: 0;
  }
  div.blob.blob-page__blob{
    font-size: 12px;
  }
  code.blob__code.e2e-blob{
    font-size: inherit;
    line-height: 1.33;
  }
      `

      const definitions = new Map()
      const components = new Map()
      const reloadListeners = []
      const styles = [defaultStyles]

      let stylePatched = false
      let initialized = false
      let navRoot = getNavRoot()
      let codeArea = getCodeArea()
      let navItem = null
      let dropdown = null

      function reloadComponent(newDep, name, component) {
        component.reload && component.reload(newDep)
        logger.debug(`component ${name} is reloaded`)
      }

      function initComponent(dep, name, definition, context) {
        let component = definition(dep, context)

        styles.push(component.style)
        components.set(name, component)
        component.root && component.root.classList.add(`${PREFIX}-settings__item`)
        logger.debug(`component ${name} is initialized`)
      }

      function ensureCriticalElement(reload = false) {
        const MAX_RETRY_COUNT = 10
        const RETRY_DELAY = 1000

        let tried = 0
        let lastNavRoot = navRoot
        let lastCodeArea = codeArea

        return new Promise((res, rej) => {
          function queryElement() {
            ;[navRoot, codeArea] = [reload ? navRoot : getNavRoot(), getCodeArea()]

            if (navRoot && codeArea) {
              if (reload && lastCodeArea === codeArea) {
                if (++tried > MAX_RETRY_COUNT) {
                  logger.warn('max retry count reached, plugin failed to reload or reload is not needed')
                  return
                }
                // supress log
                // logger.debug('failed to detect critical element changes, retrying...')
                setTimeout(queryElement, RETRY_DELAY, reload)
                return
              }
              tried = 0
              ;[lastNavRoot, lastCodeArea] = [navRoot, codeArea]
              res({ navRoot, codeArea })
              logger.debug('critical path created, initializing plugin...')
            } else {
              logger.debug('failed to detect critical element, retrying...')
              if (++tried > MAX_RETRY_COUNT) {
                rej('max retry count reached, plugin failed to initialize')
                return
              }
              setTimeout(queryElement, RETRY_DELAY)
            }
          }
          queryElement()
        })
      }

      /**
       * @param name {string} component name
       * @param definition {(dep, plugin:Plugin)=>{uninstall?:Function, reload?:Function, style?: string, root?:HTMLElement}} component object
       */
      this.registerComponent = (name, definition) => {
        if (name in definition || name in components) {
          logger.warn(`component ${name} is already registered, registration cancelled`)
          return
        }
        mapAddEntry(definitions, name, definition)
      }

      this.reload = () => {
        ensureCriticalElement(true)
          .then(({ codeArea }) => {
            return { navItem, codeArea, dropdown }
          })
          .then(newDep => {
            mapIterator(components, function(name, component) {
              reloadComponent(newDep, name, component)
            })
            logger.debug('plugin reloaded')
          })
          .catch(err => {
            logger.error(err)
          })
      }

      const initComponents = dep => {
        mapIterator(definitions, function(name, definition) {
          initComponent(dep, name, definition, self)
        })
      }

      this.init = () => {
        return ensureCriticalElement()
          .then(({ navRoot, codeArea }) => {
            navItem = initNavItem(navRoot)
            dropdown = initDropdownMenu(navItem)

            return { navItem, codeArea, dropdown }
          })
          .then(dep => {
            initComponents(dep)
            patch_style(styles.join('\n'))

            stylePatched = true
            initialized = true
          })
      }

      /**
       * @param target {HTMLElement} event source element which may change the dependencies
       * @param event {string} event name
       * @param shouldReload {(event:Event)=>boolean} should trigger the reload
       * @param capture should event be capture type
       */
      this.addReloadListener = (target, event, shouldReload, capture = false) => {
        shouldReload = shouldReload.bind(target)

        let handler = _event => {
          if (shouldReload(_event)) {
            this.reload()
            logger.debug(`plugin will reload due to the ${event} event on ${target}`)
          }
        }

        target.addEventListener(event, handler, capture)
        reloadListeners.push({
          target,
          event,
          handler,
          capture,
          dispose: function() {
            target.removeEventListener(event, handler, capture)
          }
        })
      }
    }

    return new Plugin()
  })()

  // logger.setLevel(LogLevels.debug)
  plugin.registerComponent('font-controller', createFontController)

  //===============================Danger Zone===============================
  plugin
    .init()
    .then(() => {
      plugin.addReloadListener(
        document.querySelector('#explorer>div.tree>table>tbody>tr>td>div>table'),
        'click',
        function(event) {
          let target = event.target

          return target.tagName === 'A' && target.className === 'tree__row-contents'
        }
      )
    })
    .catch(err => {
      logger.error(err)
    })
  //=========================================================================
})()
