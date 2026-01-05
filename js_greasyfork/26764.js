// ==UserScript==
// @name        Amazon requester Customer Interests
// @namespace    https://greasyfork.org/en/users/9054
// @version      0.4
// @author       ikarma
// @description  hotkeys
// @include      https://s3.amazonaws.com/mturk_bulk/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/26764/Amazon%20requester%20Customer%20Interests.user.js
// @updateURL https://update.greasyfork.org/scripts/26764/Amazon%20requester%20Customer%20Interests.meta.js
// ==/UserScript==

var $j = jQuery.noConflict(true);

var Cat = $("p:eq(3)").text();
var Cat = Cat.split(":");
var Categ = Cat[1].trim();


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







$('#asin_info').highlight(Categ);





document.addEventListener( "keydown", kas, false);





function kas(i) {
    if (i.keyCode == 97 ) { //A or npad 1
        $j('input[value="yes"]').eq(0).click();
        $j('input[id="submitButton"]').eq(0).click();
    }
    if (i.keyCode == 98 ) { //S or npad 2
        $j('input[value="no"]').eq(0).click();
        $j('input[id="submitButton"]').eq(0).click();
    }
    if (i.keyCode == 99 ) { //D or npad 3
        $j('input[name="skip"]').eq(0).click();
        $j('input[id="submitButton"]').eq(0).click();
    }

}







