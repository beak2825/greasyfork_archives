// ==UserScript==
// @name        No spam on disqus
// @description Removes posts that are edited, that have at least that 10 votes and that contain a link at the end.
// @namespace   Violentmonkey Scripts
// @match       *://disqus.com/*
// @grant       none
// @version     1.1
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/435967/No%20spam%20on%20disqus.user.js
// @updateURL https://update.greasyfork.org/scripts/435967/No%20spam%20on%20disqus.meta.js
// ==/UserScript==

/*
Example of innerHTML: 
 HONOR TO RECOMMEND ANOTHER ONE: We enjoyed eating shit. It is a pleasure for us to eat shit ...
 <a href="http://disq.us/url?url=http%3A%2F%2Fzx.eatshit.com%2Fmedia%2FZWaTYJZR8kiuLkDEt6%2F72.gif%3A9L0-i9vigPSijjhFfM29MB8a-FQ&amp;cuid=6024452" 
 rel="nofollow noopener" title="http://zx.eatshit.com/media/ZWaTYJZR8kiuLkDEt6/72.gif"><u><b>Go here</b></u></a>
*/

// Start of the id of posts
const ID_START = "post-";
// Start of the class of posts
const CLASS_START = "post";
// Vote span class
const VOTE_CLASS = "updatable count";
// Message edited span class 
const EDIT_CLASS = "has-edit";
// Minimum number of votes
const SHIT_MIN_VOTE = 10;
// Html ending of spam
const SHIT_END = "</u></a>";
// Spam substrings
const SHIT_SUBS = [ "cuid", "campaign", "bilibilicomics", "queengiphy" ];

function runScript()
{
    var xx = document.getElementsByTagName("LI");
    for (var xi = 0; xi < xx.length; xi++) {   
        var x = xx[xi];
        if (x.id.startsWith(ID_START) && x.className.startsWith(CLASS_START)) {
            var shit_count = 0;
            var shit_text = "";
            // Check if the post ends with shit
            var yy = x.getElementsByTagName("P");
            for (var yi = 0; yi < yy.length; yi++) {
                var y = yy[yi];
                if (y.innerHTML.endsWith(SHIT_END)) {
                    shit_count++;
                    shit_text = y.innerHTML;
                    break;
                }
            }
            // Check if the post contains shit
            var yy = x.getElementsByTagName("P");
            for (var yi = 0; yi < yy.length; yi++) {
                var y = yy[yi];
                for (var i = 0; i < SHIT_SUBS.length; i++) {
                    if (y.innerHTML.indexOf(SHIT_SUBS[i]) > -1) {
                        shit_count++;                        
                        break;
                    }
                }
            }
            // Check if it has the minimum votes
            var yy = x.getElementsByTagName("SPAN");
            for (var yi = 0; yi < yy.length; yi++) {
                var y = yy[yi];
                if (y.className === VOTE_CLASS) {
                    if (parseInt(y.innerHTML) >= SHIT_MIN_VOTE) {
                        shit_count++;                        
                        break;
                    }
                }
            }
            // Check if it is edited
            var yy = x.getElementsByTagName("SPAN");
            for (var yi = 0; yi < yy.length; yi++) {
                var y = yy[yi];
                if (y.className === EDIT_CLASS) {
                    shit_count++;
                    break;
                }
            }
            // Nuke it
            if (shit_count >= 3) {
                //console.log("nuking this shit: " + shit_text);
                //var p = x.parentNode;
                x.remove();
            }
        }
    }
}

document.addEventListener('DOMNodeInserted', runScript, false);
