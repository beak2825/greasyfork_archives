// ==UserScript==
// @name         Zawołaj plusujących
// @version      2.2
// @description  Wystarczy kliknąć na liczbę osób, które zaplusowały dany komentarz, a następnie wybrać opcję "dodaj plusujących" aby automatycznie dodać nicki tych pod pole odpowiedzi z podziałem na listy.
// @author       Rst
// @match        https://www.wykop.pl/wpis/*
// @namespace https://greasyfork.org/users/13380
// @downloadURL https://update.greasyfork.org/scripts/12045/Zawo%C5%82aj%20plusuj%C4%85cych.user.js
// @updateURL https://update.greasyfork.org/scripts/12045/Zawo%C5%82aj%20plusuj%C4%85cych.meta.js
// ==/UserScript==

$(function(){

    $('.responsive-menu').each(function(){
        
        $(this).append('<li><a href="#" class="affect hide fk-wolaj-plusujacych" style=""><i class="fa fa-plus"></i> dodaj plusujących</a></li>');
        
    });
    
     $('.fk-wolaj-plusujacych').on('click', function(e){
         e.preventDefault();
         var text = '';
         var link = $('.logged-user > a').attr('href');
         var color = '';
         var max = 10;
         var $this = $(this);
         function getPeople(max) {
             var authors = [];

             var voters = $this.parents('.wblock').find('.text .votersContainer .voters-list');
         
             voters.find('a').each(function(){
                 authors.push('@'+$(this).text());
             });
             console.log(authors);
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
                     max = 20;
                 } else if(color == 'color-1') {
                     max = 50;
                 } else if(color == 'color-2') {
                     max = 150;
                 }

                 getPeople(max);
             }
         });
         
         document.location.href="#commentForm";
         
     });
    
});