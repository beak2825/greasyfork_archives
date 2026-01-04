// ==UserScript==
// @name         EHall
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  获取 EHall 信息，目前已有：学生学籍图片搜索/学生信息模糊搜索/学生信息混合搜索/学生精确信息搜索/学生隐私信息搜索
// @author       c
// @match        http://ehall.szu.edu.cn/*
// @require      https://greasyfork.org/scripts/418193-coder-utils.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418735/EHall.user.js
// @updateURL https://update.greasyfork.org/scripts/418735/EHall.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /**
     * @brief 学生学籍图片搜索
     * @param {string} studentId 学生的学号或校园卡号
     */
    function imageSearch(studentId) {
        if (location.href.indexOf('/publicapp/sys/tycgyyxt') >= 0) {
            $.ajax({
                method: 'POST',
                url: `http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/sportVenue/getUserInfoById.do`,
                data: {
                    YGZH: studentId,
                },
            }).then(res => {
                let base64Img = res.userPic;
                if (!base64Img) {
                    console.warn('搜索不到图片');
                    return;
                };
                let name = res.itUser.name.$toPinyin(res.itUser.name).toLowerCase();
                let datetime = new Date().$format('yyyymmdd-HHMMSS');
                let imgName = `${name}-${studentId}-${datetime}.png`;
                base64Img.$toBase64Img(imgName);
            });
        } else {
            console.warn('请进入【体育场馆预约】页面调用该函数');
        };
    };
    /**
     * @brief 学生信息模糊搜索
     * @param {string} filter 筛选条件，支持多筛选条件，条件使用空格分隔，但首个条件必须为 [姓名|学号]，其他条件可以是 [性别|入学年份|学院]
     * @param {number} pageSize 搜索页数，默认为 1000
     * @param {number} pageNumber 搜索页码，默认从 1 开始
     */
    function fuzzySearch(filter, pageSize=1000, pageNumber=1) {
        ut.space.filter = filter;
        ut.space.pageSize = pageSize;
        ut.space.pageNumber = pageNumber;
        let filterSplit = filter.split(/\s+/);
        if (ut.space.pageNumber <= 1)
            delete ut.space.fuzzySearchResult;
        $.ajax({
            method: 'GET',
            url: 'http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/user/getAllTeacher.do',
            data: {
                SEARCHKEY: filterSplit[0],
                pageSize: ut.space.pageSize,
                pageNumber: ut.space.pageNumber,
                _: new Date().getTime(),
            },
            async: false,
        }).then(res => {
            let result = [];
            if (res.code === '0') {
                result = res.datas.data.rows;
                ut.space.totalSize = res.datas.data.totalSize;
                ut.space.fuzzySearchResult = ut.space.fuzzySearchResult || [];
                ut.space.fuzzySearchResult = ut.space.fuzzySearchResult.concat(result);
            };
            if (ut.space.fuzzySearchResult.length < ut.space.totalSize && res.code === '0') {
                ut.space.pageNumber += 1;
                fuzzySearch(ut.space.filter, ut.space.pageSize, ut.space.pageNumber);
            } else {
                filterSplit = ut.space.filter.split(/\s+/).slice(1);
                result = ut.space.fuzzySearchResult;
                let filterResult = [];
                for (let i = 0; i < result.length; i++) {
                    let person = result[i];
                    if (/^\d+$/.exec(person['id']) && person['deptName'] && person['sexName']) {
                        filterResult.push({
                            '姓名': person['XM'],
                            '学号': person['id'],
                            '学院': person['deptName'],
                            '性别': person['sexName'],
                        });
                    };
                };
                if (filterSplit.length > 0) {
                    function getFilterType(ft) {
                        if (ft.indexOf('学院') >= 0 || ft.indexOf('学部') >= 0)
                            return '学院';
                        if (['男', '女'].includes(ft))
                            return '性别';
                        if (ft.match(/^\d{4}$/))
                            return '年级';
                        if (ft.match(/^\d{5,}$/))
                            return '学号';
                        return '';
                    };
                    filterSplit.forEach(ft => {
                        let t = getFilterType(ft);
                        if (t === '学院')
                            filterResult = filterResult.filter(r => r[t].indexOf(ft) >= 0);
                        else if (t === '性别')
                            filterResult = filterResult.filter(r => r[t] === ft);
                        else if (t === '年级')
                            filterResult = filterResult.filter(r => r['学号'].slice(0, 4) === ft);
                        else if (t === '学号')
                            filterResult = filterResult.filter(r => r['学号'].indexOf(ft) >= 0);
                    });
                };
                ut.space.fuzzySearchResult = filterResult;
                if (ut.space.fuzzySearchResult.length > 0) {
                    ut.space.fuzzySearchResult = ut.space.fuzzySearchResult.$sorted('学号', true);
                    console.table(ut.space.fuzzySearchResult);
                    delete ut.space.pageSize;
                    delete ut.space.pageNumber;
                    delete ut.space.filter;
                    delete ut.space.totalSize;
                } else {
                    console.warn('没有搜索结果');
                };
            };
        });
    };
    /**
     * @brief 学生信息混合搜索
     * @param {string} filter 筛选条件，支持多筛选条件，条件使用空格分隔，但首个条件必须为 [姓名|学号]，其他条件可以是 [性别|入学年份|学院]
     * @param {number} pageSize 搜索页数，默认为 1000
     * @param {number} pageNumber 搜索页码，默认从 1 开始
     */
    function hybridSearch(filter, pageSize=1000, pageNumber=1) {
        EHall.fuzzySearch(filter, pageSize, pageNumber);
        if (ut.space.fuzzySearchResult.length > 0) {
            if (confirm('是否搜索到需要寻找的人？')) {
                let input = '0';
                if (ut.space.fuzzySearchResult.length > 1) {
                    input = prompt('请输入需要搜索的人的索引：');
                    while (!/^\d+$/.exec(input))
                        input = prompt('请输入正确的索引：');
                };
                let index = parseInt(input);
                let person = ut.space.fuzzySearchResult[index];
                EHall.imageSearch(person['学号']);
            };
        };
    };
    /**
     * @brief 学生精确信息搜索
     * @param {string} studentId 学生的学号或校园卡号
     */
    function preciseSearch(studentId) {
        if (location.href.indexOf('/publicapp/sys/tycgyyxt') >= 0) {
            $.ajax({
                method: 'POST',
                url: 'http://ehall.szu.edu.cn/publicapp/sys/tycgyyxt/sportVenue/getUserInfoById.do',
                data: {
                    YGZH: studentId,
                },
            }).then(res => {
                if (res.itUser.name) {
                    let rawInfo = res.itUser;
                    let info = {
                        '姓名': rawInfo['name'],
                        '性别': rawInfo['sexName'],
                        '学号': rawInfo['id'],
                        '年级': rawInfo['grade'],
                        '生日': rawInfo['birthday'] ? `${rawInfo['birthday'].slice(0, 4)}-${rawInfo['birthday'].slice(4, 6)}-${rawInfo['birthday'].slice(6, 8)}` : '',
                        '学院': rawInfo['academyName'],
                    };
                    console.log('查询结果如下：');
                    console.table(info);
                } else {
                    console.warn('查询学号失败');
                };
            });
        } else {
            console.warn('请进入【体育场馆预约】页面调用该函数');
        };
    };
    /**
     * @brief 学生隐私信息搜索
     * @param {string} studentId 学生的学号或校园卡号
     */
    function privateSearch(studentId) {
        if (location.href.indexOf('/jwapp/sys/ybysq') >= 0) {
            $.ajax({
                method: 'POST',
                url: 'http://ehall.szu.edu.cn/jwapp/sys/ybysq/modules/xlzpcj/cxxsxjxx.do',
                data: {
                    XH: studentId,
                },
            }).then(res => {
                if (res.code === '0') {
                    console.log(res);
                    let rawInfo = res.datas.cxxsxjxx.rows[0];
                    let info = {
                        '姓名': rawInfo['XM'],
                        '性别': rawInfo['XBDM_DISPLAY'],
                        '生日': rawInfo['CSRQ'] ? `${rawInfo['CSRQ'].slice(0, 4)}-${rawInfo['CSRQ'].slice(4, 6)}-${rawInfo['CSRQ'].slice(6, 8)}` : '',
                        '民族': rawInfo['MZDM_DISPLAY'],
                        '政治面貌': rawInfo['ZZMMDM_DISPLAY'],
                        '身份证': rawInfo['SFZJH'],
                        '电话': rawInfo['SJH'],
                        '地址': rawInfo['JTDZ'],
                        '学号': rawInfo['XH'],
                        '年级': rawInfo['XZNJ'],
                        '学院': rawInfo['YXDM_DISPLAY'],
                        '专业': rawInfo['ZYDM_DISPLAY'],
                        '班级': rawInfo['BJDM_DISPLAY'],
                        '高中': rawInfo['ZSZXMC'],
                        '高考考生号': rawInfo['KSH'],
                        '高考考生类型': rawInfo['KSLBDM'],
                        '高考分数': rawInfo['GKCJ'] ? rawInfo['GKCJ'] : '',
                    };
                    console.log('查询结果如下：');
                    console.table(info);
                } else {
                    console.warn('查询学号失败');
                };
            });
        } else {
            console.warn('请进入【预毕业申请】页面调用该函数');
        };
    };
    window.EHall = {
        imageSearch: imageSearch,
        fuzzySearch: fuzzySearch,
        hybridSearch: hybridSearch,
        preciseSearch: preciseSearch,
        privateSearch: privateSearch,
    };
})();