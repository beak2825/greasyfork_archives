// ==UserScript==
// @name         贵物班友会
// @namespace    http://tampermonkey.net/
// @version      3.1.7
// @description  贵物班友会(bgm.tv、bangumi.tv、chii.in)
// @author       老悠
// @include      https://bgm.tv/*
// @include      https://bangumi.tv/*
// @match        https://chii.in/*
// @connect      ly.syaro.io
// @connect      www.yodb.me
// @connect      www.yodb.net
// @connect      yodb.net
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492041/%E8%B4%B5%E7%89%A9%E7%8F%AD%E5%8F%8B%E4%BC%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/492041/%E8%B4%B5%E7%89%A9%E7%8F%AD%E5%8F%8B%E4%BC%9A.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_addStyle('html[data-theme="dark"] .monster-tooltip1{ background-color: black; } .dialog { width: 100%; height: 100vh; background-color: rgba(0, 0, 0, 0.5); position: absolute; top: 0; left: 0;line-height: 30px; display: none; } .dialog .container {width: 220px;height: 100px; background-color: #fff;margin: calc((100vh - 100px)/2) auto; position: relative;} .dialog .container .dialog_footer { position: absolute; bottom: 0; } .dialog .container .dialog_footer button {position: relative;left: 50px;display: inline-block;width: 50px;bottom: 10px;} .monster-tooltip1 {display: none;position: absolute;background-color: #f0f8ff;border: 1px solid #ccc;padding: 5px 10px;border-radius: 5px;font-size: 14px;}'
                +' /* 浮动按钮的样式 */\n' +
                '    .big-floating-button {\n' +
                '      position: fixed; /* 固定位置 */\n' +
                '      right: 0; /* 靠在右侧 */\n' +
                '      top: 80%; /* 垂直居中 */\n' +
                '      transform: translateY(-50%); /* 垂直居中对齐 */\n' +
                '      width: 30px; /* 初始宽度 */\n' +
                '      height: 120px; /* 高度 */\n' +
                '      background-color: #ff69b4; /* 粉红色 */\n' +
                '      color: white; /* 文字颜色（始终可见） */\n' +
                '      border: none;\n' +
                '      border-radius: 10px 0 0 10px; /* 左侧圆角，更圆润 */\n' +
                '      cursor: pointer;\n' +
                '      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影 */\n' +
                '      z-index: 1000; /* 确保按钮在最上层 */\n' +
                '      transition: width 0.3s ease; /* 鼠标悬停时宽度变化动画 */\n' +
                '      display: flex;\n' +
                '      align-items: center;\n' +
                '      justify-content: center;\n' +
                '      font-size: 14px; /* 文字大小 */\n' +
                '      writing-mode: vertical-lr; /* 文字竖着显示 */\n' +
                '      white-space: nowrap; /* 防止文字换行 */\n' +
                '      text-align: center; /* 文字居中 */\n' +
                '    }\n' +

                '    .small-floating-button {\n' +
                '      position: fixed; /* 固定位置 */\n' +
                '      right: 0; /* 靠在右侧 */\n' +
                '      top: 80%; /* 垂直居中 */\n' +
                '      transform: translateY(-50%); /* 垂直居中对齐 */\n' +
                '      width: 30px; /* 初始宽度 */\n' +
                '      height: 30px; /* 高度 */\n' +
                '      background-color: #ff69b4; /* 粉红色 */\n' +
                '      color: white; /* 文字颜色（始终可见） */\n' +
                '      border: none;\n' +
                '      border-radius: 10px 0 0 10px; /* 左侧圆角，更圆润 */\n' +
                '      cursor: pointer;\n' +
                '      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影 */\n' +
                '      z-index: 1000; /* 确保按钮在最上层 */\n' +
                '      transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease; /* 鼠标悬停时宽度变化动画 */\n' +
                '      opacity: 0.7; /* 初始透明度 */\n' +
                '      display: flex;\n' +
                '      align-items: center;\n' +
                '      justify-content: center;\n' +
                '      font-size: 14px; /* 文字大小 */\n' +
                '      white-space: nowrap; /* 防止文字换行 */\n' +
                '      text-align: center; /* 文字居中 */\n' +
                '    }\n' +

                '    .non-auth-button {\n' +
                '      background-color: #f5c542; /* 黄色 */\n' +
                '    }\n' +
                '\n' +
                '    /* 按钮悬停效果 */\n' +
                '    .big-floating-button:hover,.small-floating-button:hover {\n' +
                '      width: 200px; /* 鼠标悬停时伸长 */\n' +
                '      height: 120px; /* 高度 */\n' +
                '      opacity: 1; /* 恢复透明度 */\n' +
                '      writing-mode: horizontal-tb; /* 文字横着显示 */\n' +
                '      text-align: center; /* 文字居中 */\n' +
                '      line-height: 1.5; /* 增加行间距，使文字分成两行 */\n' +
                '      padding: 10px; /* 增加内边距，使文字居中 */\n' +
                '    }'
               )


    //let baseYodb="https://ly.syaro.io:380";
    //let baseYodb="https://www.yodb.me:380";
    let baseYodb="https://www.yodb.net";
    let yodbUrl=baseYodb+"/yodb/api/";
    //let yodbUrl="http://192.168.224.134:8080/yodb/";
    let protocol = window.location.protocol;
    let host = window.location.host;
    let baseUrl = protocol + '//' + host;
    let auth;

    GM_xmlhttpRequest({
        method: "POST",
        url: yodbUrl+'auth',
        onload: function(response) {
            let classText='floating-button big-floating-button';
            let openUrl=baseYodb+"/login";
            let outerText='未登录';
            let innerHtml='未登录【贵物班友会】<br>点击跳转登录页';
            if (response.status === 200) {
                const res = JSON.parse(response.responseText);
                auth=res.data;
                if(res&&res.success&&res.data&&res.data.user&&res.data.user.id){
                    openUrl=baseYodb;
                    classText='floating-button small-floating-button';
                    outerText='yo';
                    innerHtml='已登录【贵物班友会】<br>当前登录人：'+res.data.user.name;
                    if(res.data.perms.indexOf("monster:detail")>-1){
                        //executeAsyncTask();
                        innerHtml+='<br>公共标记仅供参考切勿全信';
                    }else{
                        classText+=' non-auth-button';
                        innerHtml+='<br>无权限查看完整数据';
                        innerHtml+='<br>点击自行申请';
                        openUrl=baseYodb+"/post/3";
                    }
                    //这里初始化数据
                    initBgmIds();
                    initMonsters();
                    initHome();
                    initBgmerInfoTag();
                }
            }
            if (window.top === window.self) {
                // 创建浮动按钮
                $('<button>', {
                    text: outerText, // 缩进状态时的文字
                    class: classText,
                    click: function () {
                        window.open(openUrl);
                    }
                }).appendTo('body'); // 将按钮插入到 body 中

                // 鼠标悬停时修改按钮文字
                $('.floating-button').hover(
                    function () {
                        $(this).html(innerHtml); // 展开后的文字，分成两行
                    },
                    function () {
                        $(this).text(outerText); // 缩回时的文字
                    }
                );
            }

        },
        onerror: function(error) {
            console.error("Error fetching content:", error);
        }
    });

    let initHome=function(){

        let modalHtml='<div id="markModal" class="dialog">'
        +' <div class="container" style="height:220px">'
        +'  <div class="dialog_header">'
        +'  </div>'
        +'  <div class="dialog_center">'
        +'     &nbsp;&nbsp;&nbsp;&nbsp;bgmId：<input id="markBgmId" type="text" style="width:140px" disabled>'
        +'<br>'
        +'     &nbsp;&nbsp;&nbsp;&nbsp;名称：<input id="markName" type="text" style="width:150px">'
        +'<br>'
        +'     &nbsp;&nbsp;&nbsp;&nbsp;淳朴度：<input id="markScore" max="5" min="-5" type="number" style="width:138px">'
        +'<br>'
        +'     &nbsp;&nbsp;&nbsp;&nbsp;简介：<textarea id="markCont" type="text"  style="width:150px;white-space:pre-wrap" rows="5"></textarea><br>'
        +'  </div>'
        +'   <div style="justify-content: center;display: flex;margin-top:10px;">'
        +'     <button class="cancel">取消</button>'
        +'     <button class="submit">确定</button>'
        +'    </div>'
        +'   </div>'
        +' </div>';
        $('body').append(modalHtml);

        initModalVal();

        let tooltipHtml='<div class="monster-tooltip1" id="monsterTooltip">无信息</div>';
        $('body').append(tooltipHtml);
        $(document).on("mouseenter",".monsterTag,.monsterTipBtn1",function(e){
            var tooltip = $('#monsterTooltip');
            let tempBgmId=$(this).attr("bgmId");
            let tempMyMonster=$(this).attr("myMonster");
            let tempMyMonsterScore=$(this).attr("myMonsterScore");
            let tempMyMonsterName=$(this).attr("myMonsterName");
            let tempMyMonsterCont=$(this).attr("myMonsterCont");

            let tempPublicMonster=$(this).attr("publicMonster");
            let tempMonsterScore=$(this).attr("monsterScore");
            let tempMonsterName=$(this).attr("monsterName");
            let tempMonsterCont=$(this).attr("monsterCont");


            let tempHtml='';
            if(tempMyMonster){
                let tempMyMonsterColor=getColor(tempMyMonsterScore);
                tempHtml+= '私有标记：<br><span style="color:'+tempMyMonsterColor+'">贵物：'+tempMyMonsterName+'</span>'+"<br>"
                    +'<span style="color:'+tempMyMonsterColor+'">淳朴度：'+tempMyMonsterScore+'</span><br>'
                    +'<span style="color:'+tempMyMonsterColor+'">简介：</span><br>'
                    +'<span style="white-space: pre;color:'+tempMyMonsterColor+'">'+(tempMyMonsterCont?tempMyMonsterCont:'无')+'</span>';
            }


            if(tempPublicMonster){
                if(tempHtml.length>0){
                    tempHtml+='<br><br>';
                }
                let tempMonsterColor=getColor(tempMonsterScore);
                tempHtml+=  '公共标记：<br><span style="color:'+tempMonsterColor+'">贵物：'+tempMonsterName+'</span>'+"<br>"
                    +'<span style="color:'+tempMonsterColor+'">淳朴度：'+tempMonsterScore+'</span><br>'
                    +'<span style="color:'+tempMonsterColor+'">简介：</span><br>'
                    +'<span style="white-space: pre;color:'+tempMonsterColor+'">'+(tempMonsterCont?tempMonsterCont:'无')+'</span>';
            }
            if(tempHtml.length>0){
                $("#monsterTooltip").html(text2a(tempHtml));
            }
            tooltip.css({
                top: e.pageY + 'px',
                left: e.pageX + 'px',
                display: 'block'
            });
        });
        $(document).on("mouseenter",".cliqueTipBtn1",function(e){
            var tooltip = $('#monsterTooltip');
            let tempCliqueId=$(this).attr("cliqueId");
            let tempClique=cliqueMap[tempCliqueId];

            let color=getColor(tempClique.score);
            let tempHtml= '<span style="color:'+color+'">小圈子：'+tempClique.name+'</span>'+"<br>"
            +'<span style="color:'+color+'">淳朴度：'+tempClique.score+'</span><br>'
            +'<span>简介：</span><br>'
            +'<span  style="white-space: pre;">'+(tempClique.cont?tempClique.cont:'无')+'</span>';
            $("#monsterTooltip").html(text2a(tempHtml));

            tooltip.css({
                top: e.pageY + 'px',
                left: e.pageX + 'px',
                display: 'block'
            });
        });
        $(document).on("mouseleave",".monsterTag,.monsterTipBtn1,.cliqueTipBtn1,.hoverText,#monsterTooltip",function(e){
            if(!$(e.relatedTarget).is('#monsterTooltip')){
                $('#monsterTooltip').hide();
            }
        });

        $(document).on("mouseenter",".hoverText",function(e){
            var tooltip = $('#monsterTooltip');
            let hoverText=$(this).attr("hover-text");
            $("#monsterTooltip").html(text2a(hoverText));

            tooltip.css({
                top: e.pageY + 'px',
                left: e.pageX + 'px',
                display: 'block'
            });
        });

        $("#headerProfile").find("div.actions").append('<a id="addMark" href="javascript:void(0)" class="chiiBtn"  data-toggle="modal" data-target="#markModal"><span>添加/修改备注</span></a>');

        $("#addMark").click(function(){
            $('#markModal').show(1000);
        });


        // 确定按钮的操作
        $('#markModal .submit').click(function () {
            //todo 需要重新写
            GM_xmlhttpRequest({
                method: "POST",
                url: yodbUrl+'monsterScore/save',

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data:jsonToUrlEncoded({"bgmId":$("#markBgmId").val(),"name":$("#markName").val(),"score":$("#markScore").val(),"cont":$("#markCont").val()}),
                onload: function(response) {
                    if (response.status === 200) {
                        const res = JSON.parse(response.responseText);
                        if(!res.success){
                            alert(res.message+"\n"+"未在"+baseYodb+"注册、绑定bgmId并登录无法使用私有标记功能");
                        }else{
                            $('#markModal').fadeToggle(1000);
                            location.reload();
                        }
                    } else {
                        alert(res.message+"\n"+"未在"+baseYodb+"注册、绑定bgmId并登录无法使用私有标记功能");
                        console.error("Failed to fetch content");
                    }
                },
                onerror: function(error) {
                    console.error("Error fetching content:", error);
                }
            });
        });
        // 取消按钮的操作
        $('#markModal .cancel').click(function () {
            $('#markModal').hide(1000)
        });
    }

    let initModalVal=function(){
        let ava=$("#headerProfile a.avatar");
        if(!ava){
            return;
        }
        let hrefVal=ava.attr("href");
        if(!hrefVal){
            return;
        }
        let newBgmId;
        let oldBgmId;
        if(hrefVal.indexOf("/user/")>-1){
            let split=hrefVal.split("/");
            newBgmId=split[split.length-1];
            let imgUrl=ava.find("span").css("background-image");
            if(imgUrl){
                let oldSplit=imgUrl.split("/");
                let oldTempSplit=oldSplit[oldSplit.length-1].split(".");
                oldBgmId=oldTempSplit[0];
                //没有头像无法获得原始bgmId
                if(oldBgmId=='icon'){
                    oldBgmId=newBgmId;
                }
            }
        }
        $("#markBgmId").val(newBgmId);

        GM_xmlhttpRequest({
            method: "GET",
            url: yodbUrl+'monsterScore/my/detailByBgmId/'+newBgmId,
            onload: function(response) {
                if (response.status === 200) {
                    const res = JSON.parse(response.responseText);
                    if(!res||!res.data){
                    }else{
                        setModalVal(res.data);
                    }
                } else {
                    console.error("Failed to fetch content");
                }
            },
            onerror: function(error) {
                console.error("Error fetching content:", error);
            }
        });
    }

    let setModalVal=function(modalData){
        if(modalData){
            $("#markName").val(modalData.name);
            $("#markScore").val(modalData.score);
            $("#markCont").text(modalData.cont);
        }
    }

    let bgmerInfoTags={};
    let initBgmerInfoTag=function(){
        if(window.location.host.indexOf("/anime/list/")>0){
            return;
        }
        let len=$("a.avatar").length;
        for(let i=0;i<len;i++){
            let ava=$("a.avatar").eq(i);
            let hrefVal=ava.attr("href");
            if(hrefVal.indexOf("/user/")==-1){
                continue;
            }
            let split=hrefVal.split("/");
            let newIndex=split[split.length-1];
            //暂时设置250毫秒访问一次，有可能会因为网络原因产生阻塞
            setTimeout(() => {
                setBgmerInfoTag(newIndex);
            }, i*250);
        }
    }
    let setBgmerInfoTag=function(bgmId){
        if(bgmerInfoTags[bgmId]){
            return;
        }
        bgmerInfoTags[bgmId]=1;
        let bgmerHome=baseUrl+"/user/"+bgmId;
        let bgmerAnimeCollect=baseUrl+"/anime/list/"+bgmId+"/collect";
        $.get(bgmerHome,function(html,status){
            let $html=$(html);
            let bgmerInfoTag={};
            let time;
            let $networks=$html.find("#user_home .network_service li span");
            for(let i=0;i<$networks.length;i++){
                if($networks.eq(i).text()=="Bangumi"){
                    time=$networks.eq(i).next().text().replace(" 加入","");
                    let dateParts = time.split("-");
                    let dateObject = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2]);
                    let msPerDay = 24 * 60 * 60 * 1000;
                    let nowDate = new Date();
                    let timeDiff = Math.abs(nowDate - dateObject);
                    let joinDay= Math.floor(timeDiff / msPerDay);
                    bgmerInfoTag.joinTime=time;
                    bgmerInfoTag.joinDay=joinDay;
                    if(joinDay<=30){
                        bgmerInfoTag.joinTag="&nbsp;极新&nbsp;";
                    }else if(joinDay<=100){
                        bgmerInfoTag.joinTag="&nbsp;新&nbsp;";
                    }
                    break;
                }
            }

            let animeNum=0;
            let $anime=$html.find("#anime li a[href='/anime/list/"+bgmId+"/collect']");
            if($anime.length>0){
                animeNum=$anime.eq(0).text().replace("部看过","");
            }
            bgmerInfoTag.animeNum=animeNum;
            if(animeNum==0){
                bgmerInfoTag.animeTag="&nbsp;无&nbsp;";
            }else if(animeNum<=10){
                bgmerInfoTag.animeTag="&nbsp;极少&nbsp;";
            }else if(animeNum<=100){
                bgmerInfoTag.animeTag="&nbsp;少&nbsp;";
            }

            bgmerInfoTags[bgmId]=bgmerInfoTag;

            let $user=$("strong a[href='/user/"+bgmId+"']:not(.avatar,.focus)").parent();
            let baseHtml='<span class="hoverText" hover-text="'+bgmerInfoTag.joinTime+'加入bgm" style="background-color:red;border-radius:5px;color:white;">'+(bgmerInfoTag.joinTag?bgmerInfoTag.joinTag:'')+'</span>'
            +'&nbsp;<span class="hoverText" hover-text="看过'+bgmerInfoTag.animeNum+'部动画" style="background-color:red;border-radius:5px;color:white;">'+(bgmerInfoTag.animeTag?bgmerInfoTag.animeTag:'')+'</span>';

            if(bgmerInfoTag.animeNum>0){
                $.get(bgmerAnimeCollect,function(animeHtml,animeStatus){
                    let $animeHtml=$(animeHtml);
                    let $lis=$animeHtml.find("#browserItemList li");
                    let lastLookAnimeDay=0;
                    if($lis.length>0){
                        let $href=$lis.eq(0).find("a").eq(0).prop("href");
                        $.get($href,function(subjectHtml,subjectStatus){
                            let $subjectHtml=$(subjectHtml);

                            let last_li_time;
                            // let end_time;
                            // let start_time;
                            // $subjectHtml.find("#infobox")
                            // 可以先取其他形式的日期，但我懒
                            let $sub_subtitle_li=$subjectHtml.find("#subject_detail ul.prg_list li.subtitle");
                            let $sub_last_li=$subjectHtml.find("#subject_detail ul.prg_list li").last();
                            if($sub_subtitle_li.length>0){
                                $sub_last_li=$sub_subtitle_li.eq(0).prev();
                            }
                            if($sub_last_li.length>0){
                                let sub_last_id=$sub_last_li.eq(0).find("a").attr("rel");
                                $subjectHtml.find(sub_last_id+" span.tip").contents().each(function() {
                                    if (this.nodeType === Node.TEXT_NODE) {
                                        var text = $(this).text().trim();
                                        if (text.startsWith('首播:')) {
                                            var datePart = text.substring(3).trim();
                                            if(datePart){
                                            }
                                            var dateMatch = datePart.match(/(\d{4}-\d{2}-\d{2})/);
                                            if (dateMatch) {
                                                last_li_time = new Date(dateMatch[0]);
                                            }
                                        }
                                    }
                                });
                                if(!last_li_time){
                                    last_li_time=new Date();
                                }
                                var currentDate = new Date();

                                if (last_li_time <= currentDate) {} else {
                                    //todo 暂时去掉标记失信，目前测量不准
                                    //$user.after(baseHtml+'&nbsp;<span class="hoverText" hover-text="标记失信，tag大几率不准" style="background-color:red;border-radius:5px;color:white;">&nbsp;&nbsp;标记失信&nbsp;&nbsp;</span>');
                                    return;
                                }
                            }

                            let lastLookAnimeTime=$lis.eq(0).find("p.collectInfo span.tip_j").text();
                            bgmerInfoTags[bgmId].lastLookAnimeTime=lastLookAnimeTime;
                            let dateParts = lastLookAnimeTime.split("-");
                            let dateObject = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2]);
                            let msPerDay = 24 * 60 * 60 * 1000;
                            let nowDate = new Date();
                            let timeDiff = Math.abs(nowDate - dateObject);
                            bgmerInfoTags[bgmId].lastLookAnimeDay=lastLookAnimeDay;
                            initTag(baseHtml,bgmId,$user);
                        });
                    }else{
                        bgmerInfoTags[bgmId].lastLookAnimeDay=lastLookAnimeDay;
                        initTag(baseHtml,bgmId,$user);
                    }
                });
            }else{
                // 与“无”tag重复，暂时去掉
                // $user.after(baseHtml+'&nbsp;<span class="hoverText" hover-text="没看过动画" style="background-color:red;border-radius:5px;color:white;">&nbsp;&nbsp;从未入宅&nbsp;&nbsp;</span>');
                $user.after(baseHtml);
            }
        });
    }

    let initTag=function(baseHtml,bgmId,$user){
        if(bgmerInfoTags[bgmId].lastLookAnimeDay>=365){
            bgmerInfoTags[bgmId].lastLookAnimeTag="&nbsp;&nbsp;早已脱宅&nbsp;&nbsp;";
        }else if(bgmerInfoTags[bgmId].lastLookAnimeDay>=100){
            bgmerInfoTags[bgmId].lastLookAnimeTag="&nbsp;&nbsp;已脱宅&nbsp;&nbsp;";
        }else if(bgmerInfoTags[bgmId].lastLookAnimeDay>=30){
            bgmerInfoTags[bgmId].lastLookAnimeTag="&nbsp;&nbsp;近期脱宅&nbsp;&nbsp;";
        }else if(bgmerInfoTags[bgmId].lastLookAnimeDay>=10){
            bgmerInfoTags[bgmId].lastLookAnimeTag="&nbsp;&nbsp;久未看&nbsp;&nbsp;";
        }
        $user.after(baseHtml+'&nbsp;<span class="hoverText" hover-text="最后一次看过动画在'+bgmerInfoTags[bgmId].lastLookAnimeTime+'" style="background-color:red;border-radius:5px;color:white;">'+(bgmerInfoTags[bgmId].lastLookAnimeTag?bgmerInfoTags[bgmId].lastLookAnimeTag:'')+'</span>');
    }
    function jsonToUrlEncoded(json) {
        const urlEncoded = Object.keys(json)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
        .join('&');
        return urlEncoded;
    }

    let getColor = function(score) {
        if (null == score) {
            return null;
        }
        let color = "gray";
        if (score == -4 || score == -5) {
            color = "red";
        } else if (score == -3 || score == -2) {
            color = "hotPink";
        } else if (score == -1) {
            color = "lightPink";
        } else if (score == 0) {
            color = "gray";
        } else if (score == 1) {
            color = "#77DD77"; // 较柔和的浅绿
        } else if (score == 2 || score == 3) {
            color = "#32CD32"; // 较柔和的绿
        } else if (score == 4 || score == 5) {
            color = "green";
        }
        return color;
    };
    let bgmIds=[];

    let initBgmIds=function(){
        let len=$("a.avatar").length;
        for(let i=0;i<len;i++){
            let ava=$("a.avatar").eq(i);
            let hrefVal=ava.attr("href");
            if(hrefVal.indexOf("/user/")==-1){
                continue;
            }
            let split=hrefVal.split("/");
            let bgmId=split[split.length-1];
            bgmIds.push(bgmId);
        }

        // 使用 Set 去重
        bgmIds = [...new Set(bgmIds)];
    }
    let monsters;
    let initMonsters=function(){
        GM_xmlhttpRequest({
            method: "POST",
            url: yodbUrl+'monster/vo/listByBgmIdIn',
            //url: yodbUrl+'monster/listByBgmIdIn',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: jsonToUrlEncoded({ bgmIds: bgmIds.join(",") }),
            onload: function(response) {
                console.log(response)
                if (response.status === 200) {
                    const res = JSON.parse(response.responseText);
                console.log(res)
                    if(res&&res.success){
                        monsters=res.data;
                    }
                }
                initMyMonsters();
            },
            onerror: function(error) {
                console.error("Error fetching content:", error);
                initMyMonsters();
            }
        });
    }
    let myMonsters;
    let initMyMonsters=function(){
        GM_xmlhttpRequest({
            method: "POST",
            url: yodbUrl+'monsterScore/my/listByBgmIdIn',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: jsonToUrlEncoded({ bgmIds: bgmIds.join(",") }),
            onload: function(response) {
                if (response.status === 200) {
                    const res = JSON.parse(response.responseText);
                    if(res&&res.success){
                        myMonsters=res.data;
                    }
                }
                initNodes();
            },
            onerror: function(error) {
                console.error("Error fetching content:", error);
                initNodes();
            }
        });
    }

    let cliqueMap={};
    let initNodes=function(){
        if(monsters&&monsters.length>0){
            for(let i=0;i<monsters.length;i++){
                let monster=monsters[i];
                let bgmId=monster.newBgmId?monster.newBgmId:monster.bgmId;
                setMonsterTag(bgmId);
                let $bgmSpan=$("span.monsterTag[bgmId="+bgmId+"]");
                if(monster.score||monster.score==0){
                    $bgmSpan.attr("publicMonster",true);

                    let type="";
                    if(monster.type.field=="SLAVE"){
                        type="，主号：";
                        if(monster.masterId){
                            let masterBgmId=monster.master.newBgmId?monster.master.newBgmId:monster.master.bgmId;
                            type+='<a href="/user/'+masterBgmId+'">'+monster.master.name+'</a>';
                        }else{
                            type+="未知";
                        }
                    }
                    $bgmSpan.html("("+monster.name+type+")");
                    $bgmSpan.css("color",getColor(monster.score))
                }
                $bgmSpan.attr("monsterName",monster.name);
                $bgmSpan.attr("monsterCont",monster.cont);
                $bgmSpan.attr("monsterScore",monster.score);
                //这里循环小团体
                if(monster.mcs&&monster.mcs.length>0){
                    let mcsHtml=' ';
                    let high='';
                    let middle='';
                    let low='';
                    let unknown='';
                    for(let i=0;i<monster.mcs.length;i++){
                        let mc=monster.mcs[i];
                        cliqueMap[mc.clique.id]=mc.clique;
                        let mCStatus='';
                        if(mc.mCStatus.field=="JOIN"){
                        }else if(mc.mCStatus.field=='SUS_JOIN'){
                            mCStatus='疑似';
                        }else{
                            continue;
                        }
                        if(mc.level.field=='HIGH'){
                            high+='<span style="color:red" class="cliqueTipBtn1" cliqueId="'+mc.clique.id+'">'+mCStatus+'【'+mc.clique.name+'】高级成员</span>，';
                        }else if(mc.level.field=='MIDDLE'){
                            middle+='<span style="color:hotPink" class="cliqueTipBtn1" cliqueId="'+mc.clique.id+'">'+mCStatus+'【'+mc.clique.name+'】中级成员</span>，';
                        }else if(mc.level.field=='LOW'){
                            low+='<span style="color:lightPink" class="cliqueTipBtn1" cliqueId="'+mc.clique.id+'">'+mCStatus+'【'+mc.clique.name+'】低级成员</span>，';
                        }else if(mc.level.field=='UNKNOWN'){
                            unknown+='<span style="color:gray" class="cliqueTipBtn1" cliqueId="'+mc.clique.id+'">'+mCStatus+'【'+mc.clique.name+'】成员</span>，';
                        }
                    }
                    mcsHtml+=high+middle+low+unknown;
                    mcsHtml=mcsHtml.substring(0, mcsHtml.length - 1);
                    $bgmSpan.after(mcsHtml);
                }
            }
        }
        if(myMonsters&&myMonsters.length>0){
            for(let i=0;i<myMonsters.length;i++){
                let monster=myMonsters[i];
                let bgmId=monster.monster.newBgmId?monster.monster.newBgmId:monster.monster.bgmId;
                setMonsterTag(bgmId);
                let $bgmSpan=$("span.monsterTag[bgmId="+bgmId+"]");
                let publicMonster=$bgmSpan.attr("publicMonster");
                if(!publicMonster){
                    if(monster.score||monster.score==0){
                        $bgmSpan.text("("+monster.name+")");
                        $bgmSpan.css("color",getColor(monster.score))
                    }
                }
                if(monster.score||monster.score==0){
                    $bgmSpan.attr("myMonster",true);
                }
                $bgmSpan.attr("myMonsterName",monster.name);
                $bgmSpan.attr("myMonsterCont",monster.cont);
                $bgmSpan.attr("myMonsterScore",monster.score);
            }
        }
        initPost();
    }

    let initPost=function(){
        let pageHeader=$("#pageHeader");
        let header=$("#header");
        if(pageHeader.length==1||header.length==1){
            let clearits=$("#comment_list .clearit>.inner");
            if(clearits.length==0){
                return;
            }
            let allReply=0;
            let goodReply=0;
            let badReply=0;
            let littleBadReply=0;
            let zeroReply=0;
            for(let i=0;i<clearits.length;i++){
                allReply++;
                let clearit=clearits.eq(i);
                let monsterTipBtn=clearit.find(".monsterTag");
                if(monsterTipBtn.length>=1){
                    let score=Number(monsterTipBtn.eq(0).attr("monsterScore"));
                    if(score>0){
                        goodReply++;
                    }else if(score<-2){
                        badReply++;
                    }else if(score<0&&score>=-2){
                        littleBadReply++;
                    }else{
                        zeroReply++;
                    }
                }else{
                    zeroReply++;
                }
            }
            let degree=Math.round(badReply/allReply*100);
            let html="<br><span style='color:"+(degree<=10?"green":(degree>=50?"red":"gray"))+"'>总回复数："+allReply+" 贵物回复数："+badReply+" 不那么贵物的回复数："+littleBadReply+" 贵物出现率："+degree+"%</span>";
            pageHeader.find("h1").after(html);
            header.find("h1").after(html);
        }
    }

    let setMonsterTag=function(bgmId){
        let $oldTag=$(".monsterTag[bgmId="+bgmId+"]");
        if(!$oldTag||$oldTag.length==0){
            let $user=$("a[href='/user/"+bgmId+"']:not(.avatar,.focus)");
            $user.addClass("monster");
            $user.after("<span class='monsterTag' bgmId='"+bgmId+"'></span>");
        }
    }

    let text2a=function(text){
        const urlRegex = /(https?:\/\/[^\s<>]+)/g;
        const newText = text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
        return newText;
    }
    })();