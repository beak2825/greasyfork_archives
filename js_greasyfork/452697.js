// ==UserScript==
// @name         NovelAI提取prompt以及config工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  提取拼接prompt,提取novelAI配置
// @author       S1
// @match        http://dev.kanotype.net:8003/deepdanbooru/view/general/*
// @match        https://danbooru.donmai.us/posts/*
// @match        https://novelai.net/image
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/452697/NovelAI%E6%8F%90%E5%8F%96prompt%E4%BB%A5%E5%8F%8Aconfig%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/452697/NovelAI%E6%8F%90%E5%8F%96prompt%E4%BB%A5%E5%8F%8Aconfig%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var location = window.location.host;
    if(location=="dev.kanotype.net:8003"){
        let res = document.querySelector("body > div > div.card > div > h3");
        let input = document.createElement('input');
        input.id='threshold'
        input.defaultValue=0.0
        let b = document.createElement('button');

        b.textContent='copy';

        res.append(input);
        res.append(b);

        b.addEventListener('click',function(){
            filter_deep(input);
        })
    }
    else if(location=="danbooru.donmai.us"){
        var res = document.querySelector("#search-box > h2")
        var button = document.createElement('button');
        button.textContent='copy';
        res.append(button);

        button.addEventListener('click',function(){
            filter_danbooru();
        })
    }
    else if(location=="novelai.net"){
        var exportButton = document.createElement('button');
        exportButton.textContent='Export';
        exportButton.style.background="#13152C"
        exportButton.setAttribute('id', 'temp_button');

        document.addEventListener('click', (event) => {

        var enhance = document.querySelectorAll('button[aria-label="Enhance Image"]')[0]
        if(document.getElementById('temp_button')==null && enhance !=null){
        enhance.parentNode.append(exportButton);
        }


        })
        exportButton.addEventListener('click',function(){
            getConfig();
        })

    }

})();

function filter_deep(input){
    var threshold = parseFloat(input.value);
    var output="";
    var paths = ["body > div > div.card > div > div.row > div.col-md-auto > table > tbody:nth-child(2)","body > div > div.card > div > div.row > div.col-md-auto > table > tbody:nth-child(4)"];
    var title = document.querySelector("body > div > div.card > div > div.row > div.col-md-auto > table > thead:nth-child(3) > tr > th").textContent;
    var index = title.indexOf("System Tags");
    if(index == -1){
        // 不是system tags的话这里的就是character tags，需要
        var path = paths;
    }
    else{
        path = paths.slice(0, 1);
    }
    for(var j = 0; j < path.length;j++){
        var tags = document.querySelector(path[j]);

        var rows = tags.rows;
    for(var i = 0; i < rows.length; i++){
        var row = rows[i];
        var tag = rows[i].children[0].textContent;
        var value = parseFloat(rows[i].children[1].textContent);
        if(value >= threshold){
            output += tag;
            output += ",";
        }
    }
    }


    clip(output);
}

function filter_danbooru(){
    var artist = document.querySelector("#tag-list > div > ul.artist-tag-list");
    var copyright = document.querySelector("#tag-list > div > ul.copyright-tag-list");
    var character = document.querySelector("#tag-list > div > ul.character-tag-list");
    var general = document.querySelector("#tag-list > div > ul.general-tag-list");
    var path = [artist, copyright, character, general];
    var output = "";
    for(var i=0; i<=path.length-1;i++){
        if(path[i] != null){
            var lis = path[i].getElementsByTagName("li")
            for(var j=0; j<=lis.length-1;j++){
                output += lis[j].getAttribute("data-tag-name").replaceAll("_", " ");
                output += ",";
            }
        }
    }
    clip(output);
}

function getConfig(){
    var promp=document.querySelector("#prompt-input-0").value;
    var seed=document.querySelectorAll("div[style^='position']")[1].textContent;
    var diffusion=document.querySelectorAll("div[style^='font-size']")[0].textContent;
    var res_w=document.querySelectorAll("input[type='number'][class]")[0].value;
    var res_h=document.querySelectorAll("input[type='number'][class]")[1].value;
    var steps=document.querySelectorAll("input[type='number'][class]")[2].value;
    var scale=document.querySelectorAll("input[type='number'][class]")[3].value;
    var undesiredType=document.querySelectorAll("div[class^=' css-jz94ut-singleValue']")[2].textContent;
    var undeairedText=document.querySelectorAll("textarea[placeholder^='Anything']")[0].textContent;
    var advanced=document.querySelectorAll("div[class^=' css-jz94ut-singleValue']")[3].textContent;
    var cfg={
        "promp":promp,
        "seed":seed,
        "diffusion":diffusion,
        "res_w":res_w,
        "res_h":res_h,
        "steps":steps,
        "scale":scale,
        "undesiredType":undesiredType,
        "undeairedText":undeairedText,
        "advanced":advanced
    }

    var output="由于网站自身有bug,ctrl+click history后会关闭Add Quality Tags,所以导出默认开启Add Quality Tags"+JSON.stringify(cfg);
    clip(output);
}

function clip(input){
    var copy_input = document.createElement('input');
    copy_input.setAttribute('id', 'temp_str');
    copy_input.value=input;
    document.getElementsByTagName('body')[0].appendChild(copy_input);
    document.getElementById('temp_str').select();
    document.execCommand('copy');
    document.getElementById('temp_str').remove();
    alert("已拷贝到剪切板! " + input);
}