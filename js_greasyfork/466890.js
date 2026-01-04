// ==UserScript==
// @name         Epoint Project Library Get Url Params
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Epoint Project Library Get Url Params!
// @author       Sean
// @match        http://192.168.201.159:9999/webapp/pages/default/onlinecase.html*
// @match        http://192.168.118.60:9999/webapp/pages/caselib/create.html*
// @icon         http://192.168.201.159:9999/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466890/Epoint%20Project%20Library%20Get%20Url%20Params.user.js
// @updateURL https://update.greasyfork.org/scripts/466890/Epoint%20Project%20Library%20Get%20Url%20Params.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const businessType = [
        { Value: '7a20e23c-30b8-47e2-8d8d-f2691c9c63c4', Text: '政务服务' },
        { Value: 'c12150bb-b358-452f-87f0-8a2254df87cb', Text: '政务协同' },
        { Value: '3845804e-de68-421c-9402-7b238cfb5a70', Text: '大数据' },
        { Value: '3c28ee56-f24d-4843-b9a2-93e6b96264f4', Text: '电子交易' },
        { Value: '673b5918-51bc-4f1a-ab73-fca86e54d7d1', Text: '数字建设' },
        { Value: '6d9e7d84-7de3-4e0f-bd4f-ed4722ed25b5', Text: '建筑企业' },
        { Value: 'c22f8d2f-518d-4381-b88c-1da68536ed3a', Text: '公共安全' },
        { Value: 'c5810829-1b21-4b22-85cd-390b1edd9614', Text: '智能设备' },
        { Value: '080c7560-c261-428b-a45d-b86b57b47ffb', Text: '中央研究院' }
    ];

    const projectType = [
        { Value: 'dca44f63-be3f-4e9c-b78f-d786571c22c9', Text: '网站' },
        { Value: 'c7861460-163b-4060-80ec-d60604c50435', Text: '业务系统' },
        { Value: '49accc71-6f7d-43f3-b726-58decf58b6fa', Text: '智能设备' },
        { Value: '90209c65-1a55-4d8c-a836-2e5c6b834ada', Text: '大屏可视化' },
        { Value: 'fb0415fb-65ee-42c1-895a-dca042c2568e', Text: '中屏可视化' },
        { Value: '2b83f9b1-ec78-4819-a400-d7d49ea1ecc5', Text: '其他' }
    ];

    let $businesstype;
    let $projecttype;

    function getUrlParameters() {
        var params = {};
        var search = window.location.search.substring(1);
        var urlParams = search.split('&');

        for (var i = 0; i < urlParams.length; i++) {
            var param = urlParams[i].split('=');
            var paramName = decodeURIComponent(param[0]);
            var paramValue = decodeURIComponent(param[1] || '');
            params[paramName] = paramValue;
        }

        return params;
    }

    function initForm (params) {
        if(typeof params === 'object') {
            document.getElementsByName('Title')[0].value = params.projectName ? params.projectName : '';
            document.getElementsByName('KeyWords')[0].value = params.projectKeys ? params.projectKeys : '';
            document.getElementsByName('Entry')[0].value = params.entryUrl ? params.entryUrl : '';
            document.getElementsByName('SourceCode')[0].value = params.git ? params.git : '';
        }
    }

    let setSuccess = false;
    let setTimes = 5;

    function initSelect(params) {
        if(typeof params !== 'object') {
            return;
        }

        if(setTimes > 0 && !setSuccess) {
            setTimeout(()=> {
                setTimes--;

                businessType.forEach((item)=> {
                    if(params.projectBU) {
                        if(item.Text === params.projectBU.trim()) {
                            $businesstype.val(item.Value);
                        } else if( params.projectBU.trim() == '一网统管' || params.projectBU.trim() == '一网协同' || params.projectBU.trim() == '一网通办' ) {
                            $businesstype.val('7a20e23c-30b8-47e2-8d8d-f2691c9c63c4');
                        }
                        $businesstype.trigger("chosen:updated");
                    }
                });

                projectType.forEach((item)=> {
                    if(params.projectType && item.Text === params.projectType.trim()) {
                        $projecttype.val(item.Value);
                        $projecttype.trigger("chosen:updated");
                    }
                });

                setSuccess = true;

            }, 1000);
        } else {
            initSelect(params);
        }
    }

    window.onload = ()=> {
        const params = getUrlParameters();

        $businesstype = jQuery('#businesstype');
        $projecttype = jQuery('#projecttype');

        initForm(params);
        initSelect(params);
        console.log(jQuery.ajax);
    };
})();