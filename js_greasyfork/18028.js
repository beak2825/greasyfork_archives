// ==UserScript==
// @name        SGW Menu Filterer - DEPRECATED
// @namespace   greasyfork.org
// @version     1.3.1
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include     https://sellers.shopgoodwill.com/*
// @include     http://*shopgoodwill.com*
// @include     *
// @exclude     https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp*
// @exclude     https://sellers.shopgoodwill.com/sellers/fileUpload/*
// @exclude     http://*ebay.com/ws/eBayISAPI.dll*AddItem*

// @description Adds simple filters to menus on shopgoodwill
// @downloadURL https://update.greasyfork.org/scripts/18028/SGW%20Menu%20Filterer%20-%20DEPRECATED.user.js
// @updateURL https://update.greasyfork.org/scripts/18028/SGW%20Menu%20Filterer%20-%20DEPRECATED.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

jQuery.fn.filterByText = function(textbox, selectSingleMatch) {
  return this.each(function() {
    var select = this;
    var options = [];
    $(select).find('option').each(function() {
      options.push({value: $(this).val(), text: $(this).text()});
    });
    $(select).data('options', options);
    $(textbox).bind('change keyup', function() {
      var options = $(select).empty().scrollTop(0).data('options');
      var search = $.trim($(this).val());
      var regex = new RegExp(search,'gi');
 
      $.each(options, function(i) {
        var option = options[i];
        if(option.text.match(regex) !== null) {
          $(select).append(
             $('<option>').text(option.text).val(option.value)
          );
        }
      });
      if (selectSingleMatch === true && 
          $(select).children().length === 1) {
        $(select).children().get(0).selected = true;
      }
    });
  });
};

skipNames = [
  "sortBy",
];
skipIDs = [
  "Month",
  "Day",
  "Year",
  "assignee",
  "CatSellerLogin",
  "relist",
  "duration",
  "time",
];

var selectCount = 0;
$('select').each(function(){
  myNewBox = selectCount + "Box";
  myName = $(this).attr('name');
  if ($(this).not('[id]')) {
    $(this).attr('id', myName);
  }
  var skip = 0;
  $.each(skipNames, function(i, name){
    if (myName.indexOf(name) >= 0) {
      skip++;
    }
  });
  myID = this.id;
  if ($('#' + myID + ' option').length <= 5) {
    skip++;
  } else {
    $.each(skipIDs, function(i, ID){
      if (myID.indexOf(ID) >= 0) {
        skip++;
      }
    });
  }
  if (skip < 1) {
    $(this).before("<div id='" + myNewBox + "C' class='boxContainer'><input id='" + myNewBox + "' type='text' class='filterBox'><span id='" + myNewBox + "T' class='boxText'style='opacity:.75; position: relative; left:-100px; top:-1px; font-size:12px; font-weight: normal;'>(filter)</span></div>");
    $(this).filterByText($('#' + myNewBox), true);
  }
  selectCount++;
});

$('.filterBox').each(function(){
  myID = this.id;
  $(this).css({
    "transform" : "scale(.85,.85)",
    "-ms-transform" : "scale(.85,.85)",
    "-webkit-transform" : "scale(.85,.85)",
    "background-color" : "#F3F3F3",
    "position" : "relative",
    "left" : "-10px",
  });

});

$('.filterBox').click(function(){
  myID = this.id;
  $('#' + myID + 'T').remove();
});

$('.boxText').click(function(){
    myID = this.id.slice(0, -1);
    $(this).remove();
    $('#' + myID).focus();
  });


$('.boxContainer, .boxText').css({
  "margin" : "0px"
});

if ($('font:contains("Gallery Image")').length > 0) {
  $('font:contains("Details for")').after(" <span style='font-size:22px; font-weight: bold;'>(GALLERY)</span>");
  $('font:contains("Details for"), font:contains("Tools")').parent().css({'vertical-align' : 'center', 'background-color' : '#11aaff'});
}



/*
if ($('#txtmsg').length > 0) {
  $('#txtmsg').before("<div id='txtmsgDiv' contenteditable='true' style='width:600px; height: 300px; border: 1px solid #ccc;'></div>");
  $('#txtmsgDiv').bind("keyup", function(){
     $('#txtmsg').val($('#txtmsgDiv').html());
    console.log('a');
  });
  $('#btnPasteTemple').bind("click", function(){
    function nl2br (str, is_xhtml) {   
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';    
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
    }
    var myTimeout = window.setTimeout(function(){
      $('#txtmsgDiv').html(nl2br($('#txtmsg').val()));
    }, 200);
  });
  $('#txtmsg').hide();
}
*/