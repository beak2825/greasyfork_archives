// ==UserScript==
// @name        bangumi-auto-relate-infobox
// @namespace   https://greasyfork.org/users/1203219
// @author      harutya
// @match       *://bgm.tv/subject/*/add_related/person
// @match       *://chii.in/subject/*/add_related/person
// @match       *://bangumi.tv/subject/*/add_related/person
// @match       *://bgm.tv/person/*
// @match       *://chii.in/person/*
// @match       *://bangumi.tv/person/*
// @exclude     /^https?://((bgm|bangumi)\.tv|chii\.in)/person/\d+/.*/
// @license     MIT
// @version     1.2.4
// @description 帮助 Bangumi 维基人自动关联 infobox 信息
// @downloadURL https://update.greasyfork.org/scripts/478607/bangumi-auto-relate-infobox.user.js
// @updateURL https://update.greasyfork.org/scripts/478607/bangumi-auto-relate-infobox.meta.js
// ==/UserScript==

(function () {

    'use strict';

    // 此 Map 用于处理：(1)查询不到; (2)人物原名为条目填写名称的子集，如原名：あきやま，条目填写：あきやまえんま
    let bgmIdMap = {
        "KADOKAWA": 19306
        , "斉藤壮馬": 14604
        , "週刊ビッグコミックスピリッツ": 7620
        , "あきやまえんま": 30863
    };

    // infobox 填写的人员字符串分割规则，自行按需修改
    const SPLIT_RULE = /[()\[\]{}（）<>《》「」『』【】+×·→/／、,，;；:：&＆\\]/;

    const FILTER_WORDS = ['CV:', 'CV\\.', 'feat\\.', '\\*'];

    let jobMap, infoMap, idxMap, failSet, staffSet, repeatSet, count, total;

    $('#columnCrtRelatedA .board').after(`
        <input type='button' id='autoRelate' class='inputBtn' value='自动关联' style='float:right; margin-bottom: 7px'/>
        <div id="TB_load" style="display: none;"><img src="/img/loadingAnimation.gif"></div>
    `);
    $('#autoRelate').on('click', autoRelate);

    $('li.mark.center').prepend(`<span class="collect action"><a id="addToMap" style="cursor:pointer" class="thickbox icon icon-m"><span class="ico ico_mark">&nbsp;</span><span class="title">&nbsp;${isCollect() ? "取消" : "加入"}关联</span></a></span>`).on('click', addIntoMap);

    let newPrsnName = localStorage.getItem('newPrsnName');
    if (newPrsnName) {
        $('#crt_name').val(newPrsnName);
        localStorage.removeItem('newPrsnName');
        $('#columnInSubjectA td').eq(1).append(`
            <label style='font-size: 14px; color: #333; margin:0px 3px'>快速查找</label>
            <a class='fastSearch' href='/subject_search/${encodeURIComponent(newPrsnName)}?cat=all&legacy=1'>Bangumi</a>
            <a class='fastSearch' href='https://www.google.com/search?q=${encodeURIComponent(newPrsnName)}'>Google</a>
        `);
        $('.fastSearch').attr('target', '_blank').css({ 'border': '1px solid #999', 'padding': '3px', 'font-size': '14px', 'margin-left': '3px' });
    }

    bindDblClickEvent();

    function autoRelate() {
        $('#autoRelate').prop('disabled', true);

        jobMap = new Map();
        crtTypeList.forEach(item => {
            if (item.cn && item.id) {
                jobMap.set(item.cn, item.id);
            }
        });

        mergeSubLi();

        idxMap = new Map();
        infoMap = new Map();
        $('#infobox li').each(function (idx) {
            let text = $(this).text();
            let job = text.slice(0, text.indexOf(':')).trim();
            let staffs = text.slice(text.indexOf(':') + 1).trim();
            if (jobMap.get(job) && staffs) {
                idxMap.set(jobMap.get(job), idx);
                infoMap.set(job, staffs);
            } else {
                $(this).css('text-decoration', 'line-through');
            }
        });

        staffSet = new Set();
        repeatSet = new Set();
        $('#crtRelateSubjects .clearit').each(function () {
            let job = $(this).find('select').val();
            let staff = $(this).find('.l').text();
            let id = $(this).find('.l').attr('href');
            staffSet.add(job + id.substr(id.lastIndexOf('/')));
            staffSet.has(job + staff) ? repeatSet.add(job + staff) : staffSet.add(job + staff);
        });

        count = 0;
        total = 0;
        failSet = new Set();
        bgmIdMap = getLastestMap();
        $('#infobox a').removeAttr('class href target').css('color', 'black').off('click');
        $('#TB_load').show();
        infoMap.forEach(function (staffs, job) {
            let arr = Array.from(new Set(staffs.replace(new RegExp(FILTER_WORDS.join('|'), 'g'), ',').split(SPLIT_RULE)));
            for (let i in arr) {
                let staff = arr[i].trim();
                if (staff) {
                    ++total;
                    setTimeout(function () {
                        crtRelate(jobMap.get(job), staff);
                    }, (i % 5 + 1) * 300);
                }
            }
        });

        if (total == 0) {
            $('#autoRelate').prop('disabled', false);
            $('#TB_load').hide();
            alertMsg('无可关联内容！');
        }
    }

    function crtRelate(job, staff) {
        $.ajax({
            type: "GET",
            url: '/json/search-person/' + encodeURIComponent(trans(staff)),
            dataType: 'json',
            success: function (res) {
                if (Object.keys(res).length) {
                    let related = false;
                    for (let id in res) {
                        if (staff.toLowerCase() === res[id].name.toLowerCase() || bgmIdMap[staff] == id) {
                            if (!staffSet.has(job + '/' + id)) {
                                staffSet.add(job + '/' + id);
                                staffSet.has(job + staff) ? repeatSet.add(job + staff) : staffSet.add(job + staff);

                                subjectList[id] = res[id];
                                addRelateSubject(id, 'searchResult');
                                $('#crtRelateSubjects select').eq(0).val(job);
                                addSbjListener();
                                colorSbjList();
                            }
                            related = true;
                        }
                    }
                    !related && colorInfobox(job, staff);
                } else {
                    colorInfobox(job, staff);
                }

                $('#autoRelate').val(`进度：${++count} / ${total}`);
                if (count == total) {
                    $('#autoRelate').prop('disabled', false);
                    $('#TB_load').hide();
                    $('.noExist').each(function () {
                        $(this).css('color', 'red').attr('href', '/person/new').attr('target', '_blank').on('click', function () {
                            localStorage.setItem('newPrsnName', $(this).text());
                        })
                    });
                    alertMsg('任务完成！' + (failSet.size ? '未匹配的内容已被标红了喵！' : '全都关联上了喵！')
                        + (repeatSet.size ? '</br><font color="red">有同名人物关联到同一职位，请去重喵！</font>' : ''));
                    repeatSet.size && $('#autoRelate').val(`重复：${repeatSet.size}`);
                }
            },
            error: function () {
                setTimeout(function () {
                    crtRelate(job, staff);
                }, 1500);
            }
        });
    }

    function trans(staff) {
        let id = bgmIdMap[staff];
        return id ? ('bgm_id=' + id) : staff;
    }

    function addSbjListener() {
        $('#crtRelateSubjects .rr').off('click').on('click', function () {
            let li = $(this).parents('li.clearit');
            let job = li.find('select').val();
            let staff = li.find('.l').text();
            let item = (job ? job : li.find('option[selected="true"]').val()) + staff;
            colorSbjList(item);
            li.remove();
        });
    }

    function colorInfobox(job, staff) {
        if (!failSet.has(job + staff)) {
            failSet.add(job + staff);
            let idx = idxMap.get(job);
            let html = $('#infobox li').eq(idx).html();
            $('#infobox li').eq(idx).html(html.replace(new RegExp(staff, 'g'), `<a class='noExist'>${staff}</a>`));
        }
    }

    function colorSbjList(item) {
        let map = new Map();
        $('#crtRelateSubjects .clearit').each(function (idx) {
            let job = $(this).find('select').val();
            let staff = $(this).find('.l').text();
            let key = job + staff;
            map.get(key) instanceof Array ? map.get(key).push(idx) : map.set(key, [idx]);

            if (!item) {
                let arr = map.get(key);
                let len = arr.length;
                if (len == 2) {
                    colorItem(arr[0], true);
                    colorItem(arr[1], true);
                } else if (len > 2) {
                    colorItem(arr[len - 1], true);
                }
            }
        });
        if (item && map.get(item).length == 2) {
            colorItem(map.get(item)[0]);
            colorItem(map.get(item)[1]);
            repeatSet.delete(item);
            $('#autoRelate').val(repeatSet.size ? '重复：' + repeatSet.size : '去重完成');
        }
    }

    function colorItem(idx, flag) {
        $('#crtRelateSubjects .clearit').eq(idx).css('background-color', flag ? '#eef4c9' : '');
    }

    function alertMsg(msg) {
        $("#robot_speech").html(msg);
        $("#robot").fadeIn(300).animate({ opacity: 1 }, 2000, () => { !repeatSet.size && $('#autoRelate').val('自动关联') }).fadeOut(500);
    }

    function addIntoMap() {
        let map = getLastestMap();
        let name = $('.nameSingle a').text();
        let id = $('.nameSingle a').attr('href');
        let title = $('#addToMap').find('.title');
        if (map[name]) {
            delete map[name];
            title.html('&nbsp;加入关联');
        } else {
            map[name] = +id.substr(id.lastIndexOf('/') + 1);
            title.html('&nbsp;取消关联');
        }
        localStorage.setItem('localPrsnMap', JSON.stringify(map));
    }

    function isCollect() {
        bgmIdMap = getLastestMap();
        let name = $('.nameSingle a').text();
        return bgmIdMap[name];
    }

    function getLastestMap() {
        let json = localStorage.getItem('localPrsnMap');
        try {
            let obj = JSON.parse(json);
            bgmIdMap = { ...bgmIdMap, ...obj };
        } catch (e) {
            localStorage.setItem('localPrsnMap', '{}');
        }
        return bgmIdMap;
    }

    function bindDblClickEvent() {
        $('#infobox li').not('.sub_container, .sub, .sub_section').each(function () {
            $(this).on('dblclick', function () {
                let job = $(this).find('.tip').text();
                let text = $(this).text().replace(job, '');
                $(this).html(`<span class="tip">${job}</span><textarea>${text}</textarea>`);

                let textarea = $(this).find('textarea');
                textarea.focus().on('blur', function () {
                    $(this).parent().html(`<span class="tip">${job}</span>${$(this).val()}`);
                }).on('input', function () {
                    this.style.height = this.scrollHeight + 'px';
                }).css({
                    width: '100%', boxSizing: 'border-box', minHeight: '30px'
                });
                textarea[0].style.height = textarea[0].scrollHeight + 'px';
            });
        });
    }

    function mergeSubLi() {
        let subLiArr = $('#infobox li.sub');
        if (!subLiArr.length) return;

        let mainLiArr = $('#infobox > li').not('.sub_container');
        let mainLiMap = new Map();
        mainLiArr.each(function () {
            let text = $(this).text();
            let job = text.slice(0, text.indexOf(':')).trim();
            mainLiMap.set(job, $(this));
        });

        subLiArr.each(function () {
            let job = $(this).find('span.tip').text().trim();
            let staff = $(this).contents().filter(function () {
                return this.nodeType === 3;
            }).text().trim();

            if (!job) return;

            if (mainLiMap.has(job)) {
                let mainLi = mainLiMap.get(job);
                let newStaff = mainLi.html() + "、" + staff;
                mainLi.html(newStaff);
            } else {
                let newLi = $(`<li class=""><span class="tip">${job}: </span>${staff}</li>`);
                $('#infobox > li').not('.sub_container').last().after(newLi);
                mainLiMap.set(job, newLi);
            }
        });

        $('#infobox li.sub').remove();
    }


})();