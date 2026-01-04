// ==UserScript==
// @name         粉笔题库的刷题页去除多余遮挡
// @namespace    chwang
// @version      0.1.4
// @description  很多人用的都是16：9等宽屏显示器，除去系统任务栏和浏览器占用的纵向空间，网页显示区域高度已经很小。粉笔练习页面顶部白色的遮挡条仅用于显示标题，并且太粗，毫无意义；底部的答题卡导航区域白色留白太多，重复的标题也无意义，这两者都是一直显示的，占地方严重影响内容显示区域，此外答题卡隐藏时也有白条，所以都打算去掉和精简，答题卡显示半透明（能看清错题位置就行了）。效果会延迟5秒钟呈现。
// @author       chwang
// @include      http*://*fenbi.com/*
// @grant        none
// @antifeature  tracking 跟踪跳转历史来实现进入题目后执行代码
// @downloadURL https://update.greasyfork.org/scripts/419744/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%E7%9A%84%E5%88%B7%E9%A2%98%E9%A1%B5%E5%8E%BB%E9%99%A4%E5%A4%9A%E4%BD%99%E9%81%AE%E6%8C%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/419744/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%E7%9A%84%E5%88%B7%E9%A2%98%E9%A1%B5%E5%8E%BB%E9%99%A4%E5%A4%9A%E4%BD%99%E9%81%AE%E6%8C%A1.meta.js
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
        setTimeout(function(){ mychange(); }, 5000);
    });

    function mychange() {


        console.log("mychange");
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

        //隐藏视频
        var divs = document.querySelectorAll(".video-item");
        [].forEach.call(divs, function(div) {
            div.style.display = "none";
        });
    };
})();

