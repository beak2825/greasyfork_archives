// ==UserScript==
// @name         订阅号粉丝爬虫
// @version      0.2
// @description  微信订阅号粉丝列表爬虫
// @author       daggerage
// @match        https://mp.weixin.qq.com/cgi-bin/user_tag*
// @grant        none
// @namespace https://greasyfork.org/users/580382
// @downloadURL https://update.greasyfork.org/scripts/404659/%E8%AE%A2%E9%98%85%E5%8F%B7%E7%B2%89%E4%B8%9D%E7%88%AC%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/404659/%E8%AE%A2%E9%98%85%E5%8F%B7%E7%B2%89%E4%B8%9D%E7%88%AC%E8%99%AB.meta.js
// ==/UserScript==


function parseSinglePage(ids,tags){
    for(i=1;i<=20;i++){
        id=$(`#userGroups > tr:nth-child(${i}) > td.table_cell.user > div > a.remark_name`).text()
        tag=$(`#userGroups > tr:nth-child(${i}) > td.table_cell.user > div > div > span.js_tags_list.user_tag_list > span.js_tags_short > a`).text()
        if(id.empty() && tag.empty()){
            break
        }
        ids.push(id)
        tags.push(tag)
    }
}

function nextPage(){
    originId=$(`#userGroups > tr:nth-child(1) > td.table_cell.user > div > a.remark_name`).text()
    btn=$('.btn.page_next')
    if(btn.css('display')!=='none'){
        btn.click()
        return true
    }else{
        return false
    }
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=gbk,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
   
    element.style.display = 'none';
    document.body.appendChild(element);
   
    element.click();
   
    document.body.removeChild(element);
  }
   
   

function userAnalyse(ids,tags){
    console.log(ids)
    console.log(tags)
    var text=''
    for(i=0;i<ids.length;i++){
        text=text.concat(ids[i]+','+tags[i]+'\n')
    }
    download(`wxfans.csv`,text);
}

function main(){
    var ids=[]
    var tags=[]
    var interval=setInterval(function() {
         parseSinglePage(ids,tags);
         if(!nextPage()){
             userAnalyse(ids,tags)
             clearInterval(interval)
         }
        }, 1000);

    console.log(ids)
    console.log(tags)
}

main()