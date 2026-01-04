// ==UserScript==
// @name         妇幼公众号预约
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tryld!
// @author       You
// @match        https://mp.mhealth100.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mhealth100.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464484/%E5%A6%87%E5%B9%BC%E5%85%AC%E4%BC%97%E5%8F%B7%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/464484/%E5%A6%87%E5%B9%BC%E5%85%AC%E4%BC%97%E5%8F%B7%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==
const doctorId = "9713";
//const doctorName = "九价疫苗首针医生";
const doctorName = "null";
const deptId = "142|103302";
const deptName = "成人疫苗接种门诊";
const branchName = "东城院区(东城区主山社区振兴路99号)";
const branchCode = "100201";
const regType = "Appointment";
setInterval(function() {
    DoctorHomePageAllData(doctorId,doctorName,deptId,deptName,branchName,branchCode);
}, 3000);
//获取医生信息
async function DoctorHomePageAllData(doctorId,doctorName,deptId,deptName,branchName,branchCode){
    const url = `https://mp.mhealth100.com/gateway/registration/appointment/DoctorHomePageAllData/find?branchCode=${branchCode}&doctorId=${doctorId}&doctorName=${encodeURIComponent(encodeURIComponent(doctorName))}&deptId=${encodeURIComponent(deptId)}&deptName=${encodeURIComponent(encodeURIComponent(deptName))}`;
    const data = await ajaxdata(url);
    console.log(data);
    const 号源列表 = data.data[0].regInfoList[0].scheduleInfos;
    // 循环遍历号源列表，输出regDate+余+regLeaveCount
    号源列表.forEach(function(item) {
        console.log(item.regDate + "余" + item.regLeaveCount);
        if (item.regLeaveCount > 0) {
            gettimedata(doctorId,doctorName,deptId,deptName,branchCode,item.regDate)
        }
    });
}
//获取时间段
async function gettimedata(doctorId,doctorName,deptId,deptName,branchCode,regDate){
    const url = `https://mp.mhealth100.com/gateway/registration/doctor/time/find?branchCode=${branchCode}&deptName=${encodeURIComponent(encodeURIComponent(deptName))}&deptId=${encodeURIComponent(deptId)}&doctorId=${doctorId}&doctorName=${encodeURIComponent(encodeURIComponent(doctorName))}&regDate=${regDate}&scheduleId=&timeFlag=&ajaxConfig=true`;
    const data = await ajaxdata(url);
    console.log(data);
    //调用getuserinfo函数获取返回值bindingId等
    const { bindingId, patientId, idCardNo, phone } = await getuserinfo();
    // 循环遍历时间段号源列表，输出regDate+余+regLeaveCount
    for (const item of data.data) {
        if (item.regLeaveCount>0) {
            console.log(item.startTime + "-" + item.endTime);
            await getRegistrationCost(branchCode, bindingId, deptId, deptName, doctorId, doctorName, patientId, regDate);
            await 发起预约(bindingId,branchCode,branchName,deptId,deptName,doctorId,doctorName,patientId,idCardNo,phone,item.startTime,item.endTime,regDate);
        }
    }
}
//获取身份信息
async function getuserinfo() {
    const url = 'https://mp.mhealth100.com/gateway/patient/healthcard/findCards';
    const data = await ajaxdata(url);
    console.log(data);
    const { bindingId, patId: patientId, patIdno: idCardNo, phoneNo: phone } = data.data[0];
    return { bindingId, patientId, idCardNo, phone };
}
//获取挂号金额
async function getRegistrationCost(branchCode, bindingId, deptId, deptName, doctorId, doctorName, patientId, regDate) {
    const url = `https://mp.mhealth100.com/gateway/registration/cost/find?branchCode=${branchCode}&bindingId=${bindingId}&deptId=${encodeURIComponent(deptId)}&deptName=${encodeURIComponent(encodeURIComponent(deptName))}&doctorId=${doctorId}&patientId=${patientId}&regDate=${regDate}&doctorName=${encodeURIComponent(encodeURIComponent(doctorName))}&scheduleIdFromSchedule=&scheduleIdFromTimeInfo=&timeFlag=&svObjectId=&isInsuran=&diseaseId=`;
    const data = await ajaxdata(url);
    console.log(data);
    return data;
  }
//发起预约
async function 发起预约(bindingId, branchCode, branchName, deptId, deptName, doctorId, doctorName, patientId, idCardNo, phone, startTime, endTime, regDate) {
  const url = 'https://mp.mhealth100.com/gateway/registration/appointment/order/create';
  const obj = {
    applyId: '',
    affiliatedHospital: '',
    bindingId,
    branchCode,
    branchName,
    clinicUnitId: '',
    deptId,
    deptName: encodeURIComponent(deptName),
    diseaseId: null,
    diseaseName: null,
    doctorId,
    doctorName,
    doctorTitle: '医师',
    doctorLevelCode: '0',
    scheduleId: '',
    queueSn: '',
    periodId: '',
    serviceItemId: '',
    timeFlag: '',
    svObjectId: '',
    svObjectName: '普通病人',
    svMode: '',
    cashFee: '0',
    treatFee: '14.0',
    regFee: '0',
    yhFee: '0.0',
    insuranFee: '',
    medicareSettleLogId: '',
    patientId,
    idCardNo,
    phone,
    orderType: '',
    registerTypeId: '',
    startTime,
    endTime,
    regDate,
    shiftName: ' ',
    remark: '',
    roomAddress: '',
    connect_redirect: 1,
    guidanceCallback: '',
    ajaxConfig: true,
    isTencentHealth: '',
    tencentHealthId: '',
    alipayHealthId: ''
  };
  const data = await ajaxdata(url, obj, 'POST');
  if (data.resultCode === 0) {
    alert('预约成功！');
  } else {
    console.log(data);
  }
}
async function ajaxdata(url, obj, method = 'GET') {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'content-type': method === 'POST' ? 'application/json;charset=UTF-8' : 'text/plain;charset=UTF-8',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin'
    },
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: obj ? JSON.stringify(obj) : null,
    method,
    mode: 'cors',
    credentials: 'include'
  });
  const data = await response.json();
  return data;
}