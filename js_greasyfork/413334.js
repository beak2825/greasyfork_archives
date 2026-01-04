// ==UserScript==
// @name         吾爱搜索固定导航
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  搜索框置顶（含动画）
// @author       涛之雨
// @match        https://www.52pojie.cn/*
// @grant	     none
// @note         滚动&点击外面控件自动缩小，输入&点击&移入自动还原
// @icon         https://www.52pojie.cn/favicon.ico
// @home-url	 https://greasyfork.org/zh-CN/scripts/413334
// @downloadURL https://update.greasyfork.org/scripts/413334/%E5%90%BE%E7%88%B1%E6%90%9C%E7%B4%A2%E5%9B%BA%E5%AE%9A%E5%AF%BC%E8%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/413334/%E5%90%BE%E7%88%B1%E6%90%9C%E7%B4%A2%E5%9B%BA%E5%AE%9A%E5%AF%BC%E8%88%AA.meta.js
// ==/UserScript==

(function() {
    var isTarget=false;
    function a(){
        document.querySelector("#scbar_txt").style.width="400px";
        document.querySelector("#scbar_txt").setAttribute("placeholder","请输入搜索内容");
        document.querySelector(".scbar_hot_td").style.display='';
        document.querySelector(".scbar_btn_td").style.width='38px';
        document.querySelector(".scbar_type_td").style.display='';
    }
    function a2(){
        document.querySelector("#scbar_txt").style.width="18px";
        document.querySelector("#scbar_txt").setAttribute("placeholder","搜");
        document.querySelector(".scbar_hot_td").style.display='none';
        document.querySelector(".scbar_btn_td").style.width='59px';
        document.querySelector(".scbar_type_td").style.display='none';
    }
    function b(c){
        if(c===undefined){
            a2();
            return;
        }else{
            document.querySelector("#scbar_form > table > tbody > tr").childNodes.forEach(function(b){
                if(b===c.target||c.target===document.querySelector("#scbar_txt")){
                    isTarget=true;
                    return;
                }
            });
            if(isTarget){
                a();
                isTarget=false;
                return;
            }else{
                a2();
            }
        }
    }
document.querySelector("#scbar_txt").setAttribute('style', "-webkit-transition:.5s width;-o-transition:.5s width;-moz-transition:.5s width;transition:.5s width;");
document.querySelector(".scbar_type_td").setAttribute('style', "-webkit-transition:.5s width;-o-transition:.5s width;-moz-transition:.5s width;transition:.5s width;");
    window.onscroll=function(e){
        var doc=document.getElementById("scbar");
        if(doc){
            if(document.querySelector("#nv").offsetTop==0){
                b();
                doc.style.cssText="position:fixed;top:33px;z-index:999;";
                document.querySelector(".scbar_txt_td").style.height='42px';
                document.querySelector(".comiis_nav").style.display='none';
                document.querySelector("#scbar_txt").addEventListener("propertychange", a, false);
                document.querySelector("#scbar_txt").addEventListener("input", a, false);
                document.querySelector("body").addEventListener("click", b, false);
            }else{
                doc.style.cssText="";
                a();
                document.querySelector(".scbar_txt_td").style.height='';
                document.querySelector(".comiis_nav").style.display='';
                document.querySelector("#scbar_txt").removeEventListener("propertychange", a, false);
                document.querySelector("#scbar_txt").removeEventListener("input", a, false);
                document.querySelector("body").removeEventListener("click", b, false);
            }
        }
    }
})();