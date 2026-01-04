// ==UserScript==
// @name               NGA Previewer
// @name:zh            NGA Previewer
// @name:zh-CN         NGA Previewer
// @namespace          https://bbs.nga.cn/nuke.php?func=ucp&uid=42611843
// @description        提供NGA主题快捷预览功能
// @description:zh     提供NGA主题快捷预览功能
// @description:zh-CN  提供NGA主题快捷预览功能
// @license            MPL-2.0
// @author             fyy99
// @version            1.21
// @match              *://nga.178.com/*
// @match              *://ngabbs.com/*
// @match              *://bbs.nga.cn/*
// @match              *://g.nga.cn/*
// @run-at             document-body
// @note               v0.70 修复：FID=0的特殊帖子列表不允许拖拽操作；优化：更新解析效果
// @note               v0.80 修复：预览窗异常留存（pid=586087077）、部分浏览器不适配
// @note               v0.90 优化：快捷移动窗口支持回车提交、不允许原地移动、调整tag点击效果
// @note               v1.00 提升脚本稳定性
// @note               v1.10 新增：在正文较短时，可预览帖内图片
// @note               v1.20 优化：不同FID记录不同的移动目的地
// @note               v1.21 修复：适配二哥的新代码
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxFJREFUeNrElk1IVFEUx999mokQ9mFWULSxmqDImixsglpFCEJZhJuCWkhFMFCLEqE2yWxSMlpNmzaBBH1AUVAQROoQ9MJooyVFIX2YVjIVEdn0P8//jcPlvdFNdeA37915757//Tjn3GcKj7xiZkA9aAKbQQJU8tk4GAA94CrIeclCIdZREaEG0A5qvelZP2iD2K3pCs0CWdDM9jdwBYiDJ+At/18E1nBAu0AF/+8GLRDMFxNaCO6A1WACdIEMGI2dRxKrFZgq3LWCNCgBT8E2PHsXJSQz6aXICNgRrvtUllTbEhjZz+ugmmIpOzNfdckqkZQjIqNcp9q7Y0Rz7DtCX1n7yFcb38zlkpkMqe5l4ARHKXYI1PF+J2YxzxEboo+J0GdgGqyQYXR53BN3uS6B0+y4BJwBrxnq5+F4DM4qwHxnZl1steOZ8ZkntYyujCMiS1YOvnBAWxhdj8GFcOaBmYnrTQ5EW4Y+xXe9z2T0GMJudEnnRjCX0Xg7jCZsO2ckAifDaE0WPkJ0uZrVKH2KNZUy4z3miWsicJnVYJhLJtcPYAGQkHsTLm1gjuAq/p6p/uJzr2iUcmQek1GbrPk9sIrt9c5MOzkb2bc5FGx0fFifCckjmwjy8mf10jVGj1gfeAgWswrYaB0EB7BMfZHhHpjZ+P3k5pFrCXV/AxwFe8B2tZcrwqIamLOgvFhe+6zCtnZpe6nu9bLdBWtVGhiWnroI/9bnuM9S77FAajuuQnaD82yYoW5zZQx8jRCyPgdKeZ5sZHXoVi9JrdoPVjJ3ZoBf4DD3ZpDLeS4UShbGY44asR4Jhk0sppJcS4tW6sky9F61OyFwLCYQpKK/4iBTPte6n3+0TlGrK532Pjgsi3m3lT7Fd85n0rXxYZolKc6eszpY+xEZuZPHRZotOXULvsrgbtY2OU9qiogdBC94fwpOvjsiNfRREvrk0a5H08IAqOaexc1MytAysBVcjJhJrzr4WtzzSCzPgmnFHoAOUBUhJtF3H/z8s/GB6WCfanWU5//7x8k//dz6Kx+QvwUYACK+8/hArqmUAAAAAElFTkSuQmCC
// @grant              unsafeWindow
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM.setValue
// @grant              GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/439428/NGA%20Previewer.user.js
// @updateURL https://update.greasyfork.org/scripts/439428/NGA%20Previewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // compatible
    const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
    const $ = page.$;
    const _$ = page._$;

    // functions
    async function global_getValue(key, def) {
        key += '_' + page.__CURRENT_FID;
        if (typeof GM_getValue == 'function') {
            return GM_getValue(key, def);
        } else if (typeof GM == 'object' && typeof GM.getValue == 'function') {
            return await GM.getValue(key, def);
        } else {
            return localStorage[key] || def;
        }
    }
    async function global_setValue(key, value) {
        key += '_' + page.__CURRENT_FID;
        if (typeof GM_setValue == 'function') {
            return GM_setValue(key, value);
        } else if (typeof GM == 'object' && typeof GM.setValue == 'function') {
            return await GM.setValue(key, value);
        } else {
            return localStorage[key] || value;
        }
    }
    function getElementPagePosition(element) {
        let actualLeft = element.offsetLeft;
        let actualTop = element.offsetTop;
        let current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            actualTop += current.offsetTop + current.clientTop;
            current = current.offsetParent;
        }
        return {x: actualLeft, y: actualTop, y1: actualTop + element.offsetHeight};
    }

    // variables
    page.action_tid = 0;
    page.action_teid = 0;

    // match
    const commonui = page.commonui;
    if (!commonui || !commonui.topicLinkTipLoad) {
        return;
    }

    // tv
    const preview_tv = _$('/div','class','tv hidden');
    document.body.appendChild(preview_tv);
    const preview_tv_left = _$('/div','class','tv-half tv-left','innerHTML','锁隐',
                               'ondragenter',() => preview_tv_left.classList.add('tv-in'),
                               'ondragleave',() => preview_tv_left.classList.remove('tv-in'),
                               'ondragover',e => e.preventDefault(),
                               'ondrop',e => {
        e.preventDefault();
        preview_tv.classList.remove('show-up');
        preview_tv.classList.remove('show-down');
        setTimeout(() => {
            preview_tv.classList.add('hidden');
        }, 300);
        const o = $(page.action_teid);
        o.parentNode.style.opacity = '0.07';
        o.parentNode.style.pointerEvents = 'none';
        page.__NUKE.doRequest({
            u: page.__API.setPost(page.action_tid+',0',0,0,1026,0,'','','',page.__CURRENT_FID),
            f: d => {
                if (!d?.error && d?.data?.[0] && d.data[0].includes('操作成功')) {
                    o.parentNode.parentNode.firstElementChild.outerHTML = '<td class="c1" style="font-size:1.333em;color:#00eb0099;">√</td>';
                } else {
                    o.parentNode.parentNode.firstElementChild.outerHTML = '<td class="c1 b"><a style="font-size:1.333em;color:#ff0000b8;" href="javascript:void(0)">?</a></td>';
                    o.parentNode.parentNode.firstElementChild.firstElementChild.addEventListener('click', () => {
                        alert(JSON.stringify(d));
                    });
                }
            },
        });
    });
    preview_tv.appendChild(preview_tv_left);
    const preview_tv_right = _$('/div','class','tv-half tv-right','innerHTML','移动',
                                'ondragenter',() => preview_tv_right.classList.add('tv-in'),
                                'ondragleave',() => preview_tv_right.classList.remove('tv-in'),
                                'ondragover',e => e.preventDefault(),
                                'ondrop',async e => {
        e.preventDefault();
        preview_tv.classList.remove('show-up');
        preview_tv.classList.remove('show-down');
        setTimeout(() => {
            preview_tv.classList.add('hidden');
        }, 300);
        const o = $(page.action_teid);
        let preview_move_fid = await global_getValue('preview_move_fid', '');
        if (preview_move_fid == o.fid) {
            preview_move_fid = '';
        }
        let preview_move_tid = await global_getValue('preview_move_tid', '');
        if (preview_move_tid == o.stid) {
            preview_move_tid = '';
        }
        const moveTowords = page.commonui.createadminwindow();
        moveTowords._.addContent(null);
        moveTowords._.addTitle('移动到何处');
        moveTowords._.addContent(
            _$('/input','id','movebyfid','placeholder','版面ID','maxlength','20','value',preview_move_fid),
            _$('/br'),
            _$('/input','id','movebytid','placeholder','或合集ID','maxlength','20','value',preview_move_tid),
            _$('/br'),
            _$('/button','id','movebtn','innerHTML','确定','class','larger','type','button','onclick',function () {
                if (!($('movebyfid').value || $('movebytid').value) || this.disabled) {
                    return;
                }
                this.disabled = true;
                this.style.cursor = 'wait';
                const fid = $('movebyfid').value;
                const tid = $('movebytid').value;
                o.parentNode.style.opacity = '0.07';
                o.parentNode.style.pointerEvents = 'none';
                page.__NUKE.doRequest({
                    u: page.__API.topicMove2(page.action_tid,fid,'','',116736,'',tid),
                    f: async d => {
                        moveTowords._.hide();
                        if (!d?.error && d?.data?.[0] && d.data[0].includes('操作成功')) {
                            o.parentNode.parentNode.firstElementChild.outerHTML = '<td class="c1" style="font-size:1.333em;color:#00eb0099;">√</td>';
                            await global_setValue('preview_move_fid', fid);
                            await global_setValue('preview_move_tid', tid);
                        } else {
                            o.parentNode.parentNode.firstElementChild.outerHTML = '<td class="c1 b"><a style="font-size:1.333em;color:#ff0000b8;" href="javascript:void(0)">?</a></td>';
                            o.parentNode.parentNode.firstElementChild.firstElementChild.addEventListener('click', () => {
                                alert(JSON.stringify(d));
                            });
                        }
                    },
                });
            }),
            _$('/br'),
        );
        Array.prototype.forEach.call(document.querySelectorAll('#m_nav a.nav_link[href^="/thread.php?fid="], #m_nav a.nav_link[href^="/thread.php?stid="]'), i => {
            const sub_id = i.href.match(/id=(-?[0-9]+)/)[1];
            const sub_t = i.href.includes('stid');
            const sub_name = i.innerText.replace(/\s/g, '');
            if (o.stid == sub_id || (o.stid == '' && o.fid == sub_id)) {
                moveTowords._.addContent(
                    _$('/span','class',sub_t ? 'teal' : '','innerHTML',sub_name+'(当前)'),
                );
            } else {
                moveTowords._.addContent(
                    _$('/a','class',sub_t ? 'b teal' : 'b','href','javascript:void(0)','innerHTML',sub_name,'onclick',() => {
                        $(sub_t ? 'movebytid' : 'movebyfid').value = sub_id;
                        $(sub_t ? 'movebyfid' : 'movebytid').value = '';
                        $(sub_t ? 'movebytid' : 'movebyfid').focus();
                    }),
                );
            }
            moveTowords._.addContent(_$('/br'));
        })
        for (let id in page.__ALL_FORUM_DATA) {
            const sub_id = page.__ALL_FORUM_DATA[id][0];
            if (typeof sub_id == 'number') { // 避免重复出现当前版面
                continue;
            }
            const sub_t = id.includes('t');
            const sub_name = page.__ALL_FORUM_DATA[id][1];
            if (o.stid == sub_id || (o.stid == '' && o.fid == sub_id)) {
                moveTowords._.addContent(
                    _$('/span','class',sub_t ? 'teal' : '','innerHTML',sub_name+'(当前)'),
                );
            } else {
                moveTowords._.addContent(
                    _$('/a','class',sub_t ? 'b teal' : 'b','href','javascript:void(0)','innerHTML',sub_name,'onclick',() => {
                        $(sub_t ? 'movebytid' : 'movebyfid').value = sub_id;
                        $(sub_t ? 'movebyfid' : 'movebytid').value = '';
                        $(sub_t ? 'movebytid' : 'movebyfid').focus();
                    }),
                );
            }
            moveTowords._.addContent(_$('/br'));
        }
        const temp_fuc = () => {
            commonui.eachForumViewHis((a,b,c) => {
                if (b[2] !== 2) {
                    return;
                }
                const sub_id = b[5] || b[0];
                const sub_t = b[5] ? true : false;
                const sub_name = b[6] || b[1];
                if (o.stid == sub_id || (o.stid == '' && o.fid == sub_id)) {
                    moveTowords._.addContent(
                        _$('/span','class',sub_t ? 'teal' : '','innerHTML',sub_name+'(当前)'),
                    );
                } else {
                    moveTowords._.addContent(
                        _$('/a','class',sub_t ? 'b teal' : 'b','href','javascript:void(0)','innerHTML',sub_name,'onclick',() => {
                            $(sub_t ? 'movebytid' : 'movebyfid').value = sub_id;
                            $(sub_t ? 'movebyfid' : 'movebytid').value = '';
                            $(sub_t ? 'movebytid' : 'movebyfid').focus();
                        }),
                    );
                }
                moveTowords._.addContent(_$('/br'));
            });
        };
        if (Object.keys(page.__ALL_FORUM_DATA).length > 1) {
            moveTowords._.addContent(
                _$('/a','class','silver','href','javascript:void(0)','innerHTML','⊕ 展开收藏夹','onclick',function () {
                    this.style.display = 'none';
                    moveTowords._.addContent(_$('/hr'));
                    temp_fuc();
                }),
            );
        } else {
            moveTowords._.addContent(_$('/hr'));
            temp_fuc();
        }
        moveTowords._.show(e);
        moveTowords.addEventListener('keyup', e => {
            const event = e || page.event;
            if ((event.which || event.keyCode || event.charCode) == 13) {
                page.__NUKE.fireEvent($('movebtn'), 'click');
            }
        });
        if ($('movebytid').value) {
            $('movebytid').focus();
        } else {
            $('movebyfid').focus();
        }
    });
    preview_tv.appendChild(preview_tv_right);
    const preview_tv_inner = _$('/div','class','tv-inner');
    preview_tv.appendChild(preview_tv_inner);

    // topicLinkTipLoad（lite参数供其他脚本调用时传递，可提供基本的预览功能）
    commonui.topicLinkTipLoad = (o, fid, stid, cfids, cstid, lite) => {
        const _tid = o.href.match(/tid=([0-9]+)/);
        if (!_tid) {
            // 带有[jumpurl]的固定首位帖
            return;
        }
        const tid = _tid[1];
        o.addEventListener('mouseenter', e => {
            if (!o.content) {
                o.preload = setTimeout(() => {
                    page.__NUKE.doRequest({
                        u: '/read.php?pid=0&opt=2&__output=1&tid=' + tid,
                        f: d => {
                            if (!d?.error && d?.data?.__R?.[0] && d.data.__R[0].content) {
                                const r = d.data.__R[0];
                                // 非标准表情
                                const content = r.content.toString().replace(/\[img]http:\/\/[0-9a-z\.]+\/attachments\/mon_201[1-4](0[1-9]|1[0-2])\/[^\s\[]+\[\/img]/g, '[表情]').replace(/\[img]http:\/\/img4.nga.cn\/[^\s\[]+\[\/img]/g, '[表情]');
                                // 正文
                                o.content = content
                                    .replace(/\[img-?\d{0,3}].+?\[\/img]/gi, '【图片】')
                                    .replace(/(\s|<br\/>)*\[flash(=.+)?].+?\[\/flash](\s|<br\/>)*/gi, '<br/>【视频】<br/>')
                                    .replace(/(\s|<br\/>)*\[table].+?\[\/table](\s|<br\/>)*/gi, '<br/>【表格】<br/>')
                                    .replace(/(\s|<br\/>)*\[collapse].+?\[\/collapse](\s|<br\/>)*/gi, '<br/>【折叠】<br/>')
                                    .replace(/(\s|<br\/>)*\[collapse=(.+?)].+?\[\/collapse](\s|<br\/>)*/gi, '<br/>【折叠：$2】<br/>')
                                    .replace(/\[url].+?\[\/url]/gi, '【链接】')
                                    .replace(/\[url=.+?](.+?)\[\/url]/gi, '【链接：$1】')
                                    .replace(/\[(color|align|font)=[a-z]+]/gi, '')
                                    .replace(/\[size=[0-9]+%?]/gi, '')
                                    .replace(/\[\/(color|align|font|size)]/gi, '')
                                    .replace(/\[\/?(b|u|i|del|h|l|r|quote|list|\*)]/gi, '')
                                    .replace(/\[s:(ac|a2|pst|dt|pg):(.+?)]/g, '[$2]')
                                    .replace(/\[s::(.+?)]/g, '[表情]')
                                    .replace(/={6,}/g, '')
                                    .replace(/(&|&amp;)#[0-9]+;/g, ' ')
                                    .replace(/(\s|<br\/>)*【图片】((\s|<br\/>)*【图片】)+(\s|<br\/>)*/g, k => `<br/>【图片*${k.split('【图片】').length - 1}】<br/>`)
                                    .replace(/(<br\/>)+/g, '<br/>')
                                    .replace(/^(\s|<br\/>)+|(\s|<br\/>)+$/g, '') + ' ';
                                // 图片
                                o.img = '';
                                const match = content.match(/\[img-?\d{0,3}](.+?)\[\/img]/);
                                if (match) {
                                    o.img = match[1].startsWith('./mon_') ? `//${page.__ATTACH_BASE_VIEW}/attachments/${match[1].slice(2).replace(/\.(medium|thumb|thumb_s|thumb_ss)\.jpg$/, '')}.medium.jpg` : match[1];
                                } else if (typeof r.attachs == 'object') {
                                    for (let i in r.attachs) {
                                        if (r.attachs[i].type == 'img' && r.attachs[i].attachurl) {
                                            o.img = `//${page.__ATTACH_BASE_VIEW}/attachments/${r.attachs[i].attachurl}.medium.jpg`;
                                            break;
                                        }
                                    }
                                }
                            } else {
                                o.content = '<b>错误：</b>加载失败，可能是权限不足或网络异常';
                            }
                            if (o.previewGo) {
                                o.previewGo();
                            }
                        },
                    });
                }, 150);
            }
            o.preview = setTimeout(() => {
                const temp = () => {
                    if (o.getBoundingClientRect().height === 0) {
                        return;
                    }
                    const isTop = o.getBoundingClientRect().top > 180;
                    o.previewGo = false;
                    o.style.cursor = 'pointer';
                    const pos = getElementPagePosition(o);
                    preview_tv.style.left = `${pos.x - 3}px`;
                    preview_tv.style.top = isTop ? `${pos.y - 195 - 4}px` : `${pos.y1 + 3}px`;
                    preview_tv_inner.innerHTML = o.content;
                    preview_tv.classList.remove('hidden');
                    if (o.img) {
                        if (o.content.replace(/\s|1|紫薯|布丁|字数|补丁|zsbd|zs|rt|如图/g, '') == '【图片】') {
                            preview_tv_inner.innerHTML = `<img src="${o.img}" style="top:0;bottom:0;" alt="图片加载失败">`;
                        } else {
                            preview_tv.style.visibility = 'hidden';
                            if (preview_tv_inner.clientHeight < 90) {
                                preview_tv_inner.innerHTML += `<img src="${o.img}" style="max-height:${185 - preview_tv_inner.clientHeight}px;" onerror="this.style.display='none'">`;
                            }
                            preview_tv.style.visibility = '';
                        }
                    }
                    setTimeout(() => {
                        preview_tv.classList.add('show-' + (isTop ? 'up' : 'down'));
                    }, 5);
                };
                if (!o.content) {
                    o.style.cursor = 'wait';
                    o.previewGo = temp;
                } else {
                    temp();
                }
            }, 350);
        });
        o.addEventListener('mouseleave', e => {
            const temp = () => {
                o.style.cursor = 'pointer';
                o.leavePause = false;
                o.leaveContinue = false;
                o.previewGo = false;
                clearTimeout(o.preview);
                clearTimeout(o.preload);
                preview_tv.classList.remove('show-up');
                preview_tv.classList.remove('show-down');
                setTimeout(() => {
                    preview_tv.classList.add('hidden');
                }, 300);
            };
            if (e.buttons) {
                const timeout = setTimeout(() => {
                    temp();
                }, 50);
                o.leavePause = () => {
                    clearTimeout(timeout);
                    o.leavePause = false;
                    o.leaveContinue = temp;
                };
            } else {
                temp();
            }
        });
        if (lite) {
            return;
        }
        o.draggable = true;
        if (page.__CURRENT_FID && page.__GP.admincheck) {
            o.addEventListener('dragstart', () => {
                if (o.leavePause) {
                    o.leavePause();
                }
                page.action_tid = tid;
                page.action_teid = o.id;
                preview_tv.classList.add('tv-dragging');
            });
            o.addEventListener('dragend', () => {
                if (o.leaveContinue) {
                    o.leaveContinue();
                }
                preview_tv_left.classList.remove('tv-in');
                preview_tv_right.classList.remove('tv-in');
                preview_tv.classList.remove('tv-dragging');
            });
        }
        o.stid = stid || '';
        o.fid = fid || '';
        // js_forum.js commonui.topicLinkTipLoad
        let c = page.__TOPIC_KEY_COLOR ? page.__TOPIC_KEY_COLOR : false
        if (typeof c == 'string') {
            c = c.split("\t");
            const cc = {};
            for (let i = 0; i < c.length; i += 2) {
                if (c[i + 1]) {
                    const g = c[i].split(',');
                    g[0] = g[0] | 0;
                    g[2] = g[1];
                    g[1] = (g[1] & 16370) >> 4;
                    for (let j = 1; j <= 10; j++) {
                        if (g[1] & 1) {
                            g[1] = j;
                            break;
                        }
                        g[1] = g[1] >> 1;
                    }
                    cc[c[i + 1]] = g;
                }
            }
            c = cc;
        }
        const key = o.innerHTML.match(/^ ?(\[.{1,10}?]) ?(\[.{1,10}?])?(.+)$/);
        if (key) {
            o.innerHTML = `<a class='t_key ${c && c[key[1]] ? 't_k_c' + c[key[1]][1] : 'silver'}' href='/thread.php?key=${encodeURIComponent(key[1])}${(cstid ? '&stid=' + cstid : ('&fid=' + (cfids ? cfids : fid)))}' target="_blank">${key[1]}</a>`;
            if (key[2]) {
                o.innerHTML += `<a class='t_key ${c && c[key[2]] ? 't_k_c' + c[key[2]][1] : 'silver'}' href='/thread.php?key=${encodeURIComponent(key[2])}${(cstid ? '&stid=' + cstid : ('&fid=' + (cfids ? cfids : fid)))}' target="_blank">${key[2]}</a>`;
            }
            o.innerHTML += `<span style='padding-left:0.25em;'>${key[3].trimStart()}</span>`;
        }
    }
    document.addEventListener('click', () => {
        preview_tv.classList.add('hidden');
        preview_tv.classList.remove('show-up');
        preview_tv.classList.remove('show-down');
        preview_tv_left.classList.remove('tv-in');
        preview_tv_right.classList.remove('tv-in');
        preview_tv.classList.remove('tv-dragging');
    }, true);

    // style
    page.__NUKE.addCss(`
.t_k_c1:hover { color:#8080C5;background-color: #a8a8d726; }
.t_k_c2:hover { color:#C58080;background-color: #d19b9b26; }
.t_k_c3:hover { color:#80C080;background-color: #a7d3a726; }
.t_k_c4:hover { color:#80C0C0;background-color: #a7d3d326; }
.t_k_c5:hover { color:#FF8AC9;background-color: #ffb1db26; }
.t_k_c6:hover { color:#C080C0;background-color: #cd9acd26; }
.t_k_c7:hover { color:#D0A996;background-color: #dcbfb126; }
.t_k_c8:hover { color:#909090;background-color: #aeaeae26; }
.t_k_c9:hover { color:#FFA280;background-color: #ffbfa726; }
.t_key.silver:hover { color:#888;background-color:#a5a5a526; }
.t_key:hover { text-decoration:underline double; }
.hidden {
    display: none!important;
    z-index: 0!important;
}
div.tv {
    position: absolute;
    z-index: 10002;
    padding: 0;
    margin: 0;
    width: 380px;
    height: 195px;
    font-size: 12px;
    line-height: 17px;
    color: #18191c;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 0 15px rgb(0 0 0 / 15%);
    cursor: default;
    opacity: 0;
    overflow: hidden;
    -webkit-transition: 0.3s;
    transition: 0.3s;
}
div.tv.show-up {
    opacity: 0.975!important;
    -webkit-transform: translateY(-4px);
    transform: translateY(-4px);
}
div.tv.show-down {
    opacity: 0.975!important;
    -webkit-transform: translateY(4px);
    transform: translateY(4px);
}
div.tv-half {
    display: none;
    top: 0;
    position: absolute;
    width: 190px;
    height: 195px;
    line-height: 195px;
    font-size: 24px;
    opacity: 0.7;
    text-align: center;
    -webkit-transition: 0.3s;
    transition: 0.3s;
}
div.tv-dragging div.tv-half {
    display: block!important;
    z-index: 10003!important;
}
div.tv-half.tv-left {
    left: 0;
    background: #ff6f00;
}
div.tv-half.tv-right {
    right: 0;
    background: #0090ff;
}
div.tv-half.tv-in {
    opacity: 0.975!important;
}
div.tv-dragging div.tv-inner {
    opacity: 0.1;
}
div.tv-inner {
    margin: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 11;
    -webkit-box-orient: vertical;
}
div.tv-inner > img {
    border-radius: 3px;
    outline: #FFF solid 2px;
    outline-offset: -1px;
    max-width: 370px;
    max-height: 185px;
    display: block;
    position:absolute;
    margin: auto;
    left: 0;
    right: 0;
}
`);
})();