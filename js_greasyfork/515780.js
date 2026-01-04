// ==UserScript==
// @name         微信文章获取脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  获取并解析微信文章数据
// @match        https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/515780/%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/515780/%E5%BE%AE%E4%BF%A1%E6%96%87%E7%AB%A0%E8%8E%B7%E5%8F%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    let button = document.createElement("button");
    button.innerText = "获取往期文章代码";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = 9999;
    button.style.padding = "10px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    document.body.appendChild(button);

    // 按钮点击事件
    button.addEventListener("click", function() {
        // 获取 body 内容，使用 textContent 以获取纯文本，避免 HTML 标签干扰
        let bodyText = document.body.textContent;

        // 使用正则表达式匹配 &token= 后的数字
        let match = bodyText.match(/&token=(\d+)/);

        // 如果匹配到 token 参数
        let tokenValue="";
        if (match) {
            tokenValue = match[1]; // 提取到的 token 值
            console.log('Token found in body text:', tokenValue); // 输出匹配到的 token 值
        } else {
            console.log('No token found in the body text.');
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=list&search_field=null&begin=0&count=5&query=&fakeid=&type=101_1&free_publish_type=1&sub_action=list_ex&token=${tokenValue}&lang=zh_CN&f=json&ajax=1`,
            headers: {
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if (response.status === 200) {
                    try {
                        let data = JSON.parse(response.responseText);

                        // 获取 publish_page 并反转义解析
                        let publishPage = JSON.parse(data.publish_page.replace(/&quot;/g, '"'));

                        // 获取前三个 publish_info 实体，过滤 is_deleted 为 true 的项
                        let publishList = publishPage.publish_list
                            .map(info => JSON.parse(info.publish_info.replace(/&quot;/g, '"')))
                            .filter(info => info.appmsgex[0] && !info.appmsgex[0].is_deleted)
                            .slice(0, 3);

                        // 构建 HTML 片段
                        let htmlParts = publishList.map(info => {
                            let article = info.appmsgex[0];
                            let link = article.link.replace(/&amp;/g, '&');
                            let picUrl = article.pic_cdn_url_235_1.replace(/&amp;/g, '&');
                            let title = article.title;

                            return `
                                <section>
                                  <a href="${link}" data-linktype="1" _href="${link}">
                                    <section style="width: 100%;display: flex;justify-content: center;align-items: center;">
                                      <section style="width: 100%;background: #ffffff;display: flex;justify-content: flex-start;align-items: center;flex-direction: column;">
                                        <section style="width: 100%;display: flex;justify-content: center;align-items: center;" data-mid="">
                                          <span class="js_jump_icon h5_image_link" data-positionback="static" style="inset: auto;width: 100%;">
                                            <img data-ratio="0.425" src="${picUrl}" data-w="1080" style="width: 100%; max-height: 160px; object-fit: cover; border-radius: 6px;" class="rich_pages wxw-img" data-imgqrcoded="1">
                                          </span>
                                        </section>
                                        <section style="width: 100%;background: rgba(0, 0, 0, 0.65);font-size: 13px;color: rgb(255, 255, 255);line-height: 18px;margin-top: -35px;z-index: 20;" data-mid="">
                                          <p style="padding: 9px 7px 8px;">${title}
                                            <mpchecktext contenteditable="false"></mpchecktext>
                                          </p>
                                        </section>
                                      </section>
                                    </section>
                                  </a>
                                </section>
<p>
  <br>
</p>
                            `;
                        }).join("\n");

                        // 复制到剪贴板
                        GM_setClipboard(htmlParts);
                        alert("文章内容已复制到剪贴板！");
                    } catch (e) {
                        console.error("解析出错：", e);
                        alert("解析出错，请检查控制台日志。");
                    }
                } else {
                    alert("请求失败，状态码：" + response.status);
                }
            }
        });
    });
})();
