// ==UserScript==
// @name         ZUAOJ快速判题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ZUAoj快速判题，不需要再点进去交题，更加快速方便
// @author       磊落不凡
// @match        http://acm.heyuantao.cn/problem.php?cid=*
// @icon         http://acm.heyuantao.cn/favicon.ico
// @require		https://cdn.bootcss.com/jquery/1.11.0/jquery.min.js
// @license MIT
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/437751/ZUAOJ%E5%BF%AB%E9%80%9F%E5%88%A4%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/437751/ZUAOJ%E5%BF%AB%E9%80%9F%E5%88%A4%E9%A2%98.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $(document).ready(function(){
        GM_addStyle(`
              .llbf_btn{
                     margin: 10px 10px 2px 0;
                     padding: 5px 10px;
                     border: 0px solid transparent;
                     outline: none;
                     background: #3498db;
                     color: #fff;
                     border-radius: 3px;
                     transition: .3s;
              }
              .llbf_btn:hover{
                     background: #217dba;
              }
              .llbf_spans_bkg {
                      display: inline;
                      //background: antiquewhite;
               }
               .llbf_spans_bkg>span {
                      padding: 5px 8px;
                      background: #64b1e3;
                      border-radius: 15px;
                      color: #fff;
                      transition: .3s;
               }
               .llbf_spans_bkg>span:hover{
                      background: #9eceee;
               }
        `)
        let textarea = $( "<textarea cols='25' rows='5' style='width:100%;height:400px'></textarea>" )
        let submit = $( "<button class='llbf_btn'>提交</button>" )
        let quit = $( "<button class='llbf_btn'>退出本题</button>" )
        let submitUrl = $( "center>a" )[0].href
        let iframe = $( `<iframe style='width:100%;height:300px;opacity: 0;position:fixed;' src=\"${submitUrl}\"></iframe>`)
        let iframeWindow;
        let result;
        $(".jumbotron").append( quit )
        $(".jumbotron").append( submit )
        showResult()
        $(".jumbotron").append( textarea )
        $(".jumbotron").append(  iframe )

        function codeRefresh(){
            iframeWindow = window.frames[0].frames[0]
            iframeWindow.document.getElementById("textarea").value = textarea.val()
        }
        textarea.bind('input propertychange',function(){
            //console.log(textarea.val());
            codeRefresh()
            //console.log($(iframeWindow.document.getElementById("textarea")))
        });
        setInterval(()=>{
            let url = window.frames[0].location.href
            let user_id = getuser_id()
            let cid = getcid()

            if(result&&url == `http://acm.heyuantao.cn/status.php?user_id=${user_id}&cid=${cid}`){
                let tr = window.frames[0].document.querySelectorAll("#result-tab tr")[1]
                if(tr){
                    let td = tr.querySelectorAll("td")
                    let spans = $(".show_result span")
                    for(let j=0;j<spans.length;j++){
                        spans[j].innerText = td[j].innerText
                    }
                }
            }
        },200)
        submit.bind("click",function(){
            codeRefresh()

            window.frames[0].document.getElementById("Submit").click()
            submit.hide()
            result.show()
            //http://acm.heyuantao.cn/status.php?user_id=2007210922&cid=1059
            //
            //
            console.log()
        })
        quit.bind("click",function(){
            window.location.replace(`contest.php?cid=${getcid()}`);
        })
        function showResult(){
            //349369 2007210922 X 正确 1792 0 C++/Edit 1440 B 2021-12-29 17:52:18 172.16.3.18
            result =$(`
               <div class="show_result" style="display: inline-block;">
                 <div class="llbf_spans_bkg">
                    <span class="bianhao"></span>
                    <span class="xuehao"></span>
                    <span class="wenti"></span>
                    <span class="wenti" style="color:red"></span>
                    <span class="wenti"></span>
                    <span class="wenti"></span>
                    <span class="wenti"></span>
                    <span class="wenti"></span>
                    <span class="time"></span>
                    <span class="jieguo" style=""></span>
                 </div>
                    <button class="close_result llbf_btn">关闭结果</button>
               </div> `)
            $(".jumbotron").append( result )
            $(".close_result").bind("click",()=>{
                result.hide()
                submit.show()
                let spans = $(".show_result span")
                for(let j=0;j<spans.length;j++){
                    spans[j].innerText = ""
                }
                window.frames[0].location.replace(submitUrl);
            })
            result.hide()
        }
        function getcid(){
            return document.body.innerHTML.match(/status\.php\?cid=([0-9]*)/)[1]
        }

        function getuser_id(){
            return document.body.innerHTML.match(/<span id="profile">([0-9]*)<\/span>/)[1]
        }
    })
    // Your code here...
})();