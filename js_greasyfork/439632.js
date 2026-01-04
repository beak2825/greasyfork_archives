// ==UserScript==
// @name            CSS Adaptation Toolkit
// @name:zh         CSS 适配工具包
// @description     CSS SDK for adapting pages to be responsive (responsive web design)
// @description:zh  用于将网页改编为响应式设计的工具函数
// @version         1.43.0
// @match           *://*/*
// @license         The Unlicense
// ==/UserScript==


// <  APIs  >
const CSSA = unsafeWindow.CSSA = {
  inspect: {
    get whichHaveInlineStyles() { return elemsWithInlineStyles() },
    get overflowed() { return elemsOverflowed() }
  },

  mod: {
    dump: cssTextModified,
    insertStyleSheet, apply: insertStyleSheet,
    unsetStyles,
    forceOverrideProps: new Set(['overflow']),
    doc: document
  },

  selectFarthest,
  waitForSelector, wait: waitForSelector,

  debug: {
    breakOnAttrsChange
  },

  miscConfigs: {
    removeSelectorsThose: { tooBroad: true }
  },

  toString() { return this.mod.dump().toString() }
}
// </ APIs  >



unsafeWindow.addEventListener('load', () => {
  CSSA.mod.origWholeCssText = CSSA.mod.dump().modified
})

function insertStyleSheet(styleText) {
  (CSSA.mod.doc || document).head.insertAdjacentHTML('afterbegin', `<style user-custom>${styleText}</style>`)
}

const warnSelectorsThose = { tooBroad: '/*⚠*/' }
const rxSelectorsThose = { tooBroad: /^\/\*⚠\*\/[^.#]+ {[^\n]+\n*/gm }

function elemsWithInlineStyles(doc = document, filterAttr) {
  const elems = []
  if (!doc) return elems
  elems.push(...[...doc.all].filter(el =>
    (!filterAttr || el.hasAttribute(filterAttr)) &&
    !/\b(a|img|span)\b/.test(el.localName) &&
    (el.localName === 'iframe'
      ? elems.push(...elemsWithInlineStyles(el.contentDocument, filterAttr)) && false
      : el.attributes.style?.value
    )
  ))
  return elems
}
function extractStyleToCssForm(elem) {
  let { localName, attributes: { id = '', class: className = '', style } } = elem
  if (specTags.has(localName)) id = className = ''
  else {
    localName = id || className ? '' : `${warnSelectorsThose.tooBroad}${localName}`
    if (className) className = className.value.replace(/ |^/g, '.')
    if (id) {
      id = /[-]|auto|\bid\b/.test(id.value) ? '' : `#${id.value}`
      if (id) className = ''
    }
  }
  return `${localName}${id}${className} { ${style.value
    .replace(/(:) | (!)/g, '$1$2')
    .replace(/;\b/g, '$& ')
    .replace(/;$/, '')} }`
}
const specTags = new Set('html body'.split(' '))
function cssTextModified(rootNode = document, { filterAttr = '', existingCustomStyle = 'user-custom' } = {}) {
  rootNode = rootNode.getRootNode()
  // `rootNode` can be an arbitrarily selected leaf node without having to pay attention to selecting `HTMLDocument`
  let origCust = existingCustomStyle && rootNode instanceof Node && rootNode.querySelector(`style[${existingCustomStyle}]`)?.innerText || ''
    , curr = elemsWithInlineStyles(rootNode, filterAttr).map(extractStyleToCssForm).join('\n')
    , modified = modifiedCss(mergeCommonCss(origCust + curr))
    , merged = (origCust + modified).trim()
  if (!origCust) console.info(
    'Note: If you have style rules located in a `<style>` element to merge,\n' +
    '      mark it like `<style user-custom>`.\n' +
    '      Then it will be `querySelector("style[user-custom]")`.'
  )
  return { modified, merged, pageOrig: CSSA.mod.origWholeCssText, toString() { return this.merged } }
}
function mergeCommonCss(css = '') {
  const re = {
    node: [/^(\s*)([^{}}]+)\s*\{([^}]+?)\s*\}(.*?)\2\{([^}]+?)\s*\}/ms, '$1$2{$3;$5 }$4'],
    nodes: [/([^{\n]+?)(\s*\{[^}]+\})(.*?)\s*([^{\n]+?)\2/s, '$1, $4$2$3']
  }
  let merged
  Object.values(re).forEach(([match, replace]) => {
    const merge = str => str.replace(match, replace)
    merged = merge(css)
    while (css !== merged) merged = merge(css = merged)
  })
  Object.keys(CSSA.miscConfigs.removeSelectorsThose).forEach(k =>
    CSSA.miscConfigs.removeSelectorsThose[k] && (
      merged = merged.replace(rxSelectorsThose[k], '')
    )
  )
  return merged.trim()
}
function modifiedCss(prevCss = '') {
  if (!CSSA.mod.origWholeCssText) return (CSSA.mod.origWholeCssText = prevCss)
  CSSA.mod.origWholeCssText.split('\n').forEach(line => prevCss = prevCss.replace(line.trim(), ''))
  return prevCss
}

function elemsOverflowed(rootElem = document.body, { echo = false } = {}) {
  if (!(rootElem instanceof HTMLElement)) throw TypeError('An entry element is required to be specified.')
  if (echo) console.log(`The width of the rootElem`, rootElem, `is ${rootElem.clientWidth}px.`)
  return [...rootElem.querySelectorAll('*')].filter(el => el.clientWidth > rootElem.clientWidth)
}

function unsetStyles(elem = CSSA.$0, props = [], { echo = false } = {}) {
  if (!(elem instanceof HTMLElement)) throw TypeError('An element is required to be specified.')
  if (typeof props === 'string') props = props.split(/[\s;]+/).filter(Boolean)
  elem.style.cssText += props.map(prop => `${prop}:unset${CSSA.mod.forceOverrideProps.has(prop) ? '!important' : ''}`).join('; ')
  if (echo) console.log('The style value of', elem, `has been set to: {\n  ${elem.attributes.style.value}\n}`)
}
unsetStyles.for = {
  width: elem => unsetStyles(elem, 'min-width width')
}

function selectFarthest(startElem, selectors = '*') {
  if (!selectors) throw TypeError('Please provide a non-empty selectors string.')
  if (startElem.contains(document.body)) throw TypeError('startElem should be a child node of <body>.')
  if (!startElem instanceof HTMLElement) throw TypeError('startElem should be an HTMLElement.')
  let { parentElement } = startElem
  while (parentElement && parentElement.localName !== 'body') {
    if (parentElement.matches(selectors)) startElem = parentElement;
    ({ parentElement } = startElem)
  }
  return startElem
}

function waitForSelector(selectors, { timeout = 30000, optional } = {}) {
  return new Promise((resolve, reject) => {
    const immediateSelect = stage => {
      const elem = document.querySelector(selectors)
      if (elem) return (resolve(elem), stage || 1)
      // console.log(`${waitForSelector.name}: No matches were found in stage '${stage}'.`)
    }
    let iWait
    if (iWait = immediateSelect('ASAP')) return iWait

    const observer = new MutationObserver(muts => {
      for (const mut of muts) {
        for (const node of mut.addedNodes) {
          if (node instanceof Element && node.querySelector(selectors)) {
            observer.disconnect()
            return resolve(node)
          }
        }
      }
    })
    observer.observe(document.body, { attributes: !true, childList: true, subtree: true })

    setTimeout(() => {
      observer.disconnect()
      optional ? resolve(optional) : reject(`Timed out for selectors '${selectors}'`)
    }, timeout)
  })
}

function breakOnAttrsChange(elem, attrsToObsvr) {
  if (!elem instanceof Element) throw TypeError('An element is required to be passed in.')
  if (typeof attrsToObsvr === 'string') attrsToObsvr = attrsToObsvr.split(/[,;\s]+/)
  if (!(Array.isArray(attrsToObsvr) && attrsToObsvr.length)) attrsToObsvr = ['class']
  const observer = new MutationObserver(muts => {
    muts.forEach(mut => console.log(
      mut.target, `: my attr '${mut.attributeName}' changed from` +
    `\n  '${mut.oldValue}' to\n  '${mut.target.getAttribute(mut.attributeName)}'`
    ))
    debugger
  })
  observer.observe(elem, { attributeFilter: attrsToObsvr, attributeOldValue: true })
  return unsafeWindow.__observers.push(observer)
}

if (!Array.isArray(unsafeWindow.__observers)) unsafeWindow.__observers = []
