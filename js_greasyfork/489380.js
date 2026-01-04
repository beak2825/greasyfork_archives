// ==UserScript==
// @name         98浏览增强
// @namespace    98浏览增强@shm0214
// @version      1.0.4
// @description  98浏览增强，支持多选帖子一键复制链接&下载附件，帖子列表增加图片
// @author       shm0214
// @match        https://*sehuatang.org/*
// @match        https://*sehuatang.net/*
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/489380/98%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/489380/98%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

function addStyle() {
    let css = `
    .ul_one {list-style: none; margin: 0px; padding: 0px;}
    .ul_one li {float: left; background-color: #ffffff; margin: 5px 20px 0px 0px; border: 2px solid #cccccc; cursor: pointer; padding: 3px}
    .ul_one li:hover {border: 2px solid #28A4D4;}
    .failed::-webkit-scrollbar {
        width: 8px;
        height: 1px;
    }
    .failed::-webkit-scrollbar-thumb {
        border-radius: 4px;
        box-shadow: inset 0 0 5px rgba(182, 176, 176, 0.8);
        background: #EEF4FA;
    }
    .failed::-webkit-scrollbar-track {
        box-shadow: none;
        border-radius: 4px;
        background: transparent;
}
    `;

    GM_addStyle(css);
}

(function () {
    "use strict";
    let jq = $.noConflict(true);
    let dict = {
        // 国产原创
        2: [
            ["684", "国产无码", 1],
            ["685", "主播录制", 1],
            ["686", "360水滴", 1],
            ["687", "厕所偷拍", 1],
        ],
        // 亚洲无码原创
        36: [
            ["586", "sm-miracle", 1],
            ["822", "cospuri", 1],
            ["724", "盗窃系列", 1],
            ["723", "japornxxx", 1],
            ["683", "レズのしんぴ", 1],
            ["672", "无码破解", 1],
            ["671", "加勒比PPV", 1],
            ["660", "金髪天國", 1],
            ["654", "无码流出", 1],
            ["631", "urabukkake", 1],
            ["619", "handjobjapan", 1],
            ["618", "spermmania", 1],
            ["591", "fellatiojapan", 1],
            ["590", "uralesbian", 1],
            ["589", "legsjapan", 1],
            ["587", "roselip-fetish", 1],
            ["368", "FC2PPV", 1],
            ["583", "本生素人TV", 1],
            ["553", "エッチな4610", 1],
            ["552", "エッチな0930", 1],
            ["551", "人妻斬り", 1],
            ["537", "xxx-av", 1],
            ["523", "熟女俱樂部", 1],
            ["449", "东京热", 1],
            ["379", "店長推薦", 1],
            ["375", "heyppv", 1],
            ["374", "pacoma", 1],
            ["373", "女体のしんぴ", 1],
            ["372", "10musu", 1],
            ["371", "一本道系", 1],
            ["370", "加勒比系", 1],
            ["369", "HEYZO", 1],
        ],
        // 亚洲有码原创
        37: [],
        // 欧美无码
        38: [],
        // 动漫原创
        39: [],
        // TXT小说下载
        139: [
            ["673", "凌辱虐情", 1],
            ["674", "唯美纯爱", 1],
            ["675", "都市奇缘", 1],
            ["676", "女警英雄", 1],
            ["677", "青春校园", 1],
            ["678", "历史古香", 1],
            ["679", "同人衍生", 1],
            ["680", "作者合集", 1],
            ["681", "绿意盎然", 1],
            ["682", "玄幻武侠", 1],
            ["722", "版务", 0],
        ],
        // 综合讨论区
        95: [
            ["716", "情色分享", 1],
            ["713", "图文故事", 0],
            ["709", "困惑求助", 0],
            ["710", "技术交流", 0],
            ["711", "心情感悟", 0],
            ["712", "AV新闻", 0],
            ["714", "今日话题", 0],
            ["715", "不吐不快", 0],
            ["843", "游客投稿", 0],
            ["662", "版务管理", 0],
        ],
        // 高清中文字幕
        103: [
            ["480", "有码高清", 1],
            ["481", "无码高清", 1],
        ],
        // 素人有码系列
        104: [
            ["533", "G-area", 1],
            ["728", "300MIUM", 1],
            ["729", "332NAMA", 1],
            ["730", "326EVA", 1],
            ["731", "328HMDN", 1],
            ["807", "336KNB", 1],
            ["808", "200GANA", 1],
            ["809", "300MAAN", 1],
            ["810", "300NTK", 1],
            ["811", "390JAC", 1],
            ["812", "326SCP", 1],
            ["727", "259LUXU", 1],
            ["726", "SIRO", 1],
            ["534", "Mywife", 1],
            ["535", "S-cute", 1],
            ["536", "FC2", 1],
            ["557", "himemix", 1],
            ["563", "getchu", 1],
            ["588", "siro-hame", 1],
            ["626", "r-file", 1],
            ["627", "giga-web", 1],
            ["632", "knights-visual", 1],
            ["725", "230OREX", 1],
            ["813", "其他系列", 1],
        ],
        // 三级写真
        107: [
            ["629", "巴西三级", 1],
            ["628", "克罗地亚三级", 1],
            ["624", "德国三级", 1],
            ["623", "美国写真", 1],
            ["622", "俄罗斯三级", 1],
            ["621", "墨西哥三级", 1],
            ["620", "西班牙三级", 1],
            ["617", "国产写真", 1],
            ["616", "波兰三级", 1],
            ["615", "泰国四级", 1],
            ["614", "阿根廷三级", 1],
            ["613", "香港四级", 1],
            ["612", "瑞士四级", 1],
            ["611", "瑞士三级", 1],
            ["610", "挪威三级", 1],
            ["609", "台湾三级", 1],
            ["608", "荷兰三级", 1],
            ["607", "意大利三级", 1],
            ["606", "加拿大三级", 1],
            ["605", "法国四级", 1],
            ["604", "泰国三级", 1],
            ["603", "台湾四级", 1],
            ["602", "英国三级", 1],
            ["601", "英国四级", 1],
            ["600", "国产四级", 1],
            ["599", "美国四级", 1],
            ["598", "法国三级", 1],
            ["597", "国产三级", 1],
            ["596", "香港三级", 1],
            ["595", "美国三级", 1],
            ["594", "日本三级", 1],
            ["593", "韩国三级", 1],
            ["592", "日本写真", 1],
            ["625", "丹麦三级", 1],
            ["630", "意大利四级", 1],
            ["633", "德国四级", 1],
            ["634", "瑞典四级", 1],
            ["645", "丹麦四级", 1],
            ["646", "荷兰写真", 1],
            ["650", "比利时四级", 1],
            ["655", "澳大利亚三级", 1],
            ["656", "印度三级", 1],
            ["657", "菲律宾三级", 1],
            ["658", "新加坡写真", 1],
            ["659", "韩国写真", 1],
            ["667", "法国写真", 1],
            ["668", "英国写真", 1],
            ["669", "俄罗斯写真", 1],
            ["670", "智利三级", 1],
        ],
        // 网友原创区
        141: [
            ["688", "个人导航", 0],
            ["689", "国产合集", 1],
            ["690", "欧美合集", 1],
            ["691", "日本合集", 1],
            ["692", "AI破解/换脸", 1],
            ["693", "动漫/二次元", 1],
            ["694", "蓝光原盘", 1],
            ["695", "套图系列", 1],
            ["696", "其他資源", 1],
            ["705", "自压/增强", 1],
            ["708", "版务管理", 0],
            ["844", "合集推荐", 1],
        ],
        // 转帖交流区
        142: [
            ["697", "国产自拍", 1],
            ["698", "直播视频", 1],
            ["699", "亚洲无码", 1],
            ["700", "亚洲有码", 1],
            ["701", "偷拍視頻", 1],
            ["702", "动漫/二次元", 1],
            ["703", "欧美风情", 1],
            ["704", "其他資源", 1],
            ["706", "合集资源", 1],
            ["707", "版务管理", 0],
        ],
        // 4K原版
        151: [
            ["823", "无码", 1],
            ["824", "有码", 1],
        ],
        // 韩国主播
        152: [],
        // VR视频区
        160: [],

        // 以下只能保证显示增强，下载附件需要购买
        // AI专区
        166: [
            ["851", "AI换脸", 1],
            ["852", "AI破解", 1],
            ["853", "AI增强", 1],
            ["854", "AI作图", 1],
            ["855", "教程工具", 1],
            ["856", "版务管理", 0],
        ],
        // 资源出售区
        97: [
            ["857", "自整理", 1],
            ["858", "原档合集", 1],
            ["859", "主播录制", 1],
            ["860", "其他资源", 1],
            ["861", "版务管理", 0],
        ],
    };
    let select_types = [];
    let all_flag = false;
    let select_posts = [];
    const file_suffix = ["txt", "rar", "zip", "7z", "torrent"];
    const times = [
        ["一天内", 1],
        ["两天内", 2],
        ["三天内", 3],
        ["七天内", 7],
        ["一个月内", 30],
    ];
    let select_time_idx = -1;
    let download_file_flag = true;
    let enhance_flag = true;
    let show_info_flag = true;
    let text_flag = true;
    let img_links_all = [];
    let text_all = [];
    let tids_all = [];
    let pids_all = [];
    // mode=0不开启 mode=1帖子列表 mode=2查看某个人的所有帖子
    let mode = 0;

    function getParam() {
        let query = window.location.search.substring(1);
        let re = /(\w+)=([^&]+)/g;
        let params = {};
        let arr = query.match(re);
        if (arr == null) {
            arr = /forum-(\d*)-(\d*).html/.exec(window.location.href);
            if (arr == null) {
                return;
            } else {
                params["fid"] = arr[1];
                params["mod"] = "forumdisplay";
                params["page"] = arr[2];
                return params;
            }
        }
        arr.forEach(function (a) {
            let tmp = a.split("=");
            params[tmp[0]] = tmp[1];
        });
        return params;
    }

    function addCheckBox(first = true) {
        if (mode == 0) return;
        let p = getParam();
        if (mode == 1) {
            let tuples = dict[p.fid];
            for (let i = 0; i < tuples.length; i++) {
                if (tuples[i][2] == 1) {
                    select_types.push(i);
                }
            }
            let t = jq("table#threadlisttableid");
            t.find("tr").each(function () {
                let row = jq(this);
                let len = row.find("th, td").length;
                if (len > 5) return;
                if (
                    !first &&
                    !row.parent().attr("id")?.startsWith("normalthread")
                )
                    return;
                let checkbox = jq("<input class='ckb' type='checkbox'>");
                let cell = jq("<td class='ckbox' style='width:3%'></td>");
                let parent_id = row.parent().attr("id");
                if (parent_id && parent_id.substr(0, 6) == "normal") {
                    checkbox.click(function () {
                        let checked = jq(this).prop("checked");
                        let tr = jq(this).parent().parent();
                        if (checked) {
                            tr.addClass("selected");
                        } else {
                            tr.removeClass("selected");
                        }
                    });
                    cell.append(checkbox);
                }
                row.prepend(cell);
            });
            if (jq("tbody#bar").length == 0) {
                addBar(p.fid);
            }
            select();
        } else if (mode == 2) {
            let t = jq("div.tl form table");
            t.find("tr").each(function () {
                let row = jq(this);
                let len = row.find("th, td").length;
                let checkbox = jq("<input class='ckb' type='checkbox'>");
                let cell = jq("<td class='ckbox' style='width:5%'></td>");

                cell.append(checkbox);
                if (row.attr("class") == "th") {
                    let label = "<label for='all'>全选</label>";
                    cell.append(label);
                    checkbox.click(selectAll);
                } else {
                    checkbox.click(function () {
                        let checked = jq(this).prop("checked");
                        let tr = jq(this).parent().parent();
                        if (checked) {
                            tr.addClass("selected");
                        } else {
                            tr.removeClass("selected");
                        }
                    });
                }
                row.prepend(cell);
            });
        }
    }

    function addBar(fid) {
        let t = jq("table#threadlisttableid");
        let tbody = jq(
            "<tbody id='bar'><tr><td colspan='2'></td><td colspan='4'></td></tr></tbody>"
        );
        t.find("tbody[id^='normalthread']").eq(0).before(tbody);
        let checkbox = jq("<input class='ckb_all' type='checkbox'>");
        checkbox.attr("title", "全选");
        checkbox.attr("id", "all");
        checkbox.click(selectAll);
        let label = "<label for='all'>全选</label>";
        jq("#bar td").eq(0).append(checkbox);
        jq("#bar td").eq(0).append(label);
        let ul = jq("<ul class='ul_one' style='display: inline-block'></ul>");
        for (const t of dict[fid]) {
            let li = jq("<li></li>");
            li.text(t[1]);
            ul.append(li);
        }
        jq("#bar td").eq(1).append(ul);
        let lis = jq("#bar li");
        for (const i of select_types) {
            lis.eq(i).css("background-color", "#F0E68C");
        }
        lis.click(li_click);
        let tbody1 = jq(
            "<tbody id='bar1'><tr><td colspan='2'></td><td colspan='4'></td></tr></tbody>"
        );
        t.find("tbody[id^='normalthread']").eq(0).before(tbody1);
        let ul1 = jq("<ul class='ul_one' style='display: inline-block'></ul>");
        for (const t of times) {
            let li = jq("<li class='time_li'></li>");
            li.text(t[0]);
            ul1.append(li);
        }
        jq("#bar1 td").eq(1).append(ul1);
        let lis1 = jq("#bar1 li");
        if (select_time_idx != -1) {
            lis1.eq(select_time_idx).css("background-color", "#F0E68C");
        }
        lis1.click(time_li_click);
    }

    function time_li_click() {
        if (select_time_idx != -1) {
            jq(".time_li")
                .eq(select_time_idx)
                .css("background-color", "#ffffff");
        }
        if (select_time_idx == jq(this).index()) {
            select_time_idx = -1;
        } else {
            select_time_idx = jq(this).index();
            jq(".time_li")
                .eq(select_time_idx)
                .css("background-color", "#F0E68C");
        }
        GM_setValue("select_time_idx", select_time_idx);
        select();
    }

    function li_click() {
        let li = jq(this);
        let idx = li.index();
        if (select_types.indexOf(idx) > -1) {
            let i = select_types.indexOf(idx);
            select_types.splice(i, 1);
            li.css("background-color", "#ffffff");
        } else {
            select_types.push(idx);
            li.css("background-color", "#F0E68C");
        }
        select();
    }

    function selectAll() {
        if (mode == 0) return;
        if (mode == 1) {
            let p = getParam();
            let tuples = dict[p.fid];
            if (!all_flag) {
                select_types = [];
                for (let i = 0; i < tuples.length; i++) {
                    select_types.push(i);
                }
                jq("#bar li").css("background-color", "#F0E68C");
            } else {
                select_types = [];
                jq("#bar li").css("background-color", "#ffffff");
            }
        }
        jq(".ckb").each(function () {
            if (jq(this).prop("checked") == all_flag) {
                jq(this).click();
            }
        });
        all_flag = !all_flag;
        jq(".ckb_all").each(function () {
            jq(this).prop("checked", all_flag);
        });
    }

    function unselectAll() {
        jq(".ckb").each(function () {
            if (jq(this).prop("checked")) {
                jq(this).click();
            }
        });
        if (all_flag) {
            all_flag = false;
        }
        jq(".ckb_all").prop("checked", all_flag);
    }

    function select() {
        unselectAll();
        if (mode == 0) return;
        let p = getParam();
        let tuples = dict[p.fid];
        if (select_time_idx == -1 && select_types.length == tuples.length) {
            selectAll();
            return;
        }
        let t = jq("table#threadlisttableid");
        t.find("tr").each(function () {
            let row = jq(this);
            let checkbox = row.find(".ckb");
            let parent_id = row.parent().attr("id");
            if (parent_id && parent_id.substr(0, 6) == "normal") {
                let a = row.find("th em a");
                let url = a.attr("href");
                let text = a.text();
                if (url == undefined) return;
                let id = url.split("typeid=")[1];
                if (select_time_idx != -1) {
                    let time = row.find("td.by em span span").attr("title");
                    if (time == undefined) {
                        time = row.find("td.by em").eq(0).text();
                    }
                    let now_time = new Date();
                    time = new Date(time);
                    now_time.setHours(0, 0, 0, 0);
                    time.setHours(0, 0, 0, 0);
                    let diff = Math.ceil(
                        (now_time - time) / 1000 / 60 / 60 / 24
                    );
                    if (diff >= times[select_time_idx][1]) {
                        return;
                    }
                }
                for (const i of select_types) {
                    if (id == tuples[i][0] || text == tuples[i][1]) {
                        checkbox.eq(0).click();
                        break;
                    }
                }
            }
        });
    }

    function getWidth() {
        let total_width = jq("body").width();
        let inner_width = jq("#ct").width();
        let left = (total_width - inner_width) / 2;
        let margin = left * 0.05;
        left = left * 0.9;
        return [left, margin];
    }

    function addLeftBar() {
        if (mode == 0) return;
        select_posts = [];
        let leftBar = jq("<div id='leftBar'></div>");
        let t = getWidth();
        leftBar.css({
            position: "fixed",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            "z-index": "9999",
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            width: t[0],
        });
        let buttons = jq("<div></div>");
        let button = jq("<button></button>");
        button.text("一键复制");
        button.css({
            "background-color": "green",
            color: "white",
            padding: "5px",
            border: "none",
            "border-radius": "5px",
            cursor: "pointer",
            "text-align": "center",
            margin: "2px 5px",
        });
        let button1 = jq("<button id='download_file'></button>");
        button1.text(download_file_flag ? "取消下载附件" : "下载附件");
        button1.css({
            "background-color": "green",
            color: "white",
            padding: "5px",
            width: "100px",
            border: "none",
            "border-radius": "5px",
            cursor: "pointer",
            "text-align": "center",
            margin: "2px 5px",
        });
        button1.click(function () {
            download_file_flag = !download_file_flag;
            GM_setValue("download_file_flag", download_file_flag);
            button1.text(download_file_flag ? "取消下载附件" : "下载附件");
        });
        let button2 = jq("<button id='enhance'></button>");
        button2.text(enhance_flag ? "取消显示增强" : "开启显示增强");
        button2.css({
            "background-color": "green",
            color: "white",
            padding: "5px",
            width: "100px",
            border: "none",
            "border-radius": "5px",
            cursor: "pointer",
            "text-align": "center",
            margin: "2px 5px",
        });
        button2.click(function () {
            let tbodys = jq("tbody.img_tbody");
            let trs = jq("tr.img_tr");
            if (enhance_flag) {
                if (tbodys.length > 0) {
                    tbodys.remove();
                }
                if (trs.length > 0) {
                    trs.remove();
                }
            } else {
                if (mode == 1) {
                    enhance();
                } else if (mode == 2) {
                    enhance2();
                }
            }
            enhance_flag = !enhance_flag;
            GM_setValue("enhance_flag", enhance_flag);
            button2.text(enhance_flag ? "取消显示增强" : "开启显示增强");
        });
        let button3 = jq("<button id='showInfo'></button>");
        button3.text(show_info_flag ? "隐藏提示框" : "显示提示框");
        button3.css({
            "background-color": "green",
            color: "white",
            padding: "5px",
            width: "90px",
            border: "none",
            "border-radius": "5px",
            cursor: "pointer",
            "text-align": "center",
            margin: "2px 5px",
        });
        buttons.append(button);
        buttons.append(button1);
        buttons.append(button2);
        buttons.append(button3);
        leftBar.append(buttons);

        let alert = jq("<div class='alert'></div>");
        alert.css({
            display: "none",
            position: "fixed",
            top: "50%",
            left: "50%",
            "min-width": "200px",
            "margin-left": "-100px",
            "z-index": "99999",
            padding: "15px",
            border: "1px solid transparent",
            "border-radius": "4px",
            color: "#3c763d",
            "background-color": "#dff0d8",
            "border-color": "#d6e9c6",
        });
        alert.text("操作成功");
        jq("body").append(alert);
        button.click(function () {
            select_posts = [];
            jq("tr.selected").each(function () {
                if (mode == 1) {
                    let tid = jq(this)
                        .find("th a")
                        .first()
                        .attr("id")
                        .split("_")[1];
                    console.log(tid);
                    let title = jq(this).find("th a").eq(2).text();
                    console.log(title);
                    select_posts.push([tid, title]);
                } else if (mode == 2) {
                    console.log(jq(this));
                    let tid = jq(this)
                        .find("th a")
                        .first()
                        .attr("href")
                        .split("tid=")[1];
                    let title = jq(this).find("th a").first().text();
                    select_posts.push([tid, title]);
                    console.log(tid, title);
                }
            });
            getLinks();
        });
        let textbox = jq("<div class='failed'></div>");
        textbox.css({
            // width: "200px",
            height: "300px",
            border: "1px solid #96c2f1",
            padding: "10px",
            overflow: "auto",
            resize: "none",
            background: "#eff7ff",
            animation: "fadein 1s",
            "margin-top": "1px",
        });
        textbox.html(
            "这里会显示复制失败的帖子<br>请阻止浏览器拦截弹出窗口，否则附件下载不全"
        );
        leftBar.append(textbox);
        button3.click(function () {
            show_info_flag = !show_info_flag;
            if (!show_info_flag) {
                textbox.css("display", "none");
            } else {
                textbox.css("display", "block");
            }
            GM_setValue("show_info_flag", show_info_flag);
            button3.text(show_info_flag ? "隐藏提示框" : "显示提示框");
        });
        if (!show_info_flag) {
            textbox.css("display", "none");
        }
        // let button11 = jq("<button></button>");
        // button11.text(text_flag ? "不显示文字" : "显示文字");
        // button11.css({
        //     "background-color": "green",
        //     color: "white",
        //     padding: "10px",
        //     border: "none",
        //     "border-radius": "5px",
        //     cursor: "pointer",
        //     "text-align": "center",
        //     margin: "2px 5px",
        // });
        // button11.click(function () {
        //     let tbodys = jq("tbody.img_tbody");
        //     text_flag = !text_flag;
        //     GM_setValue("text_flag", text_flag);
        //     button2.text(text_flag ? "不显示文字" : "显示文字");
        // });
        // leftBar.append(button11);
        jq("body").append(leftBar);
    }

    function getLinks() {
        let requests = [];
        for (const p of select_posts) {
            let url =
                "https://" +
                window.location.host +
                "/forum.php?mod=viewthread&tid=" +
                p[0];
            let jqXHR = jq.ajax({
                url: url,
                type: "GET",
            });
            requests.push(jqXHR);
        }
        jq.when(...requests).then(
            function () {
                let args = arguments;
                if (requests.length == 1) {
                    args = [arguments];
                }
                let data = Array.prototype.slice.call(args);
                let links = [];
                let link_num = 0;
                let post_num = 0;
                let file_num = 0;
                let failed_post_idxs = [];
                jq.each(data, function (i, d) {
                    let last_link_num = link_num;
                    let last_file_num = file_num;
                    // 代码块中代码链接，只保留了ed2k和磁力链接
                    jq(d[0])
                        .find(".t_f")
                        .find(".blockcode")
                        .find("li")
                        .each(function () {
                            let link = jq(this).text().replace(/\s+/g, "");
                            if (
                                link &&
                                (link.startsWith("ed2k") ||
                                    link.startsWith("magnet:"))
                            ) {
                                link_num++;
                                links.push(link);
                            }
                        });
                    // 正文部分ed2k链接
                    jq(d[0])
                        .find(".t_f a")
                        .each(function () {
                            if (jq(this).attr("id")?.startsWith("ed2k")) {
                                let link = jq(this).attr("href");
                                link.replace(/\s+/g, "");
                                if (link) {
                                    link_num++;
                                    links.push(link);
                                }
                            }
                        });
                    // 正文部分magnet链接，此部分只能使用正则匹配
                    let text = jq(d[0]).find(".t_f").text();
                    let re = /magnet:\?xt=urn:btih:[a-fA-F0-9]{40,}/g;
                    let arr = text.match(re);
                    if (arr?.length > 0) {
                        for (const link of arr) {
                            if (links.indexOf(link) == -1) {
                                link_num++;
                                links.push(link);
                            }
                        }
                    }
                    if (download_file_flag) {
                        // 正文部分文件链接
                        jq(d[0])
                            .find(".t_f a")
                            .each(function () {
                                let href = jq(this).attr("href");
                                if (
                                    href.startsWith("forum.php?mod=attachment")
                                ) {
                                    let parts = jq(this).text().split(".");
                                    if (parts.length < 2) {
                                        return;
                                    } else {
                                        let suffix = parts[parts.length - 1];
                                        if (file_suffix.indexOf(suffix) == -1) {
                                            return;
                                        }
                                    }
                                    let url =
                                        "https://" +
                                        window.location.host +
                                        "/" +
                                        href;
                                    window.open(url, "_blank");
                                    file_num++;
                                }
                            });
                        // 附件部分文件链接
                        jq(d[0])
                            .find(".pattl a")
                            .each(function () {
                                let href = jq(this).attr("href");
                                if (
                                    href.startsWith("forum.php?mod=attachment")
                                ) {
                                    let parts = jq(this).text().split(".");
                                    if (parts.length < 2) {
                                        return;
                                    } else {
                                        let suffix = parts[parts.length - 1];
                                        if (file_suffix.indexOf(suffix) == -1) {
                                            return;
                                        }
                                    }
                                    let url =
                                        "https://" +
                                        window.location.host +
                                        "/" +
                                        href;
                                    window.open(url, "_blank");
                                    file_num++;
                                }
                            });
                    }
                    if (link_num > last_link_num || file_num > last_file_num) {
                        post_num++;
                    } else {
                        failed_post_idxs.push(i);
                    }
                });
                console.log(links.join("\r\n"));
                GM_setClipboard(links.join("\r\n"));
                let text =
                    "成功复制" +
                    post_num +
                    "个帖子中的" +
                    link_num +
                    "个链接， 下载" +
                    file_num +
                    "个附件";
                console.log(text);
                jq(".alert").text(text);
                jq(".alert").show().delay(1500).fadeOut();
                console.log(failed_post_idxs);
                let ul = jq("<ul style='list-style: circle'></ul>");
                if (failed_post_idxs.length > 0) {
                    for (const idx of failed_post_idxs) {
                        let url =
                            "https://" +
                            window.location.host +
                            "/forum.php?mod=viewthread&tid=" +
                            select_posts[idx][0];
                        let li = jq(
                            "<li style='list-style: circle; list-style-position: inside;'><a href='" +
                                url +
                                "'target='_blank'>" +
                                select_posts[idx][1] +
                                "</li>"
                        );
                        ul.append(li);
                    }
                } else {
                    let li = jq(
                        "<li style='list-style: circle; list-style-position: inside;'>所有帖子链接复制成功或附件下载成功</li>"
                    );
                    ul.append(li);
                    li = jq(
                        "<li style='list-style: circle; list-style-position: inside;'>" +
                            text +
                            "</li>"
                    );
                    ul.append(li);
                }
                jq(".failed").html(ul);
            },
            function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        );
    }

    function getSaveSetting() {
        select_time_idx = GM_getValue("select_time_idx", -1);
        download_file_flag = GM_getValue("download_file_flag", true);
        enhance_flag = GM_getValue("enhance_flag", true);
        dict = GM_getValue("dict", dict);
        show_info_flag = GM_getValue("show_info_flag", true);
    }

    function my_score() {
        // console.log(jq(this));
        // console.log(pids_all);
        // console.log(tids_all);
    }

    function enhance() {
        if (mode == 0) {
            return;
        }
        let num = text_all.length;
        let t = jq("table#threadlisttableid");
        let tids = [];
        let i = 0;
        t.find("tbody[id^='normalthread']").each(function () {
            if (i++ < num) {
                return;
            }
            let tid = jq(this).attr("id").split("_")[1];
            tids.push(tid);
        });
        tids_all = tids_all.concat(tids);
        let requests = [];
        for (const tid of tids) {
            let url =
                "https://" +
                window.location.host +
                "/forum.php?mod=viewthread&tid=" +
                tid;
            let jqXHR = jq.ajax({
                url: url,
                type: "GET",
            });
            requests.push(jqXHR);
        }
        // 收集文字与图片
        jq.when(...requests)
            .then(function () {
                let args = arguments;
                if (requests.length == 1) {
                    args = [arguments];
                }
                let data = Array.prototype.slice.call(args);
                jq.each(data, function (i, d) {
                    let pid = jq(d[0])
                        .find("table[id^=pid]")
                        .first()
                        .attr("id")
                        .split("pid")[1];
                    pids_all.push(pid);
                    let text = jq(d[0])
                        .find(".t_f")
                        .eq(0)
                        .text()
                        .replace(/ +/g, " ")
                        .replace(/\n+/g, "\n");
                    let imgs = jq(d[0])
                        .find(".t_f")
                        .find('img[id^="aimg_"]')
                        .filter(function () {
                            return jq(this)
                                .attr("id")
                                .match(/aimg_\d+$/);
                        });
                    let img_links = [];
                    for (const img of imgs) {
                        img_links.push(img.getAttribute("file"));
                        if (img_links.length >= 3) {
                            break;
                        }
                    }
                    if (img_links.length == 0) {
                        let imgs1 = jq(d[0])
                            .find(".t_fsz")
                            .find('img[id^="aimg_"]')
                            .filter(function () {
                                return jq(this)
                                    .attr("id")
                                    .match(/aimg_\d+$/);
                            });
                        for (const img of imgs1) {
                            img_links.push(img.getAttribute("file"));
                            if (img_links.length >= 3) {
                                break;
                            }
                        }
                    }
                    img_links_all.push(img_links);
                    text_all.push(text.substr(0, 100));
                });
            })
            .then(function () {
                let num = jq("div.container").length;
                // 显示文字与图片
                if (text_all.length > 0) {
                    for (let i = num; i < text_all.length; i++) {
                        let text = text_all[i];
                        let img_links = img_links_all[i];

                        let t = jq("table#threadlisttableid");
                        let tbody = t.find("tbody[id^='normalthread']").eq(i);
                        tbody.after(
                            "<tbody class='img_tbody' style='background-color:#F5FAFA'></tbody>"
                        );
                        let img_tbody = tbody.next();
                        let tr = jq(
                            "<tr><td colspan=2></td><td colspan=4></td></tr>"
                        );
                        img_tbody.append(tr);
                        let td = tr.find("td").eq(0);
                        // let button = jq(
                        //     "<button class='my_score_btn' id='my_score_btn'></button>"
                        // );
                        // button.text("评 分");
                        // button.css({
                        //     "background-color": "green",
                        //     color: "white",
                        //     padding: "10px",
                        //     border: "none",
                        //     "border-radius": "5px",
                        //     cursor: "pointer",
                        //     "text-align": "center",
                        //     margin: "2px 5px",
                        // });
                        // button.unbind("click");
                        // button.click(my_score);
                        // td.append(button);
                        td = tr.find("td").eq(1);
                        let div = jq("<div class='container'></div>");
                        let p = jq("<p style='white-space:pre-wrap'></p>");
                        p.text(text);
                        div.append(p);
                        let div1 = jq(
                            "<div class='img_container' style='display:flex; justify-content:space-between'></div>"
                        );
                        for (const img_link of img_links) {
                            let img = jq(
                                "<img style='margin: 5px 5px 5px 5px; height:auto; width: 30%'>"
                            );
                            img.attr("src", img_link);
                            div1.append(img);
                        }
                        div.append(div1);
                        td.append(div);
                    }
                    return;
                }
            });
    }

    function enhance2() {
        if (mode != 2) return;
        let num = text_all.length;
        let t = jq("div.tl form table");
        let tids = [];
        let i = 0;
        t.find("tr").each(function () {
            if (jq(this).attr("class") == "th") return;
            if (i++ < num) {
                return;
            }
            let tid = jq(this).find("th a").attr("href").split("tid=")[1];
            tids.push(tid);
        });
        tids_all = tids_all.concat(tids);
        let requests = [];
        for (const tid of tids) {
            let url =
                "https://" +
                window.location.host +
                "/forum.php?mod=viewthread&tid=" +
                tid;
            let jqXHR = jq.ajax({
                url: url,
                type: "GET",
            });
            requests.push(jqXHR);
        }
        // 收集文字与图片
        jq.when(...requests)
            .then(function () {
                let args = arguments;
                if (requests.length == 1) {
                    args = [arguments];
                }
                let data = Array.prototype.slice.call(args);
                jq.each(data, function (i, d) {
                    let pid = jq(d[0])
                        .find("table[id^=pid]")
                        .first()
                        .attr("id")
                        .split("pid")[1];
                    pids_all.push(pid);
                    let text = jq(d[0])
                        .find(".t_f")
                        .eq(0)
                        .text()
                        .replace(/ +/g, " ")
                        .replace(/\n+/g, "\n");
                    let imgs = jq(d[0])
                        .find(".t_f")
                        .find('img[id^="aimg_"]')
                        .filter(function () {
                            return jq(this)
                                .attr("id")
                                .match(/aimg_\d+$/);
                        });
                    let img_links = [];
                    for (const img of imgs) {
                        img_links.push(img.getAttribute("file"));
                        if (img_links.length >= 3) {
                            break;
                        }
                    }
                    if (img_links.length == 0) {
                        let imgs1 = jq(d[0])
                            .find(".t_fsz")
                            .find('img[id^="aimg_"]')
                            .filter(function () {
                                return jq(this)
                                    .attr("id")
                                    .match(/aimg_\d+$/);
                            });
                        for (const img of imgs1) {
                            img_links.push(img.getAttribute("file"));
                            if (img_links.length >= 3) {
                                break;
                            }
                        }
                    }
                    img_links_all.push(img_links);
                    text_all.push(text.substr(0, 100));
                });
            })
            .then(function () {
                let num = jq("div.container").length;
                // 显示文字与图片
                if (text_all.length > 0) {
                    for (let i = num; i < text_all.length; i++) {
                        let text = text_all[i];
                        let img_links = img_links_all[i];

                        let t = jq("div.tl form table");
                        let tr = t.find("tr[class!='img_tr']").eq(i + 1);
                        tr.after(
                            "<tr class='img_tr' style='background-color:#F5FAFA'></tr>"
                        );
                        let img_tr = tr.next();
                        let tds = jq("<td colspan=2></td><td colspan=4></td>");
                        img_tr.append(tds);
                        let td = img_tr.find("td").eq(0);
                        // let button = jq(
                        //     "<button class='my_score_btn' id='my_score_btn'></button>"
                        // );
                        // button.text("评 分");
                        // button.css({
                        //     "background-color": "green",
                        //     color: "white",
                        //     padding: "10px",
                        //     border: "none",
                        //     "border-radius": "5px",
                        //     cursor: "pointer",
                        //     "text-align": "center",
                        //     margin: "2px 5px",
                        // });
                        // button.unbind("click");
                        // button.click(my_score);
                        // td.append(button);
                        td = img_tr.find("td").eq(1);
                        let div = jq("<div class='container'></div>");
                        let p = jq("<p style='white-space:pre-wrap'></p>");
                        p.text(text);
                        div.append(p);
                        let div1 = jq(
                            "<div class='img_container' style='display:flex; justify-content:space-between'></div>"
                        );
                        for (const img_link of img_links) {
                            let img = jq(
                                "<img style='margin: 5px 5px 5px 5px; height:auto; width: 30%'>"
                            );
                            img.attr("src", img_link);
                            div1.append(img);
                        }
                        div.append(div1);
                        td.append(div);
                    }
                    return;
                }
            });
    }

    function addNextPageListener() {
        if (mode == 0) {
            return;
        }
        jq(document).ready(function () {
            jq("a.bm_h").on("click", function () {
                setTimeout(function () {
                    addCheckBox(false);
                    enhance();
                    console.log("click");
                }, 1500);
            });
            jq("tbody#forumnewshow a").on("click", function () {
                setTimeout(function () {
                    addCheckBox(false);
                    enhance();
                    console.log("click");
                }, 1500);
            });
        });
    }

    function removeAdd() {
        jq("div[class^='show-text']").remove();
    }

    function getMode() {
        let p = getParam();
        if (p.mod == "forumdisplay" && p.fid in dict) {
            mode = 1;
        } else if (
            p.mod == "space" &&
            p.uid &&
            p.do == "thread" &&
            p.view == "me" &&
            p.from == "space"
        ) {
            mode = 2;
        }
    }

    function main() {
        if (
            document.title.indexOf("色花堂") == -1 &&
            document.title.indexOf("98堂") == -1
        ) {
            return;
        }
        removeAdd();
        getMode();
        getSaveSetting();
        addStyle();
        addCheckBox();
        addLeftBar();
        if (enhance_flag) {
            if (mode == 1) {
                enhance();
            } else if (mode == 2) {
                enhance2();
            }
        }
        addNextPageListener();
        window.onresize = function () {
            let t = getWidth();
            jq("#leftBar").css("width", t[0]);
        };

        window.onbeforeunload = function () {
            if (mode == 0) return;
            GM_setValue("select_time_idx", select_time_idx);
            GM_setValue("download_file_flag", download_file_flag);
            GM_setValue("enhance_flag", enhance_flag);
            GM_setValue("text_flag", text_flag);
            GM_setValue("show_info_flag", show_info_flag);
            console.log(select_types);
            for (let i = 0; i < dict[p.fid].length; i++) {
                if (select_types.indexOf(i) > -1) {
                    dict[p.fid][i][2] = 1;
                } else {
                    dict[p.fid][i][2] = 0;
                }
            }
            GM_setValue("dict", dict);
        };
    }
    main();
})();
