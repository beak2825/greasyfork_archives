// ==UserScript==
// @name         ConfluenceAutoTools4HAT-other
// @namespace    http://www.akuvox.com/
// @version      1.0
// @description  take on the world!
// @author       andy.wang
// @match        http://know.xm.akubela.local/pages*
// @match        http://know.fz.akubela.local/pages*
// @match        http://192.168.13.7/pages*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/482712/ConfluenceAutoTools4HAT-other.user.js
// @updateURL https://update.greasyfork.org/scripts/482712/ConfluenceAutoTools4HAT-other.meta.js
// ==/UserScript==

function bug_deal() {
    'use strict'
    setTimeout(()=>{
        const title = document.getElementById('title-text').querySelector('a')
        console.log(title.innerHTML)
        if (title.innerHTML.includes('bug')) {
            let trDomList = []
            const bigboxList = document.getElementsByClassName('table-wrap')
            bigboxList.forEach((item) => {
                trDomList = [...trDomList,...(item.getElementsByTagName('tbody')[0].getElementsByTagName('tr')||[])]
            })
            trDomList.forEach((item) => {
                let child = item.firstElementChild
                child.style.color = '#50c3fa'
                child.onclick = function (el) {
                    window.open(`http://192.168.10.17/zentao/bug-view-${child.innerHTML}.html`)
                }
            })
        }
    },2000)
}



(function() {
    //主函数开始
    //创建button

    console.log("ConfluenceAutoTools4HAT")
    console.log('window: %o', window);

    function timer_refresh(){
        console.log("timer_refresh")
        window.location.replace(window.location.href);
    }

    //自己的方法
    function autoCloseNotice(){
        var obj_conf = document.getElementById("com-atlassian-confluence");
        if(!obj_conf)
        {
            return;
        }

        var obj = document.getElementById("aui-flag-container");
        if(!obj)
        {
            return;
        }
        console.log(obj)
        obj.remove();
    }



    function myinit(){

        var user = document.getElementsByTagName('meta')['ajs-remote-user'].getAttribute('content')
        console.log("user:" +user)
        addBtn(user)

        ///////////////////////// 以下是通用功能 /////////////////////////////////
        //setTimeout(timer_refresh, 10*600)
        autoCloseNotice();

        var title = document.title;
        console.log("document.title:%s", title)
        if((title.indexOf('未修复bug(禅道实时)') >= 0) || (title.indexOf('历史概率bug(禅道实时)') >= 0) || (title.indexOf('智能家居终端bug') >= 0))
        {
            setTimeout(()=>{
                bug_deal();
            }, 1350)
        }
    }

    if (navigator.userAgent.indexOf('Firefox') >= 0) {
        //firefox 不支持 window.onload 直接调用函数
        console.log("ConfluenceAutoTools4HAT2")
        myinit();
    } else {
        console.log("ConfluenceAutoTools4HAT3")
        window.onload = myinit();

    }
})();




