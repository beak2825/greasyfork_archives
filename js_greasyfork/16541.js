// ==UserScript==
// @name         MTCrowd better forum view
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.0
// @description  Turns the forumn posts under Daily Work Threads into a more managable list and adds a view for only hits posted.
// @author       saqfish
// @include      http://www.mturkcrowd.com/threads/*
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/16541/MTCrowd%20better%20forum%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/16541/MTCrowd%20better%20forum%20view.meta.js
// ==/UserScript==

var Page_nums = 0;
var Curr_page = 0;
var postcount = 0;
var runit = false;
var content2 = "";


var url = window.location.href;  
var title =$('title').text();
var eee =$('#pageDescription').children().eq(0).text();
console.log(eee);
if( eee === "Daily Work Threads"){
    runit = true;
}


var content = '<ul class="main_list" type="square">';
var content2 = '<ul class="main_list2"  type="square">';

$(document).on('click', "[id^=view_hits]", function(e) {
    $('body').empty();
    $('body').append('<table><tr><td id="thread_title">'+title+'</td><td> | Total pages: '+Page_nums+' </td><td id="view_pages"><a href="javascript:void(0)">   [View pages]   </a></td><td id="view_hits"><a href="javascript:void(0)">[View hits]</a></td></tr> </table>');
    console.log(title);
    $('body').append(content2);
    $(".post2").css('border','5px solid black');
    $(".post2").css('list-style-position:','inside');
    sort_list("main_list2");
});

$(document).on('click', "[id^=view_pages]", function(e) {
    view_pages();

});

$(window).load(function(){
    var Total_posts = 0;
    if(runit)
    {
        $('link[rel="stylesheet"]').attr('disabled', 'disabled');
        $('body').empty();
        $('body').append("Loading...");
        $.get(url, function(data)
              {
                  var aBh = $(data);
                  Page_nums = aBh.find('div.PageNav').attr("data-last");
                  test(Page_nums);

              });
    }
});

function test(i){
    var i2 = parseInt(i) + 1;
    var i3 = parseInt(i) - 1;

    console.log(i);
    for(var a = 1; a < i2; a++){
        var url2 = url + "page-" + a;
        $.get(url2, function(data2){  
            var aCh = $(data2);
            Curr_page = aCh.find('a.currentPage:first').text();
            console.log(Curr_page);
            content += '<li id="Page_num" dn='+addZeros(Curr_page)+'>Page '+ Curr_page + '<ul>';
            $('body').empty();
            $('body').append("Loading Page "+ postcount +" out of " + i2 +" Page(s)...");
            $(aCh).find("[id^=post] div.messageInfo.primaryContent > div.messageContent > article > blockquote").each(function(e) {

                content += '<li class="post">'+$(this).html()+'</li>';

            });
            content2 += '<li id="Page_num2" dn='+addZeros(Curr_page)+'>Page '+ Curr_page + '<ul>';
            $(aCh).find('td.ctaBbcodeTableCellLeft').each(function(e) {
                if ($(this).length !== 0){

                    content2 += '<li class="post2">'+$(this).html()+'</li>';
                }
            });
            content += '</ul></li>';
            content2 += '</ul></li>';
            if(postcount === i3){
                content += '</ul>';
                content2 += '</ul>';
                view_pages();
            }
            postcount++;
        });

    }

}

function view_pages(){
    $('body').empty();
    $('body').append('<table><tr><td id="thread_title">'+title+'</td><td> | Total pages: '+Page_nums+' </td><td id="view_pages"><a href="javascript:void(0)">   [View pages]   </a></td><td id="view_hits"><a href="javascript:void(0)">[View hits]</a></td></tr> </table>');
    $('body').append("<hr>Click on the page to view its content</hr>");
    console.log(title);
    $('body').append(content);
    var toggle_flag = 0;
    $('ul').toggleClass('no-js js');
    $(".post").css('border','5px solid black');
    $(".post").css('list-style-position:','inside');          


    var menuList = $(".js").find("li");
    menuList.find("ul").hide();
    menuList.on("click", function(){
        menuList.find("ul").slideUp(0);
        $(this).find("ul").slideToggle(0);      
        $(this).toggleClass("selected");
    });
    sort_list("main_list");
}


//Credit for sort - http://trentrichardson.com/2013/12/16/sort-dom-elements-jquery/

function sort_list(i){

    var $people = $('ul.'+i),
        $peopleli = $people.children('li');

    $peopleli.sort(function(a,b){
        var an = a.getAttribute('dn'),
            bn = b.getAttribute('dn');

        if(an > bn) {
            return 1;
        }
        if(an < bn) {
            return -1;
        }
        return 0;
    });

    $peopleli.detach().appendTo($people); 
}

function addZeros(n) {
    return (n < 10)? '00' + n : (n < 100)? '0' + n : '' + n;
}
