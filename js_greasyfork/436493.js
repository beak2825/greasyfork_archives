// ==UserScript==
// @name         柳檬营销-同步微擎信息（梁彬）
// @namespace    https://console.ad.liumeng.xyz
// @supportURL   https://console.ad.liumeng.xyz
// @version      1.0
// @description  柳檬营销同步插件 https://console.tebieshuang.xyz
// @author       Leo
// @license      Apache
// @match        https://lb7.aa6vv.com/web/index.php?c=module&a=welcome&do=welcome_display&module_name=jyt_txvideo&uniacid=*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.9.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/436493/%E6%9F%B3%E6%AA%AC%E8%90%A5%E9%94%80-%E5%90%8C%E6%AD%A5%E5%BE%AE%E6%93%8E%E4%BF%A1%E6%81%AF%EF%BC%88%E6%A2%81%E5%BD%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/436493/%E6%9F%B3%E6%AA%AC%E8%90%A5%E9%94%80-%E5%90%8C%E6%AD%A5%E5%BE%AE%E6%93%8E%E4%BF%A1%E6%81%AF%EF%BC%88%E6%A2%81%E5%BD%AC%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/theme/default/layer.min.css" rel="stylesheet">`);
    setTimeout(function(){
        $($('.headop:first-child').children("div").get(0)).html('<button class="el-button el-button--danger el-button--small" id="liumeng"><span>同步至柳檬</span></button>');
    }, 1000);
    setTimeout(function(){
        $('#liumeng').on('click', function(){
            var selectedObjects = $('.el-table__body label.is-checked'), selectedLength = selectedObjects.length, id = window.location.href.split('uniacid=')[1].split('&version_id=')[0], items = new Array(), item, vid, content;
            if(selectedLength<=0){
                return layer.msg('请先选择需要同步的视频');
            }
            for( var i = 0; i < selectedLength; i++ ){
                item = $(selectedObjects[i].closest('tr'));
                vid = $(item.children("td").get(4)).text();
                if(vid.indexOf('wxv_') === -1){
                    items.push({title: $(item.children("td").get(2)).text(), vid: vid});
                }
            }
            if(items.length <= 0){
                return layer.msg('请先至少选择一个来自于腾讯视频的视频');
            }
            layer.prompt({
                value: '',
                title: '请输入公众号APPID',
            }, function(value, index, elem){
                layer.close(index);
                if(value === '' || value === null || value.length <= 0){
                    return layer.msg('请先输入APPID');
                }
                content = {id: id, appId: value, items: items};
                var load = layer.load(2, {time: 1000000});
                $.post('/liumeng/liumeng.php', content, function(d){
                    d = typeof d === 'string' ? JSON.parse(d) : d;
                    layer.close(load);
                    layer.msg(d.message);
                });
            });
        });
    }, 2000);
})();