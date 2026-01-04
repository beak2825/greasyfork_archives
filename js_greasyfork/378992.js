// ==UserScript==
// @name         萌芽日志自动回复
// @namespace    http://www.daojia.com/
// @version      0.4.0
// @description  萌芽日志商家列表自动回复
// @author       冯海年
// @include      https://jzbabywatcher.daojia-inc.com/admin/babywatcher/workrecord/*
// @require      http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        GM.xmlHttpRequest
// @grant        GM.openInTab
// @icon         https://uum.daojia-inc.com/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/378992/%E8%90%8C%E8%8A%BD%E6%97%A5%E5%BF%97%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/378992/%E8%90%8C%E8%8A%BD%E6%97%A5%E5%BF%97%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var content = {
    '黄疸观察':'您好，宝宝黄疸家庭护理：每天可以给宝宝晒晒早晚的太阳（眼睛及会阴不能直射到阳光，注意当地的天气情况，避免受凉），加强喂养，让宝宝多吃多排，监测黄疸值（方便的话最好是每天复查一次），必要时在医生指导下用药，观察宝宝皮肤、巩膜颜色的变化，注意宝宝吃奶、睡觉、精神及大小便的情况。足月儿黄疸值超过12.9mg/dl、早产儿黄疸值超过15mg/dl、黄疸长时间未消退，或宝宝出现嗜睡、拒奶、皮肤颜色加深明显等异常表现的，建议立即就医排查原因。 ',
    '脐部护理':'您好，请按以上方式护理，并注意尿不湿前端反折，避免摩擦。',
    '宝宝体温':'您好，坚持体温测量，注意测量体温应选择宝宝情绪平稳时，或吃奶、洗澡半小时后。适当增减衣物，不能包裹太多，室内环境温度要适宜，注意宝宝的喂养情况，避免喂食过饱，并保持大便通畅，继续观察。',
    '睡眠':'您好，请按以上方式护理。',
    '母乳喂养':'您好，请按以上方式护理。',
    '配方奶粉':'您好，请按以上方式护理。'
};

function autoReply(){
    var reply = $('#reply-area').text();
    if(reply != ''){
        return;
    }
    var key = $('div.cat-item span').text();
    var mv;
    if(key == '黄疸观察'){
        mv = parseFloat($('div.sick-detail span').text().replace(/[^0-9.]/ig,""));
        if(mv >= 12.9){
            alert('请注意，黄疸值超过正常值了！');
        }
    } else if(key == '宝宝体温'){
        mv = parseFloat($('div.sick-detail span').text().replace(/[^0-9.]/ig,""));
        if(mv >= 37.5){
            alert('请注意，宝宝体温超过正常值了！');
        }
    }
    var value = content[key];
    if(value){
        $('.js-textarea__reply').text(value);
    }
}

function refresh(){
    setTimeout(function(){
        $("input[name='dealStatus']").val('0');
        $("input[name='dealStatus']").prev().val('未处理');
        $("button[type='submit']").click();
        setTimeout(function(){
            // $('a.edit-btn').click();
            var id = '';
            var orderId = '';
            var babyId = '';
            var url = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/babyorder/list/pagedata?orderId=';
            var requestUrl = "";
            var babyIdArray;
            var detailUrl = '';
            $('a.edit-btn').each(function(){
                id = $(this).attr('onclick').replace(/[^0-9.]/ig,"");
                orderId = $(this).parent().parent().siblings('td[field="orderId"]').children().text();
                requestUrl = url + orderId;
                var babyIds = '';
                var result = getJSON(requestUrl);
                babyIdArray = [];
                $.each(result.rows, function(index, row){
                    babyIdArray.push(row.babyId);
                });
                babyIds = babyIdArray.join(',');
                detailUrl = getDetailUrl(id, orderId, babyIds);
                GM.openInTab(detailUrl, false);
            });
        }, 1000);
    }, 1000);
}

$(document).ready(function() {
    setTimeout(function(){
        var link = location.href;
        var uum_link = 'https://uum.daojia-inc.com/a';
        var list_link = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/workrecord/workerlist';
        var detail_link = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/workrecord/detail';
        if(link.indexOf(uum_link) == 0){
           // GM.openInTab(list_link, false);
        } else if(link.indexOf(list_link) == 0){
            refresh();
        } else if(link.indexOf(detail_link) == 0){
            addDetailContent();
            autoReply();
        }

        bindEvent();
    }, 1000);
});

function bindEvent(){
    $('#showPersonalInfoBtn').click(function(){
        var isShow = $(this).attr('data-isShow');
        if(isShow != 1){
            var babyId = $(this).attr('data-babyId');
            var orderId = $(this).attr('data-orderId');
            showPersonalInfo(babyId, orderId);
            $(this).attr('data-isShow', '1');
        }
    });
}

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        var link = location.href;
        var list_link = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/workrecord/workerlist';
        var detail_link = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/workrecord/detail';
        if(link.indexOf(list_link) == 0){
            refresh();
        } else if(link.indexOf(detail_link) == 0) {
            addDetailContent();
            autoReply();
        }
        bindEvent();
    }
});

function getJSON(url, callback){
    var response = $.ajax({
        url  :url,
        async : false
    });
    var result = {};
    if(response.status >= 200 && response.status < 400){
       result = JSON.parse(response.responseText);
    }
    return result;
}

function getDetailUrl(id, orderId, babyIds){
    var url = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/workrecord/detail';
    url = url + '?id=' + id;
    url = url + '&orderId=' + orderId;
    url = url + '&babyIds=' + babyIds;
    url = url + '&_t=' + new Date().getTime();
    return url;
}

function addDetailContent(){
    var babyDetailButtons = $('div.baby__base-info button.baby-detail');
    if(babyDetailButtons.length > 0){
        return;
    }
    var orderId = getQueryString('orderId');
    var babyIds = getQueryString('babyIds');
    var babyIdArray = babyIds.split(',');
    $.each(babyIdArray, function(index, babyId){
        var html = getButtonHtml(babyId, orderId);
        $('div.baby__base-info').append(html);
    });
    var html = '&nbsp;&nbsp;&nbsp;&nbsp;<button id="showPersonalInfoBtn" href="javascript:void(0);" class="easyui-linkbutton uum-btn--primary l-btn l-btn-small" data-orderId="'+orderId+'" data-babyId="'+babyIdArray[0]+'"><span class="l-btn-left"><span class="l-btn-text">展示客户及商家信息</span></span></button>';
    $('div.baby__base-info').append(html);
}

function getButtonHtml(babyId, orderId){
    var href = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/babyorder/detail';
    href = href + '?babyId=' + babyId;
    href = href + '&orderId=' + orderId;
    href = href + '&_t=' + new Date().getTime();
    var html = '<button href="javascript:void(0);" class="easyui-linkbutton uum-btn--primary l-btn l-btn-small baby-detail" onclick="window.open(\'' + href + '\')"><span class="l-btn-left"><span class="l-btn-text">宝宝详情</span></span></button>';
    return html;
}

function showPersonalInfo(babyId, orderId){
    var row = getWorkerRow(orderId);
    var workerPhone = getWorkerPhone(row.userId);
    var customerName = getCustomerName(orderId);
    var customerPhone = getCustomerPhone(orderId);
    var key = $('div.cat-item span').text();
    var sendTime = $('.baby__send-time').text();
    var sickDetail = $('.sick-detail span').text();
    var html = '<div class="baby__article-content"><span style="color: black">订单编号：' + orderId + '</span></div>'
    html = html + '<div class="baby__article-content"><span style="color: black">运营站：' + row.stationName + '</span></div>'
    html = html + '<div class="baby__article-content"><span style="color: black">客户姓名：' + customerName + '</span></div>'
    html = html + '<div class="baby__article-content"><span style="color: black">客户电话：' + customerPhone + '</span></div>'
    html = html + '<div class="baby__article-content"><span style="color: black">商家姓名：' + row.userName + '</span></div>'
    html = html + '<div class="baby__article-content"><span style="color: black">商家电话：' + workerPhone + '</span></div>'
    var birthday = '';
    if(key == '黄疸观察'){
        birthday =  getBirthday(babyId, orderId);
        html = html + '<div class="baby__article-content"><span style="color: black">详情：劳动者' + row.userName + sendTime + '在萌芽日记中记录宝宝黄疸值为' + sickDetail + '，宝宝' + birthday + '出生，宝宝黄疸值较高，请跟劳动者核实情况是否属实。麻烦小伙伴们电话联系客户，告知宝宝黄疸值过高的危害：宝宝高胆红素血症未及时治疗，有可能导致胆红素脑病或核黄疸，对宝宝的智力等将造成永久性伤害。建议遵医嘱治疗及护理，避免发生不可逆的后果，并继续跟进了解宝宝后续的情况。</span></div>'
    } else if(key == '宝宝体温'){
        birthday =  getBirthday(babyId, orderId);
        html = html + '<div class="baby__article-content"><span style="color: black">详情：劳动者' + row.userName + sendTime + '在萌芽日记中记录宝宝' + sickDetail + '，宝宝' + birthday + '出生，如情况属实，需立即联系客户带宝宝就医，遵医嘱治疗及护理，避免发生不可逆的后果，并继续跟进了解宝宝后续的情况。</span></div>'
    }
    $('div.baby__base-info').append(html);
}

function getWorkerRow(orderId){
    var url = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/workrecord/listdata?creatorType=2&orderId=' + orderId;
    var result = getJSON(url);
    var row = result.rows[0];
    return row;
}

function getWorkerPhone(userId){
    var url = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/common/workerphone?userId=' + userId;
    var result = getJSON(url);
    var phone = result.data.phone;
    return phone;
}

function getCustomerPhone(orderId){
    var url = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/common/customerphone?orderId=' + orderId;
    var result = getJSON(url);
    var phone = result.data.phone;
    return phone;
}

function getCustomerName(orderId){
    var url = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/babyorder/list/pagedata?orderId=' + orderId;
    var result = getJSON(url);
    var customerName = result.rows[0].customerName;
    return customerName;
}

function getBirthday(babyId, orderId){
    var url = 'https://jzbabywatcher.daojia-inc.com/admin/babywatcher/babyorder/detail/pagedata?babyId=' + babyId + '&orderId=' + orderId;
    var result = getJSON(url);
    var birthday = result.data.babyDtos[0].birthday;
    return birthday;
}

function getQueryString(name) {
    var param = '';
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        param = unescape(r[2]);
    }
    return param;
}