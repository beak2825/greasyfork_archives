// ==UserScript==
// @name         One Admin Style Mod
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  调整国开新平台一些页面的显示效果
// @author       Delfino
// @match        https://teaching.pt.ouchn.cn/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442540/One%20Admin%20Style%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/442540/One%20Admin%20Style%20Mod.meta.js
// ==/UserScript==

async function sleep1(secs) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, secs * 1000)
    })
};

(function() {
    'use strict';
    let sleep = function (millisecs) {
        return new Promise((resolve) => setTimeout(resolve, millisecs));
    };
    var fTd = '.ant-table-row-cell-break-word{font-size:14px !important;margin:0;padding:0 }',
        bXuanxiu='.bXuanxiu {background: #f1c1c1;} ',//选修项目背景色
        inCheckbox='input[type=checkbox]{opacity:100;width:16px;height:16px}';
    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(fTd));
    style.appendChild(document.createTextNode(bXuanxiu));
    style.appendChild(document.createTextNode(inCheckbox));

    head.appendChild(style);

//当前位置:执行性培养方案/执行性培养方案管理
if (location.href=='https://teaching.pt.ouchn.cn/#/scheme/exeCultivationPlan/talentPlan'){
    let hideOthers=function(){
        var rows=document.getElementsByClassName('ant-table-row ant-table-row-level-0');
        var n=rows.length;
        for(var i=0;i<rows.length;i++){
            var str=rows[i].textContent;
            if (str.indexOf('直属')==-1){
                rows[i].style.display='none';
                n-=1;
            }
        }
        var info=document.getElementById('infoSX');
        if(info==null){
            info=document.createElement('span');
            info.id='infoSX';
            info.style='font-size:18px;color:#a00;font-weight:500;';
            document.getElementsByClassName('page_btn_box')[0].appendChild(info);
        };
        info.innerHTML=`筛选出 ${n} 条记录`;
    };
    let button = document.createElement('button');
    button.innerText = "筛选";
    button.style = '';
    button.id = "myBtnShaiXuan";
    button.onclick = hideOthers;

	var interval0 = setInterval(function() {
		if (document.getElementsByClassName("ant-table-content").length > 0) {
            var menubar=document.getElementsByClassName('page_btn_box')[0];
            menubar.appendChild(button);
            document.getElementById('myBtnShaiXuan').classList.add('ant-btn','ant-btn-primary');
			clearInterval(interval0);
			console.log("按钮添加完成，结束循环");
		} else {
			console.log("目标数据尚未出现");
		}
	}, 1000)
};
//执行性培养方案-模块课程-全部课程
if (/\bmoduleCourse\/moduleCourse\/\b/.test (location.href) ) {
    let filterXX=function(){
        var tds=document.getElementsByTagName('td');
        var count=0;
        for(var i=0;i<tds.length;i++){
            var str=tds[i].innerHTML;

            if (str.indexOf('选修')>-1){
                tds[i].previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.classList.add('bXuanxiu');
                tds[i].previousSibling.previousSibling.previousSibling.previousSibling.classList.add('bXuanxiu');
                tds[i].previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling
                      .children[0].children[0].children[0].children[0].checked=true;
                count+=1;
            }
        };
        console.log("共筛选出 "+count+" 条记录。");;
    };

    let button = document.createElement('button');
    button.innerText = "高亮选修";
    button.style = '';
    button.id = "myBtn";
    button.onclick = filterXX;

	var interval = setInterval(function() {
		if (document.getElementsByClassName("ant-btn ant-btn-danger").length > 0) {
            var menubox=document.getElementsByClassName('btn-box')[0];
            var oBtn=document.getElementsByClassName("ant-btn ant-btn-danger")[0].previousSibling;
            menubox.insertBefore(button,oBtn);
            document.getElementById('myBtn').classList.add('ant-btn','ant-btn-primary');
			clearInterval(interval);
			console.log("按钮添加完成，结束循环");
		} else {
			console.log("目标按钮尚未出现");
		}
	}, 1000)
};
/*
        let url = window.location.host;
        if(url.indexOf("quantuwang") >=0 || url.indexOf("54mn") >=0){
            console.log("函数1");
        }else if(url.indexOf("xsnvshen") >=0) {
            console.log("函数2");
        }
*/
})();
