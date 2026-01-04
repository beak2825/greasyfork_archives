// ==UserScript==
// @name         HumFUN-NEW 1.03
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Some aditionals features for HM
// @author       Jose Enrique Ayala Villegas
// @match        https://www.humanatic.com/pages/humfun/review/?*
// @match        https://www.humanatic.com/pages/humfun/noCalls.cfm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40308/HumFUN-NEW%20103.user.js
// @updateURL https://update.greasyfork.org/scripts/40308/HumFUN-NEW%20103.meta.js
// ==/UserScript==

if(location.href === 'https://www.humanatic.com/pages/humfun/noCalls.cfm'){
    
}

betaSkipCall = function(yes,callback){
    yes = yes === undefined ? true : yes;
    callback = callback === undefined ? null : callback;
    isSkip = true;
    $('.fa-pause').parent().click();
    $.ajax({
        url: "https://www.humanatic.com/pages/humfun/cfc/humfun_activities.cfc",
        type: 'post',
        data: {
            method: 'check_minigame',
            score: getRandomInt(1,9)
        },
        async: yes,
        dataType: 'json',
        oldUrl: location.href,
        oldTitle: document.title,
        beforeSend: function(){
            history.replaceState( {} , 'Break Room', 'break_room.cfm');
        },
        success: callback?callback:function(){
            history.replaceState( {} , this.oldTitle, this.oldUrl);
            location.reload();
        }
    });
};
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getData(src){
    console.log('Obteniendo Estadisticas...');
    $('.payout-info-holder').fadeOut(function(){
                this.remove();
            });
    $.ajax({
        url: 'https://www.humanatic.com/pages/humfun/payout.cfm',
        type: 'get',
        audioSrc: src,
        success: function(res){
            saldo = $(res).find('.payout-info-holder');
            $(saldo).hide().appendTo('.humfun-review-section-left').addClass('module-section').css({width: '100%', left: '-5px', margin: '5px'}).find('.hover-container').remove();
            $(saldo).append('<style> @media (max-width: 910px) { .payout-info-holder{display: none;} } </style>');
            $('.payout-info-holder').fadeIn();
            waitNewCall(this.audioSrc);
        }
    });
}
btnOmitir = document.createElement('button');
btnOmitir.innerText = 'Omitir';
btnOmitir.onclick = betaSkipCall;
btnOmitir.id = 'boton';
$(btnOmitir).append('<style>#boton { height: 100%; color: white; background: #007def; border-radius: 6px; width: 52%; transition-duration: 0.5s ; } #boton:hover{ background: white; color: #007def; } #boton:active{ color: black; }</style>');
$('.audio-controls').append(btnOmitir);
$('.audio-issues.audio-btn').hide();
document.body.onkeyup = function(event){
	var key = event.key;
	switch(key){
        case ' ':
			$('.play.audio-btn').click();
		break;
        case 'o':
			btnOmitir.click();
		break;
        case 'Enter':
            $('.humfun-options-list-item-active .humfun-options-list-item-submit-btn:visible').click();
        break;
        default:
			if(!isNaN(key)){
                if(key == '0') $('.humfun-options-list-item-active').removeClass('humfun-options-list-item-active');
				$('.humfun-options-list-items>div:nth-child('+key+')').click();
			}
		break;
	}
};

function waitNewCall(src){
    src = src || '';
    newSrc =  $('audio').attr('src') || '';
    if(src !== newSrc){
        console.log('old: ',src,', New: ',newSrc);
        src = newSrc;
        getData(src);
    } else {
        setTimeout(waitNewCall.bind(null,src),500);
    }
}

waitNewCall();