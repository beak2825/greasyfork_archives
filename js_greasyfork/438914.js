// ==UserScript==
// @name         淘宝日报-导出表格到excel-测试版
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  描述：淘宝日报-导出表格到excel-测试版；路径：sycm-自助分析-个人空间-应用报表-基础日报
// @author       pan
// @match        https://bi.taobao.com/dashboard/view/pc.htm?pageId=*
// @icon         https://www.taobao.com/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438914/%E6%B7%98%E5%AE%9D%E6%97%A5%E6%8A%A5-%E5%AF%BC%E5%87%BA%E8%A1%A8%E6%A0%BC%E5%88%B0excel-%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/438914/%E6%B7%98%E5%AE%9D%E6%97%A5%E6%8A%A5-%E5%AF%BC%E5%87%BA%E8%A1%A8%E6%A0%BC%E5%88%B0excel-%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==
var va, vc, vb = !1;

function fb() {
    $("div.component-card-wrapper div.query-buttom-areas").length > 0 && ($(
        "div.component-card-wrapper div.query-buttom-areas").eq(0).prepend(
        '<button type="button" class="xcxd_auto_add_export_btn ant-btn query-area-btn ant-btn-primary" style="width:auto;padding-left:5px;padding-right:5px;"><span>点击开启：表格自动追加导出按钮</span></button>'
    ), fd(), clearInterval(va))
}

function fd() {
    $("button.xcxd_auto_add_export_btn").unbind(), $("button.xcxd_auto_add_export_btn").click(function() {
        0 == vb ? ($("button.xcxd_auto_add_export_btn span").html("点击关闭：表格自动追加导出按钮"), $(
            "button.xcxd_auto_add_export_btn").css("color", "#2153d4"), $(
            "button.xcxd_auto_add_export_btn").css("background", "#fff"), vb = !0, vc = setInterval(
            function() {
                fc()
            }, 100)) : ($("button.xcxd_auto_add_export_btn span").html("点击开启：表格自动追加导出按钮"), $(
            "button.xcxd_auto_add_export_btn").css("color", "#fff"), $(
            "button.xcxd_auto_add_export_btn").css("background", "#2153d4"), vb = !1, clearInterval(vc))
    })
}

function fc() {
    $("div.ant-modal-content").find("div.ant-modal-footer").find("button.xcxd_export_btn").length > 0 || "数据信息" == $(
        "div.ant-modal-content").find("div.ant-modal-header").eq(0).find("div.ant-modal-title").text() && ($(
        "div.ant-modal-content").find("div.ant-modal-footer").eq(0).prepend(
        '<button type="button" class="xcxd_export_btn ant-btn query-area-btn ant-btn-primary" style="width:auto;padding-left:5px;padding-right:5px;"><span>导出表格到excel</span></button>'
    ), fe())
}

function fe() {
    $("button.xcxd_export_btn").unbind(), $("button.xcxd_export_btn").click(function() {

        $("div.xcxd_export_div").remove(), $("div.ant-modal-content").append(
            '<div class="xcxd_export_div" style="display:none"><table><thead><tr></tr></thead><tbody></tbody></table></div>'
        );

        fstl(0, 0);
    })
}

async function fstl(r, c) {
    $("div.ant-modal-body div.main-content div.row:first span.table-cell:first")[0].scrollIntoView({ block: 'end', inline: 'start' })
    await sleep(100);
    var nr = $("div.ant-modal-body div.main-content div.row:first").find("span.table-cell:first").attr("row-guid");
    var nc = $("div.ant-modal-body div.main-content div.row:first").find("span.table-cell:first").attr("column-guid");
    r != nr || c != nc ? (await fstl(nr, nc)) : (await sleep(1000), await fit())
}
async function fst(r) {
    $("div.ant-modal-body div.main-content div.row:first")[0].scrollIntoView(1)
    await sleep(100);
    var nr = $("div.ant-modal-body div.main-content div.row:first").find("span.table-cell:first").attr("row-guid");
    r != nr ? await fst(nr) : await sleep(100)
}
async function fit() {
    var h;

    $("div.ant-modal-body div.top-header span.table-cell").each(function() {
        var this_row_id = $(this).attr("row-guid");
        var this_col_id = $(this).attr("column-guid");
        h = h + "<th row_id='" + this_row_id + "' col_id='" + this_col_id + "'>" + $(this).html() + "</th>"
    })
    $("div.xcxd_export_div table thead tr").html(h)
    await sleep(100);
    var c = $("div.ant-modal-body div.main-content div.row:first span.table-cell:last").attr("column-guid")
    await fs(0, c)
}


function sleep(t) {
    return new Promise(e => setTimeout(e, t))
}

async function fs(r, c) {

    $("button.xcxd_export_btn span").html("导出表格中......")

    var th_cnt = $("div.ant-modal-body div.top-header span.table-cell").length
    if (c != 0) {
        for (var i = 1; i <= th_cnt - 1; i++) {
            var this_row_id = $("div.ant-modal-body div.top-header span.table-cell").eq(i).attr("row-guid")
            var this_col_id = $("div.ant-modal-body div.top-header span.table-cell").eq(i).attr("column-guid")
            var this_html = $("div.ant-modal-body div.top-header span.table-cell").eq(i).html()
            var prev_col_id = $("div.ant-modal-body div.top-header span.table-cell").eq(i - 1).attr("column-guid")

            var this_col_len = $("div.xcxd_export_div table thead tr th[col_id='" + this_col_id + "']").length
            if (this_col_len == 0) {
                var this_th_text = "<th row_id='" + this_row_id + "' col_id='" + this_col_id + "'>" + this_html + "</th>"
                $("div.xcxd_export_div table thead tr th[col_id='" + prev_col_id + "']").after(this_th_text)
            }
        }
    }

    var row_cnt = $("div.ant-modal-body div.main-content div.row").length
    $("div.ant-modal-body div.main-content div.row").each(function() {
        var this_row = $(this);
        var col_cnt = this_row.find("span.table-cell").length

        for (var i = 0; i <= col_cnt - 1; i++) {

            var this_row_id = this_row.find("span.table-cell").eq(i).attr("row-guid")
            var this_col_id = this_row.find("span.table-cell").eq(i).attr("column-guid")
            var this_html = this_row.find("span.table-cell").eq(i).html()
            var prev_col_id = this_row.find("span.table-cell").eq(i - 1).attr("column-guid")

            var this_row_len = $("div.xcxd_export_div table tbody tr[row_id='" + this_row_id + "']").length
            if (this_row_len == 0) {
                var this_tr_text = "<tr row_id='" + this_row_id + "'><td row_id='" + this_row_id + "' col_id='" + this_col_id + "'>" + this_html + "</td></tr>"
                $("div.xcxd_export_div table tbody").append(this_tr_text)
            } else {
                var this_col_len = $("div.xcxd_export_div table tbody tr[row_id='" + this_row_id + "'] td[col_id='" + this_col_id + "']").length
                if (this_col_len == 0) {
                    var this_td_text = "<td row_id='" + this_row_id + "' col_id='" + this_col_id + "'>" + this_html + "</td>"
                    $("div.xcxd_export_div table tbody tr[row_id='" + this_row_id + "'] td[col_id='" + prev_col_id + "']").after(this_td_text)
                }
            }
        }
    })

    $("div.ant-modal-body div.main-content div.row:last")[0].scrollIntoView(1)
    await sleep(100)
    var new_last_row_id = $("div.ant-modal-body div.main-content div.row:last span.table-cell:first").attr("row-guid")
    if (r != new_last_row_id) {
        await fs(new_last_row_id, c)
    } else {
        await fst(0)
        var mid_ind = Math.ceil(th_cnt * 3 / 4)
        try{
            $("div.ant-modal-body div.main-content div.row:first span.table-cell").eq(mid_ind)[0].scrollIntoView({ block: 'start', inline: 'start' })
        }catch(err){
            console.log("scrollIntoView error -->",err)
        }
        await sleep(100)
        var new_last_col_id = $("div.ant-modal-body div.main-content div.row:first span.table-cell:last").attr("column-guid")
        if (c != new_last_col_id) {
            await fs(0, new_last_col_id)
        } else {

            $("button.xcxd_export_btn span").html("导出表格到excel")

            var e = (new Date).Format("yyyy-MM-dd_HH:mm:ss")
            var a = "export-" + e + ".xls",
                d = XLSX.utils.book_new(),
                o = XLSX.utils.table_to_sheet($("div.xcxd_export_div table")[0]);
            XLSX.utils.book_append_sheet(d, o, "Sheet1"), XLSX.writeFile(d, a)
        }
    }
}

function fa(t, e) {
    var n = document.createElement("script");
    n.type = "text/javascript", void 0 !== e && (n.readyState ? n.onreadystatechange = function() {
        "loaded" != n.readyState && "complete" != n.readyState || (n.onreadystatechange = null, e())
    } : n.onload = function() {
        e()
    }), n.src = t, document.body.appendChild(n)
}
fa("https://bangbangdegithub.github.io/src/js/jquery.table2excel.min.js"), fa(
    "https://bangbangdegithub.github.io/src/js/xlsx.full.min.js"), vb = !0, vc = setInterval(function() {
    fc()
}, 100), Date.prototype.Format = function(t) {
    var e = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    for (var n in /(y+)/.test(t) && (t = t.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))),
            e) new RegExp("(" + n + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[n] : ("00" +
        e[n]).substr(("" + e[n]).length)));
    return t
};