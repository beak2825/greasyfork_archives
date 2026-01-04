// ==UserScript==
// @name        DKTC_ACTVN
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      KMA
// @description 12/29/2020, 12:23:05 PM
// @downloadURL https://update.greasyfork.org/scripts/419327/DKTC_ACTVN.user.js
// @updateURL https://update.greasyfork.org/scripts/419327/DKTC_ACTVN.meta.js
// ==/UserScript==
var listLopDangKy = ["Cấu trúc dữ liệu và giải thuật-1-20 (A15C302)",
                      "Cơ sở lý thuyết truyền tin-1-20 (A15C3D202)",
                      "Lập trình hướng đối tượng-1-20 (A15C3D202)", 
                      "Lập trình hướng đối tượng-1-20 (A15C3D202.3)",
                      "Giáo dục thể chất 5-1-20 (A15C3D208-Cầu lông)",
                      "Hệ quản trị cơ sở dữ liệu-1-20 (A15C302)",
                      "Hệ quản trị cơ sở dữ liệu-1-20 (A15C302.1)",
                      "Kỹ thuật vi xử lý-1-20 (A15C301)",
                      "Kỹ thuật vi xử lý-1-20 (A15C301.2)",
                      "Công nghệ phần mềm-1-20 (C304)",
                      "Lý thuyết độ phức tạp tính toán-1-20 (C302)",
                      "Phát triển phần mềm ứng dụng-1-20 (C304)",
                      "Phát triển phần mềm ứng dụng-1-20 (C304.1)"];
console.log("%cScript đăng ký tín chỉ by Hiếu ", "font-size:30px ; color:red; font-weight: bold");
document.getElementById("drpCourse").addEventListener("change", HienThiLop);
var found = null;

$(window).load(function () {
console.log("load");

var monHienTai = document.querySelector("#drpCourse");

if (monHienTai.value == "") {
	console.log("Bạn chưa chọn môn");
} else {


		var step1 = document.querySelectorAll(".cssRangeItem2,.cssRangeItem1"); // quét môn
		if (step1[0].childNodes[2].childNodes[1].disabled == true) {
			console.log("Chọn môn bị ẩn");
      console.log("Môn này đã đăng kí");
		  NextMon(monHienTai);
		} else {
			step1.forEach(ChonMon);
      
      if(found==true )// môn này bỏ qua
        {
      $("input#btnUpdate").click();    
        }
      else
        {
            console.log("Môn này không có trong list cần đkí");
        		NextMon(monHienTai);

        }
			
		}
	
}

});

function NextMon(monHienTai)
{
  			var index = monHienTai.selectedIndex;
			var length = monHienTai.length;
			if (index < length - 1 && monHienTai[index + 1] != undefined && monHienTai[index + 1] != null) {
				console.log("sang môn tiếp theo ... ");
				monHienTai.value = monHienTai[index + 1].value;
				HienThiLop();
			} else {
        
				console.log("%cĐã đăng ký xong môn của khóa " + document.getElementById("drpAcademicYear").innerText, "font-size:20px ; color:red;");
    
        nganhHienTai = document.querySelector("#drpAcademicYear");
        if (nganhHienTai.selectedIndex < nganhHienTai.length - 1 && nganhHienTai[nganhHienTai.selectedIndex + 1] != undefined) {
				console.log("sang ngành tiếp theo ... ");
				nganhHienTai.value = nganhHienTai[nganhHienTai.selectedIndex  + 1].value;
				setTimeout('__doPostBack(\'drpAcademicYear\',\'\')', 0);
	  		}
			}
}
function HienThiLop() {
	$("input#btnViewCourseClass").click();
}

function ChonMon(object) {

	var o = object.childNodes[3];
	var tenMonHoc = o.innerText;
	for (i = 0; i < listLopDangKy.length; i++) {
		if (tenMonHoc === listLopDangKy[i]) {
			var tmp = object.childNodes[2].childNodes[1];
			SelectCourse(tmp);

      found = true;
			console.log("Đã chọn lớp " + tenMonHoc);
		}
	}


}
