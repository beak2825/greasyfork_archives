// ==UserScript==
// @name         IVE Att & Abs Calculator
// @namespace    https://ive.miklet.tk
// @version      3.0.2
// @description  Precisly determine and control the time you can miss.
// @author       Miklet
// @license      MIT
// @match        *://myportal.vtc.edu.hk/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        unsafeWindow
// @supportURL   https://ive.miklet.tk/document
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/34521/IVE%20Att%20%20Abs%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/34521/IVE%20Att%20%20Abs%20Calculator.meta.js
// ==/UserScript==

/* global $ */

// Declare gloval variable
var data, db_data = null,
    c_id, c_name, ini = false;
// Declarea element variable
var calc_btn, sbj_info_div, sbj_info, sbj_edit_time_btn, toggle_btn, sbj_dashboard_div, sbj_dashboard, sbj_select_btn;
// Unit of Time
const u_hour = 'hr',
    u_minute = 'min',
    version = GM_info.script.version;

// Run the nessesary function for userscript
function initialize() {
    varUpdate();
    addToolbarCommand();
    createElement();
    GM_info.scriptHandler !== 'Violentmonkey' ? window.alert('WARNING! Since the version 3.0 of IVE att & abs calculator was require Violentmonkey! And your userscript manager was not Violentmonkey.This may cause the userscript not working properly.') : '';
}

// Update userscript data variable
function varUpdate() {
    data = GM_getValue(getStuId()) ? JSON.parse(GM_getValue(getStuId())) : setDefault();
}

// Get student ID number
function getStuId() {
    return wptheme_QuickLinksShelf.cookieName.substring(0, 9);
}

function addToolbarCommand() {
    if (!data.secret) {
        GM_registerMenuCommand('綁定帳戶', function() { bindAccount(); });
    }
    GM_registerMenuCommand('更新報告表中的所有單元', function() { sbj_update_all_confirm(); });
    GM_registerMenuCommand('重設報告表', function() { resetDashboard(); });
    GM_registerMenuCommand('重設全部', function() { resetAll(); });
}

// Set default value for first use or reset
function setDefault() {
    data = templateData();
    dataUpdate(data);
    return data;
}

// Only reset dashboard
function resetDashboard() {
    data.dashboard = {};
    dataUpdate(data);
    dashboard();
}

// Reset Everything
// Reset Everything
// Reset Everything
function resetAll() {
    if (window.confirm("確認重設全部資料？這會刪除所有本地數據，包括在網站中已存儲的數據（如果您已鏈結帳戶）")) {
        if (window.prompt("請輸入您的學生證號碼以便進一步確認。") === data.sys_stu_id) {
            setDefault();
            window.alert("重設完成！請刷新頁面！");
        }
        else {
            window.alert("學生證號碼錯誤！");
        }
    }
}
// Reset Everything
// Reset Everything
// Reset Everything

// Update local storage(Set the data to local)
function dataUpdate(data) {
    updateData_db();
    GM_setValue(getStuId(), JSON.stringify(data));
    varUpdate();

}

// Create theobject for new subject
function sbjCreate(t_hours) {
    data.sbj[c_id] = {
        id: c_id,
        name: c_name,
        t_hours: t_hours,
        att: 0,
        att_p: 0,
        abs: 0,
        abs_p: 0,
        avg_att: 0,
        remain: 0,
        updated_time: Date.now()
    };
}

function time_convert(input_min) {
    var output_hr = Math.round(Math.floor(input_min / 60));
    var output_min = Math.round(input_min % 60);
    return output_min !== 0 ? output_hr + u_hour + output_min + u_minute : output_hr + u_hour;
}

// For trturn a template data
function templateData(stu_id = null, secret = null, sync_time = 0) {
    if (data && data.secret) {
        stu_id = data.stu_id;
        secret = data.secret;
    }
    return {
        sys_stu_id: getStuId(),
        stu_id: stu_id,
        secret: secret,
        version: version,
        sbj: {},
        dashboard: {},
        sync_time: sync_time
    };
}

//=========================================================== Account =================================================================================

// Gather user information
function bindAccount() {
    let u_secret = window.prompt('請輸入密鑰(secret key)');
    if (u_secret) {
        let u_stu_id = window.prompt('請輸入您的學生證號碼');
        if (u_stu_id === getStuId()) {
            dataCombine(u_stu_id, u_secret);
        }
        else {
            window.alert('學生證號碼不正確！');
        }
    }
}

//Combine user data with db and local
function dataCombine(stu_id, secret) {
    data.stu_id = stu_id;
    data.secret = secret;
    dataUpdate(data);
    getData_db(function() {
        if (db_data) {
            if (window.confirm('現在，我們將會把本地和網站的數據結合，並創建同步鏈結，確定繼續？（較新的數據將會覆蓋較舊的數據）')) {
                let dashboard_num = window.prompt('請選擇您要處理報告表的方式?(請輸入數字)\n1. 本地覆蓋到網站\n2. 網站覆蓋到本地');
                let l_data = data;
                let n_data = templateData(stu_id, secret, Date.now());

                // Handle the dashboard data
                if (dashboard_num === '1') {
                    n_data.dashboard = l_data.dashboard;
                }
                else if (dashboard_num === '2') {
                    n_data.dashboard = db_data.dashboard;
                }
                else {
                    window.alert('選擇錯誤！');
                    return;
                }

                // Select the newsest subject
                for (let l_row in l_data.sbj) {
                    if (db_data.sbj[l_row] !== undefined) {
                        if (l_data.sbj[l_row].updated_time > db_data.sbj[l_row].updated_time) {
                            n_data.sbj[l_row] = l_data.sbj[l_row];
                        }
                        else {
                            n_data.sbj[l_row] = db_data.sbj[l_row];
                        }
                    }
                    else {
                        n_data.sbj[l_row] = l_data.sbj[l_row];
                    }
                }

                for (let db_row in db_data.sbj) {
                    if (l_data.sbj[db_row] !== undefined) {
                        if (db_data.sbj[db_row].updated_time > l_data.sbj[db_row].updated_time) {
                            n_data.sbj[db_row] = db_data.sbj[db_row];
                        }
                        else {
                            n_data.sbj[db_row] = l_data.sbj[db_row];
                        }
                    }
                    else {
                        n_data.sbj[db_row] = db_data.sbj[db_row];
                    }
                }
                dataUpdate(n_data);
                varUpdate();
                window.alert('已經成功同步鏈結!請刷新頁面！');
            }
        }
        else {
            window.alert('已經成功同步鏈結!請刷新頁面！');
        }
    });


}

//Vertify the user information with the db
function getData_db(callback, stu_id = data.stu_id, secret = data.secret) {
    if (data.secret) {
        try {
            GM_xmlhttpRequest({
                method: 'POST',
                data: JSON.stringify({ stu_id: stu_id, secret: secret }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                url: 'https://1sb0uuhzaa.execute-api.ap-southeast-1.amazonaws.com/beta/api/getdata',
                onload: function(res) {
                    let row = JSON.parse(res.responseText);
                    if (row.status) {
                        db_data = row.data;
                        callback(row.data);
                        console.log(row.message);
                    }
                    else {
                        console.error(row.message);
                    }
                },
                onerror: function() {
                    console.error('** An error occurred during the transaction');
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    }
}

function updateData_db() {
    if (data.secret) {
        try {
            data.sync_time = Date.now();
            GM_xmlhttpRequest({
                method: 'POST',
                data: JSON.stringify({ stu_id: data.stu_id, secret: data.secret, data: data }),
                headers: {
                    'Content-Type': 'application/json'
                },
                url: 'https://1sb0uuhzaa.execute-api.ap-southeast-1.amazonaws.com/beta/api/updateData',
                onload: function(res) {
                    let row = JSON.parse(res.responseText);
                    row.status ? console.log(row.message) : console.error(row.message);
                },
                onerror: function() {
                    console.error('** An error occurred during the transaction');
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    }

}

function db_sync_chk() {
    if (data.secret) {
        getData_db(function() {
            if (parseInt(db_data.sync_time, 10) > data.sync_time) {
                data = db_data;
                dataUpdate(data);
            }
        });
    }
}

//=========================================================== End Account =================================================================================

// Create element
function createElement() {
    //calc button if no total hours set
    calc_btn = document.createElement("button");
    calc_btn.setAttribute("style", "width:100%;padding:10px;background-color:#555;color:#fff;border:0;line-height:14px;font-size:13px;");
    calc_btn.setAttribute("id", "calcBtn");
    calc_btn.innerHTML = "計算出缺率";

    //Info, edit time button, and toggle button
    sbj_info_div = document.createElement("div");
    sbj_info_div.setAttribute("style", "width:12vw;position:fixed;right:0;bottom:0;border:0;font-family:'Microsoft jhenghei';z-index:999");
    sbj_info_div.setAttribute("id", "sbjDiv");
    sbj_info = document.createElement("p");
    sbj_info.setAttribute("style", "margin:0;width:100%;background-color:#555;color:#fff;border:0;border-bottom:1px solid #fff;line-height:14px;font-size:13px;");
    sbj_info.setAttribute("id", "sbjInfo");
    sbj_edit_time_btn = document.createElement("button");
    sbj_edit_time_btn.setAttribute("style", "width:85%;padding:10px;background-color:#555;color:#fff;border:0;line-height:14px;font-size:13px;");
    sbj_edit_time_btn.setAttribute("id", "editTimeBtn");
    sbj_edit_time_btn.innerHTML = "編輯總時數";
    toggle_btn = document.createElement("button");
    toggle_btn.setAttribute("style", "width:15%;padding:10px;background-color:#555;color:#fff;border:0;line-height:14px;font-size:13px;");
    toggle_btn.setAttribute("id", "btnToggle");
    toggle_btn.innerHTML = "-";

    //Dashboard
    sbj_dashboard_div = document.createElement("div");
    sbj_dashboard_div.setAttribute("style", "min-width:24vw;position:fixed;left:0;bottom:0;border:0;font-family:'Microsoft jhenghei';z-index:999");
    sbj_dashboard_div.setAttribute("id", "sbjDashboardDiv");
    sbj_dashboard = document.createElement("table");
    sbj_dashboard.setAttribute("style", "width:100%;padding:10px;background-color:#555;color:#fff;border:0;line-height:14px;font-size:13px;");
    sbj_dashboard.setAttribute("id", "sbjDashboard");
    sbj_select_btn = document.createElement("button");
    sbj_select_btn.setAttribute("id", "sbjSelectBtn");
    sbj_select_btn.setAttribute("style", "width:100%;padding:10px;background-color:#555;color:#fff;border:0;line-height:14px;font-size:13px;border-top: 1px solid #fff;");
}


// =================================================================== Event Listener Function =================================================================== //


//Update the subject hours
function sbjHoursUpdate_Click() {
    $("#editTimeBtn").click(function() {
        let t_hours = window.prompt("編輯該單元的總時數", data.sbj[c_id].t_hours);
        if (t_hours !== "" && t_hours == parseInt(t_hours, 10)) {
            data.sbj[c_id].t_hours = t_hours;
            dataUpdate(data);
            sbj_chk();
        }
        else {
            window.alert('發生錯誤。Error201');
        }
    });
}
//Ask the user to input the total hours of this subject
function sbjInputHours_Click() {
    $("#calcBtn").click(function() {
        let t_hours = window.prompt("請輸入該單元的總時數");
        if (t_hours !== "" && t_hours == parseInt(t_hours, 10)) {
            sbjCreate(t_hours);
            sbj_chk();
        }
        else {
            window.alert('發生錯誤。Error202');
        }
    });
}
//Function for toggle button
function calcToggle() {
    $("#btnToggle").click(function() {
        //$('#btnToggle').html(this.html == "+" ? "-" : "+");
        $("#sbjInfo").slideToggle();
        $("#sbjDashboardDiv").slideToggle();
        document.getElementById("btnToggle").innerHTML = document.getElementById("btnToggle").innerHTML === "+" ? "-" : "+";
    });
}

// Check is Subject inside array, if NOT push array
function sbjDashboardArray_Click() {
    $("#sbjSelectBtn").click(function() {
        $('#sbjSelectBtn').text(this.text == "加入" ? "清除" : "加入");
        data.dashboard[c_id] ? delete data.dashboard[c_id] : data.dashboard[c_id] = c_id;
        dataUpdate(data);
        dashboard();
    });
}

// =================================================================== End of Event Listener Function =================================================================== //

//!!!!!!!!!!!!!!!!!!!!!!!!!!! IMPORTANT FUNCTION !!!!!!!!!!!!!!!!!!!!!!!!!!!//
//!!!!!!!!!!!!!!!!!!!!!!!!!!! IMPORTANT FUNCTION !!!!!!!!!!!!!!!!!!!!!!!!!!!//
//!!!!!!!!!!!!!!!!!!!!!!!!!!! IMPORTANT FUNCTION !!!!!!!!!!!!!!!!!!!!!!!!!!!//
//Check if the subject have record or not, if yes then append and calculate the result
function sbj_chk() {
    if (c_id in data.sbj) {
        if (!ini) {
            $("#calcBtn").remove();
            document.getElementById("sbjDiv").append(sbj_info);
            document.getElementById("sbjDiv").append(sbj_edit_time_btn);
            document.getElementById("sbjDiv").append(toggle_btn);
            document.getElementById("sbjDashboardDiv").append(sbj_dashboard);
            document.getElementById("sbjDashboardDiv").append(sbj_select_btn);
            sbjHoursUpdate_Click();
            sbjDashboardArray_Click();
            calcToggle();
            ini = true;
        }
        sbj_calc();
    }
    else {
        document.getElementById("sbjDiv").append(calc_btn);
        sbjInputHours_Click();
    }
}
//!!!!!!!!!!!!!!!!!!!!!!!!!!! IMPORTANT FUNCTION !!!!!!!!!!!!!!!!!!!!!!!!!!!//
//!!!!!!!!!!!!!!!!!!!!!!!!!!! IMPORTANT FUNCTION !!!!!!!!!!!!!!!!!!!!!!!!!!!//
//!!!!!!!!!!!!!!!!!!!!!!!!!!! IMPORTANT FUNCTION !!!!!!!!!!!!!!!!!!!!!!!!!!!//

//Calculate the result
function sbj_calc() {
    //Get Table Data to Arrays
    let tb_array = [],
        headers = [],
        sbj_hours = data.sbj[c_id].t_hours;
    $('table.hkvtcsp_wording th').each(function(index, item) {
        headers[index] = $(item).text();
    });
    $('table.hkvtcsp_wording tr').has('td').each(function() {
        let arrayItem = {};
        $('td', $(this)).each(function(index, item) {
            arrayItem[headers[index]] = $(item).text();
        });
        tb_array.push(arrayItem);
    });
    let att_lesson = 0,
        abs_lesson = 0,
        late_lesson = 0,
        tt_lesson_time = 0,
        tt_att_time = 0,
        tt_abs_time = 0,
        att_time, abs_time, i = 0;
    for (i = 0; i < tb_array.length; i++) {
        let lesson_time_array = tb_array[i]['課堂時間'].split("-");
        //Lesson Count
        switch (tb_array[i]['']) {
            case 'Present':
                att_lesson++;
                break;
            case 'Late':
                late_lesson++;
                break;
            case 'Absent':
                abs_lesson++;
                break;
        }
        //ABS & ATT Caculate
        var arrived_time = tb_array[i]['出席時間'];
        var row_lesson_time_start = new Date();
        var lesson_time_array_0 = lesson_time_array[0].split(':');
        row_lesson_time_start.setHours(lesson_time_array_0[0], lesson_time_array_0[1]);
        var row_lesson_time_end = new Date();
        var lesson_time_array_1 = lesson_time_array[1].split(':');
        row_lesson_time_end.setHours(lesson_time_array_1[0], lesson_time_array_1[1]);
        var row_lesson_time_arrived = new Date();
        if (arrived_time !== '-') {
            arrived_time = arrived_time.split(':');
            row_lesson_time_arrived.setHours(arrived_time[0], arrived_time[1]);
            if (row_lesson_time_arrived > row_lesson_time_start.setMinutes(row_lesson_time_start.getMinutes() + 10)) {
                row_lesson_time_start.setHours(lesson_time_array_0[0], lesson_time_array_0[1]);
                att_time = (row_lesson_time_end - row_lesson_time_arrived) / 1000 / 60;
                abs_time = (row_lesson_time_arrived - row_lesson_time_start) / 1000 / 60;
            }
            else {
                row_lesson_time_start.setHours(lesson_time_array_0[0], lesson_time_array_0[1]);
                att_time = (row_lesson_time_end - row_lesson_time_start) / 1000 / 60;
                abs_time = 0;
            }
        }
        else {
            att_time = 0;
            abs_time = (row_lesson_time_end - row_lesson_time_start) / 1000 / 60;
        }
        tt_lesson_time = tt_lesson_time + ((row_lesson_time_end - row_lesson_time_start) / 1000 / 60);
        tt_att_time = tt_att_time + att_time;
        tt_abs_time = tt_abs_time + abs_time;
    }
    let time_remain;
    if (sbj_hours * 60 * 0.3 >= tt_abs_time) {
        time_remain = (sbj_hours * 60 * 0.3) - tt_abs_time;
        time_remain = time_convert(time_remain);
    }
    else {
        time_remain = "-/-";
    }
    //var sbj_array = JSON.parse(GM_getValue(sbj));
    data.sbj[c_id].att = time_convert(tt_att_time);
    data.sbj[c_id].att_p = (tt_att_time / (sbj_hours * 60) * 100).toFixed(2) + "%";
    data.sbj[c_id].abs = time_convert(tt_abs_time);
    data.sbj[c_id].abs_p = (tt_abs_time / (sbj_hours * 60) * 100).toFixed(2) + "%";
    data.sbj[c_id].remain = time_remain;
    data.sbj[c_id].avg_att = (60 / (sbj_hours * 60) * 100).toFixed(2) + "%";
    dataUpdate(data);
    let calcResult = "<p style='padding:18px 25px;margin:0;line-height:130%'><b>計算結果 :</b><br>" +
        "<br>總時數 : " + sbj_hours + u_hour + "\n" +
        "<br>已上課堂時數 : " + time_convert(tt_lesson_time) +
        "<br><br>總出席時數 : " + time_convert(tt_att_time) +
        "<br>出席率 : " + (tt_att_time / (sbj_hours * 60) * 100).toFixed(2) + "%" +
        "<br><br>總缺席時數 : " + time_convert(tt_abs_time) + "\n" +
        "<br>缺席率 : " + (tt_abs_time / (sbj_hours * 60) * 100).toFixed(2) + "%" +
        "<br><br>每小時缺席率 : " + (60 / (sbj_hours * 60) * 100).toFixed(2) + "%" +
        "<br>剩餘可缺席時數 : " + time_remain + "</p>";
    document.getElementById("sbjInfo").innerHTML = calcResult;
    dashboard();
}

//Out put the dashboard record
function dashboard() {
    let isExist = false;
    if (!($.isEmptyObject(data.dashboard))) {
        document.getElementById("sbjDashboard").innerHTML = "<tr><td>單元</td><td>出席率</td><td>缺席率</td><td>剩餘</td></tr>";
        for (let id in data.dashboard) {
            if (c_id === data.dashboard[id]) {
                isExist = true;
                document.getElementById("sbjDashboard").innerHTML += "<tr><td><b><i>" + data.sbj[id].name + "</i></b></td><td><b><i>" + data.sbj[id].att_p + "</i></b></td><td><b><i>" + data.sbj[id].abs_p + "</i></b></td><td><b><i>" + data.sbj[id].remain + "</i></b></td></tr>";
            }
            else {
                document.getElementById("sbjDashboard").innerHTML += "<tr><td>" + data.sbj[id].name + "</td><td>" + data.sbj[id].att_p + "</i></b></td><td><b><i>" + data.sbj[id].abs_p + "</td><td>" + data.sbj[id].remain + "</td></tr>";
            }
        }
    }
    else {
        document.getElementById("sbjDashboard").innerHTML = "<tr><td>單元</td><td>出席率</td><td>缺席率</td><td>剩餘</td></tr><tr><td colspan=\"4\" style=\"text-align:center\"><b><i>暫無資料</i></b></td></tr>";
    }
    document.getElementById("sbjSelectBtn").innerHTML = isExist ? "清除" : "加入";
}

// Confirmation of update all subject in dashboard
function sbj_update_all_confirm() {
    if (window.confirm('確認更新報告表中的所有單元？其間將會不斷更新畫面。')) {
        sbj_update_all();
    }
}

// Update all subject in dashbpard
function sbj_update_all() {
    var temp = JSON.parse(GM_getValue('temp_' + getStuId()) || '{}');
    if (data.dashboard && JSON.stringify(temp) !== JSON.stringify(data.dashboard)) {
        for (let i in data.dashboard) {
            if (!(i in temp)) {
                temp[i] = data.dashboard[i];
                GM_setValue('temp_' + getStuId(), JSON.stringify(temp));
                $('.hkvtcsp_textInput').val('ITE4103').trigger('change');
                break;
            }
        }
    }
    else if (JSON.stringify(temp) === JSON.stringify(data.dashboard)) {
        window.alert('更新完成！');
        GM_deleteValue('temp_' + getStuId());
    }
}

(function() {
    if ($('table.hkvtcsp_wording').length) {
        initialize();
        document.body.insertBefore(sbj_info_div, document.body.firstChild);
        document.body.insertBefore(sbj_dashboard_div, document.body.firstChild);
        var sbjCls = document.getElementsByClassName("hkvtcsp_textInput");
        c_id = sbjCls[0].options[sbjCls[0].selectedIndex].value;
        c_name = sbjCls[0].options[sbjCls[0].selectedIndex].text;
        db_sync_chk();
        sbj_chk();
        if (GM_getValue('temp_' + getStuId())) {
            sbj_update_all();
        }
    }
})();
