// ==UserScript==
// @name        数供网
// @namespace    http://tampermonkey.net/
// @version      0.71
// @description  try to take over the world!
// @author       shinelin
// @match        http://wap.shugongwang.cn/*Order*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373056/%E6%95%B0%E4%BE%9B%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/373056/%E6%95%B0%E4%BE%9B%E7%BD%91.meta.js
// ==/UserScript==




(function() {
  'use strict';

    var content = null;
    var productId = null;
    var stop = true;
    var group_cnt = 24;
    jQuery.ajaxSetup({async:false});
    $.post("http://wap.shugongwang.cn/app/crafter/getOrderInventory", {type: 1, visibility: true}, function(res){
           content = res.content;
        // console.log(content);
    });

    var html = (function () {/*
 <br />
 <select style="width:120px" id="amount">
  <option value ="10">10</option>
  <option value ="20">20</option>
  <option value="30">30</option>
  <option value="50">50</option>
  <option value ="100">100</option>
  <option value ="200">200</option>
  <option value="300">300</option>
  <option value="500">500</option>
</select>
 <select style="width:120px" id="provider">
  <option value ="0">全部</option>
  <option value ="1">移动</option>
  <option value="2">联通</option>
  <option value="3">电信</option>
  <option value="4">除电信</option>
</select>
<input id="slower" type="checkbox" value="1" />允许慢充
    <button type="button" id = "rush_btn" class="mu-button mu-primary-color mu-inverse " style="outline: none; -webkit-appearance: none; user-select: none; width:200px">
       <div class="mu-button-wrapper">
           <div class="mu-ripple-wrapper"></div>自动接单
        </div>
    </button>
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

    // Your code here...
    var rush = function() {
        $("#root > div:nth-child(3) > div.order-pool > p > span").after(html);

        if(localStorage.getItem("AMOUNT") != null)
            $("#amount").val(localStorage.getItem("AMOUNT"));
        if(localStorage.getItem("PROVIDER") != null)
            $("#provider").val(localStorage.getItem("PROVIDER"));

         // 复选框
        $("#slower").change(function() {
            if(this.checked) {
                group_cnt = content.length;
            }
            else {
                group_cnt = 24;
            }
            productId = get_product_id($("#amount").val());
            console.log("允许慢充状态" + group_cnt);
        });

        var url = "http://wap.shugongwang.cn/app/crafter_order/snatch";
        var provider_check = function(val) {
            var sel = $("#provider option:selected").val();
            if(sel == 0) return true;
            if(sel > 0 && sel < 4) {
                  return val.indexOf($("#provider option:selected").text()) >= 0;
            }
            if(sel == 4) {
                  return val.indexOf("电信") < 0;
            }
        }
        var get_product_id = function(val) {
             var res = [];
             for (var i in content) {
                 if (i == group_cnt) break; // 快充
                 var obj = content[i].productGroup;
                 if(obj.faceValue == val && provider_check(obj.name)) {
                     res.push(obj.id);
                 }
             }
            return res;
        }
        var id = 0;
        var data = {
            amount: 1,
            productGroupId: ''
        };
        var run = function(cnt) {
            if(stop) return ;
            $("#rush_btn").text("接单"+ cnt + "次");
            data.productGroupId = productId[id%productId.length];
            ++id;
            $.post(url, data, function(res){
                if(res.code == 10001 || 10006 == res.code) {
                    setTimeout(()=>{run(cnt+1)}, 1000);
                }
                else {
                    $("#root > div.header > div").eq(1).click();
                    setTimeout(alert("抢到订单了"),1000);
                }
                console.log(JSON.stringify(res));
            });
        }
        $("#rush_btn").click(function(){
             if($(this).text().indexOf("自动接单") >= 0) {
                 productId = get_product_id($("#amount").val());
                 console.log(productId);
                 localStorage.setItem("AMOUNT", $("#amount").val());
                 localStorage.setItem("PROVIDER", $("#provider").val());
                  stop = false;
                  run(1);
             }
             else {
                 stop = true;
                 $(this).text("自动接单");

             }
        });
     }
    setTimeout(rush, 1000);
})();

