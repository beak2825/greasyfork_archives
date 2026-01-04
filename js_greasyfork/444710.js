// ==UserScript==
// @name         BYTS(Better YouTube Shorts) - Greasyfork Edition
// @version      1.2.9
// @description  Gives you a seekbar, autoplay option, volume options, etc.
// @author       Taki7o7 aka. WaGi-Coding
// @match        *://www.youtube.com/shorts/*
// @require      http://code.jquery.com/jquery-latest.js
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @license      GPLv3
// @namespace    https://greasyfork.org/users/772124
// @downloadURL https://update.greasyfork.org/scripts/444710/BYTS%28Better%20YouTube%20Shorts%29%20-%20Greasyfork%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/444710/BYTS%28Better%20YouTube%20Shorts%29%20-%20Greasyfork%20Edition.meta.js
// ==/UserScript==



GM_addStyle(`
input[type=range].volslider {
    height: 14px;
    -webkit-appearance: none;
    margin: 10px 0;
    }
    input[type=range].volslider:focus {
    outline: none;
    }
    input[type=range].volslider::-webkit-slider-runnable-track {
    height: 8px;
    cursor: pointer;
    box-shadow: 0px 0px 0px #000000;
    background: rgb(50 50 50);
    border-radius: 25px;
    border: 1px solid #000000;
    }
    input[type=range].volslider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        margin-top: -7px;
        border-radius: 0px;
        background-image: url('https://i.imgur.com/vcQoCVS.png');
        background-size:20px;
        background-repeat: no-repeat;
        background-position: 50%;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
    background: rgb(50 50 50);
    }





    .switch {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 20px;
    }
    .switch input {
    opacity: 0;
    width: 0;
    height: 0;
    }
    .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
    }
    .slider:before {
    position: absolute;
    content: "";
    height: 12px;
    width: 12px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
    }
    input:checked + .slider {
    background-color: #FF0000;
    }
    input:focus + .slider {
    box-shadow: 0 0 1px #FF0000;
    }
    input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
    }
    /* Rounded sliders */
    .slider.round {
    border-radius: 12px;
    }

    .slider.round:before {
    border-radius: 50%;
    }
`);

var $ = window.jQuery;
var vid = null;
var reel = null;
var udTimer = null;

var progbar = null;

var seekMouseDown = false;

var bytsVol = null;

var bytsTimeInfo = null;


var lastCurSeconds = 0;

// var xhr = new XMLHttpRequest();
// var windloc = '';

// Storage
var savedVolume = 1.0;
var autoScrollVal = true;
// -------

async function LoadSettings() {
    savedVolume = await GM.getValue('bytsVolume', 1.0);
    autoScrollVal = await GM.getValue('bytsAutoscroll', true);
}

function findValues(obj, key) {
    return findValuesHelper(obj, key, []);
}

function findValuesHelper(obj, key, list) {
    if (!obj) return list;
    if (obj instanceof Array) {
        for (var i in obj) {
            list = list.concat(findValuesHelper(obj[i], key, []));
        }
        return list;
    }
    if (obj[key]) list.push(obj[key]);

    if ((typeof obj == "object") && (obj !== null)) {
        var children = Object.keys(obj);
        if (children.length > 0) {
            for (i = 0; i < children.length; i++) {
                list = list.concat(findValuesHelper(obj[children[i]], key, []));
            }
        }
    }
    return list;
}

window.onload = function () {
    var checkExist = setInterval(() => {
        // wait until any video elements rendered
        if ($('ytd-shorts').length && $('.html5-video-player').length) {
            clearInterval(checkExist);

            LoadSettings();

            setInterval(updateVidElem, 50);

//             windloc = window.location.href;

//             setInterval(() => {
//                 if(windloc != window.location.href){
//                     windloc = window.location.href;
//                     xhr.abort();
//                 }
//             }, 20);

            udTimer = setInterval(AddUploadDateIfNeeded, 50);

            addEventListener("keydown", function (e) {
                switch (e.key.toUpperCase()) {

                    case "ARROWLEFT":
                        $(vid).prop('currentTime', $(vid).prop('currentTime') - 2)
                        break;
                    case "ARROWRIGHT":
                        $(vid).prop('currentTime', $(vid).prop('currentTime') + 2)
                        break;

                    default:
                        break;
                }
            });
        }
    }, 100);
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function updateVidElem() {

    if ($('ytd-reel-video-renderer').length >= 28) {
        $('ytd-reel-video-renderer:lt(9)').remove();
    }

    vid = $('.html5-video-player').first().find('video').first();

    if ($(vid).length === 0) {
        return;
    }

    $(vid).prop('volume', $('#byts-vol').val());

    if (autoScrollVal == true) {
        $(vid).removeAttr('loop');
        $(vid).unbind('ended');
        $(vid).on('ended', function () {
            //console.log("ended");
            $('#navigation-button-down').find("button").first().click();
        });
    }
    else {
        $(vid).attr('loop', true);
        $(vid).unbind('ended');
    }


    reel = $(vid).closest('ytd-reel-video-renderer');
    if ($(reel).length === 0) {
        return;
    }
    if ($(reel).find('#byts-progbar').length === 0) {
        if ($('#byts-progbar').length === 0) {
            $(reel).append('<div id="byts-progbar" style="user-select: none; cursor: pointer; width: 100%; height: 14px; background-color: #343434; position: absolute; margin-top: -20px; border-radius: 10px;"></div>');

        } else {
            $(reel).append($('#byts-progbar'));
        }
        progbar = $('#byts-progbar').first();
        $(progbar).mousemove((e) => {
            if (seekMouseDown) {
                $(vid).prop('currentTime', (e.offsetX * 1 / $(reel).outerWidth()) * $(vid).prop('duration'));
            }
        });
        $(progbar).mousedown(() => {
            seekMouseDown = true;
        });
        $(progbar).mouseleave(() => {
            seekMouseDown = false;
        });
        $(progbar).mouseup((e) => {
            seekMouseDown = false;
            $(vid).prop('currentTime', (e.offsetX * 1 / $(reel).outerWidth()) * $(vid).prop('duration'));
        });
    }
    let time = ($(vid).prop('currentTime') / $(vid).prop('duration')) * 100;


    var progress = document.getElementById('byts-progress');
    if (progress == null) {
        progress = document.createElement("div");
        progress.setAttribute("id", "byts-progress");

        progress.style.userSelect = "none";
        progress.style.backgroundColor = "#FF0000";
        progress.style.height = "100%";
        progress.style.borderRadius = "10px";
        progress.style.width = time + "%";


        progress.onmouseup = function (e) {
            var selected_val = e.offsetX * 1 / $(reel).outerWidth();
            $(vid).prop('currentTime', selected_val * $(vid).prop('duration'));
        }

        $(progbar).append(progress);

    }
    else {
        progress.style.width = time + "%";
    }


    // Time Info
    let durSecs = Math.floor($(vid).prop('duration'));
    let durMinutes = Math.floor(durSecs / 60);
    let durSeconds = durSecs % 60;

    let curSecs = Math.floor($(vid).prop('currentTime'));
    if (curSecs != lastCurSeconds || $(reel).find('#byts-timeinfo').length === 0) {
        lastCurSeconds = curSecs;

        let curMinutes = Math.floor(curSecs / 60);
        let curSeconds = curSecs % 60;

        // TimeInfo Element
        if ($(reel).find('#byts-timeinfo').length === 0) {
            if ($('#byts-timeinfo').length === 0) {
                $(reel).append('<div id="byts-timeinfo" style="user-select: none; display: flex; right: auto; left: auto; position: absolute; margin-top: ' + ($(reel).height() + 2) + 'px;"><div id="byts-timeinfo-textdiv" style="display: flex; margin-right: 5px; margin-top: 4px; color: white; font-size: 1.2rem;">' + `${curMinutes}:${padTo2Digits(curSeconds)} / ${durMinutes}:${padTo2Digits(durSeconds)}` + '</div></div>');
            } else {
                $(reel).append($('#byts-timeinfo'));
            }
            bytsTimeInfo = $('#byts-timeinfo');
        }

        $('#byts-timeinfo-textdiv').text(`${curMinutes}:${padTo2Digits(curSeconds)} / ${durMinutes}:${padTo2Digits(durSeconds)}`);
    }

    $('#byts-timeinfo').css('margin-top', $(reel).height() + 2);


    // Volume Slide
    if ($(reel).find('#byts-vol').length === 0) {
        if ($('#byts-vol').length === 0) {
            $(reel).append('<input style="user-select: none; width: 100px; left: 0px; background-color: transparent; position: absolute; margin-top: ' + ($(reel).height() + 5) + 'px;" type="range" id="byts-vol" class="volslider" name="vol" min="0.0" max="1.0" step="0.01" value="' + savedVolume + '"></input>');
        } else {
            $(reel).append($('#byts-vol'));
        }
        bytsVol = $('#byts-vol');

        $('#byts-vol').on('input change', function () {
            $(vid).prop('volume', $(this).val());

            GM.setValue('bytsVolume', $(this).val());
        });
    }

    $('#byts-vol').css('margin-top', $(reel).height() + 5);


    // AutoScroll
    if ($(reel).find('#byts-autoscroll-div').length === 0) {
        if ($('#byts-autoscroll-div').length === 0) {
            let astc = '';
            if (autoScrollVal) {
                astc = ' checked';
            }
            $(reel).append('<div id="byts-autoscroll-div" style="user-select: none; display: flex; right: 0px; position: absolute; margin-top: ' + ($(reel).height() + 2) + 'px;"><div style="display: flex; margin-right: 5px; margin-top: 4px; color: white; font-size: 1.2rem;">Auto-Scroll: </div><label class="switch"><input id="byts-autoscroll-input" type="checkbox"' + astc + '><span class="slider round"></span></label></div>');
        } else {
            $(reel).append($('#byts-autoscroll-div'));
        }
        bytsVol = $('#byts-autoscroll-div');

        $('#byts-autoscroll-input').on('input change', function () {
            // console.log($(this).is(':checked'));
            GM.setValue('bytsAutoscroll', $(this).is(':checked'));

            if ($(this).is(':checked')) {
                autoScrollVal = true;
            }
            else {
                autoScrollVal = false;
            }
            if (autoScrollVal == true) {
                $(vid).removeAttr('loop');
                $(vid).unbind('ended');
                $(vid).on('ended', function () {
                    //console.log("ended");
                    $('#navigation-button-down').find("button").first().click();
                });
            }
            else {
                $(vid).attr('loop', true);
                $(vid).unbind('ended');
            }
            // $(vid).prop('volume', $(this).val());
        });
    }

    $('#byts-autoscroll-div').css('margin-top', $(reel).height() + 2);
}

async function AddUploadDateIfNeeded() {
    if ($(vid).length === 0) {
        return;
    }
    if ($(reel).length === 0) {
        return;
    }

    if ($(reel).find('#channel-name').find('#byts-uploaddate').length === 0) {
        clearInterval(udTimer);
        try {
            let reelId = $(reel).attr('id'); // for skipping when we switch to another video before the promise is done

            let html = '';
            //xhr.abort();
            // xhr = await $.get(window.location.href, function (data) {
            await $.get(window.location.href, function (data) {
                try{
                    if(reelId != $(reel).attr('id') || $(reel).find('#channel-name').find('#byts-uploaddate').length !== 0){
                        //xhr.abort();
                        udTimer = setInterval(AddUploadDateIfNeeded, 50);
                        return;
                    }

                    html = data;

                    // let jsonString = html.match('(?<=var ytInitialData = ).*(?=;</script>)');
                    let jsonString = html.substring(html.indexOf('var ytInitialData = '));

                    jsonString = jsonString.substring("var ytInitialData = ".length, jsonString.indexOf(';</script>'));

                    let jObj = JSON.parse(jsonString);
                    let ulDate = findValues(jObj, 'publishTimeText')[0].runs[1].text;
                    let viewObj = findValues(jObj, 'viewCountText')[0].runs;
                    let views = viewObj[0].text;
                    let viewsText = viewObj[1].text;

                    let displayText = '';

                    views = views.replaceAll(',', '.');

                    if (typeof ulDate == 'undefined') {
                        ulDate = '';
                    }

                    if(typeof viewObj != 'undefined'){
                        displayText = '<br>' + views + ' ' + viewsText;
                    }

                    if(typeof ulDate != 'undefined' || typeof viewObj != 'undefined'){
                        $(reel).find('#channel-name').find('#text').append('<span id="byts-uploaddate"><br>' + ulDate + displayText + '</span>');
                    }
                }catch{
                    udTimer = setInterval(AddUploadDateIfNeeded, 50);
                    return;
                }
            });

            udTimer = setInterval(AddUploadDateIfNeeded, 50);

        } catch (error) {

            udTimer = setInterval(AddUploadDateIfNeeded, 50);
            return;
        }
    }
}