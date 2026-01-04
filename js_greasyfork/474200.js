// ==UserScript==
// @name         Docker Hub Mirrors
// @namespace    https://github.com/iamspark1e/my-tampermonkey-scripts/blob/main/docker-mirror-urls.js
// @version      0.1.1
// @description  Show other mirrors to pull current docker image.
// @author       iamspark1e
// @license      AGPL-3.0-or-later
// @match        *://hub.docker.com/_/*
// @match        *://hub.docker.com/r/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/474200/Docker%20Hub%20Mirrors.user.js
// @updateURL https://update.greasyfork.org/scripts/474200/Docker%20Hub%20Mirrors.meta.js
// ==/UserScript==

// ref: https://juejin.cn/post/7022654292880424991
// - 阿里云（杭州）   https://registry.cn-hangzhou.aliyuncs.com
// - 阿里云（上海）   https://registry.cn-shanghai.aliyuncs.com
// - 阿里云（青岛）   https://registry.cn-qingdao.aliyuncs.com
// - 阿里云（北京）   https://registry.cn-beijing.aliyuncs.com
// - 阿里云（张家口）   https://registry.cn-zhangjiakou.aliyuncs.com
// - 阿里云（呼和浩特）   https://registry.cn-huhehaote.aliyuncs.com
// - 阿里云（乌兰察布）   https://registry.cn-wulanchabu.aliyuncs.com
// - 阿里云（深圳）   https://registry.cn-shenzhen.aliyuncs.com
// - 阿里云（河源）   https://registry.cn-heyuan.aliyuncs.com
// - 阿里云（广州）   https://registry.cn-guangzhou.aliyuncs.com
// - 阿里云（成都）   https://registry.cn-chengdu.aliyuncs.com
// - 腾讯云   https://mirror.ccs.tencentyun.com
// - 微软云   https://dockerhub.azk8s.com
// - 网易   https://hub-mirror.c.163.com
// - 上海交通大学   https://mirror.sjtu.edu.cn/docs/docker-registry
// - ❤❤❤南京大学   https://docker.nju.edu.cn
// - 道客 DaoCloud   https://f1361db2.m.daocloud.io
// - 阿里云（香港）   https://registry.cn-hongkong.aliyuncs.com
// - 阿里云（日本-东京）   https://registry.ap-northeast-1.aliyuncs.com
// - 阿里云（新加坡）   https://registry.ap-southeast-1.aliyuncs.com
// - 阿里云（澳大利亚-悉尼）   https://registry.ap-southeast-2.aliyuncs.com
// - 阿里云（马来西亚-吉隆坡）   https://registry.ap-southeast-3.aliyuncs.com
// - 阿里云（印度尼西亚-雅加达）   https://registry.ap-southeast-5.aliyuncs.com
// - 阿里云（印度-孟买）   https://registry.ap-south-1.aliyuncs.com
// - 阿里云（德国-法兰克福）   https://registry.eu-central-1.aliyuncs.com
// - 阿里云（英国-伦敦）   https://registry.eu-west-1.aliyuncs.com
// - 阿里云（美国西部-硅谷）   https://registry.us-west-1.aliyuncs.com
// - 阿里云（美国东部-弗吉尼亚）   https://registry.us-east-1.aliyuncs.com
// - 阿里云（阿联酋-迪拜）   https://registry.me-east-1.aliyuncs.com
// - 谷歌云   https://gcr.io
// - 官方   https://registry.hub.docker.com

(function () {
    'use strict';
    const ALTER_HUBS = [
        { "url": "registry.cn-hangzhou.aliyuncs.com", "name": "阿里云（杭州）" },
        { "url": "mirror.ccs.tencentyun.com", "name": "腾讯云" },
        { "url": "dockerhub.azk8s.com", "name": "微软云(Azure)" },
        { "url": "hub-mirror.c.163.com", "name": "网易" },
        { "url": "mirror.sjtu.edu.cn/docs/docker-registry", "name": "上海交通大学" },
        { "url": "docker.nju.edu.cn", "name": "南京大学" },
        { "url": "f1361db2.m.daocloud.io", "name": "DaoCloud" },
        { "url": "gcr.io", "name": "Google" },
        { "url": "registry.hub.docker.com", "name": "官方" },
    ]
    const DOM_IDENTIFIER = "iamspark1e_tampermonkey_docker_mirror_helper"
    const DOM_TPL = `
        <label>
            <span>Choose a mirror: </span>
            <select>
                ${ALTER_HUBS.map(hub => `<option value="${hub.url}">${hub.name}</option>`).join("")}
            </select>
        </label>
        <div class="show_url" style="background-color:rgba(255,255,255,0.3);border-radius:4px;margin-top:4px;padding:4px;"></div>
    `

    const GENERATE_SNIPPETS = (hub, image_name) => `
        <p>URL: <span style="user-select:all;word-break:break-all;">${hub.url + '/' + image_name}</span></p>
        <p>Docker pull: <code style="user-select:all;word-break:break-all;">docker pull ${hub.url + '/' + image_name}</code></p>
    `

    let siblingNode;
    let currentHub = ALTER_HUBS[0];
    let imageFullName;
    let oldHref = window.location.href;

    function renderUrls() {
        let dom = document.querySelector(`#${DOM_IDENTIFIER} div.show_url`);
        dom.innerHTML = GENERATE_SNIPPETS(currentHub, imageFullName)
    }
    function selectHandler(e) {
        currentHub = ALTER_HUBS.find(hub => hub.url === e.target.value);
        renderUrls();
    }

    function initHelper() {
        if (!siblingNode) {
            console.error("no siblingNode, init failed");
            return;
        }
        const mountNode = siblingNode.parentNode.parentNode;
        imageFullName = siblingNode.innerText.replace("docker pull ", "");

        if (!document.querySelector(`#${DOM_IDENTIFIER}`)) {
            const testDiv = document.createElement("div")
            testDiv.setAttribute("style", "border:1px solid #c4c8d1;background-color: #e1e2e6;border-radius: 4px;padding:8px;margin-top: 8px;");
            testDiv.id = DOM_IDENTIFIER;
            testDiv.innerHTML = DOM_TPL;
            mountNode.appendChild(testDiv);

            // addEventListener
            const selector = document.querySelector(`#${DOM_IDENTIFIER} select`);
            selector.addEventListener("change", selectHandler);
            renderUrls();
        }
    }

    let observer = new MutationObserver((mutationList, observer) => {
        if(oldHref !== window.location.href) {
            siblingNode = null;
            oldHref = window.location.href;
        }
        for (const mutation of mutationList) {
            if (mutation.type === "childList" && !siblingNode) {
                const tmp = document.querySelector('code[data-testid="copyPullCommandPullCommand"]')
                if (tmp && !siblingNode) {
                    siblingNode = tmp;
                    initHelper();
                    // observer.disconnect()
                }
            }
        }
    });
    // *://hub.docker.com/_/*
    // *://hub.docker.com/r/*
    observer.observe(document.body, {
        childList: true,
        subtree: true
    })



    // TODO:
    // *://hub.docker.com/_/*/tags
    // *://hub.docker.com/r/*/tags
})();