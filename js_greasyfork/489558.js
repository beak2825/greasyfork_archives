// ==UserScript==
// @name         Gamersky User Blacklist
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  手动实现游民星空用户拉黑
// @author       zib
// @match        *://*.gamersky.com/news/*
// @match        *://*.gamersky.com/tech/*
// @icon         https://www.gamersky.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/489558/Gamersky%20User%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/489558/Gamersky%20User%20Blacklist.meta.js
// ==/UserScript==

let storageBlacklist = GM_getValue('gamersky_blacklist') ? JSON.parse(GM_getValue('gamersky_blacklist')) : [];

let showPanel = (GM_getValue('show_panel') === undefined || GM_getValue('show_panel') === null) ? 1 : GM_getValue('show_panel');

function addToBlacklist(e) {
    if (e.stopPropagation) e.stopPropagation();

    if (e.preventDefault) e.preventDefault();

    const uid = e.target.parentElement.getAttribute('uid');

    const name = e.target.previousSibling.textContent;

    const ok = confirm(`是否拉黑 uid:${uid} 昵称:${name}？`);

    if (ok) {
        if (storageBlacklist.some((i) => i.uid == uid)) {
            storageBlacklist = storageBlacklist.map((i) => {
                if (i.uid == uid) {
                    return { uid, name };
                } else {
                    return i;
                }
            })
        } else {
            storageBlacklist.push({ uid, name });
        }

        GM_setValue('gamersky_blacklist', JSON.stringify(storageBlacklist));

        deleteAllUnameParentContOrCon(e.target);

        refreshBlacklistManagePanel();
    }

    return false;
}

function deleteUnameParentContOrCon(el) {
    while (1) {
        el = el.parentElement;

        if (!el) {
            break;
        }

        if (el.classList.contains('cmt_cont') || el.classList.contains('cmt_reply_con')) {
            if (!el.classList.contains('disable_comment')) {
                el.classList.add('disable_comment');
            }

            break;
        }
    }
}

function deleteAllUnameParentContOrCon() {
    document.querySelectorAll('.Comment a.uname').forEach((i) => {
        const currentUid = i.getAttribute('uid');

        if (storageBlacklist.some((j) => j.uid == currentUid)) {
            deleteUnameParentContOrCon(i);
        }
    })
}

function appendAddBlacklistBtn() {
    document.querySelectorAll('.Comment a.uname:first-child').forEach((i) => {
        if (i.querySelector('.delete_btn')) {
            return;
        }

        const deleteTag = document.createElement('span');

        deleteTag.className = 'delete_btn';

        deleteTag.innerText = '拉黑';

        deleteTag.addEventListener('click', addToBlacklist);

        i.appendChild(deleteTag)
    });
}

function observer() {
    appendAddBlacklistBtn();

    deleteAllUnameParentContOrCon();


    // document.querySelectorAll('.Comment .cmt_cont').forEach((i) => {
    //     if (i.querySelector('.cmt_con').innerText == hiddenText) {
    //         i.classList.add('disable_comment');

    //         addBlacklist(i.querySelector('.uname').innerText);
    //     } else {
    //         i.querySelectorAll('.cmt_reply .cmt_list .cmt_reply_con').forEach((j) => {
    //             if (blacklist.some((k) => k == j.querySelector('.huifu + .uname')?.innerText)) {
    //                 j.classList.add('disable_comment');
    //             } else if (j.querySelector('.cmt_msg .cmt_txt .content').innerText == hiddenText) {
    //                 j.classList.add('disable_comment');

    //                 addBlacklist(j.querySelector('.uname').innerText);
    //             }
    //         })
    //     }
    // });

    // console.log(`共拉黑${blacklist.length}`);

    // console.log('黑名单：', blacklist);

    // console.log(`共屏蔽${document.querySelectorAll('.disable_comment').length}条评论和回复`);
}

function appendManagePanel() {
    const panel = document.createElement('div');

    panel.classList.add('manage_panel');

    const panelBody = document.createElement('div');

    panelBody.classList.add('manage_panel_body');

    panel.appendChild(panelBody);

    panel.addEventListener('click', (e) => {
        if (e.target.classList.contains('blacklist_item')) {
            const uid = e.target.getAttribute('uid');

            const name = e.target.innerText;

            const ok = confirm(`是否取消拉黑 uid:${uid} 昵称:${name}？取消拉黑后会在下一次刷新生效。`);

            if (ok) {
                storageBlacklist = storageBlacklist.filter(i => i.uid != uid);

                GM_setValue('gamersky_blacklist', JSON.stringify(storageBlacklist));

                refreshBlacklistManagePanel();
            }
        }
    })

    const panelSwitch = document.createElement('div');

    panelSwitch.innerText = '收起';

    panelSwitch.classList.add('manage_panel_switch');

    panelSwitch.addEventListener('click', () => {
        panel.classList.add('hide');

        const expand = document.createElement('div');

        expand.innerText = '展开';

        expand.classList.add('manage_panel_show');

        expand.addEventListener('click', () => {
            panel.classList.remove('hide');

            expand.remove();

            GM_setValue('show_panel', 1);
        })

        document.body.appendChild(expand);

        GM_setValue('show_panel', 0);
    });

    if (showPanel == 0) {
        panel.classList.add('hide');

        const expand = document.createElement('div');

        expand.innerText = '展开';

        expand.classList.add('manage_panel_show');

        expand.addEventListener('click', () => {
            panel.classList.remove('hide');

            expand.remove();

            GM_setValue('show_panel', 1);
        })

        document.body.appendChild(expand);
    }

    panel.append(panelSwitch);

    document.body.appendChild(panel);

    refreshBlacklistManagePanel();
}

function refreshBlacklistManagePanel() {
    const blacklist = document.querySelector('.manage_panel .blacklist');

    if (blacklist) {
        blacklist.remove();
    }

    const newBlacklist = document.createElement('div');

    newBlacklist.classList.add('blacklist');

    storageBlacklist.forEach((u) => {
        const blacklistItem = document.createElement('div');

        blacklistItem.innerText = u.name;

        blacklistItem.setAttribute('uid', u.uid);

        blacklistItem.classList.add('blacklist_item')

        newBlacklist.appendChild(blacklistItem);
    });

    const panelBody = document.querySelector('.manage_panel .manage_panel_body');

    panelBody.appendChild(newBlacklist);
}

(function () {
    'use strict';

    try {
        const styleTag = document.createElement('style');

        styleTag.innerText = `
            .disable_comment.disable_comment.disable_comment.disable_comment.disable_comment.disable_comment {
                display: none!important;
            }
            .delete_btn {
                position: absolute;
                left: 0;
                top: -20px;
                background-color: #f5222d;
                color: #fff;
                padding: 0px 5px;
                display: none;
                border-radius: 4px;

            }
            .Comment a.uname:hover .delete_btn {
                display: inline-block;
            }
            .manage_panel {
                padding: 20px 10px 20px 20px;
                box-sizing: border-box;
                z-index: 10000;
                background-color: #fff;
                width: 200px;
                height: 300px;
                position: fixed;
                right: 0;
                top: calc(50% - 150px);
                border-top-left-radius: 20px; 
                border-bottom-left-radius: 20px; 
            }
            .manage_panel .manage_panel_switch {
                background-color: #fff;
                position: absolute;
                height: 20px;
                width: 100%;
                bottom: 0;
                left: 0;
                text-align: center;
                color: #333;
                cursor: pointer;
            }
            .manage_panel .manage_panel_body {
                height: 100%;
                overflow: auto;
            }
            .manage_panel .blacklist {
                padding-top: -3px;
            }
            .manage_panel .blacklist .blacklist_item {
                padding: 4px 4px;
                cursor: pointer;
                margin-top: 3px;
                color: #333;
            }
            .manage_panel .blacklist .blacklist_item:hover {
                background-color: #f0f0f0
            }
            .manage_panel.hide {
                display: none;
            }
            .manage_panel_show {
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
                width: 20px;
                height: 33px;
                background-color: #fff;
                z-index: 10000;
                position: fixed;
                right: 0;
                top: calc(50% - 20px);
                cursor: pointer;
                color: #333;
                text-align: right;
                padding: 5px 5px 5px 0px;
            }
        `;

        document.head.append(styleTag);

        appendManagePanel();

        const mbConfig = {
            childList: true,
            subtree: true
        };

        const mb = new MutationObserver(observer);

        let tryCounts = 0;

        const timer = setInterval(() => {
            tryCounts++;

            const comments = document.querySelector('.Comment .cmt-content .cmt_list_cont');

            if (comments) {
                mb.observe(comments, mbConfig);

                clearInterval(timer);
            } else if (tryCounts > 100) {
                console.log('脚本启动失败');

                clearInterval(timer);
            }
        }, 100);

    } catch (e) {
        alert('出错了，请关闭脚本');

        throw e;
    }
})();