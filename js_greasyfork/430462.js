// ==UserScript==
// @name         培训视频下载
// @namespace    http://blog.gobyte.cn
// @version      0.13
// @description  为培训网页创建视频下载按钮
// @author       misterchou@qq.com
// @match        https://cstraining.alipay.com/*

// @icon         https://www.google.com/s2/favicons?domain=alipay.com
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/430462/%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/430462/%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //     const uri = "data:text/plain;charset=UTF-8,"
    //     const url = uri + content

    setTimeout (

        function(){
            if(window.localhost.href.indexOf("https://cstraining.alipay.com/learn/learnTrainingPersonRecordNew.htm") > -1 ){
                // const copyTitleBtn = document.createElement("a");
                let videoTitle = document.querySelector("h3").innerText =  document.querySelector("h3").innerText.replace("资料名称：","");

                // copyTitleBtn.innerText = "复制标题";
                // let code = `"javascript:window.getSelection().selectAllChildren("${videoTitle}");document.execCommand("Copy");"`.toString();
                // console.log(code);
                // copyTitleBtn.href = code;
                // copyTitleBtn.id = 'cid'

                const a = document.createElement("a")
                let url = document.querySelector("#J_prismPlayer > video").src
                a.href = url;
                a.target="_blank";
                a.id = "download";
                a.onclick= function(){window.getSelection().selectAllChildren( document.querySelector("h3"));document.execCommand("Copy");};
                GM_setClipboard (videoTitle);

                a.innerText = "下载视频"
                a.download = videoTitle + '.mp4';
                document.querySelector("body > div.row-fluid.main > div.viewContainer > div.view-desc > div.row").append(a);
                // document.querySelector("body > div.row-fluid.main > div.viewContainer > div.view-desc > div.row").append(copyTitleBtn);

                // a.click();
                // window.URL.revokeObjectURL(url)
            }
        },1500
    );

    // 循环删除水印
    setInterval( ()=>{ if(document.getElementById("default_watermark"))document.getElementById("default_watermark").innerHTML = '';},500);
    //修改视频列表的宽度（旧版）
    setTimeout( ()=>{
        if(window.location.href.indexOf("learnTrainingPersonRecordNew.htm") > -1 ){
            let cssObj = document.styleSheets[7].cssRules
            Object.keys(cssObj).forEach(
                (i)=>{
                    let sty = cssObj[i].style;
                    if(cssObj[i].selectorText == '.box-content-left'){
                        sty.width = '100rem';
                        // console.log(cssObj[i],sty);
                    }
                }
            )}
    },1500);
    //解除右键限制
    void
    function () {
        eval((function (p, a, c, k, e, d) {
            e = function (c) {
                return ((c < a ? "" : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36)));
            };
            if (!"".replace(/^/, String)) {
                while (c--) {
                    d[e(c)] = k[c] || e(c);
                }
                k = [function (e) {
                    return d[e];
                }];
                e = function () {
                    return "\\w+";
                };
                c = 1;
            }
            while (c--) {
                if (k[c]) {
                    p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
                }
            }
            return p;
        })("3 1e(){S c}1y=1e;3 6(){9(s!=E){9(s.r){s.r()}t{s.X=c;s.W=c}S c}}3 K(o){18{o.1F=6;o.1j=6;o.1i=6;o.1D=6;o.1g=6;o.1h=6;o.1f=6;o.1o=6;o.1n=6}Q(e){}}3 P(5){18{2 x=5.1l;9(x!=E){p(2 i=0;i<x.7;i++){v(x.h)}}t{2 A=5.Y(\"1k\");9(A!=E){p(2 j=0;j<A.7;j++){v(A[j].R)}}2 I=5.Y(\"1m\");9(I!=E){p(2 j=0;j<I.7;j++){v(I[j].R)}}}}Q(e){}}3 O(d){K(d);K(d.1A)}3 v(d){P(d);O(d)}2 12={q:3(f){f.r()},T:3(5,u,z){5.w(u,8.q,c)},g:3(4,G){2 7=4.7;p(2 i=0;i<7;i++){8.T(G,4,8.q)}},F:3(4){8.g(4,L);8.g(4,h)}};2 l=3(){};l.H.q=3(f){9(f.r){f.r()}t{f.X=c;f.W=c}};l.H.M=3(5,u,z){9(5.w){5.w(u,z,1z)}t{5.1B('1C'+u,z)}};l.H.g=3(4,G){2 7=4.7;p(2 i=0;i<7;i++){8.M(G,4,8.q)}};l.H.F=3(4){8.g(4,L);8.g(4,h);2 y=h.1p,n=y.7;p(2 i=0;i<n;i++){9(y.1E==1){8.g(4,y)}}};9(L.w){2 D=1x.1s(12);D.F(['1a','1c','k','17','15','19','Z','V','N','1d','11','m','1b','10','U']);((3(){2 J=h.1r('1q');J.1t='* {-13-b-m: C !a; -13-b-k: B !a;'+'-14-b-m: C !a; -14-b-k: B !a;'+'-16-b-m: C !a; -16-b-k: B !a;'+'b-m: C !a; b-k: B !a;}';h.1u.1w(J)})())}t{2 D=1v l();D.F(['1a','1c','k','17','15','19','Z','V','N','1d','11','m','1b','10','U'])}v(h);", 62, 104, "||var|function|events|obj|handleevent|length|this|if|important|user|true|||evt|apply|document|||select|noMouseRestrict2|drag|||for|enableDefault|stopPropagation|event|else|type|enableRight|addEventListener|frs|nodes|func|fs|text|auto|noRestrict|null|init|node|prototype|ifs|elem|handleobj|window|addEvt|beforepaste|handlebody|handleframes|catch|contentDocument|return|addEvt2|mousemove|paste|returnValue|cancelBubble|getElementsByTagName|beforecut|mouseup|dragend|noMouseRestrict|webkit|moz|beforecopy|khtml|copy|try|cut|contextmenu|mousedown|selectstart|dragstart|avoiderr|onmousedown|onbeforecopy|oncopy|ondragstart|oncontextmenu|frame|frames|iframe|onmouseup|onmousemove|all|style|createElement|create|innerHTML|head|new|appendChild|Object|onerror|false|body|attachEvent|on|onselectstart|nodeType|onselect".split("|"), 0, {}));
    }();


})();