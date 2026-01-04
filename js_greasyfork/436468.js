// ==UserScript==
// @name         长春大学全自动评教
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  长春大学评教专用系统
// @author       Pointer/908170633@qq.com
// @match        http://cdjwc.ccu.edu.cn/jsxsd/xspj/*
// @license MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436468/%E9%95%BF%E6%98%A5%E5%A4%A7%E5%AD%A6%E5%85%A8%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/436468/%E9%95%BF%E6%98%A5%E5%A4%A7%E5%AD%A6%E5%85%A8%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==
var url = location.pathname;
var link = document.getElementsByClassName("Nsb_r_list Nsb_table")[0].getElementsByTagName("a");


//console.log(url);
if (url == '/jsxsd/xspj/xspj_find.do'){
    swal({
        title: "长春大学全自动评教系统",
        text: "本页面需要自己选择后面的评教会全自动进行\n Pointer/908170633@qq.com \n 快加好友发红白感谢我吧！！！哈哈哈",
        icon: "success",
        button: "确认",
    });
}

if (url == '/jsxsd/xspj/xspj_list.do'){
    console.log(url);
    for(var i=0; i<link.length; i++){
        if(link[i].text=='评价'){
            link[i].click();
            setTimeout(() => location.reload(), 500);
        } 
    }
}
if(url == '/jsxsd/xspj/xspj_edit.do'){
    console.log(url);
    try{
        document.getElementById("pj0601id_1_2").click();
        for (var j=2;j<=10;j++)
        {
            var x="pj0601id_"+j+"_1";
            document.getElementById(x).click();
        }
    }catch(err){
        console.log(err)
        console.log(err.message);
    }
    document.getElementById('jynr').value='老师教学认真负责 我觉得非常好';
    //document.getElementById("tj").click();
    //saveData(this,'1')
    document.getElementById("issubmit").value = "1";
    document.getElementById("tj").disabled=false;
    document.getElementById("Form1").submit();
    setTimeout(() =>window.close(), 200);
}



function sleep(n) {
        var start = new Date().getTime();
        //  console.log('休眠前：' + start);
        while (true) {
            if (new Date().getTime() - start > n) {
                break;
            }
        }
        // console.log('休眠后：' + new Date().getTime());
    }



(function() {
    'use strict';

    // Your code here...

})();