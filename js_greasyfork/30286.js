// ==UserScript==
// @name         Youtube 聊天屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  用于屏蔽 youtube 聊天窗口中不喜欢的人。
// @author       You
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30286/Youtube%20%E8%81%8A%E5%A4%A9%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/30286/Youtube%20%E8%81%8A%E5%A4%A9%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

var allDivs;
var str="kern james,平 伍,Yingwang Zao,逯摩登先生,Lon Ch,aa A,miao yx,Chang Sandy,中央Central山脈Mountain"+
        "Zhouheaven Zhou,Klaus Goldstein,Lin Cong,yi li,照妖镜,smith jr,慕容行,张波,"+
        "静静的顿河,巴 巴,06 Demmy,zhao qiaoqiao,lym,战云龙,ang zhuo,关二爷,tom tom,"+
        "黄超,xiaoting zhu,董旭,feiqi he,郑左左,12345 54321,martin james,Ray Lee,Itopia,"+
        "대림,王立韦,zhang mario,中正 WU,刘正山,陈太虚,sw d,Jiaxin Wu,陈正康,hengsheng liu,"+
        "拉拉曾經蠟筆沒有小新,Fei Yang,伟大梦想,stephen li,We are Hmoob,國昌假哭,劉漢,ll q"+
        "I'm Here,xinmin young,ruck2007 新风,BABA BABA,中天亮,吴天,王刚,wei lu,西 西,"+
        "朱天天,luis lee,磐石,ta ta,国 慶 陳,包子大犬一起打,Z 梦,李晨,億呆億奴,Monstrous Moonshine";
window.setInterval(function(){
    allDivs = document.getElementsByClassName("style-scope yt-live-chat-text-message-renderer");
    for(var i = 0; i < allDivs.length; i++) {
        var k = allDivs[i];
        if(k.id=="content" && k.childNodes.length>5) {
          if(str.indexOf(k.childNodes[2].innerHTML)!=-1) {
            k = k.parentElement;
            k.parentElement.removeChild(k);
          }
        }
    }
}, 140);