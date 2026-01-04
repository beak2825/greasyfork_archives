// ==UserScript==
// @name         CM Tools
// @namespace    https://cmtools.csez.zohocorpin.com*

// @version      0.1
// @description  CM TOOLS_DESC
// @author       You
// @match        https://cmtools.csez.zohocorpin.com*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453838/CM%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/453838/CM%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function test(){
        setTimeout(()=>{
            if($(".buildsHeader").length == 1){
                const queryParams = window.location.href.split("?")[1];
               var search = queryParams||'';
                if(search){
                    var queryObj = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
                    let { bName, isBuild, repoId, bType='FULLBUILD',email } = queryObj;
                    try{
                    email =  email || (JSON.parse(JSON.parse(cookieValues[2].split("=")[1])).Email).split("@")[0];
                    }catch(e){
                       alert("Sorry there is problem in Email Fetch");
                    }
                    if(bName && isBuild == "true"){
                          const headers = {
                                    "accept": "application/json, text/javascript, */*; q=0.01",
                                    "accept-language": "en-IN,en-US;q=0.9,en;q=0.8",
                                    "content-type": "application/json; charset=UTF-8",
                                    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                                    "sec-ch-ua-mobile": "?0",
                                    "sec-ch-ua-platform": "\"Windows\"",
                                    "sec-fetch-dest": "empty",
                                    "sec-fetch-mode": "cors",
                                    "sec-fetch-site": "same-origin",
                                    "x-csrf-token": CSRFToken,
                                    "x-requested-with": "XMLHttpRequest"
                                };
                          const params = {
                                headers,
                                "referrer": "https://cmtools.csez.zohocorpin.com/",
                                "referrerPolicy": "strict-origin-when-cross-origin",
                                "method": "POST",
                                "mode": "cors",
                                "credentials": "include"
                            };

                        if(repoId == '203'){
                            fetch("https://cmtools.csez.zohocorpin.com/api/v1/webhost/dependency_list?product_id=203&started_by=me", {
                                ...params,
                                "body": null,
                                "method": "GET"
                            }).then((res)=>{
                                if (res.ok) {
                                    return res.json();
                                }
                                throw new Error('Something went wrong');})
                                .then((resp)=>{
                                const { dependency_list } = resp;
                                const dependency_builds = {};
                                dependency_list.map(dependBuild =>{
                                    const { product_id, dependency_urls, value, ignore_default_option } = dependBuild;
                                    dependency_builds[product_id] = dependency_urls.length == 1 ? dependency_urls[0] : value
                                });
                                dependency_builds['203'] = "DEFAULT"
                                const body = JSON.parse(`{"buildlog":{"duration":null,"checkout_label":"Build name","build_label":null,"url":null,"comment":null,"status":"Start","availability":null,"report_needed":"false","static_version":"NA","deleted_date":null,"size":null,"build_type":"BuildType","started_from":"Webhost","env":null,"release_version":null,"location":null,"previous_buildlog_id":null,"milestones_buildlog_id":null,"customize_info":"IMPACT_NEEDED=NO,BUILD_TASKS=COMPLETE,BPM_JOB_ID=NA,CALLBACK_URL=NA,ACCEPTANCE_BUILD_NEEDED=NO,PATCH_BUILD_CHANGESET=NA","started_at":null,"completed_at":null,"deleted_at":null,"created_at":null,"dependency_builds":{"63":"http://build/framework/saslite/milestones/channel3/sas.zip","203":"DEFAULT","284":"http://build/framework/zohologserver/milestones/Channel2/logsclient.zip","466":"http://build/zoho/zohosecurity/milestones/M2_26_PATCH/ZOHOSECURITY_M2_26_12/ZohoSecurity.zip","547":"http://build/zoho/storehandler/milestones/Channel1/storehandler.zip","578":"http://build/zoho/zohowms_api/milestones/master/ZOHOWMS_API_M2_20_59/AdvWmsApiM19.zip","801":"http://build/zoho/ear/milestones/channel1/EncryptAgent.zip"},"subproduct_labels":{},"success_mail":"Email","error_mail":"Email","custom_prdurl":null,"security_report_needed":"false","selected":true,"product_id":"203","customer_id":null,"hacksaw_product_details":[],"thirdparty_dependencies":[]}}`)
                                body['buildlog']['build_type'] = bType;
                                body['buildlog']['checkout_label'] = bName;
                                body['buildlog']['dependency_builds'] = dependency_builds;
                                body['buildlog']['error_mail'] = email;
                                body['buildlog']['success_mail'] = email;
                                fetch("https://cmtools.csez.zohocorpin.com/api/v1/buildlogs", {
                                    ...params,
                                    "body": JSON.stringify(body)
                                });
                            });
                        }else if(repoId == '3082'){
                            fetch("https://cmtools.csez.zohocorpin.com/api/v1/buildlogs", {
                                ...params,
                                "body": "{\"buildlog\":{\"duration\":null,\"checkout_label\":\""+bName+"\",\"build_label\":null,\"url\":null,\"comment\":null,\"status\":\"Start\",\"availability\":null,\"report_needed\":\"false\",\"static_version\":null,\"deleted_date\":null,\"size\":null,\"build_type\":\""+bType+"\",\"started_from\":\"Webhost\",\"env\":null,\"release_version\":null,\"location\":null,\"previous_buildlog_id\":null,\"milestones_buildlog_id\":null,\"customize_info\":\"SourceMap_Needed=Yes,EFC_Needed=No\",\"started_at\":null,\"completed_at\":null,\"deleted_at\":null,\"created_at\":null,\"dependency_builds\":{},\"subproduct_labels\":{},\"success_mail\":\""+email+"\",\"error_mail\":\""+email+"\",\"custom_prdurl\":null,\"security_report_needed\":\"false\",\"selected\":true,\"product_id\":\"3082\",\"customer_id\":null,\"hacksaw_product_details\":[],\"thirdparty_dependencies\":[]}}",
                            });
                        }else if(repoId == '1148'){
                            fetch("https://cmtools.csez.zohocorpin.com/api/v1/buildlogs", {
                                ...params,
                                "body": "{\"buildlog\":{\"duration\":null,\"checkout_label\":\""+bName+"\",\"build_label\":null,\"url\":null,\"comment\":null,\"status\":\"Start\",\"availability\":null,\"report_needed\":\"false\",\"static_version\":null,\"deleted_date\":null,\"size\":null,\"build_type\":\""+bType+"\",\"started_from\":\"Webhost\",\"env\":null,\"release_version\":null,\"location\":null,\"previous_buildlog_id\":null,\"milestones_buildlog_id\":null,\"customize_info\":null,\"started_at\":null,\"completed_at\":null,\"deleted_at\":null,\"created_at\":null,\"dependency_builds\":{},\"subproduct_labels\":{},\"success_mail\":\""+email+"\",\"error_mail\":\""+email+"\",\"custom_prdurl\":null,\"security_report_needed\":\"false\",\"selected\":true,\"product_id\":\"1148\",\"customer_id\":null,\"hacksaw_product_details\":[],\"thirdparty_dependencies\":[]}}"
                            });
                        }
                    }
                }
            }else{
                test()
            }
        },2000)
    }
    test();
    // Your code here...
})();