// ==UserScript==
// @name         学习强国管理员查成绩脚本
// @namespace    https://penicillin.github.io/
// @version      4.2
// @description  点击按钮/回车直接查询昨天及排名，或按住Ctrl键点击按钮/回车查上个月的学习成绩结果。
// @author       Penicillinm
// @match        https://study.xuexi.cn/admin/index.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452848/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%AE%A1%E7%90%86%E5%91%98%E6%9F%A5%E6%88%90%E7%BB%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/452848/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%AE%A1%E7%90%86%E5%91%98%E6%9F%A5%E6%88%90%E7%BB%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

//自定义样式表;
let styleElement = document.createElement('style');
document.getElementsByTagName('head')[0].appendChild(styleElement);
styleElement.append('.mySub {font-size:11px;margin:6px 0px 0px 0px}');
styleElement.append('.copyBTM {background: rgba(24,144,255,.07);border: 1px solid rgba(24,144,255,.4);border-radius: 4px;position:absolute;left:380px;top:18px;z-Index:80;padding:6px 32px;cursor:pointer;font-Size:16px;}');
styleElement.append('.timeViewDIV {height: 8px; position: absolute; top: 0px; left: 0px; z-index: 99;}');

//流动的背景色
styleElement.append('.colorBox{border-image: linear-gradient(#F80, #2ED) 20 20;background-image:linear-gradient(90deg,rgb(247, 241, 233),rgb(228, 240, 251),rgb(226, 246, 249),rgb(247, 241, 233));background-size: 200%;animation: streamer 3s linear infinite;}');
styleElement.append('@keyframes streamer {0% {background-position: 0%;}100% {background-position: 200%;}}');

//初始化变量；
const INIT_URL = 'https://smp.xuexi.cn/api/console/init/operator';//初始化变量所要用到的网址
const ADMIN_URL = 'https://odrp.xuexi.cn/report/commonReport';//查询变量所要用到的网址
const REFRESH_URL = 'https://study.xuexi.cn/admin/index-admin.html';//保持网页存活的网址

let query_Yesterday_Flag = true;//查询方式标识(昨天或上个月)
let party_Name = '';//支部全称
let party_ID = '';//支部的ID
let disableBTM = false;//查询按钮是否可以响应用户操作。

let statDate = "";//返回结果的日期
let party_Range = 0;//排名
let party_Count = 0;//参与排名的支部数量
let party_Score_Gap = 0;//与第一名的分数差值

let refreshTime = 3;//刷新时间（分钟）

//定义查询按钮;
let copyBTM_timeOut = '';
let copyBTM = document.createElement('bottom'); //创建div标签
copyBTM.setAttribute('class', "copyBTM"); //定义标签
copyBTM.id = 'copyBTM';
copyBTM.setAttribute('data-v-8a9ac12e', '');
copyBTM.innerHTML = '点击查询';
copyBTM.attributes.class.value = (new Date()).getDate() == 1 ? 'copyBTM colorBox' : 'copyBTM';//初始化按钮样式
copyBTM.onclick = function (e) {
    copyBTM.attributes.class.value = (new Date()).getDate() == 1 ? 'copyBTM colorBox' : 'copyBTM';//更新按钮样式
    if (disableBTM) {
        console.debug('Waitting...') //上一个查询未结束，不进行响应。
    } else {
        disableBTM = true;//禁用查询按钮
        clearTimeout(copyBTM_timeOut);//移除查询按钮文字刷新计时器
        this.innerHTML = '查询中...';
        set_BTM_Text();
        copyBTM_timeOut = setTimeout(
            function () {
                copyBTM.innerHTML = '点击查询';
            }, 1000 * 60 * 5
        );//设置查询按钮刷新计时器
    };
}

//定时组件
function time_Counter(Minute, todo_intime, todo_outime) {
    let countVal = Minute * 60;
    let countdown = setInterval(
        () => {
            if (countVal > 0) {
                countVal -= 1;
                todo_intime(countVal / 60);
            } else {
                todo_outime();
                countVal = Minute * 60;
            }
        }, 1000
    )
    }

//免超时组件
let iFrame
try {
    iFrame = document.createElement('iframe');
} catch (e) {
    iFrame = document.createElement('iframe');
}
iFrame.src = REFRESH_URL;
iFrame.id = 'refreshFrame';
iFrame.style.display = 'none';
document.body.appendChild(iFrame);

let timeViewDIV = document.createElement('DIV');
timeViewDIV.id = 'timeViewDIV';
timeViewDIV.setAttribute('class', 'timeViewDIV');
document.body.appendChild(timeViewDIV);

function refshFrameFun() {
    let dateTime = new Date();
    document.title = `学习强国 ${dateTime.getHours()}:${dateTime.getMinutes()}:${dateTime.getSeconds()}`;
    copyBTM.attributes.class.value = (new Date()).getDate() == 1 ? 'copyBTM colorBox' : 'copyBTM';//更新按钮样式
    iFrame.contentWindow.location.reload();
}
function refshFrameTimeView(time) {
    let i = time / refreshTime;
    timeViewDIV.style.width = time * 100 / refreshTime + '%';//改变倒计时指示器的宽度
    timeViewDIV.style.backgroundColor = `RGB(${255 * (1 - i)},${255 * i},${255 * (Math.abs(0.5 - Math.abs(0.5 - i)) / 0.5)})`;//改变倒计时指示器的RGB
}
time_Counter(refreshTime, refshFrameTimeView, refshFrameFun);

//日期格式化组件
Date.prototype.format = function (str) {
    str = str.replace(/yyyy/i, this.getFullYear());
    str = str.replace(/MM/i, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
    str = str.replace(/dd/i, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    return str;
}

/*分数列表Array转字符串
所有的字段为：
str.push(`${index + 1}\t${value.userName}\t${(value.isActivate == 1 ? '' : '未') + '激活'}\t${value.deptNames}\t${value.rangeRealScore}\t${value.rangeScore}\t${value.totalScore}`)
*/
function fenshu_to_string(data) {
    let str = [];
    (JSON.parse(data.data_str)).dataList.data.forEach(
        (value, index) => {
            str.push(`${index + 1}\t${value.userName}\t${value.rangeScore}`)
        }
    );
    if(query_Yesterday_Flag){
        str.push(`★\t日　期\t${statDate}`);
        str.push(`★\t总排名\t${party_Range}`);
        str.push(`★\t支部数\t${party_Count}`);
        str.push(`★\t分值差\t${party_Score_Gap}`);
    }
    navigator.clipboard.writeText(str.join('\n')); //数组内容拼接写入剪贴板
};

//键盘事件(定义查询范围)
let evObj = document.createEvent('MouseEvents');
evObj.initMouseEvent('click')
function keyBoardAction(TorF) {
    try {
        query_Yesterday_Flag = TorF;
        document.getElementById('copyBTM').dispatchEvent(evObj);
    } catch (e) {
    }
}
document.onkeyup = (event) => {
    if (event.key === 'Enter') {
        keyBoardAction(!event.ctrlKey)
    }
}
document.onclick = (event) => {
    event.ctrlKey ? query_Yesterday_Flag = false : query_Yesterday_Flag = true;
}

//查询程序通用模块
let queryFetch = function (URL, bodyString, callbackFun) {
    fetch(URL, {
        "credentials": "include",
        "headers": {
            "Content-Type": "application/json;charset=utf-8",
            "Cache-Control": "no-cache"
        },
        "referrer": "https://study.xuexi.cn/",
        "body": bodyString,
        "method": "POST"
    }).then(res => res.json()).then(data => callbackFun(data));
}

//取回按钮文字
function set_BTM_Text() {
    queryFetch
    (ADMIN_URL, '{"apiCode":"955eb740","dataMap":{"orgGrayId":"' + party_ID + '"}}', queryRange);
}

//拼接单日或全月查询body字符串
function get_fenshu_guery_String() {
    let start_Day, end_Day = '';
    let today = new Date();
    if (query_Yesterday_Flag) {
        start_Day = new Date(today.setHours(-24));
        end_Day = start_Day;
    } else {
        start_Day = new Date(today.getFullYear(), today.getMonth() - 1, 1); //上个月的1号
        end_Day = new Date(today.getFullYear(), today.getMonth(), 0); //当前个月的0号即上个月的尾号
    }
    let temp_Array = [];
    let temp_Str = {};
    temp_Str.startDate = start_Day.format("yyyyMMdd");
    temp_Str.endDate = end_Day.format("yyyyMMdd");
    temp_Str.offset = 0;
    temp_Str.sort = 'totalScore';
    temp_Str.pageSize = 200;
    temp_Str.order = 'desc';
    temp_Str.isActivate = '';
    temp_Str.orgGrayId = party_ID;
    for (let i in temp_Str) {
        //temp_Array.push('"' + i + '":"' + temp_Str[i] + '"')
        temp_Array.push(`"${i}":"${temp_Str[i]}"`)
    };
    return '{"apiCode":"ab4afc14","dataMap":{' + temp_Array.join(',') + '}}';
}

//查询
function queryRange(data) {
    let copyBTM = document.getElementById('copyBTM');

    data = JSON.parse(data.data_str);
    let str = [];
    if (query_Yesterday_Flag) { //仅查昨天
        if ((data.dataList.data)[0] == undefined) {
            copyBTM.innerHTML = '暂无数据';
        } else {
            let myPaty = ((data.dataList.data).filter(e => { return e.orgName == party_Name; }))[0];//读取当前支部这行的数据
            let option = myPaty.rank == 1;//判断是否为第一名

            statDate = myPaty.statDate;
            party_Range = myPaty.rank;
            party_Count = (data.dataList.data).length;
            party_Score_Gap = (myPaty.avgScore-(data.dataList.data)[option ? 1 : 0].avgScore).toFixed(2)
            //拼接按钮字符串
            str.push(`<span class="mySub">数据日期：</span>`);
            str.push(`<span style="color:red;font-weight:bold;">${myPaty.statDate}</span>`);
            str.push(`<span class="mySub">排名：</span>`);
            str.push(`<span style="color:red;font-weight:bold;">${party_Range}</span><span class="mySub" style="color:green;">/${party_Count}</span>`);
            str.push('<span class="mySub">'
                     + (`${option ? '超越' : '距'}第${option ? '二' : '一'}名：${(data.dataList.data)[option ? 1 : 0].orgName} ${Math.abs(party_Score_Gap)} 分`
                )
                     + '</span>');
            str.push('<span class="mySub" style="color:gray;">查询结果已复制</span>');
            copyBTM.innerHTML = str.join('&nbsp;&nbsp;');
            queryFetch
            (ADMIN_URL, get_fenshu_guery_String(), fenshu_to_string); //查询所有成员的分数。
        }

    } else { //查上月
        let today = new Date();
        str.push((new Date(today.getFullYear(), today.getMonth() - 1, 1)).format('<span style="color:red;font-weight:bold;">yyyy</span><span class="mySub">&nbsp;年&nbsp;</span><span style="color:red;font-weight:bold;">mm</span><span class="mySub">&nbsp;月</span>'));
        str.push('&nbsp;<span class="mySub" style="color:gray;">查询结果已复制</span>');
        copyBTM.innerHTML = str.join('');
        queryFetch
        (ADMIN_URL, get_fenshu_guery_String(), fenshu_to_string); //查询所有成员的分数。
    }
    disableBTM = false;//启用查询按钮
}

//查询登陆帐户对应的支部名称和ID
function set_Name_and_ID(data) {
    if (data.data.id == undefined) {
        alert('无法解析接收的数据！禁用自动化查询功能。');
    } else {
        //初始化变量;
        party_Name = data.data.orgName;
        party_ID = data.data.orgGrayId;
        //加入按钮，许可操作
        if (document.getElementById('copyBTM') == null) {
            document.body.appendChild(copyBTM);
        }
    }
}
queryFetch(INIT_URL, null, set_Name_and_ID);//页面第一次下载完毕，查询支部名称和ID，初始化所有变量