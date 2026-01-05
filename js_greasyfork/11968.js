// ==UserScript==
// @name         2ch Thread Viewer
// @namespace    https://greasyfork.org/users/1009-kengo321
// @version      26
// @description  ２ちゃんねるのスレッドビューワ
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @match        *://*.2ch.net/test/read.cgi/*
// @match        *://*.5ch.net/test/read.cgi/*
// @license      MIT
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/11968/2ch%20Thread%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/11968/2ch%20Thread%20Viewer.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  var find = function(predicate, array) {
    for (var i = 0; i < array.length; i++) {
      var e = array[i]
      if (predicate(e)) return e
    }
  }
  var pushIfAbsent = function(array, value) {
    if (array.indexOf(value) === -1) array.push(value)
    return array
  }
  var pushSelectedAll = function(document) {
    return function(array, selector) {
      ;[].push.apply(array, document.querySelectorAll(selector))
      return array
    }
  }
  var not = function(fn) {
    return function() { return !fn.apply(this, arguments) }
  }
  var array = Function.prototype.call.bind([].slice)
  var curry = (function() {
    var applyOrRebind = function(func, arity, args) {
      var passed = args.concat(array(arguments, 3)).slice(0, arity)
      return arity === passed.length
             ? func.apply(this, passed)
             : applyOrRebind.bind(this, func, arity, passed)
    }
    return function(func) {
      return applyOrRebind.bind(this, func, func.length, [])
    }
  })()
  var invoke = curry(function(methodName, args, obj) {
    return obj[methodName].apply(obj, args)
  })
  var equalObj = curry(function(o1, o2) {
    return Object.keys(o1)
      .concat(Object.keys(o2))
      .reduce(pushIfAbsent, [])
      .every(function(key) { return o1[key] === o2[key] })
  })
  var prop = curry(function(propName, obj) {
    return obj[propName]
  })
  var listeners = {
    set: function(eventTypes, observer) {
      eventTypes.forEach(function(t) {
        observer[`_${t}Listener`] = observer[`_${t}`].bind(observer)
      })
    },
    add: function(eventTypes, observer, observable) {
      eventTypes.forEach(function(t) {
        observable.addEventListener(t, observer[`_${t}Listener`])
      })
    },
    remove: function(eventTypes, observer, observable) {
      eventTypes.forEach(function(t) {
        observable.removeEventListener(t, observer[`_${t}Listener`])
      })
    },
  }
  var msPerDay = 86400000
  var truncTime = function(dateTime) {
    return dateTime - dateTime % msPerDay
  }
  var toDateString = function(msTime) {
    var d = new Date(msTime)
    return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
  }

  var Observable = (function() {
    var Observable = function() {
      this._eventTypeToListeners = Object.create(null)
    }
    Observable.prototype.addEventListener = function(eventType, listener) {
      var m = this._eventTypeToListeners
      var v = m[eventType]
      if (v) v.push(listener); else m[eventType] = [listener]
    }
    Observable.prototype.removeEventListener = function(eventType, listener) {
      var v = this._eventTypeToListeners[eventType]
      if (!v) return
      var i = v.indexOf(listener)
      if (i >= 0) v.splice(i, 1)
    }
    Observable.prototype.getEventListeners = function(eventType) {
      return this._eventTypeToListeners[eventType] || []
    }
    Observable.prototype.fireEvent = function(eventType/* , ...args */) {
      var v = this._eventTypeToListeners[eventType]
      ;(v || []).forEach(invoke('apply', [null, array(arguments, 1)]))
    }
    return Observable
  })()

  var Parser = (function() {
    var mail = function(dt) {
      var e = dt.childNodes[1]
      return e.tagName === 'FONT' ? '' : Parser._mail(e)
    }
    var id = function(dt) {
      var r = /ID:([\w+/]+)/.exec(dt.childNodes[2].textContent)
      return r ? r[1] : ''
    }
    var createResponse = function(dt, dd) {
      var num = parseInt(dt.firstChild.textContent.split(' ')[0])
      var name = dt.childNodes[1].textContent
      return {
        number: num,
        name,
        mail: mail(dt),
        jstTime: Parser._jstTime(dt.childNodes[2].textContent),
        id: id(dt),
        anchors: Parser._anchors(dd, num),
        contentNodes: Parser._contentNodes(dd.childNodes),
        korokoro: Parser._korokoro(name),
      }
    }
    var postedResShowElem = function(document) {
      return find(function(e) {
        return e.textContent === '新着レスの表示'
      }, document.getElementsByTagName('center'))
    }
    var hrAbove = function(e) {
      var p = e.previousSibling
      if (!p) return null
      var hr = p.previousSibling
      return hr && hr.tagName === 'HR' ? hr : null
    }
    var pageSizeElem = function(document) {
      return find(function(e) {
        return e.textContent.endsWith('KB')
            && e.getAttribute('color') === 'red'
            && e.getAttribute('face') === 'Arial'
      }, document.getElementsByTagName('font'))
    }
    var pushIfTruthy = function(array, value) {
      if (value) array.push(value)
    }
    var Parser = function(document) {
      this.doc = document
    }
    Parser.prototype._boardId = function() {
      if (!this.doc.location) return ''
      var r = /\/test\/read.cgi\/([^/]+)/.exec(this.doc.location.pathname)
      return r ? r[1] : ''
    }
    Parser.prototype._threadNumber = function() {
      if (!this.doc.location) return 0
      var r = /\/test\/read.cgi\/[^/]+\/(\d+)/.exec(this.doc.location.pathname)
      return r ? parseInt(r[1]) : 0
    }
    Parser.prototype._floatedSpan = function() {
      return this.doc.querySelector('body > div > span')
    }
    Parser.prototype._postForm = function() {
      return find(function(f) {
        return f.getAttribute('action').startsWith('../test/bbs.cgi')
            && f.method.toUpperCase() === 'POST'
      }, this.doc.querySelectorAll('form'))
    }
    Parser.prototype._elementsToRemove = function() {
      var result = []
      var e = postedResShowElem(this.doc)
      if (e) {
        result.push(e)
        pushIfTruthy(result, hrAbove(e))
      }
      pushIfTruthy(result, pageSizeElem(this.doc))
      return result
    }
    Parser.prototype._ads = function() {
      return ['.ad--right', '.js--ad--top', '.js--ad--bottom']
        .reduce(pushSelectedAll(this.doc), [])
    }
    Parser.prototype._hasThreadClosed = function() {
      return !postedResShowElem(this.doc)
    }
    Parser.prototype._responses = function() {
      var dl = this.doc.querySelector('.thread')
      var dt = dl.getElementsByTagName('dt')
      var dd = dl.getElementsByTagName('dd')
      var result = []
      for (var i = 0; i < dt.length; i++) {
        result.push(createResponse(dt[i], dd[i]))
      }
      return result
    }
    Parser.prototype._action = function() {
      return function() {}
    }
    Parser.prototype.parse = function() {
      return {
        responses: this._responses(),
        threadClosed: this._hasThreadClosed(),
        ads: this._ads(),
        elementsToRemove: this._elementsToRemove(),
        threadRootElement: this.doc.querySelector('.thread'),
        postForm: this._postForm(),
        boardId: this._boardId(),
        threadNumber: this._threadNumber(),
        floatedSpan: this._floatedSpan(),
        action: this._action(),
      }
    }
    Parser.of = function(document) {
      if (document.querySelector('dl.thread')) return new Parser(document)
      if (document.querySelector('div.thread')) return new Parser6(document)
      return null
    }
    Parser._mail = function(anchor) {
      var s = anchor.href.slice('mailto:'.length)
      try {
        return decodeURI(s)
      } catch (e) {
        return s
      }
    }
    Parser._jstTime = function(text) {
      var datetime = /(\d{4})\/(\d{2})\/(\d{2})\(.\)/.exec(text)
      if (!datetime) return NaN
      var year = datetime[1]
      var month = datetime[2] - 1
      var date = datetime[3]
      var time = /(\d{2}):(\d{2}):(\d{2})/.exec(text)
      var hour = time ? time[1] : 0
      var minute = time ? time[2] : 0
      var seconds = time ? time[3] : 0
      return Date.UTC(year, month, date, hour, minute, seconds)
    }
    var last = function(array) {
      return array[array.length - 1]
    }
    var isEmptyTextNode = function(node) {
      return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() === ''
    }
    var isTrimmedRightNode = function(node) {
      return node && (node.tagName === 'BR' || isEmptyTextNode(node))
    }
    Parser._contentNodes = function(childNodes) {
      var nodes = Array.from(childNodes)
      while (isTrimmedRightNode(last(nodes))) nodes.pop()
      return nodes.filter(function(n) {
        return !(n.classList && n.classList.contains('banner'))
      })
    }
    Parser._anchors = function(root, responseNumber) {
      return Array.from(root.querySelectorAll('a')).filter(function(n) {
        return n.textContent.startsWith('>>')
      }).map(function(n) {
        return parseInt(n.textContent.slice('>>'.length))
      }).filter(function(num) {
        return num < responseNumber
      }).reduce(pushIfAbsent, [])
    }
    Parser._korokoro = function(name) {
      var r = /\s(.{4}-.{4}).*?$/.exec(name)
      return r ? r[1] : ''
    }
    return Parser
  })()

  var Parser6 = (function(_super) {
    var mail = function(post) {
      var a = post.querySelector('.name a')
      return a ? Parser._mail(a) : ''
    }
    var id = function(post) {
      var userid = post.dataset.userid
      if (!(userid && userid.startsWith('ID:'))) return ''
      var val = userid.slice('ID:'.length)
      return val.startsWith('???') ? '' : val
    }
    var createResponse = function(post) {
      var num = parseInt(post.id)
      var name = post.querySelector('.name').textContent
      return {
        number: num,
        name,
        mail: mail(post),
        jstTime: Parser._jstTime(post.querySelector('.date').textContent),
        id: id(post),
        anchors: Parser._anchors(post.querySelector('.message'), num),
        contentNodes: Parser._contentNodes(post.querySelector('.message').childNodes),
        korokoro: Parser._korokoro(name),
      }
    }
    var Parser6 = function(document) {
      _super.call(this, document)
    }
    Parser6.prototype = Object.create(_super.prototype)
    Parser6.prototype._floatedSpan = function() { return null }
    Parser6.prototype._postForm = function() {
      return this.doc.querySelector('form')
    }
    Parser6.prototype._elementsToRemove = function() {
      return ['.cLength', '.newposts'].reduce(pushSelectedAll(this.doc), [])
    }
    Parser6.prototype._ads = function() {
      return ['.ad--right', '.ad--bottom', '#banner']
        .reduce(pushSelectedAll(this.doc), [])
    }
    Parser6.prototype._hasThreadClosed = function() {
      return !this.doc.querySelector('.newpostbutton')
    }
    Parser6.prototype._responses = function() {
      return Array.from(this.doc.querySelectorAll('.thread .post')
                      , createResponse)
    }
    Parser6.prototype._action = function() {
      return () => {
        const e = this.doc.querySelector('.container_body')
        if (e) e.removeAttribute('style')
      }
    }
    return Parser6
  })(Parser)

  var Response = (function(_super) {
    var padZero = function(n) {
      return (n <= 9 ? '0' : '') + n
    }
    var content = function(nodes) {
      var result = ''
      for (var n of nodes)
        result += (n.tagName === 'BR' ? '\n' : n.textContent)
      return result
    }
    var Response = function(objParam) {
      _super.call(this)
      this.number = objParam.number
      this.name = objParam.name
      this.mail = objParam.mail
      this.jstTime = objParam.jstTime
      this.id = objParam.id
      this.contentNodes = objParam.contentNodes
      this.content = content(objParam.contentNodes)
      this.anchors = objParam.anchors
      this.korokoro = objParam.korokoro
      this.children = []
      this.sameIdResponses = []
      this.sameKorokoroResponses = []
      this.ngId = false
      this.ngParent = false
      this.ngWord = false
      this.ngName = false
      this.ngKorokoro = false
      this.ngIdTail = false
      this.ngSlip = false
      this.parents = new Set
    }
    Response.of = function(objParam) {
      return new Response(objParam)
    }
    Response.prototype = Object.create(_super.prototype)
    Response.prototype.getDateTimeString = function() {
      var d = new Date(this.jstTime)
      var y = d.getUTCFullYear()
      var mon = padZero(d.getUTCMonth() + 1)
      var date = padZero(d.getUTCDate())
      var h = padZero(d.getUTCHours())
      var min = padZero(d.getUTCMinutes())
      var s = padZero(d.getUTCSeconds())
      return `${y}-${mon}-${date} ${h}:${min}:${s}`
    }
    Response.prototype.getIndexOfSameIdResponses = function() {
      return this.sameIdResponses.indexOf(this)
    }
    Response.prototype.getIndexOfSameKorokoroResponses = function() {
      return this.sameKorokoroResponses.indexOf(this)
    }
    Response.prototype.addChildren = function(children) {
      if (children.length === 0) return
      ;[].push.apply(this.children, children)
      children.forEach(invoke('addParent', [this]))
      this.fireEvent('childrenAdded', children)
    }
    Response.prototype.addSameIdResponses = function(sameIdResponses) {
      if (sameIdResponses.length === 0) return
      ;[].push.apply(this.sameIdResponses, sameIdResponses)
      this.fireEvent('sameIdResponsesAdded', sameIdResponses)
    }
    Response.prototype.addSameKorokoroResponses = function(sameKorokoroResponses) {
      if (sameKorokoroResponses.length === 0) return
      ;[].push.apply(this.sameKorokoroResponses, sameKorokoroResponses)
      this.fireEvent('sameKorokoroResponsesAdded', sameKorokoroResponses)
    }
    Response.prototype.getNoNgChildren = function() {
      return this.children.filter(not(invoke('isNg', [])))
    }
    Response.prototype.isNg = function() {
      return this.ngId
          || this.ngParent
          || this.ngWord
          || this.ngName
          || this.ngKorokoro
          || this.ngIdTail
          || this.ngSlip
    }
    Response.prototype._setNg = function(propName, newVal) {
      var preNg = this.isNg()
      this[propName] = Boolean(newVal)
      if (preNg !== this.isNg()) this.fireEvent('ngChanged', this.isNg())
    }
    Response.prototype.setNgId = function(ngId) {
      this._setNg('ngId', ngId)
    }
    Response.prototype.setNgParent = function(ngParent) {
      this._setNg('ngParent', ngParent)
    }
    Response.prototype.setNgWord = function(ngWord) {
      this._setNg('ngWord', ngWord)
    }
    Response.prototype.setNgName = function(ngName) {
      this._setNg('ngName', ngName)
    }
    Response.prototype.setNgKorokoro = function(ngKorokoro) {
      this._setNg('ngKorokoro', ngKorokoro)
    }
    Response.prototype.setNgIdTail = function(ngIdTail) {
      this._setNg('ngIdTail', ngIdTail)
    }
    Response.prototype.setNgSlip = function(ngSlip) {
      this._setNg('ngSlip', ngSlip)
    }
    Response.prototype.updateNgParent = function() {
      this.setNgParent([...this.parents].some(p => p.isNg()))
    }
    Response.prototype.addParent = function(parent) {
      if (this.parents.has(parent)) return
      this.parents.add(parent)
      this.updateNgParent()
      parent.addEventListener('ngChanged', () => this.updateNgParent())
    }
    Response.prototype.hasAsciiArt = function() {
      return this.content.includes('\u3000\x20')
    }
    return Response
  })(Observable)

  var ResponseRequest = (function() {
    var HTTP_OK = 200
    var parseResponseText = function(responseText) {
      var d = new DOMParser().parseFromString(responseText, 'text/html')
      var r = Parser.of(d).parse()
      return {
        responses: r.responses.slice(1),
        threadClosed: r.threadClosed,
      }
    }
    var onload = function(xhr, resolve, reject) {
      return function() {
        if (xhr.status === HTTP_OK) {
          try {
            resolve(parseResponseText(xhr.responseText))
          } catch (e) {
            reject(e)
          }
        } else {
          reject(new Error(xhr.status + ' ' + xhr.statusText))
        }
      }
    }
    var ResponseRequest = function() {}
    ResponseRequest.prototype.send = function(basePath, startResponseNumber) {
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest()
        xhr.timeout = 10000
        xhr.onload = onload(xhr, resolve, reject)
        xhr.onerror = function() { reject(new Error('エラー')) }
        xhr.ontimeout = function() { reject(new Error('時間切れ')) }
        xhr.open('GET', `${basePath}${startResponseNumber - 1}-n`)
        xhr.overrideMimeType('text/html; charset=shift_jis')
        xhr.send()
      })
    }
    return ResponseRequest
  })()

  function NgItem() {}
  NgItem.prototype.isValidFor = function() {
    throw new Error('NgItem#isValidFor(thread) must be implemented')
  }
  NgItem.prototype.match = function() {
    throw new Error('NgItem#match(response) must be implemented')
  }

  function BoundableNgItem(boardId, threadNumber) {
    if (boardId) this.boardId = boardId
    if (threadNumber) this.threadNumber = parseInt(threadNumber)
  }
  BoundableNgItem.prototype = Object.create(NgItem.prototype)
  BoundableNgItem.prototype.constructor = BoundableNgItem
  BoundableNgItem.prototype.isValidFor = function(thread) {
    return (!this.boardId || this.boardId === thread.boardId)
        && (!this.threadNumber || this.threadNumber === thread.threadNumber)
  }

  function NgWord(ngWord, boardId, threadNumber) {
    BoundableNgItem.call(this, boardId, threadNumber)
    this.ngWord = ngWord
  }
  NgWord.of = function(objParam) {
    return new NgWord(objParam.ngWord, objParam.boardId, objParam.threadNumber)
  }
  NgWord.prototype = Object.create(BoundableNgItem.prototype)
  NgWord.prototype.constructor = NgWord
  NgWord.prototype.match = function(res) {
    return res.content.includes(this.ngWord)
  }

  function NgName(ngName, boardId, threadNumber) {
    BoundableNgItem.call(this, boardId, threadNumber)
    this.ngName = ngName
  }
  NgName.of = function(objParam) {
    return new NgName(objParam.ngName, objParam.boardId, objParam.threadNumber)
  }
  NgName.prototype = Object.create(BoundableNgItem.prototype)
  NgName.prototype.constructor = NgName
  NgName.prototype.match = function(res) {
    return res.name.includes(this.ngName)
  }

  function BoardScopeNgItem(boardId) {
    this.boardId = boardId
  }
  BoardScopeNgItem.prototype = Object.create(NgItem.prototype)
  BoardScopeNgItem.prototype.constructor = BoardScopeNgItem
  BoardScopeNgItem.prototype.isValidFor = function(thread) {
    return this.boardId === thread.boardId
  }

  var NgId = (function(_super) {
    var NgId = function(boardId, jstTime, id) {
      _super.call(this, boardId)
      this.boardId = boardId
      this.activeDate = truncTime(jstTime)
      this.id = id
    }
    NgId.of = function(objParam) {
      return new NgId(objParam.boardId, objParam.activeDate, objParam.id)
    }
    NgId.prototype = Object.create(_super.prototype)
    NgId.prototype.constructor = NgId
    NgId.prototype.match = function(response) {
      return this.id === response.id
          && this.activeDate === truncTime(response.jstTime)
    }
    NgId.prototype.getActiveDateString = function() {
      return toDateString(new Date(this.activeDate))
    }
    return NgId
  })(BoardScopeNgItem)

  function NgIdTail(ngIdTail, boardId, threadNumber) {
    BoundableNgItem.call(this, boardId, threadNumber)
    this.ngIdTail = ngIdTail
  }
  NgIdTail.of = function(objParam) {
    return new NgIdTail(objParam.ngIdTail, objParam.boardId, objParam.threadNumber)
  }
  NgIdTail.prototype = Object.create(BoundableNgItem.prototype)
  NgIdTail.prototype.constructor = NgIdTail
  NgIdTail.prototype.match = function(res) {
    return res.id.length >= 9 && res.id.charAt(8) === this.ngIdTail
  }

  var NgKorokoro = (function(_super) {
    var msForLastThu = [
      msPerDay * 3,
      msPerDay * 4,
      msPerDay * 5,
      msPerDay * 6,
      0,
      msPerDay,
      msPerDay * 2,
    ]
    var lastThursday = function(ms) {
      return ms - msForLastThu[new Date(ms).getUTCDay()]
    }
    function NgKorokoro(boardId, jstTime, korokoro) {
      _super.call(this, boardId)
      this.startOfAvailablePeriod = lastThursday(truncTime(jstTime))
      this.korokoro = korokoro
    }
    NgKorokoro.of = function(objParam) {
      var o = objParam
      return new NgKorokoro(o.boardId, o.startOfAvailablePeriod, o.korokoro)
    }
    NgKorokoro.prototype = Object.create(_super.prototype)
    NgKorokoro.prototype.constructor = NgKorokoro
    NgKorokoro.prototype._endOfAvailablePeriod = function() {
      return this.startOfAvailablePeriod + msPerDay * 7
    }
    NgKorokoro.prototype.match = function(response) {
      return this.korokoro === response.korokoro
          && this.startOfAvailablePeriod <= response.jstTime
          && response.jstTime < this._endOfAvailablePeriod()
    }
    NgKorokoro.prototype.getAvailablePeriodString = function() {
      var start = new Date(this.startOfAvailablePeriod)
      var end = new Date(this.startOfAvailablePeriod + msPerDay * 6)
      return `${toDateString(start)}_${toDateString(end)}`
    }
    return NgKorokoro
  })(BoardScopeNgItem)

  function NgSlip(type, boardId, threadNumber) {
    BoundableNgItem.call(this, boardId, threadNumber)
    this.type = type
  }
  NgSlip.of = function(objParam) {
    return new NgSlip(objParam.type, objParam.boardId, objParam.threadNumber)
  }
  NgSlip.prototype = Object.create(BoundableNgItem.prototype)
  NgSlip.prototype.constructor = NgSlip
  NgSlip.prototype.match = function(res) {
    return (this.type === 'id' && !res.id)
        || (this.type === 'korokoro' && !res.korokoro)
  }

  var NgItems = {
    createFactoryMethod(setNgTo) {
      var filter = function() {
        return result(Array.prototype.filter.apply(this, arguments))
      }
      var concat = function() {
        return result(Array.prototype.concat.apply(this, arguments))
      }
      var result = function(ngItemArray) {
        ngItemArray.setNgTo = setNgTo
        ngItemArray.filter = filter
        ngItemArray.concat = concat
        return ngItemArray
      }
      return result
    },
  }

  var NgWords = {
    from: NgItems.createFactoryMethod(function(res) {
      res.setNgWord(this.some(function(ngWord) { return ngWord.match(res) }))
    }),
  }

  var NgNames = {
    from: NgItems.createFactoryMethod(function(res) {
      res.setNgName(this.some(function(ngName) { return ngName.match(res) }))
    }),
  }

  var NgIds = {
    from: NgItems.createFactoryMethod(function(res) {
      res.setNgId(this.some(function(ngId) { return ngId.match(res) }))
    }),
  }

  var NgKorokoros = {
    from: NgItems.createFactoryMethod(function(res) {
      res.setNgKorokoro(this.some(function(ngKorokoro) { return ngKorokoro.match(res) }))
    }),
  }

  var NgIdTails = {
    from: NgItems.createFactoryMethod(function(res) {
      res.setNgIdTail(this.some(function(ngIdTail) { return ngIdTail.match(res) }))
    }),
  }

  var NgSlips = {
    from: NgItems.createFactoryMethod(function(res) {
      res.setNgSlip(this.some(function(ngSlip) { return ngSlip.match(res) }))
    }),
  }

  function ArrayStore(objParam) {
    Observable.call(this)
    this.getValue = objParam.getValue
    this.setValue = objParam.setValue
    this.key = objParam.key
    this.valueOf = objParam.valueOf
    this.arrayFrom = objParam.arrayFrom
    this.equals = objParam.equals
  }
  ArrayStore.prototype = Object.create(Observable.prototype)
  ArrayStore.prototype.constructor = ArrayStore
  ArrayStore.prototype.get = async function() {
    var values = JSON.parse(await this.getValue(this.key, '[]'))
    return this.arrayFrom(values.map(this.valueOf))
  }
  ArrayStore.prototype._set = async function(values) {
    await this.setValue(this.key, JSON.stringify(values))
  }
  ArrayStore.prototype.set = async function(values) {
    await this._set(values)
    this.fireEvent('changed', values)
  }
  ArrayStore.prototype.add = async function(value) {
    var addedValues = (await this.get()).concat(value)
    await this._set(addedValues)
    this.fireEvent('changed', addedValues)
  }
  ArrayStore.prototype.remove = async function(removedValue) {
    var filteredValues = (await this.get()).filter(function(value) {
      return !this.equals(removedValue, value)
    }, this)
    await this._set(filteredValues)
    this.fireEvent('changed', filteredValues)
  }
  ArrayStore.prototype.removeAll = async function() {
    await this.setValue(this.key, '[]')
    this.fireEvent('changed', this.arrayFrom([]))
  }

  var Config = (function(_super) {
    var identity = function(a) { return a }
    var Config = function(getValue, setValue) {
      _super.call(this)
      this._getValue = getValue
      this._setValue = setValue
      var o = function(key, valueOf, arrayFrom) {
        return {getValue, setValue, key, valueOf, arrayFrom, equals: equalObj}
      }
      this.ngWords = new ArrayStore(o('ngWords', NgWord.of, NgWords.from))
      this.ngIds = new ArrayStore(o('ngIds', NgId.of, NgIds.from))
      this.ngNames = new ArrayStore(o('ngNames', NgName.of, NgNames.from))
      this.ngKorokoros = new ArrayStore(o('ngKorokoros', NgKorokoro.of, NgKorokoros.from))
      this.threadHistories = new ArrayStore(o('threadHistories', identity, identity))
      this.ngIdTails = new ArrayStore(o('ngIdTails', NgIdTail.of, NgIdTails.from))
      this.ngSlips = new ArrayStore(o('ngSlips', NgSlip.of, NgSlips.from))
    }
    Config.prototype = Object.create(_super.prototype)
    Config.prototype.isPageCentering = async function() {
      return await this._getValue('pageCentering', true)
    }
    Config.prototype.setPageCentering = async function(pageCentering) {
      await this._setValue('pageCentering', pageCentering)
      this.fireEvent('pageCenteringChanged', pageCentering)
    }
    Config.prototype.getPageMaxWidth = async function() {
      return await this._getValue('pageMaxWidth', 600)
    }
    Config.prototype.setPageMaxWidth = async function(pageMaxWidth) {
      await this._setValue('pageMaxWidth', pageMaxWidth)
      this.fireEvent('pageMaxWidthChanged', pageMaxWidth)
    }
    Config.prototype.isNgVisible = async function() {
      return await this._getValue('ngVisible', false)
    }
    Config.prototype.setNgVisible = async function(ngVisible) {
      await this._setValue('ngVisible', ngVisible)
      this.fireEvent('ngVisibleChanged', ngVisible)
    }
    Config.prototype.getNgItemArrayStores = function() {
      return [
        this.ngWords,
        this.ngIds,
        this.ngNames,
        this.ngKorokoros,
        this.ngIdTails,
        this.ngSlips,
      ]
    }
    return Config
  })(Observable)

  var ThreadHistory = (function() {
    var removeCopyrightWarnings = function(s) {
      return s.replace(/\[転載禁止\]/g, '')
        .replace(/\[無断転載禁止\]/g, '')
        .replace(/©2ch.net/g, '')
        .trim()
    }
    function ThreadHistory(threadHistories, location, title) {
      this.threadHistories = threadHistories
      this.location = location
      this.title = removeCopyrightWarnings(title)
    }
    ThreadHistory.prototype.isValidLocation = function() {
      return /^\/test\/read\.cgi\/\w+\/\d+\/$/.test(this.location.pathname)
    }
    ThreadHistory.prototype.exists = async function() {
      return Boolean(await this._history())
    }
    ThreadHistory.prototype._url = function() {
      var l = this.location
      return `${l.protocol}//${l.host}${l.pathname}`
    }
    ThreadHistory.prototype._history = async function() {
      var u = this._url()
      return (await this.threadHistories.get()).find(function(h) { return h.url === u })
    }
    ThreadHistory.prototype.getResNum = async function() {
      if (this.isValidLocation() && await this.exists())
        return (await this._history()).resNum
      throw new Error('must be valid location and exists')
    }
    ThreadHistory.prototype._toObj = function(resNum) {
      return {url: this._url(), title: this.title, resNum}
    }
    ThreadHistory.prototype._removeOldAndAddNew = async function(old, resNum) {
      return (await this.threadHistories.get())
        .filter(not(this.threadHistories.equals.bind(null, old)))
        .concat(this._toObj(resNum))
    }
    ThreadHistory.prototype.setResNum = async function(resNum) {
      if (!this.isValidLocation()) return
      var old = await this._history()
      if (old) {
        if (old.resNum === resNum) return
        await this.threadHistories.set(await this._removeOldAndAddNew(old, resNum))
      } else {
        await this.threadHistories.add(this._toObj(resNum))
      }
    }
    return ThreadHistory
  })()

  var Thread = (function(_super) {
    var putAsArray = function(obj, key, value) {
      var array = obj[key]
      if (array) array.push(value); else obj[key] = [value]
      return obj
    }
    var putResById = function(obj, res) {
      return res.id ? putAsArray(obj, res.id, res) : obj
    }
    var putResByPassedAnchor = curry(function(res, obj, anchor) {
      return putAsArray(obj, anchor, res)
    })
    var putResByAnchor = function(obj, res) {
      return res.anchors.reduce(putResByPassedAnchor(res), obj)
    }
    var putResByNumber = function(obj, res) {
      obj[res.number] = res
      return obj
    }
    var putResByKorokoro = function(obj, res) {
      return res.korokoro ? putAsArray(obj, res.korokoro, res) : obj
    }
    var addNewChild = function(responses, addedResponses) {
      var all = responses.concat(addedResponses)
      var resNumToRes = all.reduce(putResByNumber, {})
      var addedAnchors = addedResponses.reduce(putResByAnchor, {})
      Object.keys(addedAnchors).forEach(function(anchor) {
        var r = resNumToRes[anchor]
        if (r) r.addChildren(addedAnchors[anchor])
      })
    }
    var addSameId = curry(function(idToRes, response) {
      var sameId = idToRes[response.id]
      if (sameId) response.addSameIdResponses(sameId)
    })
    var addNewSameId = function(responses, addedResponses) {
      responses.forEach(addSameId(addedResponses.reduce(putResById, {})))
      addedResponses.forEach(
        addSameId(responses.concat(addedResponses).reduce(putResById, {})))
    }
    var addSameKorokoro = curry(function(korokoroToRes, response) {
      var sameKorokoro = korokoroToRes[response.korokoro]
      if (sameKorokoro) response.addSameKorokoroResponses(sameKorokoro)
    })
    var addNewSameKorokoro = function(responses, addedResponses) {
      responses.forEach(
        addSameKorokoro(addedResponses.reduce(putResByKorokoro, {})))
      addedResponses.forEach(
        addSameKorokoro(responses.concat(addedResponses).reduce(putResByKorokoro, {})))
    }
    var Thread = function(config, boardId, threadNumber, threadHistory) {
      _super.call(this)
      this._responses = []
      this.boardId = boardId
      this.threadNumber = threadNumber
      this.config = config
      this.threadHistory = threadHistory
      this.newResCount = 0
      this._addEventListenersToConfig()
    }
    Thread.prototype = Object.create(_super.prototype)
    Thread.prototype._addEventListenersToConfig = function() {
      var listener = this._ngItemsChanged.bind(this)
      for (var s of this.config.getNgItemArrayStores())
        s.addEventListener('changed', listener)
    }
    Thread.prototype._hasBeenAddedResponses = function() {
      return Boolean(this._responses.length)
    }
    Thread.prototype._getNewResCountBy = async function(addedResCount) {
      if (this._hasBeenAddedResponses())
        return addedResCount
      if (this.threadHistory.isValidLocation() && await this.threadHistory.exists())
        return addedResCount - await this.threadHistory.getResNum()
      return 0
    }
    Thread.prototype.addResponses = async function(responses) {
      this.newResCount = await this._getNewResCountBy(responses.length)
      this._setNgToResponsesBy(await this._getAllNgItemsArray(), responses)
      addNewChild(this._responses, responses)
      addNewSameId(this._responses, responses)
      addNewSameKorokoro(this._responses, responses)
      ;[].push.apply(this._responses, responses)
      await this.threadHistory.setResNum(this._responses.length)
      this.fireEvent('responsesAdded', responses)
    }
    Thread.prototype._getAllNgItemsArray = function() {
      return Promise.all(this.config.getNgItemArrayStores().map(function(arrayStore) {
        return arrayStore.get()
      }))
    }
    Thread.prototype._setNgToResponsesBy = function(ngItemsArray, responses) {
      responses = responses || this._responses
      for (var ngItems of ngItemsArray) {
        var filteredNgItems = ngItems.filter(invoke('isValidFor', [this]))
        for (var res of responses) filteredNgItems.setNgTo(res)
      }
    }
    Thread.prototype.getLastResponseNumber = function() {
      var r = this._responses
      var last = r[r.length - 1]
      return last ? last.number : -1
    }
    Thread.prototype.addNgId = async function(jstTime, ngId) {
      await this.config.ngIds.add(new NgId(this.boardId, jstTime, ngId))
    }
    Thread.prototype._ngItemsChanged = function(ngItems) {
      this._setNgToResponsesBy([ngItems])
    }
    Thread.prototype.hasResponse = function(responseNumber) {
      return this._responses.some(function(r) {
        return r.number === responseNumber
      })
    }
    return Thread
  })(Observable)

  var ResponseView = (function() {
    var eventTypes = [
      'childrenAdded',
      'sameIdResponsesAdded',
      'sameKorokoroResponsesAdded',
      'ngChanged',
    ]
    var ResponseView = function(document, response, root) {
      this._doc = document
      this._response = response
      this._factory = new ResponseView.Factory(document, response, root)
      this.rootElement = this._factory.createResponseElement()
      this._childResponseViews = []
      this._sameIdResponseViews = []
      this._sameKorokoroResponseViews = []
      listeners.set(eventTypes, this)
      listeners.add(eventTypes, this, this._response)
      this._childNgChangedListener = this._childNgChanged.bind(this)
      this._addListenersToChildren(response.children)
    }
    ResponseView.new = curry(function(document, response) {
      return new ResponseView(document, response)
    })
    ResponseView.prototype._childrenAdded = function(addedChildren) {
      this._addListenersToChildren(addedChildren)
      this._updateResNumElem()
      this._appendAddedChildren(addedChildren)
    }
    ResponseView.prototype._sameIdResponsesAdded = function(addedSameId) {
      this._updateIdElem()
      this._appendAddedSameId(addedSameId)
    }
    ResponseView.prototype._sameKorokoroResponsesAdded = function(addedSameKorokoro) {
      this._updateKorokoroElem()
      this._appendAddedSameKorokoro(addedSameKorokoro)
    }
    ResponseView.prototype._ngChanged = function(ng) {
      if (ng) this._destroyAllResponseViews()
      this._replaceRootWithNew()
    }
    ResponseView.prototype._isChildrenVisibleAndAllNg = function() {
      return Boolean(this.rootElement.querySelector('.children'))
          && this._response.getNoNgChildren().length === 0
    }
    ResponseView.prototype._childNgChanged = function() {
      this._updateResNumElem()
      if (this._isChildrenVisibleAndAllNg()) this._destroyChildren()
    }
    ResponseView.prototype._addListenersToChildren = function(children) {
      children.forEach(invoke('addEventListener'
                            , ['ngChanged', this._childNgChangedListener]))
    }
    ResponseView.prototype._removeListenersFromChildren = function() {
      this._response.children
        .forEach(invoke('removeEventListener'
                      , ['ngChanged', this._childNgChangedListener]))
    }
    ResponseView.prototype._removeListenersFromResponse = function() {
      listeners.remove(eventTypes, this, this._response)
    }
    ResponseView.prototype._updateResNumElem = function() {
      if (this._response.isNg()) return
      var numElem = this.rootElement.querySelector('header .headerNumber')
      if (numElem) this._factory.updateHeaderNumClass(numElem)
    }
    ResponseView.prototype._appendAdded = function(added, propName, selector) {
      var views = added.map(ResponseView.new(this._doc))
      ;[].push.apply(this[propName], views)
      var toggled = this.rootElement.querySelector(selector)
      views.map(prop('rootElement')).forEach(toggled.appendChild.bind(toggled))
    }
    ResponseView.prototype._appendAddedChildren = function(addedChildren) {
      if (this._childResponseViews.length) {
        this._appendAdded(addedChildren, '_childResponseViews', '.children')
      }
    }
    ResponseView.prototype._appendAddedSameId = function(addedSameId) {
      if (this._sameIdResponseViews.length) {
        this._appendAdded(addedSameId, '_sameIdResponseViews', '.sameId')
      }
    }
    ResponseView.prototype._appendAddedSameKorokoro = function(addedSameKorokoro) {
      if (this._sameKorokoroResponseViews.length) {
        this._appendAdded(addedSameKorokoro, '_sameKorokoroResponseViews', '.sameKorokoro')
      }
    }
    ResponseView.prototype._getIdValElem = function() {
      return this.rootElement.querySelector('header .id .value')
    }
    ResponseView.prototype._updateIdValueElem = function() {
      this._factory.updateIdValClass(this._getIdValElem())
    }
    ResponseView.prototype._hasIdCountElem = function() {
      return Boolean(this.rootElement.querySelector('header .id .count'))
    }
    ResponseView.prototype._insertIdCountElem = function() {
      var e = this._getIdValElem()
      e.parentNode.insertBefore(this._factory.createIdCount(), e.nextSibling)
    }
    ResponseView.prototype._updateIdTotalElem = function() {
      var e = this.rootElement.querySelector('header .id .count .total')
      e.textContent = this._response.sameIdResponses.length
    }
    ResponseView.prototype._updateIdElem = function() {
      if (this._response.isNg()) return
      this._updateIdValueElem()
      if (this._hasIdCountElem()) {
        this._updateIdTotalElem()
      } else {
        this._insertIdCountElem()
      }
    }
    ResponseView.prototype._getKorokoroValueElem = function() {
      return this.rootElement.querySelector('header .korokoro .value')
    }
    ResponseView.prototype._insertKorokoroCountElem = function() {
      var e = this._getKorokoroValueElem()
      e.parentNode.insertBefore(this._factory.createKorokoroCount(), e.nextSibling)
    }
    ResponseView.prototype._updateKorokoroValueElem = function() {
      this._factory.updateKorokoroValClass(this._getKorokoroValueElem())
    }
    ResponseView.prototype._hasKorokoroCountElem = function() {
      return Boolean(this.rootElement.querySelector('header .korokoro .count'))
    }
    ResponseView.prototype._updateKorokoroTotalElem = function() {
      var totalElem = this.rootElement.querySelector('header .korokoro .count .total')
      totalElem.textContent = this._response.sameKorokoroResponses.length
    }
    ResponseView.prototype._updateKorokoroElem = function() {
      if (this._response.isNg()) return
      this._updateKorokoroValueElem()
      if (this._hasKorokoroCountElem())
        this._updateKorokoroTotalElem()
      else
        this._insertKorokoroCountElem()
    }
    ResponseView.prototype._replaceRootWithNew = function() {
      var old = this.rootElement
      this.rootElement = this._factory.createResponseElement()
      var p = old.parentNode
      if (p) p.replaceChild(this.rootElement, old)
    }
    ResponseView.prototype._destroyResponseViews = function(propName) {
      this[propName].forEach(function(v) {
        v._removeListenersFromResponse()
        v._removeListenersFromChildren()
        v._destroyAllResponseViews()
      })
      this[propName] = []
    }
    ResponseView.prototype._destroyAllResponseViews = function() {
      var propNames = [
        '_childResponseViews',
        '_sameIdResponseViews',
        '_sameKorokoroResponseViews',
      ]
      for (var n of propNames) this._destroyResponseViews(n)
    }
    ResponseView.prototype._newSubResponseViews = function(propName) {
      return this._response[propName].map(ResponseView.new(this._doc))
    }
    ResponseView.prototype._insertAfterContent = function(views, methodName) {
      var responseElems = views.map(prop('rootElement'))
      var toggledElem = this._factory[methodName](responseElems)
      var contentElem = this.rootElement.querySelector('.content')
      this.rootElement.insertBefore(toggledElem, contentElem.nextSibling)
    }
    ResponseView.prototype._destroyChildren = function() {
      this.rootElement.querySelector('.children').remove()
      this._destroyResponseViews('_childResponseViews')
    }
    ResponseView.prototype.toggleChildren = function() {
      if (this._response.children.length === 0) return
      var e = this.rootElement.querySelector('.children')
      if (e) {
        this._destroyChildren()
      } else {
        var views = this._newSubResponseViews('children')
        this._childResponseViews = views
        this._insertAfterContent(views, 'createChildrenElement')
      }
    }
    ResponseView.prototype.toggleSameId = function() {
      if (this._response.sameIdResponses.length < 2) return
      var e = this.rootElement.querySelector('.sameId')
      if (e) {
        e.remove()
        this._destroyResponseViews('_sameIdResponseViews')
      } else {
        var views = this._newSubResponseViews('sameIdResponses')
        this._sameIdResponseViews = views
        this._insertAfterContent(views, 'createSameIdElement')
      }
    }
    ResponseView.prototype.toggleSameKorokoro = function() {
      if (this._response.sameKorokoroResponses.length < 2) return
      var e = this.rootElement.querySelector('.sameKorokoro')
      if (e) {
        e.remove()
        this._destroyResponseViews('_sameKorokoroResponseViews')
      } else {
        var views = this._newSubResponseViews('sameKorokoroResponses')
        this._sameKorokoroResponseViews = views
        this._insertAfterContent(views, 'createSameKorokoroElement')
      }
    }
    ResponseView.prototype._getResponseViewByChild = function(elem, select) {
      var resViews = this._childResponseViews
        .concat(this._sameIdResponseViews)
        .concat(this._sameKorokoroResponseViews)
      for (var i = 0; i < resViews.length; i++) {
        var v = resViews[i]._getResponseViewBy(elem, select)
        if (v) return v
      }
      return null
    }
    ResponseView.prototype._getResponseViewBy = function(elem, select) {
      return select(this.rootElement) === elem
           ? this
           : this._getResponseViewByChild(elem, select)
    }
    ResponseView.prototype.getResponseViewByNumElem = function(numElem) {
      return this._getResponseViewBy(numElem, function(rootElem) {
        return rootElem.querySelector('header .headerNumber')
      })
    }
    ResponseView.prototype.getResponseViewByIdValElem = function(idValElem) {
      return this._getResponseViewBy(idValElem, function(rootElem) {
        var h = rootElem.querySelector('header')
        return h ? h.querySelector('.id .value') : null
      })
    }
    ResponseView.prototype.getResponseViewByKorokoroValElem = function(korokoroValElem) {
      return this._getResponseViewBy(korokoroValElem, function(rootElem) {
        return rootElem.querySelector('header .korokoro .value')
      })
    }
    return ResponseView
  })()
  ResponseView.Factory = (function() {
    var replaceMatchedByCreatedElem = function(textNode, regExp, createElem) {
      var document = textNode.ownerDocument
      var result = document.createDocumentFragment()
      var begin = 0
      var text = textNode.nodeValue
      for (var r; (r = regExp.exec(text));) {
        result.appendChild(document.createTextNode(text.slice(begin, r.index)))
        result.appendChild(createElem(r[0]))
        begin = regExp.lastIndex
      }
      result.appendChild(document.createTextNode(text.slice(begin)))
      result.normalize()
      return result
    }
    const hasAnchorAncestor = node => {
      for (let p = node.parentNode; p; p = p.parentNode)
        if (p.tagName === 'A')
          return true
      return false
    }
    const allTextNodesExceptInAnchor = root => {
      const d = root.ownerDocument
      const filter = {
        acceptNode(textNode) {
          return !hasAnchorAncestor(textNode)
        },
      }
      const i = d.createNodeIterator(root, NodeFilter.SHOW_TEXT, filter)
      const result = []
      let n = i.nextNode()
      while (n) {
        // document#createNodeIterator() に NodeFilter.SHOW_TEXT を渡しているのに、
        // NodeIterator#nextNode() からテキストノード以外のノードが返されてしまう。
        // テキストノードかどうかを調べることで対処する。
        // Google Chrome 60.0.3112.90（Official Build） （64 ビット）
        // Tampermonkey 4.3.6
        if (n.nodeType === Node.TEXT_NODE)
          result.push(n)
        n = i.nextNode()
      }
      return result
    }
    var replaceTextNodeIfMatched = function(node, regExp, createElem) {
      allTextNodesExceptInAnchor(node).forEach(function(textNode) {
        var newNode = replaceMatchedByCreatedElem(textNode, regExp, createElem)
        textNode.parentNode.replaceChild(newNode, textNode)
      }, this)
      return node
    }
    var setLinkType = function(link) {
      link.rel = 'noopener noreferrer'
    }
    var replaceOutsideLinkFromCushionToDirect = function(node) {
      ;[].filter.call(node.querySelectorAll('a'), function(a) {
        var c = a.textContent
        return c.startsWith('http://') || c.startsWith('https://')
      }).forEach(function(a) {
        a.href = a.textContent
        a.target = '_blank'
        setLinkType(a)
      })
    }
    var resAnchors = function(node) {
      return [].reduce.call(node.querySelectorAll('a'), function(result, a) {
        var r = /^>>(\d+)/.exec(a.textContent)
        if (r) result.push({anchor: a, responseNumber: parseInt(r[1])})
        return result
      }, [])
    }
    var replaceResAnchorWithTextNode = function(anchor) {
      var textNode = anchor.ownerDocument.createTextNode(anchor.textContent)
      anchor.parentNode.replaceChild(textNode, anchor)
    }
    var replaceUpwardResAnchorWithTextNode = function(node, responseNumber) {
      for (var resAnchor of resAnchors(node))
        if (resAnchor.responseNumber >= responseNumber)
          replaceResAnchorWithTextNode(resAnchor.anchor)
    }
    var setupResAnchorsClassAndDataset = function(node) {
      for (var resAnchor of resAnchors(node)) {
        resAnchor.anchor.classList.add('resAnchor')
        resAnchor.anchor.dataset.resNum = resAnchor.responseNumber
      }
    }
    var createLink = curry(function(document, matchedText) {
      var result = document.createElement('a')
      result.href = matchedText[0] === 'h' ? matchedText : 'h' + matchedText
      result.target = '_blank'
      setLinkType(result)
      result.textContent = matchedText
      return result
    })
    var Factory = function(document, response, root) {
      this._doc = document
      this._response = response
      this._root = root
    }
    Factory.prototype._createTotal = function(textContent) {
      var result = this._doc.createElement('span')
      result.className = 'total'
      result.textContent = textContent
      return result
    }
    Factory.prototype._createIndex = function(index) {
      return this._doc.createTextNode(`(${index + 1}/`)
    }
    Factory.prototype.updateIdValClass = function(idValElem) {
      var n = this._response.sameIdResponses.length
      var l = idValElem.classList
      if (n >= 2) l.add('sameIdExist')
      if (n >= 5) l.add('sameIdExist5')
    }
    Factory.prototype.updateKorokoroValClass = function(korokoroValElem) {
      if (this._response.sameKorokoroResponses.length >= 2)
        korokoroValElem.classList.add('sameKorokoroExist')
    }
    Factory.prototype._createVal = function(textContent) {
      var result = this._doc.createElement('span')
      result.className = 'value'
      result.textContent = textContent
      return result
    }
    Factory.prototype._createIdVal = function() {
      var result = this._createVal(this._response.id)
      this.updateIdValClass(result)
      return result
    }
    Factory.prototype._createNgButton = function(title, dataset) {
      var result = this._doc.createElement('span')
      result.className = 'ngButton'
      result.textContent = '[×]'
      result.title = title
      Object.assign(result.dataset, dataset)
      return result
    }
    Factory.prototype._createIdNgButton = function() {
      return this._createNgButton('NGID', {
        id: this._response.id,
        jstTime: this._response.jstTime,
      })
    }
    Factory.prototype._createCount = function(len, index) {
      var result = this._doc.createDocumentFragment()
      if (len >= 2) {
        var count = this._doc.createElement('span')
        count.className = 'count'
        count.appendChild(this._createIndex(index))
        count.appendChild(this._createTotal(len))
        count.appendChild(this._doc.createTextNode(')'))
        result.appendChild(count)
      }
      return result
    }
    Factory.prototype.createIdCount = function() {
      return this._createCount(this._response.sameIdResponses.length
                             , this._response.getIndexOfSameIdResponses())
    }
    Factory.prototype._createId = function() {
      var result = this._doc.createDocumentFragment()
      if (this._response.id) {
        var id = this._doc.createElement('span')
        id.className = 'id'
        id.appendChild(this._createIdVal())
        id.appendChild(this.createIdCount())
        id.appendChild(this._createIdNgButton())
        result.appendChild(id)
      }
      return result
    }
    Factory.prototype.updateHeaderNumClass = function(numElem) {
      var childNum = this._response.getNoNgChildren().length
      numElem.classList[childNum >= 1 ? 'add' : 'remove']('hasChild')
      numElem.classList[childNum >= 3 ? 'add' : 'remove']('hasChild3')
    }
    Factory.prototype._createHeaderNum = function() {
      var result = this._doc.createElement('span')
      result.className = 'headerNumber'
      this.updateHeaderNumClass(result)
      result.textContent = this._response.number
      return result
    }
    Factory.prototype.createKorokoroCount = function() {
      return this._createCount(this._response.sameKorokoroResponses.length
                             , this._response.getIndexOfSameKorokoroResponses())
    }
    Factory.prototype._createKorokoroVal = function() {
      var result = this._createVal(this._response.korokoro)
      this.updateKorokoroValClass(result)
      return result
    }
    Factory.prototype._createKorokoroNgButton = function() {
      return this._createNgButton('NGID(ﾜｯﾁｮｲ)', {
        korokoro: this._response.korokoro,
        jstTime: this._response.jstTime,
      })
    }
    Factory.prototype._createKorokoro = function() {
      var result = this._doc.createElement('span')
      result.className = 'korokoro'
      result.appendChild(this._createKorokoroVal())
      result.appendChild(this.createKorokoroCount())
      result.appendChild(this._createKorokoroNgButton())
      return result
    }
    Factory.prototype._setHeaderNameWithKorokoro = function(elem) {
      var n = this._response.name
      var k = this._response.korokoro
      var i = n.indexOf(k)
      if (i === -1) {
        elem.textContent = this._response.name
        return
      }
      elem.appendChild(this._doc.createTextNode(n.slice(0, i)))
      elem.appendChild(this._createKorokoro())
      elem.appendChild(this._doc.createTextNode(n.slice(i + k.length)))
    }
    Factory.prototype._createHeaderName = function() {
      var result = this._doc.createElement('span')
      result.className = 'name'
      if (this._response.korokoro)
        this._setHeaderNameWithKorokoro(result)
      else
        result.textContent = this._response.name
      return result
    }
    Factory.prototype._getHeaderMailText = function() {
      var m = this._response.mail
      return `[${m === 'sage' ? '↓' : m}]`
    }
    Factory.prototype._createHeaderMail = function() {
      var result = this._doc.createDocumentFragment()
      if (this._response.mail) {
        var e = this._doc.createElement('span')
        e.className = 'mail'
        e.textContent = this._getHeaderMailText()
        result.appendChild(e)
      }
      return result
    }
    Factory.prototype._createHeaderTime = function() {
      var result = this._doc.createDocumentFragment()
      if (!Number.isNaN(this._response.jstTime)) {
        var datetime = this._doc.createElement('time')
        datetime.textContent = this._response.getDateTimeString()
        result.appendChild(datetime)
      }
      return result
    }
    Factory.prototype._createHeader = function() {
      var result = this._doc.createElement('header')
      result.appendChild(this._createHeaderNum())
      result.appendChild(this._createHeaderName())
      result.appendChild(this._createHeaderMail())
      result.appendChild(this._createHeaderTime())
      result.appendChild(this._createId())
      return result
    }
    Factory.prototype._createContent = function() {
      var f = this._doc.createDocumentFragment()
      this._response.contentNodes
        .map(invoke('cloneNode', [true]))
        .forEach(function(n) { f.appendChild(n) })
      replaceOutsideLinkFromCushionToDirect(f)
      replaceUpwardResAnchorWithTextNode(f, this._response.number)
      setupResAnchorsClassAndDataset(f)
      replaceTextNodeIfMatched(f, /h?ttps?:\/\/\S+/g, createLink(this._doc))
      var result = this._doc.createElement('div')
      result.className = 'content'
      if (this._response.hasAsciiArt()) result.classList.add('asciiArt')
      result.appendChild(f)
      return result
    }
    Factory.prototype.createResponseElement = function() {
      var result = this._doc.createElement('article')
      if (this._response.isNg()) {
        result.classList.add('ng')
        result.appendChild(this._createNgResponse())
      } else {
        result.appendChild(this._createHeader())
        result.appendChild(this._createContent())
      }
      if (this._root) result.id = result.dataset.id = this._response.number
      return result
    }
    Factory.prototype._createNgResponse = function() {
      var text = this._response.number + ' あぼーん'
      return this._doc.createTextNode(text)
    }
    Factory.prototype._createSubView = function(className, elements) {
      var result = this._doc.createElement('div')
      result.className = className
      elements.forEach(result.appendChild.bind(result))
      return result
    }
    Factory.prototype.createChildrenElement = function(responseElements) {
      return this._createSubView('children', responseElements)
    }
    Factory.prototype.createSameIdElement = function(responseElements) {
      return this._createSubView('sameId', responseElements)
    }
    Factory.prototype.createSameKorokoroElement = function(responseElements) {
      return this._createSubView('sameKorokoro', responseElements)
    }
    return Factory
  })()

  var TableConfigViewHeader = (function() {
    var createRemoveAllButton = function(doc) {
      var result = doc.createElement('span')
      result.className = 'removeAllButton'
      result.textContent = '[すべて削除]'
      return result
    }
    var create = function(doc, text) {
      var result = doc.createElement('h2')
      result.appendChild(doc.createTextNode(text))
      result.appendChild(createRemoveAllButton(doc))
      return result
    }
    return {create}
  })()

  var NgItemAddP = (function() {
    function NgItemAddP(doc) {
      this.doc = doc
    }
    NgItemAddP.prototype._createOption = function(value, text) {
      var result = this.doc.createElement('option')
      result.value = value
      result.textContent = text
      return result
    }
    NgItemAddP.prototype._createTargetSelect = function() {
      var result = this.doc.createElement('select')
      result.appendChild(this._createOption('thread', 'このスレッド'))
      result.appendChild(this._createOption('board', 'この板'))
      result.appendChild(this._createOption('all', '全体'))
      return result
    }
    NgItemAddP.prototype._createNgTextInput = function() {
      var result = this.doc.createElement('input')
      result.className = 'ngTextInput'
      return result
    }
    NgItemAddP.prototype._createNgWordAddButton = function() {
      var result = this.doc.createElement('input')
      result.className = 'addButton'
      result.type = 'button'
      result.value = '追加'
      return result
    }
    NgItemAddP.prototype.elem = function() {
      var result = this.doc.createElement('p')
      result.className = 'add'
      result.appendChild(this._createTargetSelect())
      result.appendChild(this._createNgTextInput())
      result.appendChild(this._createNgWordAddButton())
      return result
    }
    NgItemAddP.create = function(doc) {
      return new NgItemAddP(doc).elem()
    }
    return NgItemAddP
  })()

  var Table = (function() {
    var addTH = curry(function(row, text) {
      var doc = row.ownerDocument
      var th = doc.createElement('th')
      th.textContent = text
      row.appendChild(th)
    })
    var isNode = function(v) {
      return Boolean(v && v.nodeType)
    }
    var addCell = function(row, child) {
      var result = row.insertCell()
      if (isNode(child))
        result.appendChild(child)
      else
        result.textContent = child
      return result
    }
    var addDelCell = function(row) {
      var result = addCell(row, '削除')
      result.className = 'removeButton'
      return result
    }
    function Table(o) {
      Object.assign(this, o)
    }
    Table.create = function(o) {
      return new Table(o).elem()
    }
    Table.prototype.setTHead = function(tHead) {
      this.tHeadTexts.forEach(addTH(tHead.insertRow()))
    }
    Table.prototype.addDelCell = function(tRow, rowDataObj) {
      var c = addDelCell(tRow)
      this.setDelCellDataset(c.dataset, rowDataObj)
    }
    Table.prototype.setTRow = function(tRow, rowDataObj) {
      for (var cellChild of this.cellChildrenOf(rowDataObj, this.doc))
        addCell(tRow, cellChild)
      this.addDelCell(tRow, rowDataObj)
    }
    Table.prototype.setTBody = function(tBody) {
      this.rowDataObjs.slice().reverse().forEach(function(rowDataObj) {
        this.setTRow(tBody.insertRow(), rowDataObj)
      }, this)
    }
    Table.prototype.elem = function() {
      var result = this.doc.createElement('table')
      this.setTHead(result.createTHead())
      this.setTBody(result.createTBody())
      return result
    }
    return Table
  })()

  var ConfigView = (function() {
    var ConfigView = function(document, config) {
      this._doc = document
      this._config = config
      this.rootElement = null
      listeners.set(this._eventTypes, this)
      listeners.add(this._eventTypes, this, config)
    }
    ConfigView.prototype._eventTypes = []
    ConfigView.prototype.createRootElem = async function() {
      return this.rootElement = await this._createRootElem()
    }
    ConfigView.prototype.destroy = function() {
      this.rootElement.remove()
      listeners.remove(this._eventTypes, this, this._config)
    }
    ConfigView.prototype._createRootElem = async function() {
      var result = this._doc.createElement('div')
      result.className = 'config'
      result.appendChild(await this._createRootChild())
      return result
    }
    ConfigView.prototype._createRootChild = async function() {
      throw new Error('ConfigView#_createRootChild() must be implemented')
    }

    ConfigView.createToggle = function(document, configViewConstructor) {
      var result = document.createElement('span')
      result.className = configViewConstructor.toggleClass
      result.textContent = configViewConstructor.toggleText
      return result
    }
    return ConfigView
  })()

  var ViewConfigView = (function(_super) {
    var ViewConfigView = function(document, config) {
      _super.call(this, document, config)
    }
    ViewConfigView.toggleText = '表示'
    ViewConfigView.toggleClass = 'viewToggle'
    ViewConfigView.prototype = Object.create(_super.prototype)
    ViewConfigView.prototype.constructor = ViewConfigView
    ViewConfigView.prototype._createCenteringP = async function() {
      var checkbox = this._doc.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = await this._config.isPageCentering()
      var label = this._doc.createElement('label')
      label.appendChild(checkbox)
      label.appendChild(this._doc.createTextNode('ページ中央に配置'))
      var result = this._doc.createElement('p')
      result.className = 'centering'
      result.appendChild(label)
      return result
    }
    ViewConfigView.prototype._createMaxWidthP = async function() {
      var input = this._doc.createElement('input')
      input.type = 'number'
      input.valueAsNumber = await this._config.getPageMaxWidth()
      var label = this._doc.createElement('label')
      label.appendChild(this._doc.createTextNode('最大幅'))
      label.appendChild(input)
      label.appendChild(this._doc.createTextNode('px'))
      var result = this._doc.createElement('p')
      result.className = 'maxWidth'
      result.appendChild(label)
      return result
    }
    ViewConfigView.prototype._createNgVisibleP = async function() {
      var checkbox = this._doc.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.checked = await this._config.isNgVisible()
      var label = this._doc.createElement('label')
      label.appendChild(checkbox)
      label.appendChild(this._doc.createTextNode('NG設定によるあぼーんを表示'))
      var result = this._doc.createElement('p')
      result.className = 'ngVisible'
      result.appendChild(label)
      return result
    }
    ViewConfigView.prototype._createRootChild = async function() {
      var h2 = this._doc.createElement('h2')
      h2.textContent = '表示'
      var result = this._doc.createElement('section')
      result.className = 'viewSection'
      result.appendChild(h2)
      result.appendChild(await this._createCenteringP())
      result.appendChild(await this._createMaxWidthP())
      result.appendChild(await this._createNgVisibleP())
      return result
    }
    ViewConfigView.prototype.isPageCenteringChecked = function() {
      return this.rootElement
        .querySelector('.viewSection .centering label input')
        .checked
    }
    ViewConfigView.prototype.isNgVisibleChecked = function() {
      return this.rootElement
        .querySelector('.viewSection .ngVisible label input')
        .checked
    }
    ViewConfigView.prototype.getPageMaxWidthValue = function() {
      return this.rootElement
        .querySelector('.viewSection .maxWidth label input')
        .valueAsNumber
    }
    return ViewConfigView
  })(ConfigView)

  var TableConfigView = (function(_super) {
    function TableConfigView(document, config) {
      _super.call(this, document, config)
      this._arrayStoreChangedListener = this._arrayStoreChanged.bind(this)
      this._getArrayStore()
        .addEventListener('changed', this._arrayStoreChangedListener)
    }
    TableConfigView.prototype = Object.create(_super.prototype)
    TableConfigView.prototype.constructor = TableConfigView
    TableConfigView.prototype.destroy = function() {
      _super.prototype.destroy.call(this)
      this._getArrayStore()
        .removeEventListener('changed', this._arrayStoreChangedListener)
    }
    TableConfigView.prototype._getTable = function() {
      return this.rootElement.querySelector('table')
    }
    TableConfigView.prototype._arrayStoreChanged = async function(array) {
      var newTable = await this._createTable(array)
      var oldTable = this._getTable()
      oldTable.parentNode.replaceChild(newTable, oldTable)
    }
    TableConfigView.prototype._getArrayStore = function() {
      throw new Error('TableConfigView#_getArrayStore() must be implemented')
    }
    TableConfigView.prototype._createTable = function() {
      throw new Error('TableConfigView#_createTable() must be implemented')
    }
    return TableConfigView
  })(ConfigView)

  var NgIdConfigView = (function(_super) {
    var NgIdConfigView = function(document, config) {
      _super.call(this, document, config)
    }
    NgIdConfigView.toggleText = 'NGID'
    NgIdConfigView.toggleClass = 'ngIdToggle'
    NgIdConfigView.prototype = Object.create(_super.prototype)
    NgIdConfigView.prototype.constructor = NgIdConfigView
    NgIdConfigView.prototype._getArrayStore = function() {
      return this._config.ngIds
    }
    NgIdConfigView.prototype._createTable = async function(ngIds) {
      var tHeadTexts = ['板', '有効日', 'ID', '']
      var rowDataObjs = ngIds || await this._config.ngIds.get()
      var cellChildrenOf = function(ngId) {
        return [ngId.boardId, ngId.getActiveDateString(), ngId.id]
      }
      var setDelCellDataset = function(dataset, ngId) {
        dataset.boardId = ngId.boardId
        dataset.activeDate = ngId.activeDate
        dataset.id = ngId.id
      }
      return Table.create({
        doc: this._doc,
        tHeadTexts,
        rowDataObjs,
        cellChildrenOf,
        setDelCellDataset,
      })
    }
    NgIdConfigView.prototype._createRootChild = async function() {
      var result = this._doc.createElement('section')
      result.className = 'ngIdSection'
      result.appendChild(TableConfigViewHeader.create(this._doc, 'NGID'))
      result.appendChild(await this._createTable())
      return result
    }
    return NgIdConfigView
  })(TableConfigView)

  var NgKorokoroConfigView = (function(_super) {
    var NgKorokoroConfigView = function(document, config) {
      _super.call(this, document, config)
    }
    NgKorokoroConfigView.toggleText = 'NGID(ﾜｯﾁｮｲ)'
    NgKorokoroConfigView.toggleClass = 'ngKorokoroToggle'
    NgKorokoroConfigView.prototype = Object.create(_super.prototype)
    NgKorokoroConfigView.prototype.constructor = NgKorokoroConfigView
    NgKorokoroConfigView.prototype._getArrayStore = function() {
      return this._config.ngKorokoros
    }
    NgKorokoroConfigView.prototype._createTable = async function(ngKorokoros) {
      var tHeadTexts = ['板', '有効期間', 'ID', '']
      var rowDataObjs = ngKorokoros || await this._getArrayStore().get()
      var cellChildrenOf = function(ngKorokoro) {
        return [
          ngKorokoro.boardId,
          ngKorokoro.getAvailablePeriodString(),
          ngKorokoro.korokoro,
        ]
      }
      var setDelCellDataset = function(dataset, ngKorokoro) {
        dataset.boardId = ngKorokoro.boardId
        dataset.startOfAvailablePeriod = ngKorokoro.startOfAvailablePeriod
        dataset.korokoro = ngKorokoro.korokoro
      }
      return Table.create({
        doc: this._doc,
        tHeadTexts,
        rowDataObjs,
        cellChildrenOf,
        setDelCellDataset,
      })
    }
    NgKorokoroConfigView.prototype._createRootChild = async function() {
      var result = this._doc.createElement('section')
      result.className = 'ngKorokoroSection'
      result.appendChild(TableConfigViewHeader.create(this._doc, 'NGID(ﾜｯﾁｮｲ)'))
      result.appendChild(await this._createTable())
      return result
    }
    return NgKorokoroConfigView
  })(TableConfigView)

  var BoundableNgItemConfigView = (function(_super) {
    var BoundableNgItemConfigView = function(document, config) {
      _super.call(this, document, config)
    }
    BoundableNgItemConfigView.prototype = Object.create(_super.prototype)
    BoundableNgItemConfigView.prototype.constructor = BoundableNgItemConfigView
    BoundableNgItemConfigView.prototype._createTable = async function(boundableNgItems) {
      var tHeadTexts = ['板', 'スレッド', this._getHeaderText(), '']
      var rowDataObjs = boundableNgItems || (await this._getArrayStore().get())
      var cellChildrenOf = function(ngItem) {
        return [ngItem.boardId, ngItem.threadNumber, this._getNgValueOf(ngItem)]
      }.bind(this)
      var setDelCellDataset = function(dataset, ngItem) {
        if (ngItem.boardId) dataset.boardId = ngItem.boardId
        if (ngItem.threadNumber) dataset.threadNumber = ngItem.threadNumber
        this._setNgValueToDataset(this._getNgValueOf(ngItem), dataset)
      }.bind(this)
      return Table.create({
        doc: this._doc,
        tHeadTexts,
        rowDataObjs,
        cellChildrenOf,
        setDelCellDataset,
      })
    }
    BoundableNgItemConfigView.prototype._createRootChild = async function() {
      var result = this._doc.createElement('section')
      result.className = this._getSectionClassName()
      result.appendChild(TableConfigViewHeader.create(this._doc, this._getHeaderText()))
      result.appendChild(NgItemAddP.create(this._doc))
      result.appendChild(await this._createTable())
      return result
    }
    BoundableNgItemConfigView.prototype._getNgTextInput = function() {
      return this.rootElement.querySelector('.add .ngTextInput')
    }
    BoundableNgItemConfigView.prototype.getNgTextInputValue = function() {
      return this._getNgTextInput().value.trim()
    }
    BoundableNgItemConfigView.prototype.clearNgTextInputValue = function() {
      this._getNgTextInput().value = ''
    }
    BoundableNgItemConfigView.prototype.getNgItemAddTarget = function() {
      return this.rootElement.querySelector('.add select').value
    }
    BoundableNgItemConfigView.prototype._getNgValueOf = function() {
      throw new Error('BoundableNgItemConfigView#_getNgValueOf(boundableNgItem) must be implemented')
    }
    BoundableNgItemConfigView.prototype._setNgValueToDataset = function() {
      throw new Error('BoundableNgItemConfigView#_setNgValueToDataset(ngValue, dataset) must be implemented')
    }
    BoundableNgItemConfigView.prototype._getSectionClassName = function() {
      throw new Error('BoundableNgItemConfigView#_getSectionClassName() must be implemented')
    }
    BoundableNgItemConfigView.prototype._getHeaderText = function() {
      throw new Error('BoundableNgItemConfigView#_getHeaderText() must be implemented')
    }
    return BoundableNgItemConfigView
  })(TableConfigView)

  var NgWordConfigView = (function(_super) {
    var NgWordConfigView = function(document, config) {
      _super.call(this, document, config)
    }
    NgWordConfigView.toggleText = 'NGワード'
    NgWordConfigView.toggleClass = 'ngWordToggle'
    NgWordConfigView.prototype = Object.create(_super.prototype)
    NgWordConfigView.prototype.constructor = NgWordConfigView
    NgWordConfigView.prototype._getArrayStore = function() {
      return this._config.ngWords
    }
    NgWordConfigView.prototype._getNgValueOf = function(ngWord) {
      return ngWord.ngWord
    }
    NgWordConfigView.prototype._setNgValueToDataset = function(ngValue, dataset) {
      dataset.ngWord = ngValue
    }
    NgWordConfigView.prototype._getSectionClassName = function() {
      return 'ngWordSection'
    }
    NgWordConfigView.prototype._getHeaderText = function() {
      return 'NGワード'
    }
    return NgWordConfigView
  })(BoundableNgItemConfigView)

  var NgNameConfigView = (function(_super) {
    var NgNameConfigView = function(document, config) {
      _super.call(this, document, config)
    }
    NgNameConfigView.toggleText = 'NGName'
    NgNameConfigView.toggleClass = 'ngNameToggle'
    NgNameConfigView.prototype = Object.create(_super.prototype)
    NgNameConfigView.prototype.constructor = NgNameConfigView
    NgNameConfigView.prototype._getArrayStore = function() {
      return this._config.ngNames
    }
    NgNameConfigView.prototype._getNgValueOf = function(ngName) {
      return ngName.ngName
    }
    NgNameConfigView.prototype._setNgValueToDataset = function(ngValue, dataset) {
      dataset.ngName = ngValue
    }
    NgNameConfigView.prototype._getSectionClassName = function() {
      return 'ngNameSection'
    }
    NgNameConfigView.prototype._getHeaderText = function() {
      return 'NGName'
    }
    return NgNameConfigView
  })(BoundableNgItemConfigView)

  var NgIdTailConfigView = (function(_super) {
    var NgIdTailConfigView = function(document, config) {
      _super.call(this, document, config)
    }
    NgIdTailConfigView.toggleText = 'NGID(末尾)'
    NgIdTailConfigView.toggleClass = 'ngIdTailToggle'
    NgIdTailConfigView.prototype = Object.create(_super.prototype)
    NgIdTailConfigView.prototype.constructor = NgIdTailConfigView
    NgIdTailConfigView.prototype._getArrayStore = function() {
      return this._config.ngIdTails
    }
    NgIdTailConfigView.prototype._getNgValueOf = function(ngIdTail) {
      return ngIdTail.ngIdTail
    }
    NgIdTailConfigView.prototype._setNgValueToDataset = function(ngValue, dataset) {
      dataset.ngIdTail = ngValue
    }
    NgIdTailConfigView.prototype._getSectionClassName = function() {
      return 'ngIdTailSection'
    }
    NgIdTailConfigView.prototype._getHeaderText = function() {
      return 'NGID(末尾)'
    }
    return NgIdTailConfigView
  })(BoundableNgItemConfigView)

  var NgSlipConfigView = (function(_super) {
    var textOf = function(type) {
      switch (type) {
        case 'id': return 'ID'
        case 'korokoro': return 'ID(ﾜｯﾁｮｲ)'
        default: throw new TypeError(String(type))
      }
    }
    var createOption = function(doc, value, text) {
      var result = doc.createElement('option')
      result.value = value
      result.textContent = text
      return result
    }
    var createTypeSelect = function(doc) {
      var result = doc.createElement('select')
      result.className = 'type'
      result.appendChild(createOption(doc, 'korokoro', 'ID(ﾜｯﾁｮｲ)'))
      result.appendChild(createOption(doc, 'id', 'ID'))
      return result
    }
    var createTargetSelect = function(doc) {
      var result = doc.createElement('select')
      result.className = 'target'
      result.appendChild(createOption(doc, 'thread', 'このスレッド'))
      result.appendChild(createOption(doc, 'board', 'この板'))
      return result
    }
    var createAddButton = function(doc) {
      var result = doc.createElement('input')
      result.className = 'addButton'
      result.type = 'button'
      result.value = 'NG'
      return result
    }
    var createInput = function(doc) {
      var result = doc.createElement('p')
      result.className = 'add'
      result.appendChild(createTargetSelect(doc))
      result.appendChild(doc.createTextNode('内で'))
      result.appendChild(createTypeSelect(doc))
      result.appendChild(doc.createTextNode('を持たないレスを'))
      result.appendChild(createAddButton(doc))
      return result
    }
    var NgSlipConfigView = function(document, config) {
      _super.call(this, document, config)
    }
    NgSlipConfigView.toggleText = 'NGSlip'
    NgSlipConfigView.toggleClass = 'ngSlipToggle'
    NgSlipConfigView.prototype = Object.create(_super.prototype)
    NgSlipConfigView.prototype.constructor = NgSlipConfigView
    NgSlipConfigView.prototype._getArrayStore = function() {
      return this._config.ngSlips
    }
    NgSlipConfigView.prototype._createTable = async function(ngSlips) {
      var tHeadTexts = ['板', 'スレッド', '対象', '']
      var rowDataObjs = ngSlips || await this._getArrayStore().get()
      var cellChildrenOf = function(ngSlip) {
        return [ngSlip.boardId, ngSlip.threadNumber, textOf(ngSlip.type)]
      }
      var setDelCellDataset = function(dataset, ngSlip) {
        dataset.boardId = ngSlip.boardId
        if (ngSlip.threadNumber) dataset.threadNumber = ngSlip.threadNumber
        dataset.type = ngSlip.type
      }
      return Table.create({
        doc: this._doc,
        tHeadTexts,
        rowDataObjs,
        cellChildrenOf,
        setDelCellDataset,
      })
    }
    NgSlipConfigView.prototype._createRootChild = async function() {
      var result = this._doc.createElement('section')
      result.className = 'ngSlipSection'
      result.appendChild(TableConfigViewHeader.create(this._doc, 'NGSlip'))
      result.appendChild(createInput(this._doc))
      result.appendChild(await this._createTable())
      return result
    }
    NgSlipConfigView.prototype.getNgItemAddTarget = function() {
      return this.rootElement.querySelector('.target').value
    }
    NgSlipConfigView.prototype.getNgSlipType = function() {
      return this.rootElement.querySelector('.type').value
    }
    return NgSlipConfigView
  })(TableConfigView)

  var NgConfigView = (function(_super) {
    function NgConfigView(document, config) {
      _super.call(this, document, config)
      this.configView = null
    }
    NgConfigView.toggleText = 'NG設定'
    NgConfigView.toggleClass = 'ngToggle'
    NgConfigView.prototype = Object.create(_super.prototype)
    NgConfigView.prototype.constructor = NgConfigView
    NgConfigView.prototype.destroy = function() {
      _super.prototype.destroy.call(this)
      if (this.configView) this.configView.destroy()
    }
    NgConfigView.prototype._createRootChild = function() {
      var ngToggleBar = this._doc.createElement('div')
      ngToggleBar.className = 'ngToggleBar'
     ;[ NgWordConfigView,
        NgNameConfigView,
        NgIdConfigView,
        NgKorokoroConfigView,
        NgIdTailConfigView,
        NgSlipConfigView,
      ].forEach(function(constructor) {
        var toggle = ConfigView.createToggle(this._doc, constructor)
        ngToggleBar.appendChild(toggle)
      }, this)
      var result = this._doc.createElement('section')
      result.className = 'ngSection'
      result.appendChild(ngToggleBar)
      return result
    }
    NgConfigView.prototype._addConfigViewOf = async function(constructor) {
      this.configView = new constructor(this._doc, this._config)
      this.rootElement
        .querySelector('.ngSection')
        .appendChild(await this.configView.createRootElem())
      var toggle = this.rootElement
        .querySelector(`.ngToggleBar .${constructor.toggleClass}`)
      toggle.textContent = constructor.toggleText
      toggle.classList.add('isSelected')
    }
    NgConfigView.prototype._deleteConfigView = function() {
      this.configView.destroy()
      var toggle = this.rootElement
        .querySelector(`.ngToggleBar .${this.configView.constructor.toggleClass}`)
      toggle.textContent = this.configView.constructor.toggleText
      toggle.classList.remove('isSelected')
      this.configView = null
    }
    NgConfigView.prototype._toggleConfigViewOf = async function(constructor) {
      if (this.configView) {
        var replace = !(this.configView instanceof constructor)
        this._deleteConfigView()
        if (replace) {
          await this._addConfigViewOf(constructor)
        }
      } else {
        await this._addConfigViewOf(constructor)
      }
    }
    NgConfigView.prototype.toggleNgWordConfig = async function() {
      await this._toggleConfigViewOf(NgWordConfigView)
    }
    NgConfigView.prototype.toggleNgNameConfig = async function() {
      await this._toggleConfigViewOf(NgNameConfigView)
    }
    NgConfigView.prototype.toggleNgIdConfig = async function() {
      await this._toggleConfigViewOf(NgIdConfigView)
    }
    NgConfigView.prototype.toggleNgKorokoroConfig = async function() {
      await this._toggleConfigViewOf(NgKorokoroConfigView)
    }
    NgConfigView.prototype.toggleNgIdTailConfig = async function() {
      await this._toggleConfigViewOf(NgIdTailConfigView)
    }
    NgConfigView.prototype.toggleNgSlipConfig = async function() {
      await this._toggleConfigViewOf(NgSlipConfigView)
    }
    NgConfigView.prototype.getNgTextInputValue = function() {
      return this.configView.getNgTextInputValue()
    }
    NgConfigView.prototype.clearNgTextInputValue = function() {
      this.configView.clearNgTextInputValue()
    }
    NgConfigView.prototype.getNgItemAddTarget = function() {
      return this.configView.getNgItemAddTarget()
    }
    NgConfigView.prototype.getNgSlipType = function() {
      return this.configView.getNgSlipType()
    }
    return NgConfigView
  })(ConfigView)

  var ThreadHistoryConfigView = (function(_super) {
    var ThreadHistoryConfigView = function(document, config) {
      _super.call(this, document, config)
    }
    ThreadHistoryConfigView.toggleText = '履歴'
    ThreadHistoryConfigView.toggleClass = 'threadHistoryToggle'
    ThreadHistoryConfigView.prototype = Object.create(_super.prototype)
    ThreadHistoryConfigView.prototype.constructor = ThreadHistoryConfigView
    ThreadHistoryConfigView.prototype._getArrayStore = function() {
      return this._config.threadHistories
    }
    ThreadHistoryConfigView.prototype._createTable = async function(threadHistories) {
      var tHeadTexts = ['タイトル', 'レス', '']
      var rowDataObjs = threadHistories || await this._getArrayStore().get()
      var cellChildrenOf = function(threadHistory, doc) {
        var a = doc.createElement('a')
        a.href = threadHistory.url
        a.textContent = threadHistory.title
        return [a, threadHistory.resNum]
      }
      var setDelCellDataset = function(dataset, threadHistory) {
        dataset.url = threadHistory.url
        dataset.title = threadHistory.title
        dataset.resNum = threadHistory.resNum
      }
      return Table.create({
        doc: this._doc,
        tHeadTexts,
        rowDataObjs,
        cellChildrenOf,
        setDelCellDataset,
      })
    }
    ThreadHistoryConfigView.prototype._createRootChild = async function() {
      var result = this._doc.createElement('section')
      result.className = 'threadHistorySection'
      result.appendChild(TableConfigViewHeader.create(this._doc, '履歴'))
      result.appendChild(await this._createTable())
      return result
    }
    return ThreadHistoryConfigView
  })(TableConfigView)

  var ThreadView = (function() {
    var createTopBar = function(document) {
      var createToggle = ConfigView.createToggle
      var result = document.createElement('div')
      result.className = 'topBar'
      result.appendChild(createToggle(document, NgConfigView))
      result.appendChild(createToggle(document, ViewConfigView))
      result.appendChild(createToggle(document, ThreadHistoryConfigView))
      return result
    }
    var createBottomBar = function(document) {
      var reloadButton = document.createElement('input')
      reloadButton.type = 'button'
      reloadButton.value = '新着レスの取得'
      reloadButton.className = 'reloadButton'
      var reloadMessage = document.createElement('span')
      reloadMessage.className = 'reloadMessage'
      var result = document.createElement('div')
      result.className = 'bottomBar'
      result.appendChild(reloadButton)
      result.appendChild(reloadMessage)
      return result
    }
    var createRoot = function(document) {
      var main = document.createElement('div')
      main.className = 'main'
      var result = document.createElement('div')
      result.className = 'threadView'
      result.appendChild(createTopBar(document))
      result.appendChild(main)
      result.appendChild(createBottomBar(document))
      return result
    }
    var ThreadView = function(document, thread) {
      this.doc = document
      this._thread = thread
      this.rootElement = createRoot(document)
      this._responseViews = []
      this.configView = null
      this.responsePostForm = null
      thread.addEventListener('responsesAdded', this._responsesAdded.bind(this))
      thread.config.addEventListener('pageCenteringChanged'
                                   , this.setPageCentering.bind(this))
      thread.config.addEventListener('pageMaxWidthChanged'
                                   , this._updateStyle.bind(this))
      thread.config.addEventListener('ngVisibleChanged'
                                   , this._updateStyle.bind(this))
    }
    ThreadView.prototype.getReloadButton = function() {
      return this.rootElement.querySelector('.reloadButton')
    }
    ThreadView.prototype.getReloadMessageElement = function() {
      return this.rootElement.querySelector('.reloadMessage')
    }
    ThreadView.prototype._getTopBar = function() {
      return this.rootElement.querySelector('.topBar')
    }
    ThreadView.prototype.replace = function(threadRootElement) {
      var p = threadRootElement.parentNode
      p.replaceChild(this.rootElement, threadRootElement)
    }
    ThreadView.prototype.disableReload = function() {
      this.rootElement.querySelector('.bottomBar').remove()
    }
    ThreadView.prototype._createResponseViews = function(responses) {
      return responses.map(function(r) {
        return new ResponseView(this.doc, r, true)
      }, this)
    }
    ThreadView.prototype._getMainElement = function() {
      return this.rootElement.querySelector('.main')
    }
    ThreadView.prototype._addResponseViewsToMainElement = function(views) {
      var main = this._getMainElement()
      views.map(prop('rootElement')).forEach(main.appendChild.bind(main))
    }
    ThreadView.prototype._getNewResponseBar = function() {
      return this.rootElement.querySelector('#new')
    }
    ThreadView.prototype._removeNewResponseBar = function() {
      var e = this._getNewResponseBar()
      if (e) e.remove()
    }
    ThreadView.prototype._addNewResponseBarIfRequired = function() {
      var newResCount = this._thread.newResCount
      if (newResCount === 0) return
      const newResBarText = this.doc.createElement('p')
      newResBarText.textContent = `${newResCount} 件の新着レス`
      var newResBar = this.doc.createElement('div')
      newResBar.id = 'new'
      newResBar.appendChild(newResBarText)
      var views = this._responseViews
      var e = views[views.length - newResCount].rootElement
      e.parentNode.insertBefore(newResBar, e)
    }
    ThreadView.prototype._scrollToNewResponseBar = function() {
      if (!this._getNewResponseBar()) return
      this.doc.location.hash = ''
      this.doc.location.hash = '#new'
    }
    ThreadView.prototype._responsesAdded = function(addedResponses) {
      var views = this._createResponseViews(addedResponses)
      ;[].push.apply(this._responseViews, views)
      this._addResponseViewsToMainElement(views)
      this._removeNewResponseBar()
      this._addNewResponseBarIfRequired()
      this._scrollToNewResponseBar()
    }
    ThreadView.prototype._toggleSubView = function(getView, toggle) {
      for (var i = 0; i < this._responseViews.length; i++) {
        var v = getView(this._responseViews[i])
        if (v) {
          toggle(v)
          break
        }
      }
    }
    ThreadView.prototype.toggleResponseChildren = function(numElem) {
      this._toggleSubView(invoke('getResponseViewByNumElem', [numElem])
                        , invoke('toggleChildren', []))
    }
    ThreadView.prototype.toggleSameIdResponses = function(idValElem) {
      this._toggleSubView(invoke('getResponseViewByIdValElem', [idValElem])
                        , invoke('toggleSameId', []))
    }
    ThreadView.prototype.toggleSameKorokoroResponses = function(korokoroValElem) {
      this._toggleSubView(invoke('getResponseViewByKorokoroValElem', [korokoroValElem])
                        , invoke('toggleSameKorokoro', []))
    }
    ThreadView.prototype._removeConfigView = function(constructor) {
      var v = this.configView
      if (!v) return true
      this.configView = null
      v.destroy()
      var toggle = this.rootElement
        .querySelector(`.topBar .${v.constructor.toggleClass}`)
      toggle.textContent = v.constructor.toggleText
      toggle.classList.remove('isSelected')
      return !(v instanceof constructor)
    }
    ThreadView.prototype._addConfigView = async function(constructor) {
      this.configView = new constructor(this.doc, this._thread.config)
      this._getTopBar().appendChild(await this.configView.createRootElem())
      var toggle = this.rootElement
        .querySelector(`.topBar .${constructor.toggleClass}`)
      toggle.textContent = constructor.toggleText
      toggle.classList.add('isSelected')
    }
    ThreadView.prototype._toggleConfig = async function(constructor) {
      if (this._removeConfigView(constructor)) await this._addConfigView(constructor)
    }
    ThreadView.prototype.toggleNgConfig = async function() {
      await this._toggleConfig(NgConfigView)
    }
    ThreadView.prototype.toggleViewConfig = async function() {
      await this._toggleConfig(ViewConfigView)
    }
    ThreadView.prototype.toggleNgWordConfig = function() {
      if (!(this.configView instanceof NgConfigView)) throw new Error()
      this.configView.toggleNgWordConfig()
    }
    ThreadView.prototype.toggleNgNameConfig = function() {
      if (!(this.configView instanceof NgConfigView)) throw new Error()
      this.configView.toggleNgNameConfig()
    }
    ThreadView.prototype.toggleNgIdConfig = function() {
      if (!(this.configView instanceof NgConfigView)) throw new Error()
      this.configView.toggleNgIdConfig()
    }
    ThreadView.prototype.toggleNgKorokoroConfig = function() {
      if (!(this.configView instanceof NgConfigView)) throw new Error()
      this.configView.toggleNgKorokoroConfig()
    }
    ThreadView.prototype.toggleNgIdTailConfig = function() {
      if (!(this.configView instanceof NgConfigView)) throw new Error()
      this.configView.toggleNgIdTailConfig()
    }
    ThreadView.prototype.toggleNgSlipConfig = function() {
      if (!(this.configView instanceof NgConfigView)) throw new Error()
      this.configView.toggleNgSlipConfig()
    }
    ThreadView.prototype.toggleThreadHistoryConfig = async function() {
      await this._toggleConfig(ThreadHistoryConfigView)
    }
    ThreadView.prototype.close = function() {
      if (this.responsePostForm) this.responsePostForm.remove()
      this.responsePostForm = null
      this.disableReload()
    }
    ThreadView.prototype.setPageCentering = function(pageCentering) {
      var methodName = pageCentering ? 'add' : 'remove'
      this.doc.documentElement.classList[methodName]('centering')
    }
    ThreadView.prototype.addStyle = async function() {
      var e = this.doc.createElement('style')
      e.id = 'threadViewerStyle'
      e.textContent = await this._getStyleText()
      this.doc.head.appendChild(e)
    }
    ThreadView.prototype._updateStyle = async function() {
      this.doc.getElementById('threadViewerStyle')
        .textContent = await this._getStyleText()
    }
    ThreadView.prototype._getNgVisibleStyle = async function() {
      return await this._thread.config.isNgVisible()
           ? ''
           : '.threadView .main article.ng { display: none; }'
    }
    ThreadView.prototype._getStyleText = async function() {
      return `
body {
  font-family: initial;
  font-size: initial;
  line-height: initial;
  color: initial;
  background-color: rgb(239, 239, 239);
  margin: 8px;
}
.navbar-fixed-top, .navbar-fixed-bottom {
  position: absolute;
}
.container_body {
  min-width: initial;
  left: initial;
  position: initial;
  width: initial;
  max-width: initial;
  margin-right: initial;
  margin-left: initial;
  padding-left: initial;
  padding-right: initial;
  background: initial;
}
.escaped {
  background-color: rgb(239, 239, 239);
}
html.centering {
  max-width: ${await this._thread.config.getPageMaxWidth()}px;
  margin: 0 auto;
}
.threadView,
.post_hover {
  line-height: 1.5em;
}
.threadView .topBar {
  position: sticky;
  top: -1px;
  background-color: rgb(239, 239, 239);
}
${await this._getNgVisibleStyle()}
.threadView .main article header,
.threadView .topBar .config table .removeButton,
.threadView .topBar .config .threadHistorySection table th:nth-child(2),
.threadView .main article header time,
.threadView .main article header .id {
  white-space: nowrap;
}
.threadView .main article header .name,
.post_hover header .name {
  color: green;
  font-weight: bold;
}
.threadView .topBar .ngToggle,
.threadView .topBar .ngWordToggle,
.threadView .topBar .ngNameToggle,
.threadView .topBar .ngIdToggle,
.threadView .topBar .ngKorokoroToggle,
.threadView .topBar .ngIdTailToggle,
.threadView .topBar .ngSlipToggle,
.threadView .topBar .viewToggle,
.threadView .topBar .threadHistoryToggle {
  margin-right: 0.5em;
  display: inline-block;
  height: 1.5em;
}
.threadView .main article header .name,
.threadView .main article header time,
.threadView .main article header .id,
.post_hover header .name,
.post_hover header time,
.post_hover header .id {
  margin-left: 0.5em;
}
.threadView .main article header .headerNumber.hasChild,
.threadView .main article header .id .value.sameIdExist,
.threadView .main article header .id .ngButton,
.threadView .main article header .korokoro .value.sameKorokoroExist,
.threadView .main article header .korokoro .ngButton,
.threadView .topBar .ngToggle,
.threadView .topBar .viewToggle,
.threadView .topBar .ngIdToggle,
.threadView .topBar .ngWordToggle,
.threadView .topBar .ngNameToggle,
.threadView .topBar .ngKorokoroToggle,
.threadView .topBar .ngIdTailToggle,
.threadView .topBar .ngSlipToggle,
.threadView .topBar .threadHistoryToggle,
.threadView .topBar .config h2 .removeAllButton,
.threadView .topBar .config table .removeButton {
  cursor: pointer;
  text-decoration: underline;
}
.threadView .topBar .ngToggle.isSelected,
.threadView .topBar .viewToggle.isSelected,
.threadView .topBar .ngIdToggle.isSelected,
.threadView .topBar .ngWordToggle.isSelected,
.threadView .topBar .ngNameToggle.isSelected,
.threadView .topBar .ngKorokoroToggle.isSelected,
.threadView .topBar .ngIdTailToggle.isSelected,
.threadView .topBar .ngSlipToggle.isSelected,
.threadView .topBar .threadHistoryToggle.isSelected {
  background-color: black;
  color: white;
}
.threadView .main article header .headerNumber.hasChild3,
.threadView .main article header .id .value.sameIdExist5 {
  font-weight: bold;
  color: red;
}
.threadView .main article .content,
.post_hover .content {
  margin: 0 0 1em 1em;
}
.threadView .main article .content a,
.post_hover .content a {
  color: blue;
  text-decoration: underline !important;
}
.threadView .main article .content a:visited,
.post_hover .content a:visited {
  color: purple;
}
.threadView .main article .content.asciiArt,
.post_hover .content.asciiArt {
  white-space: nowrap;
  /* https://ja.wikipedia.org/wiki/アスキーアート */
  font-family: IPAMonaPGothic, "IPA モナー Pゴシック", Monapo, Mona, "MS PGothic", "ＭＳ Ｐゴシック", sans-serif;
  font-size: 16px;
  line-height: 18px;
}
.threadView .main article .sameId,
.threadView .main article .children,
.threadView .main article .sameKorokoro {
  border-top: solid black thin;
  border-left: solid black thin;
  padding: 5px 0 0 5px;
}
.post_hover header .id .ngButton,
.post_hover header .korokoro .ngButton,
.post_hover .sameId,
.post_hover .children,
.post_hover .sameKorokoro {
  display: none;
}
.threadView .main article .sameId > article > header .id .value,
.threadView .main article .sameKorokoro > article > header .korokoro .value {
  color: black;
  background-color: yellow;
}
.threadView .main article.ng,
.threadView .main article header .name,
.threadView .main article header .mail,
.threadView .main article header time,
.threadView .main article header .id,
.post_hover header .name,
.post_hover header .mail,
.post_hover header time,
.post_hover header .id,
.threadView .topBar .config h2 .removeAllButton {
  font-size: smaller;
}
.threadView .topBar .config {
  border: solid black thin;
  padding: 0 0.5em;
}
.threadView .topBar .config h2 {
  font-size: medium;
}
.threadView .topBar .config table {
  border-collapse: collapse;
}
.threadView .topBar .config table th,
.threadView .topBar .config table td {
  border: solid thin black;
  line-height: 1.5em;
  padding: 0 0.5em;
}
.threadView .topBar .config .ngWordSection table td:nth-child(3),
.threadView .topBar .config .ngNameSection table td:nth-child(3),
.threadView .topBar .config .threadHistorySection table td:nth-child(1) {
  word-break: break-all;
}
.threadView .topBar .config .threadHistorySection table td:nth-child(2) {
  text-align: right;
}
.threadView .topBar .config .viewSection .maxWidth {
  margin-left: 2em;
}
.threadView .bottomBar {
  padding: 1em 0;
}
.postTarget {
  width: 100%;
}
.postTarget.loading {
  display: none;
}
#new {
  padding-top: 3em;
}
#new > p {
  background-color: lightblue;
  padding-left: 0.5em;
}
.threadView .topBar .config .threadHistorySection a:link,
.threadView .topBar .config .threadHistorySection a:visited {
  color: black;
  text-decoration: none;
}
.threadView .topBar .config .threadHistorySection a:hover {
  color: purple;
  text-decoration: underline;
}
.threadView .topBar .viewToggle.isSelected ~ .config,
.threadView .topBar .threadHistoryToggle.isSelected ~ .config {
  max-height: calc(90vh - 1.5em);
  overflow: auto;
}
.threadView .topBar .ngToggle.isSelected ~ .config .ngSection .config {
  max-height: calc(90vh - 1.5em - 1.5em);
  overflow: auto;
}
`
    }
    return ThreadView
  })()

  var ResponsePostForm = (function(_super) {
    var ResponsePostForm = function(form) {
      _super.call(this)
      this._form = this._initForm(form)
      this._progress = this._createProgress()
      this._target = null
    }
    ResponsePostForm.prototype = Object.create(_super.prototype)
    ResponsePostForm.prototype._initForm = function(form) {
      form.target = 'postTarget'
      form.addEventListener('submit', this._formSubmitted.bind(this))
      return form
    }
    ResponsePostForm.prototype._getDoc = function() {
      return this._form.ownerDocument
    }
    ResponsePostForm.prototype._createProgress = function() {
      var result = this._getDoc().createElement('p')
      result.textContent = '書き込み中...'
      return result
    }
    ResponsePostForm.prototype._insertProgress = function() {
      var f = this._form
      f.parentNode.insertBefore(this._progress, f.nextSibling)
    }
    ResponsePostForm.prototype._createTarget = function() {
      var result = this._getDoc().createElement('iframe')
      result.name = this._form.target
      result.className = 'postTarget loading'
      result.addEventListener('load', this._targetLoaded.bind(this))
      return result
    }
    ResponsePostForm.prototype._hideOrCreateTarget = function() {
      if (this._target) {
        this._target.classList.add('loading')
      } else {
        this._target = this._createTarget()
        var p = this._progress
        p.parentNode.insertBefore(this._target, p.nextSibling)
      }
    }
    ResponsePostForm.prototype._formSubmitted = function() {
      this._form.submit.disabled = true
      this._insertProgress()
      this._hideOrCreateTarget()
    }
    ResponsePostForm.prototype._getTargetLocation = function() {
      return this._target.contentDocument.location.toString()
    }
    ResponsePostForm.prototype._isPostDone = function() {
      return this._target.contentDocument.title.indexOf('書きこみました') >= 0
    }
    ResponsePostForm.prototype._targetLoaded = function() {
      if (this._getTargetLocation() === 'about:blank') return
      this._form.submit.disabled = false
      this._progress.remove()
      if (this._isPostDone()) {
        this._target.remove()
        this._target = null
        this._form.MESSAGE.value = ''
        this.fireEvent('postDone')
      } else {
        this._target.classList.remove('loading')
      }
    }
    ResponsePostForm.prototype.remove = function() {
      ;[this._form, this._progress, this._target]
        .filter(Boolean)
        .forEach(invoke('remove', []))
    }
    return ResponsePostForm
  })(Observable)

  var ThreadController = (function() {
    var ThreadController = function(thread, threadView) {
      this.thread = thread
      this.threadView = threadView
    }
    ThreadController.prototype.addCallback = function() {
      var r = this.threadView.rootElement
      r.addEventListener('click', this.callback.bind(this))
      r.addEventListener('keydown', this.keydownCallback.bind(this))
      r.addEventListener('change', this.changeCallback.bind(this))
    }
    ThreadController.prototype._getBaseURL = function() {
      const l = this.threadView.doc.location
      const p = l.pathname
      return `${l.protocol}//${l.host}${p.slice(0, p.lastIndexOf('/') + 1)}`
    }
    ThreadController.prototype.requestNewResponses = function() {
      this.threadView.getReloadButton().disabled = true
      this.threadView.getReloadMessageElement().textContent = ''
      var _this = this
      new ResponseRequest()
        .send(this._getBaseURL()
            , this.thread.getLastResponseNumber() + 1)
        .then(function(result) {
          _this.thread.addResponses(result.responses.map(Response.of))
          if (result.threadClosed) _this.threadView.close()
        })
        .catch(function(error) {
          _this.threadView.getReloadMessageElement().textContent = error
        })
        .then(function() {
          _this.threadView.getReloadButton().disabled = false
        })
    }
    ThreadController.prototype._addBoundableNgItem = function(o) {
      var view = this.threadView.configView
      var val = view.getNgTextInputValue()
      if (!val) return
      var boardId = view.getNgItemAddTarget() !== 'all'
                  ? this.thread.boardId : undefined
      var threadNumber = view.getNgItemAddTarget() === 'thread'
                       ? this.thread.threadNumber : undefined
      o.arrayStore(this.thread.config)
        .add(o.boundableNgItem(val, boardId, threadNumber))
      view.clearNgTextInputValue()
    }
    ThreadController.prototype._addNgWord = function() {
      this._addBoundableNgItem({
        arrayStore(config) {
          return config.ngWords
        },
        boundableNgItem(val, boardId, threadNumber) {
          return new NgWord(val, boardId, threadNumber)
        },
      })
    }
    ThreadController.prototype._addNgName = function() {
      this._addBoundableNgItem({
        arrayStore(config) {
          return config.ngNames
        },
        boundableNgItem(val, boardId, threadNumber) {
          return new NgName(val, boardId, threadNumber)
        },
      })
    }
    ThreadController.prototype._addNgIdTail = function() {
      this._addBoundableNgItem({
        arrayStore(config) {
          return config.ngIdTails
        },
        boundableNgItem(val, boardId, threadNumber) {
          return new NgIdTail(val, boardId, threadNumber)
        },
      })
    }
    ThreadController.prototype._addNgKorokoro = function(target) {
      var s = target.dataset
      this.thread.config.ngKorokoros.add(
        new NgKorokoro(this.thread.boardId, s.jstTime, s.korokoro))
    }
    ThreadController.prototype._removeNgWord = function(target) {
      this.thread.config.ngWords.remove(NgWord.of(target.dataset))
    }
    ThreadController.prototype._removeNgName = function(target) {
      this.thread.config.ngNames.remove(NgName.of(target.dataset))
    }
    ThreadController.prototype._addNgId = function(target) {
      this.thread.addNgId(target.dataset.jstTime, target.dataset.id)
    }
    ThreadController.prototype._removeNgId = function(target) {
      this.thread.config.ngIds.remove(NgId.of(target.dataset))
    }
    ThreadController.prototype._removeNgKorokoro = function(target) {
      this.thread.config.ngKorokoros.remove(NgKorokoro.of(target.dataset))
    }
    ThreadController.prototype._removeNgIdTail = function(target) {
      this.thread.config.ngIdTails.remove(NgIdTail.of(target.dataset))
    }
    ThreadController.prototype._removeThreadHistory = function(target) {
      this.thread.config.threadHistories.remove({
        title: target.dataset.title,
        url: target.dataset.url,
        resNum: parseInt(target.dataset.resNum),
      })
    }
    ThreadController.prototype._addNgSlip = function() {
      var view = this.threadView.configView
      var type = view.getNgSlipType()
      var boardId = this.thread.boardId
      var threadNumber = view.getNgItemAddTarget() === 'thread'
                       ? this.thread.threadNumber : undefined
      this.thread.config.ngSlips.add(new NgSlip(type, boardId, threadNumber))
    }
    ThreadController.prototype._removeNgSlip = function(target) {
      this.thread.config.ngSlips.remove(NgSlip.of(target.dataset))
    }
    ThreadController.prototype._resAnchorClicked = function(target, event) {
      if (!this.thread.hasResponse(Number(target.dataset.resNum))) return
      event.preventDefault()
      this.threadView.doc.location.hash = '#' + target.dataset.resNum
    }
    ThreadController.prototype._actionMap = function() {
      var view = this.threadView
      var cfg = this.thread.config
      var article = '.threadView .main article'
      var header = `${article} header`
      var topBar = '.threadView .topBar'
      var config = `${topBar} .config`
      var ngIdSection = `${config} .ngIdSection`
      var ngWordSection = `${config} .ngWordSection`
      var ngNameSection = `${config} .ngNameSection`
      var ngKorokoroSection = `${config} .ngKorokoroSection`
      var ngIdTailSection = `${config} .ngIdTailSection`
      var ngSlipSection = `${config} .ngSlipSection`
      var threadHistorySection = `${config} .threadHistorySection`
      return {
        [`${article} .resAnchor`]: this._resAnchorClicked.bind(this),
        [`${header} .headerNumber`]: view.toggleResponseChildren.bind(view),
        [`${header} .id .value`]: view.toggleSameIdResponses.bind(view),
        [`${header} .korokoro .value`]: view.toggleSameKorokoroResponses.bind(view),
        [`${header} .id .ngButton`]: this._addNgId.bind(this),
        [`${header} .korokoro .ngButton`]: this._addNgKorokoro.bind(this),
        '.threadView .bottomBar .reloadButton': this.requestNewResponses.bind(this),
        [`${topBar} .viewToggle`]: view.toggleViewConfig.bind(view),
        [`${topBar} .ngToggle`]: view.toggleNgConfig.bind(view),
        [`${topBar} .ngWordToggle`]: view.toggleNgWordConfig.bind(view),
        [`${topBar} .ngNameToggle`]: view.toggleNgNameConfig.bind(view),
        [`${topBar} .ngIdToggle`]: view.toggleNgIdConfig.bind(view),
        [`${topBar} .ngKorokoroToggle`]: view.toggleNgKorokoroConfig.bind(view),
        [`${topBar} .ngIdTailToggle`]: view.toggleNgIdTailConfig.bind(view),
        [`${topBar} .ngSlipToggle`]: view.toggleNgSlipConfig.bind(view),
        [`${topBar} .threadHistoryToggle`]: view.toggleThreadHistoryConfig.bind(view),
        [`${ngIdSection} table .removeButton`]: this._removeNgId.bind(this),
        [`${ngIdSection} h2 .removeAllButton`]: cfg.ngIds.removeAll.bind(cfg.ngIds),
        [`${ngKorokoroSection} table .removeButton`]: this._removeNgKorokoro.bind(this),
        [`${ngKorokoroSection} h2 .removeAllButton`]: cfg.ngKorokoros.removeAll.bind(cfg.ngKorokoros),
        [`${ngIdTailSection} .add .addButton`]: this._addNgIdTail.bind(this),
        [`${ngIdTailSection} table .removeButton`]: this._removeNgIdTail.bind(this),
        [`${ngIdTailSection} h2 .removeAllButton`]: cfg.ngIdTails.removeAll.bind(cfg.ngIdTails),
        [`${ngWordSection} .add .addButton`]: this._addNgWord.bind(this),
        [`${ngWordSection} table .removeButton`]: this._removeNgWord.bind(this),
        [`${ngWordSection} h2 .removeAllButton`]: cfg.ngWords.removeAll.bind(cfg.ngWords),
        [`${ngNameSection} .add .addButton`]: this._addNgName.bind(this),
        [`${ngNameSection} table .removeButton`]: this._removeNgName.bind(this),
        [`${ngNameSection} h2 .removeAllButton`]: cfg.ngNames.removeAll.bind(cfg.ngNames),
        [`${ngSlipSection} .add .addButton`]: this._addNgSlip.bind(this),
        [`${ngSlipSection} table .removeButton`]: this._removeNgSlip.bind(this),
        [`${ngSlipSection} h2 .removeAllButton`]: cfg.ngSlips.removeAll.bind(cfg.ngSlips),
        [`${threadHistorySection} table .removeButton`]: this._removeThreadHistory.bind(this),
        [`${threadHistorySection} h2 .removeAllButton`]: cfg.threadHistories.removeAll.bind(cfg.threadHistories),
      }
    }
    ThreadController.prototype._getAction = function(map, target) {
      var selectors = Object.keys(map)
      for (var i = 0; i < selectors.length; i++) {
        var s = selectors[i]
        if (target.matches(s)) return map[s]
      }
    }
    ThreadController.prototype.callback = function(event) {
      var action = this._getAction(this._actionMap(), event.target)
      if (action) action(event.target, event)
    }
    ThreadController.prototype.keydownCallback = function(event) {
      var enterKeyCode = 13
      if (event.keyCode !== enterKeyCode) return
      var config = '.threadView .topBar .config'
      var map = {
        [`${config} .ngWordSection .add .ngTextInput`]: this._addNgWord.bind(this),
        [`${config} .ngNameSection .add .ngTextInput`]: this._addNgName.bind(this),
        [`${config} .ngIdTailSection .add .ngTextInput`]: this._addNgIdTail.bind(this),
      }
      var a = this._getAction(map, event.target)
      if (a) a(event.target)
    }
    ThreadController.prototype._setPageCentering = function() {
      this.thread.config.setPageCentering(
        this.threadView.configView.isPageCenteringChecked())
    }
    ThreadController.prototype._setNgVisible = function() {
      this.thread.config.setNgVisible(
        this.threadView.configView.isNgVisibleChecked())
    }
    ThreadController.prototype._setPageMaxWidth = function() {
      this.thread.config.setPageMaxWidth(
        this.threadView.configView.getPageMaxWidthValue())
    }
    ThreadController.prototype._changeActionMap = function() {
      var viewSection = '.threadView .topBar .config .viewSection'
      return {
        [`${viewSection} .centering label input`]: this._setPageCentering.bind(this),
        [`${viewSection} .maxWidth label input`]: this._setPageMaxWidth.bind(this),
        [`${viewSection} .ngVisible label input`]: this._setNgVisible.bind(this),
      }
    }
    ThreadController.prototype.changeCallback = function(event) {
      var action = this._getAction(this._changeActionMap(), event.target)
      if (action) action(event.target)
    }
    return ThreadController
  })()

  async function contentLoaded() {
    var parsed = Parser.of(document).parse()
    parsed.action()
    parsed.ads.forEach(function(e) { e.style.display = 'none' })
    parsed.elementsToRemove.forEach(invoke('remove', []))
    if (parsed.floatedSpan) parsed.floatedSpan.style.cssFloat = ''
    var config = new Config(typeof GM_getValue === 'undefined' ? GM.getValue : GM_getValue
                          , typeof GM_setValue === 'undefined' ? GM.setValue : GM_setValue)
    var threadHistory = new ThreadHistory(
      config.threadHistories, document.location, document.title)
    var thread = new Thread(config, parsed.boardId, parsed.threadNumber, threadHistory)
    var threadView = new ThreadView(document, thread)
    threadView.setPageCentering(await config.isPageCentering())
    await threadView.addStyle()
    if (parsed.threadClosed) threadView.disableReload()
    threadView.replace(parsed.threadRootElement)
    await thread.addResponses(parsed.responses.map(Response.of))
    var ctrl = new ThreadController(thread, threadView)
    ctrl.addCallback()
    if (parsed.postForm) {
      var postForm = new ResponsePostForm(parsed.postForm)
      postForm.addEventListener('postDone'
                              , ctrl.requestNewResponses.bind(ctrl))
      threadView.responsePostForm = postForm
    }
  }
  var main = function() {
    if (document.location.protocol === 'http:') {
      window.stop()
      document.location.replace('https' + document.location.href.slice('http'.length))
      return
    }
    if (['interactive', 'complete'].includes(document.readyState))
      contentLoaded()
    else
      document.addEventListener('DOMContentLoaded', contentLoaded)
  }

  main()
})()
