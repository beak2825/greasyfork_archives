// ==UserScript==
// @name         知乎信息显示
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  显示作者昵称，IP属地；一键屏蔽作者；显示推送类型；一键清空页面
// @author       EFZ
// @match        *://www.zhihu.com/
// @icon         https://pic2.zhimg.com/v2-d41c2ceaed8f51999522f903672a521f_s.jpg
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/446020/%E7%9F%A5%E4%B9%8E%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/446020/%E7%9F%A5%E4%B9%8E%E4%BF%A1%E6%81%AF%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

//菜单
let id1=GM_registerMenuCommand("屏蔽问题",menu1)
let id2=GM_registerMenuCommand("屏蔽关键词",menu2)
let id3=GM_registerMenuCommand("视频下载质量",menu3)
function menu1(){
    GM_setValue('questionToken',prompt('请输入待过滤问题的token，用|分隔\n例： 4739847473|2894637237|2383284211',GM_getValue('questionToken',''))||GM_getValue('questionToken',''))
}
function menu2(){
    GM_setValue('keywords',prompt('请输入待过滤词语，用|分隔\n例： 积分题|为开头，写|如果你有,',GM_getValue('keywords',''))||GM_getValue('keywords',''))
}
function menu3(){
    GM_setValue('definition',prompt('请选择视频下载的质量\nHD或SD',GM_getValue('definition','HD'))||GM_getValue('definition','HD'))
}
//CSS
GM_addStyle(".userTable{color: #06f;font-size: small;font_family: fantasy;width: 80% !important}")
//初始化
window.onload=function(){
    var adCards1=document.getElementsByClassName("Pc-card")
    var adCards2=document.getElementsByClassName("Business-Card-PcRightBanner-link")
    let num1=adCards1.length
    let num2=adCards2.length
    for(let i=0;i<num1;i++){adCards1[0].remove()}
    for(let i=0;i<num2;i++){adCards2[0].remove()}
    console.log('欢迎使用"知乎信息显示"')
}
//一键清空页面
var operator=document.getElementsByClassName("SearchBar")[0]
var ask=document.getElementsByClassName("SearchBar-askButton")[0]
var button=document.createElement("button")
button.classList.add('Button','SearchBar-askButton','css-3q84jd','Button--primary','Button--blue')
ask.setAttribute("style","position: relative;left:50px;")
button.setAttribute("style","position: relative;left:50px;")
button.textContent="清空"
button.addEventListener("click", delete_all)
operator.appendChild(button)
function delete_all(){
    let articles=document.querySelectorAll('.TopstoryItem')
    let num=articles.length
    for(let i=0;i<num;i++){articles[i].remove()}
}
//监视器
var observer=new MutationObserver((records)=>records.forEach(deal))
observer.observe(document.getElementsByClassName("Topstory-recommend")[0].children[0],{childList: true})
//信息提取,操作
function item_card(item){return JSON.parse(item.firstChild.getAttribute('data-za-extra-module')).card}
function item_title(item){return JSON.parse(item.firstChild.firstChild.firstChild.getAttribute('data-zop')).title}
function author_name(item){return item.getElementsByClassName("AuthorInfo")[1].children[0].getAttribute('content')}
function author_token(item){return item.getElementsByClassName("AuthorInfo")[1].children[2].getAttribute('content').slice(29)}
function image_collection(item){return item.querySelectorAll("img")}
function check_anonymity1(authorToken){if (authorToken){return '关注作者'}return'无法关注'}
function check_anonymity2(authorToken){if (authorToken){return '屏蔽作者'}return'无法屏蔽'}
function check_image(num){if (num>1){return '下载全部图片'}return '无图片'}
function check_video(card){if (card.has_video){return '下载视频'}return '无视频'}
function check_formula(imageCollection,type){
    if (type!='Zvideo'){
        for(let i=1;i<imageCollection.length;i++){
            if (imageCollection[i].alt=='[公式]'){
                return '有公式'}
        }
    }
    return '无公式'
}
function check_type(type){
    switch(type){
        case 'Answer': return '回答'
        case 'Zvideo': return '视频'
        case 'QuestionAsk': return '提问'
        case 'Post': return '文章'
    }
}
//信息显示
function deal(record){
    var item=record.addedNodes[0]
    if (item){
        if (item.classList.contains('TopstoryItem--advertCard')||item_card(item).content.type=='QuestionAsk'){item.remove()}
        else {
            var itemCard=item_card(item)
            var type=itemCard.content.type
            var point=item.firstChild.firstChild.firstChild.firstChild
            var table=document.createElement('table')
            point.insertBefore(table,point.firstChild)
            table.setAttribute('class','userTable')
            item.getElementsByClassName("Button")[0].click()
            var authorName=author_name(item)
            var authorToken=author_token(item)
            var imageCollection=image_collection(item)
            var imageNum=imageCollection.length
            item.getElementsByClassName("ContentItem-rightButton")[0].click()
            if (itemCard.has_video){var videoID=itemCard.content.video_id}
            if (type=='Zvideo'){
                var videoText
                var videoToken=itemCard.content.token
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: '/zvideo/'+ videoToken,
                    onload: function(response){videoText=response.responseText}
                })
            }
            table.innerHTML=`<tbody><tr><td>${check_type(type)}</td><td><button class="userButton">${check_image(imageNum)}</button></td><td><button class="userButton">${check_video(itemCard)}</button></td><td>${check_formula(imageCollection,type)}</td></tr>`+
                `<tr><td>${authorName}</td><td><button class="userButton">下载头像</button></td><td><button class="userButton">${check_anonymity1(authorToken)}</button></td><td><button class="userButton">${check_anonymity2(authorToken)}</button></td></tr></tbody>`
            var buttons=item.querySelectorAll(".userButton")
            buttons[0].addEventListener("click",function(){
                if(imageNum>1){
                    for(let i=1;i<imageNum;i++){GM_download(imageCollection[i].src,'知乎图片'+i)}
                }
            })
            buttons[1].addEventListener("click",function(){
                if (itemCard.has_video){
                    GM_xmlhttpRequest({method: 'GET',url: 'https://lens.zhihu.com/api/v4/videos/'+videoID,onload: function(response){GM_download(JSON.parse(response.responseText).playlist[GM_getValue('definition','HD')].play_url,item_title(item))}})
                }
            })
            buttons[2].addEventListener("click",function(){GM_download(imageCollection[0].src,authorName)})
            buttons[3].addEventListener("click",function(){if(authorToken){
                var key96
                var key81
                if (this.textContent=='关注作者'){GM_xmlhttpRequest({method: 'POST',url: `/api/v4/members/${authorToken}/followers`,headers: {'x-zse-93': '101_3_2.0','x-zse-96': key96,'x-zst-81': key81}});this.textContent='取消关注'}
                else if (this.textContent=='取消关注'){GM_xmlhttpRequest({method: 'DELETE',url: `/api/v4/members/${authorToken}/followers`});this.textContent='关注作者'}
            }
                                                          })
            buttons[4].addEventListener("click",function(){if (authorToken){
                if (this.textContent=='屏蔽作者'){GM_xmlhttpRequest({method: 'POST',url: `/api/v4/members/${authorToken}/actions/block`});this.textContent='取消屏蔽'}
                else if (this.textContent=='取消屏蔽'){GM_xmlhttpRequest({method: 'DELETE',url: `/api/v4/members/${authorToken}/actions/block`});this.textContent='屏蔽作者'}
            }
                                                          }
                                       )
            //GM_xmlhttpRequest({method: 'GET',url: `https://www.zhihu.com/api/v4/members/${authorToken}`,onload: function(response){......=JSON.parse(response.responseText).ip_info}})
        }
    }
}
