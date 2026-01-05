// ==UserScript==
// @name        列表显示内容
// @namespace   sh2288
// @description 列表显示详细内容
// @include     http://bbs.kafan.cn/forum-215-1.html
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/10722/%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/10722/%E5%88%97%E8%A1%A8%E6%98%BE%E7%A4%BA%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
var gethtml = function (url, node, urlnode)
{
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    onload: function (responseDetails) {
      //var responseXML = new DOMParser().parseFromString(responseDetails.responseText, 'text/xml');
      var logo = document.createElement('td');
      logo.innerHTML = responseDetails.responseText;
      var entries = logo.querySelector(node);
      urlnode.appendChild(entries);
      //alert(entries);
      }
  })
}
var urlnodes = document.querySelectorAll('.common')
  for (i = 0; i < urlnodes.length; i++)
  {
    var urls = urlnodes[i].querySelectorAll('a')[1].href
    //print(urls.href)
    //print(urlnodes[i])
    gethtml (urls,'.t_fsz',urlnodes[i])
  }
