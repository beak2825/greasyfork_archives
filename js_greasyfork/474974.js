// ==UserScript==
// @name        添加搜索历史 - guanziheng.com
// @namespace   Violentmonkey Scripts
// @match       https://www.guanziheng.com/
// @license      MIT
// @grant       none
// @version     1.0
// @author      WangLei
// @description 2023/9/9 00:53:00
// @downloadURL https://update.greasyfork.org/scripts/474974/%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E5%8E%86%E5%8F%B2%20-%20guanzihengcom.user.js
// @updateURL https://update.greasyfork.org/scripts/474974/%E6%B7%BB%E5%8A%A0%E6%90%9C%E7%B4%A2%E5%8E%86%E5%8F%B2%20-%20guanzihengcom.meta.js
// ==/UserScript==

!(function(){
  const maxSize = 6
  const cacheKey = 'searchHistoryData'

  const $historyContainer = $('<div id="search-history"><ul></ul></div>')

  $historyContainer.appendTo('body')

  const $ul = $historyContainer.find('ul')

  const cacheData = getCache()
  if(cacheData) {
    $ul.html(cacheData)
  }

  const $searchInput = $('#searchbox')

  $ul.on('click', 'li', function(event){
    const text = $(this).text()
    $searchInput.val(text)
    doSearch()
    addItem()
  })

  let searchHistoryTimer
  $searchInput.on('input change', function(){
    clearInterval(searchHistoryTimer);
    searchHistoryTimer = setTimeout(addItem, 1000);//延迟400毫秒检索,减少性能浪费
  })

  $(document).on("click", ".tag_b", function() {
		setTimeout(addItem, 0)
	})

  function addItem() {
    const text = $searchInput.val()
    if(!text) return

    let $item = $ul.filter(function() {
      return $(this).text() === text;
    }).first()

    if($item.length === 0) {
      $item = $(`<li>${text}</li>`)
    }

    $ul.prepend($item)
    while($ul.children().length > maxSize) {
      $ul.children().last().remove()
    }
    setCache($ul.html())
  }

  function setCache(data) {
    return localStorage.setItem(cacheKey, JSON.stringify(data))
  }

  function getCache() {
    const data = localStorage.getItem(cacheKey)
    return data ? JSON.parse(data) : ''
  }


  const styleElement = document.createElement("style")

  // 设置样式内容
  styleElement.innerHTML =
`
#search-history {
  position: absolute;
  left: 60%;
  top: 54px;
  width: 650px;
  font-size: 14px;
  z-index: 999;
}
#search-history ul {
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.25em;
}
#search-history ul li {
  list-style: none;
  color: #fff;
  border: 1px solid #fff;
  border-radius: 999px;
  padding: 1px 8px;
  background-color: #ffffff11;
  cursor: pointer;
}
#search-history ul li:hover {
  background-color: #ffffff33;
}
`

  document.head.appendChild(styleElement)

})();
