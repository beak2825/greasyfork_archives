// ==UserScript==
// @name         学习通学情统计一键导出(已和谐)
// @namespace    https://xxb.xagu.top
// @version      0.3
// @description  一键导出学习通学情到邮箱。支持学生综合完成情况、任务点完成情况、视频观看详情、讨论详情、章节学习次数、成绩详情、章节测验统计、作业统计、考试统计、线下成绩统计、课程综合统计。
// @author       XAGU
// @match        *://*.chaoxing.com/mycourse/studentcourse*
// @connect      chaoxing.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/403547/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AD%A6%E6%83%85%E7%BB%9F%E8%AE%A1%E4%B8%80%E9%94%AE%E5%AF%BC%E5%87%BA%28%E5%B7%B2%E5%92%8C%E8%B0%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/403547/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%AD%A6%E6%83%85%E7%BB%9F%E8%AE%A1%E4%B8%80%E9%94%AE%E5%AF%BC%E5%87%BA%28%E5%B7%B2%E5%92%8C%E8%B0%90%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    loadStyle("https://qidian.gtimg.com/lulu/pure/css/common/ui.css");
    var doc = unsafeWindow;
    var $ = doc.$;
    var courseId = doc.courseId || location.search.match(/courseId=(\d+)/i)[1] || 0;

    if(courseId === 0){
        alert("学情统计初始化失败！");
        return;
    }

    var css = '#choiceWindow {\n' +
    '            position: absolute; \n' +
    '            top: 15%; \n' +
    '            left: 79%; \n' +
    '            width: 18%; \n' +
    '            height: 55%; \n' +
    '            padding: 20px; \n' +
    '            border: 1px solid #ccc; \n' +
    '            background-color: white;\n' +
    '            z-index:2; \n' +
    '            overflow: auto; \n' +
    '        }';

    GM_addStyle(css);

    var html = '<form action="#" id="choiceWindow" enctype="application/x-www-form-urlencoded" method="get">\n' +
    '\t\t<p style="color:red"><B>警告：不要尝试导出学生人数过多的课程，超星系统会长时间阻塞在该课程，导致所有人都无法导出！</B></p><br>\n' +
    '\t<input type="hidden" name="selCourse" value="'+courseId+'">\n' +
    '\t<table>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td>发送邮件至：</td>\n' +
    '\t\t\t<td ><input type="email" id="email" class="ui-input" size="30" name="email" required><br></td>\n' +
    '\t\t</tr>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td>导出项：</td>\n' +
    '\t\t\t<td>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox1" name="seltables" value="1" checked>\n' +
    '\t\t\t\t<label for="checkbox1" class="ui-checkbox"></label><label for="checkbox1">学生综合完成情况</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox2" name="seltables" value="2" checked>\n' +
    '\t\t\t\t<label for="checkbox2" class="ui-checkbox"></label><label for="checkbox2">任务点完成情况</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox3" name="seltables" value="3" checked>\n' +
    '\t\t\t\t<label for="checkbox3" class="ui-checkbox"></label><label for="checkbox3">视频观看详情</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox4" name="seltables" value="4" checked>\n' +
    '\t\t\t\t<label for="checkbox4" class="ui-checkbox"></label><label for="checkbox4">讨论详情</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox5" name="seltables" value="5" checked>\n' +
    '\t\t\t\t<label for="checkbox5" class="ui-checkbox"></label><label for="checkbox5">章节学习次数</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox6" name="seltables" value="6" checked>\n' +
    '\t\t\t\t<label for="checkbox6" class="ui-checkbox"></label><label for="checkbox6">成绩详情</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox7" name="seltables" value="7" checked>\n' +
    '\t\t\t\t<label for="checkbox7" class="ui-checkbox"></label><label for="checkbox7">作业统计</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox8" name="seltables" value="8" checked>\n' +
    '\t\t\t\t<label for="checkbox8" class="ui-checkbox"></label><label for="checkbox8">考试统计</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox9" name="seltables" value="9" checked>\n' +
    '\t\t\t\t<label for="checkbox9" class="ui-checkbox"></label><label for="checkbox9">章节测验统计</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox10" name="seltables" value="10" checked>\n' +
    '\t\t\t\t<label for="checkbox10" class="ui-checkbox"></label><label for="checkbox10">线下成绩统计</label><br>\n' +
    '\t\t\t\t<input type="checkbox" id="checkbox11" name="seltables" value="11" checked>\n' +
    '\t\t\t\t<label for="checkbox11" class="ui-checkbox"></label><label for="checkbox11">课程综合统计</label><br>\n' +
    '\t\t\t</td>\n' +
    '\t\t</tr>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td>备注：</td>\n' +
    '\t\t\t<td>\n' +
    '\t\t\t\t<div class="ui-textarea-x" style="max-width:500px;">\n' +
    '\t\t\t\t\t<textarea id="description" type="text" name="description" maxlength="140" rows="5">可留空</textarea>\n' +
    '\t\t\t\t\t<div class="ui-textarea"></div>\n' +
    '\t\t\t\t</div>\n' +
    '\t\t\t</td>\n' +
    '\t\t</tr>\n' +
    '\t\t<tr>\n' +
    '\t\t\t<td colspan=\'2\'>\n' +
    '\t\t\t\t<button id=\'submit\' style="display:block;margin:0 auto" type="button" class="ui-button" data-type="primary">导出学情</button>\n' +
    '\t\t\t</td>\n' +
    '\t\t</tr>\n' +
    '\t</table>\n' +
    '</form>';

    $(html).prependTo('body').on('click','#submit' ,function() {
        var email = $('#email').attr('value');
        var description = $('#description').attr('value');
        var seltables = [];
        $("input[type='checkbox']:checked").each(function (index, item) {//
            seltables.push($(this).val());
        });
        GM_xmlhttpRequest({
            url: 'https://fystat-ans.chaoxing.com/api/export-back-task?selCourse=' + courseId + '&email=' + email + '&description=' + description + '&seltables=' + (seltables.join(',')),
            synchronous: true,
            method: 'post',
            onload: function(result){
                var obj = $.parseJSON(result.responseText);
                console.log(obj);
                if(obj.status){
                    if(obj.code==='TASK_EXIST'){
                        alert('任务已经存在，请稍等！');
                    }else{
                        alert('导出学情统计成功，请前往邮箱查收！');
                    }
                } else{
                    alert(obj.msg);
                }
            }
        });
    });

    function loadStyle(url) {
			var link = document.createElement('link');
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = url;
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(link);
	}
})();