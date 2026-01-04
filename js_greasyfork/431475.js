// ==UserScript==
// @name         视频同步助手
// @namespace    caiguang1997
// @version      1.1
// @description  视频同步助手（测试版本，请勿下载）
// @author       caiguang1997
// @include      *
// @exclude      *message.bilibili.com*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/431475/%E8%A7%86%E9%A2%91%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431475/%E8%A7%86%E9%A2%91%E5%90%8C%E6%AD%A5%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//TODO:
//1. 将本地时间与视频时间打包发送云端，另一端获取后再同步
//2. 本地视频功能未添加

var access_token = "324dda089ee2901d967757a7959bddce";
const gist_id = "5j10kbfng38pa9h7lqiuz90";

var setting_local = new SettingInit();
var setting_remote = new SettingInit();

var timer = null;
var first_in = true;
var is_mouse_move = false;
var is_mouse_enter = false;
var button_opacity = 1;
var file_content = "";

// Convert string to web element
function parseDom(arg) {
    var d = document.createElement('div');
    d.innerHTML = arg;
    return d.firstChild;
}

// Create new button
function createButton() {
    var buttonHtml = '<button ' +
        'id="video_sync" ' +
        'style="' +
        'display: none;' +
        'opacity: 0;' +
        '-webkit-user-select: none;' +
        'cursor: pointer;' +
        'background-color: #fec1de;' +
        'position: fixed;' +
        'top: 50%;' +
        'right: 0;' +
        'width: 80px;' +
        'height: 30px;' +
        'padding: 2px 2px 2px 5px;' +
        'box-sizing: border-box;' +
        'margin: 0 3px;' +
        'float: left;' +
        'border-radius: 15px;' +
        'outline: none;' +
        'z-index: 2147483647;' +
        '">' +
        '视频同步' +
        '</button>';
    var new_button = parseDom(buttonHtml);
    new_button.onclick = manual_sync;
    return new_button;
}

//生成min到max之间的随机整数
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function SettingInit() {
    this.user_id = "null";
    this.video_link = "null";
    this.video_paused = "null";
    this.video_speed = "null";
    this.episode = "null";
    this.sync_time = "null";
}

//获取服务器配置
function get_server_setting(setting, deal_function=null) {
    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            if(this.responseText.search("video_sync.html")!==-1) {
                file_content = JSON.parse(this.responseText)["files"]["video_sync.html"]["content"];        //更新content
                if(file_content.search("user_id")!==-1) {
                    setting.user_id = file_content.match(/(?<=<user_id>).*?(?=<\/user_id>)/)[0];
                    setting.video_link = file_content.match(/(?<=<video_link>).*?(?=<\/video_link>)/)[0];
                    // setting.video_link = location.href;
                    setting.video_paused = file_content.match(/(?<=<video_paused>).*?(?=<\/video_paused>)/)[0];
                    setting.video_speed = file_content.match(/(?<=<video_speed>).*?(?=<\/video_speed>)/)[0];
                    setting.episode = file_content.match(/(?<=<episode>).*?(?=<\/episode>)/)[0];
                    setting.sync_time = file_content.match(/(?<=<sync_time>).*?(?=<\/sync_time>)/)[0];
                }
            }
            else {
                console.log(this.responseText);
            }
        }
    });

    xhr.open("GET", "https://gitee.com/api/v5/gists/" + gist_id + "?access_token=" + access_token);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send();
}

//修改服务器配置
function set_server_setting(setting) {
    var data = "{\"access_token\":\""+access_token+"\",\"files\":{\"video_sync.html\":{\"content\":\"" + file_content + "\"}},\"description\":\"video_sync\",\"public\":\"false\"}";
    data = data.replace(/\r\n/g, "\\r\\n");
    data = data.replace(/(?<=<user_id>).*?(?=<\/user_id>)/, setting.user_id);
    data = data.replace(/(?<=<video_link>).*?(?=<\/video_link>)/, setting.video_link);
    data = data.replace(/(?<=<video_paused>).*?(?=<\/video_paused>)/, setting.video_paused);
    data = data.replace(/(?<=<video_speed>).*?(?=<\/video_speed>)/, setting.video_speed);
    data = data.replace(/(?<=<episode>).*?(?=<\/episode>)/, setting.episode);
    data = data.replace(/(?<=<sync_time>).*?(?=<\/sync_time>)/, setting.sync_time);

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
            if(first_in) {
                first_in = false;
            }
            else {
                if(this.responseText.search("Access token does not exist")>=0) {
                    access_token = prompt("请输入有效的token或关闭本油猴脚本", access_token);
                    localStorage.access_token = access_token;
                }
                else if(this.responseText.search('Gist')>=0) {
                    alert("have no such gist!");
                }
                else if(this.responseText.search("video_sync.html")!==-1) {
                    console.log("set server setting successfully!");
                }
                else {
                    console.log(this.responseText);
                }
            }
        }
    });

    xhr.open("PATCH", "https://gitee.com/api/v5/gists/" + gist_id);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send(data);
}

//发送同步配置
function manual_sync() {
    setting_local.video_link = location.href;
    setting_local.video_paused = document.querySelector('video').paused + "";
    setting_local.video_speed = document.querySelector('video').playbackRate + "";
    // setting_local.episode = document.querySelector("#eplist_module > div.list-wrapper.simple > ul > li.ep-item.cursor.badge.visited").innerText.match(/\d*/)[0];
    setting_local.sync_time = document.querySelector('video').currentTime + "";
    set_server_setting(setting_local);
}

//接收同步配置
function timer_callback() {
    get_server_setting(setting_remote);

    const time_offset = 1;//视频缓冲时的时间补偿
    //同步视频链接
    // if(location.href!==setting_remote.video_link&&setting_remote.video_link!=="null") {
    //     set_server_setting(new SettingInit());//TODO:
    //     clearInterval(timer);
    //     location.href = setting_remote.video_link;
    // }
    // else {
        if(setting_remote.user_id!==setting_local.user_id&&setting_remote.user_id!=="null") {
            if(setting_remote.sync_time!=="null") {
                //同步时间并同步开始暂停
                if(setting_remote.video_paused==="true") {
                    document.querySelector('video').currentTime = setting_remote.sync_time*1;
                    document.querySelector('video').pause();
                }
                else {
                    document.querySelector('video').currentTime = setting_remote.sync_time*1 + time_offset;
                    document.querySelector('video').play();
                }
                //TODO：同步播放速度，同步集数，同步弹幕

                console.log("sync_time: " + setting_remote.sync_time);
            }
            set_server_setting(new SettingInit());
        }
    // }
}

//程序入口
(function() {
    //登录时清除服务器配置
    get_server_setting(new SettingInit());
    set_server_setting(new SettingInit());

    setting_local.user_id = "id_" + access_token + "_" + randomInt(0, 10000000000);

    if(localStorage.access_token!==undefined) access_token = localStorage.access_token;

    document.querySelector("body").appendChild(createButton()); //创建按键
    document.querySelector("body").onmousemove = function () {is_mouse_move = true;};
    document.querySelector("#video_sync").onmouseenter = function () {is_mouse_enter = true;};  //TODO:有点小bug，当鼠标原本就在按键上时，刷新会无效，不过也就一次无效
    document.querySelector("#video_sync").onmouseleave = function () {is_mouse_enter = false;};

    setTimeout(function() {
        timer = setInterval(function (){
            if(document.querySelector('video')) {
                if(is_mouse_enter===false) {
                    button_opacity -= 0.05;
                    if(button_opacity<0) button_opacity=0;
                }
                else {
                    button_opacity = 1;
                }

                if(is_mouse_move===true) {
                    is_mouse_move = false;
                    button_opacity = 1;
                }
                document.querySelector('video').style.zIndex = '1';
                document.querySelector("#video_sync").style.opacity = button_opacity;
                document.querySelector("#video_sync").style.display="block";
                timer_callback();
            }
            else{
                document.querySelector("#video_sync").style.display="none";
            }
        }, 100);
    }, 2000);
})();
