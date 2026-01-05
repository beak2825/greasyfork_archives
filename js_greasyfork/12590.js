// ==UserScript==
// @name         莞工体育选课助手
// @namespace    http://your.homepage/
// @version      1.0
// @description  助你快速选课
// @author       mountainguan
// @match        http://tyxk.dgut.edu.cn/index.php?m=Home&c=Student&a=index
// @match        http://tyxk.dgut.edu.cn/index.php?m=&c=Student&a=index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12590/%E8%8E%9E%E5%B7%A5%E4%BD%93%E8%82%B2%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/12590/%E8%8E%9E%E5%B7%A5%E4%BD%93%E8%82%B2%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//============插入窗口============
document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + "<div style='top:0px;position:fixed;width:220px;right:0;top:30px'><div class='panel panel-info'><div class='panel-heading'><h6 class='panel-title text-center text-danger'>体育选课助手</h6></div><div class='panel-body'><div class='well'><form role='form' class='text-center'><div class='form-group'><label class='control-label' for='tyxkId'>课程编号</label><input class='form-control input-sm' id='tyxkId' type='text'></div><input type='button' class='btn btn-default btn-xs' id='select' value='选课'>         <input type='button' class='btn btn-default btn-xs' id='retreat' value='退选'></form></div><span class='badge' style='float:right'>Version 1.0</span></div></div></div>";
//=============功能===============
document.getElementById("select").onclick = function() {
    var TYcourseID = document.getElementById('tyxkId').value;
    selectCourseDoing(TYcourseID,'sel');
}
document.getElementById("retreat").onclick = function() {
    var TYcourseID = document.getElementById('tyxkId').value;
    selectCourseDoing(TYcourseID,'quit');
}