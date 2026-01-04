// ==UserScript==
// @name         Youtube Fix
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Helps removing garbage from your recommended videos, adds a scrollbar for videos while watching
// @author       Bum
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_addStyle
// @match        https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/387447/Youtube%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/387447/Youtube%20Fix.meta.js
// ==/UserScript==
var currentVideoId = "";

var exclusionListFix = null;
var betterBackgroundColour = "#212121";
var removeVideoBackground = true;


if (localStorage.getItem("excludeVideosFromYoutube") != null) {
    exclusionListFix = localStorage.getItem("excludeVideosFromYoutube").toUpperCase().split(";");
}

if (localStorage.getItem("backgroundColourFix") != null) {
    betterBackgroundColour = localStorage.getItem("backgroundColourFix");
    document.querySelector(':root').style.setProperty('--yt-spec-base-background', betterBackgroundColour);
}

if (localStorage.getItem("removeVideoBackground") != null) {
    betterBackgroundColour = localStorage.getItem("removeVideoBackground");
    removeCinematics('none');
}
else{
    removeVideoBackground = false;
}
function removeCinematics(display){
    GM_addStyle(`
#cinematics{
display:` + display +` !important;
}
`);
}

jQuery(document).ready(_main);
function _addScrollBarComments() {
    var isReady = $("ytd-comment-thread-renderer").length > 0;
    if (!isReady) {
        setTimeout(_addScrollBarComments, 500);
        return;
    }
    jQuery("#comments").wrap("<div id='commentsWrapper' class='scrollbar style-3'></div>");
    $('div.scrollbar').bind('mousewheel DOMMouseScroll', function(e) {
        var scrollTo = null;
        if (e.type == 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -1);
        } else if (e.type == 'DOMMouseScroll') {
            scrollTo = 40 * e.originalEvent.detail;
        }

        if (scrollTo) {
            $("#items").trigger( "mouseover" );
            $("ytd-compact-video-renderer").trigger( "mouseover" );
            $("ytd-thumbnail").trigger( "mouseover" );
            $(".yt-simple-endpoint").trigger( "mouseover" );
            $(".ytd-compact-video-renderer").trigger( "mouseover" );
            $(".secondary-metadata").trigger( "mouseover" );
            $(this).scrollTop(scrollTo + $(this).scrollTop());
        }

    });
}
function _main() {
        var isReady = jQuery("ytd-compact-video-renderer").length > 0;
        if (!isReady) {
            setTimeout(_main, 500);
            return;
        }
        $("#related").find("div#items").wrap("<div class='scrollbar style-3'></div>");
        $('div.scrollbar').bind('mousewheel DOMMouseScroll', function(e) {
            var scrollTo = null;
            if (e.type == 'mousewheel') {
                scrollTo = (e.originalEvent.wheelDelta * -1);
            } else if (e.type == 'DOMMouseScroll') {
                scrollTo = 40 * e.originalEvent.detail;
            }

            if (scrollTo) {
                e.preventDefault();
                $(this).scrollTop(scrollTo + $(this).scrollTop());
            }

        });

}

function getMenuItem(id, display, checked){

    var res = "";
    if (checked == "true" || checked == true)
        res ='<div><input type="checkbox" checked class="enhancCheck" id="fix'+id+'" name="'+id+'" value="'+display+'">  <label for="fix'+id+'">'+display+'</label> </div>';
    else
        res ='<div><input type="checkbox" class="enhancCheck" id="fix'+id+'" name="'+id+'" value="'+display+'">  <label for="fix'+id+'">'+display+'</label> </div>';
    return res;
}

function AddCleaner(){
    var theButtonsMenu = $("#contents");
    let isReady = theButtonsMenu.length > 0;
        if (!isReady) {
            setTimeout(AddCleaner, 2000);
            return;
        }

    var targetNodeVideos = $("#contents").first().get(0);
    var configRoot = { attributes: false, childList: true, subtree: true };
    var callbackVideos = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            mutation.addedNodes.forEach(function(node) {
                if ($(node).hasClass("ytd-rich-item-renderer")){
                    if (exclusionListFix != null){
                        var currentTitle = $(node).find("#video-title").text();
                        for (var i = 0; i < exclusionListFix.length; i++) {
                            if (currentTitle.trim().toUpperCase().indexOf(exclusionListFix[i].trim()) > -1) {
                                $(node).closest("ytd-rich-item-renderer").css("display","none");
                            }
                        }
                    }
                }
            });
        }
    };
    var observerVideos = new MutationObserver(callbackVideos);
    observerVideos.observe(targetNodeVideos, configRoot);

    $("#masthead-container").find("#end").prepend(`<div class="enhanceButton" style="
    background: url(https://i.imgur.com/kWu713g.png);
    background-size: 22px;
    background-repeat: no-repeat;
    background-position: center; width: 25px;
    height: 25px;
    cursor: pointer;"></div>`);

      var enhanceSettings = `
    <div class="enhancecontainer" style="display:none;">

    </div>
    `;

    $("body").append(enhanceSettings);

    $(".enhancecontainer").append(`<div class="excludeThisPlease" '="" style="
    flex: 1;
"><label for="excluding" style="
    display: flex;
">Exclude these keywords, separate by ; example: Tik Tok;Zendaya;Fortnite</label><textarea id="exclusionListFix" name="excluding" rows="5" cols="33" style="
    display: flex;
    width: 100%;
">
</textarea></div>`);

$(".enhancecontainer").append(`<div>
<label> Custom background: </label><input type="text" id="custombgvalue" name="custombgval" value="#212121"></div`);

    if (localStorage.getItem("backgroundColourFix") != null) {
        betterBackgroundColour = localStorage.getItem("backgroundColourFix");
        $("#custombgvalue").val(betterBackgroundColour);
    }


    $(".enhancecontainer").append(getMenuItem('removeVideoBg','Remove background video effects',removeVideoBackground));

    $("#fixremoveVideoBg").change(function() {
        removeVideoBackground =$(this).prop('checked');
    });

    $(".enhancecontainer").append('<button id="enhanceSaveExclude" type="button">Save</button>');

    $(".enhanceButton").click(function(){
        $(".enhancecontainer").toggle();
        $("#exclusionListFix").val(localStorage.getItem("excludeVideosFromYoutube"));
    });

    $("#enhanceSaveExclude").click(function(){
        $(".enhancecontainer").toggle();
        localStorage.setItem("excludeVideosFromYoutube", $("#exclusionListFix").val());
        exclusionListFix = $("#exclusionListFix").val().toUpperCase().split(";");
        //######## custom background
        if ($("#custombgvalue").val() != ""){
            localStorage.setItem("backgroundColourFix", $("#custombgvalue").val());
             document.querySelector(':root').style.setProperty('--yt-spec-base-background', $("#custombgvalue").val());
        }
        else{
            localStorage.removeItem("backgroundColourFix");
             document.querySelector(':root').style.setProperty('--yt-spec-base-background', '#0f0f0f');
        }

        //########## remove retarded cinematics
        if (removeVideoBackground == true ||removeVideoBackground == "true"){
            removeCinematics("none");
            localStorage.setItem("removeVideoBackground", $(this).prop('checked'));
        }
        else{
            removeCinematics("block");
            localStorage.removeItem("removeVideoBackground");
        }

    });


}

(function() {

    AddCleaner();

    GM_addStyle(`
.scrollbar
{
	margin-left: 30px;
    max-height: `+ ($( document ).height() - 300)+`px;
	float: left;
	overflow-y: scroll;
	margin-bottom: 25px;
}
`);

        GM_addStyle(`
    .enhancecontainer {
display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background: rgb(40, 40, 40);
    padding: 10px;
    width: 200px;
    position: fixed;
    right: 100px;
    z-index: 99999;
    margin-top: 66px;
    width: 500px;
    height: auto;
    flex-direction: column;
    color: white;
font-size: small;
}
    `);

    GM_addStyle(`
    .enhancecontainer div{
 padding-bottom: 5px;
}
    `);


    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyle") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }
    function RemoveCssRule(css) {
        const style = document.getElementById("GM_addStyle") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyle";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        for (var i=0; i<sheet.cssRules.length; i++) {
            if (sheet.cssRules[i].selectorText == css) {
                sheet.deleteRule (i);
            }
        }
        console.log(style.sheet);
    }


    GM_addStyle(`

div#hover-overlays {
    display: none !important;
}
`);
    GM_addStyle(`
   .style-3::-webkit-scrollbar-track
{
	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
	background-color: #F5F5F5;
}
`);
    GM_addStyle(`
.style-3::-webkit-scrollbar
{
	width: 6px;
	background-color: #F5F5F5;
}
`);
    GM_addStyle(`
.style-3::-webkit-scrollbar-thumb
{
	background-color: #000000;
}
`);
    GM_addStyle(`
#commentsWrapper
{
    padding-right:10px;
    position:absolute;
    right:0;
    margin-right:200px;
    margin-top:25px;
    max-width:600px;
}
`);
})();