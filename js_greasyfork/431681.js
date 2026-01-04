// ==UserScript==
// @name         ustc教务系统扩展脚本
// @namespace    jw.ustc.edu.cn enhanced
// @version      1.2.0
// @description  ustc教务系统扩展脚本，可自动导入评课社区评分，自动识别验证码等
// @author       John Paven
// @match        https://jw.ustc.edu.cn/*
// @include      https://jw.ustc.edu.cn/*
// @match        https://passport.ustc.edu.cn/*
// @include      https://passport.ustc.edu.cn/*
// @match        https://mail.ustc.edu.cn/
// @include      https://mail.ustc.edu.cn/
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @connect      www.icourse.club
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/431681/ustc%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%89%A9%E5%B1%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/431681/ustc%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%89%A9%E5%B1%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict'; 
    const args = {
        'username': 'PB00000000',
        'password': '00000000',
        'mail_username': 'ustc',
        'mail_password': 'ustc'
    };
    const params = {'maxlength_withteacher': 150, 'maxlength_withoutteacher': 100};
    const compare_numbers = [
        '00000001111110000000000001111111111000001000111111111111000000011111111111111000001111110000111111000011111000000111110000111110000001111100011111000000001111100111110000000011111001111100000000111110011111000000001111100111110000000011111001111100000000111110011111000000001111100111110000000011111000111110100001111100001111100000011111000011111100001111110000011111111111111000000011111111111100000000011111111110000000000011111110000000',
        '00000011111111000000000011111111110000000000111111111100000100001111111111000000000011100111110000001010000001111100000001000000011111000000000000000111110000000000000001111100000100000000011111000000000000000111110000000000000001111100000000000000011111000000000000000111110001000000000001111100000000000000011111000000000000000111110000000000000001111100000000001111111111111110000011111111111111100000111111111111111000001111111111111110',
        '00001111111110000000001111111111111000000011111111111111100000111111111111111000001111000001111111010010000000001111110000000000000001111100000000000000011111000000000000000111110000000000001011111100000000000001111110000000000000111111100000000000011111110000000000001111111000000000001111111100000000000111111110000000000011111111000000000001111111100000000000111111111111111100001111111111111111000011111111111111110000111111111111111100',
        '00000111111110000000010111111111111010000001111111111111000000011111111111111000000110000001111110000000000000001111100000000000000011111000000000000000111110000000000001011111000000000011111111110000000000111111110000000000001111111111000000000011111111111000000000000001111111000000000000000111110000000000000001111100001000000000011111000011100000011111110000111111111111111000001111111111111110000001111111111110000000000111111110000000',
        '00000000011111110000000000000111111100000000000011111111001000000001111111110000000000011101111100000000001111011111000000000111100111110000000001110001111100000000111101011111010000011110000111110100000111000001111100000011110000011111000001111000000111110000011100000001111100000111111111111111111001111111111111111110011111111111111111100111111111111111111000000000000111110000000000000001111100000000000000011111000000000000000111110000',
        '01011111111111110000000111111111111100000001111111111111000000011111111111110000000111110000000000000001111100000000000000011111000000000000000111111111110000000001111111111110000000011111111111110001000111111111111110000001110000011111110000010000000011111100000000000000011111000000000000010111110000000000000001111100001000000000111111000011100000011111100000111111111111111000001111111111111100000001111111111110000000000011111110000000',
        '00000001011111100000000000011111111110000000011111111111110000001111111111111100000011111100000111000001111100000000010000011111000000000000001111100111111000000011111111111111000000111111111111111000001111111111111111000011111100000111111000111110000000111110001111100000001111100011111000000011111000111110000000111110000111100000001111100001111100000111110000001111111111111110000001111111111110000000001111111111000000000000111111000000',
        '00111111111111111100001111111111111111000011111111111111110000111111111111111100000000001000111110000000000000001111100000000000000111111000000000000001111100000000000000111111000000000000001111100000000000000111111000000000000001111100000000000000111111000000000000001111100000000100000011111000000000000001111110000000000000011111000000000000001111110000000000000011111000000000000001111110000000000000011111000000000000001111110000000000',
        '00000001111111000001000001111111111100000000111111111111100000011111111111111100000111111000111111000001111100000111110000011111000001111100000111111000111111000000111111111111100000000111111111110000000001111111111100000101111111111111110000011111100001111100001111100000001111100011111000000011111000111110000000111110001111100000001111100011111100000111111000011111111111111100000111111111111111000000111111111111100000000001111111000000',
        '00000001111110000000000001111111111000000000111111111111000000011111111111111000000111110000011111000011111000000011110000111110000000111100001111100000001111100011111000000011111000111110000000111110001111110000011111100001111111111111111000001111111111111110000001111111111111100000001111110011111000000000000001111100000101000000011111000001110000011111100000011111111111111000000111111111111100000000111111111100000000000011111100000000'
    ];
    // add grades for "全校开课查询"
    $("tbody").on("click","td a", function() {
        $('.modal-title-nameEn').append('<h3 class = "point">评分加载中</h3>');
        var course_message = $(this).parent().parent().html().split('</td><td>');
        var course_teachers = course_message[8].split(',');
        var course_visited = []; 
        for (var page = 1; page < 10; page++) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://www.icourse.club/search/?page=" + page + "&term=&q=" + course_message[2],
                synchronous: true,
                onload: function(response) {
                    var response_text = response.responseText;
                    for (var teacher_id = 0; teacher_id < course_teachers.length; teacher_id++){
                        var teacher_exist = response_text.search(course_message[8].split(',')[teacher_id]);
                        if (teacher_exist > 0) {
                            var text_split = response_text.split(course_message[8].split(',')[teacher_id]);
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withteacher, text_split[text_id].length - 1);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.indexOf('/">') + 1);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + '&nbsp&nbsp&nbsp&nbsp评价人数:' + evaluate_number + '</h3>';                                        
                                                console.log(result);
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }

                                    }
                                });                                 
                            }
                        }
                        else if(teacher_exist == 0){
                            var text_split = response_text.split('/">' + course_message[2]);
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withoutteacher, text_split[text_id].length);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.length);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + "&nbsp&nbsp&nbsp&nbsp评价人数:" + evaluate_number + '</h3>';                                        
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }

                                    }
                                });                                 
                            }                            
                        }
                        else if($('.point').text().indexOf('评分加载中') != -1){
                            $('.point').text($('.point').text().concat('.'));
                        }                    
                    }
                }
            }); 
        }             
        if($('.point').text() == '评分加载中.........'){
            $('.point').text('暂无评价');
        }
    });
    // add grades for "已选所有课程"
    $("body").on("click","#selected-lessons tbody td span", function() {
        $('.modal-title-nameEn:first').append('<h3 class = "point">评分加载中</h3>');
        var course_message = $(this).parent().parent().html().split('</td><td>');
        var course_teachers = course_message[6].split(',');
        var course_visited = [];
        for (var page = 1; page < 10; page++) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://www.icourse.club/search/?page=" + page + "&term=&q=" + course_message[3],
                synchronous: true,
                onload: function(response) {
                    var response_text = response.responseText;
                    for (var teacher_id = 0; teacher_id < course_teachers.length; teacher_id++){
                        var teacher_exist = response_text.search(course_message[6].split(',')[teacher_id]);
                        if (teacher_exist > 0) {
                            var text_split = response_text.split(course_message[6].split(',')[teacher_id]);
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withteacher, text_split[text_id].length - 1);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.indexOf('/">') + 1);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + "&nbsp&nbsp&nbsp&nbsp评价人数:" + evaluate_number + '</h3>';                                        
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }

                                    }
                                });                                 
                            }
                        }
                        else if(teacher_exist == 0){
                            var text_split = response_text.split('/">' + course_message[3]);
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withoutteacher, text_split[text_id].length);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.length);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + "&nbsp&nbsp&nbsp&nbsp评价人数:" + evaluate_number + '</h3>';                                        
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }

                                    }
                                });                                 
                            }                            
                        }
                        else if($('.point').text().indexOf('评分加载中') != -1){
                            $('.point').text($('.point').text().concat('.'));
                        }                        
                    }    
                }
            }); 
        }             
        if($('.point').text() == '评分加载中.........'){
            $('.point').text('暂无评价');
        }
    });
    // add grades for "全校课程"
    $("body").on("click","#all-lessons tbody td span", function() {
        $('.modal-title-nameEn:first').append('<h3 class = "point">评分加载中</h3>');
        var course_message = $(this).parent().parent().html().split('</td><td>');
        var course_teachers = course_message[7].split(',');
        var course_visited = [];
        for (var page = 1; page < 10; page++) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://www.icourse.club/search/?page=" + page + "&term=&q=" + course_message[3],
                synchronous: true,
                onload: function(response) {
                    var response_text = response.responseText;
                    for (var teacher_id = 0; teacher_id < course_teachers.length; teacher_id++){
                        var teacher_exist = response_text.search(course_message[7].split(',')[teacher_id]);
                        if (teacher_exist > 0) {
                            var text_split = response_text.split(course_message[7].split(',')[teacher_id]);
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withteacher, text_split[text_id].length - 1);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.indexOf('/">') + 1);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + "&nbsp&nbsp&nbsp&nbsp评价人数:" + evaluate_number + '</h3>';                                        
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }

                                    }
                                });                                 
                            }
                        }
                        else if(teacher_exist == 0){
                            var text_split = response_text.split('/">' + course_message[3]);
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withoutteacher, text_split[text_id].length);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.length);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + "&nbsp&nbsp&nbsp&nbsp评价人数:" + evaluate_number + '</h3>';                                        
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }

                                    }
                                });                                 
                            }                            
                        }
                        else if($('.point').text().indexOf('评分加载中') != -1){
                            $('.point').text($('.point').text().concat('.'));
                        }                    
                    }

                }
            }); 
        }             
        if($('.point').text() == '评分加载中.........'){
            $('.point').text('暂无评价');
        }
    });
    // add grades for "推荐培养方案内课程"
    $("body").on("click","#modal-info-content tbody td span", function() {
        $('.modal-title-nameEn:first').append('<h3 class = "point">评分加载中</h3>');
        var course_message = $(this).parent().parent().html().split('</td><td>');
        var course_teachers = course_message[7].split('</span>')[0].split('<span>')[1].split(',');
        var course_visited = [];
        for (var page = 1; page < 10; page++) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://www.icourse.club/search/?page=" + page + "&term=&q=" + course_message[4],
                synchronous: true,
                onload: function(response) {
                    var response_text = response.responseText;
                    for (var teacher_id = 0; teacher_id < course_teachers.length; teacher_id++){
                        var teacher_exist = response_text.search(course_teachers[teacher_id]);
                        if (teacher_exist > 0) {
                            var text_split = response_text.split(course_teachers[teacher_id]);
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withteacher, text_split[text_id].length - 1);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.indexOf('/">') + 1);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + "&nbsp&nbsp&nbsp&nbsp评价人数:" + evaluate_number + '</h3>';                                        
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }
                                    }
                                });                                 
                            }
                        }
                        else if(teacher_exist == 0){
                            var text_split = response_text.split('/">' + course_message[3]);
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withoutteacher, text_split[text_id].length);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.length);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + "&nbsp&nbsp&nbsp&nbsp评价人数:" + evaluate_number + '</h3>';                                        
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }

                                    }
                                });                                 
                            }                            
                        }
                        else if($('.point').text().indexOf('评分加载中') != -1){
                            $('.point').text($('.point').text().concat('.'));
                        }                        
                    }
                }
            }); 
        }             
        if($('.point').text() == '评分加载中.........'){
            $('.point').text('暂无评价');
        }
    });
    // add grades for "我的课表"
    $("body").on("click","#lessons tbody td span", function() {
        $('.modal-title-nameEn:first').append('<h3 class = "point">评分加载中</h3>');
        var course_message = $(this).parent().parent().html().split('</td><td>');
        var course_teachers = course_message[8].split('(');
        var course_visited = [];    
        for (var page = 1; page < 10; page++) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://www.icourse.club/search/?page=" + page + "&term=&q=" + course_message[2],
                synchronous: true,
                onload: function(response) {
                    var response_text = response.responseText;
                    for (var teacher_id = 0; teacher_id < course_teachers.length - 1; teacher_id++){
                        var teacher_exist = response_text.search(course_teachers[teacher_id].split(')').pop());
                        if (teacher_exist > 0) {
                            var text_split = response_text.split(course_teachers[teacher_id].split(')').pop());
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withteacher, text_split[text_id].length - 1);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.indexOf('/">') + 1);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + "&nbsp&nbsp&nbsp&nbsp评价人数:" + evaluate_number + '</h3>';                                        
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }

                                    }
                                });                                 
                            }
                        }
                        else if(teacher_exist == 0){
                            var text_split = response_text.split('/">' + course_message[3]);
                            for (var text_id = 0; text_id < text_split.length - 1; text_id++){
                                var sub_text = text_split[text_id].substring(text_split[text_id].length - params.maxlength_withoutteacher, text_split[text_id].length);
                                var href_text = sub_text.substring(sub_text.indexOf('href') + 6, sub_text.length);
                                GM_xmlhttpRequest({
                                    method: "GET",
                                    url: "http://www.icourse.club" + href_text,
                                    synchronous: true,
                                    onload: function(response) {
                                        var endtext = response.responseText;
                                        var content1_endtext = endtext.indexOf('<span class="blue h3">');
                                        var content2_endtext = endtext.indexOf('</span><span class="h3 blue mobile">');
                                        var content3_endtext = endtext.indexOf('<span class="small grey align-bottom left-pd-sm desktop">');
                                        var course_name = endtext.substring(content1_endtext + 22, content2_endtext);
                                        var professor_name = endtext.substring(content2_endtext + 36, content3_endtext);
                                        professor_name = professor_name.substring(0, professor_name.indexOf('</span>'));
                                        if (course_visited.indexOf(course_name + professor_name) == -1){
                                            course_visited.push(course_name + professor_name);
                                            if (endtext.indexOf('暂无评价') == -1) {
                                                var course_grade = endtext.substring(endtext.indexOf('<span class="rl-pd-sm h4">') + 26, endtext.indexOf('</span><span class="rl-pd-sm text-muted">'));
                                                var evaluate_number = endtext.substring(endtext.indexOf('<span class="rl-pd-sm text-muted">(') + 35, endtext.indexOf('人评价'));
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp评分:' + course_grade + "&nbsp&nbsp&nbsp&nbsp评价人数:" + evaluate_number + '</h3>';                                        
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }
                                            else {
                                                var result = '<h3 class = "result">' + course_name + professor_name + '&nbsp&nbsp&nbsp&nbsp暂无评价</h3>';
                                                if($('.point').text().indexOf('评分加载中') != -1){
                                                    $('.point').html(result);                                               
                                                }
                                                else{
                                                    $('.modal-title-nameEn').append(result);
                                                }
                                            }                                        
                                        }

                                    }
                                });                                 
                            }                            
                        }
                        else if($('.point').text().indexOf('评分加载中') != -1){
                            $('.point').text($('.point').text().concat('.'));
                        }                        
                    }
                }
            }); 
        }                    
        if($('.point').text() == '评分加载中.........'){
            $('.point').text('暂无评价');
        }
    });
    // 自动识别验证码
    if(window.location.href.indexOf('passport.ustc.edu.cn') != -1){
        var img_LT = new Image(128, 32);
        img_LT.src = 'https://passport.ustc.edu.cn/validatecode.jsp?type=login';
        var canvas = document.createElement("canvas");
        canvas.style.backgroundColor = "white";
        var ctx = canvas.getContext("2d");
        img_LT.onload = () => {
            ctx.drawImage(img_LT, 0, 0);
            var imgdata = ctx.getImageData(0, 0, 128, 32).data;
            var green_average = 0;
            for(var j = 0;j < 128 * 32; j++){
                green_average += imgdata[4 * j + 1];
            }
            green_average /= (128 * 32);
            var numbers = ["", "", "", ""];
            for(var i = 4; i < 26; i++){
                for(var j = 26; j < 46; j++){
                    var pixel = imgdata[4 * (128 * i + j) + 1] > green_average ? '0' : '1';
                    numbers[0] += pixel;
                }
                for(var j = 47; j < 67; j++){
                    var pixel = imgdata[4 * (128 * i + j) + 1] > green_average ? '0' : '1';
                    numbers[1] += pixel;
                }  
                for(var j = 68; j < 88; j++){
                    var pixel = imgdata[4 * ( 128 * i + j) + 1] > green_average ? '0' : '1';
                    numbers[2] += pixel;
                }
                for(var j = 89; j < 109; j++){
                    var pixel = imgdata[4 * (128 * i + j) + 1] > green_average ? '0' : '1';
                    numbers[3] += pixel;
                }                             
            }
            var LT = "";
            for(var i = 0; i < 4; i++){
                var index = '0';
                var min_different = 440;
                for(var j = 0; j < 10; j++){
                    var different = 0;
                    for(var k = 0; k < 440; k++){
                        if(numbers[i].charAt(k) != compare_numbers[j].charAt(k)){
                            different += 1;
                        }
                    }
                    if(different < min_different){
                        min_different = different;
                        index = j + '';
                    }
                }
                LT += index;
            }
            if(args.username != 'PB00000000'){
                $('#username').val(args.username);
                $('#password').val(args.password);
                $('.group #validate').val(LT);
                $('#login').click();                
            }
            else{
                $('.group #validate').val(LT);
                $('#login').click();                   
            }
        }
    }
    // 网页版邮箱自动登录
    if(window.location.href.indexOf('mail.ustc.edu.cn') != -1){
        $('span:contains("mail.ustc.edu.cn")').click();
        if(args.mail_username != 'ustc'){
            $('#uid').val(args.mail_username);
            $('#password').val(args.mail_password);
        }
        $('#login_button').click();
    }
})();