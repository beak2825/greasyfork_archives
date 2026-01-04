// ==UserScript==
// @name         hookpushpickup3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hookpushpickupp call
// @author       You
// @connect      10.32.122.152
// @match        https://secondhand.ricacorp.com/*
// @match        https://secondhand-beta.ricacorp.com/*
// @match        https://secondhand-alpha.ricacorp.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @license    GPL
// @downloadURL https://update.greasyfork.org/scripts/472892/hookpushpickup3.user.js
// @updateURL https://update.greasyfork.org/scripts/472892/hookpushpickup3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let psno=JSON.parse(window.localStorage.getItem("firebase:authUser:AIzaSyBSCoBLG4GXcJApcCVad32c6LHDdlw6GNo:messagecenter")).uid;
    var _push = Array.prototype.push;
    window.setInterval(runpickup,13*60*777,true);
    Array.prototype.push=function(){
        if(typeof arguments[0]==="string"){

            if(arguments[0].indexOf("新客戶查詢")==-1 && arguments[0].indexOf("livechat")!=-1 && arguments[0].indexOf("unifiedMessages")!=-1 ){
                //console.log(arguments[0]);
                console.log("runpickup(false)");
                runpickup(false);
            }
        }
        _push.apply(this,arguments);
    }

    function runpickup(mode){
        if((new Date()).getHours()<6){
            return false;
        }
        let n=0;
        let tsno=psno;
        if(mode){
            console.log("runpickup(true)");
            let tsnos=["rc.042300","rc.057435", "rc.058071", "rc.057951", "rc.046467", "rc.025021", "rc.057422", "rc.055911", "rc.055691", "rc.055459", "rc.040306", "rc.053838", "rc.055696", "rc.055699", "rc.057417"];
            n=Math.floor(Math.random()*(tsnos.length));
            tsno=tsnos[n];
        }
        fetch(`https://${location.host}/rcAPI/firebaseMessage?channelId=${tsno}_livechat&startDate=&contains=&orderBy=DESC&limit=1`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://secondhand.ricacorp.com/instant-message",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(res=>res.json()).then(json=>{
            for(let k in json.results[0]){
                let inkey=json.results[0][k];
                console.log(inkey);
                if(inkey.content && (inkey.content.includes("BO85078660") || inkey.content.includes("BH85080896"))){
                    break;
                }
                let nd=new Date();
                if((nd-inkey.createdate)<=30*60*1000 && window.localStorage.getItem(`cd${n}`)!=inkey.createdate){
                    window.localStorage.setItem(`cd${n}`,inkey.createdate);
                    if(inkey.commands && inkey.title.includes("新客戶查詢")){
                        let rn=inkey.commands[0].params.providedBody.requestNo;
                        console.log(rn);
                        autopickup(rn,psno);
                    }
                }
            };
        });
    }

    function autopickup(rn,sno){
        let eto="764786090@qq.com"
        // let stoken="SCT208036TTjGQ12aOL16MNj5LJoGrhEod";
        // let sno=window.localStorage.getItem("rcSecondhandLoggedInUserName");
        let lrn=window.localStorage.getItem("lrn");
        if(rn==lrn){console.log("hv pick");return;}
        window.localStorage.setItem("lrn",rn);
        let bodydata={
            "method": "PUT",
            "url": `https://ricacorp.azure-api.net/private/rcagencyonthego/v3/chatroom/?userId=${sno}`,
            "headers": ["Ocp-Apim-Subscription-Key", "Authorization"],
            "body": {
                "requestNo": rn,
                "userId": sno
            }
        };

        fetch(`https://${location.host}/rcAPI/various`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
                "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://secondhand.ricacorp.com/instant-message",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body":JSON.stringify(bodydata),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(res=>res.json()).then(json=>{
            console.log(json.responseTextForDisplay);
            // fetch(`https://sctapi.ftqq.com/${stoken}.send?title=${psno},${encodeURIComponent(json.responseTextForDisplay.substring(0,9))}&desp=${encodeURIComponent(json.responseTextForDisplay)}`).then(response => response.json()).then(json => console.log(json)).catch(err => console.log('Request Failed', err));
            sendemail(eto,`${psno},${json.responseTextForDisplay.substring(0,9)}`,json.responseTextForDisplay);
            GM_notification ( {
                title:`${psno},${encodeURIComponent(json.responseTextForDisplay.substring(0,9))}`, text: json.responseTextForDisplay, image: 'https://i.stack.imgur.com/geLPT.png',
                onclick: () => {
                    console.log ("My notice was clicked.");
                    window.focus ();
                }
            } );
        });
    }

    function sendemail(toemail,title,content){
        GM_xmlhttpRequest({
            method: "GET",
            url: `http://10.32.122.152:8080/sendemail?eto=${encodeURIComponent(toemail)}&title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`,

            onload: function(response) {
                console.log(response.responseText);
            }
        });

    }
})();