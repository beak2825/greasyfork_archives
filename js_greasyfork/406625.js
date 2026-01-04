// ==UserScript==
// @name         PTHOME 媒体信息帮助程序一键发种
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  通过JQuery 完成对发布页面的一键填写 杜绝手工填写各种错误的可能性;
// @author       eveloki
// @supportURL   https://pthome.net/contactstaff.php
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @license      MIT
// @include      *://pthome.net/upload.php
// @include      *://*.pthome.net/upload.php
// @include      *://pth.cz9.cn:9599/upload.php
// @include      *://pth.cz9.cn/upload.php
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@2.6.2/base64.js
// @run-at       ddocument-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406625/PTHOME%20%E5%AA%92%E4%BD%93%E4%BF%A1%E6%81%AF%E5%B8%AE%E5%8A%A9%E7%A8%8B%E5%BA%8F%E4%B8%80%E9%94%AE%E5%8F%91%E7%A7%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/406625/PTHOME%20%E5%AA%92%E4%BD%93%E4%BF%A1%E6%81%AF%E5%B8%AE%E5%8A%A9%E7%A8%8B%E5%BA%8F%E4%B8%80%E9%94%AE%E5%8F%91%E7%A7%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var jq3v= jQuery.noConflict();
    console.info(jQuery.fn.jquery);
    var TTMtick = "PTH_" + new Date().getTime();
    var tdhtml = "<tr> "
        + "<td class=\"rowhead nowrap\" valign=\"top\" align=\"right\">额外功能（BETA）</td> "
        + "<td class=\"rowfollow\" valign=\"top\" align=\"left\"> "
        + '<font class="medium">此功能区由《PTHOME 媒体信息帮助程序》自动生成</font></br>'
        //+ "<input type=\"button\" name=\"" + TTMtick + "\" id=\"" + TTMtick + "_copy\" class=\"btn PTH_copy\" value=\"通过剪切板导入\"> "
        //+ "<font class=\"medium\">此功能将从您的剪切板读取内容</font></br>"
        + "<input type=\"button\" name=\"" + TTMtick + "\" id=\"" + TTMtick + "_txt\" class=\"btn PTH_txt\" value=\"通过文本导入\"> "
        + "<font class=\"medium\">&emsp;此功能将会弹出一个文本框 您需要将软件生成的内容复制进去</font></br>"
        + "<input type=\"button\" name=\"" + TTMtick + "\" id=\"" + TTMtick + "_api\" class=\"btn PTH_api\" value=\"一键导入\"> "
        + "<font class=\"medium\">&emsp;&emsp;&emsp;此功能将尝试与本机软件进行通讯 获取信息</font></br>"
        + "</td> "
        + "</tr> ";
    jq3v.getScript('https://cdn.staticfile.org/layer/3.1.1/layer.js', function () {
        jq3v("#compose table tr").eq(0).after(tdhtml);
        layer.msg("脚本加载成功", { icon: 6, skin: 'layui-layer-lan' });
        //直接读取剪切板
        jq3v("#" + TTMtick + "_copy").click(function () {
        })
        //弹出文本框
        jq3v("#" + TTMtick + "_txt").click(function () {
            let TTK = "PTH_" + new Date().getTime() + "_remark";
            let layerindex = layer.open({
                title: '输入软件生成内容',
                type: 1,
                skin: 'layui-layer-rim', //加上边框
                area: ['420px', '260px'], //宽高
                content: '<div><textarea name="txt_remark" id="' + TTK + '" style="width:96%;height:172px;"></textarea></div>',
                btn: ['确认', '取消'],
                yes: function () {
                    var rk = jq3v("#" + TTK).val();
                    console.info("yes");
                    LoadData(rk);
                    layer.close(layerindex);

                },
                no: function () {
                    console.info("no");
                    layer.close(layerindex);
                }
            });
        })
        //与本软件通讯
        jq3v("#" + TTMtick + "_api").click(function () {
             jq3v.ajax({
                type: 'POST',
                url: 'http://localhost:37926/api/getdata',
                dataType: 'JSON',
                beforeSend: function () {
                        layer.load(2);
                    },
                async: true,
                success: function (data) {
                    layer.closeAll('loading');
                    console.info(data);
                    LoadData(data.data);
                },
                error: function (data) {
                    layer.closeAll('loading');
                    layer.msg("与软件通讯故障", { icon: 5, skin: 'layui-layer-lan' });
                }
            });
        })
    });
    function LoadData(datastring) {
        console.info("尝试解析内容");
        console.info(datastring);
        var zzzstring = Base64.decode(datastring);
        var dataOBJ = JSON.parse(zzzstring);;
        console.info(dataOBJ);
        if(dataOBJ==null||dataOBJ==undefined)
        {
           layer.msg("解析失败", { icon: 5, skin: 'layui-layer-lan' });
           return;
        }
        //jq3v("#name").val("测试名称");
        //副标题
        jq3v("input[name='small_descr']").val(dataOBJ.small_descr);
        //IMDb链接
        jq3v("input[name='url']").val(dataOBJ.url);
        //豆瓣ID/链接
        jq3v("input[name='douban_id']").val(dataOBJ.douban_id);
        //简介
        jq3v("textarea[name='descr']").val(dataOBJ.descr);
        //选择类型
        jq3v("#browsecat").val(dataOBJ.browsecat);
        //选择媒介
        jq3v("select[name='medium_sel']").val(dataOBJ.medium_sel);
        //选择编码
        jq3v("select[name='codec_sel']").val(dataOBJ.codec_sel);
        //选择音频编码
        jq3v("select[name='audiocodec_sel']").val(dataOBJ.audiocodec_sel);
        //选择分辨率
        jq3v("select[name='standard_sel']").val(dataOBJ.standard_sel);
        //选择制作组
        jq3v("select[name='team_sel']").val(dataOBJ.team_sel);
        //选择HDR
        jq3v("input[name='hr']").prop("checked", dataOBJ.hr);
        //选择匿名发布
        jq3v("input[name='uplver']").prop("checked", dataOBJ.uplver);
        //选择我确认本资源为官方资源
        jq3v("input[name='officialteam']").prop("checked", dataOBJ.officialteam);
        //选择标签 官方
        jq3v("input[value='gf']").prop("checked", dataOBJ.gf);
        //选择标签 原创
        jq3v("input[value='yc']").prop("checked", dataOBJ.yc);
        //选择标签 国语
        jq3v("input[value='gy']").prop("checked", dataOBJ.gy);
        //选择标签 粤语
        jq3v("input[value='yy']").prop("checked", dataOBJ.yy);
        //选择标签 官字
        jq3v("input[value='gz']").prop("checked", dataOBJ.gz);
        //选择标签 中字
        jq3v("input[value='zz']").prop("checked", dataOBJ.zz);
        //选择标签 DOLBY VISION
        jq3v("input[value='db']").prop("checked", dataOBJ.db);
        //选择标签 HDR10
        jq3v("input[value='hdr10']").prop("checked", dataOBJ.hdr10);
        //选择标签 HDR10+
        jq3v("input[value='hdrm']").prop("checked", dataOBJ.hdrm);
        //选择标签 禁转
        jq3v("input[value='jz']").prop("checked", dataOBJ.jz);
        //选择标签 限转
        jq3v("input[value='xz']").prop("checked", dataOBJ.xz);
        //选择标签 DIY
        jq3v("input[value='diy']").prop("checked", dataOBJ.diy);
        //选择标签 首发
        jq3v("input[value='sf']").prop("checked", dataOBJ.sf);
        //选择标签 应求
        jq3v("input[value='yq']").prop("checked", dataOBJ.yq);
        console.info("done");
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        document.getElementById('browsecat').dispatchEvent(evt);
        layer.msg("解析成功 页面内容已经填入", { icon: 6, skin: 'layui-layer-lan' });
    }
})();