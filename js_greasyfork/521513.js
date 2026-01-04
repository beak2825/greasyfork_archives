// ==UserScript==
// @name         智慧学习
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  学习也要提质增效
// @author       psefgrep
// @match        http://47.96.77.18/ks/index2.php?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521513/%E6%99%BA%E6%85%A7%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/521513/%E6%99%BA%E6%85%A7%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
var wdkcButton;
var myMM;
var myUU;
var dnrDiv;
var courseIds = []; // 创建一个空数组用于存储课程id
var courseNow;
var timek = 0;
var kcxxtime = 0;

var dwode = document.createElement('div');
    dwode.id = 'dwode';
    dwode.style.position = 'fixed';
    dwode.style.top = '0';
    dwode.style.left = '0';
    dwode.style.width = '100px';
    dwode.style.maxWidth = '30%';
    dwode.style.height = '20px';
    dwode.style.lineHeight = '20px';
    dwode.style.fontSize = '14px';
    dwode.style.textAlign = 'center';
    dwode.style.color = 'white';
    dwode.style.zIndex = '87';

    var djishi = document.createElement('div');
    djishi.id = 'djishi';
    djishi.style.position = 'fixed';
    djishi.style.top = '0';
    djishi.style.right = '0';
    djishi.style.width = '100px';
    djishi.style.maxWidth = '20%';
    djishi.style.height = '20px';
    djishi.style.fontSize = '15px';
    djishi.style.color = 'white';
    djishi.style.lineHeight = '20px';
    djishi.style.textAlign = 'center';
    djishi.style.zIndex = '87';
    var bodyElement = document.body;
    bodyElement.appendChild(dwode);
    bodyElement.appendChild(djishi);

(function() {
    'use strict';
    var targetDiv = document.getElementById('dli5');
    if (targetDiv) {
        var myButton = document.createElement('button');
        myButton.textContent = '智慧学习';
        myButton.style.textAlign = "center";
        targetDiv.insertAdjacentElement('afterend', myButton);
        myButton.onclick = function(){
            myMM = getMM();
            if(checkWdkc()){
                wdkcButton = getWdkc();
            }
        }
    }
    

    setInterval(function(){
        if(courseIds.length === 0){
            return false;
        }
        courseNow = courseIds[0];
        kaishikaoshi(courseNow);
    },1000);

})();

function kaishikaoshi(courseID){
    timek++;
    $('#djishi').html(timek);
    $('#dwode').html('累计'+parseInt((timek+kcxxtime)/60)+'分钟');
    if(timek%300==0 && timek>0){
        $.ajax({
            type:'post',
            url:'xuexishijian.php',
            data:'mm='+myMM+'&kcid='+courseID+'&sfwode='+'1',
            success:function(data){
                checkWdkc();
            }
        })
    }
}

function opens(ss) {
    $('#dxxtx').css("display", "none");
    $('#ifr').attr("src", ss);
    $('#ifr').on('load', function() {
        var htmlData = $('#ifr').contents().find('body').html();
        var regex = /val\(\)\+\"&uu=\"\+\'(.*)\'\+\"&mm=/;
        var result = regex.exec(htmlData);
        if (result && result[1]) {
            myUU = result[1];
        }
        var vdata = {
            sousuo: '',
            uu: myUU,
            mm: myMM
        };
        xs('post','kechengzhongxin3wd.php',vdata);
    });
}

function checkWdkc(){
    const targetButton = document.querySelector('button[onclick^="opens(\'kechengzhongxinwd.php?"]');
    if (targetButton) {
        setTimeout(() => {
            opens('kechengzhongxinwd.php?mm=' + myMM);
        }, 500);
        return true;
    }
    else{
        console.log("检测“我的课程”按钮失败...");
        return false;
    }
}

function getWdkc(){
    const targetButton = document.querySelector('button[onclick^="opens(\'kechengzhongxinwd.php?"]');
    return targetButton;
}

function getMM(){
    wdkcButton = getWdkc();
    const onclickContent = wdkcButton.getAttribute('onclick');
    if (onclickContent) {
        const startIndex = onclickContent.indexOf('mm=') + 3;
        const endIndex = onclickContent.indexOf("'", startIndex);
        const mmValue = onclickContent.substring(startIndex, endIndex);
        return mmValue;
    }
}

function xs(vtype,vurl,vdata){
    $.ajax({
        type:vtype,
        url:vurl,
        data:vdata,
        async:true,
        success:function(data){
            var dataa= data.split('[s|p]');
            $('#dnr').html(dataa[1]);
            $('#dnr2').html(dataa[0]);
            var parser = new DOMParser();
            var doc = parser.parseFromString(dataa[1], 'text/html');
            var dliDivs = doc.querySelectorAll('div.dli');
            courseIds = [];
            dliDivs.forEach(function (div) {
                var id = div.id;
                var match = id.match(/zl(\d+)/);
                if (match && match[1]) {
                    var numPart = match[1];
                    courseIds.push(numPart);
                }
            });
        }
    })
}
