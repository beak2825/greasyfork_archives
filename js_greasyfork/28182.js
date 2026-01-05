// ==UserScript==
// @name         Imgur favorite links
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  makes it easier to favorite a link/image inside a comment
// @author       Niyok
// @match        http://imgur.com/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/28182/Imgur%20favorite%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/28182/Imgur%20favorite%20links.meta.js
// ==/UserScript==

(function() {

 
    function commentsLoaded(){ return $('#comments').hasClass('comments-loaded'); }
    
    var loop = setInterval(function(){
        if(commentsLoaded()){
            injectScript();
            //clearInterval(loop);
            
            //Imgur comments don't load all at once.
            //They load as they need them.  Pagnation and subcomments require loading.
            //The only way to fix this outside of React is to just keep an infinite loop.
        }
    }, 750);











    function injectScript(){
        
        var dom = {
            comments: '#comments .children div.comment',
            commentsLinks: '#comments .children div.comment .linkified a'
        };

        var regex = {
            isImgur: /\/\/.*?imgur\.com\//,
            cleanLink: /imgur.com\/[a-zA-Z0-9]+/
        };




        //loop through all links within comment section
        $(dom.commentsLinks).each(function(){
            var href = $(this).attr('href');

            //reject non-imgur links
            if(!regex.isImgur.test(href))
                return;
            
            //reject already fixed linked
            if($(this).hasClass('favorite-link-added') || $(this).html() === '&nbsp;')
               return;

            //mark it so it doesn't get matched again
            $(this).addClass('favorite-link-added');
               
            //clean up links so they link to the page instead of the image
            href = regex.cleanLink.exec(href);
            href = 'http://'+href;

            //create open button on page
            var $open = $('<a>&nbsp;</a>')
            .attr('href',href)
            .attr('class', 'icon-favorite-outline')
            .attr('target', '_blank');
            $open.css({
                'margin-left': '.5em',
                'color': 'lightcoral',
            });

            //place open button on page
            var $parent = $(this).parent();
            $parent.append($open);
        });


        //TODO:
        //Integrate with the Imgur API.
        //Requires authentication...

        var api = 'https://api.imgur.com/3/';
        var favorite = function(id){
            var url = api+'image/'+id+'/favorite';
            $.get(url, function(){

            });
        };

    }

})();