// ==UserScript==
// @name         JavBus论坛移动端界面适配
// @namespace    https://sleazyfork.org/zh-CN/users/1140711-steven-fake
// @homepageURL  https://github.com/Steven-Fake/JavBus-forum-mobile-layout
// @version      1.3.2
// @license      MIT
// @description  使司机社(JavBus)的论坛适应移动端界面
// @author       Steven-Fake
// @run-at       document-idle
// @icon         https://www.javbus.com/favicon.ico
// @match        https://www.javbus.com/forum*
// @match        https://www.buscdn.cfd/forum*
// @match        https://www.buscdn.lol/forum*
// @match        https://www.busfan.cfd/forum*
// @match        https://www.busfan.lol/forum*
// @match        https://www.cdnbus.cfd/forum*
// @match        https://www.cdnbus.lol/forum*
// @match        https://www.dmmbus.cfd/forum*
// @match        https://www.dmmbus.lol/forum*
// @match        https://www.dmmsee.cfd/forum*
// @match        https://www.dmmsee.lol/forum*
// @match        https://www.javsee.cfd/forum*
// @match        https://www.javsee.lol/forum*
// @match        https://www.seejav.cfd/forum*
// @match        https://www.seejav.lol/forum*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472169/JavBus%E8%AE%BA%E5%9D%9B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%95%8C%E9%9D%A2%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/472169/JavBus%E8%AE%BA%E5%9D%9B%E7%A7%BB%E5%8A%A8%E7%AB%AF%E7%95%8C%E9%9D%A2%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

const PAGE = {//页面枚举类型
    Index: 0, // 首页
    SubForum: 1, // 子版块页面
    Post: 2, // 帖子页面
    Search: 3, // 搜索页面
    Favorite: 4, // 收藏页面
    Profile: 5, // 个人信息页面
    Login: 6, // 登录页面
    Message: 7, // 消息页面
    Privacy: 8, // 隐私设置页面
    Unknown: -1 // 未知，或未适配的页面
}
const VERSION = "1.3.2"
const SLEAZYFORK = "https://sleazyfork.org/zh-CN/scripts/472169-javbus论坛移动端界面适配"; // 脚本主页

/**
 * 是否启用移动端布局
 * @returns {boolean}
 */
const ifEnable = () => {
    const status = window.innerHeight > window.innerWidth && window.innerWidth <= 1600;
    if (!status) {
        const info = `JavBus论坛移动端界面适配 v${VERSION}: 未启用移动端布局，原因: `;
        if (window.innerWidth > 1600) {
            if (window.innerWidth >= window.innerHeight) console.log(info + "当前屏幕宽度大于1600px, 且不为竖屏。");
            else console.log(info + "当前屏幕宽度大于1600px。");
        } else {
            if (window.innerWidth >= window.innerHeight) console.log(info + "当前屏幕不为竖屏。");
            else console.log(info + "未知原因。");
        }
        console.log("width:", window.innerWidth, "height:", window.innerHeight);
    } else {
        console.log(`JavBus论坛移动端界面适配 v${VERSION}: 启用移动端布局`);
    }
    return status;
}

/**
 * 获取当前页面的类型
 * @returns {PAGE}
 */
function getPageType() {
    const url = window.location.href;
    const indexRegex = /^.+\/forum(\.php)?([\/?])?$/; // 相当于只匹配['/forum', '/forum/', '/forum?']，不允许子路径和任何get参数
    if (url.match(indexRegex)) return PAGE.Index;
    else if (url.includes("gid=")) return PAGE.Index;
    else if (url.includes("tid=")) return PAGE.Post;
    else if (url.includes("fid=")) return PAGE.SubForum;
    else if (url.includes("uid=")) return PAGE.Profile;
    else if (url.includes("action=login")) return PAGE.Login;
    else if (url.includes("search.php")) return PAGE.Search;
    else if (url.includes("ac=privacy")) return PAGE.Privacy;
    else if (url.includes("mod=space")) return PAGE.Message;
    else if (url.includes("do=favorite")) return PAGE.Favorite;
    else return PAGE.Unknown;
}

/**
 * 页面布局控制器
 */
class Layout {
    constructor() {
        // 注入自适应调整的meta标签
        const meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content = "width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no";
        document.head.appendChild(meta);

        this.pageType = getPageType(); // 页面类型

        if (this.pageType === PAGE.Unknown) { // 未适配的页面
            console.log("JavBus论坛移动端界面适配 v" + VERSION + ": 未适配当前页面")
            return;
        } else if (this.pageType !== PAGE.Search) { // 执行通用规则，但搜索页面不适用
            this.mainWrapper = document.querySelector("#wp");
            this.mainContainer = document.querySelector(".mn");
            this.basic(); // 应用页面的全局调整
            this.topBar(); // 调整顶栏
        }
        // 各页面的规则
        if (this.pageType === PAGE.Index) {
            this.index(); // 调整首页
        } else if (this.pageType === PAGE.SubForum) {
            this.subForum(); // 调整子版块页面
        } else if (this.pageType === PAGE.Search) {
            this.search(); // 调整搜索页面
        } else if (this.pageType === PAGE.Profile) {
            this.profile(); // 调整个人信息页面
        } else if (this.pageType === PAGE.Post) {
            this.post(); // 调整帖子页面
        } else if (this.pageType === PAGE.Login) {
            this.login(); // 调整登录页面
        } else if (this.pageType === PAGE.Favorite) {
            this.favorite(); // 调整收藏页面
        } else if (this.pageType === PAGE.Message) {
            this.message(); // 调整消息页面
        } else if (this.pageType === PAGE.Privacy) {
            this.privacy(); // 调整隐私设置页面
        }
    }

    /**
     * 页面的基本调整
     */
    basic() {
        // 1.移除顶部广告
        document.querySelectorAll(".bcpic2").forEach(ad => ad.remove());

        // 2.删除本就隐藏的元素
        document.querySelector("div.wp.cl")?.remove();

        // 3.调整层级导航栏的样式
        document.querySelectorAll("div.z").forEach(e => e.style.cssText = "width: 100%; padding: 0;");

        // 4.调整回到页首按钮的位置
        const backToTop = document.getElementsByClassName("biaoqi-fix-area");
        if (backToTop[0]) {
            backToTop[0].style.cssText = "left: 0; margin-left: 80%;"
            backToTop[0].firstElementChild.style.bottom = "10%";
        }

        // 5.调整页脚样式
        const footer = document.getElementsByClassName("jav-footer");
        if (footer[0]) {
            footer[0].style.cssText = "width: 100%; min-width: 0; padding: 0;";
            footer[0].firstElementChild.style.padding = "10px";
        }

        // 6.调整页面中wrapper的布局
        if (this.mainWrapper)
            this.mainWrapper.style.cssText = "width: 100%; min-width: 0; padding: 0;";
        if (this.mainContainer)
            this.mainContainer.style.cssText = "width: 100%; min-width: 0; padding: 0;";

        // 调整侧边栏的背景色(若有)
        const sider_ct = document.querySelector("div#ct")
        if (sider_ct) sider_ct.style.background = "none";
        //调整侧边栏的宽度(若有)
        const sider_appleft = document.querySelector("div.appl");
        if (sider_appleft) sider_appleft.style.cssText = "width: 100%; min-width: 0; padding: 0;";
    }

    /**
     * 调整顶栏
     */
    topBar() {
        const nav = document.getElementById("toptb");
        if (!nav) return;
        // 1. 删除logo
        nav.querySelector('a.jav-logo')?.remove();
        // 2. 调整导航栏样式
        nav.style.cssText = "min-width: unset; width: 100%; padding: 0;";
        // 3. 移除原有搜索框和导航栏
        nav.querySelector('div.wp')?.remove(); // 移除搜索框和导航栏
        // 4. 调整个人信息部分
        const member = nav.querySelector('div.login-wrap.y');
        // 4.1 移除ID以节省空间
        member?.querySelector('span.member-name')?.remove();
        // 4.2 个人头像改为左对齐
        member.style.cssText = "float: left;";
        // 4.3 将下拉菜单搬出来
        const menu = document.createElement('ul');
        menu.style.cssText = "display: flex; justify-content: left; align-items: center;"
        member.querySelectorAll('div.menu-body div.item a').forEach(e => {
            const li = document.createElement('li');
            li.style.cssText = "float: none; display: inline-block; margin: 0 5px;";
            e.style.cssText = "font-size: 14px; padding: 10px 0; text-align: center;";
            li.appendChild(e);
            menu.appendChild(li);
        });
        nav.appendChild(menu);
        // 4.4 删掉menu的第一个元素(快捷导航)
        menu.firstElementChild?.remove();
        // 4.5 删掉原本的下拉按钮和下拉菜单
        member.querySelector('span.angle')?.remove();
        member.querySelector('div.menu-body')?.remove();
    }


    /**
     * 首页(javbus.com/forum/ 或 javbus.com/forum/forum.php?gid=1)
     */
    index() {
        if (!this.mainContainer) return;

        // 第1部分，包括轮播图片和帖子推荐列表
        const part1 = this.mainContainer.firstElementChild;
        part1.style.cssText = "width: 100%; min-width: 0; padding: 0; height: auto;"; // 调整样式
        const carouselContainer = part1.children[0], postListContainer = part1.children[1];
        carouselContainer.style.cssText = "float: none; width: 100%; height: auto;"; // 调整轮播图片框的样式
        postListContainer.style.cssText = "margin: 0; margin-top: 10px; width: 100%; height: auto;"; // 调整帖子列表框的样式
        // 轮播图片框
        carouselContainer.querySelectorAll("img").forEach(e => e.style.width = "100%");
        // 轮播指示器
        const carouselIndicator = carouselContainer.querySelector("div.biaoqicn_show.slidebar");
        if (carouselIndicator) {
            carouselIndicator.style.cssText = "width: 100%; left: 0; top: 0";
            carouselIndicator.querySelectorAll("a").forEach(e => e.style.cssText = "margin:0; padding: 10px 0; width: 10%;");
        }
        // 帖子推荐列表
        const postLists = postListContainer.querySelectorAll("div.sideMenu");
        for (let sideMenu of postLists) {
            for (let item of sideMenu.children) {
                item.style.width = "100%";
                item.firstElementChild?.remove(); // 删除发帖用户的名称
            }
        }

        // 第2部分，“综合交流区”和“福利讨论分类”
        this.mainContainer.querySelectorAll("table.fl_tb").forEach(e => {
            const tbody = e.firstElementChild;
            for (let tr of tbody.children) {
                for (let col = 0; col < tr.childElementCount; col++) {
                    if (col !== 0 && col !== 1) { // 第0列是图标，第1列是标题
                        tr.children[1].innerHTML += tr.children[col].outerHTML;
                        tr.children[col].style.display = "none";
                    }
                }
            }
        });

        // 3.“热门主题”和“精选内容”
        const sidebar = document.getElementById("sd");
        sidebar.style.cssText = "width: 100%; min-width: 0;";
        const hotContainer = sidebar.children[0], choiceContainer = sidebar.children[1];
        hotContainer.style.cssText = "width: 100%; min-width: 0;";
        choiceContainer.style.cssText = "width: 100%; min-width: 0;";
        const hotList = hotContainer.querySelector("div.main-right-zuixin");
        for (let item of hotList.children) {
            item.querySelector("table").style.width = "100%"; // 调整每个帖子的宽度为100%
            const title = item.querySelector("p.comment-post"); // 显示完整标题
            title.firstElementChild.textContent = title.firstElementChild.title;
        }
        const choiceList = choiceContainer.querySelector("div.main-right-tw");
        for (let item of choiceList.querySelectorAll("dl")) {
            item.querySelectorAll("dd").forEach(e => e.style.width = "100%"); // 调整帖子宽度为100%
            item.querySelectorAll("img").forEach(e => {
                e.style.width = "100%";
                e.style.height = "auto";
            }) // 调整图片宽度为100%
            const title = item.querySelector("dt"); //显示完整标题
            title.firstElementChild.textContent = title.firstElementChild.title;
        }
    }

    /**
     * 子版块页面(javbus.com/forum.php?mod=forumdisplay&fid=)
     */
    subForum() {
        // 1. 调整子版块标题的样式
        const titleBlock = document.querySelector("div.forumbky");
        if (titleBlock) titleBlock.style.cssText = "width: 100%; padding: 0;";

        const main = document.querySelector("div#threadlist");
        if (!main) return;

        // 2. 调整顶栏的筛选框和排序框
        main.querySelector("div.th table").style.cssText = "display: flex; justify-content: space-between; width: 100%;";

        // 3. 调整各条目的宽度
        const itemTable = main.querySelector("table#threadlisttableid");
        if (itemTable) {
            itemTable.style.cssText = "width: 100%"
            itemTable.querySelectorAll("tbody").forEach(
                tbody => {
                    tbody.style.cssText = "width: 100%; min-width: 0; padding: 0;"
                    tbody.querySelectorAll("th").forEach(e => e.style.cssText = "width: 100%;")
                    tbody.querySelectorAll("div.post_inforight").forEach(e => e.style.cssText = "display:flex; flex-direction: column; width: 100%")
                    tbody.querySelectorAll("div.post_infolist").forEach(e => e.style.cssText = "width: 100%;")
                    tbody.querySelectorAll("div.post_infolist_other").forEach(e => e.style.cssText = "display:flex;flex-direction: column;")
                }
            )
        }

        // 4.“精选内容”与“精选主题”
        const sidebar = this.mainWrapper.querySelector("div.sd.sd_allbox");
        sidebar.style.cssText = "width: 100%; min-width: 0;";
        sidebar.querySelectorAll("div.main-right-box.cl").forEach(e => e.style.cssText = "width: 100%; min-width: 0; padding: 0;"); // 调整每个帖子的样式
        // “精选内容”
        const choiceContent = sidebar.querySelector("ul.main-right-kuaixu.cl");
        if (choiceContent) {
            choiceContent.querySelectorAll("li").forEach(e => {
                // 调整“精选内容”每个li的宽度
                e.style.width = "100%";
                // 调整图片和标题的宽度
                e.querySelectorAll("div").forEach(e => e.style.width = "50%");
            });
        }
        // “精选主题”
        const choiceTheme = sidebar.querySelector("div.main-right-zuixin");
        if (choiceTheme) {
            choiceTheme.querySelectorAll("li").forEach(e => {
                // 调整“精选内容”每个li的宽度
                e.style.width = "100%";
                // 显示完整标题
                const title = e.querySelector("p.comment-post a");
                title.textContent = title.title;
                // 调整表格宽度
                e.querySelector("table").style.width = "100%";
            });
        }
    }

    /**
     * 帖子页面(javbus.com/forum.php?mod=viewthread&tid=)
     */
    post() {
        // 调整帖子和回复中的图片尺寸
        let post_td = document.getElementsByClassName("t_f");
        for (let i = 0; i < post_td.length; i++) {
            let imgs = post_td[i].getElementsByTagName("img");
            for (let j = 0; j < imgs.length; j++) {
                if (!imgs[j].src.includes("/static/image/smiley/")) {//不调整表情图片
                    imgs[j].style.cssText = "width: 100%; height: auto;";
                }
            }
        }
        // 微调楼主信息卡片
        const actionTabs = document.querySelector("div.biaoqi_pls")
        if (actionTabs) {
            actionTabs.style.width = "100%";
            actionTabs.firstElementChild.style.width = "100%";
        }

        // “精选内容”与“精选主题”
        const sidebar = this.mainWrapper.querySelector("div.sd.sd_allbox");
        sidebar.style.cssText = "width: 100%; min-width: 0;";
        sidebar.querySelectorAll("div.main-right-box.cl").forEach(e => e.style.cssText = "width: 100%; min-width: 0; padding: 0;"); // 调整每个帖子的样式
        // “精选内容”
        const choiceContent = sidebar.querySelector("ul.main-right-kuaixu.cl");
        if (choiceContent) {
            choiceContent.querySelectorAll("li").forEach(e => {
                // 调整“精选内容”每个li的宽度
                e.style.width = "100%";
                // 调整图片和标题的宽度
                e.querySelectorAll("div").forEach(e => e.style.width = "50%");
            });
        }
        // “精选主题”
        const choiceTheme = sidebar.querySelector("div.main-right-zuixin");
        if (choiceTheme) {
            choiceTheme.querySelectorAll("li").forEach(e => {
                // 调整“精选内容”每个li的宽度
                e.style.width = "100%";
                // 显示完整标题
                const title = e.querySelector("p.comment-post a");
                title.textContent = title.title;
                // 调整表格宽度
                e.querySelector("table").style.width = "100%";
            });
        }
    }

    /**
     * 搜索页面(javbus.com/forum/search.php)
     */
    search() {
        // 删除Logo
        document.querySelector("h1")?.remove();
        const searchForm = document.querySelector("#scform");
        if (searchForm) {
            searchForm.style.cssText += "width: 100%; min-width: 0;";//调整搜索框的宽度
            searchForm.querySelector("input#scform_srchtxt").style.width = "100%";
            searchForm.querySelector("button#scform_submit").style.cssText = "width: 30%; min-width: 100px;";
        }
        document.getElementById("toptb").style.cssText = "width: 100%; min-width: 0;padding: 0; border: 0;";//调整顶栏的宽度
        document.getElementById("ft").remove();//删除页脚
        //调整搜索结果的布局
        try {
            document.getElementById("threadlist").style.width = "100%";
        } catch (e) {
        }
    }

    /**
     * 个人信息页面(javbus.com/forum/home.php?mod=space&uid=)
     */
    profile() {
        document.querySelectorAll('.z').forEach(e => e.style.cssText = "width: 100%; padding: 0;"); // 调整层级导航栏的样式

        // 调整上部容器的样式
        const upperContainer = document.getElementById("uhd");
        upperContainer.style.cssText = "width: 100%; padding: 0";
        // 调整头像的样式
        const avatar = upperContainer.querySelector("div.icn.avt");
        if (avatar) avatar.style.padding = "5px";

        // 调整底部容器的样式
        const bottomContainer = document.querySelector('div.bm_c');
        if (bottomContainer) bottomContainer.style.padding = 0;

        // 调整个人资料页面的排版
        this.mainContainer.querySelectorAll("h2.mbn").forEach(e => e.style.marginLeft = "5px");
        const profileContainer = this.mainContainer.querySelector("div.bm_c.u_profile");
        if (profileContainer)
            profileContainer.querySelectorAll("li").forEach(e => e.style.cssText = "text-align: left; margin-left: 10px; width: 100%;");

        // 调整帖子表格的样式
        if (document.getElementsByClassName("th").length > 0) {
            const tbody = document.querySelector('tbody');
            tbody.querySelectorAll('td.icn').forEach(e => e.remove()); // 删除图标列
            tbody.querySelectorAll('td.xg1 img').forEach(e => e.remove()); // 删除回复时的图标列
            tbody.style.cssText = "th {padding: 5px; border: 1px;} td {padding: 5px; border: 1px;}"; // 调整表格的样式
            const thead = tbody.querySelector('tr.th');
            thead.children[0].style.width = "40%"; // 帖子标题列宽50%
            thead.children[1].style.width = "25%"; // 帖子板块列宽20%
            thead.children[2].style.width = "10%"; // 帖子回复/查看列宽10%
            thead.children[3].style.display = "25%"; // 帖子最后回复列宽20%
        }

        // “添加好友”按钮
        const add_friend = document.querySelector("div.mn ul li.addf");
        if (add_friend) add_friend.style.textAlign = "right";
        // “发送消息”按钮
        const send_message = document.querySelector("div.mn ul li.pm2")
        if (send_message) send_message.style.textAlign = "right";
    }

    /**
     * 登录页面(javbus.com/forum/member.php?mod=logging&action=login)
     */
    login() {
        document.getElementById("ct").style.width = "100%"; // 调整整个窗口的宽度
        document.querySelectorAll("div.biaoqi_dl").forEach(dialog => {
            dialog.style.cssText = "margin: 0; width: 100%; div.rfm {width: 100%; padding: 0 5%; }"; // 调整浮窗的边距、宽度和子元素的宽度
        });//调整浮窗的边距和宽度

        // 移除因界面调整而会触发界面bug的“找回密码”
        const temp = document.querySelectorAll("td.tipcol");
        temp[temp.length - 1].remove();
        document.querySelector(".f_c.altw").style.padding = "0"; //跳转显示框

    }

    /**
     * 收藏页面(javbus.com/forum/home.php?mod=space&do=favorite&view=me)
     */
    favorite() {
        this.mainContainer.style.margin = "0"; // 调整边距

        // 调整收藏列表的样式
        const favoriteList = document.querySelector("ul#favorite_ul");
        if (favoriteList) {
            favoriteList.querySelectorAll("li").forEach(e => e.style.padding = "10px");
        }

        // 调整全选按钮的样式
        this.mainContainer.querySelector("p.mtm.pns").style.padding = "10px";
    }

    /**
     * 消息页面(javbus.com/forum/home.php?mod=space&do=pm)
     */
    message() {
        const sider_ct = document.querySelector("div#ct")
        sider_ct.style.cssText = "background: none; display: flex; flex-direction: column-reverse;";
        // TODO: 由于账号暂时没有发消息的权限，所以这里是空的，效果不一定行
    }

    /**
     * 隐私设置页面(javbus.com/forum/home.php?mod=spacecp&ac=privacy)
     */
    privacy() {
        const sider_ct = document.querySelector("div#ct")
        sider_ct.style.cssText = "background: none; display: flex; flex-direction: column-reverse;";
    }
}


(function () {
    'use strict';
    if (!ifEnable()) return;

    try {
        new Layout(); // 开始调整布局
    } catch (e) {
        console.error("JavBus论坛移动端界面适配 v" + VERSION + ": 页面适配时出现错误", e);
        // feedback(e);
    }
})();
