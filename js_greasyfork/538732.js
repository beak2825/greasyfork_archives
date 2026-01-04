// ==UserScript==
// @name         172号卡优化
// @namespace    nbhkdghgdbeaw8ywnr0cb3hba0p6pk4r
// @version      2025.06.15
// @description  一些优化项。
// @author       Me
// @match        https://haoka.lot-ml.com/*
// @match        https://h5.lot-ml.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538732/172%E5%8F%B7%E5%8D%A1%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/538732/172%E5%8F%B7%E5%8D%A1%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

//管理界面，增加全屏
if(location.href.indexOf("haoka.lot-ml.com/view/iframe.html") != -1){
    console.log("正在执行，管理界面优化");
    document.querySelector("a[href*='pro_list']").parentElement.innerHTML+=` <a href="javascript:;" id="fullpage_prolist">商品列表(全屏)</a>`;
    document.querySelector("#fullpage_prolist").onclick = ()=>{
        var frame_src=document.querySelector("a[href*='pro_list']").href;
        var iframe_div_style="z-index: 9999999999; width: 100%; height: 100%; position: fixed; top: 0px; left: 0px;";
        document.querySelector("iframe").src=frame_src;
        document.querySelector("#RightMain").setAttribute("style",iframe_div_style)
    };
}

//商品列表界面优化
if(location.href.indexOf("haoka.lot-ml.com/view/project/pro_list.html") != -1){
    var timeid=setInterval(() => {
        if(document.querySelector(".layui-laypage-limits")){
            pro_list_fun();
            clearInterval(timeid);
        }
    }, 500);
}//

//漂浮窗，套餐详情界面优化(注意，子页面是跨域状态)
if(location.href.indexOf("h5.lot-ml.com/PackInfo/Detail/") != -1){
    console.log("正在执行，套餐详情页面优化");
    //显示套餐ID(许多套餐相似度高，显示ID便于区分)
    Array.from(document.querySelectorAll("span")).some(ele=>{
        if (ele.innerHTML=="知识库") {
            ele.parentElement.innerHTML+=` <span>套餐ID</span>`+location.href.split("/Detail/")[1];
            return true;
        }
    });

}

// 定义函数，商品列表页面优化
function pro_list_fun(){
    console.log("正在执行，商品列表优化");
    // 商品列表页面优化
    if( document.querySelector(".layui-laypage-limits")
        && document.querySelector(".layui-laypage-limits").querySelector("select").value == "10"){
        //判断每页显示10，则为没有对页面进行优化。修改每页显示数量会触发表格刷新，所以先优化，再设置数量
        //设置默认为“在售”
        if(document.querySelector(`#OnShop`)){
            document.querySelector(`#OnShop`).parentElement.querySelectorAll("dd").forEach(ele=>{
                if(ele.innerHTML=="在售"){
                    ele.click();
                }
            })
        } //
        //默认设置为“不是宽带”（是手机卡）
        if(document.querySelector(`#IsKuan`)){
            document.querySelector(`#IsKuan`).parentElement.querySelectorAll("dd").forEach(ele=>{
                if(ele.innerHTML=="否"){
                    ele.click();
                }
            })
        }//
        //设置每页数量为最大（数据表格会自动按新数量显示）
        document.querySelector(".layui-laypage-limits").querySelector("select").lastElementChild.selected="true";
        document.querySelector(".layui-laypage-limits").querySelector("select").dispatchEvent(new Event('change', {
            bubbles: true,
            cancelable: true
        })); //end 每页数量最大。(修改值不会触发change事件，用dispatchEvent触发)
        //因为搜索条件变化，触发一次搜索
        setTimeout(() => {
            document.querySelectorAll("button").forEach(ele=>{
                if (ele.innerHTML.trim() == "开始查询") {
                    ele.click();
                }
            })
        }, 500);//
    } // end 商品页面优化


    //优化套餐详细内容弹窗大小，避免漂浮窗显示不完整，无法显示关闭按钮问题
    document.getElementById('layui-content').addEventListener('click', function(event) {//在数据表格的父级容器监视点击事件
        const targetElement = event.target;//触发事件的元素
        if(targetElement.tagName == "BUTTON" && targetElement.innerHTML.indexOf("查看资料") != -1){
            setTimeout(() => {
                detailwindows_resize();
            }, 500);
        }
        //console.log('触发事件的元素是: ' + targetElement.tagName);
    });// end 优化套餐详细内容弹窗大小
    window.addEventListener('resize',detailwindows_resize);//页面大小变化时，也需要调整
    function detailwindows_resize(){
        if(document.querySelector(".layui-layer-iframe")){
			if( document.querySelector(".layui-layer-iframe").querySelector("iframe[id^='layui-layer-iframe']").src.indexOf("/PackInfo/Detail/") != -1){
                document.querySelector(".layui-layer-iframe").style.top="0";//避免出现负数，显示在可视页面之外
                var iframe_height=document.documentElement.clientHeight;
				document.querySelector(".layui-layer-iframe").style.height=iframe_height+"px";
                document.querySelector("iframe[id^='layui-layer-iframe']").style.height=iframe_height-52+"px";
            }
        }
    }
}

})();