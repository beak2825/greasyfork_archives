// ==UserScript==
// @name        浙传一键评教
// @namespace    http://tampermonkey.net/

// @version      1.1
// @description  try to take over the world!
// @author      Mad_Man
// @match        http://xuanke.zjicm.edu.cn/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37246/%E6%B5%99%E4%BC%A0%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/37246/%E6%B5%99%E4%BC%A0%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
if(document.getElementById("txt_pjxx").value!=="")
    document.getElementById("Button1").click();
else{
    for(var j=0;j<13;++j) {
        var sel = document.getElementsByTagName('select')[j];
        for (var i = 0; i < sel.length; i++) {
        if (sel[i].value == "86-101") {
            sel[i].selected = true;
            document.getElementsByTagName('input')[j+3].value=100; }  }
document.getElementById("txt_pjxx").value='很好';//替换‘很好’来修改你对教师的评语
}
__doPostBack('DataGrid1$_ctl13$ddlpfdj','');
}

})();