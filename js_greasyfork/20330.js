// ==UserScript==
// @name           Быстрая покупка предприятий с рынка
// @namespace       Быстрая покупка предприятий с рынка
// @version 	     1 
// @description    Быстрая покупка предприятий с рынка1
// @include       http://virtonomic*.*/*/main/unit_market/list
// @downloadURL https://update.greasyfork.org/scripts/20330/%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D0%B9%20%D1%81%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/20330/%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%B0%D1%8F%20%D0%BF%D0%BE%D0%BA%D1%83%D0%BF%D0%BA%D0%B0%20%D0%BF%D1%80%D0%B5%D0%B4%D0%BF%D1%80%D0%B8%D1%8F%D1%82%D0%B8%D0%B9%20%D1%81%20%D1%80%D1%8B%D0%BD%D0%BA%D0%B0.meta.js
// ==/UserScript==

var run = function () {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;
  
   $(document).ready(function () {
   myrealm = readCookie('last_realm');
 prot=window.location.protocol;
 hostserv=window.location.host;
//      var Murlik1=prot+'//'+hostserv+'/'+myrealm+'/main/user/privat/persondata/pay_service/list';
      $('table.list>tbody>tr:eq(0)>th:contains("Дисконт")').after('<th rowspan="2"><input id="byeall" type="button" value="Купить все"></th>');
var trpred=$('table.list>tbody>tr.odd, tr.even');
                console.log(trpred.length)
         
	
		for(i=0; i< trpred.length; i++) {
         
  $('td:eq(7)', trpred[i]).after('<td><input class="bye" type="button" value="Купить"></td>');

		}
     $('.bye').click(function(){
    var td = $(this).parent().parent();
   //  console.log(td)
    var id=$('td:eq(2)>div:eq(0)>a:eq(0)', td).attr('href');
  //   alert (id)
       id=id.split('/')
     //  alert(id[7])
      
       
         var MurlMark=prot+'//'+hostserv+'/'+myrealm+'/window/unit/market/buy/'+id[7];
    var fff='buy=%D0%9A%D1%83%D0%BF%D0%B8%D1%82%D1%8C+%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5'
       
          $.ajax({  url:MurlMark, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){
            
                  $('input.bye', td).attr('disabled', 'disabled');
                   
                 }
                })
       
  
     
   })
   
      $('#byeall').click(function(){ 
         var trpred=$('table.list>tbody>tr.odd, tr.even');
          $('<div id="js-wall" style="position: fixed; top: 0px; left: 0px; background-color: black; z-index: 100000; opacity: 0.2;" />').height($(window).height()).width($(window).width()).prependTo('body');
      $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-curr"></span>/' + trpred.length + '</div>').width($(window).width()).prependTo('body');
      $('#js-curr').text('0');
  
        	for(i=0; i< trpred.length; i++) {
           
             var id=$('td:eq(2)>div:eq(0)>a:eq(0)', trpred[i]).attr('href'); 
         id=id.split('/')
       //  alert(id[7])
           var MurlMark=prot+'//'+hostserv+'/'+myrealm+'/window/unit/market/buy/'+id[7];
    var fff='buy=%D0%9A%D1%83%D0%BF%D0%B8%D1%82%D1%8C+%D0%BF%D0%BE%D0%B4%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5'
      $.ajax({  url:MurlMark, 
       async: false,
        type: 'post',
           data: fff,
                 success: function(data){
            
             $('#js-progress').remove();
           $('<div id="js-progress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 10000; font-size: 40pt; text-align: center;" >Выполнено: <span id="js-curr"></span>/' + trpred.length + '</div>').width($(window).width()).prependTo('body');
           $('#js-curr').text(i+1);
         
                 }
                })
        
         
		}
       $('#js-progress').remove();
          $('#js-wall').remove();
          window.location = window.location.href;  
      })
     
   })
   
   
     }

if (window.top == window) {
  var script = document.createElement("script");
  script.textContent = '(' + run.toString() + ')();';
  document.documentElement.appendChild(script);
}
