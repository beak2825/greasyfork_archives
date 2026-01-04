// ==UserScript==
// @name         崇高的幻象EX
// @version      1.24
// @description  利用论坛的html元素增殖按钮以协助进行版务操作
// @author       InfSein
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @run-at       document-end
// @match        http*://bbs.nga.cn/read.php*
// @match        http*://bbs.ngacn.cc/read.php*
// @match        http*://nga.178.com/read.php*
// @match        http*://ngabbs.com/read.php*
// @namespace https://greasyfork.org/users/325815
// @downloadURL https://update.greasyfork.org/scripts/447980/%E5%B4%87%E9%AB%98%E7%9A%84%E5%B9%BB%E8%B1%A1EX.user.js
// @updateURL https://update.greasyfork.org/scripts/447980/%E5%B4%87%E9%AB%98%E7%9A%84%E5%B9%BB%E8%B1%A1EX.meta.js
// ==/UserScript==

var buttons_gap=0;//默认0.7 ，最小可设为0 。

function doIfExists(obj, func) {
    if (!(obj === undefined || obj === null)) {
        return func(obj);
    }
}

function forEach(obj, func) {
    var len = obj.length;
    for (var i=0; i<len; i++) {
        func(obj[i]);
    }
}

function getButtons(post_info) {
    return post_info;
}

var post_infos = document.getElementsByClassName('postInfo');

// compatible
const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
const adminui = page.adminui;
const commonui = page.commonui;

// Load Datas

if (adminui) {
}

function generate_addScore(pid, score) { // 加分，opt的数值会影响加分的数量和其他参数。详见 tid=16070321 的3.1.0部分。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = '+'+score;

    var opt = {
        15: '21', 30: '37', 45: '69'
    };
    template.href = "javascript:__NUKE.doRequest({ u: { u: __API._base, a: { __lib: 'add_point_v3', __act: 'add', opt: "+opt[score]+", fid: __CURRENT_FID, tid: __CURRENT_TID, pid: "+pid+", info: '', value: ' ', raw: 3 } }, b: undefined, })";
    template.title = "加分";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_adjustRep(pid, score) {
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template.firstElementChild.firstElementChild.innerHTML = '+'+score;

    var opt = {
        5: '5'
        //CCQ: '4194372', noPM: '4194368'
    };
    template.href = "javascript:__NUKE.doRequest({ u: { u: __API._base, a: { __lib: 'add_point_v3', __act: 'add', opt: '4194368', fid: __CURRENT_FID, tid: __CURRENT_TID, pid: "+pid+", info: '', value: "+opt[score]+", raw: 3 } }, b: undefined, })";
    return template;
}

function generate_themeDown(pid, score) { // 提前(Up)或下沉(Down)主题。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    //template.className = "diy_managebutton";
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        Down: '1', Pre: ' '
    };
    template.href = "javascript:__NUKE.doRequest({u: __API.topicPush(__CURRENT_TID, "+opt[score]+"), b: undefined, })";
    template.title = "提前(Pre)或下沉(Down)主题";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_themeColor(pid, score) { // 改变主题颜色。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        Done: ''
    };
    template.href = "__NUKE.doRequest({ u:{u:__API._base, a:{__lib:'topic_color',__act:'set',tid:__CURRENT_TID,font:',U',opt:48,raw:3}}, b:this });"
    template.title = "改变主题颜色";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_themeLock(pid, score) { // 主题的锁定类操作。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        Lock: '1024', Hide: '2', Delete: '1026', Clear: '0', Block: '16384', 过审: '0'
    };
    var oct = (opt[score]=='0')?(score=='Clear')?1026:67109376:0; // RAU:512 | 屏蔽:16384 | BAU:67108864

    template.href = "javascript:__NUKE.doRequest({u:__API.setPost(__CURRENT_TID,0,0,"+opt[score]+","+oct+",'','',0,__CURRENT_FID),b: undefined, })";
    template.title = "锁定类操作";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}
function generate_postLock(pid, score) { // 回复的锁定类操作。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        Lock: '1024', Hide: '2', Delete: '1026', Clear: '0', Block: '16384'
    };
    var oct = (opt[score]=='0')?67126786:0; // 副版不能解除屏蔽及审核状态，需要修改此数值为1026方可使用

    template.href = "javascript:__NUKE.doRequest({u:__API.setPost([__CURRENT_TID,"+pid+"],0,0,"+opt[score]+","+oct+",'','',0,__CURRENT_FID),b: undefined, f: d=> { if(d.error && d.error[0]=='已经通过审核了哦~'){ __NUKE.doRequest({u:__API.setPost([__CURRENT_TID,"+pid+"],0,0,"+opt[score]+",1026,'','',0,__CURRENT_FID),b: undefined}); } else {alert(d.data[0])}} })";
    template.title = "锁定类操作";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_moveForum(pid, score) { // 版面之间的移动。会发送PM。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        非精华区内容: '321',
        互助招募版面: '582' // 范例。当按钮内容是“互助招募版面”时会将主题移动到FID为582的版面中，并发送PM“请发到互助招募版面”。
    };
    var tip = {
        非精华区内容: '回了DOTA2主版面, 因为：非精华区内容。',
        互助招募版面: '请发到互助招募版面'
    }
    template.href = "javascript:__NUKE.doRequest({ u:__API.topicMove2(__CURRENT_TID,  "+opt[score]+",  1,  '"+tip[score]+"',  2048,  '', '' ), b:this })";
    //template.href = "javascript:__NUKE.doRequest({ u:__API.topicMove2(__CURRENT_TID,  "+opt[score]+",  1,  '请发到"+score+"',  2048,  '', '' ), b:this })";
    template.title = "移动";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_moveStack(pid, score) { // 移动到同版面内的合集内。会发送PM。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        藏宝阁版面: '17625518' // 范例。当按钮内容是“藏宝阁版面”时会将主题移动到STID为17625518的合集中，并发送PM“请发到藏宝阁版面”。
    };
    template.href = "javascript:__NUKE.doRequest({ u:__API.topicMove2(__CURRENT_TID,  __CURRENT_FID,  1,  '请发到"+score+"',  2048,  '', "+opt[score]+" ), b:this })";
    template.title = "移动";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_moveDel(pid, score) { // 删除主题。不会发送PM。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        删除: '538'
    };
    template.href = "javascript:__NUKE.doRequest({ u:__API.topicMove2(__CURRENT_TID,  '',  '',  ' ',  1,  '', '' ), b:this })";
    template.title = "删除主题";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_stackOut(pid, score) { // 移出合集。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        移出合集: '1'
    };
    template.href = "javascript:__NUKE.doRequest({ u:__API.topicMove2(__CURRENT_TID,  '',  1,  '发错版面',  2,  '', '' ), b:this })";
    template.title = "移出合集";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_Mute(pid, score) { // 禁言操作。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        发错版面: '2208', 海豹: '2240', 队形: '2192', RMT: '2240', 违规内容: '2240' // 都是全版面禁言 禁言2天: '2192', 禁言4天: '2208', 禁言6天: '2240',
    };
    template.onclick = function e(){
        //if(!window.confirm("确认执行全版面禁言?")) return;
        __NUKE.doRequest({u:__API.lesserNuke2(__CURRENT_TID, pid, opt[score], '' , score, ''),b:this,inline:true});
    };
    template.title = "执行全版面禁言";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_MuteAndDel(pid, score) { // 禁言并删除
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        '发错版面(321)': 133152 // '2208'
    };
    var info = {
        '发错版面(321)': '发错版面(请发杂谈区)' //'发错版面(请发杂谈区)'
    };
    template.onclick = function e(){
        if(!window.confirm("确认执行?\n将禁言并锁隐主题")) return;
        // __NUKE.doRequest({u:__API.lesserNuke2(__CURRENT_TID, pid, opt[score], '', info[score], ''),b:this,inline:true,
        //                   f:d=>{console.log(d);}});
        // __NUKE.doRequest({u:__API.setPost([__CURRENT_TID,pid],0,0,1026,0,'','',0,__CURRENT_FID),b: undefined, })
        console.warn('Param of LesserNuke:',{
            tid: __CURRENT_TID,
            pid: pid,
            score: opt[score],
            info: "\t" + info[score]
        })
        __NUKE.doRequest({
            u: __API.lesserNuke2(__CURRENT_TID, pid, opt[score], '' , "\t" + info[score], ''),
            b:this,
            inline:true,
            f:function(d){
                var e = __NUKE.doRequestIfErr(d)
                if (e) return alert(e)
                var info = ''
                info += '[禁言]' + d.data[0];
                __NUKE.doRequest({
                    u:__API.setPost([__CURRENT_TID,pid],0,0,1026,0,'','',0,__CURRENT_FID),b: this,
                    f: dd=>{
                        info += '\n[删除]' + dd.data[0];
                        alert(info)
                    }
                })
            }
        })
    };
    template.title = "执行禁言并锁隐主题";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_Nuke(pid, uid, score) { // 唤出NUKE面板
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        //__NUKE.doRequest({u:__API.nuke(22106401,__CURRENT_TID,'',' 违规广告','',24,'',131080,''),b:this});
    };
    template.href = "javascript:adminui.nukeUi('',"+uid+",__CURRENT_TID,"+pid+",'');";
    template.title = "唤出NUKE面板";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_DirectNuke(pid, uid, score) { // 直接发送NUKE的操作Request
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        DIRECT_NUKE: '9', DIRECT_LOCK: '131080'//__NUKE.doRequest({u:__API.nuke(22106401,__CURRENT_TID,'',' 违规广告','',24,'',131080,''),b:this});
    };
    var info = {
        DIRECT_NUKE: '" 违反版规"', DIRECT_LOCK: '" 违规广告"'
    };
    template.href = "javascript:__NUKE.doRequest({u:__API.nuke("+uid+",__CURRENT_TID,"+pid+","+info[score]+",'',24,'',"+opt[score]+",''),b:this});";
    template.title = "直接NUKE/锁定\n附带删除24小时内发言 请提前确认";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_Scan(pid, score){ // 调查当前主题内的操作记录。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        Scan: ''
    };
    var token = __CURRENT_TID;
    //var token = (pid==0)?__CURRENT_TID:pid; // 目标为主题时查询TID的操作记录，为回复时查询对应PID内的操作记录。
    template.href = "javascript:adminui.viewLog('','','',"+token+")";
    template.title = "调查当前主题或回复内的操作记录\n请自行承担公开任何操作记录的后果";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_analysisStat(pid, score){ // 调查当前主题内的访问统计。需要同时拥有正式版主权限和Moderator权限。
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        AnaStat: ''
    };
    template.href = "javascript:adminui.forumStat(true,'',__CURRENT_TID,'',7);";
    template.title = "调查当前主题内的访问统计\n需要同时拥有正式版主权限和Moderator权限\n公开运营数据之前请务必询问工作人员";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_postReply(pid, score){ // 对主题或回复发表贴条
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        认购: '"认购[del][/del]"'
    };
    template.href = "javascript:commonui.newPost(this,postfunc.__REPLY,__CURRENT_F_BIT,__CURRENT_FID,__CURRENT_TID,"+pid+",null,null,"+opt[score]+",0,0,null,null,null,null,null,null,null,null,null,null,1,null);";
    template.title = "对这个主题/回复发布贴条，回复内容同按钮标题";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_addContent(pid, score){ // 为主题贴条，会弹出窗口以供输入贴条内容
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        贴条: ''
    };
    template.href = "javascript:commonui.comment_sub('',__CURRENT_TID,"+pid+",__CURRENT_FID,__CURRENT_F_BIT,'','');";
    template.title = "为此主题/回复贴条 会弹出窗口以供输入内容";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_stopMentions(pid, score){ // 制止主题出现回复提示
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        NoMoreMention: ''
    };
    template.onclick = function e(){
        const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
        var tid = page.__CURRENT_TID
        var admincheck = page.__GP.admincheck;
        /*
        _TNO:'<a href="javascript:void(0)" onclick="commonui.notification.setNoti({_ABOUT_ID},0,1)" class="b silver" title="不再提示此主题的回复或评论">不提示</a>',
        _RNO:'<a href="javascript:void(0)" class="b silver" onclick="commonui.notification.setNoti({_ABOUT_ID},{_ABOUT_ID_3},1)" title="不再提示此回复的回复或评论">不提示</a>',
        */
        page.__NUKE.doRequest2(
            'f', (d) => {
                const tip_no_mention = d.data[0]
                console.log(`Post StopMention request done: ${tip_no_mention}`)
                if(!admincheck) {
                    alert('[不再提示] ' + tip_no_mention);
                }
                else {
                    page.__NUKE.doRequest({
                        u: page.__API.setPost(tid,0,0,0,67109376,'','',0,page.__CURRENT_FID),
                        b: undefined,
                        f: dd => {
                            console.log(`Post Unaudit request done:`, dd)
                            const tip_unaudit = dd?.error ? dd.error[0] : dd.data[0]
                            alert('[不再提示] ' + tip_no_mention + '\n[通过审核] ' + tip_unaudit);
                        }
                    })
                }
            }
            ,'u', page.__API._base+'__lib=noti&__act=set_post_tag&__output=3'
            ,'no_hint', 1
            ,'tid', tid
            ,'pid', pid,
        )
    }
    template.title = "不再提示此主题下新增的回复 编辑会失效\n有权限时会同时将主题过审";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_auditTarget(pid, uid, score){ // 黑审或过审(后台审核)
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        Audit: 'lockt', Unaudit: 'passp'
    };
    template.onclick = function e(){
        if(!window.confirm("确认进行后台审核?")) return;
        var tid = __CURRENT_TID
        var fid = __CURRENT_FID
        var aid = Math.floor(Math.random()*20000 + 380000)
        var checkCode = '5_gznu1_0_ek'
        var timeStamp = Date.parse(new Date()) / 1000;
        const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
        page.__NUKE.doPost({
            //u: `/nuke.php?__lib=filter_double_check_review&__act=check_log_common&raw=3`,
            u: { u: '/nuke.php?',
                a: { __lib: 'filter_double_check_review', __act: 'check_log_common',
                    all: `${opt[score]},${aid},${tid},${uid},${pid},${fid},${timeStamp},${checkCode},2,180,134217728,,${uid},0`,
                    schedulename: '', waitcount: '', asuid: 0, raw: 3 } },
            f: d => {
                console.log(`Post Audit request done. Return: ↓`)
                console.log(d)
                alert(d.data[0]);
            }
        });
    }
    template.title = "通过后台审核修改帖子的审核状态";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_replyAsMoss(pid, score){ // 使用MOSS进行回复
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        ReplyByMoss: ''
    };
    template.onclick = function e(){
        var tid = __CURRENT_TID

        const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
        adminui.replyAsMoss('', tid);
    }
    template.title = "使用MOSS进行回复";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_unAuditByMoss(pid, score){ // 使用MOSS的cookie过审
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    var opt = {
        Audit: 'lockt', Unaudit: 'passp'
    };
    template.onclick = function e(){
        unAuditByMoss(pid);
    }
    template.title = "通过给定的账号Cookie过审";
    template.style.marginLeft=buttons_gap+"em";
    return template;

    function unAuditByMoss(pid) {
        var tid = __CURRENT_TID
        let tips = `[${tid}/${pid}]`
        const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
        let cookie = GM_getValue('moss_cookie');
        if(!cookie){
            alert('mirage cookie not set');
            page.commonui.setMirageCookie(this)
            return;
        }
        var fid = __CURRENT_FID
        // var toff = pid==0 ? 67109376 : 0;
        // var poff = pid==0 ? 0 : 67109376;
        var toff=0; var poff=67109376;
        GM_xmlhttpRequest({
            method:     "POST",
            url:        `https://bbs.nga.cn/nuke.php?__lib=topic_lock&__act=set&ids=${tid}%2C${pid}&ton=0&toff=${toff}&pon=0&poff=${poff}&pm=&info=&delay=&cfid=${fid}&raw=3`,
            data:       "",
            anonymous:  true,
            cookie:     cookie,
            responseType: 'blob',
            headers: {
                "Content-Type": "text/html; charset=GBK",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.69"
            },
            onload:     function (response) {
                console.log('success, ', response)
                var res;
                const promise = new Promise(() => {
                    const reader = new FileReader();
                    reader.readAsText(response.response, 'GBK');
                    reader.onload = () => {
                        res = reader.result;
                        //console.log(res)
                        /*
                        <html><head><meta http-equiv='Content-Type' content='text/html; charset=GBK'></head><body><script>window.script_muti_get_var_store={"error":{"0":"�Ѿ�ͨ�������Ŷ~"},"time":1674994478}</script></body></html>
                        */
                        let userInfo_TEXT = res.replace(`<html><head><meta http-equiv='Content-Type' content='text/html; charset=GBK'></head><body><script>`, '')
                                               .replace(`</script></body></html>`,'')
                                               .replace('window.script_muti_get_var_store=','');
                        let ui = JSON.parse(userInfo_TEXT)
                        var t = ui.error? ui.error[0] :ui.data[0];
                        alert(`${tips} ${t}`);
                    };
                    reader.onerror = () => {
                    };
                });
                promise.then(() => { });
            },
            onerror:    function (response){
                console.error('unaudit failed, detail see:', response)
                alert(`${tips} 操作失败`);
            }
        });
    }
}

function generate_checkState(pid, score){ // 检查回复的状态
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    template.onclick = function e(){
        var url;
        if (!pid || pid==0){
            // alert('Invalid pid.'); return;
            var tid = __CURRENT_TID;
            url = `https://bbs.nga.cn/read.php?tid=${tid}&lite=js`
        } else {
            url = `https://bbs.nga.cn/read.php?pid=${pid}&lite=js`
        }
        const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
        const $ = page.$;
        const _$ = page._$;
        GM_xmlhttpRequest({
            method:     "POST",
            url:        url,
            data:       "",
            responseType: 'blob',
            headers: {
                "Content-Type": "text/html; charset=GBK",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.69"
            },
            onload:     function (response) {
                var res;
                const promise = new Promise(() => {
                    const reader = new FileReader();
                    reader.readAsText(response.response, 'GBK');
                    reader.onload = () => {
                        res = reader.result;
                        let userInfo_TEXT = res.replace(`<html><head><meta http-equiv='Content-Type' content='text/html; charset=GBK'></head><body><script>`, '')
                                               .replace(`</script></body></html>`,'')
                                               .replace('	','')
                                               .replace('window.script_muti_get_var_store=','');
                        let ui = JSON.parse(userInfo_TEXT)
                        var p_type = ui.data.__R[0].type;
                        const w = commonui.createadminwindow();
                        w._.addContent(null);
                        w._.addContent(
                            '回复id: ', ''+pid, _$('/br'),
                            '隐藏: ', p_type&2 ? _$('/span','class','red','innerHTML','是') : '否', _$('/br'),
                            '屏蔽: ', p_type&16384 ? _$('/span','class','red','innerHTML','是') : '否', _$('/br'),
                            '正等待审核: ', p_type&512 ? _$('/span','class','red','innerHTML','是') : '否', _$('/br'),
                            '审核未通过: ', p_type&67108864 ? _$('/span','class','red','innerHTML','是') : '否', _$('/br')
                        )
                        w._.addTitle('检查结果');
                        w._.show();
                    };
                    reader.onerror = () => {
                    };
                });
                promise.then(() => { });
            },
            onerror:    function (response){
                console.error('unaudit failed, detail see:', response)
                alert(`操作失败`);
            }
        });
    }
    template.title = "检查回复的当前状态";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_share(pid, score){ // 分享
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    template.onclick = function e(){
        let copy = `${document.title.replace(' NGA玩家社区', '')}
${document.location.href}`
        GM_setClipboard(copy)
        alert('复制成功')
    }
    template.title = "复制主题信息以便分享到Q群";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}

function generate_prtscMode(pid, score){ // 截图模式
    var template = getButtons(post_infos[0]).getElementsByClassName('small_colored_text_btn block_txt_c0 stxt')[1].cloneNode(true);
    template/*.firstElementChild.firstElementChild*/.innerHTML = score;

    template.onclick = function e(){
        const tables = document.getElementsByClassName('tablespacer')
        for (var table of tables) {
            table.style = ' width: 500px;';
        }
    }
    template.title = "调整页面布局以便截图";
    template.style.marginLeft=buttons_gap+"em";
    return template;
}


setTimeout(function(){
    const page = typeof unsafeWindow == 'undefined' ? window : unsafeWindow;
    // 0. 添加一些函数
    page.commonui.setMirageCookie = (e) =>{
        const mossCookie = GM_getValue('moss_cookie');
        const moss_window = commonui.createCommmonWindow(6);
        let moss_html = `
<span><textarea id="moss_cookie" placeholder="在此填入你登录MOSS后获得的Cookie 请勿使用他人的Cookie 以免操作混乱"></textarea></span>



<button name="moss_confirm" type="button">确定</button>
`;
        moss_window._.addContent(moss_html);
        moss_window._.addTitle('设置Cookie(禁言/回复)');
        moss_window._.show();
        if(mossCookie) document.querySelector("textarea#moss_cookie").value = mossCookie;
        document.querySelector("button[type=button][name=moss_confirm]").addEventListener('click', () => {
            let moss_cookie = document.querySelector("textarea#moss_cookie").value;
            GM_setValue('moss_cookie', moss_cookie);
            alert('保存成功')
        });
    }

    // Modify main-floor.
    // 1. 增加移回原版面的按钮
    if(__GP.admincheck && !document.location.href.match('&page=')){
        let post0Childs = document.getElementById('postInfo0').children;
        for(var i=0;i<post0Childs.length;i++){
            if(post0Childs[i].href && post0Childs[i].href.match('fid')){
                const moveBackBtn = document.createElement('a');
                moveBackBtn.href = 'javascript:void(0)'
                moveBackBtn.dataset.tid = __CURRENT_TID;
                //moveBackBtn.dataset.currFid = __CURRENT_FID;
                moveBackBtn.dataset.oriFid = post0Childs[i].href.replace('/thread.php?fid=','').replace('https://nga.178.com','').replace('https://bbs.nga.cn','').replace('https://ngabbs.com','')
                moveBackBtn.onclick = function e(){
                    var tid = this.dataset.tid;
                    //var currFid = this.dataset.currFid;
                    var oriFid = this.dataset.oriFid;
                    if(!window.confirm(`确认移回${oriFid}?`)) return;
                    __NUKE.doRequest({
                        u: __API.topicMove2(tid, oriFid, 0, '', 2048, '', ''),
                        b:this
                    });
                }
                moveBackBtn.innerHTML = `[&#8634;移回原版面]`
                moveBackBtn.title = `将主题移回最初的版面 会弹出二次确认提示版面ID`
                moveBackBtn.style = 'margin-left: 0.5em; color:#008dff;'
                post0Childs[i].after(moveBackBtn)
            }
        }
    }

    // 2. Modify forum funcs.
    setTimeout(function e(){
        if(commonui && !commonui.oldLesserNuke){
            commonui.oldLesserNuke = commonui.lessernuke;
            commonui.lessernuke = function (e,tid,pid,f)
            {
                this.createadminwindow()
                this.adminwindow._.addContent(null)
                var self=this,$ = _$, rg, rf, rs,rp,rd, m2, m4, m6, m30, n1, n2, n3, n4, il, is,dt,ac,isl,ngl,pa={}, ff=location.search.match(/_ff=(\d+)/), y= $('/span')
                this.adminwindow._.addTitle('次级NUKE(Modified Lessernuke)');

                this.adminwindow._.addContent(
                    ac = $('/span')._.add(
                        $('/button','innerHTML','快捷6+2','class','','type','button','onclick', function(){
                            m6.checked = true;
                            n2.checked = true;
                            if (__GP.greater) {
                                rg.checked = true;
                                n3.checked = true;
                            }
                        }),
                        $('/br'),
                        rg = $('/input','type','radio','name','opt0'),'全论坛 ',
                        rf = $('/input','type','radio','name','opt0','checked',1),'本版面 ',
                        rs = $('/input','type','radio','name','opt0'),'本合集 ',
                        //rr = $('/input','type','radio','name','opt0'),'本版声望 ',
                        ngl = $('/span','_set',function(l,n){
                            n = commonui.cutstrbylen(n,17,16,'..')
                            if(l==1)
                                rp.disabled='',rp.parentNode._.add(' ('+n+')')
                            else if(l==2)
                                rd.disabled='',rd.parentNode._.add(' ('+n+')')
                        })._.add(
                            $('/nobr')._.add(rp = $('/input','type','radio','name','opt0','disabled','disabled'),'本区内 '),
                            $('/nobr')._.add(rd = $('/input','type','radio','name','opt0','disabled','disabled'),'大区内')
                        ),
                        $('/br'),
                        m2 = $('/input','type','radio','name','opt1','checked',1),'禁言2天 ',
                        m4 = $('/input','type','radio','name','opt1'),'禁言4天 ',
                        m6 = $('/input','type','radio','name','opt1'),'禁言6天 ',
                        [m30 = $('/input','type','radio','name','opt1','disabled','disabled'),'禁言30天 '],
                        $('/br'),
                        $('/input','type','radio','name','opt2','checked',1),'不扣减声望 ',
                        n1 = $('/input','type','radio','name','opt2'),'扣减声望',$('/span','className','silver','innerHTML','(150) '),
                        n2 = $('/input','type','radio','name','opt2'),'加倍扣减声望',
                        $('/br'),
                        n3 = $('/input','type','checkbox'),'同时扣减威望',$('/span','className','silver','innerHTML','(150:1 仅在有正式声望的版面)'),
                        $('/br'),
                        n4 = $('/input','type','checkbox'),'延时',$('/span','className','silver','innerHTML','(从下次发言开始禁言)'),
                        [$('/br'),pa = $('/input','type','checkbox','disabled','disabled'),'记入审核日志'],
                        $('/br'),
                        $('/br'),
                        is = $('/input','placeholder','操作说明(将显示在帖子中)','maxlength','20','onfocus',function(e){if(isl.style.display=='none'){
                            isl.style.display=''
                            this.blur()
                            this.placeholder='使用攻击性言辞将被禁止填写'
                            commonui.cancelEvent(e)
                        }}),
                        f ? (isl = $('/span','style','display:none;max-width:300px;',$('/br'))) :null,
                        $('/br'),
                        $('/br'),
                        il = $('/textarea','placeholder','更长的操作说明(将通过短信发送)','rows','3','cols','20'),
                        $('/br'),$('/br'),
                        dt=$('/input','type','checkbox','checked',1),'删除此贴 ',
                        $('/br'),$('/br'),
                        $('/button','innerHTML','确定','class','larger','type','button','onclick',function(){
                            var opt = 0;
                            if(rg.checked)opt|=128
                            if(rf.checked)opt|=256
                            if(rs.checked)opt|=512
                            //if(rr.checked)opt|=8192
                            if(m2.checked)opt|=16
                            if(m4.checked)opt|=32
                            if(m6.checked)opt|=64
                            if(m30 && m30.checked)opt|=16384
                            if(n1.checked)opt|=1
                            if(n2.checked)opt|=2
                            if(!n3.checked)opt|=2048
                            if(n4.checked)opt|=4096
                            if(rp && rp.checked)opt|=131072
                            if(rd && rd.checked)opt|=262144
                            if(pa && pa.checked)opt|=524288
                            var sls = isl.getElementsByTagName('input'),ist=is.value? is.value : ''
                            for(var i=0;i<sls.length;i++){
                                if(sls[i].checked)
                                    ist+="\t"+sls[i].value
                            }
                            if(!ist)
                                return alert("需要操作说明")
                            self.lessernuke['info_'+tid+'_'+pid] = ist
                            __NUKE.doRequest({
                                u:__API.lesserNuke2(tid, pid, opt, il ? il.value.replace(/^\s+|\s+$/g,''):'' , ist,''),
                                b:this,
                                inline:true,
                                f:function(d){
                                    var e=__NUKE.doRequestIfErr(d)
                                    console.log('lessernuke response: e - ', e, '; d - ', d)
                                    if(e)
                                        return alert(e)
                                    var info = ''
                                    info += '[禁言]' + d?.data[0];
                                    if(dt.checked){
                                        __NUKE.doRequest({
                                            u:__API.setPost([tid,pid],0,0,1026,0,'','',0,__CURRENT_FID),b: this,
                                            f: dd=>{
                                                info += '\n[删除]' + dd?.data[0];
                                                alert(info)
                                            }
                                        })
                                        /*if(pid)
                                            __NUKE.doRequest2('u','/nuke.php?__lib=topic_lock&__act=set&__output=3','ids',tid+','+pid,'pon',1026,'info',ist)
                                        else
                                            __NUKE.doRequest2('u','/nuke.php?__lib=topic_move&__act=move&__output=3','tid',tid,'op',114689,'info',ist,'fid','','pm','','delay','','stid','')*/
                                    }
                                    else{
                                        alert(info)
                                    }
                                }
                            })
                        }
                        ),
                        y
                    )
                )

                this.adminwindow._.show(e)
                //isl.style.display=''
                is.focus()
                // isl.focus(function(e){
                //     if(isl.style.display=='none'){
                //         isl.style.display=''
                //         this.blur()
                //         this.placeholder='使用攻击性言辞将被禁止填写'
                //         commonui.cancelEvent(e)
                //     }
                // })

                __NUKE.doRequest({
                    u:{u:'/nuke.php?__lib=admin_log_search&__act=lesser_list&raw=3',a:{tid:tid,pid:pid}},
                    f:function(res){
                        var e = __NUKE.doRequestIfErr(res)
                        if(e)
                            return
                        var d = res.data[0], t= $('/table').$0('className','forumbox')
                        for(var k in d)
                            t._.add($('/tr').$0('className','row'+(1+(k&1)))._.add(
                                $('/td').$0('className','c1','style','padding:0.25em').$0('innerHTML',adminui._formatLog(d[k][5])	),
                                $('/td').$0('className','c2','style','padding:0.25em')._.add(
                                    $('/span').$0('className','xtxt','innerHTML',commonui.time2date(d[k][6], 'y-m-d H:i'))
                                )
                            ))
                        y.innerHTML = ''
                        y._.add($('/br'), '被操作记录', $('/br'), t)
                    }
                })

                if(f)
                    commonui.genNukeRule(tid,pid,f,ff,isl,ngl)
            }//fe
        }
    }, 100);

    // Generate operation buttons.
    forEach(post_infos, function(o) {
        let currentUid = 41369816;
        var buttons = getButtons(o);
        var orifid = buttons.firstElementChild.href;
        var oriornot = (orifid==0)?0:1;
        var pid = buttons.parentElement/*.parentElement*/.firstElementChild.id;
        pid = pid.substr(3, pid.length - 9);
        console.log(pid);
        var fp = buttons.parentElement.id;
        if(fp.length>=19) fp='0';
        fp = fp.substr(13);console.log(fp);
        var uid = document.getElementsByName('uid')[fp%20]?.text;
        let isSelf = uid==currentUid
        if(pid==0) // 'target: Theme'
        {
            setTimeout(function(){
                if(isSelf && window && window.script_muti_get_var_store && window.script_muti_get_var_store.data){
                    if(!__GP.admincheck && window.script_muti_get_var_store.data.__T.type & 512){
                        const blocker1 = document.createElement('span');
                        blocker1.innerHTML = ` <span class="block_txt white nobr vertmod" style="background-color:rgb(197, 128, 128);padding-right:0.2em;border-right:0.2em solid #591804" title="主题正等待审核\n此按钮由‘崇高的幻象’生成">正等待审核</span>`;
                        document.getElementById('postcontentandsubject0').children[0].children[0].appendChild(blocker1);
                    }
                    if(!__GP.admincheck && window.script_muti_get_var_store.data.__T.type & 67108864){
                        const blocker2 = document.createElement('span');
                        blocker2.innerHTML = ` <span class="block_txt white nobr vertmod" style="background-color:rgb(64, 64, 64);padding-right:0.2em;border-right:0.2em solid #591804" title="主题审核未通过\n此按钮由‘崇高的幻象’生成">审核未通过</span>`;
                        document.getElementById('postcontentandsubject0').children[0].children[0].appendChild(blocker2);
                    }
                    if(window.script_muti_get_var_store.data.__T.type & 16384){
                        const blocker3 = document.createElement('span');
                        blocker3.innerHTML = ` <span class="block_txt white nobr vertmod" style="background-color:#80C580;padding-right:0.2em;border-right:0.2em solid #591804" title="主题被屏蔽\n此按钮由‘崇高的幻象’生成">屏蔽</span>`;
                        document.getElementById('postcontentandsubject0').children[0].children[0].appendChild(blocker3);
                    }
                    if(!__GP.admincheck && window.script_muti_get_var_store.data.__T.type & 2){
                        const blocker4 = document.createElement('span');
                        blocker4.innerHTML = ` <span class="block_txt white nobr vertmod" style="background-color:rgb(197, 128, 128);padding-right:0.2em;border-right:0.2em solid #591804" title="主题被隐藏\n此按钮由‘崇高的幻象’生成">被隐藏</span>`;
                        document.getElementById('postcontentandsubject0').children[0].children[0].appendChild(blocker4);
                    }
                }
            },500);
            buttons.appendChild(generate_share(pid, '分享'));
            buttons.appendChild(generate_prtscMode(pid, '截图模式'));
            if(__GP.admincheck) {
                buttons.appendChild(generate_themeLock(pid, 'Lock'));
                if(__GP.superlesser)  { buttons.appendChild(generate_themeLock(pid, 'Block')); } // 拥有superlesser权限时，生成屏蔽主题按钮
                if(__GP.superlesser)  { buttons.appendChild(generate_auditTarget(pid, uid, 'Audit')); } // 拥有superlesser权限时，生成屏蔽主题按钮
                else                  { buttons.appendChild(generate_themeLock(pid, 'Hide')); } // 否则生成隐藏主题按钮
                buttons.appendChild(generate_themeLock(pid, 'Delete'));
                buttons.appendChild(generate_themeLock(pid, 'Clear'));
                buttons.appendChild(generate_themeDown(pid, 'Pre'));
                buttons.appendChild(generate_themeDown(pid, 'Down'));
                post_infos[0].insertAdjacentHTML('beforeend', '<br>'); // 换行
                if(__CURRENT_FID==321 && !isSelf) {
                    buttons.appendChild(generate_MuteAndDel(pid, '发错版面(321)'));
                }
                if(__CURRENT_FID==574) {
                    buttons.appendChild(generate_moveForum(pid, '非精华区内容'));
                }
                if(isSelf){
                    buttons.appendChild(generate_stopMentions(pid, 'NoMoreMention'));
                }
                buttons.appendChild(generate_addContent(pid, '贴条'));
                if(__GP.greater) {
                    if(__CURRENT_FID==538) {
                        buttons.appendChild(generate_moveForum(pid, '互助招募版面'));
                    }
                    if(!isSelf && __GP.superlesser){
                        buttons.appendChild(generate_DirectNuke(pid, uid, 'DIRECT_LOCK'));
                        buttons.appendChild(generate_Nuke(pid, uid, 'NUKE!'));
                    }
                    //buttons.appendChild(generate_replyAsMoss(pid, 'ReplyByMoss'));
                    if(isSelf) { buttons.appendChild(generate_analysisStat(pid, 'AnaStat'));}
                    buttons.appendChild(generate_themeLock(pid, '过审'));

                    buttons.appendChild(generate_moveDel(pid, '删除'));
                    //buttons.appendChild(generate_analysisStat(pid, 'AnaStat'));
                } else {
                    buttons.appendChild(generate_unAuditByMoss(pid, '过审'));
                }
            }
            else if(__GP.greater) {
                buttons.appendChild(generate_Scan(pid, 'Scan'));
                if(isSelf){
                    post_infos[0].insertAdjacentHTML('beforeend', '<br>'); // 换行
                    buttons.appendChild(generate_stopMentions(pid, 'NoMoreMention'));
                    buttons.appendChild(generate_unAuditByMoss(pid, '过审'));
                }
            }
            else {
                if(__GP.greater) {
                    buttons.appendChild(generate_Scan(pid, 'Scan'));
                }
                post_infos[0].insertAdjacentHTML('beforeend', '<br>'); // 换行
                buttons.appendChild(generate_checkState(pid, '检查(CheckState)'));
                if(isSelf){
                    buttons.appendChild(generate_addContent(pid, '贴条'));
                    buttons.appendChild(generate_stopMentions(pid, 'NoMoreMention'));
                    buttons.appendChild(generate_unAuditByMoss(pid, '过审'));
                }
            }
        }
        else // 'target: Post'
        {
            if(__GP.admincheck) {
                //buttons.appendChild(generate_addScore(pid,'15'));
                //buttons.appendChild(generate_adjustRep(pid,'5'));
                //buttons.appendChild(generate_addScore(pid,'30'));
                //buttons.appendChild(generate_Nuke(pid, uid, 'NUKE!'));
                //buttons.appendChild(generate_Mute(pid, '违规内容'));
                //if(__CURRENT_FID==538||__CURRENT_FID==582||__CURRENT_FID==703) buttons.appendChild(generate_Mute(pid, 'RMT'));
                //buttons.appendChild(generate_postLock(pid, 'Delete'));
                //if(__CURRENT_TID==25245820/* && window.script_muti_get_var_store.data.__T.type & 1024 < 1024*/) buttons.appendChild(generate_postReply(pid, '认购'));
                buttons.appendChild(generate_postLock(pid, 'Clear'));
                if (isSelf && !__GP.greater){
                    buttons.appendChild(generate_unAuditByMoss(pid, '过审'));
                }
            }
            else {
                if(__GP.greater&fp%20==0) {
                    buttons.appendChild(generate_Scan(pid, 'Scan'));
                }
                if (isSelf){
                    buttons.appendChild(generate_unAuditByMoss(pid, '过审'));
                    buttons.appendChild(generate_checkState(pid, '检查(CheckState)'));
                }
            }
        }

        // ‘target: all’

    });
},350);
    //fp++;
