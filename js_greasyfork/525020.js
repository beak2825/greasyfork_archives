// ==UserScript==
// @name         EWT_AutoPlayer
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  升学e网通自动播放脚本
// @author       Yu_LiZi
// @match        https://teacher.ewt360.com/ewtbend/bend/index/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ewt360.com
// @grant        none
// @license      GNU General Public License
// @downloadURL https://update.greasyfork.org/scripts/525020/EWT_AutoPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/525020/EWT_AutoPlayer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    setTimeout(function(){
        async function play() {
            const subj= document.querySelectorAll(".day-card-container-ivfY0");//存学科的
            var tlist = document.querySelectorAll(".task-card-container-i009V");//存任务的
            var i=0,j=0,k=0;
            var time=0,str;
            for(i=0;i<subj.length;i++)
            {
                subj[i].click();//点击学科选项卡
                await sleep(500);
                tlist = document.querySelectorAll(".task-card-container-i009V");//获取该学科任务列表
                console.log(tlist.length);
                for(j=0;j<tlist.length;j++)
                {
                    if(tlist[j].querySelector(".ewt-tag-wrap").innerHTML=="视频"&&tlist[j].querySelector(".status-374BX").innerHTML!="已完成")
                    {
                        console.log("通过判定");
                        time=0;
                        str=tlist[j].querySelector(".resource-props-1Wve8").innerHTML;//以下为获取视频时长
                        for(k=str.length-1;k>=0;k--)
                        {
                            if(str[k]==">")
                            {
                                for(k++;str[k]>='0'&&str[k]<='9';k++)
                                {
                                    time*=10;
                                    time+=str[k]-'0';
                                }
                                break;
                            }
                        }
                        time+=5;//多加五分钟保证容错
                        tlist[j].click();//进入视频
                        await sleep(time/2*60*1000);//等待视频时长
                    }
                    else
                    {
                        console.log("未通过判定");
                        console.log(tlist[j].querySelector(".ewt-tag-wrap").innerHTML);
                        console.log(tlist[j].querySelector(".status-374BX").innerHTML);
                    }
                    console.log(" "+i);
                    console.log(j);
                    await sleep(500);
                }
                await sleep(2000);
            }
        }
        play();
    },5000);
})();