// ==UserScript==
// @name         【茹西教王的理想鄉】NP计算增强
// @namespace    https://greasyfork.org/zh-CN/scripts/34566-%E8%8C%B9%E8%A5%BF%E6%95%99%E7%8E%8B%E7%9A%84%E7%90%86%E6%83%B3%E9%84%89-np%E8%AE%A1%E7%AE%97%E5%A2%9E%E5%BC%BA
// @version      0.2.2.20171101
// @icon         http://kazemai.github.io/fgo-vz/favicon.ico
// @description  【茹西教王的理想鄉】NP计算页面增加暴击和鞭尸的NP数值
// @author       AgLandy
// @match        http://kazemai.github.io/fgo-vz/np_get.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34566/%E3%80%90%E8%8C%B9%E8%A5%BF%E6%95%99%E7%8E%8B%E7%9A%84%E7%90%86%E6%83%B3%E9%84%89%E3%80%91NP%E8%AE%A1%E7%AE%97%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/34566/%E3%80%90%E8%8C%B9%E8%A5%BF%E6%95%99%E7%8E%8B%E7%9A%84%E7%90%86%E6%83%B3%E9%84%89%E3%80%91NP%E8%AE%A1%E7%AE%97%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

/*
如有问题请到这里 “ http://bbs.ngacn.cc/read.php?tid=12715990 ” 反馈
*/

$('#svtNpCal').ready(function(){

    var s = '\
    function svtCal(){\
        var a = getBaseNP(svtid.value);\
        npUp = rateLimit(10*in_np.value,5E3);\
        a.artUp = rateLimit(10*in_art.value,5E3);\
        a.quickUp = rateLimit(10*in_quick.value,5E3);\
        var d = $("#svtNpCal td[name]").slice(0, 23);\
        $.each(d, function(i, d){\
            var p = $(d).attr("name").split(",");\
            npCalE(p, a, d);\
        });\
        var b = 1 == a.npType ? npCal2(0,30,a.artUp,a.npHit,a.npbase) : 2 == a.npType ? npCal2(0,0,a.busterUp,a.npHit,a.npbase) : 3 == a.npType && npCal2(0,10,a.quickUp,a.npHit,a.npbase);\
        $("#svtNpCal td:eq(23)").html(b);\
    }\
    function npCalE(p, a, d){\
        if(p.length > 4){\
            var h = eval(p[4])*(1E4*parseInt(p[0])+parseInt(p[1])*(1E3+parseInt(eval(p[2]))))*(1E3+parseInt(npUp))/1E7,\
                cr = Math.floor(h*2)*eval(p[3])/100,\
                ok = Math.floor(Math.floor(h)*1.5)*eval(p[3])/100,\
                bo = Math.floor(Math.floor(h*2)*1.5)*eval(p[3])/100;\
            $(d).html(Math.floor(h)*eval(p[3])/100);\
            $(d).parent().parent().find("tr:eq(2) td[name=\'" + $(d).index() + "\']").html(cr);\
            $(d).parent().parent().find("tr:eq(3) td[name=\'" + $(d).index() + "\']").html(ok);\
            $(d).parent().parent().find("tr:eq(4) td[name=\'" + $(d).index() + "\']").html(bo);\
            if($(d).index() == 16 || $(d).index() == 17){\
                $(d).parent().parent().find("tr:eq(2) td[name=\'" + $(d).index() + "\']").html("-");\
                $(d).parent().parent().find("tr:eq(4) td[name=\'" + $(d).index() + "\']").html("-");\
            }\
        }\
        else if(/100/.test(p[0]))\
            $(d).html(eval(p[0]) + "%");\
        else\
            $(d).html(eval(p[0]));\
    }\
    function npCal2(firstCard, Magn, cardMod, hits, npbase){\
        return Math.floor(npbase*(1E4*firstCard+parseInt(Magn)*(1E3+parseInt(cardMod)))*(1E3+parseInt(npUp))/1E7)*hits/100;\
    }\
    function svtClick(c){$("#classid").val(0);classidChange();$("#svtid").val(c).trigger("change");}';
    $('<script type="text/javascript" />').html(s).appendTo('head');

    var d = $('#svtNpCal').parent();
    d.css('float', '');
    d.prev().css('float', '');

    var c = "<tbody><tr><th class='blue'>A%</th><th class='blue'>AH</th><th class='blue'>A1+</th><th class='blue'>A2</th><th class='blue'>A2+</th><th class='blue'>A3</th><th class='blue'>A3+</th><th class='green'>Q%</th><th class='green'>QH</th><th class='green'>Q1</th><th class='green'>Q2</th><th class='green'>Q2+</th><th class='green'>Q3</th><th class='green'>Q3+</th><th>Ex%</th><th>ExH</th><th>Ex</th><th>Ex+</th><th class='red'>B%</th><th class='red'>BH</th><th class='red'>B+</th><th>NP%</th><th>NPH</th><th>NP</th></tr></tbody>";
    $('#svtNpCal').html(c);
    $('#svtNpCal th').attr('width', '40');
    for(let i = 0; 4 > i; i++){
        let r = $('<tr align="center" />').appendTo(d.find('tbody'));
        for(let j = 0; d.find('th').length > j; j++){
            $('<td />').appendTo(r);
        }
    }
    var data = [
        'a.npbaseA/100',
        'a.artHit',
        '1,30,a.artUp,a.artHit,a.npbaseA',
        '0,45,a.artUp,a.artHit,a.npbaseA',
        '1,45,a.artUp,a.artHit,a.npbaseA',
        '0,60,a.artUp,a.artHit,a.npbaseA',
        '1,60,a.artUp,a.artHit,a.npbaseA',
        'a.npbaseQ/100',
        'a.quickHit',
        '0,10,a.quickUp,a.quickHit,a.npbaseQ',
        '0,15,a.quickUp,a.quickHit,a.npbaseQ',
        '1,15,a.quickUp,a.quickHit,a.npbaseQ',
        '0,20,a.quickUp,a.quickHit,a.npbaseQ',
        '1,20,a.quickUp,a.quickHit,a.npbaseQ',
        'a.npbaseEx/100',
        'a.exHit',
        '0,10,0,a.exHit,a.npbaseEx',
        '1,10,0,a.exHit,a.npbaseEx',
        'a.npbaseB/100',
        'a.busterHit',
        '1,0,a.busterUp,a.busterHit,a.npbaseB',
        'a.npbase/100',
        'a.npHit',
    ];
    $.each($('#svtNpCal tr:eq(1) td'), function(i, d){
        $(d).attr('name', data[i] ? data[i] : null);
    });
    for(let i = 1; i < 4; i++){
        let d = $('#svtNpCal tr:eq(' + (i + 1) + ')').children();
        for(let j = 1; j < d.length - 3; j++){
            $(d[j]).attr('name', j);
            if(/H/.test(d.parent().parent().find("th:eq(" + j + ")").html())){
                $(d[j - 1]).attr('alt', 't').html(1 == i ? '暴击' : 2 == i ? '鞭尸' : '暴击+鞭尸');
                $(d[j]).addClass('h');
            }
        }
    }
    $('#svtNpCal td.h').remove();
    $('#svtNpCal td[alt]').attr('colspan', '2').removeAttr('alt');

    $('input[type="text"]').keydown(function(e){
        if(e.keyCode == 13)
            $('input[value="開始計算"]').click();
    });

    $('input[value="開始計算"]').click();

    $('#svtid').attr('onchange', 'svtidChange();console.log($(this).find(":selected").text() + " : " + this.value);');

});





