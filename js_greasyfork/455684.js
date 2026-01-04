// ==UserScript==
// @name         黑白网页恢复彩色
// @namespace    http://tampermonkey.net/
// @version      1.11.5
// @license      MIT
// @description  黑白网页恢复彩色，匹配所有网页，即装即用。
// @author       https://greasyfork.org/users/574395-frammolz-amanda
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/455684/%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/455684/%E9%BB%91%E7%99%BD%E7%BD%91%E9%A1%B5%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2.meta.js
// ==/UserScript==

var temp = document.createElement('style');//先添加一个临时的，减少延迟，最后会remove掉
temp.type = 'text/css';
temp.appendChild(document.createTextNode("*{-webkit-filter:none !important;}"));
var tmitv = setInterval(function() {
    try{
        document.head.appendChild(temp);
        document.body.appendChild(temp);
        clearInterval(tmitv);
    }catch{}
},30);
window.addEventListener("load", function () {
    var filter = document.createElement('style');
    filter.type = 'text/css';
    document.head.appendChild(filter);
    var windowUrl = window.location.href;
    if(document.getElementById("nv_forum"))document.getElementById("nv_forum").style.setProperty("background-blend-mode","normal");//Discuz论坛通用
    if( windowUrl.match(/https:\/\/www.58pic.com\/($|\?)/))filter.appendChild(document.createTextNode("*{-webkit-filter:none !important;}"));
    if( windowUrl.match(/https:\/\/www.baidu.com\/($|\?)/)){
        document.getElementById("s_lg_img").setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/index.png");
        document.getElementById("s_lg_img_new").setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/index.png");
        document.getElementById("su").style.setProperty("background-color","#4e6ef2","important");
        if (document.getElementsByClassName("index-logo-src").length==1){
            document.getElementsByClassName("index-logo-src")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/result.png");
            document.getElementsByClassName("index-logo-peak")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/result.png");
            document.getElementsByClassName("index-logo-srcnew")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/pc/result.png");
        }
    }
    if( windowUrl.match(/https:\/\/m.baidu.com\/($|\?)/)){
        document.getElementById("logo").getElementsByTagName("a")[0].getElementsByTagName("img")[0].setAttribute("src","https://www.baidu.com/img/flexible/logo/logo_web.png");
        document.getElementById("index-bn").style.setProperty("background-color","#4e6ef2","important");
    }
    if( windowUrl.match(/https:\/\/www.bilibili.com\/($|\?)/)){
        var source=[["//i0.hdslb.com/bfs/archive/0ac04c23af3b3297bf02dca163474326898d211d.png","//i0.hdslb.com/bfs/archive/583e5db0ffa0c4de4fc88de35e802767a9c93b63.png","//i0.hdslb.com/bfs/archive/ab6b34468bcc179b601541193eda668f2aa6106b.jpg","//i0.hdslb.com/bfs/archive/a421773e566a623fca26e12ae3921bda4a3fd856.png","//i0.hdslb.com/bfs/archive/3329c9f0abfb925ae30441f24d924ad3c19775df.png","//i0.hdslb.com/bfs/archive/57c5ced363be9f08b4cacf1745e221d3bb99d7c5.png"],["//i0.hdslb.com/bfs/archive/bdb288021ff854d3ac618ac8c1eafd300ec9ed9b.png","//i0.hdslb.com/bfs/archive/5d49497b6b7f30950f37c4aff205e7dd1494f3b9.png","//i0.hdslb.com/bfs/archive/bd90aa68aaaaddb1b5421b84298c51f5b90210e0.png","//i0.hdslb.com/bfs/archive/3d30de7942ed74d2515f28ae04eb1444e8d57f40.png","//i0.hdslb.com/bfs/archive/6592e92861e6248205af17702d06ea3f97d81de6.png","//i0.hdslb.com/bfs/archive/58d322146cb4b1685a5775478b9753f96a0c2ff6.png"]]
        var index=Math.floor(Math.random()*6);
        if(document.getElementsByClassName("v-img banner-img").length){document.getElementsByClassName("v-img banner-img")[0].getElementsByTagName("source")[0].setAttribute("srcset",source[0][index]);document.getElementsByClassName("logo-img")[0].setAttribute("src",source[1][index]);}
        else setTimeout(function(){document.getElementsByClassName("bili-banner")[0].style.setProperty("background-image","url(\""+source[0][index]+"\")");document.getElementsByClassName("logo-img")[0].setAttribute("src",source[1][index]);},500);
    }
    if( windowUrl.match(/https:\/\/weibo.com/)){
        var body = document.body;
        if(body.classList.length){
            document.getElementById("plc_frame").getElementsByTagName("style")[0].remove();
            const callback = function(mutationsList, observer) {
                for(let mutation of mutationsList){
                    if (mutation.type === "childList") document.getElementById("plc_frame").getElementsByTagName("style")[0].remove();
                }
            }
            new MutationObserver(callback).observe(body, { childList: true,});
            return;
        }
    }
    if( windowUrl.match(/https:\/\/www.ixigua.com/)){
        var chd = 0;
        replace();
        if( windowUrl.match(/https:\/\/www.ixigua.com\/[0-9]+/))obs("projection_recommentWrapper");
        else obs("v3-app-layout__content");
        function obs(clsname){
            const callback = function(mutationsList, observer) {
                for(let mutation of mutationsList){
                    if (mutation.type === 'childList') replace();
                }
            }
            new MutationObserver(callback).observe(document.getElementsByClassName(clsname)[0],{ childList: true, subtree: true});
        }
        function replace(){
            var ob=document.getElementsByClassName("HorizontalFeedCard__coverWrapper disableZoomAnimation");
            for( var index=chd;index<Object.keys(ob).length;index++ ){get_pic(ob[index].getAttribute('href').slice(1),index);}
            chd=Object.keys(ob).length;
            function get_pic(vid,index){
                var httpRequest = new XMLHttpRequest();
                httpRequest.open("GET", "https://www.ixigua.com/api/public/videov2/brief/details?group_id="+vid, true);
                httpRequest.send();
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState == 4 && httpRequest.status == 200) var timer=setInterval(function () {if (ob[index].getElementsByTagName("img")[0].complete){ob[index].getElementsByClassName("tt-img BU-MagicImage tt-img-loaded")[0].setAttribute("src",JSON.parse(httpRequest.responseText).data.posterUrl.slice(5));clearInterval(timer);}},50);
                }
            }
        }
    }
    if( windowUrl.match(/https:\/\/www.cib.com.cn\/cn\/index.html$/)){
        document.body.innerHTML = document.body.innerHTML.replace(/\/cn\/home-gray\/image\//g, '/cn/customer/home/');
        document.body.innerHTML = document.body.innerHTML.replace(/\/css\/2015\/gray\//g, '/css/2015/');
        document.head.getElementsByTagName("link")[0].setAttribute("href","/cn/resources/css/2015/base.css?v=0705");
    }
    fir();
    function fir(){
        let styleSheets=document.styleSheets;//外部css样式表修改
        for (const key in styleSheets) {
            if (Object.hasOwnProperty.call(styleSheets, key)) {
                try{
                    if(styleSheets[key].href) get_css(styleSheets[key].href);
                    let cssRules=styleSheets[key].cssRules;
                    for (const k in cssRules) {
                        if (Object.hasOwnProperty.call(cssRules, k)) {
                            if(cssRules[k].cssText.match(/filter.*grayscale/)){
                                set(cssRules[k].cssText);
                            }
                        }
                    }
                }catch{}
            }
        }
        function get_css(url){
            GM_xmlhttpRequest({
                method: "get",
                url: url,
                onload: function(r){
                    var open;
                    var close;
                    let css=r.responseText
                    while ((open = css.indexOf("/*")) !== -1 &&
                           (close = css.indexOf("*/")) !== -1) {
                        css = css.substring(0, open) + css.substring(close + 2);
                    }
                    for(var em of css.split("}")){
                        if(em.match(/filter.*grayscale/)){
                            set(em+"}");
                        }
                    }
                }
            });
        }
        function set(ele){
            try{
                ele=ele.replace(/saturate\(.*?\)/g,"saturate(1)");
            }catch{}
            if(ele.match(/grayscale(.*?)[^;]important/))filter.appendChild(document.createTextNode(ele.replace(/grayscale\(.*?\)/g,"grayscale(0)")));
            else{
                var text=ele.replace(/grayscale\(.*?\)/g,"grayscale(0)").slice(0,-1);
                var csstext=""
                for(var st of text.split(";")){
                    if(st.match(/grayscale\(0\)/)) csstext+=st+"!important;"
                    else if(st.match(/^\s+$/)){}
                    else csstext+=st+";"
                }
                filter.appendChild(document.createTextNode(csstext+"}"));
            }
        }
        let i=0;
        var tmitv = setInterval(function(){
            var inner=document.querySelector("html").outerHTML.match(/<[^<>]*?filter[^<>]*?grayscale[^<>]*?>/g);//行内样式修改
            if(inner){
                for(let i=0;i<inner.length;i++){
                    var tags=document.querySelectorAll(inner[i].split(" ")[0].slice(1))
                    for(let j=0;j<Object.keys(tags).length;j++){
                        try{
                            if(tags[j].getAttribute("style").match(/filter.*?grayscale/)){
                                tags[j].setAttribute("style",tags[j].getAttribute("style").replace(/grayscale\(.*?\)/g, "grayscale(0)"));
                            }
                        }catch{}
                    }
                }
            }
            var sty=document.getElementsByTagName("style");//块内样式修改
            for(let i=0;i<Object.keys(sty).length;i++){
                if(sty[i].innerHTML.match(/filter.*grayscale/))sty[i].innerHTML = sty[i].innerHTML.replace(/grayscale\(.*?\)/g, "grayscale(0)");
            }
            i++;
            if(i==3){
                clearInterval(tmitv);
                temp.remove();
            }
        },200);
    }
})