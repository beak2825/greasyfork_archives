// ==UserScript==
// @name        Better Follows Tab - mangadex
// @namespace   Violentmonkey Scripts
// @match       https://mangadex.org/follows*
// @grant       none
// @version     1.1
// @author      Slub77
// @description Groups Manga, Adds Cover image, Adds button to hide read chapters
// @downloadURL https://update.greasyfork.org/scripts/408665/Better%20Follows%20Tab%20-%20mangadex.user.js
// @updateURL https://update.greasyfork.org/scripts/408665/Better%20Follows%20Tab%20-%20mangadex.meta.js
// ==/UserScript==

window.imgError = function(image) {
  
    var MangaID = $(image).data("samid")
    var ImgTry = $(image).data("imgtype")
  
    image.onerror = "";
  
    if(ImgTry == "gif") { ImgTry = "jpeg"; }
    else if(ImgTry == "jpeg") { ImgTry = "png"; }
    else if(ImgTry == "png") { ImgTry = "jpg"; }
   
  
    $(image).replaceWith("<img src='https://mangadex.org/images/manga/"+MangaID+"."+ImgTry+"?' data-imgtype='"+ImgTry+"' data-samid='"+MangaID+"' class='samimg' style='width:100px;height:auto;;margin-left:auto;margin-right:auto' onerror='imgError(this);'>")
  
    return true;
}

function AddImages() {
  
  $("a.manga_title.text-truncate").each(function() {
  
  var MangaID = $(this).attr("href").split("/")  
  $(this).prepend("<img src='https://mangadex.org/images/manga/"+MangaID[2]+".gif?' data-imgtype='gif' data-samid='"+MangaID[2]+"' class='samimg' style='width:100px;height:auto;margin-left:auto;margin-right:auto' onerror='imgError(this);'>")
    
  })
  
  
}


function MergeChapterRows() {
  
  var NotFirstRow = false
  
  var LastRealChapter = false;
  
  var MangaTitles = {}
  
  $(".chapter-container > .row.no-gutters").each(function() {
    
    
  if(!NotFirstRow) { NotFirstRow = true} 
    
    else { 
      
    var MangaTrack = $($(this).find(".col-md-9 > div")[0]).data("manga-id")
    
    
    if(MangaTitles[MangaTrack] == undefined) {
          MangaTitles[MangaTrack] = $(this).find(".col-md-9")[0]
        $(this).find(".col-md-9 > div").removeClass("border-bottom")
    }
      
    else {
       var ChildChapter = $(this).find(".col-md-9 > div")
      
       $(ChildChapter).detach().appendTo(MangaTitles[MangaTrack]).removeClass("border-bottom");
      
       $(this).remove();
      
    }

    }
  
  })
  
   $(".chapter-container > .row.no-gutters .col-md-9 > div:first-child").each(function() { 
   
    $(this).css("border-top","1px solid rgba(0, 0, 0, 0.875)")
   
   })
  
  
 AddImages()
  
}

$( document ).ready(function() {
     MergeChapterRows()
  
    $("body").append('<div style="position: fixed; bottom: 10px; right: 50px; overflow-y: auto; border: solid 2px; border-radius: 10px; background-color: #1c1f23; padding: 10px; text-align: center;border-color:white;"><button style="background-color: #1c1f23; color: white; border-radius: 5px; border: solid 1px; padding: 4px;cursor:pointer;display: flex; justify-content: center; align-items: center;" onclick="HideReadSam()"> Toggle Read </button></div>')

});

window.SamHideToggle = true;

window.HideReadSam = function() {
  
  if(SamHideToggle) { 
     $(".chapter-row.no-gutters span.fa-eye").parent().parent().parent().attr('style','display:none !important');
    SamHideToggle = false;   
  }
 else {
  $(".chapter-row.no-gutters span.fa-eye").parent().parent().parent().attr('style','display:flex !important');
   SamHideToggle = true;
  }
  
}

