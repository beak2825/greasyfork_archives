// ==UserScript==
// @name         Bonus Emoticons
// @namespace  Matrix
// @description For adding more emoticons to the More Emoticons script
// @include     *kat.cr/*
// @version      0.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18853/Bonus%20Emoticons.user.js
// @updateURL https://update.greasyfork.org/scripts/18853/Bonus%20Emoticons.meta.js
// ==/UserScript==


$(window).load(function(){
  
	$('.bbedit-smileybar').append('<img title="ReallyHappy" class="cusSmile" alt="reallyhappy" href src="http://s3975.storage.proboards.com/2973975/i/91wqVw0TzhxTSO1BwTdL.gif" />');
	$('.bbedit-smileybar').append('<img title="Wife" class="cusSmile" alt="wife" src="http://freeemoticonsandsmileys.com/animated%20emoticons/Funny%20Animated%20Emoticons/naughy.gif" />');
	$('.bbedit-smileybar').append('<img title="Seculedish" class="cusSmile" alt="seculedish" src="https://yuq.me/users/44/071/4XfpT5ZUBt.gif" />');
	$('.bbedit-smileybar').append('<img title="Love" class="cusSmile" alt="love" src="http://www.createlifeinsims.czo.pl/images/smiles/a_calus2.gif.gif" />');
	$('.bbedit-smileybar').append('<img title="Thiniking" class="cusSmile" alt="thinking" src="http://carbonize.co.uk/Old/Yahoo/basefaces/24.gif" />');
    $('.bbedit-smileybar').append('<img title="Tongue" class="cusSmile" alt="tongue" src="http://yoursmileys.ru/ssmile/tongue/s1532.gif" />');
    $('.bbedit-smileybar').append('<img title="ReallyNaught" class="cusSmile" alt="reallynaughty" src="http://www.rusiczki.net/blog/blogpics/naughty_smiley.gif" />');
    $('.bbedit-smileybar').append('<img title="Handshake" class="cusSmile" alt="handshake" src="http://www.easyfreesmileys.com/smileys/free-fighting-smileys-394.gif" />');
    $('.bbedit-smileybar').append('<img title="Tub" class="cusSmile" alt="tub" src="https://smileyshack.files.wordpress.com/2011/01/ssex_sex022.gif" />');
    $('.bbedit-smileybar').append('<img title="Love2" class="cusSmile" alt="love2" src="http://www.easyfreesmileys.com/smileys/free-sexy-smileys-949.gif" />');
    $('.bbedit-smileybar').append('<img title="Support" class="cusSmile" alt="support" src="http://www.yerbaherba.pl/images/smilies/przytul_.gif" />');
    $('.bbedit-smileybar').append('<img title="Hug" class="cusSmile" alt="hug" src="http://s19.rimg.info/ba094134956a07773f4acf04cd8ba737.gif" />');
    $('.bbedit-smileybar').append('<img title="Faint" class="cusSmile" alt="faint" src="http://forums.somd.com/images/smilies/faint.gif"  />');
	$('.bbedit-smileybar').append('<img title="Rofl" class="cusSmile" alt="rofl" src="http://www.mysmiley.net/imgs/smile/happy/happy0071.gif" />');
    $('.bbedit-smileybar').append('<img title="Sick" class="cusSmile" alt="sick" src="http://s15.rimg.info/3f40596c35038b0112d154a98673f78b.gif" />');
    $('.bbedit-smileybar').append('<img title="Star Wars" class="cusSmile" alt="starwars" src="http://www.freesmileys.org/smileys/smiley-fc/starwars.gif" />');
    $('.bbedit-smileybar').append('<img title="Magic" class="cusSmile" alt="magic" src="http://www.mysmiley.net/imgs/smile/fighting/fighting0026.gif" />');
    $('.bbedit-smileybar').append('<img title="Movie" class="cusSmile" alt="movie" src="http://i717.photobucket.com/albums/ww173/prestonjjrtr/Smileys/Smiley31-1.gif" />');
    $('.bbedit-smileybar').append('<img title="Scream" class="cusSmile" alt="scream" src="http://www.sherv.net/cm/emoticons/horror/horror-movies-smiley-emoticon.gif" />');
    $('.bbedit-smileybar').append('<img title="Point & Laugh" class="cusSmile" alt="point&laugh" src="http://www.freesmileys.org/smileys/smiley-laughing014.gif" />');
    $('.bbedit-smileybar').append('<img title="Teasing" class="cusSmile" alt="teasing" src="http://www.sherv.net/cm/emoticons/playful/teasing-with-poking-tongue-out-smiley-emoticon.gif" />');
    $('.bbedit-smileybar').append('<img title="No" class="cusSmile" alt="no" src="http://www.sherv.net/cm/emoticons/no/smiley-wagging-his-finger-saying-no-emoticon.gif" />');
    
   
    
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

	$('.cusSmile').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[img]'+ $(this).attr('src') +'[/img]' );})
  
});
