

    // ==UserScript==
    // @name     vnedu
    // @version  1.03
    // @include     https://*.vnedu.vn/*
    // @grant    none
    // @description  Script tự động điền nhận xét cho VNEdu
    // @author    riverstore (Nguyen Nhut Truong)
    // @homepageURL  https://github.com/riverstore/vnedu-auto
    // @namespace https://greasyfork.org/users/728004
// @downloadURL https://update.greasyfork.org/scripts/420280/vnedu.user.js
// @updateURL https://update.greasyfork.org/scripts/420280/vnedu.meta.js
    // ==/UserScript==

    //var btnUnikey = document.getElementById('btnUnikey');
    var btnUnikey = document.getElementsByTagName('body')[0];

    var divNhanxet = document.createElement('div');
    divNhanxet.setAttribute('class', 'x-btn x-box-item x-toolbar-item x-btn-default-toolbar-small x-icon x-btn-icon x-btn-default-toolbar-small-icon');
    divNhanxet.setAttribute('style', 'z-index:999999;background:black;');


    var btnNhanxet = document.createElement('button');
    btnNhanxet.setAttribute('type', 'button');
    btnNhanxet.setAttribute('class', 'x-btn-icon');
    btnNhanxet.setAttribute('style', 'color:white;');

    btnNhanxet.value = 'NX';
    btnNhanxet.innerText = "NX";
    btnNhanxet.addEventListener('click', function () {
            var IsFoundSodiemTable = false;

            var tables = document.getElementsByTagName('table');
            var SLTable = tables.length;
    		console.log("sl table=" + SLTable);
            // Duyệt qua từng bảng để tìm bảng nhập nhận xét
            for (var i = 0; i < SLTable; i++) {
              var trArr = tables[i].getElementsByTagName('tr');

              if(trArr.length>=3){//Bảng có từ 3 dòng trở lên
                var tdArr = trArr[0].getElementsByTagName('td'); // Dòng đầu tiên
    			//console.log(tdArr.length);
                //console.log(tdArr[8].innerText);
                // Nếu bảng có 10 ô mới xét
                if(tdArr.length==10){
                  // Tìm thấy cột nhận xét
                  if(tdArr[8].innerText =="Nhận xét"){
                    IsFoundSodiemTable = true;

                    //alert("Found");

                  }else{
                  	console.log(tdArr[8].innerText);
                  }

                } // if(tdArr.length==10)

              }// if(trArr.length>=3)


              // Nếu tìm thấy
              if(IsFoundSodiemTable){
              	for (var j = 2; j < trArr.length; j++){ // Duyệt qua từng dòng
                  tdArr = trArr[j].getElementsByTagName('td');

                    // Tìm input nhập điểm
                    var txtDiemArr = tdArr[12].getElementsByTagName('input');

                    // Nếu tìm thấy
                    if (typeof(txtDiemArr) != 'undefined' || txtDiemArr != null || txtDiemArr.length > 0){
                        var diemStr = tdArr[11].innerText;
                        console.log(diemStr);
                        if(diemStr != "" && !isNaN(diemStr)){
                            var diemNumber = parseFloat(diemStr);
                            var txtDiem = txtDiemArr[0];
                            txtDiem.value = Mark2Remark(diemNumber);

                            //console.log(diemNumber + "-->" + Mark2Remark(diemNumber));
    			   		}
                    }else{
                        console.log("Không tìm thấy thẻ input");
                    }



                } // for (var j = 2; j < trArr.length; j++)

              } // if(IsFoundSodiemTable)


            } // for (var i = 0; i < SLTable; i++)

            if(!IsFoundSodiemTable){
              alert("Không tìm thấy cửa sổ để nhập nhận xét");
            }

            //alert("hi");
            //Console.log(encodeURI('https://www.cgpeers.com/' + x3[1].getAttribute('href')));
          }, false);


    divNhanxet.appendChild(btnNhanxet);
    btnUnikey.appendChild(divNhanxet);

    //insertAfter(btnUnikey, divNhanxet);

    function Mark2Remark(diem){

    	if(diem<3.5){
      	return "Chưa đạt yêu cầu của bộ môn, chưa tự giác trong học tập, cần nỗ lực học tập hơn nữa.";
      }else if(diem < 5){
      	return "Chưa hoàn thành các yêu cầu cần đạt của bộ môn, cần cố gắng học tập hơn nữa.";
      }else if(diem < 6){
      	return "Hoàn thành được các yêu cầu của bộ môn, cần chủ động hơn trong học tập.";
      }else if(diem < 7){
      	return "Tiếp thu được các kiến thức cơ bản của môn học, tương đối chủ động trong học tập.";
      }else if(diem < 7.5){
      	return "Đáp ứng tốt yêu cầu cần đạt của bộ môn, có sự tự giác và tiến bộ trong học tập.";
      }else if(diem < 8){
      	return "Đáp ứng tốt yêu cầu cần đạt của bộ môn, có sự tự giác và tiến bộ trong học tập.";
      }else if(diem < 9){
      	return "Nắm vững kiến thức của bộ môn. Có tính tự giác trong học tập và rèn luyện cao.";
      }else{
      	return "Hoàn thành rất tốt nội dung kiến thức môn học, làm được nhiều bài tập khó, chăm chỉ, đam mê học tập đối với bộ môn.";
      }

    }

    function insertAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

