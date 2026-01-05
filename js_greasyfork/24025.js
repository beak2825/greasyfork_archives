// ==UserScript==
// @name         智联职位助手
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  屏蔽智联招聘列表中无用的公司与职位.可选择屏蔽该职位或者该公司.
// @author       L.Rain
// @match        http://sou.zhaopin.com/jobs/searchresult.ashx*
// @match        http://www.zhaopin.com/
// @match        http://jobs.zhaopin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24025/%E6%99%BA%E8%81%94%E8%81%8C%E4%BD%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/24025/%E6%99%BA%E8%81%94%E8%81%8C%E4%BD%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


//table页添加btn
if (/sou\.zhaopin\.com/.test(location.href)) {
    //添加列表页删除按钮
    $('.newlist_list_xlbtn').map(function (x, y) {
        $(y).after("<br> <button style='margin-bottom:9px;margin-left:5px;width:15px' onclick='return false'>X</button> <button name='ALL' style='margin-bottom:9px;margin-left:5px;width:25px' onclick='return false'>ALL<button>");
    });
    var table = $('tbody tr:first-child');
    var list = localStorage.list ? JSON.parse(localStorage.list) : {};


    //添加btn事件委托
    eventbtn();

    //替代原生排除公司btn
    pcbtn();

    //初始化
    removegsmc();

} else if (/jobs\.zhaopin\.com/.test(location.href)) {
    //detail页面添加btn
    //$('#applyVacButton2').after("<button class='close' style='margin: 20px 0 0 0;height:40px;width:35px'>X</button>");
    //$(document).delegate('button','click',function(){
    //   if($(this).hasClass('.close'))window.close();
    //});
} else {
    $('#globalHeader,#footer,#wrapper,#adFilter').hide();
}

//隐藏职位与公司
function removegsmc() {
    for (var i in list) {
        table.map(function (x, y) {
            if ($(y).children('.gsmc').text() == i) {
                if (list[i][0] == ['ALL'] || list[i].includes($(y).children('.zwmc').text().trim())) {
                    $(y).closest('table').remove();
                }
            }
        });
    }
}
//添加btn事件委托
function eventbtn() {
    table.delegate('button', 'click', function (e) {
        //屏蔽所有该公司招聘
        var gsmc = $(this).parent().siblings('.gsmc').text().trim();
        var htr = $(this).closest('tr');
        if (e.target.name == 'ALL') {
            list[gsmc] = ['ALL'];
        } else {
            var zwmc = $(this).parent().siblings('.zwmc').find('a').text().trim();
            if (list[gsmc]) {
                list[gsmc].push(zwmc);
            } else {
                list[gsmc] = [zwmc];
            }
        }
        localStorage.setItem('list', JSON.stringify(list));
        removegsmc();
        resetselect();
    });
    //公司select切换事件
    $('#box_select_company').change(function () {

        $('#box_select_company2').empty();

        var gsselected = $(this).find('option:selected').text();

        list[gsselected].map(function (x) {

            x !== null ? $('#box_select_company2').append("<option>" + x + "</option>") : "";
        });
    });
    //恢复职位
    window.removelist = function () {
        var gsmc = $('#box_select_company option:selected').text();

        var zwmc = $('#box_select_company2 option:selected').text();

        if (zwmc == 'ALL') {
            delete list[gsmc];
        } else {
            list[gsmc].splice(list[gsmc].indexOf(zwmc),1);
        }
        
        localStorage.setItem('list', JSON.stringify(list));
        resetselect();
    };
    //离开当前页面时删除removelist方法
    window.Onbeforeunload = function () {
        delete window.removelist;
    };
}
//替代原生排除公司btn
function pcbtn() {

    //重置select
    resetselect();
    $('.del_company')[0].textContent = '脚本管理';
    $('.al_tit01.f_array01.f_left').text('请选择要恢复的职位或公司(刷新页面生效)').css('font-size', '20px');
    $('#close_save_com_layer').remove();
    //职位select
    $('.alt_select.m_top5.m_bottom10').append('<select id="box_select_company2" style="margin-top:10px" class="box_select01 f_left"></select>');
    //恢复职位确定按钮
    $('#box_select_company').after('<button id="close_save_com_layer2" class="btn_submit01 f_left m_left10 __ga__button_forbidcompwithsou_forbidcomp_forbid_001" onclick="removelist()"></button>');
    //职位初始化
    $('#box_select_company').change();
    $('.f_right.font12.f_array01').remove();

}
//重置select
function resetselect() {
    var okl = Object.keys(list);
    $('#box_select_company').empty();
    okl.map(function (x) {
        var ll = list[x].length,test=0;
        list[x].map(function (y) { 
            y === null ? test++ : "";
        })
        ll!==test?$('#box_select_company').append("<option>" + x + "</option>"):"";
    });
    $('.line_bottom').children()[0].innerHTML = "已排除的公司<b style='margin-left: 10px;color:red'>" + okl.length + "";
    $('#box_select_company').change();
}


