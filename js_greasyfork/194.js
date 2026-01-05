// ==UserScript==
// @name        Title Manager
// @namespace   grom
// @description Manage page titles per (sub)domain. On any website, click Greasemonkey > User Script Commands > Title Manager's menu.
// @include     *
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @version     1.2.0.20140927
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/194/Title%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/194/Title%20Manager.meta.js
// ==/UserScript==

if ( GM_getValue === 'undefined' || GM_setValue === 'undefined' ) {
  alert('=== Title Manager ===\n\nUnable to load or store values.\
  \nPlease use supported script managers:\nGreasemonkey, Tampermonkey...');
}

// shorthands
function $i(a,b) { return (b||document).getElementById(a); }
function $t(a,b) { return (b||document).getElementsByTagName(a); }

var domains = GM_getValue('domains-deletable-buffer', '') || GM_getValue('domains', '').replace(/\./g, '\\.'),
    match = window.location.host.toLowerCase().match(domains),
    t = document.title;

if (match) {
  var _find = GM_getValue(match[0] + '-find', '');
    if (_find.match(/^regex:/)) {
      _find = _find.replace(/^regex:/, '');
      _find = new RegExp(_find, 'i');
    }
  var _with = GM_getValue(match[0] + '-with', '');
}
if (t &&_find) document.title = t.replace(_find, _with);

function tm_add(StrReg, escape, isItImport, _domain, _find, _with) {
  // StrReg: is "Search for" string or regex - 'str' or 'reg'
  // escape: escape dollar signs or not - 'escape' or 'noescape'
  var _domainCheck = /^[a-z0-9_\.-]+$/,
      tm_error = $i('tm-error-notifier');
  if (!isItImport) {
    var _domain = $i('tm-domain').value.toLowerCase();
    var _find = $i('tm-find').value;
    var _with = $i('tm-with').value;
  }
  if (!_domain.match(_domainCheck)) {
    tm_error.innerHTML = 'Domain invalid. Please use letters a-z, numbers 0-9, underscore _, minus - or dot .';
    return;
  }
  // if "Search for" is regex, make sure it starts with "regex:"
  if (StrReg === 'reg') {
    if (!_find.match(/^regex:/)) _find = _find.replace(/^/, 'regex:');
  }
  // store values, if "domain" and "Search for" are valid
  if (_find) { // we don't need to check for _domain, we passed _domainCheck
    var domains = GM_getValue('domains', '');
    if (!domains) {
      GM_setValue('domains', _domain);
    }
    else {
      var match = _domain.replace(/\./g, '\\.');
      var match = new RegExp('(^|\\|)' + match + '($|\\|)');
      if (!domains.match(match)) {
        var domains = domains + '|' + _domain;
        GM_setValue('domains', domains);
      }
    }
    GM_setValue(_domain + '-find', _find);
    if (_with) {
      // if not adding as regex, escape dollar signs
      if (escape === 'escape') var _with = _with.replace(/\$/g, '$$$$');
      GM_setValue(_domain + '-with', _with);
    }
    else if (GM_getValue(_domain + '-with', '')) GM_deleteValue(_domain + '-with');
    // if not in importing loop, create buffer for domains
    if (!isItImport) {
      GM_setValue('domains-deletable-buffer', GM_getValue('domains', '').replace(/\./g, '\\.'));
      tm_error.innerHTML = 'Success! Rule added.';
    }
  }
}

function tm_manage() {
  var d = document;
  d.documentElement.innerHTML = '<head><style>.item{white-space:pre;font-family:monospace;margin:0;padding:0;}html>input{margin-left:1em;}</style></head>';
  var domains = GM_getValue('domains', '');
  if (domains) {
    var domains = domains.split('|');
    for(var i = 0, j = domains.length; i < j; i++) {
      var _find = GM_getValue(domains[i] + '-find', '');
      var _with = GM_getValue(domains[i] + '-with', '');
      var box = d.createElement('div');
      box.className = 'item';
      box.innerHTML = '<span>' + domains[i] + '</span><br /><span>' + _find + '</span>\
<br /><span>' + _with + '</span><br /><button>Remove</button><br /><span>========</span>';
      if (d.body) d.body.appendChild(box);
      else d.documentElement.appendChild(box);
      $t('button', box)[0].addEventListener('click', tm_remove);
    }
  }
  // import
  var impList = d.createElement('textarea');
  impList.id = 'tm-import-list';
  d.documentElement.appendChild(impList);
  var imp = d.createElement('input');
  imp.type = 'button'; imp.id = 'tm-import'; imp.value = 'Import';
  d.documentElement.appendChild(imp);
  imp.addEventListener('click', tm_import);
  // sort button if 2 or more domains
  if (domains.length>1) {
    var sor = d.createElement('input');
    sor.type = 'button'; sor.id = 'tm-sort'; sor.value = 'Sort';
    d.documentElement.appendChild(sor);
    sor.addEventListener('click', tm_sort);
    // and export button
    var exo = d.createElement('input');
    exo.type = 'button'; exo.id = 'tm-export'; exo.value = 'Prepare for export';
    d.documentElement.appendChild(exo);
    exo.addEventListener('click', tm_export);
  }
}

function tm_remove() {
  var item = this.parentNode;
  var _domain = $t('span', item)[0].innerHTML;
  GM_deleteValue(_domain + '-find');
  GM_deleteValue(_domain + '-with');
  var domains = GM_getValue('domains', '');
  var match = _domain.replace(/\./g, '\\.');
  // match: (^ or |) + single/current domain + ($ or |)
  var match = new RegExp('(^|\\|)' + match + '($|\\|)');
  // replace: matched single domain with ^ or |; replace: || with | or remove |$
  var domains = domains.replace(match, '$1').replace(/(\|)\||\|$/g, '$1');
  GM_setValue('domains', domains);
  item.parentNode.removeChild(item);
  // re-create buffer for domains
  GM_setValue('domains-deletable-buffer', GM_getValue('domains', '').replace(/\./g, '\\.'));
}

function tm_import() {
  var d = document,
      list = $i('tm-import-list').value;
  var list = list.match(/.+/g).join('--------').replace(/(--------)+========$/, '').split('========--------');
  for(var i = 0, j = list.length; i < j; i++) {
    var listB = list[i].split('--------');
    if (listB[0] && listB[1]) tm_add('str', 'noescape', 'true', listB[0], listB[1], listB[2]);
  }
  // create buffer for domains, refresh page
  GM_setValue('domains-deletable-buffer', GM_getValue('domains', '').replace(/\./g, '\\.'));
  tm_manage();
}

function tm_sort() {
  GM_setValue('domains', GM_getValue('domains', '').split('|').sort().join('|'));
  GM_setValue('domains-deletable-buffer', GM_getValue('domains', '').replace(/\./g, '\\.'));
  tm_manage();
}

function tm_export() {
  // remove everything except the list
  var list = document.querySelectorAll('#grom-TitleManager, button, button+br, textarea, input, body>*:not(.item)');
  for (var i = 0, j = list.length; i < j; i++) { list[i].parentNode.removeChild(list[i]); }
  alert('=== Title Manager ===\n\nList prepared for export. You\'ll need to:\
  \nSelect all text on the page (Ctrl-A) and copy it (Ctrl-C).\nThen paste that text anywhere you want, perhaps in a new file.')
}

function tm_QuickMenu() {
  var d = document,
      box = d.createElement('div'),
      isThere = $i('grom-TitleManager');
  if (isThere) {
    isThere.parentNode.removeChild(isThere);
    return;
  }
  box.style = 'max-width:50em;margin:0 auto;padding:1em;text-align:center;border-top:3px solid;box-shadow:0 0 5px #999;';
  box.id = 'grom-TitleManager';
  box.innerHTML = '<style scoped>#tm-domain,#tm-find,#tm-with{width:100%;max-width:40em;float:right;}</style>\
<h1 style="margin:initial;">Title Manager<input type="button" id="tm-close" value="X" style="float:right;" /></h1>\
<p>Full title: "<strong>' + t + '</strong>"</p>\
<p id="tm-error-notifier">Regex supported in "Search for" with single backslash <strong>\\</strong> as escaping character.</p>\
<p>Domain: <input type="text" id="tm-domain" value="' + window.location.host.toLowerCase() + '" /></p>\
<p>Search for: <input type="text" id="tm-find" value="' + t + '" /></p>\
<p>Replace with: <input type="text" id="tm-with" value="" /></p>\
<p><input type="button" id="tm-add" value="Add" /> or <input type="button" id="tm-add-regex" value="Add as regex" />\
 &nbsp; &nbsp; &nbsp; <input type="button" id="tm-manage" value="View and manage all title rules" /></p>\
<br /><br />';
  if (d.body) d.body.appendChild(box);
  else d.documentElement.appendChild(box);
  box.scrollIntoView();
  $i('tm-add')      .addEventListener('click', function() { tm_add('str','escape') });
  $i('tm-add-regex').addEventListener('click', function() { tm_add('reg','noescape') });
  $i('tm-manage')   .addEventListener('click', tm_manage);
  $i('tm-close')    .addEventListener('click', tm_QuickMenu);
}

GM_registerMenuCommand("Title Manager's menu", tm_QuickMenu);