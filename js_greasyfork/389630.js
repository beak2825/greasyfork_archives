// ==UserScript==
// @name         SZUCourseRogue
// @namespace    https://github.com/zzilch/SZUCourseRogue
// @version      0.1
// @description  A script for SZU course selecting.
// @author       zzilch
// @match        http://210.39.12.30/xsxkapp/sys/xsxkapp/*default/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/389630/SZUCourseRogue.user.js
// @updateURL https://update.greasyfork.org/scripts/389630/SZUCourseRogue.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // infos
    var studentInfo = JSON.parse(sessionStorage['studentInfo'])
    console.log(`
    使用说明：（暂不支持状态保存和带实验课的课程）
    showData():显示当前待抢课程
    setDeltaTime(time):设置抢课间隔(ms)
    setData(tcId[,tcType]):设置待抢课程，tcId为教学班ID，tcType为课程类型，默认自动获取
    getTeachingClassCapacity(tcId):查询课程剩余位置
    rogueRepeatedly():开始抢课
    stopRogue():停止抢课
    `);

    // data
    var data = null;
    var deltaTime = 1000;
    var stop = true;

    function showData(){
        console.log('tcId: '+data[0]+', tcType: '+data[1]);
    }
    unsafeWindow.showData = showData

    function setDeltaTime(time) {
        deltaTime = Math.max(time, 0);
    }
    unsafeWindow.setDeltaTime = setDeltaTime;

    function setData(tcId, tcType) {
        if (tcType == null) tcType = sessionStorage.getItem("teachingClassType");
        data=[tcId,tcType];
    }
    unsafeWindow.setData = setData;

    // hooks

    // handlers
    async function getTeachingClassCapacity(tcId) {
        let currentBatch = JSON.parse(sessionStorage.getItem('currentBatch'));
        let batchCode = currentBatch.code;
        let resp = await queryTeachingClassCapacity(tcId, batchCode);
        let code = resp.code;
        if (code != null && code == '1') {
            let capacity = resp.data;
            if ( capacity.mainClassCapacity !== '0') {
                return parseInt(capacity.mainClassCapacity) - parseInt(capacity.mainElectiveNumber);
            } else {
                return parseInt(capacity.nonMainClassCapacity) - parseInt(capacity.nonMainElectiveNumber);
            }
        } else {
            return -1;
        }
    }
    unsafeWindow.getTeachingClassCapacity = getTeachingClassCapacity;

    function rogueRepeatedly() {
        async function rogueOnce(data) {
            if (stop) {
                clearInterval(interval);
                return;
            }
            let capacity = await getTeachingClassCapacity(data[0]);
            if (capacity > 0) {
                let addParam = buildAddVolunteerParam(data[0]);
                addParam.addParam = addParam.addParam.replace(/("teachingClassType":")(.*)("}})/,'$1'+data[1]+'$3');
                let resp = await addVolunteer(addParam);
                let code = resp.code;
                if (code != null && code == '1') {
                    clearInterval(interval);
                    console.log(data[0] + ': success');
                } else {
                    console.log(data[0] + ': fail, ' + resp.msg);
                }
            } else {
                console.log(data[0] + ': fail, capacity=' + capacity.toString());
            }
        }
        stop = false;
        var interval = setInterval(rogueOnce, deltaTime, data);
    }
    unsafeWindow.rogueRepeatedly = rogueRepeatedly;

    function stopRogue() {
        stop = true;
    }
    unsafeWindow.stopRogue = stopRogue;
})();