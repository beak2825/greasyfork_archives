// ==UserScript==
// @name         扇贝
// @name:en      shanbay
// @namespace    http://261day.com/
// @version      0.2
// @description  扇贝单词下载导出
// @description:en shanbay word download
// @author       You
// @match        https://web.shanbay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422693/%E6%89%87%E8%B4%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/422693/%E6%89%87%E8%B4%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var book_id = "";
    var learning_count = 0;
    var unlearned_count = 0;
    var simple_count = 0;

    function get_data(url){
        return fetch(url, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,zh-CN;q=0.9,zh;q=0.8,ja;q=0.7",
                "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "x-csrftoken": "d57d33018f6b24892cea401df0173f53"
            },
            "referrer": "https://web.shanbay.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        })
        .then(response => response.json())
    }

    function get_decoded_data(url){
        return get_data(url)
        .then(json => json.data)
        .then(data => window.bays4.d(data))
        .then(data => JSON.parse(data))
    }

    function update_wordinfo(){
        get_data("https://apiv3.shanbay.com/wordsapp/user_material_books/current").
        then(data => {
            document.getElementById("current_book").innerHTML = "单词书：" + data.materialbook.name + "<br/>单词书id:" + data.materialbook.id;

            book_id = data.materialbook.id;


            get_decoded_data("https://apiv3.shanbay.com/wordsapp/user_material_books/"+book_id+"/learning/words/unlearned_items?ipp=10&page=1")
                .then(data => {
                document.getElementById("unlearned_word").innerText = data.total
                unlearned_count = data.total;
            })

            get_decoded_data("https://apiv3.shanbay.com/wordsapp/user_material_books/"+book_id+"/learning/words/learning_items?ipp=10&page=1")
                .then(data => {
                document.getElementById("learning_word").innerText = data.total;
                learning_count = data.total;
            })

            get_decoded_data("https://apiv3.shanbay.com/wordsapp/user_material_books/"+book_id+"/learning/words/simple_learned_items?ipp=10&page=1")
                .then(data => {
                document.getElementById("simple_learned_word").innerText = data.total
                simple_count = data.total;
            })
        })
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function download_book(url,pages){
        var res = [];

        for(var i=1;i<=pages;i++){
            document.getElementById("download_info").innerText = "休眠中"+i+"/"+pages
            await sleep(100)
            document.getElementById("download_info").innerText = "下载中"+i+"/"+pages
            var data = await get_decoded_data(url+i);

            for(const id in data.objects){
                var word = data.objects[id]
                var meanings = " ";
                for(const mean of word.vocab_with_senses.senses){
                    meanings += mean.pos + mean.definition_cn
                }

                res.push({"word":word.vocab_with_senses.word, "trans":meanings})
            }
        }

        document.getElementById("download_info").innerText = ""

        return res;
    }

    function disable_buttons(){
        document.getElementById("download_learning").setAttribute("disabled","true");
        document.getElementById("download_unlearned").setAttribute("disabled","true");
        document.getElementById("download_simple").setAttribute("disabled","true");
    }

    function enable_buttons(){
        document.getElementById("download_learning").removeAttribute("disabled");
        document.getElementById("download_unlearned").removeAttribute("disabled");
        document.getElementById("download_simple").removeAttribute("disabled");
    }

    function popup_result(res){
        var win = window.open("", "_blank");
        win.document.write(String.raw`<html>
<head><title>请使用Excel导入</title>
<script>
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function download_code(){
  var c = document.getElementById("code").innerText;
  download("export.json",c);
}
</script>
</head>
<body>
<h1>请使用Excel导入</h1>
<button onclick="download_code()">download</button>
<hr style="border-top: 3px solid #bbb;">
<pre><code class="json" id="code">`+JSON.stringify(res,null,2)+"</code></pre></body></html>");
    }

    function init(){
        var body = document.getElementById("root").parentElement

        body.appendChild(document.createElement("div")).innerHTML = String.raw`<div style="position: fixed; background-color: LightGreen; border: 2px solid ForestGreen; top: 200px; left: 0; min-width: 200px; min-height: 200px; text-align: center;" id="inject-root">
<h4 style="color:Green">扇贝助手</h4>
<p style="color:Green" id="current_book">单词书</p>
<p style="color:Green">条目 数量</p>
<p style="color:Green">在学单词 <var id="learning_word">NaN</var> <button id="download_learning">download</button></p>
<p style="color:Green">未学单词 <var id="unlearned_word">NaN</var> <button id="download_unlearned">download</button></p>
<p style="color:Green">简单词 <var id="simple_learned_word">NaN</var> <button id="download_simple">download</button></p>
<p style="color:Green" id="download_info"></p>
</div>`;

        update_wordinfo();


        window.addEventListener('hashchange',()=>{update_wordinfo()})
        document.getElementById("download_learning").addEventListener('click',async function(){
            disable_buttons();
            var res = await download_book("https://apiv3.shanbay.com/wordsapp/user_material_books/"+book_id+"/learning/words/learning_items?ipp=10&page=",Math.ceil(learning_count/10));
            popup_result(res)
            enable_buttons();
        })

        document.getElementById("download_unlearned").addEventListener('click',async function(){
            disable_buttons();
            var res = await download_book("https://apiv3.shanbay.com/wordsapp/user_material_books/"+book_id+"/learning/words/unlearned_items?ipp=10&page=",Math.ceil(unlearned_count/10));
            popup_result(res)
            enable_buttons();
        })

        document.getElementById("download_simple").addEventListener('click',async function(){
            disable_buttons();
            var res = await download_book("https://apiv3.shanbay.com/wordsapp/user_material_books/"+book_id+"/learning/words/simple_learned_items?ipp=10&page=",Math.ceil(simple_count/10));
            popup_result(res)
            enable_buttons();
        })
    }


    init();


    // "https://apiv3.shanbay.com/wordscollection/learning/words/unlearned_items?page=0&order=DESC&ipp=10"


    // Your code here...
})();