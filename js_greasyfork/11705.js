// ==UserScript==
// @name Sortowanie Mikrobloga
// @description Sortuje wpisy z mikrobloga po ilosci plusow oraz dodaje przycisk do posortowania odpowiedzi do posta wg. plusow.
// @version 1.3
// @author JackBauer
// @include http://www.wykop.pl/mikroblog/*
// @include http://www.wykop.pl/tag/*
// @include http://www.wykop.pl/wpis/*
// @include http://www.wykop.pl/ludzie/*
// @namespace https://greasyfork.org/users/14286
// @downloadURL https://update.greasyfork.org/scripts/11705/Sortowanie%20Mikrobloga.user.js
// @updateURL https://update.greasyfork.org/scripts/11705/Sortowanie%20Mikrobloga.meta.js
// ==/UserScript==   

// Przycisk w prawym gornym rogu do sortowania wpisow
if(!isOnSinglePostPage()) $("div.nav.bspace.rbl-block ul").slice(0, 1).append('<li><a href="#" style="color: #000;font-weight: bold" id="mikroblog_sort_posts">Sortuj wpisy po plusach</a></li>');
if(!isOnTagPage()) $("div.nav.fix-b-border ul").slice(1, 2).prepend('<li><a href="#" style="color: #666;font-weight: normal;font-size: 12px" id="mikroblog_sort_posts">Sortuj wpisy po plusach</a></li>');
if(isOnUserPage()) $("div.m-reset-position.m-make-center.m-set-space").append('<a href="#" class="button folNeutral" style="color: #666;font-weight: normal;font-size: 12px;" id="mikroblog_sort_posts">Sortuj wpisy po plusach</a>');


// Przyciski przy poscie po najechaniu (obok zglos, ulubiony itp.) do sortowania odpowiedzi do danego wpisu
$("#itemsStream > li > div").find("ul.responsive-menu").append('<li><a href="#" class="affect hide mikroblog_sort_responses">sortuj odpowiedzi po plusach</a></li>');

// Sortowanie wpisow na stronie glownej mikrobloga i stronie tagow
$("#mikroblog_sort_posts").click(function(){
    
    var first_post = $("#itemsStream > li:first-child").clone().css("display", "none");
    var last_post = $("#itemsStream > li:last-child").clone().css("display", "none");
    var posts = sortPostsByVotes($("#itemsStream > li"));
    
    $("#itemsStream > li").remove();
    $("#itemsStream").append(first_post);
    $("#itemsStream").append(posts);
    $("#itemsStream").append(last_post);
    
    $("img.lazy").lazyload({threshold: 999999});
});

// Sortowanie odpowiedzi do wpisow
responsesLoaded = false;
$(".mikroblog_sort_responses").click(function(e){
    e.preventDefault();
    var post = $(this).parent().parents("li:first");
    
    if(isOnSinglePostPage())
    {
        var posts = sortPostsByVotes($("ul.sub > li", post));
            
        $("ul.sub > li", post).remove();
        $("ul.sub", post).append(posts);
    } else {
        responsesLoaded = false;
        $("ul.sub", post).prepend('<li style="display: none" class="loadingResponses"></li>');
        
        if($("p.more a", post).length <= 0)
        {
            responsesLoaded = true;
            sortResponses(post);
        } else {
            $("p.more a", post).click();
            sortWhenLoaded(post);
        }
    }
});

function sortWhenLoaded(post)
{
    setTimeout(function(){
        if($(".loadingResponses", post).length <= 0 && !responsesLoaded)
        {
            sortResponses(post);
        } else {
            sortWhenLoaded(post);
        }
    }, 200);
}

function sortResponses(post)
{
    var posts = sortPostsByVotes($("ul.sub > li", post));
            
    $("ul.sub > li", post).remove();
    $("ul.sub", post).append(posts);

    $("html, body").animate({scrollTop: ($("ul.sub", post).offset().top - 100) + "px"});

    responsesLoaded = true;
}

function sortPostsByVotes(selector)
{
    if(!selector instanceof jQuery) selector = $(selector);
    var posts = selector.sort(function(a, b){
        var a_votes = new String($(a).find("p.vC b span").html());
        var b_votes = new String($(b).find("p.vC b span").html());
        
        if(a_votes != "0") a_votes = a_votes.substr(1);
        if(b_votes != "0") b_votes = b_votes.substr(1);
        
        var a_pluses = parseInt(a_votes);
        var b_pluses = parseInt(b_votes);
        
        if(a_pluses > b_pluses)
        {
            return -1;
        } else {
            return 1;
        }
    });
    
    return posts;
}

function isOnSinglePostPage()
{
    return location.href.substr(0, 24) == "http://www.wykop.pl/wpis";
}

function isOnTagPage()
{
    return location.href.substr(0, 23) == "http://www.wykop.pl/tag";
}

function isOnUserPage()
{
    return location.href.substr(0, 26) == "http://www.wykop.pl/ludzie";
}
