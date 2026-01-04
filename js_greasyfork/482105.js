// ==UserScript==
// @name         逻辑透镜
// @namespace    https://greasyfork.org/cybermage
// @version      0.6.2
// @description  从品葱文章生成提示词以检查逻辑谬误。
// @author       Cybermage, TomHolland1996
// @license      MIT
// @match        https://pincong.rocks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pincong.rocks
// @grant        none
// @require      https://unpkg.com/turndown@7.1.2/lib/turndown.browser.umd.js
// @downloadURL https://update.greasyfork.org/scripts/482105/%E9%80%BB%E8%BE%91%E9%80%8F%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/482105/%E9%80%BB%E8%BE%91%E9%80%8F%E9%95%9C.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (
    location.href.startsWith("https://pincong.rocks/article/") ||
    location.href.startsWith("https://pincong.rocks/video/")
  ) {
    // page button
    const tagBar = document.querySelector(".tag-bar .operate");
    const gptBtn = document.createElement("button");
    gptBtn.setAttribute("class", "btn btn-normal pull-right");
    gptBtn.setAttribute("style", "margin-right: 2px;");
    gptBtn.setAttribute("type", "button");
    gptBtn.innerText = "逻辑透镜";
    gptBtn.addEventListener("click", handleArticleAndFullReplies);
    tagBar.appendChild(gptBtn);

    // reply button
    addButtonToEachReply(handleCommentAndHistory);
  } else if (location.href.startsWith("https://pincong.rocks/question/")) {
    addButtonToEachReply(handleQuestionAnswer);
  }

  /**
   * @callback AddButtonToReplyCallback
   * @param {HTMLElement} elem
   * @returns {void}
   */

  /**
   * @param {AddButtonToReplyCallback} callback
   */
  function addButtonToEachReply(callback) {
    document
      .querySelectorAll(".aw-replies .aw-item")
      .forEach((replyElement) => {
        const toolBar = replyElement.querySelector(".mod-footer .meta");
        const gptBtn = document.createElement("a");
        gptBtn.setAttribute("class", "aw-small-text");
        gptBtn.setAttribute("href", "javascript:;");
        gptBtn.innerHTML = '<i class="icon icon-bubble"></i> 逻辑透镜';
        gptBtn.addEventListener("click", () => callback(replyElement));
        toolBar.appendChild(gptBtn);
      });
  }

  const SYSTEM_PROMPT = `You are 'Logic Lens', an anti-fallacy bot capable of providing professional and in-depth explanations of logical fallacies in Chinese. Your primary role is to identify and explain various logical fallacies, such as 'causal fallacies', 'straw man arguments', 'ad hominem', 'red herring', and others, in user submissions. This includes analyzing content directly from links provided by users. When given a link, you'll attempt to read and analyze the content within that link, applying your expertise in logical analysis in Chinese. You'll use professional terminology to describe why a particular reasoning falls under a specific fallacy category and respond to any questions about these terms or concepts in Chinese. Your responses are professional and educational, designed to make complex logical concepts accessible to all users. As 'Logic Lens', you remain a neutral, informative tool, dedicated to enhancing users' understanding of logical reasoning and critical thinking. Please try to communicate in Simplified Chinese.
Always format your response like follows: """
<Your response in BBCode (Bulletin Board Code, e.g. use [b]...[/b] for bold)>
【以上内容由 ChatGPT (逻辑透镜) 生成】
"""`;

  function handleResult(prompt) {
    navigator.clipboard.writeText(prompt);
    //if(confirm('提示词已复制到剪贴板，需要打开ChatGPT网页吗？')) {
    window.open("https://chat.openai.com/", "_blank");
    //}
  }

  const turndownService = new TurndownService();

  function convertContent(content) {
    /**
     * @type string
     */
    const markdown = turndownService.turndown(content);
    const lines = markdown.split("\n").map((line) => line.trim());
    return dropContinuousEmptyLines(lines).join("\n");
  }

  /**
   * @param {string[]} lines
   */
  function dropContinuousEmptyLines(lines) {
    const result = [];
    for (const line of lines) {
      if (line) {
        result.push(line);
      } else if (result[result.length - 1] !== "") {
        result.push("");
      }
    }
    return result;
  }

  /**
   * @param {ArticleData} article
   * @param {ReplyData[]} replies
   * @returns {string}
   */
  function formatArticlePrompt(article, replies) {
    return [
      SYSTEM_PROMPT,
      "",
      "For following article and replies:",
      `Article title: ${article.title}
Article author: ${article.author}
Article url: ${location.href}
Article content: """
${convertContent(article.content)}
"""`,
      "",
      "Replies:",
      ...replies.map(
        (reply) => `
Author: ${reply.author}\
${reply.replyToAuthor ? "\nReply to: " + reply.replyToAuthor : ""}
Content: """
${reply.content}
"""
`,
      ),
      "",
    ].join("\n");
  }

  class ArticleData {
    title;
    content;
    author;
    time;
  }

  class ReplyData {
    id;
    author;
    replyToAuthor;
    replyToId;
    time;
    content;
  }

  /**
   * @returns {ArticleData}
   */
  function getArticleData() {
    const title = document.querySelector(
      ".aw-question-detail .mod-head",
    ).innerText;
    const content = document.querySelector(
      ".aw-question-detail .content",
    ).innerHTML;
    const author = document.querySelector(
      ".aw-side-bar a.aw-user-name",
    ).innerText;
    const metaElements = document.querySelectorAll(
      ".aw-question-detail .meta span.pull-right *.aw-small-text",
    );
    const time = metaElements[metaElements.length - 1].innerText;

    return {
      title,
      content: convertContent(content),
      author,
      time,
    };
  }

  /**
   * @returns {ReplyData[]}
   */
  function getArticleReplies() {
    const result = [];

    document.querySelectorAll(".aw-replies .aw-item").forEach((reply) => {
      const id = getCommentId(reply);
      const author = reply.querySelector("a.aw-user-name").innerText;
      const replyToAuthor =
        reply.querySelectorAll("a.aw-user-name")[1]?.innerText;
      const replyToId = getReplyToId(reply);
      const comment = reply.querySelector(".mod-body .markitup-box").innerHTML;
      const time = reply.querySelector(".meta span.pull-right").innerText;

      result.push({
        id,
        author,
        replyToAuthor,
        replyToId,
        time,
        content: convertContent(comment),
      });
    });

    return result;
  }

  function getCommentId(commentElement) {
    // format report_onclick('[url]https://pincong.rocks/article/id-{article_id}__item_id-{comment_id}
    return commentElement
      .querySelector('a.aw-small-text[onclick^="report_onclick"]')
      ?.onclick.toString()
      .match(/__item_id-(\d+)/)[1];
  }

  function getReplyToId(commentElement) {
    // format /article/item_id-{replyId}#
    return commentElement
      .querySelector("blockquote > a")
      ?.href.match(/item_id-(\d+)/)[1];
  }

  function ensureUrlCorrect() {
    if (location.pathname.includes("__")) {
      location.href = location.href.split("_")[0];
      alert(
        "当前文章的回复没有按照时间排序，已重定向到正确的页面。请重新点击按钮。",
      );
      throw new Error("return");
    }
  }

  function handleArticleAndFullReplies() {
    ensureUrlCorrect();

    const articleData = getArticleData();
    console.log("article data", articleData);

    const articleReplies = getArticleReplies();
    console.log("article replies", articleReplies);

    const result =
      formatArticlePrompt(articleData, articleReplies) +
      "\n" +
      "请考虑回复之间的关系，并用中文回答：以上内容中有逻辑谬误和诡辩吗？如果有，都有哪些？";
    handleResult(result);
  }

  function handleCommentAndHistory(commentElement) {
    ensureUrlCorrect();

    const commentId = getCommentId(commentElement);

    const articleData = getArticleData();
    console.log("article data", articleData);

    const articleReplies = getArticleReplies();
    console.log("article replies", articleReplies);

    const replyHistory = [articleReplies.find((r) => r.id === commentId)];
    let id;
    let cnt = 0;
    while ((id = replyHistory[0]?.replyToId) && ++cnt < 1000) {
      const item = articleReplies.find((r) => r.id === id);
      if (!item) {
        break;
      }
      replyHistory.unshift(item);
    }
    console.log("reply history", replyHistory);

    const lastReply = replyHistory[replyHistory.length - 1];
    const targetAuthor = lastReply?.author.trim();
    const targetName = targetAuthor
      ? "用户“" + targetAuthor + "”的回复"
      : "最后一条回复";

    const result =
      formatArticlePrompt(articleData, replyHistory) +
      "\n" +
      `请考虑回复之间的关系并分析上下文，然后用中文回答：${targetName}中有逻辑谬误和诡辩吗？如果有，都有哪些？`;
    handleResult(result);
  }

  /**
   * @returns {ArticleData}
   */
  function getQuestionData() {
    const title = document.querySelector(
      ".aw-question-detail .mod-head",
    ).innerText;
    const content = document.querySelector(
      ".aw-question-detail .content",
    ).innerHTML;
    const author = document.querySelector(
      ".aw-side-bar a.aw-user-name",
    ).innerText;
    const metaElements = document.querySelectorAll(
      ".aw-question-detail .meta *.aw-small-text",
    );
    const time = metaElements[0].innerText;

    return {
      title,
      content: convertContent(content),
      author,
      time,
    };
  }

  /**
   * @param {HTMLElement} answerElement
   * @returns {ReplyData}
   */
  function getAnswerData(answerElement) {
    const author = answerElement.querySelector("a.aw-user-name").innerText;
    const answer = answerElement.querySelector(
      ".mod-body .markitup-box",
    ).innerHTML;
    const time = answerElement.querySelector(".meta span.pull-right").innerText;

    return {
      author,
      content: convertContent(answer),
      time,
    };
  }

  /**
   * @param {HTMLElement} answerElement
   */
  function handleQuestionAnswer(answerElement) {
    const questionData = getQuestionData();
    console.log("question data", questionData);

    const answerData = getAnswerData(answerElement);
    console.log("answer data", answerData);

    const result =
      formatArticlePrompt(questionData, [answerData]) +
      "\n" +
      "请用中文回答：最后一条回复（回答）中有逻辑谬误和诡辩吗？如果有，都有哪些？";
    handleResult(result);
  }
})();