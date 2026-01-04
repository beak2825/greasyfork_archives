// ==UserScript==
// @name         cammedia check wheel requests
// @namespace    https://www2.cammedia.com/1/chat/profile/copernicus
// @version      0.1.0
// @description  notifies user if dare text doesn't matcha user's dare wheel
// @author       Copernicus
// @license      MIT
// @match        https://www2.cammedia.com/*/chat.html*
// @match        https://www2.cammedia.com/*/abuse.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435984/cammedia%20check%20wheel%20requests.user.js
// @updateURL https://update.greasyfork.org/scripts/435984/cammedia%20check%20wheel%20requests.meta.js
// ==/UserScript==

/* globals GM_config SimpleToast */
/* eslint no-eval: 0 */

// inclusion for SimpleToast library
let SimpleToast;


let username;


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

window.dareCache = {}

window.fetchDareWheel = async function(username){
    const fd = new FormData()
    fd.append('u', username)
    const d = new Date()
    const res = await fetch("/_ajax/wheel.php", {method: 'POST', body: fd})
    const txt = await res.text()
    const items = txt.split("|").slice(1).reduce((ret,cur)=>({...ret,[cur]: d}),{})
    window.dareCache[username] = {...window.dareCache[username], ...items}
    return items
};

window.checkDareWheel = function(username, dare) {
    // items = items || window.dareCache[username]
    const list = window.dareCache[username]
    return list[dare] && (new Date() - list[dare] < 300000)
};

// params used: Nickname, Room, Topic, Message
function openReport(params){
    const url = new URL("https://www2.cammedia.com/1/chat/members/abuse.html")
    Object.entries(params).forEach(([k,v])=>url.searchParams.set(k,v))
    window.open(url.toString(),"_blank")
}


function warnUser(tipEvt) {
    const msg =
`\
!!detected possible hacking!!

${tipEvt.userB} received this dare request:
${tipEvt.userA} sent a dare: ${tipEvt.text} for ${tipEvt.value} Tokens to ${tipEvt.userB}

I observed these dares on ${tipEvt.userB}'s wheel:
${Object.entries(window.dareCache[tipEvt.userB]).map(([k])=>"- " + k).join("\n")}
`
    console.error(msg)
    const clearCSS = {
        padding: "",
        fontFamily: "",
        margin: "",
        textShadow: "",
        fontSize: "",
        background: "",
        color: "",
        borderRadius: "",
        border: "",
        verticalAlign: "center",
        height: "",
        whiteSpace: "normal",
        maxWidth: "",
        cursor: "auto"
    }

SimpleToast({
    css: { ...clearCSS,
        width: "auto",
        top: 0,
        right: 0,
        zIndex: "auto",
        position: 'relative',
        display: "block",
        margin: "5px 0 0 0",
        padding: "5px 2px",
        button: {mouseOver:{}},},
    className: " c_modal_body c_modal nameplay-bar",
    text: `\
<p style="display:inline;" class="alert-error">
Suspicious dare from <strong>${escapeForHTML(tipEvt.userA)}</strong>
</p>
`,
    buttons: [{
        text: 'Report User',
        className: "button-red btn_regular",
        css: { ...clearCSS,
            paddingLeft: "10px",
            paddingRight: "10px",
            display: "inline" },
        onclick: (evt) => {
            evt.stopPropagation();
            openReport({
                Nickname: tipEvt.userA,
                Room: window.G.USER.room,
                Topic: "Hacking",
                Message: msg,

            })},
    }, {
        text: 'dismiss',
        className: "button btn_regular",
        css: { ...clearCSS,
            paddingLeft: "10px",
            paddingRight: "10px",
            display: "inline" },
        onclick: (evt) => {
        },
    }],
    timeout: 30000,
    onClick: ()=>{},
});
}

(async function () {
    'use strict';
    const re = /^https:\/\/www2.cammedia.com\/[^/]*\/chat.html.*/
    if(!re.test(window.location.toString())) return;

    // grab window.Socket._IO from the content
    let _IO = await waitFor(() => window.Socket && window.Socket._IO && window.Socket._IO.on && window.Socket._IO, 100, 120000)

    //grab user's username
    username = username || await waitFor(() => window.G.USER.username, 100, 120000)
    console.log("Watching dare wheel requests for username: " + username)

    await window.fetchDareWheel(username)
    setInterval(window.fetchDareWheel, 60000, username)



    _IO.on("updateTicker", (ev) => {
        if ((ev.userB === username) && ev.action === "tip") {
            setTimeout(async () => {
                let g = { ...parseGift(ev), ...ev }
                if(g.type == "wheel"){
                    let items = await window.fetchDareWheel(ev.userB)
                    if(window.checkDareWheel(g.userB, g.text)){
                        console.log("Found dare in wheel!", g, items.keys)
                    } else {
                        console.error("darewheel fraud found!", g, items.keys)
                        warnUser(g)
                    }
                }
            }, 0)

        }
    })

    console.log("tip webhook set")
})();

function getElementByName(name) {
    const els = document.getElementsByName(name)
    if(els.length == 1){
        return els[0]
    } else if(els.length == 0){
        return undefined
    } else {
        throw new Error(`More than one element with name="${name}"`)
    }
}

(async function () {
    'use strict';
    // https://www2.cammedia.com/1/chat/members/abuse.html?Nickname=dreamerfan&Room=Over%2040
    const re = /^https:\/\/www2.cammedia.com\/1\/[^/]*\/members\/abuse.html.*/
    if(!re.test(window.location.toString())) return;
    const url = new URL(window.location.toString())
    for( let [n,v] of url.searchParams.entries()) {
        let el = await waitFor(() => getElementByName(n), 100, 120000)
        el.value = v
    }
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

/** Used to map characters to HTML entities. */
const htmlEscapes = {
  '&': '&amp',
  '<': '&lt',
  '>': '&gt',
  '"': '&quot',
  "'": '&#39'
}

/** Used to match HTML entities and HTML characters. */
const reUnescapedHtml = /[&<>"']/g
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source)

/**
 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
 * corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @since 0.1.0
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @see escapeRegExp, unescape
 * @example
 *
 * escape('fred, barney, & pebbles')
 * // => 'fred, barney, &amp pebbles'
 */
function escapeForHTML(string) {
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, (chr) => htmlEscapes[chr])
    : string
}

