// ==UserScript==
// @name         天使动漫打工签到集合版
// @namespace    https://uvwvu.xyz
// @version      0.8
// @description  页面集成打工与签到按钮，打工需要安装我的另一个脚本
// @author       AurevoirXavier
// @include      https://www.tsdm.love/forum.php
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34332/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E6%89%93%E5%B7%A5%E7%AD%BE%E5%88%B0%E9%9B%86%E5%90%88%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/34332/%E5%A4%A9%E4%BD%BF%E5%8A%A8%E6%BC%AB%E6%89%93%E5%B7%A5%E7%AD%BE%E5%88%B0%E9%9B%86%E5%90%88%E7%89%88.meta.js
// ==/UserScript==

GM_addStyle(".mybutton { height:30px; width:45%; line-height:5px; position:relative; border:0; margin:0; padding:0; cursor:pointer; font-size:1rem; font-weight:bold; color:rgba(0,0,0,0); background:transparent; border-radius:.25rem; -webkit-tap-highlight-color: rgba(0,0,0,0); -webkit-touch-callout: none; } .mybutton, .mybutton:after, .mybutton:before { padding:.6875rem 2rem; -webkit-transition:-webkit-transform 0.75s,background-color .125s; -moz-transition:-moz-transform 0.75s,background-color .125s; -ms-transition:-ms-transform 0.75s,background-color .125s; transition:transform 0.75s,background-color .125s; -webkit-transform-style:preserve-3d; -moz-transform-style:preserve-3d; -ms-transform-style:preserve-3d; transform-style:preserve-3d; } .mybutton:after, .mybutton:before { position:absolute; top:0; bottom:0; left:0; right:0; border-radius:.25rem; -webkit-backface-visibility:hidden; -moz-backface-visibility:hidden; -ms-backface-visibility:hidden; backface-visibility:hidden; } .mybutton:before { z-index:2; color:#fff; background-color:#3e87ec; content:attr(data-label); } .mybutton:after { z-index:1; background-color:#999; background-repeat:no-repeat; background-position:center center; background-image:url(data:image/gif;base64,R0lGODlhEAAQAPIAAJmZmf///7CwsOPj4////9fX18rKysPDwyH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAFACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==); -webkit-transform:rotateX(180deg); -moz-transform:rotateX(180deg); -ms-transform:rotateX(180deg); transform:rotateX(180deg); content:''; } .mybutton:active:before { background-color:#3571c8; } .mybutton.loading { -webkit-transform:rotateX(180deg); -moz-transform:rotateX(180deg); -ms-transform:rotateX(180deg); transform:rotateX(180deg); }");

jQuery(document).ready(function($) {
    var container=$("<div id='container' align=center></div>");
    var check=$("<button id='check' class='mybutton' data-label='签到'></button>");
    var work=$("<button id='work' class='mybutton' style='margin-left:40px' data-label='打工'></button>");

    $("#nv").after(container);
    $("#container").append(check);
    $(check).after(work);

    var btns = document.querySelectorAll(".mybutton");
    for (var i=btns.length-1;i>=0;i--) {
        btns[i].addEventListener("click",function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.target.classList.add("loading");
            e.target.setAttribute("disabled","disabled");
            setTimeout(function(){
                e.target.classList.remove("loading");
                e.target.removeAttribute("disabled");
            },1500);
        });
    }

    $("#check").click(function() {
        showWindow("dsu_paulsign", "plugin.php?id=dsu_paulsign:sign&616cdca8");
        setTimeout(function(){
            Icon_selected("kx");
            $("#todaysay").val("哈哈哈");
            showWindow('qwindow', 'qiandao', 'post', '0');
        },2000);
    });

    $("#work").click(function() {
        setTimeout(function() {
            $(location).attr("href", "https://www.tsdm.love/plugin.php?id=np_cliworkdz:work");
        }, 2000);
    });
});