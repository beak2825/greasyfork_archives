// ==UserScript==
// @name        SGW Menu Filterer & General Helper
// @namespace   greasyfork.org
// @version     1.8.0.1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @include     https://sellers.shopgoodwill.com/*
// @include     http://*shopgoodwill.com*
// @exclude     https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp*
// @exclude     https://sellers.shopgoodwill.com/sellers/fileUpload/*

// @description Adds simple filters to menus on shopgoodwill
// @downloadURL https://update.greasyfork.org/scripts/23447/SGW%20Menu%20Filterer%20%20General%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/23447/SGW%20Menu%20Filterer%20%20General%20Helper.meta.js
// ==/UserScript==
this.$ = window.jQuery.noConflict(true);
var url = document.URL;

if ($('a:contains("View")').length >= 1 && url.toLowerCase().indexOf('customer_service') >= 0) {
  $('a:contains("View")').each(function(){
    $(this).parent().find('input').each(function(){
      if($(this).val().indexOf('View')>=0) {
        $(this).hide();
      }
    });
  });
}

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
      if (selectSingleMatch === true && $(select).children().length === 1) {
        $(select).children().get(0).selected = true;
      }
    });
  });
};

$('.line-clamp').removeClass('line-clamp');

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
$('select[name]').each(function(){
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

// Add an empty anchor instead of having the entire damn description wrapped in an a tag - so that you can ACTUALLY COPY DESCRIPTIONS

$('a[name="des"]').replaceWith("<a name='des'></a>"+$('a[name="des"]').html());

// Color gallery posts to make them stand out

if ($('font:contains("Gallery Image")').length > 0) {
  $('font:contains("Details for")').after(" <span style='font-size:22px; font-weight: bold;'>(GALLERY)</span>");
  $('font:contains("Details for"), font:contains("Tools")').parent().css({'vertical-align' : 'center', 'background-color' : '#11aaff'});
}

// Ditto recycled posts

if ($('td:contains("Recycled: Yes")').length > 0) {
  if ($('a:contains("related items")').length > 0) {
    $('font:contains("Details for")').after(" <span style='font-size:22px; font-weight: bold;'>(RELISTED)</span>");
    $('font:contains("Details for"), font:contains("Tools")').parent().css({'vertical-align' : 'center', 'background-color' : '#ccccdd'});
    $('body').css('background-color', '#eeeeff');
  } else {
    $('font:contains("Details for")').after(" <span style='font-size:22px; font-weight: bold;'>(RECYCLED)</span>");
    $('font:contains("Details for"), font:contains("Tools")').parent().css({'vertical-align' : 'center', 'background-color' : '#ccc'});
    $('body').css('background-color', '#eee');
  }
}

// Also relists

if ($('td:contains("Re-list count:")').not(':contains("count: 0")').length > 0) {
  $('font:contains("Details for"), font:contains("Tools")').parent().css({'vertical-align' : 'center'});
  $('a[href*="viewItem.asp"]').first().after(" <span style='font-size:22px; font-weight: bold;'>(Relist)</span>");
  $('body').css('background-color', '#fff2e0');
}

// Make modifications stand out
if ($('td:contains("Modified:")').length > 0) {
    var myRe = new RegExp('(By:\s)(.*?)\s', 'gim');
    var postedTD = $('td:contains("Posted:")').last();
    var modifiedTD = $('td:contains("Modified:")').last();
    var postedBy = /(By:\s)(.*?)\s/gim.exec(postedTD.text())[2];
    var modifiedBy = /(By:\s)(.*?)\s/gim.exec(modifiedTD.text())[2];
    if (postedBy != modifiedBy) {
        modifiedTD.css('background-color', '#9999ff');
        modifiedTD.html(modifiedTD.html().replace(modifiedBy, "<b>"+modifiedBy+"</b>"));
    }
}

// Parse shipping calculator tags (new style)

if ($('td:contains("{{")').length > 0) {
  $('td:contains("{{")').last().each(function(){
    var myText = $(this).text();
    if (myText.indexOf("=>") >= 0) {
      var myTests = {
        'type' : /.*(gen|guit|art|long|flex|clth|s&l|media|smFlt|medFlt|pickup|OR|---).*/g,
        'weight' : /\[(\d+\.?\d?)\]/g,
        'plusPounds' : /# \(\+(\d+)\)/g,
        'dims' : /\[([\d\.]+x.*)\]/g,
        'plusInches' : /"\(\+(\d+)\)/g,
        'shipWeight' : /=>(\d+)#/g,
        'shipCharge' : /=>\$(\d?\.*\d*)/g,
        'specialOptions' : /(ownBox|noGlassFront|btwCbd)/g,
        'check' : /check:(.*)}}/g
      };
      var myBits = {};
      $.each(myTests, function(testName, thisTest) {
        var newTest = new RegExp(thisTest);
        if (newTest.test(myText) === true) {
          myBits[testName] = thisTest.exec(myText)[1];
        }
      });
//      console.dir(myBits);
      var calcTypes = {
        'gen' : 'General',
        'guit' : 'Guitar',
        'art' : 'Art',
        'long' : 'Long',
        'flex' : 'Flexible',
        'clth' : 'Clothing',
        's&l' : 'Small and light',
        'media' : 'Media',
        'smFlt' : 'Small flat-rate',
        'medFlt' : 'Medium flat-rate',
        'pickup' : 'Pickup only',
        'OR' : 'Override',
        '---' : 'Not calculated',
      };
      var myString = "Calculated as: " + calcTypes[myBits['type']];
      var myLength = Object.keys(myBits).length;
      if (myLength > 1) {
        if (isDefined(myBits['weight'])) {
          myString += '\n';
          myString+= 'Weight: ' + myBits['weight'];
          if (isDefined(myBits['plusPounds'])) {
            myString += ' +' + myBits['plusPounds'];
          }
          myString += ' lbs.';
        }
        if (isDefined(myBits['dims'])) {
          myString += '\n';
          myString+= 'Dimensions: ' + myBits['dims'];
          if (isDefined(myBits['plusInches'])) {
            myString += ' +' + myBits['plusInches']; // TODO: Is it worth writing in what the inches would be?
          }
          myString += "\"";
        }
        if (isDefined(myBits['shipWeight'])) {
          myString += '\n';
          myString+= 'Calculated shipping weight: ' + myBits['shipWeight'];
        }
        if (isDefined(myBits['shipCharge'])) {
          myString += '\n';
          myString+= 'Calculated shipping charge: ' + myBits['shipCharge'];
        }
        if (isDefined(myBits['specialOptions'])) {
          myString += '\n';
          var mySpecialOptions = {
            'ownBox' : 'Ship in item\'s own box',
            'noGlassFront' : 'Item does not have a glass/plexiglass/etc. front',
            'btwCbd' : 'Item should be shipped between cardboard',
          };
          myString+= mySpecialOptions[myBits['specialOptions']];
        }
        if (isDefined(myBits['check'])) {
          myString += '\n';
          myString+= 'Shippability checked by: ' + myBits['check'];
        }
      }
      $('td:contains("{{")').last().attr('title', myString);
//      $('td:contains("{{")').last().append("<b>&nbsp;&nbsp;&nbsp;&lsaquo;&lsaquo;&telrec;&rsaquo;&rsaquo;</b>");
      $('td:contains("{{")').last()[0].innerHTML = "<table id='ges_tagTable'><tr><td>" +  $('td:contains("{{")').last()[0].innerHTML + "</td><td style='padding-left:10px; font-size: 30px;'>&lsaquo;&telrec;&rsaquo;</td></tr></table>";
    }
  });
}

if (url.indexOf('seller_central.asp') > 0) {
  $('#generate_packing_slips').after('<button id="fixSlips">Fix Packing Slips</button>');
  $('#fixSlips').bind('click', function(e){
    e.preventDefault();
    $('strong > br').replaceWith(' ');
    $('p:contains("Thank you for shopping!")').html('<strong>Thank you for shopping with Goodwill/Easter Seals Minnesota!</strong>');
    $('#form1').hide();
    $('table').first().remove();
    $('table:contains("Welcome")').first().remove();
    $('table:contains("Orders Found")').first().remove();
    $('font:contains("Shipping Pack Slips")').hide();
    var today = new Date();
    var todaysDate = (today.getMonth()+1) + '/' + today.getDate() + '/' + today.getFullYear();
    $('td:contains("Ending")').each(function(){
//      $(this).css('background-color', '#f00');
      var dateRe = new RegExp(/\d+\/\d+\/\d+/, 'g');
      var matches = $(this).html().match(dateRe);
//      console.dir(matches);
      $(this).html('<div style="padding: 3px;">Posted: ' + matches[0] + '</div>'
         + '<div style="padding: 3px;">Ended: '+ matches[1] + '</div>'
         + '<div style="padding: 3px;">Paid: '+ matches[2] + '</div>'
         + '<div style="padding: 3px;">Printed: '+ todaysDate + '</div>'
      );
    });
  });
  $('#print_page').remove();
} else if (url.indexOf('newAuctionItem-catsel.asp') >= 0) {
  
} else if (url.indexOf('seller_login_add.asp') >=0) {
  $('input[name="loginpasswd"]').replaceWith('<input name="loginpasswd" size="20" maxlength="20" type="password">');
} else if (url.indexOf('sellers/tools/search.asp') >= 0 || url.indexOf('search/default.asp') >= 0) {
  var urlParams = parse_query_string(url);
  var myLink = $('font:contains("Status") > a');
  var baseURL = $('font:contains("Status") > a').attr('href');

  $.each(urlParams, function(index, value){
    $('input[name="'+index+'"]').val(value);
  });
  myLink.attr('href', baseURL + setupParams());
  
  
  function setupParams() {
    var urlString = '';
    $('input:visible, select:visible').each(function(){
      var myVal = $(this).val();
      if (myVal.length > 0) {
        var myName = $(this).prop('name');
        urlString+= "&"+myName+"="+myVal;
      }
    });
    console.log(urlString);
    return urlString;
  }
  
  $('input').bind('keyup', function(){
    var urlString = setupParams();
    console.log(urlString);
    myLink.attr('href', baseURL + urlString);
  });
}

// create links on the bulk reshelf page

if (url.indexOf('bulk_reshelf.asp' > 0) && $('td:contains("processed")').length > 0) {
    $('td:contains("Item(s)")').last().parent().find('td').each(function(){
        if ($(this).text().indexOf('Item') < 0) {
            $(this).html("<a href='https://sellers.shopgoodwill.com/sellers/tools/zoomItem.asp?ItemID="+$(this).text()+"' target='_blank'>"+$(this).text()+"</a>");
        }
    });
}



function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
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

function isDefined(something) {
  if (typeof something == 'undefined') {
    return false;
  } else if (something === null) {
    return false;
  } else if (something.length < 1) {
    return false;
  }
  
  return true;
}