// ==UserScript==
// @name         svg按钮显示动画模板
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://cn.bing.com/search?q=JavaScript%E5%88%9B%E5%BB%BAsvg&cvid=cd053798a8f14507a850c6ace5b55601&aqs=edge.1.69i57j69i59l2j69i61l3j69i65.3084j0j1&pglt=161&FORM=ANNTA1&PC=U531
// @match        https://www.pixiv.net/artworks/*
// @icon         https://c-ssl.duitang.com/uploads/item/201903/01/20190301201423_klugt.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427539/svg%E6%8C%89%E9%92%AE%E6%98%BE%E7%A4%BA%E5%8A%A8%E7%94%BB%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/427539/svg%E6%8C%89%E9%92%AE%E6%98%BE%E7%A4%BA%E5%8A%A8%E7%94%BB%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleE = document.createElement('style'),rightButton,centerWrap,number=1,elem

    document.body.appendChild(styleE);
    styleE.textContent=`
    #rightButton{
    height:21px;
    width:21px;
    border-bottom-right-radius:21px;
    border-top-right-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.15;
    left:-20px;
    cursor:pointer
    }


    #rightButton{
    position:fixed;
    z-index:1;
    font-size:14px}





    #rightButton{top:38%;background:#000}
    `;

    function getelemt(){
        //——————————————————————————
        var elem_1 = document.getElementsByTagName("svg");
        for(var h=0;h<elem_1.length;h++){
            var match_result=elem_1[h].id.match("rightButton")
            if(match_result!=null){
                return elem_1[h]
                break
            }
        }
        //——————————————————————————
    }

    function myMove() {
        elem=getelemt()
        //        var elem = document.getElementsByTagName("svg")[document.getElementsByTagName("svg").length-1];
        var pos = -20;
        var id = setInterval(frame, 5);
        function frame(){
            rightButton.addEventListener('mouseleave',()=>{
                clearInterval(id)
            })
            if (pos == 0) {
                clearInterval(id);
            } else {
                pos++;
                elem.style.left = pos + "px";
            }
        }
    }

    function myOut() {
        elem=getelemt()
        //        var elem = document.getElementsByTagName("svg")[document.getElementsByTagName("svg").length-1];
        var pose = 0;
        var id = setInterval(frame, 5);
        function frame(){
            rightButton.addEventListener('mouseenter',()=>{
                clearInterval(id)
            })
            if (pose == -20) {
                clearInterval(id);
            } else {
                pose--;
                elem.style.left = pose + "px";
            }
        }
    }

    function addRightButton () {
        rightButton = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var path2 = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        rightButton.setAttribute("aria-hidden","true");
        rightButton.setAttribute('viewbox', '0 0 24 24');
        rightButton.setAttribute('width', '24px');
        rightButton.setAttribute('height', '24px');
        //path2.setAttribute('d', 'M0 0 H 30 V 30 H 0 Z');
        path2.setAttribute('d','M 10 4 L 12 4 L 12 19 L 10 19 Z M 4 11 L 5 11 L 10 16 L 10 19 L 4 13 Z M 18 11 L 17 11 L 12 16 L 12 19 L 18 13 Z')
        path2.setAttribute('fill', '#fff');
        rightButton.appendChild(path2);
        rightButton.id = 'rightButton';
        document.body.appendChild(rightButton);
        rightButton.addEventListener('mouseenter',()=>{
            myMove()
        })
        rightButton.addEventListener('mouseleave',()=>{
            myOut()
        })
        rightButton.addEventListener('click',()=>{
            alert("hi")
        })
    }
    addRightButton ()



})();