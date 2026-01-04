// ==UserScript==
// @name         Roll20 Log轉換
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  將Roll20 Log轉換為IRC上色器可處理之格式
// @author       Wei-Ting Hsu
// @match        https://app.roll20.net/campaigns/chatarchive/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roll20.net
// @grant        none
// @license MIT
// @require https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js
// @downloadURL https://update.greasyfork.org/scripts/460716/Roll20%20Log%E8%BD%89%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/460716/Roll20%20Log%E8%BD%89%E6%8F%9B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const marsaBtn = document.createElement("button");
    //let exportString = ""
    marsaBtn.id = "marsa-custom-btn";
    marsaBtn.style = "background:red; position:absolute;top:12px ;right:12px;";
    marsaBtn.innerText = "this is marsa custom btn";
    const handleTimeData=(timeData)=>{
        if(!timeData)
            return //防呆
            const timeDataArray=timeData.slice(0,timeData.length-2).split(':')//取得小時與分鐘array
        if(timeData.includes('PM'))//處理12小時制資料
            timeDataArray[0]=timeDataArray[0]==='12'?parseInt(timeDataArray[0]):parseInt(timeDataArray[0])+12
        else
            timeDataArray[0]=timeDataArray[0]==='12'? parseInt(timeDataArray[0])-12 : parseInt(timeDataArray[0])
        return timeDataArray.join(':')

    }
    marsaBtn.onclick = () => {
        let byName = "";
        let imgSrc = "";//圖片元素
        let time="";
        const root = document.createElement("div");//輸出的根元素
        root.style = "display:flex;flex-direction:column;"
        const massgeArray = document.getElementsByClassName("content")[0].children;
        for (let message of massgeArray) {
            const spanRoot = document.createElement("div");//每一行的根元素，用於處理頭像與文字
            spanRoot.style = "display:flex;align-items:start";//簡單樣式
            const inserSpan = document.createElement("span");//輸出的擲骰結果
            const rollresult = document.createElement("span");//時間戳記
            inserSpan.style="line-height:20px;padding-left:4px;"//簡單樣式
            rollresult.style="line-height:20px;padding-left:4px;"//簡單樣式
            //console.log(message.getElementsByClassName("avatar")[0].children[0])
            // if (message.getElementsByClassName("avatar")[0]) {
            //     imgSrc = message.getElementsByClassName("avatar")[0].children[0]?message.getElementsByClassName("avatar")[0].children[0].src:'';
            // }

            if (message.getElementsByClassName("by")[0]) {
                byName = message.getElementsByClassName("by")[0].innerText.slice(0, message.getElementsByClassName("by")[0].innerText.length-1).replace(' (GM)','(GM)')
                console.log(byName)
            }
            if (message.getElementsByClassName("tstamp")[0]) {
                let timeArray=message.getElementsByClassName("tstamp")[0].innerText.split(" ");
                if(timeArray.length>1)//當日log似乎沒有日期tag
                    timeArray[3]=handleTimeData(timeArray[3])
                else
                    timeArray=[new Date().getMonth()+1,new Date().getDate(),new Date().getFullYear(),handleTimeData(timeArray[0])]
                time = dayjs(timeArray[2]+'/'+timeArray[0]+'/'+timeArray[1]+' '+timeArray[3]).format('HH:mm')

            }

            if (message.classList.contains("rollresult")) {
                message.getElementsByClassName("rolled")[0]
                //console.log(message.getElementsByClassName("formula")[0].innerText.replace('rolling','.r'))
                const  formulaArray=message.getElementsByClassName("formula")
                inserSpan.textContent =  '<'+byName+'>' + message.getElementsByClassName("formula")[0].innerText.replace('rolling',' .r').replace(/\r\n|\n/g, "") + "\r\n"
                rollresult.textContent='<DICE> '+byName+' '+'投擲'+' '+(formulaArray[0].innerText.split(' ')[2]?formulaArray[0].innerText.split(' ')[2]:' ')+':'+formulaArray[0].innerText.split(' ')[1]+'='+formulaArray[1].innerText.replace(/\r\n|\n/g, "")+'='+message.getElementsByClassName("rolled")[0].innerText
                console.log(message.getElementsByClassName("formula")[0].innerText.split(' ')[1])
                console.log(rollresult.textContent)
                //exportString += ("<span>" + message.innerText.replace(/\r\n|\n/g, "") + "\r\n" + "</span>");
            }

            else if (message.classList.contains("emote")) {
                //inserSpan.style = "color:red;  font-style:italic;"
                inserSpan.textContent = '* '+message.innerText.replace(' (GM)','(GM)') + "\r\n";
                //exportString += "<span style='color:red;  font-style:italic;'>"+ message.innerText + "\r\n" + "</span>";
            }
            else {
                inserSpan.textContent = (!message.getElementsByClassName("by")[0] ? '<'+byName+'> ' : "") + message.innerText.replace(' (GM)','(GM)').replace(byName+':','<'+byName+'> ');
                // exportString += "<span>" + (!message.getElementsByClassName("by")[0] ? byName : "") + message.innerText + "\r\n" + "</span>";
            }
            // const img = document.createElement("img");
            // img.style = "max-width:20px;max-height:20px;";
            // img.src = imgSrc;
            //timeSpan.textContent='['+time+']'
            //spanRoot.appendChild(img)//先加圖片
            //spanRoot.appendChild(timeSpan)//先加時間
            inserSpan.innerText='['+time+'] '+inserSpan.innerText
            spanRoot.appendChild(inserSpan)//再加文字
            //console.log(spanRoot)
            root.appendChild(spanRoot);
            if(rollresult.innerText){
                rollresult.innerText='['+time+'] '+rollresult.innerText
                root.appendChild(rollresult);}
        }
        const link = document.createElement("a");
        const textFileAsBlob = new Blob([root.outerHTML], { type: 'text/html' });
        link.href = window.URL.createObjectURL(textFileAsBlob);
        link.download = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss')+" Log"
        link.click();
    };
    document.body.appendChild(marsaBtn)
})();