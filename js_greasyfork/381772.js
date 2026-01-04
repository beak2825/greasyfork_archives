/*
 * Author: Sławomir Netteria.NET https://netteria.net
 */
 // ==UserScript==
// @name          Responsive YouTube Video Gallery
// @description   A simple script to embed YouTube videos in a format sliding window. Meets the conditions responsive scaling.
// @include       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @resource      https://netteria.net/myscript/jquery/jqvideoslider/css/jq.video.slider.css
// @version       1.0
// @namespace https://greasyfork.org/users/291504
// @downloadURL https://update.greasyfork.org/scripts/381772/Responsive%20YouTube%20Video%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/381772/Responsive%20YouTube%20Video%20Gallery.meta.js
// ==/UserScript==
(function(a){a.fn.videoOslide=function(f){var g=0;var e='<div class="navitem"><div class="netteria_video_opis" style="width:100% !important; text-align: left !important; margin-top: 8px; margin-bootom: 12px;"> </div><ul>';this.children().each(function(){var i=a(this);g++;if(g==1){e+='<li data-p="'+g+'" class="active"></li>'}else{e+='<li data-p="'+g+'"></li>'}i.addClass("p"+g+"")});e+="</ul></div>";var d=0;var h=0;var c=g;this.children().each(function(){var i=a(this);i.css("z-index",""+g+"");if(c!=g){i.css("display","none");h=i.children().attr("width")}g--});this.append(e);var b=a(".desc_vs").html();a(".netteria_video_opis").html(b);this.css("height","auto !important");this.css("max-width",h+"px");this.css("margin","auto");this.css("width","auto !importnt");a(".navitem > ul > li").on("click",function(){a(".navitem > ul > li").removeClass("active");a(this).addClass("active");a(".videoitem").each(function(){var l=a(this);l.hide();var k=l.children("iframe").attr("src");l.children("iframe").attr("src","");l.children("iframe").attr("src",k)});var j=a(this).attr("data-p");var i=a(".p"+j+" .desc_vs").html();a(".netteria_video_opis").html(i);a(".p"+j).show()});return this.css({})}})(jQuery);