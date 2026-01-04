// ==UserScript==
// @name         其乐论坛标记Itch5刀包和EPIC送过的游戏
// @namespace    http://tampermonkey.net/
// @version      0.43
// @description  try to take over the world!
// @author       浮生若萌
// @match        *://keylol.com/t*
// @match        *://keylol.com/forum.php?mod=viewthread&tid=*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/406688/%E5%85%B6%E4%B9%90%E8%AE%BA%E5%9D%9B%E6%A0%87%E8%AE%B0Itch5%E5%88%80%E5%8C%85%E5%92%8CEPIC%E9%80%81%E8%BF%87%E7%9A%84%E6%B8%B8%E6%88%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/406688/%E5%85%B6%E4%B9%90%E8%AE%BA%E5%9D%9B%E6%A0%87%E8%AE%B0Itch5%E5%88%80%E5%8C%85%E5%92%8CEPIC%E9%80%81%E8%BF%87%E7%9A%84%E6%B8%B8%E6%88%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand('更新EPIC记录', async () => {
        window.location.href='https://keylol.com/t596303-1-1';//感谢论坛大佬 万狐飞仙
    })
    GM_registerMenuCommand('更新Itch记录', async () => {
        window.location.href='https://keylol.com/t607147-1-1';//感谢论坛大佬 BJHY1024
    })
    GM_registerMenuCommand('清空全部记录', async () => {
        var r = confirm('确认吗？清空后你需要重新"更新EPIC记录"或"更新Itch记录"');
        if (r == true) {
            localStorage.clear();
        }
    })
    function marking(){
        var mark=-1;
        if(window.location.href=='https://keylol.com/t596303-1-1'){
            mark=2;
        }
        else if(window.location.href=='https://keylol.com/t607147-1-1'){
            mark=1;
        }
        if(mark>0){
            if(!window.localStorage){
                alert('你的浏览器不支持localStorage!');
            }else{
                var r = confirm('要更新记录吗？');
                if (r == true) {
                    if(mark==1){
                        localStorage.setItem('ItchBundlesMark_v','100');
                        localStorage.setItem('818410/',1);//手动标记，此处没有判断在epic送过
                        localStorage.setItem('340400/',1);
                        localStorage.setItem('1134190/',1);
                        localStorage.setItem('847570/',1);
                        localStorage.setItem('477310/',1);
                        localStorage.setItem('1118950/',1);
                        localStorage.setItem('1041210/',1);
                        localStorage.setItem('773830/',1);
                        localStorage.setItem('49520/',1);
                    }
                    else{
                        localStorage.setItem('EpicWeeklyMark_v','100');
                        localStorage.setItem('49520/',2);//手动标记无主之地2本体，没有标记大包
                        localStorage.setItem('234650/',2);//https://store.steampowered.com/app/234650/
                        localStorage.setItem('362960/',2);//https://store.steampowered.com/app/362960/
                        localStorage.setItem('291650/',2);//https://store.steampowered.com/app/291650/
                    }
                    var workingGroup=document.querySelectorAll("a[class='steam-info-link']");
                    for (var j = 0 ; j < workingGroup.length; j++){
                        var urlTag=workingGroup[j].href.split('app/');
                        if(urlTag.length>1){
                            var gameid=urlTag[urlTag.length-1];
                            var temp = gameid.split('/')[0];
                            gameid = temp+'/';
                            if (localStorage.getItem(gameid) != null){
                                var tempGet=localStorage.getItem(gameid);
                                if(tempGet!=mark && tempGet<3 )
                                {
                                    localStorage.setItem(gameid,3);
                                }
                                else if(tempGet<3){
                                    localStorage.setItem(gameid,mark);
                                }
                            }
                            else{
                                localStorage.setItem(gameid,mark);
                            }
                            //console.log(gameid+'@'+mark);
                        }
                    }
                    if(mark==1){
                        localStorage.removeItem('733210/');
                    }
                    console.log('记录完毕');
                }
            }
        }
    }
    marking();
    if (localStorage.getItem('ItchBundlesMark_v') != null || localStorage.getItem('EpicWeeklyMark_v') != null){
        var addStrSet= [' ','<Itch已有>','<EPIC送过>','<Itch已有><EPIC送过>'];
        var workingGroup=document.querySelectorAll("a[class='steam-info-link']");
        for (var j = 0 ; j < workingGroup.length; j++){
            var urlTag=workingGroup[j].href.split('app/');
            if(urlTag.length>1){
                var gameid=urlTag[urlTag.length-1];
                var temp = gameid.split('/')[0];
                gameid = temp+'/';
                if (localStorage.getItem(gameid) != null){
                    workingGroup[j].text=addStrSet[localStorage.getItem(gameid)]+workingGroup[j].text;
                }
            }
        }
        console.log('标记完毕');
    }
})();
