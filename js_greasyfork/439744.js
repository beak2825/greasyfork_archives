// ==UserScript==
// @name         Donderhiroba Filter & Fumen Preview
// @namespace    https://www.facebook.com/Firce777/
// @version      0.2
// @description  廣場歌單+譜面查看過濾. inspired by Alan Yeung.
// @author       You
// @match        https://donderhiroba.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439744/Donderhiroba%20Filter%20%20Fumen%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/439744/Donderhiroba%20Filter%20%20Fumen%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    scoreListFilter();
    fumenPreview();
})();

function fumenPreview(){
    var buttonsHtml = "";
    buttonsHtml += "<li>"
    buttonsHtml += "<button name='fumen_preview' style='float: right; margin-right: 25px;'>譜面</button>";
    buttonsHtml += "</li>"
    $('.songNameArea').append(buttonsHtml);

    for (var i = 0; i <$('.buttonList').length; i++) {
        var url = $('.buttonList')[i].children[3].children[0].getAttribute('href');
        url = url.replace('score_detail.php', '');
        // console.log(url);

        var wikiFumenUrl = 'https://wikiwiki.jp/taiko-fumen/%E5%8F%8E%E9%8C%B2%E6%9B%B2/%E3%81%8A%E3%81%AB/';
        var songName = $('.songName')[i].innerText;
        var uraUrl = '%28%E8%A3%8F%E8%AD%9C%E9%9D%A2%29';

        const urlParams = new URLSearchParams(url);
        var song_no = urlParams.get('song_no');
        var level = urlParams.get('level');

        $('.songNameArea')[i].childNodes[3].setAttribute('song_id', song_no);
        $('.songNameArea')[i].childNodes[3].setAttribute('level', level);

        if (level == 4) {
            $('.songNameArea')[i].childNodes[3].setAttribute('onclick',"window.open('" + wikiFumenUrl + songName + "','_blank')");
        } else if (level == 5) {
            $('.songNameArea')[i].childNodes[3].setAttribute('onclick',"window.open('" + wikiFumenUrl + songName + uraUrl + "','_blank')");
        }
    }
}

function scoreListFilter(){
	var countDonderFull = 0;
	var countGold = 0;
	var countSilver = 0;
	var countPlayed = 0;
	var countNone = 0;

	var buttonsHtml = "";
	buttonsHtml += "<button name='crown_filter' data-crown='donderfull'>全良</button>";
	buttonsHtml += "<button name='crown_filter' data-crown='gold'>全接</button>";
	buttonsHtml += "<button name='crown_filter' data-crown='silver'>合格</button>";
	buttonsHtml += "<button name='crown_filter' data-crown='played'>不合格</button>";
	buttonsHtml += "<button name='crown_filter' data-crown='none'>未遊玩</button>";

	$('.tabList').append(buttonsHtml);

	$('[name="crown_filter"]').click(function(){
		crownFilter($(this).data('crown'));
	    console.log($(this).data('crown'));
	});

	var songNameList = [];
	var crownList =[];

	$(".songName").each(function( index){
		songNameList.push($(this).html());
	});

	$(".buttonList li:nth-child(4) a img" ).each(function( index ) {
		let img = $(this).attr('src');
		var crownStatus = "";
		if(img.indexOf("donderfull") > 0){
			crownStatus = "donderfull";
			countDonderFull ++;
		} else if(img.indexOf("gold") > 0){
			crownStatus = "gold";
			countGold ++;
		} else if(img.indexOf("silver") > 0){
			crownStatus = "silver";
			countSilver ++;
		} else if(img.indexOf("played") > 0){
			crownStatus = "played";
			countPlayed ++;
		} else if(img.indexOf("none") > 0){
			crownStatus = "none";
			countNone ++;
		}
        crownList.push({'songName':songNameList[index],'crown':crownStatus});
	});

	$( '[name="crown_filter"]' ).each(function( index ) {
        switch($(this).data('crown')){
            case "donderfull":
                $(this).append('('+ countDonderFull + ')');
            break;
            case "gold":
                $(this).append('('+ countGold + ')');
            break;
            case "silver":
                $(this).append('('+ countSilver + ')');
            break;
            case "played":
                $(this).append('('+ countPlayed + ')');
            break;
            case "none":
                $(this).append('('+ countNone + ')');
            break;
        }
    });

    let remainingHtml = "<div style=’color:#ffffff;margin:10px’>你還剩下" + (countSilver + countPlayed + countNone) + "首歌沒有金冠</div>";
    $('.tabList').append(remainingHtml);
	function crownFilter(crown){
		$(".contentBox").each(function( index){
            $(this).show();
            if(crownList[index].crown != crown){
                $(this).hide();
			}
		});
	}
}
