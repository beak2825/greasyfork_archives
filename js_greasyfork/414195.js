// ==UserScript==
// @name         腾讯视频下载
// @namespace    http://simpleel.com/
// @version      0.3
// @description  下载腾讯视频，关注微信小程序“晟游礼包”免费领取礼包！
// @author       Toven
// @mail         ttw130@gmail.com
// @supportURL   https://simpleel.com
// @icon         https://v.qq.com/favicon.ico
// @match        *://v.qq.com/*
// @match        *://m.v.qq.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.0/jquery.min.js
// @resource icon2 https://simpleel.com/images/qr-game.png
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle
// @compatible   chrome
// @compatible   firefox
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/414195/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/414195/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;
    // __PRELOADED_STATE__ || window.__PRELOADED_STATE__;

    $(function(){
        init();
    });

    function isPC(){
        return window.location.href.indexOf('://m.v') == -1
    }

    function fetchVideo(){
        var videoUrl = ''
        if(!isPC()){
            var mv = $('#player').find('video[src]').eq(0);
            videoUrl = mv.attr('src');
            console.log('fetching mobile video: ', videoUrl);
        }else{
            var pv = $('#tenvideo_player .txp_player .txp_video_container video[src]').eq(0);
            videoUrl = pv.attr('src');
            console.log('fetching', videoUrl);
        }
        var text = '';

        if(!videoUrl){
            text='请等待视频广告播放完毕...';
        }else if (videoUrl.indexOf('blob:') != -1) {
            text = '此视频需要进入手机模式，请按F12打开开发者工具，并选择手机浏览模式...';
        }else{
            text = '<a target="_blank" href="'+ videoUrl +'">下载视频（点击或右键另存为）</a>';
        }
        $('#mod_dl_codes').html(text);
    };

    function init(){
        addStyle();
        addVideoDownloader();
    }

    function addStyle(){
        GM_addStyle(`
.button-open{display:block;}
.dl-container{border-radius:10px;width:330px;height:500px;margin-left:10px;text-align:center}
.dl-link,.dl-link a{color:red;font-weight:bold;padding:30px 0;}`);
    }

    function addVideoDownloader(){
        if(isPC()){
            var html = $(`<div><div class="action_item action_dl">
            <a class="action_title" style="padding-left:10px" href="javascript:;"><i class="icon_sm icon_download_sm"></i><span class="icon_text">下载</span><i class="triangle_up"><i class="triangle_inner"></i></i></a>
            <div class="mod_pop_action mod_pop_action_dl dl-container">
                <div class="mod_pop_action_section" style="background:none">
                   <div id="mod_dl_codes" class="dl-link">正在获取视频源，等待广告播放完即可获取到视频资源...<div>（如果一直未响应，请刷新页面！）</div></div>
                   <div>扫码玩重启人生，重开你的人生。<br/><img style="width:300px;height:300px" src="https://simpleel.com/images/restartlife.png"/></div>
                </div>
            </div>
        </div></div>`);

            $(html).children('.action_item').hover(() => {
                $(html).find('.mod_pop_action_dl').toggleClass('button-open');
                fetchVideo();
            });
            $('.mod_action').prepend(html);
            return;
        }

        var container = $('.video_function_right')
        container.find('.btn_download').remove()
        $('body').append(`<div id="custom-download-dialog" style="text-align:center;display:none;position:absolute;top:200px;width:100%;height:100%;z-index:1000;">
        <div style="margin:auto;background: #000;color:#fff;width:380px;height:500px;border-radius: 20px;padding: 30px;">
        <div id="mod_dl_codes" style="font-weight:bold;color:#ff0000">正在获取视频源，等待广告播放完即可获取到视频资源...</div>
        微信搜索“重启人生RestartLife“小程序或扫码玩重启人生，重开你的人生。<br/><img style="border-radius:100%;margin:10px 0;width:300px;height:300px" src="https://simpleel.com/images/restartlife.png"/>
        <input value="关闭浮窗" type="button" id="btn-close-dialog" style="background:#f8f8f8;font-weight:bold;margin:0 auto;padding:10px 30px;"/>
        </div>
        </div>`);
        container.prepend('<a id="btn-download-custom" style="margin-right:10px" class="btn_download" href="javascript:;" aria-label="下载" dt-eid="download"><svg width="28" height="28" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="none" d="M0 0h28v28H0z"></path><g transform="translate(4.5 3)"><path d="M14.5 2h2a2 2 0 012 2v14a2 2 0 01-2 2h-14a2 2 0 01-2-2V4a2 2 0 012-2h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><rect fill="currentColor" x="8.5" width="2" height="13" rx="1"></rect><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5.5 10l4 4 4-4"></path></g></g></svg></a>');

        container.find('#btn-download-custom').click(function(){
            console.log('aa===================aaaaa');
            $('#custom-download-dialog').show();
            fetchVideo();
        });
        $('#btn-close-dialog').click(function(){
            $('#custom-download-dialog').hide();
        });
    }

})();