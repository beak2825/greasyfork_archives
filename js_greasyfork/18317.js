// ==UserScript==
// @name         Add extra colors to the old one
// @namespace    Bart
// @author       Boba Fett AKA ElBrado
// @description  Add extra colors to the old ones without having to type the color everytime you wanna add a colored text
// @include      *kat.cr/*
// @version      0.00000002
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/18317/Add%20extra%20colors%20to%20the%20old%20one.user.js
// @updateURL https://update.greasyfork.org/scripts/18317/Add%20extra%20colors%20to%20the%20old%20one.meta.js
// ==/UserScript==


$(window).load(function(){
  
    $('.bbedit-color-menu').append('<li style="background-color:#59724b;" class="bbedit-color-abc" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#d947b2;" class="bbedit-color-cd" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#5460c4;" class="bbedit-color-de" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#c4ba0a;" class="bbedit-color-ef" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#01003c;" class="bbedit-color-fg" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#fd4d50;" class="bbedit-color-jk" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#00ced1;" class="bbedit-color-kl" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#008040;" class="bbedit-color-lm" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#a90b63;" class="bbedit-color-mn" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#213611;" class="bbedit-color-op" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#29ca29;" class="bbedit-color-pq" title=""><span></span><i></i></li>');
	$('.bbedit-color-menu').append('<li style="background-color:#1d9cc6;" class="bbedit-color-qr" title=""><span></span><i></i></li>');

    
jQuery.fn.extend({
insertAtCaret: function(myValue){
  return this.each(function(i) {
    if (document.selection) {
      this.focus();
      var sel = document.selection.createRange();
      sel.text = myValue;
      this.focus();
    }
    else if (this.selectionStart || this.selectionStart == '0') {
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

	$('.bbedit-color-abc').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#59724b"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-cd').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#d947b2"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-de').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#5460c4"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-ef').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#c4ba0a"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-fg').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#01003c"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-jk').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#fd4d50"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-kl').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#00ced1"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-lm').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#008040"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-mn').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#a90b63"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-op').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#213611"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-pq').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#29ca29"]'+ (" ") +'[/color]' );})
    $('.bbedit-color-qr').click(function(){ $('textarea',$(this).closest('form')).insertAtCaret( '[color="#1d9cc6"]'+ (" ") +'[/color]' );})
});