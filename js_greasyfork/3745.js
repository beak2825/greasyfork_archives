// ==UserScript==
// @name       IMDB Parental Guide
// @version    1.0
// @description  Parents guide on your movie title page.

// @include /^http://www\.imdb\.com/title/tt[0-9]*/\?ref*
// @include /^http://www\.imdb\.com/title/tt[0-9]*/$/
// @include /^http://www\.imdb\.com/title/tt[0-9]*$/
// @copyright  2014+, Jay V
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/4016
// @downloadURL https://update.greasyfork.org/scripts/3745/IMDB%20Parental%20Guide.user.js
// @updateURL https://update.greasyfork.org/scripts/3745/IMDB%20Parental%20Guide.meta.js
// ==/UserScript==


function Tuple(title,rating,text) {
    this.title = title;
    this.rating = rating;
    this.text = text;
}

Tuple.prototype.getTitle  = function() {
    return this.title;
};
Tuple.prototype.getRating = function() {
    return this.rating;
};
Tuple.prototype.getText = function() {
    return this.text;
};

$( document ).ready( getRatings );

function getRatings() {
    $.get( "parentalguide", function( data ) {
        var parsedHTML = $.parseHTML(data);
        var sectiontitles = $('.section',parsedHTML).children('h3');
        var sectionElements =  $('.display', parsedHTML);
        var tuples = [];
        var sectionTitlesTxts = [];
        $.each(sectiontitles,function(i){
            sectionTitlesTxts.push($(this).text());
        });        
        if(sectionElements.length == sectiontitles.length+2)  {
            $.each(sectionElements,function(index) {
                if(index==0 || index == sectionElements.length-1) {
                    //skip first and last sections 
                    return;
                }
                else {
                    var text = $(this).text();
                    if(text.trim().length==0) return;
                    var rating = text.match(/(\d?\d)\/10/);
                    if (rating!=null) rating=rating[1];
                    else rating = 0;
                    tuples.push(new Tuple(sectionTitlesTxts[index-1].trim(),rating,text.trim()));
                }
            });  
        }
        else {
            return;
        }
        renderRatings(tuples);
    });
}

function renderRatings(tuples) {
    var parentalGuideStart = '<div class="aux-content-widget-3 links subnav" div="parentalguide">  <h3><a style="color:inherit!important" href="parentalguide">Parental Guide</a></h3>  <div id="maindetails_quicklinks">';
    var parentalGuideContent = '';
    var ratingStars = ' <div class="star-box-rating-widget"> <div class="rating rating-list" data-starbar-class="rating-list"> <span class="rating-bg">&nbsp;</span> <span class="rating-stars"> ';
    $.each(tuples,function(idx,tuple) {
        parentalGuideContent +=  '<span title="'+tuple.getText().replace(/"/g, '&quot;')+'">' + tuple.getTitle() +'</span>'+ ratingStars;
        var rating = tuple.getRating();
        $.each([1,2,3,4,5,6,7,8,9,10],function(i,value) {
            if(value<=rating) 
                parentalGuideContent += '<a rel="nofollow" class="rating-your"><span>' + value + '</span></a>';
            else 
                parentalGuideContent += '<a rel="nofollow" class><span>' + value + '</span></a>';
        });
        parentalGuideRating = '<span class="rating-rating"><span class="value">' + rating + '</span><span class="grey">/</span><span class="grey">10</span></span>';
        parentalGuideContent += '</span> ' + parentalGuideRating + ' </div> </div>';
    });  
    if(parentalGuideContent!='') {
        var finalContent = parentalGuideStart + parentalGuideContent + ' </div> </div>'
        $('#maindetails_sidebar_bottom').filter(":first").prepend($(finalContent).hide().fadeIn('slow'));
    }    
}