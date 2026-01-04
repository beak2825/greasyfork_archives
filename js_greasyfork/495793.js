// ==UserScript==
// @name            fill the input and select of form as last time inputed automatically
// @name:zh-CN      点击复制
// @namespace       https://greasyfork.org/users/3586-yechenyin
// @description     This script supports SPA like vue。
// @description:zh-CN  对所有网站生效，支持SPA(比如vue)动态插入的input和select。比如可以自动填写用户名和密码，自动点击同意协议。浏览器需要安装Tampermonkey或者Greasemonkey扩展，安卓手机浏览器推荐Yandex或者Kiwi浏览器。
// @require         https://greasyfork.org/scripts/440334-jquery-like-spa-operation-library/code/jQuery-like%20SPA%20operation%20library.js?version= 1020513
// @include         https://*axshare.com/*
// @include         http://showdoc.*
// @include         http://10.216.115.73*
// @include         https://js.design/*
// @include         https://lanhuapp.com/web/*
// @include         https://www.uviewui.com/*
// @include         C:/*
// @include         */tool/swagger
// @include         */api/swagger-ui/*
// @include         https://www.apifox.cn/*
// @include         https://echarts.apache.org/zh/option.html*
// @exclude        https://www.apifox.cn/apidoc/auth*
// @grant          GM_setClipboard
// @grant           GM_setValue
// @grant           GM_getValue
// @author          yechenyin
// @license         MIT
// @version         1.0.4
// @downloadURL https://update.greasyfork.org/scripts/495793/fill%20the%20input%20and%20select%20of%20form%20as%20last%20time%20inputed%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/495793/fill%20the%20input%20and%20select%20of%20form%20as%20last%20time%20inputed%20automatically.meta.js
// ==/UserScript==

//console.debug = ()=>{}
console.info('点击复制');

(function () {
  var jQuery = function (selector) {
    return new jQuery.fn.init(selector)
  }
  jQuery.fn = jQuery.prototype = {
    length: 0,
    selector: '',
    init: function (elementOrSelector) {
      var nodes = []
      if (typeof elementOrSelector == 'string') {
        this.selector = elementOrSelector
        nodes = document.querySelectorAll(this.selector)
      } else if (elementOrSelector instanceof NodeList) {
        nodes = elementOrSelector
      } else if (elementOrSelector instanceof Element) {
        nodes = [elementOrSelector]
      }
      this.length = nodes.length
      for (var i = 0; i < nodes.length; i++) {
        this[i] = nodes[i]
      }
    },
    each: function (callback) {
      for (var i = 0; i < this.length; i++) {
        callback.call(this[i])
      }
    },
    on: function (event, callback) {
      this.each(function () {
        this.addEventListener(event, callback)
      })
    },
    text: function (string) {
      var i = 0
      if (string !== undefined) {
        for (i = 0; i < this.length; i++) {
          this[i].innerText = string
        }
      } else {
        return this[0].innerText
      }
    },
    val: function (value) {
      if (value === undefined) {
        var ret
        if (this[0].type == 'checkbox') ret = this[0].checked
        else if (
          this[0].type == 'radio' ||
          this[0].type == 'text' ||
          this[0].type == 'password' ||
          this[0].tagName == 'select'
        )
          ret = this[0].value
        return ret
      } else {
        for (var i = 0; i < this.length; i++) {
          if (this[i].type == 'checkbox' && Boolean(value)) this[i].click()
          else if (this[i].type == 'radio')
            this[i].checked = this[i].value == value
          else if (this[i].type == 'text') this[i].value = value
          else if (this[i].type == 'password') this[i].value = value
          else if (this[i].tagName == 'select') this[i].value = value
          this[i].dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    },
    attr: function (attribute, value) {
      if (value === undefined) {
        return this[0].getAttribute(attribute)
      } else {
        this.each(function () {
          this.setAttribute(attribute, value)
        })
      }
    },
    click: function () {
      this[0].click()
    },
    find: function (selector) {
      var j = 0
      var result = []
      for (var i = 0; i < this.length; i++) {
        if (this[i].querySelectorAll(selector).length) {
        }
      }
    },
    append: function (html) {
      for (var i = 0; i < this.length; i++) {
        this[i].innerHTML += html
      }
    },
  }

  jQuery.fn.init.prototype = jQuery.fn
  if (!window.jQuery) window.jQuery = window.$ = jQuery
})()

//每当符合选择器规则的元素插入到页面中时，唤起callback方法。如果trigger_once为true，只唤起一次
jQuery.fn.inserted = function (callback, trigger_once = false) {
  var selector = this.selector
  if ($(selector).length > 0) {
    //console.debug($(selector).length + ' ' + selector + " is loaded at begin");
    callback.call($(selector))
  }
  var finished = false
  var recall = function (mutationsList, observer) {
    for (var i = 0; i < mutationsList.length; i++) {
      //console.debug(mutationsList[i].target)
      if (mutationsList[i].addedNodes) {
        for (var j = 0; j < mutationsList[i].addedNodes.length; j++) {
          var element = mutationsList[i].addedNodes[j]
          if (
            !(trigger_once && finished) &&
            element instanceof Element &&
            element.querySelectorAll(selector).length
          ) {
            var container = ''
            if (element.id) container = '#' + element.id
            else if (element.className) container = '.' + element.className
            else container = element.outerHtml
            //console.debug(container + ' which contains ' + selector + ' is loaded')
            if (trigger_once) {
              observer.disconnect()
              finished = true
            }
            callback.call($(element.querySelectorAll(selector)))
          }
        }
      }
    }
  }
  var MutationObserver =
    window.MutationObserver ||
    window.WebKitMutationObserver ||
    window.MozMutationObserver
  if (MutationObserver) {
    var observer = new MutationObserver(recall)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
}

if (location.href.indexOf('https://lanhuapp.com/web/#/item/project/') == 0) {
  $('.item_content').inserted(function () {
    var text = this[0].innerText
    console.debug('item_content ' + text)
    copyTextToClipboard(text)
    this[0].addEventListener(
      'DOMCharacterDataModified',
      function (event) {
        var text = event.newValue
        console.debug('DOMCharacterDataModified ' + text)
        copyTextToClipboard(text)
      },
      false
    )
  })
} else {
  $('.opblock').inserted(function () {
      this[0].addEventListener(
          'click',
          (event) => {
              console.debug('mouseup')
              var text = ''
              if (window.getSelection().toString()) {
                  text = window.getSelection().toString()
                  console.debug('window selection ' + text)
              } else if (document.selection) {
                  text = document.selection.createRange().text
                  console.debug('document selection ' + text)
              } else {
                  text = event.target.innerText
                  console.debug('click ' + text)
              }
              copyTextToClipboard(text)
          },
          true
      )
  })

      window.addEventListener(
          'mouseup',
          (event) => {
              console.debug('mouseup')
              var text = ''
              if (window.getSelection().toString()) {
                  text = window.getSelection().toString()
                  console.debug('window selection ' + text)
              } else if (document.selection) {
                  text = document.selection.createRange().text
                  console.debug('document selection ' + text)
              } else {
                  text = event.target.innerText
                  console.debug('click ' + text)
              }
              copyTextToClipboard(text)
          },
          true
      )
}

function copyTextToClipboard(text) {
  if (!text) return
  text = text.trim().replaceAll('"', '')
  text = text.replaceAll('​', '')
  text = text.replaceAll('/dev-api/api', '')
  text = text.replaceAll('/dev-api/api', '')
  if (GM_setClipboard) {
      GM_setClipboard(text)
      return
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      function () {
        console.debug('Copy was successful!', text)
      },
      function (err) {
        console.error('Async: Could not copy text: ', err)
      }
    )
  } else {
    if (window.clipboardData && window.clipboardData.setData) {
      // Internet Explorer-specific code path to prevent textarea being shown while diaconsole.debug is visible.
      return window.clipboardData.setData('Text', text)
    } else {
      var textArea = document.createElement('textarea')
      textArea.value = text

      // Avoid scrolling to bottom
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.position = 'fixed'

      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        var successful = document.execCommand('copy')
        var msg = successful ? 'successful' : 'unsuccessful'
        console.debug('Fallback: Copying text command was ' + msg)
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err)
      } finally {
        document.body.removeChild(textArea)
      }
      return
    }
  }
}

function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // Internet Explorer-specific code path to prevent textarea being shown while diaconsole.debug is visible.
    return window.clipboardData.setData('Text', text)
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    var textarea = document.createElement('textarea')
    textarea.textContent = text
    textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in Microsoft Edge.
    document.body.appendChild(textarea)
    textarea.select()
    try {
      return document.execCommand('copy') // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn('Copy to clipboard failed.', ex)
      return prompt('Copy to clipboard: Ctrl+C, Enter', text)
    } finally {
      document.body.removeChild(textarea)
    }
  }
}
