// ==UserScript==
// @name        工具箱
// @namespace   Violentmonkey Scripts
// @match       https://rm.vankeservice.com/*
// @match       http://localhost:8010/*
// @grant       none
// @version     1.9
// @author      Hut
// @require      https://unpkg.com/petite-vue
// @description 2023/2/16 10:56:00
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462247/%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/462247/%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==


window.setTimeout(() => {
  (async function () {
    'use strict';
    Date.prototype.format = function (fmt) {
      var o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
    const { createApp } = PetiteVue;

    const root = document.createElement('div');
    root.class = 'hut_draw_wrap';
    root.innerHTML = `
  
      <div v-show="isNew && !popup" class="hut_draw" @click="deleteOrCalcRow()" style='bottom:20%'><svg t="1702100384162" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3602" width="40" height="40"><path d="M827.871087 196.128913C743.498468 111.756293 631.321596 65.290005 512 65.290005c-119.319549 0-231.499491 46.465265-315.871087 130.837884S65.290005 392.680451 65.290005 512s46.465265 231.499491 130.837884 315.871087 196.551538 130.837884 315.871087 130.837884c119.321596 0 231.499491-46.465265 315.871087-130.837884S958.708971 631.319549 958.708971 512 912.243707 280.500509 827.871087 196.128913zM531.556405 917.246651l0-74.145697c0-11.31572-9.174963-20.491707-20.491707-20.491707-11.316743 0-20.491707 9.174963-20.491707 20.491707l0 74.059739C283.276738 906.322857 116.693746 739.164766 106.755396 531.634176l72.351841 0c11.31572 0 20.491707-9.174963 20.491707-20.491707 0-11.31572-9.174963-20.491707-20.491707-20.491707l-72.273047 0c10.769274-206.737528 177.01253-373.005342 383.740848-383.813502l0 72.346725c0 11.316743 9.174963 20.491707 20.491707 20.491707 11.31572 0 20.491707-9.17394 20.491707-20.491707L531.558451 106.752326c207.593012 9.901511 374.807385 176.539762 385.609405 383.89946l-74.142627 0c-11.316743 0-20.491707 9.174963-20.491707 20.491707 0 11.316743 9.174963 20.491707 20.491707 20.491707l74.220399 0C907.275555 739.78796 739.720422 907.317511 531.556405 917.246651z" fill="#272636" p-id="3603"></path><path d="M532.098757 503.118726 532.098757 258.240529c0-11.316743-9.174963-20.491707-20.491707-20.491707-11.31572 0-20.491707 9.17394-20.491707 20.491707l0 254.66612c0 7.858992 4.429893 14.677281 10.924817 18.114566L693.447539 722.42757c4.002151 4.000104 9.245572 6.001691 14.490016 6.001691s10.487865-2.001587 14.490016-6.001691c8.002254-8.002254 8.002254-20.977777 0-28.980032L532.098757 503.118726z" fill="#272636" p-id="3604"></path></svg></div>
  <div v-show="isNew && !popup" class="hut_draw" @click="CalcRow()" style='bottom:15%'><svg t="1702104255336" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4794" width="40" height="40"><path d="M228.693333 85.333333c11.264 0 21.162667-9.898667 21.162667-21.162666V21.504C249.856 10.24 239.957333 0.341333 228.693333 0.341333c-11.264 0-21.162667 9.898667-21.162666 21.162667v42.666667c0 11.264 9.898667 21.162667 21.162666 21.162666z m130.730667 242.688c-8.533333-8.533333-21.162667-8.533333-29.696 0-8.533333 8.533333-8.533333 21.162667 0 29.696l29.696 29.696c8.533333 8.533333 21.162667 8.533333 29.696 0 8.533333-8.533333 8.533333-21.162667 0-29.696l-29.696-29.696z m0-201.386666l29.696-29.696c8.533333-8.533333 8.533333-21.162667 0-29.696-8.533333-8.533333-21.162667-8.533333-29.696 0l-29.696 29.696c-8.533333 8.533333-8.533333 21.162667 0 29.696 8.533333 8.533333 21.162667 8.533333 29.696 0z m11.264 100.693333c0 11.264 9.898667 21.162667 21.162667 21.162667h42.666666c11.264 0 21.162667-9.898667 21.162667-21.162667 0-11.264-9.898667-21.162667-21.162667-21.162667h-42.666666c-11.264 0-21.162667 9.898667-21.162667 21.162667zM235.861333 340.992c62.464 0 113.664-51.2 113.664-113.664 0-62.464-51.2-113.664-113.664-113.664s-113.664 51.2-113.664 113.664c0.341333 62.464 51.2 113.664 113.664 113.664z m0-184.661333c39.594667 0 70.997333 31.061333 70.997334 70.997333 0 39.594667-31.061333 70.997333-70.997334 70.997333-39.594667 0-70.997333-31.061333-70.997333-70.997333 0-39.594667 31.402667-70.997333 70.997333-70.997333z m772.096 564.906666c4.096-12.629333 7.168-26.965333 8.533334-39.594666h1.365333v-4.096c21.162667-146.090667-62.464-292.522667-207.189333-344.746667-159.061333-58.026667-333.482667 18.432-401.749334 170.325333-2.730667 7.168 36.864 21.162667 39.594667 15.701334 2.730667-5.802667 5.802667-11.264 8.533333-18.432 12.629333-9.898667 36.864-11.264 51.2-5.802667 18.432 7.168 28.330667 26.965333 21.162667 45.397333h1.365333c-1.365333 1.365333-1.365333 4.096-2.730666 5.802667-2.730667 7.168 36.864 21.162667 39.594666 15.701333 2.730667-7.168 7.168-14.336 9.898667-19.797333 9.898667-9.898667 24.234667-12.629333 36.864-8.533333 18.432 7.168 28.330667 26.965333 21.162667 45.397333l39.594666 14.336c4.096-11.264 12.629333-18.432 22.869334-21.162667l-124.928 342.016c-29.696 7.168-56.661333 21.162667-83.626667 36.864v-139.264c19.797333-22.869333 36.864-39.594667 42.666667-45.397333 11.264-11.264-14.336-42.666667-42.666667-14.336-22.869333 22.869333-113.664 127.658667-113.664 127.658667H191.829333c-31.061333 0-56.661333 25.6-56.661333 56.661333V972.8c-79.530667 15.701333-113.664 49.834667-113.664 49.834667h993.621333s-25.6-38.229333-184.661333-42.666667c-65.194667-1.365333-88.064-70.997333-198.656-70.997333h-9.898667l117.76-322.218667c5.802667 8.533333 7.168 19.797333 4.096 31.061333l39.594667 14.336c7.168-18.432 26.965333-28.330667 45.397333-21.162666 18.432 7.168 28.330667 26.965333 21.162667 45.397333v2.730667c-1.365333 7.168 36.864 19.797333 39.594667 14.336v-1.365334c7.168-18.432 26.965333-28.330667 45.397333-21.162666 14.336 4.096 31.061333 17.066667 36.864 31.061333-1.365333 8.533333-2.730667 17.066667-5.802667 25.6-0.341333 6.826667 39.253333 20.821333 41.984 13.653333z m-559.104 245.76c-42.666667 7.168-103.765333 2.730667-212.992-1.365333-21.162667-1.365333-39.594667 0-56.661333 1.365333v-29.696c0-8.533333 5.802667-14.336 14.336-14.336h197.290667s26.965333-29.696 58.026666-63.829333v107.861333z m113.664-479.914666c-8.533333-14.336-22.869333-26.965333-39.594666-32.768-9.898667-4.096-19.797333-5.802667-31.061334-5.802667 62.464-70.997333 157.696-105.130667 251.221334-89.429333 2.730667 1.365333 5.802667 2.730667 7.168 5.802666-73.045333 15.701333-140.970667 59.733333-187.733334 122.197334z m280.917334 83.968c-21.162667-7.168-42.666667-5.802667-62.464 4.096-8.533333-18.432-24.234667-35.498667-45.397334-42.666667-21.162667-7.168-42.666667-5.802667-62.464 4.096-8.533333-18.432-24.234667-35.498667-45.397333-42.666667-4.096-1.365333-9.898667-2.730667-14.336-4.096 45.397333-49.834667 109.226667-82.261333 176.128-89.429333 44.032 48.128 68.266667 111.957333 69.632 178.858667-3.072-2.730667-8.533333-5.461333-15.701333-8.192z m106.496 39.594666c-17.066667-5.802667-32.768-5.802667-48.128-1.365333 5.802667-75.093333-14.336-149.162667-56.661334-208.554667h8.533334c75.093333 49.834667 120.490667 133.461333 123.562666 221.525334-8.874667-4.437333-17.408-8.874667-27.306666-11.605334zM65.536 248.832c11.264 0 21.162667-9.898667 21.162667-21.162667 0-11.264-9.898667-21.162667-21.162667-21.162666H22.869333c-11.264 0-21.162667 9.898667-21.162666 21.162666 0 11.264 9.898667 21.162667 21.162666 21.162667h42.666667z m141.994667 141.653333v42.666667c0 11.264 9.898667 21.162667 21.162666 21.162667 11.264 0 21.162667-9.898667 21.162667-21.162667v-42.666667c0-11.264-9.898667-21.162667-21.162667-21.162666-11.264 0-21.162667 9.898667-21.162666 21.162666z m-109.226667-62.464l-29.696 29.696c-8.533333 8.533333-8.533333 21.162667 0 29.696 8.533333 8.533333 21.162667 8.533333 29.696 0l29.696-29.696c8.533333-8.533333 8.533333-21.162667 0-29.696-8.533333-8.192-21.162667-8.192-29.696 0z m0-201.386666c8.533333 8.533333 21.162667 8.533333 29.696 0 8.533333-8.533333 8.533333-21.162667 0-29.696l-29.696-29.696c-8.533333-8.533333-21.162667-8.533333-29.696 0-8.533333 8.533333-8.533333 21.162667 0 29.696l29.696 29.696z m0 0" p-id="4795"></path></svg></div>
  <div v-show="!popup" class="hut_draw" @click="open"><svg t="1676515999623" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4083" width="40" height="40"><path d="M536.508695 515.037173 533.082666 506.909052 528.910647 510.318708Z" fill="#FFFFFF" p-id="4084"></path><path d="M431.339424 549.69553 194.782753 549.69553c-21.871123 0-39.666418 17.796318-39.666418 39.667441l0 236.553601c0 21.87317 17.795295 39.667441 39.666418 39.667441l236.556671 0c21.871123 0 39.665395-17.794271 39.665395-39.667441L471.004819 589.362972C471.004819 567.491849 453.210547 549.69553 431.339424 549.69553zM430.205601 824.780703 195.9176 824.780703 195.9176 590.497818l234.288001 0L430.205601 824.780703z" fill="#252135" p-id="4085"></path><path d="M192.211185 508.24242l236.557694 0c21.871123 0 39.665395-17.794271 39.665395-39.664372l0-236.557694c0-21.871123-17.794271-39.664372-39.665395-39.664372L192.211185 192.355983c-21.871123 0-39.664372 17.793248-39.664372 39.664372l0 236.557694C152.547837 490.448148 170.340061 508.24242 192.211185 508.24242zM193.349101 233.155201l234.284931 0 0 234.285954L193.349101 467.441155 193.349101 233.155201z" fill="#252135" p-id="4086"></path><path d="M813.097104 547.127032 576.541457 547.127032c-21.862937 0-39.646975 17.794271-39.646975 39.665395l0 236.555647c0 21.871123 17.784038 39.665395 39.646975 39.665395l236.555647 0c21.881356 0 39.683814-17.794271 39.683814-39.665395L852.780919 586.792427C852.780919 564.921303 834.978461 547.127032 813.097104 547.127032zM811.980677 822.213227 577.69677 822.213227 577.69677 587.927273l234.283908 0L811.980677 822.213227z" fill="#252135" p-id="4087"></path><path d="M859.52553 314.327942 720.943264 175.745676c-7.087419-7.064906-16.504906-10.956539-26.51591-10.956539-10.008958 0-19.422352 3.891633-26.5374 10.981099L529.377274 314.303382c-7.110955 7.089465-11.026124 16.522302-11.026124 26.561959s3.91517 19.473517 11.000542 26.536376l138.539286 138.559752c7.080256 7.080256 16.501836 10.980076 26.529213 10.980076 10.016121 0 19.436678-3.891633 26.547633-10.980076L859.550089 367.380228C874.147552 352.73774 874.136296 328.939731 859.52553 314.327942zM694.429401 471.41363 563.900555 340.865341 694.429401 210.318076l130.547265 130.547265L694.429401 471.41363z" fill="#252135" p-id="4088"></path></svg></div>
  
      <div v-if="popup" class="hut_popup">
        <div class="hut_head">
          <div class="hut_home" @click="pageType = 'home'">工具箱</div>
           <div class="hut_close" @click="popup = false">X</div>
        </div>
  
        <div class="hut_content-container">
  
          <div class="hut_component home_page" v-if="pageType == 'home'">
            <div class="home_item" @click="openAttendance()">
              <div class="icon"><svg t="1679378164091" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5912" width="64" height="64"><path d="M896 462.570667A255.573333 255.573333 0 0 0 810.666667 448c-141.376 0-256 114.624-256 256 0 89.045333 45.461333 167.466667 114.432 213.333333H85.333333a85.333333 85.333333 0 0 1-85.333333-85.333333V277.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h128v32a53.333333 53.333333 0 1 0 106.666667 0V192h234.666667v32a53.333333 53.333333 0 1 0 106.666666 0V192h149.333334a85.333333 85.333333 0 0 1 85.333333 85.333333v185.237334zM192 362.666667a42.666667 42.666667 0 1 0 0 85.333333h512a42.666667 42.666667 0 1 0 0-85.333333H192zM608 106.666667A32 32 0 0 1 640 138.666667v85.333333a32 32 0 0 1-64 0v-85.333333A32 32 0 0 1 608 106.666667z m-341.333333 0A32 32 0 0 1 298.666667 138.666667v85.333333a32 32 0 0 1-64 0v-85.333333A32 32 0 0 1 266.666667 106.666667zM810.666667 917.333333c-117.824 0-213.333333-95.509333-213.333334-213.333333s95.509333-213.333333 213.333334-213.333333 213.333333 95.509333 213.333333 213.333333-95.509333 213.333333-213.333333 213.333333z m20.202666-173.226666l13.482667-173.226667c0-19.264-13.482667-35.306667-33.685333-35.306667-16.853333 0-33.685333 12.842667-33.685334 32.085334l13.482667 176.426666c3.370667 9.642667 10.090667 16.064 20.202667 16.064s16.853333-6.421333 20.202666-16.042666zM810.666667 849.962667a33.685333 33.685333 0 1 0 0-67.370667 33.685333 33.685333 0 0 0 0 67.370667z" fill="#FF6033" p-id="5913"></path></svg></div>
              <div class="name">迟到早退</div>
            </div>
          </div>
  
          <div class="hut_component" v-if="pageType == 'attendance'">
            <div class="wx_loading" v-if="loading">
              <svg class="circular" viewBox="25 25 50 50">
                <circle class="path" cx="50" cy="50" r="20" fill="none" />
              </svg>
            </div>
            <div class="button_head">
              <select v-model="selectedDepartments" multiple="multiple" class="selectedDepartments" style="height: 24px;margin-top: 2px;">
                <option style="display:none"></option>
                <option v-for="dep in authorizedDepartments" v-bind:value="dep.department_id">{{dep.department_name}}</option>
              </select>&nbsp;&nbsp;
              <input type="year" v-model="year" placeholder="请选择" style="margin-left: 180px;">&nbsp;&nbsp;
              <input type="date" v-model="beginDate" placeholder="请选择">-
              <input type="date" v-model="endDate" placeholder="请选择">&nbsp;&nbsp;
              <button type="button" @click="getAttendanceResults()" class="button primary">统计</button>
              <button type="button" @click="exportException()" class="button">导出</button>
              <button type="button" @click="exportSubsidy()" class="button">导出高温补贴</button>
            </div>
            <div class="title">异常数据</div>
            <div class="exception_content">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <thead>
                  <tr style="height:24px">
                    <th v-for="item in attendanceItems">{{item.name}}</th>
                    <th>操作</th>
                  </tr>
  
                </thead>
                <tbody>
                  <tr v-for="(row,index) in attendanceExceptionList" style="height:24px;">
                    <td v-for="item in attendanceItems">{{ row[item.key] }}</td>
                    <td>
                      <a @click="location(row)">定位</a>
                      <a @click="deleteException(index)">删除</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="title">所有数据</div>
            <div class="all_attendance_content">
               <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <thead>
                  <tr style="height:24px">
                    <th v-for="item in attendanceItems">{{item.name}}</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row,index) in allAttendanceDataList" style="height:24px" v-bind:id="index" v-bind:style="{'background-color':row.mark?'#eee':''}">
                    <td v-for="item in attendanceItems">{{ row[item.key] }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
        </div>
  
      </div>
    `;


    document.body.appendChild(root); // 插入DOM

    const temp = document.createElement('div');
    temp.innerHTML = `
    <div>
    <div style="margin-bottom:10px">
    岗位：
    <select multiple="true" v-model="schedule.standardWorkJobs" >
    <option style="display:none"></option>
    <option v-for="job in schedule.allJobs" v-bind:value="job.workJobId">{{job.workJobName}}</option>
  </select>
  (已选择{{schedule.standardWorkJobs.length}}项，按住ctrl键后点击鼠标左键增加/删减岗位，ctrl+F搜索)
    
    </div>
      <div style="display:flex;gap:20px">
      <div>项目：
      <select v-model="schedule.crtDepartments" >
      <option style="display:none"></option>
      <option v-for="dep in schedule.allDepartments" v-bind:value="dep.department_id">{{dep.department_name}}</option>
    </select>
      </div>
     

      <div>年：
      <input type="text" v-model="schedule.selectYear" placeholder="例：2024" style="width:100px">
      </div>

      <div>开始日期：
      <input type="text" v-model="schedule.beginDate" placeholder="例：9/20/2024" style="width:100px">
      </div>

      <div>结束日期：
      <input type="text" v-model="schedule.endDate" placeholder="例：9/30/2024" style="width:100px">
      </div>

      <button type="button" @click="nextDepartment()" class="button">下一项目</button>
      <button type="button" @click="getSchedule()" class="button">查询</button>
       <button type="button" @click="sendSchedule()" class="button">修改</button>
      </div>
    <div>{{schedule.names}}(共{{schedule.employees.length}}人)</div>
      <div v-if="schedule.employees?.length > 0">
               <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <thead>
                  <tr style="height:24px;text-align:left">
                  <th>姓名</th>
                  <th>岗位</th>
                    <th v-for="(item,index) in schedule.employees[0]?.schedules">
                    {{item.onDutyDay}}({{item.day}})
                    <input type="checkbox" v-model="item.selected" >
                    </th>
  
                  </tr>
  
                </thead>
                <tbody>
                  <tr v-for="(row,index) in schedule.employees" style="height:24px;">
                  <td>{{row.name}}</td>
                  <td>{{row.jobName}}</td>  
                  <td v-for="item in row.schedules">{{ item.isSend ? '已修改':'未修改' }}</td>
  
                  </tr>
                </tbody>
              </table>
      </div>
    </div>
    `
    document.querySelector('#page-wrapper')?.appendChild(temp)




    // petite-vue init初始化
    createApp({
      popup: false,
      loading: false,
      pageType: 'home',
      attendanceExceptionList: [],
      highTemperatureSubsidy: {
        date: [],
        list: []
      },

      allAttendanceDataList: [],
      preMarkItem: null,
      authorizedDepartments: [],
      selectedDepartments: [],
      beginDate: null,
      endDate: null,
      year: '2023',
      isNew: document.location.href.includes('https://rm.vankeservice.com/new'),
      attendanceItems: [
        {
          name: '公司',
          key: 'company'
        },
        {
          name: '项目/部门',
          key: 'department'
        },
        {
          name: '姓名',
          key: 'employeeName'
        },
        {
          name: '日期',
          key: 'onDutyDate'
        },
        {
          name: '岗位',
          key: 'jobName'
        },
        {
          name: '班次',
          key: 'shiftName'
        },
        {
          name: '开始时间',
          key: 'beginTime'
        },
        {
          name: '结束时间',
          key: 'endTime'
        },
        {
          name: '上班时间',
          key: 'actualOnDutyTime'
        },
        {
          name: '下班时间',
          key: 'actualOffDutyTime'
        },

      ],

      schedule: {
        url: null,
        employees: [],
        names: '',
        allDepartments: [
          {
            "department_id": "6050940915",
            "department_name": "ZB重庆渝能国际"
          },
          {
            "department_id": "0036470164",
            "department_name": "Z重庆首创光和城"
          },
          {
            "department_id": "0036600001",
            "department_name": "重庆锦程"
          },
          {
            "department_id": "0036600002",
            "department_name": "重庆西九"
          },
          {
            "department_id": "0036600003",
            "department_name": "重庆西城"
          },
          {
            "department_id": "0036600004",
            "department_name": "重庆万科锦尚"
          },
          {
            "department_id": "0036600007",
            "department_name": "Z重庆首创鸿恩国际"
          },
          {
            "department_id": "0036600008",
            "department_name": "H62重庆第二分公司本部"
          },
          {
            "department_id": "6050906902",
            "department_name": "重庆瑞丰鹅岭山"
          },
          {
            "department_id": "6050909252",
            "department_name": "重庆翡翠天麓"
          },
          {
            "department_id": "6050909430",
            "department_name": "Q重庆北麓官邸"
          },
          {
            "department_id": "6050912180",
            "department_name": "Z重庆首创西江阅"
          },
          {
            "department_id": "6050912182",
            "department_name": "Q重庆翠海朗园"
          },
          {
            "department_id": "6050913762",
            "department_name": "Q重庆通用晶城"
          },
          {
            "department_id": "6050921754",
            "department_name": "重庆翡翠方舟"
          },
          {
            "department_id": "6050925459",
            "department_name": "重庆翡翠云阶"
          },
          {
            "department_id": "6050926346",
            "department_name": "重庆彩云湖"
          },
          {
            "department_id": "6050931030",
            "department_name": "重庆万科招商理想城"
          },
          {
            "department_id": "6050940912",
            "department_name": "ZB重庆翡丽锦悦"
          },
          {
            "department_id": "6050941893",
            "department_name": "H62市场组"
          },
          {
            "department_id": "6050951001",
            "department_name": "重庆天空之城"
          },
          {
            "department_id": "6050957963",
            "department_name": "重庆锦绣滨江"
          },
          {
            "department_id": "6050959302",
            "department_name": "重庆江南万科城"
          },
          {
            "department_id": "6050963404",
            "department_name": "重庆翡翠湖山"
          },
          {
            "department_id": "6050967307",
            "department_name": "重庆石坪桥蝶城维修管理部"
          },
          {
            "department_id": "6050967308",
            "department_name": "重庆石坪桥蝶城机动维修队"
          },
          {
            "department_id": "6050967343",
            "department_name": "重庆石坪桥蝶城调度中心"
          },
          {
            "department_id": "6050967359",
            "department_name": "重庆石坪桥蝶城家政维修组"
          },
          {
            "department_id": "6050967360",
            "department_name": "重庆石坪桥蝶城驻场维修组"
          },
          {
            "department_id": "6050968859",
            "department_name": "H62维修作业部"
          },
          {
            "department_id": "6050971006",
            "department_name": "H62机动作业队"
          },
          {
            "department_id": "6050971007",
            "department_name": "重庆化龙桥蝶城维修组"
          },
          {
            "department_id": "6050971008",
            "department_name": "重庆石坪桥蝶城维修组"
          },
          {
            "department_id": "6050971009",
            "department_name": "Z重庆首创西江阅维修组"
          },
          {
            "department_id": "6050971010",
            "department_name": "ZB重庆翡丽锦悦维修组"
          },
          {
            "department_id": "6050971011",
            "department_name": "重庆江南万科城维修组"
          },
          {
            "department_id": "6050971012",
            "department_name": "Z重庆首创光和城维修组"
          },
          {
            "department_id": "6050971013",
            "department_name": "重庆万科招商理想城维修组"
          },
          {
            "department_id": "6050971014",
            "department_name": "重庆锦绣滨江维修组"
          },
          {
            "department_id": "6050971015",
            "department_name": "重庆瑞丰鹅岭山维修组"
          },
          {
            "department_id": "6055000291",
            "department_name": "H62机动作业二队"
          },
          {
            "department_id": "0036470002",
            "department_name": "重庆渝园.朗润园"
          },
          {
            "department_id": "0036470006",
            "department_name": "重庆缇香郡"
          },
          {
            "department_id": "0036470007",
            "department_name": "重庆悦府.悦峰"
          },
          {
            "department_id": "0036470016",
            "department_name": "重庆万科城"
          },
          {
            "department_id": "0036600005",
            "department_name": "重庆金域学府·翰林"
          },
          {
            "department_id": "0036600006",
            "department_name": "重庆金域学府·翰江"
          },
          {
            "department_id": "6050901048",
            "department_name": "重庆蓝澳岛"
          },
          {
            "department_id": "6050901896",
            "department_name": "重庆中开·熙岸A区"
          },
          {
            "department_id": "6050916374",
            "department_name": "Q重庆松龙国际"
          },
          {
            "department_id": "6050920769",
            "department_name": "重庆金开悦府"
          },
          {
            "department_id": "6050923666",
            "department_name": "Q重庆中核·天玺一品"
          },
          {
            "department_id": "6050929821",
            "department_name": "重庆星光森林"
          },
          {
            "department_id": "6050940907",
            "department_name": "ZB重庆哈罗小镇"
          },
          {
            "department_id": "6050940917",
            "department_name": "ZB重庆长悦府"
          },
          {
            "department_id": "6050943651",
            "department_name": "重庆永川万科城"
          },
          {
            "department_id": "6050950953",
            "department_name": "Q重庆首钢铂鹭风华"
          },
          {
            "department_id": "6050951630",
            "department_name": "H64重庆第四分公司本部"
          },
          {
            "department_id": "6050951638",
            "department_name": "H64市场组"
          },
          {
            "department_id": "6050954468",
            "department_name": "重庆万科璞园"
          },
          {
            "department_id": "6050958014",
            "department_name": "Q重庆中核·天玺一品四期"
          },
          {
            "department_id": "6050959047",
            "department_name": "Q重庆中兴西南智慧城市产业园北区"
          },
          {
            "department_id": "6050959981",
            "department_name": "重庆永川万科城二期"
          },
          {
            "department_id": "6050967646",
            "department_name": "H64维修作业部"
          },
          {
            "department_id": "6050967731",
            "department_name": "H64机动作业队"
          },
          {
            "department_id": "6050967732",
            "department_name": "重庆人和蝶城维修组"
          },
          {
            "department_id": "6050968268",
            "department_name": "Q重庆常青藤人文别墅"
          },
          {
            "department_id": "6050968862",
            "department_name": "重庆海棠溪蝶城维修组"
          },
          {
            "department_id": "6050968863",
            "department_name": "重庆回兴蝶城维修组"
          },
          {
            "department_id": "6050968864",
            "department_name": "重庆渝能国际维修组"
          },
          {
            "department_id": "6050968865",
            "department_name": "重庆长悦府维修组"
          },
          {
            "department_id": "6050968866",
            "department_name": "渝园朗润园维修组"
          },
          {
            "department_id": "6050968867",
            "department_name": "重庆松龙国际维修组"
          },
          {
            "department_id": "6050968868",
            "department_name": "重庆缇香郡维修组"
          },
          {
            "department_id": "6050968869",
            "department_name": "重庆悦府悦峰维修组"
          },
          {
            "department_id": "6050968870",
            "department_name": "万科璞园维修组"
          },
          {
            "department_id": "6050968871",
            "department_name": "首钢铂鹭风华维修组"
          },
          {
            "department_id": "6050968872",
            "department_name": "哈罗小镇维修组"
          },
          {
            "department_id": "6050968873",
            "department_name": "永川万科城维修组"
          },
          {
            "department_id": "6050968874",
            "department_name": "永川万科城2期维修组"
          },
          {
            "department_id": "6050968875",
            "department_name": "重庆中核天玺一品维修组"
          },
          {
            "department_id": "6050968876",
            "department_name": "重庆中核天玺一品四期维修组"
          },
          {
            "department_id": "6050968877",
            "department_name": "重庆中开·熙岸A区维修组"
          },
          {
            "department_id": "6050968878",
            "department_name": "重庆中兴西南智慧城市维修组"
          },
          {
            "department_id": "6055000293",
            "department_name": "H64机动作业二队"
          }
        ],
        crtDepartments: null,
        allJobs: [
          {
            "workJobId": "1000258546",
            "workJobName": "A01东莞第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258547",
            "workJobName": "A02东莞第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258548",
            "workJobName": "A03深圳第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258549",
            "workJobName": "A04深圳第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258550",
            "workJobName": "A05深圳第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258551",
            "workJobName": "A06深圳第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258552",
            "workJobName": "A07厦门第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258553",
            "workJobName": "A08厦门第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258554",
            "workJobName": "A09厦门第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258555",
            "workJobName": "A10厦门第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258556",
            "workJobName": "A11深圳第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258557",
            "workJobName": "A12东莞第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258558",
            "workJobName": "A13深圳第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258559",
            "workJobName": "A14深圳第七分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258560",
            "workJobName": "A15厦门第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258561",
            "workJobName": "A16厦门第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258562",
            "workJobName": "A18深圳第八分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258563",
            "workJobName": "A19东莞第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258564",
            "workJobName": "A20深圳第九分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258565",
            "workJobName": "A21东莞第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263621",
            "workJobName": "A22南宁第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269152",
            "workJobName": "A31广西物业管理部总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265684",
            "workJobName": "A51深圳第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265685",
            "workJobName": "A52深圳第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265686",
            "workJobName": "A53深圳第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265687",
            "workJobName": "A54深圳第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265692",
            "workJobName": "A55深圳第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265697",
            "workJobName": "A56深圳第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265693",
            "workJobName": "A57深圳第七分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265688",
            "workJobName": "A61厦门第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265690",
            "workJobName": "A62厦门第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265691",
            "workJobName": "A63厦门第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265695",
            "workJobName": "A64厦门第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265689",
            "workJobName": "A71福州第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265696",
            "workJobName": "A72福州第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265698",
            "workJobName": "A73福州第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265683",
            "workJobName": "A81南宁第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265699",
            "workJobName": "A82南宁第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265694",
            "workJobName": "A83海南第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258566",
            "workJobName": "B01杭州第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264941",
            "workJobName": "B02杭州第二分公司总经(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258567",
            "workJobName": "B02杭州第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258568",
            "workJobName": "B03江西第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258569",
            "workJobName": "B04杭州第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258570",
            "workJobName": "B05宁波第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258571",
            "workJobName": "B06宁波第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258572",
            "workJobName": "B07宁波第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258573",
            "workJobName": "B08宁波第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258574",
            "workJobName": "B09温州第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258575",
            "workJobName": "B11江西第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258576",
            "workJobName": "B12杭州第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12338",
            "workJobName": "B14上海第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12337",
            "workJobName": "B15上海第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12336",
            "workJobName": "B16上海第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12342",
            "workJobName": "B18上海第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12344",
            "workJobName": "B19上海第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266567",
            "workJobName": "B31杭州物业管理二部总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269149",
            "workJobName": "B32宁波物业管理二部总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265706",
            "workJobName": "B51上海第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265707",
            "workJobName": "B52上海第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265708",
            "workJobName": "B53上海第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265710",
            "workJobName": "B54上海第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265711",
            "workJobName": "B55上海第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265714",
            "workJobName": "B56上海第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265709",
            "workJobName": "B57上海第七分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265703",
            "workJobName": "B58宁波第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265704",
            "workJobName": "B59宁波第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265702",
            "workJobName": "B60嘉兴第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265700",
            "workJobName": "B71杭州第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265701",
            "workJobName": "B72杭州第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265712",
            "workJobName": "B73杭州第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265713",
            "workJobName": "B74杭州第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265705",
            "workJobName": "B75温州第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269150",
            "workJobName": "B91杭州物业管理一部总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269151",
            "workJobName": "B92宁波物业管理一部总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258577",
            "workJobName": "C01沈阳第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258578",
            "workJobName": "C02沈阳第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258579",
            "workJobName": "C03沈阳第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258580",
            "workJobName": "C04沈阳第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258581",
            "workJobName": "C05大连第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258582",
            "workJobName": "C06长春第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258583",
            "workJobName": "C07长春第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258584",
            "workJobName": "C08长春第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258585",
            "workJobName": "C10哈尔滨第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258586",
            "workJobName": "C11大连第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258587",
            "workJobName": "C12沈阳第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258588",
            "workJobName": "C13沈阳第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265715",
            "workJobName": "C51沈阳第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265716",
            "workJobName": "C52沈阳第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265717",
            "workJobName": "C53沈阳第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265718",
            "workJobName": "C54沈阳第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265725",
            "workJobName": "C55沈阳第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265726",
            "workJobName": "C56沈阳第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265719",
            "workJobName": "C57大连第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265724",
            "workJobName": "C58大连第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265720",
            "workJobName": "C61长春第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265721",
            "workJobName": "C62长春第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265722",
            "workJobName": "C63长春第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265723",
            "workJobName": "C64哈尔滨第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258589",
            "workJobName": "D01北京第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258590",
            "workJobName": "D02北京第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258591",
            "workJobName": "D03北京第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258592",
            "workJobName": "D04天津第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258593",
            "workJobName": "D05天津第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258594",
            "workJobName": "D06青岛第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258595",
            "workJobName": "D07青岛第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258596",
            "workJobName": "D08济南第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258597",
            "workJobName": "D09太原第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258598",
            "workJobName": "D10青岛第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258599",
            "workJobName": "D11北京第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258600",
            "workJobName": "D12天津第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258601",
            "workJobName": "D16北京第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258602",
            "workJobName": "D18北京第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258603",
            "workJobName": "D19济南第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258604",
            "workJobName": "D20天津第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265727",
            "workJobName": "D51北京第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265729",
            "workJobName": "D52北京第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265730",
            "workJobName": "D53北京第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265741",
            "workJobName": "D54北京第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265742",
            "workJobName": "D55北京第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265728",
            "workJobName": "D56北京第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265739",
            "workJobName": "D57北京第七分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265731",
            "workJobName": "D61天津第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265732",
            "workJobName": "D62天津第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265740",
            "workJobName": "D63天津第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265744",
            "workJobName": "D64天津第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265736",
            "workJobName": "D65太原第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265737",
            "workJobName": "D66太原第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265733",
            "workJobName": "D71青岛第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265734",
            "workJobName": "D72青岛第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265738",
            "workJobName": "D73青岛第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265735",
            "workJobName": "D74济南第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265743",
            "workJobName": "D75济南第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258605",
            "workJobName": "E01江苏第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258606",
            "workJobName": "E02无锡第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258607",
            "workJobName": "E03南京第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258608",
            "workJobName": "E04南京第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258609",
            "workJobName": "E05合肥第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258610",
            "workJobName": "E06江苏第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258611",
            "workJobName": "E07无锡第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258612",
            "workJobName": "E09上海第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258613",
            "workJobName": "E10上海第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258614",
            "workJobName": "E11上海第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258615",
            "workJobName": "E12南京第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258616",
            "workJobName": "E13江苏第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258617",
            "workJobName": "E14南京第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258618",
            "workJobName": "E15南京第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258619",
            "workJobName": "E16合肥第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258620",
            "workJobName": "E18江苏第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12345",
            "workJobName": "E18苏南第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258621",
            "workJobName": "E19上海第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258622",
            "workJobName": "E20上海第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258623",
            "workJobName": "E23上海第六分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258624",
            "workJobName": "E24江苏第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12346",
            "workJobName": "E24苏南第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265745",
            "workJobName": "E51江苏苏南第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265750",
            "workJobName": "E52江苏苏南第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265753",
            "workJobName": "E53江苏苏南第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265757",
            "workJobName": "E54江苏苏南第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265758",
            "workJobName": "E55江苏苏南第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265746",
            "workJobName": "E56无锡第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265751",
            "workJobName": "E57无锡第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265747",
            "workJobName": "E61南京第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265748",
            "workJobName": "E62南京第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265752",
            "workJobName": "E63南京第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265754",
            "workJobName": "E64南京第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265755",
            "workJobName": "E65南京第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265749",
            "workJobName": "E71合肥第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265756",
            "workJobName": "E72合肥第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000262922",
            "workJobName": "EHS专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258625",
            "workJobName": "F01广州第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258626",
            "workJobName": "F02广州第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258627",
            "workJobName": "F03广州第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258628",
            "workJobName": "F04佛山第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258629",
            "workJobName": "F05佛山第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258630",
            "workJobName": "F06佛山第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258631",
            "workJobName": "F07长沙第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258632",
            "workJobName": "F08南宁第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258633",
            "workJobName": "F09长沙第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258634",
            "workJobName": "F10珠海第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258635",
            "workJobName": "F11广州第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258636",
            "workJobName": "F14佛山第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258637",
            "workJobName": "F16广州第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12335",
            "workJobName": "F17东莞第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12339",
            "workJobName": "F18东莞第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12340",
            "workJobName": "F19东莞第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12347",
            "workJobName": "F20东莞第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265759",
            "workJobName": "F51广州第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265760",
            "workJobName": "F52广州第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265761",
            "workJobName": "F53广州第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265766",
            "workJobName": "F54广州第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265768",
            "workJobName": "F55广州第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265769",
            "workJobName": "F56东莞第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265770",
            "workJobName": "F57东莞第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265771",
            "workJobName": "F58东莞第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265772",
            "workJobName": "F59东莞第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265773",
            "workJobName": "F60东莞第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265762",
            "workJobName": "F71佛山第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265763",
            "workJobName": "F72佛山第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265767",
            "workJobName": "F73佛山第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265764",
            "workJobName": "F74中山第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265765",
            "workJobName": "F75珠海第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258638",
            "workJobName": "G01武汉第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258639",
            "workJobName": "G02武汉第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258640",
            "workJobName": "G03武汉第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258641",
            "workJobName": "G04西安第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258642",
            "workJobName": "G05郑州第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258643",
            "workJobName": "G06武汉第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258644",
            "workJobName": "G07西安第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258645",
            "workJobName": "G08郑州第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12341",
            "workJobName": "G10江西第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12343",
            "workJobName": "G11江西第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12348",
            "workJobName": "G12长沙第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265774",
            "workJobName": "G51武汉第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265775",
            "workJobName": "G52武汉第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265776",
            "workJobName": "G53武汉第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265779",
            "workJobName": "G54武汉第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265778",
            "workJobName": "G55郑州第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265781",
            "workJobName": "G56郑州第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265777",
            "workJobName": "G61西安第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265780",
            "workJobName": "G62西安第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265788",
            "workJobName": "G63西安第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265789",
            "workJobName": "G64西安第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265782",
            "workJobName": "G65乌鲁木齐第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265783",
            "workJobName": "G71江西第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265784",
            "workJobName": "G72江西第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265785",
            "workJobName": "G73长沙第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265786",
            "workJobName": "G74长沙第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265787",
            "workJobName": "G75长沙第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258646",
            "workJobName": "H01成都第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258647",
            "workJobName": "H02成都第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258648",
            "workJobName": "H03重庆第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258649",
            "workJobName": "H04昆明第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258650",
            "workJobName": "H05成都第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258651",
            "workJobName": "H06重庆第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258652",
            "workJobName": "H07贵阳第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258653",
            "workJobName": "H08昆明第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258654",
            "workJobName": "H09成都第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258655",
            "workJobName": "H10成都第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265790",
            "workJobName": "H51成都第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265791",
            "workJobName": "H52成都第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265794",
            "workJobName": "H53成都第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265798",
            "workJobName": "H54成都第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265800",
            "workJobName": "H55成都第五分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265793",
            "workJobName": "H56昆明第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265797",
            "workJobName": "H57昆明第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265792",
            "workJobName": "H61重庆第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265795",
            "workJobName": "H62重庆第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265799",
            "workJobName": "H63重庆第三分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265802",
            "workJobName": "H64重庆第四分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265796",
            "workJobName": "H65贵阳第一分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265801",
            "workJobName": "H66贵阳第二分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258656",
            "workJobName": "HRBP(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271524",
            "workJobName": "IE工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000260535",
            "workJobName": "PMO(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271515",
            "workJobName": "SA方案总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271527",
            "workJobName": "V02高端物业上海分部总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258657",
            "workJobName": "VIP客户管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000262920",
            "workJobName": "XX中心牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000262921",
            "workJobName": "XX部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264843",
            "workJobName": " 前介管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12095",
            "workJobName": "万净环卫科技总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258658",
            "workJobName": "万地盘服务专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269012",
            "workJobName": "万地盘服务牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271294",
            "workJobName": "万地盘服务部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258659",
            "workJobName": "万物星(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265826",
            "workJobName": "万物生(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258660",
            "workJobName": "万物生(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266169",
            "workJobName": "万科物业市场管理合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000262919",
            "workJobName": "万科物业首席合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258661",
            "workJobName": "业务HR专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258662",
            "workJobName": "业务HR专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258663",
            "workJobName": "业务HR主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258664",
            "workJobName": "业务HR经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258665",
            "workJobName": "业务专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263900",
            "workJobName": "业务储备人员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258666",
            "workJobName": "业务支持专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258667",
            "workJobName": "业务督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258668",
            "workJobName": "业务督导专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258669",
            "workJobName": "业务督导助理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12117",
            "workJobName": "业务研究(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264846",
            "workJobName": "业务管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271292",
            "workJobName": "业务经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263929",
            "workJobName": "业务调度(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12123",
            "workJobName": "业务财务(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258670",
            "workJobName": "业务财务BP(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258671",
            "workJobName": "业务运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12094",
            "workJobName": "业务运营督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269011",
            "workJobName": "业务运营经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258672",
            "workJobName": "业委会关系专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266188",
            "workJobName": "中级/高级/资深市场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266039",
            "workJobName": "中级市场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12076",
            "workJobName": "中级数据分析师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258673",
            "workJobName": "乐居服务负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000268999",
            "workJobName": "产品总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12106",
            "workJobName": "产品总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269008",
            "workJobName": "产品经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258674",
            "workJobName": "产品经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258675",
            "workJobName": "产品运营专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258676",
            "workJobName": "产品运营主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12074",
            "workJobName": "产品运营经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263938",
            "workJobName": "人事专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265079",
            "workJobName": "人事行政专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258677",
            "workJobName": "人事行政负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258678",
            "workJobName": "人事运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258679",
            "workJobName": "人事运营合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12126",
            "workJobName": "人力COE(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258680",
            "workJobName": "人力资源(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258681",
            "workJobName": "人力资源专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258682",
            "workJobName": "人力资源主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258683",
            "workJobName": "人力资源合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000268813",
            "workJobName": "人力资源岗(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258684",
            "workJobName": "人力资源经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258685",
            "workJobName": "人才发展(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258686",
            "workJobName": "人才发展合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263944",
            "workJobName": "人才支持专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258687",
            "workJobName": "人行出入口(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258688",
            "workJobName": "代码+城市+第几分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271288",
            "workJobName": "代码+城市+第几分公司蝶城阵地总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258689",
            "workJobName": "企业文化(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258690",
            "workJobName": "企业文化合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258691",
            "workJobName": "会所专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258692",
            "workJobName": "会所专业经理助理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258693",
            "workJobName": "会所专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258694",
            "workJobName": "会所主厨(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258695",
            "workJobName": "会所主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258696",
            "workJobName": "会所销售专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271293",
            "workJobName": "住宅市场总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258697",
            "workJobName": "住宅运营中心牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271548",
            "workJobName": "作业技术专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12071",
            "workJobName": "供应链服务管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265398",
            "workJobName": "供应链管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258698",
            "workJobName": "供应链管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263931",
            "workJobName": "供给岗(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258699",
            "workJobName": "供配电外包(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263932",
            "workJobName": "保全工(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258700",
            "workJobName": "保洁业务经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12102",
            "workJobName": "保洁主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12104",
            "workJobName": "保洁员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263942",
            "workJobName": "保洁岗(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12103",
            "workJobName": "保洁班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12101",
            "workJobName": "保洁经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271538",
            "workJobName": "修缮业务发展中心牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271539",
            "workJobName": "修缮产品部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258701",
            "workJobName": "健康服务负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258702",
            "workJobName": "健康管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258703",
            "workJobName": "健康管家助理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258704",
            "workJobName": "储备人员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000262763",
            "workJobName": "储备片区总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000268689",
            "workJobName": "储备片区总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12135",
            "workJobName": "储备阵地总(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269148",
            "workJobName": "储备项目总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269147",
            "workJobName": "储备项目总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269009",
            "workJobName": "储备驻场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12121",
            "workJobName": "全国运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258705",
            "workJobName": "公共保洁(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258706",
            "workJobName": "公共消杀(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258707",
            "workJobName": "公共秩序(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258708",
            "workJobName": "公共维修(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266190",
            "workJobName": "公共维修(石木漆)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258709",
            "workJobName": "公共维修专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258710",
            "workJobName": "公共维修班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258711",
            "workJobName": "公共维修（石木漆）(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258712",
            "workJobName": "公共绿化(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12120",
            "workJobName": "内容运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258713",
            "workJobName": "农场管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258714",
            "workJobName": "准业主服务(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258715",
            "workJobName": "准业主服务合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258716",
            "workJobName": "分公司总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266038",
            "workJobName": "初级市场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258717",
            "workJobName": "前介工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258718",
            "workJobName": "前介管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258719",
            "workJobName": "前介管理合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258720",
            "workJobName": "前台接待(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271544",
            "workJobName": "劳务主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271543",
            "workJobName": "劳务经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12127",
            "workJobName": "区域分部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258721",
            "workJobName": "区域分部牵头人/区域首席客户官(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258722",
            "workJobName": "区域对接合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258723",
            "workJobName": "厨师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258724",
            "workJobName": "厨师班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258725",
            "workJobName": "厨师长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266119",
            "workJobName": "友邻仓库管理员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266125",
            "workJobName": "友邻平台管理员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266115",
            "workJobName": "友邻幸福社审核(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266113",
            "workJobName": "友邻幸福社运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266121",
            "workJobName": "友邻总部审核(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266123",
            "workJobName": "友邻总部财务(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266120",
            "workJobName": "友邻总部运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266118",
            "workJobName": "友邻生活管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258726",
            "workJobName": "司机(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258727",
            "workJobName": "合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258728",
            "workJobName": "合资公司副总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258729",
            "workJobName": "合资公司常务副总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258730",
            "workJobName": "合资公司负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258731",
            "workJobName": "后勤厨师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258732",
            "workJobName": "后台支持负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265825",
            "workJobName": "员工关系(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269010",
            "workJobName": "员工培训(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258733",
            "workJobName": "员工训练督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12086",
            "workJobName": "呼叫中心业务支持(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12087",
            "workJobName": "呼叫中心业务支持负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12085",
            "workJobName": "呼叫中心业务负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12088",
            "workJobName": "呼叫中心品质综合负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12084",
            "workJobName": "呼叫中心牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12089",
            "workJobName": "呼叫中心运营分析(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258734",
            "workJobName": "品牌牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000267444",
            "workJobName": "品牌牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258735",
            "workJobName": "品牌牵头合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12115",
            "workJobName": "品牌策划(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258736",
            "workJobName": "品牌运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258737",
            "workJobName": "品质专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258738",
            "workJobName": "品质主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258739",
            "workJobName": "品质经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258740",
            "workJobName": "园林绿化专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258741",
            "workJobName": "园艺师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264003",
            "workJobName": "固废专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258742",
            "workJobName": "地物协同(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258743",
            "workJobName": "地物协同合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258744",
            "workJobName": "场所专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258745",
            "workJobName": "场所班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263943",
            "workJobName": "垃圾收倒岗(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265523",
            "workJobName": "垃圾清运供方负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266185",
            "workJobName": "城市(群)市场总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258746",
            "workJobName": "城市代表(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266037",
            "workJobName": "城市（群）市场总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263937",
            "workJobName": "培训专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258747",
            "workJobName": "外包保洁(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258748",
            "workJobName": "外包保洁主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258749",
            "workJobName": "外包保洁班长(地库清洁)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258750",
            "workJobName": "外包保洁班长(垃圾清运)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258751",
            "workJobName": "外包保洁班长(楼内清洁)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258752",
            "workJobName": "外包保洁班长(楼外清洁)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258753",
            "workJobName": "外包场所(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258754",
            "workJobName": "外包救生员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258755",
            "workJobName": "外包秩序(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258756",
            "workJobName": "大厨(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258757",
            "workJobName": "大管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258758",
            "workJobName": "安全专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258759",
            "workJobName": "安全专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271526",
            "workJobName": "安全业务工单化负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271587",
            "workJobName": "安全主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258760",
            "workJobName": "安全员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258761",
            "workJobName": "安全班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12069",
            "workJobName": "安全管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263926",
            "workJobName": "安全管理督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271585",
            "workJobName": "安全经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258762",
            "workJobName": "安电专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258763",
            "workJobName": "实习生(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258764",
            "workJobName": "客户专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12093",
            "workJobName": "客户事务处理牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258765",
            "workJobName": "客户服务专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258766",
            "workJobName": "客户研究负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258767",
            "workJobName": "客户经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258768",
            "workJobName": "客户资源专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258769",
            "workJobName": "客户资源组牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271584",
            "workJobName": "客服专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271583",
            "workJobName": "客服主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265081",
            "workJobName": "客服前台(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265080",
            "workJobName": "客服副主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265082",
            "workJobName": "客服助理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271579",
            "workJobName": "客服员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000267450",
            "workJobName": "客服管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258770",
            "workJobName": "客服管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000267449",
            "workJobName": "客服经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258771",
            "workJobName": "宴会厅服务员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258772",
            "workJobName": "家属(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264004",
            "workJobName": "家政专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258773",
            "workJobName": "家政清洁(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258774",
            "workJobName": "家政清洁班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258775",
            "workJobName": "家政维修(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258776",
            "workJobName": "家政维修专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271535",
            "workJobName": "家政维修工匠(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269168",
            "workJobName": "家政维修班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269016",
            "workJobName": "家政维修管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258777",
            "workJobName": "宿舍管理员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269163",
            "workJobName": "巡检员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271533",
            "workJobName": "巡检岗(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271550",
            "workJobName": "工单运维专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271523",
            "workJobName": "工单造价经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258778",
            "workJobName": "工程专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271540",
            "workJobName": "工程主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269017",
            "workJobName": "工程咨询(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265083",
            "workJobName": "工程班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12109",
            "workJobName": "工程管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000267448",
            "workJobName": "工程经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258779",
            "workJobName": "市场与产品服务部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258780",
            "workJobName": "市场专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264006",
            "workJobName": "市场拓展(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258781",
            "workJobName": "市场拓展专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258782",
            "workJobName": "市场拓展主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258783",
            "workJobName": "市场拓展组牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258784",
            "workJobName": "市场牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000267445",
            "workJobName": "市场牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258785",
            "workJobName": "市场牵头合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12118",
            "workJobName": "市场研究(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264845",
            "workJobName": "市场研究(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269015",
            "workJobName": "市场管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266735",
            "workJobName": "市场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258786",
            "workJobName": "市场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258787",
            "workJobName": "市场运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258788",
            "workJobName": "市场运营专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258789",
            "workJobName": "市拓专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258790",
            "workJobName": "市拓主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258791",
            "workJobName": "市拓经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263934",
            "workJobName": "布草岗（兼运输）(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258792",
            "workJobName": "帮厨(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266186",
            "workJobName": "干部管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271512",
            "workJobName": "平台服务专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258793",
            "workJobName": "平台运营专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271510",
            "workJobName": "平台运营主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258794",
            "workJobName": "平台运营主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258795",
            "workJobName": "平面设计(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12082",
            "workJobName": "平面设计师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258796",
            "workJobName": "幸福驿站(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258797",
            "workJobName": "幸福驿站班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271554",
            "workJobName": "开发工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271556",
            "workJobName": "开发工程师W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271581",
            "workJobName": "强电主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271542",
            "workJobName": "成本主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269018",
            "workJobName": "成本工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258798",
            "workJobName": "成本管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258799",
            "workJobName": "成本管理合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271541",
            "workJobName": "成本经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258800",
            "workJobName": "成本预算(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000260536",
            "workJobName": "战略研究(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12116",
            "workJobName": "战略规划(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258801",
            "workJobName": "房修管理合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258802",
            "workJobName": "执行合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258803",
            "workJobName": "技术员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12083",
            "workJobName": "投诉督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258804",
            "workJobName": "投诉管理督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12090",
            "workJobName": "投诉管理负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000260537",
            "workJobName": "投诉跟进(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264844",
            "workJobName": "投资管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000267446",
            "workJobName": "投资管理牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265397",
            "workJobName": "投资管理牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12119",
            "workJobName": "投资经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258805",
            "workJobName": "招商拓展经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258806",
            "workJobName": "招聘(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258807",
            "workJobName": "招聘专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12099",
            "workJobName": "招聘站站长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269158",
            "workJobName": "招聘管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258808",
            "workJobName": "招聘配置(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258809",
            "workJobName": "招聘配置合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263936",
            "workJobName": "招训中心主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258810",
            "workJobName": "指挥中心(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258811",
            "workJobName": "指挥中心班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271588",
            "workJobName": "指挥调度(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12122",
            "workJobName": "收费管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271291",
            "workJobName": "收费运营负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258812",
            "workJobName": "政策研究专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258813",
            "workJobName": "政策研究管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258814",
            "workJobName": "救生员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258815",
            "workJobName": "数字化运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258816",
            "workJobName": "数字运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258817",
            "workJobName": "数字运营中心牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258818",
            "workJobName": "数字运营合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12078",
            "workJobName": "数字运营经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269006",
            "workJobName": "数据分析(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266187",
            "workJobName": "数据分析(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12124",
            "workJobName": "数据分析(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266184",
            "workJobName": "数据分析师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258819",
            "workJobName": "数据分析师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269005",
            "workJobName": "数据分析师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12081",
            "workJobName": "数据分析负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258820",
            "workJobName": "新媒体运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269007",
            "workJobName": "方案专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258821",
            "workJobName": "方案专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258822",
            "workJobName": "景观设计师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258823",
            "workJobName": "智能化专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271582",
            "workJobName": "暖通主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12133",
            "workJobName": "暖通工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258824",
            "workJobName": "暖通空调外包(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266117",
            "workJobName": "服务人员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258825",
            "workJobName": "服务创新专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266170",
            "workJobName": "服务创新督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271549",
            "workJobName": "服务方案专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000268988",
            "workJobName": "服务流程负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258826",
            "workJobName": "服务督导组牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269013",
            "workJobName": "服务管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258827",
            "workJobName": "服务调度(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258828",
            "workJobName": "服务赋能(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12132",
            "workJobName": "服务赋能经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269014",
            "workJobName": "服务运营经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271521",
            "workJobName": "机动作业工匠(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271537",
            "workJobName": "机动维修工匠(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269166",
            "workJobName": "机动维修班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271520",
            "workJobName": "机动维修经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271536",
            "workJobName": "机动维修队长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263935",
            "workJobName": "机师岗(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12105",
            "workJobName": "机械操作员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258829",
            "workJobName": "机电专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258830",
            "workJobName": "机电专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258831",
            "workJobName": "机电班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258832",
            "workJobName": "核算专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258833",
            "workJobName": "核算主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12107",
            "workJobName": "案场业务(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271578",
            "workJobName": "案场主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271577",
            "workJobName": "案场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266114",
            "workJobName": "桶装水送水员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258834",
            "workJobName": "残疾人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271516",
            "workJobName": "法务专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258835",
            "workJobName": "泳池出入口(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266122",
            "workJobName": "泳池商户(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258836",
            "workJobName": "泳池班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258837",
            "workJobName": "泳池管养(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258838",
            "workJobName": "泳池管养班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264005",
            "workJobName": "洁运部负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12108",
            "workJobName": "活动策划(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258839",
            "workJobName": "活动运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258840",
            "workJobName": "流程专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263767",
            "workJobName": "流程管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271557",
            "workJobName": "测试工程师W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264002",
            "workJobName": "消杀专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000270714",
            "workJobName": "消杀供方负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258841",
            "workJobName": "消防专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271586",
            "workJobName": "消防主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258842",
            "workJobName": "消防外包(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258843",
            "workJobName": "清洁专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258844",
            "workJobName": "清洁供方负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258845",
            "workJobName": "清洁管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000262783",
            "workJobName": "清洁管理督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271580",
            "workJobName": "烘焙师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258846",
            "workJobName": "片区总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258847",
            "workJobName": "片区经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12096",
            "workJobName": "片区运营总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12097",
            "workJobName": "片区运营经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258848",
            "workJobName": "物业中心总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271547",
            "workJobName": "物业工程部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258849",
            "workJobName": "物业管理部总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263899",
            "workJobName": "物业管理部总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264001",
            "workJobName": "物资专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258850",
            "workJobName": "牵头合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258851",
            "workJobName": "环境专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258852",
            "workJobName": "环境专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258853",
            "workJobName": "环境监控(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258854",
            "workJobName": "环境监控班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258855",
            "workJobName": "环境经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258856",
            "workJobName": "现场主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263940",
            "workJobName": "现场组长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271511",
            "workJobName": "生活服务专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258857",
            "workJobName": "电梯专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264943",
            "workJobName": "电梯供方负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258858",
            "workJobName": "电梯外包(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258859",
            "workJobName": "电梯监控(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000262923",
            "workJobName": "电梯管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264942",
            "workJobName": "电梯管理员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258860",
            "workJobName": "电瓶车岗(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000270731",
            "workJobName": "目标与绩效管理组牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258861",
            "workJobName": "礼宾(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258862",
            "workJobName": "社区文化(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258863",
            "workJobName": "社区经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258864",
            "workJobName": "私人保镖\\私人护卫(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271552",
            "workJobName": "科技产品部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258865",
            "workJobName": "秩序专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258866",
            "workJobName": "秩序班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271528",
            "workJobName": "移动端开发(iOS)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269002",
            "workJobName": "移动端开发(iOS)W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266183",
            "workJobName": "移动端开发(iOS)W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271555",
            "workJobName": "移动端开发W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269001",
            "workJobName": "移动端开发工程师(安卓)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266182",
            "workJobName": "移动端开发工程师(安卓)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12112",
            "workJobName": "移动端开发工程师（安卓）(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263768",
            "workJobName": "移动端开发（iOS）W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258867",
            "workJobName": "管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258868",
            "workJobName": "管家专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258869",
            "workJobName": "管家专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258870",
            "workJobName": "管家助理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266189",
            "workJobName": "管家助理(万物生)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265682",
            "workJobName": "管家助理(实习生)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266042",
            "workJobName": "管家助理（万物生）(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258871",
            "workJobName": "管家班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258872",
            "workJobName": "管家运营督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258873",
            "workJobName": "管理中心总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263941",
            "workJobName": "精保岗(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12125",
            "workJobName": "组织发展(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000270734",
            "workJobName": "组织效率与员工体验组牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000270733",
            "workJobName": "组织机制与人才发展组牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258874",
            "workJobName": "经营副总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258875",
            "workJobName": "经营总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269157",
            "workJobName": "经营管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000270732",
            "workJobName": "经营管理组牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258876",
            "workJobName": "给排水外包(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271534",
            "workJobName": "维修主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269167",
            "workJobName": "维修技工(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269164",
            "workJobName": "维修班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000267443",
            "workJobName": "维修管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271517",
            "workJobName": "维修管理负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258877",
            "workJobName": "维修经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265075",
            "workJobName": "维序主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265078",
            "workJobName": "维序副班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265077",
            "workJobName": "维序员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265076",
            "workJobName": "维序班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258878",
            "workJobName": "综合专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12080",
            "workJobName": "综合支持牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12113",
            "workJobName": "综合管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12129",
            "workJobName": "综合管理部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258879",
            "workJobName": "综合管理部经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264007",
            "workJobName": "综合管理部负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258880",
            "workJobName": "综合行政(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263927",
            "workJobName": "综合运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258881",
            "workJobName": "绿化专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258882",
            "workJobName": "绿化供方负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258883",
            "workJobName": "绿化管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258884",
            "workJobName": "绿化管理督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263939",
            "workJobName": "网格主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258885",
            "workJobName": "网格管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258886",
            "workJobName": "美丽社区(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271290",
            "workJobName": "自主创收负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258887",
            "workJobName": "薪酬绩效(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258888",
            "workJobName": "薪酬绩效合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266191",
            "workJobName": "蝶城S1运营执行组长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271525",
            "workJobName": "蝶城变阵运营负责人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271532",
            "workJobName": "蝶城维修工匠(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269161",
            "workJobName": "蝶城维修经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269160",
            "workJobName": "蝶城运营专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258889",
            "workJobName": "行政专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258890",
            "workJobName": "行政主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258891",
            "workJobName": "行政后勤(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258892",
            "workJobName": "行政管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258893",
            "workJobName": "行政管理合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258894",
            "workJobName": "行政经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266116",
            "workJobName": "街道报单(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266112",
            "workJobName": "街道管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266124",
            "workJobName": "街道送水员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258895",
            "workJobName": "装修管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258896",
            "workJobName": "计划运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258897",
            "workJobName": "认证培训中心牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258898",
            "workJobName": "训练督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000264000",
            "workJobName": "设备专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263930",
            "workJobName": "设备中心主任(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12100",
            "workJobName": "设备工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258899",
            "workJobName": "设备监控(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265803",
            "workJobName": "设备监控(实习生)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258900",
            "workJobName": "设备监控班长(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12070",
            "workJobName": "设备管理督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258901",
            "workJobName": "设备设施专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258902",
            "workJobName": "设施设备专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12068",
            "workJobName": "设施设备专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12114",
            "workJobName": "设计管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263928",
            "workJobName": "调度中心经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269162",
            "workJobName": "调度经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12098",
            "workJobName": "财务BP(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258903",
            "workJobName": "财务管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258904",
            "workJobName": "财务管理部经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271289",
            "workJobName": "财务规划与赋能组牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258905",
            "workJobName": "财务运营(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258906",
            "workJobName": "财务运营合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12128",
            "workJobName": "质量与流程专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258907",
            "workJobName": "质量专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258908",
            "workJobName": "质量专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271518",
            "workJobName": "质量主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258909",
            "workJobName": "质量事故督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258910",
            "workJobName": "质量督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258911",
            "workJobName": "质量管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263688",
            "workJobName": "质量管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258912",
            "workJobName": "质量管理专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258913",
            "workJobName": "质量管理部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258914",
            "workJobName": "资产专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258915",
            "workJobName": "资产主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258916",
            "workJobName": "资产合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258917",
            "workJobName": "资产管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258918",
            "workJobName": "资产管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000267447",
            "workJobName": "资产经营牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258919",
            "workJobName": "资产运营主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266041",
            "workJobName": "资深市场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271551",
            "workJobName": "资源调度专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258920",
            "workJobName": "资金专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258921",
            "workJobName": "资金主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258922",
            "workJobName": "车库管家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258923",
            "workJobName": "车行出入口(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263933",
            "workJobName": "转运岗(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271553",
            "workJobName": "运维工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263770",
            "workJobName": "运维工程师W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271513",
            "workJobName": "运维工程师W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269004",
            "workJobName": "运维工程师W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258924",
            "workJobName": "运营专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12130",
            "workJobName": "运营专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258925",
            "workJobName": "运营主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258926",
            "workJobName": "运营副总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258927",
            "workJobName": "运营助理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258928",
            "workJobName": "运营总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258929",
            "workJobName": "运营督导(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258930",
            "workJobName": "运营管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271558",
            "workJobName": "运营管理部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258931",
            "workJobName": "运营管理部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258932",
            "workJobName": "运营经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12092",
            "workJobName": "远程执行牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12079",
            "workJobName": "远程指挥牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12073",
            "workJobName": "远程管理牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258933",
            "workJobName": "远程调度(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258934",
            "workJobName": "远程调度合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12077",
            "workJobName": "远程调度经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12091",
            "workJobName": "远程运营经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12072",
            "workJobName": "远程运营部牵头人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258935",
            "workJobName": "采购专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271546",
            "workJobName": "采购主管(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269019",
            "workJobName": "采购工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271545",
            "workJobName": "采购经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258936",
            "workJobName": "销售专员(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258937",
            "workJobName": "阵地BD合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258938",
            "workJobName": "项目HR(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258939",
            "workJobName": "项目出纳(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000265681",
            "workJobName": "项目出纳(实习生)(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258940",
            "workJobName": "项目副经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269142",
            "workJobName": "项目总监(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269144",
            "workJobName": "项目总监（安全）(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269146",
            "workJobName": "项目总监（环境）(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269143",
            "workJobName": "项目总监（管家）(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269145",
            "workJobName": "项目总监（设备设施）(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258941",
            "workJobName": "项目总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12110",
            "workJobName": "项目管理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258942",
            "workJobName": "项目经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258943",
            "workJobName": "项目运营专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269159",
            "workJobName": "顾问专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258944",
            "workJobName": "首席合伙人、总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271514",
            "workJobName": "首席能力发展专家(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258945",
            "workJobName": "首席责任合伙人(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258946",
            "workJobName": "驻场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269165",
            "workJobName": "驻场维修(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000271519",
            "workJobName": "驻场维修工匠(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12134",
            "workJobName": "高低压工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12131",
            "workJobName": "高端物业管理部副总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258947",
            "workJobName": "高端物业管理部总经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000258948",
            "workJobName": "高级专业经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12111",
            "workJobName": "高级后台开发工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269000",
            "workJobName": "高级后台开发工程师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000266040",
            "workJobName": "高级市场经理(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "12075",
            "workJobName": "高级数据分析师(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000269003",
            "workJobName": "高级测试工程师W(住宅物业)",
            "workJobShortName": "B358"
          },
          {
            "workJobId": "1000263769",
            "workJobName": "高级测试工程师W(住宅物业)",
            "workJobShortName": "B358"
          }
        ],
        standardWorkJobs: [
          "1000258656",
          "1000258661",
          "1000258662",
          "1000258663",
          "1000258664",
          "1000258666",
          "1000264846",
          "1000258691",
          "1000258692",
          "1000269009",
          "1000258709",
          "1000258744",
          "1000258758",
          "1000258776",
          "1000271533",
          "1000258815",
          "1000271520",
          "1000258829",
          "1000258843",
          "1000258851",
          "1000258853",
          "1000258854",
          "1000258865",
          "1000258868",
          "1000271534",
          "1000271517",
          "1000258877",
          "1000258878",
          "1000258881",
          "1000269161",
          "1000258901",
          "1000258902",
          "1000269162",
          "1000258907",
          "12077",
          "1000258938",
          "1000258939",
          "1000265681",
          "1000258946",
          "1000269165",
          "1000271519",
          "1000258948"
        ],
        selectYear: '2024',
        beginDate: '9/20/2024',
        endDate: '9/30/2024'
      },

      nextDepartment () {
        let index = this.schedule.crtDepartments ? this.schedule.allDepartments.findIndex(x => x.department_id == this.schedule.crtDepartments) : -1
        let item = this.schedule.allDepartments[index + 1]
        if (item) {
          this.schedule.crtDepartments = item.department_id
        }
      },


      deleteOrCalcRow () {
        let list = document.querySelectorAll('.ant-table-row');
        let table = document.querySelectorAll('.ant-table-tbody')[0];
        console.log(list)
        let nodeList = [];
        list.forEach(node => {
          console.log(node)
          node.childNodes[1].childNodes.forEach((c, index) => index > 0 && (c.remove()))
          let time = node.childNodes[1].innerHTML;
          let date = new Date(time)



          if (date.getHours() > 19) {

            let hour = date.getHours() - 18;
            let minutes = date.getMinutes() > 29 ? 0.5 : 0;
            let _ = document.createElement('span');
            _.innerHTML = hour + minutes;
            _.setAttribute('style', 'color:red;margin-left:10px')
            node.childNodes[1].appendChild(_)
            table.insertBefore(node, table.firstChild)
          }
        })
      },
      CalcRow () {
        let list = document.querySelectorAll('.ant-table-row');
        let table = document.querySelectorAll('.ant-table-tbody')[0];
        console.log(list)
        let nodeList = [];
        list.forEach(node => {
          console.log(node)
          node.childNodes[1].childNodes.forEach((c, index) => index > 0 && (c.remove()))
          let time = node.childNodes[1].innerHTML;
          let date = new Date(time)

          let no = node.childNodes[8].innerHTML;
          let day = date.getDate();
          let month = date.getMonth();

          let temp = nodeList.find(x => x.no == no && x.day == day && x.month == month);
          if (!temp) {
            nodeList.push({
              no: no,
              day: day,
              month: month,
              node: node,
              times: [date]
            })
          } else {
            temp.times.push(date)
          }



        })
        console.log(nodeList)
        nodeList.forEach(item => {
          let times = item.times.sort((a, b) => a.getTime() - b.getTime())
          let time1 = times[0];
          let time2 = times[times.length - 1];
          let timestamp = time2.getTime() - time1.getTime();
          let leave1 = timestamp % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
          let hours = Math.floor(leave1 / (3600 * 1000))
          //计算相差分钟数
          let leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
          let minutes = Math.floor(leave2 / (60 * 1000))
          let timeCalc = hours + (minutes > 29 ? 0.5 : 0);
          let _ = document.createElement('span');
          _.innerHTML = `上：${time1.format('yyyy-MM-dd hh:mm')}下：${time2.format('yyyy-MM-dd hh:mm')} 时长：${timeCalc}`;
          _.setAttribute('style', 'color:red;margin-left:10px')
          item.node.childNodes[1].appendChild(_)
          table.insertBefore(item.node, table.firstChild)
        })
      },
      open () {
        this.popup = true;
      },
      async sendSchedule () {
        let selected = this.schedule.employees[0].schedules.map(x => x.selected)
        this.schedule.employees.forEach(user => {
          user.schedules.forEach((sche, index) => {
            if (selected[index]) {
              fetch('https://rm.vankeservice.com/internal/api/new-schedule-sheet', {
                headers: {
                  cookie: document.cookie,
                  currentEmployeeId: '1001070954',
                  enterprise: 'ENTERPRISE_VANKE',
                  industryForm: 'INDUSTRY_FORM_WY',
                  Accept: 'application/json, text/plain, */*',
                  'content-type': "application/json;charset=UTF-8",
                },
                method: 'PUT',
                body: JSON.stringify({
                  employees: [user.origin],
                  startDate: user.startDate,
                  endDate: user.endDate,
                  isScheduleCopy: false,
                  selectionDepartmentId: user.departmentId,
                  types: [0, 1, 2],
                  schedules: [
                    {
                      id: null,
                      goOutSchedules: [],
                      employeeId: sche.employeeId,
                      name: sche.name,
                      onDutyDay: sche.onDutyDay,
                      overtimeSchedules: [],
                      regularSchedules: [],
                      sapId: sche.sapId,
                      holidaySchedules: [{
                        holidayBeginTime: "00:00:00",
                        holidayEndTime: "00:00:00",
                        holidayType: 0,
                        id: null,
                        operationState: 'add',
                        type: "HOLIDAY_ALTERNATE_HOLIDAY"
                      }]
                    }
                  ]
                }),
                mode: "cors",
                credentials: 'include'
              }).then((res) => res.json());
              sche.isSend = true
            }

          })
        })
      },
      async getSchedule () {
        console.log(this.schedule)
        let params = {
          length: 100,
          start: 0,
          search: JSON.stringify(
            {
              "departments": [
                this.schedule.crtDepartments
              ],
              "beginDate": this.schedule.beginDate,
              "endDate": this.schedule.endDate,
              "keywords": "",
              "selectYear": this.schedule.selectYear,
              "scheduleGroupIds": [],
              "standardWorkJobs": this.schedule.standardWorkJobs,
              "workingGroups": [],
              "scheduleStatus": "0",
              "jobStatus": "01"
            }
          ),
        }

        console.log(params)

        const res = await fetch('https://rm.vankeservice.com/internal/api/new-schedule-sheet-list', {
          headers: {
            cookie: document.cookie,
            currentEmployeeId: '1001070954',
            enterprise: 'ENTERPRISE_VANKE',
            industryForm: 'INDUSTRY_FORM_WY',
            Accept: 'application/json, text/plain, */*',
            'content-type': "application/json;charset=UTF-8",
          },
          body: JSON.stringify(params),
          method: 'post',
          mode: "cors",
          credentials: 'include'
        }).then((res) => res.json());

        console.log(res);
        let employees = res.employees;

        let end = new Date(res.endDate)
        end.setDate(end.getDate() - 1)
        end = end.format('yyyy-MM-dd');
        let starto = new Date(res.startDate)
        starto.setDate(starto.getDate() + 1)
        starto = starto.format('yyyy-MM-dd');
        employees.forEach(user => {
          user.origin = JSON.parse(JSON.stringify(user));
          user.startDate = starto
          user.endDate = end
          let schedules = []
          let scheduleCells = [...user.schedules];
          let start = new Date(res.startDate)
          let func = () => {
            start.setDate(start.getDate() + 1);
            let crtdate = start.format('yyyy-MM-dd');
            if (!user.schedules.find(x => x.onDutyDay == crtdate)) {
              scheduleCells.push({
                departmentId: user.departmentId,
                employeeId: user.employeeId,
                goOutSchedules: null,
                holidaySchedules: null,
                id: null,
                name: user.name,
                onDutyDay: crtdate,
                overtimeSchedules: null,
                regularSchedules: null,
                sapId: user.sapId
              })
            }

            let days = [
              '周日', '周一', '周二', '周三', '周四', '周五', '周六'
            ]

            if (new Date(crtdate).getTime() <= new Date(end).getTime()) {
              if (start.getDay() == 6 || start.getDay() == 0) {
                schedules.push({ ...user.schedules[0], onDutyDay: crtdate, day: days[start.getDay()], selected: true, })
              } else {
                schedules.push({ ...user.schedules[0], onDutyDay: crtdate, day: days[start.getDay()], selected: false, })
              }
              func()
            }
          }
          func();

          user.schedules = schedules
          user.origin.scheduleCells = scheduleCells;
        })
        this.schedule.employees = employees;
        this.schedule.names = employees.map(x => x.name).join('、');
        console.log(employees)
      },
      async openAttendance () {
        const res = await fetch('https://rm.vankeservice.com/internal/api/users-mid/-?industryForm=INDUSTRY_FORM_WY&source=2', {
          headers: {
            cookie: document.cookie,
            currentEmployeeId: '1001070954',
            enterprise: 'ENTERPRISE_VANKE',
            industryForm: 'INDUSTRY_FORM_WY',
            Accept: 'application/json, text/plain, */*'
          },
          method: 'get',
          credentials: 'include'
        }).then((res) => res.json());
        console.log(res);
        this.authorizedDepartments = res.authorizedCompanies[0].departments.concat(res.authorizedCompanies[1].departments).concat(res.authorizedCompanies[2].departments)


        this.pageType = 'attendance';
      },
      async getAttendanceResults () {
        if (this.selectedDepartments.length == 0 || !this.beginDate || !this.endDate) return;
        this.loading = true;
        let bd = this.beginDate.split('-');
        let ed = this.endDate.split('-');
        bd.push(bd.shift())
        ed.push(ed.shift())
        let searchParams = {
          "departments": this.selectedDepartments,
          "workingGroups": [],
          "beginDate": bd.join('/'),
          "endDate": ed.join('/'),
          "attendanceStatus": "0",
          "abnormalAttendanceType": "0",
          "jobStatus": "",
          "selectYear": this.year,
          "standardWorkJobs": [],
          "attendanceResult": []
        }
        let formdata = new FormData();
        formdata.append("draw", 5);
        formdata.append("start", 0)
        formdata.append("length", 9999)
        formdata.append("search[value]", JSON.stringify(searchParams))
        formdata.append("search[regex]", false)
        const res = await fetch('https://rm.vankeservice.com/internal/api/attendance-results-new', {
          headers: {
            cookie: document.cookie
          },
          method: 'post',
          body: formdata,
          credentials: 'include'
        }).then((res) => res.json());
        console.log(res);
        this.attendanceExceptionList = [];
        this.highTemperatureSubsidy = {
          date: [],
          list: []
        };
        let resultData = res.data;
        this.allAttendanceDataList = resultData;
        resultData.forEach(item => {
          item.actualOnDutyTime = item.onDutyDate + ' ' + item.actualOnDutyTime;
          if (item.actualOffDutyTime.indexOf('次日') > -1) {
            item.actualOffDutyTime = new Date(new Date(item.onDutyDate).getTime() + 24 * 60 * 60 * 1000).format('yyyy-MM-dd') + ' ' + item.actualOffDutyTime;
          } else {
            item.actualOffDutyTime = item.onDutyDate + ' ' + item.actualOffDutyTime;
          }
          if ((new Date(item.actualOnDutyTime).getTime() - new Date(item.beginTime).getTime()) > 4 * 60 * 1000 || (new Date(item.endTime).getTime() - new Date(item.actualOffDutyTime).getTime()) > 4 * 60 * 1000) {
            this.attendanceExceptionList.push(item)
          }
          if (!this.highTemperatureSubsidy.date.find(x => x == item.onDutyDate)) {
            this.highTemperatureSubsidy.date.push(item.onDutyDate);
          }
          let tag = item.actualOnDutyTime && (new Date(item.actualOnDutyTime) != 'Invalid Date' || item.actualOnDutyTime.includes('补签')) ? 'Y' : 'N';
          let row = this.highTemperatureSubsidy.list.find(x => x[0]?.date == item.employeeName)
          if (row) {
            let col = row.find(x => x.date == item.onDutyDate)
            if (col && tag == 'Y') {
              col.tag = tag;
            }
            if (!col) {
              row.push({
                date: item.onDutyDate,
                tag: tag
              })
            }

          } else {
            this.highTemperatureSubsidy.list.push([{
              date: item.employeeName,
              tag: item.employeeName,
            }, {
              date: item.onDutyDate,
              tag: tag
            }])
          }
        })
        console.log(this.attendanceExceptionList);
        console.log(this.highTemperatureSubsidy);
        this.loading = false;
      },
      location (item) {
        let index = this.allAttendanceDataList.findIndex(x => x.onDutyDate == item.onDutyDate && x.employeeName == item.employeeName);
        if (index) {
          document.getElementById(index.toString()).scrollIntoView();
          let temp = this.allAttendanceDataList[index];
          if (this.preMarkItem) this.preMarkItem.mark = false;
          temp.mark = true;
          this.preMarkItem = temp;
        }
      },
      deleteException (idx) {
        this.attendanceExceptionList.splice(idx, 1);
      },
      exportException () {
        // 列标题
        let str = '<tr>';
        this.attendanceItems.forEach(item => str += `<td>${item.name}</td>`)
        str += '</tr>'
        // 循环遍历，每行加入tr标签，每个单元格加td标签
        this.attendanceExceptionList.forEach(item => {
          str += '<tr>';

          this.attendanceItems.forEach(data => {
            str += `<td>${item[data.key] + '\t'}</td>`;
          })
          str += '</tr>';
        })
        // Worksheet名
        const worksheet = 'Sheet1'
        const uri = 'data:application/vnd.ms-excel;base64,';

        // 下载的表格模板数据
        const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
          <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>${worksheet}</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
          </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
          </head><body><table>${str}</table></body></html>`;
        // 下载模板
        window.location.href = uri + window.btoa(unescape(encodeURIComponent(template)));
      },
      exportSubsidy () {
        // 列标题
        let str = '<tr><td>姓名</td>';
        this.highTemperatureSubsidy.date.forEach(item => str += `<td>${item}</td>`)
        str += '</tr>'
        // 循环遍历，每行加入tr标签，每个单元格加td标签
        this.highTemperatureSubsidy.list.forEach(item => {
          str += '<tr>';
          str += `<td>${item[0].tag}</td>`;
          this.highTemperatureSubsidy.date.forEach(date => {
            str += `<td>${item.find(x => x.date == date)?.tag ?? 'N' + '\t'}</td>`;
          })

          str += '</tr>';
        })
        // Worksheet名
        const worksheet = 'Sheet1'
        const uri = 'data:application/vnd.ms-excel;base64,';

        // 下载的表格模板数据
        const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
          <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>${worksheet}</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
          </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
          </head><body><table>${str}</table></body></html>`;
        // 下载模板
        window.location.href = uri + window.btoa(unescape(encodeURIComponent(template)));
      }

    }).mount();

    // 处理样式
    const style = `
      .wx_loading {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 9999999;
        background: rgba(0,0,0,0.1);
      }
      .wx_loading .circular {
        height: 42px;
        width: 42px;
        -webkit-animation: loading-rotate 2s linear infinite;
        animation: loading-rotate 2s linear infinite;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-top: -21px;
        margin-left: -21px;
      }
      .wx_loading .path {
        -webkit-animation: loading-dash 1.5s ease-in-out infinite;
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: #409eff;
        stroke-linecap: round;
      }
      @keyframes loading-rotate {
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      @keyframes loading-dash {
        0% {
          stroke-dasharray: 1, 200;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -40px;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -120px;
        }
      }
      .hut_draw_wrap {
        box-sizing: border-box;
        position: fixed;
        top: 50%;
        left: 0px;
        z-index: 888888;
        margin-top: -20px;
      }
      .hut_draw {
        box-sizing: border-box;
        position: fixed;
        bottom: 10%;
        right: 30px;
        z-index: 888888;
        width: 40px;
        height: 40px;
        line-height: 16px;
        font-size: 12px;
        padding: 4px;
        text-align: center;
        overflow: hidden;
        cursor: pointer;
      }
      .hut_popup {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        height:100%;
        width:100%;
        background-color:white;
        z-index: 999999;
      }
      .hut_head{
        height:60px;
        line-height:60px;
        display:flex;
        padding:0 20px;
        justify-content: space-between;
        color: #333333;
        font-size: 15px;
        background-color: #f8f9fb;
        border-bottom: 1px solid #ddd;
        border-bottom: 1px solid #e5e5e5;
        box-shadow: 1px 7px 6px rgb(0 0 0 / 10%);
      }
      .hut_home{
       cursor: pointer;
      }
      .hut_close{
        cursor: pointer;
        transform: scaleX(1.5);
      }
      .hut_content-container{
        padding: 24px;
        width: 100%;
        height: calc(100% - 60px);
        background-color: #f8f8f8;
        position: relative;
      }
      .hut_component{
        border-radius: 5px;
        box-shadow: 0 0 6px rgb(0 0 0 / 10%);
        height: 100%;
        width: 100%;
        background-color: #fff;
        overflow: hidden;
        padding:20px;
      }
      .home_page{
        display:flex;
      }
      .home_item{
        margin: 20px;
        height: fit-content;
        cursor:pointer;
      }
      .title{
        font-size:16px;
        color:black;
        height:24px;
        line-height:24px;
      }
      .exception_content{
        height:30%;
        width:100%;
        overflow:auto;
        padding: 10px;
      }
      .all_attendance_content{
        width:100%;
        height:calc(70% - 80px);
        overflow:auto;
        padding: 10px;
      }
      .button{
        color: black;
        padding: 4px;
        border:none;
      }
      .primary{
        color: white;
        background-color: #5683e3;
        border-color: #5683e3;
      }
      .selectedDepartments{
        position: absolute;
        width:180px;
      }
      .selectedDepartments:hover{
        height:300px !important;
      }
      .button_head{
        position:relative;
        height:32px;
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);
  })();
}, 1000)