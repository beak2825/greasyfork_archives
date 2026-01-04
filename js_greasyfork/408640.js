// ==UserScript==
// @name         MCBBS 积分显示还原
// @version      0.0.4
// @description  8月更新不习惯？那就还原至8月更新以前吧！
// @author       萌萌哒丶九灬书
// @namespace    https://space.bilibili.com/1501743
// @license      GNU General Public License v3.0
// @create       2020-08-12
// @lastmodified 2020-08-26
// @note         0.0.4 更新: 1.修复了点击目录时插件不工作的问题。
// @note         0.0.3 更新: 1.更改了独立关闭功能的方式; 2.新增了MCBBS_Extender模块的配置支持。
// @match        *://www.mcbbs.net/thread-*
// @match        *://www.mcbbs.net/forum.php?mod=viewthread*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/408640/MCBBS%20%E7%A7%AF%E5%88%86%E6%98%BE%E7%A4%BA%E8%BF%98%E5%8E%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/408640/MCBBS%20%E7%A7%AF%E5%88%86%E6%98%BE%E7%A4%BA%E8%BF%98%E5%8E%9F.meta.js
// ==/UserScript==

(async ()=>{
//MCBBS_Extender配置文件模块;
    await unsafeWindow.MExt;
    let MExt = unsafeWindow.MExt;
    const retreated_old_point_style_Module = {
        "style": "",
        "core": () => {
            "none";
        },
        "config": [{
            "name": "积分显示还原",
            "default": true,
            "type": "check",
            "id": "retreated_old_point_style_Module",
            "desc": "还原旧积分显示样式"
        }]
    };
    try {
        MExt.exportModule(retreated_old_point_style_Module);
    } catch (err) {
        "none";
    };
})();

(function() {
    'use strict';
    var MCBBS_Extender = false;
    var retreated_old_point_style_Module_config = false;

    var jq = jQuery.noConflict();
    //jq名称重定义，避免冲突

    function CheckThreadIsFlashed(){
    //判定页面是否刷新
        jq('.t_f').eq(0).html(function(i,origText){
            return origText + '<div class="CheckThreadIsFlashed"></div>';
        });
    }
    function retreated_old_point_style(){
    //积分还原
        var i = 0;
        jq(".pil.cl").each(function(){
            var str1 = jq(".pil.cl").eq(i).text();
            var str2 = jq(".i.y").children(".cl").eq(i).text();
            var jf = str2.match(/积分-?\d+/);
            var rq = str2.match(/人气-?\d+/);
            var gx = str2.match(/贡献-?\d+/);
            var ax = str2.match(/爱心-?\d+/);
            var jl = str1.match(/金粒-?\d+/);
            var bs = str1.match(/宝石-?\d+/);
            var zs = str2.match(/钻石-?\d+/);

            var jf_int = jf[0].match(/-?\d+/);
            var rq_int = rq[0].match(/-?\d+/);
            var gx_int = gx[0].match(/-?\d+/);
            var ax_int = ax[0].match(/-?\d+/);
            var jl_int = jl[0].match(/-?\d+/);
            var bs_int = bs[0].match(/-?\d+/);
            var zs_int = zs[0].match(/-?\d+/);

            var str3 = "<dt>积分</dt><dd>" + jf_int.toString() + "</dd>" +
                "<dt>人气</dt><dd>" + rq_int.toString() + " 点</dd>" +
                "<dt>贡献</dt><dd>" + gx_int.toString() + " 份</dd>" +
                "<dt>爱心</dt><dd>" + ax_int.toString() + " 心</dd>" +
                "<dt>金粒</dt><dd>" + jl_int.toString() + " 粒</dd>" +
                "<dt>绿宝石</dt><dd>" + bs_int.toString() + " 颗</dd>" +
                "<dt>钻石</dt><dd>" + zs_int.toString() + " 颗</dd>"
            jq(".pil.cl").eq(i).html(str3);
            i++;
        });
    };
    function unlimited_medal_rows(){
    //勋章长度还原
        jq(".md_ctrl").css("max-height","5000px");
    };
    function main(){
        try {
            MCBBS_Extender = (MExt.versionName != null);
            retreated_old_point_style_Module_config = MExt.ValueStorage.get("retreated_old_point_style_Module");
        } catch (err) {
            "none";
        }

        if(retreated_old_point_style_Module_config){
        //开启MCBBS_Extender时，只加载还原旧积分;
            retreated_old_point_style();
        }

        if(!MCBBS_Extender){
        //未开启MCBBS_Extender时，两个都加载;
        //单独关闭只需要在对应函数前面加上"//"(不含引号);
            retreated_old_point_style();
            //积分样式还原
            unlimited_medal_rows();
            //勋章长度还原
        }
    }
    jq(document).ready(function(){
        CheckThreadIsFlashed();
        //用于检测页面是否被刷新
        main();
        //主函数
        jq(".pl.bm").children("div").on('DOMNodeInserted',function(){
            //当内容被改变时，重新加载body部分函数
            if(jq(".CheckThreadIsFlashed").val() == undefined){
                CheckThreadIsFlashed();
                //用于检测页面是否被刷新
                main();
                //主函数
            }
        })
    });
})();