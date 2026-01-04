// ==UserScript==
// @name         Gitlab页面优化
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  优化Gitlab页面展示内容
// @author       Haifennj
// @match        http://192.168.0.22/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        GM_addStyle
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/460380/Gitlab%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/460380/Gitlab%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let css = `
        .nav.navbar-nav li.user-counter.dropdown {
            width: 106px;
        }
        .header-search {
            width: 265px;
        }
        .title-container > ul {
            max-height:40px;
            overflow:auto;
        }
        .title-container > ul::-webkit-scrollbar {
            width: 6px;
            background-color: #2261a1;
        }
        .title-container > ul:hover ::-webkit-scrollbar-track-piece {
            /*鼠标移动上去再显示滚动条*/
             background-color: #2261a1;
             /* 滚动条的背景颜色 */
             border-radius: 6px;
             /* 滚动条的圆角宽度 */
        }
        .title-container > ul:hover::-webkit-scrollbar-thumb:hover {
            background-color: #c0cecc;
        }

        .title-container > ul:hover::-webkit-scrollbar-thumb:vertical {
            background-color: #c0cedc;
            border-radius: 6px;
        }
        a.nav-link.custom-link {
            height: 16px !important;
            margin: 2px 3px 0 0 !important;
        }
        /*流水线页面样式优化*/
        .gl-text-truncate {
            overflow: hidden;
            text-overflow: initial;
            white-space: normal;
            word-break: break-word;
        }
        /*流水线列表弹出框的高度*/
        .show.dropdown .dropdown-menu {
            max-height: 700px;
        }
        .show.dropdown .dropdown-menu .gl-new-dropdown-inner {
            max-height: 700px;
        }

        .mini-pipeline-graph-dropdown-menu .scrollable-menu {
            max-height: 700px;
        }
        /*仓库列表页面优化*/
        #last-commit {
            width: 300px;
        }
        #last-update {
            width: 180px;
        }
        .container-limited.limit-container-width {
            max-width: 1280px;
        }
        .tag-open {
            background:#A3E4D770;
        }
        .tag-apps {
            background:#BB8FCE70;
        }
        .tag-security {
            background:#F1948A70;
        }
        .tag-vue {
            background:#F8C47170;
        }
        .tag-vue-apps {
            background:#D3540070;
        }
        .tag-pipelines {
            background:#D3540070;
        }
    `
    try {
        GM_addStyle(css);
    } catch (error) {
        let el = document.createElement('style')
        el.type = 'text/css'
        el.innerText = css
        document.head.appendChild(el);
    }

    var userAgent = navigator.userAgent.toLowerCase();
    var isMobile = !!userAgent.match(/(mobile)/i);
    var isPC = !isMobile;
    var isiPad = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    var path = window.location.href;
    var isListPage = path.indexOf("dashboard/merge_requests") > -1;
    if (path.indexOf("state=merged") > -1 || path.indexOf("state=closed") > -1 || path.indexOf("state=all") > -1) {
        isListPage = false;
    }
    var isTodoPage = path.indexOf("dashboard/todos") > -1;
    var isMRPage = path.indexOf("-/merge_requests") > -1;
    var isCommits = path.indexOf("/commits") > -1;
    var isDiffs = path.indexOf("/diffs") > -1;

    // 列表页面，如果请求为0，则3s刷新页面一次
    // if (isListPage || isTodoPage) {
    //     var mrListUrl = "/api/v4/merge_requests?scope=assigned_to_me&state=opened";
    //     $.get(mrListUrl, function (data) {
    //         if (data.length == 0) {
    //             setTimeout(function () {
    //                 window.location.reload();
    //             }, 3 * 1000);
    //         }
    //     });
    // }

    var navbarNav = $(".navbar-nav");
    var merge_requests = navbarNav.find(".user-counter.dropdown");
    var links = merge_requests.find(".dropdown-menu").find("a");

    var mrCount = new Number(merge_requests.find(".js-merge-requests-count").text())
    var newTitle = "";
    var oldTitle = document.title;
    if (isListPage && mrCount > 0) {
        newTitle = mrCount + "个合并请求待处理";
        document.title = newTitle;
        try {
            GM_notification({
                tag: "合并请求",
                text: newTitle,
                title: "合并请求",
                image:"http://192.168.0.22/assets/gitlab_logo-7ae504fe4f68fdebb3c2034e36621930cd36ea87924c11ff65dbcb8ed50dca58.png",
            });
        } catch (error) {
        }
        try {
            var notify = new Notify({
                //message: '有消息了。',//标题
                effect: 'flash', // flash | scroll 闪烁还是滚动
                //可选播放声音
                // audio:{
                //     //可以使用数组传多种格式的声音文件
                //     file: ['msg.mp4','msg.mp3','msg.wav']
                //     //下面也是可以的哦
                //     //file: 'msg.mp4'
                // },
                //标题闪烁，或者滚动速度
                // interval: 500,
                //可选，默认绿底白字的  Favicon
                updateFavicon:{
                    // favicon 字体颜色
                    textColor: "#fff",
                    //背景颜色，设置背景颜色透明，将值设置为“transparent”
                    backgroundColor: "#fc6d26"
                }
            });
            notify.setFavicon(mrCount).player();
            notify.setTitle(true);
            notify.setTitle(newTitle);

            var time = 0;
            setInterval(()=>{
                if (time % 2 == 0) {
                    notify.setTitle();
                    notify.setTitle(oldTitle);
                } else {
                    notify.setTitle();
                    notify.setTitle(newTitle);
                }
                time++;
            }, 500);
        } catch (error) {
        }
    } else {
        document.title = oldTitle;
    }


    // ************************************************************ //
    // 15秒定时刷新页面
    var totalCount = 0;
    if (isPC && !isiPad) {
        if (isListPage) {
            var assigneeLink = $(links[0]);
            var count = new Number(assigneeLink.find("span").text());
            totalCount += count;
            if (count > 0) {
                setTimeout(function () {
                    window.location.href = assigneeLink.attr("href");
                }, 15 * 1000);
            } else {
                var reviewerLink = $(links[1]);
                count = new Number(reviewerLink.find("span").text());
                totalCount += count;
                if (count > 0) {
                    setTimeout(function () {
                        window.location.href = reviewerLink.attr("href");
                    }, 15 * 1000);
                }
                if (totalCount == 0) {
                    setTimeout(function () {
                        window.location.href = assigneeLink.attr("href");
                    }, 3 * 1000);
                }
            }
        }
    }


    // ************************************************************ //
    // Merge Request页面，链接添加target标签
    if (isListPage && !isMobile) {
        // 获取所有带有 .nav-link 类的 <a> 标签
        const links = document.querySelectorAll('a.nav-link');
        // 遍历这些链接
        links.forEach(link => {
            // 检查链接是否没有 .active 类
            if (!link.classList.contains('active')) {
                // 设置 target 属性，值为 href 属性的值
                link.setAttribute('target', '222');//link.getAttribute('href')
            }
        });
        document.querySelectorAll('span[class="merge-request-title-text js-onboarding-mr-item"]').forEach(linkTag => {
            var href = linkTag.children[0].getAttribute("href");
            linkTag.children[0].setAttribute("href", "#");
            linkTag.children[0].setAttribute("onclick", "javascript:window.open('" + href + "','" + href + "')");
        });
    }
    // 待办页面，链接添加target标签
    if (isTodoPage && !isMobile) {
        document.querySelectorAll('span[class="title-item todo-label todo-target-link"]').forEach(linkTag => {
            var href = linkTag.children[0].getAttribute("href");
            linkTag.children[0].setAttribute("href", "#");
            linkTag.children[0].setAttribute("onclick", "javascript:window.open('" + href + "','" + href + "')");
        });
    }

    // ************************************************************ //
    // 优化Merge Request页面，添加两个链接
    if (isPC && !isiPad) {
        merge_requests.find(".dashboard-shortcuts-merge_requests").hide();
        links.each(function () {
            var newLink = $(this);
            newLink.attr("target", "_self");
            newLink.css({ "height": "17px", "padding": "0 2px", "margin": "2px 2px 1px" });
            merge_requests.append(newLink);
        });
        merge_requests.find(".dashboard-shortcuts-merge_requests").remove();
    } else {
        var logo;
        if (isMobile) {
            logo = $("header").find(".title-container").find("h1");
        }
        if (isiPad) {
            logo = $("header").find(".title-container").find(".navbar-sub-nav")
        }
        var ul = $('<ul class="nav navbar-nav"></ul>');
        merge_requests.find(".dashboard-shortcuts-merge_requests").hide();
        links.each(function () {
            var newLink = $(this);
            newLink.attr("target", "_self");
            newLink.attr("class", "shortcuts-todos js-prefetch-document");
            newLink.css({ "padding": "0 4px", "margin-left": "5px" });
            var li = $('<li class="user-counter active"></li>');
            li.append(newLink);
            ul.append(li);
        });
        logo.append(ul);
    }

    // ************************************************************ //
    // 15分钟后检测是已经合并页面，关闭页面
    var delayCloseTime = 5 * 60 * 1000;
    if (isMobile || isiPad) {
        delayCloseTime = 3000;
    }
    setTimeout(function () {
        var totalCount = 0;
        if (isMRPage) {
            var apiHead = "/api/v4/projects/";
            var projectId = "";
            var mrId = 0;
            var mrUrl = "";
            var tmp = path.split("/-/");

            projectId = tmp[0].replace(location.origin + "/", "");
            projectId = projectId.replace("/", "%2F");
            //vue-aws%2Fawsui/merge_requests/168
            mrUrl = apiHead + projectId + "/" + tmp[1];
            // 检测是否有已经合并的标记
            $.get(mrUrl, function (data) {
                if (data.state == "merged" && $(".notes-tab.active").length > 0) {
                    window.opener = null;
                    window.open('', '_self');
                    window.close();
                }
            });
        }
    }, delayCloseTime);

    // ************************************************************ //
    // 常用仓库列表
    var repos = [
        {
            name: "aws",
            link: "/open/aws",
            class: "open",
        },
        {
            name: "apps",
            link: "/apps",
            class: "apps",
        },
        {
            name: "release",
            link: "/open/release",
            class: "open",
        },
        {
            name: "GitlabCI",
            link: "/cidevops/GitlabCI",
            class: "open",
        },
        {
            name: "security",
            link: "/security",
            class: "security",
        },
        {
            name: "vue/aws",
            link: "/vue-aws/aws",
            class: "vue",
        },
        {
            name: "vue/apps",
            link: "/vue-apps",
            class: "vue",
        },
        {
            name: "vue/awsui",
            link: "/vue-aws/awsui",
            class: "vue",
        },
        {
            name: "后端aws流水线",
            link: "/open/aws/-/pipelines",
            class: "pipelines",
        },
        {
            name: "security/engine流水线",
            link: "/security/aws-bpmn-engine/-/pipelines",
            class: "pipelines",
        },
        {
            name: "security/core流水线",
            link: "/security/aws-infrastructure-core/-/pipelines",
            class: "pipelines",
        },
        {
            name: "security/ai流水线",
            link: "/security/aws-infrastructure-ai/-/pipelines",
            class: "pipelines",
        },
        {
            name: "前端AI流水线",
            link: "/vue-apps/ai/-/pipelines",
            class: "pipelines",
        },
        {
            name: "前端aws流水线",
            link: "/vue-aws/aws/-/pipelines",
            class: "pipelines",
        },
        {
            name: "前端awsui流水线",
            link: "/vue-aws/awsui/-/pipelines",
            class: "pipelines",
        }
    ];
    if (isPC && !isiPad) {
        var titleContainer = $(".title-container");
        var ul = $("<ul class='nav navbar-sub-nav'></ul>");
        titleContainer.append(ul);
        repos.forEach(element => {
            var li = $("<li class='nav-item'></li>");
            var a = $("<a></a>");
            a.text(element.name);
            a.attr("target", element.link);
            a.attr("href", element.link);
            a.attr("class", "nav-link custom-link tag-" + element.class);
            li.append(a);
            ul.append(li);
        });
    }

    function createLinkElement(href, text, className = "no-expand gl-mr-3 gl-mt-3") {
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', href);
        linkElement.textContent = text;
        linkElement.target = href;
        linkElement.setAttribute('class', className);
        return linkElement;
    }

    function insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function insertMultipleAfter(nodes, referenceNode) {
        // 按照数组顺序插入，需要从后往前插入
        for (let i = nodes.length - 1; i >= 0; i--) {
            insertAfter(nodes[i], referenceNode);
        }
    }

    // 处理仓库列表添加流水线入口
    function checkForData() {
        // Get all elements with the data-testid attribute set to "group-name"
        var groupNames = document.querySelectorAll('[data-testid="group-name"]');

        // Check if there are any elements found
        if (groupNames.length > 0) {
            // Perform the desired action (e.g., add a link after each element)
            groupNames.forEach(function (groupName) {
                // Get the current href attribute value
                var currentHref = groupName.getAttribute('href');

                // Create links
                var pipelineLink = createLinkElement(currentHref + "/-/pipelines", 'Pipelines');
                var branchLink = createLinkElement(currentHref + "/-/branches/new/", '创建新分支');
                var branchName = "7.1.1.1110";
                var ciLink = createLinkElement(currentHref + "/-/ci/editor?branch_name="+branchName, '编辑流水线');

                // Insert all links after the current group-name element
                insertMultipleAfter([pipelineLink, branchLink, ciLink], groupName);
            });

            // Stop the interval since the action has been performed
            clearInterval(dataCheckInterval);
        }
    }
    // Set up an interval to periodically check for data
    var dataCheckInterval = setInterval(checkForData, 10); // Check every 1000 milliseconds (1 second)


    /*To use the  DOMNodeInserted event listening, jquery is required*/
    $(document).bind('DOMNodeInserted', function(event) {
        $('a[data-testid="job-with-link"]').each(
            function(){
                if (!$(this).attr('target')) {
                    $(this).attr('target', '_blank')
                }
            }
        );
    });


    // 获取所有的issuable-reference元素
    const issuableReferences = document.querySelectorAll('.issuable-reference');

    // 遍历每个issuable-reference元素
    issuableReferences.forEach(reference => {
        // 获取issuable-reference元素中的文字内容
        const textContent = reference.textContent.trim();

        // 检查issuable-reference中的文字内容是否包含'awsui'字样
        if (textContent.includes('awsui')) {
            // 给对应的span添加红色颜色
            reference.style.color = 'red';
        }
    });

    // 获取所有的ref-name元素
    const refNames = document.querySelectorAll('.ref-name');

    // 遍历每个ref-name元素
    refNames.forEach(refName => {
        // 获取ref-name元素中的文字内容
        const textContent = refName.textContent.trim();

        // 检查ref-name中的文字内容是否包含'6.4.GA'
        if (textContent.includes('6.4.GA')) {
            // 给对应的a标签添加蓝色样式
            refName.querySelector('a').classList.add('blue-text');
        }
    });

})();
