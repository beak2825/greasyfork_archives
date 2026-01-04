// ==UserScript==
// @name         vc自动加收货人名/字数最多输入500字
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  try to take over the world!
// @author       qq806350554
// @match        https://pdropship.jd.com/orderManage/initListPage
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422706/vc%E8%87%AA%E5%8A%A8%E5%8A%A0%E6%94%B6%E8%B4%A7%E4%BA%BA%E5%90%8D%E5%AD%97%E6%95%B0%E6%9C%80%E5%A4%9A%E8%BE%93%E5%85%A5500%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/422706/vc%E8%87%AA%E5%8A%A8%E5%8A%A0%E6%94%B6%E8%B4%A7%E4%BA%BA%E5%90%8D%E5%AD%97%E6%95%B0%E6%9C%80%E5%A4%9A%E8%BE%93%E5%85%A5500%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
var anniu=`<button type="button"style="float: right;"  id="add_name"class="pui-button ui-widget ui-state-default ui-corner-all pui-button-text-icon-left" role="button" aria-disabled="false">
<span class="pui-button-icon-left ui-icon ui-icon-key"></span>
<span class="pui-button-text">添加收货人</span>
</button>`
// var zsxz=`<button type="button"style="float: right;" id="zsxz"class="pui-button ui-widget ui-state-default ui-corner-all pui-button-text-icon-left" role="button" aria-disabled="false">
// <span class="pui-button-icon-left ui-icon ui-icon-image"></span>
// <span class="pui-button-text">突破字数限制</span>
// </button>`
    var kefu = "涵";
    var timer3 = "";
    var ccc=''
    let mt={
        "width":"100%",
        "margin-left":"0px"
    }
    let _none={
        "display":"none",

    }
    let tit={
        "background":"rgba(255, 255, 255,0.9)",
        "border-bottom": "1px solid #cfcfcf",
        "text-align": "center",
        "height": "34px",
        "line-height": "34px",
        "border": "0px",
        "font-size": "18px"
    }
    let addremark={
        "border-radius":"3px",
        "outline":"0",
        "background":"rgba(255,255,255,0.5)",
        "backdrop-filter":"blur(10px)",
        "width": "585px",
        "line-height":"2em",
        "border":"0px",
        "height": "190px",
        "margin-left":"0",
        "padding": "10px",
        "resize":"none",

    }

    let bd={
       "background":"url( https://api.btstu.cn/sjbz/api.php?lx=fengjing&format=images) no-repeat",
        "background-repeat-y": "repeat",
        "background-attachment":"fixed",
        "background-size":"100%",
       
    }
      let remarkWin={
          "background-image": "linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%)",
          "box-shadow": "rgb(121 122 125) 5px 5px 12px, rgb(255 255 255) -5px -5px 12px",
           "background": "url(https://source.unsplash.com/random) no-repeat",
              "background-size": "cover"


      }
         let tu={

             "box-sizing":"border-box",
             "border":"1px solid #ccc",
             "background":"#fff",
              "border-radius":"3px",
             "outline":"0px",
      }
      let btn={
          "box-shadow": "5px 5px 11px #bdbdbd,-5px -5px 11px #ffffff",
          "border": "0px",
           "background": "#fff"
      }
      let hov={

          "box-shadow":"inset 5px 5px 8px #f0ebeb,inset -5px -5px 8px #ffffff"
      }

 timer3=setInterval(func1,1000)

    function func1() {
        if( $(".pui-dialog-buttonpane").length>7){
            clearInterval(timer3)
            console.log("找到了了")
            //             ---------------------------------------------------------------------------------------
            $(".pui-dialog-buttonpane").eq(5).append(anniu)
            $("#addRemark").eq(0).attr("maxlength","500");
            $("#addRemark").eq(0).attr("placeholder","最多能输入500个字");
            $("#mytable").css(mt)
            $("#idTable").css(_none)
            $("#doAddCarrierForm>div>div>div").css(_none)
            $("#mytable tr").eq(0).css(_none)
            $("#remarkWin div").eq(0).css(tit)
            $("#remarkWin_label").css({"float":" none","margin": "0px"})
            $(".pui-dialog-titlebar-maximize").eq(5).css(_none)
            $(".pui-dialog-titlebar-minimize").eq(5).css(_none)
            $("#addRemark").css(addremark)
            $("#remarkWin").css(remarkWin)
            $("#mytable tr").eq(2).css(_none)
            $(".pui-dialog-buttonpane").eq(5).css("background","rgba(255, 255, 255,0.9)")
            $(".pui-dialog .pui-dialog-buttonpane button").css(btn)
            $(".ui-state-hover").css(hov)
            $(".clearfix").eq(0).css("height","913px")
            $(".clearfix").eq(0).css("margin-bottom","0px")
            $("body").css("padding-bottom","1000px")
            $(".page-left").css("height","903px")
            $(".page-left").css("border-radius","5px")
            $(".page-left").css("overflow","hidden")
            $("#tabChangeUl").css("background","#fff")
            $("#tabChangeUl").css("border","0px")
            $("#tabChangeUl").css("border-bottom","1px solid #ccc")
            $(".page-left").css("margin-top","10px")
            $(".crumbs").css("display","none")
            $("#outBoundDiv").css("margin-left","0px")
            $("#outBoundDiv").css("width","1046px")
            $("#outBoundDiv").css("border-bottom","1px solid #ccc")
            $("#outBoundDiv").css("margin-bottom","10px")
            $(".modcon>div").eq(0).css("margin-bottom","10px")
            $(".page-left").css("background","rgb(248,248,248)")
            $("body").css(bd)
            $("#left-menu-box").css("background","#fff")
            $("#left-menu-box").css("height","auto")
            $(".pageHeader-banner").css("background","#ffffff66")
            $(".header-wrap").css("background","#ffffff66")
            $(".header-wrap").css("border","0px")
            $(".pageHeader-banner").css("backdrop-filter","blur(10px)")
            $(".header-wrap").css("backdrop-filter","blur(10px)")
            $(".clearfix").eq(0).css("background","#ffffff66")
//             $(".clearfix").eq(0).css("backdrop-filter","blur(10px)")

            $(".modcon").eq(0).css("padding","0")
            $(".div_warn").css("display","none")
            $("#outboundGridPanel").css("padding","1em 0em")
             $("#outboundGridPanel").css("background","#fff")
            $("#gbox_outboundGrid").css("width","auto")
            $("#gview_outboundGrid").css("width","auto")
            $("#outboundGrid_page").css("width","auto")
            $("#gview_outboundGrid>div").css("width","auto")
            $("#header").css("width","1280px")
            $(".page-right").css("width","1080px")

            $("#header").css("border-radius","5px 5px 0px 0px")
            $(".clearfix").eq(0).css("border-radius","0px 0px 5px 5px")
            $("#orderManageTabDiv").css("border","0px")
            $("#orderManageTabDiv").css("margin-bottom","0px")
            $("th:contains(客户订单号：)").text("客户订单：")
            $("th:contains(省份：)").text("所在省份：")
            $("th:contains(商家仓：)").text("商家仓库：")

            $(".form-tb th").css("text-align","center")
            $(".form-tb th").css("display","block")
            $(".form-tb th").css("line-height","27px")
            $(".form-tb th").css("width","124px")
            $("#outBound_fromDate").css("width","101px")
            $("#outBound_toDate").css("width","102px")
            $("#outBoundBusinessType").css("width","100%")
            $("#pin").css("width","100%")
            $("#pin").css("box-sizing","border-box")
            $("#parentOrderIds").css("width","100%")
            $("#paymentType").css("width","100%")
            $("#outboundVendorStoreId").css("width","100%")

             $("#outBound_fromDate").css(tu)
            $("#outBound_toDate").css(tu)
            $("#outBoundBusinessType").css(tu)
            $("#pin").css(tu)
            $("#parentOrderIds").css(tu)
            $("#paymentType").css(tu)
            $("#outboundVendorStoreId").css("width","100%")


            $("#outboundOrderIds").css(tu)
            $("#skuList").css(tu)
            $("#parentOrderIds").css(tu)
            $("#pbutton").css(tu)
             $("#outboundVendorStoreId").css(tu)


            $(".form-tb th").css("‘margin’","0px")
            $(".ui-jqgrid-bdiv").css("width","auto")
            $("#outboundGrid").css("width","auto")
            $(".footer_20170831").css("display","none")
            $(".module01").css("border","0px")
           // $("#remarkWin").css(bd)
//             ---------------------------------------------------------------------------------------
            $(".pui-button").hover(function(){
                $(this).css(hov)
            },function(){
                $(this).css(btn)

            })

//             $("#gview_outboundGrid").css("border-left","1px solid #ccc")
//             $(".ui-widget-content").css("border","0px solid #ccc")
//                $(".ui-jqgrid-hdiv").css("background","none")
//             $("#outboundGrid_undefined").css("background-image","linear-gradient(to top, #37ecba 0%, #72afd3 100%)")
//             $("#outboundGrid_undefined").css("background-image","linear-gradient(to top, #37ecba 0%, #72afd3 100%)")
           $(".ui-jqgrid-bdiv").eq(0).css("height","500px")
//               $(".ui-jqgrid-bdiv").eq(0).css(bd) 订单背景
//             $(".ui-pg-selbox").eq(0).children().eq(3).prop("selected", 'selected');
//              $(".ui-pg-selbox").eq(0).children().eq(3).click()

        }
//         $("#zsxz").click(function(){
//             $("#addRemark").eq(0).attr("maxlength","-1");
//             $("#addRemark").eq(0).attr("placeholder","输入多少个字都可以");
//           })


        $("#add_name").click(function(){
            var user='1'
            var remark=   $('#addRemark').val()
            var _id= $("#tr_1").text()
            $.get("https://pdropship.jd.com/outBound/outboundList?orderIdList=&orderId="+_id,function(data){
                user=data.rows[0].customerName
                let pinming=data.rows[0].orderDetailList[0].wareName.indexOf("桌垫") //如果大于0 就是桌垫

                if(pinming>=0){
                    if( $('#addRemark').val().indexOf("桌垫可定制:")>0){

                      let bz= $('#addRemark').val()

                      let shan_zd=  bz.replace("桌垫可定制:",'').replace(kefu,'').replace(user,'').replace(',','');
                         $('#addRemark').val(shan_zd)
                    }else{
                      $('#addRemark').val(user+',桌垫可定制:'+remark+' '+kefu)
                    }

                }else{
                     if( $('#addRemark').val().indexOf("可定制:")>0){
                      let bz= $('#addRemark').val()
                      let shan_zd=  bz.replace("可定制:",'').replace(kefu,'').replace(user,'').replace(',','');
                         $('#addRemark').val(shan_zd)
                    }else{
                      $('#addRemark').val(user+',可定制:'+remark+' '+kefu)
                    }
                }
                console.log(user)
            })
        })
        }

    // Your code here...














})();