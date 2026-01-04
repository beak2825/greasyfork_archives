// ==UserScript==
// @name         来！抢讲座！！！
// @namespace    嘘~芜~的第二个油猴脚本
// @version      0.12
// @description  给她拿来抢票的
// @author       嘘~芜~
// @match        http://192.168.2.185/pyxx/Default.aspx
// @match        http://192.168.2.185:80/pyxx/txhdgl/hdlist.aspx?xh=202021000568
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/418949/%E6%9D%A5%EF%BC%81%E6%8A%A2%E8%AE%B2%E5%BA%A7%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/418949/%E6%9D%A5%EF%BC%81%E6%8A%A2%E8%AE%B2%E5%BA%A7%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Come on! Baby!
    /*******函数声明-开始**/
    //自动跳转到抢讲座的页面
    function clickFirst() {
        setTimeout(function () {
            switch (window.location.href) {
                case "http://192.168.2.185/pyxx/txhdgl/hdlist.aspx?xh=202021000568":
                    setInterval(() => {
                        toSignUp()
                    }, 1000);
                    break;
                case "":
                    break;
                default:
                    window.location.href = "http://192.168.2.185:80/pyxx/txhdgl/hdlist.aspx?xh=202021000568";
                    break;
            }
        }, 1000)
    }
    //进入报名页面
    function toSignUp() {
        try {
            theForm.__EVENTTARGET.value = "dgData00$ctl02$Linkbutton3";
            theForm.__EVENTARGUMENT.value = "";
            theForm.submit();
            setTimeout(function () {
                location.reload();
            }, 100)
        } catch (error) {
            console.log(error)
        }
    }
    /*******函数声明-结束**/
    //跳转页面
    clickFirst()
})();