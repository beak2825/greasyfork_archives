// ==UserScript==
// @name        SGW Fixer
// @namespace   https://greasyfork.org
// @include     https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp*
// @include     https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp*
// @include     https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp?state=2
// @include     https://sellers.shopgoodwill.com/sellers/fileUpload/renform-jquery-catsel.asp
// @version     7.2.3.9
// @description Implements numerous improvements to the functionality of the Shopgoodwill seller site.
// @grant       none
// @require     https://greasyfork.org/scripts/23449-gm-api-script/code/GM%20API%20script.js?upDate=2016_09_23
// @require     https://greasyfork.org/scripts/23451-sgw-shelves-cats/code/SGW%20Shelves%20%20Cats.user.js?upDate=2017_08_23
// @require     https://greasyfork.org/scripts/23450-sgw-fixer-users/code/SGW%20Fixer%20-%20Users.js?upDate=2018_02_26a
// @downloadURL https://update.greasyfork.org/scripts/36739/SGW%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/36739/SGW%20Fixer.meta.js
// ==/UserScript==
 
var cyberMondayDate = 27; // Cyber Monday 2017 is November 27th, hence 27;
var cyberMondayAuctionDuration = 7; // If any CM items are posted as auctions, how long should they run?
 
$('*[name]:not([id])').each(function(){
  $(this).attr('id', $(this).attr('name'));
});
 
if ($('input[name="authentic"]').length) {
    $('input[name="authentic"]').attr('checked', true);
}
 
window.addEventListener ("message", receiveMessage, false);
var url = document.URL;
var premium = false;
var baseDuration = 0;
var defaultStartingBid = $('#itemMinimumBid').val();
var defaultCarrier = $('#itemShipMethod').val();
var defaultDuration = $('#itemDuration').val();
 
if (url.indexOf('skip=skip') >= 0) {
    $('input[name="submit"]').trigger('click');
}
 
//$('a:contains("Seller\'s Guide")').replaceWith("<a href='http://sgwsupport.com/portal' target='_blank1'>Seller\'s Guide</a>");
 
 
function receiveMessage (event) {
    var messageJSON;
    try {
        messageJSON = JSON.parse (event.data);
    }
    catch (zError) {
        // Do nothing
    }
    var safeValue = JSON.stringify(messageJSON);
    if (typeof(messageJSON['lastLocation'])!== "undefined") {
      GM_setValue("lastLocation", safeValue);
    } else {
      GM_setValue("storedPresets", safeValue);
    }
}
 
if (url == "https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp?state=2") {
    var myLastLoc = JSON.parse(GM_getValue("lastLocation", ""));
    if (typeof myLastLoc !== "undefined") {
        $('a:contains("Add")').before("<span id='lastLoc' style='font-size:18px; position:relative; top:-15px;'>Location: " + myLastLoc['lastLocation'] + "</span><br>");
        $('a:contains("Add")').attr('href', "https://sellers.shopgoodwill.com/sellers/fileUpload/renform-jquery-catsel.asp");
        $('p').first().before("<p id='lastTitle'><b> " + myLastLoc['lastTitle'] + "</b></p>");
      GM_deleteValue("lastLocation");
    }
} else if (url == "https://sellers.shopgoodwill.com/sellers/fileUpload/renform-jquery-catsel.asp") {
    window.setInterval(function(){
        if (($('.template-download:visible').length > 0) && ($('.template-upload:visible').length <= 0)) {
            $('#btnSubmit').trigger('click');
        }
    }, 20000);
}
 
if (GM_getValue("lastLocation")) {
    myLastLoc = JSON.parse(GM_getValue("lastLocation", ""));
}
 
// this next section gets us all the locations, from the script tag where SGW defines them
 
 
var scripTags = document.getElementsByTagName('script');
var allScripTags = '';
if (scripTags.length > 0) {
    Array.prototype.forEach.call(scripTags, function(el){
        allScripTags += el.outerHTML;
    });
    if (allScripTags.indexOf('jsondata2') >= 0) {
        allScripTags = allScripTags.substring(allScripTags.indexOf('jsondata2'));
        allScripTags = allScripTags.substring(allScripTags.indexOf('['));
        allScripTags = allScripTags.substring(0, allScripTags.indexOf(';'));
    }
}
 
var locations = JSON.parse(allScripTags);
var validLocations = [];
 
locations.forEach(function(locationObject){
//    document.getElementById('locationList').innerHTML += '<li class="filterMenuLi" style="display:none;">'+locationObject.label+'</li>';
    if (locationObject.label.toLowerCase() != 'not assigned') {
        validLocations.push(locationObject.label);
    }
});
 
var validCategories = [];
var categoryIds = {};
 
$.getJSON('https://images.shopgoodwill.com/Catlistjsonbuyer.txt', {}, function(JsonData){
    $.each(JsonData, function(index, object) {
        validCategories.push(object.label);
        categoryIds[object.label] = object.id;
    })
});
 
function format(item) {
    var cell = '';
    cell += item.label;
 
 
    return cell;
}
 
// The name as listed is what the script looks for at the top of the page, as in "Welcome Firstname Lastname".
//      (Any piece of that is fine: "John L", "John Linnell", and "hn Lin" would all pick out John Linnell)
 
 
var thisPoster = "";
var myPosterName = "";
var posterDelay = 0;
 
$.each(posters, function(name, info) { //working 10/27
    re = new RegExp(name,"gi");
    if(re.exec($(".smtext").html())) {
        thisPoster = name.replace(/ /gi,"");
        myPosterName = name;
        console.log(thisPoster);
    }
});
 
var presetTypes = {
      "Title" : "",
      "Category" : "",
      "Store" : "",
      "Shipping Weight" : "",
      "Display Weight" : "",
      "Location" : "",
      "Duration" : "",
      "Starting Bid" : "",
      "BIN Price" : "",
      "Ship Charge" : "",
      "Ship Type" : "",
  //               ^^^   general, guitar, art, lot, long, Media <---- note the capital M!
//      "Ship in own box/between cardboard" : "",
  //                                        ^^^ yes for yes, any other value defaults to no
      "Dimension 1" : "",
      "Dimension 2" : "",
      "Dimension 3" : "",
      "Skip" : "",
      "Owner" : "",
      "Description" : "",
}
 
var cyberMondayPosters = ["Holden"/*collectibles & jewelry*/, "Jackie", "Alicia", "Jacob"];
var welcomeText = $('table:contains("Welcome")').text();
var cyberMondayPoster = false;
$.each(cyberMondayPosters, function(cmIndex, cmPoster) {
    if (welcomeText.indexOf(cmPoster) >= 0) {
//        presetTypes['Cyber Monday'] = "";
        cyberMondayPoster = true;
    }
});
 
if (GM_getValue("storedPresets")) {
  var presets = JSON.parse (GM_getValue("storedPresets"));
  if (!presets.hasOwnProperty('Owner') || presets['Owner'] != thisPoster) {
      presets = {
          "Title" : "",
          "Category" : "",
          "Store" : "",
          "Shipping Weight" : "",
          "Display Weight" : "",
          "Location" : "",
          "Duration" : "",
          "Ship Charge" : "",
          "Ship Type" : "",
      //               ^^^   general, guitar, art, lot, long, Media <---- note the capital M!
//          "Ship in own box/between cardboard" : "",
      //                                        ^^^ yes for yes, any other value defaults to no
          "Dimension 1" : "",
          "Dimension 2" : "",
          "Dimension 3" : "",
          "Skip" : "",
          "Owner" : thisPoster,
//          "Cyber Monday" : "",
          "Description" : "",
     };
  } else {
      if (!presets.hasOwnProperty('Duration')) {
          presets['Duration'] = "";
 
      }
 
  }
} else {
  var presets = {
      "Title" : "",
      "Category" : "",
      "Store" : "",
      "Shipping Weight" : "",
      "Display Weight" : "",
      "Location" : "",
      "Duration" : "",
      "Starting Bid" : "",
      "BIN Price" : "",
      "Ship Charge" : "",
      "Ship Type" : "",
  //               ^^^   general, guitar, art, lot, long, Media <---- note the capital M!
//      "Ship in own box/between cardboard" : "",
  //                                        ^^^ yes for yes, any other value defaults to no
      "Dimension 1" : "",
      "Dimension 2" : "",
      "Dimension 3" : "",
      "Skip" : "",
      "Owner" : thisPoster,
//      "Cyber Monday" : "",
      "Description" : "",
  };
}
 
if(presets['Skip'] == 'skip' || url.indexOf('skip=skip') >= 0) {
//    console.log('Skip==skip');
    if (url.indexOf('newauctionitem-catsel.asp')) {
        document.getElementById('form1').action = document.getElementById('form1').action + '?skip=skip';
    } else {
        $('form').each(function(){
            if ($(this)[0].action.indexOf('?') < 0) {
                $(this)[0].action += '?skip=skip';
            } else {
                $(this)[0].action += '&skip=skip';
            }
        });
    }
 
}
 
 
 
 
var myPresets = "";
 
var presetBox = "<div id='presetBox' style='position:relative; left:15px; display:none;'><b style='font-size:22px;'>Set presets:</b><br><br></div><br>";
$('p:contains("photos are uploaded")').after(presetBox);
 
var presetTimeout = window.setTimeout(function(){
 
    $.each(presetTypes, function(key, value){
        var myVal = presets[key];
        if (typeof myVal == 'undefined' || myVal == 'undefined' || myVal.length < 1) {
            myVal = '';
        }
        if (myVal && myVal.length) {
            myPresets += "<div id='presetSpan" + key + "' class='presetSpan' ><b>" + key + ":</b> " + myVal + "<br></div>";
        }
 
        key2 = "<b>" + key + "</b>"
        if (key == 'Ship Type') {
            key2 += " (guitar, art, long, media, clothing, pickup)";
        } else if (key == "Ship in own box/between cardboard") {
//            key2 = "<b>Own box/cardboard:</b> (yes or blank/no)";
        }
        key2 += ": ";
        if (key == 'Description') {
            $('#presetBox').append('<div id="presetDescription" style="width: 600px; height: 200px; border: 1px solid #bbb; overflow: scroll;" contenteditable=true></div>');
            $('#presetDescription').html(myVal);
        } else {
            $('#presetBox').append("<span id='presetInput" + key + "'>" + key2 + "<input class='presetInput' id='preset" + key + "' value=" + myVal + "><br></span>");
        }
    });
 
 
 
    $('#presetCategory').replaceWith($('#catID').clone().attr('id', 'presetCategory'));
//    $('#presetCategory').autocomplete("search", $('#presetCategory').val());
 
 
 
    $('#presetCategory').autocomplete({
        source: validCategories,
        minLength: 0,
        select: function (event, ui) {
 
            $('#presetCategory').val(ui.item.label);
            //            $('#catid').val(ui.item.id);
            //            $('#catid').val(categoryIds[ui.item.label]);
            console.dir(ui.item);
            $('#presetCategory').blur();
 
 
            return false;
        }
    })
        .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .data("ui-autocomplete-item", item)
            .append("<a>" + format(item) + "</a>")
            .appendTo(ul);
    };
 
    $('#presetCategory').bind('click', function(){
        $('#presetCategory').autocomplete('search', "");
    });
 
    $('#presetInputOwner').hide();
 
 
 
 
    if (myPresets.length) {
        myPresets = "<div id='myPresets' style='width:300px; border: 3px solid red; background-color:#FFFF11; padding:25px;'><b style='font-size:24px;'>Presets:</b><br>" + myPresets + "</div><br>";
        $('#presetBox').before(myPresets);
        $('#myPresets').data("data", presets);
    }
 
    if(myPresets['Ship Type'] == "media") {
        myPresets['Ship Type'] = "Media";
    }
 
 
    $('#presetBox').append("<br><span id='updatePresetsButton' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;'><b>Update presets</b></span>");
    $('#presetBox').append("<br><span id='clearPresetsButton' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; position: relative; top: -20px; left: 120px;'><b>Clear presets</b></span>");
    $('#presetBox').after("<br><span id='presetBoxButton' style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px; position: relative; top: -4px;' onclick='javascript:$(\"#presetBox\").show();$(\"#presetBoxButton\").hide();'><b>Edit presets</b></span>");
 
    $('#updatePresetsButton').bind('click', function(){
        var presetList = ['Title', 'Skip', 'Category', 'Store', 'Shipping Weight', 'Display Weight', 'Location', 'Duration', 'Starting Bid', 'BIN Price', 'Ship Charge', 'Ship Type', 'Dimension 1', 'Dimension 2', 'Dimension 3', 'Owner',/* 'Cyber Monday'*/];
        var presetVals = {};
        $.each(presetList, function(key, value){
            presetVals[value] = $('[id="preset' + value + '"]').val();
            myValue = $('[id="preset' + value + '"]').val();
        });
 
        if ($('#presetDescription').html().length >= 1) {
            presetVals['Description'] = $('#presetDescription').html();
        } else {
            presetVals['Description'] = '';
        }
 
        $('#myPresets').remove();
        var myPresets = {};
        $.each(presetVals, function(key, value){
            if (value.length) {
                myPresets += '<b>' + key + ':</b> ' + value + '<br>';
            }
        });
        if(myPresets['Ship Type'] == "media") {
            myPresets['Ship Type'] = "Media";
        }
        var messageTxt  = JSON.stringify (presetVals);
        window.postMessage (messageTxt, '*');
        if (myPresets.length) {
            myPresets = "<div id='myPresets' style='width:300px; border: 3px solid red; background-color:#FFFF11; padding:25px;'><b style='font-size:24px;'>Presets:</b><br>" + myPresets + "</div><br>";
            $('#presetBox').before(myPresets);
            $('#myPresets').data('data', presetVals);
            $('#myPresets').html($('#myPresets').html().replace('undefined',''));
            $('#myPresets').html($('#myPresets').html().replace('[object Object]',''));
        }
        $("#presetBox").hide();
        $("#presetBoxButton").show();
        processPresets(presetVals);
    });
 
    $('#clearPresetsButton').bind('click', function(){
        var skipVal = $('#presetSkip').val();
        $('.presetInput, #presetCategory, #presetStore, #presetLocation').not('#presetSkip').each(function(){
            $(this).val('');
        });
        $('#presetDescription').html('');
 
        // processpresets
 
        $('#itemTitle, #catID, #itemsellerstore, #itemWeight, #itemDisplayWeight, #itemSellerInventoryLocationID, .gesMN_input').val('');
        $('#itemBuyNowPrice, #itemShippingPrice').val('0');
        var iframe = document.getElementById('WebWizRTE').contentDocument || document.getElementById('WebWizRTE').contentWindow.document;
        var description = iframe.querySelectorAll('body')[0];
        description.innerHTML = '';
 
        $('#itemShipMethod').val(defaultCarrier);
        $('#itemMinimumBid').val(defaultStartingBid);
        $('#itemDuration').val(defaultDuration);
        $('#presetSkip').val(skipVal);
 
        $("#presetBox").hide();
        $("#presetBoxButton").show();
 
    });
 
 
 
    if ($('#presetSpanDescription').length > 0) {
        $('#presetSpanDescription').css({
            'position' : 'relative',
            'left' : '25px',
        });
 
        $('#presetSpanDescription > b').first().css({
            'position' : 'relative',
            'left' : '-25px',
        });
        $('#myPresets').append("<table id='presetTable'><tr><td id='presetTd1' style='width: 200px; vertical-align: top;'></td><td  style='width: 200px; vertical-align: top;' id='presetTd2'></td></tr></table>");
        $('.presetSpan').not('#presetSpanDescription').appendTo('#presetTd1');
        $('#presetSpanDescription').appendTo('#presetTd2');
        $('#myPresets').css('width', '420px');
    }
 
 
 
    $('#presetLocation').attr('id', 'tempLoc');
 
    $('#tempLoc').after("<select id='presetLocation'></select>");
    $('#tempLoc').remove();
 
    $('#presetLocation').append("<option value=''>&nbsp;</option>");
    $.each(jsondata2, function(shelfIndex, shelfArray){
        $('#presetLocation').append("<option value='" + shelfArray['value'] + "'>" + shelfArray['name'] + "</option>");
    });
 
 
    $('#presetStore').attr('id', 'tempStore');
    $('#tempStore').after($('#itemsellerstore').clone().attr('id', 'presetStore'));
    $('#tempStore').remove();
    $('#presetStore').prepend("<option val=''></option>");
 
 
 
    $('#catID').autocomplete({
        source: validCategories,
        minLength: 0,
        select: function (event, ui) {
 
            $('#catID').val(ui.item.label);
//            $('#catid').val(ui.item.id);
//            $('#catid').val(categoryIds[ui.item.label]);
            console.dir(ui.item);
            $('#catID').blur();
 
            $('#WebWizRTE').focus();
 
 
            return false;
        }
    })
        .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .data("ui-autocomplete-item", item)
            .append("<a>" + format(item) + "</a>")
            .appendTo(ul);
    };
 
    $('#itemSellerInventoryLocationID').autocomplete({
        source: validLocations,
        minLength: 0,
        select: function (event, ui) {
            $('#itemSellerInventoryLocationID').val(ui.item.label);
            return false;
        }
    })
        .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .data("ui-autocomplete-item", item)
            .append("<a>" + format(item) + "</a>")
            .appendTo(ul);
    };
 
 
 
    $('#catID').bind('focus', function(){
        $('#catID').autocomplete("search", $('#catID').val());
    });
    $('#itemSellerInventoryLocationID').bind('focus', function(){
        $('#itemSellerInventoryLocationID').autocomplete("search", $('#itemSellerInventoryLocationID').val());
    });
 
 
    var quickCatsTable = document.createElement('table');
    document.getElementById('itemTitle').parentNode.appendChild(quickCatsTable);
 
    quickCatsTable.innerHTML = "<tr><td style='vertical-align: top;'>Quick Categories: </td><td id='quickCatsContainer' style='vertical-align: top;'></td></tr>"
    //quickCatsContainer.id = 'quickCatsContainer';
    var quickCatsContainer = document.getElementById('quickCatsContainer');
    //quickCatsTable.outerHTML = '<br> ' + quickCatsTable.outerHTML;
    quickCatsTable.style.marginTop = '10px';
 
 
 
    $.each(myCats, function(groupName, groupObject) {
        var quickCats = document.createElement('select');
        quickCats.id = 'quickCats-'+groupName.replace(' ','_');
        quickCats.className += 'quickCat';
        quickCats.style.margin = '4px';
        quickCats.style.width = '110px';
        quickCats.appendChild(document.createElement('option'));
        quickCats.querySelectorAll('option')[0].innerHTML = groupName;
        quickCats.querySelectorAll('option')[0] = 'default';
        //    console.log(groupName);
        //    console.dir(groupObject);
        // Not sure why I can't get this to work with Array.prototype....
        $.each(groupObject, function(catName, catValue) {
            var myOption = document.createElement('option');
            myOption.innerHTML = "&nbsp;" + catName;
            myOption.value = catValue;
            quickCats.appendChild(myOption);
        });
        //    quickCats.appendChild(myOptGroup);
 
        if (document.querySelectorAll('.quickCat').length%4 == 0 && document.querySelectorAll('.quickCat').length > 0) {
            quickCatsContainer.appendChild(document.createElement('br'));
        }
 
        quickCatsContainer.appendChild(quickCats);
        //    quickCats.outerHTML = '<br>Quick categories: ' + quickCats.outerHTML;
 
        quickCats.onchange = function(){
            var catID = document.getElementById('catID');
            catID.value = quickCats.value;
            catID.focus();
            $('#catID').autocomplete("search", quickCats.value);
            //        console.dir(categoryIds);
            if (categoryIds.hasOwnProperty(quickCats.value)) {
                //            document.getElementById('catid').value = categoryIds[quickCats.value];
            }
 
 
            quickCats.className += ' activeQuickCats';
            var allCatMenus = document.querySelectorAll('.quickCat');
            Array.prototype.forEach.call(allCatMenus, function(el) {
                el.style.border = '';
                /*
           if (el.className.indexOf('activeQuickCats') < 0) {
               el.value = 'default';
           } else {
               console.log(e.className);
           }
           el.className = el.className.replace('activeQuickCats', '');
           //*/
            });
 
            quickCats.style.border = '2px solid #5e5';
            //        quickCats.style.backgroundColor = '#afa';
        }
 
    });
 
 
 
 
 
 
//    console.dir(myPresets);
}, 2000);
 
 
 
if(url == "https://sellers.shopgoodwill.com/sellers/newAuctionItem-catsel.asp?clear=yes") {
    // Hides form if photos are not uploaded
    // the return URL from the photo uploader is:
    // https://sellers.shopgoodwill.com/sellers/newauctionitem-catsel.asp?btnSubmit=Return+to+item+entry
    $('#form1').hide();
} else if (url != "https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp") {
    $('#itemTitle').parent().parent().prepend("<table style='width:400px; margin-top: 4px;'><th><td colspan=999 style='width:100%; background-color:rgb(144, 247, 23); text-align: center; font-weight: bold; color: #000;'>Listing upgrades</td></th><tr><td id='listingUpgrades'></td></tr></table>");
    $('#listingUpgrades').append("<td style='padding: 5px;'>Gallery ($8) <input type='checkbox' id='galleryCB2'></td>");
    $('#listingUpgrades').append("<td style='padding: 5px; text-align: center;'>Feature ($5) <input type='checkbox' id='featureCB2'></td>");
    $('#listingUpgrades').append("<td style='padding: 5px; text-align: right;'>Premium item <input type='checkbox' id='premiumItem'></td>");
    $('#listingUpgrades').parent().append("<tr style='display:none;' id='itemDurationRow'><td style='padding-left: 10px;' colspan=999'>Duration: <input id='durationInput' size=2 disabled=true> <div style='display:inline-block; width:150px;'>(ends on a <span id='endDay'></span>)</div> <input id='unlockDuration' type='checkbox'></td></tr>");
    $('#listingUpgrades').parent().append("<tr style='display:none;' id='itemStartingPriceRow'><td style='padding-left: 10px;' colspan=999'>Starting Price: <input id='startingPriceInput' size=4 disabled=true> <input id='unlockStartingPrice' type='checkbox'></td></tr>");
}
 
 
 
 
 
//$("#form1").append("<script id='jqueryui' src='https://code.jquery.com/ui/1.11.4/jquery-ui.js'></script>");
$("#form1").append("<div id='combineCheck' style='display:none;'>false</div>");
//$("#form1").append("<input id='gesMN_skipReview' name='gesMN_skipReview' style=';'>");
 
var button1 = "<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 3px;'";
var button2 = "</span>&nbsp;";
 
 
 
 
$('#itemAutoInsurance').attr( "disabled", false );
if ($('font:contains(\"Uploading images\")').length) {
 
    $('#itemShippingPrice').before('<div id="shipPriceLock" style="position:relative;"><div style="position: absolute;top:0;left:0;width: 90px;height:22px;background-color: gray;z-index:99;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
    $('#itemShipMethod').before('<div id="shipMethodLock" style="position:relative;"><div style="position: absolute;top:0;left:0;width: 100px;height:22px;background-color: gray;z-index:99;opacity:0.2;filter: alpha(opacity = 50)"></div></div>');
    $('#itemShipMethod').after("<br><br>" + button1 + "<span onclick=\"$('#shipMethodLock').remove();\" style='position:relative; left: 50px; margin:10px'>Unlock shipping method</span>" + button2 + "<br>");
}
 
var currentDur = $('#itemDuration').val();
if (url != "https://sellers.shopgoodwill.com/sellers/newauctionitem-catsel.asp?btnSubmit=Return+to+item+entry" && url != "https://sellers.shopgoodwill.com/sellers/reviewItem-label.asp") {
    $('#itemDuration').replaceWith("<input name='itemDuration' id='itemDuration' value='" + currentDur + "' min='0' max='15'>");
}
 
var cmAllow = "no";
var cmBIN = "no";
 
 
 
$("#itemStartOffset, #itemstarttime, #itemDuration, #itemEndTime, #itemShipMethod, #itemShippingPrice, #itemNoCombineShipping, #itemAutoInsurance").attr('tabindex', "-1");
 
$("#WebWizRTE, #itemDescription").height(700);
$("#WebWizRTE, #itemDescription").width(810);
$("#catID").attr("size", 100);
 
$("strong:contains('Item Title')").prepend("<br>");
$("#itemTitle").attr("maxlength",50);
$("#itemTitle").removeAttr('onkeypress').removeAttr('onkeyup');
$('#myCounter').html(50);
 
 
 
//UGH, SHOPGOODWILL
 
$('font:contains("Numbers and decimal point")').after("<br><br>" + button1 + "<span onclick=\"$('#shipPriceLock').remove();\" style='position:relative; left: 50px; margin:10px;'>Unlock shipping charge</span>" + button2 + "<br>");
 
 
 
$('strong:contains("Private Description")').hide();
$('#itemSellerInfo').hide();
 
$('p:contains("optimization")').hide();
 
    var html = $('#form1 > table > tbody > tr:eq(1) > td:eq(1)')[0];
    var html2 = $('#form1 > table:eq(1) > tbody > tr > td')[0];
    var handlingPrice = $('#itemHandlingPrice').val();
 
    html2.innerHTML = html2.innerHTML.replace(/You will be advised[\s\S]*place your listing[\s\S]*will be assessed[\s\S]*in the next screen\./g,"");
    $("p:contains('Make sure you know')").hide();
    $("p:contains('Please review the')").hide();
    $("p:contains('read shopgoodwill')").hide();
 
    $("hr").hide();
 
    $('p:contains("Starting Bid")').addClass("bidStartDurBox");
    $('p:contains("Auction Duration")').addClass("bidStartDurBox").after("<br><br>");
    $('p:contains("Auction Duration")').after("<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 2px; font-size:12px; position:relative; top:15px;' id='bidStartDurBoxButton' onclick='javascript:$(\".bidStartDurBox\").show().after();$(\"#bidStartDurBoxButton\").hide();'>Starting bid, start time, duration</span><br>")
    $('#bidStartDurBoxButton').after("<span style='border: 1px solid #CCCCCC; background-color:#EEEEEE; padding: 2px; font-size:12px; position:relative; top:15px;' id='BINBoxShowButton'>Buy now price</span>");
    $('.bidStartDurBox').hide();
 
    $('#itemStartOffset').attr("id", "itemStartOffset");
    $('#itemstarttime').attr("id", "itemstarttime");
    $('#itemDuration').attr("id", "itemDuration");
 
    html.innerHTML = html.innerHTML.replace("onblur", "alt");
    html.innerHTML = html.innerHTML.replace(/<hr align="center" noshade="" width="350">/g,"");
    html.innerHTML = html.innerHTML.replace(/pounds((.|\n)*)oversized packages\./g,"");
    html.innerHTML = html.innerHTML.replace(/Shipping Charge allows((.|\n)*)United States\./g,"");
    $('b:contains("Set the Shipping Charge")').hide();
    html.innerHTML = html.innerHTML.replace(/to use the default shipper's rate calculator\./g,"");
    html.innerHTML = html.innerHTML.replace(/This is the number((.|\n)*)become active\./g,"");
    html.innerHTML = html.innerHTML.replace(/This is the number((.|\n)*)will end\./g,"");
    $('font:contains("UPS dimensional weight calculator click")').hide();
    html.innerHTML = html.innerHTML.replace(/Select this option to change the shipping method from your default method\./g,"");
    html.innerHTML = html.innerHTML.replace(/One line((.|\n)*)find your item\.|You may use((.|\n)*)do not use HTML\.|For |Dutch auctions((.|\n)*)selling a single set\.|This is the price((.|\n)*)and commas \(','\)|Bid increment is((.|\n)*)each bid\.|Reserve Price is((.|\n)*)Reserve Price!|Buy Now allows((.|\n)*)Buy Now!/g, "");
    html.innerHTML = html.innerHTML.replace(/Item Quantity((.|\n)*)itemQuantity" size="3" value="1">/g, "<span id=\"qtyBox\" style=\"display:none;\"><input maxlength=\"3\" name=\"itemQuantity\" size=\"3\" value=\"1\"></span></strong>");
    html.innerHTML = html.innerHTML.replace(/per item((.|\n)*): 3\.00/g, "");
    html.innerHTML = html.innerHTML.replace(/Bid Increment((.|\n)*)10\.00/g, "<span id=\"incrementReserveBox\" style=\"display:none;\"><b>Bid increment:</b> <input maxlength=\"11\" name=\"itemBidIncrement\" size=\"9\" value=\"1\"><br><b>Reserve price:</b> <input maxlength=\"11\" name=\"itemReserve\" size=\"9\" value=\"0\"><br></span><span id=\"BINBox\" style=\"display:none;\"><b>Buy now price:</b> <input maxlength=\"11\" name=\"itemBuyNowPrice\" size=\"9\" value=\"0\"> </strong>(leave at 0 to not have buy-it-now as an option)</span><br><span id='setStartingBid' class='fakeButton' style='border: 1px solid #afe9e9; background-color:#d7f4f4; padding: 2px; font-size:12px; position:relative; top:5px;'>Starting bid = BIN price</span></strong>");
    html.innerHTML = html.innerHTML.replace(/Box Selection((.|\n)*)willing to ship your item\./g, "<span id=\"boxBox\" style=\"display:none;\"><select name=\"itembox\"><option value=\"-1\">No Boxes Defined</option></select><select name=\"itemShipping\" id=\"itemShipping\" size=\"1\"><option value=\"2\">U.S. and Canada Only</option><option value=\"0\" selected=\"\">No international shipments (U.S. Only)</option><option value=\"1\">Will ship internationally</option></select></span></strong></b>")
    html.innerHTML = html.innerHTML.replace(/Handling Charge((.|\n)*)final item selling price\)\./g, "</strong><span id=\"handleBox\"><input maxlength=\"11\" name=\"itemHandlingPrice\" size=\"11\" value=\""+ handlingPrice + "\"></span></b>");
    html.innerHTML = html.innerHTML.replace(/<input name="itemNoCombineShipping" value="ON" type="checkbox">/g, "</strong><input name=\"itemNoCombineShipping\" value=\"ON\" type=\"checkbox\" tabindex=\"-1\"></strong>");
    html.innerHTML = html.innerHTML.replace(/<i>Example: 1<\/i>/g, "");
    html.innerHTML = html.innerHTML.replace(/<a href="tools\/UPSdimweightcalculator.asp" target="_blank">here<\/a>/g, "<a href=\"tools/UPSdimweightcalculator.asp\" target=\"_blank\" tabindex=\"-1\">here</a>");
        html.innerHTML = html.innerHTML.replace(/<a href="tools\/uspsdimweight1.asp" target="_blank">here<\/a>/g, "<a href=\"tools/uspsdimweight1.asp\" target=\"_blank\" tabindex=\"-1\">here</a>");
        html.innerHTML = html.innerHTML.replace(/<select name="itemStartOffset" size="1">/g, "<select name=\"itemStartOffset\" size=\"1\" tabindex=\"-1\">");
        html.innerHTML = html.innerHTML.replace(/<select name="itemstarttime" size="1">/g, "<select name=\"itemstarttime\" size=\"1\" tabindex=\"-1\">");
        html.innerHTML = html.innerHTML.replace(/<select name="itemDuration" size="1">/g, "<select name=\"itemDuration\" size=\"1\" tabindex=\"-1\">");
        html.innerHTML = html.innerHTML.replace(/<select name="itemEndTime" size="1">/g, "<select name=\"itemEndTime\" size=\"1\" tabindex=\"-1\">");
        html.innerHTML = html.innerHTML.replace(/<select name="itemShipMethod" id="itemShipMethod" onchange="modify()">/g, "<select name=\"itemShipMethod\" id=\"itemShipMethod\" onchange=\"modify()\" tabindex=\"-1\">");
        html.innerHTML = html.innerHTML.replace(/<input id="itemAutoInsurance" name="itemAutoInsurance" value="ON" disabled="true" type="checkbox">/g, "<input id=\"itemAutoInsurance\" name=\"itemAutoInsurance\" value=\"ON\" disabled=\"true\" type=\"checkbox\" tabindex=\"-1\">");
    html.innerHTML = html.innerHTML.replace(/USPS Only/g, 'Post Office Only');
 
    html2.innerHTML = html2.innerHTML.replace(/Press <input tabindex="-99" id="reset1" name="reset1" type="reset" value="Reset Form">((.|\n)*) to start over\./g, "");
    html2.innerHTML = html2.innerHTML.replace(/<input tabindex="-99" id="reset1" name="reset1" value="Reset Form" type="reset">/g, "<input tabindex=\"-99\" id=\"reset1\" name=\"reset1\" value=\"Reset Form\" type=\"reset\" style=\"display:none;\">");
    html2.innerHTML = html2.innerHTML.replace(/Press to((.|\n)*)start over./g, "");
    html2.innerHTML = html2.innerHTML.replace(/<input id="submit1" name="submit1" value="Review Item" type="submit">/g, "<input id=\"submit1\" name=\"submit1\" value=\"Review Item\" type=\"submit\">");
 
    $('p:contains("Auction Gallery")').replaceWith('<br><b>Auction Gallery:</b><input name="itemGallery" id="itemGallery" value="ON" onclick="javascript:SetFeaturedButton();" type="checkbox"> ($7.95 charge)<br>Checking this box causes the auction to appear in the gallery on the site\'s front page.<br><b>Please make sure the photos are square</b>, either by adding white space using Paint, or by cropping them with <a href="http://www.croppola.com" target="_blank">Croppola</a>.<br><br>');
    $('td:contains("Featured Auction")').replaceWith('<td><b>Featured Auction:</b><input name="itemFeatured" id="itemFeatured" value="ON" type="checkbox"> ($4.95 charge)<br>This adds the item to the Featured Auctions in its category.<br>Photos can be used as-is.</td><br>');
 
    html.innerHTML = html.innerHTML.replace(/Select this((.|\n)*)other items\./g, "<span id='itemNoCombineShippingText'>Select this option if the buyer of this item should not be allowed to combine this item with shipment of other items.</span>");
    html.innerHTML = html.innerHTML.replace(/Select this option if you'd like to have((.|\n)*)in order\./g, "<span id='itemAutoInsuranceText'> Select this option if you'd like to have the system automatically apply the appropriate insurance amount, based on the items current price. In the case of multiple items in the shipment, insurance is calculated on the value of all items in order.</span>");
      $('#itemIsStock').parent().hide();
 
 
    $('#handleBox').appendTo($('p.bidStartDurBox').first());
 
 
$('#itemDescription').after("<br><br><div id='step3Header' style='background-color: #ffc700; width: 103%; height: 24px; z-index: 99; position: relative; top: -44px; left: -30px; padding:3px;'><font size='4'><strong>Step 3 - Shipping</strong></font></div>");
$('#step3Header').after($('#gesMN_shippingCalculatorContainer'));
$('#gesMN_shippingCalculatorContainer').css({'margin-top' : '-50px', 'margin-bottom' : '-25px'})
$('p:contains(\"Seller Store\")').before("<div id='step4Header' style='background-color: #ffc700; width: 103%; height: 24px; z-index: 99; position: relative; top: -12px; left: -30px; padding:3px;'><font size='4'><strong>Step 4 - Store and location</strong></font></div>");
$('font:contains(\"Step 1\")').html("Step 1 - Images and presets");
$('strong:contains(\"Step 2\")').html("Step 2 - Item information");
 
$('b:contains("Item Shipment Combining"), #itemNoCombineShipping, #itemNoCombineShippingText, b:contains("Auto Include Insurance"), #itemAutoInsurance, #itemAutoInsuranceText').addClass('hiddenCheckboxes');
 
//$('.hiddenCheckboxes').insertAfter($('#noteToShipping').parent());
$('.hiddenCheckboxes').each(function(){
    $('#form1').append($(this));
})
$('b:contains("Item Shipment Combining"), #itemNoCombineShipping, #itemNoCombineShippingText').wrapAll("<p id='noCombineShippingContainer' style='display:none;'></p>");
$('b:contains("Auto Include Insurance"), #itemAutoInsurance, #itemAutoInsuranceText').wrapAll("<p id='autoInsuranceContainer' style='display:none;'></p>");
//$('.hiddenCheckboxes').hide();
 
$('br + br + br').remove();
 
 
 
 
 
var myDepartment = '';
 
 
var debug = false;
var myDept = '';
 
$.each(posters, function(name, info) { //here2
    re = new RegExp(name,"gi");
    if(re.exec($(".smtext").html())) {
       if (info['skip'] && info['skip'] == 'allow') {
       } else {
           $('#presetInputSkip').hide();
       }
       if (info['CM'] == 'yes' || info['CM'] == 'BIN') {
           cmAllow = "yes";
           if (info['CM'] == 'BIN') {
               cmBIN = "yes";
           }
       }
      if (info['debug'] == true) {
           debug = true;
       }
       if (info['duration']) {
           $('#itemDuration').val(info['duration']);
       }
       delay = info['delay'];
       if (delay > 0) {
           var d = new Date();
           var today = d.getDay();
           if ((today + delay) == 6) {
               delay += 2;
           } else if ((today + delay) == 7) {
               delay += 3;
           }
           $('#itemStartOffset').val(delay);
           $('#itemstarttime').val('14:00');
       }
       if (info['dept'] == 'collectibles') {
           $('#itemNoCombineShipping').attr('checked', true);
       }
       myDept = info['dept'];
       $("body").append("<div id='posterName' style='display:none;'>" + info['name'] + "</div>");
    }
});
 
 
$('p:contains("Description"), strong:contains("Title"), font:contains("characters remaining"), strong:contains("Category"), #catID').addClass('section2');
$('#shipCalcContainer, font:contains("leave at"), .shippingOptions, font:contains("Shipping Charge"), span:contains("Unlock shipping"), b:contains("Shipping"), #shipMethodLock, #itemShipMethod, b:contains("Item Shipment"), input[name="itemNoCombineShipping"], #itemNoCombineShippingText, b:contains("Insurance"), #itemAutoInsurance, #itemAutoInsuranceText').not(':not(:visible)').addClass('section3');
 
 
myCats = {
    'Misc. Common' : {
        'Clocks (home decor)' : "For The Home > Home Decor > Clocks",
        'Dishes' : "Tableware and Kitchenware > Dinnerware > Sets",
        'Dolls' : "Toys/Dolls/Games > Dolls",
        'Film cameras' : "Cameras & Camcorders > Film Cameras",
        'Flatware' : "Tableware and Kitchenware > Flatware",
        "LEGOs" : "Toys/Dolls/Games > Toys > LEGO",
        'Sewing machines' : "Crafts & Hobbies > Sewing Machines",
        'Paintings' : "Art > Paintings",
        'Prints' : "Art > Prints",
        'Typewriters' : "Office Supplies > Typewriters",
    },
    'Clothing' : {
        'Men\'s...' : "Clothing > Men's Clothing" ,
        '&nbsp;&nbsp;Accessories' : "Clothing > Men's Clothing > Accessories",
        '&nbsp;&nbsp;Blazers' : "Clothing > Men's Clothing > Blazers",
        '&nbsp;&nbsp;Hats' : "Clothing > Men's Clothing > Hats",
        '&nbsp;&nbsp;Jeans' : "Clothing > Men's Clothing > Jeans > Size ",
        '&nbsp;&nbsp;Outerwear' : "Clothing > Men's Clothing > Outerwear",
        '&nbsp;&nbsp;Pants' : "Clothing > Men's Clothing > Pants > Size ",
        '&nbsp;&nbsp;Shirts' : "Clothing > Men's Clothing > Shirts > Size ",
        '&nbsp;&nbsp;Shoes' : "Clothing > Men's Clothing > Shoes Men's > Size ",
        '&nbsp;&nbsp;Suits' : "Clothing > Men's Clothing > Suits",
 
        'Women\'s...' : "Clothing > Women's Clothing" ,
        '&nbsp; Accessories' : "Clothing > Women's Clothing > Accessories",
        '&nbsp; Blazers' : "Clothing > Women's Clothing > Blazers",
        '&nbsp; Dresses' : "Clothing > Women's Clothing > Dresses > Size",
        '&nbsp; Hats' : "Clothing > Women's Clothing > Hats",
        '&nbsp; Jeans' : "Clothing > Women's Clothing > Jeans > Size ",
        '&nbsp; Outerwear' : "Clothing > Women's Clothing > Outerwear",
        '&nbsp; Pants' : "Clothing > Women's Clothing > Pants > Size ",
        '&nbsp; Shirts' : "Clothing > Women's Clothing > Shirts/Blouses > Size ",
        '&nbsp; Shoes' : "Clothing > Women's Clothing > Shoes Women's > Size ",
        '&nbsp; Skirts' : "Clothing > Women's Clothing > Skirts > Size",
        '&nbsp; Suits' : "Clothing > Women's Clothing > Suits",
 
        'Purses' : "Clothing > Women's Clothing > Purses",
        'Wedding dresses' : "Wedding > Dresses > Size ",
    },
    'Collectibles' : {
        'Advertising' : "Collectibles > Advertising",
        'Cards' : "Collectibles > Sports Cards/Trading Cards",
        'Collector plates' : "Collectibles > Collector Plates",
        'Coca-Cola' : "Collectibles > Coca-Cola Memorabilia",
        'Clocks' : "Collectibles > Clocks",
        'Coins/money' : "Collectibles > Coins and Paper Money",
        'Comic books' : "Collectibles > Comic Books",
        'Figurines' : "Collectibles > Figurines",
        'Historical documents' : "Collectibles > Historical Documents",
        'Hollywood memorabilia' : "Collectibles > Hollywood Memorabilia",
        'Military memorabilia' : "Collectibles > Military Memorabilia",
        'Music memorabilia' : "Collectibles > Music Memorabilia",
        'Sports' : "Collectibles > Sports",
        'Stamps' : "Collectibles > Stamps",
        'Trains' : "Collectibles > Trains",
    },
    'Electronics' : {
        'iPods' : "Computers & Electronics > Personal Electronics > MP3/CD Players & Accessories > iPod",
        'Phones' : "Computers & Electronics > Personal Electronics > Cell Phones & Accessories",
        'Receivers' : "Computers & Electronics > Home Electronics > Home Audio/Theater > Receivers & Radios",
        'Speakers' : "Computers & Electronics > Home Electronics > Home Audio/Theater > Speakers",
        'Vintage electronics' : "Computers & Electronics > Vintage Electronics",
    },
    'Instruments' : {
        'Amps' : "Musical Instruments > Amplifiers & Effects > Amplifiers",
        'Brass' : "Musical Instruments > Brass",
        'Electronic' : "Musical Instruments > Electronic",
        'Guitars' : "Musical Instruments > Guitars & Basses",
        'Keyboards' : "Musical Instruments > Electronic",
        'Percussion' : "Musical Instruments > Percussion",
        'Violins' : "Musical Instruments > Strings > Orchestral > Violins",
        'Woodwinds (including saxophones)' : "Musical Instruments > Woodwinds",
    },
    'Video games' : {
        'Handheld...' : '',
        '&nbsp;Gameboy' : "Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo GameBoy",
        '&nbsp;Gameboy Advance' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo GameBoy Advance',
        '&nbsp;DS' : "Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo DS",
        '&nbsp;3DS' : "Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo 3DS",
        '&nbsp;Game Gear' : "Computers & Electronics > Home Electronics > Gaming Systems & Games > Sega Game Gear",
        '&nbsp;PSP' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Sony PSP',
        'Nintendo...' : '',
        '&nbsp;NES' : "Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo NES",
        '&nbsp;SNES' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo SNES',
        '&nbsp;N64' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo 64',
        '&nbsp;Gamecube' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo GameCube',
        '&nbsp;Wii' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo Wii',
        '&nbsp;Wii U' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo Wii U',
        '&nbsp;Switch' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Nintendo Switch',
         'Sega...' : '',
        '&nbsp;Genesis' : "Computers & Electronics > Home Electronics > Gaming Systems & Games > Sega Genesis",
        '&nbsp;Saturn' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Sega Saturn',
        '&nbsp;Dreamcast' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Sega Dreamcast',
        'Sony...' : '',
        '&nbsp;Playstation' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Sony Playstation',
        '&nbsp;Playstation 2' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Sony Playstation 2',
        '&nbsp;Playstation 3' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Sony Playstation 3',
        '&nbsp;Playstation 4' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Sony Playstation 4',
        'Microsoft...' : '',
        '&nbsp;Xbox' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Microsoft Xbox',
        '&nbsp;Xbox 360' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Microsoft Xbox 360',
        '&nbsp;Xbox One' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > Microsoft Xbox One',
        'Other...' : '',
        '&nbsp;Atari' : "Computers & Electronics > Home Electronics > Gaming Systems & Games > Atari ",
        '&nbsp;ColecoVision' : 'Computers & Electronics > Home Electronics > Gaming Systems & Games > ColecoVision',
    },
    'Jewelry' : {
        'Coins/money' : "Collectibles > Coins and Paper Money",
        'Grab bags' : "Jewelry & Gemstones > Jewelry Grabbags",
        'Men\'s accessories' : "Jewelry & Gemstones > Men's Accessories",
        'Necklaces' : "Jewelry & Gemstones > Necklaces",
        'Rings' : "Jewelry & Gemstones > Rings",
        'Scrap' : "Jewelry & Gemstones > Precious Metal Scrap",
        'Sets' : "Jewelry & Gemstones > Jewelry Sets",
        'Watches' : "Jewelry & Gemstones > Watches",
    },
 
};
 
 
 
 
 
 
function binButton(amount) {
    $("#BINBox").show().parent().show().parent().show();
    $("#BINBoxShowButton").hide();
    if (typeof amount == 'undefined' || amount.length < 1) {
        amount = Math.ceil(prompt('Price?')) - .01;
    }
    var price = amount;
    $('#BINBox input').first().val(price);
}
 
function setStartingBid(){
    var binPrice = parseFloat($('#BINBox input').first().val()).toFixed(2);
    $('#itemMinimumBid').val((binPrice-.01).toFixed(2)).parent().show();
}
 
$('#itemShipMethod option[value=\"3\"]').text('Post Office');
 
$("#itemSellerInfo").after("<b>Note to shipping:</b><br><textarea id='noteToShipping' rows='2' cols='40'></textarea><br>");
 
function processPresets(presets){
    function checkPreset(presets, key) {
        if (typeof presets[key] != 'undefined' && presets[key].length > 0) {
            return true;
        } else {
            return false;
        }
    }
    var skipPresets = 0;
    var shipping = 0;
    if (checkPreset(presets, 'Title')) {
        $('#itemTitle').val(presets['Title']);
    }
    if (checkPreset(presets, 'Skip') && presets['Skip'] == 'skip') {
        if ($('#form1')[0].action.indexOf('skip=skip') < 0) {
            $('#form1')[0].action += '?skip=skip';
        }
    }
    if (checkPreset(presets, 'Category')) {
        if (validCategories.indexOf(presets['Category']) >= 0) {
            $('#catID').val(presets['Category']);
            $('#catID').autocomplete("search", $('#catID').val());
            $('#catID').blur();
        }
    }
    if (checkPreset(presets, 'Dimension 1')) {
        $('#gesMN_dim1').val(presets['Dimension 1']);
        if (presets['Dimension 1'].length > 0) {
            shipping += 4;
        }
    } else {
    }
    if (checkPreset(presets, 'Dimension 2')) {
        $('#gesMN_dim2').val(presets['Dimension 2']);
        if (presets['Dimension 2'].length > 0) {
            shipping += 4;
        }
    }
    if (checkPreset(presets, 'Dimension 3')) {
        $('#gesMN_dim3').val(presets['Dimension 3']);
        if (presets['Dimension 3'].length > 0) {
            shipping += 4;
        }
    }
    if (checkPreset(presets, 'Display Weight')) {
        $('#gesMN_actualWeight').val(presets['Display Weight']);
        $('#itemDisplayWeight').val(presets['Display Weight']);
        if (presets['Display Weight'].length > 0) {
            shipping += 10;
        }
    }
    if (checkPreset(presets, 'Duration')) {
        $('#itemDuration').val(presets['Duration']);
        $('#bidStartDurBoxButton').trigger('click');
    }
    if (checkPreset(presets, 'Starting Bid')) {
        $('#itemMinimumBid').val(presets['Starting Bid']);
        $('#bidStartDurBoxButton').trigger('click');
    }
 
    if (checkPreset(presets, 'Location')) {
        $('#itemSellerInventoryLocationID').val(presets['Location']);
        if (presets['Location'].length > 0) {
            skipPresets += 1;
        }
        $('#presetLocation').val(presets['Location']); //wait, what? why?
    }
    if (checkPreset(presets, 'Ship Charge') && presets['Ship Charge'] > 0) {
        $('#itemShippingPrice').val(presets['Ship Charge']);
        $('#itemShipMethod').val(3);
        $('#itemAutoInsurance').attr('checked', true);
    }
    if (checkPreset(presets, 'Ship Type')) {
        // TODO: gotta fix this somehow....
        shipType = presets['Ship Type'].toLowerCase();
        if(shipType == 'media') {
            if ($('#actualWeight').val().length < 1) {
                weightPrompt();
            }
            doMedia($('#actualWeight').val());
        } else if (shipType == 'clothing') {
            if ($('#actualWeight').val().length < 1) {
                weightPrompt();
            }
            calculateUSPS($('#actualWeight').val());
        } else if (shipType == 'guitar' || shipType == 'art' || shipType == 'long') {
            $('#currentShipCalcType').val(shipType);
            $('#calc-'+shipType).css('background-color', '#AAA');
        } else if (shipType == 'pickup') {
            $('#itemShipMethod').val(0);
        }
        console.log(shipType);
    }
/*
    if (checkPreset(presets, 'Ship in own box/between cardboard') && presets['Ship in own box/between cardboard'].toLowerCase() == 'yes') {
        $('#ownBox:visible:enabled').attr('checked', true);
    }
*/
    if (checkPreset(presets, 'Shipping Weight')) {
        $('#itemWeight').val(presets['Shipping Weight']);
        if (presets['Shipping Weight'].length > 0) {
            shipping += 10;
        }
    }
    if (shipping >= 20) {
        skipPresets += 1;
    }
    if (checkPreset(presets, 'Skip') && $('#docready3').length < 1) {
        $("head").append("<script id='docready3'>$(document).ready(function() {"
                         + "myURL = document.URL;"
                         + "if (myURL.indexOf('reviewItem') > 0) {"
                         + "$('#submit').trigger('click');"
                         + "}"
                         + "});</script>");
    }
    if (checkPreset(presets, 'Store')) {
        $('#itemsellerstore').val(presets['Store']);
        if (presets['Store'].length > 0) {
            skipPresets += 1;
        }
        $('#presetStore').val(presets['Store']);
    }
    var isCM = false; // reused below
    if (checkPreset(presets, 'Cyber Monday')){
        var cmFalsy = ['no', 'off', 'false', false];
        isCM = true;
        $.each(cmFalsy, function(falsyIndex, falsyWord) {
            if (presets['Cyber Monday'].toLowerCase() == falsyWord)     {
                isCM = false;
            }
        });
        console.log(isCM);
        var now = new Date();
        if (now.getMonth() != 10) { // getMonth is 0-indexed - November returns as "10"
            isCM = false;
        }
        console.log(isCM);
        if (isCM) {
            var binPrice = '';
            if (checkPreset(presets, 'BIN Price') && presets['BIN Price'].length > 0 && presets['BIN Price'] > 0) {
                binPrice = presets['BIN Price'];
            } else {
                var binPrice = '';
                while (binPrice === null || binPrice.length < 1 || binPrice < 1) {
                    binPrice = prompt("Buy it now price?");
                }
            }
            binPrice = Math.ceil(binPrice) - .05;
            $('#chkCyberMonday').trigger('click');
            $('#txtCyberMonday').val(binPrice);
        }
    }
    if (checkPreset(presets, 'BIN Price') && !isCM) {
        //            alert('BIN price preset is active!');
        if (presets['BIN Price'].length > 0) {
            binButton(presets['BIN Price']);
            setStartingBid();
        } else {
            $('#itemBuyNowPrice').val('');
            $('#itemMinimumBid').val(defaultStartingBid);
        }
    }
    if (checkPreset(presets, 'Description')) {
        var iframe = document.getElementById('WebWizRTE').contentDocument || document.getElementById('WebWizRTE').contentWindow.document;
        var description = iframe.querySelectorAll('body')[0];
        description.innerHTML = presets['Description'];
    }
 
//    alert(skipPresets);
    if (skipPresets >= 3) {
        $('#itemTitle').after($('#submit1'));
    } else {
        $('#submitNormalPosition').append($('#submit1'));
    }
 
    if(!checkPreset('BIN Price') && !checkPreset('Duration')) {
        $('.bidStartDurBox').hide(); $('#bidStartDurBoxButton').show();
    }
 
}
 
 
 
var sgwTimeouts = window.setTimeout(function(){
 
    $('#submit1').wrap('<span id="submitNormalPosition"></span>');
//    $('#submit1').parent().attr('id', 'submitNormalPosition');
 
    $('#BINBoxShowButton').click(function(){
        binButton();
    });
    $('#setStartingBid').click(function(){
       setStartingBid();
    });
 
    presetCount = $('.presetSpan').length;
    if (presetCount <= 1) {
        $('#myPresets').hide();
    }
 
 
    processPresets(presets);
 
 //buttfarts
//    console.log(posters[thisPoster]);
    console.dir(posters);
 
 
    $('#galleryCB2').bind('click', function(){
       $("#itemGallery").trigger("click");
    });
 
    $('#featureCB2').bind('click', function(){
       $("#itemFeatured").trigger("click");
    });
 
    $('#premiumItem').bind('click', function(){
       if ($('#premiumItem:checked').length > 0) {
          premiumItem(true);
       } else {
           premiumItem(false);
       }
    });
 
    function premiumItem(willBePremium) {
        $('#premiumItem').attr('checked', willBePremium);
        if (baseDuration == 0) {
            baseDuration = $('#itemDuration').val();
        }
        if (willBePremium) {
            var now = new Date();
            var currentDate = now.getDate();
            var itemStartDay = now.getDay();
            itemStartDay += ($('#itemStartOffset').val()*1); // if it's not starting today...
            var itemDuration = 10 - (itemStartDay%7); // This gets you the number of days from the start day until the FOLLOWING Wednesday - Wednesday of the next week
            if (Math.floor(Math.random() * 2) == 1) {
                itemDuration += 1; // based on a coin flip, end on the Wednesday or add a 1 and end on the Thursday
            }
            $('#itemDuration').val(itemDuration);
            unlockDuration(false);
            unlockStartingPrice(false);
            $('#itemMinimumBid, startingPriceInput').val('9.99');
        } else {
            $('#itemDuration').val(baseDuration);
            $('#galleryCB2, #featureCB2, #itemGallery, #itemFeatured').attr('checked', false).attr('disabled', false);
            unlockDuration(true);
            unlockStartingPrice(false);
            $('#itemMinimumBid, startingPriceInput').val('5.95');
        }
        endDay();
        if ($('#galleryCB2:checked').length > 0) {
            var elements = $('tr, td, div, .colorChanged').filter(function(){
                var color = $(this).css("background-color").toLowerCase();
                return color === "#ffc700" || color === "rgb(255, 199, 0)" || $(this).is('.colorChanged');
            });
            elements.css('background-color' , '#11aaff');
            elements.addClass('colorChanged');
        } else if ($('#featureCB2:checked').length > 0) {
            var elements = $('tr, td, div, .colorChanged').filter(function(){
                var color = $(this).css("background-color").toLowerCase();
                return color === "#ffc700" || color === "rgb(255, 199, 0)" || $(this).is('.colorChanged');
            });
            elements.css('background-color' , '#57e727');
            elements.addClass('colorChanged');
        } else {
            var elements = $('.colorChanged');
            elements.css('background-color' , '#ffc700');
            elements.removeClass('colorChanged');
        }
    }
 
    function endDay() {
        $('#itemDurationRow').show();
        var now = new Date();
        var currentDate = now.getDate();
        var itemStartDay = now.getDay();
        itemStartDay += ($('#itemStartOffset').val()*1); // if it's not starting today...
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var endDay = (itemStartDay+$('#itemDuration').val()*1)%7;
        $('#endDay').html(weekdays[endDay]);
        $('#durationInput').val($('#itemDuration').val());
 
        $('#itemStartingPriceRow').show();
        $('#startingPriceInput').val($('#itemMinimumBid').val());
    }
 
    function linkInputs(firstID, secondID) {
        $('#'+firstID).bind('keyup, paste, focusout', function(){
           $('#'+secondID).val($(this).val());
        });
        $('#'+secondID).bind('keyup, paste, focusout', function(){
           $('#'+firstID).val($(this).val());
        });
    }
    linkInputs('startingPriceInput', 'itemMinimumBid');
 
    $('#durationInput').bind('keyup', function(){
        var duration = $('#durationInput').val().replace(/\D/, ''); // don't allow characters except digits - no letters, partial numbers, negatives, etc.
        $('#durationInput').val(duration);
        if ($('#durationInput').val().indexOf('NaN') >= 0) {
            $('#durationInput').val('');
        }
        if (duration.length > 0) {
            duration = Math.max(1, Math.min(duration, 30)); // constrain duration between 1 and 30 days
            if (duration > 15) {
                // replace select with input
                $('#itemDuration').replaceWith("<input id='itemDuration' tabindex='-1' name='itemDuration' size='1'>");
            }
            $('#itemDuration').val(duration);
            endDay();
        }
    });
 
    function unlockDuration(unlock) {
        $('#unlockDuration').attr('checked', unlock);
        if (unlock) {
            $('#durationInput').attr('disabled', false);
        } else {
            $('#durationInput').attr('disabled', true);
        }
    }
 
    function unlockStartingPrice(unlock) {
        $('#unlockStartingPrice').attr('checked', unlock);
        if (unlock) {
            $('#startingPriceInput').attr('disabled', false);
        } else {
            $('#startingPriceInput').attr('disabled', true);
        }
    }
 
    $('#unlockDuration').click(function() {
        unlockDuration($('#unlockDuration:checked').length > 0);
    });
 
     $('#unlockStartingPrice').click(function() {
        unlockStartingPrice($('#unlockStartingPrice:checked').length > 0);
    });
 
    $('#itemTitle').bind('keyup', function(){
        $("#myCounter").html(50-$('#itemTitle').val().length);
    });
 
    $('#itemGallery').bind('change', function(){
        if ($('#itemGallery:checked').length > 0) {
            $('#galleryCB2').attr('checked', true);
            $('#featureCB2, #itemFeatured').attr('checked', false).attr('disabled', true);
            $('#premiumItem').attr('disabled', true);
            premiumItem(true);
        } else {
            $('#galleryCB2').attr('checked', false);
            $('#featureCB2, #itemFeatured, #premiumItem').attr('disabled', false);
            premiumItem(false);
        }
    });
 
    $('#itemFeatured').bind('change', function(){
        if ($('#itemFeatured:checked').length > 0) {
            $('#featureCB2').attr('checked', true);
            $('#premiumItem').attr('disabled', true);
            premiumItem(true);
        } else {
            $('#featureCB2').attr('checked', false);
            $('#premiumItem').attr('disabled', false);
            premiumItem(false);
        }
    });
 
    $('input:not(#submit1)').bind('blur', function(){
        $(this).css('background-color', '#fff');
    })
 
 
    $('#submit1').bind('click', function(e){
        e.preventDefault();
        var focus = [];
        Array.prototype.forEach.call(document.querySelectorAll('.ges_invalid'), function(el) {
           validElement(el);
        });
 
 
 
        function cleanString(string){
            return string.replace(/[^\u0020-\u007E\u00A1-\u00FF]/g, '');
        }
 
        Array.prototype.forEach.call(document.querySelectorAll('input, select'), function(el) {
            el.value = cleanString(el.value);
        });
 
        var iframe = document.getElementById('WebWizRTE').contentDocument || document.getElementById('WebWizRTE').contentWindow.document;
        var description = iframe.querySelectorAll('body')[0].textContent;
 
        iframe.querySelectorAll('body')[0].innerHTML = cleanString(iframe.querySelectorAll('body')[0].innerHTML);
 
        if (myDept == 'jewelry') {
            combineCheck();
        }
//      deprecated: as of 3/9/18, ALL collectibles items will be no-combin
 
        var currentShipCalcType = $('#gesMN_currentShippingMethod').val();
        if ($('.shipCalcInput:focus'). length < 1) { // TODO: How to get which item is focused in pure js?
            var submitForm = true;
            var itemDescription = '';
            var errors = [];
            if (getElement('#itemTitle').value.length < 1) {
                errors.push('No title entered');
                focus.push(getElement('#itemTitle'));
//                invalidElement(document.getElementById)
            } else if (getElement('#itemTitle').className.indexOf('ges_invalid') >= 0) {
                errors.push('Title entered was too long, and got cut off');
                focus.push(getElement('#itemTitle'));
            }
 
            if (getElement('#catID').value.length < 1) {
                errors.push('No category selected');
                focus.push(getElement('#catID'));
            } else if (!(validCategories.indexOf(getElement('#catID').value) >= 0)) {
                errors.push('Invalid category!');
//                console.log(getElement('#catID').value);
//                console.dir(validCategories);
//                console.log(validCategories.indexOf(getElement('#catID').value) >= 0);
                focus.push(getElement('#catID'));
            }
 
 
 
            if (typeof description != 'undefined') {
               itemDescription = description.replace(/(?:\r\n|\r|\n)/g, '');
               if (itemDescription.length < 10) {
                  errors.push('No description entered');
                  submitForm = false;
                  focus.push(iframe.querySelectorAll('body')[0]);
//                  invalidElement(iframe.querySelectorAll('body')[0]);
               } else {
                 validElement(iframe.querySelectorAll('body')[0]);
               }
 
            }
            var myCat = $('#catID').val();
 
 
            var itemWeight = getElement('#itemWeight');
            if (itemWeight.value.length < 1) {
                if (currentShipCalcType == 'USPS') { // ensuring weight fields have been entered
                    while (itemWeight.value.length < 1) {
                        var weight = prompt("Item's weight?");
                        itemWeight.value = weight;
                        itemWeight.value = weight;
                    }
                } else if (currentShipCalcType == 'pickup' || currentShipCalcType == 'pickupOnly') {
                    itemWeight.value = getElement('#itemDisplayWeight').value;
                } else {
                    errors.push('No shipping weight entered');
                    var myInputs = [];
                    Array.prototype.forEach.call(document.querySelectorAll('.gesMN_input'), function(el) {
                       if (el.value.length < 1 && el.id != 'gesMN_dimPaste')  {
                           myInputs.push(el);
                           invalidElement(el);
                       }
                    });
                    if (myInputs.length > 0) {
                        focus.push(myInputs[0]);
                    }
                    invalidElement(itemWeight);
                }
            }
            if (getElement('#itemDisplayWeight').value.length < 1) {
                errors.push('No display (actual) weight entered');
                focus.push(getElement('#itemDisplayWeight'));
            }
 
            if (getElement('#itemsellerstore').value.length < 1) {
                errors.push('No store number entered');
                focus.push(getElement('#itemsellerstore'));
            }
 
            if (getElement('#itemSellerInventoryLocationID').value.length < 1) {
                errors.push('No inventory location entered');
                focus.push(getElement('#itemSellerInventoryLocationID'));
            } else if (!(validLocations.indexOf(getElement('#itemSellerInventoryLocationID').value) >= 0)) {
                errors.push('Invalid location!');
                focus.push(getElement('#itemSellerInventoryLocationID'));
            }
 
 
 
            var iframe = document.getElementById('WebWizRTE').contentDocument || document.getElementById('WebWizRTE').contentWindow.document;
            var description = iframe.querySelectorAll('body')[0].textContent;
            var needShipDims = false;
 
            if (iframe.querySelectorAll('#descList').length > 0) {
// This next section makes sure that items that have the pickup disclaimer A) have dimensions in the listing and B) have "Pickup Only" as their shipping method, and that items with "Pickup Only" shipping A) have dimensions in the listing and B) have the pickup disclaimer.
// HOWEVER, since it's possible that at some time in the future these scripts will still be in use but the template will have changed, it's important to wrap this in a conditional that checks for the presence of the types of elements used in the template in the first place - #descList being an easy one to pick on.
// Without doing that, if someone tries to submit an item with a description that's not from the description generator and pickup only shipping, they just won't be able to post it.
                function checkForShipDimsInDescription() {
                    if (iframe.querySelectorAll('#dimList li').length < 1) {
                        needShipDims = true;
                    }
                }
 
 
                var pickupDisclaimer = (iframe.querySelectorAll('.gesMN-disclaimer-pickupOnly').length > 0);
                if (description.indexOf('local pickup') > 0 || pickupDisclaimer === true) {
                    if (document.getElementById('itemShipMethod').value != '0') {
                        var pickupPrompt = confirm('Making this item pickup only. Click to confirm.');
                        if (pickupPrompt === true) {
                            document.getElementById('itemShipMethod').value = 0;
                            checkForShipDimsInDescription();
                        } else {
                            // if the item is NOT going to be for pickup only, remove the pickup disclaimer if it's present, and then remove the notes section entirely if it's empty
                            if (iframe.querySelectorAll('.gesMN-disclaimer-pickupOnly').length > 0) {
                                var disclaimerNode = iframe.querySelectorAll('.gesMN-disclaimer-pickupOnly')[0];
                                disclaimerNode.parentNode.removeChild(disclaimerNode);
                                var disclaimersRemaining = iframe.querySelectorAll('#notesList li');
                                if (disclaimersRemaining.length < 1) {
                                    iframe.querySelectorAll('#notesList')[0].parentNode.removeChild(iframe.querySelectorAll('#notesList')[0]);
                                    iframe.querySelectorAll('#notesHead')[0].parentNode.removeChild(iframe.querySelectorAll('#notesHead')[0]);
                                }
                            }
                        }
                    } else {
                        checkForShipDimsInDescription();
                    }
                } else if (document.getElementById('itemShipMethod').value == '0') {
                    // so if it's set to pickup only but the disclaimer ISN'T preset,
                    errors.push('Pickup Only disclaimer is missing from item\'s description');
                    checkForShipDimsInDescription();
                }
                if (needShipDims === true) {
                    errors.push('No shipping dimensions listed in description')
                }
 
 
            }
 
 
 
 
            if (errors.length < 1) {
                var inventoryLocation = $('#itemSellerInventoryLocationID').val();
                if ($('#itemsellerstore').val() == '999') {
                    $('#itemsellerstore').val('999 - Mixed Locations');
                }
                var shipString = 'OLoc:' + $('#itemSellerInventoryLocationID').val()+"<br>";
                shipString += $('#gesMN_debugString').val();
 
                if ($('#currentShippingNote').length > 0) {
                    if ($('#currentShippingNote').val().length > 0) {
                      shipString+= '<br><br>' + $('#currentShippingNote').val();
                    }
                }
                console.log(shipString);
                if ($('#noteToShipping').val().length > 0) {
                    shipString += ('<br><br><b>Note from ' + $('#posterName').html() + ':</b> ' + $('#noteToShipping').val()).substring(0,200);
                }   // .substring() here so that the note doesn't exceed 200 characters, messing up the post
                if ($('#premiumItem:checked').length > 0) {
                    shipString += '|P';
                }
 
                $('#itemSellerInfo').val(shipString);
 
                var myLoc = $('#itemSellerInventoryLocationID').val();
                var myTitle = $('input[name=\"itemTitle\"]').val();
                saveLocation = JSON.stringify({'lastLocation': myLoc, 'lastTitle': myTitle});
                window.postMessage (saveLocation, '*');
 
                $('#form1').submit();
            } else {
                var errorMessage = 'Please correct the following errors:';
                errors.forEach(function(error) {
                    errorMessage += '\n* ' + error;
                });
                alert(errorMessage);
                if(focus.length > 0) {
 
                    focus.forEach(function(el) {
                        invalidElement(el);
                    });
 
 
                    focus[0].focus();
                    $('html, body').animate({
                        scrollTop: $(focus[0]).offset().top // TODO: jquery dumb
                    }, 1000);
                }
//                console.dir(focus);
            }
        } else {
            if ($('#dim1').val().length && $('#dim2').val().length && $('#dim3').val().length) {
                if ($('#currentShipCalcType').val().length) {
                    $('.useButton:visible').first().trigger('click');
                } else {
                    $('#calc-general').trigger('click');
                }
            } else {
                var switched = false;
                $('.shipCalcInput').each(function(){
                    if ($(this).val().length < 1 && switched == false) {
                        $(this).focus();
                        switched = true;
                    }
                });
            }
        }
    });
 
    function buttonClickAnimate(button) {
        var myBGColor = button.css('background-color');
        button.animate({'background-color' : darken(button.css('background-color'), .1)},250).animate({'background-color' : myBGColor},400);
//        button.css();
        if ($('#gesMN_checkMark').length < 1) {
            button.after("<div id='gesMN_checkMark' style='float:left; font-size: 30px; color:#00e600; position: relative; top: -10px;'>&#10004;</div>");
        } else {
            $('#gesMN_checkMark').html('&#10004;').css('color', '#00e600');
        }
    }
    function darken(color, modifier) {
        var parts = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete(parts[0]);
        for (var i = 1; i <= 3; ++i) {
            parts[i] = Math.min(Math.ceil(parts[i]*(1-modifier)), 255);
        }
        return 'rgb(' + parts[1] + ',' + parts[2] + ',' + parts[3] + ')';
    }
    function darkenElement(element, modifier) {
        var bgColor = element.css('background-color');
        dark = darken(bgColor, modifier);
        darker = darken(bgColor, modifier*2);
        console.log(dark);
        console.log(darker);
        element.css({'background-color' : darker, /*'border-color' : borderColor*/}).animate({
            'background-color' : dark,
        }, 500);
 
    }
 
    function combineCheck(){
// This function is deprecated. At present, for ALL collectibles posts, combining is disabled by default.
        var noCombine = false;
        var myWeight = $('#itemWeight').val();
        if (myWeight >= 20) {
            console.log('badWeight: >= 20');
            noCombine = true;
        } else if ($('#combineCheck').html() != 'true') {
            var myCat = $('#catID').val();
            var badCats = ['Paintings', 'Prints', 'Strings', 'Brass', 'Formalwear', 'Outerwear', 'Wedding > Dresses', 'Lamps', 'Dinnerware', 'Sewing Machines', 'Typewriters', 'Receivers', 'Turntables', 'Dinnerware', 'Trains'];
            $.each(badCats, function(index, category){
               if (myCat.indexOf(category) >= 0)  {
                   noCombine = true;
                   console.log('badCat: ' + category);
               }
            });
            if (noCombine == false) {
               var myDescription = '';
               if (typeof $('#WebWizRTE').contents()[0]['body']['innerText'] != 'undefined') {
                  var myDesc = $('#WebWizRTE').contents()[0]['body']['innerText'].replace(/(?:\r\n|\r|\n)/g, '').toLowerCase();
               }
               var myTitle = $('#itemTitle').val().toLowerCase();
               var badWords = ['Framed', 'Saxophone', 'Guitar', 'Keyboard', 'Trombone', 'Telescope', 'Saxophone', 'Lamp', 'Snowboard', 'Skateboard', 'Glass', 'Crystal', 'Cast iron', 'Tool', 'Drum', 'Sewing machine', 'Typewriter', 'Printer', 'Desktop', 'Receiver', 'Turntable', 'Monitor'];
//                console.log(myDescription);
//                console.log(myTitle);
               $.each(badWords, function(index, word){
                   word = word.toLowerCase();
                   if (myDescription.indexOf(word) >= 0 || myTitle.indexOf(word) >= 0)  {
                       noCombine = true;
                       console.log('badWord: '+word);
                   } else {
                   }
               });
               if (noCombine == false && (myCat.indexOf('Speaker') >= 0 || myTitle.indexOf('speaker') >= 0 || myDescription.indexOf('speaker') >= 0) && myWeight > 5) {
                   noCombine = true;
                   console.log('badWeight (speaker)');
               }
            }
        }
        if (noCombine == true) {
            console.log('no combine');
            $('#itemNoCombineShipping').attr('checked', true);
        } else {
            console.log('combine');
            $('#itemNoCombineShipping').attr('checked', false);
        }
    }
 
    function dummyWeight() {
        if ($('#itemWeight').val().length < 1) {
           $('#itemWeight').val(1);
        }
        if ($('#itemDisplayWeight').val().length < 1) {
            $('#itemDisplayWeight').val(1);
        }
    }
 
    function invalidElement(el) {
        el.style.backgroundColor = '#faa';
        el.classList.add('ges_invalid');
        return false;
    }
    function validElement(el) {
        el.style.backgroundColor = '';
        el.classList.remove('ges_invalid');
        return false;
    }
 
    function getElement(queryString) {
        if (queryString.indexOf('#') == 0) {
            return document.getElementById(queryString.replace('#',''));
        } else {
            return document.querySelectorAll(queryString)[0];
        }
    }
    function getElements(queryString) {
        return document.querySelectorAll(queryString);
    }
    function titleCharactersRemaining() {
        var itemTitle = getElement('#itemTitle');
        var titleChars = Number(itemTitle.value.length);
        var maxLength = 50; //Number(itemTitle.getAttribute('maxlength'));
        var rem = maxLength-titleChars;
        var remaining = Math.max(rem, 0);
        getElement('#myCounter').innerHTML = remaining;
        if (rem != remaining) {
            getElement('#itemTitle').style.backgroundColor = '#faa';
            getElement('#itemTitle').value = getElement('#itemTitle').value.substring(0,50);
            alert('Your title was too long, and got cut off.')
        } else {
            getElement('#itemTitle').style.backgroundColor = '';
        }
        return false;
    }
 
    function hide(el){
        el.style.display = 'none';
        el.classList += 'gesHidden';
        return false;
    }
    function show(el){
        el.style.display = '';
        return false;
    }
    function addCSS(element, styleText) {
        element.style.cssText +=';'+ styleText;
        return false;
    }
 
 
    $('#gesMN_useThisButton').bind('click', function(){
       buttonClickAnimate($(this));
       var method;
       var actualWeight = $('#gesMN_actualWeight').val();
       var shippingWeight = 0;
       var shippingCharge = 0;
        console.log(actualWeight);
       if ($('#gesMN_shippingWeight:visible').length > 0) {
           shippingWeight = $('#gesMN_shippingWeight').html();
           $('#itemShipMethod').val(2);
           $('#itemAutoInsurance').attr('checked', false);
           console.log(shippingWeight);
       } else if ($('#gesMN_shippingCharge:visible').length > 0) {
           shippingWeight = actualWeight;
           $('#itemShipMethod').val(3);
           $('#itemAutoInsurance').attr('checked', true);
           shippingCharge = $('#gesMN_shippingCharge').html();
       } else {
           shippingWeight = actualWeight;
           $('#itemShipMethod').val(0);
           $('#itemAutoInsurance').attr('checked', false);
       }
       $('#itemWeight').val(shippingWeight);
       $('#itemDisplayWeight').val(actualWeight);
       $('#itemShippingPrice').val(shippingCharge);
    });
 
    var gallery = false;
    $('b:contains("Uploaded Files")').parent().parent().siblings().each(function(){
       if($(this).children().first().text().indexOf(' Cropped') >= 0) {
//           gallery = true; // disabled per Nicole H. 10/14/16
       }
    });
    if (gallery) {
//        $('#galleryCB2').trigger('click'); // disabled per Nicole H. 10/14/16
    }
 
}, 3000);
 
$('#itemstarttime option').first().after('<option value="00:01">12:01am PT</option>');
 
if (debug === true) {
    $('body').append("<div id='debugContainer'>Debug <input id='debugBox' type='checkbox'></div>");
    $('#debugContainer').css({
        'position' : 'absolute',
        'top' : '100px',
        'right' : '10px',
    });
    $('#debugBox').bind('click', function(){
        if ($('#debugBox:checked').length>0) {
           if ($('#debugOptionsContainer').length <= 0) {
               $('#form1, #noCombineShippingContainer, #autoInsuranceContainer').show();
               $('#noCombineShippingContainer, #autoInsuranceContainer').wrapAll("<div id='debugOptionsContainer' style='margin: 8px; padding: 10px; border: 1px solid #CCC;'></div>");
               $('#itemLength').parent().parent().appendTo($('#debugOptionsContainer')).show();
               $('#itemShipLength').parent().parent().appendTo($('#debugOptionsContainer')).show();
               $('#debugOptionsContainer span, #debugOptionsContainer br').remove();
           } else {
               $('#debugOptionsContainer').show();
           }
        } else {
            $('#debugOptionsContainer').hide();
        }
    });
}
 
$('#incrementReserveBox').parent().parent().hide();
$('#UPS').css('background-color', "#AAA");
 
// End