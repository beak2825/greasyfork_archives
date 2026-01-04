// ==UserScript==
// @name         应付答案2022华医公需课
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  2021华医公需课自动听课和自动考试脚本.华医的其它课程可以自动听课，但没有自动考试.
// @author       han2ee
// @include        http://cme*.91huayi.com/*
// @include        https://cme*.91huayi.com/*
// @run-at        document-start
// @grant   GM_xmlhttpRequest
// @grant   GM.setValue
// @grant   GM.getValue
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448969/%E5%BA%94%E4%BB%98%E7%AD%94%E6%A1%882022%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/448969/%E5%BA%94%E4%BB%98%E7%AD%94%E6%A1%882022%E5%8D%8E%E5%8C%BB%E5%85%AC%E9%9C%80%E8%AF%BE.meta.js
// ==/UserScript==
 
 
(function() {
    'use strict';
 
    const requestAsync = function(url, data) {
        // console.log(data);
        return new Promise((resolve, reject) => {
            var reportAJAX_Error = (rspObj) => {
                console.error (`Request error: ${data}`);
                reject(`Request => Error ${data}  RES ${rspObj.status}!  ${rspObj.statusText}`);
            }
 
            var processJSON_Response = (rspObj) => {
                if (rspObj.status != 200 && rspObj.status != 304) {
                    reportAJAX_Error (rspObj);
                } else {
                    resolve(rspObj.responseText);
                }
            };
            GM_xmlhttpRequest ( {
                method:         "GET",
                url:            url,
                timeout: 6000,
                headers: {
                    "Referer": document.location.href,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data:           data,
                // responseType:   "json",
                onload:         processJSON_Response,
                onabort:        reportAJAX_Error,
                onerror:        reportAJAX_Error,
                ontimeout:      reportAJAX_Error
            });
        });
    }
 
    const getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
 
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
 
            if (sParameterName[0] === sParam) {
                return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
        return false;
    };
 
    const findFirstLesson = function(studyImgArr) {
        if (studyImgArr) {
            for (let i = 0; i < studyImgArr.length; i++) {
                if (studyImgArr[i].src.endsWith("anniu_01a.gif")) {
                    return i;
                }
            }
        }
        return -1;
    }
    const nextLesson = async function(cwid) {
        let cid = await GM.getValue('cid');
        console.log("CID", cid);
        let hrefs = await GM.getValue(cid);
        for (let i = 0; i < hrefs.length - 1; i++) {
            if (hrefs[i].indexOf(cwid) != -1) {
                window.location = hrefs[i + 1];
            }
        }
    }
 
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
 
    const ANSWER_DICT = {
        // 科技创新现状与发展趋势
        '4d8f0f21-a500-4dea-971d-ad2d00e8f196' : ['gvQuestion_rbl_0_0_0'],
        'f1e74f27-c0c9-4db0-a710-ad2d00e8f196' : ['gvQuestion_rbl_0_0_0'],
        '931ae318-bf2e-4ccd-8190-ad2d00e8f196' : ['gvQuestion_rbl_0_0_0'],
        '6719c552-bf16-4111-acb5-ad2d00e8f196' : ['gvQuestion_rbl_0_0_0'],
        'eb0ecb02-b6dd-4d87-95f8-ad2d00e8f196' : ['1bbf2da1-f5ca-4dcb-ba6b-ad2e00bb3422', '5cdc4638-9d87-4c21-9edd-ad2e00bb3422'],
        '2c2ad625-6c97-49b9-b763-ad2d00e8f196' : ['gvQuestion_rbl_0_0_0'],
        'ce168b7f-1a36-40ba-ae81-ad2d00ff58e3' : ['4c7a52ac-ccf4-4c10-8c15-ad2e00be0a13', 'a8fb198d-ec7a-4777-bea6-ad2e00be0a13'],
        'baee2ed1-140d-4ecc-aba4-ad2d00ff58e3' : ['gvQuestion_rbl_0_3_0'],
        'feed2105-bb4b-42b3-ba5b-ad2d00ff58e3' : ['a00768d8-8c06-4411-932d-ad2e00bdbf42', '181c8e7a-28d7-4ad6-8395-ad2e00bdbf42'],
        '321a7b59-3c4d-4717-a7c9-ad2d00ff58e3' : ['3e4854ef-8e1a-4383-aca6-ad2e00bdeaab', 'ac0bc131-3bbc-42ec-b56a-ad2e00bdeaab'],
        '019ea052-3cd5-4307-b593-ad2d00ff58e3' : ['gvQuestion_rbl_0_0_0'],
        '3ce608c2-aeaa-412e-a7c2-ad2d00fc1ef8' : ['25bd1a55-851e-4dd8-81f6-ad2e00bdc848', '5a36cd31-b353-4c17-a41d-ad2e00bdc848', '20d59ec3-03f5-4681-995e-ad2e00bdc848'],
        '075a9616-0449-4945-918b-ad2d00fc1ef8' : ['9244ead2-2f04-4039-bdfc-ad2e00be211c', 'c1f63dcb-67bd-43ce-a7d6-ad2e00be211c'],
        '7b861782-2e3f-4bbe-a292-ad2d00fc1ef8' : ['gvQuestion_rbl_0_3_0'],
        '7f79db95-cacc-4e28-9208-ad2d00fc0c6b' : ['gvQuestion_rbl_0_1_0'],
        'c4d17528-de5a-4e6e-9565-ad2d00fc0c6b' : ['gvQuestion_rbl_0_3_0'],
        'cd1e7419-e5fb-49ee-b169-ad2d00fc0c6b' : ['191ee0f8-b7d9-4cac-8b47-ad2e00bf002a', 'ee9aaeeb-6697-442f-8a13-ad2e00bf002a'],
        'fea3522a-2625-45d6-b8c1-ad2d01229e06' : ['gvQuestion_rbl_0_0_0'],
        '3834591e-f193-4f49-8166-ad2d01229e06' : ['gvQuestion_rbl_0_0_0'],
        'ecabad40-9a14-4bb5-a0ee-ad2d01226753' : ['gvQuestion_rbl_0_0_0'],
        '7d2b66db-b46d-4ca7-a836-ad2d01229e06' : ['gvQuestion_rbl_0_1_0'],
        '3d3cc7d7-6f63-4f25-a9d8-ad2d01229e06' : ['gvQuestion_rbl_0_0_0'],
        '091759ca-1590-423c-9059-ad2d01229e06' : ['gvQuestion_rbl_0_0_0'],
        '9c25c406-fb9e-4f68-9f57-ad2d01229e06' : ['32bf0ffd-5fd7-4017-813b-ad2e00bb9efc', '6a3425da-c8c3-4cb6-94ec-ad2e00bb9efc'],
        'd57589d2-5760-41c5-9c60-ad2d010257b7' : ['gvQuestion_rbl_0_0_0'],
        '1b998761-153a-4322-9d79-ad2d010257b7' : ['gvQuestion_rbl_0_1_0'],
        'b8cf1e4f-45d9-479c-947a-ad2d010257b7' : ['gvQuestion_rbl_0_0_0'],
        '69546b9f-de6e-4d00-8c12-ad2d010257b7' : ['gvQuestion_rbl_0_0_0'],
        '5c82a9ac-840b-48f5-8c1a-ad2d010257b7' : ['gvQuestion_rbl_0_0_0'],
        '8baab50d-5f4e-4d96-a8a9-ad2d010257b7' : ['gvQuestion_rbl_0_0_0'],
        '174ca960-ea0e-4d12-a76b-ad2d010257b7' : ['7b305eb5-069d-4401-b1ca-ad2e00bbb251', '976b752e-9120-4c5d-99b8-ad2e00bbb251'],
        '76efd366-2b6d-4f69-9e96-ad2d00e8fd5e' : ['gvQuestion_rbl_0_0_0'],
        'b13165db-3c4b-454e-a0c9-ad2d00fc0044' : ['gvQuestion_rbl_0_0_0'],
 
        // 2021年公需课：人工智能发展与产业应用
        // '10a6800e-a299-4d6b-bfff-ad4201246c11' :
        '10a6800e-a299-4d6b-bfff-ad4201246c11' : ['b39ddc18-4760-43ec-b927-ad420119d5d3', '9c834d09-cd86-4d95-955c-ad420119d5d3', 'c13a4ace-054e-4268-ba0f-ad420119d5d3', '636f9f84-84b8-4d40-9701-ad420119d5d3'],
        'fc517205-1bce-456d-97ff-ad4201246c11' : ['f5e7cdb7-8567-4a7c-bccc-ad420119ed6c', 'b5a1e1e7-d8e3-4dd4-a1b2-ad420119ed6c'],
        '9fb9a54c-1f79-4133-baa3-ad4201246c11' : ['1b7f4e63-12c1-4d20-b59f-ad42011a0228', '173a1ffd-9e2a-45fc-8e3e-ad42011a0228'],
        'a6efe4a5-0c8c-4d65-ba17-ad4201246c11' : ['1d9f66b8-c995-4f4a-b9e7-ad42011a1cbb'],
        '9afc6815-935c-4fc5-83b9-ad4201246c11' : ['a7d3a93e-65f0-48d9-beb5-ad42011a356a', '4a35a4a5-b04b-4ac1-86a6-ad42011a356a', 'd9c8e888-f0bb-4788-bff8-ad42011a356a', '283ea1cc-b85c-4ee9-bc5f-ad42011a356a'],
        '60103e2d-4708-41f2-aedc-ad4201246c11' : ['229e3748-c0c9-411c-9b6e-ad42011a4be3', '61c831be-f950-4cbf-8618-ad42011a4be3'],
        '8962e670-1ca8-41a3-8ef5-ad4400965d0c' : ['782e6042-932b-4b29-9ba1-ad420118bc1b'],
        'feda0e56-5bd7-42ed-a122-ad4300ade7dc' : ['gvQuestion_rbl_0_0_0'],
        'bcc5a989-d837-4648-8798-ad4300ade7dc' : ['gvQuestion_rbl_0_0_0'],
        '4cd74e16-d8ec-452e-ad81-ad4300ade7dc' : ['5a95a7e1-0bce-40f5-8477-ad4300ab716a', 'fbd0d449-3b5d-4a7e-918e-ad4300ab716a'],
        'd6e2cb17-d96d-4cf1-985c-ad4300ade7dc' : ['gvQuestion_rbl_0_1_0'],
        'db973b6f-2938-47fa-b097-ad4300ade7dc' : ['gvQuestion_rbl_0_1_0'],
        '7f77df2c-fb90-473e-9aff-ad4300f36930' : ['gvQuestion_rbl_0_0_0'],
        '45fa76a0-f564-4ba3-aafc-ad4300f36930' : ['gvQuestion_rbl_0_0_0'],
        'b6ad40bb-d638-4d1a-8c4f-ad4300f38e8c' : ['gvQuestion_rbl_0_0_0'],
        '53a447f5-29f7-4856-a84d-ad4300f38e8c' : ['gvQuestion_rbl_0_0_0'],
        'ebcc3dd7-2324-4ef2-a3c8-ad4300f3b798' : ['gvQuestion_rbl_0_0_0'],
        '08f48580-5241-4e96-b16a-ad4300f3b798' : ['gvQuestion_rbl_0_0_0'],
        '9c66cde2-b872-4bfe-a53a-ad4300f3b798' : ['gvQuestion_rbl_0_0_0'],
        'dde1ec63-96d8-4019-a3fa-ad43010fa3de' : ['gvQuestion_rbl_0_0_0'],
        '0c3a22e2-9de0-4b6e-8aa3-ad43010fa3de' : ['gvQuestion_rbl_0_0_0'],
        '9b1475bd-3439-4c05-a27e-ad43010fa3de' : ['gvQuestion_rbl_0_0_0'],
        'c9946f00-5e9b-4bd9-9926-ad4400eee181' : ['gvQuestion_rbl_0_0_0'],
        'a7e754d8-81e3-4b64-a613-ad4400ac1b63' : ['gvQuestion_rbl_0_0_0'],
        'a8b3ff45-f512-4501-b7d7-ad4400ac1b63' : ['b141f1eb-d0ec-42b4-ae9d-ad4300a915c2', 'a5b349aa-8e67-4dc9-9a4f-ad4300a915c2'],
        'd1ef7668-f65f-4dce-850f-ad4300b26568' : ['gvQuestion_rbl_0_0_0'],
        'f35ce669-3cca-4f4c-9741-ad4300b26568' : ['gvQuestion_rbl_0_1_0'],
        '72a29604-de18-4235-baa8-ad4300b26568' : ['gvQuestion_rbl_0_0_0'],
        'fd2c49f0-8881-4d26-a867-ad4300b30118' : ['gvQuestion_rbl_0_1_0'],
        'af9b0742-d7da-427f-9261-ad4300b30118' : ['gvQuestion_rbl_0_0_0'],
        '60faac20-deed-424a-96bb-ad4300b30118' : ['gvQuestion_rbl_0_0_0'],
        '304aa47a-4eb6-469d-ae30-ad4300b30118' : ['7056439d-c579-413d-93c1-ad42010ed7c3', '816d6eb5-2d8f-43bb-9f7c-ad42010ed7c3'],
        '877082bc-56e6-4d1a-aef7-ad4300b30118' : ['gvQuestion_rbl_0_0_0'],
        '291910f7-39cc-4d82-9e12-ad4300b30118' : ['gvQuestion_rbl_0_0_0'],
        'd8b1be7d-2d6a-40fd-a705-ad4400965d0c' : ['gvQuestion_rbl_0_1_0'],
 
        // 2022年公需课：数字化转型与产业创新发展
        '9be362b6-2fde-4b75-9770-ae8e010d9ebc' : ['e30a7b94-22c4-4aed-915d-ae9101069f4d', '9ae2593a-86c7-471e-a19e-ae9101069f4d', 'c259883a-795e-409d-8a76-ae9101069f4d', 'edede8b6-2b43-4cd9-88ee-ae9101069f4d'],
        '5e2264e6-748f-428f-934d-ae8d0156fff9' : ['gvQuestion_rbl_0_0_0', 'gvQuestion_rbl_1_0_1'],
        '2f1f5ef1-8966-4c2e-acda-ae8d0156fff9' : ['bd12f879-af0c-4b42-b84b-ae8d0155ebc4', '207cf0bc-075d-4346-8f8f-ae8d0155ebc4', '1ef6971a-0ad1-4062-bbc8-ae8d0155ebc4', '5181c173-40c2-4f88-afbe-ae8d0155ebc4'],
        '48e195b0-1280-43f4-baa3-ae8d0156fff9' : ['7b64bd98-00e6-44a7-b016-ae8d01560092', 'e6d9ef3c-dfb5-463d-939c-ae8d01560092'],
        '4a67b92f-2df2-4eb4-bc7c-ae8d0156fff9' : ['6dd293d2-a118-4178-8ffa-ae8d01561540', '545b1dbc-96a6-4217-a37d-ae8d01561540', '7664d913-ef59-4f9c-ad85-ae8d01561540', 'a9da7058-77ff-4a42-95b8-ae8d01561540'],
        '89bafb6b-339d-4f3f-8d6a-ae8d01574de3' : ['3e960945-d795-4f93-9ad6-ae8d01563d30', '76ed21c2-ba60-44c1-9073-ae8d01563d30', '86d1d88c-259e-4b26-afc4-ae8d01563d30', 'f3c385f1-b6a3-41e9-9b77-ae8d01563d30', '58db967b-7c81-45c3-938f-ae8d01563d30'],
        'c393d570-f550-46da-813f-ae8d01574de3' : ['fb7d1bdc-d6e5-43ce-82d3-ae8d01565234', '4ec3ad76-f55a-4490-8e8e-ae8d01565234', 'b62fcf9f-1f3c-49ea-9c53-ae8d01565234', '1eba07d7-e438-48e1-93a2-ae8d01565234', 'a2afcc8a-1362-4eaf-b486-ae8d01565234'],
        'cfe8a18f-8140-4f60-ade6-ae8d01574de3' : ['e2d27318-eef4-4384-9ad0-ae8d015667b0', '68f433be-df2b-4c7c-8dc9-ae8d015667b0', '0f1939ff-2ff8-46f5-99c2-ae8d015667b0', '628faec8-10e0-412e-85b0-ae8d015667b0', '73c715c8-5a60-49b0-bf62-ae8d015667b0'],
        '07c0ebb0-6335-4670-af51-ae8e00d10831' : ['61d360d2-60ef-4d3c-9481-ae8e00cd1539', 'af885125-68ee-4d51-9c30-ae8e00cd1539', '41d33ba2-2ba6-4d9f-934e-ae8e00cd1539', 'd374868b-ae80-4e14-9646-ae8e00cd1539', 'ac01525b-a30b-4a93-ae8f-ae8e00cd1539'],
        'e5fc1168-b4bc-4c3c-acb8-ae8e00d11c0c' : ['eacc82e1-e18c-4694-9f0c-ae8e00cd36d4', 'c2614c25-c970-4ef0-b01e-ae8e00cd36d4', '81ec8bab-a921-4dc2-b480-ae8e00cd36d4', 'dd0a662f-cf41-416e-9b73-ae8e00cd36d4', 'a86413a8-12dc-43eb-b6e9-ae8e00cd36d4'],
        '4bd3ae92-2019-4171-893f-ae8e00d14c7e' : ['e25b0411-8e2a-4381-a641-ae8e00cd6c1f', '7699789a-21e9-487a-91ac-ae8e00cd6c1f', '4e87e3c0-4b8c-41ff-a747-ae8e00cd6c1f', 'f7c7432a-e4ab-45bb-acf5-ae8e00cd6c1f', '927b5568-c397-49e4-b6a3-ae8e00cd6c1f'],
        '733b3ee6-4523-4133-a587-ae8e00d12da6' : ['9570209a-7d72-4196-9cdd-ae8e00cd44f6', '7f2877ab-5ccd-499e-88b4-ae8e00cd44f6', 'db300601-d1d9-43ce-90cc-ae8e00cd44f6', '2dc50c1c-c93c-4a07-8c49-ae8e00cd44f6', '873f41a2-fea9-46e0-8950-ae8e00cd44f6'],
        'a0fbfba8-21a5-4b69-aa2d-ae8e00d15bc3' : ['7699789a-21e9-487a-91ac-ae8e00cd6c1f', '927b5568-c397-49e4-b6a3-ae8e00cd6c1f', '4e87e3c0-4b8c-41ff-a747-ae8e00cd6c1f', 'f7c7432a-e4ab-45bb-acf5-ae8e00cd6c1f', 'e25b0411-8e2a-4381-a641-ae8e00cd6c1f'],
        '4bd3ae92-2019-4171-893f-ae8e00d14c7e' : ['4e87e3c0-4b8c-41ff-a747-ae8e00cd6c1f', 'f7c7432a-e4ab-45bb-acf5-ae8e00cd6c1f', '7699789a-21e9-487a-91ac-ae8e00cd6c1f', 'e25b0411-8e2a-4381-a641-ae8e00cd6c1f', '927b5568-c397-49e4-b6a3-ae8e00cd6c1f'],
        'a0fbfba8-21a5-4b69-aa2d-ae8e00d15bc3' :  ['362223ea-90c1-4523-ae3d-ae9900d6472d', '217ec0f9-817a-4f07-a876-ae8e00cd7926', 'ea0325d3-ef6e-4e85-b5b3-ae8e00cd7926', '2f7cf20e-c909-4fc6-8af7-ae8e00cd7926', '34ca1744-d67d-41ea-9aa3-ae8e00cd7926'],
        'cb933f91-5e9c-43dc-a5af-ae8e00d16cf7' : ['680bd9e5-fa6f-4ed9-8ddf-ae8e00cd8a6b', '356b03f8-091c-4e06-8c83-ae8e00cd8a6b', '40a0bfde-55b8-4b52-9258-ae8e00cd8a6b', '08a8f83e-fc50-42f6-9c56-ae8e00cd8a6b', '661c431f-3722-4a43-87cb-ae8e00cd8a6b'],
        'aa9c36a6-a354-4100-a7fe-ae8e00d17d6f' : ['6da1af48-973c-4fda-8934-ae8e00cd96e7', 'a1af5bd7-a21a-49bd-84f3-ae8e00cd96e7', 'c9446df8-1fec-48da-b69a-ae8e00cd96e7', '86481652-1d05-4354-b6de-ae8e00cd96e7', '2c3e0c12-25d7-4f26-bb78-ae8e00cd96e7'],
        'bfaf6a4c-65f3-4976-96d2-ae8e00d18b9d' : ['5ca395d8-3eb6-4aa4-9d31-ae8e00cdb74e', 'ca7f6567-8343-4b52-94e9-ae8e00cdb74e', '7034818c-39d0-40a5-8937-ae8e00cdb74e', '6400d209-ffe8-4047-8a09-ae8e00cdb74e', 'ab7252d2-690b-4be8-a8b4-ae8e00cdb74e'],
        '959e45fd-38f7-45a9-9580-ae8e00d19a04' : ['486cffb6-f755-423a-94d1-ae8e00cdcc74', '1f8e571e-c6fb-4f9a-8309-ae8e00cdcc74', '0514f7de-4d63-41ca-99f5-ae8e00cdcc74', 'f353b9ef-ac88-4298-9d1b-ae8e00cdcc74', 'e9d24437-b537-4f54-815d-ae8e00cdcc74'],
        '8635cd07-ea7d-401a-938d-ae8e00d1b454' : ['75c8d375-95b1-46de-91ad-ae8e00cddaba', 'd79b0c83-c7fc-44c2-84b1-ae8e00cddaba', 'e36015e2-b878-4bcc-90c5-ae8e00cddaba', '78d7ffd2-c502-4902-84ee-ae8e00cddaba', '3c1a851a-de93-4068-b57c-ae8e00cddaba'],
        '9ac29ca4-e638-4a3d-bd31-ae8e00dd3ac2' : ['07e11bf1-8a80-4191-bf97-ae8e00a88a48', 'c6f1786f-2c17-4894-ad9c-ae8e00a88a48', '6630dbfc-2f1d-45fa-8d5c-ae8e00a88a48'],
        '0847dd0f-7c05-4a54-ab37-ae8e00dd5743' : ['506811d6-ace9-4699-bf4e-ae8e00a8aeb4', '09bcc6f9-b156-49d1-bcb9-ae8e00a8aeb4', '2e071359-f013-45e9-acf1-ae8e00a8aeb4', '629d01e0-b92a-4fd3-a6ab-ae8e00a8aeb4', 'bdd0c90b-698b-4c96-82a1-ae8e00a8aeb4'],
        '147e4ae3-a220-42ce-a0dc-ae8e00dd5743' : ['0f43e236-66bd-4a54-bdd4-ae8e00a8d67a', '65a19862-9ba9-4b9a-a17c-ae8e00a8d67a', '1d60ef8a-5f7d-4825-b4a7-ae8e00a8d67a', 'be2be44d-144d-4e85-85d0-ae8e00a8d67a', '05bd83cd-fc95-457f-85e9-ae8e00a8d67a'],
        'd7417530-b67b-4670-a6a2-ae8e00dd45f4' : ['3203af8d-3b2e-48fd-918e-ae8e00aa111f', '54713f61-cd0b-4074-8589-ae8e00a90c2d', 'd64b9e4b-cdc5-4235-8a7e-ae8e00a90c2d', 'bfec0e51-92a4-4556-9ba0-ae8e00a90c2d', '05f2ce00-df7a-47e2-af82-ae8e00a90c2d'],
        'b5b50fdb-20c4-4656-a044-ae8e00dd3ac2' : ['0268738d-1c2b-4152-b84f-ae8e00aa868c', '238834ff-b453-4a88-9e7a-ae8e00aa868c', 'c187fe9e-dfb2-4204-a843-ae8e00aa868c', '184cf364-6435-4cab-9a6a-ae8e00aa868c', 'a8333022-e00f-4d14-a74e-ae8e00aa868c'],
        '4cdd1cf3-e5e3-408b-b492-ae8e00dd5743' : ['fa0e9e45-2837-479d-874b-ae8e00aae4c1', '888c6fc2-6ada-4551-a6b4-ae8e00aae4c1', 'f510c9c8-5bfb-40a4-9e47-ae8e00aae4c1', '3d76546e-1637-4b25-a843-ae8e00aae4c1', 'c1324283-6238-40a2-a1f9-ae8e00aae4c1'],
        '1aab8e2a-2b9d-4eb2-830f-ae8e00dd2f09' : ['22f57e10-63b4-4d43-8501-ae8e00ab38ba', '5f1360bd-7f39-492c-b01d-ae8e00ab38ba', '34ab25b0-398c-4a2c-a947-ae8e00ab38ba', '313508d3-136b-447b-9593-ae8e00ab38ba', '65c6942c-268e-4944-9e17-ae8e00ab38ba'],
        '21049461-3e9a-4141-a7b1-ae8e00dd3ac2' : ['5df54db6-a9e9-46c4-9cce-ae8e00abd4b8', '903eeb4f-5003-46c2-80dd-ae8e00abd4b8'],
        '65d84ace-92db-4271-89a7-ae8e00dd5743' : ['6156d1fd-400d-4f99-af06-ae8e00abf7e6', 'b26e65d3-4d92-4ba4-8981-ae8e00abf7e6'],
        '0d7f78aa-2691-4517-a7ce-ae8e00dd2f09' : ['4330d7d8-5b01-4037-85bc-ae8e00ac192a', '6bafd402-830b-4a04-b4f1-ae8e00ac192a'],
        'b0bd1279-17d6-488a-a41a-ae8e00dd2f09' :  ['3a4d307f-ddd7-4837-b7d3-ae8e00ac360e', '3fa0cf7f-30f6-4318-8ae6-ae8e00ac50fe', '83e2fd2e-bf5b-41d9-8a2c-ae8e00ac360e', '6b792345-1113-4d6b-a8c0-ae8e00ac360e', 'a1d69a87-9251-485d-9b8e-ae8e00ac360e'],
        'a096a404-7859-4d39-bae7-ae8e00dd3ac2' : ['afd66da8-3069-4333-bdd9-ae8e00ac776e', 'f55552f7-385e-427a-bf7d-ae8e00ac89cd', '25e6d69f-6574-406b-9d3e-ae8e00ac776e'],
        '95f435ab-6e14-4082-8cb2-ae8e00dd2f09' : ['ca1b4718-03c3-485f-be00-ae8e00acd28f', 'a1dc0d42-1075-43ea-b41f-ae8e00acd28f', 'b4be1ed0-c5d2-421f-a651-ae8e00acd28f', '9f0b7cbe-606f-464f-ae7a-ae8e00acd28f', '4d1f562c-be1e-4367-87c8-ae8e00acd28f'],
        '8fcf83c5-78c2-4a9b-bee0-ae8e00dd2f09' : ['4a22d176-f334-4c99-b079-ae8e00ad2dfd', 'da50fbc1-bf86-4fac-94e7-ae8e00ad2dfd', '9f20ce42-b309-4f1e-9ae0-ae8e00ad4ad0', '5c5fcb23-f604-4d84-9ffc-ae8e00ad2dfd', 'b621b7d1-5c78-486c-9562-ae8e00ad2dfd'],
    };
 
    // intercept alert window
    if (getUrlParameter('cwid') ||　getUrlParameter('cid')) {
        let alrtScope;
        if (typeof unsafeWindow === "undefined") {
            alrtScope = window;
        } else {
            alrtScope = unsafeWindow;
        }
        alrtScope.alert = function (str) {
            console.log ("Greasemonkey intercepted alert: ", str);
        };
    }
    if (window.top !== window.self) {
        return;
    }
    // 单个课程页面
    if (window.location.pathname == '/course_ware/course_ware_polyv.aspx') {
        /*
        // 修改播放器init参数 倍速：'speed': true  可拖动'ban_seek': false
        let scriptIndex = 0;
        new MutationObserver(function(mutations) {
            // check at least two H1 exist using the extremely fast getElementsByTagName
            // which is faster than enumerating all the added nodes in mutations
            let scriptList = document.getElementsByTagName('script');
            if (scriptList.length > 10) {
                this.disconnect(); // disconnect the observer
            }
            for (; scriptIndex < scriptList.length; scriptIndex++) {
                let scriptEle = scriptList[scriptIndex];
                if (scriptEle.innerHTML && scriptEle.innerHTML.indexOf("'speed': false")) {
                    scriptEle.innerHTML = scriptEle.innerHTML.replace("'speed': false", "'speed': true").replace("'ban_seek': banSeek", "'ban_seek': false");
                    console.log("REPLACE");
                    this.disconnect();
                    break;
                }
            }
        }).observe(document, {childList: true, subtree: true});
        */
        // 拦截first,不让加载视频中间的问题
        let inter = setInterval(function() {
            try {
                if (first) {
                    first = false;
                    console.log("FIRST:", first);
                    clearInterval(inter);
                }
            } catch (err) {
                console.log(err);
            }
        }, 100);
        let initRateFlag = true;
        setInterval(async function() {
            if (!$("#jrks")[0].getAttribute('disabled')) { // finish lesson
                let cwid = getUrlParameter('cwid');
                if (ANSWER_DICT[cwid]) {
                    try {
                        let content = await requestAsync($("#jrks")[0].href, {});
                        if (content.indexOf("请进行课件观看学习完成后再进行考试") != -1) {
                            window.location.reload(); // 重听
                        } else {
                            window.location = $("#jrks")[0].href; // 跳到考试
                        }
                    } catch (err) {
                        console.error(err);
                    }
                } else { // jump to next
                    await nextLesson(cwid);
                }
            }
            if (initRateFlag) {
                let rate = await GM.getValue('rate', 1);
                if (player) {
                    player.changeRate(rate);
                    initRateFlag = false;
                }
            } else {
                await GM.setValue('rate', player.currentRate);
            }
        }, 3000);
    }
 
    // 考试页面
    if (window.location.pathname == '/pages/exam.aspx') {
        setInterval(async function() {
            let cwid = getUrlParameter('cwid');
            console.log("CWID:", cwid);
            let answer = ANSWER_DICT[cwid];
            if (answer) {
                for (let item of answer) {
                    if (item.startsWith('gvQuestion')){
                        $('#' + item).click();
                    } else {
                        $(`[value=${item}]`).click();
                    }
                }
                $('#btn_submit').click();
 
            }
        }, 3000);
    }
 
    // 考试结果页面
    if (window.location.pathname == '/pages/exam_result.aspx') {
        setInterval(async function() {
            let cwid = getUrlParameter('cwid');
            await nextLesson(cwid);
        }, 3000);
    }
    // 目录页面
    if (window.location.pathname == '/pages/course.aspx') {
        setInterval(async function() {
            // console.log("relocation: ", $(".course h3 a")[toStudyIndex].href);
            let hrefs = $(".course h3 a:first-child");
            let vals = [];
            for (let i = 0; i < hrefs.length; i++) {
                // if (hrefs[i].children[0].src.endsWith("anniu_01a.gif")) {
                vals.push(hrefs[i].href);
                // }
            }
            // console.log(vals);
            await GM.setValue(cid, vals);
            await GM.setValue('cid', cid);
        }, 3000);
    }
})();