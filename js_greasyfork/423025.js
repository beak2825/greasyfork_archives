// ==UserScript==
// @name         b站直播自动换牌子
// @homepageURL  https://space.bilibili.com/13321030
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  当进入直播间和单击弹幕输入框时，自动换上当前直播间的牌子。
// @author       小长长
// @include      /https?:\/\/live\.bilibili\.com\/[blanc\/]?[^?]*?\d+\??.*/
// @grant        none
// @run-at       document-end
// @require        https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/423025/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8D%A2%E7%89%8C%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/423025/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8D%A2%E7%89%8C%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var medal_name = "";


    const list = [];
    window.toast = (msg, type = 'info', timeout = 5e3) => {
              switch (type) {
                case 'success':
                case 'info':
                case 'caution':
                case 'error':
                  break;
                default:
                  type = 'info';
              }
              const a = $(`<div class="link-toast ${type} fixed" style="z-index:2001"><span class="toast-text">${msg}</span></div>`)[0];
              document.body.appendChild(a);
              a.style.top = (document.body.scrollTop + list.length * 40 + 10) + 'px';
              a.style.left = (document.body.offsetWidth + document.body.scrollLeft - a.offsetWidth - 5) + 'px';
              list.push(a);
              setTimeout(() => {
                a.className += ' out';
                setTimeout(() => {
                  list.shift();
                  list.forEach((v) => {
                    v.style.top = (parseInt(v.style.top, 10) - 40) + 'px';
                  });
                  $(a).remove();
                }, 200);
              }, timeout);
            };

    // Your code here...
    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }

    function wear_medal(medal_id) {
        var csrf = getCookie('bili_jct');
        var value = 'csrf='+csrf+'&medal_id='+medal_id;

        var url = 'https://api.live.bilibili.com/xlive/web-room/v1/fansMedal/wear';
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            var resp = JSON.parse(this.responseText);
            window.toast("[" + medal_name + "]: " + resp.message);
        };
        xhr.withCredentials = true;
        xhr.send(value);
    }

    function try_to_change_medal(medal_id) {
        var url = 'https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id='+9196015;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            var resp = JSON.parse(this.responseText);
            if (resp.data.medal.curr_weared === null) {
                wear_medal(medal_id);
                return;
            }
            if (resp.data.medal.curr_weared.target_roomid !== get_room_id()) {
                wear_medal(medal_id);
                return;
            }
        };
        xhr.withCredentials = true;
        xhr.send();
    }

    function get_room_id() {
        var room_id_str = window.location.href.split('?')[0].split('/')[3];
        return parseInt(room_id_str);
    }

    async function add_listener(medal_id) {
        while (document.getElementsByClassName('chat-input-ctnr p-relative').length == 0) {
            await sleep(10);
        }
        var area = document.getElementsByClassName('chat-input-ctnr p-relative')[0];
        area.onclick = function() {try_to_change_medal(medal_id);};
    }

    window.addEventListener('load', function() {
        var url = "http://api.live.bilibili.com/fans_medal/v5/live_fans_medal/iApiMedal?page=1&pageSize=200";
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            var resp = JSON.parse(this.responseText);
            for (var i in resp.data.fansMedalList) {
                if (resp.data.fansMedalList[i].roomid === get_room_id()) {
                    var fansMedal = resp.data.fansMedalList[i];
                    medal_name = fansMedal.medal_name;
                    console.log(fansMedal);
                    try_to_change_medal(fansMedal.medal_id);
                    add_listener(fansMedal.medal_id);
                    return;
                }
            }
        };
        xhr.withCredentials = true;
        xhr.send();
    }, false);
})();