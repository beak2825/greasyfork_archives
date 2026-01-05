// ==UserScript==
// @name           osu! disable timeago
// @description    disable timeago and use local time. Suwako's request.
// @author         JebwizOscar
// @icon           http://osu.ppy.sh/favicon.ico
// @include        http://osu.ppy.sh/*
// @include        https://osu.ppy.sh/*
// @version        0.1u
// @namespace https://greasyfork.org/users/3079
// @downloadURL https://update.greasyfork.org/scripts/4471/osu%21%20disable%20timeago.user.js
// @updateURL https://update.greasyfork.org/scripts/4471/osu%21%20disable%20timeago.meta.js
// ==/UserScript======
function loadInCurrentTab(page)
{
    if(activeRequest) {
        activeRequest.abort();
    }
    activeRequest = $.get(page, null, function(text){
        activeRequest = null;
        
        $("#" + activeTab).html(text);
        $("#" + activeTab).stop(true,true).fadeTo(50,1,function() {    $("#" + activeTab).css('filter', 'none'); });
        $("#" + activeTab).addClass("loaded");
        $(".timeago").removeClass('timeago').addClass('timeago_');
        $('.timeago_').each(function(){$(this).html((new Date(Date.parse($(this).attr('title')))).Format("yyyy-MM-dd hh:mm:ss"))});
    });
}
Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,
    "d+" : this.getDate(),
    "h+" : this.getHours(),
    "m+" : this.getMinutes(),
    "s+" : this.getSeconds(),
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}
 
script = document.createElement("script");
script.innerHTML = loadInCurrentTab;
document.body.appendChild(script);
$(".timeago").removeClass('timeago').addClass('timeago_');
$('.timeago_').each(function(){$(this).html((new Date(Date.parse($(this).attr('title')))).Format("yyyy-MM-dd hh:mm:ss"))});
$( document ).ajaxComplete(function( event, xhr, settings ) {
    $(".timeago").removeClass('timeago').addClass('timeago_');
    $('.timeago_').each(function(){$(this).html((new Date(Date.parse($(this).attr('title')))).Format("yyyy-MM-dd hh:mm:ss"))});
});
