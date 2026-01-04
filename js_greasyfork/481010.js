// ==UserScript==
// @name         PTCG汉化
// @namespace    https://www.example.com/
// @version      1.3.2
// @description  PTCG汉化脚本
// @author       erickdeng
// @match        https://play.tcgone.net/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481010/PTCG%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/481010/PTCG%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==


const LANG_DIR = 'https://ptcg-1256197202.cos.ap-guangzhou.myqcloud.com/L10N/';



const Card_Serials = [

    'team_up',
    'unbroken_bonds',
    'unified_minds',
    'hidden_fates',
    'cosmic_eclipse',
    'sword_shield_promos',
    'sword_shield',
    'rebel_clash',
    'darkness_ablaze',
    'champions_path',
    'vivid_voltage',
    'shining_fates',
    "battle_styles",
    "chilling_reign",
];


let en2cn = {};
function init() {

    var lang_urls = []

    for (let i = Card_Serials.length - 1; i >= 0; i--) {
        var url = LANG_DIR + Card_Serials[i] + ".json"
        lang_urls.push(url)
    }
    //console.log(urls)

    var promises = lang_urls.map(function (url) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onload = function () {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    resolve(data);
                } else {
                    resolve(null);
                }
            };
            xhr.onerror = function () {
                reject(xhr.statusText);
            };
            xhr.send();
        });
    });

    Promise.all(promises)
        .then(function (results) {

            results.forEach(function (result) {
                if (result) {
                    result.forEach(function (item) {
                        if (!en2cn.hasOwnProperty(item.name)) {
                            en2cn[item.name] = item.cn_name;
                        }
                    });
                }
            });
            //console.log(en2cn)
        })
        .catch(function (error) {
            console.log('Error:', error);
        });
}

(function() {
    'use strict';

    function replaceImageLinks() {
        //console.log('Executing image link replacement...');
        var images = document.querySelectorAll('img');
        //console.log('Number of images: ' + images.length);
        images.forEach(function(image) {
            if( image.src.startsWith('https://tcgone.net/scans/l/'))
            {
                var targetImageUrl = image.src.replace("https://tcgone.net/scans/l/","https://ptcg-1256197202.cos.ap-guangzhou.myqcloud.com/zh/")
                //console.log('Replacing image: ' + image.src);
                image.src = targetImageUrl;
                image.alt = 'New Image';
                image.dataset.replaced = true;
            }
        });
        //console.log('Image link replacement completed.');
    }

    function replaceText(){

        var elements = document.querySelectorAll('div.v-table-cell-wrapper');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if(!element.dataset.replacedText)
            {

                var text = element.innerText;
                //console.log(text)
                if (en2cn.hasOwnProperty(text)) {
                    element.innerHTML = en2cn[text];
                }
                element.dataset.replacedText = true;
            }
        }
    }

    init();

    // 创建MutationObserver对象，监视DOM更改
    var observer = new MutationObserver(function(mutationsList) {

        //console.log(mutationsList.length);
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList')
            {
                //console.log(mutation);
                //console.log('DOM mutation detected.');
                replaceImageLinks();

                replaceText();
            }
        }
    });

    // 在页面加载完成后开始观察DOM更改
    window.addEventListener('load', function() {
        console.log('Page loaded.');
        replaceImageLinks();
        observer.observe(document.body, { childList: true, subtree: true });


    });
})();
