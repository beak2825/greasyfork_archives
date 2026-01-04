// ==UserScript==
// @name         Report Neuconfession
// @namespace    http://tampermonkey.net/
// @version      6.9.6.9
// @description  Script report facebook lũ đô dăn quá viết bài câu diu dẫm lìn
// @author       You
// @include        /.*://.*facebook.com/Neuconfession2018/?$/
// @include        /.*://.*facebook.com/neuconfessions/?$/
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://unpkg.com/arrive@2.4.1/src/arrive.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399627/Report%20Neuconfession.user.js
// @updateURL https://update.greasyfork.org/scripts/399627/Report%20Neuconfession.meta.js
// ==/UserScript==

var MIN = 15; // số phút tối thiểu để auto rp
var MAX = 30; // số phút tối đa auto rp
var RANDOM_THOI_GIAN_CLICK = true; //giả lập click giống con người bằng cách random thời gian click


function randomize(a,b) {
    if (!RANDOM_THOI_GIAN_CLICK) {return 0;}
    return Math.floor(Math.random() * (b-a)) + a;
}

function showMessage() {
    $('._5cl4').html("Đã report xong, anh em không cần nhấn <b>Done</b>, tab sẽ tự động report lại sau " + THOI_GIAN_REPORT + " phút. Để chỉnh lại thời gian, xem ở <a target='_blank' href='https://i.imgur.com/4qH45MI.png'>đây</a>");
    $('._5cl4').css({"font-size": "18px","color": "red", "text-align": "center","line-height": "1.4"});
}

var intv;
var intv2;
//reports personal accounts
if(/tu4nsaker/i.test(window.location.href)){
    console.log('Reporting personal account function initializing');
    $(document).arrive('._1yzl', function(){
        setTimeout(function() {
            intv = setInterval(function(){$('._1yzl').click();},1000);
            $(document).unbindArrive('._1yzl');
        },randomize(200,1100));
    });
    $(document).arrive('._54nc[href^="/ajax/nfx/start_dialog?story_location=profile_someone_else&reportable"] ._54nh', function(){
        clearInterval(intv);
        setTimeout(function() {
            $('._54nc[href^="/ajax/nfx/start_dialog?story_location=profile_someone_else&reportable"] ._54nh').click();
            $(document).unbindArrive('._54nc[href^="/ajax/nfx/start_dialog?story_location=profile_someone_else&reportable"] ._54nh');
        },randomize(1200,2100));
    });
    $(document).arrive('#nfxQuestionNamedaccount > label._55sh._5ww6._5p_b.uiInputLabelInput > span', function(){
        setTimeout(function() {
            $('#nfxQuestionNamedaccount > label._55sh._5ww6._5p_b.uiInputLabelInput > span').click();
            setTimeout(function() {
                $('._42ft._4jy0.layerConfirm').click();
            },randomize(1200,2100));
            $(document).unbindArrive('#nfxQuestionNamedaccount > label._55sh._5ww6._5p_b.uiInputLabelInput > span');
        },randomize(1200,2100));
    });

    $(document).arrive('#nfxQuestionNamedfake > label._55sh._5ww6._5p_b.uiInputLabelInput > span', function(){
        setTimeout(function() {
            $('#nfxQuestionNamedfake > label._55sh._5ww6._5p_b.uiInputLabelInput > span').click();
            setTimeout(function() {
                $('._42ft._4jy0.layerConfirm').click();
            },randomize(1200,2100));
            $(document).unbindArrive('#nfxQuestionNamedfake > label._55sh._5ww6._5p_b.uiInputLabelInput > span');
        },randomize(1200,2100));
    });
    $(document).arrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span', function(){
        setTimeout(function() {
            intv2 = setInterval(function(){$('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span').click();showMessage();},1000);
            setTimeout(function(){clearInterval(intv2);},2100);
            $(document).unbindArrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span');
        },randomize(200,1100));
    });
}
//reports groups
if(/370023386751036|phongthutoibeatvn|kysuduongpho|780485565464752|phongtrutgianbeatvn|tuyettinhcocbeatvn|BEATGAMER/i.test(window.location.href)){
    console.log('Reporting group function initializing');
    $(document).arrive('#pagelet_group_actions i', function(){
        setTimeout(function() {
            intv = setInterval(function(){$('#pagelet_group_actions i').click();},1000);
            $(document).unbindArrive('#pagelet_group_actions i');
        },randomize(200,1100));
    });

    $(document).arrive('._54nc[href^="/ajax/report.php"] span', function(){
        clearInterval(intv);
        setTimeout(function() {
            $('._54nc[href^="/ajax/report.php"] span').click();
            $(document).unbindArrive('._54nc[href^="/ajax/report.php"] span');
        },randomize(1200,2100));
    });
    $(document).arrive('#nfxQuestionNamedhate span', function(){
        setTimeout(function() {
            $('#nfxQuestionNamedhate span').click();
            setTimeout(function() {
                $('#nfx_dialog_continue').click();
            },randomize(1200,2100));
            $(document).unbindArrive('#nfxQuestionNamedhate span');
        },randomize(1200,2100));
    });
    $(document).arrive('#nfxQuestionNamedrace span', function(){
        setTimeout(function() {
            $('#nfxQuestionNamedrace span').click();
            setTimeout(function() {
                $('#nfx_dialog_continue').click();
            },randomize(1200,2100));
            $(document).unbindArrive('#nfxQuestionNamedrace span');
        },randomize(1200,2100));
    });
    $(document).arrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span', function(){
        setTimeout(function() {
            intv2 = setInterval(function(){$('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span').click();showMessage();},1000);
            setTimeout(function(){clearInterval(intv2);},2100);
        },randomize(200,1100));
    });
}
//reports pages
if(/beatvn\.world|zoom\.beatvn|beatvn\.quotes|BanHoiVozerTraLoi|beatvn\.troll|beatvn.page|beatvn.sport|beatvn\.video/i.test(window.location.href)){
    console.log('Reporting page function initializing');
    $(document).arrive('._p._4jy0._4jy4', function(){
        setTimeout(function() {
            intv = setInterval(function(){$('._p._4jy0._4jy4').click();},1000);
            $(document).unbindArrive('._p._4jy0._4jy4');
        },randomize(200,1100));
    });

    $(document).arrive('.uiContextualLayer ul li a[href*="report"] ._54nh', function(){
        clearInterval(intv);
        setTimeout(function() {
            $('.uiContextualLayer ul li a[href*="report"] ._54nh').click();
            $(document).unbindArrive('.uiContextualLayer ul li a[href*="report"] ._54nh');
        },randomize(1200,2100));
    });
    $(document).arrive('#nfxQuestionNamedharassment span', function(){
        setTimeout(function() {
            $('#nfxQuestionNamedharassment span').click();
            setTimeout(function() {
                $('#nfx_dialog_continue').click();
            },randomize(1200,2100));
            $(document).unbindArrive('#nfxQuestionNamedharassment span');
        },randomize(1200,2100));
    });
    $(document).arrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span', function(){
        setTimeout(function() {
            intv2 = setInterval(function(){$('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span').click();showMessage();},1000);
            setTimeout(function(){clearInterval(intv2);},2100);
            $(document).unbindArrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span');
        },randomize(200,1100));
    });
}
//report app
if(/beat_vn/i.test(window.location.href)){
    console.log('Reporting app function initializing');
    $(document).arrive('.fsm.fwn.fcg a[ajaxify^="/ajax/report.php"]', function(){
        setTimeout(function() {
            intv = setInterval(function(){document.querySelector('.fsm.fwn.fcg a[ajaxify^="/ajax/report.php"]').click();},1000);
            $(document).unbindArrive('.fsm.fwn.fcg a[ajaxify^="/ajax/report.php"]');
        },randomize(200,1100));
    });

    $(document).arrive('#nfxQuestionNamedinappropriate span', function(){
        clearInterval(intv);
        setTimeout(function() {
            $('#nfxQuestionNamedinappropriate span').click();
            setTimeout(function() {
                $('#nfx_dialog_continue').click();
            },randomize(1200,2100));
            $(document).unbindArrive('#nfxQuestionNamedinappropriate span');
        },randomize(1200,2100));
    });
    $(document).arrive('#nfxQuestionNamedhate span', function(){
        setTimeout(function() {
            $('#nfxQuestionNamedhate span').click();
            setTimeout(function() {
                $('#nfx_dialog_continue').click();
            },randomize(1200,2100));
            $(document).unbindArrive('#nfxQuestionNamedhate span');
        },randomize(1200,2100));
    });
    $(document).arrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span', function(){
        setTimeout(function() {
            intv2 = setInterval(function(){$('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span').click();showMessage();},1000);
            setTimeout(function(){clearInterval(intv2);},2100);
            $(document).unbindArrive('._16gh[ajaxify^="/ajax/feed/filter_action/nfx_action_execute?action_name=REPORT"] span');
        },randomize(200,1100));
    });
}
var THOI_GIAN_REPORT = Math.round(Math.random() * (MAX - MIN) + MIN);
console.log('The random roll landed on ' + THOI_GIAN_REPORT + ' minute(s).');
setTimeout(function(){location.reload();},1000*60*THOI_GIAN_REPORT);