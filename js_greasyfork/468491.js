// ==UserScript==
// @name         yy回复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  yolo!
// @license      MIT
// @author       lyabc@6park.com
// @match        https://www.cool18.com/bbs6*app=forum&act=threadview&tid*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/468491/yy%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/468491/yy%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var adjs=['英俊的','帅气的','丑陋的','粗鲁的','猥琐的','肥胖的','高大的'];
    var adjs0=['美丽','漂亮','性感','可爱','风骚','傲娇','高冷'];
    var characters=['小偷','律师','农民工','医生','大学生','教授','足球运动员','外卖小哥','修理工','警察','消防员','大叔','同事','房东','乞丐','邻居','劫匪','逃犯'];
    var venues=['阳台上','办公室里','试衣间内','公厕里','小树林里','公园里','小巷里','工棚里','电梯里','公交车上'];
    var actions=['用手摸奶','用手摸穴','用手摸腿','用嘴亲脸','用嘴亲脚','用嘴亲穴','用JJ顶屁股','用JJ插穴',];
    var actions1=['压在墙上','绑了起来','捂住嘴巴','突然抱住','弄晕过去','蒙住眼睛'];
    var actions2=['用手摸奶','用手摸穴','用手摸腿','用嘴亲脸','用嘴亲脚','用嘴亲穴','用JJ顶屁股'];
    var actions3=['用跳蛋强制高潮','用假鸡巴狠狠的插小穴','用手搓阴蒂到高潮','用手抠小穴到高潮','用大鸡巴操嘴','把精液射在脸上','用大鸡巴顶屁股','用粗大的鸡巴插穴到高潮',];
    var times=['一','二','三','四','五','六','七'];
    var title='';
    var content='';

    function getRandomItem(arr) {
        // get random index value
        const randomIndex = Math.floor(Math.random() * arr.length);
        // get random item
        const item = arr[randomIndex];
        return item;
    }
    function yy1(){
        title="你被一位"+getRandomItem(adjs)+getRandomItem(characters);
        content="在"+getRandomItem(venues)+getRandomItem(actions)+"了"+getRandomItem(times)+"次";
    }
    function yy2(){
        title="她被我在"+getRandomItem(venues)
        content=getRandomItem(actions)+"了"+getRandomItem(times)+"次"+"\n"+"我是一位"+getRandomItem(adjs)+getRandomItem(characters);
    }
     function yy3(){
        title="她被我在"+getRandomItem(venues)
        content="先"+getRandomItem(actions1)+"\n"+"又"+getRandomItem(actions2)+"\n"+"最后"+getRandomItem(actions3)
         +"了"+getRandomItem(times)+"次"+"\n\n\n\n\n\n\n"+"我是一位"+getRandomItem(adjs)+getRandomItem(characters);
    }
    function yy4(){
        title="这么"+getRandomItem(adjs0)+"的她被我在"+getRandomItem(venues)
        content="先"+getRandomItem(actions1)+"\n"+"又"+getRandomItem(actions2)+"\n"+"最后"+getRandomItem(actions3)
         +"了"+getRandomItem(times)+"次"+"\n\n\n\n\n\n\n"+"我是一位"+getRandomItem(adjs)+getRandomItem(characters);
    }
    function generateReply(){
        yy4();
        document.querySelector("#subject").value=title;
        document.querySelector("#content").value=content;
    }

    //Create button
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<button id="myButton2" type="button">'
        + '生成回复</button>';
    zNode.setAttribute ('id', 'myContainer2');
    document.body.appendChild (zNode);
    document.getElementById ("myButton2").addEventListener (
        "click", ButtonClickAction, false
    );
    //Button click function
    function ButtonClickAction (zEvent) {
        generateReply();
    }
    //Button style
    GM_addStyle ( `
    #myContainer2 {
        position:               fixed;
        top:                    120px;
        left:                   30px;
        font-size:              10px;
        background:             orange;
        border:                 1px outset black;
        margin:                 3px;
        opacity:                0.5;
        z-index:                9999;
        padding:                2px 2px;
    }
    #myButton2 {
        cursor:                 pointer;
    }
    #myContainer2 p {
        color:                  red;
        background:             white;
    }
` );
})();