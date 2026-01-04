// ==UserScript==
// @name         NGA_PIDS
// @namespace    NGA_PIDS_fyy99
// @version      0.30
// @description  NGA统计PID
// @author       fyy99
// @match        *://ngabbs.com/*
// @match        *://bbs.nga.cn/*
// @match        *://nga.178.com/*
// @grant        none
// @note         0.13  修复中文无法检测的bug（发现了reply.content为false这种奇怪的情况）
// @note         0.14  新增点赞分；展示被忽略的pid
// @note         0.15  屏蔽回帖引用的内容
// @note         0.16  修复错误的跳转，屏蔽无声望版面，忽略锁定的回帖，优化默认设置
// @note         0.17  新增金币条件分
// @note         0.20  新增切换功能
// @note         0.21  增加一个内容条件分
// @note         0.30  优化编码逻辑
// @downloadURL https://update.greasyfork.org/scripts/448751/NGA_PIDS.user.js
// @updateURL https://update.greasyfork.org/scripts/448751/NGA_PIDS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const href = document.location.href;
    if (href.includes('read.php') && window.commonui.userInfo.reputations) {
        // 寻找TID标题部分
        const title_a = document.querySelector('#m_nav a.nav_link[href^=\\/read\\.php]');
        // 创建统计
        const recommend_span = document.createElement('span');
        recommend_span.innerHTML = '<span class="block_txt block_txt_c2" style="float:right;font-weight:normal;line-height:1.2em;margin-right:1em;cursor:pointer;" title="记录PID">PIDS</span>';
        recommend_span.addEventListener('click', () => {
            const $ = window._$;
            window.adminui.createadminwindow();
            const _ = window.adminui.w._;
            _.addContent(null);
            _.addTitle('记录/选择记录 主题内PID');
            _.addContent($('/form').$0('action','nuke.php?nga_pids=1','method','get','target','_blank','accept-charset','UTF-8')._.add(
                $('/input').$0('type','hidden','name','nga_pids','value',1),
                $('/input').$0('type','hidden','name','tid','value',window.__CURRENT_TID),
                $('/input').$0('type','hidden','name','reputation','value',Object.keys(window.commonui.userInfo.reputations)[0]),
                $('/span').$0('innerHTML','*将忽略所有锁定的回帖','class','silver'),$('/br'),$('/br'),
                $('/b').$0('innerHTML','[每人次数限制]'),$('/br'),
                $('/input').$0('type','radio','name','only','value',0),' 取加分最高一帖有效',$('/br'),
                $('/input').$0('type','radio','name','only','value',1,'checked',1),' 仅最先一帖有效',$('/br'),
                $('/input').$0('type','radio','name','only','value',2),' 仅最后一帖有效',$('/br'),
                $('/input').$0('type','radio','name','only','value',3),' 不限制重复回帖(均有效)',$('/br'),
                $('/br'),
                $('/b').$0('innerHTML','[编辑限制]'),$('/br'),
                $('/input').$0('type','radio','name','edit','value',0,'onclick',function(){showCondition(this);}),' 忽略所有编辑过的回帖',$('/br'),
                $('/input').$0('type','radio','name','edit','value',1,'onclick',function(){showCondition(this);}),' 忽略<时间戳>后编辑过的回帖',$('/br'),
                $('/span').$0('name','edit_','style','display:none')._.add(
                    '时间戳',$('/input').$0('type','number','name','edit_y','placeholder','时间戳(s)','style','width:12em','step','1','min','0'),$('/br'),
                ),
                $('/input').$0('type','radio','name','edit','value',2,'onclick',function(){showCondition(this);},'checked',1),' 不限制编辑回帖(均有效)',$('/br'),
                $('/br'),
                $('/b').$0('innerHTML','[加分条件]'),$('/br'),
                $('/span').$0('innerHTML','下列分数累加计算','class','silver'),$('/br'),
                $('/input').$0('type','checkbox','name','condition_default','onclick',function(){showCondition(this);}),' 基础参与分',$('/br'),
                $('/span').$0('name','condition_default_','style','display:none')._.add(
                    '任意回帖，加分为',$('/input').$0('type','number','name','condition_default_y','placeholder','-1500~1500','style','width:8em','step','1','min','-1500','max','1500'),$('/br'),
                ),
                $('/input').$0('type','checkbox','name','condition_score','onclick',function(){showCondition(this);}),' 赞数条件分',$('/br'),
                $('/span').$0('name','condition_score_','style','display:none')._.add(
                    '回帖最终点赞数(赞减踩)大于',$('/input').$0('type','number','name','condition_score_x','placeholder','数值','style','width:8em','step','1','min','-1000','max','1000'),'时，加分为',$('/input').$0('type','number','name','condition_score_y','placeholder','-1500~1500','style','width:8em','step','1','min','-1500','max','1500'),$('/br'),
                ),
                $('/input').$0('type','checkbox','name','condition_content','onclick',function(){showCondition(this);}),' 内容条件分',$('/br'),
                $('/span').$0('name','condition_content_','style','display:none')._.add(
                    '内容包含',$('/input').$0('type','text','name','condition_content_x','placeholder','关键词','style','width:8em'),'时，加分为',$('/input').$0('type','number','name','condition_content_y','placeholder','-1500~1500','style','width:8em','step','1','min','-1500','max','1500'),$('/br'),
                ),
                $('/input').$0('type','checkbox','name','condition_content2','onclick',function(){showCondition(this);}),' 内容条件分2',$('/br'),
                $('/span').$0('name','condition_content2_','style','display:none')._.add(
                    '内容包含',$('/input').$0('type','text','name','condition_content2_x','placeholder','关键词','style','width:8em'),'时，加分为',$('/input').$0('type','number','name','condition_content2_y','placeholder','-1500~1500','style','width:8em','step','1','min','-1500','max','1500'),$('/br'),
                ),
                $('/input').$0('type','checkbox','name','condition_lowreputation','onclick',function(){showCondition(this);}),' 低声望条件分',$('/br'),
                $('/span').$0('name','condition_lowreputation_','style','display:none')._.add(
                    '用户声望',$('/span').$0('innerHTML',`(${Object.keys(window.commonui.userInfo.reputations)[0]})`,'class','silver'),'小于',$('/input').$0('type','number','name','condition_lowreputation_x','placeholder','基础值','style','width:7em','step','1','min','-21000','max','21000'),'时，加分为',$('/input').$0('type','number','name','condition_lowreputation_y','placeholder','-1500~1500','style','width:8em','step','1','min','-1500','max','1500'),$('/br'),
                ),
                $('/input').$0('type','checkbox','name','condition_highreputation','onclick',function(){showCondition(this);}),' 高声望条件分',$('/br'),
                $('/span').$0('name','condition_highreputation_','style','display:none')._.add(
                    '用户声望',$('/span').$0('innerHTML',`(${Object.keys(window.commonui.userInfo.reputations)[0]})`,'class','silver'),'大于',$('/input').$0('type','number','name','condition_highreputation_x','placeholder','基础值','style','width:7em','step','1','min','-21000','max','21000'),'时，加分为',$('/input').$0('type','number','name','condition_highreputation_y','placeholder','-1500~1500','style','width:8em','step','1','min','-1500','max','1500'),$('/br'),
                ),
                $('/input').$0('type','checkbox','name','condition_lowmoney','onclick',function(){showCondition(this);}),' 低铜币条件分',$('/br'),
                $('/span').$0('name','condition_lowmoney_','style','display:none')._.add(
                    '用户(全部换算为)铜币小于',$('/input').$0('type','number','name','condition_lowmoney_x','placeholder','基础值','style','width:7em','step','1','min','0','max','1000000'),'时，加分为',$('/input').$0('type','number','name','condition_lowmoney_y','placeholder','-1500~1500','style','width:8em','step','1','min','-1500','max','1500'),$('/br'),
                ),
                $('/input').$0('type','checkbox','name','condition_roll','onclick',function(){showCondition(this);}),' 随机额外分',$('/br'),
                $('/span').$0('name','condition_roll_','style','display:none')._.add(
                    '以',$('/input').$0('type','number','name','condition_roll_x','placeholder','概率','style','width:8em','step','1','min','1','max','99'),'%的概率，加分为',$('/input').$0('type','number','name','condition_roll_y','placeholder','-1500~1500','style','width:8em','step','1','min','-1500','max','1500'),$('/br'),
                ),
                $('/br'),$('/br'),$('/button').$0('type','submit','innerHTML','开始处理(新窗口打开)'),$('/br'),
            ));
            function showCondition(e) {
                document.querySelector(`span[name=${e.name}_]`).style.display = ((e.type == 'radio' && e.value == 1) || (e.type == 'checkbox' && e.checked)) ? '' : 'none';
            }
            function verify(e) {
                console.log(e);
                return false;
            }
            _.show();
            // document.querySelector('form[action=nuke\\.php\\?nga_pids\\=1]').addEventListener('submit', () => {
            //     document.querySelector('input[name=condition_content_x]').value = encodeURI(document.querySelector('input[name=condition_content_x]').value);
            //     document.querySelector('input[name=condition_content2_x]').value = encodeURI(document.querySelector('input[name=condition_content2_x]').value);
            //     return true;
            // });
        });
        title_a.parentNode.insertBefore(recommend_span, title_a.nextElementSibling);
    } else if (href.includes('nuke.php?nga_pids=1')) {
        const result = {};
        const ignore_1 = [];
        const ignore_2 = [];
        const pars = decodeURI(window.location.search.substr(1));
        function get_qs(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = pars.match(reg);
            if(r != null) return r[2];
            return null;
        }
        function getRequest(page) {
            const http_request = new XMLHttpRequest();
            console.log(`https://${href.replace(/^.+?\/\//,'').replace(/\/.+$/,'')}/read.php?tid=${get_qs('tid')}&page=${page}&__output=11`);
            http_request.open('GET', `https://${href.replace(/^.+?\/\//,'').replace(/\/.+$/,'')}/read.php?tid=${get_qs('tid')}&page=${page}&__output=11`, true);
            http_request.send();
            http_request.onreadystatechange = () => {
                if (http_request.readyState != 4) {
                    return;
                }
                if (http_request.status != 200) {
                    // Break!
                    document.querySelector('#progress').innerHTML = '中断：网络连接失败，您可以刷新重试';
                    return;
                }
                const json = JSON.parse(http_request.responseText);
                const result_by_score = {};
                if (json.data.__PAGE != page) {
                    // Over!
                    document.querySelector('#progress').innerHTML = '已完成';
                    for (let uid in result) {
                        let high_score = 0;
                        let high_pid = 0;
                        if (result[uid].length > 1 && get_qs('only') != 3){
                            if (get_qs('only') == 1) {
                                // 仅最先一帖有效
                                result[uid] = result[uid].slice(0,1);
                            } else if (get_qs('only') == 2) {
                                // 仅最后一帖有效
                                result[uid] = result[uid].slice(-1);
                            }
                        }
                        for (let pair of result[uid]) {
                            if (pair[2] && get_qs('edit') != 2) {
                                if (get_qs('edit') == 0) {
                                    // 忽略所有编辑过的回帖
                                    continue;
                                } else if (get_qs('edit') == 1 && parseInt(pair[2]) > parseInt(get_qs('edit_y'))) {
                                    // 忽略<时间戳>后编辑过的回帖
                                    continue;
                                }
                            }
                            if (get_qs('only') == 0) {
                                // 取加分最高一帖有效
                                if (pair[1] > high_score) {
                                    high_score = pair[1];
                                    high_pid = pair[0];
                                }
                            } else {
                                if (!result_by_score.hasOwnProperty(pair[1])) {
                                    result_by_score[pair[1]] = [];
                                }
                                result_by_score[pair[1]].push(pair[0]);
                            }
                        }
                        if (get_qs('only') == 0) {
                            // 取加分最高一帖有效
                            if (!result_by_score.hasOwnProperty(high_score)) {
                                result_by_score[high_score] = [];
                            }
                            result_by_score[high_score].push(high_pid);
                        }
                    }
                    document.body.innerHTML += '<h4 class="til">输出结果<a href="javascript:void(0)" class="small_colored_text_btn" style="float: right;">切换</span></h4>';
                    for (let score in result_by_score) {
                        if (score == 0) {
                            continue;
                        }
                        document.body.innerHTML += `<b>${score}分档(${result_by_score[score].length})：</b><br><textarea style="width:99%;height:7em;">${result_by_score[score].sort()}</textarea><br><br>`;
                    }
                    if (ignore_1.length > 0) {
                        document.body.innerHTML += `<b>因异常type被忽略（如贴条），可以单独检查：</b><br><textarea style="width:99%;height:7em;">${ignore_1.sort()}</textarea><br><br>`;
                    }
                    if (ignore_2.length > 0) {
                        document.body.innerHTML += `<b>因异常content被忽略（未知情况），建议单独检查：</b><br><textarea style="width:99%;height:7em;">${ignore_2.sort()}</textarea><br><br>`;
                    }
                    const t_span = document.querySelector('a.small_colored_text_btn');
                    t_span.addEventListener('click', () => {
                        document.querySelectorAll('textarea').forEach(item => {
                            item.value = item.value.replace(/,/g, '\n');
                        });
                        t_span.style.display = "none";
                    });
                    return;
                }
                if (!json.data.__U.__REPUTATIONS.hasOwnProperty(get_qs('reputation'))) {
                    // Break!
                    document.querySelector('#progress').innerHTML = `中断：未发现声望${get_qs('reputation')}`;
                    return;
                }
                document.querySelector('#ok_num').innerHTML = json.data.__PAGE;
                document.querySelector('#all_num').innerHTML = Math.ceil(json.data.__ROWS / json.data.__R__ROWS_PAGE);
                for (const reply of json.data.__R) {
                    if (reply.pid == 0) {
                        // 主贴本体
                        continue;
                    }
                    if (!reply.hasOwnProperty('type')) {
                        // 奇怪的东西，比如贴条
                        ignore_1.push(reply.pid);
                        continue;
                    }
                    if (!reply.content) {
                        // 未知情况
                        ignore_2.push(reply.pid);
                        continue;
                    }
                    if (reply.type & 1024) {
                        // 锁1024 隐2
                        continue;
                    }
                    if (!result.hasOwnProperty(reply.authorid)) {
                        result[reply.authorid] = [];
                    }
                    let score = 0;
                    if (get_qs('condition_default')) {
                        score += parseInt(get_qs('condition_default_y'));
                    }
                    if (get_qs('condition_score') && (reply.score - reply.score_2) > parseInt(get_qs('condition_score_x'))) {
                        score += parseInt(get_qs('condition_score_y'));
                    }
                    if (get_qs('condition_content') && reply.content.replace(/\[quote]\[pid\=[\s\S]*?\[\/quote]/igm,'').includes(get_qs('condition_content_x'))) {
                        score += parseInt(get_qs('condition_content_y'));
                    }
                    if (get_qs('condition_content2') && reply.content.replace(/\[quote]\[pid\=[\s\S]*?\[\/quote]/igm,'').includes(get_qs('condition_content2_x'))) {
                        score += parseInt(get_qs('condition_content2_y'));
                    }
                    if (get_qs('condition_lowreputation') && parseInt(get_qs('condition_lowreputation_x')) > parseInt(json.data.__U.__REPUTATIONS[get_qs('reputation')][reply.authorid])) {
                        score += parseInt(get_qs('condition_lowreputation_y'));
                    }
                    if (get_qs('condition_highreputation') && parseInt(get_qs('condition_highreputation_x')) < parseInt(json.data.__U.__REPUTATIONS[get_qs('reputation')][reply.authorid])) {
                        score += parseInt(get_qs('condition_highreputation_y'));
                    }
                    if (get_qs('condition_lowmoney') && parseInt(get_qs('condition_lowmoney_x')) > parseInt(json.data.__U[reply.authorid].money)) {
                        score += parseInt(get_qs('condition_lowmoney_y'));
                    }
                    if (get_qs('condition_roll') && Math.floor((Math.random()*100)) < parseInt(get_qs('condition_roll_x'))) {
                        score += parseInt(get_qs('condition_roll_y'));
                    }
                    if (score == 0) {
                        continue;
                    }
                    const edit = reply.alterinfo.match('\\[E([0-9]+) 0 0]');
                    result[reply.authorid].push([reply.pid, score, edit ? edit[1] : 0]);
                }
                // Go on
                getRequest(page + 1);
            };
        }
        document.title = 'PID记录' + document.title;
        document.body.innerHTML = `<h2 id="page_title"><a href="${href.replace(/^.+?\/\//,'').replace(/\/.+$/,'')}">${href.replace(/^.+?\/\//,'').replace(/\/.+$/,'').toUpperCase()}</a> &nbsp; PID记录</h2>
<h4 class="til">工作进程</h4>
<span id='progress'>工作将在<span id='time'>5</span>s后开始，您可以在此期间内检查您设置的筛选条件</span>`;
        // 检查合法内容
        if (!['0','1','2','3'].includes(get_qs('only'))) {
            document.querySelector('#progress').innerHTML = '错误：异常的每人次数限制';
            return;
        }
        if (!['0','1','2'].includes(get_qs('edit'))) {
            document.querySelector('#progress').innerHTML = '错误：异常的编辑限制';
            return;
        }
        if (isNaN(parseInt(get_qs('tid')))) {
            document.querySelector('#progress').innerHTML = '错误：未知的TID';
            return;
        }
        if (isNaN(parseInt(get_qs('reputation')))) {
            document.querySelector('#progress').innerHTML = '错误：声望体系不合法';
            return;
        }
        if (get_qs('edit') == 1 && isNaN(parseInt(get_qs('edit_y')))) {
            document.querySelector('#progress').innerHTML = '错误：时间戳不合法';
            return;
        }
        if (get_qs('condition_default') && isNaN(parseInt(get_qs('condition_default_y')))) {
            document.querySelector('#progress').innerHTML = '错误：基础参与分不合法';
            return;
        }
        if (get_qs('condition_score') && isNaN(parseInt(get_qs('condition_score_x')))) {
            document.querySelector('#progress').innerHTML = '错误：赞数条件数值不合法';
            return;
        }
        if (get_qs('condition_score') && isNaN(parseInt(get_qs('condition_score_y')))) {
            document.querySelector('#progress').innerHTML = '错误：赞数条件分不合法';
            return;
        }
        if (get_qs('condition_content') && !get_qs('condition_content_x')) {
            document.querySelector('#progress').innerHTML = '错误：内容条件关键词不合法';
            return;
        }
        if (get_qs('condition_content') && isNaN(parseInt(get_qs('condition_content_y')))) {
            document.querySelector('#progress').innerHTML = '错误：内容条件分不合法';
            return;
        }
        if (get_qs('condition_content2') && !get_qs('condition_content2_x')) {
            document.querySelector('#progress').innerHTML = '错误：内容条件关键词2不合法';
            return;
        }
        if (get_qs('condition_content2') && isNaN(parseInt(get_qs('condition_content2_y')))) {
            document.querySelector('#progress').innerHTML = '错误：内容条件分2不合法';
            return;
        }
        if (get_qs('condition_lowreputation') && isNaN(parseInt(get_qs('condition_lowreputation_x')))) {
            document.querySelector('#progress').innerHTML = '错误：低声望条件范围不合法';
            return;
        }
        if (get_qs('condition_lowreputation') && isNaN(parseInt(get_qs('condition_lowreputation_y')))) {
            document.querySelector('#progress').innerHTML = '错误：低声望条件分不合法';
            return;
        }
        if (get_qs('condition_highreputation') && isNaN(parseInt(get_qs('condition_highreputation_x')))) {
            document.querySelector('#progress').innerHTML = '错误：高声望条件范围不合法';
            return;
        }
        if (get_qs('condition_highreputation') && isNaN(parseInt(get_qs('condition_highreputation_y')))) {
            document.querySelector('#progress').innerHTML = '错误：高声望条件分不合法';
            return;
        }
        if (get_qs('condition_lowmoney') && isNaN(parseInt(get_qs('condition_lowmoney_x')))) {
            document.querySelector('#progress').innerHTML = '错误：低铜币条件范围不合法';
            return;
        }
        if (get_qs('condition_lowmoney') && isNaN(parseInt(get_qs('condition_lowmoney_y')))) {
            document.querySelector('#progress').innerHTML = '错误：低铜币条件分不合法';
            return;
        }
        if (get_qs('condition_roll') && (isNaN(parseInt(get_qs('condition_roll_x'))) || parseInt(get_qs('condition_roll_x')) > 99 || parseInt(get_qs('condition_roll_x')) < 1)) {
            document.querySelector('#progress').innerHTML = '错误：随机概率不合法';
            return;
        }
        if (get_qs('condition_roll') && isNaN(parseInt(get_qs('condition_roll_y')))) {
            document.querySelector('#progress').innerHTML = '错误：随机额外分不合法';
            return;
        }
        if (!get_qs('condition_default') && !get_qs('condition_content') && !get_qs('condition_content2') && !get_qs('condition_score') && !get_qs('condition_lowreputation') && !get_qs('condition_highreputation') && !get_qs('condition_roll')) {
            document.querySelector('#progress').innerHTML = '错误：至少设置一种加分条件';
            return;
        }
        document.body.innerHTML += `<h4 class="til">加分条件</h4>
<ul>
<li><b style="color:gray">TID=${get_qs('tid')}</b> 中的回帖，排除带“锁定”状态的帖子</li>
<li>每人次数限制：${get_qs('only') == 3 ? '不限制重复回帖(均有效)' : get_qs('only') == 2 ? '仅最后一帖有效' : get_qs('only') == 1 ? '仅最先一帖有效' : '取加分最高一帖有效'}</li>
<li>编辑限制：${get_qs('edit') == 2 ? '不限制编辑回帖(均有效)' : get_qs('edit') == 1 ? `忽略 <b style="color:gray">&lt;${get_qs('edit_y')}&gt;</b> 即 <b style="color:gray">${new Date(get_qs('edit_y')*1000)}</b> 后编辑过的回帖` : '忽略所有编辑过的回帖'}</li>
<br>
<li ${get_qs('condition_default') ? '' : 'hidden'}>基础参与分 <b style="color:gray">${get_qs('condition_default_y')}</b> </li>
<li ${get_qs('condition_score') ? '' : 'hidden'}>点赞数大于 <b style="color:gray">${get_qs('condition_score_x')}</b> 时，赞数条件分 <b style="color:gray">${get_qs('condition_score_y')}</b> </li>
<li ${get_qs('condition_content') ? '' : 'hidden'}>内容包含 <b style="color:gray">${get_qs('condition_content_x')}</b> 时，内容条件分 <b style="color:gray">${get_qs('condition_content_y')}</b>，其中回帖引用的部分会被排除</li>
<li ${get_qs('condition_content2') ? '' : 'hidden'}>内容包含 <b style="color:gray">${get_qs('condition_content2_x')}</b> 时，内容条件分2 <b style="color:gray">${get_qs('condition_content2_y')}</b>，其中回帖引用的部分会被排除</li>
<li ${get_qs('condition_lowreputation') ? '' : 'hidden'}>用户 <b style="color:gray">声望(${get_qs('reputation')})</b> 小于 <b style="color:gray">${get_qs('condition_lowreputation_x')}</b> 时，低声望条件分 <b style="color:gray">${get_qs('condition_lowreputation_y')}</b> </li>
<li ${get_qs('condition_highreputation') ? '' : 'hidden'}>用户 <b style="color:gray">声望(${get_qs('reputation')})</b> 大于 <b style="color:gray">${get_qs('condition_highreputation_x')}</b> 时，高声望条件分 <b style="color:gray">${get_qs('condition_highreputation_y')}</b> </li>
<li ${get_qs('condition_lowmoney') ? '' : 'hidden'}>用户铜币小于 <b style="color:gray">${get_qs('condition_lowmoney_x')}</b> 时，低铜币条件分 <b style="color:gray">${get_qs('condition_lowmoney_y')}</b> </li>
<li ${get_qs('condition_roll') ? '' : 'hidden'}>以 <b style="color:gray">${get_qs('condition_roll_x')}</b> %的概率中奖时，随机额外分 <b style="color:gray">${get_qs('condition_roll_y')}</b> </li>
</ul>`;
        const interval = setInterval(() => {
            const time = document.querySelector('#time');
            const time_int = parseInt(time.innerHTML);
            if (time_int === 1) {
                document.querySelector('#progress').innerHTML = '正在处理中，请耐心等待 (第<span id="ok_num">-</span>页 / 共<span id="all_num">-</span>页)';
                clearInterval(interval);
                getRequest(1);
            } else {
                time.innerHTML = time_int - 1;
            }
        }, 1000);
    }
})();