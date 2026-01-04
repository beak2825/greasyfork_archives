// ==UserScript==
// @name        AO3: highlight tags V2 - shash
// @description Configure tags to be highlighted with different colors
// @namespace   http://greasyfork.org/users/6872-fangirlishness
// @author      Fangirlishness
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @grant       none
// @version     2.3
// @downloadURL https://update.greasyfork.org/scripts/530989/AO3%3A%20highlight%20tags%20V2%20-%20shash.user.js
// @updateURL https://update.greasyfork.org/scripts/530989/AO3%3A%20highlight%20tags%20V2%20-%20shash.meta.js
// ==/UserScript==
/* eslint-env jquery */

// loosely derived from tuff-ghost's ao3 hide some tags (with permission)

(function($) {

/**** CONFIG ********************/

    // add the tag pattern you want to highlight (can appear anywhere in the tag) and the color for each
    // if you only want to highlight tags of a certain kind, start with with the kind of tag, then an exclamation mark, then your text.
    // Possible starting values are "relationships!", "characters!", "freeforms!"

    /*var tagsToHighlight = {"Alternate Universe": "#fda7d1", // pink
                           "Fanart": "#adf7d1", // light green
                           "somethingelse": "blue", // named colors work too
                           "^Hurt": "#038200", // only tags that start with Hurt
                           "Comfort$": "#038200", // only tags that end with Comfort
                           "relationships!Arthur": "red", // relationship tags that contain 'Arthur'
                           }; */
    var tagsToHighlight = {"Intersex Omegas": "#f6b26b",
                           "Boypussy": "#f6b26b",
                           "Vaginal Sex": "#f6b26b",
                           "Cunnilingus":  "#f6b26b",
                           "Hybrids": "#f6b26b",
                           "^Alpha/Beta/Omega Dynamics$": "#c1daf1",
                           "Omega Verse": "#c1daf1",
                           "Exes to Lovers": "#f6b26b",
                           "Vampires": "#f6b26b",
                          };

/********************************/
    $('.blurb ul.tags, .meta .tags ul').each(function() {
        var $list = $(this);
        $list.find('a.tag').each(function() {
            var $tag = $(this);
            var text = $tag.text();
            for (var key in tagsToHighlight) {
                var color = tagsToHighlight[key];
                // parse out tagtype from key and save it as a classname (prepend .)
                if(key.startsWith('relationships!') || key.startsWith('characters!') || key.startsWith('freeforms!') ) {
                    var tagtype = "."+key.substring(0, key.indexOf('!'));
                    key = key.substring(key.indexOf('!')+1);
                }
                // match on key without type
                var pattern = new RegExp(key, "g")
                if(text.match(pattern) != null) {
                    highlightTag($tag, color, tagtype);
                }
            }
        });
    });

    function highlightTag($tag, color, tagtype) {
        // if tagtype is given, color only tags with that class
        if(tagtype) {
            $tag.parent(tagtype).children().first().css('background-color', color);
        }
        else {
            $tag.css('background-color', color);
        }
    }

})(jQuery);
