// ==UserScript==
// @name         Pornolab Enhancer
// @version      1.12.3
// @description  Improves User Experience
// @namespace    https://github.com/nikolay-borzov
// @author       nikolay-borzov
// @license      MIT
// @icon         https://raw.githubusercontent.com/nikolay-borzov/user-scripts/master/pornolab-enhancer/resources/icon.png
// @homepageURL  https://github.com/nikolay-borzov/user-scripts
// @homepage     https://github.com/nikolay-borzov/user-scripts
// @supportURL   https://github.com/nikolay-borzov/user-scripts/issues
// @match        *://pornolab.net/*
// @match        *://pornolab.lib/*
// @noframes
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/443466/Pornolab%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/443466/Pornolab%20Enhancer.meta.js
// ==/UserScript==

;(function () {
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

  /* global Bliss */
  // eslint-disable-next-line -- blissfuljs v1.0.6 Shy https://blissfuljs.com/
  !function(){function e(o,i,t){return i=void 0===i?1:i,(t=t||i+1)-i<=1?function(){if(arguments.length<=i||"string"===c.type(arguments[i]))return o.apply(this,arguments);var t,e,n=arguments[i];for(e in n){var r=Array.prototype.slice.call(arguments);r.splice(i,1,e,n[e]),t=o.apply(this,r);}return t}:e(e(o,i+1,t),i,t-1)}function s(e,n,t){var r=a(t);if("string"===r){var o=Object.getOwnPropertyDescriptor(n,t);!o||o.writable&&o.configurable&&o.enumerable&&!o.get&&!o.set?e[t]=n[t]:(delete e[t],Object.defineProperty(e,t,o));}else if("array"===r)t.forEach(function(t){t in n&&s(e,n,t);});else for(var i in n)t&&("regexp"===r&&!t.test(i)||"function"===r&&!t.call(n,i))||s(e,n,i);return e}function a(t){if(null===t)return "null";if(void 0===t)return "undefined";var e=(Object.prototype.toString.call(t).match(/^\[object\s+(.*?)\]$/)[1]||"").toLowerCase();return "number"==e&&isNaN(t)?"nan":e}var c=self.Bliss=s(function(t,e){return 2==arguments.length&&!e||!t?null:"string"===c.type(t)?(e||document).querySelector(t):t||null},self.Bliss);s(c,{extend:s,overload:e,type:a,property:c.property||"_",listeners:new(self.WeakMap?WeakMap:Map),original:{addEventListener:(self.EventTarget||Node).prototype.addEventListener,removeEventListener:(self.EventTarget||Node).prototype.removeEventListener},sources:{},noop:function(){},$:function(t,e){return t instanceof Node||t instanceof Window?[t]:2!=arguments.length||e?Array.prototype.slice.call("string"==typeof t?(e||document).querySelectorAll(t):t||[]):[]},defined:function(){for(var t=0;t<arguments.length;t++)if(void 0!==arguments[t])return arguments[t]},create:function(t,e){return t instanceof Node?c.set(t,e):(1===arguments.length&&(e="string"===c.type(t)?{}:(t=(e=t).tag,c.extend({},e,function(t){return "tag"!==t}))),c.set(document.createElement(t||"div"),e))},each:function(t,e,n){for(var r in n=n||{},t)n[r]=e.call(t,r,t[r]);return n},ready:function(e,t,n){if("function"!=typeof e||t||(t=e,e=void 0),e=e||document,t&&("loading"!==e.readyState?t():c.once(e,"DOMContentLoaded",function(){t();})),!n)return new Promise(function(t){c.ready(e,t,!0);})},Class:function(t){var e,n,r=["constructor","extends","abstract","static"].concat(Object.keys(c.classProps)),o=t.hasOwnProperty("constructor")?t.constructor:c.noop;2==arguments.length?(n=arguments[0],t=arguments[1]):((n=function(){if(this.constructor.__abstract&&this.constructor===n)throw new Error("Abstract classes cannot be directly instantiated.");n.super&&!e&&n.super.apply(this,arguments),o.apply(this,arguments);}).super=t.extends||null,!n.super||(e=0===(n.super+"").indexOf("class "))&&console.error(`You are using $.Class() to create a fake function-based class that extends a native JS class. This will not work. You should convert your code to use native JS classes too. You can still pass a class into $.Class() to use its conveniences.`),n.prototype=c.extend(Object.create(n.super?n.super.prototype:Object),{constructor:n}),n.prototype.super=n.super?n.super.prototype:null,n.__abstract=!!t.abstract);function i(t){return this.hasOwnProperty(t)&&-1===r.indexOf(t)}if(t.static)for(var s in c.extend(n,t.static,i),c.classProps)s in t.static&&c.classProps[s](n,t.static[s]);for(s in c.extend(n.prototype,t,i),c.classProps)s in t&&c.classProps[s](n.prototype,t[s]);return n},classProps:{lazy:e(function(t,e,n){return Object.defineProperty(t,e,{get:function(){var t=n.call(this);return Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0}),t},set:function(t){Object.defineProperty(this,e,{value:t,configurable:!0,enumerable:!0,writable:!0});},configurable:!0,enumerable:!0}),t}),live:e(function(t,n,r){return "function"===c.type(r)&&(r={set:r}),Object.defineProperty(t,n,{get:function(){var t=this["_"+n],e=r.get&&r.get.call(this,t);return void 0!==e?e:t},set:function(t){var e=this["_"+n],e=r.set&&r.set.call(this,t,e);this["_"+n]=void 0!==e?e:t;},configurable:r.configurable,enumerable:r.enumerable}),t})},include:function(){var n=arguments[arguments.length-1],t=2===arguments.length&&arguments[0],r=document.createElement("script");return t?Promise.resolve():new Promise(function(t,e){c.set(r,{async:!0,onload:function(){t(r),r.parentNode&&r.parentNode.removeChild(r);},onerror:function(){e(r);},src:n,inside:document.head});})},load:function t(r,e){e=e?new URL(e,location.href):location.href,r=new URL(r,e);e=t.loading=t.loading||{};return e[r+""]||(/\.css$/.test(r.pathname)?e[r+""]=new Promise(function(t,e){var n=c.create("link",{href:r,rel:"stylesheet",inside:document.head,onload:function(){t(n);},onerror:function(){e(n);}});}):e[r+""]=c.include(r))},fetch:function(t,e){if(!t)throw new TypeError("URL parameter is mandatory and cannot be "+t);var n,r=s({url:new URL(t,location),data:"",method:"GET",headers:{},xhr:new XMLHttpRequest},e);for(n in r.method=r.method.toUpperCase(),c.hooks.run("fetch-args",r),"GET"===r.method&&r.data&&(r.url.search+=r.data),document.body.setAttribute("data-loading",r.url),r.xhr.open(r.method,r.url.href,!1!==r.async,r.user,r.password),e)if("upload"===n)r.xhr.upload&&"object"==typeof e[n]&&c.extend(r.xhr.upload,e[n]);else if(n in r.xhr)try{r.xhr[n]=e[n];}catch(t){self.console&&console.error(t);}var o,t=Object.keys(r.headers).map(function(t){return t.toLowerCase()});for(o in "GET"!==r.method&&-1===t.indexOf("content-type")&&r.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded"),r.headers)void 0!==r.headers[o]&&r.xhr.setRequestHeader(o,r.headers[o]);t=new Promise(function(t,e){r.xhr.onload=function(){document.body.removeAttribute("data-loading"),0===r.xhr.status||200<=r.xhr.status&&r.xhr.status<300||304===r.xhr.status?t(r.xhr):e(c.extend(Error(r.xhr.statusText),{xhr:r.xhr,get status(){return this.xhr.status}}));},r.xhr.onerror=function(){document.body.removeAttribute("data-loading"),e(c.extend(Error("Network Error"),{xhr:r.xhr}));},r.xhr.ontimeout=function(){document.body.removeAttribute("data-loading"),e(c.extend(Error("Network Timeout"),{xhr:r.xhr}));},r.xhr.send("GET"===r.method?null:r.data);});return t.xhr=r.xhr,t},value:function(t){var e="string"!=typeof t;return c.$(arguments).slice(+e).reduce(function(t,e){return t&&t[e]},e?t:self)}}),c.Hooks=new c.Class({add:function(t,e,n){if("string"==typeof arguments[0])(Array.isArray(t)?t:[t]).forEach(function(t){this[t]=this[t]||[],e&&this[t][n?"unshift":"push"](e);},this);else for(var t in arguments[0])this.add(t,arguments[0][t],e);},run:function(t,e){this[t]=this[t]||[],this[t].forEach(function(t){t.call(e&&e.context?e.context:e,e);});}}),c.hooks=new c.Hooks;c.property;c.Element=function(t){this.subject=t,this.data={},this.bliss={};},c.Element.prototype={set:e(function(t,e){t in c.setProps?c.setProps[t].call(this,e):t in this?this[t]=e:this.setAttribute(t,e);},0),transition:function(o,i){return new Promise(function(t,e){var n,r;"transition"in this.style&&0!==i?(n=c.extend({},this.style,/^transition(Duration|Property)$/),c.style(this,{transitionDuration:(i||400)+"ms",transitionProperty:Object.keys(o).join(", ")}),c.once(this,"transitionend",function(){clearTimeout(r),c.style(this,n),t(this);}),r=setTimeout(t,i+50,this),c.style(this,o)):(c.style(this,o),t(this));}.bind(this))},fire:function(t,e){var n=document.createEvent("HTMLEvents");return n.initEvent(t,!0,!0),this.dispatchEvent(c.extend(n,e))},bind:e(function(t,n){var e;1<arguments.length&&("function"===c.type(n)||n.handleEvent)&&(e=n,(n="object"===c.type(arguments[2])?arguments[2]:{capture:!!arguments[2]}).callback=e);var r=c.listeners.get(this)||{};t.trim().split(/\s+/).forEach(function(t){var e;-1<t.indexOf(".")&&(e=(t=t.split("."))[1],t=t[0]),r[t]=r[t]||[],0===r[t].filter(function(t){return t.callback===n.callback&&t.capture==n.capture}).length&&r[t].push(c.extend({className:e},n)),c.original.addEventListener.call(this,t,n.callback,n);},this),c.listeners.set(this,r);},0),unbind:e(function(t,i){var e;i&&("function"===c.type(i)||i.handleEvent)&&(e=i,i=arguments[2]),(i=(i="boolean"==c.type(i)?{capture:i}:i)||{}).callback=i.callback||e;var s=c.listeners.get(this);(t||"").trim().split(/\s+/).forEach(function(t){var e,n;if(-1<t.indexOf(".")&&(e=(t=t.split("."))[1],t=t[0]),!s)return t&&i.callback?c.original.removeEventListener.call(this,t,i.callback,i.capture):void 0;for(n in s)if(!t||n===t)for(var r,o=0;r=s[n][o];o++)e&&e!==r.className||i.callback&&i.callback!==r.callback||!!i.capture!=!!r.capture&&(t||i.callback||void 0!==i.capture)||(s[n].splice(o,1),c.original.removeEventListener.call(this,n,r.callback,r.capture),o--);},this);},0),when:function(r,o){var t=this;return new Promise(function(n){t.addEventListener(r,function t(e){o&&!o.call(this,e)||(this.removeEventListener(r,t),n(e));});})},toggleAttribute:function(t,e,n){(n=arguments.length<3?null!==e:n)?this.setAttribute(t,e):this.removeAttribute(t);}},c.setProps={style:function(t){for(var e in t)e in this.style?this.style[e]=t[e]:this.style.setProperty(e,t[e]);},attributes:function(t){for(var e in t)this.setAttribute(e,t[e]);},properties:function(t){c.extend(this,t);},events:function(t){if(1!=arguments.length||!t||!t.addEventListener)return c.bind.apply(this,[this].concat(c.$(arguments)));var e,n=this;if(c.listeners){var r,o=c.listeners.get(t);for(r in o)o[r].forEach(function(t){c.bind(n,r,t.callback,t.capture);});}for(e in t)0===e.indexOf("on")&&(this[e]=t[e]);},once:e(function(t,e){function n(){return c.unbind(r,t,n),e.apply(r,arguments)}var r=this;c.bind(this,t,n,{once:!0});},0),delegate:e(function(t,e,n){c.bind(this,t,function(t){t.target.closest(e)&&n.call(this,t);});},0,2),contents:function(t){!t&&0!==t||(Array.isArray(t)?t:[t]).forEach(function(t){var e=c.type(t);/^(string|number)$/.test(e)?t=document.createTextNode(t+""):"object"===e&&(t=c.create(t)),t instanceof Node&&this.appendChild(t);},this);},inside:function(t){t&&t.appendChild(this);},before:function(t){t&&t.parentNode.insertBefore(this,t);},after:function(t){t&&t.parentNode.insertBefore(this,t.nextSibling);},start:function(t){t&&t.insertBefore(this,t.firstChild);},around:function(t){t&&t.parentNode&&c.before(this,t),this.appendChild(t);}},c.Array=function(t){this.subject=t;},c.Array.prototype={all:function(t){var e=c.$(arguments).slice(1);return this[t].apply(this,e)}},c.add=e(function(r,n,o,t){o=c.extend({$:!0,element:!0,array:!0},o),"function"==c.type(n)&&(!o.element||r in c.Element.prototype&&t||(c.Element.prototype[r]=function(){return this.subject&&c.defined(n.apply(this.subject,arguments),this.subject)}),!o.array||r in c.Array.prototype&&t||(c.Array.prototype[r]=function(){var e=arguments;return this.subject.map(function(t){return t&&c.defined(n.apply(t,e),t)})}),o.$&&(c.sources[r]=c[r]=n,(o.array||o.element)&&(c[r]=function(){var t=[].slice.apply(arguments),e=t.shift(),n=o.array&&Array.isArray(e)?"Array":"Element";return c[n].prototype[r].apply({subject:e},t)})));},0),c.add(c.Array.prototype,{element:!1}),c.add(c.Element.prototype),c.add(c.setProps),c.add(c.classProps,{element:!1,array:!1});var n=document.createElement("_");c.add(c.extend({},HTMLElement.prototype,function(t){return "function"===c.type(n[t])}),null,!0);}();
  // eslint-disable-next-line
  const $ = Bliss;
  // eslint-disable-next-line
  Bliss.$;

  const css_248z$4 =
    ':root{--color-active:#345da4;--color-active-1:#930;--color-border:#cacaca;--color-border-1:#92a3a4;--color-bkg:#efefef;--color-bkg-1:#e7e7e7;--color-bkg-2:#b5bec3;--color-bkg-3:#d1d7dc;--color-bkg-4:#d6d6d6;--color-bkg-5:#ccc;--color-bkg-6:#f5f5f5}.config-menu-link{background:url(//static.pornolab.lib/templates/default/images/menu_open_1.gif) no-repeat 100%;font-weight:700;padding-right:12px}.config-form{background-color:#fff;border:1px solid #92a3a4;display:none;padding:1px;position:absolute;z-index:1000}.config-form__footer{background-color:#b5bec3;padding:5px 0;text-align:center}.config-form__label{align-items:center;background-color:#e7e7e7;display:flex;padding:7px;transition:all .3s ease}.config-form__label:hover{background-color:#d1d7dc;color:#930}.config-form__checkbox{margin:0 7px 0 0}'

  /* global Menu */

  const FEATURES_DEFAULT = {
    tags: true,
    similar: true,
    pager: true,
    download: true,
  }

  async function initConfig() {
    const features = {
      ...FEATURES_DEFAULT,
      ...(await store.getValue('features')),
    }

    await $.ready()

    addStyle(css_248z$4)
    createMenuLink(features)

    return features
  }

  function createMenuLink(features) {
    document.body.append(createConfigForm(features))

    const container = $('#main-nav td')

    const menuLink = $.create('a', {
      className: 'config-menu-link',
      textContent: 'PLE',
      href: '#config-form',
    })

    $.contents(container, menuLink)

    const $menuLink = jQuery(menuLink)

    $menuLink
      .click((event) => {
        event.preventDefault()
        Menu.clicked(jQuery(menuLink))
      })
      .hover(
        () => Menu.hovered($menuLink),
        () => Menu.unhovered($menuLink)
      )
  }

  function createConfigForm(features) {
    const button = {
      tag: 'input',
      type: 'button',
      value: 'Apply',
      events: {
        click: (event) => {
          document.location.reload()
          Menu.hide(event)
        },
      },
    }

    return $.create('div', {
      id: 'config-form',
      className: 'config-form',
      contents: [
        getRow('Tags', 'tags', features.tags),
        getRow('Find similar', 'similar', features.similar),
        getRow('Pager', 'pager', features.pager),
        getRow('Download', 'download', features.download),
        {
          tag: 'div',
          className: 'config-form__label',
          contents: {
            tag: 'a',
            target: '_blank',
            href: 'https://github.com/nikolay-borzov/user-scripts#image-viewer',
            contents: 'Try Image Viewer',
          },
        },
        {
          tag: 'div',
          className: 'config-form__footer',
          contents: button,
        },
      ],
      delegate: {
        change: {
          '.js-config-checkbox': async ({ target: { value, checked } }) => {
            await store.patch('features', {
              [value]: checked,
            })
          },
        },
      },
      events: {
        mousedown: (event) => event.stopPropagation(),
      },
    })
  }

  function getRow(label, storeKey, checked) {
    return $.create('label', {
      className: 'config-form__label',
      contents: [
        {
          tag: 'input',
          type: 'checkbox',
          className: 'config-form__checkbox js-config-checkbox',
          checked,
          value: storeKey,
        },
        label,
      ],
    })
  }

  const css_248z$3 =
    ":root{--color-active:#345da4;--color-active-1:#930;--color-border:#cacaca;--color-border-1:#92a3a4;--color-bkg:#efefef;--color-bkg-1:#e7e7e7;--color-bkg-2:#b5bec3;--color-bkg-3:#d1d7dc;--color-bkg-4:#d6d6d6;--color-bkg-5:#ccc;--color-bkg-6:#f5f5f5}.quick-download{background-color:#efefef;border:1px solid #cacaca;border-radius:0 0 10px 10px;box-shadow:0 1px 3px #0000001f,0 1px 2px #0000003d;color:#000!important;height:65px;overflow:hidden;position:fixed;right:25%;text-align:center;text-decoration:none;top:0;transform:translateY(-90%);transition:all .3s cubic-bezier(.25,.8,.25,1);width:65px}.quick-download:hover{border-color:#345da4;color:#000!important;text-decoration:none!important;transform:translateY(0)}.quick-download:after{background:#345da440;border-radius:100%;content:\"\";height:5px;left:0;opacity:0;position:absolute;right:0;top:0;transform:scale(1);transform-origin:50% 50%;width:100%}.quick-download:focus:not(:active):after{animation:ripple 1s ease-out}.quick-download__icon{background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg height='24' width='24' xmlns='http://www.w3.org/2000/svg' fill='%23345da4'%3E%3Cpath d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E\") no-repeat 50%;background-size:contain;display:block;height:45px}@keyframes ripple{0%{opacity:1;transform:scale(0)}20%{opacity:1;transform:scale(25)}to{opacity:0;transform:scale(40)}}"

  const ENABLE_ON_PATH = '/forum/viewtopic.php'

  async function initDownload() {
    await $.ready()

    if (location.pathname !== ENABLE_ON_PATH) {
      return
    }

    const downloadLink = $('.dl-link')

    if (!downloadLink) {
      return
    }

    addStyle(css_248z$3)

    createDownloadLink(downloadLink)
  }

  function createDownloadLink(downloadLink) {
    const link = $.create('a', {
      className: 'quick-download',
      href: '#',

      events: {
        click: (event) => {
          event.preventDefault()

          triggerEvent(
            downloadLink,
            jQuery.browser.opera ? 'mouseover' : 'mousedown'
          )
          triggerEvent(downloadLink, 'click')
        },
      },

      contents: [
        {
          tag: 'span',
          className: 'quick-download__icon',
        },

        {
          tag: 'span',
          textContent: document
            .querySelector('.attach')
            ?.querySelector('.row1:nth-child(5) td:nth-child(2)')?.textContent,
        },
      ],
    })

    document.body.append(link)
  }

  function triggerEvent(element, eventName) {
    const event = new MouseEvent(eventName, {
      bubbles: true,
      cancelable: true,
    })

    element.dispatchEvent(event)
  }

  const regExp = {
    getMatchGroups(regExp, string) {
      const matches = []
      let match

      while ((match = regExp.exec(string)) !== null) {
        if (match.index === regExp.lastIndex) {
          regExp.lastIndex++
        }

        const groups = match.slice(1)

        if (groups.some(Boolean)) {
          matches.push(groups)
        }
      }

      return matches
    },

    getFirstMatchGroup(regExp, string) {
      const match = regExp.exec(string)

      return match ? match[1] : undefined
    },
  }

  const css_248z$2 =
    ":root{--color-active:#345da4;--color-active-1:#930;--color-border:#cacaca;--color-border-1:#92a3a4;--color-bkg:#efefef;--color-bkg-1:#e7e7e7;--color-bkg-2:#b5bec3;--color-bkg-3:#d1d7dc;--color-bkg-4:#d6d6d6;--color-bkg-5:#ccc;--color-bkg-6:#f5f5f5}.find-similar-link{border:1px solid #0000;display:inline-block;height:25px;margin-left:10px;position:relative;vertical-align:middle;width:25px}.find-similar-link:before{background:url(\"data:image/svg+xml;charset=utf-8,%3Csvg fill='%23345da4' height='24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14z'/%3E%3C/svg%3E\") no-repeat 50%;background-size:contain;box-sizing:border-box;content:\"\";height:17px;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:17px}.find-similar-link:hover{background-color:#efefef;border-color:#345da4}"

  const TOPIC_PATH$1 = '/forum/viewtopic.php'
  const TAGS_REGEX = /\[[^\]]+]/g

  const WORDS_REGEX = /([\w'\u0400-\u04FF-]+)/g
  const REMOVE_CHARS_REGEX = /^[\d-.]+$/
  const SEARCH_TERM_MAX_LENGTH = 61

  async function initFindSimilar() {
    await $.ready()

    if (location.pathname === TOPIC_PATH$1) {
      addStyle(css_248z$2)
      createFindSimilarLink()
    }
  }

  function createFindSimilarLink() {
    const titleElement = $('.maintitle')
    const titleLink = titleElement.children[0]

    const rawTitle = titleLink.textContent.replace(TAGS_REGEX, '').trim()
    const words = regExp.getMatchGroups(WORDS_REGEX, rawTitle)

    let searchTerm = words
      .filter(([word]) => !REMOVE_CHARS_REGEX.test(word))
      .join(' ')

    if (searchTerm.length > SEARCH_TERM_MAX_LENGTH) {
      searchTerm = searchTerm.slice(0, SEARCH_TERM_MAX_LENGTH - 1)
      searchTerm = searchTerm.slice(0, Math.max(0, searchTerm.lastIndexOf(' ')))
    }

    $.create('a', {
      className: 'find-similar-link',
      href: `/forum/tracker.php?nm=${searchTerm}#search_opt`,
      target: '_blank',
      title: 'Find similar',
      after: titleLink,
    })
  }

  const css_248z$1 =
    ':root{--color-active:#345da4;--color-active-1:#930;--color-border:#cacaca;--color-border-1:#92a3a4;--color-bkg:#efefef;--color-bkg-1:#e7e7e7;--color-bkg-2:#b5bec3;--color-bkg-3:#d1d7dc;--color-bkg-4:#d6d6d6;--color-bkg-5:#ccc;--color-bkg-6:#f5f5f5}.nav .menu-root,.small>b>.menu-root,a.pg{background-color:#efefef;border:1px solid #cacaca;display:inline-block;padding:.5em .7em;text-decoration:none}a.pg{margin-right:.1em}.nav .menu-root,.small>b>.menu-root{background-position:95% 50%;background-repeat:no-repeat;padding-right:20px}.nav .menu-root:hover,.small>b>.menu-root:hover,a.pg:hover{border-color:#345da4;color:#345da4;text-decoration:none!important}.menu-root~b{border:1px solid #0000;display:inline-block;margin-right:.1em;padding:.5em .7em}'

  const css_248z =
    ":root{--color-active:#345da4;--color-active-1:#930;--color-border:#cacaca;--color-border-1:#92a3a4;--color-bkg:#efefef;--color-bkg-1:#e7e7e7;--color-bkg-2:#b5bec3;--color-bkg-3:#d1d7dc;--color-bkg-4:#d6d6d6;--color-bkg-5:#ccc;--color-bkg-6:#f5f5f5}.tags-row{padding:3px 0 0}.tags-row-tag{background-color:#efefef;border:1px solid #cacaca;border-radius:5px;display:inline-block;margin:2px 5px;padding:5px;position:relative;text-decoration:none}.tags-row-tag:hover{border-color:#345da4;color:#345da4;text-decoration:none!important}.tags-row-tag:nth-child{margin-left:0}.tag-with-icon{padding-left:25px}.tag-with-icon:before{background-position:50%;background-repeat:no-repeat;background-size:contain;border:1px solid #cacaca;border-radius:100%;box-sizing:border-box;content:\"\";height:16px;left:5px;position:absolute;top:50%;transform:translateY(-50%);width:16px}.icon-en:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='256' fill='%23F0F0F0'/%3E%3Cpath d='M52.92 100.142c-20.11 26.163-35.272 56.318-44.1 89.077h133.177L52.92 100.14zm450.26 89.078c-8.828-32.76-23.992-62.914-44.1-89.077l-89.075 89.076H503.18zM8.82 322.784c8.83 32.758 23.992 62.913 44.1 89.075l89.074-89.076H8.82zM411.858 52.92c-26.163-20.108-56.317-35.27-89.076-44.1v133.176l89.076-89.075zM100.142 459.08c26.163 20.108 56.318 35.27 89.076 44.1V370.006l-89.076 89.074zM189.217 8.82c-32.758 8.83-62.913 23.992-89.075 44.1l89.075 89.075V8.82zm133.566 494.36c32.758-8.83 62.913-23.992 89.075-44.1l-89.075-89.075V503.18zm47.222-180.396 89.075 89.076c20.108-26.162 35.272-56.318 44.1-89.076H370.006z' fill='%230052B4'/%3E%3Cg fill='%23D80027'%3E%3Cpath d='M509.833 222.61h-220.44V2.166a258.478 258.478 0 0 0-66.783.001v220.44H2.166a258.478 258.478 0 0 0 .001 66.783h220.44v220.443a258.335 258.335 0 0 0 66.783 0v-220.44h220.443A258.583 258.583 0 0 0 512 256c0-11.317-.744-22.46-2.167-33.39z'/%3E%3Cpath d='M322.783 322.784 437.02 437.02a256.914 256.914 0 0 0 15.047-16.435l-97.802-97.802h-31.482zm-133.566 0h-.002L74.98 437.02a256.914 256.914 0 0 0 16.435 15.047l97.802-97.804v-31.48zm0-133.564v-.003L74.98 74.98a256.914 256.914 0 0 0-15.047 16.435l97.803 97.803h31.48zm133.566 0L437.02 74.98a256.605 256.605 0 0 0-16.435-15.046l-97.802 97.803v31.482z'/%3E%3C/g%3E%3C/svg%3E\")}.icon-ja:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='256' fill='%23F0F0F0'/%3E%3Ccircle cx='256' cy='256' r='111.304' fill='%23D80027'/%3E%3C/svg%3E\")}.icon-ru:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='256' fill='%23F0F0F0'/%3E%3Cpath d='M496.077 345.043C506.367 317.31 512 287.313 512 256s-5.632-61.31-15.923-89.043H15.923C5.633 194.69 0 224.687 0 256s5.633 61.31 15.923 89.043L256 367.303l240.077-22.26z' fill='%230052B4'/%3E%3Cpath d='M256 512c110.07 0 203.906-69.472 240.077-166.957H15.923C52.093 442.528 145.93 512 256 512z' fill='%23D80027'/%3E%3C/svg%3E\")}.icon-zh:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-49 141 512 512'%3E%3Ccircle cx='207' cy='397' r='256' style='fill:%23d80027'/%3E%3Cpath d='m91.1 296.8 22.1 68h71.5l-57.8 42.1 22.1 68-57.9-42-57.9 42 22.2-68-57.9-42.1H69zm163.4 240.7-16.9-20.8-25 9.7 14.5-22.5-16.9-20.9 25.9 6.9 14.6-22.5 1.4 26.8 26 6.9-25.1 9.6zm33.6-61 8-25.6-21.9-15.5 26.8-.4 7.9-25.6 8.7 25.4 26.8-.3-21.5 16 8.6 25.4-21.9-15.5zm45.3-147.6L321.6 353l19.2 18.7-26.5-3.8-11.8 24-4.6-26.4-26.6-3.8 23.8-12.5-4.6-26.5 19.2 18.7zm-78.2-73-2 26.7 24.9 10.1-26.1 6.4-1.9 26.8-14.1-22.8-26.1 6.4 17.3-20.5-14.2-22.7 24.9 10.1z' style='fill:%23ffda44'/%3E%3C/svg%3E\")}.icon-es:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M0 256c0 31.314 5.633 61.31 15.923 89.043L256 367.303l240.077-22.26C506.367 317.31 512 287.313 512 256s-5.633-61.31-15.923-89.043L256 144.697l-240.077 22.26C5.633 194.69 0 224.687 0 256z' fill='%23FFDA44'/%3E%3Cpath d='M496.077 166.957C459.907 69.473 366.07 0 256 0S52.094 69.473 15.923 166.957h480.154zM15.923 345.043C52.093 442.527 145.93 512 256 512s203.906-69.473 240.077-166.957H15.923z' fill='%23D80027'/%3E%3C/svg%3E\")}.icon-pt:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M0 256c0 110.07 69.472 203.905 166.955 240.076L189.217 256 166.955 15.922C69.472 52.095 0 145.93 0 256z' fill='%236DA544'/%3E%3Cpath d='M512 256C512 114.616 397.384 0 256 0c-31.314 0-61.31 5.633-89.045 15.923v480.154C194.69 506.367 224.685 512 256 512c141.384 0 256-114.616 256-256z' fill='%23D80027'/%3E%3Ccircle cx='166.957' cy='256' r='89.043' fill='%23FFDA44'/%3E%3Cpath d='M116.87 211.478v55.652c0 27.662 22.424 50.087 50.087 50.087s50.087-22.424 50.087-50.087v-55.652H116.87z' fill='%23D80027'/%3E%3Cpath d='M166.957 283.826c-9.206 0-16.696-7.49-16.696-16.696v-22.26h33.392v22.26c0 9.206-7.49 16.696-16.695 16.696z' fill='%23F0F0F0'/%3E%3C/svg%3E\")}.icon-de:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M15.923 345.043C52.093 442.527 145.93 512 256 512s203.906-69.473 240.077-166.957L256 322.783l-240.077 22.26z' fill='%23FFDA44'/%3E%3Cpath d='M256 0C145.93 0 52.094 69.472 15.923 166.957L256 189.217l240.077-22.26C459.907 69.47 366.07 0 256 0z'/%3E%3Cpath d='M15.923 166.957C5.633 194.69 0 224.687 0 256s5.633 61.31 15.923 89.043h480.155C506.368 317.31 512 287.313 512 256s-5.632-61.31-15.923-89.043H15.923z' fill='%23D80027'/%3E%3C/svg%3E\")}.icon-fr:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='256' fill='%23f0f0f0'/%3E%3Cpath d='M512 256c0-110.071-69.472-203.906-166.957-240.077v480.155C442.528 459.906 512 366.071 512 256z' fill='%23d80027'/%3E%3Cpath d='M0 256c0 110.071 69.473 203.906 166.957 240.077V15.923C69.473 52.094 0 145.929 0 256z' fill='%230052b4'/%3E%3C/svg%3E\")}.icon-ko:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='256' fill='%23f0f0f0'/%3E%3Cpath d='M345.043 256c0 22.261-39.866 77.913-89.043 77.913S166.957 278.261 166.957 256c0-49.178 39.866-89.043 89.043-89.043s89.043 39.865 89.043 89.043z' fill='%23d80027'/%3E%3Cpath d='M345.043 256c0 49.178-39.866 89.043-89.043 89.043S166.957 305.178 166.957 256' fill='%230052b4'/%3E%3Cpath d='m350.442 334.705 23.61-23.61 15.741 15.74-23.61 23.61zm-39.357 39.355 23.61-23.612 15.741 15.741-23.61 23.611zm86.585 7.857 23.611-23.61 15.74 15.74-23.61 23.61zm-39.356 39.361 23.61-23.61 15.741 15.74-23.61 23.611zm15.741-62.965 23.61-23.61 15.741 15.74-23.61 23.61zm-39.346 39.354 23.61-23.61 15.741 15.74-23.61 23.611zm62.969-220.377-62.963-62.963 15.741-15.74 62.962 62.962zm-62.965-15.732-23.61-23.61 15.74-15.74 23.61 23.61zm39.347 39.349-23.61-23.611 15.74-15.74 23.61 23.61zm7.855-86.571-23.61-23.611 15.74-15.741 23.61 23.61zm39.368 39.352-23.611-23.61 15.74-15.741 23.612 23.61zm-330.56 204.63 62.962 62.962-15.74 15.74-62.963-62.961zm62.957 15.732 23.611 23.611-15.74 15.74-23.61-23.61zm-39.35-39.347 23.611 23.611-15.74 15.741-23.611-23.61zm23.613-23.612 62.962 62.963-15.74 15.74-62.963-62.962zM153.684 90.72 90.72 153.683l-15.74-15.741 62.962-62.963zm23.603 23.605-62.963 62.963-15.74-15.741 62.962-62.962zm23.625 23.622-62.962 62.962-15.74-15.74 62.962-62.962z'/%3E%3C/svg%3E\")}.icon-in-progress:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cdefs%3E%3CclipPath clipPathUnits='userSpaceOnUse' id='a'%3E%3Cpath style='fill:%23262425' d='M0 100h500v100H0z'/%3E%3C/clipPath%3E%3CclipPath clipPathUnits='userSpaceOnUse' id='b'%3E%3Cpath style='fill:%23262425' d='M0 300h500v100H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3Ccircle cy='353.553' r='250' style='fill:%23ebb531' transform='rotate(-45)'/%3E%3Ccircle cx='250' cy='250' r='250' style='fill:%23262425' clip-path='url(%23a)' transform='rotate(-45 250 250)'/%3E%3Ccircle cx='250' cy='250' r='250' style='fill:%23262425' clip-path='url(%23b)' transform='rotate(-45 250 250)'/%3E%3C/svg%3E\")}.icon-dimension:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg height='24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z'/%3E%3Cpath d='M0 0h24v24H0z' fill='none'/%3E%3C/svg%3E\");border-width:0}.icon-cen:before{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAA9AAAAPQAUrNa1AAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAAAT0lEQVQ4T2P4fW6uAzJ+Mav6CD6Mrn44GPDr3JzDyPjLvLr/KHguKkZXPxwN+NBX/h8F96JidPXDwQD0hPF9RfcxFLy0CwWjqx/yBsx1AAAIrOl/m8CdZwAAAABJRU5ErkJggg==\")}.icon-uncen:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 58 58'%3E%3Ccircle cx='29' cy='29' r='29' fill='%23fbce9d'/%3E%3Cpath d='M43.993 37.703c.004-.135.006-.271.007-.405.005-1.052-.495-2.022-1.239-2.765-1.245-1.243-1.678-3.17-1.298-4.89.194-.879-.007-1.794-.452-2.577-2.198-3.868-5.215-7.903-7.674-10.962a5.55 5.55 0 0 0-8.659-.003c-2.485 3.088-5.539 7.176-7.741 11.095-.437.777-.533 1.673-.387 2.552.279 1.681-.2 3.51-1.438 4.68a3.545 3.545 0 0 0-1.089 2.508l-.002.179c-.008 1.28.582 2.542 1.647 3.251 1.682 1.121 2.345 3.278 1.992 5.219a3.703 3.703 0 0 0 .784 3.025C20.8 51.443 24.219 54.267 29.01 57c5.142-2.933 8.708-5.97 11.071-9.012.639-.823.985-1.868.856-2.902-.208-1.666.319-3.439 1.581-4.552.835-.736 1.442-1.718 1.475-2.831z' fill='%23f98d85'/%3E%3Cpath d='M24.679 16.101c2.228-2.769 6.432-2.767 8.658.003 1.515 1.884 3.24 4.14 4.856 6.498C38.912 10.427 29.011 1 29.011 1s-9.896 9.422-9.183 21.593a106.439 106.439 0 0 1 4.851-6.492z' fill='%23ea6248'/%3E%3Cpath d='M31.853 14.812A4 4 0 1 0 25.011 12c0 1.095.442 2.086 1.155 2.808a5.564 5.564 0 0 1 5.687.004z' fill='%23c64646'/%3E%3Cpath d='M29.011 18s-20.75 19.75 0 39c20.75-19.25 0-39 0-39z' fill='%23ea6248'/%3E%3Cpath d='m31.171 48.395-.956 1.148a1.58 1.58 0 0 1-2.429 0l-.956-1.148A12.203 12.203 0 0 1 24 40.581V35.16A3.16 3.16 0 0 1 27.16 32h3.681a3.16 3.16 0 0 1 3.16 3.16v5.421a12.214 12.214 0 0 1-2.83 7.814z' fill='%23bf5a45'/%3E%3Cpath d='M29 40c-2.109 0-3.91 1.438-4.644 3.471a12.195 12.195 0 0 0 2.473 4.924l.956 1.148a1.58 1.58 0 0 0 2.429 0l.956-1.148a12.195 12.195 0 0 0 2.473-4.924C32.91 41.438 31.109 40 29 40z' fill='%23f98d85'/%3E%3C/svg%3E\")}.icon-ptcen:before{background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAA9AAAAPQAUrNa1AAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTnU1rJkAAABqElEQVQ4T5WTSy8DURTHx0fpxjeRImHBxmOBikeipSvxqBShlWqpjUbTJiRlw05YeWzEhpadxIaFdKFCVDLTubP4u+eYmc5UJbX4Tf5zXvfec89VALio3KebjXx20bjLHmun6yWCNNnIVxvv/GkS+WzQKGRVCcR1Cm9TXQxpspGPYijWyrOTjULmxAxiPpN+PHR7GdJOH8VaRbgAVfV4PPgP5k4UPnO9gEagXIWaU8/ZCLK5YYU77DqfbOB+AlpkHq/DbQxpkUu4YhiZq0hRdBkvUtATq/iY6serr5UhTTZxbt+GRfFXAXGUhEqry8SXoR9Iq5E56dtyJhOyQM0R9O01fIUCeBr04rKvhSH9NT8BPR1zJptHoKmzDDcZ6FsRlGfH8ThQLUC6PDMGfTPCMY4C4Z/RNaePEIdJuZofz752lJamGdK0A3GwUU2WOXyN1iDZjqsdaNEFlEY6oMaWGdJaNARxVm2iPUj0kbhGWezG8T7Zi2JwgHkP9EDsxWHcWtuvGWWriLkTVfYFldwaSqOdDGmz+J+PyYZ7Yj5nNbdSJvim6j5nKN+A2Me46jRxowAAAABJRU5ErkJggg==\")}"

  const TOPIC_PATH = '/forum/viewtopic.php'

  const TITLE_REGEX = /(?:\[([^[\]]+)]+)?([^[]*)?/g
  const TAGS_SEPARATOR_REGEX = /,\s?|;|•|\/|\+/
  const TAGS_GROUP_SEPARATOR = ' | '

  const DIMENSIONS = [
    '240p',
    '360p',
    '480p',
    '540p',
    '544p',
    '576p',
    '640p',
    '720p',
    '1080p',
    '1080i',
    '1440p',
    '2160p',
  ]
  const DIMENSION_ICON_NAME = 'dimension'

  const TAG_ICON_MAP = {
    eng: 'en',
    jap: 'ja',
    rus: 'ru',
    ru: 'ru',
    chi: 'zh',
    cn: 'zh',
    spa: 'es',
    es: 'es',
    por: 'pt',
    ger: 'de',
    de: 'de',
    fr: 'fr',
    korean: 'ko',
    cen: 'cen',
    uncen: 'uncen',
    ptcen: 'ptcen',
    inprogress: 'in-progress',
  }

  for (const dimensions of DIMENSIONS) {
    TAG_ICON_MAP[dimensions] = DIMENSION_ICON_NAME
  }

  async function initTags() {
    await $.ready()

    if (location.pathname === TOPIC_PATH) {
      createPostTags()
    }
  }

  function createPostTags() {
    const titleElement = $('.maintitle')
    const titleLink = titleElement.children[0]
    const title = titleLink.textContent

    const titleParts = tokenizeTitle(title)
    const hasTagBefore = titleParts.tagGroupsBefore.length > 0
    const hasTagsAfter = titleParts.tagGroupsAfter.length > 0

    if (!hasTagBefore && !hasTagsAfter) {
      return
    }

    addStyle(css_248z)

    $.set(titleLink, {
      textContent: titleParts.title,
      title,
    })

    if (hasTagBefore) {
      $.before(createTagsRow(titleParts.tagGroupsBefore), titleElement)
    }

    if (hasTagsAfter) {
      $.after(createTagsRow(titleParts.tagGroupsAfter), titleElement)
    }
  }

  function tokenizeTitle(titleRaw) {
    const tagGroupsBefore = []
    const titleParts = []

    const tagGroupsAfter = []

    for (const groups of regExp.getMatchGroups(TITLE_REGEX, titleRaw)) {
      let tags = []

      if (groups[0]) {
        tags = groups[0].split(TAGS_SEPARATOR_REGEX)
      }

      if (tags.length > 0) {
        ;(titleParts.length > 0 ? tagGroupsAfter : tagGroupsBefore).push(tags)
      }

      if (groups[1]) {
        titleParts.push(groups[1])
      }
    }

    return {
      tagGroupsBefore,
      title: titleParts.join('').trim(),
      tagGroupsAfter,
    }
  }

  function createTagsRow(tagGroups) {
    const tags = tagGroups.reduce((result, tagsGroup, index) => {
      result.push(...createTagLinks(tagsGroup))

      if (index + 1 !== tagGroups.length) {
        result.push(TAGS_GROUP_SEPARATOR)
      }

      return result
    }, [])

    return $.create('div', {
      className: 'tags-row',
      contents: tags,
    })
  }

  function createTagLinks(tags) {
    return tags
      .filter((tag) => tag.length)
      .map((tag) => {
        let className = 'tags-row-tag'

        tag = tag.trim()

        const tagkey = tag.toLowerCase()

        if (Object.hasOwn(TAG_ICON_MAP, tagkey)) {
          className = `${className} tag-with-icon icon-${TAG_ICON_MAP[tagkey]}`
        }

        return $.create('a', {
          className,
          textContent: tag,
          href: `/forum/tracker.php?nm=${tag}`,
          target: '_blank',
        })
      })
  }

  initConfig().then(async (config) => {
    if (config.tags) {
      await initTags()
    }

    if (config.pager) {
      addStyle(css_248z$1)
    }

    if (config.download) {
      await initDownload()
    }

    if (config.similar) {
      await initFindSimilar()
    }
  })
})()
