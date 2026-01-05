// ==UserScript==
// @name          Open links in current tab
// @author        wOxxOm
// @description   Open links in current tab regardless of _target or site's preferences. Ctrl-click: background tab, Ctrl-Shift-click: foreground tab, Shift-click: new window
// @namespace     http://target._blank.is.retarded
// @version       2.3.1
// @include       *
// @run-at        document-start
// @grant         GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/4416/Open%20links%20in%20current%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/4416/Open%20links%20in%20current%20tab.meta.js
// ==/UserScript==

if (window === top) {
  window.addEventListener('message', function (e) {
    if (!/^{/.test(e.data))
      return;
    var data = tryParse(e.data);
    if (data.name === GM_info.script.name)
      navigate(data.url);
  });
}

var pageBase = location.href.split('#', 1)[0];
var suppressing, clickedElement;

window.addEventListener('click', prevent, true);
window.addEventListener('auxclick', prevent, true);
window.addEventListener('mousedown', remember, true);
window.addEventListener('mouseup', check, true);

function remember(e) {
  clickedElement = e.composedPath ? e.composedPath()[0] : e.target;
}

function check(e) {
  var path = e.composedPath && e.composedPath();
  var el = path ? path[0] : e.target;
  if (e.button > 1 || el !== clickedElement)
    return;
  var a = el.closest('a') || path && path.find(p => p.tagName === 'A');
  if (!a)
    return;
  blockWindowOpenAndMutations(a);
  var url = a.href;
  if (url.lastIndexOf('javascript:', 0) === 0)
    return;
  var base = document.querySelector('base[target="_blank"]');
  if (base)
    base.target = '';
  if (!url || url.split('#', 1)[0] === pageBase) {
    clearLinkTarget(a);
    return;
  }
  var b = e.button, c = e.ctrlKey, alt = e.altKey, s = e.shiftKey, m = e.metaKey;
  if (b === 1 || c && !alt && !m)
    GM_openInTab(url, !s || b === 1);
  else if ((window.chrome || !CSS.supports('-moz-appearance', 'none')) && b === 0 && s && !c && !alt && !m)
    a.cloneNode().dispatchEvent(new MouseEvent('click', {shiftKey: true}));
  else if (!c && !s && !m && !alt) {
    clearLinkTarget(a);
    return;
  } else
    return;
  suppressing = true;
  prevent(e);
}

function clearLinkTarget(a) {
  if (a.target === '_blank')
    a.target = '';
}

function prevent(e) {
  if (!suppressing)
    return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  setTimeout(function () {
    suppressing = false;
  }, 50);
}

function blockWindowOpenAndMutations(a) {
  var observer = new MutationObserver(function () {
    if (a.target === '_blank') {
      a.removeAttribute('target');
      console.log('[Open links in current tab] prevented dynamic target=_blank for', a.href);
      navigate(a.href);
    }
  });
  observer.observe(a, {attributes: true, attributeFilter: ['target'], characterData: true});

  var _open = unsafeWindow.open;
  var timeout = setTimeout(function () {
    unsafeWindow.open = _open;
    observer.disconnect();
  }, 50);

  unsafeWindow.open = function (url, name, opts) {
    let o0 = `${opts || ''}`, o1, o2, rel = [
      (o1 = o0.replace(/(^|,)\s*noopener\s*($|,)/gi, '')) !== o0 && 'noopener',
      (o2 = o1.replace(/(^|,)\s*noreferrer\s*($|,)/gi, '')) !== o1 && 'noreferrer',
    ];
    if (!o2.trim()) {
      console.log('[Open links in current tab] prevented window.open for', url);
      if (rel.some(Boolean)) a.relList.add.apply(a.relList, rel.filter(Boolean));
      navigate(a.href);
    } else
      _open(url, name, opts);
    unsafeWindow.open = _open;
    clearTimeout(timeout);
  };
}

function navigate(url) {
  if (window === top) {
    var a = document.createElement('a');
    a.href = url;
    a.dispatchEvent(new MouseEvent('click'));
  } else
    top.postMessage(JSON.stringify({name: GM_info.script.name, url: url}), '*');
}

function tryParse(str) {
  try {
    return JSON.parse(str);
  } catch (e) {}
}
