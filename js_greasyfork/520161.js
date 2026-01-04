// ==UserScript==
// @name              百度网盘SVIP解析高速下载-小莫加速
// @namespace         momoz
// @version           1.1
// @author            xiaomo
// @description       百度网盘SVIP解析高速下载,24小时维护100%可以用！使用IDM下载更加稳定IDM UA设置：LogStatistic  Chrome浏览器一定打开开发者模式才能正常显示出来!
// @antifeature       membership
// @antifeature       ads
// @antifeature       tracking
// @license            MIT
// @icon              https://nd-static.bdstatic.com/m-static/v20-main/home/img/icon-home-new.b4083345.png
// @match             *://pan.baidu.com/*
// @match             *://yun.baidu.com/*
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/disk/main*
// @match             *://yun.baidu.com/disk/main*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/*
// @match             *://yun.baidu.com/share/*
// @match             http://127.0.0.1:5500/*
// @connect           baidu.com
// @connect           127.0.0.1
// @connect           ty.shzxkq.com
// @grant             GM_addStyle
// @grant             GM_getResourceText
// @run-at            document-idle
// @require           https://lib.baomitu.com/layui/2.9.3/layui.min.js
// @downloadURL https://update.greasyfork.org/scripts/520161/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98SVIP%E8%A7%A3%E6%9E%90%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD-%E5%B0%8F%E8%8E%AB%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/520161/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98SVIP%E8%A7%A3%E6%9E%90%E9%AB%98%E9%80%9F%E4%B8%8B%E8%BD%BD-%E5%B0%8F%E8%8E%AB%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==



(function () {

    addStylesheet('https://lib.baomitu.com/layui/2.9.3/css/layui.css');



    var config = {
        gonggao: "每个站点每8小时5次解析，如不能解析，说明账号被封！",
        host_list: {
            "1": "https://bdb.shzxkq.com",
            "2": "",
            "3": ""
        },
        bd_password: "asdf",
        title_name: "度娘加速",
        file_name:"",
        savePath: 'D:\\',
        jsonrpc: 'http://localhost:6800/jsonrpc',
        username: "",
        tab_id: "1",
        ua: "netdisk;",
        window_height: 525,  //界面高度
        workdata: {},
        dropdown: null,
        file_size:0
    }
    config.main_url = config.host_list['1'];
    config.main_img_url = config.host_list['1'] + '/xcx.jpg';


    function addStylesheet(url) {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        link.type = 'text/css';
        document.head.appendChild(link);
    }

    function setdropdown_off_on(state = false) {
        let dom = document.querySelector(`#tab${config.tab_id} .demo-dropdown-on`);
        if (state) {
            dom.setAttribute("disabled", "");
            dom.classList.add('layui-btn-disabled');
            dom.classList.remove('demo-dropdown-on_ondisabled');
        } else {
            dom.removeAttribute("disabled");
            dom.classList.remove('layui-btn-disabled');
            dom.classList.add('demo-dropdown-on_ondisabled');
        }
    }


    layui.use(['layer'], async function () {
        var layer = layui.layer, $ = layui.$, element = layui.element;
        var dropdown = layui.dropdown;
        await Promise.resolve(new Promise((resolve) => setTimeout(resolve, 888)));

        if (location.href.startsWith("https://pan.baidu.com/s/")) {
            //分享界面加按钮
            $('.x-button-box').prepend('<a class="g-button" id="downbtn_share" style="background-color: #6800ff;color: #fff;border-color: #6800ff;"  href="javascript:;" ><span class="g-button-right"><em class="icon icon-download" title=""></em><span class="text" style="width: auto;">' + config.title_name + '</span></span></a>');
        } else {
            // 其他界面加按钮
            if ($('.tcuLAu').is('*')) {
                //旧版
                $('.tcuLAu').prepend('<span class="g-dropdown-button"><a id="downbtn_main"  style=" margin-right: 10px;color: #fff;background-color: #6800ff;border-color: #6800ff;" id="downbtn_main" class="g-button" ><span class="g-button-right"><em class="icon icon-download" ></em><span class="text" style="width: auto;">' + config.title_name + '</span></span></a></span>');
            } else {
                //新版
                $('.wp-s-agile-tool-bar__header.is-header-tool').prepend('<div class="wp-s-agile-tool-bar__h-group"><button style=" margin-right: 10px;color: #fff;background-color: #6800ff;border-color: #6800ff;" id="downbtn_main" class="u-button nd-file-list-toolbar-action-item" ><i class="iconfont icon-download"></i> <span>' + config.title_name + '</span></button></div>');
            }
        }

        $('#downbtn_share').click(function () {
            my_alert("提示:请先保存到自己的网盘后，从网盘里解析!");
            return false;
        });


        $('#downbtn_main').click(function () {
            let xuanzhe_list = get_xuanzhe_list();
            let xuanzhe_list2 = Object.keys(xuanzhe_list);
            if (xuanzhe_list2.length == 0) {
                my_alert("提示:请先选择一个文件");
                return false;
            } else if (xuanzhe_list2.length > 1) {
                my_alert("提示:目前仅支持一个文件解析");
                return false;
            } else if (xuanzhe_list[xuanzhe_list2[0]].isdir == 1) {
                my_alert("提示:目前不支持文件夹解析！");
                return false;
            }


            let file_info_obj = xuanzhe_list[xuanzhe_list2[0]];

            config.file_size = file_info_obj.size;
          

            let html_code = `
            <style>
                .pincode-input {width: 38px;height: 38px;line-height: 50px;border-radius: 3px;border: 2px solid gray;text-align: center;font-size: 1.5rem}
                .pincode-input:not(:last-child) {margin-right: 1rem}
                .pincode-input.pincode-input--focused {border-color: #000}
                .pincode-input.pincode-input--filled {border-color: dodgerblue}
                .layui-layer-setwin .layui-layer-close2 {position: absolute;right: -5px !important;top: -5px !important;}
                .layui-layer-close::before {content: "X" !important;}
                .swal2-container {z-index: 999999999 !important;}
                .swal2-popup {padding-top: 20px !important;justify-items: center !important;}
                .blockquote {display: inline-block;white-space: nowrap;width: 100%;overflow: hidden;text-overflow: ellipsis;}
                .layui-tab .layui-tab-title {border-bottom-width: 0;}
                .layui-tab-brief>.layui-tab-title li {color: #6a6a6a;font-weight: 700;font-size: 16px;}
                .layui-tab-brief>.layui-tab-title .layui-this {color: #2196f3;font-weight: 700;font-size: 16px;}
                .layui-tab-brief>.layui-tab-more li.layui-this:after,
                .layui-tab-brief>.layui-tab-title .layui-this:after {border: none;border-radius: 0;width: 50%;left: 25%;border-bottom: 5px solid #2196f3;}
                .layui-tab {margin: 0;}
                .layui-tab-title {background: #fff;}
                .layui-layer-page {border-radius: 25px;}
                .demo {display: none;margin-top: 12px;}
                #popup {width: 320px;height: 195px;position: absolute;right: 6px;bottom: 58px;border: 1px solid #000;background-color: #fff;display: none;}
                #dialogDivSavePath {text-align: left;line-height: 23px;position: absolute;padding: 15px;color: rgba(0, 0, 0, .86);}
                .layui-btn-sm {height: 45px;line-height: 30px;padding: 0 15px;font-size: 14px;}
                .piao {background-image: linear-gradient(90deg, rgb(114, 9, 212), rgb(40, 50, 212) 33%, rgb(0, 165, 178));color: rgba(0, 0, 0, 0);-webkit-background-clip: text;font-style: normal;}
                .layui-layer-content {overflow: hidden !important;}
                .h1 {font-family: PingFangSC-Regular, sans-serif, Microsoft YaHei, SimHei, Tahoma !important;font-weight: 700;margin-bottom: 16px;font-size: 32px;line-height: 48px;}
                .h2 {font-size: 21px;line-height: 2;}
                .h3 {font-size: 16.38px;line-height: 2;}
                .layui-card-body {position: relative;padding: 10px 15px;line-height: 22px;}
                .imgset {position: absolute;cursor: pointer;font-size: 9px;right: 15px;bottom: 23px;width: 35px;}
                .my_button_class1 {background-color: #ff436a;color: #fff;border-color: #ff436a;font-weight: 700;}
                #my_loadingtext {display: none;padding: 1px;background: rgb(255 255 255);position: absolute;z-index: 2147483647;text-align: center;top: 57%;font-weight: 500;color: rgb(3, 169, 244);font-size: 25px;left: 50%;transform: translate(-50%, -50%);}
                .swal2-container {z-index: 9999999999 !important; }
               
                .layui-layer-page {border-radius: 0px !important;}



                .borderNo_bottom {border-top: 2px #000000 solid;border-left: 2px #000000 solid;border-right: 2px #000000 solid;}
                .borderNo_topANDleft {border-right: 2px #000000 solid;}
                .Other_layui-tab-item {border: 2px solid black;height: 550px;text-align: center;}
                .tab_item_content {position: relative;height: 500px;width: 800px;margin: 0 auto;display: flex;justify-content: center;align-items: center;}
                .layui-this {color: #000 !important;}
                .layui-layer-page {border-radius: 0px !important;}
                .layui-tab-title .layui-this::after {height: 40px !important;;}
                .layui-this:after {background-color: rgba(30, 24, 20, 0.45) !important;border-bottom: 0px solid red !important;width: 100% !important;left: 0px !important;}
                .layui-btn{background-color: #fb7d4b !important;}
                .layui-btn-disabled{background-color: #fbfbfb !important;}
                .layui-tab-title{background-color: #fff;border: 2px solid black;}
                .my_tab_br{border-right:2px solid black;}

                .demo-dropdown-on{height: 45px;font-size: 18px;color: #fff;}
                .demo-dropdown-on_ondisabled {background-color: #16baaa !important;}
               


        </style>`;

            function tab_html(tabid) {
                config.workdata[String(tabid)] = [];
                return `
                       <div class="layui-card" style="border: 2px solid black;margin-bottom: -2px;padding:1px 25px;">
                            <div style="text-align:center;">公告:${config.gonggao}</div>
                       </div>
                        <div class="layui-card" style="border: 2px solid black;margin-bottom: -2px;padding:10px 25px;">
                            <b>
                                <div class="server_filename" style="text-align:center;">当前文件名:</div>
                            </b>
                            <div style="text-align:center;">扫描二维码获取解析密码后，点击解析按钮</div>
                            <div style="text-align:center;">
                                <img id="code_img" src="${config.host_list[config.tab_id]}/xcx.jpg" style="width:240px;height:240px;">
                            </div>
                        </div>

                        <div class="layui-card" style="margin-bottom: -1px;border-left: 2px solid black;padding:10px 25px;border-top: 0xp solid black;border-right: 2px #000000 solid;border-bottom: 2px #000 solid;">
                            <button type="button" class="main_start layui-btn layui-btn-sm" style="/*! float: right; */margin-left: 355px;">提交解析</button>
                        </div>

                        <div style="border-left: 2px solid black;border-top: 0xp solid black;border-right: 2px #000000 solid;border-bottom: 2px #000 solid;padding: 15px 25px;">
                            <button class="layui-btn layui-btn-primary demo-dropdown-on layui-btn-disabled" style=""  id="dropdown_tab${tabid}" lay-options="{trigger: 'mousedown'}" disabled>
                                点击复制解析直链IDM下载
                                <i class="layui-icon layui-icon-down layui-font-12"></i>
                            </button>
                            <button type="button" class="main_start_query layui-btn layui-btn-sm" style="float: right;">查询任务</button>
                        </div>
            `;
            }

            html_code += `<body>
            <div class="layui-tab layui-tab-card" id="tab" lay-filter="demo">
                <ul class="layui-tab-title" style="">
                    <li class="layui-this my_tab_br" lay-id="1">解析站01</li>
                    <li class="my_tab_br" lay-id="2">筹建中02</li>
                    <li class="my_tab_br" lay-id="3">筹建中03</li>
                    <li class="my_tab_br" lay-id="help">联系我们</li>
                </ul>
                <div class="layui-tab-content" style="padding-top:0px">
                  <div class="layui-tab-item layui-show"  id="tab1" style="margin-top: 2px;">
                    ${tab_html(1)}
                     </div>
                    <div class="layui-tab-item" id="tab2" style="margin-top: 2px;">
                    ${tab_html(2)}
                     </div>
                    <div class="layui-tab-item" id="tab3" style="margin-top: 2px;">
                    ${tab_html(3)}
                     </div>

                    <div class="layui-tab-item" style="margin-top: 2px;">
                        <div style="text-align:center;border: 2px solid black;height:${config.window_height - 20}px;position:relative;">
                            <div style="position: absolute;top:50%;left:50%;transform:translate(-50%,-50%);">
                                <div>TG: https://t.me/xiaomozycc</div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </body>`;
            // 渲染



            layer.open({
                type: 1,
                title: false,
                closeBtn: 1,
                shadeClose: true,
                // shade: 0.9, // 遮罩透明度
                // area: ['500px', '367px'],//宽 高
                area: ['500px', config.window_height + 'px'],//宽 高
                content: html_code,
                success: function (layero, index) {
                    let data_json = {};
                    config.tab_id = 1;
                    config.workdata = {};
                    config.main_url = config.host_list[config.tab_id];
                    document.querySelector(`#tab${ config.tab_id} #code_img`).src = config.main_url + "/xcx.jpg";


                    try {
                        data_json = $("html").html().match(/(?<=locals\.mset\()(.*?)(?=\);)/)[0];
                        data_json = JSON.parse(data_json);
                        config.username = data_json.username;
                    } catch (e) {
                        data_json = $("html").html().match(/(?<=window\.locals\s=\s)(.*?)(?=;)/)[0];
                        data_json = JSON.parse(data_json);
                        config.username = data_json.userInfo.username;
                    }
                    config.data_json = data_json;

                    dropdown.render({
                        elem: '.demo-dropdown-on', // 绑定元素选择器，此处指向 class 可同时绑定多个元素
                        data: [],
                        disabled: true,
                        templet: function (d) {
                            state_dict = ["layui-icon-lock","layui-icon-loading-1","layui-icon-success"];
                            icon_class =  d.workstate >= 3?"layui-icon-question":state_dict[d.workstate];

                            if (d.workstate == 2) {
                                if (String(d.download_url).indexOf("http") == -1) {
                                    icon_class = "layui-icon-error";
                                    icon_color = "red";
                                } else {
                                    icon_color = "green";
                                }
                            } else {
                                icon_color = "red";
                            }

                            return `<div class="layui-menu-body-title" >  
                                <p class="layadmin-textimg" style="color: ${icon_color};">
                                    <i class="layui-icon ${icon_class}" style="font-size: 20px;"></i>
                                    ${d.title}
                                </p>
                             </div>`;
                        },
                        click: function (obj) {
                            // alert(obj.title);
                            if (String(obj.download_url).indexOf("http") == -1) {
                                layer.msg("排队解析中，请耐心等待1分钟后查询直链！！！！");
                                return false;
                            }
                            var textarea = document.createElement('textarea');
                            textarea.style.position = 'fixed';
                            textarea.style.opacity = 0;
                            textarea.value = obj.download_url;
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            layer.msg(obj.title + '的下载直链已复制');
                        }
                    });
                    config.dropdown = dropdown;

                    config.dropdown.reloadData(`dropdown_tab${config.tab_id}`, { 'data': set_dropdown_data() })

                    // 监听Tab切换
                    element.on('tab(demo)', function (data) {
                        var $this = $(this);
                        console.log($this, data)
                        // 获取当前激活的Tab的lay-id属性值
                        var tabId = data.elem.context.attributes['lay-id'].value;
                        config.tab_id = tabId;
                        config.dropdown.reloadData(`dropdown_tab${config.tab_id}`, { 'data': set_dropdown_data() })
                        if (tabId === 'help') {
                            // $this.text('重新加载的内容:help');
                            console.log(config)
                        } else {
                            config.main_url = config.host_list[tabId];
                            document.querySelector(`#tab${tabId} #code_img`).src = config.main_url + "/xcx.jpg";
                        }

                    });

                    $(".my_setting").click(function () {
                        //作废
                        // alert("设置")
                        let promptI = layer.prompt({ title: '输入下载路径', formType: 0, value: config.savePath }, function (value, index) {
                            layer.close(promptI);
                            config.savePath = value;
                            layer.msg("下载路径设置完成：" + config.savePath);
                        });
                    })
                    config.file_name = file_info_obj.server_filename;
                    $(".server_filename").text("当前文件名:" + file_info_obj.server_filename);

                    $('.main_start_query').click(function () {
                        get_all_down_url();
                    })


                    $('.main_start').click(function () {
                        // $('.copy').addClass('layui-btn-disabled').removeAttr('down-url');
                        // $('.pusharia').addClass('layui-btn-disabled').removeAttr('down-url');
                        if (get_parse_key_value(config.tab_id) && get_parse_key_time(config.tab_id) && new Date().getTime() < Number(get_parse_key_time(config.tab_id))) {
                            layer.load(2, {
                                shade: [0.3, '#FFF'],
                            });
                            share_one_baidu();
                        } else {
                            let promptI = layer.prompt({ title: '密码已重置，请重新输入', formType: 1 }, function (value, index) {
                                layer.close(promptI);
                                //layer.msg("密码输入完成");

                                set_parse_key(config.tab_id, value)
                                layer.load(2, { shade: [0.3, '#FFF'], });
                                share_one_baidu();
                            });
                        }

                    });
                    $('.copy').click(function () {
                        //作废
                        if (!$(this).hasClass('layui-btn-disabled')) {
                            var textarea = document.createElement('textarea');
                            textarea.style.position = 'fixed';
                            textarea.style.opacity = 0;
                            textarea.value = $(this).attr('down-url');
                            document.body.appendChild(textarea);
                            textarea.select();
                            document.execCommand('copy');
                            document.body.removeChild(textarea);
                            layer.msg('链接复制成功');
                        }
                    });

                    $('.pusharia').click(function () {
                           //作废
                        if (!$(this).hasClass('layui-btn-disabled')) {
                            var url = $(this).attr('down-url');

                            sendAria2(url, $('.server_filename').text().replace("当前文件名:", ""));
                            // sendAria2(url, file_info_obj.server_filename);
                            layer.msg('推送成功');
                        }
                    });
                },
            });
        });


    });

    function set_parse_key(tabid, value) {
        // localStorage.my_password = value;
        // localStorage.my_password_end = get_endTime();
        localStorage['my_password_' + tabid] = value;
        localStorage['my_password_' + tabid + "_end"] = get_endTime();
    }
    function get_parse_key_value(tabid) {
        return localStorage['my_password_' + tabid];
    }
    function get_parse_key_time(tabid) {
        return localStorage['my_password_' + tabid + "_end"];
    }
    function set_dropdown_data() {
        dropdown_temp_data = config["workdata"][config.tab_id];
        dropdown_data = [];
        for (let o in dropdown_temp_data) {
            dropdown_data.push({
                title: dropdown_temp_data[o].filename,
                download_url: dropdown_temp_data[o].download_url,
                workid: dropdown_temp_data[o].workid,
                file_id: dropdown_temp_data[o].file_id,
                download_endtime: dropdown_temp_data[o].download_endtime,
                workstate: dropdown_temp_data[o].workstate,
                download_endtime_timestamp: dropdown_temp_data[o].download_endtime_timestamp,
            })
        }

        console.log(dropdown_data);
        return dropdown_data;
    }




    function formatBytes(a, b = 2) {
        if (0 === a) return "0 Bytes";
        const c = 0 > b ? 0 : b,
            d = Math.floor(Math.log(a) / Math.log(1024));
        return parseFloat((a / Math.pow(1024, d)).toFixed(c)) + " " + ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
    }
    function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
        if (time == undefined) return "--";
        time = Number(time + "000");
        var date = new Date(time);

        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
            return '0' + index;
        });

        var newTime = format.replace(/YY/g, year)
            .replace(/MM/g, preArr[month] || month)
            .replace(/DD/g, preArr[day] || day)
            .replace(/hh/g, preArr[hour] || hour)
            .replace(/mm/g, preArr[min] || min)
            .replace(/ss/g, preArr[sec] || sec);

        return newTime;
    }
    function get_endTime() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var on_30min = Number(new Date(year + "-" + month + "-" + day + " " + hours + ":30:00"));
        if (new Date().getTime() < on_30min) {
            result_time = on_30min;
        } else {
            result_time = on_30min + 30 * 60 * 1000;
        }
        return result_time;
    }

    function my_alert(text_value = "") {
        layui.layer.open({
            type: 1,
            title: false,
            closeBtn: 1,
            shadeClose: true,
            skin: 'yourclass',
            content: `
            <div style="border: 2px solid black;padding:30px 80px;word-wrap:break-word;">
                ${text_value}
            </div>`

        });
    }

    function sendAria2(url, out_filename, ua) {
           //作废
        var Aria2_config = {
            "jsonrpc": "2.0",
            "method": "aria2.addUri",
            "id": 1,
            "params": [
                [url],
                {
                    "header": [`User-Agent: ${config.ua}`],
                    "out": out_filename,
                    "dir": config.savePath,
                    "pause": "false",//是否暂停下载
                    "max-connection-per-server": "15",
                    "seed-ratio": "0",
                    "continue": 'true',
                    "user-agent": "LogStatistic"
                }]
        }
        $.ajax({
            url: config.jsonrpc,
            data: JSON.stringify(Aria2_config),
            type: "post",
            //async: false,//false为同步
            dataType: "json",
            success: function (obj) {
                console.log(obj)
            }
        });
    }

    function get_xuanzhe_list() {
        // return {
        //     "1051603260599775": {
        //         isdir: 0
        //     }
        // }
        var xuanzhe_list = {};
        var xuanxiang = [];

        try {
            xuanxiang = require('system-core:context/context.js').instanceForSystem.list.getSelected();
        } catch (e) {
            xuanxiang = document.querySelector('.wp-s-core-pan').__vue__.selectedList;
        }
        xuanxiang.forEach(element => {
            xuanzhe_list[element.fs_id] = element;
        });
        return xuanzhe_list;
    }


    function share_one_baidu() {
        let xuanzhe_list = Object.keys(get_xuanzhe_list());
        let bdstoken = "";
        let data_json = {};
        try {
            data_json = $("html").html().match(/(?<=locals\.mset\()(.*?)(?=\);)/)[0];
            data_json = JSON.parse(data_json);
            config.username = data_json.username;
            bdstoken = data_json.bdstoken;
        } catch (e) {
            data_json = $("html").html().match(/(?<=window\.locals\s=\s)(.*?)(?=;)/)[0];
            data_json = JSON.parse(data_json);
            config.username = data_json.userInfo.username;
            bdstoken = data_json.userInfo.bdstoken;
        }
        config.data_json = data_json;
        $.ajax({
            type: 'GET',
            url: "https://pan.baidu.com/share/set",
            async: true,
            data: {
                bdstoken: bdstoken,
                period: 1,
                pwd: config.bd_password,
                eflag_disable: true,
                channel_list: "%5B%5D",
                schannel: 4,
                fid_list: JSON.stringify(xuanzhe_list)
            },
            dataType: 'json',
            success: function (res) {
                console.log(res)
                if (res.show_msg.indexOf("禁止") > -1) {
                    layer.closeAll('loading');
                    my_alert("该文件禁止分享");
                    return false;
                } else {
                    let shorturl = "";
                    try {
                        shorturl = res.link.split("/").pop();
                    } catch (error) {
                        layer.closeAll('loading');
                        my_alert("错误:初始化准备失败！");
                        return false;
                    }
                    get_down_list(shorturl, config.bd_password);
                    layer.closeAll('loading');
                }

            },
            error: function (res) {
                my_alert("错误:初始化准备请求访问失败");
                layer.closeAll('loading');
            },
        })

    }


    function get_down_url() {
        //作废
        server_filename_dom = document.querySelector(`#tab${config.tab_id} .server_filename`);
        t_parsekey = server_filename_dom.getAttribute("parsekey");
        t_workid = server_filename_dom.getAttribute("workid");
        let down_url = `${config.main_url}/querywork.php?workid=${t_workid}&parsekey=${t_parsekey}&username=${config.username}`;
        $.ajax({
            url: down_url,
            method: 'GET',
            error: function (params) {
                console.error(2, params);
                my_alert("请重新解析尝试");
                layer.closeAll('loading');
            },
            success: function (json) {
                // json = JSON.parse(params);
                console.log(3, json);
                if (json.code == 0 && json.workstate == 2) {
                    // ddd = json.data;
                    // console.log("待下载文件详情", ddd);

                    // Size = formatBytes(ddd.filesize);
                    // Time = formatDate(ddd.filectime, 'YY/MM/DD hh:mm:ss');
                    config.ua = json.ua;
                    let downlink = json.download_url;
                    if (downlink.indexOf("http") >= 0) {

                        server_filename_dom = document.querySelector(`#tab${config.tab_id} .server_filename`)
                        for (let i of ['filename', 'workstate', "workid", "shorturl", "password", "parsekey", "creattime"]) { server_filename_dom.removeAttribute(i) }

                        layer.closeAll('loading');
                        my_alert("成功:解析成功");



                        $('.copy').removeClass('layui-btn-disabled').attr('down-url', downlink);
                        $('.pusharia').removeClass('layui-btn-disabled').attr('down-url', downlink);
                    } else {
                        layer.closeAll('loading');
                        my_alert("错误:下载链接解析异常【" + json.msg + "】");
                    }


                } else {
                    my_alert(json.msg + ",状态： " + json.workstate_msg);
                    layer.closeAll('loading');
                    return false;
                }
            }

        });

    }
    function get_all_down_url() {
        config["workdata"][config.tab_id] = [];
        config.dropdown.reloadData(`dropdown_tab${config.tab_id}`, { 'data': set_dropdown_data() })
        setdropdown_off_on(true);

        server_filename_dom = document.querySelector(`#tab${config.tab_id} .server_filename`);
        t_parsekey = server_filename_dom.getAttribute("parsekey");
        t_workid = server_filename_dom.getAttribute("workid");
        let down_url = `${config.main_url}/querywork_all.php?username=${config.username}`;
        config["workdata"][config.tab_id] = [];
        $.ajax({
            url: down_url,
            method: 'GET',
            error: function (params) {
                console.error(2, params);
                my_alert("请尝试重新查询");
                layer.closeAll('loading');
            },
            success: function (json) {
                // json = JSON.parse(params);
                console.log(3, json);
                if (json.code == 0) {
                    data_list = json.data;
                    config.ua = json.ua;
                    config["workdata"][config.tab_id] = [];
                    jiexi_ok_count = 0;

                    for (let obj of data_list) {
                        console.log(obj)
                        config["workdata"][config.tab_id].push(obj);
                        if (obj.code == 0 && obj.workstate == 2) {
                            downlink = obj.download_url;
                            if (downlink.indexOf("http") >= 0) {
                                jiexi_ok_count++;
                                // config["workdata"][config.tab_id].push(obj);
                            } else {
                                // my_alert("错误:下载链接解析异常【" + json.msg + "】");
                            }

                        }
                    }
                    layer.closeAll('loading');
                    setdropdown_off_on(false);
                    console.log("eeeee",config.tab_id,config["workdata"][config.tab_id])
                    config.dropdown.reloadData(`dropdown_tab${config.tab_id}`, { 'data': set_dropdown_data() })
                    my_alert("查询成功:已解析成功任务 " + jiexi_ok_count + " 个");


                } else {
                    my_alert("失败:" + json.msg);
                    layer.closeAll('loading');
                    return false;
                }

            },
        });

    }
    function get_down_list(shorturl, password) {
        let parse_key = get_parse_key_value(config.tab_id)
        let xuanzhe_list = Object.keys(get_xuanzhe_list());
        //let filename_text = document.querySelector(".server_filename").textContent;
        let filename_text = config.file_name;
        let url = `${config.main_url}/addwork.php`;
        $.ajax({
            type: 'POST',
            url: url,
            async: true,
            data: {
                "filename":encodeURIComponent(filename_text),
                "username":config.username,
                "baidu_fileid":xuanzhe_list[0],
                "size":config.file_size,
                "shorturl":shorturl,
                "password":password,
                "parsekey":parse_key,
            },
            dataType: 'json',
            success: function (res) {
                console.log(res)
                if (res.code == 0 || res.code == 13) {

                    req_data = res.data;
                    console.log(2, req_data);
                    server_filename_dom = document.querySelector(`#tab${config.tab_id} .server_filename`);
                    for (let i in req_data) {
                        if (i in ['filename', 'workstate']) {
                            continue;
                        }
                        server_filename_dom.setAttribute(i, req_data[i])
                    }
                    t = {
                        0: "任务创建完成",
                        13: "任务已存在请勿重复提交"
                    }
                    my_alert(`成功:${t[res.code]},任务id为:` + req_data["workid"]);

                } else {

                    if (res.code == 104) {
                        //重置密码
                        set_parse_key(config.tab_id, "")
                        layer.closeAll('loading');
                        my_alert("密码错误(可能密码超出有效期)，请重新提交");
                        return false;
                    } else {
                        my_alert("失败:" + res.msg);
                        layer.closeAll('loading');
                        return false;
                    }
                }
            },
            error: function (res) {
                my_alert("错误:初始解析请求访问失败，重新提交");
                layer.closeAll('loading');
            },
        });

    }
})()