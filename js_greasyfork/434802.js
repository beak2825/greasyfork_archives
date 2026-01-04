// ==UserScript==
// @name         天猫订单列表自动点击取消隐藏按钮
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  this!
// @author       双鱼
// @include      *://trade.taobao.com/trade*
// @icon         //img.alicdn.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434802/%E5%A4%A9%E7%8C%AB%E8%AE%A2%E5%8D%95%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8F%96%E6%B6%88%E9%9A%90%E8%97%8F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/434802/%E5%A4%A9%E7%8C%AB%E8%AE%A2%E5%8D%95%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8F%96%E6%B6%88%E9%9A%90%E8%97%8F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
 //新手，啥都不会，所有代码都是东拼西凑的，但是功能能够实现自己的需求。大神们可以多多指导一下~


var divNum=6;//订单列表的关键数字，默认为8，因为shanchu（）函数删除了2个元素，所以-2
var divNum2=7;//订单列表的关键数字默认为9，因为shanchu（）函数删除了2个元素，所以-2
var xsDiv="#sold_container > div > div.sifg-switch > div > div"; //声明按钮元素,用来模拟点击
var imgSrc="https://img.alicdn.com/imgextra/i2/O1CN01GSdb4q28dtn7GUSSr_!!6000000007956-2-tps-166-104.png";//声明按钮图片链接,关闭状态的图片地址
var xsSrc="#sold_container > div > div.sifg-switch > div > div > img";//声明按钮图片元素地址，用以获取src地址
var TopOn="#sold_container > div > div:nth-child("+divNum2+") > div:nth-child(1) > div:nth-child(3) > div > button.button-mod__button___2Ew0a.button-mod__default___vxWMG.button-mod__small___19RGg.simple-pagination-mod__prev___352hT";
var TopNext="#sold_container > div > div:nth-child("+divNum2+") > div:nth-child(1) > div:nth-child(3) > div > button:nth-child(2)";
var EndOn="#sold_container > div > div:nth-child("+divNum2+") > div:nth-child(19) > div:nth-child(2) > div > div:nth-child(1) > ul > li.pagination-prev";
var EndNext="#sold_container > div > div:nth-child("+divNum2+") > div:nth-child(19) > div:nth-child(2) > div > div:nth-child(1) > ul > li.pagination-next";
var ymbbpage="1";


shanchu();//删除一些凡人的提示和底部的广告
dianji();//点击取消隐藏按钮
tihuan();//替换超链接函数



function shanchu(){ // 删除一些广告
   document.querySelector("#sold_container > div > div:nth-child(1)").remove();
   //document.querySelector("#sold_container > div > div:nth-child(4)").innerText="";
   document.querySelector("#sold_container > div > div.row-mod__row___rFNvF").remove();
   document.querySelector("#J_Region > div.sold-ads-container").remove();
}

function tihuan(){//替换订单详情超链接
    for(var num=2;num<=16;num++){
        var url2=document.evaluate('//*[@id="sold_container"]/div/div['+divNum+']/div['+num+']/table[2]/tbody/tr[1]/td[6]/div/div/p[1]/a',document).iterateNext();
        console.log(url2);
        if(url2==null){
            console.log("跳出");
            return;}
        var url=url2.href;
        if (url!=null){//如果获取到的超链接不为空，则把链接后面加上&sifg=1
            url=url+"&sifg=1";
            url2.href=url;
        }
        console.log("运行次数："+num+"::"+url);
    }}
function shijian(){//因为进入第一页的时候，上一页的disable为false，添加点击事件会失败，所以需要把这个函数绑定到下一页按钮点击事件内主动触发添加上一页按钮事件
    if(ymbbpage=="1"){//如果为1，就为上一页新增一个点击事件
        ymbbpage="2"//把判断值修改掉，下次再点击按钮时就不会再新增点击事件了，避免重复
        //为顶部和底部的上一页按钮新增点击事件，因为在第一页的时候，顶部和底部的上一页是不能点击的，所以无法为按钮新增点击事件。
        //顶部
        document.querySelector(TopOn).onclick=function(){
        setTimeout(function(){
            dianji();
            tihuan();
            xzbeizhu();
            },2000);}
        //底部
        document.querySelector(EndOn).onclick=function(){
        setTimeout(function(){
            dianji();
            tihuan();
            xzbeizhu();
            },2000);}
    }//如果为1，就为上一页新增一个点击事件结尾括号
}

//下面是在列表显示备注内容函数
function charu(text,num){//为指定元素插入备注内容
var brDiv = document.createElement('br1');//插入回车
brDiv.className="ItemBrAfter"
brDiv.innerHTML = "<br/>";
document.getElementsByClassName("item-mod__checkbox-label___cRGUj")[num].after(brDiv);//className可以通过xpath来辅助获取。若此值是动态的，可以用xpath获取之后再使用。num起始值为0，在调用此函数的时候就已经计算好值

var ItemId = document.createElement('item');//插入备注内容
ItemId.className="ItemIdAfter";
ItemId.innerHTML = text;
ItemId.style.color='#9e9e9e';
ItemId.style['margin-left']='10px';
document.getElementsByClassName("ItemBrAfter")[num].after(ItemId);
}

function postbeizhu(ddid){//post获取指定订单号备注内容
var ajax = new XMLHttpRequest();
ajax.open('post','https://trade.taobao.com/trade/json/memoInfo.htm?user_type=seller&_input_charset=utf-8&orderid='+ddid,false);//open("method","URL",[asyncFlag],["userName"],["password"]) ，asyncFlag默认为ture，表示异步
//ajax.setRequestHeader("content-type","application/x-www-form-urlencoded; charset=UTF-8")；//post必须要有请求头
ajax.send();
return(JSON.parse(ajax.responseText));
}


function xzbeizhu(){
//循环
for(var num=2;num<=16;num++){//最大为16
    var text=document.evaluate('//*[@id="sold_container"]/div/div['+divNum+']/div['+num+']/table[1]/tbody/tr/td[1]/label/span[3]',document).iterateNext();
    var ddid=text.innerText;
       if(ddid==null){//如果获得的订单号为空，就结束
         console.log("跳出");
         return;
         }
    var bz2=postbeizhu(ddid);//获取到的订单号传递给postbeizhu函数，返回备注内容。ddid=订单号
    var bz="备注内容："+bz2.tip;//获取到的备注内容从JSON的“tip”中提取出
    charu(bz,num-2);//把获取到的备注内容传递给charu函数，函数参数：插入的内容，插入的位置
}}
//新增备注内容元素结束

 function dianji(){
   if(document.querySelector(xsSrc).src==imgSrc){
   document.querySelector(xsDiv).click();
}
    }

////////////////////页面加载完成后再运行/////////////////////////
window.onload=function(){
//如果按钮不是显示状态，则点击按钮元素

xzbeizhu();//新增备注内容元素函数

//为顶部的上一页按钮新增一个点击事件
if(document.querySelector(TopOn).disabled==false){//如果按钮是可以点击的，则
    console.log("顶部上一页可以点击")
    document.querySelector(TopOn).onclick=function(){
        setTimeout(function(){
            dianji();
            tihuan();
            xzbeizhu();
        },2000);}};
//为顶部的下一页按钮新增一个点击事件
if(document.querySelector(TopNext).disabled==false){
    console.log("顶部下一页可以点击")
    document.querySelector(TopNext).onclick=function(){//为顶部的下一页按钮新增一个点击事件，需包含点击、替换
        setTimeout(function(){
            dianji();
            shijian();
            tihuan();
            xzbeizhu();
        },2000);}};
//为底部的上一页按钮新增一个点击事件
console.log("进行到为底部新增事件")
if(document.querySelector(EndOn).disabled==false){//如果按钮是可以点击的，则
    console.log("底部上一页可以点击")
    document.querySelector(EndOn).onclick=function(){
        setTimeout(function(){
            dianji();
            tihuan();
            xzbeizhu();
        },2000);}};
//为底部的下一页按钮新增一个点击事件，这里不加判断了，默认都添加，不知道为什么if判断总是不成立
    document.querySelector(EndNext).onclick=function(){
        setTimeout(function(){
            dianji();
            shijian();
            tihuan();
            xzbeizhu();
        },2000);};

}//页面加载完成结尾括号
})();
