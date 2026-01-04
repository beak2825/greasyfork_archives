// ==UserScript==
// @name         Image Viewer
// @version      1.3.1
// @description  View full image without leaving the page or on a new tab without ads
// @namespace    https://github.com/nikolay-borzov
// @author       nikolay-borzov
// @license      MIT
// @icon         https://raw.githubusercontent.com/nikolay-borzov/user-scripts/master/image-viewer/icon.png
// @homepageURL  https://github.com/nikolay-borzov/user-scripts
// @homepage     https://github.com/nikolay-borzov/user-scripts
// @supportURL   https://github.com/nikolay-borzov/user-scripts/issues
// @match        *://*/*
// @connect      fastpic.org
// @connect      fastpic.ru
// @connect      ibb.co
// @connect      imagebam.com
// @connect      imagetwist.com
// @connect      imagevenue.com
// @connect      imgdrive.net
// @connect      imgtaxi.com
// @connect      www.turboimagehost.com
// @noframes
// @run-at       document-start
// @exclude      http://imgbb.co/*
// @exclude      https://adult-images.ru/*
// @exclude      https://fastpic.org/*
// @exclude      https://freescreens.ru/*
// @exclude      https://imageban.ru/*
// @exclude      https://imagetwist.com/*
// @exclude      https://imgadult.com/*
// @exclude      https://imgbase.ru/*
// @exclude      https://imgbox.com/*
// @exclude      https://imgbum.ru/*
// @exclude      https://imgclick.ru/*
// @exclude      https://imgdrive.net/*
// @exclude      https://imgtaxi.com/*
// @exclude      https://payforpic.ru/*
// @exclude      https://piccash.net/*
// @exclude      https://picclick.ru/*
// @exclude      https://picforall.ru/*
// @exclude      https://vfl.ru/*
// @exclude      https://www.imagebam.com/*
// @exclude      https://www.imagevenue.com/*
// @exclude      https://www.turboimagehost.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// @grant        GM_openInTab
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/443464/Image%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/443464/Image%20Viewer.meta.js
// ==/UserScript==

;(function () {
  /* global Bliss */
  // eslint-disable-next-line -- blissfuljs v1.0.6 Shy https://blissfuljs.com/
  !function(){function e(o,i,t){return i=void 0===i?1:i,(t=t||i+1)-i<=1?function(){if(arguments.length<=i||"string"===c.type(arguments[i]))return o.apply(this,arguments);var t,e,n=arguments[i];for(e in n){var r=Array.prototype.slice.call(arguments);r.splice(i,1,e,n[e]),t=o.apply(this,r);}return t}:e(e(o,i+1,t),i,t-1)}function s(e,n,t){var r=a(t);if("string"===r){var o=Object.getOwnPropertyDescriptor(n,t);!o||o.writable&&o.configurable&&o.enumerable&&!o.get&&!o.set?e[t]=n[t]:(delete e[t],Object.defineProperty(e,t,o));}else if("array"===r)t.forEach(function(t){t in n&&s(e,n,t);});else for(var i in n)t&&("regexp"===r&&!t.test(i)||"function"===r&&!t.call(n,i))||s(e,n,i);return e}function a(t){if(null===t)return "null";if(void 0===t)return "undefined";var e=(Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1]||"").toLowerCase();return "number"==e&&isNaN(t)?"nan":e}var c=self.Bliss=s(function(t,e){return 2==arguments.length&&!e||!t?null:"string"===c.type(t)?(e||document).querySelector(t):t||null},self.Bliss);s(c,{extend:s,overload:e,type:a,property:c.property||"_",listeners:new(self.WeakMap?WeakMap:Map),original:{addEventListener:(self.EventTarget||Node).prototype.addEventListener,removeEventListener:(self.EventTarget||Node).prototype.removeEventListener},sources:{},noop:function(){},$:function(t,e){return t instanceof Node||t instanceof Window?[t]:2!=arguments.length||e?Array.prototype.slice.call("string"==typeof t?(e||document).querySelectorAll(t):t||[]):[]},defined:function(){for(var t=0;t<arguments.length;t++)if(void 0!==arguments[t])return arguments[t]},create:function(t,e){return t instanceof Node?c.set(t,e):(1===arguments.length&&(e="string"===c.type(t)?{}:(t=(e=t).tag,c.extend({},e,function(t){return "tag"!==t}))),c.set(document.createElement(t||"div"),e))},each:function(t,e,n){for(var r in n=n||{},t)n[r]=e.call(t,r,t[r]);return n},ready:function(e,t,n){if("function"!=typeof e||t||(t=e,e=void 0),e=e||document,t&&("loading"!==e.readyState?t():c.once(e,"DOMContentLoaded",function(){t();})),!n)return new Promise(function(t){c.ready(e,t,!0);})},Class:function(t){var e,n,r=["constructor","extends","abstract","static"].concat(Object.keys(c.classProps)),o=t.hasOwnProperty("constructor")?t.constructor:c.noop;2==arguments.length?(n=arguments[0],t=arguments[1]):((n=function(){if(this.constructor.__abstract&&this.constructor===n)throw new Error("Abstract classes cannot be directly instantiated.");n.super&&!e&&n.super.apply(this,arguments),o.apply(this,arguments);}).super=t.extends||null,!n.super||(e=0===(n.super+"").indexOf("class "))&&console.error(`You are using $.Class() to create a fake function-based class that extends a native JS class. This will not work. You should convert your code to use native JS classes too. You can still pass a class into $.Class() to use its conveniences.`),n.prototype=c.extend(Object.create(n.super?n.super.prototype:Object),{constructor:n}),n.prototype.super=n.super?n.super.prototype:null,n.__abstract=!!t.abstract);function i(t){return this.hasOwnProperty(t)&&-1===r.indexOf(t)}if(t.static)for(var s in c.extend(n,t.static,i),c.classProps)s in t.static&&c.classProps[s](n,t.static[s]);for(s in c.extend(n.prototype,t,i),c.classProps)s in t&&c.classProps[s](n.prototype,t[s]);return n},classProps:{lazy:e(function(t,e,n){return Object.defineProperty(t,e,{get:function(){var t=n.call(this);return Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0}),t},set:function(t){Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0});},configurable:!0,enumerable:!0}),t}),live:e(function(t,n,r){return "function"===c.type(r)&&(r={set:r}),Object.defineProperty(t,n,{get:function(){var t=this["_"+n],e=r.get&&r.get.call(this,t);return void 0!==e?e:t},set:function(t){var e=this["_"+n],e=r.set&&r.set.call(this,t,e);this["_"+n]=void 0!==e?e:t;},configurable:r.configurable,enumerable:r.enumerable}),t})},include:function(){var n=arguments[arguments.length-1],t=2===arguments.length&&arguments[0],r=document.createElement("script");return t?Promise.resolve():new Promise(function(t,e){c.set(r,{async:!0,onload:function(){t(r),r.parentNode&&r.parentNode.removeChild(r);},onerror:function(){e(r);},src:n,inside:document.head});})},load:function t(r,e){e=e?new URL(e,location.href):location.href,r=new URL(r,e);e=t.loading=t.loading||{};return e[r+""]||(/\.css$/.test(r.pathname)?e[r+""]=new Promise(function(t,e){var n=c.create("link",{href:r,rel:"stylesheet",inside:document.head,onload:function(){t(n);},onerror:function(){e(n);}});}):e[r+""]=c.include(r))},fetch:function(t,e){if(!t)throw new TypeError("URL parameter is mandatory and cannot be "+t);var n,r=s({url:new URL(t,location),data:"",method:"GET",headers:{},xhr:new XMLHttpRequest},e);for(n in r.method=r.method.toUpperCase(),c.hooks.run("fetch-args",r),"GET"===r.method&&r.data&&(r.url.search+=r.data),document.body.setAttribute("data-loading",r.url),r.xhr.open(r.method,r.url.href,!1!==r.async,r.user,r.password),e)if("upload"===n)r.xhr.upload&&"object"==typeof e[n]&&c.extend(r.xhr.upload,e[n]);else if(n in r.xhr)try{r.xhr[n]=e[n];}catch(t){self.console&&console.error(t);}var o,t=Object.keys(r.headers).map(function(t){return t.toLowerCase()});for(o in "GET"!==r.method&&-1===t.indexOf("content-type")&&r.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded"),r.headers)void 0!==r.headers[o]&&r.xhr.setRequestHeader(o,r.headers[o]);t=new Promise(function(t,e){r.xhr.onload=function(){document.body.removeAttribute("data-loading"),0===r.xhr.status||200<=r.xhr.status&&r.xhr.status<300||304===r.xhr.status?t(r.xhr):e(c.extend(Error(r.xhr.statusText),{xhr:r.xhr,get status(){return this.xhr.status}}));},r.xhr.onerror=function(){document.body.removeAttribute("data-loading"),e(c.extend(Error("Network Error"),{xhr:r.xhr}));},r.xhr.ontimeout=function(){document.body.removeAttribute("data-loading"),e(c.extend(Error("Network Timeout"),{xhr:r.xhr}));},r.xhr.send("GET"===r.method?null:r.data);});return t.xhr=r.xhr,t},value:function(t){var e="string"!=typeof t;return c.$(arguments).slice(+e).reduce(function(t,e){return t&&t[e]},e?t:self)}}),c.Hooks=new c.Class({add:function(t,e,n){if("string"==typeof arguments[0])(Array.isArray(t)?t:[t]).forEach(function(t){this[t]=this[t]||[],e&&this[t][n?"unshift":"push"](e);},this);else for(var t in arguments[0])this.add(t,arguments[0][t],e);},run:function(t,e){this[t]=this[t]||[],this[t].forEach(function(t){t.call(e&&e.context?e.context:e,e);});}}),c.hooks=new c.Hooks;c.property;c.Element=function(t){this.subject=t,this.data={},this.bliss={};},c.Element.prototype={set:e(function(t,e){t in c.setProps?c.setProps[t].call(this,e):t in this?this[t]=e:this.setAttribute(t,e);},0),transition:function(o,i){return new Promise(function(t,e){var n,r;"transition"in this.style&&0!==i?(n=c.extend({},this.style,/^transition(Duration|Property)$/),c.style(this,{transitionDuration:(i||400)+"ms",transitionProperty:Object.keys(o).join(", ")}),c.once(this,"transitionend",function(){clearTimeout(r),c.style(this,n),t(this);}),r=setTimeout(t,i+50,this),c.style(this,o)):(c.style(this,o),t(this));}.bind(this))},fire:function(t,e){var n=document.createEvent("HTMLEvents");return n.initEvent(t,!0,!0),this.dispatchEvent(c.extend(n,e))},bind:e(function(t,n){var e;1<arguments.length&&("function"===c.type(n)||n.handleEvent)&&(e=n,(n="object"===c.type(arguments[2])?arguments[2]:{capture:!!arguments[2]}).callback=e);var r=c.listeners.get(this)||{};t.trim().split(/\s+/).forEach(function(t){var e;-1<t.indexOf(".")&&(e=(t=t.split("."))[1],t=t[0]),r[t]=r[t]||[],0===r[t].filter(function(t){return t.callback===n.callback&&t.capture==n.capture}).length&&r[t].push(c.extend({className:e},n)),c.original.addEventListener.call(this,t,n.callback,n);},this),c.listeners.set(this,r);},0),unbind:e(function(t,i){var e;i&&("function"===c.type(i)||i.handleEvent)&&(e=i,i=arguments[2]),(i=(i="boolean"==c.type(i)?{capture:i}:i)||{}).callback=i.callback||e;var s=c.listeners.get(this);(t||"").trim().split(/\s+/).forEach(function(t){var e,n;if(-1<t.indexOf(".")&&(e=(t=t.split("."))[1],t=t[0]),!s)return t&&i.callback?c.original.removeEventListener.call(this,t,i.callback,i.capture):void 0;for(n in s)if(!t||n===t)for(var r,o=0;r=s[n][o];o++)e&&e!==r.className||i.callback&&i.callback!==r.callback||!!i.capture!=!!r.capture&&(t||i.callback||void 0!==i.capture)||(s[n].splice(o,1),c.original.removeEventListener.call(this,n,r.callback,r.capture),o--);},this);},0),when:function(r,o){var t=this;return new Promise(function(n){t.addEventListener(r,function t(e){o&&!o.call(this,e)||(this.removeEventListener(r,t),n(e));});})},toggleAttribute:function(t,e,n){(n=arguments.length<3?null!==e:n)?this.setAttribute(t,e):this.removeAttribute(t);}},c.setProps={style:function(t){for(var e in t)e in this.style?this.style[e]=t[e]:this.style.setProperty(e,t[e]);},attributes:function(t){for(var e in t)this.setAttribute(e,t[e]);},properties:function(t){c.extend(this,t);},events:function(t){if(1!=arguments.length||!t||!t.addEventListener)return c.bind.apply(this,[this].concat(c.$(arguments)));var e,n=this;if(c.listeners){var r,o=c.listeners.get(t);for(r in o)o[r].forEach(function(t){c.bind(n,r,t.callback,t.capture);});}for(e in t)0===e.indexOf("on")&&(this[e]=t[e]);},once:e(function(t,e){function n(){return c.unbind(r,t,n),e.apply(r,arguments)}var r=this;c.bind(this,t,n,{once:!0});},0),delegate:e(function(t,e,n){c.bind(this,t,function(t){t.target.closest(e)&&n.call(this,t);});},0,2),contents:function(t){!t&&0!==t||(Array.isArray(t)?t:[t]).forEach(function(t){var e=c.type(t);/^(string|number)$/.test(e)?t=document.createTextNode(t+""):"object"===e&&(t=c.create(t)),t instanceof Node&&this.appendChild(t);},this);},inside:function(t){t&&t.appendChild(this);},before:function(t){t&&t.parentNode.insertBefore(this,t);},after:function(t){t&&t.parentNode.insertBefore(this,t.nextSibling);},start:function(t){t&&t.insertBefore(this,t.firstChild);},around:function(t){t&&t.parentNode&&c.before(this,t),this.appendChild(t);}},c.Array=function(t){this.subject=t;},c.Array.prototype={all:function(t){var e=c.$(arguments).slice(1);return this[t].apply(this,e)}},c.add=e(function(r,n,o,t){o=c.extend({$:!0,element:!0,array:!0},o),"function"==c.type(n)&&(!o.element||r in c.Element.prototype&&t||(c.Element.prototype[r]=function(){return this.subject&&c.defined(n.apply(this.subject,arguments),this.subject)}),!o.array||r in c.Array.prototype&&t||(c.Array.prototype[r]=function(){var e=arguments;return this.subject.map(function(t){return t&&c.defined(n.apply(t,e),t)})}),o.$&&(c.sources[r]=c[r]=n,(o.array||o.element)&&(c[r]=function(){var t=[].slice.apply(arguments),e=t.shift(),n=o.array&&Array.isArray(e)?"Array":"Element";return c[n].prototype[r].apply({subject:e},t)})));},0),c.add(c.Array.prototype,{element:!1}),c.add(c.Element.prototype),c.add(c.setProps),c.add(c.classProps,{element:!1,array:!1});var n=document.createElement("_");c.add(c.extend({},HTMLElement.prototype,function(t){return "function"===c.type(n[t])}),null,!0);}();
  // eslint-disable-next-line
  const $ = Bliss;
  // eslint-disable-next-line
  const $$ = Bliss.$;

  const GM_METHOD_MAP = {
    GM_addStyle: 'addStyle',
    GM_deleteValue: 'deleteValue',
    GM_getResourceURL: 'getResourceUrl',
    GM_getValue: 'getValue',
    GM_listValues: 'listValues',
    GM_notification: 'notification',
    GM_openInTab: 'openInTab',
    GM_registerMenuCommand: 'registerMenuCommand',
    GM_setClipboard: 'setClipboard',
    GM_setValue: 'setValue',
    GM_xmlhttpRequest: 'xmlHttpRequest',
    GM_getResourceText: 'getResourceText',
  }

  function getGM4PolyfilledMethod(methodName) {
    const gm4MethodName = GM_METHOD_MAP[methodName]

    if (GM !== undefined && gm4MethodName in GM) {
      return GM[gm4MethodName]
    } else if (methodName in window) {
      return function (...arguments_) {
        return new Promise((resolve, reject) => {
          try {
            // eslint-disable-next-line unicorn/no-null
            resolve(window[methodName].apply(null, arguments_))
          } catch (error) {
            reject(error)
          }
        })
      }
    }

    return async function () {
      throw new Error(`Method ${methodName} is not available. Missing @grant?`)
    }
  }

  let addStyle = (css) => {
    addStyle =
      'GM_addStyle' in window
        ? GM_addStyle // eslint-disable-line camelcase
        : (css) => {
            const head = document.querySelectorAll('head')[0]
            const style = document.createElement('style')

            style.innerHTML = css
            head.append(style)

            return style
          }

    return addStyle(css)
  }

  let request = (details) => {
    request = getGM4PolyfilledMethod('GM_xmlhttpRequest')

    return request(details)
  }

  const store = {
    getValue: (name, defaultValue) => {
      store.getValue = getGM4PolyfilledMethod('GM_getValue')

      return store.getValue(name, defaultValue)
    },

    setValue: (name, value) => {
      store.setValue = getGM4PolyfilledMethod('GM_setValue')

      return store.setValue(name, value)
    },

    async patch(name, value) {
      const oldValue = await store.getValue(name)

      store.setValue(name, {
        ...oldValue,
        ...value,
      })
    },
  }

  let registerMenuCommand = (name, onClick, accessKey) => {
    registerMenuCommand = getGM4PolyfilledMethod('GM_registerMenuCommand')

    return registerMenuCommand(name, onClick, accessKey)
  }

  let openInTab = (url, openInBackground) => {
    openInTab = getGM4PolyfilledMethod('GM_openInTab')

    return openInTab(url, openInBackground)
  }

  const imgbum = {
    id: 'imgbum',
    name: 'imgbum.ru',
    linkRegExp: /\/imgbum\.(net|ru)/,

    async getURL(link) {
      return link.thumbnailURL.replace('-thumb', '')
    },
  }

  const adultImages = {
    id: 'adult-images',
    name: 'Adult-Images.ru',
    linkRegExp: /\/(adult-images|money-pic)\.ru/,

    getURL: imgbum.getURL,
  }

  async function getURLFromPage(link, extractor, requestDetails) {
    const html = await getPageHtml({ url: link.url, ...requestDetails })

    const match = extractor.imageURLRegExp?.exec(html)

    let url

    if (match) {
      url = match.groups ? match.groups.url : match[1]
    }

    if (!url) {
      console.error(
        `[image-viewer] Failed to get URL from page source: ${link.url}`
      )
    }

    return url
  }

  async function getPageHtml(requestDetails) {
    const response = await request(requestDetails)

    return response.responseText
  }

  const fastpic = {
    id: 'fastpic',
    name: 'FastPic',
    linkRegExp: /fastpic\.(?:ru|org)\/view/,
    imageURLRegExp: /src="(?<url>http[^"]+)" class="image img-fluid"/,
    getURL: getURLFromPage,
  }

  const URL_PARTS_REGEXP = /i(\d+).+\.(ru|org)\/big(\/\d+\/\d+\/).+\/([^/]+)$/

  const fastpicDirect = {
    id: 'fastpicDirect',
    name: 'FastPic (direct link)',
    linkRegExp: /fastpic\.(?:ru|org)\/big/,

    async getURL(link) {
      const [, index, domain, date, filename] =
        URL_PARTS_REGEXP.exec(link.url) || []

      const url = `https://fastpic.${domain}/view/${index}${date}${filename}.html`

      return fastpic.getURL({ ...link, url }, fastpic)
    },
  }

  const imagebam = {
    id: 'imagebam',
    name: 'ImageBam',
    linkRegExp: /www\.imagebam\.com\//,
    imageURLRegExp: /src="(?<url>[^"]+)".+class="main-image/,

    async getURL(link, extractor) {
      return getURLFromPage(link, extractor, {
        cookie: 'nsfw_inter=1',
      })
    },
  }

  const DATE_PATTERN = /(\d{4})\.(\d{2})\.(\d{2})/

  const imageban = {
    id: 'imageban',
    name: 'ImageBan.ru',
    linkRegExp: /imageban\.ru\/show/,

    async getURL(link) {
      return link.thumbnailURL
        .replace('thumbs', 'out')
        .replace(DATE_PATTERN, '$1/$2/$3')
    },
  }

  const imagebanDirect = {
    id: 'imagebanDirect',
    name: 'ImageBan.ru (direct link)',
    linkRegExp: /imageban\.ru\/out/,

    async getURL(link) {
      return link.url
    },
  }

  const imagetwist = {
    id: 'imagetwist',
    name: 'ImageTwist',
    linkRegExp: /imagetwist\.com/,
    viewMode: 'origin-download',

    async getURL(link) {
      const imageName = link.url.split('/').pop()?.replace('.html', '')
      const imageExtension = imageName?.split('.').pop() ?? ''

      const thumbnailExtension = link.thumbnailURL.split('.').pop() ?? ''
      const imageUrl = link.thumbnailURL
        .replace('/th/', '/i/')
        .slice(0, -thumbnailExtension.length)

      return `${imageUrl}${imageExtension}/${imageName}`
    },
  }

  const HOST_REPLACE_REG_EXP = /(picturelol|picshick|imageshimage)/

  const imagetwistBased = {
    id: 'imagetwistBased',
    name: 'ImageTwist based (legacy)',
    hosts: ['Picturelol.com', 'PicShick.com', 'Imageshimage.com'],
    linkRegExp: /(picturelol|picshick|imageshimage)\.com/,
    viewMode: 'origin-download',

    async getURL(link) {
      const imageName = link.url.split('/').pop()
      const imageUrl = link.thumbnailURL
        .replace('/th/', '/i/')
        .replace(HOST_REPLACE_REG_EXP, 'imagetwist')

      return `${imageUrl}/${imageName}`
    },
  }

  const imagevenue = {
    id: 'imagevenue,',
    name: 'ImageVenue.com',
    linkRegExp: /imagevenue\.com\//,
    imageURLRegExp: /data-toggle="full">\W*<img src="(?<url>[^"]*)/im,
    getURL: getURLFromPage,
  }

  const imgadult = {
    id: 'imgadult',
    name: 'ImgAdult',
    linkRegExp: /\/imgadult\.com/,

    async getURL(link) {
      return link.thumbnailURL.replace('/small/', '/big/')
    },
  }

  const imgbb = {
    id: 'imgbb',
    name: 'ImgBB',
    linkRegExp: /\/ibb\.co/,
    imageURLRegExp: /rel="image_src" href="(?<url>http[^"]+)"/,

    async getURL(link) {
      if (link.thumbnailURL.includes('//thumb')) {
        return link.thumbnailURL.replace('//thumb', '//image')
      }

      return getURLFromPage(link, imgbb)
    },
  }

  const imgbox = {
    id: 'imgbox',
    name: 'imgbox',
    linkRegExp: /\/imgbox\.com/,

    async getURL(link) {
      return link.thumbnailURL.replace('/thumbs', '/images').replace('_t', '_o')
    },
  }

  const imgdrive = {
    id: 'imgdrive',
    name: 'ImgDrive.net',
    linkRegExp: /\/imgdrive\.net/,
    viewMode: 'origin-download',

    async getURL(link) {
      return link.thumbnailURL
        .replace('/small/', '/big/')
        .replace('/small-medium/', '/big/')
    },
  }

  const imgtaxi = {
    id: 'imgtaxi',
    name: 'ImgTaxi.com',
    linkRegExp: /\/imgtaxi\.com/,
    viewMode: 'origin-download',
    getURL: imgdrive.getURL,
  }

  const piccash = {
    id: 'piccash',
    name: 'PicCash',
    linkRegExp: /\/piccash\.net/,

    async getURL(link) {
      return link.thumbnailURL.replace('_thumb', '_full').replace('-thumb', '')
    },
  }

  const picforall = {
    id: 'picforall',
    name: 'PicForAll',
    hosts: [
      'freescreens.ru',
      'imgclick.ru',
      'picclick.ru',
      'payforpic.ru',
      'picforall.ru',
      'imgbase.ru',
    ],
    linkRegExp:
      /\/(freescreens|imgclick|picclick|payforpic|picforall|imgbase)\.ru/,
    getURL: imgbum.getURL,
  }

  const turboimagehost = {
    id: 'turboimagehost',
    name: 'TurboImageHost.com',
    linkRegExp: /turboimagehost\.com\/p/,
    imageURLRegExp: /rel="image_src" href="(?<url>http[^"]+)"/,
    viewMode: 'new-tab',
    getURL: getURLFromPage,
  }

  const REMOVE_SUFFIX_REGEXP = /_.?(.+)$/

  const vfl = {
    id: 'vfl',
    name: 'VFL.Ru',
    linkRegExp: /^http:\/\/vfl\.ru/,

    async getURL(link) {
      return link.thumbnailURL.replace(REMOVE_SUFFIX_REGEXP, '$1')
    },
  }

  const hostExtractors = /* #__PURE__ */ Object.freeze({
    __proto__: null,
    adultImages,
    fastpic,
    fastpicDirect,
    imagebam,
    imageban,
    imagebanDirect,
    imagetwist,
    imagetwistBased,
    imagevenue,
    imgadult,
    imgbb,
    imgbox,
    imgbum,
    imgdrive,
    imgtaxi,
    piccash,
    picforall,
    turboimagehost,
    vfl,
  })

  let extractorsActive = []

  const extractors = Object.values(hostExtractors).filter(Boolean)

  const extractorsByID = extractors.reduce((result, extractor) => {
    result[extractor.id] = extractor

    return result
  }, {})

  const urlExtractor = {
    getImageHostsMetadata() {
      const result = extractors.map(({ id, name, hosts }) => ({
        id,
        name,
        description: hosts ? hosts.join(', ') : '',
      }))

      return sortCaseInsensitive(result, ({ name }) => name)
    },

    async getImageURL(link) {
      const extractor = extractorsByID[link.host]

      const imageURL = await extractor.getURL(link, extractor)

      if (!imageURL) {
        console.error(
          `[image-viewer] Failed to get URL for ${link.host}:${link.url}`
        )
      }

      return imageURL
    },

    getExtractorByHost(hostId) {
      return extractorsByID[hostId]
    },

    getHostExtractorMatcher(enabledHosts) {
      extractorsActive = extractors.filter((extractor) =>
        enabledHosts.includes(extractor.id)
      )

      let previousExtractor

      return (url) => {
        if (previousExtractor && previousExtractor.linkRegExp.test(url)) {
          return previousExtractor
        }

        const extractor = extractorsActive.find((extractor) =>
          extractor.linkRegExp.test(url)
        )

        if (extractor) {
          previousExtractor = extractor

          return extractor
        }
      }
    },
  }

  function sortCaseInsensitive(items, getValue) {
    return items
      .map((value, index) => ({ index, value: getValue(value).toLowerCase() }))
      .sort((a, b) => {
        if (a.value > b.value) {
          return 1
        }
        if (a.value < b.value) {
          return -1
        }

        return 0
      })
      .map((m) => items[m.index])
  }

  const CLASSES$1 = {
    open: 'iv-config-form--open',
  }

  let configMenu
  const currentHost = unsafeWindow.location.host

  async function initHostConfig() {
    const config = await getHostConfig()

    await registerMenuCommand('Settings', () => showMenu(config))

    return config
  }

  async function getHostConfig() {
    const hosts = urlExtractor.getImageHostsMetadata()

    const storedConfig = await store.getValue(currentHost, { hosts: {} })
    const enabledHosts = []

    for (const host of hosts) {
      const id = host.id
      const isEnabled = id in storedConfig.hosts ? storedConfig.hosts[id] : true

      host.isEnabled = isEnabled
      storedConfig.hosts[id] = isEnabled

      if (isEnabled) {
        enabledHosts.push(id)
      }
    }

    storedConfig.hosts = hosts.reduce((result, host) => {
      result[host.id] = host.isEnabled

      return result
    }, {})

    return {
      hosts,
      storedConfig,
      enabledHosts,
    }
  }

  function showMenu(config) {
    createMenuElement(config).classList.add(CLASSES$1.open)
  }

  function createMenuElement(config) {
    if (configMenu) {
      return configMenu
    }

    const rows = config.hosts.map((host) => createConfigMenuRow(host))

    configMenu = $.create('div', {
      id: 'iv-config-form',
      className: 'iv-config-form',
      contents: [
        createMenuHeader(),
        {
          tag: 'div',
          className: 'iv-config-form__options',
          contents: rows,
        },
      ],
      delegate: {
        change: {
          '.js-iv-config-checkbox': ({ target: { value, checked } }) =>
            updateHostConfig(config.storedConfig, value, checked),
        },
      },
    })

    document.body.append(configMenu)

    return configMenu
  }

  function createConfigMenuRow(host) {
    return $.create('label', {
      className: 'iv-config-form__label',
      title: host.description,
      contents: [
        {
          tag: 'input',
          type: 'checkbox',
          className: 'iv-config-form__checkbox js-iv-config-checkbox',
          checked: host.isEnabled,
          value: host.id,
        },
        host.name,
      ],
    })
  }

  function createMenuHeader() {
    const closeButton = $.create('a', {
      href: '#',
      title: 'Close',
      className: `iv-icon-button iv-icon-button--small iv-icon iv-icon--type-close`,
      events: {
        click: (event) => {
          event.preventDefault()
          configMenu.classList.remove(CLASSES$1.open)
        },
      },
    })

    return {
      tag: 'div',
      className: 'iv-config-form__header',
      contents: [
        {
          tag: 'span',
          className: 'iv-config-form__header-title',
          contents: `Settings for ${currentHost}`,
        },
        closeButton,
      ],
    }
  }

  function updateHostConfig(config, hostName, isEnabled) {
    config.hosts[hostName] = isEnabled
    store.setValue(currentHost, config)
  }

  const css_248z =
    ":root{--color-bkg-button-hover:#ffffff1a;--color-bkg-view:#000c;--transition-duration:350ms;--color-text:#fff;--color-border:#0003}@keyframes spin{0%{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(1turn)}}.iv-icon{position:relative}.iv-icon:after,.iv-image-link img:after{background-position:50%;background-repeat:no-repeat;background-size:contain;content:\"\";height:100%;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:100%;z-index:2}.iv-icon--hover:after{opacity:0;transition:opacity .35s ease}.iv-icon--hover:hover:after{opacity:1}.iv-icon--size-button:after{height:50px;width:50px}.iv-icon--type-loading:after{animation:spin 1s linear infinite;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23fff'%3E%3Cpath d='M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8Z'/%3E%3C/svg%3E\")!important;opacity:1}.iv-icon--type-zoom:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' fill='%23fff'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z'/%3E%3C/svg%3E\")}.iv-icon--type-open-in-new:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' fill='%23fff'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/%3E%3C/svg%3E\");height:40px;width:40px}.iv-icon--type-next:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' fill='%23fff'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M10.02 6 8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z'/%3E%3C/svg%3E\")}.iv-icon--type-previous:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' fill='%23fff'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M15.61 7.41 14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z'/%3E%3C/svg%3E\")}.iv-icon--type-close:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' fill='%23fff'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z'/%3E%3C/svg%3E\")}.iv-icon--type-expand:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' fill='%23fff'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'/%3E%3C/svg%3E\")}.iv-icon--type-shrink:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='24' width='24' fill='%23fff'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z'/%3E%3C/svg%3E\")}.iv-icon--type-image-broken:after,.iv-image-link img:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='%23fff'%3E%3Cpath d='M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2m-3 6.42 3 3.01V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6.58l3 2.99 4-4 4 4'/%3E%3C/svg%3E\")}.iv-image-link{border:1px solid #0003;box-shadow:1px 1px 3px #00000080;display:inline-flex;margin:3px;min-height:50px;min-width:50px;padding:4px;vertical-align:top}.iv-image-link img{margin:0}.iv-image-link>:not(img){align-items:center;display:flex;justify-content:center;width:100%}.iv-image-link:before{background-color:#00000080;bottom:4px;content:\"\";left:4px;opacity:0;position:absolute;right:4px;top:4px;transition:opacity .35s ease;z-index:1}.iv-image-link.iv-icon--type-loading:before,.iv-image-link:hover:before{opacity:1}.iv-image-link img:after,.iv-image-link img:before{content:\"\";position:absolute}.iv-image-link img:before{background-color:#0003;height:100%;left:0;top:0;width:100%}.iv-image-link img:after{height:35px;width:35px;z-index:0}.iv-image-view{background-color:#000c;color:#fff;display:none;flex-direction:column;height:0;opacity:0;transition:opacity .35s ease-out;user-select:none}.iv-image-view--open body,html.iv-image-view--open{overflow:hidden}.iv-image-view--open .iv-image-view{bottom:0;display:flex;height:auto;left:0;opacity:1;position:fixed;right:0;top:0;z-index:3}.iv-image-view--single .single-hide{visibility:hidden}.iv-image-view__footer,.iv-image-view__header{background-color:#000c;display:flex}.iv-image-view__footer-wrapper,.iv-image-view__header-wrapper{z-index:2}.iv-image-view__header-wrapper{box-shadow:0 3px 7px #000000b3}.iv-image-view__footer-wrapper{box-shadow:0 -3px 7px #000000b3}.iv-image-view__header{justify-content:space-between}.iv-image-view__footer{justify-content:center}.iv-image-view__body{display:flex;height:100%;overflow:auto;position:relative}.iv-image-view__body::-webkit-scrollbar{width:20px}.iv-image-view__body::-webkit-scrollbar-thumb{background-color:#000c}.iv-image-view__body::-webkit-scrollbar-track{background-color:#fffc}.iv-thumbnail-wrapper{display:flex;height:100%;left:0;position:absolute;top:0;width:100%;z-index:0}.iv-image-view__number{align-items:center;display:flex;font-size:18px;padding:0 40px}.iv-image-view__backdrop{height:100%;left:0;position:fixed;top:0;width:100%;z-index:1}.iv-image,.iv-thumbnail{margin:auto;max-height:100%;max-width:100%;object-fit:contain}.iv-image{opacity:1;transition:opacity .35s ease-out;z-index:2}.iv-thumbnail{filter:blur(5px)}.iv-icon--type-error .iv-image,.iv-image-view__image--loading .iv-image,.iv-image-view__image--thumbnail .iv-image{opacity:0}.iv-image-view__image--thumbnail .iv-thumbnail-wrapper{z-index:2}.iv-image-view--full-height .iv-image,.iv-image-view--full-height .iv-thumbnail{cursor:grab;max-height:none}.iv-image-view--full-height .iv-image--grabbing{cursor:grabbing}.iv-icon-button{height:50px;transition:all .35s ease-out;width:50px}.iv-icon-button--small{height:25px;width:25px}.iv-icon-button+.iv-icon-button{margin-left:5px}.iv-icon-button:hover{background-color:#ffffff1a}.iv-icon-button--active,.iv-icon-button:active{background-color:#fff3}.iv-config-form{background-color:#000000d9;color:#fff;display:none;flex-direction:column;height:50%;left:10px;max-width:500px;padding:10px;top:10px;width:50%}.iv-config-form--open{display:flex;position:fixed;z-index:3}.iv-config-form__header{align-items:center;display:flex;padding:10px}.iv-config-form__header-title{flex-grow:1}.iv-config-form__options{display:flex;flex-flow:column wrap;flex-grow:1;overflow:auto}.iv-config-form__label{align-items:center;display:flex;flex:0 0 auto;margin:0;padding:10px;transition:all .35s ease-out}.iv-config-form__label:hover{background-color:#ffffff26}.iv-config-form__checkbox{margin:0 5px 0 0!important}"

  const CLASSES = {
    imageLink: 'js-image-link',
    imageLinkOpenInNew: 'js-image-link-open-in-new',
    zoomIcon: 'iv-icon--type-zoom',
    openInNewIcon: 'iv-icon--type-open-in-new',
    imageLinkHover: 'iv-icon--hover',
    brokenImageIcon: 'iv-icon--type-image-broken',
    loadingIcon: 'iv-icon--type-loading',
    loading: 'iv-image-view__image--loading',
    thumbnail: 'iv-image-view__image--thumbnail',
    open: 'iv-image-view--open',
    single: 'iv-image-view--single',
    fullHeight: 'iv-image-view--full-height',
    iconExpand: 'iv-icon--type-expand',
    iconShrink: 'iv-icon--type-shrink',
    grabbing: 'iv-image--grabbing',
    buttonActive: 'iv-icon-button--active',
  }

  const SELECTORS = {
    imageLink: `.${CLASSES.imageLink}`,
    imageOpenInNewLink: `.${CLASSES.imageLinkOpenInNew}`,
  }

  const EMPTY_SRC =
    'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI='

  const TRANSITION_DURATION = 350

  function initViewer(enabledHosts) {
    addStyle(css_248z)

    const container = $('body')

    const linkCommonClasses = [
      'iv-image-link',
      'iv-icon',
      'iv-icon--hover',
      'iv-icon--size-button',
    ]

    const getExtractor = urlExtractor.getHostExtractorMatcher(enabledHosts)

    const imagesWithLinks = $$('a > img, a > var', container)
      .map((img) => ({
        link: img.parentElement,
        thumbnailUrl: img.src ?? img.title,
      }))
      .filter(({ link }) => link.href)

    for (const { link, thumbnailUrl } of imagesWithLinks) {
      const extractor = getExtractor(link.href)

      if (!extractor) {
        continue
      }

      link.dataset.ivHost = extractor.id
      link.dataset.ivThumbnail = thumbnailUrl

      let viewModeClasses

      if (extractor.viewMode === 'new-tab') {
        viewModeClasses = [CLASSES.imageLinkOpenInNew, CLASSES.openInNewIcon]
        link.setAttribute('title', 'Open in new tab')
      } else {
        viewModeClasses = [CLASSES.imageLink, CLASSES.zoomIcon]
        link.setAttribute('title', 'Open viewer')
      }

      link.classList.add(...linkCommonClasses, ...viewModeClasses)
    }

    $.delegate(container, 'click', {
      [SELECTORS.imageLink]: events.openViewerLinkClick,
      [SELECTORS.imageOpenInNewLink]: events.openInTabLinkClick,
    })
  }

  const elements = {
    container: undefined,
    image: undefined,
    imageThumbnail: undefined,
    imageContainer: undefined,
    imageNumber: undefined,
    imageTotal: undefined,
    buttons: {
      next: undefined,
      previous: undefined,
      close: undefined,
      toggleFullHeight: undefined,
    },
  }

  const state = {
    isFirstClick: true,
    isOpened: false,
    currentLink: undefined,
    linksSet: [],
    isSingle: false,
    getCurrentLinkIndex() {
      return this.currentLink === undefined
        ? -1
        : this.linksSet.indexOf(this.currentLink)
    },
    getLastLinkIndex() {
      return this.linksSet.length - 1
    },
    dragPosition: 0,
    dragging: false,
  }

  const image = {
    async getFullSizeURL(link) {
      let imageURL = link.dataset.ivImgUrl

      if (imageURL) {
        return imageURL
      }

      const thumbnailURL = link.dataset.ivThumbnail
      const imageHost = link.dataset.ivHost

      if (!thumbnailURL || !imageHost) {
        throw new Error(
          '[image-viewer] Either thumbnail URL or host is not set'
        )
      }

      imageURL = await urlExtractor.getImageURL({
        url: link.href,
        thumbnailURL,
        host: imageHost,
      })

      if (!imageURL) {
        image.markAsBroken(link)

        return
      }

      link.dataset.ivImgUrl = imageURL

      return imageURL
    },

    async showInViewer(link) {
      const {
        container,
        image: img,
        imageThumbnail: thumbnail,
        imageNumber,
      } = elements

      state.currentLink = link

      if (state.isSingle) {
        container.classList.add(CLASSES.single)
      } else {
        container.classList.remove(CLASSES.single)
        imageNumber.textContent = (state.getCurrentLinkIndex() + 1).toString()
      }

      if (!state.isOpened) {
        document.documentElement.classList.add(CLASSES.open)
        state.isOpened = true
      }

      img.src = EMPTY_SRC

      if (link.classList.contains(CLASSES.brokenImageIcon)) {
        container.classList.add(CLASSES.brokenImageIcon)

        return
      }

      container.classList.remove(CLASSES.brokenImageIcon)

      container.classList.add(CLASSES.loading, CLASSES.loadingIcon)

      const isSizeKnown = Boolean(link.dataset.ivWidth)
      const thumbnailURL = link.dataset.ivThumbnail
      const imageHost = link.dataset.ivHost

      if (!thumbnailURL || !imageHost) {
        throw new Error(
          '[image-viewer] Either thumbnail URL or host is not set'
        )
      }

      if (isSizeKnown) {
        thumbnail.width = Number(link.dataset.ivWidth)
        thumbnail.src = thumbnailURL

        container.classList.add(CLASSES.thumbnail)
      }

      const imageURL = await image.getFullSizeURL(link)

      if (!imageURL) {
        return
      }

      try {
        const extractor = urlExtractor.getExtractorByHost(imageHost)

        if (extractor.viewMode === 'origin-download') {
          img.src = await image.loadAsBlob(imageURL)
        } else {
          await image.preload(
            imageURL,
            isSizeKnown ? undefined : image.setThumbnailSize
          )

          img.src = imageURL
        }

        container.classList.remove(
          CLASSES.thumbnail,
          CLASSES.loading,
          CLASSES.loadingIcon
        )

        setTimeout(image.hideThumbnail, TRANSITION_DURATION)
      } catch {
        link.classList.remove(CLASSES.imageLink)
        image.markAsBroken(link)

        link.setAttribute('target', '_blank')
      }
    },

    preload(url, onSizeGet) {
      return new Promise((resolve, reject) => {
        const imageObject = new Image()

        imageObject.addEventListener('load', () => resolve())
        imageObject.addEventListener('error', reject)

        imageObject.src = url

        if (onSizeGet) {
          image.getSize(imageObject).then(onSizeGet)
        }
      })
    },

    async loadAsBlob(url) {
      const origin = new URL(url).origin

      const response = await request({
        url,
        headers: {
          referer: origin,
          origin,
        },
        responseType: 'blob',
      })

      return URL.createObjectURL(response.response)
    },

    getSize(img) {
      return new Promise((resolve) => {
        const intervalId = setInterval(() => {
          if (img.naturalWidth) {
            clearInterval(intervalId)
            resolve({ width: img.naturalWidth, isLoaded: img.complete })
          }
        }, 10)
      })
    },

    setThumbnailSize({ width, isLoaded }) {
      if (!state.currentLink) {
        throw new Error('[image-viewer] currentLink is not set')
      }

      const thumbnailURL = state.currentLink.dataset.ivThumbnail

      if (!thumbnailURL) {
        throw new Error('[image-viewer] Thumbnail URL is not set')
      }

      elements.imageThumbnail.width = width
      elements.imageThumbnail.src = thumbnailURL

      if (!isLoaded) {
        elements.container.classList.add(CLASSES.thumbnail)
      }

      state.currentLink.dataset.ivWidth = width.toString()
    },

    hideThumbnail() {
      elements.imageThumbnail.removeAttribute('width')
      elements.imageThumbnail.src = EMPTY_SRC
    },

    hide() {
      document.documentElement.classList.remove(CLASSES.open)
      state.isOpened = false
      state.currentLink = undefined
      elements.image.src = EMPTY_SRC
      events.keyboard.unbind()
    },

    next() {
      const currentIndex = state.getCurrentLinkIndex()
      const newIndex =
        currentIndex < state.getLastLinkIndex() ? currentIndex + 1 : 0

      image.showInViewer(state.linksSet[newIndex])
    },

    previous() {
      const currentIndex = state.getCurrentLinkIndex()
      const newIndex =
        currentIndex === 0 ? state.getLastLinkIndex() : currentIndex - 1

      image.showInViewer(state.linksSet[newIndex])
    },

    toggleFullHeight() {
      elements.container.classList.toggle(CLASSES.fullHeight)
      elements.buttons.toggleFullHeight.classList.toggle(CLASSES.iconExpand)
      elements.buttons.toggleFullHeight.classList.toggle(CLASSES.iconShrink)
    },

    markAsBroken(link) {
      elements.container.classList.replace(
        CLASSES.loadingIcon,
        CLASSES.brokenImageIcon
      )
      elements.container.classList.remove(CLASSES.loading)
      link.classList.replace(CLASSES.zoomIcon, CLASSES.brokenImageIcon)
      link.setAttribute('title', '')
    },
  }

  const events = {
    openViewerLinkClick(event) {
      event.preventDefault()

      if (state.isFirstClick) {
        create.viewContainer()
        state.isFirstClick = false
      }

      const link = event.target

      state.linksSet = $$(SELECTORS.imageLink, link.parentElement ?? undefined)
      state.isSingle = state.linksSet.length === 1

      if (!state.isSingle) {
        elements.imageTotal.textContent = state.linksSet.length.toString()
      }

      events.keyboard.bind()

      image.showInViewer(link)
    },

    async openInTabLinkClick(event) {
      event.preventDefault()

      const link = event.target

      link.classList.replace(CLASSES.openInNewIcon, CLASSES.loadingIcon)

      const imageURL = await image.getFullSizeURL(event.target)

      link.classList.replace(CLASSES.loadingIcon, CLASSES.openInNewIcon)

      if (imageURL) {
        openInTab(imageURL, false)
      }
    },

    keyboard: {
      bind() {
        document.addEventListener('keydown', events.keyboard.handler, true)
      },
      unbind() {
        document.removeEventListener('keydown', events.keyboard.handler, true)
      },

      handler(event) {
        if (event.defaultPrevented || event.repeat) {
          return
        }

        switch (event.key) {
          case 'ArrowRight': {
            image.next()
            break
          }

          case 'ArrowLeft': {
            image.previous()
            break
          }

          case 'Escape': {
            image.hide()
            break
          }

          case ' ': {
            image.toggleFullHeight()
            break
          }

          default: {
            return
          }
        }

        event.preventDefault()
      },
    },

    mouse(event) {
      switch (event.type) {
        case 'mousedown': {
          state.dragging = true
          state.dragPosition = event.clientY
          elements.image.classList.add(CLASSES.grabbing)
          break
        }

        case 'mousemove': {
          if (state.dragging) {
            elements.imageContainer.scrollTop -=
              event.clientY - state.dragPosition
            state.dragPosition = event.clientY
          }
          break
        }

        case 'mouseup':

        // fall through
        case 'mouseout': {
          state.dragging = false
          elements.image.classList.remove(CLASSES.grabbing)
          break
        }

        case 'dblclick': {
          image.toggleFullHeight()
          break
        }

        default: {
          return
        }
      }

      event.preventDefault()
    },
  }

  const create = {
    viewContainer() {
      elements.container = $.create('div', {
        className: 'iv-image-view iv-icon iv-icon--size-button',
        contents: [
          create.viewContainerHeader(),
          create.viewContainerBody(),
          create.viewContainerFooter(),
        ],
      })

      document.body.append(elements.container)
    },

    viewContainerBody() {
      elements.image = $.create('img', {
        className: 'iv-image',
        events: {
          'mousedown mouseup mousemove mouseout dblclick': events.mouse,
        },
      })

      elements.imageThumbnail = $.create('img', {
        className: 'iv-thumbnail',
      })

      elements.imageContainer = $.create('div', {
        className: 'iv-image-view__body',
        contents: [
          {
            tag: 'div',
            className: 'iv-image-view__backdrop',
            events: {
              click: image.hide,
            },
          },
          {
            tag: 'div',
            className: 'iv-thumbnail-wrapper',
            contents: elements.imageThumbnail,
          },
          elements.image,
        ],
      })

      return elements.imageContainer
    },

    viewContainerHeader() {
      elements.imageNumber = document.createElement('span')
      elements.imageTotal = document.createElement('span')
      const imageNumber = $.create('div', {
        className: 'iv-image-view__number single-hide',
        contents: [elements.imageNumber, '/', elements.imageTotal],
      })

      elements.buttons.close = create.toolbarButton(
        'Close (Esc)',
        'close',
        image.hide
      )

      return {
        tag: 'div',
        className: 'iv-image-view__header-wrapper',
        contents: {
          tag: 'div',
          className: 'iv-image-view__header',
          contents: [imageNumber, elements.buttons.close],
        },
      }
    },

    viewContainerFooter() {
      const buttons = elements.buttons

      buttons.previous = create.toolbarButton(
        'Previous (←)',
        'previous',
        image.previous,
        'single-hide'
      )
      buttons.toggleFullHeight = create.toolbarButton(
        'Toggle full height (Space)',
        'expand',
        image.toggleFullHeight
      )
      buttons.next = create.toolbarButton(
        'Next (→)',
        'next',
        image.next,
        'single-hide'
      )

      return {
        tag: 'div',
        className: 'iv-image-view__footer-wrapper',
        contents: {
          tag: 'div',
          className: 'iv-image-view__footer',
          contents: [buttons.previous, buttons.toggleFullHeight, buttons.next],
        },
      }
    },

    toolbarButton(title, icon, handler, className = '') {
      return $.create('a', {
        href: '#',
        title,
        className: `iv-icon-button iv-icon iv-icon--type-${icon} ${className}`,
        events: {
          click: (event) => {
            event.preventDefault()
            handler()
          },
        },
      })
    },
  }

  $.ready().then(async () => {
    const hostConfig = await initHostConfig()

    initViewer(hostConfig.enabledHosts)
  })
})()
