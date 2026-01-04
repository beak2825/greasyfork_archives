// ==UserScript==
// @name         SQL查询注入ocr_results可视化
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.2.0
// @description  用于在【DataWorks - SQL查询】页面可视化`ocr_results`字段
// @author       Asterisk
// @license      MIT
// @match        https://da-cn-shanghai.data.aliyun.com/#/query
// @match        https://da-cn-shanghai.data.aliyun.com/query*
// @match        https://da-cn-shanghai.data.aliyun.com*query
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.7.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/d3/7.6.1/d3.min.js
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/503084/SQL%E6%9F%A5%E8%AF%A2%E6%B3%A8%E5%85%A5ocr_results%E5%8F%AF%E8%A7%86%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/503084/SQL%E6%9F%A5%E8%AF%A2%E6%B3%A8%E5%85%A5ocr_results%E5%8F%AF%E8%A7%86%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let ocrres_text = "";
    let is_landscape = false;

    function paste_to_set_bgimage(e) {
        let file = null
        let event = e.originalEvent
        let items = event.clipboardData && event.clipboardData.items;
        if (items && items.length) {
            $.each(items, function (index, item) {
                if (item.type.indexOf('image') !== -1) {
                    file = item.getAsFile();
                    return false;  // 即 break
                }
            });
        }
        if (file && ["image/png", "image/jpeg"].includes(file.type)) {
            $("#bgpic").attr("src", URL.createObjectURL(file))
        }
    }

    function ocrres_visualization() {
        let jsondata = null;
        try {
            jsondata = JSON.parse(ocrres_text)
            if (jsondata == null || !Array.isArray(jsondata))
                throw new Error("json string parse failed")
        }
        catch (error) {
            console.log("user script", error, jsondata)
            return;
        }

        $(".dc-dialog").width(820)  // dc-dialog dc-closeable dc-overlay-inner dc-dialog-quick
        $(".dc-ui-json-view").width(756).css("position", "relative")
        // $(".dc-ui-json-view").empty();
        $(".dc-ui-json-view").html('<img id="bgpic" /><div id="jsonparse" style="width: 720px; position: relative; z-index: 2;"></div>');

        $("#jsonparse").empty().bind("paste", paste_to_set_bgimage)

        // $("#jsonparse").css("background-image", "url(https://s1.ax1x.com/2022/10/08/xGnvuD.png)")
        // $("#jsonparse").css("background-repeat", "no-repeat")
        let canvas_width = is_landscape ? 1280 : 720,
            canvas_height = is_landscape ? 720 : 1280;
        $("#bgpic").css({
            "width": canvas_width, "height": canvas_height,
            "opacity": "0.4", "z-index": 1, "object-fit": "contain",
            "position": "absolute", "left": 8, "top": 8
        })
        let svg = d3.select("#jsonparse").append("svg")
            .attr("width", canvas_width).attr("height", canvas_height)
            .style("background-image", "url('https://s1.ax1x.com/2022/10/08/xGnvuD.png')")
            .style("border", "0.1px solid #aaa")
        svg.selectAll("rect").data(jsondata).enter()
            .append("rect")
            .attr("fill-opacity", 0.5).attr("stroke", "white").attr("stroke-width", "0.1").attr("stroke-opacity", "0.8")
            .attr("x", w => w.position.left).attr("y", w => w.position.top).attr("width", w => w.position.width).attr("height", w => w.position.height);
        svg.selectAll("text").data(jsondata).enter()
            .append("text").text(w => w.words)
            .attr("fill", "white").attr("font-size", w => (w.position.height < 12 ? w.position.height : 12) + "px")
            .attr("x", w => w.position.left).attr("y", w => (w.position.top + w.position.height / 2 - 5)).attr("width", w => w.position.width).attr("height", w => w.position.height)
            .style("transform", "matrix(1, 0, 0, 1, 0, 7)")
    }

    function btnJsonView_onclicked() {
        // 2023-12-06 className update: excel-detail-dialog-footer -> field-detail-footer
        // 2024-08-10 className update: dc-dialog > dc-dialog-footer > field-detail-footer > field-detail-footer-right
        let footer_children = $(".field-detail-footer-right").children()
        if (footer_children.length < 1) return;
        if (footer_children.length === 3) {
            let btnJsonView = $(footer_children).first()
            let btnD3JS = $(btnJsonView).clone()
            $(btnD3JS).html('<span class="dc-btn-helper">可视化</span>')
            $(btnD3JS).bind("click", ocrres_visualization)
            $(btnJsonView).after(btnD3JS)
            let spanchkScreenOrien = $(btnJsonView).clone()  // dc-btn-normal
            $(spanchkScreenOrien).html('<span class="dc-btn-helper"><input type="checkbox" id="chkScreenOrien"> <label for="chkScreenOrien" style="vertical-align: top">横屏</label></span>')
            $(btnD3JS).after(spanchkScreenOrien)
        } else {
            $(footer_children).eq(1).bind("click", ocrres_visualization)
        }
        $("#chkScreenOrien").change(function () {
            is_landscape = $(this).prop("checked")
            if ($("#jsonparse").length > 0) ocrres_visualization()
        })
    }

    function btnTextView_onclicked() {
        let textarea = $(".dc-dialog-body > span.dc-input-textarea > textarea")
        if (textarea.length > 0) ocrres_text = $(textarea).val()
    }

    const map_btn_func = {
        "文本视图": btnTextView_onclicked,
        "JSON视图": btnJsonView_onclicked
    }

    function btnView_onclicked() {
        let btn_func = map_btn_func[$(this).text()]
        if (btn_func) setTimeout(btn_func, 1000)
    }

    setInterval(function () {
        try {
            $('button.dc-btn.dc-medium.dc-btn-primary.dc-btn-text').bind('click', btnView_onclicked);
        } catch (error) {
            console.log("user script", error)
        }
    }, 1000);
})();