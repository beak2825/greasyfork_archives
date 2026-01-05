// ==UserScript==
// @name         haitao_autocopy
// @version      0.1.1
// @description  自动填写账单，保留一切版权
// @author       wanghsinche
// @include      http://buyers.youdao.com/order?*
// @grant        none
// @namespace https://greasyfork.org/users/326
// @downloadURL https://update.greasyfork.org/scripts/12460/haitao_autocopy.user.js
// @updateURL https://update.greasyfork.org/scripts/12460/haitao_autocopy.meta.js
// ==/UserScript==
var di,aco,crash,btnHTML,oh,i=0;for($(".large-2.columns>input").eq(0),$(".large-4.columns>input").eq("10"),btnHTML='<div class="large-12 column large-text-left"><a  id="button">auto copy</a></div>',$(".large-3.column.panel").append(btnHTML),oh='<div class="large-12 column large-text-left"><a id="option">options</a></div>',i=0;i<$(".large-4.columns>input").length;i++)$(".large-4.columns>input").eq(i);$("#button").click(function(){di=$(".large-2.columns.table-columns").eq(1).text(),aco=$(".large-2.columns.table-columns").eq(2).text(),crash=$(".large-12.column.large-text-left").eq(5).text().trim().substring(7),$(".large-2.columns>input").eq(0),$(".large-2.columns>input").eq(0).val(di),$(".large-2.columns>input").eq(1).val(aco),$(".large-4.columns>input").eq("10").val(crash),this.text="copied!"}),btnHTML=function(){function a(a){var b=a.find("ul:first"),c=b.find("li:first").width();b.animate({marginLeft:-c+"px"},600,function(){b.css({marginLeft:0}).find("li:first").appendTo(b)})}function b(a){var b=a.find("ul:first");b.animate({marginLeft:"-1500px"},600,function(){b.css({marginLeft:"-700px"}).find("li:first").appendTo(b)})}$("#option").click(function(){a=$(".large-2.table-columns").eq(0).text(),b=$(".large-2.table-columns").eq(0).text(),crash=$(".large-12.column.-text-left").eq(0).text().trim().substring(7),$(".large-2>input").eq(0),$(".large-2.columns>input").eq(0).val(a),$(".large>input").eq(0).val(b),$(".large-4.columns>input").eq("0").val(crash),this.text="copied!"}),$(function(){var d,c=$(".slider");$(".slider").hover(function(){clearInterval(d)},function(){d=setInterval(function(){a(c)},5e3)}).trigger("mouseleave"),$("#righthover").bind("click",function(){b(c)})})};