// ==UserScript==
// @name        AO3: highlight tags V2 mkp config
// @description Configure tags to be highlighted with different colors
// @namespace   http://greasyfork.org/users/6872-fangirlishness
// @author      Fangirlishness
// @require     http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @include     http://archiveofourown.org/*
// @include     https://archiveofourown.org/*
// @grant       none
// @version     2.0
// @downloadURL https://update.greasyfork.org/scripts/454754/AO3%3A%20highlight%20tags%20V2%20mkp%20config.user.js
// @updateURL https://update.greasyfork.org/scripts/454754/AO3%3A%20highlight%20tags%20V2%20mkp%20config.meta.js
// ==/UserScript==
/* eslint-env jquery */

// loosely derived from tuff-ghost's ao3 hide some tags (with permission)

(function($) {

/**** CONFIG ********************/

    // add the tag pattern you want to highlight (can appear anywhere in the tag) and the color for each
    // if you only want to highlight tags of a certain kind, start with with the kind of tag, then an exclamation mark, then your text.
    // Possible starting values are "relationships!", "characters!", "freeforms!"

    var tagsToHighlight = {
        //tag type
			"characters!":"#f9f9f9",
		//representation - queer rep
			"freeforms!Asexual+":"lavender",
			"demisexual+":"lavender",
			"queerplatonic":"lavender",
			"QPR":"lavender",
			"LGBT+":"lavender",
			"bisexual+":"lavender",
			"Polyam+":"lavender",
			"polycule":"lavender",
			"homosexual+":"lavender",
			"gay":"lavender",
			"lesbian":"lavender",
			"pansexual+":"lavender",
			"queer+":"lavender",
			"Aroman+":"honeydew",
			"demiroman+":"honeydew",
			"aroace":"honeydew",
			"agender+":"azure",
			"bigender+":"azure",
			"transgender+":"azure",
			"^Trans+":"azure",
			"genderfluid+":"azure",
			"genderqueer+":"azure",
			"nonbinary":"azure",
			"non-binary":"azure",
			"Intersex+":"azure",
		//representation - nd & disabled rep
			"Autis+":"aliceblue",
			"neurodiver+":"aliceblue",
			"neuroatypical+":"aliceblue",
			"nonverbal+":"aliceblue",
			"disabled":"#c9c9ff", //lavender
			"disability":"#c9c9ff", //lavender
			"deaf+":"#c9c9ff", //lavender
			"blind+":"#c9c9ff", //lavender
			"Sign Language":"#c9c9ff", //lavender
			"echolalia":"aliceblue",
			"mute+":"#c9c9ff", //lavender
			"mutism":"#c9c9ff", //lavender
			"ADHD":"aliceblue",
			"dyslexia":"aliceblue",
		//representation - ethnicity race religion etc
			"jewish":"cornsilk",
			"judaism":"cornsilk",
			"romani":"cornsilk",
			"muslim":"cornsilk",
			"islam":"cornsilk",
			"freeforms!christian.*":"cornsilk",
			"$of color":"cornsilk",
			"latino.*":"cornsilk",
			"latina.*":"cornsilk",
			"mixed-race":"cornsilk",
			"mixed race":"cornsilk",
			"biracial":"cornsilk",
        //warnings - NO THANK YOU
			"Extremely Underage": "#fd0000", //bright red
			"freeforms!shota.*": "#fd0000", //bright red
		//warnings - proceed with caution
			"freeforms!Dead Dove: Do Not Eat": "#BD5959", //dark red
			"freeforms!cheating":"#BD5959", //dark red
			"freeforms!^Infidelity":"#BD5959", //dark red
			"freeforms!^Incest": "#BD5959", //dark red
			"freeforms!^sibling incest": "#BD5959", //dark red
			"freeforms!^parent/child incest": "#BD5959", //dark red
			"freeforms!^father/son incest": "#BD5959", //dark red
			"freeforms!Beastiality": "#BD5959", //dark red
			"freeforms!bestiality": "#BD5959", //dark red
			"freeforms!mpreg": "#BD5959", //dark red
			"rape/non-con": "#BD5959", //dark red
			"freeforms!non-con.*": "#BD5959", //dark red
			"freeforms!infantilism": "#BD5959", //dark red
			"freeforms!watersports": "#BD5959", //dark red
			"freeforms!omorashi": "#BD5959", //dark red
			"freeforms!vore": "#BD5959", //dark red
			"freeforms!cannibalism": "#BD5959", //dark red
		//warnings - sad
			"Unhappy Ending":"lightsteelblue",
			"Sad Ending":"lightsteelblue",
			"Hurt No Comfort":"lightsteelblue",
			"Character Death":"lightsteelblue",
			"animal death":"lightsteelblue",
			"Creator Chose Not To Use Archive Warnings":"lightsteelblue",
			"^unrequited":"lightsteelblue",
			"miscarriage":"lightsteelblue",
			"suicide":"lightsteelblue",
			"self-harm":"lightsteelblue",
			"suicidal":"lightsteelblue",
			"grief/mourning":"lightsteelblue",
        //AUs
			"freeforms!Alternate Universe":"lightcyan",
			"freeforms!AU$":"lightcyan",
			"freeforms!Age Reversal":"lightcyan",
			"freeforms!Rule 63":"lightcyan",
			"freeforms!genderben":"lightcyan",
			"freeforms!raceben":"lightcyan",
			"freeforms!crossover.*":"#b2b2e0",
			"freeforms!fusion":"#b2b2e0",
			"freeforms!wingfic":"lightcyan",
			"freeforms!role reversal":"lightcyan",
			"freeforms!fairy tale elements":"lightcyan",
        //tropes
			"Age Regression/De-Aging":"lightblue",
			"Time Travel":"#dfecdf", //dark sea green 90%
			"Dimension Travel":"#dfecdf", //dark sea green 90%
			"Body Swap":"lightblue",
			"bodyswap":"lightblue",
			"Fake/Pretend":"lightblue",
			"Identity":"lightblue",
			"Fix-It":"lightblue",
			"Multiverse":"#dfecdf", //dark sea green 90%
			"Undercover":"lightblue",
			"Animal Transformation":"lightblue",
			"Amnesia":"lightblue",
			"POV Outsider":"lightblue",
			"outsider pov":"lightblue",
			"soulmate.*":"lightblue",
			"only one bed":"lightblue",
			"roommates":"lightblue",
			"^accidental.*":"lightblue",
			"case fic":"lightblue",
        //mood - positive
			"^fluff":"#e6ffcc", //chartreuse 90%
			"hurt/comfort":"#e6ffcc", //chartreuse 90%
			"happy ending":"#e6ffcc", //chartreuse 90%
			"hopeful ending":"#e6ffcc", //chartreuse 90%
			"comedy":"#e6ffcc", //chartreuse 90%
			"^humor":"#e6ffcc", //chartreuse 90%
			"^humour":"#e6ffcc", //chartreuse 90%
        //mood - negative
			"^angst":"#cce6ff", //dodger blue 90%
			"^whump":"#cce6ff", //dodger blue 90%
        //relationships
			"slow burn":"lightblue",
			"meet cute":"lightblue",
			"enemies to":"lightblue",
			"lovers to":"lightblue",
			"friends to":"lightblue",
			"strangers to":"lightblue",
			"friends with benefits":"lightblue",
			"marriage":"lightblue",
			"bond":"lightblue",
			"found family":"lightblue",
        //format
			"Multimedia Fic":"palegreen",
			"Epistolary":"palegreen",
			"Podfic$":"palegreen",
			"Fanart":"palegreen",
			"5+1":"palegreen",
			"drabble":"palegreen",
			"fanvid":"palegreen",
        //kink & sex - abo
			"Alpha/Beta/Omega":"plum",
			"Mating Cycles/In Heat":"plum",
			"knotting":"plum",
			"^alpha":"plum",
			"^omega":"plum",
        //kink & sex - bdsm
			"kink+":"plum",
			"bdsm":"plum",
			"bondage":"plum",
			"spanking":"plum",
			"impact play":"plum",
		//kink & sex - ds
			"freeforms!dom/sub":"plum",
			"D/s":"plum",
			"Service Top":"plum",
			"^Dom":"plum",
			"gentle dom":"plum",
			"^Sub":"plum",
			"^Switch ":"plum",
			"Subspace":"plum",
			"^submissive":"plum",
			"^dominant":"plum",
        //kink & sex - porn
			"plot what plot":"plum",
			"Porn":"plum",
			"smut":"plum",
			"sex$":"plum",
			"pwp":"plum",
			"orgasm":"plum",
			"vaginal":"plum",
			"anal":"plum",
			"oral":"plum",
			"dirty talk":"plum",
			"sex toys":"plum",
			"fucking machine":"plum",
			"^cock+":"plum",
			"overstimulation":"plum",
			"gangbang":"plum",
			"dumbification":"plum",
			"mindbreaking":"plum",
        //setting
			"Post-Canon":"#c2ad99",
			"Pre-Canon":"#c2ad99",
			"Timeline What Timeline":"#c2ad99",
			"Canon$":"#c2ad99",
			"Series$":"#c2ad99",
			"Pre-Series":"#c2ad99",
			"Post-Series":"#c2ad99",
        //reader insert & pet peeves
			"relationships!Reader":"#BD5959", //dark red
			"relationships!you ":"#BD5959", //dark red
			"relationships!/You/":"#BD5959", //dark red
			"relationships!/Y/N":"#BD5959", //dark red
			"characters!Y/N":"#BD5959", //dark red
			"Reader-insert":"#BD5959", //dark red
			"Modern girl in ":"#BD5959", //dark red
			"freeforms!^bashing":"#BD5959", //dark red
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
                var pattern = new RegExp(key, "gi")
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
