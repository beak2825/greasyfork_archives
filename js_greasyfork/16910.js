if (!window.InstantClick) {
/* InstantClick 3.1.0 | (C) 2014 Alexandre Dieulot | http://instantclick.io/license */
// With added respeedcancel event
var InstantClick=function(d,e){function w(a){var b=a.indexOf("#");return 0>b?a:a.substr(0,b)}function z(a){for(;a&&"A"!=a.nodeName;)a=a.parentNode;return a}function A(a){var b=e.protocol+"//"+e.host;if(!(b=a.target||a.hasAttribute("download")||0!=a.href.indexOf(b+"/")||-1<a.href.indexOf("#")&&w(a.href)==k)){if(J){a:{do{if(!a.hasAttribute)break;if(a.hasAttribute("data-no-instant"))break;if(a.hasAttribute("data-instant")){a=!0;break a}}while(a=a.parentNode);a=!1}a=!a}else a:{do{if(!a.hasAttribute)break;
if(a.hasAttribute("data-instant"))break;if(a.hasAttribute("data-no-instant")){a=!0;break a}}while(a=a.parentNode);a=!1}b=a}return b?!1:!0}function t(a,b,c,g){for(var d=!1,e=0;e<B[a].length;e++)if("receive"==a){var f=B[a][e](b,c,g);f&&("body"in f&&(c=f.body),"title"in f&&(g=f.title),d=f)}else B[a][e](b,c,g);return d}function K(a,b,c,g){d.documentElement.replaceChild(b,d.body);if(c){history.pushState(null,null,c);b=c.indexOf("#");b=-1<b&&d.getElementById(c.substr(b+1));g=0;if(b)for(;b.offsetParent;)g+=
b.offsetTop,b=b.offsetParent;scrollTo(0,g);k=w(c)}else scrollTo(0,g);d.title=S&&d.title==a?a+String.fromCharCode(160):a;L();C.done();t("change",!1);a=d.createEvent("HTMLEvents");a.initEvent("instantclick:newpage",!0,!0);dispatchEvent(a)}function M(a){G>+new Date-500||(a=z(a.target))&&A(a)&&x(a.href)}function N(a){G>+new Date-500||(a=z(a.target))&&A(a)&&(a.addEventListener("mouseout",T),H?(O=a.href,l=setTimeout(x,H)):x(a.href))}function U(a){G=+new Date;(a=z(a.target))&&A(a)&&(D?a.removeEventListener("mousedown",
M):a.removeEventListener("mouseover",N),x(a.href))}function V(a){var b=z(a.target);!b||!A(b)||1<a.which||a.metaKey||a.ctrlKey||(a.preventDefault(),P(b.href))}function T(){l?(clearTimeout(l),l=!1):v&&!m&&(p.abort(),t("respeedcancel"),m=v=!1)}function W(){if(!(4>p.readyState)&&0!=p.status){q.ready=+new Date-q.start;if(p.getResponseHeader("Content-Type").match(/\/(x|ht|xht)ml/)){var a=d.implementation.createHTMLDocument("");a.documentElement.innerHTML=p.responseText.replace(/<noscript[\s\S]*?<\/noscript>/gi,"");y=a.title;
u=a.body;var b=t("receive",r,u,y);b&&("body"in b&&(u=b.body),"title"in b&&(y=b.title));b=w(r);h[b]={body:u,title:y,scrollY:b in h?h[b].scrollY:0};for(var a=a.head.children,b=0,c,g=a.length-1;0<=g;g--)if(c=a[g],c.hasAttribute("data-instant-track")){c=c.getAttribute("href")||c.getAttribute("src")||c.innerHTML;for(var e=E.length-1;0<=e;e--)E[e]==c&&b++}b!=E.length&&(F=!0)}else F=!0;m&&(m=!1,P(r))}}function L(a){d.body.addEventListener("touchstart",U,!0);D?d.body.addEventListener("mousedown",M,!0):d.body.addEventListener("mouseover",
N,!0);d.body.addEventListener("click",V,!0);if(!a){a=d.body.getElementsByTagName("script");var b,c,g,e;i=0;for(j=a.length;i<j;i++)b=a[i],b.hasAttribute("data-no-instant")||(c=d.createElement("script"),b.src&&(c.src=b.src),b.innerHTML&&(c.innerHTML=b.innerHTML),g=b.parentNode,e=b.nextSibling,g.removeChild(b),g.insertBefore(c,e))}}function x(a){!D&&"display"in q&&100>+new Date-(q.start+q.display)||(l&&(clearTimeout(l),l=!1),a||(a=O),v&&(a==r||m))||(v=!0,m=!1,r=a,F=u=!1,q={start:+new Date},t("fetch"),
p.open("GET",a),p.send())}function P(a){"display"in q||(q.display=+new Date-q.start);l||!v?l&&r&&r!=a?e.href=a:(x(a),C.start(0,!0),t("wait"),m=!0):m?e.href=a:F?e.href=r:u?(h[k].scrollY=pageYOffset,m=v=!1,K(y,u,r)):(C.start(0,!0),t("wait"),m=!0)}var I=navigator.userAgent,S=-1<I.indexOf(" CriOS/"),Q="createTouch"in d,k,O,l,G,h={},p,r=!1,y=!1,F=!1,u=!1,q={},v=!1,m=!1,E=[],J,D,H,B={fetch:[],receive:[],wait:[],change:[],respeedcancel:[]},C=function(){function a(a,e){n=a;d.getElementById(f.id)&&d.body.removeChild(f);f.style.opacity=
"1";d.getElementById(f.id)&&d.body.removeChild(f);g();e&&setTimeout(b,0);clearTimeout(l);l=setTimeout(c,500)}function b(){n=10;g()}function c(){n+=1+2*Math.random();98<=n?n=98:l=setTimeout(c,500);g()}function g(){h.style[k]="translate("+n+"%)";d.getElementById(f.id)||d.body.appendChild(f)}function e(){d.getElementById(f.id)?(clearTimeout(l),n=100,g(),f.style.opacity="0"):(a(100==n?0:n),setTimeout(e,0))}function m(){f.style.left=pageXOffset+"px";f.style.width=innerWidth+"px";f.style.top=pageYOffset+
"px";var a="orientation"in window&&90==Math.abs(orientation);f.style[k]="scaleY("+innerWidth/screen[a?"height":"width"]*2+")"}var f,h,k,n,l;return{init:function(){f=d.createElement("div");f.id="instantclick";h=d.createElement("div");h.id="instantclick-bar";h.className="instantclick-bar";f.appendChild(h);var a=["Webkit","Moz","O"];k="transform";if(!(k in h.style))for(var b=0;3>b;b++)a[b]+"Transform"in h.style&&(k=a[b]+"Transform");var c="transition";if(!(c in h.style))for(b=0;3>b;b++)a[b]+"Transition"in
h.style&&(c="-"+a[b].toLowerCase()+"-"+c);a=d.createElement("style");a.innerHTML="#instantclick{position:"+(Q?"absolute":"fixed")+";top:0;left:0;width:100%;pointer-events:none;z-index:2147483647;"+c+":opacity .25s .1s}.instantclick-bar{background:#29d;width:100%;margin-left:-100%;height:2px;"+c+":all .25s}";d.head.appendChild(a);Q&&(m(),addEventListener("resize",m),addEventListener("scroll",m))},start:a,done:e}}(),R="pushState"in history&&(!I.match("Android")||I.match("Chrome/"))&&"file:"!=e.protocol;
return{supported:R,init:function(){if(!k)if(R){for(var a=arguments.length-1;0<=a;a--){var b=arguments[a];!0===b?J=!0:"mousedown"==b?D=!0:"number"==typeof b&&(H=b)}k=w(e.href);h[k]={body:d.body,title:d.title,scrollY:pageYOffset};for(var b=d.head.children,c,a=b.length-1;0<=a;a--)c=b[a],c.hasAttribute("data-instant-track")&&(c=c.getAttribute("href")||c.getAttribute("src")||c.innerHTML,E.push(c));p=new XMLHttpRequest;p.addEventListener("readystatechange",W);L(!0);C.init();t("change",!0);addEventListener("popstate",
function(){var a=w(e.href);a!=k&&(a in h?(h[k].scrollY=pageYOffset,k=a,K(h[a].title,h[a].body,!1,h[a].scrollY)):e.href=e.href)})}else t("change",!0)},on:function(a,b){B[a].push(b)}}}(document,location);
}

if (location.host == 'www.jeuxvideo.com'
    && !!document.querySelector('html').lang // Donâ€™t load when we display a script/stylesheet, at least Chrome Tampermonkey does load userscripts there
    && location.pathname.substr(1, 12) != 'screenshots/') { // Many layout bugs on the Visionneuse, and itâ€™s useless there



  /***** VARIABLES *****/

  var checkFooterFilledInterval
    , footerHtml = '<div class="liens-pied"><div class="container container-empty"><ul><li><span class="JvCare 1F424F49CB4A42CB19C045C0 a-footer">Contact</span></li><li><span class="JvCare 1F4E4A4648444FC14E19C045C0 a-footer">L\'Ã©quipe</span></li><li><span class="JvCare 1F424FC0C6C1464C45CB1945CB4E a-footer">Informations lÃ©gales</span></li><li><span class="JvCare 1F424CC31945CB4E a-footer">C.G.U.</span></li><li><span class="JvCare 1F4943CCC24843CBCB43C11F a-footer">Newsletter</span></li><li><span class="JvCare 1FC04AC1CB43494A46C143C21945CB4E a-footer">Partenaires</span></li><li><span class="JvCare 1F4DC4C54E481945CB4E a-footer">RSS</span></li><li><span class="JvCare 1FC14342C1C3CB431945CB4E a-footer">Jobs</span></li></ul>      <p>jeuxvideo.com, c\'est Ã©ditÃ© par L\'OdyssÃ©e Interactive, sociÃ©tÃ© du groupe <span class="JvCare 45CBCBC02D1F1FCCCCCC19CC4341434B464A1944C11F a-footer" rel="external" target="_blank">Webedia</span>. FrÃ©quentation certifiÃ©e par l\'<span class="JvCare 45CBCBC02D1F1FCCCCCC194F4D4B1E4649CB43C14943CB19424F4E1F4245464444C143C21E4649CB43C14943CB1F2C232A201E4D43C3C5C4464B434F19424F4E a-footer" rel="external" target="_blank">OJD</span><br>Copyright Â© 1997-2014 <span rel="external" class="JvCare 45CBCBC02D1F1FCCCCCC194F4BC6C2C243431E4649CB43C14A42CB46C44319424F4E1F a-footer" target="_blank">L\'OdyssÃ©e Interactive</span> Tous droits rÃ©servÃ©s.</p><script src="/static/1.18.3/js/hp.js" type="text/javascript"></script><script src="/static/1.18.3/js/forum.js" type="text/javascript"></script></div></div>'
    , scriptsBlackList = [
        ''
        
      ]
    , styleSheets = [
        '/static/1.18.3/css/skin-common.css',
        '/static/1.18.3/css/skin-forum.css',
        '/static/1.18.3/css/skin-common.css',
        '/static/1.18.3/css/skin-hp.css'
      ]
    , locationHost = location.protocol + '//' + location.host
    , previousPage = location.pathname + location.search
    , previousScroll = 0
    , slowSiteWarningTimer
    , statsLastHover = false
    , statsClicksMinusHovers = []
    , statsLastMousedown = false
    , statsClicksMinusMousedowns = []
    , statsCancels = []
    , statsMousewheelsMinusHovers = []
    , version = localStorage.RespeedVersion



  /***** FUNCTIONS *****/

  function debug(msg) {
    if (!('RespeedDebug' in localStorage) && localStorage.RespeedDebug != '0') {
      return
    }
    console.log(typeof msg == 'string' ? ('Respeed: ' + msg) : msg)
  }

  function cleanJvCare(node) {
    var spans = node.querySelectorAll('.JvCare')
      , attributes = 'target rel title id'.split(' ')
      , base16 = '0A12B34C56D78E9F'
      , anchor
      , span
      , attribute
      , attributeValue
      , spanParent
      , j
      , spanClasses
      , hiddenHref
      , realHref

    for (var i = 0; i < spans.length; i++) {
      span = spans[i]
      anchor = document.createElement('a')

      anchor.setAttribute('respeed-jvcare', '')
      for (j = 0; j < attributes.length; j++) {
        attribute = attributes[j]
        if (attributeValue = span.getAttribute(attribute)) {
          anchor.setAttribute(attribute, attributeValue)
        }
      }
      anchor.innerHTML = span.innerHTML

      anchor.classList.add('xXx')
      spanClasses = span.classList
      hiddenHref = spanClasses[1]
      realHref = ''
      for (j = 0; j < hiddenHref.length; j += 2) {
        realHref += String.fromCharCode(base16.indexOf(hiddenHref[j]) * 16 + base16.indexOf(hiddenHref[j + 1]))
      }
      anchor.href = realHref

      for (j = 2; j < spanClasses.length; j++) {
        anchor.classList.add(spanClasses[j])
      }

      spanParent = span.parentNode
      spanParent.insertBefore(anchor, span)
      spanParent.removeChild(span)
    }
    return node
  }

  function showSlowSiteWarning() {
    var element = document.createElement('div')
    element.id = 'slowSiteWarningContainer'
    element.innerHTML = '<div id="slowSiteWarning">Le site met du temps Ã  chargerâ€¦</div>'
    document.body.appendChild(element)
  }

  function removeSlowSiteWarning() {
    var element = document.getElementById('slowSiteWarningContainer')
    if (element) {
      document.body.removeChild(element)
    }
  }

  function processDelayStats() {
    localStorage.RespeedStatsClicksMinusHovers3 = statsClicksMinusHovers.join(' ')
    localStorage.RespeedStatsClicksMinusMousedowns3 = statsClicksMinusMousedowns.join(' ')
    localStorage.RespeedStatsCancels3 = statsCancels.join(' ')
    localStorage.RespeedStatsMousewheelsMinusHovers3 = statsMousewheelsMinusHovers.join(' ')

    if (statsClicksMinusHovers.length >= 50) {
      var xhrStats = new XMLHttpRequest()
        , params = ''

      params += 'clicks_minus_hovers=' + localStorage.RespeedStatsClicksMinusHovers3
      params += '&clicks_minus_mousedowns=' + localStorage.RespeedStatsClicksMinusMousedowns3
      params += '&cancels=' + localStorage.RespeedStatsCancels3
      params += '&mousewheels_minus_hovers=' + localStorage.RespeedStatsMousewheelsMinusHovers3
      params += '&version=' + version

      xhrStats.open('POST', 'http://respeed.' + ('RespeedSendStatsToDev' in localStorage ? 'dev' : 'fr') + '/collect_delays')
      xhrStats.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhrStats.send(params)

      statsClicksMinusHovers = []
      localStorage.removeItem('RespeedStatsClicksMinusHovers2')
      statsClicksMinusMousedowns = []
      localStorage.removeItem('RespeedStatsClicksMinusMousedowns')
      statsCancels = []
      localStorage.removeItem('RespeedStatsCancels2')
      statsMousewheelsMinusHovers = []
      localStorage.removeItem('RespeedStatsMousewheelsMinusHovers3')
    }
  }

  function getLinkTarget(target) {
    while (target && target.nodeName != 'A') {
      target = target.parentNode
    }
    return target
  }

  function removeLocalStorageItems() {
    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i] in localStorage) {
        localStorage.removeItem(arguments[i])
      }
    }
  }



  /***** ON FETCH *****/

  InstantClick.on('fetch', function() {
    /* Delay stats */
    statsLastHover = +new Date

    // Update vars from localStorage, because if the user uses multiple tabs each Respeed
    // instance will overwrite on top of each other
    if ('RespeedStatsClicksMinusHovers2' in localStorage && localStorage.RespeedStatsClicksMinusHovers2 != statsClicksMinusHovers.join(' ')) {
      statsClicksMinusHovers = localStorage.RespeedStatsClicksMinusHovers2.split(' ')
      statsClicksMinusMousedowns = localStorage.RespeedStatsClicksMinusMousedowns.split(' ')
    }
    if ('RespeedStatsCancels2' in localStorage && localStorage.RespeedStatsCancels2 != statsCancels.join(' ')) {
      statsCancels = localStorage.RespeedStatsCancels2.split(' ')
    }
  })



  /***** ON RECEIVE *****/

  InstantClick.on('receive', function(url, body, title) {
    ;[].forEach.call(body.getElementsByTagName('script'), function (script) {
      var src = script.getAttribute('src')
      var index = scriptsBlackList.indexOf(src)
      if ((index > -1 || !src || !RegExp("^/(js|jwplayer)/").test(src)) && script.innerHTML.indexOf('var id_forum') == -1) {
        script.setAttribute('data-no-instant', '')
      }
    })

  /*  var jv_feedback = body.querySelector('#jv-feedback')
    if (jv_feedback) {
      body.removeChild(jv_feedback)
    }*/

    var prospect = body.querySelector('#prospect')
    if (prospect) {
      prospect.setAttribute('hidden', '')
    }

    var jv_footer = body.querySelector('#jv-footer')
    if (jv_footer) {
      jv_footer.innerHTML = footerHtml
    }
    clearInterval(checkFooterFilledInterval)

    var image_dstats = body.querySelector('#image_dstats')
    if (image_dstats) {
      image_dstats.parentNode.removeChild(image_dstats)
    }

    body = cleanJvCare(body)

    previousScroll = scrollY

    return {
      body: body
    }
  })



  /***** ON CHANGE *****/

  InstantClick.on('change', function(isInitialLoad) {
    /* Stats on mousedown */
    document.body.addEventListener('mousedown', function(e) {
      if (e.which > 1) {
        return
      }
      statsLastMousedown = +new Date
    })

    /* Stats on mousewheel clicks, Firefox */
    document.body.addEventListener('mouseup', function(e) {
      if (e.button != 1 || !getLinkTarget(e.target)) {
        return
      }
      if (statsLastHover) { // Not there if wheelclicking on a _blank link
        statsMousewheelsMinusHovers.push((+new Date) - statsLastHover)
        statsLastHover = false
      }
      processDelayStats()
    })

    ;[].forEach.call(document.querySelectorAll('.list-msg tr:not(.lu) .sujet-msg a'), function (non_lu) {
      non_lu.setAttribute('data-no-instant', '')
    })

    var messages_precedents = document.querySelector('.btn-25-msg')
    if (messages_precedents) {
      messages_precedents.setAttribute('data-no-instant', '')
    }

    ;[].forEach.call(document.querySelectorAll('.bloc-pre-right'), function (refreshContainer) {
      refreshContainer.innerHTML = '<a href="' + location.pathname + location.search + '"><span class="btn btn-actu-new-list-forum">Actualiser</span></a>'
    })

    ;[].forEach.call(document.querySelectorAll('a'), function (anchor) {
      // Some SSO links trigger an action
      if (anchor.href.substr(0, (locationHost + '/sso/').length) == locationHost + '/sso/') {
        var ssoPage = anchor.href.substr((locationHost + '/sso/').length).split('.')[0]
        if (['logout', 'delete', 'generate_password'].indexOf(ssoPage) > -1) {
          anchor.setAttribute('data-no-instant', '')
        }
      }
      else if (anchor.href.substr(0, (locationHost + '/gta/').length) == locationHost + '/gta/') {
        anchor.setAttribute('data-no-instant', '')
      }

      // Visionneuse
      if (anchor.href.substr(0, (locationHost + '/screenshots/').length) == locationHost + '/screenshots/') {
        anchor.setAttribute('data-no-instant', '')
      }
    })

    if (isInitialLoad) {
      var prospect = document.querySelector('#prospect')
      if (prospect) {
        prospect.setAttribute('hidden', '')
      }

      var jv_footer = document.querySelector('#jv-footer')
      if (jv_footer) {
        checkFooterFilledInterval = setInterval(function() {
          if (jv_footer.children.length) {
            jv_footer.innerHTML = footerHtml
            clearInterval(checkFooterFilledInterval)
          }
        }, 100)
      }
    }

    // Webedia backgrounds donâ€™t play well when switching pages with Respeed, so letâ€™s just disable them.
    ;[].forEach.call(document.querySelectorAll('style[id^=wads]'), function (adStyle) {
      adStyle.parentNode.removeChild(adStyle)
    })
    var backgroundAdClickElement = document.querySelector('#dds_clic')
    if (backgroundAdClickElement) {
      backgroundAdClickElement.parentNode.removeChild(backgroundAdClickElement)
    }

    // Refresh
    if (!isInitialLoad && previousPage == location.pathname + location.search) {
      if (previousScroll) {
        scroll(0, previousScroll)
      }
    }
    previousPage = location.pathname + location.search

    // Clear timer about slow site
    clearTimeout(slowSiteWarningTimer)
    removeSlowSiteWarning()

    /* Stats page views */
    localStorage.RespeedStatsPageViews++


    /* Stats delay to click */
    if (!isInitialLoad && statsLastHover) {
      statsClicksMinusHovers.push((+new Date) - statsLastHover)
      statsLastHover = false
      if (statsLastMousedown) {
        statsClicksMinusMousedowns.push((+new Date) - statsLastMousedown)
        statsLastMousedown = false
      }
      processDelayStats()
    }
    
  }) // end on change



  /***** ON WAIT *****/

  InstantClick.on('wait', function() {
    clearTimeout(slowSiteWarningTimer)
    slowSiteWarningTimer = setTimeout(showSlowSiteWarning, 1000)

    /* Stats delay to click */
    statsClicksMinusHovers.push((+new Date) - statsLastHover)
    statsLastHover = false
    if (statsLastMousedown) {
      statsClicksMinusMousedowns.push((+new Date) - statsLastMousedown)
      statsLastMousedown = false
    }
    processDelayStats()
  })



  /***** ON CANCEL *****/

  InstantClick.on('respeedcancel', function() {
    /* Stats delay to click */
    statsCancels.push((+new Date) - statsLastHover)
    processDelayStats()
    statsLastHover = false
    statsLastMousedown = false
  })



  /***** ON FIRST PAGE *****/

  ;[].forEach.call(document.querySelectorAll('link[rel=stylesheet]'), function (styleSheet) {
    var index = styleSheets.indexOf(styleSheet.getAttribute('href'))
    if (index > -1) {
      styleSheets[index] = ''
    }
  })

  styleSheets.forEach(function(href) {
    if (!href) {
      return
    }
    var linkElement = document.createElement('link')
    linkElement.rel = 'stylesheet'
    linkElement.href = href
    linkElement.setAttribute('via-respeed', '')
    document.head.appendChild(linkElement)
  })

 /*var jv_feedback = document.body.querySelector('#jv-feedback')
  if (jv_feedback) {
    document.body.removeChild(jv_feedback)
  }
  else {
    addEventListener('load', function() {
      document.body.removeChild(document.body.querySelector('#jv-feedback'))
    })
  }
*/
  var prospect_interstice = document.querySelector('#prospect-interstice')
  if (prospect_interstice) {
    prospect_interstice.setAttribute('hidden', '')
  }


  // Stylesheet
  var styleElement = document.createElement('style')
  styleElement.setAttribute('respeed', '')

  // Respeed hides the top ad banner, which will sometimes provoke a bug with the ad script,
  // the banner will be floating on the page, to remedy to that we simply hide the banner.
  styleElement.innerHTML = 'div div a img[galleryimg] { display: none; }';

  // Slow site warning toast
  styleElement.innerHTML += '@keyframes pulse { 40%, 60% { transform: scale(1.02); } }'
  styleElement.innerHTML += '@-webkit-keyframes pulse { 40%, 60% { -webkit-transform: scale(1.02); } }'
  styleElement.innerHTML += '#slowSiteWarningContainer { pointer-events: none; position: fixed; top: 9px; width: 100%; z-index: 1051; text-align: center; }'
  styleElement.innerHTML += '#slowSiteWarning { pointer-events: auto; cursor: default; right: 20px; display: inline-block; border: solid 1px rgba(0,0,0,.25); background: rgba(255,255,255,.9); color: #111; font-size: 13px; font-weight: bold; padding: 3px 9px; border-radius: 3px; animation: 200ms pulse ease-in-out; -webkit-animation: 200ms pulse ease-in-out; }'

  // InstantClick bar
  styleElement.innerHTML += '#instantclick-bar { background: rgba(255,255,255,.9); }'

  // Padding, as there isnâ€™t the ad to do it anymore
  styleElement.innerHTML += '#content:not([style]) { padding-top: 20px; }'

  document.head.appendChild(styleElement)


  // Stats
  // May someday be used to segment users and ask for feedback to the most active ones.
  if (!('RespeedStatsPageViews' in localStorage)) {
    localStorage.RespeedStatsPageViews = 0
  }
  if (!('RespeedStatsInstallDate' in localStorage)) {
    localStorage.RespeedStatsInstallDate = +new Date
  }


  document.querySelector('#RespeedScript').setAttribute('data-no-instant', '')
  // Without that, going back on the initial page through history would execute Respeed again


  /* Delete old localStorage variables */
  removeLocalStorageItems('RespeedStatsClicksMinusHovers', 'RespeedStatsCancels')
  removeLocalStorageItems('RespeedStatsClicksMinusHovers2', 'RespeedStatsClicksMinusMousedowns', 'RespeedStatsCancels2')


  /* Fetch delay stats from localStorage */
  if ('RespeedStatsClicksMinusHovers3' in localStorage) {
    statsClicksMinusHovers = localStorage.RespeedStatsClicksMinusHovers3.split(' ')
  }
  if ('RespeedStatsClicksMinusMousedowns3' in localStorage) {
    statsClicksMinusMousedowns = localStorage.RespeedStatsClicksMinusMousedowns3.split(' ')
  }
  if ('RespeedStatsMousewheelsMinusHovers3' in localStorage) {
    statsMousewheelsMinusHovers = localStorage.RespeedStatsMousewheelsMinusHovers3.split(' ')
  }
  if ('RespeedStatsCancels3' in localStorage) {
    statsCancels = localStorage.RespeedStatsCancels3.split(' ')
  }
  
  
    InstantClick.init()

} // end jeuxvideo.com block