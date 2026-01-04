// ==UserScript==
// @name         永恒珠宝国服查询插件
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  poe永恒珠宝国服查询插件
// @author       zql
// @license      MIT
// @match        https://vilsol.github.io/timeless-jewels/tree
// @icon         https://vilsol.github.io/timeless-jewels/favicon.png

// @require      https://unpkg.com/jquery

// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/482807/%E6%B0%B8%E6%81%92%E7%8F%A0%E5%AE%9D%E5%9B%BD%E6%9C%8D%E6%9F%A5%E8%AF%A2%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/482807/%E6%B0%B8%E6%81%92%E7%8F%A0%E5%AE%9D%E5%9B%BD%E6%9C%8D%E6%9F%A5%E8%AF%A2%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

unsafeWindow.GM_setValue = GM_setValue;
unsafeWindow.GM_getValue = GM_getValue;
unsafeWindow.GM_addStyle = GM_addStyle;
unsafeWindow.GM_deleteValue = GM_deleteValue;
unsafeWindow.GM_listValues = GM_listValues;
unsafeWindow.GM_addValueChangeListener = GM_addValueChangeListener;
unsafeWindow.GM_removeValueChangeListener = GM_removeValueChangeListener;
unsafeWindow.GM_log = GM_log;
unsafeWindow.GM_getResourceText = GM_getResourceText;
unsafeWindow.GM_getResourceURL = GM_getResourceURL;
unsafeWindow.GM_registerMenuCommand = GM_registerMenuCommand;
unsafeWindow.GM_unregisterMenuCommand = GM_unregisterMenuCommand;
unsafeWindow.GM_openInTab = GM_openInTab;
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
unsafeWindow.GM_download = GM_download;
unsafeWindow.GM_notification = GM_notification;
unsafeWindow.GM_setClipboard = GM_setClipboard;
unsafeWindow.GM_info = GM_info;

var css = `
button.query_btn_class {
    position: absolute;
    right: 80px;
    top: 17px;
    height: 24px;
    line-height: 24px;
    border: 1px solid transparent;
    padding: 0 18px;
    background-color: #009688;
    color: #fff;
    white-space: nowrap;
    text-align: center;
    font-size: 14px;
    border-radius: 2px;
    cursor: pointer;
}
`

GM_addStyle(css);

(function () {
    //url为国服交易集市
    var baseUrl = "https://poe.game.qq.com/trade/search/S25%E8%B5%9B%E5%AD%A3";
    var placeholder = 'diablo';
    var key = "";
    var condition_map = {
        "Glorious Vanity": '{"query":{"status":{"option":"any"},"name":"光彩夺目","type":"永恒珠宝","stats":[{"type":"count","filters":[{"id":"explicit.pseudo_timeless_jewel_ahuana","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_xibaqua","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_doryani","disabled":false,"value":{"min":diablo,"max":diablo}},{"id":"explicit.pseudo_timeless_jewel_zerphi","value":{"min":diablo,"max":diablo},"disabled":false}],"disabled":false,"value":{"min":1}}]},"sort":{"price":"asc"}}',
        "Lethal Pride": '{"query":{"status":{"option":"any"},"name":"致命的骄傲","type":"永恒珠宝","stats":[{"type":"count","filters":[{"id":"explicit.pseudo_timeless_jewel_kaom","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_rakiata","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_kiloava","disabled":false,"value":{"min":diablo,"max":diablo}},{"id":"explicit.pseudo_timeless_jewel_akoya","value":{"min":diablo,"max":diablo},"disabled":false}],"disabled":false,"value":{"min":1}}]},"sort":{"price":"asc"}}',
        "Brutal Restraint": '{"query":{"status":{"option":"any"},"name":"残酷的约束","type":"永恒珠宝","stats":[{"type":"count","filters":[{"id":"explicit.pseudo_timeless_jewel_deshret","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_balbala","disabled":false,"value":{"min":diablo,"max":diablo}},{"id":"explicit.pseudo_timeless_jewel_asenath","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_nasima","value":{"min":diablo,"max":diablo},"disabled":false}],"disabled":false,"value":{"min":1}}]},"sort":{"price":"asc"}}',
        "Militant Faith": '{"query":{"status":{"option":"any"},"name":"好战的信仰","type":"永恒珠宝","stats":[{"type":"count","filters":[{"id":"explicit.pseudo_timeless_jewel_venarius","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_maxarius","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_dominus","disabled":false,"value":{"min":diablo,"max":diablo}},{"id":"explicit.pseudo_timeless_jewel_avarius","value":{"min":diablo,"max":diablo},"disabled":false}],"disabled":false,"value":{"min":1}}]},"sort":{"price":"asc"}}',
        "Elegant Hubris": '{"query":{"status":{"option":"any"},"name":"优雅的狂妄","type":"永恒珠宝","stats":[{"type":"count","filters":[{"id":"explicit.pseudo_timeless_jewel_cadiro","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_victario","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_caspiro","value":{"min":diablo,"max":diablo},"disabled":false},{"id":"explicit.pseudo_timeless_jewel_chitus","value":{"min":diablo,"max":diablo},"disabled":false}],"disabled":false,"value":{"min":1}}]},"sort":{"price":"asc"}}'
    };
    //使用翻译的时候进行转换
    var key_map = {
        "光荣":"Glorious Vanity",
        "虚荣":"Glorious Vanity",
        "致命":"Lethal Pride",
        "骄傲":"Lethal Pride",
        "残酷":"Brutal Restraint",
        "约束":"Brutal Restraint",
        "克制":"Brutal Restraint",
        "信仰":"Militant Faith",
        "优雅":"Elegant Hubris",
        "狂妄":"Elegant Hubris",
        "傲慢":"Elegant Hubris"
    };
    //1秒钟检查一次
    setInterval(function () {
        //当search点击的时候
        search_onclick();
        //给item添加查询按钮
        add_query_btn();

    }, 1000);

    unsafeWindow.add_query_btn = function () {
        //item里面查询是否存在查询按钮，不存在即是添加
        $("div.my-2 .flex").each(function () {
            if ($(this).children().is(".query_btn_class")) {
                return;
            }
            //获取Seed
            var str = $(this).children(".text-center").text();
            var arr = str.split(" ");
            var seed = arr[1].replace(/[^\d.-]/g, '');

            //定义星团珠宝名称
            let query_btn = '<button class="query_btn_class" onclick="query(this)" seed="' + seed + '">查询-' + seed + '</button>';
            $(this).append(query_btn);
        });
    }

    unsafeWindow.query = function (e) {
        var seed = $(e).attr("seed");
        var condition =condition_map[key].replaceAll(placeholder, seed);
        if (condition.length <= 0) {
            return;
        }
        var url = baseUrl + "?q=" + condition;
        console.log(url);
        window.open(url);
    }

    unsafeWindow.search_onclick = function () {
        //当search按钮触发点击事件
        var obj_serach_btn = $("div.w-screen .p-4 .flex .mt-2 .flex-grow");
        $(obj_serach_btn).on('click', function () {
            //获取星团珠宝名称
            var obj_name = $("div.w-screen .p-4").children(".svelte-select").find("div.selected-item");
            if (key == $(obj_name).text()) {
                return;
            }
            //key = $(obj_name).text();
            get_key($(obj_name).text());
        });
    }

    unsafeWindow.get_key = function (e) {
        $.each(key_map, function (k, value) {
            if (e.indexOf(k) > 0) {
                key = value;
                return false;
            }
        });
        if (key == "") {
            key = e;
        }
    }

})();