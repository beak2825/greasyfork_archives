// ==UserScript==
// @name         edX Downloader
// @name:zh-CN   edX网课下载器
// @name:zh-TW	 edX網課下載器
// @name:ja      edXダウンローダー
// @namespace    https://github.com/jks-liu/edx-downloader.monkey.js
// @supportURL   https://github.com/jks-liu/edx-downloader.monkey.js
// @version      2.0.1
// @description  Download edX course mp4 and srt in one click, and save them as same file name (except the file suffix). <https://github.com/jks-liu/edx-downloader.monkey.js>
// @description:zh-CN  一键下载edX网课视频和字幕，并保存为相同的文件名（除了文件后缀）。<https://github.com/jks-liu/edx-downloader.monkey.js>
// @description:zh-TW  一鍵下載edX網課視頻和字幕，並保存爲相同的文件名（除了文件後綴）。<https://github.com/jks-liu/edx-downloader.monkey.js>
// @description:ja     edXオンラインコースのビデオと字幕をワンクリックでダウンロードし、同じファイル名で保存します（ファイル拡張子を除く）。<https://github.com/jks-liu/edx-downloader.monkey.js>
// @author       Jks Liu (https://github.com/jks-liu)
// @license      MIT
// @match        https://edx.org/*
// @match        https://www.edx.org/*
// @match        https://learning.edx.org/*
// @match        https://courses.edx.org/*
// @icon         https://www.google.com/s2/favicons?domain=edx.com
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/428590/edX%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/428590/edX%20Downloader.meta.js
// ==/UserScript==

// https://stackoverflow.com/questions/14308588/simple-jquery-selector-only-selects-first-element-in-chrome
// If jQuery isn't present on the webpage, and of course no other code assigns something to $, Chrome's JS console assigns $ a shortcut to document.querySelector().
// You can achieve what you want with $$(), which is assigned by the console a shortcut to document.querySelectorAll().

// TODO: Add real title
// TODO: Download in floder
// TODO: label of already download
// TODO: Process bar
// TODO: Count of current course
// TODO: Download html
// TODO: Auto goto nextpage and download

// jks_ is the namespace

// The structure is as below
// learning.edx.org -> Containing title
//      ifram, courses.edx.org -> Containing video address


function jks_is_host(site) {
    return window.location.href.indexOf(site) != -1
}


function jks_learning_edu_org() {
    'use strict';

    // Original page has no jQuery
    // $$ can be used in broswer, but not here
    // below line from https://github.com/akhodakivskiy/VimFx/issues/841#issuecomment-263197162
    const $$ = (...args) => Array.from(document.querySelectorAll(...args));

    var checkExist = setInterval(function() {
        let all_titles = $$("ol.list-unstyled a");
        let all_buttons = $$("div.sequence-navigation-tabs > button");
        if (all_titles.length && all_buttons.length) {
            clearInterval(checkExist);

            /// Get course meta data
            let course_name = all_titles[1].text;
            let paragraph_name = all_titles[2].text;
        
            let all_sections = all_buttons.map(button=>button.title);
            let active_section_index = all_buttons.findIndex(button=>button.classList.contains("active"));
            let active_section = all_sections[active_section_index];
        
            console.log("jks edx names", course_name, paragraph_name, active_section);
            GM_setValue("names", [course_name, paragraph_name, active_section, active_section_index]);

            /// Register action to detect meta data change
            let class_context = $$("div.sequence-navigation-tabs")[0];
            // https://stackoverflow.com/questions/38861601/how-to-only-trigger-parent-click-event-when-a-child-is-clicked/38861760
            class_context.addEventListener('click', function(event) {
                let button = event.target;
                while (button.nodeName != "BUTTON") {
                    button = button.parentElement;
                }

                let new_section = button.title;
                let new_section_index = all_buttons.findIndex(b => b===button);
                GM_setValue("names", [course_name, paragraph_name, new_section, new_section_index]);
            }, true);
        }
     }, 100); // check every 100ms
}

function jks_courses_edx_org() {
    'use strict';

    // Original page has jQuery

    // The content is under an iframe
    // So @match is https://courses.edx.org, not https://learning.edx.org
    // Can not use `window.$` as below ajax, don't know why
    let video = $('.video-download-button')[0];
    let video_url = video.href;

    // Create a button
    let download_all_button = document.createElement("div");
    download_all_button.innerHTML = `
        <label>
            <input id="jks_checkbox_mp4" type="checkbox", checked=true>
            <span>*.mp4</span>
            <input id="jks_checkbox_srt" type="checkbox", checked=true>
            <span>*.srt</span>
            <input id="jks_checkbox_txt" type="checkbox">
            <span>*.txt</span>
        </label>
        <button id="jks_button">Download All</button>
        <form>
            <label for="jks_input_folder">Folder</label>
            <input type="text" id="jks_input_folder" name="jks_input_folder" size="72">
            <label for="jks_input_mp4">*.mp4 location:</label>
            <input type="text" id="jks_input_mp4" name="jks_input_mp4" size="72">
            <label for="jks_input_srt">*.srt location:</label>
            <input type="text" id="jks_input_srt" name="jks_input_srt" size="72">
            <label for="jks_input_txt">*.txt location:</label>
            <input type="text" id="jks_input_txt" name="jks_input_txt" size="72">
        </form> 
        `;
    // Video download event is at parent element 
    // So add button after parent, or it's button click will be hide by parent
    // Add 2 other parentElement to widen input box
    video.parentElement.parentElement.parentElement.append(download_all_button)

    // Cannot use $, don't know why
    let srt_url = document.querySelector("li.transcript-option a").href;

    // Use $ instead of window.$, previously window.$ is ok, don't know why
    $.ajax({
        url: document.querySelector("li.transcript-option a").href,
        type: "HEAD",
        success: function(res, status, xhr) {
            let srt_header = xhr.getResponseHeader("content-disposition");
            // attachment; filename="02_TinyML_C02_03-01-01-en.srt" => 02_TinyML_C02_03-01-01-en.srt
            // let srt_file_name = srt_header.slice(22, -1);
            // let mp4_file_name = srt_file_name.slice(0, -4)+".mp4";
            // let txt_file_name = srt_file_name.slice(0, -4)+".txt";

            let names = GM_getValue("names", ["edx-unknown-course", "edx-unknown-paragraph", "edx-unknown-section"]);
            let folder_name = names[0]+"/"+names[1]
            let base_name = String(names[3]).padStart(2, "0")+"-"+names[2];
            let mp4_file_name = base_name + ".mp4";
            let srt_file_name = base_name + ".srt";
            let txt_file_name = base_name + ".txt";
            $("#jks_input_folder")[0].value = folder_name;
            $("#jks_input_mp4")[0].value = mp4_file_name;
            $("#jks_input_srt")[0].value = srt_file_name;
            $("#jks_input_txt")[0].value = txt_file_name;

            $("#jks_button").click(function() {
                if ($("#jks_checkbox_mp4")[0].checked) {
                    // video is CORS (Cross-origin resource)
                    // Set tampermonkey `Download Mode` option to `Browser API`
                    // https://www.tampermonkey.net/faq.php?ext=dhdg#Q302
                    GM_download(video_url, $("#jks_input_folder")[0].value+"/"+$("#jks_input_mp4")[0].value);
                }

                if ($("#jks_checkbox_srt")[0].checked) {
                    GM_download(srt_url, $("#jks_input_folder")[0].value+"/"+$("#jks_input_srt")[0].value);
                }

                if ($("#jks_checkbox_txt")[0].checked) {
                // Txt and srt and the same file
                    GM_download(srt_url, $("#jks_input_folder")[0].value+"/"+$("#jks_input_txt")[0].value);
                }
            })
        }
    })
}

(function() {
    'use strict';

    if (jks_is_host("courses.edx.org")) {
        jks_courses_edx_org();
    }

    if (jks_is_host("learning.edx.org")) {
        jks_learning_edu_org();
    }
})();
