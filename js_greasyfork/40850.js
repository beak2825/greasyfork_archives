// ==UserScript==
// @name         serialized-formatter
// @namespace    http://tampermonkey.net/
// @version      0.6.4
// @description  try to take over the world!
// @author       You
// @include      http*://hydrogen.*.aws.ytech.co.nz/admin/search/listing/*
// @require      https://unpkg.com/mithril/mithril.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40850/serialized-formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/40850/serialized-formatter.meta.js
// ==/UserScript==


var JsonViewer = {
  obj: null,
  oninit: function() {
    var text = document.getElementById('id_serialized').textContent;
    JsonViewer.obj = JSON.parse(text);
  },
  itemType: function(obj) {
      if (Array.isArray(obj))
          return 'array';
      if (!!obj && 'object' === typeof obj)
          return 'object';
      if (obj === null)
          return 'null';
      return (typeof obj);
  },
  typeMark: function(obj) {
      var objType = JsonViewer.itemType(obj);
      if (objType === 'object')
          return ' {' + Object.keys(obj).length + '}';
      if (objType === 'array')
          return ' [' + obj.length + ']';
      return ' : ';
  },
  objValue: function(obj) {
      var objType = JsonViewer.itemType(obj);
      if (objType == 'boolean')
          return obj.toString();
      return obj;
  },
  render: function(obj, level, parentKey) {
    var left = level * 15;
    var pk = 'level-' + (level-1) + '__' + parentKey;

    switch(JsonViewer.itemType(obj)) {
        case 'array':
            return obj.map(function(item, idx) {
                var _item = {};
                _item[idx] = item;
                return JsonViewer.render(_item, level+1, parentKey);
            });
        case 'object':
            return Object.keys(obj).map(function(k) {
                var item = obj[k];
                var objType = JsonViewer.itemType(item);
                var pkThis = 'level-' + level + '__' + k;

                if (objType == 'array' || objType === 'object') {
                    return m('div', {class: pk + ' item-container'}, [
                        m('div', {class: 'item-key__tag', onclick: function(e) {
                            var elements = document.getElementsByClassName(pkThis);
                            for (var i=0; i<elements.length; i++) {
                                var elem = elements.item(i);
                                if (elem.style.display === 'none') {
                                    elem.style.display = 'block';
                                } else {
                                    elem.style.display = 'none';
                                }
                            }
                            e.target.innerText = (e.target.innerText === '+') ? '-' : '+';
                        }}, '-'),
                        m('div', {class: 'item-key__name'}, [k, m('span', {class: 'item-key__note'}, JsonViewer.typeMark(item))]),
                        m('div', {class: pkThis +' item-value__object'}, JsonViewer.render(item, level+1, k))
                    ]);
                } else {
                    return m('div', {class: pk + ' item-container'}, [
                        m('div', {class: 'item-key'}, [
                          k + ' : ',
                          m('span', {class: 'item-value item-color__' + JsonViewer.itemType(item)}, JsonViewer.objValue(item))
                        ])
                    ]);
                }
            });
    }

    return m('div', {
        class: 'item-value__list item-color__' + JsonViewer.itemType(obj)
    }, objValue(jsonObj));
  },
  view: function() {
    return m('div', {class: 'serialized-viewer__root'}, JsonViewer.render({'serialized': JsonViewer.obj}, 1, 'root'));
  }
};


(function() {
    'use strict';

    GM_addStyle('.serialized-viewer__root {max-height: 800px; max-width: 800px; border: 1px solid #ddd; border-radius: 3px; margin: 15px; margin-left: 106px; overflow: auto;}');
    GM_addStyle('.item-container {position: relative; margin-top: 3px;}');
    GM_addStyle('.item-key {position: relative; left: 15px; font-weight: bold;}');
    GM_addStyle('.item-key__tag {position: relative; left: 5px; cursor: pointer; width: 5px; color: blue;}');
    GM_addStyle('.item-key__name {position: absolute; left: 15px; top: 0; font-weight: bold;}');
    GM_addStyle('.item-key__note {color: #888;}');
    GM_addStyle('.item-value {font-weight: normal;}');
    GM_addStyle('.item-value__object {position: relative; left: 15px;}');
    GM_addStyle('.item-value__list {position: relative; left: 15px; font-weight: normal;}');
    GM_addStyle('.item-color__string {color: green;}');
    GM_addStyle('.item-color__number {color: #ee422e;}');
    GM_addStyle('.item-color__boolean {color: #ffc000;}');

    var root = document.createElement('div');
    m.mount(root, JsonViewer);

    document.getElementsByClassName('field-serialized')[0].appendChild(root);
    document.getElementsByClassName('item-key__tag')[0].click();
    root.style.display = 'block';
})();