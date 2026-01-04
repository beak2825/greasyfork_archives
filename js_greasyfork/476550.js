// ==UserScript==
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/1.12.4/jquery.min.js
// @name        书法考试批量导入白名单
// @namespace   roczyl
// @description 书法考试批量导入白名单功能
// @match       https://sfkj.nua.edu.cn/e*
// @author      ROC
// @version     1.0
// @grant       unsafeWindow
// @grant       window.onurlchange
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/476550/%E4%B9%A6%E6%B3%95%E8%80%83%E8%AF%95%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E7%99%BD%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/476550/%E4%B9%A6%E6%B3%95%E8%80%83%E8%AF%95%E6%89%B9%E9%87%8F%E5%AF%BC%E5%85%A5%E7%99%BD%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function(){
  'use strict';
  console.log("--- 脚本开始运行 ---");

  $().ready(function(){

    var rocDiv = '<div id="roc_batch" role="dialog" aria-modal="true" aria-label="批量添加" class="el-dialog" style="margin-top: 5vh; width: 600px; top: 0px;"><div class="el-dialog__header" style="cursor: move;"><span class="el-dialog__title">批量添加（直接从xls文件中复制粘贴两列）</span><button type="button" aria-label="Close" class="el-dialog__headerbtn"><i class="el-dialog__close el-icon el-icon-close"></i></button></div><div class="el-dialog__body"><div class="el-form-item is-required el-form-item--small"><div class="el-form-item__content"><div class="el-input el-input--small" style="width: 500px;"><textarea id="kshs" class="" style="width:100%;height:90px;padding:5px;margin:10px auto;border:1px solid #ccc;"></textarea></div></div></div></div><div class="el-dialog__footer"><div class="dialog-footer"><button id="roc_submit" type="button" class="el-button el-button--primary el-button--small"><span>确定</span></button></div></div></div>';

    let accessToken = localStorage.getItem('admin-pro-token');
    console.log("accessToken:" + accessToken);

    var userInfo = null;
    function getUserInfo(){
      $.ajax({
        url: "https://sfkj.nua.edu.cn/admin/userInfo",
        type: 'POST',
        headers: {"Accesstoken": accessToken},
        success: function(res){
          if(res.code==200){
            userInfo = res.data;
            console.log("userInfo:" + userInfo);
          }
        }
      });
    }
    userInfo = getUserInfo();

    var myInterval = setInterval(function(){
        let dialog = $("div.el-dialog").html();
        if(!dialog){
          return;
        }
        clearInterval(myInterval);
        $("div.el-dialog").parent().append(rocDiv);

        //设置间隔时间
        var itime = 50;

        $("#roc_submit").on("click",function(){
          var kshs = $("#kshs").val();
          if(kshs.trim==""){
            alert("请粘贴姓名 身份证号，每行一个");
            return;
          }
          kshs = kshs.split("\n");
          console.log("--- 开始循环 ---")

          for(var ii=0;ii<kshs.length;ii++){
              var ks = kshs[ii].trim();
              if(ks.length==0){ continue; }

              (function(ii,ks){   //延时执行函数
                setTimeout(function(){
                  let kaosheng = ks.split("\t");
                  console.log("开始提交数据：" + kaosheng[0] + ":" + kaosheng[1]);
                  $.ajax({
                      url: "https://sfkj.nua.edu.cn/admin/whitelistManagement/doAdd",
                      type: 'POST',
                      headers: {"Accesstoken": accessToken},
                      data: JSON.stringify({
                        "code": "",
                        "roles": [],
                        "province_name": "",
                        "province_code": userInfo["province_code"],
                        "city_name": "",
                        "city_code": userInfo["city_code"],
                        "county_name": "",
                        "county_code": userInfo["county_code"],
                        "applycentre_code": userInfo["code"],
                        "name": kaosheng[0].trim(),
                        "idnum_type": "1",
                        "idnum": kaosheng[1].trim(),
                        "idnum2": kaosheng[1].trim(),
                      }),
                      success: function(res){
                        if(res.errorCode==0){
                            $("span.el-icon-search").parent().click();
                        }else{
                           console.log("服务端返回信息：" + res.message)
                        }
                      }
                    });

                 },ii*itime);
              })(ii,ks);
              alert("提交信息完成，请点击查询按钮查看信息");
              console.log("--- 完成循环 ---")
          }
        });

        window.onurlchange = function(e){
            console.log(e);
        };

      },1000);

  })

/* 脚本结束 */
})();