// ==UserScript==
// @name         cammedia tip call webhook
// @namespace    https://www2.cammedia.com/1/chat/profile/copernicus
// @version      0.10.0
// @description  sends an event to a webhook every time you receive a tip
// @author       Copernicus
// @match        https://www2.cammedia.com/*/chat.html*
// @connect      xtoys.app
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434654/cammedia%20tip%20call%20webhook.user.js
// @updateURL https://update.greasyfork.org/scripts/434654/cammedia%20tip%20call%20webhook.meta.js
// ==/UserScript==

/* globals GM_config SimpleToast */
/* eslint no-eval: 0 */

// inclusion for SimpleToast library
let SimpleToast;


let webhookEndpoint;
let username;
function loadSettings(){
    webhookEndpoint = new URL(GM_config.get('webhookEndpoint'))
    username = GM_config.get('username') || undefined
}

GM_config.init(
    {
        'id': 'cammediaWebhook', // The id used for this instance of GM_config
        'fields': // Fields object
        {
            'username': // This is the id of the field
            {
                'label': 'Override Cammedia Username', // Appears next to field
                'section': 'tip filters',
                'type': 'text', // Makes this setting a text field
                'default': undefined // Default value if user doesn't change it
            },
            'webhookEndpoint': // This is the id of the field
            {
                'label': 'Webhook Endpoint',
                'section': 'Webhook Configuration',
                'type': 'text',
                'default': "https://xtoys.app/webhook?ID=<your webhook id here>"
            }
        },
        'events':
        {
            'init': loadSettings,
            'save': loadSettings,
        }
    });


// libarary functions
function waitFor(checkFn, checkFrequencyMs, timeoutMs) {
    const startTimeMs = Date.now();
    return new Promise((res, rej) => {
        const f = () => {
            const v = checkFn()
            if (v !== undefined && v !== false) {
                return res(v);
            }
            if (timeoutMs && Date.now() - startTimeMs > timeoutMs) {
                return rej(new Error("Timeout exceeded"))
            }
            setTimeout(f, checkFrequencyMs)
        }
        setTimeout(f, 0)
    })
}

function webhookSend(params) {
    return new Promise((res, rej) => {
        let newWebhook = new URL(webhookEndpoint)
        let query = Object.entries(params).forEach(kv => {
            newWebhook.searchParams.has(kv[0]) ? null :
                newWebhook.searchParams.set(kv[0], kv[1])
        })
        console.log("sending request to: " + newWebhook.toString())
        GM_xmlhttpRequest({
            method: "GET",
            url: newWebhook.toString(),
            onload: res,
            onabort: rej,
            ontimeout: rej,
        });
    })
}


const giftTypes = [
    {type: "tokens", regex: /^Gift$/},
    {type: "menu", regex: /^ttt(?<text>[^:]+)$/ },
    {type: "flirt", regex: /^xxx(?<image>[^:]+)(?::(?<text>.*))?$/ },
    {type: "wheel", regex: /^www(?<text>[^:]+)$/ },
    {type: "king-bid", regex: /^kkk$/ },
    {type: "question", regex: /^aaa/ },
    {type: "gift", regex: /^(?<image>[^:]+)(?::(?<text>.*))?$/ }
]



function parseGift(event) {
    let out = undefined
    let parsed = giftTypes.some((t)=>{
        let m = event.gift.match(t.regex)
        if(m){
            out = {
                ...m.groups,
                type: t.type
            }
            return true
        }
    })
    if(!parsed){
        console.log("Unable to parse gift", event)
        throw new Error("Unable to parse gift text")
    }
    out = Object.fromEntries(Object.entries(out).map(kv=>kv[1] !== undefined ? kv : [kv[0], ""]))
    if(out.type === "question" || out.type === "gift") {
        console.log("I'm not comfortable parsing this:", event)
    }
    return out
}

(async function () {
    'use strict';
    await waitFor(() => SimpleToast, 100, 2000)
    // show options
    SimpleToast({
    text: "You should configure your webhook",
    buttons: [{
        text: 'Configure',
        onclick: (evt) => {
            evt.stopPropagation();
            GM_config.open()
        }
    },{
        text: '(X)',
        onclick: (evt) => {
        }
    }],
    timeout: null
    });

    // grab window.Socket._IO from the content
    let _IO = await waitFor(() => window.eval('window.Socket && window.Socket._IO && window.Socket._IO.on && window.Socket._IO;'), 100, 120000)
    username = username || await waitFor(() => window.eval('window.G.USER.username;'), 100, 120000)

    console.log("Starting webhook for " + username)

    _IO.on("updateTicker", (ev) => {
        if ((ev.userB === username || username === "*") && ev.action === "tip") {
            setTimeout(async () => {
                console.log("someone tipped me:", ev)
                let res = await webhookSend({
                    ...parseGift(ev),
                    sender: ev.userA,
                    receiver: ev.userB,
                    action: ev.action,
                    value: ev.value,
                })
                console.log("received webhook result", res)
            }, 0)

        }
    })
    console.log("tip webhook set")
})();


// Include simple toasts library (modify to work inside an iframe)
// originally from: https://raw.githubusercontent.com/feildmaster/SimpleToast/stable/simpletoast.js
SimpleToast = (() => {
  const version = buildVersion(2, 0, 0);
  const style = {
    root: {
      display: 'flex',
      'flex-direction': 'column-reverse',
      'align-items': 'flex-end',
      position: 'fixed',
      'white-space': 'pre-wrap',
      bottom: 0,
      right: 0,
      zIndex: 1000,
    },
    title: {
      display: 'block',
      fontSize: '15px',
      'font-style': 'italic',
    },
    toast: {
      maxWidth: '320px',
      padding: '5px 8px',
      borderRadius: '3px',
      fontFamily: 'cursive, sans-serif',
      fontSize: '13px',
      cursor: 'pointer',
      color: '#fafeff',
      margin: '4px',
      textShadow: '#3498db 1px 2px 1px',
      background: '#2980b9',
    },
    footer: {
      display: 'block',
      fontSize: '10px',
    },
    button: {
      height: '20px',
      margin: '-3px 0 0 3px',
      padding: '0 5px',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
      border: '1px solid rgba(27,31,35,0.2)',
      borderRadius: '10px',
      fontSize: '11px',
      textShadow: '#173646 0px 0px 3px',
      background: '#2c9fea',
      mouseOver: {
        'border-color': 'rgba(27,31,35,0.35)',
        background: '#149FFF',
      },
    },
  };

  function applyCSS(element, css = {}) {
    const old = {};
    Object.keys(css).forEach((key) => {
      const val = css[key];
      if (typeof val === 'object') return;
      old[key] = element.style[key];
      element.style[key] = css[key];
    });
    return old;
  }

  const toasts = new Map();
  let root = (() => {
    function create() {
      const el = document.createElement('div');
      el.setAttribute('id', 'AlertToast');
      applyCSS(el, style.root);

      const body = document.getElementsByTagName('body')[0];
      if (body) { // Depending on when the script is loaded... this might be null
        body.appendChild(el);
      } else {
        window.addEventListener('load', () => {
          const exists = document.getElementById(el.id);
          if (exists) { // Another script may have created it already
            if (el.hasChildNodes()) { // Transfer existing nodes to new root
              const nodes = el.childNodes;
              for (let i = 0, l = nodes.length; i < l; i++) {
                exists.appendChild(nodes[i]);
              }
            }
            root = exists; // Set this incase anyone still has a reference to this toast
            return;
          }
          document.getElementsByTagName('body')[0].appendChild(el);
        });
      }
      return el;
    }
    return document.getElementById('AlertToast') || create();
  })();
  let count = 0;

  let timeout = null;
  function startTimeout() {
    if (timeout) return;
    timeout = setTimeout(() => {
      timeout = null;
      const now = Date.now();
      let pending = 0;
      toasts.forEach((toast) => {
        if (!toast.timeout) return;
        if (now < toast.timeout) {
          pending += 1;
          return;
        }
        toast.close('timeout');
      });
      if (pending) {
        startTimeout();
      }
    }, 1000);
  }

  function noop() {}
  const blankToast = Object.freeze({
    setText: noop,
    exists: () => false,
    close: noop,
  });
  function Toast({title, text, footer, className, css = {}, buttons, timeout, onClose} = {}) {
    if (typeof arguments[0] === 'string') {
      text = arguments[0];
    }
    if (!text) return blankToast;
    const id = count++;
    const el = document.createElement('div');
    const tel = el.appendChild(document.createElement('span'));
    const body = el.appendChild(document.createElement('span'));
    const fel = el.appendChild(document.createElement('span'));
    if (className) {
      const clazz = className.toast || className;
      el.className = Array.isArray(clazz) ? clazz.join(' ') : (typeof clazz === 'string' ? clazz : undefined);
    }
    applyCSS(el, style.toast);
    applyCSS(el, css.toast || css);

    // Add title, body
    if (title) {
      applyCSS(tel, style.title);
      applyCSS(tel, css.title);
      tel.innerHTML = title;
    }
    body.innerHTML = text;
    if (footer) {
      applyCSS(fel, style.footer);
      applyCSS(fel, css.footer);
      fel.innerHTML = footer;
    }

    const safeToast = {};
    const toast = {
      setText: (newText) => {
        if (!newText || !toast.exists()) return;
        body.innerHTML = newText;
      },
      exists: () => toasts.has(id),
      close: (closeType) => {
        if (!toast.exists()) return;
        root.removeChild(el);
        toasts.delete(id);
        if (typeof onClose === 'function') {
          onClose.call(safeToast, closeType || 'unknown', safeToast);
        }
      },
    };
    if (timeout) {
      toast.timeout = Date.now() + timeout;
    }

    if (typeof buttons === 'object') {
      if (!Array.isArray(buttons)) {
        buttons = [buttons];
      }
      buttons.forEach((button) => {
        if (!button.text) return;
        const elb = document.createElement('button');
        if (button.className || className && className.button) {
          const clazz = button.className || className.button;
          elb.className = Array.isArray(clazz) ? clazz.join(' ') : clazz;
        }
        elb.innerHTML = button.text;
        applyCSS(elb, style.button);
        applyCSS(elb, css.button);
        applyCSS(elb, button.css);
        if (typeof button.onclick === 'function') {
          elb.onclick = button.onclick;
        }
        let prev = {};
        elb.onmouseover = () => {
          const hoverStyle = Object.assign(
            {},
            style.button.mouseOver,
            css.button && css.button.mouseOver,
            button.css && button.css.mouseOver
          );
          prev = applyCSS(hoverStyle);
        };
        elb.onmouseout = () => {
          applyCSS(elb, prev);
          prev = {};
        };
        el.insertBefore(elb, fel);
      });
    }
    el.addEventListener('click', toast.close.bind(null, 'dismissed'));

    root.appendChild(el);
    toasts.set(id, toast);
    if (timeout) {
      startTimeout();
    }
    Object.keys(blankToast).forEach((key) => {safeToast[key] = toast[key]});
    return safeToast;
  }

  Toast.version = version.number;
  Toast.versionString = version.string;
  Toast.count = () => toasts.size;
  function buildVersion(major, minor = 0, patch = 0) {
    return {
      string: `${major}.${minor}${patch ? `.${patch}` : ''}`,
      number: major * 1000000000 + minor * 1000 + patch,
    };
  }
  return Object.freeze(Toast);
})();
