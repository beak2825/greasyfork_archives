// ==UserScript==
// @name         拦截请求
// @version      1.3
// @namespace    wy.guahao.com
// @description  拦截请求并修改resp,修改规则在ajaxInterceptor_rules里
// @author       aoqh
// @match        *://guards.gops.guahao.cn/*
// @match        *://guards.guahao-test.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/418755/%E6%8B%A6%E6%88%AA%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/418755/%E6%8B%A6%E6%88%AA%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==

// 命名空间
let ajax_interceptor_qoweifjqon = {
  settings: {
    ajaxInterceptor_rules: [
        {filterType:'normal',match:'api/application/pageQuery?appName=',fn:(resp)=>{return resp.replace(/supportType\":\w*,/g,"supportType\":0,");}}
    ],
  },
  originalXHR: window.XMLHttpRequest,
  myXHR: function() {
    const modifyResponse = () => {
      ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.forEach(({filterType = 'normal', switchOn = true, match, fn = null}) => {
        let matched = false;
        if (switchOn && match) {
          if (filterType === 'normal' && this.responseURL.indexOf(match) > -1) {
            matched = true;
          } else if (filterType === 'regex' && this.responseURL.match(new RegExp(match, 'i'))) {
            matched = true;
          }
        }
        if (matched) {
          this.responseText = fn(this.responseText);
          this.response = fn(this.responseText);
        }
      })
    }

    const xhr = new ajax_interceptor_qoweifjqon.originalXHR;
    for (let attr in xhr) {
      if (attr === 'onreadystatechange') {
        xhr.onreadystatechange = (...args) => {
          if (this.readyState == 4) {
              // 开启拦截
              modifyResponse();
          }
          this.onreadystatechange && this.onreadystatechange.apply(this, args);
        }
        continue;
      } else if (attr === 'onload') {
        xhr.onload = (...args) => {
            // 开启拦截
            modifyResponse();
          this.onload && this.onload.apply(this, args);
        }
        continue;
      }

      if (typeof xhr[attr] === 'function') {
        this[attr] = xhr[attr].bind(xhr);
      } else {
        // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
        if (attr === 'responseText' || attr === 'response') {
          Object.defineProperty(this, attr, {
            get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
            set: (val) => this[`_${attr}`] = val,
            enumerable: true
          });
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: (val) => xhr[attr] = val,
            enumerable: true
          });
        }
      }
    }
  },

  originalFetch: window.fetch.bind(window),
  myFetch: function(...args) {
    return ajax_interceptor_qoweifjqon.originalFetch(...args).then((response) => {
      let txt = undefined;
      ajax_interceptor_qoweifjqon.settings.ajaxInterceptor_rules.forEach(({filterType = 'normal', switchOn = true, match, overrideTxt = ''}) => {
        let matched = false;
        if (switchOn && match) {
          if (filterType === 'normal' && response.url.indexOf(match) > -1) {
            matched = true;
          } else if (filterType === 'regex' && response.url.match(new RegExp(match, 'i'))) {
            matched = true;
          }
        }

        if (matched) {
          txt = overrideTxt;
        }
      });

      if (txt !== undefined) {
        const stream = new ReadableStream({
          start(controller) {
            const bufView = new Uint8Array(new ArrayBuffer(txt.length));
            for (var i = 0; i < txt.length; i++) {
              bufView[i] = txt.charCodeAt(i);
            }

            controller.enqueue(bufView);
            controller.close();
          }
        });

        const newResponse = new Response(stream, {
          headers: response.headers,
          status: response.status,
          statusText: response.statusText,
        });
        const proxy = new Proxy(newResponse, {
          get: function(target, name){
            switch(name) {
              case 'ok':
              case 'redirected':
              case 'type':
              case 'url':
              case 'useFinalURL':
              case 'body':
              case 'bodyUsed':
                return response[name];
            }
            return target[name];
          }
        });

        for (let key in proxy) {
          if (typeof proxy[key] === 'function') {
            proxy[key] = proxy[key].bind(newResponse);
          }
        }
        return proxy;
      } else {
        return response;
      }
    });
  },
}

window.XMLHttpRequest = ajax_interceptor_qoweifjqon.myXHR;
window.fetch = ajax_interceptor_qoweifjqon.myFetch;





