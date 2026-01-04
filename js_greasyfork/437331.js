// ==UserScript==
// @name         抖店-多功能脚本
// @version      1.5
// @description  一键复制订单信息，批量显示隐藏信息，一键下载订单
// @author       羊种草 VX:YANG706597125
// @match        https://fxg.jinritemai.com/ffa/*
// @icon         https://lf1-fe.ecombdstatic.com/obj/eden-cn/upqphj/homepage/icon.svg
// @grant        GM_xmlhttpRequest
// @namespace    doudian-plus
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/437331/%E6%8A%96%E5%BA%97-%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/437331/%E6%8A%96%E5%BA%97-%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

async function getShopName() {
  if(!document.querySelector('div.headerShopName')){
      return false
  }

  return document.querySelector('div.headerShopName').innerText
}

function toCsvString(dataList) {
  let rows = []
  let headers1 = ['extOrderId', 'orderTime', 'sourceType']
  let productHeaders = ['title', 'sku', 'unitPrice', 'number']
  let headers = ['payAmount', 'nickname', 'contactName', 'contactPhone', 'contactAddress', 'contact', 'status', 'shop_remark', 'buyer_remark']
  let headersStr = ['订单编号', '下单时间', '推广类型', '商品', '商品规格', '商品价格', '商品数量', '商品金额', '买家昵称', '收件人姓名', '收件人手机号', '收件地址', '收件人信息', '订单状态', '商家备注', '买家留言']
  rows.push(headersStr)
  for (let d of dataList) {
    for (let p of d.products) {
        let row = []
        for (let h of headers1) {
            row.push(d[h])
        }
        for (let ph of productHeaders) {
            row.push(p[ph])
        }
        for (let h of headers) {
            row.push(d[h])
        }
        rows.push(row)
    }
  }
 rows = rows.map(row => {
   return row.map(s => `"${s}"`).join(',')
 }).join('\n')
 return 'data:text/csv;charset=utf-8,\ufeff' + rows
}

// 将订单 div里的内容处理成对象
function extractOrderDiv(div) {
  let resp = {}
  let header = div.querySelector('div[class^="index_rowHeader"] > div[class^="index_RowHeader"] > div[class^="index_leftWrapper"]')
  let spanList = header.querySelectorAll('span')
  if (spanList.length >= 1) {
    resp.orderId = spanList[0].innerText.match(/订单编号\s*(\d+)/)[1]
    resp.extOrderId = "'"+spanList[0].innerText.match(/订单编号\s*(\d+)/)[1]
  }
  if (spanList.length >= 2) {
    resp.orderTime = spanList[1].innerText.match(/下单时间\s*([\d\/ :]+)/)[1]
  }
  if (spanList.length >= 3) {
    resp.sourceType = spanList[2].innerText.match(/推广类型：\s*(.*)/)[1]
  } else {
      resp.sourceType = '-'
  }

  // content
  //let content = div.querySelector('div:nth-of-type(2)')
  resp.products = []
  let products = div.querySelectorAll('div[class^="index_cellCol"] > div[class^="index_cellRow"]')
  if(products) {
      for (let p of products) {
          let productsItem = {}
          productsItem.title = p.querySelector('div[class^="style_detail"] > div[class^="style_name"]').innerText
          productsItem.sku =  p.querySelector('div[class^="style_property"] > div[class^="style_desc"]').innerText
          productsItem.unitPrice = p.querySelector('div[class^="index_cell"]:nth-of-type(2) > div[class^="table_comboAmount"]').innerText
          productsItem.number = p.querySelector('div[class^="index_cell"]:nth-of-type(2) > div[class^="table_comboNum"]').innerText
          resp.products.push(productsItem)
      }
  }

  resp.payAmount = div.querySelector('div[class^="index_payAmount"]').innerText
  resp.nickname = div.querySelector('a[class^="table_nickname"]').innerText
  resp.contact = div.querySelector('div[class^="index_locationDetail"]').innerText
  resp.contact = resp.contact.myReplace(',','').myReplace('#','')
  let contactList = resp.contact.split('\n')
  if (contactList.length >= 3) {
    resp.contactName = contactList[0].myReplace(',','').myReplace('#','')
    resp.contactPhone = contactList[1]
    resp.contactAddress = contactList[2].myReplace(',','').myReplace('#','')
  }
  resp.status = div.querySelector('div:nth-of-type(2) > div[class^="index_cell"]:nth-of-type(4) > div:first-of-type').innerText
  resp.status_id = div.getAttribute('data-kora_order_status')

  let footer = div.querySelector('div[class^="index_footer"]')
  resp.shop_remark = ''
  resp.buyer_remark = ''
  if(footer){
      let footerContent = footer.querySelectorAll('div[class^="index_footerContent"]')
      for (let remarkdiv of footerContent) {
          let remartext = remarkdiv.innerText;
          if(remartext.indexOf('商家备注') > -1){
              resp.shop_remark = remartext.myReplace('商家备注\n','')
          }
          if(remartext.indexOf('买家留言') > -1){
              resp.buyer_remark = remartext.myReplace('买家留言\n','')
          }
      }
  }
  return resp
}

//下载订单
async function downloadCurrentPage() {
  let divList = document.querySelectorAll('div.auxo-spin-container > div:nth-of-type(2) > div > div[data-kora_order_status]')
  let dataList = []
  for (let div of divList) {
    let data = extractOrderDiv(div)
    //console.log(data)
    dataList.push(data)
  }
  const csvString = toCsvString(dataList)
  let shopName = await getShopName()
  var nowDate = new Date();
  var date = nowDate.getFullYear()+ '_' + (nowDate.getMonth()+1) + '_' +nowDate.getDate() + '_' + nowDate.getHours() + '_' + nowDate.getMinutes() + '_'+ nowDate.getSeconds();
  let link = document.createElement('a')
  link.setAttribute('href', csvString)
  let filename = `${shopName}-订单-${date}`
  link.setAttribute('download', filename + '.csv')
  link.click()
}

// 添加“下载订单”按钮
async function addDownloadButton() {
  console.log('增加下载订单按钮')
   if(!document.querySelector('div[class^="index_middle-bar-wrapper"] div[class^="index_batchOpWrap"] div[class^="index_buttonGroup"]')){
       return false
   }

  let div = document.querySelector('div[class^="index_middle-bar-wrapper"] div[class^="index_batchOpWrap"] div[class^="index_buttonGroup"]')

  var divDplus = document.createElement('div');
  divDplus.className = 'auxo-alert auxo-alert-warning'
  divDplus.style = 'margin-bottom: 10px;border: 2px solid red;'
  var divDplusButtonGroup = document.createElement('div');
  divDplusButtonGroup.className = 'index_buttonGroup__1tLG2 index_batchOperation'
  divDplus.appendChild(divDplusButtonGroup)


  let btn = div.querySelector('button').cloneNode(true)
  btn.setAttribute('data-id', '下载订单')
  btn.setAttribute('_cid', 'export-orders')
  btn.innerHTML = `<span>下载订单</span>`
  btn.className = 'auxo-btn auxo-btn-primary auxo-btn-sm index_button__fQrwe'
  divDplusButtonGroup.appendChild(btn)

  btn.onclick = (e) => {
    downloadCurrentPage()
  }

  let btn2 = div.querySelector('button').cloneNode(true)
  btn2.setAttribute('data-id', '批量显示加密信息')
  btn2.setAttribute('_cid', 'show-orders-info')
  btn2.innerHTML = `<span>批量显示加密信息</span>`
  btn2.className = 'auxo-btn auxo-btn-primary auxo-btn-sm index_button__fQrwe'
  divDplusButtonGroup.appendChild(btn2)
  btn2.onclick = (e) => {
    console.log('批量查看隐藏信息')
    showUserAddress()
  }

  let btn3 = div.querySelector('button').cloneNode(true)
  btn3.setAttribute('data-id', '添加复制订单按钮')
  btn3.setAttribute('_cid', 'update-button')
  btn3.innerHTML = `<span>添加复制订单按钮</span>`
  btn3.className = 'auxo-btn auxo-btn-primary auxo-btn-sm index_button__fQrwe'
  divDplusButtonGroup.appendChild(btn3)
  btn3.onclick = (e) => {
    console.log('添加复制按钮')
    addCopyOrderInfoButton()
  }
  document.querySelector('div[class^="index_middle-bar-wrapper"]').appendChild(divDplus)
}

//添加复制订单信息按钮
async function addCopyOrderInfoButton() {
  console.log("增加复制订单信息按钮")
  if(!document.querySelector('div.auxo-spin-container > div:nth-of-type(2) > div > div[data-kora_order_status]')){
    return false
  }
  let divList = document.querySelectorAll('div.auxo-spin-container > div:nth-of-type(2) > div > div[data-kora_order_status]')
  //console.log(divList)
  for (let div of divList) {
    let tableRowId   = div.getAttribute('id')
    let btnDiv = document.querySelector('div[class^="index_middle-bar-wrapper"] div[class^="index_batchOpWrap"] div[class^="index_buttonGroup"]')
    let btn = btnDiv.querySelector('button').cloneNode(true)
    let divHeader = div.querySelector('div[class^="index_rowHeader"] div[class^="index_RowHeader"]')
    let haveCopyBtn = divHeader.querySelector('button[data-id="复制订单"]')
    if(haveCopyBtn == null){
        btn.setAttribute('data-id', '复制订单')
        btn.setAttribute('_cid', 'copy-order-info')
        btn.className = 'auxo-btn auxo-btn-primary auxo-btn-sm index_button__fQrwe'
        btn.innerHTML = `<span>复制订单信息</span>`
        divHeader.appendChild(btn)
        btn.onclick = (e) => {
            copyOrderInfo(tableRowId)
        }
    }
  }
  showTips('添加复制订单按钮完成')
}

// 批量显示敏感信息
function showUserAddress () {
    console.log('批量显示敏感信息')
    let divList = document.querySelectorAll('div.auxo-spin-container > div:nth-of-type(2) > div > div[data-kora_order_status]')
    for (let div of divList) {
           setTimeout(function (){
               let data = extractOrderDiv(div)
               if(data['status_id'] !== '4'){
                   let showDiv = div.querySelector('a[data-kora="查看敏感信息"]')
                   showDiv.click()
               }
           },1000)
    }
}

function copyOrderInfo (divid) {
    console.log('复制订单信息')
    let div = document.getElementById(divid);
    let data = extractOrderDiv(div)
    //console.log(data)
    let copyInfo = data['orderId'] + '\n' + data['orderTime'] + '\n' + data['contact'] +  '\n' + data['title'] +   ' ' +data['sku'] +  '\n' + data['status']
    var c = copyMgr(copyInfo);
    if(c){
        console.log('复制成功')
        showTips('复制成功')
    }else {
        console.log('复制失败!')
        showTips('复制失败!',2)
    }
}

function getJSON(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        },
        onload: function (response) {
            if (response.status >= 200 && response.status < 400) {
                callback(JSON.parse(response.responseText), url);
            } else {
                callback(false, url);
            }
        }
    });
}

function copyMgr(data) {
    var textarea = document.createElement('textarea');
    textarea.style = 'position:absolute;top: -150px;left:0;';
    document.body.appendChild(textarea);
    textarea.value = data;
    textarea.select();
    try {
        //进行复制到剪切板
        if (document.execCommand("Copy", "false", null)) {
            textarea.value = '';
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    }
}

async function addTableId() {
  console.log("增加列表 ID")
  if(!document.querySelector('div[class^="index_tableRow"]')){
    return false
  }
  let divList = document.querySelectorAll('div[class^="index_tableRow"]')
  for (let div of divList) {
      //console.log('addTableId',div)
      let data = extractOrderDiv(div)
      div.setAttribute('id', data['orderId'])
  }
}

String.prototype.myReplace=function(f,e){//吧f替换成e
    var reg=new RegExp(f,"g"); //创建正则RegExp对象
    return this.replace(reg,e);
}

function showTips (msg,type=1) {
   if(!document.querySelector('input[class^="auxo-input"]')){
       return false
   }
   let inputDiv =  document.querySelector('input[class^="auxo-input"]')
   if(type == 1){
       inputDiv.value = '✔️ '+msg
   } else {
       inputDiv.value = '❗ '+msg
   }

   setTimeout(function () {
     inputDiv.value = ''
   }, 3000);
}

function reflesh(){
    console.log('3秒后添加按钮')
   setTimeout(function (){
       addButton()
       let auxoDiv = document.querySelector('div[class^="index_RichTable"] div[class^="index_ListWithPagination"] div[class^="auxo-spin-container"]')
       auxoDiv.addEventListener("DOMSubtreeModified", function(){
             let divList = document.querySelectorAll('div[class^="index_tableRow"]')
             for (let div of divList) {
                  let data = extractOrderDiv(div)
                  div.setAttribute('id', data['orderId'])
             }
       }, false);
   }, 3000 )
}

//监视地址栏
function registerPopstate(){
    console.log('监听地址栏')
    window.addEventListener('popstate',function(e){
        var href = window.location.href
        if(href.indexOf('morder/order/list') > 0){
            console.log('匹配到 订单管理')
            reflesh()
        }
    })
}

function addButton () {
   console.log('添加按钮')
   addTableId()
   addDownloadButton()
   addCopyOrderInfoButton()
   setTimeout(function (){
   },10000)
}

(async function () {
    'use strict';
    registerPopstate()
})();