// ==UserScript==
// @name         Deviantart Emoticons for KAT V2
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Deviantart Emoticons for KAT 2
// @include *kat.cr/*
// @author       TheDels
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20088/Deviantart%20Emoticons%20for%20KAT%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/20088/Deviantart%20Emoticons%20for%20KAT%20V2.meta.js
// ==/UserScript==

$(window).load(function(){
    $('.bbedit-smileybar').append('<img title=":)" class="cusSmile" alt=":)" href src="http://st.deviantart.net/emoticons/s/smile.gif" />');
    $('.bbedit-smileybar').append('<img title=":D" class="cusSmile" alt=":D" src="http://st.deviantart.net/emoticons/b/biggrin.gif" />');
    $('.bbedit-smileybar').append('<img title=":P" class="cusSmile" alt=":P" src="http://st.deviantart.net/emoticons/r/razz.gif" />');
    $('.bbedit-smileybar').append('<img title=";P" class="cusSmile" alt=";P" src="http://st.deviantart.net/emoticons/w/winkrazz.gif" />');
    $('.bbedit-smileybar').append('<img title=";)" class="cusSmile" alt=";)" src="http://st.deviantart.net/emoticons/w/wink.gif" />');
    $('.bbedit-smileybar').append('<img title=":|" class="cusSmile" alt=":|" src="http://st.deviantart.net/emoticons/b/blankstare.gif" />');
    $('.bbedit-smileybar').append('<img title=":(" class="cusSmile" alt=":(" src="http://st.deviantart.net/emoticons/f/frown.gif" />');
    $('.bbedit-smileybar').append('<img title="Cry" class="cusSmile" alt="cry" src="http://st.deviantart.net/emoticons/c/cries.gif" />');
    $('.bbedit-smileybar').append('<img title=":o" class="cusSmile" alt=":o" src="http://st.deviantart.net/emoticons/e/eek.gif" />');
    $('.bbedit-smileybar').append('<img title="^^;" class="cusSmile" alt="^^;" src="http://st.deviantart.net/emoticons/a/animesweat.gif" />');
    $('.bbedit-smileybar').append('<img title="Clap" class="cusSmile" alt="clap" src="http://st.deviantart.net/emoticons/c/clap2.gif" />');
    $('.bbedit-smileybar').append('<img title="Dummy" class="cusSmile" alt="dummy" src="http://st.deviantart.net/emoticons/d/dummy.gif" />');
    $('.bbedit-smileybar').append('<img title="Love" class="cusSmile" alt="love" src="http://st.deviantart.net/emoticons/l/love2.gif"  />');
    $('.bbedit-smileybar').append('<img title="Meow" class="cusSmile" alt="meow" src="http://st.deviantart.net/emoticons/m/meow.gif" />');
    $('.bbedit-smileybar').append('<img title="Sing" class="cusSmile" alt="sing" src="http://st.deviantart.net/emoticons/l/la.gif" />');
    $('.bbedit-smileybar').append('<img title="Nod" class="cusSmile" alt="nod" src="http://st.deviantart.net/emoticons/n/nod.gif" />');
    $('.bbedit-smileybar').append('<img title="Giggle" class="cusSmile" alt="giggle" src="http://st.deviantart.net/emoticons/g/giggle.gif" />');
    $('.bbedit-smileybar').append('<img title="Oops" class="cusSmile" alt="oops" src="http://st.deviantart.net/emoticons/r/redface.gif" />');
    $('.bbedit-smileybar').append('<img title="No" class="cusSmile" alt="no" src="http://st.deviantart.net/emoticons/n/no.gif" />');
    $('.bbedit-smileybar').append('<img title="RAGE" class="cusSmile" alt="rage" src="http://st.deviantart.net/emoticons/r/rage.gif" />');
    $('.bbedit-smileybar').append('<img title="Hug" class="cusSmile" alt="hug" src="http://st.deviantart.net/emoticons/h/hug.gif" />');
    $('.bbedit-smileybar').append('<img title="Favorite" class="cusSmile" alt="fav" src="http://st.deviantart.net/emoticons/p/plusfav.gif" />');
    $('.bbedit-smileybar').append('<img title="Heart" class="cusSmile" alt="heart" src="http://st.deviantart.net/emoticons/h/heart.gif" />');
    $('.bbedit-smileybar').append('<img title="Lonely" class="cusSmile" alt="lonely" src="http://st.deviantart.net/emoticons/l/lonely2.gif" />');
    $('.bbedit-smileybar').append('<img title="Doh" class="cusSmile" alt="doh" src="http://st.deviantart.net/emoticons/d/doh.gif" />');
    $('.bbedit-smileybar').append('<img title="Yawn" class="cusSmile" alt="yawn" src="http://st.deviantart.net/emoticons/y/yawn2.gif" />');
    $('.bbedit-smileybar').append('<img title="Bored" class="cusSmile" alt="bored" src="http://st.deviantart.net/emoticons/b/bored.gif" />');
    $('.bbedit-smileybar').append('<img title="Eyeroll" class="cusSmile" alt="roll" src="http://st.deviantart.net/emoticons/r/rolleyes.gif" />');
    $('.bbedit-smileybar').append('<img title="Stare" class="cusSmile" alt="stare" src="http://st.deviantart.net/emoticons/s/stare.gif" />');
    $('.bbedit-smileybar').append('<img title="Grumpy" class="cusSmile" alt="grump" src="http://st.deviantart.net/emoticons/g/grump.gif" />');
    $('.bbedit-smileybar').append('<img title="NOOOOOOOO" class="cusSmile" alt="nuu" src="http://st.deviantart.net/emoticons/n/nuu.gif" />');
    $('.bbedit-smileybar').append('<img title="Facepalm" class="cusSmile" alt="facepalm" src="http://st.deviantart.net/emoticons/f/facepalm.gif" />');
    $('.bbedit-smileybar').append('<img title="Sad Dummy" class="cusSmile" alt="saddummy" src="http://st.deviantart.net/emoticons/s/saddummy.gif" />');
    $('.bbedit-smileybar').append('<img title="Shifty" class="cusSmile" alt="shifty" src="http://st.deviantart.net/emoticons/s/shifty.gif" />');
    $('.bbedit-smileybar').append('<img title="Crying" class="cusSmile" alt="crying" src="http://st.deviantart.net/emoticons/c/crying.gif" />');
    $('.bbedit-smileybar').append('<img title="Dead" class="cusSmile" alt="dead" src="http://st.deviantart.net/emoticons/d/dead.gif" />');
    $('.bbedit-smileybar').append('<img title="Disbelief" class="cusSmile" alt="disbelief" src="http://st.deviantart.net/emoticons/d/disbelief.gif" />');
    $('.bbedit-smileybar').append('<img title="Oh noes!" class="cusSmile" alt="ohnoes" src="http://st.deviantart.net/emoticons/o/ohnoes.gif" />');
    $('.bbedit-smileybar').append('<img title="Sunglasses" class="cusSmile" alt="sunglasses" src="http://st.deviantart.net/emoticons/c/cool.gif" />');
    $('.bbedit-smileybar').append('<img title="Shrug" class="cusSmile" alt="shrug" src="http://st.deviantart.net/emoticons/s/shrug2.gif" />');
    $('.bbedit-smileybar').append('<img title="Zombie" class="cusSmile" alt="zombie" src="http://st.deviantart.net/emoticons/z/zombie.gif" />');
    jQuery.fn.extend({
        insertAtCaret: function(myValue){
            return this.each(function(i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    var sel = document.selection.createRange();
                    sel.text = myValue;
                    this.focus();
                }
                else if (this.selectionStart || this.selectionStart == '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = startPos + myValue.length;
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
            });
        }
    });

    $('.cusSmile').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[img]'+ $(this).attr('src') +'[/img]' );});
});