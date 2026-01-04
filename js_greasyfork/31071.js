// ==UserScript===
// @name           honto recorded list
// @namespace      honto recorded list
// @description    作品ページで収録作品を自動表示する
// @author         TNB
// @grant          none
// @match          *://honto.jp/netstore/pd-book*
// @version        1.0
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/31071/honto%20recorded%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/31071/honto%20recorded%20list.meta.js
// ==/UserScript==

var HontoRecordedList;

HontoRecordedList = {
  getLink: function() {
    var link = document.querySelector('ul.stLink01 a');
    if (link) {
      var url = link.href;
      this.request(url);
    }
  },
  request: function(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'document';
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = this.response,
            subTitle = res.querySelectorAll('.stTableData01 > tbody > tr'),
            table = document.querySelector('table.stTableProduct01 > tbody'),
            frag = document.createDocumentFragment();
        for (var i = 0, len = subTitle.length; i < len; i++) {
          frag.appendChild(subTitle[i].cloneNode(true));
        }
        table.parentElement.replaceChild(frag, table);
      }
    };
    xhr.send('');
    xhr = '';
  }
}

window.addEventListener('DOMContentLoaded', () => {HontoRecordedList.getLink();}, false);
