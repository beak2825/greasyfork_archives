// ==UserScript==
// @name        去磁力搜搜网站反广告屏蔽
// @namespace   xman
// @description 自己用的，不公开了
// @version     1
// @grant       none
// @match        *://www.clsoso.com/*
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/33267/%E5%8E%BB%E7%A3%81%E5%8A%9B%E6%90%9C%E6%90%9C%E7%BD%91%E7%AB%99%E5%8F%8D%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/33267/%E5%8E%BB%E7%A3%81%E5%8A%9B%E6%90%9C%E6%90%9C%E7%BD%91%E7%AB%99%E5%8F%8D%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
//window.document.getElementById('nd73').parentNode.removeChild(window.document.getElementById('nd73'));
window.document.getElementById('ggg_tool').remove();
   document.getElementById('ggg_1').remove();
        document.getElementById('adtext_2').remove();
        document.getElementById('ggg_2').remove();
        document.getElementById('adtext_3').remove();
        document.getElementById('ggg_3').remove();
(function (l, m) {
  function n(a) {
    a && nd73.nextFunction()
  }
  var h = l.document,
  p = [
    'i',
    's',
    'u'
  ];
  n.prototype = {
    rand: function (a) {
      return Math.floor(Math.random() * a)
    },
    getElementBy: function (a, b) {
      return a ? h.getElementById(a)  : h.getElementsByTagName(b)
    },
    getStyle: function (a) {
      var b = h.defaultView;
      return b && b.getComputedStyle ? b.getComputedStyle(a, null)  : a.currentStyle
    },
    deferExecution: function (a) {
      setTimeout(a, 2000)
    },
    insert: function (a, b) {
      var e = h.createElement('center'),
      d = h.body,
      c = d.childNodes.length,
      g = d.style,
      f = 0,
      k = 0;
      if ('nd73' == b) {
        e.setAttribute('id', b);
        g.margin = g.padding = 0;
        g.height = '100%';
        for (c = this.rand(c); f < c; f++)
        1 == d.childNodes[f].nodeType && (k = Math.max(k, parseFloat(this.getStyle(d.childNodes[f]).zIndex) || 0));
        k && (e.style.zIndex = k + 1);
        c++
      }
      e.innerHTML = a;
      d.insertBefore(e, d.childNodes[c - 1])
    },
    displayMessage: function (a) {
      var b = this;
      a = 'abisuq'.charAt(b.rand(5));
      //b.insert('<' + a + '>Please disable your ad blocker!<br>网站需要发展，请禁用广告屏蔽插件!<br>網站需要發展，請禁用廣告屏蔽插件!<br>ウェブサイトの掲示板では、とある件は不必要な広告で広告!  <img src="http://clsoso.com/static/logo_adblock.png" width="512" height="128"><a href="http://www.clsoso.com?adblock">[ ? ]</a>' + ('</' + a + '>'), 'nd73');
      h.addEventListener && b.deferExecution(function () {
        b.getElementBy('nd73').addEventListener('DOMNodeRemoved', function () {
          //b.displayMessage()
        }, !1)
      })
    },
    i: function () {
      for (var a = 'ADInterest,adPosOne,ad_B1,ad_rail,divMenuAds,index_ad,ylf-lrec,ad,ads,adsense'.split(','), b = a.length, e = '', d = this, c = 0, g = 'abisuq'.charAt(d.rand(5)); c < b; c++)
      d.getElementBy(a[c]) || (e += '<' + g + ' id="' + a[c] + '"></' + g + '>');
      d.insert(e);
      d.deferExecution(function () {
        for (c = 0; c < b; c++) if (null == d.getElementBy(a[c]).offsetParent || 'none' == d.getStyle(d.getElementBy(a[c])).display) return d.displayMessage('#' + a[c] + '(' + c + ')');
        d.nextFunction()
      })
    },
    s: function () {
      var a = {
        'pagead2.googlesyndic': 'google_ad_client',
        'js.adscale.de/getads': 'adscale_slot_id',
        'get.mirando.de/miran': 'adPlaceId'
      },
      b = this,
      e = b.getElementBy(0, 'script'),
      d = e.length - 1,
      c,
      g,
      f,
      k;
      h.write = null;
      for (h.writeln = null; 0 <= d; --d) if (c = e[d].src.substr(7, 20), a[c] !== m) {
        f = h.createElement('script');
        f.type = 'text/javascript';
        f.src = e[d].src;
        g = a[c];
        l[g] = m;
        f.onload = f.onreadystatechange = function () {
          k = this;
          l[g] !== m || k.readyState && 'loaded' !== k.readyState && 'complete' !== k.readyState || (l[g] = f.onload = f.onreadystatechange = null, e[0].parentNode.removeChild(f))
        };
        e[0].parentNode.insertBefore(f, e[0]);
        b.deferExecution(function () {
          if (l[g] === m) return b.displayMessage(f.src);
          b.nextFunction()
        });
        return
      }
      b.nextFunction()
    },
    u: function () {
      var a = '-ads-ns.,.ar/ads/,.tv/ads.,/ad_120_,/adcreative/ad,/adperfdemo.,/eng/ads/ad,/pencilad.,_topad.,-468-100.'.split(','),
      b = this,
      e = b.getElementBy(0, 'img'),
      d,
      c;
      e[0] !== m && e[0].src !== m && (d = new Image, d.onload = function () {
        c = this;
        c.onload = null;
        c.onerror = function () {
          p = null;
          b.displayMessage(c.src)
        };
        c.src = e[0].src + '#' + a.join('')
      }, d.src = e[0].src);
      b.deferExecution(function () {
        b.nextFunction()
      })
    },
    nextFunction: function () {
      var a = p[0];
      a !== m && (p.shift(), this[a]())
    }
  };
  l.nd73 = nd73 = new n;
  h.addEventListener ? l.addEventListener('load', n, !1)  : l.attachEvent('onload', n)
}) (window);
