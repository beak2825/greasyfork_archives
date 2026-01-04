// ==UserScript==
// @name         MSB-AutoAssigned
// @namespace    OriX-autoAssigned
// @version      1.0.2
// @description  自动指派罢了
// @author       OriX
// @match        *://vip.meishubao.com/admin/network_task.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428392/MSB-AutoAssigned.user.js
// @updateURL https://update.greasyfork.org/scripts/428392/MSB-AutoAssigned.meta.js
// ==/UserScript==
/*
 * @Description:
 * @Author: OriX
 * @LastEditors: OriX
 */
// 获取父元素
const network_task = document.getElementById('network_task');
/** 根据指定key 查询返回用户
 * 根据指定key 查询返回用户
 * @param {String} searchKey
 */
async function getUserListByKey(searchKey) {
  let myHeaders = new Headers();
  const get_cookies = document.cookie;
  myHeaders.append('Cookie', get_cookies);
  let formdata = new FormData();
  formdata.append('action', 'u_admin');
  formdata.append('teamid', "''");
  formdata.append('key', searchKey);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow',
  };
  const response = await fetch('https://vip.meishubao.com/admin/network_task.html', requestOptions);
  try {
    console.log('OriX---解析response');
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log('error', error);
    return null;
  }
}
/** 处理获取到的用户信息
 * 处理获取到的用户信息
 * @param {Array} infoObjArr
 * @returns
 */
function detailUserInfo(infoObjArr) {
  // 先做基础判断
  if (!Array.isArray(infoObjArr)) return [];
  if (infoObjArr.length < 1) return [];
  // 再进行处理
  const allInfoObj = {};

  infoObjArr.forEach(infoObj => {
    // console.log(infoObj);
    if ((infoObj.title == '8') & (infoObj.role == '3')) {
      allInfoObj[infoObj.username] = infoObj.id;
    }
  });
  return allInfoObj;
}
/** 设置所有的用户列表到localStorage  key 为allUserInfoList
 *
 */
async function initSetUserList() {
  const responseHZ = await getUserListByKey('杭州');
  const responseKQ = await getUserListByKey('课前');
  const infoObjHZ = detailUserInfo(responseHZ);
  const infoObjKQ = detailUserInfo(responseKQ);
  const allInfo = { ...infoObjHZ, ...infoObjKQ };
  // 储存到 localStorage
  localStorage.setItem('allUserInfoList', JSON.stringify(allInfo));
  return allInfo;
}
/** 指定任务给指定的用户
 *
 * @param {String} taskId 任务id
 * @param {String} userId 用户id
 * @return 成功返回 True 失败返回false
 */
async function assignDutiesToUser(taskId, userId) {
  var myHeaders = new Headers();
  const get_cookies = document.cookie;
  myHeaders.append('Cookie', get_cookies);
  var formdata = new FormData();
  formdata.append('uid', userId);
  formdata.append('id', taskId);
  formdata.append('action', 'task_2others');

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow',
  };
  const response = await fetch('https://vip.meishubao.com/admin/network_task.html', requestOptions);
  try {
    const result = await response.json();
    if (result?.status == 0) {
      return true;
    }
    if (result?.msg == '被指派客服当前任务数已满') {
      return '此id已满了';
    }
    return false;
  } catch (error) {
    console.log(error.message, error.stack);
    return false;
  }
}
/** 获取当前页面所有订单的id
 * 获取当前页面所有订单的id
 */
function getAllTaskIdThisPage() {
  let thisPageAllTaskLiEle = document.getElementsByClassName('network_task');
  thisPageAllTaskLiEle = Array.from(thisPageAllTaskLiEle);
  if (thisPageAllTaskLiEle.length < 1) return [];
  const taskIdList = [];
  thisPageAllTaskLiEle.forEach((li, index) => {
    let receivedBtn = li.getElementsByClassName('task_2receive')[0];
    let taskId = receivedBtn.getAttribute('data-id');
    taskIdList.push(taskId);
  });
  // 返回当前页面获取的所有订单id
  return taskIdList;
}
/** 获取一个订单id
 *
 * @returns
 */
function getOneTaskIdThisPage() {
  let thisPageOneTaskLiEle = document.getElementsByClassName('network_task')[0];
  if (!thisPageOneTaskLiEle) {
    alert_ori('当前页面没有单子了');
    localStorage.removeItem('isAutoAssign');
    // 刷新
    reloadQuery();
    return;
  }
  let receivedBtn = thisPageOneTaskLiEle.getElementsByClassName('task_2receive')[0];
  let taskId = receivedBtn.getAttribute('data-id');
  return taskId;
}
/** 基于BS 主题 创建按钮
 * 基于BS 主题 创建按钮
 * @param {String} theme
 * @param {String} text
 * @param {String} h 高度 单位px
 * @returns 返回创建的元素
 */
function create_btn_base_on_bs(theme, text, h = '35px') {
  let temp_btn = document.createElement('button');
  temp_btn.classList.add('btn');
  temp_btn.classList.add(theme);
  temp_btn.style.cssText = `
    box-sizing: border-box;
    width: 130px;
    height: 50px;
    text-align: center;
    line-height: 0px;
    padding: 10px;
    margin-left: 5px;
    margin-top: 8px;
    color: rgb(255, 255, 255);
    position: fixed;
    top: 110px;
    right: 45px;
  `;
  temp_btn.innerText = text;
  return temp_btn;
}
// 弹出定制信息框
function alert_ori(text, theme = null) {
  alertify.log(text, theme, 1000);
}
/**创建带label的input选择框
 *
 * @param {String} forId 唯一id
 * @param {String} text  checkbox文本
 * @param {String} labelColor 颜色
 * @param {Element} parentElement 父元素
 * @param {String} antoherCSS
 * @returns
 */
function create_checkbox_with_label(forId, text, labelColor, parentElement, antoherCSS = null) {
  let temp_label = document.createElement('label');
  temp_label.setAttribute('for', forId);
  temp_label.innerText = text;
  temp_label.style.cssText = `
    position: fixed;
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
    top: 50px;
    right: 45px;
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
  return temp_checkbox;
}
function reloadQuery() {
  const btn_network_tasks = document.getElementById('btn_network_tasks');
  btn_network_tasks.click();
}
// 判断用户列表是否获取 没获取就获取一下
let allUserInfoList = JSON.parse(localStorage.getItem('allUserInfoList'));
if (!allUserInfoList) {
  (async () => {
    allUserInfoList = await initSetUserList();
    alert_ori('oriX---获取用户列表数据成功');
  })();
}
/** @本次指派弹出的选中 */
// 修改本次指派人群按钮
const assignThisTimeBtn = create_btn_base_on_bs('btn-info', '设置本次指派');
network_task.append(assignThisTimeBtn);
/** 基于userInfo 及上次的获取 构建 输入组
 *
 * @param {Array|Object} userInfoObj
 * @param {Array} userIdList
 * @returns
 */
function create_check_input_dom(userInfoObj, userIdList) {
  let temp_dom = '';
  Object.keys(userInfoObj).forEach((userName, index) => {
    if (index % 2 == 0) {
      temp_dom += `
          </div>
          <div class="row" style="margin-bottom:10px;">
            <div class="input-group col-6">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <input type="checkbox" class='assigned_user_checkout' data-userId=${userInfoObj[userName]} ${
        userIdList.includes(userInfoObj[userName]) ? 'checked' : ''
      }>
                </div>
              </div>
              <input type="text" class="form-control" aria-label="Text input with checkbox" value=${userName}>
            </div>
          `;
    } else {
      temp_dom += `
            <div class="input-group col-6">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <input type="checkbox" class='assigned_user_checkout' data-userId=${userInfoObj[userName]} ${
        userIdList.includes(userInfoObj[userName]) ? 'checked' : ''
      }>
                </div>
              </div>
              <input type="text" class="form-control" value=${userName} >
            </div>
        `;
    }
  });
  return temp_dom;
}
/** 基于输入组dom' 构建 modal dom
 * @param {String} input_dom
 */
function create_assigned_config_modal_dom(input_dom) {
  let tempDiv = document.createElement('div');
  tempDiv.innerHTML = `
      <div
        class="modal fade"
        id="autoAssignedModal_Orix"
        tabindex="-1"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title h5" id="autoAssignedModal_OrixLabel">
                配置本次指派
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div class="modal-body"id="ori_task_edit_modal_body">
              <div class="accordion" id="accordionOri">
                ${input_dom}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" id="save_thisTime_assigned_config_ori" data-dismiss="modal">保存</button>
            </div>
          </div>
        </div>
      </div>
    `;
  document.body.appendChild(tempDiv);
}
assignThisTimeBtn.onclick = function () {
  const lastTimeUserIdList = JSON.parse(localStorage.getItem('thisTimeUserIdList')) || [];
  console.log('lastTimeUserIdList', lastTimeUserIdList);
  // 创建模态框的DOM
  const create_input_dom = create_check_input_dom(allUserInfoList, lastTimeUserIdList);
  create_assigned_config_modal_dom(create_input_dom);
  // 显示模态框
  $('#autoAssignedModal_Orix').modal();
  // 获取所有的checkbox
  let check_boxs = document.getElementsByClassName('assigned_user_checkout');
  // 给所有的checkbox加上事件
  $('.assigned_user_checkout').each(function () {
    $(this).on('change', function () {
      var thisCK = $(this).prop('checked');
      $(this).attr('checked', thisCK);
    });
  });
  // 保存按钮
  const save_thisTime_btn = document.getElementById('save_thisTime_assigned_config_ori');
  // 保存事件
  save_thisTime_btn.onclick = function () {
    const thisTimeUserIdList = [];
    for (const checkBox of check_boxs) {
      let checked = checkBox.getAttribute('checked') || null;
      // 如果存在 则保存
      if (checked) {
        let userId = checkBox.getAttribute('data-userId');
        thisTimeUserIdList.push(userId);
      }
    }
    localStorage.setItem('thisTimeUserIdList', JSON.stringify(thisTimeUserIdList));
    localStorage.setItem('copyThisTimeUserIdList', JSON.stringify(thisTimeUserIdList));
  };
};
/** @自动派单 */
// 自动指派程序
async function autoAssigned() {
  console.log('自动派单执行一次');
  // 获取本地储存 已经满了的id
  let thisTimeFullUserId = localStorage.getItem('thisTimeFullUserId') || '[]';
  thisTimeFullUserId = JSON.parse(thisTimeFullUserId);
  console.log('full_userList', thisTimeFullUserId);
  // 获取本地储存的本次要派单的用户信息
  let copyUserIdList = JSON.parse(localStorage.getItem('copyThisTimeUserIdList'));
  if (copyUserIdList.length == 0) {
    copyUserIdList = JSON.parse(localStorage.getItem('thisTimeUserIdList'));
  }
  // 2.获取一个任务id
  const temp_id = getOneTaskIdThisPage();
  // 如果没有任务id 直接return 刷新页面
  if (!temp_id) return;
  // 1.从本地数组取出一个人
  // 判断该id是否已经满了
  let temp_u_id = null;
  for (const u_id of copyUserIdList) {
    // 如果
    if (!thisTimeFullUserId.includes(u_id)) {
      temp_u_id = u_id;
    }
  }
  if (!temp_u_id) {
    alert_ori('当前所有选中人的库都满了，自动指派停止运行');
    localStorage.removeItem('isAutoAssign');
    // 刷新
    reloadQuery();
  }
  // 3.请求接口 去自动派单
  const result = await assignDutiesToUser(temp_id, temp_u_id);
  if (result == '此id已满了') {
    thisTimeFullUserId.push(temp_u_id);
    localStorage.setItem('thisTimeFullUserId', JSON.stringify(thisTimeFullUserId));
  }
  // 不管成功与否 都给下一个人进行派单
  localStorage.setItem('copyThisTimeUserIdList', JSON.stringify(copyUserIdList));
  // 再刷新一下
  reloadQuery();
}
// 是否开启自动指派
let isAutoAssign = localStorage.getItem('isAutoAssign');

// 增加自动指派的按钮
const ori_autoAssignedBtn = create_checkbox_with_label('ori_autoAssigned', '自动指派', '#7ecdb6', network_task);
// 如果当前是自动指派的状态
if (isAutoAssign) {
  // 将派单这个checkout框先选中
  ori_autoAssignedBtn.checked = true;
  autoAssigned();
}
// 自动指派选中状态改变的DOM事件
ori_autoAssignedBtn.onclick = function () {
  if (ori_autoAssignedBtn.checked) {
    localStorage.setItem('isAutoAssign', true);
    localStorage.setItem('thisTimeFullUserId', '[]');
    reloadQuery();
  } else {
    localStorage.removeItem('isAutoAssign');
  }
};
