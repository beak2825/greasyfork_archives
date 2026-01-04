// ==UserScript==
// @name         csq用
// @name:zh      csq用
// @name:zh-TW   csq用
// @namespace    csqUse
// @version      1.0.0
// @namespace    csqUse
// @description  csqUse
// @description:zh  csqUse
// @description:zh-TW  csqUse
// @author       hhp
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.setClipboard
// @grant        GM_info
// @grant        GM.xmlHttpRequest
// @grant        GM.openInTab
// @grant        GM.addValueChangeListener
// @grant        GM.removeValueChangeListener
// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.0/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.7.3/build/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @match        *://detail.tmall.hk/*
// @match        *://chaoshi.detail.tmall.com/*
// @match        *://item.jd.com/*
// @match        *://npcitem.jd.hk/*
// @match        *://item.yiyaojd.com/*
// @match        *://detail.vip.com/*
// @match        *://www.vipglobal.hk/detail*
// @match        *://www.gwdang.com/v2/trend/*
// @match        *://www.wezhicms.com/index/Tools/index*
// @connect      www.gwdang.com
// @connect      tool.wezhicms.com
// @license      GNU GPLv3
// @antifeature       referral-link 【应GreasyFork代码规范要求：含有优惠券查询功能的脚本必须添加此提示！在此感谢大家的理解...】
// @downloadURL https://update.greasyfork.org/scripts/479709/csq%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479709/csq%E7%94%A8.meta.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
        /******/
        /******/ 		// Check if module is in cache
        /******/ 		if(installedModules[moduleId]) {
            /******/ 			return installedModules[moduleId].exports;
            /******/ 		}
        /******/ 		// Create a new module (and put it into the cache)
        /******/ 		var module = installedModules[moduleId] = {
            /******/ 			i: moduleId,
            /******/ 			l: false,
            /******/ 			exports: {}
            /******/ 		};
        /******/
        /******/ 		// Execute the module function
        /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/ 		// Flag the module as loaded
        /******/ 		module.l = true;
        /******/
        /******/ 		// Return the exports of the module
        /******/ 		return module.exports;
        /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// define getter function for harmony exports
    /******/ 	__webpack_require__.d = function(exports, name, getter) {
        /******/ 		if(!__webpack_require__.o(exports, name)) {
            /******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
            /******/ 		}
        /******/ 	};
    /******/
    /******/ 	// define __esModule on exports
    /******/ 	__webpack_require__.r = function(exports) {
        /******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            /******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
            /******/ 		}
        /******/ 		Object.defineProperty(exports, '__esModule', { value: true });
        /******/ 	};
    /******/
    /******/ 	// create a fake namespace object
    /******/ 	// mode & 1: value is a module id, require it
    /******/ 	// mode & 2: merge all properties of value into the ns
    /******/ 	// mode & 4: return value when already ns object
    /******/ 	// mode & 8|1: behave like require
    /******/ 	__webpack_require__.t = function(value, mode) {
        /******/ 		if(mode & 1) value = __webpack_require__(value);
        /******/ 		if(mode & 8) return value;
        /******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
        /******/ 		var ns = Object.create(null);
        /******/ 		__webpack_require__.r(ns);
        /******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
        /******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
        /******/ 		return ns;
        /******/ 	};
    /******/
    /******/ 	// getDefaultExport function for compatibility with non-harmony modules
    /******/ 	__webpack_require__.n = function(module) {
        /******/ 		var getter = module && module.__esModule ?
            /******/ 			function getDefault() { return module['default']; } :
        /******/ 			function getModuleExports() { return module; };
        /******/ 		__webpack_require__.d(getter, 'a', getter);
        /******/ 		return getter;
        /******/ 	};
    /******/
    /******/ 	// Object.prototype.hasOwnProperty.call
    /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";
    /******/
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(__webpack_require__.s = 0);
    /******/ })
/************************************************************************/
/******/ ([
    /* 0 */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _coupon_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
      /* harmony import */ var _menu_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
      /* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(29);
      /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);





      let initData = {
          qqGroup:"",
          qqGroupText:'',
          scanUrl:'http://tool.wezhicms.com/coupon/getscan.php',
          cmsUrl:'http://wxego.yhzu.cn/',
          wenkuCode:696852,
          taobao:{
              text:"淘宝",
              couponNode:'#J_StepPrice',
              titleClass:'.tb-main-title',
              priceClass:'#J_SellCounter',
              attrClass: '.attributes-list',
              brandName:['品牌'],
              typeName:['型号','货号'],
          },
          tianmao:{
              text:"淘宝",
              couponNode:'.Promotion--root--3qHQalP',
              titleClass:'.ItemHeader--mainTitle--3CIjqW5',
              priceClass:'.Price--priceText--2nLbVda'
          },
          chaoshi:{
              text:"淘宝",
              couponNode:'.Promotion--root--3qHQalP',
              titleClass:'.ItemHeader--mainTitle--3CIjqW5',
              priceClass:'.ItemHeader--salesDesc--srlk2Hv'
          },
          jd:{
              text:"京东",
              couponNode:'#J-summary-top',
              titleClass:'.sku-name',
              priceClass:'.p-price>.price'
          },
          vip:{
              text:"唯品会",
              couponNode:'#J_product_delivery',
              titleClass:'.pib-title-detail',
              priceClass:'.sp-price'
          }
      }
      let page = '',fpid='';
      const host = window.location.host

      function init(){
          switch(host){
              case 'item.taobao.com':
                  page = 'taobao'
                  fpid = '83'
                  addCoupon()
                  addMenu()
                  break
              case 'chaoshi.detail.tmall.com':
                  page = 'chaoshi'
                  fpid = '8'
                  addCoupon()
                  addMenu()
                  break
              case 'detail.tmall.com':
              case 'detail.tmall.hk':
                  page = 'tianmao'
                  fpid = '83'
                  addCoupon()
                  addMenu()
                  break
              case 'item.yiyaojd.com':
              case 'item.jd.com':
              case 'npcitem.jd.hk':
                  page = 'jd'
                  fpid = '3'
                  addCoupon()
                  addMenu()
                  break
              case 'detail.vip.com':
              case 'www.vipglobal.hk':
                  page = 'vip'
                  fpid = '129'
                  addCoupon()
                  addMenu()
                  break
              case 'www.gwdang.com':
                  getCookie()
                  break
              case 'www.wezhicms.com':
                  Object(_utils__WEBPACK_IMPORTED_MODULE_3__["listenNode"])('#code').then(node=>{
                      node.value = initData.wenkuCode
                      node.placeholder = '验证码是'+initData.wenkuCode
                  })
                  break
          }
      }


      async function getCookie(){
          let cookie = document.cookie
          for(let i=0;i<10;i++){
              if(cookie.indexOf('fp=')=== -1||cookie.indexOf('dfp=')=== -1||cookie.indexOf('Hm_lvt')=== -1||cookie.indexOf('Hm_lvt')=== -1){
                  cookie = await Object(_utils__WEBPACK_IMPORTED_MODULE_3__["getPromise"])('cookie')
              }else{
                  Object(_utils__WEBPACK_IMPORTED_MODULE_3__["GMsetValue"])('gwdangCookie',cookie)
                  window.close()
                  return null
              }
              if(i === 9){
                  window.close()
              }
          }

      }

      function addCoupon(){
          const id = Object(_utils__WEBPACK_IMPORTED_MODULE_3__["createId"])('coupon')
          const html = `<div id="${id}"></div>`
//监听节点，然后挂载
Object(_utils__WEBPACK_IMPORTED_MODULE_3__["listenNode"])(initData[page].couponNode).then(node=>{
    node.insertAdjacentHTML('beforebegin',html)
    const app = Vue.createApp(_coupon_vue__WEBPACK_IMPORTED_MODULE_0__["default"])
    // 配置全局变量 页面中使用 inject 接收
    app.provide('global',{
        page,
        fpid,
        initData
    })
    app.mount(`#${id}`)
})

}

  function addMenu(){
      const id = Object(_utils__WEBPACK_IMPORTED_MODULE_3__["createId"])('menu')
      let node = document.createElement('div')
      node.id = id
      node.style = 'position: fixed;bottom: 0;left: 0;right: 0;z-index:99999999'
      document.body.appendChild(node)
      const Vue =  __webpack_require__(4)
      const app = Vue.createApp(_menu_vue__WEBPACK_IMPORTED_MODULE_1__["default"])
      // 配置全局变量 页面中使用 inject 接收
      app.provide('global',{
          page,
          fpid,
          initData
      })
      app.mount(`#${id}`)
  }

  init();

  /***/ }),
  /* 1 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _coupon_vue_vue_type_template_id_04c2ab82__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
      /* harmony import */ var _coupon_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
      /* empty/unused harmony star reexport *//* harmony import */ var F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
      /* harmony import */ var F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2__);





      const __exports__ = /*#__PURE__*/F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_2___default()(_coupon_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_coupon_vue_vue_type_template_id_04c2ab82__WEBPACK_IMPORTED_MODULE_0__["render"]],['__file',"src/coupon.vue"]])
      /* hot reload */
      if (false) {}


      /* harmony default export */ __webpack_exports__["default"] = (__exports__);

      /***/ }),
  /* 2 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_vue_loader_16_8_3_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_coupon_vue_vue_type_template_id_04c2ab82__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
      /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_16_8_3_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_coupon_vue_vue_type_template_id_04c2ab82__WEBPACK_IMPORTED_MODULE_0__["render"]; });



      /***/ }),
  /* 3 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);


      const _hoisted_1 = {
          key: 0,
          style: {"background-image":"url(https://gw.alicdn.com/tfs/TB16d.1ykPoK1RjSZKbXXX1IXXa-665-115.png)","position":"relative","font-family":"HelveticaNeue-Bold,Helvetica Neue","width":"426px","height":"75px","background-size":"100%,100%","background-repeat":"no-repeat","margin":"10px 0 10px 10px","display":"flex","align-items":"center"}
      }
      const _hoisted_2 = {
          key: 0,
          style: {"font-size":"28px","line-height":"28px","font-weight":"900","white-space":"nowrap"}
      }
      const _hoisted_3 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("text", { style: {"font-size":"20px"} }, "优惠券:", -1 /* HOISTED */)
      const _hoisted_4 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("text", { style: {"font-size":"18px","margin-right":"2px"} }, "￥", -1 /* HOISTED */)
      const _hoisted_5 = {
          key: 1,
          style: {"font-size":"22px","font-weight":"900","white-space":"nowrap"}
      }
      const _hoisted_6 = {
          key: 2,
          style: {"margin-top":"5px"}
      }
      const _hoisted_7 = {
          key: 3,
          style: {"margin-top":"5px"}
      }
      const _hoisted_8 = { style: {"text-align":"center","width":"calc(100% - 279px)","font-size":"20px","color":"#fff","font-weight":"bold","letter-spacing":"1px","cursor":"pointer"} }
      const _hoisted_9 = ["href"]
      const _hoisted_10 = { style: {"position":"absolute","display":"none","right":"426px","padding-right":"5px","top":"-10px","width":"124px","z-index":"999999"} }
      const _hoisted_11 = { style: {"text-align":"center","padding":"12px 5px 8px","background":"#fff","background-color":"#fff","border":"1px solid rgba(0, 0, 0, 0.08)","-webkit-box-shadow":"0 12px 24px 0 rgb(0 0 0%)","-moz-box-shadow":"0 12px 24px 0 rgb(0 0 0%)","box-shadow":"0 12px 24px 0 rgb(0 0 0%)","border-radius":"12px"} }
      const _hoisted_12 = { style: {"margin":"0 auto","width":"100px"} }
      const _hoisted_13 = ["src"]
      const _hoisted_14 = { style: {"margin-top":"4px"} }
      const _hoisted_15 = {
          key: 1,
          style: {"background-image":"url(https://gw.alicdn.com/tfs/TB16d.1ykPoK1RjSZKbXXX1IXXa-665-115.png)","position":"relative","font-family":"HelveticaNeue-Bold,Helvetica Neue","width":"426px","height":"75px","background-size":"100%,100%","background-repeat":"no-repeat","margin":"10px 0 10px 10px","display":"flex","align-items":"center"}
      }
      const _hoisted_16 = { style: {"width":"279px","color":"#fff","padding-left":"20px","box-sizing":"border-box"} }
      const _hoisted_17 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", { style: {"font-size":"22px","font-weight":"900","white-space":"nowrap"} }, "暂无优惠券", -1 /* HOISTED */)
      const _hoisted_18 = { style: {"margin-top":"5px"} }

      function render(_ctx, _cache, $props, $setup, $data, $options) {
          return ($setup.data.isLoad)
              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_1, [
              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", {
                  style: {"width":"279px","color":"#fff","padding-left":"20px","box-sizing":"border-box"},
                  onMouseover: _cache[0] || (_cache[0] = $event => ($setup.data.isQrCodeShow = true)),
                  onMouseout: _cache[1] || (_cache[1] = $event => ($setup.data.isQrCodeShow = false))
              }, [
                  ($setup.data.hasCoupon)
                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_2, [
                      _hoisted_3,
                      _hoisted_4,
                      Object(vue__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.data.couponMoney), 1 /* TEXT */)
                  ]))
                  : (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_5, "满" + Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.data.price) + "减0元", 1 /* TEXT */)),
                  ($setup.data.hasCoupon)
                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_6, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.data.couponUseTime), 1 /* TEXT */))
                  : (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_7, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.initData.qqGroupText + $setup.initData.qqGroup), 1 /* TEXT */))
              ], 32 /* HYDRATE_EVENTS */),
              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_8, [
                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("a", {
                      target: "_blank",
                      href: $setup.initData.scanUrl+'?link='+$setup.data.shortUrl+'&platform='+encodeURIComponent($setup.data.platform),
                      style: {"text-decoration":"none","color":"#fff"}
                  }, "领券购买", 8 /* PROPS */, _hoisted_9)
              ]),
              Object(vue__WEBPACK_IMPORTED_MODULE_0__["withDirectives"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_10, [
                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_11, [
                      Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_12, [
                          Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("img", {
                              style: {"width":"100px"},
                              src: 'http://v.zhihupe.com/enQrcode?url='+$setup.data.shortUrl
                          }, null, 8 /* PROPS */, _hoisted_13)
                      ]),
                      Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_14, "手机" + Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.initData[$setup.page].text) + "扫一扫，享优惠", 1 /* TEXT */)
                  ])
              ], 512 /* NEED_PATCH */), [
                  [vue__WEBPACK_IMPORTED_MODULE_0__["vShow"], $setup.data.isQrCodeShow&&$setup.data.shortUrl]
              ])
          ]))
          : (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_15, [
              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_16, [
                  _hoisted_17,
                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_18, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.initData.qqGroupText + $setup.initData.qqGroup), 1 /* TEXT */)
              ]),
              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", { style: {"text-align":"center","width":"calc(100% - 279px)","font-size":"20px","color":"#fff","font-weight":"bold","letter-spacing":"1px","cursor":"pointer"} }, [
                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("span", {
                      onClick: $setup.search,
                      style: {"text-decoration":"none","color":"#fff"}
                  }, "搜同款优惠")
              ])
          ]))
      }

      /***/ }),
  /* 4 */
  /***/ (function(module, exports) {

      module.exports = Vue;

      /***/ }),
  /* 5 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_coupon_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
      /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_coupon_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]; });

      /* empty/unused harmony star reexport */

      /***/ }),
  /* 6 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
      /* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
      /* harmony import */ var _utils_global__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);




      /* harmony default export */ __webpack_exports__["default"] = ({
          __name: 'coupon',
          setup(__props, { expose: __expose }) {
              __expose();

              const data = Object(vue__WEBPACK_IMPORTED_MODULE_0__["reactive"])({
                  isLoad:false,
                  hasCoupon:false,
                  isQrCodeShow:false,
                  shortUrl:'',
                  price:0,
                  couponMoney:0,
                  couponUseTime:'',
                  goodsId:'',
                  platform:'手机',
                  searchUrl:'',
                  isScan:false,//右下角二维码
              })


              // 获取全局对象`
              const {page,initData} = Object(vue__WEBPACK_IMPORTED_MODULE_0__["inject"])('global')

              Object(vue__WEBPACK_IMPORTED_MODULE_0__["watch"])(()=>data.shortUrl,(value,oldValue)=>{
                  if(!data.isScan&&value!==""){
                      data.isScan = true
                      let node = document.createElement('div')
                      node.innerHTML =  `<div style="text-align: center; padding: 12px 5px 8px; background: rgb(255, 255, 255); border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 12px;"><div style="margin: 0px auto; width: 100px;"><img src="http://v.zhihupe.com/enQrcode?url=${value}" style="width: 100px;" data-spm-anchor-id="pc_detail.27183998.202204.i1.7a7f7dd6JSsigu"></div><div style="margin-top: 4px;">手机${initData[page].text}扫一扫，领券购买</div></div>`
          node.style = 'position: fixed;right: 10px;padding-right: 5px;width: 124px;z-index: 999999;bottom: 60px;'
        document.body.appendChild(node)

        let btnHtml = `<a href="${initData.scanUrl+'?link='+data.shortUrl+'&platform='+encodeURIComponent(data.platform)}"  style="height: 46px;line-height: 46px;padding: 0 26px;font-size: 18px;font-family: &quot;microsoft yahei&quot;;margin-left: 10px;margin-right: 10px;background: linear-gradient(90deg, rgb(255 93 75), rgb(255 41 61));color: #fff;display: inline-block;text-align: center;vertical-align: middle;cursor: pointer;font-weight: 700;border-radius: 8px;float: left;">领券购买</a>`
          //监听节点，然后挂载
          Object(_utils_index__WEBPACK_IMPORTED_MODULE_1__["listenNode"])(initData[page].btnNode).then(node=>{
              node.insertAdjacentHTML('beforebegin',btnHtml)

          })
    }
  },{deep:true})

    function getTbShortUrl(img,sellAmount,title,shopName,price,goodsId){
        return new Promise((resolve, reject) => {
            axios.get(`https://u.gwdang.com/helper/qrcode?event=appQrcode&tag=9_default&rebate=&union=&dp_id=${goodsId}&img=${img}&title=${title}&price=${price}&sellAmount=${sellAmount}&shopName=${shopName}`)
                .then(response=>{
                const res = response.data
                if(res.code === 1&&res.data.t.indexOf('s.click.taobao.com') != -1){
                    resolve(res.data.t)
                }else{
                    reject(res)
                }
            }).catch(err=>{
                reject(err)
            })
        })
    }

    function getCoupon(platform,goods_info){
        // http://tool.wezhicms.com/coupon/newCoupon.php?m=taobao&url=https://s.click.taobao.com/xw4KlEu
        return new Promise((resolve, reject) => {
            axios.get(`https://tool.wezhicms.com/coupon/newCoupon.php?m=${platform}&goods_info=${goods_info}`)
                .then(response=>{
                const data = response.data
                if(data.code === 0){
                    resolve(data.data)
                }else{
                    reject()
                }
            }).catch(err=>{
                reject()
            })
        })
    }

    async function tbDetail(){
        try {
            let img,sellAmount,title,shopName,price,goodsId,brand,type
            data.goodsId = Object(_utils_index__WEBPACK_IMPORTED_MODULE_1__["getGoodsId"])('id')
            goodsId = data.goodsId +'-83'
            if(page === 'taobao'){
                console.log({initData:initData[page]})
                img = document.querySelector('#J_ImgBooth').src
                sellAmount = document.querySelector('#J_SellCounter').textContent
                title = document.querySelector(initData[page].titleClass).dataset.title||"淘宝商品"
                shopName = document.querySelector('.tb-main-title').dataset.title
                price = document.querySelector(initData[page].priceClass).textContent||0
                const attrList = document.querySelector(initData[page].attrClass)|| {};
                const attrChildList = attrList.children || [];
                for(let i=0;i<attrChildList.length;i++) {
                  const node = attrChildList[i];
                  const text = node.innerText;
                  if(text && initData[page].brandName.some(item => text.includes(item)) ) {
                    const brandStrList = text.split(':');
                    brand = `${brandStrList[1]}`.trim();
                  }
                  if(text && initData[page].typeName.some(item => text.includes(item))) {
                    const typeStrList = text.split(':');
                    type = `${typeStrList[1]}`.trim();
                  }
                }
                console.log({attrList,brand,type})
            }else if(page === 'tianmao'){
                // img = document.querySelector('.PicGallery--mainPic--1eAqOie').src
                // sellAmount = document.querySelector('#J_SellCounter').textContent
                title = document.querySelector(initData[page].titleClass).textContent||"天猫商品"
                shopName = document.querySelector('.ShopHeader--title--2qsBE1A').title
                price = document.querySelector(initData[page].priceClass).textContent||0
            }else if(page === 'chaoshi'){
                // img = document.querySelector('.PicGallery--mainPic--1eAqOie').src
                // sellAmount = document.querySelector('#J_SellCounter').textContent
                title = document.querySelector(initData[page].titleClass).textContent||"天猫超市商品"
                shopName = '天猫超市'
                price = Number(document.querySelector(initData[page].priceClass).textContent)||0
            }


            //将商品信息共享
            _utils_global__WEBPACK_IMPORTED_MODULE_2__["default"].set('goodsInfo',{
                goodsId:data.goodsId,
                title:title,
                price:price,
                brand,
                type
            })

            const surl = await getTbShortUrl(img,sellAmount,title,shopName,price,goodsId)
            const couponData = await  getCoupon('taobao',surl)

            if(couponData.couponTotalCount!=="") {
                data.couponMoney = (couponData.originalPrice - couponData.actualPrice).toFixed(0)
                data.couponUseTime = couponData.couponStartTime +'-'+ couponData.couponEndTime
                data.shortUrl = couponData.shortUrl
                data.hasCoupon = true
                menuAddCoupon()
            }else{
                data.price = couponData.originalPrice
                data.hasCoupon = false
                data.shortUrl = couponData.shortUrl
            }

            data.isLoad = true

        } catch (error) {
            console.log(error)
        }
    }

    async function jdDetail(){
        try {
            data.goodsId = Object(_utils_index__WEBPACK_IMPORTED_MODULE_1__["getUrlid"])(window.location.href)
            let title = document.querySelector(initData[page].titleClass)?document.querySelector(initData[page].titleClass).textContent:"京东商品"
            let price = document.querySelector(initData[page].priceClass)?document.querySelector(initData[page].priceClass).textContent:0
            //将商品信息共享
            _utils_global__WEBPACK_IMPORTED_MODULE_2__["default"].set('goodsInfo',{
                goodsId:data.goodsId,
                title,
                price
            })
            let couponData = await  getCoupon('jd',data.goodsId)
            let shortUrlData = await getCoupon('jdConvert','https://item.jd.com/' +data.goodsId+'.html')
            if((couponData instanceof Array)&&couponData.length > 0) {
                couponData = couponData[0]
                data.price = couponData.originPrice
                if(couponData.couponAmount > 0){
                    data.couponMoney = couponData.couponAmount
                    data.couponUseTime = couponData.couponStartTime +'-'+ couponData.couponEndTime
                    data.shortUrl = shortUrlData.shortUrl
                    data.hasCoupon = true
                    menuAddCoupon()
                }else{
                    data.shortUrl = shortUrlData.shortUrl
                    data.hasCoupon = false
                }

                data.isLoad = true

            }else{
                throw new Error('优惠券数据获取失败')
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function vipDetail(){
        try {
            const regArr = window.location.href.match(/-(\d*).html/);
            if(regArr.length < 2) throw new Error('id获取失败')
            data.goodsId = regArr[1]
            let title = document.querySelector(initData[page].titleClass)?document.querySelector(initData[page].titleClass).title:"唯品会商品"
            let price = document.querySelector(initData[page].priceClass)?document.querySelector(initData[page].priceClass).title:0
            //将商品信息共享
            _utils_global__WEBPACK_IMPORTED_MODULE_2__["default"].set('goodsInfo',{
                goodsId:data.goodsId,
                title,
                price
            })

            let goodsDetail = await getCoupon('vip',data.goodsId)
            if((goodsDetail instanceof Array)&&goodsDetail.length > 0) {
                goodsDetail = goodsDetail[0]
                data.price = goodsDetail.vipPrice
                let shortUrlData = await getCoupon('vipConvert',goodsDetail.destUrlPc)
                if(goodsDetail.couponPriceType !== 0){
                    data.couponMoney = goodsDetail.couponInfo.buy
                    data.couponUseTime = Object(_utils_index__WEBPACK_IMPORTED_MODULE_1__["timestampToTime"])(goodsDetail.couponInfo.useBeginTime) +'-'+ Object(_utils_index__WEBPACK_IMPORTED_MODULE_1__["timestampToTime"])(goodsDetail.couponInfo.useEndTime)
                    data.shortUrl = shortUrlData.urlInfoList[0].url
                    data.hasCoupon = true
                    menuAddCoupon()
                }else{
                    data.shortUrl = shortUrlData.urlInfoList[0].url
                    data.hasCoupon = false
                }

                data.isLoad = true

            }else{
                throw new Error('优惠券数据获取失败')
            }
        } catch (error) {
            console.log(error)
        }
    }

    function menuAddCoupon(){
        const html = `
              <a class="top_coupon_btn" title="点击领取" target="_blank" href="${initData.scanUrl}?link=${data.shortUrl}&platform=${encodeURIComponent(data.platform)}">
                      <span class="top-coupon-tle">当前商品领券立减</span>
                      <span class="price-num"><span class="price-sm">¥</span><span data-spm-anchor-id="pc_detail.27183998.0.i0.7ff37dd602iKdG">${data.couponMoney}</span></span>
                      <em class="link_hand"></em>
              </a>
      `
      Object(_utils_index__WEBPACK_IMPORTED_MODULE_1__["listenNode"])('#menu-coupon').then(node=>{
          node.innerHTML= html
      })
  }


    function search(){
        Object(_utils_index__WEBPACK_IMPORTED_MODULE_1__["GMopenInTab"])(data.searchUrl,{active:true})
    }
    Object(vue__WEBPACK_IMPORTED_MODULE_0__["onBeforeMount"])(()=>{
        switch(page){
            case 'taobao':
            case 'tianmao':
            case 'chaoshi':
                data.platform="手机淘宝"
                tbDetail()
                break
            case 'jd':
                data.platform="手机京东或微信"
                jdDetail()
                break
            case 'vip':
                data.platform="手机唯品会或微信"
                vipDetail()
                break
        }

        data.searchUrl = `${initData.cmsUrl}?r=/l&origin_id=&sort=0`

      Object(_utils_index__WEBPACK_IMPORTED_MODULE_1__["listenNode"])(initData[page].titleClass).then(node=>{
          const title = node.textContent
          data.searchUrl = `${initData.cmsUrl}?r=/l&kw=${encodeURIComponent(title)}&origin_id=&sort=0`
      })
  })

    const __returned__ = { data, page, initData, getTbShortUrl, getCoupon, tbDetail, jdDetail, vipDetail, menuAddCoupon, search, inject: vue__WEBPACK_IMPORTED_MODULE_0__["inject"], onBeforeMount: vue__WEBPACK_IMPORTED_MODULE_0__["onBeforeMount"], reactive: vue__WEBPACK_IMPORTED_MODULE_0__["reactive"], watch: vue__WEBPACK_IMPORTED_MODULE_0__["watch"], get getGoodsId() { return _utils_index__WEBPACK_IMPORTED_MODULE_1__["getGoodsId"] }, get getUrlid() { return _utils_index__WEBPACK_IMPORTED_MODULE_1__["getUrlid"] }, get timestampToTime() { return _utils_index__WEBPACK_IMPORTED_MODULE_1__["timestampToTime"] }, get listenNode() { return _utils_index__WEBPACK_IMPORTED_MODULE_1__["listenNode"] }, get GMopenInTab() { return _utils_index__WEBPACK_IMPORTED_MODULE_1__["GMopenInTab"] }, get globalInstance() { return _utils_global__WEBPACK_IMPORTED_MODULE_2__["default"] } }
    Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
    return __returned__
}

});

  /***/ }),
  /* 7 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadStyle", function() { return loadStyle; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadJs", function() { return loadJs; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createId", function() { return createId; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getGoodsId", function() { return getGoodsId; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getUrlid", function() { return getUrlid; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listenNode", function() { return listenNode; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "timestampToTime", function() { return timestampToTime; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GMxmlHttpRequest", function() { return GMxmlHttpRequest; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GMopenInTab", function() { return GMopenInTab; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GMaddValueChangeListener", function() { return GMaddValueChangeListener; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GMremoveValueChangeListener", function() { return GMremoveValueChangeListener; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GMsetValue", function() { return GMsetValue; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GMgetValue", function() { return GMgetValue; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getPromise", function() { return getPromise; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCookie", function() { return getCookie; });
      /* harmony import */ var _utils_global__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);


      /**
* load style file
* @param {String} url
*/
      const loadStyle = (url) => {
          const head = document.getElementsByTagName('head')[0];
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = url;
          link.media = 'all';
          head.appendChild(link);
      }

      const loadJs = (url) => {
          const head = document.getElementsByTagName('head')[0];
          const link = document.createElement('script');
          link.type = 'text/javascript';
          link.src = url;
          head.appendChild(link);
      }

      const createId = (prefix = 'default')=>{
          return `${prefix}_${Date.now()}`

}

const getGoodsId = function(data){
  var reg = new RegExp("(^|&)" + data + "=([^&]*)(&|$)");
  var s = window.location.search.substr(1).match(reg);
  if (s != null) {
      return s[2];
  }
  return "";
}

const getUrlid = function(url) {
  var id ="";
  if (url.indexOf("?") != -1) {
      url = url.split("?")[0]
  }
  if (url.indexOf("#") != -1) {
      url = url.split("#")[0]
  }
  var text = url.split("/");
  id = text[text.length - 1];
  id = id.replace(".html", "");
  return id
}

const listenNode = function(data){
  var Count;
  var num ="";
  return new Promise(function(resolve, reject){
      Count = setInterval(function() {
          if(data instanceof Array){
              data.forEach((item)=>{
                  const node = document.querySelector(item);
                  if(node !==null){
                      resolve(node);
                      clearInterval(Count);
                  }

              })
          }else{
              const node = document.querySelector(data);
              if(node !==null){
                  resolve(node);
                  clearInterval(Count);
              }
          }
          if(num ==100){
              clearInterval(Count);
          }
          num++;

      },200);
  });
}

const timestampToTime = function (timestamp,hms = false) {
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  let D =  date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()
  if(!hms) return Y+M+D
  let h = ' ' + date.getHours() + ':';
  let m = date.getMinutes() + ':';
  let s = date.getSeconds();
  return Y+M+D+h+m+s;
}

const GMxmlHttpRequest = function(obj){
  if(typeof GM_xmlhttpRequest === 'function'){
      GM_xmlhttpRequest(obj)
  }else{
      GM.xmlHttpRequest(obj)
  }
}

const GMopenInTab = function(url, options){
  if(typeof GM_openInTab === 'function'){
      GM_openInTab(url, options)
  }else{
      GM.openInTab(url, options)
  }
}

const GMaddValueChangeListener = function(name, fn){
  if(typeof GM_addValueChangeListener === 'function'){
      GM_addValueChangeListener(name, fn)
  }else{
      GM.addValueChangeListener(name, fn)
  }
}
const GMremoveValueChangeListener = function(listener_id){
  if(typeof GM_removeValueChangeListener === 'function'){
      GM_removeValueChangeListener(listener_id)
  }else{
      GM.removeValueChangeListener(listener_id)
  }
}
const GMsetValue = function(name, value){
  if(typeof GM_setValue === 'function'){
      GM_setValue(name, value)
  }else{
      GM.setValue(name, value)
  }
}
const GMgetValue = function(name){
  if(typeof GM_getValue === 'function'){
      GM_getValue(name)
  }else{
      GM.getValue(name)
  }
}

function getPromise(str){
  return new Promise((resolve, reject) => {
      setTimeout(()=>{
          if(str === 'cookie'){
              resolve(document.cookie)
          }else{
              resolve(_utils_global__WEBPACK_IMPORTED_MODULE_0__["default"].getter('goodsInfo'))
          }
      }, 300);
  })

}

  function getCookie(e){
      var arrstr = document.cookie.split("; ");
      for (let i = 0; i < arrstr.length; i++){
          let temp = arrstr[i].split("=");
          if (temp[0] == e) return decodeURIComponent(temp[1])
      }
      return null
  }



  /***/ }),
  /* 8 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      const global = function(){
      }

      global.prototype.getter = function(name){
          return this.name
      }

      global.prototype.set = function(name,value){
          this.name = value
      }

      const getGlobalInstance = (function(){
          let instance = null

          return function(){
              if(!instance){
                  instance = new global()
              }
              return instance
          }
      })()

      const globalInstance = new getGlobalInstance()

      /* harmony default export */ __webpack_exports__["default"] = (globalInstance);

      /***/ }),
  /* 9 */
  /***/ (function(module, exports, __webpack_require__) {

      "use strict";

      Object.defineProperty(exports, "__esModule", { value: true });
      // runtime helper for setting properties on components
      // in a tree-shakable way
      exports.default = (sfc, props) => {
          const target = sfc.__vccOpts || sfc;
          for (const [key, val] of props) {
              target[key] = val;
          }
          return target;
      };


      /***/ }),
  /* 10 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _menu_vue_vue_type_template_id_18a44f38__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
      /* harmony import */ var _menu_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);
      /* empty/unused harmony star reexport *//* harmony import */ var _menu_vue_vue_type_style_index_0_id_18a44f38_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26);
      /* harmony import */ var F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
      /* harmony import */ var F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__);







      const __exports__ = /*#__PURE__*/F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3___default()(_menu_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_menu_vue_vue_type_template_id_18a44f38__WEBPACK_IMPORTED_MODULE_0__["render"]],['__file',"src/menu.vue"]])
      /* hot reload */
      if (false) {}


      /* harmony default export */ __webpack_exports__["default"] = (__exports__);

      /***/ }),
  /* 11 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_vue_loader_16_8_3_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_menu_vue_vue_type_template_id_18a44f38__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
      /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_16_8_3_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_menu_vue_vue_type_template_id_18a44f38__WEBPACK_IMPORTED_MODULE_0__["render"]; });



      /***/ }),
  /* 12 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);


      const _hoisted_1 = { style: {"width":"auto","height":"50px","display":"flex","align-items":"center","background":"#fff","border":"1px solid #f7f8f9","font-family":"HelveticaNeue-Bold, 'Helvetica Neue'","position":"relative"} }
      const _hoisted_2 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", { class: "logo" }, [
          /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("img", { src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA0LTIxVDE1OjI3OjEwKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNi0yN1QwOTowODoyNCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNi0yN1QwOTowODoyNCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplNTkyMTJmNC00YmVjLTJmNDYtODRiOC1lYmVjZWI0ZDkyMGEiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDozMDkxMDNkMy0zYzUyLTNmNGQtYTU1MS02MDgyMzU1NThmOGQiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo3ZmNhZmU0MS00NzFhLTFlNGEtYTJhMi1jNGExODczMDUyOWIiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjdmY2FmZTQxLTQ3MWEtMWU0YS1hMmEyLWM0YTE4NzMwNTI5YiIgc3RFdnQ6d2hlbj0iMjAyMS0wNC0yMVQxNToyNzoxMCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjAgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDphZWM4ZGQ5ZC03Yzk4LWY1NDYtYWE3Mi05MmU0YTBkMDc2ZTkiIHN0RXZ0OndoZW49IjIwMjEtMDQtMjFUMTg6MDg6MDQrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZTU5MjEyZjQtNGJlYy0yZjQ2LTg0YjgtZWJlY2ViNGQ5MjBhIiBzdEV2dDp3aGVuPSIyMDIzLTA2LTI3VDA5OjA4OjI0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMCAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+HKNg0AAAFBhJREFU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" })
      ], -1 /* HOISTED */)
      const _hoisted_3 = {
          key: 2,
          class: "bijia_list"
      }
      const _hoisted_4 = {
          key: 0,
          class: "bijia-goods-list"
      }
      const _hoisted_5 = { style: {"display":"flex","align-items":"center","width":"100%","height":"100%"} }
      const _hoisted_6 = ["onClick"]
      const _hoisted_7 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("em", { class: "zh-bg" }, null, -1 /* HOISTED */)
      const _hoisted_8 = [
          _hoisted_7
      ]
      const _hoisted_9 = { class: "goods-list" }
      const _hoisted_10 = ["onClick"]
      const _hoisted_11 = ["src"]
      const _hoisted_12 = {
          key: 0,
          class: "price"
      }
      const _hoisted_13 = {
          key: 1,
          class: "price"
      }
      const _hoisted_14 = { class: "shop-name" }
      const _hoisted_15 = { class: "title" }
      const _hoisted_16 = ["onClick"]
      const _hoisted_17 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("em", { class: "zh-bg" }, null, -1 /* HOISTED */)
      const _hoisted_18 = [
          _hoisted_17
      ]
      const _hoisted_19 = { class: "pagination" }
      const _hoisted_20 = { style: {"color":"#E4393C","margin":"0"} }
      const _hoisted_21 = {
          key: 5,
          class: "price_status",
          style: {"color":"#E4393C"}
      }
      const _hoisted_22 = {
          key: 0,
          class: "price_status_icon zh-bg",
          style: {"background-position":"-96px -13px"}
      }
      const _hoisted_23 = {
          key: 1,
          class: "price_status_icon zh-bg",
          style: {"background-position":"-70px -12px"}
      }
      const _hoisted_24 = {
          key: 2,
          class: "price_status_icon zh-bg",
          style: {"background-position":"-40px -12px"}
      }
      const _hoisted_25 = {
          key: 3,
          class: "price_status_icon zh-bg",
          style: {"background-position":"-122px -190px"}
      }
      const _hoisted_26 = {
          key: 4,
          class: "history_price"
      }
      const _hoisted_27 = { class: "history-tips" }
      const _hoisted_28 = { class: "max-price" }
      const _hoisted_29 = { class: "min-price" }
      const _hoisted_30 = { style: {"color":"#9d9d9d","font-weight":"400"} }
      const _hoisted_31 = { class: "tips" }
      const _hoisted_32 = /*#__PURE__*/Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", { id: "menu-coupon" }, null, -1 /* HOISTED */)

      function render(_ctx, _cache, $props, $setup, $data, $options) {
          return (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_1, [
              _hoisted_2,
              (!$setup.data.bijiaRequestFail&&$setup.data.bijiaList.length === 0)
              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", {
                  key: 0,
                  class: "price_status",
                  onClick: $setup.getBijiaList,
                  style: {"color":"##35bd68"}
              }, " 查看比价商品列表 "))
              : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true),
              ($setup.data.bijiaRequestFail)
              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", {
                  key: 1,
                  class: "price_status",
                  onClick: $setup.getBijiaList,
                  style: {"color":"#E4393C"}
              }, " 商品比价获取失败，点击重试 "))
              : (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_3, [
                  (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])(vue__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__["renderList"])($setup.data.bijiaList, (item, index) => {
                      return (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", {
                          class: "bijia_item",
                          key: index
                      }, [
                          Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", null, [
                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"])(Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])(item.site_name), 1 /* TEXT */),
                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("text", null, "￥" + Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])((item.min_price/100).toFixed(2)), 1 /* TEXT */)
                          ]),
                          (item.products.length>0)
                          ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_4, [
                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_5, [
                                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", {
                                      class: "pre-page",
                                      onClick: $event => ($setup.onPrePage(index))
                                  }, _hoisted_8, 8 /* PROPS */, _hoisted_6),
                                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_9, [
                                      (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(true), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])(vue__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null, Object(vue__WEBPACK_IMPORTED_MODULE_0__["renderList"])(item.products.slice((item.currentPage - 1)*6,item.currentPage*6), (e, i) => {
                                          return (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", {
                                              class: "goods-item",
                                              key: i,
                                              onClick: $event => ($setup.openGoods(e))
                                          }, [
                                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("img", {
                                                  src: e.img_url
                                              }, null, 8 /* PROPS */, _hoisted_11),
                                              (item.site_name ==='淘宝'||item.site_name==='天猫商城')
                                              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("p", _hoisted_12, "￥" + Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])(e.coupon_price?e.coupon_price:e.price), 1 /* TEXT */))
                                              : (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("p", _hoisted_13, "￥" + Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])((e.price/100).toFixed(2)), 1 /* TEXT */)),
                                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("p", _hoisted_14, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])(e.site_name), 1 /* TEXT */),
                                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("p", _hoisted_15, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])(e.title), 1 /* TEXT */)
                                          ], 8 /* PROPS */, _hoisted_10))
                                      }), 128 /* KEYED_FRAGMENT */))
                                  ]),
                                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", {
                                      class: "next-page",
                                      onClick: $event => ($setup.onNextPage(index))
                                  }, _hoisted_18, 8 /* PROPS */, _hoisted_16)
                              ]),
                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_19, [
                                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"])("第"),
                                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("text", _hoisted_20, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])(item.currentPage), 1 /* TEXT */),
                                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"])("页,共" + Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])(Math.ceil(item.products.length/6)) + "页", 1 /* TEXT */)
                              ])
                          ]))
                          : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true)
                      ]))
                  }), 128 /* KEYED_FRAGMENT */))
              ])),
              (!$setup.data.requestFail&&!$setup.data.isBan&&!$setup.data.historyData)
              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", {
                  key: 3,
                  class: "price_status",
                  onClick: $setup.getHistoryPrice,
                  style: {"color":"##35bd68"}
              }, " 查看历史价格 "))
              : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true),
              ($setup.data.requestFail&&!$setup.data.historyData)
              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", {
                  key: 4,
                  class: "price_status",
                  onClick: $setup.getHistoryPrice,
                  style: {"color":"#E4393C"}
              }, " 历史价格获取失败，点击重试 "))
              : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true),
              ($setup.data.isBan&&!$setup.data.historyData)
              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_21, " 历史价格获取失败，点击重试 "))
              : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true),
              ($setup.data.historyData!==null)
              ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", {
                  key: 6,
                  class: "price_status",
                  onMouseenter: $setup.addHistoryChart,
                  onMouseleave: $setup.removeHistoryChart
              }, [
                  ($setup.data.historyData.product_status.status === 1)
                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("em", _hoisted_22))
                  : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true),
                  ($setup.data.historyData.product_status.status === 0)
                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("em", _hoisted_23))
                  : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true),
                  ($setup.data.historyData.product_status.status === -1)
                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("em", _hoisted_24))
                  : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true),
                  ($setup.data.historyData.product_status.status === -2)
                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("em", _hoisted_25))
                  : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true),
                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"])(" " + Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.data.historyData.product_status.status_text) + " ", 1 /* TEXT */),
                  ($setup.data.historyChartShow)
                  ? (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_26, [
                      Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_27, [
                          Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_28, "最高: ¥" + Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.data.historyData.series[0].max/100), 1 /* TEXT */),
                          Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_29, [
                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"])(" 最低(单件): ¥" + Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.data.historyData.series[0].min/100) + " (", 1 /* TEXT */),
                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("span", _hoisted_30, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.timestampToTime($setup.data.historyData.series[0].min_stamp*1000)), 1 /* TEXT */),
                              Object(vue__WEBPACK_IMPORTED_MODULE_0__["createTextVNode"])(")")
                          ]),
                          Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementVNode"])("div", _hoisted_31, Object(vue__WEBPACK_IMPORTED_MODULE_0__["toDisplayString"])($setup.data.historyData.analysis.tips[360]), 1 /* TEXT */)
                      ]),
                      Object(vue__WEBPACK_IMPORTED_MODULE_0__["createVNode"])($setup["historyChart"], {
                          "chart-data": $setup.data.historyChartData
                      }, null, 8 /* PROPS */, ["chart-data"])
                  ]))
                  : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true)
              ], 32 /* HYDRATE_EVENTS */))
              : Object(vue__WEBPACK_IMPORTED_MODULE_0__["createCommentVNode"])("v-if", true),
              _hoisted_32
          ]))
      }

      /***/ }),
  /* 13 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_menu_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
      /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_menu_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]; });

      /* empty/unused harmony star reexport */

      /***/ }),
  /* 14 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
      /* harmony import */ var _utils_global__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
      /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
      /* harmony import */ var _utils_gwdang__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(15);
      /* harmony import */ var _components_historyChart_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(16);






      /* harmony default export */ __webpack_exports__["default"] = ({
          __name: 'menu',
          setup(__props, { expose: __expose }) {
              __expose();

              const data = Object(vue__WEBPACK_IMPORTED_MODULE_0__["reactive"])({
                  // isloading:false,
                  goodsInfo:{},
                  bijiaList:[],
                  bijiaListShow:false,
                  historyData:null,
                  historyChartData:{
                      date:[],
                      data:[]
                  },
                  historyChartShow:false,
                  bijiaRequestFail:false,//比价too many request
                  requestFail:false,//历史价too many request
                  isBan:false,//历史价需要验证
                  gwdangCookie:'',//购物党Cookie
              })

              Object(vue__WEBPACK_IMPORTED_MODULE_0__["watch"])(()=>data.historyData,(new_value,old_value)=>{
                  if(new_value.promo_series&&new_value.promo_series.length>0){
                      new_value.promo_series[0].data.forEach(item=>{
                          data.historyChartData.date.push(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["timestampToTime"])(item.x*1000))
                          data.historyChartData.data.push(item.y/100)
                      })
                  }else if(new_value.series&&new_value.series.length>0){
                      new_value.series[0].data.forEach(item=>{
                          data.historyChartData.date.push(Object(_utils__WEBPACK_IMPORTED_MODULE_2__["timestampToTime"])(item.x*1000))
                          data.historyChartData.data.push(item.y/100)
                      })
                  }
              },{deep:true})

              // 获取全局对象`
              let {fpid,page,initData} = Object(vue__WEBPACK_IMPORTED_MODULE_0__["inject"])('global')


              function addHistoryChart(){
                  if(data.historyChartShow) return
                  data.historyChartShow = true
              }

              function removeHistoryChart(){
                  if(!data.historyChartShow) return
                  data.historyChartShow = false
              }

              function onPrePage(index){
                  if(data.bijiaList[index].currentPage>1){
                      data.bijiaList[index].currentPage--
                  }
              }

              function onNextPage(index){
                  if(data.bijiaList[index].currentPage < Math.ceil(data.bijiaList[index].products.length/6)){
                      data.bijiaList[index].currentPage++
                  }
              }

              function openGoods(info){
                  if(info.site_id == "83"||info.site_id == "8"||info.site_id == "123"){
                      Object(_utils__WEBPACK_IMPORTED_MODULE_2__["GMopenInTab"])(`https://tool.wezhicms.com/coupon/newCoupon.php?m=redirect&goods_info=${info.url_crc}&site_id=${info.site_id}`,{
                          active:true,
                          insert:true,
                          setParent:true
                      })
                  }else{
                      Object(_utils__WEBPACK_IMPORTED_MODULE_2__["GMopenInTab"])(`https://tool.wezhicms.com/coupon/newCoupon.php?m=redirect&goods_info=${info.url}&site_id=${info.site_id}`,{
                          active:true,
                          insert:true,
                          setParent:true
                      })
                  }
              }

              async function getGoodsInfo(){
                  let count = 10
                  let goodsInfo = _utils_global__WEBPACK_IMPORTED_MODULE_1__["default"].getter('goodsInfo');
                  for(let i = 0;i<count;i++){
                      if(!goodsInfo){
                          goodsInfo = await Object(_utils__WEBPACK_IMPORTED_MODULE_2__["getPromise"])()
                      }else{
                          return goodsInfo
                      }
                  }
              }


              async function init(){
                  try {
                      //获取商品信息
                      data.goodsInfo = await getGoodsInfo()
                      // 获取购物党cookie
                      data.gwdangCookie = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["getCookie"])('gwdangCookie')
                      // 不存在就获取
                      if(!data.gwdangCookie||data.gwdangCookie==="''"){
                          Object(_utils__WEBPACK_IMPORTED_MODULE_2__["GMopenInTab"])('http://www.gwdang.com/v2/trend/'+data.goodsInfo.goodsId+'-'+fpid+'.html',true)
                          const listenId = Object(_utils__WEBPACK_IMPORTED_MODULE_2__["GMaddValueChangeListener"])('gwdangCookie',function(name, old_value, new_value, remote){
                              if(new_value&&new_value.indexOf('fp=')!==-1){
                                  //保存到浏览器，下次不需要打开网站
                                  document.cookie = 'gwdangCookie='+encodeURIComponent(new_value)
                                  data.gwdangCookie = new_value
                                  //移除监听器
                                  Object(_utils__WEBPACK_IMPORTED_MODULE_2__["GMremoveValueChangeListener"])(listenId)
                                  //清除Cookie缓存,不然下次监听不到
                                  Object(_utils__WEBPACK_IMPORTED_MODULE_2__["GMsetValue"])('gwdangCookie',null)
                              }
                          })
                          }
                  } catch (error) {
                      console.log(error)
                  }

              }

              function getHistoryPrice(){
                  let goodsId = data.goodsInfo.goodsId
                  // if((page==='tianmao'||"chaoshi")&&window.location.href.indexOf('skuId')!==-1){
                  //     goodsId =goodsId + getGoodsId('skuId').slice(-4)
                  //     fpid = 137
                  // }
                  GM_xmlhttpRequest({
                      url: 'http://www.gwdang.com/trend/data_www?dp_id='+goodsId+'-'+fpid+'&show_prom=true&v=2&get_coupon=0&price='+data.goodsInfo.price,
                      method: 'GET',
                      timeout: 10000,
                      headers: {
                          ':Authority':'www.gwdang.com',
                          'Accept': 'application/json',
                          'Cookie':data.gwdangCookie,
                          'Referer':'http://www.gwdang.com/v2/trend/'+goodsId+'-'+fpid+'.html?static=true'
                      },
                      onload: function(res){
                          if(res.responseText.indexOf('Too Many Requests')!==-1){
                              data.requestFail = true
                              data.isloading = true
                          }else{
                              const json = JSON.parse(res.responseText)
                              // console.log(json)
                              if(json.product_status){
                                  data.historyData = {...json}
                                  data.requestFail = false
                                  data.isBan = false
                              }else{
                                  // sessionStorage.removeItem('gwdangCookie')
                              }
                          }

                      }
                  })
              }


              function getBijiaList(){
                  const timestamp = new Date().getTime()
                  const dp_id = data.goodsInfo.goodsId+'-'+fpid
                  const brand  = data.goodsInfo.brand;
                  const type  = data.goodsInfo.type;
                  const title = brand && type ? brand + type : data.goodsInfo.title;
                  const str = Object(_utils_gwdang__WEBPACK_IMPORTED_MODULE_3__["signParams"])(data.gwdangCookie,{
                      dp_id,
                      price: data.goodsInfo.price,
                      title: title,
                      timestamp
                  })
                  const t = (new Date().getTime() / 1000).toFixed(0);
                  console.log(data)
                  const url = 'https://www.gwdang.com/product/aj_same?dp_id='+dp_id+'&title='+encodeURIComponent(title)+'&price='+data.goodsInfo.price+'&from=trend&timestamp='+timestamp+'&str='+str+'&t='+t+'';
                  console.log({url})
                  GM_xmlhttpRequest({
                      url,
                      method: 'GET',
                      timeout: 10000,
                      headers: {
                          ':Authority':'gwdang.com',
                          'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                          'Cache-Control': 'public',
                          'Cookie':data.gwdangCookie,
                          'Host':'gwdang.com',
                          'Referer':'http://www.gwdang.com/v2/trend/'+data.goodsInfo.goodsId+'-'+fpid+'.html'
                      },
                      onload: function(res){
                          if(res.responseText.indexOf('Too Many Requests') !== -1){
                              data.bijiaRequestFail = true
                              return
                          }
                          console.log(res.responseText.indexOf('Too Many Requests'))
                          const json = JSON.parse(res.responseText)
                          console.log({json})
                          data.bijiaList = []
                          if(json.code===0){
                              if(json.data.b2c.length>0){
                                  json.data.b2c.forEach(e => {
                                      if(e.site_id==='3'||e.site_id==='83'||e.site_id==='129'||e.site_id==='370') data.bijiaList.push({...e,currentPage:1})
                                  });
                              }
                              if(json.data.tb.taobao.product.length>0){
                                  const obj={
                                      min_price:json.data.tb.taobao.product[0].coupon_price?json.data.tb.taobao.product[0].coupon_price*100:json.data.tb.taobao.product[0].price*100,
                                      products:[...json.data.tb.taobao.product],
                                      site_id: "83",
                                      site_name: "淘宝",
                                      currentPage:1
                                  }
                                  data.bijiaList.push(obj)
                              }
                              if(json.data.tb.tmall.product.length>0){
                                  const obj={
                                      min_price:json.data.tb.tmall.product[0].coupon_price?json.data.tb.tmall.product[0].coupon_price*100:json.data.tb.tmall.product[0].price*100,
                                      products:[...json.data.tb.tmall.product],
                                      site_id: "83",
                                      site_name: "天猫商城",
                                      currentPage:1
                                  }
                                  data.bijiaList.push(obj)

                              }
                              data.bijiaRequestFail = false
                          }else{
                              // sessionStorage.removeItem('gwdangCookie')
                              //删除cookie
                              document.cookie = "gwdangCookie=''";
                              data.bijiaRequestFail = true
                              init()
                          }
                      }
                  })
              }
              Object(vue__WEBPACK_IMPORTED_MODULE_0__["onBeforeMount"])(()=>{

                  init()




              })

              const __returned__ = { data, get fpid() { return fpid }, set fpid(v) { fpid = v }, get page() { return page }, set page(v) { page = v }, get initData() { return initData }, set initData(v) { initData = v }, addHistoryChart, removeHistoryChart, onPrePage, onNextPage, openGoods, getGoodsInfo, init, getHistoryPrice, getBijiaList, onBeforeMount: vue__WEBPACK_IMPORTED_MODULE_0__["onBeforeMount"], reactive: vue__WEBPACK_IMPORTED_MODULE_0__["reactive"], inject: vue__WEBPACK_IMPORTED_MODULE_0__["inject"], watch: vue__WEBPACK_IMPORTED_MODULE_0__["watch"], get globalInstance() { return _utils_global__WEBPACK_IMPORTED_MODULE_1__["default"] }, get getGoodsId() { return _utils__WEBPACK_IMPORTED_MODULE_2__["getGoodsId"] }, get timestampToTime() { return _utils__WEBPACK_IMPORTED_MODULE_2__["timestampToTime"] }, get GMaddValueChangeListener() { return _utils__WEBPACK_IMPORTED_MODULE_2__["GMaddValueChangeListener"] }, get GMremoveValueChangeListener() { return _utils__WEBPACK_IMPORTED_MODULE_2__["GMremoveValueChangeListener"] }, get GMsetValue() { return _utils__WEBPACK_IMPORTED_MODULE_2__["GMsetValue"] }, get GMopenInTab() { return _utils__WEBPACK_IMPORTED_MODULE_2__["GMopenInTab"] }, get getPromise() { return _utils__WEBPACK_IMPORTED_MODULE_2__["getPromise"] }, get getCookie() { return _utils__WEBPACK_IMPORTED_MODULE_2__["getCookie"] }, get signParams() { return _utils_gwdang__WEBPACK_IMPORTED_MODULE_3__["signParams"] }, historyChart: _components_historyChart_vue__WEBPACK_IMPORTED_MODULE_4__["default"] }
              Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
              return __returned__
          }

      });

      /***/ }),
  /* 15 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "signParams", function() { return signParams; });
      const signParams = (cookie,obj)=>{
          const fp = getFp(cookie,"fp")
          const keys = Object.keys(obj);
          keys.sort();
          const arr = [];
          keys.forEach((item) => {
              arr.push(`${item.toString()}=${obj[item]}`);
          });
          let str = arr.join("*");
          str += `*fp=${fp}`
      return md5(str);

}

function getFp(cookie, e) {
  var arrstr = cookie.split("; ");
  for (let i = 0; i < arrstr.length; i++){
      let temp = arrstr[i].split("=");
      if (temp[0] == e) return decodeURIComponent(temp[1])
  }
  return null
}

  /***/ }),
  /* 16 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _historyChart_vue_vue_type_template_id_fb17aa8c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
      /* harmony import */ var _historyChart_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
      /* empty/unused harmony star reexport *//* harmony import */ var _historyChart_vue_vue_type_style_index_0_id_fb17aa8c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21);
      /* harmony import */ var F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
      /* harmony import */ var F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3__);







      const __exports__ = /*#__PURE__*/F_360MoveData_Users_Administrator_Desktop_tampermonkey_vue_master_node_modules_vue_loader_16_8_3_vue_loader_dist_exportHelper_js__WEBPACK_IMPORTED_MODULE_3___default()(_historyChart_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_1__["default"], [['render',_historyChart_vue_vue_type_template_id_fb17aa8c_scoped_true__WEBPACK_IMPORTED_MODULE_0__["render"]],['__scopeId',"data-v-fb17aa8c"],['__file',"src/components/historyChart.vue"]])
      /* hot reload */
      if (false) {}


      /* harmony default export */ __webpack_exports__["default"] = (__exports__);

      /***/ }),
  /* 17 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_vue_loader_16_8_3_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_historyChart_vue_vue_type_template_id_fb17aa8c_scoped_true__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18);
      /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_16_8_3_vue_loader_dist_templateLoader_js_ref_5_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_historyChart_vue_vue_type_template_id_fb17aa8c_scoped_true__WEBPACK_IMPORTED_MODULE_0__["render"]; });



      /***/ }),
  /* 18 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);


      const _withScopeId = n => (Object(vue__WEBPACK_IMPORTED_MODULE_0__["pushScopeId"])("data-v-fb17aa8c"),n=n(),Object(vue__WEBPACK_IMPORTED_MODULE_0__["popScopeId"])(),n)
      const _hoisted_1 = { id: "history_chart" }

      function render(_ctx, _cache, $props, $setup, $data, $options) {
          return (Object(vue__WEBPACK_IMPORTED_MODULE_0__["openBlock"])(), Object(vue__WEBPACK_IMPORTED_MODULE_0__["createElementBlock"])("div", _hoisted_1))
      }

      /***/ }),
  /* 19 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_historyChart_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);
      /* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_historyChart_vue_vue_type_script_setup_true_lang_js__WEBPACK_IMPORTED_MODULE_0__["default"]; });

      /* empty/unused harmony star reexport */

      /***/ }),
  /* 20 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
      /* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);



      /* harmony default export */ __webpack_exports__["default"] = ({
          __name: 'historyChart',
          props: {
              chartData:{
                  type:Object,
                  default:{
                      data:[],
                      date:[]
                  }
              },
          },
          setup(__props, { expose: __expose }) {
              __expose();

              const props = __props;



              const {chartData} = Object(vue__WEBPACK_IMPORTED_MODULE_0__["toRefs"])(props)

              let myChart = null

              function createChart(){
                  if(chartData.value.data.length<1||chartData.value.date.length<1) return

                  // 基于准备好的dom，初始化echarts实例
                  myChart = echarts.init(document.getElementById('history_chart'));
                  window.addEventListener('resize', function() {
                      myChart.resize();
                  });
                  // 指定图表的配置项和数据
                  var option = {

                      tooltip: {
                          trigger: 'axis'
                      },
                      grid: {
                          left: '3%',
                          right: '4%',
                          bottom: '3%',
                          containLabel: true
                      },
                      xAxis: {
                          type: 'category',
                          boundaryGap: false,
                          data: [...chartData.value.date]
                      },
                      yAxis: {
                          type: 'value'
                      },
                      series: [
                          {
                              name: '到手价',
                              type: 'line',
                              stack: 'Total',
                              data: [...chartData.value.data]
                          }
                      ]
                  };

                  // 使用刚指定的配置项和数据显示图表。
                  myChart.setOption(option);

                  Object(vue__WEBPACK_IMPORTED_MODULE_0__["nextTick"])(()=>{
                      setTimeout(()=>{
                          myChart.resize();
                      },1500)
                  })
              }

              Object(vue__WEBPACK_IMPORTED_MODULE_0__["onMounted"])(()=>{
                  createChart()
              })

              const __returned__ = { props, chartData, get myChart() { return myChart }, set myChart(v) { myChart = v }, createChart, toRefs: vue__WEBPACK_IMPORTED_MODULE_0__["toRefs"], onMounted: vue__WEBPACK_IMPORTED_MODULE_0__["onMounted"], nextTick: vue__WEBPACK_IMPORTED_MODULE_0__["nextTick"], onBeforeMount: vue__WEBPACK_IMPORTED_MODULE_0__["onBeforeMount"] }
              Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
              return __returned__
          }

      });

      /***/ }),
  /* 21 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_style_loader_2_0_0_style_loader_dist_cjs_js_node_modules_css_loader_5_2_7_css_loader_dist_cjs_js_node_modules_vue_loader_16_8_3_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_historyChart_vue_vue_type_style_index_0_id_fb17aa8c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);
      /* empty/unused harmony star reexport */

      /***/ }),
  /* 22 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_style_loader_2_0_0_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
      /* harmony import */ var _node_modules_style_loader_2_0_0_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_2_0_0_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
      /* harmony import */ var _node_modules_css_loader_5_2_7_css_loader_dist_cjs_js_node_modules_vue_loader_16_8_3_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_historyChart_vue_vue_type_style_index_0_id_fb17aa8c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(24);



      var options = {};

      options.insert = "head";
      options.singleton = false;

      var update = _node_modules_style_loader_2_0_0_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_5_2_7_css_loader_dist_cjs_js_node_modules_vue_loader_16_8_3_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_historyChart_vue_vue_type_style_index_0_id_fb17aa8c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



      /* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_5_2_7_css_loader_dist_cjs_js_node_modules_vue_loader_16_8_3_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_historyChart_vue_vue_type_style_index_0_id_fb17aa8c_scoped_true_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

      /***/ }),
  /* 23 */
  /***/ (function(module, exports, __webpack_require__) {

      "use strict";


      var isOldIE = function isOldIE() {
          var memo;
          return function memorize() {
              if (typeof memo === 'undefined') {
                  // Test for IE <= 9 as proposed by Browserhacks
                  // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
                  // Tests for existence of standard globals is to allow style-loader
                  // to operate correctly into non-standard environments
                  // @see https://github.com/webpack-contrib/style-loader/issues/177
                  memo = Boolean(window && document && document.all && !window.atob);
              }

              return memo;
          };
      }();

      var getTarget = function getTarget() {
          var memo = {};
          return function memorize(target) {
              if (typeof memo[target] === 'undefined') {
                  var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

                  if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
                      try {
                          // This will throw an exception if access to iframe is blocked
                          // due to cross-origin restrictions
                          styleTarget = styleTarget.contentDocument.head;
                      } catch (e) {
                          // istanbul ignore next
                          styleTarget = null;
                      }
                  }

                  memo[target] = styleTarget;
              }

              return memo[target];
          };
      }();

      var stylesInDom = [];

      function getIndexByIdentifier(identifier) {
          var result = -1;

          for (var i = 0; i < stylesInDom.length; i++) {
              if (stylesInDom[i].identifier === identifier) {
                  result = i;
                  break;
              }
          }

          return result;
      }

      function modulesToDom(list, options) {
          var idCountMap = {};
          var identifiers = [];

          for (var i = 0; i < list.length; i++) {
              var item = list[i];
              var id = options.base ? item[0] + options.base : item[0];
              var count = idCountMap[id] || 0;
              var identifier = "".concat(id, " ").concat(count);
              idCountMap[id] = count + 1;
              var index = getIndexByIdentifier(identifier);
              var obj = {
                  css: item[1],
                  media: item[2],
                  sourceMap: item[3]
              };

              if (index !== -1) {
                  stylesInDom[index].references++;
                  stylesInDom[index].updater(obj);
              } else {
                  stylesInDom.push({
                      identifier: identifier,
                      updater: addStyle(obj, options),
                      references: 1
                  });
              }

              identifiers.push(identifier);
          }

          return identifiers;
      }

      function insertStyleElement(options) {
          var style = document.createElement('style');
          var attributes = options.attributes || {};

          if (typeof attributes.nonce === 'undefined') {
              var nonce =  true ? __webpack_require__.nc : undefined;

              if (nonce) {
                  attributes.nonce = nonce;
              }
          }

          Object.keys(attributes).forEach(function (key) {
              style.setAttribute(key, attributes[key]);
          });

          if (typeof options.insert === 'function') {
              options.insert(style);
          } else {
              var target = getTarget(options.insert || 'head');

              if (!target) {
                  throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
              }

              target.appendChild(style);
          }

          return style;
      }

      function removeStyleElement(style) {
          // istanbul ignore if
          if (style.parentNode === null) {
              return false;
          }

          style.parentNode.removeChild(style);
      }
      /* istanbul ignore next  */


      var replaceText = function replaceText() {
          var textStore = [];
          return function replace(index, replacement) {
              textStore[index] = replacement;
              return textStore.filter(Boolean).join('\n');
          };
      }();

      function applyToSingletonTag(style, index, remove, obj) {
          var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

          /* istanbul ignore if  */

          if (style.styleSheet) {
              style.styleSheet.cssText = replaceText(index, css);
          } else {
              var cssNode = document.createTextNode(css);
              var childNodes = style.childNodes;

              if (childNodes[index]) {
                  style.removeChild(childNodes[index]);
              }

              if (childNodes.length) {
                  style.insertBefore(cssNode, childNodes[index]);
              } else {
                  style.appendChild(cssNode);
              }
          }
      }

      function applyToTag(style, options, obj) {
          var css = obj.css;
          var media = obj.media;
          var sourceMap = obj.sourceMap;

          if (media) {
              style.setAttribute('media', media);
          } else {
              style.removeAttribute('media');
          }

          if (sourceMap && typeof btoa !== 'undefined') {
              css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
          } // For old IE

          /* istanbul ignore if  */


          if (style.styleSheet) {
              style.styleSheet.cssText = css;
          } else {
              while (style.firstChild) {
                  style.removeChild(style.firstChild);
              }

              style.appendChild(document.createTextNode(css));
          }
      }

      var singleton = null;
      var singletonCounter = 0;

      function addStyle(obj, options) {
          var style;
          var update;
          var remove;

          if (options.singleton) {
              var styleIndex = singletonCounter++;
              style = singleton || (singleton = insertStyleElement(options));
              update = applyToSingletonTag.bind(null, style, styleIndex, false);
              remove = applyToSingletonTag.bind(null, style, styleIndex, true);
          } else {
              style = insertStyleElement(options);
              update = applyToTag.bind(null, style, options);

              remove = function remove() {
                  removeStyleElement(style);
              };
          }

          update(obj);
          return function updateStyle(newObj) {
              if (newObj) {
                  if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
                      return;
                  }

                  update(obj = newObj);
              } else {
                  remove();
              }
          };
      }

      module.exports = function (list, options) {
          options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
          // tags it will allow on a page

          if (!options.singleton && typeof options.singleton !== 'boolean') {
              options.singleton = isOldIE();
          }

          list = list || [];
          var lastIdentifiers = modulesToDom(list, options);
          return function update(newList) {
              newList = newList || [];

              if (Object.prototype.toString.call(newList) !== '[object Array]') {
                  return;
              }

              for (var i = 0; i < lastIdentifiers.length; i++) {
                  var identifier = lastIdentifiers[i];
                  var index = getIndexByIdentifier(identifier);
                  stylesInDom[index].references--;
              }

              var newLastIdentifiers = modulesToDom(newList, options);

              for (var _i = 0; _i < lastIdentifiers.length; _i++) {
                  var _identifier = lastIdentifiers[_i];

                  var _index = getIndexByIdentifier(_identifier);

                  if (stylesInDom[_index].references === 0) {
                      stylesInDom[_index].updater();

                      stylesInDom.splice(_index, 1);
                  }
              }

              lastIdentifiers = newLastIdentifiers;
          };
      };

      /***/ }),
  /* 24 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_css_loader_5_2_7_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);
      /* harmony import */ var _node_modules_css_loader_5_2_7_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_5_2_7_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
      // Imports

      var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_5_2_7_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
      // Module
      ___CSS_LOADER_EXPORT___.push([module.i, "\n#history_chart[data-v-fb17aa8c]{\r\n                width: 100%;\r\n                height: calc(100% - 50px);\n}\r\n", ""]);
      // Exports
      /* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


      /***/ }),
  /* 25 */
  /***/ (function(module, exports, __webpack_require__) {

      "use strict";


      /*
MIT License http://www.opensource.org/licenses/mit-license.php
Author Tobias Koppers @sokra
*/
      // css base code, injected by the css-loader
      // eslint-disable-next-line func-names
      module.exports = function (cssWithMappingToString) {
          var list = []; // return the list of modules as css string

          list.toString = function toString() {
              return this.map(function (item) {
                  var content = cssWithMappingToString(item);

                  if (item[2]) {
                      return "@media ".concat(item[2], " {").concat(content, "}");
                  }

                  return content;
              }).join("");
          }; // import a list of modules into the list
          // eslint-disable-next-line func-names


          list.i = function (modules, mediaQuery, dedupe) {
              if (typeof modules === "string") {
                  // eslint-disable-next-line no-param-reassign
                  modules = [[null, modules, ""]];
              }

              var alreadyImportedModules = {};

              if (dedupe) {
                  for (var i = 0; i < this.length; i++) {
                      // eslint-disable-next-line prefer-destructuring
                      var id = this[i][0];

                      if (id != null) {
                          alreadyImportedModules[id] = true;
                      }
                  }
              }

              for (var _i = 0; _i < modules.length; _i++) {
                  var item = [].concat(modules[_i]);

                  if (dedupe && alreadyImportedModules[item[0]]) {
                      // eslint-disable-next-line no-continue
                      continue;
                  }

                  if (mediaQuery) {
                      if (!item[2]) {
                          item[2] = mediaQuery;
                      } else {
                          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
                      }
                  }

                  list.push(item);
              }
          };

          return list;
      };

      /***/ }),
  /* 26 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_style_loader_2_0_0_style_loader_dist_cjs_js_node_modules_css_loader_5_2_7_css_loader_dist_cjs_js_node_modules_vue_loader_16_8_3_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_menu_vue_vue_type_style_index_0_id_18a44f38_lang_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(27);
      /* empty/unused harmony star reexport */

      /***/ }),
  /* 27 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_style_loader_2_0_0_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(23);
      /* harmony import */ var _node_modules_style_loader_2_0_0_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_2_0_0_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
      /* harmony import */ var _node_modules_css_loader_5_2_7_css_loader_dist_cjs_js_node_modules_vue_loader_16_8_3_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_menu_vue_vue_type_style_index_0_id_18a44f38_lang_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28);



      var options = {};

      options.insert = "head";
      options.singleton = false;

      var update = _node_modules_style_loader_2_0_0_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_5_2_7_css_loader_dist_cjs_js_node_modules_vue_loader_16_8_3_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_menu_vue_vue_type_style_index_0_id_18a44f38_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



      /* harmony default export */ __webpack_exports__["default"] = (_node_modules_css_loader_5_2_7_css_loader_dist_cjs_js_node_modules_vue_loader_16_8_3_vue_loader_dist_stylePostLoader_js_node_modules_vue_loader_16_8_3_vue_loader_dist_index_js_ref_3_menu_vue_vue_type_style_index_0_id_18a44f38_lang_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

      /***/ }),
  /* 28 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony import */ var _node_modules_css_loader_5_2_7_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);
      /* harmony import */ var _node_modules_css_loader_5_2_7_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_5_2_7_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
      // Imports

      var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_5_2_7_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
      // Module
      ___CSS_LOADER_EXPORT___.push([module.i, "\n.zh-bg{\r\n            background: url(https://cdn.gwdang.com/images/extensions/xbt/newbar-top3.png) no-repeat;\n}\n.logo{\r\n                width: 60px;\r\n                height: 50px;\r\n                line-height: 50px;\r\n                text-align: center;\r\n                border-right: 1px solid #f7f8f9;\n}\n.logo img{\r\n                width: 30px;\r\n                height: 30px;\n}\n.bijia_list{\r\n            display: flex;\r\n            align-items: center;\n}\n.bijia_list .bijia_item{\r\n            padding: 0 20px;\r\n            border-right: 1px solid rgba(0,0,0,.06);\r\n            height: 100%;\r\n            line-height: 50px;\r\n            font-size: 14px;\r\n            font-weight: bold;\r\n            cursor: pointer;\n}\n.bijia_list .bijia_item:hover .bijia-goods-list{\r\n            display: block;\n}\n.bijia_list .bijia_item text{\r\n            margin-left: 10px;\r\n            color: #E4393C;\n}\n.price_status{\r\n            padding: 0 20px;\r\n            height: 100%;\r\n            display: flex;\r\n            align-items: center;\r\n            border-right: 1px solid rgba(0,0,0,.06);\r\n            font-size: 14px;\r\n            color: #333333;\r\n            cursor:pointer;\n}\n.price_status .price_status_icon{\r\n            width: 22px;\r\n            height: 20px;\r\n            display: inline-block;\r\n            line-height: 20px;\r\n            margin-right: 10px;\n}\n.price_status .history_price{\r\n            /* opacity: 0; */\r\n            position: absolute;\r\n            bottom: 50px;\r\n            left: -1px;\r\n            right: -1px;\r\n            background: #fff;\r\n            box-shadow: 0 -5px 10px 0 rgba(22,24,26,.15);\r\n            width: auto;\r\n            height: 350px;\n}\n.history_price .history-tips{\r\n            display: flex;\r\n            align-items: center;\r\n            height: 50px;\r\n            font-size: 12px;\r\n            margin: 0 30px;\n}\n.history-tips .max-price{\r\n            color: #e4393c;\r\n            font-weight: 700;\r\n            margin-right: 8px;\n}\n.history-tips .min-price{\r\n            color: #35bd68;\r\n            font-weight: 700;\r\n            margin-right: 8px;\n}\n.history-tips .tips{\r\n            background: #f7f7f7;\r\n            border-radius: 4px;\r\n            color: #666;\r\n            font-size: 12px;\r\n            height: 28px;\r\n            line-height: 28px;\r\n            margin-left: 41px;\r\n            padding-left: 15px;\r\n            padding-right: 15px;\n}\n.top_coupon_btn {\r\n            background: url(https://cdn.gwdang.com/images/extensions/coupon@3x.png) 0 0 no-repeat;\r\n            display: inline-flex;\r\n            height: 28px;\r\n            width: 189px;\r\n            white-space: nowrap;\r\n            position: relative;\r\n            z-index: 999999999999;\r\n            padding: 0 !important;\r\n            border: none !important;\r\n            background-size: cover;\r\n            align-items: center;\r\n            text-decoration: none!important;\r\n            margin: 0 48px 0 20px;\n}\n.top_coupon_btn * {\r\n            cursor: pointer;\n}\n.top_coupon_btn .top-coupon-tle {\r\n            flex: 1;\r\n            height: 12px;\r\n            text-align: center;\r\n            line-height: 12px;\r\n            margin-left: 4px;\r\n            font-size: 12px !important;\r\n            font-weight: normal !important;\r\n            color: #fff;\n}\n.top_coupon_btn .price-num {\r\n            font-size: 14px;\r\n            color: #FFFFFF;\r\n            font-weight: bold;\r\n            width: 56px;\r\n            height: 22px;\r\n            text-align: center;\r\n            margin-left: 3px;\r\n            line-height: 22px !important;\r\n            padding: 0px !important;\r\n            vertical-align: middle;\n}\n.top_coupon_btn .price-num span {\r\n            display: inline;\n}\n.top_coupon_btn .price-sm {\r\n            font-size: 12px;\r\n            transform: scale(0.8333);\r\n            transform-origin: bottom right;\n}\n.top_coupon_btn .link_hand {\r\n            display: inline-block;\r\n            height: 30px;\r\n            width: 38px;\r\n            position: absolute;\r\n            right: -38px;\r\n            top: -2px;\r\n            background: url(https://cdn.gwdang.com/images/extensions/newbar/hand.gif) 0px 0px no-repeat;\n}\n.bijia-goods-list {\r\n            display: none;\r\n            position: absolute;\r\n            bottom: 50px;\r\n            left: -1px;\r\n            right: -1px;\r\n            height: 270px;\r\n            background: #fff;\r\n            box-shadow: 0 -5px 10px 0 rgba(22,24,26,.15);\n}\n.bijia-goods-list .goods-list{\r\n            flex: 1;\r\n            overflow-x: auto;\r\n            display: flex;\r\n            align-items: center;\n}\n.bijia-goods-list .goods-list .goods-item{\r\n            display: inline-block;\r\n            text-align: center;\r\n            width: 270px;\r\n            margin: 0 10px;\n}\n.goods-list .goods-item img{\r\n            width: 120px;\r\n            height: 120px;\n}\n.goods-list .goods-item p{\r\n            font-size: 14px;\r\n            margin-top: 8px;\r\n            line-height: 1;\n}\n.goods-list .goods-item .price{\r\n            color: #E4393C;\n}\n.goods-list .goods-item .shop-name{\r\n            color: #666666;\n}\n.goods-list .goods-item .title{\r\n            height: 38px;\r\n            line-height: 19px;\r\n            width: 210px;\r\n            overflow: hidden;\r\n            margin: 8px auto 0 auto;\n}\n.bijia-goods-list .pre-page,.bijia-goods-list .next-page{\r\n            height: 33px;\r\n            width: 120px;\r\n            text-align: center;\n}\n.pre-page em,.next-page em{\r\n            height: 33px;\r\n            width: 20px;\r\n            display: inline-block;\r\n            cursor: pointer;\n}\n.pre-page em{\r\n            background-position: -112px -38px;\n}\n.pre-page em:hover{\r\n            background-position: -160px -38px;\n}\n.next-page em{\r\n            background-position: -137px -38px;\n}\n.next-page em:hover{\r\n            background-position: -185px -38px;\n}\n.bijia-goods-list .pagination{\r\n            position: absolute;\r\n            top: 15px;\r\n            width: auto;\r\n            right: 30px;\r\n            padding: 0;\r\n            text-align: center;\r\n            font-size: 12px;\r\n            margin: 0;\r\n            height: auto;\r\n            font-weight: 400;\r\n            color: #999999;\n}\r\n", ""]);
      // Exports
      /* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


      /***/ }),
  /* 29 */
  /***/ (function(module, __webpack_exports__, __webpack_require__) {

      "use strict";
      __webpack_require__.r(__webpack_exports__);
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppName", function() { return AppName; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppVersion", function() { return AppVersion; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppEnv", function() { return AppEnv; });
      /* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDev", function() { return isDev; });
      const AppName = "csq用"
      const AppVersion = "1.0.0"
      const AppEnv = "production"
      const isDev = AppEnv === 'development'



      /***/ })
  /******/ ]);