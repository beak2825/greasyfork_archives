// ==UserScript==
// @name         BGM批量关联制作人员
// @namespace    chitanda
// @version      1.1.1
// @description  https://bgm.tv/group/topic/362063
// @author       chitanda
// @match        http*://bgm.tv/subject/*/add_related/person
// @match        http*://bangumi.tv/subject/*/add_related/person
// @match        http*://chii.in/subject/*/add_related/person
// @connect      bgm.tv
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/423675/BGM%E6%89%B9%E9%87%8F%E5%85%B3%E8%81%94%E5%88%B6%E4%BD%9C%E4%BA%BA%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/423675/BGM%E6%89%B9%E9%87%8F%E5%85%B3%E8%81%94%E5%88%B6%E4%BD%9C%E4%BA%BA%E5%91%98.meta.js
// ==/UserScript==
$(document).ready(function() {
    function htmlDecode(input) {
        var e = document.createElement('textarea');
        e.innerHTML = input;
        // handle case of empty input
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }
    var ctd_findPersonFunc = function(person_list, person_type, idx) {
        let subject_name = person_list[idx];
        var person_num = person_list.length;
        console.log(subject_name);
        var params = new Object();
        $('#subjectList').html('<tr><td>正在检索中...</td></tr>');
        var search_mod = $('#sbjSearchMod').attr('value');
        if (search_mod.split('-')[0] == 'cv_person') {
            params['character_id'] = character_id;
        }
        $.ajax({
            type: "GET",
            url: '/json/search-' + search_mod + '/' + encodeURIComponent(subject_name),
            data: params,
            dataType: 'json',
            success: function(subjects) {
                var html = '';
                if ($(subjects).size() > 0) {
                    subjectList = subjects;
                    for (var i in subjects) {
                        if ($.inArray(search_mod, enableStaffSbjType) != -1) {
                            html += genSubjectList(subjects[i], i, 'submitForm');
                        } else {
                            html += genSubjectList(subjects[i], i, 'searchResult');
                        }
                    }
                    //将搜索结果全部添加到左边并设定为之前选择好的职位
                    $(document).on('click', '#subjectList>li>a.avatar.h', function() {
                        $('#crtRelateSubjects li select').eq(0).attr('value', person_type)
                    });
                    setTimeout(function() {
                        
                            //目前多个结果的会全部添加上去然后字体加粗提醒
                            if ($('#subjectList>li>a.avatar.h').length > 1) {
                                $('#subjectList>li>a.avatar.h').each(function(e) {
                                    $(this).click();
                                    $('#crtRelateSubjects li p.title>a').eq(0).css('font-weight', 'bold');
                                })
                                $('.chitanda_person_dupe').append(`${subject_name} `);
                            } else {
                                $('#subjectList>li>a.avatar.h').click();
                            }
                        

                    }, 500)

                } else {
                    $("#robot").fadeIn(300);
                    $("#robot_balloon").html(`呜っ似乎没有找到${subject_name}的相关结果`);
                    $("#robot").animate({
                        opacity: 1
                    }, 1000).fadeOut(1000);
                    html = '';
                    $('.chitanda_person_not_found').append(subject_name + ' ');
                }
                $('#subjectList').html(html);
                $('.chitanda_current_idx').text(idx + 1);
                $('.chitanda_all_num').text(person_num);
                if (idx < person_num - 1) {
                    setTimeout(function() {
                        idx++;
                        ctd_findPersonFunc(person_list, person_type, idx)
                    }, 2500);
                } else {
                    setTimeout(function() {
                        $('#subjectList').empty();
                        $('#subjectList').show();
                        alert('全部添加完成');
                    }, 1500)
                }
            },
            error: function(msg) {
                var html = '';
                $("#robot").fadeIn(300);
                $("#robot_balloon").html('通信错误，您是不是重复查询太快了？');
                $("#robot").animate({
                    opacity: 1
                }, 1000).fadeOut(2000);
                $('#subjectList').html(html);
                ctd_findPersonFunc(person_list, person_type, idx);

            }
        });
    };

    var chitanda_MultiFindPersonFunc = function() {
        var person_type = $('.chitanda_person_type select').attr('value');
        if (person_type == -999) {
            alert('请先选择职位');
            return false;
        } else {
            $('#subjectList').hide();
            //目前仅支持,或者、作为分隔符
            var ctd_person_list = $('#subjectName').attr('value').split(/['\,、，\/]/);
            person_type = $('.chitanda_person_type select').attr('value');
            ctd_findPersonFunc(ctd_person_list, person_type, 0);
        }

    }




    $('.subjectListWrapper').after(`
                <div class="chitanda_person_not_found_wrapper">
                    <h3 style="margin: 10px 0">批量查询目前支持",，/、"作为分隔符。查询前请先选择职位</h3>
                    <div style="margin: 5px;padding:5px 0;    background: #eaf1f1">
                        <span class="chitanda_person_type" style="display: inline-block; margin: 5px 0"></span>
                        <input type="button" id="btn_ctd_multi_search" class="searchBtnL" value="批量查询" style="float: right;">
                    </div>
                    <div class="chitanda_progress" style="margin: 15px 0 ;font-size:20px;font-weight:bold;  color: #d346bb;">
                        添加进度：<span class="chitanda_current_idx">0</span>/<span class="chitanda_all_num">0</span>
                    </div>
                    <h3 style="margin: 10px 0;">下列人员未找到条目：</h3>
                    <div class="chitanda_person_not_found" style=" min-height:40px"></div>
                    <h3 style="margin: 10px 0">下列人员返回多个结果，请手动核查左边加粗条目去重：</h3>
                    <div class="chitanda_person_dupe"></div>

                </div>
                `);
    $('.chitanda_person_type').append(chiiLib.relations.genPrsnStaffList(-1));
    $('.chitanda_person_type select').prepend('<option value="-999"> </option>').attr('value', -999);
    $('#btn_ctd_multi_search').on('click', chitanda_MultiFindPersonFunc);




})