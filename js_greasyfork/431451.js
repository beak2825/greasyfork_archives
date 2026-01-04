// ==UserScript==
// @name         Advanced Freeistic
// @version      Owlrock-3
// @description  프리스틱의 UI와 기능을 개선해줍니다.
// @author       Caenhon
// @match        https://freeistic.com/*
// @match        http://freeistic.com/*
// @icon         https://freeistic.ueuo.com/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/808994
// @downloadURL https://update.greasyfork.org/scripts/431451/Advanced%20Freeistic.user.js
// @updateURL https://update.greasyfork.org/scripts/431451/Advanced%20Freeistic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 패비콘 지정
    const favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('href', 'https://freeistic.ueuo.com/favicon.ico');
    document.querySelector('head').appendChild(favicon);

    // CSS 설정
    const moohyun = document.createElement('style');
    moohyun.innerHTML = `
        @media (max-width: 768px){
        #bo_list,#list_wrapper {
        padding: 0px 0px;
        }
        .mdel {display:none;}
        }
        `;
    document.querySelector('head').appendChild(moohyun);

    // UI 조정용 CSS 선택자 지정
    document.querySelectorAll('.active ')[3].setAttribute('class', 'active mdel');
    
    //수정, 삭제버튼 클릭 편의성 개선
    if(!!document.getElementsByClassName('fa fa-trash-o')[0]){
        let editbutton = document.getElementsByClassName('fa fa-pencil-square-o')[0].parentNode;
        let delbutton = document.getElementsByClassName('fa fa-trash-o')[0].parentNode;
        editbutton.parentNode.setAttribute('onclick', `location.href="` + editbutton.href + `"`);
        delbutton.parentNode.setAttribute('onclick', `del("` + delbutton.href + `");`);
    }
  
    //채널 검색기능 스크립트 추가
    if(!!document.querySelector('#search_input')){
        const searchscript = document.createElement('script');
        searchscript.innerHTML = `
        $("#search_input").on("propertychange change keyup paste input", function(){
            var list = document.querySelectorAll('.list_content');
            var gap = document.querySelector('#search_input').value;
            Array.from(list).forEach(function(a){
                if(a.children[0].innerText.includes(gap) || a.children[1].innerText.includes(gap) || a.children[2].innerText.includes(gap)){
                    a.style.display = '';
                }else{
                    a.style.display = 'none';
                }
            });
        });`
        document.querySelector('body').appendChild(searchscript);
    }
  
    //기타 UI 개선
    if(!!document.querySelector('#bo_list_total')){
        let total = document.querySelector('#bo_list_total');
        total.innerHTML = total.innerHTML.replace("Total", "전체");
    }
})();