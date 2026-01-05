// ==UserScript==
// @name         ao3 piped tags simplify
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.3.1
// @description  strips piped relationship or character tags of undesired names
// @author       scriptfairy
// @include      /archiveofourown\.org/.*works.\D/
// @include      /archiveofourown\.org/.*works$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18684/ao3%20piped%20tags%20simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/18684/ao3%20piped%20tags%20simplify.meta.js
// ==/UserScript==

/* CONFIG
 * keep a plaintext file of your config because they will not be saved if the script updates
 */

var names = ['Maedhros', 'Kylo Ren', 'Dean Ambrose'];
// these are the names you want to see if they're part of a piped relationship or character tag (exact, case-sensitive)

/* END CONFIG */

(function($) {
    function rename(tagList) {
        var a, atext, separator, sep1, sep2, before, after;
        for (ri=0;ri<tagList.length;ri++) {
            a = $('a', tagList[ri]);
            atext = a[0].innerText;
            if (atext.indexOf('/') != -1 ) {separator = '/';} else {separator = '&';}
            sep1 = atext.lastIndexOf(separator, atext.indexOf(names[nindex]));
            sep2 = atext.indexOf(separator, atext.indexOf(names[nindex]));
            if (sep1 != -1 && sep2 != -1) {
                before = atext.slice(0, sep1);
                after = atext.slice(sep2);
            }
            else if (sep1 != -1) {
                before = atext.slice(0, sep1+1);
                after = '';
            }
            else if (sep2 != -1) {
                before = '';
                after = atext.slice(sep2);
            }
            else {
                before = '';
                after = '';
            }
            atext = before+names[nindex]+after;
            a[0].innerText = atext.replace('&', ' & ');
            if (a[0].innerText == $(a[0]).parent().next()[0].innerText) {$(a[0]).parent().next()[0].remove();}
            else if (a[0].innerText == $(a[0]).parent().prev()[0].innerText) {$(a[0]).parent().prev()[0].remove();}
        }
    }

    function listFilter(tagList) {
        return tagList.filter(function(index){
            return this.innerText.indexOf(names[nindex]) != -1 && this.innerText.indexOf('|') != -1;
        });
    }

    var characterList =  $('ul.tags .characters');
    var relationshipList = $('ul.tags .relationships');
    var allTagsList = $('ul.tags');
    var characterFilter, relationshipFilter, allTagsFilter;

    for (nindex=0;nindex<names.length;nindex++) {
        characterFilter = listFilter(characterList);
        rename(characterFilter);

        relationshipFilter = listFilter(relationshipList);
        rename(relationshipFilter);
    }
})(window.jQuery);