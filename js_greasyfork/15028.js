// ==UserScript==
// @name        Wanikani Dashboard Active Topics Panel
// @namespace   mempo
// @description Active Topics Panel for your dashboard
// @include     https://www.wanikani.com/dashboard
// @include     https://www.wanikani.com/
// @run-at      document-end
// @version     1.6.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15028/Wanikani%20Dashboard%20Active%20Topics%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/15028/Wanikani%20Dashboard%20Active%20Topics%20Panel.meta.js
// ==/UserScript==

console.log('started Wanikani Dashboard Active Topics Panel');

/////////////////////////////////
//PREPARATION BEFORE LOADING
/////////////////////////////////



var nonCleanDashboardCss = '.DATP-i-small { ' +
                   'left: 0px !important;       '+
                   'top: 0px !important;       '+
                   'line-height: 0px !important; '+
                   'margin: -20px 0px 0px 150px !important; '+
                   'width: 15px !important; '+
                   'height: 15px !important; '+
              '}';

addStyle(nonCleanDashboardCss);

var DATPcss = '.DATP-i-small { ' +
                   'font-size: 15px !important; '+
                   'position: relative;         '+
                   'left: 70% !important;       '+
                   'top: 20px !important;       '+
                   'border: 0px !important;     '+
                   'box-shadow: none !important;' +
              '}'                                +
              '.DATP-section { ' +
                   'width: inherit ;'+
              '}'                       +
              '.DATP-table-wrapper { ' +
                   'position: relative ;'+
                   'height: 400px ;'+ //TODO maybe replace hard coded value
                   'overflow: hidden ;'+
                 //  'line-height: 15px ;'+
              '}'                       +
             '.DATP-table-wrapper table { ' +
             '      position: absolute; ' +
             '} ' +
             '.DATP-table-wrapper table tr td:last-child { ' +
             //'      padding-right: 30px; ' +
             '} ' +
             '.DATP-table-left { ' +
                   'left: 0 ;'+
                   'top: 0 ;'+
                   'bottom: 0 ;'+
              '}'  +
             '.DATP-table-right { ' +
                   'left: 1170px ;'+
                   'top: 0 ;'+
                   'bottom: 0 ;'+
              '}'  +
              '.forum-topics-list table { ' +
                   'height: 400px ;'+
              '}';
addStyle(DATPcss);



var blog = $(".blog");
blog.removeClass();
blog.addClass("forum-topics-list dashboard-sub-section DATP-section");

//MAKE THE FORUM LIST SPAN 6 AGAIN
$(".forum-topics-list").parent().removeClass().addClass("span6");

//ADD 'LOADING' ROW
$(".DATP-section h3").after("<table></table>");
$(".DATP-section table").append('<tbody><tr><td>Panel is loading. Please be patient</td></tr></tbody>');


$(".DATP-section").css('background-color', "#D5D5D5");
a = $(".DATP-section .see-more a");
a.html("Visit the user panel...");
a.attr("href","https://www.wanikani.com/community/panel/");
var i = $(".DATP-section .heading-symbol i");
i.removeClass();
i.addClass("icon-comments-alt");
$( ".DATP-section h3" ).html(function(i,oldhtml){return oldhtml.slice(0, oldhtml.indexOf('WaniKani News')) + '<span class="DATP-title">Topics Active In</span>'; });
$('.DATP-section h3').prepend('<div class="heading-symbol"><i class="icon-edit"></i></div>');

$(".DATP-section").addClass("DATP-section");
$(".DATP-section>h3>div:last-child").addClass("DATP-i-big");
$(".DATP-section>h3>div:first-child").addClass("DATP-i-small");

$(".DATP-section table").wrap('<div class="DATP-table-wrapper"></div>');
$(".DATP-table-wrapper table").addClass('DATP-table-left');
/*
var forumHeight = document.defaultView.getComputedStyle($('.forum-topics-list')[0], null).height;
console.log(forumHeight);
$(".DATP-table-wrapper").css('min-height',forumHeight);
*/


$(".DATP-table-wrapper").append('<table class="DATP-table-right DATP-loading"><tbody><tr><td>Panel is loading. Please be patient</td></tr></tbody></table>');

var panel = $(".DATP-section").parent().detach();
$(".forum-topics-list").parent().after(panel);

/////////////////////////////
//ADD FUNCTIONALITY TO ICON
/////////////////////////////

$('.DATP-i-small').click(function(){

    var icon =  $( ".DATP-i-small>i" );
    if(icon.hasClass('icon-comments-alt')){
        icon.removeClass().addClass('icon-edit');
    }else{
        icon.removeClass().addClass('icon-comments-alt');
    }
    
    icon =  $('.DATP-i-big>i');
    if(icon.hasClass('icon-comments-alt')){
        icon.removeClass().addClass('icon-edit');
    }else{
        icon.removeClass().addClass('icon-comments-alt');
    }
    
    
    var $table = $('.DATP-table-wrapper .DATP-table-left');
    $table.animate({
      left: parseInt($table.css('left'),10) == 0 ?
        -$table.outerWidth() :
        0
    });
    
    var $tableRight = $('.DATP-table-wrapper .DATP-table-right');
    
    if($tableRight.hasClass('DATP-loading')){
        loadCreatedTopics();
    }
    
    $tableRight.animate({
      left: parseInt($tableRight.css('left'),10) == 0 ?
        $table.outerWidth() :
        0
    });
    
    if($( ".DATP-title" )[0].innerHTML.indexOf('Created Topics') !== -1){
        $( ".DATP-title" )[0].innerHTML = $( ".DATP-title" )[0].innerHTML.replace('Created Topics','Topics Active In');
    }else{
        $( ".DATP-title" )[0].innerHTML = $( ".DATP-title" )[0].innerHTML.replace('Topics Active In','Created Topics');
    }
    
});




/////////////////////////////
//LOAD PARTIAL USER PANEL
/////////////////////////////

$( ".DATP-section .DATP-table-left" ).load( "https://www.wanikani.com/community/panel #active-topics table", function(){ 
    $( ".DATP-section .DATP-table-left>table" ).unwrap();
    $(".DATP-table-wrapper table:first-child").addClass('DATP-table-left');
    $( ".DATP-section .DATP-table-left thead" ).remove();
    $( ".DATP-section .DATP-table-left tbody tr" ).unwrap();
    $( ".DATP-section .DATP-table-left>tr>td:nth-child(2)" ).remove();
    $( ".DATP-section .DATP-table-left>tr>td:nth-child(2)" ).remove();
    $( ".DATP-section .DATP-table-left .description" ).html(function(i,oldhtml){return oldhtml.slice(0, oldhtml.indexOf('<br>')); });
    $(".DATP-section .DATP-table-left td").css('padding', '15px 30px 15px 15px').css('width','130px'); //PADDING AND WIDTH OF TIMESTAMP TD
    $(".DATP-section .DATP-table-left td:first-child").css('width','270px').css('padding','15px 0px 15px 30px');
    var a = $(".DATP-section .DATP-table-left a");
    a.css('display', 'inline');
    a.css('padding', '0');
    $(".dashboard section.DATP-section .DATP-table-left td:first-child a:first-child").after('<br>');
    $(".dashboard section.DATP-section .DATP-table-left tr").after('<tr><td colspan="2"><hr></td></tr>');
    $(".dashboard section.DATP-section .DATP-table-left tr:last-child").remove();
    
});


/////////////////////////////

function loadCreatedTopics(){
    $( ".DATP-section .DATP-table-right" ).load( "https://www.wanikani.com/community/panel #created-topics table", function(){ 
    $( ".DATP-section .DATP-table-right>table" ).unwrap();
    $(".DATP-table-wrapper table:last-child").addClass('DATP-table-right');
    $( ".DATP-section .DATP-table-right thead" ).remove();
    $( ".DATP-section .DATP-table-right tbody tr" ).unwrap();
    $( ".DATP-section .DATP-table-right>tr>td:nth-child(2)" ).remove();
    $( ".DATP-section .DATP-table-right>tr>td:nth-child(2)" ).remove();
    $( ".DATP-section .DATP-table-right .description" ).html(function(i,oldhtml){return oldhtml.slice(0, oldhtml.indexOf('<br>')); });
    $(".DATP-section .DATP-table-right td").css('padding', '15px 30px 15px 15px').css('width','130px'); //PADDING AND WIDTH OF TIMESTAMP TD
    $(".DATP-section .DATP-table-right td:first-child").css('width','270px').css('padding','15px 0px 15px 30px');
    var a = $(".DATP-section .DATP-table-right a");
    a.css('display', 'inline');
    a.css('padding', '0');
    $(".dashboard section.DATP-section .DATP-table-right td:first-child a:first-child").after('<br>');
    $(".dashboard section.DATP-section .DATP-table-right tr").after('<tr><td colspan="2"><hr></td></tr>');
    $(".dashboard section.DATP-section .DATP-table-right tr:last-child").remove();
    $( ".DATP-section .DATP-table-right").css('left', '0px');
        
    $('.DATP-table-wrapper .DATP-table-right').removeClass('DATP-loading');
    });
}

function addStyle(aCss) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (head) {
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
}
