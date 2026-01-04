// ==UserScript==
// @name         DE-Automatically create case
// @namespace    http://tampermonkey.net/
// @version      5.0.2
// @description  Drive-Easy一键创建案件,安装完成后请修改填充数据
// @author       KilluaChen
// @match        */alarm-center/identify-customer*
// @match        */alarm-center/customer-location*
// @match        */alarm-center/identify-problem*
// @match        */axaChina/alarm-center/identify-customer*
// @match        */axaChina/alarm-center/customer-location*
// @match        */axaChina/alarm-center/identify-problem*
// @match        */axaPre/alarm-center/identify-customer*
// @match        */axaPre/alarm-center/customer-location*
// @match        */axaPre/alarm-center/identify-problem*


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369613/DE-Automatically%20create%20case.user.js
// @updateURL https://update.greasyfork.org/scripts/369613/DE-Automatically%20create%20case.meta.js
// ==/UserScript==

(function() {
    var username = ''; //名
    var mobile_number = ''; //手机号码
    var address = '阿勒泰地区哈巴河县阿克齐镇人民政府'; //故障地址
    var service_type = 6; //3路边维修,6平板拖车
    var is_submit = false; //是否可提交数据
    var contract_id = 8; //合同,8:测试合同,110:太保路修,111:太保50

    $(document.body).append('<div style=\'position: fixed;top: 19px;right: 43%;z-index: 999;padding: 5px;\'><button id=\'killua_fill\' style=\'font-size:17px; color: green;border-radius: 3px;\'>&nbsp;Fill&Commit&nbsp;</button></div>')
    $('#killua_fill').click(function() {
        if (username == '') {
            alert('请先设置你的姓名');
        }
        if (mobile_number == '') {
            alert('请先设置你的手机号码');
        }
        var location = window.location.href
        if (location.indexOf('identify-customer') !== -1) {
            if ($('#client_id').val() != '') {
                $('#proceed').click()
                $('#killua_fill').attr('disabled', true)
                return false
            }
            var date = new Date()
            var month = (date.getMonth() + 1)
            $('#user_first_name').val('test_' + username + '_' + month + '_' + date.getDate())
            $('#user_last_name').val('Chen')
            $('#user_mobile_number').val(mobile_number)
            $('#user_mobile_number2').val('13800138000')
            $('#country_code2').val('+852')
            $('#is_assumed_coverage').click()
            $('#client_id').val(contract_id).change()
            $('#client_case_no').val(username + '_' + Math.ceil(Math.random() * 100000000000))
            $('#policy_number').val(username + '_PN_' + Math.ceil(Math.random() * 100000000000))
            $('#policy_number').val('test_baodanhao_123456')
        }
        if (location.indexOf('customer-location') !== -1) {
            $('#searchInput').val(address)
            kSearch()
            var timer = setInterval(function() {
                if ($('#customer_province').val() != '') {
                    $('.address_button button').click();
                    clearInterval(timer);
                }
            }, 100);
        }
        if (location.indexOf('identify-problem') !== -1) {
            if (is_submit && $('#fk_car_model_id').val() != '') {
                $('#nextBtn').click()
                return false
            }
            $('#vin_number').val('test_chejiahao_66')
            $('#registeration_number').val('沪-' + username + '-666')
            $('#problem_description').val('问题描述...' + username + '_test')
            $('#fk_fault_type_id').val(2).change()
            $('#car_color').val('宝石蓝')
            $('select[name="fuel_type"]').val('U')
            $('select[name="transmission_type"]').val('M')
            $('#created_on').val('12-09-2015')
            $('#coverage_start_date').val('01-01-2018')
            $('#coverage_end_date').val('12-12-2028')
            $('#year_of_manufacture').val('2015年')
            $('#odometer').val('1249KM')
            $('select[name="location_remark"]').val('Multi-level car park')
            $('#equipment_id').val(2)
            if ($('#primary_service_id').val() == '') {
                var have_service = false;
                var temp_service = null;
                $('#primary_service_id option').each(function(){
                    temp_service = $(this).val();
                    if(temp_service==service_type){
                        have_service=true;
                    }
                });
                if(!have_service){
                    service_type=temp_service;
                }
                $('#primary_service_id').val(service_type).change()
            }
            if ($('#fk_car_make_id').val() == '') {
                $('#fk_car_make_id').val(3).change()
            }
            var interval_t = setInterval(function() {
                if ($('#fk_fault_sub_type_id').children().length !== 1) {
                    $('#fk_fault_sub_type_id').val(11).change()
                    clearInterval(interval_t)
                }
            }, 100)
            var interval_m = setInterval(function() {
                if ($('#fk_car_model_id').children().length !== 1) {
                    $('#fk_car_model_id').val(32).change()
                    is_submit = true
                    clearInterval(interval_m)
                }
            }, 100)
            var interval_s = setInterval(function() {
                if ($('#primary_sub_service_id').children().length !== 1) {
                    $('#primary_sub_service_id').val(service_type)
                    is_submit = true
                    clearInterval(interval_s)
                }
            }, 100)
        }
        var buttonArr = $('button[type=submit]').offset()
        var inputArr = $('input[type=submit]').offset()
        var top = 0
        if (buttonArr != null) {
            top = buttonArr.top
        }
        if (inputArr != null) {
            top = inputArr.top
        }
        $('html,body').animate({
            scrollTop: top
        }, 100)
    })
})()