// ==UserScript==
// @name         HumFunNew Beta BookMarklet
// @namespace    http://tampermonkey.net/
// @version      1.14
// @description  HumFun for use in BookMarklet AnyBrowser
// @author       You
// @match        https://www.humanatic.com/pages/humfun/review/?category=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/41012/HumFunNew%20Beta%20BookMarklet.user.js
// @updateURL https://update.greasyfork.org/scripts/41012/HumFunNew%20Beta%20BookMarklet.meta.js
// ==/UserScript==

try{wavesurfer.pause();}catch(e){}
try{wavesurfer.stop();}catch(e){}
try{wavesurfer.abort();}catch(e){}
try{wavesurfer.empty();}catch(e){}
var isEventsReady = false;
var isReady = false;
var obteniendoSaldo = false;
var obteniendoPresicion = false;
/*window._alert = window.alert;
window.alert = function(a,b,c){
    log(a,b,c);
};*/
sc = document.createElement('script');
sc.src = 'https://code.jquery.com/ui/1.12.1/jquery-ui.js';
document.head.appendChild(sc);

$('<textarea style="display:none" id="conso" style="width: 100%; height: 200px; overflow: auto; ">').appendTo(document.body);
$('<div id="divOmitir" style="text-align: center;" > <input id="skipInput" style="width: 40%"> <button id="btnSkipSet" style="width: 40%">SKIP SET</button> </div>').insertAfter('.humfun-review-section-left');

btnSkipSet.onclick = function(){
    localStorage.setItem('skipByTime['+hcat+']',skipInput.value);
    omitir.onclick = localStorage.getItem('skipByTime['+hcat+']')?skipByFilter.bind(null,parseInt(localStorage.getItem('skipByTime['+hcat+']'))):skipCall;
    btnOmitir.innerText = 'Omitir: '+(localStorage.getItem('skipByTime['+hcat+']')?localStorage.getItem('skipByTime['+hcat+']'):0);
    $(btnOmitir).append('<style>#omitir { height: 100%; color: white; background: #007def; border-radius: 6px; width: 52%; transition-duration: 0.5s ; } #omitir:hover{ background: white; color: #007def; } #omitir:active{ color: black; }</style>');
}


log = function(a,b,c,d,e,f){
    conso.value += a !== undefined ? (a+'\n') : '';
    conso.value += b !== undefined ? (b+'\n') : '';
    conso.value += c !== undefined ? (c+'\n') : '';
    conso.value += d !== undefined ? (d+'\n') : '';
    conso.value += e !== undefined ? (e+'\n') : '';
    conso.value += f !== undefined ? (f+'\n') : '';
}

log("foo");
if(localStorage.getItem('mobileMode') === 'true') {
    mobileMode(true);
} else {
    mobileMode(false);
}
$('wave').remove();
actualizarSaldo();
actualizarPresicion();
setInterval(actualizarSaldo,5000);
if(localStorage.getItem('autoscroll') === 'true'){
    autoScroll(true);
} else {
    autoScroll(false);
}
generateTimeSignature = function(seconds) {
    var signature = new Date(null);
    signature.setSeconds(seconds);
    return signature.toISOString().substr(14, 5);
};
takeABreak = function() {
    window.location = "https://www.humanatic.com/pages/humfun/category.cfm?break";
};

mID = message_id.value;
breakAfterCall = false;
callid = '';

toggleOptionLoader = function() {
    $('.processing-overlay').toggle();
};

updateLoaderStatus = function(status) {
    $('.processing-gif p').text(status);
};
$('.processing-overlay').appendTo('#waveform').css({'font-size': '15px'});
// wavesurfer configuration
wavesurfer = WaveSurfer.create({
    container: "#waveform",
    backend: 'MediaElement',
    barHieght: localStorage.getItem('barras') === 'true' ? 0.5 : 0,
    barWidth: localStorage.getItem('barras') === 'true' ? 2 : 1,
    height: localStorage.getItem('mobileMode') === 'true' ? 64 : 150,
    normalize: true,
    cursorColor: '#1ec074',
    waveColor: '#8d8d8d',
    progressColor: '#007def'
});

// default volume
wavesurfer.setVolume(0.5);

// while load
wavesurfer.on('loading', function(percent) {
    $('.processing-overlay').show();
    $('.wave-loader').width(percent + '%');
    $('.processing-gif p').text(percent + '%');
    $('.processing-overlay').appendTo('#waveform>wave').css({'font-size': '15px'});
});

// after load
wavesurfer.on('waveform-ready', function() {
    $('.processing-overlay').hide();
    showOptions();
    wavesurfer.play();
    $('.duration-bar .duration-holder')
        .text(
        generateTimeSignature(
            wavesurfer.getDuration()
        )
    );
    $('.fa.fa-play')
        .attr('class', 'fa fa-pause');
    $('.play.audio-btn')
        .attr('title', 'pause audio');
    btnOmitir.disabled = false;
    $('.processing-overlay').appendTo('#waveform').css({'font-size': '15px'});
});

// finish playing
wavesurfer.on('finish', function() {
    $('.fa.fa-pause')
        .attr('class', 'fa fa-play');
    $('.play.audio-btn')
        .attr('title', 'play audio');
});

// update time on audio processing
wavesurfer.on('audioprocess', function() {
    $('.duration-bar .time-holder .time-holder-value')
        .text(
        generateTimeSignature(
            wavesurfer.getCurrentTime()
        )
    );
});

// update time on seek
wavesurfer.on('seek', function() {
    $('.duration-bar .time-holder .time-holder-value')
        .text(
        generateTimeSignature(
            wavesurfer.getCurrentTime()
        )
    );
});

// toggle play
$('.play.audio-btn').on('click',function(){
    if (wavesurfer.isPlaying()) {
        $('.fa.fa-pause')
            .attr('class', 'fa fa-play')
            .attr('title', 'play audio');
    } else {
        $('.fa.fa-play')
            .attr('class', 'fa fa-pause')
            .attr('title', 'pause audio');
    }
    wavesurfer.playPause();
});

timeout = 0;

// rewind
$('.rewind.audio-btn').on('mousedown',function(){
    timeout = setInterval(function() {
        wavesurfer.skip(-1);
    }, 100);

    $(document).on('mouseup', function() {
        clearInterval(timeout);
    });
});

// update playback
$('.playback').on('input', function() {
    wavesurfer.setPlaybackRate(this.value);
    $('.playback.slider-value').text('x' + this.value);
});

// update volume
$('.volume').on('input', function() {
    wavesurfer.setVolume(this.value);
    if (this.value >= 0.7) {
        $('.volume.slider-label')
            .html('<i class="fa fa-volume-up" aria-hidden="true"></i>');
    } else if (this.value == 0) {
        $('.volume.slider-label')
            .html('<i class="fa fa-volume-off" aria-hidden="true"></i>');
    } else {
        $('.volume.slider-label')
            .html('<i class="fa fa-volume-down" aria-hidden="true"></i>');
    }
});

//down arrow click
$('.down-arrow').on('click', function() {
    if ($(this).hasClass('not-expanded')) {
        $('.extra').slideUp();
        $('.down-arrow').removeClass('rotated');
        $(this).next('.extra').slideDown();
        $(this).removeClass('not-expanded').addClass('rotated');
    }
    else if (!$(this).hasClass('not-expanded')) {
        $(this).next('.extra').slideUp();
        $(this).addClass('not-expanded').removeClass('rotated');
    }
});

toggleCompression = function() {
    if (audio.usingCompressed) {
        $('.audio-btn.compress').removeClass('active');
        toggleOptionLoader('loading uncompressed audio');
        wavesurfer.load(audio.uncompressed);
    } else {
        $('.audio-btn.compress').addClass('active');
        toggleOptionLoader('loading compressed audio');
        wavesurfer.load(audio.compressed);
    }
    audio.usingCompressed = !audio.usingCompressed;
};

audio = {};

getCall = function(minTime) {
    log('getting call');
    if(!breakAfterCall) {
        $.ajax({
            url : "cfc/call.cfc",
            dataType: 'json',
            data : {
                method: "getCall"
            },
            beforeSend: function(){
                log('before get call');
                $('.processing-overlay').show();
                hideOptions();
                //updateLoaderStatus("Omitiendo...");
                $('.fa.fa-pause').click();
                try{
                    wavesurfer.cancelAjax();
                } catch(e){}
            },
            minTime: minTime,
            success: function(response) {
                log('after get call');
                if(response.status == "success") {
                    if(response.review.duration_seconds > this.minTime && this.minTime !== undefined) {
                        $('.processing-overlay').show();
                        hideOptions();
                        updateLoaderStatus("Omitiendo llamada de " + response.review.duration_seconds + " Segundos...");
                        betaSkipCall(true, getCall.bind(null,this.minTime) );
                        return;
                    }
                    $('.duration-bar .duration-holder').text(generateTimeSignature(response.review.duration_seconds));
                    //$('.processing-overlay').hide();
                    callid = response.review.frn_callid;
                    log('reviewing call:', response.review.frn_callid);
                    updateLoaderStatus('Loading Call');
                    updateSpanishButton(response.review.call_queue_infoid);
                    $('.wave-loader').width(0 + '%');
                    try{
                        audio = response.review.audio;
                        $('.compress.audio-btn').off('click', toggleCompression);
                        if (audio.compressed) {
                            audio.usingCompressed = true;
                            $('.audio-btn.compress').addClass('active');
                            $('.audio-btn.compress').on('click', toggleCompression);
                            wavesurfer.load(audio.compressed);
                        } else {
                            audio.usingCompressed = false;
                            $('.audio-btn.compress').removeClass('active');
                            $('.audio-btn.compress').attr('title', 'this call does not have compressed audio');
                            wavesurfer.load(audio.uncompressed);
                        }
                    }
                    catch(e){
                        alert("There was an error loading the audio. We are sorry for the inconvenience and are working to fix the issue.");
                        log(e);
                    }
                    $('.humfun-audio-header-call-id').text(response.review.frn_callid);

                    log("review_classid: "+response.review.review_class);

                    isEnglish = isItEnglishCall(response.review.review_class);

                    log("isEnglish: "+isEnglish);

                    if(isEnglish == true) {
                        $('.humfun-options-not-english-btn').show();
                    }
                    else if(isEnglish == false){
                        $('.humfun-options-not-english-btn').hide();
                    }

                    displayAudio();
                } else if (response.status == "redirect") {
                    log(response.message);
                    if(response.url === 'https://www.humanatic.com/pages/humfun/noCalls.cfm'){
                        $('.processing-overlay').show();
                        updateLoaderStatus("Sin Llamadas, esperando llamadas...");
                        hideOptions();
                        setTimeout(getCall.bind(null,this.minTime),10000);
                    } else if(response.url === 'https://www.humanatic.com/pages/humfun/break_room.cfm') {
                        betaSkipCall(true, getCall.bind(null,this.minTime) );
                    } else {
                        window.location = response.url;
                    }
                } else {
                    log(response);
                    alert(
                        'Error: ' +
                        response.message +
                        '\n\n' +
                        'Developer Info: ' +
                        typeof response.error.Message != undefined
                        ? response.error.Message
                        : 'No developer info.'
                    );
                    updateLoaderStatus("Error desconocido, reintentando...");
                    setTimeout(getCall.bind(null,this.minTime),2000);
                }
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
                log(error);
            }
        });
    } else {
        takeABreak();
    }
};

function isItEnglishCall(review_classId) {
    englishClassId = [' ','',0,1,6,8,10];
    if(englishClassId.indexOf(review_classId) == -1) {
        return false;
    }
    else {
        return true;
    }
}

skipByFilter = function(time){
    betaSkipCall(true, getCall.bind(null,time) );
};

betaSkipCall = function  (yes,callback){
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
        },
        complete: function(){
            history.replaceState( {} , this.oldTitle, this.oldUrl);
        }
    });
};

skipCall = function(){
    betaSkipCall(true,function(){
        getCall();
    });
};

getCategory = function() {
    $.ajax({
        url: 'cfc/Category.cfc',
        dataType: 'json',
        data: {
            method: "getCategory"
        },
        success: function(response) {
            if (response.status == "success") {
                $('.humfun-options-header-title')
                    .text(response.category.question);
                $('.humfun-audio-header-title span')
                    .html(response.category.display_name+' | Accuracy: <span id="accu"></span>');
                displayCategory(response.options);
                if(localStorage.getItem('skipByTime['+hcat+']') !== null)
                    getCall(localStorage.getItem('skipByTime['+hcat+']'));
                else getCall();
                //getCall();
            } else {
                alert(response.message);
                if (response.redirect) {
                    window.location = response.redirect;
                }
            }
        },
        error: function(xhr, status, error) {
            alert('Error: ' + error);
            log(error);
        }
    });
};

disableSubmission = function() {
    $('.humfun-options-list-item-submit-btn-inactive')
        .removeClass('humfun-options-list-item-submit-btn-inactive');
};

submitOption = function(option) {
    disableSubmission();
    $.ajax({
        url: 'cfc/Review.cfc',
        dataType: 'json',
        data: {
            method: "processReview",
            option: option,
            callid, callid,
            uid: uid,
            hcat: hcat,
            ip: ip
        },
        beforeSend: function() {
            $('.humfun-options-list-item-active').removeClass('humfun-options-list-item-active');
            $('.fa.fa-pause').click();
            updateLoaderStatus('Processing Review');
            toggleOptionLoader();
            $("html, body").stop();
            $("html, body").animate({ scrollTop: 0 }, 500);
        },
        success: function(response) {
            actualizarSaldo();
            if(response.status == "success") {
                //localStorage.getItem('skipByTime['+hcat+']')?skipByFilter.bind(null,parseInt(localStorage.getItem('skipByTime['+hcat+']'))):skipCall;
                if(localStorage.getItem('skipByTime['+hcat+']') !== null)
                    getCall(localStorage.getItem('skipByTime['+hcat+']'));
                else getCall();
            } else {
                log(response);
            }
        },
        error: function(xhr, status, error) {
            alert('Error: ' + error);
            log(error);
        }
    });
};

updateSpanishButton = function(cqid) {
    var link = "/pages/humfun/review_spanish.cfm?cqid=" + cqid;
    $('.spanish-confirm-popup-dismiss-btn a').attr("href",link);
};

displayAudio = function() {
    $('.humfun-options-list-item-submit-btn')
        .addClass('humfun-options-list-item-submit-btn-inactive');
    setTimeout(function() {
        disableSubmission();
    }, 10000);
};

displayCategory = function(options) {
    $('.humfun-options-list-items').empty();
    for(var i = 0; i < options.length; i++) {
        var option =
            `
<div class="humfun-options-list-item ripple-btn" data-ripple-color="##f1f1f1">
<div class="humfun-options-list-item-hco" style="display:none;">
`+ options[i].id + `
</div>
<div class="humfun-options-list-item-left">
<div class="humfun-options-list-item-circle">
<div class="humfun-options-list-item-circle-number">
` + (i + 1) + `
</div>
<div class="humfun-options-list-item-circle-checkmark">
&#10003;
</div>
</div>
</div>
<div class="humfun-options-list-item-right">
<div class="humfun-options-list-item-text">
` + options[i].text + `
</div>
</div>
<div
id="` + options[i].id + `"
class="humfun-options-list-item-submit-btn humfun-options-list-item-submit-btn-inactive ripple-btn">
<div>
</div>
`;
        $('.humfun-options-list-items').append(option);
    }




    $('.humfun-options-list-inactive').fadeOut(200);

    $('.humfun-options-list-item').on('click',function(){
        $(this).addClass('humfun-options-list-item-active').siblings().removeClass('humfun-options-list-item-active');
    });

    $(document).on('click','.humfun-options-list-item-submit-btn',function(event){
        event.stopPropagation();
        var option = $(this).attr('id');
        submitOption(option);
        if(!$(this).hasClass('humfun-options-list-item-submit-btn-inactive')) {
            $(this).addClass('humfun-options-list-item-submit-btn-inactive');
            $(this).closest('.humfun-options-list-item-active')
                .removeClass('humfun-options-list-item-active');
        }
    });





    $(document).on('click','.report',function(event){
        if(message_id.value!= ''){

            log("cid :",$('.humfun-audio-header-call-id').value);
            log(message_id.value);
            $.ajax({
                type: "POST",
                url : "CFC/call.cfc",

                data :{
                    method : "cfmailError",
                    message : message_id.value},

                success : function(result){
                    log(result);
                    alert("The report was sent");

                },
                error: function(result) {
                    log(result);
                    alert("there was an error ith the page");
                    $('#add_post').foundation('close');
                }

            });

            log("the value",mID);
        }else{
            alert("Please fill out the nature of your error");
        }
    });

    $('#humfun_take_a_break_checkbox').on('change',function(){
        breakAfterCall = $(this).is(":checked");
    });

    $('.humfun-options-not-english-btn').on("click",function() {
        $('.spanish-confirm-shadow-box').css({"opacity":"0","display":"table"}).animate({"opacity":"1"},300);
    });

    $('.spanish-details-close-btn').on('click',function() {
        $('.spanish-confirm-shadow-box').fadeOut(300);
    });

    $(document).on('click','.humfun-options-header-info',function(){
        $('.humfun-review-category-info-shadowbox').css({"display":"table","opacity":"0"}).animate({"opacity":"1"},300);
    });

    $(document).on('click',function(event){
        if($(event.target).hasClass('review-shadow-box-inner') || $(event.target).hasClass('review-shadow-box')){
            $('.review-shadow-box').fadeOut(200);
        }
    });

    //hide extra call detail info
    $('.extra').hide();
    //hide arrow if no content
    $('.extra').each (function( index ) {
        if (($( this ).text()) == 0) {
            $(this).closest('img').css("display","none");
        }
    });
};

btnOmitir = document.createElement('button');
btnOmitir.innerText = 'Omitir: '+(localStorage.getItem('skipByTime['+hcat+']')?localStorage.getItem('skipByTime['+hcat+']'):0);
btnOmitir.onclick = localStorage.getItem('skipByTime['+hcat+']')?skipByFilter.bind(null,parseInt(localStorage.getItem('skipByTime['+hcat+']'))):skipCall;
btnOmitir.id = 'omitir';
$(btnOmitir).append('<style>#omitir { height: 100%; color: white; background: #007def; border-radius: 6px; width: 52%; transition-duration: 0.5s ; } #omitir:hover{ background: white; color: #007def; } #omitir:active{ color: black; }</style>');
$('.audio-controls').append(btnOmitir);
$('.audio-issues.audio-btn').hide();
document.body.onkeydown = function(e) {
    if(e.keyCode === 32) { $('.play.audio-btn').click(); return false;}
};
document.body.onkeyup = function(event){
    var key = event.key;
    switch(key){
        case 'o':
            btnOmitir.click();
            btnOmitir.disabled = true;
            break;
        case 'Enter':
            $('.humfun-options-list-item-active .humfun-options-list-item-submit-btn:visible').click();
            break;
        default:
            if(!isNaN(key) && key !== ' '){
                if(key == '0') $('.humfun-options-list-item-active').removeClass('humfun-options-list-item-active');
                $('.humfun-options-list-items>div:nth-child('+key+')').click();
                var scrollMax = $(document).height() - $(window).height();
                $("html, body").animate({ scrollTop: scrollMax }, 500);
            }
            break;
    }
};

addContextMenu('#omitir',[
    {
        name: function(){return (localStorage.getItem('skipByTime['+hcat+']')?'Disable':'Enable') + ' SkipByTime!'; },
        callback: function(){
            if(localStorage.getItem('skipByTime['+hcat+']') === null){
                let vSkip = prompt('Enter the maximum duration you expect from calls (seconds)');
                if(vSkip !== null){
                    localStorage.setItem('skipByTime['+hcat+']',vSkip);
                }
            } else {
                localStorage.removeItem('skipByTime['+hcat+']');
            }
            omitir.onclick = localStorage.getItem('skipByTime['+hcat+']')?skipByFilter.bind(null,parseInt(localStorage.getItem('skipByTime['+hcat+']'))):skipCall;
            $(btnOmitir).append('<style>#omitir { height: 100%; color: white; background: #007def; border-radius: 6px; width: 52%; transition-duration: 0.5s ; } #omitir:hover{ background: white; color: #007def; } #omitir:active{ color: black; }</style>');
        }
    }
]);
addContextMenu('#waveform',[
    {
        name: function(){ return (localStorage.getItem('mobileMode') === 'true'?'Activar':'Desactivar') + " Vista Grande" ; },
        callback: function(){
            if(localStorage.getItem('mobileMode') === 'true') {
                localStorage.setItem('mobileMode',false);
                mobileMode(false);
            } else {
                localStorage.setItem('mobileMode',true);
                mobileMode(true);
            }
        }
    },
    {
        name: function(){ return (localStorage.getItem('barras') === 'true'?'Desactivar':'Activar') + " Barras" ; },
        callback: function(){
            if(localStorage.getItem('barras') === 'true') {
                localStorage.setItem('barras',false);
                wavesurfer.params.barWidth = 0;
                wavesurfer.params.barHeight = 1;
                $('canvas').each( (n,e) => { const context = e.getContext('2d');  context.clearRect(0, 0, e.width, e.height);} );
                wavesurfer.drawBuffer();
            } else {
                localStorage.setItem('barras',true);
                wavesurfer.params.barWidth = 2;
                wavesurfer.params.barHeight = 0.5;
                $('canvas').each( (n,e) => { const context = e.getContext('2d');  context.clearRect(0, 0, e.width, e.height);} );
                wavesurfer.drawBuffer();
            }
        }
    },
    {
        name: function(){ return (localStorage.getItem('autoscroll') === 'true'?'Desactivar':'Activar') + " AutoScroll" ; },
        callback: function(){
            if(localStorage.getItem('autoscroll') === 'true') {
                localStorage.setItem('autoscroll',false);
                autoScroll(false);
            } else {
                localStorage.setItem('autoscroll',true);
                autoScroll(true);
            }
        }
    },
    {
        name: 'Obtener enlace del audio',
        callback: function(){
            prompt('Precione CTRL+C para copiar el enlace',wavesurfer.backend.media.src);
        }
    }
]);

getCategory();

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addContextMenu(selector, items){
    $(selector).on('touchstart',function(e){
        //alert('touch start');
        timeC = setTimeout((function(fun,e){
            fun(e);
        }).bind(null,$(selector).get(0).oncontextmenu,e),1000);
    });
    $(selector).on('touchmove',function(e){
        //alert('touch move');
        if(window.timeC !== undefined) clearTimeout(timeC);
    });
    $(selector).on('touchend',function(){
        //alert('touch end');
        if(window.timeC !== undefined) clearTimeout(timeC);
    });
    $(selector).get(0).oncontextmenu = function(e){
        var x = 0;
        var y = 0;
        try{
            log('e.clientY: '+e.clientY);
            log('e.clientX: '+e.clientX);
            log('e.changedTouches.length: '+e.changedTouches.length);
            /*y = e.clientY-10;
            x = e.clientX+5;
            log('op1 ready, x: '+x+', y: '+y);
            y2 = e.changedTouches[0].pageX;
            x2 = e.changedTouches[0].pageY;
            log('x: '+x+'|'+'y: '+y+'|x2: '+x2+'|'+'y2: '+y2);*/
        } catch(ee){
            /*y = e.changedTouches[0].pageX;
            x = e.changedTouches[0].pageY;
            log('op2 ready');*/
        }
        var css = '.context-menu-panel { z-index:1000; background:white;border-radius: 5px; box-shadow: 3px 3px 10px #888888; padding: 5px; } .context-menu-panel>.context-menu-item{ display:block; padding:3px 5px; } .context-menu-panel>.context-menu-item:hover{ background: blue; color:white; cursor:pointer; border-radius: 3px; }';
        if($('.context-menu-panel').length>0) $('.context-menu-panel').hide(100,function(){this.remove();});
        $('body').append('<ulP class="context-menu-panel" style="display:none">');
        $('.context-menu-panel').append('<style>'+css+'</style>');
        $('.context-menu-panel').css({position:'fixed',top:y ,left:x});
        $.each(items,function(n,item){
            $('.context-menu-panel').append('<liP class="context-menu-item">');
            $('.context-menu-item:last').append('<spanP>'+( (typeof item.name==='function')?item.name():item.name )+'</spanP>');
            $('.context-menu-item:last').click(item.callback);
            $('.context-menu-item:last').click(function(){
                $('.context-menu-panel').remove();
            });
            $('.context-menu-item:last').click(function(){
                document.onclick();
            });
        });
        $('.context-menu-panel').css({width: ($('.context-menu-item>span').width)});
        old_document_onclick = document.onclick;
        document.onclick = function(){
            if(typeof old_document_onclick !== 'undefined') document.onclick = old_document_onclick;
            $('.context-menu-panel').hide(100,function(){this.remove();});
        };
        $('.context-menu-panel').show(100);
        return false;
    };
}

function mobileMode(e){
    if(e) {
        $('.humfun-review-section-left').animate({width: '50%', 'padding-right': '8px'}, function(){
            wavesurfer.params.height = 64;
            $('#waveform>wave').css({height: '64px'});
            $('canvas').each( (n,e) => { e.height = 64 ;} );
            wavesurfer.drawBuffer();
            $('canvas').each( (n,e) => { e.height = 64 ;} );
            wavesurfer.drawBuffer();
        });
        $('.humfun-review-section-right').animate({width: '50%', 'padding-left': '8px'});
    } else {
        $('.humfun-review-section-left').animate({width: '100%', 'padding-right': '0px'}, function(){
            wavesurfer.params.height = 150;
            $('#waveform>wave').css({height: '150px'});
            $('canvas').each( (n,e) => { e.height = 150 ;} );
            wavesurfer.drawBuffer();
            $('canvas').each( (n,e) => { e.height = 150 ;} );
            wavesurfer.drawBuffer();
        });
        $('.humfun-review-section-right').animate({width: '100%', 'padding-left': '0px'});
    }
}

function hideOptions(){
    log("hide Options");
    $('.humfun-options-list-item-active').removeClass('humfun-options-list-item-active');
    $('.humfun-review-section-right').hide();
}

function showOptions(){
    log("show Options");
    $('.humfun-review-section-right').show();
}

function getStim(){
    return new Promise(function(resolver, rechazar){
        $.ajax({
            url: 'https://www.humanatic.com/pages/humfun/payout.cfm',
            success: function(res){
                res = res.replace(/<img\b[^>]*>/ig, '');
                var current = parseFloat($(res).find('.payout-info-row:contains("Available")>.current-earnings').text().replace('$',''));
                var unverified = parseFloat($(res).find('.payout-info-row:contains("Unverified")>.current-earnings').text().replace('$',''));
                data = {current: current, unverified: unverified};
                $.ajax({
                    url: 'https://www.humanatic.com/pages/humfun/leaderboard.cfm',
                    cData: data,
                    success: function(res){
                        res = res.replace(/<img\b[^>]*>/ig, '');
                        var today = parseFloat($(res).find('.white').text().split('=')[1].trim().replace('$',''));
                        this.cData.today = today;
                        resolver(this.cData);
                    },
                    error: function(){ setTimeout(function(){ getStim().then(resolver); },1000); }
                });
            },
            error: function(){ setTimeout(function(){ getStim().then(resolver); },1000); }
        });
    });
}

function actualizarSaldo(){
    if(obteniendoSaldo === false){
        obteniendoSaldo = true;
        getStim().then((res) => {
            obteniendoSaldo = false;
            if(window.cmoney === undefined){
                $('.title>span').html('Saldo Total: $<span id=cmoney>'+res.current+'</span> | Hoy: $<span id=tmoney>'+res.today+'</span> | Sin Verificar: $<span id=smoney>'+res.unverified+'</span>');
                return;
            }
            var oldCmoney = parseFloat(cmoney.innerText);
            var oldTmoney = parseFloat(tmoney.innerText);
            var oldSmoney = parseFloat(smoney.innerText);
            if(res.current > oldCmoney) { cmoney.innerText = res.current; cmoney.style.color = 'green'; $(cmoney).animate({color: 'write'},1000);}
            if(res.current < oldCmoney) { cmoney.innerText = res.current; cmoney.style.color = 'red'; $(cmoney).animate({color: 'write'},1000);}

            if(res.today > oldTmoney) { tmoney.innerText = res.today; tmoney.style.color = 'green'; $(tmoney).animate({color: 'write'},1000);}
            if(res.today < oldTmoney) { tmoney.innerText = res.today; tmoney.style.color = 'red'; $(tmoney).animate({color: 'write'},1000);}

            if(res.unverified > oldSmoney) { smoney.innerText = res.unverified; smoney.style.color = 'green'; $(smoney).animate({color: 'write'},1000);}
            if(res.unverified < oldSmoney) { smoney.innerText = res.unverified; smoney.style.color = 'red'; $(smoney).animate({color: 'write'},1000);}
            if(res.current !== oldCmoney || res.today !== oldTmoney || res.unverified !== oldSmoney)
                actualizarPresicion();
        } );
    }
}

function getAccuracy(){
    return new Promise(function(resolver, rechazar){
        $.ajax({
            url: 'https://www.humanatic.com/pages/humfun/accuracy.cfm',
            success: function(res){
                res = res.replace(/<img\b[^>]*>/ig, '');
                var acu = $(res).find('.category-row').has('.linkLink[id="'+hcat+'"]').find('.calls-available').text().trim();
                resolver(acu);
            },
            error: function(){ setTimeout(function(){ getAccurate.then(resolver); },1000); }
        });
    });
}

function actualizarPresicion(){
    if(obteniendoPresicion === false){
        obteniendoPresicion = true;
        getAccuracy().then((res) => {
            obteniendoPresicion = false;
            accu.innerText = res;
        });
    }
}

function autoScroll(e){
    if(e){
        $('.humfun-audio-section.module-section').off();
        $('.humfun-audio-section.module-section').mouseenter(function(){
            $("html, body").stop();
            $("html, body").animate({ scrollTop: 0 }, 500);
        });
        $('.humfun-options-section.module-section').off();
        $('.humfun-options-section.module-section').mouseenter(function(){
            $("html, body").stop();
            var scrollMax = $(document).height() - $(window).height();
            $("html, body").animate({ scrollTop: scrollMax }, 500);
        });
    } else {
        $('.humfun-audio-section.module-section').off();
        $('.humfun-options-section.module-section').off();
    }
}