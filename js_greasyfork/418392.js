// ==UserScript==
// @name         sjtu学生评价一键好评
// @namespace    ulita
// @version      0.2
// @description  自动填写学生评价
// @author       ulita
// @match        https://i.sjtu.edu.cn/xspjgl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418392/sjtu%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/418392/sjtu%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==


(function() {

$(document).ready(function() {
$("#kc-head").prepend('<button class="btn btn-default btn-default" type="button" id="fuckshite"><i class="icon-ok bigger-120"></i>&nbsp;一键差评&nbsp;</button>');
$("#kc-head").prepend('<button class="btn btn-default btn-default" type="button" id="fuckbutton"><i class="icon-ok bigger-120"></i>&nbsp;一键好评&nbsp;</button>');
$("#fuckbutton").on("click", function(){
    var choices = document.getElementsByClassName("radio-pjf");
    var n = choices.length;
    for (var i = 0; i < n; i++)
    {
        if (i % 5 == 0) {
            choices[i].checked = true;
        }
    }
    $(".form-control").val("课非常好，学到很多。");
});
$("#fuckshite").on("click", function(){
    var choices = document.getElementsByClassName("radio-pjf");
    var n = choices.length;
    for (var i = 0; i < n; i++)
    {
        if (i % 5 == 4) {
            choices[i].checked = true;
        }
    }
    $(".form-control").val("课非常烂，啥也没学到。");
});
});
})();