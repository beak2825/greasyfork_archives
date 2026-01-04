// ==UserScript==
// @name         JavBus论坛移动端界面适配kokoa改
// @namespace    https://github.com/Steven-Fake/JavBus-forum-mobile-layout
// @homepageURL  https://sleazyfork.org/zh-CN/users/1140711-steven-fake
// @version      1.1.9
// @license      MIT
// @description  使司机社(JavBus)的论坛适应移动端界面
// @author       Steven-Fake
// @icon         https://www.javbus.com/favicon.ico
// @match        https://www.javbus.com/forum*
// @match        https://www.javsee.art/forum*
 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484224/JavBus%E8%AE%BA%E5%9D%9B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%95%8C%E9%9D%A2%E9%80%82%E9%85%8Dkokoa%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/484224/JavBus%E8%AE%BA%E5%9D%9B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%95%8C%E9%9D%A2%E9%80%82%E9%85%8Dkokoa%E6%94%B9.meta.js
// ==/UserScript==

(function () {
    // 使用adjust变量来判断是否需要调整为移动端布局，并添加监听事件
    const adjust = window.innerHeight > window.innerWidth && window.innerWidth < 1600;
    if (adjust) {
        console.log("JavBus论坛移动端界面适配v1.1.1: 启用移动端布局");
        const pageType = ((url) => {
            if (url.includes("tid=")) {
                return "post";
            } else if (url.includes("uid=")) {
                return "profile";
            } else if (url.includes("action=login")) {
                return "login";
            } else if (url.includes("search.php")) {
                return "search";
            } else {
                return "index";
            }
        })(window.location.href);

        /* 注入自适应调整的meta标签 */
        const appendMeta = document.createElement("meta");
        appendMeta.name = "viewport";
        appendMeta.content = "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no";
        document.head.appendChild(appendMeta);

        /* 调整无用元素
        * 1. 移除顶部广告
        * 2. 删除本就隐藏的元素
        * */
        if (pageType !== "search") {
            try {
                //1.移除顶部广告
                document.getElementsByClassName("bcpic2")[0].remove();
            } catch (e) {
                console.log("JavBus论坛移动端界面适配v1.1.1: 尝试移除顶部广告时出错。");
            }
            try {
                //2.删除本就隐藏的元素
                document.getElementById("myprompt_menu").remove();
                document.getElementById("myitem_menu").remove();
                document.getElementById("qmenu_menu").remove();
                document.getElementsByClassName("wp cl")[0].remove();
            } catch (e) {
                console.log("JavBus论坛移动端界面适配v1.1.1: 尝试删除无用元素时出错。");
            }
        }

        /* 调整顶栏
        * 1. 删除logo
        * 2. 调整导航栏样式
        * 3. 调整搜索框样式
        * 4. 清除顶栏的无用元素
        * 5. 将个人信息按钮移动到nav中
        * 6. 隐藏ID
        * */
        if (pageType !== "search") {
            //1. 删除logo
            document.getElementsByClassName("jav-logo")[0].remove();
            //2. 调整导航栏样式
            const nav = document.getElementById("toptb");
            nav.style.cssText = "width: 100%; min-width: 0; padding: 0;";
            nav.children[0].style.cssText = "width: 100%; padding: 0; margin: 0;";
            nav.children[0].children[0].style.cssText = "width: 100%; padding: 0; margin: 0;";
            //3. 调整搜索框样式
            const search_div = document.getElementsByClassName("jav-form-group")[0];
            search_div.style.cssText = "width: 35%; min-width: 0;";//调整宽度
            search_div.children[0].style.cssText = "width: 50%; margin-left: 5%;";//调整宽度
            search_div.children[1].style.cssText = "width: 35%; min-width: 50px; margin-right: 0;";//调整宽度
            search_div.outerHTML = '<li>' + search_div.outerHTML + '</li>';
            //4. 清除顶栏的无用元素
            document.querySelectorAll('.nav-title.nav-inactive').forEach(function (e) {
                e.remove();
            });
            //5.将个人信息按钮移动到nav中
            const info_li = document.createElement("li");
            info_li.appendChild(document.getElementsByClassName("login-wrap y")[0]);
            nav.getElementsByClassName("z")[0].children[0].appendChild(info_li);
            //6.隐藏ID
            document.getElementsByClassName("member-name")[0].remove();

            /*调整主要内容
            * 1. 调整主内容的布局
            * 2. 删除层级导航栏
            * */
            //1.调整主内容的布局
            const main_wrapper_div = document.getElementById("wp");
            main_wrapper_div.style.cssText = "width: 100%; min-width: 0; padding: 0;";
            const main_div = document.getElementsByClassName("mn")[0];
            main_div.style.cssText = "width: 130%; min-width: 0; padding: 0;";
            //2.删除层级导航栏
            if (pageType === "post") {
                document.getElementById("pt").children[0].remove();
            } else if (pageType === "index") {
                document.getElementById("pt").children[1].remove();
                document.getElementById("chart").children[1].style.float = "left";//调整部分选项为右浮动
            }

            //轮播图片框和帖子推荐列表
            if (pageType === "index") {
                const carousel_div = main_div.firstElementChild;
                //调整宽度
                carousel_div.style.cssText = "width: 100%; min-width: 0; padding: 0; height: auto;";
                //调整轮播图片框
                carousel_div.children[0].style.cssText = "float: none; width: 100%; height: auto;";
                //调整轮播图片框右侧的div
                carousel_div.children[1].style.cssText = "margin: 0; margin-top: 10px; width: 100%; height: auto;";
                //帖子推荐列表
                const post_list_div = document.getElementsByClassName("sideMenu");
                for (let i = 0; i < post_list_div.length; i++) {
                    let sideMenu = post_list_div[i];
                    for (let j = 0; j < sideMenu.childElementCount; j++) {
                        sideMenu.children[j].style.width = "100%";
                        sideMenu.children[j].firstChild.remove(); //删除发帖用户的名称
                    }
                }
                //两个分区板块
                const comprehensive_tbody = document.getElementsByClassName("fl_tb")[0].firstElementChild;
                const welfare_tbody = document.getElementsByClassName("fl_tb")[1].firstElementChild;
                for (let i = 0; i < comprehensive_tbody.childElementCount; i++) {//调整“综合交流区”布局
                    let area_tr = comprehensive_tbody.children[i]; //分区(tr)
                    for (let j = 0; j < area_tr.childElementCount; j++) {
                        let area_td = area_tr.children[j]; //分区的各项描述信息td
                        if (j !== 0 && j !== 1) {//j=0是分区的图标,j=1是其他信息的目标td
                            area_tr.children[1].innerHTML += area_td.outerHTML;
                            area_td.style.display = "none";
                        }
                    }
                }
                for (let i = 0; i < welfare_tbody.childElementCount; i++) {//调整“福利讨论分区”布局
                    let area_tr = welfare_tbody.children[i]; //分区(tr)
                    for (let j = 0; j < area_tr.childElementCount; j++) {
                        let area_td = area_tr.children[j]; //分区的各项描述信息td
                        if (j !== 0 && j !== 1) {//j=0是分区的图标,j=1是其他信息的目标td
                            area_tr.children[1].innerHTML += area_td.outerHTML;
                            area_td.style.display = "none";
                        }
                    }
                }
            }
        }

        // 调整帖子和回复中的图片尺寸，缩小post_avatar
        if (pageType === "post") {
            let post_td = document.getElementsByClassName("t_f");
            for (let i = 0; i < post_td.length; i++) {
                let imgs = post_td[i].getElementsByTagName("img");
                for (let j = 0; j < imgs.length; j++) {
                    if (!imgs[j].src.includes("/static/image/smiley/")) {//不调整表情图片
                        imgs[j].style.cssText = "width: 70%; height: auto;";
                    }
                }
            }

            // 缩小post_avatar
            let postAvatarDivs = document.getElementsByClassName("post_avatar");
            for (let i = 0; i < postAvatarDivs.length; i++) {
                postAvatarDivs[i].style.cssText = "width: 10%; height: auto;";
            }
        }

        //调整个人信息页的发帖表格布局
        if (pageType === "profile") {
            document.querySelectorAll('.z').forEach(function (e) {
                e.style.width = "100%";
                e.style.padding = "0";
            });
            if (document.getElementsByClassName("th").length > 0) {
                const post_table = document.getElementsByClassName("th")[0];
                //按照1:4:2:1:2的比例调整各列宽度
                post_table.children[0].style.width = "10%";
                post_table.children[1].style.width = "40%";
                post_table.children[2].style.width = "20%";
                post_table.children[3].style.width = "10%";
                post_table.children[4].style.width = "20%";
            }
        }

        //调整登录界面
        if (pageType === "login") {
            document.getElementById("ct").style.width = "100%";//调整浮窗的宽度
            let floatWindow = document.getElementsByClassName("biaoqi_dl");
            let floatWindowInfo_div = document.getElementsByClassName("rfm");
            let buttonWrappers_div = document.getElementsByClassName("rfm bw0");
            let buttons = document.getElementsByClassName("pn pnc");
            for (let i = 0; i < floatWindow.length; i++) {//调整浮窗的边距
                floatWindow[i].style.cssText = "margin-left: 0; margin-right: 0;"
            }
            for (let i = 0; i < floatWindowInfo_div.length; i++) {//调整浮窗中各条信息的边距
                floatWindowInfo_div[i].style.cssText = "width: 100%; padding-left: 5%;"
            }
            for (let i = 0; i < buttonWrappers_div.length; i++) {
                buttonWrappers_div[i].style.width = "auto";//调整按钮的宽度
            }
            for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.width = "auto";//调整按钮的宽度
            }
            document.getElementsByClassName("f_c altw")[0].style.padding = "0"; //跳转显示框
        }

        //调整搜索界面
        if (pageType === "search") {
            document.getElementById("scform_srchtxt").style.width = "50%";
            document.getElementById("scform_submit").style.cssText = "width: 30%; min-width: 100px;";
            document.getElementById("toptb").style.cssText = "width: 100%; min-width: 0;padding: 0; border: 0;";//调整顶栏的宽度
            document.getElementById("scform").style.cssText += "width: 100%; min-width: 0;";//调整搜索框的宽度
            document.getElementById("ft").remove();//删除页脚
            //调整搜索结果的布局
            try {
                document.getElementById("threadlist").style.width = "100%";
            } catch (e) {
            }
        }
        /*侧边栏*/
        if (pageType === "index") {
            let sidebar_div = document.getElementById("sd");
            const sidebarHotTopics_div = sidebar_div.firstElementChild;
            const sidebarChoice_div = sidebar_div.children[1];
            //调整宽度
            sidebar_div.style.cssText = "width: 100%; min-width: 0;";
            sidebarHotTopics_div.style.cssText = "width: 100%; min-width: 0;";
            sidebarChoice_div.style.cssText = "width: 100%; min-width: 0;";
            const hotTopicsContainer_div = document.getElementsByClassName("main-right-zuixin")[0];
            for (let i = 0; i < hotTopicsContainer_div.childElementCount; i++) {
                let post_li = hotTopicsContainer_div.children[i];
                post_li.firstElementChild.firstElementChild.width = "100%";
            }
            //显示“热门主题”完整的标题
            const hotTopicsTitle_div = document.getElementsByClassName("comment-post");
            for (let i = 0; i < hotTopicsTitle_div.length; i++) {
                hotTopicsTitle_div[i].firstElementChild.textContent = hotTopicsTitle_div[i].firstElementChild.title;
            }
            //显示“精选内容”完整的标题
            const selectedTitle_div = document.getElementsByClassName("main-right-tw")[0];
            selectedTitle_div.firstElementChild.children[1].firstElementChild.textContent = selectedTitle_div.firstElementChild.children[1].firstElementChild.title;
            document.getElementsByClassName("main-right-tw-txt")[0].style.width = "100%";
        } else if (pageType === "post") {
            let sidebar_div = document.getElementsByClassName("sd sd_allbox")[0];
            const selectedContent_div = document.getElementsByClassName("main-right-box cl");
            const selectTheme_div = document.getElementsByClassName("main-right-zuixin")[0];
            //调整宽度
            sidebar_div.style.cssText = "width: 100%; min-width: 0;";
            for (let i = 0; i < selectedContent_div.length; i++) {
                selectedContent_div[i].style.cssText = "width: 100%; min-width: 0;";
            }
            //调整“精选主题”每个li的宽度
            for (let i = 0; i < selectTheme_div.childElementCount; i++) {
                let post_li = selectTheme_div.children[i];
                post_li.firstElementChild.firstElementChild.width = "100%";
            }
        }
 
 
        if (pageType !== "search") {
            /* 调整回到页首按钮的位置 */
            const backToTop_div = document.getElementsByClassName("biaoqi-fix-area")[0];
            backToTop_div.style.cssText = "left: 0; margin-left: 80%;"
            backToTop_div.firstElementChild.style.bottom = "10%";
 
            /*调整页脚*/
            const footer = document.getElementsByClassName("jav-footer")[0];
            footer.style.cssText = "width: 100%; min-width: 0; padding: 0;";
            footer.firstElementChild.style.padding = "10px";
        }
    } else {
        let tip = "JavBus论坛移动端界面适配v: 未启用移动端布局，原因: ";
        if (window.innerWidth >= 1600) {
            if (window.innerWidth >= window.innerHeight) {
                console.log(tip + "当前屏幕宽度大于1600px, 且不为竖屏。");
            } else {
                console.log(tip + "当前屏幕宽度大于1600px。");
            }
        } else {
            if (window.innerWidth >= window.innerHeight) {
                console.log(tip + "当前屏幕不为竖屏。");
            } else {
                console.log(tip + "未知原因。");
            }
        }
        console.log("width:", window.innerWidth, "height:", window.innerHeight);
    }
})();