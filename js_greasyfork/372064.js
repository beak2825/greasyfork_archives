// ==UserScript==
// @name         知乎重排for印象笔记
// @name:en      Zhihu Formatter
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  重新排版知乎的网页，使例如"印象笔记·剪藏"的web clippers只保存需要的内容。
// @description:en  Format a webpage on zhihu.com so that web clippers such as Evernote Web Clipper can save only useful information.
// @author       twchen
// @match        https://www.zhihu.com/question/*/answer/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://www.zhihu.com/pin/*
// @run-at       document-idle
// @inject-into  auto
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM.getValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      lens.zhihu.com
// @connect      api.zhihu.com
// @connect      www.zhihu.com
// @connect      unpkg.zhimg.com
// @supportURL   https://github.com/twchen/zhihu-formatter/issues
// @downloadURL https://update.greasyfork.org/scripts/372064/%E7%9F%A5%E4%B9%8E%E9%87%8D%E6%8E%92for%E5%8D%B0%E8%B1%A1%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/372064/%E7%9F%A5%E4%B9%8E%E9%87%8D%E6%8E%92for%E5%8D%B0%E8%B1%A1%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

// GM 4 API polyfill
if (typeof GM_addStyle == "undefined") {
  this.GM_addStyle = css => {
    const style = document.createElement("style");
    style.textContent = css;
    document.documentElement.appendChild(style);
    return style;
  };
}

if (typeof GM == "undefined") {
  this.GM = {};
  [
    ["getValue", GM_getValue],
    ["setValue", GM_setValue],
  ].forEach(([newFunc, oldFunc]) => {
    GM[newFunc] = (...args) => {
      return new Promise((resolve, reject) => {
        try {
          resolve(oldFunc(...args));
        } catch (error) {
          reject(error);
        }
      });
    };
  });
  GM.xmlHttpRequest = GM_xmlhttpRequest;
}

GM.asyncHttpRequest = args => {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      ...args,
      onload: resolve,
      onerror: response => {
        reject({
          message: `Status:${response.status}. StatusText: ${response.statusText}`,
        });
      },
    });
  });
};

function createElement(type, props, ...children) {
  const element = document.createElement(type);
  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith("on")) {
      const eventName = name.slice(2);
      element.addEventListener(eventName, value);
    } else if (name == "style" && typeof value !== "string") {
      Object.assign(element.style, value);
    } else {
      element.setAttribute(name, value);
    }
  });
  children
    .map(child =>
      typeof child === "string" ? document.createTextNode(child) : child
    )
    .forEach(child => element.appendChild(child));
  return element;
}

// for debugging
// unsafeWindow.GM = GM;

(async function () {
  "use strict";

  GM_addStyle(`
  .fmt-comments-container {
    box-sizing: border-box;
    border: 1px solid rgb(235, 235, 235);
    border-radius: 4px;
    align-items: stretch;
    margin-top: 1em;
    padding: 1.2em;
    display: flex;
    flex-direction: column;
  }
  .fmt-comments-count {
    font-size: 15px;
    font-weight: 600;
    padding-bottom: 1em;
    border-bottom: 1px solid rgb(235, 235, 235);
  }
  .fmt-root-comment-container {
    display: flex;
    flex-direction: column;
    padding-bottom: 1em;
    border-top: 1px solid rgb(235, 235, 235);
  }
  .fmt-comment {
    padding-top: 1em;
    display: flex;
    flex-direction: row;
  }
  .fmt-content-column {
    display: flex;
    flex-direction: column;
    margin-left: 0.5em;
  }
  .fmt-author-row {
    font-weight: 600;
  }
  .fmt-comment-content {
    margin: 0.5em 0;
    color: rgb(68, 68, 68);
  }
  .fmt-comment-info {
    color: rgb(153, 153, 153);
  }
  .fmt-emoticon {
    width: 1.4em;
    height: 1.4em;
    margin-bottom: -0.3em;
  }
  .fmt-comment-img {
    display: block;
    max-width: 10em;
    max-height: 20em;
  }
`);

  function addLinkToNav(onclick) {
    const nav = document.querySelector(".AppHeader-Tabs");
    const li = nav.querySelector("li").cloneNode(true);
    const a = li.querySelector("a");
    a.href = "#";
    a.text = "重排";
    a.onclick = event => {
      event.preventDefault();
      onclick();
    };
    nav.appendChild(li);
  }

  function addBtnToNav() {
    const pageHeader = document.querySelector("div.ColumnPageHeader-Button");
    const button = createElement("button", {
      type: "button",
      class: "Button Button--blue",
      style: {
        "margin-right": "1rem",
      },
      onclick: formatZhuanlan,
    });
    button.innerText = "重新排版";
    pageHeader.prepend(button);
  }

  function formatAnswer() {
    root.style.display = "none";
    let div = document.querySelector("#formatted");
    if (div !== null) {
      div.remove();
    }

    const showMoreBtn = document.querySelector(
      "button.Button.QuestionRichText-more"
    );
    if (showMoreBtn !== null) showMoreBtn.click();
    const title = document
      .querySelector(".QuestionHeader-title")
      .cloneNode(true);
    const question = createElement(
      "div",
      {
        style: {
          backgroundColor: "white",
          margin: "0.8rem 0",
          padding: "0.2rem 1rem 1rem",
          borderRadius: "2px",
          boxShadow: "0 1px 3px rgba(26,26,26,.1)",
        },
      },
      title
    );
    const detail = document.querySelector(
      ".QuestionHeader-main .QuestionRichText"
    );
    if (detail) question.appendChild(detail.cloneNode(true));
    const answer = document
      .querySelector("div.Card.AnswerCard")
      .cloneNode(true);
    // remove non-working actions
    const actions = answer.querySelector(".ContentItem-actions");
    actions.style.display = "none";

    div = createElement(
      "div",
      {
        id: "formatted",
      },
      question,
      answer
    );
    const answerContent = answer.querySelector(".RichContent");
    const answerId = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    const commentsUrl = `https://www.zhihu.com/api/v4/comment_v5/answers/${answerId}/root_comment?order_by=score&limit=20&offset=`;
    renderComments(commentsUrl, answerContent);
    root.after(div);
    window.history.pushState("formatted", "");
    postprocess(div);
  }

  async function formatZhuanlan() {
    root.style.display = "none";
    let div = document.querySelector("#formatted");
    if (div !== null) {
      div.remove();
    }

    const header = document.querySelector("header.Post-Header").cloneNode(true);
    const title = header.querySelector(".Post-Title");
    Object.assign(title.style, {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
    });
    const post = document.querySelector("div.Post-RichText").cloneNode(true);
    const time = document.querySelector("div.ContentItem-time").cloneNode(true);
    const topics = document
      .querySelector("div.Post-topicsAndReviewer")
      .cloneNode(true);
    const titleImage = document.querySelector(".TitleImage");

    div = createElement("div", {
      id: "formatted",
      style: {
        padding: "1rem",
        "background-color": "white",
      },
    });
    if (titleImage) {
      const img =
        (await getRealImage(titleImage)) || titleImage.cloneNode(true);
      div.appendChild(img);
    }
    div.append(header, post, time, topics);
    const articleId = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    const commentsUrl = `https://www.zhihu.com/api/v4/comment_v5/articles/${articleId}/root_comment?order_by=score&limit=20&offset=`;
    renderComments(commentsUrl, div);
    root.after(div);
    window.history.pushState("formatted", "");
    postprocess(div);
  }

  async function formatPin() {
    let div = document.querySelector("#formatted");
    if (div !== null) {
      div.remove();
    }

    const pinItem = document.querySelector(".PinItem");
    div = pinItem.cloneNode(true);
    div.id = "formatted";
    div.style.margin = "1rem";

    const remainContents = div.querySelectorAll(
      ".PinItem-remainContentRichText"
    );
    remainContents.forEach(remainContent => {
      // assume either the original pin or the repost pin has non-text content (video/image), not both.
      // otherwise the code may not run correctly.
      if (remainContent.querySelector(".RichText-video")) {
        // show video
        replaceVideosByLinks(remainContent);
      }
      const preview = remainContent.querySelector(".Image-Wrapper-Preview");
      if (preview) {
        // show all images
        replaceThumbnailsByRealImages(preview);
      }
    });

    const comments = div.querySelector(".Comments-container");
    comments.style.display = "none";

    const pinId = window.location.href.substring(
      window.location.href.lastIndexOf("/") + 1
    );
    const commentsUrl = `https://www.zhihu.com/api/v4/comment_v5/pins/${pinId}/root_comment?order_by=score&limit=20&offset=`;
    renderComments(commentsUrl, div);

    root.after(div);
    root.style.display = "none";
    window.history.pushState("formatted", "");
    fixLinks(div);
    convertEquations(div);
  }

  async function replaceThumbnailsByRealImages(preview) {
    try {
      const groups = /^\/pin\/(\d+)/.exec(window.location.pathname);
      const pinId = groups[1];
      const response = await GM.asyncHttpRequest({
        method: "GET",
        url: "https://api.zhihu.com/pins/" + pinId,
      });
      const pinInfo = JSON.parse(response.responseText);
      const content = (pinInfo.origin_pin || pinInfo).content;
      const images = await Promise.all(
        content
          .filter(item => item.type === "image")
          .map(item => createImgFromURL(item.url))
      );
      const div = createElement("div", {}, ...images);
      preview.replaceWith(div);
    } catch (error) {
      console.error(`Error getting all images: ${error.message}`);
    }
  }

  function replaceVideosByLinks(el) {
    let videoDivs = el.querySelectorAll(".RichText-video");
    if (el.classList.contains("RichText-video")) {
      videoDivs = [...videoDivs, el];
    }
    const newTitle = createElement("div", { style: { margin: "0.5rem auto" } });
    newTitle.innerText = "视频";
    videoDivs.forEach(async div => {
      try {
        const attr = div.attributes["data-za-extra-module"];
        const videoId = JSON.parse(attr.value).card.content.video_id;
        const href = "https://www.zhihu.com/video/" + videoId;
        const response = await GM.asyncHttpRequest({
          method: "GET",
          url: "https://lens.zhihu.com/api/videos/" + videoId,
          headers: {
            "Content-Type": "application/json",
            Origin: "https://v.vzuu.com",
            Referer: "https://v.vzuu.com/video/" + videoId,
          },
        });
        const videoInfo = JSON.parse(response.responseText);
        const thumbnail = videoInfo.cover_info.thumbnail;

        const layout = div.querySelector(".VideoCard-layout");
        layout.style.textAlign = "center";
        layout.prepend(newTitle.cloneNode(true));

        const title = layout.querySelector(".VideoCard-title");
        if (title) {
          layout.children[0].innerText = "视频：" + title.innerText;
          title.parentNode.remove();
        }
        const video = layout.querySelector(".VideoCard-video");
        const a = createElement(
          "a",
          { href: href, style: { width: "100%" } },
          createElement("img", {
            src: thumbnail,
            style: { "max-width": "100%" },
          })
        );
        video.replaceWith(a);
      } catch (error) {
        console.error(`Error getting video info: ${error.message}`);
      }
    });
  }

  function enableGIF(div) {
    try {
      const src = div.querySelector("img").src;
      const i = src.lastIndexOf(".");
      const img = createElement("img", {
        src: src.slice(0, i + 1) + GIF_EXT,
        style: {
          maxWidth: "100%",
          display: "block",
          margin: "auto",
        },
      });
      div.replaceWith(img);
    } catch (error) {
      console.error(`Error enabling gif: ${error.message}`);
    }
  }

  function getAttrValOfAnyDOM(el, attr) {
    const res = el.querySelector(`*[${attr}]`) || el;
    return res.getAttribute(attr);
  }

  function getAttrValFromNoscript(el, attr) {
    let noscripts = el.querySelectorAll("noscript");
    const re = new RegExp(`${attr}="(.*?)"`);
    if (el.tagName === "NOSCRIPT") {
      noscripts = [...noscripts, el];
    }
    for (let i = 0; i < noscripts.length; ++i) {
      const nos = noscripts[i];
      const content = nos.textContent || nos.innerText || nos.innerHTML;
      if (content) {
        const groups = re.exec(content);
        if (groups) {
          return groups[1];
        }
      }
    }
    return null;
  }

  function getAttrVal(el, attr) {
    return getAttrValOfAnyDOM(el, attr) || getAttrValFromNoscript(el, attr);
  }

  async function getRealImage(el) {
    const imgSrcAttrs = ["data-original", "data-actualsrc", "data-src", "src"];
    let imgSrcs = imgSrcAttrs
      .map(attr => getAttrVal(el, attr))
      .filter(src => src != null && IMG_SRC_REG_EX.test(src));

    return imgSrcs.length > 0 ? await createImgFromURL(imgSrcs[0]) : null;
  }

  async function createImgFromURL(url) {
    const suffix = QUALITY_TO_SUFFIX[await settings.get("imageQuality")];
    const image = new ZhihuImage(url, suffix);
    const img = createElement("img", {
      src: image.next(),
      style: {
        maxWidth: "100%",
        display: "block",
        margin: "1rem auto",
        cursor: "pointer",
      },
      onclick: () => {
        img.src = image.next();
      },
      onmouseover: hint.show,
      onmouseleave: hint.hide,
    });
    return img;
  }

  // enable all gifs and load images
  function loadAllFigures(el) {
    const figures = el.querySelectorAll("figure");
    figures.forEach(async figure => {
      const gifDiv = figure.querySelector("div.RichText-gifPlaceholder");
      if (gifDiv !== null) {
        enableGIF(gifDiv);
      } else {
        const img = await getRealImage(figure);
        if (img) {
          const el =
            figure.querySelector("img") || figure.querySelector("noscript");
          el ? el.replaceWith(img) : figure.prepend(img);
        }
      }
    });
  }

  function fixLinks(el) {
    el.querySelectorAll("a").forEach(a => {
      // fix redirect links
      const groups = REDIRECT_LINK_REG_EX.exec(a.href);
      if (groups) {
        a.href = decodeURIComponent(groups[1]);
      }

      // fix links with hidden texts
      const spans = a.querySelectorAll(
        ":scope > span.invisible, :scope > span.visible, :scope > span.ellipsis"
      );
      if (spans.length === a.children.length) {
        a.innerHTML =
          a.innerText.length > LINK_TEXT_MAX_LEN
            ? a.innerText.slice(0, LINK_TEXT_MAX_LEN) + "..."
            : a.innerText;
      }
    });
  }

  async function convertEquation(img) {
    const canvas = createElement("canvas", {
      width: EQ_IMG_SCALING_FACTOR * img.width,
      height: EQ_IMG_SCALING_FACTOR * img.height,
    });
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Object.assign(img.style, {
      width: img.width + "px",
      height: img.height + "px",
    });
    // 直接用img会出现因为cross origin而导致的"Tainted canvases may not be exported"错误
    // 如果window.location.href不是www.zhihu.com/*的话才会出现
    const response = await GM.asyncHttpRequest({
      method: "GET",
      url: img.src,
    });
    const svgXML = response.responseText;
    const svgImg = createElement("img", {
      src: "data:image/svg+xml," + encodeURIComponent(svgXML),
      onload: () => {
        ctx.drawImage(svgImg, 0, 0, canvas.width, canvas.height);
        img.src = canvas.toDataURL("image/png");
      },
    });
  }

  // Equations are converted to PNG images by the clipper, but the images have low resolutions
  // This function converts equations to PNG images in higher resolutions.
  function convertEquations(el) {
    const equationImgs = el.querySelectorAll(
      'img[src^="https://www.zhihu.com/equation"]'
    );
    equationImgs.forEach(img => {
      const id = setInterval(() => {
        if (img.complete) {
          clearInterval(id);
          convertEquation(img);
        }
      }, 100);
    });
  }

  function postprocess(el) {
    replaceVideosByLinks(el);
    loadAllFigures(el);
    fixLinks(el);
    convertEquations(el);
  }

  class ZhihuImage {
    constructor(src, defaultSuffix) {
      const groups = IMG_SRC_REG_EX.exec(src);
      this.prefix = groups[1];
      this.ext = groups[3];
      this.i = SUFFIX.indexOf(defaultSuffix);
      if (this.i === -1) this.i = 0;
    }

    next() {
      const src = `${this.prefix}_${SUFFIX[this.i]}.${this.ext}`;
      if (++this.i === SUFFIX.length) this.i = 0;
      return src;
    }
  }

  async function getComments(url, numPages) {
    let comments = [];
    let currURL = url;
    for (let i = 0; numPages < 0 || i < numPages; ++i) {
      const obj = await getJson(currURL);
      comments = comments.concat(obj.data);
      if (obj.paging.is_end) break;
      currURL = obj.paging.next;
    }
    return comments;
  }

  async function getRootComments(url) {
    const rootCommentsObjs = await getComments(
      url,
      parseInt(await settings.get("numRootCommentPages"))
    );
    for (const obj of rootCommentsObjs) {
      if (obj.child_comment_count > obj.child_comments.length) {
        const childrenURL = `https://www.zhihu.com/api/v4/comment_v5/comment/${obj.id}/child_comment?order_by=ts&limit=20&offset=`;
        obj.child_comments = await getComments(
          childrenURL,
          parseInt(await settings.get("numChildCommentPages"))
        );
      }
    }
    return rootCommentsObjs;
  }

  function formatDate(date) {
    const str = date.toISOString();
    return str.substring(0, 10) + " " + str.substring(11, 16);
  }

  function createCommentNode(comment, isChild, stickers) {
    const authorURL = `https://www.zhihu.com/people/${comment.author.id}`;
    const authorAvatar = createElement(
      "div",
      { class: "fmt-author-avatar" },
      createElement(
        "a",
        { href: authorURL },
        createElement("img", {
          src: comment.author.avatar_url,
          style: {
            width: "1.5em",
            height: "1.5em",
          },
        })
      )
    );
    const authorRowNodes = [
      createElement("a", { href: authorURL }, comment.author.name),
    ];
    if ("reply_to_author" in comment) {
      authorRowNodes.push(
        document.createTextNode(" > "),
        createElement(
          "a",
          {
            href: `https://www.zhihu.com/people/${comment.reply_to_author.id}`,
          },
          comment.reply_to_author.name
        )
      );
    }
    const authorRow = createElement(
      "div",
      { class: "fmt-author-row" },
      ...authorRowNodes
    );
    const content = createElement("div", { class: "fmt-comment-content" });
    content.innerHTML = comment.content.replace(
      /\[.*?\]/g,
      (match, offset, string) => {
        if (match in stickers) {
          return `<img src="${stickers[match]}" class="fmt-emoticon">`;
        } else {
          return match;
        }
      }
    );
    content
      .querySelectorAll(".comment_sticker, .comment_img")
      .forEach(stickerLink => {
        const stickerImg = createElement("img", {
          class: "fmt-comment-img",
          src: stickerLink.href,
        });
        stickerLink.innerText = "";
        stickerLink.appendChild(stickerImg);
      });

    const formattedDate = formatDate(new Date(comment.created_time * 1000));
    const infoStrings = [formattedDate];
    for (const tag of comment.comment_tag) {
      if (tag.type === "ip_info") {
        infoStrings.push(tag.text);
        break;
      }
    }
    infoStrings.push(`${comment.like_count}个赞同`);
    const info = createElement(
      "div",
      { class: "fmt-comment-info" },
      infoStrings.join(" · ")
    );
    const contentColumn = createElement(
      "div",
      { class: "fmt-content-column" },
      authorRow,
      content,
      info
    );
    const node = createElement(
      "div",
      {
        class: isChild ? "fmt-comment" : "fmt-root-comment fmt-comment",
        style: {
          marginLeft: isChild ? "2em" : "0",
        },
      },
      authorAvatar,
      contentColumn
    );

    return node;
  }

  async function renderComments(commentsUrl, parent) {
    if (parseInt(await settings.get("numRootCommentPages")) == 0) return;
    const rootComments = await getRootComments(commentsUrl);
    const stickers = await getStickers();
    let numComments = 0;
    let commentNodes = [];
    for (const comment of rootComments) {
      numComments += 1 + comment.child_comments.length;
      const rootCommentNode = createCommentNode(comment, false, stickers);
      const childCommentNodes = comment.child_comments.map(childComment =>
        createCommentNode(childComment, true, stickers)
      );
      const rootCommentContainer = createElement(
        "div",
        {
          class: "fmt-root-comment-container",
        },
        rootCommentNode,
        ...childCommentNodes
      );
      commentNodes.push(rootCommentContainer);
    }
    const commentsContainer = createElement(
      "div",
      {
        class: "fmt-comments-container",
      },
      createElement(
        "div",
        { class: "fmt-comments-count" },
        `${numComments} 条评论`
      ),
      ...commentNodes
    );
    parent.appendChild(commentsContainer);
  }

  async function getJson(url) {
    const resp = await GM.asyncHttpRequest({
      method: "GET",
      url: url,
    });
    return JSON.parse(resp.responseText);
  }

  const getStickers = (() => {
    let stickers = null;
    return async () => {
      if (stickers !== null) return stickers;
      if (window.zh_emoticon === undefined) {
        const resp = await GM.asyncHttpRequest({
          method: "GET",
          url: "https://unpkg.zhimg.com/@cfe/emoticon/lib/emoticon.js",
        });
        eval(resp.responseText);
      }
      stickers = {};
      for (const group of window.zh_emoticon) {
        for (const sticker of group.stickers) {
          if (sticker.placeholder in stickers) continue;
          stickers[sticker.placeholder] = sticker.static_image_url;
        }
      }
      return stickers;
    };
  })();

  class Settings {
    constructor() {
      this.settings = {};
      this.div = null;
      const cornerButtons = document.querySelector(".CornerButtons");
      if (cornerButtons) {
        const button = createElement("button", {
          type: "button",
          class: "Button CornerButton Button--plain",
          "data-tooltip": "设置知乎重排",
          "data-tooltip-position": "left",
        });
        button.innerHTML = SETTING_ICON_HTML;
        button.onclick = this.show.bind(this);
        const div = createElement(
          "div",
          { class: "CornerAnimayedFlex" },
          button
        );
        cornerButtons.prepend(div);
      }
    }

    async get(key) {
      return await GM.getValue(key, this.settings[key].defaultOption);
    }

    async set(key, value) {
      return await GM.setValue(key, value);
    }

    add_setting(key, desc, options, defaultOption) {
      this.settings[key] = {
        desc,
        options,
        defaultOption,
      };
    }

    async show() {
      this.close();
      this.div = createElement("div", {
        style: {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "0.8rem",
          width: "24rem",
          zIndex: 999,
        },
      });

      for (let key in this.settings) {
        if (this.div.children.length > 0) {
          this.div.appendChild(document.createElement("br"));
        }
        const { desc, options } = this.settings[key];
        const descSpan = document.createElement("span");
        descSpan.innerText = `${desc}: `;
        this.div.appendChild(descSpan);
        if (options.length == 0) {
          const input = createElement("input", {
            id: key,
            type: "text",
            name: key,
            onchange: event => {
              this.set(key, event.target.value);
            },
          });
          input.value = await this.get(key);
          this.div.appendChild(input);
        } else if (
          options.length === 2 &&
          options.includes(true) &&
          options.includes(false)
        ) {
          // the setting is binary
          const checkbox = createElement("input", {
            type: "checkbox",
            onchange: event => {
              this.set(key, event.target.checked);
            },
          });
          if (await this.get(key)) {
            checkbox.setAttribute("checked", "checked");
          }
          this.div.appendChild(checkbox);
        } else {
          const savedOption = await this.get(key);
          for (let option of options) {
            const radio = createElement("input", {
              id: `${key}-${option}`,
              type: "radio",
              name: key,
              value: option,
              onchange: () => {
                this.set(key, option);
              },
            });
            if (option === savedOption) {
              radio.setAttribute("checked", "checked");
            }
            this.div.appendChild(radio);
            const label = createElement("label", { for: `${key}-${option}` });
            label.innerText = option;
            this.div.appendChild(label);
          }
        }
      }
      if (this.div.children.length > 0) {
        const closeBtn = createElement("span", {
          style: {
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            cursor: "pointer",
          },
          onclick: this.close.bind(this),
        });
        closeBtn.innerText = "X";
        this.div.appendChild(closeBtn);
        document.body.appendChild(this.div);
      }
    }

    close() {
      if (this.div !== null) {
        this.div.remove();
        this.div = null;
      }
    }
  }

  // global constants
  const QUALITY_TO_SUFFIX = {
    原始: "r",
    高清: "hd",
    缩略: "b",
  };
  const EQ_IMG_SCALING_FACTOR = 2; // scaling factor for equation images
  const IMG_SRC_REG_EX = /^(https?:\/\/.+[a-z0-9]{32})(_\w+)?\.(\w+)/;
  const REDIRECT_LINK_REG_EX = /https?:\/\/link\.zhihu\.com\/\?target=(.*)/i;
  const SUFFIX = ["r", "hd", "b"];
  //const SUFFIX = ["r", "hd", "b", "xl", "t", "l", "m", "s"];
  const GIF_EXT = "gif"; // can be changed to .webp, but Evernote does not support it.
  const LINK_TEXT_MAX_LEN = 50;
  const SETTING_ICON_HTML = `<svg t="1567388644978" viewBox="0 0 1024 1024" version="1.1" p-id="1116" width="24" height="24" fill="currentColor">
    <defs><style type="text/css"></style></defs>
    <path d="M1020.1856 443.045888c-4.01408-21.634048-25.494528-43.657216-47.776768-48.529408l-16.662528-3.702784c-39.144448-11.49952-73.873408-36.640768-95.955968-73.670656-22.081536-37.225472-27.300864-79.517696-17.665024-118.301696l5.219328-15.20128c6.62528-21.049344-2.00704-50.087936-19.472384-64.510976 0 0-15.657984-12.862464-59.82208-37.614592-44.164096-24.556544-63.235072-31.378432-63.235072-31.378432-21.479424-7.600128-51.591168-0.38912-67.249152 15.787008l-11.64288 12.0832c-29.710336 27.285504-69.658624 43.851776-113.82272 43.851776-44.164096 0-84.513792-16.760832-114.224128-44.240896l-11.241472-11.69408C371.177472 49.74592 340.865024 42.534912 319.3856 50.13504c0 0-19.27168 6.821888-63.435776 31.378432-44.164096 24.946688-59.621376 37.810176-59.621376 37.810176-17.46432 14.227456-26.09664 43.071488-19.472384 64.315392l4.81792 15.396864c9.435136 38.784 4.416512 80.88064-17.665024 118.106112-22.08256 37.225472-57.212928 62.56128-96.559104 73.865216l-16.059392 3.508224C29.308928 399.388672 7.6288 421.21728 3.61472 443.045888c0 0-3.613696 19.488768-3.613696 68.992 0 49.504256 3.613696 68.993024 3.613696 68.993024 4.01408 21.828608 25.494528 43.657216 47.776768 48.529408l15.657984 3.508224c39.346176 11.303936 74.677248 36.639744 96.759808 74.059776 22.081536 37.225472 27.300864 79.517696 17.665024 118.301696l-4.617216 15.00672c-6.62528 21.049344 2.00704 50.087936 19.472384 64.510976 0 0 15.657984 12.862464 59.82208 37.614592 44.164096 24.751104 63.235072 31.377408 63.235072 31.377408 21.479424 7.601152 51.591168 0.390144 67.249152-15.785984l11.040768-11.49952c29.91104-27.480064 70.060032-44.240896 114.424832-44.240896 44.3648 0 84.714496 16.956416 114.424832 44.43648l11.040768 11.49952c15.45728 16.175104 45.769728 23.387136 67.249152 15.785984 0 0 19.27168-6.821888 63.435776-31.378432 44.164096-24.751104 59.621376-37.614592 59.621376-37.614592 17.46432-14.227456 26.09664-43.267072 19.472384-64.509952l-4.81792-15.592448c-9.435136-38.58944-4.416512-80.68608 17.665024-117.715968 22.08256-37.225472 57.413632-62.756864 96.759808-74.0608l15.65696-3.508224c22.08256-4.872192 43.762688-26.7008 47.777792-48.528384 0 0 3.613696-19.489792 3.613696-68.993024-0.200704-49.698816-3.8144-69.187584-3.8144-69.187584zM512.100352 710.2464c-112.617472 0-204.157952-88.677376-204.157952-198.208512 0-109.335552 91.339776-198.012928 204.157952-198.012928 112.617472 0 204.157952 88.677376 204.157952 198.208512C716.0576 621.568 624.717824 710.2464 512.100352 710.2464z" p-id="1117"></path>
  </svg>`;

  // global variables
  const root = document.querySelector("#root");
  const hint = createElement("div", {
    style: {
      display: "none",
      position: "fixed",
      backgroundColor: "white",
      border: "1px solid black",
    },
  });
  hint.innerText = "点击图片更换分辨率（如有）";
  hint.show = event => {
    hint.style.display = "block";
    hint.style.top = event.clientY + "px";
    hint.style.left = event.clientX + 3 + "px";
  };
  hint.hide = () => {
    hint.style.display = "none";
  };
  let settings;

  function main() {
    // inject format button/link
    const url = window.location.href;
    if (url.includes("zhuanlan")) addBtnToNav();
    else if (url.includes("answer")) addLinkToNav(formatAnswer);
    else addLinkToNav(formatPin);

    settings = new Settings();
    settings.add_setting(
      "imageQuality",
      "默认图片质量",
      ["原始", "高清", "缩略"],
      "原始"
    );
    settings.add_setting(
      "numRootCommentPages",
      "最大评论页数 (每页20个评论, -1表示无限制, 0表示不存评论)",
      [],
      "0"
    );
    settings.add_setting(
      "numChildCommentPages",
      "最大子评论页数 (每页20个评论, -1表示无限制, 0表示不存评论)",
      [],
      "0"
    );

    // handle backward/forward events
    window.addEventListener("popstate", function (event) {
      const div = document.querySelector("#formatted");
      if (event.state === "formatted") {
        root.style.display = "none";
        div.style.display = "block";
      } else {
        root.style.display = "block";
        div.style.display = "none";
      }
    });

    document.body.append(hint);
  }

  setTimeout(main, 1500);
})();
