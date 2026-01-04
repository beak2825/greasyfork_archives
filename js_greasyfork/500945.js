// ==UserScript==
// @name         kaizhi
// @namespace    com.oldtan.onekey
// @version      1.1.7
// @description  kaizhi0
// @author       oldtan
// @include       https://www.okooo.com/soccer/match/*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/500945/kaizhi.user.js
// @updateURL https://update.greasyfork.org/scripts/500945/kaizhi.meta.js
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
    //$('.el-card__body:eq(1) div:eq(1)').append('<button type="button" id="onekey" style="margin-left:1.25rem" class="el-button el-button--primary  el-button--small"><!----><!----><span>一&nbsp;键&nbsp;托&nbsp;管&nbsp;</span></button>');
    //var remain_count_node=$('.ml25:contains(剩余) .red');
    //var get_next_btn=$('button:contains(获取下一条)');
    //get_next_btn.click();
    //var audit_pass_btn=$('button:contains("审"):eq(1)');
    $('.matchboxbg').click(function(){
        var aodds_count=0
        var bodds_count=0
        var codds_count=0
        var arodds_count=0
        var brodds_count=0
        var crodds_count=0
        var i=0
        var arr_a=[]
        var arr_b=[]
        var arr_c=[]
        var avgrodds=parseFloat($('#avgObj').children().eq(15).text())
        $('#data_main_content [data-time]').each(function(index, element) {
            // 'this'指向当前的DOM元素
            var aodds=parseFloat($(this).children().eq(12).text())
            var bodds=parseFloat($(this).children().eq(13).text())
            var codds=parseFloat($(this).children().eq(14).text())
            var odds=parseFloat($(this).children().eq(15).text())
            // console.log(aodds+','+bodds+','+codds+','+odds)

            // if (aodds>odds && aodds-odds>=0.02){
            //     aodds_count+=1
            // }
            // if (bodds>odds && bodds-odds>=0.02){
            //     bodds_count+=1
            // }
            // if (codds>odds && codds-odds>=0.02){
            //     codds_count+=1
            // }

            if (aodds>avgrodds){
                arodds_count+=1
            }
            if (bodds>avgrodds){
                brodds_count+=1
            }
            if (codds>avgrodds){
                crodds_count+=1
            }

            // if (aodds<=odds){
            //     aodds_count+=1
            // }
            // if (bodds<=odds){
            //     bodds_count+=1
            // }
            // if (codds<=odds){
            //     codds_count+=1
            // }

            aodds_count+=aodds
            bodds_count+=bodds
            codds_count+=codds
            arr_a.push(aodds)
            arr_b.push(bodds)
            arr_c.push(codds)
            i+=1

        });
        // console.log(aodds_count+' '+bodds_count+' '+codds_count)
        // Toast(i+' '+(aodds_count/i).toFixed(2)+' '+(bodds_count/i).toFixed(2)+' '+(codds_count/i).toFixed(2))//最多只能精确到第二位小数,第三位起不到作用

        arr_a.sort(function(a, b) {
            return b - a;
        });
        arr_b.sort(function(a, b) {
            return b - a;
        });
        arr_c.sort(function(a, b) {
            return b - a;
        });



        var arr_aslice=arr_a.slice(0,3)
        arr_aslice.push(...arr_a.slice(-3,))
        // alert(arr_aslice)
        var arr_bslice=arr_b.slice(0,3)
        arr_bslice.push(...arr_b.slice(-3,))
        var arr_cslice=arr_c.slice(0,3)
        arr_cslice.push(...arr_c.slice(-3,))
        // var avgaodds=getAverage(arr_aslice).toString().slice(0, 5)
        // var avgbodds=getAverage(arr_bslice).toString().slice(0, 5)
        // var avgcodds=getAverage(arr_cslice).toString().slice(0, 5)

        var maxaodds=parseFloat($('#maxObj').children().eq(12).text())
        var maxbodds=parseFloat($('#maxObj').children().eq(13).text())
        var maxcodds=parseFloat($('#maxObj').children().eq(14).text())

        var minaodds=parseFloat($('#minObj').children().eq(12).text())
        var minbodds=parseFloat($('#minObj').children().eq(13).text())
        var mincodds=parseFloat($('#minObj').children().eq(14).text())
        // alert(' '+maxaodds+' '+maxbodds+' '+maxcodds)
        // alert(' '+minaodds+' '+minbodds+' '+mincodds)

        var avgaodds=((maxaodds+minaodds)/2).toString().slice(0, 5)
        var avgbodds=((maxbodds+minbodds)/2).toString().slice(0, 5)
        var avgcodds=((maxcodds+mincodds)/2).toString().slice(0, 5)//最多可精确到第三位小数
        // Toast2(i+' '+avgaodds+' '+avgbodds+' '+avgcodds)
        alert(i+'高于平均返回率   '+arodds_count+' '+brodds_count+' '+crodds_count+'\n'+i+'\
到第二位   '+(aodds_count/i).toString().slice(0, 4)+' '+(bodds_count/i).toString().slice(0, 4)+' '+(codds_count/i).toString().slice(0, 4)+'\n'+i+'\
max,min到第三位   '+avgaodds+' '+avgbodds+' '+avgcodds)
    })

});



function Toast(msg,duration){
      duration=isNaN(duration)?3000:duration;
      var m = document.createElement('div');
      m.innerHTML = msg;
      m.style.cssText="max-width:60%;min-width: 150px;padding:0 14px;height: 60px;color: rgb(255, 255, 255);line-height: 60px;text-align: center;border-radius: 4px;position: fixed;top: 40%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: 16px;";
      document.body.appendChild(m);
      setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);
      }, duration);
    }


function Toast2(msg,duration){
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

function getAverage(arr) {
    if (arr.length === 0) return 0; // 如果数组为空，返回0
    const sum = arr.reduce((acc, current) => acc + current, 0); // 累加数组元素
    return sum / arr.length; // 计算平均数
}

