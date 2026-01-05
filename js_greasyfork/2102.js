// ==UserScript==
// @name        Wykop Rozwijacz
// @description Wystarczy najechać myszą, aby rozwinąć różne treści na Wykopie.
// @namespace   http://www.wykop.pl/ludzie/referant/
// @include     https://*.wykop.pl/*
// @version     1.2.2
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/2102/Wykop%20Rozwijacz.user.js
// @updateURL https://update.greasyfork.org/scripts/2102/Wykop%20Rozwijacz.meta.js
// ==/UserScript==

$(function () {
    var firstCommentShift = 5,
    $bindTextBody = $('#itemsStream, #hotEntriesBox, #upc, .pmStream');
    
    if (!$("#nav").hasClass("absolute")) firstCommentShift += $('#nav').height();
        
    $bindTextBody.on('mouseenter', '.showSpoiler, .show-more, .too-long-pic, .more a.unhide', function () {
        this.click();
    });

    $bindTextBody.on({
        mouseenter: function () {
            timeout = setTimeout($.proxy(function () {
                var $this = $(this);
                this.click();
                $this.displayLoader('komentarze');
                if(!$this.closest('.sub').find('li:first').visible())
                    $this.closest('.sub').displayFirstComment();
            }, this), 200);
            return false;
        },
        mouseleave: function () {
            clearTimeout(timeout);
        }
    }, 'p.more > .affect.ajax');

    $('body').delegate('#newEntriesCounter', 'mouseenter', function () {
        $('#newEntriesCounter a')[0].click();;
        $(this).displayLoader('nowe wpisy');
    });

    $('body').on({
        mouseenter: function () {
            this.click();
        },
        mouseleave: function () {
            this.click();
        }
    }, '.media-content.gif'); 
    
    (function(e) {
    e.fn.displayLoader = function(content) {
       this.html("<div id='paginationLoader' class='rbl-block space text-center mark-bg dnone' style='display: block; cursor: pointer;'><i class='fa fa-spinner fa-spin'></i>  Ładuję " + content + "...</div>");
    };
    e.fn.displayFirstComment = function() {
        $('html, body').animate({
            scrollTop: this.offset().top - firstCommentShift
        }, 200);
    };
    }(jQuery));

    (function(e){e.fn.visible=function(t,n,r){var i=e(this).eq(0),s=i.get(0),o=e(window),u=o.scrollTop(),a=u+o.height(),f=o.scrollLeft(),l=f+o.width(),c=i.offset().top-firstCommentShift,h=c+i.height(),p=i.offset().left,d=p+i.width(),v=t===true?h:c,m=t===true?c:h,g=t===true?d:p,y=t===true?p:d,b=n===true?s.offsetWidth*s.offsetHeight:true,r=r?r:"both";if(r==="both")return!!b&&m<=a&&v>=u&&y<=l&&g>=f;else if(r==="vertical")return!!b&&m<=a&&v>=u;else if(r==="horizontal")return!!b&&y<=l&&g>=f}})(jQuery)
});