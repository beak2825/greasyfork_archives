// ==UserScript==
// @name        机器人1.5.7
// @namespace   Violentmonkey Scripts
// @match       https://wd.jtexpress.com.cn/*
// @grant       none
// @version     1.5
// @author      -
// @description 2024/1/5 18:00:41
// @downloadURL https://update.greasyfork.org/scripts/488583/%E6%9C%BA%E5%99%A8%E4%BA%BA157.user.js
// @updateURL https://update.greasyfork.org/scripts/488583/%E6%9C%BA%E5%99%A8%E4%BA%BA157.meta.js
// ==/UserScript==
//***时间模块------------------------------------------------
//***时间模块------------------------------------------------

unsafeWindow.fwq = "https://www.jnsw.shop/";
var today = new Date();
function formatDate(date, time) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1; // getMonth() 返回0-11，需加1
  var d = date.getDate();

  return y + "-" + String(m).padStart(2, '0') + "-" + String(d).padStart(2, '0') + " " + time;
}
function getDateString(daysOffset, time) {
  var date = new Date(today);
  date.setDate(date.getDate() - daysOffset);
  return formatDate(date, time);
}
unsafeWindow.shijian1 = getDateString(0, "23:59:59");
unsafeWindow.shijian2 = getDateString(1, "00:00:00");
unsafeWindow.shijian3 = getDateString(2, "00:00:00");

//***-----------------------------------------------------------
unsafeWindow.announcementTemplates = {
    '签收未收': "签收未收到，麻烦提供签收凭证",
    '签收退回': "未收到，要求退回，麻烦提供签收凭证，如退回请提供换单退回新单号",
    '破损': "破损件，麻烦提供外包装完好凭证，24小时内未回复我司正常协商理赔，避免仲裁",
    '催派': "客户催件，麻烦尽快派送",
    '送货上门': "此件要求送货上门，请安排派送，避免客户投诉",
    '有发未到': "有发未到件，麻烦尽快核实派送，如遗失请及时告知协商处理，避免仲裁",
    '拦截退回': "此件退回，驿站或丰巢柜取出请及时登记问题件，避免延误仲裁",
    '疑似遗失': "长时间无物流更新，麻烦核实此件位置，48小时内无结果我将正常协商理赔，避免上报仲裁",
    '读取数据':"",
    '清楚数据':""
};
unsafeWindow.contentArray = [
    Object.keys(unsafeWindow.announcementTemplates) // 获取所有的话术模板标题
];

//机器人功能列表
unsafeWindow.jqrannmkbq = [
    ["功能模块(默认开启)", "悬浮窗（已开启）", "删除投诉工单按钮（广州代理区）", '物流复制按钮', "工单提醒"],
    ["数据模块", "打标电联", "暂放三天查询", "退转数据", "有发未到"],
    ["合肥", "早上（合肥）", "下午（合肥）", "", ""],
    ["设置", "重启机器人", "", "", ""]
];
showFloatingWindow("机器人加载中");
//***-----------------------------------------------------------
unsafeWindow.stopLoop = "0";//初始化判断循环开关；0则循环判断是否登入；1跳过登入判断
unsafeWindow.gzdlqpand = "1";//代理区模块是否执行。0不执行，1执行
unsafeWindow.xfcsfzx = "1";//悬浮窗模块是否执行。0不执行，1执行
unsafeWindow.xunhpand = "3000";//每次循环判断登入的时间，1000，为1秒
unsafeWindow.jiqirmk = "1";//机器人是否执行。0不执行，1执行
unsafeWindow.Anntih = "1";//按钮替换模块是否开启。0不执行，1执行
unsafeWindow.Gdansc = "0";//投诉工单关闭删除模块。0不执行，1执行，默认不执行
unsafeWindow.Xuanfcmk = "1";//悬浮窗物流填充模块。0不执行，1执行
unsafeWindow.Gdantix = "1";//工单检测模块。0不执行，1执行



//代码实体
function checkBenblqc() {
  //头部
unsafeWindow.userData = JSON.parse(localStorage.getItem('userData'));//获取当前登入账号的信息
  if (userData) {    //userData，获取到则代表已登入

unsafeWindow.token = localStorage.getItem('YL_TOKEN');
      showFloatingWindow("机器人加载完成");
      console.log("是否登入：已登入");
      stopLoop = 1;                                           //已登入则修改stopLoop为“1”，跳出循环

//------------------------模块区------------------------------------------------------------------------------------------
//机器人功能//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
(function(){

      console.log("机器人模:已开启")
if(jiqirmk ==="1"){
// 创建悬浮覆盖层
var overlayDiv = document.createElement('div');
overlayDiv.style.position = 'fixed';
overlayDiv.style.top = 0;
overlayDiv.style.left = 0;
overlayDiv.style.width = '100%';
overlayDiv.style.height = '100%';
overlayDiv.style.margin = '48px 0 0 0';
overlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.4)'; // 黑色背景，透明度80%
overlayDiv.style.zIndex = 2017;
  overlayDiv.style.display = 'none';
document.body.appendChild(overlayDiv);

// 在悬浮覆盖层中创建一个大小为100%宽，300px高的元素
var containerDiv = document.createElement('div');
containerDiv.style.width = '100%';
containerDiv.style.height = '0px';
containerDiv.style.backgroundColor = '#fff';
containerDiv.style.borderBottom = '15px solid #F2F2F2'; // 给容器底部添加 15px 高的灰线
overlayDiv.appendChild(containerDiv);



for (var i = 0; i < 4; i++) {
    var subContainerDiv = document.createElement('div');
    subContainerDiv.style.width = '20%';
    subContainerDiv.style.height = '100%';
    subContainerDiv.style.float = 'left';
    subContainerDiv.style.padding = '35px 20px 0 35px'; // 设置padding值

    containerDiv.appendChild(subContainerDiv);

    // 在每个子容器中创建一个 ul 元素
    var ujqrull = document.createElement('ul');
    ujqrull.id = "jqrul"+[i];

    for (var j = 1; j <= 5; j++) {
        // 在 ul 元素下添加五个 li 元素
        var li = document.createElement('li');
        li.id = ['dy', 'de', 'ds', 'dsi'][i] + j; // 基于规则设置 li 的 id
        li.style.padding = '0px 0px 20px 0px '
        li.style.fontFamily = "PingFang SC, 'Microsoft YaHei', PingHei, Arial, Helvetica, SimHei, Tahoma, Verdana, sans-serif";
        li.style.color = '#666';
        li.style.webkitTouchCallout = 'none'; // 防止长按链接与图片默认菜单
        li.style.webkitUserSelect = 'none'; // Chrome、Safari、Edge 和 Opera
        li.style.khtmlUserSelect = 'none'; // Konqueror
        li.style.MozUserSelect = 'none'; // Firefox
        li.style.msUserSelect = 'none'; // Internet Explorer
        li.style.userSelect = 'none'; // 标准语法

        // 检查是否是每组的第一个元素
        if (j === 1) {
            li.style.fontWeight = 'bold'; // 加粗
            li.style.fontSize = '18px'; // 设置字体大小
            li.style.color = "#333"
        }


        ujqrull.appendChild(li);
        ujqrull.style.display = 'none';
    }

    subContainerDiv.appendChild(ujqrull);
}

// 数组


for (var j = 0; j < 5; j++) {
    var dy = "dy" + (j+1);
    var de = "de" + (j+1);
    var ds = "ds" + (j+1);
    var dsi = "dsi" + (j+1);

    document.getElementById(dy).textContent = jqrannmkbq[0][j];
    document.getElementById(de).textContent = jqrannmkbq[1][j];
    document.getElementById(ds).textContent = jqrannmkbq[2][j];
    document.getElementById(dsi).textContent = jqrannmkbq[3][j];
      if (dy === "dy2"||dy === "dy4"||dy === "dy5") {
        document.getElementById(dy).style.color = "red";
    }
}

//数组
//



    // 获取目标元素
    var targetElement = document.getElementById('tab-dataCenterIndex');

    if (targetElement) {
        // 深度复制目标元素及其所有子元素
        var duplicateElement = targetElement.cloneNode(true);

        // 修改复制元素的ID
        duplicateElement.id = 'jqrcj';
        duplicateElement.style.webkitTouchCallout = 'none'; // 防止长按链接与图片默认菜单
        duplicateElement.style.webkitUserSelect = 'none'; // Chrome、Safari、Edge 和 Opera
        duplicateElement.style.khtmlUserSelect = 'none'; // Konqueror
        duplicateElement.style.MozUserSelect = 'none'; // Firefox
        duplicateElement.style.msUserSelect = 'none'; // Internet Explorer
        duplicateElement.style.userSelect = 'none'; // 标准语法

        // 递归遍历并修改复制元素以及其所有子元素的显示内容
        function modifyDisplayContent(element) {
            if (element.childNodes.length === 0) {
                // 如果是叶子节点，则直接修改显示内容
                if (element.nodeType === Node.TEXT_NODE) {
                    // 只修改文本节点的内容
                    element.textContent = '机器人';
                }
            } else {
                // 否则递归遍历子节点并修改显示内容
                for (var i = 0; i < element.childNodes.length; i++) {
                    modifyDisplayContent(element.childNodes[i]);
                }
            }
        }
        modifyDisplayContent(duplicateElement);

        // 将修改后的元素插入到目标元素后面
        targetElement.parentNode.insertBefore(duplicateElement, targetElement.nextSibling);
    }
(function() {
    var targetElement = document.querySelector('.el-tabs__nav-scroll'); // 获取目标元素
    if (targetElement) {

var redLayoutDiv = document.createElement('div');
redLayoutDiv.id= "GdanTix";
redLayoutDiv.style.float = 'left';
redLayoutDiv.style.width = '140px';
redLayoutDiv.style.height = '48px';
redLayoutDiv.style.display = 'flex'; // 添加Flex布局
redLayoutDiv.style.flexDirection = 'column'; // 设置flex-direction为column

var greenLayoutDiv = document.createElement('div');
greenLayoutDiv.id= "DiaoDu";
greenLayoutDiv.style.float = 'left';
greenLayoutDiv.style.width = '140px';
greenLayoutDiv.style.height = '48px';
greenLayoutDiv.style.display = 'flex'; // 添加Flex布局
greenLayoutDiv.style.flexDirection = 'column'; // 设置flex-direction为column

var containerDiv = document.createElement('div');
containerDiv.style.float = 'right';
containerDiv.appendChild(redLayoutDiv);
containerDiv.appendChild(greenLayoutDiv);

var redLi1 = document.createElement('b');
redLi1.style.color = 'white';
redLi1.classList.add('list-item'); // 添加共同的类名
redLi1.style.paddingLeft = '5px';
redLi1.id = "putonggdan";
redLi1.style.display = "none";
redLi1.style.fontSize = '15px';
redLi1.style.textAlign = 'center';
redLi1.style.margin = 'auto'; // 使元素在纵轴方向上居中
redLayoutDiv.appendChild(redLi1);

var redLi2 = document.createElement('b');
redLi2.style.color = 'white';
redLi2.classList.add('list-item'); // 添加共同的类名
redLi2.style.paddingLeft = '5px';
redLi2.id = "diaodunr";
redLi2.style.display = "none";
redLi2.style.fontSize = '15px';
redLi2.style.textAlign = 'center';
redLi2.style.margin = 'auto'; // 使元素在纵轴方向上居中
greenLayoutDiv.appendChild(redLi2);

        // 将容器 div 插入到目标元素下的第一个 div 内部
        var targetDiv = targetElement.querySelector('div'); // 获取目标元素下的第一个 div
        if (targetDiv) {
            targetDiv.appendChild(containerDiv);
        }
    }
})();


//菜单台点击代码结尾//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

document.getElementById('jqrcj').addEventListener('click', function(event) {
  var jqr = document.getElementById('jqrcj');
  var span = jqr.querySelector('span');
  span.style.color = "#e60012";
  overlayDiv.style.display = 'block';
  var jqrul = document.getElementById("jqrul");
containerDiv.style.transition = 'height 0.3s'; // 添加过渡效果，设置过渡时间为1秒

// 在下一帧中修改样式属性，以触发动画效果
setTimeout(function() {
    containerDiv.style.height = '250px'; // 修改为最终的height值
    setTimeout(function() {
     for (var i = 0; i <= 3; i++) {
  var jqrul = document.getElementById("jqrul" + i);
  if (jqrul) {
    jqrul.style.display = "block";
  }
}
    }, 250); // 延迟1秒执行
}, 0);

  event.stopPropagation(); // 阻止事件冒泡
});
// 当点击除 containerDiv 以外的其他地方时隐藏 overlayDiv
document.addEventListener('click', function(event) {
  var jqr = document.getElementById('jqrcj');
  var span = jqr.querySelector('span');
  span.style.color = "#FFFFFF";
    if (event.target !== document.getElementById('jqrcj') && !containerDiv.contains(event.target)) {
      var jqrul = document.getElementById("jqrul");
        overlayDiv.style.display = 'none';
        containerDiv.style.height = '0px';
           for (var i = 0; i <= 3; i++) {
  var jqrul = document.getElementById("jqrul" + i);
  if (jqrul) {
    jqrul.style.display = "none";
  }
}
    }
});
}})();

//菜单按钮  //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
(function(){
//打标电联 //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.getElementById('de2').addEventListener('click', function() {
const inputBox2 = document.getElementById('srk');
inputBox2.value = "正在获取打标电联数据，稍等。。。。。";
const xfctz = document.getElementById('xfc');
xfctz.style.width = '100%';
xfctz.style.height = '100%';
xfctz.style.position = 'fixed';
xfctz.style.left = '0';
xfctz.style.top = '0';
xfctz.style.transform = 'translate(0, 0)';

console.log(shijian2)
// 获取 'networkCode' 的内容
const networkCode = userData.networkCode;
  const url = "https://wdgw.jtexpress.com.cn/wdccmorderweb/omsPerformanceStat/getPages";
  const data = {
    endDate: shijian1,
    networkCode: networkCode,
    size: 900,
    startDate: shijian2,
    timeType: "2",
    countryId:"1",
    waybillNos: [],
    whetherToReturn: "0"
  };
  const token = localStorage.getItem('YL_TOKEN'); // 获取令牌的内容




  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "authToken": token, // 将令牌赋值给authToken
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    console.log(result)
var dabiao = result.data.total;
var targetArray = [];
for (var i = 0; i < dabiao; i++) {
  if (result.data.records[i].isContact == 0 || result.data.records[i].isContact == null) {
    var waybillNo = result.data.records[i].waybillNo;
    var receiverPhone = result.data.records[i].receiverPhone;
    var deliveryStaffName = result.data.records[i].deliveryStaffName;

    if (deliveryStaffName !== null) {
      // 将不为null的数据添加到新数组中
      var newData = {
        waybillNo: waybillNo,
        receiverPhone: receiverPhone,
        deliveryStaffName: deliveryStaffName
      };
      // 将新数据添加到目标数组
      targetArray.push(newData);
    }
  }
}

// 对目标数组按照 deliveryStaffName 进行冒泡排序
for (var i = 0; i < targetArray.length - 1; i++) {
  for (var j = 0; j < targetArray.length - 1 - i; j++) {
    if (targetArray[j].deliveryStaffName > targetArray[j + 1].deliveryStaffName) {
      var temp = targetArray[j];
      targetArray[j] = targetArray[j + 1];
      targetArray[j + 1] = temp;
    }
  }
}

var groupedData = {};

// 将数据按照deliveryStaffName进行分组
for (var i = 0; i < targetArray.length; i++) {
  var deliveryStaffName = targetArray[i].deliveryStaffName;
  var group = groupedData[deliveryStaffName];

  // 如果分组不存在，则创建一个新数组作为分组
  if (!group) {
    group = [];
    groupedData[deliveryStaffName] = group;
  }

  // 将数据添加到相应的分组中
  group.push(targetArray[i]);
}

// 合并所有分组并打印出来
var combinedData = '';

for (var key in groupedData) {
  var group = groupedData[key];

  // 排序分组内的数据
  group.sort(function(a, b) {
    return a.waybillNo.localeCompare(b.waybillNo);
  });

  // 添加分组头部信息
  combinedData +=  key+"\n";

  // 打印分组内的数据
  for (var i = 0; i < group.length; i++) {
    combinedData +=  group[i].waybillNo + "--" + group[i].receiverPhone + "\n";
  }

  // 添加分组尾部提示语句
  combinedData += "今日打标电联件，请在派送入库或签收前电联客户，避免罚款产生哦~\n\n";
}

// 判定combinedData是否为空白
if (combinedData.trim() === '') {
  inputBox2.value = "暂无未履约单号";
} else {
  inputBox2.value = combinedData;
}
  })
  .catch(error => console.error(error));
});

//打开悬浮窗 //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.getElementById('dy2').addEventListener('click', function() {
  var dy2Element = document.getElementById('dy2');
  var dy2ElementContent = dy2Element.textContent;
      dy2Element.style.color = "red";
  if (dy2ElementContent === '悬浮窗（已关闭）') {
    // 执行"悬浮窗已关闭"代码
     document.getElementById('xfc').style.display = 'block';
    dy2Element.style.color = "red";
    dy2Element.textContent = '悬浮窗（已开启）';
  } else if (dy2ElementContent === '悬浮窗（已开启）') {
    dy2Element.style.color = "#666";
    document.getElementById('xfc').style.display = 'none';
    // 将dy2的名字改为"悬浮窗（已关闭）"
    dy2Element.textContent = '悬浮窗（已关闭）';
  }

});

//暂放三天问题件
document.getElementById('de3').addEventListener('click', function() {
const inputBox2 = document.getElementById('srk');
fangda("正在获取今日暂放三天数据。。。。");
  fetch('https://wdgw.jtexpress.com.cn/servicequality/problemPiece/registrationPage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'authToken': token
  },
  body: JSON.stringify({
      countryId: "1",
      current: 1,
      endTime: shijian1,
      lastReplyTimeEnd: "",
      lastReplyTimeStart: "",
      size: 200,
      startTime: shijian2,
      statusList: [3],
      0: 3,
      waybillType: "1"
  })
})
.then(response => response.json())
.then(data => {
    console.log(data);
    let count = "";
    data.data.records.forEach(record => {
        if (record.receiveContent.includes("暂放3天")) {
            count = count + record.waybillNo + "\n";
        }
    });
    if (count.length > 0) {
        var jiehe = "====以下为" + shijian2 + "到" + shijian1 + "始发网点要求暂放三天问题件请通知====\n\n" + count;
        inputBox2.value = jiehe;
    } else {
        inputBox2.value = "====今天无回复暂放三天问题件回复====";
    }
})

});

//按钮替换模块
document.getElementById('dy4').addEventListener('click', function() {
  var dy2Es = document.getElementById('dy4');
  if (Anntih === "1") {
    Anntih = "0";
    dy2Es.style.color = 'rgb(102, 102, 102)';
    showFloatingWindow("物流复制按钮已关闭，请重新点击查询");
  } else {
    Anntih = "1";
    dy2Es.style.color = 'red';
    showFloatingWindow("物流复制按钮已开启");
  }
});

//退转数据
document.getElementById('de4').addEventListener('click', function() {

fangda("正在获取今日退转数据。。。。");
const networkCode = userData.networkCode;
const inputBox2 = document.getElementById('srk');
fetch('https://wdgw.jtexpress.com.cn/ops/wdbutler/interceptRewindMonitory/detailsPageList', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'authToken': token
  },
  body: JSON.stringify({
      countryId: "1",
      current: 1,
      endTime: shijian1,
      isSummaryToDetailsPage: false,
      queryType: 1,
      siteCode: networkCode,
      size: 200,
      startTime: getDateString(0,"00:00:00" ),
  })
})
.then(response => {
  if (response.ok) {
    return response.json(); // 返回JSON格式的响应数据
  } else {
    throw new Error('Post 请求失败'); // 抛出异常
  }
})
.then(data => {
  let allBillcodes = "";
  for (let i = 0; i < data.data.total; i++) {
      const billcode = data.data.records[i].billcode;
      allBillcodes += billcode + "\n";
  }
//https://wdgw.jtexpress.com.cn/ops/wdbutler/order/getOrderDetail
  // 将整合后的数据显示在inputBox2中
  inputBox2.value = "====以下为今日退转数据====\n" + allBillcodes;
})
});

//有发未到
document.getElementById('de5').addEventListener('click', function(){
fangda("正在获取昨日有发未到。。。。");
const inputBox2 = document.getElementById('srk');
fetch('https://wdgw.jtexpress.com.cn/servicedocumentary/inBoundDetail/queryDetailPage', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'authToken': token
  },
  body: JSON.stringify({
    agentCode: userData.financialCenterCode,
    countryId: "1",
    current: 1,
    endTime: getDateString(1, "23:59:59"),
    franchiseeCode:userData.franchiseeCode,
    importType: 2,
    networkCode: userData.networkCode,
    size: 200,
    startTime: getDateString(1,"00:00:00" )
  })
})
.then(response => {
  if (response.ok) {
    return response.json(); // 返回JSON格式的响应数据
  } else {
    throw new Error('Post 请求失败'); // 抛出异常
  }
})
.then(data => {
    if(data.data.records.length === 0) {
        inputBox2.value = "====昨日无发未到数据，请放心！====";
    } else {
        let output = "====以下为昨日有发未到数据，请通知业务员核实====\n";
        for(let i = 0; i < data.data.records.length; i++) {
            const record = data.data.records[i];
            output += "\n单号：" + record.billCode + "\n收件地址：" + record.receiverAddress+"\n此件有发未到，麻烦尽快核实是否到件\n";
        }
        inputBox2.value = output;
    }
})
});


document.getElementById('ds2').addEventListener('click', function(){
  fangda("正在获取昨天12点之后到今天6点之前的有发未到数据。。。。");
// 定义一个函数来处理请求和输出结果
let allBillCodes = []; // 将数组放在外部，以便在多次调用时累积数据
const fetchDataAndProcess = (current, numOfPages) => {
  fetch('https://wdgw.jtexpress.com.cn/servicedocumentary/inBoundDetail/queryDetailPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'authToken': token
    },
    body: JSON.stringify({
      agentCode: userData.financialCenterCode,
      countryId: "1",
      current: current,
      endTime: getDateString(0, "06:00:00"),
      franchiseeCode: userData.franchiseeCode,
      importType: 2,
      networkCode: userData.networkCode,
      size: 200,
      startTime: getDateString(1, "12:00:00")
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Post 请求失败');
    }
  })
  .then(data => {
      // 添加当前页的记录到allBillCodes，并在每个条目后添加换行符
      data.data.records.forEach(record => {
        allBillCodes.push(record.billCode + "\n");
      });

      // 如果有设置numOfPages，并且当前页未达到总页数，那么继续获取下一页数据
      if (numOfPages && current < numOfPages) {
        fetchDataAndProcess(current + 1, numOfPages);
      } else if (!numOfPages && current < data.data.pages) {
        // 如果这是第一次调用（没有设置numOfPages），并且不止一页
        fetchDataAndProcess(current + 1, data.data.pages);
      } else if (current === numOfPages || current === data.data.pages) {
        // 当到达最后一页时，输出所有的billCode数据
        const inputBox2 = document.getElementById('srk');
        // 使用join('')将数组元素合并为一个字符串
        inputBox2.value = "====已获取到有发未到的数据，请复制批量登记====\n" + allBillCodes.join('');
      }
    })
  .catch(error => {
    console.error('请求处理过程中出错：', error);
  });
};

// 调用函数开始处理数据
fetchDataAndProcess(1);
});

document.getElementById('ds3').addEventListener('click', function(){
  fangda("正在获取昨天12点之后到今天6点之前的有发未到数据。。。。");
// 定义一个函数来处理请求和输出结果
let allBillCodes = []; // 将数组放在外部，以便在多次调用时累积数据
const fetchDataAndProcess = (current, numOfPages) => {
  fetch('https://wdgw.jtexpress.com.cn/servicedocumentary/inBoundDetail/queryDetailPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'authToken': token
    },
    body: JSON.stringify({
      agentCode: userData.financialCenterCode,
      countryId: "1",
      current: current,
      endTime: getDateString(0, "15:05:00"),
      franchiseeCode: userData.franchiseeCode,
      importType: 2,
      networkCode: userData.networkCode,
      size: 200,
      startTime: getDateString(0, "06:00:00")
    })
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Post 请求失败');
    }
  })
  .then(data => {
      // 添加当前页的记录到allBillCodes，并在每个条目后添加换行符
      data.data.records.forEach(record => {
        allBillCodes.push(record.billCode + "\n");
      });

      // 如果有设置numOfPages，并且当前页未达到总页数，那么继续获取下一页数据
      if (numOfPages && current < numOfPages) {
        fetchDataAndProcess(current + 1, numOfPages);
      } else if (!numOfPages && current < data.data.pages) {
        // 如果这是第一次调用（没有设置numOfPages），并且不止一页
        fetchDataAndProcess(current + 1, data.data.pages);
      } else if (current === numOfPages || current === data.data.pages) {
        // 当到达最后一页时，输出所有的billCode数据
        const inputBox2 = document.getElementById('srk');
        // 使用join('')将数组元素合并为一个字符串
        inputBox2.value = "====已获取到有发未到的数据，请复制批量登记====\n" + allBillCodes.join('');
      }
    })
  .catch(error => {
    console.error('请求处理过程中出错：', error);
  });
};

// 调用函数开始处理数据
fetchDataAndProcess(1);

});
document.getElementById('dsi2').addEventListener('click', function(){
  showFloatingWindow("正在重启");
  location.reload();
});

//调度提醒按钮
document.getElementById('DiaoDu').addEventListener('click', function(){
fangda("正在获取调度信息。。。。。。");
  const inputBox2 = document.getElementById('srk');
const part1 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"current\"\r\n\r\n1\r\n";
const part2 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"size\"\r\n\r\n200\r\n";
const part3 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"startInputTime\"\r\n\r\n"+shijian3+"\r\n";
const part4 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"endInputTime\"\r\n\r\n"+shijian1+"\r\n";
const part5 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"orderStatusCodeStr\"\r\n\r\n101\r\n";
const part6 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"inputTime\"\r\n\r\n"+shijian3+","+shijian1+"\r\n";
const endPart = "------WebKitFormBoundarymBnGZzLGVEyua2tr--\r\n";
const requestData = part1 + part2 + part3 + part4 + part5 + part6 + endPart;
    fetch("https://wdgw.jtexpress.com.cn/wdccmorderweb/omsOrderDispatch/page", {
        method: "POST",
        headers: {
            "authtoken":token ,
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundarymBnGZzLGVEyua2tr",
        },
        referrer: "https://wd.jtexpress.com.cn/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: requestData,
        mode: "cors",
        credentials: "omit"
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data.data.records.length === 0) {
            inputBox2.value = "无未调度订单，请放心！";
        } else {
            let output = "====以下调度，已调度网点，尽快通知业务员处理====";
            data.data.records.forEach(record => {
                let info ="\n"+"订单编号："+ `${record.id}`+"\n";
                info +="调度时间："+`${record.dispatchNetworkTime}`+"\n";
                info +="调度来源："+`${record.orderSourceName}`+"\n";
                info +="客户名字："+`${record.senderName}`+"\n";
                info +="客户号码："+`${record.senderMobilePhone}`+"\n";
                info +="客户地址："+`${record.senderCityName}`;
                info += `${record.senderDetailedAddress}`+"\n\n调度已分配，尽快预约，避免超时哦~";
                output += "\n" + info;
            });
            inputBox2.value = output;
        }
    })
    .catch(error => {
        console.error('Error:', error); // 捕获异常并输出错误信息
    });
});
})();

//代理区判断模块-----------------------------------------------------------------------------------------------------------
(function(){
    if(gzdlqpand==="1"){
      console.log("代理区判断模块:已开启")
    const benblqc = userData.financialCenterDesc;               //获取登入的账号信息，判断是不是广州代理区
    if(benblqc==="广州代理区"){
      if(jiqirmk==="1"){
      const dy3Element = document.getElementById("dy3");        // 获取机器人列表里的"dy3"
      dy3Element.style.color = "red";                           //改字体颜色为红色
        Gdansc = "1"
        console.log("检测到广州代理区，投诉工单按钮已删除")
        }
      }else{
        console.log("当前网点代理区:"+benblqc)
      }
    }
  })();

//悬浮窗模块---------------------------------------------------------------------------------------------------------------
(function(){
    if(xfcsfzx==="1"){
      console.log("悬浮窗模块已开启")
      var previousContent = "";
(function() {
  const floatingBox = document.createElement('div');
  floatingBox.style.position = 'fixed';
  floatingBox.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
  floatingBox.style.borderRadius = '10px';
  floatingBox.style.border = '3px solid #e60012';
  floatingBox.style.zIndex = '9999';
  floatingBox.style.width = '250px';
  floatingBox.style.height = '450px';
  floatingBox.style.right = '10px';
  floatingBox.style.bottom = '10px';
  floatingBox.id = "xfc";
  const inputBox = document.createElement('textarea');
  inputBox.style.width = '100%';
  inputBox.style.height = '86%';
  inputBox.style.border = 'none';
  inputBox.style.boxSizing = 'border-box';
  inputBox.style.padding = '10px';
  inputBox.style.resize = 'none';
  inputBox.style.overflowY = 'auto';
  inputBox.style.textAlign = 'left';
  inputBox.style.verticalAlign = 'top';
  inputBox.style.fontSize = '18px';
  inputBox.id = 'srk';
  const buttonWrapper = document.createElement('div');
  buttonWrapper.style.height = '33px';

  const button = document.createElement('button');
  button.textContent = '复制内容';
  button.style.width = '100%';
  button.style.height = '100%';
  button.style.boxSizing = 'border-box';
  button.style.backgroundColor = '#e60012';
  button.style.border = 'none';
  button.style.id = 'fz'

  const resizeHandle = document.createElement('div');
  resizeHandle.style.position = 'absolute';
  resizeHandle.style.right = '0';
  resizeHandle.style.bottom = '0';
  resizeHandle.style.width = '10px';
  resizeHandle.style.height = '10px';
  resizeHandle.style.backgroundColor = '#e60012';
  resizeHandle.style.cursor = 'nwse-resize';

  const moveHandle = document.createElement('div');
  moveHandle.style.width = '100%';
  moveHandle.style.height = '30px';
  moveHandle.style.backgroundColor = '#e60012';
  moveHandle.style.cursor = 'move';
  moveHandle.style.borderRadius = '10px 10px 0 0';

  // 创建开关
const switchElement = document.createElement('input');
switchElement.type = 'checkbox';
switchElement.id = 'switch';
switchElement.style.position = 'absolute';
switchElement.style.top = '5px';
switchElement.style.right = '10px';
switchElement.style.width = '30px';
switchElement.style.height = '20px';
switchElement.style.borderRadius = '10px'; // 将边角半径改为圆形，可以根据需要调整数值
switchElement.style.border = '1px solid #ccc';
switchElement.style.background = '#fff';
switchElement.style.appearance = 'none'; // 禁用浏览器默认样式
switchElement.style.webkitAppearance = 'none';
switchElement.style.mozAppearance = 'none';
switchElement.style.outline = 'none'; // 移除默认的聚焦边框
// 添加开关到浮动窗口
floatingBox.appendChild(switchElement);

// 添加浮动窗口到页面
document.body.appendChild(floatingBox);

// 创建外部按钮容器
const buttonContainer = document.createElement('div');
buttonContainer.style.display = 'flex';
buttonContainer.style.flexDirection = 'column';
buttonContainer.style.position = 'absolute';
buttonContainer.style.right = '-83px';
buttonContainer.style.top = '50%';
buttonContainer.style.transform = 'translateY(-50%)';

// 创建7个外部按钮
for (let i = 0; i < 10; i++) {
  const button = document.createElement('button');
  button.textContent = contentArray[0][i]; // 设置按钮文本为contentArray中的值
  button.id = 'lyb' + i;
  button.style.width = '80px';
  button.style.height = '30px';
  button.style.backgroundColor = '#e60012';
  button.style.marginBottom = '10px';
  button.style.color = 'white';
  button.style.border = '0';

  button.addEventListener('click', (event) => {
    const clickedButton = event.target; // 获取被点击的按钮元素
    const buttonId = clickedButton.id; // 获取按钮的id
    const buttonText = clickedButton.textContent; // 获取按钮的文本内容

    let inputBox = document.getElementById('srk');
    let inputValue = inputBox.value;
    let dataBetweenMarkers = inputValue.match(/单号：(.*?)地址：/s);

    switch (buttonId) {

    case 'lyb0':
      if (dataBetweenMarkers) {
        const dataValue = dataBetweenMarkers[1].trim();
        const jtu = localStorage.getItem('myData0');// 获取本地存储的数据
        if (jtu === null || jtu === undefined || jtu === "") {
          const updatedData = "签收未收到"+ "\n" + dataValue;
          localStorage.setItem('myData0', updatedData);
        } else {
          const updatedData = jtu +"\n" + dataValue ;
          localStorage.setItem('myData0', updatedData);
        }
      }
      inputBox.value = inputValue + announcementTemplates['签收未收'];
      inputBox.select(); // 选中输入框内容
      navigator.clipboard.writeText(inputBox.value);
      showFloatingWindow("已复制悬浮窗内容");
      break;
      case 'lyb1':
      if (dataBetweenMarkers) {
        const dataValue = dataBetweenMarkers[1].trim();
        const jtu = localStorage.getItem('myData1');// 获取本地存储的数据
        if (jtu === null || jtu === undefined || jtu === "") {
          const updatedData = "签收退回"+ "\n" + dataValue;
          localStorage.setItem('myData1', updatedData);
        } else {
          const updatedData = jtu +"\n" + dataValue ;
          localStorage.setItem('myData1', updatedData);
        }
      }
      inputBox.value = inputValue + announcementTemplates['签收退回'];
      inputBox.select(); // 选中输入框内容
      navigator.clipboard.writeText(inputBox.value);
      showFloatingWindow("已复制悬浮窗内容");
      break;
      case 'lyb2':
      if (dataBetweenMarkers) {
        const dataValue = dataBetweenMarkers[1].trim();
        const jtu = localStorage.getItem('myData2');// 获取本地存储的数据
        if (jtu === null || jtu === undefined || jtu === "") {
          const updatedData = "破损"+ "\n" + dataValue;
          localStorage.setItem('myData2', updatedData);
        } else {
          const updatedData = jtu +"\n" + dataValue ;
          localStorage.setItem('myData2', updatedData);
        }
      }
      inputBox.value = inputValue + announcementTemplates['破损'];
      inputBox.select(); // 选中输入框内容
      navigator.clipboard.writeText(inputBox.value);
      showFloatingWindow("已复制悬浮窗内容");
      break;
      case 'lyb3':
      if (dataBetweenMarkers) {
        const dataValue = dataBetweenMarkers[1].trim();
        const jtu = localStorage.getItem('myData3');// 获取本地存储的数据
        if (jtu === null || jtu === undefined || jtu === "") {
          const updatedData = "催派"+ "\n" + dataValue;
          localStorage.setItem('myData3', updatedData);
        } else {
          const updatedData = jtu +"\n" + dataValue ;
          localStorage.setItem('myData3', updatedData);
        }
      }
      inputBox.value = inputValue + announcementTemplates['催派'];
      inputBox.select(); // 选中输入框内容
      navigator.clipboard.writeText(inputBox.value);
      showFloatingWindow("已复制悬浮窗内容");
      break;
      case 'lyb4':
      if (dataBetweenMarkers) {
        const dataValue = dataBetweenMarkers[1].trim();
        const jtu = localStorage.getItem('myData4');// 获取本地存储的数据
        if (jtu === null || jtu === undefined || jtu === "") {
          const updatedData = "到无物流"+ "\n" + dataValue;
          localStorage.setItem('myData4', updatedData);
        } else {
          const updatedData = jtu +"\n" + dataValue ;
          localStorage.setItem('myData4', updatedData);
        }
      }
      inputBox.value = inputValue + announcementTemplates['送货上门'];
      inputBox.select(); // 选中输入框内容
      navigator.clipboard.writeText(inputBox.value);
      showFloatingWindow("已复制悬浮窗内容");
      break;
      case 'lyb5':
      if (dataBetweenMarkers) {
        const dataValue = dataBetweenMarkers[1].trim();
        const jtu = localStorage.getItem('myData5');// 获取本地存储的数据
        if (jtu === null || jtu === undefined || jtu === "") {
          const updatedData = "有发未到"+ "\n" + dataValue;
          localStorage.setItem('myData5', updatedData);
        } else {
          const updatedData = jtu +"\n" + dataValue ;
          localStorage.setItem('myData5', updatedData);
        }
      }
      inputBox.value = inputValue + announcementTemplates['有发未到'];
      inputBox.select(); // 选中输入框内容
      navigator.clipboard.writeText(inputBox.value);
      showFloatingWindow("已复制悬浮窗内容");
      break;
      case 'lyb6':
      if (dataBetweenMarkers) {
        const dataValue = dataBetweenMarkers[1].trim();
        const jtu = localStorage.getItem('myData6');// 获取本地存储的数据
        if (jtu === null || jtu === undefined || jtu === "") {
          const updatedData = "拦截退回"+ "\n" + dataValue;
          localStorage.setItem('myData6', updatedData);
        } else {
          const updatedData = jtu +"\n" + dataValue ;
          localStorage.setItem('myData6', updatedData);
        }
      }
      inputBox.value = inputValue + announcementTemplates['拦截退回'];
      inputBox.select(); // 选中输入框内容
      navigator.clipboard.writeText(inputBox.value);
      showFloatingWindow("已复制悬浮窗内容");
      break;

    case 'lyb7':
      if (dataBetweenMarkers) {
        const dataValue = dataBetweenMarkers[1].trim();
        const jtu = localStorage.getItem('myData7');// 获取本地存储的数据
        if (jtu === null || jtu === undefined || jtu === "") {
          const updatedData = "疑似遗失"+ "\n" + dataValue;
          localStorage.setItem('myData7', updatedData);
        } else {
          const updatedData = jtu +"\n" + dataValue ;
          localStorage.setItem('myData7', updatedData);
        }
      }
      inputBox.value = inputValue + announcementTemplates['疑似遗失'];
      inputBox.select(); // 选中输入框内容
      navigator.clipboard.writeText(inputBox.value);
      showFloatingWindow("已复制悬浮窗内容");
      break;

      case 'lyb8':
        let sum = "";
        let result = "";
        for (let i = 0; i <= 7; i++) {
          const data = localStorage.getItem(`myData${i}`);
          if (data !== null && data !== "") {
            sum += data;
            result += data + "\n";
          }
        }
        inputBox.value = result;
        showFloatingWindow("读取成功");
        break;
      case 'lyb9':
        for (let i = 0; i <= 7; i++) {
          localStorage.removeItem(`myData${i}`);
        }
        showFloatingWindow("清除数据成功");
        inputBox.value = "";
        break;
    }
  });

  buttonContainer.style.display = 'none'; // 隐藏buttonContainer按钮
  buttonContainer.appendChild(button);
}

// 将外部按钮容器插入到浮动框容器中
floatingBox.appendChild(buttonContainer);
// 将浮动框容器添加到页面中
document.body.appendChild(floatingBox);
  // 添加开关事件监听器
// 添加开关事件监听器
switchElement.addEventListener('click', function() {
    // 在开关状态改变时执行相应操作
    if (switchElement.checked) {
        buttonContainer.style.display = 'flex'; // 显示buttonContainer按钮
      switchElement.style.background = '#4E6EF2';
    } else {
        buttonContainer.style.display = 'none';
      switchElement.style.background = '#fff';
    }
});


  inputBox.addEventListener('focus', function() {
    inputBox.style.outline = 'none';
  });


  resizeHandle.addEventListener('mousedown', function(e) {

    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = floatingBox.clientWidth;
    const startHeight = floatingBox.clientHeight;

    document.addEventListener('mousemove', resizeHandler);
    document.addEventListener('mouseup', stopResize);

    function resizeHandler(e) {
      const newWidth = startWidth + (e.clientX - startX);
      const newHeight = startHeight + (e.clientY - startY);

      floatingBox.style.width = `${newWidth}px`;
      floatingBox.style.height = `${newHeight}px`;
      inputBox.style.height = `calc(100% - ${buttonWrapper.clientHeight+30}px)`;
      button.style.width = '100%';
    }

    function stopResize() {
      document.removeEventListener('mousemove', resizeHandler);
      document.removeEventListener('mouseup', stopResize);
    }
  });

  moveHandle.addEventListener('mousedown', function(e) {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = floatingBox.offsetLeft;
    const startTop = floatingBox.offsetTop;

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', stopMove);

    function moveHandler(e) {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newLeft = startLeft + deltaX;
      const newTop = startTop + deltaY;

      if (newLeft >= 0 && newLeft + floatingBox.clientWidth <= window.innerWidth) {
        floatingBox.style.left = `${newLeft}px`;
      }
      if (newTop >= 0 && newTop + floatingBox.clientHeight <= window.innerHeight) {
        floatingBox.style.top = `${newTop}px`;
      }
    }

    function stopMove() {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', stopMove);
    }
  });


  button.addEventListener('click', function() {
    inputBox.select(); // 选中输入框内容
    document.execCommand('copy'); // 复制选中的内容到剪贴板
  });

  // 添加点击区域事件
  let isMinimized = false; // 记录当前悬浮窗是否已经最小化

  const clickHandle = document.createElement('div');
  clickHandle.style.position = 'absolute';
  clickHandle.style.left = '0';
  clickHandle.style.top = '0';
  clickHandle.style.width = '30px';
  clickHandle.style.height = '30px';
  clickHandle.style.backgroundColor = '#e60012';
  clickHandle.style.borderRadius = '10px';
  clickHandle.style.cursor = 'pointer';
  clickHandle.innerHTML = "<b style='font-size: 3px;'>　</b><b style='font-size: 20px;'>━</b>";
  clickHandle.addEventListener('click', function () {
    if (isMinimized) {
      floatingBox.style.width = '250px';
      floatingBox.style.height = '450px';
      floatingBox.style.right = '10px';
      floatingBox.style.bottom = '10px';
      floatingBox.style.left = '';
      floatingBox.style.top = '';
      clickHandle.innerHTML = "<b style='font-size: 3px;'>　</b><b style='font-size: 20px;'>━</b>";
      floatingBox.style.border = '3px solid #e60012';


      isMinimized = false;
    } else {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      floatingBox.style.width = '150px';
      floatingBox.style.height = '20px';
      floatingBox.style.right = '10px';
      floatingBox.style.bottom = '10px';
      floatingBox.style.border = "0px";
      floatingBox.style.left = '';
      floatingBox.style.top = '';

      isMinimized = true;
    }
  });

  floatingBox.appendChild(clickHandle);
  buttonWrapper.appendChild(button);

  floatingBox.appendChild(inputBox);
  floatingBox.appendChild(buttonWrapper);
  floatingBox.appendChild(resizeHandle);
  floatingBox.insertBefore(moveHandle, inputBox);

  document.body.appendChild(floatingBox);
})();

//点击输入框时将光标自动定位到文本末尾，并且重复点击输入框不会导致光标跳转
// 假设输入框的id为inputBox
const inputBox = document.getElementById('srk');
let shouldSetCursorToEnd = true;

// 监听输入框的 keydown 事件
inputBox.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.keyCode === 13) {
    // 按下Ctrl+Enter时执行换行操作
    inputBox.value += "\n";
  }

  shouldSetCursorToEnd = !inputBox.matches(':focus'); // 如果输入框没有焦点，则设置标志为 true
});

// 监听输入框的 focus 事件
inputBox.addEventListener('focus', function() {
  if (shouldSetCursorToEnd) {
    setCursorToEnd(inputBox);
  }
});

// 将光标定位到文本末尾的函数
function setCursorToEnd(element) {
  element.setSelectionRange(element.value.length, element.value.length); // 将光标位置设置到文本末尾
}
}
  })();

//间隔循环模块-------------------------------------------------------------------------------------------------------------
function runUserScript(){
var chinaTime = new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});
var formattedTime = chinaTime.replace(/\//g, '-').replace(",", ""); // 替换斜杠和逗号
unsafeWindow.formattedTime = formattedTime;

//动画
var style = document.createElement('style');
style.textContent = `
    @keyframes blink {
      0% {
        color: red;
      }
      50% {
        color: white;
      }
      100% {
        color: red;
      }
    }

    .blink {
      animation: blink 1s infinite;
    }
  `;

  // 将<style>标签插入到<head>标签内
document.head.appendChild(style);


//循环获取工单
function gongdanhans(){
if(Gdantix === "1"){
  fetch('https://wdgw.jtexpress.com.cn/sqsworkorder/workOrder/customerService/queryToBeAllocatedCount', {
    method: 'POST',
    headers: {
      "authToken": token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      countryId: "1",
      endTime: shijian1,
      startTime: shijian2
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.data.workOrderNum != 0 || data.data.platformOrderNum != 0) {
      var shul = data.data.workOrderNum + data.data.platformOrderNum;
      var element = document.getElementById("putonggdan");
      var GongDdan = document.getElementById("GdanTix");
      element.textContent = "您有" + shul + "条工单待处理";
      showFloatingWindow("您有" + shul + "条工单待处理");
      element.style.display = "block";
      GongDdan.style.display = "flex";
      element.classList.add("blink");
    }else{
      var GongDdan = document.getElementById("GdanTix");
          GongDdan.style.display = "none";
      var element = document.getElementById("putonggdan");
          element.classList.remove("blink");
      }
  })
  .catch(error => {

    // 反馈错误信息
    showFloatingWindow("机器人运行错误，请刷新界面");
  });
}};

//服务器提交网点数据
function fwqhans() {
const url = fwq+'PHPdaim/dengr/';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
};

const body = new URLSearchParams({
    time: formattedTime,
    site: userData.networkName,
    proxy: userData.financialCenterDesc,
    token: token,
    min:userData.name,
});
postData(url, body);
};

//循环获取调度
function diaoduhans() {
    'use strict';
const part1 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"current\"\r\n\r\n1\r\n";
const part2 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"size\"\r\n\r\n200\r\n";
const part3 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"startInputTime\"\r\n\r\n"+shijian3+"\r\n";
const part4 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"endInputTime\"\r\n\r\n"+shijian1+"\r\n";
const part5 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"orderStatusCodeStr\"\r\n\r\n101\r\n";
const part6 = "------WebKitFormBoundarymBnGZzLGVEyua2tr\r\nContent-Disposition: form-data; name=\"inputTime\"\r\n\r\n"+shijian3+","+shijian1+"\r\n";
const endPart = "------WebKitFormBoundarymBnGZzLGVEyua2tr--\r\n";
const requestData = part1 + part2 + part3 + part4 + part5 + part6 + endPart;
    fetch("https://wdgw.jtexpress.com.cn/wdccmorderweb/omsOrderDispatch/page", {
        method: "POST",
        headers: {
            "authtoken":token ,
            "content-type": "multipart/form-data; boundary=----WebKitFormBoundarymBnGZzLGVEyua2tr",
        },
        referrer: "https://wd.jtexpress.com.cn/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: requestData,
        mode: "cors",
        credentials: "omit"
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
          if (data.data.records && data.data.records.length > 0) {
            var Diaodubl = document.getElementById("DiaoDu");
            var Diaodunr = document.getElementById("diaodunr");
              Diaodunr.style.display = "block";
              Diaodunr.classList.add('blink');
              Diaodunr.textContent = "有调度未分配";
        } else {
            var Diaodubl = document.getElementById("DiaoDu");
            var Diaodunr = document.getElementById("diaodunr");
            Diaodubl.style.display = "none";
            Diaodunr.classList.remove("blink");
        }
    })
    .catch(error => {
        console.error('Error:', error); // 捕获异常并输出错误信息
    });
};

setInterval(function() {
gongdanhans();
fwqhans();
diaoduhans();
}, 5000);

};
runUserScript();
window.addEventListener("error", function(e) {
    console.error("重新错误，重新启动");

    // 延迟一段时间后重新执行用户脚本
    setTimeout(runUserScript, 5000); // 5秒后重新执行用户脚本
});
//页面监听变化模块---------------------------------------------------------------------------------------------------------
(function(){
var lastCfnr = null;
var newCfnr = null; // 新增变量用于存储 inputBox.value 的内容
const observer = new MutationObserver(function(mutationsList, observer) {

//快件跟踪按钮替换模块
if(Anntih ==="1"){
const elements = document.querySelectorAll('.el-table.el-table--fit.el-table--striped.el-table--border.el-table--enable-row-transition.el-table--small');
if (elements.length >= 2) {
  const button = document.createElement('button');
  button.innerText = '复 制';
  button.style.width = '50px';
  button.style.height = '30px';
  button.style.backgroundColor = '#e60012';
  button.style.border = 'none';
  button.style.padding = '0';
  button.style.marginTop = '5px';
  button.style.color = 'white';
  const secondElement = elements[1];
  const trElements = secondElement.querySelectorAll('tr');
  trElements.forEach((trElement) => {
    const lastTd = trElement.querySelector('td:last-child');

    if (lastTd) {
      const clonedButton = button.cloneNode(true);
      clonedButton.addEventListener('click', () => {
        const parentElement = clonedButton.parentElement;
        // 获取父元素下的所有子元素
        const children = parentElement.children;
        let mergedContent = '';
        for (let i = 3; i < 6; i++) {
          mergedContent += children[i].innerText;
        }
        // 获取id为srk的输入框
        const inputElement = document.getElementById('srk');
          inputElement.value += mergedContent + "\n" + "\n";

      });

      lastTd.replaceWith(clonedButton);
    }
  });
}
}

//按钮删除模块
if(Gdansc ==="1"){
   // 检查是否存在特定元素
   const element = document.querySelector('.service-detail-page');
    if (element) {
            // 判断元素的文本内容是否包含 "登记网点:总部" 字眼
            if (element.textContent.includes("登记网点:总部")) {
              console.log("检测到总部工单")
                // 判断元素的文本内容是否包含 "一级问题类型:投诉" 字眼
                if (element.textContent.includes("一级问题类型:投诉")) {
                  console.log("检测到总部投诉工单")
                    // 获取所有 class 为 "el-radio" 的元素
                    const radios = element.querySelectorAll(".el-radio");

                    radios.forEach(radio => {
                        // 判断 class 为 "el-radio" 元素包含的子元素中是否包含 "关闭" 字眼
                        if (radio.textContent.includes("关闭")) {
                            radio.closest("label").remove();
                        }
                    });
                }
            }
        }

}

//悬浮窗物流填充模块
if(Xuanfcmk ==="1"){
//悬浮窗物流填充模块
const waybillMsgBox = document.querySelector('.waybill-msg-box');
//const sandm ="";
if(waybillMsgBox){
    if(waybillMsgBox.innerHTML){
    const sjrxx = waybillMsgBox.innerHTML;
    // 定义正则表达式匹配模式
    const regex = /三段码<\/div>:<div[^>]*>(\d+)<\/div>/;

    // 使用正则表达式匹配sjrxx，并获取匹配到的值
    const matches = regex.exec(sjrxx);

    if (matches != null) {
        var sandm = matches[1];
        console.log(sandm); // 输出匹配到的三段码，此处为"034"
    } else {
       var sandm = "系统无三段码";
        console.log("未找到匹配的三段码");
    }

      //console.log(sjrxx);
     //const sandm = matches[1];
    // 定位到 "收件人信息" 字符位置
        const sjrInfoIndex = sjrxx.indexOf("收件人信息");
        const fh = "</div>";
        // 从 "收件人信息" 位置之后截取的数据
        const sjrDataAfter = sjrxx.substring(sjrInfoIndex + 5);
        const qeww = sjrDataAfter.indexOf('地址</div>:<div data-v-082a06fd="" class="des">', sjrInfoIndex + 5);
        // 定位到 "地址</div>:<div data-v-b2187686="" class="des">" 第二次出现的位置
        const qqwer = sjrDataAfter.substring(qeww + 1);
        const qeww2 = qqwer.indexOf('地址</div>:<div data-v-082a06fd="" class="des">', qeww + 1);
        const qqwer1 = sjrDataAfter.substring(qeww2 + 45);
        const endIndex1 = qqwer1.indexOf("</div>");
        // 截取 "</div>" 前的数据
        const qqwer2 = qqwer1.substring(0, endIndex1);
        const addressIndex = qqwer.indexOf("</div></div></div>");
      // 截取 "地址" 和 "</div>" 之间的数据
        const addressInfo = qqwer.substring(0 , addressIndex);
        const element = document.querySelector('.form-title.form-title-pseudo');
        const qwe = document.querySelector('.pod-box');
        const text1 = qwe.textContent;
        const startIndex1 = text1.indexOf('派件员【 ');
        const startIndex2 = text1.indexOf('】正在派件', startIndex1);
        let substring1 = "";
        let substring2 = "";
        if (startIndex1 !== -1) {
          // 截取"派件员【"后的数据
          substring1 = text1.slice(startIndex1 + 15);

          // 截取"】"前的数据
          substring2 = text1.slice(startIndex1 + 30, startIndex2).replace(/[^\u4e00-\u9fa5]/g, '');
        } else {
        }
        if(element){
        const htmlData = element.innerHTML;
        const startIndex = htmlData.indexOf("单号：");
        const endIndex = htmlData.indexOf("</span>", startIndex);
        const extractedData = htmlData.substring(startIndex + 3, endIndex);

          const inputBox = document.getElementById('srk');
  const content = inputBox.value;
  const cfnr = substring2 + "\n"+"三段码:"+sandm+"\n" + "单号：" + extractedData + "\n" + "地址：" + qqwer2  + "\n" + "\n";

  // 判断是否与上一次内容一致
  if (cfnr !== lastCfnr) {
    // 更新 lastCfnr 和填充输入框内容
    inputBox.value = cfnr;
    lastCfnr = cfnr;
    newCfnr = cfnr; // 存储当前的 inputBox.value 内容
  }
          }
    }
}
}


});



// 配置MutationObserver监听整个文档树的变化
const config = { childList: true, subtree: true };
observer.observe(document.documentElement, config);

// 获取和查询数据的函数
function getDataAndQuery(waybillMsgBox) {
  // 在这里执行获取和查询数据的操作
  //console.log(waybillMsgBox);
}
})();
//------------------------模块区------------------------------------------------------------------------------------------
}else{
  console.log("111");
  showFloatingWindow("未登入，无法执行，如已登入，请刷新界面");
}
}

// 每隔xunhpand秒执行一次判断，直到满足条件后停止循环
const intervalId = setInterval(() => {
checkBenblqc();

  if (stopLoop==1) {
    clearInterval(intervalId);
  }else{
  }
}, xunhpand);

//------------------------封装函数---------------------------------------------------------------------------------------
//放大输入框
function fangda(nr){
const inputBox2 = document.getElementById('srk');
const xfctz = document.getElementById('xfc');
xfctz.style.width = '100%';
xfctz.style.height = '100%';
xfctz.style.position = 'fixed';
xfctz.style.left = '0';
xfctz.style.top = '0';
xfctz.style.transform = 'translate(0, 0)';
inputBox2.value = nr;
}

window.addEventListener('error', function(event) {
    console.error('发生了一个错误：', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('出现BUG，重启机器人', event.reason);
});
//服务器提交模版
function postData(url, body) {
    fetch(url, {
        method: 'POST', 'Content-Type': 'application/x-www-form-urlencoded',
        body: body,
    })
        .then(response => response.text())
          .catch(error => {

      // 反馈错误信息
      showFloatingWindow("服务器连接失败");
    });
}

  //信息提示模块
function showFloatingWindow(message) {
  const floatingWindow = document.createElement('div');
  floatingWindow.textContent = message;
  floatingWindow.style.position = 'fixed';
  floatingWindow.style.left = '50%';
  floatingWindow.style.bottom = '50px';
  floatingWindow.style.transform = 'translateX(-50%)';
  floatingWindow.style.padding = '10px 20px';
  floatingWindow.style.background = 'rgba(0, 0, 0, 0.8)';
  floatingWindow.style.color = 'white';
  floatingWindow.style.borderRadius = '5px';
  floatingWindow.style.opacity = '1';
  floatingWindow.style.transition = 'opacity 1s ease-out';
  floatingWindow.style.zIndex = '9999';

  floatingWindow.addEventListener('click', () => {
    floatingWindow.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(floatingWindow);
    }, 300);
  });

  document.body.appendChild(floatingWindow);
  const timeoutId = setTimeout(() => {
    floatingWindow.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(floatingWindow);
      clearTimeout(timeoutId);
    }, 1000);
  }, 2000);
}