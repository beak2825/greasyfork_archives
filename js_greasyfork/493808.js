// ==UserScript==
// @name         鸡毛侠model2
// @namespace    http://tampermonkey.net/
// @version      2024-04-29
// @description  多开助手!
// @author       linxiang.chen
// @match        https://kc.zhixueyun.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhixueyun.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493808/%E9%B8%A1%E6%AF%9B%E4%BE%A0model2.user.js
// @updateURL https://update.greasyfork.org/scripts/493808/%E9%B8%A1%E6%AF%9B%E4%BE%A0model2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var oldxhr = window.XMLHttpRequest
    var targetUrl = 'https://kc.zhixueyun.com/api/v1/system/rule-config/getkeys?keys=COURSE_COMPLETE_RULE%2CPREVENT_SCREENSHOT_CONFIG%2CCOURSE_STUDY_TIME_STATISTICS_RULE%2CANTI_BRUSH_COURSE_MECHANISM%2CRESOURCE_STUDY_CONFIG%2CONLINE_USER_NUMBER_CONTROL';
    function newobj() { }

    window.XMLHttpRequest = function () {
        let tagetobk = new newobj();
        tagetobk.oldxhr = new oldxhr();
        let handle = {
            get: function (target, prop, receiver) {
                if (prop === 'oldxhr') {
                    return Reflect.get(target, prop);
                }
                if (typeof Reflect.get(target.oldxhr, prop) === 'function') {
                    if (Reflect.get(target.oldxhr, prop + 'proxy') === undefined) {
                        target.oldxhr[prop + 'proxy'] = (...funcargs) => {
                            let result = target.oldxhr[prop].call(target.oldxhr, ...funcargs)
                            return result;
                        }


                    }
                    return Reflect.get(target.oldxhr, prop + 'proxy')
                }
                if (prop.indexOf('response') !== -1) {
                    if (target.oldxhr.responseURL && target.oldxhr.readyState == 4 && target.oldxhr.responseURL.startsWith(targetUrl)) {
                        return "{\"COURSE_STUDY_TIME_STATISTICS_RULE\":{\"companyName\":null,\"createTime\":null,\"desc\":\"课程学习时长统计规则\",\"id\":\"600731b2-db2d-4a71-a2ce-12a8288f9a9b\",\"key\":\"COURSE_STUDY_TIME_STATISTICS_RULE\",\"modifyDate\":1598076544000,\"organizationId\":\"f32e65d0-fe3b-40d3-a025-4480a1808746\",\"sequence\":75,\"status\":1,\"type\":2,\"value\":\"{\\\"courseCompletionRules\\\":\\\"5\\\",\\\"maximumLengthAvailable\\\":\\\"10\\\",\\\"maximumCumulativeLearningDuration\\\":\\\"48\\\",\\\"submitProgressIntervals\\\":\\\"300000\\\"}\"},\"COURSE_COMPLETE_RULE\":{\"companyName\":null,\"createTime\":null,\"desc\":\"音视频完成标准配置\",\"id\":\"789d9864-11e5-11ea-a77c-00163e133da6\",\"key\":\"COURSE_COMPLETE_RULE\",\"modifyDate\":1598076544000,\"organizationId\":\"f32e65d0-fe3b-40d3-a025-4480a1808746\",\"sequence\":668,\"status\":1,\"type\":2,\"value\":\"{\\\"TIME_PLAY\\\":\\\"0\\\",\\\"VIDEO_PALY_THRESHOLD\\\":\\\"80\\\",\\\"VIDEO_PROCESS_THRESHOLD\\\":\\\"80\\\"}\"},\"RESOURCE_STUDY_CONFIG\":{\"companyName\":null,\"createTime\":null,\"desc\":\"客户方能力配置\",\"id\":\"d85ee045-5658-11ea-a942-00163e133da6\",\"key\":\"RESOURCE_STUDY_CONFIG\",\"modifyDate\":1598076544000,\"organizationId\":\"f32e65d0-fe3b-40d3-a025-4480a1808746\",\"sequence\":670,\"status\":1,\"type\":2,\"value\":\"{\\\"platform\\\":\\\"3\\\",\\\"courseShowRule\\\":\\\"2\\\",\\\"specialShowRule\\\":\\\"1\\\",\\\"subjectShowRule\\\":\\\"2\\\",\\\"sysList\\\":\\\"https://r.zhixueyun.com/api/v1/content/resource/sync/list\\\",\\\"syncPageList\\\":\\\"https://r.zhixueyun.com/api/v1/content/resource/sync/page\\\",\\\"apikey\\\":\\\"57369e0bd5a41a713180bbb2bda62efa\\\",\\\"secret\\\":\\\"6405a9396f2805da92fbb37b0d3311e0\\\"}\"},\"ANTI_BRUSH_COURSE_MECHANISM\":{\"companyName\":null,\"createTime\":null,\"desc\":\"防刷课机制\",\"id\":\"41d3815c-e27b-4ee9-b55b-8dd71784ca63\",\"key\":\"ANTI_BRUSH_COURSE_MECHANISM\",\"modifyDate\":1598076544000,\"organizationId\":\"f32e65d0-fe3b-40d3-a025-4480a1808746\",\"sequence\":4,\"status\":1,\"type\":2,\"value\":\"{\\\"enableAuti\\\":\\\"0\\\",\\\"enableUnique\\\":\\\"0\\\",\\\"appEnableAuti\\\":\\\"0\\\",\\\"appAudio\\\":\\\"0\\\",\\\"pauseTime\\\":\\\"2\\\"}\"},\"PREVENT_SCREENSHOT_CONFIG\":{\"companyName\":null,\"createTime\":null,\"desc\":\"防录屏设置\",\"id\":\"d1d429fc-6e4d-4895-bd5a-6d1ce0e32d46\",\"key\":\"PREVENT_SCREENSHOT_CONFIG\",\"modifyDate\":1678099804000,\"organizationId\":\"f32e65d0-fe3b-40d3-a025-4480a1808746\",\"sequence\":181,\"status\":1,\"type\":2,\"value\":\"{\\\"enableCustom\\\":\\\"0\\\",\\\"customContent\\\":\\\"\\\",\\\"vedioMethod\\\":[],\\\"watermarkText\\\":\\\"\\\",\\\"file\\\":\\\"images/system/watermark-new.jpg\\\",\\\"opacity\\\":\\\"0\\\",\\\"appscreen\\\":\\\"2\\\",\\\"influence\\\":[]}\"}}"
                    } else {
                        return Reflect.get(target.oldxhr, prop)

                    }
                }
                return Reflect.get(target.oldxhr, prop);
            },
            set(target, prop, value) {
                return Reflect.set(target.oldxhr, prop, value);
            },
            has(target, key) {
                return Reflect.has(target.oldxhr, key);
            }
        }

        let ret = new Proxy(tagetobk, handle);

        return ret;
    }
})();