// ==UserScript==
// @name         ao3 hide certain tags
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.3.1
// @description  suppress tags that aren't capitalized
// @author       scriptfairy
// @include      http://archiveofourown.org/*works*
// @include      https://archiveofourown.org/*works*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18655/ao3%20hide%20certain%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/18655/ao3%20hide%20certain%20tags.meta.js
// ==/UserScript==
//
function isCap(str) {
    if (/[\W\d]/.test(str[0])) {return true;}
    else if (str[0] !== str[0].toLowerCase()) {return true;}
    else {return false;}
}
//
(function($) {
    $('<style>').text('.hide {float:right;}').appendTo($('head'));
    //
    var lis = $('.index .tags li.freeforms');
    for (i=0;i<lis.length;i++) {
        var li = lis[i];
        var tagtext = li.innerText;
        if (tagtext.indexOf(" ") == -1 && !isCap(tagtext)) {
            li.style.display = 'none';
        }
        else if (tagtext.indexOf(" ") > -1 && (!isCap(tagtext) || !isCap(tagtext.slice(tagtext.indexOf(" ")+1)))) {
            li.style.display = 'none';
        }
    }
    for (j=0;j<$('.index .blurb').length;j++) {
        var work = $('.index .blurb')[j];
        var worktags = $(work).children('.tags')[0];
        if ($('[style$="display: none;"]', worktags).length > 0) {
            var button = document.createElement('div');
            button.setAttribute('class','hide');
            button.innerHTML = '<button type="button" class="showtag">Show More Tags</button>';
            $(worktags).after(button);
        }
    }
    //
    $(document).ready(function(){
        $('.showtag').click(function() {
            var blurb = $(this).parent().prev()[0];
            console.log(blurb);
            $('[style$="display: none;"]', blurb).removeAttr('style');
            $(this).parent('div').remove();
        });
    });
})(window.jQuery);