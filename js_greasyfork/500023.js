// ==UserScript==
// @name         Scheduling Subject Registration
// @namespace    http://tampermonkey.net/
// @version      2024-07-03
// @description  tool helping alot with subject registation
// @author       Minh Triet (Alex Ng)
// @match        https://uis.ptithcm.edu.vn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT



// @downloadURL https://update.greasyfork.org/scripts/500023/Scheduling%20Subject%20Registration.user.js
// @updateURL https://update.greasyfork.org/scripts/500023/Scheduling%20Subject%20Registration.meta.js
// ==/UserScript==


GM_addStyle(`
 .card-header {
        border-radius: 15px !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.125) !important;
        padding: 0.75rem 1.25rem !important;
        margin-bottom: 0 !important;
    }

    .container-fluid {
        border-radius: 15px !important;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3) !important;

    }

    .card {
        border: 0px solid rgba(0, 0, 0, 0.125) !important;
        border-radius: 15px !important;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.125) !important;
    }

    .btn-primary {
        border: 0px solid rgba(0, 0, 0, 0.125) !important;
        border-radius: 15px !important;
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.125) !important;
    }



    html {
        background: #f2f2f2;
    }
    body {
        background: inherit !important;
        margin: 0;
        font-family: "Inter", sans-serif;
    }

    .banner {
        background-color: #fff !important;
    }

    .banner {
        display: block;
        width: 100% !important;
        height: 728px !important;
        border-bottom-left-radius: 15px !important;
        border-bottom-right-radius: 15px !important;

    }

    .float {
        position: fixed;
        z-index: 1;
        width:60px;
        height:60px;
        bottom:40px;
        right:40px;
        color: #000000;
        background: #FFF;
        border-radius: 50%;
        border: none;
        transition: box-shadow 400ms cubic-bezier(0.2, 0, 0.7, 1), transform 200ms cubic-bezier(0.2, 0, 0.7, 1);
      }
    .float:after {
        font-size: 2.5em;
        line-height: 1.1em;
      }
    .float:hover {
        box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.22) rgba(0, 0, 0, 0.36) rgba(0, 0, 0, 0.3) !important;

        transform: scale(1.05);

    }

    .editTKB {
        background-color:#2fa4e7 !important;

    }

    .editTKB > i {
        color: #fff !important;
    }

    #tkb_div {
        height: auto;
        width: 80% !important;
        margin-left: 10% !important;
        margin-right: 10% !important;
        margin-top: 60px;
        align-items: center;
        justify-content: center;
        background-color: #fefefe;
    }

    .danhsachmonhoc_text {
        text-align: center;
        margin: auto;
    }

    .tkb_preview_table > thead {
        background-color: #2fa4e7;

    }

    .tkb_preview_table > thead > tr > th {
        color: #fff;
        padding: 0.5px;
        text-align: center;
    }

    .cellqh {
        border: 1px solid green;
        max-width: 14px;
        max-height: 6px;
        font-size: 13px;
        position: relative;
        border-bottom: 1px dotted black;
        padding: 2px;
        text-align: center;

    }

    .tooltiptext {
        font-size: 8px;
    }

    .cellqh .tooltiptext {
        visibility: hidden;
        width: 120px;
        background-color: black;
        color: #fff;
        text-align: center;
        padding: 5px 0;
        border-radius: 6px;
        position: absolute;
        z-index: 1;
        display: block;
        float: left;
      }
      .cellqh:hover .tooltiptext:not(:empty) {
        visibility: visible;
      }

      .cellqh:hover .tooltiptext {
        visibility: visible;
      }

    .starttimerow {
        padding: 1px;
        vertical-align: middle;
        border-top: 0.2px solid #2fa4e7;
        background-color: #2fa4e7;
        color: #fff;
        max-width: 30px;
        max-height: 10px;
        font-size: 8px;
    }

    .chonngaydiv {
        text-align: center;
        margin-bottom: 10px;
        background-color: #fefefe;
        border-collapse: collapse;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.02);
        align-items: center;
        justify-content: center;
        margin-left: auto;
        margin-right: auto;
        margin-top: 30px;

    }

    .danhsachmonhoc {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        flex-wrap: wrap;
        background-color: #fefefe;
        border-collapse: collapse;
        flex-direction: column;
    }

    .dropdownlecture {
        text-align: center;
        margin-bottom: 10px;
        margin-top: 30px;
        background-color: #fefefe;
        border-collapse: collapse;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.02);
        background-color: #fefefe;
        margin-left: 30%;
        margin-right: 30%;
        width: 40%;
    }

    input[type="date"]::-webkit-datetime-edit, input[type="date"]::-webkit-inner-spin-button, input[type="date"]::-webkit-clear-button {
        color: #fff;
        position: relative;
    }

      input[type="date"]::-webkit-datetime-edit-year-field {
        position: absolute !important;
        border-left:1px solid #8c8c8c;
        padding: 2px;
        color:#000;
        left: 56px;
      }

      input[type="date"]::-webkit-datetime-edit-month-field {
        position: absolute !important;
        border-left:1px solid #8c8c8c;
        padding: 2px;
        color:#000;
        left: 26px;
      }


    input[type="date"]::-webkit-datetime-edit-day-field {
        position: absolute !important;
        color:#000;
        padding: 2px;
        left: 4px;
    }

    .timetables {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
        }

        .timetable-container {
            width: calc(100% / 5 - 20px);
            margin: 10px;
        }

        .timetable-container h2 {
            text-align: center;
        }

        .timetable {
            width: 100%;
            border-collapse: collapse;
        }

        .timetable th, .timetable td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: center;
        }

        .timetable th {
            background-color: #f2f2f2;
        }

        @media (max-width: 1200px) {
            .timetable-container {
                width: calc(100% / 4 - 20px);
            }
        }

        @media (max-width: 992px) {
            .timetable-container {
                width: calc(100% / 3 - 20px);
            }
        }

        @media (max-width: 768px) {
            .timetable-container {
                width: calc(100% / 2 - 20px);
            }
        }

        @media (max-width: 576px) {
            .timetable-container {
                width: 100%;
            }
        }
    `);



window.onload = function() {
    unsafeWindow.scraptSubjects = scraptSubjects;
    unsafeWindow.drawTable = drawTable;
    unsafeWindow.process = process;


    const floatingButton = document.createElement('button');
    floatingButton.innerHTML = `<button class="float"><i class="fa fa-cogs"></i></button>`;
    floatingButton.onclick = function() {
        var float = $(".float");
        float.addClass("editTKB");

        process()
        ensureDropdownEventListener()
        ensureCheckBoxEventListener()
    }

    document.body.appendChild(floatingButton)
    // we have input's class name, so how to combine with?
}


class Subject {
    constructor(subjectCode, subjectName, groupCode, teamCode, classCode, timeTable) {
        this.subjectCode = subjectCode
        this.subjectName = subjectName
        this.groupCode = groupCode
        this.teamCode = teamCode.trim().length >= 1 ? teamCode : ''
        this.classCode = classCode
        this.timeTable = reformatRoutine(timeTable)
    }
}



const registeredSubjects = new Map();
const subjects = new Map();
const nameStoring = new Map();
const storeCheckedSubjects = new Set();
let dateStart = new Date( '2024-08-12' );

const tables = Array.from({ length: 28 }, () => Array.from({ length: 14 }, () => Array.from({ length: 7 }, () => [])));


function scraptSubjects() {
    let nameStoring = new Map();
    unsafeWindow.subjects = subjects;
    $(".custom-control").attr("style", "display :none !important");
    const tableSubjects = $('tbody')[28]
    const rows = tableSubjects.children

    for (let i = 0; i < rows.length; i++) {
        // enable checked for this input
        const subject = new Subject(
            rows[i].children[1].innerText,
            rows[i].children[2].innerText,
            rows[i].children[3].innerText,
            rows[i].children[4].innerText,
            rows[i].children[6].innerText,
            rows[i].children[9].innerText
        )


        nameStoring.set(rows[i].children[1].innerText, rows[i].children[2].innerText)


        const key = subject.subjectCode + subject.groupCode + subject.teamCode
        subjects.set
        (
            key,
            subject
        ); // key -value

        // modify checkbox
        let form = $(rows[i]).find("form")
        let tag = `<input type='checkbox' class='editCheckBoxInput' value="${key}">`
        form.append(tag)
    }

    subjects.forEach((value, key) => {
        console.log(key, value)
    })

    // add dropdown
    var dropDown = $(".dropdownlecture");
    dropDown.empty();
    dropDown.append('<option value ="all" class ="">All</option>');

    for (let [key, value] of nameStoring) {
        dropDown.append(`<option value ="${key}">${key} ${value}</option>`);
    }

    alert("Đã tải xong dữ liệu môn học");

}



function ensureDropdownEventListener() {
    let inputEle;

    var timer = setInterval(() => {
        if ($('.dropdownlecture').length == 0) {
            return;
        }
        else {
            $(".dropdownlecture").change(function(event) {


                if (inputEle == undefined) {
                    inputEle = document.getElementsByClassName("form-control form-control-sm small text-secondary ng-untouched ng-pristine ng-valid")[0]
                }
                if (event.target.value == "all") {
                    inputEle.value = "";
                }
                else {
                    inputEle.value = event.target.value
                }
                const inputEvent = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                inputEle.dispatchEvent(inputEvent);

                reinitializeCheckboxInput()

            })
            clearInterval(timer);
        }
    }, 200)
    }

function ensureCheckBoxEventListener() {
    var time = setInterval(() => {
        if ($('.editCheckBoxInput').length == 0) {
            return;
        }
        else {
            $(".editCheckBoxInput").change(function(event) {
                const key = event.target.value
                console.log(key);
                const subject = subjects.get(key)

                if (event.target.checked) {
                    if (registeredSubjects.has(subject.subjectCode)) {
                        alert("Môn học đã được đăng ký");
                        $(event.target).prop('checked', false);
                    }
                    else {
                        console.log(subject)
                        addSubjectToTable(subject);

                        registeredSubjects.set(subject.subjectCode, subject);
                        storeCheckedSubjects.add(key);
                        $(".danhsachmonhoc").empty();

                        for (let [key, value] of registeredSubjects) {
                            $(".danhsachmonhoc").append(`<div class="${value.subjectCode}">${value.subjectCode} | ${value.subjectName} | ${value.classCode}</div>`);
                        }



                    }
                }
                else {
                    registeredSubjects.delete(subject.subjectCode);
                    storeCheckedSubjects.delete(key);
                    removeSubjectFromTable(subject);

                    $(".danhsachmonhoc").empty();

                    for (let [key, value] of registeredSubjects) {
                        $(".danhsachmonhoc").append(`<div class="${value.subjectCode}">${value.subjectCode} | ${value.subjectName} | ${value.classCode}</div>`);
                    }
                }
            })

            clearInterval(time);
        }
    }, 200)
    }




function addSubjectToTable(subject) {
    // add to table times
    subject.timeTable.forEach((item) => {
        console.log(item);
        let distanceStart = caculateDistanceTwoDays(item.start, dateStart);
        let distanceEnd = caculateDistanceTwoDays(item.end, dateStart);
        let day = item.day;

        let start = Math.floor(distanceStart / 7);
        let end = Math.floor(distanceEnd / 7);

        console.log(start, end);

        while (start <= end) {
            for (let i = item.time[0] - 1; i <= item.time[1] - 1; i++) {
                tables[start][i][day - 2].push({
                    subjectCode: subject.subjectCode,
                    subjectName: subject.subjectName,
                    classCode: subject.classCode
                });
                // console.log(`start: ${start} i: ${i} day: ${day} subject: ${subject.subjectCode}  tables: ${tables[start][i][day]}`)
            }
            start++;
        }
    })
    updateTable(tables)
}


function removeSubjectFromTable(subject) {
    // remove from table times

    subject.timeTable.forEach((item) => {
        let distanceStart = caculateDistanceTwoDays(item.start, dateStart);
        let distanceEnd = caculateDistanceTwoDays(item.end, dateStart);
        let day = item.day;

        let start = Math.floor(distanceStart / 7);
        let end = Math.floor(distanceEnd / 7);


        while (start <= end) {
            for (let i = item.time[0] - 1; i <= item.time[1] - 1; i++) {
                let index = tables[start][i][day - 2].findIndex((item) => item.subjectCode == subject.subjectCode)
                tables[start][i][day - 2].splice(index, 1);
            }
            start++;
        }

    })
    updateTable(tables)

}
function updateTable(tables) {
    const states = {
        available: {
            color: "white",
            icon: "+",
            colorText: "black"
        },

        full: {
            // don't have any subject
            color: 'green',
            icon: "o",
            colorText: "white"
        },

        // have one subject
        // have more than one subject
        over: {
            color: 'red',
            icon: "x",
            colorText: "white"
        }
    }

    for (let i = 0; i < 28; i++) {
        for (let r = 0; r < 14; r++) {
            for (let c = 0; c < 7; c++) {
                let id = "tkb" + i + r + c;
                let cell = $(`#${id}`);

                let state = states.available;
                if (tables[i][r][c].length == 1) {
                    state = states.full;
                }
                else if (tables[i][r][c].length > 1) {
                    state = states.over;
                }

                let hoverText = tables[i][r][c].map((item) => {
                    return `${item.subjectCode} - ${item.subjectName} - ${item.classCode}`
                }).join("\n")
                cell.css('background-color', state.color);
                cell.css('color', state.colorText);
                cell.text(state.icon);
                cell.attr('title', hoverText );

                // hover event for cell
            }
        }

    }
}






function reformatRoutine(str) {
    try {
        if (str.trim() == "")
            return [];

        str = str.toLowerCase();

        const dayInWeek = new Map([
            ["thứ 2", 2],
            ["thứ 3", 3],
            ["thứ 4", 4],
            ["thứ 5", 5],
            ["thứ 6", 6],
            ["thứ 7", 7],
            ["chủ nhật", 8]
        ]);


        return str.split("\n").map((item) => {
            if (item.indexOf("đến") == -1) {
                let [day, time, date] = item.split(",");
                let [startDay, startMonth, startYear] = date.split("/");
                let [start, end] = time.replace("tiết", "").trim().split("->").map((item) => parseInt(item));
                startYear = startYear.replace(/\D/g, "");

                return {
                    day: dayInWeek.get(day),
                    time: [start, end],
                    start: new Date(`20${startYear.trim()}-${startMonth.trim()}-${startDay.trim()}`),
                    end: new Date(`20${startYear.trim()}-${startMonth.trim()}-${startDay.trim()}`)
                };
            }

            let [day, time, date] = item.split(",");
            let [start, end] = date.split("đến");
            let [startDay, startMonth, startYear] = start.split("/");
            let [endDay, endMonth, endYear] = end.split("/");
            endYear = endYear.replace(/\D/g, "");

            time = time.replace("tiết", "").trim().split("->").map((item) => parseInt(item));

            return {
                day: dayInWeek.get(day),
                time: time,
                start: new Date(`20${startYear.trim()}-${startMonth.trim()}-${startDay.trim()}`),
                end: new Date(`20${endYear.trim()}-${endMonth.trim()}-${endDay.trim()}`)
            };


        });

    } catch (e) {
        console.log(e);
        return [];
    }
}




function drawTable() {
    let rows = 14; // Number of rows representing the periods
    let cols = 7; // Number of columns representing the days
    let tables = [];

    // Creating the main div container for the timetable
    let tkb_div = $("<div id='tkb_div' class='flex flex-wrap justify-center flex-row items-center'></div>");


    // draw tables that have 20 tables 1 table represent 1 week, and 1 day have 14 rows

    for (let i = 0; i < 28; i++) {
        let table_id = "tkbPreview" + i + 1;
        tables[i] = $('<table style="text-align:center;border-collapse: collapse;" class="tkb_preview_table" id="' + table_id + '"><thead> <th></th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th></th></thead><tbody>');

        for (let r = 0; r < rows; r++) {
            let start_time_in_hr = r +1;
            let tkb_separator = r % 2 ? 'border-bottom:2px solid #2fa4e7;' : '';
            let tr = $('<tr style="height:1px;' + tkb_separator + '"><td class="starttimerow">' + start_time_in_hr + '</td>');

            for (let c = 0; c < cols; c++) {
                let id = "tkb" + i + r + c;
                $('<td class="cellqh" id="' + (id) + '">+</td>').appendTo(tr);
            }



            tr.appendTo(tables[i]);
        }

        $('</tbody></table>').appendTo(tables[i]);
        tkb_div.append(tables[i]);



    }
    tkb_div.attr("style", "display:flex; flex-wrap: wrap; padding: 10px; justify-content: center; align-items: center;")
    // Adding date picker and dropdown for lectures
    let date_pickerSection = $("<div id= 'datepickersection'></div>");
    date_pickerSection.append('<div class="chonngaydiv"><label for="datetimepicker">Chọn ngày bắt đầu tuần đầu tiên (Xem trong TKB tuần)</label><input class="inputdate" id="datetimepicker" type="date" value="2024-08-12"></input><br></div>');
    date_pickerSection.append('<select class="dropdownlecture"><option value="" class="label_dropdownlecture">Chọn môn</option></select>');
    date_pickerSection.append('<div class="danhsachmonhoc_text"><strong>Các môn đã đăng ký</strong></div>');
    date_pickerSection.append('<div class="danhsachmonhoc"></div>');



    // Adding the timetable to the page
    $("div.card-body.p-0 div.row.d-flex.justify-content-center.text-nowrap.pt-1").prepend(date_pickerSection);
    $("div.card-body.p-0 div.row.d-flex.justify-content-center.text-nowrap.pt-1").prepend(tkb_div);

    let introduce = $("<div class='introduce'></div>")

    introduce.append("<h3>Made by Minh Triet(Alex Ng)</h3>")
    introduce.append("<h3>Tool hỗ trợ sắp xếp thời gian biểu PTITHCM</h3>")
    introduce.append("<h3>1. Chọn thời gian bắt đầu của kì học mới</h3>")
    introduce.append("<h3>2. Chọn môn học muốn đăng ký</h3>")
    introduce.append("<h3>Note: Ô màu trắng thì chưa có môn nào chiếm chỗ</h3>")
    introduce.append("<h3>Ô màu xanh thì đang có 1 môn, Ô màu đỏ là ô không hợp lệ(chứa 2 môn)</h3>")
    introduce.append("<h3>Không chịu trách nhiệm dưới bất kì hình thức nào</h3>")
    introduce.append("<h3>Mình mong sẽ nhận được feedbacks từ các bạn, facebook: https://fb.com/triet.nguyen.39904181 </h3>")
    introduce.attr("style", "display:flex; ; padding: 10px; justify-content: center; align-items: center; flex-direction: column")



    $("div.card-body.p-0 div.row.d-flex.justify-content-center.text-nowrap.pt-1").prepend(introduce);



}





function process() {
    if ($("#tkb_div").length == 0) {
        drawTable();
    }

    if (subjects.size == 0) {
        scraptSubjects();
    }

}





function reinitializeCheckboxInput() {
    // wait for the input to be loaded

    var timer = setInterval(() => {
        if ($('.editCheckBoxInput').length == 0) {
            return;
        }

        else {
            const tableSubjects = $('tbody')[28]
            const rows = tableSubjects.children
            // delete all checkbox
            // delete all checkbox, consist old or new
            //
            for (let i = 0; i < rows.length; i++) {
                let form = $(rows[i]).find("form")
                // replace this input with new input
                let key = rows[i].children[1].innerText + rows[i].children[3].innerText + rows[i].children[4].innerText;

                let currTag = $(form).find("input");

                currTag.attr("value", key);
                if (storeCheckedSubjects.has(key)) {
                    currTag.prop('checked', true);
                }
                else {
                    currTag.prop('checked', false);
                }
            }
            clearInterval(timer);
        }
    }, 200)
    }





function caculateDistanceTwoDays(day1, day2) {
    const parsedDate1 = new Date(day1);
    const parsedDate2 = new Date(day2);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = parsedDate2 - parsedDate1;

    // Convert milliseconds to days
    const millisecondsInOneDay = 1000 * 60 * 60 * 24;
    const differenceInDays = differenceInMilliseconds / millisecondsInOneDay;

    return Math.abs(differenceInDays);
}



// listener for choosing date in date tag
$(document).ready(function() {
    $(document).on('change', '.inputdate', function(event) {
        dateStart = new Date(event.target.value);

    })
})


