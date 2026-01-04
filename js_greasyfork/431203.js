// ==UserScript==
// @name         粉笔视频去除
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  上班时练粉笔题目，视频VIP提示太大太碍眼，容易被人发现，特意去除。又加了修改标签页名称
// @author       WYF
// @include      http*://*fenbi.com/*
// @include      https://spa.fenbi.com/tiku/*
// @match        *://spa.fenbi.com/tiku/*
// @grant        none
// @antifeature  tracking 跟踪跳转历史来实现进入题目后执行代码
// @downloadURL https://update.greasyfork.org/scripts/431203/%E7%B2%89%E7%AC%94%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/431203/%E7%B2%89%E7%AC%94%E8%A7%86%E9%A2%91%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }



    //来自https://www.manongdao.com/article-12554.html 监听浏览器地址变化
    /* These are the modifications: */
    history.pushState = ( f => function pushState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = ( f => function replaceState(){
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replaceState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate',()=>{
        window.dispatchEvent(new Event('locationchange'))
    });


    window.addEventListener('locationchange', function(){
        console.log('location changed!');
        setTimeout(function(){ mychange(); }, 3000);
    });

    function mychange() {
        console.log("网页原始标题"+document.title);
        document.title = '后台管理系统';
        console.log("修改完毕！！！！！！！！！！！！！！");
        var lia = document.getElementsByClassName("video-item");
        for(var i=0;i<lia.length;i++){
            lia[i].style.display = "none";
        }
        console.log("删除完毕！！！！！！！！！！！！！！");
        var header=document.getElementsByClassName("simple-nav-header bg-color-gray-bold")[0];
        if(header== undefined || header.length==0) return;
        //高度设置为0，即可隐藏白色条幅
        header.style.height="0";
        //将白条中间影响视觉的标题去掉，只保留返回按钮
        header.childNodes[0].childNodes[1].style.visibility="hidden";


        //紧凑底部答题卡布局
        //document.getElementsByClassName("fb-collpase-header bg-color-gray-mid border-gray-mid")[0].style.height="0";


        var div2=document.getElementsByClassName("fb-collpase-content border-gray-mid bg-color-gray-mid")[0];
        //设置整个答题卡为半透明
        addGlobalStyle('.fb-collpase-bottom.bg-color-gray-mid {opacity:0.5}');
        addGlobalStyle('.fb-collpase-bottom.bg-color-gray-mid:hover {opacity:1}');
        //document.getElementsByClassName("fb-collpase-bottom bg-color-gray-mid")[0].style.opacity="0.5";

        div2.style.paddingTop="0";
        div2.childNodes[0].childNodes[0].style.display="none";
        div2.childNodes[0].childNodes[1].style.marginBottom="0";


        //答题卡隐藏时底部多余的白条也去掉
        var div3 = document.getElementsByClassName("fb-collpase-content-hidden bg-color-gray-mid border-gray-mid")[0];
        div3.style.paddingTop="0"
        div3.style.height="0";

    };
})();
