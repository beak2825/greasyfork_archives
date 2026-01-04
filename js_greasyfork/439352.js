// ==UserScript==
// @name         back to top
// @namespace    https://github.com/776488326
// @version      1.0.0
// @description  回到顶部
// @author       冯亮
// @date         2022-01-01
// @match        http*://*.bilibili.com/video/*
// @include      *://*
// @license      BSD 3-Clause License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439352/back%20to%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/439352/back%20to%20top.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const css = `
        #top {
            position: fixed;
            right: 110.75px;
            bottom: 50px;
            width: 150px;
            height: 174px;
            cursor: pointer;
            z-index: 998;
            background-position: 0 0;
            text-align: center;
            background-image: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-1d54fa1d-9401-4557-9110-96deeab99096/0b59ae81-0662-40bf-b87b-04966990a3ab.png);
            background-repeat: no-repeat;

        }
        #top:hover{
            background-image: url(https://vkceyugu.cdn.bspapp.com/VKCEYUGU-1d54fa1d-9401-4557-9110-96deeab99096/f0b56473-6683-422e-8b73-a0d5fa90b1dd.png);
            -webkit-animation: ani steps(1, start) 0.5s infinite;
            animation: ani steps(1, start) 0.5s infinite;
        }
        @keyframes ani{
            0% {
                background-position: 0 0;
            }

            25% {
                background-position: -150px 0;
            }
            50% {
                background-position: -300px 0;
            }
            75% {
                background-position: -450px 0;
            }
            100% {
                background-position: -600px 0;
            }
        }
        `;
        const sty = document.createElement('style');
        sty.innerHTML = css;
        sty.type = 'text/css';
        const head = document.querySelector('head');
        head.appendChild(sty);
        const body = document.querySelector("body");
        const div = document.createElement('div');
        div.id = "top";
        div.style = 'display:none;';
        div.addEventListener('click',function toTop(){
          console.log('1111');
          window.scrollTo({
              left: 0,
              top: 0,
              behavior: 'smooth'
          })
        })
        body.appendChild(div);

        window.addEventListener("scroll",isdis)
        function isdis(){
          const top = this.document.querySelector('#top');
          let to = document.documentElement.scrollTop;
          let ischg = true;
          if(to>900 && ischg)
          {
            top.style.display = 'block';
            ischg = false;
          }
          else if(to<900){
            top.style.display = 'none';
            ischg = true;
          }
        }

})();