// ==UserScript==
// @name         食品申请网站优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  食品申请优化!
// @author       You
// @match        http://123.232.28.55:9080/sdfdaout/jsp/dspout/sdyj/portal/index.jsp
// @match        http://123.232.28.55:9080/sdfdaout/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469838/%E9%A3%9F%E5%93%81%E7%94%B3%E8%AF%B7%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469838/%E9%A3%9F%E5%93%81%E7%94%B3%E8%AF%B7%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    1、移除弹窗公告 】  河东区房增海炒鸡店
    2、增加按钮【山东政务服务网，新增按钮【o】，保存执照信息，用于申请、变更、延续、注销食品
    4、自动填充默认密码，点击清除，密码可视化
    */
    // Your code here...

    window.onload = function(){
        //***************************自动登录所需
        L5.Ajax.request({
            url : L5.webPath + "/command/dispatcher/org.loushang.bsp.security.web.RandomCodeCommand",
            sync : false,
            callback : successHandler
        });

        function successHandler(options,success,response){
            var o = L5.decode(response.responseText);
            document.getElementById("rdmCode").value = o.code;
        }

        mylogin();
        removeMsg();
        removeMsg1();
        //window.frames["target_frame"].contentDocument.getElementById("detailWindow").remove();
        //window.frames["target_frame"].contentDocument.getElementById("detailWindow2").remove();

        //*******************************移除弹窗公告 begin***************************

        function removeMsg1(){

            
            var msg = window.frames["target_frame"].contentDocument.getElementById("detailWindow");
            var msg1 = window.frames["target_frame"].contentDocument.getElementById("detailWindow2");
            var msg2 = window.frames["target_frame"].contentDocument.getElementById("L5-gen19");
            console.log("msg="+msg+"      msg1="+msg1+"      msg2="+msg2);
            if(msg == undefined||msg == null ||msg1 == undefined ||msg1 == null ||msg2 == undefined ||msg2 == null){
                setTimeout(function(){
                    removeMsg1();
                },100);
            }else{
                msg.remove();
                //window.frames["target_frame"].contentDocument.getElementById("detailWindow2").remove();
                msg1.remove();

                msg2.remove();
                console.log("移除detailWindow弹窗");
            }

            
        }
        function removeMsg(){
            $('#showMsgDiv')[0].remove();
            //         window.frames["target_frame"].contentDocument.getElementsByTagName("script")[12].remove();//删除script
            //         window.frames["target_frame"].contentDocument.getElementsByTagName("script")[11].remove();
            var f5 = document.querySelector('a.currHover');
            //重新绑定点击事件,点击【许可申报】刷新页面
            f5.onclick = function(){
                location.reload();
            };
        }

        //*******************************移除弹窗公告  end***************************

        //*******************************新增按钮【o】 begin***************************
        //document.getElementsByTagName('div')[4];
        var input_button = document.createElement('input');
        input_button.id = 'wowowo';
        input_button.type = 'button';
        input_button.className = 'title-input-button';
        input_button.style = "margin-top:-48.2%;width: 60px; height: 32px;background-color: rgb(68, 132, 214);";
        input_button.value = "o";
        //document.getElementsByTagName('td')[1].appendChild(input_button);
        document.querySelector('body').appendChild(input_button);


        input_button.onclick = function(){
            //var tpl_preferencesHTML = "<form id=\"preferences\" name=\"preferences\">\n    <div id=\"setting_table1\">\n        <span id=\"top-buttons\">\n            <input title=\"部分选项需要刷新页面才能生效\" id=\"save_button\" value=\"√ 确认\" type=\"button\">\n            <input title=\"取消本次设定，所有选项还原\" id=\"close_button\" value=\"X 取消\" type=\"button\">\n        </span>\n        <div class=\"form-row\">\n            <label>\n                界面语言<select id=\"lang\">\n                </select>\n            </label>\n            <label title=\"将小说网页文本转换为繁体。\\n\\n注意：内置的繁简转换表，只收录了简单的单字转换，启用本功能后，如有错误转换的情形，请利用脚本的自订字词取代规则来修正。\\n例如：「千里之外」，会错误转换成「千里之外」，你可以加入规则「千里之外=千里之外」来自行修正。\">\n                <input type=\"checkbox\" id=\"enable-cn2tw\" name=\"enable-cn2tw\"/>网页：转繁体\n            </label>\n            <label id=\"quietMode\" class=\"right\" title=\"隐藏其他，只保留正文，适用于全屏状态下\">\n                <input class=\"key\" type=\"button\" id=\"quietModeKey\"/>安静模式\n            </label>\n        </div>\n        <div class=\"form-row\">\n            <label title=\"不影响 booklink.me 的启用\">\n                <input type=\"checkbox\" id=\"disable-auto-launch\" name=\"disable-auto-launch\"/>强制手动启用\n            </label>\n            <label title=\"booklink.me 点击的网站强制启用\">\n                <input type=\"checkbox\" id=\"booklink-enable\" name=\"booklink-enable\"/>booklink 自动启用\n            </label>\n            <label>\n                <input type=\"checkbox\" id=\"debug\" name=\"debug\"/>调试模式\n            </label>\n            <a href=\"https://greasyfork.org/scripts/292-my-novel-reader/feedback\" target=\"_blank\">反馈地址</a>\n        </div>\n        <div class=\"form-row\">\n            <label title=\"图片章节用夜间模式没法看，这个选项在启动时会自动切换到缺省皮肤\">\n                <input type=\"checkbox\" id=\"pic-nightmode-check\" name=\"pic-nightmode-check\"/>\n                夜间模式的图片章节检测\n            </label>\n            <label>\n                <input type=\"checkbox\" id=\"copyCurTitle\"/>\n                打开目录复制当前标题\n            </label>\n        </div>\n        <div class=\"form-row\">\n            <label title=\"通过快捷键切换\">\n                <input type=\"checkbox\" id=\"hide-menu-list\"/>隐藏左侧章节列表\n            </label>\n            <label>\n                <input type=\"checkbox\" id=\"hide-footer-nav\"/>隐藏底部导航栏\n            </label>\n            <label class=\"right\" title=\"导出之后的所有章节\">\n                <input type=\"button\" id=\"saveAsTxt\" value=\"存为 txt（测试）\" />\n                <input type=\"button\" id=\"speech\" value=\"朗读\" />\n            </label>\n        </div>\n        <div class=\"form-row\">\n            <label>\n                左侧导航栏切换快捷键：\n            </label>\n            <input class=\"key\" type=\"button\" id=\"setHideMenuListKey\" />\n            <label title=\"通过快捷键切换或在 Greasemonkey 用户脚本命令处打开设置窗口\">\n                <input type=\"checkbox\" id=\"hide-preferences-button\"/>隐藏设置按钮\n            </label>\n            <input class=\"key\" type=\"button\" id=\"openPreferencesKey\"/>\n        </div>\n        <div class=\"form-row\">\n            <label>\n                打开朗读快捷键：\n            </label>\n            <input class=\"key\" type=\"button\" id=\"setOpenSpeechKey\" />\n        </div>\n        <div class=\"form-row\">\n            <label>\n                距离底部\n                <input type=\"textbox\" id=\"remain-height\" name=\"remain-height\" size=\"5\"/>\n                px 加载下一页\n            </label>\n            <label>\n                <input type=\"checkbox\" id=\"add-nextpage-to-history\"/>添加下一页到历史记录\n            </label>\n            <label>\n                <input type=\"checkbox\" id=\"enable-dblclick-pause\"/>双击暂停翻页\n            </label>\n        </div>\n        <div class=\"form-row\">\n            <label>\n                <select id=\"skin\">\n                </select>\n            </label>\n            <label>\n                字体\n                <input type=\"textbox\" id=\"font-family\" style=\"min-width:200px;\"/>\n            </label>\n            <br/><br/>\n            <label>\n                字体大小\n                <input type=\"textbox\" id=\"font-size\" name=\"font-size\" size=\"6\"/>\n            </label>\n            <label>\n                行高\n                <input type=\"textbox\" id=\"text_line_height\" size=\"6\"/>\n            </label>\n            <label>\n                行宽\n                <input type=\"textbox\" id=\"content_width\" size=\"6\"/>\n            </label>\n        </div>\n        <div class=\"form-row\">\n            <label title=\"把一大块未分段的内容文本按照句号分段\">\n                <input type=\"checkbox\" id=\"split_content\"/>对一坨内容进行强制分段\n            </label>\n            <label>\n                <input type=\"checkbox\" id=\"scroll_animate\"/>章节直达滚动效果\n            </label>\n        </div>\n        <div class=\"form-row\">\n            <div class=\"prefs_title\">自定义样式</div>\n            <textarea id=\"extra_css\" class=\"prefs_textarea\" placeholder=\"自定义样式\"></textarea>\n        </div>\n    </div>\n    <div id=\"setting_table2\">\n        <div class=\"form-row\" title=\"详见脚本代码的 Rule.specialSite\">\n            <div class=\"prefs_title\">自定义站点规则</div>\n            <textarea id=\"custom_siteinfo\" class=\"prefs_textarea\" placeholder=\"自定义站点规则\" />\n        </div>\n        <div class=\"form-row\" title=\"一行一个，每行的第一个 = 为分隔符。\\n保存后生效\">\n            <div class=\"prefs_title\">自定义替换规则</div>\n            <textarea id=\"custom_replace_rules\" class=\"prefs_textarea\" placeholder=\"b[āà]ng=棒\" />\n        </div>\n    </div>\n</form>";
            let myhtml = ``;
        };
        var span_button = document.createElement('span');
        //span_button.type = 'button';
        span_button.id = 'span_button';
        span_button.style = "margin-top: -48.2%; margin-left: 85px; background-color: rgb(68, 132, 214); display: block; width: 160px; height: 32px; border-radius: 4px; text-align: center; float: left;";
        document.querySelector('body').appendChild(span_button);
        var a_button = document.createElement('a');
        a_button.style = 'color: white;line-height: 2.2;width: 100%;height: 100%;display: block;font-size:15px;';
        a_button.href = 'http://www.shandong.gov.cn/userspace/#/user-center/enterprise-center?ticket=e9ca2847cb2d438f6307ab96401b6cbb';
        a_button.target="_blank";
        a_button.textContent = '前往新增企业';
        $('#span_button').append(a_button);





        //*******************************新增按钮【o】 end***************************

        //自动填充默认密码，点击清除，密码可视化
        function mylogin(){
            if(!_userName){//检测是否登录
                $('#psd').val('8820341Aa?');
                $('#psd')[0].type = "text";
                $('#psd').click(function(){
                    if($('#psd').val()==''){
                        $('#psd').val('8820341Aa?');
                    }else{
                        $('#psd').val('');
                    }
                });
            }

        }


    }

})();