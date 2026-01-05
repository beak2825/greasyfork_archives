// ==UserScript==
// @name       Geeklist Tweaks
// @namespace  tequila_j-script
// @version    0.8.3
// @description  Various tweaks to improve BGG (boardgamegeek.com). 
// 
// @match      https://boardgamegeek.com/geeklist/*
// @match      https://www.boardgamegeek.com/geeklist/*
// @match      http://boardgamegeek.com/geeklist/*
// @match      http://www.boardgamegeek.com/geeklist/*
// @require	https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.7.1/clipboard.min.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/22820/Geeklist%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/22820/Geeklist%20Tweaks.meta.js
// ==/UserScript==


function isMobileDevice() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

GM_addStyle(`
div.t-nav-container {
	position: absolute;
	//top: 0px;
	//right: -35px;
	top: -2px;
	right: 0px;
    background-color: rgba(120,120,180,0.4);
    border-radius: 5px;
    //opacity: 0.5;
	//height: 50px;
	text-align: center;
	padding: 3px 3px;
	opacity: 0.4;
}

div.t-nav-container:hover {
    opacity: 0.95;
}

div.t-nav-container span.fa {
	font-size: 16px;
	padding: 0px 3px;
	cursor: pointer;
}

div.t-nav-container span.fa-workaround {
	font-size: 16px;
	padding: 0px 3px;
	margin: 0px 2px;
	background-color: #090909;
	cursor: pointer;
	border-radius: 2px;
	color: white;
}

div.box-new-items:hover {
	opacity: 1;
}
div.box-new-items {
    position: fixed;
    bottom: 0px;
    /* height: 20px; */
    background-color: lightgray;
    right: 7px;
    font-size: x-small;
    padding: 2px 5px;
    border-radius: 3px;
    opacity: 0.7;
}

a.tj_geeklist-number {
  position: relative;
}

div.tj_url-copy-helper {
  position: absolute;
  display:none;
  background-color: rgba(120,120,180,0.4);
  color: black;
  border-radius: 3px;
  padding: 3px;
  right: -18px;
  top: -14px;
}

a.tj_geeklist-number:hover div.tj_url-copy-helper {
  display:block;
}

div.geekitem_flash_info {
  position: fixed;
  top:50px;
  left: 0;
  right:0;
  opacity: 0.9;
  background: #d0cece;
}

`);


if (isMobileDevice()) {
  console.debug("Mobile View");
  GM_addStyle(`
  div.t-nav-container span.fa {
    font-size: 28px;
    padding: 0px 15px;
    marging: 0px 7px;
    cursor: pointer;
  }
  div.t-nav-container span.fa-workaround {
    font-size: 28px;
    padding: 0px 15px;
    marging: 0px 7px;
    cursor: pointer;
  }
`);
}

var __tj = {
  'gap' : -75,
  show_gotosubbed: false
}



function urlParam(param) {
  var vars = {};
  window.location.href.replace(location.hash, '').replace(
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function (m, key, value) { // callback
      vars[key] = value !== undefined ? value : '';
    }
  );

  if (param) {
    return vars[param] ? vars[param] : null;
  }
  return vars;
}

function insertParam(key, value, url) {
  key = escape(key); value = escape(value);
  var hash = url.substring(url.indexOf("#"));
  var localurl = url.substring(0, url.indexOf("#"));
  var urlparts = localurl.split('?');
  var resultquerystring = "";

  if (urlparts.length <= 1) { //there isn't a query string
    resultquerystring += '?' + key + '=' + value;
  }
  else { //there is query strings
    var pairs = urlparts[1].split("&");
    for (var i = 0; i < pairs.length; i++) {
      var t = pairs[i].split('=');
      if (t[0] == key) {
        if (value) {
          t[1] = value;
          pairs[i] = t.join('=');
        }
        else
          pairs[i] = t[0];
        break;
      }
    }
    //this will reload the page, it's likely better to store this until finished
    resultquerystring = pairs.join('&');
  }
  return urlparts + resultquerystring + hash;
}


$(document).ready(function () {
  'use strict';
  /*jshint multistr: true */

//  $("head").append(
//    '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css" rel="stylesheet" type="text/css">'
//  );

  //Crete a container to display geekitem
  var $geekintemflash = $('<div class="geekitem_flash_info"></div>');
  $('body').append($geekintemflash);

  function displayGeekItemHeader(event, element) {
    $geekintemflash.finish().hide();
    event.preventDefault();
    //geeklists has class mb5, so, we ignore then
    console.log($(element).attr('class'));
    if ($(element).parent().hasClass('mb5')) return true; //this is a geekitem list, we do not need to show anything
    //display geekitem title
    var $element = $(element);
    var gl = $element.parents('div.mb5').find('div.geeklist_item_title:first');
    if (typeof gl === undefined) return true;
    
    $geekintemflash.html($(gl).clone());
    $geekintemflash.show().delay(3000).fadeOut('fast');
	}

  $(document).on( "scrollFinished",displayGeekItemHeader);



  //add a parameter to geeklist items so you can have no auto scroll between people that uises the script
  // also, put a small icon to copy url
  $(".geeklist_item_title > .fl").each(function () {
    var $this = $(this);
    if ($this.children('a').length < 2) return true; //this is not a geeklist item in a geeklist , it is just a direct item (only shows this item in page)
    var $listNumber = $this.children('a:first');
    $listNumber.addClass("tj_geeklist-number");
    var url = $listNumber.attr('href');
    var newurl = insertParam('__ns', 't', url);
    $listNumber.attr('href', newurl);
    var copyLink = $('<div class="tj_url-copy-helper"><i class="fa fa-files-o" aria-hidden="true"></i></div>');
    copyLink.attr('data-clipboard-text', $listNumber[0].href);
    copyLink.click(function (event) { event.preventDefault() });
    $listNumber.append(copyLink);
    new Clipboard(copyLink[0]);//convert jquery to htmlelemnt
  });


  //lets find items, excluding multiple comments
  var firstItems = [];
  var nonFirstItems = [];

  var geekItems = $('div.mb5');
  var geekSubbedPosition = -1;

  for (var i = 0; i < geekItems.length; i++) {
    var thisGI = $(geekItems[i]);
    var newSI = thisGI.find('div.subbed_selected,div.subbed');
    var firstIsGeekItem = false;
    if (newSI.length > 0) {
      var el = newSI[0];
      firstItems.push(newSI[0]);
      firstIsGeekItem = $(el).attr('data-objecttype') == "listitem";
      geekSubbedPosition = firstItems.length - 1
    }
    if (newSI.length > 1 && firstIsGeekItem) {
      firstItems.push(newSI[1])
      geekSubbedPosition = firstItems.length - 1;
    }
  }

  //  console.log('New items in geeklists:' + firstItems.length);

  //we will try to find comments at the end of the page also
  var pageComments = $('div.mb5:first').parent().children('div:not(.mb5)').find('div.comment_ctrl').find('div.subbed_selected,div.subbed');
  console.log(pageComments);
  if (pageComments.length > 0) {
    firstItems.push(pageComments[0]);
    geekSubbedPosition = firstItems.length - 1;
    //    console.log("New page comments also ");
  }

  //  console.log("Size: " + firstItems.length);

var iconUp = $('<span class="fa-workaround">&lt;&lt;</span>');
var iconDown = $('<span class="fa-workaround">&gt;&gt;</span>');
var iconNew = $('<span class="fa fa-ellipsis-h" aria-hidden="true"></span>');
var iconBox = $('<div class="t-nav-container"></div>');



  $(firstItems).each(function (index) {

    var thisItem = $(this);

    thisItem.css('position', 'relative');

    var iconContainer = iconBox.clone();
    thisItem.append(iconContainer);

    thisItem.find("dl.commentbody > dd.right").css("padding-right", "40px");
    //go new
    if (__tj.show_gotosubbed) {
      if (!$(firstItems[index]).hasClass('subbed_selected')) {
        var upI = iconNew.clone();
        upI.click(function () {
          $( document ).trigger( "scrollFinished", [ firstItems[geekSubbedPosition ] ]);
          $("html, body").animate({ scrollTop: $(firstItems[geekSubbedPosition]).offset().top + __tj.gap }, "fast");
          console.log("subbed");
          return false;
        });
        iconContainer.append(upI);
      } else {
        iconContainer.append(iconNew.clone().css('visibility', 'hidden'));
      }
    }

    //go up
    if (index != 0) {
      var upI = iconUp.clone();
      upI.click(function () {
        $( document ).trigger( "scrollFinished", [ firstItems[index - 1] ] );        
        $("html, body").animate({ scrollTop: $(firstItems[index - 1]).offset().top + __tj.gap }, "fast");
        console.log("up");
        return false;
      });
      iconContainer.append(upI);

    } else {
      iconContainer.append(iconDown.clone().css('visibility', 'hidden'));
    }

    //go down
    if (index != firstItems.length - 1) {
      var downI = iconDown.clone();
      downI.click(function () {
        $( document ).trigger( "scrollFinished", [ firstItems[index + 1] ] );
        $("html, body").animate({ scrollTop: $(firstItems[index + 1]).offset().top + __tj.gap }, "fast");
        console.log("down");
        return false;
      });
      iconContainer.append(downI);
    } else {
      iconContainer.append(iconUp.clone().css('visibility', 'hidden'));
    }

  });

  //lets see if this is a selected article (user clicked to see a subjetc, not new items). 
  //If not, We can scroll to the top of the list
  if ($("div.article.selected").length == 0 && urlParam("__ns") == null) {
    $("html, body").scrollTop($(firstItems[0]).offset().top + __tj.gap);
    $( document ).trigger( "scrollFinished", [ $(firstItems[0]) ] );
  } else {
    $( document ).trigger( "scrollFinished", [ $(selectedUrlItem) ] );
  }

    

  //puts a small box saying how many new items are here:
  var news = $(document.createElement("div")).addClass("box-new-items");
  $("body").append(news);
  news.html("New items in this page: " + $('div.subbed_selected,div.subbed').length);

});

