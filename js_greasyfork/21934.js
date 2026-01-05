// ==UserScript==
// @name         [Katcr.co] Original Smileys
// @namespace    pxgamer
// @version      0.5.1
// @description  Adds the original smileys back
// @author       pxgamer
// @include      *katcr.co/community/*
// @include      *pxgamer.github.io/PX-Scripts/ScriptSettings/original_smileys.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/21934/%5BKatcrco%5D%20Original%20Smileys.user.js
// @updateURL https://update.greasyfork.org/scripts/21934/%5BKatcrco%5D%20Original%20Smileys.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
    'use strict';

    let showExtras = GM_getValue("showExtras", "true");
    let showReactions = GM_getValue("showReactions", "true");
    let showDeviantArt = GM_getValue("showDeviantArt", "true");
    let showMenuCommand = GM_getValue("showMenuCommand", "true");

    if (showMenuCommand == 'true') {
        GM_registerMenuCommand( 'Smiley Settings', function(){window.open('https://pxgamer.github.io/PX-Scripts/ScriptSettings/original_smileys.html');} );
    }
    let cTrue = "true";
    //console.log(showExtras + '|' + showReactions);

    let smilies = {
        'smile' : 'https://i.imgur.com/jDCmN5k.gif',
        'biggrin' : 'https://i.imgur.com/Y2IB7c1.gif',
        'lol' : 'https://i.imgur.com/yrmrqBr.gif',
        'titter' : 'https://i.imgur.com/3mUNmP8.gif',
        'titter2' : 'https://i.imgur.com/UQxpJbL.gif',
        'rofl' : 'https://i.imgur.com/BRNDUiY.gif',
        'clap' : 'https://i.imgur.com/vBzTQec.gif',
        'rock' : 'https://i.imgur.com/jNciQTr.gif',
        'pirate' : 'https://i.imgur.com/c0gTgBS.gif',
        'joy' : 'https://i.imgur.com/OUzdHNF.gif',
        'boo' : 'https://i.imgur.com/Rl6QHXw.gif',
        'inlove' : 'https://i.imgur.com/DjKkEX7.gif',
        'wave' : 'https://i.imgur.com/vHrmADf.gif',
        'sad' : 'https://i.imgur.com/xarqUB1.gif',
        'facepalm' : 'https://i.imgur.com/ky63riP.gif',
        'dizzy' : 'https://i.imgur.com/Dab19mK.gif',
        'cry' : 'https://i.imgur.com/31QyqdW.gif',
        'mad' : 'https://i.imgur.com/zZuLIGb.gif',
        'huffy' : 'https://i.imgur.com/e1xCAZp.gif',
        'swear' : 'https://i.imgur.com/Qef0xw8.gif',
        'spy' : 'https://i.imgur.com/GS4Lctd.gif',
        'angry' : 'https://i.imgur.com/OelvgkH.gif',
        'wait' : 'https://i.imgur.com/tkKjFsA.gif',
        'tongue' : 'https://i.imgur.com/Au91JBC.gif',
        'shocked' : 'https://i.imgur.com/qi4A3nr.gif',
        'wink' : 'https://i.imgur.com/ZoWgkuV.gif',
        'nerd' : 'https://i.imgur.com/gu5gvMk.gif',
        'nod' : 'https://i.imgur.com/1Mge3YI.gif',
        'shake' : 'https://i.imgur.com/VKctnGI.gif',
        'cool' : 'https://i.imgur.com/bFSKaxa.gif',
        'punch' : 'https://i.imgur.com/jcSMOIz.gif',
        'yawn' : 'https://i.imgur.com/EItEozy.gif',
        'point' : 'https://i.imgur.com/2S7ahGT.gif',
        'sleep' : 'https://i.imgur.com/16gZbHY.gif',
        'sweat' : 'https://i.imgur.com/gOXCcif.gif',
        'think' : 'https://i.imgur.com/fLaLJRx.gif',
        'drunk' : 'https://i.imgur.com/6amPLB3.gif',
        'finger' : 'https://i.imgur.com/Zcq1str.gif',
        'dull' : 'https://i.imgur.com/5T7B0wl.gif',
        'mute' : 'https://i.imgur.com/S29lZ3e.gif',
        'smirk' : 'https://i.imgur.com/8Bzq4I8.gif',
        'thumbup' : 'https://i.imgur.com/xxtKctj.gif',
        'thumbdown' : 'https://i.imgur.com/bkv4kfO.gif'
    };
    let extras = {
        'smoke' : 'https://pximg.xyz/images/e3f6c9546b0b85138856a654b6acee85.gif',
        'headbang' : 'https://pximg.xyz/images/96c98c900ddcd6c8b14177ffba06ed13.gif',
        'mooning' : 'https://pximg.xyz/images/4bb967650d41ff6bcd58ac203a797235.gif',
        'squirrel' : 'https://pximg.xyz/images/3bd96c8fcc699c381f6263e295ad225b.gif',
        'ninja' : 'https://pximg.xyz/images/0b914e135932cd0da66df267f2d84b34.gif',
        'beer' : 'https://pximg.xyz/images/6ad8bb13eb3b86c55f624073fd229599.gif',
        'drink' : 'https://pximg.xyz/images/8a6854009cf40e59a13fc22da1e2f8ae.gif',
        'cake' : 'https://pximg.xyz/images/9f53064bb76f3774b1c6247453afc715.gif',
        'pizza' : 'https://pximg.xyz/images/7edc71a4e28a5b9aabb6e9aaec406a9a.gif',
        'rain' : 'https://pximg.xyz/images/b7a972fb35d04e321f553f29a31899c8.gif',
        'mail' : 'https://pximg.xyz/images/0637181b7e39d789e56e45806bc6ac9e.gif',
        'music' : 'https://pximg.xyz/images/16457a3f98d886e7ecb1578f954b38c7.gif',
        'phone' : 'https://pximg.xyz/images/2534b7ba848c018453470f35d939abd3.gif',
        'weed' : 'https://pximg.xyz/images/95b0ba9220b7b028454762061b3de42b.gif',
        'mlph' : 'https://pximg.xyz/images/0b1b423c2a1bde8e3d1f50d125c4808b.gif',
        'coffee' : 'https://pximg.xyz/images/b9587160dd9dd695e26583af17287561.gif',
        'puke' : 'https://pximg.xyz/images/bf20c58502857123051dc81c7aa3d9be.gif'
    };
    var reactions = {
        'fb_like' : 'https://pximg.xyz/images/3f1329531b8f6f711a48d2af49087c0a.gif',
        'fb_love' : 'https://pximg.xyz/images/56f517e6f066e780ebf811b7cdea1ad2.gif',
        'fb_haha' : 'https://pximg.xyz/images/9fd8b1149f9849a5ff8bad6a68efe710.gif',
        'fb_yay' : 'https://pximg.xyz/images/c4d463e867cb4cb7b646f90b16ca7dde.gif',
        'fb_wow' : 'https://pximg.xyz/images/29987c9c302f9e384c875072bc8da501.gif',
        'fb_sad' : 'https://pximg.xyz/images/b56edce73736263e324a3a7d70e4ce0d.gif',
        'fb_angry' : 'https://pximg.xyz/images/5084d023faa8af5ee9bacfbfcfea7055.gif'
    };
    var deviantArt = {
        'Smile' : 'https://st.deviantart.net/emoticons/s/smile.gif',
        'Biggrin' : 'https://st.deviantart.net/emoticons/b/biggrin.gif',
        'Tongue' : 'https://st.deviantart.net/emoticons/r/razz.gif',
        'Tongue_wink' : 'https://st.deviantart.net/emoticons/w/winkrazz.gif',
        'Wink' : 'https://st.deviantart.net/emoticons/w/wink.gif',
        'Blankstare' : 'https://st.deviantart.net/emoticons/b/blankstare.gif',
        'Frown' : 'https://st.deviantart.net/emoticons/f/frown.gif',
        'Cry' : 'https://st.deviantart.net/emoticons/c/cries.gif',
        'Eek' : 'https://st.deviantart.net/emoticons/e/eek.gif',
        'Sweat;' : 'https://st.deviantart.net/emoticons/a/animesweat.gif',
        'Clap' : 'https://st.deviantart.net/emoticons/c/clap2.gif',
        'Dummy' : 'https://st.deviantart.net/emoticons/d/dummy.gif',
        'Love' : 'https://st.deviantart.net/emoticons/l/love2.gif',
        'Meow' : 'https://st.deviantart.net/emoticons/m/meow.gif',
        'Sing' : 'https://st.deviantart.net/emoticons/l/la.gif',
        'Nod' : 'https://st.deviantart.net/emoticons/n/nod.gif',
        'Giggle' : 'https://st.deviantart.net/emoticons/g/giggle.gif',
        'Oops' : 'https://st.deviantart.net/emoticons/r/redface.gif',
        'No' : 'https://st.deviantart.net/emoticons/n/no.gif',
        'RAGE' : 'https://st.deviantart.net/emoticons/r/rage.gif',
        'Hug' : 'https://st.deviantart.net/emoticons/h/hug.gif',
        'Favorite' : 'https://st.deviantart.net/emoticons/p/plusfav.gif',
        'Heart' : 'https://st.deviantart.net/emoticons/h/heart.gif',
        'Lonely' : 'https://st.deviantart.net/emoticons/l/lonely2.gif',
        'Doh' : 'https://st.deviantart.net/emoticons/d/doh.gif',
        'Yawn' : 'https://st.deviantart.net/emoticons/y/yawn2.gif',
        'Bored' : 'https://st.deviantart.net/emoticons/b/bored.gif',
        'Eyeroll' : 'https://st.deviantart.net/emoticons/r/rolleyes.gif',
        'Stare' : 'https://st.deviantart.net/emoticons/s/stare.gif',
        'Grumpy' : 'https://st.deviantart.net/emoticons/g/grump.gif',
        'NOOOOOOOO' : 'https://st.deviantart.net/emoticons/n/nuu.gif',
        'Facepalm' : 'https://st.deviantart.net/emoticons/f/facepalm.gif',
        'Sad Dummy' : 'https://st.deviantart.net/emoticons/s/saddummy.gif',
        'Shifty' : 'https://st.deviantart.net/emoticons/s/shifty.gif',
        'Crying' : 'https://st.deviantart.net/emoticons/c/crying.gif',
        'Dead' : 'https://st.deviantart.net/emoticons/d/dead.gif',
        'Disbelief' : 'https://st.deviantart.net/emoticons/d/disbelief.gif',
        'Oh noes!' : 'https://st.deviantart.net/emoticons/o/ohnoes.gif',
        'Sunglasses' : 'https://st.deviantart.net/emoticons/c/cool.gif',
        'Shrug' : 'https://st.deviantart.net/emoticons/s/shrug2.gif',
        'Zombie' : 'https://st.deviantart.net/emoticons/z/zombie.gif',
        'Sneeze' : 'https://st.deviantart.net/emoticons/s/sneeze2.gif',
        'Innocent' : 'https://st.deviantart.net/emoticons/i/innocent.gif',
        'Psychotic' : 'https://st.deviantart.net/emoticons/p/psychotic.gif',
        'Woo Hoo!' : 'https://st.deviantart.net/emoticons/w/woohoo.gif',
        'Head Bang' : 'https://st.deviantart.net/emoticons/h/headbang.gif',
        'Wave' : 'https://st.deviantart.net/emoticons/w/wave1.gif',
        'Boing' : 'https://st.deviantart.net/emoticons/b/boing.gif',
        'Airborne' : 'https://st.deviantart.net/emoticons/a/airborne.gif',
        'Evil Laughter' : 'https://st.deviantart.net/emoticons/m/mwahaha.gif',
        'Plotting' : 'https://st.deviantart.net/emoticons/p/plotting.gif',
        'The Devil' : 'https://st.deviantart.net/emoticons/d/devilish.gif',
        'Blush' : 'https://st.deviantart.net/emoticons/b/blushes.gif',
        'Ashamed' : 'https://st.deviantart.net/emoticons/a/ashamed2.gif',
        'Hhmygod' : 'https://st.deviantart.net/emoticons/o/ohmygod.gif',
        'Oh?' : 'https://st.deviantart.net/emoticons/w/weirdface2.gif',
        'Confused' : 'https://st.deviantart.net/emoticons/c/confuse.gif',
        'What?' : 'https://st.deviantart.net/emoticons/c/confused.gif',
        'Sherlock' : 'https://st.deviantart.net/emoticons/s/sherlock.gif',
        'Hmm' : 'https://st.deviantart.net/emoticons/h/hmm2.gif',
        'Buck-Teeth' : 'https://st.deviantart.net/emoticons/b/bucktooth.gif',
        'Tamper Tantrum' : 'https://st.deviantart.net/emoticons/t/tantrum.gif',
        'Bleh' : 'https://st.deviantart.net/emoticons/b/bleh.gif',
        'Unimpressed' : 'https://st.deviantart.net/emoticons/u/unimpressed.gif',
        'Woot! Woot!' : 'https://st.deviantart.net/emoticons/w/w00t.gif',
        'Excited' : 'https://st.deviantart.net/emoticons/e/excited.gif',
        '#1' : 'https://st.deviantart.net/emoticons/n/number1.gif',
        'Salute' : 'https://st.deviantart.net/emoticons/s/salute.gif',
        'Worship' : 'https://st.deviantart.net/emoticons/w/worships.gif',
        'Yummy!' : 'https://st.deviantart.net/emoticons/c/chewing.gif',
        'Popcorn' : 'https://st.deviantart.net/emoticons/p/popcorn2.gif',
        'Hungry' : 'https://st.deviantart.net/emoticons/h/hungry2.gif',
        'BRUSH YOUR TEETH!' : 'https://st.deviantart.net/emoticons/b/brushteeth.gif',
        'Meditate' : 'https://st.deviantart.net/emoticons/m/meditate.gif',
        'Fear' : 'https://st.deviantart.net/emoticons/f/fear.gif',
        'OMG' : 'https://st.deviantart.net/emoticons/o/omg.gif',
        'Shocked2' : 'https://st.deviantart.net/emoticons/s/shocked.gif',
        'OMFG' : 'https://st.deviantart.net/emoticons/o/omfg.gif',
        'Blush2' : 'https://st.deviantart.net/emoticons/b/blush2.gif',
        'Petting' : 'https://st.deviantart.net/emoticons/p/petting.gif',
        'Handshake' : 'https://st.deviantart.net/emoticons/h/handshake.gif',
        'Happy Tears' : 'https://st.deviantart.net/emoticons/h/happycry2.gif',
        'Flirty' : 'https://st.deviantart.net/emoticons/f/flirty.gif',
        'Drooling' : 'https://st.deviantart.net/emoticons/d/drool.gif',
        'Smoking' : 'https://st.deviantart.net/emoticons/s/smoking.gif',
        'Sad Rain' : 'https://st.deviantart.net/emoticons/r/raincloud.gif',
        'Sarcasm' : 'https://st.deviantart.net/emoticons/s/sarcasm.gif',
        'Sarcastic Clap' : 'https://st.deviantart.net/emoticons/s/sarcasticclap.gif',
        'Slapping' : 'https://st.deviantart.net/emoticons/s/slap.gif',
        'Happy Typer' : 'https://st.deviantart.net/emoticons/t/typerhappy.gif',
        'Dance' : 'https://st.deviantart.net/emoticons/d/dance.gif'
    };

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

    if (cTrue == showExtras) { showExtras = true; }else{ showExtras = false; }
    if (cTrue == showReactions) { showReactions = true; }else{ showReactions = false; }
    if (cTrue == showMenuCommand) { showMenuCommand = true; }else{ showMenuCommand = false; }
    if (cTrue == showDeviantArt) { showDeviantArt = true; }else{ showDeviantArt = false; }

    $('#smileyBox_message div').html('');
    for (var key in smilies) {
        $('#smileyBox_message div').append('<img src="'+smilies[key]+'" align="bottom" alt="'+key+'" title="'+key+'" class="cusSmile" style="cursor: pointer; margin: 1px;" width="19px" heigh="19px">');
    }

    if (showExtras) {
        for (key in extras) {
            $('#smileyBox_message div').append('<img src="'+extras[key]+'" align="bottom" alt="'+key+'" title="'+key+'" class="cusSmile" style="cursor: pointer; margin: 1px;" width="19px" heigh="19px">');
        }
    }
    if (showReactions) {
        for (key in reactions) {
            $('#smileyBox_message div').append('<img src="'+reactions[key]+'" align="bottom" alt="'+key+'" title="'+key+'" class="cusSmile" style="cursor: pointer; margin: 1px;" width="19px" heigh="19px">');
        }
    }
    if (showDeviantArt) {
        for (key in deviantArt) {
            $('#smileyBox_message div').append('<img src="'+deviantArt[key]+'" align="bottom" alt="'+key+'" title="'+key+'" class="cusSmile" style="cursor: pointer; margin: 1px;" width="19px" heigh="19px">');
        }
    }

    $('.cusSmile').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[img width=19 height=19]'+ $(this).attr('src') +'[/img]' );});

    if (location.href.indexOf('ScriptSettings/original_smileys.html') > -1) {
        $('#settings-config').append('<div id="settings-block" style="width: 400px; margin: 0 auto;"><div class="form-group text-left">\
<div class="checkbox">\
<label>\
<input type="checkbox" id="showExtras"> Show Extra Smileys\
</label>\
</div>\
<div class="checkbox">\
<label>\
<input type="checkbox" id="showReactions"> Show Facebook Reactions\
</label>\
</div>\
<div class="checkbox">\
<label>\
<input type="checkbox" id="showDeviantArt"> Show Deviant Art Smileys\
</label>\
</div>\
<div class="checkbox">\
<label>\
<input type="checkbox" id="showMenuCommand"> Show Menu Command\
</label>\
</div>\
</div>\
<button class="btn btn-default" id="save_settings">Save Settings</button></div>');

        $('#showExtras').prop("checked", showExtras);
        $('#showReactions').prop("checked", showReactions);
        $('#showDeviantArt').prop("checked", showDeviantArt);
        $('#showMenuCommand').prop("checked", showMenuCommand);

        $('#save_settings').on('click', function() {
            GM_setValue("showExtras", $('#showExtras').prop( "checked" ).toString());
            GM_setValue("showReactions", $('#showReactions').prop( "checked" ).toString());
            GM_setValue("showDeviantArt", $('#showDeviantArt').prop( "checked" ).toString());
            GM_setValue("showMenuCommand", $('#showMenuCommand').prop( "checked" ).toString());
            $('#settings-block').append('<div style="margin-top: 10px;" class="alert alert-success alert-settings"><h4>Successfully updated your settings.</h4></div>');
            setTimeout(function(){$('.alert-settings').slideUp();}, 2000);
        });
    }

})();
