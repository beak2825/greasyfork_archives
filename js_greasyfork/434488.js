// ==UserScript==
// @name HUMANATIC- 2018
// @namespace http://tampermonkey.net/
// @version 77.0
// @description Auditar mejor las llamadas
// @author Rudcely  Castillo
// @match https://www.humanatic.com/pages/humfun/review/?*
// @match https://www.humanatic.com/pages/humfun/noCalls.cfm
// @match www.humanatic.com/pages/humfun/review/?category=4
// @grant none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/434488/HUMANATIC-%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/434488/HUMANATIC-%202018.meta.js
// ==/UserScript==
if(location.href === 'https://www.humanatic.com/pages/humfun/noCalls.cfm'){}
const betaSkipCall = function(yes,callback){
    yes = yes === undefined ? true : yes;
    callback = callback === undefined ? null : callback;
    let isSkip = true;
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
            const saldo = $(res).find('.payout-info-holder');
            $(saldo).hide().appendTo('.humfun-review-sectionleft').addClass('module-section').css({width: '100%', left: '-5px', margin:
                                                                                                   '5px'}).find('.hover-container').remove();
            $(saldo).append('<style> @media (max-width: 910px) { .payout-infoholder{display: none;} } </style>');
            $('.payout-info-holder').fadeIn();
            waitNewCall(this.audioSrc);
        }
    });
}
const duracion = document.createElement('span');
duracion.id = 'duracion';
const btnSIGUIENTE = document.createElement('button');
btnSIGUIENTE.innerText = 'SIGUIENTE';
btnSIGUIENTE.onclick = betaSkipCall;
btnSIGUIENTE.id = 'boton';
$(btnSIGUIENTE).append("<style>#boton { height: 100%; color: white; background:#007def; border-radius: 6px; width: 52%; transition-duration: 0.5s ; } #boton:hover{ background: white; color: #007def; } #boton:active{ color: black; }</style>");
$('.audio-controls').append(btnSIGUIENTE);
$('.audio-issues.audio-btn').hide();
document.body.onkeyup = function(event){
    var key = event.key;
    switch(key){
        case ' ':
            $('.play.audio-btn').click();
            break;
        case 'o':
            btnSIGUIENTE.click();
            break;
        case 'Enter':
            $('.humfun-options-list-item-active .humfun-options-list-item-submitbtn:visible').click();
            break;
        default:
            if(!isNaN(key)){
                if(key == '0') $('.humfun-options-list-itemactive').removeClass('humfun-options-list-item-active');
                $('.humfun-options-list-items>div:nthchild('+key+')').click();
            }
            break;
    }
};
function waitNewCall(src){
    document.getElementsByClassName("time-holder-value")[0].style.display="block";
    document.getElementsByClassName("duration-holder")[0].style.display="block";
    src = src || '';
    const newSrc = $('audio').attr('src') || '';
    if(src !== newSrc){
        console.log('old: ',src,', New: ',newSrc);
        src = newSrc;
        getData(src);
    } else {
        setTimeout(waitNewCall.bind(null,src),500);
    }
}
waitNewCall();

