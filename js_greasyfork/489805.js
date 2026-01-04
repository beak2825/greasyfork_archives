// ==UserScript==
// @name         老毕1039驾校学车预约
// @namespace    https://leo.bi
// @version      1.7
// @license      MIT
// @description  老毕1039驾校学车预约工具
// @description:example  案例: http://rfjxwx.1039soft.com/
// @author       Leo Bi
// @match        http*://*/webphone/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/489805/%E8%80%81%E6%AF%951039%E9%A9%BE%E6%A0%A1%E5%AD%A6%E8%BD%A6%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/489805/%E8%80%81%E6%AF%951039%E9%A9%BE%E6%A0%A1%E5%AD%A6%E8%BD%A6%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==


(function($) {
    'use strict';

    const GOD_MODE_KEY_ID = "GOD_MODE_KEY_ID";

    function getDateString(addDaysNumber) {
        let dt = new Date();
        dt.setDate(dt.getDate() + addDaysNumber);

        let month = dt.getMonth() + 1;
        let day = dt.getDate();

        return dt.getFullYear() + '-' +
            (month < 10 ? '0' : '') + month + '-' +
            (day < 10 ? '0' : '') + day;
    }

    $(document).ready( function() {

        if ($(location).attr('href').includes('sdyy.aspx?')) {

            let headContent = $('div.head_wrap').css('background', 'crimson');

            let div = document.createElement("div");
            div.innerHTML='<input type="checkbox" id="godModeOption" name="godModeOption" /><label for="godModeOption" style="font-size: 16px">上帝模式</label> <input type="text" id="godDate" name="godDate" maxlength="10" size="10" value="" readonly><label id="labelGodDate" for="godDate" style="font-size: 16px">天选之日</label> <div style="padding-left: 24px; display:inline-block;"><input type="button" id="refreshPageButton" name="refreshPageButton" value="点击刷新" onclick="location.reload();" style="font-size: 16px"/><div>';
            div.style='text-align: center';
            $("div.head_wrap").append(div);

            let savedGodMode = GM_getValue(GOD_MODE_KEY_ID, 'N');
            if(savedGodMode == 'Y') {
                $('#godModeOption').prop("checked", true);

                $('#godDate').val(getDateString(1));

                $('#godDate').show();
                $('#labelGodDate').show();
            } else {
                $('#godDate').hide();
                $('#labelGodDate').hide();
            }

            $('#godModeOption').change(function(event){
                if($(this).is(':checked')) {
                    GM_setValue(GOD_MODE_KEY_ID,'Y');
                } else {
                    GM_setValue(GOD_MODE_KEY_ID,'N');
                }

                // reload the page
                location.reload();
            });


            // wait until all yuyue_wrap shows up
            var testAppearTmr = setInterval(function() {
                console.log("length:" + $('div.yuyue_wrap').length);

                if ($('div.yuyue_wrap').length >= 10) {
                    clearInterval(testAppearTmr);

                    let jlid = $('input#jlid').val();
                    console.log("jlid: " + jlid);

                    let carType = $('input#carType').val();
                    console.log("carType: " + carType);

                    let dt = $('span#pz').find("p:first").text();
                    console.log(dt);

                    if(GM_getValue(GOD_MODE_KEY_ID, 'N') == 'Y' && $('#godDate').is(":visible")) {
                        if(dt != $('#godDate').val()) {
                            $('span#pz').css('text-decoration', 'line-through');
                        }

                        dt = $('#godDate').val();
                        console.log("overwrite 'dt' by god date:" + dt);
                    }

                    // select favourite time span
                    $('div.biaoge_gexuan').find('div#dqsd').each(function(index){
                        // $(this).css('background', 'yellow');

                        let timeSpan = $(this).parent().find(":hidden").text();
                        //console.log("timeSpan: " + timeSpan);

                        const FAV_TIME_KEY_ID = "FAV_TIME_" + timeSpan;

                        let savedFavTimeSpan = GM_getValue(FAV_TIME_KEY_ID, 'N');

                        if(savedFavTimeSpan == 'Y') {
                            $(this).parent().parent().css('background', 'bisque');
                        }

                        $(this).on("click",function(e){
                            savedFavTimeSpan = GM_getValue(FAV_TIME_KEY_ID, 'N');

                            // toggle the option
                            if(savedFavTimeSpan == 'N') {
                                GM_setValue(FAV_TIME_KEY_ID,'Y');
                                $(this).parent().parent().css('background', 'bisque');
                            } else {
                                GM_setValue(FAV_TIME_KEY_ID,'N');
                                $(this).parent().parent().css('background', 'none');
                            }

                            e.stopPropagation();
                        });
                    });


                    // do the real work
                    $('div.biaoge_gexuan').find('div.yuyue_wrap').find('span').each(function(index){
                        console.log(index + ":" + $(this).text());

                        if($(this).hasClass('yiyue') && savedGodMode != 'Y') {
                            // do nothing
                        } else {
                            // do the work
                            let $currentSpan = $(this);

                            let timeSpan = $(this).parent().parent().find(":hidden").text();
                            console.log("timeSpan: " + timeSpan);

                            // un-register original onclick event
                            $(this).prop("onclick", null);

                            // indicate it is ready to book
                            $(this).css('background', 'blue');

                            // register onclick event
                            $(this).on("click",function(e){

                                $.ajax({
                                    url: "ajax/SaveYuYueInfo.ashx",
                                    type: "get",
                                    data: {
                                        type: 'avvd',
                                        codeid: jlid,
                                        shijian: dt,
                                        shiduan: timeSpan,
                                        pxtype: carType,
                                        stuMobile: '',
                                        dcdd: '',
                                        wzId: ''
                                    },
                                    success: function(response) {
                                        if(response.indexOf("失败") > -1 || response.indexOf("error") > -1) {
                                            console.log("失败: " + response);
                                            $currentSpan.text("预约失败").css('color', 'red');
                                        } else {
                                            console.log("成功: " + response);
                                            $currentSpan.text("预约成功").css('color', 'yellow');
                                        }
                                    },
                                    error: function(xhr) {
                                        console.log("error");
                                    }
                                });

                                e.stopPropagation();
                            });
                        }

                    });


                }
            }, 200);

        }

    });



})(jQuery);