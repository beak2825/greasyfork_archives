// ==UserScript==
// @name         Venue Quality
// @version      1.0
// @description  Hide instructions and a & s or 1 & 2 on number pad
// @author       ikarma
// @include     https://www.mturk.com/mturk/*
// @grant        none
// @namespace https://greasyfork.org/users/9054
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/10365/Venue%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/10365/Venue%20Quality.meta.js
// ==/UserScript==

if ( $("h1:contains('Why Users Get Blocked')").length ){
    var var1 = $(".question-content-wrapper tr:nth-child(2) td:eq(0)").text();
    var var2 = $(".question-content-wrapper tr:nth-child(2) td:eq(1)").text();
    var res = var1.split(":");
    var res2 = var2.split(":");
    var Name = $.trim(res[1].replace("Address",""));
    var Address = $.trim(res[2].replace("City, Region",""));
    var City = $.trim(res[3]);
    var Name2 = $.trim(res2[1].replace("Address",""));
    var Address2 = $.trim(res2[2].replace("City, Region",""));
    var City2 = $.trim(res2[3]);

} 

var requesterName = $( 'tr:contains(Requester:)' ).last().children().first().next().text().trim();

// Style Sheet
var sheet = document.createElement('style');
sheet.innerHTML = ".highlight { font-weight: bold; background-color: yellow; font-size: 110%;}";
document.body.appendChild(sheet);

/*

highlight v5

Highlights arbitrary terms.

<http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:jb@eaio.com>

*/

jQuery.fn.highlight = function(pat) {
    function innerHighlight(node, pat) {
        var skip = 0;
        if (node.nodeType == 3) {
            var pos = node.data.toUpperCase().indexOf(pat);
            pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = 'highlight';
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pat.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pat);
            }
        }
        return skip;
    }
    return this.length && pat && pat.length ? this.each(function() {
        innerHighlight(this, pat.toUpperCase());
    }) : this;
};

jQuery.fn.removeHighlight = function() {
    return this.find("span.highlight").each(function() {
        this.parentNode.firstChild.nodeName;
        with (this.parentNode) {
            replaceChild(this.firstChild, this);
            normalize();
        }
    }).end();
};
// end of plugin

// highlight matches
if(Name == Name2){$('.question-content-wrapper').highlight(Name);}
if(Address == Address2){$('.question-content-wrapper').highlight(Address);}
if(City == City2){$('.question-content-wrapper').highlight(City);}

if ( $("h1:contains('Is this Event family friendly')").length ){
    $('.question-content-wrapper').highlight("child");
    $('.question-content-wrapper').highlight("kid");
    $('.question-content-wrapper').highlight("family");
}

if ( $("h1:contains('Does this Event contain Adult Content')").length ){
    $('.question-content-wrapper').highlight("child");
    $('.question-content-wrapper').highlight("kid");
    $('.question-content-wrapper').highlight("family");
}

// hide instructions, listen for keypress
if ( requesterName == 'Venue Quality' ) {
    $(".overview-wrapper").hide();
    $(".overview-wrapper").click(function() {    
        $(".overview-wrapper").toggle();
    });
    $(".question-content-wrapper").click(function() {    
        $(".overview-wrapper").toggle();
    });

    var $j = jQuery.noConflict(true);

    document.addEventListener( "keydown", kas, false);
}

function kas(i) {   
    if ( i.keyCode == 65 || i.keyCode == 97 ) { //A or npad 1
        $j('input[name="Answer_1"]').eq(0).click();
        $j('input[name="/submit"]').eq(0).click(); 
    }
    if ( i.keyCode == 83 || i.keyCode == 98 ) { //S or npad 2
        $j('input[name="Answer_1"]').eq(1).click(); 
        $j('input[name="/submit"]').eq(0).click(); 
    }

}  




