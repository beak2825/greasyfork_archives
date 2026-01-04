// ==UserScript==
// @name                Get Rank in Taobao
// @description         Get product search rank in taobao.com

// @author              lib
// @namespace           https://lib.org
// @homepageURL         https://greasyfork.org/zh-CN/scripts/391705-get-rank-in-taobao
// @supportURL          https://github.com/ace1573/tb-rank
// @license             MIT

// @include             /^https?://s.taobao.com/search\?.+/
// @grant               none
// @run-at              document-idle

// @date                29/10/2019
// @modified            12/11/2019
// @version             0.0.6
// @downloadURL https://update.greasyfork.org/scripts/391705/Get%20Rank%20in%20Taobao.user.js
// @updateURL https://update.greasyfork.org/scripts/391705/Get%20Rank%20in%20Taobao.meta.js
// ==/UserScript==


! function() {
  "use strict";

  //插入界面
  document.body.insertAdjacentHTML('beforeend', `
  <div style="position: fixed; background:#FFF; border:2px solid #EFEFEF; border-radius: 5px; padding: 20px; top: 5%; right: 3%;">
    <textarea id="_rnk_products" rows="5" cols="30" placeholder="商品id[空格]商品名[回车]...">
605123552435 原酿
605804603913 生姜
605124940227 黑糯米
    </textarea>
    <br>
    <button id="_rnk_start" style="padding: .2em 2em;">start</button>
    <br><br>
    <div id="_rnk_result" style="font-size: 1.2em; font-weight: bold; color: red;"></div>
  </div>
  `);
  
  //点击事件
  document.getElementById('_rnk_start').onclick = ()=>{
    getRanks().then()
  }

  
}();


//返回的当前页数
async function getCurrPage(){

  while(!document.querySelector('.m-page li.active span.num')){
    await _sleep(100)
  }

  //访问验证
  while(document.querySelector(".sufei-tb-dialog:not(.sufei-tb-dialog-hidden)")){
    await _sleep(200)
  }

  let node = document.querySelector('.m-page li.active span.num')
  let page = node.innerHTML
  console.log('curr page', page)
  return parseInt(page)
}
//取初始化数据
function getDatas(){
  if(window.__rnk_datas) return window.__rnk_datas

  //初始化
  let result = window.__rnk_datas = { products: {}, ranks: {} }
  result.products = getProductFromInput()
  return result
}
//解析输入
function getProductFromInput(){
  let products = {}
  try {
    let _rnk_products = document.getElementById('_rnk_products').value
    for(let item of _rnk_products.split('\n')){
      let arr = item.split(/\s+/g)
      let key = arr[0].trim()
      let val = arr[1].trim()
      if(key) products[key] = val
    }
  } catch (error) {
    alert(`输入格式错误`)
    throw error
  }
  return products
}


//.m-page li.active span.num //当前页
//.m-page li.next a 下一页

//遍历商品获取排名
async function getRanks(){
  let currPage = await getCurrPage()

  //产品 排名
  let { products, ranks } = getDatas()

  console.log(`products`, products)

  let list = document.querySelectorAll('#mainsrp-itemlist .pic-box-inner .pic a')
  
  let invalidCount = 0//无效商品数
  for(let i=0; i<list.length; i++){
    let item = list[i]
    if(!item.href){
      invalidCount++
      continue
    }
    let id = item.getAttribute('data-nid')
    if(!id){
      invalidCount++
      continue
    }
    if(products[id]){
      ranks[id] = { page: currPage, rank: (i + 1 - invalidCount) }
    }
  }

  
  //是否搜索完毕
  let result = [], finished = true
  for(let key in products){
    if(!ranks[key]){
      finished = false
      continue
    }
    result.push(`${products[key]}: 第${ranks[key].page}页 第${ranks[key].rank}条`)
  }
  
  //显示结果
  document.getElementById('_rnk_result').innerHTML = result.join('<br>')

  let nextPageNode = document.querySelector('.m-page li.next a')
  if(finished || currPage > 100 || !nextPageNode){
    if(!result.length) return alert(`搜索完毕 没有找到结果`)
    alert('搜索完毕 查看--->')
  }else{//保存起来
    console.log('curr result', result)
    console.log('to next page')

    await _sleep(800)//延时
    nextPageNode.click()//下一页

    await _sleep(500)
    await getRanks()
  }
}

//睡眠
function _sleep(mills){
  return new Promise((resolve,reject)=>{
    setTimeout(resolve, mills)
  })
}
//获取url参数
function _getUrlParam(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}