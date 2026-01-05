// ==UserScript==
// @name        KissAnime Anti-Adblock Blocker
// @author      Swyter
// @contributor 7 Deadly
// @contributor BoLaMN
// @contributor shinji257
// @contributor Thorou
// @namespace   userscripts.org/user/swyter
// @description Not even the people from Easylist seem to fight this site anymore, someone had to try as this looks popular enough. *sigh*
// @match       *://kissanime.com/*
// @match       *://kisscartoon.me/*
// @match       *://kissanime.to/*
// @match       *://kissasian.com/*
// @match       *://kissmanga.com/*
// @match       *://readcomiconline.to/*
// @match       *://kissanime.ru/*
// @match       *://kisscartoon.se/*
// @match       *://kissasian.ch/*
// @match       *://kimcartoon.me/*
// @match       *://kissasian.sh/*
// @match       *://kimcartoon.to/*
// @match       *://kisstvshow.to/*
// @match       *://kimcartoon.li/*
// @version     2022.10.23
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/4900/KissAnime%20Anti-Adblock%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/4900/KissAnime%20Anti-Adblock%20Blocker.meta.js
// ==/UserScript==

console.log('Started KissAnime Anti-Adblock Blocker, waiting for the DOM to load...');

window.addEventListener('beforescriptexecute', function(e)
{
  /* typical js kludge, holy carp, that's convoluted! */
  var element_host = ((tmp = document.createElement('a')).href = e.target.src) && tmp.host;

  /* fix for KissGrabber; don't block jquery */
  if (element_host === 'code.jquery.com')
    return;

  /* fix GP/GUC hosted videos */
  if (element_host === 'vjs.zencdn.net')
    return;

  /* gnblizz reported a missing captcha, bail out there */
  if (element_host === 'www.sweetcaptcha.com' || element_host === 'apis.google.com')
    return;

  if (e.target.src && element_host !== document.domain &&
                      element_host !== document.domain.split('.')[0] + '.disqus.com') e.preventDefault();

  if (!e.target.src)
    for (var i of ['charCodeAt', 'window.BB_', 'taboola', 'plusone', 'analytics', 'AdBlock', 'TemporaryBlock'])
      if (e.target.textContent.indexOf(i) != -1)
        e.preventDefault();

  console.log('[i] blocking script element: ', e.defaultPrevented, e.target.src);
});

window.addEventListener('DOMContentLoaded', function(e)
{
  console.log('DOM loaded, processing stuff...');

  /* get rid of the cruft */
  for (var elem of document.querySelectorAll(`
     iframe[src*='ad']:not([src*='openload']):not([src*='fbsbx']):not([src*='mp4upload']),
    .divCloseBut,
    .clear2,
     div[style*='!important'],
     iframe[style*='!important'][src^='/'],
     div[id^='divFloat'],
    .episodeList div[style$='float: left;'],
    .episodeList .clear,
     div[style$='height:80px'],
     img[id^='adCheck'],
     div[id^=adsFloat][style],
     div[id^=btnClose],
     div[style*='width:800px'],
     div[id*=fl-ads].rf-container,
     div[id^=adsIfrme]:not([id=adsIfrme]),
     iframe[src*='Ads'],
     iframe[src*='facebook'],
     iframe[src*='mgi'][height='215'],
     div[style*='300px'][style*='250px'],
     div[style*='margin: 0px auto'],
     div[style*='height: 600px'],
     div[style*='820px'][style*='215px'],
     div[style*='728px'][style*='200px'],
     iframe[width='728px'][height='90px'],
     li#liFlappy, li#liReportError,
     body > script[src],
     script[data-cfasync],
     div[style*='728px'][style*='90px'],
     div[id^='glx-'],
     div[id=videoAd],
     div[class^=kcAds],
    .adsbyvli,
    .adbWarnContainer
  `))
  {
    console.log('[-] removing cruft: ', elem);
    elem.parentElement.removeChild(elem);
  }

  /* show the comic pages and comment buttons; they are hidden (display: none) by default */
  (img = document.querySelector("div#divImage[style]"))                    && (img.style.display = "block");
  (com = document.querySelector("a#btnShowComments.specialButton[style]")) && (com.style.display = "inline-block");

  /* let's hook the AJAX requests, just in case, and filter out the so-called 'ban'
     avoiding potential fake points loss and such, what a scummy move by the site owner */
  (function (xhr_proto_open)
  {
    window.XMLHttpRequest.prototype.open = function(method, url)
    {
      if (url.match(/ban|Banned|GotBanned|TemporaryBlock|AGBXSKCSYWBSDAPOLA/gi) !== null)
      {
        console.info("[x] intercepted shitty 'ban' request!", arguments); this.abort();
      }
      else
      {
        xhr_proto_open.apply(this, arguments);
      }
    };
  }(XMLHttpRequest.prototype.open));

  /* override the check in Chrome and call it a day */
  for (var i of ['DoDetect2', 'YANMKABFYWRW', 'HAYNQMAKDASAS', 'YANABWEKA', 'YASBATMBCL'])
    try
    {
      Object.defineProperty(window, i,
      {
        configurable: false,
        writable: false,
        value: function()
        {
          console.info(`[/] ${i} check overriden!`);
        }
      });
    } catch(e) {}
});