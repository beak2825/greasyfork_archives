// ==UserScript==
// @name         FZOJ Plus
// @namespace    https://yaunt.tecg
// @version      0.0.2
// @description  Old HUSTOJ Plus
// @author       Yuant
// @match        *://fzoj.xndxfz.com/problem.php?id=*
// @match        *://fzoj.xndxfz.com/problem.php?cid=*&pid=*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.5.0.min.js
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/401431/FZOJ%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/401431/FZOJ%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    unsafeWindow.copy_input=function (){
        var src=document.getElementsByClassName("content")[3].innerText;
        var input = document.getElementById("input");
        input.value = src; // 修改文本框的内容
        input.select(); // 选中文本
        document.execCommand("copy");
        alert("复制成功");
    }
    unsafeWindow.copy_output=function (){
        var src=document.getElementsByClassName("content")[4].innerText;
        var input = document.getElementById("input");
        input.value = src; // 修改文本框的内容
        input.select(); // 选中文本
        document.execCommand("copy");
        alert("复制成功");
    }
    var username=document.getElementById("red").innerHTML;
    var url = document.getElementsByTagName("center");
    var ha = url[0].getElementsByTagName("a");
    var html=document.createElement("a");
    var zk=document.createElement("span");
    var yk=document.createElement("span");
    zk.innerHTML="[";
    yk.innerHTML="]";
    html.innerHTML="我的提交";
    if(problem=getQueryString("id")!=null){
    var problem=getQueryString("id");
    html.setAttribute('href', 'http://fzoj.xndxfz.com/status.php?problem_id='+problem+'&user_id='+username);
    }else{
    var arr=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    var pid=getQueryString("pid");
    var contents=getQueryString("cid");
    //alert(arr[pid]);
    html.setAttribute('href', 'http://fzoj.xndxfz.com/status.php?problem_id='+arr[pid]+'&user_id='+username+'&cid='+contents);
    }
    url[0].appendChild(zk);
    url[0].appendChild(html);
    url[0].appendChild(yk);
    var copy=document.getElementsByTagName("h2");
    copy[4].innerHTML=copy[4].innerHTML+' ';
    copy[5].innerHTML=copy[5].innerHTML+' ';
    var copy4_html=document.createElement("a");
    copy4_html.innerHTML="Copy";
    copy4_html.setAttribute('href', 'javascript:void(0);');
    copy4_html.setAttribute('onClick', 'window.copy_input()');
    var copy_html=document.createElement("a");
    copy_html.innerHTML="Copy";
    copy_html.setAttribute('href', 'javascript:void(0);');
    copy_html.setAttribute('onClick', 'window.copy_output()');
    copy[4].appendChild(copy4_html);
    copy[5].appendChild(copy_html);
    var copyin=document.createElement("textarea");
    copyin.setAttribute('id','input');
    copyin.setAttribute('style','position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;');
    copy[4].appendChild(copyin);
})();