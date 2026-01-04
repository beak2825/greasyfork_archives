// ==UserScript==
// @name         nimingxxlittleassistantcheckDuiZhang
// @namespace
// @version      0.0
// @description  “队”输入框不为空且“队”不在队伍中时离开队伍
// @author       0
// @match        https://nimingxx.com/*
// @icon         https://www.google.com/s2/favicons?domain=nimingxx.com
// @grant        unsafeWindow
// @license      MIT
// @namespace https://nimingxx.com
// @downloadURL https://update.greasyfork.org/scripts/446333/nimingxxlittleassistantcheckDuiZhang.user.js
// @updateURL https://update.greasyfork.org/scripts/446333/nimingxxlittleassistantcheckDuiZhang.meta.js
// ==/UserScript==
(function() {
    function checkduizhang(){
        var gjcheck=document.getElementById("ixxguaji").checked;
        console.log(gjcheck);
        if(gjcheck){
        console.log("checkduizhang");
        var duiwulist=document.getElementsByClassName("el-col el-col-24 el-col-xs-24 el-col-sm-24 el-col-md-24 el-col-lg-24 el-col-xl-24");
        for(var i=0;i<duiwulist.length;i++){
            var name=duiwulist[i].getElementsByClassName("n-ellipsis")[0].querySelectorAll("span")[0].innerHTML;
            var duizhang=document.getElementById("ixxgroup").value;
            if(name==duizhang)return 0;
            if(duizhang=="")return 0;//你自己不就是队长？
        }
        document.getElementsByClassName("n-button n-button--info-type n-button--tiny-type n-button--ghost btn-t")[2].click();
        }
    }
    function init1(){
        console.log("init1");
        setTimeout(init1,5000);
        checkduizhang();
    }
    init1();
}
)();
