// ==UserScript==
// @name         Ao3 Only Show Primary Pairing
// @namespace    https://greasyfork.org/en/users/36620
// @version      1
// @description  Hides works where specified pairing isn't the first listed.
// @author       Modified by Neeve, originally by scriptfairy
// @include      http://archiveofourown.org/*
// @include      https://archiveofourown.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377386/Ao3%20Only%20Show%20Primary%20Pairing.user.js
// @updateURL https://update.greasyfork.org/scripts/377386/Ao3%20Only%20Show%20Primary%20Pairing.meta.js
// ==/UserScript==

/* CONFIG
   keep a plaintext file of your config because they will not be saved when the script updates */

 
var relationships = ['Jeon Jungkook/Kim Taehyung | V','taekook','Jeon Jungkook | Jungkook/Kim Taehyung | V'];
// the relationship tag you want to see (exact, case-sensitive). replace with your desired pairing.

var characters = [ ];
// the character tags you want to see (exact, case-sensitive) - - ignore this

var relpad = 1;
// you want to see at least one of your relationships within this many relationship tags

var charpad = 5;
// you want to see at least one of your characters within this many character tags

/* END CONFIG */

(function($) {
    $('<style>').text(
        '.workhide{border:1px solid rgb(221,221,221);margin:0.643em 0em;padding:0.429em 0.75em;height:29px;} .workhide .left{float:left;padding-top:5px;} .workhide .right{float:right}'
    ).appendTo($('head'));
    if (relationships.length === 0 && characters.length === 0) {return;}
    var checkfandom = document.createElement('div');
    var fandomlink = $('h2.heading a')[0].href;
    fandomlink = fandomlink.slice(fandomlink.indexOf('tags'));
    $(checkfandom).load('/'+fandomlink+' .parent', function(){
        if ($('ul', checkfandom).text() == "No Fandom") {return;}
        else {
            for(i=0;i<$('.index .blurb').length;i++){
                var tags = $('.index .blurb ul.tags')[i];
                var reltags = $('.relationships', tags).slice(0,relpad); var chartags = $('.characters', tags).slice(0,charpad);
                var temprel = []; var tempchar = [];
                $(reltags).map(function() {
                    temprel.push(this.innerText);
                });
                $(chartags).map(function() {
                    tempchar.push(this.innerText);
                });
                var relmatch = temprel.filter(function(n) {
                    return relationships.indexOf(n) != -1;
                });
                var charmatch = tempchar.filter(function(n) {
                    return characters.indexOf(n) != -1;
                });
                if (relmatch.length === 0 && charmatch.length === 0) {
                    var work = $('.index .blurb')[i];
                    work.style.display = 'none';
                    var button = document.createElement('div');
                    button.setAttribute('class','workhide');
                    button.innerHTML = '<div class="left">This work does not prioritize your preferred tags.</div><div class="right"><button type="button" class="showwork">Show Work</button></div>';
                    $(work).after(button);
                }
            }
            $(document).ready(function(){
                $('.showwork').click(function() {
                    var blurb = $(this).parents('.workhide').prev()[0];
                    $(blurb).removeAttr('style');
                    $(this).parents('.workhide').remove();
                });
            });
        }
    });


})(window.jQuery);