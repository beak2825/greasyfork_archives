// ==UserScript==
// @name         More Emoticons
// @namespace  Matrix
// @description Add more Emoticons on KAT
// @include     *kat.cr/*
// @version      0.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17702/More%20Emoticons.user.js
// @updateURL https://update.greasyfork.org/scripts/17702/More%20Emoticons.meta.js
// ==/UserScript==


$(window).load(function(){
  
	$('.bbedit-smileybar').append('<img title="Smoking" class="cusSmile" alt="smoke" href src="http://www.skype-emoticons.com/images/emoticon-00176-smoke.gif" />');
	$('.bbedit-smileybar').append('<img title="Laughing" class="cusSmile" alt="bigsmile" src="http://www.skype-emoticons.com/images/emoticon-00102-bigsmile.gif" />');
	$('.bbedit-smileybar').append('<img title="Crying" class="cusSmile" alt="crying" src="http://www.skype-emoticons.com/images/emoticon-00106-crying.gif" />');
	$('.bbedit-smileybar').append('<img title="Wondering" class="cusSmile" alt="wondering" src="http://www.skype-emoticons.com/images/emoticon-00112-wondering.gif" />');
	$('.bbedit-smileybar').append('<img title="Talking" class="cusSmile" alt="talking" src="http://www.skype-emoticons.com/images/emoticon-00117-talking.gif" />');
    $('.bbedit-smileybar').append('<img title="Puking" class="cusSmile" alt="puke" src="http://www.skype-emoticons.com/images/emoticon-00119-puke.gif" />');
    $('.bbedit-smileybar').append('<img title="Boom" class="cusSmile" alt="angry" src="http://www.skype-emoticons.com/images/emoticon-00121-angry.gif" />');
    $('.bbedit-smileybar').append('<img title="Party" class="cusSmile" alt="party" src="http://www.skype-emoticons.com/images/emoticon-00123-party.gif" />');
    $('.bbedit-smileybar').append('<img title="Calling" class="cusSmile" alt="call" src="http://www.skype-emoticons.com/images/emoticon-00129-call.gif" />');
    $('.bbedit-smileybar').append('<img title="Devil" class="cusSmile" alt="devil" src="http://www.skype-emoticons.com/images/emoticon-00130-devil.gif" />');
    $('.bbedit-smileybar').append('<img title="Envy" class="cusSmile" alt="envy" src="http://www.skype-emoticons.com/images/emoticon-00132-envy.gif" />');
    $('.bbedit-smileybar').append('<img title="Makeup" class="cusSmile" alt="makeup" src="http://www.skype-emoticons.com/images/emoticon-00135-makeup.gif" />');
    $('.bbedit-smileybar').append('<img title="Whew" class="cusSmile" alt="whew" src="http://www.skype-emoticons.com/images/emoticon-00141-whew.gif"  />');
	
   
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