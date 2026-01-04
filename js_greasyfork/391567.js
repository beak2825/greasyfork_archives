// ==UserScript==
// @name            各站点优化和自动任务(自用)
// @description     自用的
// @homepage        https://greasyfork.org/zh-CN/scripts/391567
// @namespace       9h6ugailxn2zpbwemf15v4st0crodj78
// @author          ejin
// @match           *://*/*
// @version         2025.12.24
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/391567/%E5%90%84%E7%AB%99%E7%82%B9%E4%BC%98%E5%8C%96%E5%92%8C%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/391567/%E5%90%84%E7%AB%99%E7%82%B9%E4%BC%98%E5%8C%96%E5%92%8C%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

//主线
(function () {
    //Google首页优化
    if (location.hostname.indexOf("www.google.") != -1 && (location.pathname == "/" || location.pathname == "/webhp")) {
        //如是英文首页，切换为中文
        setTimeout(() => {
            if (document.querySelector("html").getAttribute("lang").indexOf("en") === 0) {
                location.href = "?hl=zh-cn"
            }
        }, 300);
        //首页优化
        googleindex();
    }//结束，Google首页优化

    //百度首页优化
    if (location.href == "https://www.baidu.com/" || location.href.indexOf("https://www.baidu.com/?tn=") != -1) {
        baiduindex();
    }//结束，百度首页优化

    // V2EX用户信息页面显示隐藏的主题
    if (inurl("v2ex.com/member/")) {
        // 个人信息信息页面首页
        if (location.href.split("/member/")[1].indexOf("/") == -1) {
            // 个人信息信息页面首页
            v2ex_userinfo_topic();
        }
    }

    //跳转页，快速通过
    redirectpage();
    //结束，跳转页，快速通过

    //qq邮箱优化，展开自定义文件夹
    if (inurl("https://wx.mail.qq.com/home")) {
        qqmail();
    }//结束，qq邮箱优化

    //哔哩哔哩去除自动连播
    if (inurl("https://www.bilibili.com/video/")) {
        (() => {
            var timerid = setInterval(() => {
                if (document.querySelector(".continuous-btn").innerHTML.indexOf(`class="switch-btn on"`) != -1) {
                    document.querySelector(".continuous-btn").click();
                    setTimeout(() => {
                        if (document.querySelector(".continuous-btn").innerHTML.indexOf(`class="switch-btn"`) != -1) {
                            clearInterval(timerid);
                        }
                    }, 500);
                }
            }, 2000);
        })();
    }//结束，哔哩哔哩去除自动连播

    //github优化
    if(location.hostname === "github.com"){
        //github 首页的左侧，会出现自己参与过的项目，太碍眼，去掉别人的仓库
        setInterval(() => {
            if(location.pathname === "/"){
                if(document.querySelector("ul[data-filterable-for=dashboard-repos-filter-left]:not([check])")){
                    document.querySelectorAll("ul[data-filterable-for=dashboard-repos-filter-left] li").forEach(ele=>{if(ele.innerHTML.indexOf("/ejin/") == -1){ele.remove()}});
                    document.querySelector("ul[data-filterable-for=dashboard-repos-filter-left]").setAttribute("check","1");
                }
            }
        }, 2000); //结束首页优化
    }//结束 github优化
    

    //V2 imgur图床优化
    if (inurl("v2ex.com/t/")) {
        imgur_proxy();
    }//结束，V2 imgur图床优化

    //jb51 取消防代码复制
    if (inurl("jb51.net/")) {
        document.querySelectorAll(".jb51code").forEach(ele => { ele.className = "" });
    }
    //结束，jb51 取消防代码复制

    //鼠窝管理面板首页
    if ((inurl("vhost/?c=session&a=loginForm") || inurl("vhost/index.php?c=session&a=loginForm"))
        && document.body.background.indexOf("sinaimg.cn") != -1) {
        loadCssFile("https://ajax.aspnetcdn.com/ajax/bootstrap/3.4.0/css/bootstrap.min.css");
        document.body.background = shuwoimglink();
    }//end 鼠窝管理面板首页
    //鼠窝数据库PMA链接改为HTTPS
    if (inurl("shuwo.x2009.net/vhost/")) {
        document.querySelectorAll("a[href*=':3313']")
            .forEach(ele => {
                if (ele.href.indexOf("/mysql/?pma_username=ejin") != -1) {
                    ele.href = "https://shuwosql.x2009.net/mysql/db_structure.php?server=1&db=ejin"; //数据表列表
                } else {
                    ele.href = "https://shuwosql.x2009.net" + ele.href.split(":3313")[1]; //替换为https链接
                }
            }
            );
    } //end PMA链接优化结束
    //文件编辑器优化
    if (inurl("shuwo.x2009.net/vhost/") && inurl("c=webftp")) {
        //修正地址栏网址，操作文件返回文件夹后，遗留操作信息
        if (document.querySelector("#location") && document.querySelector("#location > a:last-child").href !== location.href) {
            if (location.href.indexOf("a=enter") === -1) {
                history.replaceState({}, "", document.querySelector("#location > a:last-child").href);
            }
        }
        //end 修正地址栏

        //定时任务
        setInterval(() => {
            //文本编辑器的大小对小屏幕不友好，改成和页面高度一致，页面在大小变化时会自动伸缩，是面板自带的不用管。
            if (document.querySelector(`#editfile:not([checked="1"])`)) {
                document.querySelector(`#editfile:not([checked="1"])`).querySelector("textarea").style.height = document.documentElement.clientHeight - 120 + "px";
            }
        }, 1000);
    }// end文件编辑器优化
    //结束，鼠窝管理面板首页

    //微信公众号文章，阅读原文链接显示真实网址
    if (inurl("https://mp.weixin.qq.com/s/")) {
        setTimeout(() => {
            if (document.getElementById("js_view_source")) {
                document.getElementById("js_view_source").innerHTML += "(" + window.msg_source_url + ")";
            }
        }, 500);
    }

    //签到
    if (inurl("plugin.php?id=k_misign:sign") || inurl("k_misign-sign.html")) {
        qd1();
    } else if (inurl("plugin.php?id=dsu_paulsign:sign")) {
        qd2();
    }
    // 结束，签到

    //标题修复，防止离开页面后标题被修改
    titletool_init();
    titletool_run();
    // 结束，标题修复
})();
//主线结束，下方定义函数

function titletool_run() {
    titletool.startfunid = setInterval(() => {
        if (titletool.isdisplay()) {
            if (titletool.titlearr.length == 0) {
                if (document.title != "") {
                    titletool.titlearr.push(document.title);
                }
            } else {
                if (document.title != titletool.titlearr[titletool.titlearr.length - 1]) {
                    titletool.titlearr.push(document.title);
                }
            }
        } else {
            clearInterval(titletool.startfunid);
        }
    }, 1000);
    // 在页面可见性发生变化时检查/修复
    document.addEventListener(titletool.visibilityChange, function () {
        if (titletool.isdisplay()) {
            // 页面变化为可见时
            clearTimeout(titletool.intimerid); // 防止重复执行
            titletool.intimerid = setTimeout(() => {
                if (titletool.isdisplay()) {
                    titletool.titlearr.push(document.title);
                }
            }, 2000);

        } else {
            // 页面变化为不可见时
            clearInterval(titletool.startfunid); //清理首次执行，避免
            clearTimeout(titletool.intimerid); // 防止重复执行
            titletool.outtimerid = setTimeout(() => {
                //再次确认窗口是否还是不可见，且页面有标题
                if (!titletool.ishidden() || document.title == "") {
                    return;
                }
                //当前标题和上次离开后的标题一样，且已经记录了2+次的可见标题记录
                if (titletool.titleout = document.title) {
                    if (titletool.titlearr.length > 2) {
                        //当前标题与最近的可见时的标题不一样（看来可见标题要持续记录）
                        if (document.title != titletool.titlearr[titletool.titlearr.length - 1] &&
                            titletool.titlearr[titletool.titlearr.length - 1] ==
                            titletool.titlearr[titletool.titlearr.length - 2]) {
                            document.title = titletool.titlearr[titletool.titlearr.length - 1];
                            console.log(new Date()
                                .getHours() + ":" + new Date()
                                    .getMinutes() + ":" + new Date()
                                        .getSeconds() +
                                ' ' + '窗口不可见时标题被修改，已修正');
                        }

                    }
                }
                titletool.titleout = document.title;
            }, 2000);
        }
    }, false);
}

function titletool_init() {
    window.titletool = {};
    titletool.intimerid = 0;
    titletool.outtimerid = 0;
    titletool.titlearr = [];
    titletool.titleout = "";

    if (typeof document.hidden !== "undefined") {
        titletool.hiddenname = "hidden";
        titletool.visibilityChange = "visibilitychange";
    } else if (typeof document.mozHidden !== "undefined") {
        titletool.hiddenname = "mozHidden";
        titletool.visibilityChange = "mozvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        titletool.hiddenname = "msHidden";
        titletool.visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        titletool.hiddenname = "webkitHidden";
        titletool.visibilityChange = "webkitvisibilitychange";
    }
    titletool.windowhidden = () => document[titletool.hiddenname];
    titletool.isdisplay = () => !document[titletool.hiddenname];
    titletool.ishidden = () => document[titletool.hiddenname];
}



function inurl(url) {
    if (location.href.indexOf(url) != -1) {
        return true;
    } else {
        return false;
    }
}

function starturl(url) {
    if (location.href.indexOf(url) == 0) {
        return true;
    } else {
        return false;
    }
}

function qd1() { // 例子：https://www.mydigit.cn/k_misign-sign.html
    setTimeout(() => {
        if (document.getElementById('JD_sign') &&
            document.getElementById('JD_sign')
                .href.indexOf('action=login') == -1) {
            // 只有1个链接进行签到，但如果没有登录的话会指向登录页
            document.getElementById('JD_sign')
                .click();
        }
    }, 1);

}

function qd2() { // 例子：https://bbs.sunwy.org/plugin.php?id=dsu_paulsign:sign
    setTimeout(() => {
        if (document.getElementById("kx") && document.getElementById("ng")) {
            //版本5.3，会有li元素选择表情，例如id是kx和ng是开心和难过
            document.getElementById("kx")
                .click();
            document.querySelector('input[name="qdmode"][value="3"]')
                .click();
            document.querySelector('form[id="qiandao"]')
                .submit();
        }
    }, 1)
}

function googleindex() {
    // 去除推荐Chrome
    ((setInterval_index, timecount = 20) => {
        setInterval_index = setInterval(() => {

            if (location.pathname == "/" || location.pathname == "/webhp") {//点搜索后URL会改变，就可以不必处理了
                if (document.body.innerHTML.indexOf("不感兴趣") != -1) {
                    document.querySelectorAll("div[role=button]").forEach((ele) => {
                        if (ele.innerText == "不感兴趣") {
                            ele.click();
                            console.log("改用Chrome的提示,已不感兴趣");
                            clearInterval(setInterval_index);
                        }
                    });
                }
            } else {
                clearInterval(setInterval_index);
            }

            ; timecount == 10 ? clearInterval(setInterval_index) : timecount++;
        }, 300);
    })();
    //

    //删除异常元素（lastpass）
    //setInterval(() => {
    //	if(location.pathname=="/" && document.querySelector("div[data-lastpass-root]")){
    //		document.querySelector("div[data-lastpass-root]").remove();
    //		// 删除错误的元素
    //	}
    //}, 1000);

    // 同意Cookie告知窗
    ((setInterval_index, timecount = 20) => {
        setInterval_index = setInterval(() => {

            if (location.pathname == "/") {
                document.querySelectorAll("button").forEach((ele) => {
                    if (ele.innerText == "全部接受") {
                        ele.click();
                        console.log("已同意Cookie告知窗");
                        clearInterval(setInterval_index);
                    }
                });
            } else {
                clearInterval(setInterval_index);
            }

            ; timecount == 10 ? clearInterval(setInterval_index) : timecount++;
        }, 300);
    })(); //300是循环间隔毫秒数
}

function baiduindex() {
    var timercount;
    var timerid = setInterval(() => {
        timercount++;
        if (timercount > 20) {
            clearInterval(timerid);
        }
        if (document.querySelector("#hotsearch-content-wrapper")) {
            document.querySelector("#hotsearch-content-wrapper")
                .style.display = "none";
            document.querySelector(".s-hotsearch-title")
                .style.display = "none";
        }
        clearInterval(timerid);
    }, 300);

    ((timeindex, timecount = 1) => {
        timeindex = setInterval(() => {
            if (document.getElementsByName("tn").length == 1) {
                document.getElementsByName("tn")[0] = 'baiduhome_pg';
                timestop();
            }

            if (timecount == 20) { timestop(); }
            timecount++
        }, 300);
        function timestop() {
            clearInterval(timeindex);
        }
    })();

    if (location.href.indexOf("https://www.baidu.com/?tn=") != -1) {
        history.replaceState({}, "", '/')
    }
}

function imgur_proxy() {
    if (document.querySelector(".topic_buttons") && document.querySelector("img[src*=imgur]")) {
        document.querySelector(".topic_buttons").innerHTML += " <a id=imgurlink href=javascript:; class=tb>imgur Porxy</a>";
        document.querySelector("#imgurlink").innerHTML += "(" + document.querySelectorAll("img[src*=imgur]").length + ")";

        document.querySelector("#imgurlink").onclick = () => {
            document.querySelectorAll("img[src*=imgur]").forEach(ele => {
                ele.src = "https://ejin.alwaysdata.net/downimg.php?url="
                    + ele.src.replace(/&/g, "{and}").replace(/\./g, "{dot}").split("").reverse().join("`");

                ele.parentElement.href = ele.src;
            });
            document.querySelector("#imgurlink").style.display = "none";
        }
    }
}

function loadCssFile(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

function shuwoimglink() {
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAQABgDABEAAREBAhEB/8QAFwABAAMAAAAAAAAAAAAAAAAABAEDCv/EACEQAAMBAQACAQUBAAAAAAAAAAECAwUEEhMUABEVIiMh/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwAAARECEQA/AN0vNxcnwczwzclm/EZvRQ2zM9qVY8XLW1aVry3pT2lqq9mZPGhUsf8ACzhCcPJ84A53DVly+6qSGJnTX2fkcWc6HmTn/syyrRfu6s05vVI2WrXCAkcfH9nY5eWC7lOdHyMiRaY8m9lC3KTN/WGYMUaIaFVK+VoL9AW/NnO2fP4Gd/bSx0dY5WaoeT6nFOho8uRHlC8yQ0/a5PtPPT2o9FkCH4uYlymbkBS7S/XGy2dHKq6gSbkP7IVojq928UdakMs2LBTzcXEF73GbxWYadphzi5zqipk47yn6vjleaZ6LOxVRMn2Xas16XJQP/9k=";
}

function qqmail() {
    ((timeindex, timecount = 1) => {
        timeindex = setInterval(() => {
            if (document.querySelector(".sidebar-folder-menu-icon")) {//左侧第一个文件夹图标
                if (document.querySelector(".sidebar-folder-menu-icon").parentElement.innerHTML.indexOf("我的文件夹") != -1) {
                    //展开“我的文件夹”
                    if (document.querySelector(".sidebar-folder-menu-icon").parentElement.querySelector(".frame-sidebar-menu-left-btn").className.indexOf("sidebar-menu-left-btn-expand") == -1) {
                        document.querySelector(".sidebar-folder-menu-icon").parentElement.querySelector(".frame-sidebar-menu-left-btn").click();
                    }
                    //延迟点击“Gmail”
                    setTimeout(() => {
                        document.querySelectorAll(".sidebar-menu-text").forEach(ele => {
                            if (ele.innerHTML == "Gmail") {
                                ele.click();
                            }
                        });
                    }, 500);
                    //去除左侧功能链接的红色圆点
                    document.querySelectorAll(".sidebar-menu-red-dot").forEach(ele => ele.remove());//去除左侧功能链接的红色圆点
                    //结束
                    clearInterval(timeindex);
                    return;
                }
            }

            if (timecount == 40) { clearInterval(timeindex); }
            timecount++;
        }, 500);
    })();
}

function redirectpage() {
    //跳转页，快速通过,清空HTML是避免目标站很慢一直要看着跳转页
    //hellogithub
    if (inurl("https://hellogithub.com/periodical/statistics/click?target=")) {
        document.body.innerHTML = "";
        location.href = new URL(location.href).searchParams.get('target');
    }
    //PHPwind、Discuz打印页面跳转到正常页面
    if (inurl("/simple/?t") || inurl("/archiver/tid-") || inurl("/archiver/?tid-")) {
        if (document.getElementsByTagName("a")[0].href.indexOf("read.php?tid=") != -1) {
            location.href = document.getElementsByTagName("a")[0].href;
        }
        if (document.body.innerHTML.indexOf("id=\"end\"") != -1 && document.getElementById("end").innerHTML.indexOf("thread") != -1) {
            location.href = document.getElementById("end").getElementsByTagName("a")[0].href;
        }
        if (document.body.innerHTML.indexOf("id=\"footer\"") != -1 && document.getElementById("footer").innerHTML.indexOf("thread") != -1) {
            location.href = document.getElementById("footer").getElementsByTagName("a")[0].href;
        }
    }
}

function v2ex_userinfo_topic() {
    if (document.body.innerHTML.indexOf("主题列表被隐藏") == -1) {
        return;
    }
    var rssurl = "https://www.v2ex.com/feed/member/" + document.querySelector("h1").innerText + ".xml";
    var topiclist_ele = document.querySelector(".topic_content");
    topiclist_ele.innerHTML = "<div>用户隐藏主题列表，以下来自RSS</div>";//清空文本
    topiclist_ele.children[0].style.borderBottom = '1px solid #ccc';

    fetch(rssurl)
        .then(response => response.text())
        .then(data => {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(data, 'application/xml');

            xmlDoc.querySelectorAll('entry').forEach(entry => {
                var date = new Date(new Date(entry.querySelector('published').textContent).getTime() + 8 * 60 * 60 * 1000).toISOString().split('T')[0];
                //var date=new Date(new Date('2024-12-30T08:35:03Z').getTime() + 8 * 60 * 60 * 1000).toISOString();

                var title = entry.querySelector('title').textContent + "(" + date + ")";

                var link = entry.querySelector('link').getAttribute('href');

                var a = document.createElement('a');
                a.href = link;
                a.textContent = title;

                var br = document.createElement('br');

                topiclist_ele.appendChild(a);
                topiclist_ele.appendChild(br);
            });
        })
    //end fetch
}