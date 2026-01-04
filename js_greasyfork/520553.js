// ==UserScript==
// @name         gc
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  国创记录
// @author       amoeba
// @license      amoeba
// @match        http://111.59.8.45:8089/eform/inspect/report/toReportInput?param=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @connect      175.178.215.69
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/520553/gc.user.js
// @updateURL https://update.greasyfork.org/scripts/520553/gc.meta.js
// ==/UserScript==


let host = 'http://175.178.215.69:8833/';
//全局变量 初始获取
let appNo = '';
let workId = '';
let prono = '';//产品编号
let uninName = '';//使用单位名称
let equipmodel = '';//设备型号
let bussSortName = '';
let name = '';//安全检查检验项目名称
let names = '';///检验人员
let unitAddr= '';//使用单位地址
let unitContPers = '';//使用单位联系人
let unitContPerPhone = '';//联系人电话
let jlbh = '';//记录编号
let formattedDate = '';

function read_text(xpathId){
    var context = document.evaluate('//*[@id="' + xpathId.toString() + '"]/span', document).iterateNext().innerText;
    return context;
}
function write_text(xpathId,context){
    document.evaluate('//*[@id="' + xpathId.toString() + '"]/span', document).iterateNext().innerText = context.toString();
}
function check_box_all(xpath){
    const xpathResult = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);//符合要求打钩

    for (let i = 0; i < xpathResult.snapshotLength; i++) {
        const element = xpathResult.snapshotItem(i);
        if (element) {
            // 添加或修改属性
            element.setAttribute('checked','checked');
        }
    }
}

function local_var_update(){//更新全局变量
    console.log('初始化start');
    jlbh = read_text('16835100822722bc6');// 记录编号
    const postDataJson = JSON.stringify({
        'data': {
            'repOid': '20',
            'testType': '2000',
            'codeIn': 'record_input',
            'optType': 1,
            'pageNum': 1,
            'pageSize': 99,
            'discontinue': 0,
            'orderBy': 'report_no',
            'uninName': '',
            'equlogcode': '',
            'equlocarecod': '',
            'testStartTimes': '',
            'testEndTimes': '',
            'equipmodel': '',
            'workId': '',
            'appNo': '',
            'reportNo': '',
            'equclacode': '',
            'prono': '',
            'equcode': ''
        }
    });


    GM_xmlhttpRequest({///联系人更新
        method: "POST",
        url: "/inspect/stj/apply/record/report/selectByRecordInput",
        headers: {
            'Accept':'application/json, text/plain, */*',
            'Accept-Language':'zh-CN,zh;q=0.9',
            'Content-Type':'application/json; charset=UTF-8',

        },
        data: postDataJson,
        onload: function(response) {
            //console.log("Response received: ", response.responseText);
            var jsondata = JSON.parse(response.responseText);
            var tt = jsondata.data.rows;
            for (let i = 0; i < tt.length; i++) {
                var reportNo = tt[i].reportNo;
                if (reportNo == jlbh){//记录编号一致
                    console.log('记录编号一致');
                    console.log(reportNo);
                    /// 此部分处理联系人信息

                    uninName = tt[i].uninName;
                    bussSortName = tt[i].bussSortName;
                    name = uninName + bussSortName;
                    ///字符串 去重，倒序
                    var names_tmp = tt[i].user.name;
                    const arr = names_tmp.split(",");
                    const uniqueArr = arr.filter((item, index) => arr.indexOf(item) === index);
                    const uniqueStr = uniqueArr.join(",");
                    const reversedByComma = uniqueStr.split(",").reverse().join(",");
                    names = reversedByComma;
                    prono = tt[i].prono;
                    equipmodel = tt[i].equipmodel;
                    unitAddr= tt[i].unitAddr;
                    unitContPers = tt[i].unitContPers;
                    unitContPerPhone = tt[i].unitContPerPhone;
                    appNo = tt[i].appNo;
                    workId = tt[i].workId;
                    console.log(names);
                    console.log(uninName);
                    alert('初始化ok');

                };

            // 处理响应数据
        };
        },
        onerror: function(error) {
            console.error("Error occurred: ", error);
            // 处理错误
        }
    });


    console.log('初始化ok');
};

function contactInfo(){
    console.log('联系人信息');
    if (jlbh.startsWith("GN") && !(jlbh.startsWith("GND"))){////电站锅炉以外的 内检 处理
        write_text('1720538216279809d',unitAddr);
        write_text('172053834873615af',unitContPers);
        write_text('17205383547634bdc',unitContPerPhone);
        console.log('国创联系人信息更新ok');
        alert('国创联系人信息更新ok');
    }
    if (jlbh.startsWith("GW") && !(jlbh.startsWith("GWD"))){
        write_text('1720538216279809d',unitAddr);
        write_text('172053834873615af',unitContPers);
        write_text('17205383547634bdc',unitContPerPhone);
        console.log('国创联系人信息更新ok');
        alert('国创联系人信息更新ok');
    }

}

function date_update_auto(){

    console.log('检验日期自动更新');
    console.log(appNo);
    console.log(workId);
    const postdata = JSON.stringify({
        'data': {
            'pageNum': 1,
            'pageSize': 1000,
            'appNo': appNo,
            'workId': workId,
        }
    });
    GM_xmlhttpRequest({///检验日期更新
        method: "POST",
        url: "/inspect/stj/task/report/taskFormQuery",
        headers: {
            'Accept':'application/json, text/plain, */*',
            'Accept-Language':'zh-CN,zh;q=0.9',
            'Content-Type':'application/json; charset=UTF-8',

        },
        data: postdata,
        onload: function(response) {
            //console.log("Response received: ", response.responseText);
            var jsondata = JSON.parse(response.responseText);
            var tt = jsondata.data;
            var lastdata = jsondata.data[jsondata.data.length - 1];
            var fileName = lastdata.fileName;
            var createTime = lastdata.createTime;
            const [date, time] = createTime.split(' ');
            const [year, month, day] = date.split('-');
            formattedDate = `${year}年${month}月${day}日`;
            var next_year = '';
            var next_date = '';
            if (jlbh.startsWith("GN") && !(jlbh.startsWith("GND"))){////电站锅炉以外的 内检 处理
                console.log('GN');
                next_year = (parseInt(year) + 2).toString();
                next_date = `${next_year}年${month}月${day}日`;
                write_text('1700051123040d204',formattedDate);//检验日期 GN 首页第一个
                write_text('168174374572098dd',formattedDate);//检验日期 GN 首页第2个
                write_text('172054001707192ef',next_date);//检验日期 GN 下次检验日期
                write_text('172054021458301c6',formattedDate);//检验日期 GN 结论页1
                }
            if (jlbh.startsWith("GW") && !(jlbh.startsWith("GWD"))){
                console.log('GW');
                next_year = (parseInt(year) + 1).toString();
                next_date = `${next_year}年${month}月${day}日`;
                write_text('1700051123040d204',formattedDate);//检验日期 GW 首页第一个
                write_text('1720705409548b73e',formattedDate);//检验日期 GW 首页第2个
                write_text('17207055723960344',next_date);//检验日期 GW 下次检验日期
                write_text('17207055917752b87',formattedDate);//检验日期 GW 结论页1
                }
            if (jlbh.startsWith("GND")){////电站锅炉 内检 处理
                console.log('GND');
                next_year = (parseInt(year) + 2).toString();
                next_date = `${next_year}年${month}月${day}日`;
                //write_text('168174374572098dd',formattedDate);//检验日期 GND 首页第一个
                write_text('168351087482334fb',formattedDate);//检验日期 GND 首页第2个
                write_text('15664642068856fcc',next_date);//检验日期 GND 下次检验日期
                write_text('16757634322678f62',formattedDate);//检验日期 GND 结论页1
                }
            if (jlbh.startsWith("GWD")){////电站锅炉 外检 处理
                console.log('GWD');
                next_year = (parseInt(year) + 1).toString();
                next_date = `${next_year}年${month}月${day}日`;
                write_text('1687745354101d156',formattedDate);//检验日期 GWD 首页第一个
                write_text('16872437413607a4c',formattedDate);//检验日期 GWD 首页第2个
                write_text('168774567193005ee',formattedDate);//检验日期 GWD 参数页第1个
                write_text('16877457304685664',formattedDate);//检验日期 GWD 参数页第2个
                write_text('16872485463070e96',next_date);//检验日期 GWD 下次检验日期
                write_text('16808535346562236',formattedDate);//检验日期 GWD 结论页1
                write_text('1724826344257db81',formattedDate);//检验日期 GWD 附页1
                }

            console.log(fileName);
            if (fileName == '特种设备现场检验情况通知书'){
                try{
                    write_text('17205393808896733','未见异常。');///GN GW
                }catch{
                    write_text('16808531333911f52','未见异常。');///GWD
                }
            };
            console.log(formattedDate);

        },
        onerror: function(error) {
            console.error("Error occurred: ", error);
            // 处理错误
        }
    });

    console.log('检验日期自动更新完毕');
    alert('检验日期自动更新完毕');
};

function date_update(){
    var next_year = '';
    var next_date = '';

    if (jlbh.startsWith("GN") && !(jlbh.startsWith("GND"))){////电站锅炉以外的 内检 处理
        console.log('GN');
        formattedDate = read_text('168174374572098dd');//检验日期 GN 首页第二个
        //const [year, month, day] = formattedDate.match(/\d+/g).map(Number); //提取不包含0
        const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日/;
        const match = formattedDate.match(regex);
        const year = match[1];
        const month = match[2].padStart(2, "0");// 补齐两位
        const day = match[3].padStart(2, "0");// 补齐两位
        next_year = (parseInt(year) + 2).toString();
        next_date = `${next_year}年${month}月${day}日`;
        console.log(formattedDate);
        write_text('1700051123040d204',formattedDate);//检验日期 GN 首页第一个
        write_text('172054001707192ef',next_date);//检验日期 GN 下次检验日期
        write_text('172054021458301c6',formattedDate);//检验日期 GN 结论页1
    };
    if (jlbh.startsWith("GW") && !(jlbh.startsWith("GWD"))){////电站锅炉以外的 外检 处理
        console.log('GN');
        formattedDate = read_text('1720705409548b73e');//检验日期 GN 首页第二个
        const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日/;
        const match = formattedDate.match(regex);

        const year = match[1];
        const month = match[2].padStart(2, "0");// 补齐两位
        const day = match[3].padStart(2, "0");// 补齐两位
        next_year = (parseInt(year) + 1).toString();
        next_date = `${next_year}年${month}月${day}日`;
        console.log(formattedDate);
        write_text('17207055723960344',next_date);//检验日期 GW 下次检验日期
        write_text('17207055917752b87',formattedDate);//检验日期 GW 结论页1
    };
    if (jlbh.startsWith("GND")){////电站锅炉 内检 处理
        console.log('GND');
        formattedDate = read_text('168351087482334fb');//检验日期 GN 首页第二个
        const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日/;
        const match = formattedDate.match(regex);

        const year = match[1];
        const month = match[2].padStart(2, "0");// 补齐两位
        const day = match[3].padStart(2, "0");// 补齐两位
        next_year = (parseInt(year) + 2).toString();
        next_date = `${next_year}年${month}月${day}日`;
        //write_text('168174374572098dd',formattedDate);//检验日期 GND 首页第一个
        write_text('168351087482334fb',formattedDate);//检验日期 GND 首页第2个
        write_text('15664642068856fcc',next_date);//检验日期 GND 下次检验日期
        write_text('16757634322678f62',formattedDate);//检验日期 GND 结论页1
    }
    if (jlbh.startsWith("GWD")){////电站锅炉 外检 处理
        console.log('GWD');
        formattedDate = read_text('16872437413607a4c');//检验日期 GN 首页第二个
        const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日/;
        const match = formattedDate.match(regex);

        const year = match[1];
        const month = match[2].padStart(2, "0");// 补齐两位
        const day = match[3].padStart(2, "0");// 补齐两位
        next_year = (parseInt(year) + 1).toString();
        next_date = `${next_year}年${month}月${day}日`;
        write_text('1687745354101d156',formattedDate);//检验日期 GWD 首页第一个
        write_text('16872437413607a4c',formattedDate);//检验日期 GWD 首页第2个
        write_text('168774567193005ee',formattedDate);//检验日期 GWD 参数页第1个
        write_text('16877457304685664',formattedDate);//检验日期 GWD 参数页第2个
        write_text('16872485463070e96',next_date);//检验日期 GWD 下次检验日期
        write_text('16808535346562236',formattedDate);//检验日期 GWD 结论页1
        write_text('1724826344257db81',formattedDate);//检验日期 GWD 附页1
    }
    console.log('检验日期手动更新完毕');
    alert('检验日期手动更新完毕');
}

function safe_record(){///现场安全检查记录表
    write_text('1727431588816b257',name);
    write_text('17274316317677811',unitAddr);
    write_text('17274315929153720',formattedDate);
    write_text('172743169419856de',bussSortName);
    write_text('17274321863226749',names);///检验人员
    write_text('17274315929168304','√');
    write_text('1727431750912caa4','√');
    write_text('172743175091384f0','√');
    write_text('17274317509131c59','√');
    write_text('17274315929162382','√');//2-3内检 受限空间
    write_text('1727431592916fe26','√');
    write_text('1727431592917e26d','√');
    write_text('17274315929175503','√');
    write_text('17274315929170937','√');
    write_text('1727431592917ad36','√');///4-1 内检条件
    write_text('172743159291773dd','√');
    write_text('1727431592917c004','√');
    write_text('1727431592917a38c','√');
    write_text('1727431592917b951','√');
    write_text('17274315929184c30','√');
    write_text('1727431022340692','/');
    if (jlbh.startsWith("GW")){////电站锅炉以外的 内检 处理
        write_text('17274315929162382','-');//2-3内检 受限空间
        write_text('1727431592917ad36','-');//4-1 内检条件
        write_text('172743159291773dd','-');//4-2 内检 气体分析
    }
    write_text('172743195400673dd',formattedDate);
    write_text('172743195743900fb',formattedDate);
    check_box_all('//*[@id="1727431022340ec3"]/span/label/label[1]/input');
    console.log('safe check ok');
    alert("安全检查自动ok");
}

function history(){//历史数据更新，需后端
    console.log('历史数据更新start');
    var url = host + 'history?bgbh=' + jlbh + '&ccbh=' + prono;
    console.log(url);
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            console.log("Response:", response.responseText);
            var obj = JSON.parse(response.responseText);
            for (var key in obj) {
                var p =document.evaluate('//*[@id="' + key + '"]/span', document).iterateNext();
                try{
                    p.innerText = obj[key];
                }catch{
                    console.log("error!!!!!!!!!" + key + ": " + obj[key]);
                }
            }
        },
        onerror: function(error) {
            console.error("Error:", error);
        }
    });
    console.log('历史数据更新end');
    alert('历史数据更新end');
};

function attached(){//附页
    console.log('附页自动-start');
    var p ='';
    var tt = '报告编号:' + jlbh + '使用单位：' + uninName +'设备型号：' + equipmodel + '产品编号：' + prono + '检验日期：' + formattedDate;
    var url = host + 'data?bgbh=' + jlbh + '&sydw=' + uninName + '&sbxh=' + equipmodel + '&cpbh=' + prono + '&jyrq=' + formattedDate;
    console.log(tt);
    console.log(url);
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(response) {
            console.log("Response:", response.responseText);
            var obj = JSON.parse(response.responseText);
            for (var key in obj) {
                if (key == '1720706225151672'){
                    p =document.evaluate('//*[@id="1720706225151672"][@fieldid="48272991"]/span', document).iterateNext();
                }else
                {
                    p =document.evaluate('//*[@id="' + key + '"]/span', document).iterateNext();
                };
                try{
                    p.innerText = obj[key];
                    //console.log(key + ": " + obj[key]);
                }catch{
                    console.log("error!!!!!!!!!!!!!" + key + ": " + obj[key]);
                };
            }
        },
        onerror: function(error) {
            console.error("Error:", error);
        }
    });
    console.log('附页自动-end');
    alert('附页自动ok');

}


(function () {
    //'use strict';
    //setTimeout(local_update,10000);
    // 创建按钮容器
    const container = document.createElement('div');
    container.id = 'floatingButtonsContainer';

    // 容器样式
    container.style.position = 'fixed';
    container.style.bottom = '40px'; // 固定在右下角
    container.style.right = '20px'; // 固定在右边
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.zIndex = '9999';

    // 添加容器到页面
    document.body.appendChild(container);

    // 按钮配置
    const buttons = [
        { text: '附页自动', color: 'rgba(0, 123, 255, 0.7)', action: () => attached()},
        { text: '历史数据', color: 'rgba(40, 167, 69, 0.7)', action: () => history() },
        { text: '联系信息', color: 'rgba(255, 193, 7, 0.7)', action: () => contactInfo()},
        { text: '日期自动', color: 'rgba(23, 162, 184, 0.7)', action: () => date_update_auto() },
        { text: '日期手动', color: 'rgba(220, 53, 69, 0.7)', action: () => date_update() },
        { text: '安全自动', color: 'rgba(108, 117, 125, 0.7)', action: () => safe_record() }
    ];

    // 创建按钮
    buttons.forEach(({ text, color, action }) => {
        const button = document.createElement('button');
        button.innerText = text;

        // 按钮样式
        button.style.padding = '5px 10px'; // 缩小按钮尺寸
        button.style.backgroundColor = color;
        button.style.color = '#fff'; // 字体颜色为黑色
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 3px rgba(0, 0, 0, 0.1)'; // 阴影也相应缩小
        button.style.transition = 'all 0.2s';
        button.style.opacity = '0.8';
        button.style.margin = '0'; // 移除间距
        button.style.fontSize = '12px'; // 字体变小

        // 鼠标悬停效果
        button.onmouseover = () => {
            button.style.opacity = '1';
            button.style.transform = 'scale(1.1)'; // 放大比例调整
        };
        button.onmouseout = () => {
            button.style.opacity = '0.8';
            button.style.transform = 'scale(1)';
        };

        // 点击事件
        button.addEventListener('click', action);

        // 添加按钮到容器
        container.appendChild(button);
    });
    setTimeout(local_var_update,5000);//先初始化获取全局变量
})();

