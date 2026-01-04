// ==UserScript==
// @name         萌典 搜索框 输入 简体 转换 繁体
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description    萌典查词的时候，搜索框，输入简体，转换成繁体，无需再手动转换输入法
// @author        批小将
// @match        https://www.moedict.tw/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/398573/%E8%90%8C%E5%85%B8%20%E6%90%9C%E7%B4%A2%E6%A1%86%20%E8%BE%93%E5%85%A5%20%E7%AE%80%E4%BD%93%20%E8%BD%AC%E6%8D%A2%20%E7%B9%81%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/398573/%E8%90%8C%E5%85%B8%20%E6%90%9C%E7%B4%A2%E6%A1%86%20%E8%BE%93%E5%85%A5%20%E7%AE%80%E4%BD%93%20%E8%BD%AC%E6%8D%A2%20%E7%B9%81%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    let sswords = "";

    function md_addListener(){
        console.log('mengdian_123');
        if(sswords){
            console.info("mengdian_load success");
            console.log(sswords["一个"]);
            console.log(sswords["一箭双雕"]);
            let input = document.getElementById('query');
            input.addEventListener('input', function(e){
                let jianti = e.target.value;
                if (jianti in sswords){
                    e.target.value = sswords[jianti];
                }
            });
        }else{
            console.error("load conversion data failed");
        }
    }

    async function main(){
        let url = "https://mengdian.xyz/s2t.json";
        let response = await fetch(url);
        //sswords = response.json();  //这里需要一个extra await, fuck.
        sswords = await response.json();
        console.log('mengdian_xxxx');
        md_addListener();
    }

    main();

})();