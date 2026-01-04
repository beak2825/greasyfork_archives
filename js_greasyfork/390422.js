// ==UserScript==
// @name         驴妈妈分销价格导入阿目云
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  驴妈妈价格 导入→ 阿目云产品，适用于【门票】【酒店套餐】【自由行】【酒店】品类
// @author       ╮(╯▽╰)╭
// 门票
// @include      http://f.lvmama.com/scenic/product/scenic_product_detail.html?productId=*
// 酒店套餐  自由行
// @include      http://f.lvmama.com/route/product/preview.do/*
// 酒店
// @include      http://f.lvmama.com/hotel/preview.do/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.16/vue.js
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/390422/%E9%A9%B4%E5%A6%88%E5%A6%88%E5%88%86%E9%94%80%E4%BB%B7%E6%A0%BC%E5%AF%BC%E5%85%A5%E9%98%BF%E7%9B%AE%E4%BA%91.user.js
// @updateURL https://update.greasyfork.org/scripts/390422/%E9%A9%B4%E5%A6%88%E5%A6%88%E5%88%86%E9%94%80%E4%BB%B7%E6%A0%BC%E5%AF%BC%E5%85%A5%E9%98%BF%E7%9B%AE%E4%BA%91.meta.js
// ==/UserScript==
;/* jshint esversion: 6 */
/* nacl.js 
 * author: NaCl 黄盐
 * mail: woolition@gmail.com
 * last-modify: 2019-6-9
 */
/* jshint esversion:6 */
var Nacl = (function(){
  let O = {};
  /* 基本的查找元素方法 */
  O.q = function(cssSelector){
    return document.querySelector(cssSelector);
  };
  O.qs = function(cssSelector){
    return document.querySelectorAll(cssSelector);
  };
  /* 格式化日期 */
  O.formatDate = (date, offset=0, spliter='-')=>{
    if(!(new Date(date) instanceof Date)) {
      console.log("NaCl Hint: 传入日期有问题");
      return;
    }
    let t = new Date(new Date(date).getTime() + 86400000*offset);
    // yyyy-mm-dd
    return `${t.getFullYear()}${spliter}${t.getMonth()+1 >9 ? t.getMonth()+1 : '0'+(t.getMonth()+1)}${spliter}${t.getDate() >9 ? t.getDate() : '0'+t.getDate()}`;
  };

  /* 格式化时间，在日期基础上扩展 */
  O.formatTime = function(date,spliter=':'){
    if(!(new Date(date) instanceof Date)) {
      console.log("NaCl Hint: 传入日期有问题");
      return;
    }
    let t = new Date(date);
    return `${O.formatDate(date)} ${t.getHours()>9 ? t.getHours() : '0'+t.getHours()}${spliter}${t.getMinutes()>9 ? t.getMinutes() : '0'+t.getMinutes()}${spliter}${t.getSeconds()>9 ? t.getSeconds() : '0'+t.getSeconds()}`;
  };
  
  /* 进入全屏 */
  O.fullScreen = function(cssSelector){
    let ele = document.querySelector(cssSelector) || document.documentElement;
    if (ele.requestFullscreen) {
      ele.requestFullscreen();
    } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
    } else if (ele.webkitRequestFullScreen) {
      ele.webkitRequestFullScreen();
    }
  };
  /* 退出全屏 */
  O.exitFullscreen = function (cssSelector) {
    let ele = document.querySelector(cssSelector) || document.documentElement;
    if (ele.exitFullscreen) {
        ele.exitFullscreen();
    } else if (ele.mozCancelFullScreen) {
        ele.mozCancelFullScreen();
    } else if (ele.webkitCancelFullScreen) {
        ele.webkitCancelFullScreen();
    }
  };
 
  /* 简单克隆，一般json对象复制应该没有问题 */
  O.cloneJsonObject = function(obj){
    return JSON.parse(JSON.stringify(obj));
  };

  return O;
})();// jshint esversion:6
const Amuyun = {
  setCalendarURL: "http://erp.himudidi.com/product_calendar/set_calendar.html",

  // 设置价格日历，在调用这个函数之前，应该做好数据校验的工作
  // setCalendar: function ({productId, cost, stock, days}, callback) {
  setCalendar: function (dataJson, callback) {
    let postString = `product_id%5B%5D=${dataJson.productId}&items%5B0%5D%5Bcost%5D=${dataJson.cost}&items%5B0%5D%5Bstock%5D=${dataJson.stock}`;
    for(const day of dataJson.days){
      // 这里可以考虑用 Array.join() 来代替
      postString += `&items%5B0%5D%5Bdate%5D%5B%5D=${day}`;
    }
    // console.log(postString);
    GM_xmlhttpRequest({
      url: this.setCalendarURL,
      method: "POST",
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; boundary=&; charset=UTF-8' },
      responseType: "json",
      data: postString,
      onload: function (data) { callback(data); },
      onerror: function(data) { callback(data); }
    });


  }
};

// setTimeout(()=>{
//   console.log(3333333333333);
//   Amuyun.setCalendar({
//     productId: 1123,
//     cost: 234,
//     stock: 5,
//     days: ['2019-09-22','2019-09-23','2019-09-24']
//   });
// }, 3000);
// jshint esversion:6
(function () {
  $ = unsafeWindow.jQuery;  //网站本身有，就不用引用外部资源了

  GM_addStyle(`
    .icon-export:before {
      padding: 2px 8px;
      line-height:16px;
      width: 1.5em; display: inline-block;
      content: url("data:image/svg+xml,%3Csvg class='icon' style='width:1em;height:1em;vertical-align:middle' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' fill='currentColor' overflow='hidden'%3E%3Cpath d='M888.3 757.4h-53.8c-4.2 0-7.7 3.5-7.7 7.7v61.8H197.1V197.1h629.8v61.8c0 4.2 3.5 7.7 7.7 7.7h53.8c4.2 0 7.7-3.4 7.7-7.7V158.7c0-17-13.7-30.7-30.7-30.7H158.7c-17 0-30.7 13.7-30.7 30.7v706.6c0 17 13.7 30.7 30.7 30.7h706.6c17 0 30.7-13.7 30.7-30.7V765.1c0-4.3-3.5-7.7-7.7-7.7zm18.6-251.7L765 393.7c-5.3-4.2-13-.4-13 6.3v76H438c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h314v76c0 6.7 7.8 10.5 13 6.3l141.9-112c4.1-3.2 4.1-9.4 0-12.6z'/%3E%3C/svg%3E");
    }
    .icon-export:hover:before { background: #fc4e28; color: white; cursor: pointer; border-radius: 5px; }
    #priceSortBlock { z-index: 20000; width: 500px; height: 95%; overflow: auto; background: white; position: fixed; top: 0; resize: both; border: 2px solid #0088DD; padding: 1em; }
    #sortResult tr,
    #sortResult td { border-collapse: collapse; border: 2px solid #DDDDDD; padding: 5px; }
    #priceSortMenu .menuSpan { display: inline-block; border: 1px solid #888; padding: 3px; margin: 2px 0px; border-radius: 3px; }
    #priceSortMenu input[type='checkbox'] { display: none; }
    #priceSortMenu input[type='date'] { width: 100px; }
    #priceSortMenu input[type='text'] { width: 100px; }
    #sortResult .span-price { color: #f80; font-size: 1.5em; font-weight: bolder; }
    #priceSortBlock b { display: inline-block; border: 1px solid #FF8800; border-radius: 2px; padding: 1px 3px; margin: 2px; }
    #priceSortBlock .menuButton { background: #0088dd; color: white; border-radius: 3px; padding: 3px 5px; cursor: pointer; }
    .update-success { background: yellowgreen !important; }
    .update-fail { background: #fc4e28 !important; }
    .exportPrice2Amuyun{ cursor: pointer; text-decoration: underline !important; }
    .exportPrice2Amuyun:hover:after{ content:attr(data-title); padding: 2px 4px; color: #333; background: white; position: absolute; white-space: nowrap; z-index: 1000; border-radius: 3px; box-shadow: 0px 0px 2px 2px #222; }
  `);

  // 添加导出价格按钮
  window.priceCheckTimer = setInterval(() => {
    let productType = getProductType();
    let l = addExportPriceButton[productType](productType);
    console.log('length', l);
    if(l){
      clearInterval(priceCheckTimer);
      $('.exportPrice2Amuyun').on('click', exportPrice2View);
    }else{
      console.log("导出价格到阿目云初始化进行中，请稍候...");
    }
  }, 1000);

  // 添加导出价格按钮
  let addExportPriceButton = {
    saleUnitId: function(productType){
      $("#mp dd.ticket_fxj_fx").attr("data-type",productType).addClass("exportPrice2Amuyun").attr("data-title","导价到阿目云");
      return $("#mp dd.ticket_fxj_fx").length;
    },
    sellPackageId: function(productType){
      $("#packageTableDiv span.fx_price").attr("data-type",productType).addClass("exportPrice2Amuyun").attr("data-title","导价到阿目云");
      return $("#packageTableDiv span.fx_price").length;
    },
    goodsId: function(productType){
      $('div.fx_hotel_date_list_inner div.hotel_fxj.fl').attr("data-type",productType).addClass("exportPrice2Amuyun").attr("data-title","导价到阿目云");
      return $('div.fx_hotel_date_list_inner div.hotel_fxj.fl').length;
    },
  };

  // 判断产品类型
  function getProductType(){
    let productType = '';
    if(new RegExp("f.lvmama.com/scenic/product/scenic_product_detail.html\\?productId=").test(location.href)){
      productType = "saleUnitId";  // 门票
    }else if(new RegExp("f.lvmama.com/route/product/preview.do/*").test(location.href)){
      productType = "sellPackageId";  // 自由行+酒店套餐
    }else if(new RegExp("f.lvmama.com/hotel/preview.do/").test(location.href)){
      productType = "goodsId";  // 酒店
    }
    return productType;
  }
  // 获取价格到视图
  async function exportPrice2View(element){
    let packageId = '';
    let getPriceType = element.target.dataset.type;
    if(getPriceType == "saleUnitId"){
      packageId = $(element.target).parent().parent().find('dt.ticket_no_fx').text().trim();
    }else if(getPriceType == "sellPackageId"){
      packageId = $(element.target).parent().parent().find('td.w1.c_9').text().trim();
    }else if(getPriceType == "goodsId"){
      packageId = $(element.target).parent().find('em.fx_hotel_num').text().trim();
    }
    // console.log(packageId);
    let priceArr = await priceBlock.getPrice[getPriceType](packageId);
    let sortPriceResult = priceBlock.sortPrice[getPriceType](priceArr);
    priceBlock.updatePriceSortVuePriceDays(sortPriceResult);
  }

  // 价格区块对象
  var priceBlock = {
    priceSortVue: null,
    // 初始化价格分组视图
    initSortView: function(){
      $('body').append(`
        <div id="priceSortBlock" v-if="visible">
          <div id="priceSortMenu">
          <span @click="closePanel" class="menuButton">关闭</span>
          <!-- 这里条件筛选还没有调好，暂时不开放 
          <span id="weekday" class="menuSpan">
            <label v-for="weekday in weekdays" :for="'weekday'+weekday.k">
              <input type="checkbox" :value="weekday.k" :id="'weekday'+weekday.k">{{weekday.t}}
            </label>
          </span>
          <span class="menuSpan"><input type="date" name="startDate" v-model="startDate"></span>
          <span class="menuSpan"><input type="date" name="endDate" v-model="endDate"></span><br/>
          -->
          <span name="amuyunId" class="menuSpan">
            <input type="text" id="amuyunId" v-model="amuyunId" placeholder="阿目云产品ID">
          </span>
          <span name="stock" class="menuSpan">
            <input type="text" id="stock" v-model="stock" placeholder="库存">
          </span>
          <span @click="export2Amuyun" class="menuButton">导出到阿目云</span>
          </div>
          <table id="sortResult">
            <tr class="li-price" v-for="days,price in priceDays">
              <td class="span-price">￥{{parseInt(price)}}</td>
              <td class="span-days">
                <b  v-for="day in days" :data-day="day">{{day.slice(5)}}</b>
              </td>
            </tr>
          </table>
        </div>
      `);

      this.priceSortVue = new Vue({
        el: "#priceSortBlock",
        data:{
          weekdays: [{k:0, t:'日'}, {k:1, t:'一'}, {k:2, t:'二'}, {k:3, t:'三'}, {k:4, t:'四'}, {k:5, t:'五'}, {k:6, t:'六'}],
          startDate: new Date(),
          endDate: new Date(),
          amuyunId: null,
          stock: '',
          priceDays: {},
          visible: false
        },
        methods: {
          export2Amuyun: function(){
            if(!this.amuyunId){
              alert("没有商品ID (→_→)");
              return false;
            }
            if(!this.stock){
              let stock = prompt('建议设置库存哦(→_→)', '');
              this.stock = stock ? stock : '';
            }
            let postData = {
              productId: this.amuyunId,
              stock: this.stock
            };
            for(const i of Object.keys(this.priceDays)){
              try {
                postData.cost = parseInt(i);
                postData.days = this.priceDays[i];
                Amuyun.setCalendar(postData, (res)=>{
                  // console.log(res);
                  if(res.response.status){
                    for(const day of this.priceDays[i]){
                      $(`b[data-day=${day}]`).addClass("update-success");
                    }
                  }else{
                    for(const day of this.priceDays[i]){
                      $(`b[data-day=${day}]`).addClass("update-fail");
                    }
                    console.log(res);
                  }
                }); 
              } catch (error) {
                console.log(`export2Amuyun priceGroup(￥${i}) Error:\n`,error);
              }
            }
            // 更新完一个套餐之后，清楚产品ID，防止重复导入价格
            console.log(`上次更新的产品ID是[${this.amuyunId}]`);
            this.amuyunId = null;
          },
          closePanel: function(){
            this.visible = false;
          },
          showPanel: function(){
            this.visible = true;
          }
        }
      });

    },
    // 获取驴妈妈价格
    getPrice: {
      // 【门票】价格
      saleUnitId: function (saleUnitId) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            headers: {"Content-Type": "application/json;charset=UTF-8"},
            url: "http://f.lvmama.com/scenic/timeprice/query",
            method: "POST",
            responseType: 'json',
            data: JSON.stringify({
              packType: "UN_PACK",
              raiseRule: null,
              saleUnitId: saleUnitId,
              startDate: Nacl.formatDate(new Date()),
              userId: $('#userId').val()
            }),
            onload: function (response) {
              // console.log(response.response);
              if (response.response) {
                // 真正的成功
                resolve(response.response.timePriceVoList);
              } else {
                console.log(response.response);
                resolve([]);
              }
            },
            onerror: function (response) {
              console.log(response);
              resolve([]);
            }
          });
        });
      },
      // [酒店套餐][自由行]价格
      sellPackageId: function (sellPackageId) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
            url: "http://f.lvmama.com/route/product/findProductTimePriceList",
            method: "POST",
            responseType: 'json',
            data: `specDate=${$('#preorder-start-time').val()}&userId=${$('#userId').val()}&sellPackageId=${sellPackageId}`,
            onload: function (response) {
              if (response.response) {
                // 真正的成功
                resolve(response.response);
              } else {
                console.log(response.response);
                resolve([]);
              }
            },
            onerror: function (response) {
              console.log(response);
              resolve([]);
            }
          });
        });
      },
      // 【酒店】价格
      goodsId: function(goodsId) {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
            url: "http://f.lvmama.com/hotel/findGoodsAddTimePriceList",
            method: "POST",
            responseType: 'json',
            data: `goodsId=${goodsId}&userId=${$('#userId').val()}`,
            onload: function (response) {
              if (response.response) {
                // 真正的成功
                resolve(response.response);
              } else {
                console.log(response.response);
                resolve([]);
              }
            },
            onerror: function (response) {
              console.log(response);
              resolve([]);
            }
          });
        });
      },
    },
    // 对获取的价格，进行分组
    sortPrice: {
      saleUnitId: function(priceArray){
        let priceGroup = {};
        for(const i of priceArray){
          if(priceGroup.hasOwnProperty(String(i.tradePriceYuan))){
            priceGroup[String(i.tradePriceYuan)].push(i.specDateText);
          }else{
            priceGroup[String(i.tradePriceYuan)] = [i.specDateText]
          }
        }
        return priceGroup;
      },
      sellPackageId: function(priceArray){
        let priceGroup = {};
        for(const i of priceArray){
          if(priceGroup.hasOwnProperty(i.distPriceYuan.slice(0,-3))){
            priceGroup[i.distPriceYuan.slice(0,-3)].push(i.specDateStr);
          }else{
            priceGroup[i.distPriceYuan.slice(0,-3)] = [i.specDateStr]
          }
        }
        return priceGroup;
      },
      goodsId: function(priceArray){
        let priceGroup = {};
        for(const i of priceArray){
          if(priceGroup.hasOwnProperty(String(i.auditPrice))){
            priceGroup[String(i.auditPrice)].push(i.arrivalDate);
          }else{
            priceGroup[String(i.auditPrice)] = [i.arrivalDate]
          }
        }
        return priceGroup;
      },
    },
    // 更新 Vue 的价格数据
    updatePriceSortVuePriceDays: function (sortPriceResult) {
      Vue.set(this.priceSortVue, "priceDays", sortPriceResult);
      $(`b[data-day]`).removeAttr("class");
      this.priceSortVue.showPanel();
    }

  };

  // 生成价格区块
  priceBlock.initSortView();
//=========END===========
})();