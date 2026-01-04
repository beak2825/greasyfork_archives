// ==UserScript==
// @name         记录页面滚动
// @version      4
// @description  记录页面滚动容器和位置，下次页面加载完成时恢复，脚本菜单可以控制网站禁用与启用
// @author       Lemon399
// @match        *://*/*
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/499828/%E8%AE%B0%E5%BD%95%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499828/%E8%AE%B0%E5%BD%95%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==
(function(){
const id = decodeURIComponent('3753');

function runOnce(fn, key) {
  const uniqId = 'BEXT_UNIQ_ID_' + id + (key ? key : '');
  if (window[uniqId]) {
    return;
  }
  window[uniqId] = true;
  fn && fn();
}

function runNeed(
  condition,
  fn,
  option = {
    count: 20,
    delay: 200,
    failFn: () => null,
  },
  ...args
) {
  if (typeof condition != 'function' || typeof fn != 'function') return;
  if (
    !option ||
    typeof option.count != 'number' ||
    typeof option.delay != 'number' ||
    typeof option.failFn != 'function'
  ) {
    option = {
      count: 20,
      delay: 200,
      failFn: () => null,
    };
  }
  let sleep = () => {
      return new Promise((resolve) => setTimeout(resolve, option.delay));
    },
    ok = false;
  new Promise(async (resolve, reject) => {
    for (let c = 0; !ok && c < option.count; c++) {
      await sleep();
      ok = condition.call(this, c + 1);
    }
    if (ok) {
      resolve();
    } else {
      reject();
    }
  }).then(fn.bind(this, ...args), option.failFn);
}

function runAt(start, fn, ...args) {
  if (typeof fn !== 'function') return;
  switch (start) {
    case 'document-end':
      if (
        document.readyState === 'interactive' ||
        document.readyState === 'complete'
      ) {
        fn.call(this, ...args);
      } else {
        document.addEventListener('DOMContentLoaded', fn.bind(this, ...args));
      }
      break;
    case 'document-idle':
      if (document.readyState === 'complete') {
        fn.call(this, ...args);
      } else {
        window.addEventListener('load', fn.bind(this, ...args));
      }
      break;
    default:
      if (document.readyState === 'complete') {
        setTimeout(fn, start, ...args);
      } else {
        window.addEventListener('load', () => {
          setTimeout(fn, start, ...args);
        });
      }
  }
}

function runMatch(opt = {}) {
  const { white = [], black = [], full = true } = opt;
  let addr = full ? location.href : location.hostname,
    matcher = (url) => {
      if (url.startsWith('//') && url.endsWith('//')) {
        try {
          let expr = new RegExp(url.slice(2).slice(0, -2), 'gu');
          return expr.test(addr);
        } catch (e) {
          console.error(e);
          return addr.indexOf(url) >= 0;
        }
      }
      return addr.indexOf(url) >= 0;
    },
    ok = true,
    pick = addr;
  return new Promise((resolve, reject) => {
    black.forEach((r) => {
      if (matcher(r)) {
        ok = false;
        pick = r;
      }
    });
    if (white.length > 0) {
      ok = false;
      white.forEach((r) => {
        if (matcher(r)) {
          ok = true;
          pick = r;
        }
      });
    }
    if (ok) {
      resolve(pick);
    } else reject(pick);
  });
}

function addElement({
  tag,
  attrs = {},
  to = document.body || document.documentElement,
}) {
  const el = document.createElement(tag);
  Object.assign(el, attrs);
  to.appendChild(el);
  return el;
}

function addStyle(css) {
  return addElement({
    tag: 'style',
    attrs: {
      textContent: css,
    },
    to: document.head,
  });
}

var config = {"toast":0.1,"out":1};

const blackKey = "recordScrollKey";
const savedBlack = JSON.parse(GM_getValue(blackKey, "[]"));
config.black = savedBlack;

if (savedBlack.indexOf(location.hostname) < 0) {
  GM_registerMenuCommand("在此域名禁用", () => {
    savedBlack.push(location.hostname);
    GM_setValue(blackKey, JSON.stringify(savedBlack));
    location.reload();
  })
} else {
  GM_registerMenuCommand("在此域名启用", () => {
    GM_setValue(blackKey, JSON.stringify(savedBlack.filter((domain) => domain !== location.hostname)));
    location.reload();
  })
}
function toast(text, time = 3, callback, transition = 0.2) {
  let isObj = (o) =>
      typeof o == 'object' &&
      typeof o.toString == 'function' &&
      o.toString() === '[object Object]',
    timeout,
    toastTransCount = 0;
  if (typeof text != 'string') text = String(text);
  if (typeof time != 'number' || time <= 0) time = 3;
  if (typeof transition != 'number' || transition < 0) transition = 0.2;
  if (callback && !isObj(callback)) callback = undefined;
  if (callback) {
    if (callback.text && typeof callback.text != 'string')
      callback.text = String(callback.text);
    if (
      callback.color &&
      (typeof callback.color != 'string' || callback.color === '')
    )
      delete callback.color;
    if (callback.onclick && typeof callback.onclick != 'function')
      callback.onclick = () => null;
    if (callback.onclose && typeof callback.onclose != 'function')
      delete callback.onclose;
  }

  let toastStyle = addStyle(`
  #bextToast {
    all: initial;
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 10vh;
    width: max-content;
    max-width: 80vw;
    max-height: 80vh;
    margin: 0 auto;
    border-radius: 20px;
    padding: .5em 1em;
    font-size: 16px;
    background-color: rgba(0,0,0,0.5);
    color: white;
    z-index: 1000002;
    opacity: 0%;
    transition: opacity ${transition}s;
  }
  #bextToast > * {
    display: -webkit-box;
    height: max-content;
    margin: auto .25em;
    width: max-content;
    max-width: calc(40vw - .5em);
    max-height: 80vh;
    overflow: hidden;
    -webkit-line-clamp: 22;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
  }
  #bextToastBtn {
    color: ${callback && callback.color ? callback.color : 'turquoise'}
  }
  #bextToast.bextToastShow {
    opacity: 1;
  }
    `),
    toastDiv = addElement({
      tag: 'div',
      attrs: {
        id: 'bextToast',
      },
    }),
    toastShow = () => {
      toastDiv.classList.toggle('bextToastShow');
      toastTransCount++;
      if (toastTransCount >= 2) {
        setTimeout(function () {
          toastDiv.remove();
          toastStyle.remove();
          if (callback && callback.onclose) callback.onclose.call(this);
        }, transition * 1000 + 1);
      }
    };
  addElement({
    tag: 'div',
    attrs: {
      id: 'bextToastText',
      innerText: text,
    },
    to: toastDiv,
  });
  if (callback && callback.text) {
    addElement({
      tag: 'div',
      attrs: {
        id: 'bextToastBtn',
        innerText: callback.text,
        onclick:
          callback && callback.onclick
            ? () => {
                callback.onclick.call(this);
                clearTimeout(timeout);
                toastShow();
              }
            : null,
      },
      to: toastDiv,
    });
  }
  setTimeout(toastShow, 1);
  timeout = setTimeout(toastShow, (time + transition * 2) * 1000);
}


var now = Date.now || function() {
  return new Date().getTime();
};






function throttle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var _now = now();
    if (!previous && options.leading === false) previous = _now;
    var remaining = wait - (_now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = _now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

runOnce(() => {
    if (!config.hasOwnProperty('black')) config.black = [];
    if (!config.hasOwnProperty('white')) config.white = [];
    runMatch({
        black: config.black,
        white: config.white,
        full: true
    }).then(() => {
        (() => {
            function isDocument(d) {
                return d && d.nodeType === 9;
            }
            function getDocument(node) {
                if (isDocument(node)) {
                    return node;
                } else if (isDocument(node.ownerDocument)) {
                    return node.ownerDocument;

                } else if (isDocument(node.document)) {
                    return node.document;

                } else if (node.parentNode) {
                    return getDocument(node.parentNode);
                } else if (node.commonAncestorContainer) {
                    return getDocument(node.commonAncestorContainer);
                } else if (node.startContainer) {
                    return getDocument(node.startContainer);
                } else if (node.anchorNode) {
                    return getDocument(node.anchorNode);
                }
            }
            class DOMException {
                constructor(message, name) {
                    this.message = message;
                    this.name = name;
                    this.stack = (new Error()).stack;
                }
            }
            DOMException.prototype = new Error();
            DOMException.prototype.toString = function () {
                return `${this.name}: ${this.message}`
            };
            const FIRST_ORDERED_NODE_TYPE = 9;
            const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
            window.sXPath = {};
            window.sXPath.fromNode = (node, root = null) => {
                if (node === undefined) {
                    throw new Error('missing required parameter "node"')
                }
                root = root || getDocument(node);
                let path = '/';
                while (node !== root) {
                    if (!node) {
                        let message = 'The supplied node is not contained by the root node.';
                        let name = 'InvalidNodeTypeError';
                        throw new DOMException(message, name)
                    }
                    path = `/${nodeName(node)}[${nodePosition(node)}]${path}`;
                    node = node.parentNode;
                }
                return path.replace(/\/$/, '')
            };
            window.sXPath.toNode = (path, root, resolver = null) => {
                if (path === undefined) {
                    throw new Error('missing required parameter "path"')
                }
                if (root === undefined) {
                    throw new Error('missing required parameter "root"')
                }
                let document = getDocument(root);
                if (root !== document) path = path.replace(/^\//, './');
                let documentElement = document.documentElement;
                if (resolver === null && documentElement.lookupNamespaceURI) {
                    let defaultNS = documentElement.lookupNamespaceURI(null) || HTML_NAMESPACE;
                    resolver = (prefix) => {
                        let ns = { '_default_': defaultNS };
                        return ns[prefix] || documentElement.lookupNamespaceURI(prefix)
                    };
                }
                return resolve(path, root, resolver)
            };
            function nodeName(node) {
                switch (node.nodeName) {
                    case '#text': return 'text()'
                    case '#comment': return 'comment()'
                    case '#cdata-section': return 'cdata-section()'
                    default: return node.nodeName.toLowerCase()
                }
            }
            function nodePosition(node) {
                let name = node.nodeName;
                let position = 1;
                while ((node = node.previousSibling)) {
                    if (node.nodeName === name) position += 1;
                }
                return position
            }
            function resolve(path, root, resolver) {
                try {
                    let nspath = path.replace(/\/(?!\.)([^\/:\(]+)(?=\/|$)/g, '/_default_:$1');
                    return platformResolve(nspath, root, resolver)
                } catch (err) {
                    return fallbackResolve(path, root)
                }
            }
            function fallbackResolve(path, root) {
                let steps = path.split("/");
                let node = root;
                while (node) {
                    let step = steps.shift();
                    if (step === undefined) break
                    if (step === '.') continue
                    let [name, position] = step.split(/[\[\]]/);
                    name = name.replace('_default_:', '');
                    position = position ? parseInt(position) : 1;
                    node = findChild(node, name, position);
                }
                return node
            }
            function platformResolve(path, root, resolver) {
                let document = getDocument(root);
                let r = document.evaluate(path, root, resolver, FIRST_ORDERED_NODE_TYPE, null);
                return r.singleNodeValue
            }
            function findChild(node, name, position) {
                for (node = node.firstChild; node; node = node.nextSibling) {
                    if (nodeName(node) === name && --position === 0) break
                }
                return node
            }

            let urlChangeFn = null;
            history.pushState = (f => function pushState() {
                var ret = f.apply(this, arguments);
                window.dispatchEvent(new Event('pushstate'));
                window.dispatchEvent(new Event('urlchange'));
                return ret;
            })(history.pushState);
            history.replaceState = (f => function replaceState() {
                var ret = f.apply(this, arguments);
                window.dispatchEvent(new Event('replacestate'));
                window.dispatchEvent(new Event('urlchange'));
                return ret;
            })(history.replaceState);
            window.addEventListener('popstate', () => {
                window.dispatchEvent(new Event('urlchange'));
            });
            Object.defineProperty(window, 'onurlchange', {
                get() { return urlChangeFn; },
                set(fn) {
                    if (typeof fn === 'function') {
                        urlChangeFn = fn;
                        window.addEventListener('urlchange', urlChangeFn);
                    } else {
                        window.removeEventListener('urlchange', urlChangeFn);
                        urlChangeFn = null;
                    }
                },
            });
        })();
        runAt('document-end', () => {
            const stor = window.localStorage,
                boxkey = 'lemonScrollBox';
            let boxobj = null, box = null, boxel = null;
            function getScrollBox(e) {
                boxel = e.target;
                let pageid = location.href;
                if (boxel.scrollTop === undefined) boxel = document.documentElement;
                try {
                    box = window.sXPath.fromNode(boxel, document.documentElement);
                } catch (e) {
                    box = '.';
                }
                if (!boxobj) boxobj = {};
                boxobj[pageid] =
                {
                    box: box,
                    pos: boxel.scrollTop,
                    class: boxel.className,
                    id: boxel.id
                };
                stor.setItem(
                    boxkey,
                    JSON.stringify(boxobj)
                );
            }
            function startNewRecord() {
                toast('开始记录滚动', config.toast);
                document.addEventListener('scroll', throttle(getScrollBox, 300), true);
            }
            function scanPage() {
                boxobj = JSON.parse(stor.getItem(boxkey));
                let pageid = location.href;
                if (boxobj[pageid]) {
                    runNeed(
                        () => {
                            boxel = (boxobj[pageid].box === '') ?
                                document.documentElement : window.sXPath.toNode(
                                    boxobj[pageid].box,
                                    document.documentElement
                                );
                            if (boxel &&
                                boxel.id === boxobj[pageid].id &&
                                boxel.className === boxobj[pageid].class &&
                                boxel.scrollHeight > window.innerHeight) {
                                return true;
                            } else return false;
                        },
                        () => {
                            setTimeout(() => {
                                boxel.scrollTop = boxobj[pageid].pos;
                            }, config.out);
                        }
                    );
                    document.addEventListener('scroll', throttle(getScrollBox, 300), true);
                } else startNewRecord();
            }
            if (stor.hasOwnProperty(boxkey)) {
                window.onurlchange = scanPage;
                window.onhashchange = scanPage;
                scanPage();
            } else {
                startNewRecord();
            }
        });
    });
});

})();
