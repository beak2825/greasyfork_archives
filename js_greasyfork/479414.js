// ==UserScript==
// @name         口袋校园
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  口袋校园审核优化
// @author       pxyj2019@gmail.com
// @match        https://pocketuni.net/index.php?app=event&mod=*
// @icon         https://pocketuni.net/favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        none
// @contributionURL   https://afdian.net/a/fivesummer
// @antifeature  爱发电 解锁付费功能需捐助
// @run-at		 document-body
// @downloadURL https://update.greasyfork.org/scripts/479414/%E5%8F%A3%E8%A2%8B%E6%A0%A1%E5%9B%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/479414/%E5%8F%A3%E8%A2%8B%E6%A0%A1%E5%9B%AD.meta.js
// ==/UserScript==

/*
学校后台
https://pocketuni.net/index.php?app=event&mod=Readme&act=index&ssid=637

活动初审 #普通用户
https://pocketuni.net/index.php?app=event&mod=Event&act=audit1&&p=2

活动终审 #捐助用户
https://pocketuni.net/index.php?app=event&mod=Event&act=audit2

活动完结审核 #捐助用户
https://pocketuni.net/index.php?app=event&mod=Event&act=finish

学时申请管理 待审核 #捐助用户
https://pocketuni.net/index.php?app=event&mod=AdminCredit2&act=index&p=2

团支部评定管理 #捐助用户
https://pocketuni.net/index.php?app=event&mod=League&act=report
*/

//终审人
var credit_user_name = $('body>table>tbody>tr>td>div.header>div.nav_sub>a:eq(0)').text().trim();
var credit_user_href = $('body>table>tbody>tr>td>div.header>div.nav_sub>a:eq(0)').attr('href');
let credit_user_href_url = new URL(credit_user_href);
var credit_user_id = credit_user_href_url.searchParams.get('uid');
console.log("user_name:[" + credit_user_name + "] user_id:[" + credit_user_id + "]");

(function() {
    'use strict';

    //获取当前页面URL
    var currUrl = window.location.href;
    console.log("current url:" + currUrl);
    let u = new URL(currUrl);
    //console.dir(u);
    //console.log(u.searchParams.get('act'));
    var currMod = u.searchParams.get('mod');
    var currAct = u.searchParams.get('act');
    switch(currMod+'_'+currAct) {
    case 'Event_audit1':        //活动初审
        console.dir('活动初审');
        Event_audit1();
        break;
    case 'Event_audit2':        //活动终审
        console.dir('活动终审');
        Event_audit2();
        break;
    case 'Event_finish':        //活动完结审核
        console.dir('活动完结审核');
        Event_finish();
        break;
    case 'AdminCredit2_index':  //学时申请管理 待审核
        console.dir('学时申请管理');
        AdminCredit2_index();
        break;
    case 'League_report':  //团支部评定管理
        var status = u.searchParams.get('status');
        if(status == 0){
            console.dir('团支部评定管理-待审核');
        }else if(status == 3){
            console.dir('团支部评定管理-待复核');
        }else{
            console.dir('团支部评定管理-全部');
        }
        League_report();
        break;
    default:
        console.dir('非审核页面');
        //非审核页面
    }
})();

//活动初审
function Event_audit1(){
    var table = $('div.list input#checkbox2');
    if(table.length == 0){
        return;
    }

    //页面新增 学分输入框 和 审核按钮 Toolbar_inbox
    //var articleTitleBox=document.getElementsByClassName("Toolbar_inbox")[0];
    var articleTitleBox = $('div.Toolbar_inbox > a.btn_a');
    //console.log(articleTitleBox.html());
    articleTitleBox.after('<span>&nbsp;&nbsp;&nbsp;&nbsp;实践学分:<span><input type="text" class="curr_credit" size="2" value="0"><span>&nbsp;&nbsp;<span><input type="button" class="bat_audit" size="6" value=" 批量审核 ">');

    //学分只能输入数字
    $(document).ready(function() {
        //敲击按键时触发
        $(".curr_credit").bind("keypress", function(currevent) {
            var event = currevent || window.event;
            var getValue = $(this)
                .val();
            //控制第一个不能输入小数点"."
            if (getValue.length == 0 && event.which == 46) {
                event.preventDefault();
                return;
            }
            //控制只能输入一个小数点"."
            if (getValue.indexOf('.') != -1 && event.which == 46) {
                event.preventDefault();
                return;
            }
            //控制只能输入的值
            if (event.which && (event.which < 48 || event.which > 57) && event.which != 8 && event.which != 46) {
                event.preventDefault();
                return;
            }
        })
        //失去焦点是触发
        $(".curr_credit").bind("blur", function(event) {
            var value = $(this)
                .val(),
                reg = /\.$/;
            if (reg.test(value)) {
                value = value.replace(reg, "");
                $(this)
                    .val(value);
            }
        })
    });

    $('.bat_audit').click(function(e){
        var curr_credit = $('.curr_credit').val();
        console.log(curr_credit);
        //TODO 检查curr_credit是否为0
        if(parseFloat(curr_credit) <= 0){
            //var msg=confirm("当前学分小于等于0，请确认");
            //if(msg==false){
            //    return;
            //}
            alert("当前学分小于等于0，请确认");
            return;
        }else{
            var msg=confirm("当前学分:["+curr_credit+"]，请确认");
            if(msg==false){
                return;
            }
        }

        //获取全部选择的申请
        var allSelectApply = $("input:checked");
        if(allSelectApply.length == 0){
            alert("当前没有已选择的申请");
            return;
        }
        console.log(allSelectApply.length);

        //开始批量提交审核
        for(let i = 0; i < allSelectApply.length; i++){
            console.log('ss:'+allSelectApply[i].value);
            Event_audit1_doAudit(allSelectApply[i].value, curr_credit, credit_user_id);
        }
        alert("审核完成，即将刷新")
        setTimeout(function(){location.reload();},1000);

    });
}

//更新列表
function Event_audit1_updateNum() {
    var auditCount = $('#auditCount').html();
    auditCount = auditCount -1;
    $('#auditCount').html(auditCount)
}

//活动初审
function Event_audit1_doAudit(id, credit, credit_user_id) {
    //PU银豆（活动积分）
    var pu_amount = '100';
    //签到员人数上限
    var codelimit = '5';
    //活动时间
    var credit_year_data = '';
    //终审人
    var audit_uid2 = credit_user_id;
    var event_type_group = {};

    var reviews = '';

    var jx_pid = $('#jx_pid').val();
    var jx_id = $('#jx_id').val();
    var hours = $('#hours').val();
    var max_minutes = $('#max_minutes').val();
    var work_upload = $("input[name='work_upload']:checked").val();
    var zyfw_zs = $("input[name='zyfw_zs']:checked").val();
    //提交修改
    $.post("https://pocketuni.net/index.php?app=event&mod=Event&act=doAudit", {
        'gid': id,
        'credit': credit,
        'credit_year_data': credit_year_data,
        'event_type_group': JSON.stringify(event_type_group),
        'pu_amount': pu_amount,
        'codelimit': codelimit,
        'audit_uid2': audit_uid2,
    }, function(res) {
        if (res.status == 0) {
            console.log("id["+id+"]审核失败:"+res.info);
        } else {
            console.log("id["+id+"]审核通过");
            $('#list_' + id).remove();
            Event_audit1_updateNum();
        }
    }, 'json');
}

//活动终审
function Event_audit2(){
    var table = $('div.list input#checkbox2');
    if(table.length == 0){
        return;
    }

    var articleTitleBox = $('div.Toolbar_inbox > a.btn_a');
    articleTitleBox.after('<span>&nbsp;&nbsp;<span><input type="button" class="bat_audit" size="6" value=" 批量审核 ">');

    $('.bat_audit').click(function(e){
        //获取全部选择的申请
        var allSelectApply = $("input#checkbox2:checked");
        if(allSelectApply.length == 0){
            alert("当前没有已选择的申请");
            return;
        }

        //获取实践学分的位置
        var tablehead = $('div.list>table>tbody>tr>th');
        var credit_index = 0;
        for(let it = 0; it < tablehead.length; it++){
            if(tablehead[it].textContent == '实践学分'){
                console.log(tablehead[it]);
                credit_index = it;
                break;
            }
        }

        console.log('credit_index:'+credit_index);
        //TODO credit_index == 0 ?


        console.log(allSelectApply.length);

        //开始批量提交终审
        for(let i = 0; i < allSelectApply.length; i++){
            var currApplyLine = $("div.list input#checkbox2[value='"+allSelectApply[i].value+"']").parent().parent()[0];
            var curr_credit = currApplyLine.children[credit_index+2].textContent.trim();
            console.log(curr_credit);
            if(curr_credit == undefined){
                alert("当前学分获取失败，请确认");
                return;
            }
            if(parseFloat(curr_credit) <= 0){
                alert("当前学分小于等于0，请确认");
                return;
            }
            var pu_amount = currApplyLine.children[credit_index+3].textContent.trim();
            Event_audit2_doFinalAudit(allSelectApply[i].value, curr_credit, pu_amount);
        }
        alert("审核完成，即将刷新")
        setTimeout(function(){location.reload();},1000);
    });
}

//活动终审提交
/*
id: 5313899
credit: 10.00
credit_year_data:
event_type_group: {}
pu_amount: 0
codelimit: 5
*/
function Event_audit2_doFinalAudit(id, curr_credit, curr_pu_amount) {
    var credit = curr_credit;
    var credit_year_data = '';
    var event_type_group = {};
    var pu_amount = curr_pu_amount;
    var codelimit	= '5';

    //提交修改
    $.post("https://pocketuni.net/index.php?app=event&mod=Event&act=doFinalAudit", {
        'id':id,
        'credit':credit,
        'credit_year_data':credit_year_data,
        'event_type_group': JSON.stringify(event_type_group),
        'pu_amount':pu_amount,
        'codelimit':codelimit,
    }, function(res){
        if (res.status ==0) {
            console.log("id["+id+"]审核失败:"+res.info);
        }else {
            console.log("id["+id+"]审核通过");
            $('#list_' + id).remove();
            Event_audit1_updateNum();
        }
    }, 'json');
}

//活动完结审核
function Event_finish(){
    var table = $('div.list input#checkbox2');
    if(table.length == 0){
        return;
    }

    var articleTitleBox = $('div.Toolbar_inbox > a.btn_a');
    articleTitleBox.after('<span>&nbsp;&nbsp;<span><input type="button" class="bat_audit" size="6" value=" 批量审核 ">');

    $('.bat_audit').click(function(e){
        //获取全部选择的申请
        var allSelectApply = $("input:checked");
        if(allSelectApply.length == 0){
            alert("当前没有已选择的申请");
            return;
        }

        console.log(allSelectApply.length);

        //开始批量提交终审
        for(let i = 0; i < allSelectApply.length; i++){
            Event_finish_postFinish(allSelectApply[i].value);
        }
        alert("审核完成，即将刷新")
        setTimeout(function(){location.reload();},1000);
    });
}

//活动完结审核
/*
gid: 5304887
code: 5
give: 1
end_level: 0
pf: 0*/
function Event_finish_postFinish(id) {
    var end_level = '0';
    var pf = 0;

    $.post("/index.php?app=event&mod=Event&act=doFinish", {gid: id, code: 5, give: 1, end_level: end_level,pf:pf}, function (text) {
        if (text == 2) {
            console.log("id["+id+"]操作成功");
            $('#list_' + id).remove();
            var finishCount = $('#finishCount').html();
            finishCount = finishCount - 1;
            $('#finishCount').html(finishCount)
        } else {
            console.log("id["+id+"]操作失败:"+text);
        }
    });
}

//学时申请管理
function AdminCredit2_index(){
    var table = $('div.list input#checkbox2');
    if(table.length == 0){
        return;
    }

    var articleTitleBox = $('div.Toolbar_inbox > a.btn_a');
    articleTitleBox.after('<span>&nbsp;&nbsp;<span><input type="button" class="bat_audit" size="6" value=" 批量审核 ">');

    //获取全部审核页
    $('input[type="checkbox"]').attr('disabled', true);
    for(let i = 0; i < table.length; i++){
        var curr_id = table[i].value;
        //https://pocketuni.net/index.php?app=event&mod=AdminCredit2&act=auditEcApply&id=38416297&audit_level=0
        var curr_url = "https://pocketuni.net/index.php?app=event&mod=AdminCredit2&act=auditEcApply&id="+curr_id+"&audit_level=0";
        AdminCredit2_index_getAuditPage(curr_url, curr_id);
    }

    $('.bat_audit').click(function(e){
        //获取全部选择的申请
        var allSelectApply = $("input#checkbox2:checked");
        if(allSelectApply.length == 0){
            alert("当前没有已选择的申请");
            return;
        }

        console.log(allSelectApply.length);

        //开始批量提交终审
        for(let i = 0; i < allSelectApply.length; i++){
            var currApplyLine = $("div.list input#checkbox2[value='"+allSelectApply[i].value+"']").parent().parent()[0];
            var curr_credit = $("body>div[val='"+allSelectApply[i].value+"']>div.clear>input[name='note']").val();
            console.log(curr_credit);
            if(curr_credit == undefined){
                alert("当前学分获取失败，请确认");
                return;
            }
            if(parseFloat(curr_credit) <= 0){
                alert("当前学分小于等于0，请确认");
                return;
            }
            var old_update_time = $("body>div[val='"+allSelectApply[i].value+"']>div.clear>input[name='old_update_time']").val();
            AdminCredit2_index_doFinish(allSelectApply[i].value, curr_credit, old_update_time);
        }
        alert("审核完成，即将刷新")
        setTimeout(function(){location.reload();},1000);
    });
}

//学时申请管理-获取审核页
function AdminCredit2_index_getAuditPage(url,id){
    $.get(
        url,
        {},
        function(data,state){
            if(state == 'success'){
                //截取div
                var first = data.indexOf('<div');
                var last = data.lastIndexOf('</div>')+6;
                data = data.substr(first, last-first);
                data = data.replace("<div ","<div style=\"display: none;\" val=\""+id+"\" ");
                //console.log(data);
                $('body').prepend(data);
                $("div.list input#checkbox2[value='"+id+"']").attr('disabled', false);
                $('div.list input#checkbox_handle').attr('disabled', false);
            }else{
                console.log('获取审批页失败');
            }
        }
    );
}

//学时申请管理
/*
id: 38234571
note: 0.25
audit_level: 0
level_audit: 0
old_update_time:
*/
function AdminCredit2_index_doFinish(id, credit, old_update_time) {
    var level_audit = 0;
    //var audit_level = $('input[name=audit_level]').val();
    var audit_level = 0;
    var note = credit.replace(/(^\s*)|(\s*$)/g, "");
    var reg1 = /^\d+(\d*|\.|\.\d|\.\d\d)$/;
    if (note < 0 || note > 2000 || !reg1.test(note)) {
        alert('学分请输入不大于2000的数字，可带2位小数');
        return;
    }

    $.post(
        '/index.php?app=event&mod=AdminCredit2&act=doAuditEcApply',
        {
            id: id,
            note: note,
            audit_level: audit_level,
            level_audit: level_audit,
            old_update_time: old_update_time
        },
        function (json) {
            if (json.status == 0) {
                console.log("id["+id+"]操作失败:"+json.info);
            } else {
                console.log("id["+id+"]操作成功");
            }
        },
        'json'
    );
}

//团支部评定管理
function League_report(){
    var allApplyLine = $("div.list>table>tbody>tr");
    if(allApplyLine.length <= 1){
        return;
    }
    console.log("操作成功");

    //插入复选框
    for(let i = 0; i < allApplyLine.length; i++){
        if(i == 0){
            $("div.list>table>tbody>tr:eq("+i+")").prepend('<th><input type="checkbox" id="checkbox_handle" onclick="checkAll(this)" value="0"><label for="checkbox"></label></th>');
        }else{
            $("div.list>table>tbody>tr:eq("+i+")").prepend('<td><input type="checkbox" name="checkbox" id="checkbox2" onclick="checkon(this)" value=""></td>');
        }
    }
    $('input[type="checkbox"]').attr('disabled', true);

    //获取学分
    for(let i = 0; i < allApplyLine.length; i++){
        if(i == 0){
            continue;
        }else{
            var currOperate = $("div.list>table>tbody>tr:eq("+i+")>td:eq(12)").text().trim();
            if(currOperate == '审核' || currOperate == '复核'){
                console.log('开始获取得分');

                var curr_id = $("div.list>table>tbody>tr:eq("+i+")>td:eq(1)").html();
                $("div.list>table>tbody>tr:eq("+i+")>td:eq(0)>input[type='checkbox']").val(curr_id);
                $("div.list>table>tbody>tr:eq("+i+")>td:eq(0)>input[type='checkbox']").attr('operate',currOperate);
                var curr_url = "https://pocketuni.net/index.php?app=event&mod=League&act=audit_t&id="+curr_id+"&page_tile=%E5%AE%A1%E6%A0%B8&is_look=0";
                getScorePage(curr_url, curr_id, i);
            }
        }
    }

    var articleTitleBox = $('form > input.searchBtn');
    articleTitleBox.after('<br><span>&nbsp;&nbsp;<span><input type="button" class="bat_audit" size="6" value=" 批量审核 ">');

    $('.bat_audit').click(function(e){
        //获取全部选择的申请
        var allSelectApply = $("div.list>table>tbody>tr>td>input[type='checkbox'][disabled!='disabled']:checked");
        if(allSelectApply.length == 0){
            alert("当前没有已选择的申请");
            return;
        }

        console.log(allSelectApply.length);

        //开始批量提交
        for(let i = 0; i < allSelectApply.length; i++){

            console.log('curr_i:'+i);

            var curr_id = allSelectApply[i].value;
            console.log('curr_id:'+curr_id);
            //获取得分
            var curr_score = $("body>div[val='"+curr_id+"']>div>form>div input[name='score']").val();
            console.log('curr_score:'+curr_score);
            if(curr_score == undefined){
                alert("当前学分获取失败，请确认");
                return;
            }
            if(parseFloat(curr_score) <= 0){
                alert("当前学分小于等于0，请确认");
                return;
            }

            var currOperate = allSelectApply[i].attributes.operate.value;
            console.log('currOperate:'+currOperate);
            //获取hash
            var curr_hash = $("body>div[val='"+curr_id+"']>div>form>input[name='__hash__']").val();
            console.log('curr_hash:'+curr_hash);
            League_report_doAudit(curr_id, curr_score, currOperate, curr_hash);
        }
        alert("审核完成，即将刷新")
        setTimeout(function(){location.reload();},1000);
    });
}

//团支部评定管理-获取得分页
function getScorePage(url,id, i){
    $.get(
        url,
        {},
        function(data,state){
            if(state == 'success'){
                //截取div
                var first = data.indexOf('<div');
                var last = data.lastIndexOf('</div>')+6;
                data = data.substr(first, last-first);
                data = data.replace("<div class=\"so_main\">","<div style=\"display: none;\" class=\"so_main\" val=\""+id+"\">");
                //console.log(data);
                $('body').prepend(data);
                $("div.list>table>tbody>tr:eq("+i+")>td:eq(0)>input[type='checkbox']").attr('disabled', false);
                $("div.list>table>tbody>tr:eq(0)>th:eq(0)>input[type='checkbox']").attr('disabled', false);
            }else{
                console.log('获取审批页失败');
            }
        }
    );
}

//团支部评定管理
/*
https://pocketuni.net/index.php?app=event&mod=League&act=doAudit
score: 2.0
status: 1
audit_uid2: 19006194
contents:
is_look: 0
id: 625580
__hash__: 2d0b9389c66ae4dc72e729d61f461514
*/
function League_report_doAudit(id, score, currOperate, hash){
    var state = 1;
    var data;
    if(currOperate == '审核'){
        data = {
            score: score,
            status: state,
            audit_uid2: credit_user_id,
            contents: '',
            is_look: 0,
            id: id,
            __hash__: hash
        };
    }else{
        data = {
            score: score,
            status: state,
            contents: '',
            is_look: 0,
            id: id,
            __hash__: hash
        };
    }
    $.post(
        '/index.php?app=event&mod=League&act=doAudit',
        data,
        function (json) {
            if (json.status == 0) {
                console.log("id["+id+"]审核失败:"+json.info);
            } else {
                console.log("id["+id+"]审核成功");
            }
        },
        'json'
    );
}
