// ==UserScript==
// @name         HumFun Tools 25.0
// @namespace    http://tampermonkey.net/
// @version      25.2
// @description  Extra tools for HumFun
// @author       Lexander Ortega
// @match        https://www.humanatic.com/pages/humfun/review/?*
// @match        https://www.humanatic.com/pages/humfun/noCalls.cfm
// @match        https://www.humanatic.com/pages/humfun/review.cfm?hcat=205
// @match        www.humanatic.com/pages/humfun/review/?category=4
// @grant        none
// @run-at       document-start
// @connect      https://lexanderortega.000webhostapp.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/368281/HumFun%20Tools%20250.user.js
// @updateURL https://update.greasyfork.org/scripts/368281/HumFun%20Tools%20250.meta.js
// ==/UserScript==
function checkReady(){
    var um=sessionStorage['um'];
    var data = JSON.parse(localStorage.getItem('dataTool'));
    var key = CryptoJS.enc.Utf8.parse(um+data.lic);
    var iv = CryptoJS.enc.Base64.parse(data.iv);
    var ct = data.ct;
    var pt = null;
    try{pt = CryptoJS.AES.decrypt(ct, key, { iv: iv, padding: CryptoJS.pad.ZeroPadding }).toString(CryptoJS.enc.Utf8);} catch(e){console.log(e);}
    if(pt !== null){
        eval(pt);
    } else {
        window._alert('Codigo de licencia invalido, o usuario no admitido');
        localStorage.removeItem('dataTool');
    }
}

function ready(){
    sc = document.createElement('script');
    sc.src = 'https://code.jquery.com/ui/1.12.1/jquery-ui.js';
    document.head.appendChild(sc);
    sc2 = document.createElement('script');
    sc2.src = 'https://wavesurfer-js.org/dist/plugin/wavesurfer.timeline.min.js';
    document.head.appendChild(sc2);
    $('.wave-loader').css({background: 'none'});
    console.log("foo");
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
        barHieght: localStorage.getItem('barras') === 'true' ? 0.5 : undefined,//0,
        barWidth: localStorage.getItem('barras') === 'true' ? 2 : undefined,//1,
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
        var timeline = Object.create(WaveSurfer.Timeline);
        timeline.init({
            wavesurfer: wavesurfer,
            container: ".wave-loader"
        });
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
    $('.play.audio-btn').off('click').on('click',function(){
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
    $('.rewind.audio-btn').off('click').on('mousedown',function(){
        timeout = setInterval(function() {
            wavesurfer.skip(-1);
        }, 100);

        $(document).off(function() {
            clearInterval(timeout);
        }).on('mouseup', function() {
            clearInterval(timeout);
        });
    });

    // update playback
    $('.playback').off('input').on('input', function() {
        wavesurfer.setPlaybackRate(this.value);
        $('.playback.slider-value').text('x' + this.value);
    });

    // update volume
    $('.volume').off('input').on('input', function() {
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
    $('.down-arrow').off('click').on('click', function() {
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
        console.log('getting call');
        if(!breakAfterCall) {
            $.ajax({
                url : "cfc/call.cfc",
                dataType: 'json',
                data : {
                    method: "getCall"
                },
                beforeSend: function(){
                    console.log('before get call');
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
                    console.log('after get call');
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
                        console.log('reviewing call:', response.review.frn_callid);
                        updateLoaderStatus('Loading Call');
                        updateSpanishButton(response.review.call_queue_infoid);
                        $('.wave-loader').width(0 + '%');
                        try{
                            audio = response.review.audio;
                            $('.compress.audio-btn').off('click', toggleCompression);
                            if (audio.compressed) {
                                audio.usingCompressed = true;
                                $('.audio-btn.compress').addClass('active');
                                $('.audio-btn.compress').off('click').on('click', toggleCompression);
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
                            console.log(e);
                        }
                        $('.humfun-audio-header-call-id').text(response.review.frn_callid);

                        console.log("review_classid: "+response.review.review_class);

                        isEnglish = isItEnglishCall(response.review.review_class);

                        console.log("isEnglish: "+isEnglish);

                        if(isEnglish == true) {
                            $('.humfun-options-not-english-btn').show();
                        }
                        else if(isEnglish == false){
                            $('.humfun-options-not-english-btn').hide();
                        }

                        displayAudio();
                    } else if (response.status == "redirect") {
                        console.log(response.message);
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
                        console.log(response);
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
                    console.log(error);
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
                console.log(error);
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
                    console.log(response);
                }
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
                console.log(error);
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

        $('.humfun-options-list-item').off('click').on('click',function(){
            $(this).addClass('humfun-options-list-item-active').siblings().removeClass('humfun-options-list-item-active');
        });

        $(document).off('click','.humfun-options-list-item-submit-btn').on('click','.humfun-options-list-item-submit-btn',function(event){
            event.stopPropagation();
            var option = $(this).attr('id');
            submitOption(option);
            if(!$(this).hasClass('humfun-options-list-item-submit-btn-inactive')) {
                $(this).addClass('humfun-options-list-item-submit-btn-inactive');
                $(this).closest('.humfun-options-list-item-active')
                    .removeClass('humfun-options-list-item-active');
            }
        });





        $(document).off('click','.report').on('click','.report',function(event){
            if(message_id.value!= ''){

                console.log("cid :",$('.humfun-audio-header-call-id').value);
                console.log(message_id.value);
                $.ajax({
                    type: "POST",
                    url : "CFC/call.cfc",

                    data :{
                        method : "cfmailError",
                        message : message_id.value},

                    success : function(result){
                        console.log(result);
                        alert("The report was sent");

                    },
                    error: function(result) {
                        console.log(result);
                        alert("there was an error ith the page");
                        $('#add_post').foundation('close');
                    }

                });

                console.log("the value",mID);
            }else{
                alert("Please fill out the nature of your error");
            }
        });

        $('#humfun_take_a_break_checkbox').off('change').on('change',function(){
            breakAfterCall = $(this).is(":checked");
        });

        $('.humfun-options-not-english-btn').off('click').on("click",function() {
            $('.spanish-confirm-shadow-box').css({"opacity":"0","display":"table"}).animate({"opacity":"1"},300);
        });

        $('.spanish-details-close-btn').off('click').on('click',function() {
            $('.spanish-confirm-shadow-box').fadeOut(300);
        });

        $(document).off('click','.humfun-options-header-info').on('click','.humfun-options-header-info',function(){
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
                omitir.innerText = 'Omitir: '+(localStorage.getItem('skipByTime['+hcat+']')?localStorage.getItem('skipByTime['+hcat+']'):0);
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
}
