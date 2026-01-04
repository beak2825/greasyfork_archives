// ==UserScript==
// @name         抢九价异步请求
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提前3秒开始
// @author       You
// @match        https://weixin.91160.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91160.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453563/%E6%8A%A2%E4%B9%9D%E4%BB%B7%E5%BC%82%E6%AD%A5%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/453563/%E6%8A%A2%E4%B9%9D%E4%BB%B7%E5%BC%82%E6%AD%A5%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==

var unitid, depid, docid, userid, userkey,yuyuesuccess = false;
var 顺序 = false;//true为顺序，false为逆序（顺序为早上从早到晚，逆序为早上从晚到早，并非一天中晚到早）
setInterval(function () {
    if (document.getElementsByClassName('notice-button').length > 0) {
        document.getElementsByClassName('notice-button')[0].click()//点击弹窗（我知道了）
    }
    if (document.getElementsByClassName("close-btn flex").length > 0) {
        document.getElementsByClassName("close-btn flex")[0].click()//点击X（医生在14天内无可预约号源）
    }
    if (!document.getElementById("zdyy")) {
        //按键存在不存在，创建按键
        创建自动预约();
    }
}, 500);

function 创建自动预约() {
    let button = document.createElement("a");
    button.id = "zdyy";
    button.style = "background: #ffae1712;border: 1px solid #ffae17;color: #ffae17;font-weight: 700;display: inline-block;padding: 0px 0.373333rem;line-height: 0.906667rem;height: 0.96rem;border-radius: 40px;box-sizing: border-box;position: relative;";
    button.innerHTML = "<span>开启自动预约</span>";
    button.onclick = function () {
        悬浮窗();
        获取账号信息();
        var myVar = setInterval(function () { 检查有没有号(myVar) }, 500);
    };
    let x = document.getElementsByClassName("out-dep-box")[0].parentNode;
    x.appendChild(button);
};

function 检查有没有号(myVar) {
    let url = 'https://wechatgate.91160.com/guahao/v1/src/doctor_sch?cid=&list=[{"unit_id":'+unitid+',"dep_id":'+depid+',"doctor_id":'+docid+'}]';
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        dataType: "json",
        success: function (data) {
            if(data.data[0].state == 1){
                clearInterval(myVar);
                $("#sifouyuyue")[0].innerText = 获取当前时间()+"有号";
                获取挂号信息();
            }else{
                $("#sifouyuyue")[0].innerText = 获取当前时间()+"无号";
            }
        }
    });
};

function 获取挂号信息() {
    let url = "https://wechatgate.91160.com/guahao/v1-1/sch/union/doctor?cid=16&user_key=" + userkey + "&account_user_id=0&dep_id=" + depid + "&doctor_id=" + docid + "&all_point=1&page=1&select_date=&user_id=" + userid + "&user_key=" + userkey + "&unit_id=" + unitid;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            for (let i = 0; i < data.data.sch_list.length; i++) {
                //判断哪一日可预约
                if (data.data.sch_list[i].sch["am"] != undefined) {//判断上午有无号
                    let scheduleid = data.data.sch_list[i].sch["am"][0].schedule_id;
                    获取预约具体时间(scheduleid);
                }
                if (data.data.sch_list[i].sch["pm"] != undefined) {//判断下午有无号
                    let scheduleid = data.data.sch_list[i].sch["pm"][0].schedule_id;
                    获取预约具体时间(scheduleid);
                }
                if (data.data.sch_list[i].sch["em"] != undefined) {//判断晚间有无号
                    let scheduleid = data.data.sch_list[i].sch["em"][0].schedule_id;
                    获取预约具体时间(scheduleid);
                }
            }
        }
    });
};

function 获取预约具体时间(scheduleid) {
    let url = "https://wechatgate.91160.com/guahao/v1/src/detail?cid=16&user_key=" + userkey + "&unit_id=" + unitid + "&schedule_id=" + scheduleid + "&dep_id=" + depid + "&doctor_id=" + docid + "&user_key=" + userkey + "&src_all=1";
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            if (顺序 == true) {//顺序
                for (let i = 0; i < data.data.SchList.length; i++) {
                    if (yuyuesuccess == true) {
                        return true;
                    };
                    let schtime = data.data.SchList[i].sch_time;
                    let srcid = data.data.SchList[i].src_id;
                    let schid = data.data.SchList[i].schedule_id;
                    let 可约数量 = data.data.SchList[i].left_num;
                    if (可约数量 > 0) {
                        获取tokenkey(srcid, schid, schtime);
                    }
                }
            } else {//逆序
                for (var i = data.data.SchList.length - 1; i >= 0; i--) {
                    if (yuyuesuccess == true) {
                        return true;
                    };
                    let schtime = data.data.SchList[i].sch_time;
                    let srcid = data.data.SchList[i].src_id;
                    let schid = data.data.SchList[i].schedule_id;
                    let 可约数量 = data.data.SchList[i].left_num;
                    if (可约数量 > 0) {
                        获取tokenkey(srcid, schid, schtime);
                    }
                }
            }
        }
    });
};

function 获取tokenkey(srcid, schid, schtime) {
    let 请求URL = "https://weixin.91160.com/order/confirm.html?unit_id=" + unitid + "&sch_id=" + schid + "&dep_id=" + depid + "&detl_id=" + srcid + "&isVideo=null&srcext_amt=0&from_function_id=DOC_GH_YUYUE1&from_function_name=医生主页_挂号_预约";
    let 请求 = new XMLHttpRequest();
    请求.open('GET', 请求URL, true);
    请求.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    请求.send();
    请求.onreadystatechange = function () {
        if (请求.readyState == 4 && 请求.status == 200) {
            let 响应文本 = 请求.responseText;
            let tokenkey = 响应文本.match(/(?<=token_key = ")(.+?)(?=";)/g)[0];
            let 手机号 = 响应文本.match(/(?<=default_mobile = ")(.+?)(?=";)/g)[0];
            let mid = 响应文本.match(/(?<=confirm_member_id = ")(.+?)(?=")/g)[0];
            发起预约(tokenkey, 手机号, mid, schtime);
        }
    }
}

function 发起预约(tokenkey, 手机号, mid, schtime) {
    let url = "https://weixin.91160.com/order/submit.html?inteCode=%2B86&mobile=" + 手机号 + "&disease_id=&mid=" + mid + "&lng=113.709495&lat=22.971677&token_key=" + tokenkey + "&submit_anxin=0&accident_id=0&insurance_alias=0&setting_refresh=0&qrcode=";
    $.ajax({
        type: "GET",
        url: url,
        async:true,
        dataType: "json",
        success: function (data) {
            if (data.state != 1) {
                if (data.state == -1001) {//下单超时
                    向悬浮窗添加内容("下单超时");
                    return
                }
                if (data.state == -101) {//需补全身份证信息并跳转完善信息页面
                    向悬浮窗添加内容("需补全身份证信息并跳转完善信息页面");
                    return;
                }
                if (data.state == -10) {//未在线建档时弹框
                    向悬浮窗添加内容("未在线建档时弹框");
                    return;
                }
                if (data.state == -501) {//就诊人信息是否审核中
                    向悬浮窗添加内容("就诊人信息是否审核中");
                    return;
                }
                if (data.state == -502) {//就诊人信息是否认证中
                    向悬浮窗添加内容("就诊人信息是否认证中");
                    return;
                }
                if (data.state == -503) { // 预约出错的情况处理
                    if (data.data.error_type == 1 || data.data.error_type == 2 || data.data.error_type == 3) {
                        向悬浮窗添加内容("提交订单失败");
                        向悬浮窗添加内容(data.msg);
                        return;
                    }
                }
                if (data.state == -701) {//就诊人是否审核
                    if (data.is_card_full == 1) {
                        向悬浮窗添加内容('就诊人需实名认证后才可预约挂号');
                    } else {
                        向悬浮窗添加内容('监护人需实名认证后才可预约挂号');
                    }
                    return;
                }
                if (data.state == -702) {//支付宝城市服务下单就诊人没有身份证
                    向悬浮窗添加内容('支付宝城市服务下单就诊人没有身份证');
                    return;
                }
                if (data.state == -600) {// 当天挂号就诊卡校验有误
                    向悬浮窗添加内容('当天挂号就诊卡校验有误');
                    return;
                }
                if (data.state == -801) {
                    向悬浮窗添加内容('抱歉！本医院暂时仅支持使用身份证、军官证、护照挂号，请重新创建就诊人');
                    return;
                }
                if (data.state == -802) {
                    向悬浮窗添加内容('抱歉！该医院规定必须使用有效证件预约，请完善就诊人证件信息。如为无证儿童请医院窗口预约');
                    return;
                }
                if (data.msg == '下单失败！') {
                    向悬浮窗添加内容('下单失败！');
                    向悬浮窗添加内容(data.msg);
                    return;
                }
            } else {
                向悬浮窗添加内容("预约时间：" + schtime);
                向悬浮窗添加内容('预约成功！');
                yuyuesuccess = true;
            }
        }
    });
}

function 获取医师信息() {
    let url = location.search;
    unitid = url.match(/(?<=unit_id=)(.+?)(?=&)/g)[0];
    depid = url.match(/(?<=dep_id=)(.+?)(?=&)/g)[0];
    docid = url.match(/(?<=doc_id=)(.+?)(?=&)/g)[0];
    //获取登录状态
};

function 获取账号信息() {
    获取医师信息();
    let url = "https://weixin.91160.com/patient_wechat/v1/user/islogined.html?code=&user_key=&cid=16";
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) {
            if (data.data.status == 1) {
                userkey = data.data.user_info.user_key;
                userid = data.data.user_info.user_id;
            } else {
                location.href = 'https://weixin.91160.com/h5/advance/account/index.html?from_function_id=INDEX_MY_000&from_function_name=%E6%88%91%E7%9A%84';
            }
        }
    });
};

function 悬浮窗() {
    if (!document.getElementById("xfc")) {
        setTimeout(function () {
            $("body").append("<div id='xfc'onmouseover=javascript:this.style.background='#f7f9fa' onmouseout=javascript:this.style.background='#ffffff' class='is-plain' style='left: 10px;bottom: 10px;color: #000000;overflow: hidden;z-index: 9999;position: fixed;padding:10px;text-align:center;width: auto;height:auto;border-radius: 16px;background: #ffffff;box-shadow:  5px 5px 18px #b5b5b5,-5px -5px 18px #ffffff;overflow-y:auto; max-height: 400px;'>自动预约已启动<br><a id='sifouyuyue'>能否预约</a></div>");
        }, 0);
    }
};

function 向悬浮窗添加内容(添加内容) {
    var para = document.createElement("p");
    var node = document.createTextNode(添加内容);
    para.appendChild(node);
    var element = document.getElementById("xfc");
    element.appendChild(para);
};

//获取当前时间并返回
function 获取当前时间(格式) {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    if (格式 == "时分秒") {
        return hour + ":" + minute + ":" + second;
    } else {
        return year + "年" + month + "月" + day + "日 " + hour + ":" + minute + ":" + second;
    }

}
