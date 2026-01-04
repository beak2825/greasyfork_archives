// ==UserScript==
// @name      Specific Form Auto-complete Script v2
// @namespace   Violentmonkey Scripts
// @version     2.0.1
// @author      Anonymous
// @license    GPLv3
// @description 2022/02/08
// @include */index/apply/apply/RULEID/124
// @downloadURL https://update.greasyfork.org/scripts/433715/Specific%20Form%20Auto-complete%20Script%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/433715/Specific%20Form%20Auto-complete%20Script%20v2.meta.js
// ==/UserScript==

function pre(){

    var para = document.createElement("button");
    para.style.fontSize="larger";
    para.innerHTML="一键申请";
    para.onclick=autoComplete;
    var element = document.getElementsByClassName("but")[0];
    para.style.background='#ae0a29';
    element.appendChild(para);

}

pre();

var workDay=new Date();
var d=new Date();

function autoComplete(){

    //时间inoutDate
    var toMonth = workDay.getMonth()+1;
    toMonth=("0" + toMonth ).slice(-2);
    var toDay = ("0" + workDay.getDate() ).slice(-2);
    var inoutDate=""+workDay.getFullYear()+"-"+toMonth+"-"+toDay;

    var urla="/index/apply/apply";
    var ppdata={
        'NAME':$("input[name='NAME[]']").val(),
        'TEL':$("input[name='TEL[]']").val(),
        'IDCARD':$("input[name='IDCARD[]']").val(),
        'CARDTYPE':'学号/职工号',
        'SEX':$("select[name='SEX[]']").val(),
        'CARNUM':'',
        'AUTHONEPEO':'',
        'DOTOP':0,
        'RULEID':124,
        'OUTREACON':1300,
        'QJT':'',
        'OUTTIME':inoutDate, //进校日期
        'INFOTYPE':3,
        'INTOGATE':11,
        'BACKTIME':'全天',
        'ARRTIVE':'首体',
        'TRACH':'4号线',
        'INTODATE':inoutDate, //进校日期
        'INTODUAN':'all',
        'OUTDUAN':'all',
        'RESONTYPE':'校外办事',
        'INFO':'',
        'BEIZHU':'',
        'all_times_str':'',
        'all_INTODUAN_str':'',
        'all_times_str1':'',
        'all_INTODUAN_str1':'',
    };

    $.ajax({
        type: 'POST',
        url: urla,
        data: ppdata,
        dataType: 'json',
        success: function(response){
            if(response['result']){Soogee.Notify.success(inoutDate+'<br>'+response['msg']);}
            else {Soogee.Notify.fail(inoutDate+'<br>'+response['msg']);}

        }
    });

    workDay.setDate(workDay.getDate()+1);
    console.log(workDay.getDate()-d.getDate());
    if(workDay.getDate()-d.getDate()<4){autoComplete();}
    else{
       Soogee.Notify.success('申请完成！');	}

}

