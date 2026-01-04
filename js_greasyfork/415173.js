// ==UserScript==
// @name         挖矿记录页翻页
// @namespace    https://fang.blog.miri.site
// @version      0.2
// @description  在挖矿记录页显示翻页按钮
// @author       Mr_Fang
// @match        https://www.mcbbs.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415173/%E6%8C%96%E7%9F%BF%E8%AE%B0%E5%BD%95%E9%A1%B5%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/415173/%E6%8C%96%E7%9F%BF%E8%AE%B0%E5%BD%95%E9%A1%B5%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    var storage = window.localStorage;
    if(storage.getItem('wkjl_del') != true){
        showDialog('<style>.alert_right {background-image: none;padding-right: 0px;padding-left: 0px;} .m_c{background: #e74b3c url(https://s1.ax1x.com/2020/05/28/tVeOhQ.jpg) -100px 15px no-repeat; background-size:80%} .m_c .o{ background: #ffffff00;} .alert_right{margin-left: 25%; color: #fff;}</style><font size="4"><b>挖矿记录页翻页脚本已弃用</b></font><p>挖矿记录页显示信息不正确的问题已在<a>11月更新</a>修复，为防止冲突，请禁用或删除此脚本。</p>',
                   'right',
                   '<font color="#fff">提示</font>',
                   function() {
            storage["wkjl_del"] = true;
        },
                   true,
                   {},
                   '<span onclick="showWindow(\'mbg_box\', \'https://www.mcbbs.net/home.php?mod=space&uid=1970274\')" style="color: #fff;" title="点击打开">开发者</span>'
                  );
    }
    /*
    var log = (m) => {
        console.log("[UserScrip] " + m);
    }
    var filename = window.location.href.split("/").slice(window.location.href.split("/").length - 1,window.location.href.split("/").length).toString(String).split(".")[0];
    function GetQueryValue(queryName) {
        var query = decodeURI(window.location.search.substring(1));
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == queryName) { return pair[1]; }
        }
        return null;
    }

    var page = parseInt(GetQueryValue('page'));
    var prev;
    var nxt;
    var ft = GetQueryValue('ft');

    log('本页表格行数：'+jq('table.dt.mtm>tbody').children('tr').length);
    log('首页第一条挖矿记录时间：' + ft);
    log('本页第一条挖矿记录时间：' + jq("table.dt.mtm>tbody>tr:nth-child(2)>td:last-child").text());

    if(GetQueryValue('page') == null || GetQueryValue('page') < 1){
        nxt = 2;
        page = 1;
    }else{
        prev = page - 1;
        nxt = page + 1;
    }


    if(page == 1 && ft == null){
        ft = jq("table.dt.mtm>tbody>tr:nth-child(2)>td:last-child").text();
    }else if(page != 1 && ft == null){
        window.location.href = "plugin.php?id=mcbbs_lucky_card:prize_pool&action=log&page=1";
    }

    var prev_html = "";
    var nxt_html = "";
    if(page > 1){
        prev_html = '<a href="plugin.php?id=mcbbs_lucky_card:prize_pool&action=log&page=' + prev + '&ft=' + ft + '" class="prev">上一页</a>'
    }
    if(jq('table.dt.mtm>tbody').children('tr').length == 21){
        nxt_html = '<a href="plugin.php?id=mcbbs_lucky_card:prize_pool&action=log&page=' + nxt + '&ft=' + ft + '" class="nxt">下一页</a>';
    }

    if(page != 1 && ft == jq("table.dt.mtm>tbody>tr:nth-child(2)>td:last-child").text()){
        prev_html = "";
        page = 1;
        nxt = page + 1;
        nxt_html = '<a href="plugin.php?id=mcbbs_lucky_card:prize_pool&action=log&page=' + nxt + '&ft=' + ft + '" class="nxt">下一页</a>';
    }

    if(GetQueryValue('id') == "mcbbs_lucky_card:prize_pool" && GetQueryValue('action') == "log"){
        jq('.bm.bw0').append(`
<div class="pg">` + prev_html + `<strong>` + page + `</strong>` + nxt_html + `</div>
`);
    }
    */

})();