// ==UserScript==
// @name         vc精简版自动加收货人名2

// @namespace    http://tampermonkey.net/
// @version      9.3
// @description  try to take over the world!
// @author       qq806350554
// @match        https://pdropship.jd.com/orderManage/initListPage

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426609/vc%E7%B2%BE%E7%AE%80%E7%89%88%E8%87%AA%E5%8A%A8%E5%8A%A0%E6%94%B6%E8%B4%A7%E4%BA%BA%E5%90%8D2.user.js
// @updateURL https://update.greasyfork.org/scripts/426609/vc%E7%B2%BE%E7%AE%80%E7%89%88%E8%87%AA%E5%8A%A8%E5%8A%A0%E6%94%B6%E8%B4%A7%E4%BA%BA%E5%90%8D2.meta.js
// ==/UserScript==

(function() {

    'use strict';
var anniu=`<button type="button"style="float: right;"  id="add_name"class="pui-button ui-widget ui-state-default ui-corner-all pui-button-text-icon-left" role="button" aria-disabled="false">
<span class="pui-button-icon-left ui-icon ui-icon-key"></span>
<span class="pui-button-text">添加收货人</span>
</button>`
var tijiao=`<button type="button"  id="tijiao" class="pui-button ui-widget ui-state-default ui-corner-all pui-button-text-icon-left" role="button" aria-disabled="false">
<span class="pui-button-icon-left ui-icon ui-icon-key"></span>
<span class="pui-button-text">提交</span>
</button>`
var kefu=''
var kecolor=''
$(".pageHeader-banner-box").click(function(){  //清除localStorage
    localStorage.clear();
    alert("清除成功")
})
    if( typeof(localStorage[ 'kefuname' ])=="undefined"||localStorage[ 'kecolor' ]=="null"){
     kefu= prompt("请输入你名字的简称","聪")
        localStorage[ 'kefuname' ]=kefu
    }else{
     kefu=localStorage[ 'kefuname' ]
    }

    if( typeof(localStorage[ 'kecolor' ])=="undefined"||localStorage[ 'kecolor' ]=="null"){
     kecolor= prompt(`http://tool.chinaz.com/tools/use     复制前面的网址在里面选择自己喜欢的颜色代码粘贴到下面的输入框里别忘了加#，格式如下`,"#000000")
        localStorage[ 'kecolor' ]=kecolor
    }else{
     kecolor=localStorage[ 'kecolor' ]
    }

    var timer3 = "";
    var ccc=''



 timer3=setInterval(func1,1000)




      function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
      return;
    }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".my-face{animation:my-face 5s infinite ease-in-out;display:inline-block;margin:0 5px}@-webkit-keyframes my-face{2%,24%,80%{-webkit-transform:translate(0,1.5px) rotate(1.5deg);transform:translate(0,1.5px) rotate(1.5deg)}4%,68%,98%{-webkit-transform:translate(0,-1.5px) rotate(-.5deg);transform:translate(0,-1.5px) rotate(-.5deg)}38%,6%{-webkit-transform:translate(0,1.5px) rotate(-1.5deg);transform:translate(0,1.5px) rotate(-1.5deg)}8%,86%{-webkit-transform:translate(0,-1.5px) rotate(-1.5deg);transform:translate(0,-1.5px) rotate(-1.5deg)}10%,72%{-webkit-transform:translate(0,2.5px) rotate(1.5deg);transform:translate(0,2.5px) rotate(1.5deg)}12%,64%,78%,96%{-webkit-transform:translate(0,-.5px) rotate(1.5deg);transform:translate(0,-.5px) rotate(1.5deg)}14%,54%{-webkit-transform:translate(0,-1.5px) rotate(1.5deg);transform:translate(0,-1.5px) rotate(1.5deg)}16%{-webkit-transform:translate(0,-.5px) rotate(-1.5deg);transform:translate(0,-.5px) rotate(-1.5deg)}18%,22%{-webkit-transform:translate(0,.5px) rotate(-1.5deg);transform:translate(0,.5px) rotate(-1.5deg)}20%,36%,46%{-webkit-transform:translate(0,-1.5px) rotate(2.5deg);transform:translate(0,-1.5px) rotate(2.5deg)}26%,50%{-webkit-transform:translate(0,.5px) rotate(.5deg);transform:translate(0,.5px) rotate(.5deg)}28%{-webkit-transform:translate(0,.5px) rotate(1.5deg);transform:translate(0,.5px) rotate(1.5deg)}30%,40%,62%,76%,88%{-webkit-transform:translate(0,-.5px) rotate(2.5deg);transform:translate(0,-.5px) rotate(2.5deg)}32%,34%,66%{-webkit-transform:translate(0,1.5px) rotate(-.5deg);transform:translate(0,1.5px) rotate(-.5deg)}42%{-webkit-transform:translate(0,2.5px) rotate(-1.5deg);transform:translate(0,2.5px) rotate(-1.5deg)}44%,70%{-webkit-transform:translate(0,1.5px) rotate(.5deg);transform:translate(0,1.5px) rotate(.5deg)}48%,74%,82%{-webkit-transform:translate(0,-.5px) rotate(.5deg);transform:translate(0,-.5px) rotate(.5deg)}52%,56%,60%{-webkit-transform:translate(0,2.5px) rotate(2.5deg);transform:translate(0,2.5px) rotate(2.5deg)}58%{-webkit-transform:translate(0,.5px) rotate(2.5deg);transform:translate(0,.5px) rotate(2.5deg)}84%{-webkit-transform:translate(0,1.5px) rotate(2.5deg);transform:translate(0,1.5px) rotate(2.5deg)}90%{-webkit-transform:translate(0,2.5px) rotate(-.5deg);transform:translate(0,2.5px) rotate(-.5deg)}92%{-webkit-transform:translate(0,.5px) rotate(-.5deg);transform:translate(0,.5px) rotate(-.5deg)}94%{-webkit-transform:translate(0,2.5px) rotate(.5deg);transform:translate(0,2.5px) rotate(.5deg)}0%,100%{-webkit-transform:translate(0,0) rotate(0);transform:translate(0,0) rotate(0)}}@keyframes my-face{2%,24%,80%{-webkit-transform:translate(0,1.5px) rotate(1.5deg);transform:translate(0,1.5px) rotate(1.5deg)}4%,68%,98%{-webkit-transform:translate(0,-1.5px) rotate(-.5deg);transform:translate(0,-1.5px) rotate(-.5deg)}38%,6%{-webkit-transform:translate(0,1.5px) rotate(-1.5deg);transform:translate(0,1.5px) rotate(-1.5deg)}8%,86%{-webkit-transform:translate(0,-1.5px) rotate(-1.5deg);transform:translate(0,-1.5px) rotate(-1.5deg)}10%,72%{-webkit-transform:translate(0,2.5px) rotate(1.5deg);transform:translate(0,2.5px) rotate(1.5deg)}12%,64%,78%,96%{-webkit-transform:translate(0,-.5px) rotate(1.5deg);transform:translate(0,-.5px) rotate(1.5deg)}14%,54%{-webkit-transform:translate(0,-1.5px) rotate(1.5deg);transform:translate(0,-1.5px) rotate(1.5deg)}16%{-webkit-transform:translate(0,-.5px) rotate(-1.5deg);transform:translate(0,-.5px) rotate(-1.5deg)}18%,22%{-webkit-transform:translate(0,.5px) rotate(-1.5deg);transform:translate(0,.5px) rotate(-1.5deg)}20%,36%,46%{-webkit-transform:translate(0,-1.5px) rotate(2.5deg);transform:translate(0,-1.5px) rotate(2.5deg)}26%,50%{-webkit-transform:translate(0,.5px) rotate(.5deg);transform:translate(0,.5px) rotate(.5deg)}28%{-webkit-transform:translate(0,.5px) rotate(1.5deg);transform:translate(0,.5px) rotate(1.5deg)}30%,40%,62%,76%,88%{-webkit-transform:translate(0,-.5px) rotate(2.5deg);transform:translate(0,-.5px) rotate(2.5deg)}32%,34%,66%{-webkit-transform:translate(0,1.5px) rotate(-.5deg);transform:translate(0,1.5px) rotate(-.5deg)}42%{-webkit-transform:translate(0,2.5px) rotate(-1.5deg);transform:translate(0,2.5px) rotate(-1.5deg)}44%,70%{-webkit-transform:translate(0,1.5px) rotate(.5deg);transform:translate(0,1.5px) rotate(.5deg)}48%,74%,82%{-webkit-transform:translate(0,-.5px) rotate(.5deg);transform:translate(0,-.5px) rotate(.5deg)}52%,56%,60%{-webkit-transform:translate(0,2.5px) rotate(2.5deg);transform:translate(0,2.5px) rotate(2.5deg)}58%{-webkit-transform:translate(0,.5px) rotate(2.5deg);transform:translate(0,.5px) rotate(2.5deg)}84%{-webkit-transform:translate(0,1.5px) rotate(2.5deg);transform:translate(0,1.5px) rotate(2.5deg)}90%{-webkit-transform:translate(0,2.5px) rotate(-.5deg);transform:translate(0,2.5px) rotate(-.5deg)}92%{-webkit-transform:translate(0,.5px) rotate(-.5deg);transform:translate(0,.5px) rotate(-.5deg)}94%{-webkit-transform:translate(0,2.5px) rotate(.5deg);transform:translate(0,2.5px) rotate(.5deg)}0%,100%{-webkit-transform:translate(0,0) rotate(0);transform:translate(0,0) rotate(0)}}";
  styleInject(css_248z);







    function func1() {
        if( $(".pui-dialog-buttonpane").length>7){
            clearInterval(timer3)
            console.log("找到了了")
            $(".pui-dialog-buttonpane").eq(5).append(anniu)
            $(".pui-dialog-buttonpane").eq(5).prepend(tijiao)
            $(".pui-button-text-icon-left").eq(9).hide()//隐藏提交按钮
            $("#addRemark").eq(0).attr("maxlength","500");
            $("#addRemark").eq(0).attr("placeholder","最多能输入500个字");

        }

        $("#tijiao").click(function(){
            $.post("https://pdropship.jd.com/outBound/remarkByVendor",{
                orderId:$("#hiddenOrderId").val(),
                vendorRemark:$("#addRemark").val().substring(0,$("#addRemark").val().lastIndexOf($("#addRemark").val().charAt($("#addRemark").val().length - 1)))+'<font color='+kecolor+'>'+$("#addRemark").val().charAt($("#addRemark").val().length - 1)
            })
            console.log($("#addRemark").val().substring(0,$("#addRemark").val().lastIndexOf($("#addRemark").val().charAt($("#addRemark").val().length - 1)))+'<font color='+kecolor+'>'+$("#addRemark").val().charAt($("#addRemark").val().length - 1))
             $("#" + $("#hiddenOrderId").val() + "_vendorRemark").html($("#addRemark").val().substring(0,$("#addRemark").val().lastIndexOf($("#addRemark").val().charAt($("#addRemark").val().length - 1)))+'<font color='+kecolor+'>'+$("#addRemark").val().charAt($("#addRemark").val().length - 1));
            $("#remarkWin .pui-dialog-titlebar-close").click()
        })

        $("#add_name").click(function(){
            var user='1'
            var remark=   $('#addRemark').val()
            var _id= $("#tr_1").text()
            $.get("https://pdropship.jd.com/outBound/outboundList?orderIdList=&orderId="+_id,function(data){
               var _url=data.rows[0].orderDetailList[0].imagePath
                user=data.rows[0].customerName
               // if(_url.indexOf("a6331ac8da17f4fc") >= 0||_url.indexOf("2b356ce939ce81e4") >= 0 )
              //  let pinming=data.rows[0].orderDetailList[0].wareName.indexOf("桌垫") //如果大于0 就是桌垫

                if(_url.indexOf("a6331ac8da17f4fc") >= 0||_url.indexOf("2b356ce939ce81e4") >= 0 ){
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