// ==UserScript==
// @name         U2历史记录
// @namespace    https://u2.dmhy.org/
// @version      0.8.0
// @description  查看种子历史记录
// @author       kysdm
// @grant        none
// @match        *://u2.dmhy.org/details.php?*
// @match        *://u2.dmhy.org/offers.php?*
// @match        *://u2.dmhy.org/forums.php?action=viewtopic*
// @icon         https://u2.dmhy.org/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @require      https://unpkg.com/thenby@1.3.4/thenBy.min.js
// @require      https://unpkg.com/diff@5.1.0/dist/diff.js
// @require      https://cdn.jsdelivr.net/npm/diff2html@3.4.40/bundles/js/diff2html.min.js
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/428545/U2%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/428545/U2%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

/*
本脚本基于 Bamboo Green 界面风格进行修改
/*
 
/*
GreasyFork 地址
    https://greasyfork.org/zh-CN/scripts/428545
*/

/*
使用说明
    https://u2.dmhy.org/forums.php?action=viewtopic&topicid=13495&page=p150133#pid150133
*/

/*
更新日志
    https://github.com/kysdm/u2_share/commits/main/u2share_history.user.js
*/

'use strict';

// 声明全局变量
var lang, torrent_id, db, user_id, topicid, key, token;

(async () => {
    // 初始化
    addGlobalStyles(`.diff-container{display:flex;align-items:flex-start;justify-content:flex-start;}.diff-cell{border:none;padding:0;margin-left:5px;flex:1;}.draw-div{box-sizing:border-box;max-width:100%;min-height:15px;max-height:600px;margin:5px;overflow:auto;border-top:1px solid #bfbfbf;border-bottom:1px solid #bfbfbf;}.diff-table{width:100%;border-left:1px solid #bfbfbf;border-right:1px solid #bfbfbf;background-color:white;}.diff-table table,.diff-table table td{background-color:transparent;border:none;vertical-align:top;}.diff-table,.diff-table table{border-collapse:collapse;box-sizing:border-box;table-layout:fixed;font-family:ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;font-size:12px;}.diff-table tbody{vertical-align:top;}.diff-table del{text-decoration:none;background-color:#ff818266;}.diff-table ins{text-decoration:none;background-color:#abf2bc;}.diff-linenumber{text-align:right;vertical-align:top;width:3em;border:none;color:#6e7781;font-size:12px;}.diff-linenumber-delete{background-color:#ffd7d5;}.diff-linenumber-insert{background-color:#ccffd8;}.diff-line-text-delete{background-color:#ffebe9;}.diff-line-text-insert{background-color:#e6ffec;}.diff-linenumber-empty,.diff-text-cell-empty{background-color:#d0d8e080;}.diff-line-text{display:inline-block;white-space:pre-wrap;overflow-wrap:break-word;word-break:break-word;box-sizing:border-box;width:auto;font-size:12px;}.diff-line-prefix{background:none;word-wrap:break-word;display:inline;font-size:12px;box-sizing:border-box;vertical-align:top;}.diff-line-prefix-delete::before{content:" - ";}.diff-line-prefix-insert::before{content:" + ";}.diff-line-prefix-empty::before{content:"   ";}.diff-text-cell,.diff-text-cell-empty{width:auto;white-space:pre;border-left:none;border-right:1px solid #bfbfbf;border-top:none;border-bottom:none;}`);
    lang = new lang_init($('#locale_selection').val()); // 获取当前网页语言
    let em = /.*id=(?<tid>\d{3,5})/i.exec(location.search); if (em) torrent_id = em.groups.tid; else torrent_id = null; // 当前种子ID
    topicid = location.href.match(/topicid=(\d+)/i) || ['', '']; if (topicid[1] !== '') topicid = topicid[1];
    user_id = $('#info_block').find('a:first').attr('href').match(/\.php\?id=(\d{3,5})/i) || ['', '']; if (user_id[1] !== '') user_id = user_id[1]; // 当前用户ID
    db = localforage.createInstance({ name: "history" });
    // key = await db.getItem('key');
    token = await db.getItem('token');
    if (token === null || token.length !== 96) { new auth(); return; };
    if (torrent_id && /\/(offers|details)\.php/i.test(location.pathname) && $('#outer').find('h2').text().match(/错误|錯誤|Ошибка|error/i)) { torrentInfoHistoryReset(); torrentCommentHistoryReset(); }// 为已经删除的种子显示历史
    else if (torrent_id && '/offers.php' === location.pathname && !/(cmtpage|offer_vote|vote)=(1|p)/i.test(location.href) && /off_details=1/i.test(location.href)) { torrentInfoHistory(); torrentCommentHistory(); } // 为正常种子显示历史
    else if (torrent_id && '/details.php' === location.pathname && !/(cmtpage|offer_vote|vote)=(1|p)/i.test(location.href)) { torrentInfoHistory(); torrentCommentHistory(); } // 为正常种子显示历史
    else if (torrent_id && /\/(offers|details)\.php/i.test(location.pathname) && /cmtpage=1/i.test(location.href)) { torrentCommentHistory(); } // 为正常种子显示历史 <仅评论>
    else if (/\/forums\.php\?action=viewtopic/i.test(location.href) && $('#outer').find('h2').text().match(/错误|錯誤|Ошибка|error/i)) { forumCommentHistoryReset(); } // 为被删除的论坛帖子显示历史
    else if (/\/forums\.php\?action=viewtopic/i.test(location.href)) { forumCommentHistory(); }; // 为论坛帖子显示历史
})();

function auth() {

    $('#outer').html(`<h1 align="center">U2种子历史记录 自动鉴权工具</h1>
    <table border="0" align="center" cellspacing="0" cellpadding="5">
        <tbody>
            <tr>
                <td valign="top" width="500" align="center"><span style="word-break: break-all; word-wrap: break-word;">
                        <bdo dir="ltr">点击开始按钮，将自动进行鉴权，提示完成请刷新界面。<br>(建议手动备份下个人说明)<br></bdo></span></td>
            </tr>
            <tr>
                <td valign="top" align="left"><span style="word-break: break-all; word-wrap: break-word;">
                        <bdo id="auth_log" dir="ltr"></bdo></span></td>
            </tr>
            <tr>
                <td align="center">
                    <button id="auth_token" class="codebuttons" style="font-size:11px;margin-right:3px;" type="button">开始鉴权</button>
                    <button id="auth_token_d" class="codebuttons" style="font-size:11px;margin-right:3px;" type="button">已有TOKEN</button>
                    <button id="auth_token_reload" class="codebuttons" style="font-size:11px;margin-right:3px;display:none;" type="button">刷新网页</button>
                </td>
            </tr>
        </tbody>
    </table>`);

    $("#auth_token_d").click(async function () {
        let __token = window.prompt("请输入Token"); // 弹窗提示输入Token
        if (__token === null || __token.length === 0) return; // 没有任何输入时 无视本次操作
        else if (__token.length !== 96) {
            await outPutLog(`Token: ${__token}`);
            await outPutLog(`Token长度不正确`);
            return;
        } // TOKEN长度不正确时 无视本次操作
        else {
            await db.setItem('token', __token);
            await outPutLog(`Token: ${__token}`);
            await outPutLog('鉴权结束');
            $("#auth_token").hide();
            $("#auth_token_d").hide();
            $("#auth_token_reload").show();
        };
    });

    $("#auth_token_reload").click(function () {
        window.location.reload();
    });

    function getProfile() {
        return new Promise(async (resolve, reject) => {
            $.ajax({
                type: 'get',
                url: 'https://u2.dmhy.org/usercp.php?action=personal',
                cache: false,
                success: async r => {
                    const usercp = document.createElement('div');
                    usercp.innerHTML = r;
                    // const profile = $(usercp).find('[name="info"]').text(); // 获取用户信息
                    const profile = {
                        "action": "personal",
                        "type": "save",
                        "acceptpms": $(usercp).find('[name="acceptpms"]:checked').val(), // 接受以下短讯
                        // 如果不需要开启对应功能，则不发送该参数
                        "deletepms": $(usercp).find('[name="deletepms"]').is(':checked') ? 'on' : '',  // 回复后删除短讯
                        "savepms": $(usercp).find('[name="savepms"]').is(':checked') ? 'on' : '', // 保存短讯至发件箱
                        "commentpm": $(usercp).find('[name="commentpm"]').is(':checked') ? 'yes' : '', // 我发布的种子有新评论时通知我
                        "atpm": $(usercp).find('[name="atpm"]').is(':checked') ? '1' : '',// 有人在群聊区@我时通知
                        "quotepm": $(usercp).find('[name="quotepm"]').is(':checked') ? '1' : '',// 有人在论坛、种子评论或候选评论引用我时通知。
                        // 如果不需要开启对应功能，则不发送该参数
                        "country": $(usercp).find('[name="country"]').val(),  // 国家/地区
                        "download": $(usercp).find('[name="download"]').val(),// 下行带宽
                        "upload": $(usercp).find('[name="upload"]').val(),// 上行带宽
                        "isp": $(usercp).find('[name="isp"]').val(),// 互联网服务提供商
                        "savatar": $(usercp).find('[name="savatar"]').val(), // 选择头像
                        "avatar": $(usercp).find('[name="avatar"]').val(), // 自定义头像
                        "info": $(usercp).find('[name="info"]').text() // 个人说明
                    };
                    let profileAuth = { ...profile }; // 复制
                    profileAuth.info = `-----BEGIN API KEY-----\n${key}\n-----END API KEY-----\n\n${profile.info}`; // 在个人说明加入鉴权信息
                    //         const p = profileAuth.info.replace(/\r\n/g, () => { return '<br>' }).replace(/\n/g, () => { return '<br>' }).replace(/\r/g, () => { return '<br>' });
                    //         await outPutLog(`请检查准备写入个人说明的BBCODE是否正确<br><br><table class="spoiler" width="100%">
                    //        <tbody>
                    //            <tr>
                    //                <td class="colhead">个人说明&nbsp;&nbsp;<button class="spoiler-button-show" style="">检查一下</button>
                    //                     <button id="auth_profile_check" class="spoiler-button-hide" style="display: none;">检查完成</button></td>
                    //            </tr>
                    //            <tr>
                    //                <td><span class="spoiler-content" style="display: none;">${p}</span></td>
                    //            </tr>
                    //        </tbody>
                    //    </table>`);
                    await db.setItem('profile', profile); // 存储用户信息
                    //         $("#auth_profile_check").click(async function (ev) {
                    //             $(this).hide();
                    //             $(this).siblings(".spoiler-button-show").show();
                    //             $(this).parentsUntil(".spoiler").find("span.spoiler-content:first").hide();
                    //             ev.preventDefault();
                    //             return resolve(profileAuth);
                    //         });
                    return resolve(profileAuth);
                },
                error: async d => {
                    await outPutLog('获取个人说明BBCODE失败');
                    await outPutLog(`错误信息: ${d.responseText}`);
                    return reject(Error(d.responseText));
                },
            });
        });
    };

    function postProfile(data) {
        return new Promise(async (resolve, reject) => {
            $.ajax({
                type: 'post',
                url: 'https://u2.dmhy.org/usercp.php',
                cache: false,
                contentType: "application/x-www-form-urlencoded",
                data: data,
                success: async r => {
                    await outPutLog('修改个人说明BBCODE成功');
                    return resolve(key);
                },
                error: async d => {
                    await outPutLog('修改个人说明BBCODE失败');
                    await outPutLog(`错误信息: ${d.responseText}`);
                    return reject(Error(d.responseText));
                },
            });
        });
    };

    function getAuthKey() {
        return new Promise(async (resolve, reject) => {
            $.ajax({
                type: 'post',
                url: 'https://u2.kysdm.com/api/v1/token',
                contentType: "application/json",
                dataType: 'json',
                // async: false,
                data: JSON.stringify({ "uid": user_id }),
                success: async function (d) {
                    if (d.msg === 'success') {
                        key = d.data.key
                        db.setItem('key', key);
                        await outPutLog('获取Key成功');
                        await outPutLog(`Key: ${key}`);
                        return resolve(key);
                    } else {
                        await outPutLog('获取Key失败');
                        await outPutLog(`错误信息: ${JSON.stringify(d)}`);
                        return reject(Error('获取Key失败'));
                    };
                },
                error: async function (d) {
                    await outPutLog('获取Key失败');
                    await outPutLog(`错误信息: ${d.responseText}`);
                    return reject(Error('获取Key失败'));
                },
            });
        });
    };

    function getToken() {
        return new Promise(async (resolve, reject) => {
            $.ajax({
                type: 'post',
                url: 'https://u2.kysdm.com/api/v1/token',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify({ "uid": user_id, "key": key }),
                success: async function (d) {
                    if (d.msg === 'success') {
                        let __token = d.data.token
                        await outPutLog('获取Token成功');
                        await outPutLog(`Token: ${__token}`);
                        await db.setItem('token', __token);
                        return resolve(__token);
                    } else {
                        await outPutLog('获取Token失败');
                        await outPutLog(`错误信息: ${JSON.stringify(d)}`);
                        return reject(Error('获取Token失败'));
                    };
                },
                error: async function (d) {
                    await outPutLog('获取Token失败');
                    await outPutLog(`错误信息: ${d.responseText}`);
                    return reject(Error('获取Token失败'));
                },
            });
        });
    };

    function outPutLog(text) {
        return new Promise(async (resolve, reject) => {
            const log = $('#auth_log').html();
            $('#auth_log').html(`${log}${getDateString()} - ${text}<br>`);
            resolve(await sleep(0));
        });
    };

    async function sleep(interval) {
        return new Promise(resolve => {
            setTimeout(resolve, interval);
        })
    };

    $("#auth_token").click(async function () {
        $("#auth_token").attr('disabled', "true");
        $("#auth_token_d").attr('disabled', "true");
        await outPutLog('鉴权开始');
        await outPutLog('获取鉴权所需的Key');
        getAuthKey()
            .then(async () => {
                await outPutLog('获取个人说明BBCODE');
                return getProfile();
            })
            .then(async data => {
                await outPutLog('修改个人说明BBCODE');
                await postProfile(data);
            })
            .then(async () => {
                await outPutLog('获取鉴权所需的Token');
                await getToken();
            })
            .then(async () => {
                await outPutLog('还原个人说明BBCODE');
                await postProfile(await db.getItem('profile'));
            })
            .catch(async err => {
                await outPutLog(err);
            })
            .finally(async () => {
                await outPutLog('鉴权结束');
                $("#auth_token").hide();
                $("#auth_token_d").hide();
                $("#auth_token_reload").show();
            });
    });
};

function forumCommentHistoryReset() {
    const errorstr = $('#outer').find('td.text').text();
    // 正在努力加载中...
    $('#outer').find('td.text').html(errorstr + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>' + lang['history_text_loading'] + '</i>');

    $.ajax({
        type: 'post',
        url: 'https://u2.kysdm.com/api/v1/comment',
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({ "uid": user_id, "token": token, "topicid": topicid, "type": "forum" }),
        success: function (d) {
            if (d.msg === 'success') {
                console.log('获取论坛评论成功');
                let __comment = d.data.comment[topicid].sort(firstBy((a, b) => a.pid - b.pid).thenBy((a, b) => b.self - a.self)); // 如果用self排序，消息顺序不正确，则改用编辑日期排序

                if (__comment.length === 0) { // 没有评论 可以说不会出现这种情况
                    console.log('没有历史记录.');
                    $('#outer').find('td.text').html(errorstr + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + lang['history_text_empty'] + '</i>');
                    return;
                };

                const locked = __comment.some(x => x.locked === 1);  // 检查帖子是否被锁定

                // 计算pid出现次数
                let pidList = __comment.map(x => x.pid);
                let counts = new Object();
                pidList.forEach(x => counts[x] = counts[x] ? counts[x] + 1 : 1);
                const pidListSet = [...new Set(pidList)]; // 去重

                // 还原网页
                $('#outer').html(`
                <table class="main" width="940" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td class="embedded" align="center">
                                <h1 align="center"><span id="top"></span></h1><br><br>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="main" width="940" border="0" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td class="embedded">
                                <table width="100%" border="1" cellspacing="0" cellpadding="10">
                                    <tbody>
                                        <tr>
                                            <td id="comments" class="text">
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>`
                );

                // 还原标题
                $('span[id="top"]').html(`${__comment[0]['topics']}${locked ? '&nbsp;&nbsp;<b>[<font class="striking">锁定</font>]</b></span>' : ''}`);

                __comment.forEach(x => {
                    const bbcode_html = `<div style="margin-top: 8pt; margin-bottom: 8pt;">
            <table id="pid${x.pid}" border="0" cellspacing="0" cellpadding="0" width="100%">
                <tbody>
                    <tr>
                        <td class="embedded" width="99%">
                            <a href="forums.php?action=viewtopic&amp;topicid=${x.topicid}&amp;page=p${x.pid}#pid${x.pid}">#${x.pid}</a>
                            <!-- 论坛应该不能匿名发帖吧 -->
                            <span class="nowrap"><a href="userdetails.php?id=${x.userid}"><b>
                                        <bdo dir="ltr">${x.username}</bdo></b></a></span>&nbsp;
                            <time>${x.edit_time.replace('T', ' ')}</time>
                        </td>
                        <td class="embedded nowrap" width="1%">
                            <font class="big">#<b>${pidListSet.findIndex((a) => a == x.pid) + 1}</b> 楼&nbsp;&nbsp;</font>
                            <a href="#top"><img class="top" src="pic/trans.gif" alt="Top" title="${lang['back_to_top']}"></a>&nbsp;&nbsp;
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <table class="main-inner" border="1" cellspacing="0" cellpadding="5">
            <tbody>
                <tr>
                    <td class="rowfollow" width="150" valign="top" align="left" style="padding: 0px">
                        <img src="//u2.dmhy.org/pic/default_avatar.png" alt="avatar" width="150px">
                    </td>
                    <td class="rowfollow" valign="top"><br>
                        <div class="post-body" id="pid${x.pid}body">
                            <span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">
                            ${(() => {
                            if (x.action === 'edit') {
                                return `${bbcode2html(x.bbcode)}</bdo></span>
                                                ${(() => {
                                        if ($('#locale_selection').val() === 'en_US') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> at <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                        else if ($('#locale_selection').val() === 'ru_RU') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> в <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                        else return `<p class="small">[<time>${x.edit_time.replace('T', ' ')}</time>] <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> ${lang['last_edited']} </p><br><br>`;
                                    })()}`;
                            } else {
                                return `${bbcode2html(x.bbcode)}<br><br></bdo></span>`;
                            };
                        })()}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>`

                    if (counts[x.pid] > 1) {
                        // console.log('有编辑记录 直接添加下拉菜单');
                        // 插入下拉菜单基本框架
                        if ($(`#history_comment${x.pid}_select`).length === 0) {
                            $('#comments').append(bbcode_html); // 先插入整体框架
                            console.log('添加下拉菜单基本框架');
                            $(`[id="pid${x.pid}"]`).find('td:last').before(`<td class="embedded nowrap" width="1%"><a href="javascript:void(0)" class="diff_comment_button_close" style="display:none;">关闭对比</a><a href="javascript:void(0)" class="diff_comment_button_open">差异对比</a>&nbsp;&nbsp;<select name="type" id="history_comment${x.pid}_select" style="margin-top: 1px;"></select>&nbsp;&nbsp;</td>`);

                        };
                        // 向下拉菜单写入信息
                        $(`#history_comment${x.pid}_select`).append(`<option value="${x.self}">${x.edit_time.replace('T', ' ')}
                ${(() => { return x.action === 'edit' ? ' E' : x.action === 'reply' ? ' R' : ' N' })()}
                ${(() => { return x.username === null && x.userid === null ? lang['anonymous_user'] : ` ${x.username}(${x.userid})` })()}
                </option>`)
                    } else {
                        $('#comments').append(bbcode_html);
                    };
                });

                diffHistoryCommentBbcode(__comment, 'forum');

                $("[id^=history_comment]").change(function () { // 监听菜单选择
                    let self = $(this).val();
                    for (let i = 0, len = __comment.length; i < len; i++) {
                        if (self != __comment[i].self) continue;
                        let html;
                        let x = __comment[i];
                        if (x.action === 'edit') {
                            html = `<span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">${bbcode2html(x.bbcode)}</bdo></span>
                                    ${(() => {
                                    if ($('#locale_selection').val() === 'en_US') return `<p><font class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> at <time>${x.edit_time.replace('T', ' ')}</time>.</font></p>`;
                                    else if ($('#locale_selection').val() === 'ru_RU') return `<p><font class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> в <time>${x.edit_time.replace('T', ' ')}</time>.</font></p>`;
                                    else return `<br><p><font class="small">[<time>${x.edit_time.replace('T', ' ')}</time>] <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> ${lang['last_edited']} </font></p>`;
                                })()}`;
                        } else {
                            html = `<span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">${bbcode2html(x.bbcode)}</bdo></span>`;
                        };
                        $(this).parents('[id^=pid]').parent().next().find('.post-body').html(html);
                        return;
                    };
                });

            } else {
                console.log('获取论坛评论错误');
                $('#outer').find('td.text').html(`${errorstr}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>${lang['history_text_error']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id="apifailure" href="javascript:void(0);" style="color:#FF1212">${lang['reset_token']}</a></i>`);
                $("#apifailure").click(function () {
                    let confirm = prompt("输入 YES 确认本次操作 (大写)");
                    if (confirm === 'YES') {
                        db.removeItem('key');
                        db.removeItem('token');
                        alert("成功");
                    };
                });
            };
        },
        error: function (d) {

        },
    });
};

async function forumCommentHistory() {
    db = localforage.createInstance({ name: "history" });

    $.ajax({
        type: 'post',
        url: 'https://u2.kysdm.com/api/v1/comment',
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({ "uid": user_id, "token": token, "topicid": topicid, "type": "forum" }),
        success: async function (d) {
            if (d.msg === 'success') {
                console.log('获取论坛评论成功');
                let __comment = d.data.comment[topicid].sort((a, b) => b.self - a.self);
                let pid_list = __comment.map(x => x.pid);
                let counts = new Object();
                pid_list.forEach(x => counts[x] = counts[x] ? counts[x] + 1 : 1);

                let pid_list_unique = Array.from(new Set(pid_list)).sort((a, b) => a - b); // 去重排序
                console.log(pid_list_unique);
                let p = $('#outer').find('p[align="center"]:first').text().replace(/\n/g, '<br>');
                let pg = /(?<p>\d+)<br>$/i.exec(p);
                let page_total = Number(pg.groups.p);  // 有多少页评论
                let page_now = Number($('#outer').find('p:first').find('.gray b:last').text());
                console.log(`现在在评论第 ${page_now} 页 | ${page_total}`);
                var pid_each = await db.getItem('forum_pid_each') || 0;; // 每页最大显示楼层数量 <当数据库没有值时，pid_list_valid会是空值，>

                if (page_now < page_total) {
                    // 评论完整填满一个页面时，计算单个页面最大显示评论数量
                    // 后期改动最大显示评论数量的数值后，直接进入帖子最后一页可能会出现不属于当前页面的评论
                    console.log(`页面评论数量达到最大值`);
                    pid_each = $('table[id^=pid]').length;
                    await db.setItem('forum_pid_each', pid_each);
                };

                var pid_list_valid = pid_list_unique.slice(pid_each * page_now - pid_each, pid_each * page_now);  // 截取属于当前页面的PID
                console.log(pid_list_valid);

                __comment.forEach(x => {
                    let del_tag = 1;
                    $('[id^="pid"]').each(function () {
                        let pid = $(this).find('[class="embedded"]').children('a').first().text().replace('#', '');  // 获取网页上每个评论的PID
                        if (x.pid == pid) {
                            del_tag = 0;  // 标记网页上有对应的PID
                            if (counts[pid] > 1) {
                                if ($(`#history_comment${pid}_select`).length === 0) $(this).find('td:last').before(`<td class="embedded nowrap" width="1%"><a href="javascript:void(0)" class="diff_comment_button_close" style="display:none;">关闭对比</a><a href="javascript:void(0)" class="diff_comment_button_open">差异对比</a>&nbsp;&nbsp;<select name="type" id="history_comment${x.pid}_select" style="margin-top: 1px;"></select>&nbsp;&nbsp;</td>`);
                                $(`#history_comment${pid}_select`).append(`<option value="${x.self}">${x.edit_time.replace('T', ' ')}
                                ${(() => { return x.action === 'edit' ? ' E' : x.action === 'reply' ? ' R' : ' N' })()}
                                ${(() => { return x.username === null && x.userid === null ? lang['anonymous_user'] : ` ${x.username}(${x.userid})` })()}
                                </option>`);
                            };
                        };
                    });

                    if (del_tag === 1) {
                        // console.log(`${x.pid} | 被删除`);
                        if (!pid_list_valid.includes(x.pid)) return;  // 不属于当前页面的PID直接跳出
                        // 只看该作者 启用时，仅还原改用户的记录
                        let em = /authorid=(?<authorid>\d{1,5})/i.exec(location.search);
                        if (em && x.userid != em.groups.authorid) return true;

                        if ($('[id="pid10000000000"]').length === 0) {
                            $('[id="outer"]').find('td.text:first').append(
                                `<div style="margin-top: 8pt; margin-bottom: 8pt; display:none;">
                                    <table id="pid10000000000" border="0" cellspacing="0" cellpadding="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td class="embedded" width="99%">
                                                    <a href="javascript:void(0);">#10000000000</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>`
                            );
                        };

                        $('[id^="pid"]').each(function () {
                            let pid = $(this).find('[class="embedded"]').children('a').first().text().replace('#', '');  // 获取网页上每个评论的PID

                            if (x.pid < Number(pid)) {

                                const bbcode_html = `<div style="margin-top: 8pt; margin-bottom: 8pt;">
                                <table id="pid${x.pid}" border="0" cellspacing="0" cellpadding="0" width="100%">
                                    <tbody>
                                        <tr>
                                            <td class="embedded" width="99%">
                                                <a href="forums.php?action=viewtopic&amp;topicid=${x.topicid}&amp;page=p${x.pid}#pid${x.pid}">#${x.pid}</a>
                                                <!-- 论坛应该不能匿名发帖吧 -->
                                                <span class="nowrap">
                                                    <a href="userdetails.php?id=${x.userid}"><b>
                                                    <bdo dir="ltr">${x.username}</bdo></b></a></span>&nbsp;
                                                <time>${x.edit_time.replace('T', ' ')}</time>
                                            </td>
                                            <td class="embedded nowrap" width="1%">
                                                <a href="#top"><img class="top" src="pic/trans.gif" alt="Top" title="${lang['back_to_top']}"></a>&nbsp;&nbsp;
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <table class="main-inner" border="1" cellspacing="0" cellpadding="5">
                                <tbody>
                                    <tr>
                                        <td class="rowfollow" width="150" valign="top" align="left" style="padding: 0px">
                                            <img src="//u2.dmhy.org/pic/default_avatar.png" alt="avatar" width="150px">
                                        </td>
                                        <td class="rowfollow" valign="top"><br>
                                            <div class="post-body" id="pid${x.pid}body">
                                                <span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">
                                                ${(() => {
                                        if (x.action === 'edit') {
                                            return `${bbcode2html(x.bbcode)}</bdo></span>
                                                                    ${(() => {
                                                    if ($('#locale_selection').val() === 'en_US') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> at <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                                    else if ($('#locale_selection').val() === 'ru_RU') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> в <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                                    else return `<p class="small">[<time>${x.edit_time.replace('T', ' ')}</time>] <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> ${lang['last_edited']} </p><br><br>`;
                                                })()}`;
                                        } else {
                                            return `${bbcode2html(x.bbcode)}<br><br></bdo></span>`;
                                        };
                                    })()}
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>`

                                $(`[id="pid${pid}"]`).parent().before(bbcode_html);

                                if (counts[x.pid] > 1) {
                                    if ($(`#history_comment${x.pid}_select`).length === 0) $(`[id="pid${x.pid}"]`).find('td:last').before(`<td class="embedded nowrap" width="1%"><select name="type" id="history_comment${x.pid}_select"></td>`);
                                    $(`#history_comment${x.pid}_select`).append(`<option value="${x.self}">${x.edit_time.replace('T', ' ')}
                                ${(() => { return x.action === 'edit' ? ' E' : x.action === 'reply' ? ' R' : ' N' })()}
                                ${(() => { return x.username === null && x.userid === null ? lang['anonymous_user'] : ` ${x.username}(${x.userid})` })()}
                                </option>`);
                                };

                                return false;
                            };
                        });

                    };
                });

                diffHistoryCommentBbcode(__comment, 'forum');

                $("[id^=history_comment]").change(function () { // 监听菜单选择
                    let self = $(this).val();
                    for (let i = 0, len = __comment.length; i < len; i++) {
                        if (self != __comment[i].self) continue;
                        let html;
                        let x = __comment[i];
                        if (x.action === 'edit') {
                            html = `<span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">${bbcode2html(x.bbcode)}</bdo></span>
                                    ${(() => {
                                    if ($('#locale_selection').val() === 'en_US') return `<p><font class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> at <time>${x.edit_time.replace('T', ' ')}</time>.</font></p>`;
                                    else if ($('#locale_selection').val() === 'ru_RU') return `<p><font class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> в <time>${x.edit_time.replace('T', ' ')}</time>.</font></p>`;
                                    else return `<br><p><font class="small">[<time>${x.edit_time.replace('T', ' ')}</time>] <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> ${lang['last_edited']} </font></p>`;
                                })()}`;
                        } else {
                            html = `<span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">${bbcode2html(x.bbcode)}</bdo></span>`;
                        };
                        $(this).parents('[id^=pid]').parent().next().find('.post-body').html(html);
                        return;
                    };
                });
            } else {
                console.log('获取论坛评论错误');
            };
        },
        error: function (d) {

        },
    });
};


function torrentCommentHistory() {
    $.ajax({
        type: 'post',
        url: 'https://u2.kysdm.com/api/v1/comment',
        contentType: "application/json",
        dataType: 'json',
        data: JSON.stringify({ "uid": user_id, "token": token, "torrent_id": torrent_id, "type": "torrent" }),
        success: function (d) {
            if (d.msg === 'success') {
                console.log('获取种子评论成功');
                let __comment = d.data.comment[torrent_id].sort((a, b) => b.self - a.self);
                let cid_list = __comment.map(x => x.cid);
                let counts = new Object();
                cid_list.forEach(x => counts[x] = counts[x] ? counts[x] + 1 : 1);

                // let startcomments = $('#startcomments').text();
                if ($('[id^="cid"]').length === 0) {
                    // 候选没有评论 || 通过的种子没有评论
                    console.log('完全没有评论');
                    var cid_list_valid = Array.from(new Set(cid_list));
                } else {
                    // 有评论
                    let x = $('#startcomments').nextAll('p:first').text();
                    let pg = /(?<p>\d+)$/i.exec(x);
                    let page_total = Math.ceil(pg.groups.p / 10); // 有多少页评论
                    let cid_list_unique = Array.from(new Set(cid_list)).sort((a, b) => a - b);  // 去重排序
                    console.log(cid_list_unique);
                    let page_now = $('#startcomments').nextAll('p:first').find('.gray:last').text();
                    pg = /(?<p>\d+)$/i.exec(page_now);
                    for (let i = 1; i <= page_total; i++) {
                        if (Number(pg.groups.p) <= 10 * i) {
                            console.log(`现在在评论第 ${i} 页`);
                            var cid_list_valid = cid_list_unique.slice(10 * i - 10, 10 * i);  // 截取属于当前页面的评论
                            console.log(cid_list_valid);
                            break;
                        };
                    };
                };

                __comment.forEach(x => {
                    let del_tag = 1;
                    $('[id^="cid"]').each(function () {
                        let cid = $(this).find('[class="embedded"]').children('a').attr('name');
                        if (x.cid == cid) {
                            del_tag = 0; // 标记网页上有对应的CID
                            if (x.cid == cid && counts[cid] > 1) {
                                if ($(`#history_comment${cid}_select`).length === 0) $(this).find('td:last').before(`<td class="embedded nowrap" width="1%"><a href="javascript:void(0)" class="diff_comment_button_close" style="display:none;">关闭对比</a><a href="javascript:void(0)" class="diff_comment_button_open">差异对比</a>&nbsp;&nbsp;<select name="type" id="history_comment${cid}_select" ></select>&nbsp;&nbsp;</td>`);
                                $(`#history_comment${cid}_select`).append(`<option value="${x.self}">${x.edit_time.replace('T', ' ')}
                        ${(() => { return x.action === 'edit' ? ' E' : x.action === 'reply' ? ' R' : ' N' })()}
                        ${(() => { return x.username === null && x.userid === null ? lang['anonymous_user'] : ` ${x.username}(${x.userid})` })()}
                        </option>`);
                            };
                        };
                    });

                    if (del_tag === 1) {
                        // console.log(`${x.cid} | 被删除`);
                        if (!cid_list_valid.includes(x.cid)) return;  // 不属于当前页面的评论直接跳出
                        if ($('[id^="cid"]').length === 0) {
                            // 所有评论都被删除
                            console.log('所有评论都被删除');
                            $('#outer').find('table:last').hide();
                            $('#outer').find('table:last').prevAll('br').remove();
                            $('#startcomments').remove();
                            $('#outer').find('table:last').before('<br><h1 id="startcomments" align="center">用户评论</h1>');
                            $('#outer').find('table:last').after(`<br>
                            <table class="main" width="940" border="0" cellspacing="0" cellpadding="0">
                                <tbody>
                                    <tr>
                                        <td class="embedded">
                                            <table width="100%" border="1" cellspacing="0" cellpadding="10">
                                                <tbody>
                                                    <tr>
                                                        <td class="text">
                                                            <div style="margin-top: 8pt; margin-bottom: 8pt; display:none;">
                                                                <table id="cid1000000000" border="0" cellspacing="0" cellpadding="0" width="100%">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td class="embedded" width="99%">
                                                                                <a href="javascript:void(0);" name="1000000000">#1000000000</a>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>`
                            );
                        } else if ($('[id="cid1000000000"]').length === 0) {
                            $('#startcomments').nextAll('table.main:first').find('.text').append(
                                `<div style="margin-top: 8pt; margin-bottom: 8pt; display:none;">
                                    <table id="cid1000000000" border="0" cellspacing="0" cellpadding="0" width="100%">
                                        <tbody>
                                            <tr>
                                                <td class="embedded" width="99%">
                                                    <a href="javascript:void(0);" name="1000000000">#1000000000</a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>`);
                        };

                        $('[id^="cid"]').each(function () {
                            let cid = $(this).find('[class="embedded"]').children('a').attr('name'); // 获取网页上每个评论的CID

                            if (x.cid < Number(cid)) {
                                if (x.userid === null && x.username === null) {
                                    var userInfo = `<span style="color: gray">&nbsp;<i>${lang['anonymous']}</i>&nbsp;</span>`
                                } else {
                                    var userInfo = `<span style="color: gray">&nbsp;<span class="nowrap"><a href="userdetails.php?id=${x.userid}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span>`
                                }

                                const bbcode_html = `<div style="margin-top: 8pt; margin-bottom: 8pt;">
                                <table id="cid${x.cid}" border="0" cellspacing="0" cellpadding="0" width="100%">
                                    <tbody>
                                    <tr>
                                        <td class="embedded" width="99%">
                                            <a href="${cidUrl(x.torrent_id, x.cid)}" name="${x.cid}">#${x.cid}</a>
                                            ${userInfo}
                                            <span style="color: gray">&nbsp;<time>${x.edit_time.replace('T', ' ')}</time></span></span>
                                        </td>
                                        <td class="embedded nowrap" width="1%">
                                            <a href="#top"><img class="top" src="pic/trans.gif" alt="Top" title="Top"></a>&nbsp;&nbsp;
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <table class="main-inner" width="100%" border="0" cellspacing="0" cellpadding="5">
                                <tbody>
                                    <tr>
                                        <td class="rowfollow" width="150" valign="top" style="padding: 0">
                                            <img src="//u2.dmhy.org/pic/default_avatar.png" alt="avatar" width="150px"></td>
                                        <td class="rowfollow" valign="top"><br>
                                        ${(() => {
                                        if (x.action === 'edit') {
                                            return `<span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">${bbcode2html(x.bbcode)}</bdo></span>
                                                        ${(() => {
                                                    if ($('#locale_selection').val() === 'en_US') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> at <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                                    else if ($('#locale_selection').val() === 'ru_RU') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> в <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                                    else return `<p class="small">[<time>${x.edit_time.replace('T', ' ')}</time>] <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> ${lang['last_edited']} </p><br><br>`;
                                                })()}`;
                                        } else {
                                            return `<span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">${bbcode2html(x.bbcode)}<br><br></bdo></span>`;
                                        };
                                    })()}
                                        </td>
                                        </tr>
                                        </tbody>
                                        </table>`;

                                $(`[id="cid${cid}"]`).parent().before(bbcode_html); // 先插入整体框架

                                if (counts[x.cid] > 1) {
                                    // console.log('有编辑记录 直接添加下拉菜单');
                                    // 插入下拉菜单基本框架
                                    if ($(`#history_comment${x.cid}_select`).length === 0) {
                                        console.log('添加下拉菜单基本框架');
                                        $(`[id="cid${x.cid}"]`).find('td:last').before(`<td class="embedded nowrap" width="1%"><select name="type" id="history_comment${x.cid}_select" ></select>&nbsp;&nbsp;</td>`);
                                    };
                                    // 向下拉菜单写入信息
                                    $(`#history_comment${x.cid}_select`).append(`<option value="${x.self}">${x.edit_time.replace('T', ' ')}
                                                ${(() => { return x.action === 'edit' ? ' E' : x.action === 'reply' ? ' R' : ' N' })()}
                                                ${(() => { return x.username === null && x.userid === null ? lang['anonymous_user'] : ` ${x.username}(${x.userid})` })()}
                                                </option>`);
                                };

                                return false;
                            };

                        });
                    };

                });

                diffHistoryCommentBbcode(__comment, 'torrent');

                $("[id^=history_comment]").change(function () { // 监听菜单选择
                    let self = $(this).val();

                    for (let i = 0, len = __comment.length; i < len; i++) {
                        if (self != __comment[i].self) continue;
                        let html;
                        let x = __comment[i];
                        if (x.action === 'edit') {
                            html = `<br>
                            <span style="word-break: break-all; word-wrap: break-word;">
                                <bdo dir="ltr">${bbcode2html(x.bbcode)}</bdo>
                            </span>
                                    ${(() => {
                                    if ($('#locale_selection').val() === 'en_US') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> at <time>${x.edit_time.replace('T', ' ')}</time>.</p>`;
                                    else if ($('#locale_selection').val() === 'ru_RU') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> в <time>${x.edit_time.replace('T', ' ')}</time>.</p>`;
                                    else return `<br><p class="small">[<time>${x.edit_time.replace('T', ' ')}</time>] <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> ${lang['last_edited']} </p>`;
                                })()}`;

                        } else {
                            html = `<br>
                            <span style="word-break: break-all; word-wrap: break-word;">
                                <bdo dir="ltr">${bbcode2html(x.bbcode)}</bdo>
                            </span>`;
                        };
                        $(this).parents('[id^=cid]').parent().next().find('[class="rowfollow"]:last').html(html);
                        return;
                    };
                });

            } else {
                console.log('获取种子评论错误');
            };
        },
        error: function (d) {

        },
    });
};


async function torrentInfoHistory() {
    if ($('h3').length === 1) { // 插入 select 基本框架
        const right = ($('#outer').width() - $('h3').next().width()) / 2 + 5; // 计算偏移量
        $('#top').after('<div id="hsty" style="position: relative;"><div id="history" style="position: absolute; right:' + right + 'px; margin-top: 4px;"><select name="type" id="history_select"></div></div>');
        $(window).resize(function () { $('#history').css("right", ($('#outer').width() - $('h3').next().width()) / 2 + 5); });
    } else {
        const right = ($('#outer').width() - $('#top').next().width()) / 2 + 5; // 计算偏移量
        $('#top').after('<div id="history" style="position: relative; float: right; margin-bottom: 10px; margin-right: ' + right + 'px"><select name="type" id="history_select"></div>');
        $(window).resize(function () { $('#history').css("margin-right", ($('#outer').width() - $('#history').next().width()) / 2 + 5 + 'px'); });
    };

    $("#history_select").append("<option>" + lang['history_select_loading'] + "</option>");

    const __json = await getapi(); // 从 API 获取数据

    if (__json.msg !== 'success') { // 加载失败时
        console.log('获取历史记录失败.');
        $("#history_select").empty(); // 插入前先清空 option
        $("#history_select").append('<option value="80000">' + lang['history_select_error'] + '</option>'); // 希望你不要看到这个 (ノДＴ)
        $("#history_select").append(`<option value="90000">${lang['reset_token']}</option>`); // 删除本地授权信息
        $("#history_select").change(function () { // 监听菜单选择
            let self = Number($(this).val());
            if (self === 90000) {
                let confirm = prompt("输入 YES 确认本次操作 (大写)");
                if (confirm === 'YES') {
                    db.removeItem('key');
                    db.removeItem('token');
                    $('#history_select').val(80000); // 将焦点设置到 80000
                    $('#history_select').change(); // 手动触发列表更改事件
                    alert("成功");
                } else {
                    $('#history_select').val(80000); // 将焦点设置到 80000
                    $('#history_select').change(); // 手动触发列表更改事件
                };
            };
        });
        return;
    };

    let history_data = __json.data.history;

    for (let i = 0, len = history_data.length; i < len; i++) { // 循环插入到选择列表中

        if (i === 0) {
            $("td[class='rowhead nowrap']:contains(" + lang['description'] + ")").closest('tr').after(`<tr>
                <td class="rowhead nowrap" valign="top" align="right">
                    <a href="javascript:void(0)"><span class="nowrap">
                    <img class="plus" src="pic/trans.gif" alt="Show/Hide" id="codedescr" title="显示&nbsp;/&nbsp;隐藏"> 代码</span></a></td>
                <td class="rowfollow" valign="top" align="left"><a href="javascript:void(0)" id="codedescrcopy"><b>点击复制到剪贴板</b></a>
                <span id="codedescrcopy_text_success" style="color:#4169E1; display: none;">&nbsp;&nbsp;成功</span>
                <span id="codedescrcopy_text_failure" style="color:#FF0000; display: none;">&nbsp;&nbsp;失败 - 可能是你的浏览器太古老了</span>
                    <div id="cdescr" style="display: none;">
                    <br>
                    <textarea class="bbcode" cols="100" style="width: 99%" id="ctdescr" rows="20"></textarea>
                    </div>
                </td></tr>`
            )
                .after(`<tr id="diff_unit" >
                            <td rowspan="2" class="no-top-bottom-border" style="font-weight: bold; text-align: right; vertical-align: top;">
                                <a href="javascript:void(0)"><span class="nowrap">
                                <img class="plus" src="pic/trans.gif" alt="Show/Hide" id="diffdescr" title="显示&nbsp;/&nbsp;隐藏"> 差异</span></a></td>
                            </td>
                            <td valign="top" align="left" class="no-top-bottom-border">
                                <div class="diff-container" style="display: none;">
                                    <div class="diff-cell">&nbsp;<select name="type" id="history_select2"></select></div>
                                    <div class="diff-cell"><select name="type" id="history_select3"></select></div>
                                </div>
                            </td>
                        </tr>
                        <tr id="diff_draw_unit">
                            <td valign="top" align="left" class="no-top-bottom-border">
                                <div id="diff_draw" class="draw-div" style="display: none;"></div>
                            </td>
                        </tr>`);

            $(`td[class='rowhead nowrap']:contains('${lang['torrent_info']}')`).next('td').find('.no_border_wide:last')
                .before(`<td id="torrent_ver" class="no_border_wide"></td>`)
                .before(`<td id="torrent_piece_length" class="no_border_wide"></td>`);
            $('#torrent_ver').html(`<b>${lang['torrent_ver']}:</b>&nbsp;${history_data[i].torrent_ver}`);
            const numberOfPieces = Math.ceil(history_data[i].torrent_size / history_data[i].torrent_piece_length);
            $('#torrent_piece_length').html(`<b>${lang['torrent_piece_length']}:</b>&nbsp;${numberOfPieces} (${convertBytesToAutoUnit(history_data[i].torrent_piece_length)})`);
            $('#ctdescr').val(history_data[i].description_info);
            $('#codedescr').closest('a').click(function () {
                $('#cdescr').toggle();
                $('#codedescr').attr('class', $('#codedescr').attr('class') === 'plus' ? 'minus' : 'plus');
            });
            $('#diffdescr').closest('a').click(async function () {
                $('#diff_draw, .diff-container').toggle();
                if ($('#diffdescr').attr('class') === 'plus') {
                    $('#diffdescr').attr('class', 'minus');
                    await db.setItem('diff_switch', true);
                } else {
                    $('#diffdescr').attr('class', 'plus');
                    await db.setItem('diff_switch', false);
                }
            });

            // 记录上次差异按钮打开状态
            if (await db.getItem('diff_switch')) $('#diffdescr').closest('a').trigger('click');

            $('#codedescrcopy').click(function () {
                const _val = $('#ctdescr').val();
                navigator.clipboard.writeText(_val).then(() => {
                    $('#codedescrcopy_text_success').fadeIn(500);
                    $('#codedescrcopy_text_success').fadeOut(1000);
                }).catch(() => {
                    $('#codedescrcopy_text_failure').fadeIn(500);
                    $('#codedescrcopy_text_failure').fadeOut(1000);
                });
            });
        };

        $("#history_select, #history_select2, #history_select3").append("<option value='" + history_data[i].self + "'>"
            + history_data[i].get_time.replace('T', ' ')
            + ((edited_type) => {
                switch (edited_type) {
                    case 0: return ' H';  // 添加候选
                    case 1: return ' E';  // 普通用户编辑
                    case 2: return ' M';  // MOD编辑
                    case 3: return ' T';  // 允许候选
                    case 4: return ' U';  // 上传种子
                    case 5: return ' R';  // 还原被删除的种子
                    default: return ' ';  // 早期记录
                };
            })(history_data[i].edited_type)
            + (() => {
                if (history_data[i].self === 0) return lang['current_time']
                else if (history_data[i].edited_name === null && history_data[i].edited_id === null) return ''
                else if (history_data[i].edited_id === null && history_data[i].edited_name === '匿名') return lang['anonymous_user']
                else if (history_data[i].edited_id === null && history_data[i].edited_name === '系统') return lang['system']
                else if (history_data[i].edited_name !== null && history_data[i].edited_id !== null) return ' ' + history_data[i].edited_name + '(' + history_data[i].edited_id + ')'
                else return ' @BUG@'
            })()
            + "</option>");
    };

    // 草 为什么会这样呢 明明原来很整齐的
    $("#history_select").change(function () { // 监听菜单选择
        let self = Number($(this).val());
        for (let i = 0, len = history_data.length; i < len; i++) {
            if (self !== history_data[i].self) continue;
            history_data[i].banned === 1 ? $('#top').html(history_data[i].title + '&nbsp;&nbsp;&nbsp; <b>[<font class="striking">' + lang['banned'] + '</font>]</b>') : $('#top').text(history_data[i].title);
            // 检查副标题一栏是否存在
            if ($("td[class='rowhead nowrap']:contains(" + lang['subtitle'] + ")").length === 0 && history_data[i].subtitle !== null) {
                $("td[class='rowhead nowrap']:contains(" + lang['uploaded'] + ")").parent().before('<tr><td class="rowhead nowrap" valign="top" align="right">' + lang['subtitle'] + '</td><td class="rowfollow" valign="top" align="left"></td></tr>');
            }
            else if ($("td[class='rowhead nowrap']:contains(" + lang['subtitle'] + ")").length === 1 && history_data[i].subtitle === null) {
                $("td[class='rowhead nowrap']:contains(" + lang['subtitle'] + ")").parent().remove();
            };

            $("td[class='rowhead nowrap']:contains(" + lang['subtitle'] + ")").next().text(history_data[i].subtitle); // 副标题
            $("td[class='rowhead nowrap']:contains(" + lang['description'] + ")").last().next().html('<div id="kdescr"><span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">' + bbcode2html(history_data[i].description_info) + '</bdo></span></div>'); // 描述
            $('#ctdescr').val(history_data[i].description_info);  // 描述代码
            $('#torrent_ver').html(`<b>${lang['torrent_ver']}:</b>&nbsp;${history_data[i].torrent_ver}`);  // 版本
            const numberOfPieces = Math.ceil(history_data[i].torrent_size / history_data[i].torrent_piece_length);
            $('#torrent_piece_length').html(`<b>${lang['torrent_piece_length']}:</b>&nbsp;${numberOfPieces} (${convertBytesToAutoUnit(history_data[i].torrent_piece_length)})`);  // 区块

            if ($('h3').length === 1) { // 已经通过候选的种子
                $("td[class='rowhead nowrap']:contains(" + lang['uploaded'] + ")").next().html(((p) => {
                    if (p.uploader_id === null && p.uploader_name === '匿名') return '<i>' + lang['anonymous'] + '</i>'; // 匿名发布
                    if (p.uploader_id === null && p.uploader_name !== '匿名') return p.uploader_name; // 自定义署名 不带UID
                    if (p.uploader_id !== null && p.uploader_name !== '匿名') return '<a href="userdetails.php?id=' + p.uploader_id + '"><b>' + p.uploader_name + '</b></a>'; // 正常显示 || 自定义署名 带UID
                })(history_data[i])); // 发布人
                $("td[class='rowhead nowrap']:contains(" + lang['basic_info'] + ")").next().html('<b>' + lang['uploaded_at'] + ':</b> ' + history_data[i].uploaded_at.replace('T', ' ')
                    + (() => { if (history_data[i].torrent_size) { return '&nbsp;&nbsp;&nbsp;<b>' + lang['size'] + ':</b>&nbsp;' + convert(history_data[i].torrent_size) } else { return ''; } })()
                    + '&nbsp;&nbsp;&nbsp;<b>' + lang['category'] + ':</b> ' + history_data[i].category)
            } else { // 还在候选的种子
                $("td[class='rowhead nowrap']:contains(" + lang['basic_info'] + ")").next().html('<b>' + lang['submitted_by'] + '</b>:&nbsp;'
                    + ((p) => {
                        if (p.uploader_id === null && p.uploader_name === '匿名') return '<i>' + lang['anonymous'] + '</i>'; // 匿名发布
                        if (p.uploader_id !== null && p.uploader_name !== '匿名') return '<a href="userdetails.php?id=' + p.uploader_id + '"><b>' + p.uploader_name + '</b></a>'; // 正常显示
                    })(history_data[i])
                    + '&nbsp;&nbsp;&nbsp;<b>' + lang['submitted_at'] + '</b>:&nbsp;<time>'
                    + history_data[i].uploaded_at.replace('T', ' ')
                    + '</time>&nbsp;&nbsp;&nbsp;<b>'
                    + (() => { if (history_data[i].torrent_size) { return `${lang['size']}</b>:&nbsp;${convert(history_data[i].torrent_size)}&nbsp;&nbsp;&nbsp;<b>` } else { return ''; } })()
                    + lang['category'] + '</b>:&nbsp;'
                    + history_data[i].category
                );
            };
        };
    });

    $("#history_select2, #history_select3").change(function () {
        const leftValue = Number($("#history_select2").val());
        const rightValue = Number($("#history_select3").val());
        drawDiffHistoryBbcode(history_data, leftValue, rightValue, 'torrent', $('#diff_draw'))
    });

    const $historySelect2 = $("#history_select2");
    const $historySelect3 = $("#history_select3");
    // const firstOptionText = $historySelect2.find("option:eq(0)").text();
    const historySelect2OptionsLength = $historySelect2.find("option").length;

    if (historySelect2OptionsLength === 1) {
        // 就一个记录，无法进行差异处理
        $('#diff_draw_unit, #diff_unit').hide();
    } else {
        let rightValue = 0;
        let leftValue = 1;
        let flagBreak = false;

        while (leftValue < historySelect2OptionsLength) {
            if (preCheckBbcodeDiscrepancy(history_data, leftValue, rightValue) === true) {
                $historySelect3.find("option").eq(rightValue).prop("selected", true);
                $historySelect2.find("option").eq(leftValue).prop("selected", true);
                $historySelect2.trigger("change");
                flagBreak = true;
                break;
            }
            rightValue++;
            leftValue++;
        }

        if (!flagBreak) $('#diff_draw_unit, #diff_unit').hide();

    }

    $("#history_select option:first").remove(); // 删除加载等待一栏

};

function torrentCommentHistoryReset() {

    const callback = (mutations, observer) => {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length === 0) return;

            console.log('检测到种子页面已经完成加载');
            observer.disconnect(); // 停止监听

            $('#description').after(`<br><br><h1 align="center" id="startcomments" style="font-weight:normal; font-style: italic">正在加载用户评论...</h1><br>`);
            $.ajax({
                type: 'post',
                url: 'https://u2.kysdm.com/api/v1/comment',
                contentType: "application/json",
                dataType: 'json',
                data: JSON.stringify({ "uid": user_id, "token": token, "torrent_id": torrent_id, "type": "torrent" }),
                success: function (d) {
                    if (d.msg !== 'success') { console.log('获取种子评论错误'); }
                    else {
                        console.log('获取种子评论成功');
                        let __comment = d.data.comment[torrent_id].sort(firstBy((a, b) => a.cid - b.cid).thenBy((a, b) => b.self - a.self)); // 如果用self排序，消息顺序不正确，则改用编辑日期排序
                        if (__comment.length === 0) { // 没有评论
                            $('#startcomments').text('没有评论');
                            $('#startcomments').removeAttr("style");
                            return;
                        } else {
                            $('#startcomments').text('用户评论');
                            $('#startcomments').removeAttr("style");
                        };

                        let cidList = __comment.map(x => x.cid);
                        let counts = new Object();
                        cidList.forEach(x => counts[x] = counts[x] ? counts[x] + 1 : 1);

                        $('#startcomments').after(`<br>
                        <table class="main" width="940" border="0" cellspacing="0" cellpadding="0">
                            <tbody>
                                <tr>
                                    <td class="embedded">
                                        <table width="100%" border="1" cellspacing="0" cellpadding="10">
                                            <tbody>
                                                <tr>
                                                    <td id="comments" class="text"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>`
                        );

                        __comment.forEach(x => {
                            if (x.userid === null && x.username === null) {
                                var userInfo = `<span style="color: gray">&nbsp;<i>${lang['anonymous']}</i>&nbsp;</span>`
                            } else {
                                var userInfo = `<span style="color: gray">&nbsp;<span class="nowrap"><a href="userdetails.php?id=${x.userid}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span>`
                            }

                            const bbcode_html = `<div style="margin-top: 8pt; margin-bottom: 8pt;">
                            <table id="cid${x.cid}" border="0" cellspacing="0" cellpadding="0" width="100%">
                                <tbody>
                                <tr>
                                    <td class="embedded" width="99%">
                                        <a href="${cidUrl(x.torrent_id, x.cid)}" name="${x.cid}">#${x.cid}</a>
                                        ${userInfo}
                                        <span style="color: gray">&nbsp;<time>${x.edit_time.replace('T', ' ')}</time></span></span>
                                    </td>
                                    <td class="embedded nowrap" width="1%">
                                        <a href="#top"><img class="top" src="pic/trans.gif" alt="Top" title="Top"></a>&nbsp;&nbsp;
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <table class="main-inner" width="100%" border="0" cellspacing="0" cellpadding="5">
                            <tbody>
                                <tr>
                                    <td class="rowfollow" width="150" valign="top" style="padding: 0">
                                        <img src="//u2.dmhy.org/pic/default_avatar.png" alt="avatar" width="150px"></td>
                                    <td class="rowfollow" valign="top"><br>
                                    ${(() => {
                                    if (x.action === 'edit') {
                                        return `<span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">${bbcode2html(x.bbcode)}</bdo></span>
                                                    ${(() => {
                                                if ($('#locale_selection').val() === 'en_US') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> at <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                                else if ($('#locale_selection').val() === 'ru_RU') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> в <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                                else return `<p class="small">[<time>${x.edit_time.replace('T', ' ')}</time>] <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> ${lang['last_edited']} </p><br><br>`;
                                            })()}`;
                                    } else {
                                        return `<span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">${bbcode2html(x.bbcode)}<br><br></bdo></span>`;
                                    };
                                })()}
                                    </td>
                                    </tr>
                                    </tbody>
                                    </table>`;

                            if (counts[x.cid] > 1) {
                                // console.log('有编辑记录 直接添加下拉菜单');
                                // 插入下拉菜单基本框架
                                if ($(`#history_comment${x.cid}_select`).length === 0) {
                                    $('#comments').append(bbcode_html); // 先插入整体框架
                                    console.log('添加下拉菜单基本框架');
                                    $(`[id="cid${x.cid}"]`).find('[class="embedded nowrap"]').before(`<td class="embedded nowrap" width="1%"><a href="javascript:void(0)" class="diff_comment_button_close" style="display:none;">关闭对比</a><a href="javascript:void(0)" class="diff_comment_button_open">差异对比</a>&nbsp;&nbsp;<select name="type" id="history_comment${x.cid}_select" ></select>&nbsp;&nbsp;</td>`);
                                };
                                // 向下拉菜单写入信息
                                $(`#history_comment${x.cid}_select`).append(`<option value="${x.self}">${x.edit_time.replace('T', ' ')}
                                    ${(() => { return x.action === 'edit' ? ' E' : x.action === 'reply' ? ' R' : ' N' })()}
                                    ${(() => { return x.username === null && x.userid === null ? lang['anonymous_user'] : ` ${x.username}(${x.userid})` })()}
                                    </option>`)
                            } else {
                                $('#comments').append(bbcode_html);
                            };
                        });

                        diffHistoryCommentBbcode(__comment, 'torrent');

                        $("[id^=history_comment]").change(function () { // 监听菜单选择
                            let self = $(this).val();
                            for (let i = 0, len = __comment.length; i < len; i++) {
                                if (self != __comment[i].self) continue;
                                let html;
                                let x = __comment[i];
                                if (x.action === 'edit') {
                                    html = `<br>
                                    <span style="word-break: break-all; word-wrap: break-word;">
                                    <bdo dir="ltr">${bbcode2html(x.bbcode)}</bdo>
                                    </span>
                                            ${(() => {
                                            if ($('#locale_selection').val() === 'en_US') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> at <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                            else if ($('#locale_selection').val() === 'ru_RU') return `<p class="small">${lang['last_edited']} <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> в <time>${x.edit_time.replace('T', ' ')}</time>.</p><br><br>`;
                                            else return `<br><p class="small">[<time>${x.edit_time.replace('T', ' ')}</time>] <span class="nowrap"><a href="userdetails.php?id=${x.user_id}"><b><bdo dir="ltr">${x.username}</bdo></b></a></span> ${lang['last_edited']} </p><br><br>`;
                                        })()}`;
                                } else {
                                    html = `<br>
                                    <span style="word-break: break-all; word-wrap: break-word;">
                                    <bdo dir="ltr">${bbcode2html(x.bbcode)}<br><br></bdo>
                                    </span>`;
                                };
                                $(this).parents('[id^=cid]').parent().next().find('[class="rowfollow"]:last').html(html);
                                return;
                            };
                        });
                    };
                },
                error: function (d) {
                },
            });
        })
    };

    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const element = document.getElementById("outer");
    var observer = new MutationObserver(callback);
    observer.observe(element, { childList: true });
};

async function torrentInfoHistoryReset() {
    const errorstr = $('#outer').find('td.text').text();
    // 正在努力加载中...
    $('#outer').find('td.text').html(errorstr + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>' + lang['history_text_loading'] + '</i>');

    const __json = await getapi(); // 从 API 获取数据

    if (__json.msg !== 'success') { // 加载失败时
        console.log('获取历史记录失败.');
        $('#outer').find('td.text').html(`${errorstr}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<i>${lang['history_text_error']}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a id="apifailure" href="javascript:void(0);" style="color:#FF1212">${lang['reset_token']}</a></i>`);
        $("#apifailure").click(function () {
            let confirm = prompt("输入 YES 确认本次操作 (大写)");
            if (confirm === 'YES') {
                db.removeItem('key');
                db.removeItem('token');
                alert("成功");
            };
        });

        return;
    } else if (__json.data.history.length === 0) { // 获取成功 但没有历史记录时
        console.log('没有历史记录.');
        $('#outer').find('td.text').html(errorstr + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + lang['history_text_empty'] + '</i>');
        return;
    };

    console.log('获取历史记录成功.');
    let history_data = __json.data.history;
    // let gdListObj = JSON.parse(localStorage.getItem("u2_gd_list")); // 读取谷歌备份列表
    // 还原网页
    $('#outer').html('<h1 align="center" id="top">'
        + (() => { return history_data[0].banned === 1 ? history_data[0].title + '&nbsp;&nbsp;&nbsp; <b>[<font class="striking">' + lang['banned'] + '</font>]</b>' : history_data[0].title; })()
        + '</h1>'
        + '<div id="hsty" style="position: relative;"><div id="history" style="position: absolute; right:75px; margin-top: 4px;">'
        + '<select name="type" id="history_select" style="visibility: visible;"></select></div></div>'
        + '<h3>(#' + torrent_id + ')</h3>'
        + '<table id="description" width="90%" min-width="940px" cellspacing="0" cellpadding="5"><tbody><tr><td class="rowhead" width="13%">' + lang['torrent_title'] + '</td>'
        + '<td class="rowfollow" width="87%" align="left">'
        + '<b>[U2].' + history_data[0].torrent_name + '.torrent</b></td></tr>'
        + (() => { return history_data[0].subtitle ? '<tr><td class="rowhead nowrap" valign="top" align="right">' + lang['subtitle'] + '</td><td class="rowfollow" valign="top" align="left">' + history_data[0].subtitle + '</td></tr></td></tr>' : '' })()
        + '<tr><td class="rowhead nowrap" valign="top" align="right">' + lang['basic_info'] + '</td>'
        + '<td class="rowfollow" valign="top" align="left"><b>' + lang['submitted_by'] + '</b>:&nbsp;'
        + ((p) => {
            if (p.uploader_id === null && p.uploader_name === '匿名') return '<i>' + lang['anonymous'] + '</i>'; // 匿名发布
            if (p.uploader_id !== null && p.uploader_name !== '匿名') return '<a href="userdetails.php?id=' + p.uploader_id + '"><b>' + p.uploader_name + '</b></a>'; // 正常显示
        })(history_data[0])
        + '&nbsp;&nbsp;&nbsp;<b>' + lang['submitted_at'] + '</b>:&nbsp;<time>' + history_data[0].uploaded_at.replace('T', ' ')
        + '</time>'
        + (() => { if (history_data[0].torrent_size) { return '&nbsp;&nbsp;&nbsp;<b>大小:</b>&nbsp;' + convert(history_data[0].torrent_size) } else { return ''; } })()
        + '&nbsp;&nbsp;&nbsp;<b>' + lang['category'] + '</b>:&nbsp;' + history_data[0].category
        // + (() => {
        //     const r = '&nbsp;&nbsp;&nbsp;<b>' + lang['google_backup'] + '</b>:&nbsp;'
        //     if (gdListObj === null) return ``; // 列表不存在时，直接返回
        //     const gdList = gdListObj.list; // 载入种子列表
        //     let d = gdList.findIndex((value) => value == Number(torrent_id)); // 查找数据库中是否有备份，没有返回-1
        //     if (d === -1) return r + `×`;  // 没有备份时
        //     return `${r}<a href="sendmessage.php?receiver=45940#${torrent_id}" target="_blank" title="${lang['google_send']}">√</a>`
        // })()
        + '</td></tr>'
        + '<tr><td class="rowhead nowrap" valign="top" align="right">'
        + '<a href="javascript: klappe_news(\'descr\')"><span class="nowrap">'
        + '<img class="minus" src="pic/trans.gif" alt="Show/Hide" id="picdescr" title="' + lang['show_or_hide'] + '"> ' + lang['description'] + '</span></a></td>'
        + '<td class="rowfollow" valign="top" align="left">'
        + '<div id="kdescr"><span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">'
        + bbcode2html(history_data[0].description_info) + '</bdo></span></div></td></tr><tr>'
        + '<td class="rowhead nowrap" valign="top" align="right">' + lang['torrent_info'] + '</td>'
        + `<td id="file_tree" class="rowfollow" valign="top" align="left"></td></tr></tbody></table></td></tr></tbody></table><br><br></br>`
    );

    $("td[class='rowhead nowrap']:contains(" + lang['description'] + ")").closest('tr').after(`<tr>
            <td class="rowhead nowrap" valign="top" align="right">
                <a href="javascript:void(0)"><span class="nowrap">
                <img class="plus" src="pic/trans.gif" alt="Show/Hide" id="codedescr" title="显示&nbsp;/&nbsp;隐藏"> 代码</span></a></td>
            <td class="rowfollow" valign="top" align="left"><a href="javascript:void(0)" id="codedescrcopy"><b>点击复制到剪贴板</b></a>
            <span id="codedescrcopy_text_success" style="color:#4169E1; display: none;">&nbsp;&nbsp;成功</span>
            <span id="codedescrcopy_text_failure" style="color:#FF0000; display: none;">&nbsp;&nbsp;失败 - 可能是你的浏览器太古老了</span>
                <div id="cdescr" style="display: none;">
                <br>
                <textarea class="bbcode" cols="100" style="width: 99%" id="ctdescr" rows="20"></textarea>
                </div>
            </td></tr>`
    ).after(`<tr id="diff_unit" >
                <td rowspan="2" class="no-top-bottom-border" style="font-weight: bold; text-align: right; vertical-align: top;">
                    <a href="javascript:void(0)"><span class="nowrap">
                    <img class="plus" src="pic/trans.gif" alt="Show/Hide" id="diffdescr" title="显示&nbsp;/&nbsp;隐藏"> 差异</span></a></td>
                </td>
                <td valign="top" align="left" class="no-top-bottom-border">
                    <div class="diff-container" style="display: none;">
                        <div class="diff-cell">&nbsp;<select name="type" id="history_select2"></select></div>
                        <div class="diff-cell"><select name="type" id="history_select3"></select></div>
                    </div>
                </td>
            </tr>
            <tr id="diff_draw_unit">
                <td valign="top" align="left" class="no-top-bottom-border">
                    <div id="diff_draw" class="draw-div" style="display: none;"></div>
                </td>
            </tr>`);

    $('#ctdescr').val(history_data[0].description_info);
    $('#codedescr').closest('a').click(function () {
        $('#cdescr').toggle();
        $('#codedescr').attr('class', $('#codedescr').attr('class') === 'plus' ? 'minus' : 'plus');
    });
    $('#diffdescr').closest('a').click(async function () {
        $('#diff_draw, .diff-container').toggle();
        if ($('#diffdescr').attr('class') === 'plus') {
            $('#diffdescr').attr('class', 'minus');
            await db.setItem('diff_switch', true);
        } else {
            $('#diffdescr').attr('class', 'plus');
            await db.setItem('diff_switch', false);
        }
    });

    // 记录上次差异按钮打开状态
    if (await db.getItem('diff_switch')) $('#diffdescr').closest('a').trigger('click');

    $('#codedescrcopy').click(function () {
        const _val = $('#ctdescr').val();
        navigator.clipboard.writeText(_val).then(() => {
            $('#codedescrcopy_text_success').fadeIn(500);
            $('#codedescrcopy_text_success').fadeOut(1000);
        }).catch(() => {
            $('#codedescrcopy_text_failure').fadeIn(500);
            $('#codedescrcopy_text_failure').fadeOut(1000);
        });
    });

    const putFileTree = (index) => {
        // 插入ID
        let counter = 0;
        const InsertSeq = (data) => {
            for (key in data) {
                data[key]['id'] = counter;
                counter++;
                if (data[key]['type'] == 'directory') InsertSeq(data[key]['children']);
            };
            return data;
        };
        // 获取文件ID
        const getFile = (data) => {
            let a = []
            for (key in data) {
                if (data[key]['type'] == 'file') a.push(data[key]['id']);
            };
            a = a.concat(getDirectory(data));
            return a;
        };
        // 获取文件夹ID
        const getDirectory = (data, directory = []) => {
            for (key in data) {
                if (data[key]['type'] == 'directory') directory.push(data[key]['id']);
            };
            return directory;
        };
        // 获取文件体积
        const getSize = (data, size = 0) => {
            // console.log(data);
            for (key in data) {
                if (data[key]['type'] == 'file') {
                    size = size + data[key]['length'];
                } else {
                    size = getSize(data[key]['children'], size);
                };
            }
            return size;
        };
        // 遍历JSON
        const tree = (j, i) => {
            for (let key in j) {
                // console.log(j);
                // console.log(j['key']);
                if (j[key]['type'] == 'directory') {
                    let children = j[key]['children'];
                    let f_id_sh = getFile(children);  // 获取文件夹需要的id
                    let f_size = convert(getSize(children))  // 文件夹大小
                    if (f_id === 0) {
                        f_html = f_html + `<tr id="f_id_0" tag="closed"><td class="rowfollow"><a href="javascript:void(0)" onclick="showorhide([${f_id_sh}],0)" class="faqlink">${key}</a></td><td class="rowfollow dir_size" align="right">[${f_size}]</td></tr>`;
                    } else {
                        f_html = f_html + `<tr id="f_id_${f_id}" style="display: none;" tag="closed"><td class="rowfollow">${space.repeat(i)}<a href="javascript:void(0)" onclick="showorhide([${f_id_sh}],${f_id})" class="faqlink">${key}</a></td><td class="rowfollow dir_size" align="right">[${f_size}]</td></tr>`;
                    };
                    f_id++;
                    tree(children, i + 1);
                }
                else {
                    if (f_id === 0) {
                        // 单文件种子
                        f_html = f_html + `<tr id="f_id_${f_id}"><td class="rowfollow">${space.repeat(i)}${key}</td><td class="rowfollow" align="right">${convert(j[key]['length'])}</td></tr>`;
                    } else {
                        f_html = f_html + `<tr id="f_id_${f_id}" style="display: none;"><td class="rowfollow">${space.repeat(i)}${key}</td><td class="rowfollow" align="right">${convert(j[key]['length'])}</td></tr>`;
                    };
                    f_id++;
                };
            };
        };

        let torrent_tree = history_data[index].torrent_tree;
        const numberOfPieces = Math.ceil(history_data[0].torrent_size / history_data[0].torrent_piece_length);

        if (torrent_tree === null) {
            // console.log('tree 为空');
            $('#file_tree').html(
                `<table>
                    <tbody>
                        <tr>
                            <td class="no_border_wide"><b>${lang['files']}</b>: ${history_data[0].torrent_files_qty}<br></td>
                            <td class="no_border_wide"><b>${lang['info_hash']}:</b>&nbsp;${history_data[0].torrent_hash}</td>
                            <td id="torrent_ver" class="no_border_wide"><b>${lang['torrent_ver']}:</b>&nbsp;${history_data[0].torrent_ver}</td>
                            <td id="torrent_piece_length" class="no_border_wide"><b>${lang['torrent_piece_length']}:</b>&nbsp;${numberOfPieces} (${convertBytesToAutoUnit(history_data[0].torrent_piece_length)})</td>
                        </tr>
                    </tbody>
                </table>`
            );
            return;
        };

        torrent_tree = stringify(torrent_tree, function (a, b) {
            // 对keys排序
            if (typeof (a.value) !== 'object' || typeof (b.value) !== 'object') return 0;
            if (a.value.type === 'directory' && b.value.type === 'file') {
                return -1;
            } else if (a.value.type === 'file' && b.value.type === 'directory') {
                return 1;
            } else {
                return a.key.toLowerCase() < b.key.toLowerCase() ? -1 : 1;
            };
        });
        torrent_tree = JSON.parse(torrent_tree);
        torrent_tree = InsertSeq(torrent_tree);
        // console.log(__json);
        let f_id = 0;  // 元素id
        let f_html = '';  // 文件列表
        const space = '&nbsp;&nbsp;&nbsp;&nbsp;';  // 缩进
        tree(torrent_tree, 0);
        // $('#filelist').find('tr').after(f_html);
        $('#file_tree').html(
            `<table>
                <tbody>
                    <tr>
                        <td class="no_border_wide"><b>${lang['files']}</b>: ${history_data[index].torrent_files_qty}<br>
                        <span id="showfl" style="display: inline;">
                            <a href="javascript: viewfilelist()">[查看列表]</a>
                        </span>
                        <span id="hidefl" style="display: none;">
                            <a href="javascript: hidefilelist()">[隐藏列表]</a>
                        </span>
                        ${(() => {
                return f_id > 1
                    ? `<span id="expandall" style="display: none;"><a href="javascript: expandall(true)">[全部展开]</a></span>
                            <span id="closeall" style="display: none;"><a href="javascript: expandall(false)">[全部关闭]</a></span>`
                    : ''
            })()}
                        </td>
                        <td class="no_border_wide"><b>${lang['info_hash']}:</b>&nbsp;${history_data[index].torrent_hash}</td>
                        <td id="torrent_ver" class="no_border_wide"><b>${lang['torrent_ver']}:</b>&nbsp;${history_data[index].torrent_ver}</td>
                        <td id="torrent_piece_length" class="no_border_wide"><b>${lang['torrent_piece_length']}:</b>&nbsp;${numberOfPieces} (${convertBytesToAutoUnit(history_data[0].torrent_piece_length)})</td>
                    </tr>
                </tbody>
            </table>
            <span id="filelist" style="display: none;">
                <style>
                    .dir_size {
                        color: gray;
                        white-space: nowrap;
                    }
                </style>
                <table border="1" cellspacing="0" cellpadding="5">
                    <tbody>
                        <tr>
                            <td class="colhead">路径</td>
                            <td class="colhead" align="center"><img class="size" src="pic/trans.gif" alt="size"></td>
                        </tr>
                        ${f_html}
                    </tbody>
                </table>
            </span>`
        );
    };
    putFileTree(0);  // 运行一次，生成列表

    for (let i = 0, len = history_data.length; i < len; i++) { // 循环插入到选择列表中
        $("#history_select, #history_select2, #history_select3").append("<option value='" + history_data[i].self + "'>"
            + history_data[i].get_time.replace('T', ' ')
            + ((edited_type) => {
                switch (edited_type) {
                    case 0: return ' H';  // 添加候选
                    case 1: return ' E'  // 普通用户编辑
                    case 2: return ' M'  // MOD编辑
                    case 3: return ' T'  // 允许候选
                    case 4: return ' U'  // 上传种子
                    case 5: return ' R';  // 还原被删除的种子
                    default: return ' '  // 早期记录
                };
            })(history_data[i].edited_type)
            + (() => {
                if (history_data[i].self === 0) return lang['current_time']
                else if (history_data[i].edited_name === null && history_data[i].edited_id === null) return ''
                else if (history_data[i].edited_id === null && history_data[i].edited_name === '匿名') return lang['anonymous_user']
                else if (history_data[i].edited_id === null && history_data[i].edited_name === '系统') return lang['system']
                else if (history_data[i].edited_name !== null && history_data[i].edited_id !== null) return ' ' + history_data[i].edited_name + '(' + history_data[i].edited_id + ')'
                else return ' @BUG@'
            })()
            + "</option>");
    };

    $("#history_select2, #history_select3").change(function () {
        const leftValue = Number($("#history_select2").val());
        const rightValue = Number($("#history_select3").val());
        drawDiffHistoryBbcode(history_data, leftValue, rightValue, 'torrent', $('#diff_draw'))
    });

    const $historySelect2 = $("#history_select2");
    const $historySelect3 = $("#history_select3");
    // const firstOptionText = $historySelect2.find("option:eq(0)").text();
    const historySelect2OptionsLength = $historySelect2.find("option").length;

    if (historySelect2OptionsLength === 1) {
        // 就一个记录，无法进行差异处理
        $('#diff_draw_unit, #diff_unit').hide();
    } else {
        let rightValue = 0;
        let leftValue = 1;
        let flagBreak = false;

        while (leftValue < historySelect2OptionsLength) {
            if (preCheckBbcodeDiscrepancy(history_data, leftValue, rightValue) === true) {
                $historySelect3.find("option").eq(rightValue).prop("selected", true);
                $historySelect2.find("option").eq(leftValue).prop("selected", true);
                $historySelect2.trigger("change");
                flagBreak = true;
                break;
            }
            rightValue++;
            leftValue++;
        }

        if (!flagBreak) $('#diff_draw_unit, #diff_unit').hide();

    }

    $("#history_select").change(function () { // 监听菜单选择
        let self = Number($(this).val());
        for (let i = 0, len = history_data.length; i < len; i++) {
            if (self !== history_data[i].self) continue;
            history_data[i].banned === 1 ? $('#top').html(history_data[i].title + '&nbsp;&nbsp;&nbsp; <b>[<font class="striking">' + lang['banned'] + '</font>]</b>') : $('#top').text(history_data[i].title);
            // 检查副标题一栏是否存在
            if ($("td[class='rowhead nowrap']:contains(" + lang['subtitle'] + ")").length === 0 && history_data[i].subtitle !== null) {
                $("td[class='rowhead nowrap']:contains(" + lang['uploaded'] + ")").parent().before('<tr><td class="rowhead nowrap" valign="top" align="right">' + lang['subtitle'] + '</td><td class="rowfollow" valign="top" align="left"></td></tr>');
            }
            else if ($("td[class='rowhead nowrap']:contains(" + lang['subtitle'] + ")").length === 1 && history_data[i].subtitle === null) {
                $("td[class='rowhead nowrap']:contains(" + lang['subtitle'] + ")").parent().remove();
            };
            $("td[class='rowhead nowrap']:contains(" + lang['subtitle'] + ")").next().text(history_data[i].subtitle); // 副标题
            $("td[class='rowhead nowrap']:contains(" + lang['description'] + ")").last().next().html('<div id="kdescr"><span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">' + bbcode2html(history_data[i].description_info) + '</bdo></span></div>'); // 描述
            $('#ctdescr').val(history_data[i].description_info);  // 描述代码
            $("td[class='rowhead nowrap']:contains(" + lang['basic_info'] + ")").next().html('<b>' + lang['submitted_by'] + '</b>:&nbsp;'
                + ((p) => {
                    if (p.uploader_id === null && p.uploader_name === '匿名') return '<i>' + lang['anonymous'] + '</i>'; // 匿名发布
                    if (p.uploader_id !== null && p.uploader_name !== '匿名') return '<a href="userdetails.php?id=' + p.uploader_id + '"><b>' + p.uploader_name + '</b></a>'; // 正常显示
                })(history_data[i])
                + '&nbsp;&nbsp;&nbsp;<b>' + lang['submitted_at'] + '</b>:&nbsp;<time>' + history_data[i].uploaded_at.replace('T', ' ')
                + '</time>'
                + (() => { if (history_data[i].torrent_size) { return '&nbsp;&nbsp;&nbsp;<b>' + lang['size'] + ':</b>&nbsp;' + convert(history_data[i].torrent_size) } else { return ''; } })()
                + '&nbsp;&nbsp;&nbsp;<b>' + lang['category'] + '</b>:&nbsp;' + history_data[i].category
            );
            putFileTree(i);
        };
    });
};



function bbcode2html(bbcodestr) {
    var tempCode = new Array();
    var tempCodeCount = 0;
    let lost_tags = new Array();

    function addTempCode(value) {
        tempCode[tempCodeCount] = value;
        let returnstr = "<tempCode_" + tempCodeCount + ">";
        tempCodeCount++;
        return returnstr;
    };

    const escape_reg = new RegExp("[&\"\'<>]", "g");
    bbcodestr = bbcodestr.replace(escape_reg, function (s, x) {
        switch (s) {
            case '&':
                return '&amp;';
            case '"':
                return '&quot;';
            case "'":
                return '&#039;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            default:
                return s;
        };
    });

    bbcodestr = bbcodestr.replace(/\r\n/g, () => { return '<br>' });
    bbcodestr = bbcodestr.replace(/\n/g, () => { return '<br>' });
    bbcodestr = bbcodestr.replace(/\r/g, () => { return '<br>' });
    bbcodestr = bbcodestr.replace(/  /g, ' &nbsp;');

    let br_end = '';  // 对结尾的换行符进行计数
    let br;
    if (br = bbcodestr.match(/(?:<br>)+$/)) {
        br_end = br[0];
        const regex = new RegExp(`${br_end}$`, "");
        bbcodestr = bbcodestr.replace(regex, '');
    };

    const checkLostTags = (value, r_tag_start, r_tag_end) => {
        let state = false;

        let r_tag_start_exec = r_tag_start.exec(value);
        let index_start = r_tag_start_exec ? (r_tag_start_exec.index + r_tag_start_exec[0].length) : 0;
        let r_tag_end_exec = r_tag_end.exec(value.slice(index_start));

        if (r_tag_start_exec && !r_tag_end_exec) {
            let tag_start_val = r_tag_start_exec.groups.tag;;
            console.log('检测到丢失的标签 => ' + `[/${tag_start_val}]`);
            lost_tags.push(`[/${tag_start_val}]`)
            // value = value + `[/${tag_start_val}]`;
            state = true;
        };

        // return { "value": value, "state": state };
        return { "state": state };
    };

    const url = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { textarea = textarea.replace(/\[url=.(?:&quot;){0,2}\]/i, function (s) { return '[url]'; }); }
        if (val) {
            const lost = checkLostTags(textarea, /\[(?<tag>url)=[^\[]*?/i, /\[\/(?<tag>url)\]/i);
            if (lost.state) { return textarea.replace(/\[url=[^\[]*?/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[url=(.+?)\](.*?)\[\/url\]/i, function (all, url, text) {
                if (url.match(/\s|\[/)) return addTempCode(all);
                let tmp = url.replace(/^(?:&quot;)?(.*?)(?:&quot;)?$/, "$1");
                if (!tmp.match(/&quot;/)) url = tmp;
                else { if (url.match(/&quot;/g).length === 1) url = url.replace('&quot;', ''); }
                return addTempCode('<a class="faqlink" rel="nofollow noopener noreferer" href="' + url.replace(/&quot;/g, '"') + '">' + text + '</a>');
            });
        } else {
            const lost = checkLostTags(textarea, /\[(?<tag>url)\]/i, /\[\/(?<tag>url)\]/i);
            if (lost.state) { return textarea.replace(/\[url\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[url\](.+?)\[\/url\]/i, function (s, x) {
                if (x.match(/\s|\[/i)) return addTempCode(s);
                return addTempCode('<a class="faqlink" rel="nofollow noopener noreferer" href="' + x + '">' + x + '</a>');
            });
        };
    };

    // 注释
    const rt = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { return textarea.replace(/\[rt=.*?\]/i, function (s) { return addTempCode(s); }); }
        else if (!val) { return textarea.replace('[rt]', function (s) { return addTempCode(s); }) }
        else {
            const lost = checkLostTags(textarea, /\[(?<tag>rt)=[^\[]*?/i, /\[\/(?<tag>rt)\]/i);
            if (lost.state) { return textarea.replace(/\[rt=[^\[]*?/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[rt=(.+?)\](.*?)\[\/rt\]/i, function (all, tval, text) {
                if (tval.match(/\[/i)) return addTempCode(all);
                let tmp = tval.replace(/^(?:&quot;)?(.*?)(?:&quot;)?$/, "$1");
                if (!tmp.match(/&quot;/)) tval = tmp;
                return addTempCode('<ruby>' + text + '<rp>(</rp><rt>' + tval + '</rt><rp>)</rp></ruby>');
            });
        };
    };

    // 字体
    const font = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { return textarea.replace(/\[font=.*?]/i, function (s) { return addTempCode(s); }); }
        else if (!val) { return textarea.replace('[font]', function (s) { return addTempCode(s); }) }
        else {
            const lost = checkLostTags(textarea, /\[(?<tag>font)=[^\[]*?\]/i, /\[\/(?<tag>font)\]/i);
            if (lost.state) { return textarea.replace(/\[font=[^\[]*?/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[font=(.+?)\](.*?)\[\/font\]/i, function (all, tval, text) {
                if (tval.match(/\[/i)) return '[' + addTempCode(`font=`) + `${tval}]${text}`;
                let tmp = tval.replace(/^(?:&quot;)?(.*?)(?:&quot;)?$/, "$1");
                if (!/&quot;/.test(tmp)) { tval = tmp; }
                else { if (tval.match(/&quot;/g).length === 1) tval = tval.replace('&quot;', ''); };
                return '<span style="font-family: ' + tval + '">' + text + '</span>';
            });
        };
    };

    // 颜色
    const color = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { return textarea.replace(/\[color=.*?\]/i, function (s) { return addTempCode(s); }); }
        else if (!val) { return textarea.replace('[color]', function (s) { return addTempCode(s); }) }
        else {
            const lost = checkLostTags(textarea, /\[(?<tag>color)=[^\[]*?\]/i, /\[\/(?<tag>color)\]/i);
            if (lost.state) { return textarea.replace(/\[color=[^\[]*?\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[color=(.+?)\](.*?)\[\/color\]/i, function (all, tval, text) {
                if (tval.match(/\[/i)) return addTempCode(all);;
                let tmp = tval.replace(/^(?:&quot;)?(.*?)(?:&quot;)?$/, "$1");
                if (!/&quot;/.test(tmp)) { tval = tmp; }
                else { if (tval.match(/&quot;/g).length === 1) tval = tval.replace('&quot;', ''); };
                return '<span style="color: ' + tval + '">' + text + '</span>';
            });
        };
    };

    // 文字大小
    const size = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { return textarea.replace(/\[size=.*?\]/i, function (s) { return addTempCode(s); }); }
        else if (!val) { return textarea.replace('[size]', function (s) { return addTempCode(s); }) }
        else {
            const lost = checkLostTags(textarea, /\[(?<tag>size)=[^\[]*?\]/i, /\[\/(?<tag>size)\]/i);
            if (lost.state) { return textarea.replace(/\[size=[^\[]*?\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[size=(.+?)\](.*?)\[\/size\]/i, function (all, tval, text) {
                // size只允许1-9的数字
                if (!tval.match(/^(?:&quot;)?[0-9](?:&quot;)?$/)) return addTempCode(all);
                let tmp = tval.replace(/^(?:&quot;)?(.*?)(?:&quot;)?$/, "$1");
                if (!/&quot;/.test(tmp)) { tval = tmp; }
                else { if (tval.match(/&quot;/g).length === 1) tval = tval.replace('&quot;', ''); };
                return '<font size="' + tval + '">' + text + '</font>';
            });
        };
    };

    const pre = (val, textarea) => {
        if (val) { return textarea.replace(/\[pre=(.*?)\]/i, function (s, v) { return addTempCode('[pre=') + v + ']'; }); };
        const lost = checkLostTags(textarea, /\[(?<tag>pre)\]/i, /\[\/(?<tag>pre)\]/i);
        if (lost.state) { return textarea.replace(/\[pre\]/i, function (s) { return addTempCode(s); }); };
        return textarea.replace(/\[pre\](.*?)\[\/pre\]/i, function (all, text) { return '<pre>' + text + '</pre>'; });
    };

    const b = (val, textarea) => {
        if (val) { return textarea.replace(/\[b=(.*?)\]/i, function (s, v) { return addTempCode('[b=') + v + ']'; }); };
        const lost = checkLostTags(textarea, /\[(?<tag>b)\]/i, /\[\/(?<tag>b)\]/i);
        if (lost.state) { return textarea.replace(/\[b\]/i, function (s) { return addTempCode(s); }); };
        return textarea.replace(/\[b\](.*?)\[\/b\]/i, function (all, text) { return '<b>' + text + '</b>'; });
    };

    const i = (val, textarea) => {
        if (val) { return textarea.replace(/\[i=(.*?)\]/i, function (s, v) { return addTempCode('[i=') + v + ']'; }); };
        const lost = checkLostTags(textarea, /\[(?<tag>i)\]/i, /\[\/(?<tag>i)\]/i);
        if (lost.state) { return textarea.replace(/\[i\]/i, function (s) { return addTempCode(s); }); };
        return textarea.replace(/\[i\](.*?)\[\/i\]/i, function (all, text) { return '<em>' + text + '</em>'; });
    };

    const u = (val, textarea) => {
        if (val) { return textarea.replace(/\[u=(.*?)\]/i, function (s, v) { return addTempCode('[u=') + v + ']'; }); };
        const lost = checkLostTags(textarea, /\[(?<tag>u)\]/i, /\[\/(?<tag>u)\]/i);
        if (lost.state) { return textarea.replace(/\[u\]/i, function (s) { return addTempCode(s); }); };
        return textarea.replace(/\[u\](.*?)\[\/u\]/i, function (all, text) { return '<u>' + text + '</u>'; });
    };

    const s = (val, textarea) => {
        if (val) { return textarea.replace(/\[s=(.*?)\]/i, function (s, v) { return addTempCode('[s=') + v + ']'; }); };
        const lost = checkLostTags(textarea, /\[(?<tag>s)\]/i, /\[\/(?<tag>s)\]/i);
        if (lost.state) { return textarea.replace(/\[s\]/i, function (s) { return addTempCode(s); }); };
        return textarea.replace(/\[s\](.*?)\[\/s\]/i, function (all, text) { return '<s>' + text + '</s>'; });
    };

    const img = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { return textarea.replace(/\[img=.*?\]/i, function (s) { return addTempCode(s); }); }
        else if (val) {
            return textarea.replace(/\[img=(.*?)\]/i, function (all, url) {
                // [img=http://u2.dmhy.org/pic/logo.png]
                url = url.replace('&amp;', '&');
                if (/^((?!"|'|>|<|;|#).)+\.(?:png|jpg|jpeg|gif|svg|bmp|webp)$/i.test(url)) {
                    // url 以 .png 之类结尾
                    return addTempCode('<img alt="image" src="' + url + '" style="height: auto; width: auto; max-width: 100%;">');
                } else {
                    return addTempCode(all);
                };
            });
        } else {
            // [img]http://u2.dmhy.org/pic/logo.png[/img]
            const lost = checkLostTags(textarea, /\[(?<tag>img)\]/i, /\[\/(?<tag>img)\]/i);
            if (lost.state) { return textarea.replace(/\[img\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[img\](.*?)\[\/img\]/i, function (all, url) {
                url = url.replace('&amp;', '&');
                if (/^((?!"|'|>|<|;|#).)+\.(?:png|jpg|jpeg|gif|svg|bmp|webp)$/i.test(url)) {
                    // url 以 .png 之类结尾
                    return addTempCode('<img alt="image" src="' + url + '" style="height: auto; width: auto; max-width: 100%;">');
                } else {
                    return addTempCode(all);
                };
            });
        };
    };

    const imglnk = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { return textarea.replace(/\[imglnk=.*?\]/i, function (s) { return addTempCode(s); }); }
        else if (val) {
            return textarea.replace(/\[imglnk=(.*?)\]/i, function (all, url) { return addTempCode('[imglnk=') + url + ']'; });
        } else {
            // [img]http://u2.dmhy.org/pic/logo.png[/img]
            const lost = checkLostTags(textarea, /\[(?<tag>imglnk)\]/i, /\[\/(?<tag>imglnk)\]/i);
            if (lost.state) { return textarea.replace(/\[imglnk\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[imglnk\](.*?)\[\/imglnk\]/i, function (all, url) {
                url = url.replace('&amp;', '&');
                if (/^((?!"|'|>|<|;|#).)+\.(?:png|jpg|jpeg|gif|svg|bmp|webp)$/i.test(url)) {
                    // url 以 .png 之类结尾
                    return addTempCode(`<a class="faqlink" rel="nofollow noopener noreferer" href="' + y + '"><img alt="image" src="${url}" style="height: auto; width: auto; max-width: 100%;"></a>`);
                } else {
                    return addTempCode(all);
                };
            });
        };
    };

    const code = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { textarea = textarea.replace(/\[code=(?:&quot;){0,2}/, '[code]'); };
        if (val) { textarea = textarea.replace(/\[code=(.*?)\]/i, function (s, v) { return addTempCode('[code=') + v + ']'; }); };
        const lost = checkLostTags(textarea, /\[(?<tag>code)\]/i, /\[\/(?<tag>code)\]/i);
        if (lost.state) { return textarea.replace(/\[code\]/i, function (s) { return addTempCode(s); }); };
        return textarea.replace(/\[code\](.*?)\[\/code\]/i, function (all, text) {
            return addTempCode(`<br><div class="codetop">${lang['code']}</div><div class="codemain">${text.replace(/ &nbsp;/g, '  ')}</div><br />`);
        });
    };

    const info = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { textarea = textarea.replace(/\[info=(?:&quot;){0,2}/, '[info]'); };
        if (val) { textarea = textarea.replace(/\[info=(.*?)\]/i, function (s, v) { return addTempCode('[info=') + v + ']'; }); };
        const lost = checkLostTags(textarea, /\[(?<tag>info)\]/i, /\[\/(?<tag>info)\]/i);
        if (lost.state) { return textarea.replace(/\[info\]/i, function (s) { return addTempCode(s); }); };
        return textarea.replace(/\[info\](.*?)\[\/info\]/i, function (all, text) {
            return addTempCode(`<fieldset class="pre"><legend><b><span style="color: blue">${lang['info']}</span></b></legend>${text.replace(/ &nbsp;/g, '  ')}</fieldset>`);
        });
    };

    const mediainfo = (val, textarea) => {
        if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') { textarea = textarea.replace(/\[mediainfo=(?:&quot;){0,2}/, '[mediainfo]'); };
        if (val) { textarea = textarea.replace(/\[mediainfo=(.*?)\]/i, function (s, v) { return addTempCode('[mediainfo=') + v + ']'; }); };
        const lost = checkLostTags(textarea, /\[(?<tag>mediainfo)\]/i, /\[\/(?<tag>mediainfo)\]/i);
        if (lost.state) { return textarea.replace(/\[mediainfo\]/i, function (s) { return addTempCode(s); }); };
        return textarea.replace(/\[mediainfo\](.*?)\[\/mediainfo\]/i, function (all, text) {
            return addTempCode(`<fieldset class="pre"><legend><b><span style="color: red">${lang['mediainfo']}</span></b></legend>${text.replace(/ &nbsp;/g, '  ')}</fieldset>`);
        });
    };

    const quote = (val, textarea) => {
        if (!val) {
            // [quote]我爱U2分享園@動漫花園。[/quote]
            const lost = checkLostTags(textarea, /\[(?<tag>quote)]/i, /\[\/(?<tag>quote)\]/i);
            if (lost.state) { return textarea.replace(/\[quote\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[quote\](.*?)\[\/quote\]/i, function (s, x) {
                return '<fieldset><legend>' + lang['quote'] + '</legend>' + x.replace(/(<br>)*$/, '') + '</fieldset>';
            });
        } else if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') {
            // [quote=""]我爱U2分享園@動漫花園。[/quote]
            const lost = checkLostTags(textarea, /\[(?<tag>quote)=[^\[]*?\]/i, /\[\/(?<tag>quote)\]/i);
            if (lost.state) { return textarea.replace(/\[quote=[^\[]*?\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[quote=[^\[]*?\](.*?)\[\/quote\]/i, function (s, x) {
                return '<fieldset><legend>' + lang['quote'] + '</legend>' + x.replace(/(<br>)*$/, '') + '</fieldset>';
            });
        } else {
            // [quote="ABC"]我爱U2分享園@動漫花園。[/quote]
            const lost = checkLostTags(textarea, /\[(?<tag>quote)=[^\[]*?\]/i, /\[\/(?<tag>quote)\]/i);
            if (lost.state) { return textarea.replace(/\[quote=[^\[]*?\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[quote=([^\[]*?)\](.*?)\[\/quote\]/i, function (all, tval, text) {
                if (tval.match(/\[/i)) return addTempCode(all);;
                let tmp = tval.replace(/^(?:&quot;)?(.*?)(?:&quot;)?$/, "$1");
                if (!/&quot;/.test(tmp)) { tval = tmp; };
                return '<fieldset><legend>' + lang['quote'] + ': ' + tval + '</legend>' + text.replace(/(<br>)*$/, '') + '</fieldset>';
            });
        };
    };

    const spoiler = (val, textarea) => {
        if (!val) {
            // [spoiler]我要剧透了！[/spoiler]
            const lost = checkLostTags(textarea, /\[(?<tag>spoiler)]/i, /\[\/(?<tag>spoiler)\]/i);
            if (lost.state) { return textarea.replace(/\[spoiler\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[spoiler\](.*?)\[\/spoiler\]/i, function (s, x) {
                return `<table class="spoiler" width="100%"><tbody><tr>`
                    + `<td class="colhead">${lang['spoiler']}&nbsp;&nbsp;<button class="spoiler-button-show">${lang['spoiler_button_1']}</button>`
                    + `<button class="spoiler-button-hide" style="display: none;">${lang['spoiler_button_2']}</button></td></tr>`
                    + `<tr><td><span class="spoiler-content" style="display: none;">${x.replace(/(<br>)*$/, '')}</span></td></tr>`
                    + `</tbody></table>`;
            });
        }
        else if (val === '=' || val === '=&quot;' || val === '=&quot;&quot;') {
            // [spoiler=""]真的！[/spoiler]
            const lost = checkLostTags(textarea, /\[(?<tag>spoiler)=.+?\]/i, /\[\/(?<tag>spoiler)\]/i);
            if (lost.state) { return textarea.replace(/\[spoiler=[^\[]*?\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[spoiler=.*?\](.*?)\[\/spoiler\]/i, function (s, x) {
                return `<table class="spoiler" width="100%"><tbody><tr>`
                    + `<td class="colhead">${lang['spoiler']}&nbsp;&nbsp;<button class="spoiler-button-show">${lang['spoiler_button_1']}</button>`
                    + `<button class="spoiler-button-hide" style="display: none;">${lang['spoiler_button_2']}</button></td></tr>`
                    + `<tr><td><span class="spoiler-content" style="display: none;">${x.replace(/(<br>)*$/, '')}</span></td></tr>`
                    + `</tbody></table>`;
            });
        } else {
            // [spoiler="剧透是不可能的！"]真的！[/spoiler]
            const lost = checkLostTags(textarea, /\[(?<tag>spoiler)=.+?\]/i, /\[\/(?<tag>spoiler)\]/i);
            if (lost.state) { return textarea.replace(/\[spoiler=[^\[]*?\]/i, function (s) { return addTempCode(s); }); };
            return textarea.replace(/\[spoiler=(.*?)\](.*?)\[\/spoiler\]/i, function (all, tval, text) {
                if (tval.match(/\[/i)) return addTempCode(all);;
                let tmp = tval.replace(/^(?:&quot;)?(.*?)(?:&quot;)?$/, "$1");
                if (!/&quot;/.test(tmp)) tval = tmp;
                return `<table class="spoiler" width="100%"><tbody><tr>`
                    + `<td class="colhead">${tval}&nbsp;&nbsp;<button class="spoiler-button-show">${lang['spoiler_button_1']}</button>`
                    + `<button class="spoiler-button-hide" style="display: none;">${lang['spoiler_button_2']}</button></td></tr>`
                    + `<tr><td><span class="spoiler-content" style="display: none;">${text.replace(/(<br>)*$/, '')}</span></td></tr>`
                    + `</tbody></table>`;
            });
        };
    };

    const localConvert = (textarea) => {
        let convert_count = 0;
        let index = 0;
        let _textarea = textarea;
        let bbcode_tag;
        while (bbcode_tag = /\[(?<tag>b|i|u|s|color|size|font|rt|mediainfo|info|code|url|img|imglnk|quote|pre|spoiler)(?<val>=[^\[]*?)?\]/gi.exec(_textarea)) {
            let t;
            let tag = bbcode_tag.groups.tag;
            let val = bbcode_tag.groups.val;
            index = bbcode_tag.index;
            _textarea = _textarea.slice(index);
            // console.log(_textarea);
            // console.log(`当前标签：` + tag + ' | ' + val);
            switch (tag.toLowerCase()) {
                case 'b':
                    t = b(val, _textarea); break;
                case 'i':
                    t = i(val, _textarea); break;
                case 'u':
                    t = u(val, _textarea); break;
                case 's':
                    t = s(val, _textarea); break;
                case 'color':
                    t = color(val, _textarea); break;
                case 'size':
                    t = size(val, _textarea); break;
                case 'font':
                    t = font(val, _textarea); break;
                case 'rt':
                    t = rt(val, _textarea); break;
                case 'mediainfo':
                    t = mediainfo(val, _textarea); break;
                case 'info':
                    t = info(val, _textarea); break;
                case 'code':
                    t = code(val, _textarea); break;
                case 'url':
                    t = url(val, _textarea); break;
                case 'img':
                    t = img(val, _textarea); break;
                case 'imglnk':
                    t = imglnk(val, _textarea); break;
                case 'quote':
                    t = quote(val, _textarea); break;
                case 'pre':
                    t = pre(val, _textarea); break;
                case 'spoiler':
                    t = spoiler(val, _textarea); break;
                default:
                    break;;
            };
            textarea = textarea.replace(_textarea, t);
            _textarea = t;
            if (++convert_count > 5000) break;
            // console.log('发生次数: ' + convert_count);
            // console.log(textarea);
        };
        return textarea;
    };

    bbcodestr = localConvert(bbcodestr);

    // 没有bbcode包裹的超链接
    bbcodestr = bbcodestr.replace(/((?:https?|ftp|gopher|news|telnet|mms|rtsp):\/\/((?!&lt;|&gt;|\s|"|>|'|<|\(|\)|\[|\]).)+)/gi, function (s, x) {
        return '<a class="faqlink" rel="nofollow noopener noreferer" href="' + s + '">' + s + '</a>';
    });

    // 单个标签 不带参
    const o_reg = new RegExp("\\[(\\*|siteurl|site)\\]", "gi");
    bbcodestr = bbcodestr.replace(o_reg, function (s, x, y) {
        switch (x) {
            case '*':
                return '<img class="listicon listitem" src="pic/trans.gif" alt="list">';
            case 'site':
                return 'U2分享園@動漫花園';
            case 'siteurl':
                return 'https://u2.dmhy.org';
            default:
                return s;
        };
    });

    // 表情
    const em_reg = new RegExp("\\[(em[1-9][0-9]*)\\]", "gi");
    bbcodestr = bbcodestr.replace(em_reg, function (s, x) {
        switch (x) {
            case (x.match(/^em[1-9][0-9]*/i) || {}).input:
                return '<img src="pic/smilies/' + x.replace("em", "") + '.gif" alt="[' + x + ']">';
            default:
                return s;
        };
    });


    for (let i = 0, len = tempCode.length; i < len; i++) {
        bbcodestr = bbcodestr.replace("<tempCode_" + i + ">", tempCode[i]);
    };

    bbcodestr = bbcodestr + br_end;
    if (/(<br>)$/.test(bbcodestr)) { bbcodestr = bbcodestr + '<br>' };

    // lost_tags
    // if (lost_tags.length !== 0) {
    //     $('#preview_bbcode').html(`⚠ ${lang['preview']}`);
    //     $('#preview_bbcode').attr('title', [...new Set(lost_tags)].join('\n'))
    // } else {
    //     $('#preview_bbcode').html(lang['preview']);
    //     $('#preview_bbcode').attr('title', '')
    // };

    let htmlobj = document.createElement('div');
    htmlobj.innerHTML = bbcodestr;

    $(htmlobj).children('fieldset').children('fieldset').children('fieldset').children('fieldset').each(function () {
        $(this).html($(this).html().replace(/(^<legend>[^<]*?<\/legend>)(.*)/i, function (s, x, y) {
            return x + '<table class="spoiler" width="100%"><tbody>'
                + '<tr><td class="colhead">' + lang['auto_fold'] + '&nbsp;&nbsp;'
                + '<button class="spoiler-button-show">' + lang['spoiler_button_1'] + '</button>'
                + '<button class="spoiler-button-hide" style="display: none;">' + lang['spoiler_button_2'] + '</button>'
                + '</td></tr><tr><td><span class="spoiler-content" style="display: none;">'
                + y + '</span></td></tr></tbody></table>';
        }));
    });

    return $(htmlobj).html();
};


function getapi() {
    return new Promise((resolve, reject) => {
        // https://www.w3school.com.cn/jquery/ajax_ajax.asp
        $.ajax({
            type: 'get',
            url: 'https://u2.kysdm.com/api/v1/history?token=' + token + '&maximum=50&uid=' + user_id + '&torrent_id=' + torrent_id,
            contentType: 'application/json',
            dataType: 'json',
            cache: true,
            success: r => resolve(r),
            error: r => {
                console.log('发生错误，HTTP状态码[' + r.status + ']。');
                reject(r.status)
            },
        });
    }).catch(() => { return { "state": "404", "msg": "failure", "data": { "history": [] } }; });
};


function lang_init(lang) {
    const lang_json = {
        "zh_CN": {
            "quote": "引用",
            "info": "发布信息",
            "mediainfo": "媒体信息",
            "code": "代码",
            "spoiler": "警告！下列文字很可能泄露剧情，请谨慎选择是否观看。",
            "spoiler_button_1": "我就是手贱",
            "spoiler_button_2": "我真是手贱",
            "main_title": "主标题",
            "rt_text": "请输入上标",
            "main_body": "请输入正文",
            "main_body_prefix": "请输入标题",
            "url_name": "请输入网址名称",
            "url_link": "请输入网址链接",
            "select_type": "请选择分类...",
            "preview": "预览",
            "auto_fold": "过深引用自动折叠",
            "subtitle": "副标题",
            "uploaded": "发布人",
            "basic_info": "基本信息",
            "description": "描述",
            "history_select_loading": "正在努力加载中...",
            "history_select_error": "加载失败啦 (ノДＴ)",
            "anonymous": "匿名",
            "uploaded_at": "发布时间",
            "size": "大小",
            "category": "类型",
            "submitted_by": "提供者",
            "submitted_at": "提交时间",
            "history_text_loading": "~~正在检查历史数据中~~",
            "history_text_error": "加载失败啦 (ノДＴ) %%",
            "history_text_empty": "半条历史记录都没有 (ノДＴ) @@",
            "torrent_title": "种子标题",
            "torrent_info": "种子信息",
            "torrent_ver": "种子版本",
            "torrent_piece_length": "种子区块",
            "files": "文件数",
            "info_hash": "种子散列值",
            "show_or_hide": "显示&nbsp;/&nbsp;隐藏",
            "KiB": " KiB",
            "MiB": " MiB",
            "GiB": " GiB",
            "TiB": " TiB",
            "current_time": " 当前时间",
            "anonymous_user": " 匿名用户",
            "system": " 系统",
            "banned": "已屏蔽",
            "google_backup": "谷歌备份",
            "google_send": "发送请求",
            "last_edited": "最后编辑",
            "back_to_top": "返回顶部",
            "reset_token": "重置Token (・_・)ヾ",
        },
        "zh_TW": {
            "quote": "引用",
            "info": "發佈訊息",
            "mediainfo": "媒體訊息",
            "code": "代碼",
            "spoiler": "警告！下列文字很可能洩露劇情，請謹慎選擇是否觀看。",
            "spoiler_button_1": "我就是手賤",
            "spoiler_button_2": "我真是手賤",
            "main_title": "主標題",
            "rt_text": "請輸入上標",
            "main_body": "請輸入正文",
            "main_body_prefix": "請輸入標題",
            "url_name": "請輸入網址名稱",
            "url_link": "請輸入網址連結",
            "select_type": "請選擇分類...",
            "preview": "預覽",
            "auto_fold": "過深引用自動摺疊",
            "subtitle": "副標題",
            "uploaded": "發布人",
            "basic_info": "基本訊息",
            "description": "描述",
            "history_select_loading": "正在努力載入中...",
            "history_select_error": "載入失敗啦 (ノДＴ)",
            "anonymous": "匿名",
            "uploaded_at": "發布時間",
            "size": "大小",
            "category": "類型",
            "submitted_by": "提供者",
            "submitted_at": "提交時間",
            "history_text_loading": "~~正在檢查歷史數據中~~",
            "history_text_error": "載入失敗啦 (ノДＴ) %%",
            "history_text_empty": "半條歷史記錄都沒有 (ノДＴ) @@",
            "torrent_title": "種子標題",
            "torrent_info": "種子訊息",
            "torrent_ver": "種子版本",
            "torrent_piece_length": "種子區塊",
            "files": "文件數",
            "info_hash": "種子散列值",
            "show_or_hide": "顯示&nbsp;/&nbsp;隱藏",
            "KiB": " KiB",
            "MiB": " MiB",
            "GiB": " GiB",
            "TiB": " TiB",
            "current_time": " 當前時間",
            "anonymous_user": " 匿名用戶",
            "system": " 系統",
            "banned": "已屏蔽",
            "google_backup": "Google備份",
            "google_send": "發送請求",
            "last_edited": "最後編輯",
            "back_to_top": "返回頂部",
            "reset_token": "重設Token (・_・)ヾ",
        },
        "zh_HK": {
            "quote": "引用",
            "info": "發佈訊息",
            "mediainfo": "媒體訊息",
            "code": "代碼",
            "spoiler": "警告！下列文字很可能洩露劇情，請謹慎選擇是否觀看。",
            "spoiler_button_1": "我就是手賤",
            "spoiler_button_2": "我真是手賤",
            "main_title": "主標題",
            "rt_text": "請輸入上標",
            "main_body": "請輸入正文",
            "main_body_prefix": "請輸入標題",
            "url_name": "請輸入網址名稱",
            "url_link": "請輸入網址鏈接",
            "select_type": "請選擇分類...",
            "preview": "預覽",
            "auto_fold": "過深引用自動摺疊",
            "subtitle": "副標題",
            "uploaded": "發布人",
            "basic_info": "基本訊息",
            "description": "描述",
            "history_select_loading": "正在努力加載中...",
            "history_select_error": "加載失敗啦 (ノДＴ)",
            "anonymous": "匿名",
            "uploaded_at": "發佈時間",
            "size": "大小",
            "category": "類型",
            "submitted_by": "提供者",
            "submitted_at": "提交時間",
            "history_text_loading": "~~正在檢查歷史數據中~~",
            "history_text_error": "加載失敗啦 (ノДＴ) %%",
            "history_text_empty": "半條歷史記錄都沒有 (ノДＴ) @@",
            "torrent_title": "種子標題",
            "torrent_info": "種子訊息",
            "torrent_ver": "種子版本",
            "torrent_piece_length": "種子區塊",
            "files": "文件數",
            "info_hash": "種子散列值",
            "show_or_hide": "顯示&nbsp;/&nbsp;隱藏",
            "KiB": " KiB",
            "MiB": " MiB",
            "GiB": " GiB",
            "TiB": " TiB",
            "current_time": " 當前時間",
            "anonymous_user": " 匿名用戶",
            "system": " 系統",
            "banned": "已屏蔽",
            "google_backup": "Google備份",
            "google_send": "發送請求",
            "last_edited": "最後編輯",
            "back_to_top": "返回頂部",
            "reset_token": "重置Token (・_・)ヾ",
        },
        "en_US": {
            "quote": "Quote",
            "info": "Infobox",
            "mediainfo": "Media Info",
            "code": "CODE",
            "spoiler": "Warning! This section contains spoiler!",
            "spoiler_button_1": "I agree to view this.",
            "spoiler_button_2": "Hide this.",
            "main_title": "Main Title",
            "rt_text": "Please enter superscript",
            "main_body": "Please enter the text",
            "main_body_prefix": "Please enter a title",
            "url_name": "Please enter the URL name",
            "url_link": "Please enter the URL link",
            "select_type": "Please select a type.",
            "preview": "Preview",
            "auto_fold": "Over quote auto fold",
            "subtitle": "Small Description",
            "uploaded": "Uploader",
            "basic_info": "Basic Info",
            "description": "Description",
            "history_select_loading": "Trying to load now ...",
            "history_select_error": "Load failure (ノДＴ)",
            "anonymous": "Anonymous",
            "uploaded_at": "Uploaded at",
            "size": "Size",
            "category": "Category",
            "submitted_by": "Submitted by",
            "submitted_at": "Submitted at",
            "history_text_loading": "~~Checking historical data now~~",
            "history_text_error": "Load failure (ノДＴ) %%",
            "history_text_empty": "Half of the history is missing (ノДＴ) @@",
            "torrent_title": "Torrent Title",
            "torrent_info": "Torrent Info",
            "torrent_ver": "Torrent Ver",
            "torrent_piece_length": "Torrent Piece Length",
            "files": "Files",
            "info_hash": "Info hash",
            "show_or_hide": "Show&nbsp;or&nbsp;Hide",
            "KiB": " KiB",
            "MiB": " MiB",
            "GiB": " GiB",
            "TiB": " TiB",
            "current_time": " CurrentTime",
            "anonymous_user": " AnonymousUser",
            "system": " 系統",
            "banned": "Banned",
            "google_backup": "Google Backup",
            "google_send": "Send request",
            "last_edited": "Last edited by",
            "back_to_top": "Back to top",
            "reset_token": "Reset Token (・_・)ヾ",
        },
        "ru_RU": {
            "quote": "Цитата",
            "info": "Отправленные",
            "mediainfo": "Данные о Медиа",
            "code": "CODE",
            "spoiler": "Предупреждение! Данный раздел содержит СПОЙЛЕРЫ!",
            "spoiler_button_1": "I agree to view this.",
            "spoiler_button_2": "Hide this.",
            "main_title": "Основное название",
            "rt_text": "Пожалуйста, введите надстрочный индекс",
            "main_body": "Пожалуйста, введите текст",
            "main_body_prefix": "Пожалуйста, введите название",
            "url_name": "Пожалуйста, введите имя URL",
            "url_link": "Пожалуйста, введите URL-ссылку",
            "select_type": "выберите тип ...",
            "preview": "Предварительный просмотр",
            "auto_fold": "Автоматическое складывание для более глубоких ссылок",
            "subtitle": "Краткое Описание",
            "uploaded": "Загрузил",
            "basic_info": "Базовая инф.",
            "description": "Описание",
            "history_select_loading": "Пытаюсь загрузить сейчас ...",
            "history_select_error": "Отказ нагрузки (ノДＴ)",
            "anonymous": "Анонимно",
            "uploaded_at": "Загружен",
            "size": "Размер",
            "category": "Категория",
            "submitted_by": "Разместивший Запрос",
            "submitted_at": "Дата размещения",
            "history_text_loading": "~~Проверка исторических данных сейчас~~",
            "history_text_error": "Отказ нагрузки (ノДＴ) %%",
            "history_text_empty": "Половина истории отсутствует (ノДＴ) @@",
            "torrent_title": "Имя торрента",
            "torrent_info": "Информация о торренте",
            "torrent_ver": "Торрент Вер",
            "torrent_piece_length": "Длина куска торрента",
            "files": "Файлов в торренте",
            "info_hash": "Информация о ХЕШЕ",
            "show_or_hide": "Показать&nbsp;/&nbsp;Скрыть",
            "KiB": " KiБ",
            "MiB": " MiБ",
            "GiB": " GiБ",
            "TiB": " TiБ",
            "current_time": " Текущее время",
            "anonymous_user": " Анонимный пользователь",
            "system": " система",
            "banned": "Забанен",
            "google_backup": "Резервное копирование Google",
            "google_send": "послать запрос",
            "last_edited": "Последний раз редактировалось",
            "back_to_top": "На главную",
            "reset_token": "Токен сброса (・_・)ヾ",
        }
    };
    return lang_json[lang];
};

// 当前时间 字符串格式
function getDateString() {
    function zero(obj) { return obj < 10 ? '0' + obj : obj };
    const time = new Date();
    return time.getFullYear().toString() + '-' + zero(time.getMonth() + 1).toString() + '-' + zero(time.getDate()).toString()
        + ' ' + zero(time.getHours()) + ':' + zero(time.getMinutes()) + ':' + zero(time.getSeconds())
};

function convert(s) {
    if (s / 1024 < 1024) return (s / 1024).toFixed(3) + lang['KiB']
    if (s / 1024 / 1024 < 1024) return (s / 1024 / 1024).toFixed(3) + lang['MiB']
    if (s / 1024 / 1024 / 1024 < 1024) return (s / 1024 / 1024 / 1024).toFixed(3) + lang['GiB']
    if (s / 1024 / 1024 / 1024 / 1024 < 1024) return (s / 1024 / 1024 / 1024 / 1024).toFixed(3) + lang['TiB']
};

// 生成种子评论cid定位url
const cidUrl = (t, c) => {
    if (/\/offers\.php/i.test(location.href)) {
        return `offers.php?id=${t}&off_details=1#cid${c}`
    } else if (/\/details\.php/i.test(location.href))
        return `details.php?id=${t}#cid${c}`
    else {
        return '/'
    };
};

// 对JSON进行排序
// https://github.com/substack/json-stable-stringify
const stringify = function (obj, opts) {
    if (!opts) opts = {};
    if (typeof opts === 'function') opts = { cmp: opts };
    var space = opts.space || '';
    if (typeof space === 'number') space = Array(space + 1).join(' ');
    var cycles = (typeof opts.cycles === 'boolean') ? opts.cycles : false;
    var replacer = opts.replacer || function (key, value) { return value; };

    var cmp = opts.cmp && (function (f) {
        return function (node) {
            return function (a, b) {
                var aobj = { key: a, value: node[a] };
                var bobj = { key: b, value: node[b] };
                return f(aobj, bobj);
            };
        };
    })(opts.cmp);

    var seen = [];
    return (function stringify(parent, key, node, level) {
        var indent = space ? ('\n' + new Array(level + 1).join(space)) : '';
        var colonSeparator = space ? ': ' : ':';

        if (node && node.toJSON && typeof node.toJSON === 'function') {
            node = node.toJSON();
        }

        node = replacer.call(parent, key, node);

        if (node === undefined) {
            return;
        }
        if (typeof node !== 'object' || node === null) {
            return JSON.stringify(node);
        }
        if (isArray(node)) {
            var out = [];
            for (var i = 0; i < node.length; i++) {
                var item = stringify(node, i, node[i], level + 1) || JSON.stringify(null);
                out.push(indent + space + item);
            }
            return '[' + out.join(',') + indent + ']';
        }
        else {
            if (seen.indexOf(node) !== -1) {
                if (cycles) return JSON.stringify('__cycle__');
                throw new TypeError('Converting circular structure to JSON');
            }
            else seen.push(node);

            var keys = objectKeys(node).sort(cmp && cmp(node));
            var out = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = stringify(node, key, node[key], level + 1);

                if (!value) continue;

                var keyValue = JSON.stringify(key)
                    + colonSeparator
                    + value;
                ;
                out.push(indent + space + keyValue);
            }
            seen.splice(seen.indexOf(node), 1);
            return '{' + out.join(',') + indent + '}';
        }
    })({ '': obj }, '', obj, 0);
};

const isArray = Array.isArray || function (x) {
    return {}.toString.call(x) === '[object Array]';
};

const objectKeys = Object.keys || function (obj) {
    var has = Object.prototype.hasOwnProperty || function () { return true };
    var keys = [];
    for (var key in obj) {
        if (has.call(obj, key)) keys.push(key);
    }
    return keys;
};

function convertBytesToAutoUnit(bytes) {
    var units = ['B', 'KiB', 'MiB'];
    var unitIndex = 0;

    while (bytes >= 1024 && unitIndex < units.length - 1) {
        bytes >>= 10;
        unitIndex++;
    };

    return bytes + units[unitIndex];
};

async function loadExternalCssAsync(url) {
    return new Promise((resolve) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        link.onload = resolve;
        link.onerror = resolve;
        document.head.appendChild(link);
    });
}

function addGlobalStyles(cssRules) {
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(cssRules));
    document.head.appendChild(styleElement);
}

function diffHistoryCommentBbcode(comments, type) {
    const elementId = type === 'torrent' ? '[id^=cid]' : '[id^=pid]';

    $('.diff_comment_button_close').click(function () {
        $(this).hide();
        $(this).next().show();

        type === 'torrent' ? $(this).parents(elementId).parent().next().find('[class="rowfollow"]:last').show() : $(this).parents(elementId).parent().next().find('.post-body').parent().show();

        $(this).parents(elementId).parent().next().find('.diff_comment_body').hide();
    })

    $('.diff_comment_button_open').click(function () {
        $(this).hide();
        $(this).prev().show();

        const options = $(this).next().html();
        const post = type === 'torrent' ? $(this).parents(elementId).parent().next().find('[class="rowfollow"]:last') : $(this).parents(elementId).parent().next().find('.post-body').parent();  // 文字部分

        post.hide()

        if ($(this).parents(elementId).parent().next().find('.draw-div').length !== 0) {
            // 已插入过的
            $(this).parents(elementId).parent().next().find('.diff_comment_body').show();
            return;
        }

        post.after(`<td class="diff_comment_body" valign="top">
                        <table style="width: 100%; height: 100%; border-collapse: collapse; border: none; background-color: transparent;">
                            <tr>
                                <td valign="top" style="border: none;">
                                    <div class="diff-container" style="">
                                        <div class="diff-cell">&nbsp;<select name="type" class="diff_comment_left_select">${options}</select></div>
                                        <div class="diff-cell"><select name="type" class="diff_comment_right_select">${options}</select></div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td valign="top" style="border: none;">
                                    <div class="draw-div"></div>
                                </td>
                            </tr>
                        </table>
                    </td>`);

        const leftSelect = $(this).parents(elementId).parent().next().find('.diff_comment_left_select');
        const rightSelect = $(this).parents(elementId).parent().next().find('.diff_comment_right_select');
        const drawElement = $(this).parents(elementId).parent().next().find('.draw-div');

        leftSelect.add(rightSelect).change(function () {
            const leftValue = Number(leftSelect.val());
            const rightValue = Number(rightSelect.val());
            console.log(`${leftValue} | ${rightValue}`);
            drawDiffHistoryBbcode(comments, leftValue, rightValue, 'comment', drawElement);
        });

        let leftEq = 1;
        let rightValue = Number(rightSelect.find('option:eq(0)').val());
        var optionCount = rightSelect.find('option').length;
        let leftBbcode, rightBbcode;
        let flagBreak = false;

        while (leftEq < optionCount) {
            let leftValue = Number(leftSelect.find(`option:eq(${leftEq})`).val());

            for (let i = 0, len = comments.length; i < len; i++) {
                if (comments[i].self === leftValue) {
                    leftBbcode = comments[i].bbcode;
                } else if (comments[i].self === rightValue) {
                    rightBbcode = comments[i].bbcode;
                }

                if (leftBbcode !== undefined && leftBbcode !== "" && rightBbcode !== undefined && rightBbcode !== "") break;

            }

            if (leftBbcode !== rightBbcode) {
                leftSelect.find(`option:eq(${leftEq})`).prop("selected", true);
                leftSelect.trigger("change");
                flagBreak = true;
                break;
            }
            leftBbcode = '';
            leftEq++;
        }

        if (!flagBreak) {
            // 如果修改记录的BBCODE都一样
            leftSelect.find(`option:eq(1)`).prop("selected", true);
            rightSelect.find(`option:eq(0)`).prop("selected", true);
            leftSelect.trigger("change");
        }

    });

}

function preCheckBbcodeDiscrepancy(data, left, right) {
    // 预检测两边BBCODE是否存在差异
    let leftBbcode = generateBbcode(data[left]);
    let rightBbcode = generateBbcode(data[right]);
    return !(leftBbcode === rightBbcode || typeof leftBbcode === 'undefined' || typeof rightBbcode === 'undefined');
}

function generateBbcode(data) {
    return `Title: ${data.title}

Subtitle: ${data.subtitle || 'N/A'}

Uploader Name: ${data.uploader_name}

Category: ${data.category}

Anidb: ${data.anidb || 'N/A'}  *此变动不精准，仅供参考。

Description:
${data.description_info}`;
}

function drawDiffHistoryBbcode(data, leftValue, rightValue, type, drawElement) {
    /* addGlobalStyles(`.diff-container{
                        display: flex;
                        align-items: flex-start;
                        justify-content: flex-start;
                    }
                    .diff-cell{
                        border: none;
                        padding: 0;
                        margin-left: 5px;
                        flex: 1;
                    }
                    .draw-div{
                        box-sizing: border-box;
                        max-width: 100%;
                        min-height: 15px;
                        max-height: 600px;
                        margin: 5px;
                        overflow: auto;
                        border-top: 1px solid #bfbfbf;
                        border-bottom: 1px solid #bfbfbf;
                    }
                    .diff-table {
                        width: 100%;
                        border-left: 1px solid #bfbfbf;
                        border-right: 1px solid #bfbfbf;
                        background-color: white;
                    }
                    .diff-table table, .diff-table table td{
                        background-color: transparent;
                        border: none;
                        vertical-align: top;
                    }
                    .diff-table, .diff-table table {
                        border-collapse: collapse;
                        box-sizing: border-box;
                        table-layout: fixed;
                        font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
                        font-size: 12px;
                    }
                    .diff-table tbody {
                        vertical-align: top;
                    }
                    .diff-table del {
                        text-decoration: none;
                        background-color: #ff818266;
                    }
                    .diff-table ins {
                        text-decoration: none;
                        background-color: #abf2bc;
                    }
                    .diff-linenumber {
                        text-align: right;
                        vertical-align: top;
                        width: 3em;
                        border: none;
                        color: #6e7781;
                        font-size: 12px;
                    }
                    .diff-linenumber-delete {
                        background-color: #ffd7d5;
                    }
                    .diff-linenumber-insert {
                        background-color: #ccffd8;
                    }
                    .diff-line-text-delete {
                        background-color: #ffebe9;
                    }
                    .diff-line-text-insert {
                        background-color: #e6ffec;
                    }
                    .diff-linenumber-empty, .diff-text-cell-empty {
                        background-color: #d0d8e080;
                    }
                    .diff-line-text {
                        display: inline-block;
                        white-space: pre-wrap;
                        overflow-wrap: break-word;
                        word-break: break-word;
                        box-sizing: border-box;
                        width: auto;
                        font-size: 12px;
                    }
                    .diff-line-prefix {
                        background: none;
                        word-wrap: break-word;
                        display: inline;
                        font-size: 12px;
                        box-sizing: border-box;
                        vertical-align: top;
                    }  
                    .diff-line-prefix-delete::before {
                        content: " - ";
                    }  
                    .diff-line-prefix-insert::before {
                        content: " + ";
                    }
                    .diff-line-prefix-empty::before {
                        content: "   ";
                    }
                    .diff-text-cell, .diff-text-cell-empty {
                        width: auto;
                        white-space: pre;
                        border-left: none;
                        border-right: 1px solid #bfbfbf;
                        border-top: none;
                        border-bottom: none;
                    }`); */

    // 生成BBCODE内容
    for (let i = 0, len = data.length; i < len; i++) {
        if (data[i].self === leftValue) {
            var leftBbcode = type === 'torrent' ? generateBbcode(data[i]) : data[i].bbcode;
        } else if (data[i].self === rightValue) {
            var rightBbcode = type === 'torrent' ? generateBbcode(data[i]) : data[i].bbcode;
        }
    }

    if (leftBbcode === rightBbcode || typeof leftBbcode === 'undefined' || typeof rightBbcode === 'undefined') {
        drawElement.html(`<table class="diff-table">
            <tbody id="diff-tbody">
                <tr style="background-color: #ddf4ff;">
                    <td class="diff-linenumber">
                    </td>
                    <td class="diff-text-cell" style="border-right: none; color: #6e7781;">
                        <span>bbcode without changes</span>
                    </td>
                    <td class="diff-linenumber"></td>
                    <td class="diff-text-cell"></td>
                </tr>
                </tbody>
            </table>`);
        return;
    }

    const configuration = {
        drawFileList: false,
        fileListToggle: false,
        fileListStartVisible: false,
        fileContentToggle: false,
        matching: 'lines',
        outputFormat: 'side-by-side',  // line-by-line or side-by-side
        synchronisedScroll: true,
        highlight: false,
        renderNothingWhenEmpty: false,
        wordWrap: true,
        stickyFileHeaders: false,
    };

    let $diffHtml = $(Diff2Html.html(Diff.createTwoFilesPatch("a", "b", leftBbcode, rightBbcode), configuration));
    let $diffTbody = $diffHtml.find('tbody.d2h-diff-tbody');

    const processTr = ($tr) => {
        let list = [];
        $tr.each(function () {
            let obj;
            if ($(this).find('td.d2h-code-side-linenumber.d2h-info').length == 1) {
                // 行信息
                const header = $(this).text().trim();
                list.push({ "type": 'header', "content": header });
            } else {
                const number = $(this).find("td[class^='d2h-code-side-linenumber']").text().trim();
                const prefix = $(this).find('span.d2h-code-line-prefix').text();
                let content = $(this).find('span.d2h-code-line-ctn').html();
                content = content === '<br>' ? '' : content;
                const state = (prefix === '+') ? 'add' : ((prefix === '-') ? 'del' : 'no');
                list.push({ "type": 'content', "content": content, "prefix": prefix, "line": number });
            }
        });
        return list;
    }

    let oldList = processTr($diffTbody.eq(0).children('tr'));
    let newList = processTr($diffTbody.eq(1).children('tr'));

    let $html = $(`<table class="diff-table"><tbody id="diff-tbody"></tbody></table>`);
    const $tbody = $html.find('#diff-tbody');

    for (let index = 0; index < oldList.length; index++) {

        if (oldList[index].type === 'header') {
            $tbody.append(`<tr style="background-color: #ddf4ff;">`
                + `<td class="diff-linenumber"></td><td class="diff-text-cell" style="border-right: none;"><span>${oldList[index].content}</span></td>`
                + `<td class="diff-linenumber"></td><td class="diff-text-cell"></td>`
                + `</tr>`);
            continue;
        }

        const oldPrefix = oldList[index].prefix;
        const oldContent = oldList[index].content;
        const oldLine = oldList[index].line;
        const newPrefix = newList[index].prefix;
        const newContent = newList[index].content;
        const newLine = newList[index].line;

        if (oldPrefix === ' ' && newPrefix === ' ') {
            // 两边都没有修改
            $tbody.append(`<tr>`
                + `<td class="diff-linenumber">${oldLine}&nbsp;</td>`
                + `<td class="diff-text-cell">`
                + `<table><tr><td><span class="diff-line-prefix diff-line-prefix-empty"></span></td><td><span class="diff-line-text">${oldContent}</span></td></tr></table>`
                + `</td>`
                + `<td class="diff-linenumber">${newLine}&nbsp;</td>`
                + `<td class="diff-text-cell">`
                + `<table><tr><td><span class="diff-line-prefix diff-line-prefix-empty"></span></td><td><span class="diff-line-text">${newContent}</span></td></tr></table>`
                + `</td>`
                + `</tr>`);
        } else if (oldPrefix === '-' && newPrefix === '+') {
            $tbody.append(`<tr>`
                + `<td class="diff-linenumber diff-linenumber-delete">${oldLine}&nbsp;</td>`
                + `<td class="diff-text-cell diff-line-text-delete">`
                + `<table><tr><td><span class="diff-line-prefix diff-line-prefix-delete"></span></td><td><span class="diff-line-text">${oldContent}</span></td></tr></table>`
                + `</td>`
                + `<td class="diff-linenumber diff-linenumber-insert">${newLine}&nbsp;</td>`
                + `<td class="diff-text-cell diff-line-text-insert">`
                + `<table><tr><td><span class="diff-line-prefix diff-line-prefix-insert"></span></td><td><span class="diff-line-text">${newContent}</span></td></tr></table>`
                + `</td>`
                + `</tr>`);
        } else if (oldPrefix === '-' && newPrefix === ' ') {
            $tbody.append(`<tr>`
                + `<td class="diff-linenumber diff-linenumber-delete">${oldLine}&nbsp;</td>`
                + `<td class="diff-text-cell diff-line-text-delete">`
                + `<table><tr><td><span class="diff-line-prefix diff-line-prefix-delete"></span></td><td><span class="diff-line-text">${oldContent}</span></td></tr></table>`
                + `</td>`
                + `<td class="diff-linenumber diff-linenumber-empty"></td>`
                + `<td class="diff-text-cell-empty"></td>`
                + `</tr>`);
        } else if (oldPrefix === ' ' && newPrefix === '+') {
            $tbody.append(`<tr>`
                + `<td class="diff-linenumber diff-linenumber-empty"></td>`
                + `<td class="diff-text-cell-empty"></td>`
                + `<td class="diff-linenumber diff-linenumber-insert">${newLine}&nbsp;</td>`
                + `<td class="diff-text-cell diff-line-text-insert">`
                + `<table><tr><td><span class="diff-line-prefix diff-line-prefix-insert"></span></td><td><span class="diff-line-text">${newContent}</span></td></tr></table>`
                + `</td>`
                + `</tr>`);
        }

    }

    drawElement.html($html);
}
