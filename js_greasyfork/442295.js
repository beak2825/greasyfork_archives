// ==UserScript==
// @name         zhaolu-auto
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  招录用户自动同步职位信息至第三方招聘网站
// @author       Zhaolu
// @match        *.zhaopin.com/job/publish*
// @match        *rd6.zhaopin.com/resume/detail*
// @require      https://cdn.staticfile.org/jquery/1.10.0/jquery.min.js
// @connect      h5.zhaolu360.com
// @connect      zl.dingmatrix.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/442295/zhaolu-auto.user.js
// @updateURL https://update.greasyfork.org/scripts/442295/zhaolu-auto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(function () {
        var isZhaoPin = /zhaopin\.com/.test(location.host)
        var isZhaoPinJobPublish = isZhaoPin && /\/job\/publish/.test(location.pathname)
        var qZlKey = getUrlParameter('zl-key');
        console.log(qZlKey, location.href, location.pathname, location);
        if (isZhaoPinJobPublish) {
            setTimeout(function () {
                ZhaoPinJobPublish(qZlKey)
            }, 1000)
        }
    })

    function ZhaoPinJobPublish(qZlKey) {
        GM_xmlhttpRequest({
            method: "GET",
            //url: "https://h5.zhaolu360.com/zl/own/user/job?key=" + qZlKey,
            url: "http://zl.dingmatrix.com:8088/zl/own/user/job?key=" + qZlKey,
            onload: function(res) {
                console.log('onload', res)
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    var position = json.data;
                    if (!position) return false;

                    // 开始填充
                    var $positionName = $('input[placeholder="请输入职位名称"]');
                    if (!$positionName.length) {
                        $positionName = $('input[placeholder="如: 人力资源经理，请勿超过30个字"]');
                    }
                    $positionName.length && $positionName.val(position.positionName).get(0).dispatchEvent(new Event('input'));

                    $('.jqte_editor').html(position.description.replace(/\r|\n/g, '<br/>'));
                    $('textarea').eq(0).val(position.description).get(0).dispatchEvent(new Event('input'));

                    var $type = $('input[placeholder="建议选择推荐职位类别，有助于帮您更精准地匹配人才"],input[placeholder="请选择职位类别"]');
                    $type.length > 0 && $type.val(position.type).get(0).dispatchEvent(new Event('input'));

                    var $degreeName = $('input[placeholder="最低学历"],input[placeholder="请选择学历"]');
                    $degreeName.length && $degreeName.val(position.degreeName).get(0).dispatchEvent(new Event('input'));

                    var $workYear = $('input[placeholder="工作经验"],input[placeholder="请选择工作年限"]');
                    $workYear.length && $workYear.val(position.workYearStr).get(0).dispatchEvent(new Event('input'));

                    var $salaryMin = $('input[placeholder="最低"]');
                    $salaryMin.length && $salaryMin.val(position.salaryMin).get(0).dispatchEvent(new Event('input'));

                    var $salaryMax = $('input[placeholder="最高"]');
                    $salaryMax.length && $salaryMax.val(position.salaryMax).get(0).dispatchEvent(new Event('input'));

                    var $plan = $('input[placeholder="请输入招聘人数"]');
                    $plan.length && $plan.val(position.plan_count || 1).get(0).dispatchEvent(new Event('input'));
                }
            }
        });
    }

    function setValue($item, label, value) {
        var $label = $item.find('.km-form-item__label');
        if ($label.text() === label) {
            var $input = $item.find('input,textarea');
            $input.val(value);
            console.log(label, $input.length);
        }
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    }
})();