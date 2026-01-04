// ==UserScript==
// @name         显示上一个帖子
// @version      0.9.0
// @include      https://www.mcbbs.net/home.php?mod=space&uid=*
// @include      https://www.mcbbs.net/home.php?mod=space&username=*
// @include      https://www.mcbbs.net/?*
// @author       xmdhs
// @description  显示警告次数。
// @namespace https://greasyfork.org/users/166541
// @downloadURL https://update.greasyfork.org/scripts/396927/%E6%98%BE%E7%A4%BA%E4%B8%8A%E4%B8%80%E4%B8%AA%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/396927/%E6%98%BE%E7%A4%BA%E4%B8%8A%E4%B8%80%E4%B8%AA%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(async function () {
    let uidtemp = document.querySelector("#uhd > div.h.cl > div > a");
    let uid = new URLSearchParams(uidtemp.href).get("uid");
    let c = document.getElementsByClassName("pf_l cl pbm mbm");
    let f1 = jg(uid);
    let f2 = bancase(uid);
    
    await Promise.all([f1, f2])

    fetch("https://www.mcbbs.net/home.php?mod=space&uid=" + uid + "&do=index&additional=removevlog")

    async function jg(uid) {
        let f = await fetch("forum.php?mod=misc&action=viewwarning&tid=233&uid=" + uid + "&infloat=yes&handlekey=viewwarning&inajax=1&ajaxtarget=fwin_content_viewwarning")
        let a = await f.text()
        var b = a.indexOf('已被累计警告');
        var q = a.indexOf('次，5 天内累计被警告 3 次');
        var d = a.substring(b + 7, q - 1);
        var e = location.origin + "/forum.php?mod=misc&action=viewwarning&tid=233&uid=" + uid;
        if (d > 0) {
            c[0].childNodes[1].innerHTML = '<a href="' + e + '" target="_blank" onclick="showWindow(\'viewwarning\', this.href)"><em>警告次数</em>' + d + "次</a>";
        };
    }

    async function bancase(uid) {
        let group = document.querySelector("#ct > div a[href^='home.php?mod=spacecp&ac=usergroup&gid=']:not(a[href='home.php?mod=spacecp&ac=usergroup&gid=-1'])")
        if (group == null) {
            return
        }
        let f = await fetch("https://cdn.jsdelivr.net/gh/xxmdhs/showdarkroom@master/data.json")
        let result = await f.json()
        let a = result.data[uid]

        if (a == undefined) {
            return
        }

        let l = []
        for (const key in a) {
            l.push(a[key])
        }
        l.sort((a, b) => {
            return b.dateline - a.dateline
        })
        let b = l[0]
        let link = `https://www.mcbbs.net/home.php?mod=space&uid=` + b.operatorid
        let reason = `</br>操作者：<a href="${link}" target="_blank">${htmlEncode(b.operator)}</a></br>操作时间：` +
            htmlEncode(transformTime(b.dateline))
            + "</br>操作理由：" + htmlEncode(b.reason)

        group.parentNode.parentNode.innerHTML += reason
    }

    function htmlEncode(str) {
        var ele = document.createElement('span');
        ele.appendChild(document.createTextNode(str));
        return ele.innerHTML;
    }

    function transformTime(timestamp) {
        if (typeof timestamp == "string") {
            if (!isNaN(new Number(timestamp))) {
                var time = new Date(timestamp * 1000);
                var y = time.getFullYear();
                var M = time.getMonth() + 1;
                var d = time.getDate();
                var h = time.getHours();
                var m = time.getMinutes();
                return y + '-' + addZero(M) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(m)
            } else {
                return timestamp
            }
        } else {
            return '';
        }
    }
    function addZero(m) {
        return m < 10 ? '0' + m : m;
    }
}
)();
