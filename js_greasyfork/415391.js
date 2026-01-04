// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://greasyfork.org/zh-CN/script_versions
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415391/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/415391/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var objj = {};
var download = '0';
var item_num = 0;
var double_firstitem = 0;
objj.site_type_fj = function () {
    var url = location.href;
    if (
        url.indexOf("://loan.fengwd.com/loan") > 0
    ) {
        return "projectDetailsPage";
    }
    else if (
        url.indexOf("//my.fengwd.com/account/record/fy") > 0
    ) {
        return "fy_record";
    }
    else if (
        url.indexOf("//my.fengwd.com/account/record") > 0
    ) {
        return "initialPage";
    }
    else if (
        url.indexOf("//my.fengwd.com/account/wd/investdetail") > 0
    ) {
        return "investdetail";
    }
    else if (
        url.indexOf("//loan.fengwd.com/zqdetail") > 0
    ) {
        return "zqdetail";
    }
    else if (
        url.indexOf("//loan.fengwd.com/reserve/detail") > 0
    ) {
        return "reserve_detail";
    }
    else if (
        url.indexOf("//my.fengwd.com/account/wd/group") > 0
    ) {
        return "wd_group_fy";
    }

}

objj.openBondDetails = function () {
    $2('[data-flag="zqdetail"]').click()
}

objj.clickOnTheCreditorsRightsDetails = function () {
    //获得债权明细总页数
    var total_page = $2(".page-bar").find(".next").eq(0).prev().html();
    for (let index = 0; index < total_page; index++) {


    }
}


objj.add_btn = function () {
    setInterval(function () {

        if ($2(".tit.clearfix").eq(1).find("li").eq(0).attr("class") == "active") {
            var length = $2("#loanRequest").find("tbody").find("tr").find(".fcjh-outbtn").length;
            for (let index = 0; index < length; index++) {
                var $this = $2("#loanRequest").find("tbody").find("tr").find(".fcjh-outbtn").eq(index);
                var $this2 = $2("#loanRequest").find("tbody").find("tr").find(".tb-tit-td").eq(index);
                if ($this.next().hasClass("add_btn") && $this2.find("a").next().hasClass("add_btn")) {
                    return;
                } else {
                    $this.after('<span  class="split add_btn" style="cursor:pointer;color:blue">开始采集</span>');
                    $this2.find("a").after('<span class="original add_btn" style="cursor:pointer;color:blue">采</span>');
                }
            }
        }
        if ($2(".tit.clearfix").eq(1).find("li").eq(1).attr("class") == "active") {
            var length = $2("#loanRequest").find("tbody").find("tr").find(".tb-tit-td").length;
            for (let index = 0; index < length; index++) {
                var $this = $2("#loanRequest").find("tbody").find("tr").find(".tb-tit-td").eq(index);
                if ($this.next().next().next().next().next().find("a").next().hasClass("add_btn") && $this.find("a").next().hasClass("add_btn")) {
                    return;
                } else {
                    $this.next().next().next().next().next().find("a").after('<span class="split add_btn" style="cursor:pointer;color:blue">开始采集</span>');
                    $this.find("a").after('<span class="original add_btn" style="cursor:pointer;color:blue">采</span>');
                }
            }
        }

    }, 500);


    $2(".add_btn").live("click", function () {
        download = '0';
        var $this = $2(this);
        var class_type = $this.attr("class");
        console.log(class_type);
        if ($2(".tit.clearfix").eq(1).find("li").eq(0).attr("class") == "active") {
            var tmp0 = $this.parent().parent().find("td").eq(0).find("a").html();
            var tmp1 = $this.parent().parent().find("td").eq(0).find("span").html();
            var tmp2 = $this.parent().parent().find("td").eq(1).html();
            var tmp3 = $this.parent().parent().find("td").eq(2).html();
            var tmp4 = $this.parent().parent().find("td").eq(3).html();
            var tmp5 = $this.parent().parent().find("td").eq(4).html();
            var tmp6 = $this.parent().parent().find("td").eq(5).html();
            var tmp7 = $this.parent().parent().find("td").eq(6).html();
        }

        if ($2(".tit.clearfix").eq(1).find("li").eq(1).attr("class") == "active") {
            var tmp0 = $this.parent().parent().find("td").eq(0).find("a").html();
            var tmp1 = $this.parent().parent().find("td").eq(0).find("span").html();
            var tmp2 = $this.parent().parent().find("td").eq(1).html();
            var tmp3 = "--";
            var tmp4 = "--";
            var tmp5 = $this.parent().parent().find("td").eq(2).html();
            var tmp6 = $this.parent().parent().find("td").eq(3).html();
            var tmp7 = $this.parent().parent().find("td").eq(4).html();
        }
        var array_sheet;
        if (class_type == "split add_btn") {
            array_sheet = [['投资产品', '投资日期', '投资金额', '持有资产', '待收收益', '年利率', '期限', '状态',
                '购买成功', '开始计息', '还款周期', '产品结清', '拆分产品', '拆分金额', '拆分时间', '拆分后状态', '协议年化利率', '剩余期限', '后台编号',
                '散标代码', '产品总期限', '认购规模', '产品起息日', '产品到期日', '借款人姓名', '身份证', '婚姻状况', '年龄', '学历', '手机号码', '性别', '月收入',
                '公司行业', '工作城市', '岗位', '工作年限', '累计借款次数', '平台逾期次数', '征信情况', '累计借款金额', '平台逾期金额', '当前贷款余额', '负债信息', '还款来源']];
        } else {
            array_sheet = [['投资产品', '投资日期', '投资金额', '持有资产', '待收收益', '年利率', '期限', '状态',
                '开放购买日期', '产品起息日期', '锁定期满', '收回本息', '拆分产品', '拆分金额', '拆分时间', '拆分后状态', '协议年化利率', '剩余期限', '后台编号',
                '散标代码', '产品总期限', '认购规模', '产品起息日', '产品到期日', '借款人姓名', '身份证', '婚姻状况', '年龄', '学历', '手机号码', '性别', '月收入',
                '公司行业', '工作城市', '岗位', '工作年限', '累计借款次数', '平台逾期次数', '征信情况', '累计借款金额', '平台逾期金额', '当前贷款余额', '负债信息', '还款来源']];
        }
        array_sheet[1] = [tmp0, tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7];
        GM_setValue('data_array', array_sheet);

        // var aaa = GM_getValue('data_array');
        // var sheet = XLSX.utils.aoa_to_sheet(aaa);
        // openDownloadDialog(sheet2blob(sheet), '导出.xlsx');

        GM_setValue('step', 'collecting');
        // console.log(GM_getValue('step'));

        if (class_type == "split add_btn") {
            if ($2(".tit.clearfix").eq(1).find("li").eq(0).attr("class") == "active") {
                $this.prev().prev()[0].click();
            }
            if ($2(".tit.clearfix").eq(1).find("li").eq(1).attr("class") == "active") {
                $this.prev()[0].click();
            }
        }
        else {
            $this.prev()[0].click();
        }
    });
}
objj.exportExcel_listen = function () {
    var ls = setInterval(function () {
        var step = GM_getValue('step');
        console.log(step);
        if (step == "finish") {
            if (download == '1') {
                return;
            } else {
                var data_array = GM_getValue('data_array');
                var sheet = XLSX.utils.aoa_to_sheet(data_array);
                openDownloadDialog(sheet2blob(sheet), data_array[1][0] + '.xlsx');
                location.reload();//刷新本页，避免点击查看又进入到采集
                console.log(data_array);
                download = '1';
            }
            // clearInterval(ls);
        }
    }, 2000);
}
objj.add_btn_fy = function () {
    setInterval(function () {
        //持有中active
        if ($2(".tit.clearfix").eq(1).find("li").eq(0).attr("class") == "active") {
            var length = $2("#loanRequest").find("tbody").find("tr").find(".tb-tit-td").length;
            for (let index = 0; index < length; index++) {
                var $this = $2("#loanRequest").find("tbody").find("tr").find(".tb-tit-td").eq(index);
                if ($this.next().next().next().next().next().next().next().find("a").next().hasClass("add_btn") && $this.find("a").next().hasClass("add_btn")) {
                    return;
                } else {
                    $this.next().next().next().next().next().next().next().find("a").after('<span class="split add_btn" style="cursor:pointer;color:blue">开始采集</span>');
                    $this.find("a").after('<span class="original add_btn" style="cursor:pointer;color:blue"></span>');
                }
            }

        }
        //已结束active
        if ($2(".tit.clearfix").eq(1).find("li").eq(1).attr("class") == "active") {
            var length = $2("#loanRequest").find("tbody").find("tr").find(".tb-tit-td").length;
            for (let index = 0; index < length; index++) {
                var $this = $2("#loanRequest").find("tbody").find("tr").find(".tb-tit-td").eq(index);
                if ($this.next().next().next().next().next().find("a").next().hasClass("add_btn") && $this.find("a").next().hasClass("add_btn")) {
                    return;
                } else {
                    $this.next().next().next().next().next().find("a").after('<span class="split add_btn" style="cursor:pointer;color:blue">开始采集</span>');
                    // $this.find("a").after('<span class="original add_btn" style="cursor:pointer;color:blue"></span>');
                }
            }
        }

    }, 500);


    $2(".add_btn").live("click", function () {
        download = '0';
        var $this = $2(this);
        var class_type = $this.attr("class");
        console.log(class_type);
        if ($2(".tit.clearfix").eq(1).find("li").eq(0).attr("class") == "active") {
            var tmp0 = $this.parent().parent().find("td").eq(0).find("a").html();
            var tmp1 = $this.parent().parent().find("td").eq(0).find("span").html();
            var tmp2 = $this.parent().parent().find("td").eq(1).html();
            var tmp3 = $this.parent().parent().find("td").eq(2).html();
            var tmp4 = $this.parent().parent().find("td").eq(3).html();
            var tmp5 = $this.parent().parent().find("td").eq(4).html();
            var tmp6 = $this.parent().parent().find("td").eq(5).html();
            var tmp7 = $this.parent().parent().find("td").eq(6).html();
        }

        if ($2(".tit.clearfix").eq(1).find("li").eq(1).attr("class") == "active") {
            var tmp0 = $this.parent().parent().find("td").eq(0).find("a").html();
            var tmp1 = $this.parent().parent().find("td").eq(0).find("span").html();
            var tmp2 = $this.parent().parent().find("td").eq(1).html();
            var tmp3 = "--";
            var tmp4 = "--";
            var tmp5 = $this.parent().parent().find("td").eq(2).html();
            var tmp6 = $this.parent().parent().find("td").eq(3).html();
            var tmp7 = $this.parent().parent().find("td").eq(4).html();
        }
        var array_sheet;
        if (class_type == "split add_btn") {
            array_sheet = [['投资产品', '投资日期', '投资金额', '持有资产', '待收收益', '协议年利率', '期限', '状态',
                '散标名称', '投资金额', '已到收益', '还款进度', '状态', '购买成功', '开始计息', '产品结清', '协议年化利率', '剩余期限', '后台编号',
                '散标代码', '产品总期限', '认购规模', '产品起息日', '产品到期日', '借款人姓名', '身份证', '婚姻状况', '年龄', '学历', '手机号码', '性别', '月收入',
                '公司行业', '工作城市', '岗位', '工作年限', '累计借款次数', '平台逾期次数', '征信情况', '累计借款金额', '平台逾期金额', '当前贷款余额', '负债信息', '还款来源']];
        } else {
            array_sheet = [['投资产品', '投资日期', '投资金额', '持有资产', '待收收益', '年利率', '期限', '状态',
                '开放购买日期', '产品起息日期', '锁定期满', '收回本息', '拆分产品', '拆分金额', '拆分时间', '拆分后状态', '协议年化利率', '剩余期限', '后台编号',
                '散标代码', '产品总期限', '认购规模', '产品起息日', '产品到期日', '借款人姓名', '身份证', '婚姻状况', '年龄', '学历', '手机号码', '性别', '月收入',
                '公司行业', '工作城市', '岗位', '工作年限', '累计借款次数', '平台逾期次数', '征信情况', '累计借款金额', '平台逾期金额', '当前贷款余额', '负债信息', '还款来源']];
        }
        array_sheet[1] = [tmp0, tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7];
        GM_setValue('data_array', array_sheet);

        GM_setValue('step', 'collecting');

        if (class_type == "split add_btn") {
            if ($2(".tit.clearfix").eq(1).find("li").eq(0).attr("class") == "active") {
                $this.prev()[0].click();
            }
            if ($2(".tit.clearfix").eq(1).find("li").eq(1).attr("class") == "active") {
                $this.prev()[0].click();
            }
        }
        else {
            $this.prev()[0].click();
        }
    });
}
objj.collectInformation = function () {

    var data_array = GM_getValue('data_array');
    var length = data_array.length;
    if (objj.site_type_fj() == "initialPage") {

    } else if (objj.site_type_fj() == "wd_group_fy") {

        // console.log(data_array);
        // if (GM_getValue('recode_type') == '') {
        //     if (length > 0) {
        //         var tmp0 = $2(".state-list").find(".detail").eq(0).find("span").eq(1).html();
        //         var tmp1 = $2(".state-list").find(".detail").eq(1).find("span").eq(1).html();
        //         var tmp2 = $2(".state-list").find(".detail").eq(2).find("span").eq(1).html();
        //         var tmp3 = $2(".state-list").find(".detail").eq(3).find("span").eq(1).html();
        //         data_array[length - 1] = data_array[length - 1].concat([tmp0, tmp1, tmp2, tmp3]);
        //         GM_setValue('data_array', data_array);
        //         console.log(GM_getValue('data_array'));
        //     }
        // } 

        // if(GM_getValue('recode_type') == 'fy'){

        // }
    } else if (objj.site_type_fj() == "investdetail") {

        console.log(data_array);
        if (GM_getValue('recode_type') == '') {
            if (length > 0) {
                var tmp0 = $2(".state-list").find(".detail").eq(0).find("span").eq(1).html();
                var tmp1 = $2(".state-list").find(".detail").eq(1).find("span").eq(1).html();
                var tmp2 = $2(".state-list").find(".detail").eq(2).find("span").eq(1).html();
                var tmp3 = $2(".state-list").find(".detail").eq(3).find("span").eq(1).html();
                data_array[length - 1] = data_array[length - 1].concat([tmp0, tmp1, tmp2, tmp3]);
                GM_setValue('data_array', data_array);
                console.log(GM_getValue('data_array'));
            }
        }

        if (GM_getValue('recode_type') == 'fy') {

        }
    } else if (objj.site_type_fj() == "reserve_detail") {
        if (length > 0) {
            var tmp0 = $2(".animated.val.now").html();
            var tmp1 = $2(".animated.val.settled").html();
            var tmp2 = $2(".animated.val.lock").html();
            var tmp3 = $2(".animated.val.due").html();
            data_array[length - 1] = data_array[length - 1].concat([tmp0, tmp1, tmp2, tmp3]);
            GM_setValue('data_array', data_array);
            console.log(GM_getValue('data_array'));
        }
    } else if (objj.site_type_fj() == "zqdetail") {
        if (length > 0) {
            var tmp0 = $2(".content").find("tbody").find("td").eq(1).find("span").eq(0).html() + $2(".content").find("tbody").find("td").eq(1).find("span").eq(1).html();
            var tmp1 = $2(".content").find("tbody").find("td").eq(2).find("span").eq(0).html() + $2(".content").find("tbody").find("td").eq(2).find("span").eq(1).html();
            // var bg_no = $2(".zqdetail-wrapper").find(".panel").find(".title").find("a").attr('href').toString().replace('https://loan.fengwd.com/loan/', '');
            data_array[length - 1] = data_array[length - 1].concat([tmp0, tmp1]);
            GM_setValue('data_array', data_array);
            console.log(GM_getValue('data_array'));
        }
    }
    else if (objj.site_type_fj() == "projectDetailsPage") {
        if (length > 0) {
            var bg_no = location.href.split("/loan/")[1];
            var annualAgreement = $2(".column.fst").find("span").eq(0).text() + $2(".column.fst").find("span").eq(1).text();
            var zqx = $2(".loan-info").find(".flt-cont.clearfix").find("div").eq(1).find("span.val").html() + $2(".loan-info").find(".flt-cont.clearfix").find("div").eq(1).find("span.unit").html();
            var loan_sum = $2(".tabpanel").find("tbody").eq(0).find("tr").eq(6).find(".col2").html();
            var loname = $2(".loname").html();
            var date_begin = $2(".tabpanel").find("tbody").eq(0).find("tr").eq(3).find(".col2").html();
            var date_end = $2(".tabpanel").find("tbody").eq(0).find("tr").eq(4).find(".col2").html();
            var tmp0 = $2(".infolist.clearfix").eq(0).find(".flo.inle").find("p").eq(0).text().replace('借款人姓名', '');
            var tmp1 = $2(".infolist.clearfix").eq(0).find(".flo.inle").find("p").eq(1).text().replace('身份证号码', '');
            var tmp2 = $2(".infolist.clearfix").eq(0).find(".flo.inle").find("p").eq(2).text().replace('婚姻状况', '');

            var tmp3 = $2(".infolist.clearfix").eq(0).find(".flo.inmi").find("p").eq(0).text().replace('年龄', '');
            var tmp4 = $2(".infolist.clearfix").eq(0).find(".flo.inmi").find("p").eq(1).text().replace('学历', '');

            var tmp5 = $2(".infolist.clearfix").eq(0).find(".flo.inri").find("p").eq(0).text().replace('手机号码', '');
            var tmp6 = $2(".infolist.clearfix").eq(0).find(".flo.inri").find("p").eq(1).text().replace('性别', '');


            var tmp7 = $2(".infolist.clearfix").eq(1).find(".flo.inle").find("p").eq(0).text().replace('个人月收入', '');
            var tmp8 = $2(".infolist.clearfix").eq(1).find(".flo.inle").find("p").eq(1).text().replace('公司行业', '');

            var tmp9 = $2(".infolist.clearfix").eq(1).find(".flo.inmi").find("p").eq(0).text().replace('工作城市', '');
            var tmp10 = $2(".infolist.clearfix").eq(1).find(".flo.inmi").find("p").eq(1).text().replace('岗位/职务', '');

            var tmp11 = $2(".infolist.clearfix").eq(1).find(".flo.inri").find("p").eq(0).text().replace('工作年限', '');


            var tmp12 = $2(".infolist.clearfix").eq(3).find(".flo.inle").find("p").eq(0).text().replace('累计借款次数', '');
            var tmp13 = $2(".infolist.clearfix").eq(3).find(".flo.inle").find("p").eq(1).text().replace('平台逾期次数', '');
            var tmp14 = $2(".infolist.clearfix").eq(3).find(".flo.inle").find("p").eq(2).text().replace('借款前6个月内征信报告中的逾期情况', '');

            var tmp15 = $2(".infolist.clearfix").eq(3).find(".flo.inmi").find("p").eq(0).text().replace('累计借款金额', '');
            var tmp16 = $2(".infolist.clearfix").eq(3).find(".flo.inmi").find("p").eq(1).text().replace('平台逾期金额', '');

            var tmp17 = $2(".infolist.clearfix").eq(3).find(".flo.inri").find("p").eq(0).text().replace('当前贷款余额', '');
            var tmp18 = $2(".infolist.clearfix").eq(3).find(".flo.inri").find("p").eq(1).text().replace('负债信息', '');
            var source_of_repayment = $2(".info-other").find("p").eq(2).text();


            console.log("projectDetailsPage");
            console.log(data_array);
            var befor_length = 18;
            var current_length = data_array[length - 1].length;

            //不等于18，补齐18，保证后面的数据对齐，这个数值befor_length随前面采集的数据个数改变，如果上个页面多采集了，记得这里要改。
            if (data_array[length - 1].length != befor_length) {
                for (let index = 0; index < befor_length - current_length; index++) {
                    data_array[length - 1] = data_array[length - 1].concat('--');
                }
            }

            if (data_array[length - 1][16] == "--") {
                data_array[length - 1][16] = annualAgreement;
            }
            data_array[length - 1] = data_array[length - 1].concat([bg_no, loname, zqx, loan_sum, date_begin, date_end, tmp0, tmp1, tmp2, tmp3, tmp4, tmp5, tmp6, tmp7, tmp8, tmp9, tmp10, tmp11, tmp12, tmp13, tmp14, tmp15, tmp16, tmp17, tmp18, source_of_repayment]);
            GM_setValue('data_array', data_array);
            console.log(GM_getValue('data_array'));
        }
    }
}

objj.traverseClaims = function () {
    if (objj.site_type_fj() == "investdetail") {
        setInterval(function () {
            var single_recode = GM_getValue('single_recode');
            var total_page_length = $2(".ret-detail.zqdetail").find("tbody").find("a").length;
            console.log(total_page_length);
            console.log(item_num);
            console.log(single_recode);
            if (total_page_length == 0) {
                return;
            }
            else if (single_recode == 'finish' || single_recode == '') {
                if (total_page_length == item_num) {
                    //判断有无next，有则点击
                    if ($2(".btn-page.next").length > 0) {
                        $2(".btn-page.next").click();
                        double_firstitem = 1;
                        item_num = 0;
                    } else {
                        GM_setValue('step', 'finish');
                        objj.close();
                    }
                }
                else {
                    //记录标信息

                    var data_array = GM_getValue('data_array');
                    var length = data_array.length;

                    if (length > 0) {
                        var tmp0 = $2(".ret-detail.zqdetail").find("tbody").find("tr").eq(item_num).find("td").eq(0).find("a").html();
                        var tmp1 = $2(".ret-detail.zqdetail").find("tbody").find("tr").eq(item_num).find("td").eq(1).html();
                        var tmp2 = $2(".ret-detail.zqdetail").find("tbody").find("tr").eq(item_num).find("td").eq(2).html();
                        var tmp3 = $2(".ret-detail.zqdetail").find("tbody").find("tr").eq(item_num).find("td").eq(3).html();
                        if (item_num == 0 && double_firstitem == 2) {
                            data_array[length - 1] = ['', '', '', '', '', '', '', '', '', '', '', '', tmp0, tmp1, tmp2, tmp3];
                            double_firstitem = 0;
                        }
                        else {
                            data_array[length] = ['', '', '', '', '', '', '', '', '', '', '', '', tmp0, tmp1, tmp2, tmp3];
                        }

                        GM_setValue('data_array', data_array);
                        console.log(GM_getValue('data_array'));
                    }
                    //打开标
                    GM_setValue('single_recode', 'recoding');
                    $2(".ret-detail.zqdetail").find("tbody").find("tr").eq(item_num).find("a")[0].click();
                    // item_num == 0, need to do this 1 more time (because page ready is delay 1 time)
                    if (item_num == 0 && double_firstitem == 1) {
                        //item_num = item_num;
                        double_firstitem = 2;
                    }
                    else {
                        item_num = item_num + 1;
                    }
                }
            }
        }, 500);
    }

    if (objj.site_type_fj() == "reserve_detail") {
        setInterval(function () {
            var single_recode = GM_getValue('single_recode');
            var total_page_length = $2(".zq-list.clearfix").find("tbody").find("a").length;
            console.log(total_page_length);
            console.log(item_num);
            console.log(single_recode);
            if (total_page_length == 0) {
                return;
            }
            else if (single_recode == 'finish' || single_recode == '') {
                if (total_page_length == item_num) {
                    //判断有无next，有则点击
                    if ($2(".btn-page.next").length > 0) {
                        $2(".btn-page.next").click();
                        double_firstitem = 1;
                        item_num = 0;
                    } else {
                        GM_setValue('step', 'finish');
                        objj.close();
                    }
                }
                else {
                    //记录标信息

                    var data_array = GM_getValue('data_array');
                    var length = data_array.length;

                    if (length > 0) {
                        var tmp0 = $2(".zq-list.clearfix").find("tbody").find("tr").eq(item_num).find("td").eq(0).html();
                        var tmp1 = $2(".zq-list.clearfix").find("tbody").find("tr").eq(item_num).find("td").eq(1).html();
                        var tmp2 = $2(".zq-list.clearfix").find("tbody").find("tr").eq(item_num).find("td").eq(2).html();
                        // var tmp3 = $2(".zq-list.clearfix").find("tbody").find("tr").eq(item_num).find("td").eq(3).html();
                        if (item_num == 0 && double_firstitem == 2) {
                            data_array[length - 1] = ['', '', '', '', '', '', '', '', '', '', '', '', tmp0, tmp1, tmp2, ''];
                            double_firstitem = 0;
                        }
                        else {
                            data_array[length] = ['', '', '', '', '', '', '', '', '', '', '', '', tmp0, tmp1, tmp2, ''];
                        }

                        GM_setValue('data_array', data_array);
                        console.log(GM_getValue('data_array'));
                    }
                    //打开标
                    GM_setValue('single_recode', 'recoding');
                    $2(".zq-list.clearfix").find("tbody").find("tr").eq(item_num).find("a")[0].click();
                    // item_num == 0, need to do this 1 more time (because page ready is delay 1 time)
                    if (item_num == 0 && double_firstitem == 1) {
                        //item_num = item_num;
                        double_firstitem = 2;
                    }
                    else {
                        item_num = item_num + 1;
                    }
                }
            }
        }, 500);
    }
}
objj.traverseClaims_fy = function () {
    // alert("traverseClaims_fy");
    if (objj.site_type_fj() == "wd_group_fy") {
        setInterval(function () {
            var single_recode = GM_getValue('single_recode');
            var total_page_length = $2(".normal-link").length;
            // alert(total_page_length);
            console.log(item_num);
            console.log(single_recode);
            if (total_page_length == 0) {
                return;
            }
            else if (single_recode == 'finish' || single_recode == '') {
                if (total_page_length == item_num) {
                    //判断有无next，有则点击
                    if ($2(".btn-page.next").length > 0) {
                        $2(".btn-page.next").click();
                        double_firstitem = 1;
                        item_num = 0;
                    } else {
                        GM_setValue('step', 'finish');
                        objj.close();
                    }
                }
                else {
                    //记录标信息

                    var data_array = GM_getValue('data_array');
                    var length = data_array.length;

                    if (length > 0) {
                        var tmp0 = $2(".list.tablecon1").find("tbody").find("tr").eq(item_num).find("td").eq(0).find("a").html();
                        var tmp1 = $2(".list.tablecon1").find("tbody").find("tr").eq(item_num).find("td").eq(1).html();
                        var tmp2 = $2(".list.tablecon1").find("tbody").find("tr").eq(item_num).find("td").eq(2).html();
                        var tmp3 = $2(".list.tablecon1").find("tbody").find("tr").eq(item_num).find("td").eq(3).html();
                        var tmp4 = $2(".list.tablecon1").find("tbody").find("tr").eq(item_num).find("td").eq(4).html();

                        if (item_num == 0 && double_firstitem == 2) {
                            data_array[length - 1] = ['', '', '', '', '', '', '', '', tmp0, tmp1, tmp2, tmp3, tmp4];
                            double_firstitem = 0;
                        }
                        else {
                            data_array[length] = ['', '', '', '', '', '', '', '', tmp0, tmp1, tmp2, tmp3, tmp4];
                        }

                        GM_setValue('data_array', data_array);
                        console.log(GM_getValue('data_array'));
                    }
                    //打开标
                    GM_setValue('single_recode', 'recoding');
                    window.open($2(".list.tablecon1").find("tbody").find("tr").eq(item_num).find("a").eq(1).attr("href"));
                    if (item_num == 0 && double_firstitem == 1) {
                        //item_num = item_num;
                        double_firstitem = 2;
                    }
                    else {
                        item_num = item_num + 1;
                    }
                }
            }
        }, 500);
    }
}

objj.close = function () {
    window.close();
}

function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}



$2(document).ready(function () {

    if (objj.site_type_fj() == "initialPage") {

        GM_setValue('recode_type', '');
        GM_setValue('step', '');
        GM_setValue('data_array', '');

        objj.add_btn();
        objj.exportExcel_listen();

    } else if (objj.site_type_fj() == "investdetail") {
        if (GM_getValue('step') == '') {
            return;
        }
        if (GM_getValue('recode_type') == '') {
            //采集信息
            objj.collectInformation();
            //点击债权明细
            $2('[data-type="detaillist"]').click();
            //遍历每一个债权
            GM_setValue('single_recode', '');
            objj.traverseClaims();
        }

        if (GM_getValue('recode_type') == 'fy') {
            //采集信息
            objj.collectInformation();
            //点击散标名称
            $2(".link")[0].click();

            //关闭自身
            objj.close();
        }
    } else if (objj.site_type_fj() == "reserve_detail") {
        if (GM_getValue('step') == '') {
            return;
        }
        //采集信息
        objj.collectInformation();
        //点击债权明细
        $2('[data-flag="zqdetail"]').click();
        //遍历每一个债权
        GM_setValue('single_recode', '');
        objj.traverseClaims();
    } else if (objj.site_type_fj() == "zqdetail") {
        if (GM_getValue('step') == '') {
            return;
        }
        //采集信息
        objj.collectInformation();
        //点击原产品详情
        $2(".col-light").next()[0].click();
        //关闭自身
        objj.close();
    } else if (objj.site_type_fj() == "projectDetailsPage") {
        if (GM_getValue('step') == '') {
            return;
        }
        //点击借款方信息
        $2('[data-flag="invest"]').prev().click();
        //采集信息
        objj.collectInformation();
        //关闭自身
        GM_setValue('single_recode', 'finish');
        objj.close();
    } else if (objj.site_type_fj() == "fy_record") {
        GM_setValue('step', '');
        GM_setValue('data_array', '');
        objj.add_btn_fy();
        objj.exportExcel_listen();

    } else if (objj.site_type_fj() == "wd_group_fy") {
        if (GM_getValue('step') == '') {
            return;
        }
        //采集信息
        objj.collectInformation();
        GM_setValue('recode_type', 'fy');
        GM_setValue('single_recode', '');
        //遍历每一个散标
        objj.traverseClaims_fy();
    }
});
})();