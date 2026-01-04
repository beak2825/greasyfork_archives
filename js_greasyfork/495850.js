// ==UserScript==
// @name         搜索视频
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  根据关键词搜索视频
// @author       xgm
// @match        https://www.douyin.com/search/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      End-User License Agreement
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/495850/%E6%90%9C%E7%B4%A2%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/495850/%E6%90%9C%E7%B4%A2%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义css
    let div_css = `
        .cyOperate{
            width: 500px;
            max-height: 700px;
            overflow-y: auto;
            padding: 15px 20px;
            background: #fff;
            border-radius: 10px;
            position: fixed;
            right: 15%;
            top: 50%;
            transform: translateY(-50%);
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 99999;
            color: #333;
            box-sizing: initial;
        }
        .cyInp input{
            width: 220px;
            height: 40px;
            padding: 0 10px;
            font-size: 14px;
            border-radius: 4px;
            border: 1px solid #aaa;
            margin-left: 20px;
        }
        .cyBtn{
            text-align: center;
        }
        .cyBtn button{
            width: 150px;
            height: 35px;
            background-color: #0096DB;
            color: #fff;
            border: 0;
            border-radius: 3px;
            cursor: pointer;
            font-size: 16px;
            letter-spacing: 3px;
        }
        .cyloading{
            width: 100%;
            height: 100%;
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(0,0,0,0.5);
            z-index: 9999999;
            display: none;
        }
        .cyloading svg{
            width: 300px;
            height: 300px;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -150px;
            margin-top: -150px;
        }
        .cyloading svg text{
            font-size: 2px;
        }
    `
    // 引用自定义css
    GM_addStyle(div_css);

    let div = `
        <div class="cyOperate">
            <div class="cyBtn">
                <button>搜索</button>
            </div>
        </div>
        <div class="cyloading">
            <svg
            version="1.1"
            id="dc-spinner"
            xmlns="http://www.w3.org/2000/svg"
            x="0px" y="0px"
            width:"38"
            height:"38"
            viewBox="0 0 38 38"
            preserveAspectRatio="xMinYMin meet"
            >
            <text x="7" y="21" font-family="Monaco" font-size="2px" style="letter-spacing:0.6" fill="#fff">达人抓取中，请勿关闭
            <animate
                attributeName="opacity"
                values="0;1;0" dur="1.8s"
                repeatCount="indefinite"/>
            </text>
            <path fill="#373a42" d="M20,35c-8.271,0-15-6.729-15-15S11.729,5,20,5s15,6.729,15,15S28.271,35,20,35z M20,5.203
            C11.841,5.203,5.203,11.841,5.203,20c0,8.159,6.638,14.797,14.797,14.797S34.797,28.159,34.797,20
            C34.797,11.841,28.159,5.203,20,5.203z">
            </path>
            <path fill="#373a42" d="M20,33.125c-7.237,0-13.125-5.888-13.125-13.125S12.763,6.875,20,6.875S33.125,12.763,33.125,20
            S27.237,33.125,20,33.125z M20,7.078C12.875,7.078,7.078,12.875,7.078,20c0,7.125,5.797,12.922,12.922,12.922
            S32.922,27.125,32.922,20C32.922,12.875,27.125,7.078,20,7.078z">
            </path>
            <path fill="#2AA198" stroke="#2AA198" stroke-width="0.6027" stroke-miterlimit="10" d="M5.203,20
                    c0-8.159,6.638-14.797,14.797-14.797V5C11.729,5,5,11.729,5,20s6.729,15,15,15v-0.203C11.841,34.797,5.203,28.159,5.203,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                calcMode="spline"
                keySplines="0.4, 0, 0.2, 1"
                keyTimes="0;1"
                dur="2s" repeatCount="indefinite" />
            </path>
            <path fill="#859900" stroke="#859900" stroke-width="0.2027" stroke-miterlimit="10" d="M7.078,20
            c0-7.125,5.797-12.922,12.922-12.922V6.875C12.763,6.875,6.875,12.763,6.875,20S12.763,33.125,20,33.125v-0.203
            C12.875,32.922,7.078,27.125,7.078,20z">
            <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="1.8s"
                repeatCount="indefinite" />
            </path>
            </svg>
        </div>
    `
    $("body").append(div);


    // 查找抖音数据id
    function searchData(object, data) {
        for (var key in object) {
            if (object[key] == object[data]){
                // console.log(key)
                return key
            };
            for(var i in object[key]){
                // console.log(i);
                if(i == data){
                    return key;
                }
            }
        }
    }


    function req(url,data,sucFun,specialFun){


        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify(data),
            onload: function(res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var json = JSON.parse(text);
                    // console.log(json);
                    if(json.code == 1000){
                        sucFun(json)
                    }else if(json.code == 1002){
                        alert(json.message);
                        localStorage.removeItem("token");
                        localStorage.removeItem("storagePhone");
                        localStorage.removeItem("storagePwd");
                        localStorage.removeItem("dep_name");
                        localStorage.removeItem("staffName");
                        $(".operate").hide();
                        $(".loginBox").show();
                    }else{
                        alert(json.message);
                        if (typeof(specialFun) == "function") {
                            specialFun()
                        }
                    }
                }
            }
        });



        // $.ajax({
        //     type: "post",
        //     url: url,
        //     data: data,
        //     success: function (res) {
        //         if(res.code == 1000){
        //             sucFun(res)
        //         }else if(res.code == 1002){
        //             alert(res.message);
        //             localStorage.removeItem("token");
        //             localStorage.removeItem("storagePhone");
        //             localStorage.removeItem("storagePwd");
        //             localStorage.removeItem("dep_name");
        //             localStorage.removeItem("staffName");
        //             $(".operate").hide();
        //             $(".loginBox").show();
        //         }else{
        //             alert(res.message);
        //             if (typeof(specialFun) == "function") {
        //                 specialFun()
        //             }
        //             $(".loading").hide();
        //         }
        //     },
        //     error: function(fail){
        //         console.log(fail.statusText)
        //     }
        // });
    }



    function getCookie(cname)
    {
        var name = cname + "=";
        var ca = document.cookie.split(';').reverse();
        for(var i=0; i<ca.length; i++)
        {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) return c.substring(name.length,c.length);
        }
        return "";
    }

    let rex = window.location.href;

    // apiHost
    // var apiHost = "https://api.test.cyek.com/";
    var apiHost = "https://api.oa.cyek.com/";


    if(rex.match(/https:\/\/www.douyin.com\/search\/*/) != null){
        // 获取抖音json数据
        let text = $("#RENDER_DATA").text();
        let decode = JSON.parse(decodeURIComponent(text));
        console.log(decode);
        // console.log(decode.app.odin.user_unique_id)
        // console.log(searchData(decode,"uid"));
        // var user = decode[searchData(decode,"uid")].user.user;
        // console.log(user);


        let dyCookie = getCookie("msToken")
        // console.log(dyCookie)

        let dyoffset = 0
        let need_filter_settings = 1
        let search_id
        let linkArr = []

        let repeatNum = 0

        // let currentCount = 0

        function getDyData(keyword){

            $(".cyloading").show()

            // let getCount = Math.ceil(parseInt($("#cyCount").val())/10)

            let dataVideo = {
                device_platform: "webapp",
                aid: 6383,
                channel: "channel_pc_web",
                search_channel: "aweme_video_web",
                enable_history: 1,
                keyword: keyword,
                search_source: decode.app.defaultSearchParams.source,
                query_correct_type: 1,
                is_filter_search: 0,
                from_group_id: "",
                offset: dyoffset,
                count: 10,
                need_filter_settings: need_filter_settings,
                search_id: search_id,
                update_version_code: 170400,
                pc_client_type: 1,
                version_code: 170400,
                version_name: "17.4.0",
                cookie_enabled: true,
                screen_width: 2560,
                screen_height: 1440,
                browser_language: "zh-CN",
                browser_platform: "Win32",
                browser_name: decode.app.browserInfo.browser,
                browser_version: decode.app.browserInfo.browser_version,
                browser_online: true,
                engine_name: "Blink",
                engine_version: decode.app.browserInfo.browser_version,
                os_name: "Windows",
                os_version: 10,
                cpu_core_num: 16,
                device_memory: 8,
                platform: "PC",
                downlink: 10,
                effective_type: "4g",
                round_trip_time: 100,
                webid: decode.app.odin.user_unique_id,
                // msToken: "",
                // "X-Bogus": "DFSzswVORDtANt/ltTElNl9WX7rs",
            }

            $.ajax({
                type: "get",
                url: "https://www.douyin.com/aweme/v1/web/search/item/",
                data: dataVideo,
                dataType: "json",
                success: function (res) {
                    // console.log(res)

                    dyoffset+=10
                    need_filter_settings = 0
                    search_id = res.log_pb.impr_id
                    // currentCount++

                    if(res.data == undefined){
                        repeatNum++
                        setTimeout(function(){
                            if(repeatNum <= 10){
                                console.log("接口返回失败，重跑接口")
                                getDyData(keyword)
                            }else{
                                alert("抓取频繁，请稍后刷新重试")
                                $(".cyloading").hide()
                                return;
                            }
                        },3000)
                    }else{
                        let has_more = res.has_more

                        for(let i in res.data){
                            linkArr.push(res.data[i])
                        }

                        // console.log(linkArr)

                        if(res.has_more == 1 && linkArr.length < 40){
                            setTimeout(function(){
                                getDyData(keyword)
                            },2000)
                        }else{
                            let linkItem = linkArr.slice(0,40)
                            // console.log(linkArr)
                            // console.log(linkItem)

                            let urlData = {
                                keyword: keyword,
                                result: JSON.stringify(linkItem)
                                // result: linkItem
                            }

                            req(apiHost+"spider/browser/saveSearchKeywordResult",urlData,function(res){
                                dyoffset = 0
                                need_filter_settings = 1
                                search_id = null
                                linkArr = []

                                // 隔三秒再次调用接口拿到下一个 keyword
                                setTimeout(function(){
                                    getKeyword()
                                },3000)

                            },function(res){
                                alert("抓取失败")
                                $(".cyloading").hide()
                                dyoffset = 0
                                need_filter_settings = 1
                                search_id = null
                                linkArr = []
                            })

                        }

                    }
                }
            });
        }

        function getKeyword(){
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://api.test.cyek.com/spider/browser/getSearchKeyword",
                headers: { "Content-Type": "application/json" },
                // data: JSON.stringify(data),
                onload: function(res) {
                    if (res.status == 200) {
                        var text = res.responseText;
                        var json = JSON.parse(text);
                        // console.log(json);
                        if(json.code == 1000){
                            // json.result = []
                            if(json.result.keyword == undefined){
                                alert("暂无关键词，抓取已完成")
                                $(".cyloading").hide()
                            }else{
                                getDyData(json.result.keyword)
                            }
                        }else if(json.code == 1002){
                            alert(json.message);
                            $(".cyloading").hide()
                        }else{
                            alert(json.message);
                            $(".cyloading").hide()
                        }
                    }
                }
            });
        }

        // 抓取达人
        $(".cyBtn button").click(function(){
            getKeyword()
        })

    }

//     else if(rex.match(/https:\/\/www.kuaishou.com\/*/) != null){

//         // 快手

//         function getDyData(){

//             $(".cyloading").show()

//             let dataVideo = {
//                 "operationName": "brilliantDataQuery",
//                 "query": "fragment photoContent on PhotoEntity {\n  __typename\n  id\n  duration\n  caption\n  originCaption\n  likeCount\n  viewCount\n  commentCount\n  realLikeCount\n  coverUrl\n  photoUrl\n  photoH265Url\n  manifest\n  manifestH265\n  videoResource\n  coverUrls {\n    url\n    __typename\n  }\n  timestamp\n  expTag\n  animatedCoverUrl\n  distance\n  videoRatio\n  liked\n  stereoType\n  profileUserTopPhoto\n  musicBlocked\n}\n\nfragment recoPhotoFragment on recoPhotoEntity {\n  __typename\n  id\n  duration\n  caption\n  originCaption\n  likeCount\n  viewCount\n  commentCount\n  realLikeCount\n  coverUrl\n  photoUrl\n  photoH265Url\n  manifest\n  manifestH265\n  videoResource\n  coverUrls {\n    url\n    __typename\n  }\n  timestamp\n  expTag\n  animatedCoverUrl\n  distance\n  videoRatio\n  liked\n  stereoType\n  profileUserTopPhoto\n  musicBlocked\n}\n\nfragment feedContent on Feed {\n  type\n  author {\n    id\n    name\n    headerUrl\n    following\n    headerUrls {\n      url\n      __typename\n    }\n    __typename\n  }\n  photo {\n    ...photoContent\n    ...recoPhotoFragment\n    __typename\n  }\n  canAddComment\n  llsid\n  status\n  currentPcursor\n  tags {\n    type\n    name\n    __typename\n  }\n  __typename\n}\n\nfragment photoResult on PhotoResult {\n  result\n  llsid\n  expTag\n  serverExpTag\n  pcursor\n  feeds {\n    ...feedContent\n    __typename\n  }\n  webPageArea\n  __typename\n}\n\nquery brilliantDataQuery($pcursor: String, $semKeyword: String, $semCrowd: String, $utmSource: String, $utmMedium: String, $page: String, $photoId: String, $utmCampaign: String, $webPageArea: String) {\n  brilliantData(pcursor: $pcursor, semKeyword: $semKeyword, semCrowd: $semCrowd, utmSource: $utmSource, utmMedium: $utmMedium, page: $page, photoId: $photoId, utmCampaign: $utmCampaign, webPageArea: $webPageArea) {\n    ...photoResult\n    __typename\n  }\n}\n",
//                 "variables": {"page": "home","photoId": "","semCrowd": "","semKeyword": "","utmMedium": "","utmSource": ""}
//             }

//             $.ajax({
//                 type: "post",
//                 url: "https://www.kuaishou.com/graphql",
//                 data: dataVideo,
//                 dataType: "json",
//                 success: function (res) {
//                     // console.log(res.cards)
//                     let pcursor = res.data.brilliantData.pcursor

//                     let linkArr = []

//                     for(let i of res.data.brilliantData.feeds){
//                         let dyUid = i.author.id
//                         // console.log(dyUid)
//                         linkArr.push("https://www.kuaishou.com/profile/"+dyUid)
//                     }
//                     // console.log(linkArr)

//                     if(linkArr.length == 0){
//                         console.log("数据为空"+ new Date())
//                         setTimeout(function(){
//                             getDyData()
//                         },3000)
//                         return false
//                     }

//                     $.ajax({
//                         type: "post",
//                         url: "https://spider.oa.cyek.com/imp/pushWebToolsUrl",
//                         data: {
//                             "url": linkArr
//                         },
//                         dataType: "json",
//                         success: function (res) {
//                             if(res.code === 1000){
//                                 if(pcursor != "no_more"){
//                                     setTimeout(function(){
//                                         getDyData()
//                                     },3000)
//                                 }else{
//                                     $(".cyloading").hide()
//                                 }
//                             }else{
//                                 alert("抓取失败")
//                                 $(".cyloading").hide()
//                             }
//                         }
//                     });
//                 }
//             });
//         }

//         // 抓取达人
//         $("#init_btn span").click(function(){
//             getDyData()
//         })
//     }else if(rex.match(/https:\/\/www.xiaohongshu.com\/explore*/) != null){

//         // let xhsCookie = getCookie("cacheId")
//         // console.log(xhsCookie)
//         let user = unsafeWindow.__INITIAL_STATE__.feed.prefetchId._value

//         // 小红书
//         function getDyData(){

//             $(".cyloading").show()

//             $.ajax({
//                 type: "get",
//                 url: "https://www.xiaohongshu.com/explore/prefetch",
//                 data: {
//                     prefetch_id: user
//                 },
//                 crossDomain:true,
//                 xhrFields: {
//                     withCredentials: true // 这里设置了withCredentials
//                 },
//                 dataType: "json",
//                 success: function (res) {
//                     console.log(res)

//                     if(res.code != 0){
//                         setTimeout(function(){
//                             // getDyData()
//                             window.location.reload()
//                         },5000)
//                     }

//                     let pcursor = res.data.cursor_score

//                     let linkArr = []

//                     for(let i of res.data.items){
//                         let dyUid = i.note_card.user.user_id
//                         // console.log(dyUid)
//                         linkArr.push("https://www.xiaohongshu.com/user/profile/"+dyUid)
//                     }
//                     // console.log(linkArr)

//                     if(linkArr.length == 0){
//                         console.log("数据为空"+ new Date())
//                         setTimeout(function(){
//                             // getDyData()
//                             window.location.reload()
//                         },5000)
//                         return false
//                     }

//                     $.ajax({
//                         type: "post",
//                         url: "https://spider.oa.cyek.com/imp/pushWebToolsUrl",
//                         data: {
//                             "url": linkArr
//                         },
//                         dataType: "json",
//                         success: function (res) {
//                             if(res.code === 1000){
//                                 if(pcursor != "no_more"){
//                                     setTimeout(function(){
//                                         // getDyData()
//                                         window.location.reload()
//                                     },5000)
//                                 }else{
//                                     $(".cyloading").hide()
//                                 }
//                             }else{
//                                 alert("抓取失败")
//                                 $(".cyloading").hide()
//                             }
//                         }
//                     });
//                 }
//             });
//         }

//         // 抓取达人
//         // $("#init_btn span").click(function(){
//             // getDyData()
//         // })
//     }else if(rex.match(/https:\/\/www.bilibili.com/) != null){

//         // B站 哔哩哔哩
//         function getDyData(){

//             $(".cyloading").show()

//             let starData = {
//                 web_location: 1430650,
//                 y_num: 5,
//                 fresh_type: 3,
//                 feed_version: "V8",
//                 fresh_idx_1h: 4,
//                 fetch_row: 1,
//                 fresh_idx: 4,
//                 brush: 1,
//                 homepage_ver: 1,
//                 ps: 20,
//                 last_y_num: 5,
//                 screen: "1591-1283",
//                 seo_info: "",
//                 last_showlist: "",
//                 uniq_id: unsafeWindow.__SERVER_CONFIG__.uniq_page_id,
//                 w_rid: "",
//                 wts: Math.ceil(new Date().getTime()/1000)
//             }

//             $.ajax({
//                 type: "get",
//                 url: "https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd",
//                 data: starData,
//                 crossDomain:true,
//                 xhrFields: {
//                     withCredentials: true // 这里设置了withCredentials
//                 },
//                 dataType: "json",
//                 success: function (res) {
//                     // console.log(res)

//                     if(res.code != 0){
//                         setTimeout(function(){
//                             getDyData()
//                         },3000)
//                     }

//                     // let pcursor = res.data.cursor_score

//                     let linkArr = []

//                     for(let i of res.data.item){
//                         if(i.owner == null){
//                             continue
//                         }
//                         let dyUid = i.owner.mid
//                         // console.log(dyUid)
//                         linkArr.push("https://space.bilibili.com/"+dyUid)
//                     }
//                     // console.log(linkArr)

//                     if(linkArr.length == 0){
//                         console.log("数据为空"+ new Date())
//                         setTimeout(function(){
//                             getDyData()
//                         },3000)
//                         return false
//                     }

//                     $.ajax({
//                         type: "post",
//                         url: "https://spider.oa.cyek.com/imp/pushWebToolsUrl",
//                         data: {
//                             "url": linkArr
//                         },
//                         dataType: "json",
//                         success: function (res) {
//                             if(res.code === 1000){
//                                 // if(pcursor != "no_more"){
//                                     setTimeout(function(){
//                                         getDyData()
//                                     },3000)
//                                 // }else{
//                                 //     $(".cyloading").hide()
//                                 // }
//                             }else{
//                                 alert("抓取失败")
//                                 $(".cyloading").hide()
//                             }
//                         }
//                     });
//                 }
//             });
//         }
//         // 抓取达人
//         $("#init_btn span").click(function(){
//             getDyData()
//         })
//     }else if(rex.match(/https:\/\/www.ixigua.com/) != null){

//         // 西瓜
//         function getDyData(){

//             $(".cyloading").show()

//             let starData = {
//                 channelId: 94349543909,
//                 count: 12,
//                 maxTime: Math.ceil(new Date().getTime()/1000),
//                 request_from: 701,
//                 queryCount: 3,
//                 offset: 0,
//                 referrer: "https://www.ixigua.com/",
//                 aid: 1768,
//                 msToken: getCookie("msToken"),
//                 // "X-Bogus": "DFSzswVYpRbANykmtYfpFe9WX7Jj",
//                 _signature: getCookie("__ac_signature")
//             }

//             $.ajax({
//                 type: "get",
//                 url: "https://www.ixigua.com/api/feedv2/feedById",
//                 data: starData,
//                 crossDomain:true,
//                 xhrFields: {
//                     withCredentials: true // 这里设置了withCredentials
//                 },
//                 dataType: "json",
//                 success: function (res) {
//                     console.log(res)

// //                     if(res.code != 0){
// //                         setTimeout(function(){
// //                             getDyData()
// //                         },3000)
// //                     }

// //                     // let pcursor = res.data.cursor_score

// //                     let linkArr = []

// //                     for(let i of res.data.item){
// //                         if(i.owner == null){
// //                             continue
// //                         }
// //                         let dyUid = i.owner.mid
// //                         // console.log(dyUid)
// //                         linkArr.push("https://space.bilibili.com/"+dyUid)
// //                     }
// //                     // console.log(linkArr)

// //                     if(linkArr.length == 0){
// //                         console.log("数据为空"+ new Date())
// //                         setTimeout(function(){
// //                             getDyData()
// //                         },3000)
// //                         return false
// //                     }

// //                     $.ajax({
// //                         type: "post",
// //                         url: "https://spider.oa.cyek.com/imp/pushWebToolsUrl",
// //                         data: {
// //                             "url": linkArr
// //                         },
// //                         dataType: "json",
// //                         success: function (res) {
// //                             if(res.code === 1000){
// //                                 // if(pcursor != "no_more"){
// //                                     setTimeout(function(){
// //                                         getDyData()
// //                                     },3000)
// //                                 // }else{
// //                                 //     $(".cyloading").hide()
// //                                 // }
// //                             }else{
// //                                 alert("抓取失败")
// //                                 $(".cyloading").hide()
// //                             }
// //                         }
// //                     });
//                 }
//             });
//         }
//         // 抓取达人
//         $("#init_btn span").click(function(){
//             getDyData()
//         })
//     }




    // 登录框拖拽
    function dragInfo(yTop,yBot){
        var _move1=false;//移动标记
        var _x1,_y1;//鼠标离控件左上角的相对位置
        $(".cyOperate").click(function(){
            //alert("click");//点击（松开后触发）
        }).mousedown(function(e){
            //console.log(e);
            _move1=true;
            _x1=e.pageX-parseInt($(".cyOperate").css("left"));
            _y1=e.pageY-parseInt($(".cyOperate").css("top"));
            // $(".operate").fadeTo(20, 0.5);//点击后开始拖动并透明显示
        });
        $(document).mousemove(function(e){
            if(_move1){
                var x=e.pageX-_x1;//移动时根据鼠标位置计算控件左上角的绝对位置
                var y=e.pageY-_y1;
                // console.log("y",y);
                if(x < 0){
                    x = 0;
                }else if(x > $(document).width() - $('.cyOperate').outerWidth(true)){ // 判断是否超出浏览器宽度
                    x = $(document).width() - $('.cyOperate').outerWidth(true)
                }
                if (y < yTop) {
                    y = yTop;
                } else if (y > $(window).height() - $('.cyOperate').outerHeight(true) + yBot) { // 判断是否超出浏览器高度
                    y = $(window).height() - $('.cyOperate').outerHeight(true) + yBot;
                }
                $(".cyOperate").css({top:y,left:x});//控件新位置
            }
        }).mouseup(function(){
            _move1=false;

            // 记录每次拖拽后位置存储
            localStorage.setItem("elLeftLogin",$(".cyOperate").css("left"));
            localStorage.setItem("elTopLogin",$(".cyOperate").css("top"));
            // $(".operate").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
        });
    }

    // 获取登录框拖拽后位置
    var elLeftLogin = localStorage.getItem("elLeftLogin");
    var elTopLogin = localStorage.getItem("elTopLogin");
    $(".cyOperate").css({
        "left": elLeftLogin,
        "top": elTopLogin
    })





    dragInfo(100,0)








})();