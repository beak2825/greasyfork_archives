// ==UserScript==
// @name         优化B站效果
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  优化B站动态页效果
// @author       O.k
// @license      MIT

// @match        https://t.bilibili.com/?tab=*
// @match        https://t.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501148/%E4%BC%98%E5%8C%96B%E7%AB%99%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/501148/%E4%BC%98%E5%8C%96B%E7%AB%99%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
    console.log("B站效果优化");
    function delDOMNode(array) {
        for (let i = 0; i < array.length; i++) {
            let promise = new Promise((resolve, reject) => {
                let tempID = window.setInterval(() => {
                    let temp = document.querySelector(array[i]);
                    if (temp) {
                        resolve(temp);
                        window.clearInterval(tempID);
                    }
                }, 100);
            }).then((node) => {
                node.remove();
            });
        }
    }
    /*
    .bili-dyn-version-control__reminding
    .right
    */
    //删除节点
    let delArray = [
        ".bili-dyn-version-control__reminding",
        ".right",
        ".bili-dyn-version-control__btn",
        "aside.left > section",
    ];
    delDOMNode(delArray);

    // 调整main区（主内容区）的宽度，由于暂时不太懂怎么引用vue，所以先这样写
    let main_asideLeft_CSS = `
  div#app main{
    flex: 10 1;
  }
  div#app aside.left{
    flex: 1 10;
  }
  `;
    //调大部分区域的字体
    //.bili-rich-text__content defalut:14px
    //.bili-dyn-interaction__item__desc defalut:13px
    //.bili-dyn-card-video__title
    //.bili-dyn-card-video__desc
    let style = document.createElement("style");
    //paratext:副文本
    let fontStyleString =
        `:root{\n
    --body-text: 18px;\n
    --paratext: 16px;\n
}\n` +
        `.bili-rich-text__content,.bili-dyn-card-video__title{\n
    font-size: var(--body-text) !important;\n
}\n` +
        `.bili-dyn-interaction__item__desc,.bili-dyn-card-video__desc{\n
    font-size: var(--paratext) !important;\n
}\n`;
    style.innerHTML = fontStyleString + main_asideLeft_CSS;
    let headIntervalId = setInterval(() => {
        let head = document.head;
        if (head) {
            head.appendChild(style);
            clearInterval(headIntervalId);
        }
    }, 100);

    //当鼠标悬浮并按下s键时，将那个视频添加到稍后再看
    //.bili-dyn-card-video 视频整体
    //.bili-dyn-card-video__mark 稍后再看按钮
    //为当前视频投稿右边添加一个按钮，点击后将视频添加到稍后再看并点赞
    let item_body_style = document.createElement("style");
    let css = `
        .bili-dyn-item__body{
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: repeat(2,1fr);
        }
        .user-add-button{
            display: flex;
            gap: 20px;
         }
         .user-add-button > div{
            /*影响动画的居中效果*/
            display: grid;
            background-color: #66ccff;
            border-radius: 50%;
            height: 129px;
            width: 129px;
            margin-top: auto;
            z-index: 1;
         }
         .user-add-button > div > div{
            border-radius: 50%;
            background-color: #d3d3d3;
            z-index: 2;
            margin: 0 auto;
            align-self: center;
            overflow: hidden;
            text-align: center;
            line-height: 129px;
            font-size: 25px;
            color: white;
            transition: all 0.3s;
         }
      `;
    item_body_style.innerHTML = css;
    //将CSS插入到head中
    {
        let id = setInterval(() => {
            let head = document.head;
            if (head) {
                head.appendChild(item_body_style);
                clearInterval(id);
            }
        }, 100);
    }

    function setButton(item) {
        let div = document.createElement("div");
        let container = document.createElement("div");
        container.setAttribute("class", "user-add-button");
        let canvas = document.createElement("canvas");
        let see_later = item.querySelector(".bili-dyn-card-video__mark");
        let like_button = item
            .querySelector(".bili-dyn-item__footer")
            .querySelector(".like");
        //对原布局进行调整
        {
            let item_body = item.querySelector(".bili-dyn-item__body");

            container.style.setProperty("grid-template-columns", "129px 1fr");

            canvas.setAttribute("width", "129");
            canvas.setAttribute("height", "105");
            canvas.style.setProperty("margin-top", "auto");

            container.append(div);
            container.append(canvas);
            if (
                item_body.querySelector(".bili-dyn-item__interaction") == null
            ) {
                item_body.appendChild(container);
            } else {
                item_body.insertBefore(
                    container,
                    item_body.querySelector(".bili-dyn-item__interaction")
                );
            }
        }

        //为按钮增加动画效果
        let animation = document.createElement("div");
        {
            animation.textContent = "已成功";
            div.appendChild(animation);
            animation.style.setProperty("width", "0px");
            animation.style.setProperty("height", "0px");
        }
        div.addEventListener("click", () => {
            if (animation.style.getPropertyValue("width") == "0px") {
                animation.style.setProperty("width", "129px");
                animation.style.setProperty("height", "129px");
            } else {
                animation.style.setProperty("width", "0px");
                animation.style.setProperty("height", "0px");
            }
            try {
                see_later.click();
                if (like_button.getAttribute("class").indexOf("active") == -1) {
                    console.log("you like it");
                    like_button.click();
                }
            } catch (e) {
                console.error(e);
            }
        });
        //第二次更改方案难以使用，其思路是使用ctx操作像素实现动画，但是由于data:image的图像不是纯色，难以筛选，故放弃
        //第三方案，思路是自己绘制路径，然后用clip裁剪以及lineTo的线条(从下到上)，实现动画，像素操作过于难了，而且浪费性能
        //按钮右侧复制一个点赞
        let like_border = new Path2D(
            "M9.72 31.95h2.5V12.37h-2.5zM24.44 9.73h10.42a4.15 4.15 0 013.33 1.67 4.38 4.38 0 01.56 3.47L34.3 29.59a6.37 6.37 0 01-6 4.86H5a4.52 4.52 0 01-4.31-2.36 5.61 5.61 0 01-.69-2.5V14.73a4.93 4.93 0 012.5-4.31A8.38 8.38 0 015 9.73h6.25l6.8-8.49a3.83 3.83 0 016.64 2.94zm10.14 2.51H21.66l.28-2.92.42-5.14a1.26 1.26 0 00-.18-1 1.28 1.28 0 00-.82-.56 1.11 1.11 0 00-1.25.42l-6.36 8.2-.83 1.11H4.58a2 2 0 00-.83.28 2.28 2.28 0 00-1.25 2.08v14.88a2 2 0 00.42 1.25A2 2 0 005 31.95h23.33a2.38 2.38 0 001.39-.41 3.61 3.61 0 002.08-2.78l4.44-14.58 2.5.56-2.5-.56a2.45 2.45 0 00-.14-1.39 2.89 2.89 0 00-1.52-.54l.28-2.5z"
        );
        let like_clip = new Path2D(
            "M9.72 31.95M24.44 9.73h10.42a4.15 4.15 0 013.33 1.67 4.38 4.38 0 01.56 3.47L34.3 29.59a6.37 6.37 0 01-6 4.86H5a4.52 4.52 0 01-4.31-2.36 5.61 5.61 0 01-.69-2.5V14.73a4.93 4.93 0 012.5-4.31A8.38 8.38 0 015 9.73h6.25l6.8-8.49a3.83 3.83 0 016.64 2.94z"
        );
        try {
            let ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("ctx is null");
            ctx.save();
            ctx.scale(3, 3);
            ctx.fillStyle = "#d3d3d3";
            ctx.fill(like_border);
            //为鼠标移入移出以及点击时添加效果
            function mouseoverEvent(e) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#00a1d6";
                ctx.fill(like_border);
                ctx.save();
                ctx.clip(like_clip);
            }
            function mouseoutEvent(e) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#d3d3d3";
                ctx.fill(like_border);
            }
            canvas.addEventListener("mouseover", mouseoverEvent);
            canvas.addEventListener("mouseout", mouseoutEvent);
            canvas.addEventListener("click", (e) => {
                canvas.removeEventListener("mouseout", mouseoutEvent);
                canvas.removeEventListener("mouseover", mouseoverEvent);
                ctx.fillStyle = "#00a1d6";
                requestAnimationFrame(clickAnimeFunction);
                like_button.click();
            });
            let clickAnimeFunction = clickAnime.bind();
            let animeTime = 0;
            //用于实现反向动画
            function clickAnime() {
                if (canvas.height - animeTime < 0) {
                    window.cancelAnimationFrame(clickAnimeFunction);
                    animeTime = 0;
                    console.log("anime end");
                    return;
                }
                ctx.fillRect(
                    0,
                    canvas.height - 10 - animeTime,
                    canvas.width,
                    3
                );
                animeTime += 3;
                window.requestAnimationFrame(clickAnimeFunction);
            }
        } catch (e) {
            console.error(e);
        }
    }
    //将显示视频时长的文字转移到播放量旁边
    function setVideoTimeFont(item) {
        let videoTime = item.querySelector(
            ".bili-dyn-card-video__duration"
        ).textContent;
        let positionNode = item.querySelector(".bili-dyn-item__footer");
        let newVideoTime = document.createElement("div");
        {
            newVideoTime.style.setProperty("width", "92px");
            newVideoTime.style.setProperty("width", "48px");
            newVideoTime.style.setProperty("line-height", "48px");
            newVideoTime.style.setProperty("font-size", "20px");
        }
        newVideoTime.textContent = videoTime;
        positionNode.appendChild(newVideoTime);
    }
    let videoList = [];
    setInterval(() => {
        let video = document.querySelector(".bili-dyn-list__items").children;
        if (video.length > 0) {
            videoList = video;
            videoList.forEach((item) => {
                //通过querySelector确认有没有超链接标签<a>，过滤非视频的动态
                if (
                    item.querySelector(".bili-dyn-content__orig__major") ==
                        null ||
                    item
                        .querySelector(".bili-dyn-content__orig__major")
                        .querySelector("a") == null
                ) {
                    return;
                }
                if (item.getAttribute("data-userJs") == null) {
                    item.setAttribute("data-userJs", "true");
                    setButton(item);
                    setVideoTimeFont(item);
                }
            });
        }
    }, 1000);
    //B站动态页透明效果.js移过来的
    function setBackgroundColor(div) {
        div.style.setProperty("background-color", "rgba(255,255,255,0)");
    }
    function set_list_item_css() {
        let cssText = `
        div.bili-dyn-item,
        div.bili-dyn-card-video__body,
        div.bili-dyn-content > div.bili-dyn-content__orig,
        div.dyn-reserve__card,
        div.bili-dyn-card-live__body,
        div.dyn-ugc__wrap,div.dyn-goods__wrap,
        div.bili-dyn-card-pgc__body,
        a.bili-dyn-card-common,
        div.bili-dyn-list-tabs{
            background-color: rgba(255, 255, 255, 0);
        }
        a.bili-dyn-card-video,
        a.bili-dyn-card-music,
        div > div.bili-dyn-item__extra.border-top,
        a.bili-dyn-card-live,
        a.bili-dyn-card-pgc,
        a.bili-dyn-card-common{
            border-color:rgba(255, 255, 255, 0);
        }
        /*设置评论区*/
        div.bb-comment,div.comment-header,div.bili-rich-textarea__inner{
            background-color: rgba(255, 255, 255, 0);
        }
        div.bb-comment .comment-header,
        .bb-comment div.bottom-page.center,
        .bb-comment .comment-send div.comment-emoji,
        div.bili-dyn-forward__more,
        div.bili-dyn-forward-publishing__editor,
        .bb-comment .comment-list div.list-item .con{
            border-color:rgba(255, 255, 255, 0);
        }
        .bb-comment .comment-send .textarea-container div.ipt-txt{
            background-color: rgba(255, 255, 255, 0);
            border-color:rgba(255, 255, 255, 0);
        }
        .bb-comment .comment-send div.comment-emoji{
            box-shadow: none;
        }
        /*设置评论*/
        /*设置评论的输入框*/
        .bb-comment .comment-send div.textarea-container{
            width:100px;
            height:100px;
            margin-left: 110px;
            border-radius: 50px;
            transition-property: width;
            transition-duration: 0.7s;
        }
        .bb-comment .comment-send .textarea-container textarea.ipt-txt
        {
            width:100px;
            height:100px;
            border-radius: 50px;
            transition-property: width,background-color;
            transition-duration: 0.7s;

            font-size: 20px;
            overflow: hidden;
            padding-left: calc(10px + 30px);
        }
        .bb-comment .comment-send .textarea-container textarea.ipt-txt:focus{
            width: calc(100% - 20px);
            background-color: rgba(255, 255, 255, 0.8);
        }
        .bb-comment .comment-send div.textarea-container.focus{
            width:75%;
        }
        .bb-comment .comment-send .textarea-container textarea.ipt-txt::placeholder{
            color: rgba(255, 255, 255, 0);
        }
        /*设置评论的输入框左边的头像*/
        .bb-comment .comment-send > div.user-face{
            width:100px !important;
            height:100px !important;
        }
        .bb-comment .comment-send > div.user-face div.bili-avatar{
            width:100px !important;
            height:100px !important;
        }
        /*设置右边的提交按钮上下居中*/
        .bb-comment .comment-send button.comment-submit{
            top:18px;
        }
        /*设置鼠标悬浮在某一条评论时的效果*/
        div.comment-list > div.list-item{
            border-radius: 50px;
            transition: background-color 0.2s;
        }
        div.comment-list > div.list-item:hover{
            background-color: #80deea;
        }
        /*设置查看up动态那一栏*/
        main > section .bili-dyn-up-list{
            background-color: #7986cb;
            border-radius: 50px;
        }
        div > div.bili-dyn-up-list__item__face{
            border: none;
            box-shadow: none;
            width: 50px;
            height:50px;
            transition-property: width,height;
            transition-duration: 0.7s;
        }
        div > div.bili-dyn-up-list__item__face:hover{
            width:72px;
            height:72px;
        }
        div.bili-dyn-up-list__prev,div.bili-dyn-up-list__next{
            transition-property: opacity;
            transition-duration: 0.7s;
            filter: brightness(10);
            opacity: 0;
        }
        main > section:hover .bili-dyn-up-list__prev,main > section:hover .bili-dyn-up-list__next{
            opacity: 1;
        }
        /*设置左侧的正在直播栏*/
        div#app aside.left > section.sticky{
            z-index: 20;
        }
        .bili-dyn-live-users > .bili-dyn-live-users__body{
            --item-height: 50px;
            --item-width: 50px;
            --background-color: #66ccff;
            width: 100px;
            display: flex;
            flex-flow: column nowrap;
            padding: 20px 0;
            background-color: var(--background-color);
            /*设置z-index使背景色不混合导致颜色出错*/
            z-index: 0;
            border-radius: 50px;
            gap: 10px;
        }
        div.bili-dyn-live-users__item{
            width: var(--item-width);
            flex-basis: var(--item-height);
            margin: 0 25px;
            padding: 0;
            overflow: hidden;
            border-radius: 50px;
            background-color: red;
            /*设置z-index使背景色不混合导致颜色出错*/
            z-index: 1;
            transition-property: width,flex-basis,margin;
            transition-duration: 0.7s;
        }
        div.bili-dyn-live-users__item__face-container,div.bili-dyn-live-users__item__face{
            width: var(--item-width);
            height: var(--item-height);
            transition-property: width,height;
            transition-duration: 0.7s;
        }
        div.bili-dyn-live-users__item__right{
            justify-content: center;
        }
        div.bili-dyn-live-users__item__right > div{
            color: white;
            font-size: 15px;
        }
        .bili-dyn-live-users__item:hover{
            width: 250px;
            flex-basis: 76px;
            margin: 0 12px;
        }
        .bili-dyn-live-users__item:hover div.bili-dyn-live-users__item__face-container,
        .bili-dyn-live-users__item:hover div.bili-dyn-live-users__item__face 
        {
            width: 76px;
            height: 76px;
        }
        /*设置鼠标悬浮在一条动态的效果*/
        .bili-dyn-content{
            padding: 20px;
            border-radius: 20px;
            transition-property: background-color;
            transition-duration: 0.7s;
        }
        .bili-dyn-item:hover .bili-dyn-content{
            background-color: #90CAF9;
        }
        .bili-dyn-item:hover .bili-dyn-item__header{
            background-color: #F3E5F5;
        }
        .bili-dyn-item:hover div.bili-dyn-item__more{
            background-color: #BA68C8;
        }
        .bili-dyn-item:hover div.bili-dyn-title,.bili-dyn-item:hover div.bili-dyn-item__desc{
            padding-left: 30px;
        }
        .bili-dyn-item__header{
            width:532px;
            position: relative;
            border-radius: 20px;
            transition-property: background-color;
            transition-duration: 0.7s;
        }
        .bili-dyn-title{
            transition: padding-left 0.7s;
        }
        .bili-dyn-item__desc{
            width:max-content;
            transition: padding-left 0.7s;
        }
        div.bili-dyn-item__ornament{
            width:max-content;
            right: 30px;
            top: 27px;
        }
        div.bili-dyn-item__more{
            top: 35px;
            right: 5px;
            width: 20px;
            height: 20px;
            border-radius: 10px;
            transition: background-color 0.7s;
        }
        div.bili-dyn-more__btn{
            right: 2px;
        }
        /*设置tabs*/
        div.bili-dyn-list-tabs{
            border-radius: 20px;
            transition-property: background-color;
            transition-duration: 0.7s;
        }
        div.bili-dyn-list-tabs:hover{
            background-color: #90CAF9;
        }
        /*设置发动态的那一栏*/
        main > section:first-child{
            display: flex;
        }
        div.bili-dyn-publishing{
            height: 0px;
            flex: 1;
            display: none;
            background-color: #8d6e63;
            border-radius: 50px;
            transition-property: height;
            transition-duration: 0.4s;
        }
        main > section .bili-user-button{
            max-width:100px;
            height:100px;
            text-align: center;
            line-height: 100px;
            background-color: #66ccff;
            border-radius: 50px;
            color: white;
            transition-property: background-color,color;
            transition-duration: 0.4s;
            flex:1 100px;
        }

    `;
        let style = document.createElement("style");
        style.innerHTML = cssText;
        document.head.appendChild(style);
    }
    function getAndSetBackgroundColor(selector) {
        let id = window.setInterval(() => {
            let div = document.querySelector(selector);
            if (div != null) {
                setBackgroundColor(div);
                window.clearInterval(id);
            }
        }, 100);
    }
    //计算图片的溢出尺寸
    let overflowHeight = 0;
    let elementHeight = 0;
    function getOverflowHeight() {
        if (bg.complete && bg.offsetHeight > 0 && bg.offsetWidth > 0) {
            let elementWidth = bg.offsetWidth;
            elementHeight = bg.offsetHeight;
            console.log("元素宽度: " + elementWidth + "px");
            console.log("元素高度: " + elementHeight + "px");

            let backgroundWidth = bg.naturalWidth;
            let backgroundHeight = bg.naturalHeight;
            console.log("图片宽度: " + backgroundWidth + "px");
            console.log("图片高度: " + backgroundHeight + "px");

            let innerWidth = window.innerWidth;
            let innerHight = window.innerHeight;
            console.log("窗口宽度: " + innerWidth + "px");
            console.log("窗口高度: " + innerHight + "px");
            // 计算溢出尺寸
            let overflowWidth = elementWidth - innerWidth;
            overflowHeight = elementHeight - innerHight;

            console.log("溢出宽度: " + overflowWidth + "px");
            console.log("溢出高度: " + overflowHeight + "px");
        }
    }
    //
    //
    //
    //
    let n = Math.floor(60 * Math.random()) + 1;
    let bg_url = `https://192.168.0.100:10000/ghs/${n}.jpg`;

    var bg = new Image();
    bg.src = bg_url;
    //为bg添加style以及设置属性
    {
        bg.style.setProperty("position", "fixed");
        bg.style.setProperty("top", "0");
        bg.style.setProperty("left", "0");
        bg.style.setProperty("width", "100%");
        bg.style.setProperty("z-index", "-1");
    }

    bg.onload = () => {
        let body = document.body;
        let del_bg = document.querySelector("div#app > div.bg");
        if (del_bg != null) del_bg.remove();
        if (body != null) {
            body.appendChild(bg);
            getOverflowHeight();
            setBackgroundImgMove();
        }
    };

    //设置背景图片随着鼠标移动而移动
    function setBackgroundImgMove() {
        let event = (e) => {
            let now_y = e.clientY;
            let moveValue = (overflowHeight / window.innerHeight) * now_y;
            bg.style.setProperty("top", -moveValue + "px");
        };
        //该方法需要在窗口调整时重新调用，所以在这里尝试删除之前的事件监听器
        document.body.removeEventListener("mousemove", event);
        document.body.addEventListener("mousemove", event);
    }
    //窗口大小改变时重新计算溢出尺寸
    let resizeTimer;
    //定时器防抖
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            getOverflowHeight();
            bg.style.setProperty("top", "0");
            setBackgroundImgMove();
        }, 300);
    });

    //设置样式
    let css_id = window.setInterval(() => {
        if (document.head != null) {
            set_list_item_css();
            window.clearInterval(css_id);
        }
    }, 100);
    //清除一些行内样式
    let clearDivStyle = window.setInterval(() => {
        let items = document.querySelector(".bili-dyn-list__items");
        if (items) {
            for (let item of items.children) {
                let comment_button = item.querySelector(
                    ".bili-dyn-item__footer .comment"
                );
                if (comment_button) {
                    if (
                        comment_button.getAttribute(
                            "data-setClearStyleEventSuccess"
                        ) == "true"
                    )
                        continue;
                    comment_button.addEventListener("click", () => {
                        let id = window.setInterval(() => {
                            let element = item.querySelector(".bili-avatar");
                            if (element) {
                                element.style = "";
                                window.clearInterval(id);
                            }
                        });
                    });
                    comment_button.setAttribute(
                        "data-setClearStyleEventSuccess",
                        "true"
                    );
                }
            }
            window.clearInterval(clearDivStyle);
        }
    }, 1000);
    //设置查看UP动态那一栏
    {
        let all;
        let next;
        let prev;
        let upList;
        let upList_content;
        let id = window.setInterval(() => {
            all = document.querySelector("div.bili-dyn-up-list");
            if (all) {
                {
                    prev = all.querySelector(".bili-dyn-up-list__prev");
                    next = all.querySelector(".bili-dyn-up-list__next");
                    upList_content = all.querySelector(
                        ".bili-dyn-up-list__content"
                    );
                    upList = upList_content.children;
                    all.addEventListener("click", () => {
                        setTabs();
                    });
                }
                for (let item of upList) {
                    let textDiv = item.querySelector(
                        ".bili-dyn-up-list__item__name"
                    );
                    textDiv.remove();
                }
                window.clearInterval(id);
            }
        }, 100);
    }
    //设置左侧的正在直播栏
    {
        let body;
        let id = window.setInterval(() => {
            let live_users = document.querySelector(
                "aside.left div.bili-dyn-live-users"
            );
            let list = [];
            if (live_users) {
                {
                    //删除顶部的“正在直播”
                    live_users
                        .querySelector(".bili-dyn-live-users__header")
                        .remove();
                    body = live_users.querySelector(
                        ".bili-dyn-live-users__body"
                    );
                }
                window.clearInterval(id);
            }
        }, 100);
    }
    //设置发动态的那一栏
    {
        let id = window.setInterval(() => {
            let publishing = document.querySelector("div.bili-dyn-publishing");
            if (publishing) {
                let button = document.createElement("button");
                button.innerText = "我要发动态";
                button.setAttribute("class", "bili-user-button");
                publishing.parentElement.insertBefore(button, publishing);
                //为按钮添加点击事件
                {
                    button.addEventListener("click", () => {
                        if (button.innerText == "我要发动态") {
                            button.style.setProperty("background-color", "red");
                            button.style.setProperty("color", "blue");
                            button.innerHTML = "不想发动态";
                            publishing.style.setProperty(
                                "display",
                                "inline-block"
                            );
                            publishing.style.setProperty("height", "150px");
                        } else {
                            button.style.setProperty(
                                "background-color",
                                "#66ccff"
                            );
                            button.style.setProperty("color", "white");
                            button.innerHTML = "我要发动态";
                            window.setTimeout(() => {
                                publishing.style.setProperty("display", "none");
                            }, 400);
                            publishing.style.setProperty("height", "0px");
                        }
                    });
                }
                window.clearInterval(id);
            }
        }, 100);
    }
    //设置提交评论按钮快捷键ctrl+Enter
    {
        let id = window.setInterval(() => {
            let textareas = document.querySelectorAll("textarea.ipt-txt");
            for (let textarea of textareas) {
                if (textarea) {
                    //为按钮添加ctrl+Enter快捷键
                    if (textarea.getAttribute("data-shortcut") == null) {
                        textarea.setAttribute("data-shortcut", "true");
                    } else continue;
                    let button = textarea.parentElement.querySelector("button");
                    let clickbutton = (e) => {
                        if (e.ctrlKey && e.key == "Enter") {
                            button.click();
                        }
                    };
                    textarea.addEventListener(
                        "keydown",
                        () => {
                            if (textarea.getAttribute("data-keydown") == null) {
                                textarea.setAttribute("data-keydown", "true");
                            } else return;
                            textarea.addEventListener("keydown", clickbutton);
                        },
                        true
                    );
                    textarea.addEventListener("blur", () => {
                        textarea.removeEventListener("keydown", clickbutton);
                        textarea.removeAttribute("data-keydown");
                    });
                }
            }
        }, 100);
    }

    getAndSetBackgroundColor("aside.left div.bili-dyn-live-users");
    //由于tabs点击后会刷新元素，所以需要重新设置背景色
    //由于选择上面的具体UP主的动态会刷新tabs，所以需要重新获取
    getAndSetBackgroundColor(
        "div.bili-dyn-publishing div.bili-rich-textarea__inner"
    );
    // Your code here...
    // Your code here...
})();
