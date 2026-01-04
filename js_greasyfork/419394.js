// ==UserScript==
// @name         待检人员删除及批量删除
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  将待检人员管理中的删除和批量删除功能复制到待检人员提醒模块
// @author       Bearkr
// @match        http://202.100.190.69:8088/zhwwpt_web/yiQingGuanLi/heSuanJianCeJiLuPage*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419394/%E5%BE%85%E6%A3%80%E4%BA%BA%E5%91%98%E5%88%A0%E9%99%A4%E5%8F%8A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/419394/%E5%BE%85%E6%A3%80%E4%BA%BA%E5%91%98%E5%88%A0%E9%99%A4%E5%8F%8A%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
function a(){
alert('测试自定义函数的使用！');
}
//a();

//待检人员提醒全选复选框函数
function selectAllCheckboxtx(){
        var allCheckbox = document.getElementsByName("dataCheckboxtx"); //所有需要处理的复选框
        if (document.getElementById("selectOrNottx").checked) { //全选
            for (var i = 0; i < allCheckbox.length; i++) {
                allCheckbox[i].checked = true;
                //updatePeopleById1("add", allCheckbox[i].value);
            }
        } else {
            for (var j = 0; j < allCheckbox.length; j++) {
                allCheckbox[j].checked = false;
                //updatePeopleById1("del", allCheckbox[j].value);
            }
        }
    }

//待检提醒批量删除函数
function plDeleteJcryInftx(){
        var djry_chk = [];
        $('input[name="dataCheckboxtx"]:checked').each(function(){
            djry_chk.push($(this).val());
        });
        if(djry_chk==null || djry_chk.length<1){
            alertWindow("至少选择1条数据删除！");
            return ;
        }
        dialogConfirmSubmit('确认要删除勾选数据？', function(){
            deleJcryInfo(djry_chk);
        });
    }

//待检人员批量删除按钮
    var djry = document.getElementsByClassName('search-con')[0];
    var djry1 = document.createElement("button");
    djry1.innerText = "批量删除（谨慎使用）";
    djry1.onclick=function(){plDeleteJcryInf();};
    djry.appendChild(djry1);


//待检提醒批量删除按钮
    var djtx = document.getElementsByClassName('search-con')[1];
    var djtx1 = document.createElement("button");
    djtx1.innerText = "批量删除（谨慎使用）";
    djtx1.onclick=function(){plDeleteJcryInftx();};
     //插入全选元素
    //document.getElementById('table_id_3').childNodes;//获取子节点集合
    //var quanxuan = document.getElementsByTagName("th")[28];
    var qx1 = document.createElement("input");
    var t_qx=document.createTextNode("全选");
    qx1.type="checkbox";
    qx1.id="selectOrNottx";
    //qx1.innerText = "全选删";
    qx1.onclick=function(){selectAllCheckboxtx();};
    //quanxuan.appendChild(qx1);
    djtx.appendChild(qx1);
    djtx.appendChild(t_qx);
    //插入批量删除按钮
    djtx.appendChild(djtx1);

//增加待检人员提醒模块的单条删除按钮
    var mychar= document.getElementById('signTemplateAppendDj');
	var tr = '</a>';
	var sc = '</a><a class="btn btn-link btn-xs" href="javascript:void(0);" onclick="deleteJcryInfoModal(\'{{zjhmValue}}\')">删除</a>';
	var xs = mychar.innerHTML.replace(tr,sc);
	mychar.innerHTML=xs;

 //待检提醒批量删除专用复选框添加
    //var djtxbt= document.getElementById('table_id_3');
	//var tr1 = '<th width="3%">#</th>';
	//var sc1 = '<th id="tixingquanxuan" width="3%">#<input type="checkbox" id="selectOrNottx" value="ddd" onclick="selectAllCheckboxtx()"></th>';
    //var sc1 = '<th id="tixingquanxuan" width="3%">#</th>';
	//var xs1 = djtxbt.innerHTML.replace(tr1,sc1);
	//djtxbt.innerHTML=xs1;

    //添加每条记录的复选框
    var djtxnr= document.getElementById('signTemplateAppendDj');
	var tr2 = 'index}}</td>';
	var sc2 = 'index}}<input type="checkbox" name="dataCheckboxtx" value="{{zjhmValue}}"/></td>';
	var xs2 = djtxnr.innerHTML.replace(tr2,sc2);
	djtxnr.innerHTML=xs2;

//待检提醒查询结果导出
    var wjdc = document.getElementsByClassName('post-control')[1];
    var dc3 = document.createElement("button");
    dc3.innerText = "导出查询结果数据";
    dc3.onclick=function(){excelExportUtil('searchForm_dj_id',$('#signinPageTotal_dj b').text());};
    wjdc.appendChild(dc3);

 //测试短信提醒
    var dxtx = document.getElementsByClassName('search-con')[1];
    var dc4 = document.createElement("button");
    dc4.innerText = "短信提醒";
    dc4.style = "margin-left:30px;";
    dc4.onclick=function(){noticeHsxx1();};
    dxtx.appendChild(dc4);
})();