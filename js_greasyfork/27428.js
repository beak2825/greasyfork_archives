// ==UserScript==
// @name        WaniKani Kustom audio
// @namespace   nelemnaru
// @description Kustom play audio in WaniKani
// @include     *://www.wanikani.com/review/session*
// @version     1.1
// @license     none
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27428/WaniKani%20Kustom%20audio.user.js
// @updateURL https://update.greasyfork.org/scripts/27428/WaniKani%20Kustom%20audio.meta.js
// ==/UserScript==


$("#question-type").after("<div id='audiowrap'></div>");

        $("#audiowrap").click(function() {
            if ($.jStorage.get("currentItem").voc && $.jStorage.get("questionType") === "reading") {
                $(".kustomaudio")[0].play();
            }
        });

$("#option-audio span").hide();
$("#option-audio").append("<span id='kustomicon' style='-moz-user-select: none;'></span>");

$("#kustomicon").click(function() {
     $(".kustomaudio")[0].play();
});

var currentItem, questionType;

console.log("Kustom audio script loaded");

$.jStorage.listenKeyChange('currentItem', function() {

    currentItem = $.jStorage.get("currentItem");
    questionType = $.jStorage.get("questionType");

    if (currentItem.voc && questionType === "reading") {
        //video tag used because WK removes audio tag (I think after changing question)
		//$(".kustomaudio").remove();
        audioElem = $("<video></video>", { preload: "auto", class: "kustomaudio", style:"display:none" })//.prependTo($("#audiowrap"));
            $("<source></source>", {
                src: "https://s3.amazonaws.com/s3.wanikani.com/audio/" + currentItem.aud,
                type: "audio/mpeg"
            }).appendTo(audioElem);
			$("#audiowrap").html(audioElem)
        
		$("#kustomicon").text("矧");
		
//        $("#audiowrap").click();
    } else 
		if (!currentItem.voc) $("#kustomicon").text("縲");

});

