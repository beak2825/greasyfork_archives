// ==UserScript==
// @name         获取版块最新帖子
// @version      0.6
// @include      https://www.mcbbs.net/*
// @author       xmdhs
// @description  获取版块最新帖子。
// @namespace https://greasyfork.org/users/166541
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/409906/%E8%8E%B7%E5%8F%96%E7%89%88%E5%9D%97%E6%9C%80%E6%96%B0%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/409906/%E8%8E%B7%E5%8F%96%E7%89%88%E5%9D%97%E6%9C%80%E6%96%B0%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(async () => {
    await unsafeWindow.MExt;
    let MExt = unsafeWindow.MExt;
    (async () => {
        if (Notification.permission == "granted") {
            return
        }
        alert("请给予通知权限")
        let n = await Notification.requestPermission()
        if (n != "granted") {
            alert("请给予通知权限")
        }
    })()

    const stime = 5000
    const getnewpost = {
        "runcase": () => { return MExt.ValueStorage.get("getnewpost").length > 0 },
        "core": () => {
            let fidstemp = MExt.ValueStorage.get("getnewpost")
            let fids = fidstemp.split(",")
            let id = Math.round(new Date().getTime() / 1000)
            let tempid = localStorage.getItem("getnewpost")
            if (tempid == null) {
                localStorage.setItem("getnewpost", id)
                tempid = id
                for (let index = 0; index < fids.length; index++) {
                    getposts(fids[index])
                }
            } else {
                let getifcan = setInterval(function () {
                    let atime = localStorage.getItem("getnewpost")
                    let btime = Math.round(new Date().getTime() / 1000)
                    if (btime - atime > 20) {
                        localStorage.setItem("getnewpost", btime)
                        for (let index = 0; index < fids.length; index++) {
                            getposts(fids[index])
                        }
                        clearInterval(getifcan);
                        return;
                    }
                }, stime * 2)
            }
            async function getposts(fid) {
                for (; ;) {
                    localStorage.setItem("getnewpost", Math.round(new Date().getTime() / 1000))
                    let f = await fetch("https://www.mcbbs.net/api/mobile/index.php?version=4&module=forumdisplay&fid=" + fid + "&filter=author&orderby=dateline");
                    let ajson = await f.json();
                    if (localStorage.getItem("getnewpost-" + fid) == null || Math.round(new Date().getTime() / 1000) - JSON.parse(localStorage.getItem("getnewpost-" + fid)).time > 7200 || typeof JSON.parse(localStorage.getItem("getnewpost-" + fid)).time == "undefined") {
                        let tids = { tids: [], time: 0 }
                        for (let index = 0; index < ajson.Variables.forum_threadlist.length; index++) {
                            tids.tids.push(ajson.Variables.forum_threadlist[index].tid)
                            tids.time = Math.round(new Date().getTime() / 1000)
                        }
                        localStorage.setItem("getnewpost-" + fid, JSON.stringify(tids))
                    } else {
                        let temptids = localStorage.getItem("getnewpost-" + fid)
                        let tids = JSON.parse(temptids)
                        for (let index = 0; index < ajson.Variables.forum_threadlist.length; index++) {
                            if (tids.tids.indexOf(ajson.Variables.forum_threadlist[index].tid) == -1) {
                                push(ajson.Variables.forum_threadlist[index].tid, ajson.Variables.forum_threadlist[index].subject)
                                tids.tids.push(ajson.Variables.forum_threadlist[index].tid)
                                if (tids.tids.length > 100) {
                                    tids.tids.splice(0, 30)
                                }
                                tids.time = Math.round(new Date().getTime() / 1000)
                                localStorage.setItem("getnewpost-" + fid, JSON.stringify(tids))
                            }
                        }
                    }
                    await sleep(stime);
                }
            }

            async function sleep(t) {
                return new Promise((rs, rj) => {
                    setTimeout(() => { rs() }, t)
                })
            }

            function push(tid, subject) {
                let n = new Notification('发现新帖', {
                    body: subject,
                    data: {
                        url: "https://www.mcbbs.net/thread-" + tid + "-1-1.html#pgt"
                    }
                })
                n.onclick = function () {
                    window.open(n.data.url, '_blank');
                    n.close();
                }
            }
        },
        "config": [{
            "id": "getnewpost",
            "default": "52",
            "type": "text",
            "name": "推送版块最新帖子",
            "desc": "填入版块 fid，使用半角逗号隔开"
        }]
    }
    MExt.exportModule(getnewpost);
})();