// ==UserScript==
// @name         itsNeverTooLate
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  upload assignments after due date :p
// @author       Aakash Khatu
// @match        https://www.icloudemserp.com/corecampus/student/assignments/viewassignments_personal.php*
// @match        https://www.icloudemserp.com/corecampus/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381846/itsNeverTooLate.user.js
// @updateURL https://update.greasyfork.org/scripts/381846/itsNeverTooLate.meta.js
// ==/UserScript==

var ftable;

function allowUpload(){
    ftable.innerHTML = '<tbody><tr>'+
'      <td width="100%" colspan="2" align="center" bgcolor="#ececfb"><b><font size="4" color="#3b5998">Upload Your Assignment</font></b></td>'+
'    </tr>'+
'		 '+
'	 <tr>'+
'      <td width="25%" bgcolor="#ECECFB"><b>Attach File</b> </td>'+
'      <td width="55%" bgcolor="#ECECFB"><input type="file" id="stud_assign" name="stud_assign" required="">'+
'	  No File	  </td>'+
'    </tr>'+
'	'+
'	<tr>'+
'	<input type="hidden" id="up_file" name="up_file" value="">'+
'	<input type="hidden" id="approve_file" name="approve_file" value="">'+
'      <td width="100%" bgcolor="#ECECFB" align="center" colspan="2">'+
'	  <input type="submit" class="btn_img" value="Upload"> '+
'	  </td>'+
'      '+
'    </tr>'+
'	  </tbody>';
}

(function() {
    'use strict';
    if (window.location.href == "https://www.icloudemserp.com/corecampus/index.php"){
    }
    else{
    var frm = document.getElementsByTagName('form')[1];
    ftable = frm.getElementsByTagName('table')[0];
    if (ftable.rows.length==2){
        var btn = document.createElement('BUTTON');
        btn.type = 'button';
        btn.classList.add("btn_img");
        btn.innerHTML = ' Allow Upload ';
        btn.addEventListener('click', allowUpload);
        var r = ftable.insertRow(-1);
        var e = r.insertCell(-1);
        e.align = "center";
        e.appendChild(btn);
    }else{
        console.log("Assignment Upload Already Allowed");
    }}
})();
