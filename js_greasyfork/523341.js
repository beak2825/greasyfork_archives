// ==UserScript==
// @name        bing.com自动搜索
// @namespace   Violentmonkey Scripts
// @match       https://cn.bing.com/search*
// @grant       none
// @version     1.3.0
// @license     MIT
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @author      -
// @description 2025/1/2 11:33:11
// @downloadURL https://update.greasyfork.org/scripts/523341/bingcom%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/523341/bingcom%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
let titleArr = []
function getTitle (n) {
  $.ajax({
    type: "get",
    url: `https://api.rebang.today/v1/items?tab=top&sub_tab=today&page=${n}&version=1`,
    data: {},
    dataType: "json",
    success: function (data) {
      if (data && data.code == '200') {
        let list = JSON.parse(data.data.list || '[]')
        titleArr = titleArr.concat(list.map(item => item.title))
      } else {
        alert(data[0].message)
      }
    },
    error: function (data, status, e) {
      alert("数据访问错误，请重试")
    }
  })
}
let havedTitles = JSON.parse(localStorage.getItem('titleArrStorage') || '[]')
if (havedTitles.length === 0) {
  getTitle(1)
  getTitle(2)
  getTitle(3)
  setTimeout(() => {
    console.log(titleArr)
    localStorage.setItem('titleArrStorage', JSON.stringify(titleArr))
  }, 2000)
} else {
  titleArr = havedTitles
  console.log(titleArr)
}
let no = Math.floor(Math.random() * 60)
let name = titleArr[no]
titleArr.splice(no, 1);
setInterval(() => {
  var a = `https://cn.bing.com/search?q=${name}&form=QBLH&sp=-1&lq=0&pq=10086&sc=12-5&qs=n&sk=&cvid=A4303C066C324E4CBD90E7CA7E3E1FEF&ghsh=0&ghacc=0&ghpl=`
  location.href = a
}, 10000)