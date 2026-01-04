// ==UserScript==
// @name         Stage1 Quote Expander with API Support
// @name:zh-CN   Stage1 论坛引用内容展开器
// @namespace    user-NITOUCHE
// @version      1.2.0
// @description  Expands quote blocks on Stage1 forums to display full quoted post content.
// @description:zh-CN  在 Stage1 论坛展开引用块，显示完整的被引用帖子内容。
// @author       DS泥头车
// @match        https://*.stage1st.com/2b/thread-*
// @icon         https://bbs.stage1st.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/jsrender@1.0.8/jsrender.min.js
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/547212/Stage1%20Quote%20Expander%20with%20API%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/547212/Stage1%20Quote%20Expander%20with%20API%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = jQuery.noConflict();
    const api = 'https://app.saraba1st.com/2b/api/app';
    const dialogTmpl = $.templates(`
        <div id="login-dialog" style="width: 400px; height: 260px; position: fixed; top: 50%; left: 50%; margin-left: -200px; margin-top: -130px; z-index: 999; background: #F6F7EB; border: 3px solid #CCCC99; padding-left: 20px;">
            <div style="width: 100%; padding-top: 20px;">通过s1官方app接口查看不可见内容，需要单独登录</div>
            <div style="width: 100%; padding-top: 20px"><input type="text" id="username" value="{{:username}}" placeholder="用户名"></div>
            <div style="width: 100%; padding-top: 20px"><input type="password" id="password" value="{{:password}}" placeholder="密码"></div>
            <div style="width: 100%; padding-top: 20px">
                <select id="questionId">
                    <option value="0">安全提问(未设置请忽略)</option>
                    <option value="1">母亲的名字</option>
                    <option value="2">爷爷的名字</option>
                    <option value="3">父亲出生的城市</option>
                    <option value="4">您其中一位老师的名字</option>
                    <option value="5">您个人计算机的型号</option>
                    <option value="6">您最喜欢的餐馆名称</option>
                    <option value="7">驾驶执照最后四位数字</option>
                </select>
            </div>
            <div id="answer-row" hidden>
                <div style="width: 100%; padding-top: 20px"><input type="text" id="answer" placeholder="答案"></div>
            </div>
            <div style="width: 100%; padding-top: 20px"><button id="login-confirm">确定</button></div>
            <div style="width: 100%; padding-top: 20px; color: red">{{:msg}}</div>
        </div>`);

    // **Modified postTmpl:  Simplified to render only message content**
    const postTmpl = $.templates(`
        {{:message}}
        {{if errorMessage}}
            <div style="color: var(--quote-error-color, red); font-size: smaller; margin-top: 5px;">
                <b>加载失败:</b> {{:errorMessage}}
            </div>
        {{/if}}
    `);

    function login(username, password, questionId, answer) {
        const data = {
            username: username,
            password: password
        }
        if (questionId !== '0') {
            data.questionid = questionId;
            data.answer = answer;
        }
        $.ajax({
            type: 'POST',
            url: api + '/user/login',
            data: data,
            success: function (resp) {
                const code = resp.code.toString();
                if (code.startsWith('50')) {
                    loginAndReplaceThreadContent({username, password, msg: resp.message});
                    return;
                }
                localStorage.setItem('app_sid', resp.data.sid);
                $('#login-dialog').remove();
                // After successful login, re-process quotes to fetch content via API if needed
                processAllQuotes(); // Call function to re-process quotes
            },
            error: function (err) {
                loginAndReplaceThreadContent({username, password, msg: '请求错误'});
            }
        });
    }

    function loginAndReplaceThreadContent(data) {
        $('#login-dialog').remove();
        $('body').append(dialogTmpl.render(data));
        const rawHeight = $('#login-dialog').height();
        $('#questionId').change(function () {
            let questionId = $(this).val();
            if (questionId === '0') {
                $('#login-dialog').height(rawHeight);
                $('#answer-row').hide();
            } else {
                $('#login-dialog').height(rawHeight + 44);
                $('#answer-row').show();
            }
        });
        $('#login-confirm').click(function () {
            const username = $('#username').val();
            const password = $('#password').val();
            const questionId = $('#questionId').val();
            const answer = $('#answer').val();
            login(username, password, questionId, answer);
        });
    }

    function handleRequest(resp, resolve, reject) {
        resp = typeof resp === 'string' ? JSON.parse(resp) : resp;
        const code = resp.code.toString();
        if (code.startsWith('50')) {
            localStorage.removeItem('app_sid');
            reject();
            return;
        }
        resolve(resp.data);
    }

    let sid = localStorage.getItem('app_sid');

    function fetchQuoteContentFromAPI(pid, blockquote, quoteHeaderHTML, ptid, originalQuoteContent) {
        if (!sid) {
            loginAndReplaceThreadContent({msg: "需要登录S1 App账号才能查看被禁言内容"});
            renderBlockquoteWithError(blockquote, quoteHeaderHTML, originalQuoteContent, "需要登录S1 App账号");
            return;
        }

        if (!ptid) {
            renderBlockquoteWithError(blockquote, quoteHeaderHTML, originalQuoteContent, "无法获取主题ID");
            console.error("无法获取主题ID (ptid) - ptid was not passed to fetchQuoteContentFromAPI correctly.");
            return;
        }

        $.ajax({
            type: 'POST',
            url: api + '/thread/page',
            data: {
                sid: sid,
                tid: ptid,
                pageNo: 1
            },
            success: function (resp) {
                const code = resp.code.toString();
                if (code.startsWith('50')) {
                    localStorage.removeItem('app_sid');
                    loginAndReplaceThreadContent({msg: resp.message});
                    renderBlockquoteWithError(blockquote, quoteHeaderHTML, originalQuoteContent, "API请求失败，请重新登录");
                    return;
                }
                const postList = resp.data.list;
                let foundPostData = null;
                for (const post of postList) {
                    if (post.pid.toString() === pid) {
                        foundPostData = post;
                        break;
                    }
                }

                console.log("API Response (resp):", resp);
                console.log("API Response Data (postList):", postList);
                console.log("Found Post Data for PID", pid, ":", foundPostData);

                if (foundPostData && foundPostData.message) {
                    const renderedContent = postTmpl.render(foundPostData);
                    blockquote.innerHTML = quoteHeaderHTML + '<br>' + renderedContent; // **Directly set innerHTML, combining header and rendered content**
                    processAllQuotes();

                } else {
                    renderBlockquoteWithError(blockquote, quoteHeaderHTML, originalQuoteContent, "API内容为空或未找到PID");
                    console.warn("API returned empty content or PID not found for pid:", pid, "in thread page API response");
                }
            },
            error: function (err) {
                renderBlockquoteWithError(blockquote, quoteHeaderHTML, originalQuoteContent, "API请求出错");
                console.error("API request error:", err);
            }
        });
    }


    function renderBlockquoteWithError(blockquote, quoteHeaderHTML, originalQuoteContent, errorMessage) {
        let newBlockquoteHTML = '';
        if (quoteHeaderHTML) {
            newBlockquoteHTML += quoteHeaderHTML + '<br>';
        }
        // Render postTmpl with originalQuoteContent as message and errorMessage
        newBlockquoteHTML += postTmpl.render({ message: originalQuoteContent, errorMessage: errorMessage });
        blockquote.innerHTML = newBlockquoteHTML;
    }


    function processQuoteDiv(quoteDiv) {
        const blockquote = quoteDiv.querySelector('blockquote');
        if (!blockquote) return;
        const quoteText = blockquote.textContent.trim();
        if (quoteText.endsWith(' ...')) {
            const linkElement = quoteDiv.querySelector('font[size="2"] a');
            if (!linkElement) return;
            const postLink = linkElement.href;
            const urlParams = new URLSearchParams(new URL(postLink).search);
            const pid = urlParams.get('pid');
            const ptid = urlParams.get('ptid');
            console.log("Debug processQuoteDiv - ptid:", ptid, "pid:", pid, "postLink:", postLink);
            if (pid && ptid) {
                // 1. 提前提取引用头 HTML
                let quoteHeaderHTML = '';
                let originalQuoteContent = '';
                try {
                    const headerElements = blockquote.querySelectorAll('font[size="2"]');
                    const tempBlockquote = blockquote.cloneNode(true); // Clone before header extraction

                    headerElements.forEach(headerElement => {
                        quoteHeaderHTML += headerElement.outerHTML + '<br>';
                    });

                    // Remove header elements from the cloned blockquote
                    headerElements.forEach(headerElement => {
                        if (headerElement.parentNode && headerElement.parentNode.nextSibling && headerElement.parentNode.nextSibling.nodeName === 'BR') {
                            tempBlockquote.removeChild(headerElement.parentNode.nextSibling); // Remove <br> after <font>
                        }
                        tempBlockquote.removeChild(headerElement.parentNode); // Remove <font> parent
                    });


                    originalQuoteContent = tempBlockquote.innerHTML.trim();


                } catch (error) {
                    console.warn("Error extracting quote header:", error);
                    originalQuoteContent = blockquote.innerHTML.trim(); // Fallback to original content on error
                }


                GM_xmlhttpRequest({
                    url: postLink,
                    method: 'GET',
                    onload: function(response) {
                        if (response.status === 200) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            const postContentSelector = '#postmessage_' + pid;
                            const originalPostContentElement = doc.querySelector(postContentSelector);
                            if (originalPostContentElement) {
                                let fullPostContentHTML = originalPostContentElement.innerHTML;
                                // **Remove leading <br> and whitespace from fullPostContentHTML**
                                fullPostContentHTML = fullPostContentHTML.replace(/^(\s*<br\s*\/?>\s*)+/, '');
                                blockquote.innerHTML = quoteHeaderHTML + '<br>' + fullPostContentHTML; // **Directly set innerHTML for success**
                                processAllQuotes(); // **Re-process all quotes after successful expansion**

                            } else {
                                // If GM_xmlhttpRequest fails to find content, try API
                                fetchQuoteContentFromAPI(pid, blockquote, quoteHeaderHTML, ptid, originalQuoteContent);
                            }
                        } else {
                            // If GM_xmlhttpRequest fails (e.g., 404, 500), try API
                            fetchQuoteContentFromAPI(pid, blockquote, quoteHeaderHTML, ptid, originalQuoteContent);
                        }
                    },
                    onerror: function(error) {
                        // If GM_xmlhttpRequest errors out, try API
                        fetchQuoteContentFromAPI(pid, blockquote, quoteHeaderHTML, ptid, originalQuoteContent);
                    }
                });
            } else {
                blockquote.innerHTML = '<span style="color: var(--quote-error-color, red);">无法获取帖子或主题ID</span>';
                console.error("无法获取帖子或主题ID from link:", postLink);
            }
        }
    }

    function processAllQuotes() {
        const quoteDivs = document.querySelectorAll('div.quote');
        quoteDivs.forEach(processQuoteDiv);
    }

    processAllQuotes(); // Initial processing of quotes on page load. Ask if this line still needed.

    GM_addStyle(`
        :root {
            --quote-loading-color: grey;
            --quote-error-color: red;
        }
        /* Optional: Copy CSS from "查看S1不可见内容" script here if you want login dialog styles */
        #login-dialog {
            width: 400px; height: 260px; position: fixed; top: 50%; left: 50%; margin-left: -200px; margin-top: -130px; z-index: 999; background: #F6F7EB; border: 3px solid #CCCC99; padding-left: 20px;
        }
        #login-dialog div {
            width: 100%; padding-top: 20px;
        }
        #login-dialog input[type="text"], #login-dialog input[type="password"], #login-dialog select {
            width: calc(100% - 20px); padding: 8px; margin: 0; box-sizing: border-box;
        }
        #login-dialog button {
            padding: 8px 15px; cursor: pointer;
        }
    `);

})();