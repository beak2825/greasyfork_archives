// ==UserScript==
// @name         安全教育平台qwq
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  qwq
// @author       bossbaby
// @match        *://huodong.xueanquan.com/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/406604/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0qwq.user.js
// @updateURL https://update.greasyfork.org/scripts/406604/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0qwq.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button1;
    var prob;
    var csrf;
    var dt=document.createElement("div");
    dt.id="dt";
    dt.innerText="🤪";
    document.body.appendChild(dt);
    var css=document.createElement("style");
    css.innerHTML="#dt{opacity:0.90;user-select:none;transition: all 0.2s;position:fixed;right:6px;bottom:6px;border:none;font-size:16px;width:36px;height:36px;display:block;z-index:9999999999999999;border-radius:100px;color:#fff;background:#a9e015;box-shadow:0 4px 6px rgba(50,50,93,.11);text-align:center;line-height:35px;}";
    document.body.appendChild(css);
    dt=document.getElementById("dt");
    dt.onclick=function(){
        for(var i=0;i<_QuestionList.length;i++){
            chooseList[i]={"ID":i+1,"M":"","N":"1"};
        }
        var x = $.post(Asmx + "/SubmitTest",{r: Math.random(),schoolYear: 2020,semester: semester,userType: region,answerJson: JSON.stringify(chooseList),prv: prvCode,city: cityId,county: countryId,
school: schoolId,grade: grade,Class: classRoom,comefrom: comefrom,version: version,TrueName: username,prvName2: prvName2,cityName2: cityName2},function(){})
        submitQ();
    }
})();
