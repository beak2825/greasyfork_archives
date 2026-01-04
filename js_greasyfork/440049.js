

    // ==UserScript==
    // @name         AO3 clone fic title, author, and summary at bottom
    // @namespace    https://greasyfork.org/en/users/876643-elli-lili-lunch
    // @version      1.0
    // @description  Duplicate the information of fic title, author and summary at the bottom of the page (Note this was an early script in the development of my AO3 Re-read Savior script)
    // @author       Elli-lili-lunch, based off work from scriptfairy
    // @include      /https?://archiveofourown\.org/works/\d+/
    // @require      http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
    // @grant        none
    // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440049/AO3%20clone%20fic%20title%2C%20author%2C%20and%20summary%20at%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/440049/AO3%20clone%20fic%20title%2C%20author%2C%20and%20summary%20at%20bottom.meta.js
    // ==/UserScript==

    (function($) {
        $(document).ready(function() {
        // new attempt
            var summary = $('div.preface .summary').clone();
            $('#feedback').parent().after(summary);
            var author = $('div.preface .byline').clone();
            //$('#feedback').parent().after(author);
            var format = " by "
            //$('#feedback').parent().after(format);
            var title = $('div.preface .title.heading').clone();
            $('#feedback').parent().after(author); + $('#feedback').parent().after(format); + $('#feedback').parent().after(title);
            //document.write("test text") #completely overwrote entire page //more research has been done, looks like this is mostly jquery lol
            var words = $('.meta .stats dl dd.words').clone();
            $('#feedback').parent().after(words);
            //var wordlabel = "Words: "
            $('#feedback').parent().after("Words: ");

        });
    })(window.jQuery);


           // var test = $('div.preface').clone();
           // $('#feedback').parent().after(test);
        // old:
            //var summary = $('div.preface .summary').clone();
            //$('#feedback').parent().after(summary);
            ///var author = $('div.preface .byline').clone();
            //$('#feedback').parent().after(author);
            //var title = $('div.preface .title.heading').clone();
            //$('#feedback').parent().after(title);

            /*
            would be neato frito if upon clicking "bookmark(?) if it was empty, the box would autopopulate with:
                 title by author
                 summary: text

                 ^^ ideal format

            potential: (learned from http://www.tizag.com/javascriptT/javascriptif.php)
            var bookmark_content = //locate variable from AO3 to identify bookmark box contents;

            if(bookmark_content == "null"){
	            document.write("insert formatted reference info now");
            }else{
	            //dont' do anything ig
            }
                     // If the length of the element's string is 0 then display helper message
function notEmpty(elem, helperMsg){
	if(elem.value.length == 0){
		alert(helperMsg);
		elem.focus(); // set the focus to this input
		return false;
	}
	return true;
}

            */

            /* IMPORTANT TO IDENITFY ELEMENTS FROM AO3:
                 words: $('.meta .stats dl dd.words');
                 current bookmark text:
                      <textarea rows="4" id="bookmark_notes" class="observe_textlength"
                      aria-describedby="notes-field-description" name="bookmark[bookmarker_notes]"></textarea>
                 author: $('div.preface .byline')
                 title: $('div.preface .title.heading')


            */



