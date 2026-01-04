// ==UserScript==
// @name                Auto-Copy-Github-Repository-Name
// @name:zh-CN          自动复制Github仓库名
// @namespace           http://tampermonkey.net/
// @version             0.0.3
// @description         add an btn that can copy github repository name when deleteing a repository
// @description:zh-CN   删除github仓库时，自动生成一个按钮复制仓库名
// @author              kkopite
// @match               https://github.com/*
// @require             https://code.jquery.com/jquery-3.6.0.slim.min.js
// @icon                https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/444882/Auto-Copy-Github-Repository-Name.user.js
// @updateURL https://update.greasyfork.org/scripts/444882/Auto-Copy-Github-Repository-Name.meta.js
// ==/UserScript==

(function () {
  'use strict'

  waitForKeyElements('h2#danger-zone', addBtn)
  function addBtn() {
    const form = document.querySelector('[aria-label="Delete repository"] form')
    const parent = form.parentElement
    if (parent.querySelector('#copy-repository-name')) return
    const btn = document.createElement('button')
    btn.id = 'copy-repository-name'
    parent.insertBefore(btn, form)
    btn.innerText = 'Copy'
    btn.classList.add('btn', 'btn-danger', 'm-1')
    btn.addEventListener('click', copy)
  }
  function copy() {
    const pathname = window.location.pathname
    const index = pathname.lastIndexOf('/settings')
    const name = pathname.slice(1, index)
    navigator.clipboard.writeText(name)
  }

  // https://gist.github.com/BrockA/2625891
  function waitForKeyElements(
    selectorTxt,    /* Required: The jQuery selector string that
                      specifies the desired element(s).
                  */
    actionFunction, /* Required: The code to run when elements are
                      found. It is passed a jNode to the matched
                      element.
                  */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                      new elements even after the first match is
                      found.
                  */
    iframeSelector  /* Optional: If set, identifies the iframe to
                      search.
                  */
  ) {
    var targetNodes, btargetsFound

    if (typeof iframeSelector == "undefined")
      targetNodes = $(selectorTxt)
    else
      targetNodes = $(iframeSelector).contents()
        .find(selectorTxt)

    if (targetNodes && targetNodes.length > 0) {
      btargetsFound = true
      /*--- Found target node(s).  Go through each and act if they
          are new.
      */
      targetNodes.each(function () {
        var jThis = $(this)
        var alreadyFound = jThis.data('alreadyFound') || false

        if (!alreadyFound) {
          //--- Call the payload function.
          var cancelFound = actionFunction(jThis)
          if (cancelFound)
            btargetsFound = false
          else
            jThis.data('alreadyFound', true)
        }
      })
    }
    else {
      btargetsFound = false
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {}
    var controlKey = selectorTxt.replace(/[^\w]/g, "_")
    var timeControl = controlObj[controlKey]

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval(timeControl)
      delete controlObj[controlKey]
    }
    else {
      //--- Set a timer, if needed.
      if (!timeControl) {
        timeControl = setInterval(function () {
          waitForKeyElements(selectorTxt,
            actionFunction,
            bWaitOnce,
            iframeSelector
          )
        },
          300
        )
        controlObj[controlKey] = timeControl
      }
    }
    waitForKeyElements.controlObj = controlObj
  }
})()
