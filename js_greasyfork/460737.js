// ==UserScript==
// @name         skype自动拨号
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  获取本地服务中的电话号码，并自动拨打，简化工作人员操作
// @author       You
// @match        https://web.skype.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skype.com
// @grant        GM_xmlhttpRequest
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460737/skype%E8%87%AA%E5%8A%A8%E6%8B%A8%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/460737/skype%E8%87%AA%E5%8A%A8%E6%8B%A8%E5%8F%B7.meta.js
// ==/UserScript==
var isGo = true;

// <script src="https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.5.1.min.js"></script>
(function() {
    'use strict';
    var phoneNumber = "";

    function interval(func, wait){
        var interv = function(w){
            return function(){
                setTimeout(interv, w);
                func.call(null);
            }
        }(wait);

        setTimeout(interv, wait);
    }

    function clear() {
        phoneNumber = "";
        $("button").each(function() {
            var b = $(this);
            if(b.attr("title") == "关闭"){
                b.click();
            }
        });
    }

    function updateState(state, describe, phone) {
        //alert(phoneNumber)
        GM_xmlhttpRequest({
            method: "GET",
            url: 'http://127.0.0.1:8080/sip/CheckPhone/updateState?state='+state+'&phone='+phone+'&describe='+describe+'&userName=Rockwell Fgh',
            onload: function(res){
              clear();
            },
            onerror : function(err){
            }
        })
    }

    function call() {
         //alert("call");
        // alert(phoneThis.find("input").attr("placeholder"));
        //phoneThis.find("input").val("029137266")

        $("button").each(function() {
            var b = $(this);
            if(b.attr("title") == "呼叫。"){
                if(b.attr("aria-disabled") == "false") {
                    b.click();
                    //alert("hkkk")
                } else {
                    // 无效
                    //alert("无效")
                }
            }
        });


    }
    function inPhone(){
        $(".inputGradient").each(function() {
            var p = $(this);
            if(p.find("input").attr("placeholder") == "电话号码"){
                // a.find("input").val("82029137266")
                p.find("input").focus();
                //var phone = "023868836";
　　　　　　　　　　var ph = '82'+phoneNumber;

                for(var i = 0; i < ph.length; i++) {
                    $("button").each(function() {
                        var b = $(this);
                        if(b.attr("title") == ph[i]){
                            b.click();
                        }

                    });
                }
                //p.find("input").val("023868836").trigger("change");
                //p.find("input").change();
                setTimeout(call, 2000);

                // call(a)
            }
        })
    }
    interval(function() {
        var isPush = false;
        $("button").each(function() {
            var b = $(this);
            if(b.attr("aria-label") == "结束通话"){
                isPush = true;
            }
        });
        if(!isPush) {
            if(phoneNumber.length == 0) {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: 'http://127.0.0.1:8080/sip/CheckPhone/getOne',
                    onload: function(res){
                        // alert(res.responseText);
                        var data = JSON.parse(res.responseText)
                        if(data.code == 200){
                            phoneNumber = data.data.phone
                            isGo = true
                        }
                    },
                    onerror : function(err){
                    }
                })
            }
            if(isGo && phoneNumber.length > 0) {
                $(".inputGradient").each(function() {
                    var a = $(this);
                    // alert(a.find("input").attr("placeholder"));
                    if(a.find("input").attr("placeholder") == "电话号码"){
                        //a.find("input").val("")
                        isGo = false
                        setTimeout(inPhone, 2000);
                        // call(a)
                    } else {
                        $("button").each(function() {
                            var b = $(this);
                            if(b.attr("title") == "使用拨号盘"){
                                b.click();
                                isGo = false
                                setTimeout(inPhone, 2000);
                                // a.find("input").val("82029137266")
                                // call(a)
                                // setTimeout(call(a), 3000);
                                // isGo = false
                            }
                        });
                    }
                })
            } else {
                // alert($(".neutraloverride").find("div").first().find("div").first().find("div").first().find("div").first().attr("aria-label"))
                // 拿列表第一条记录
                // var obj = $(".neutraloverride").children("div").first().children("div").first().children("div").first().children("div").first().children("div").first().children("div").first().children("div");
                var obj = $(".scrollViewport").children("div").first().children("div").first().children("div").first().children("div").first().children("div").first().children("div");

                // alert(obj.html())
                var numberNo = false;
                //alert(obj.length >= 1)
                $(".css-1dbjc4n").each(function() {
                    var p = $(this);
                    if(p.html().indexOf("号码不可用") >=0 ){
                        numberNo = false;
                        updateState('completed', '号码不可用', phoneNumber);
                    } else if(p.html().indexOf("无法接听") >=0) {
                        numberNo = true;
                        updateState('completed', '无法接听', phoneNumber);
                    } else if(p.html().indexOf("连接太弱") >=0) {
                        numberNo = true;
                        updateState('wait_check', '网络弱', phoneNumber);
                    } else if(p.html().indexOf("出错") >=0) {
                        numberNo = true;
                        updateState('wait_check', '出错', phoneNumber);
                    }
                })
                if($(".noFocusOutline").html().indexOf('无效') > 0) {
                    updateState('failed', '无效', phoneNumber);
                }else if(obj.length >= 1){
                    var objP = obj.eq(1).children("div").first().children("div").first();
                    //alert(objP.html());
                    // <div data-text-as-pseudo-element="+82820333363277" dir="auto" style="position: relative; display: inline; flex-grow: 0; flex-shrink: 1; overflow: hidden; white-space: pre; text-overflow: ellipsis; font-size: 16px; margin-bottom: 0px; color: rgb(225, 225, 225); font-family: &quot;SF Regular&quot;, &quot;Segoe System UI Regular&quot;, &quot;Segoe UI Regular&quot;, sans-serif; font-weight: 400; line-height: 22px; cursor: inherit;"></div>
                    // position: relative; display: flex; flex-direction: row; flex-grow: 0; flex-shrink: 0; overflow: hidden; align-items: center; align-self: stretch; padding-right: 6px;
                    //<div data-text-as-pseudo-element="+82820333363277" dir="auto" style="position: relative; display: inline; flex-grow: 0; flex-shrink: 1; overflow: hidden; white-space: pre; text-overflow: ellipsis; font-size: 16px; margin-bottom: 0px; color: rgb(225, 225, 225); font-family: &quot;SF Regular&quot;, &quot;Segoe System UI Regular&quot;, &quot;Segoe UI Regular&quot;, sans-serif; font-weight: 400; line-height: 22px; cursor: inherit;"></div>
                    var phone = objP.attr("data-text-as-pseudo-element").substring(5);
                    if(phone == phoneNumber) {
                        var objText = obj.eq(1).children("div").eq(1).children("div").first().children("div").first().children("div").first();
                        var tState = objText.text();
                        // alert(tState)
                        if(tState.indexOf("通话已结束") >= 0) {
                            // completed failed
                            updateState('completed', '通话已结束', phone)
                        }else if(tState.indexOf("通话结束") >= 0) {
                            // completed failed
                            updateState('completed', '通话结束', phone)
                        }else if(tState.indexOf("无人接听") >= 0) {
                            // completed failed
                            updateState('completed', '无人接听', phone)
                        }
                    } else{
                        //setTimeout(clear, 2000);
                        clear();
                    }
                }
            }
        }

    }, 10000);

    /**
     * stime 开始时间 etime 结束时间
     */
    function compareTime (stime, etime) {
        // 转换时间格式，并转换为时间戳
        function tranDate (time) {
            return new Date(time.replace(/-/g, '/')).getTime();
        }
        function tranDate2 (time) {
            let thisDate = new Date();
            return new Date(thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate() + ' ' + time).getTime();
        }
        // 开始时间
        let startTime = tranDate2(stime);
        // 结束时间
        let endTime = tranDate2(etime);
        let thisDate = new Date();
        // 获取当前时间，格式为 2018-9-10 20:08
        let currentTime = thisDate.getFullYear() + '-' + (thisDate.getMonth() + 1) + '-' + thisDate.getDate() + ' ' + thisDate.getHours() + ':' + thisDate.getMinutes();
        let nowTime = tranDate(currentTime);
        // 如果当前时间处于时间段内，返回true，否则返回false
        if (nowTime < startTime || nowTime > endTime) {
            return false;
        }
        return true;
    }

    // 定时刷新页面
    var timer2 = setInterval(function() {
        if(compareTime('06:50', '21:10')) {
         //   location.reload();
        }
        }, 300000);

    // Your code here...
})();