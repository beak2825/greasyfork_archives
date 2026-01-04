// ==UserScript==
// @name         OJ rating变幅显示
// @namespace    http://tampermonkey.net/
// @version      2024.2.28.1
// @description  OJ 显示rating变幅
// @author       Mr_Vatican
// @match        http://www.gdfzoj.com:23380/contest/*/standings
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488078/OJ%20rating%E5%8F%98%E5%B9%85%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/488078/OJ%20rating%E5%8F%98%E5%B9%85%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
(function() {
    let JS_TO_ARRAY=(scriptContent)=>{
        let startIndex=scriptContent.indexOf("[[");
        let endIndex=scriptContent.lastIndexOf("]]");
        let arrayContent=scriptContent.substring(startIndex+2,endIndex);
        let rows=arrayContent.split("],[").map(row => row.replace("[", "").replace("]", "").split(",").map(item => item.trim()));
        return rows.map(row => row.map(item => {
            if (item.startsWith("'") && item.endsWith("'")){
                return item.slice(1, -1);
            }else{
                return parseInt(item);
            }
        }));
    };
    let CrawPages=(url)=>{
        return new Promise((resolve,reject)=>{
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response){
                    resolve(response.responseText);
                },
                onerror: function(error){
                    reject(error);
                }
            });
        });
    };
    async function check_update(){
        let now_version=GM_info.script.version;
        let Page=await CrawPages('https://greasyfork.org/zh-CN/scripts/488078-oj-rating%E5%8F%98%E5%B9%85%E6%98%BE%E7%A4%BA');
        let parser=new DOMParser(),doc=parser.parseFromString(Page,'text/html');
        let lastest=doc.querySelector("#script-stats > dd.script-show-version > span").textContent;
        console.log(lastest);
        if(lastest>now_version)
        {
            alert('有新的版本更新哦！如果 greasyfork 弹出拦截信息，勾选始终同意就行了。');
            window.open("https://greasyfork.org/zh-CN/scripts/488078-oj-rating%E5%8F%98%E5%B9%85%E6%98%BE%E7%A4%BA");
        }
    }
    async function solve(){
        check_update();
        if(!GM_getValue('2024.2.28,1'))
        {
            let list=GM_listValues();
            for(let i=0;i<list.length;i++) GM_deleteValue(list[i]);
            GM_setValue('2024.2.28,1',1);
        }
        let ContestURL=window.location.href;
        let ContestName=0;
        for(let i=ContestURL.length-11,tmp=1;!isNaN(parseInt(ContestURL[i]));i--,tmp*=10)
        {
            ContestName+=tmp*parseInt(ContestURL[i]);
        }
        let row=document.querySelector("#standings-table > tbody").children;
        let head=document.createElement('th');head.textContent='rating 变幅';head.style.width='8em';
        document.querySelector("#standings-table > thead > tr").appendChild(head);
        for(let i=0;i<row.length;i++){
            if(GM_getValue(ContestName+':user'+i))
            {
                let nw=row[i].children[1].cloneNode(true),x=nw.children[0];
                x.textContent=GM_getValue(ContestName+':user'+i);
                row[i].appendChild(nw);continue;
            }
            let people=row[i].querySelector('.uoj-username'),url=people.getAttribute('href');
            let Page=await CrawPages(url);
            let parser=new DOMParser(),doc=parser.parseFromString(Page,'text/html');
            const scriptTags = doc.querySelectorAll('script[type="text/javascript"]');
            scriptTags.forEach(script => {
                let scriptContent = script.textContent;
                let regex = /var rating_data =*/;
                let match = scriptContent.match(regex);
                console.log(match);
                if (match){
                    let rating=JS_TO_ARRAY(scriptContent),flag=0;
                    let nw=row[i].children[1].cloneNode(true),x=nw.children[0];
                    for(let j=rating.length-1;j>=0;j--){
                        if(rating[j][2]==ContestName){
                            if(!rating[j][4]){flag=1;x.textContent='比赛未结束';break;}
                            let tmp='';
                            if(rating[j][5]>0) tmp='+';
                            let str=(rating[j][1]-rating[j][5])+' -> '+rating[j][1]+'('+tmp+rating[j][5]+')';
                            x.textContent=str;
                            GM_setValue(ContestName+':user'+i,str);
                            flag=1;break;
                        }
                    }
                    if(!flag){x.textContent='未参加比赛';}
                    row[i].appendChild(nw);
                }
            });
        }
    }
    window.addEventListener('load',function(){
        console.log('加载完成');
        solve();
    });
})();
