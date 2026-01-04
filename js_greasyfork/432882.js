// ==UserScript==
// @name         商城自动签到
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  gy
// @author       You
// @include      http://localhost:9527/*
// @include      http://p.gygpm.com/m/*
// @include      https://p.gygpm.com/m/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432882/%E5%95%86%E5%9F%8E%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/432882/%E5%95%86%E5%9F%8E%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==
(function () {
  var jQuery = function (selector) {
    return new jQuery.fn.init(selector)
  }
  jQuery.fn = jQuery.prototype = {
    length: 0,
    selector: '',
    init: function (selector) {
      if (selector) {
        this.selector = selector
        //console.log(selector)
        var dom = []
        if (typeof (selector) == 'string')
          dom = window.document.querySelectorAll(selector)
        else
          dom = selector
        this.length = dom.length
        for (var i = 0; i < dom.length; i++) {
          this[i] = dom[i]
        }
      }
    },
    text: function (string) {
      var i = 0
      if (string !== undefined) {
        for (i = 0; i < this.length; i++) {
          this[i].innerText = string
        }
      } else {
        string = ''
        for (i = 0; i < this.length; i++) {
          string += this[i].innerText
        }
        return string
      }
    },
    val: function (string) {
            console.log(this)
      if (string === undefined) {
        string = ''
        for (let i = 0; i < this.length; i++) {
          string += this[i].value
        }
        return string
      } else {
        for (let i = 0; i < this.length; i++) {
            console.log(typeof this[i])
          //unsafeWindow.document.querySelectorAll(this.selector)[i].value = string
          //this[i].value = string
          //const valueSetter = Object.getOwnPropertyDescriptor(this[i], 'value').set
  const prototype = Object.getPrototypeOf(this[i]);
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
          valueSetter.call(this[i], string);
          this[i].dispatchEvent(new Event('input', { bubbles: true }))
        }
      }
    },
    click: function () {
      this[0].click()
    },
    checkloaded: function (action) {
      var target = this;
      console.log(document.getElementsByTagName('input').length)
      if (document.getElementsByTagName('input').length) {
        console.log($(this.selector).length + ' ' + this.selector + " is loaded");
        setTimeout(function () {
          action.call(target);
        }, 300);
      } else
        setTimeout(function () {
          target.loaded.call(target, action);
        }, 100);
    },
    append: function (html) {
      for (var i = 0; i < this.length; i++) {
        console.log(this[i])
        this[i].innerHTML += html
      }
    },
  }

  jQuery.fn.init.prototype = jQuery.fn
  if (!window.jQuery) window.jQuery = window.$ = jQuery
})()

    jQuery.fn.inserted = function (action, trigger_once = false) {
      var selector = this.selector;
      if ($(selector).length > 0) {
        console.log($(selector).length + ' ' + selector + " is loaded at begin");
        action.call($(selector));
      }
      var finished = false
      var reaction = function (mutationsList, observer) {
        for (let i = 0; i < mutationsList.length; i++) {
          //console.log(mutationsList[i].target)
          for (let j = 0; j < mutationsList[i].addedNodes.length; j++) {
            let element = mutationsList[i].addedNodes[j]
            if (!(trigger_once && finished) && element.querySelectorAll(selector).length) {
              if (element.id)
                console.log('#' + element.id + ' which contains ' + selector + ' is loaded')
              else if (element.className)
                console.log('.' + element.className + ' which contains ' + selector + ' is loaded')
              else
                console.log(element.outerHtml + ' which contains ' + selector + ' is loaded')
              if (trigger_once) {
                observer.disconnect()
                finished = true
              }
              action.call($(element.querySelectorAll(selector)))
            }
          }
        }
      };
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
      if (MutationObserver) {
        var observer = new MutationObserver(reaction)
        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
      } else {
        //setInterval(reaction, 100);
      }
    }

    jQuery.fn.loaded = function (action) {
      this.inserted(action, true);
    }
    jQuery.fn.clickAfterLoaded = function () {
      this.loaded(function () {
        this.click()
      })
    }
    jQuery.fn.setAfterLoaded = function (value) {
      this.loaded(function () {
        this.val(value)
      })
    }

var today = new Date().getDate()
if (location.href.indexOf('https://p.gygpm.com/m/#/reward') < 0) {
  console.log(localStorage.signed_date)

  if (today != localStorage.signed_date) {
    //$('body').append('<iframe src="https://p.gygpm.com/m/#/reward" id="gygpm_sign" style="display:none"></iframe>')
  }
}

if (location.href === 'https://p.gygpm.com/m/#/login') {
  $('#ck01').clickAfterLoaded()
  $('.ipt1').setAfterLoaded('madmin')
  $('.ipt2').setAfterLoaded('123456')
}

if (location.href === 'https://p.gygpm.com/m/#/reward') {
  if ($('.logined-btn').text() == '签到') {
    $('.logined-btn')[0].click()
    localStorage.signed_date = today
    console.log('cnepub is signed')
  }
}

if (location.href.indexOf('http://localhost:9527/merchant/login')) {
  $('input[tabindex="1"]').setAfterLoaded('madmin')
  $('input[tabindex="2"]').setAfterLoaded('123456')
  // $('.el-button--primary').click()
}
