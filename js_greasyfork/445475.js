// ==UserScript==
// @name         indiegogo
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  download indiegogo infos
// @author       lasercarl
// @license      MIT
// @match        https://www.indiegogo.com/*
// @icon         https://g0.iggcdn.com/assets/favicon/apple-touch-icon-120x120-precomposed-18f2eddce61673a687f024a5fb4853959f91bf2df2fb91bfd3cc81e3a717038a.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445475/indiegogo.user.js
// @updateURL https://update.greasyfork.org/scripts/445475/indiegogo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer = window.setInterval(func, 2000);//设置2秒定时器
    var i = 0;
    var j = 0;
    function func() {
        let e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        document.getElementsByClassName('i-cta-1 ng-isolate-scope')[0].dispatchEvent(e);
        i++;
        if (i == 6) {//此处更改点击“show more”的次数
            window.clearInterval(timer);

            let nwin = window.open(''); //新开空白标签页
            nwin.document.write("<div>");
            nwin.document.write("<table id='tableExcel' width='50%' border='1' cellspacing='0' cellpadding='0'>");
            nwin.document.write("<tr><td>图片</td><td>题目</td><td>描述</td><td>分类</td><td>￥</td><td>百分比</td><td>额</td><td>额</td></tr>");
            for(var j = 0; j < (i*12-1);j++){
                //console.log(j+document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[1].getAttribute('data-bgset'));//测试

                var image = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[1].getAttribute('data-bgset');//IMAGE
                nwin.document.write("<tr>"); //将内容写入新标签页

                nwin.document.write("<td>"); //将内容写入新标签页
                nwin.document.write("<img src=");
                nwin.document.write(image); //将内容写入新标签页
                nwin.document.write(">");
                nwin.document.write("</td>");

                var title = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[5].innerText;//TITLE
                nwin.document.write("<td>"); //将内容写入新标签页
                nwin.document.write(title); //将内容写入新标签页
                nwin.document.write("</td>");

                var description = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[7].innerText;
                nwin.document.write("<td>"); //将内容写入新标签页
                nwin.document.write(description); //将内容写入新标签页
                nwin.document.write("</td>");

                var type = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[9].innerText;
                nwin.document.write("<td>"); //将内容写入新标签页
                nwin.document.write(type); //将内容写入新标签页
                nwin.document.write("</td>");


                if(document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[18].innerText == 'Sign up for 50% OFF SUPER-EARLY-BIRD discount！'){
                    var discount = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[18].innerText;//SIGN UP FOR 50% DISCOUNT
                    nwin.document.write("<td>"); //将内容写入新标签页
                    nwin.document.write(discount); //将内容写入新标签页
                    nwin.document.write("</td>");

                }else if(document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[20].innerText == 'Sign up now to grab the 36% discount.'){
                    var count_36 = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[20].innerText;//Sign up now to grab the 36% discount.
                    nwin.document.write("<td>"); //将内容写入新标签页
                    nwin.document.write(count_36); //将内容写入新标签页
                    nwin.document.write("</td>");
                }else if(document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[12].childNodes[1].childNodes[2].innerText){
                    var money = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[12].childNodes[1].childNodes[2].innerText;//MONEY
                    nwin.document.write("<td>"); //将内容写入新标签页
                    nwin.document.write(money); //将内容写入新标签页
                    nwin.document.write("</td>");
                    var percent = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[12].childNodes[1].childNodes[13].innerText;//PERCENT
                    nwin.document.write("<td>"); //将内容写入新标签页
                    nwin.document.write(percent); //将内容写入新标签页
                    nwin.document.write("</td>");
                }

                if(document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[18].innerText){
                    var now_founding = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[18].innerText;//NOW FOUNDING THROW
                    nwin.document.write("<td>"); //将内容写入新标签页
                    nwin.document.write(now_founding); //将内容写入新标签页
                    nwin.document.write("</td>");
                }

                if(document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[22].innerText == 'Launching Soon'){
                    var launching = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[22].innerText;//LAUNCHING SOON
                    nwin.document.write("<td>"); //将内容写入新标签页
                    nwin.document.write(launching); //将内容写入新标签页
                    nwin.document.write("</td>");
                }
                if(document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[16].innerText){
                    var ended = document.getElementsByClassName('discoverableCard')[j].childNodes[1].childNodes[3].childNodes[16].innerText;
                    nwin.document.write("<td>"); //将内容写入新标签页
                    nwin.document.write(ended); //将内容写入新标签页
                    nwin.document.write("</td>");
                }

                nwin.document.write("</tr>"); //将内容写入新标签页
            }
            nwin.document.write("</table>");
            nwin.document.write("</div>");
        }
    }

})();