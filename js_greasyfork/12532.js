// ==UserScript==
// @name           Fotostrana Auto
// @version        1.037
// @namespace      localhost
// @author         EnterBrain
// @description    Plugin for easy like in fotostrana
// @icon           http://st.fotocdn.net/app/mobile/img/apple-touch-icon-precomposed.png
// @icon64         http://st.fotocdn.net/app/mobile/img/apple-touch-icon-precomposed.png
// @unwrap
// @run-at         document-end
// @include        *fotostrana.ru/*
// @match          *fotostrana.ru/*
// @grant          all
// @require        http://code.jquery.com/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/12532/Fotostrana%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/12532/Fotostrana%20Auto.meta.js
// ==/UserScript==


var LastVoteID = -1;
var LastPhotoID = -1;
var timerLike = 1000;		// Кд отправки запросов данных 1 секунда = 1000 миллисекунд.
var i = 0;
var countCheck = 0;
var LastPage = "";

function GetVoteID(stringURL){
	var param = /contest\/(\d+)\//gim.exec(stringURL);
	if (param){
		return parseInt(param[1]);
	}
	return 0;
}

function GetPhotoID(stringURL){
	var param = /fsrating=photoid-(\d+)/gim.exec(stringURL);
	if (param){
		return parseInt(param[1]);
	}
	return 0;
}

function CheckLastPage(page){
	if (LastPage == ""){
		LastPage = page;
	} else if (LastPage != page){
		LastVoteID = -1;
		LastPhotoID = -1;
		countCheck = 0;
		LastPage = page;
	}
}

function FuncAuto(){
	var localUrl = new String( window.location );
	if (/\/\S*fsrating=photoid\S*/gim.exec(localUrl)){
		CheckLastPage("fsrating");
		if ($("#fsr-photo:not(.d-n)").length==1){
			var CurentPhotoID = GetPhotoID(localUrl);
			if ((CurentPhotoID > 0 && CurentPhotoID != LastPhotoID) || countCheck >= 2){
				if (!$("#fsr-photo-like-fs").hasClass("active") && $("#fsr-photo .fsr-photo-like").css("display")=="inline-block"){
					$("#fsr-photo .fsr-photo-like").click();
				} else {
					$("#fsr-photo .fsr-photo-unlike").click();
				}
				LastPhotoID = CurentPhotoID;
				countCheck = 0;
			} else {
				countCheck++;
			}
		}
	} else if (/\/contest\/\S*/gim.exec(localUrl)){
		CheckLastPage("contest");
		if($("#node-heap > #iPopup").length==1){
			var CurentVoteID = GetVoteID(localUrl);
			if (CurentVoteID > 0 && CurentVoteID != LastVoteID || countCheck >= 2){
				var param = /Сегодня вы проголосовали бесплатно (\d+) раз/gim.exec($(".contest-popup-today-votes-inner").html())
				if (param){
					if (parseInt(param[1]) < 10000){
						if ($(".js-contest-popup-btn-free").length==1){
							$(".js-contest-popup-btn-free").click();
                            LastVoteID = CurentVoteID;
						} else if ($(".js-contest-popup-btn-next").length==1){
							$(".js-contest-arrow-next").click();
                            LastVoteID = CurentVoteID;
						}
					}
				}
				countCheck = 0;
			} else {
				countCheck++;
			}
		}
	} else if (/\/clanbattle\//gim.exec(localUrl)){
		CheckLastPage("clanbattle");
		if($("#node-heap > #iPopup.clan-popup-votesFeed").length==1){
            $("span.clan-btn-wrap-orange:not(.clan-disabled) > .clan-btn:first").click();
		}
		if ($("#node-heap > #iPopup.cteam-popup").length==1){
			if ($("div.cteam-popup-content > div.cteam-popup-buttons span.clan-btn-wrap-orange:not(.clan-disabled)").length==1){
				$("div.cteam-popup-content > div.cteam-popup-buttons span.clan-btn-wrap-orange:not(.clan-disabled) > .clan-btn:first").click();
			} else {
				$("div.cteam-popup-content > span.cteam-popup-trigger-next").click();
			}
		}
	} else if (/\/meeting\//gim.exec(localUrl)){
		CheckLastPage("meeting");
        if($('#meeting-lock-block').length==1){
            meeting.switchGame.disabled = false;
            meeting.timer.remove();
            meeting.context.clicks.hourClicks = 0;
            $('#meeting-lock-block').remove();
        }
    }
	window.setTimeout(FuncAuto, timerLike);
}FuncAuto();