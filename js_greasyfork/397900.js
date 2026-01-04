// ==UserScript==
// @name         ThuPhiSTCHelperScript
// @namespace    http://tampermonkey.net/
// @version      0.980
// @description  try to take over the world!
// @author       Minh Pham Duc
// @match        http://thuphi.haiphong.gov.vn:8221/*
// @match        http://10.10.10.20:8221/*
// @match        http://113.160.97.58/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397900/ThuPhiSTCHelperScript.user.js
// @updateURL https://update.greasyfork.org/scripts/397900/ThuPhiSTCHelperScript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.warn('Thu phí Helper is running!')
    //Styling
    var style = document.createElement('style');
    style.innerHTML = `
select[name="MA_LOAI_THANH_TOAN"] {
font-weight: bold !important;
color: red !important;
}

input[name="SO_TK_HQ"] {
font-weight: bold !important;
color: red !important;
}

.SHOW_TIEN_TEXT {
font-weight: bold !important;
color: red !important;
border: 1px solid #eee;
border-radius: 5px;
padding: 5px;
background: #dedede
}

[class^="TR_"] :nth-child(5) {
font-weight: bold;
color: red;
text-align: center;
}

[class^="TR_"] {
font-weight: normal;
}

#TBLDANHSACH .bold :nth-child(3) {
font-weight: bold;
color: red;
text-align: center;
}

#TBLDANHSACH .bold :nth-child(1) {
font-weight: bold;
color: blue;
text-align: center;
}
`;
    document.head.appendChild(style);
    try {

        console.log(`Name is ` + document.getElementsByClassName("form-control input-sm")[2].value)
        console.log(`Payment is ` + document.getElementsByClassName("form-control input-sm")[13].value)
        //console.log(`Set default payment to TM`)
        //document.getElementsByClassName("form-control input-sm")[13].value = "TM"

        //Check if ten nguoi nop phi is empty then auto add name
        const name = document.getElementsByClassName("form-control input-sm")[2].value
        if (name == "") {
            document.getElementsByClassName("form-control input-sm")[2].value = "không có tên"
        }

        const user = document.getElementsByClassName('item-search form-control-sm bold')[0].value
        console.log(`Name is: `+ user)
        if (user == "stc.nguyenthingoclanh") {
            document.getElementsByClassName('item-search form-control-sm bold')[0].value = ""
        }



    } catch (error) {
     //   console.log(`No name yet`)
        try {
            const user = document.getElementsByClassName('item-search form-control-sm bold')[0].value
            console.log(`Name is: `+ user + ` cleared`)
            if (user == "stc.nguyenthingoclanh") {
                document.getElementsByClassName('item-search form-control-sm bold')[0].value = ""
            }

        } catch (error) {
            console.log(`No name yet 22`)
        }


    }
    //Shorcut keys for Tao Bien Lai handler
    function tao_bien_lai(e) {
        //Check if shorcut is pressed
        try {
            if (e.ctrlKey && e.keyCode == 219 || e.keyCode == 219) {
                //Click the element Ctrl + [
                console.log('Tạo biên lai clicked')
                document.getElementsByClassName("btn btn-primary btn-primary")[2].click()
            }

            //Ctrl + =
//            if (e.ctrlKey && e.keyCode == 187 || e.keyCode == 187) {
//               console.log(document.getElementsByClassName("form-control input-sm")[13].value)
//                document.getElementsByClassName("form-control input-sm")[13].value = "CK"
//                console.log(document.getElementsByClassName("form-control input-sm")[13].value)
//                console.log('Lưu lại clicked')
//                document.getElementsByClassName("btn btn-primary mr10px btn-padding")[0].click()
//            }

            //Ctrl + ]
            if (e.ctrlKey && e.keyCode == 221 || e.keyCode == 221) {
                if (document.getElementsByClassName("form-control input-sm")[13].value == "CK") {
                    alert(`Hình thức thanh toán là Chuyển khoản a a a á!`)
                }
                console.log('Lưu lại clicked')
                document.getElementsByClassName("btn btn-primary mr10px btn-padding")[0].click()
            }

            //Ctrl + \
            if (e.ctrlKey && e.keyCode == 220 || e.keyCode == 220) {
                console.log('Phát hành clicked')
                document.getElementsByClassName("btn btn-success mr10px btn-padding btn-issued-invoice pull-left")[0].click()
            }

            //Home
            if (e.keyCode == 36) {
                const currentURL = window.location.href
                if (currentURL.includes("10.10.10.20")) {
                    window.location.href = "http://10.10.10.20:8221/tim-kiem-to-khai-nop-phi"
                } else {
                    window.location.href = "http://thuphi.haiphong.gov.vn:8221/tim-kiem-to-khai-nop-phi"
                }
            }
        } catch (error) {
            console.log('Có lỗi xảy ra: ' + error.message)
        }
    }
    // register the handler
    document.addEventListener('keyup', tao_bien_lai, false);
})();