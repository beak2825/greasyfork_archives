// ==UserScript==
// @name        解除创意工坊软锁
// @namespace   LinHQ1999
// @match       https://store.steampowered.com/account/preferences
// @version     1.0.1
// @author      LinHQ
// @license     AGPLv3
// @description 尽力而为，不做任何保证
// @downloadURL https://update.greasyfork.org/scripts/474852/%E8%A7%A3%E9%99%A4%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E8%BD%AF%E9%94%81.user.js
// @updateURL https://update.greasyfork.org/scripts/474852/%E8%A7%A3%E9%99%A4%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E8%BD%AF%E9%94%81.meta.js
// ==/UserScript==

(() => {
  const sessionid = document.cookie.split(';').find(x => x.includes('sessionid'))?.trim() ?? undefined
  if (!sessionid) {
    return alert('没有登录！')
  }
  const header = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest'},
    url = 'https://store.steampowered.com/account/savecontentdescriptorpreferences',
    params = {
      hd1_store: `hidden_descids_store%5B%5D=3&hidden_descids_community%5B%5D=1&hidden_descids_community%5B%5D=4&hidden_descids_community%5B%5D=3&${sessionid}`,
      hd1_community: `hidden_descids_store%5B%5D=3&hidden_descids_community%5B%5D=3&${sessionid}`,
      hd2_store: `hidden_descids_community%5B%5D=3&${sessionid}`,
      hd2_community: `${sessionid}`
    }
  Promise.all(Object.values(params).map(param => fetch(url, {
    method: 'POST',
    headers: header,
    body: param
  }))
  ).then((resps) => {
    if (resps.every(resp => resp.ok)) {
      if (confirm('完成！点击确定直接关闭此页面！')) window.close()
    }
  }).catch(() => {
    alert('看上去这个方法已经失效了！')
  })
})()
