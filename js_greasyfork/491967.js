// ==UserScript==
// @name         行业洞察_类目
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  云图扩展工具
// @author       siji-Xian
// @match        *://yuntu.oceanengine.com/yuntu_ng/product/industry/marketOverview?*
// @icon         https://lf3-static.bytednsdoc.com/obj/eden-cn/prhaeh7pxvhn/yuntu/yuntu-logo_default.svg
// @grant        none
// @license      MIT
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @require      https://cdn.bootcss.com/moment.js/2.20.1/moment.min.js
// @require      https://greasyfork.org/scripts/404478-jsonexportexcel-min/code/JsonExportExcelmin.js?version=811266
// @require      https://greasyfork.org/scripts/455576-qmsg/code/Qmsg.js?version=1122361
// @downloadURL https://update.greasyfork.org/scripts/491967/%E8%A1%8C%E4%B8%9A%E6%B4%9E%E5%AF%9F_%E7%B1%BB%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/491967/%E8%A1%8C%E4%B8%9A%E6%B4%9E%E5%AF%9F_%E7%B1%BB%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var new_element = document.createElement("link");
  new_element.setAttribute("rel", "stylesheet");
  new_element.setAttribute("href", "https://qmsg.refrain.xyz/message.min.css");
  document.body.appendChild(new_element);

  const button = document.createElement("div");
  button.textContent = "导出所有类目";
  Object.assign(button.style, {
    height: "34px",
    lineHeight: "var(--line-height, 34px)",
    alignItems: "center",
    color: "white",
    background: "linear-gradient(90deg, rgba(0, 239, 253), rgba(64, 166, 254))",
    borderRadius: "5px",
    marginLeft: "10px",
    fontSize: "13px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: "500",
  });
  button.addEventListener("click", urlClick);

  //message.js
  let loadingMsg = null;

  //目标数据
  let target_data = null;

  (function listen() {
    var origin = {
      open: XMLHttpRequest.prototype.open,
      send: XMLHttpRequest.prototype.send,
    };
    XMLHttpRequest.prototype.open = function (a, b) {
      this.addEventListener("load", replaceFn);
      origin.open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (a, b) {
      origin.send.apply(this, arguments);
    };
    function replaceFn(obj) {
      if (
        this?._url?.slice(0, 42) == "/product_node/v2/api/industry/categoryList"
      ) {
        target_data = JSON.parse(obj?.target?.response);
      }
    }
  })();

  function appendDoc() {
    const likeComment = document.querySelectorAll(".Header__Container-doYohE.dhvCdO")[0];
    if (likeComment) {
      likeComment.append(button);
      return;
    }
    setTimeout(appendDoc, 1000);
  }
  appendDoc();

  function getData(e){

    //数据处理
    function flattenObject(obj, prefix = '') {
      var result = [];
    
      if (prefix !== '') {
        prefix += '_';
      }
    
      var item = {
          name: prefix + obj.name,
          parent_id: obj.parent_id,
          id: obj.id
      };
    
      result.push(item);
    
      if (obj.children) {
        obj.children.forEach(function(child) {
          if (child.children && child.children.length > 0) {
            result.push(...flattenObject(child, item.name));
          } else {
            var childItem = {
              name: item.name + '_' + child.name,
              parent_id: child.parent_id,
              id: child.id
            };
            result.push(childItem);
          }
        });
      }
    
      return result;
    }

    let b = e.data.map(item => {
      return flattenObject(item);
    }).flat().filter(e=>{
      return e.id != '-999'
    })

    expExcel(b);
  }

  

  function expExcel(e) {

    let contrast = {
      name: "name",
      parent_id: "parent_id",
      id: "id"
    };

    let option = {};
    option.fileName = "类目"; //文件名
    option.datas = [
      {
        sheetName: "",
        sheetData: e,
        sheetHeader: Object.keys(contrast),
        sheetFilter: Object.values(contrast),
        columnWidths: [], // 列宽
      }
    ];
    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    loadingMsg.close();
  }

  function urlClick() {
    if (target_data) {
      loadingMsg = Qmsg.loading("正在导出，请勿重复点击！");
      getData(target_data);
    } else {
      loadingMsg = Qmsg.error("数据加载失败，请等待页面加载完成！");
    }
  }
})();
