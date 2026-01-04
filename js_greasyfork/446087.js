// ==UserScript==
// @name         财税教学自动填写凭证
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击
// @author       You
// @match        http://edu.hxkjgzs.com/tally/*
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446087/%E8%B4%A2%E7%A8%8E%E6%95%99%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%87%AD%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/446087/%E8%B4%A2%E7%A8%8E%E6%95%99%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%87%AD%E8%AF%81.meta.js
// ==/UserScript==

      this.$ = this.jQuery =jQuery.noConflict(true);
         let btn = document.createElement("button");
        btn.innerText="开始";
        btn.style.backgroundColor = 'red'
        btn.style.width = '80px'
        btn.style.height = '40px'
        document.body.appendChild(btn);

        let btn2 = document.createElement("button");
        btn2.innerText="结束";
        btn2.style.backgroundColor = 'pink'
        btn2.style.width = '80px'
        btn2.style.height = '40px'
        document.body.appendChild(btn2);

        var timer1 = null;
        var timer2 = null;

       btn.onclick =function(){
                $(btn).hide();
                $(btn2).show();
                timer1 =  setInterval( function(){
                var iframe = document.getElementsByTagName('iframe')[0].contentWindow
                iframe.document.querySelector("#openB").click()
                }, 200);
                timer2 = setInterval( function(){
                var iframe = document.getElementsByTagName('iframe')[0].contentWindow
                iframe.document.querySelector("#saveAndCreateBtn").click()
                }, 200);
        }

        btn2.onclick =function(){
                $(btn2).hide();
                $(btn).show();
                clearInterval(timer1);
                clearInterval(timer2);
        }

        $(document).ready(function(){

            $(btn).offset({
                top:700,
                left:1450
            })
            $(btn2).offset({
                top:700,
                left:1550
            })

       });
