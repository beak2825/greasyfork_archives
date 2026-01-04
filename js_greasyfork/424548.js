// ==UserScript==
// @name         WooTalk
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        https://wootalk.today/
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/424548/WooTalk.user.js
// @updateURL https://update.greasyfork.org/scripts/424548/WooTalk.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var sleep = async (duration) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, duration);
        });
    };

    async function leave(){
        unsafeWindow.changePerson();
        await sleep(300)
        let leaveButton = document.getElementById("popup-yes")
        leaveButton.click()
        document.getElementById("popup-cancel").click()
        await sleep(1000)
    }

    async function talk(){
        let startButton = document.getElementById("startButton")
        startButton.click()
        sleep(2000)
        let input = document.getElementById("messageInput")

        let flag = true
        let count = 0
        while(flag){
            let sysTexts = document.getElementsByClassName("system text");
            for(let j=0;j<sysTexts.length;j++){
                let content = sysTexts[j].textContent;
                if(content.indexOf("加密連線完成")!=-1){
                    flag = false
                }
            }
            if(!flag){
                input.value = "男"
                unsafeWindow.sendMessage()
            }
            count++
            if(count>20){flag = false}
            await sleep(500)
        }


        flag = true
        count = 0
        let blackList = ["與你附近的女孩發生性關係"]
        while(flag){
            let texts = document.getElementsByClassName("stranger text")

            for(var i=0;i<texts.length;i++){
                if(texts[i].childNodes[1].textContent.indexOf("男")!=-1 && texts.length<3){
                    flag=false
                    await leave()
                    await talk()
                }

                if(texts[i].childNodes[1].textContent.indexOf("女")!=-1 && texts.length<3){
                    unsafeWindow.audio.play()
                }

                for(let x=0;x<blackList.length;x++){
                    if(texts[i].childNodes[1].textContent.indexOf(blackList[x])!=-1){
                        flag=false
                        await leave()
                        await talk()
                    }
                }
            }

            let content = document.getElementById("messages").textContent
            if(content.indexOf("對方離開了")!=-1){
                flag=false
                unsafeWindow.changePerson();
                await sleep(500)
                await talk()
            }

            if(count>20 && texts.length==0){
                flag=false
                await leave()
                await talk()
            }

            if(document.getElementById("startButton").style.opacity=="1"){
                flag=false
                await talk()
            }

            await sleep(500)
            count++
        }
    }

    await sleep(3000)
    await talk()
})();