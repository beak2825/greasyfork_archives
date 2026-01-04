// ==UserScript==
// @name         Jenkins
// @namespace    http://tampermonkey.net/
// @version      5
// @description  try to take over the world!
// @author       You
// @match        http://*/jenkins/view/*/job/*/
// @match        http://*/jenkins/job/*/
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382252/Jenkins.user.js
// @updateURL https://update.greasyfork.org/scripts/382252/Jenkins.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
// Your code here...

$(document).ready(function () {
    $("body").append(`<div class="am-progress am-progress-xs" style="position:fixed;width: 100%;top:0;display: none;z-index=9999;left: 0;"><div class="am-progress-bar" style="width: 80%;"></div></div>`)
    if($("#buildHistory").length <= 0) return

    var cur = 0
    var mmax = 0
    $("#breadcrumbs").append($("<li><input class='exPut'type='button' value='查看构建列表'></li>").click(function () {
        cur = 0
        $(`<style>
        *{
            padding:0;
            margin: 0;
        }

        #result_tb tr,#result_tb td,#result_tb th{
            color:black;
            white-space: nowrap;
            text-align:center;
            vertical-align: middle;
            margin:0 auto;
            font-family:'Microsoft YaHei';
            font-size:13px;
        }

        #result_tb tr:hover{
            background-color:#66ffff;
            color: black;
        }
        </style>`).appendTo('head');

        $("#main-panel").html("<table border=0 id='result_tb'><tbody></tbody></table>");

        var urls = new Array()
        var href = $(".build-status-link").eq(0).attr("href");
        var strArr = href.split("/")
        var max = Number(strArr[strArr.length - 2])
        href = href.replace(max + "/console", "")
        for (let index = max; index >= 0; index--) {
            $("#result_tb").prepend("<tr></tr>")
            var url = "http://" + window.location.host + href + index + "/api/json";
            //console.info("请求地址：" + url)
            urls.push(url);
        }

        $.get(urls[0], function (data, staus) {
            var result = "<th></th>";
            result += "<th></th>";
            result += "<th></th>";
            result += "<th>svn ver</th>";
            var parameters = data.actions[0].parameters;
            for (var i = 0; i < parameters.length; i++) {
                result += "<th>" + parameters[i].name + "</th>";
            }
            $("#result_tb tr:eq(0)").prepend($(result)).find("th").each(function () {
                $(this).click(function () {
                    var idx = $(this).index()
                    $("#result_tb tr").each(function () {
                        $(this).find("td:eq(" + idx + ")").remove();
                    })
                    $(this).remove();
                })
            });
        });

        $(".am-progress-xs").css("display","initial")
        $(".am-progress-bar").css("width","0%")
        mmax = urls.length
        for (let index = 0; index < urls.length; index++) {
            const url = urls[index];


            $.get(url, function (data, staus) {
                //console.info("数据：" + data)
                cur++
                $(".am-progress-bar").css("width",((cur/mmax) * 100) + "%")
                if(cur==mmax) $(".am-progress-xs").css("display","none")

                var idx = index + 1
                var time = new Date(data.timestamp)
                var result = "<td>" + data.displayName + "</td>";
                result += "<td>" + time.toLocaleString() + "</td>";
                result += "<td>" + data.actions[1].causes[0].userName + "</td>";
                result += "<td></td>";

                var logUrl = url.replace("api/json","logText/progressiveText")
                $.get(logUrl, function (_data, _staus) {
                    var ret = "",matchReg=""
                    if(_data.indexOf("SVN版本号:") != -1){
                        matchReg = /SVN版本号:.*/g;
                        ret = _data.match(matchReg)[0]
                        ret = ret.replace("SVN版本号:","")
                    }else if(_data.indexOf("Last Changed Rev") != -1){
                        matchReg = /Last Changed Rev.*/g;
                        ret = _data.match(matchReg)[0]
                        ret = ret.replace("Last Changed Rev:","")
                    }else if(_data.indexOf("Checked out revision") != -1){
                        matchReg = /Checked out revision.*/g;
                        ret = _data.match(matchReg)[0]
                        ret = ret.replace("Checked out revision","")
                    }else{
                        ret = "null"
                    }
                    if(_data.indexOf("m_UnitySvnVersion:") != -1){
                        matchReg = /m_UnitySvnVersion:.*/g;
                        var temp = _data.match(matchReg)[0]
                        temp = temp.replace("m_UnitySvnVersion:","")
                        if(temp != "0")ret = temp
                    }
                    //console.log(ret,logUrl)

                    $("#result_tb tr:eq(" + idx + ")").find("td:eq(3)").html(ret)
                });

                var parameters = data.actions[0].parameters;
                var index_Network = 5;
                var index_QRCode = 12;
                for (var i = 0; i < parameters.length; i++) {
                    result += "<td>" + parameters[i].value + "</td>";
                }
                //console.info("当前信息：" + result)
                $("#result_tb tr:eq(" + idx + ")").prepend($(result));
                $("#result_tb tr:eq(" + idx + ")").each(function () {
                    $(this).click(function () {
                         for (var i = 0; i < parameters.length; i++) {
                            if(parameters[i].name == "内网外网"){
                                index_Network = i;
                            }else if (parameters[i].name == "QRCode"){
                                index_QRCode = i;
                            }
                        }
                        //console.info("内外网：" + index_netwoek + "---" + "二维码：" + index_QRCode)
                        if(parameters[index_QRCode].value == "yes" && parameters[index_Network].value == "内网测试" || parameters[index_Network].value == "测试服"){
                            var qrcode_url = data.url.replace(data.url.substring(data.url.lastIndexOf(data.number)), "ws/QRCode/");
                            qrcode_url += data.number + ".png";
                            //window.open(data.url,"_blank");
                            window.location.href = qrcode_url;
                        }else{
                            window.alert("当前APK没有二维码，再点剁手！！");
                        }
                    });
                 });
            });
        }
    }));

    $(document).ajaxError(function(e,xhr,opt){
        cur++
        if(cur==mmax) $(".am-progress-xs").css("display","none")
        $(".am-progress-bar").css("width",((cur/mmax) * 100) + "%")
    });
});