// ==UserScript==
// @name         better calliu(1024) list
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更好的1024
// @author       H
// @match         http://t66y.com/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/39765/better%20calliu%281024%29%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/39765/better%20calliu%281024%29%20list.meta.js
// ==/UserScript==

(function(){
    'use strict';
    $("tr.tr3[align!='middle']").each(function(){

        var _target =  $(this).find('a')[1].href;
        var _content = $(this).find('a')[1].text;

        console.log(_content);
        console.log(_content.indexOf('['));
       if( _content.indexOf('[') == -1) return;
       console.log(_target);
        var _tmp = _target.split('/');

       _target = "http://t66y.com/read.php?fid="+ _tmp[4] + "&tid=" + _tmp[6].split('.')[0] + "&toread=1";



        var that = this;
        console.log(_target);

      $.ajax({
          url:_target,
          type:'GET',
          beforeSend: function(request) { request.setRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36");
                                         request.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
                                          request.setRequestHeader("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8,zh-TW;q=0.7");
                                         },
           success: function(data) {
               let _tr = document.createElement('tr');
               let _td = document.createElement('td');
               $(_td).attr('colspan', 5);
               let _div_img = document.createElement('div');

                  $("div.tpc_content > img", data).each(function(i,el){

                      if (i > 1){
                          return false;

                      }
  let _img = document.createElement('img');
                      $(_img).attr('width', 200);
                      $(_img).attr('height',100);
                       $(_img).attr("src", $(this).attr('src'));
                      _img.style.cssText= "float:left";
                       $(_img).appendTo(_div_img);
                      _div_img.style.cssText = "border:solid 1px #FF0000";


                   });
 $(_div_img).appendTo(_td);
               $(_td).appendTo(_tr);
               $(that).after(_tr);

           }
      });
    });

})();