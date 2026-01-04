// ==UserScript==
// @name             jQuery-like SPA operation library
// @description  SPA like vue is supported。offers functions like click element after loaded， call function after url change。
// @author          yechenyin
// @license          MIT
// @version         1.0.3
// ==/UserScript==


//闭包里的方法的用法和jquery同命名方法一致
(function () {
  var jQuery = function (selector) {
    return new jQuery.fn.init(selector)
  }
  jQuery.fn = jQuery.prototype = {
    length: 0,
    selector: '',
    init: function (elementOrSelector) {
      var nodes = []
      if (typeof (elementOrSelector) == 'string') {
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
        if (this[0].type == 'checkbox')
          ret = this[0].checked
        else if (this[0].type == 'radio' || this[0].type == 'text' || this[0].type == 'password' || this[0].tagName == 'select')
          ret = this[0].value
        return ret
      } else {
        for (var i = 0; i < this.length; i++) {
          if (this[i].type == 'checkbox' && Boolean(value))
            this[i].click()
          else if (this[i].type == 'radio')
            this[i].checked = this[i].value == value
          else if (this[i].type == 'text')
            this[i].value = value
          else if (this[i].type == 'password')
            this[i].value = value
          else if (this[i].tagName == 'select')
            this[i].value = value
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
  var selector = this.selector;
  if ($(selector).length > 0) {
    //console.log($(selector).length + ' ' + selector + " is loaded at begin");
    callback.call($(selector));
  }
  var finished = false
  var recallback = function (mutationsList, observer) {
    for (var i = 0; i < mutationsList.length; i++) {
      //console.log(mutationsList[i].target)
      if (mutationsList[i].addedNodes) {
        for (var j = 0; j < mutationsList[i].addedNodes.length; j++) {
          var element = mutationsList[i].addedNodes[j]
          if (!(trigger_once && finished) && element instanceof Element && element.querySelectorAll(selector).length) {
            var container = ''
            if (element.id)
              container = '#' + element.id
            else if (element.className)
              container = '.' + element.className
            else
              container = element.outerHtml
            //console.log(container + ' which contains ' + selector + ' is loaded')
            if (trigger_once) {
              observer.disconnect()
              finished = true
            }
            callback.call($(element.querySelectorAll(selector)))
          }
        }
      }
    }
  };
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
  if (MutationObserver) {
    var observer = new MutationObserver(recallback)
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }
}

//当符合选择器规则的元素插入到页面中时，调用一次callback方法，之后不会在唤起
jQuery.fn.loaded = function (callback) {
  if (callback)
    this.inserted(callback, true);
}

//在元素加载完成后经过delay（单位毫秒）延迟后点击元素
jQuery.fn.clickAfterLoaded = function (delay = 0) {
  this.loaded(function () {
    setTimeout(function () {
      this[0].click()
    }.bind(this), delay)
  })
}
//在元素加载完成后经过delay（单位毫秒）延迟后设置输入值
jQuery.fn.setAfterLoaded = function (value, delay = 0) {
  this.loaded(function () {
    setTimeout(function () {
      this.val(value)
    }.bind(this), delay)
  })
}

//替代得到http成功回应后的回调
$.replaceResponseCallback = function (callback, continueOriginalCallback = false) {
  var open = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener(
      'readystatechange',
      function () {
        if (
          this.readyState == 4 &&
          this.response
        ) {
          callback.call(this)
        }
      },
      false
    )
    if (continueOriginalCallback)
      open.apply(this, arguments)
    XMLHttpRequest.prototype.open = open
  }
}
//url改变后唤起callback，支持监测SPA的#后面的字符串变化
$.onurlchange = function (callback) {
  history.pushState = ((f) =>
    function pushState() {
      var ret = f.apply(this, arguments)
      window.dispatchEvent(new Event('pushstate'))
      window.dispatchEvent(new Event('urlchange'))
      return ret
    })(history.pushState)

  history.replaceState = ((f) =>
    function replaceState() {
      var ret = f.apply(this, arguments)
      window.dispatchEvent(new Event('replacestate'))
      window.dispatchEvent(new Event('urlchange'))
      return ret
    })(history.replaceState)

  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('urlchange'))
  })
  window.addEventListener('urlchange', function () {
    callback()
  })
}
