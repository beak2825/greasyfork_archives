// ==UserScript==
// @name         2ch Thread List
// @namespace    https://greasyfork.org/users/1009-kengo321
// @version      10
// @description  ２ちゃんねるの各板のトップページに整形したスレッド一覧を表示
// @grant        none
// @match        *://*.2ch.net/*
// @match        *://*.5ch.net/*
// @license      MIT
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/10526/2ch%20Thread%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/10526/2ch%20Thread%20List.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  var byId = function(id) {
    return document.getElementById(id)
  }

  var getBoardId = function() {
    var p = window.location.pathname
    return p.slice(1, p.indexOf('/', 1))
  }

  var parseSubjectText = (function() {
    var lineRegExp = /^(\d+)\.dat<>(.*)\s*\((\d+)\)$/gm
    var matchedResults = function(str) {
      var result = [], matched = null
      while ((matched = lineRegExp.exec(str))) result.push(matched)
      return result
    }
    var removeCopyright = function(str) {
      return str.replace('[転載禁止]', '')
        .replace('[無断転載禁止]', '')
        .replace('&copy;2ch.net', '')
        .replace('&#169;2ch.net', '')
        .replace('&copy;bbspink.com', '')
        .replace('&#169;bbspink.com', '')
    }
    var newThreadInfo = function(matchedResult, i) {
      return {
        line: i + 1,
        id: parseInt(matchedResult[1], 10),
        title: removeCopyright(matchedResult[2].trim()),
        resNum: parseInt(matchedResult[3], 10),
      }
    }
    return function(subjectText) {
      return matchedResults(subjectText).map(newThreadInfo)
    }
  })()

  const millis = {
    toSeconds(millis) {
      return Math.trunc(millis / 1000)
    },
  }

  const addForceProperty = (threadInfos, nowAsSeconds) => {
    const secondsInMinute = 60
    const secondsInDay = 86400
    const lowerLimit = elapsed => Math.max(elapsed, secondsInMinute * 3)
    return threadInfos.map(i => {
      const elapsed = nowAsSeconds - i.id
      const force = elapsed < 0
                  ? 0
                  : Math.trunc(i.resNum / (lowerLimit(elapsed) / secondsInDay))
      return Object.assign({}, i, {force})
    })
  }

  const threadInfos = () => {
    return threadInfos.data.slice()
  }
  threadInfos.data = []
  threadInfos.set = infos => {
    threadInfos.data = infos.slice()
  }

  var sortThreadInfos = (function() {
    var cmp = function(prop) {
      return function(a, b) {
        if (a[prop] < b[prop]) return -1
        if (a[prop] > b[prop]) return 1
        return 0
      }
    }
    var negate = function(func) {
      return function() { return -func.apply(null, arguments) }
    }
    var cmpSeq = function(comparators) {
      return function(a, b) {
        for (var i = 0; i < comparators.length; i++) {
          var r = comparators[i](a, b)
          if (r !== 0) return r
        }
        return 0
      }
    }
    var reversableCmpObj = function(prop) {
      return {
        asc: cmpSeq([cmp(prop), line.asc]),
        desc: cmpSeq([negate(cmp(prop)), line.asc]),
      }
    }
    var line = {asc: cmp('line'), desc: negate(cmp('line'))}
    var title = reversableCmpObj('title')
    var resNum = reversableCmpObj('resNum')
    var id = reversableCmpObj('id')
    var force = reversableCmpObj('force')
    var current = line.asc
    var setOrReverseCmp = function(comp) {
      return function() {
        current = (current === comp.asc ? comp.desc : comp.asc)
      }
    }
    var result = function(threadInfos) {
      return threadInfos.slice().sort(current)
    }
    result.byLineInAsc = function() { current = line.asc }
    result.byLine = setOrReverseCmp(line)
    result.byTitle = setOrReverseCmp(title)
    result.byResNum = setOrReverseCmp(resNum)
    result.byId = setOrReverseCmp(id)
    result.byForce = setOrReverseCmp(force)
    return result
  })()

  var newThreadList = (function() {
    var addCells = function(row) {
      ;[].slice.call(arguments, 1).forEach(function(content) {
        var cell = row.insertCell()
        if (['string', 'number'].indexOf(typeof(content)) >= 0) {
          cell.textContent = content
        } else {
          cell.appendChild(content)
        }
      })
    }
    var sorter = function(setSortType) {
      return function() {
        setSortType()
        updateThreadList(threadInfos())
      }
    }
    var setTHead = function(tHead) {
      var r = tHead.insertRow()
      var addTh = function(e) {
        var th = r.ownerDocument.createElement('th')
        th.textContent = e[0]
        th.addEventListener('click', e[1])
        r.appendChild(th)
      }
      ;[['番号', sorter(sortThreadInfos.byLine)],
        ['タイトル', sorter(sortThreadInfos.byTitle)],
        ['レス', sorter(sortThreadInfos.byResNum)],
        ['勢い', sorter(sortThreadInfos.byForce)],
        ['作成日時', sorter(sortThreadInfos.byId)],
      ].forEach(addTh)
    }
    var threadUrl = function(threadId) {
      return '/test/read.cgi/'
           + getBoardId()
           + '/'
           + threadId
           + '/'
    }
    var decodeEntityRefs = (function() {
      var e = document.createElement('span')
      return function(html) {
        e.innerHTML = html
        return e.textContent
      }
    })()
    var newLink = function(threadInfo) {
      var result = document.createElement('a')
      result.target = '_blank'
      result.href = threadUrl(threadInfo.id)
      result.textContent = decodeEntityRefs(threadInfo.title)
      return result
    }
    var padZero = function(dateUnit) {
      return dateUnit <= 9 ? '0' + dateUnit : '' + dateUnit
    }
    var toZeroPaddingString = function(date) {
      var monthDay = [date.getMonth() + 1, date.getDate()]
      var times = [date.getHours(), date.getMinutes(), date.getSeconds()]
      return date.getFullYear()
           + '/'
           + monthDay.map(padZero).join('/')
           + ' '
           + times.map(padZero).join(':')
    }
    var setTBody = function(tBody, threadInfos) {
      ;(threadInfos || []).forEach(function(info) {
        addCells(tBody.insertRow()
               , info.line
               , newLink(info)
               , info.resNum
               , info.force
               , toZeroPaddingString(new Date(info.id * 1000)))
      })
    }
    return function(threadInfos) {
      var result = document.createElement('table')
      result.id = 'thread-list'
      setTHead(result.createTHead())
      setTBody(result.createTBody(), threadInfos)
      return result
    }
  })()

  var addThreadListBoxIfAbsent = function() {
    if (!byId('thread-list-box')) {
      var b = document.body
      b.insertBefore(newThreadListBox(), b.firstChild)
    }
  }

  var replaceThreadListBy = function(threadList) {
    var old = threadList.ownerDocument.getElementById('thread-list')
    old.parentNode.replaceChild(threadList, old)
  }

  var newTopBar = function() {
    var message = document.createElement('span')
    message.id = 'thread-list-error-message'
    var button = document.createElement('input')
    button.id = 'thread-list-reload-button'
    button.type = 'button'
    button.value = '更新'
    button.addEventListener('click', function() {
      button.disabled = true
      message.textContent = ''
      requestSubjectText(getBoardId())
    })
    var result = document.createElement('div')
    result.id = 'thread-list-top-bar'
    result.appendChild(button)
    result.appendChild(message)
    return result
  }

  var newThreadListBox = function() {
    var result = document.createElement('div')
    result.id = 'thread-list-box'
    result.appendChild(newTopBar())
    result.appendChild(newThreadList())
    return result
  }

  const updateThreadList = threadInfos => {
    const sorted = sortThreadInfos(threadInfos)
    const list = newThreadList(sorted)
    replaceThreadListBy(list)
  }

  var subjectTextLoaded = function(event) {
    var xhr = event.target
    if (xhr.status === 200) {
      const parsed = parseSubjectText(xhr.responseText)
      const added = addForceProperty(parsed, millis.toSeconds(Date.now()))
      threadInfos.set(added)
      updateThreadList(added)
    } else {
      byId('thread-list-error-message').textContent = xhr.statusText
    }
  }

  var requestSubjectText = (function() {
    var handler = function(errorMessage, fn) {
      return function f(event) {
        if (document.body) {
          addStyleIfAbsent()
          addThreadListBoxIfAbsent()
          byId('thread-list-reload-button').disabled = false
          byId('thread-list-error-message').textContent = errorMessage
          if (fn) fn(event)
        } else {
          document.addEventListener('DOMContentLoaded', f.bind(this, event))
        }
      }
    }
    function getSubjectTxtURL(boardId) {
      const l = window.location
      return `${l.protocol}//${l.host}/${boardId}/subject.txt`
    }
    return function(boardId) {
      var xhr = new XMLHttpRequest()
      xhr.timeout = 30000
      xhr.open('GET', getSubjectTxtURL(boardId))
      xhr.overrideMimeType('text/plain; charset=shift_jis')
      xhr.addEventListener('load', handler('', subjectTextLoaded))
      xhr.addEventListener('timeout', handler('タイムアウト'))
      xhr.addEventListener('error', handler('エラー'))
      xhr.send()
    }
  })()

  var addStyleIfAbsent = function() {
    if (byId('thread-list-style')) return
    var style = document.createElement('style')
    style.id = 'thread-list-style'
    style.innerHTML = [
      '#thread-list {',
      '  margin: 0 auto;',
      '  border-collapse: collapse;',
      '}',
      '#thread-list th {',
      '  color: white;',
      '  background-color: steelblue;',
      '  cursor: default;',
      '}',
      '#thread-list th:hover {',
      '  background-color: cornflowerblue;',
      '}',
      '#thread-list th:active {',
      '  background-color: mediumblue;',
      '}',
      '#thread-list td {',
      '  color: black;',
      '}',
      '#thread-list th, #thread-list td {',
      '  border: solid thin lightsteelblue;',
      '  padding: 0 0.5em;',
      '  line-height: 1.5em;',
      '}',
      '#thread-list tbody tr:nth-child(odd) {',
      '  background-color: azure;',
      '}',
      '#thread-list tbody tr:nth-child(even) {',
      '  background-color: aliceblue;',
      '}',
      '#thread-list tbody tr:nth-child(5n) {',
      '  border-bottom: solid medium lightsteelblue;',
      '}',
      '#thread-list td:nth-child(4n+1),',
      '#thread-list td:nth-child(4n+3),',
      '#thread-list td:nth-child(4n+4) {',
      '  text-align: right;',
      '}',
      '#thread-list a:link {',
      '  color: black;',
      '  text-decoration: none;',
      '}',
      '#thread-list a:visited {',
      '  color: purple;',
      '}',
      '#thread-list a:hover {',
      '  color: maroon;',
      '  text-decoration: underline;',
      '}',
      '#thread-list-box {',
      '  background-color: silver;',
      '}',
      '#thread-list-top-bar {',
      '  text-align: center;',
      '}',
      '#thread-list-error-message {',
      '  color: red;',
      '}',
    ].join('\n')
    document.head.appendChild(style)
  }

  var isBoardTopPage = function() {
    return /^\/[^/]+\/(?:index\.html)?$/.test(window.location.pathname)
  }

  var main = function() {
    if (!isBoardTopPage()) return
    requestSubjectText(getBoardId())
  }

  main()
})()
