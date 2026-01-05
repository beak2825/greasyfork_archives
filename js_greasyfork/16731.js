// ==UserScript==
// @name         이벤트 하우스
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://s.eventhouse.kr/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/16731/%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%ED%95%98%EC%9A%B0%EC%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/16731/%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%ED%95%98%EC%9A%B0%EC%8A%A4.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
document.addEventListener('DOMContentLoaded', function(){
    var visitedRowDiv = document.querySelectorAll('.list_row');
    
    for(var i=0; i<visitedRowDiv.length;i+=1){
      if(visitedRowDiv[i].querySelectorAll('img[src*="entry_open.gif"]').length){
          visitedRowDiv[i].style.backgroundColor = 'yellow';
      }
    }
    
    $('.list_row').each(function(){
        $(this).on('click', function(event){
            if(!$(event.target).attr('onclick')){
                eval($(this).find('.list_subject').attr('onclick'));
            }
        });
    });
    
    $('.list_detail .detail_td:nth-child(3) .td_r').each(function(){        
        if($(this).parents('.list_detail').prev().find('.list_gift').length){
            $(this).parents('.list_detail').prev().find('.list_gift').text($(this).text());
        } else {
            $(this).parents('.list_detail').prev().find('.list_day').last().after('<div class="list_gift">'+$(this).text()+'</div>');
        }
    });
    
    $('head').append('<style>.list_gift {width:auto;white-space:nowrap;font-size:12px;color:red;}</style>');
});