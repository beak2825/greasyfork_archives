// ==UserScript==
// @name               nga_wd_helper2
// @name:zh            NGA版主助手2
// @name:zh-CN         NGA版主助手2
// @namespace          https://github.com/fyy99/nga_wd_helper2
// @description        https://shimo.im/docs/QhJd3dKVvWh9Cx9W
// @description:zh     https://shimo.im/docs/QhJd3dKVvWh9Cx9W
// @description:zh-CN  https://shimo.im/docs/QhJd3dKVvWh9Cx9W
// @license            MPL-2.0
// @author             fyy99
// @version            1.03
// @match              *://nga.178.com/*
// @match              *://ngabbs.com/*
// @match              *://bbs.nga.cn/*
// @match              *://g.nga.cn/read.php*
// @match              *://g.nga.cn/post.php*
// @match              *://g.nga.cn/thread.php*
// @match              *://g.nga.cn/nuke.php*
// @match              *://c.pc.qq.com/ios.html?*
// @run-at             document-end
// @note               v0.60 重构：移除高风险功能、优化刷新机制
// @note               v0.61 优化：调整个人主页用户备注区识别策略
// @note               v0.65 新增：批量操作属性
// @note               v0.66 修复：解决元素销毁重建导致原生“用户声望查询”功能不可用的问题
// @note               v0.67 新增：兼容iOS端Safari插件（https://apps.apple.com/cn/app/userscripts/id1463298887）
// @note               v0.68 优化：识别用户备注中的url
// @note               v0.70 优化：提升脚本稳定性
// @note               v0.71 新增：禁言状态上标可点击查看被操作记录、帖子阅读页的审核标记可点击解除
// @note               v0.72 修复：自动跳转
// @note               v0.75 修复：批量操作
// @note               v0.80 新增：[帖子被设为隐藏/无此用户]页面可查看相关记录
// @note               v0.85 新增：可查看热帖
// @note               v0.87 调整：不能点按解除绿审(屏蔽)
// @note               v0.88 修复：功能设置
// @note               v0.89 兼容：适配个人主页的一些小调整
// @note               v0.90 新增：thread/read页面审核标记均可点击解除
// @note               v0.91 优化：细节优化
// @note               v0.92 新增：取消删除时的强制理由
// @note               v0.93 优化：新增处罚记录的查询延时；移除：显示用户声望功能
// @note               v0.94 新增：移除移动端部分广告；修复：commonui.ucplink
// @note               v0.95 兼容：适配新前端样式
// @note               v0.96 修复：WD_setValue
// @note               v0.97 优化：备注URL匹配效果
// @note               v0.98 新增：还原并修复显示用户声望功能
// @note               v0.99 新增：个人中心标注CCQ
// @note               v1.00 修复：移动端楼主标签展示位置
// @note               v1.01 修复：贴条与热评的赞踩
// @note               v1.02 优化：去广告
// @note               v1.03 新增：处理腾讯中间页
// @inject-into        page
// @grant              unsafeWindow
// @grant              GM_info
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM.setValue
// @grant              GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/438912/nga_wd_helper2.user.js
// @updateURL https://update.greasyfork.org/scripts/438912/nga_wd_helper2.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // SB QQ
    const sbqq = location.search.match(/http.*/);
    if (sbqq) {
        console.log(sbqq);
        location.href = decodeURIComponent(sbqq[0]);
        return;
    }

    // compatible
    const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
    const $ = page.$;
    const _$ = page._$;

    // functions
    async function WD_getValue(key, def) {
        if (typeof GM_getValue == 'function') {
            return GM_getValue(key, def);
        } else if (typeof GM == 'object' && typeof GM.getValue == 'function') {
            return await GM.getValue(key, def);
        } else {
            return localStorage[key] || def;
        }
    }
    async function WD_setValue(key, value) {
        if (typeof GM_setValue == 'function') {
            return GM_setValue(key, value);
        } else if (typeof GM == 'object' && typeof GM.setValue == 'function') {
            return await GM.setValue(key, value);
        } else {
            return localStorage[key] = value;
        }
    }

    // variables
    const ajax_functions = [];

    // 读取设置
    const nga_wd_helper_jump = await WD_getValue('nga_wd_helper_jump', 'bbs.nga.cn');
    const nga_wd_helper_offs = await WD_getValue('nga_wd_helper_offs', 0);
    const nga_wd_helper_marklz = await WD_getValue('nga_wd_helper_marklz', 1);
    const nga_wd_helper_reputation = await WD_getValue('nga_wd_helper_reputation', '[7955747@晴风村]\n[61285727@手游瓜事件]\n[60204499@Vtuber综合讨论区]');

    // 自动跳转
    const nga_wd_helper_jump_targets = ['bbs.nga.cn', 'ngabbs.com', 'nga.178.com'];
    const nga_wd_helper_jump_target = nga_wd_helper_jump_targets.includes(nga_wd_helper_jump) ? nga_wd_helper_jump : 'bbs.nga.cn';
    if (!location.hostname.includes(nga_wd_helper_jump_target)) {
        location.href = location.href.replace(new RegExp(`(${nga_wd_helper_jump_targets.concat('g.nga.cn').join('|').replace(/\./g, '\\.')})`), nga_wd_helper_jump_target);
    }

    // match
    const commonui = page.commonui;
    if (!commonui || !commonui.parentAHerf) {
        if (['帖子被设为隐藏', '帐号权限不足', '帐号声望不足', '帖子审核未通过', '帖子正等待审核'].includes(document.title)) {
            const vp_link = document.getElementById('vp_link');
            if (vp_link) {
                vp_link.innerHTML = `[查看所需的权限/条件 - FID:${vp_link.href.match(/&id=(-?[0-9]+)/)[1]}]`;
                if (/tid=[0-9]+/.test(location.search)) {
                    vp_link.outerHTML += `<br><br><a href="/${location.search}" style="color:#7070ff">[查看帖子被操作记录]</a>`;
                }
            }
        } else if (document.title == '无此用户' && location.pathname == '/nuke.php' && /uid=[0-9]+/.test(location.search)) {
            document.title = '账号已注销';
            document.body.innerHTML = document.body.innerHTML.replace('无此用户', `<a href="/${location.search}" style="color:#7070ff">[账号已注销]</a>`);
        }
        return;
    }

    // 监听点击动作
    document.addEventListener('click', e => {
        let h = e.target || e.srcElement;
        if (!h) {
            return;
        }
        // 删除自动填写理由
        if (h.tagName == 'BUTTON' && h?.innerText == '确定' && h?.parentElement?.parentElement?.parentElement?.parentElement?.firstElementChild?.innerText?.includes('删除/移动/镜像') && h?.parentElement?.querySelector('input[placeholder=操作说明]')?.value === '') {
            h.parentElement.querySelector('input[placeholder=操作说明]').value = 'null';
        }
        // 替换禁言状态的点击效果
        if (h.tagName == 'SUP' && h.onclick) {
            h.onclick = () => {
                page.adminui.viewLog(h.previousSibling.href.match(/uid=([0-9]+)/)[1], null);
            };
            return;
        }
        // 确认是否a标签
        h = commonui.parentAHerf(h);
        if (!h || !h.href.startsWith('http')) {
            return;
        }
        const url = new URL(h.href);
        // 省略fid=0参数会导致翻页强行刷新
        if (!url.searchParams.has('stid') && !url.searchParams.has('fid') && url.pathname == '/thread.php') {
            url.searchParams.set('fid', 0);
            h.href = url.href;
        }
        // 存在ff参数会导致翻页强行刷新
        if (url.searchParams.has('ff')) {
            url.searchParams.delete('ff');
            h.href = url.href;
        }
        // order_by参数不符会导致翻页强行刷新
        if (h.className == ' uitxt1') {
            const url0 = new URL(location.href);
            if (url0.pathname == '/thread.php' && url0.searchParams.has('order_by')) {
                url.searchParams.set('order_by', url0.searchParams.get('order_by'));
                h.href = url.href;
            }
        }
        // 除连续翻页外，拒绝useloadread
        if (h._useloadread == 9) {
            const last_location_interval = setInterval(() => {
                if (document.querySelector(`a.invert[href*='read.php?'][href*='${h.href.match(/page=[0-9]+/)[0]}']`) || (h.title == '加载上一页' && h.href.match(/page=[0-9]+/)[0] == 'page=1' && document.querySelector(`a.invert[href*='read.php?']:not([href*='&page='])`))) {
                    clearInterval(last_location_interval);
                    ajax_functions.forEach(i => i());
                }
            }, 100);
            setTimeout(() => {
                clearInterval(last_location_interval);
            }, 5000);
            return;
        } else if (h._useloadread == 1) {
            h._useloadread = 0;
            e.cancelBubble = true;
            e.stopPropagation();
        }
    }, true);

    // 去广告
    'use strict';
    if (location.href.includes('/misc/adpage') && page.getJump) {
        page.getJump();
    }
    const no_ads = document.createElement('style');
    no_ads.type = 'text/css';
    no_ads.innerHTML = "div[style*='background:#444'],div[style*='background-color: rgb(68, 68, 68)'],td[style*='background-color: rgb(68, 68, 68)']{display:none;}";
    document.head.appendChild(no_ads);
    document.querySelectorAll('div > a > img[onload*=ngaAds]').forEach(img => {
        img.parentElement.parentElement.style.display = 'none';
    });

    // 用户快捷信息
    const uids = document.querySelectorAll('a.small_colored_text_btn.stxt.block_txt_c0.vertmod[name="uid"]');
    uids.forEach(uid => {
        uid.addEventListener('click', e => {
            commonui.ucplink(e, uid.innerText);
        });
    });
    commonui.ucplink = (e, uid) => {
        if (!commonui.ucplinko) {
            commonui.ucplinko = _$('/span','class','urltip2 urltip3','style','text-align:left;margin:0;');
            document.body.appendChild(commonui.ucplinko);
        }
        if (!uid || !commonui.userInfo.users[uid]) {
            commonui.ucplinko.innerHTML = '<nobr>找不到该用户的信息！</nobr>';
        } else {
            commonui.ucplinko.name = uid;
            commonui.ucplinko.innerHTML = `<nobr>铜币:${commonui.userInfo.users[uid].money}</nobr><br><nobr>威望:${commonui.userInfo.users[uid].rvrc / 10}</nobr>`;
            for (let reputation in commonui.userInfo.reputations) {
                commonui.ucplinko.innerHTML += `<br><nobr>声望(${reputation}):${commonui.userInfo.reputations[reputation][uid]}</nobr>`;
            }
            commonui.ucplinko.innerHTML += `<br><nobr>注册:${commonui.time2date(commonui.userInfo.users[uid].regdate)}</nobr><br><nobr>登录:${commonui.time2date(commonui.userInfo.users[uid].thisvisit)}</nobr>`;
        }
        page.tTip.showdscp(e, commonui.ucplinko);
        setTimeout(() => {
            if (!commonui.ucplinko.innerHTML.includes('<nobr>找不到') && commonui.ucplinko.name != uid) {
                return;
            }
            commonui.ucplinko.parentNode.removeChild(commonui.ucplinko);
            delete commonui.ucplinko;
        }, 4000);
    }

    // 设置中心
    commonui.mainMenu && commonui.mainMenu.addItemOnTheFly('WD助手', null, () => {
        const w = commonui.createadminwindow();
        w._.addContent(null);
        w._.addContent(
            _$('/span','style','float:right;transform:scale(0.9);color:#591804;opacity:0.4;','innerHTML',GM_info?.script?.version),
            '自动跳转到',_$('/br'),_$('/span','class','silver','innerHTML','该功能无法关闭，但您可以选择一个喜欢的域名<br>多个域名之间Cookie不共享，因此通过切域名来切账号'),_$('/br'),
            _$('/table')._.add(_$('/tbody')._.add(_$('/tr')._.add(
                _$('/td','style','padding-right:0.1em')._.add(_$('/label')._.add(_$('/input','type','radio','name','jump','value','bbs.nga.cn','checked',nga_wd_helper_jump_target == 'bbs.nga.cn'),'bbs.nga.cn')),
                _$('/td','style','padding-right:0.1em')._.add(_$('/label')._.add(_$('/input','type','radio','name','jump','value','ngabbs.com','checked',nga_wd_helper_jump_target == 'ngabbs.com'),'ngabbs.com')),
                _$('/td')._.add(_$('/label')._.add(_$('/input','type','radio','name','jump','value','nga.178.com','checked',nga_wd_helper_jump_target == 'nga.178.com'),'nga.178.com')),
            ))),_$('/br'),
            '功能开关',_$('/br'),_$('/span','class','silver','innerHTML','星号表示仅任区内生效'),_$('/br'),
            _$('/label')._.add(_$('/input','type','checkbox','name','offs','value',1,'checked',!(nga_wd_helper_offs & 1)),'启用[显示赞踩]*'),_$('/br'),
            _$('/label')._.add(_$('/input','type','checkbox','name','offs','value',16,'checked',!(nga_wd_helper_offs & 16)),'启用[连续翻页]'),_$('/br'),
            _$('/label')._.add(_$('/input','type','checkbox','name','offs','value',2,'checked',!(nga_wd_helper_offs & 2)),'启用[改动区优化]'),_$('/br'),
            _$('/label')._.add(_$('/input','type','checkbox','name','offs','value',4,'checked',!(nga_wd_helper_offs & 4)),'启用[显示主楼样式]'),_$('/br'),_$('/br'),
            '设置[标注楼主位置]',_$('/br'),
            _$('/table')._.add(_$('/tbody')._.add(_$('/tr')._.add(
                _$('/td','style','padding-right:0.3em')._.add(_$('/label')._.add(_$('/input','type','radio','name','marklz','value','0','checked',nga_wd_helper_marklz == 0),'关闭')),
                _$('/td','style','padding-right:0.3em')._.add(_$('/label')._.add(_$('/input','type','radio','name','marklz','value','1','checked',nga_wd_helper_marklz == 1),'方形')),
                _$('/td')._.add(_$('/label')._.add(_$('/input','type','radio','name','marklz','value','2','checked',nga_wd_helper_marklz == 2),'星型')),
            ))),_$('/br'),
            '显示用户声望',_$('/br'),_$('/span','class','silver','innerHTML','将用户声望显示到用户中心'),_$('/br'),_$('/span','class','silver','innerHTML','[用户ID@版块名]，每行一个'),_$('/br'),
            _$('/textarea','id','reputation_list','placeholder','例如：\n[7955747@晴风村]\n[61285727@手游瓜事件]\n[60204499@Vtuber综合讨论区]','rows',5,'cols',25,'value',nga_wd_helper_reputation.toString()),_$('/br'),_$('/br'),
            _$('/button','class','larger','type','button','innerHTML','确定','onclick',async () => {
                let offs = 0;
                w.querySelectorAll("input[type=checkbox][name=offs]:not(:checked)").forEach(i => {
                    offs |= i.value;
                });
                await WD_setValue('nga_wd_helper_offs', offs);
                await WD_setValue('nga_wd_helper_jump', w.querySelector("input[type=radio][name=jump]:checked").value);
                await WD_setValue('nga_wd_helper_marklz', w.querySelector("input[type=radio][name=marklz]:checked").value);
                await WD_setValue('nga_wd_helper_reputation', w.querySelector("textarea#reputation_list").value);
                location.reload();
            }),
        );
        w._.addTitle('[NGA版主助手]设置面板');
        w._.show();
    });

    // 权限检查
    if (!(page.__GP && page.__GP.greater && page.adminui)) { // WD+
        console.error('Without Permission!');
        return;
    }

    // ff参数会导致翻页强行刷新
    const url = new URL(location.href);
    if (url.searchParams.has('ff')) {
        url.searchParams.delete('ff');
        location.href = url.href;
    }
    if (location.pathname == '/') {
        const tid = location.search.match(/tid=([0-9]+)/);
        const uid = location.search.match(/uid=([0-9]+)/);
        if (tid) {
            page.adminui.viewLog(0, 0, 0, tid[1]);
        } else if (uid) {
            page.adminui.viewLog(uid[1]);
        }
    } else if (location.pathname == '/read.php') {
        // 审核标记可点
        if (page.__GP.admincheck & 2) {
            const ajax_function = () => {
                const floors = commonui.postArg.data;
                for (let i in floors) {
                    if (floors[i].subjectCC && !floors[i].subjectCC.nga_wd_helper_audit_pass) {
                        floors[i].subjectCC.nga_wd_helper_audit_pass = true;
                        floors[i].subjectCC.querySelectorAll('span[title*="审核"]').forEach(j => {
                            if (j.style.backgroundColor == 'rgb(128, 197, 128)') {
                                return;
                            }
                            j.title += ' 点击解除';
                            j.style.cursor = 'pointer';
                            j.addEventListener('click', () => {
                                j.parentNode.querySelectorAll('span[title*="审核"][title*="点击解除"]').forEach(k => {
                                    k.style.display = 'none';
                                });
                                page.__NUKE.doRequest({
                                    u: page.__API.setPost(`${page.__CURRENT_TID},${floors[i].pid}`, 0, 0, 0, 67109376, '', '', '', page.__CURRENT_FID),
                                    f: d => {
                                        if (!d?.error && d?.data?.[0]) {
                                            alert(d.data[0]);
                                        } else {
                                            alert('Request Failed!');
                                            console.log(d);
                                        }
                                    },
                                });
                            });
                        });
                    }
                }
            };
            ajax_function();
            ajax_functions.push(ajax_function);
        }
        // 批量操作(属性)
        if (page.__GP.admincheck & 2 && !$('nga_wd_helper_pids_add')) {
            // class/style
            page.__NUKE.addCss("span[id^=postdate][class*=stxt]{font-weight:bold;cursor:pointer;} span[id^=postdate][class*=stxt][style*=darkred]{color:orangered !important;text-decoration:underline;} span[id^=postdate][class*=stxt][style*=darkred]:before{content:'\\2714  '}");
            // select
            const getSelectedPids = tid => {
                const ids = [];
                document.querySelectorAll('span[id^=postdate][class*=stxt][style*=darkred]').forEach(pid => {
                    if (pid.parentNode && pid.parentNode.parentNode && pid.parentNode.parentNode.firstChild && pid.parentNode.parentNode.firstChild.id.startsWith('pid')) {
                        const pid_regexp = new RegExp('pid([0-9]+)Anchor').exec(pid.parentNode.parentNode.firstChild.id);
                        if (pid_regexp && pid_regexp[1]) {
                            ids.push(tid);
                            ids.push(pid_regexp[1]);
                        }
                    }
                });
                return ids;
            };
            // #nga_wd_helper_pids_bar
            const pids_bar = _$('/div','id','nga_wd_helper_pids_bar','class','right_','innerHTML','<table class="stdbtn" cellspacing="0"><tbody><tr></tr></tbody></table>');
            const postbbtm = $('postbbtm');
            postbbtm.style.clear = 'both';
            postbbtm.parentNode.insertBefore(pids_bar, postbbtm);
            // 全选
            const td_pids_all = _$('/td','innerHTML','<a href="javascript:void(0)" class="cell rep txtbtnx nobr silver" title="选中当前显示的所有帖子">全选</a>','onclick',() => {
                document.querySelectorAll('span[id^=postdate][class*=stxt]:not([style*=darkred])').forEach(span => page.__NUKE.fireEvent(span, 'click'));
            });
            pids_bar.querySelector('tr').appendChild(td_pids_all);
            // 反选
            const td_pids_inv = _$('/td','innerHTML','<a href="javascript:void(0)" class="cell rep txtbtnx nobr silver" title="反选当前显示的所有帖子">反选</a>','onclick',() => {
                document.querySelectorAll('span[id^=postdate][class*=stxt]').forEach(span => page.__NUKE.fireEvent(span, 'click'));
            });
            pids_bar.querySelector('tr').appendChild(td_pids_inv);
            // #nga_wd_helper_pids_del
            const td_pids_del = _$('/td','id','nga_wd_helper_pids_del','innerHTML','<a href="javascript:void(0)" class="cell rep txtbtnx nobr blue" title="批量设置帖子属性">帖子属性</a>','onclick',e => {
                const fid = page.__CURRENT_FID;
                const tid = page.__CURRENT_TID;
                const ids = getSelectedPids(tid);
                if (ids.length == 0) {
                    alert('没有任何有效的选中项目');
                    return;
                }
                commonui.setPost(e, tid, ids[1], null);
                const w = commonui.adminwindow;
                w._.addTitle('设置帖子属性(批量)');
                const warn_span = _$('/span','class','silver','innerHTML','<br>请确认设置无误 在运营/仲裁指导下使用<br>');
                const new_button = _$('/button','type','button','class','larger red','innerHTML','确定','onclick', () => {
                    if (confirm('即将进入批量操作\n请再次检查参数设置\n批量操作过程中不要关闭窗口或离开本页面\n操作完成后会有弹窗提示')) {
                        let pOn = 0;
                        let pOff = 0;
                        let x = w.querySelectorAll('div.div2 > div > form > div a');
                        for (let i = 0; i < x.length; i++) {
                            if (x[i].innerHTML == 'on') {
                                pOn |= parseInt(x[i].name, 10);
                            } else if (x[i].innerHTML == 'off') {
                                pOff |= parseInt(x[i].name, 10);
                            }
                        }
                        if (!pOn && !pOff) {
                            return;
                        }
                        const pm = w.querySelector('input[type=checkbox][name=pm]').checked ? 1 : '';
                        const info = w.querySelector('textarea[name=info]').value.replace(/^\s+|\s+$/, '');
                        const delay = w.querySelector('select[name=delay]').value;
                        let results = '';
                        const mas = function (ids) {
                            if (ids.length) {
                                const ids_i = ids.shift();
                                const ids_i2 = ids.shift();
                                page.__NUKE.doRequest({
                                    u: page.__API.setPost(`${ids_i},${ids_i2}`, 0, 0, pOn, pOff, pm, info, delay, fid),
                                    f: d => {
                                        if (!d?.error && d?.data?.[0]) {
                                            const result = `id:${ids_i} ${d.data[0]}`;
                                            results += result + '\n';
                                            console.log(result);
                                            mas(ids);
                                        } else {
                                            alert('Request Failed!');
                                            console.log(d);
                                        }
                                    },
                                });
                            } else {
                                alert(`批量操作完成\n\n${results}`);
                            }
                        };
                        mas(ids);
                    }
                });
                w._.__c.querySelector('button.larger').style.display = 'none';
                w._.addContent(warn_span);
                w._.addContent(new_button);
            });
            pids_bar.querySelector('tr').appendChild(td_pids_del);
        }
        // 赞/踩
        if ((page.__GP.admincheck & 2) && !(nga_wd_helper_offs & 1)) {
            const ajax_function = () => {
                document.querySelectorAll('.recommendvalue').forEach(r => {
                    if (!r.nga_wd_helper_lzmark2) {
                        r.nga_wd_helper_lzmark2 = true;
                        const pro = r?.title?.match('([0-9]+)支持')?.[1];
                        const con = r?.title?.match('([0-9]+)反对')?.[1];
                        if (pro && con) {
                            r.innerHTML = `${pro} / ${con}`;
                        }
                    }
                });
            };
            ajax_function();
            ajax_functions.push(ajax_function);
        }
        // 主题样式
        if (!(nga_wd_helper_offs & 4)) {
            const title_a = document.querySelector("#m_nav a.nav_link[href^='/read.php']");
            if (title_a) {
                const topicMiscVar = commonui.topicMiscVar;
                const topic_misc = commonui.postArg.def.tmBit1;
                title_a.style.padding = '0 10px';
                title_a.style.color = topic_misc & topicMiscVar._FONT_RED ? '#D00' : topic_misc & topicMiscVar._FONT_BLUE ? '#06B' : topic_misc & topicMiscVar._FONT_GREEN ? '#3D9F0E' : topic_misc & topicMiscVar._FONT_ORANGE ? '#c88100' : topic_misc & topicMiscVar._FONT_SILVER ? '#888' : '#000';
                title_a.style.fontWeight = topic_misc & topicMiscVar._FONT_B ? 'bold' : 'normal';
                title_a.style.fontStyle = topic_misc & topicMiscVar._FONT_I ? 'italic' : '';
                title_a.style.textDecoration = topic_misc & topicMiscVar._FONT_U ? 'line-through' : '';
            }
        }
        // 主题样式(推荐值)&标注楼主 - 需要request
        if (!(nga_wd_helper_offs & 4) || nga_wd_helper_marklz != 0) {
            const tid = page.__CURRENT_TID;
            page.__NUKE.doRequest({
                u: `/read.php?tid=${tid}&pid=0&opt=2&__output=1`,
                f: d => {
                    if (!d?.error && d?.data?.__T) {
                        // 主题样式
                        if (!(nga_wd_helper_offs & 4)) {
                            // 推荐值
                            const title_a = document.querySelector("#m_nav a.nav_link[href^='/read.php']");
                            if (title_a) {
                                title_a.appendChild(_$('/span','id','nga_wd_helper_title','innerHTML',` (${d.data.__T.recommend})`,'style','font-size:0.6em;font-weight:normal;'));
                            }
                        }
                        // 标注楼主
                        if (nga_wd_helper_marklz > 0) {
                            const authorid = d.data.__T.authorid;
                            if (authorid < 0) {
                                return;
                            }
                            const ajax_function = () => {
                                if (nga_wd_helper_marklz == 2) {
                                    document.querySelectorAll(`a[href*="nuke.php?func=ucp&uid=${authorid}"]`).forEach(lz => {
                                        if (!lz.nga_wd_helper_marked) {
                                            lz.nga_wd_helper_marked = true;
                                            const mark_span = _$('/span','class','red','innerHTML',' [★]');
                                            lz.appendChild(mark_span);
                                        }
                                    });
                                } else {
                                    const floors = commonui.postArg.data;
                                    for (let i in floors) {
                                        if (floors[i].pAid == authorid && !floors[i].nga_wd_helper_lzmark2) {
                                            floors[i].nga_wd_helper_lzmark2 = true;
                                            const mark_span = _$('/span','style','margin-right:0.4em;','innerHTML',` <a href="/read.php?tid=${page.__CURRENT_TID}&authorid=${authorid}" class="block_txt white nobr vertmod" style="background-color:#369;" title="由楼主发表 点此只看楼主发言">楼主</a>`);
                                            floors[i].subjectCC.querySelector('span:not(span[class])').insertBefore(mark_span, floors[i].subjectCC.querySelector('span:not(span[class])').firstElementChild);
                                        }
                                    }
                                }
                            }
                            ajax_function();
                            ajax_functions.push(ajax_function);
                        }
                    } else {
                        alert('Request Failed!');
                        console.log(d);
                    }
                },
            });
        }
        // 改动区优化
        if (!(nga_wd_helper_offs & 2)) {
            page.__NUKE.addCss('div[id^=postautokey]{display:none;}');
            const ajax_function = () => {
                document.querySelectorAll('span[id^=alertc]').forEach(alert => {
                    const floor = alert.id.substring(6);
                    const pAid = commonui.postArg.data[floor].pAid;
                    const tid = page.__CURRENT_TID;
                    const puns = alert.querySelectorAll('span.block_txt.block_txt_c3').forEach(pun => {
                        if (pun.innerHTML.includes('禁言') && pun.childElementCount == 1) {
                            const viewlog_a = _$('/a','class','block_txt block_txt_c0','innerHTML','?','href','javascript:void(0)','style','margin-left:0.3em;margin-right:-0.4em;','onclick',() => {
                                page.adminui.viewLog();
                                setTimeout(() => {
                                    const inputs = commonui.adminwindow.querySelectorAll('input');
                                    inputs[1].value = pAid;
                                    inputs[2].value = tid;
                                    commonui.adminwindow.querySelector('button:not([value])').click();
                                }, 300);

                            });
                            pun.appendChild(viewlog_a);
                        } else if ((page.__GP.admincheck & 2) && ((pun.innerHTML.startsWith('在') && pun.childElementCount == 0) || (pun.innerHTML.startsWith('<a') && pun.childElementCount == 1)) && pun.innerHTML.endsWith('修改') ) {
                            pun.appendChild(_$('/a','class','block_txt block_txt_c0','innerHTML','?','href','javascript:void(0)','style','margin-left:0.3em;margin-right:-0.4em;background:#B69EB9;','onclick',e => commonui.postBtn.d[30].on(e, commonui.postArg.data[floor])));
                        }
                    });
                });
            }
            ajax_function();
            ajax_functions.push(ajax_function);
        }
        // 操作菜单
        if (commonui.hasOwnProperty('postBtn') && commonui.postBtn.hasOwnProperty('all') && commonui.postBtn.all.hasOwnProperty('作者管理') && !commonui.postBtn.all['作者管理'].includes('nga_wd_helper_log1')) {
            commonui.postBtn.d.nga_wd_helper_log1 = {
                n1:'被操',n2:'被操作记录',n3:'被操作记录',on:(e,a) => page.adminui.viewLog(a.pAid,null),
            };
            commonui.postBtn.all['作者管理'].push('nga_wd_helper_log1');
            commonui.postBtn.d.nga_wd_helper_log2 = {
                n1:'操作',n2:'操作记录',n3:'操作记录',on:(e,a) => page.adminui.viewLog(null,a.pAid),
            };
            commonui.postBtn.all['作者管理'].push('nga_wd_helper_log2');
        }
    } else if (location.pathname == '/thread.php') {
        // 省略fid=0会导致翻页强行刷新
        const url = new URL(location.href);
        if (!url.searchParams.has('stid') && !url.searchParams.has('fid')) {
            url.searchParams.set('fid', 0);
            location.href = url.href;
        }
        // 审核标记可点
        if (page.__GP.admincheck & 2) {
            const ajax_function = () => {
                const topics = commonui.topicArg.data;
                for (let i in topics) {
                    if (topics[i][1] && !topics[i].nga_wd_helper_audit_pass) {
                        topics[i].nga_wd_helper_audit_pass = true;
                        topics[i][1].nextElementSibling.querySelectorAll('span[title*="审核"]').forEach(j => {
                            if (j.style.backgroundColor == 'rgb(128, 197, 128)') {
                                return;
                            }
                            j.title += ' 点击解除';
                            j.style.cursor = 'pointer';
                            j.addEventListener('click', () => {
                                j.parentNode.querySelectorAll('span[title*="审核"][title*="点击解除"]').forEach(k => {
                                    k.style.display = 'none';
                                });
                                page.__NUKE.doRequest({
                                    u: page.__API.setPost(`${topics[i][8]},0`, 0, 0, 0, 67109376, '', '', '', topics[i][7]),
                                    f: d => {
                                        if (!d?.error && d?.data?.[0]) {
                                            alert(d.data[0]);
                                        } else {
                                            alert('Request Failed!');
                                            console.log(d);
                                        }
                                    },
                                });
                            });
                        });
                    }
                }
            };
            ajax_function();
            ajax_functions.push(ajax_function);
        }
        // 批量操作(标题颜色)
        if (page.__GP.admincheck & 2) {
            // #nga_wd_helper_tids_color
            const td_tids_color = _$('/td','id','nga_wd_helper_tids_color','innerHTML',`<a href="javascript:void(0)" class="cell rep txtbtnx nobr blue" title="批量设置标题颜色">标题${page.__SETTING.width <= 550 ? '' : '颜色'}</a>`,'onclick', e => {
                page.adminui.colortopic(e, 1);
                const w = page.adminui.w;
                w._.addTitle('改变标题字体(批量)');
                const new_button = _$('/button','type','button','class','larger red','innerHTML','确定','onclick', () => {
                    const tids_checked = commonui.massAdmin.getChecked();
                    if (!tids_checked) {
                        return;
                    }
                    const tids = tids_checked.split(',');
                    if (confirm('即将进入批量循环操作\n请再次检查参数设置\n批量操作过程中不要关闭窗口或离开本页面\n操作完成后会有弹窗提示')) {
                        let set = '';
                        let opt = 0;
                        const f = w.querySelectorAll('div.div3 > div input');
                        for (let i = 0; i < 8; i++) {
                            if (f[i].checked) {
                                set += ',' + f[i].value;
                            }
                        }
                        for (let i = 9; i < 15; i++) {
                            if (f[i].checked) {
                                opt |= f[i].value;
                            }
                        }
                        let results = '';
                        const mas = tids => {
                            if (tids.length) {
                                const tid = tids.shift();
                                page.__NUKE.doRequest({
                                    u: { u: page.__API._base, a: { __lib: 'topic_color', __act: 'set', tid: tid, font: set, opt: opt, raw: 3, nga_wd_helper_tids_color: 1 } },
                                    f: d => {
                                        if (!d?.error && d?.data?.[0]) {
                                            const result = `tid:${tid} ${d.data[0]}`;
                                            results += result + '\n';
                                            console.log(result);
                                            mas(tids);
                                        } else {
                                            alert('Request Failed!');
                                            console.log(d);
                                        }
                                    },
                                });
                            } else {
                                alert(`批量操作完成\n\n${results}`);
                            }
                        };
                        mas(tids);
                    }
                });
                w._.__c.querySelector('button.larger').style.display = 'none';
                w._.addContent(new_button);
            });
            // 操作条是异步加载的（绑在一个onerror上），因此需要用interval来加载脚本
            const tids_color_interval = setInterval(() => {
                const ori_bar = document.querySelector('#m_fopts > div.w100 > div.module_wrap_sub > table > tbody > tr');
                if (ori_bar) {
                    clearInterval(tids_color_interval);
                    if (page.__SETTING.width <= 550) {
                        ori_bar.childNodes[2].childNodes[0].innerHTML = '移动…';
                    }
                    ori_bar.appendChild(td_tids_color);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(tids_color_interval);
            }, 3000);
        }
        // 热门帖
        if (page.__CURRENT_FID) {
            const td_hot = _$('/td','id','nga_wd_helper_td_hot','innerHTML',`<a href="javascript:void(0)" class="cell rep txtbtnx nobr silver" style="${page.__SETTING.width <= 550 ? '' : 'font-size:1.23em'}" title="查看热帖列表">热门${page.__SETTING.width <= 550 ? '' : '区'}</a>`,'onclick', () => {
                const w = commonui.createadminwindow();
                w._.addContent(null);
                const prefix = _$('/div','id','nga_wd_helper_hot_prefix','style','margin-bottom:7px');
                w._.addContent(prefix);
                const content = _$('/div','id','nga_wd_helper_hot_content');
                w._.addContent(content);
                w._.addTitle(`热帖列表(FID:${page.__CURRENT_FID})`);
                function loadHot(day) {
                    content.innerHTML = 'loading...';
                    document.getElementsByName('nga_wd_helper_radio_hot').forEach(i => {
                        i.disabled = true;
                    });
                    page.__NUKE.doPost({
                        xr: true,
                        u: `/app_api.php?__lib=subject&__act=hot&days=${day}&fid=${page.__CURRENT_FID}&page=1`,
                        f: d => {
                            document.getElementsByName('nga_wd_helper_radio_hot').forEach(i => {
                                i.disabled = false;
                            });
                            if (typeof d.result != 'object') {
                                content.innerHTML = '<span class="b red">网络异常，加载失败</span>';
                                return;
                            }
                            if (d.result.length == 0) {
                                content.innerHTML = ` <img src="${page.__IMGPATH}/post/smile/ac27.png"><b>竟然一条热帖都没有</b>`;
                                return;
                            }
                            let temp = '<table class="forumbox">';
                            let min, range;
                            if (d.result.length < 5) {
                                min = d.result.slice(-1)[0].replies;
                                range = d.result[0].replies - min;
                            } else {
                                d.result = d.result.slice(0, 30);
                                min = d.result.slice(-1)[0].replies * 0.1 + d.result.slice(-2, -1)[0].replies * 0.2 + d.result.slice(-3, -2)[0].replies * 0.3 + d.result.slice(-4, -3)[0].replies * 0.5;
                                range = d.result[0].replies * 0.1 + d.result[1].replies * 0.2 + d.result[2].replies * 0.3 + d.result[3].replies * 0.5;
                            }
                            for(let i = 0; i < d.result.length; i++) {
                                const t = d.result[i];
                                let className = '', cssText = '';
                                if (t.titlefont_api) {
                                    className = t.titlefont_api.color + (t.titlefont_api.bold ? ' b' : '');
                                    cssText = (t.titlefont_api.italic ? 'font-style:italic;' : '') + (t.titlefont_api.underline ? 'text-decoration:line-through;' : '');
                                }
                                temp += `<tr class="row${1 + i % 2}"><td class="c1" style="padding:0.25em 0.6em 0.25em 0.5em;text-align:right;white-space:nowrap;"><a style="color:rgba(255,0,0,${0.2 + 0.8 * Math.max(0, Math.min(1, (t.replies - min) / range))});" href="/read.php?tid=${t.tid}" target="_blank">${t.replies}</a></td><td class="c2" style="padding:0.25em;max-width:30em;"><a style="${cssText}" href="/read.php?tid=${t.tid}" class="${className}">${t.subject}</a></td><td class="c3" style="padding:0.25em;max-width:7em;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;"><a class="darkred" href="${t.authorid < 0 ? "javascript:alert('这是个匿名用户')" : ('/nuke.php?func=ucp&uid=' + t.authorid)}" title="${t.authorid < 0 ? '#ANONYMOUS#' : ('用户ID ' + t.authorid)}">${t.author}</a></td><td class="c4" style="padding:0.25em;white-space:nowrap;"><a class="silver" href="/read.php?tid=${t.tid}&page=e" title="${commonui.time2shortdate(t.postdate)}">${commonui.time2dis(t.postdate)}</a></td></tr>`;
                            }
                            temp += '</table>';
                            content.innerHTML = temp;
                            if (commonui.topicLinkTipLoad.length == 6) {
                                document.querySelectorAll('#nga_wd_helper_hot_content > table > tbody > tr > td.c2 > a').forEach(o => commonui.topicLinkTipLoad(o, null, null, null, null, true));
                            } else {
                                content.innerHTML += '*搭配<a class="teal" href="https://greasyfork.org/zh-CN/scripts/439428-nga-previewer" target="_blank">[NGA Previewer]</a>获得预览能力';
                            }
                        },
                    });
                }
                prefix._.add(
                    _$('/label')._.add(_$('/input','type','radio','name','nga_wd_helper_radio_hot','checked',true,'onchange',() => loadHot(1)),'1天内'),' ',
                    _$('/label')._.add(_$('/input','type','radio','name','nga_wd_helper_radio_hot','onchange',() => loadHot(3)),'3天内'),' ',
                    _$('/label')._.add(_$('/input','type','radio','name','nga_wd_helper_radio_hot','onchange',() => loadHot(7)),'7天内'),' ',
                    _$('/label')._.add(_$('/input','type','radio','name','nga_wd_helper_radio_hot','onchange',() => loadHot(14)),'14天内'),' ',
                    _$('/label')._.add(_$('/input','type','radio','name','nga_wd_helper_radio_hot','onchange',() => loadHot(30)),'30天内'),
                );
                w._.show();
                loadHot(1);
            });
            // 操作条是异步加载的，因此需要用interval来加载脚本
            const hot_interval = setInterval(() => {
                const ori_bar = document.querySelector('#m_pbtntop > div.w100 > div.right_ > table > tbody > tr');
                if (ori_bar) {
                    clearInterval(hot_interval);
                    if (page.__SETTING.width <= 550) {
                        ori_bar.childNodes[0].childNodes[0].innerHTML = '精华';
                    }
                    ori_bar.insertBefore(td_hot, ori_bar.firstChild);
                }
            }, 100);
            setTimeout(() => {
                clearInterval(hot_interval);
            }, 3000);
        }
    }
    if (location.pathname == '/read.php' || location.pathname == '/thread.php') {
        // 连续翻页
        if (!(nga_wd_helper_offs & 16)) {
            // 翻页按钮是异步加载的，因此需要用interval来加载脚本
            const next5_interval = setInterval(() => {
                const np = document.querySelector('a[title=加载下一页]');
                if (!np) {
                    return;
                }
                clearInterval(next5_interval);
                const next5_td = _$('/td','id','nga_wd_helper_next5','innerHTML','<a href="javascript:void(0);" title="连续翻页" class="uitxt1">&gt;&gt;</a>','onclick', () => {
                    next5_td.style.display = 'none';
                    page.nps = {
                        href: '',
                        timeout: 5,
                        page: 5,
                    };
                    const inv = setInterval(() => {
                        if (page.nps.page-- == 0) {
                            clearInterval(inv);
                            commonui.alert('完成：已经向后翻动5页', '翻页结束');
                            return;
                        }
                        if (document.readyState != 'complete') {
                            if (page.nps.timeout-- == 0) {
                                clearInterval(inv);
                                commonui.alert('中止：翻页超时(>5s)而提前结束', '翻页结束');
                            }
                            return;
                        }
                        const np0 = document.querySelector('a[title=加载下一页]');
                        if (!np0) {
                            clearInterval(inv);
                            commonui.alert('中止：已翻到最后一页', '翻页结束');
                            return;
                        }
                        if (np0.href == page.nps.href) {
                            if (page.nps.timeout-- == 0) {
                                clearInterval(inv);
                                commonui.alert('中止：翻页超时(>5s)而提前结束', '翻页结束');
                            }
                            return;
                        }
                        page.nps.href = np.href;
                        page.nps.timeout = 5;
                        page.__NUKE.fireEvent(np0, 'click');
                    }, 1000);
                });
                np.parentNode.parentNode.insertBefore(next5_td, np.parentNode.nextElementSibling);
            }, 100);
            setTimeout(() => {
                clearInterval(next5_interval);
            }, 3000);
        }
    } else if (location.pathname == '/nuke.php' && location.search.includes('func=ucp')) {
        // 个人中心页面是异步加载的，因此需要用interval来加载脚本
        // 判断CCQ
        function isCCQ(rep_name, rep_val) {
            if (['午夜骷髅党', '经典旧世'].includes(rep_name)) {
                if (rep_val < -2000) {
                    return true;
                }
                return false;
            }
            if (['PvP'].includes(rep_name)) {
                if (rep_val < -1500) {
                    return true;
                }
                return false;
            }
            if (['艾泽拉斯卫士', 'BigFoot客户端', '战士'].includes(rep_name)) {
                if (rep_val < -1000) {
                    return true;
                }
                return false;
            }
            if (['艾泽拉斯精英'].includes(rep_name)) {
                if (rep_val < -250) {
                    return true;
                }
                return false;
            }
            if (['威望'].includes(rep_name)) {
                if (rep_val <= -10) {
                    return true;
                }
                return false;
            }
            if (['61285727'].includes(rep_name)) {
                if (rep_val < 0) {
                    return true;
                }
                return false;
            }
            if (rep_val < -500) {
                return true;
            }
            return false;
        }
        // 标注CCQ声望
        const ccq_interval = setInterval(() => {
            const info_div = document.querySelector("#ucpuser_fame_blockContent div.info");
            if (!info_div) {
                return;
            }
            clearInterval(ccq_interval);
            const reputations = info_div.querySelectorAll("div.inlineblock");
            reputations.forEach(reputation => {
                const rep_name_label = reputation.querySelector('label');
                const rep_val_span = reputation.querySelector('span[style]');
                if (!rep_name_label || !rep_val_span) {
                    return;
                }
                const rep_name = rep_name_label.innerText;
                const rep_val = parseFloat(rep_val_span?.innerText.replace(':', ''));
                console.log(rep_name, rep_val);
                if (isCCQ(rep_name, rep_val)) {
                    rep_val_span.innerHTML = ` : <span style="color: red;">${rep_val}</span>`;
                }
            });
        }, 100);
        setTimeout(() => {
            clearInterval(ccq_interval);
        }, 5000);
        // 自定义用户声望
        const reputation_interval = setInterval(() => {
            const tid_list_a = document.querySelector("a.block_txt.block_txt_c2[href^='/thread.php?authorid=']");
            if (!tid_list_a) {
                return;
            }
            clearInterval(reputation_interval);
            const uid = tid_list_a.href.match(/authorid=([0-9]+)/);
            const reputation_span = document.querySelector("#ucpuser_fame_blockContent > div > span");
            if (uid && uid[1] && reputation_span) {
                const nga_wd_helper_reputation_ul = _$('/ul','id','nga_wd_helper_reputation','class','info','style','padding:0;margin:0;min-width:0;')
                reputation_span.appendChild(nga_wd_helper_reputation_ul);
                const regexp = /\[([0-9]+)@([^\[\]]+)]/g;
                let reputation_i;
                while (reputation_i = regexp.exec(nga_wd_helper_reputation)) {
                    const reputation_i_ = reputation_i;
                    page.__NUKE.doRequest({
                        xr: true,
                        u: {
                            u: page.__API._base,
                            a: { __lib: 'user_reputation', __act: 'get', uid: uid[1], user: reputation_i_[1], raw: '3', __output: '11', nga_wd_helper_reputation: 2 },
                        },
                        f: d => {
                            if (!d?.error && d?.data) {
                                console.log(d.data);
                                if (d.data?.[0] === null){
                                    nga_wd_helper_reputation_ul.innerHTML += `<div class="inlineblock" style="width: 250px;"><label><span title="用户${reputation_i_[1]}的声望">${reputation_i_[2]}</span></label><span style="color: gray;"> : 0</span></div>`;
                                } else if (d.data?.[0]){
                                    nga_wd_helper_reputation_ul.innerHTML += `<div class="inlineblock" style="width: 250px;"><label><span title="用户${reputation_i_[1]}的声望">${reputation_i_[2]}</span></label><span style="color: gray;"> : <span style="${isCCQ(reputation_i_[1], d.data[0].value) ? 'color: red' : ''};">${d.data[0].value}</span></span></div>`;
                                }
                            } else {
                                alert('Request Failed!');
                                console.log(d);
                            }
                        },
                    });
                }
            }
        }, 100);
        setTimeout(() => {
            clearInterval(reputation_interval);
        }, 5000);
        // 可跳转备注
        const remark_interval = setInterval(() => {
            const remarks = document.querySelectorAll("a[onclick*='__API.remarkDel']");
            if (remarks.length == 0) {
                return;
            }
            clearInterval(remark_interval);
            remarks.forEach(i => {
                const remark = i.previousSibling.nodeValue.trim();
                if ((remark.length >= 16 && /[0-9]/.test(remark) && /[A-Z]/.test(remark) && !/[^0-9A-Z]/.test(remark)) || remark.includes('放回')) {
                    return;
                }
                const remark_span = _$('/span','style','margin:0 0.4em');
                if (/http/i.test(remark)) {
                    //
                    // remark_span.innerHTML = `<a class="orange" href="${remark}" target="_blank">${remark}</a>`;
                    remark_span.innerHTML = remark.replace(/(((ht|f)tp(s?))\:\/\/)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)(\:[0-9]+)*(\/($|[a-zA-Z0-9\.\,\;\?\'\\\+&%\$#\=~_\-]+))*/g, '<a class="orange" href="$&" target="_blank">$&</a>');
                } else if (/tid/i.test(remark)) {
                    remark_span.innerHTML = remark.replace(/([1-9][0-9]{2,7})/g, '<a class="orange" href="read.php?tid=$1" target="_blank">[$1]</a>');
                } else if (/pid/i.test(remark)) {
                    remark_span.innerHTML = remark.replace(/([1-9][0-9]{2,8})/g, '<a class="orange" href="read.php?pid=$1" target="_blank">[$1]</a>');
                } else {
                    remark_span.innerHTML = remark.replace(/([1-9][0-9]{2,8})/g, '<a class="orange" href="nuke.php?func=ucp&uid=$1" target="_blank">[$1]</a>');
                }
                i.parentNode.removeChild(i.previousSibling);
                i.parentNode.insertBefore(remark_span, i);
            });
        }, 100);
        setTimeout(() => {
            clearInterval(remark_interval);
        }, 5000);
    }

    // style
    // 禁言状态可点
    page.__NUKE.addCss('sup.b.en_font{cursor:pointer;}');
})();