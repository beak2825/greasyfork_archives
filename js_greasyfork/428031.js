// ==UserScript==
// @name         抢课脚本yyds
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        http://jwxk.ucas.ac.cn/courseManage/main*
// @match        http://jwxk.ucas.ac.cn/courseManage/selectCourse*

// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428031/%E6%8A%A2%E8%AF%BE%E8%84%9A%E6%9C%ACyyds.user.js
// @updateURL https://update.greasyfork.org/scripts/428031/%E6%8A%A2%E8%AF%BE%E8%84%9A%E6%9C%ACyyds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var institude = ['数学学院','心理学系','网络空间安全学院','物理科学学院','人文学院'];    //填写学院，要按照“选择课程”的页面学院名称来填写
    var classes=['070103M07001H','0839X4M07002H','070200MGX001H-2','040203M07001H',]; //要选的课程代码，每个字符串用引号包裹，字符串之间用逗号分隔

    if(window.location.href.match("http://jwxk.ucas.ac.cn/courseManage/main*")) //选择学院
    {

        let form2 = document.getElementById('regfrm2');
        let institudes = form2.getElementsByClassName('span2');
        for(let i=0;i<institudes.length;i++){
            let text = institudes[i].getElementsByTagName("label")[0].innerText;
            if(institude.includes(text)){
                let check=institudes[i].getElementsByTagName("input")[0];
                if(!check.disabled) check.checked=true;
            }
        };
        $("#regfrm2").submit();
    }


    if(window.location.href.match("http://jwxk.ucas.ac.cn/courseManage/selectCourse*"))
    {
        let choice=document.getElementsByTagName("tr");

        let open = false;
        for(let i=0;i<choice.length;i++){
            let box=choice[i].getElementsByTagName("td")[0];
            if(!box) continue;
            let classId=choice[i].getElementsByTagName("span")[0].innerText;
            if(classes.includes(classId)){
                let check=box.getElementsByTagName("input")[0];
                if(!check.disabled) {
                    check.checked=true;
                    open = true;
                }
            }
        };
        if(open == false){
            window.location.reload();
        }
        let button=document.getElementsByClassName("btn btn-primary")[0];
        button.click();
    }

})();