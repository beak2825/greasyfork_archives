// ==UserScript==
// @name        NexusPHP PT Helper
// @name:zh-CN  NexusPHP PT 助手
// @namespace   https://greasyfork.org/zh-CN/users/163820-ysc3839
// @version     0.2.1
// @description Helper script for NexusPHP based PT sites.
// @description:zh-CN 适用于基于 NexusPHP 的 PT 站的辅助脚本
// @author      ysc3839
// @match       *://hdhome.org/*
// @match       *://bt.byr.cn/*
// @match       *://tjupt.org/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/371436/NexusPHP%20PT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/371436/NexusPHP%20PT%20Helper.meta.js
// ==/UserScript==

'use strict';

let domParser = null, passkey = localStorage.getItem('passkey');

/**
 * @class
 * @memberof LuCI
 * @hideconstructor
 * @classdesc
 *
 * Slightly modified version of `LuCI.dom` (https://github.com/openwrt/luci/blob/5d55a0a4a9c338f64818ac73b7d5f28079aa95b7/modules/luci-base/htdocs/luci-static/resources/luci.js#L2080),
 * which is licensed under Apache License 2.0 (https://github.com/openwrt/luci/blob/master/LICENSE).
 * 
 * The `dom` class provides convenience method for creating and
 * manipulating DOM elements.
 */
const dom = {
  /**
   * Tests whether the given argument is a valid DOM `Node`.
   *
   * @instance
   * @memberof LuCI.dom
   * @param {*} e
   * The value to test.
   *
   * @returns {boolean}
   * Returns `true` if the value is a DOM `Node`, else `false`.
   */
  elem: function(e) {
    return (e != null && typeof(e) == 'object' && 'nodeType' in e);
  },

  /**
   * Parses a given string as HTML and returns the first child node.
   *
   * @instance
   * @memberof LuCI.dom
   * @param {string} s
   * A string containing an HTML fragment to parse. Note that only
   * the first result of the resulting structure is returned, so an
   * input value of `<div>foo</div> <div>bar</div>` will only return
   * the first `div` element node.
   *
   * @returns {Node}
   * Returns the first DOM `Node` extracted from the HTML fragment or
   * `null` on parsing failures or if no element could be found.
   */
  parse: function(s) {
    var elem;

    try {
      domParser = domParser || new DOMParser();
      let d = domParser.parseFromString(s, 'text/html');
      elem = d.body.firstChild || d.head.firstChild;
    }
    catch(e) {}

    if (!elem) {
      try {
        dummyElem = dummyElem || document.createElement('div');
        dummyElem.innerHTML = s;
        elem = dummyElem.firstChild;
      }
      catch (e) {}
    }

    return elem || null;
  },

  /**
   * Tests whether a given `Node` matches the given query selector.
   *
   * This function is a convenience wrapper around the standard
   * `Node.matches("selector")` function with the added benefit that
   * the `node` argument may be a non-`Node` value, in which case
   * this function simply returns `false`.
   *
   * @instance
   * @memberof LuCI.dom
   * @param {*} node
   * The `Node` argument to test the selector against.
   *
   * @param {string} [selector]
   * The query selector expression to test against the given node.
   *
   * @returns {boolean}
   * Returns `true` if the given node matches the specified selector
   * or `false` when the node argument is no valid DOM `Node` or the
   * selector didn't match.
   */
  matches: function(node, selector) {
    var m = this.elem(node) ? node.matches || node.msMatchesSelector : null;
    return m ? m.call(node, selector) : false;
  },

  /**
   * Returns the closest parent node that matches the given query
   * selector expression.
   *
   * This function is a convenience wrapper around the standard
   * `Node.closest("selector")` function with the added benefit that
   * the `node` argument may be a non-`Node` value, in which case
   * this function simply returns `null`.
   *
   * @instance
   * @memberof LuCI.dom
   * @param {*} node
   * The `Node` argument to find the closest parent for.
   *
   * @param {string} [selector]
   * The query selector expression to test against each parent.
   *
   * @returns {Node|null}
   * Returns the closest parent node matching the selector or
   * `null` when the node argument is no valid DOM `Node` or the
   * selector didn't match any parent.
   */
  parent: function(node, selector) {
    if (this.elem(node) && node.closest)
      return node.closest(selector);

    while (this.elem(node))
      if (this.matches(node, selector))
        return node;
      else
        node = node.parentNode;

    return null;
  },

  /**
   * Appends the given children data to the given node.
   *
   * @instance
   * @memberof LuCI.dom
   * @param {*} node
   * The `Node` argument to append the children to.
   *
   * @param {*} [children]
   * The childrens to append to the given node.
   *
   * When `children` is an array, then each item of the array
   * will be either appended as child element or text node,
   * depending on whether the item is a DOM `Node` instance or
   * some other non-`null` value. Non-`Node`, non-`null` values
   * will be converted to strings first before being passed as
   * argument to `createTextNode()`.
   *
   * When `children` is a function, it will be invoked with
   * the passed `node` argument as sole parameter and the `append`
   * function will be invoked again, with the given `node` argument
   * as first and the return value of the `children` function as
   * second parameter.
   *
   * When `children` is is a DOM `Node` instance, it will be
   * appended to the given `node`.
   *
   * When `children` is any other non-`null` value, it will be
   * converted to a string and appened to the `innerHTML` property
   * of the given `node`.
   *
   * @returns {Node|null}
   * Returns the last children `Node` appended to the node or `null`
   * if either the `node` argument was no valid DOM `node` or if the
   * `children` was `null` or didn't result in further DOM nodes.
   */
  append: function(node, children) {
    if (!this.elem(node))
      return null;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++)
        if (this.elem(children[i]))
          node.appendChild(children[i]);
        else if (children !== null && children !== undefined)
          node.appendChild(document.createTextNode('' + children[i]));

      return node.lastChild;
    }
    else if (typeof(children) === 'function') {
      return this.append(node, children(node));
    }
    else if (this.elem(children)) {
      return node.appendChild(children);
    }
    else if (children !== null && children !== undefined) {
      node.innerHTML = '' + children;
      return node.lastChild;
    }

    return null;
  },

  /**
   * Replaces the content of the given node with the given children.
   *
   * This function first removes any children of the given DOM
   * `Node` and then adds the given given children following the
   * rules outlined below.
   *
   * @instance
   * @memberof LuCI.dom
   * @param {*} node
   * The `Node` argument to replace the children of.
   *
   * @param {*} [children]
   * The childrens to replace into the given node.
   *
   * When `children` is an array, then each item of the array
   * will be either appended as child element or text node,
   * depending on whether the item is a DOM `Node` instance or
   * some other non-`null` value. Non-`Node`, non-`null` values
   * will be converted to strings first before being passed as
   * argument to `createTextNode()`.
   *
   * When `children` is a function, it will be invoked with
   * the passed `node` argument as sole parameter and the `append`
   * function will be invoked again, with the given `node` argument
   * as first and the return value of the `children` function as
   * second parameter.
   *
   * When `children` is is a DOM `Node` instance, it will be
   * appended to the given `node`.
   *
   * When `children` is any other non-`null` value, it will be
   * converted to a string and appened to the `innerHTML` property
   * of the given `node`.
   *
   * @returns {Node|null}
   * Returns the last children `Node` appended to the node or `null`
   * if either the `node` argument was no valid DOM `node` or if the
   * `children` was `null` or didn't result in further DOM nodes.
   */
  content: function(node, children) {
    if (!this.elem(node))
      return null;

    while (node.firstChild)
      node.removeChild(node.firstChild);

    return this.append(node, children);
  },

  /**
   * Sets attributes or registers event listeners on element nodes.
   *
   * @instance
   * @memberof LuCI.dom
   * @param {*} node
   * The `Node` argument to set the attributes or add the event
   * listeners for. When the given `node` value is not a valid
   * DOM `Node`, the function returns and does nothing.
   *
   * @param {string|Object<string, *>} key
   * Specifies either the attribute or event handler name to use,
   * or an object containing multiple key, value pairs which are
   * each added to the node as either attribute or event handler,
   * depending on the respective value.
   *
   * @param {*} [val]
   * Specifies the attribute value or event handler function to add.
   * If the `key` parameter is an `Object`, this parameter will be
   * ignored.
   *
   * When `val` is of type function, it will be registered as event
   * handler on the given `node` with the `key` parameter being the
   * event name.
   *
   * When `val` is of type object, it will be serialized as JSON and
   * added as attribute to the given `node`, using the given `key`
   * as attribute name.
   *
   * When `val` is of any other type, it will be added as attribute
   * to the given `node` as-is, with the underlying `setAttribute()`
   * call implicitely turning it into a string.
   */
  attr: function(node, key, val) {
    if (!this.elem(node))
      return null;

    var attr = null;

    if (typeof(key) === 'object' && key !== null)
      attr = key;
    else if (typeof(key) === 'string')
      attr = {}, attr[key] = val;

    for (key in attr) {
      if (!attr.hasOwnProperty(key) || attr[key] == null)
        continue;

      switch (typeof(attr[key])) {
      case 'function':
        node.addEventListener(key, attr[key]);
        break;

      case 'object':
        node.setAttribute(key, JSON.stringify(attr[key]));
        break;

      default:
        node.setAttribute(key, attr[key]);
      }
    }
  },

  /**
   * Creates a new DOM `Node` from the given `html`, `attr` and
   * `data` parameters.
   *
   * This function has multiple signatures, it can be either invoked
   * in the form `create(html[, attr[, data]])` or in the form
   * `create(html[, data])`. The used variant is determined from the
   * type of the second argument.
   *
   * @instance
   * @memberof LuCI.dom
   * @param {*} html
   * Describes the node to create.
   *
   * When the value of `html` is of type array, a `DocumentFragment`
   * node is created and each item of the array is first converted
   * to a DOM `Node` by passing it through `create()` and then added
   * as child to the fragment.
   *
   * When the value of `html` is a DOM `Node` instance, no new
   * element will be created but the node will be used as-is.
   *
   * When the value of `html` is a string starting with `<`, it will
   * be passed to `dom.parse()` and the resulting value is used.
   *
   * When the value of `html` is any other string, it will be passed
   * to `document.createElement()` for creating a new DOM `Node` of
   * the given name.
   *
   * @param {Object<string, *>} [attr]
   * Specifies an Object of key, value pairs to set as attributes
   * or event handlers on the created node. Refer to
   * {@link LuCI.dom#attr dom.attr()} for details.
   *
   * @param {*} [data]
   * Specifies children to append to the newly created element.
   * Refer to {@link LuCI.dom#append dom.append()} for details.
   *
   * @throws {InvalidCharacterError}
   * Throws an `InvalidCharacterError` when the given `html`
   * argument contained malformed markup (such as not escaped
   * `&` characters in XHTML mode) or when the given node name
   * in `html` contains characters which are not legal in DOM
   * element names, such as spaces.
   *
   * @returns {Node}
   * Returns the newly created `Node`.
   */
  create: function() {
    var html = arguments[0],
      attr = arguments[1],
      data = arguments[2],
      elem;

    if (!(attr instanceof Object) || Array.isArray(attr))
      data = attr, attr = null;

    if (Array.isArray(html)) {
      elem = document.createDocumentFragment();
      for (var i = 0; i < html.length; i++)
        elem.appendChild(this.create(html[i]));
    }
    else if (this.elem(html)) {
      elem = html;
    }
    else if (html.charCodeAt(0) === 60) {
      elem = this.parse(html);
    }
    else {
      elem = document.createElement(html);
    }

    if (!elem)
      return null;

    this.attr(elem, attr);
    this.append(elem, data);

    return elem;
  },

  /**
   * The ignore callback function is invoked by `isEmpty()` for each
   * child node to decide whether to ignore a child node or not.
   *
   * When this function returns `false`, the node passed to it is
   * ignored, else not.
   *
   * @callback LuCI.dom~ignoreCallbackFn
   * @param {Node} node
   * The child node to test.
   *
   * @returns {boolean}
   * Boolean indicating whether to ignore the node or not.
   */

  /**
   * Tests whether a given DOM `Node` instance is empty or appears
   * empty.
   *
   * Any element child nodes which have the CSS class `hidden` set
   * or for which the optionally passed `ignoreFn` callback function
   * returns `false` are ignored.
   *
   * @instance
   * @memberof LuCI.dom
   * @param {Node} node
   * The DOM `Node` instance to test.
   *
   * @param {LuCI.dom~ignoreCallbackFn} [ignoreFn]
   * Specifies an optional function which is invoked for each child
   * node to decide whether the child node should be ignored or not.
   *
   * @returns {boolean}
   * Returns `true` if the node does not have any children or if
   * any children node either has a `hidden` CSS class or a `false`
   * result when testing it using the given `ignoreFn`.
   */
  isEmpty: function(node, ignoreFn) {
    for (var child = node.firstElementChild; child != null; child = child.nextElementSibling)
      if (!child.classList.contains('hidden') && (!ignoreFn || !ignoreFn(child)))
        return false;

    return true;
  }
};

function E() { return dom.create.apply(dom, arguments); }

function override(object, method, newMethod) {
  const original = object[method];

  object[method] = function(...args) {
    return newMethod.apply(this, [original.bind(this)].concat(args));
  };

  Object.assign(object[method], original);
}

function getTorrentURL(url) {
  const u = new URL(url);
  const id = u.searchParams.get('id');
  u.pathname = '/download.php';
  u.hash = '';
  u.search = '';
  u.searchParams.set('id', id);
  u.searchParams.set('passkey', passkey);
  return u.href;
}

function savePasskeyFromUrl(url) {
  passkey = new URL(url).searchParams.get('passkey');
  if (passkey)
    localStorage.setItem('passkey', passkey);
  else
    localStorage.removeItem('passkey');
}

function addListSelect(trlist) {
  trlist[0].prepend(E('td', {
    class: 'colhead',
    align: 'center'
  }, '链接'));
  trlist[0].prepend(E('td', {
    class: 'colhead',
    align: 'center',
    style: 'padding: 0px'
  }, E('button', {
    class: 'btn',
    style: 'font-size: 9pt;',
    click: function() {
      if (!passkey) {
        alert('No passkey!');
        return;
      }
      let text = '';
      for (let i of this.parentElement.parentElement.parentElement.getElementsByClassName('my_selected')) {
        text += getTorrentURL(i.getElementsByTagName('a')[1].href) + '\n';
      }
      GM_setClipboard(text);
      this.innerHTML = '已复制';
    }
  }, '复制')));

  let mousedown = false;
  for (var i = 1; i < trlist.length; ++i) {
    const seltd = E('td', {
      class: 'rowfollow nowrap',
      style: 'padding: 0px;',
      align: 'center',
      mousedown: function(e) {
        e.preventDefault();
        mousedown = true;
        this.firstChild.click();
      },
      mouseenter: function() {
        if (mousedown)
          this.firstChild.click();
      }
    }, E('input', {
      type: 'checkbox',
      style: 'zoom: 1.5;',
      click: function() {
        this.parentElement.parentElement.classList.toggle('my_selected');
      },
      mousedown: function(e) { e.stopPropagation(); }
    }));

    const copytd = seltd.cloneNode();
    copytd.append(E('button', {
      class: 'btn',
      click: function() {
        if (!passkey) {
          alert('No passkey!');
          return;
        }
        GM_setClipboard(getTorrentURL(this.parentElement.nextElementSibling.nextElementSibling.getElementsByTagName('a')[0].href));
        this.innerHTML = '已复制';
      }
    }, '复制'));

    trlist[i].prepend(copytd);
    trlist[i].prepend(seltd);
  }

  document.addEventListener('mouseup', function(e) {
    if (mousedown) {
      e.preventDefault();
      mousedown = false;
    }
  });
}

function modifyAnchor(a, url) {
  a.href = url;
  a.addEventListener('click', function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    GM_setClipboard(this.href);
    if (!this.getAttribute('data-copied')) {
      this.setAttribute('data-copied', '1');
      this.parentElement.previousElementSibling.innerHTML += '(已复制)';
    }
  });
}

(function() {
  GM_addStyle(`<style>
  .my_selected { background-color: rgba(0, 0, 0, 0.4); }
  td.rowfollow button { font-size: 9pt; }
  </style>`);

  switch (location.pathname) {
    case '/torrents.php': {
      const trlist = document.querySelectorAll('.torrents > tbody > tr');
      addListSelect(trlist);
    }
    break;
    case '/details.php': {
      let dlAnchor = document.getElementById('direct_link'); // tjupt.org
      if (!dlAnchor) {
        var trlist = document.querySelectorAll('#outer > h1 + table > tbody > tr');
        const names = ['种子链接'];
        for (let i of trlist) {
          const name = i.firstElementChild.innerText;
          if (names.includes(name)) {
            dlAnchor = i.lastElementChild.firstElementChild;
            break;
          }
        }
      }
      if (dlAnchor) {
        const url = dlAnchor.getAttribute('href') || dlAnchor.getAttribute('data-clipboard-text'); // hdhome.org || tjupt.org
        modifyAnchor(dlAnchor, url);
        savePasskeyFromUrl(url);
      } else {
        let text = '没有 passkey, 点此打开控制面板获取 passkey';
        let url = null;
        if (passkey) {
          url = getTorrentURL(location);
          const u = new URL(url);
          u.searchParams.set('passkey', '***');
          text = u.href;
        }
        const a = E('a', { href: '/usercp.php' }, text);
        if (url)
          modifyAnchor(a, url);

        trlist[0].insertAdjacentElement('afterend', E('tr', [
          E('td', {
            class: 'rowhead nowrap',
            valign: 'top',
            align: 'right'
          }, '种子链接'),
          E('td', {
            class: 'rowfollow',
            valign: 'top',
            align: 'left'
          }, a)
        ]));
      }
    }
    break;
    case '/usercp.php': {
      const url = new URL(location);
      if(!url.searchParams.get('action')) {
        const names = ['passkey', '密钥'];
        for (let i of document.querySelectorAll('#outer > .main + table tr')) {
          const name = i.firstElementChild.innerText;
          if (names.includes(name)) {
            passkey = i.lastElementChild.innerText;
            i.lastElementChild.innerHTML += ' (已获取)';
            break;
          }
        }
        if (passkey)
          localStorage.setItem('passkey', passkey);
        else
          localStorage.removeItem('passkey');
      }
    }
    break;
    case '/userdetails.php': {
      override(unsafeWindow, 'getusertorrentlistajax', function(original, userid, type, blockid) {
        if (original(userid, type, blockid)) {
          const blockdiv = document.getElementById(blockid);
          addListSelect(blockdiv.getElementsByTagName('tr'));
          return true;
        }
        return false;
      });
    }
    break;
  }
})();
