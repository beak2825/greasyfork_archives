// ==UserScript==
// @name        set域名跳转
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  选择set，跳转到对应前缀
// @author       moumingyi
// @match        http://*.waimai.test.sankuai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371624/set%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/371624/set%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 判断是否已经进入set环境
    function alreadySet() {
        if (/.*\.(east|west|north)\.waimai\..*$/ig.test(window.location.host)) {
            var setEnv = window.location.host.split('.').find(function(item){
                return ['east', 'west', 'north'].indexOf(item) !== -1;
            });
            // 已经进入，显示环境标签
            $('body').append('<div id="set_env_panel" style="position: fixed; right:0; bottom: 0; z-index: 999; height: 150px; background: #ff5050; color: #fff; font-size: 18px; padding: 24px; text-align: center;"><div id="set_env_close" style="color: #fff; cursor:pointer; position: absolute; left: 0; top:-6px; width:10px;height:10px; font-size: 14px;">x</div><span style="word-wrap: break-word; display: inline-block; width: 12px; line-height: 22px;">'+ setEnv +'</span></div>')
            $('#set_env_close').one('click',function() {
                $('#set_env_panel').remove();
            });
        } else {
            // 未进入，选择环境
            showSetOption();
        }
    }

    // 定义切换方框
    function showSetOption() {
        $('body').append('<div id="env_panel"><div style="position:fixed; z-index: 998; width:100%; height:100%; left:0; top:0; background:#000; opacity:0.3; filter:alpha(opacity=30);"></div><div style="position: fixed; z-index: 999; left: 50%; top: 35%; margin-left: -150px; width: 300px; background:#fff; padding:10px; border-radius: 4px;"><div><p style="padding: 10px 10px 5px 10px;">请选择set环境</p><div style="padding: 0 10px 15px 10px;"><input type="radio" name="env" value="east" style="margin: 5px; display:inline-block !important; position:static; opacity: 1; margin:0;">east<br><input type="radio" name="env" value="west" style="margin: 5px; display:inline-block !important; position:static; opacity: 1; margin:0;">west<br><input type="radio" name="env" value="north" style="margin: 5px; display:inline-block !important; position:static; opacity: 1; margin:0;">north</div></div><div style="text-align: center;"><button style="border-radius: 5px; height: 28px;  padding:0 16px; margin:0 15px; background:#ff9000; color:#fff; cursor: pointer;" id="set_confirm">确认跳转</button><button style="border-radius: 5px; height: 28px;  padding:0 16px; margin:0 15px; cursor: pointer;" id="set_cancel">维持原状</button></div></div></div>')
        $('#set_confirm').on('click', function(){
            var setVal = $('input[name="env"]:checked').val();
            if (setVal) {
                $('#env_panel').remove();
                window.location.href = window.location.href.replace('waimai', setVal + '.waimai');
            }
        });
        $('#set_cancel').one('click', function(){
            $('#env_panel').remove();
        });
    }
    // 加载jquery
    if (!window.jQuery) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = alreadySet;
        script.src = "https://s0.meituan.net/bs/tempfs/file/moumingyi/jquery-3.3.1.min.js";
        document.body.appendChild(script);
    } else {
        alreadySet();
    }
}
)();