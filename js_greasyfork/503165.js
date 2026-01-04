// ==UserScript==
// @name         吾爱破解美化 - 暗黑模式 精简元素 优化体验
// @namespace    http://tampermonkey.net/
// @version      2024-08-25
// @description  更改颜色、隐藏冗杂的元素、加入暗黑模式、享受更好的浏览体验。
// @author       Beiqh
// @match        https://www.52pojie.cn/*
// @icon         https://avatar.52pojie.cn/images/noavatar_small.gif
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/503165/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E7%BE%8E%E5%8C%96%20-%20%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%20%E7%B2%BE%E7%AE%80%E5%85%83%E7%B4%A0%20%E4%BC%98%E5%8C%96%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/503165/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E7%BE%8E%E5%8C%96%20-%20%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F%20%E7%B2%BE%E7%AE%80%E5%85%83%E7%B4%A0%20%E4%BC%98%E5%8C%96%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    var default_colors = [
        'black',//默认前景色
        '#f8f9fa',//全页面背景色
        'white',//一般元素背景色
        '#cfe2ff',//分区表头背景色
        '#0d6efd',// 顶部菜单颜色
        '#cfe2ff',//发帖用户栏背景色
        '#6ea8fe',//辅助类颜色1
        '#6ea8fe',//辅助类颜色2
        '#dc3545',//红色
        '#198754',//绿色
        '#0d6efd',//蓝色
    ]
    var dark_colors = [
        '#C9C9CF',
        '#2c2e2f',
        '#343a40',
        '#2c2e2f',//分区表头背景色
        '#212529',// 顶部菜单颜色
        '#031633',//发帖用户栏背景色
        '#084298',//辅助类颜色1
        '#dee2e6',//辅助类颜色2
        '#dc3545',//红色
        '#198754',//绿色
        '#0d6efd',//蓝色
    ];
    var classic_colors = [
        '#333333',//默认前景色
        '#f8f9fa',//全页面背景色
        'white',//一般元素背景色
        '#E8EFF5',//分区表头背景色
        '#2B7ACD',// 顶部菜单颜色
        '#E5EDF2',//发帖用户栏背景色
        '#C2D5E3',//辅助类颜色1
        '#E5EDF2',//辅助类颜色2
        '#FF0000',//红色
        '#009900',//绿色
        '#0000FF',//蓝色
    ]
    let now_colors = [];
    if(GM_getValue("colors") == 0){
        now_colors = default_colors;
    }
    if(GM_getValue("colors") == 1){
        now_colors = dark_colors;
    }
    if(GM_getValue("colors") == 2){
        now_colors = classic_colors;
    }

    console.log(GM_getValue("colors"));
    console.log(now_colors);
    if(GM_getValue("colors") == 0){
        let id1 = GM_registerMenuCommand(
            "默认✅",
            function () {
                GM_setValue("colors", 0);
                location.reload()
            },
        )}else{
            let id1 = GM_registerMenuCommand(
                "默认",
                function () {
                    GM_setValue("colors", 0);
                    location.reload()
                },
            )
            };
    if(GM_getValue("colors") == 1){
        let id2 = GM_registerMenuCommand(
            "暗黑✅",
            function () {
                GM_setValue("colors", 1);
                location.reload()
            },
        )}else{
            let id2 = GM_registerMenuCommand(
                "暗黑",
                function () {
                    GM_setValue("colors", 1);
                    location.reload()
                },
            )
            };
    if(GM_getValue("colors") == 2){
        let id3 = GM_registerMenuCommand(
            "经典✅",
            function () {
                GM_setValue("colors", 2);
                location.reload()
            },
        )}else{
            let id3 = GM_registerMenuCommand(
                "经典",
                function () {
                    GM_setValue("colors", 2);
                    location.reload()
                },
            )
            };
    if(GM_getValue("icon") == 0){
        let id4 = GM_registerMenuCommand(
            "✅更换小图标",
            function () {
                if(GM_getValue("icon") == 0){
                    GM_setValue("icon", 1);
                    location.reload()
                }else{
                    GM_setValue("icon", 0);
                    location.reload()
                }
            },
        )}else{
            let id4 = GM_registerMenuCommand(
                "❌更换小图标",
                function () {
                    if(GM_getValue("icon") == 0){
                        GM_setValue("icon", 1);
                        location.reload()
                    }else{
                        GM_setValue("icon", 0);
                        location.reload()
                    }
                },
            )
            };
    // 全局样式
    // 强制性规则
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = 'body { background:'+ now_colors[1]+' !important; }';

    // 将新样式添加到文档的<head>部分
    document.head.appendChild(style);

    //隐藏原背景图
    var body = document.querySelectorAll("body")
    for (let i =0; i < body.length; i++){
        body[i].style.background = ""
        body[i].style.backgroundImage = "none";
    }
    //更改a标签
    var aElements = document.getElementsByTagName("a");
    for (var i = 0; i < aElements.length; i++) {
        aElements[i].style.color = now_colors[0];
    }
    var aElements_xi1 = document.querySelectorAll("a.xi1");
    for (let i = 0; i < aElements_xi1.length; i++) {
        aElements_xi1[i].style.color = "#F26C4F";
    }

    var tbodyElements = document.getElementsByTagName("tbody");
    for (i = 0; i < tbodyElements.length; i++) {
        tbodyElements[i].style.backgroundColor = now_colors[2];
        tbodyElements[i].style.color = now_colors[0];
    }
    var bm = document.getElementsByClassName("bm");
    for (i =0; i < bm.length; i++){
        bm[i].style.backgroundColor = now_colors[2];
    }

    document.getElementById("toptb").style.display = "none";//隐藏B站官方账号提示

    //更改font标签颜色
    var font = document.querySelectorAll('font');
    for (i =0; i < font.length; i++){
        font[i].style.color = now_colors[0];
    }

    //替换红色
    var font_red_1 = document.querySelectorAll('font[color="#FF0000"]');
    var font_red_2 = document.querySelectorAll('font[color="red"]');//替换红色
    for (i =0; i < font_red_1.length; i++){
        font_red_1[i].style.color = now_colors[8];
    }
    for (i =0; i < font_red_2.length; i++){
        font_red_2[i].style.color = now_colors[8];
    }

    //替换绿色
    var font_green = document.querySelectorAll('font[color="#009900"]');
    for (i =0; i < font_green.length; i++){
        font_green[i].style.color = now_colors[9];
    }

    //替换蓝色
    var font_blue_1 = document.querySelectorAll('font[color="#0000FF"]');
    var font_blue_2 = document.querySelectorAll('font[color="blue"]');
    for (i =0; i < font_blue_1.length; i++){
        font_blue_1[i].style.color = now_colors[10];
    }
    for (i =0; i < font_blue_2.length; i++){
        font_blue_2[i].style.color = now_colors[10];
    }

    //更改h2颜色
    var h2 = document.querySelectorAll('h2');
    for (i =0; i < h2.length; i++){
        h2[i].style.color = now_colors[0];
    }

    //门户样式
    var dxb_bc = document.querySelectorAll('.dxb_bc,.module.cl.xl.xl1');
    for (i =0; i < dxb_bc.length; i++){
        dxb_bc[i].style.backgroundColor = now_colors[2];
    }
    var area = document.querySelectorAll('.area,.frame.move-span.cl.frame-1-1-1');
    for (i =0; i < area.length; i++){
        area[i].style.backgroundColor = now_colors[1];
    }
    var frame = document.querySelectorAll('.frame, .frame-tab');
    for (i =0; i < frame.length; i++){
        frame[i].style.backgroundColor = now_colors[1];
        frame[i].style.border = "none";
    }

    //网站样式
    if(document.getElementsByClassName("bm_h cl")[0]){
        document.getElementsByClassName("bm_h cl")[0].style.display = "none";//隐藏抖音官方账号提示
    }
    if(document.getElementById("chart")){//隐藏统计数据
        document.getElementById("chart").style.display = "none";
    }
    if(document.getElementById("nv")){
        var nv = document.getElementById("nv");
        nv.style.background = now_colors[4];//设置顶部菜单颜色
        nv.style.borderLeft= "none";
        nv.style.borderRight= "none";
        var nv_a = document.getElementById("nv").getElementsByTagName("a");//设置a标签元素
        for (i = 0; i < nv_a.length; i++) {
            nv_a[i].style.color = "white";
        }
    }
    if(document.getElementsByClassName("nav_ico02")[0]){
        var nav_ico02 = document.getElementsByClassName("nav_ico02")[0];//更改图标02
        nav_ico02.style.backgroundImage = "url(https://icons.getbootstrap.com/assets/icons/archive.svg)";
        nav_ico02.style.backgroundSize = '40px 40px';
        nav_ico02.style.backgroundPosition = "4px"
        var nav_ico03 = document.getElementsByClassName("nav_ico03")[0];//更改图标03
        nav_ico03.style.backgroundImage = "url(https://icons.getbootstrap.com/assets/icons/box.svg)";
        nav_ico03.style.backgroundSize = '40px 40px';
        nav_ico03.style.backgroundPosition = "4px"
        var nav_ico01 = document.getElementsByClassName("nav_ico01")[0];//更改图标01
        nav_ico01.style.backgroundImage = "url(https://icons.getbootstrap.com/assets/icons/house.svg)";
        nav_ico01.style.backgroundSize = '40px 40px';
        nav_ico01.style.backgroundPosition = "4px"
        var nav_ico04 = document.getElementsByClassName("nav_ico04")[0];//更改图标04
        nav_ico04.style.backgroundImage = "url(https://icons.getbootstrap.com/assets/icons/search.svg)";
        nav_ico04.style.backgroundSize = '40px 40px';
        nav_ico04.style.backgroundPosition = "4px";
    }
    //更改顶部菜单
    if(document.getElementsByClassName("comiis_nav")[0]){
        var comiis_nav_font = document.getElementsByClassName("comiis_nav")[0].getElementsByTagName("font");
        for (i = 0; i < comiis_nav_font.length; i++) {
            comiis_nav_font[i].style.color = now_colors[0];
        }
        document.getElementsByClassName("comiis_nav")[0].style.background = "none"
        document.getElementsByClassName("comiis_nav")[0].style.border= "none";
    }
    //更改搜索栏
    if(document.getElementById("scbar")){
        var scbar_tbody = document.getElementById("scbar").getElementsByTagName("tbody");
        for (i = 0; i < scbar_tbody.length; i++) {
            scbar_tbody[i].style.backgroundColor = now_colors[3];
        }
        document.getElementById("scbar").style.background = "none";
        document.getElementById("scbar").style.border= "none";
        document.getElementById("scbar").style.backgroundColor = now_colors[3];
        document.getElementsByClassName("scbar_icon_td")[0].style.background = "none";
    }
    //搜索页样式
    var scform = document.querySelectorAll("table#scform_form > tbody")
    for (i =0; i < scform.length; i++){
        scform[i].style.background = "none";
    }

    //更改排行榜表头
    if(document.getElementsByClassName("toptitle_7ree")[0]){
        var toptitle_7ree_span = document.getElementsByClassName("toptitle_7ree")[0].getElementsByTagName("span");
        for (i = 0; i < toptitle_7ree_span.length; i++) {
            toptitle_7ree_span[i].style.color = now_colors[0];
        }
        var toptitle_7ree_td = document.getElementsByClassName("toptitle_7ree")[0].getElementsByTagName("td");//更改排行榜表头
        for (i = 0; i < toptitle_7ree_td.length; i++) {
            toptitle_7ree_td[i].style.backgroundColor = now_colors[2];//设置表头背景色
            toptitle_7ree_td[i].style.borderTop = "1px solid #CDCDCD";//补回缺失的表头顶部框线
        }
        var threadline_7ree = document.getElementsByClassName("threadline_7ree");
        for (i = 0; i < threadline_7ree.length; i++) {
            var threadline_7ree_a = document.getElementsByClassName("threadline_7ree")[i].getElementsByTagName("a");
            for (var j = 0; j < threadline_7ree_a.length; j++) {
                threadline_7ree_a[j].style.color = now_colors[0];//更改排行榜表格内标注颜色
            }
            threadline_7ree[i].style.marginBottom = "8px";//优化行距
            threadline_7ree[i].style.borderBottom="none";//去除横线
        }
        //设置排行榜图标
        var boxbg_7ree = document.getElementsByClassName("boxbg_7ree");
        for (i = 0; i < boxbg_7ree.length; i++) {
            boxbg_7ree[i].style.backgroundImage = "none";//隐藏原图标
            boxbg_7ree[i].style.paddingLeft = "0px";//删除间隔
            var divs = boxbg_7ree[i].getElementsByTagName('div');
            // 获取div元素
            var divArray = Array.prototype.slice.call(divs);

            // 定义颜色数组
            var colors = [
                '#f1404b', // 第1个div的颜色
                '#c56831', // 第2个div的颜色
                '#b89e2c', // 第3个div的颜色
                'rgba(124, 124, 124, .3)' // 其他div的颜色
            ];

            // 遍历div数组
            divArray.forEach(function(div, index) {
                // 创建包含序号的span元素
                var numberSpan = document.createElement('span');
                numberSpan.textContent = index + 1;
                numberSpan.style.color = "white";
                numberSpan.style.borderRadius = "4px";
                numberSpan.style.width = "18px";
                numberSpan.style.display = "inline-block";
                numberSpan.style.textAlign="center"

                // 根据序号设置span的颜色
                if (index < colors.length) {
                    numberSpan.style.backgroundColor = colors[index];

                } else {
                    numberSpan.style.backgroundColor = colors[3]; // 索引超出颜色数组时使用最后一个颜色
                }

                // 将span插入到div的开头
                div.insertBefore(numberSpan, div.firstChild);

                // 如果div已经有内容，需要在序号后添加空格以分隔
                if (div.firstChild !== numberSpan) {
                    var spaceNode = document.createTextNode(' ');
                    div.insertBefore(spaceNode, numberSpan.nextSibling);
                }
            });
        }
    }
    if(document.getElementById("pt")){
        document.getElementById("pt").backgroundColor = now_colors[2];//设置面包屑菜单背景色
    }
    //设置页码栏
    if(document.getElementsByClassName("pgs cl")){
        var pgs_cl = document.getElementsByClassName("pgs cl");
        for (i = 0; i < pgs_cl.length; i++) {
            pgs_cl[i].style.backgroundColor = now_colors[1];
            var pgs_cl_a = pgs_cl[i].getElementsByTagName("a")
            for (j = 0; j < pgs_cl_a.length; j++) {
                pgs_cl_a[j].style.backgroundColor = now_colors[5];
            }
            if(pgs_cl[i].getElementsByTagName("label")[0]){
                var pgs_cl_label = pgs_cl[i].getElementsByTagName("label");
                pgs_cl_label[0].style.backgroundColor = now_colors[5];
                pgs_cl_label[0].getElementsByTagName("span")[0].style.color = now_colors[0];
            }
        }
    }
    //设置类型栏
    if(document.getElementById("thread_types")){
        var thread_types_li = document.getElementById("thread_types").getElementsByTagName("li")
        for (i =0; i < thread_types_li.length; i++){
            thread_types_li[i].getElementsByTagName("a")[0].style.backgroundColor = now_colors[5];
        }
    }
    //分区样式
    if(document.getElementsByClassName("th")[0]){
        document.getElementsByClassName("th")[0].style.backgroundColor = now_colors[2];}
    var fl_bm_h = document.getElementsByClassName("bm_h cl");
    for (i =0; i < fl_bm_h.length; i++){
        fl_bm_h[i].style.backgroundImage = "none";//隐藏原背景图
        fl_bm_h[i].style.backgroundColor = now_colors[3];
    }
    var bm_bmw_cl = document.getElementsByClassName("bm bmw cl");
    for (i = 0; i < bm_bmw_cl.length; i++) {
        var bm_bmw_cl_a = document.getElementsByClassName("bm bmw cl")[i].getElementsByTagName("a");//更改顶部菜单内字体颜色
        for (j = 0; j < bm_bmw_cl_a.length; j++) {
            bm_bmw_cl_a[j].style.color = now_colors[0];
        }
        var bm_bmw_cl_font = document.getElementsByClassName("bm bmw cl")[i].getElementsByTagName("font");//更改顶部菜单内字体颜色
        for (var k = 0; k < bm_bmw_cl_font.length; k++) {
            bm_bmw_cl_font[k].style.display = "none";
        }
        var bm_bmw_cl_p = document.getElementsByClassName("bm bmw cl")[i].getElementsByTagName("p");//删除常驻的说明文本
        for (var m = 0; m < bm_bmw_cl_p.length; m++) {
            if (bm_bmw_cl_p[m].textContent.includes('◇')) {
                bm_bmw_cl_p[m].parentNode.removeChild(bm_bmw_cl_p[m]);
            }
        }
    }
    //定义函数：替换图标
    async function replaceImageWithSVG(originalSrc, svgUrl, width, height, color1, color2, color3) {
        try {
            // 选择所有具有指定src的img元素
            var imgElements = document.querySelectorAll('img[src="' + originalSrc + '"]');

            // 遍历所有找到的img元素
            imgElements.forEach(async function(imgElement) {
                // 获取SVG内容
                let svgContent
                if(svgUrl==="postIcon"){
                    svgContent = '<svg width="80" height="33" xmlns="http://www.w3.org/2000/svg"><g><title>发新帖</title><rect y="0" stroke="#000" rx="3" id="svg_4" height="33" width="80" opacity="NaN" fill="#fff"/><text transform="matrix(0.608383 0 0 0.60781 1.69923 6.58405)" stroke="#000" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" stroke-width="0" id="svg_5" y="26.34585" x="20.7751" fill="#000000">发帖</text><line id="svg_21" y2="40.02733" x2="84.88746" y1="39.96302" x1="84.82315" stroke="#000" fill="none"/><g id="svg_22"><line stroke="#000" id="svg_13" y2="13.21472" x2="68.9822" y1="13.21472" x1="56.26773" fill="none"/><line id="svg_19" y2="19.42826" x2="62.69555" y1="13.34865" x1="56.61594" stroke="#000" fill="none"/><line id="svg_20" y2="19.78528" x2="62.35787" y1="13.47365" x1="68.6695" stroke="#000" fill="none"/></g></g></svg>'
                }
                else{
                    if(svgUrl==="replyIcon"){
                        svgContent = '<svg width="80" height="33" xmlns="http://www.w3.org/2000/svg"><g><title>回复</title><rect x="0" y="0" stroke="#000" rx="3" id="svg_4" height="33" width="80" opacity="NaN" fill="#fff"/><text transform="matrix(0.608383 0 0 0.60781 1.69923 6.58405)" stroke="#000" xml:space="preserve" text-anchor="start" font-family="Noto Sans JP" font-size="24" stroke-width="0" id="svg_5" y="26.34585" x="37" fill="#000000" style="letter-spacing:3px">回复</text><line id="svg_21" y2="40.02733" x2="84.88746" y1="39.96302" x1="84.82315" stroke="#000" fill="none"/></g></svg>'
                    }
                    else{
                        const response = await fetch(svgUrl);
                        svgContent = await response.text();}
                }
                // 解析SVG内容
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
                const svgElement = svgDoc.documentElement;
                svgElement.setAttribute('width', width)
                if(height){
                    svgElement.setAttribute('height', height);
                }else{
                    svgElement.setAttribute('height', width);
                }
                // 遍历SVG中的所有path元素并设置颜色
                svgElement.querySelectorAll('path').forEach(function(path) {
                    path.setAttribute('fill', now_colors[0]);
                });
                svgElement.querySelectorAll('rect').forEach(function(rect) {
                    rect.setAttribute('fill', color2);
                    rect.setAttribute('stroke', color3);
                });
                svgElement.querySelectorAll('text').forEach(function(text) {
                    text.setAttribute('fill', color1);
                });
                svgElement.querySelectorAll('line').forEach(function(line) {
                    line.setAttribute('stroke', color1);
                });
                // 创建一个新的SVG元素
                const newSvgElement = document.importNode(svgElement, true);
                // 替换原始的img元素
                imgElement.parentNode.replaceChild(newSvgElement, imgElement);
            });
        } catch (error) {
            console.error('Error replacing image with SVG:', error);
        }
    }

    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/pin_1.gif', 'https://icons.getbootstrap.com/assets/icons/arrow-up-circle.svg',17);//置顶图标
    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/ann_icon.gif', 'https://icons.getbootstrap.com/assets/icons/megaphone.svg',17);//喇叭图标
    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/folder_common.gif', 'https://icons.getbootstrap.com/assets/icons/file-earmark.svg',17);//普通页面图标
    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/folder_new.gif', 'https://icons.getbootstrap.com/assets/icons/file-earmark-fill.svg',17);//新页面图标
    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/folder_lock.gif', 'https://icons.getbootstrap.com/assets/icons/file-earmark-lock.svg',17);//关闭的主题图标
    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/rewardsmall.gif', 'https://icons.getbootstrap.com/assets/icons/coin.svg',17);//悬赏图标
    if(GM_getValue("icon") == 0){
        replaceImageWithSVG('https://static.52pojie.cn/static/image/filetype/image_s.gif', 'https://icons.getbootstrap.com/assets/icons/file-earmark-image-fill.svg',16);//图片附件图标
        replaceImageWithSVG('https://static.52pojie.cn/static/image/filetype/common.gif', 'https://icons.getbootstrap.com/assets/icons/file-earmark-arrow-up-fill.svg',16);//附件图标
        replaceImageWithSVG('https://static.52pojie.cn/static/image/common/recommend_2.gif', 'https://icons.getbootstrap.com/assets/icons/hand-index-thumb.svg',16);//推荐图标
        replaceImageWithSVG('https://static.52pojie.cn/static/image/common/recommend_1.gif', 'https://icons.getbootstrap.com/assets/icons/hand-index-thumb.svg',16);//推荐图标
        replaceImageWithSVG('https://static.52pojie.cn/static/image/common/hot_3.gif', 'https://icons.getbootstrap.com/assets/icons/fire.svg',16);//热门图标
        replaceImageWithSVG('https://static.52pojie.cn/static/image/common/hot_2.gif', 'https://icons.getbootstrap.com/assets/icons/fire.svg',16);//热门图标
        replaceImageWithSVG('https://static.52pojie.cn/static/image/common/hot_1.gif', 'https://icons.getbootstrap.com/assets/icons/fire.svg',16);//热门图标
        replaceImageWithSVG('https://static.52pojie.cn/static/image/common/agree.gif', 'https://icons.getbootstrap.com/assets/icons/hand-thumbs-up-fill.svg',16);//帖子被加分图标
    }
    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/forum.gif', 'https://icons.getbootstrap.com/assets/icons/chat.svg',31);//非活跃区图标
    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/forum_new.gif', 'https://icons.getbootstrap.com/assets/icons/chat-fill.svg',31);//活跃区图标
    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/pn_post.png', 'postIcon',80, 33, now_colors[0], now_colors[5], "#C2D5E3");//发帖图标
    replaceImageWithSVG('https://static.52pojie.cn/static/image/common/pn_reply.png', 'replyIcon',80, 33, now_colors[0], now_colors[5], "#C2D5E3");//发帖图标

    //论坛内样式
    //设置发帖用户栏
    var div = document.getElementsByTagName("div");
    for (i =0; i <div.length; i++){
        var div_pls = div[i].getElementsByClassName("pls");
        for (j =0; j < div_pls.length; j++){
            div_pls[j].style.backgroundColor = now_colors[5];
            var pls_tbody = document.getElementsByClassName("pls")[j].getElementsByTagName("tbody");
            for (k =0; k < pls_tbody.length; k++){
                pls_tbody[k].style.backgroundColor = now_colors[5];
            }
        }
    }
    //用户栏分割线
    var tdpls = document.querySelectorAll("tr.ad > td.pls");
    for (i =0; i < tdpls.length; i++){
        tdpls[i].style.backgroundColor = now_colors[6];
    }
    var tdplc = document.querySelectorAll("tr.ad > td.plc");
    for (i =0; i < tdplc.length; i++){
        tdplc[i].style.backgroundColor = now_colors[7];
    }
    //用户栏内样式
    var dt = document.getElementsByTagName("dt")
    for (i =0; i < dt.length; i++){
        dt[i].style.color = now_colors[0];
    }
    var dd = document.getElementsByTagName("dd")
    for (i =0; i < dd.length; i++){
        dd[i].style.color = now_colors[0];
    }
    //楼层标号样式
    var pistronga = document.querySelectorAll(".pi>strong>a");
    for (i =0; i < pistronga.length; i++){
        pistronga[i].style.border = "none";
    }

    if(document.getElementById("online")){//隐藏在线人数框
        document.getElementById("online").style.display="none";
    }
    if(document.getElementById("category_lk")){//隐藏友站
        document.getElementById("category_lk").style.display="none";
    }

    //下一页样式
    var bm_h = document.getElementsByClassName("bm_h")
    for (i =0; i < bm_h.length; i++){
        bm_h[i].style.backgroundColor = now_colors[5];
    }
    //板块主题样式
    var trts_th = document.querySelectorAll("tr.ts,tr.ts > th");
    for (i =0; i < trts_th.length; i++){
        trts_th[i].style.backgroundColor = now_colors[5];
    }
    var trts_td = document.querySelectorAll("tr.ts > td");
    for (i =0; i < trts_td.length; i++){
        trts_td[i].style.backgroundColor = now_colors[5];
    }

    //隐藏免责声明
    if(document.getElementsByClassName("wp vw50_kfc_f")[0]){
        document.getElementsByClassName("wp vw50_kfc_f")[0].style.display="none";
    }

})();