// ==UserScript==
// @name         工时填写
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  新禅道工时自动填写
// @author       You
// @match        http://10.12.3.139:8090/pro/index.php?m=my&f=task
// @match        http://10.12.3.139:8090/pro/index.php?m=my&f=task&type=assignedTo
// @icon         https://www.google.com/s2/favicons?sz=64&domain=3.139
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461415/%E5%B7%A5%E6%97%B6%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/461415/%E5%B7%A5%E6%97%B6%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==
(function () {

    (function (c) { typeof define == "function" && define.amd ? define(c) : c() })(function () {
        "use strict"; $("#subNavbar>ul").append('<li data-toggle="modal" data-target="#myModal" style="margin-left:10px;background:none;height:40px;display:flex;align-items:center;text-align:center;" class="fillEdit"><a style="background:#1183fb;border-radius:10px;padding-top:4px;padding-bottom:4px;color:#fff;" href="javascript:;">编辑工时</a></li>'), $("#subNavbar").on("click", ".fillEdit", function () { w() }), $("body").on("click", ".fillHour", function () { u() }); function c() {
            let t = localStorage.getItem("data"); t && t != "null" && JSON.parse(t).length ? (JSON.parse(t), $(".headerSwitchParent").length || $("#subNavbar>ul").append(`<li class="headerSwitchParent" style="margin-left:10px;background:none;height:40px;display:flex;align-items:center;text-align:center;">
            <div style="border: 1px solid #1183fb;padding: 0 10px;border-radius:10px;background: #1183fb;
            color: #fff;">
                <div class="headerTswitch text-left">
                    <input ${k()}  type="checkbox"  value="zl">
                    <label>自动填写当天工时</label>
                </div>
                </div></li>`), $(".fillHour").length || $("#subNavbar>ul").append('<li style="margin-left:10px;background:none;height:40px;display:flex;align-items:center;text-align:center;" class="fillHour"><a style="background:#1183fb;border-radius:10px;padding-top:4px;padding-bottom:4px;color:#fff;" href="javascript:;">一键填写当天工时</a></li>')) : ($(".fillHour").remove(), $(".headerSwitchParent").remove())
        } c(); function k() { let t = localStorage.getItem("autoTimeEntrySwitch"); return t && JSON.parse(t) == !0 ? "checked" : "" } $("body").on("change", ".headerTswitch input", function () { $(this).prop("checked") ? localStorage.setItem("autoTimeEntrySwitch", !0) : localStorage.setItem("autoTimeEntrySwitch", !1) }); function u() { let t = null, a = localStorage.getItem("data"); a ? t = JSON.parse(a) : t = []; let e = {}; t.forEach(i => { i.date.forEach((d, s) => { if (new Date(h()).getTime() == new Date(d).getTime()) { let l = /\$\{(.+?)\}/g.exec(i.id); e.id = l ? l[1] : "没找到ID", e.date = d, e.isEnd = i.date.length - 1 == s } }) }); let n = null; const o = $("#myTaskForm tbody tr"); Array.from(o.find(".c-id")).forEach((i, d) => { const s = $(i).text().trim(); parseInt(s) == e.id && (n = o[d]), e.name = o.find(".c-name").attr("title") }); const r = $(n).find(".c-status span").text().trim(); if (r === "未开始") { $(n).find(".c-actions a[title='开始']").click(); let i = null; i = setInterval(function () { $("#triggerModal").is(":hidden") || $("#iframe-triggerModal").contents().find("#submit") && (clearInterval(i), setTimeout(() => { $("#iframe-triggerModal").contents().find("#submit").click(), setTimeout(() => { u() }, 1e3) }, 1e3)) }, 1e3) } else if (r === "进行中") { $(n).find(".c-actions a[title='日志']").click(); let i = $(n).find(".c-hours").eq(0).text().trim(), d = $(n).find(".c-hours").eq(1).text().trim(), s = parseInt(i) - parseInt(d) - 8, l = null; l = setInterval(function () { if (!$("#triggerModal").is(":hidden")) { const b = $("#iframe-triggerModal").contents().find(".main-content table"); let g = null; b.length >= 2 ? g = b.eq(1) : g = b.eq(0); let p = g.find("tbody tr:eq(0) td"); p.length && (clearInterval(l), setTimeout(() => { let S = null; if (b.length >= 2) { let T = $("#iframe-triggerModal").contents().find(".main-content table:eq(0) tbody tr"); Array.from(T).filter(m => $(m).find("td:eq(2)").html().trim() == 8).forEach(m => { let D = $(m).find("td:eq(1)").html().trim(); new Date(D).getTime() == new Date(h()).getTime() && (S = !0) }) } S ? ($(".close").length && $(".close").click(), new $.zui.Messager("当天工时已经填过了, 请勿重复填写", { icon: "bell", type: "warning" }).show()) : (p.eq(1).find("input").val(e.date), p.eq(2).find("input").val(8), p.eq(3).find("input").val(e.isEnd ? 0 : s), p.eq(4).find("textarea").html(e.name), $("#iframe-triggerModal").contents().find("#submit").click(), new $.zui.Messager("工时填写成功", { icon: "bell", type: "success" }).show()), localStorage.setItem("isCurrentDate", h()) }, 500)) } }, 1e3) } } const x = t => `<input style="width:20%;margin:10px;" type="text" class="form-control form-date" value="${t || ""}" placeholder="选择或者输入一个日期">`; function y(t = {}) {
            const a = ["primary"], e = a[Math.floor(Math.random() * a.length)]; let o = ["#3280fc"][a.findIndex(i => i == e)], r = ""; return t.date && t.date.forEach(i => { r += x(i) }), `<div class="panel panel-${e}" style="border-color: ${o};width:100%">
    <div class="panel-heading" style="padding-left:20px;padding-right:20px;display:flex;position:relative;top:-1px;justify-content: space-between;align-items:center;color: #fff;background-color: ${o};border-color: ${o};width: calc(100% + 1px);">
        <div class="title" style="flex:1;min-width:0;padding-right:20px;margin-right:20px;" contenteditable>${t.id || "请填写工时ID (格式: ${74751}-需求名称)"}</div>
        <button type="button" class="btn  btn-mini btn-${e} addDate" style="background: #fff;color: #3280fc;"><i class="icon icon-plus"></i>增加时间</button>
        <button type="button" class="btn  btn-mini btn-${e} removeDate" style="margin-left:10px;font-size:12px;background: #fff;color: #3280fc;"><i class="icon icon-trash" style="font-size:12px;"></i>删除工时</button>
    </div>
    <div class="panel-body" style="display:flex;flex-flow:wrap;padding-top:20px;padding-bottom:20px;">
        ${r}
    </div>

    </div>`} function f() { $(".form-date").datetimepicker({ weekStart: 1, todayBtn: 1, autoclose: 1, todayHighlight: 1, startView: 2, minView: 2, forceParse: 0, format: "yyyy-mm-dd" }) } $("body").append(`<div class="modal fade" id="myModal">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                <h4 class="modal-title">编辑工时 <button type="button" class="btn btn-primary addTime" style="margin-left:20px;"><i class="icon icon-plus"></i>增加工时</button></h4>
            </div>
            <div class="modal-body">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                <button type="button" class="btn btn-primary DateEditSave">保存</button>
            </div>
        </div>
        </div>
    </div>
    `), w(); function w() { let t = localStorage.getItem("data"); t ? t = JSON.parse(t) : t = [{ date: ["", "", "", "", "", "", "", ""] }]; let a = ""; t.forEach(e => { a += y(e) }), $(".modal-body").html(a), f() } $("body").on("click", ".addTime", function () { $(this).parents(".modal-header").siblings(".modal-body").append(y({ date: ["", "", "", "", "", "", "", ""] })), $(window).resize(), f() }), $("body").on("click", ".removeDate", function () { $(this).parents(".panel").remove(), $(window).resize(), f() }), $("body").on("click", ".addDate", function () { $(this).parents(".panel-heading").siblings(".panel-body").append(x()), $(window).resize(), f() }), $("body").on("click", ".DateEditSave", function () { const t = []; $(".modal-body .panel:visible").each(function (a, e) { const n = $(e), o = n.find(".panel-heading .title").html(), r = [], i = /^[0-9,/:-\s]+$/; n.find(".panel-body input").each(function (d, s) { const l = $(s).val(); !isNaN(Date.parse(new Date(l.replace(/-/g, "/")))) && isNaN(l) && i.test(l) && r.push(l) }), t.push({ id: o, date: r }) }), t.length ? localStorage.setItem("data", JSON.stringify(t)) : localStorage.setItem("data", ""), c(), $("#myModal").modal("hide") }); function h() { var t = new Date, a = t.getFullYear(), e = t.getMonth() + 1, n = t.getDate(); return a = a.toString().padStart(4, "0"), e = e.toString().padStart(2, "0"), n = n.toString().padStart(2, "0"), a + "-" + e + "-" + n } $("head").append(`
        <style>
        .headerTswitch {
            position: relative;
        }
        .text-left {
            text-align: left;
        }
        .headerTswitch>input {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            height: 100%;
            margin: 0;
            opacity: 0;
            line-height: normal;
            box-sizing: border-box;
            padding: 0;
        }
        .headerTswitch.text-left>label {
            padding: 5px 35px 5px 0;
            box-sizing: border-box;
        }
        .headerTswitch>label {
            display: block;
            padding: 5px 0 5px 35px;
            margin: 0;
            font-weight: 400;
            line-height: 20px;
        }
        .headerTswitch>input:checked+label:before {
            background-color: #63B8FF ;
            border-color: #63B8FF ;
        }
        .headerTswitch.text-left>label:after, .headerTswitch.text-left>label:before {
            right: 0;
            left: auto;
        }
        .headerTswitch>label:after, .headerTswitch>label:before {
            position: absolute;
            top: 5px;
            left: 0;
            display: block;
            width: 30px;
            height: 20px;
            pointer-events: none;
            content: ' ';
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 10px;
            -webkit-transition: all .4s cubic-bezier(.175,.885,.32,1);
            -o-transition: all .4s cubic-bezier(.175,.885,.32,1);
            transition: all .4s cubic-bezier(.175,.885,.32,1);
        }
        .headerTswitch.text-left>input:checked+label:after {
            right: 1px;
            left: auto;
            top:5.5px;
        }
        .headerTswitch>label:after {
            top: 6px;
            width: 18px;
            height: 18px;
            border-color: #ccc;
            border-radius: 9px;
            -webkit-box-shadow: rgba(0,0,0,.05) 0 1px 4px, rgba(0,0,0,.12) 0 1px 2px;
            box-shadow: rgba(0,0,0,.05) 0 1px 4px, rgba(0,0,0,.12) 0 1px 2px;
        }
        .headerTswitch.text-left>label:after {
            right: 12px;
        }`); let v = localStorage.getItem("autoTimeEntrySwitch"); v && JSON.parse(v) && u()
    });
})();