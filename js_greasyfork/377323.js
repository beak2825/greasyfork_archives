// ==UserScript==
// @name        TSDM打工
// @namespace   https://greasyfork.org/zh-CN/users/230773
// @author      gfork
// @description 对https://greasyfork.org/zh-CN/scripts/20632-tsdm%E6%89%93%E5%B7%A5的微调 感谢原作者
// @include     *://www.tsdm.*/plugin.php?id=np_cliworkdz:work*
// @include     /https?://www.tsdm\.[a-zA-Z0-9]*/forum.php\?mod=viewthread&tid=(321479|956489)/
// @include     *://www.tsdm39.*/plugin.php?id=np_cliworkdz:work*
// @include     /https?://www.tsdm39\.[a-zA-Z0-9]*/forum.php\?mod=viewthread&tid=(321479|956489)/
// @version     4.2.4
// @grant       none
// @run-at      document-end
// @license     GPL version 3
// @downloadURL https://update.greasyfork.org/scripts/377323/TSDM%E6%89%93%E5%B7%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/377323/TSDM%E6%89%93%E5%B7%A5.meta.js
// ==/UserScript==


/*   老版本备份 不用管
     var num=0;
     $('div[id*="np_advid"]>a').each(function(index, element) {
     hrefValue = $(this).attr("href","javascript:;") ;
     targetValue = $(this).attr("target","_self") ;
     });

     $('div[id*="np_advid"]>a').bind("mouseover",function(){
     $(this).slideToggle();
     $.post("plugin.php?id=np_cliworkdz:work",
     {
       act:"clickad"
     },
     function(data){
	   num++;
     if(num==6){setTimeout(tijiao,2000);}
//   alert(num);
     }
     );
     });

     function tijiao(){
     $.post("plugin.php?id=np_cliworkdz:work",
     {act:'getcre'},
     function(data)
     {
//   console.log('领奖响应:'+data);
     console.log(remind(data));
     window.location=window.location;}
     );
     }

     function remind(data){
     var info=data.match(/class="alert_info">[\s]{0,4}<p>([^<]*)</)[1];
     return info;
     }
*/
var url=window.location.href;
if(url.match("tid=(321479|956489)"))
window.location.href='plugin.php?id=np_cliworkdz:work';

jQuery(document).ready(function($){
//   setTimeout(function(){$('#advids').children().children().trigger("click");}, 100);
     setTimeout(function(){$('#np_advid1').children().trigger("click");},300);
     setTimeout(function(){$('#np_advid2').children().trigger("click");},600);
     setTimeout(function(){$('#np_advid4').children().trigger("click");},900);
     setTimeout(function(){$('#np_advid6').children().trigger("click");},1200);
     setTimeout(function(){$('#np_advid7').children().trigger("click");},1500);
     setTimeout(function(){$('#np_advid9').children().trigger("click");},1800);
//    document.getcre.submit();
    setTimeout(function(){document.getcre.submit();},2500);
//    setTimeout(function(){$('#stopad').children().trigger("click");},2000);
});