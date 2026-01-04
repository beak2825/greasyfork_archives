// ==UserScript==
// @name         AC Content Manager Installation Buttons
// @namespace    http://tampermonkey.net/
// @homepageURL  https://github.com/gro-ove/actools-cm-download-extension
// @version      0.2.5
// @description  Adds Content Manager support to RSR Live Timing website, The Setup Market, AC Club and Assetto-DB.
// @author       x4fab
// @match        http://assettocorsa.club/*
// @match        http://www.assetto-db.com/*
// @match        http://assetto-db.com/*
// @match        http://thesetupmarket.com/*
// @match        http://www.radiators-champ.com/RSRLiveTiming/*
// @grant        none
// @license      MIT License
// @run-at       document-end
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRF/wAAzAAAmf8AmQAAZv8AZswAZpkAZmZmZjMzM5kAM2YzM2YAMzMzMzMAAAAAXl5e7+St3wAAABB0Uk5T////////////////////AOAjXRkAAAHSSURBVHjatNfZsoMgDIBhcGkUI7z/2x5Ay2ZiqM7hppNO/89ujqjcy6X+B1gWeAWA1q8A0OoV4PtXQOjfALF/ARz9c+DsHwPf/imQ+odA7p8BRV8B0AmUvRqh97xQZK8xRYseu4Cmz8fXqgIAm0mJfQWAtc2kxL4EfGGbSYl9AYTCNpMS+wzEwjaTSq/j+gQchW0mJR0/AWdhm8kDQn8C38I2UwWQ/QGkwjZTCdB9BHJhm6kAmD4ARWGbKQO+ByD68Lwtk3pKQHjdOMo9B8RejXLPAEcfAaGngbMPwE2/xQVm2/YG+PYeAL7fpyGsyT+sNZB6tdy9/31K61MBuVf67vOzQO6rdfn+OMB19jzQ2fMfobPngc7+F4DsfwDongSQAi49IgdguLSB2J+nzxVARwBE7y7AmvoLQPUO4mm4ZmCOTxg4AC317jNMxBqmE8ByUb0zE72A2icSvYOZ7I0IYLoOUsIGTgAwX4h3rr8ASPQewPZrGFZg9spEH7ZC0Agf4wQAm70ZbGU/oxMAvOztYKV6DkBib2jy/wmdACC5t8S5/APcAcjsTU9hA3cPILu3DUL6AVkAb/bGXkg/IAfc9Q6MAeGmC7tvNf715vuH9SfAAHw2q5zSfJAiAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/30672/AC%20Content%20Manager%20Installation%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/30672/AC%20Content%20Manager%20Installation%20Buttons.meta.js
// ==/UserScript==

(function() {
function _$(selector, fn, p){
  var e = (p || document).querySelector(selector);
  return fn ? e ? fn(e) : undefined : e;
}

function _$each(selector, fn, p){ Array.prototype.forEach.call((p || document).querySelectorAll(selector), fn); }
function _$map(selector, fn, p){ return Array.prototype.map.call((p || document).querySelectorAll(selector), fn); }
function _$some(selector, fn, p){ return Array.prototype.some.call((p || document).querySelectorAll(selector), fn); }
function _$every(selector, fn, p){ return Array.prototype.every.call((p || document).querySelectorAll(selector), fn); }
function _$filter(selector, fn, p){ return Array.prototype.filter.call((p || document).querySelectorAll(selector), fn); }

// custom CSS
function _$css(data, id){
  if (!id){ id = '__cm_extention_style'; }
  var s = document.getElementById('__cm_extention_style');
  if (s){ s.parentNode.removeChild(s); }
  s = document.body.appendChild(document.createElement('style'));
  s.id = '__cm_extention_style';
  if (s.styleSheet) {
    s.styleSheet.cssText = css;
  } else {
    s.appendChild(document.createTextNode(typeof data === 'function' ? ''.slice.call(data, 14, -3) : data));
  }
}

// as a variable, it can be easily redefined later for userscript format
var _$res = function (url){ return (typeof browser !== 'undefined' ? browser : chrome).extension.getURL(url); };

_$res = function (url){
  if (url == "img/icon-acclub.png") return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA9QTFRFmZmZZmZmMzMzAAAAgYGBlaSnFAAAAAV0Uk5T/////wD7tg5TAAABkElEQVR42qSXSwLDIAgFBbz/mVvjJ4CgQbN7qTOmVgxN+fJK9t2UrgRABDeCP38lKPyN4OEvBJU/FzT+WND5U8HgDwUvfyZg/JGA8ycCwTMBIHwSSP4V7Ooi2fyYVdcFgExdsOK5AFAkolb3S16sh0jUBWuerQeq1WmCDT+Qhyf5aRHs+I5UfiTqgi3fkMb3RF2QcMdXpPMtkSOw+AcZfE3kCEy+IC//JHIEmJy6YHxJ5AjQqwvO/xM5AsyIYO4rsUwyMcGf1yv03v8gqONg5tXv7AnaPLDlHUF/TtjytmB8zz1vCvQ6rXhLEOInwX+XpQg/C3JofvMJQrwhiPGzAGP8N8GC/yRY8bI20RRoHlGcWTIZglX9lQNDplkw8++Q58CRaRIY/BhSDyyZtMDi+5B2ZstUdiK/wOAb0s98mXSjafH15nhnyKQFZqODnFDJ61TFex05oZISJLPRQk5kwa/WwOv0ZPIFcNbuY7RV9QTHfzgwyDuC77wtCPCmIMJbWznEz0+AMT6nfHldC34CDADQEDTb2F/V3AAAAABJRU5ErkJggg==";
  if (url == "img/icon-thesetupmarket-16.png") return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXxJREFUeNqMk7EvBFEQxt/e7l7uGnH+AIlCgY4gEoUEhRONQnKVUPkP5FqFQqGSoCDXKYRaSSUhIiERQbLonKwlud3mbNY38l2MjZOb5JedNzvf7Hszby3f943rukaZA+ZBBcTmH6vX68aEYWiSJNHsgttU7E+iKDIZcZRtggUQmRZMtJmUeIl+yGcWlIDOy/3ya7Wa7GIj+bFn0Ackvg+u1La3QIn+KI5/JAW02AM9TKgwdsz1OtdF0AveUMCTApfqyyNM3lFFD8CqWq+AJ3FQ4Nrh2B6BB8bAHFjkGW/YhzLXMtZp0KlnfgK6wQQYAG1KfA9m0uNPX5oPMAmsJmI9AZuahuXl5RTFpok44EfEHsCZyj2UanegwEAVvCix+LNgj1svgnHmroFlmUIWDc2RIdXtKujnVE75Tvwy2BZffgMpoO/3MMWvYJAxB7SrnELDlwKZVIfzPIZs9ZyxT/CucgItsIIgMLZtG8v67mMX6AAXrfxIcRybLwEGAPyuf5tj/yp0AAAAAElFTkSuQmCC";
  if (url == "img/icon-radiatorschamp-30.png") return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACFQTFRF///////M/8zM/8yZ/5mZzJmZzJlmzGZmzGYzzDMz////Hc17DAAAAAt0Uk5T/////////////wBKTwHyAAAA5ElEQVR42nzT2xaEIAgF0BNBaP//wcNFDWfWxFOyVwRquFfg/o0nB+CFwfTyNs7+wqYv7PqfQ5O/+sNSicdjlMMapipp5gmp2LUHQ3yJQ82pajDE10DrxlrV2dQSri350X7B1TJH64MlWgjV1M5RNNhUUFWJyGZIJi+wvcunqjIn59e3ypc3IcF3fKVq52gueaQebQ/PuWtlSpExve5qA1Pw2di3TqxNvZbaBvhMOV2cSsSjfYav5rmP9TzfcRCVedwBGd3cG/N6lqmFufwRajuy3fND6h3ERTt/31D8/+9KfAQYAH4FGSoAsxbPAAAAAElFTkSuQmCC";
  if (url == "img/icon-radiatorschamp-48.png") return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADxQTFRF/8wA/5kA/wAAzJkAzAAAmWYAmQAzmQAAZmYAZjMAZgAzZgAAMzMzMzMAMwAzMwAAADMzAAAzAAAAogAl5T9rCwAAABR0Uk5T/////////////////////////wBPT+cRAAACAElEQVR42pSVi5KDIAwAqUoU0EvB///XSyCAUOzUzPRBu8sjAVFnFxbOr6G6Njj7SIB1ck8E4h8JzC8PBOafCJF/ICT+d0H4nxdd+B9HKPy0imAdfBEqv2Di7DKVkkNVAVTPJ8yu05IF+MPMu92qngfhiwC4/0HmozDsvwjE7zJN4nen7ngRmBeBeRLu+CREPgmRJ8Hd8FFIfBQSz8LS8TAVQXgWhK9CyX+tIJzC71j4IlD/sbKVX1zun4TCZ2FxNp5Ne6144XfETiDe8Ta94Tsh/su5stDx3l+n9PZvGYHnH6GWfx96O/aDYj+QXps2PgprnA9RHb/NH7G9SbDC10jzOebZGIYyTS1lPO2lc8j7TekQNL2JQS36yVsFQ3735qU9WZs3InivqWWVXUY8TUkTY6jPPAJ/OWhKrVDz79nQF0EzH7oRrvUKZEjHohwhOGiEbj8EyovOa5gN+kA79Co0PHWGMVUlS5E/qXCLxOoanp4W3LtO/Gvz6eApwBK26Z8Erl6pW0gnRkGNlmch1BUL39wP2PB8QAPqnCHhh0LiSQjO4kYKbdvMNxcKNjxdqLwQ5F2IhR8ImT9Fw3nGy+P4Qwj9Y97Ns7u543DEk/D6InS8M8bwounDDYWOB/OSfUqVHqW1nw/wCBKDOsDHtQaU2RwwEAZXYN03+Zd/AQYAX0xuXwD83e4AAAAASUVORK5CYII=";
  return '';
};

if (/^http:\/\/assettocorsa\.club\/.*/i.test(location.href) || /^https:\/\/assettocorsa\.club\/.*/i.test(location.href)){
if (_$('p.download a', function (x){ return x.textContent; }) == 'DOWNLOAD'){
  _$('.spec > div', function (x) { x.style.width = '60%'; });
  _$('.spec > div:last-child', function (x) { x.style.width = '40%'; });
  _$each('.__cmspecial', function (x){ x.parentNode.removeChild(x); });
  _$('p.download a', function (x) {
    var c = x.cloneNode();
    c.classList.add('__cmspecial');
    c.removeAttribute('target');
    c.setAttribute('href', 'acmanager://install?url=' + encodeURIComponent(x.href));
    c.textContent = 'INSTALL';
    c.setAttribute('style',
        'color: rgb(100, 166, 112); padding: 0px 0px 6px 40px; line-height: 33px; margin: 2px 0px 2px 12px;' +
        'background: url(' + JSON.stringify(_$res('img/icon-acclub.png')) + ') left center / contain no-repeat;' +
        'display: inline-block;');
    x.parentNode.insertBefore(c, x.nextSibling);
  });
}
} else if (/^http:\/\/www\.assetto-db\.com\/.*/i.test(location.href) || /^http:\/\/assetto-db\.com\/.*/i.test(location.href)){
_$each('.__cmspecial', function (x){ x.parentNode.removeChild(x); });
_$('.carDetails a[href^="/"][href$="/download"]', function (x) {
  var c = x.cloneNode();
  c.classList.add('__cmspecial');
  c.removeAttribute('target');
  c.setAttribute('href', 'acmanager://install?url=' + encodeURIComponent(location.href));
  c.textContent = 'Install using Content Manager';

  // with hue filter, hover/active colors are already there, and also it won’t look weird
  // in case of sudden redesign
  c.setAttribute('style', 'filter:hue-rotate(-120deg);-webkit-filter:hue-rotate(-120deg)');
  c.classList.remove('btn-default');
  c.classList.add('btn-primary');
  x.parentNode.insertBefore(c, x.nextSibling);
});
} else if (/^http:\/\/thesetupmarket\.com\/.*/i.test(location.href)){
if (!_$('#__cm_stop')){
  // if you would need to stop CM, just add empty element with ID=__cm_stop somewhere

  var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver, 
      eventListenerSupported = window.addEventListener;
    return function(obj, callback){
      if (MutationObserver){
        var obs = new MutationObserver(function(mutations, observer){
          if (mutations[0].addedNodes.length || mutations[0].removedNodes.length){
            callback();
          }
        });

        obs.observe(obj, { childList: true, subtree: true });
      } else if (eventListenerSupported){
        obj.addEventListener('DOMNodeInserted', callback, false);
      }
    };
  })();

  observeDOM(document.body, function(){ 
    _$each('.icon-details.icon-link[href^="#/setups/Assetto Corsa/"]:not(.__cmspecial)', function (x){ 
      x.classList.add('__cmspecial');
      var c = x.cloneNode(true);
      x.parentNode.appendChild(c);
      c.setAttribute('href', 'acmanager://thesetupmarket/setup?id=' + (x.href.match(/\/([\w-]+)\/?$/) || {})[1]);
      c.setAttribute('style', 'color:transparent;background:url(' + JSON.stringify(_$res('img/icon-thesetupmarket-16.png')) + 
          ');background-repeat:no-repeat;background-position:center;');
    });

    _$each('.link.icon-download.fixed-download-link:not(.__cmspecial)', function (x){ 
      var i = setInterval(function (){
        var id = (x.href.match(/\/([\w-]+)\/?$/) || {})[1];
        if (id == null) return;
        clearInterval(i);

        x.classList.add('__cmspecial');
        var c = x.cloneNode(true);
        x.parentNode.appendChild(c);
        c.classList.remove('icon-download');
        c.textContent = 'install using CM';
        c.setAttribute('href', 'acmanager://thesetupmarket/setup?id=' + id);
        c.setAttribute('style', 'right:220px;filter:hue-rotate(-60deg);-webkit-filter:hue-rotate(-60deg)')
      }, 100);
    });
  });
}
} else if (/^http:\/\/www\.radiators-champ\.com\/RSRLiveTiming\/.*/i.test(location.href)){
if (_$('#__cmext_style', function (x){ x.parentNode.removeChild(x); return true; })){
  // cleaning up after RSR Live Timing Content Manager Support extension
  _$('#__cmext_start_btn', function (x){ x.parentNode.removeChild(x); return true; });

  _$each('th:last-child', function (x){
    if (x.textContent === 'Install'){
      x.textContent = 'Download';
    }
  });

  _$each('a', function (x){
    var m = x.href.match(/^acmanager:\/\/rsr\/setup\?id=(\d+)/);
    if (m){
      x.href = 'http://www.radiators-champ.com/RSRLiveTiming/ajax.php?action=download_setup&id=' + m[1];
    }
  });
}

// start button if needed or possible
var eventId = (location.href.match(/\beventId?=(\d+)\b/i) || {})[1];
var carId = (location.href.match(/\bcar(?:Id)?=(\d+)\b/i) || {})[1];
var trackId = (location.href.match(/\btrack(?:Id)?=(\d+)\b/i) || {})[1];

if (eventId != null || carId != null && trackId != null){
  _$css(function(){/*
#__cmext_start_btn {
  display: block !important;
  position: fixed !important;
  bottom: 20px !important;
  right: 20px !important;
  width: 72px !important;
  height: 72px !important;
  border-radius: 2px !important;
  background: #A20025 !important;
  color: white !important;
  text-transform: uppercase !important;
  text-decoration: none !important;
  font-size: 13px !important;
  font-weight: bold !important;
  line-height: 27px !important;
  padding: 8px !important;
  text-align: center !important;
  color: #FFF !important;
}

#__cmext_start_btn:hover, #__cmext_start_btn:active {
  color: #FFF !important;
  background: #990024 !important;
  text-decoration: none !important;
} */});

  var c = eventId || trackId + '/' + carId;
  var b = document.createElement('a');
  b.id = '__cmext_start_btn';
  b.appendChild(document.createElement('img')).src = _$res('img/icon-radiatorschamp-48.png');
  b.appendChild(document.createElement('br'));
  b.appendChild(document.createTextNode('Start'));
  b.href = 'acmanager://rsr?id=' + encodeURIComponent(c);
  document.body.appendChild(b);
}

// setups table: new column with quick install buttons
_$each('th:last-child', function (x){
  if (x.textContent === 'Download'){
    x.textContent = 'Download​';
    x.parentNode.appendChild(x.cloneNode()).textContent = 'Install';
  }
});

_$each('a', function (x){
  var m = x.href.match(/=download_setup&id=(\d+)/);
  if (m){
    var c = x.parentNode.parentNode.appendChild(x.parentNode.cloneNode(true)).querySelector('a');
    c.href = 'acmanager://rsr/setup?id=' + m[1];
    c.querySelector('img').src = _$res('img/icon-radiatorschamp-30.png');
    x.href = x.href.replace(/&id/, '&proc=1&id');
  }
});
}
})();
