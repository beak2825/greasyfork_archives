// ==UserScript==
// @name         抖音直播自动点赞
// @description  抖音直播的自动点赞,可自动开始自动停止,0侵入感界面
// @author       zzw6776
// @version      1.7
// @match        *://live.douyin.com/*
// @match        *://*.douyin.com/root/live/*
// @match        *://*.douyin.com/*/live/*
// @license      MIT
// @namespace https://greasyfork.org/users/168189
// @downloadURL https://update.greasyfork.org/scripts/498350/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/498350/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==


(function() {
    'use strict';

    setTimeout(() => {


        addqpClick();
        addwyqpClick()
        let isStart = false;
        let page = document.getElementsByTagName('body')[0];
        console.log('载入自动点赞脚本')


        let total = document.createElement("div");
        total.className="total";
        total.innerHTML='<p class="dzs">点赞数</p><p class="dian">·</p><p class="kolento-all">0</p>';
        page.append(total);

        var timeBox;
        let totalNum = 0;
        let num = document.getElementsByClassName('kolento-all')[0];
        num.innerHTML=totalNum;

        let target = document.getElementsByClassName('LO5TGkc0');

        let sstk = document.getElementsByClassName('VBIRbGZt');




        document.getElementsByClassName('dzs')[0].onclick=function(){
            if(isStart==false){
                ksdz();


            }else{
                console.log('停止点赞');
                clearInterval(timeBox);
                isStart==false;
            }
        }

        setInterval(()=>{
            console.log('定时');
            ksdz()
        },1000*60*20)

        document.getElementsByClassName('total')[0].style.left = (document.getElementsByClassName('ej6cQnWN')[0].getBoundingClientRect().left+180)+ 'px'
        document.getElementsByClassName('total')[0].style.top = (document.getElementsByClassName('ej6cQnWN')[0].getBoundingClientRect().top)+ 'px'




        document.addEventListener('keyup',(e)=>{
            console.log(e);
            switch(e.which) {
                case 89:
                    wyqpClick();
                    return;
                case 72:
                    qpClick();
                    return;

            }
        });





        function yccbl() {
            setTimeout(() => {
                if(document.getElementsByClassName('J6zKCgYE chatroom_close').length!=0){
                    document.getElementsByClassName('J6zKCgYE chatroom_close')[0].addEventListener('click', function() {


                        console.log('隐藏侧边栏');
                        document.getElementsByClassName('total')[0].style.display='none';

                        zkcbl()
                    })}
            },"100");
        }


        function zkcbl() {
            setTimeout(() => {
                document.getElementsByClassName('h5GOqbU9 chat_room_fold')[0].addEventListener('click', function() {


                    console.log('展开侧边栏');
                    document.getElementsByClassName('total')[0].style.display='';

                    //addSvgClick();
                })
            },"100");
        }

        function addwyqpClick() {
            document.getElementsByClassName('psKR9RS0')[1].addEventListener('click',wyqpClick);
        }

        function wyqpClick () {
            document.getElementsByClassName('total')[0].style.display='none';
            setTimeout(() => {
                console.log('点击网页全屏');

                document.getElementsByClassName('total')[0].style.left = (document.getElementsByClassName('ej6cQnWN')[0].getBoundingClientRect().left+180)+ 'px'
                document.getElementsByClassName('total')[0].style.top = (document.getElementsByClassName('ej6cQnWN')[0].getBoundingClientRect().top)+ 'px'
                document.getElementsByClassName('total')[0].style.display='';
                yccbl()

            } ,"100")
        }

        function addqpClick() {

            document.getElementsByClassName('xgplayer-icon')[1].addEventListener('click',qpClick );
        }

        function qpClick () {
            document.getElementsByClassName('total')[0].style.display='none';
            setTimeout(() => {
                console.log('点击全屏');

                document.getElementsByClassName('total')[0].style.left = (document.getElementsByClassName('ej6cQnWN')[0].getBoundingClientRect().left+180)+ 'px'
                document.getElementsByClassName('total')[0].style.top = (document.getElementsByClassName('ej6cQnWN')[0].getBoundingClientRect().top)+ 'px'
                document.getElementsByClassName('total')[0].style.display='';
                yccbl()
                // addqpClick();
            },"100")
        }

        function ksdz(){
            // 执行点赞脚本
            console.log('执行点赞脚本')
            isStart=true
            if(timeBox!= null){
                clearInterval(timeBox);
            }

            timeBox = setInterval(()=>{
                totalNum++;             

                if(sstk.length>0){
                    console.log('自动停止')
                    clearInterval(timeBox);
                    isStart=false;

                }
                num.innerHTML=totalNum;
                target[0].click();
            },randomNum(50,150))


        }

        function addGlobalStyle(css) {
            var head, style;
            head = document.getElementsByTagName('head')[0];
            if (!head) { return; }
            style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = css;
            head.appendChild(style);
        }

        function randomNum(minNum,maxNum){
            switch(arguments.length){
                case 1:
                    return parseInt(Math.random()*minNum+1,10);
                    break;
                case 2:
                    return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                    break;
                default:
                    return 0;
                    break;
            }
        }

        addGlobalStyle(


            `

            .total {
                font-size: 14px;
                font-weight: 500;
                position: fixed;
                //top: 81.5px;
                //right: 85px;
                z-index: 500;
                //background: linear-gradient(90deg,#f4c8c7 0,#0c61bb 45%,#0c61bb 55%,#fcc6c6)!important;
                color: rgba(255,255,255,.9);
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all ease 0.3s;
                //padding: 5px 8px;
                line-height:20px;
                border-radius: 20px;
 
            }
          .dian {
               color: rgba(255,255,255,.5);
    width: 15px;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    display: flex;
            }

            .kolento-all {
             font-size: 14px;
                font-weight: 500;
                 color: rgba(255,255,255,.5);
            }

            `
        );



    },'5000')



})();