// ==UserScript==
// @name         一键托管
// @namespace    com.oldtan.onekey
// @version      1.1.5
// @description  sku审核一键托管
// @author       oldtan
// @include        http://tool-sku*.lingmou*ai*/sku/audit*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
//常用函数
// @require https://greasyfork.org/scripts/432606-%E5%B8%B8%E7%94%A8%E5%87%BD%E6%95%B0/code/%E5%B8%B8%E7%94%A8%E5%87%BD%E6%95%B0.js?version=971737
// @downloadURL https://update.greasyfork.org/scripts/432558/%E4%B8%80%E9%94%AE%E6%89%98%E7%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/432558/%E4%B8%80%E9%94%AE%E6%89%98%E7%AE%A1.meta.js
// ==/UserScript==
// function sleep(time){
//     var timeStamp = new Date().getTime();
//     var endTime = timeStamp + time;
//     while(true){
//         if (new Date().getTime() > endTime){
//             return;
//         }
//     }
// }

$(document).ready(function(){
    //var t=$('.el-button.el-button--primary.el-button--small').css({"background-color":"yellow"});
    // $('input:first').css({"background-color":"yellow"});
    // $('.is-link').css({"color":"yellow"});
    //alert($('.el-breadcrumb__inner.is-link').text());

    //添加一键托管按钮
    $('.el-card__body:eq(1) div:eq(1)').append('<button type="button" id="onekey" style="margin-left:1.25rem" class="el-button el-button--primary  el-button--small"><!----><!----><span>一&nbsp;键&nbsp;托&nbsp;管&nbsp;</span></button>');
    var remain_count_node=$('.ml25:contains(剩余) .red');
    var get_next_btn=$('button:contains(获取下一条)');
    get_next_btn.click();
    var audit_pass_btn=$('button:contains("审"):eq(1)');

    $('#onekey').click(function(){
        Toast('小样我就知道你要偷懒,来吧展示!');
        //audit_pass_btn.removeAttr("disabled");
        console.log('remain_count:'+remain_count_node.text());
        var tm=setInterval(function(){
            get_next_btn.click();
            audit_pass_btn.click();
            if(remain_count_node.text()<1){
                clearInterval(tm);
            }
        },600);
    });
});

function Toast(msg,duration){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 60px;color: rgb(255, 255, 255);line-height: 60px;text-align: center;border-radius: 4px;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }
// (function(){
// })();






