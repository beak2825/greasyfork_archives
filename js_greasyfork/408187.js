// ==UserScript==
// @name         BGM关联CV时返回角色的所有关联条目
// @namespace    chitanda
// @version      0.51
// @description  https://bgm.tv/group/topic/357972
// @author       chitanda
// @match        http*://bgm.tv/character/*/add_related/person/*
// @match        http*://bangumi.tv/character/*/add_related/person/*
// @match        http*://chii.in/character/*/add_related/person/*
// @connect      bgm.tv
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/408187/BGM%E5%85%B3%E8%81%94CV%E6%97%B6%E8%BF%94%E5%9B%9E%E8%A7%92%E8%89%B2%E7%9A%84%E6%89%80%E6%9C%89%E5%85%B3%E8%81%94%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/408187/BGM%E5%85%B3%E8%81%94CV%E6%97%B6%E8%BF%94%E5%9B%9E%E8%A7%92%E8%89%B2%E7%9A%84%E6%89%80%E6%9C%89%E5%85%B3%E8%81%94%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==
$(document).ready(function() {
    function htmlDecode(input) {
        var e = document.createElement('textarea');
        e.innerHTML = input;
        // handle case of empty input
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }

    var chitanda_findSubjectFunc = function() {
        var subject_name = $('#subjectName').attr('value');
        var user_spec_subId;
        if (subject_name.indexOf(',,,') > 0) {
            user_spec_subId = subject_name.split(',,,')[1];
            subject_name = subject_name.split(',,,')[0];
        }
        var params = new Object();
        $('#subjectList').html('<tr><td>正在检索中...</td></tr>');
        var search_mod = $('#sbjSearchMod').attr('value');

        let chitanda_subjectList = {};
        let chitanda_relatedSubArr = {};
        let chitanda_subTypeArr = ['book', 'anime', 'music', 'game', 'unkown', 'real'];
        let subjects;
        let chitanda_mainSubType = window.location.href.split('/').pop();

        //获取角色声优页面左边已关联条目列表
        let chitanda_relatedSub = $('#crtRelateSubjects li');
        chitanda_relatedSub.map((k, v) => {
            let chitanda_link = $(v).find('.title a').attr('href').split('/').pop();
            let chitanda_CV = $(v).find('.tip a').text();
            chitanda_relatedSubArr[chitanda_link] = chitanda_CV;
        })

        if (search_mod.split('-')[0] == 'cv_person') { params['character_id'] = character_id; }
        $.ajax({
            type: "GET",
            url: '/json/search-' + search_mod + '/' + encodeURIComponent(subject_name),
            data: params,
            dataType: 'json',
            success: function(subjects) {
                var html = '';
                GM_xmlhttpRequest({
                    method: 'get',
                    url: (user_spec_subId) ? `https://api.bgm.tv/subject/${user_spec_subId}` : `https://${window.location.host}/character/${character_id}`,
                    responseType: (user_spec_subId)?"json":'document',
                    onload: function(res) {
                        data=res.responseText;
                        if (user_spec_subId) {
                            data=JSON.parse(data)
                            let chitanda_subjectId = data.id;
                            let chitanda_subjectName = decodeURI(data.name);
                            let chitanda_subjectName_cn = decodeURI(data.name_cn);
                            let chitanda_subjectType = data.type;
                            let chitanda_imgUrl = data.images['grid'];
                            let chitanda_subjectTmp = `{"id": "${chitanda_subjectId}","name": "${chitanda_subjectName}","name_cn": "${chitanda_subjectName_cn}","type_id": "${chitanda_subjectType}","extra": [  "${chitanda_mainSubType}"],"img": "${chitanda_imgUrl}","url_mod": "subject"}`;
                            chitanda_subjectList[0] = JSON.parse(chitanda_subjectTmp.replace('  ', ''));

                        } else {
                            let subjectsBox = $(data).find('ul.browserList li.item');
                            // console.log(chitanda_relatedSubArr);
                            subjectsBox.map((k, v) => {
                                let chitanda_subjectId = $(v).find('a').attr('href').split('/').pop();
                                let chitanda_subjectName = $(v).find('h3').text().trim();
                                let chitanda_subjectName_cn = $(v).find('small').text().trim();
                                let chitanda_subjectType = $(v).find('h3 span').prop('classList')[1].split('_')[2];
                                let chitanda_imgUrl = $(v).find('img.cover').attr('src');
                                let chitanda_subjectTmp = `{"id": "${chitanda_subjectId}","name": "${chitanda_subjectName}","name_cn": "${chitanda_subjectName_cn}","type_id": "${chitanda_subjectType}","extra": [  "${chitanda_mainSubType}"],"img": "${chitanda_imgUrl}","url_mod": "subject"}`;

                                //判定关联类型，动画游戏等.否的话不会将该条目添加到对应类型里
                                if (chitanda_subTypeArr[chitanda_subjectType - 1] == chitanda_mainSubType) {
                                    chitanda_subjectList[k] = JSON.parse(chitanda_subjectTmp.replace('  ', ''));
                                }
                            })

                        }
                        if ($(subjects).size() > 0) {
                            // let subjects=temp1,chitanda_subjectList=temp2,chitanda_relatedSubArr=temp3;
                            for (let k in subjects) {
                                let chitanda_newSubjectList;
                                //js的object是值引用，如果不这样的话浅拷贝，会导致最后值一块儿变掉
                                chitanda_newSubjectList = JSON.parse(JSON.stringify(chitanda_subjectList));;
                                for (let i in chitanda_subjectList) {
                                    if (chitanda_relatedSubArr[chitanda_subjectList[i].id] == htmlDecode(subjects[k].name)) {
                                        delete chitanda_newSubjectList[i]
                                    }
                                }


                                subjects[k].relatSubjects = chitanda_newSubjectList;

                            }

                            subjectList = subjects;
                            for (var i in subjects) { if ($.inArray(search_mod, enableStaffSbjType) != -1) { html += genSubjectList(subjects[i], i, 'submitForm'); } else { html += genSubjectList(subjects[i], i, 'searchResult'); } }
                        } else {
                            $("#robot").fadeIn(300);
                            $("#robot_balloon").html('呜っ似乎没有找到相关结果');
                            $("#robot").animate({ opacity: 1 }, 1000).fadeOut(2000);
                            html = '';
                        }
                        $('#subjectList').html(html);


                    },
                    onerror: function(msg) {
                        $("#robot").fadeIn(300);
                        $("#robot_balloon").html('通信错误，您是不是重复查询太快了？');
                        $("#robot").animate({ opacity: 1 }, 1000).fadeOut(2000);
                    }
                })
            },


            error: function(msg) {
                var html = '';
                $("#robot").fadeIn(300);
                $("#robot_balloon").html('通信错误，您是不是重复查询太快了？');
                $("#robot").animate({ opacity: 1 }, 1000).fadeOut(2000);
                $('#subjectList').html(html);
            }
        });
    }


    let chitanda_events = {};
    let chitanda_st = setInterval(function() {
        chitanda_events = $._data($('#findSubject')[0], 'events');
        if (chitanda_events['click']) {
            $('#findSubject').off('click');
            $('#findSubject').on('click', chitanda_findSubjectFunc);
            $('#findSubject').css('font-weight', 'bold');
            clearInterval(chitanda_st)
        }
    }, 500)

})