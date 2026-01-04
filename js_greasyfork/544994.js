// ==UserScript==
// @name         zhihu to telegraph 知乎回答和文章发送到Telegraph
// @namespace    http://tampermonkey.net
// @version      0.9.11
// @description  一键将知乎文章或回答发送到Telegraph，点击回答或者文章下面的三个点即可看到"发送到telegraph"按钮。
// @author       huaji (Modified by AI)
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @license      MIT
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.telegra.ph
// @downloadURL https://update.greasyfork.org/scripts/544994/zhihu%20to%20telegraph%20%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%92%8C%E6%96%87%E7%AB%A0%E5%8F%91%E9%80%81%E5%88%B0Telegraph.user.js
// @updateURL https://update.greasyfork.org/scripts/544994/zhihu%20to%20telegraph%20%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%92%8C%E6%96%87%E7%AB%A0%E5%8F%91%E9%80%81%E5%88%B0Telegraph.meta.js
// ==/UserScript==

(() => {
  "use strict";

    // --- Start of Telegraph helper functions (无变动) ---

    function showShareOverlay(url) {
        var overlay = document.createElement("div");
        var $=q=>overlay.querySelector(q);
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.5); display: flex;
            justify-content: center; align-items: center; z-index: 10000;
        `;
        overlay.innerHTML = `
            <div style="background-color: white; padding: 20px; border-radius: 5px; text-align: center; max-width: 90%;">
                <p>分享链接:</p>
                <p><a href="${url}" target="_blank" style="word-break: break-all;">${url}</a></p>
                <button class="copy-button" style="margin-right:10px;">复制链接</button>
                <button class="close-button">关闭</button>
                <button class="delete-button" style="margin-left:10px;color:maroon;">删除页面</button>
            </div>
        `;
        document.body.appendChild(overlay);
        $(".copy-button").onclick=()=>navigator.clipboard.writeText(url).then(()=>alert("链接已复制!"));
        $(".close-button").onclick=()=>overlay.remove();
        $(".delete-button").onclick= async () => {
            if (!confirm("确定要删除这个 Telegraph 页面吗? 这个操作无法撤销。")) return;
            try {
                await deleteTelegraph(url);
                alert("页面已删除!\n你可以关闭此窗口。");
                overlay.remove();
            } catch(e) {
                alert("删除失败: " + e.message);
            }
        };
    }

    async function getTgphToken(){
        let token = GM_getValue('tgphToken');
        if(token){ return token; }
        const r = await GM.xmlHttpRequest({method:'GET', url:'https://api.telegra.ph/createAccount?short_name=ZhihuSharer&author_name=ZhihuToTelegraph', responseType:'json'});
        if(r.status>299||r.status<200)throw new Error(`Telegraph API error: ${r.statusText}`);
        const data=r.response;
        if(!data.ok)throw new Error(`Telegraph API error: ${data.error}`);
        token = data.result.access_token;
        GM_setValue('tgphToken', token);
        return token;
    }

    async function uploadToTelegraph(title, content, authorName, authorUrl){
        var telegraphAccessToken=await getTgphToken();
        const payload = {
            access_token: telegraphAccessToken,
            title: title,
            content: content,
            return_content: true,
        };
        if (authorName) payload.author_name = authorName;
        if (authorUrl) payload.author_url = authorUrl;

        const r = await GM.xmlHttpRequest({
            method:'POST',
            url:'https://api.telegra.ph/createPage',
            headers:{'Content-Type':'application/json'},
            data:JSON.stringify(payload),
            responseType:'json'
        });
        if(r.status>299||r.status<200) throw new Error(`Telegraph API error: ${r.statusText}`);
        const data=r.response;
        if(!data.ok) throw new Error(`Telegraph API error: ${data.error}`);
        return `https://telegra.ph/${data.result.path}`;
    }

    async function deleteTelegraph(postUrl){
        var telegraphAccessToken=GM_getValue('tgphToken');
        if(!telegraphAccessToken)throw new Error("telegraphAccessToken NOT FOUND, cannot delete the post!");
        const path = postUrl.split('/').pop().split('?')[0];
        const r = await GM.xmlHttpRequest({
            method: 'POST',
            url: `https://api.telegra.ph/editPage/${path}`,
            headers: {'Content-Type': 'application/json'},
            data: JSON.stringify({
                access_token: telegraphAccessToken,
                title: "Removed by user",
                content: [{"tag":"p","children":["This page has been removed by the author."]}]
            }),
            responseType: 'json'
        });
        if(r.status > 299 || r.status < 200) throw new Error(`Telegraph API error: ${r.statusText}`);
        const j = r.response;
        if(!j.ok) throw new Error(`Telegraph API error: ${j.error}`);
        return j;
    }

    // --- End of Telegraph helper functions ---

  const n = (e) => {
      var t = new URL(e);
      return "link.zhihu.com" == t.hostname ?
        ((t = new URLSearchParams(t.search).get("target")),
          decodeURIComponent(t)) :
        e;
    },
    i = (e, t) =>
    null != e && (e.classList.contains(t) ? e : i(e.parentElement, t));

  var e,
    y = e = e || {};
  (y[(y.H1 = 0)] = "H1"), (y[(y.H2 = 1)] = "H2"), (y[(y.Text = 2)] = "Text"), (y[(y.Figure = 3)] = "Figure"),
  (y[(y.Gif = 4)] = "Gif"), (y[(y.InlineLink = 5)] = "InlineLink"), (y[(y.InlineCode = 6)] = "InlineCode"),
  (y[(y.Math = 7)] = "Math"), (y[(y.Italic = 8)] = "Italic"), (y[(y.Bold = 9)] = "Bold"),
  (y[(y.PlainText = 10)] = "PlainText"), (y[(y.UList = 11)] = "UList"), (y[(y.Olist = 12)] = "Olist"),
  (y[(y.BR = 13)] = "BR"), (y[(y.HR = 14)] = "HR"), (y[(y.Blockquote = 15)] = "Blockquote"),
  (y[(y.Code = 16)] = "Code"), (y[(y.Link = 17)] = "Link"), (y[(y.Table = 18)] = "Table"), (y[(y.Video = 19)] = "Video");

    // --- START: Zhihu DOM Parser functions (无变动) ---
    function getRealImageUrl(imgElement) {
        if (!imgElement) return null;
        let src = imgElement.getAttribute('data-actualsrc');
        if (src) return src;
        src = imgElement.getAttribute('data-original');
        if (src) return src;
        src = imgElement.getAttribute('src');
        if (src && !src.startsWith('data:image/svg+xml')) {
            return src;
        }
        // Fallback for some weird cases where only noscript has the real url
        const parentFigure = imgElement.closest('figure');
        if (parentFigure) {
            const noscriptTag = parentFigure.querySelector('noscript');
            if (noscriptTag) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = noscriptTag.innerHTML;
                const noscriptImg = tempDiv.querySelector('img');
                if (noscriptImg) {
                    return noscriptImg.getAttribute('data-original') || noscriptImg.getAttribute('src');
                }
            }
        }
        return null;
    }

    const u = (t) => {
      var r = [];
      for (let u = 0; u < t.length; u++) {
        var i = t[u];
        if (i.nodeType !== Node.ELEMENT_NODE) continue;
        switch (i.tagName.toLowerCase()) {
          case "h2": r.push({ type: e.H1, text: i.textContent, dom: i }); break;
          case "h3": r.push({ type: e.H2, text: i.textContent, dom: i }); break;
          case "div":
            if (i.classList.contains("highlight")) {
              r.push({ type: e.Code, content: i.textContent, language: i.querySelector("pre > code")?.classList.value.slice(9) || '', dom: i });
            } else if (i.classList.contains("RichText-LinkCardContainer")) {
              const s = i.firstChild;
              r.push({ type: e.Link, text: s.getAttribute("data-text"), href: n(s.href), dom: i });
            } else if (i.querySelector("video")) {
              r.push({ type: e.Video, src: i.querySelector("video").getAttribute("src"), local: !1, dom: i });
            }
            break;
          case "blockquote": r.push({ type: e.Blockquote, content: h(i), dom: i }); break;
          case "figure":
            var s = i.querySelector("img");
            if (!s) break;
            var a = getRealImageUrl(s);
            if (a) {
                if (s.classList.contains("ztext-gif") || a.endsWith('.gif')) {
                    r.push({ type: e.Gif, src: a.replace('_r.jpg', '_1440w.jpg'), local: !1, dom: i });
                } else {
                    r.push({ type: e.Figure, src: a.replace('_r.jpg', '_1440w.jpg'), local: !1, dom: i });
                }
            }
            break;
          case "ul": var o = Array.from(i.querySelectorAll("li")); r.push({ type: e.UList, content: o.map((e) => h(e)), dom: i }); break;
          case "ol": o = Array.from(i.querySelectorAll("li")); r.push({ type: e.Olist, content: o.map((e) => h(e)), dom: i }); break;
          case "p": r.push({ type: e.Text, content: h(i), dom: i }); break;
          case "hr": r.push({ type: e.HR, dom: i }); break;
          case "table":
            var tableData = ((e) => {
              var t, r = [];
              for (t of Array.from(e.rows)) {
                var n = Array.from(t.cells);
                r.push(n.map((e) => e.innerText.trim()));
              }
              return r;
            })(i);
            r.push({ type: e.Table, content: tableData, dom: i });
        }
      }
      return r;
    };
    const h = (t) => {
      if ("string" == typeof t) return [{ type: e.PlainText, text: t }];
      let r = Array.from(t.childNodes);
      var i, a = [];
      try {
        1 == r.length && "p" == r[0].tagName.toLowerCase() && (r = Array.from(r[0].childNodes));
      } catch {}
      for (i of r) {
        if (i.nodeType == i.TEXT_NODE) {
            a.push({ type: e.PlainText, text: i.textContent, dom: i });
        } else if (i.nodeType == Node.ELEMENT_NODE) {
          var s = i;
          switch (s.tagName.toLowerCase()) {
            case "b": case "strong": a.push({ type: e.Bold, content: h(s), dom: s }); break;
            case "i": case "em": a.push({ type: e.Italic, content: h(s), dom: s }); break;
            case "br": a.push({ type: e.BR, dom: s }); break;
            case "code": a.push({ type: e.InlineCode, content: s.innerText, dom: s }); break;
            case "span":
              try {
                if (s.classList.contains("ztext-math")) {
                    a.push({ type: e.Math, content: s.getAttribute("data-tex"), dom: s });
                } else if (s.children[0]?.classList.contains("RichContent-EntityWord")) {
                    a.push({ type: e.PlainText, text: s.innerText, dom: s });
                } else {
                    a.push({ type: e.PlainText, text: s.innerText, dom: s });
                }
              } catch {
                a.push({ type: e.PlainText, text: s.innerText, dom: s });
              }
              break;
            case "a": a.push({ type: e.InlineLink, text: s.textContent, href: n(s.href), dom: s }); break;
          }
        }
      }
      return a;
    };
    const _ = (t) => {
        const r = { type: e.Text, content: [] };
        t.innerText.split("\n").forEach((t, i, arr) => {
            r.content.push({ type: e.PlainText, text: t });
            if (i < arr.length - 1) r.content.push({ type: e.BR });
        });
        return [r];
    };
    // --- END: Zhihu DOM Parser functions ---


    // --- START: IR to Telegraph Node converters (无变动) ---
    function inlineIrToTelegraphNode(inline_ir_array) {
        const tgNodes = [];
        for (const node of inline_ir_array) {
            switch (node.type) {
                case e.PlainText: if (node.text) { tgNodes.push(node.text); } break;
                case e.Bold: tgNodes.push({ tag: 'strong', children: inlineIrToTelegraphNode(node.content) }); break;
                case e.Italic: tgNodes.push({ tag: 'em', children: inlineIrToTelegraphNode(node.content) }); break;
                case e.InlineLink: tgNodes.push({ tag: 'a', attrs: { href: node.href }, children: [node.text] }); break;
                case e.InlineCode: tgNodes.push({ tag: 'code', children: [node.content] }); break;
                case e.BR: tgNodes.push({ tag: 'br' }); break;
                case e.Math: tgNodes.push({ tag: 'code', children: [`$${node.content}$`] }); break;
            }
        }
        return tgNodes.filter(n => n);
    }

    function irToTelegraphNode(ir_array) {
        const tgNodes = [];
        for (const node of ir_array) {
            switch (node.type) {
                case e.H1: tgNodes.push({ tag: 'h3', children: [node.text] }); break;
                case e.H2: tgNodes.push({ tag: 'h4', children: [node.text] }); break;
                case e.Text:
                    if (node.content.length === 1 && node.content[0].type === e.Math) {
                        tgNodes.push({ tag: 'pre', children: [`$$\n${node.content[0].content}\n$$`] });
                    } else {
                        const pChildren = inlineIrToTelegraphNode(node.content);
                        if (pChildren.length > 0) tgNodes.push({ tag: 'p', children: pChildren });
                    }
                    break;
                case e.Figure:
                case e.Gif:
                    tgNodes.push({ tag: 'figure', children: [{ tag: 'img', attrs: { src: node.src } }] });
                    break;
                case e.UList:
                    tgNodes.push({ tag: 'ul', children: node.content.map(li => ({ tag: 'li', children: inlineIrToTelegraphNode(li) }))});
                    break;
                case e.Olist:
                    tgNodes.push({ tag: 'ol', children: node.content.map(li => ({ tag: 'li', children: inlineIrToTelegraphNode(li) }))});
                    break;
                case e.Blockquote:
                    const bqChildren = inlineIrToTelegraphNode(node.content);
                    if (bqChildren.length > 0) tgNodes.push({ tag: 'blockquote', children: [{ tag: 'p', children: bqChildren }] });
                    break;
                case e.Code:
                    tgNodes.push({ tag: 'pre', children: [node.content] });
                    break;
                case e.HR: tgNodes.push({ tag: 'hr' }); break;
                case e.Link: tgNodes.push({ tag: 'p', children: [{ tag: 'a', attrs: { href: node.href }, children: [node.text] }] }); break;
                case e.Video: tgNodes.push({ tag: 'video', attrs: { src: node.src, controls: true } }); break;
                case e.Table:
                    const tableContent = node.content;
                    if (tableContent.length === 0 || tableContent[0].length === 0) break;
                    const colWidths = new Array(tableContent[0].length).fill(0);
                    tableContent.forEach(row => row.forEach((cell, i) => colWidths[i] = Math.max(colWidths[i], cell.length)));
                    let preformattedText = tableContent[0].map((cell, i) => cell.padEnd(colWidths[i])).join(' | ') + '\n';
                    preformattedText += colWidths.map(w => '-'.repeat(w)).join('-|-') + '\n';
                    preformattedText += tableContent.slice(1).map(row => row.map((cell, i) => cell.padEnd(colWidths[i])).join(' | ')).join('\n');
                    tgNodes.push({ tag: 'pre', children: [preformattedText] });
                    break;
            }
        }
        return tgNodes;
    }
    // --- END: IR to Telegraph Node converters ---

    // --- START: Main execution logic (【已修复】) ---
    var k = async () => {
        const contentContainers = document.querySelectorAll(".ContentItem, .Post-content");

        for (const container of contentContainers) {
            try {
                const richText = container.querySelector(".RichText");
                let moreButton = container.querySelector('.ContentItem-actions .OptionsButton');
                if (!moreButton) {
                    moreButton = container.querySelector('.ContentItem-actions .Post-ActionMenuButton button');
                }

                if (!richText || !moreButton || moreButton.dataset.telegraphListenerAdded) {
                    continue;
                }
                moreButton.dataset.telegraphListenerAdded = 'true';

                moreButton.addEventListener('click', () => {
                    setTimeout(() => {
                        const menu = document.querySelector('.Popover-content .Menu');

                        if (menu && !menu.querySelector('.telegraph-menu-item')) {
                            const templateItem = menu.querySelector('button.Menu-item');

                            if (templateItem) {
                                const menuItem = templateItem.cloneNode(true);
                                menuItem.classList.add('telegraph-menu-item');

                                const textSpan = menuItem.querySelector('span');
                                if (textSpan) {
                                    textSpan.textContent = '发送到Telegraph';
                                } else {
                                    menuItem.textContent = '发送到Telegraph';
                                }

                                menuItem.addEventListener('click', async (event) => {
                                    event.stopPropagation();

                                    const popover = menu.closest('.Popover-content');
                                    if (popover) popover.style.display = 'none';

                                    const tempLoadingItem = menuItem.cloneNode(true);
                                    const tempTextSpan = tempLoadingItem.querySelector('span') || tempLoadingItem;
                                    tempTextSpan.textContent = "发送中...";
                                    tempLoadingItem.disabled = true;

                                    const originalDivider = menu.querySelector('.Menu-divider');
                                    if(originalDivider) {
                                        menu.insertBefore(tempLoadingItem, originalDivider);
                                    } else {
                                        menu.appendChild(tempLoadingItem);
                                    }
                                    menuItem.style.display = 'none';

                                    try {
                                        let f;
                                        if (i(richText, "PinItem")) {
                                            const pinLex = _(richText);
                                            Array.from(i(richText, "PinItem").querySelectorAll(".Image-PreviewVague > img")).forEach(img => {
                                                const imgSrc = getRealImageUrl(img);
                                                if (imgSrc) pinLex.push({ type: e.Figure, src: imgSrc });
                                            });
                                            f = { lex: pinLex };
                                        } else {
                                            f = { lex: u(richText.childNodes) };
                                        }

                                        const title = document.querySelector('.Post-Title')?.textContent.trim() || document.querySelector('.QuestionHeader-title')?.textContent.trim() || 'Zhihu Content';
                                        let authorName, authorUrl;

                                        if (container.classList.contains('Post-content')) {
                                             const authorElement = container.querySelector('.AuthorInfo-name .UserLink-link');
                                             authorName = authorElement?.textContent.trim() || '知乎专栏作者';
                                             authorUrl = window.location.href.split('?')[0];
                                        } else {
                                            const authorElement = container.querySelector('.AuthorInfo-name .UserLink-link');
                                            authorName = authorElement?.textContent.trim() || '知乎用户';
                                            const timeLink = container.querySelector('.ContentItem-time a');
                                            authorUrl = window.location.href.split('?')[0];
                                            if (timeLink?.href) {
                                                authorUrl = new URL(timeLink.href, window.location.origin).href;
                                            }
                                        }

                                        const telegraphNodes = irToTelegraphNode(f.lex);
                                        const telegraphUrl = await uploadToTelegraph(title, telegraphNodes, authorName, authorUrl);

                                        showShareOverlay(telegraphUrl);
                                        tempTextSpan.textContent = "发送成功✅";

                                    } catch (error) {
                                        console.error("Error sending to Telegraph:", error);
                                        tempTextSpan.textContent = "发送失败❌";
                                        alert("发送失败: " + error.message);
                                    } finally {
                                        setTimeout(() => {
                                            tempLoadingItem.remove();
                                            menuItem.style.display = '';
                                         }, 2000);
                                    }
                                });

                                const divider = menu.querySelector('.Menu-divider');
                                if (divider) {
                                    menu.insertBefore(menuItem, divider);
                                } else {
                                    menu.appendChild(menuItem);
                                }
                            }
                        }
                    }, 100);
                });
            } catch (err) {
                 console.error("Error processing content container:", err, container);
            }
        }
    };

    const observer = new MutationObserver(() => k());
    observer.observe(document.body, { childList: true, subtree: true });
    k();
    // --- END: Main execution logic ---
})();