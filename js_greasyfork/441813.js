// ==UserScript==
// @name           Youtube Downloader Including Video, Audio, Subtitles
// @include        https://*youtube.com/*
// @author         Jone
// @require        https://code.jquery.com/jquery-1.12.4.min.js
// @require        https://cdn.jsdelivr.net/npm/streamsaver@2.0.3/StreamSaver.js
// @require        https://cdn.jsdelivr.net/npm/web-streams-polyfill@2.0.2/dist/ponyfill.min.js
// @version        1.3
// @license MIT
// @grant GM_xmlhttpRequest
// @description   Download Video, Audio, Subtitles
// @namespace https://greasyfork.org/users/889856
// @downloadURL https://update.greasyfork.org/scripts/441813/Youtube%20Downloader%20Including%20Video%2C%20Audio%2C%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/441813/Youtube%20Downloader%20Including%20Video%2C%20Audio%2C%20Subtitles.meta.js
// ==/UserScript==

/*
  [What is this?]
    This Tampermonkey script allows you to download Youtube Video,Audio and subtitle incluing "Automatic subtitle" and "closed subtitle".

  [Who built this?]
    Author :  Jone

  [Developed based on the author?]
    Author :  Cheng Zheng
    Email  :  guokrfans@gmail.com
    Github :  https://github.com/1c7/Youtube-Auto-Subtitle-Download
    If you want to improve the script, Github pull requests are welcome.


  [Version of decoding signature function]
    verson :  534c466c
    package:  youtube's base.js


  [Test Video]
    https://www.youtube.com/watch?v=bkVsus8Ehxs
    This videos only has a closed English subtitle, with no auto subtitles.

    https://www.youtube.com/watch?v=-WEqFzyrbbs
    no subtitle at all

    https://www.youtube.com/watch?v=9AzNEG1GB-k
    have a lot of subtitles

    https://www.youtube.com/watch?v=tqGkOvrKGfY
    1:36:33  super long subtitle

  [How does it work?]
    The code can be roughly divided into three parts:
      1. Add a button on the page. (UI)
      2. Detect if subtitle exists.
      3. Convert subtitle format, then download.

  [Test Enviroment]
    Works best on Chrome + Tampermonkey.
    There are plenty Chromium-based Browser, I do not guarantee this work on all of them;
*/

(function () {

// Config
var NO_CAPTION = 'No Subtitle';
var HAVE_CAPTION = 'Download Subtitles';
var NO_VIDEO = 'No Video';
var HAVE_VIDEO = 'Download Video';
var NO_AUDIO = 'No Audio';
var HAVE_AUDIO = 'Download Audio';
var NO_VI_AU = 'No VidelAndAudio';
var HAVE_VI_AU = 'Download VidelAndAudio';
var TEXT_LOADING = 'Loading...';

const BUTTON_ID = 'youtube-parent-downloader-by-1c7-last-update-2021-2-21';
const CAPTION_BUTTON_ID = 'youtube-caption-downloader-by-1c7-last-update-2021-2-21';
const VIDEO_BUTTON_ID = 'youtube-video-downloader-by-1c7-last-update-2021-2-21';
const AUDIO_BUTTON_ID = 'youtube-audio-downloader-by-1c7-last-update-2021-2-21';
const VI_AU_BUTTON_ID = 'youtube-videoandaudio-downloader-by-1c7-last-update-2021-2-21';

// Config
var HASH_BUTTON_ID = `#${BUTTON_ID}`
var HASH_CAPTION_BUTTON_ID = `#${CAPTION_BUTTON_ID}`
var HASH_VIDEO_BUTTON_ID = `#${VIDEO_BUTTON_ID}`
var HASH_AUDIO_BUTTON_ID = `#${AUDIO_BUTTON_ID}`
var HASH_VI_AU_BUTTON_ID = `#${VI_AU_BUTTON_ID}`

//config
let VIDEO_FORMAT = 'mp4';
let AUDIO_FORMAT =  'mp3';
let CAPTION_FORMAT = 'srt'

// config
window.caption_array = null;
window.video_array = null;
window.audio_array = null;
window.vi_au_array = null;

//config
const CERTAIN_TYPE_INFO = {
    "VIDEO": "video",
    "AUDIO": "audio",
    "VI_AU": "vi_au",
    "CAPTION": "caption"
}

// initialize
var first_load = true;
// indicate if first load this webpage or not
var youtube_playerResponse_1c7 = null;

  // trigger when first load
$(document).ready(function () {
    start();
});

// Explain this function: we repeatly try if certain HTML element exist,
// if it does, we call init()
// if it doesn't, stop trying after certain time
function start() {

    var retry_count = 0;
    var RETRY_LIMIT = 30;
    // use "setInterval" is because "$(document).ready()" still not enough, still too early
    // 330 work for me.
    if (new_material_design_version()) {
        var material_checkExist = setInterval(function() {
            if (document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer').length) {
                init();
                clearInterval(material_checkExist);
            }
            retry_count = retry_count + 1;
            if (retry_count > RETRY_LIMIT) {
                clearInterval(material_checkExist);
            }
        }, 330);
    } else {
        var checkExist = setInterval(function() {
            if ($('#watch7-headline').length) {
                init();
                clearInterval(checkExist);
            }
            retry_count = retry_count + 1;
            if (retry_count > RETRY_LIMIT) {
                clearInterval(checkExist);
            }
        }, 330);
    }
}

// trigger when loading new page
// (actually this would also trigger when first loading, that's not what we want, that's why we need to use firsr_load === false)
// (new Material design version would trigger this "yt-navigate-finish" event. old version would not.)
  var body = document.getElementsByTagName("body")[0];
  body.addEventListener("yt-navigate-finish", function (event) {
    // 2021-8-9 测试结果：yt-navigate-finish 可以正常触发
    if (current_page_is_video_page() === false) {
      return;
    }
    youtube_playerResponse_1c7 = event.detail.response.playerResponse; // for auto subtitle
    unsafeWindow.caption_array = []; // clean up (important, otherwise would have more and more item and cause error)

    // if use click to another page, init again to get correct subtitle
    if (first_load === false) {
      remove_subtitle_download_button();
      init();
    }
  });
// return true / false
// Detect [new version UI(material design)] OR [old version UI]
// I tested this, accurated.
function new_material_design_version() {
    var old_title_element = document.getElementById('watch7-headline');
    if (old_title_element) {
        return false;
    } else {
        return true;
    }
}

// return true / false
function current_page_is_video_page() {
    return get_url_video_id() !== null;
}

// return string like "RW1ChiWyiZQ",  from "https://www.youtube.com/watch?v=RW1ChiWyiZQ"
// or null
function get_url_video_id() {
    return getURLParameter('v');
}

//https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

// finish
function remove_subtitle_download_button() {
    $(HASH_BUTTON_ID).remove();
}

function init() {
    inject_our_script();
    first_load = false;
}

// inject init button
function inject_our_script() {
    var div = document.createElement('div')
      , div_video = document.createElement('div')
      , div_audio = document.createElement('div')
      , div_vi_au = document.createElement('div')
      , div_caption = document.createElement('div')
      , controls = document.getElementById('watch7-headline');

    var css_div = `display: table;
    margin-top:4px;
    margin-right:4px;
    border: 1px solid rgb(0, 183, 90);
    cursor: pointer; color: rgb(255, 255, 255);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    background-color: #00B75A;
    display:inline-block;
    `;
    div_video.setAttribute('style', css_div);
    div_video.id = VIDEO_BUTTON_ID;

    div_audio.setAttribute('style', css_div);
    div_audio.id = AUDIO_BUTTON_ID;

    div_vi_au.setAttribute('style', css_div);
    div_vi_au.id = VI_AU_BUTTON_ID;

    div_caption.setAttribute('style', css_div);
    div_caption.id = CAPTION_BUTTON_ID;

    div.id = BUTTON_ID

    // generate selector
    div_video.appendChild(generate_selector(CERTAIN_TYPE_INFO.VIDEO));
    div_audio.appendChild(generate_selector(CERTAIN_TYPE_INFO.AUDIO));
    div_vi_au.appendChild(generate_selector(CERTAIN_TYPE_INFO.VI_AU));
    div_caption.appendChild(generate_selector(CERTAIN_TYPE_INFO.CAPTION));

    // inject select to div element
    div.appendChild(div_video)
    div.appendChild(div_audio)
    div.appendChild(div_vi_au)
    div.appendChild(div_caption)

    // put the div into page: new material design
    var title_element = document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer');
    if (title_element) {
        $(title_element[0]).after(div);
    }
    // put the div into page: old version
    if (controls) {
        controls.appendChild(div);
    }

}

// generate selector by type(type: video,audio,subtitle)
function generate_selector(type) {

    let select = document.createElement('select')
    let option = document.createElement('option')
    select.id = type + 's_selector';
    select.disabled = true;
    let css_select = `display:block;
    border: 1px solid rgb(0, 183, 90);
    cursor: pointer;
    color: rgb(255, 255, 255);
    background-color: #00B75A;
    padding: 4px;
    `;
    select.setAttribute('style', css_select);

    option.textContent = TEXT_LOADING;
    option.selected = true;
    select.appendChild(option);


    select.addEventListener('change', function() {
	    // downloading the data by type
        download_mime_type(this, type);
    }, false);

    get_options_list(select, type);

    return select;

}

//get options by type
async function get_options_list(select, type) {

    //get video information
    let video_data = get_youtube_data();

    //select the data by type
    let filter_list = getVideoInfoByType(video_data, type);

    let HAVE_NAME = null;
    let NO_NAME = null;
    let HASH_BUTTON_ID = null;
    switch (type) {
    case CERTAIN_TYPE_INFO.VIDEO:
        window.video_array = filter_list;
        HAVE_NAME = HAVE_VIDEO;
        NO_NAME = NO_VIDEO;
        HASH_BUTTON_ID = HASH_VIDEO_BUTTON_ID;
        break;
    case CERTAIN_TYPE_INFO.AUDIO:
        window.audio_array = filter_list;
        HAVE_NAME = HAVE_AUDIO;
        NO_NAME = NO_AUDIO;
        HASH_BUTTON_ID = HASH_AUDIO_BUTTON_ID;
        break;
    case CERTAIN_TYPE_INFO.VI_AU:
        window.vi_au_array = filter_list;
        HAVE_NAME = HAVE_VI_AU;
        NO_NAME = NO_VI_AU;
        HASH_BUTTON_ID = HASH_VI_AU_BUTTON_ID;
        break;
    case CERTAIN_TYPE_INFO.CAPTION:
        window.caption_array = filter_list;
        HAVE_NAME = HAVE_CAPTION;
        NO_NAME = NO_CAPTION;
        HASH_BUTTON_ID = HASH_CAPTION_BUTTON_ID;
        break;
    default:
        console.log("no match type")
    }

    // if no data at all, just say no and stop
    if (filter_list == null || filter_list.length == 0) {
        select.options[0].textContent = NO_NAME;
        disable_download_button(HASH_BUTTON_ID);
        return false;
    }

    // if at least one type of data exist
    select.options[0].textContent = HAVE_NAME;
    select.disabled = false;
    let option = null;
    filter_list.forEach(item=>{
        option = document.createElement('option');
        option.textContent = item.name;
        select.appendChild(option);
    }
    )

}

// downloading the data by type
async function download_mime_type(selector, type) {

    // if user select first <option>, we just return, do nothing.
    if (selector.selectedIndex == 0) {
        return;
    }

    // video_title
    let name = get_title();
    let selected = null;
    let selected_name = selector.options[selector.selectedIndex].textContent;
	let type_format = null;
    switch (type) {
    case CERTAIN_TYPE_INFO.VIDEO:
        selected = window.video_array.filter(format=>format.name === selected_name);
		type_format = VIDEO_FORMAT;
        break;
    case CERTAIN_TYPE_INFO.AUDIO:
        selected = window.audio_array.filter(format=>format.name === selected_name);
		type_format = AUDIO_FORMAT;
        break;
    case CERTAIN_TYPE_INFO.VI_AU:
        selected = window.vi_au_array.filter(format=>format.name === selected_name);
		type_format = VIDEO_FORMAT;
        break;
    case CERTAIN_TYPE_INFO.CAPTION:
        selected = window.caption_array.filter(format=>format.name === selected_name);
		type_format = CAPTION_FORMAT;
        break;
    default:
        console.log("no match type")
    }

    console.log("selected url :", selected)
    selected != null && selected.length != 0 && (CERTAIN_TYPE_INFO.CAPTION === type && await download_subtitle(name, selected[0].url, type_format) || judeSigcipher(selected[0])  && await fetch_mime_type(name, selected[0].url, type_format));
    selector.options[0].selected = true;
}

//fetching the data by type using the streamSaver
async function fetch_mime_type(name, url, type) {

    const fileStream = streamSaver.createWriteStream(`${name}.${type}`, {
        size: 500,
        // (optional filesize) Will show progress
        writableStrategy: 500,
        // (optional)
        readableStrategy: undefined // (optional)
    })

    try {
        let controller = new AbortController();
        let signal = controller.signal;
        const res = await fetch(url, {
            signal: controller.signal
        });

        if (!res.ok) {
            console.log("fetch failse:", res.ok)
            return;
        }
        // abort so it dose not look stuck

        const readableStream = res.body
        if (window.WritableStream && readableStream.pipeTo) {
            console.log("pipe Stream")
            return readableStream.pipeTo(fileStream).then(()=>console.log('done writing'))
        } else {
            window.wirter = fileStream.getWriter()
            const reader = res.body.getReader()
            const pump = ()=>reader.read().then(res=>res.done ? writer.close() : writer.write(res.value).then(pump))
            pump()
        }

        window.onunload = ()=>{
            fileStream.abort()
        }

        window.onbeforeunload = evt=>{
            if (!done) {
                evt.returnValue = `Are you sure you want to leave?`;
            }
        }

        signal.addEventListener('abort', ()=>{
            console.log('abort!')
            fileStream.abort()
        }
        );

    } catch (e) {
        console.info("fetch failse:", e)
        return;
    }
}

//get youtube information by type
function getVideoInfoByType(video_data, type) {

    if (!video_data || video_data instanceof Array)
        throw new Error(`video_data'Desktop is false type`);

    //判断视频是否可播放
    if (video_data.playabilityStatus.status != 'OK')
        throw new Error('video is not playability');

    let format_list = [];
    try {
        switch (type) {
        case CERTAIN_TYPE_INFO.VIDEO:
            format_list = format_list.concat(video_data.streamingData.formats.filter((format)=>format.qualityLabel && !(format.audioQuality || format.audioBitrate)) || []).concat(video_data.streamingData.adaptiveFormats.filter((format)=>format.qualityLabel && !(format.audioQuality || format.audioBitrate)) || []);
            format_list = format_list.filter((format)=>format.mimeType.indexOf("mp4") != -1 && format.mimeType.indexOf("avc1") != -1);
            format_list = format_list.map((data)=>{
                return {
                    'name': `${data.qualityLabel}--bitrate:${data.bitrate}`,
                    "url": data.url || data.signatureCipher,
                    "sig_cipher": data.url == undefined || data.url == null,
                    "sig_cipher_old": data.url == undefined || data.url == null
                };
            }
            );
            break;
        case CERTAIN_TYPE_INFO.AUDIO:
            format_list = format_list.concat(video_data.streamingData.formats.filter((format)=>!format.qualityLabel && (format.audioQuality || format.audioBitrate)) || []).concat(video_data.streamingData.adaptiveFormats.filter((format)=>!format.qualityLabel && (format.audioQuality || format.audioBitrate)) || []);
            format_list = format_list.filter((format)=>format.mimeType.indexOf("mp4") != -1);
            format_list = format_list.map((data)=>{
                return {
                    'name': data.audioQuality,
                    "url": data.url || data.signatureCipher,
                    "sig_cipher": data.url == undefined || data.url == null,
                    "sig_cipher_old": data.url == undefined || data.url == null
                };
            }
            );
            break;
        case CERTAIN_TYPE_INFO.VI_AU:
            format_list = format_list.concat(video_data.streamingData.formats.filter((format)=>format.qualityLabel && (format.audioQuality || format.audioBitrate)) || []).concat(video_data.streamingData.adaptiveFormats.filter((format)=>format.qualityLabel && (format.audioQuality || format.audioBitrate)) || []);
            format_list = format_list.filter((format)=>format.mimeType.indexOf("mp4") != -1);
            format_list = format_list.map((data)=>{
                return {
                    'name': data.qualityLabel + "," + data.audioQuality,
                    "url": data.url || data.signatureCipher,
                    "sig_cipher": data.url == undefined || data.url == null,
                    "sig_cipher_old": data.url == undefined || data.url == null
                };
            }
            );
            break;
        case CERTAIN_TYPE_INFO.CAPTION:
            format_list = format_list.concat(video_data.captions.playerCaptionsTracklistRenderer.captionTracks || []);
            format_list = format_list.map((data)=>{
                return {
                    'name': data.name.simpleText,
                    "url": data.baseUrl
                };
            }
            );
            break;
        default:
            throw new Error('type variable is missing or not in the range');
        }
    } catch (e) {
        console.error("error in get list in type" + type)
    }

    return format_list
}

function disable_download_button(HASH_BUTTON_ID) {
    $(HASH_BUTTON_ID).css('border', '#95a5a6').css('cursor', 'not-allowed').css('background-color', '#95a5a6');
    $('#captions_selector').css('border', '#95a5a6').css('cursor', 'not-allowed').css('background-color', '#95a5a6');

    if (new_material_design_version()) {
        $(HASH_BUTTON_ID).css('padding', '6px');
    } else {
        $(HASH_BUTTON_ID).css('padding', '5px');
    }
}

function get_youtube_data() {
    return document.getElementsByTagName("ytd-app")[0].data.playerResponse
}

// get youtube vedio title
function get_title() {
    var title_element = document.querySelector("h1.title.style-scope.ytd-video-primary-info-renderer");
    if (title_element != null) {
        var title = title_element.innerText;
        if (title != undefined && title != null && title != "") {
            return title;
        }
    }
    return ytplayer.config.args.title;
}

//判断是否需要解密
function judeSigcipher(selected) {
    if (!selected.sig_cipher)
        return true;

    try {
        let searchParams = new URLSearchParams(selected.url);
        let url = new URL(searchParams.get('url'));
		// 进行解密
        url.searchParams.set(searchParams.get('sp'), Sqa(searchParams.get('s')));
        selected.url = url.toString();
        selected.sig_cipher = false;
        return true;
    } catch (e) {
        console.error("decipher error", e)
        return false;
    }
}

//解密单位函数
var Xx = {
    kg: function(a, b) {
        a.splice(0, b)
    },
    jl: function(a) {
        a.reverse()
    },
    ti: function(a, b) {
        var c = a[0];
        a[0] = a[b % a.length];
        a[b % a.length] = c
    }
};
//解密函数
Sqa = function(a) {
    a = a.split("");
    Xx.kg(a, 2);
    Xx.ti(a, 34);
    Xx.kg(a, 2);
    Xx.ti(a, 35);
    Xx.jl(a, 74);
    return a.join("")
};


//将下载的字幕从xml格式转化为SRT格式
function parse_youtube_XML_to_SRT(youtube_xml_string) {


    let regexp = /<text start="(.*?)" dur="(.*?)">(.*?)<\/text>/g;
    let value = null;
    let index = 1;
    let output = '';
    while ((value = regexp.exec(youtube_xml_string)) !== null) {
        let start = totime(value[1]);
        let end = totime((value[1] * 10 + value[2] * 10) / 10);
        output = output +  `${index}\n${start[0]},${start[1]} --> ${end[0]},${end[1]}\n${htmlDecode(value[3])}\n\n`
        index++;
    }

    return output;
}

// 对xml中字符进行格式化输出
function htmlDecode(input) {
    var e = document.createElement('div');
    e.class = 'dummy-element-for-tampermonkey-Youtube-Subtitle-Downloader-script-to-decode-html-entity';
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue.replace(/&#(\d+);/gi, function(match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}



function totime(ms) {
    let date = new Date(ms * 1000 - 8 * 3600 * 1000);
    return [date.toString().slice(16, 16 + 8), date.getMilliseconds()]
}

//  trigger when user select <option>
async function download_subtitle(filename, url, type) {
    // if user select first <option>, we just return, do nothing.
    let response = await fetch(url);

    let body = await readAllChunks(response.body)

    let value = parse_youtube_XML_to_SRT(body);

    //dowmload  the  subtitle
    downloadString(value, "text/plain", filename,type);

    return true;
}

async function readAllChunks(readableStream) {
  const reader = readableStream.getReader();
  const chunks = [];

  let done, value;
  var output = '';
  while (!done) {
    ({ value, done } = await reader.read());
    if (done) {
      return output;
    }
    output = output + new TextDecoder().decode(value);
  }
}




// copy from: https://gist.github.com/danallison/3ec9d5314788b337b682
// Thanks! https://github.com/danallison
// work in Chrome 66
// test passed: 2018-5-19
function downloadString(text, fileType, fileName, type) {
    var blob = new Blob([text],{
        type: fileType
    });
    var a = document.createElement('a');
    a.download = `${fileName}.${type}`;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() {
        URL.revokeObjectURL(a.href);
    }, 1500);
}
})();