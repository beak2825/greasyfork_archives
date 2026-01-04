// ==UserScript==
// @name         RSS Viewer
// @name:zh-CN   RSS 预览
// @name:zh-TW   RSS 預覽
// @name:ja      RSSビューア
// @name:ko      RSS 뷰어
// @namespace    https://github.com/houoop/rss-viewer
// @version      1.0.0
// @description  Convert XML RSS feed to a human-readable RSS interface with dual-panel layout, theme switching, and responsive design
// @description:zh-CN 将XML RSS源转换为人类可读的RSS界面，支持双栏布局、主题切换和响应式设计
// @description:zh-TW 將XML RSS源轉換為人類可讀的RSS界面，支持雙欄佈局、主題切換和響應式設計
// @description:ja XML RSSフィードを人間が読めるRSSインターフェースに変換、デュアルパネルレイアウト、テーマ切り替え、レスポンシブデザインをサポート
// @description:ko XML RSS 피드를 인간이 읽을 수 있는 RSS 인터페이스로 변환, 듀얼 패널 레이아웃, 테마 전환, 반응형 디자인 지원
// @author       houoop
// @license      MIT
// @homepage     https://github.com/houoop/rss-viewer
// @supportURL   https://github.com/houoop/rss-viewer/issues
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbyB3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjgwMHB4IiB3aWR0aD0iODAwcHgiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0OTAgNDkwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+CjxwYXRoIGQ9Ik0xNDQuODU2LDM0Ni42MjVoMjAuNjA2YzcuNjU2LDAsMTEuNDg0LDMuODg4LDExLjQ4NCwxMS42NjR2MTMuNzQyaDE0LjI5NnYtMTYuNjEzYzAtOS4yNDEtNC4xNzItMTQuMTMxLTEyLjUzMS0xNC42NAoJCXYtMC40OTNjNy42NTYtMS4wNzcsOC45ODctMy4wMDYsMTAuNzM3LTUuODAyYzEuNzUtMi43OTYsMi42MTctOCwyLjYxNy0xNS42MjZjMC04LjM4OS0xLjczNS0xNC4xOTEtNS4yMzQtMTcuMzkxCgkJYy0zLjQ5OS0zLjItOS44NjktNC44LTE5LjExMS00LjhoLTM3LjE2djc1LjM2NmgxNC4yOTZWMzQ2LjYyNXogTTE0NC44NTYsMzA4LjcwMmgyMS41MzNjNC42OCwwLDcuNzE2LDAuNzc4LDkuMDkyLDIuMzMzCgkJYzEuMzc2LDEuNTcsMi4wNjQsNS4wMzksMi4wNjQsMTAuNDIzYzAsNS4yNjQtMC43OTMsOC43NjMtMi4zOTMsMTAuNTEyYy0xLjYsMS43NS00Ljg2LDIuNjE3LTkuNzUsMi42MTdoLTIwLjU0NlYzMDguNzAyeiIvPgo8cGF0aCBkPSJNMjMyLjE3LDM2MS4yMDRjLTguMjEsMC0xMy4yMzQtMC41ODMtMTUuMDg4LTEuNzY0Yy0xLjgzOS0xLjE4MS0yLjc1Mi00LjM5Ni0yLjc1Mi05LjY2bC0wLjA2LTEuNmgtMTMuOTA3bDAuMDQ1LDIuNzUxCgkJYzAsOC43NjMsMS45NDQsMTQuNTgsNS44MzIsMTcuNDUxYzMuODg4LDIuODcxLDExLjc1NCw0LjMwNywyMy41OTcsNC4zMDdjMTMuMTg5LDAsMjEuNzEzLTEuNDY2LDI1LjU3MS00LjM4MQoJCWMzLjg3My0yLjkzMSw1LjgwMi05LjQwNiw1LjgwMi0xOS40MWMwLTguMTM1LTEuNjQ1LTEzLjQ4OC00Ljk1LTE2LjA3NWMtMy4yOS0yLjU3Mi0xMC41NTctNC4xNzItMjEuNzczLTQuOAoJCWMtOS40OTUtMC41MDgtMTUuMTAzLTEuMjU2LTE2Ljc5My0yLjIxM2MtMS42OS0wLjk1Ny0yLjU0Mi0zLjgxMy0yLjU0Mi04LjU1M2MwLTQuMDA4LDEuMDQ3LTYuNjM5LDMuMTI1LTcuODk1CgkJYzIuMDc5LTEuMjU2LDYuNTA1LTEuODg0LDEzLjI3OS0xLjg4NGM1Ljc0MiwwLDkuMzkxLDAuNTUzLDEwLjkzMSwxLjYzYzEuNTQsMS4wOTIsMi40ODIsMy43NTMsMi44MTEsNy45ODUKCQljMCwwLjMyOSwwLjA0NSwwLjgzNywwLjEyLDEuNTRoMTMuOTY3di0yLjg3MWMwLTcuODA2LTEuOTc0LTEzLjA0LTUuOTA3LTE1LjczMWMtMy45NDgtMi42OTItMTEuNTc0LTQuMDM4LTIyLjkyNC00LjAzOAoJCWMtMTEuOTYzLDAtMTkuOTMzLDEuNDY2LTIzLjkyNiw0LjM5NmMtMy45OTMsMi45MTYtNS45OTYsOC43OTMtNS45OTYsMTcuNTg1YzAsOC42MTMsMS42NiwxNC4yMjEsNC45NjUsMTYuODM4CgkJYzMuMzIsMi42MTcsMTAuOTQ2LDQuMjc3LDIyLjg2NCw0Ljk2NWw3Ljg5NSwwLjUwOGM0LjQ1NiwwLjI1NCw3LjM1NywwLjk4Nyw4LjcwMywyLjE4M2MxLjM0NiwxLjE5NiwyLjAxOSwzLjYwNCwyLjAxOSw3LjI1MwoJCWMwLDQuOTM1LTAuODk3LDguMDktMi42NjIsOS40NTFDMjQyLjY1MiwzNjAuNTMyLDIzOC41NywzNjEuMjA0LDIzMi4xNywzNjEuMjA0eiIvPgo8cGF0aCBkPSJNMjk5Ljg1LDM2MS4yMDRjLTguMTk1LDAtMTMuMjE5LTAuNTgzLTE1LjA3My0xLjc2NGMtMS44MzktMS4xODEtMi43NTItNC4zOTYtMi43NTItOS42NmwtMC4wNi0xLjZoLTEzLjkwN2wwLjA0NSwyLjc1MQoJCWMwLDguNzYzLDEuOTQ0LDE0LjU4LDUuODMyLDE3LjQ1MWMzLjg4OCwyLjg3MSwxMS43NTQsNC4zMDcsMjMuNjEyLDQuMzA3YzEzLjE1OSwwLDIxLjY4My0xLjQ2NiwyNS41NzEtNC4zODEKCQljMy44NTgtMi45MzEsNS44MDItOS40MDYsNS44MDItMTkuNDFjMC04LjEzNS0xLjY3NS0xMy40ODgtNC45NjUtMTYuMDc1Yy0zLjI5LTIuNTcyLTEwLjU1Ny00LjE3Mi0yMS43NzMtNC44CgkJYy05LjQ5NS0wLjUwOC0xNS4xMDMtMS4yNTYtMTYuNzkzLTIuMjEzYy0xLjY5LTAuOTU3LTIuNTQyLTMuODEzLTIuNTQyLTguNTUzYzAtNC4wMDgsMS4wNDctNi42MzksMy4xMjUtNy44OTUKCQljMi4wNzktMS4yNTYsNi41MDUtMS44ODQsMTMuMjc5LTEuODg0YzUuNzQyLDAsOS4zOTEsMC41NTMsMTAuOTQ2LDEuNjNjMS41MjUsMS4wOTIsMi40ODIsMy43NTMsMi44MTEsNy45ODUKCQljMCwwLjMyOSwwLjAzLDAuODM3LDAuMTIsMS41NGgxMy45Njd2LTIuODcxYzAtNy44MDYtMS45NzQtMTMuMDQtNS45MjItMTUuNzMxYy0zLjk0OC0yLjY5Mi0xMS41NzQtNC4wMzgtMjIuOTA5LTQuMDM4CgkJYy0xMS45NzgsMC0xOS45NDgsMS40NjYtMjMuOTQxLDQuMzk2Yy0zLjk5MywyLjkxNi01Ljk5Niw4Ljc5My01Ljk5NiwxNy41ODVjMCw4LjYxMywxLjY2LDE0LjIyMSw0Ljk2NSwxNi44MzgKCQljMy4zMiwyLjYxNywxMC45NDYsNC4yNzcsMjIuODc5LDQuOTY1bDcuODk2LDAuNTA4YzQuNDU2LDAuMjU0LDcuMzU3LDAuOTg3LDguNzAzLDIuMTgzYzEuMzE2LDEuMTk2LDIuMDA0LDMuNjA0LDIuMDA0LDcuMjUzCgkJYzAsNC45MzUtMC44OTcsOC4wOS0yLjY2Miw5LjQ1MUMzMTAuMzQ3LDM2MC41MzIsMzA2LjI4LDM2MS4yMDQsMjk5Ljg1LDM2MS4yMDR6Ii8+CjxwYXRoIGQ9Ik03Ny43ODgsMHYyNjUuMTExSDQyLjE4OXYxMzkuNjE1aDAuMDAxbDM1LjU5LDM1LjU5MUw3Ny43ODgsNDkwaDM3MC4wMjNWMTAyLjQyMkwzNDUuMzg4LDBINzcuNzg4eiBNMzk1Ljc5MywzODkuNDEzCgkJSDU3LjUwMXYtMTA4Ljk5aDMzOC4yOTJWMzg5LjQxM3ogTTM1My4wMjIsMzYuOTYybDU3LjgxNiw1Ny44MDRoLTU3LjgxNlYzNi45NjJ6Ii8+CjwvZz4KPC9zdmc+
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      cdn.jsdelivr.net
// @require      https://cdn.jsdelivr.net/npm/rss-parser@3.13.0/dist/rss-parser.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546910/RSS%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/546910/RSS%20Viewer.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /*
   * RSS Viewer - RSS 预览
   * Version: 1.0.0
   * Author: houoop
   * License: MIT
   *
   * 将XML RSS源转换为人类可读的RSS界面
   * Convert XML RSS feed to a human-readable RSS interface
   *
   * ## 更新日志 | Changelog
   *
   * ### v1.0.0 (2024-08-23)
   * - 初始版本发布
   * - 支持RSS/Atom格式解析
   * - 双栏布局界面
   * - 明暗主题切换
   * - 返回顶部按钮
   * - 响应式设计
   * - 多语言支持 (中文简体/繁体、英文、日文、韩文)
   * - 文章预览和分类标签
   * - 平滑动画效果
   *
   * ## 功能特性 | Features
   * - 自动检测RSS源并转换为可读界面
   * - 支持多种RSS格式 (RSS, Atom, XML)
   * - 双栏布局：左侧文章列表，右侧内容展示
   * - 明暗主题切换，支持主题记忆
   * - 响应式设计，适配移动设备
   * - 多语言界面支持
   * - 文章预览和分类标签
   * - 平滑滚动和动画效果
   * - 自定义滚动条样式
   */

  // 多语言支持
  const i18n = {
    en: {
      themeToggle: "Toggle Theme",
      backToTop: "Back to Top",
      lastUpdate: "Last Update",
      author: "Author",
      publishTime: "Published",
      categories: "Categories",
      noDescription: "No description available",
      articleCount: "Articles",
    },
    "zh-CN": {
      themeToggle: "切换主题",
      backToTop: "返回顶部",
      lastUpdate: "最后更新",
      author: "作者",
      publishTime: "发布时间",
      categories: "分类",
      noDescription: "暂无描述",
      articleCount: "篇文章",
    },
    "zh-TW": {
      themeToggle: "切換主題",
      backToTop: "返回頂部",
      lastUpdate: "最後更新",
      author: "作者",
      publishTime: "發布時間",
      categories: "分類",
      noDescription: "暫無描述",
      articleCount: "篇文章",
    },
    ja: {
      themeToggle: "テーマ切り替え",
      backToTop: "トップに戻る",
      lastUpdate: "最終更新",
      author: "著者",
      publishTime: "公開日時",
      categories: "カテゴリ",
      noDescription: "説明なし",
      articleCount: "記事",
    },
    ko: {
      themeToggle: "테마 전환",
      backToTop: "맨 위로",
      lastUpdate: "마지막 업데이트",
      author: "작성자",
      publishTime: "게시 시간",
      categories: "카테고리",
      noDescription: "설명 없음",
      articleCount: "개의 글",
    },
  };

  // 获取浏览器语言
  function getBrowserLanguage() {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith("zh")) {
      return lang.includes("tw") || lang.includes("hk") ? "zh-TW" : "zh-CN";
    } else if (lang.startsWith("ja")) {
      return "ja";
    } else if (lang.startsWith("ko")) {
      return "ko";
    }
    return "en";
  }

  // 获取翻译文本
  function t(key) {
    const lang =
      localStorage.getItem("rss-reader-language") || getBrowserLanguage();
    return i18n[lang]?.[key] || i18n["en"][key];
  }

  // 检查页面是否是RSS源
  function isRSSFeed() {
    // 检查Content-Type
    const contentType = document.contentType?.toLowerCase() || "";
    const validContentTypes = [
      "application/rss+xml",
      "application/atom+xml",
      "application/xml",
      "text/xml",
      "text/plain", // 有些RSS使用text/plain
    ];

    if (validContentTypes.includes(contentType)) {
      return true;
    }
    return false;
  }

  // 提取和解析RSS内容
  async function extractRSS() {
    try {
      // 检查RSSParser是否可用
      if (typeof RSSParser === "undefined") {
        console.error("RSSParser 未加载，请检查网络连接或脚本管理器设置");
        return null;
      }
      // 获取XML内容
      let xmlContent;
      let prettyPrint = document.querySelector("#webkit-xml-viewer-source-xml");
      if (prettyPrint) {
        xmlContent = prettyPrint.innerHTML;
      } else {
        switch (document.contentType) {
          // case "application/rss+xml":
          //   xmlContent = document.querySelector(
          //     "#webkit-xml-viewer-source-xml"
          //   ).innerHTML;
          //   break;
          // case "application/atom+xml":
          //   xmlContent = document.querySelector(
          //     "#webkit-xml-viewer-source-xml"
          //   ).innerHTML;
          //   break;
          // case "application/xml":
          //   xmlContent = document.querySelector(
          //     "#webkit-xml-viewer-source-xml"
          //   ).innerHTML;
          //   break;
          case "text/xml":
            xmlContent = new XMLSerializer().serializeToString(document);
            break;
          case "text/plain":
            xmlContent = document.body.textContent;
            break;
          default:
            console.warn("未知的Content-Type，尝试提取页面内容");
            xmlContent = document.body.textContent;
        }
      }

      // 使用RSSParser解析XML
      const parser = new RSSParser();
      const parsedFeed = await parser.parseString(xmlContent);
      console.log("Feed解析结果:", parsedFeed);
      parsedFeed.items.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (key !== "content:encoded") {
            if (typeof item[key] === "string") {
              item[key] = item[key].replace(/&amp;/g, "&");
              item[key] = item[key].replace(/&lt;/g, "<");
              item[key] = item[key].replace(/&gt;/g, ">");
              item[key] = item[key].replace(/&quot;/g, '"');
              item[key] = item[key].replace(/&apos;/g, "'");
              item[key] = item[key].replace(/&#039;/g, "'");
              item[key] = item[key].replace(/&nbsp;/g, " ");
              item[key] = item[key].replace(/&mdash;/g, "—");
              item[key] = item[key].replace(/&ndash;/g, "–");
              item[key] = item[key].replace(/&hellip;/g, "…");
              item[key] = item[key].replace(/&ldquo;/g, "“");
              item[key] = item[key].replace(/&rdquo;/g, "”");
              item[key] = item[key].replace(/&lsquo;/g, "‘");
              item[key] = item[key].replace(/&rsquo;/g, "’");
              item[key] = item[key].replace(/&laquo;/g, "«");
              item[key] = item[key].replace(/&raquo;/g, "»");
              item[key] = item[key].replace(/&bull;/g, "•");
            }
          }
        });
      });
      //遍历parsedFeed的每个字符属性,如果属性是字符串,则取消转义
      Object.keys(parsedFeed).forEach((key) => {
        if (typeof parsedFeed[key] === "string") {
          parsedFeed[key] = parsedFeed[key].replace(/&amp;/g, "&");
          parsedFeed[key] = parsedFeed[key].replace(/&lt;/g, "<");
          parsedFeed[key] = parsedFeed[key].replace(/&gt;/g, ">");
          parsedFeed[key] = parsedFeed[key].replace(/&quot;/g, '"');
          parsedFeed[key] = parsedFeed[key].replace(/&apos;/g, "'");
          parsedFeed[key] = parsedFeed[key].replace(/&#039;/g, "'");
          parsedFeed[key] = parsedFeed[key].replace(/&nbsp;/g, " ");
          parsedFeed[key] = parsedFeed[key].replace(/&mdash;/g, "—");
          parsedFeed[key] = parsedFeed[key].replace(/&ndash;/g, "–");
          parsedFeed[key] = parsedFeed[key].replace(/&hellip;/g, "…");
          parsedFeed[key] = parsedFeed[key].replace(/&ldquo;/g, "“");
          parsedFeed[key] = parsedFeed[key].replace(/&rdquo;/g, "”");
          parsedFeed[key] = parsedFeed[key].replace(/&lsquo;/g, "‘");
          parsedFeed[key] = parsedFeed[key].replace(/&rsquo;/g, "’");
          parsedFeed[key] = parsedFeed[key].replace(/&laquo;/g, "«");
          parsedFeed[key] = parsedFeed[key].replace(/&raquo;/g, "»");
          parsedFeed[key] = parsedFeed[key].replace(/&bull;/g, "•");
        }
      });
      return {
        title: parsedFeed.title || "RSS Feed",
        description: parsedFeed.description || "",
        items: parsedFeed.items.map((item) => {
          return {
            title: item.title || "",
            link: item.link || "",
            content:
              item["content:encoded"] ||
              item["content:encodedSnippet"] ||
              item.content ||
              "",
            description: item.description || "",
            pubDate: item.pubDate || item.isoDate || "",
            author: item.creator || item.author || "",
            categories: item.categories || [],
          };
        }),
      };
    } catch (e) {
      console.error("这不是rss xml", e);
      return null;
    }
  }

  // 安全地清理和解析HTML内容
  function cleanHTMLContent(html) {
    if (!html) return "";

    // 移除不安全的标签
    let cleanedHTML = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "") // 移除script标签
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "") // 移除style标签
      .replace(/<meta[^>]*>/gi, "") // 移除meta标签
      .replace(/<link[^>]*>/gi, "") // 移除link标签
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "") // 移除iframe标签
      .replace(/on\w+="[^"]*"/g, "") // 移除事件处理器
      .replace(/on\w+='[^']*'/g, "") // 移除事件处理器
      .replace(/javascript:[^"']*/gi, ""); // 移除javascript协议

    return cleanedHTML;
  }

  // 渲染文章内容
  function renderArticleContent(article, container, doc) {
    container.textContent = ""; // 清空容器

    // 创建文章头部
    const header = doc.createElement("div");
    header.className = "article-header";

    // 创建标题
    const title = doc.createElement("h1");
    title.className = "article-title";
    title.textContent = article.title;
    // 添加点击事件打开文章链接
    if (article.link) {
      title.style.cursor = "pointer";
      title.addEventListener("click", () => {
        window.open(article.link, "_blank");
      });
    }
    header.appendChild(title);

    // 创建元信息
    const meta = doc.createElement("div");
    meta.className = "article-meta";

    if (article.author) {
      const authorSpan = doc.createElement("span");
      authorSpan.textContent = `${t("author")}: ${article.author}`;
      meta.appendChild(authorSpan);
    }

    if (article.pubDate) {
      const dateSpan = doc.createElement("span");
      dateSpan.textContent = `${t("publishTime")}: ${new Date(
        article.pubDate
      ).toLocaleString()}`;
      meta.appendChild(dateSpan);
    }

    if (article.categories && article.categories.length) {
      const categorySpan = doc.createElement("span");
      categorySpan.textContent = `${t("categories")}: ${article.categories.join(
        ", "
      )}`;
      meta.appendChild(categorySpan);
    }

    header.appendChild(meta);

    // 创建文章内容
    const body = doc.createElement("div");
    body.className = "article-body";

    const contentToParse = cleanHTMLContent(
      article.content || article.description || ""
    );

    // 使用沙箱环境来解析HTML内容，避免TrustedHTML错误
    let contentNodes;
    try {
      // 尝试使用沙箱文档
      const sandbox = document.implementation.createHTMLDocument("sandbox");
      const sandboxDiv = sandbox.createElement("div");
      sandboxDiv.innerHTML = contentToParse;
      contentNodes = sandboxDiv.childNodes;
    } catch (error) {
      // console.warn("沙箱解析失败，使用纯文本:", error);
      // 如果沙箱也失败，创建纯文本节点
      const textNode = doc.createTextNode(
        contentToParse.replace(/<[^>]*>/g, "")
      );
      contentNodes = [textNode];
    }

    // 将节点导入到目标文档
    contentNodes.forEach((node) => {
      body.appendChild(doc.importNode(node, true));
    });

    // 添加所有元素到容器
    container.appendChild(header);
    container.appendChild(body);
  }

  // 创建阅读器界面
  async function createReaderInterface(rssData) {
    // 创建新的HTML文档
    const newDoc = document.implementation.createHTMLDocument();
    const container = newDoc.createElement("div");
    container.className = "rss-reader-container";

    // 创建顶部header
    const header = newDoc.createElement("div");
    header.className = "reader-header";

    // 创建header信息容器
    const headerInfo = newDoc.createElement("div");
    headerInfo.className = "header-info";

    // RSS标题
    const feedTitle = newDoc.createElement("h1");
    feedTitle.className = "feed-title";
    feedTitle.textContent = rssData.title;
    headerInfo.appendChild(feedTitle);

    // RSS元信息
    const feedMeta = newDoc.createElement("div");
    feedMeta.className = "feed-meta";

    // 获取最新的文章日期
    const latestDate = rssData.items
      .map((item) => new Date(item.pubDate))
      .reduce(
        (latest, current) => (current > latest ? current : latest),
        new Date(0)
      );

    feedMeta.textContent = `${t("lastUpdate")}: ${latestDate.toLocaleString()}`;
    headerInfo.appendChild(feedMeta);

    // RSS描述
    if (rssData.description) {
      const feedDesc = newDoc.createElement("div");
      feedDesc.className = "feed-description";
      feedDesc.textContent = rssData.description;
      headerInfo.appendChild(feedDesc);
    }

    // 将header信息容器添加到header
    header.appendChild(headerInfo);

    // 创建头部操作按钮容器
    const headerActions = newDoc.createElement("div");
    headerActions.className = "header-actions";

    // 创建主题切换按钮
    const themeToggleBtn = newDoc.createElement("button");
    themeToggleBtn.className = "theme-toggle";
    themeToggleBtn.textContent = "🌙";
    themeToggleBtn.title = t("themeToggle");
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("rss-reader-theme", newTheme);
      themeToggleBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
    });
    headerActions.appendChild(themeToggleBtn);

    header.appendChild(headerActions);
    container.appendChild(header);

    // 创建主内容容器
    const readerContent = newDoc.createElement("div");
    readerContent.className = "reader-content";

    // 创建左侧文章列表
    const articleList = newDoc.createElement("div");
    articleList.className = "article-list";

    // 创建右侧内容区
    const articleContent = newDoc.createElement("div");
    articleContent.className = "article-content";

    // 渲染文章列表
    rssData.items.forEach((item, index) => {
      const articleItem = newDoc.createElement("div");
      articleItem.className = "article-item";

      const title = newDoc.createElement("h3");
      title.textContent = item.title;
      articleItem.appendChild(title);

      // 添加发布日期
      const date = newDoc.createElement("div");
      date.style.fontSize = "12px";
      date.style.color = "#5f6368";
      date.style.marginTop = "4px";
      date.textContent = new Date(item.pubDate).toLocaleDateString();
      articleItem.appendChild(date);

      // 添加文章描述预览
      if (item.description) {
        const preview = newDoc.createElement("div");
        preview.className = "article-preview";
        const cleanDesc = cleanHTMLContent(item.description)
          .replace(/<[^>]*>/g, "")
          .trim();
        if (cleanDesc.length > 0) {
          preview.textContent =
            cleanDesc.length > 100
              ? cleanDesc.substring(0, 100) + "..."
              : cleanDesc;
          articleItem.appendChild(preview);
        }
      }

      // 添加文章分类标签
      if (item.categories && item.categories.length > 0) {
        const categories = newDoc.createElement("div");
        categories.className = "article-categories";
        item.categories.forEach((category) => {
          const tag = newDoc.createElement("span");
          tag.className = "category-tag";
          tag.textContent = category;
          categories.appendChild(tag);
        });
        articleItem.appendChild(categories);
      }

      // 添加双击事件监听器
      articleItem.addEventListener("dblclick", () => {
        if (item.link) {
          window.open(item.link, "_blank");
        }
      });

      articleItem.addEventListener("click", () => {
        // 移除其他文章的active状态
        newDoc.querySelectorAll(".article-item").forEach((item) => {
          item.classList.remove("active");
        });

        // 添加当前文章的active状态
        articleItem.classList.add("active");

        // 更新右侧内容
        renderArticleContent(item, articleContent, newDoc);

        // 滚动到顶部
        articleContent.scrollTop = 0;
      });

      articleList.appendChild(articleItem);

      // 默认显示第一篇文章
      if (index === 0) {
        articleItem.classList.add("active");
        renderArticleContent(item, articleContent, newDoc);
      }
    });

    readerContent.appendChild(articleList);
    readerContent.appendChild(articleContent);
    container.appendChild(readerContent);

    // 创建返回顶部按钮
    const backToTop = newDoc.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.textContent = "↑";
    backToTop.title = t("backToTop");
    backToTop.addEventListener("click", () => {
      articleContent.scrollTo({ top: 0, behavior: "smooth" });
    });
    container.appendChild(backToTop);

    // 清空原有内容并添加阅读器界面
    while (document.documentElement.firstChild) {
      document.documentElement.removeChild(document.documentElement.firstChild);
    }

    // 添加样式到新文档
    const styleElement = newDoc.createElement("style");
    styleElement.textContent = `
            /* 主题变量 */
            :root {
              /* 明亮主题 */
              --bg-primary: #ffffff;
              --bg-secondary: #f8f9fa;
              --text-primary: #202124;
              --text-secondary: #5f6368;
              --border-color: #e0e0e0;
              --hover-bg: #e8f0fe;
              --active-border: #1a73e8;
              --header-bg: #ffffff;
              --button-primary-bg: #2ecc71;
              --button-primary-hover: #27ae60;
              --button-secondary-bg: #ecf0f1;
              --button-secondary-hover: #bdc3c7;
              --shadow-color: rgba(0, 0, 0, 0.1);
            }
            
            /* 暗黑主题 */
            [data-theme="dark"] {
              --bg-primary: #1a1a1a;
              --bg-secondary: #2d2d2d;
              --text-primary: #e0e0e0;
              --text-secondary: #9e9e9e;
              --border-color: #404040;
              --hover-bg: #3d3d3d;
              --active-border: #64b5f6;
              --header-bg: #2d2d2d;
              --button-primary-bg: #2ecc71;
              --button-primary-hover: #27ae60;
              --button-secondary-bg: #424242;
              --button-secondary-hover: #616161;
              --shadow-color: rgba(0, 0, 0, 0.3);
            }
            
            body {
              margin: 0;
              padding: 0;
              background-color: var(--bg-primary);
              color: var(--text-primary);
              transition: background-color 0.3s ease, color 0.3s ease;
            }
            
            .rss-reader-container {
              display: flex;
              flex-direction: column;
              height: 100vh;
              width: 100%;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              background-color: var(--bg-primary);
            }
            
            .reader-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 20px;
              border-bottom: 1px solid var(--border-color);
              background-color: var(--header-bg);
              position: sticky;
              top: 0;
              z-index: 100;
              box-shadow: 0 2px 4px var(--shadow-color);
            }
            
            .header-info {
              flex: 1;
              min-width: 0;
              margin-right: 20px;
            }
            
            .feed-title {
              font-size: 24px;
              font-weight: 600;
              color: var(--text-primary);
              margin: 0 0 8px 0;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              letter-spacing: -0.5px;
            }
            
            .feed-meta {
              font-size: 13px;
              color: var(--text-secondary);
              margin-bottom: 8px;
            }
            
            .feed-description {
              font-size: 14px;
              color: var(--text-secondary);
              margin: 8px 0;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              line-height: 1.5;
            }
            
            .reader-content {
              display: flex;
              flex: 1;
              overflow: hidden;
              background-color: var(--bg-primary);
            }
            
            .article-list {
              width: 320px;
              border-right: 1px solid var(--border-color);
              overflow-y: auto;
              background: var(--bg-secondary);
            }
            
            .article-item {
              padding: 16px;
              border-bottom: 1px solid var(--border-color);
              cursor: pointer;
              transition: all 0.2s ease;
            }
            
            .article-item h3 {
              font-size: 15px;
              margin: 0;
              line-height: 1.5;
              color: var(--text-primary);
              font-weight: 500;
            }
            
            .article-item:hover {
              background: var(--hover-bg);
            }
            
            .article-item.active {
              background: var(--hover-bg);
              border-left: 4px solid var(--active-border);
            }
            
            .article-content {
              flex: 1;
              padding: 30px 40px;
              overflow-y: auto;
              background: var(--bg-primary);
              line-height: 1.6;
            }
            
            .article-header {
              margin-bottom: 24px;
              padding-bottom: 20px;
              border-bottom: 1px solid var(--border-color);
            }
            
            .article-title {
              font-size: 28px;
              color: var(--text-primary);
              margin-bottom: 16px;
              line-height: 1.4;
              font-weight: 600;
              letter-spacing: -0.5px;
            }
            
            .article-meta {
              color: var(--text-secondary);
              font-size: 14px;
              margin: 12px 0;
              display: flex;
              flex-wrap: wrap;
              gap: 16px;
            }
            
            .article-body {
              color: var(--text-primary);
              font-size: 16px;
              line-height: 1.8;
              max-width: 800px;
              margin: 0 auto;
            }
            
            .article-body img {
              max-width: 100%;
              height: auto;
              display: block;
              margin: 20px auto;
              border-radius: 8px;
              box-shadow: 0 4px 12px var(--shadow-color);
            }
            
            .header-actions {
              display: flex;
              align-items: center;
              gap: 12px;
              flex-shrink: 0;
              position: relative;
            }
            
            .subscribe-button-group {
              display: flex;
              align-items: stretch;
              box-shadow: 0 2px 4px var(--shadow-color);
              border-radius: 6px;
              overflow: hidden;
            }
            
            .main-subscribe-button {
              background-color: var(--button-primary-bg);
              color: white;
              border: none;
              padding: 10px 20px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              transition: all 0.2s ease;
              white-space: nowrap;
            }
            
            .main-subscribe-button:hover {
              background-color: var(--button-primary-hover);
            }
            
            .dropdown-button {
              background-color: var(--button-primary-bg);
              color: white;
              border: none;
              border-left: 1px solid rgba(255, 255, 255, 0.2);
              padding: 10px 12px;
              cursor: pointer;
              font-size: 12px;
              transition: all 0.2s ease;
            }
            
            .dropdown-button:hover {
              background-color: var(--button-primary-hover);
            }
            
            .theme-toggle {
              background-color: var(--button-secondary-bg);
              color: var(--text-primary);
              border: none;
              border-radius: 6px;
              padding: 10px;
              cursor: pointer;
              font-size: 18px;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 40px;
              height: 40px;
            }
            
            .theme-toggle:hover {
              background-color: var(--button-secondary-hover);
            }
            
            .dropdown-menu {
              position: absolute;
              top: calc(100% + 8px);
              right: 0;
              background-color: var(--bg-primary);
              border-radius: 8px;
              box-shadow: 0 4px 12px var(--shadow-color);
              min-width: 200px;
              z-index: 1000;
              border: 1px solid var(--border-color);
              overflow: hidden;
            }
            
            .dropdown-item {
              padding: 12px 16px;
              cursor: pointer;
              transition: all 0.2s ease;
              color: var(--text-primary);
            }
            
            .dropdown-item:hover {
              background-color: var(--hover-bg);
            }
            
            /* 滚动条美化 */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            
            ::-webkit-scrollbar-track {
              background: var(--bg-secondary);
            }
            
            ::-webkit-scrollbar-thumb {
              background: var(--text-secondary);
              border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
              background: var(--text-primary);
            }
            
            /* 文章内容排版美化 */
            .article-body p {
              margin: 1.5em 0;
            }
            
            .article-body a {
              color: var(--active-border);
              text-decoration: none;
            }
            
            .article-body a:hover {
              text-decoration: underline;
            }
            
            .article-body blockquote {
              margin: 1.5em 0;
              padding: 1em 2em;
              border-left: 4px solid var(--active-border);
              background: var(--bg-secondary);
              border-radius: 4px;
            }
            
            .article-body code {
              background: var(--bg-secondary);
              padding: 2px 6px;
              border-radius: 4px;
              font-family: 'Fira Code', monospace;
              font-size: 0.9em;
            }
            
            .article-body pre {
              background: var(--bg-secondary);
              padding: 1em;
              border-radius: 8px;
              overflow-x: auto;
            }
            
            .article-body h1, .article-body h2, .article-body h3, 
            .article-body h4, .article-body h5, .article-body h6 {
              color: var(--text-primary);
              margin: 1.5em 0 1em;
              line-height: 1.3;
              font-weight: 600;
            }
            
            /* 返回顶部按钮 */
            .back-to-top {
              position: fixed;
              bottom: 30px;
              right: 30px;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              background-color: var(--button-primary-bg);
              color: white;
              border: none;
              font-size: 20px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px var(--shadow-color);
              transition: all 0.3s ease;
              opacity: 0;
              visibility: hidden;
              transform: translateY(20px);
              z-index: 1000;
            }
            
            .back-to-top.visible {
              opacity: 1;
              visibility: visible;
              transform: translateY(0);
            }
            
            .back-to-top:hover {
              background-color: var(--button-primary-hover);
              transform: translateY(-2px);
              box-shadow: 0 6px 16px var(--shadow-color);
            }
            
            /* 文章列表项更多样式 */
            .article-item {
              position: relative;
              padding: 16px;
              border-bottom: 1px solid var(--border-color);
              cursor: pointer;
              transition: all 0.2s ease;
              overflow: hidden;
            }
            
            .article-item::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              width: 3px;
              height: 0;
              background-color: var(--active-border);
              transition: height 0.3s ease;
            }
            
            .article-item:hover::before {
              height: 100%;
            }
            
            .article-item.active {
              background: var(--hover-bg);
              border-left: 4px solid var(--active-border);
            }
            
            /* 添加文章描述预览 */
            .article-preview {
              font-size: 13px;
              color: var(--text-secondary);
              margin-top: 8px;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }
            
            /* 添加文章分类标签 */
            .article-categories {
              display: flex;
              flex-wrap: wrap;
              gap: 6px;
              margin-top: 8px;
            }
            
            .category-tag {
              background-color: var(--bg-secondary);
              color: var(--text-secondary);
              padding: 2px 8px;
              border-radius: 12px;
              font-size: 11px;
              border: 1px solid var(--border-color);
            }
            
            /* 添加文章阅读进度指示器 */
            .article-list::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 3px;
              background: linear-gradient(90deg, var(--active-border) 0%, transparent 100%);
              transform-origin: left;
              transform: scaleX(0);
              transition: transform 0.3s ease;
            }
            
            /* 添加加载动画 */
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .article-item {
              animation: fadeIn 0.5s ease forwards;
            }
            
            .article-item:nth-child(1) { animation-delay: 0.1s; }
            .article-item:nth-child(2) { animation-delay: 0.2s; }
            .article-item:nth-child(3) { animation-delay: 0.3s; }
            .article-item:nth-child(4) { animation-delay: 0.4s; }
            .article-item:nth-child(5) { animation-delay: 0.5s; }
            
            /* 响应式设计优化 */
            @media (max-width: 768px) {
              .article-list {
                width: 280px;
              }
              
              .article-content {
                padding: 20px;
              }
              
              .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                font-size: 16px;
              }
              
              .reader-header {
                padding: 15px;
              }
              
              .feed-title {
                font-size: 20px;
              }
            }
            
            @media (max-width: 480px) {
              .reader-content {
                flex-direction: column;
              }
              
              .article-list {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid var(--border-color);
                max-height: 300px;
              }
              
              .article-content {
                padding: 15px;
              }
            }
        `;
    newDoc.head.appendChild(styleElement);

    const newBody = newDoc.createElement("body");
    newBody.appendChild(container);
    newDoc.documentElement.appendChild(newBody);
    document.documentElement.appendChild(newDoc.documentElement);

    // 初始化主题
    const savedTheme = localStorage.getItem("rss-reader-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    const themeToggleElement = document.querySelector(".theme-toggle");
    if (themeToggleElement) {
      themeToggleElement.textContent = savedTheme === "dark" ? "☀️" : "🌙";
    }

    // 返回顶部按钮显示/隐藏逻辑
    const backToTopButton = document.querySelector(".back-to-top");
    const articleContentElement = document.querySelector(".article-content");

    if (backToTopButton && articleContentElement) {
      articleContentElement.addEventListener("scroll", () => {
        if (articleContentElement.scrollTop > 300) {
          backToTopButton.classList.add("visible");
        } else {
          backToTopButton.classList.remove("visible");
        }
      });
    }
  }

  // 主函数
  async function init() {
    // 检查是否是RSS源
    if (!isRSSFeed()) {
      return;
    }

    // 提取和解析RSS
    const feed = await extractRSS();
    if (!feed) {
      console.log("这不是RSS XML页面");
      return;
    }

    // 创建阅读器界面
    createReaderInterface(feed);
  }

  // 启动程序
  init();
})();
