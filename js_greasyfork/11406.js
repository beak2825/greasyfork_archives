// ==UserScript==
// @name         Two Lakes Highlight
// @namespace    https://greasyfork.org/en/users/9054
// @version      0.2
// @description  highlight
// @author       ikarma
// @include      https://ni14.crowdcomputingsystems.com/mturk-web/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.1.0.min.js

// @downloadURL https://update.greasyfork.org/scripts/11406/Two%20Lakes%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/11406/Two%20Lakes%20Highlight.meta.js
// ==/UserScript==

$("input[value='Yes']").click();

/*
PLUGIN CODE STARTS ====================================================
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
// PLUGIN CODE ENDS  ===================================================

// Adds Styling Class for Highlighting Text
var sheet = document.createElement('style');
sheet.innerHTML = ".highlight { font-weight: bold; background-color: yellow; font-size: 110%;}";
document.body.appendChild(sheet);
var text = $('h2').text();
var regex = /Does this.*: ?(.*)\?/ig;
var match = regex.exec(text);
var cleanedString = match[1];
for(var i = 0; i < 4; i++)

for(var i = 0; i < 4; i++)
{

    var words = cleanedString.split(" ");

    for(var j = 0; j < words.length; j++)
    {
        // Highlights only first row of each table
        $('td:eq('+i*3+')').highlight(words[j]);
    }
}
