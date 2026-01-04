// ==UserScript==
// @name         华医网带答案版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  2023华医公需课自动听课和自动考试脚本.华医的其它课程可以自动听课，但没有自动考试.
// @author       浩浩
// @include        http://cme*.91huayi.com/*
// @include        https://cme*.91huayi.com/*
// @run-at        document-start
// @grant   GM_xmlhttpRequest
// @grant   GM.setValue
// @grant   GM.getValue
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455076/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%B8%A6%E7%AD%94%E6%A1%88%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455076/%E5%8D%8E%E5%8C%BB%E7%BD%91%E5%B8%A6%E7%AD%94%E6%A1%88%E7%89%88.meta.js
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
       //2022选修课-院前四项技术操作规范
        'cb7e5f0c-6a69-4608-96f4-ab8f0094d2d1' : ['4fed913c-e4d6-4f7d-979a-ab8400f46c96', 'b7eefb30-3522-49db-9eb8-ab8400f46c96', '2865d315-ec63-490c-8285-ab8400f46c96', '80847c35-6623-4ad5-a7ee-ab8400f46c96', '59adcba6-0063-4ee1-94dd-ab8400f46c96'],
        '4b8a63b2-542e-4dac-8acf-ab8f0094d2d1' : ['0e61e567-c226-4823-ae21-ab84010c6462', 'f84732bf-1553-403b-94e8-ab84010c6462', '39c56783-8427-44a3-9dad-ab84010c6462', 'd7505202-06cc-4579-82b6-ab84010c6462', '58b668e6-83ff-444e-8e54-ab84010c6462'],
        'ffd16253-deeb-4f85-aaf9-ab8f0094d2d1' : ['d6711a78-5f66-4127-a898-ad9701225126', 'b726abe6-9e46-4364-9747-ad9701225126', 'f8e5617b-cf68-4c9e-9542-ad9701225126', '58b32826-a715-45be-a1e2-ad9701225126', 'dab21ece-dab1-474f-a62d-ad9701225126'],
        'b9065782-3393-408c-8bf6-ab8f0094d2d1' : ['0e4eae42-a7be-4295-adfc-ad9701223c90 ','c6d9f2a0-f937-4b29-a757-ad9701223c90', 'ef2fe1c1-e20c-45b5-84fb-ad9701223c90', 'fadb6d06-649a-4132-a225-ad9701223c90', '7859d2a1-e931-474e-8118-ad9800e99505'],
        'd97aea43-0d71-420f-8ad7-ac64010cbb70' : ['39629335-1294-41cf-9b45-610ed9cf3c40', '37578fa0-ab4c-4b9a-a0a3-6e5b138aa834', '9754a911-f013-4aca-b392-f9242e1dcccc', 'eda2bc6c-832b-4ca0-a158-3c5a1f5b57b2', '60beb477-12df-489b-8ab0-182fa99448fa'],

        //2022选修课-老年常见疾病与膳食营养
        'c6753f20-4016-4ce1-bdf3-ab420130e273' : ['50672e94-ba24-4719-99fe-ad9800ae9733', '273766cf-2648-4025-a417-ad9800ae9733', '5cfaa502-2574-4639-9e20-ad9800ae9733', '3947e826-b039-4a56-b181-ad9800ae9733', '91bf7362-d35c-4d5e-9029-ad9800ae9733'],
        '5b4d8e3c-eb79-44e3-9471-ab420130fc8e' : ['1e1e2041-f52a-4005-b7d2-ad9800b7fad3', 'd57e3b87-6bfc-48cd-8a98-ad9800b7fad3', 'e807ca3d-ed19-4b6c-9057-ad9800b7fad3', 'e19e8d74-e8d4-4cf9-866c-ad9800b7fad3', 'defd5793-b723-470f-a445-ad9800b7fad3'],
        'c808b37a-c3ca-4e2b-8b3e-ab4201310aa5' : ['f1b458ab-c6f7-42e3-808b-ad9800b975ca', '63b14b28-2d65-4e7b-a478-ad9800b975ca', '2d80136f-302d-4d4a-824a-ad9800b975ca', '0ac19377-6faf-4074-80ea-ad9800b975ca', 'c7ba94ab-c940-4b72-94fd-ad9800b975ca'],
        '83b62318-e045-4d81-b3dd-ab42013119e1' : ['ee986e7a-b7d4-44c6-ac55-ad9800b9900b', '30a5f388-943b-4344-a619-ad9800b9900b', 'cd50a55f-6939-4918-9e56-ad9800b9900b', 'dc572004-37a5-4eb7-ae7c-ad9800b9900b', '830f26d8-cbc1-4ba2-ad4d-ad9800b9900b'],

        //2022选修课-如何提升社区医务人员健康教育的科学性和艺术性
        'e24d1739-0250-42ba-8b50-ab4500b2d16b' : ['e27e343d-be47-41a5-8cfb-aecb00aedaef', 'd3bed994-93cd-4218-81b3-ab37011fc805', 'bcdd8758-735d-4635-9e89-ab37011fc805', '46ad5033-9de8-42ea-ad43-aecb00aa433c', '880f0c8a-ce7e-4b6c-9ad9-aecb00ae0361'],
        '40449861-c21c-4391-afc7-ab4500b2d16b' : ['3c75c8e0-33d1-43e4-9019-ab3701203e1b', '72552832-ae54-4d07-ba34-ab3701203e1b', '1cb69bfa-fa7b-488f-b5e8-ab3701203e1b', 'b00ce925-8dd2-459b-8469-ab3701203e1b', 'a22b2fb5-061e-4339-b197-ab3701203e1b'],
        '3b34684f-1726-4aff-81ba-ab9200b96611' : ['b9924652-7686-4dc4-9581-ab37011f92eb', 'be5af7a2-b11a-4f47-8383-ab37011f92eb', 'a413ed53-d237-4eff-869d-ab37011f92eb', 'd6848a7e-c627-4d5b-8ba0-ab37011f92eb', '3b25694a-f711-4a62-a629-ab37011f92eb'],
        '8c2a205a-ffca-48a0-a45f-ab4501315320' : ['a454352d-b70d-44f1-b5a4-a86c00fec946', 'cebd757b-786a-4a77-afe2-a86c00fec946', 'e502de4e-adf5-4002-8f9d-a86c00fec946', '8fd22dde-46e9-4dbf-89d9-a86c00fec946', '2a1379c6-453e-41fd-88c6-a86c00fec946'],

      //2023年选修课-医务人员职业风险与防护
        'b1757898-c286-4315-b2bd-aeee01591ebd' : ['1c93ce77-e46a-475f-8247-ac7000bd3b27', '7fe12f2e-e94c-4544-96e7-aeda01250dbb', '99fe5466-533f-4305-b4d4-ac7000bd3b27', '7607006e-77df-4ef1-98f7-ac7000bd3b27', '654ab305-fa12-4176-bd4a-ac7000bd3b27'],
        'a9223186-10be-4665-94af-aeee01591ebd' : ['4189d50f-5bb7-4792-954f-ac7000d993f0', '098fed89-f95e-4d5b-a09f-ac7000d993f0', '2024f962-a21a-4f40-a74b-ac7000d993f0', '524ea3c3-b4ef-44b8-941f-ac7000d993f0', 'd6aba550-5f11-4adf-9d57-acf700bbf1ef'],
        '6a05d24b-bd68-4497-997d-aeee01591ebd' : ['63230b11-1a28-4a02-9de6-acf700bd7c94', '575cdccf-d985-4f9b-b44a-aed800a41834', 'b95549d1-4ef7-4d17-8545-ac7000dd6321', 'cf7f1138-0e38-4e06-a860-ac7000dd6321', '279e5c3f-3a40-433f-9850-ac7000dd6321'],
        'a7883d75-c69a-4d0f-9627-aeee01591ebd' : ['e0242499-4972-4e63-8753-aed10122e3f6', '07680629-3b47-44f8-97f9-aed10121bdf8', 'e2527dd5-59e2-486f-a65f-aa1d01069cea', 'e726765f-baaf-41f9-82be-aa1d01069cea', '30d0fe0f-bea9-41b4-ac19-aa1d01069cea'],
        '2c609f19-c226-43f0-9226-aeee01591ebd' : ['d4d6f34d-3c85-43ff-a053-ac2801079fff', '831aa63d-f0d5-45a2-87f1-aed900a7d876', 'b7fd3e66-3b1c-4b85-83d2-ac2801079fff', '271d21ad-c65c-4a86-a130-aed900a7d876', '003f2e95-5e00-4a7e-b808-ac2801079fff'],

        //2023年选修课-急诊胸痛的诊断思维与处理
        '557e9a83-5832-41f0-8a4a-aeee01591ebd' : ['3ca7bdc0-47e5-40c5-afdf-acc500a98eb0', '5ee7cd13-e1d5-4032-84c5-acc500a98eb0', '9fff7e8f-634d-4a75-b37e-acc500a98eb0', '34271c3b-79d2-4368-92b7-acc500a98eb0', 'e5bb9000-e3b2-4b2a-824a-acc500a98eb0'],
        '074f8946-cc38-4b43-9893-aeee01591ebd' : ['42ef400d-34c0-47fc-8c0d-acc500aacb1a', '909ee3cd-c80a-4456-9f29-acc500aacb1a', '2d00d436-55a9-4763-b74e-acc500aacb1a', '57bbd376-8419-481d-be0d-acc500aacb1a', '5f725eea-84ff-4fde-82cd-acc500aacb1a'],
        'b35c9bf8-d798-43af-9fc6-aeee01591ebd' : ['bbbf55c7-51f6-4c41-ad70-acc500ac2cc6', '6e7e3aa4-f2ab-4947-8e39-acc500ac2cc6', '28673135-30f4-40bd-be9a-acc500ac2cc6', '8fddfad1-7a5e-4462-bdfa-acc500ac2cc6', '345f92de-12d5-48fe-8da3-acc500ac2cc6'],
        '4fd721a5-b21b-42a0-9368-aeee01591ebd' : ['c1bdc350-adb9-42be-9ee2-acc500ad238a', 'eabf366c-2587-4ec3-b4bc-acc500ad238a', '21c60f3b-2424-40e4-bdb0-acc500ad238a', 'c31f0fc3-224a-4844-b355-acc500ad238a', '99ed6ba4-7c10-46a0-abad-acc500ad238a'],
        '77581048-14eb-4d28-93eb-aeee01591ebd' : ['f4cc1bd6-d666-40ef-9bc9-acc500ae4838', 'e48642f7-f889-42a2-a76e-acc500ae4838', 'd1ddbbaf-7a1f-4f9b-a2d7-acfd009c743f', '9d89e91e-866d-4a96-b3be-acc500ae4838', '92c406bf-f622-4c77-a1ff-acfd009cb3c9'],

        //2023年选修课-突发中毒事件卫生应急处置人员防护导则
         '63e6a14d-3b07-4278-872b-aeee01591ebd' : ['1d7325ec-3685-4729-af35-f68fe8deab57', '06772964-1c46-443a-a563-6b07b0a39511', '86d5a189-947f-4ea7-be4e-5270141dbdec', '2fee8c3c-a2ba-4b9b-a687-363daefb2979', '27441972-6adf-49b6-9748-c53f7c0e8955'],
         'cafbba44-041a-4c33-a6d6-aeee01591ebd' : ['978fb8d7-b7d3-4d4b-a0cd-ad6c00f08623', '179429a8-9b51-4d3e-9bb6-ad6c00f08623', '7efb9aef-8649-4a11-b032-ad6c00f08623', '8b039ce1-4edd-4d14-980b-ad6c00f08623', 'c4424aa0-c04b-43aa-884b-ad6c00f08623'],
         'a0ef06a6-f1b7-4aa7-9ad2-aeee01591ebd' : ['1ac259cf-730b-43ae-9fa7-ad6c00f40764', '28737f71-d79e-4848-ba15-ad6c00f40764', 'a50daff6-ed20-4fdc-b48b-ad6c00f12250', 'e928fe97-5b13-4dcb-abad-ad6c00f40764', '54d09b7f-0432-4947-a9b8-ad6c00f12250'],
         '0d01310e-95c1-4466-9d9d-aeee01591ebd' : ['9cc757e0-bd75-4a8e-a91d-ad6c00f434fb', '02d806e8-6ce5-4e6b-9ad0-ad6c00f434fb', 'c07fc950-d2a4-434d-a2cb-ad6c00f0b5d0', 'a9ec87d7-d03c-4d0d-b6ae-ad6c00f434fb', 'c84a0b68-1969-4633-9a27-ad6c00f0b5d0'],
         '856879e5-ab99-46e6-9e41-aeee01591ebd' : ['536d935b-a6ae-4da9-9e0d-ad6c00f478a9', '7f0f8888-9025-4aac-a9a5-ad6c00f0f47f', '7c83562c-9863-41db-9acb-ad6c00f0f47f', '02039250-bf94-4e8d-aec7-ad6c00f478a9', '95f07a39-c4a6-4392-85cd-ad6c00f478a9'],

      //2022全员专项 健康教育
        'a3a46973-10ac-4ae5-ba9c-af2c00a1c89a' : ['535f9b0c-296c-4003-a193-af2a0107fb19', '4b170994-ae9f-4bd6-b4a3-af2a0107fb19', 'a38aec8f-3865-4303-9f4c-af2a0109843f', 'e9e8712b-3c11-4b49-9414-af2a0107fb19', '1f995302-777b-4e44-97fe-af2a0107fb19'],
        'a5273228-ce96-42a2-b9b1-af38011071d1' : ['2653d605-bd65-4c55-a859-af3801029135', '85e21a43-4734-4628-8df4-af3801029135', 'a1a4e01c-33b9-41b6-914d-af3801029135'],
        '4c260656-8b61-42a9-af92-aef500d14989' : ['c128eb90-92bd-4ea0-86af-aef500b60988', 'd81d21b3-403e-4139-9431-aef500b60988', '1d968f96-6e85-4718-a3ad-aef500b60988'],
        'a786e6c5-61af-4f97-9a29-af2b00bbcf94' : ['7a22ebf6-7d76-4abf-895d-af2b00a30544', '8e6f8f8a-1336-4971-969d-af2b00a30544', 'b7a5e8d5-31c7-42ed-a8f8-af2b00a30544', '43296b82-d0f8-4879-8adc-af2d00ff29ae', '783313d6-62f9-48bf-9b5d-af2b00a30544'],
        '426f669a-3e9b-4d02-bb24-af2c010a81b8' : ['faf86486-f0f4-4fd8-bf6e-af2c0109f8fe', '3ac5e66a-0f24-488d-b9f4-af2c0109f8fe', 'ccd9de90-1f5e-467c-8bba-af2c0109f8fe', '69334dc3-a84a-4dca-a8ef-af2c0109f8fe', '71a02aa2-2b06-42be-b599-af2c0109f8fe'],
        '242d3f63-b0b6-4a1d-9fab-aef500b6a9d6' : ['3d00729e-b395-412a-b432-aef500ba8fce', '3ca528c6-979c-479b-bd92-aef500ba8fce', 'fd2423c9-a202-4048-9e4e-aef500ba8fce'],
        '00cb9c61-b7ca-487a-ab3b-aef500b9d4ed' : ['52fdb69e-4914-4ca4-95b8-aef500b85d5c', '5a9baf89-79f9-4d98-9fef-aef500b85d5c', '9355808d-4383-454c-ac73-aef500b85d5c'],
        'ed734330-1d3f-4e91-a5e6-aef500bb2ff6' : ['b88ff476-fcd1-4cf6-ba8c-aef500bafd4a', 'f0e42598-1e54-4a59-b9fb-aef500bafd4a', 'd1017b9c-2176-47ea-aefa-aef500bafd4a'],
        'c7262354-f566-41c8-8fa7-af2b0110d3ed' : ['a2f9c50b-f1ff-486d-aa0d-af2900e9ca27', '37310ac0-7b10-48bc-a555-af2900e9ca27', 'c8be6afc-e70e-40d0-bf7d-af2900e9ca27', 'c3b077cb-2623-4e16-b641-af2900e9ca27'],
        '5ada5df4-0e89-4223-84aa-af2c00bf19f9' : ['ea4f6a5b-ee46-495e-928b-af280114a79d', 'c3985e38-45b2-4a3c-b2bd-af3500af9732', 'c22753b3-7b8c-4ba2-b833-af280114a79d'],



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
        }, 10000);
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