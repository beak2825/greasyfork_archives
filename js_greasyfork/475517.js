// ==UserScript==
// @name         粉笔题库美化页面布局
// @namespace    http://zzw2000.tpddns.cn/
// @version      0.2.6
// @description  备考刷题，加油快冲上岸
// @author       Foolworld
// @include      http*://*fenbi.com/*
// @include      http*://www.fenbi.com/spa/tiku/exam/practice/*
// @include      https://www.fenbi.com/spa/tiku/exam/practice/*
// @match        http*://*fenbi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fenbi.com
// @license      Fool
// @grant        none
// @antifeature  tracking 跟踪跳转历史来实现进入题目后执行代码
// @downloadURL https://update.greasyfork.org/scripts/475517/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%E7%BE%8E%E5%8C%96%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/475517/%E7%B2%89%E7%AC%94%E9%A2%98%E5%BA%93%E7%BE%8E%E5%8C%96%E9%A1%B5%E9%9D%A2%E5%B8%83%E5%B1%80.meta.js
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
        setTimeout(function(){ mychange(); }, 100);
    });

    function mychange() {
        document.getElementById("fenbi-web-header").style.display="none"//隐藏头部
        document.getElementById("fenbi-web-footer").style.display="none"//隐藏底部
        setTimeout(function(){
            for(var i=0;i<document.getElementsByClassName("fb-radioInput").length;i++){
                document.getElementsByClassName("fb-radioInput")[i].style.zIndex="2";}
            }, 1500);
        document.getElementsByClassName("header-content")[0].style.width="100%"//拓宽
        document.getElementsByClassName("exam-content")[0].style.width="100%"//拓宽

        // document.styleSheets[0].addRule('.fb-collpase-bottom','width:95%',0);
        document.styleSheets[1].addRule('.fb-collpase-bottom','width:95%',0);
        document.getElementsByClassName("header-content")[0].onmouseover = function () {
            document.getElementById("app-practice").lastChild.style.zIndex="2";}
        document.getElementsByClassName("header-content")[0].onmouseout = function () {
            document.getElementById("app-practice").lastChild.style.zIndex="0";}

        var Moveout = document.getElementsByTagName("app-side-tool");
        var content = document.getElementsByClassName("fixedActions bg-color-gray-bold")[0].children;
        for(var t=1;t<content.length;t++){
        content[t].style.display = "none";}
        //鼠标移入显示
        Moveout[0].onmouseover = function () {
            for(var t=1;t<content.length;t++){
            content[t].style.display = "block";}
        }
        //鼠标移出隐藏
        Moveout[0].onmouseout = function () {
            for(var t=1;t<content.length;t++){
                content[t].style.display = "none";}
        }

        console.log("mychange");
        var header=document.getElementsByClassName("simple-nav-header bg-color-gray-bold")[0];
        if(header== undefined || header.length==0) return;
        //高度设置为0，即可隐藏白色条幅
        header.style.height="0";
        //将白条中间影响视觉的标题去掉，只保留返回按钮
        header.childNodes[0].childNodes[1].style.visibility="hidden";


        //紧凑底部答题卡布局
        //document.getElementsByClassName("fb-collpase-header bg-color-gray-mid border-gray-mid")[0].style.height="0";


        document.getElementsByClassName("fb-collpase-header bg-color-gray-mid border-gray-mid")[0].style.marginLeft="45%"//答题卡点击位置偏移
        //设置整个答题卡为半透明
        addGlobalStyle('.fb-collpase-bottom.bg-color-gray-mid {opacity:0.5}');
        addGlobalStyle('.fb-collpase-bottom.bg-color-gray-mid:hover {opacity:1}');
        //document.getElementsByClassName("fb-collpase-bottom bg-color-gray-mid")[0].style.opacity="0.5";

        addGlobalStyle('.toTopActions {opacity:0.5}');
        addGlobalStyle('.toTopActions:hover {opacity:1}');
        addGlobalStyle('.fixedActions {opacity:0.5}');
        addGlobalStyle('.fixedActions:hover {opacity:1}');
        addGlobalStyle('.box {opacity:0.8}');
        addGlobalStyle('.box:hover {opacity:1}');
        addGlobalStyle('.tools-container {opacity:0.2}');
        addGlobalStyle('.tools-container:hover {opacity:1}');
        setTimeout(function(){
        var div2=document.getElementsByClassName("fb-collpase-content border-gray-mid bg-color-gray-mid")[0];
        div2.style.paddingTop="0";
            for(var i = 0;i<div2.childNodes.length;i++){
                 if(div2.childNodes.length==2){
        div2.childNodes[0].childNodes[0].style.display="none";}
        div2.childNodes[i].childNodes[1].style.marginBottom="0";
            }
             }, 500);


        //答题卡隐藏时底部多余的白条也去掉
        var div3 = document.getElementsByClassName("fb-collpase-content-hidden bg-color-gray-mid border-gray-mid")[0];
        div3.style.paddingTop="0"
        div3.style.height="0";

        //隐藏视频
        // var divs = document.querySelectorAll(".video-item");
        // [].forEach.call(divs, function(div) {
        //     div.style.display = "none";
        // });
        setTimeout(function(){
        var url = window.location.href;
            var temp = url.search("solution")
            if(temp>0){
                var ad = document.getElementsByClassName("production-rec-nav ng-star-inserted")
                ad[0].style.display='none'
            }}, 400);
        document.getElementsByClassName("tools-container")[0].setAttribute('id', 'Draftheader');
        document.getElementsByClassName("draft-container")[0].setAttribute('id', 'Draft');
        // document.getElementsByClassName("draft-container")[0].style.left="90px";
        dragElement(document.getElementById("Draftheader"));
        var a =document.getElementsByClassName("question-content font-color-gray-mid bg-color-gray-bold theme-options-content")
        setTimeout(function(){
            for(var i=0;i<a.length;i++){
            a[i].style.paddingTop="40px";
            document.getElementsByClassName("draft-icon")[i].style.width="93%";
            document.getElementsByClassName("draft-icon")[i].onclick=function(){
                dragElement(document.getElementById("Draftheader"));
                document.getElementById("Draftheader").style.cursor="move";
                document.getElementById("Draftheader").style.right="70px";
                if(document.getElementsByClassName("box").length>=1){
                // document.getElementsByClassName("draft-container")[0].style.left="0px";
                var screenW=window.screen.width;
                document.getElementsByClassName("draft-container")[0].style.width=screenW+"px";
                setTimeout(function(){document.getElementsByClassName("pen")[0].width=screenW;}, 0);}

            }} }, 1500);


    };
    window.onload = function(){
        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 65) {
                var ab = document.getElementsByClassName("ques-source ng-tns-c61-1 ng-star-inserted");
                for(var i = 0;i<ab.length;i++){
                    if(ab[i].innerHTML.search("模考")>0){
                        ab[i].parentNode.parentNode.parentNode.style.display="none"}
                }
            }

        };

        var screenW=window.screen.width;
        var box,ques,nums=[];
        var t=0;
        setTimeout(function(){
            var url = window.location.href;
            var temp = url.search("solution")
            var material=document.getElementsByClassName("material-content").length;
            if(material>0 && temp==-1){
            styleModify(screenW)
                sigin(nums)
                document.getElementsByClassName("exam-content")[0].style.marginRight="200px";
                document.getElementsByClassName("border-gray-light3 bg-color-gray-light2")[0]
                ques = document.getElementsByTagName("fb-ng-question-material");
                for(var l=0;l<ques.length;l++){
                    ques[l].style.display="none"
                }
                var box= createNode(screenW)
                box.innerHTML = ques[t].innerHTML
                imgsrc()
                var L=document.getElementsByClassName("fb-question-material").length
                document.getElementsByClassName("fb-question-material")[L-1].style.width="100%";
                document.getElementsByClassName("fb-question-material")[L-1].style.marginLeft="0";
                document.getElementsByClassName("material-nav bg-color-gray-light")[L-1].setAttribute('id', 'boxheader');
                document.getElementsByClassName("material-nav bg-color-gray-light")[L-1].style.cursor="move";
                dragElement(document.getElementById("box"));
                document.getElementById("box").onmouseover = function () {
                    document.getElementById("app-practice").lastChild.style.zIndex="2";}
                document.getElementById("box").onmouseout = function () {
                    document.getElementById("app-practice").lastChild.style.zIndex="0";}
                changeBtn(box,ques)
            }



        }, 1000);

        function changeBtn(box,ques){
            var a = document.getElementsByClassName("btn")
            for(var w = 0;w<a.length;w++){
                a[w].onclick=function(){
                    t=t+1;
                    if(t>=ques.length){
                        t=0;
                    }
                    box.innerHTML = ques[t].innerHTML
                    imgsrc()
                    nums[t].scrollIntoView()
                    console.log(t)
                    var L=document.getElementsByClassName("fb-question-material").length;
                    document.getElementsByClassName("fb-question-material")[L-1].style.width="100%";
                    document.getElementsByClassName("fb-question-material")[L-1].style.marginLeft="0";
                    document.getElementsByClassName("material-nav bg-color-gray-light")[L-1].setAttribute('id', 'boxheader');
                    document.getElementsByClassName("material-nav bg-color-gray-light")[L-1].style.cursor="move";
                    dragElement(document.getElementById("box"));
                    changeBtn(box,ques)
                };
            }
        }
    }
    function sigin(nums){
        var matri = document.getElementsByClassName("material-content theme-material-content theme-material-content-border font-color-gray-mid bg-color-gray-bold")
        for(var i=0;i<matri.length;i++){
            var index;
            index = matri[i].parentNode
            while(true){
                index.tagName
                if(index.tagName=="DIV" && index.className=="fb-question"){
                    index= index.firstElementChild
                    nums.push(index)
                    index.style.marginTop="50px"
                    index.style.background = "#B6E2A1"
                    console.log(index)
                    break
                }
                index = index.parentNode
            }

        }
    }
    function imgsrc(){
        var imgs = document.getElementById("box").getElementsByTagName("img");
        for(var q = 0;q<imgs.length;q++){
            var datasrc =imgs[q].getAttribute("data-src")
            imgs[q].setAttribute("src",datasrc);
        }}

    function styleModify(screenW){

        document.getElementsByClassName("fb-collpase-header bg-color-gray-mid border-gray-mid")[0].firstChild.click()//自动点击，隐藏答题卡



        var old = document.getElementsByClassName("border-gray-light3 bg-color-gray-light2")//原始按钮
        for(var j=0;j<old.length;j++){old[j].style.display="none"}//原始按钮隐藏



        //document.getElementsByClassName("quit-btn font-color-gray-mid")[0].onclick=function(){window.location.replace("https://www.fenbi.com/spa/tiku/guide/catalog/xingce?prefix=xingce")}

        if(screenW<2048){
            document.getElementsByTagName("section")[0].style.marginLeft="50%";
            document.getElementsByTagName("section")[0].style.width="50%";
        }else{
            document.getElementsByTagName("section")[0].style.marginLeft="25%";
            document.getElementsByTagName("section")[0].style.width="85%";
        }


        // var title= document.getElementsByClassName("font-color-gray-mid")[1].innerHTML
        // var flag=title.search("资料分析")
        // return flag
    }
    function createBtn(screenW) {
        var btnpar = document.getElementsByClassName("material-nav bg-color-gray-light")
        for(var i = 0;i<btnpar.length;i++){
            var newItem=document.createElement("button")
            var textnode=document.createTextNode("切换")
            newItem.appendChild(textnode)
            btnpar[i].insertBefore(newItem,btnpar[i].childNodes[0]);
            newItem.setAttribute("class", "btn");
            if(screenW<2048){
                newItem.style.width="10%";
                newItem.style.height="5%";
                newItem.style.position="absolute"
                newItem.style.marginLeft="77%"
            }else{
                newItem.style.width="90px";
                newItem.style.height="30px";
                newItem.style.position="absolute"
                newItem.style.marginLeft="706px"}
            newItem.style.cursor="pointer";
        }
    }
    function createNode(screenW) {
        var para=document.createElement("div");
        var node=document.createTextNode("");
        para.appendChild(node);
        var element=document.getElementById("app-practice");
        element.appendChild(para);
        var box = element.lastChild
        if(screenW<2000){
            box.style.width="55%";
            box.style.height="85%";
            box.style.top="50px";
            box.style.padding="0px";
            box.style.left="-23px";
        }else{
            box.style.width="900px";
            box.style.height="90%";
            box.style.marginTop="82px"
            box.style.marginLeft="160px"
        }
        box.style.position="absolute"
        box.style.overflow="auto"
        box.setAttribute('id', 'box')
        box.setAttribute('class', 'box')
        createBtn(screenW)

        return box;
    }

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // 如果存在，标题是您从中移动 DIV 的位置:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // 否则，从 DIV 内的任何位置移动 DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // 在启动时获取鼠标光标位置:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // 每当光标移动时调用一个函数:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // 计算新的光标位置:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // 设置元素的新位置:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // 释放鼠标按钮时停止移动:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


})();