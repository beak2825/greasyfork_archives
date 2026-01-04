// ==UserScript==
// @name         推特PC版網頁測試
// @namespace    https://greasyfork.org/zh-TW/scripts/375896
// @version      0.2.推特
// @description  twitter
// @author       You
// @match        https://twitter.com/*
// @match        http://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375896/%E6%8E%A8%E7%89%B9PC%E7%89%88%E7%B6%B2%E9%A0%81%E6%B8%AC%E8%A9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/375896/%E6%8E%A8%E7%89%B9PC%E7%89%88%E7%B6%B2%E9%A0%81%E6%B8%AC%E8%A9%A6.meta.js
// ==/UserScript==

/*
推特用的
*/
(function(x) {
    'use strict';//嚴格模式
    console.log( 'IIFE 立即函式' );
    console.log(x.location.href);
    try{
        //全域變數
        time = new Date();
        gg=[];
        gg['poi']='123';
        gg.ypa='456';
        //
    }
    catch(err){
        //console.log(err);
    }
    finally{
        console.log('try-catch');
    }
    //
    poi01();
    //poi02();//找圖片
    poi03();
    //poi04();//測試
    // Your code here...
})(window);

function www(){
    var elements = document.getElementsByClassName('GalleryNav'); //
    Array.from(elements).forEach(element => {
        //console.log(element.style);
    });

}
function poi01(){
    var oneElement = document.querySelector('.GalleryNav');
    //console.log(oneElement);
    var allElements = document.querySelectorAll('.GalleryNav');
    //console.log(allElements);
    Array.from(allElements).forEach(element => {
        //console.log(element.style);
        element.style.width="30%";
        element.style.border="1px solid red";
    });

}

function poi04(){
    //console.log(window.location);
    if("onhashchange" in window) {
        //alert("The browser supports the hashchange event!");
        window.onhashchange = function(){
            console.log(window.location.hash);
        };
    }
    window.addEventListener('hashchange',function(e){
        console.log(e);
        console.log('網址改變hashchange='+window.location.href);
    });
    window.addEventListener('popstate',function(e){
        console.log(e);
        console.log('歷史改變popstate='+window.location.href);
    });
    window.addEventListener('pushState',function(e){
        console.log(e);
        console.log('歷史改變pushState='+window.location.href);
    });
    window.addEventListener('replaceState',function(e){
        console.log(e);
        console.log('歷史改變replaceState='+window.location.href);
    });
}
function poi02(){
    var oneElement = document.querySelector('.AdaptiveMediaOuterContainer >.AdaptiveMedia >.AdaptiveMedia-container img');
    //console.log(oneElement.src);
    //console.log(oneElement.childNodes);//空
    var allElements = document.querySelectorAll('.AdaptiveMediaOuterContainer >.AdaptiveMedia >.AdaptiveMedia-container img');
    //console.log(oneElement.childNodes);//6
    Array.from(allElements).forEach(element => {
        //console.log(element.src);
    });
}
function poi03b(x){
    console.log(x);//.src
    var url=x;
    //移除小圖

}

function poi03(){
    //console.log(oneElement);
    //oneElement.style.borderLeft="4px solid blue";
    //console.log(oneElement.style);

    var allElements = document.querySelectorAll('.stream >ol >li >.tweet >.content');//
    //Returns a non-live NodeList of all the matching element nodes.
    //console.log(allElements);

    var ele_count=0;
    var cc=0;
    window.addEventListener("scroll", function(event) {
        //console.log(event.timeStamp);
        //console.log(oneElement.childNodes);//6
        //
        //console.log(oneElement.style);
        var oneElement01 = document.querySelector('.stream');//.stream-item-footer
        //oneElement01.style.borderLeft="4px solid blue";
        cc=cc+1;
        if(cc%2){
            //oneElement01.style.borderLeft="4px solid blue";
        }else{
            //oneElement01.style.borderLeft="4px solid red";
        }

        var allElements02 = document.querySelectorAll('.stream >ol >li .tweet >.content');
        console.log(allElements02.length);
        //.stream >ol >li >.tweet >.content >.stream-item-footer
        if(allElements02.length > 100){
            var elem = document.querySelector('.stream >ol >li .tweet');
            //elem.parentNode.removeChild(elem);
        }

        if(ele_count == allElements02.length){
            //沒事
        }else{
        }
        //數量改變時 就繪製
        allElements02.forEach(function(x,y){
            var element=x.querySelector('.stream-item-footer');
            //console.log(x,y);//數量
            //console.log(x.childNodes);//Nodes清單
            //ele_count=element.childNodes.length;
            //console.log(tmp);//Nodes數量
            if(element.querySelector('.xopowo')){
                //console.log('有');
                var allElements04 = x.querySelectorAll('.js-media-container');
                allElements04.forEach(function(x,y){
                    //console.log(x.src);
                    var element=x;
                    element.style.border="1px solid blue";
                });
            }else{
                //console.log('無');
                //
                element.style.border="1px solid red";
                //element.innerHTML = 'innerHTML';
                var allElements03 = x.querySelectorAll('.AdaptiveMediaOuterContainer >.AdaptiveMedia >.AdaptiveMedia-container .AdaptiveMedia-photoContainer img');
                //console.log(allElements03);
                var tmp01='';
                var tmp02='';
                var tmp03='';
                //tmp02='https://i2.wp.com/';
                //tmp02='http://res.cloudinary.com/demo/image/fetch/q_auto:best/';//,h_2000,w_2000,c_limit
                //tmp02='http://php-wotupset.codeanyapp.com/777/180216v0.php?inputurl=';
                //tmp02='http://wotupset.herokuapp.com/180216v0.php?inputurl=';
                //tmp02='http://verniy.iscool.pl/180216v0.php?inputurl=';
                tmp02='http://mirror.s601.xrea.com/180216v0.php?inputurl=';
                //

                allElements03.forEach(function(x,y){
                    //console.log(x.src);//
                    tmp03=x.src.substr(8)+':large';//
                    tmp03='http://'+tmp03;
                    if(y==0){
                        //console.log(x,y);//
                        //x.style='';
                        //console.log(x.naturalWidth);//naturalWidth naturalHeight
                        if(x.naturalWidth == 1200 ){

                        }else{
                            var tmp=x.parentElement.parentElement.parentElement.parentElement.parentElement;
                            //console.log(tmp.remove());

                        }
                    }

                    tmp01=tmp01+' <a href="'+tmp02+tmp03+'" target="_blank">🌴</a>';
                });
                tmp01='<span style="font-size: large;">'+tmp01+'</span>';

                var text = document.createElement('p');
                text.className='xopowo';
                text.innerHTML='🍂'+tmp01;
                element.appendChild(text);


            }
        });
        //更新元素數量
        ele_count=allElements02.length;

        //console.log('元素數量='+allElements02.length);

    });//window.addEventListener

    //
    //var elements = document.getElementsByClassName('pya').style; //
    //console.log(document.styleSheets);
    //console.log(document.styleSheets[0].rules[0].cssRules);//.cssRules[0].cssText
    //Failed to read the 'cssRules' property from 'CSSStyleSheet'
    //chrome.exe --allow-file-access-from-files



    var text = document.createElement('div');
    text.className='pya';
    text.id='pya';
    text.innerHTML='twitter';
    document.getElementsByTagName('body')[0].appendChild(text);

    var css,style;
    css = '.pya {position:fixed;z-index:10;bottom:40%;left:0px; border:"1px solid #000";}';//background-color:#ff0000;
    style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName('head')[0].appendChild(style);



    var poi =document.querySelector('.pya');
    poi.innerHTML='<a href="#page-outer">▲頂端</a>';
    //var poi_css =poi.style.getPropertyValue('position');//getComputedStyle
    var poi_css =window.getComputedStyle(poi).getPropertyValue("position");
    //console.log(poi_css);//顯示元素的css設定



}//function poi03(){//

