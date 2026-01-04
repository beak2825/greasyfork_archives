// ==UserScript==
// @name         IbaDreCam
// @namespace    https://twitter.com/ins_syu
// @version      1.0
// @author       You
// @match        https://idc.ibaraki.ac.jp/portal/StudentApp/LectureDoc/SubjectList.aspx
// @grant        none
// @description:ja 前期回避
// @description 前期回避
// @downloadURL https://update.greasyfork.org/scripts/373213/IbaDreCam.user.js
// @updateURL https://update.greasyfork.org/scripts/373213/IbaDreCam.meta.js
// ==/UserScript==

(
function __doPostBack(eventTarget, eventArgument) {
        if (!theForm.onsubmit || (theForm.onsubmit() != false)) {
            theForm.__EVENTTARGET.value = eventTarget;
            theForm.__EVENTARGUMENT.value = eventArgument;
            theForm.submit();
        }
    }
,function() {
    'use strict';
    var theForm = document.forms['aspnetForm'];

    var listselect = '<option selected="selected" value="2018$2">2018年度後期</option><option value="2018$1">2018年度前期</option><option value="2017$2">2017年度後期</option><option value="2017$1">2017年度前期</option>';
    if(document.getElementById('ctl00_phContents_ucOpenDocSubjectList_ddlYearTerm_ddl_ddl').selectedIndex != 0){
        document.getElementById('ctl00_phContents_ucOpenDocSubjectList_ddlYearTerm_ddl_ddl').innerHTML = listselect;
        setTimeout('__doPostBack(\'ctl00$phContents$ucOpenDocSubjectList$ddlYearTerm$ddl$ddl\',\'\')', 0)
    }
})();