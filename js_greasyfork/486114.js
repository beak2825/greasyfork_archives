// ==UserScript==
// @name         「测试登录」允许直接在隐身窗口登录
// @namespace    http://tampermonkey.net/
// @version      2024-01-31
// @description  点击「测试登录」，自动在隐身窗口登录
// @author       任亚军
// @match        https://*/wjx/user/qywxusermanage.aspx*
// @match        https://*/newwjx/manage/addressbook.aspx*
// @match        https://*/wjx/user/usermanage.aspx*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486114/%E3%80%8C%E6%B5%8B%E8%AF%95%E7%99%BB%E5%BD%95%E3%80%8D%E5%85%81%E8%AE%B8%E7%9B%B4%E6%8E%A5%E5%9C%A8%E9%9A%90%E8%BA%AB%E7%AA%97%E5%8F%A3%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/486114/%E3%80%8C%E6%B5%8B%E8%AF%95%E7%99%BB%E5%BD%95%E3%80%8D%E5%85%81%E8%AE%B8%E7%9B%B4%E6%8E%A5%E5%9C%A8%E9%9A%90%E8%BA%AB%E7%AA%97%E5%8F%A3%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    if (window.location.href.indexOf("/wjx/user/usermanage.aspx") !== -1) {
        // 多用户管理页面
        var rows_1 = document.querySelector("#ctl00_ContentPlaceHolder1_GridView1").rows.length;
        for(var i=2; i<= rows_1; i++){
            var lujin1_1 = "#ctl00_ContentPlaceHolder1_GridView1 > tbody > tr:nth-child(" + i + ") > td:nth-child(8) > a:nth-child(4)";
            var aa_1 = document.querySelector(lujin1_1)
            var urlhref_1 = aa_1.href;
            var automaurl_1 = "https://www.baidu.com/?automa=" + encodeURIComponent(urlhref_1)
            aa_1.href = automaurl_1;
            aa_1.setAttribute("onclick", "");
        }
    } else if (window.location.href.indexOf("/wjx/user/qywxusermanage.aspx") !== -1) {
        // 通过录管理页面
        var rows_2 = document.querySelector("#GridView1").rows.length;
        for(var j=2; j<= rows_2; j++){
            var lujin1_2 = "#GridView1 > tbody > tr:nth-child(" + j + ") > td:nth-child(7) > a:nth-child(3)";
            var aa_2 = document.querySelector(lujin1_2);
            var urlhref_2 = aa_2.href;
            var automaurl_2 = "https://www.baidu.com/?automa=" + encodeURIComponent(urlhref_2);
            aa_2.href = automaurl_2;
            aa_2.setAttribute("onclick", "");
        }
    } else if (window.location.href.indexOf("/newwjx/manage/addressbook.aspx") !== -1) {
        // 通讯录成员页面
        function ossfun(){
            setTimeout(function(){
                var rows_3 = document.querySelector("#booktable > div.addresstable > table").rows.length;
                for(var k=1; k<= rows_3; k++){
                    var lujin1_3 = "#booktable > div.addresstable > table > tbody > tr:nth-child(" + k + ") > td:nth-child(6) > a:nth-child(4)";
                    var aa_3 = document.querySelector(lujin1_3);
                    var urlhref_3 = aa_3.getAttribute("id");
                    var automaurl_3 = "https://www.baidu.com/?automa=" + encodeURIComponent(urlhref_3);
                    aa_3.href = automaurl_3;
                    aa_3.setAttribute("onclick", "");
                    aa_3.target="_blank";
                }
            },500)
        }
        ossfun();
        setTimeout(function(){
            $(".jstree-anchor").click(ossfun)
        },500)
    }
})();