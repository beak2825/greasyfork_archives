// ==UserScript==
// @name         淘宝/天猫/京东 - 下载视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在淘宝、天猫、天猫超市、天猫国际、京东的主图视频下载添加了一个“下载视频”的按钮。
// @author       潘志城_Neo
// @match        *://detail.tmall.com/item*
// @match        *://detail.tmall.hk/*
// @match        *://chaoshi.detail.tmall.com/*
// @match        *://detail.m.tmall.com/*
// @match        *://item.taobao.com/*
// @match        *://world.taobao.com/item/*
// @match        *://item.jd.com/*
// @grant        GM_download
// @grant        GM_notification
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407305/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E4%BA%AC%E4%B8%9C%20-%20%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/407305/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E4%BA%AC%E4%B8%9C%20-%20%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //获取当前网页链接
    let current_url = document.URL;

    //！！天猫！！
    if (current_url.includes("detail.tmall")) {

        //添加“下载视频”按钮
        $("#J_CollectCount").after('<button id="Neo_download_video" class="favorite" style="background-color:#FF0036; width:65px;height:25px; border:0px solid;color:#fff ; cursor:pointer;font-family:"Times New Roman""><span class="" ">下载视频</span></button>')

        //下载视频的函数
        function Neo_download_video_fun(){

            //！！天猫超市！！ 要跳转到手机版的网页，才能获取到真实的视频地址
            if (current_url.includes("chaoshi"))
            {
                let jump_url = document.URL.replace("chaoshi.detail","detail.m")
                window.open(jump_url)
            }

            //！！天猫国际！！
            else
            {
                let url = $("video source")[0].src
                let name = $('meta[name="keywords"]').attr("content")

                GM_download({
                    url:url,
                    name:name,
                    onload: function(){
                        //下载完成之后，右下角弹窗通知。
                        GM_notification({text:name+".mp4",title:"以下视频下载完成",timeout:5000})
                    }
                });

                //添加“已添加下载..”文案
                $("#Neo_download_video").after('<span id="Neo_aready_add">已添加下载...</span>')

                //已添加下载..”文案显示2秒后移除
                var count = 0
                let interval = setInterval(function () {
                    if(count < 2){
                        count +=1
                    }else{
                        //移除“已添加下载..”文案
                        $("#Neo_aready_add").remove()
                        //停止循环
                        clearInterval(interval);
                    }
                },1000)
                }
        }
        //把按钮和函数绑定在一起，先解绑再重新绑定
        $("#Neo_download_video").off("click").on("click",function(){Neo_download_video_fun()})



        //！！天猫超市 - 手机版！！ 下载视频，并关闭
    }else if(current_url.includes("detail.m.tmall")) {

        //页面加载之后，直接下载视频并关闭页面
        $(document).ready(function(){
            let url = $("a.app-video").attr("data-video")
            let name = $('meta[property="og:title"]').attr("content")

            GM_download(url,name)

            window.close();
        })
    }

    //！！！京东！！！
    else if(current_url.includes("jd")) {

        $(function(){
            //添加“下载视频”按钮
            $(".left-btns").append('<button id="Neo_download_video" class="favorite" style="background-color:#DF3033; width:75px;height:25px; border:0px solid;color:#fff ; cursor:pointer;font-family:"Times New Roman""><span class="" ">下载视频</span></button>')

            //下载视频的函数
            function Neo_download_video_fun(){

                //因为视频要点击播放之后，才会有视频的标签，所以先点击一下
                $(".J-video-icon").click()

                setTimeout(function(){

                    //暂停播放视频
                    $("#video-player_html5_api")[0].pause()


                    let url = $("#video-player_html5_api source").attr("src")
                    let name = document.title

                    //替换window.file_name里面的特殊符号
                    let sign_list = ["\\*","\\'",'\\"',"<",">","\\?","\\.","\\|","\\/"]
                    for(let i=0 ; i< sign_list.length; i++){
                        var reg = "/"+sign_list[i]+"/g";
                        name = name.replace(eval(reg),"_");
                    }


                    //GM_download(url,name)
                    GM_download({
                        url:url,
                        name:name,
                        onload: function(){
                            //下载完成之后，右下角弹窗通知。
                            GM_notification({text:name+".mp4",title:"以下视频下载完成",timeout:5000})
                        }
                    });

                    //添加“已添加下载..”文案
                    $("#Neo_download_video").after('<span id="Neo_aready_add">已添加下载...</span>')

                    //“已添加下载..”文案显示2秒后移除
                    setTimeout(function(){
                        $("#Neo_aready_add").remove()
                    },2000)


                }, 1000);
            }

            //把按钮和函数绑定在一起，先解绑再重新绑定
            $("#Neo_download_video").off("click").on("click",function(){Neo_download_video_fun()})

        })

        //！！淘宝world！！
    }else if(current_url.includes("world"))
    {
        //页面加载之后，直接下载视频并关闭页面
        $(document).ready(function(){
            let url = $("video").attr("src")
            let name = $(".item-detail").children("h1").text()
            console.log(url,name)
            GM_download(url,name)

            window.close();
        })

    }


    //！！淘宝！！
    else{

        //添加下载视频按钮
        $(".tb-social-fav").append('<button id="Neo_download_video" class="favorite"  style="background-color:#FF0036; width:65px;height:25px; border:0px solid;color:#fff ; cursor:pointer;font-family:"Times New Roman""><span class="" ">下载视频</span></button>')

        //按钮点击之后，获取有视频真实地址的商品页地址，跳转下载
        function Neo_download_video_fun(){

            //获取有视频真实地址的商品页地址
            let product_id = document.URL.split("id=")[1].split("&")[0]
            let can_download_url = 'https://world.taobao.com/item/'+product_id+'.htm'
            //打开地址
            window.open(can_download_url,"_blank");

        }
        //先解绑再重新绑定
        $("#Neo_download_video").off("click").on("click",function(){Neo_download_video_fun()})
    }

})();