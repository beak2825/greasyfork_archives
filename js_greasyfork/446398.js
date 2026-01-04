// ==UserScript==
// @name         银行作业提交(人民银行)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动获取题库，自动选择，人工提交
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @author       吴大师(wxj)
// @match        https://web.examonline.group*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wjx.top
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446398/%E9%93%B6%E8%A1%8C%E4%BD%9C%E4%B8%9A%E6%8F%90%E4%BA%A4%28%E4%BA%BA%E6%B0%91%E9%93%B6%E8%A1%8C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446398/%E9%93%B6%E8%A1%8C%E4%BD%9C%E4%B8%9A%E6%8F%90%E4%BA%A4%28%E4%BA%BA%E6%B0%91%E9%93%B6%E8%A1%8C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tflag=0;
    var tstr="";
    var jdata=new Array();
  $(document).ready(function() {
      console.log("载入完毕");
  setInterval(function(){
      // console.log("载入11111");
      // console.log($(".question-content").length);//question-content mt-[40px] relative text-left
       if ($(".question-content").length > 0 && tflag == 0){
                   $.ajax({
                    url: "https://raw.githubusercontents.com/wxjwolf/wxjwolf/main/fanjiatiku1.json",
                    dataType: "json",
                    success: function (odata) {
                        console.log(odata);
                        for (var t = 0; t < odata.data.length ; t++) {
                            jdata[t]=odata.data[t];
//                             jdata[t]=odata.data[t];
                        }
                    }
                });
           tflag=1;
       }
       if (jdata.length > 0 && $(".comm-btn-wrap.flex.items-center.justify-center.btn-disabled").length > 0 && $.trim($('.comm-btn-wrap.flex.items-center.justify-center.btn-disabled:eq(0)').text()) == "下一题" || $.trim($('.comm-btn-wrap.flex.items-center.justify-center.btn-disabled:eq(0)').text()) == "提交"){ //comm-btn-wrap flex items-center justify-center btn-disabled
           var tstring=$(".question-content").text();
           var reg=/\s+/g;
           tstring=tstring.replace(reg,"");
           // console.log(jdata.length);
            for (var i = 0; i < jdata.length; i++) {
                // console.log(jdata[i].question);
                var qstr=jdata[i].question;
                qstr=qstr.replace(reg,"");
                if ($.trim(qstr) == $.trim(tstring)) {
                    console.log(qstr);
                    var daan=jdata[i].answer;
                    console.log(daan);
                    for (var i1 = 0; i1 < daan.length; i1++) {
                        var i2 = $.inArray(daan.substr(i1,1),["A", "B", "C", "D", "E", "F"]);
                        //sel-item-box flex items-center justify-center mb-[24px] relative
                        $('.sel-item-box')[i2].click();
                    }
                    break;
                }
            }
        }
      // if (jdata.length > 0 && $(".comm-btn-wrap.flex.items-center.justify-center.btn-enabled").length > 0){
      //     console.log("数量:" + $(".comm-btn-wrap.flex.items-center.justify-center.btn-enabled").length);
      //     for (i=0;i<$(".comm-btn-wrap.flex.items-center.justify-center.btn-enabled").length;i++){
      //       if ($.trim($('.comm-btn-wrap.flex.items-center.justify-center.btn-enabled:eq(' + i + ')').text()) == "下一题"){
      //           console.log($.trim($('.comm-btn-wrap.flex.items-center.justify-center.btn-enabled:eq(' + i + ')').text()));
      //           $(".comm-btn-wrap.flex.items-center.justify-center.btn-enabled")[i].click();
      //           break;
      //       }
      //     }
      //   }
    },1000)
  });
    // Your code here...
})();