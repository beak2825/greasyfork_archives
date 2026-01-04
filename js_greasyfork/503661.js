// ==UserScript==
// @name         Coco Annotator Extra Features
// @author       Hoang
// @namespace    @hoang/cocoanno-extra-features
// @version      1.0.1
// @icon         https://i.imgur.com/hHETHAK.jpeg
// @description  Tool lỏ
// @include      *
// @license      No license
// @run-at       document-end
// @grant        GM.notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require      https://unpkg.com/tinykeys@2.1.0/dist/tinykeys.umd.js
// @downloadURL https://update.greasyfork.org/scripts/503661/Coco%20Annotator%20Extra%20Features.user.js
// @updateURL https://update.greasyfork.org/scripts/503661/Coco%20Annotator%20Extra%20Features.meta.js
// ==/UserScript==


const buttonSelectTool = memoize(() => $('aside.left-panel i.fa.fa-x.fa-hand-pointer-o'))
const buttonBBoxTool = memoize(() => $('aside.left-panel i.fa.fa-x.fa-object-group'))
const buttonSave = memoize(() => $('aside.left-panel i.fa.fa-x.fa-save'))
const buttonNewAnnotation = memoize(() => $('.sidebar-section i.fa.fa-plus'))

function memoize(fn) {
  let result = undefined
  let called = false
  let previousArgs = []
  return (...args) => {
    const isChanged = compareArgs(previousArgs, args)
    if (isChanged || !called) {
      previousArgs = args
      result = fn(...args)
      called = true
    }
    return result
  }
}

function compareArgs(prevArgs, args) {
  const targetArgs = prevArgs.length > args.length ? prevArgs : args
  for (let i = 0; i < targetArgs.length; i++) {
    if (prevArgs[i] !== args[i]) {
      return true
    }
  }
  return false
}

function isAnnotateWorkspaceUrl(href) {
  const url = new URL(href)
  return url.host == '124.158.6.188:5000' && url.hash.startsWith('#/annotate/')
}

function countObjects() {
  return $('.sidebar-section ul.list-group').children('div').length
}

function disableDefaultKeys(e) {
  const keys = [
    116, // F5
    32, // Space
  ]
  if (keys.includes(e.which) || keys.includes(e.keyCode)) {
    e.preventDefault()
  }
}

function foldOtherKeypointList(keypointListElement) {

}

async function main() {
  if (!isAnnotateWorkspaceUrl(window.location.href)) {
    return undefined
  }

  let prevObjCount = countObjects()

  // $(document).bind("keydown", disableDefaultKeys);
  // $(document).on("keydown", disableDefaultKeys);

  tinykeys.tinykeys(window, {
    'S': () => {
      buttonSelectTool().click()
    },
    'Space': (event) => {
      event.preventDefault()
      const objectCount = countObjects()
      if (objectCount == 0 || objectCount == prevObjCount) {
        buttonNewAnnotation().click()
        buttonBBoxTool().click()
      }
      prevObjCount = objectCount
    },
    'F5': (event) => {
      event.preventDefault()
      const confirmReload = confirm('Tải lại trang? Nếu chưa lưu dữ liệu sẽ mất hết.')
      if (confirmReload) {
        window.location.reload()
      }
    }
  })
  console.log($)

  // setInterval(() => buttonSave().click(), 1000 * 20)
}

main()