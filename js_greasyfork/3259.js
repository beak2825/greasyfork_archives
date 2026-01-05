// ==UserScript==
// @name       Zwijanie / rozwijanie wątków w komentarzach pod znaleziskami, wersja dla nowego Wykopu (2014)
// @version    0.43
// @description  Dodatek do serwisu wykop.pl: zwijanie / rozwijanie wątków w komentarzach pod znaleziskami (tylko w wykopalisku / na głównej), wersja dla nowego Wykopu (2014)
// @match      http://wykop.pl/*
// @match      http://www.wykop.pl/*
// @exclude    http://www.wykop.pl/ludzie/*
// @copyright  2014, Michał Krawczak
// @namespace https://greasyfork.org/users/3421
// @downloadURL https://update.greasyfork.org/scripts/3259/Zwijanie%20%20rozwijanie%20w%C4%85tk%C3%B3w%20w%20komentarzach%20pod%20znaleziskami%2C%20wersja%20dla%20nowego%20Wykopu%20%282014%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3259/Zwijanie%20%20rozwijanie%20w%C4%85tk%C3%B3w%20w%20komentarzach%20pod%20znaleziskami%2C%20wersja%20dla%20nowego%20Wykopu%20%282014%29.meta.js
// ==/UserScript==

var main = function()
{
    var obrazek_dzienny = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gcNCAoHzjL/owAAAZ9JREFUOMutkz9IAnEUx7+nJ5yBp0MKLuZxFNWJUeDQEuSfoWh3CGowgragybmhyaFJiFyjm1qkFrUpGgItSAtD1Bbpz3BeYIJ4v4b8xXGcYdCbHu/3+X55vPd+DIZEplDmu73+LABwNmslEZZUM46hCSEEDMMglS3Gb2qvB2/qp6AH3by9HhI9yb21BZmyPwa0sHN8mau2lAh+iSmvK5/eWo5SzU8HZmKva+wRAFpKZ9rMBAAsAJDKFuNG8biDa8SCvkAs6AuMO7iG/q3aUiKpbDEOACwA3NReD4zi1Xm/uLE0rQ1K4nmpUXv/6PopM9DIbKZQ5k+uqoKZmA6KEKIZTd7UTyFTKDtZuioa8u6KIAPY1K/q20gDIET2zwitd3v9GdYwZEKB+OLkxHY08AwAR7l7n3z91KSMfv0WzmatmN0Fw0Azy/UMZ7M+WBJhSXXz9jr+GG7eXk+EpTYLACHRkzwvNU/1wIvSWT+8uL0b5HNGg5DoSZ7q2xnlCoceEiEE6a3l6JTXlR9VTAj5x8805Ds7u73+DJ12Iiy1zbgv3anIte17lioAAAAASUVORK5CYII=)";
    var obrazek_nocny = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gcNBwkL5/WndgAAAL9JREFUOMutU7ERwjAMfBlq2CA9NLTZxAWTZCOGyBI0SWfPEAbgaRROBNkBjr/TWbL/33eyLCiA5A7AUctBRG6ogeS8RpKJ70gko+V64p7r6EsmnnjUcE2sODqkTHKjkZ3zaA2SIw4koREck/Tsdklse1Qw2YNka3ewgoVBGyrnjdlszAUvlwQAg6nF5PdCbjlj0AnL+B5ZRKatFh2Ay4JwJnnV/OQYdJ8MUnUa/z7KP30mqbz3HsBh7raITB7vAfPd6H/o40+6AAAAAElFTkSuQmCC)'
    
    var nocny = $('body').hasClass('night');
    var obrazek = nocny? obrazek_nocny: obrazek_dzienny;
    
    var toggle_comment = function(comment_id)
    {
        var comment = $('div[data-id='+comment_id+']');
        var subcomments = comment.next("ul.sub");
        var comment_text = comment.find("div.text");
        var comment_actions = comment.find("div.elements.actions");
        var avatar = comment.find('img.avatar');
        var avatar_container = comment.find('a.profile');
        var top_bar = comment.find("div>div.author");
        
        var is_hidden = (('hide-comment-'+comment_id) in localStorage);
        
        if(is_hidden)
        {
            var show_link = comment.find("a.mkShowComment");
            show_link.detach();
            delete localStorage['hide-comment-'+comment_id];
            subcomments.show('slow');
            comment_text.show('slow');
            comment_actions.show('slow');
            avatar.animate({"width":"40px", "height":"40px"}, "slow");
            avatar_container.animate({"padding-left":"0px"}, "slow");                
        }
        else
        {
            localStorage['hide-comment-'+comment_id] = 'hide';
            comment.find(".unhide").click();
            subcomments.hide('slow');
            comment_text.hide('slow');
            comment_actions.hide('slow');
            avatar.animate({"width":"20px", "height":"20px"}, "slow");
            avatar_container.animate({"padding-left":"20px"}, "slow");       
                
            var show_link = $("<a>(rozwiń wątek)</a>");
            show_link.addClass("mkShowComment")
            top_bar.append(show_link);
            show_link.click(function(){toggle_comment(comment_id);})
        }
        
    }
    
    var add_hiding_buttons = function()
    {
        $(".comments-stream ul.responsive-menu").each(function(index, element)
        {
            var main_comment = $(element).closest("li.iC").children().first();
            var link_li = $("<li>");
            var link = $("<a>").
            click(function()
            {
                toggle_comment(main_comment.attr("data-id"));
            }).
            html("zwiń wątek").
            addClass('affect').addClass('hide').
            attr("href", "javascript:").
            css('background-image', obrazek).
            css('background-repeat', 'no-repeat').
            css('padding-left','20px');
            $(element).append(link_li.append(link));
        })
    }
    
    var hide_comments = function() 
    {
        var comments = $('.comments-stream>.iC>div');
        comments.each(function(index, element)
        {
            var comment_id = $(element).attr('data-id');
            var is_hidden = (('hide-comment-'+comment_id) in localStorage);
            if(is_hidden)
            {
                delete localStorage['hide-comment-'+comment_id];
                toggle_comment(comment_id);
            }
        });
    }
    
    if(document.location.href.indexOf("link") != -1)
    {
        add_hiding_buttons();
        hide_comments();
    }
}

if (typeof $ == 'undefined') {
    if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
        // Firefox
        var $ = unsafeWindow.jQuery;
        main();
    } else {
        // Chrome
        addJQuery(main);
    }
} else {
    // Opera
    main();
}

function addJQuery(callback) {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")()";
    document.body.appendChild(script);
}