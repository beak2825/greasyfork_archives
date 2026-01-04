// ==UserScript==
// @run-at document-idle
// @name         VCP快速获取处理
// @version      0.15
// @description  方便自己导出促销提报使用
// @author       weixin：SoundEgg
// @match        https://prom-vc.jd.com/sub_promotion/unitPromotion/listPage
// @match        https://vcpps.jd.com/sub_itemleft/price/initPriceListPage
// @match       https://vca.jd.com/sub_coupon_activity/activityItem/initItemList?activityId=*
// @namespace https://greasyfork.org/users/700851
// @note            2020.12-14-V0.15 增加修改促销提报时，可以任意修改显示数量
// @note            2020.11-05-V0.12 增加采购价详情导出

// @downloadURL https://update.greasyfork.org/scripts/415381/VCP%E5%BF%AB%E9%80%9F%E8%8E%B7%E5%8F%96%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/415381/VCP%E5%BF%AB%E9%80%9F%E8%8E%B7%E5%8F%96%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
     if (window.location.href.indexOf('/sub_itemleft/price/initPriceListPage') !== -1) {
         addhtmlprice()
         //添加点击监听
         var obj2 =  document.getElementById('toexport3')
         obj2.addEventListener("click", () => {
             getpricedata();
         });

     }else if(window.location.href.indexOf('/unitPromotion/listPage') !== -1){
         addhtml()
         //添加点击监听
         var obj3 =  document.getElementById('toexport2')
         obj3.addEventListener("click", () => {
             getdata();
         });
     }else if(window.location.href.indexOf('/sub_coupon_activity/activityItem/initItemList') !== -1){

         addhtml2()
         var obj4 =  document.getElementById('toexport4')
         obj4.addEventListener("click", () => {
             getqeu();
         });
     };



})();
function addhtml2(){
  var obj =  $('.fl.ml10')[0];
          obj.insertAdjacentHTML("afterEnd", `

                        <input id="toexport4" type="button"  value="增加页码" class="btn btn-primary" style="padding-bottom: 20px;width: 65px;text-align: center;line-height:inherit;margin-left:-30px;">

                                      `);

}
function getqeu(){
   //修改提供优惠券数量
   var num=prompt("输入需要修改的采购价数量，默认为50","50");
   var obj=$('#vcGps_item_list_page')[0];
   obj.insertAdjacentHTML("beforeend",'<option value="'+num+'">'+num+'条</option>')
};
function getpricedata(){
    var num=prompt("输入需要导出的采购价数量，默认为30","30");
    var downloadName=getdownloadName("采购价导出");
    var t= {
        "length": num,
        "page": "1",
        "sidx": "wareId",
        "sord": "desc"
    };
    var t2 =$("#serchFrom").serializeJson()
    //合并json
    var object2 = $.extend({}, t2, t);
    $.post("/sub_itemleft/price/findPriceList",object2,function(data,status){
         clickDownloadprice(data["jsonList"],downloadName)
        //console.log(data["jsonList"])
    },"json");
    return t
};
//下载采购价格
function clickDownloadprice(csvJson,downloadName){
	JSonToCSV.setDataConver({
	  data: csvJson,
	  fileName: downloadName,
	  columns: {
	    title: ['商品编码','商品标题','含税采购价','不含税价格','税率','税额'],//csv表头
	    key: ['wareId', 'name', 'price',"taxFreePrice","taxRate","taxPrice"],
	    formatter: function(n, v) {
			if(n === 'avg_click_user_cnt') {
		      	return Number(v).toFixed(2);
			}
			if(v === undefined){
				return " ";
			}
	    }
	  }
	});
};
function addhtmlprice(){
    //添加按钮
     var obj = $("input.btn:nth-child(2)")[0]
     obj.insertAdjacentHTML("afterEnd", `
                <tr>
                    <td style="padding-bottom: 20px;">
                        <input id="toexport3" type="button"  value="采购价详情导出" class="btn btn-success">
                    </td>
                </tr>
                                      `)
}

function addhtml(){
    //添加按钮
     var obj = document.getElementById('export')
     obj.insertAdjacentHTML("afterEnd", `
				<tr>
					<td style="padding-bottom: 20px;">
						<a id="toexport2" type="button"  class="btn-c2 btn-h1">点我导出</a>
					</td>
				</tr>
                                      `)
}
function getdownloadName(tname){
   var mydate = new Date();
   var str = "" + mydate.getFullYear() + "年";
   str += (mydate.getMonth()+1) + "月";
   str += mydate.getDate() + "日";
   return str+=tname;
  };

function getdata(){
    var num=prompt("输入需要导出的促销数量，默认为30","30");
    var downloadName=getdownloadName("促销导出");
    $.post("/sub_promotion/unitPromotion/initPromotionGrid",{
        "vcGps": num,
        "length": num,
        "page": "1",
        "sidx": "",
        "sord": ""
    },function(data,status){
         clickDownload(data["jsonList"],downloadName)
    },"json");
    return t
};

function getdata2(){
    $.ajax({
        url: "/sub_promotion/unitPromotion/initPromotionGrid",
        type: "post",
        dataType: "json",
        data: {"vcGps": "50","length": "50","page": "1","sidx": "","sord": ""},
        success: function (data) {

        }
    });
}
function clickDownload(csvJson,downloadName){
	JSonToCSV.setDataConver({
	  data: csvJson,
	  fileName: downloadName,
	  columns: {
	    title: ['商品编码','促销编码','促销名称','商品标题','促销价格','日常价格','采购价','毛利','促销开始时间','促销结束时间'],//csv表头
	    key: ['wareId', 'promotionId', 'promotionName',"wareName","fixedPrice","jdPrice","cbjPrice","grossmargin","startTimeStr","endTimeStr"],
	    formatter: function(n, v) {
			if(n === 'avg_click_user_cnt') {
		      	return Number(v).toFixed(2);
			}
			if(v === undefined){
				return " ";
			}
	    }
	  }
	});
};
//csv下载
(function( global, factory ) {
  "use strict";
  if(typeof module === "object" && typeof module.exports === "object" ) {
    module.exports = global.document ?
			factory( global, true ) :
			function(w) {
				return factory(w);
			};
	} else {
		factory(global);
	}
})(window, function(){
  var JSonToCSV = {
    /*
     * obj是一个对象，其中包含有：
     * ## data 是导出的具体数据
     * ## fileName 是导出时保存的文件名称 是string格式
     * ## showLabel 表示是否显示表头 默认显示 是布尔格式
     * ## columns 是表头对象，且title和key必须一一对应，包含有
          title:[], // 表头展示的文字
          key:[], // 获取数据的Key
          formatter: function() // 自定义设置当前数据的 传入(key, value)
     */
    setDataConver: function(obj) {
      var bw = this.browser();
      if(bw['ie'] < 9) return; // IE9以下的
      var data = obj['data'],
          ShowLabel = typeof obj['showLabel'] === 'undefined' ? true : obj['showLabel'],
          fileName = (obj['fileName'] || 'UserExport') + '.csv',
          columns = obj['columns'] || {
              title: [],
              key: [],
              formatter: undefined
          };
      var ShowLabel = typeof ShowLabel === 'undefined' ? true : ShowLabel;
      var row = "", CSV = '', key;
      // 如果要现实表头文字
      if (ShowLabel) {
          // 如果有传入自定义的表头文字
          if (columns.title.length) {
              columns.title.map(function(n) {
                  row += n + ',';
              });
          } else {
              // 如果没有，就直接取数据第一条的对象的属性
              for (key in data[0]) row += key + ',';
          }
          row = row.slice(0, -1); // 删除最后一个,号，即a,b, => a,b
          CSV += row + '\r\n'; // 添加换行符号
      }
      // 具体的数据处理
      data.map(function(n) {
          row = '';
          // 如果存在自定义key值
          if (columns.key.length) {
              columns.key.map(function(m) {
                  row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(m, n[m]) || n[m] : n[m]) + '",';
              });
          } else {
              for (key in n) {
                  row += '"' + (typeof columns.formatter === 'function' ? columns.formatter(key, n[key]) || n[key] : n[key]) + '",';
              }
          }
          row.slice(0, row.length - 1); // 删除最后一个,
          CSV += row + '\r\n'; // 添加换行符号
      });
      if(!CSV) return;
      this.SaveAs(fileName, CSV);
    },
    SaveAs: function(fileName, csvData) {
      var bw = this.browser();
      if(!bw['edge'] && !bw['ie']) {
        var alink = document.createElement("a");
        alink.id = "linkDwnldLink";
        alink.href = this.getDownloadUrl(csvData);
        document.body.appendChild(alink);
        var linkDom = document.getElementById('linkDwnldLink');
        linkDom.setAttribute('download', fileName);
        linkDom.click();
        document.body.removeChild(linkDom);
      }
      else if(bw['ie'] >= 10 || bw['edge'] == 'edge') {
        var _utf = "\uFEFF";
        var _csvData = new Blob([_utf + csvData], {
            type: 'text/csv'
        });
        window.navigator.msSaveBlob(_csvData, fileName);
      }
      else {
        var oWin = window.top.open("about:blank", "_blank");
        oWin.document.write('sep=,\r\n' + csvData);
        oWin.document.close();
        oWin.document.execCommand('SaveAs', true, fileName);
        oWin.close();
      }
    },
    getDownloadUrl: function(csvData) {
      var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
      if (window.Blob && window.URL && window.URL.createObjectURL) {
          var csvData = new Blob([_utf + csvData], {
              type: 'text/csv'
          });
          return URL.createObjectURL(csvData);
      }
      // return 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csvData);
    },
    browser: function() {
      var Sys = {};
      var ua = navigator.userAgent.toLowerCase();
      var s;
      (s = ua.indexOf('edge') !== - 1 ? Sys.edge = 'edge' : ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1]:
          (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
          (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
          (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
          (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
          (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
      return Sys;
    }
  };
  window.JSonToCSV = JSonToCSV;
});

