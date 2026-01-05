// ==UserScript==
// @name         Twitch Chat Manager
// @namespace    http://your.homepage/
// @version      0.2
// @description  Tool for watching chat to hopefully help streamers / people communicating.
// @author       Necromunger
// @match        http://www.twitch.tv/*/chat*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js
// @resource     toastr https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/11434/Twitch%20Chat%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/11434/Twitch%20Chat%20Manager.meta.js
// ==/UserScript==

var cSearchText = "searchText";
var cExcludeText = "excludeText";

var currentCompareSearchArray = [];
var currentCompareExcludeArray = [];

var highlightTextArray = [];

var subHighlightColor = "#DDDDDD";
var modHighlightColor = "#DDDDDD";

GM_addStyle (GM_getResourceText ("toastr"));
GM_addStyle(".excluder { top: 0px; right: 0px; position: absolute; margin-top: 8px; margin-right: 15px; }");
GM_addStyle(".excluderPopup { top: 45px; right: 15px; position: absolute; z-index: 1000000; background-color: #FFFFFF; border: solid 1px #bbbbbb; }");
GM_addStyle(".optionHeading { background: #6441a5; color: #FFFFFF; padding: 6px; cursor: pointer; border-bottom: solid 1px #bbbbbb;}");
GM_addStyle(".optionHeading h3 { font-size: 14pt; }");
GM_addStyle(".optionHeading h3 span { position: absolute; right: 10px; font-size: 35px; margin-top: -12px;}");
GM_addStyle(".optionContent { padding: 10px;}");

GM_addStyle(".colorpicker { position: absolute; height: 20px; width: 40px; cursor: pointer; border: solid 1px black;}");
GM_addStyle(".cp-color-picker { z-index: 10000001; }");

toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-left",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

//hardcoded vector for gear symbol
var gearHtml = '<svg height="16px" version="1.1" viewBox="0 0 16 16" width="16px" x="0px" y="0px" style="margin: 0px;">'+
  '<path clip-rule="evenodd" d="M15,7v2h-2.115c-0.125,0.615-0.354,1.215-0.713,1.758l1.484,1.484l-1.414,1.414l-1.484-1.484C10.215,12.531,9.615,12.76,9,12.885V15H7v-2.12c-0.614-0.126-1.21-0.356-1.751-0.714l-1.491,1.49l-1.414-1.414l1.491-1.49C3.477,10.211,3.247,9.613,3.12,9H1V7h2.116C3.24,6.384,3.469,5.785,3.829,5.242L2.343,3.757l1.414-1.414l1.485,1.485C5.785,3.469,6.384,3.24,7,3.115V1h2v2.12c0.613,0.126,1.211,0.356,1.752,0.714l1.49-1.491l1.414,1.414l-1.49,1.492C12.523,5.79,12.754,6.387,12.88,7H15z M8,6C6.896,6,6,6.896,6,8s0.896,2,2,2s2-0.896,2-2S9.104,6,8,6z" fill-rule="evenodd"'+ 
  'style="margin-left: 10px;"></path></svg>';

//main html
$("body").append('<div class="excluder"><button id="btnExcluderPopup" class="button primary float-right send-chat-button"><span>Filter Options</span></button></div>');
$("body").append('<div class="excluderPopup" style="display: none;">'+
                     '<div id="textFilterHeader" class="optionHeading"><h3>Text Filter<span>+</span></h3></div>'+
                     '<div id="textFilterContent" class="optionContent">'+
                         '<div><button id="btnFilterSwitch" class="button primary float-right send-chat-button"><span>Enabled</span></button></div>'+
                         '<div style="font-size: 10pt;"><span style="font-weight:bold;">Enter comma seperated list.</span> Example: 1,2,test word,hello</div>'+
                         '<h3 style="font-size: 16px;">Search:</h3>'+
                         '<textarea id="txtSearchText" style="resize: vertical; margin-bottom: 0px; height: 40px; max-height: 200px;" class="ember-view ember-text-area mousetrap" placeholder="Enter text to search for"></textarea>'+
                         '<h3 style="font-size: 16px;">Exclude:</h3>'+
                         '<textarea id="txtExcludeText" style="resize: vertical; margin-bottom: 0px; height: 40px; max-height: 200px;" class="ember-view ember-text-area mousetrap" placeholder="Enter text to exclude"></textarea>'+
                         '<div style="margin-top: 5px;"><a id="btnExcluderSave" style="font-weight: bold; vertical-align: middle; cursor: pointer;">Save</a><input type="checkbox" id="chkSaveFilterWithCookie" style="vertical-align: middle; margin-left: 15px; margin-right: 5px;"><label style="display: inline-block; vertical-align: middle; margin: 0px;" for="chkSaveExclutionWithCookie">Remember text with cookie.</label></div>'+
                         '<div style="display: none;"><a id="btnClearCookies" style="font-weight: bold; vertical-align: middle; cursor: pointer;">Clear Saved Cookies</a></div>'+
                     '</div>'+
                     '<div id="highlightHeader" class="optionHeading"><h3>Highlighting<span>+</span></h3></div>'+
                     '<div id="highlightContent" class="optionContent">'+
                         '<div style="border-bottom: solid 1px #CCCCCC; padding-bottom: 7px; position: relative;"><input style="vertical-align: middle;" type="checkbox" name="checkbox" id="chkHighlightMods" value="value"><label style="display: inline-block; vertical-align: middle; margin-left: 5px; margin-bottom: 0px;" for="chkHighlightMods">Highlight Mods</label><span style="vertical-align: middle; float: right; margin-right: 55px; margin-top: -1px; display: none;">Color:</span><div class="colorpicker" id="modColorPicker" style="top: -2px; right: 5px; display: none;" value="#DDDDDD"></div></div>'+
                         '<div style="margin-top: 5px; position: relative; border-bottom: solid 1px #CCCCCC; padding-bottom: 7px;"><input style="vertical-align: middle; margin-top: 3px;" type="checkbox" name="checkbox" id="chkHighlightSubs" value="value"><label style="display: inline-block; vertical-align: middle; margin-left: 5px; margin-bottom: 0px; margin-top: 5px;" for="chkHighlightSubs">Highlight Subscribers</label><span style="vertical-align: middle; float: right; margin-right: 55px; margin-top: 3px; display: none;">Color:</span><div class="colorpicker" id="subColorPicker" style="top: 1px; right: 5px; display: none;" value="#DDDDDD"></div></div>'+
                         '<div style="margin-top: 10px; position: relative;"><textarea id="txtTextHighlight" style="clear: both; resize: vertical; height: 40px; max-height: 200px; float: left; width: 250px; margin-bottom: 10px;" class="ember-view ember-text-area mousetrap" placeholder="Enter comma seperated text to highlight"></textarea><span style="vertical-align: middle; float: right; margin-right: 55px;display: none;">Color:</span><div class="colorpicker" id="textColorPicker" style="top: 0px; right: 5px;display: none;" value="#DDDDDD"></div></div>'+
                     '</div>'+
                 '</div>');

/*
$('#modColorPicker').colorPicker({
    customBG: '#DDDDDD',
    color: '#DDDDDD',
    renderCallback: function($elm, toggled) {
        filterChat();
    }
});

$('#subColorPicker').colorPicker({
    customBG: '#DDDDDD',
    color: "#DDDDDD",
    renderCallback: function($elm, toggled) {
        filterChat();
    }
});

$('#textColorPicker').colorPicker({
    customBG: '#DDDDDD',
    color: "#DDDDDD",
    renderCallback: function($elm, toggled) {
        filterChat();
    }
});
*/

//textFilter accordian
$("#textFilterHeader").prop("expanded", true);
$("#textFilterHeader").click(function () {
    if ($(this).prop("expanded") === false) {
        $(this).prop("expanded", true);
        $(".excluderPopup").css("width", "auto");
        $("#textFilterHeader").find("span").html("+");
        $("#textFilterHeader").find("span").css("font-size","35px");
        $("#textFilterHeader").find("span").css("margin-top","-12px");
        $("#textFilterContent").slideDown();
    }
    else if($(this).prop("expanded") === true) {
        $(this).prop("expanded", false);
        $(".excluderPopup").css("width", $(".excluderPopup").width());
        $("#textFilterHeader").find("span").html("-");
        $("#textFilterHeader").find("span").css("font-size","50px");
        $("#textFilterHeader").find("span").css("margin-top","-27px");
        $("#textFilterContent").slideUp();
    }
});

//highlight accordian
$("#highlightHeader").prop("expanded", true);
$("#highlightHeader").click(function () {
    if ($(this).prop("expanded") === false) {
        $(this).prop("expanded", true);
        $("#highlightHeader").find("span").html("+");
        $("#highlightHeader").find("span").css("font-size","35px");
        $("#highlightHeader").find("span").css("margin-top","-12px");
        $("#highlightContent").slideDown();
    }
    else if($(this).prop("expanded") === true) {
        $(this).prop("expanded", false);
        $("#highlightHeader").find("span").html("-");
        $("#highlightHeader").find("span").css("font-size","50px");
        $("#highlightHeader").find("span").css("margin-top","-27px");
        $("#highlightContent").slideUp();
    }
});

if ($.cookie(cSearchText) !== undefined) {
    $("#btnClearCookies").parent().show();
    $("#chkSaveFilterWithCookie").prop('checked', true);
    $("#txtSearchText").val($.cookie(cSearchText));
    currentCompareSearchArray = $("#txtSearchText").val().split(',');
}

if ($.cookie(cExcludeText) !== undefined) {
    $("#btnClearCookies").parent().show();
    $("#chkSaveFilterWithCookie").prop('checked', true);
    $("#txtExcludeText").val($.cookie(cExcludeText));
    currentCompareExcludeArray = $("#txtExcludeText").val().split(',');
}


$("#btnExcluderPopup").click(function () {
    if ($(this).prop("expanded") === undefined || $(this).prop("expanded") === false) {
        $(this).prop("expanded", true);
        $(".excluderPopup").slideDown();
    }
    else if($(this).prop("expanded") === true) {
        $(this).prop("expanded", false);
        $(".excluderPopup").slideUp();
    }
});

$("#btnFilterSwitch").prop("enabled", false);
$("#btnFilterSwitch").css("background", "#A54141");
$("#btnFilterSwitch").find("span").html("Disabled");
$("#btnFilterSwitch").click(function () {
    if ($(this).prop("enabled") === false) {
        $(this).prop("enabled", true);
        $(this).css("background", "#6441a5");
        $(this).find("span").html("Enabled");
        filterChat();
    }
    else if($(this).prop("enabled") === true) {
        $(this).prop("enabled", false);
        $(this).css("background", "#A54141");
        $(this).find("span").html("Disabled");
        
        //unhide all chat messages
        $(".chat-line").each(function() {
            $(this).parent().show();
        });
    }
});

$("#btnExcluderSave").click(function () {
    toastr.success('Saved');
    saveFilterText();
});

$("#btnClearCookies").click(function () {
    $.removeCookie(cSearchText);
    $.removeCookie(cExcludeText);
    $(this).parent().hide();
});

$('.chat-lines').bind("DOMSubtreeModified",function(){
    filterChat();
});

$("#chkHighlightSubs").change(function () {
    filterChat();
});

$("#chkHighlightMods").change(function () {
    filterChat();
});

function filterChat() {
    
    //heiglight selected options
    $(".chat-line").each(function(index, chatValue) {
        //revert each highlight to start with
        $(this).css("background-color", "transparent");
        $(this).find(".message").css("font-weight","normal");
        $(this).parent().show();
        
        if ($("#chkHighlightMods").prop("checked") === true) {
            if ($(this).find(".moderator").length > 0) {
                $(this).css("background-color", subHighlightColor);
                $(this).find(".message").css("font-weight","bold");
            }
        }
        
        if ($("#chkHighlightSubs").prop("checked") === true) {
            if ($(this).find(".subscriber").length > 0) {
                $(this).css("background-color", subHighlightColor);
                $(this).find(".message").css("font-weight","bold");
            }
        }
        
        if ($("#txtTextHighlight").val().length > 0) {
            var highlightArray = $("#txtTextHighlight").val().split(',');
            if (highlightArray.length > 0) {
                
                var validText = false;
                $.each(highlightArray, function(index, compareValue) {
                    if($(chatValue).find(".message").text().toLowerCase().indexOf(compareValue.toLowerCase()) > -1 && compareValue.length > 0){
                        validText = true;
                        return true;
                    }
                });
                
                if (validText) {
                    $(this).css("background-color", subHighlightColor);
                    $(this).find(".message").css("font-weight","bold");
                }
            }
        }
    });
    
    
    //hide chat by text filter
    if ($("#btnFilterSwitch").prop("enabled") === true) {
        $(".chat-line").each(function(index, chatValue) {
            if (currentCompareSearchArray.length > 0 ) {
                var validCompareText = false;
                $.each(currentCompareSearchArray, function(index, compareValue) {
                    if($(chatValue).find(".message").text().toLowerCase().indexOf(compareValue.toLowerCase()) > -1){
                        validCompareText = true;
                        return true;
                    }
                });
                
                if (!validCompareText) {
                    $(this).parent().hide();
                }
            }
            
            if (currentCompareExcludeArray.length > 0 ) {
                var validText = false;
                $.each(currentCompareExcludeArray, function(index, compareValue) {
                    if (compareValue.length > 0) {
                        if($(chatValue).find(".message").text().toLowerCase().indexOf(compareValue.toLowerCase()) > -1){
                            validText = true;
                            return true;
                        }
                    }
                });

                if (validText) {
                    $(this).parent().hide();
                }
            }
        });
    }
}

function saveFilterText() {
    currentCompareSearchArray = $("#txtSearchText").val().split(',');
    currentCompareExcludeArray = $("#txtExcludeText").val().split(',');
    
    if ($("#chkSaveFilterWithCookie").prop("checked")) {
        $.removeCookie(cSearchText);
        $.removeCookie(cExcludeText);
        
        $.cookie(cSearchText, $("#txtSearchText").val(), { expires: 7 });
        $.cookie(cExcludeText, $("#txtExcludeText").val(), { expires: 7 });
        
        $("#btnClearCookies").parent().show();
    }
    filterChat();
}

//-------generic methods-------
$.fn.animateRotate = function(angle, duration, easing, complete) {
  var args = $.speed(duration, easing, complete);
  var step = args.step;
  return this.each(function(i, e) {
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
      $.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) return step.apply(e, arguments);
    };

    $({deg: 0}).animate({deg: angle}, args);
  });
};

/*
$("#btnHighlightSubsSettings").prop("expanded", false);
$("#btnHighlightSubsSettings").click(function () {
    var animationDuration = 800;
    if ($(this).prop("expanded") == false) {
        $(this).prop("expanded", true);
        $(this).animateRotate(-360, animationDuration, 'linear', function () {});
        $(this).animate({"margin-right": "120px"}, animationDuration);
    }
    else if($(this).prop("expanded") == true) {
        $(this).prop("expanded", false);
        $(this).animateRotate(360, animationDuration, 'linear', function () {});
        $(this).animate({"margin-right": "0px"}, animationDuration);
    }
});
*/