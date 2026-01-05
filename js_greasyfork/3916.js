// ==UserScript==
// @name           osu! my download
// @description    osu beatmap download from mirror. osu beatmap镜像站下载。支持的镜像站点：inso.link、osu.sayobot.cn、osu.direct、nerinyan.moe。也可以自行添加。
// @author         dazzulay
// @version        2.5
// @license        GPLv3
// @icon           http://osu.ppy.sh/favicon.ico
// @match          http*://osu.ppy.sh/*
// @match          http*://old.ppy.sh/*
// @grant          GM_registerMenuCommand
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_addStyle
// @namespace      https://greasyfork.org/scripts/3916
// @homepageURL    https://greasyfork.org/scripts/3916
// @downloadURL https://update.greasyfork.org/scripts/3916/osu%21%20my%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/3916/osu%21%20my%20download.meta.js
// ==/UserScript==

(function () {
    function init() {
        const has_init = GM_getValue("has_init", null);
        if (has_init === null) {
            GM_setValue("mirros", {
                sayobot: {
                    url: 'https://osu.sayobot.cn/home?search={bmid}',
                    text: 'DOWNLOAD SAYOBOT',
                    class: 'my_green',
                    style: '',
                    target: '_blank'
                },
                insolink: {
                    url: 'https://inso.link/?source=osu_my_download&m={bmid}',
                    text: 'DOWNLOAD INSO.LINK',
                    class: 'my_pink',
                    style: '',
                    target: '_blank'
                },
                osu_direct: {
                    url: 'https://osu.direct/api/d/{bmid}',
                    text: 'DOWNLOAD OSU.DIRECT',
                    class: 'my_purpule',
                    style: '',
                    target: '_blank'
                },
                nerinyan: {
                    url: 'https://api.nerinyan.moe/d/{bmid}',
                    text: 'DOWNLOAD NERINYAN',
                    class: 'my_orange',
                    style: '',
                    target: '_blank'
                }
            });
            GM_setValue("has_init", 1);
        }
    }
    init()

    function settingBox() {
        // css样式 设置
        GM_addStyle(`
#my_setting_box{
    max-width: 800px;
    position: fixed;
    top: 100px;
    bottom: 100px;
    left: 0;
    right: 0;
    margin: auto;
    padding: 20px;
    display: flex;
    gap: 20px;
    flex-direction: column;
    background: #fff;
    color: #000;
}
#my_setting_mirros{
    flex: 1;
}
.my_setting_buttons{
    display: flex;
    gap: 20px;
    height: 50px;
}
.my_setting_buttons > *{
    display: block;
}
#my_setting_save{
    flex: 2;
}
#my_setting_reset{
    flex: 1;
}
#my_setting_cancel{
    flex: 1;
}
`);

        GM_registerMenuCommand("Setting", function () {
            if (!document.getElementById("my_setting_box")) {
                let mirros = GM_getValue("mirros");
                mirros = JSON.stringify(mirros, null, "\t");

                const boxHtml = `
<div id="my_setting_box" style="position: fixed; top:10%; left:10%; width:80%; height:80%; background: white; z-index: 99999; border: 1px solid #000; padding: 10px; overflow: auto;">
    <div style="font-weight: bold; margin-bottom: 10px;">osu! my download Setting</div>
    <textarea id="my_setting_mirros" style="width:100%; height:60%;">${mirros}</textarea>
    <div class="my_setting_buttons" style="margin-top:10px;">
        <button id="my_setting_save">保存 Save</button>
        <button id="my_setting_reset">重置 Reset</button>
        <button id="my_setting_cancel">取消 Cancel</button>
    </div>
</div>
`;
                document.body.insertAdjacentHTML('beforeend', boxHtml);

                const btnCancel = document.getElementById("my_setting_cancel");
                btnCancel.addEventListener('click', () => {
                    const box = document.getElementById("my_setting_box");
                    if (box) box.remove();
                });

                const btnReset = document.getElementById("my_setting_reset");
                btnReset.addEventListener('click', () => {
                    GM_setValue("has_init", null);
                    window.location.reload();
                });

                const btnSave = document.getElementById("my_setting_save");
                btnSave.addEventListener('click', () => {
                    try {
                        const val = document.getElementById("my_setting_mirros").value;
                        const parsed = JSON.parse(val);
                        GM_setValue("mirros", parsed);
                        window.location.reload();
                    } catch (e) {
                        alert("Error：" + e);
                    }
                });
            }
        });

    }
    settingBox()

    var domain = document.domain;
    var drive = domain.replace(/\./g, '_');

    function osu_my_downoad() {
        var self = this;
        this.mirros = GM_getValue("mirros")
        /*
            渲染mirro模板，返回渲染的字符串。暂时只渲染url的bmid
             */
        this.mirros_parse = function (bmid) {
            // 深拷贝 this.mirros
            const return_mirros = JSON.parse(JSON.stringify(self.mirros));
            const _param = 'url';
            Object.keys(return_mirros).forEach(function(k) {
                const v = return_mirros[k];
                if (v.hasOwnProperty(_param)) {
                    v[_param] = str_render(v[_param], { bmid: bmid });
                }
            });
            return return_mirros;
        };

        this.drives = {
            osu_ppy_sh: function () {
                // 判断 `.osu-layout` 元素是否存在
                const is_new = document.querySelectorAll('.osu-layout').length;

                if (is_new) {
                    // css样式 设置
                    GM_addStyle(`
.my_container .btn-osu-big__text-top {
white-space: normal;
}
.my_container .btn-osu-big{
position: relative;
}
.my_container .btn-osu-big__content{
position: relative;
}
.my_container a:before {
content: " ";
position: absolute;
left: 0;
right: 0;
top: 0;
bottom: 0;
border-radius: 4px;
}

.my_orange:before {
background-color: rgba(255,141,0,.5)
}

.my_green:before {
background-color: rgba(0,101,0,.5)
}

.my_pink:before {
background-color: rgba(255, 102, 170,.5)
}

.my_purpule:before {
background-color: rgba(169, 10, 165,0.5);
}
`);

                    function addButtons() {
                        // 如果已存在容器，则不再添加
                        if (document.querySelector('.my_container')) {
                            return;
                        }

                        // 获取 beatmap id
                        var audioElem = document.querySelector('.js-audio--play');
                        if (!audioElem) {
                            return false;
                        }
                        var bmsrc = audioElem.getAttribute('data-audio-url');
                        if (!bmsrc) {
                            return false;
                        }
                        var bmid = bmsrc.substring(bmsrc.lastIndexOf("/") + 1, bmsrc.lastIndexOf("."));

                        // 解析镜像／url
                        var parsed_mirros = self.mirros_parse(bmid);

                        // 创建按钮容器
                        var container = document.createElement('div');
                        container.className = 'my_container';

                        // 模板字符串
                        var btnTpl = '<a href="{url}" class="btn-osu-big btn-osu-big--beatmapset-header {class}" style="{style}" target="{target}">' +
                            '<div class="btn-osu-big__content">' +
                            '<div class="btn-osu-big__left">' +
                            '<span class="btn-osu-big__text-top">{text}</span>' +
                            '</div>' +
                            '<div class="btn-osu-big__icon"><span class="fa fa-download"></span></div>' +
                            '</div>' +
                            '</a>';

                        // 遍历 parsed_mirros，插入按钮
                        Object.keys(parsed_mirros).forEach(function(k) {
                            var v = parsed_mirros[k];
                            var html = str_render(btnTpl, v);
                            // 将 html 插入 DOM
                            container.insertAdjacentHTML('beforeend', html);
                        });

                        // 将容器添加到目标元素中
                        var headerButtons = document.querySelector('.beatmapset-header__buttons');
                        if (headerButtons) {
                            headerButtons.appendChild(container);
                        }
                    }

                    // 匹配你关心的 URL 模式
                    const beatmapsetUrlRegex = /^\/beatmapsets\/\d+/;

                    let lastPath = null;

                    // 当 URL 变化时触发
                    function checkUrlChange() {
                        const path = window.location.pathname;
                        if (path !== lastPath) {
                            lastPath = path;
                            if ( beatmapsetUrlRegex.test(path) ) {
                                // 匹配到目标 URL
                                onBeatmapsetPage();
                            }
                        }
                    }

                    // 目标页面触发后要做的事情
                    function onBeatmapsetPage() {
                        console.log("Detected beatmapset page:", window.location.href);

                        // 等待 .beatmapset-header__buttons 元素出现
                        waitForElement('.beatmapset-header__buttons', element => {
                            console.log(".beatmapset-header__buttons 已加载", element);
                            // 在这里执行你的自定义方法
                            // myCustomMethod(element);
                            addButtons();
                        });
                    }

                    // // 自定义方法（你需要修改这里）
                    // function myCustomMethod(buttonsElement) {
                    //     // 举例：在按钮区域插入一个提示
                    //     const tip = document.createElement('div');
                    //     tip.textContent = "自定义功能已激活！";
                    //     tip.style.color = "red";
                    //     tip.style.margin = "8px";
                    //     buttonsElement.parentElement.insertBefore(tip, buttonsElement);
                    // }

                    // 等待元素出现的通用函数（使用 MutationObserver）
                    function waitForElement(selector, callback) {
                        const el = document.querySelector(selector);
                        if (el) {
                            callback(el);
                            return;
                        }
                        const observer = new MutationObserver((mutations, obs) => {
                            const el2 = document.querySelector(selector);
                            if (el2) {
                                obs.disconnect();
                                callback(el2);
                            }
                        });
                        observer.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                    }

                    // 监听历史记录 API（pushState/replaceState）以捕捉 SPA 导航
                    (function(history) {
                        const pushState = history.pushState;
                        history.pushState = function(...args) {
                            const ret = pushState.apply(this, args);
                            checkUrlChange();
                            return ret;
                        };
                        const replaceState = history.replaceState;
                        history.replaceState = function(...args) {
                            const ret = replaceState.apply(this, args);
                            checkUrlChange();
                            return ret;
                        };
                    })(window.history);

                    // 监听 popstate（后退/前进）
                    window.addEventListener('popstate', () => {
                        checkUrlChange();
                    });

                    // 初次运行
                    checkUrlChange();

                } else {
                    // 获取beatmapid
                    var elem = document.querySelector('.bmt');
                    var bmsrc = elem ? elem.getAttribute('src') : null;
                    if (!bmsrc) {
                        return false;
                    }
                    var bmid = bmsrc.substring(bmsrc.indexOf("thumb/") + 6, bmsrc.lastIndexOf("l"));

                    // css样式 设置
                    GM_addStyle(`
.my_container {
position: fixed;
top: 20px;
right: 0px;
}

.my_btn {
text-align: center;
width: 150px;
height: 111px;
display: table-cell;
vertical-align: middle;
margin: 0 0 10px 0;
padding: 10px;
font-family: Haettenschweiler,Impact,"Arial Grande",Tahoma,Helvetica,Arial,sans-serif;
font-size: 32px;
font-weight: normal;
color: #fff;
border: 4px solid #fff;
border-radius: 6px;
}

.my_btn:hover {
text-shadow: 0 0 20px floralwhite;
color: #fff;
}

.my_btn span {
display: inline-block;
vertical-align: middle;
text-align: center
}

.my_orange {
background: linear-gradient(to bottom,darkorange,wheat,darkorange);
}

.my_blue {
background: linear-gradient(to bottom,darkblue,lightblue,darkblue);
}

.my_green {
background: linear-gradient(to bottom,darkgreen,lightgreen,darkgreen);
}

.my_pink {
background: linear-gradient(to bottom,HotPink,pink,HotPink);
}
.my_purpule {
background: linear-gradient(to bottom,#261326,#E064E0,#261326);
}
`);


                    // 设置url
                    var parsed_mirros = self.mirros_parse(bmid);

                    // 添加按钮
                    // 创建容器
                    var container = document.createElement('div');
                    container.className = 'my_container';

                    // 模板字符串
                    var btnTpl = '<a class="my_btn {class}" style="{style}" href="{url}" target="{target}"><span>{text}</span></a><br/>';

                    // 遍历 parsed_mirros 并插入按钮
                    Object.keys(parsed_mirros).forEach(function(k) {
                        var v = parsed_mirros[k];
                        var html = str_render(btnTpl, v);
                        // 将 html 插入 DOM
                        container.insertAdjacentHTML('beforeend', html);
                    });

                    // 把 container 插入 body
                    document.body.appendChild(container);
                }
            }
        };
        this.init = function () {
            // var domain = document.domain;
            // var drive = domain.replace(/\./g, '_');
            // self.drives[drive]();
            self.drives.osu_ppy_sh();
        };
        self.init();
    }
    osu_my_downoad();


    function str_render(template, context) {

        var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

        return template.replace(tokenReg, function (word, slash1, token, slash2) {
            if (slash1 || slash2) {
                return word.replace('\\', '');
            }

            var variables = token.replace(/\s/g, '').split('.');
            var currentObject = context;
            var i, length, variable;

            for (i = 0, length = variables.length; i < length; ++i) {
                variable = variables[i];
                currentObject = currentObject[variable];
                if (currentObject === undefined || currentObject === null) return '';
            }
            return currentObject;
        });
    }
})();