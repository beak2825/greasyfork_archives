// ==UserScript==
// @name         AutoCheck đánh giá giảng viên ở mức "Không hài lòng" - VNUA
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tự đánh giá giảng viên ở mức "Không hài lòng"
// @author       Nguyễn Trung Hiếu - K58TYG
// @match        http://daotao.vnua.edu.vn/Default.aspx?page=danhgiagiangday
// @match        http://220.231.107.130/Default.aspx?page=danhgiagiangday
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/30996/AutoCheck%20%C4%91%C3%A1nh%20gi%C3%A1%20gi%E1%BA%A3ng%20vi%C3%AAn%20%E1%BB%9F%20m%E1%BB%A9c%20%22Kh%C3%B4ng%20h%C3%A0i%20l%C3%B2ng%22%20-%20VNUA.user.js
// @updateURL https://update.greasyfork.org/scripts/30996/AutoCheck%20%C4%91%C3%A1nh%20gi%C3%A1%20gi%E1%BA%A3ng%20vi%C3%AAn%20%E1%BB%9F%20m%E1%BB%A9c%20%22Kh%C3%B4ng%20h%C3%A0i%20l%C3%B2ng%22%20-%20VNUA.meta.js
// ==/UserScript==

var allElems = document.getElementsByTagName('input');
var value;
for (i = 0; i < allElems.length; i++) {
    if (allElems[i].type == 'radio' && allElems[i].value == 'Không hài lòng') {
        if (allElems[i].checked) {
            value = allElems[i].value;
        }else{
            allElems[i].click();
        }
    }
}