// ==UserScript==
// @name         Get Twitch Emotes
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  整合twitch表情
// @author       Lee-7723
// @match        https://www.twitch.tv/*
// @icon         https://static.twitchcdn.net/assets/favicon-16-52e571ffea063af7a7f4.png
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js

// @downloadURL https://update.greasyfork.org/scripts/435490/Get%20Twitch%20Emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/435490/Get%20Twitch%20Emotes.meta.js
// ==/UserScript==

'use strict';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

var body = document.getElementsByTagName('body')[0];
var emote_dict = new Object();
var old_href = document.location.href;
// var emote_btn;
// var all_emotes = new Array();
// var emotes;

let css = document.createElement('style');
css.innerHTML = `
#emote_url_box {
    position: absolute;
    top: 5rem; left: 25%;
    padding: 10px;
    z-index: 9999;
    height: 70%;
    width: 50%;
    min-height: 30rem;
    min-width: 50rem;
    resize: both;
    overflow: scroll;
    background-color: var(--color-background-alt);
    border-radius: 10px;
    border: 1.6px solid var(--color-background-pill);
    box-shadow: 4px 4px 10px #000a;
}
#emote_url_text {
    height: calc(100% - 8.5rem); width: 100%;
    resize: none;
    padding: 12px;
    background-color: var(--color-background-input);
    color: var(--color-text-input);
    overflow: scroll;
    display: flex;
}
#emote_url_box > p:last-of-type {
    margin-top: 0.5rem;
    position: relative;
}
#emote_tool_header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-weight: bold;
}
#emote_url_box > :is(button, a) {
    position: relative;
    right: 8px;
    bottom: 0rem;
    border-radius: 6px;
    margin: 0 0.5rem;
    padding: 1rem;
    float: right;
}
#emote_url_preview {
    height: calc(100% - 8.5rem); width: 100%;
    resize: none;
    padding: 12px;
    background-color: var(--color-background-input);
    color: var(--color-text-input);
    border: 1px solid rgb(118, 118, 118);
    border-radius: 2px;
    overflow-y: scroll;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.emote_preview {
    margin: 5px 5px 1px;
    border: 2px solid #FFF;
    border-radius: 4px;
    width: 112px; height: 112px;">
    <p style="text-align: center; margin-bottom: 3px
}

`;
body.appendChild(css)

async function get_emote_picker_button() {//监视获取聊天区的表情按钮
    'use strict';
    let emote_btn;
    for (var i = 0; !emote_btn; i) {
        await sleep(1000);
        emote_btn = document.querySelectorAll('button[data-a-target="emote-picker-button"]')[0];
        //console.log(emote_btn)
    }
    return emote_btn;
}


get_emote_after_button();
async function get_emote_after_button() {//加载出表情按钮之后
    let emote_btn = await get_emote_picker_button();
    // console.log(emote_btn);
    emote_btn.onclick = function () { output() }//给聊天区的表情按钮添加功能，指向output()
}


async function get_emotes() {//获取表情名img_alt，及表情链接img_srcset
    let emotes_grid;
    while (!emotes_grid) {
        console.log('fetching emotes')
        await sleep(1000);
        var emote_grid_header = document.getElementsByClassName('emote-grid-section__header-title');
        if (emote_grid_header.length == 1) emotes_grid = emote_grid_header[0].parentElement;
        else emotes_grid = emote_grid_header[1].parentElement;
    };

    let emote_imgs = emotes_grid.getElementsByTagName("img");
    let emote_dict = new Object();
    for (let j of emote_imgs) {
        emote_dict[j.alt] = j.src.replace('1.0', '3.0');
    }
    console.log(emote_dict);
    return emote_dict
}


async function output() {
    emote_dict = await get_emotes();//等待获取表情完成
    let emote_json = JSON.stringify(emote_dict);
    var button_class_name = document.querySelectorAll('.chat-input__buttons-container > div:last-of-type button')[1].className;
    let emote_grid_header = document.querySelectorAll('.emote-grid-section__header-title')
    if (emote_grid_header.length == 1) emote_grid_header = emote_grid_header[0];//未登录状态表情区只有一个分类
    else emote_grid_header = emote_grid_header[1];//登录状态选择表情区第二个分类
    // console.log(emote_grid_header)



    let log_button = document.createElement('div');
    log_button.className = "Layout-sc-nxg1ff-0 jreOmo";
    log_button.id = 'emote_url_pop_box';
    log_button.innerHTML = `<div class="Layout-sc-nxg1ff-0 emWtQg">
    <div style="display: inherit;">
        <button id='emote_url_pop' class="${emote_grid_header.lastChild.getElementsByTagName('button')[0].className}">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentcolor">
            <path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z"/></svg>
        </button>
    </div>
    </div>`;
    if (!document.querySelector('#emote_url_pop')) emote_grid_header.insertBefore(log_button, emote_grid_header.children[1]);
    document.getElementById('emote_url_pop').onclick = () => {
        body.append(output_box);
    };


    var output_box = document.createElement("div")
    output_box.id = "emote_url_box";

    var output_text = document.createElement("textarea")
    output_text.id = "emote_url_text";
    output_text.style.display = 'none';

    var preview_box = document.createElement("div");
    preview_box.id = "emote_url_preview";
    preview_box.style.display = 'flex';

    for (let j in emote_dict) {
        var pics = document.createElement("a");
        var pic_img = `<img src=${emote_dict[j]} alt=${j} class='emote_preview'>${j}</p>`;
        pics.innerHTML = pic_img;
        pics.href = emote_dict[j];
        pics.target = 'view emote';
        pics.download = j;
        pics.style.cssText = 'width: 122px; overflow: hidden;';
        preview_box.appendChild(pics);
    };


    var output_author = document.createElement("p")
    output_author.innerHTML = `script by Lee-7723`;

    var output_close_btn = document.createElement("button")
    output_close_btn.className = button_class_name;
    output_close_btn.id = "emote_url_close_btn";
    output_close_btn.onclick = function () { close_emote_box() };
    output_close_btn.innerHTML = '关闭';

    var preview_btn = document.createElement("button")
    preview_btn.className = button_class_name;
    preview_btn.id = "emote_url_preview_btn";
    preview_btn.onclick = function () { return_emote_url_box() };
    preview_btn.innerHTML = '预览json';

    var download_zip_btn = document.createElement("button")
    download_zip_btn.className = button_class_name;
    download_zip_btn.id = "emote_download_zip_btn";
    download_zip_btn.onclick = function () { downloadToZip(emote_dict) };
    download_zip_btn.innerHTML = '下载zip';

    var download_json_btn = document.createElement("a")
    download_json_btn.className = button_class_name;
    download_json_btn.id = "emote_download_json_btn";
    download_json_btn.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(emote_dict))}`;
    download_json_btn.download = 'emotes.json';
    download_json_btn.innerHTML = '下载json';

    var usage = document.createElement("div");
    usage.id = 'emote_tool_header';
    usage.innerHTML = `
    <p>下列表情点击可跳转，可以手动保存</p>
    <div id="drag_to_move" style="width: 2rem; cursor: move"><svg class="icon" style="width: 100%;height: 100%;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="944"><path d="M1013.333333 486.4l-153.6-153.6c-10.666667-10.666667-27.733333-2.133333-27.733333 10.666667v132.266666H544V189.866667h132.266667c14.933333 0 21.333333-17.066667 10.666666-27.733334L533.333333 8.533333c-12.8-12.8-32-12.8-44.8 0l-153.6 153.6c-10.666667 10.666667-2.133333 27.733333 10.666667 27.733334h132.266667v285.866666L192 477.866667v-132.266667c0-14.933333-17.066667-21.333333-27.733333-10.666667L10.666667 488.533333c-12.8 12.8-12.8 32 0 44.8l153.6 153.6c10.666667 10.666667 27.733333 2.133333 27.733333-10.666666v-132.266667h285.866667v285.866667h-132.266667c-14.933333 0-21.333333 17.066667-10.666667 27.733333l153.6 153.6c12.8 12.8 32 12.8 44.8 0l153.6-153.6c10.666667-10.666667 2.133333-27.733333-10.666666-27.733333h-132.266667V544H832v132.266667c0 14.933333 17.066667 21.333333 27.733333 10.666666l153.6-153.6c10.666667-12.8 10.666667-34.133333 0-46.933333z" fill="currentColor" p-id="945"></path></svg></div>
    `;

    output_text.value = emote_json;
    output_box.append(usage, preview_box, output_text, output_author, output_close_btn, preview_btn, download_json_btn, download_zip_btn);
    dragElement(output_box, output_box.querySelector('#drag_to_move'));
}

function close_emote_box() {
    document.getElementById('emote_url_box').remove();
    document.getElementById('emote_url_pop_box').remove();
};

function return_emote_url_box() {
    document.getElementById('emote_url_text').style.display = 'flex';
    document.getElementById('emote_url_preview').style.display = 'none';
    document.getElementById("emote_url_preview_btn").innerHTML = '预览图像';
    document.querySelector("#emote_tool_header > p").innerHTML = '下载emote.json，将文件放在下载器相同路径下';
    document.getElementById("emote_url_preview_btn").onclick = function () { return_emote_preview_box() };
};

function return_emote_preview_box() {
    document.getElementById('emote_url_text').style.display = 'none';
    document.getElementById('emote_url_preview').style.display = 'flex';
    document.getElementById("emote_url_preview_btn").innerHTML = '预览json';
    document.querySelector("#emote_tool_header > p").innerHTML = '下列表情点击可跳转，可以手动保存';
    document.getElementById("emote_url_preview_btn").onclick = function () { return_emote_url_box() };
};

async function downloadToZip(emote_dict) {
    let btn = document.querySelector('#emote_download_zip_btn');
    btn.style.cursor = 'not-allowed';
    btn.onclick = '';
    let counter = 0;
    btn.innerHTML = `下载中 ${counter}/${Object.keys(emote_dict).length}`;
    let zip = JSZip();
    for (let emote_name in emote_dict) {
        let url = emote_dict[emote_name];
        let request = new Promise((resolve) => {
            let http_request = new XMLHttpRequest();
            http_request.open('GET', url);
            http_request.responseType = "arraybuffer"
            http_request.onload = () => {
                let ext = http_request.getResponseHeader('Content-Type').split('/')[1];
                let filename = emote_name + '.' + ext;
                zip.file(filename, http_request.response);
                counter ++;
                btn.innerHTML = `下载中 ${counter}/${Object.keys(emote_dict).length}`;
                resolve();
            };
            http_request.send();
        });
        await request;
    };
    btn.innerHTML = '下载完成';
    zip.generateAsync({ type: "blob" })
        .then(function (blob) {
        saveAs(blob, "emotes.zip");
    });
    return zip;
};



window.onload = () => {
    var observer = new MutationObserver(
        function (mutation) {
            if (old_href != document.location.href) {
                old_href = document.location.href;
                get_emote_after_button();
            }
        }
    );
    observer.observe(body, { childList: true, subtree: true });
};

function dragElement(elmnt, mvelmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    mvelmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    };

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    };

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    };
}
