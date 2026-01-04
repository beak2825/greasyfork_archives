// ==UserScript==
// @name           Проверка внешних скриптов на соответствие Правилам GreasyFork
// @name:en        External scripts checker for compliance with GreasyFork rules 
// @description    Проверка внешних скриптов на соответствие правилам GreasyFork
// @description:en External scripts checker for compliance with the GreasyFork rules
// @author         eisen-stein
// @namespace      https://greasyfork.org/ru/users/136230-eisenstein
// @homepageURL    https://greasyfork.org/ru/users/136230-eisenstein
// @supportURL     https://greasyfork.org/ru/users/136230-eisenstein
// @version        0.1.0
// @license        MIT
// @include        *://greasyfork.org/*scripts/*
// @include        *://sleazyfork.org/*scripts/*
// @include        *://www.greasyfork.org/*scripts/*
// @include        *://www.sleazyfork.org/*scripts/*
// @grant          GM_xmlhttpRequest
// @grant          GM.xmlHttpRequest
// @grant          GM.notification
// @connect        greasyfork.org
// @connect        sleazyfork.org
// @downloadURL https://update.greasyfork.org/scripts/441101/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%B2%D0%BD%D0%B5%D1%88%D0%BD%D0%B8%D1%85%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%81%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B8%D0%B5%20%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0%D0%BC%20GreasyFork.user.js
// @updateURL https://update.greasyfork.org/scripts/441101/%D0%9F%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BA%D0%B0%20%D0%B2%D0%BD%D0%B5%D1%88%D0%BD%D0%B8%D1%85%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%BE%D0%B2%20%D0%BD%D0%B0%20%D1%81%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B8%D0%B5%20%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0%D0%BC%20GreasyFork.meta.js
// ==/UserScript==

(function () {
  var REGEX = {
    metaDataStart: /\s*\/\/\s{1,}\=\=UserScript\=\=/,
    metaDataEnd: /\s*\/\/\s{1,}\=\=\/UserScript\=\=/,
    attribute: /@([a-z0-9A-Z\:\-]+)\s+(.*)/,
    url: /https?:\/\/([^/"'\s]+)([^?#"'\s]+)?([^"'\s]*)/,
    js: /\.js$/,
  }
  function Deffer() {
    var _this = this
    this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve
      _this.reject = reject
    })
  }
  function loadRules() {
    var deffer = new Deffer()
    GM.xmlHttpRequest({
      method: 'GET',
      url: 'https://greasyfork.org/en/help/external-scripts',
      onload: function (res) {
        var doc = document.implementation.createHTMLDocument('')
        doc.documentElement.innerHTML = res.response
        var rules = []
        var rulesHTML = doc.querySelectorAll('table tr')
        rulesHTML.forEach(function (item) {
          var data = item.querySelectorAll('td')
          var rule = {
            name: '',
            regex: null,
            extra: null,
          }
          if (data[0]) {
            rule.name = data[0].innerText.trim()
          }
          if (data[1]) {
            rule.regex = new RegExp(data[1].innerText.trim())
          }
          if (data[2]) {
            rule.extra = data[2].innerText.trim()
          }
          rules.push(rule)
        })
        deffer.resolve(rules)
      },
      onerror: function (res) {
        console.error('loadRules()', res)
        deffer.reject(new Error('loadRules() failed'))
      },
    })
    return deffer.promise
  }

  function getScriptCode() {
    var match = location.pathname.match(/scripts\/(\d+)/)
    return match ? match[1] : null
  }

  function loadScript(code) {
    var url = new URL(location.href)
    url.hostname = location.hostname
    url.pathname = `/scripts/${code}/code/script.user.js`
    var deffer = new Deffer()
    GM.xmlHttpRequest({
      method: 'GET',
      url: url.href,
      onload: function (res) {
        var js = res.response
        deffer.resolve(js)
      },
      onerror: function (res) {
        console.error(`loadScript(${code})`, res)
        deffer.reject(new Error(`loadScript(${code}) failed`))
      }
    })
    return deffer.promise
  }

  function parseScript(js) {
    var lines = js.split(/\r?\n/g);
    var metaDataStartIndex = lines.findIndex(function (line) {
      return REGEX.metaDataStart.test(line)
    })
    var metaDataEndIndex = lines.findIndex(function (line) {
      return REGEX.metaDataEnd.test(line)
    })
    if (metaDataEndIndex === -1 || metaDataStartIndex === -1 || metaDataStartIndex >= metaDataEndIndex) {
      return null;
    }
    var metaDataLines = lines.slice(metaDataStartIndex + 1, metaDataEndIndex - 1)
    var metaData = metaDataLines.reduce(function (mdata, line) {
      var match = line.match(REGEX.attribute)
      if (match) {
        var name = match[1], value = match[2]
        mdata[name] = mdata[name] || []
        mdata[name].push(value)
      }
      return mdata
    }, {})
    var links = []
    lines.forEach(function (line, index) {
      if (index <= metaDataEndIndex) {
        return;
      }
      var match = line.match(REGEX.url)
      if (match) {
        links.push({
          line: index + 1,
          url: match[0],
        })
      }
    })
    return { metaData, links }
  }

  function getJSLinks(data) {
    var metaData = data.metaData
    var links = data.links.filter(function (link) {
      var url = new URL(link.url)
      return REGEX.js.test(url.pathname)
    })
    if (metaData.require) {
      links = links.concat(metaData.require.map(function (url) {
        return { line: '@require', url }
      }))
    }
    if (metaData.resource) {
      links = links.concat(metaData.resource.map(function (line) {
        var match = line.match(REGEX.url)
        if (!match) return null
        var url = new URL(match[0])
        return REGEX.js.test(url.pathname) ? { url: url.href, line: '@resource' } : null
      }).filter(Boolean))
    }
    return links;
  }

  function checkScript(rules, links) {
    var violations = links.filter(function (link) {
      return !rules.some(function (rule) {
        return rule.regex && rule.regex.test(link.url)
      })
    })
    return violations
  }

  function showViolations(violations, scriptName) {
    var message = violations.map(function (v, i, a) {
      var index = `${i}`.padStart(a.length.toString().length, '0')
      return [
        `line[${index}]: ${v.line}`,
        `url[${index}]: ${v.url}`,
        `${'='.repeat(index.length + 6)}`,
      ].join('\n')
    })
    GM.notification({
      title: 'External scripts checker',
      text: `${scriptName || ''}\nVIOLATIONS\n${message.join('\n')}`,
      image: null,
    })
  }

  async function main() {
    try {
      var code = getScriptCode()
      if (!code) {
        console.warn('main() script\'s "code" not found')
        return;
      }
      var rules = await loadRules()
      var js = await loadScript(code)
      var data = parseScript(js)
      if (!data) {
        console.warn('main() failed to parse script')
        return;
      }
      var links = getJSLinks(data)
      console.log('links', links)
      var violations = checkScript(rules, links)
      console.log('violations', { code }, violations)
      if (violations.length) {
        showViolations(violations, data.metaData.name[0])
      }
    } catch (e) {
      console.error('main() error', e)
    }
  }

  main()
})()
