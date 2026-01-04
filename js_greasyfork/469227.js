// ==UserScript==
// @name        QLDT Enhance by quochungcyou
// @description Some enhance for QLDT PTIT by quochungcyou
// @author      quochungcyou
// @match      https://*.qldt.ptit.edu.vn/*
// @version     BCVT.1.0.4
// @grant    GM_addStyle
// @grant   GM_getValue
// @grant   GM_setValue
// @grant unsafeWindow
// @run-at      document-start
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @license MIT

// @namespace https://greasyfork.org/users/1108896
// @downloadURL https://update.greasyfork.org/scripts/469227/QLDT%20Enhance%20by%20quochungcyou.user.js
// @updateURL https://update.greasyfork.org/scripts/469227/QLDT%20Enhance%20by%20quochungcyou.meta.js
// ==/UserScript==

//
//Some round corner for button



GM_addStyle(`
    /* Tròn nút */
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


    /* Dịu mắt */
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
        transform: rotate(45deg);
        box-shadow: 0 0 1px 15px rgba(138, 59, 88, 0.4), 0 0 1px 30px rgba(138, 59, 88, 0.1), 0 0 1px 45px rgba(138, 59, 88, 0.1);
      }

    .editTKB {
        background-color:#AD171C !important;
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
        background-color: #AD171C;
    }

    .tkb_preview_table > thead > tr > th {
        color: #fff;
        padding: 0.5px;
        text-align: center;
    }

    .cellqh {
        border: 1px solid green;
        max-width: 8px;
        max-height: 8px;
        font-size: 8px;
        position: relative;
        border-bottom: 1px dotted black;
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
        border-top: 0.2px solid #edeef2;
        background-color: #AD171C;
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

    `
);





var specialValue = 55546;

//Khi load xong
window.onload = function () {
    //Thêm nút cài đặt
    if (!unsafeWindow.tkbLich) {
        unsafeWindow.tkbLich = tkbLich;
        unsafeWindow.addEdit = addEdit;
        unsafeWindow.removeEdit = removeEdit;
        unsafeWindow.getData = getData;
        unsafeWindow.caoMaMon = caoMaMon;
    }

    const floatingButton = document.createElement('button');
    floatingButton.innerHTML = `<button onclick="tkbLich()" class="float"><i class="fa fa-cogs"></i></button>`;

    document.body.appendChild(floatingButton)

    let elements = document.querySelectorAll(".clickable.ng-untouched.ng-pristine.ng-valid input[type='checkbox']");
    for (let i = 0; i < elements.length; i++) {
        let element = $(elements[i]);
        if (element.prop("checked") == true) {
            element.prop("checked", false);
            let clickEvent = new Event("click");
            elements[i].dispatchEvent(clickEvent);
        }

    }


}


//Cào mã môn học và tên môn học
function caoMaMon() {
    var maMon = new Map();
    var dataTenMon = new Map();
    maMon.clear();
    dataTenMon.clear();
    let elements = $(".editTKBcheckbox");
    for (let i = 0; i < elements.length; i++) {
        let ele = $(elements[i]);
        let data = ele.closest("tr"); //tìm lại data của cả hàng
        let ma = data.find("td:nth-child(2)").text();
        let ten = data.find("td:nth-child(3)").text();
        let lop = data.find("td:nth-child(7)").text();
        let to = data.find("td:nth-child(5)").text(); //tổ thực hành
        let lecture = getData(data.find("td:nth-child(10)").text(), ma, lop, to);
        GM_setValue(ma + lop + to, undefined); //Reset lưu state
        GM_setValue("clicked_" + ma, false);
        GM_setValue(ma + "_" + lop + "_" + to, ten); //Nhớ tên môn học
        maMon.set(ma, ten);
        dataTenMon.set(ma, JSON.stringify(lecture));

    }
    console.log(maMon);

    alert("Đã cào xong mã môn học và tên môn học, vui lòng chọn môn học trong dropdown")
    //Thêm vào dropdown
    var dropdown = $(".dropdownlecture");
    dropdown.empty(); //xoá các dropdown cũ
    dropdown.append(`<option value="" class="label_dropdownlecture">Chọn môn</option>`);
    for (let [key, value] of maMon) {
        dropdown.append(`<option value="${key}">${key} - ${value}</option>`);
    }
    unsafeWindow.maMon = maMon;
    unsafeWindow.dataTenMon = dataTenMon;
}

//Xử lí chọn môn học trong dropdown
$(document).on("change", ".dropdownlecture", function (e) {
    let dropdown = $(this);
    let name = dropdown.val();
    let table = $(".table-sm");
    let findInputBox = table.find("thead > tr:nth-child(2) > td:nth-child(2) > input");
    findInputBox.val(name).change();
    findInputBox = document.querySelector(".table-sm > thead > tr:nth-child(2) > td:nth-child(2) > input");
    findInputBox.focus();
    const EVENT_OPTIONS = { bubbles: true, cancelable: false, composed: true };
    const EVENTS = {
        BLUR: new Event("blur", EVENT_OPTIONS),
        CHANGE: new Event("change", EVENT_OPTIONS),
        INPUT: new Event("input", EVENT_OPTIONS),
    };
    const tracker = findInputBox._valueTracker;
    tracker && tracker.setValue(name);
    findInputBox.dispatchEvent(EVENTS.INPUT);
    findInputBox.dispatchEvent(EVENTS.BLUR);

    addButton();
})

//Khi hover vào các cell
$(document).on("mouseover", ".cellqh", function (e) {
    let cell = $(this);
    let classList = cell.attr("class").split(/\s+/);
    //Show hover các tên môn học ở tooltip
    for (let i = 0; i < classList.length; i++) {
        if (classList[i] == "cellqh") continue;
        let tooltip = cell.find(".tooltiptext");
        let text = GM_getValue(classList[i]);
        if (text == undefined) text = classList[i];
        tooltip.text(tooltip.text() + " " + text);
    }


})


//Khi hover ra khỏi các cell
$(document).on("mouseout", ".cellqh", function (e) {
    let cell = $(this);
    let tooltip = cell.find(".tooltiptext");
    tooltip.text("");
})



//Xử lí nút bấm
function tkbLich() {
    var float = $(".float");
    if (float.hasClass("editTKB")) {
        //Tắt chế độ TKB
        removeEdit();

    } else {
        //Bật chế độ TKB
        addEdit();


    }
}


//Thay nút edit
function addEdit() {
    let elements = $(".clickable.ng-untouched.ng-pristine.ng-valid"); //get form
    if (elements.length == 0) {
        alert("Không tìm thấy môn học, vui lòng đợi trang load xong hoàn toàn dữ liệu");
        return;
    }
    var float = $(".float");
    float.addClass("editTKB"); //Hiện nút edit sẽ có màu khác
    console.log("Bật chế độ TKB");
    //Cào mã môn học và thêm nút

    //Thêm table
    if ($("#tkb_div").length == 0) {
        drawTable();
        $("#tkb_div").attr("style", "display: none !important")
    }

    addButton();
    caoMaMon();

}
function removeEdit() {
    console.log("Tắt chế độ TKB");
    var float = $(".float");
    float.removeClass("editTKB"); //Tắt nút edit
    $(".custom-control").attr("style", "display: block !important"); //Hiển thị lại các checkbox mặc định
    $(".editTKBcheckbox").remove(); //Xoá checkbox mới
    $("#tkb_div").attr("style", "display: none !important") //Ẩn TKB
}

//Thêm đống nút bấm custom
function addButton() {

    //$(".custom-control").attr("style", "display: none !important"); //Tắt các checkbox mặc định k click được
    $("#tkb_div").attr("style", "display: block !important") //Hiện TKB
    //select like element but select input checkbox only
    let elements = document.querySelectorAll(".clickable.ng-untouched.ng-pristine.ng-valid input[type='checkbox']");
    let check = 0;
    for (let i = 0; i < elements.length; i++) {
        if (!elements[i].disabled) {
            check = 1;
            break;
        }
    }
    if (check == 0) {
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].disabled) {
                let element = $(elements[i]);
                $(".custom-control").attr("style", "display: none !important"); //Tắt các checkbox mặc định k click được
                let name = element.closest("tr").find("td:nth-child(2)").text();
                element = $(elements[i]).closest("form");

                if (element.find(".editTKBcheckbox").length == 0) {
                    element.append('<input type="checkbox" class="editTKBcheckbox" name=' + name + '>') //Thêm checkbox mới
                }
            }
        }
    } else {
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i].disabled) {
                elements[i].classList.add("editTKBcheckbox");
            }
        }
    }

}


//Khi click vào checkbox, update lịch học (IMPORTANT)
$(document).on("click", ".editTKBcheckbox", function (e) {
    let checkbox = $(this);
    //Nhớ ô đã tick


    if ($("#datetimepicker").val() == "") {
        alert("Chưa chọn ngày bắt đầu tuần đầu tiên");
        if (checkbox.prop("checked") == true) checkbox.prop("checked", false); //Chỉnh checkbox về như cũ
        else checkbox.prop("checked", true);
        return;
    }

    let name = checkbox.closest("tr").find("td:nth-child(2)").text();
    let text = checkbox.closest("tr").find("td:nth-child(10)").text();
    let malop = checkbox.closest("tr").find("td:nth-child(7)").text();
    let to = checkbox.closest("tr").find("td:nth-child(5)").text(); //tổ thực hành

    GM_setValue(name + malop + to, checkbox.prop("checked")); //set ô này trạng thái
    if (checkbox.prop("checked")) GM_setValue("clicked_" + name, malop + to); //set ô này đã click là mã lớp này
    else if (checkbox.prop("checked") == false && GM_getValue("clicked_" + name) == malop + to) GM_setValue("clicked_" + name, false); //set ô này đã click xoá khỏi


    let result = getData(text, name, malop, to);



    updateTable(result, checkbox.prop("checked"));

});

function monDaDien() {
    if (!unsafeWindow.maMon) return;
    let danhsachmonhoc = $(".danhsachmonhoc")
    danhsachmonhoc.empty(); //xoá hết các div môn đang có

    for (let [key, value] of unsafeWindow.dataTenMon) {
        if (GM_getValue("clicked_" + key) != undefined && GM_getValue("clicked_" + key) != false) {
            //get back data from string json
            console.log("Đã đăng ký môn " + key + " " + GM_getValue("clicked_" + key))
            value = JSON.parse(value);
            let lec = new Lecture(value[0]["name"], value[0]["day"], value[0]["time"], value[0]["room"], value[0]["teacher"], value[0]["date"], value[0]["malop"], value[0]["to"]);
            danhsachmonhoc.append(`<div class="monhoc">${lec.name} - ${unsafeWindow.maMon.get(lec.name)} - ${lec.teacher}</div>`)
        }
    }

} setInterval(monDaDien, 200)

//Cập nhật box liên tục
function keepUpdateCheckBox() {
    if (!unsafeWindow.maMon) return;
    let checkboxs = $(".editTKBcheckbox");
    for (let i = 0; i < checkboxs.length; i++) {
        let checkbox = $(checkboxs[i]);
        let name = checkbox.closest("tr").find("td:nth-child(2)").text();
        let text = checkbox.closest("tr").find("td:nth-child(10)").text();
        let malop = checkbox.closest("tr").find("td:nth-child(7)").text();
        let to = checkbox.closest("tr").find("td:nth-child(5)").text(); //tổ thực hành

        //nếu đã click ô khác
        if (GM_getValue("clicked_" + name) != malop + to) {
            GM_setValue(name + malop + to, false);
        }

        let result = GM_getValue(name + malop + to);
        if (result == undefined) continue;
        if (checkbox.prop("checked") != result) {

            //update lại trạng thái nút theo lưu state
            checkbox.prop("checked", result);
            //Update lại table
            result = getData(text, name, malop, to);
            console.log("Cập nhật lại bảng cho môn tự động " + name)
            updateTable(result, checkbox.prop("checked"));

        }
    }
} setInterval(keepUpdateCheckBox, 200);


class Lecture {
    constructor(name, day, time, room, teacher, date, malop, to) {
        this.name = name;
        this.day = day;
        this.time = time;
        this.room = room;
        this.teacher = teacher;
        this.date = date;
        this.malop = malop;
        this.to = to;
    }

}


function getData(inputString, name, malop, to) {
    const result = [];
    let count = 0, lastplace = 0;
    let day = "none", time = "none", room = "none", teacher = "none", date = "none";
    inputString = inputString.replaceAll("Chủ nhật", "Thứ 8")
    let dataSplit = inputString.split("Thứ");
    for (let i = 1; i < dataSplit.length; i++) {
        let temp = dataSplit[i].split(",");
        day = "Thứ" + temp[0];
        time = temp[1];
        room = temp[2];
        teacher = temp[3];
        date = temp[temp.length - 1];
        result.push(new Lecture(name, day, time, room, teacher, date, malop, to));
    }
    return result;
}

function drawTable() {
    let rows = 14; //14 tiết
    let cols = 80;
    let tables = []
    let tkb_div = $('<div id="tkb_div" class="row d-flex justify-content-center pt-1"></div>')
    tkb_div.append('<h4 style="text-align:center;">Made by quochung.cyou from ProPTIT with <3.</h1>')
    tkb_div.append('<h5 style="text-align:center;">Cách sử dụng: Bật chế độ TKB, chọn ngày bắt đầu tuần đầu tiên, click vào checkbox để thêm/xoá môn học</h2>')
    tkb_div.append('<h5 style="text-align:center;">Lưu ý: Chỉnh sửa TKB sẽ bị mất khi tải lại trang</h2>')
    tkb_div.append('<h5 style="text-align:center;">Lưu ý: Ngày đầu tiên của tuần có thể xem ở tkb theo tuần</h2>')
    tkb_div.append('<h5 style="text-align:center;">Các lỗi vui lòng báo về nguyenquochung.workvn@gmail.com</h2>')
    tkb_div.append('<h5 style="text-align:center;">Chúc bạn học tập tốt!</h2>')
    tkb_div.append('<h5 style="text-align:center;">Lưu ý: Tool không sử dụng trong thời gian đăng ký, chỉ để xếp lịch trước</h2>')

    for (let i = 1; i <= 2; i++) {
        let count = 0;
        let table_id = "tkbPreview" + i;
        tables[i] = $('<table style="z-index:-100;table-layout:fixed;text-align:center;border-collapse: collapse;" class="tkb_preview_table" id=' + table_id + '><thead> <th></th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>|</th> </thead><tbody>');
        let tkb_separator, start_time_in_hr;
        for (let r = 0; r < rows; r++) {
            if (r % 2) tkb_separator = 'border-bottom:2px solid #ad171c;'
            else tkb_separator = '';
            start_time_in_hr = r + 7;
            //Thêm hàng, thời gian bắt đầu tiết
            let tr = $('<tr style="height:1px;' + tkb_separator + '"><td class="starttimerow">' + start_time_in_hr + '</td>');
            for (let c = 0; c < cols; c++) {
                if ((c + 1) % 8) {
                    count++;
                    $('<td class="cellqh" id="' + (70 * (i - 1) * 14 + count + specialValue) + '">' + "+" + '<span class="tooltiptext"></span></td>').appendTo(tr);
                } else {
                    //divider
                    $('<td style="height:0px; width: 15px; background-color: #fff"></td>').appendTo(tr);
                }
            }
            tr.appendTo(tables[i]);
        }


        $('</tbody></table>').appendTo(tables[i]);
        tkb_div.append(tables[i])

    }
    tkb_div.append('<div class="chonngaydiv"><label for="datetimepicker">Chọn ngày bắt đầu tuần đầu tiên (Xem trong TKB tuần)    </label><input class="inputdate" id="datetimepicker" type="date" value="2023-08-14"></input><br></div>');
    tkb_div.append('<select class="dropdownlecture"><option value="" class="label_dropdownlecture">Chọn môn</option></select>')
    tkb_div.append('<div class="danhsachmonhoc_text"><strong>Các môn đã đăng ký<strong></div>')
    tkb_div.append('<div class="danhsachmonhoc"></div>')

    //Thêm vào trang
    $("div.card-body.p-0 div.row.d-flex.justify-content-center.text-nowrap.pt-1").prepend(tkb_div)
    console.log("Đã thêm bảng TKB")

}

document.addEventListener('click', function (e) {
    e = e || window.event;
    var target = e.target || e.srcElement,
        text = target.textContent || target.innerText;
    console.log(text + " " + target.className + " - " + target)

}, false);

function updateTable(lecturelist, state) {

    console.log("Cập nhật bảng cho môn " + lecturelist[0].name + " " + state)

    let start_date = new Date($("#datetimepicker").val());
    start_date.setHours(0, 0, 0, 0);
    for (let i = 0; i < lecturelist.length; i++) {
        //console.log("Cập nhật bảng cho môn " + lecturelist[i].name + " " + lecturelist[i].day + " " + lecturelist[i].time + " " + lecturelist[i].room + " " + lecturelist[i].teacher + " " + lecturelist[i].date)
        let time = lecturelist[i].date;
        let start_time, end_time, start_time_date, end_time_date;
        if (time[9] == 'đ') {
            start_time = time.substring(0, 9);
            end_time = time.substring(13, 21);
            start_time_date = new Date("20" + start_time.substring(6, 10), start_time.substring(3, 5) - 1, start_time.substring(0, 2));
            end_time_date = new Date("20" + end_time.substring(6, 10), end_time.substring(3, 5) - 1, end_time.substring(0, 2));
        } else {

            start_time = time.substring(0, 9);
            start_time_date = new Date("20" + start_time.substring(6, 10), start_time.substring(3, 5) - 1, start_time.substring(0, 2));
            end_time_date = new Date("20" + start_time.substring(6, 10), start_time.substring(3, 5) - 1, start_time.substring(0, 2));
        }
        let loop = start_time_date;
        //Thứ 8 = 8
        let ngayTrongTuan = lecturelist[i].day[4];

        if (ngayTrongTuan == 8) ngayTrongTuan = 0;
        else ngayTrongTuan = ngayTrongTuan - 1;
        //console.log("----------- " + start_time_date + " " + end_time_date + " " + time[9])


        //đi qua chuỗi ngày để update vào lịch
        while (loop <= end_time_date) {
            //console.log("loop " + loop + " " + end_time_date)
            if (loop.getDay() == ngayTrongTuan) {
                const diffTime = Math.abs(loop - start_date);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const hour = extractHoursFromString(lecturelist[i].time);
                for (let j = hour[0]; j <= hour[1]; j++) {
                    let vitri = 1 + 14 * 70 * (parseInt(diffDays / 70)) + (j - 7) * 70 + (diffDays - 70 * (parseInt(diffDays / 70)));
                    //console.log("Điền vào vị trí " + vitri + " cho môn " + lecturelist[i].name + " gio " + j + " thudung " + ngayTrongTuan + " chenhlech " + diffDays + " thuloop " + loop.getDay() + " thucheck " + lecturelist[i].day + " cur " + loop + " start " + start_date + " " + diffTime)
                    if (state) dienLich(vitri, lecturelist[i].name, lecturelist[i].malop, lecturelist[i].to)
                    else xoaLich(vitri, lecturelist[i].name, lecturelist[i].malop, lecturelist[i].to)
                }
            }
            loop.setDate(loop.getDate() + 1);
        }
    }
}

//lấy giờ kíp từ chuỗi
function extractHoursFromString(str) {
    const regex = /từ\s*(\d{1,2}):(\d{2})\s*đến\s*(\d{1,2}):(\d{2})/;
    const match = str.match(regex);

    if (!match) {
        return null;
    }

    const startHour = parseInt(match[1]);
    const endHour = parseInt(match[3]);

    if (startHour > endHour) {
        return null;
    }

    return [startHour, endHour];
}

//Điền vào lịch
function dienLich(vitri, name, malop, to) {
    vitri += specialValue;
    var element = document.getElementById(vitri);
    element.classList.add(name + "_" + malop + "_" + to);
    var ele = $("#" + vitri);
    if (element.classList.length == 2) {
        ele.attr("style", "border:solid green 1px;height:1px;background-color: #32a852"); //green
        ele.get(0).lastChild.nodeValue = "v"

    } else if (element.classList.length > 2) {
        ele.attr("style", "border:solid green 1px;height:1px;background-color: #ff0000"); //red
        ele.get(0).lastChild.nodeValue = "x"
    } else {
        ele.attr("style", "border:solid green 1px;height:1px;background-color: #fff"); //white
        ele.get(0).lastChild.nodeValue = "+"
    }
}

//Xoá khỏi lịch
function xoaLich(vitri, name, malop, to) {
    vitri += specialValue;
    var element = document.getElementById(vitri);
    element.classList.remove(name + "_" + malop + "_" + to);
    var ele = $("#" + vitri);
    if (element.classList.length == 2) {
        ele.attr("style", "border:solid green 1px;height:1px;background-color: #32a852"); //green
        ele.get(0).lastChild.nodeValue = "v"

    } else if (element.classList.length > 2) {
        ele.attr("style", "border:solid green 1px;height:1px;background-color: #ff0000"); //red
        ele.get(0).lastChild.nodeValue = "x"
    } else {
        ele.attr("style", "border:solid green 1px;height:1px;background-color: #fff"); //white
        ele.get(0).lastChild.nodeValue = "+"
    }
}


