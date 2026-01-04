// ==UserScript==
// @name         医维盟增强
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  给缺七少八的wms增加一些本应该存在的功能
// @author       Shira
// @match        http://sdkb.yiweimenggdtc.com/*
// @match        http://120.76.203.23:8088/*
// @icon         https://i.postimg.cc/pdgFmbLs/98fe540071946827a54044b61c537b32.jpg
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_cookie
// @grant        GM.cookie
// @require      https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.inview/1.0.0/jquery.inview.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516345/%E5%8C%BB%E7%BB%B4%E7%9B%9F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/516345/%E5%8C%BB%E7%BB%B4%E7%9B%9F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let plugin_url = "https://plugin.kebangmed.cn";
    let url_prefix = "wms";

    if (window.location.hostname == "120.76.203.23") {
        url_prefix = "wms_gd_test";
        // plugin_url = "http://127.0.0.1:8000";
    }

    let random_img_url = `https://files.kebangmed.cn/plugin/img/${Math.floor(Math.random() * 188) + 1}.webp`;

    // 定义渲染器函数
    const renderer_func = {
        r_dw: function (val, matedate, record) {//数量+商品基本单位
            if (val == '' || val == undefined || record.sscBasicCommodityUnit == undefined) {
                return val;
            }
            return val + record.sscBasicCommodityUnit;
        },
        r_bz: function (val, matedate, record) {//包装大小+商品基本单位/商品箱单位
            if (record.sscBasicCommodityUnit == undefined || record.sscSkuBoxUnit == undefined) {
                return val;
            }
            return val + record.sscBasicCommodityUnit + '/' + record.sscSkuBoxUnit;
        },
        r_js: function (val, matedate, record) {//件数+商品箱单位
            if (val == '' || val == undefined || record.sscSkuBoxUnit == undefined) {
                return val;
            }
            return val + record.sscSkuBoxUnit;
        },
        r_status: function (v) {
            return $(PubFunc.columns_render_oppose('', '整箱', v)).text();
        },
        //续费类型
        r_renewType: function (v) {
            var cfg = [{
                value: "试用开通",
                bgColor: "#7E7E7E",
                fontColor: "#fff"
            }, {
                value: "初次开通",
                bgColor: "#AE981B",
                fontColor: "#fff"
            }, {
                value: "免费开通",
                bgColor: "#CC3300",
                fontColor: "#fff"
            }, {
                value: "正常续费",
                bgColor: "#488E48",
                fontColor: "#fff"
            }];
            return $(PubFunc.renderDom_field(v, cfg)).text();
        },
        //工作流状态
        r_workState: function (v) {
            var cfg = [{
                value: "草稿",
                bgColor: "#7E7E7E",
                fontColor: "#fff"
            }, {
                value: "待审批",
                bgColor: "#AE981B",
                fontColor: "#fff"
            }, {
                value: "审批通过",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {
                value: "审批未通过",
                bgColor: "#CC3300",
                fontColor: "#fff"
            }];
            return $(PubFunc.renderDom_field(v, cfg)).text();
        },
        //不合格品种审核状态
        r_orderState: function (v) {
            var cfg = [{
                value: "已审批待销毁",
                bgColor: "#AE981B",
                fontColor: "#fff"
            }, {
                value: "已审批已销毁",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {
                value: "待审批",
                bgColor: "#CC3300",
                fontColor: "#fff"
            }];
            return $(PubFunc.renderDom_field(v, cfg)).text();
        },
        //预警颜色
        r_colour: function (v) {
            var cfg = [{
                value: "绿",
                bgColor: "#3FFF00",
                fontColor: "#666"
            }, {
                value: "黄",
                bgColor: "#F0FEA7",
                fontColor: "#666"
            }, {
                value: "橙",
                bgColor: "#FFA84D",
                fontColor: "#666"
            }, {
                value: "红",
                bgColor: "#CC3300",
                fontColor: "#fff"
            }];
            return $(PubFunc.warning_colour(String(v), cfg)).text();
        },
        //内部状态
        r_enabled: function (v) {
            return PubFunc.columns_render_oppose('启用', '停用', v);
        },
        r_yesAndno: function (v) {
            return PubFunc.columns_render_oppose('是', '否', v);
        },
        //支付情况
        r_pay: function (v) {
            return PubFunc.columns_render_oppose('已支付', '未支付', v);
        },
        //租期状态
        r_rentState: function (v) {
            var cfg = [{
                value: "未投放",
                bgColor: "#AE981B",
                fontColor: "#fff"
            }, {
                value: "投放中",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {
                value: "已过期",
                bgColor: "#ccc",
                fontColor: "#fff"
            }];
            return $(PubFunc.renderDom_field(v, cfg)).text();
        },
        //图片
        render_img: function (value) {
            var basePath = parent.environment == "development" ? contextPath + "/upload/" : "/upload/";
            if (value != "" && value != undefined) {
                return "<div><img src='" + basePath + value + "' width=50 height=50></div>";
            } else {
                return "<div style='color: #a0a0a0;'>--未上传--</div>"
            }
        },
        //出入库类型
        in_and_out: function (v) {
            var cfg = [
                //入库类型
                {
                    value: "进货入库",
                    bgColor: "#488E48",
                    fontColor: "#fff"
                }, {
                    value: "销退入库",
                    bgColor: "#e4674a",
                    fontColor: "#fff"
                }, {
                    value: "移库入库",
                    bgColor: "#7b94dd",
                    fontColor: "#fff"
                }, {
                    value: "还货入库",
                    bgColor: "#7b94dd",
                    fontColor: "#fff"
                },
                //出库类型
                {
                    value: "销售",
                    bgColor: "#488E48",
                    fontColor: "#fff"
                }, {
                    value: "进退",
                    bgColor: "#e4674a",
                    fontColor: "#fff"
                }];
            return $(PubFunc.renderDom_field(v, cfg)).text();
        },

        // 收货状态
        receiving_status: function (v) {
            var cfg = [
                //入库类型
                {
                    value: "上架中",
                    bgColor: "#488E48",
                    fontColor: "#fff"
                }, {
                    value: "待收货",
                    bgColor: "#e4674a",
                    fontColor: "#fff"
                }, {
                    value: "待确认",
                    bgColor: "#81e34d",
                    fontColor: "#fff"
                }, {
                    value: "已收货",
                    bgColor: "#cebd5a",
                    fontColor: "#fff"
                },
                {
                    value: "已拒收",
                    bgColor: "#ea6f6b",
                    fontColor: "#fff"
                }, {
                    value: "待货主修改",
                    bgColor: "#f83c71",
                    fontColor: "#fff"
                }, {
                    value: "待验收",
                    bgColor: "#46ef98",
                    fontColor: "#fff"
                }, {
                    value: "待上架",
                    bgColor: "#16f6b6",
                    fontColor: "#fff"
                }, {
                    value: "其它",
                    bgColor: "#f0f0f0",
                    fontColor: "#000"
                }
            ];
            return $(PubFunc.renderDom_field(v, cfg)).text();
        },
        //常用单据状态
        r_com_status: function (v) {
            var cfg = [{
                value: "作废",
                bgColor: "#ccc",
                fontColor: "#e41114"
            }, {
                value: "中止",
                bgColor: "#ccc",
                fontColor: "#e41114"
            }, {
                value: "录入",
                bgColor: "#90ae84",
                fontColor: "#fff"
            }, {
                value: "初始",
                bgColor: "#c9d7ad",
                fontColor: "#666"
            }, {
                value: "收货完成",
                bgColor: "#7b94dd",
                fontColor: "#fff"
            }, {
                value: "验收确认",
                bgColor: "#e4674a",
                fontColor: "#fff"
            }, {
                value: "完成",
                bgColor: "#e4de4f",
                fontColor: "#333"
            }, {
                value: "上架",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {
                value: "确认",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {
                value: "确定",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {//质量状态
                value: "合格",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {
                value: "不合格",
                bgColor: "#e4674a",
                fontColor: "#fff"
            }, {
                value: "待复检",
                bgColor: "#e4de4f",
                fontColor: "#333"
            }, {
                value: "短少",
                bgColor: "#e4de4f",
                fontColor: "#333"
            }, {
                value: "见备注",
                bgColor: "#7b94dd",
                fontColor: "#fff"
            }, {//出库相关状态
                value: "删除",
                bgColor: "#ccc",
                fontColor: "#e41114"
            }, {
                value: "挂起",
                bgColor: "#ccc",
                fontColor: "#e41114"
            }, {
                value: "配货完成",
                bgColor: "#7b94dd",
                fontColor: "#fff"
            }, {
                value: "拣选",
                bgColor: "#7ca4dd",
                fontColor: "#fff"
            }, {
                value: "复核",
                bgColor: "#e4de4f",
                fontColor: "#333"
            }, {
                value: "释放",
                bgColor: "#e4674a",
                fontColor: "#fff"
            }, {
                value: "装箱复核",
                bgColor: "#e4de4f",
                fontColor: "#333"
            }, {
                value: "备货完工",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {
                value: "完工",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {
                value: "医院",
                bgColor: "#E08031",
                fontColor: "#fff"
            }, {
                value: "委托",
                bgColor: "#488E48",
                fontColor: "#fff"
            }, {
                value: "非委托",
                bgColor: "#9966CC",
                fontColor: "#fff"
            }, {
                value: "仓库",
                bgColor: "#7ca4dd",
                fontColor: "#fff"
            }
            ];
            return $(PubFunc.renderDom_field(v, cfg)).text();
        },
        // 收货状态
        receiving_status: function (v) {
            var cfg = [
                //入库类型
                {
                    value: "上架中",
                    bgColor: "#488E48",
                    fontColor: "#fff"
                }, {
                    value: "待收货",
                    bgColor: "#e4674a",
                    fontColor: "#fff"
                }, {
                    value: "待确认",
                    bgColor: "#81e34d",
                    fontColor: "#fff"
                }, {
                    value: "已收货",
                    bgColor: "#cebd5a",
                    fontColor: "#fff"
                }, {
                    value: "已拒收",
                    bgColor: "#ea6f6b",
                    fontColor: "#fff"
                }, {
                    value: "待货主修改",
                    bgColor: "#f83c71",
                    fontColor: "#fff"
                }, {
                    value: "待验收",
                    bgColor: "#46ef98",
                    fontColor: "#fff"
                }, {
                    value: "待上架",
                    bgColor: "#16f6b6",
                    fontColor: "#fff"
                }, {
                    value: "其它",
                    bgColor: "#f0f0f0",
                    fontColor: "#000"
                }, {
                    value: "上架完成",
                    bgColor: "#8FBC8F",
                    fontColor: "#000"
                }
            ];
            return $(PubFunc.renderDom_field(v, cfg)).text();
        },

        r_boolean: function (val) {
            return val == 'true' || val === true || val === '是' ? '是' : '否';
        },
        r_numUnit: function (v, r) { //库存数量 散件数 等
            if (v == '' || r.saBasicCommodityUnit == undefined) {
                return v;
            }
            return v + r.saBasicCommodityUnit;
        },
        r_numUnit_: function (v, r) { //件数
            if (v == '' || r.mtSkuBoxUnit == undefined) {
                return v;
            }
            return v + r.mtSkuBoxUnit;
        },
        r_packageSize: function (v, r) { //包装大小
            if (r.saBasicCommodityUnit == undefined || r.mtSkuBoxUnit == undefined) {
                return v;
            }
            return v + r.saBasicCommodityUnit + '/' + r.mtSkuBoxUnit;
        },
        r_saDayNum: function (v, r) { //距离失效日期天数
            v = '';
            if (r.saExpiryDate == undefined) {
                return v;
            }
            v = (new Date(r.saExpiryDate).getTime() - new Date().getTime()) / (1 * 24 * 3600 * 1000);
            return v.toFixed(1) + '天';
        },
        r_excludingTax: function (v, r) { //不含税单价计算方式（保留小数点后8位）：单价/（1+税率）
            if (r.purchaseTax == '') {
                return Number(r.saPrice);
            } else {
                return (Number(r.saPrice) / (1 + Number(r.purchaseTax))).toFixed(8);
            }
        },
        r_excludingPrice: function (v, r) { //不含税金额计算方式（保留小数点后8位）：不含税单价*库存数量
            var _BHSDJ = 0;
            if (r.purchaseTax == '') {
                _BHSDJ = Number(r.saPrice)
            } else {
                _BHSDJ = (Number(r.saPrice) / (1 + Number(r.purchaseTax)))
            }
            return (Number(r.saStockQuantity) * Number(_BHSDJ)).toFixed(8);
        },
        r_taxPrice: function (v, r) { //税额方式：含税金额-不含税金额
            var _BHSDJ = 0;
            if (r.purchaseTax == '') {
                _BHSDJ = Number(r.saPrice);
            } else {
                _BHSDJ = Number(r.saPrice) / (1 + Number(r.purchaseTax));
            }
            const _BHSJE = Number(r.saStockQuantity) * Number(_BHSDJ);//不含税金额
            return (Number(r.saMoney) - Number(_BHSJE)).toFixed(8);
        },

        renderBlank: function (val) {
            return val === '' ? '-----' : val;
        },
        r_JSStatus: function (v) {
            return PubFunc.columns_render_oppose('已结算', '未结算', v);
        },
        r_KPStatus: function (v) {
            return PubFunc.columns_render_oppose('已开票', '未开票', v);
        },
        r_commcctj: function (val, matedate, record) {
            if (Ext.isEmpty(record.commcctj)) {
                return "————";
            }
            return record.commcctj;
        },
        r_commGoodsType: function (val, matedate, record) {
            if (Ext.isEmpty(record.commGoodsType)) {
                return "————";
            }
            return record.commGoodsType;
        },
        r_commgg: function (val, matedate, record) {
            if (Ext.isEmpty(record.commgg)) {
                return "————";
            }
            return record.commgg;
        },
        render_percent: function (value) {
            value = value != '' ? value + '％' : value;
            return value;
        },

    };

    function getRowNumber(element, name) {
        // let td_element =  element.find(".x-grid3-cell div:contains('"+name+"')").closest("td");
        let td_element = element.find(".x-grid3-cell div").filter(function () {
            return $(this).text().trim() === name;
        }).closest("td");

        if (td_element == undefined || td_element.length == 0) {
            return false;
        }
        return getTdNumber(td_element);
    }

    //获取表格列编号
    function getTdNumber(element) {
        let classes = element.attr("class");
        let match = classes.match(/\bx-grid3-td-(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }

    // 创建下载链接
    function s2ab(s) {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    function receivingnotificationz() {
        $(function () {
            var button_dom = $(document).find("button:contains('修改细单')");

            if (button_dom == undefined) {
                return;
            }

            var top_dom = button_dom.parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent();
            // 查询按钮
            button_dom.parent().parent().parent().parent().parent().parent().parent().append(`
                <td class="x-toolbar-cell" id="nmsl-ext-gen39">
                    <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width:auto;">
                        <tbody class="x-btn-small x-btn-icon-small-left">
                            <tr>
                                <td class="x-btn-tl"><i>&nbsp;</i></td>
                                <td class="x-btn-tc"></td>
                                <td class="x-btn-tr"><i>&nbsp;</i></td>
                            </tr>
                            <tr>
                                <td class="x-btn-ml"><i>&nbsp;</i></td>
                                <td class="x-btn-mc">
                                    <em class="x-unselectable" unselectable="on">
                                        <button type="button" id="nmsl-ext-gen40" class="x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">查询上传状态</button>
                                    </em>
                                </td>
                                <td class="x-btn-mr"><i>&nbsp;</i></td>
                            </tr>
                            <tr>
                                <td class="x-btn-bl"><i>&nbsp;</i></td>
                                <td class="x-btn-bc"></td>
                                <td class="x-btn-br"><i>&nbsp;</i></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            `);

            // 查询按钮事件
            $(document).find(".x-toolbar table tbody tr .x-toolbar-left").find("#nmsl-ext-gen40").click(function () {
                // alert("事件触发");
                var start_header_dom = $(document).find(".x-grid3-hd-inner:contains('编号')");

                var table_index = start_header_dom.index();
                if (start_header_dom.parent().parent().find("#nmsl-file1-status-col").length <= 0) {
                    //查询列表头
                    start_header_dom.parent().parent().closest("tr").find(".x-grid3-cell:eq(7)").before(`
                        <td class="x-grid3-hd x-grid3-cell nmsl-x-grid3-td-10" style="width: 82px;" id="nmsl-file1-status-col">
                            <div class="x-grid3-hd-inner nmsl-x-grid3-hd-10" unselectable="on" style="">
                                <a class="x-grid3-hd-btn" href="#" id="nmsl-ext-gen200" style="height: 22px;"></a>随货温度
                                <img alt="" class="x-grid3-sort-icon" src="/`+ url_prefix + `/extjs/images/default/s.gif">
                            </div>
                        </td>
                        <td class="x-grid3-hd x-grid3-cell nmsl-x-grid3-td-11" style="width: 82px;" id="nmsl-file2-status-col">
                            <div class="x-grid3-hd-inner nmsl-x-grid3-hd-11" unselectable="on" style="">
                                <a class="x-grid3-hd-btn" href="#" id="nmsl-ext-gen201" style="height: 22px;"></a>随货单
                                <img alt="" class="x-grid3-sort-icon" src="/`+ url_prefix + `/extjs/images/default/s.gif">
                            </div>
                        </td>
                        <td class="x-grid3-hd x-grid3-cell nmsl-x-grid3-td-12" style="width: 82px;" id="nmsl-file3-status-col">
                            <div class="x-grid3-hd-inner nmsl-x-grid3-hd-12" unselectable="on" style="">
                                <a class="x-grid3-hd-btn" href="#" id="nmsl-ext-gen202" style="height: 22px;"></a>入库单
                                <img alt="" class="x-grid3-sort-icon" src="/`+ url_prefix + `/extjs/images/default/s.gif">
                            </div>
                        </td>
                    `);
                }
                if ($(document).find(".x-grid3-scroller .x-grid3-body").find('.nmsl-x-grid3-td-10').length <= 0) {
                    $(document).find(".x-grid3-scroller .x-grid3-body").find('.x-grid3-td-9').parent().closest("tr").find(".x-grid3-col:eq(7)").before(`
                        <td class="x-grid3-col x-grid3-cell nmsl-x-grid3-td-10 " style="width: 82px;" tabindex="0">
                            <div class="x-grid3-cell-inner nmsl-x-grid3-col-10 x-unselectable" unselectable="on">
                                <div
                                    style="background:#7E7E7E; padding:2px; border: 2px solid #fff; border-radius:4px; color:#fff; font-weight:normal; text-align:center;">
                                    未检查</div>
                            </div>
                        </td>
                        <td class="x-grid3-col x-grid3-cell nmsl-x-grid3-td-11 " style="width: 82px;" tabindex="0">
                            <div class="x-grid3-cell-inner nmsl-x-grid3-col-11 x-unselectable" unselectable="on">
                                <div
                                    style="background:#7E7E7E; padding:2px; border: 2px solid #fff; border-radius:4px; color:#fff; font-weight:normal; text-align:center;">
                                    未检查</div>
                            </div>
                        </td>
                        <td class="x-grid3-col x-grid3-cell nmsl-x-grid3-td-12" style="width: 82px;" tabindex="0">
                            <div class="x-grid3-cell-inner nmsl-x-grid3-col-12 x-unselectable" unselectable="on">
                                <div
                                    style="background:#7E7E7E; padding:2px; border: 2px solid #fff; border-radius:4px; color:#fff; font-weight:normal; text-align:center;">
                                    未检查</div>
                            </div>
                        </td>
                    `);
                }

                $(document).find(".x-grid3-scroller .x-grid3-body").find('.nmsl-x-grid3-td-10').find('.nmsl-x-grid3-col-10 div').text("等待检查");
                $(document).find(".x-grid3-scroller .x-grid3-body").find('.nmsl-x-grid3-td-11').find('.nmsl-x-grid3-col-11 div').text("等待检查");
                $(document).find(".x-grid3-scroller .x-grid3-body").find('.nmsl-x-grid3-td-12').find('.nmsl-x-grid3-col-12 div').text("等待检查");

                $.each($(document).find(".x-grid3-scroller .x-grid3-body").find('.nmsl-x-grid3-td-10'), function (k, v) {
                    var model_id = $(v).parent().find('.x-grid3-td-2 div').text();
                    $.ajax({
                        type: "POST",
                        url: "/" + url_prefix + "/godown/receivingnotification_z!showPhoto.action",
                        // async: false,
                        data: {
                            "model.id": model_id,
                            "submitBValue1": "随货温度"
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.info.length <= 0) {
                                $(v).find('.nmsl-x-grid3-col-10 div').text("未上传");
                            } else {
                                $(v).find('.nmsl-x-grid3-col-10 div').text("已上传");
                                $(v).find('.nmsl-x-grid3-col-10 div').attr("style", "background:#488E48; padding:2px; border: 2px solid #fff; border-radius:4px; color:#fff; font-weight:normal; text-align:center;");

                            }
                        }
                    });
                    $.ajax({
                        type: "POST",
                        url: "/" + url_prefix + "/godown/receivingnotification_z!showPhoto.action",
                        // async: false,
                        data: {
                            "model.id": model_id,
                            "submitBValue1": "随货同行"
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.info.length <= 0) {
                                $(v).parent().find('.nmsl-x-grid3-col-11 div').text("未上传");
                            } else {
                                $(v).parent().find('.nmsl-x-grid3-col-11 div').text("已上传");
                                $(v).parent().find('.nmsl-x-grid3-col-11 div').attr("style", "background:#488E48; padding:2px; border: 2px solid #fff; border-radius:4px; color:#fff; font-weight:normal; text-align:center;");

                            }
                        }
                    });

                    $.ajax({
                        type: "POST",
                        url: "/" + url_prefix + "/godown/receivingnotification_z!showPhoto.action",
                        // async: false,
                        data: {
                            "model.id": model_id,
                            "submitBValue1": "入库"
                        },
                        dataType: "json",
                        success: function (data) {
                            if (data.info.length <= 0) {
                                $(v).parent().find('.nmsl-x-grid3-col-12 div').text("未上传");
                            } else {
                                $(v).parent().find('.nmsl-x-grid3-col-12 div').text("已上传");
                                $(v).parent().find('.nmsl-x-grid3-col-12 div').attr("style", "background:#488E48; padding:2px; border: 2px solid #fff; border-radius:4px; color:#fff; font-weight:normal; text-align:center;");

                            }
                        }
                    });

                });
            });
        });

        $(document).on('change', 'input[type="file"]', function () {
            var fileInput = this;
            var files = fileInput.files;

            if (files.length > 0) {
                // 获取第一个文件
                var file = files[0];

                // 提取文件名和后缀名
                var fileName = file.name;
                var fileExtension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
                var baseName = fileName.slice(0, fileName.lastIndexOf("."));

                if (fileExtension == "bmp" || fileExtension == "jijf") {
                    fileExtension = "jpg";
                }

                // 替换文件名中的点为减号
                var newBaseName = baseName.replace(/\./g, '-');

                // 重新组合文件名
                var newFileName = newBaseName + '.' + fileExtension;

                // 创建新的文件对象
                var newFile = new File([file], newFileName, { type: file.type });

                // 替换文件列表中的文件
                var dataTransfer = new DataTransfer();
                dataTransfer.items.add(newFile);
                fileInput.files = dataTransfer.files;


            }
        });
    }

    function outstoragecheckquery() {
        // alert("油猴脚本已加载");
        $(function () {
            $(document).find("button:contains('显示全部(A)')").parent().parent().parent().parent().parent().parent().parent().append(`
                <td class="x-toolbar-cell" id="nmsl-ext-gen39">
                    <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                        <tbody class="x-btn-small x-btn-icon-small-left">
                        <tr>
                            <td class="x-btn-tl">
                            <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-tc"></td>
                            <td class="x-btn-tr">
                            <i>&nbsp;</i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-ml">
                            <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-mc">
                            <em class=" x-unselectable" unselectable="on">
                                <button type="button" id="nmsl-ext-gen40" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">导出今日数据</button></em>
                            </td>
                            <td class="x-btn-mr">
                            <i>&nbsp;</i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-bl">
                            <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-bc"></td>
                            <td class="x-btn-br">
                            <i>&nbsp;</i>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            `);

            $(document).find('#nmsl-ext-gen40').click(function () {


                let today = new Date();
                let year = today.getFullYear();
                let month = String(today.getMonth() + 1).padStart(2, '0');
                let day = String(today.getDate()).padStart(2, '0');
                let formattedDate = `${year}-${month}-${day}`;


                let startDate = prompt("请输入开始时间（格式：YYYY-MM-DD）");
                if (!startDate) {
                    alert("未输入开始时间，导出取消");
                    return;
                }

                let endDate = prompt("请输结束时间（格式：YYYY-MM-DD）,不填则使用今天.");
                if (!endDate) {
                    endDate = formattedDate;
                }


                // 检查输入的日期格式是否正确
                let datePattern = /^\d{4}-\d{2}-\d{2}$/;
                if (!datePattern.test(startDate)) {
                    alert("开始日期格式不正确，请输入正确的日期格式（YYYY-MM-DD）");
                    return;
                }

                if (!datePattern.test(endDate)) {
                    alert("结束日期格式不正确，请输入正确的日期格式（YYYY-MM-DD）");
                    return;
                }

                var arr = [];
                $.each($(".x-grid3-hd"), function (k, v) {
                    arr.push($(v).text());
                });


                // 创建工作表数据

                $.ajax({
                    type: "POST",
                    url: "/" + url_prefix + "/gspreportforms/outstoragecheckquery!query.action",
                    data: {
                        "limit": 114514,
                        "propertyCriteria": "wnxFineSingleState.name:in:备货完工;复核,wnxConfirmTime:ge:" + startDate + " 00:00:00,wnxConfirmTime:le:" + endDate + " 23:59:59"
                    },
                    dataType: "json",
                    success: function (data) {
                        let wb = XLSX.utils.book_new();
                        let ws_data = [
                            [
                                "出库时间",
                                "购货单位",
                                "拣选人",
                                "商品货号(出厂)",
                                "商品名称",
                                "货主",
                                "规格/型号",
                                "商品基本单位",
                                "产地",
                                "生产批号/序列号",
                                "生产日期",
                                "有效期",
                                "出库复核数量",
                                "复核人",
                                "复核人2",
                                "订单总单标识",
                                "拣货总单标识号",
                                "备注",
                                "购货单位证件编号",
                                "购货单位证件有效期",
                                "生产企业/受托生产企业",
                                "生产许可证/备案凭证编号",
                                "生产企业证件有效期",
                                "注册证号/备案凭证编号",
                                "注册证号/备案凭证编号有效期",
                                "灭菌批号",
                                "灭菌日期",
                                "灭菌效期",
                                "批准文号/备案凭证编号",
                                "批准文号/备案凭证编号有效期",
                                "一次复核日期",
                                "一次复核数量",
                                "二次复核日期",
                                "二次复核数量",
                                "DI码",
                                "注册人/备案人/上市许可持有人",
                                "运输温度",
                                "复核质量状况",
                                "储存条件",
                                "收货地址",
                                "装箱人",
                                "udi码"
                            ],
                        ];
                        $.each(data.root, function (k, v) {
                            let arr = [];
                            arr.push(v.wnxConfirmTime);
                            arr.push(v.wnxCustomerName);
                            arr.push(v.wnxPickCandidate);
                            arr.push(v.codCode2);
                            arr.push(v.wnxCommName);
                            arr.push(v.wnxOocName);
                            arr.push(v.wnxCommercialSpecification);
                            arr.push(v.wnxBasicCommodityUnit);
                            arr.push(v.wnxpProducingArea);
                            arr.push(v.wnxBatch);
                            arr.push(v.wnxSCTime);
                            arr.push(v.wnxValidTill);
                            arr.push(v.wnxConfirmQuantity);
                            arr.push(v.wnxConfirmPerson);
                            arr.push(v.wnxCheckArtificial);
                            arr.push(v.wnxOrderSingleSign);
                            arr.push(v.wnxIdentifyTotalSingleSign);
                            arr.push(v.wnxOrderNote);
                            arr.push(v.unitlicenceTypeNo);
                            arr.push(PubFunc.render_date(v.unitlicenceTypeTime));
                            arr.push(v.wnxBrand);
                            arr.push(v.wnxProductionLicenseNo);
                            arr.push(PubFunc.render_date(v.licenceTypeTime));
                            arr.push(v.codRegistrationCertificateNo);
                            arr.push(PubFunc.render_date(v.codValidPeriodRegistration));
                            arr.push(v.batSterilizationBatch);
                            arr.push(PubFunc.render_date(v.batSterilizationDate));
                            arr.push(PubFunc.render_date(v.batSterilizationValid));
                            arr.push(v.codLicenseNumber);
                            arr.push(PubFunc.render_date(v.codLicenseNumTermValidity));
                            arr.push(v.firstDate);
                            arr.push(v.firstCheckNum);
                            arr.push(v.secondDate);
                            arr.push(v.secondCheckNum);
                            arr.push(v.wnxBarCode);
                            arr.push(v.comHolder);
                            arr.push(v.StorageSpecificTemperature);
                            arr.push(v.FHZLZK);
                            arr.push(v.codStorageCondition);
                            arr.push(v.unitStoreARS);
                            arr.push(v.packagePerson_perName);
                            arr.push(v.wnxUdis);
                            ws_data.push(arr);
                        });
                        let ws = XLSX.utils.aoa_to_sheet(ws_data);

                        // 将工作表添加到工作簿
                        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                        let wbout = XLSX.write(wb, { bookType: 'xls', type: 'binary' });


                        // 创建Blob对象，并使用它创建一个URL
                        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                        const url = URL.createObjectURL(blob);

                        // 创建a标签并模拟点击以下载文件
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = "出库复核查询" + startDate + " - " + endDate + '.xls';
                        a.click();

                        // 清除URL对象
                        URL.revokeObjectURL(url);
                        // alert("导出成功");
                        // window.open(data.info);
                    }
                })
            });
        });

    }

    function storageshelvesconfirm() {
        // alert("油猴脚本已加载");
        // $(document).find("button:contains('显示全部(A)')").closest('.x-toolbar-left-row').append(`
        //     <td class="x-toolbar-cell" id="nmsl-ext-gen39">
        //         <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
        //             <tbody class="x-btn-small x-btn-icon-small-left">
        //             <tr>
        //                 <td class="x-btn-tl">
        //                 <i>&nbsp;</i>
        //                 </td>
        //                 <td class="x-btn-tc"></td>
        //                 <td class="x-btn-tr">
        //                 <i>&nbsp;</i>
        //                 </td>
        //             </tr>
        //             <tr>
        //                 <td class="x-btn-ml">
        //                 <i>&nbsp;</i>
        //                 </td>
        //                 <td class="x-btn-mc">
        //                 <em class=" x-unselectable" unselectable="on">
        //                     <button type="button" id="nmsl-ext-gen40" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">导出数据</button></em>
        //                 </td>
        //                 <td class="x-btn-mr">
        //                 <i>&nbsp;</i>
        //                 </td>
        //             </tr>
        //             <tr>
        //                 <td class="x-btn-bl">
        //                 <i>&nbsp;</i>
        //                 </td>
        //                 <td class="x-btn-bc"></td>
        //                 <td class="x-btn-br">
        //                 <i>&nbsp;</i>
        //                 </td>
        //             </tr>
        //             </tbody>
        //         </table>
        //     </td>

        //     <td class="x-toolbar-cell" id="nmsl-ext-gen40">
        //         <table id="nmsl-ext-comp-1004" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
        //             <tbody class="x-btn-small x-btn-icon-small-left">
        //             <tr>
        //                 <td class="x-btn-tl">
        //                 <i>&nbsp;</i>
        //                 </td>
        //                 <td class="x-btn-tc"></td>
        //                 <td class="x-btn-tr">
        //                 <i>&nbsp;</i>
        //                 </td>
        //             </tr>
        //             <tr>
        //                 <td class="x-btn-ml">
        //                 <i>&nbsp;</i>
        //                 </td>
        //                 <td class="x-btn-mc">
        //                 <em class=" x-unselectable" unselectable="on">
        //                     <button type="button" id="nmsl-ext-gen41" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">记录虚货</button></em>
        //                 </td>
        //                 <td class="x-btn-mr">
        //                 <i>&nbsp;</i>
        //                 </td>
        //             </tr>
        //             <tr>
        //                 <td class="x-btn-bl">
        //                 <i>&nbsp;</i>
        //                 </td>
        //                 <td class="x-btn-bc"></td>
        //                 <td class="x-btn-br">
        //                 <i>&nbsp;</i>
        //                 </td>
        //             </tr>
        //             </tbody>
        //         </table>
        //     </td>

        // `);

        //导出
        $(document).find('#nmsl-ext-gen40').click(function () {

            let today = new Date();
            let year = today.getFullYear();
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let day = String(today.getDate()).padStart(2, '0');
            let formattedDate = `${year}-${month}-${day}`;


            let startDate = prompt("请输入开始时间（格式：YYYY-MM-DD）");
            if (!startDate) {
                alert("未输入开始时间，导出取消");
                return;
            }

            let endDate = prompt("请输结束时间（格式：YYYY-MM-DD）,不填则使用今天.");
            if (!endDate) {
                endDate = formattedDate;
            }


            // 检查输入的日期格式是否正确
            let datePattern = /^\d{4}-\d{2}-\d{2}$/;
            if (!datePattern.test(startDate)) {
                alert("开始日期格式不正确，请输入正确的日期格式（YYYY-MM-DD）");
                return;
            }

            if (!datePattern.test(endDate)) {
                alert("结束日期格式不正确，请输入正确的日期格式（YYYY-MM-DD）");
                return;
            }

            // alert("导出提示事件");


            var arr = [];
            $.each($(".x-grid3-hd"), function (k, v) {
                arr.push($(v).text());
            });


            // 创建工作表数据

            $.ajax({
                type: "POST",
                url: "/" + url_prefix + "/godown/storageshelvesconfirm!query.action",
                data: {
                    "limit": 114514,
                    // "propertyCriteria": "createTime:ge:"+formattedDate+" 00:00:00,createTime:le:"+formattedDate+" 23:59:59,sscSJ:eq:$否,"
                    "propertyCriteria": "createTime:ge:" + startDate + " 00:00:00,createTime:le:" + endDate + " 23:59:59,sscSJ:eq:$是,"
                    // "propertyCriteria": "sscSJ:eq:$否"
                },
                dataType: "json",
                success: function (data) {
                    // return;
                    let wb = XLSX.utils.book_new();
                    let ws_data = [
                        [
                            "操作预警",
                            "作业状态",
                            "收货通知编号",
                            "入库验收编号",
                            "货品状态",
                            "原散件标志",
                            "批号",
                            "上架数量",
                            "上架托盘条码",
                            "基本单位数量",
                            "件数",
                            "散件数量",
                            "原区域",
                            "原区域类型",
                            "原货位",
                            "目标区域",
                            "目标区域类型",
                            "目标货位",
                            "货主名称",
                            "商品货号(出厂)",
                            "商品类型",
                            "商品名称",
                            "SKU操作码",
                            "SKU名称",
                            "商品基本单位",
                            "商品箱单位",
                            "生产日期",
                            "有效期",
                            "失效期",
                            "灭菌批号",
                            "灭菌日期",
                            "灭菌有效期",
                            "仓库名称",
                            "板号",
                            "SKU标识",
                            "商品规格",
                            "生产厂家",
                            "包装大小",
                            "储存属性",
                            "生产许可证号/备案凭证编号",
                            "注册帐号/备案凭证编号",
                            "备注",
                            "下单部门",
                            "适用机型",
                        ],
                    ];


                    $.each(data.root, function (k, v) {
                        let arr = [];
                        arr.push(renderer_func.r_colour(v.warning));
                        arr.push(renderer_func.r_com_status(v.sscJobBehavior));
                        arr.push(v.wiHarvestNotificationNumber);
                        arr.push(v.sscSourceList);
                        arr.push(v.sscItemStatus);
                        arr.push(renderer_func.r_status(v.sscOriginalPartsMark));
                        arr.push(v.sscBatch);
                        arr.push(renderer_func.r_dw(v.sscNumberShelves, '', v));
                        arr.push(v.wsxTrayNumber);
                        arr.push(v.sscBasicUnitQuantity);
                        arr.push(renderer_func.r_js(v.sscNumberPackages, '', v));
                        arr.push(renderer_func.r_dw(v.sscNumberSpareParts, '', v));
                        arr.push(v.sscOldArea);
                        arr.push(v.oldareatype);
                        arr.push(v.sscOriginalLocation);
                        arr.push(v.sscTargetArea);
                        arr.push(v.newareatype);
                        arr.push(v.sscTargetLocation);
                        arr.push(v.sscOocName);
                        arr.push(v.codCode2);
                        arr.push(v.codGoodsType);
                        arr.push(v.sscCommName);
                        arr.push(v.sscSKUOperationCode);
                        arr.push(v.sscSKUName);
                        arr.push(v.sscBasicCommodityUnit);
                        arr.push(v.sscSkuBoxUnit);
                        arr.push(PubFunc.render_date(v.wiDateManufacture));
                        arr.push(PubFunc.render_date(v.wsxValidTill));
                        arr.push(v.expirationDate);
                        arr.push(v.mjph);
                        arr.push(v.mjrq);
                        arr.push(v.mjyxq);
                        arr.push(v.sscWarehouseName);
                        arr.push(v.sscBoardNo);
                        arr.push(v.sscSKULogo);
                        arr.push(v.sscCommercialSpecification);
                        arr.push(v.sscBrand);
                        arr.push(renderer_func.r_bz(v.sscPackageSize, '', v));
                        arr.push(v.sscStorageProperties);
                        arr.push(v.scxkzh);
                        arr.push(v.sscRegisteredAccount);
                        arr.push(v.sscRemarks);
                        arr.push(v.dept_dname);
                        arr.push(v.productsApplicable);
                        ws_data.push(arr);
                    });
                    let ws = XLSX.utils.aoa_to_sheet(ws_data);

                    // 将工作表添加到工作簿
                    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                    let wbout = XLSX.write(wb, { bookType: 'xls', type: 'binary' });


                    // 创建Blob对象，并使用它创建一个URL
                    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);

                    // 创建a标签并模拟点击以下载文件
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "入库上架确认" + startDate + " - " + endDate + '.xls';
                    a.click();

                    // 清除URL对象
                    URL.revokeObjectURL(url);
                    // alert("导出成功");
                    // window.open(data.info);
                }
            })
        });

        // 虚货标记
        // $(document).find('#nmsl-ext-gen41').click(function () {
        //     $(document).find('#nmsl-ext-gen41').hide();
        //     // alert("暂未开放");
        //     // console.log("测试:",getRowNumber($(".x-grid3-header"),"作业状态"));
        //     let header_element = $(this).closest('.x-panel-bwrap').find(".x-grid3-header");

        //     let field_name_list = {
        //         record_id: "编号",
        //         provider_name: "供应商",
        //         owner_id: "货主ID",
        //         owner_name: "货主名称",
        //         notify_number: "收货通知编号",
        //         acceptance_no: "入库验收编号",
        //         batch_no: "批号",
        //         storage_condition: "储存条件",
        //         quantity: "基本单位数量",
        //         item_number: "商品货号(出厂)",
        //         item_name: "商品名称",
        //         item_spec: "商品规格",
        //         item_sku: "SKU操作码",
        //         item_sku_name: "SKU名称",
        //         quantity_unit: "商品基本单位",
        //         item_sku_mark: "SKU标识",
        //         manufacturer: "生产厂家",
        //     };

        //     let td_index_list = {
        //         record_id: getRowNumber(header_element, "编号"),
        //         provider_name: getRowNumber(header_element, "供应商"),
        //         owner_id: getRowNumber(header_element, "货主ID"),
        //         owner_name: getRowNumber(header_element, "货主名称"),
        //         notify_number: getRowNumber(header_element, "收货通知编号"),
        //         acceptance_no: getRowNumber(header_element, "入库验收编号"),
        //         batch_no: getRowNumber(header_element, "批号"),
        //         storage_condition: getRowNumber(header_element, "储存条件"),
        //         quantity: getRowNumber(header_element, "基本单位数量"),
        //         item_number: getRowNumber(header_element, "商品货号(出厂)"),
        //         item_name: getRowNumber(header_element, "商品名称"),
        //         item_spec: getRowNumber(header_element, "商品规格"),
        //         item_sku: getRowNumber(header_element, "SKU操作码"),
        //         item_sku_name: getRowNumber(header_element, "SKU名称"),
        //         quantity_unit: getRowNumber(header_element, "商品基本单位"),
        //         item_sku_mark: getRowNumber(header_element, "SKU标识"),
        //         manufacturer: getRowNumber(header_element, "生产厂家"),
        //     };

        //     let have_err = false;
        //     $.each(field_name_list, function (k, v) {
        //         if (td_index_list[k] == false) {
        //             alert("表格列不完整,请选择【" + v + "】列,然后刷新本页再操作");
        //             have_err = true;
        //         }
        //     });
        //     if (have_err) {
        //         $(document).find('#nmsl-ext-gen41').show();
        //         return false;
        //     }
        //     // console.table(td_index_list);

        //     let checked_row_elements = $(this).closest('.x-panel-bwrap').find(".x-grid3-body .x-grid3-row-selected");
        //     // console.log("选中数量:", checked_row_elements.length);

        //     if (checked_row_elements.length <= 0) {
        //         alert("请选择要记录的数据");
        //         $(document).find('#nmsl-ext-gen41').show();
        //         return false;
        //     }

        //     let item_list = [];
        //     $.each(checked_row_elements, function (i, item) {
        //         let arr = {};
        //         $.each(field_name_list, function (k, v) {
        //             arr[k] = $(item).find("tbody tr .x-grid3-td-" + td_index_list[k]).text().trim();
        //         });
        //         item_list.push(arr);
        //     });

        //     $.ajax({
        //         url: plugin_url + "/api/wms/virtual_bill/add",
        //         type: "POST",
        //         data: {
        //             item_list: item_list,
        //             operator_id: window.top.personId,
        //             operator_name: window.top.realName,
        //         },
        //         success: function (data) {
        //             // console.log("Response:", data);
        //             if (data.code !== 200) {
        //                 alert(data.msg);
        //                 $(document).find('#nmsl-ext-gen41').show();
        //                 return;
        //             }

        //             $.each(checked_row_elements, function (k, v) {
        //                 let record_id = $(v).find("tbody tr .x-grid3-td-" + td_index_list['record_id']).text().trim();
        //                 if (data.data.duplicate_list.indexOf(record_id) !== -1) {
        //                     v.style.setProperty('background-color', '#ef1c00', 'important');
        //                     v.style.setProperty('background-image', 'none', 'important');
        //                     v.style.setProperty('border-color', '#c1481f', 'important');
        //                 }
        //                 // data.data.duplicate_list
        //             });
        //             alert(`标记结果,成功:${data.data.success_list.length}个,重复:${data.data.duplicate_list.length}个,重复已标红.`);
        //             $(document).find('#nmsl-ext-gen41').show();

        //         },
        //         error: function (xhr, status, error) {
        //             console.error("Error:", error);
        //             alert("请求失败:" + error);
        //             $(document).find('#nmsl-ext-gen41').show();
        //         }
        //     });

        // });

        // $(document).find("button:contains('上架确认(M)')").click(function () {
        //     let timer = setInterval(function () {
        //         if ($(document).find("[name=\"sscGroundingPersomID\"]").length > 0) {
        //             clearInterval(timer);
        //             // storageshelvesconfirm();
        //             $(document).find("[name=\"sscGroundingPersomID\"]").val(window.top.personId);
        //             $(document).find("[name=\"sscGroundingPersom\"]").val(window.top.realName);
        //         }
        //     }, 300);
        // });


        $(document).find("button:contains('部分上架')").click(function () {
            let timer = setInterval(function () {
                if ($(document).find("#sscGroundingPersom").length > 0) {
                    clearInterval(timer);
                    // storageshelvesconfirm();
                    $(document).find("#sscGroundingPersomID").val(window.top.personId);
                    $(document).find("#sscGroundingPersom").val(window.top.realName);
                }
            }, 300);
        });

    }

    function batch() {

        // 修改文件类型
        $(document).on('change', 'input[type="file"]', function () {
            var fileInput = this;
            var files = fileInput.files;

            if (files.length > 0) {
                // 获取第一个文件
                var file = files[0];

                // 提取文件名和后缀名
                var fileName = file.name;
                var fileExtension = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
                var baseName = fileName.slice(0, fileName.lastIndexOf("."));

                if (fileExtension == "bmp" || fileExtension == "jijf") {
                    fileExtension = "jpg";
                }

                // 替换文件名中的点为减号
                var newBaseName = baseName.replace(/\./g, '-');

                // 重新组合文件名
                var newFileName = newBaseName + '.' + fileExtension;

                // 创建新的文件对象
                var newFile = new File([file], newFileName, { type: file.type });

                // 替换文件列表中的文件
                var dataTransfer = new DataTransfer();
                dataTransfer.items.add(newFile);
                fileInput.files = dataTransfer.files;


            }
        });


        // 增加备注按钮
        $(document).find("button:contains('显示全部(A)')").closest('.x-toolbar-left-row').append(`
            <td class="x-toolbar-cell" id="nmsl-ext-gen39">
                <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                    <tbody class="x-btn-small x-btn-icon-small-left">
                    <tr>
                        <td class="x-btn-tl">
                        <i>&nbsp;</i>
                        </td>
                        <td class="x-btn-tc"></td>
                        <td class="x-btn-tr">
                        <i>&nbsp;</i>
                        </td>
                    </tr>
                    <tr>
                        <td class="x-btn-ml">
                        <i>&nbsp;</i>
                        </td>
                        <td class="x-btn-mc">
                        <em class=" x-unselectable" unselectable="on">
                            <button type="button" id="nmsl-ext-gen40" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">备注</button></em>
                        </td>
                        <td class="x-btn-mr">
                        <i>&nbsp;</i>
                        </td>
                    </tr>
                    <tr>
                        <td class="x-btn-bl">
                        <i>&nbsp;</i>
                        </td>
                        <td class="x-btn-bc"></td>
                        <td class="x-btn-br">
                        <i>&nbsp;</i>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        `);

        $(document).find(".x-table-layout-cell .x-form-item label:contains('检验报告上传:')").closest("tr").append(`
            <td class="x-table-layout-cell" id="nmsl-ext-gen221">
                <div id="nmsl-ext-comp-1129" class=" x-panel x-panel-noborder">
                    <div class="x-panel-bwrap" id="nmsl-ext-gen222">
                        <div class="x-panel-body x-panel-body-noheader x-panel-body-noborder" id="nmsl-ext-gen223">
                            <div class="x-form-item " tabindex="-1" id="nmsl-ext-gen382">
                                <label for="nmsl-ext-comp-1130" style="width:100px;" class="x-form-item-label"
                                    id="nmsl-ext-gen383">备注:</label>
                                <div class="x-form-element" id="x-form-el-nmsl-ext-comp-1130" style="padding-left:105px">
                                    <div id="nmsl-ext-comp-1130" class=" x-panel">
                                        <div class="x-panel-bwrap" id="nmsl-ext-gen384">
                                            <div class="x-panel-body x-panel-body-noheader" id="nmsl-ext-gen385"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="x-form-clear-left"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </td>
            <td class="x-table-layout-cell" id="nmsl-ext-gen225">
                <div id="nmsl-ext-comp-1131" class=" x-panel x-panel-noborder">
                    <div class="x-panel-bwrap" id="nmsl-ext-gen226">
                        <div class="x-panel-body x-panel-body-noheader x-panel-body-noborder" id="nmsl-ext-gen227">
                            <input type="text" size="20" autocomplete="off" id="nmsl-note" name="nmsl-note"
                                class=" x-form-text x-form-field" readonly="" style="width: 139px;">
                        </div>
                    </div>
                </div>
            </td>
            <td class="x-table-layout-cell" id="nmsl-ext-gen228">
                <div id="nmsl-ext-comp-1132" class=" x-panel">
                    <div class="x-panel-bwrap" id="nmsl-ext-gen229">
                        <div class="x-panel-body x-panel-body-noheader" id="nmsl-ext-gen230">
                            <div class="redStar"></div>
                        </div>
                    </div>
                </div>
            </td>
            <td class="x-table-layout-cell" id="nmsl-ext-gen232">
                <div id="nmsl-ext-comp-1133" class=" x-panel" style="width: 15px;">
                    <div class="x-panel-bwrap" id="nmsl-ext-gen233">
                        <div class="x-panel-body x-panel-body-noheader" id="nmsl-ext-gen234" style="width: 15px;"></div>
                    </div>
                </div>
            </td>
        `);

        // 备注填写实现
        $(document).find("#nmsl-ext-gen40").on({
            mouseover: function () {
                // console.log("鼠标移到查询货位信息上");
                // 鼠标移动到元素上时增加 x-btn-over 类
                $(this).closest('#nmsl-ext-comp-1003').addClass("x-btn-over");
            },
            mouseout: function () {
                // console.log("鼠标移开查询货位信息");
                // 鼠标移开时删除 x-btn-over 类
                $(this).closest('#nmsl-ext-comp-1003').removeClass("x-btn-over");
                $(this).closest('#nmsl-ext-comp-1003').removeClass("x-btn-click");

            },
            mousedown: function () {
                // console.log("鼠标按下查询货位信息");
                // 鼠标按下时增加 x-btn-click 类
                $(this).closest('#nmsl-ext-comp-1003').addClass("x-btn-click");
            },
            mouseup: function () {
                // console.log("鼠标松开查询货位信息");
                // 鼠标松开时删除 x-btn-click 类
                $(this).closest('#nmsl-ext-comp-1003').removeClass("x-btn-click");
            },
            click: function () {
                let header_element = $(this).closest('.x-panel-bwrap').find(".x-grid3-header");

                let field_name_list = {
                    record_id: "编号",
                };

                let td_index_list = {
                    record_id: getRowNumber(header_element, "编号"),
                };

                let have_err = false;
                $.each(field_name_list, function (k, v) {
                    if (td_index_list[k] == false) {
                        alert("表格列不完整,请选择【" + v + "】列,然后刷新本页再操作");
                        have_err = true;
                    }
                });
                if (have_err) {
                    return false;
                }
                // console.table(td_index_list);

                let checked_row_elements = $(this).closest('.x-panel-bwrap').find(".x-grid3-body .x-grid3-row-selected");

                if (checked_row_elements.length <= 0) {
                    alert("请选择要记录的数据");
                    return false;
                }

                let record_id_list = [];
                $.each(checked_row_elements, function (k, v) {
                    let record_id = $(v).find("tbody tr .x-grid3-td-" + td_index_list['record_id']).text().trim();
                    record_id_list.push(record_id);
                });

                var note = prompt("请输入备注:");

                // 检查用户是否点击了“取消”按钮
                if (note === null) {
                    return;
                }

                console.log(note, record_id_list);

                $.ajax({
                    url: plugin_url + "/api/wms/batch/note",
                    type: "POST",
                    data: {
                        record_ids: record_id_list,
                        note: note,
                        operator_id: window.top.personId,
                        operator_name: window.top.realName,
                    },
                    success: function (data) {
                        console.log(data);
                        if (data.code !== 200) {
                            alert(data.msg);
                            return;
                        }
                    },
                    error: function (data) {
                        alert("保存失败,请联系相关人员.");
                    }
                });
            }
        });

        //备注查询实现
        $(document).on("click", ".x-grid3 .x-grid3-viewport .x-grid3-scroller .x-grid3-body .x-grid3-row", function () {
            $(document).find("#nmsl-note").val("");
            // alert("行点击");
            let header_element = $(this).closest('.x-grid3-viewport').find(".x-grid3-header");

            let field_name_list = {
                record_id: "编号",
            };

            let record_id_index = getRowNumber(header_element, "编号");

            if (record_id_index == false) {
                alert("表格列不完整,请选择【编号】列,然后刷新本页再操作");
                return false;
            }

            let checked_record = $(this).closest('.x-grid3-row ');
            let record_id = $(checked_record).find("tbody tr .x-grid3-td-" + record_id_index).text().trim();

            $.ajax({
                url: plugin_url + "/api/wms/batch/note",
                type: "get",
                data: {
                    record_id: record_id,
                },
                success: function (data) {
                    console.log(data);
                    if (data.code !== 200) {
                        alert(data.msg);
                        return;
                    }
                    if (data.data != null && data.data.note != undefined) {
                        $(document).find("#nmsl-note").val(data.data.note);
                    }
                },
                error: function (data) {
                    alert("获取失败,请联系相关人员.");
                }
            });

        });
    }

    function warehousingrecord() {
        // alert("油猴脚本已加载");
        $(document).find("button:contains('显示全部(A)')").parent().parent().parent().parent().parent().parent().parent().append(`
                    <td class="x-toolbar-cell" id="nmsl-ext-gen39">
                        <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                            <tbody class="x-btn-small x-btn-icon-small-left">
                            <tr>
                                <td class="x-btn-tl">
                                <i>&nbsp;</i>
                                </td>
                                <td class="x-btn-tc"></td>
                                <td class="x-btn-tr">
                                <i>&nbsp;</i>
                                </td>
                            </tr>
                            <tr>
                                <td class="x-btn-ml">
                                <i>&nbsp;</i>
                                </td>
                                <td class="x-btn-mc">
                                <em class=" x-unselectable" unselectable="on">
                                    <button type="button" id="nmsl-ext-gen40" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">导出数据</button></em>
                                </td>
                                <td class="x-btn-mr">
                                <i>&nbsp;</i>
                                </td>
                            </tr>
                            <tr>
                                <td class="x-btn-bl">
                                <i>&nbsp;</i>
                                </td>
                                <td class="x-btn-bc"></td>
                                <td class="x-btn-br">
                                <i>&nbsp;</i>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                `);

        $(document).find('#nmsl-ext-gen40').click(function () {


            alert("导出大概需要1分钟左右的时间,这期间不要刷新页面.");
            let today = new Date();
            let year = today.getFullYear();
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let day = String(today.getDate()).padStart(2, '0');
            let formattedDate = `${year}-${month}-${day}`;

            var arr = [];
            $.each($(".x-grid3-hd"), function (k, v) {
                arr.push($(v).text());
            });


            // 创建工作表数据

            $.ajax({
                type: "POST",
                url: "/" + url_prefix + "/gspreportforms/checkacceptquery!query.action",
                data: {
                    "limit": 1145140,
                    "propertyCriteria": "wsxWarehouseEntryInspection.wiFineSingleState.name:eq:$上架"
                    // "propertyCriteria": "sscSJ:eq:$否"
                },
                dataType: "json",
                success: function (data) {
                    // return;
                    let wb = XLSX.utils.book_new();
                    let ws_data = [
                        [
                            "数据类型",
                            "收货通知标识",
                            "货主名称",
                            "ERP验收单号",
                            "收货日期",
                            "商品货号(出厂)",
                            "商品名称",
                            "规格/型号",
                            "商品基本单位",
                            "冷藏车车牌号",
                            "温度计编号",
                            "保温箱编号",
                            "DI码",
                            "批准文号/备案凭证编号",
                            "产地",
                            "验收合格数量",
                            "ERP收货通知单号",
                            "生产批号/序列号",
                            "到货数量",
                            "生产日期",
                            "失效日期",
                            "购货日期",
                            "供货者地址",
                            "联系人",
                            "联系电话",
                            "验收员",
                            "复核员",
                            "供货单位编码",
                            "供货单位",
                            "供货单位组织机构代码",
                            "收货类型",
                            "SKU标识",
                            "商品操作码",
                            "注册证号/备案凭证编号",
                            "生产企业/受托生产企业",
                            "验收结果",
                            "备注",
                            "不合格事项及处理措施",
                            "生产许可证/备案凭证编号",
                            "验收日期",
                            "生产企业证件有效期",
                            "供应商经营许可证/备案凭证编号",
                            "供应商证件有效期",
                            "注册证号/备案凭证编号有效期",
                            "合格证明",
                            "灭菌批号",
                            "灭菌日期",
                            "灭菌效期",
                            "收货通知编号",
                            "有效期",
                            "地区",
                            "批准文号/备案凭证编号有效期",
                            "注册人/备案人/上市许可持有人",
                            "采购备注",
                            "是否绑定",
                            "编号",
                            "储存条件",
                            "运输温度",
                        ],
                    ];


                    $.each(data.root, function (k, v) {
                        let arr = [];
                        arr.push(v.dataType);
                        arr.push(v.wiNoticeReceiptcode);
                        arr.push(v.wiOocName);
                        arr.push(v.wiERPNumber);
                        arr.push(PubFunc.render_date(v.wiDateAcceptance));
                        arr.push(v.codCode2);
                        arr.push(v.wiCommodityName);
                        arr.push(v.wiCommercialSpecification);
                        arr.push(v.wiBasicCommodityUnit);
                        arr.push(v.LCCCPH);
                        arr.push(v.WDJBH);
                        arr.push(v.BWXBH);
                        arr.push(v.comBarCode);
                        arr.push(v.wsxLicenseNumber);
                        arr.push(v.wiProducingArea);
                        arr.push(v.wsxTotalQuantity);
                        arr.push(v.wiERPNumber);
                        arr.push(v.wsxBatch);
                        arr.push(v.wsxTotalQuantity);
                        arr.push(v.wsxDateManufacture);
                        arr.push(v.wiExpiryDate);
                        arr.push(v.ghrq);
                        arr.push(v.ghzdz);
                        arr.push(v.lxr);
                        arr.push(v.lxdh);
                        arr.push(v.wsxReviewPerson);
                        arr.push(v.wsxReviewPersontwo);
                        arr.push(v.rrCargoUnitsOperation);
                        arr.push(v.wiCargoUnits);
                        arr.push(v.wixZZJGM);
                        arr.push(v.wiReceivingType);
                        arr.push(v.wiSKUCharacteristic);
                        arr.push(v.wiCommodityOperationCode);
                        arr.push(v.rnxRegisterNo);
                        arr.push(v.wiManufacturer);
                        arr.push(v.wsxQualityStatus);
                        arr.push(v.wiRemarks);
                        arr.push(v.wsxRemarks);
                        arr.push(v.codProductionLicenseNo);
                        arr.push(PubFunc.render_date(v.wiDateAcceptance));
                        arr.push(v.licenceTypeTime);
                        arr.push(v.unitMDSINDeal);
                        arr.push(PubFunc.render_date(v.unitMDSINDate));
                        arr.push(PubFunc.render_date(v.codValidPeriodRegistration));
                        arr.push(v.wiZM);
                        arr.push(v.wsxSterilizationBatchNumber);
                        arr.push(v.wsxSterilizationProductionDate);
                        arr.push(v.wsxEffectivePeriodSterilization);
                        arr.push(v.wiHarvestNotificationNumber);
                        arr.push(v.wsxValidTill);
                        arr.push(v.unitzZone);
                        arr.push(PubFunc.render_date(v.codLicenseNumTermValidity));
                        arr.push(v.holder);
                        arr.push(v.purchaseCode);
                        arr.push(renderer_func.r_boolean(v.locking));
                        arr.push(v.id);
                        arr.push(v.comCodStorageCondition);
                        arr.push(v.StorageSpecificTemperature);
                        ws_data.push(arr);
                    });
                    let ws = XLSX.utils.aoa_to_sheet(ws_data);

                    // 将工作表添加到工作簿
                    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                    let wbout = XLSX.write(wb, { bookType: 'xls', type: 'binary' });


                    // 创建Blob对象，并使用它创建一个URL
                    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);

                    // 创建a标签并模拟点击以下载文件
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "入库记录" + formattedDate + '.xls';
                    a.click();

                    // 清除URL对象
                    URL.revokeObjectURL(url);
                    // alert("导出成功");
                    // window.open(data.info);
                }
            })
        });
    }

    function producersstock() {
        $(document).find("button:contains('显示全部(A)')").parent().parent().parent().parent().parent().parent().parent().append(`
            <td class="x-toolbar-cell" id="nmsl-ext-gen39">
                <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                    <tbody class="x-btn-small x-btn-icon-small-left">
                    <tr>
                        <td class="x-btn-tl">
                        <i>&nbsp;</i>
                        </td>
                        <td class="x-btn-tc"></td>
                        <td class="x-btn-tr">
                        <i>&nbsp;</i>
                        </td>
                    </tr>
                    <tr>
                        <td class="x-btn-ml">
                        <i>&nbsp;</i>
                        </td>
                        <td class="x-btn-mc">
                        <em class=" x-unselectable" unselectable="on">
                            <button type="button" id="nmsl-ext-gen40" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">导出数据</button></em>
                        </td>
                        <td class="x-btn-mr">
                        <i>&nbsp;</i>
                        </td>
                    </tr>
                    <tr>
                        <td class="x-btn-bl">
                        <i>&nbsp;</i>
                        </td>
                        <td class="x-btn-bc"></td>
                        <td class="x-btn-br">
                        <i>&nbsp;</i>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        `);

        $(document).find('#nmsl-ext-gen40').click(function () {


            alert("导出大概需要1分钟左右的时间,这期间不要刷新页面.");
            let today = new Date();
            let year = today.getFullYear();
            let month = String(today.getMonth() + 1).padStart(2, '0');
            let day = String(today.getDate()).padStart(2, '0');
            let formattedDate = `${year}-${month}-${day}`;

            var arr = [];
            $.each($(".x-grid3-hd"), function (k, v) {
                arr.push($(v).text());
            });


            // 创建工作表数据

            $.ajax({
                type: "POST",
                url: "/" + url_prefix + "/libraryservice/inventoryquery!query.action?queryaction=storeadjustmentAction",
                data: {
                    "limit": 1145140,
                    "propertyCriteria": "saStockQuantity:ne:$0,saStockQuantity:ne:$0.0,saStockQuantity:ne:$0.00,saStockQuantity:ne:$0.000,"
                    // "propertyCriteria": "sscSJ:eq:$否"
                },
                dataType: "json",
                success: function (data) {
                    // return;
                    let wb = XLSX.utils.book_new();
                    let ws_data = [
                        [
                            "货主ID",
                            "货主名称",
                            "库存状态",
                            "商品经营类别",
                            'DI码',
                            "效期锁定",
                            "商品标识",
                            "商品操作码",
                            "商品货号(出厂)",
                            "药品本位码",
                            "商品名称",
                            "商品类型",
                            "商品效期格式",
                            "供应商名称",
                            "供应商ID",
                            "采购税率",
                            "销售税率",
                            "生产厂商",
                            "储存条件",
                            "库存数量",
                            "不含税单价",
                            "不含税金额",
                            "税额",
                            "库存单价",
                            "库存金额",
                            "可配库存数量",
                            "是否第三方审核",
                            "是否货主审核",
                            "批号",
                            "批号ID",
                            "商品规格",
                            "生产日期",
                            "失效日期",
                            "货位编号",
                            "单品条码",
                            "商品基本单位",
                            "商品箱单位",
                            "生产许可证",
                            "注册证号/备案凭证编号",
                            "批准文号",
                            "货位标识",
                            "SKU标识",
                            "区域ID",
                            "区域编号",
                            "区域类型",
                            "SKU信息",
                            "包装大小",
                            "货品状态",
                            "批号标识",
                            "商品等级名称",
                            "商品明细ID",
                            "质量状态",
                            "进货价",
                            "来货时间",
                            "SKU操作码",
                            "SKU名称",
                            "产地",
                            "件数",
                            "可配库存件数",
                            "散件数",
                            "可配库存散件数",
                            "失效日期",
                            "距离失效期天数",
                            "原散件标志",
                            "待出库存",
                            "贵重等级",
                            "贵重标志",
                            "使用状态",
                            "仓库",
                            "仓库ID",
                            "收货细单标识号",
                            "储存属性",
                            "有效期",
                            "备注",
                            "不合格是否完成",
                            '所属部门',
                            '批号审核字段值保存',
                        ],
                    ];


                    $.each(data.root, function (k, v) {
                        let arr = [];
                        arr.push(v.ooc_id);
                        arr.push(v.saOocName);
                        arr.push(v.sastatus);
                        arr.push(v.classification);
                        arr.push(v.barCode);
                        arr.push(renderer_func.r_boolean(v.isSD));
                        arr.push(v.saProductIdentification);
                        arr.push(v.saCommodityOperationCode);
                        arr.push(v.codCode2);
                        arr.push(v.standardCode);
                        arr.push(v.saCommodityName);
                        arr.push(v.codGoodsType);
                        arr.push(v.validityFormat);
                        arr.push(v.saSupplierName);
                        arr.push(v.saSupplierID_id);
                        arr.push(v.purchaseTax);
                        arr.push(v.cess);
                        arr.push(v.saBrand);
                        arr.push(v.saConditionStorage);
                        arr.push(renderer_func.r_numUnit(v.saStockQuantity, v));
                        arr.push(renderer_func.r_excludingTax(v.excludingTax, v));
                        arr.push(renderer_func.r_excludingPrice(v.excludingPrice, v));
                        arr.push(renderer_func.r_taxPrice(v.taxPrice, v));
                        arr.push(v.saPrice);
                        arr.push(v.saMoney);
                        arr.push(renderer_func.r_numUnit(v.saKPStockQuantity, v));
                        arr.push(renderer_func.r_boolean(v.isStoreAudit));
                        arr.push(renderer_func.r_boolean(v.isOocAudit));
                        arr.push(v.saBatch);
                        arr.push(v.saBatchId_id);
                        arr.push(v.saCommercialSpecification);
                        arr.push(v.saDateManufacture);
                        arr.push(v.saExpiryDate);
                        arr.push(v.saGoodsAllocationNo);
                        arr.push(v.saSingleProductBarCode);
                        arr.push(v.saBasicCommodityUnit);
                        arr.push(v.mtSkuBoxUnit);
                        arr.push(v.saProductionLicenseNo);
                        arr.push(v.saRegistrationCertificateNo);
                        arr.push(v.saLicenseNumber);
                        arr.push(v.saLocationIdentification);
                        arr.push(v.saSKULogo);
                        arr.push(v.saAreaID_id);
                        arr.push(v.saAreaNo);
                        arr.push(v.areatype);
                        arr.push(v.saSKUInformation);
                        arr.push(renderer_func.r_packageSize(v.saPackageSize, v));
                        arr.push(v.saItemStatus);
                        arr.push(v.saBatchIndicator);
                        arr.push(v.saCommodityGradeName);
                        arr.push(v.saCommodityDetailID);
                        arr.push(v.saQualityStatus);
                        arr.push(v.saBuyingPrice);
                        arr.push(v.saDeliveryTime);
                        arr.push(v.saSKUActionCode);
                        arr.push(v.saSKUName);
                        arr.push(v.saPlaceProduction);
                        arr.push(renderer_func.r_numUnit_(v.saNumberPackages, v));
                        arr.push(renderer_func.r_numUnit_(v.saKPNumberPackages, v));
                        arr.push(renderer_func.r_numUnit(v.saNumberSpareParts, v));
                        arr.push(renderer_func.r_numUnit(v.saKPNumber, v));
                        arr.push(v.stExpirationDate);
                        arr.push(renderer_func.r_saDayNum(v.saDayNum, v));
                        arr.push(v.saOriginalPartsMark);
                        arr.push(renderer_func.r_saDayNum(v.saOutStock, v));
                        arr.push(v.saPreciousClass);
                        arr.push(v.saValuableSymbol);
                        arr.push(v.saLifeCycleCosting);
                        arr.push(v.saWarehouseList);
                        arr.push(v.saStorehouseID_id);
                        arr.push(v.saReceivingNoticeFineLogo);
                        arr.push(v.saStorageProperties);
                        arr.push(v.saVld);
                        arr.push(v.saBZ);
                        arr.push(v.saChannelNumber);
                        arr.push(v.dept_dname);
                        arr.push(v.saveAuditValue);
                        ws_data.push(arr);
                    });
                    let ws = XLSX.utils.aoa_to_sheet(ws_data);

                    // 将工作表添加到工作簿
                    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                    let wbout = XLSX.write(wb, { bookType: 'xls', type: 'binary' });


                    // 创建Blob对象，并使用它创建一个URL
                    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                    const url = URL.createObjectURL(blob);

                    // 创建a标签并模拟点击以下载文件
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = "商品库存查询-库存查询" + formattedDate + '.xls';
                    a.click();

                    // 清除URL对象
                    URL.revokeObjectURL(url);
                    // alert("导出成功");
                    // window.open(data.info);
                }
            })
        });
    }

    function salesoutlibrary() {

        $(document).ready(function () {

            // 选择需要观察变动的节点，这里选择整个文档体
            const targetNode = document.body;

            // 观察器的配置（需要观察什么变动）
            const config = { childList: true };

            // 当观察到变动时执行的回调函数
            const callback = function (mutationsList) {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        // 检查是否新增了特定的元素
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // 查找包含“模糊查询”文本的div
                                const queryDiv = $(node).find(".x-table-layout-cell .x-panel .x-panel-bwrap div:contains('模糊查询:')");
                                if (queryDiv.length > 0) {
                                    console.log("包含'模糊查询'的div已添加到DOM中!");

                                    let timer_count = 0;
                                    let timer = setInterval(function () {
                                        console.log("计时器执行");
                                        if ($(queryDiv).closest(".x-window-body").find(".x-grid3-hd-row .x-grid3-cell div:contains('单位名称')").length > 0) {
                                            console.log("非目标列表,停止计时器");
                                            clearInterval(timer);
                                        }

                                        if ($(queryDiv).closest(".x-window-body").find(".x-grid3-hd-row .x-grid3-cell div:contains('商品名称')").length > 0) {

                                            if ($(queryDiv).closest(".x-window-body").find(".x-unselectable button:contains('批量增加')").length > 0) {
                                                console.log("批量选择列表,停止计时器");
                                                queryDiv.parent().parent().parent().parent().append(`
                                                    <tr class="x-table-layout-cell" id="nmsl-cargo-space-query">
                                                        <td class="x-toolbar-cell" id="nmsl-ext-gen39">
                                                            <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                                                                <tbody class="x-btn-small x-btn-icon-small-left">
                                                                <tr>
                                                                    <td class="x-btn-tl">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                    <td class="x-btn-tc"></td>
                                                                    <td class="x-btn-tr">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="x-btn-ml">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                    <td class="x-btn-mc">
                                                                    <em class=" x-unselectable" unselectable="on">
                                                                        <button type="button" id="nmsl-ext-gen40" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">查询货位信息</button></em>
                                                                    </td>
                                                                    <td class="x-btn-mr">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="x-btn-bl">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                    <td class="x-btn-bc"></td>
                                                                    <td class="x-btn-br">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                `);
                                                clearInterval(timer);
                                            }

                                            if ($(queryDiv).closest(".x-window-body").find(".x-unselectable button:contains('批量增加')").length <= 0) {
                                                console.log("单独查询列表,停止计时器");
                                                queryDiv.parent().parent().parent().parent().append(`
                                                    <tr class="x-table-layout-cell" id="nmsl-cargo-space-query">
                                                        <td class="x-toolbar-cell" id="nmsl-ext-gen39">
                                                            <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                                                                <tbody class="x-btn-small x-btn-icon-small-left">
                                                                <tr>
                                                                    <td class="x-btn-tl">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                    <td class="x-btn-tc"></td>
                                                                    <td class="x-btn-tr">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="x-btn-ml">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                    <td class="x-btn-mc">
                                                                    <em class=" x-unselectable" unselectable="on">
                                                                        <button type="button" id="nmsl-ext-gen40" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">查询货位信息</button></em>
                                                                    </td>
                                                                    <td class="x-btn-mr">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td class="x-btn-bl">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                    <td class="x-btn-bc"></td>
                                                                    <td class="x-btn-br">
                                                                    <i>&nbsp;</i>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                `);
                                                clearInterval(timer);
                                            }


                                            $(document).find("#nmsl-ext-gen40").on({
                                                mouseover: function () {
                                                    // console.log("鼠标移到查询货位信息上");
                                                    // 鼠标移动到元素上时增加 x-btn-over 类
                                                    $(this).closest('#nmsl-ext-comp-1003').addClass("x-btn-over");
                                                },
                                                mouseout: function () {
                                                    // console.log("鼠标移开查询货位信息");
                                                    // 鼠标移开时删除 x-btn-over 类
                                                    $(this).closest('#nmsl-ext-comp-1003').removeClass("x-btn-over");
                                                    $(this).closest('#nmsl-ext-comp-1003').removeClass("x-btn-click");

                                                },
                                                mousedown: function () {
                                                    // console.log("鼠标按下查询货位信息");
                                                    // 鼠标按下时增加 x-btn-click 类
                                                    $(this).closest('#nmsl-ext-comp-1003').addClass("x-btn-click");
                                                },
                                                mouseup: function () {
                                                    // console.log("鼠标松开查询货位信息");
                                                    // 鼠标松开时删除 x-btn-click 类
                                                    $(this).closest('#nmsl-ext-comp-1003').removeClass("x-btn-click");
                                                },
                                                click: function () {
                                                    // console.log($(this).closest(".x-window-body")[0]);

                                                    if ($(this).closest(".x-window-body").find(".x-grid3-cell div:contains('货位')").length <= 0) {
                                                        let target_element = $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('商品名称')").closest("td");
                                                        console.log(target_element[0]);
                                                        target_element.after(`
                                                            <td class="x-grid3-hd x-grid3-cell nmsl-x-grid3-td-10" style="width: 106px;">
                                                                <div class="x-grid3-hd-inner nmsl-x-grid3-hd-10" unselectable="on" style="">
                                                                    <a class="x-grid3-hd-btn" href="#" id="nmsl-ext-gen713" style="height: 22px;">
                                                                    </a>
                                                                    货位
                                                                    <img alt="" class="x-grid3-sort-icon" src="/wms/extjs/images/default/s.gif">
                                                                </div>
                                                            </td>
                                                            <td class="x-grid3-hd x-grid3-cell nmsl-x-grid3-td-11" style="width: 70px;">
                                                                <div class="x-grid3-hd-inner nmsl-x-grid3-hd-11" unselectable="on" style="">
                                                                    <a class="x-grid3-hd-btn" href="#" id="nmsl-ext-gen714" style="height: 22px;">
                                                                    </a>
                                                                    库存
                                                                    <img alt="" class="x-grid3-sort-icon" src="/wms/extjs/images/default/s.gif">
                                                                </div>
                                                            </td>
                                                        `);
                                                    }


                                                    // 产品名 批号 数量 供应商 规格
                                                    // let key_index = {
                                                    //     "product_name": $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('商品名称')").closest("td").index(),
                                                    //     "product_spec": $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('规格/型号')").closest("td").index(),
                                                    //     "product_di": $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('DI码')").closest("td").index(),
                                                    //     "org_name": $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('生产企业/受托生产企业')").closest("td").index(),
                                                    //     "owner": $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('货主')").closest("td").index(),
                                                    //     "product_code": $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('商品货号(出厂)')").closest("td").index(),
                                                    // };

                                                    let product_name_td = $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('商品名称')").closest("td");
                                                    let product_spec_td = $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('规格/型号')").closest("td");
                                                    let product_di_td = $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('DI码')").closest("td");
                                                    let org_name_td = $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('生产企业/受托生产企业')").closest("td");
                                                    let owner_td = $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('货主')").closest("td");
                                                    let product_code_td = $(this).closest(".x-window-body").find(".x-grid3-cell div:contains('商品货号(出厂)')").closest("td");


                                                    let key_index = {
                                                        "product_name": getTdNumber(product_name_td),
                                                        "product_spec": getTdNumber(product_spec_td),
                                                        "product_di": getTdNumber(product_di_td),
                                                        "org_name": getTdNumber(org_name_td),
                                                        "owner": getTdNumber(owner_td),
                                                        "product_code": getTdNumber(product_code_td),
                                                    };

                                                    if ($(this).closest(".x-window-body").find(".x-grid3-scroller .nmsl-x-grid3-col-7").length <= 0) {
                                                        console.log("插入执行");
                                                        $(this).closest(".x-window-body").find(".x-grid3-col-" + key_index.product_name).closest("td").after(`
                                                            <td class="x-grid3-col x-grid3-cell nmsl-x-grid3-td-7 " style="width: 106px;" tabindex="0">
                                                                <div class="x-grid3-cell-inner nmsl-x-grid3-col-7 x-unselectable" unselectable="on">
                                                                    <div
                                                                        style="background:#eee; padding:2px; border: 2px solid #fff; border-radius:4px; color:#000; font-weight:normal; text-align:center;">
                                                                        等待查询
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td class="x-grid3-col x-grid3-cell nmsl-x-grid3-td-8 " style="width: 70px;" tabindex="0">
                                                                <div class="x-grid3-cell-inner nmsl-x-grid3-col-8 x-unselectable" unselectable="on">
                                                                    <div
                                                                        style="background:#eee; padding:2px; border: 2px solid #fff; border-radius:4px; color:#000; font-weight:normal; text-align:center;">
                                                                        等待查询
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        `);

                                                    }

                                                    console.table(key_index);

                                                    let params = {
                                                        "limit": 114514,
                                                    };

                                                    let kw = $(this).closest(".x-table-layout").find("#likequeryTextfieldId").val();
                                                    if (kw != "" && kw != "输入搜索条件") {
                                                        params.likeQueryType = "库存查询";
                                                        params.likeQueryInfo = kw;
                                                        params.propertyCriteria = "saStockQuantity:ne:$0,saStockQuantity:ne:$0.0,saStockQuantity:ne:$0.00,saStockQuantity:ne:$0.000";
                                                    } else {
                                                        params.propertyCriteria = "saStockQuantity:ne:,saStockQuantity:ne:$0.0,saStockQuantity:ne:$0.00,saStockQuantity:ne:$0.000,";
                                                    }

                                                    let data_list = {};
                                                    let table_list = $(this).closest(".x-window-body").find(".x-grid3-col-" + key_index.product_name).closest(".x-grid3-body").find(".x-grid3-row");
                                                    $.ajax({
                                                        type: "POST",
                                                        url: "/" + url_prefix + "/libraryservice/inventoryquery!query.action?queryaction=storeadjustmentAction",
                                                        data: params,
                                                        success: function (data) {
                                                            console.log(data);
                                                            $.each(data.root, function (k, v) {
                                                                let data_key = `${v.saCommodityName.trim()}/${v.saCommercialSpecification.trim()}/${v.barCode.trim()}/${v.saBrand.trim()}/${v.saOocName.trim()}/${v.codCode2.trim()}`
                                                                data_list[data_key] = v;
                                                            });
                                                            console.table(data_list);
                                                            $.each(table_list, function (k, v) {
                                                                let data_key = {
                                                                    product_name: $(this).find("tbody tr .x-grid3-td-" + key_index.product_name).text().trim(),
                                                                    product_spec: $(this).find("tbody tr .x-grid3-td-" + key_index.product_spec).text().trim(),
                                                                    product_di: $(this).find("tbody tr .x-grid3-td-" + key_index.product_di).text().trim(),
                                                                    org_name: $(this).find("tbody tr .x-grid3-td-" + key_index.org_name).text().trim(),
                                                                    owner: window.top.orgName.trim(),
                                                                    product_code: $(this).find("tbody tr .x-grid3-td-" + key_index.product_code).text().trim(),
                                                                };
                                                                data_key = data_key.product_name + "/" + data_key.product_spec + "/" + data_key.product_di + "/" + data_key.org_name + "/" + data_key.owner + "/" + data_key.product_code;
                                                                console.log(data_key);
                                                                if (data_list[data_key] != undefined) {
                                                                    $(this).find(".nmsl-x-grid3-col-8 div").text(data_list[data_key].saStockQuantity + " " + data_list[data_key].saBasicCommodityUnit);
                                                                    $(this).find(".nmsl-x-grid3-col-8 div").css("background", "#00ff00");
                                                                    $(this).find(".nmsl-x-grid3-col-7 div").text(data_list[data_key].saGoodsAllocationNo);
                                                                    $(this).find(".nmsl-x-grid3-col-7 div").css("background", "#00ff00");
                                                                } else {
                                                                    $(this).find(".nmsl-x-grid3-col-8 div").text("无库存");
                                                                    $(this).find(".nmsl-x-grid3-col-8 div").css("background", "#f00");
                                                                    $(this).find(".nmsl-x-grid3-col-7 div").text("未查到货位");
                                                                    $(this).find(".nmsl-x-grid3-col-7 div").css("background", "#f00");
                                                                }
                                                            });
                                                            // data_list = data.info
                                                        },
                                                    });
                                                }
                                            });


                                        }



                                        timer_count++;
                                        if (timer_count >= 30) {
                                            alert("页面数据加载缓慢,脚本停止运行,关闭搜索列表重新进入时脚本重新执行.");
                                            clearInterval(timer);
                                        }


                                    }, 1000);

                                    // 如果只需要执行一次，可以停止观察
                                    // observer.disconnect();
                                }
                            }
                        });
                    }
                }
            };




            // 创建一个观察器实例并传入回调函数
            const observer = new MutationObserver(callback);

            // 以上述配置开始观察目标节点
            observer.observe(targetNode, config);


        });

    }

    function commodity() {
        $(function () {



            $(document).find("button:contains('修改(U)')").click(function () {
                // alert("修改点击");
                if ($(document).find(".x-grid3-row-selected").length <= 0) {
                    console.log("为选中数据");
                    return;
                }
            });

            $(document).find("button:contains('高级搜索(S)')").click(function () {
                // alert("高级搜索");
                let timer = setInterval(function () {
                    console.log("搜索框", $(document).find("#search_classification").length);
                    if ($(document).find("#search_classification").length > 0) {
                        clearInterval(timer);
                        $(document).find("#search_classification").hide();
                        $(document).find("#search_classification").after(`
                            <select type="text" autocomplete="off" id="nmsl-search_classification" class="x-form-text x-form-field" style="width: 194px; background-color: #fff;" title="">
                                <option value="">全部</option>
                                <option value="Ⅰ类">Ⅰ类</option>
                                <option value="Ⅱ类">Ⅱ类</option>
                                <option value="Ⅲ类">Ⅲ类</option>
                                <option value="非医疗器械">非医疗器械</option>
                            </select>
                        `);

                    }
                }, 200);
            });

            $(document).on("change", "#nmsl-search_classification", function () {
                // alert($(this).val());
                $(document).find('#search_classification').val($(this).val());
            });

            $(document).on("click", ".x-unselectable button:contains('搜索')", function () {
                if ($(document).find('#search_oocName').val() == "null") {
                    $(document).find('#search_oocName').val("");
                }
                // alert($(this).val());
                // $(document).find('#search_classification').val($(this).val());
            });

            $(document).on("click", "#tabs__tab3", function () {
                let timer = setInterval(function () {
                    if ($(document).find('#nmsl-ext-gen1306').length >= 1) {
                        clearInterval(timer);
                        return;
                    }
                    if ($(document).find("#tab3 .x-toolbar-cell label:contains('模糊搜索')").closest('.x-toolbar-left-row').length >= 1) {
                        clearInterval(timer);
                        $(document).find("#tab3 .x-toolbar-cell label:contains('模糊搜索')").closest('.x-toolbar-left-row').append(`
                            <td class="x-toolbar-cell" id="nmsl-ext-gen1306">
                                <table id="nmsl-ext-comp-1747" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                                    <tbody class="x-btn-small x-btn-icon-small-left">
                                        <tr>
                                            <td class="x-btn-tl">
                                                <i>&nbsp;</i>
                                            </td>
                                            <td class="x-btn-tc"></td>
                                            <td class="x-btn-tr">
                                                <i>&nbsp;</i>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="x-btn-ml">
                                                <i>&nbsp;</i>
                                            </td>
                                            <td class="x-btn-mc">
                                                <em class=" x-unselectable" unselectable="on">
                                                    <button type="button" id="nmsl-ext-gen1307" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">导出</button>
                                                </em>
                                            </td>
                                            <td class="x-btn-mr">
                                                <i>&nbsp;</i>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="x-btn-bl">
                                                <i>&nbsp;</i>
                                            </td>
                                            <td class="x-btn-bc"></td>
                                            <td class="x-btn-br">
                                                <i>&nbsp;</i>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        `);

                        $(document).find("#nmsl-ext-gen1307").on({
                            mouseover: function () {
                                // console.log("鼠标移到查询货位信息上");
                                // 鼠标移动到元素上时增加 x-btn-over 类
                                $(this).closest('#nmsl-auto-login').addClass("x-btn-over");
                            },
                            mouseout: function () {
                                // console.log("鼠标移开查询货位信息");
                                // 鼠标移开时删除 x-btn-over 类
                                $(this).closest('#nmsl-auto-login').removeClass("x-btn-over");
                                $(this).closest('#nmsl-auto-login').removeClass("x-btn-click");

                            },
                            mousedown: function () {
                                // console.log("鼠标按下查询货位信息");
                                // 鼠标按下时增加 x-btn-click 类
                                $(this).closest('#nmsl-auto-login').addClass("x-btn-click");
                            },
                            mouseup: function () {
                                // console.log("鼠标松开查询货位信息");
                                // 鼠标松开时删除 x-btn-click 类
                                $(this).closest('#nmsl-auto-login').removeClass("x-btn-click");
                            },
                            click: function () {
                                $.ajax({
                                    url: '/' + url_prefix + '/base/commodityInfo/sku!query.action',
                                    type: 'post',
                                    data: {
                                        limit: 114514,
                                        propertyCriteria: ""
                                    },
                                    success: function (data) {

                                        let today = new Date();
                                        let year = today.getFullYear();
                                        let month = String(today.getMonth() + 1).padStart(2, '0');
                                        let day = String(today.getDate()).padStart(2, '0');
                                        let formattedDate = `${year}-${month}-${day}`;

                                        let wb = XLSX.utils.book_new();
                                        let ws_data = [
                                            [
                                                "SKU状态",
                                                "SKU是否核对",
                                                "商品标识",
                                                "商品名称",
                                                "SKU操作码",
                                                "SKU名称",
                                                "包装名称",
                                                "商品规格",
                                                "包装大小",
                                                "批准文号",
                                                "厂牌",
                                                "拼音",
                                                "商品明细ID",
                                                "商品基本单位",
                                                "商品属性",
                                                "货主",
                                                "条形码",
                                                "产品说明",
                                                "产地",
                                                "冷藏类别",
                                                "颜色",
                                                "型号",
                                                "注册证号/备案凭证编号",
                                                "原ERP厂家标识",
                                                "生产许可证号/备案凭证编号",
                                                "储存条件",
                                                "存储属性",
                                                "保管分类",
                                                "防寒标志",
                                                "储备商品属性",
                                                "贵重等级",
                                                "有效期",
                                                "有效期单位",
                                                "混装类别",
                                                "ABC分类",
                                                "描述",
                                                "托盘含量",
                                                "标准净重",
                                                "标准毛重",
                                                "标准立方",
                                                "单位",
                                                "数量",
                                                "毛重",
                                                "净重",
                                                "皮重",
                                                "长",
                                                "宽",
                                                "高",
                                                "体积",
                                                "箱单位",
                                                "箱数量",
                                                "箱毛重",
                                                "箱净重",
                                                "箱皮重",
                                                "箱长",
                                                "箱宽",
                                                "箱高",
                                                "箱体积",
                                                '所属部门',
                                            ],
                                        ];
                                        $.each(data.root, function (k, v) {
                                            let arr = [];
                                            arr.push(v.skuStatus);
                                            arr.push(renderer_func.r_boolean(v.checks));
                                            arr.push(v.goodsIdentification_codProductIdentification);
                                            arr.push(v.goodsName);
                                            arr.push(v.skuActionCode);
                                            arr.push(v.skuName);
                                            arr.push(v.skuPackageName);
                                            arr.push(v.commercialSpecification);
                                            arr.push(v.skuBoxNum);
                                            arr.push(v.licenseNumber);
                                            arr.push(v.brand);
                                            arr.push(v.skuPY);
                                            arr.push(v.commodityDetailID);
                                            arr.push(v.basicCommodityUnit);
                                            arr.push(v.skuCommodityAttribute);
                                            arr.push(v.shipper);
                                            arr.push(v.barCode);
                                            arr.push(v.productDescription);
                                            arr.push(v.producingArea);
                                            arr.push(v.coldStorageCategory);
                                            arr.push(v.pigment);
                                            arr.push(v.model);
                                            arr.push(v.registrationCertificateNo);
                                            arr.push(v.oldERPManufacturerI);
                                            arr.push(v.productionLicenseNo);
                                            arr.push(v.conditionStorage);
                                            arr.push(v.storageProperties);
                                            arr.push(v.cstodyClassification);
                                            arr.push(renderer_func.r_boolean(v.proofMark));
                                            arr.push(renderer_func.r_boolean(v.reserveCommodityAttribute));
                                            arr.push(v.preciousClass);
                                            arr.push(v.termValidity);
                                            arr.push(v.unitvValidity);
                                            arr.push(v.mixedType);
                                            arr.push(v.abcClassify);
                                            arr.push(v.skuDescribe);
                                            arr.push(v.skuTrayContent);
                                            arr.push(v.skuStandardNetWeight);
                                            arr.push(v.skuStandardWeight);
                                            arr.push(v.skuStandardCube);
                                            arr.push(v.skuBzUnit);
                                            arr.push(v.skuBzNum);
                                            arr.push(v.skuBzWeight);
                                            arr.push(v.skuBzNetWeight);
                                            arr.push(v.skuBzTare);
                                            arr.push(v.skuBzLong);
                                            arr.push(v.skuBzWide);
                                            arr.push(v.skuBzHeight);
                                            arr.push(v.skuBzBulk);
                                            arr.push(v.skuBoxUnit);
                                            arr.push(v.skuBoxNum);
                                            arr.push(v.skuBoxWeight);
                                            arr.push(v.skuBoxNetWeight);
                                            arr.push(v.skuBoxTare);
                                            arr.push(v.skuBoxLong);
                                            arr.push(v.skuBoxWide);
                                            arr.push(v.skuBoxHeight);
                                            arr.push(v.skuBoxBulk);
                                            arr.push(v.dept_dname);
                                            ws_data.push(arr);
                                        });
                                        let ws = XLSX.utils.aoa_to_sheet(ws_data);

                                        // 将工作表添加到工作簿
                                        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                                        let wbout = XLSX.write(wb, { bookType: 'xls', type: 'binary' });


                                        // 创建Blob对象，并使用它创建一个URL
                                        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                                        const url = URL.createObjectURL(blob);

                                        // 创建a标签并模拟点击以下载文件
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = "SKU信息" + formattedDate + '.xls';
                                        a.click();
                                        // 清除URL对象
                                        URL.revokeObjectURL(url);
                                    },
                                    error: function (data) {
                                        // alert("导出失败.");
                                    }
                                });
                            }
                        });





                    }
                }, 1000);

            });

        });
    }

    // 货主费用管理
    function costmanagement() {
        $(function () {
            $(document).find("button:contains('显示全部(A)')").parent().parent().parent().parent().parent().parent().parent().append(`
                <td class="x-toolbar-cell" id="nmsl-ext-gen39">
                    <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                        <tbody class="x-btn-small x-btn-icon-small-left">
                        <tr>
                            <td class="x-btn-tl">
                            <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-tc"></td>
                            <td class="x-btn-tr">
                            <i>&nbsp;</i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-ml">
                            <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-mc">
                            <em class=" x-unselectable" unselectable="on">
                                <button type="button" id="nmsl-ext-gen40" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">导出全部数据</button></em>
                            </td>
                            <td class="x-btn-mr">
                            <i>&nbsp;</i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-bl">
                            <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-bc"></td>
                            <td class="x-btn-br">
                            <i>&nbsp;</i>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            `);

            $(document).find('#nmsl-ext-gen40').click(function () {

                let today = new Date();
                let year = today.getFullYear();
                let month = String(today.getMonth() + 1).padStart(2, '0');
                let day = String(today.getDate()).padStart(2, '0');
                let formattedDate = `${year}-${month}-${day}`;


                let startDate = prompt("请输入开始时间（格式：YYYY-MM-DD）");
                if (!startDate) {
                    alert("未输入开始时间，导出取消");
                    return;
                }

                let endDate = prompt("请输结束时间（格式：YYYY-MM-DD）,不填则使用今天.");
                if (!endDate) {
                    endDate = formattedDate;
                }


                // 检查输入的日期格式是否正确
                let datePattern = /^\d{4}-\d{2}-\d{2}$/;
                if (!datePattern.test(startDate)) {
                    alert("开始日期格式不正确，请输入正确的日期格式（YYYY-MM-DD）");
                    return;
                }

                if (!datePattern.test(endDate)) {
                    alert("结束日期格式不正确，请输入正确的日期格式（YYYY-MM-DD）");
                    return;
                }


                // alert("点击");
                $.ajax({
                    type: "post",
                    url: "/" + url_prefix + "/costcenter/costmanagement!query.action",
                    data: {
                        "limit": 114514,
                        "propertyCriteria": "cmCostGenerationTime:ge:" + startDate + " 00:00:00,cmCostGenerationTime:le:" + endDate + " 23:59:59"
                    },
                    success: function (data) {

                        let wb = XLSX.utils.book_new();
                        let ws_data = [
                            [
                                "结算状态",
                                "开票状态",
                                "货主",
                                "供应商ID",
                                "供应商",
                                "单位信息",
                                "费用产生日期",
                                "费用产生方式",
                                "创建人",
                                "费用产生类别",
                                "来源类型",
                                "销售合同编号",
                                "来源编号",
                                "计费规则编号",
                                "计费规则名称",
                                "计费单位",
                                "物料编码",
                                "物料备注",
                                "物料状态",
                                "商品货号",
                                "商品名称",
                                "商品类别",
                                "储存条件",
                                "商品基本单位",
                                "规格型号",
                                "商品信息",
                                "单个商品体积（m³）",
                                "入库时间",
                                "出库时间",
                                "在库时间",
                                "业务员",
                                "数量",
                                "单价",
                                "金额",
                                "超过体积",
                                "合同体积(m³)/数量",
                                "超出单价",
                                "结算折扣",
                                "实结金额",
                                "开票金额",
                                "结算人",
                                "结算时间",
                                "备注",
                                '所属部门',
                            ],
                        ];


                        $.each(data.root, function (k, v) {
                            let arr = [];
                            arr.push(renderer_func.r_JSStatus(v.cmSettlementStatus));
                            arr.push(v.cmBillingStatus);
                            arr.push(v.cmOocName);
                            arr.push(v.saSupplierID_id);
                            arr.push(v.saSupplierID_unitName);
                            arr.push(v.unitInfo);
                            arr.push(v.cmCostGenerationTime);
                            arr.push(v.cmCostGenerationMode);
                            arr.push(v.cmCreatePer);
                            arr.push(v.cmCostGenerationType);
                            arr.push(renderer_func.renderBlank(v.cmSourceType));
                            arr.push(v.XSNO);
                            arr.push(renderer_func.renderBlank(v.cmSourceNo));
                            arr.push(v.cmBillingrules);
                            arr.push(v.cmBillingName);
                            arr.push(v.cmBillingUnit);
                            arr.push(v.code);
                            arr.push(v.remark);
                            arr.push(v.status);
                            arr.push(v.code2);
                            arr.push(v.commname);
                            arr.push(renderer_func.r_commGoodsType(v.commGoodsType, undefined, v));
                            arr.push(renderer_func.r_commcctj(v.commcctj, undefined, v));
                            arr.push(v.communit);
                            arr.push(renderer_func.r_commgg(v.commgg, undefined, v));
                            arr.push(v.commInfo);
                            arr.push(v.commVolume);
                            arr.push(v.RKSJ);
                            arr.push(v.CKSJ);
                            arr.push(v.ZKSJ);
                            arr.push(v.YWY);
                            arr.push(v.cmNumber);
                            arr.push(v.cmUnivalent);
                            arr.push(v.cmMoney);
                            arr.push(v.paVolume);
                            arr.push(v.volume);
                            arr.push(v.paPrice);
                            arr.push(renderer_func.render_percent(v.cmSettlementDiscount));
                            arr.push(v.cmActualAmount);
                            arr.push(v.cmBillMoney);
                            arr.push(v.cmSetName);
                            arr.push(v.cmSettlementTime);
                            arr.push(v.cmRemark);
                            arr.push(v.dept_dname);
                            ws_data.push(arr);
                        });
                        let ws = XLSX.utils.aoa_to_sheet(ws_data);

                        // 将工作表添加到工作簿
                        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                        let wbout = XLSX.write(wb, { bookType: 'xls', type: 'binary' });


                        // 创建Blob对象，并使用它创建一个URL
                        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                        const url = URL.createObjectURL(blob);

                        // 创建a标签并模拟点击以下载文件
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = "货主费用管理" + startDate + " - " + endDate + '.xls';
                        a.click();

                        // 清除URL对象
                        URL.revokeObjectURL(url);


                    }
                });
            });
        });
    }

    // 发货记录
    function deliverrecord() {
        $(function () {

            $(document).find("button:contains('显示全部(A)')").parent().parent().parent().parent().parent().parent().parent().append(`
                <td class="x-toolbar-cell" id="nmsl-ext-gen39">
                    <table id="nmsl-ext-comp-1003" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                        <tbody class="x-btn-small x-btn-icon-small-left">
                        <tr>
                            <td class="x-btn-tl">
                            <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-tc"></td>
                            <td class="x-btn-tr">
                            <i>&nbsp;</i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-ml">
                            <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-mc">
                            <em class=" x-unselectable" unselectable="on">
                                <button type="button" id="nmsl-ext-gen40" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">导出数据</button></em>
                            </td>
                            <td class="x-btn-mr">
                            <i>&nbsp;</i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-bl">
                            <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-bc"></td>
                            <td class="x-btn-br">
                            <i>&nbsp;</i>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </td>
            `);

            $(document).find('#nmsl-ext-gen40').click(function () {


                let today = new Date();
                let year = today.getFullYear();
                let month = String(today.getMonth() + 1).padStart(2, '0');
                let day = String(today.getDate()).padStart(2, '0');
                let formattedDate = `${year}-${month}-${day}`;


                let startDate = prompt("请输入开始时间（格式：YYYY-MM-DD）");
                if (!startDate) {
                    alert("未输入开始时间，导出取消");
                    return;
                }

                let endDate = prompt("请输结束时间（格式：YYYY-MM-DD）,不填则使用今天.");
                if (!endDate) {
                    endDate = formattedDate;
                }


                // 检查输入的日期格式是否正确
                let datePattern = /^\d{4}-\d{2}-\d{2}$/;
                if (!datePattern.test(startDate)) {
                    alert("开始日期格式不正确，请输入正确的日期格式（YYYY-MM-DD）");
                    return;
                }

                if (!datePattern.test(endDate)) {
                    alert("结束日期格式不正确，请输入正确的日期格式（YYYY-MM-DD）");
                    return;
                }

                var arr = [];
                $.each($(".x-grid3-hd"), function (k, v) {
                    arr.push($(v).text());
                });


                // 创建工作表数据

                $.ajax({
                    type: "POST",
                    url: "/" + url_prefix + "/gspreportforms/outstoragecheckquery!query.action",
                    data: {
                        "limit": 114514,
                        "propertyCriteria": "wnxFineSingleState.name:in:备货完工;复核,wnxConfirmTime:ge:" + startDate + " 00:00:00,wnxConfirmTime:le:" + endDate + " 23:59:59"
                    },
                    dataType: "json",
                    success: function (data) {
                        let wb = XLSX.utils.book_new();
                        let ws_data = [
                            [
                                "出库时间",
                                "购货单位",
                                "拣选人",
                                "商品货号(出厂)",
                                "商品名称",
                                "货主",
                                "规格/型号",
                                "商品基本单位",
                                "产地",
                                "生产批号/序列号",
                                "生产日期",
                                "有效期",
                                "出库复核数量",
                                "复核人",
                                "复核人2",
                                "订单总单标识",
                                "拣货总单标识号",
                                "备注",
                                "购货单位证件编号",
                                "购货单位证件有效期",
                                "生产企业/受托生产企业",
                                "生产许可证/备案凭证编号",
                                "生产企业证件有效期",
                                "注册证号/备案凭证编号",
                                "注册证号/备案凭证编号有效期",
                                "灭菌批号",
                                "灭菌日期",
                                "灭菌效期",
                                "批准文号/备案凭证编号",
                                "批准文号/备案凭证编号有效期",
                                "一次复核日期",
                                "一次复核数量",
                                "二次复核日期",
                                "二次复核数量",
                                "DI码",
                                "注册人/备案人/上市许可持有人",
                                "运输温度",
                                "复核质量状况",
                                "储存条件",
                                "收货地址",
                                "装箱人",
                                "udi码"
                            ],
                        ];
                        $.each(data.root, function (k, v) {
                            let arr = [];
                            arr.push(v.wnxConfirmTime);
                            arr.push(v.wnxCustomerName);
                            arr.push(v.wnxPickCandidate);
                            arr.push(v.codCode2);
                            arr.push(v.wnxCommName);
                            arr.push(v.wnxOocName);
                            arr.push(v.wnxCommercialSpecification);
                            arr.push(v.wnxBasicCommodityUnit);
                            arr.push(v.wnxpProducingArea);
                            arr.push(v.wnxBatch);
                            arr.push(v.wnxSCTime);
                            arr.push(v.wnxValidTill);
                            arr.push(v.wnxConfirmQuantity);
                            arr.push(v.wnxConfirmPerson);
                            arr.push(v.wnxCheckArtificial);
                            arr.push(v.wnxOrderSingleSign);
                            arr.push(v.wnxIdentifyTotalSingleSign);
                            arr.push(v.wnxOrderNote);
                            arr.push(v.unitlicenceTypeNo);
                            arr.push(PubFunc.render_date(v.unitlicenceTypeTime));
                            arr.push(v.wnxBrand);
                            arr.push(v.wnxProductionLicenseNo);
                            arr.push(PubFunc.render_date(v.licenceTypeTime));
                            arr.push(v.codRegistrationCertificateNo);
                            arr.push(PubFunc.render_date(v.codValidPeriodRegistration));
                            arr.push(v.batSterilizationBatch);
                            arr.push(PubFunc.render_date(v.batSterilizationDate));
                            arr.push(PubFunc.render_date(v.batSterilizationValid));
                            arr.push(v.codLicenseNumber);
                            arr.push(PubFunc.render_date(v.codLicenseNumTermValidity));
                            arr.push(v.firstDate);
                            arr.push(v.firstCheckNum);
                            arr.push(v.secondDate);
                            arr.push(v.secondCheckNum);
                            arr.push(v.wnxBarCode);
                            arr.push(v.comHolder);
                            arr.push(v.StorageSpecificTemperature);
                            // arr.push(v.FHZLZK);
                            arr.push("合格");
                            arr.push(v.codStorageCondition);
                            arr.push(v.unitStoreARS);
                            arr.push(v.packagePerson_perName);
                            arr.push(v.wnxUdis);
                            ws_data.push(arr);
                        });
                        let ws = XLSX.utils.aoa_to_sheet(ws_data);

                        // 将工作表添加到工作簿
                        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
                        let wbout = XLSX.write(wb, { bookType: 'xls', type: 'binary' });


                        // 创建Blob对象，并使用它创建一个URL
                        const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                        const url = URL.createObjectURL(blob);

                        // 创建a标签并模拟点击以下载文件
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = "发货记录" + startDate + " - " + endDate + '.xls';
                        a.click();

                        // 清除URL对象
                        URL.revokeObjectURL(url);
                        // alert("导出成功");
                        // window.open(data.info);
                    }
                })
            });
        });
    }



    let auto_login_timer = null;
    let auto_login_check = true;
    let auto_login_runing = 0;



    function autoLogin() {
        let username = localStorage.getItem("_nmsl_auto_login_username");
        let password = localStorage.getItem("_nmsl_auto_login_password");
        let paltform = localStorage.getItem("_nmsl_auto_login_sys_name");
        if (username == null || password == null || paltform == null) {
            return;
        }
        $.ajax({
            url: plugin_url + "/api/auto/login",
            data: {
                username: username,
                password: password,
                base_url: window.location.origin,
                base_prefix: url_prefix,
                paltform: paltform,

            },
            method: "post",
            success: function (data) {
                console.log(data);
                if (data.code != 200) {
                    alert(data.msg);
                    localStorage.setItem("_nmsl_auto_login", 0);
                    clearInterval(auto_login_timer);
                }

                $.each(data.data.cookie, function (k, v) {
                    GM_cookie.delete({ name: v.Name });
                    GM.cookie.set({
                        name: v.Name,
                        value: v.Value,
                        domain: v.Domain,
                        path: v.Path,
                        secure: v.Secure,
                        httpOnly: v.HttpOnly,
                    }, function (error) {
                        console.log(error || 'success');
                    });
                });
                auto_login_runing = 0;
                auto_login_check = true;
            },
            error: function (data) {
                alert("自动登录失败,功能自动停用");
                localStorage.setItem("_nmsl_auto_login", 0);
                clearInterval(auto_login_timer);

            }
        });


    }

    function autoLoginCheck() {

        if (auto_login_runing == 1) {
            return;
        }

        $.ajax({
            url: "/" + url_prefix + "/security/user!getUserInfoByUsername.action",
            method: "post",
            data: {
                username: username
            },

            success: function (data) {
                // console.log(data);
                if (data.success == "true") {
                    console.log("登录状态正常");
                    auto_login_check = true;
                    return;
                }
                auto_login_check = false;
                if (auto_login_runing == 0) {
                    auto_login_runing = 1;
                    autoLogin();
                }
            },
        });
    }

    function autoLoginSetting() {
        if (localStorage.getItem("_nmsl_auto_login") == 1) {
            auto_login_timer = setInterval(function () {
                autoLoginCheck();
            }, 5000);
        }

        $(document).find(".versionLog").closest('.x-toolbar-cell').before(`
            <td class="x-toolbar-cell" id="ext-gen23">
                <table id="nmsl-auto-login" cellspacing="0" class="x-btn x-btn-text-icon" style="width: auto;">
                    <tbody class="x-btn-small x-btn-icon-small-left">
                        <tr>
                            <td class="x-btn-tl">
                                <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-tc"></td>
                            <td class="x-btn-tr">
                                <i>&nbsp;</i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-ml">
                                <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-mc">
                                <em class=" x-unselectable" unselectable="on">
                                    <button type="button" id="ext-gen24" class="x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">自动登录设置</button></em>
                            </td>
                            <td class="x-btn-mr">
                                <i>&nbsp;</i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-bl">
                                <i>&nbsp;</i>
                            </td>
                            <td class="x-btn-bc"></td>
                            <td class="x-btn-br">
                                <i>&nbsp;</i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
            <td class="x-toolbar-cell" id="ext-gen17"><span class="xtb-sep" id="ext-gen18"></span></td>
        `);

        $(document).find("button:contains('退出系统')").click(function () {
            localStorage.setItem("_nmsl_auto_login", 0);
            clearInterval(auto_login_timer);
            return;
        });

        $(document).find("#nmsl-auto-login button").on({
            mouseover: function () {
                // console.log("鼠标移到查询货位信息上");
                // 鼠标移动到元素上时增加 x-btn-over 类
                $(this).closest('#nmsl-auto-login').addClass("x-btn-over");
            },
            mouseout: function () {
                // console.log("鼠标移开查询货位信息");
                // 鼠标移开时删除 x-btn-over 类
                $(this).closest('#nmsl-auto-login').removeClass("x-btn-over");
                $(this).closest('#nmsl-auto-login').removeClass("x-btn-click");

            },
            mousedown: function () {
                // console.log("鼠标按下查询货位信息");
                // 鼠标按下时增加 x-btn-click 类
                $(this).closest('#nmsl-auto-login').addClass("x-btn-click");
            },
            mouseup: function () {
                // console.log("鼠标松开查询货位信息");
                // 鼠标松开时删除 x-btn-click 类
                $(this).closest('#nmsl-auto-login').removeClass("x-btn-click");
            },
            click: function () {

                let username = localStorage.getItem("_nmsl_auto_login_username");
                let password = localStorage.getItem("_nmsl_auto_login_password");
                let paltform = localStorage.getItem("_nmsl_auto_login_sys_name");
                if (username == null || password == null || paltform == null) {
                    alert("登录信息不完整，请点击右上角退出登录然后重新登录后再设置.");
                    return;
                }

                if (!confirm("是否开启自动登录?")) {
                    localStorage.setItem("_nmsl_auto_login", 0);
                    clearInterval(auto_login_timer);
                    return;
                }
                // localStorage.setItem("_nmsl_auto_login", 0);
                // 输入账户名
                // let username = prompt("请输入账户名:");
                // if (username == null || username == "") {
                //     alert("未开启自动登录:取消了账户名输入");
                //     return;
                // }
                // localStorage.setItem("_nmsl_auto_login_username", username);

                // let password = prompt("请输入密码:");
                // if (password == null || password == "") {
                //     alert("未开启自动登录:取消了密码输入");
                //     return;
                // }
                // localStorage.setItem("_nmsl_auto_login_password", password);
                localStorage.setItem("_nmsl_auto_login", 1);
                clearInterval(auto_login_timer);
                auto_login_timer = setInterval(function () {
                    autoLoginCheck();
                }, 5000);


            }
        });
    }

    // 仓库作业调度
    function warehousejobscheduling() {
        $(document).find(".x-unselectable button:contains('装箱')").closest('.x-toolbar-cell').after(`
            <td class="x-toolbar-cell" id="nmsl-ext-gen293">
                <span class="xtb-sep" id="nmsl-ext-gen294">
                </span>
            </td>
            <td class="x-toolbar-cell" id="nmsl-ext-gen295">
                <table id="nmsl-ext-comp-1749" cellspacing="0" class="x-btn x-btn-text-icon"
                style="width: auto;">
                    <tbody class="x-btn-small x-btn-icon-small-left">
                        <tr>
                            <td class="x-btn-tl">
                                <i>
                                    &nbsp;
                                </i>
                            </td>
                            <td class="x-btn-tc">
                            </td>
                            <td class="x-btn-tr">
                                <i>
                                    &nbsp;
                                </i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-ml">
                                <i>
                                    &nbsp;
                                </i>
                            </td>
                            <td class="x-btn-mc">
                                <em class=" x-unselectable" unselectable="on">
                                    <button type="button" id="nmsl-ext-gen296" class=" x-btn-text" style="background-size: 16px;background-image: url(${random_img_url}) !important;">
                                        一键复核
                                    </button>
                                </em>
                            </td>
                            <td class="x-btn-mr">
                                <i>
                                    &nbsp;
                                </i>
                            </td>
                        </tr>
                        <tr>
                            <td class="x-btn-bl">
                                <i>
                                    &nbsp;
                                </i>
                            </td>
                            <td class="x-btn-bc">
                            </td>
                            <td class="x-btn-br">
                                <i>
                                    &nbsp;
                                </i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        `);

        $(document).on("click", "#nmsl-ext-gen296", function () {
            alert("不知是否有bug,暂时不开放使用.");
            return;
            let header_element = $(document).find("#scope").find(".x-panel-bwrap").find(".x-panel-body").find(".x-grid3-header");
            let order_sn_index = getRowNumber(header_element, "订单总单标识");
            if (order_sn_index == false) {
                alert("未找到订单总单标识字段");
                return;
            }

            let checked_row_elements = $(this).closest('.x-panel-bwrap').find(".x-grid3-body .x-grid3-row-selected");
            // console.log("选中数量:", checked_row_elements.length);

            if (checked_row_elements.length <= 0) {
                alert("请选择要记录的数据");
                return false;
            }

            $(document).find('#nmsl-ext-gen296').hide();

            let item_list = [];
            $.each(checked_row_elements, function (i, item) {
                let order_sn = $(item).find("tbody tr .x-grid3-td-" + order_sn_index).text().trim();
                item_list.push(order_sn);
            });
            item_list = [...new Set(item_list)];

            // console.log(item_list);

            $.ajax({
                url: plugin_url + "/api/wms/review",
                method: "POST",
                data: {
                    order_sn: item_list,
                },
                success: function (data) {
                    $(document).find('#nmsl-ext-gen296').show();
                    console.log(data);
                    if (data.code != 200) {
                        alert(data.msg);
                        return;
                    }

                    $.each(data.data.result_list, function (i, item) {
                        if (item.account1_result_status == false) {
                            alert(`总单号${i} 第一次复核失败:${item.account1_result.message}`);
                        }
                        if (item.account2_result_status == false) {
                            alert(`总单号${i} 第二次复核失败:${item.account2_result.message}`);
                        }
                    });

                    alert("复核完毕");
                },
                error: function (data) {
                    $(document).find('#nmsl-ext-gen296').show();
                    alert("接口请求失败.");

                }
            });


        });
    }

    // 入库验收
    function warehouseinspection() {
        $(document).find('span:contains(\'验收\')').closest("li").click(function () {


            console.log($(this).hasClass("x-tab-strip-active"));
            if ($(this).data("checked") == true) {
                return;
            }

            let timer = setInterval(function () {
                console.log("绑定事件");
                if ($(document).find("button:contains('确认验收(F)')").length > 0) {
                    clearInterval(timer);
                    $(document).find("button:contains('确认验收(F)')").click(function () {

                        let header_element = $(document).find(".x-grid3-hd-inner:contains('送货B')").closest('.x-panel-bwrap').find(".x-grid3-header");
                        console.log("表格长度:"+header_element.length);
                        let field_name_list = {
                            record_id: "编号",
                            // provider_name: "供应商", // 供应商
                            owner_id: "货主ID",
                            owner_name: "货主名称",
                            notify_number: "收货通知编号",
                            acceptance_no: "编号", // 入库验收编号
                            batch_no: "批号",
                            storage_condition: "储存条件",
                            // quantity: "基本单位数量", // 基本单位数量
                            item_number: "商品货号(出厂)",
                            item_name: "商品名称",
                            item_spec: "商品规格",
                            // item_sku: "SKU操作码", // SKU操作码
                            // item_sku_name: "SKU名称", // SKU名称
                            quantity_unit: "商品基本单位",
                            item_sku_mark: "SKU标识",
                            manufacturer: "生产厂家",
                        };
            
                        let td_index_list = {
                            record_id: getRowNumber(header_element, "编号"),
                            // provider_name: getRowNumber(header_element, "供应商"),
                            owner_id: getRowNumber(header_element, "货主ID"),
                            owner_name: getRowNumber(header_element, "货主名称"),
                            notify_number: getRowNumber(header_element, "收货通知编号"),
                            acceptance_no: getRowNumber(header_element, "编号"), // 入库验收编号
                            batch_no: getRowNumber(header_element, "批号"),
                            storage_condition: getRowNumber(header_element, "储存条件"),
                            // quantity: getRowNumber(header_element, "基本单位数量"),
                            item_number: getRowNumber(header_element, "商品货号(出厂)"),
                            item_name: getRowNumber(header_element, "商品名称"),
                            item_spec: getRowNumber(header_element, "商品规格"),
                            // item_sku: getRowNumber(header_element, "SKU操作码"),
                            // item_sku_name: getRowNumber(header_element, "SKU名称"),
                            quantity_unit: getRowNumber(header_element, "商品基本单位"),
                            item_sku_mark: getRowNumber(header_element, "SKU标识"),
                            manufacturer: getRowNumber(header_element, "生产厂家"),
                        };
            
                        console.log(td_index_list);

                        let have_err = false;
                        $.each(field_name_list, function (k, v) {
                            if (td_index_list[k] == false) {
                                alert("表格列不完整,请选择【" + v + "】列,然后刷新本页再操作");
                                have_err = true;
                                // return;
                            }
                        });
                        if (have_err) {
                            $(document).find('#nmsl-ext-gen41').show();
                            return false;
                        }
                        // console.table(td_index_list);
            
                        let checked_row_elements = $(document).find(".x-grid3-hd-inner:contains('送货B')").closest('.x-panel-bwrap').find(".x-grid3-body .x-grid3-row-selected");
                        console.log("选中数量:", checked_row_elements.length);
            
                        if (checked_row_elements.length <= 0) {
                            alert("请选择要记录的数据");
                            $(document).find('#nmsl-ext-gen41').show();
                            return false;
                        }
            
                        let item_list = [];
                        $.each(checked_row_elements, function (i, item) {
                            let arr = {};
                            $.each(field_name_list, function (k, v) {
                                arr[k] = $(item).find("tbody tr .x-grid3-td-" + td_index_list[k]).text().trim();
                            });
                            item_list.push(arr);
                        });

                        console.log(item_list);
                        // 弹出确认窗口
                        var isVirtual = confirm("是否为虚货？");
                        // if (isVirtual) {
                        //     alert("用户确认为虚货");
                        // } else {
                        //     alert("用户取消确认");
                        // }

                        $.ajax({
                            url: plugin_url + "/api/wms/virtual_bill/add/new",
                            type: "POST",
                            data: {
                                item_list: item_list,
                                operator_id: window.top.personId,
                                operator_name: window.top.realName,
                                method:isVirtual ? 'add' : 'del'
                            },
                            success: function (data) {
                                // console.log("Response:", data);
                                if (data.code !== 200) {
                                    alert(data.msg);
                                    $(document).find('#nmsl-ext-gen41').show();
                                    return;
                                }
                                // if(isVirtual){
                                //     $.each(checked_row_elements, function (k, v) {
                                //         let record_id = $(v).find("tbody tr .x-grid3-td-" + td_index_list['record_id']).text().trim();
                                //         if (data.data.duplicate_list.indexOf(record_id) !== -1) {
                                //             v.style.setProperty('background-color', '#ef1c00', 'important');
                                //             v.style.setProperty('background-image', 'none', 'important');
                                //             v.style.setProperty('border-color', '#c1481f', 'important');
                                //         }
                                //         // data.data.duplicate_list
                                //     });
                                //     alert(`标记结果,成功:${data.data.success_list.length}个,重复:${data.data.duplicate_list.length}个,重复已标红.`);
                                // }

                                $(document).find('#nmsl-ext-gen41').show();
            
                            },
                            error: function (xhr, status, error) {
                                console.error("Error:", error);
                                alert("请求失败:" + error);
                                $(document).find('#nmsl-ext-gen41').show();
                            }
                        });

                    });
                }
            }, 1000);

            // alert("验收");
        });
    }


    function login() {
        // showLonginWin('ERP')
        $(document).find('.reset li').click(function () {
            let func = $(this).attr("onclick");
            let sys_name = func.match(/[^()]+(?=\))/);
            sys_name = sys_name[0].replace(/'/g, '');
            localStorage.setItem("_nmsl_auto_login_sys_name", sys_name);
            console.log("系统名称:", sys_name);
        });
        $(document).on("click", "button:contains('登录')", function () {
            localStorage.setItem("_nmsl_auto_login_username", $(document).find('#j_username').val());
            localStorage.setItem("_nmsl_auto_login_password", $(document).find('#j_password').val());
        });

    }

    var page_url = window.location.href;


    if (window === window.top) {
        if (page_url.includes('platform/index.jsp')) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('同步')").length > 0) {
                    console.log(window.isErp);
                    clearInterval(timer);
                    autoLoginSetting();
                }
            }, 1000);

        }

        if (page_url.includes('login.jsp')) {
            let timer = setInterval(function () {
                if ($(document).find(".socials .maintitle:contains('登录')").length > 0) {
                    clearInterval(timer);
                    login();
                }
            }, 1000);
        }

    }

    if (window.top.isErp == false) {

        console.log("wms逻辑已加载");

        // 收获通知管理
        if (page_url.includes('platform/godown/receivingnotification_z.jsp')) {

            let timer = setInterval(function () {
                if ($(document).find("button:contains('修改细单')").length > 0) {
                    clearInterval(timer);
                    receivingnotificationz();
                }
            }, 1000);
        }

        // 出库复核查询
        if (page_url.includes('platform/gspreportforms/outstoragecheckquery.jsp')) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    outstoragecheckquery();
                }
            }, 1000);
        }

        // 入库上架确认
        if (page_url.includes('platform/godown/storageshelvesconfirm.jsp')) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    storageshelvesconfirm();
                }
            }, 1000);
        }

        // 批号管理
        if (page_url.includes('platform/base/commodityInfo/batch.jsp')) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('上传&浏览')").length > 0) {
                    clearInterval(timer);
                    batch();
                }
            }, 1000);
        }

        // 入库记录
        if (page_url.includes('platform/gspreportforms/warehousingrecord.jsp')) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    warehousingrecord();
                }
            }, 1000);
        }

        if (page_url.includes('platform/libraryservice/producersstock.jsp')) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    producersstock();
                }
            }, 1000);
        }

        if (page_url.includes('platform/gspreportforms/stockquery.jsp')) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    stockquery();
                }
            }, 1000);
        }

        // 成本管理
        if (page_url.includes("platform/costcenter/costmanagement.jsp")) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    costmanagement();
                }
            }, 1000);
        }

        if (page_url.includes("platform/base/commodityInfo/commodity.jsp")) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    commodity();
                }
            }, 1000);
        }

        // 发货记录
        if (page_url.includes("platform/gspreportforms/deliverrecord.jsp")) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    deliverrecord();
                }
            }, 1000);
        }


        if (page_url.includes("platform/outstorehouse/warehousejobscheduling.jsp")) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('散件打印查询')").length > 0) {
                    clearInterval(timer);
                    warehousejobscheduling();
                }
            }, 1000);
        }

        if (page_url.includes("platform/godown/warehouseinspection.jsp")) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    warehouseinspection();
                }
            }, 1000);
        }

    }


    if (window.top.isErp == true) {
        console.log("erp逻辑已加载");
        if (page_url.includes("platform/market/salesoutlibrary.jsp")) {
            let timer = setInterval(function () {
                if ($(document).find("button:contains('显示全部(A)')").length > 0) {
                    clearInterval(timer);
                    salesoutlibrary();
                }
            }, 1000);
        }
    }


})();