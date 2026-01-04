// ==UserScript==
// @name      get all QQ group member
// @name:zh-TW   QQ群成员提取器
// @namespace    http://WWW.NTRSN.CN/
// @version      0.0
// @description   download all QQ group  member as TXT file
// @description:zh-TW 下載qq群成員導入txt
// @author       WWW.RUSSIAVK.CN
// @supportURL   873248164@qq.com
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=873248164@qq.com&item_name=Greasy+Fork+donation
// @include      https://qun.qq.com/member.html*
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/376659/get%20all%20QQ%20group%20member.user.js
// @updateURL https://update.greasyfork.org/scripts/376659/get%20all%20QQ%20group%20member.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /* function CheckScroll(){
        let marginBot = 0;
        if (document.documentElement.scrollTop){
            marginBot = document.documentElement.scrollHeight - (document.documentElement.scrollTop+document.body.scrollTop)-document.documentElement.clientHeight;
        } else {
            marginBot = document.body.scrollHeight - document.body.scrollTop- document.body.clientHeight;
        }
        return marginBot;
    }
    function Scroll(){
        let interval;
        let val;
        if(CheckScroll()>0)
        {
            interval = window.setInterval(function(){
                scrollTo(0,document.body.scrollHeight);
                if(CheckScroll==0)
                {
                    alert('完毕');
                    console.log('完毕');
                    window.clearInterval(interval);
                    SaveToTXTOld();
                }
            },100);
        }
    }
    function SaveToTXTOld()
    {
        let QQList=document.querySelectorAll("td:nth-child(5)");
        let  title=document.getElementById('groupTit').innerText;

        while(typeof(QQList)=='undefined'){
            alert('找不到链接哦！');
            SaveToTXT();
        }
        let QQTXT;
        for(var i in QQList){
            QQTXT+=QQList[i].innerText+'@qq.com \n';
        }
        let blob = new Blob([QQTXT], {type: "text/plain;charset=utf-8"});
        let save=saveAs(blob,title+".txt");
        if(save)
        {
            setTimeout(function close(){
                //window.close();
            },500);
        }
        else{
            alert('保存失败！');
        }
    }

    function Confirm()
    {
        let r=confirm("是否提取QQ号？");
        if (r==true)
        {
            Scroll();
        }
    }*/
    function AppendChild()
    {
        var AutoButton=document.createElement('div');
        AutoButton.style.width='150px';
        AutoButton.style.height = '30px';
        AutoButton.style.position='fixed';
        AutoButton.style.right='30px';
        AutoButton.style.bottom='30px';
        AutoButton.style.marginRight='15px';
        AutoButton.style.color='#2a5885';
        AutoButton.style.textAlign='center';
        AutoButton.innerText='提取';
        AutoButton.style.fontSize='large';
        AutoButton.style.backgroundColor='#FFFFFF';
        AutoButton.style.cursor='pointer';
        document.body.appendChild(AutoButton);
        let checkbox = document.createElement('input');
        checkbox.type='checkbox';
        checkbox.id='c';
        checkbox.style.width='30px';
        checkbox.style.height = '30px';
        checkbox.style.position='fixed';
        checkbox.style.right='0px';
        checkbox.style.bottom='30px';
        document.body.appendChild(checkbox);
        AutoButton.onclick=function(){
            AutoGetList();
        };
    }
    function AutoGetList(){
        let delayTime=1000;
        let PageCount,per_page=0;// let PageCount
        let AllUserList=[];
        //let interval=window.setInterval( function(){
        async function GetResult(){
            let Result=await AutoGetValue();//
            if(Result!==false){
                let Write= 'AllUserList.push(Result[id][i]["uin"]);console.log("======================id======================"+Result[id][i]["uin"]);'
                if(document.querySelector('#c').checked==true)
                {
                    alert('aaaaa');
                    Write=Write.replace('(','(Result[id][i]["nick"]+"----"+').replace('g(','g(Result[id][i]["nick"]+');
                    console.log(Write);
                }
                for(let id in Result){
                    for( var i in Result[id] ){
                        if(Result[id][i]['uin']){
                            eval(Write);
                        }
                    }
                }
                // window.clearInterval(interval);
                AllUserList=Array.prototype.concat.apply([],AllUserList);
                console.log('======================結束！降维的AllUserList======================'+AllUserList);
                SaveToTXT(AllUserList);
                return
            }
            else{
                console.log('======================失败重试======================');
                AutoGetValue();
            }
        }
        GetResult();
        //  },delayTime);
    }
    function SaveToTXT(AllUserList)
    {
        let AllUserListBlob = new Blob([AllUserList.toString().replace(/,/g,'\n').replace(/&nbsp;/ig, "")], {type: "text/plain;charset=utf-8"});
        saveAs(AllUserListBlob,document.querySelector('#groupTit').innerText+'txt');
    }
    async  function AutoGetValue()// async
    {
        const GroupID=parseInt(document.querySelector('#groupTit').innerText.substr(document.querySelector('#groupTit').innerText.indexOf('(')+1).replace(')',''))
        let Count=document.querySelector('#groupMemberNum').innerText+'&sort=0';
        if(document.querySelector('.select-result span')){
            let G=document.querySelector('.select-result span').innerText.replace('性别： ','');
            switch (G){
                case '女':
                    Count+='&g=1';
                    console.log('女');
                    break;
                case '男':
                    Count+='&g=0';
                    console.log('男');
                    break;
            }
        }
        let val='gc='+GroupID+'&st=0&end='+Count+'&bkn=1599454968';//gc=171268365&st=0&end=20&sort=0&g=1&bkn=1599454968
        let Value=[];
        const c=document.cookie;
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method:'POST',
                url:'https://qun.qq.com/cgi-bin/qun_mgr/search_group_members',
                data:val,
                headers: {
                    'accept':'application/json, text/javascript, */*; q=0.01',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'cookie':c,
                    'origin':'https://qun.qq.com',
                    'referer':'https://qun.qq.com/member.html',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest',
                },
                onload:async function(responseDetails) {
                    if(responseDetails.responseText.indexOf('err')==-1)
                    {
                        let List=JSON.parse(responseDetails.responseText); //console.log('===============Value==============='+responseDetails.responseText);
                        resolve(List);
                    }
                    else{
                        console.log('===============err==============='+responseDetails.responseText);
                        reject(false)
                    }
                }
            });//return Value
        })
    }
    //document.ready=function(){//AutoGetValue();
    // setTimeout(function(){
    AppendChild();
    // },500);//Confirm();
    //                 };
})();