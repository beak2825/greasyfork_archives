// ==UserScript==
// @name         航天云课堂-2023年《航天质量管理技术手册》培训自动连播
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  2023/12/28
// @author       You
// @match        https://train.casicloud.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=casicloud.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/483271/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82-2023%E5%B9%B4%E3%80%8A%E8%88%AA%E5%A4%A9%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E6%8A%80%E6%9C%AF%E6%89%8B%E5%86%8C%E3%80%8B%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/483271/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82-2023%E5%B9%B4%E3%80%8A%E8%88%AA%E5%A4%A9%E8%B4%A8%E9%87%8F%E7%AE%A1%E7%90%86%E6%8A%80%E6%9C%AF%E6%89%8B%E5%86%8C%E3%80%8B%E5%9F%B9%E8%AE%AD%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==
function toolFn() {
    //let data = ['af431567-dfa4-44e7-897a-5d8278b827e4/6/1', '',urseOnline-093eeb30-c881-48c9-8b87-852f2a47ea12', 'D621courseOnline-bf517af1-bdb4-41ee-888f-89544e1b3100', 'D621courseOnline-0e261545-d9b9-4497-b06f-122280fbb2f8', 'D621courseOnline-52f1a39e-5f86-4b81-ad73-c7457d31e901', 'D621courseOnline-d6cc8d05-043f-4efb-a516-09867186d74a', 'D621courseOnline-2beebbd4-fd90-4164-bfd0-a079ddb7b0c6', 'D621courseOnline-b1a99ecf-9174-483a-be3e-80ae8f90956c', 'D621courseOnline-26ff4571-4fec-4b37-9040-14a484a7a684', 'D621courseOnline-d07b555c-787d-4eb7-8135-2b823d825e18', 'D621courseOnline-77b3e22a-dd7c-4057-b71d-cfe7e8f4bf43', 'D621courseOnline-21e85546-b0ce-497a-ad6f-2e7a4fd4577a', 'D621courseOnline-f3b562f1-4142-4bbd-ba8f-bc1b5822b99f', 'D621hitem-736fde03-1505-4085-bc01-919cca784bc9'];
    let data = ['64dc920b-db5f-465a-b48f-0ecfd20a0120', '0d86260c-9e5b-48e5-8460-7158c1a30402', 'ec1fa1c0-363e-4cc8-9d5b-052aa967a1d7', '0be9b130-91f6-46ad-8202-99685967bf16', 'baa5935c-c62e-4cec-8651-a471c08af805', '9f56d96f-eba9-477b-abea-5f760973971f', 'dbcf168b-37a3-4e6a-8a27-3360829b272d', '931ff9cd-9942-4140-882e-08f99ec4f20f', 'e08e83b8-3789-460b-83a5-39810ccd8964', '98cd2022-4003-4f96-b812-322307e7fe37', '7afd0458-6a8b-48c5-a272-f9ed8499a0d6', '412fa425-38cd-4514-94ed-7ebf2f333423', '5adfa3fd-8c00-4fd1-83f7-e927d26cd55b', '1e7607c6-327b-4e82-9dce-9e719e93ef4d', '467a4142-bf50-47ec-b7d9-13da8a9fb89c', '11ae571b-4f68-4ab8-ab3e-dbf4b1b74cc0', 'ce74f3a7-750b-4f30-b677-dc0fab5091c8', '368f1af3-a575-4db3-b87e-88df02e90000', 'ad8175fb-db76-4c20-b0cd-99f8ff821664', '5b215842-432b-4a50-9efd-2bf2fbafbcc3', '91d08d88-0ca5-4faa-953b-771b8e5b50f2', '303bf090-ee4f-4909-99c9-efbb10c7ed9a']
    data = data.concat(['fb159ed0-2b6f-40a8-ac17-f0416e048ccd', '9414710c-9d4e-4646-bba7-51a86a28968d', '77490ceb-565b-4ea8-9db7-383addbd84a0', '07399eb1-96c0-4bca-912b-403a36e45b55', '0ea68710-79a9-43a9-a9b5-ba36017c74b2', '14561853-bc2c-4c70-87db-6c1cb4ba663f', '079eff7b-7dd7-4869-a71f-2809f7828319', 'ac429229-6d05-4a52-a278-7a288af2acf8', '94dba4c1-35db-4604-915d-66d061dbc002', 'e547d679-5624-44ed-aa5b-52a1601d89ec', '0206e0ac-38be-4ae3-b420-114d7756accb', 'c06ab054-36ea-4f02-ab17-fb80a0947a45', 'cc017c2b-8c52-44c8-913b-cd66d6c27433', '81ac0ba1-d4f6-43ee-a1cb-3ab3a8495fe6', '7eaada54-d61c-4d94-a712-abce16bca40b', '7944edcd-e75a-4d5d-ae81-ba381e71f416', 'cf03711d-b1a2-42bd-8f01-670fb6ce9905', 'a9fcc38f-7f95-4a6e-847b-285eb43e8846', 'fa9f3835-f986-4ceb-8387-9e9bc3d2e963', 'c35776e3-a677-4006-9852-a886c551ffd4', '3689cef1-bbff-4b0f-8a3b-0ffd96e11519', '9bba029b-7477-42ba-911a-910c0bad5554', '508dade3-74e4-48f9-bee4-92e061033d0a', '15127cb8-b990-4a5b-b701-02fb55b91fa6', '5a242732-96c0-419f-a5e6-3abd55d47e92', '230f28a2-f465-41cf-b5b8-14a676b96b3e', 'fe7cef1f-ff7a-452e-9abb-c1cb14aa701a', '316f61f1-7dc8-4a18-a893-3d1f64d2f1aa'])
    let course = $(".chapter-list-box.required");
    let index, finish = false;
    for(let i = 0; i < course.length; ++i) {
        if (!course[i].outerText.match("重新学习")) {
            course[i].click();
            $(".videojs-referse-btn").click();
            console.log("start courses ", i+1);

            let time1 = setInterval(() => {
                console.log("start play");
                var video = document.getElementsByTagName("video")[0]
                if (video) {
                    video.muted = true
                    video.play()
                    $(".vjs-netslow").click()
                    $(".slow-img").click()
                }
            }, 3*1000);

            setInterval(() => {
                console.log("check status ", i, $(".chapter-list-box.required")[i].outerText);
                if($(".chapter-list-box.required")[i].outerText.match("重新学习")) {
                    console.log("finished courses ");
                    location.reload();
                }
            }, 5*1000);
            break;
        }
        if (i === course.length - 1) {
            finish = true;
        }
    }

    const getID = (str) => str.match(/.*?-(.+?)$/)[1];
    console.log("course finished: ", finish);
    if (finish) {

        for(let i =0; i < data.length; ++i) {
            if(location.href.match(getID(data[i]))) {
             console.log("next id", data[i+1]);
             //location.replace(`https://train.casicloud.com/#/study/course/detail/10&${getID(data[i+1])}/6/1`);
             window.open(`https://train.casicloud.com/#/study/course/detail/11&${data[i+1]}/6/1`);
             break;
            }
        }
    }
}


(function($) {
    'use strict';
    if(!location.href.match("https://train.casicloud.com/#/study/course/detail")) return;
    console.log("https://train.casicloud.com/#/study/course/detail");

    let time = setInterval(() => {
        if ($(".chapter-list-box.required").length) {
            clearInterval(time);
            toolFn();
        }
    }, 1000);

    // Your code here...
})(jQuery);