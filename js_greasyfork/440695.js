// ==UserScript==
// @name        AO3: format tags (fan variation of AO3: highlight tags)
// @description Configure tags to be formatted in different ways based on tag
// @namespace	http://greasyfork.org/users/6872-fangirlishness (original script); https://greasyfork.org/en/users/396532-mkp (variations)
// @author      Fangirlishness (original script); mkp (variations)
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @grant       none
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/440695/AO3%3A%20format%20tags%20%28fan%20variation%20of%20AO3%3A%20highlight%20tags%29.user.js
// @updateURL https://update.greasyfork.org/scripts/440695/AO3%3A%20format%20tags%20%28fan%20variation%20of%20AO3%3A%20highlight%20tags%29.meta.js
// ==/UserScript==
/* eslint-env jquery */

// fangirlishness's original ao3 highlight tags script was loosely derived from tuff-ghost's ao3 hide some tags (with permission). this script is an authorized variation of fangirlishness's ao3 highlight tags v2, meant to provide additional options for the user and is designed to work in conjunction with said script.

(function($) {


/**** FORMAT tags - CONFIG ********************/

    // add the tag pattern you want to format (can appear anywhere in the tag) and the format for each
		// tag patterns use regular expressions; by default matches are case-insensitive 
		// currently supported formatting options: font-weight, font-style, and font color)
	// note that any specific tag pattern can only be given ONE format attribute
		// this can be worked-around by installing additional copies of this script with other formatting options
    // if you only want to format tags of a certain kind, start with with the kind of tag, then an exclamation mark, then your text.
		// Possible starting values are "relationships!", "characters!", "freeforms!"

    var tagsToFormat = {
		// examples - RELATIONSHIP tags
			// COLOR all romantic/sexual relationship tags dark blue
			"relationships!/": "midnightblue",
				// BOLD any tag with your OTP 
				"castiel/dean": "bold",
			// COLOR all platonic relationship tags dark grayish green
			"relationships!&": "darkslategrey",
		// examples - CHARACTER tags 
			// COLOR all character tags dark orange
			"characters!": "darkorange",
		// examples - FREEFORM tags
			// COLOR all freeform tags ending in 'AU' or including the phrase 'alternate universe' dark purple
			"freeforms!AU$": "indigo",
			"alternate universe": "indigo",
				// BOLD your favorite types of AU
				"alternate universe - werewolves": "bold",
				// ITALICIZE your least favorite types of AU
				"alternate universe - no powers": "italic",
			// COLOR all tags starting with 'accidental' or 'accidentally' dark 
			"^accidental.*": "darkgreen",
			// COLOR all tags including the word fluff or variations thereof bright blue
			"fluff.*": "dodgerblue",
		// examples - WARNING tags 
			// BOLD all 'dead dove: do not eat' tags
			"dead dove: do not eat": "bold",
			// ITALICIZE all tags begininng with "implied/referenced"
			"^implied/referenced": "italic",
                        };

/********************************/

    $('.blurb ul.tags, .meta .tags ul').each(function() {
        var $list = $(this);
        $list.find('a.tag').each(function() {
            var $tag = $(this);
            var text = $tag.text();
            for (var key in tagsToFormat) {
                var style = tagsToFormat[key];
                // parse out tagtype from key and save it as a classname (prepend .)
                if(key.startsWith('relationships!') || key.startsWith('characters!') || key.startsWith('freeforms!') ) {
                    var tagtype = "."+key.substring(0, key.indexOf('!'));
                    key = key.substring(key.indexOf('!')+1);
                }
                // match on key without type; make match case-insensitive
                var pattern = new RegExp(key, "gi")
                if(text.match(pattern) != null) {
                    formatTag($tag, style, tagtype);
                }
            }
        });
    });

    function formatTag($tag, style, tagtype) {
// CHANGE FONT WEIGHT
// changes the weight of the font based on your text (i.e., from normal to bold)	
        // if tagtype is given, format only tags with that class
			if(tagtype) {
				$tag.parent(tagtype).children().first().css('font-weight', style);
			}
			else {
				$tag.css('font-weight', style);
			}
// CHANGE FONT STYLE
// changes the style of the font based on your text        
		// if tagtype is given, format only tags with that class
			if(tagtype) {
				$tag.parent(tagtype).children().first().css('font-style', style);
			}
			else {
				$tag.css('font-style', style);
			}
// CHANGE FONT COLOR
// changes the color of the font based on your text        
		// if tagtype is given, format only tags with that class
			if(tagtype) {
				$tag.parent(tagtype).children().first().css('color', style);
			}
			else {
				$tag.css('color', style);
			}
    }

})(jQuery);
