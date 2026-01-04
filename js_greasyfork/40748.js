// ==UserScript==
// @name         Report fb ca nhan
// @namespace    https://greasyfork.org/scripts/37908-report-fb/code/Report%20fb.user.js
// @version      1.0.12
// @description  Script report facebook lũ vô văn hoá chửi team bạn
// @author       You
// @include        /.*://.*facebook.com/phamngoc621998/?$/
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://unpkg.com/arrive@2.4.1/src/arrive.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40748/Report%20fb%20ca%20nhan.user.js
// @updateURL https://update.greasyfork.org/scripts/40748/Report%20fb%20ca%20nhan.meta.js
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
if(/phamngoc621998/i.test(window.location.href)){
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

var THOI_GIAN_REPORT = Math.round(Math.random() * (MAX - MIN) + MIN);
console.log('The random roll landed on ' + THOI_GIAN_REPORT + ' minute(s).');
setTimeout(function(){location.reload();},1000*60*THOI_GIAN_REPORT);