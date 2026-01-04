// ==UserScript==
// @name         南京理工大学自动评教
// @namespace    LordCasser
// @version      0.2
// @description  对于评教只能用IE的BUG进行了修复,现在可以用任何浏览器进行访问.能自动选择
// @author       LordCasser
// @match        http://202.119.81.113:9080/njlgdx/xspj/xspj_list.do*
// @match        http://202.119.81.113:9080/njlgdx/xspj/xspj_edit.do*
// @match        http://202.119.81.113:9080/njlgdx/kscj/cxbmxk_query*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        window.open
// @grant        replace
// @grant        window.location.pathname
// @downloadURL https://update.greasyfork.org/scripts/386650/%E5%8D%97%E4%BA%AC%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/386650/%E5%8D%97%E4%BA%AC%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==


$(document).ready(function(){
    function replace_judge_href (){
        var tmp = $("a[href]");
        for(var i =12; i < tmp.length ;i++){
            var t = $($("a[href]")[i]).attr("href");
            t = t.replace("JsMod","window.open");
            $($("a[href]")[i]).attr("href",t);
        }
    }
    function set_radios(){
        var but = $(":radio");
        for(var i=0;i <but.length;i=i+5){
            if (i == but.length-5) {
                i++;
            }
            $(but[i]).attr({checked:"checked"});
        }
    }
    function replace_buttun_herf(){
        var tmp = $("input[onclick]");
        for (var i=0;i < tmp.length;i++){
            var t = $($("input[onclick]")[i]).attr("onclick");
            t = t.replace("JsMod","window.open");
            $($("input[onclick]")[i]).attr("onclick",t);
        }
    }
    function run(){
        var path = window.location.pathname;
        if(path == "/njlgdx/xspj/xspj_list.do") {
            replace_judge_href();
        } 
        else if (path == "/njlgdx/xspj/xspj_edit.do"){
            set_radios();
        }
        else if (path == "/njlgdx/kscj/cxbmxk_query"){
            replace_buttun_herf();
        }
        
    }
    run();




  });