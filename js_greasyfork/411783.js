// ==UserScript==
// @name         教师资格考务系统辅助
// @namespace    https://greasyfork.org/zh-CN/scripts/411783-%E6%95%99%E5%B8%88%E8%B5%84%E6%A0%BC%E8%80%83%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9
// @version      0.2
// @description  为教师资格考务系统提供便利功能
// @author       邱鸿翔
// @match        https://ntcekw2.neea.edu.cn/*

// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411783/%E6%95%99%E5%B8%88%E8%B5%84%E6%A0%BC%E8%80%83%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/411783/%E6%95%99%E5%B8%88%E8%B5%84%E6%A0%BC%E8%80%83%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


//考务系统各页面附加功能
$(document).ready(function () {
    //指定页面执行指定函数模式
    console.log(location.pathname)
    //定义对象，不同的location.pathname，指定相应的do_script函数
    let page_action = {
        //非ie登陆
        "/teach/login/ieNote": {
            "do_script": ieNote,
        },

        //左侧菜单
        "/teach/frame/leftPage": {
            "do_script": leftPage,
        },

       
        // 笔试考生分配页,分配第三时间段
        "/teach/examRoomResult/subjectDispatch2": {
            "do_script": subjectDispatch2,
        },

    }
    //如果访问页面的pathname在page_action中已定义，则执行对应的功能函数
    if (page_action.hasOwnProperty(location.pathname)) {
        page_action[location.pathname].do_script()
    }

});


function ieNote() {
    let logo = document.createElement("div");
    logo.innerHTML = '<form name="myform" action="/teach/login/doLogin" method="post"> <table width="100%"><tr> <td style="background: url(/teach/imagesmain/login_bg.png) no-repeat center;" align="center"> 	 <table width="567" height="331" border="0" align="center" cellpadding="0" cellspacing="0"> 	 <tr> 	 <td height="117">&nbsp;</td> 	 </tr> 	 <tr> 	 <td height="63"> 		 <table border="0" cellpadding="0" cellspacing="0"> 		 <tr> 		 <td width="210" height="22" align="left">&nbsp;</td> 		 <td align="left" class="nam">用&nbsp;&nbsp;户：</td> 		 <td height="22" align="left"> 		 	<input type="text" id="username" name="username" value="" class="textNoBorder" /> 		 </td> 		 </tr> 		 <tr> 		 <td height="19" colspan="3" style="line-height:12px">&nbsp;</td> 		 </tr> 		 <tr> 		 <td align="left">&nbsp;</td> 			<td align="left" class="nam">密&nbsp;&nbsp;码：</td> 		 <td align="left"> 		 	<input type="password" id="password" name="password" value="" class="textNoBorder" /> 		 	&nbsp;<a href="/teach/login" style="text-decoration:none"><span style="color:#cc0000;font-size:12px">原始登陆页</span></a> 		 </td> 		 </tr> 		 		 </table> 	 </td> 	 </tr> 	 <tr> 	 <td height="78"> 	 	<input name="image2" type="image" style="margin-left:270px;" onclick="return doCheck()" src="/teach/imagesmain/login_button01.jpg" /> &nbsp;&nbsp; 	 	 </td> 	 </tr> 	 <tr> 	 <td height="72">&nbsp;</td> 	 </tr> 	 </table> </td> </tr>  </table> </form> ';
    document.body.insertBefore(logo, document.body.firstChild);
}

//左侧菜单打开新窗口
function leftPage() {
    let tds = $("td[id^='outlookdiv']")
    tds.css('padding-left', '0px');
    tds.find("span").each(function () {
        //alert($(this).text());
        let $a = $(this).find('a').attr('href').split('"');
        //alert($a[1]);
        $(this).find('img').wrap("<a href='" + $a[1] + "' target='_black'></a>");
    });
}




function get_kaodian_info(handle) {
    $.get('/teach/orginfo/spotList',
        function (html) {
            let trs = $(html).find("input[name='myId']").parent().parent()
            $.each(trs, function (index, tr) {
                // console.log(tr)
                let kaodian_id = $(tr).find("input[name='myId']").val()
                let kaodian_name = $(tr).find("td").eq(2).text()
                console.log(kaodian_id, kaodian_name)
                $(handle).append(
                    "<div><input type='radio' name='kaodian' value='" + kaodian_id + "'>" + kaodian_name + "</div>")
            })

        })
}

// 工具函数
// 笔试分配考生到考点
function fenpei_to_kaodian(kaodian_id, renshu, kemu_id, kaoqu_id, xueduan_id) {
    let key = 'value_' + kaodian_id.toString()
    let p_data = {
        myId: kaodian_id,//考点id
        planId: kemu_id,//科目id
        orgId: kaoqu_id,//考区id
        examType: xueduan_id,//学段id
        ids: kaodian_id,//考点id
    }
    p_data[key] = renshu //人数
    $.ajax({
        type: 'post',
        url: '/teach/examRoomResult/subjectDispatchDo',
        data: p_data,
    })
}

function subjectDispatch2() {
    //获取考区id：orgId，学段id：examType
    let kaoqu_id = $("[name='orgId']").val()
    let xueduan_id = $("[name='examType']").val()
    console.log(kaoqu_id, xueduan_id)

    //隐藏下一步按钮
    $("input[value='下一步']").hide()

    // 添加考点选择表
    let form = $("form")
    form.wrap("<div class='wrap'></div>")
    form.css('float', 'left')
    form.before("<div style='float:left'><div id='kaodian_list' ></div></div>")
    get_kaodian_info($("#kaodian_list"))

    // 为每学科每行添加复选框，隐藏单选
    let inputs = $("[name='myId']")
    $.each(inputs, function (index, input) {
        if (!$(input).attr('disabled')) {
            let planId = $(input).val()
            $(input).parent().parent().attr('name', 'info_row')
            $(input).after("<input type='checkbox' name='planId' value='" + planId + "'/>")
            $(input).hide()
        }
    })

    //添加一键分配按钮
    $("#kaodian_list").after("<hr>" +
        "<p>说明：单选考点，复选科目，单击一键分配后，</br>" +
        "会自动把对应科目的【全部】考生，分配到指定考点。</br>" +
        "分配是否成功，本页面无反馈，可在分配统计页面中查看。</p>" +
        "<button type='button' id='tijiao'>一键分配选中科目</button>")
    $("#tijiao").click(function () {
        //获取考点选择表中选中的考点id
        let kaodian_id = $("[name='kaodian']:checked").val()
        console.log(kaodian_id)
        //遍历选中的科目
        let kemu_id_list = $("[name='planId']:checked")
        $.each(kemu_id_list, function (index, kemu) {
            // 科目id
            let kemu_id = $(kemu).val()
            // 待分配人数
            let renshu = $(kemu).parent().parent().find("td").eq(1).text()
            fenpei_to_kaodian(kaodian_id, renshu, kemu_id, kaoqu_id, xueduan_id)
        })

    })
}