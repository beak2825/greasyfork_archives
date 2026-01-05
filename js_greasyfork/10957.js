// ==UserScript==
// @name         Facepunch Rating Fancier
// @namespace    edwardjfox.co.uk
// @version      0.4
// @description  Makes the facepunch ratings look a little fancier
// @author       You
// @include      http*://*facepunch.com/showthread.php?t=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10957/Facepunch%20Rating%20Fancier.user.js
// @updateURL https://update.greasyfork.org/scripts/10957/Facepunch%20Rating%20Fancier.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(".postfoot { padding-bottom: 8px; }"
            + ".ratingsBar { width: 100%; position: absolute; bottom: 0; height: 6px; }"
            + ".ratingBar { float: left; height: 6px; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; }"
            + ".ratingInfoBox { position: absolute; top: -20px; background-color: #fff; padding: 0.2em 0.3em; border: 1px solid #999; } .ratingName, .ratingNumber { display: inline-block; } .ratingNumber { padding-left: 0.2em; } "
            + ".ratingBar.Winner { border-top: 3px solid #EF3A3A; background-color: #F5D879 } "
            + ".ratingBar.Funny { background-color: #F7E175; } "
            + ".ratingBar.Dumb { background-color: #9E641F; } "
            + ".ratingBar.Agree { background-color: #8CCF80; } "
            + ".ratingBar.Disagree { background-color: #FF5356; } "
            + ".ratingBar.Useful { border-bottom: 3px solid #9AB6E6; background-color: #C4C4C4; } "
            + ".ratingBar.Informative { background-color: #6B99C7; } "
            + ".ratingBar.Friendly { background-color: #FF9999; } "
            + ".ratingBar.Late { background-color: #9DC0BE; } "
            + ".ratingBar.Artistic { background-color: #E1AD86; } "
            + ".ratingBar.Programming.King { background-color: #5A5A5A; } "
            + ".ratingBar.Zing { background-color: #F3D343; border: 1px solid #E9C73A; }"
            + ".ratingBar.Mapping.King { border-top: 3px solid #797979; background-color: #FFDE00; }"
            + ".ratingBar.Moustache { background-color: #4F4F4F; }" //Thanks to lavacano for this
            + ".ratingBar.Lua.Helper { background-color: #85B133 }"
            + ".ratingBar.Lua.King { background-color: #425DCE }"
            + ".ratingBar.Smarked { background-color: #81A868 }"
            + ".ratingBar.Optimistic { background: #000; background: -moz-linear-gradient(135deg, #4F78B0, #4BB133 25%, #F5D860 50%, #FA9436 70%, #DC0E09 90%, #4F78B0); background:-webkit-gradient(linear, right top, left bottom, color-stop(0.01, #4F78B0), color-stop(0.25, #4BB133), color-stop(0.5, #F5D860), color-stop(0.7, #FA9436), color-stop(0.9, #DC0E09), color-stop(0.99, #4F78B0)); -webkit-background-size: 96px 100%; }");

var posts = document.querySelectorAll('#posts li');

for(var i = 0; i < posts.length; i++){
    var ratings = posts[i].querySelectorAll('.rating_results span');
    if(ratings){
        var tally = [];
        var total = 0;
        for(var j = 0; j < ratings.length; j++){
            tally.push({
                rating : ratings[j].querySelector('img').getAttribute("title"),
                number : parseInt(ratings[j].querySelector('strong').innerHTML)
            });
            total += tally[j].number;
        }
        if(tally.length > 0){
            var ratingsBarDiv = document.createElement("div"); 
            ratingsBarDiv.className = "ratingsBar";
            posts[i].querySelector('.postfoot').appendChild(ratingsBarDiv)
            ratingsBarDiv =  posts[i].querySelector('.postfoot .ratingsBar');
            for(var j = 0; j < tally.length; j++){
                var ratingBarDiv = document.createElement("div"); 
                ratingBarDiv.className = "ratingBar " + tally[j].rating;
                var width = (tally[j].number / total)*100
                ratingBarDiv.setAttribute("style","width:" + width + "%");
                ratingsBarDiv.appendChild(ratingBarDiv);
            }
        }
    }
}