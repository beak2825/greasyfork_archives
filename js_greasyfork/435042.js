// ==UserScript==
// @name         为风车动漫添加弹幕功能
// @namespace    https://github.com/innnky
// @version      0.6
// @description  本脚本为风车动漫网站添加了弹幕功能，你可以发送弹幕并和所有人互动。本插件目前非常不完善，为一个js初学者随便写着玩玩的，弹幕服务器是廉价天翼云服务器1核2G 5M,并且采用flask做后端,性能比较垃圾。如果发弹幕的人多的话我会把弹幕数据上传到github作备份，所以不用担心数据丢失
// @author       innnky
// @match        https://www.dm530p.net/play/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @connect api.innky.xyz
// @license     GPL License
// @supportURL  https://github.com/innnky/fengche-danmu


// @downloadURL https://update.greasyfork.org/scripts/435042/%E4%B8%BA%E9%A3%8E%E8%BD%A6%E5%8A%A8%E6%BC%AB%E6%B7%BB%E5%8A%A0%E5%BC%B9%E5%B9%95%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/435042/%E4%B8%BA%E9%A3%8E%E8%BD%A6%E5%8A%A8%E6%BC%AB%E6%B7%BB%E5%8A%A0%E5%BC%B9%E5%B9%95%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //test
    //fuck
    //sss
    //sssss
    var f_final = function() {


        //·····················································································
        //·····················初始化 将元素添加到网页中·························
        // var box_html = "<div style='display:block;z-index:999;position:absolute; right:10px;top:80%; width:360px; height:40px;line-height:30px; background-color:#f50;color:#fff;text-align:center;font-size:16px;font-family:\"Microsoft YaHei\",\"微软雅黑\",STXihei,\"华文细黑\",Georgia,\"Times New Roman\",Arial,sans-serif;font-weight:bold'>请输入弹幕<input type=\"text\" id=\"danmu_text\" /><input id=\"send_danmu\" type=\"submit\" value=\"发送\" /></div>"

        var xxx = [' <div id=\'function_box\' style=\'display:block;z-index:999;position:absolute; right:10px;top:10PX; width:400px; height:40px;line-height:30px; text-align:center;font-size:16px;font-family:"Microsoft YaHei","微软雅黑",STXihei,"华文细黑",Georgia,"Times New Roman",Arial,sans-serif;font-weight:bold\'>',
            '        <div class="alert alert-primary" role="alert">',
            '            <div class="col-sm-12">',
            '                <div class="form-group row">',
            '                    <div class="col-sm-9">',
            '                    <input type="text" class="form-control" id="danmu_text" placeholder="请输入弹幕">',
            '                    </div>',
            '                    <button id="send_danmu" type="button" class="col-sm-3 btn btn-dark">发送</button>',
            '                    ',
            '                </div>',
            '            </div>',
            '            <div align="left" class="col-sm-12">',
            '                <h6 id="info">提示信息：正在获取弹幕，如果长时间未获取成功，请刷新或反馈bug</h6>',
            '            </div>',
            '        </div>',
            '    </div>'
        ].join("");
        var yyy = ['<div class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; right: 0; bottom: 0;">',
            '      <div id="liveToast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">',
            '        <div class="toast-header">',
            '          <strong id="h" class="mr-auto">Bootstrap</strong>',
            '          <!-- <small>11 mins ago</small> -->',
            '          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">',
            '            <span aria-hidden="true">&times;</span>',
            '          </button>',
            '        </div>',
            '        <div class="toast-body">',
            '          Hello, world! This is a toast message.',
            '        </div>',
            '      </div>',
            '    </div>',
            '    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>',
            '    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-fQybjgWLrvvRgtW6bFlB7jaZrFsaBXjsOMm/tB9LTS58ONXgqbR9W8oWht/amnpF" crossorigin="anonymous"></script>',
            '    '
        ].join("");
        // let zzz = ['<div id=\'setting\' style=\'display:block;z-index:999;position:absolute; left:10px;top:55PX; width:100; height:100px;line-height:30px; text-align:center;font-size:16px;\'><button id="setting_btn" type="button" class="btn btn-info">设置</button></div>',
        //     '<div id=\'setting_box\' style=\'display:block;z-index:999;position:absolute; left:80px;top:10PX; width:300px; height:40px;line-height:30px; text-align:center;font-size:16px;font-family:"Microsoft YaHei","微软雅黑",STXihei,"华文细黑",Georgia,"Times New Roman",Arial,sans-serif;font-weight:bold\'>',
        //     '        <div class="alert alert-primary" role="alert">',
        //     '            <div class="col-sm-12">',
        //     '                <div class="form-group row">',
        //     '                    <label for="formControlRange">弹幕速度</label>',
        //     '                    <input id="speed_ip" type="range" class="form-control-range" id="formControlRange">',
        //     '                    <label for="formControlRange">显示区域</label>',
        //     '                    <input id="display_ip" type="range" class="form-control-range" id="formControlRange">',
        //     '                    <label for="formControlRange">字号</label>',
        //     '                    <input id="fontsize_ip" type="range" class="form-control-range" id="formControlRange">',
        //     '                </div>',
        //     '            </div>',
        //     '        </div>',
        //     '    </div>'
        // ].join("");
        $('head').append('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn" crossorigin="anonymous">')
        $("body").append(xxx)
        $("body").append(yyy)
            // $("body").append(zzz)
            // $("#setting_box").hide()
        $("body").append('<script>var st = function(t) {$("#h").text("提示");$(".toast-body").text(t);$(".toast").toast("show");}</script>')
        $("body").append('<div id=\'hide\' style=\'display:block;z-index:999;position:absolute; left:10px;top:10PX; width:100; line-height:30px; text-align:center;font-size:16px;\'><button type="button" class="btn btn-info">Hide</button></div>')
            // $("#setting_btn").click(function() {
            //     if ($("#setting_box").css("display") == 'none') {
            //         $("#setting_box").show()
            //     } else {
            //         $("#setting_box").hide()

        //     }
        // });
        $('#hide').click(function() {
            if ($("#function_box").css("display") == 'none') {
                $("#function_box").show()
            } else {
                $("#function_box").hide()

            }
        });
        var set_info = function(c) {
            $("#info").text("提示信息：" + c);
        }
        var ttoast = function(t) {
                $("#h").text("提示")
                $(".toast-body").text(t)
                    // $('.toast').toast('show');
            }
            // $('body').append(box_html);


        var canvas = document.createElement("canvas");
        var container = document.createElement("div");
        //两个待解决的问题：1.页面缩放，显示区域问题
        //                2.跳转播放时弹幕显示方式。
        // bd = document.getElementById("i_cecream");
        //var bd= document.getElementsByTagName("body")[0];
        //var bdd =document.getElementsByClassName("area")[0];

        let ifg = document.getElementById("fc_playfram").contentWindow.document
        var bdd = ifg.querySelector("[class^=\"ckplayer\"]")
        if (bdd == null) {
            set_info("此播放源暂时未适配弹幕功能")
        }

        bdd.appendChild(container);

        container.appendChild(canvas);
        container.setAttribute("style", "width: inherit;height: 30%;position: absolute;top: 0px;z-index: 99999;")
        canvas.setAttribute("id", "danmu_canvas");
        canvas.setAttribute("style", "width: inherit;height: 100%;")

        //·····················································································
        //·····················获取和设置画布·························
        var font_size = 24;
        var row_size = 26;
        var dispaly_percentage = 0.3;
        var base_speed = 1.5;
        var context = canvas.getContext("2d");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        var dwidth = canvas.width;
        var dheight = canvas.height;
        var maxlen = Math.floor(dheight / row_size) - 1
        var cooling = new Array(maxlen).fill(0);
        var c_time = 200;
        //·····················································································
        //·····················定义函数和对象·························

        function generate_row() {
            let empty_rows = [];
            for (let i = 0; i < cooling.length; i++) {
                if (cooling[i] == 0) {
                    empty_rows.push(i);
                }
            }

            if (empty_rows.length != 0) {
                return empty_rows[Math.floor(empty_rows.length * Math.random())]
            } else {
                return -1
            }
        }
        var get_time = function() {
            let play_time = ifg.querySelector("[class^=\"timetext\"]");
            var tstr = play_time.innerText;
            var min = parseInt(tstr.substr(0, 2));
            var sec = parseInt(tstr.substr(3, 2));
            var t = min * 60 + sec;
            return t;
        }
        var is_pausing = function() {

            let is_playing_tag = ifg.querySelector("[data-title=\"点击播放\"]");
            let temp = is_playing_tag.getAttribute("style")
            return temp.slice(-3, -1) == 'ck'
        }
        var Barrage = function(obj) {
            this.x = dwidth;
            let maxrow = Math.floor(dheight / font_size) - 1;
            this.y = 0;
            this.moveX = -5;
            this.content = obj.content;
            this.time = obj.time;
            this.visable = false;
            this.draw = function() {
                if (this.visable) {
                    // console.log("1111111")
                    context.font = font_size + "px bold 黑体";
                    context.fillStyle = 'rgba(255,255,255,1)';
                    context.fillText(this.content, this.x, this.y);
                    // context.strokeStyle = "black";
                    // context.strokeText(this.content, this.x, this.y)
                }
            };
            this.update = function() {
                var test_v = 0;
                if (last_playtime <= this.time && precise_play_time > this.time) {
                    this.visable = true;

                    let r = generate_row();
                    if (r == -1) {
                        this.visable = false;
                    } else {
                        this.moveX = -base_speed * (1 + r / 13);
                        this.y = (1 + r) * row_size;
                        cooling[r] = this.content.length * row_size;
                    }
                    //
                }
                let tt = precise_play_time - this.time;
                if ((this.x + this.content.length * font_size < test_v) || tt < 0 || tt > (dwidth + this.content.length * font_size - test_v) / (-15 * this.moveX)) {
                    this.visable = false;

                }
                if (this.visable && is_playing) {
                    this.x += this.moveX;
                }

            };
            this.reset = function() {
                this.x = dwidth;
                this.visable = false;
            }
        };

        //·····················································································
        //·····················定义渲染函数·························
        function draw() {
            // canvas.width = canvas.clientWidth;
            // canvas.height = canvas.clientHeight;
            // console.log(precise_play_time+"  "+last_playtime);
            // console.log(x);
            // set_info(JSON.stringify(cooling))
            if (is_playing) {
                for (let i = 0; i < cooling.length; i++) {
                    if (cooling[i] > 0) {
                        cooling[i]--;
                    }
                }
            }
            // set_info(store[0].x)

            store.forEach(element => {

                element.update();

                element.draw();
            });

            last_playtime = precise_play_time;
        }
        var render = function() {

            context.clearRect(0, 0, canvas.width, canvas.height);
            draw();
            requestAnimationFrame(render);
        };


        //·····················································································
        //·····················定义监听函数·························
        var precise_play_time = 0.0;
        var is_playing;
        var time_handler = function(t) {
            precise_play_time = t;
            // console.log();
            is_playing = true;
        }
        var pause_handler = function() {
            is_playing = false;
        }
        var seekHandler = function(state, name) {
            store.forEach(element => {
                element.reset();
            });
            console.log('时间跳转状态：' + state, name);
        }
        var resize_handler = function() {
                // console.log("1111111111111")
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                dwidth = canvas.width;
                dheight = canvas.height;
                var maxlen = Math.floor(dheight / row_size) - 1
                cooling = new Array(maxlen).fill(0);

                store.forEach(element => {
                    element.reset();
                });
            }
            // $("#speed_ip").bind("input propertychange", function() {　　
            //     base_speed = parseInt($("#speed_ip").val()) / 70 + 0.8;
            //     cooling = new Array(maxlen).fill(0);
            //     store.forEach(element => {
            //         element.reset();
            //     });
            // });
            // // $("#display_ip").bind("input propertychange", function() {　　
            // //     base_speed = parseInt($("#speed_ip").val()) / 70 + 0.8;
            // //     cooling = new Array(maxlen).fill(0);
            // //     store.forEach(element => {
            // //         element.reset();
            // //     });
            // // });
            // $("#fontsize_ip").bind("input propertychange", function() {　　
            //     font_size = 20 * parseInt($("#fontsize_ip").val()) / 100 + 20;
            //     row_size = font_size + 2;
            //     var maxlen = Math.floor(dheight / row_size) - 1

        //     cooling = new Array(maxlen).fill(0);

        //     store.forEach(element => {
        //         element.reset();
        //     });
        // });

        document.getElementById("fc_playfram").contentWindow.player.addListener("time", time_handler);
        document.getElementById("fc_playfram").contentWindow.player.addListener("pause", pause_handler);
        document.getElementById("fc_playfram").contentWindow.player.addListener("seek", seekHandler);
        document.getElementById("fc_playfram").contentWindow.addEventListener('resize', resize_handler);



        //·····················································································
        //·····················使用假数据初始化弹幕列表·························
        var danmu_data = [{ content: "0s", time: 0 }, { content: "2s", time: 2 }, { content: "5s", time: 5 }, { content: "8s", time: 8 }, { content: "11s", time: 11 }, { content: "14s", time: 14 }];
        var last_playtime = 0;
        var store = [];
        var globale_danmu_data;
        var urlstr = window.location.pathname;
        var ss1 = urlstr.split("-");
        var aid = ss1[0].split('/')[2];
        var ep = ss1[2].split(".")[0];
        var source = ss1[1];
        var start_danmu = function() {
            globale_danmu_data.forEach(element => {
                store.push(new Barrage(element))
            });
            render()
        }
        var a = "";
        var x, y, z;
        GM_xmlhttpRequest({
            method: "get",
            // url: "http://127.0.0.1:5000/getdanmu?aid="+aid+"&ep="+ep+"&source="+source,
            url: "http://api.innky.xyz:5000/getdanmu?aid=" + aid + "&ep=" + ep + "&source=" + source,
            responseType: 'json',
            onload: function(res) {
                if (res.response.status != 0) {
                    set_info("请更新版本后使用或报告bug");
                    null.append(null);
                }
                globale_danmu_data = res.response.data;

                var meta_info = res.response.meta_info;
                var meta_str = ''
                meta_info.forEach(element => {
                        let temp = "列表" + (element.source + 1) + "···" + element.counts + "条 "

                        meta_str += temp;

                    })
                    // ttoast("aaaaaaaa")
                    // setTimeout(function() {
                    //     set_info("qian")
                    //     st("aaaaaaaaa")
                    //     set_info("hou")
                    // }, 4000)
                st("获取弹幕成功!!");
                // setTimeout('st("")', 2000)
                set_info("左上角可以隐藏此框。本集各播放列表对应弹幕数量如下(未显示说明当前无弹幕): " + meta_str);
                start_danmu()
            },
            onerror: function(err) {
                console.log('error')
                st("获取弹幕失败!!");

            }
        });
        let send = document.getElementById("send_danmu");

        send.onclick = function() {

            GM_xmlhttpRequest({
                method: "get",
                // url: "http://127.0.0.1:5000/senddanmu?time="+precise_play_time+"&content="+$("#danmu_text").val()+"&aid="+aid+"&ep="+ep+"&source="+source,
                url: "http://api.innky.xyz:5000/senddanmu?time=" + precise_play_time + "&content=" + $("#danmu_text").val() + "&aid=" + aid + "&ep=" + ep + "&source=" + source,
                responseType: 'json',
                onload: function(res) {
                    let newb = new Barrage({ content: $("#danmu_text").val(), time: precise_play_time });
                    newb.visable = true;
                    store.push(newb);
                    $("#danmu_text").val("")
                    st("发送弹幕成功！")

                },
                onerror: function(err) {
                    console.log('error')
                    $("#danmu_text").val("")
                    st("发送弹幕失败！")

                }
            });

        };
        $("#danmu_text").keydown(function(event) { //给input绑定一个键盘点击事件
            event = event || window.event;
            if (event.keyCode == 13) { //判断点的是否是回车键
                $("#send_danmu").click(); //程序式点击了搜索按钮
            }

        });
    }

    document.getElementById("fc_playfram").onload = f_final;


})();