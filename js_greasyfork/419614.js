// ==UserScript==
// @name         GitHub 增强Https复制
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  增强GitHub的复制HTTPS链接，附带加速链接
// @author       tanyiqu
// @match        *://github.com/*
// @grant        none
// @license      GPL-3.0 License
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419614/GitHub%20%E5%A2%9E%E5%BC%BAHttps%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/419614/GitHub%20%E5%A2%9E%E5%BC%BAHttps%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 生成显示信息为 value 的 html
     * @param {String} value value
     */
    const generateHtml = (value) => {

        // v1.0 - v1.2
        return `
        <div class="input-group"
            style="margin-top:8px">
            <input type="text" class="form-control input-monospace input-sm bg-gray-light" data-autoselect
                value="${value}"
                aria-label="${value}" readonly>
            <div class="input-group-button">
                <clipboard-copy value="${value}" aria-label="Copy to clipboard"
                    style="background:#2ea44f;"
                    class="btn btn-sm"
                    data-hydro-click="{&quot;event_type&quot;:&quot;clone_or_download.click&quot;,&quot;payload&quot;:{&quot;feature_clicked&quot;:&quot;COPY_URL&quot;,&quot;git_repository_type&quot;:&quot;REPOSITORY&quot;,&quot;repository_id&quot;:254828127,&quot;originating_url&quot;:&quot;https://github.com/tanyiqu/AnimeArtifactPro&quot;,&quot;user_id&quot;:45875052}}"
                    data-hydro-click-hmac="a56f35a5842340f64cb301e3295c4ff664d7c4f72ff56c8898d98f5769a7b433">
                    <svg
                        class="octicon octicon-clippy" viewBox="0 0 16 16" version="1.1" width="16" height="16"
                        style="color:#ffffff;"
                        aria-hidden="true">
                        <path fill-rule="evenodd"
                            d="M5.75 1a.75.75 0 00-.75.75v3c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-3a.75.75 0 00-.75-.75h-4.5zm.75 3V2.5h3V4h-3zm-2.874-.467a.75.75 0 00-.752-1.298A1.75 1.75 0 002 3.75v9.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-9.5a1.75 1.75 0 00-.874-1.515.75.75 0 10-.752 1.298.25.25 0 01.126.217v9.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-9.5a.25.25 0 01.126-.217z">
                        </path>
                    </svg>
                </clipboard-copy>
            </div>
        </div>
        `
    };

    // 挂载
    let mount = () => {
        let html = '';

        // 获取第一个div
        let div = $("[role='tabpanel']").get(2);
        if (!div) {
            return;
        }

        // 获取第一个input-group标签 原封不动加在上面
        let input_group = $(div).find('.input-group');
        html += $(input_group).prop("outerHTML");
        // 获取原链接地址
        let url = input_group.find('input').val();
        // https://github.com/xxx/yyyy.git

        // 截取后面的仓库名
        let repository_name = url.replace(/http.*?github.com/,'');

        // 添加带有 “git clone” 的div
        html += generateHtml('git clone ' + url);

        // 添加加速链接
        html += generateHtml('git clone https://hub.fastgit.org' + repository_name);
        html += generateHtml('git clone https://gitclone.com/github.com' + repository_name);
        html += generateHtml('git clone https://github.com.cnpmjs.org' + repository_name);

        // 链接下面的一行提示
        html += `<p class="mt-2 mb-0 f6 text-gray">Use Git or checkout with SVN using the web URL.</p>`;

        $(div).html(html);
    };

    // 执行
    mount();

})();