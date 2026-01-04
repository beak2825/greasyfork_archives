// ==UserScript==
// @name         淘宝&天猫-宝贝评论自定义翻页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  淘宝&天猫宝贝页面评论页增加按钮可自定义页数翻页
// @author       You
// @match        https://item.taobao.com/item.htm?*
// @match        http://item.taobao.com/item.htm?*
// @match        https://detail.tmall.com/item.htm?*
// @match        http://detail.tmall.com/item.htm?*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/40678/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB-%E5%AE%9D%E8%B4%9D%E8%AF%84%E8%AE%BA%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/40678/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB-%E5%AE%9D%E8%B4%9D%E8%AF%84%E8%AE%BA%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {

var taobaoAndtmall_soso_view = function(row,atype){

    if(row.children.length == 0){
        return true;
    }
    var div = document.createElement("div");
    div.className = "htb-shop-search";
    if(atype == "taobao"){
        div.className = "htb-shop-search htb";
    }
    div.innerHTML = '<div class="hsearch-panel">\
                <div class="hsearch-panel-focused">\
                  <div class="hsearch-button">\
                    <button id="pjfy_btn_fanye"  type="submit">翻页</button>\
                  </div>\
                  <div class="hsearch-panel-fields" >\
                    <input id="pjfy_input_fanye" aria-label="页数" placeholder="页数">\
                  </div>\
                </div>\
              </div>';
    row.appendChild(div);
    var a  = document.getElementById("pjfy_btn_fanye");
    a.dataset.dtype = atype;
    a.onclick = function(){
       var val = document.getElementById("pjfy_input_fanye");
        page = val.value;
        islanjie = true;
        if(this.getAttribute('dtype')=="taobao"){
            document.getElementsByClassName("pg-next")[0].click();
        }
        if(this.getAttribute('dtype')=="tmall"){
            document.getElementsByClassName("rate-paginator")[0].getElementsByTagName("a")[2].click();
        }
    };
    var i = document.getElementById("pjfy_input_fanye");
    i.onkeypress = function(event){
        if (event.keyCode==13){  //回车键的键值为13
            console.log("回车");
            document.getElementById("pjfy_btn_fanye").click(); //调用登录按钮的登录事件
        }
    };
};
    var fenge_taobao = function(url){
      var left_index = url.indexOf("currentPageNum");
      var left = url.substring(0,left_index);
      var right_index = url.indexOf("pageSize");
      var right = url.substring(right_index,url.length);
      var newurl = left + "currentPageNum="+page+"&pageSize" + right;
      islanjie= false;
     return newurl;
    };
    var fenge_tmall = function(url){
      var left_index = url.indexOf("currentPage");
      var left = url.substring(0,left_index);
      var right_index = url.indexOf("append");
      var right = url.substring(right_index,url.length);
      var newurl = left + "currentPage="+page+"&append" + right;
     return newurl;
    };
    var getScript = KISSY.getScript;
    var page = 0;
    var soso_btn = null;
    var islanjie = false;
    KISSY.getScript = function(j, b, g){
        if(islanjie && (j.indexOf("feedRateList.htm") > 0 || j.indexOf("list_detail_rate.htm") > 0)){
            if(j.indexOf("feedRateList.htm") > 0){
                j = fenge_taobao(j);
            }
            if(j.indexOf("list_detail_rate.htm") > 0){
                j = fenge_tmall(j);
            }
            islanjie = false;
            //feedRateList.htm 淘宝
            //list_detail_rate.htm 天猫
            console.log("访问评论页面");
        }
        return getScript(j,b,g);
    };
    //reviews
    var css = document.createElement('style');
        css.innerHTML = ".htb-shop-search{display:inline-block}.hsearch-panel-focused{height:27px;line-height:27px;margin:5px 14px;width:130px;background:#ff0036}.hsearch-panel-fields{float:left;margin:1px;line-height:26px;margin:0;font-size:15px;margin-left:2px}.hsearch-button{width:54px;display:inline-block;text-align:left}#pjfy_btn_fanye{display:block;padding:2px 5px;font-size:15px;width:100%;background:#ff0036;border:0;color:#FFF}#pjfy_input_fanye{width:70px;border:0;text-align:center}.htb .hsearch-panel-focused{background:#f40}.htb{margin-top:1em;float:right}.htb #pjfy_btn_fanye{background:#f40}" ;
        //row.appendChild(css);
        document.body.appendChild(css);
    if(window.location.href.indexOf('taobao.com') > 0){
        document.getElementById('reviews').addEventListener('DOMNodeInserted',function(e){
            var row = e.srcElement;
            var index = row.className;
            if(index && index.indexOf("thm-1 align-r") >= 0 ){
                taobaoAndtmall_soso_view(row,"taobao");
            }
        },false);
    }
    if(window.location.href.indexOf('tmall.com') > 0){
        document.getElementById('J_Reviews').addEventListener('DOMNodeInserted',function(e){
            var row = e.srcElement;
            var index = row.className;
            if(index && index == "rate-paginator"){
                taobaoAndtmall_soso_view(row,"tmall");
            }
        },false);
    }
    console.log("插件加载成功");
    // Your code here...
})();