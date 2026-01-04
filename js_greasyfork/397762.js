// ==UserScript==
// @name         MCBBS 自定义背景
// @namespace    http://fang.blog.miri.site/
// @version      2.4.0
// @icon         https://s2.ax1x.com/2020/02/25/3twNzq.png
// @description  自定义mcbbs的背景
// @author       Mr_Fang
// @match        https://*.mcbbs.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397762/MCBBS%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/397762/MCBBS%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    // 定义变量
    var storage = window.localStorage;
    var mbg_url = storage.getItem('mbg_url');
    var mbg_opacity = storage.getItem('mbg_opacity');
    var mbg_border_top = storage.getItem('mbg_border_top');
    var mbg_bg_xoffset = storage.getItem('mbg_bg_xoffset');
    var version = "2.4.0"; // 不要动版本号

    // 无法加载jq自动禁用
    if (typeof jQuery == 'undefined') {
        console.error("%cMCBBS 自定义背景脚本已停止运行：\n无法加载jQuery。", "font-weight:bold");
        return false;
    }
    // 在手机版自动禁用
    if (document.getElementsByTagName('meta').viewport) {
        console.error("%cMCBBS 自定义背景脚本已停止运行：\n不支持手机版论坛运行。", "font-weight:bold");
        return false;
    }

    // 更新提醒
    if(storage.getItem('mbg_version') != version){
        showDialog('<style>.alert_info {background-image: none;padding-right: 0px;padding-left: 0px;}</style><div class=""><b>MCBBS 自定义背景已成功从 V'+ storage.getItem('mbg_version') +' 更新至 V'+ version +'</b><hr><p>此次更新内容：</p> <p ><ol style="margin-left: 25px"><li>同步抢先体验版特性</li></ol></div>',
                   'confirm',
                   '<div style="line-height:30px;"><img src="https://s2.ax1x.com/2020/02/25/3twNzq.png" width="20px"> 自定义背景</div>',
                   function() {
            storage["mbg_version"] = version;
        }
                  );
    }

    console.log(" %c MCBBS 自定义背景 %c V"+ version +" ", "color: #fff; background: #f8981d; padding:5px;", "color:#fff; background: #000; padding:5px;");
    console.log(" %c Made by %c 快乐小方 ", "color: #fff; background: #815098; padding:5px;", "color:#fff; background: #000; padding:5px;");


    // 判断透明度是否为空
    if(mbg_opacity == null){
        mbg_opacity = 100;
    }

    // 判断X偏移量是否为空
    if(mbg_bg_xoffset == null){
        mbg_bg_xoffset = 50;    // 默认是居中显示的（50%）
    }

    // 判断此页中是否存个人信息菜单
    if(jq('.user_info_menu_btn').length>0) {
        // 如存在，在个人信息菜单中添加按钮
        jq('.user_info_menu_btn').append('<li><a id="bg_setting">自定义背景</a></li>');
        // 设置窗口
        document.getElementById('bg_setting').addEventListener('click',function(){
            showDialog('<style>.alert_right {background-image: none;padding-right: 0px;padding-left: 0px;}</style><div class=""><b>点击确定保存 刷新后生效</b><hr><p>自定义背景图 <font color="gray">- 请填写图片链接(多行即启用随机显示)</font></p><textarea id="mbg_url_input" style="width: 98%;" rows="5">' + storage.getItem('mbg_url') + '</textarea><p>背景X偏移量 <font color="gray">- 当前' + mbg_bg_xoffset + '%</font></p><input min="0" max="100" type="range" value="' + mbg_bg_xoffset + '" id="mbg_xoffset_input" style="width: 98%;"><div style="margin-top: -8px;"><font>0%</font><font style="float: right;">100%</font></div><p>透明度 <font color="gray">- 当前' + mbg_opacity + '%</font></p><input min="0" max="100" type="range" value="' + mbg_opacity + '" id="mbg_opacity_input" style="width: 98%;"><div style="margin-top: -8px;"><font>0%</font><font style="float: right;">100%</font></div><p>自定义挂件 <font color="gray">- 请填写图片链接(留空或null即不显示)</font></p><input id="mbg_border_top_input" value="'+ storage.getItem('mbg_border_top') +'" style="width: 98%;" ></div>',
                       'right',
                       '<div style="line-height:30px;"><img src="https://s2.ax1x.com/2020/02/25/3twNzq.png" width="20px"> 自定义背景</div>',
                       function() {
                storage["mbg_url"] = document.getElementById("mbg_url_input").value;
                storage["mbg_opacity"] = document.getElementById("mbg_opacity_input").value;
                storage["mbg_bg_xoffset"] = document.getElementById("mbg_xoffset_input").value;
                storage["mbg_border_top"] = document.getElementById("mbg_border_top_input").value;
            },
                       true,
                       {},
                       '<span onclick="showWindow(\'mbg_box\', \'https://www.mcbbs.net/home.php?mod=space&uid=1970274\')" title="点击查看作者"><span style="background: #f8981d; color: #fff; padding: 5px;">MCBBS 自定义背景 </span><span style="background: #000; color: #fff; padding: 5px;"> V2.4</span></span>'
                      );
        })
    }

    //***** 反馈版发帖警告 开始 *****//
    var filename = window.location.href.split("/").slice(window.location.href.split("/").length - 1,window.location.href.split("/").length).toString(String).split(".")[0];
    function GetQueryValue(queryName) {
        var query = decodeURI(window.location.search.substring(1));
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == queryName) { return pair[1]; }
        }
        return null;
    }
    if(filename == "forum" && GetQueryValue('mod') == "post" && GetQueryValue('action') == "newthread" && GetQueryValue('fid') == "246"){
        showDialog('<style>.alert_right {background-image: none;padding-right: 0px;padding-left: 0px;} .m_c{background: #e74b3c url(https://s1.ax1x.com/2020/05/28/tVeOhQ.jpg) -100px 15px no-repeat; background-size:80%} .m_c .o{ background: #ffffff00;} .alert_right{margin-left: 25%; color: #fff;}</style><font size="4"><b>你正在向反馈与投诉版发布帖子</b></font><p>如果你正在反馈BUG，请先关闭此脚本再次尝试触发BUG。如果你能确定并不是由此脚本引发的BUG，请忽略本提醒。</p>',
                   'right',
                   '<div style="line-height:30px;"><img src="https://s2.ax1x.com/2020/02/25/3twNzq.png" width="20px"> <font color="#fff">来自MCBBS自定义背景脚本的警告</font></div>',
                   {},
                   true,
                   {},
                   '<span onclick="showWindow(\'mbg_box\', \'https://www.mcbbs.net/forum.php?mod=post&action=reply&fid=43&tid=1041361&reppost=18115011&extra=page%3D1&page=1\')" style="color: #fff;" title="点击打开反馈对话框">反馈脚本BUG</span>'
                  );
    }
    //***** 反馈版发帖警告 结束 *****//

    var mbg_urlList = [];
    var bg_css = '';

    // 判断是背景否为空
    if(mbg_url == null || mbg_url == ""){
        // 如果为空直接用mcbbs自己的背景
        mbg_urlList = [''];
    }else{
        // 如果不为空使用自定义背景
        mbg_url = "['" + storage.getItem('mbg_url') + "']";
        var n = mbg_url.split('\n').length - 1;
        for(var l=0;l<n;l++){
            mbg_url = mbg_url.replace('\n',"','");
            //console.log(mbg_url);
        }
        mbg_urlList = eval("(" + mbg_url + ")");
        console.log(mbg_urlList);

        var hsv = mbg_urlList.length; // 获取数组长度
        var ran = Math.floor(Math.random() * hsv); // 取0至数组最大下标值中的随机数（因为floor是向下取整）

        bg_css = 'background-image: url(' + mbg_urlList[ran] + ');';
    }

    // 判断挂件是否为空或“null”
    if(mbg_border_top != null && mbg_border_top != "null"){
        // 这个挂件是论坛自带的，但是被注释掉了
        // 泥潭吉祥物泥猪的路径地址：template/mcbbs/image/muddy_pig_subhero_updated6-19.png
        jq('<img class="mc_top" src="' + mbg_border_top + '" draggable="false"/>').insertBefore(".mc_map_border_top");
    }

    // 在head里添加css
    jq("head").append('<style id="mbg_css">img.mc_top{z-index:99;} #body_fixed_bg {' + bg_css + 'background-position: ' + mbg_bg_xoffset + '%; height: 100%;} div.mc_map_wp,div.mw>div.bm.bw0 { opacity: ' + mbg_opacity/100 + '; transition: opacity 0.5s; -webkit-transition: opacity 0.5s; } div.mc_map_wp:hover,div.mw>div.bm.bw0:hover { opacity: 1; }</style>');

})();