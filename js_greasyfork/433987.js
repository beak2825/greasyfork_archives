// ==UserScript==
// @icon        https://github.com/favicon.ico
// @name        【自用】Youtube自动英文字幕
// @namespace   heckles
// @match       https://www.youtube.com/*
// @grant       none
// @version     v2022.01.13
// @author      heckles
// @description 自动切换到英文字幕
// @downloadURL https://update.greasyfork.org/scripts/433987/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91Youtube%E8%87%AA%E5%8A%A8%E8%8B%B1%E6%96%87%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/433987/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91Youtube%E8%87%AA%E5%8A%A8%E8%8B%B1%E6%96%87%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==


//1.创建一个marker来终止
markcontainer = document.createElement("div");
document.body.appendChild(markcontainer);
markcontainer.setAttribute("id", "markcontainer");

//2.设置interval监测
if (document.getElementById("browser-app") || document.getElementById("masthead")) { //这两个元素，有一个是true，就往下执行
    var sx = setInterval(function () { //间隔执行
        if (window.location.href.indexOf("watch?v=") < 0) { //如果网址不匹配
            return false; //就不执行         【这里只能匹配域名，然后筛，直接用watch的网址，从首页点进去会不触发】
        } else {
            if (document.querySelector("div.html5-video-container video.video-stream.html5-main-video").src == document.getElementById("markcontainer").innerHTML) { //如果blob没变（每点一次哪怕重复点击视频，blob都会变）
                return false; //就不执行
            } else {
                if (!document.querySelector("div.html5-video-container video.video-stream.html5-main-video") || !document.querySelector("div#text-container #text") || !document.querySelector(".ytp-settings-button")) { //如果video、频道名、设置按钮有一个找不到，即还没加载
                    return false; //就不执行
                } else {
                    StartSub(); //执行函数
                }
            }
        }
    }, 1000); //间隔时间,毫秒
    //return;
}

//3.开始执行
function StartSub() {
                                                                                                                                                           console.log(">>>>>>>>>>>>>      Youtube自动英文字幕已运行      <<<<<<<<<");
    document.querySelector(".ytp-settings-button").click(); //点击设置按钮
    if (document.querySelector(".ytp-menuitem-label-count")) { //如果有字幕（通过字幕按钮不含"无法显示字幕"）
                                                                                                                                                           console.log(">>>>>>>>>>>>>      有字幕");
        
        document.querySelector(".ytp-menuitem-label-count").click(); //点击设置下面的字幕按钮
        //点开之后才能检测到字幕明细，加ID好在后面判断，别再遍历时判断
        var caps = document.querySelectorAll(".ytp-popup.ytp-settings-menu .ytp-menuitem-label");
        for (i = 0; i < caps.length; i++) {
            if (caps[i].innerHTML.indexOf("英语") == 0 && caps[i].innerHTML.indexOf("自动") == -1) { //不知道为啥必须有两个=才行，英语不含自动
                caps[i].setAttribute("id", "EngSub");
            }
            if (caps[i].innerHTML.indexOf("英语") == 0 && caps[i].innerHTML.indexOf("自动") > -1) { //不知道为啥必须有两个=才行，英语含自动
                caps[i].setAttribute("id", "EngSubAuto");
            }
            if (caps[i].innerHTML.indexOf("关闭") == 0) { //把关闭也标记一下
                caps[i].setAttribute("id", "closeSub");
            }
        }
        //开始判断，如果有英语字幕（再区分是否中文频道）
        if (document.querySelector("#ytp-id-17").innerHTML.indexOf("英语") > -1) { //如果有英语字幕
                                                                                                                                                           console.log(">>>>>>>>>>>>>      有英文字幕      <<<<<<<<<");
            if (document.querySelector("#columns #text a").innerHTML.match(/[\u4e00-\u9fa5]/gi) === null) { //频道名不含中文   #columns #text a也能满足被针对修改后的界面
                if (document.getElementById("EngSub")) {
                    document.getElementById("EngSub").click();
                } else { //否则选择英语（自动生成）
                    document.getElementById("EngSubAuto").click();
                }
            } else { //频道名含中文，关闭字幕
                document.getElementById("closeSub").click();
                                                                                                                                                           console.log(">>>>>>>>>>>>>      但中文频道      <<<<<<<<<");              
            }
        } else {//没有有英语字幕，关闭字幕
            document.getElementById("closeSub").click();
                                                                                                                                                           console.log(">>>>>>>>>>>>>      没有英文字幕      <<<<<<<<<");          
        }
        markcontainer.innerHTML = document.querySelector("div.html5-video-container video.video-stream.html5-main-video").src; //标记一下已检查过
        document.body.click(); //关闭菜单
    } else { //没有字幕
        markcontainer.innerHTML = document.querySelector("div.html5-video-container video.video-stream.html5-main-video").src; //标记一下已检查过
        document.body.click(); //关闭菜单
                                                                                                                                                           console.log(">>>>>>>>>>>>>      没字幕      <<<<<<<<<");          
    }
}


