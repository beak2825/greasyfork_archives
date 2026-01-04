// ==UserScript==
// @name         BWiki工具列表: List Util
// @version      2.0.2
// @description  为bwiki提供一个快捷工具栏，可以操作当前页面、快速进入其他常见页面。实现简单便于DIY。
// @author       Lu
// @match        *://wiki.biligame.com/*
// @match        *://searchwiki.biligame.com/*
// @exclude      *://wiki.biligame.com/*/api.php*
// @namespace    https://greasyfork.org/users/416853
// @license CC BY-SA
// @downloadURL https://update.greasyfork.org/scripts/444287/BWiki%E5%B7%A5%E5%85%B7%E5%88%97%E8%A1%A8%3A%20List%20Util.user.js
// @updateURL https://update.greasyfork.org/scripts/444287/BWiki%E5%B7%A5%E5%85%B7%E5%88%97%E8%A1%A8%3A%20List%20Util.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /** 常量与配置 */
    const TOOLBAR_ID = 'list_util';
    const TOOLBAR_HTML = `
        <style>
            #${TOOLBAR_ID} {
                position: fixed;
                top: 10px;
                left: 10px;
                z-index: 1501;
            }
            #${TOOLBAR_ID} .dropdown-menu {
                min-width: 80px;
                left: 0;
                top: 30px;
            }
            #${TOOLBAR_ID} .lu-btn {
                padding: 5px;
                color: #1FABE4;
            }
        </style>
        <div id="${TOOLBAR_ID}" class="btn-group" role="group">
            ${generateButtonGroups()}
        </div>
    `;

    /** 工具栏逻辑入口 */
    function main() {
        try {
            if (!document.querySelector('.mediawiki')) {
                console.log('未检测到 MediaWiki 页面，跳过工具栏加载。');
                return;
            }

            // 插入工具栏
            const toolbar = document.createElement('div');
            toolbar.innerHTML = TOOLBAR_HTML;
            document.body.appendChild(toolbar);

            // 修复部分样式问题 如BE的CSS会修改 .dropdown-menu
            fixDropdownMenuStyle();

            console.debug('%c BWiki工具列表加载成功 ', 'background: #4CAF50; color: #fff; padding: 2px 8px; border-radius: 4px;');
        } catch (error) {
            console.error('BWiki工具列表加载失败:', error);
            cleanupOnError();
        }
    }

    /** 生成按钮组 HTML */
    function generateButtonGroups() {
        const username = RLCONF.wgUserName;
        const pagename = RLCONF.wgPageName;
        const pageid = RLCONF.wgArticleId;
        const baseurl = `https://wiki.biligame.com/${RLCONF.wgGameName}/`;

        const buttonGroups = [
            {
                icon: 'glyphicon-user',
                links: [
                    { text: '用户页面' , href: `用户:${username}`},
                    { text: '参数设置' , href: 'index.php?title=特殊:参数设置'},
                    { text: '监视列表' , href: 'index.php?title=特殊:监视列表'},
                    { divider: true },
                    { text: '我的贡献' , href: 'index.php?title=特殊:用户贡献/' + username },
                ]
            },
            {
                icon: 'glyphicon-tasks',
                links: [
                    { text: '特殊页面' , href: 'index.php?title=特殊:特殊页面'},
                    { divider: true },
                    { text: '最近更改' , href: 'index.php?title=特殊:最近更改'},
                    { text: '所有页面' , href: 'index.php?title=特殊:所有页面'},
                    { text: '所有-Mediawiki' , href: 'index.php?title=特殊:所有页面&namespace=8'},
                    { text: '所有-widget' , href: 'index.php?title=特殊:所有页面&namespace=274'},
                    { text: '所有-帮助' , href: 'index.php?title=特殊:所有页面&namespace=12'},
                    { text: '文件列表' , href: 'index.php?title=特殊:文件列表'},
                    { divider: true },
                    { text: '模块' , href: 'index.php?title=特殊:所有页面&namespace=828'},
                    { text: '特殊模板' , href: 'index.php?title=特殊:模板'},
                    { text: '模板' , href: '模板'},
                ]
            },
            {
                icon: 'glyphicon-cog',
                links: [
                    { text: '版主审核' , href: 'index.php?title=特殊:Moderation'},
                    { text: '管理评论' , href: 'index.php?title=特殊:管理FlowThread评论'},
                    { text: '用户权限' , href: 'index.php?title=特殊:用户权限'},
                    { text: '用户组权限' , href: 'index.php?title=特殊:用户组权限'},
                    { text: '贡献得分' , href: 'index.php?title=特殊:贡献得分'},
                    { divider: true },
                    { text: '通用CSS', href: 'MediaWiki:Common.css'},
                    { text: '通用JS', href: 'MediaWiki:Common.js'},
                    { text: '整站通告定义', href: 'MediaWiki:Sitenotice'},
                    { text: 'Bugfix', href: 'Widget:Bugfix'},
                    { text: '小组件定义', href: 'MediaWiki:Gadgets-definition'},
                    { divider: true },
                    { text: '新页面提示', href: 'MediaWiki:Newarticletext'},
                    { text: '页面修改提示', href: 'MediaWiki:Editnotice-0'},
                    { text: '页面删除原因', href: 'MediaWiki:Deletereason-dropdown'},
                    { text: '页面保护原因', href: 'MediaWiki:Protect-dropdown'},
                    { text: '页面编辑版权警示', href: 'MediaWiki:Copyrightwarning2'},
                    { text: '页面修改摘要', href: 'MediaWiki:Summary'},
                    { text: '文件上传提示', href: 'MediaWiki:Uploadtext'},
                    { text: '文件上传协议', href: 'MediaWiki:Licenses'},
                    { text: '文件删除原因', href: 'MediaWiki:Filedelete-reason-dropdown'},
                ]
            },
            {
                icon: 'glyphicon-edit',
                links: [
                    { text: '编辑 (Shift+Alt+E)', href: `${pagename}?action=edit` },
                    { text: '历史 (Shift+Alt+H)', href: `${pagename}?action=history` },
                    { text: '短链接', href: `?curid=${pageid}` },
                    { divider: true },
                    { text: '刷新', href: `${pagename}?action=purge` },
                    { text: '保护', href: `${pagename}?action=protect` },
                    { text: '删除 (Shift+Alt+D)', href: `${pagename}?action=delete` },
                    { divider: true },
                    { text: '入链', href: `index.php?title=特殊:链入页面/${pagename}` },
                    { text: '相关更改', href: `index.php?title=特殊:最近链出更改/${pagename}` },
                    { text: '日志', href: `index.php?title=特殊:日志&page=${pagename}` },
                    { text: '信息', href: `${pagename}?action=info` },
                    { text: '属性', href: `index.php?title=特殊:浏览/${pagename}` },
                ]
            }
        ];

        return buttonGroups.map(group => `
            <div class="btn-group">
                <button class="lu-btn btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
                    <span class="glyphicon ${group.icon}"></span>
                </button>
                <ul class="dropdown-menu">
                    ${group.links.map(link => link.divider ? '<li role="separator" class="divider"></li>' : `
                        <li><a ${link.href ? `href="${baseurl + link.href}"` : ''}>${link.text}</a></li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    }

    /* fix .dropdown-menu css.
       The BwikiBatchEditor remiss set css for all .dropdown-menu
       Solution is : when "#list_util .btn" is click, clear inline css for "#list_util .dropdown-menu".
    */
    function fixDropdownMenuStyle() {
        document.querySelectorAll(`#${TOOLBAR_ID} .btn`).forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll(`#${TOOLBAR_ID} .dropdown-menu`).forEach(menu => {
                    menu.style = '';
                });
            });
        });
    }

    /** 异常处理：清理残留 DOM */
    function cleanupOnError() {
        const toolbar = document.getElementById(TOOLBAR_ID);
        if (toolbar) toolbar.remove();
    }

    /** 延迟加载入口 */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", main);
    } else {
        main();
    }
})();