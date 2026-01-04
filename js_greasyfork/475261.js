// ==UserScript==
// @name         Axure分享页面汉化脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Axure网页汉化
// @author       alone
// @license MIT
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARJSURBVFhHvZdfTFtVHMdrYqJjZi+++GD2gMvUGOKD+mAAmRrjv0xMFqNE3rbJiGEPsIVsZhM33bJFG4Yyi9kiiGlWJxJhgRmCm0i3MWRrKWtLKaG40RZue3vbe9ve238/z7m3veW0p6UxwEk+Ofmd3/fe34fS9oJm9RoaGtrGMMxuv9+/D7F/PeE4bu/y8vKbWq12S3ocudDghng8zqVSKdhIYqLodblce9JjleX1evehZiqZE96oOplMxq1W67vy8La2tjJJknzoEDc2jVCIt6HxD2vsdvtrtMAmkOrs7HxW43Q6P0qgA5lEek8jxRKg+80KR3+ehsO/2mDaHSL6uXlcO/1m+Mn0BXSbPofBWR3EE4mC+f7+/l0ah8NRl8AhCiwXgdqWq1D92Z/w/MlxqD5/F/yCRM1iQlEWTvz1ARweeV3myOjbEJEEahbT19f3qiyALQvRPeRQBXacuQ0NA/MQi8ep2V7zCXU45vrCZWouQ1Ygjg4KIEpx+ET3jyrwpPYO9FqYvNzU0igxXDd5SBHNya1GFrAhARwsxiLDQ+XZm6rA9vMWsPvCRObC1BF1+LFrtcDwbqJPo2QBzIDZqwo83mGGGsMcCGJM7a/wS3AcDcYCkw9GiGsLoQjYHHVSLIbe8XEE3jPk181XnKrAtk4LHDW6if6dpWvofXBSrbM9ep0WsKUF1oYVolB5cUYVeKzrHoy4OCITFsNEXYw8AVFSKFbfvh+EJ76blgXKdPegvHcWPKFoydevrlUBUZJQo3S+mXCrAlu6rLDn6iJERXq2GP9b4OscgXeuuCAiitRsMVQBbF8qE/9yxK9ge88sLAbC1OxayAIzsoCIDtbGF4oQb8KtSGDQyVKzpaAK4JevFFoG54iPYcvYA6LPj88B13GdOCuGQRaYQQJRdLAGAyYP8UVUdckBHPpYZvphbwB8leeA2XkKeOM8cW0h0gIzdeFoFIqx4OWg6uwt4qvY4g0SGfbTy8A89ZWMr6oDhOUA0aeRFYikD/GeIV3z4Qgc6CIfRt0mb16e+8GoCmDYA7+AEIlkM5T7qwI4KKBDZc+g1D3Ds+Tj+Hf0DKDlkah//yVCguuZWJXJv7/BQAjkY7Z5oPbQH6pAzfd3wRPgqVkM72XBV/1tVuK5MxCavk/NYgwGgyKAX2b8E+A9A66bj4/A7mblL6IXvjTCDSdD9HPzeA/emgfm6dOqhO/9CwXzsoBZFgijw3xOnxuHj4+Nwnun/oYfxxaoGRqBizeAeUkLzIta8B/so2YwsoDJYvlQPRTIwEbXer2+RjM8PPxyCDU2myDPJ+vr63fg/00eXXK7HSFBQI3Nw2a3G9HsR7CAplevf8vHspEgLyCzjcezssK2trZWycPT66H29vY3rHb7ZCAYStAuWg9YLhibMpnGmpqaqvFMZTS5yioqKp5paGh4pbGxsWY92YvuWV5evhPN2KqMwkuj+Q9ZLc3BjV9w+wAAAABJRU5ErkJggg==
// @match        *://*.axshare.com/*
// @match        *://127.0.0.1:32767/*
// @grant        GM_addStyle
// @run-at       document-end
// @require https://greasyfork.org/scripts/475259-elementgetter-alone/code/ElementGetter_Alone.js?version=1250106
// @downloadURL https://update.greasyfork.org/scripts/475261/Axure%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475261/Axure%E5%88%86%E4%BA%AB%E9%A1%B5%E9%9D%A2%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

var messages = {
  ".feedback-panel-empty-state__title":"无评论",
  ".feedback-panel-empty-state > div:nth-child(2)":
  "添加评论以反馈，提出疑问或改动建议。",
  ".feedback-item-confirm-delete-popup > .feedback-item-confirm-delete-popup__actions > button[type=button]":
  "取消",
  ".feedback-item-confirm-delete-popup > .feedback-item-confirm-delete-popup__actions > button[type=submit]":
  "删除",
  "#loginForm > div.form-title": "请输入密码",
  "#loginForm > div.userLoginBox > div:nth-child(2) > button": "查看项目",
  "#coreContents > div > div.form-title": "项目正在生成中...",
  "#coreContents > div > div:nth-child(3)": "这可能需要几分钟。",
  "div.feedback-reply-container > div.ax-reply.feedback-thread-reply-container.ax-reply--editable > div > div > p":
  "",
  ".feedback-item-submit-edit > button[type=button]": "取消",
  ".feedback-item-submit-edit > button[type=submit]": "保存",
  ".feedback-panel-header-row__mark-as-read-button": "全部已读",
  "#interfaceControlFrameRight > div.ax-menu.share-button-container > div > button":
  "分享",
  "#interfaceControlFrameRight > div.ax-menu.share-button-container > div.ax-menu__content.ax-menu__content.share-button-dialog > div.toggle-current-page > span":
  "连接到本页面",
  "#interfaceControlFrameRight > div.ax-menu.share-button-container > div.ax-menu__content.ax-menu__content.share-button-dialog > div:nth-child(3) > div.share-url > div":
  "分享链接",
  "#interfaceControlFrameRight > div.ax-menu.share-button-container > div.ax-menu__content.ax-menu__content.share-button-dialog > div:nth-child(4) > div.share-url > div":
  "分享并打开页面和评论",
  ".ax-copy-to-clipboard > button": "复制",
  "#pageNotesEmptyState > div.emptyStateTitle": "本页面没有备注",
  "#pageNotesEmptyState > div.emptyStateContent":
  "在Axure RP中添加的备注会在这里展示",
  "#feedbackHost > div > div.feedback-panel-header > div > div.feedback-panel-header__mode > div > div.ax-menu__content.ax-menu__content.filter-content > div.filter-inner-content > div:nth-child(1) > label > span":
  "仅本页面",
  "#feedbackHost > div > div.feedback-panel-header > div > div.feedback-panel-header__mode > div > div.ax-menu__content.ax-menu__content.filter-content > div.filter-inner-content > div:nth-child(2) > label > span":
  "未读",
  "#feedbackHost > div > div.feedback-panel-header > div > div.feedback-panel-header__mode > div > div.ax-menu__content.ax-menu__content.filter-content > div.filter-inner-content > div:nth-child(3) > label > span":
  "已处理",
  "#feedbackHost > div > div.feedback-panel-header > div > div.feedback-panel-header__mode > div > div.ax-menu__content.ax-menu__content.filter-content > div.ax-feedback-pin-color-picker.filter-colors > div > button:nth-child(1)":
  "全",
  "#phishing-banner-title":"来自Axure的消息"
};
var replace = [
  {
    key: "#interfaceControlFrameRight > div.ax-menu.share-button-container > div.ax-menu__content.ax-menu__content.share-button-dialog > div.share-note",
    search: "Copy the URL in the browser to share the current page and player configuration.",
    replace: "复制 URL 以共享当前页面和播放器设置。",
  },
  {
    key: "#interfaceControlFrameRight > div.ax-menu.share-button-container > div.ax-menu__content.ax-menu__content.share-button-dialog > div.share-note > div > span",
    search: " For a share link without the prototype player ",
    replace: "仅复制当前页面的分享链接",
  },
  {
    key: "#interfaceControlFrameRight > div.ax-menu.share-button-container > div.ax-menu__content.ax-menu__content.share-button-dialog > div.share-note > div > a",
    search: " click here ",
    replace: "点击这里",
  },
  {
    key: "#changePageInstructions",
    search: "Use",
    replace: "使用",
  },
  {
    key: "#changePageInstructions",
    search: "and",
    replace: "和",
  },
  {
    key: "#changePageInstructions",
    search: "keys",
    replace: "按键",
  },
  {
    key: "#changePageInstructions",
    search: "to move between pages",
    replace: "在页面间切换",
  },
  {
    key: "div.feedback-issue-replies-summary > span",
    search: /.+/,
    replace: "查看回复",
  },
  {
    key: ".ax-form-errors__error",
    search: " Please enter text ",
    replace: "请输入内容",
  },
  {
    key: ".feedback-item-confirm-delete-popup > .feedback-item-confirm-delete-popup__question",
    search: " Are you sure? ",
    replace: "确定删除？",
  },
  {
    key: ".feedback-reply-actions > div > .feedback-reply-actions__mark-resolved > button",
    search: "Post and Resolve",
    replace: "回复并处理",
  },
  {
    key: ".feedback-reply-actions > div > .feedback-reply-actions__mark-resolved > button",
    search: " Post and Unresolve ",
    replace: "回复并取消处理",
  },
  {
    key: ".feedback-reply-actions > div > div:nth-child(1) > button",
    search: "Post",
    replace: "回复",
  },
  {
    key: ".feedback-commenting-as",
    search: " Commenting as ",
    replace: "",
  },
  {
    key: "#showHotspotsOption",
    search: "Show Hotspots",
    replace: "显示热点",
  },
  {
    key: "#showNotesOption",
    search: "Show Note Markers",
    replace: "显示笔记",
  },
  {
    key: "#showCommentsOption",
    search: "Show Comments",
    replace: "显示评论",
  },
  {
    key: "#showHotspotsOption",
    search: "Show Hotspots",
    replace: "显示热点",
  },
  {
    key: "#interfaceScaleListContainer > div:nth-child(1)",
    search: "Default Scale",
    replace: "默认比例",
  },
  {
    key: "#interfaceScaleListContainer > div:nth-child(2)",
    search: "Scale to Width",
    replace: "适合宽度",
  },
  {
    key: "#interfaceScaleListContainer > div:nth-child(3)",
    search: "Scale to Fit",
    replace: "适合大小",
  },
  {
    key: "#coreContents > div > div:nth-child(4)",
    search: /If you have any questions, please email.+/,
    replace: "",
  },
  {
    key: "#core > div.loginLinkContents",
    search: " Workspace members can ",
    replace: "项目成员可以",
  },
  {
    key: "#core > div.loginLinkContents",
    search: "sign in to Axure Cloud",
    replace: "登录到 Axure 云",
  },
  {
    key: "#core > div.loginLinkContents",
    search: "to view this project.",
    replace: "查看此项目",
  },
  {
    key: "#pageNotesContent > div > div.widgetNoteLabel",
    search: "Rectangle",
    replace: "矩形",
  },
  {
    key: "#notesOverlay > div > div.notesDialogScroll > div > div.widgetNoteLabel",
    search: "Rectangle",
    replace: "矩形",
  },
  {
    key: ".pageNotesSectionHeader",
    search: "Rectangle",
    replace: "矩形",
  },
  {
    key: "#pageNotesSectionHeader",
    search: "Page Notes",
    replace: "页面注释",
  },
  {
    key: "#widgetNotesSectionHeader",
    search: "Widget Notes",
    replace: "小部件注释",
  },
  {
    key: "#phishing-banner-text",
    search: " strives to provide an easy and secure way to share ideas and prototypes. If you see content that may be deceptive, please ",
    replace: "努力提供一种简单而安全的方式来分享想法和原型。如果您看到可能具有欺骗性的内容，请",
  },
  {
    key: "#phishing-banner-text",
    search: "click here to report it",
    replace: "点击这里进行举报",
  },
  {
    key: "#phishing-banner-footer-tip",
    search: "Why am I seeing this?",
    replace: "为什么我会看见这条消息",
  },
  {
    key: "#phishing-banner-footer-tip > #tooltiptext",
    search: "This message appears when a page contains a link that leaves Axure Cloud.",
    replace: "当页面包含跳转到非Axure的链接时，会出现这条消息。",
  },
  {
    key: "#phishing-banner-footer-tip > #tooltiptext",
    search: "You will only see this the first time you view the project. Setting an access code on the project prevents this message from appearing.",
    replace: "只有第一次查看此项目时会显示，可以给项目设置密码来避免",
  },
  {
    key: "#phishing-banner-footer-button",
    search: "OK",
    replace: "好的",
  },
];


function Work() {
  Object.entries(messages).map(([k, v]) => {
    elmGetter.each(k, document, (reply) => {
      reply.innerText = v;
    });
  });

  replace.forEach((v) => {
    elmGetter.each(v.key, document, (reply) => {
      reply.innerHTML = reply.innerHTML.replace(v.search, v.replace);
    });
  });

  // 评论时间
  elmGetter.each("div.feedback-issue-options > span", document, (reply) => {
    if (!!reply.title) {
      var timeText = reply.title || "";
      var date = new Date(Date.parse(timeText));
      var formattedDate =
          date.getFullYear() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getDate() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds();
      reply.innerText = formattedDate;
    }
  });

  // 评论时间
  elmGetter.each(".feedback-item-content-date > span", document, (reply) => {
    if (!!reply.title) {
      var timeText = reply.title || "";
      var date = new Date(Date.parse(timeText));
      var formattedDate =
          date.getFullYear() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getDate() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds();
      reply.innerText = formattedDate;
    }
  });

  // 处理评论时间
  elmGetter.each(
    "#feedbackHost > div > div.feedback-panel-issues.feedback-panel__issues > div > div:nth-child(n) > div.feedback-issue__resolved-mark",
    document,
    (reply) => {
      const message = reply.querySelector("div:nth-child(1)");
      const time = reply.querySelector("div:nth-child(2)");
      if (message) {
        message.innerText = message.innerText.replace(
          /Resolved by (.+)/,
          "已由 $1 处理"
        );
      }
      if (time) {
        var timeText = time.innerText;
        var date = new Date(Date.parse(timeText));
        var formattedDate =
            date.getFullYear() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getDate();
        time.innerText = formattedDate;
      }
    }
  );

  // 有状态的按钮切换时修改文字
    // 配置 MutationObserver 监听 class 属性的变化
    const config = { attributes: true, attributeFilter: ["class"] };

    // 添加评论按钮
    elmGetter
        .get("#feedbackHost > div > div.feedback-panel-add-comment > button")
        .then((button) => {
        if (
            button.className ==
            "feedback-panel-add-comment-button ax-button ax-button--default ax-button--block ax-button--large"
        ) {
            button.textContent = "添加评论";
        } else {
            button.textContent = "完成";
        }
        // 创建 MutationObserver 实例
        const observer = new MutationObserver((mutationsList) => {
            // 遍历每个发生变化的属性
            for (let mutation of mutationsList) {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "class"
                ) {
                    // 当 class 属性发生变化时，修改按钮内容
                    if (
                        button.className ==
                        "feedback-panel-add-comment-button ax-button ax-button--default ax-button--block ax-button--large"
                    ) {
                        button.textContent = "添加评论";
                    } else {
                        button.textContent = "完成";
                    }
                }
            }
        });

        // 开始监听按钮的变化
        observer.observe(button, config);
    });

};

function Style() {

  //筛选选项加样式
  elmGetter.each(".color-list > button", document, (reply) => {
    if (!!reply.style) {
      reply.style.width = "16px";
      reply.style.height = "16px";
    }
  });
  //筛选选项加样式
  elmGetter.each(
    "div.ax-reply.feedback-thread-reply-container.ax-reply--editable > div > div > p",
    document,
    (reply) => {
      if (!!reply) {
        reply.dataPlaceholder = "";
      }
    }
  );

  GM_addStyle(`
    #feedbackHostBtn a {
    background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjk0Njg2NTM1MjQ5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwNDYgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1MDgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjA0LjI5Njg3NSIgaGVpZ2h0PSIyMDAiPjxwYXRoIGQ9Ik02ODguNjA2NDA2IDk5NS40Njc0MmMtNzUuOTgyNzc4IDIzLjc0NTU3OC0xNTQuMzQxMTM4IDMwLjg2NzIwNC0yMzIuNzA0NjE4IDIxLjM2OTk5NkMxNzAuOTU5OTcxIDk4My41OTQ2MzEtMzAuODcyMzIzIDcyNC43NzM5NzMgNC43NDYwNDQgNDQyLjIwNzczNyA0NS4xMTU1NzQgMTU5LjY0MTUwMSAzMDguNjgyMjc2LTM1LjA2OTE2NyA1OTEuMjQ4NTEyIDUuMjk1MjQzYzI4Mi41NjExMTYgMzUuNjE4MzY3IDQ4NC4zOTg1MyAyOTIuMDYzNDQzIDQ1MS4xNTU3NDUgNTc0LjYyOTY4LTExLjg2NzY2OSA4NS40Nzk5ODUtNDUuMTIwNjk0IDE2OC41ODk1MDktOTcuMzU3ODk1IDIzNy40NTA2NjFsLTIzLjc0NTU3OCAxNzguMDg2NzE2YzAgOS40OTIwODgtNC43NTExNjQgMTYuNjIzOTUzLTExLjg3Mjc4OSAyMS4zNjk5OTYtNy4xMjE2MjYgNC43NTExNjQtMTQuMjQzMjUxIDcuMTI2NzQ1LTIxLjM2OTk5NiA3LjEyNjc0NmwtMTk5LjQ1MTU5My0yOC40OTE2MjJ6TTI4NC45NDE4MTggNDUxLjcwNDk0NGMtNDAuMzY0NDExIDAtNzEuMjM2NzM0IDMwLjg2NzIwNC03MS4yMzY3MzUgNzEuMjM2NzM1czMwLjg2NzIwNCA3MS4yMzY3MzQgNzEuMjM2NzM1IDcxLjIzNjczNCA3MS4yMzY3MzQtMzAuODY3MjA0IDcxLjIzNjczNC03MS4yMzY3MzQtMzAuODcyMzIzLTcxLjIzNjczNC03MS4yMzY3MzQtNzEuMjM2NzM1eiBtMjM3LjQ1MDY2MSAwYy00MC4zNjQ0MTEgMC03MS4yMzY3MzQgMzAuODY3MjA0LTcxLjIzNjczNCA3MS4yMzY3MzVzMzAuODY3MjA0IDcxLjIzNjczNCA3MS4yMzY3MzQgNzEuMjM2NzM0IDcxLjIzNjczNC0zMC44NjcyMDQgNzEuMjM2NzM0LTcxLjIzNjczNC0zMC44NzIzMjMtNzEuMjM2NzM0LTcxLjIzNjczNC03MS4yMzY3MzV6IG0yMzcuNDQ1NTQyIDBjLTQwLjM2NDQxMSAwLTcxLjIzMTYxNSAzMC44NjcyMDQtNzEuMjMxNjE1IDcxLjIzNjczNXMzMC44NjcyMDQgNzEuMjM2NzM0IDcxLjIzMTYxNSA3MS4yMzY3MzRjNDAuMzY5NTMxIDAgNzEuMjM2NzM0LTMwLjg2NzIwNCA3MS4yMzY3MzQtNzEuMjM2NzM0cy0zMC44NjcyMDQtNzEuMjM2NzM0LTcxLjIzNjczNC03MS4yMzY3MzV6IiBmaWxsPSIjYmZiZmJmIiBwLWlkPSIzNTA5Ij48L3BhdGg+PC9zdmc+) no-repeat center center / 80% 80%;
}`);

  GM_addStyle(`
      ::-webkit-scrollbar {
        width: 10px;
        height: 8px;
    }
    ::-webkit-scrollbar-thumb {
        background: #E6E6E6;
        border-radius: 0.25em;
        min-height: 30px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb:hover {
        width: 12px;
        background: #ccc; // 设置滚动条滑块鼠标悬停颜色
    }`);

  GM_addStyle(`
  .widgetNoteContainer {
    border-bottom: 1px solid silver !important;
}

.pageNoteContainer > .pageNote {
    font-size: 14px;
    border: 2px solid #FEC794;
    border-radius: 5px;
    padding-inline: 10px;
    background: #FAF1E6;
}
.widgetNoteFootnote {
    font-size: 20px !important;
    line-height: 20px !important;
}
.widgetNoteContainer > .pageNote {
    font-size: 14px;
    border: 2px solid #98C1FF;
    border-radius: 5px;
    padding-inline: 10px;
    background: #E6EEFA;
}
.widgetNoteLabel {
    font-style: italic;
}
div.notesDialog {
    border-radius: 5px;
    border:none !important
}
div.annnotelabel {
    font-size: 20px;
    line-height: 20px;
}
.feedback-pin-popup{border:none !important}

div.closeNotesDialog{   top: 3px; right: 3px; width: 20px; height: 20px;background: url(https://files.axshare.com/gsr/3741/images/close_x.svg) no-repeat center center / 70% 70% !important;}

.feedback-pin-close-button{  top: 3px !important; right: 3px !important; width: 20px; height: 20px;}

.feedback-pin-close-button:hover{
    background: #E6E6E6;
    border-radius: 5px;
}
.ax-reply p.is-editor-empty:first-child:before {
    content: "请输入内容" !important;
}
div.feedback-reply-actions > div:nth-child(2) > button > svg {
    font-size: 14px;
    width: 20px;
    height: 18px !important;
}
.ax-reply .mention {
    background-color: #3eacef !important;
    border-radius: 5px !important;
    color: white !important;
}
.ax-reply .mention--current-user {
    color: #fff !important;
    background-color: #855cce !important;
}
.feedback-reply-actions__post-button {
    background-color: #3eacef !important;
}
.feedback-reply-actions__post-button:hover {
    background-color: #1482C5 !important;
}
    `);

};

(function () {
  "use strict";
  Work();
  Style();
})();
