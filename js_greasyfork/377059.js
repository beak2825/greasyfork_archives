// ==UserScript==
// @name         浦发抢8包
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://weixin.spdbccc.com.cn/wxrp-page-redpacketspageclose/queryRedSelfPool
// @match        https://weixin.spdbccc.com.cn/wxrp-page-redpacketspageclose/operationErrorjsp
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/377059/%E6%B5%A6%E5%8F%91%E6%8A%A28%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/377059/%E6%B5%A6%E5%8F%91%E6%8A%A28%E5%8C%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ind0, ind1;
    var maxindex = 100;
    var err_url = "https://weixin.spdbccc.com.cn/wxrp-page-redpacketspageclose/operationErrorjsp";
    var flow_url = "https://weixin.spdbccc.com.cn/wxrp-page-redpacketspageclose/flowjsp";

    if (document.location.href == err_url || document.location.href == flow_url) {
        window.location.assign("https://weixin.spdbccc.com.cn/wxrp-page-redpacketspageclose/queryRedSelfPool");
    }

   function go(){

       var pufa_index = GM_getValue("pufa_index",0);

       console.log("pufa_index="+ pufa_index);

       pufa_index++;
       GM_setValue("pufa_index",pufa_index);

       if(pufa_index <= maxindex) {
           //document.getElementById("id2").click();
           close2();
           //close2();
           //cancel2();

           //document.getElementById("id4").click();
           //close4();
           //cancel4();
       }

   }

   function run(){
        var nowDate = new Date();
        var h = nowDate.getHours();
        var m = nowDate.getMinutes();
        var s = nowDate.getSeconds();
        console.log(h +":"+m+":"+s);
        if((h == 10) && (m == 0) && (s < 35)){
        //if((s < 5)){
            ind1 = self.setInterval(function () {
                clearInterval(ind1);
                window.location.assign("https://weixin.spdbccc.com.cn/wxrp-page-redpacketspageclose/queryRedSelfPool");
            }, 20);
            go();
            window.location.assign("https://weixin.spdbccc.com.cn/wxrp-page-redpacketspageclose/queryRedSelfPool");
        } else {

            GM_setValue("pufa_index",0);
            var tt;
            if(s < 50){
                tt = 2000;
            } else {
                tt = 100;
            }
            if(s > 57) {
                window.location.reload()
            }else{

                ind0 = self.setInterval(function () {
                    clearInterval(ind0);
                    run();
                }, tt);
            }
        }
    }

    ind0 = self.setInterval(function () {
        clearInterval(ind0);
        run();
    }, 100);
})();