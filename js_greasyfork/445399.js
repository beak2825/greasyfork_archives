// ==UserScript==
// @name         AB站网页背景更改2
// @description  更改ab站背景的懒人脚本，引用vue和jquery优化
// @icon         http://github.smiku.site/sakura.png
// @license      MIT
// @bilibili     https://space.bilibili.com/29058270
// @github       https://github.com/wuxintlh/
// @githubBoke   https://wuxintlh.github.io
// @acfun        https://www.acfun.cn/u/57391284
// @version      2.0.0.2-release
// @author       桜ミク
// @match        *www.bilibili.com/*
// @match        *://*.bilibili.com/*
// @match        *message.bilibili.com/*
// @match        *t.bilibili.com/*
// @match        *manga.bilibili.com/*
// @match        *live.bilibili.com/blackboard/*
// @match        *www.bilibili.com/page-proxy/*
// @match        *www.acfun.cn/*
// @match        *.acfun.cn/*
// @exclude      *live.bilibili.com/p/html/live-lottery/*
// @exclude      *message.bilibili.com/pages/nav/index_new_pc_sync*
// @exclude      *t.bilibili.com/pages/nav/index_new*
// @exclude      *member.bilibili.com/x2/creative/*
// @exclude      *member.bilibili.com/video/*
// @exclude      *ink.bilibili.com/p/center/course/index.html*
// @exclude      *www.bilibili.com/v/pay/charge*
// @exclude      *message.acfun.cn/*
// @exclude      *www.bilibili.com/bangumi*
// @exclude      *account.bilibili.com/account/*
// @exclude      *cm.bilibili.com/quests/*
// @exclude      *member.bilibili.com/platform*
// @exclude      *pay.bilibili.com/pay-v2-web*
// @QQgroup      793513923
// @QQgroup      https://jq.qq.com/?_wv=1027&k=0ewDiWw1
// @grant        none
// @require      https://greasyfork.org/scripts/445358-ab%E7%AB%99%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9css/code/ab%E7%AB%99%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9css.js?version=1053244
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js
// @namespace https://greasyfork.org/users/599643
// @downloadURL https://update.greasyfork.org/scripts/445399/AB%E7%AB%99%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B92.user.js
// @updateURL https://update.greasyfork.org/scripts/445399/AB%E7%AB%99%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B92.meta.js
// ==/UserScript==



//#region 初始化脚本运行
var screenHeight, bcurl, host, host_name, domain_name, ab_chosen, body, main, path_name, el_body;
var SakuraVue;
$("window").ready(function() {
    setTimeout(function() {
        //#region 初始化变量
        // try {
        bcurl = getBcurl();

        if (bcurl == null || bcurl == 'undefined') {
            bcurl = "https://img1.imgtp.com/2022/05/19/qqKLSTQo.png";
        }
        screenHeight = document.documentElement.clientHeight;
        domain_name = document.domain;
        host = window.location.host;
        path_name = window.location.pathname;
        body = $('body')[0];
        while (true) {
            if (domain_name.indexOf("bilibili") != -1) {
                ab_chosen = 0;
                break;
            } else if (domain_name.indexOf("acfun") != -1) {
                ab_chosen = 1;
                break;
            } else {
                console.error("背景脚本可能出现意料之外的错误,错误原因发生在匹配ab站");
                break;
            }
        }



        while (true) {
            if (ab_chosen == 0) {
                host = window.location.host;
                if (host == 'live.bilibili.com') {
                    host_name = 0;
                    el_body;
                    break;
                } else {
                    host_name = 1;
                    el_body;
                    break;
                }
            } else if (ab_chosen == 1) {
                host = window.location.host;
                var aUrl = document.location;
                if (aUrl.pathname == '\/') {
                    host_name = 0;
                    el_body;
                    break;
                } else {
                    host_name = 1;
                    el_body;
                    break;
                }
            } else {
                console.error("背景脚本可能出现意料之外的错误,错误原因发生在匹配域名的情况下");
                break;
            }
        }
        //#endregion


        //#region 打开网页时设置背景
        setTimeout(function() {
            setBackgroundImage(bcurl, ab_chosen)
        }, 3000);
        //#endregion

        //#region 初始化vue
        el_body = getElBody(ab_chosen);

        //设置背景更改的盒子
        setTimeout(function() {
            setBackgroundBox(el_body);
        }, 2000);


        var default_background_url = [
            ['https://i0.hdslb.com/bfs/article/d12fee446e2533206e0b04024c39e00a40c4bc4c.png@1320w_912h.webp',
                'https://i0.hdslb.com/bfs/article/54616fdbb9bed40ea2cf8540f8517b11c9aa4ad3.jpg@1320w_868h.webp',
                'https://img1.imgtp.com/2022/05/19/qqKLSTQo.png',
                'https://i0.hdslb.com/bfs/album/658ab52e2d631f9d974112e2d5b4cab476e3f61d.jpg',
                'https://i0.hdslb.com/bfs/vc/c255f51c594cf6e724fb9f04975fae7e7eb8b876.jpg@2000w_1e.webp',
                'https://w.wallhaven.cc/full/o3/wallhaven-o31p97.jpg'
            ],
            ['https://w.wallhaven.cc/full/g8/wallhaven-g8kd37.jpg',
                'https://img.tt98.com/d/file/96kaifa/201905101622281/001.jpg',
                'https://img.tt98.com/d/file/tt98/2019092618001803/001.jpg',
                'https://w.wallhaven.cc/full/g7/wallhaven-g79ov3.jpg',
                'https://w.wallhaven.cc/full/rd/wallhaven-rdyyjm.png',
                'https://w.wallhaven.cc/full/o3/wallhaven-o31p97.jpg'
            ]
        ];
        //初始化框架

        setTimeout(function() {
            $("window").ready(function() {
                el_body = "#sakuraBackgroundBox";
                SakuraVue = new Vue({
                    el: el_body,
                    data: {
                        default_url: default_background_url[ab_chosen]
                    },
                    methods: {
                        defaultBackgroundChange: function(src) {
                            //设置背景
                            setBackgroundImage(src, ab_chosen);
                            setBcurl(src);
                        },
                        diyBackgroundChange: function() {
                            if ($("#diyInput").val() == "" || $("#diyInput").val() == null) {
                                alert("请不要输入空值");
                                return null;
                            } else {
                                //设置背景
                                var src = $("#diyInput").val();
                                setBackgroundImage(src, ab_chosen);
                                setBcurl(src);
                            }
                        },
                        displayChangeBox: function() {
                            var changeBox = $(".ChangeBox")[0];
                            changeBox.style.display = changeBox.style.display == "none" ? "block" : "none";
                        },
                        diyBase64Change: function() {
                            var file = $("#base64Pic")[0].files[0];
                            var reader = new FileReader();
                            if (file) {
                                reader.readAsDataURL(file);
                                reader.onloadend = function() {
                                    // console.log(reader.result);
                                    setBackgroundImage(reader.result, ab_chosen);
                                }
                            } else {
                                alert("请上传一张图片");
                            }
                        }
                    },
                });
            });
        }, 3000);

        //#endregion

        // } catch (err) {
        //     console.error("背景程序出现致命错误，这样的错误发生在程序主体,此为报错信息：" + err);
        // }
        //#endregion

    }, 0)
});


//#region 封装代码


//获取bcurl
function getBcurl() {
    var bcurl = window.localStorage.getItem('bcurl');
    return bcurl;
}

function setBcurl(url) {
    window.localStorage.setItem('bcurl', url);
    return true;
}

//设置背景
function setBackgroundImage(url, ab_chosen) {
    var div, main, app, body = $("body")[0];
    setBcurl(url)
    if (ab_chosen == 0) {
        if ($("#app").length > 0) {
            app = $("#app")[0];
            app.style.background = 'url(' + url + ') center 0px/cover';
            app.style.backfroundRepeat = 'no-repeat';
            app.style.backgroundPosition = 'center center';
            app.style.backgroundSize = '100% 100%';
            app.style.zIndex = '-1';
            app.style.webkitBackgroundSize = 'cover';
            app.style.backgroundAttachment = "fixed";
        } else {
            if ($(".SakuraBackground").length > 0) {
                div = $(".SakuraBackground")[0];
            } else {
                div = document.createElement("div");
                body.appendChild(div);
            }
            div.style.background = 'url(' + url + ')';
            div.style.backfroundRepeat = 'no-repeat';
            div.style.position = 'fixed';
            div.style.backgroundPosition = 'center center';
            div.style.backgroundSize = 'cover';
            div.style.zoom = '1';
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.top = '0';
            div.style.left = '0';
            div.style.webkitBackgroundSize = 'cover';
            div.style.zIndex = '-1';
            div.className = 'SakuraBackground';
        }
    } else if (ab_chosen == 1) {
        if ($("#main").length > 0) {
            main = $("#main")[0];
            main.style.background = 'url(' + url + ') center 0px/cover';
            main.style.backfroundRepeat = 'no-repeat';
            main.style.backgroundPosition = 'center center';
            main.style.backgroundSize = '100% 100%';
            main.style.zIndex = '-1';
            main.style.webkitBackgroundSize = 'cover';
            main.style.backgroundAttachment = "fixed";
            main.className = 'SakuraBackground';
        } else {
            if ($(".SakuraBackground").length > 0) {
                div = $(".SakuraBackground")[0];
            } else {
                div = document.createElement("div");
                body.appendChild(div);
            }
            div.style.backgroundImage = 'url(' + url + ')';
            div.style.backfroundRepeat = 'no-repeat';
            div.style.position = 'fixed';
            div.style.backgroundPosition = 'center center';
            div.style.backgroundSize = 'cover';
            div.style.zoom = '1';
            div.style.width = '100%';
            div.style.height = '100%';
            div.style.top = '0';
            div.style.left = '0';
            div.style.webkitBackgroundSize = 'cover';
            div.style.zIndex = '-1';
            div.className = 'SakuraBackground';
        }
    }
}
//获取el
function getElBody(ab_chosen) {
    var el_body;
    if (ab_chosen == 0) {
        if ($("#app").length > 0) {
            el_body = "#app";
        } else {
            el_body = "body";
        }
    } else {
        if ($("#main").length > 0) {
            el_body = "#main";
        } else {
            el_body = "body";
        }
    }
    return el_body;
}
//在el下添加html
function setBackgroundBox(el_body) {
    var father_node = $(el_body)[0];
    var background_box = document.createElement("div");
    father_node.appendChild(background_box);
    background_box.innerHTML = `
    <button class="clickButton" v-on:click="displayChangeBox()">更改背景</button>
    <div class="ChangeBox">
        <h4>更改背景</h4>
        <div class="defaultBox">
            <img :src="default_url[0]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[0])">
            <img :src="default_url[1]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[1])">
            <img :src="default_url[2]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[2])">
            <img :src="default_url[3]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[3])">
            <img :src="default_url[4]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[4])">
            <img :src="default_url[5]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[5])">
        </div>
        <div class="diyBox">
            <input type="text" name="" id="diyInput" placeholder="请输入背景URL">
            <button id="diySubmit" v-on:click="diyBackgroundChange()" accept="image/png,image/webp">点击修改</button>
            <input type="file" name="" id="base64Pic">
            <button id="diySubmit" v-on:click="diyBase64Change()">点击修改</button>
        </div>
    </div>
    `;
    background_box.id = "sakuraBackgroundBox";
    console.log("sakuraBackgroundBox创建完毕");
}


//#endregion