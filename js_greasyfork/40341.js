// ==UserScript==
// @name         Bilibili - Whose Bullets
// @namespace    http://www.xljbear.com/
// @version      1.4.5
// @description  为您探寻到那些弹幕后的作者
// @author       XljBearSoft
// @match        https://www.bilibili.com/video/av*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon	 https://www.bilibili.com/favicon.ico
// @supportURL	 https://greasyfork.org/zh-CN/scripts/40341
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40341/Bilibili%20-%20Whose%20Bullets.user.js
// @updateURL https://update.greasyfork.org/scripts/40341/Bilibili%20-%20Whose%20Bullets.meta.js
// ==/UserScript==
(function() {
    setTimeout(WhoseBulletsInit,1000);
})();
var BiliBili_midcrc = function(){
    const CRCPOLYNOMIAL = 0xEDB88320;
    var startTime=performance.now(),
        crctable=new Array(256),
        create_table=function(){
            var crcreg,
                i,j;
            for (i = 0; i < 256; ++i)
            {
                crcreg = i;
                for (j = 0; j < 8; ++j)
                {
                    if ((crcreg & 1) !== 0)
                    {
                        crcreg = CRCPOLYNOMIAL ^ (crcreg >>> 1);
                    }
                    else
                    {
                        crcreg >>>= 1;
                    }
                }
                crctable[i] = crcreg;
            }
        },
        crc32=function(input){
            if(typeof(input)!='string')
                input=input.toString();
            var crcstart = 0xFFFFFFFF, len = input.length, index;
            for(var i=0;i<len;++i){
                index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                crcstart = (crcstart >>> 8) ^ crctable[index];
            }
            return crcstart;
        },
        crc32lastindex=function(input){
            if(typeof(input)!='string')
                input=input.toString();
            var crcstart = 0xFFFFFFFF, len = input.length, index;
            for(var i=0; i<len;++i){
                index = (crcstart ^ input.charCodeAt(i)) & 0xff;
                crcstart = (crcstart >>> 8) ^ crctable[index];
            }
            return index;
        },
        getcrcindex=function(t){
            for(var i=0;i<256;i++){
                if(crctable[i] >>> 24 == t)
                    return i;
            }
            return -1;
        },
        deepCheck=function(i, index){
            var tc=0x00,str='',
                hash=crc32(i);
            tc = hash & 0xff ^ index[2];
            if (!(tc <= 57 && tc >= 48))
                return [0];
            str+=tc-48;
            hash = crctable[index[2]] ^ (hash >>> 8);
            tc = hash & 0xff ^ index[1];
            if (!(tc <= 57 && tc >= 48))
                return [0];
            str+=tc-48;
            hash = crctable[index[1]] ^ (hash >>> 8);
            tc = hash & 0xff ^ index[0];
            if (!(tc <= 57 && tc >= 48))
                return [0];
            str+=tc-48;
            hash = crctable[index[0]] ^ (hash >>> 8);
            return [1,str];
        };
    create_table();
    var index=new Array(4);
    return function(input){
        var ht=parseInt('0x'+input)^0xffffffff,
            snum,i,lastindex,deepCheckData;
        for(i=3;i>=0;i--){
            index[3-i]=getcrcindex( ht >>> (i*8) );
            snum=crctable[index[3-i]];
            ht^=snum>>>((3-i)*8);
        }
        for(i=0;i<10000000; i++){
            lastindex = crc32lastindex(i);
            if(lastindex == index[3]){
                deepCheckData=deepCheck(i,index);
                if(deepCheckData[0])
                    break;
            }
        }
        if(i==10000000)
            return -1;
        return i+''+deepCheckData[1];
    };
};
var page_url = "";
var b_crc = null;
var ToastTime = null;
var danmuList = [];
var danmu_count = 0;
var menu = '<li class="context-line context-menu-function gotoSpace" data-append="1"><a class="context-menu-a js-action gotoSpace" title="" href="javascript:void(0);" data-disabled="0"><span>正在获取...</span></a></li>';
var menu_fail = '<li class="context-line context-menu-function" data-append="1"><a class="context-menu-a js-action" title="" href="javascript:void(0);" data-disabled="0">- (゜ロ゜;)抱歉!居然失败了... -</a></li>';
var toast = '<div id="x_toast" style="box-shadow: white 0px 0px 3px;" class="player-tooltips info center-center animation active"><div class="tooltip" style="padding:15px 20px 15px 20px;"></div></div>';
function CreateMessageBox(){
    var html = '<div id="x_message_box" style="background-color: black;font-size: 13px;color: white;text-align: center;padding: 10px;"></div>';
    $(".bilibili-player-area").prepend(html);
    $("#x_message_box").hide();
}
function ShowMessage(message){
    if(!$("#x_message_box")[0])CreateMessageBox();
    $("#x_message_box").slideDown(500);
    $("#x_message_box").html("Whose Bullets : " + message);
    setTimeout(HideMessage,3000);
}
function HideMessage(){
    $("#x_message_box").slideUp(500);
}
function GetAuthorProfile(mid){
    $.post("https://space.bilibili.com/ajax/member/GetInfo",{mid:mid},function(result){
        switch(result.data.sex){
            case "男":
                sex = '<span style="color:#00a1d6">汉子</span>';
                break;
            case "女":
                sex = '<span style="color:#fb7299">妹纸?</span>';
                break;
            default:
                sex = '<span style="color:#ff6c00">秀吉</span>';
        }
        vip = result.data.vip.vipStatus==1?" vip-red-name":"";
        place = result.data.place==""||result.data.place==undefined?"无地区信息":result.data.place;
        profile = '<div style="min-height:0px;z-index:-5;" class="bb-comment"><div style="padding-top:10px;" class="comment-list"><div class="list-item"><div class="reply-box"><div style="padding:0px" class="reply-item reply-wrap"><div style="margin:15px;" class="reply-face"><img src="'+ result.data.face +'" alt=""></div><div class="reply-con"><div class="user"><a style="display:initial;padding: 0px;" data-usercard-mid="'+ mid +'" href="//space.bilibili.com/'+ mid +'" target="_blank" class="name'+ vip +'">'+ result.data.name +'</a> '+ sex +'<a style="display:initial;padding: 0px;" href="//www.bilibili.com/blackboard/help.html#%E4%BC%9A%E5%91%98%E7%AD%89%E7%BA%A7%E7%9B%B8%E5%85%B3" target="_blank"><i class="level l'+ result.data.level_info.current_level +'"></i></a></div><div class="info"><span class="time">'+ place +'</span></span></span></div></div></div></div></div></div></div>';
        $(".context-menu-function.gotoSpace").html(profile);
        if($(".bilibili-player-context-menu-container.white.active>ul>li:eq(1)>a").html().substr(0,2)=="取消"){
            $(".bilibili-player-context-menu-container.white.active>ul>li:eq(1)>a").html("取消对" + result.data.name + "的弹幕屏蔽");
        }else{
            $(".bilibili-player-context-menu-container.white.active>ul>li:eq(1)>a").html("屏蔽" + result.data.name);
        }
        $(".bilibili-player-context-menu-container.white.active>ul>li:eq(4)>a").html("查看"+ result.data.name +"的所有弹幕");
    });
}
function ProcessDanmu(showToast){
    crcidList = [];
    $.ajax({
        url:"https://comment.bilibili.com/" + window.cid + ".xml",
        dataType:"XML",
        success: function(danmu_xml){
            $(danmu_xml).find("d").each(function(index,item){
                danmuList[index] = $(item).attr("p").split(",");
                danmuList[index].push($(item).html());
            });
            danmu_count = danmuList.length;
            if(!showToast)return;
            if(danmuList.length>0){
                ShowToast(danmuList.length + "条弹幕处理成功！");
            }else{
                ShowToast("弹幕库为空！");
            }
        }
    });
}
function PageReload(){
    if(page_url == window.location.href){
        return;
    }
    page_url = window.location.href;
    ShowToast("重载视频信息中...");
    danmuList = [];
    ProcessDanmu(true);
}
function ShowToast(message){
    if(!$("#x_toast")[0]){
        $("body").append(toast);
    }
    $("#x_toast>div").html("Whose Bullets : " + message);
    $("#x_toast").css("top",document.documentElement.clientHeight/2  - $("#x_toast")[0].offsetHeight/2 + "px");
    $("#x_toast").css("left",document.documentElement.clientWidth/2 - $("#x_toast")[0].offsetWidth/2 + "px");
    $("#x_toast").hide();
    $("#x_toast").fadeIn(500);
    clearTimeout(ToastTime);
    ToastTime = setTimeout(function(){$("#x_toast").fadeOut(1000);},3000);
}
function TimeCompareUp(danmu1,danmu2){
    return danmu1[0]-danmu2[0];
}
function TimeCompareDown(danmu1,danmu2){
    return danmu2[0]-danmu1[0];
}
function DanmuCompareUp(danmu1,danmu2){
    if(danmu1[8]<danmu2[8]){
        return -1;
    }else if(danmu1[8]>danmu2[8]){
        return 1;
    }
    return 0;
}
function DanmuCompareDown(danmu1,danmu2){
    if(danmu1[8]<danmu2[8]){
        return 1;
    }else if(danmu1[8]>danmu2[8]){
        return -1;
    }
    return 0;
}
function SendTimeCompareUp(danmu1,danmu2){
    return danmu1[4]-danmu2[4];
}
function SendTimeCompareDown(danmu1,danmu2){
    return danmu2[4]-danmu1[4];
}
function WhoseBulletsInit(){
    ShowToast("初始化弹幕库...");
    b_crc = new BiliBili_midcrc();
    $.ajax({
        url:"https://comment.bilibili.com/" + window.cid + ".xml",
        dataType:"XML",
        success: function(danmu_xml){
            $(danmu_xml).find("d").each(function(index,item){
                danmuList[index] = $(item).attr("p").split(",");
                danmuList[index].push($(item).html());
            });
            danmu_count = danmuList.length;
            if(danmuList.length>0){
                $(document).on("contextmenu",".danmaku-info-row.bpui-selected",function(){
                    if($(".bilibili-player-danmaku-wrap-child").css("display")!="none")
                        return;
                    cid = $(this).attr("dmno");
                    mid = b_crc(danmuList[cid][6]);
                    if(mid == -1){
                        ShowToast("嗷~用户信息获取失败了...");
                        $(".bilibili-player-context-menu-container.white.active>ul").prepend(menu_fail);
                        return;
                    }
                    $(".bilibili-player-context-menu-container.white.active>ul").prepend(menu).attr("mid",mid);
                    $(".bilibili-player-context-menu-container.white.active").css("z-index","999");
                    GetAuthorProfile(mid);
                });
                $(document).on("click","a.gotoSpace",function(){
                    mid = $(this).parent().parent().attr("mid");
                    window.open("https://space.bilibili.com/"+ mid +"/#/");
                });
                $(document).on("click",".bilibili-player-danmaku-btn-time",function(){
                    if($(".bilibili-player-danmaku-wrap-child").css("display")!="none")
                        return;
                    if($(this).find(".bilibili-player-icon-arrow-up")[0]||$(this).find(".bp-icon.icon-general-pullup-s")[0]){
                        danmuList.sort(TimeCompareUp);
                    }else{
                        danmuList.sort(TimeCompareDown);
                    }
                });
                $(document).on("click",".bilibili-player-danmaku-btn-danmaku",function(){
                    if($(".bilibili-player-danmaku-wrap-child").css("display")!="none")
                        return;
                    if($(this).find(".bilibili-player-icon-arrow-up")[0]||$(this).find(".bp-icon.icon-general-pullup-s")[0]){
                        danmuList.sort(DanmuCompareUp);
                    }else{
                        danmuList.sort(DanmuCompareDown);
                    }
                });
                $(document).on("click",".bilibili-player-danmaku-btn-date",function(){
                    if($(".bilibili-player-danmaku-wrap-child").css("display")!="none")
                        return;
                    if($(this).find(".bilibili-player-icon-arrow-up")[0]||$(this).find(".bp-icon.icon-general-pullup-s")[0]){
                        danmuList.sort(SendTimeCompareUp);
                    }else{
                        danmuList.sort(SendTimeCompareDown);
                    }
                });
                $(document).on("contextmenu",".bilibili-player-video",function(){
                    //Todo
                });
                page_url = window.location.href;
                setInterval(PageReload,1000);
                ShowToast(danmuList.length + "条弹幕处理成功！");
            }else{
                ShowToast("弹幕库为空！");
            }
        }
    });
}