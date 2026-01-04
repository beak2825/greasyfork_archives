// ==UserScript==
// @name         Voz Pro Copy
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Bạn muốn copy tất cả ảnh trong quote? Muốn copy thread hay nhưng lên hình trông như Trang Hạ vì không copy được format? Thất vọng vì server của thím Tủ? Hãy cài script này để giải quyết mọi vấn đề trên :D
// @author       You
// @match        https://vozforums.com/*.php*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30979/Voz%20Pro%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/30979/Voz%20Pro%20Copy.meta.js
// ==/UserScript==
//emoticons
$('img[src="/images/smilies/Off/sexy_girl.gif"]').attr('alt',':sexy:');
$('img[src="/images/smilies/Off/byebye.gif"]').attr('alt',':byebye:');
$('img[src="/images/smilies/Off/look_down.gif"]').attr('alt',':look_down:');
$('img[src="/images/smilies/Off/burn_joss_stick.gif"]').attr('alt',':stick:');
$('img[src="/images/smilies/Off/adore.gif"]').attr('alt',':adore:');
$('img[src="/images/smilies/Off/nosebleed.gif"]').attr('alt',':nosebleed:');
$('img[src="/images/smilies/Off/beauty.gif"]').attr('alt',':beauty:');
$('img[src="/images/smilies/brick.png"]').attr('alt',':gach:');
$('img[src="/images/smilies/Off/embarrassed.gif"]').attr('alt',':">');
$('img[src="/images/smilies/Off/surrender.gif"]').attr('alt',':surrender:');
$('img[src="/images/smilies/Off/pudency.gif"]').attr('alt',':pudency:');
$('img[src="/images/smilies/Off/too_sad.gif"]').attr('alt',':sosad:');
$('img[src="/images/smilies/Off/nosebleed.gif"]').attr('alt',':chaymau:');
$('img[src="/images/smilies/Off/go.gif"]').attr('alt',':go:');
$('img[src="/images/smilies/Off/sweat.gif"]').attr('alt',':sweat:');
$('img[src="/images/smilies/Off/canny.gif"]').attr('alt',':canny:');
$('img[src="/images/smilies/Off/feel_good.gif"]').attr('alt',':sogood:');
$('img[src="/images/smilies/Off/shame.gif"]').attr('alt',':shame:');
$('img[src="/images/smilies/Off/hungry.gif"]').attr('alt',':hungry:');
$('img[src="/images/smilies/Off/beat_shot.gif"]').attr('alt',':shot:');
$('img[src="/images/smilies/Off/rap.gif"]').attr('alt',':rap:');
$('img[src="/images/smilies/Off/hang.gif"]').attr('alt',':hang:');
$('img[src="/images/smilies/Off/sweet_kiss.gif"]').attr('alt',':*');
$('img[src="/images/smilies/Off/ops.gif"]').attr('alt',':ops:');
$('img[src="/images/smilies/Off/smile.gif"]').attr('alt',':)');
$('img[src="/images/smilies/Off/beat_plaster.gif"]').attr('alt',':plaster:');
$('img[src="/images/smilies/Off/tire.gif"]').attr('alt',':tire:');
$('img[src="/images/smilies/Off/beat_brick.gif"]').attr('alt',':brick:');
$('img[src="/images/smilies/Off/bad_smelly.gif"]').attr('alt',':badsmell:');
$('img[src="/images/smilies/Off/hell_boy.gif"]').attr('alt',':hell_boy:');
$('img[src="/images/smilies/Off/cool.gif"]').attr('alt',':kool:');
$('img[src="/images/smilies/Off/dribble.gif"]').attr('alt',':dribble:');
$('img[src="/images/smilies/Off/waaaht.gif"]').attr('alt',':waaaht:');
$('img[src="/images/smilies/Off/oh.gif"]').attr('alt',':oh:');
$('img[src="/images/smilies/Off/cry.gif"]').attr('alt',':((');
$('img[src="/images/smilies/Off/lay.gif"]').attr('alt','^:)^');
$('img[src="/images/smilies/Off/after_boom.gif"]').attr('alt',':aboom:');
$('img[src="/images/smilies/Off/sad.gif"]').attr('alt',':sad:');
$('img[src="/images/smilies/Off/hug.gif"]').attr('alt',':hug:');
$('img[src="/images/smilies/Off/fix.gif"]').attr('alt',':fix:');
$('img[src="/images/smilies/Off/amazed.gif"]').attr('alt',':amazed:');
$('img[src="/images/smilies/Off/shit.gif"]').attr('alt',':shitty:');
$('img[src="/images/smilies/Off/what.gif"]').attr('alt',':what:');
$('img[src="/images/smilies/Off/cheers.gif"]').attr('alt',':cheers:');
$('img[src="/images/smilies/Off/sleep.gif"]').attr('alt','-_-');
$('img[src="/images/smilies/Off/spam.gif"]').attr('alt',':spam:');
$('img[src="/images/smilies/Off/ah.gif"]').attr('alt',':ah:');
$('img[src="/images/smilies/Off/rofl.gif"]').attr('alt',':rofl:');
$('img[src="/images/smilies/Off/baffle.gif"]').attr('alt',':baffle:');
$('img[src="/images/smilies/Off/choler.gif"]').attr('alt',':choler:');
$('img[src="/images/smilies/Off/doubt.gif"]').attr('alt',':doubt:');
$('img[src="/images/smilies/Off/capture.gif"]').attr('alt',':capture:');
$('img[src="/images/smilies/Off/confident.gif"]').attr('alt',':confident:');
$('img[src="/images/smilies/Off/theft.gif"]').attr('alt',':theft:');
$('img[src="/images/smilies/Off/matrix.gif"]').attr('alt',':matrix:');
$('img[src="/images/smilies/Off/haha.gif"]').attr('alt',':haha:');
$('img[src="/images/smilies/Off/hehe.gif"]').attr('alt',':hehe:');
$('img[src="/images/smilies/Off/smoke.gif"]').attr('alt',':smoke:');
$('img[src="/images/smilies/Off/big_smile.gif"]').attr('alt',':D');
$('img[src="/images/smilies/Off/angry.gif"]').attr('alt',':angry:');
$('img[src="/images/smilies/Off/sos.gif"]').attr('alt',':sos:');
$('img[src="/images/smilies/Off/spiderman.gif"]').attr('alt',':spiderman:');
$('img[src="/images/smilies/Off/boss.gif"]').attr('alt',':boss:');
$('img[src="/images/smilies/Off/still_dreaming.gif"]').attr('alt',':dreaming:');
$('img[src="/images/smilies/Off/confuse.gif"]').attr('alt',':-s');
$('img[src="/images/smilies/Off/bike.gif"]').attr('alt',':bike:');
$('img[src="/images/smilies/Off/misdoubt.gif"]').attr('alt',':misdoubt:');
$('img[src="/images/smilies/Off/mage.gif"]').attr('alt',':mage:');
$('img[src="/images/smilies/Off/bye.gif"]').attr('alt',':bye:');
$('img[src="/images/smilies/Off/phone.gif"]').attr('alt',':phone:');
$('img[src="/images/smilies/Off/lmao.gif"]').attr('alt',':lmao:');
$('img[src="/images/smilies/Off/ot.gif"]').attr('alt',':ot:');
$('img[src="/images/smilies/Off/flame.gif"]').attr('alt',':flame:');
$('img[src="/images/smilies/Off/bang.gif"]').attr('alt',':bang:');
$('img[src="/images/smilies/Off/sure.gif"]').attr('alt',':sure:');
$('img[src="/images/smilies/emos/stupid.gif"]').attr('alt',':stupid:');
$('img[src="/images/smilies/Off/bann.gif"]').attr('alt',':ban:');
$('img[src="/images/smilies/emos/doublegun.gif"]').attr('alt',':doublegun:');
$('img[src="/images/smilies/emos/boom.gif"]').attr('alt',':boom:');
$('img[src="/images/smilies/emos/lol.gif"]').attr('alt',':lol:');
$('img[src="/images/smilies/Off/welcome.gif"]').attr('alt',':welcome:');
$('img[src="/images/smilies/Off/please.gif"]').attr('alt',':please:');
$('img[src="/images/smilies/emos/puke.gif"]').attr('alt',':puke:');
$('img[src="/images/smilies/emos/shit.gif"]').attr('alt',':shit:');
$('img[src="/images/smilies/emos/lovemachine.gif"]').attr('alt',':lovemachine:');
$('img[src="/images/smilies/Off/runrun.gif"]').attr('alt',':runrun:');
$('img[src="/images/smilies/emos/loveyou.gif"]').attr('alt',':loveyou:');
$('img[src="/images/smilies/emos/Birthday.gif"]').attr('alt',':Birthday:');
$('img[src="/images/smilies/emos/no.gif"]').attr('alt',':no:');
$('img[src="/images/smilies/emos/yes.gif"]').attr('alt',':yes:');
$('img[src="/images/smilies/emos/shoot1.gif"]').attr('alt',':shoot1:');
$('img[src="/images/smilies/emos/winner.gif"]').attr('alt',':winner:');
$('img[src="/images/smilies/emos/band.gif"]').attr('alt',':band:');
$('img[src="/images/smilies/biggrin.gif"]').attr('alt',':grin:');
$('img[src="/images/smilies/frown.gif"]').attr('alt',':frown:');
$('img[src="/images/smilies/mad.gif"]').attr('alt',':mad:');
$('img[src="/images/smilies/tongue.gif"]').attr('alt',':p');
$('img[src="/images/smilies/redface.gif"]').attr('alt',':embrass:');
$('img[src="/images/smilies/confused.gif"]').attr('alt',':confused:');
$('img[src="/images/smilies/wink.gif"]').attr('alt',';)');
$('img[src="/images/smilies/rolleyes.gif"]').attr('alt',':rolleyes:');
$('img[src="/images/smilies/cool.gif"]').attr('alt',':cool:');
$('img[src="/images/smilies/eek.gif"]').attr('alt',':eek:');
$('img[src^="http"]').attr('alt',function(){   //images
    var imgadr = $(this).attr('src');
    $(this).attr('alt','[IMG]'+imgadr+'[/IMG]');
});
$('.voz-bbcode-quote td[style="border:1px inset"]').each(function(){   //quotes
    var quotename = $(this).find('strong').text();
    if(quotename!=0){
        var quoteid = $(this).find('a[href]').attr('href');
        if (quoteid!=null){
            quoteid = quoteid.match(/\d*$/);
            $(this).find('div[style="font-style:italic"]').prepend('<span style="font-size:0">[QUOTE='+quotename+';'+quoteid+']</span>').append('<span style="font-size:0">[/QUOTE]</span>');
        }
        else {
            $(this).find('div[style="font-style:italic"]').prepend('<span style="font-size:0">[QUOTE='+quotename+']</span>').append('<span style="font-size:0">[/QUOTE]</span>');
        }
    }
    else{
        $(this).prepend('<span style="font-size:0">[QUOTE]</span>').append('<span style="font-size:0">[/QUOTE]</span>');
    }
});
$(':input').on('paste', function (e) { //manipulate text
    var $el = $(this);
    setTimeout(function () {
        $el.val(function(){
            return this.value.replace(/Originally Posted by.*?View Post\s/g, "").replace(/Quote\:\s/g,"").replace(/Originally Posted by.*\s/g,"").replace(/PHP Code\:\s/g,"").replace(/Code\:\s/g,"");
        });
    });
});
//Advance Mode
$('.voz-post-message b').prepend('<span style="font-size:0">[B]</span>').append('<span style="font-size:0">[/B]</span>'); //bold
$('.voz-post-message i').prepend('<span style="font-size:0">[I]</span>').append('<span style="font-size:0">[/I]</span>'); //italic
$('.voz-post-message u').prepend('<span style="font-size:0">[U]</span>').append('<span style="font-size:0">[/U]</span>'); //underline
$('span[style^="text-decoration: line-through"]').prepend('<span style="font-size:0">[strike]</span>').append('<span style="font-size:0">[/strike]</span>'); //strike
$('.voz-post-message font').each(function(){  //color+size
    var color = $(this).attr('color');
    var size  = $(this).attr('size');
    if(color!=null){
        $(this).prepend('<span style="font-size:0">[COLOR="'+color+'"]</span>').append('<span style="font-size:0">[/COLOR]</span>');
    }
    if(size!=null){
        $(this).prepend('<span style="font-size:0">[SIZE="'+size+'"]</span>').append('<span style="font-size:0">[/SIZE]</span>');
    }
});

$('.voz-post-message div').each(function(){  //align
    var align = $(this).attr('align');
    if(align!=null){
        $(this).prepend('<span style="font-size:0">['+align+']</span>').append('<span style="font-size:0">[/'+align+']</span>');
    }
});
$('.voz-post-message blockquote').prepend('<span style="font-size:0">[INDENT]</span>').append('<span style="font-size:0">[/INDENT]</span>');  //indent
$('.voz-post-message ol[style="list-style-type: decimal"]').prepend('<span style="font-size:0">[LIST=1]</span>').append('<span style="font-size:0">[/LIST]</span>');     //list 1-9
$('.voz-post-message ol[style="list-style-type: lower-alpha"]').prepend('<span style="font-size:0">[LIST=a]</span>').append('<span style="font-size:0">[/LIST]</span>'); //list a-z
$('.voz-post-message ol[style="list-style-type: upper-alpha"]').prepend('<span style="font-size:0">[LIST=A]</span>').append('<span style="font-size:0">[/LIST]</span>'); //list A-Z
$('.voz-post-message ul').prepend('<span style="font-size:0">[LIST]</span>').append('<span style="font-size:0">[/LIST]</span>');                                         //list bullets
$('.voz-post-message ol li,.voz-post-message ul li').prepend('<span style="font-size:0">[*]</span>');                                                                    //separator
$('.voz-post-message a[href]').each(function(){  //link
    var link = $(this).attr('href');
    $(this).prepend('<span style="font-size:0">[URL='+link+']</span>').append('<span style="font-size:0">[/URL]</span>');
});

$('.voz-bbcode-quote pre.alt2').prepend('<span style="font-size:0">[CODE]</span>').append('<span style="font-size:0">[/CODE]</span>');   //code
$('.voz-bbcode-quote div.alt2[dir="ltr"]').prepend('<span style="font-size:0">[PHP]</span>').append('<span style="font-size:0">[/PHP]</span>');   //php
