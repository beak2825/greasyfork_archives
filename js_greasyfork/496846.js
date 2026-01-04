// ==UserScript==
// @name         ao3屏蔽脚本
// @namespace    http://tampermonkey.net/
// @version      2024-06-02.1
// @description  用于对包含关键字的ao3文章进行屏蔽
// @author       叶椰椰
// @match        http://archiveofourown.org/*
// @match        https://archiveofourown.org/*
// @icon         https://archiveofourown.org/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496846/ao3%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/496846/ao3%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keywords = GM_getValue("AO3keywords")
    blockKeywords();


    let search = document.querySelector(".search")
    let keywordsInput = document.createElement("input")
    let confirmButton = document.createElement("button")

    confirmButton.innerText = "确定"
    keywordsInput.type = "text"
    keywordsInput.size = 31
    keywordsInput.style.margin = "0 10px"
    keywordsInput.placeholder = "请填写屏蔽词,多个屏蔽词之间用英文逗号隔开"

    if(keywords){

         keywordsInput.value = keywords
    }



    search.parentElement.insertBefore(keywordsInput, search)
    search.parentElement.insertBefore(confirmButton, search)

    confirmButton.addEventListener("click", function(){
         GM_setValue("AO3keywords", keywordsInput.value)
         console.log("用户输入为" + GM_getValue("AO3keywords"))
         alert("已设置屏蔽，屏蔽词为：" + GM_getValue("AO3keywords"))
         window.location.href = window.location.href
    })

    

    function blockKeywords(){

        if(keywords){
            let workList = document.querySelectorAll('[role="article"]')

            for(let i = 0; i < workList.length; i++){
                let item = workList[i]
                let title = item.querySelector(".heading :first-child")?.textContent
                let description = item.querySelector(".summary")?.textContent
                let list = item.querySelectorAll("li")


                for(let i = 0; i < list.length; i++){
                    console.log(list[i].textContent)
                    if(isContainKeywords(list[i].textContent)){

                        item.innerHTML = '<div>该文章已被屏蔽</div>'
                    }
                }

                if(title&&isContainKeywords(title)===true || description&&isContainKeywords(description) === true){
                      item.innerHTML = '<div>该文章已被屏蔽</div>'
                }

            }

        }

    }

    function isContainKeywords(str){



        if(keywords){
            let keywordsList = keywords.split(",")

            for(let j = 0; j < keywordsList.length; j++){
                if(isEnglistStr(keywordsList[j])){
                    let regex = new RegExp(`\\b${keywordsList[j]}\\b`, 'i')
                    if(regex.test(str)){
                        return true
                    }
                }else{
                    let regex = new RegExp(keywordsList[j], 'i')
                    if(regex.test(str)){
                        return true
                    }
                }

            }
            return false;
        }
    }

    function isEnglistStr(str){

        const regex = /^[A-Za-z]+$/;
        return regex.test(str);

    }

})();