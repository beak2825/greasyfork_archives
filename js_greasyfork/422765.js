// ==UserScript==
// @name         客服fq加桌垫备注
// @namespace    http://tampermonkey.net/
// @version     6.3
// @description  try to take over the world!
// @author      qq806350554
// @match        https://neworder.shop.jd.com/order/orderDetail?orderId=*
// @icon        https://www.zhihupe.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422765/%E5%AE%A2%E6%9C%8Dfq%E5%8A%A0%E6%A1%8C%E5%9E%AB%E5%A4%87%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/422765/%E5%AE%A2%E6%9C%8Dfq%E5%8A%A0%E6%A1%8C%E5%9E%AB%E5%A4%87%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var player = new Audio("https://downsc.chinaz.net/Files/DownLoad/sound1/202002/12588.mp3");

    let anniu='<button id="tjbz1" class="wb-btn-s wb-btn-gray-bd" style="display: inline-block;">加备注<tton>'
    $(".state-orderid-p").append(anniu)

    var item=$(".wb-table-b:eq(0)>tbody>tr")
    var num=item.length
    var beizhu1=""
     var kdz='库房';
    for (let i=0;i<num;i++){
        //let bz=item.eq(i).find(".t-l").eq(1).text().trim().split("布艺定制餐桌垫")[1]
        let bz1=item.eq(i).find(".t-l").eq(1).text().trim()

        var i2 = bz1.lastIndexOf(" ")
        var bz = bz1.substr(bz1.lastIndexOf(" ",i2-1)).replace("XMM","细棉麻").replace("(常用餐桌布)","").replace("定制","").replace("(茶几布/餐桌布)","").replace("（常用茶几）","").replace("(大餐桌布)","")
        console.log(bz)


        let sl=item.eq(i).find(".t-c").eq(5).text().trim()

        // if( bz !=" 1010黄色TPU(防水防油) 定制135*180cm(常用餐桌布)"&&bz !=" 大三角蓝色TPU(防水防油) 定制135*180cm(常用餐桌布)"&&bz !=" 1010绿色TPU(防水防油) 定制135*180cm(常用餐桌布)"&&bz !=" 北欧叶子黄色TPU(防水防油) 定制135*180cm(常用餐桌布)"&&bz !=" 大三角灰色TPU(防水防油) 定制90*135cm(茶几布/餐桌布)"&&bz !=" 大三角灰色TPU(防水防油) 定制135*220cm(茶几布/餐桌布)"){kdz='可定制';}
      if( bz !=" 大三角蓝色TPU(防水防油) 定制135*180cm(常用餐桌布)"&&bz !=" 北欧叶子黄色TPU(防水防油) 定制135*180cm(常用餐桌布)"){kdz='可定制';}
        // if( bz ==" 1010绿色TPU(防水防油) 定制135*180cm(常用餐桌布)"){kdz='库房';}
       // if( bz ==" 北欧叶子黄色TPU(防水防油) 定制135*180cm(常用餐桌布)"){kdz='库房';}
        //if( bz ==" 大三角灰色TPU(防水防油) 定制90*135cm(茶几布/餐桌布)"){kdz='库房';}
        bz.indexOf("双面款")>=0?bz='皮革 '+bz:1;
        bz.indexOf("枕套")>=0?bz='抱枕 '+bz:1;

        let beizhu0=bz+" "+sl+"块  "
        beizhu1=beizhu1+beizhu0.replace("成品","")

        //  console.log(bz+" "+sl+"块  ");

    }

    var bzz=kdz+":"+beizhu1+" 倩"
    bzz.indexOf('厚(食品级)')>0?bzz=bzz.replace("厚(食品级)","").replace("1块","").replace("可定制: ","").replace("透明","无味透明"):1;
    console.log(bzz)
    $(".state-orderid-p").on("click","#tjbz1",function(){



        $("#remarkArea").val(bzz)
        // $("#tjbz").click()
        $("#remarkSubmit").click()
         player.play();

    })






    // Your code here...
})();
