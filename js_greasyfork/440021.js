// ==UserScript==
// @name swagger-ui-2.7.0
// @namespace Violentmonkey Scripts
// @match *://*/*/swagger-ui.html*
// @match *://*/swagger-ui.html*
// @grant none
// @version 20250620
// @description swagger-ui 添加查找接口交互 此插件针对于2.0的swagger版本及以上,由SwaggerUI Search Supportting魔改而成.
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440021/swagger-ui-270.user.js
// @updateURL https://update.greasyfork.org/scripts/440021/swagger-ui-270.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    /**
     * @file: EventEmitter
     * @author: 高国祥,王勤奋wajncn@gmail.com,baibaiwuchang
     * @date: 20220214
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
              script.src = '//cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js'
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

              if (swaggerVersion === 1) {
                dom.append(btns)
                // 调整按钮区域和提示文字的间距
                btns.css('margin-bottom', '5px')
              }
              dom.append([
                '<div class="search-tip-container">',
                '<small class="search-tip clickable-tip">点击这里搜索 | 双击A/Shift快捷搜索 | Esc关闭</small>',
                '</div>',
                '<div class="search-container" style="display: none;">',
                '<div class="search-main">',
                '<input class="search-input" placeholder="🔍 搜索接口... (支持路径、方法、描述)"/>',
                '<ul class="search-found-list">',
                '</ul>',
                '</div>',
                '</div>'
              ].join(''))

              var searchContainer = dom.find('.search-container')

              // 添加点击提示文字打开搜索的功能
              dom.find('.clickable-tip').on('click', function() {
                setTimeout(function () {
                  $('body').css({ overflow: 'hidden' })
                  searchContainer.show()
                  searchContainer.find('.search-input').focus().select()
                }, 0)
              })

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
                  var method = data.entity.m.toUpperCase()
                  var methodClass = 'method-' + data.entity.m.toLowerCase()
                  var html = '<li class="search-item ' + (
                                                         i === 0 ? 'active' : ''
                                                       ) + '">'
                             + '<div class="search-item-content">'
                             + '<span class="search-item-type">' + data.type + '</span>'
                             + '<span class="search-item-method ' + methodClass + '">' + method + '</span>'
                             + '<span class="search-item-path">' + data.entity.p + '</span>'
                             + '</div>'
                             + '<div class="search-item-right">'
                             + '<span class="search-item-summary">' + data.entity.s + '</span>'
                             + '<button class="copy-route-btn" title="复制路由" onclick="navigator.clipboard.writeText(\'' + data.entity.p + '\').then(() => alert(\'路由已复制到剪贴板\'))">📋</button>'
                             + '</div>'
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
                        // swagger  中文版本
                      var tag = data.entity.methodEntity.tags[0]
                      tag = tag.replaceAll(")","\\)").replaceAll("(","\\(").replaceAll(" ","_")
                      var tagDOM = $('#operations-tag-' + tag)
                      if (!tagDOM.parent().hasClass('is-open')) {
                        tagDOM.click()
                      }
                      path = path.replaceAll(")","\\)").replaceAll("(","\\(").replaceAll(" ","\\ ")
                      path = path.replaceAll(/\//g, '-')
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
                        var u = "";
                        // url非中文的版本
                        if(swaggerVersion==1){
                            u = '!/' + methodEntity.tags.join(',').replace(/[^a-zA-Z\d]/g, function(str) { return str.charCodeAt(0); }) + '/' + methodEntity.operationId
                        }else{
                            // url是中文的版本
                            u = '!/' + methodEntity.tags.join(',') + '/' + methodEntity.operationId
                        }

                      list.push({
                        methodEntity: methodEntity,
                        url: u,
                        s: methodEntity.summary,
                        m: method,
                        p: path
                      })
                    })
                  })

                  console.log('list', list)
                  dom.insertAfter( swaggerVersion === 1 ? $('#header') : $('.topbar'))


                  if(swaggerVersion !=1){
                      // url hash为: #/(内部)债券基础信息接口/listBondRemainingTenorDTOUsingPOST_1
                      var urlHash =  decodeURIComponent(window.location.hash);
                      if(urlHash != null && urlHash.length > 2) {
                          // 去掉第一个#
                          urlHash = urlHash.slice(1);
                          var urlHashArrays = urlHash.split("/");
                          var tag = urlHashArrays[1];
                          tag = tag.replaceAll(")","\\)").replaceAll("(","\\(").replaceAll(" ","_");
                          var tagDOM = $('#operations-tag-' + tag);
                          if (!tagDOM.parent().hasClass('is-open')) {
                            tagDOM.click();
                          }

                          if(urlHashArrays.length == 3){
                              path = urlHash.replaceAll(")","\\)").replaceAll("(","\\(").replaceAll(" ","\\ ");
                              path = path.replaceAll(/\//g, '-');
                              var toggleDOM = $('#operations' + path)
                              if (!toggleDOM.hasClass('is-open')) {
                                toggleDOM.children().eq(0).click();
                              }
                              toggleDOM[0].scrollIntoView();
                          }else{
                              tagDOM[0].scrollIntoView();
                          }
                      }
                  }

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
                + ':root {'
                + '--primary-color: #3498db;'
                + '--primary-dark: #2980b9;'
                + '--success-color: #27ae60;'
                + '--danger-color: #e74c3c;'
                + '--warning-color: #f39c12;'
                + '--info-color: #17a2b8;'
                + '--light-bg: #f8f9fa;'
                + '--dark-text: #2c3e50;'
                + '--light-text: #6c757d;'
                + '--border-color: #dee2e6;'
                + '--shadow-sm: 0 2px 4px rgba(0,0,0,0.1);'
                + '--shadow-md: 0 4px 8px rgba(0,0,0,0.15);'
                + '--shadow-lg: 0 8px 24px rgba(0,0,0,0.2);'
                + '--border-radius: 8px;'
                + '--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);'
                + '}'
                + '.inject-btn-container {'
                + 'text-align: center;'
                + 'margin: 20px 0 10px 0;'
                + 'padding: 12px 15px 8px 15px;'
                + 'border-radius: var(--border-radius);'
                + '}'
                + '.inject-btn-container button {'
                + 'margin: 0 6px;'
                + 'padding: 8px 16px;'
                + 'background: white;'
                + 'border: 2px solid var(--border-color);'
                + 'border-radius: 6px;'
                + 'color: var(--dark-text);'
                + 'font-weight: 500;'
                + 'cursor: pointer;'
                + 'transition: var(--transition);'
                + 'font-size: 13px;'
                + '}'
                + '.inject-btn-container button:hover {'
                + 'border-color: var(--primary-color);'
                + 'color: var(--primary-color);'
                + 'transform: translateY(-1px);'
                + 'box-shadow: var(--shadow-sm);'
                + '}'
                + '.inject-btn-container button:active {'
                + 'transform: translateY(0);'
                + '}'
                + '.search-item-type{'
                + 'display: inline-block;'
                + 'min-width: 20px;'
                + 'font-size: 12px;'
                + 'font-weight: 600;'
                + 'color: var(--primary-color);'
                + 'text-transform: uppercase;'
                + '}'
                + '.search-item-method {'
                + 'display: inline-block;'
                + 'min-width: 60px;'
                + 'text-align: center;'
                + 'font-weight: 600;'
                + 'font-size: 11px;'
                + 'padding: 6px 12px;'
                + 'border-radius: 4px;'
                + 'color: white;'
                + 'text-transform: uppercase;'
                + 'letter-spacing: 0.5px;'
                + 'box-shadow: 0 1px 2px rgba(0,0,0,0.1);'
                + '}'
                + '.search-item .search-item-method {'
                + 'background: #6c757d;'
                + 'color: white;'
                + '}'
                + '.method-get {'
                + 'background: #61affe !important;'
                + 'color: white !important;'
                + '}'
                + '.method-post {'
                + 'background: #49cc90 !important;'
                + 'color: white !important;'
                + '}'
                + '.method-put {'
                + 'background: #fca130 !important;'
                + 'color: white !important;'
                + '}'
                + '.method-delete {'
                + 'background: #f93e3e !important;'
                + 'color: white !important;'
                + '}'
                + '.method-patch {'
                + 'background: #50e3c2 !important;'
                + 'color: white !important;'
                + '}'
                + '.method-head {'
                + 'background: #9012fe !important;'
                + 'color: white !important;'
                + '}'
                + '.method-options {'
                + 'background: #0d5aa7 !important;'
                + 'color: white !important;'
                + '}'
                + '.search-item-summary {'
                + 'width: 240px;'
                + 'overflow: hidden;'
                + 'text-overflow: ellipsis;'
                + 'white-space: nowrap;'
                + 'color: var(--light-text);'
                + 'font-size: 13px;'
                + 'font-style: italic;'
                + 'text-align: right;'
                + 'flex-shrink: 0;'
                + '}'
                + '.search-main {'
                + 'position: static;'
                + 'margin: 40px auto;'
                + 'width: 70%;'
                + 'max-width: 800px;'
                + 'min-width: 500px;'
                + 'background: white;'
                + 'border-radius: 12px;'
                + 'box-shadow: var(--shadow-lg);'
                + 'overflow: hidden;'
                + 'backdrop-filter: blur(20px);'
                + '}'
                + '.search-container {'
                + 'overflow-y: auto;'
                + 'background: linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%);'
                + 'backdrop-filter: blur(8px);'
                + 'position: fixed;'
                + 'left: 0;'
                + 'right: 0;'
                + 'top: 0;'
                + 'bottom: 0;'
                + 'z-index: 10000;'
                + 'animation: fadeIn 0.3s ease-out;'
                + '}'
                + '@keyframes fadeIn {'
                + 'from { opacity: 0; }'
                + 'to { opacity: 1; }'
                + '}'
                + '.search-input {'
                + 'line-height: 30px;'
                + 'font-size: 18px;'
                + 'display: block;'
                + 'margin: 0;'
                + 'width: 100%;'
                + 'border: none;'
                + 'padding: 20px 24px;'
                + 'box-sizing: border-box;'
                + 'height: 70px;'
                + 'background: white;'
                + 'color: var(--dark-text);'
                + 'border-bottom: 3px solid var(--border-color);'
                + 'transition: var(--transition);'
                + 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;'
                + '}'
                + '.search-input::placeholder {'
                + 'color: var(--light-text);'
                + 'font-style: italic;'
                + '}'
                + '.search-input:focus {'
                + 'outline: none;'
                + 'border-bottom-color: var(--primary-color);'
                + 'box-shadow: inset 0 -3px 0 var(--primary-color);'
                + '}'
                + '.search-found-list {'
                + 'position: static;'
                + 'left: 0;'
                + 'right: 0;'
                + 'padding: 0;'
                + 'margin: 0;'
                + 'max-height: 60vh;'
                + 'overflow-y: auto;'
                + 'background: white;'
                + '}'
                + '.search-found-list::-webkit-scrollbar {'
                + 'width: 6px;'
                + '}'
                + '.search-found-list::-webkit-scrollbar-track {'
                + 'background: var(--light-bg);'
                + '}'
                + '.search-found-list::-webkit-scrollbar-thumb {'
                + 'background: var(--light-text);'
                + 'border-radius: 3px;'
                + '}'
                + '.search-found-list::-webkit-scrollbar-thumb:hover {'
                + 'background: var(--dark-text);'
                + '}'
                + '.search-found-list {'
                + 'list-style: none;'
                + '}'
                + '.search-item.active {'
                + 'background: linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%);'
                + 'border-left: 4px solid var(--primary-color);'
                + 'transform: translateX(4px);'
                + '}'
                + '.search-item:hover {'
                + 'background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);'
                + 'transform: translateX(2px);'
                + '}'
                + '.search-item {'
                + 'cursor: pointer;'
                + 'background: white;'
                + 'padding: 12px 20px;'
                + 'border-bottom: 1px solid var(--border-color);'
                + 'transition: var(--transition);'
                + 'position: relative;'
                + 'display: flex;'
                + 'align-items: center;'
                + 'justify-content: flex-start;'
                + '}'
                + '.search-item-content {'
                + 'display: flex;'
                + 'align-items: center;'
                + 'gap: 12px;'
                + 'flex: 1;'
                + 'min-width: 0;'
                + '}'
                + '.search-item-right {'
                + 'display: flex;'
                + 'align-items: center;'
                + 'gap: 8px;'
                + 'flex-shrink: 0;'
                + 'width: 320px;'
                + 'justify-content: flex-end;'
                + 'margin-left: auto;'
                + '}'
                + '.search-item:last-child {'
                + 'border-bottom: none;'
                + '}'
                + '.search-item:before {'
                + 'content: "";'
                + 'position: absolute;'
                + 'left: 0;'
                + 'top: 0;'
                + 'bottom: 0;'
                + 'width: 0;'
                + 'background: var(--primary-color);'
                + 'transition: var(--transition);'
                + '}'
                + '.search-item:hover:before {'
                + 'width: 3px;'
                + '}'
                + '.search-item-path {'
                + 'font-family: "Monaco", "Menlo", "Consolas", monospace;'
                + 'font-size: 14px;'
                + 'color: var(--dark-text);'
                + 'font-weight: 500;'
                + 'max-width: 400px;'
                + 'overflow: hidden;'
                + 'text-overflow: ellipsis;'
                + 'white-space: nowrap;'
                + '}'
                + '.copy-route-btn {'
                + 'padding: 8px 12px;'
                + 'background: linear-gradient(135deg, var(--success-color), #2ecc71);'
                + 'border: none;'
                + 'border-radius: 6px;'
                + 'cursor: pointer;'
                + 'font-size: 12px;'
                + 'color: white;'
                + 'transition: var(--transition);'
                + 'font-weight: 500;'
                + 'box-shadow: var(--shadow-sm);'
                + 'width: 60px;'
                + 'flex-shrink: 0;'
                + '}'
                + '.copy-route-btn:hover {'
                + 'background: linear-gradient(135deg, #2ecc71, var(--success-color));'
                + 'transform: translateY(-1px);'
                + 'box-shadow: var(--shadow-md);'
                + '}'
                + '.copy-route-btn:active {'
                + 'transform: translateY(0);'
                + '}'
                + '@media (max-width: 768px) {'
                + '.search-main {'
                + 'width: 95%;'
                + 'min-width: auto;'
                + 'margin: 20px auto;'
                + '}'
                + '.search-item {'
                + 'padding: 12px 16px;'
                + 'flex-direction: column;'
                + 'align-items: flex-start;'
                + 'gap: 8px;'
                + '}'
                + '.search-item-content {'
                + 'width: 100%;'
                + '}'
                + '.search-item-path {'
                + 'max-width: 250px;'
                + '}'
                + '.search-item-right {'
                + 'width: 100%;'
                + 'justify-content: space-between;'
                + 'margin-left: 0;'
                + '}'
                + '.search-item-summary {'
                + 'width: auto;'
                + 'max-width: 200px;'
                + 'text-align: left;'
                + '}'
                + '.copy-route-btn {'
                + 'width: 50px;'
                + '}'
                + '.search-tip-container {'
                + 'margin: 0 0 15px 0;'
                + '}'
                + '.search-tip {'
                + 'font-size: 11px;'
                + 'padding: 6px 12px;'
                + '}'
                + '}'
                + '.search-tip-container {'
                + 'text-align: center;'
                + 'margin: 0 0 20px 0;'
                + 'padding: 0;'
                + '}'
                + '.search-tip {'
                + 'display: inline-block;'
                + 'background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);'
                + 'color: var(--light-text);'
                + 'padding: 6px 14px;'
                + 'border-radius: 20px;'
                + 'font-size: 11px;'
                + 'font-weight: 500;'
                + 'border: 1px solid var(--border-color);'
                + 'box-shadow: var(--shadow-sm);'
                + 'letter-spacing: 0.3px;'
                + 'transition: var(--transition);'
                + '}'
                + '.clickable-tip {'
                + 'cursor: pointer;'
                + 'user-select: none;'
                + '}'
                + '.clickable-tip:hover {'
                + 'border-color: var(--primary-color);'
                + 'color: var(--primary-color);'
                + 'transform: translateY(-1px);'
                + 'box-shadow: var(--shadow-sm);'
                + '}'
                + '.clickable-tip:active {'
                + 'transform: translateY(0);'
                + 'box-shadow: var(--shadow-sm);'
                + '}'
                + '.search-container small {'
                + 'background: rgba(255, 255, 255, 0.95);'
                + 'padding: 12px 20px;'
                + 'border-radius: 8px;'
                + 'box-shadow: var(--shadow-sm);'
                + 'color: var(--dark-text);'
                + 'font-weight: 500;'
                + 'backdrop-filter: blur(10px);'
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
