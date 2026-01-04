// ==UserScript==
// @name         企叮咚产品图片下载
// @namespace    http://www.bcbin.cn/
// @version      0.0.10
// @icon         http://www.7dingdong.com/favicon.ico
// @description  下载云企叮咚产品图片和详情图片
// @author       Bcbin
// @license      MIT
// @match        http://www.7dingdong.com/*goods/addCart?gid=*
// @grant        GM_download
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/392293/%E4%BC%81%E5%8F%AE%E5%92%9A%E4%BA%A7%E5%93%81%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/392293/%E4%BC%81%E5%8F%AE%E5%92%9A%E4%BA%A7%E5%93%81%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reg = /[0-9a-z\u4e00-\u9fa5]/ig;
    var title = $('h2.title').text();
    var filename = title.match(reg).join("");
    $('.ys_warpBox').after('<dd style="width:110%;display:none;" id="bcbin"><a href="javascript:void(0)" id="copy_title" class="sel_submit" style="margin-right:5px;width:100px;">拷贝标题</a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" id="copy_price" class="sel_submit" style="margin-right:5px;width:100px;">拷贝价格</a>&nbsp;&nbsp;<a href="javascript:void(0)" id="copy_code" class="sel_submit" style="margin-right:5px;width:100px;">拷贝代码</a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" id="download_slider" class="sel_submit" style="margin-right:5px;width:100px;">下载轮播图</a>&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" id="download_detail" class="sel_submit" style="width:100px;">下载详情图</a></dd>');
    $(document).on('click', '#copy_title', function() {
        GM_setClipboard(title);
        layer.msg('标题拷贝成功');
    })
    $(document).on('click', '#copy_price', function() {
        GM_setClipboard($('#enjoy_price > i').prop('firstChild').nodeValue+'.'+$('#enjoy_price .text_obscure').text());
        layer.msg('价格拷贝成功');
    })
    $(document).on('click', '#copy_code', function() {
        var code = "<p style='display:flex;flex-direction:column;'>";
        if ($('.sd_item_flash > img').length) {
            $('.sd_item_flash > img').each(function(index, ele) {
                var savename = filename + ('_详情图_'+(index + 1)+'.jpg');
                code += '<img width="100%" src="http://cdn.zhylgz.cn/'+savename+'" />';
            });
        } else if ($('.sd_item_flash > p:eq(1) img').length) {
            $('.sd_item_flash > p:eq(1) img').each(function(index, ele) {
                var savename = filename + ('_详情图_'+(index + 1)+'.jpg');
                code += '<img width="100%" src="http://cdn.zhylgz.cn/'+savename+'" />';
            });
        }
        code += '</p>';
        GM_setClipboard(code);
        layer.msg('代码拷贝成功');
    })
    $(document).on('click', '#download_slider', function() {
        $('#imageMenu img').each(function(index, ele) {
            var savename = filename + ('_轮播图_'+(index + 1)+'.jpg');
            GM_download(ele.src.replace('small_', ''), savename);
        });
    })
    $(document).on('click', '#download_detail', function() {
        if ($('.sd_item_flash > img').length > 0) {
            $('.sd_item_flash > img').each(function(index, ele) {
                var savename = filename + ('_详情图_'+(index + 1)+'.jpg');
                GM_download(ele.src, savename);
            });
        } else if ($('.sd_item_flash > p:eq(1) img').length > 0) {
            $('.sd_item_flash > p:eq(1) img').each(function(index, ele) {
                var savename = filename + ('_详情图_'+(index + 1)+'.jpg');
                GM_download(ele.src, savename);
            });
        }

    })
    $('body').dblclick(function() {
         $('#bcbin').toggle();
    });
})();