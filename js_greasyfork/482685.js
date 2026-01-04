// ==UserScript==
// @name        关闭Bing搜索框必应上的热点
// @name:zh     关闭Bing搜索框必应上的热点
// @name:en     Bing homepage optimisation
// @namespace   关闭Bing搜索框必应上的热点
// @description 关闭Bing搜索框必应上的热点，基于Bing首页优化，去除bing首页的国内版和国际版切换标签，去除底部的版权信息和广告链接，保留首页壁纸切换按钮，去除“今日热点”，锁定Bing，不自动到顶端。
// @description:zh 关闭Bing搜索框必应上的热点，基于Bing首页优化，去除bing首页的国内版和国际版切换标签，去除底部的版权信息和广告链接，保留首页壁纸切换按钮，去除“今日热点”，锁定Bing，不自动到顶端。
// @description:en close bing search box hot point，base on Bing homepage optimisation, remove the switch tabs between domestic and international version on bing homepage, remove the copyright information and advertisement links at the bottom, keep the wallpaper switch button on homepage, remove the "Today's Hot Spots", and lock Bing to not go to the top automatically.
// @author      hd edit by girl
// @icon        https://favicon.yandex.net/favicon/v2/bing.com
// @include     *://cn.bing.com/*
// @include     *://cn.bing.com/chrome/newtab
// @version     1.0.18
// @license     GPL-3.0-only
// @home-url    https://greasyfork.org/zh-CN/scripts/482685
// @downloadURL https://update.greasyfork.org/scripts/482685/%E5%85%B3%E9%97%ADBing%E6%90%9C%E7%B4%A2%E6%A1%86%E5%BF%85%E5%BA%94%E4%B8%8A%E7%9A%84%E7%83%AD%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/482685/%E5%85%B3%E9%97%ADBing%E6%90%9C%E7%B4%A2%E6%A1%86%E5%BF%85%E5%BA%94%E4%B8%8A%E7%9A%84%E7%83%AD%E7%82%B9.meta.js
// ==/UserScript==
//

(function() {

    'use strict';

    document.querySelectorAll("input#sb_form_q.sb_form_q").forEach(node =>
    node.addEventListener(
      "click",
      event => event.stopImmediatePropagation(),
      true
    )
  );
    document.querySelectorAll("input#sb_form_q.sb_form_q").forEach(node =>
    node.addEventListener(
      "blur",
      event => event.stopImmediatePropagation(),
      true
    )
  );
    document.querySelectorAll("input#sb_form_q.sb_form_q").forEach(node =>
    node.addEventListener(
      "blurfocusIme",
      event => event.stopImmediatePropagation(),
      true
    )
  );
    document.querySelectorAll("input#sb_form_q.sb_form_q").forEach(node =>
    node.addEventListener(
      "input",
      event => event.stopImmediatePropagation(),
      true
    )
  );
    document.querySelectorAll("input#sb_form_q.sb_form_q").forEach(node =>
    node.addEventListener(
      "keydown",
      event => event.stopImmediatePropagation(),
      true
    )
  );

    // 循环加载 页面元素修改函数
    var timeFunction = window.setInterval(function(){loadEnd()},1);
    //====================================================================================
    // 修改页面元素
    function loadEnd(){
        /*
        var footer = document.querySelector('#footer');
        var searchNav = document.querySelector('#est_switch');
        var searchBox = document.querySelector('.sb_form_q');
        var sbox = document.querySelector('.sbox');
        var headline = document.querySelector('#headline');
        var hp_trivia_inner = document.querySelector('.hp_trivia_inner');
        var id_rh = document.querySelector('#id_rh');
        var id_qrcode = document.querySelector('#id_qrcode');
        var sa_zis_PN = document.querySelector('#sa_zis_PN');//去除cn.bing.com主页“今日热点”
        var sa_ul = document.getElementById('sa_ul');//去除新标签页“今日热点”
        var get_URL = document.URL.match("[?]");//获取当前URL，仅对bing主页去除国内国外切换标签

        //匹配bing主页时，锁定当前页面，隐藏下拉滚动条
        if (get_URL==null) {
            document.documentElement.style.overflowY = "hidden"
        }

        if (footer){
            hidenDom(footer);
        }
        if (searchNav&&(get_URL==null)){
            hidenDom(searchNav);
        }

        if (sbox){
            sbox.style.margin='0';
            sbox.style.top = "30%"; // 设置位置
            sbox.style.left = "30%";
        }
        if (headline){
            hidenDom(headline);
        }
        if (hp_trivia_inner){
            hidenDom(hp_trivia_inner);
        }
        if (id_rh) {
            hidenDom(id_rh);
        }
        if (id_qrcode) {
            hidenDom(id_qrcode);
        }
        //去除主页cn.bing.com搜索框内部 “今日热点”
        if (sa_zis_PN) {
            hidenDom(sa_zis_PN);
        }
        //去除新标签页搜索框内部 “今日热点”
        if (sa_ul) {
            var sa_ul_child = sa_ul.children;
            for (var i = 0; i < sa_ul_child.length; i++) {
                if (sa_ul_child[i].className == 'sa_hd'){
                    for (var j = i; j < sa_ul_child.length; j++){
                        hidenDom(sa_ul_child[j]);
                    }
                    break;
                }
            }
        }
        */
        var sb_form_placeholder = document.querySelector('.sb_form_placeholder');
        if(sb_form_placeholder){
            removeDom(sb_form_placeholder);
        }
    }

    function removeDom(dom){
        if(dom){
            dom.remove();
        }
    }

    function hidenDom(dom){
        if(dom){
            dom.style.display = 'none';
        }
    }
    //====================================================================================


    //====================================================================================
    // 修改搜索框
    /*
    function SearchBoxEditor(){

        var searchbox= document.querySelector('#sb_form_q');
        var searchLabel = document.querySelector('#sb_form');

        searchLabel.style.backgroundColor = "#FFFFFF00";

        function SearchBoxOnFocus(){
            searchLabel.style.backgroundColor = "#FFFFFF";
        }

        function SearchBoxOnBlur(){
            searchLabel.style.backgroundColor = "#FFFFFF00";
        }

        function SearchBoxOnMouseOver(){
            if(document.activeElement.id == "sb_form_q"){
                // still
                searchLabel.style.backgroundColor = "#FFFFFF";
             }else{
                searchLabel.style.backgroundColor = "#FFFFFF00";
            }
         }

        function SearchBoxOnMouseLeave(){
            if(document.activeElement.id == "sb_form_q"){
                // still
            }else{
                searchLabel.style.backgroundColor = "#FFFFFF00";
            }
          }

        searchbox.onblur = SearchBoxOnBlur; // 失去焦点
        searchbox.onfocus = SearchBoxOnFocus; // 获得焦点
        searchbox.onclick = SearchBoxOnFocus;// 点击事件
        searchLabel.onclick = SearchBoxOnFocus; // 点击事件
        searchLabel.onmouseover = SearchBoxOnMouseOver; // 鼠标滑过
        searchLabel.onmouseleave = SearchBoxOnMouseLeave; // 鼠标离开 = 失去焦点

     }

    window.setTimeout(SearchBoxEditor,10); // 初始化函数
    */
    //====================================================================================
})();
