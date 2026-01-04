// ==UserScript==
// @name         港科大空调系统方波式省钱
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  港科大空调系统波式省钱
// @author       Kesdiael Ken
// @match        https://w5.ab.ust.hk/njggt/app/home
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_download
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/474264/%E6%B8%AF%E7%A7%91%E5%A4%A7%E7%A9%BA%E8%B0%83%E7%B3%BB%E7%BB%9F%E6%96%B9%E6%B3%A2%E5%BC%8F%E7%9C%81%E9%92%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/474264/%E6%B8%AF%E7%A7%91%E5%A4%A7%E7%A9%BA%E8%B0%83%E7%B3%BB%E7%BB%9F%E6%96%B9%E6%B3%A2%E5%BC%8F%E7%9C%81%E9%92%B1.meta.js
// ==/UserScript==

(() => {
    'use strict';
    $(()=>{
        function wait(identifier){
            return new Promise(res=>{
                if($(identifier).length){res(true);return;}
                let cnt=50;
                let itv=setInterval(()=>{
                    if($(identifier).length){
                        clearInterval(itv);
                        res(true);
                    }
                    cnt--;
                    if(!cnt){
                        clearInterval(itv);
                        res(false);
                    }
                },100);
            })
        }
        async function addPanel(){
            await wait("#root > div > div.main-section > div > div > div > div.four.wide.computer.sixteen.wide.tablet.four.wide.column.welcome-section > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(4)");
            $("#root > div > div.main-section > div > div > div > div.four.wide.computer.sixteen.wide.tablet.four.wide.column.welcome-section > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(4)").after(`
                <div style="align-items: center; width: 100%; margin-top: 10px; border: 1px solid rgb(242, 242, 242); display: flex; flex-direction: row; padding: 10px 5px; border-radius: 25px;" class="switch">
                    <div style="margin-left: 15px;">
                        <img src="https://svgur.com/i/x6m.svg" class="ui image" style="z-index: 999;min-height:20px;min-width:20px">
                    </div>
                    <div style="flex: 3 1 0%; margin-left: 5px;">
                        <small style="font-size: 12px;">
                            Switching Frequency
                        </small>
                    </div>
                    <div style="font-size:12px;font-weight:thin" class="block">
                        Power-on&nbsp for
                        <span class="input">
                            <input id="input_1" class="box" placeholder="5" value title autocomplete="off">
                            min
                        </span>
                        <span>&nbsp</span>in
                        <span class="input">
                            <input id="input_2" class="box" placeholder="10" value title autocomplete="off">
                            min
                        </span>
                    </div>
                    <button class="start">
                        <span style="font-size:10px;margin:0px 5px" id="start_wording">START</span>
                    </button>
                </div>
            `);
            GM_addStyle(`
                .input{
                    border: 1px solid rgb(242, 242, 242);
                    border-top-width: 1px;
                    border-right-width: 1px;
                    border-bottom-width: 1px;
                    border-left-width: 1px;
                    border-top-style: solid;
                    border-right-style: solid;
                    border-bottom-style: solid;
                    border-left-style: solid;
                    border-top-color: rgb(242, 242, 242);
                    border-right-color: rgb(242, 242, 242);
                    border-bottom-color: rgb(242, 242, 242);
                    border-left-color: rgb(242, 242, 242);
                    margin:0px 3px;
                    padding:5px;
                    border-radius:10%;
                    display:inline-block;
                }
                .box{
                    border-width:0;
                    width:30px;
                }
                .box:focus{
                    outline: none;
                }
                .start{
                    background-color:white;
                    border-radius:20%/50%;
                    color:orange;
                    border-color:orange;
                    margin:10px;
                }
                .start:hover{
                    cursor:pointer;
                }
                .switch{
                    flex-flow: row wrap;
                    background-color:rgb(255,255,255);
                    transition: 0.3s;
                }
                .block{
                    margin:10px 20px;
                }
            `);
        }
        addPanel();
        // function status(){
        //     return new Promise(res=>{
        //         GM_xmlhttpRequest({
        //             method:"GET",
        //             url:"https://w5.ab.ust.hk/njggt/api/app/prepaid/ac-status",
        //             headers:{
        //                 "Authorization":"Bearer qmBN2trJrJ4lts1y8ii3",
        //             },
        //             onload:(r)=>{
        //                 res(JSON.parse(r.response).data.ac_status.DisconnectRelay);
        //             }
        //         });
        //     });
        // }
        addJS_Node (null, null, overrideSelectNativeJS_Functions);
        function overrideSelectNativeJS_Functions () {
            window.confirm = function alert (message) { return true; }
        }
        function addJS_Node (text, s_URL, funcToRun) {
            var D = document;
            var scriptNode = D.createElement ('script');
            scriptNode.type = "text/javascript";
            if (text) scriptNode.textContent = text;
            if (s_URL) scriptNode.src = s_URL;
            if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

            var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
            targ.appendChild (scriptNode);
        }
        function status(){
            return $("span.ant-switch-inner").text()=="ON";
        }
        let activate=0;
        async function alternate(){
            await wait("#root > div > div.main-section > div > div > div > div.four.wide.computer.sixteen.wide.tablet.four.wide.column.welcome-section > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(3) > button");
            activate++;
            if(activate%2==0){
                $("#start_wording").text("START");
                $(".switch")[0].style.backgroundColor="rgb(255, 255, 255)";
                return;
            }
            let btn=document.querySelector("#root > div > div.main-section > div > div > div > div.four.wide.computer.sixteen.wide.tablet.four.wide.column.welcome-section > div:nth-child(3) > div > div > div:nth-child(2) > div:nth-child(4) > div:nth-child(3) > button");
            let on=$("#input_1")[0].value,tot=$("#input_2")[0].value;
            if(isNaN(on)){alert("Input Type Error");activate--;return;}
            if(isNaN(tot)){alert("Input Type Error");activate--;return;}
            if(on=="")on=$("#input_1")[0].placeholder;if(tot=="")tot=$("#input_2")[0].placeholder;
            on=Number(on);tot=Number(tot);
            let off=tot-on;
            if(off<=0){alert("Total Lapse <= Power-on Lapse");activate--;return;}
            console.log(on,off);
            let stat=status();
            if(!stat)btn.click();
            alt(on,off,btn,activate);
            $("#start_wording").text("EXIT");
            $(".switch")[0].style.backgroundColor="rgb(204, 255, 204)";
        }
        function alt(num1,num2,btn,actnum){
            setTimeout(()=>{
                if(activate!=actnum)return;
                btn.click();
                alt(num2,num1,btn,actnum);
            },num1*60000);
        }
        async function addEvent(){
            await wait(".start");
            $(".start").click(alternate);
        }
        addEvent();
    });
})();