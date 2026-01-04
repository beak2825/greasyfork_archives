// ==UserScript==
// @name         DM-Gitlab-Tools
// @namespace    http://tampermonkey.net/
// @version      2025.12.04
// @description  DM-gitlab deploy
// @author       王勤奋
// @author       秦加兴
// @match        https://restnewqa.innodealing.com/xxl-job-admin/jobinfo*
// @match        https://restnewdev.innodealing.com/xxl-job-admin/jobinfo*
// @match        http://git.innodealing.cn/*
// @match        http://172.16.50.115/*
// @match        http://106.15.34.154:8080/job/*
// @icon         https://web.innodealing.com/dashboard/img/favicon/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459291/DM-Gitlab-Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/459291/DM-Gitlab-Tools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 常量定义 ====================
    const URLS = {
        JENKINS_CLOUD: 'http://106.15.34.154:8080',
        GIT_OLD: '172.16.50.115',
        GIT_NEW: 'git.innodealing.cn',
        CODE_SEARCH: 'http://192.168.5.156:8080',
        DICT_SEARCH: 'https://restqa.innodealing.com/data-dict-search/'
    };

    const ENV = {
        DEV: 'restnewdev.innodealing.com',
        QA: 'restqa.innodealing.com',
        UAT: 'restuat.innodealing.com',
        PROD: 'rest.innodealing.com'
    };

    // ==================== 工具函数 ====================

    /**
     * 获取 URL 参数值
     * @param {string} name - 参数名
     * @returns {string|null} - 参数值
     */
    function getUrlParam(name) {
        const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
        const result = window.location.search.substring(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    }

    /**
     * 添加全局样式
     * @param {string} css - CSS 样式字符串
     */
    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) return;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    /**
     * 创建链接元素
     * @param {string} text - 链接文本
     * @param {string} href - 链接地址
     * @param {string} className - CSS 类名
     * @param {string} title - 提示文本
     * @returns {HTMLElement} - 创建的链接元素
     */
    function createLink(text, href, className = '', title = '') {
        const link = document.createElement('a');
        link.textContent = text;
        link.href = href;
        if (className) link.className = className;
        if (title) link.title = title;
        link.target = '_blank';
        return link;
    }

    // ==================== XXL-Job 插件 ====================

    function xxljobPlugin() {
        const url = window.location.href;

        // 检查是否是 XXL-Job 页面
        if (!url.startsWith('https://restnewqa.innodealing.com/xxl-job-admin/jobinfo') &&
            !url.startsWith('https://restnewdev.innodealing.com/xxl-job-admin/jobinfo')) {
            return;
        }

        console.log('XXL-Job 插件初始化中...');

        // 监听 DOM 变化
        const observer = new MutationObserver((mutationsList, obs) => {
            const dropdownMenu = document.querySelector('ul.dropdown-menu');

            if (!dropdownMenu) return;

            // 停止监听
            obs.disconnect();
            console.log('DM 插件初始化...');

            // 为每个下拉菜单添加 SQL 生成链接
            $('ul.dropdown-menu').each(function () {
                const ulId = $(this).attr('_id');
                const active = window.location.hostname.split('.')[0];

                // 创建 INSERT SQL 链接
                const insertSqlUrl = `https://${active}.innodealing.com/backend-tool/job-admin/insert-sql?active=${active}&id=${ulId}`;
                const insertSqlLi = $(`<li><a class="job_operate" target="_blank" href="${insertSqlUrl}">CREATE INSERT SQL</a></li>`);

                // 检查是否已存在
                const existingItem = $(this).find('li').filter(function () {
                    return $(this).text().indexOf('insert') !== -1;
                });

                if (existingItem.length === 0) {
                    $(this).append('<li class="divider"></li>');
                    $(this).append(insertSqlLi);
                }
            });

            console.log('DM 插件初始化成功');

            // 重新开始监听
            obs.observe(document.body, {childList: true, subtree: true});
        });

        // 开始监听
        observer.observe(document.body, {childList: true, subtree: true});

        // 添加酷炫样式
        addGlobalStyle(`
            .dropdown-menu {
                left: -30px;
                background: rgba(20, 20, 30, 0.95) !important;
                border: 1px solid rgba(100, 200, 255, 0.3) !important;
                border-radius: 8px !important;
                backdrop-filter: blur(10px) !important;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(100, 200, 255, 0.1) !important;
            }

            .dropdown-menu li a {
                color: #e0e0e0 !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            }

            .dropdown-menu li a:hover {
                background: linear-gradient(135deg, rgba(100, 200, 255, 0.2) 0%, rgba(150, 100, 255, 0.2) 100%) !important;
                color: #64C8FF !important;
                transform: translateX(5px) !important;
                border-left: 3px solid #64C8FF !important;
            }
        `);
    }

    // ==================== Git 插件 ====================

    function gitPlugin() {
        const url = window.location.href;

        // 处理旧 GitLab 跳转
        if (url.startsWith(`http://${URLS.GIT_OLD}`)) {
            const newGitUrl = url.replace(URLS.GIT_OLD, URLS.GIT_NEW);
            $('.breadcrumbs-container').append(
                createLink('Go to New Gitlab', newGitUrl, 'append-right-10 btn btn-success has-tooltip pixel-btn')
            );
        }

        // 检查是否是新 GitLab 页面
        if (!url.startsWith(`http://${URLS.GIT_NEW}`)) return;


        let projectName;
        const div = document.querySelector('div[data-testid="nav-item-link-label"]');
        if (div) {
            projectName = div.textContent.trim();
        }
        if (!projectName) {
            // 获取项目名称
            const gitPath = url.replace(`http://${URLS.GIT_NEW}/`, '');
            projectName = gitPath.split('/').pop();
        }

        if (!projectName) return;

        // 处理特殊项目名称映射
        if (projectName === 'dm-web-react') {
            projectName = 'quote-web';
        }

        // 获取分支名称
        let branch = getBranchName();


        const open = `
            <a target='_blank'
               href='idea://open?file=IdeaProjects/${projectName}'
               class='gl-button btn btn-md btn-default has-tooltip shortcuts-find-file pixel-btn'
               title=''>
                <span class='gl-button-text'>Open</span>
            </a>
        `;


        const codeSearch = `
            <a target='_blank'
               href='http://192.168.5.156:8080/'
               class='gl-button btn btn-md btn-default has-tooltip shortcuts-find-file pixel-btn'
               title='代码搜索平台'>
                <span class='gl-button-text'>Code Search</span>
            </a>
        `;


        // 创建 Jenkins 构建按钮
        // const jenkinsBuildUrl = `${URLS.JENKINS_CLOUD}/job/${projectName}-build/build?delay=0sec&build-branch=${branch}`;
        const jenkinsBuildUrl = `https://devops.innodealing.com/application/workflow?projectId=${document.body.dataset.projectId}&branch=${branch}`;
        const jenkinsBuildBtn = `
            <a target='_blank'
               href='${jenkinsBuildUrl}'
               class='gl-button btn btn-md btn-default has-tooltip shortcuts-find-file pixel-btn'
               title='通过CICD平台 Build ${branch}'>
                <span class='gl-button-text'>Build（抢先版）</span>
            </a>
        `;


        const autoCraete = `
            <a href='javascript:autoCreate("${projectName}")'
               class='gl-button btn btn-md btn-default has-tooltip shortcuts-find-file pixel-btn'
               title='自动创建本周迭代Issues和关联Merge Request'>
                <span class='gl-button-text'>Auto Create</span>
            </a>
        `;

        // 创建 Swagger/Loki 下拉菜单
        const swaggerLokiDropdown = createSwaggerLokiDropdown(projectName);

        // 添加到页面
        $('#js-work-item-feedback').append(open+ codeSearch + autoCraete + jenkinsBuildBtn + swaggerLokiDropdown);

        // 检查 CI 状态
        handleCIStatus(url);

        // 添加像素风格样式
        // addPixelStyleForGit();
    }

    // 将函数暴露到全局作用域，以便 HTML 能够调用
    window.autoCreate = function(projectName) {
        const url = `http://139.196.51.46:20010/ci-service/gitlab/create-issues?p=${projectName}`;

        fetch(url)
            .then(response => response.text())
            .then(data => {
                window.location.href = data;
            })
            .catch(error => {
                alert('请求失败: ' + error.message);
            });
    };

    /**
     * 获取当前分支名称
     * @returns {string} - 分支名称
     */
    function getBranchName() {
        let branch = null;

        const isMerged = document.querySelector('span[aria-label="Merged"]');
        // 检查是否已合并
        const refContainers = document.querySelectorAll('.ref-container');
        if (isMerged && refContainers[1]) {
            branch = refContainers[1].getAttribute('title');
        } else if (refContainers[0]) {
            branch = refContainers[0].getAttribute('title');
        }

        // 尝试从下拉按钮获取
        if (!branch) {
            try {
                branch = document.querySelector('.project-page-layout .gl-new-dropdown-button-text')?.innerText;
            } catch (e) {
                // 忽略错误
            }
        }

        return branch || 'master';
    }

    /**
     * 创建 Swagger/Loki 下拉菜单
     * @param {string} projectName - 项目名称
     * @returns {string} - HTML 字符串
     */
    function createSwaggerLokiDropdown(projectName) {
        const menuItems = [
            {label: 'Dict-Search', url: URLS.DICT_SEARCH, divider: false},

            // DEV 环境
            {label: 'DEV Swagger', url: `https://${ENV.DEV}/${projectName}/swagger-ui.html`, divider: true},

            // 生产环境
            {label: 'Prod Swagger', url: `https://${ENV.PROD}/${projectName}/swagger-ui.html`, divider: true},
            {
                label: 'Prod Loki',
                url: `http://172.16.25.44:3000/explore?orgId=1&left=%7B%22datasource%22:%22Loki%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22editorMode%22:%22builder%22,%22expr%22:%22%7Bapp%3D%5C%22${projectName}%5C%22%7D%20%7C%3D%20%60%60%22,%22queryType%22:%22range%22%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D`,                divider: false
            },
            {
                label: 'Prod Workload',
                url: `http://172.16.25.44:3000/d/a164a7f0339f99e89cea5cb47e9be617/kubernetes-compute-resources-workload?orgId=1&refresh=10s&var-datasource=Prometheus&var-cluster=&var-namespace=cg-prd&var-type=deployment&var-workload=${projectName}`,
                divider: false
            },
            {
                label: 'Prod Nginx',
                url: `http://172.16.25.44:3000/explore?orgId=1&left=%7B%22datasource%22:%22Loki%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22editorMode%22:%22builder%22,%22expr%22:%22%7Bapp%3D%5C%22prd-pxy%5C%22%7D%20%7C%3D%20%60%60%22,%22queryType%22:%22range%22%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D`,
                divider: false
            },
            {
                label: 'Prod Show Version',
                url: `http://172.16.25.44:3000/d/cb479e5e-b860-4677-a24a-87871556197a/6YeN5p6E5pyN5Yqh54mI5pys?orgId=1&var-app=${projectName}&from=now-6h&to=now`,
                divider: false
            },
            {
                label: 'Prod Jvm',
                url: `http://172.16.100.12:3000/d/9IFafKA4b/jmx-exporter-dashboard?orgId=1&from=now-5m&to=now&timezone=browser&var-datasource=eefhr8bfr3apsd&var-namespace=cg-prd&var-service=&var-app=${projectName}`,
                divider: false
            },
            {
                label: 'Prod-event Loki',
                url: `http://172.16.25.44:3000/explore?orgId=1&left=%7B%22datasource%22:%22Loki%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22editorMode%22:%22builder%22,%22expr%22:%22%7Bapp%3D%5C%22${projectName}-fix-event%5C%22%7D%20%7C%3D%20%60%60%22,%22queryType%22:%22range%22%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D`,
                divider: false
            },

            // UAT 环境
            {label: 'UAT Swagger', url: `https://${ENV.UAT}/${projectName}/swagger-ui.html`, divider: true},
            {
                label: 'UAT Loki',
                url: `http://10.67.7.127:3000/explore?orgId=1&left=%7B%22datasource%22:%22Loki%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22editorMode%22:%22builder%22,%22expr%22:%22%7Bapp%3D%5C%22${projectName}%5C%22%7D%20%7C%3D%20%60%60%22,%22queryType%22:%22range%22%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D`,
                divider: false
            },
            {
                label: 'UAT Workload',
                url: `http://139.196.226.105:3000/d/a164a7f0339f99e89cea5cb47e9be617/kubernetes-compute-resources-workload?orgId=1&refresh=10s&var-datasource=Prometheus&var-cluster=&var-namespace=cg-uat&var-type=deployment&var-workload=${projectName}`,
                divider: false
            },
            {
                label: 'UAT Jvm',
                url: `http://139.196.226.105:3000/d/9IFafKA4a/jmx-exporter-dashboard?orgId=1&refresh=30s&var-datasource=Prometheus&var-namespace=cg-prd&var-service=${projectName}`,
                divider: false
            },

            // QA 环境
            {label: 'QA Swagger', url: `https://${ENV.QA}/${projectName}/swagger-ui.html`, divider: true},
            {
                label: 'QA Loki',
                url: `http://10.64.3.105:3000/explore?orgId=1&left=%7B%22datasource%22:%22Loki%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22editorMode%22:%22builder%22,%22expr%22:%22%7Bapp%3D%5C%22${projectName}%5C%22%7D%20%7C%3D%20%60%60%22,%22queryType%22:%22range%22%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D`,
                divider: false
            },
            {
                label: 'QA Workload',
                url: `http://10.64.3.105:3000/d/a164a7f0339f99e89cea5cb47e9be617/kubernetes-compute-resources-workload?orgId=1&refresh=10s&var-datasource=Prometheus&var-cluster=&var-namespace=qa&var-type=deployment&var-workload=${projectName}`,
                divider: false
            }
        ];

        const menuItemsHtml = menuItems.map(item => {
            const dividerHtml = item.divider ? "<li class='divider'></li>" : '';
            return `${dividerHtml}<li><a class='btn append-right-10 js-bulk-update-toggle' target='_blank' href='${item.url}'>${item.label}</a></li>`;
        }).join('');

        return `
            <a aria-label="Open Swagger/Loki..."
               class="btn btn-confirm btn-md gl-button gl-new-dropdown-toggle pixel-btn"
               data-container="body"
               data-display="static"
               data-toggle="dropdown"
               href="#"
               title="Open Swagger/Loki...">
                Swagger/Loki
                <svg class="s16 dropdown-btn-icon icon" data-testid="chevron-down-icon">
                    <use href="/assets/icons-aa2c8ddf99d22b77153ca2bb092a23889c12c597fc8b8de94b0f730eb53513f6.svg#chevron-down"></use>
                </svg>
                <i aria-hidden="true" data-hidden="true" class="fa fa-caret-down"></i>
            </a>
            <ul class="dropdown-menu dropdown-menu-right project-home-dropdown pixel-dropdown">
                ${menuItemsHtml}
            </ul>
        `;
    }

    /**
     * 处理 CI 失败状态
     * 使用轮询机制确保检测到 CI 状态元素
     */
    function handleCIStatus(url) {

        if (!url.includes("merge_requests")) {
            return;
        }

        let checkCount = 0;
        const maxChecks = 20; // 最多检查 20 次
        const checkInterval = 500; // 每 500ms 检查一次

        const checkCIStatus = () => {
            checkCount++;

            const failedIcon = document.querySelector('svg[data-testid="status_failed_borderless-icon"]');

            if (failedIcon) {
                // 找到 CI 失败图标
                console.log('检测到 CI 失败状态');
                alert('CI 失败，请确认是否 merge');

                addGlobalStyle(`
                    .accept-merge-request {
                        background-color: #e53e3e !important;
                        color: #ffffff !important;
                        border: 1px solid #c53030 !important;
                    }
                    .accept-merge-request:hover {
                        background-color: #c53030 !important;
                    }
                    button.accept-merge-request,
                    a.accept-merge-request {
                        box-shadow: none !important;
                    }
                `);

                return true; // 停止检查
            }

            // 如果还没达到最大检查次数，继续检查
            if (checkCount < maxChecks) {
                setTimeout(checkCIStatus, checkInterval);
            } else {
                console.log('CI 状态检查完成，未发现失败状态');
            }
        };

        // 开始检查
        checkCIStatus();
    }

    /**
     * 添加 Git 页面的像素风格样式
     */
    function addPixelStyleForGit() {
        addGlobalStyle(`
            /* 像素风格按钮 */
            .pixel-btn {
                font-family: 'Courier New', monospace !important;
                font-weight: bold !important;
                border: 2px solid #333 !important;
                box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3) !important;
                transition: all 0.1s ease !important;
                text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.3) !important;
            }

            .pixel-btn:hover {
                box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.4) !important;
                transform: translate(-1px, -1px) !important;
            }

            .pixel-btn:active {
                box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.3) !important;
                transform: translate(2px, 2px) !important;
            }

            /* 像素风格下拉菜单 */
            .pixel-dropdown {
                font-family: 'Courier New', monospace !important;
                border: 2px solid #333 !important;
                box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.3) !important;
            }

            .pixel-dropdown li a {
                font-weight: bold !important;
                padding: 8px 15px !important;
                border-bottom: 1px dotted #ddd !important;
            }

            .pixel-dropdown li a:hover {
                background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%) !important;
                color: white !important;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5) !important;
            }

            .pixel-dropdown .divider {
                height: 2px !important;
                background: repeating-linear-gradient(
                    90deg,
                    #333,
                    #333 4px,
                    transparent 4px,
                    transparent 8px
                ) !important;
            }
        `);
    }

    // ==================== Jenkins 插件 ====================

    function jenkinsPlugin() {
        const url = window.location.href;

        if (!url.startsWith(`${URLS.JENKINS_CLOUD}/`)) return;

        const urlPath = url.replace(`${URLS.JENKINS_CLOUD}/job/`, '').split('/')[0];

        // 处理 Deploy 任务
        if (urlPath.includes('-deploy')) {
            handleJenkinsDeploy(urlPath);
            return;
        }

        // 处理 Build 任务
        if (urlPath.includes('-build')) {
            handleJenkinsBuild(urlPath);
        }
    }

    /**
     * 处理 Jenkins Deploy 页面
     * @param {string} urlPath - URL 路径
     */
    function handleJenkinsDeploy(urlPath) {
        const projectName = urlPath.replace('-deploy', '');
        let imageTag = getUrlParam('image_tag') || 'latest';

        // 自动填充 IMAGE_TAG
        const inputs = document.getElementsByTagName('input');
        let shouldSet = false;

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === 'IMAGE_TAG') {
                shouldSet = true;
                continue;
            }

            if (shouldSet) {
                inputs[i].value = `a-${imageTag}`;
                break;
            }
        }

        appendBuildLink(projectName);
    }

    /**
     * 处理 Jenkins Build 页面
     * @param {string} urlPath - URL 路径
     */
    function handleJenkinsBuild(urlPath) {
        const projectName = urlPath.replace('-build', '');

        // 修改显示的构建号（添加 a- 前缀）
        const spanElement = document.querySelector('span[style*="margin-left:.2em"]');
        if (spanElement) {
            spanElement.textContent = spanElement.textContent.replace('#', '#a-');
        }

        // 修改链接中的构建号
        const regex = /^#\d+$/;
        const links = document.querySelectorAll('a.model-link');

        links.forEach(link => {
            const content = link.textContent.trim();
            if (regex.test(content)) {
                link.textContent = link.textContent.replace('#', '#a-');
            }
        });

        // 自动填充 BUILD_BRANCH
        const branch = getUrlParam('build-branch') || 'master';
        const inputs = document.getElementsByTagName('input');
        let shouldSet = false;

        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value === 'BUILD_BRANCH') {
                shouldSet = true;
                continue;
            }

            if (shouldSet) {
                inputs[i].value = branch;
                break;
            }
        }

        appendDeployLink(projectName);
    }

    /**
     * 添加 Build 链接
     * @param {string} projectName - 项目名称
     */
    function appendBuildLink(projectName) {
        const link = createLink(
            'Build（云）',
            `${URLS.JENKINS_CLOUD}/job/${projectName}-build`,
            'pixel-jenkins-btn'
        );

        document.body.appendChild(link);
        const breadcrumbs = document.getElementById('breadcrumbs');
        if (breadcrumbs) {
            breadcrumbs.appendChild(link);
        }
    }

    /**
     * 添加 Deploy 链接
     * @param {string} projectName - 项目名称
     */
    function appendDeployLink(projectName) {
        let imageTag;

        try {
            imageTag = document.getElementsByClassName('tip model-link inside build-link display-name')[0]?.innerHTML;
        } catch (e) {
            imageTag = document.getElementsByClassName('model-link inside')[3]?.innerHTML;
        }

        if (imageTag) {
            imageTag = imageTag.replace('#', '').replace('a-', '');
        }

        const link = createLink(
            'Deploy（云）',
            `${URLS.JENKINS_CLOUD}/job/${projectName}-deploy/build?delay=0sec&image_tag=${imageTag}`,
            'pixel-jenkins-btn',
            `Deploy Image Tag is ${imageTag}`
        );

        document.body.appendChild(link);
        const breadcrumbs = document.getElementById('breadcrumbs');
        if (breadcrumbs) {
            breadcrumbs.appendChild(link);
        }

        // 添加像素风格
        addPixelStyleForJenkins();
    }

    /**
     * 添加 Jenkins 页面的像素风格样式
     */
    function addPixelStyleForJenkins() {
        addGlobalStyle(`
            .pixel-jenkins-btn {
                display: inline-block;
                margin: 0 5px;
                padding: 8px 16px;
                font-family: 'Courier New', monospace !important;
                font-weight: bold !important;
                font-size: 14px !important;
                color: #fff !important;
                background: linear-gradient(180deg, #5cb85c 0%, #4cae4c 100%) !important;
                border: 2px solid #3d8b3d !important;
                border-radius: 0 !important;
                box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3) !important;
                text-decoration: none !important;
                text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.3) !important;
                transition: all 0.1s ease !important;
            }

            .pixel-jenkins-btn:hover {
                background: linear-gradient(180deg, #4cae4c 0%, #5cb85c 100%) !important;
                box-shadow: 5px 5px 0px rgba(0, 0, 0, 0.4) !important;
                transform: translate(-1px, -1px) !important;
            }

            .pixel-jenkins-btn:active {
                box-shadow: 1px 1px 0px rgba(0, 0, 0, 0.3) !important;
                transform: translate(2px, 2px) !important;
            }
        `);
    }

    // ==================== 主程序入口 ====================

    window.addEventListener('load', function () {
        console.log('DM-Gitlab-Tools 加载中...');

        xxljobPlugin();
        gitPlugin();
        jenkinsPlugin();

        console.log('DM-Gitlab-Tools 加载完成！');
    });

})();
