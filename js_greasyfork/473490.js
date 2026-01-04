// ==UserScript==
// @name        1688-Price
// @namespace   Violentmonkey Scripts
// @match       https://detail.1688.com/offer/*.html
// @grant       GM_xmlhttpRequest
// @version     0.2.3
// @author      Yang.Mr
// @icon        https://img.alicdn.com/imgextra/i1/O1CN01hK1DRp1P4wwhobTES_!!6000000001788-2-tps-200-200.png
// @license     MIT
// @description 2023/5/19 23:13:47
// @downloadURL https://update.greasyfork.org/scripts/473490/1688-Price.user.js
// @updateURL https://update.greasyfork.org/scripts/473490/1688-Price.meta.js
// ==/UserScript==
function CountPrice(price){
  price = parseFloat(price);
  //=====================//
  //在这里抒写你的售价计算公式//
  //=====================//

  //这是预先写的速卖通运营部计算公式
  let C5 = price / 6.6;
  let D5 = C5 + 0.2;
  let E5 = D5 * 0.03;
  let _price = (D5+E5+0.02)*1.45;
  _price = _price * 7.5;

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
function getSign(stamp,data){
  let token = getInfo("getToken");
  let t = stamp;
  let href = window.location.href.split("?")[0];
  href = href.split("/")[href.split("/").length - 1];
  let offerId = href.split(".")[0];
  let memberId = __STORE_DATA['globalData']['memberId'];
  // let d = `{"cid":"PmCertOfferQueryService:PmCertOfferQueryService","methodName":"execute","params":"{\\"offerId\\":${offerId},\\"type\\":\\"queryCertsOfOffer\\",\\"memberId\\":\\"${memberId}\\",\\"mbrId\\":\\"${memberId}\\"}"}`;
  let d = data;
  let s = token + "&" + t + "&" + "12574478" + "&" + d;
  s = h(s);
  return s;
}
function getInfo(flag){
  if (flag === "isFreeShip"){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['freeDeliverFee'];
      }
    }
  }
  else if (flag === "getWeight"){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['freightInfo']['unitWeight'];
      }
    }
  }
  else if (flag === "getToken"){
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
  else if (flag === "getFreeEndAmount"){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['freeEndAmount'];
      }
    }
  }
  else if (flag === "getTempId"){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['freightInfo']['subTemplateId'];
      }
    }
  }
  else if (flag === "getOfferId"){
    let href = window.location.href;
    href = href.split("?")[0];
    href = href.split("/")[href.split("/").length - 1];
    offerId = href.split(".")[0];
    return offerId;
  }
  else if (flag === "sendAddressCode"){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['sendAddressCode'];
      }
    }
  }
  else if (flag === "getOfficialLogistics"){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['officialLogistics'];
      }
    }
  }
  else if (flag === "getSellerLoginId"){
    return __STORE_DATA['globalData']['sellerLoginId'];
  }
  else if (flag === "getSkuWeight"){
    for(var data of Object.values(__INIT_DATA['data']).values()){
      if(data['componentType'].split("-")[data['componentType'].split("-").length - 1] === "logistics"){
        return data['data']['skuWeight'];
      }
    }
  }
  else if (flag === "getSkuMap"){
    let SkuMap = __INIT_DATA['globalData']['skuModel']['skuInfoMap'];
    if (SkuMap.length <= 1){
      SkuMap = "null"
    }
    return SkuMap;
  }
}
function getFixjsonData(_url,data){
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
async function getFixShipPrice(numb,skuId,price,AddressCode = "440300"){
  let url = "https://h5api.m.1688.com/h5/mtop.1688.freightinfoservice.getfreightinfowithscene/1.0/?";
  var _data = "data=";
  var data = "{";
  let href = window.location.href.split("?")[0];
  href = href.split("/")[href.split("/").length - 1];
  offerId = href.split(".")[0];
  let sendAddressCode = getInfo("sendAddressCode");
  data += `"offerId":${offerId},`;
  data += `"sellerUserId":0,`;
  data += `"sendAddressCode":"${sendAddressCode}",`;
  data += `"receiveAddressCode":"${AddressCode}",`;
  data += `"freeEndAmount":${getInfo("getFreeEndAmount")},`;
  data += `"pageScene":"dsc",`
  // data += `"skuCalParams":"[]",`;
  let officialLogistics = getInfo("getOfficialLogistics");
  let unitWeight = getInfo("getWeight");
  let sellerLoginId = getInfo("getSellerLoginId");
  let templateId = getInfo("getTempId");
  let skuWeiget = JSON.stringify(getInfo("getSkuWeight"));
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
  //_data += data;
  // window.open(url);
  var FeeData = await getFixjsonData(url,_data);
  return JSON.parse(FeeData)['data']['totalCost'];
}
function fixButton(){
  let skulist =document.getElementsByClassName("sku-item-wrapper");
  for (let sku of skulist){
    if (sku.getElementsByClassName("_copy_p").length < 1){
      let _div = document.createElement("div");
      let _copy_btn = document.createElement("button");
      _copy_btn.appendChild(document.createTextNode("复制"));
      _copy_btn.className = "_copy_p";
      _div.style.border = "1px solid black";
      _div.style.borderRadius = "3px";
      _div.style.padding = "1px";
      _div.style.height= "fit-content";
      _div.addEventListener("mouseover", function(){
        this.style.backgroundColor = "#ededed";
      });
      _div.addEventListener("mouseout", function(){
        this.style.backgroundColor = "white";
      });
      _div.addEventListener("mousedown", function(){
        this.style.backgroundColor = "#cccccc";
      });
      _div.addEventListener("mouseup", function(){
        this.style.backgroundColor = "#ededed";
      });
      _copy_btn.style.display = "contents";
      _copy_btn.style.position = "absolute";
      _copy_btn.style.lineHeight = "initial";
      _div.addEventListener("click",function(){
        if (!getInfo("isFreeShip")){
          let price = parseFloat(this.parentNode.parentNode.getAttribute("price"));
          let skuId = this.parentNode.parentNode.getAttribute("skuId");
          let number = 1;
          if (price < 10){
            number = 10;
          }else if (price >=10 && price <= 30){
            number = 5;
          }else if (price > 30 && price <=60){
            number = 2;
          }
          async function getSp(node){
            let fixShipP = await getFixShipPrice(number,skuId,price);
            let do_price = (price * number + fixShipP) / number;
            console.debug((price * number + fixShipP) / number);
            copy(node,CountPrice(parseFloat(do_price)));
          }
          getSp(this);
        }else{
          copy(this,CountPrice(parseFloat(this.parentNode.parentNode.getAttribute("price"))));
        }
      });
      _div.appendChild(_copy_btn);
      var sku_price_t = sku.querySelector(".discountPrice-price");
      sku_price_t.parentNode.insertBefore(_div,sku_price_t);
    }
  }
}
function makeScen(){
  for (let skuItem of document.getElementsByClassName("sku-item-wrapper")){
    let key = ((skuItem[Object.keys(skuItem)[0]])['return'])['key'];
    let price = skuItem.querySelector(".discountPrice-price").innerHTML;
    price = price.substring(0,price.length-1)
    skuItem.setAttribute('key',key);
    skuItem.setAttribute('price',price);
  }
  var skuM = getInfo("getSkuMap");
  for (let sku of Object.values(skuM)){
    let item = document.querySelector(`.sku-item-wrapper[key="${sku.specId}"]`);
    if (item != undefined){
      item.setAttribute("skuId",sku.skuId);
    }
  }
}
window.onload = function(){
  // document.getElementsByClassName("sku-wrapper-expend-button")[0].click();
  makeScen()
  // for (let skuItem of document.getElementsByClassName("sku-item-wrapper")){
  //   let sku = skuItem.getElementsByClassName("sku-item-left")[0];
  //   sku = sku.getElementsByClassName("sku-item-name")[0].innerHTML;
  //   skuItem.setAttribute('item-name',sku);
  // }
  // var skuM = getInfo("getSkuMap");
  // if (skuM != undefined){
  //   for (let sku of Object.values(skuM)){
  //     let d = document.querySelector(`.sku-item-wrapper[item-name="${sku.name}"]`)
  //     let price = sku.price;
  //     if (price == undefined){
  //       let l = d.querySelector(".discountPrice-price");
  //       price = d.querySelector(".discountPrice-price").innerHTML;
  //       price = price.substring(0,price.length-1)
  //     }
  //     d.setAttribute("price",price);
  //     d.setAttribute("skuId",sku.skuId);
  //   }
  // }else{
  //   for (let skuItem of document.getElementsByClassName("sku-item-wrapper")){
  //     let sku = skuItem.getElementsByClassName("sku-item-left")[0];
  //     sku = sku.getElementsByClassName("sku-item-name")[0].innerHTML;
  //     skuItem.setAttribute('status',false);
  //   }
  // }
  let sku_c = document.getElementById("sku-count-widget-wrapper");
  fixButton();
  const config = { childList: true };
  const observer = new MutationObserver((mutationss) => {
    mutationss.forEach((mutationn) => {
      if (mutationn.type === 'childList') {
        observer.disconnect();
        makeScen();
        fixButton();
        observer.observe(sku_c,config);
      }
    });
  });
  observer.observe(sku_c,config);
}