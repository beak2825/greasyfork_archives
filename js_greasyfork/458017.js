// ==UserScript==
// @name         NGA成分指示
// @namespace    No namespace.
// @version      0.11451
// @license      WTFPL
// @description  标注出NGA网页版帖子中用户的成分。
// @author       You
// @match       *://bbs.nga.cn/*
// @match       *://ngabbs.com/*
// @match       *://nga.178.com/*

// @downloadURL https://update.greasyfork.org/scripts/458017/NGA%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/458017/NGA%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let forums = {};
    let cfs = {};
    let cftime = {};
    let cfzsPanel;

    // 查询结果的保质期，默认为3天，单位为秒
    const VALIDITY_PERIOD = 3 * 86400;
    const PANEL_DIV_HTML = `<div id="cfzs_setting_panel" style="display:none; position:fixed; background:#fff6df; box-shadow:0 0 15px #444; border:1px solid #591804; top: 55px; left: 100px; padding-left: 10px; padding-right: 10px; padding-bottom: 10px;">
<h3 style="text-align:center;">NGA成分指示</h3>
<hr>
填写要关注版块的FID：<input id="cfzs_add_input" style="width:72px;"><button id="cfzs_add_forum" style="width:60px;">添加</button>
<div>或是直接添加当前版块：<button id="cfzs_add_current_forum">添加</button></div>
<hr>
<p>目前关注的版块：</p>
<div id="tag_modifier" style="padding: 5px; border: 1px solid #591804;">
</div>
<div id="cfzs_feedback_info" style="float:left;"></div>
<button style="float:right;" id="cfzs_close_button">关闭</button>
<button style="float:right;" id="cfzs_clear_cache_button">清除缓存</button>
</div>`;

    class SettingPanel {
        constructor(form) {
            this.form = form;
            this.tagModifier = this.form.querySelector("#tag_modifier");
            this.feedback = this.form.querySelector("#cfzs_feedback_info");

            // 添加版块按钮
            document.getElementById("cfzs_add_forum").addEventListener("click", () => { this.addForum(document.getElementById('cfzs_add_input').value); });
            // 添加当前版块按钮
            document.getElementById("cfzs_add_current_forum").addEventListener("click", () => { this.addForum(__CURRENT_FID) });
            // 清除缓存按钮
            document.getElementById("cfzs_close_button").addEventListener("click", () => { this.close() });
            // 关闭按钮
            document.getElementById("cfzs_clear_cache_button").addEventListener("click", () => { this.clearData() });
            // 添加设置按钮
            document.getElementsByClassName("right")[0].getElementsByClassName("td")[0].insertAdjacentHTML("afterend", `<div class=" td"><a id="cfzs_setting_button" class="mmdefault  gray" href="javascript:void(0)" title="成分指示" style="white-space: nowrap;">成分指示</a></div>`);
            document.getElementById("cfzs_setting_button").addEventListener("click", () => { this.open() });

            this.drawPanel();
        }
        drawPanel() {
            // 绘制面板
            this.tagModifier.innerHTML = "";
            let placeholder;
            let thistag;
            for (let fid in forums) {
                placeholder = document.createElement("div");
                placeholder.insertAdjacentHTML("afterbegin",  `<div class="cfzs_forum_tag" style="display:flex;justify-content:space-between;"><div>FID:${fid}</div><div><input class="cfzs_forum_name" id="cfzs_remark_${fid}" style="width:60px;" value="${forums[fid]}"><button id="cfzs_modify_remark_${fid}">备注</button><button id="cfzs_delete_forum_${fid}">删除</button></div></div>`);
                thistag = placeholder.firstElementChild;
                this.tagModifier.appendChild(thistag);
                // 修改备注按钮
                thistag.querySelector(`#cfzs_modify_remark_${fid}`).addEventListener("click", () => { this.changeRemark(fid, document.getElementById(`cfzs_remark_${fid}`).value); });
                // 删除按钮
                thistag.querySelector(`#cfzs_delete_forum_${fid}`).addEventListener("click", () => { this.deleteForum(fid); });
            }
        }
        open() {
            // 在打开面板时再更新面板上的信息
            this.form.style.display = 'block';
        }
        addForum(fid) {
            if (fid in forums) {
                this.feedback.innerHTML = `这个版块已经添加过了…`;
                return 114514;
            }
            let postData;
            fetch(`https://${window.location.host}/thread.php?fid=${fid}&__output=8`)
                .then(res => res.arrayBuffer())
                .catch(error => { postData = { 'error': [error] } })
                .then(buffer => new TextDecoder("gbk").decode(buffer))
                .then((res) => {
                    try {
                        postData = JSON.parse(res);
                    } catch {
                        this.feedback.innerHTML = `发生了奇怪的错误，也许此版块(FID:${fid})不存在…`;
                        return 114514;
                    }
                    if (!postData || 'error' in postData) {
                        this.feedback.innerHTML = `发生了奇怪的错误，也许此版块(FID:${fid})不存在…`;
                        return 114514;
                    }
                    let fname = postData.data.__F.name;
                    forums[fid] = fname;
                    window.localStorage.setItem("cfzs_forums", JSON.stringify(forums));

                    // 添加了一个版块后将cftime清空，以对每个用户发起新的查询
                    cftime = {};
                    window.localStorage.setItem('cfzs_cftime', "{}");

                    this.feedback.innerHTML = `添加了版块${fid}…`;
                    //alert(`${fname}(FID:${fid})添加成功！`);
                    this.drawPanel();
                });
        }
        addCurrentForm() {
            this.addForum(__CURRENT_FID);
            //forums[__CURRENT_FID] = document.querySelector(`[href='/thread.php?fid=${__CURRENT_FID}'`).innerHTML;
        }
        deleteForum(fid) {
            delete forums[fid];
            window.localStorage.setItem("cfzs_forums", JSON.stringify(forums));
            this.feedback.innerHTML = `删除了版块${fid}…`;
            this.drawPanel();
        }
        clearData() {
            if (window.confirm("这会清空已保存的用户成分，可能会造成成分判断不准确。确定要这样做吗？")) {
                forums = {};
                cfs = {};
                cftime = {};
                window.localStorage.setItem('cfzs_forums', "{}");
                window.localStorage.setItem('cfzs_cfs', "{}");
                window.localStorage.setItem('cfzs_cftime', "{}");
                alert("清空完毕，刷新以生效…");
            }
        }
        changeRemark(fid, remark) {
            forums[fid] = remark;
            window.localStorage.setItem("cfzs_forums", JSON.stringify(forums));
            this.feedback.innerHTML = `将版块${fid}备注为${remark}…`;
            //this.drawPanel();
        }
        close() {
            this.form.style.display = 'none';
        }
    }

    // 初始化脚本
    function cfzs_init() {

        // 生成设置面板

        // 从localStorage中读取保存的配置信息
        if (!('cfzs_forums' in window.localStorage)) {
            // 首次使用时添加配置信息
            window.localStorage.setItem('cfzs_forums', "{}");
            window.localStorage.setItem('cfzs_cfs', "{}");
            window.localStorage.setItem('cfzs_cftime', "{}");
        }

        forums = JSON.parse(window.localStorage.getItem('cfzs_forums'));
        cfs = JSON.parse(window.localStorage.getItem('cfzs_cfs'));
        cftime = JSON.parse(window.localStorage.getItem('cfzs_cftime'));

        document.body.insertAdjacentHTML('beforeend', PANEL_DIV_HTML);
        cfzsPanel = new SettingPanel(document.getElementById('cfzs_setting_panel'));

        if (Object.keys(forums).length < 1) {
            alert('您没有关注任何版面。请添加一些以开始使用。');
            cfzsPanel.open();
        }
    }

    // 添加成分
    function addChengFen(uid, fid) {
        // 仅当fid在关注版面中且用户成分尚未包括该fid时才将fid加入用户成分
        cftime[uid] = __NOW;
        window.localStorage.setItem("cfzs_cftime", JSON.stringify(cftime));
        if (fid in forums) {
            cfs[uid].push(fid);
            cfs[uid] = Array.from(new Set(cfs[uid]));
            window.localStorage.setItem("cfzs_cfs", JSON.stringify(cfs));
        }
    }

    // 将查询结果推送到用户面板上
    function pushChengFen(form, uid) {
        let text = '成分: ';
        let thiscf = [];
        //console.log(cfs[uid]);
        for (let i of cfs[uid]) {
            if (i in forums) thiscf.push(i);

        }
        if (thiscf.length > 0) {
            text += thiscf.map((e) => { return `<span class='silver'>${forums[e]}</span>&nbsp;(<a style='text-decoration: underline;' href='https:\/\/${window.location.host}\/thread.php?authorid=${uid}&fid=${e}'>贴</a>·<a style='text-decoration: underline;' href='https:\/\/${window.location.host}\/thread.php?searchpost=1&authorid=${uid}&fid=${e}'>回</a>)` }).join(' / ');
        } else {
            text += "<span class='silver'>群众</span>";
        }
        form.getElementsByClassName("ngatag_container")[0].innerHTML = text;
        return 114514;
    }

    // 主循环
    function cfzs_mainLoop() {
        // 获取每层楼的结构
        let floors = Array.from(document.getElementsByClassName("forumbox postbox"));
        if (floors.length > 0) {
            floors.forEach(f => {
                // 筛除分页符
                if (!f.querySelector(".postrow")) return 114514;
                // 判断本楼是否存在已有的查询结果
                if (f.getElementsByClassName("ngatag_container").length > 0) {
                    // 若是则直接跳过循环
                    console.log(`Div existed, jumped...`);
                    return 114514;
                } else {
                    // 若否，则在用户面板的最下方插入div
                    f.getElementsByClassName("clear")[0].insertAdjacentHTML('beforebegin', '<div class="ngatag_container" style="float: left; margin-right: 3px;min-width:49%;*width:49%;"></div>');
                }
                // 获取本层用户的UID
                let uid = f.querySelector("a[name='uid']").innerHTML;
                if (uid in cftime) {
                    // 如果已经保存有该UID的查询结果，则判断查询结果的保存时间
                    // __NOW 是NGA网页内部的时间戳，希望二哥不要乱动它
                    if ((__NOW - cftime[uid]) <  VALIDITY_PERIOD) {
                        // 若查询结果仍处于保质期内，则直接向div推送查询结果，跳过循环
                        console.log(`Found available uid, creating div...`);
                        pushChengFen(f, uid);
                        return 114514;
                    } else {
                        // 若查询结果已经过期，则开始一轮新的查询
                        console.log(`Found out-of-date uid, searching...`);
                    }
                } else {
                    // 如果遇到新的UID
                    console.log(`Found new uid, searching...`);
                    cfs[uid] = [];
                }
                // 查询用户发表的主题
                let postData1;
                fetch(`https://${window.location.host}/thread.php?authorid=${uid}&__output=8`)
                    .then(res => res.arrayBuffer())
                    .catch(error => { postData1 = { 'error': [error] } })
                    .then(buffer => new TextDecoder("gbk").decode(buffer))
                    .then((res) => {
                        postData1 = JSON.parse(res);
                        // 如果用户活跃的版面是关注的版面，则将该版面其加入用户的成分中
                        for (let i in postData1.data.__T) {
                            addChengFen(uid, postData1.data.__T[i].fid.toString());
                        }
                        pushChengFen(f, uid);
                    });
                // 查询用户发表的回复。逻辑应当与前者是一样的
                let postData2;
                fetch(`https://${window.location.host}/thread.php?searchpost=1&authorid=${uid}&__output=8`)
                    .then(res => res.arrayBuffer())
                    .catch(error => { postData2 = { 'error': [error] } })
                    .then(buffer => new TextDecoder("gbk").decode(buffer))
                    .then((res) => {
                        postData2 = JSON.parse(res);
                        for (let i in postData2.data.__T) {
                            addChengFen(uid, postData2.data.__T[i].fid.toString());
                        }
                        pushChengFen(f, uid);
                    });

            })
        }
    }

    cfzs_init();
    //mainLoop();
    setInterval(cfzs_mainLoop, 3000);
})();