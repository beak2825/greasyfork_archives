// ==UserScript==
// @name         好兑换
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  try to take over the world!
// @author       You
// @match        http://www.hdh18.com/index.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373139/%E5%A5%BD%E5%85%91%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/373139/%E5%A5%BD%E5%85%91%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
     //alert("http://www.hdh18.com/handler/rushordercount.ashx");
     $.getScript("https://cdn.bootcss.com/jplayer/2.9.2/jplayer/jquery.jplayer.min.js", function() {
        $("#jplayer").jPlayer({
            // swfPath: "http://www.jplayer.org/latest/js/Jplayer.swf",
            ready: function () {
                $(this).jPlayer("setMedia", {
                    mp3: "http://hao.1015600.com/upload/ring/000/994/63ac8513b87bb67e87042b856e2b6f01.mp3"
                });
            },
            supplied: "mp3"
        });
    });
    var cnt = 0;
    var stop = true;
    var amount = 10;
    var num = 0;
    var type = "";
    var html =  (function () {/*
     <select name="ddl_amount" id="ddl_amount" class="scinput">
		<option selected="selected" value="10">10元</option>
		<option value="20">20元</option>
		<option value="30">30元</option>
        <option value="50">50元</option>
		<option value="100">100元</option>
		<option value="200">200元</option>
        <option value="300">300元</option>
		<option value="500">500元</option>
	</select>
    <select name="ddl_num" id="ddl_num" class="scinput">
		<option selected="selected" value="1">1单</option>
		<option value="2">2单</option>
		<option value="3">3单</option>
        <option value="5">5单</option>
		<option value="10">10单</option>
	</select>
    <select name="ddl_type" id="ddl_type" class="scinput">
		<option selected="selected" value="">全部</option>
        <option value="mobile">移动</option>
		<option value="unicom">联通</option>
		<option value="telecom">电信</option>
	</select>
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
    $("#UpdatePanel1").eq(0).after(html+ "<input type='button' name='my_btn_search' value='自动抢单' id='my_btn_search' class='scbtn'> "
                                  // + "<input type='button' name='submitAllbtn' value='提交所有订单' id='submit_all_btn' class='scbtn'>"
                                   + "<span id='now_bills'>已经抢到0单</span>，提前结束请F5刷新"
                                   +" <div id='jplayer'></div>");
    if (localStorage.getItem("AMOUNT") != null) {
         amount = localStorage.getItem("AMOUNT");
         $("#ddl_amount").attr("value", amount);
    }
    if (localStorage.getItem("NUM") != null) {
         num = localStorage.getItem("NUM");
         $("#ddl_num").attr("value", num);
    }
    $('#my_btn_search').click(function() {
        if($("#my_btn_search").val() == "自动抢单") {
            stop = false;
            $("#now_bills").text("已经抢到0单");
            amount =  $("#ddl_amount").val();
            num = $("#ddl_num").val();
            type = $("#ddl_type").val();
            Refresh(amount, num, type);
        }
        else {
           stop = true;
           cnt = 0;
           $("#my_btn_search").val("自动抢单");
        }
    });
    //{"face10":5,"face20":0,"face30":2,"face50":4,"face100":1,"face200":0,"face300":0,"face500":0
    function Refresh(amount, num, type) {
        cnt ++;
        if(stop) return;
        $("#my_btn_search").val('刷新' + cnt + "次");
        localStorage.setItem("AMOUNT", amount);
        localStorage.setItem("NUM", $("#ddl_num").val());
        $.post("http://www.hdh18.com/handler/rushordercount.ashx", function(msg) {
              var obj = JSON.parse(msg);
              var key = "face" + amount;
              if(type != "") {
                 key = key + "_" + type;
              }
              if(obj[key] > 0) {
                  getBill(amount, type, function(msg) {
                      $("#jplayer").jPlayer('play');
                      num --;
                      $("#now_bills").text("已经抢到" + ($("#ddl_num").val() - num) + "单");
                      if(num == 0) {
                          //$('#my_btn_search').click();
                          setTimeout(function() {
                             window.location.href = 'index.aspx';
                          }, 1000);
                          return;
                      }
                      else {
                          Refresh(amount, num, type);
                      }
                  });
//                   if($("#orderlise tr").length > len) {
//                      stop = true;
//                      return ;
//                   }
//                   else {
//                       setTimeout(Refresh(amount), 1000);
//                       return;
//                   }
              }
              else {
                setTimeout(function() {
                    Refresh(amount, num, type);
                }, 50);
                return ;
              }

        });
    }

    function getBill(amount, type, cb) {
        var viewstate = $('#__VIEWSTATE').val();
        var eventvalidation = $("#__EVENTVALIDATION").val();
        var vsg = $("#__VIEWSTATEGENERATOR").val();
        if (type != "") {
            amount = amount + "_" + type;
        }
        var data = {
            makesureOrderId: '',
            __ASYNCPOST: true,
            __EVENTTARGET: '',
            __EVENTARGUMENT: '',
            ScriptManager1: 'UpdatePanel1|btn_search'+amount,
            __VIEWSTATE: viewstate,
            __EVENTVALIDATION: eventvalidation,
            __VIEWSTATEGENERATOR: vsg,
            ['btn_search' + amount]: '获取订单'
        };
        $.post("index.aspx", data, function(msg) {
            //alert(msg);
            cb(msg);
        });
   }

//    function submitOrder(makesureOrderId, cb) {
//        var viewstate = $('#__VIEWSTATE').val();
//         var eventvalidation = $("#__EVENTVALIDATION").val();
//         var vsg = $("#__VIEWSTATEGENERATOR").val();
//         var data = {
//             makesureOrderId: makesureOrderId,
//             __ASYNCPOST: true,
//             __EVENTTARGET: '',
//             __EVENTARGUMENT: '',
//             ScriptManager1: 'UpdatePanel1|Button1',
//             __VIEWSTATE: viewstate,
//             __EVENTVALIDATION: eventvalidation,
//             __VIEWSTATEGENERATOR: vsg,
//             ['Button1']: '确定'
//         };
//         $.post("index.aspx", data, function(msg) {
//            if(cb != null)
//                cb();
//         });
//    }
//    $("#submit_all_btn").click(function() {
//       var tr = $("#orderlise tr").eq(0);
//       var Refresh = function(tr) {
//           var btn = $(tr).find("td:eq(7) a:eq(0)");
//            //var orderId = $(this).closest('tr').find("td:eq(0)").text();
//            submitOrder($(btn).closest('tr').find("td:eq(0)").text(), function() {
//                  if(tr.next().length > 0) {
//                     Refresh(tr.next());
//                  }
//                  else {
//                      window.location.href = 'index.aspx';
//                  }
//            });
//       }
//       Refresh(tr);
//    });
//    function modifybtn() {
//       $("#orderlise tr").each(function() {
//            var tr = this;
//            var btn = $(tr).find("td:eq(7) a:eq(0)");
//            $(btn).removeAttr("href");
//            //var orderId = $(this).closest('tr').find("td:eq(0)").text();
//            $(btn).click(function() {
//                submitOrder($(this).closest('tr').find("td:eq(0)").text(), function() {
//                     window.location.href = 'index.aspx';
//                });
//            });
//       });
//    }
//    modifybtn();
//     var ref = null;
//     ref = setInterval(function(){
//         if(localStorage.getItem("REFRESH") != null) {
//              localStorage.removeItem("REFRESH");
//              clearInterval(ref);
//              window.location.href = 'index.aspx';
//         }
//     },2000);
    // Your code here...
})();