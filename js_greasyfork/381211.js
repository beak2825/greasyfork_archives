// ==UserScript==
// @name         Genius.com translate lyrics
// @description  Shows English or Russian translation next to the lyrics on genius.com. Powered by Yandex.Translate
// @namespace    cuzi
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright    2019, cuzi (https://github.com/cvzi)
// @version      1
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      translate.yandex.net
// @include      https://genius.com/*
// @downloadURL https://update.greasyfork.org/scripts/381211/Geniuscom%20translate%20lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/381211/Geniuscom%20translate%20lyrics.meta.js
// ==/UserScript==

const YANDEX_API_KEY = 'trnsl.1.1.20190330T204003Z.a10ff99a15ff49d5.81a81cdd708ab5a0a1748539e579820da8446c9c'
const YANDEX_URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
const YANDEX_HOME = 'https://translate.yandex.com/translate'
let DEFAULT_LANG = 'en'
const allLangs = {
  'en': 'English',
  'ru': 'Русский'
}
const spinner = '<style>.loadingspinner { pointer-events: none; width: 2.5em; height: 2.5em; border: 0.4em solid transparent; border-color: rgb(255, 255, 100) #181818 #181818 #181818; border-radius: 50%; animation: loadingspin 2s ease infinite;} @keyframes loadingspin { 25% { transform: rotate(90deg) } 50% { transform: rotate(180deg) } 75% { transform: rotate(270deg) } 100% { transform: rotate(360deg) }}</style><div class="loadingspinner"></div>'

const TAGS = ['A', 'I', 'EM', 'SMALL', 'STRONG']
function retrieveText (node) {
  let child = node.firstChild
  let text = ''
  while (child) {
    if (child.tagName === 'BR') {
      text += '\n'
    } else if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent
    } else if(TAGS.includes(child.tagName)) {
      text += retrieveText(child)
    } else if(child.firstChild && child.firstChild.nodeType === Node.TEXT_NODE && child.firstChild.textContent.trim()) {
      text += child.firstChild.textContent
    }
    child = child.nextSibling
  }
  return text
}

function metricPrefix (n, decimals, k) {
  // http://stackoverflow.com/a/18650828
  if (n <= 0) {
    return String(n)
  }
  k = k || 1000
  let dm = decimals <= 0 ? 0 : decimals || 2
  let sizes = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
  let i = Math.floor(Math.log(n) / Math.log(k))
  return parseFloat((n / Math.pow(k, i)).toFixed(dm)) + sizes[i]
}

function askForKey (fromError) {
  if (fromError) {
    alert('The API key is incorrect or expired/out of quota!')
  } else {
    alert('You have not set your API key yet!')
  }
  config()
}

function config () {
  Promise.all([
    GM.getValue('api_key', false),
    GM.getValue('lang', DEFAULT_LANG),
    GM.getValue('requestcache', '{}')
  ]).then(function (values) {
    let apiKey = values[0]
    DEFAULT_LANG = values[1]
    const requestcacheRaw = values[2]

    // Window
    const win = document.createElement('div')
    win.setAttribute('style', 'position:fixed; top: 10px; left:10px; padding:15px; background:white; border-radius:10%; border:2px solid black; color:black; z-index:100')
    document.body.appendChild(win)
    const h1 = document.createElement('h1')
    win.appendChild(h1).appendChild(document.createTextNode('Options'))
    let a = document.createElement('a')
    a.href = 'https://github.com/cvzi/Genius-translate-lyrics-userscript/issues'
    a.style = 'color:blue'
    win.appendChild(a).appendChild(document.createTextNode('Report problem: github.com/cvzi/Genius-translate-lyrics-userscript'))

    // Text: Api Key
    let div = document.createElement('div')
    win.appendChild(div)
    div.appendChild(document.createTextNode('Your Yandex API key: '))
    const inputApiKey = div.appendChild(document.createElement('input'))
    inputApiKey.type = 'text'
    inputApiKey.size = 90
    if (apiKey) {
      inputApiKey.value = apiKey
    } else {
      inputApiKey.style.backgroundColor = '#f6f6a1'
      inputApiKey.value = '#Not set'
    }
    const onApiKeyChange = function onApiKeyChangeListener () {
      if (inputApiKey.value && (inputApiKey.value.length > 20 || inputApiKey.value === '#Not set')) {
        GM.setValue('api_key', inputApiKey.value !== '#Not set' ? inputApiKey.value : false)
        inputApiKey.style.backgroundColor = '#93d89c'
      } else {
        alert('Invalid api key')
        inputApiKey.style.backgroundColor = '#f2c4be'
      }
    }
    inputApiKey.addEventListener('change', onApiKeyChange)
    div.appendChild(document.createElement('br'))
    div.appendChild(document.createTextNode('You can get a free API key by registering an account here: '))
    div.appendChild(document.createElement('br'))
    a = document.createElement('a')
    a.href = 'https://translate.yandex.com/developers/keys'
    a.style = 'color:blue'
    div.appendChild(a).appendChild(document.createTextNode('https://translate.yandex.com/developers/keys'))

    // Select: Language
    div = document.createElement('div')
    win.appendChild(div)
    div.appendChild(document.createTextNode('Your language: '))
    const selectLang = div.appendChild(document.createElement('select'))
    for (let key in allLangs) {
      const option = selectLang.appendChild(document.createElement('option'))
      option.value = key
      if (DEFAULT_LANG === key) {
        option.selected = true
      }
      option.appendChild(document.createTextNode(allLangs[key]))
    }
    const onLangChange = function onLangChangeListener () {
      GM.setValue('lang', selectLang.selectedOptions[0].value)
      selectLang.style.backgroundColor = '#93d89c'
    }
    selectLang.addEventListener('change', onLangChange)

    // Clear request cache button
    const bytes = metricPrefix(requestcacheRaw.length - 2, 2, 1024) + 'Bytes'
    const clearCacheButton = win.appendChild(document.createElement('button'))
    clearCacheButton.appendChild(document.createTextNode('Clear cache (' + bytes + ')'))
    clearCacheButton.addEventListener('click', function onClearCacheButtonClick () {
      GM.setValue('requestcache', '{}').then(function () {
        clearCacheButton.innerHTML = 'Cleared'
      })
    })

    // Close button
    const closeButton = win.appendChild(document.createElement('button'))
    closeButton.appendChild(document.createTextNode('Close'))
    closeButton.style.color = 'black'
    closeButton.addEventListener('click', function onCloseButtonClick () {
      win.parentNode.removeChild(win)
    })
  })
}

function createArea () {
  if (document.getElementById('userscripttranslate')) {
    document.getElementById('userscripttranslate').remove()
  }

  // Move lyrics to the right
  const columnLayout = document.querySelector('routable-page song-page .song_body.column_layout')
  const minWidth = columnLayout.querySelector('.column_layout-column_span--primary').clientWidth + 50
  const rightOffset = document.body.clientWidth - minWidth
  if (rightOffset > 0) {
    columnLayout.style.margin = '0 auto 0 ' + minWidth + 'px'
  } else {
    columnLayout.style.margin = '0 0 0 auto'
  }

  const bodyRect = document.body.getBoundingClientRect()
  const elemRect = document.querySelector('song-page lyrics div div.lyrics section p').getBoundingClientRect()
  const offset = elemRect.top - bodyRect.top
  const width = elemRect.left - bodyRect.left

  const div = document.createElement('div')
  div.setAttribute('id', 'userscripttranslate')
  document.body.appendChild(div)

  div.style = 'overflow:auto;position:absolute;top:' + offset + 'px;left:0px;max-width:' + width + 'px;padding:0 2.5rem 0 0;margin:0 1rem;white-space: nowrap;font-size: 1.125em;color:#222;background-color:#f7f7f7;font-family: Programme,sans-serif;word-break: break-word;line-height: 1.7em;font-weight: 100;'

  return div
}

function translate () {
  Promise.all([
    GM.getValue('api_key', false),
    GM.getValue('requestcache', '{}')
  ]).then(function (values) {
    if (!values[0]) {
      askForKey()
    }

    let requestCache = JSON.parse(values[1])
    /*
    requestCache = {
       "cachekey0": "121648565.5\njsondata123",
       ...
       }
    */
    const now = (new Date()).getTime()
    const exp = 48 * 60 * 60 * 1000
    for (let prop in requestCache) {
      // Delete cached values, that are older than 2 days
      const time = requestCache[prop].split('\n')[0]
      if ((now - (new Date(time)).getTime()) > exp) {
        delete requestCache[prop]
      }
    }

    yandex(values[0] || YANDEX_API_KEY, requestCache)
  })
}

function yandex (apiKey, requestCache) {
  const div = createArea()

  div.innerHTML = spinner + '<br>Collecting lyrics...'

  const textInput = retrieveText(document.querySelector('song-page lyrics div div.lyrics section p'))

  const cachekey = JSON.stringify(textInput)
  if (cachekey in requestCache) {
    div.innerHTML += ' Found in cache.'
    const cacheResponse = JSON.parse(requestCache[cachekey].split('\n')[1])
    showTranslation(JSON.parse(cacheResponse.responseText), div)
    return
  }

  const requestURL = YANDEX_URL + '?key=' + apiKey + '&lang=' + DEFAULT_LANG + '&format=plain'

  div.innerHTML += ' OK<br>Opening translate.yandex.net<br>'
  GM.xmlHttpRequest({
    method: 'POST',
    url: requestURL,
    data: '&text=' + encodeURIComponent(textInput),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    onload: function (response) {
      div.innerHTML += response.status + ' ' + response.statusText
      if (response.status === 200) {
        // Cache result:
        const time = (new Date()).toJSON()
        // Chrome fix: Otherwise JSON.stringify(requestCache) omits responseText
        var newobj = {}
        for (var key in response) {
          newobj[key] = response[key]
        }
        newobj.responseText = response.responseText
        requestCache[cachekey] = time + '\n' + JSON.stringify(newobj)
        GM.setValue('requestcache', JSON.stringify(requestCache))
        // Show result
        showTranslation(JSON.parse(response.responseText), div)
      } else {
        showError(response, div)
      }
    },
    onreadystatechange: function (response) {
      if (response.readyState === 1) {
        div.innerHTML += 'Opened.'
      } else if (response.readyState === 2) {
        div.innerHTML += ' Sent.'
      } else if (response.readyState === 3) {
        div.innerHTML += ' Downloading... '
      }
    },
    onerror: function (response) {
      console.log('Error: ' + response.status + '\nURL: ' + requestURL + '\nResponse:\n' + response.responseText)

      div.innerHTML += '<br><br>'

      const a = div.appendChild(document.createElement('a'))
      a.appendChild(document.createTextNode('Try again on translate.yandex.com/translate'))
      a.href = YANDEX_HOME + '?url=' + encodeURIComponent(document.location.href) + '&lang=' + DEFAULT_LANG
      a.target = '_blank'
      
      div.innerHTML += '<br><br>Error: ' + response.status + '<br>URL: ' + requestURL + '<br>Response:<br>' + response.responseText
    }
  })
}

function showError (response, div) {
  try {
    let data = JSON.parse(response.responseText)
    if ('code' in data) {
      div.innerHTML += '<br>Error code: ' + data.code
      if (data.code === 401) {
        askForKey(true)
      }
    }
    if ('message' in data) {
      div.innerHTML += '<br>Error message: ' + data.message
    }
  } catch (e) {
  }

  div.innerHTML += '<br><br>'

  const a = div.appendChild(document.createElement('a'))
  a.appendChild(document.createTextNode('Try again on translate.yandex.com/translate'))
  a.href = YANDEX_HOME + '?url=' + encodeURIComponent(document.location.href) + '&lang=' + DEFAULT_LANG
  a.target = '_blank'

  div.innerHTML += '<br><br>Response body:<br><pre>' + response.responseText + '</pre>'
}

function showTranslation (data, div) {
  if (data.code !== 200) {
    alert('Error ' + data.code + '\n' + JSON.stringify(data))
    return
  }

  let html = '' + data.text

  div.innerHTML = html.split('\n').join('<br>\n')
  div.appendChild(document.createElement('br'))
  div.appendChild(document.createElement('br'))

  const a = document.createElement('a')
  a.href = YANDEX_HOME + '?url=' + encodeURIComponent(document.location.href) + '&lang=' + DEFAULT_LANG
  a.target = '_blank'
  a.appendChild(document.createTextNode('\uD83D\uDD17 Powered by Yandex.Translate'))
  div.appendChild(a)

  div.appendChild(document.createElement('br'))
  div.appendChild(document.createElement('br'))

  const configLink = document.createElement('a')
  configLink.href = '#'
  configLink.addEventListener('click', function (ev) {
    ev.preventDefault()
    config()
  })
  configLink.appendChild(document.createTextNode('\u2699\uFE0F Userscript options'))
  div.appendChild(configLink)
}

function addTranslateButton () {
  GM.getValue('lang', DEFAULT_LANG).then(function (value) {
    DEFAULT_LANG = value
    if (document.querySelector('lyrics div.lyrics_controls')) {
      const button = document.createElement('button')
      button.setAttribute('class', 'square_button')
      button.appendChild(document.createTextNode('Translate'))
      button.addEventListener('click', translate)
      button.addEventListener('auxclick', function (event) {
        window.open(YANDEX_HOME + '?url=' + encodeURIComponent(document.location.href) + '&lang=' + DEFAULT_LANG)
      })
      document.querySelector('lyrics div.lyrics_controls').appendChild(button)
    } else if (document.querySelector('song-page secondary song-metadata-preview > div')) {
      const div = document.createElement('div')
      div.setAttribute('class', 'header_with_cover_art-metadata_preview-unit')
      const a = document.createElement('a')
      a.appendChild(document.createTextNode('Translate'))
      a.addEventListener('click', function (ev) {
        ev.preventDefault()
        translate()
      })
      a.href = YANDEX_HOME + '?url=' + encodeURIComponent(document.location.href) + '&lang=' + DEFAULT_LANG

      document.querySelector('song-page secondary song-metadata-preview > div').appendChild(div)
      div.appendChild(a)
    }
  })
}

let iv = window.setInterval(function () {
  if (document.querySelector('song-page lyrics div div.lyrics section p')) {
    clearInterval(iv)
    addTranslateButton()
  }
}, 500)
