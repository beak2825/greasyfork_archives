// ==UserScript==
// @name         东莞常安预约异步请求
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  开发中
// @author       You
// @match        *://wx1635.cnhis.cc/*
// @icon         https://cdn-wx.cnhis.cc/wxcommon/web/favicon.ico
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456813/%E4%B8%9C%E8%8E%9E%E5%B8%B8%E5%AE%89%E9%A2%84%E7%BA%A6%E5%BC%82%E6%AD%A5%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/456813/%E4%B8%9C%E8%8E%9E%E5%B8%B8%E5%AE%89%E9%A2%84%E7%BA%A6%E5%BC%82%E6%AD%A5%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==


var dateorder = true,timeorder = true;//false为逆序
var unitid, depid, docid, userid, userkey,yuyuesuccess = false;
setInterval(function () {
    /*
    if (document.getElementsByClassName('notice-button').length > 0) {
        document.getElementsByClassName('notice-button')[0].click()//点击弹窗（我知道了）
    }
    if (document.getElementsByClassName("close-btn flex").length > 0) {
        document.getElementsByClassName("close-btn flex")[0].click()//点击X（医生在14天内无可预约号源）
    }*/
    if (!document.getElementById("tbzdyy")) {
        //按键存在不存在，创建按键
        创建自动预约();
    }
}, 500);

function 创建自动预约() {
    let button = document.createElement("a");
    button.id = "tbzdyy";
    button.style = "background: #ffae1712;border: 1px solid #ffae17;color: #ffae17;font-weight: 700;display: inline-block;padding: 0px 0.373333rem;line-height: 0.906667rem;height: 0.96rem;border-radius: 40px;box-sizing: border-box;position: relative;";
    button.innerHTML = "<span>开启自动预约(同步)</span>";
    button.onclick = function () {
        悬浮窗();
        //获取账号信息();
        获取医师信息();
        var myVar = setInterval(function () { 检查有没有号(myVar) }, 500);
    };
    //let x = document.getElementsByClassName("schedule-swipe van-swipe")[0].parentNode;
    let x = document.getElementsByClassName("schedule-swipe van-swipe")[0].previousSibling;
    x.appendChild(button);
};
var dycs = 2;
function 检查有没有号(myVar) {
    let url = 'http://wx1635.cnhis.cc/wx/tcEmployee/v3/getEmployeeSchedule.htm?employeeId='+docid+'&deptId='+depid+'&week=0';
    $.ajax({
        type: "GET",
        url: url,
        async: true,
        dataType: "json",
        success: function (data) {
            for (let i = 0; i < data.map.scheduleList.length; i++) {
                //遍历判断哪一日有号
                if (yuyuesuccess == true) {//预约成功后停止预约
                return true;
            };
                if(data.map.scheduleList[i].data != null){
                    for(let j = 0; j < data.map.scheduleList[i].data.length; j++){
                        if(data.map.scheduleList[i].data[j].status!=1){
                            if($('#xfc')[0].lastChild.innerText != ''){
                                if($('#xfc')[0].lastChild.previousElementSibling.innerText == "代码："+data.map.scheduleList[i].data[j].status){
                                    $('#xfc')[0].lastChild.innerText=data.map.scheduleList[i].data[j].statusText+dycs;
                                    dycs=dycs+1;
                                }
                            }else{
                                向悬浮窗添加内容("代码："+data.map.scheduleList[i].data[j].status);
                                向悬浮窗添加内容(data.map.scheduleList[i].data[j].statusText);
                            };
                        }else{//执行预约流程
                            let time = data.map.scheduleList[i].dateFormat;
                            let timeType = data.map.scheduleList[i].data[j].timeType;
                            获取预约具体时间(time,timeType)
                        };
                    }
                    //选下午的功能从这加
                }
            }
        }
    });
};

function 获取医师信息() {
    let url = location.href;
    // unitid = url.match(/(?<=unit_id=)(.+?)(?=&)/g)[0];
    if(url.match(/(?<=deptId=)(.+?)(?=&)/g)==null){
        depid = url.match(/(?<=deptId=)[\s\S]*/g)[0];
    }else{
    depid = url.match(/(?<=deptId=)(.+?)(?=&)/g)[0];
    };
    docid = url.match(/(?<=id=)(.+?)(?=&)/g)[0];
    //获取登录状态
};

function 获取预约具体时间(time,timeType) {
    let url = "http://wx1635.cnhis.cc/wx/dept/scheduleDoctorRange.htm?employeeId="+docid+"&deptId="+depid+"&date="+time+"&timeType="+timeType+"&newVersion=true";
    $.ajax({
        type: "GET",
        url: url,
        async: false,
        dataType: "json",
        success: function (data) {
            for (let i = 0; i < data.list.length; i++) {
                if (data.list[i].sign != 1) {
                    return true;
                }else{
                    let timeRange = data.list[i].timeRange;
                    获取挂号信息(time,timeRange);
                }
            }
        }
    });
};

function 获取挂号信息(appointDate,timeRange) {
    let url = "http://wx1635.cnhis.cc/wx/user/appointment/v1/regOrder.htm?doctorId="+docid+"&deptId="+depid+"&timeRange="+timeRange+"&appointDate="+appointDate+"&registerTypeId=1&scheduleId=0";
    $.ajax({
        type: "GET",
        url: url,
        async: false,
        dataType: "json",
        success: function (data) {
            let deptName = data.map.deptName;
            let doctorName = data.map.doctorName;
            let orgName = data.map.orgName;
            let customerName = data.map.defCustomer.name;
            let customerId = data.map.defCustomer.customerId;
            if (yuyuesuccess == true) {//预约成功后停止预约
                return true;
            };
            alert(appointDate+timeRange)
           发起预约(deptName,doctorName,orgName,customerName,customerId,appointDate,timeRange);
        }
    });
};

function 发起预约(deptName,doctorName,orgName,customerName,customerId,appointDate,timeRange) {
    let url = "http://wx1635.cnhis.cc/wx/user/appointment/reg.htm";
    $.ajax({
        type: "POST",
        url: url,
        async: false,
        dataType: "json",
        data:"regtype=1&type=reg&deptId="+depid+"&deptName="+deptName+"&doctorId="+docid+"&doctorName="+doctorName+"&orgName="+orgName+"&customerName="+customerName+"&customerId="+customerId+"&appointAmount=0&appointDate="+appointDate+"&timeRange="+timeRange+"&remark=&newVersion=true&insuranceReg=0&medicalCardId=&childMedicalCardId=&scheduleId=0&insurancePromotion=false&bco01=5&paymentEcology=WECHAT-JSAPIPAY",
        success: function (data) {
            if (data.result != "Success") {
                向悬浮窗添加内容(data.resultMsg);
                return;
            } else {
                向悬浮窗添加内容("预约时间：" + data.map.tcAppointment.timeRange);
                //创建订单时间data.map.tcAppointment.createdDate
                向悬浮窗添加内容('预约成功！');
                yuyuesuccess = true;
            }
        }
    });
}

function 悬浮窗() {
    if (!document.getElementById("xfc")) {
        setTimeout(function () {
            $("body").append("<div id='xfc'onmouseover=javascript:this.style.background='#f7f9fa' onmouseout=javascript:this.style.background='#ffffff' class='is-plain' style='left: 10px;bottom: 10px;color: #000000;overflow: hidden;z-index: 9999;position: fixed;padding:10px;text-align:center;width: auto;height:auto;border-radius: 16px;background: #ffffff;box-shadow:  5px 5px 18px #b5b5b5,-5px -5px 18px #ffffff;overflow-y:auto; max-height: 400px;'>自动预约已启动<br></div>");
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
