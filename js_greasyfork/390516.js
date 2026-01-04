// ==UserScript==
// @name 5ch Plus
// @name:ja 5ch プラス
// @description 5ch を拡張します
// @author null-chan <ntCcZgFmUxGztDGCLuEtgrHkst2CjtrFU3eJxvqh@protonmail.ch>
// @version 0.1.0
// @run-at document-body
// @include http*://*5ch.net/*
// @include http*://imgur.com/*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/twemoji/12.0.4/twemoji.min.js
// @grant none
// @copyright Copyright (c) 2019 null-chan
// @license MIT
// @namespace https://greasyfork.org/users/379206
// @downloadURL https://update.greasyfork.org/scripts/390516/5ch%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/390516/5ch%20Plus.meta.js
// ==/UserScript==

(() => {

  'use strict'

  // ################ 設定 ################ //
  //
  // true = 有効 | false = 無効
  //
  const config = {
    background_url: 'https://picsum.photos/1920/1080', // 背景画像。 base64 使用可
    background_blur: true, // 背景画像のぼかし
    preview_limit: 100, // テキストファイルプレビュー時の文字数制限
  }
  // ################ 設定 ################ //

  $(window).on('load', () => console.info('window.on(\'load\')'))

  const parse_json = object => {
    let x
    let ret = ''
    for (x in object) {
      let y
      let dec = ''
      for (y in object[x]) dec += `${y}:${object[x][y]}!important;`
      ret += `${x}{${dec}}`
    }
    return ret
  }

  // https://stackoverflow.com/questions/1484506/random-color-generator
  const generateColor = () => {
    const letters = '0123456789abcdef'
    let color = ''
    for (let i = 0; i < 6; i++)
      color += letters[Math.floor(Math.random() * 16)]
    return color
  }

  const preset = {
    'imgur.com/[a-zA-Z0-9]{7}': {
      script: () => (location.href = $('meta[name="twitter:image"]').attr('content')),
    },
    global_5ch: {
      hostname: '5ch.net',
      style: {
        html: {
          'font-family': 'メイリオ,Arial',
          cursor: 'progress',
        },
        hidden: {
          display: 'none',
          opacity: 0,
        },
        'img.emoji': {
          height: '1em',
          width: '1em',
          'margin-bottom': '0.1em',
          'user-select': 'all',
        },
        'img.emoji::selection': {
          background: 'white',
        },
        '.gray_om': {
          color: '#808080',
        },
      },
      script: () => twemoji.parse(document.body),
    },
    '(.*[^jump][.]5ch[.]net/[a-z]{1,}/(#[0-9]{1,2})?)|.*[.]5ch[.]net/test/read.cgi/.*': {
      script: () => {
        $(window).on('load', () => {
          $('html').attr('style', 'cursor:default!important')
          $('a[href^="https://"],a[href^="http://"],a[href^="/"],a[href^="../"]').each(function () {
            let href = $(this).attr('href')
            console.info(`Detected link: %c${$(this).html()}%c - %c${href}`, 'text-decoration:underline', '', 'text-decoration:underline')
            if (/^(https?:)?\/\/jump[.]5ch[.]net\/[?]/.test($(this).attr('href'))) href = $(this).text()
            $(this)
              .addClass('rinku')
              .text(decodeURI($(this).text()))
              .attr({
                href: href,
                rel: 'noreferrer noopener',
                target: '_blank',
                title: 'ページは新しいタブで開かれます (rel="noreferrer noopener")',
              })
          })
          $(document).on('mouseenter', 'dl.thread a,.post .message .rinku,.post_hover .message .rinku', function () {
            console.info(`Hovered: ${$(this).attr('href')}`)
            if ($(this).hasClass('loadeding') ||
              $(this).hasClass('reply_link')) return
            let original_element = $(this).parents('.post_hover').length
              ? `#${$(this).parents('.post_hover').attr('data-ha')} .message .rinku:nth-of-type(${$(this).parents('.post_hover').find('.message .rinku').index(this) + 1})`
              : null
            $(this).addClass('loadeding').attr('title', 'Loading...')
            const uralu = (new RegExp('^(https?:)?//.*5ch[.]net/').test($(this).attr('href')) ? '' : 'https://cors-anywhere.herokuapp.com/')
              + encodeURI($(this).attr('href'))
            if (original_element) $(original_element).addClass('loadeding').attr('title', 'Loading...')
            console.info(`Loading: ${uralu}`)
            $.get(uralu, (res, _, xhr) => {
              const type = xhr.getResponseHeader('content-type')
              console.info(`Loaded: ${uralu} - ${type}`)
              let title
              let element
              if (type.includes('text/html')) {
                title = $(res).filter('title').text() || 'No title found'
                element = `<br><span class='gray_om'>${title}</span>`
              } else if (type.includes('image/')) {
                title = 'DuckDuckGo Image Proxy'
                element = `<br><span><img class='preview_img' title='クリックで非表示' src='https://proxy.duckduckgo.com/iu/?u=${$(this).attr('href')}'/><span class='preview_img hidden' style='color:#808080'>画像プレビューが非表示になっています。クリックで表示...</span></span>`
              } else if (type.includes('application/pdf')) {
                title = 'PDF ファイルのプレビューは対応していません'
                element = '<br><span class=\'gray_om\'>PDF ファイルのプレビューは対応していません</span>'
              } else if (type.includes('application/json')) {
                if (res.length > config.preview_limit) {
                  title = `${config.preview_limit}文字を超えているため、プレビューを表示できません`
                  element = `<br><span class='gray_om' title='制限文字数は設定から変更ができます'>${config.preview_limit}文字を超えているため、プレビューを表示できません</span>`
                  return
                }
                if (type.includes('application/json')) {
                  title = 'JavaScript Object Notation (JSON)'
                  element = `<br><span class='gray_om'>${JSON.stringify(res)}</span>`
                }
              } else {
                title = `Preview is not available - ${type}`
                element = `<br><span class='gray_om'>Preview is not available - ${type}</span>`
              }
              if (original_element) $(original_element).attr('title', title).after(element)
              $(this).attr('title', title).after(element)
            })
          })
          $(document).on('click', '.preview_img', function () {
            $(this).toggleClass('hidden')
            $(this).siblings('.preview_img').toggleClass('hidden')
            if ($(this).parents('.post_hover').length) {
              const original_element = `#${$(this).parents('.post_hover').attr('data-ha')} .message ${$(this)[0].tagName}.preview_img:nth-of-type(${$(this).parents('.post_hover').find('.message .preview_img').index(this) + 1})`
              $(original_element).toggleClass('hidden')
              $(original_element).siblings('.preview_img').toggleClass('hidden')
            }
          })
        })
      },
    },
    'http://.*5ch[.]net.*': {
      protocol: true,
      script: () => location.href = location.href.replace(new RegExp('^http://'), 'https://'),
    },
    '.*[^jump][.]5ch[.]net/[a-z]{1,}/(#[0-9]{1,2})?': {
      style: {
        body: {
          background: `url(${config.background_url}) center no-repeat fixed`,
          'background-size': 'cover',
        },
        'div[style="margin: 0; padding: 0 0 0 0.5em; border-top: 0.5em solid #BEB; border-bottom: 0.5em solid #BEB; border-radius: 0.50em / 0.50em; padding: 0 0 1.0em 0.5em; height: 25em; overflow-y: scroll; background: #BEB;"]': {
          height: 'auto',
          'max-height': '25em',
        },
        '.ADVERTISE_AREA,div[style="margin-top:10px;margin-bottom:10px;width:100%;text-align:center;"]': {
          display: 'none',
        },
        'p[style="margin: 0.75em 30% 0 30%; padding: 0.5em; border-radius: 0.50em / 0.50em; background: #FFF; color: #666;"]': {
          display: 'none',
        },
        'body > div': {
          background: 'rgba(0, 0, 0, 0.7)',
        },
        '.board_header,div[style="margin: 0; padding: 0 0 0 0.5em; border-top: 0.5em solid #BEB; border-bottom: 0.5em solid #BEB; border-radius: 0.50em / 0.50em; padding: 0 0 1.0em 0.5em; height: 25em; overflow-y: scroll; background: #BEB;"]': {
          background: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          'border-radius': '15px',
          border: 'none',
        },
        'p[style="margin:0; padding: 0; font-size: 0.75em; background: #BEB;"]': {
          background: 'none',
        },
        a: {
          color: '#42a5f5',
        },
        dd: {
          color: 'white',
        },
        '.thread a': {
          'text-shadow': '1px 1px 10px white',
          transition: 'all 0.2s ease-in-out',
        },
        '.thread a:hover': {
          'text-shadow': 'none',
        },
      },
    },
    '.*[.]5ch[.]net/test/read.cgi/.*': {
      style: {
        '.navbar-fixed-top': {
          background: 'rgba(0, 0, 0, 0.7)',
        },
        '.container_body': {
          background: 'none',
          margin: 0,
          padding: 0,
        },
        '#background': {
          height: '100%',
          width: '100%',
          background: `url(${config.background_url}) center no-repeat fixed`,
          'background-size': 'cover',
          'z-index': -1,
          position: 'fixed',
          top: 0,
          filter: `blur(${config.background_blur ? '5' : '0'}px)`,
          transition: 'all 0.3s linear',
        },
        '#background.cleek': {
          filter: 'blur(0)',
        },
        '#search-text,#search-button': {
          'border-radius': '30px 0 0 30px',
          background: 'none',
          border: '1px solid rgba(255,255,255,0.5)',
          filter: 'invert(0.4)',
        },
        '#search-button': {
          'border-radius': '0 30px 30px 0',
          'border-left': 'none',
          transition: 'all 0.2s ease-in-out',
        },
        '#search-text:focus,#search-button:hover': {
          filter: 'invert(0)',
        },
        '.title': {
          'margin-top': '70px',
          'font-size': '30px',
          color: '#f5f5f5',
          'text-shadow': '0 1px 10px #212121',
        },
        '.stoplight': {
          background: 'rgba(255, 23, 68, 0.6)',
          'margin-bottom': '10px',
          'text-align': 'center',
        },
        '.thread': {
          'text-align': 'center',
        },
        '.post,.post_hover,.menuitem': {
          'border-radius': '15px',
          background: 'rgba(0, 0, 0, 0.7)',
          'box-shadow': '5px 5px 30px black',
          transition: 'all 0.2s ease-in-out',
        },
        '.post,.post_hover': {
          'margin-bottom': '15px',
          'max-width': '40%',
          padding: 0,
        },
        '.meta': {
          background: 'rgba(0, 0, 0, 0.4)',
          'border-radius': '15px 15px 0 0',
          padding: '5px 10px 5px 10px',
          'text-align': 'left',
        },
        '.meta > *': {
          'word-break': 'break-all',
        },
        '.message': {
          margin: '0 10px',
          padding: '5px 0 10px',
          'text-align': 'left',
        },
        '.message > .escaped': {
          color: 'white',
        },
        '.message > .escaped > hr': {
          'border-top': '1px solid #616161',
        },
        '.meta > .number,.date,.margin_right': {
          color: '#bdbdbd',
        },
        '.be': {
          'margin-left': '5px',
        },
        '.escaped > a': {
          color: '#42a5f5',
          'text-shadow': '1px 1px 10px white',
          transition: 'all 0.2s ease-in-out',
        },
        '.escaped > a:hover': {
          'text-shadow': 'none',
        },
        '.meta a': {
          color: 'green',
        },
        'br,nav': {
          'user-select': 'none',
        },
        '.menuitem': {
          'box-shadow': '3px 3px 20px black',
        },
        '.menuitem:hover': {
          'box-shadow': '1px 1px 20px black',
        },
        '.footer': {
          padding: '50px 0 20px 0',
        },
        '.search-logo': {
          filter: 'invert(0.5)',
          transition: 'all 0.2s ease-in-out',
        },
        '.search-logo:hover': {
          filter: 'invert(1)',
        },
        '#post-form-inner': {
          background: 'rgba(0, 0, 0, 0.7)',
          border: 'none',
        },
        '.navbar-fixed-top,.pagestats,.menuitem,.topmenu,.bottommenu,.post,.post_hover': {
          border: 'none',
          color: 'white',
        },
        '.socialmedia,#banner,.ad--right,.ad--bottom': {
          display: 'none',
        },
        '.post[data-id="1002"]': {
          display: 'none',
        },
        '.margin_right': {
          'margin-right': '5px',
        },
        // https://qiita.com/semind/items/e18d5f3131de4904b2c9
        '.rainbow': {
          background: 'linear-gradient(to right,rgb(255,0,0),rgb(255,69,0),rgb(255,255,0),rgb(0,128,0),rgb(0,0,255),rgb(75,0,130),rgb(238,130,238))',
          'background-clip': 'text',
        },
        '.meta.rainbow *,.message.rainbow *': {
          color: 'transparent',
        },
        '.post img': {
          'max-width': '100%',
        },
        '#scroll': {
          position: 'fixed',
          background: 'rgba(0, 0, 0, 0.9)',
          width: '60px',
          height: '60px',
          'border-radius': '50px',
          right: '30px',
          bottom: '30px',
          'z-index': '9999',
          'font-size': '50px',
          'text-align': 'center',
        },
      },
      lang: {
        '.menuitem:contains(全部)': 'All',
        '.menuitem:contains(最新50)': 'Latest 50',
        '.menuitem:contains(スマホ版)': 'Mobile (Not Supported)',
        '.menuitem:contains(掲示板に戻る)': 'Back to Board Top',
        '.menuitem:contains(ULA版)': 'ULA (Not Supported)',
        '.metastats:contains(コメント)': ['コメント', ' Comments'],
      },
      script: () => {
        let long_timer
        let long_cleek = false
        $('body').append('<div id=\'scroll\'><b>↓</b></div>')
        $(window).scroll(function () {
          if ($(this).scrollTop() > $(window).height()) $('#scroll').text('↑').addClass('top')
          else $('#scroll').text('↓').removeClass('top')
        })
        $(document).on('click', '#scroll', function () { $('html').stop().animate({ scrollTop: $(this).hasClass('top') ? 0 : $(document).height() }, 500) })
        $('.container_body').append('<div id="background"></div>')
        $('#background')
          .on('dblclick', () => $('#background').toggleClass('cleek'))
          .on('mouseup', () => {
            if (long_cleek) $('#background').attr('style', `background:url(${config.background_url}?${new Date().getTime()}) center no-repeat fixed!important`)
            long_cleek = false
            clearTimeout(long_timer)
            return true
          })
          .on('mousedown', () => {
            long_timer = setTimeout(() => long_cleek = true, 500)
            return true
          })
        $('.post').hover(function () {
          const element = $(this).attr('data-userid') ? `.post[data-userid="${$(this).attr('data-userid')}"]` : this
          $(element).attr('style', 'transform:scale(1.05, 1.05)!important;box-shadow:none!important')
        }, function () {
          const element = $(this).attr('data-userid') ? `.post[data-userid="${$(this).attr('data-userid')}"]` : this
          $(element).removeAttr('style')
        })
        $(window).on('load', () => {
          const ids = []
          $('.post[data-id="1001"] .name b').text('ｵｰﾊﾞｰｽﾚｯﾄﾞｩ')
          if ($('#1 hr').length) {
            const nodevalu = $('#1 hr')[0].nextSibling.nodeValue
            if (nodevalu.includes(':vvvvv:'))
              $('#1 .escaped').append('<br><span class=\'gray_om\'>強制コテハン</span>')
            else if (nodevalu.includes(':vvvvvv:'))
              $('#1 .escaped').append('<br><span class=\'gray_om\'>強制コテハン + IP表示</span>')
            else if (nodevalu.includes(':none:'))
              $('#1 .escaped').append('<br><span class=\'gray_om\'>ID非表示</span>')
            else
              $('#1 .escaped').append('<br><span class=\'gray_om\'>めんどいからここらへんみとけ<br>https://info.5ch.net/index.php/新生VIPQ2#.21extend:<br>https://info.5ch.net/index.php/BBS_SLIP</span>')
          }
          if ($('#\\31').attr('data-userid')) $(`.post[data-userid="${$('#\\31').attr('data-userid')}"] > .meta .name`).each(function () { $(this).after('<span class=\'margin_right\'>(スレ主)</span>') })
          $('.uid').each(function () {
            if (!$(this).text()) return $(this).css('color', '#bdbdbd').attr('title', 'IDないですこの人').text('No')
            const id = $(this).text().slice(3)
            $(this).text(id !== 'ead' ? id : 'Thread')
            const ids_ = ids.filter(item => item[0] === id)
            if (!ids_.length) {
              if (id === 'ead') return $(this).parents('.post').children('.meta,.message').addClass('rainbow')
              const color = generateColor()
              ids.push([id, color])
              if (id.toLowerCase().includes('krsw')) console.info(`KRSW Included: ${id}`)
              console.info(`%cID: ${id}, #${color}`, `color:#${color}`)
              $(this).attr('title', `#${color}`)
              return $(this).css('color', `#${color}`)
            }
            $(this).attr('title', `#${ids_[0][1]}`)
            return $(this).css('color', `#${ids_[0][1]}`)
          })
          $('.name b a[href^="mailto:"]').each(function () {
            let supeisharu = ['ﾌﾒｲ', $(this).attr('href').slice(7)]
            if (supeisharu[1] === 'sage') supeisharu[0] = 'ｻｹﾞ'
            else if (supeisharu[1] === 'age') supeisharu[0] = 'ｱｹﾞ'
            else if (['agete', 'sagete'].includes(supeisharu[1])) {
              if ($(this).contents().first()[0].textContent === 'Please Click Ad !!＠アドセンスクリックお願いします ')
                $(this).contents().first()[0].textContent = 'Please Install Adblock !!＠アドブロックインストールお願いします'
              $(this).children('small').css('margin-left', '5px')
              supeisharu[0] = supeisharu[1] === 'agete' ? 'ｱｹﾞﾛｰ' : 'ｻｹﾞﾛｰ'
            }
            else if (supeisharu[1].test(/@(yahoo.co.jp)$/)) supeisharu[0] === 'ﾔﾎｰ'
            else if (supeisharu[1].test(/@(protonmail.com|protonmail.ch|pm.me)$/)) supeisharu[0] === 'ﾌﾟﾛﾄ'
            $(this).parents('.meta').children('.date').before(`<a class='margin_right' href='${$(this).attr('href')}' title='${supeisharu[1]}' style='color:#81c784!important'>(${supeisharu[0]})</a>`)
          })
          $('.name a[href^="mailto:"]').each(function () { $(this).removeAttr('href') })
        })
        $('.date').each(function () {
          $(this).html($(this).text().replace(' ', '<span style="margin-right:5px!important"></span>'))
        })
      },
    },
  }
  Object.keys(preset).map(item => {
    const path = preset[item]
    if (item.startsWith('global')) {
      const global_match = location.hostname.endsWith(path.hostname)
      console.info(`%cMatch: global - ${path.hostname} - ${global_match}`, `color:${global_match ? 'green' : 'red'}`)
      if (global_match) {
        $('head').append(`<style type="text/css">${parse_json(path.style)}</style>`)
        return path.script()
      }
    }
    let url = location.href
    if (!preset[item].protocol) url = location.href.slice(location.protocol.length + 2)
    const match = new RegExp(`^${item}$`).test(url)
    console.info(`%cMatch: ^${item}$ - ${url} - ${match}`, `color:${match ? 'green' : 'red'}`)
    if (match) {
      if (typeof path.style === 'object') $('head').append(`<style type="text/css">${parse_json(path.style)}</style>`)
      if (typeof path.lang === 'object') Object.keys(path.lang).map(item => {
        if (typeof path.lang[item] === 'string')
          $(item).text(path.lang[item])
        else if (typeof path.lang[item] === 'object')
          $(item).html($(item).html().replace(path.lang[item][0], path.lang[item][1]))
      })
      if (typeof path.script === 'function') path.script()
    }
  })

})()
