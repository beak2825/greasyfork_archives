// ==UserScript==
// @name        The Piratebay Highlighter
// @name:ar     The Piratebay Highlighter
// @namespace   Majed Alotaibi
// @author      ماجد العتيبي
// @description Highlights specific words.
// @description:ar  تمييز كلمات معينة بلون خاص في موقع ذا بايرت بي
// @include     https://thepiratebay.*/s*/*
// @include     https://pirateproxy.*/s*/*
// @include     https://piratebays.*/s*/*
// @include     https://piratebayproxy.*/s*/*
// @include     https://theproxybay.*/s*/*
// @version     1.0
// @icon        
// @require     https://code.jquery.com/jquery-1.12.4.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31554/The%20Piratebay%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/31554/The%20Piratebay%20Highlighter.meta.js
// ==/UserScript==

$(document).ready(function() {                        //عند إكتمال تحميل الصفحة 

//==============================================================================
//تمييز كلمات معينة بلون معين
function Colorize(CellContent, Pattern, FontColor, BackgroundColor) 
{
    var MyRegex = '(.+)('+Pattern+')(.+)';
	var patt = new RegExp(MyRegex, 'i');       
	var isFound = patt.test(CellContent);
	if (isFound === true) { 
		CellContent = CellContent.replace(patt,'$1<span style="color:'+FontColor+'; background-color:'+BackgroundColor+'">$2</span>$3');
	} 
	return CellContent;
}

$('.detName').each(function()
{
  var favorites = ["ETRG", "YIFY", "FitGirl", "Black Box","ShAaNiG","YTS.AG","MkvCage","RARBG","SPARKS","Ganool","-KILLERS","-FUM","-AFG","-LOL","-DIMENSION"]; 

  for (i = 0; i < favorites.length; i++) {
    if ( $(this).html().indexOf( favorites[i] ) > -1 ) {     
      //$(this).css('background-color','#f9edac');   //تغيير لون خلفية الصف
	  var MyRegex = '(.+)('+favorites[i]+')(.+)';
	  var patt = new RegExp(MyRegex, 'i'); 
	  var isFound = patt.test($(this).html());
	  if (isFound === true) { 
		$(this).html($(this).html().replace(patt,'$1<majed style="color:white; border: 1px solid #c11188; font-weight: bold; font-style: italic; background-color:#f62db5">$2</majed>$3'));
	  }	  
      break;	  
    }
  }
  
  //تلوين أرقام الحلقات والجودة وأشياء أخرى
  $(this).html(Colorize($(this).html(),'S\\d\\dE\\d\\d','black','#e4cdfd'));  //ex: S01E04
  $(this).html(Colorize($(this).html(),'720p','white','#2551f8'));
  $(this).html(Colorize($(this).html(),'1080p','white','#2551f8'));
  $(this).html(Colorize($(this).html(),'BluRay','#fff0d5','#402d27'));
  $(this).html(Colorize($(this).html(),'BrRip','#fff0d5','#402d27'));
  $(this).html(Colorize($(this).html(),'HDTV','#fff0d5','#402d27'));
  
  $(this).html(Colorize($(this).html(),'Complete Season','#fff0d5','#723446'));
  $(this).html(Colorize($(this).html(),'Season \\d+ Complete','#fff0d5','#723446'));
  $(this).html(Colorize($(this).html(),'Season \\d+ \\(Complete\\)','#fff0d5','#723446')); //ex: season 1 (Complete)
  $(this).html(Colorize($(this).html(),'Season \\d+ -','#fff0d5','#723446'));     //ex: season 1 -
  $(this).html(Colorize($(this).html(),'season \\d+-\\d+','#fff0d5','#723446'));  //ex: season 1-3
  $(this).html(Colorize($(this).html(),'season \\d+-\\d+','#fff0d5','#723446'));  //ex: season 1-3
  
  $(this).html(Colorize($(this).html(),'Repack','#fff0d5','#402d27'));
  //$(this).html(Colorize($(this).html(),'WebRip','#fff0d5','#402d27'));
  //$(this).html(Colorize($(this).html(),'HDRip','#fff0d5','#402d27'));
  //$(this).html(Colorize($(this).html(),'WEB-DL','#fff0d5','#402d27'));
  //$(this).html(Colorize($(this).html(),'HDCAM','#d46d5c','#402d27'));
});
//=================================================================================================
});