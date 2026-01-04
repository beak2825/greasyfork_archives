// ==UserScript==
// @name        英文小说网舒适阅读 - tingroom.com
// @namespace   Violentmonkey Scripts
// @match       http://novel.tingroom.com/*.html
// @grant       none
// @version     1.0
// @author      Fc-404
// @license     MIT
// @description 2022/6/4 09:20:54
// @downloadURL https://update.greasyfork.org/scripts/446028/%E8%8B%B1%E6%96%87%E5%B0%8F%E8%AF%B4%E7%BD%91%E8%88%92%E9%80%82%E9%98%85%E8%AF%BB%20-%20tingroomcom.user.js
// @updateURL https://update.greasyfork.org/scripts/446028/%E8%8B%B1%E6%96%87%E5%B0%8F%E8%AF%B4%E7%BD%91%E8%88%92%E9%80%82%E9%98%85%E8%AF%BB%20-%20tingroomcom.meta.js
// ==/UserScript==

(function () {
  var area = document.getElementsByClassName('area')
  var fontSize = document.getElementsByClassName('fontSize')[0]
  var shouc = document.getElementsByClassName('shouc')[0]
  var titleNext = document.getElementsByClassName('title')[0].nextSibling.nextSibling
  var a = document.querySelectorAll('#tt_text a')
  var circle = document.getElementsByClassName('circle')
  var text = document.getElementById('tt_text')
  var jsreadbox = document.getElementById('jsreadbox')
  var wz_jx = document.getElementById('wz_jx')
  var text_ad = wz_jx.previousSibling.previousSibling.previousSibling.previousSibling
  var wz_ad = text.lastChild.previousSibling
  var aream = document.getElementsByClassName('aream')[0]
  var dictShow = _dictShow

  var adaptON = function () {
    var onLayout = document.createElement('div')
    onLayout.innerText = 'OFF'
    onLayout.style.cssText = 'width: 30px;\
                              height: 20px;\
                              position: fixed;\
                              top: 12px;\
                              right: 12px;\
                              border-radius: 6px;\
                              text-align: center;\
                              line-height: 20px;\
                              user-select: none;\
                              background-color: #DA7C79;\
                              color: #FFF;\
                              '
    document.body.appendChild(onLayout)

    var positionCookieLoop

    var ON = () => {
      for (let i = 0; i < area.length; i++) {
        area[i].style.display = 'none'
      }
      for (let i = 0; i < circle.length; i++) {
        circle[i].style.display = 'none'
      }
      for (let i = 0; i < a.length; i++) {
        a[i].style.pointerEvents = 'none'
        a[i].style.color = '#fff'
      }
      _dictShow = () => { }
      onLayout.innerText = 'ON'
      onLayout.style.backgroundColor = '#408F5C'
      fontSize.style.display = 'none'
      shouc.style.display = 'none'
      titleNext.style.display = 'none'
      text.style.cssText = 'font-size: 20px;\
                            font-weight: 200;\
                            line-height: 56px;\
                            color: #e5e5e5;\
                            '
      document.body.style.backgroundColor = '#2b2b2b'
      jsreadbox.style.backgroundColor = '#2b2b2b'
      jsreadbox.style.borderColor = '#5e5e5e'
      wz_jx.style.display = 'none'
      text_ad.style.display = 'none'
      wz_ad.style.display = 'none'
      aream.style.display = 'none'

      positionCookieLoop = setInterval(() => {
        var url = window.location.href.replace(
          new RegExp('^(http://)[^\n\r/]*(/){0,1}', 'g')
          , '/')
        document.cookie = 'position=' 
                        + document.documentElement.scrollTop
                        + '; path='
                        + url
      }, 3000)

      if (getCookie('position')) {
        document.documentElement.scrollTop = Number(getCookie('position'))
      }
    }

    var OFF = () => {
      for (var i = 0; i < area.length; i++) {
        area[i].style.display = ''
      }
      for (let i = 0; i < circle.length; i++) {
        circle[i].style.display = ''
      }
      for (let i = 0; i < a.length; i++) {
        a[i].style.pointerEvents = ''
        a[i].style.color = ''
      }
      _dictShow = dictShow
      onLayout.innerText = 'OFF'
      onLayout.style.backgroundColor = '#DA7C79'
      fontSize.style.display = ''
      shouc.style.display = ''
      titleNext.style.display = ''
      text.style.cssText = ''
      document.body.style.backgroundColor = ''
      jsreadbox.style.backgroundColor = ''
      jsreadbox.style.borderColor = ''
      wz_jx.style.display = ''
      text_ad.style.display = ''
      wz_ad.style.display = ''
      aream.style.display = ''

      clearInterval(positionCookieLoop)
    }

    onLayout.onclick = function () {
      if (this.innerText == 'OFF')
        ON()
      else
        OFF()
    }
  }()

  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i].trim();
      if (c.indexOf(name) == 0)
        return c.substring(name.length, c.length);
    }
    return "";
  }
}())


