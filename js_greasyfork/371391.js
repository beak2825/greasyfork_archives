// ==UserScript==
// @name         서울예대 자동수강신청
// @version      0.1a
// @description  try to take over the world!
// @author       You
// @match        http://sportal.seoularts.ac.kr/course/application/apply/view
// @grant        none
// @namespace https://greasyfork.org/users/206406
// @downloadURL https://update.greasyfork.org/scripts/371391/%EC%84%9C%EC%9A%B8%EC%98%88%EB%8C%80%20%EC%9E%90%EB%8F%99%EC%88%98%EA%B0%95%EC%8B%A0%EC%B2%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/371391/%EC%84%9C%EC%9A%B8%EC%98%88%EB%8C%80%20%EC%9E%90%EB%8F%99%EC%88%98%EA%B0%95%EC%8B%A0%EC%B2%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    withPages_jQuery(initAutoApplyBtn);
})();

function initAutoApplyBtn(jQuery) {
    var $ = jQuery;
    var startBtn = '\
<div class="row page-contents" id="autoApplyBtnInfo" style="display: none;"> \
    <div class="col-lg-12"> \
        <div class="panel panel-success"> \
            <div class="panel-heading"> \
                <small>서울예대 관심강좌 자동신청 v0.1a by xeung</small> \
            </div> \
            <div class="panel-body"> \
                <strong>사용방법</strong>: 수강신청 시작 전 미리 페이지를 로드한 상태에서, 시작 시간이 되면 즉시 시작 버튼을 누르세요.<br><br> \
                <button id="autoApplyBtn" type="button" class="btn btn-primary btn-lg btn-block">자동 수강신청 시작하기</button> \
            </div> \
        </div> \
    </div> \
</div>';

    $('#memoNote').before(startBtn);
    $('#autoApplyBtnInfo').slideDown();
    $('#autoApplyBtn').click(function (e) {
        e.preventDefault();
        withPages_jQuery(initAutoApply);
    });
}

function initAutoApply(jQuery) {
    var $ = jQuery;
    var panel = '\
<div id="autoApplyPanel" class="row page-contents" style="display: none;"> \
    <div class="col-lg-12"> \
        <div class="panel panel-success"> \
            <div class="panel-heading"> \
                <small>서울예대 관심강좌 자동신청 v0.1a by xeung</small> \
            </div> \
            <div class="panel-body"> \
                <textarea id="autoApplyLog" class="form-control" readonly rows="30" style="font-size:8px; line-height:1.8;">관심강좌 자동신청 시스템 로드 중...</textarea> \
            </div> \
        </div> \
    </div> \
</div>';

    function autoApplyLog(logtext) {
        $('#autoApplyLog').text(
            $('#autoApplyLog').text() + "\n" + logtext
        ).scrollTop($('#autoApplyLog')[0].scrollHeight);
    }
    window.autoApplyLog = autoApplyLog;

    //$('#memoNote').hide();
    $('#memoNote').before(panel);
    $('#autoApplyBtnInfo').slideUp();
    $('#autoApplyPanel').slideDown();
    //jQuery('#myInterestCourse-tab').parent().parent().children('li').removeClass('active')
    //jQuery('#myInterestCourse-tab').parent().addClass('active');
    autoApplyLog('⠀');
    autoApplyLog('>> 관심 수강목록 다운로드 시작');

    $.get({
        url: '/course/application/apply/myInterestCourseList',
        success: function(data) {
            window.intClassListHTML = data;
            window.intClassListQuery = jQuery(data);

            var il = [];
            var ilCount = {
                total: 0,
                available: 0,
                gone: 0,
                need: {
                    total: 0,
                    available: 0,
                    gone: 0
                },
                plus: {
                    total: 0,
                    available: 0,
                    gone: 0
                }
            };
            $(window.intClassListQuery).find('tbody tr').each(function (i, v) { //button[data-role="apply"]
                ilCount.total++;

                var is_needed = ($(v).find('td:eq(3)').text().trim() == 'Y')? 'need':'plus' ;

                ilCount[is_needed].total++;

                if ( 0 < ($(v).find('td:eq(8)').text().trim() * 1) ) {
                    ilCount.available++;
                    ilCount[is_needed].available++;
                } else {
                    ilCount.gone++;
                    ilCount[is_needed].gone++;
                }

                il.push({
                    title: $(v).find('td.text-left').text().trim().split("\n")[0].trim(),
                    available: $(v).find('td:eq(8)').text().trim() * 1,
                    need: (is_needed == 'need')? '전공':'비전공' ,
                    data: {
                        schlYear: $(v).find('button[data-role="apply"]').attr('data-year'),
                        schlSmst: $(v).find('button[data-role="apply"]').attr('data-smst'),
                        subjCode: $(v).find('button[data-role="apply"]').attr('data-subject'),
                        lctrClas: $(v).find('button[data-role="apply"]').attr('data-clas'),
                        dornGubn: $(v).find('button[data-role="apply"]').attr('data-gubn'),
                        schlGrad: $(v).find('button[data-role="apply"]').attr('data-grad'),
                        deptCode: $(v).find('button[data-role="apply"]').attr('data-dept'),
                        stntNumb: $("input[name=stntNumb]").val(),
                        cmd: "write"
                    }
                });
            });

            //window.console.log(il);

            autoApplyLog('>> 관심 수강목록 다운로드 및 분석 완료 (총 '+ ilCount.total + ' 건, 신청가능 '+ ilCount.available +' 건, 신청불가 ' +ilCount.gone+ ' 건)');
            autoApplyLog('  ㄴ 전공 분석 완료 (전공 총 '+ ilCount.need.total + ' 건, 신청가능 '+ ilCount.need.available +' 건, 신청불가 ' +ilCount.need.gone+ ' 건)');
            autoApplyLog('  ㄴ 비전공 분석 완료 (비전공 총 '+ ilCount.plus.total + ' 건, 신청가능 '+ ilCount.plus.available +' 건, 신청불가 ' +ilCount.plus.gone+ ' 건)');

            autoApplyLog('⠀');
            autoApplyLog('>> 자동 수강신청 시스템 구동');
            autoApplyLog('>>>>>> [중요안내] 전체 신청 결과를 확인한 뒤 반드시 새로고침하여 신청 내역을 재확인하십시오. <<<<<<');
            autoApplyLog('⠀');

            $.each(il, function (i, cl) {
                autoApplyLog('  ㄴ [ '+(i+1)+' ]   ['+cl.need+'] '+cl.title+' (강좌번호 '+cl.data.subjCode + cl.data.lctrClas+') 신청 시작    -    실시간 잔여인원 '+cl.available+' 명');

                $.poizn.getJson({
                    url: "/course/application/apply/insert",
                    type: "POST",
                    data : JSON.stringify(cl.data),
                    success: function(data) {
                        autoApplyLog('  ㄴ [ '+(i+1)+' ]   ['+cl.need+'] '+cl.title+' (강좌번호 '+cl.data.subjCode + cl.data.lctrClas+') 신청 결과: [ '+data.msg+' ]');
                    }
                });
            });
        }
    });
}
window.initAutoApply = initAutoApply;

function withPages_jQuery (NAMED_FunctionToRun) {
    //--- Use named functions for clarity and debugging...
    var funcText        = NAMED_FunctionToRun.toString ();
    var funcName        = funcText.replace (/^function\s+(\w+)\s*\((.|\n|\r)+$/, "$1");
    var script          = document.createElement ("script");
    script.textContent  = funcText + "\n\n";
    script.textContent += 'jQuery(document).ready(function() {'+funcName+'(jQuery);});';
    document.body.appendChild (script);
}
window.withPages_jQuery = withPages_jQuery;

function withPages_function (NAMED_FunctionToRun) {
    //--- Use named functions for clarity and debugging...
    var funcText        = NAMED_FunctionToRun.toString ();
    var funcName        = funcText.replace (/^function\s+(\w+)\s*\((.|\n|\r)+$/, "$1");
    var script          = document.createElement ("script");
    script.textContent  = funcText + "\n\n";
    script.textContent += funcName+'();'; //'jQuery(document).ready(function() {'+funcName+'(jQuery);});';
    document.body.appendChild (script);
}
window.withPages_function = withPages_function;