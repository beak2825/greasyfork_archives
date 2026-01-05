// ==UserScript==
// @name         Wołaj
// @version      2.1
// @description  Wystarczy kliknąć na "Zawołaj" przy poście autora, aby dodać pod polem odpowiedzi wszystkie nicki osób, które napisały pod wpisem "wołaj", "wolaj", "taktyk" czy "taktycznie" z podziałem na listy.
// @author       Rst
// @match        https://www.wykop.pl/wpis/*
// @namespace https://greasyfork.org/users/13380
// @downloadURL https://update.greasyfork.org/scripts/12057/Wo%C5%82aj.user.js
// @updateURL https://update.greasyfork.org/scripts/12057/Wo%C5%82aj.meta.js
// ==/UserScript==

$(function(){

    $('div[data-type="entry"] .responsive-menu').append('<li><a href="#" class="affect hide fk-zawolaj" style=""><i class="fa fa-plus"></i> zawołaj</a></li>');
    
     $('.fk-zawolaj').on('click', function(e){
         e.preventDefault();
         
         var link = $('.logged-user > a').attr('href');
         var color = '';
         var max = 10;
         
         function getPeople(max) {
             var authors = [];
             $('.sub > li').each(function(index){
                 var text = $(this).find('.text > p').text();
                 var author = $(this).find('.author > a > b').text();
                 if (text.toLowerCase().indexOf("wolaj") >= 0 || text.toLowerCase().indexOf("wołaj") >= 0 || text.toLowerCase().indexOf("takty") >= 0)  
                     authors.push('@'+author);
             });
             var numberOfLists = (Math.floor(authors.length/max))+1;
              $('.replyOn').append('<div style="padding: 20px;" class="fk-list"><ul class="sub"></ul></div>');
             if(authors.length > max) {
                 var temp = [];
                 var temp2 = authors.length;
                 var limit = 1;
                 var index = 1;
                 var numberOfLists = (Math.floor(authors.length/max))+1;
                 
                 for(var i = 0; i<numberOfLists;i++){
                     $('.fk-list .sub').append('Lista '+(i+1)+'<li class="fk-helper-'+i+'"></li>');
                     if(temp2 > max) {
                         limit = max*(i+1);
                     } 
                     else {
                         limit = (authors.length%max)+(max*i);
                     } 
                     for(var j = i*max; j < limit; j++){
                         if (temp[i] == undefined) {
                             temp[i] = [];
                         }
                         temp[i].push(authors[j]+' ');
                         
                     }
                     temp2 -= max;
                     $('.fk-list .sub li.fk-helper-'+i).append(temp[i]);
                     index++;
                 }
             } else {
                 var authors2 = '';
                 $.each( authors, function( index, value ){
                     authors2 += value+' ';
                 });
                 $('.fk-list .sub').append('<li>'+authors2+'</li>');
             }
             
         }
         
         $.ajax({
             url: link,
             type: "get",
             dataType: "html",
             success: function (data) {
                 color = $(data).find('.user-profile h2 > span').attr('class');
                 
                 if(color == 'color-0') {
                     max = 10;
                 } else if(color == 'color-1') {
                     max = 20;
                 } else if(color == 'color-2') {
                     max = 50;
                 }

                 getPeople(max);
             }
         });
         
         
         
         
         
         
         
         document.location.href="#commentForm";
         
     });
    
});