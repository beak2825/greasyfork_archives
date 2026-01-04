// ==UserScript==
// @name         秀读图书互助
// @namespace    book.ucdrs
// @version      1.2.10
// @author       Stone
// @match        *://book.ucdrs.superlib.net/search*
// @match        *://book.ucdrs.superlib.net/views/specific/*
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @description  查询全国图书馆参考咨询联盟、读秀、超星、龙岩是否有书互助,自动获取435w无重全文PDF,（全网独家）不需要某度会员高速下载PDF！另（独家）全程免注册、免脚本、手机即可搜,下,看，复制浏览器打开：   http://172.247.14.184/
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/443293/%E7%A7%80%E8%AF%BB%E5%9B%BE%E4%B9%A6%E4%BA%92%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/443293/%E7%A7%80%E8%AF%BB%E5%9B%BE%E4%B9%A6%E4%BA%92%E5%8A%A9.meta.js
// ==/UserScript==
 
start();
function show(id){
 let btn =
 `<p style="font-family: Verdana;
 font-size: 18px;
 color: black;
 text-align: center;
 margin-top: 1px;
 margin-bottom: 1px;">
 ${id}</p>
 <p style="text-align: center;">
 <a href="${'https://d.5mbook.com:90/buy.aspx?fr=2&ss='}${id}"
 font-weight: bold;
 font-size: 18px;
 style="color: green;">
 ${'获取文献'}
 </a>
 </p>
 <p style="text-align: center;">
 <a href="${'https://d.5mbook.com:90/promo.aspx?fr=3&ss='}${id}"
 font-weight: bold;
 font-size: 18px;
 style="color: red;">
 ${'月卡获取文献'}
 </a>
 </p>
`;
    return btn;
}
function showFail(id){
 let btn =
 `<p style="font-family: Verdana;
 font-size: 18px;
 color: black;
 text-align: center;
 margin-top: 1px;
 margin-bottom: 1px;">
 ${id}</p>`;
 return btn;
}
 
function getMatchResult(){
     let send_requestajax = $('script:contains(send_requestajax)')
     let key = /ssn=(\d{3,})/
     return send_requestajax.text().match(key);
}
function doSpecific(){
    let r = getMatchResult();
    let d = $('div.tubookimg>img:only-child');
 
    if(r)
    {
        d.after(show(r[1]));
    }
    else if(r = location.href.match(/dxNumber=(\d+)/))
    {
        d.after(showFail(r[1]));
    }
}
 
function doSearch()
{
    let items = $('td[id="b_img"]');
    let ssidKey = 'input[name*="ssid"]';
 
    items.each((i,item)=>
    {
        let itemData = $(item);
        let id = itemData.parent('tr').find(ssidKey).val();
        if(id)
        {
            itemData.after(show(id));
        }
        else if(id= itemData.find('a[href]').attr('href').match(/dxNumber=(\d+)/))
        {
            itemData.after(showFail(id[1]));
        }
     });
}
 
 
function start(){
    let specificKey = '/views/specific/'
    let seachKey = '/search';
    if(location.href.includes(specificKey))
    {
       doSpecific();
    }
    else if(location.href.includes(seachKey))
    {
       doSearch();
    }
}