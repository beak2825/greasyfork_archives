// ==UserScript==
// @name         Deviantart Emoticons for KAT v4
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Deviantart Emoticons for KAT version 4
// @include *kat.cr/*
// @author       TheDels
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20868/Deviantart%20Emoticons%20for%20KAT%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/20868/Deviantart%20Emoticons%20for%20KAT%20v4.meta.js
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
    $('.bbedit-smileybar').append('<img title="Sneeze" class="cusSmile" alt="sneeze" href src="http://st.deviantart.net/emoticons/s/sneeze2.gif" />');
    $('.bbedit-smileybar').append('<img title="Innocent" class="cusSmile" alt="innocent" src="http://st.deviantart.net/emoticons/i/innocent.gif" />');
    $('.bbedit-smileybar').append('<img title="Psychotic" class="cusSmile" alt="psychotic" src="http://st.deviantart.net/emoticons/p/psychotic.gif" />');
    $('.bbedit-smileybar').append('<img title="Woo Hoo!" class="cusSmile" alt="woohoo" src="http://st.deviantart.net/emoticons/w/woohoo.gif" />');
    $('.bbedit-smileybar').append('<img title="Head Bang" class="cusSmile" alt="headbang" src="http://st.deviantart.net/emoticons/h/headbang.gif" />');
    $('.bbedit-smileybar').append('<img title="Wave" class="cusSmile" alt="wave" src="http://st.deviantart.net/emoticons/w/wave1.gif" />');
    $('.bbedit-smileybar').append('<img title="Boing" class="cusSmile" alt="boing" src="http://st.deviantart.net/emoticons/b/boing.gif" />');
    $('.bbedit-smileybar').append('<img title="Airborne" class="cusSmile" alt="airborne" src="http://st.deviantart.net/emoticons/a/airborne.gif" />');
    $('.bbedit-smileybar').append('<img title="Evil Laughter" class="cusSmile" alt="evillaugh" src="http://st.deviantart.net/emoticons/m/mwahaha.gif" />');
    $('.bbedit-smileybar').append('<img title="Plotting" class="cusSmile" alt="plotting" src="http://st.deviantart.net/emoticons/p/plotting.gif" />');
    $('.bbedit-smileybar').append('<img title="The Devil" class="cusSmile" alt="devilish" src="http://st.deviantart.net/emoticons/d/devilish.gif" />');
    $('.bbedit-smileybar').append('<img title="Blush" class="cusSmile" alt="blush" src="http://st.deviantart.net/emoticons/b/blushes.gif" />');
    $('.bbedit-smileybar').append('<img title="Ashamed" class="cusSmile" alt="ashamed" src="http://st.deviantart.net/emoticons/a/ashamed2.gif"  />');
    $('.bbedit-smileybar').append('<img title="Facepalm" class="cusSmile" alt="facepalm" src="http://st.deviantart.net/emoticons/o/ohmygod.gif" />');
    $('.bbedit-smileybar').append('<img title="Oh?" class="cusSmile" alt="oh" src="http://st.deviantart.net/emoticons/w/weirdface2.gif" />');
    $('.bbedit-smileybar').append('<img title="Confused" class="cusSmile" alt="confused" src="http://st.deviantart.net/emoticons/c/confuse.gif" />');
    $('.bbedit-smileybar').append('<img title="What?" class="cusSmile" alt="what" src="http://st.deviantart.net/emoticons/c/confused.gif" />');
    $('.bbedit-smileybar').append('<img title="Sherlock" class="cusSmile" alt="sherlock" src="http://st.deviantart.net/emoticons/s/sherlock.gif" />');
    $('.bbedit-smileybar').append('<img title="Hmm" class="cusSmile" alt="hmm" src="http://st.deviantart.net/emoticons/h/hmm2.gif" />');
    $('.bbedit-smileybar').append('<img title="Buck-Teeth" class="cusSmile" alt="buckteeth" src="http://st.deviantart.net/emoticons/b/bucktooth.gif" />');
    $('.bbedit-smileybar').append('<img title="Tamper Tantrum" class="cusSmile" alt="tampertantrum" src="http://st.deviantart.net/emoticons/t/tantrum.gif" />');
    $('.bbedit-smileybar').append('<img title="Bleh" class="cusSmile" alt="bleh" src="http://st.deviantart.net/emoticons/b/bleh.gif" />');
    $('.bbedit-smileybar').append('<img title="Unimpressed" class="cusSmile" alt="unimpressed" src="http://st.deviantart.net/emoticons/u/unimpressed.gif" />');
    $('.bbedit-smileybar').append('<img title="Woot! Woot!" class="cusSmile" alt="wootwoot" src="http://st.deviantart.net/emoticons/w/w00t.gif" />');
    $('.bbedit-smileybar').append('<img title="Excited" class="cusSmile" alt="excited" src="http://st.deviantart.net/emoticons/e/excited.gif" />');
    $('.bbedit-smileybar').append('<img title="#1" class="cusSmile" alt="#1" src="http://st.deviantart.net/emoticons/n/number1.gif" />');
    $('.bbedit-smileybar').append('<img title="Salute" class="cusSmile" alt="salute" src="http://st.deviantart.net/emoticons/s/salute.gif" />');
    $('.bbedit-smileybar').append('<img title="Worship" class="cusSmile" alt="worship" src="http://st.deviantart.net/emoticons/w/worships.gif" />');
    $('.bbedit-smileybar').append('<img title="Yummy!" class="cusSmile" alt="yummy" src="http://st.deviantart.net/emoticons/c/chewing.gif" />');
    $('.bbedit-smileybar').append('<img title="Popcorn" class="cusSmile" alt="popcorn" src="http://st.deviantart.net/emoticons/p/popcorn2.gif" />');
    $('.bbedit-smileybar').append('<img title="Hungry" class="cusSmile" alt="hungry" src="http://st.deviantart.net/emoticons/h/hungry2.gif" />');
    $('.bbedit-smileybar').append('<img title="BRUSH YOUR TEETH!" class="cusSmile" alt="brushteeth" src="http://st.deviantart.net/emoticons/b/brushteeth.gif" />');
    $('.bbedit-smileybar').append('<img title="Meditate" class="cusSmile" alt="meditate" src="http://st.deviantart.net/emoticons/m/meditate.gif" />');
    $('.bbedit-smileybar').append('<img title="Fear" class="cusSmile" alt="fear" src="http://st.deviantart.net/emoticons/f/fear.gif" />');
    $('.bbedit-smileybar').append('<img title="OMG" class="cusSmile" alt="omg" src="http://st.deviantart.net/emoticons/o/omg.gif" />');
    $('.bbedit-smileybar').append('<img title="Shocked2" class="cusSmile" alt="shocked2" src="http://st.deviantart.net/emoticons/s/shocked.gif" />');
    $('.bbedit-smileybar').append('<img title="OMFG" class="cusSmile" alt="omfg" src="http://st.deviantart.net/emoticons/o/omfg.gif" />');
    $('.bbedit-smileybar').append('<img title="Blush2" class="cusSmile" alt="blush2" src="http://st.deviantart.net/emoticons/b/blush2.gif" />');
    $('.bbedit-smileybar').append('<img title="Petting" class="cusSmile" alt="petting" src="http://st.deviantart.net/emoticons/p/petting.gif" />');
    $('.bbedit-smileybar').append('<img title="Handshake" class="cusSmile" alt="handshake" src="http://st.deviantart.net/emoticons/h/handshake.gif" />');
    $('.bbedit-smileybar').append('<img title="Happy Tears" class="cusSmile" alt="happycry" src="http://st.deviantart.net/emoticons/h/happycry2.gif" />');
    $('.bbedit-smileybar').append('<img title="Flirty" class="cusSmile" alt="flirty" src="http://st.deviantart.net/emoticons/f/flirty.gif" />');
    $('.bbedit-smileybar').append('<img title="Drooling" class="cusSmile" alt="drooling" src="http://st.deviantart.net/emoticons/d/drool.gif" />');
    $('.bbedit-smileybar').append('<img title="Smoking" class="cusSmile" alt="smoking" src="http://st.deviantart.net/emoticons/s/smoking.gif" />');
    $('.bbedit-smileybar').append('<img title="Sad Rain" class="cusSmile" alt="sadrain" src="http://st.deviantart.net/emoticons/r/raincloud.gif" />');
    $('.bbedit-smileybar').append('<img title="Sarcasm" class="cusSmile" alt="sarcasm" src="http://st.deviantart.net/emoticons/s/sarcasm.gif" />');
    $('.bbedit-smileybar').append('<img title="Sarcastic Clap" class="cusSmile" alt="sarcasticclap" src="http://st.deviantart.net/emoticons/s/sarcasticclap.gif" />');
    $('.bbedit-smileybar').append('<img title="Slapping" class="cusSmile" alt="slap" src="http://st.deviantart.net/emoticons/s/slap.gif" />');
    $('.bbedit-smileybar').append('<img title="Happy Typer" class="cusSmile" alt="happytyper" src="http://st.deviantart.net/emoticons/t/typerhappy.gif" />');
    $('.bbedit-smileybar').append('<img title="Dance" class="cusSmile" alt="dance" src="http://st.deviantart.net/emoticons/d/dance.gif" />');
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

    $('.cusSmile').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[img width="20px" height="20px"]'+ $(this).attr('src') +'[/img]' );});
});