// ==UserScript==
// @name         AutoAdc
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatic attendance
// @author       Fy
// @match        http://218.1.73.10/learningspace/learning/student/kaoqin_list.asp?studentid=*
// @require      http://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392680/AutoAdc.user.js
// @updateURL https://update.greasyfork.org/scripts/392680/AutoAdc.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var adcids = []
    var adclen = 0
    var videolen = 0
    var sid =""
    var term = ""
    var courses = $("td > a")
    var length = courses.length

    courses.each(function(){
        getAdc(this)
    });


    function getAdc(obj){
        if (obj.href.indexOf("kaoqinquery") >= 0){
            $.ajax({
                method:"GET",
                url:obj.href,
                mimeType:"text/html;charset=gb2312",
                success: function(data){
                    var html = $(data)
                    var trs = 0
                    var ok = 0
                    html.find("table:has(thead)").each(function(){
                        if($(this).find("thead td:first").html()=="上课次数") {
                            var index = -1
                            $(this).find("thead td").each(function(i){
                                if($(this).html()=="是否出勤"){
                                    index = i
                                }
                            })

                            if (index==-1) {
                                return
                            }

                            //tr
                            $(this).find("tbody > tr").each(function(){
                                trs++
                                //td
                                var tr = $(this)
                                if (tr.find("td:eq("+index+")").find("img").attr("src")=="images/hook.gif") {
                                    ok++
                                }

                                if (sid == "") {
                                    var href = tr.find("a:first").attr("href")
                                    if (href != undefined) {
                                        var reg = /sid=(\d+)/g
                                        var temp = href.match(reg)
                                        if (temp != null) {
                                            var arr = temp[0].split('=')
                                            sid = arr[1]
                                        }

                                        reg = /term=(\d{4}_\d)/g
                                        temp = href.match(reg)
                                        if (temp != null) {
                                            arr = temp[0].split('=')
                                            term = arr[1]
                                        }
                                    }
                                }
                            })
                        }
                    })

                    $(obj).after(" ["+ok+"/"+trs+"]")
                    if (ok != trs) {
                        var reg = /courseid=(\d+)/g
                        var ids = obj.href.match(reg)
                        if (ids != null) {
                            var arr = ids[0].split('=')
                            adcids.push(arr[1])
                        }
                    }
                    length--
                    if (length==0 && adcids.length > 0) {
                        $("table:first").before("<button type=\"button\" id=\"autoAdcbtn\">===>一键考勤<===</button>")
                        $("#autoAdcbtn").click(function(){
                            autoAdc();
                        });
                    }
                }})
        }else{
            length--
        }
    }

    function autoAdc(){
        adclen = adcids.length
        if (adclen > 0 && sid !="" && term != "") {
            $("#autoAdcbtn").html("考勤中，请稍后……")
            for(var j = 0; j < adclen; j++) {
                $.get("http://218.1.73.10/SCEPlayer/Default.aspx?studentid="+sid+"&courseid="+adcids[j]+"&termidentify="+term, adc);
            }

            return
        }
        alert("错误，未找到相关信息")
    }

    function adc(data) {
        var obj = $(data).find("#section-list-ul a")
        videolen += obj.length
        obj.each(function(){
            $.ajax({
                type: "Post",
                url: "http://218.1.73.10/SCEPlayer/Default.aspx/AddDacLog",
                data: "{'resourceId':'" + $(this).attr("data-id") + "','studentId':'" + sid + "'}",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                complete: function(data) {
                    videolen--
                    if (videolen == 0) {
                        window.location.reload(true)
                    }
                },
            });
        })
    }
})();