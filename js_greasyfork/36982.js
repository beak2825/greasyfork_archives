// ==UserScript==
// @name SwaggerUI Search Supportting
// @namespace Violentmonkey Scripts
// @match *://*/*/swagger-ui.html*
// @match *://*/swagger-ui.html*
// @grant none
// @version 0.0.1.20180204232226
// @description swagger-ui-v1 添加查找接口交互
// @downloadURL https://update.greasyfork.org/scripts/36982/SwaggerUI%20Search%20Supportting.user.js
// @updateURL https://update.greasyfork.org/scripts/36982/SwaggerUI%20Search%20Supportting.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
  /**
   * @file: EventEmitter
   * @author: Cuttle Cong
   * @date: 2017/11/1
   * @description:
   */
  function assertType(type) {
    if (typeof type !== 'string') {
      throw new TypeError('type is not type of String!')
    }
  }

  function assertFn(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('fn is not type of Function!')
    }
  }

  function EventEmitter() {
    this._events = {}
  }

  function on(type, fn) {
    assertType(type)
    assertFn(fn)
    this._events[type] = this._events[type] || []
    this._events[type].push({
      type: 'always',
      fn: fn
    })
  }

  function prepend(type, fn) {
    assertType(type)
    assertFn(fn)
    this._events[type] = this._events[type] || []
    this._events[type].unshift({
      type: 'always',
      fn: fn
    })
  }

  function prependOnce(type, fn) {
    assertType(type)
    assertFn(fn)
    this._events[type] = this._events[type] || []
    this._events[type].unshift({
      type: 'once',
      fn: fn
    })
  }

  function once(type, fn) {
    assertType(type)
    assertFn(fn)
    this._events[type] = this._events[type] || []
    this._events[type].push({
      type: 'once',
      fn: fn
    })
  }

  function off(type, nullOrFn) {
    assertType(type)
    if (!this._events[type]) return
    if (typeof nullOrFn === 'function') {
      var index = this._events[type].findIndex(function (event) {
        return event.fn === nullOrFn
      })
      if (index >= 0) {
        this._events[type].splice(index, 1)
      }
    } else {
      delete this._events[type]
    }
  }

  function emit(type /*, arguments */) {
    assertType(type)
    var args = [].slice.call(arguments, 1)
    var self = this
    if (this._events[type]) {
      this._events[type].forEach(function (event) {
        event.fn.apply(null, args)
        if (event.type === 'once') {
          self.off(type, event.fn)
        }
      })
    }
  }

  EventEmitter.prototype.on = EventEmitter.prototype.addListener = on
  EventEmitter.prototype.once = EventEmitter.prototype.addOnceListener = once
  EventEmitter.prototype.prepend = EventEmitter.prototype.prependListener = prepend
  EventEmitter.prototype.prependOnce = EventEmitter.prototype.prependOnceListener = prependOnce
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener = off
  EventEmitter.prototype.emit = EventEmitter.prototype.trigger = emit

  if (typeof module !== 'undefined') {
    module.exports = EventEmitter
  }


  function KeyExtra(opt) {
    this._init(opt)
  }

  KeyExtra.prototype = new EventEmitter()
  KeyExtra.prototype.constructor = KeyExtra

  KeyExtra.prototype._init = function (opt) {
    var keyExtra = this

    // double key press
    var doublePressTimeoutMs = 600
    var lastKeypressTime = 0
    var lastKeyChar = null

    function doubleHandle(type) {
      return function (evt) {
        var thisCharCode = evt.key.toUpperCase()
        if (lastKeyChar === null) {
          lastKeyChar = thisCharCode
          lastKeypressTime = new Date()
          return
        }
        if (thisCharCode === lastKeyChar) {
          var thisKeypressTime = new Date()
          if (thisKeypressTime - lastKeypressTime <= doublePressTimeoutMs) {
            keyExtra.emit('double-' + type, thisCharCode)
          }
        }
        lastKeyChar = null
        lastKeypressTime = 0
      }
    }

    document && document.addEventListener('keypress', doubleHandle('keypress'))
    document && document.addEventListener('keydown', doubleHandle('keydown'))
  }


  setTimeout(
    function () {
      (
        function ($) {
          var swaggerVersion = 1
          if (typeof SwaggerUIBundle === 'function') {
            // swagger-ui v2-v3
            swaggerVersion = 2
            var script = document.createElement('script')
            script.src = '//cdn.bootcss.com/jquery/1.8.0/jquery-1.8.0.min.js'
            script.onload = function (ev) {
              registerSearchUI()
            }
            document.head.appendChild(script)
            return
          }

          if (typeof window.swaggerUi === 'undefined') {
            console.error('window.swaggerUi is not defined, so we consider that the page isn\'t swagger-ui.')
            return
          }
          if (typeof $ === 'undefined') {
            console.error('jQuery is not found, so we consider that the page isn\'t swagger-ui.')
            return
          }
          registerSearchUI()


          function registerSearchUI() {
            var $ = window.jQuery
            var dom = $('<div style="margin-top: 15px;"></div>')
            dom.attr('class', 'inject-dom-container')

            var btns = $('<div></div>')
            btns.attr('class', 'inject-btn-container')

            function listAll() {
              $('.collapseResource').click()
            }

            function hideAll() {
              $('.endpoints').css({ display: 'none' })
            }

            function expendAll() {
              $('.expandResource').click()
            }

            swaggerVersion === 1 && btns.append(
              $('<button>List All</button>').on('click', listAll),
              $('<button>Hide All</button>').on('click', hideAll),
              $('<button>Expend All</button>').on('click', expendAll),
            )

            swaggerVersion === 1 && dom.append(btns)
            dom.append([
              '<div style="text-align: center;">',
              '<h3 style="margin-bottom: 5px;">SwaggerUI Search Supportting</h3>',
              '<small style="margin-bottom: 10px">Double press "shift" or "A" could awake the search UI.</small>',
              '</div>',
              '<div class="search-container" style="display: none;">',
              '<div class="search-main">',
              '<input class="search-input"/>',
              '<ul class="search-found-list">',
              '</ul>',
              '</div>',
              '</div>'
            ].join(''))

            var searchContainer = dom.find('.search-container')
            new KeyExtra()
              .on('double-keydown', function (charCode) {
                if (charCode === 'A' || charCode === 'SHIFT') {
                  setTimeout(function () {
                    $('body').css({ overflow: 'hidden' })
                    searchContainer.show()
                    searchContainer.find('.search-input').focus().select()
                  }, 0)
                }
              })

            function hideSearch() {
              $('body').css({ overflow: '' })
              searchContainer.hide()
            }

            document.addEventListener('keydown', function (evt) {
              if (evt.key === 'Escape') {
                hideSearch()
              }
            })

            var COUNT = 20

            function search(val) {
              val = typeof val !== 'string' ? '' : val.trim()

              if (!val) {
                foundListDom.empty()
                return
              }

              var type = ''
              if (/^(p|s|m): ([^]+)$/.test(val)) {
                type = RegExp.$1
                val = RegExp.$2
              }

              var keywords = val.split(/[+ ]/)
              var foundList = []

              list.some(function (entity) {
                if (foundList.length === 30) {
                  return true
                }
                var matched_types = []
                var matched = keywords.every(function (keyword) {
                  function find(type, keyword) {
                    // console.log(entity);
                    if (entity[type].toLowerCase().includes(keyword.toLowerCase())) {
                      if (!matched_types.includes(type)) {
                        matched_types.push(type)
                      }
                      return true
                    }
                  }

                  if (type) {
                    return find(type, keyword)
                  }
                  else {
                    return ['p', 's', 'm'].some(function (type) {
                      return find(type, keyword)
                    })
                  }
                })

                if (matched) {
                  foundList.push({
                    type: matched_types.join(' '),
                    entity: entity
                  })
                }
              })

              foundListDom.empty()

              function item(data, i) {
                var html = '<li class="search-item ' + (
                                                       i === 0 ? 'active' : ''
                                                     ) + '">'
                           + '<span class="search-item-type">' + data.type + '</span>'
                           + ': '
                           + '<span class="search-item-method">' + data.entity.m.toUpperCase() + '</span>'
                           + '  '
                           + '<span class="search-item-path">' + data.entity.p + '</span>'
                           + '<span class="search-item-summary">' + data.entity.s + '</span>'
                           + '</li>'

                return $(html).on('click', function () {
                  console.log('click', data)
                  var path = (swaggerVersion === 1 ? data.entity.url : data.entity.url.slice(1))
                  var href = '#' + path
                  if (swaggerVersion === 1) {
                    var link = $('.toggleOperation[href=' + JSON.stringify(href) + ']')
                    link.parents('ul.endpoints').css({ display: 'block' })
                    link[0].scrollIntoView()
                    var operation = link.parents('.operation')
                    var content = operation.find('.content')
                    content.css('display') === 'none' && link[0].click()
                  }
                  else {
                    var tag = data.entity.methodEntity.tags[0]
                    var tagDOM = $('#operations-tag-' + tag)
                    if (!tagDOM.parent().hasClass('is-open')) {
                      tagDOM.click()
                    }

                    path = path.replace(/\//g, '-')
                    var toggleDOM = $('#operations' + path)
                    if (!toggleDOM.hasClass('is-open')) {
                      toggleDOM.children().eq(0).click()
                    }
                    toggleDOM[0].scrollIntoView()
                  }
                  hideSearch()
                  foundListDom.empty()
                })
              }

              if (!foundList.length) {
                foundListDom.append(
                  '<li class="search-item">' + 'Not Found :(' + '</li>'
                )
              }
              else {
                foundListDom.append(
                  foundList.map(item)
                )

                var sumHeight = 1
                var over = Array.from(foundListDom.children('.search-item')).some(function (dom, i) {
                  if (i === COUNT) {
                    return true
                  }
                  sumHeight += $(dom).prop('clientHeight') + 1
                })
                over && foundListDom.css({ 'max-height': sumHeight + 'px' })
              }
            }

            var foundListDom = dom.find('.search-found-list')
            dom.find('.search-input')
               .on('input', function (evt) {
                 search(evt.target.value)
               })
               .on('focus', function (evt) {
                 search(evt.target.value)
               })
               // .on('blur', function (evt) { setTimeout(function () {foundListDom.empty()}, 300) })
               .on('keydown', function (evt) {
                 var activeIndex = null
                 var listDoms = foundListDom.find('.search-item')

                 function findActive() {
                   Array.from(listDoms).some(function (dom, i) {
                     if ($(dom).hasClass('active')) {
                       $(dom).removeClass('active')
                       activeIndex = i
                     }
                   })
                 }

                 var crlKey = evt.metaKey || evt.ctrlKey
                 var offset = crlKey ? COUNT : 1
                 var isUp = null
                 var prevIndex = activeIndex
                 switch (evt.keyCode) {
                   case 38: // UP
                     findActive()
                     activeIndex = (
                                     listDoms.length + activeIndex - offset
                                   ) % listDoms.length
                     listDoms.eq(activeIndex).addClass('active')
                     isUp = true
                     break
                   case 40: // DOWN
                     findActive()
                     activeIndex = (
                                     activeIndex + offset
                                   ) % listDoms.length
                     listDoms.eq(activeIndex).addClass('active')
                     isUp = false
                     break
                   case 13: // ENTER
                     findActive()
                     listDoms[activeIndex] && listDoms[activeIndex].click()
                     return
                 }
                 if (isUp === null) {
                   return
                 }
                 evt.preventDefault()
                 var rang = [
                   foundListDom.prop('scrollTop'),
                   foundListDom.prop('scrollTop') + foundListDom.prop('clientHeight') - 10
                 ]
                 // console.log(rang, listDoms[activeIndex].offsetTop)
                 // console.dir(foundListDom[0])
                 // console.log('!', listDoms[activeIndex].offsetTop, rang);
                 if (listDoms[activeIndex]) {
                   if (!(
                       listDoms[activeIndex].offsetTop >= rang[0] && listDoms[activeIndex].offsetTop <= rang[1]
                     )) {
                     // debugger;
                     if (activeIndex === 0) {
                       foundListDom[0].scrollTop = 0
                     } else if (activeIndex === listDoms.length - 1) {
                       foundListDom[0].scrollTop = foundListDom.prop('scrollHeight')
                     } else {
                       foundListDom[0].scrollTop +=
                         isUp ? -foundListDom.prop('clientHeight') : foundListDom.prop('clientHeight')
                     }
                   }
                 }

                 //console.dir(foundListDom[0])
                 //console.dir(listDoms[activeIndex]);
               })

            var list = []
            var url
            if (swaggerVersion === 1) {
              url = window.swaggerUi.api && window.swaggerUi.api.url
            } else {
              url = $('.download-url-input').val()
              // global ui variable
              if (!url && typeof window.ui !== 'undefined') {
                var config = window.ui.getConfigs()
                url = config.url || (config.urls[0] && config.urls[0].url)
              }
            }

            if (url) {

              function analysisData(data) {
                console.log('data', data)
                $.each(data.paths, function (path, methodSet) {
                  $.each(methodSet, function (method, methodEntity) {
                    // @todo:: array ??
                    methodEntity.tags.join(',')
                    methodEntity.operationId
                    methodEntity.summary

                    list.push({
                      methodEntity: methodEntity,
                      url: '!/' + methodEntity.tags.join(',') + '/' + methodEntity.operationId,
                      s: methodEntity.summary,
                      m: method,
                      p: path
                    })
                  })
                })

                console.log('list', list)
                dom.insertAfter( swaggerVersion === 1 ? $('#header') : $('.topbar'))
              }

              $.ajax({
                url: url,
                dataType: 'text',
                success: function (data) {
                  if (/^\s*[{[]/.test(data)) {
                    // json string is error
                    data = eval('x = ' + data + '\n x;')
                    analysisData(data)
                  } else {
                    // yaml text
                    var script = document.createElement('script')
                    script.src = '//cdn.bootcss.com/js-yaml/3.10.0/js-yaml.min.js'
                    document.head.appendChild(script)
                    script.onload = function () {
                      data = jsyaml.safeLoad(data)
                      analysisData(data)
                    }
                  }
                }
              })
            }

            $('head').append(
              '<style type="text/css">'
              + '.inject-btn-container {'
              + 'text-align: center;'
              + '}'
              + '.inject-btn-container button {'
              + 'margin-left: 5px;'
              + 'margin-right: 5px;'
              + '}'
              + '.search-item-type{'
              + 'display: inline-block;'
              + 'min-width: 15px;'
              + '}'
              + '.search-item-method {'
              + 'display: inline-block;'
              + 'width: 65px;'
              + 'text-align: center'
              + '}'
              + '.search-item-summary {'
              + 'display: inline-block;'
              + 'width: auto;'
              + 'float: right;'
              + 'max-width: 200px;'
              + 'overflow: hidden;'
              + 'text-overflow: ellipsis;'
              + 'white-space: nowrap;'
              + 'text-align: right;'
              + '}'
              + '.search-main {'
              + 'position: static;'
              + 'margin: 40px auto 40px;'
              + 'width: 68%;'
              + 'min-width: 500px;'
              + '}'
              + '.search-container {'
              + 'overflow-y: auto;'
              + 'background-color: rgba(0, 0, 0, .3);'
              + 'position: fixed;'
              + 'left: 0;'
              + 'right: 0;'
              + 'top: 0;'
              + 'bottom: 0;'
              + 'z-index: 1000;'
              + '}'
              + '.search-input {'
              + 'line-height: 30px;'
              + 'font-size: 18px;'
              + 'display: block;'
              + 'margin: auto;'
              + 'width: 100%;'
              + 'border: none;'
              + 'border-bottom: 1px solid #89bf04;'
              + 'padding: 4px 10px 2px;'
              + 'box-sizing: border-box;'
              + '}'
              + '.search-input:focus {'
              + 'outline: none;'
              + '}'
              + '.search-found-list {'
              + 'position: static;'
              + 'left: 0;'
              + 'right: 0;'
              + 'padding: 0;'
              // + 'max-height: 200px;'
              + 'overflow: auto;'
              + ''
              + '}'
              + '.search-found-list {'
              + 'margin-top: 2px;'
              + 'list-style: none;'
              + '}'
              + '.search-item.active, .search-item:hover {'
              + 'background-color: #eee;'
              + '}'
              + '.search-item {'
              + 'cursor: pointer;'
              + 'background-color: #fff;'
              + 'padding: 7px 15px;'
              + 'border: 1px solid #333;'
              + 'border-bottom: none;'
              + '}'
              + '.search-item:last-child {'
              + 'border-bottom: 1px solid #333;'
              + '}'
              + '</style>'
            )

            // auto scrollIntoView by hash
            setTimeout(function () {
              var a = $('a[href="' + location.hash + '"]')[0]
              a && a.scrollIntoView()
            }, 200)

          }


        }
      )(window.jQuery)
    },
    1000
  )

})

