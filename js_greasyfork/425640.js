// ==UserScript==
// @name        OFans.party IPFS Gateway Switcher
// @namespace   Violentmonkey Scripts
// @description IPFS gateway switcher for ofans.party.
// @match       https://ofans.party/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       unsafeWindow
// @run-at      document-start
// @version     0.9
// @author      sudorain
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/425640/OFansparty%20IPFS%20Gateway%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/425640/OFansparty%20IPFS%20Gateway%20Switcher.meta.js
// ==/UserScript==

// A (somewhat working) polyfill for beforescriptexecute event
// https://github.com/jspenguin2017/Snippets/blob/master/onbeforescriptexecute.html
(() => {
  'use strict';

  if (navigator.userAgent.indexOf("Chrome") !== -1) {
    const Event = class {
      constructor(script, target) {
        this.script = script;
        this.target = target;

        this._cancel = false;
        this._replace = null;
        this._stop = false;
      }

      preventDefault() {
        this._cancel = true;
      }
      stopPropagation() {
        this._stop = true;
      }
      replacePayload(payload) {
        this._replace = payload;
      }
    };

    let callbacks = [];
    window.addBeforeScriptExecuteListener = (f) => {
      if (typeof f !== 'function') {
        throw new Error('Event handler must be a function.');
      }
      callbacks.push(f);
    };
    window.removeBeforeScriptExecuteListener = (f) => {
      let i = callbacks.length;
      while (i--) {
        if (callbacks[i] === f) {
          callbacks.splice(i, 1);
        }
      }
    };

    const dispatch = (script, target) => {
      if (script.tagName !== 'SCRIPT') {
        return;
      }

      const e = new Event(script, target);

      if (typeof window.onbeforescriptexecute === 'function') {
        try {
          window.onbeforescriptexecute(e);
        } catch (err) {
          console.error(err);
        }
      }

      for (const func of callbacks) {
        if (e._stop) {
          break;
        }
        try {
          func(e);
        } catch (err) {
          console.error(err);
        }
      }

      if (e._cancel) {
        script.textContent = '';
        script.remove();
      } else if (typeof e._replace === 'string') {
        script.textContent = e._replace;
      }
    };
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          dispatch(n, m.target);
        }
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true,
    });
  }

})();

(async () => {
  'use strict';

  var loaded, regex_main_js, regex_ipfs, ipfs_replace, gateways_json, public_gateways, current_gateway, gallery_mode, posts_find, posts_replace;

  // A site displaying public IPFS gateways and their online/offline status.
  // https://ipfs.github.io/public-gateway-checker/
  gateways_json = 'https://ipfs.github.io/public-gateway-checker/gateways.json';

  public_gateways = await GM_getValue('public_gateways');
  current_gateway = await GM_getValue('current_gateway');
  gallery_mode = await GM_getValue('gallery_mode') || false;

  loaded = false;
  regex_main_js = new RegExp(/main\.[a-z0-9]+\.chunk\.js/);
  regex_ipfs = new RegExp(/ipfsHost:"(.*?)"/g);
  ipfs_replace = `ipfsHost:"${current_gateway}"`

  posts_find = `Object(a.jsxs)("div",{className:"container",children:[o,this.state.posts&&this.state.posts.map((function(t,s){return r++,Object(a.jsxs)("div",{className:"row post",of_id:t.post_id,children:[r%15==0&&e.renderAd(),Object(a.jsxs)("div",{className:"col-lg-6 postText",children:[e.renderPostDate(t),Object(a.jsx)("br",{}),e.renderPostText(t)]}),Object(a.jsx)("div",{className:"col-lg-6",style:{textAlign:"center"},children:t.media&&t.media.map((function(t,s){return t.ipfs_media_hash?Object(a.jsx)("a",{href:e.state.ipfsHost+t.ipfs_media_hash,children:Object(a.jsx)("img",{src:e.state.ipfsHost+t.ipfs_thumb_hash,loading:"lazy",className:"mediaThumb"})},t.id.toString()):Object(a.jsx)("div",{style:{backgroundColor:"grey",height:"144px",width:"144px",margin:"0.5em",position:"relative"},title:"Importing...",children:Object(a.jsxs)("span",{style:{color:"white",fontSize:"2em",fontWeight:"bold",position:"absolute",top:"50%",left:"50%",margin:"-25px 0 0 -25px",height:"50px",width:"50px"},children:[" ",Object(a.jsx)(c.a,{icon:["fa","download"]})," "]})})}))})]},t.id.toString())}))]})`
  posts_replace = `Object(a.jsxs)("div",{className:"container",children:[o,Object(a.jsxs)("div",{className:"row row-cols-5 align-items-stretch no-gutters",children:[this.state.posts&&this.state.posts.map((function(t,s){return r++,t.media&&t.media.map((function(t,s){return t.ipfs_media_hash?Object(a.jsx)("div",{className:"col d-flex",children:Object(a.jsx)("div",{className:"d-flex justify-content-center align-items-center w-100 m-1 bg-light",style:{"min-height": "150px"},children:[Object(a.jsx)("span",{className:"position-absolute text-white fa fa-3x fa-fw fa-"+(t.type=="video"?"play-circle":t.type+" d-none"),style:{"text-shadow": "0 0 24px rgb(0 0 0 / 50%)"}}),Object(a.jsx)("a",{href:e.state.ipfsHost+t.ipfs_media_hash,target:"_blank",children:Object(a.jsx)("img",{src:e.state.ipfsHost+t.ipfs_thumb_hash,loading:"lazy",className:"img-fluid"})},t.id.toString())]})}):Object(a.jsx)("div",{className:"col d-flex",children:Object(a.jsx)("div",{className:"d-flex justify-content-center align-items-center w-100 m-1 bg-secondary",style:{"min-height": "150px"},title:"Importing...",children:Object(a.jsx)("span",{className:"text-white fa fa-3x fa-fw fa-download",style:{"text-shadow": "0 0 24px rgb(0 0 0 / 50%)"}})})})}))}))]})]})`

  await GM_xmlhttpRequest({
    method: 'GET',
    url: gateways_json,
    onload: function (response) {
      public_gateways = response.responseText.replace(/:hash/g, '');
      GM_setValue('public_gateways', public_gateways)
    }
  });

  if (navigator.userAgent.indexOf("Chrome") !== -1) {
    window.onbeforescriptexecute = (e) => {
      const script = e.script.outerHTML;
      if (regex_main_js.test(script) && !loaded && (current_gateway || gallery_mode)) {
        const source = e.script.attributes.src.value;
        e.preventDefault()
        e.stopPropagation()
        modifyScript(source)
      }
    }
  } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
    window.addEventListener('beforescriptexecute', function (e) {
      const source = e.target.src;
      if (regex_main_js.test(source) && !loaded && (current_gateway || gallery_mode)) {
        e.preventDefault()
        e.stopPropagation()
        modifyScript(source)
      }
    })
  }

  document.addEventListener('DOMContentLoaded', function () {

    let css = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: #dee2e6; 
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #888; 
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #555; 
      }
    `;

    let style = createElement('style', {}, css);
    document.head.append(style);

    let gateways = JSON.parse(public_gateways)
    gateways.sort(function (gateway) {
      if (gateway === current_gateway) return -1;
    });

    let party = createElement('div',
      { class: 'position-fixed fixed-bottom float-left text-monospace mb-3 ml-3', style: 'width: fit-content;width: -moz-fit-content;' },
      createElement('div',
        { id: 'switch', class: 'btn-group dropup' },
        createElement('button',
          { class: 'btn btn-dark dropdown-toggle', 'data-toggle': 'dropdown', 'aria-haspopup': 'true', 'aria-expanded': 'false', reference: 'parent' },
          'Gateways',
          createElement('span',
            { class: 'badge badge-light ml-2' },
            gateways.length
          )
        ),
        createElement('div',
          { class: 'dropdown-menu overflow-auto custom-scrollbar shadow-lg px-0 pt-0 pb-2 mb-3', style: 'max-height: 388px' },
          createElement('h6',
            { class: 'bg-light text-dark shadow-sm sticky-top dropdown-header border-bottom py-3 mb-2' },
            'Gateway Switcher',
            createElement('a',
              { class: 'float-right text-success', href: 'https://ipfs.github.io/public-gateway-checker/', target: '_blank' },
              'Public Gateway Checker'
            )
          ),
          createElement('button',
            { 'data-value': '', class: `dropdown-item border-bottom button-switch ${!current_gateway ? ' active' : ' text-dark'}`, type: 'button' },
            'Default'
          ),
          ...gateways.map((gateway, index) => {
            let current = current_gateway == gateway;
            let url = gateway.match(/(?<protocol>.*?:\/\/)(?<origin>.*)/);
            return createElement('button',
              { 'data-value': gateway, class: `dropdown-item border-bottom button-switch ${current ? ' active' : ' text-dark'}`, type: 'button' },
              createElement('small',
                { class: `${current ? ' ' : ' text-black-50'}` },
                url.groups.protocol
              ),
              url.groups.origin
            )
          })
        )
      ),
      createElement('button',
        { class: `btn button-gallery ml-2 ${gallery_mode ? ' btn-info' : ' btn-dark'}` },
        'Gallery Mode',
        createElement('span',
          { class: 'badge badge-light ml-2' },
          `${gallery_mode ? 'On' : 'Off'}`
        )
      )
    );

    document.body.append(party)

  });

  document.addEventListener('click', switchGateway);

  function switchGateway(e) {
    const class_list = e.target.classList;
    const data_set = e.target.dataset;
    if (class_list.contains('button-switch')) {
      const value = data_set.value;
      if (value) {
        GM_setValue('current_gateway', value)
      } else {
        GM_deleteValue('current_gateway')
      }
      location.reload()
    } else if (class_list.contains('button-gallery')) {
      GM_setValue('gallery_mode', !gallery_mode)
      location.reload()
    }
  }

  function modifyScript(source) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: source,
      onload: async function (response) {
        loaded = !loaded

        var text = response.responseText
        text = text.replace(regex_ipfs, ipfs_replace)
        if (current_gateway) {
          text = text.replace(regex_ipfs, ipfs_replace)
        }
        if (gallery_mode) {
          text = text.replace(posts_find, posts_replace);
        }
        let newScript = createElement('script', { type: 'text/javascript', id: 'main' }, text);
        document.head.append(newScript);
      }
    })
  }

  function createElement(type, attributes, ...children) {
    let element = document.createElement(type)

    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]))

    children.forEach(child => {
      if (typeof child === 'string' || typeof child === 'number') {
        element.appendChild(document.createTextNode(child))
      } else {
        element.appendChild(child)
      }
    })

    return element
  }

})();
