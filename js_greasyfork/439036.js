// ==UserScript==
// @name         正保365挂课脚本-全网唯一-增强多功能脚本
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  正支持自动播放、自动答题、自动静音、自动切课，目前版本对于常规问题非常稳定，全网目前唯一自动化脚本.
// @author       BomLuo
// @match        *://xuexi.zikao365.com/xcware/video/videoPlay/videoPlayhls.shtm?*
// @match        *://xuexi.zikao365.com/xcware/video/h5video/videoPlay.shtm?*
// @match        *://member.zikao365.com/qzgckh*
// @license      AGPL License
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/439036/%E6%AD%A3%E4%BF%9D365%E6%8C%82%E8%AF%BE%E8%84%9A%E6%9C%AC-%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80-%E5%A2%9E%E5%BC%BA%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439036/%E6%AD%A3%E4%BF%9D365%E6%8C%82%E8%AF%BE%E8%84%9A%E6%9C%AC-%E5%85%A8%E7%BD%91%E5%94%AF%E4%B8%80-%E5%A2%9E%E5%BC%BA%E5%A4%9A%E5%8A%9F%E8%83%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
//      console.log(document.location.href)

    if(/member.zikao365\.com/i.test(document.location.href)){
    console.log("==========Run two=========")
        //获取答案编号栏
        var tes = $(".dY a")[0];
//         console.log(tes.href)
        //跨域请求参数 【第一个url会拼接参数到form表单，在跳转到另一个接口获取答案】
        GM_xmlhttpRequest({
            method: "GET",
            url: tes.href,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            data:"",
            onload: function(response){
//                  console.log("请求成功");
                const template=response.responseText;
                //将html转为dom
                let tempNode = document.createElement('html');
                tempNode.innerHTML = template;
                //这里处理如果查不到答案
                console.log(tempNode.childNodes.length)
                var data=new Object();
                if(tempNode.childNodes.length>2){
                var formdata=tempNode.childNodes[2].children[10].children;
                if(formdata.length!=0){
                data.boardID=formdata[0].value;
                data.Forum_ID=formdata[1].value;
                data.categoryID=formdata[2].value;
                data.location=formdata[3].value;
                data.askMode=formdata[4].value;
                data.m_email=formdata[5].value;
                data.m_moren=formdata[6].value;
                data.location=formdata[7].value;
                data.majorID=formdata[8].value;
                data.pointIDs=formdata[9].value;
                data.questionID=formdata[10].value;
                }
                }
                //带着解析后的参数挖掘答案
                $.ajax(
                    {
                        type: 'post',
                         async: false,
                         headers: {
                             accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                         },
                        url: "//member.zikao365.com/faqgckh/topic.shtm",
                        contentType:"application/x-www-form-urlencoded",
                        data: data,
                        success: function (data)
                        {
                            //将html转为dom
                        let tempNode = document.createElement('html');
                        tempNode.innerHTML = data;
                             console.log(tempNode.childNodes)
                            //处理错误页面
                            if(tempNode.childNodes.length<3){
                              var remains1="B";
                               for(let i=0;i<$(".saveOneQuestion").length;i++){
                                    if($(".saveOneQuestion").eq(i)[0].value.indexOf(remains1)>=0){
                                        $(".saveOneQuestion").eq(i)[0].click(); //点击单选框
                                        $(".savePaper").eq(0).click();//点击提交
                                        $(".btn-h5Tips").eq(0)[0].click();//点击确定提交
                                        break;
                                    }
                                }
                                GM_setValue("state",1) //传递信息已经答题完毕
                                breka;
                            }
                        var dan=tempNode.childNodes[3].children[5].children[1].children[0].children[3].children[0].children[5].children[1].outerText; //答案在这里
                            //处理答案
//                             console.log(dan.indexOf("】"))
//                             console.log(dan.indexOf("【"))
//                             console.log(dan.indexOf("【",dan.indexOf("【")+1))
                           var remains=dan.substr(dan.indexOf("】")+1,dan.indexOf("【",dan.indexOf("【",dan.indexOf("【")+1))-dan.indexOf("】")-2); //真正的答案
//                             console.log(remains.length)
//                             console.log("***")
                            if(remains.length==0){remains="B";}
                           //如果是多选题
                            if(remains.length>1){
                                for(let i=0;i<$(".saveOneQuestion").length;i++){
                                    if(remains.indexOf($(".saveOneQuestion").eq(i)[0].value)>=0){
                                        $(".saveOneQuestion").eq(i)[0].click(); //点击多选
                                    }
                                }
                                     $(".savePaper").eq(0).click();//点击提交
                                     $(".btn-h5Tips").eq(0)[0].click();//点击确定提交
                            }else{
                               //遍历查找答案
                                for(let i=0;i<$(".saveOneQuestion").length;i++){
                                    if($(".saveOneQuestion").eq(i)[0].value.indexOf(remains)>=0){
                                        $(".saveOneQuestion").eq(i)[0].click(); //点击单选框
                                        $(".savePaper").eq(0).click();//点击提交
                                        $(".btn-h5Tips").eq(0)[0].click();//点击确定提交
                                        break;
                                    }
                                }
                            }
                            GM_setValue("state",1) //传递信息已经答题完毕
                        },
                        error:function(err){
//                             console.log("第二请求错误"+err)
                            var remains="B";
                               for(let i=0;i<$(".saveOneQuestion").length;i++){
                                    if($(".saveOneQuestion").eq(i)[0].value.indexOf(remains)>=0){
                                        $(".saveOneQuestion").eq(i)[0].click(); //点击单选框
                                        $(".savePaper").eq(0).click();//点击提交
                                        $(".btn-h5Tips").eq(0)[0].click();//点击确定提交
                                        break;
                                    }
                                }
                             GM_setValue("state",1) //传递信息已经答题完毕
                        }
                    });
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
    }else{
     console.log("==========Run one=========")
       GM_setValue("state",0);//初始化完成命令
       var videos = $('#my-video');
        	for (var i = 0; i < videos.length; i++) {
				var current_video = videos[i]
				// 静音
				current_video.volume = 0
				// 2倍速
				//current_video.playbackRate = 2.0
				if (current_video.paused) {
					current_video.play()
				}
			}

        setInterval(function () {
            console.log(GM_getValue("state"))
             if(GM_getValue("state")===1){
//                  console.log($(".sure.fr.msf"))
                 $(".sure.fr.msf").eq(0)[0].click();
                 GM_setValue("state",0)
                 console.log("答题完毕，继续自动播放.....")
             }
    },2000)

    }

    // Your code here...
})();