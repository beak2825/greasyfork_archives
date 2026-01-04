// ==UserScript==
// @name         自动预约
// @namespace    12358940
// @version      1.9
// @description  自动获取就诊卡预约
// @author       You
// @match        https://weixin.91160.com/h5/register/doctor/detail.html*
// @icon         https://weixin.91160.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/446415/%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/446415/%E8%87%AA%E5%8A%A8%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==

/*全局变量对应含义
unitid：
city_id：city_id
depid：医院id
docid：医生id
userid：账号id
userkey：账号key
yuyuesuccess：预约成功？
hisMemId：就诊卡号
*/
/*全局变量start*/
var unitid, city_id, depid, docid, userid, userkey,yuyuesuccess = false,hisMemId, 日期顺序 = 0;//0为逆序，1为顺序;
/*全局变量end*/
/*初始化开始*/
setInterval(function () {
    const noticeBtn = $('.notice-button')[0];
    if (noticeBtn) {
        noticeBtn.click();//点击弹窗（我知道了）
    }
    const closeBtn = $('.close-btn.flex')[0];
    if (closeBtn) {
        closeBtn.click();//点击X（医生在14天内无可预约号源）
    }
    if (!$("#zdyy").length && $(".out-dep-box").length > 0) {
        创建自动预约();
        if (!$("#xfc").length) {
            悬浮窗();
            main();//准备工作
        }
    }
}, 500);
//创建自动预约按钮
function 创建自动预约() {
    const button = $("<a></a>").attr("id", "zdyy").css({
        "background": "#ffae1712",
        "border": "1px solid #ffae17",
        "color": "#ffae17",
        "font-weight": "700",
        "display": "inline-block",
        "padding": "0px 0.373333rem",
        "line-height": "0.906667rem",
        "height": "0.96rem",
        "border-radius": "40px",
        "box-sizing": "border-box",
        "position": "relative"
    }).html("<span>开启自动预约</span>").click(() => {
        const myVar = setInterval(() => 检查有没有号(myVar), 500);
    });
    const x = $(".out-dep-box").eq(0).parent();
    x.append(button);
}
//创建悬浮窗
function 悬浮窗() {
    if (!document.getElementById("xfc")) {
        setTimeout(function () {
            $("body").append("<div id='xfc'onmouseover=javascript:this.style.background='#f7f9fa' onmouseout=javascript:this.style.background='#ffffff' class='is-plain' style='left: 10px;bottom: 10px;color: #000000;overflow: hidden;z-index: 9999;position: fixed;padding:10px;text-align:center;width: auto;height:auto;border-radius: 16px;background: #ffffff;box-shadow:  5px 5px 18px #b5b5b5,-5px -5px 18px #ffffff;overflow-y:auto; max-height: 400px;'>自动预约已启动<br><a id='sifouyuyue'></a></div>");
        }, 0);
    }
};
/*初始化结束*/
/*准备工作开始*/
async function main() {
    await 获取医师信息();
    await 获取账号信息();
    await fetchData();//就诊卡的获取or添加
}
//获取医师信息
async function 获取医师信息() {
    const url = location.search;
    unitid = parseInt(url.match(/(?<=unit_id=)(.+?)(?=&)/g)[0]);
    depid = url.match(/(?<=dep_id=)(.+?)(?=&)/g)[0];
    docid = url.match(/(?<=doc_id=)(.+?)(?=&)/g)[0];
    //获取登录状态
};
//获取账号信息
async function 获取账号信息() {
    const url = "https://weixin.91160.com/patient_wechat/v1/user/islogined.html?code=&user_key=&cid=16";
    const data = await $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
    });
    if (data.data.status == 1) {
        city_id = data.data.city_id;
        userkey = data.data.user_info.user_key;
        userid = data.data.user_info.user_id;
        向悬浮窗添加内容(`账号：${data.data.user_info.mobile}`);
    } else {
        //转跳个人中心
        location.href = 'https://weixin.91160.com/h5/advance/account/index.html?from_function_id=INDEX_MY_000&from_function_name=%E6%88%91%E7%9A%84';
    }
};
//获取家庭成员信息，找出默认就诊人的身份信息
async function fetchData(member_id) {
    member_id = member_id || '';
    const url = `https://weixin.91160.com/bind/ajaxCreateCard.html?cid=16&user_key=${userkey}&member_id=${member_id}&unit_id=${unitid}`;
    const headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
    };
    const response = await fetch(url, {headers});
    const data = await response.json();
    if (data.state == 1) {
        if(member_id == ''){
            const guardianList = data.data.guardianList;
            const guardianList_member = guardianList.find(member => member.isDefault == 1) || guardianList[0];
            if (guardianList_member) {
                member_id = guardianList_member.member_id;
                fetchData(member_id);
                return;
            }else{
                向悬浮窗添加内容("未找到默认就诊人");
            }
        }
        let default_member = data.data.memberInfo;
        if (default_member) {
            向悬浮窗添加内容(`默认就诊人：${default_member.true_name}`);
            //取default_member的地址id组合为数组
            const arr = [default_member.province_id && default_member.province_id.length === 6 ? default_member.province_id + "000000" : default_member.province_id,
                         default_member.city_id && default_member.city_id.length === 6 ? default_member.city_id + "000000" : default_member.city_id,
                         default_member.counties_id && default_member.counties_id.length === 6 ? default_member.counties_id + "000000" : default_member.counties_id];
            const card_no = default_member.card_no;
            //添加就诊卡
            const mydata = {
                member_id: default_member.member_id,
                unit_id: unitid,
                trueName: default_member.true_name,
                counties_id: arr[2],
                origin_address: default_member.address,
                zoing_name: await idtoaddress(arr),//数组地址id在地址库中查找地址
                birthday: default_member.birthday.replace(/\//g, '-'),
                sex: default_member.sex,
                card_type: default_member.card_type,
                card_no: card_no,
                phone: default_member.true_mobile
            };
            const result = await 添加就诊卡(mydata);
            if (result.state == 1) {
                hisMemId = result.data.card_no;
                向悬浮窗添加内容(`添加就诊卡成功：${hisMemId}`);
                向悬浮窗添加内容(`准备完成，可以开始预约`);
            } else {
                console.log(result.msg);
                绑定就诊卡(member_id,card_no);
            }

        }

    }else {
        向悬浮窗添加内容("获取就诊人信息失败");
    }
};
//默认就诊人的身份信息地址是id，获取地址库从地址库中查找id进行转换
async function idtoaddress(arr) {
    const response = await fetch("https://weixin.91160.com/sys/getcityarealist.html", {
        headers: {
            accept: "application/json, text/plain, */*",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        },
        method: "GET",
    });
    const data = await response.json();
    //转换地址
    //const arr = ["440000000000","441900000000","441900000000"];
    const names = arr.map(item => data.find(city => city.norm === item)?.name).join(' ');
    return names

}
//添加就诊卡
async function 添加就诊卡(mydata) {
    const url = `https://weixin.91160.com/bind/ajaxAdd.html?cid=16&user_key=${userkey}`;
    const headers = {
        "accept": "application/json, text/plain, */*",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest"
    };
    const body = `member_id=${mydata.member_id}&unit_id=${mydata.unit_id}&true_name=${encodeURIComponent(mydata.trueName)}&counties_id=${mydata.counties_id}&origin_address=${encodeURIComponent(mydata.origin_address)}&zoing_name=${encodeURIComponent(mydata.zoing_name)}&birthday=${mydata.birthday}&sex=${mydata.sex}&card_type=${mydata.card_type}&card_no=${mydata.card_no}&phone=${mydata.phone}`;
    const method = "POST";
    const response = await fetch(url, {
        headers,
        body,
        method,
    });
    // 处理返回结果
    const result = await response.json();
    return result;
}
function 绑定就诊卡(member_id,card_no) {
    const mydata = {
        unit_id: unitid,
        member_id: member_id, // remove all quotes from member_id
        card_no: card_no,
        card_type: 3,
        user_key: userkey,
        city_id: city_id.toString() // convert city_id to a string
    };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/plain, */*',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'X-Requested-With': 'XMLHttpRequest'
        },
        referrer: 'https://weixin.91160.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: JSON.stringify(mydata),
        credentials: 'omit'
    };
    fetch(`https://wechatgate.91160.com/guahao/v1/add_card?user_key=${userkey}&cid=16`, options)
        .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
        .then(data => {
        if(data.result_code == 1){
            hisMemId = card_no;
            向悬浮窗添加内容(`添加就诊卡成功：${hisMemId}`);
            向悬浮窗添加内容(`准备完成，可以开始预约`);
        }else{
            console.log(data.error_msg);
            向悬浮窗添加内容(`添加就诊卡失败`);
        }

    })
        .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
/*准备工作结束*/
//检查有没有号
function 检查有没有号(myVar) {
    let url = `https://wechatgate.91160.com/guahao/v1/src/doctor_sch?cid=&list=[{"unit_id":${unitid},"dep_id":${depid},"doctor_id":${docid}}]`;
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

async function 获取挂号信息() {
    const url = `https://wechatgate.91160.com/guahao/v1-1/sch/union/doctor?cid=16&user_key=${userkey}&account_user_id=0&dep_id=${depid}&doctor_id=${docid}&all_point=1&page=1&select_date=&user_id=${userid}&user_key=${userkey}&unit_id=${unitid}`;
    try {
        const response = await fetch(url);
        const { data } = await response.json();
        let amScheduleId = null;
        let pmScheduleId = null;
        const scheduleList = 日期顺序 === 1 ? data.sch_list : data.sch_list.reverse();
        for (const { sch } of scheduleList) {
            if (sch && (sch.am || sch.pm)) {
                amScheduleId = sch.am?.[0]?.schedule_id || amScheduleId;
                pmScheduleId = sch.pm?.[0]?.schedule_id || pmScheduleId;
            }
            if (pmScheduleId) {
                await 获取预约具体时间(pmScheduleId);
                pmScheduleId = null;
            }
            if (amScheduleId) {
                await 获取预约具体时间(amScheduleId);
                amScheduleId = null;
            }
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function 获取预约具体时间(scheduleid) {
    let url = `https://wechatgate.91160.com/guahao/v1/src/detail?cid=16&user_key=${userkey}&unit_id=${unitid}&schedule_id=${scheduleid}&dep_id=${depid}&doctor_id=${docid}&user_key=${userkey}&src_all=1`;
    $.ajax({
        type: "GET",
        url,
        dataType: "json",
        success: function ({ data }) {//{"result_code":1,"error_code":"200","error_msg":"OK","data":{"has_first_sch":0,"FirstSch":[],"ReSch":[],"VideoSch":[],"SchList":[],"fee_cfg":{"reg_fee":1,"reg_note":"挂号费"}}}
            const { SchList } = data;
            if (SchList.length === 0) {
                //console.log("这一日没有可用的号源");
                return;
            }
            for (let { sch_time, left_num, src_id, schedule_id } of SchList) {
                if (yuyuesuccess) {
                    return true;
                }
                if (left_num > 0) {
                    const message = `${sch_time} 有 ${left_num} 个号源`;
                    console.log(message);
                    getTokenKey(src_id, schedule_id, sch_time);
                }
            }
        },
        error: function (error) {
            console.error(error);
        },
    });
}

//获取提交页面的ID
function getTokenKey(srcid, schid, schtime) {
    const url = `https://weixin.91160.com/order/confirm.html?unit_id=${unitid}&sch_id=${schid}&dep_id=${depid}&detl_id=${srcid}&isVideo=null&srcext_amt=0&from_function_id=DOC_GH_YUYUE1&from_function_name=医生主页_挂号_预约`;
    fetch(url, { method: 'GET', headers: { 'Content-type': 'application/json;charset=UTF-8' } })
        .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('getTokenKey请求失败');
        }
    })
        .then(text => {
        const tokenkey = text.match(/(?<=token_key = ")(.+?)(?=";)/g)[0];
        const 手机号 = text.match(/(?<=default_mobile = ")(.+?)(?=";)/g)[0];
        const mid = text.match(/(?<=confirm_member_id = ")(.+?)(?=")/g)[0];
        发起预约(tokenkey, 手机号, mid, schtime,hisMemId);
    })
        .catch(error => console.error(error));
}
//发起预约
async function 发起预约(tokenkey, 手机号, mid, schtime,hisMemId) {
    if (yuyuesuccess) {return true;};
    const url = `https://weixin.91160.com/order/submit.html?inteCode=%2B86&mobile=${手机号}&disease_id=&mid=${mid}&hisMemId=${hisMemId}&lng=113.709495&lat=22.971677&token_key=${tokenkey}&submit_anxin=0&accident_id=0&insurance_alias=0&setting_refresh=0&qrcode=`;
    const response = await fetch(url);
    const data = await response.json();
    const errorMessages = {
        "-1001": "下单超时",
        "-101": "需补全身份证信息并跳转完善信息页面",
        "-10": "未在线建档时弹框",
        "-501": "就诊人信息是否审核中",
        "-502": "就诊人信息是否认证中",
        "-503": "提交订单失败",
        "-701": "就诊人需实名认证后才可预约挂号",
        "-702": "支付宝城市服务下单就诊人没有身份证",
        "-600": "当天挂号就诊卡校验有误",
        "-801": "抱歉！本医院暂时仅支持使用身份证、军官证、护照挂号，请重新创建就诊人"
    };
    if (data.state != 1) {
        if (data.state in errorMessages) {
            if (data.state == -503) {
                if(data.msg.includes("重新提交订单")){
                    getTokenKey(srcid, schid, schtime);
                }else{
                    向悬浮窗添加内容(errorMessages[data.state]+"："+data.msg);
                }
            }
        } else {
            向悬浮窗添加内容(`未知错误: ${data.state}`);
        }
    }else{
        yuyuesuccess = true;
        //预约成功
        向悬浮窗添加内容(data.msg);
    }
}

//向悬浮窗添加内容
function 向悬浮窗添加内容(添加内容) {
    $("<p></p>").html(添加内容)
        .appendTo("#xfc")
        .css({
        "font-size": "16px",
        "line-height": "1.5",
        "padding": "10px 0",
        "margin": "0",
        "border-bottom": "1px solid #eee"
    });
}
//获取当前时间并返回
function 获取当前时间(格式) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    if (格式 === "时分秒") {
        return `${hour}:${minute}:${second}`;
    } else {
        return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
    }
}