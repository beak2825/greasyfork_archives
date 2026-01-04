// ==UserScript==
// @name         SCUT_Lesson_Table
// @namespace    http://xsjw2018.jw.scut.edu.cn/SCUT_Lesson_table
// @version      0.1
// @description  华工教务导出课表为JSON格式
// @author       mengyiqwq
// @match      http://xsjw2018.jw.scut.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scut.edu.cn
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/450579/SCUT_Lesson_Table.user.js
// @updateURL https://update.greasyfork.org/scripts/450579/SCUT_Lesson_Table.meta.js
// ==/UserScript==
var res=[];
function downLoad(content,fileName){
        let link = document.createElement('a')
link.download = fileName;
link.href = 'data:text/plain,' + JSON.stringify(content)
link.click()
}
function getNodes(dom){
    console.log(dom.innerText);
    var str=dom.innerText;
    str=str.replace(/\r\n/g,"");
    str=str.replace(/\n/g,"");
    str = str.replace(/\s/g,"");
    var pattern=/星期[一二三四五六日]/g;
    var re=[...str.matchAll(pattern)];
    console.log(re,str.indexOf("其他课程",4));
    for(let i=0;i<re.length;i++){
    let end=i+1<re.length?re[i+1].index:str.indexOf("其它课程",4) ;
    console.log(str.slice(re[i].index,end));
    var temp=str.slice(re[i].index,end);

    var lessonreg=/((1-2)|(3-4)|(5-6)|(7-8)|(9-10)|(11-12)|(3-3)|(7-7)|(11-11)|(5-7)|(1-3)|(9-11))(?!教学班)/g;
    var alllessonreg=/[0-9]{1}-[0-9]{1,2}周/g;
    let lessonone=temp.match(lessonreg);
    let sessionone=temp.match(alllessonreg);
    console.log(lessonone);
    let arr=[];
    for(let i=0;i<lessonone.length;i++){
    arr.push({
    session:lessonone[i],
    duration:sessionone[i]
    });
    }
    res.push({day:temp.substring(0,3),arr
    });
    }
}
(function() {
    'use strict';
    let uibtn=document.createElement("button");
    uibtn.innerHTML="导出";
    uibtn.style.marginLeft="500px";
    uibtn.style.marginTop="-1500px";
    uibtn.style.color="red";
    uibtn.style.position="absolute";
     let dom= document.getElementById("table2");
     dom.className="tab-pane fade active in";
    let vdom= document.getElementById("table1");
    vdom.className="tab-pane fade";
    getNodes(dom);
    dom.parentNode.appendChild(uibtn);
    // Your code here...
    uibtn.onclick=function(v){
    let dom= document.getElementById("table2");
    getNodes(dom);
    console.log(res);
    let result={
    table:res
    }
    downLoad(result,'test.json')
    }
})();