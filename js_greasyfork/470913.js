// ==UserScript==
// @name         QQ链接自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  如题，自动跳转QQ、QQ邮箱的“非官方页面”外链
// @author       geigei717
// @license      MIT
// @match        https://c.pc.qq.com/middlem.html*
// @match        https://mail.qq.com/cgi-bin/readtemplate?t=safety&check=false&gourl=*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/fc67t00gsk98w7pbhs97xr94g1hl
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/470913/QQ%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/470913/QQ%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    var url;
    //QQ跳转外链
    if(/(https:\/\/c\.pc\.qq\.com\/middlem\.html.*)/.test(window.location.href )){
        if( $('section .ui-title').text()=='当前网页非官方页面'){
            url = $("#url").text()
            window.location.assign(url)
        }
    }
    //QQ邮箱跳转外链
    if( /(https:\/\/mail\.qq\.com\/cgi-bin\/readtemplate\?t=safety\&check=false\&gourl=.*)/.test(window.location.href ) ){
        if( $(".remind_title").text()=='您将要访问：'){
            url = $(".safety-url").text()
            window.location.assign(url)
        }
    }
})();