// ==UserScript==
// @name         一键划水填满问卷星
// @namespace    http://tampermonkey.net/hlightautoselect
// @version      0.1
// @description  功能：添加了几个按钮、点击对应填充单选多选、填空、星标和提交；使用说明：①按钮12分别对所有选择题(单选、多选)生效，如果该多选题要求至少选择x个选项则全选。②填空填补填空题，如果选择题选项有填空，请先使用按钮12才能填。③星标栏通过拖动修改全局星标题、星星数根据比例调整；测试品，警告：使用造成的任何后果由使用者自己负责；
// @author       Hlight
// @match        https://www.wjx.cn/vm/*
// @icon         data://image.wjx.com/images/commonImgPC/del@2x.png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448272/%E4%B8%80%E9%94%AE%E5%88%92%E6%B0%B4%E5%A1%AB%E6%BB%A1%E9%97%AE%E5%8D%B7%E6%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/448272/%E4%B8%80%E9%94%AE%E5%88%92%E6%B0%B4%E5%A1%AB%E6%BB%A1%E9%97%AE%E5%8D%B7%E6%98%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //定义
    var buttom_selectall = document.createElement('button');
    var buttom_selectall2;
    var buttom_submit ;
    var buttom_fillBlankall;
    var buttom_range = document.createElement('input');
    var text_star = document.createElement('h3');
    var page = document.querySelector('#pageDiv');

    //#region  设置按钮1样式
    buttom_selectall.style.position='fixed';
    buttom_selectall.style.top='30px';
    buttom_selectall.style.right='60px';
    buttom_selectall.style.zIndex='114514';
    buttom_selectall.style.width='150px';
    buttom_selectall.style.height='44px';
    buttom_selectall.style.fontWeight='500';
    buttom_selectall.style.fontSize='16px';
    buttom_selectall.style.fontFamily="PingFang SC","helvetica neue","arial","阿里巴巴普惠体","思源黑体 CN","microsoft yahei ui","microsoft yahei","sans-serif";
    buttom_selectall.style.textAlign='center';
    buttom_selectall.style.lineHeight='44px';
    buttom_selectall.style.color='#fff';
    buttom_selectall.style.backgroundColor='#0095ff';
    buttom_selectall.style.border='none';
    buttom_selectall.style.borderRadius='2px';
    buttom_selectall.style.cursor='pointer';
    buttom_selectall.style.boxShadow='0 2px 2px rgba(0,0,0,.2)';
    buttom_selectall.style.transition='all .4s';
    buttom_selectall.innerHTML='强制全选第一个';
    buttom_selectall.onmouseover=function(){
        buttom_selectall.style.color='#0095ff';
        buttom_selectall.style.backgroundColor='#fff';
        buttom_selectall.style.boxShadow='0 0px 4px rgba(0,0,0,.4)';
    }
    buttom_selectall.onmouseout=function(){
        buttom_selectall.style.color='#fff';
        buttom_selectall.style.backgroundColor='#0095ff';
        buttom_selectall.style.boxShadow='0 2px 2px rgba(0,0,0,.2)';
    } 
    //#endregion
    
    //#region 设置按钮2样式-复制自按钮1
    buttom_selectall2=buttom_selectall.cloneNode(true);
    buttom_selectall2.innerHTML='强制全选最后一个';
    buttom_selectall2.style.top='80px';
    buttom_selectall2.onmouseover=function(){
        buttom_selectall2.style.color='#0095ff';
        buttom_selectall2.style.backgroundColor='#fff';
        buttom_selectall2.style.boxShadow='0 0px 4px rgba(0,0,0,.4)';
    }
    buttom_selectall2.onmouseout=function(){
        buttom_selectall2.style.color='#fff';
        buttom_selectall2.style.backgroundColor='#0095ff';
        buttom_selectall2.style.boxShadow='0 2px 2px rgba(0,0,0,.2)';
    } 
    //#endregion

    //#region 设置提交按钮样式-复制自按钮1
    buttom_submit=buttom_selectall.cloneNode(true);
    buttom_submit.innerHTML='提交';
    buttom_submit.style.top='180px';
    buttom_submit.onmouseover=function(){
        this.style.color='#0095ff';
        this.style.backgroundColor='#fff';
        this.style.boxShadow='0 0px 4px rgba(0,0,0,.4)';
    }
    buttom_submit.onmouseout=function(){
        this.style.color='#fff';
        this.style.backgroundColor='#0095ff';
        this.style.boxShadow='0 2px 2px rgba(0,0,0,.2)';
    } 
    //#endregion

    //#region 设置填满按钮-复制自按钮1
    buttom_fillBlankall=buttom_selectall.cloneNode(true);
    buttom_fillBlankall.innerHTML='所有空填充空格';
    buttom_fillBlankall.style.top='130px';
    buttom_fillBlankall.onmouseover=function(){
        this.style.color='#0095ff';
        this.style.backgroundColor='#fff';
        this.style.boxShadow='0 0px 4px rgba(0,0,0,.4)';
    }
    buttom_fillBlankall.onmouseout=function(){
        this.style.color='#fff';
        this.style.backgroundColor='#0095ff';
        this.style.boxShadow='0 2px 2px rgba(0,0,0,.2)';
    } 
    //#endregion
    
    //#region 设置星星拖动条
    buttom_range.style.position='fixed';
    buttom_range.style.top='230px';
    buttom_range.style.right='60px';
    buttom_range.style.position='fixed';
    buttom_range.style.width='120px';
    buttom_range.style.height='44px';
    buttom_range.style.cursor='pointer';
    buttom_range.style.background='rgba(0,0,0,0)';
    buttom_range.style.appearance='auto';
    buttom_range.style.accentColor='rgb(0,117,255)';
    buttom_range.type='range';
    buttom_range.max='100';
    buttom_range.min='0';
    text_star.style.position='fixed';
    text_star.style.top='230px';
    text_star.style.right='190px';
    text_star.style.fontSize='30px'
    text_star.style.color='rgb(0,117,255)';
    text_star.innerHTML='★';
    //#endregion
   
    var dad = document.getElementsByClassName('fieldset');
    var boxesx = dad[0].children;
    var boxes = Array.from(boxesx);
    //预处理题目数组，去除不是题目的模块(例如标题)
    for(let k=0;k<boxes.length;){
        if(boxes[k].className!='field ui-field-contain')boxes.splice(k,1);
        else k++;
    }
    //每个按钮事件绑定的方法
    var selectAnswer = function(order){
        for(var i=0;i<boxes.length;i++){
            var selectBox = boxes[i].children[1];
            var selectboxes = selectBox.children;
            //跳过不是多选和单选的框目
            var cc = new RegExp('(?<=ui-controlgroup).[^dev]\S*');
            if(!cc.test(selectBox.className))continue;
            //清除多选
            for(let j=0;j<selectboxes.length;j++){
                let option = selectboxes[j].getElementsByTagName('a')[0];
                if(option.className=='jqcheck jqchecked')option.click();
            }
            //无论如何要求多选选项大于二的就全选
            if(boxes[i].children[0].childNodes.length>=3)
            {
                //console.log(boxes[i].children[0].children[1].innerHTML);
                let cc1 = new RegExp('(?<=【<b>最少</b>选择).[^dev]\S*');
                if(cc1.test(boxes[i].children[0].children[1].innerHTML)){
                    for(let j=0;j<selectboxes.length;j++){
                        let option = selectboxes[j].getElementsByTagName('a')[0];
                        if(option.className=='jqcheck')option.click();
                    }
                }
            }  
            //根据顺序选择
            if(order==1){
                let option = selectboxes[0].getElementsByTagName('a')[0];
                if(option.className=='jqcheck'||option.className=='jqradio')option.click();
            }
            else if(order==2){
                let option = selectboxes[selectboxes.length-1].getElementsByTagName('a')[0];
                if(option.className=='jqcheck'||option.className=='jqradio')option.click();
            }
        }
    }
    var fillAllBlanks = function(){
        for(var i=0;i<boxes.length;i++){
            var selectBox = boxes[i].children[1];
            var selectboxes = selectBox.children;
            //填充单纯的填空
            if(selectBox.className=='ui-input-text')selectBox.children[0].value='正确';
            if(boxes[i].childNodes.length>=3 && selectBox.nextElementSibling.className=='ui-input-text'){
                //console.log(selectBox.nextElementSibling);
                selectBox.nextElementSibling.children[0].value='正确';
            }
            //填充选项自带的填空
            for(let j=0;j<selectboxes.length;j++)
                if(selectboxes[j].childNodes.length>=3){
                    if(selectboxes[j].children[2].className=='ui-text'){
                        selectboxes[j].children[2].children[0].value='正确';
                    }
                }
                        
        }
    }
    var submitAnswer = function(){
        var vanilla_box_submit = document.getElementsByClassName('voteDiv');
        vanilla_box_submit[0].querySelector('#ctlNext').click();

    }
    var rangeSetValue=function(){
        buttom_range.innerHTML=buttom_range.value;
        for(var i=0;i<boxes.length;i++){
            var selectBox = boxes[i].children[1];
            if(selectBox.className=='scale-div'){
                let lilist = selectBox.querySelectorAll('li');
                let index = Math.round(lilist.length*(buttom_range.value/buttom_range.max))-1;
                if(index>=0)lilist[index].click();
            }
        }
    }

    //添加按钮监听和插入按钮节点
    buttom_selectall.addEventListener("click",function(){selectAnswer(1)});
    buttom_selectall2.addEventListener("click",function(){selectAnswer(2)});
    buttom_fillBlankall.addEventListener("click",fillAllBlanks);
    buttom_submit.addEventListener("click",submitAnswer);
    buttom_range.addEventListener("mousedown",rangeSetValue);
    
    page.appendChild(buttom_selectall);
    page.appendChild(buttom_selectall2);
    page.appendChild(buttom_fillBlankall);
    page.appendChild(buttom_submit);
    page.appendChild(text_star);
    page.appendChild(buttom_range);
    
})();