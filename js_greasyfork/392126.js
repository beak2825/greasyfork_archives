// ==UserScript==
// @name         显示云司塾视频链接
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在课程筛选页面/课程详情页显示视频下载链接,在视频课程结束后的测验页显示参考答案
// @author       coolwind2012
// @match        http*://cplatform.kingdee.com/templates/course/course_class.html
// @match        http*://cplatform.kingdee.com/templates/course/course_details.html?courseId=*
// @match        http*://cplatform.kingdee.com/templates/course/exam_formal.html?courseId=*
// @grant        GM_setClipboard
// @icon         http://cplatform.kingdee.com/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392126/%E6%98%BE%E7%A4%BA%E4%BA%91%E5%8F%B8%E5%A1%BE%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/392126/%E6%98%BE%E7%A4%BA%E4%BA%91%E5%8F%B8%E5%A1%BE%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const reg=/courseId=(\d+)/;
    // 详情页
    // http://cplatform.kingdee.com/templates/course/course_details.html?courseId=677
    if(location.href.indexOf('course_details')>-1){
        $('#course_details').bind('DOMSubtreeModified', function(e){
            if (e.target.innerHTML.length>0 && e.target.querySelector('#click_total')){
                $('#course_details').unbind('DOMSubtreeModified');
                const id = location.href.match(reg)[1];
                let btn_xuexi = $('#click_total')[0];
                $.get('http://cplatform.kingdee.com/queryByCourseIDAttach?id=' + id, function(res){
                    const tmp = document.createElement('a');
                    tmp.innerText = '下载本视频';
                    tmp.download = res.data.course.title;
                    tmp.href = res.rows[0].filePath;
                    tmp.oncontextmenu = function(e){
                        // 将视频的标题复制到剪切板，以便在保存视频文件时修改文件名称
                        GM_setClipboard(res.data.course.title, 'text');
                    };
                    tmp.href = tmp.href.substr(0, tmp.href.indexOf('snapshot')) + 'v.f20.mp4';
                    // 制作同样的按钮
                    const tmp2 = document.createElement('div');
                    tmp2.className = 'delfloat_xuee pull-left hidden-sm';
                    tmp2.style.position = 'relative';
                    tmp2.style.marginTop = '5vw';
                    tmp2.style.marginRight = '5vw';
                    tmp2.appendChild(tmp);
                    $(tmp2).insertAfter($('#click_total').parent());
                })
            }
        });
    }

    // 选课页
    if(location.href.indexOf('course_class')>-1){
        $('#course_class_fuzzy').bind('DOMSubtreeModified',function(e){
            // 加载课程列表时会先清空一次列表
            if(e.target.innerHTML.length === 0){
                setTimeout(function(){
                    $('#course_class_fuzzy>a').each( function(){
                        const id = this.href.match(reg)[1];
                        const tmp2 = this.querySelector('div p span');
                        $.get('http://cplatform.kingdee.com/queryByCourseIDAttach?id=' + id, function(res){
                            const tmp = document.createElement('a');
                            tmp.innerText = '   下载本视频';
                            tmp.style.color = 'blue';
                            tmp.className = 'ux';
                            tmp.oncontextmenu = function(e){
                                // 将视频的标题复制到剪切板，以便在保存视频文件时修改文件名称
                                GM_setClipboard(res.data.course.title, 'text');
                            };
                            tmp.download = res.data.course.title;
                            tmp.href = res.rows[0].filePath;
                            tmp.href = tmp.href.substr(0, tmp.href.indexOf('snapshot')) + 'v.f20.mp4';
                            $(tmp).insertAfter($(tmp2))
                        })
                    });
                }, 200)
            }
        });
    }
    //测验页
    if(location.href.indexOf('exam_formal')>-1){
        let preCount =0, count = 0;
        $('.col-xs-12').bind('DOMSubtreeModified', function(e){
            count++;
            setTimeout(function(){
                if(preCount !== count){
                    preCount = count;
                }else{
                    $('.col-xs-12').unbind('DOMSubtreeModified');
            $('.look_answer_exam').show();
                }
            },100);
        });
    }
})();