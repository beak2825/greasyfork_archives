// ==UserScript==
// @name         查看S1不可见内容(审核中/禁言)自动版
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  查看S1正在审核中的帖子和被禁言用户的回帖
// @author       ShienPro
// @match        https://*.saraba1st.com/2b/thread-*
// @match        https://*.saraba1st.com/2b/forum.php*tid=*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.staticfile.org/jsrender/1.0.8/jsrender.min.js
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/470638/%E6%9F%A5%E7%9C%8BS1%E4%B8%8D%E5%8F%AF%E8%A7%81%E5%86%85%E5%AE%B9%28%E5%AE%A1%E6%A0%B8%E4%B8%AD%E7%A6%81%E8%A8%80%29%E8%87%AA%E5%8A%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/470638/%E6%9F%A5%E7%9C%8BS1%E4%B8%8D%E5%8F%AF%E8%A7%81%E5%86%85%E5%AE%B9%28%E5%AE%A1%E6%A0%B8%E4%B8%AD%E7%A6%81%E8%A8%80%29%E8%87%AA%E5%8A%A8%E7%89%88.meta.js
// ==/UserScript==
(function () {
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
    const postTmpl = $.templates(`
        <div class="t_fsz">
            <table cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                    <td class="t_f" id="postmessage_{{:pid}}">
                        {{:message}}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
`);
    const threadTmpl = $.templates(`
        <script type="text/javascript">var fid = parseInt('{{:fid}}'), tid = parseInt('{{:tid}}');</script>

        <script src="data/cache/forum_viewthread.js?Qin" type="text/javascript"></script>
        <script type="text/javascript">zoomstatus = parseInt(1);
        var imagemaxwidth = '800';
        var aimgcount = new Array();</script>


        <div class="wp">
            <!--[diy=diy1]-->
            <div id="diy1" class="area"></div><!--[/diy]-->
        </div>

        <div id="ct" class="wp cl">
            <div id="pgt" class="pgs mbm cl ">
                <div class="pgt">
                    <div class="pg">
                        <label>
                            <input type="text" name="custompage" class="px" size="{{:totalPage}}" title="输入页码，按回车快速跳转"
                                   value="{{:pageNo}}"
                                   onkeydown="if(event.keyCode==13) {window.location='forum.php?mod=viewthread&amp;tid={{:tid}}&amp;extra=page%3D1&amp;page='+this.value;; doane(event);}">
                            <span title="共 {{:totalPage}} 页"> / {{:totalPage}} 页</span>
                        </label>
                        {{if nextPage != null}}
                        <a href="thread-{{:tid}}-{{:nextPage}}-1.html" class="nxt">下一页</a>
                        {{/if}}
                    </div>
                </div>
                <span class="y pgb" id="visitedforums"
                      onmouseover="$('visitedforums').id = 'visitedforumstmp';this.id = 'visitedforums';showMenu({'ctrlid':this.id,'pos':'34'})"
                      initialized="true"><a href="forum-{{:fid}}-1.html">返回列表</a></span>
            </div>

            <div id="postlist" class="pl bm">
                <table cellspacing="0" cellpadding="0">
                    <tbody>
                    <tr>
                        <td class="pls ptn pbn">
                            <div class="hm ptn">
                                <span class="xg1">查看:</span> <span class="xi1">{{:views}}</span><span class="pipe">|</span><span
                                    class="xg1">回复:</span> <span class="xi1">{{:replies}}</span>
                            </div>
                        </td>
                        <td class="plc ptm pbn vwthd">
                            <div class="y">
                                <a href="forum.php?mod=viewthread&amp;action=printable&amp;tid=296694" title="打印"
                                   target="_blank"><img src="https://static.saraba1st.com/image/s1/print.png" alt="打印"
                                                        class="vm"></a>
                                <a href="forum.php?mod=redirect&amp;goto=nextoldset&amp;tid=296694" title="上一主题"><img
                                        src="https://static.saraba1st.com/image/s1/thread-prev.png" alt="上一主题" class="vm"></a>
                                <a href="forum.php?mod=redirect&amp;goto=nextnewset&amp;tid=296694" title="下一主题"><img
                                        src="https://static.saraba1st.com/image/s1/thread-next.png" alt="下一主题" class="vm"></a>
                            </div>
                            <h1 class="ts">
                                <span id="thread_subject">{{:subject}}</span>
                            </h1>
                            <span class="xg1">
                    </span>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table cellspacing="0" cellpadding="0" class="ad">
                    <tbody>
                    <tr>
                        <td class="pls">
                        </td>
                        <td class="plc">
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            
            {{if nextPage != null}}
            <div class="pgbtn"><a href="thread-{{:tid}}-{{:nextPage}}-1.html" hidefocus="true" class="bm_h">下一页 »</a></div>
            {{/if}}
            <div class="pgs mtm mbm cl">
                <div class="pg">
                    <label><input type="text" name="custompage" class="px" size="{{:totalPage}}" title="输入页码，按回车快速跳转"
                                  value="{{:pageNo}}"
                                  onkeydown="if(event.keyCode==13) {window.location='forum.php?mod=viewthread&amp;tid={{:tid}}&amp;extra=page%3D1&amp;page='+this.value;; doane(event);}">
                        <span title="共 {{:totalPage}} 页"> / {{:totalPage}} 页</span>
                    </label>
                    {{if nextPage != null}}
                    <a href="thread-{{:tid}}-2-1.html" class="nxt">下一页</a>
                    {{/if}}
                </div>
            </div>

            <script type="text/javascript">document.onkeyup = function (e) {
                keyPageScroll(e, 0, 1, 'forum.php?mod=viewthread&tid={{:tid}}', 1);
            }</script>
        </div>

        <div class="wp mtn">
            <!--[diy=diy3]-->
            <div id="diy3" class="area"></div><!--[/diy]-->
        </div>`)
    const postInThreadTmpl = $.templates(`
        <div id="post_{{:pid}}">
            <table id="pid{{:pid}}" class="plhin" summary="pid{{:pid}}" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                    <td class="pls" rowspan="2">
                        <div id="favatar{{:pid}}" class="pls favatar">
                            <div class="pi">
                                <div class="authi"><a href="space-uid-{{:authorid}}.html" target="_blank" class="xw1">{{:author}}</a>
                                </div>
                            </div>
                            <div class="p_pop blk bui card_gender_0" id="userinfo{{:pid}}"
                                 style="display: none; margin-top: -11px;">
                                <div class="m z">
                                    <div id="userinfo{{:pid}}_ma">
                                        <a href="space-uid-{{:pid}}.html" class="avtm" target="_blank">
                                            <img src="https://avatar.saraba1st.com/images/noavatar_middle.gif" 
                                            onerror="this.onerror=null;this.src='https://avatar.saraba1st.com/images/noavatar_middle.gif'">
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div class="avatar" onmouseover="showauthor(this, 'userinfo{{:pid}}')"><a
                                        href="space-uid-{{:authorid}}.html" class="avtm" target="_blank"><img
                                        src="https://avatar.saraba1st.com/images/noavatar_middle.gif"
                                        onerror="this.onerror=null;this.src='https://avatar.saraba1st.com/images/noavatar_middle.gif'"></a>
                                </div>
                            </div>

                            <p><em><a href="home.php?mod=spacecp&amp;ac=usergroup&amp;gid={{:gorupidid}}" target="_blank">{{:grouptitle}}</a></em>
                            </p>


                            <p><span id="g_up{{:pid}}" onmouseover="showMenu({'ctrlid':this.id, 'pos':'12!'});"></span></p>
                            <div id="g_up{{:pid}}_menu" class="tip tip_{{:position}}" style="display: none;">
                                <div class="tip_horn"></div>
                                <div class="tip_c">{{:grouptitle}}, 积分 0, 距离下一级还需 500 积分</div>
                            </div>


                            <p><span class="pbg2" id="upgradeprogress_{{:pid}}"
                                     onmouseover="showMenu({'ctrlid':this.id, 'pos':'12!', 'menuid':'g_up{{:pid}}_menu'});"><span
                                    class="pbr2" style="width:2%;"></span></span></p>
                            <div id="g_up{{:pid}}_menu" class="tip tip_{{:position}}" style="display: none;">
                                <div class="tip_horn"></div>
                                <div class="tip_c">{{:grouptitle}}, 积分 0, 距离下一级还需 500 积分</div>
                            </div>
                        </div>
                    </td>
                    <td class="plc">
                        <div class="pi">
                            <strong>
                                <a href="forum.php?mod=redirect&amp;goto=findpost&amp;ptid=29669{{:position}}&amp;pid={{:pid}}"
                                   id="postnum{{:pid}}" onclick="setCopy(this.href, '帖子地址复制成功');return false;">
                                    <em>{{:position}}</em><sup>#</sup></a>
                            </strong>
                            <div class="pti">
                                <div class="pdbt">
                                </div>
                                <div class="authi">
                                    <img class="authicn vm" id="authicon{{:pid}}"
                                         src="https://static.saraba1st.com/image/common/online_member.gif">
                                    <em id="authorposton{{:pid}}">发表于 {{:time}}</em>
                                    <span class="pipe">|</span>
                                    <a href="forum.php?mod=viewthread&amp;tid={{:tid}}&amp;page=1&amp;authorid={{:authorid}}"
                                       rel="nofollow">只看该作者</a>
                                </div>
                            </div>
                        </div>
                        <div class="pct">
                            <div class="pcb">
                                <div class="t_fsz">
                                    <table cellspacing="0" cellpadding="0">
                                        <tbody>
                                        <tr>
                                            <td class="t_f" id="postmessage_{{:pid}}">
                                                {{:message}}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div id="comment_{{:pid}}" class="cm">
                                </div>

                                <div id="post_rate_div_{{:pid}}"></div>
                            </div>
                        </div>

                    </td>
                </tr>
                <tr>
                    <td class="plc plm">
                    </td>
                </tr>
                <tr id="_postposition{{:pid}}"></tr>
                <tr>
                    <td class="pls"></td>
                    <td class="plc" style="overflow:visible;">
                        <div class="po hin">
                            <div class="pob cl">
                                <em>
                                    <a class="fastre"
                                       href="forum.php?mod=post&amp;action=reply&amp;fid=27&amp;tid={{:tid}}&amp;repquote={{:pid}}&amp;extra=page%3D1&amp;page=1"
                                       onclick="showWindow('reply', this.href)">回复</a>
                                </em>

                                <p>
                                    <a href="javascript:;" id="mgc_post_{{:pid}}" onmouseover="showMenu(this.id)"
                                       class="showmenu" style="display: none;"></a>
                                    <a href="javascript:;"
                                       onclick="showWindow('rate', 'forum.php?mod=misc&amp;action=rate&amp;tid={{:tid}}&amp;pid={{:pid}}', 'get', -1);return false;">评分</a>
                                    <a href="javascript:;"
                                       onclick="showWindow('miscreport{{:pid}}', 'misc.php?mod=report&amp;rtype=post&amp;rid={{:pid}}&amp;tid={{:tid}}&amp;fid=27', 'get', -1);return false;">举报</a>
                                </p>

                                <ul id="mgc_post_{{:pid}}_menu" class="p_pop mgcmn" style="display: none;">
                                </ul>
                                <script type="text/javascript" reload="1">checkmgcmn('post_{{:pid}}')</script>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr class="ad">
                    <td class="pls">
                    </td>
                    <td class="plc">
                    </td>
                </tr>
                </tbody>
            </table>
        </div>`)

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
                main();
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

    function replaceThreadContent() {
        // 整个帖子
     if ($('#messagetext:contains(内容审核中，即将开放)').html()||$('#messagetext:contains(你无权访问)').html()) {
            getThreadInfo()
                .then(info => {
                    info.pageNo = parseInt(pageNo);
                    info.totalPage = (parseInt(info.replies / 30)) + 1;
                    info.nextPage = info.pageNo < info.totalPage ? info.pageNo + 1 : null;
                    $('#wp').html(threadTmpl.render(info));
                    document.title = document.title.replace('提示信息', info.subject + ' - ' + info.fname);
                    return getThreadContent();
                })
                .then(data => {
                    const postList = $('#postlist');
                    data.list.forEach(post => {
                        const date = new Date(post.dateline * 1000);
                        post.time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
                        const content = postInThreadTmpl.render(post);
                        postList.append(content);
                    });
                })
                .catch(() => main({msg: "登录失效"}));
        }
        // 部分回复
        else {
            const blockedPost = $('.plhin:contains(作者被禁止或删除 内容自动屏蔽)');
            if (blockedPost.length === 0) return;

            getThreadContent()
                .then(data => {
                    const postList = data.list;
                    let pi = 0;
                    blockedPost.each((i, post) => {
                        const postId = post.id.substr(3);
                        let postData;
                        for (; pi < postList.length && (postData = postList[pi]).pid.toString() !== postId; pi++) ;

                        $(post).find('.pcb').html(postTmpl.render(postData));
                    });
                })
                .catch(() => main({msg: "登录失效"}));
        }
    }

    function getThreadInfo() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'POST',
                url: api + '/thread',
                data: {
                    sid: sid,
                    tid: tid
                },
                success: resp => handleRequest(resp, resolve, reject),
                error: function () {
                    localStorage.removeItem('app_sid');
                    reject();
                }
            });
        });
    }

    function getThreadContent() {
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'POST',
                url: api + '/thread/page',
                data: {
                    sid: sid,
                    tid: tid,
                    pageNo: pageNo
                },
                success: resp => handleRequest(resp, resolve, reject),
                error: function () {
                    localStorage.removeItem('app_sid');
                    reject();
                }
            });
        });
    }

    function handleRequest(resp, resolve, reject) {
        // content-type返回text/html可还行
        resp = typeof resp === 'string' ? JSON.parse(resp) : resp;
        const code = resp.code.toString();
        if (code.startsWith('50')) {
            localStorage.removeItem('app_sid');
            reject();
            return;
        }

        resolve(resp.data);
    }

    let sid, tid, pageNo;

    function getThreadId() {
        const pathname = window.location.pathname;
        if (pathname.startsWith('/2b/thread-')) {
            // [前缀, tid, pageNo, ...]
            const threadParams = location.pathname.split('-');
            tid = threadParams[1];
            pageNo = threadParams[2];
        } else if (pathname.startsWith('/2b/forum.php')) {
            const urlParams = new URLSearchParams(window.location.search);
            tid = urlParams.get('tid');
            pageNo = urlParams.get('page') || 1;
        }
    }

    function main(data) {
        data = data || {};

        getThreadId();
        if (!tid) return;

        sid = localStorage.getItem('app_sid');
        if (sid) {
            replaceThreadContent();
        } else {
            loginAndReplaceThreadContent(data);
        }
    }

    const text = $('#wp').text();
if (!(text.includes('作者被禁止或删除') || text.includes('内容审核中，即将开放')|| text.includes('你无权访问'))) {
        return;
    }

    main();
})();
