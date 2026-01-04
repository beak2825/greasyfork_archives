// ==UserScript==
// @name         CHDBits 发种辅助工具
// @namespace    http://tampermonkey.net/
// @description  从本地加载引用以前发过的种子的模板, 本工具需要配合桌面软件使用,单独使用没有任何作用;
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @license      MIT
// @version      1.0.0.1
// @include      *://chdbits.co/upload.php
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432537/CHDBits%20%E5%8F%91%E7%A7%8D%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/432537/CHDBits%20%E5%8F%91%E7%A7%8D%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var base_api_url='http://127.0.0.1:13258'

    var tdhtml = "<tr> "
        + "<td class=\"rowhead nowrap\" valign=\"top\" align=\"right\">引用种子（BETA）</td>"
        + "<td id=\"chd_template_list\" class=\"rowfollow\" valign=\"top\" align=\"left\">"
        + "</td></tr>"
    $.getScript('https://cdn.staticfile.org/layer/3.1.1/layer.js', function () {
        $("#compose table tr").eq(0).after(tdhtml);

        $.ajax({
            type: 'GET',
            url: base_api_url+ '/api/template',
            dataType: 'JSON',
            beforeSend: function () {
                layer.load(2);
            },
            async: true,
            success: function (data) {
                layer.closeAll('loading');

                $.each(data.data,function(idx,item){
                    $('#chd_template_list').append(idx + '. <a class="chd_load_template" href="javascript:;" ref="'+base_api_url+'/api/get/'+ item +'">' +item+'</a> <br />');
                });

                $('.chd_load_template').on('click',LoadData)
            },
            error: function (data) {
                layer.closeAll('loading');
                layer.msg("加载失败, 请告知开发人员.", { icon: 5, skin: 'layui-layer-lan' });
            }
        });
    });
    function LoadData(datastring) {
        $.ajax({
            type: 'GET',
            url: $(this).attr('ref'),
            dataType: 'JSON',
            beforeSend: function () {
                layer.load(2);
            },
            async: true,
            success: function (res) {
                layer.closeAll('loading');
                console.log(res.data);

                var data=res.data;
                $('#name').val(data.title);//标题
                $('input[name="small_descr"]').val(data.vice_title);//副标题
                $("input[name='url']").val(data.imdb_link);//IMDB链接
                $("textarea[name='descr']").val(decodeURIComponent(data.content));//简介

                $("#browsecat").val(data.type);//类型
                $("select[name='source_sel']").val(data.source);//来源
                $("select[name='medium_sel']").val(data.media_type);//媒介
                $("select[name='codec_sel']").val(data.video_codec);//编码
                $("select[name='audiocodec_sel']").val(data.audio_codec);//音频编码
                $("select[name='standard_sel']").val(data.resolution);//分辨率
                $("select[name='processing_sel']").val(data.processing);//处理
                $("select[name='team_sel']").val(data.team);//制作组

                $("input[name='perent']").prop("checked", data.official);//官方
                $("input[name='first']").prop("checked", data.first);//首发
                $("input[name='oneself']").prop("checked", data.only_us);//独占
                $("input[name='cnlang']").prop("checked", data.cn_lang);//国语
                $("input[name='diy']").prop("checked", data.diy);//DIY
                $("input[name='cnsub']").prop("checked", data.cn_subtitle);//中字
                $("input[name='limited']").prop("checked", data.limitation);//限转
                $("input[name='txtsub']").prop("checked", data.special_efficacy);//特效

                $("input[name='uplver']").prop("checked", data.anonymous);//匿名发布

                //layer.msg("", { icon: 6, skin: 'layui-layer-lan' });

                console.log($('#qr').offset().top)
                $('html').animate({scrollTop:$('#qr').offset().top-$(window).height()+30 }, 500);
            },
            error: function (data) {
                layer.closeAll('loading');
                layer.msg("加载失败, 请告知开发人员.", { icon: 5, skin: 'layui-layer-lan' });
            }
        });
    }
})();