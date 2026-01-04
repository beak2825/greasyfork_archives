// ==UserScript==
// @name     Mangadex Common
// @version  0.0.6
// @description Common function library for Mangadex. Should be required by other userscripts.
// ==/UserScript==
/* eslint no-unused-vars: ["off"] */

'use strict'

function dbg(x) {
  // unsafeWindow used soly for debugging in firefox via Web Console.
  if (typeof unsafeWindow === 'object') {
    unsafeWindow.console.log(x)
  }
  else {
    console.log(x)
  }
}
function htmlToElement(html) {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea')
  textArea.style.position = 'fixed'
  textArea.style.top = '50%'
  textArea.style.left = '50%'
  textArea.style.marginTop = '-10px'
  textArea.style.marginLeft = '-10px'
  textArea.style.width = '20px'
  textArea.style.height = '20px'
  textArea.style.opacity = '0'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    console.log(`Fallback: Copying text command was ${msg}`)
  }
  catch (err) {
    console.error('Fallback: Oops, unable to copy' ,err)
  }
  document.body.removeChild(textArea)
}
function copyTextToClipboard(text) {
  // First try to copy using the 2 GM methods..
  if (typeof GM === 'object' && typeof GM.setClipboard === 'function') {
    GM.setClipboard(text)
  }
  else if (typeof GM_setClipboard === 'function') {
    GM_setClipboard(text)
  }
  // Programmer failed to grant setClipboard permissions.
  // Attempt to use browser supported methods.
  else if (navigator && navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      dbg('Async: Copying to clipboard was successful!')
    } ,(err) => {
      dbg('Async: Could not copy text: ' ,err)
    })
  }
  else {
    fallbackCopyTextToClipboard(text)
  }
}
/** ************************************************
 * XPath
 */

function getSnapshotByXpath(path ,node = document) {
  return document.evaluate(path.toString() ,node ,null ,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE ,null)
}
function getOrderedSnapshotByXpath(path ,node = document) {
  return document.evaluate(path.toString() ,node ,null ,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE ,null)
}
function getItterByXpath(path ,node = document) {
  return document.evaluate(path.toString() ,node ,null ,XPathResult.UNORDERED_NODE_ITERATOR_TYPE ,null)
}
function getOrderedItterByXpath(path ,node = document) {
  return document.evaluate(path.toString() ,node ,null ,XPathResult.ORDERED_NODE_ITERATOR_TYPE ,null)
}
function getElementByXpath(path ,node = document) {
  return document.evaluate(path.toString() ,node ,null ,XPathResult.FIRST_ORDERED_NODE_TYPE ,null).singleNodeValue
}

// Gets all values for provided keys via GM_getValue, defaulting to the provided default values.
// keys = {SomeGM_Key: SomeDefaultValue, AnotherGM_Key: AnotherDefaultValue}
// fn: function toRunAfterAllGM_getValues_prommisesHaveFinished({
//   SomeGM_Key: SomeValue,
//   AnotherGM_Key: AnotherValue
// })
function getUserValue(key ,defaultValue) {
  return new Promise((resolve ,reject) => {
    const jsonDefault = JSON.stringify(defaultValue)
    if (typeof GM === 'object' && typeof GM.getValue === 'function') {
      GM.getValue(key ,jsonDefault).then((value) => {
        resolve(JSON.parse(value))
      })
    }
    else if (typeof GM_getValue === 'function') {
      resolve(JSON.parse(GM_getValue(key ,jsonDefault)))
    }
    else {
      reject(new Error("To use 'getUserValue' you must grant either GM.getValue or GM_getValue."))
    }
  })
}
function getUserValues(keys) {
  const prommises = []
  Object.entries(keys).forEach(([key ,defaultValue]) => {
    prommises.push(
      getUserValue(key ,defaultValue).then((v) => {
        const obj = {}; obj[key] = v; return obj
      }) ,
    )
  })
  return Promise.all(prommises).then((itter) => {
    const new_obj = {}
    for (const obj of itter) {
      Object.assign(new_obj ,obj)
    }
    return new_obj
  })
}

function setUserValue(key ,value) {
  return new Promise((resolve ,reject) => {
    if (typeof GM === 'object' && typeof GM.setValue === 'function') {
      GM.setValue(key ,JSON.stringify(value)).then(resolve).catch(reject)
    }
    else if (typeof GM_setValue === 'function') {
      GM_setValue(key ,JSON.stringify(value))
      resolve()
    }
    else {
      reject(Error("To use 'setUserValue' you must grant either GM.setValue or GM_setValue."))
    }
  })
}
function setUserValues(objs) {
  const prommises = []
  Object.entries(objs).forEach(([key ,value]) => {
    prommises.push(setUserValue(key ,value))
  })
  return Promise.all(prommises)
}

function createToolTip({ title ,text }) {
  const tooltip_elm = htmlToElement(`<div>${title}<br><span>${text}</span></div>`)
  const tooltip_text = tooltip_elm.children[1]
  tooltip_elm.style.display = 'none'
  tooltip_elm.style.backgroundColor = 'rgba(15,15,15,0.9)'
  tooltip_elm.style.borderRadius = '15px'
  tooltip_elm.style.color = 'rgb(215,215,215)'
  tooltip_elm.style.left = '0%'
  tooltip_elm.style.position = 'absolute'
  tooltip_elm.style.zIndex = 10
  tooltip_elm.style.textAlign = 'center'
  document.body.appendChild(tooltip_elm)
  return {
    tooltip: tooltip_elm
    ,text_container: tooltip_text
  }
}
