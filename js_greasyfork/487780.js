// ==UserScript==
// @name        《复制·零贰式》
// @namespace   Violentmonkey Scripts
// @match       https://detail.1688.com/offer/*.html
// @match       https://www.dianxiaomi.com/smtProduct/edit.htm
// @grant       GM_xmlhttpRequest
// @require     https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @grant       none
// @license     MIT
// @version     0.0.1
// @author      -
// @description 2023/12/13 11:00:42
// @downloadURL https://update.greasyfork.org/scripts/487780/%E3%80%8A%E5%A4%8D%E5%88%B6%C2%B7%E9%9B%B6%E8%B4%B0%E5%BC%8F%E3%80%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/487780/%E3%80%8A%E5%A4%8D%E5%88%B6%C2%B7%E9%9B%B6%E8%B4%B0%E5%BC%8F%E3%80%8B.meta.js
// ==/UserScript==

function CountPrice(price){
  price = parseFloat(price);
  console.debug(price);
  //=====================//
  //在这里抒写你的售价计算公式//
  //=====================//
  //
  //下面两个二选一，注释掉就可以了
  //
  //这是预先写的速卖通运营部计算公式
  // let C5 = price / 6.9;
  // let D5 = C5 + 0.2;
  // let E5 = D5 * 0.03;
  // let _price = (D5+E5+0.02)*1.45;
  // _price = _price * 7.3;


  //虾皮嵌入到了店小秘网页，所以这里直接原貌返回price
  _price = price;


  //到此为止
  return _price.toFixed(2);
}


function h(a) {
  function b(a, b) {
      return a << b | a >>> 32 - b
  }
  function c(a, b) {
      var c, d, e, f, g;
      return e = 2147483648 & a,
      f = 2147483648 & b,
      c = 1073741824 & a,
      d = 1073741824 & b,
      g = (1073741823 & a) + (1073741823 & b),
      c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
  }
  function d(a, b, c) {
      return a & b | ~a & c
  }
  function e(a, b, c) {
      return a & c | b & ~c
  }
  function f(a, b, c) {
      return a ^ b ^ c
  }
  function g(a, b, c) {
      return b ^ (a | ~c)
  }
  function h(a, e, f, g, h, i, j) {
      return a = c(a, c(c(d(e, f, g), h), j)),
      c(b(a, i), e)
  }
  function i(a, d, f, g, h, i, j) {
      return a = c(a, c(c(e(d, f, g), h), j)),
      c(b(a, i), d)
  }
  function j(a, d, e, g, h, i, j) {
      return a = c(a, c(c(f(d, e, g), h), j)),
      c(b(a, i), d)
  }
  function k(a, d, e, f, h, i, j) {
      return a = c(a, c(c(g(d, e, f), h), j)),
      c(b(a, i), d)
  }
  function l(a) {
      for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i; )
          b = (i - i % 4) / 4,
          h = i % 4 * 8,
          g[b] = g[b] | a.charCodeAt(i) << h,
          i++;
      return b = (i - i % 4) / 4,
      h = i % 4 * 8,
      g[b] = g[b] | 128 << h,
      g[f - 2] = c << 3,
      g[f - 1] = c >>> 29,
      g
  }
  function m(a) {
      var b, c, d = "", e = "";
      for (c = 0; 3 >= c; c++)
          b = a >>> 8 * c & 255,
          e = "0" + b.toString(16),
          d += e.substr(e.length - 2, 2);
      return d
  }
  function n(a) {
      a = a.replace(/\r\n/g, "\n");
      for (var b = "", c = 0; c < a.length; c++) {
          var d = a.charCodeAt(c);
          128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192),
          b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
          b += String.fromCharCode(d >> 6 & 63 | 128),
          b += String.fromCharCode(63 & d | 128))
      }
      return b
  }
  var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21;
  for (a = n(a),
  x = l(a),
  t = 1732584193,
  u = 4023233417,
  v = 2562383102,
  w = 271733878,
  o = 0; o < x.length; o += 16)
      p = t,
      q = u,
      r = v,
      s = w,
      t = h(t, u, v, w, x[o + 0], y, 3614090360),
      w = h(w, t, u, v, x[o + 1], z, 3905402710),
      v = h(v, w, t, u, x[o + 2], A, 606105819),
      u = h(u, v, w, t, x[o + 3], B, 3250441966),
      t = h(t, u, v, w, x[o + 4], y, 4118548399),
      w = h(w, t, u, v, x[o + 5], z, 1200080426),
      v = h(v, w, t, u, x[o + 6], A, 2821735955),
      u = h(u, v, w, t, x[o + 7], B, 4249261313),
      t = h(t, u, v, w, x[o + 8], y, 1770035416),
      w = h(w, t, u, v, x[o + 9], z, 2336552879),
      v = h(v, w, t, u, x[o + 10], A, 4294925233),
      u = h(u, v, w, t, x[o + 11], B, 2304563134),
      t = h(t, u, v, w, x[o + 12], y, 1804603682),
      w = h(w, t, u, v, x[o + 13], z, 4254626195),
      v = h(v, w, t, u, x[o + 14], A, 2792965006),
      u = h(u, v, w, t, x[o + 15], B, 1236535329),
      t = i(t, u, v, w, x[o + 1], C, 4129170786),
      w = i(w, t, u, v, x[o + 6], D, 3225465664),
      v = i(v, w, t, u, x[o + 11], E, 643717713),
      u = i(u, v, w, t, x[o + 0], F, 3921069994),
      t = i(t, u, v, w, x[o + 5], C, 3593408605),
      w = i(w, t, u, v, x[o + 10], D, 38016083),
      v = i(v, w, t, u, x[o + 15], E, 3634488961),
      u = i(u, v, w, t, x[o + 4], F, 3889429448),
      t = i(t, u, v, w, x[o + 9], C, 568446438),
      w = i(w, t, u, v, x[o + 14], D, 3275163606),
      v = i(v, w, t, u, x[o + 3], E, 4107603335),
      u = i(u, v, w, t, x[o + 8], F, 1163531501),
      t = i(t, u, v, w, x[o + 13], C, 2850285829),
      w = i(w, t, u, v, x[o + 2], D, 4243563512),
      v = i(v, w, t, u, x[o + 7], E, 1735328473),
      u = i(u, v, w, t, x[o + 12], F, 2368359562),
      t = j(t, u, v, w, x[o + 5], G, 4294588738),
      w = j(w, t, u, v, x[o + 8], H, 2272392833),
      v = j(v, w, t, u, x[o + 11], I, 1839030562),
      u = j(u, v, w, t, x[o + 14], J, 4259657740),
      t = j(t, u, v, w, x[o + 1], G, 2763975236),
      w = j(w, t, u, v, x[o + 4], H, 1272893353),
      v = j(v, w, t, u, x[o + 7], I, 4139469664),
      u = j(u, v, w, t, x[o + 10], J, 3200236656),
      t = j(t, u, v, w, x[o + 13], G, 681279174),
      w = j(w, t, u, v, x[o + 0], H, 3936430074),
      v = j(v, w, t, u, x[o + 3], I, 3572445317),
      u = j(u, v, w, t, x[o + 6], J, 76029189),
      t = j(t, u, v, w, x[o + 9], G, 3654602809),
      w = j(w, t, u, v, x[o + 12], H, 3873151461),
      v = j(v, w, t, u, x[o + 15], I, 530742520),
      u = j(u, v, w, t, x[o + 2], J, 3299628645),
      t = k(t, u, v, w, x[o + 0], K, 4096336452),
      w = k(w, t, u, v, x[o + 7], L, 1126891415),
      v = k(v, w, t, u, x[o + 14], M, 2878612391),
      u = k(u, v, w, t, x[o + 5], N, 4237533241),
      t = k(t, u, v, w, x[o + 12], K, 1700485571),
      w = k(w, t, u, v, x[o + 3], L, 2399980690),
      v = k(v, w, t, u, x[o + 10], M, 4293915773),
      u = k(u, v, w, t, x[o + 1], N, 2240044497),
      t = k(t, u, v, w, x[o + 8], K, 1873313359),
      w = k(w, t, u, v, x[o + 15], L, 4264355552),
      v = k(v, w, t, u, x[o + 6], M, 2734768916),
      u = k(u, v, w, t, x[o + 13], N, 1309151649),
      t = k(t, u, v, w, x[o + 4], K, 4149444226),
      w = k(w, t, u, v, x[o + 11], L, 3174756917),
      v = k(v, w, t, u, x[o + 2], M, 718787259),
      u = k(u, v, w, t, x[o + 9], N, 3951481745),
      t = c(t, p),
      u = c(u, q),
      v = c(v, r),
      w = c(w, s);
  var O = m(t) + m(u) + m(v) + m(w);
  return O.toLowerCase()
}

class getInfo{
  //这个是主要的类
  isFreeShip(){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['freeDeliverFee'];
      }
    }
  }
  getWeight(){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['freightInfo']['unitWeight'];
      }
    }
  }
  getToken(){
    let cookie = document.cookie;
    cookie = cookie.split(";");
    for (var c of cookie){
      c = c.trim();
      c = c.split('=');
      if(c[0] === "_m_h5_tk"){
        return c[1].split('_')[0];
      }
    }
  }
  getFreeEndAmount(){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['freeEndAmount'];
      }
    }
  }
  getTempId(){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['freightInfo']['subTemplateId'];
      }
    }
  }
  getOfferId(){
    let href = window.location.href;
    href = href.split("?")[0];
    href = href.split("/")[href.split("/").length - 1];
    offerId = href.split(".")[0];
    return offerId;
  }
  sendAddressCode(){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['sendAddressCode'];
      }
    }
  }
  getOfficialLogistics(){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['officialLogistics'];
      }
    }
  }
  getSellerLoginId(){
    return __STORE_DATA['globalData']['sellerLoginId'];
  }
  getSkuWeight(){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['skuWeight'];
      }
    }
  }
  getSkuMap(){
    let SkuMap = __INIT_DATA['globalData']['skuModel']['skuInfoMap'];
      //如果全部商品都是统一价格，就会把每个变种统一设置为固定的价格
    for (var sku in SkuMap){
      if(SkuMap[sku].price === undefined){
        SkuMap[sku].price = __INIT_DATA['globalData']['skuModel'].skuPriceScale;
        SkuMap[sku].discountPrice = __INIT_DATA['globalData']['skuModel'].skuPriceScale;
      }
    }
    if (SkuMap.length <= 1){
      SkuMap = "null"
    }
    return SkuMap;
  }
}
function initScen(){
  //初始化场景
  for (let skuItem of document.getElementsByClassName("sku-item-wrapper")){
    let key = ((skuItem[Object.keys(skuItem)[0]])['return'])['key'];
    let price = $(skuItem).find(".discountPrice-price").text()
    // price = price.substring(0,price.length-1);
    $(skuItem).attr('key',key);
    $(skuItem).attr('price',price);
  }
  var skuM = new getInfo().getSkuMap();
  for (let sku of Object.values(skuM)){
    let item = document.querySelector(`.sku-item-wrapper[key="${sku.specId}"]`);
    if (item != undefined){
      $(item).attr("skuId",sku.skuId);
    }
  }
}
function copy(node,context) {
  let transfer = document.createElement("input");
  node.appendChild(transfer);
  transfer.value = context;
  transfer.focus();
  transfer.select();
  if (document.execCommand('copy')){
    document.execCommand('copy');
  }
  transfer.blur();
  node.removeChild(transfer);
}
async function getShipPrice(numb,skuId,price,AddressCode = "440300"){
  //这个用来获取商品的运费
  let url = "https://h5api.m.1688.com/h5/mtop.1688.freightinfoservice.getfreightinfowithscene/1.0/?";
  var _data = "data=";
  var data = "{";
  let href = window.location.href.split("?")[0];
  href = href.split("/")[href.split("/").length - 1];
  offerId = href.split(".")[0];
  let sendAddressCode = new getInfo().sendAddressCode();
  data += `"offerId":${offerId},`;
  data += `"sellerUserId":0,`;
  data += `"sendAddressCode":"${sendAddressCode}",`;
  data += `"receiveAddressCode":"${AddressCode}",`;
  data += `"freeEndAmount":${new getInfo().getFreeEndAmount()},`;
  data += `"pageScene":"dsc",`
  // data += `"skuCalParams":"[]",`;
  let officialLogistics = new getInfo().getOfficialLogistics();
  let unitWeight = new getInfo().getWeight();
  let sellerLoginId = new getInfo().getSellerLoginId();
  let templateId = new getInfo().getTempId();
  let skuWeiget = JSON.stringify(new getInfo().getSkuWeight());
  skuWeiget = skuWeiget.replaceAll("\"","\\\\\\\"");
  let ts = (new Date).getTime();
  if (skuId == undefined){
    data += `"skuCalParams":null,`;
  }else{
    data += `"skuCalParams":"[{\\"number\\":${numb},\\"skuId\\":${skuId},\\"price\\":\\"${price}\\"}]",`;
  }
  data += `"extendMap":"{\\"officialLogistics\\":${officialLogistics},\\"unitWeight\\":${unitWeight},\\"skuWeight\\":\\"${skuWeiget}\\",\\"sellerLoginId\\":\\"${sellerLoginId}\\",\\"templateId\\":${templateId},\\"amount\\":${numb}}"}`;
  url += `jsv=2.4.11&appKey=12574478&t=${ts}&sign=${getSign(ts,data)}&api=mtop.1688.freightInfoService.getFreightInfoWithScene&v=1.0&type=originaljson&isSec=0&timeout=20000&dataType=jsonp`;
  _data += encodeURIComponent(data);
  var FeeData = await makeRequests(url,_data);
  return JSON.parse(FeeData)['data']['totalCost'];
}
function makeRequests(_url,data){
  //这个函数配合await使用，其目的是等待请求完成再执行
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: _url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data,
      onload: function(response) {
        let rt = response.responseText;
        resolve(rt);
      }
    });
  });
}
function gotNumber(price){
  //这个函数可以通过价格分段判断采购数量
  let number = 1;
  if(price < 10){
    number = 10;
  }else if(price >= 10 && price <= 30){
    number = 5;
  }else if(price > 30 && price <= 60){
    number = 2;
  }
  return number;
}
function fixButton(){
  //这个函数用来修复面板上的按钮，因为每次选择变种类型的时候会清空掉所有节点
  let skulist = $("div.sku-item-wrapper");
  for (let sku of skulist){
    if ($(sku).find("div._copy_p").length < 1){
      let _div = $('<div class="_copy_p" ><a href="javascript:;">复制</a></div>');
      _div.css('padding','5px');
      _div.css('font-weight','bold');
      _div.css('height','fit-content');
      _div.on("click",function(){
        if (!(new getInfo().isFreeShip())){
          let price = parseFloat($(this).parents().parents().attr("price"));
          let skuId = $(this).parents().parents().attr("skuId");
          let number = gotNumber(price);
          (async function(node){
            let fixShipP = await getShipPrice(number,skuId,price);
            let do_price = (price * number + fixShipP) / number;
            console.debug((price * number + fixShipP) / number);
            copy(node,CountPrice(parseFloat(do_price)));
          })(this);
        }else{
          console.debug("包邮")
          copy(this,CountPrice(parseFloat(this.parentNode.parentNode.getAttribute("price"))));
        }
      });
      var sku_price_t = sku.querySelector(".discountPrice-price");
      sku_price_t.parentNode.insertBefore(_div.get(0),sku_price_t);
    }
  }
}

function getSign(stamp,data){
  //这个函数是用来获取数字签名的函数
  let token = new getInfo().getToken();
  let t = stamp;
  let href = window.location.href.split("?")[0];
  href = href.split("/")[href.split("/").length - 1];
  let offerId = href.split(".")[0];
  let memberId = __STORE_DATA['globalData']['memberId'];
  let d = data;
  let s = token + "&" + t + "&" + "12574478" + "&" + d;
  s = h(s);
  return s;
}
const showFinish = function(msg,color){
  //这个函数显示复制结果的
  if($('#thisCallbackMsg').length !== 0){
    var pre = $("thisCallbackMsg");
    pre.css("color",color);
    pre.text = msg;
  }
  else{
    var pre = $(`<span id='thisCallbackMsg' style="margin-left:5px;color:${color}">${msg}</span>`);
    $('div#justCopyDay').append(pre);
  }
}
async function copyAllItem(node){
  //这个函数来复制产品的变种和商品信息及计算后的价格
  let skuMap = new getInfo().getSkuMap(); //获取变种列表
  let imgUrlPool = (function (){
    var tmpList = {};
    for (var prop of __INIT_DATA['globalData']['skuModel']['skuProps']){
      for (i of prop.value){
        tmpList[i.name] = i.imageUrl;
      }
    }
    return tmpList;
  })();
  let shipFeeList = [];
  for (var sku in skuMap){
    var skuId = skuMap[sku].skuId;
    var price = skuMap[sku].price;
    var number = gotNumber(price);
    var main_prop = sku.split("gt;")[0];
    skuMap[sku]['skuMap'] = imgUrlPool[main_prop];
    shipFeeList.push(getShipPrice(number,skuId,price));
  }
  shipFeeList = await Promise.all(shipFeeList);
  var keys = Object.keys(skuMap);
  for (var index = 0;index < keys.length; index++){
    var my_price = skuMap[keys[index]].discountPrice
    var number = gotNumber(my_price);
    skuMap[keys[index]]['truePrice'] = (my_price * number + shipFeeList[index]) / number;
  }
  copy(node,JSON.stringify(skuMap));
  showFinish('复制成功','green');
}
if (window.location.href.includes("https://www.dianxiaomi.com/smtProduct/edit.htm")){
  window.onload = async function(){
    var _tr = $("<tr><td>粘贴到：<p id='checkback'></p></td><td id='minbox'></td></tr>");
    wrongMsg = $("<span class='fRed'>(暂时仅可选择一个变种属性，还可以选择强制的置入单位)</span>");
    $($("td.smtSkuAttribute")[0]).parent().before(_tr);
    var _div = $("<div></div>");
    data = `categoryId=${$("input#categoryId").attr('value')}`
    var AttrList = await makeRequests('https://www.dianxiaomi.com/smtCategory/attributeList.json',data);
    AttrList = JSON.parse(AttrList);
    AttrList = (()=>{
      var tmpList = [];
      for(attr of AttrList){
        if (attr.sku && attr.nameZh!=="发货地"){
          tmpList.push(attr);
        }
      }
      return tmpList
    })();
    function setINTO(attrId){
      var checkedList = $(`div#skuAttribute input[pid=${attrId}]`);
      for(var input of checkedList){
        $(input).attr("checked",true);
        smtSkuCheckboxClickFn(input,1);
      }
      console.log(checkedList);
    };
    var _tmpdiv = $("<div style='margin-bottom:5'></div>");
    var tmpMaxCount = 0;
    for (attrItem of AttrList){
      var values = JSON.parse(attrItem.values);
      var _input = $(`<input class="my_sku_attrs" data-id="${attrItem.arrtNameId}" style='margin-right:5px' len=${values.length} type='radio' onclick=$("input.my_sku_attrs").attr("checked",false);this.checked=true>`);
      if (values.length > tmpMaxCount){
        _input.attr("checked","true");
        tmpMaxCount = values.length;
      }
      var _tmpLable = $(`<lable class="myAttrId" style="margin:5px"></lable>`);
      _tmpLable.append(_input);
      _tmpLable.append($(`<span>${attrItem.nameZh}</span><span class='fRed'> (可容载${values.length}个单位)</span>`));
      _tmpdiv.append(_tmpLable);
    }
    _div.append($('<p>选择一个可以容载变种的属性:</p>'));
    _div.append(_tmpdiv);
    _div.append(wrongMsg);
    var _bnt_div = $("<div></div>")
    var _bnt = $("<button class='button btn-determine mLeft10')>置入</button>")
    _bnt.on("click",function(){
      setINTO($('lable.myAttrId input[checked]').attr('data-id'));
    });
    _bnt_div.append(_bnt);
    $('#minbox').append(_div);
    $('#minbox').css("display","grid");
    $('#minbox').css("grid-template-columns","1fr 1fr");
    $('#minbox').append(_bnt_div);
  }();
}
else{
  window.onload = async function(){
    await function(){
      return new Promise((r)=>{
        setTimeout(function(){
          var _div = $('<div id="justCopyDay"></div>');
          var _a = $('<a href="javascript:;">复制全部</a>');
          _a.css('padding','5px');
          _a.css('width','fit-content');
          _a.css('font-weight','bold');
          _a.on("click",function(){
            copyAllItem(this);
          });
          _a.on("mouseover",function(){
            _a.css("background",'yellow');
          });
          _a.on("mouseout",function(){
            _a.css("background",'white');
          });
          _div.append(_a);
          $('div.layout-two-columns-main div.layout-right').append(_div);
          r();
        },1000);    //创建底部的 “复制全部” 的按钮
      });
    }();    //加载完成后隔一秒钟执行
    initScen();     //一秒后运行，因为网页还没有初始化数据结束
    fixButton();
    let sku_c = document.getElementById("sku-count-widget-wrapper");
    const config = { childList: true };
    const observer = new MutationObserver((mutationss) => {
      mutationss.forEach((mutationn) => {
        if (mutationn.type === 'childList') {
          observer.disconnect();
          initScen();
          fixButton();
          observer.observe(sku_c,config);
        }
      });
    });
    observer.observe(sku_c,config);
  }();
}