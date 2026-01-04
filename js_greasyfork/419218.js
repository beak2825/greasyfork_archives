// ==UserScript==
// @name         MSB-Network_Task_Pro
// @namespace    OriX
// @version      1.2.6.1
// @description  更改了一些布局 快速处理
// @author       OriX
// @match        *://vip.meishubao.com/admin/network_task.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419218/MSB-Network_Task_Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/419218/MSB-Network_Task_Pro.meta.js
// ==/UserScript==
/*
 * @LastEditors: OriX
 * @LastEditTime: 2021-04-23 21:57:56
 * @Copyright (C) 2020 OriX. All rights reserved.
 */
//----------配置部分 可调整(*^▽^*)----------
/*
  修改指南
    btn_title:按钮文本
    edit_area_text：测网报告文本
    select_value：下拉选择框选择项值-- 这部分不要随意修改 会导致表单提交出现问题

*/
// 成功部分配置
const success_btn_text_options = [
  {
    btn_title: '客户端通过',
    edit_area_text: `测网通过，客户端,  摄像头，扬声器，麦克风，设备正常。`,
    select_value: 0,
  },
  {
    btn_title: '浏览器通过',
    edit_area_text: ` 测网通过，浏览器,  摄像头，扬声器，麦克风，设备正常。`,
    select_value: 0,
  },
  {
    btn_title: '监课通过',
    edit_area_text: '监课显示 师生已上课，摄像头、麦克风、扬声器，设备正常 ',
    select_value: 0,
  },
];
// 无法调试部分配置
const unable_btn_title_options = [
  {
    btn_title: '取消',
    edit_area_text: '课程已取消  无法调试，测网工单取消，如需测网请重新预约 ',
    select_value: 23,
  },
  {
    btn_title: '改约',
    edit_area_text: '课程已改约  无法调试，测网工单取消，如需测网请重新预约 ',
    select_value: 23,
  },
  {
    btn_title: '未接',
    edit_area_text: '无人接听 / 通话中 无法调试，测网工单取消，如需测网请重新预约',
    select_value: 24,
  },
  {
    btn_title: '拒接',
    edit_area_text: '电话拒接，无法调试，测网工单取消，如需测网请重新预约',
    select_value: 25,
  },
  {
    btn_title: '生病',
    edit_area_text: '小朋友或家里人生病了，无法参加 无法调试，测网工单取消，如需测网请重新预约',
    select_value: 26,
  },
  {
    btn_title: '有事',
    edit_area_text: '临时有事，无法参加 无法调试，测网工单取消，如需测网请重新预约',
    select_value: 26,
  },
  {
    btn_title: '在外面',
    edit_area_text: '现在还在外面，赶不回去,无法参加 无法调试，测网工单取消，如需测网请重新预约',
    select_value: 26,
  },
  {
    btn_title: '拒调',
    edit_area_text: '不需要 / 自己调试，不需要我们调试，无法调试，测网工单取消，如需测网请重新预约 ',
    select_value: 27,
  },
  {
    btn_title: 'cc调试',
    edit_area_text: '家长说CC调试设备 ，无法调试，测网工单取消，如需测网请重新预约 ',
    select_value: 28,
  },
  {
    btn_title: '不方便',
    edit_area_text: '不方便，不需要我们调试，无法调试，测网工单取消，如需测网请重新预约 ',
    select_value: 27,
  },
  // {
  //   btn_title: '未通过尾',
  //   edit_area_text: '无法调试，测网工单取消，如需测网请重新预约 ',
  //   select_value: 0,
  // },
];
// 任务详情配置
/*
    theme: 主题  可选  bs里面的  建议 info ,
    btn_title: 按钮文字,
    edit_area_text: 任务详情里面的文字,
    auto_submit: 是否自动提交 true真 false 假,
    to_cc: 是否通知课程顾问  true真 false 假,
    need_time: 是否需要计算时间 五分钟后的时间  true真 false 假,
*/
const task_info_btns_options = [
  {
    theme: 'btn-warning',
    btn_title: '未接并提交',
    edit_area_text: '未接 5分钟后尝试再次联系',
    auto_submit: true,
    to_cc: false,
    need_time: true,
  },
  {
    theme: 'btn-danger',
    btn_title: '拒接并提交',
    edit_area_text: '拒接 5分钟后尝试再次联系',
    auto_submit: true,
    to_cc: false,
    need_time: true,
  },
  {
    theme: 'btn-info',
    btn_title: '下载并提交',
    edit_area_text: '下载 5分钟后再次联系',
    auto_submit: true,
    to_cc: false,
    need_time: true,
  },
];
// 初始化日报配置
const default_daily_obj = {
  tempDate: formate_Date_ori(),
  all_result_num: null,
  success_num: 0,
  cancel_num: 0,
  dont_num: 0,
  reject_num: 0,
  noAttend_num: 0,
  refused_num: 0,
  cc_num: 0,
  another_num: 0,
  changeTime_num: 0,
  total_page: 0,
};
//----------全局参数部分(*^▽^*)----------
// 剩余结果部分
let residue_num;
// 测网报告是否自动提交
let task_edit_auto_submit = localStorage.getItem('isAutoSumbitTask');
// 是否开启自动接单
let isAutoGet = localStorage.getItem('isAutoGet');
// 是否正在获取日报
let isGetDaily = localStorage.getItem('isGetDaily');
// 当前的daily obj
let oriDailyObj = JSON.parse(localStorage.getItem('oriDaily'));
// 获取当前日期
let today_ori = formate_Date_ori();
//----------Tools函数部分(*^▽^*)----------
// 防抖函数   优化请求
function debounce(fn, wait, immediate) {
  let timeout, result;
  let debounced = function () {
    let context = this;
    let args = arguments;
    if (timeout) {
      // 如果有计时器id了 清除这个计时器
      clearTimeout(timeout);
    }
    //
    let callNow = !timeout;
    if (immediate) {
      // 已经执行过，不再执行
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) {
        result = fn.apply(context, args);
      }
    } else {
      timeout = setTimeout(function () {
        result = fn.apply(context, args);
        console.log(result);
      }, wait);
    }
  };
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
}
// 弹出定制信息框
function alert_ori(text, theme = null) {
  alertify.log(text, theme, 1000);
}
// 创建按钮 基于bootstrap的主题
function create_btn_base_on_bs(theme, text, h = '35px') {
  let temp_btn = document.createElement('button');
  temp_btn.classList.add('btn');
  temp_btn.classList.add(theme);
  temp_btn.style.cssText = `
    box-sizing:border-box;
    width:auto;
    height:${h};
    text-align: center;
    line-height:0px;
    padding:10px;
    margin-left:5px;
    margin-top: 8px;
    color:#fff;
  `;
  temp_btn.innerText = text;
  return temp_btn;
}
// 获取5分钟后的时间 并返回文本
function get_waiting_time() {
  let date = new Date();
  date.setMinutes(date.getMinutes() + 5);
  return date.getHours() + ':' + ('0' + date.getMinutes()).substr(-2, 2);
}
// 创建功能按钮 size：max
function create_ori_btn(theme, text, bgc) {
  let temp_btn = create_btn_base_on_bs(theme, text);
  temp_btn.style.cssText = `
    display: block;
    /* box-sizing: border-box; */
    margin: 15px auto 0;
    padding: 5px;
    width: 130px;
    height: 45px;
    color: #fff;
    border: 1px solid #ccc;
    text-align: center;
    border-radius: 5px;
    font-size: 20px;
    background: ${bgc};
`;
  return temp_btn;
}
// 创建带label的input选择框
function create_checkbox_with_label(forId, text, labelColor, parentElement, antoherCSS = null) {
  let temp_label = document.createElement('label');
  temp_label.setAttribute('for', forId);
  temp_label.innerText = text;
  temp_label.style.cssText = `
    position: relative;
    display: block;
    /* box-sizing: border-box; */
    margin: 15px auto 0;
    padding: 5px;
    width: 130px;
    height: 45px;
    text-indent: 30px;
    color: #fff;
    border: 1px solid #ccc;
    text-align: center;
    border-radius: 5px;
    font-size: 20px;
    background-color: ${labelColor};
    ${antoherCSS}
  `;
  let temp_checkbox = document.createElement('input');
  temp_checkbox.setAttribute('id', forId);
  temp_checkbox.setAttribute('type', 'checkbox');
  temp_checkbox.style.cssText = `
      position: absolute;
      top: 45%;
      left: 8px;
      transform: translateY(-50%);
      width: 25px;
      height: 25px;
      border-radius: 5px;
  `;
  temp_label.append(temp_checkbox);
  parentElement.append(temp_label);
  temp_checkbox.checked = false;
  // console.log(temp_checkbox);
  return temp_checkbox;
}
// 往父元素中增加按钮
function add_btn_to_parent(btnE, parentE) {
  parentE.append(btnE);
}
// 格式化输出当前时间
function formate_Date_ori(needY = true) {
  let date = new Date();
  let dateY = date.getFullYear();
  let dateM = +date.getMonth() + 1;
  let dateD = date.getDate();
  return needY ? `${dateY}-${dateM}-${dateD}` : `${dateM}-${dateD}`;
}
//----------条件查询部分(*^▽^*)----------
let conditional_query_section = {
  // 仅有处理中的数字文本表示
  only_process_t: '0,1,0,0,0,0,0,0,0,0',
  dom: {
    // 条件查询部分
    // 全部结果状态的input元素集合
    checked_status_cboxs: document.getElementsByClassName('checked_status_checkbox'),
    // 全部任务状态的input元素集合
    task_status_cboxs: document.getElementsByClassName('task_status_checkbox'),
    // 选中全部任务状态的checkbox
    task_status_cbox: document.getElementById('task_status_all'),
    // 处理中
    processing_cbox: document.getElementById('task_status_1'),
    // 结果状态部分
    // 选中全部结果状态的checkbox
    checked_status_cbox: document.getElementById('checked_status_all'),
    // 通过
    checked_success_cbox: document.getElementById('checked_status_2'),
    // 无法调试
    checked_unable_cbox: document.getElementById('checked_status_4'),
    // 改约
    change_time_cbox: document.getElementById('checked_status_5'),
    // 条件输入框
    task_key_input: document.querySelector('#network_task > div:nth-child(4) > div > input'),
    // 查询按钮
    task_list_submit: document.getElementById('task_list_submit'),
    // 创建日报按钮
    generate_daily_btn: create_ori_btn('btn-info', '一键日报', '#015f5a'),
  },
  // 以 数字 0 1 形式返回所有状态文本
  get_all_status_text() {
    let status_arr = [];
    for (let status_one of this.dom.task_status_cboxs) {
      status_arr.push(+status_one.checked);
    }
    for (let status_one of this.dom.checked_status_cboxs) {
      status_arr.push(+status_one.checked);
    }
    return status_arr.toString();
  },
  // 重置所有条件
  reset_all_conditions() {
    this.dom.task_status_cbox.click();
    this.dom.checked_status_cbox.click();
    if (this.dom.task_status_cbox.checked) {
      this.dom.task_status_cbox.click();
    }
    if (this.dom.checked_status_cbox.checked) {
      this.dom.checked_status_cbox.click();
    }
    this.dom.task_key_input.value = null;
  },
  // 核对是否只选择了处理中
  checked_only_processing() {
    let flage = false;
    if (this.get_all_status_text() != conditional_query_section.only_process_t) {
      conditional_query_section.reset_all_conditions();
      this.dom.processing_cbox.click();
      console.log('由于checkBox 我刷新了页面');
      this.dom.task_list_submit.click();
    } else if (this.dom.task_key_input.value != '') {
      console.log('由于查询关键词 我刷新了页面');
      this.dom.task_key_input.value = '';
      this.dom.task_list_submit.click();
    } else {
      flage = true;
    }
    return flage;
  },
  // 点击今天处理的全部数量
  get_today_all_num() {
    // 重置所有条件
    this.reset_all_conditions();
    // 点击重置
    this.dom.checked_status_cbox.click();
    // 查询按钮
    this.dom.task_list_submit.click();
  },
  // 当前筛选条件结果
  get_screening_results() {
    // 4. 获取结果文本并返回
    let result_num_process_e = document.querySelector('#network > div > div.col-9 > div:nth-child(8) > div > span');
    // 剩余结果文本
    let result_num_process = result_num_process_e.innerText;
    let result_reg = /\d+/;
    residue_num = +result_num_process.match(result_reg)[0];
    console.log(residue_num);
    return residue_num;
  },
  // 获取所有结果的状态
  get_all_status_all_page(all_page_table_text) {
    const all_result_pattern = {
      success: /果：测网通过, 备注/g,
      cancel: /果：无法调试-取消课程/g,
      dont: /果：无法调试-无人接听/g,
      reject: /果：无法调试-家长拒接/g,
      noAttend: /果：无法调试-不能出席/g,
      refused: /果：无法调试-拒绝调试/g,
      cc: /果：无法调试-CC调试/g,
      another: /果：无法调试-其他/g,
      changeTime: /改约时间	已完成/g,
    };
    const pattern_keys = Object.keys(all_result_pattern);
    pattern_keys.forEach(key => {
      let matchResult = all_page_table_text.match(all_result_pattern[key]);
      matchResult !== null ? (oriDailyObj[key + '_num'] += matchResult.length) : null;
    });
  },
  // 拼接所有的innerText
  joint_all_innerText() {
    console.log('this function is running');
    let all_page_table_text = document.getElementsByClassName('table')[0].innerText;
    console.log(oriDailyObj.all_url_path.length);
    oriDailyObj.all_innerText += all_page_table_text;
  },

  // 一键日报获取
  generate_daily() {
    // 获取总页数 和总接取数 并拼接url
    if (oriDailyObj.all_result_num == null) {
      let all_result_num = this.get_screening_results();
      oriDailyObj.all_result_num = all_result_num;
      oriDailyObj.total_page = Math.floor(all_result_num / 6);
      localStorage.setItem('baseUrl', window.location);
      let tempArr = [];
      for (let index = 0; index <= oriDailyObj.total_page; index++) {
        let temp_url = localStorage.getItem('baseUrl');
        tempArr.push(`${temp_url}&page=${index}`);
      }
      oriDailyObj.all_url_path = [...tempArr];
      oriDailyObj.all_innerText = '';
      let nextUrl = oriDailyObj.all_url_path.pop();
      localStorage.setItem('oriDaily', JSON.stringify(oriDailyObj));
      window.location.replace(nextUrl);
      return;
    }
    // 页面二次刷新后的获取
    this.joint_all_innerText();
    if (oriDailyObj.all_url_path.length > 0) {
      let nextUrl = oriDailyObj.all_url_path.pop();
      localStorage.setItem('oriDaily', JSON.stringify(oriDailyObj));
      window.location.replace(nextUrl);
    } else {
      // 删除正在读取日报标记
      localStorage.removeItem('isGetDaily');
      // 获取所有状态
      this.get_all_status_all_page(oriDailyObj.all_innerText);
      // 输出结果
      this.show_daily();
      // 显示在页面
    }
    //
  },
  // 一个输入框显示日报
  show_daily() {
    const userName = document.getElementById('select_member').innerText;
    const todayOri = formate_Date_ori();
    const {
      success_num,
      cancel_num,
      dont_num,
      reject_num,
      noAttend_num,
      refused_num,
      cc_num,
      another_num,
      changeTime_num,
    } = oriDailyObj;
    const reuslt_text = `${userName}   领取量${
      oriDailyObj.all_result_num
    },通过${success_num},改约${changeTime_num},取消${cancel_num},未接或拒接${
      dont_num + reject_num
    },无法出席${noAttend_num},拒绝调试${refused_num},cc调试${cc_num},其他${another_num}`;
    oriDailyObj.result_t = reuslt_text;
    localStorage.setItem('oriDaily', JSON.stringify(oriDailyObj));
    if (!document.getElementById('ori_daily_list')) {
      let tempD = document.createElement('div');
      tempD.innerHTML = `
        <ul class="list-group col-3" id='ori_daily_list' style="position:fixed;right:20px;top:75px;">
          <li class="list-group-item ">${reuslt_text}</li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            领取
            <span class="badge badge-primary ">${oriDailyObj.all_result_num}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            通过
            <span class="badge badge-primary ">${success_num}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            改约
            <span class="badge badge-primary ">${changeTime_num}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            取消
            <span class="badge badge-primary ">${cancel_num}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            未接或拒接
            <span class="badge badge-primary ">${dont_num + reject_num}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            不能出席
            <span class="badge badge-primary ">${noAttend_num}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            拒绝调试
            <span class="badge badge-primary ">${refused_num}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            cc调试
            <span class="badge badge-primary ">${cc_num}</span>
          </li>  
          <li class="list-group-item d-flex justify-content-between align-items-center">
            其他
            <span class="badge badge-primary ">${another_num}</span>
          </li>           
        </ul>`;
      document.getElementById('network').append(tempD);
    }
  },
};
// 一键创建日报按钮功能 将正在获取改为true  将初始化obj置入
conditional_query_section.dom.generate_daily_btn.onclick = function () {
  localStorage.setItem('isGetDaily', true);
  localStorage.setItem('oriDaily', JSON.stringify(default_daily_obj));
  conditional_query_section.get_today_all_num();
};
// 如果正在获取日报 则重复执行日报获取
if (isGetDaily) {
  conditional_query_section.generate_daily();
}
// if (oriDailyObj !== null) {
//   if (oriDailyObj.tempDate == today_ori) {
//     conditional_query_section.show_daily();
//   }
// }

//----------任务领取栏(*^▽^*)----------
let receive = document.getElementsByClassName('col-3')[0];
let receive_section = {
  dom: {
    // 领取按钮
    task_receive_btn: document.getElementsByClassName('task_receive')[0],
    // 创建抢单外部包裹的label及单选框
    grap_input: create_checkbox_with_label('grab_input', '自动接单', '#98b4b3', receive),
    // 创建一个
    receive_quickly_btn: create_ori_btn('btn-infor', '领一个', '#8ace57'),
    // 领取三个
    receive_quickly_btn3: create_ori_btn('btn-infor', '领三个', '#ce3b3b'),
  },
  change_receive_layout() {
    receive.classList.add('col-2');
    receive.classList.remove('col-3');
  },
  // 快速领取功能
  task_receive_quickly(numbers) {
    for (let index = 0; index < numbers; index++) {
      console.log('快速领单.gif');
      this.dom.task_receive_btn.click();
      let layer_btn;
      layer_btn = document.getElementsByClassName('layui-layer-btn0')[0];
      layer_btn.click();
    }
  },
  /*
    自动抢单功能
    优先获取 当前剩余的结果文本
    剩余处理中元素--获取查询结果数量
  */
  auto_get() {
    if (isAutoGet && conditional_query_section.checked_only_processing()) {
      console.log('自动抢单运行中...');
      let result_num_process_e = document.querySelector('#network > div > div.col-9 > div:nth-child(8) > div > span');
      // 剩余结果文本
      let result_num_process = result_num_process_e.innerText;
      let result_reg = /\d+/;
      residue_num = +result_num_process.match(result_reg)[0];
      console.log('当前查询结果数量：', residue_num);
      if (residue_num < 3) {
        receive_section.task_receive_quickly(1);
        // 使用DOM变动观察器
        let observer = new MutationObserver(mutationRecords => {
          if (mutationRecords.length == 4) {
            let result_text = mutationRecords[3].addedNodes[0].innerText;
            if (result_text == '只能领取当前时段任务') {
              alert_ori('当前时段高峰期已结束  请等待...自动抢单已经关闭');
              localStorage.removeItem('isAutoGet');
              grab_input.checked = false;
            } else if (result_text == '当前没有待领取任务') {
              alert_ori('当前无可领取任务 自动抢单关闭');
              localStorage.removeItem('isAutoGet');
              grab_input.checked = false;
            }
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  },
};
// 修改任务领取栏宽度
receive_section.change_receive_layout();
// 判断是否自动领取
// console.log(receive_section.dom.grap_input);
if (isAutoGet) {
  receive_section.dom.grap_input.checked = true;
}
// 更改isAutoGet
receive_section.dom.grap_input.onclick = function () {
  if (grab_input.checked) {
    localStorage.setItem('isAutoGet', true);
    // 点击查询按钮从而刷新页面
    conditional_query_section.dom.task_list_submit.click();
  } else {
    localStorage.removeItem('isAutoGet');
  }
};
// 领取一个
receive_section.dom.receive_quickly_btn.onclick = function () {
  receive_section.task_receive_quickly(1);
};
add_btn_to_parent(receive_section.dom.receive_quickly_btn, receive);
// 领取三个 防抖
receive_section.dom.receive_quickly_btn3.onclick = debounce(() => receive_section.task_receive_quickly(3), 1500, true);
add_btn_to_parent(receive_section.dom.receive_quickly_btn3, receive);
// 添加一键日报按钮
add_btn_to_parent(conditional_query_section.dom.generate_daily_btn, receive);
// 页面刷新 自动判断抢单
receive_section.auto_get();
//----------任务详情部分----------
// 编辑任务详情 network_task_detail_modal
let task_info = document.querySelector('#network_task_detail_modal .modal-content .modal-body');

let task_info_section = {
  dom: {
    detail_user: task_info.getElementsByClassName('network_task_detail_user')[0],
    // 照片元素
    user_info_img: task_info.getElementsByClassName('network_task_uhead')[0],
    // 获取任务详情编辑框
    form_control: task_info.querySelector('.form-control'),
    // 详情头部右侧
    task_info_header_right: task_info.getElementsByClassName('col-md-10')[0],
    // 提交按钮
    info_submit_btn: document.getElementById('btn_network_log_add'),
    // 通知给课程顾问
    post_info_to_cc: document.getElementById('notice_2cc'),
  },
  hidden_user_info_img() {
    this.dom.user_info_img.remove();
  },
  // 调整textarea的高度
  change_form_textarea_h() {
    this.dom.form_control.setAttribute('rows', '5');
  },
  task_info_create_btn_add_submit(optionsArr) {
    const context = this;
    for (let item of optionsArr) {
      let temp_btn = create_btn_base_on_bs(item.theme, item.btn_title);
      temp_btn.onclick = function () {
        context.dom.form_control.value = item.edit_area_text;
        if (item.need_time) {
          context.dom.form_control.value += get_waiting_time();
        }
        if (item.to_cc) {
          context.dom.post_info_to_cc.click();
        }
        if (item.auto_submit) {
          context.dom.info_submit_btn.click();
        }
      };
      context.dom.task_info_header_right.append(temp_btn);
    }
  },
};
// 隐藏照片元素
task_info_section.hidden_user_info_img();
// 调整高度
task_info_section.change_form_textarea_h();
//创建对应按钮
task_info_section.task_info_create_btn_add_submit(task_info_btns_options);

//----------测网报告部分(*^▽^*)----------
// network_task_edit_modal 根元素
let task_edit_modal = document.querySelector('#network_task_edit_modal .modal-body');
// 下面的全部groups
let form_groups = task_edit_modal.getElementsByClassName('form-group');
let task_edit_modal_section = {
  dom: {
    // 获取测网编辑部分
    edit_modal_area: task_edit_modal.getElementsByClassName('form-control')[4],
    // 设备选择部分
    equipment_elements: form_groups[1],
    // 结果部分
    success_group: form_groups[3],
    failure_group: form_groups[4],
    unable_group: form_groups[5],
    change_group: form_groups[6],
  },
  create_dom: {
    auto_submit_input: create_checkbox_with_label(
      'task_edit_submit',
      '自动提交',
      '#c24545',
      form_groups[2],
      'float:right;margin:0 66px 0 0;'
    ),
  },
  task_edit_create_btns_add_event({ parentElement, theme, btnTextArray = [], checkInputId, selectClassName }) {
    const context = this;
    btnTextArray.map(item => {
      // 生成按钮
      let temp_btn = create_btn_base_on_bs(theme, item['btn_title']);
      // 生成该按钮
      parentElement.append(temp_btn);
      // 添加指定事件
      temp_btn.onclick = () => {
        context.dom.edit_modal_area.value = item['edit_area_text'];
        let temp_status = task_edit_modal.querySelector('#' + checkInputId);
        temp_status.checked = true;
        if (selectClassName && item['select_value'] > 0) {
          let temp_select = task_edit_modal.querySelector('.' + selectClassName);
          temp_select.value = item['select_value'];
        }
        // 测网报告是否自动提交
        task_edit_auto_submit = localStorage.getItem('isAutoSumbitTask');
        if (task_edit_auto_submit) {
          let task_edit_submit = document.getElementById('btn_network_task_edit_submit');
          task_edit_submit.click();
        }
      };
    });
  },
};

// 更改isAutoSumbitTask
let task_input = task_edit_modal_section.create_dom.auto_submit_input;
// 根据是否提交勾选input
if (task_edit_auto_submit) {
  task_input.checked = true;
}
task_input.onclick = function () {
  if (task_input.checked) {
    localStorage.setItem('isAutoSumbitTask', true);
  } else {
    localStorage.removeItem('isAutoSumbitTask');
  }
};
//---成通过按钮
let success_btn_create_option = {
  parentElement: task_edit_modal_section.dom.success_group,
  theme: 'btn-success',
  btnTextArray: success_btn_text_options,
  checkInputId: 'test_status_2',
  selectClassName: null,
};
task_edit_modal_section.task_edit_create_btns_add_event(success_btn_create_option);
//---生成无法调试按钮
let unable_btn_create_option = {
  parentElement: task_edit_modal_section.dom.unable_group,
  theme: 'btn-warning',
  btnTextArray: unable_btn_title_options,
  checkInputId: 'test_status_4',
  selectClassName: 'network_task_edit_f4',
};
task_edit_modal_section.task_edit_create_btns_add_event(unable_btn_create_option);
//----------Segmentation(*^▽^*)----------
