// ==UserScript==
// @name         华医网跳过人脸识别认证
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  华医人脸识别
// @author       You
// @match        http://*.91huayi.com/pages/exam_tip.aspx?cwrid=*
// @match        http://*.91huayi.com/course_ware/course_ware_cc_tip.aspx?cwrid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441007/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%B7%B3%E8%BF%87%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB%E8%AE%A4%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/441007/%E5%8D%8E%E5%8C%BB%E7%BD%91%E8%B7%B3%E8%BF%87%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB%E8%AE%A4%E8%AF%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    debugger;
   //查询用户是否认证
    queryIsAuth()
        function queryIsAuth() {
            //if (false) {
                //return false;
            //}
            //flag = true;
            $.ajax({
                url: "/ashx/get_user_auth.ashx",
                timeout: 10000 * 60, //超时时间 单位毫秒
                type: "POST",
                dataType: "json",
                data: {
                    qrcode_id: qrCodeID,
                    unit_no: "02",//二维码所属系统02
                    cwrid: relation_id,
                    r: Math.random()
                },
                async: true,
                success: function (data) {
                    //console.log(data);
                    data.code = 1
                    if (data.code == 1) {//已认证
                        //clearInterval(queryIsAuth);
                        $("#sao_success").show();
                        setTimeout(function () {
                            //window.location.href = "exam.aspx?cwid=" + relation_id;
                            //window.location.href = "course_ware_cc.aspx?cwid=" + relation_id + "&batchId=" + data.message;
                            //window.location.href = "course_ware_test_cc.aspx?cwid=" + relation_id + "&batchId=" + data.message;
                            window.location.href = "course_ware_polyv.aspx?cwid=" + relation_id + "&batchId=" + data.message;
                        }, 1000);
                    } else if (data.code == 0) {//用户还未认证继续请求
                        flag = false;
                    } else if (data.code == 5) {//二维码id已过期，请刷新重新扫码
                        //clearInterval(queryIsAuth);
                        $("#sao_refresh").show();
                    } else {
                        //clearInterval(queryIsAuth);
                        layer.alert(data.message, { offset: 't', icon: 3 });
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    //clearInterval(queryIsAuth);
                    layer.alert(textStatus, { offset: 't', icon: 2 });
                }
            });
        };
    //$("#sao_success").show();  //认证成功
//window.location.href = "exam.aspx?cwid=" + relation_id;

    // Your code here...
})();