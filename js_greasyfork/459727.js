// ==UserScript==
// @name         BGM批量关联制作人员
// @namespace    sjj118
// @version      2.0.0
// @license      MIT
// @description  https://bgm.tv/group/topic/362063
// @author       sjj118
// @include      /^https?://((bangumi|bgm)\.tv|chii\.in)/.*/add_related/person$/
// @connect      bgm.tv
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/459727/BGM%E6%89%B9%E9%87%8F%E5%85%B3%E8%81%94%E5%88%B6%E4%BD%9C%E4%BA%BA%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/459727/BGM%E6%89%B9%E9%87%8F%E5%85%B3%E8%81%94%E5%88%B6%E4%BD%9C%E4%BA%BA%E5%91%98.meta.js
// ==/UserScript==
(function() {
    console.log("BGM批量关联制作人员");
    GM_addStyle(".sjj118_person_name:hover { text-decoration: underline;}")
    function htmlDecode(input) {
        var e = document.createElement('textarea');
        e.innerHTML = input;
        // handle case of empty input
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    var find_person = function(person_list, person_type, idx) {
        let subject_name = person_list[idx];
        var person_num = person_list.length;
        var params = new Object();
        $('#subjectName').val(subject_name);
        $('#subjectList').html('<tr><td>正在检索中...</td></tr>');
        $('.sjj118_person_status > a').eq(idx).css('text-decoration', 'underline');
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
                var total = 0, matched = 0;
                var html = '';
                $('.sjj118_person_status > a').eq(idx).css('text-decoration', '');
                $('.sjj118_person_type select').attr('value',person_type);
                subjectList = subjects;
                for (var i in subjects) {
                    total++;
                    var temp;
                    if ($.inArray(search_mod, enableStaffSbjType) != -1) {
                        temp = genSubjectList(subjects[i], i, 'submitForm');
                    } else {
                        temp = genSubjectList(subjects[i], i, 'searchResult');
                    }
                    if (subjects[i].name == subject_name){
                        matched++;
                        temp = $(temp).addClass('sjj118_search_matched')[0].outerHTML;
                    }
                    html += temp;
                }
                $('#subjectList').html(html);
                if (matched == 1) {
                    $('#subjectList>li.sjj118_search_matched>a.avatar.h').click();
                    $('#crtRelateSubjects li select').eq(0).attr('value', person_type);
                    var target = $('#crtRelateSubjects li p.title a').eq(0);
                    $('.sjj118_person_status > a').click(function(){
                        target.css('color','').css('font-weight','');
                    });
                    $('.sjj118_person_status > a').eq(idx).click(function(){
                        target.css('color','green').css('font-weight','bold');
                        $('html,body').animate({scrollTop:target.offset().top - window.innerHeight/2}, 200);
                    });
                    $('.sjj118_person_status > a').eq(idx).css('color', 'green');
                } else if (total == 1){
                    var related = already_related[person_type];
                    if (related == null) related = [];
                    if (related.includes($('#subjectList>li>div.inner>p>a.avatar').text())) {
                        $('.sjj118_person_status > a').eq(idx).css('color', '#0084B4');
                    } else {
                        $('.sjj118_person_status > a').eq(idx).css('color', 'red');
                    }
                } else if (total == 0) {
                    $('.sjj118_person_status > a').eq(idx).css('color', 'grey');
                } else {
                    $('.sjj118_person_status > a').eq(idx).css('color', 'red');
                }
                $('.chitanda_current_idx').text(idx + 1);
                setTimeout(function() {
                    if (idx < person_num - 1) {
                        find_person(person_list, person_type, idx+1);
                    } else {
                        $('#subjectList').empty();
                        $('#subjectList').show();
                        $('#findSubject').show();
                        $('#subjectName').attr('disabled',false);
                        $('.sjj118_person_type select').attr('disabled',false);
                        $('#subjectName').val('');
                        $('.sjj118_split_symbol_wrapper').show();
                        $('#btn_ctd_multi_search').show();
                        $('.sjj118_person_status > a').each(function(){
                            if ($(this).attr('href')==null){
                                $(this).attr('href','javascript:void(0);').on('click', function(){search_person($(this).text());});
                            }
                        });
                    }
                }, 500);
            },
            error: function(msg) {
                var html = '';
                $('#ukagaka_shell .ui_10.shell_1').show();  // 兼容隐藏伪春菜组件
                $("#robot").fadeIn(300);
                $("#robot_balloon").html('通信错误，您是不是重复查询太快了？');
                $("#robot").animate({
                    opacity: 1
                }, 1000).fadeOut(2000);
                $('#subjectList').html(html);
                find_person(person_list, person_type, idx);
            }
        });
    };

    var search_person = function(name) {
        $('#subjectName').val(name);
        $('#findSubject').click();
    }

    var compute_person_list = function() {
        var split_symbols = $('#sjj118_split_symbols').val().split('');
        var symbol_regex = split_symbols.map(function(c){ return "\\"+c; }).join('');
        var split_regex = new RegExp("[" + symbol_regex +"]");
        var exclude_regex = eval($('#sjj118_exclude_regex').val());
        var ctd_person_list = $('#subjectName').attr('value').split(split_regex);
        ctd_person_list = ctd_person_list.map(function(name){return name.trim();});// 去除左右空格
        ctd_person_list = Array.from(new Set(ctd_person_list));// 去重
        ctd_person_list = ctd_person_list.filter(function(name){return name.length>0;});// 去除空值
        ctd_person_list = ctd_person_list.filter(function(name){return !name.match(exclude_regex);});
        return ctd_person_list;
    }

    var find_multi_person = function() {
        var person_type = $('.sjj118_person_type select').attr('value');
        if (person_type == -999) {
            alert('请先选择职位');
            return false;
        } else {
            //$('#subjectList').hide();
            $('#findSubject').hide();
            $('#subjectName').attr('disabled',true)
            $('.sjj118_person_type select').attr('disabled',true);
            $('.sjj118_split_symbol_wrapper').hide();
            $('#btn_ctd_multi_search').hide();
            $('.sjj118_progress').show();
            $('.sjj118_person_preview').empty();
            var person_list = compute_person_list();
            var related = already_related[person_type];
            if (related == null) related = [];
            person_list = person_list.filter(function(name) {return !related.includes(name);});
            $('.sjj118_person_status').html(person_list.map(function(name){
                return '<a class="sjj118_person_name" style="color:black">'+name+'</a>';
            }).join(" / "));
            $('.chitanda_all_num').text(person_list.length);
            find_person(person_list, person_type, 0);
        }
    }

    var get_already_related = function() {
        var type_staff = {};
        $('#crtRelateSubjects>li').each(function() {
            var person_type = $('select',this).val();
            if (type_staff[person_type] == null) type_staff[person_type] = [];
            type_staff[person_type].push($('p.title>a',this).text());
        });
        return type_staff;
    }

    var already_related = get_already_related();

    var show_person_list = function() {
        var person_list = compute_person_list();
        var person_type = $('.sjj118_person_type select').attr('value');
        var related = already_related[person_type];
        if (related == null) related = [];
        $('.sjj118_person_preview').html(person_list.map(function(name){
            var color = 'black';
            if (related.includes(name)) color = 'grey';
            return '<a class="sjj118_person_name" style="color:' + color + '">'+name+'</a>';
        }).join(" / "));
    }

    var person_type_map = {};
    $('option',genPrsnStaffList()).each(function() {
        var person_type = $(this).val();
        $(this).text().split(/\/|  /).forEach(function(type_name){
            type_name = type_name.trim();
            if (type_name.length > 0){
                if(person_type_map[type_name]!=null) console.debug('conflict: '+type_name+' / '+person_type_map[type_name]);
                person_type_map[type_name] = person_type;
            }
        })
    });
    //console.log(person_type_map);


    $('#subjectName').before(`
    <div class="sjj118_staff_search_wrapper">
        <div class="sjj118_progress" style="display: none;">
            <div class="chitanda_progress" style="margin: 15px 0 ;font-size:20px;font-weight:bold;  color: #d346bb;">
                添加进度：<span class="chitanda_current_idx">0</span>/<span class="chitanda_all_num">0</span>
            </div>
            <div class="sjj118_person_status"></div>
        </div>
        <div style="margin: 5px;padding:5px 0">
            <span class="sjj118_person_type" style="display: inline-block; margin: 5px 0"></span>
            <input type="button" id="btn_ctd_multi_search" class="searchBtnL" value="批量查询" style="float: right;">
        </div>
    </div>
    `);
    $('.subjectListWrapper').after(`
    <div class="sjj118_split_symbol_wrapper">
        <div style="margin: 5px">分隔符:
            <input type="text" id="sjj118_split_symbols" value="　/／\\＼、,，[]【】()（）{}「」|｜:：;；" class="textfield sjj118_change_person_list" style="width:235px;">
        </div>
        <div style="margin: 5px">排除项:
            <input type="text" id="sjj118_exclude_regex" value="/^(\\d+|CV|OP|ED)$/" class="textfield sjj118_change_person_list" style="width:235px;">
        </div>
        <div class="sjj118_person_preview"  style="margin: 15px 0"></div>
    </div>
    `);
    $('.sjj118_person_type').append(genPrsnStaffList(-1));
    $('.sjj118_person_type select').prepend('<option value="-999">请选择职位</option>').attr('value', -999);
    $('#btn_ctd_multi_search').on('click', find_multi_person);
    $(document).on('click', '#subjectList>li>a.avatar.h', function() {
        var person_type = $('.sjj118_person_type select').attr('value');
        if (person_type != -999){
            $('#crtRelateSubjects li select').eq(0).attr('value', person_type);
        }
    });
    $('#subjectName').addClass('sjj118_change_person_list');
    $('.sjj118_change_person_list').on('input', show_person_list);
    $('.sjj118_person_type select').on('change', show_person_list);

    $('#infobox>li').each(function() {
        var type_name = $('span.tip',this).text().split(':')[0];
        var person_type = person_type_map[type_name];
        if (person_type != null) {
            var temp = $(this).clone();
            $('span.tip',temp).remove();
            var person_list = temp.text();
            $('span.tip',this).html('<a href="javascript:void(0);" class="l">'+type_name+'</a>: ');
        }
    });
    $(document).on('click','#infobox>li>span.tip>a',function(){
        var person_type = person_type_map[$(this).text()];
        var temp = $(this).parent().parent().clone();
        $('span.tip',temp).remove();
        var person_list = temp.text();
        $('.sjj118_person_type select').attr('value',person_type);
        $('#subjectName').val(person_list);
        show_person_list();
        $('html,body').animate({scrollTop:$("#indexCatBox").offset().top - 100}, 200);
    })
})();