// ==UserScript==
// @name         智学网排名显示
// @namespace    http://www.gzsofteasy.com/
// @version      1.9
// @description  智学网排名优化显示
// @author       Frank Chen
// @license      MPL
// @source       https://github.com/cshuibo/ZhiXueWangRank
// @supportURL   https://github.com/cshuibo/ZhiXueWangRank/issues/new/choose
// @match        https://www.zhixue.com/activitystudy/web-report/index.html?from=web-container_top*
// @match        https://www.zhixue.com/activitystudy/web-report/index.html?examId=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523048/%E6%99%BA%E5%AD%A6%E7%BD%91%E6%8E%92%E5%90%8D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/523048/%E6%99%BA%E5%AD%A6%E7%BD%91%E6%8E%92%E5%90%8D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
const GLOBALDATA = {

    classStatTotalNum:0,
    gradeStatTotalNum:0,

    setClassStatTotalNum: (n) => {
        GLOBALDATA.classStatTotalNum = n;
    },

    setGradeStatTotalNum: (n) => {
        GLOBALDATA.gradeStatTotalNum = n;
    },
};

function patchRequest(url, xhr) {
    //alert(url);
    if (url.indexOf('zhixuebao/report/paper/getLevelTrend') !== -1) {
        xhr.addEventListener("load", patchGetLevelTrendOnReadyStateChange);
    }else if (url.indexOf('zhixuebao/report/exam/getLevelTrend') !== -1) {
        xhr.addEventListener("load", patchGetLevelTrendOnReadyStateChange);
    }
    let element = document.querySelector("div.switch_tab_container");
    if(element){
        element.addEventListener('click', function(event) {
            //console.log('元素被点击了！');
             setTimeout(function() {
                 changeRankDisplay();
             }, 100);
        });
    }

    let element3 = document.querySelector("div.zx-tab-list");
    if(element3){
        element3.addEventListener('click', function(event) {
            //var leftValue2=fetchComputedStyle(element3,"transform");
            //alert(leftValue2);
            element3.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
        });
    }

    let element4 = document.querySelector("div.report-header");
    if(element4){
        element4.addEventListener('click', function(event) {
            element3.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
        });
    }

}

function patchGetLevelTrendOnReadyStateChange(proto) {
    console.log(">>>patchGetLevelTrendOnReadyStateChange");
    const xhr = proto.currentTarget;
    if (xhr.readyState !== 4) {
        return;
    }

    const code = xhr.responseURL;
    const data = JSON.parse(xhr.response);
    var classStatTotalNum=data.result.list[0].statTotalNum;
    var gradeStatTotalNum=data.result.list[1].statTotalNum;
    //alert(code);
    GLOBALDATA.setClassStatTotalNum(classStatTotalNum);
    GLOBALDATA.setGradeStatTotalNum(gradeStatTotalNum);
    //alert(classStatTotalNum);
    //alert(gradeStatTotalNum);

    setTimeout(function() {
        changeRankDisplay();
    }, 1000);
    
}


function fetchComputedStyle(obj , property){
    //能力检测
    if(window.getComputedStyle){
        //现在要把用户输入的property中检测一下是不是驼峰，转为连字符写法
        //强制把用户输入的词儿里面的大写字母，变为小写字母加-
        //paddingLeft  →  padding-left
        property = property.replace(/([A-Z])/g , function(match,$1){
            return "-" + $1.toLowerCase();
        });
        return window.getComputedStyle(obj)[property];
    }else{
        //IE只认识驼峰，我们要防止用户输入短横，要把短横改为大写字母
        //padding-left  → paddingLeft
        property = property.replace(/\-([a-z])/g , function(match,$1){
            return $1.toUpperCase();
        });
        return obj.currentStyle[property];
    }
}

function getPercentage() {
    var percent=0;
    let runningElement = document.querySelector("div.class-running");
    if(runningElement){
        //alert(getElementLeftPercentage(runningElement));
        var leftValue=fetchComputedStyle(runningElement,"left");
        var widthValue=fetchComputedStyle(runningElement,"width");
        leftValue = parseFloat(leftValue);
        widthValue = parseFloat(widthValue);
        //alert("leftValue:"+leftValue);
        //alert("widthValue:"+widthValue);
        percent=leftValue/widthValue;
    }
    return percent;
}
//根据百分比和人数计算排名
function getRank(startTotalNumber,percentage){
    var rank=startTotalNumber*(1-percentage);
    rank = Math.ceil(rank);
    rank = Math.max(rank, 1)
    return rank;
}

function changeRankDisplay(){
    console.log(">>>changeRankDisplay");
    let runningElement = document.querySelector("div.class-running");
    if(runningElement){
        var percentage=getPercentage();

        var percentDisplay=(percentage)*100;
        percentDisplay = parseFloat(percentDisplay.toFixed(2));

        var startTotalNumber=1;
        let element3 = document.querySelector("div>span.current");
        if(element3){
            //alert(element3.innerText);
            if(element3.innerText==='班级'){
                startTotalNumber=GLOBALDATA.classStatTotalNum;
            }else{
                startTotalNumber=GLOBALDATA.gradeStatTotalNum;
            }
        }

        //alert(GLOBALDATA.classStatTotalNum);
        //alert(GLOBALDATA.gradeStatTotalNum);
       var rank=getRank(startTotalNumber,percentage);
        
        //alert("percent:"+percent);

        var theElement = document.querySelector("h2");
        if(theElement){
            //theElement.innerText = '新的标题';
            theElement.style.color='red';
            theElement.innerText = "人数:"+startTotalNumber+"  排名:"+rank+"     超:"+percentDisplay+"%";
        }

        //let div = document.createElement("div");
        //div.innerHTML ="<span>排名:"+leftValue+"</span>";
        //document.body.append(div);
    }
}

function displayZhiXueRank() {
    console.log(">>>displayZhiXueRank");

    XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
        patchRequest(url, this);
        this._open(method, url, async, user, password);
    };
}
(function() {
    'use strict';

    // Your code here...
    displayZhiXueRank();
})();