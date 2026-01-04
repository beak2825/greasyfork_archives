// ==UserScript==
// @name         资料分析重布局，粉笔公考
// @namespace    http://tampermonkey.net/
// @version      0.64
// @description  资料分析重布局 本次更新:调整屏幕适应尺寸，兼容2048和1153，如果不兼容按 ctrl+滑轮 进行滚动调整；答题卡自动隐藏；调整退出按钮，更新申论显示，进入题库先刷新下，按键盘a隐藏模考
// @author       zoohoao
// @license      zoohoao
// @include      http*://*fenbi.com/*
// @include      http*://www.fenbi.com/spa/tiku/exam/practice/xingce/xingce/*
// @include      https://www.fenbi.com/spa/tiku/exam/practice/xingce/xingce/*
// @match       http*://*fenbi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454943/%E8%B5%84%E6%96%99%E5%88%86%E6%9E%90%E9%87%8D%E5%B8%83%E5%B1%80%EF%BC%8C%E7%B2%89%E7%AC%94%E5%85%AC%E8%80%83.user.js
// @updateURL https://update.greasyfork.org/scripts/454943/%E8%B5%84%E6%96%99%E5%88%86%E6%9E%90%E9%87%8D%E5%B8%83%E5%B1%80%EF%BC%8C%E7%B2%89%E7%AC%94%E5%85%AC%E8%80%83.meta.js
// ==/UserScript==

(function() {
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
            var flag = styleModify(screenW)
            var url = window.location.href;
            var temp = url.search("solution")
            if(flag && temp==-1){
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
                changeBtn(box,ques)
            }
            if(temp){
                var ad = document.getElementsByClassName("production-rec-nav ng-star-inserted")
                ad[0].style.display='none'
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
        document.getElementsByClassName("fb-collpase-header bg-color-gray-mid border-gray-mid")[0].style.marginLeft="38%"//答题卡点击位置偏移
        document.getElementsByClassName("fb-collpase-header bg-color-gray-mid border-gray-mid")[0].firstChild.click()//自动点击，隐藏答题卡

        var a =document.getElementsByClassName("question-content font-color-gray-mid bg-color-gray-bold theme-options-content")
        for(var i=0;i<a.length;i++){a[i].style.paddingTop="40px"}

        var old = document.getElementsByClassName("border-gray-light3 bg-color-gray-light2")//原始按钮
        for(var j=0;j<old.length;j++){old[j].style.display="none"}//原始按钮隐藏


        document.getElementById("fenbi-web-header").style.display="none"//隐藏头部
        document.getElementsByClassName("quit-btn font-color-gray-mid")[0].onclick=function(){window.location.replace("https://www.fenbi.com/spa/tiku/guide/catalog/xingce?prefix=xingce")}

        if(screenW<2048){
            document.getElementsByTagName("section")[0].style.marginLeft="45%";
            document.getElementsByTagName("section")[0].style.width="65%";
        }else{
            document.getElementsByTagName("section")[0].style.marginLeft="25%";
            document.getElementsByTagName("section")[0].style.width="85%";
        }


        var title= document.getElementsByClassName("font-color-gray-mid")[1].innerHTML
        var flag=title.search("资料分析")
        return flag
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
            box.style.width="48%";
            box.style.height="85%";
            box.style.marginTop="82px"
            box.style.padding="0px"
            box.style.marginLeft="2%"
        }else{
            box.style.width="900px";
            box.style.height="90%";
            box.style.marginTop="82px"
            box.style.marginLeft="160px"
        }
        box.style.position="fixed"
        box.style.overflow="auto"
        box.setAttribute('id', 'box')
        createBtn(screenW)

        return box;
    }
})();