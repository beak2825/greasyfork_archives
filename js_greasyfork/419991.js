// ==UserScript==
// @name         免费 vmss 代理
// @namespace      https://greasyfork.org/users/3128
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @require      https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require         https://cdn.staticfile.org/layer/2.3/layer.js
// @resource layerCSS https://lib.baomitu.com/layer/3.1.1/theme/default/layer.css

// @connect      my.ishadowx.biz
// @connect      view.freev2ray.org
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant          GM_setClipboard
// @grant          GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/419991/%E5%85%8D%E8%B4%B9%20vmss%20%E4%BB%A3%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/419991/%E5%85%8D%E8%B4%B9%20vmss%20%E4%BB%A3%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let u=unsafeWindow,
        webHost=location.host.toLowerCase(),
        webPath=location.pathname.toLowerCase();

    let web={
        'view.freev2ray.org': {
            url : 'href',
            qrcode: '[data-title="vmess"]',
        }
    }

    if(web[webHost]) {
        let webConf=web[webHost];
        console.log(webHost, web[webHost], $(webConf.qrcode));
        $('body').prepend($('<img>').attr('src',$(webConf.qrcode).attr(webConf.url)));
    }

    let com={
        'v2ray' : function(site){
            let time=new Date().getTime();
            let v2raySite={
                ishadowx : {
                    url: 'https://my.ishadowx.biz/',
                    rule : 'find("#urlv201").parent().next().find("a").attr("href")',
                    tips : '有效期 6 小时'
                },
                freev2ray : {
                    url: 'https://view.freev2ray.org/',
                    rule : '.find(\'[data-title="vmess"]\').attr("href")',
                    tips : '有效期 12 小时'
                },
            }
            let v2Conf=v2raySite[site],
                v2Sorce=v2Conf.url,
                v2Rule=v2Conf.rule;

            GM_xmlhttpRequest({
                'url':v2Sorce+'?t='+time,
                'onload': function(e){
                    console.log(v2Sorce, v2Rule)
                    console.log($(e.responseText));
                    let result=eval('$(e.responseText)'+v2Rule);
                    console.log(v2Sorce+result);
                    load_layer(function(){
                        layer.msg('<img src="'+v2Sorce+result+'" width="450">'+v2Conf.tips,{
                            time:60*1000,
                            area:['500px','500px']
                        }, function(index, layero){
                            $(layero).on('click', function(){layer.close(index)});
                        });
                    });
                }
            })
        },
    }

    // Your code here...
    function getUrlParam(name, url, option, newVal) {//筛选参数，url 参数为数字时
        var search = url ? url.replace(/^.+\?/,'') : location.search;
        //网址传递的参数提取，如果传入了url参数则使用传入的参数，否则使用当前页面的网址参数
        var reg = new RegExp("(?:^|&)(" + name + ")=([^&]*)(?:&|$)", "i");		//正则筛选参数
        var str = search.replace(/^\?/,'').match(reg);

        if (str !== null) {
            switch(option) {
                case 0:
                    return unescape(str[0]);		//所筛选的完整参数串
                case 1:
                    return unescape(str[1]);		//所筛选的参数名
                case 2:
                    return unescape(str[2]);		//所筛选的参数值
                case 'new':
                    return url.replace(str[1]+'='+str[2], str[1]+'='+newVal);
                default:
                    return unescape(str[2]);        //默认返回参数值
            }
        } else {
            return null;
        }
    }

function load_layer(callback, version){
    var layerUrl;
    switch(version){
        case 2:
            layerUrl='https://lib.baomitu.com/layer/2.3/layer.js';
            break;
        default: layerUrl='https://lib.baomitu.com/layer/3.1.1/layer.js';
    }

    $('<link>').attr({rel:"stylesheet", href:GM_getResourceURL("layerCSS")}).appendTo('body');

    if(layer) {
        callback();

    } else if(!u.layer){
        $.getScript(layerUrl, function(e){
            console.log(e);
            var s = document.createElement("link");
            s.href = GM_getResourceURL("layerCSS");
            s.rel = "stylesheet";
            document.body.appendChild(s);
            callback();
        });
    } else {
        callback();
    }
}
    GM_registerMenuCommand('ishadowx', function(){com.v2ray('ishadowx')});
    GM_registerMenuCommand('FreeV2ray', function(){com.v2ray('freev2ray')}, 'v');
})();