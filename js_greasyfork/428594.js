// ==UserScript==
// @name         intro to algo
// @namespace    http://tampermonkey.net/
// @version      0.3.8
// @description  "intro to algo"
// @author       You
// @match        http://staff.ustc.edu.cn/~csli/graduate/algorithms/*
// @icon         https://www.google.com/s2/favicons?domain=ustc.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428594/intro%20to%20algo.user.js
// @updateURL https://update.greasyfork.org/scripts/428594/intro%20to%20algo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var body = document.getElementsByTagName('body');
    body[0].style.cssText = 'max-width: 50%;    padding-left: 25%;    text-align: justify;    font-size: 20px;    background-color: #272822;    color: #e6db74;font-family: verdana; filter: brightness(0.70); text-indent: 40px; line-height: 40px';

    var h1_list = document.getElementsByTagName('h1');
    for(let i = 0; i<h1_list.length;i++){h1_list[i].style.color = '#48b22b'};

    var h2_list = document.getElementsByTagName('h2');
    for(let i = 0; i<h2_list.length;i++){h2_list[i].style.color = '#48b22b'};

    var h4_list = document.getElementsByTagName('h4');
    for(let i = 0; i<h4_list.length;i++){h4_list[i].style.color = '#bdbdbd'};



    var pre_list = document.getElementsByTagName('pre');
    for(let i = 0; i<pre_list.length;i++){
        var pre_list_italic = pre_list[i].getElementsByTagName('i');
        for(let j = 0; j<pre_list_italic.length;j++){
            pre_list_italic[j].style.color = '#fd971f'
        }

    }

    var a_list = document.getElementsByTagName('a');
    for(let i = 0; i<a_list.length;i++){
        var a_list_b = a_list[i].getElementsByTagName('b');
        for(let j = 0; j<a_list_b.length;j++){
            a_list_b[j].style.color = '#59d9ef'
        }
    }

    var p_list = document.getElementsByTagName('p');
    for(let i = 0; i<p_list.length;i++){
        var p_list_italic = p_list[i].getElementsByTagName('i');
        for(let j = 0; j<p_list_italic.length;j++){
            p_list_italic[j].style.color = '#fd971f'
            var p_list_italic_bold = p_list_italic[j].getElementsByTagName('b');
            for(let k = 0; k<p_list_italic_bold.length;k++){
                p_list_italic_bold[k].style.color = '#20c2f7'
            }
        }
    }

    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/lftwdchv.gif">','<a style="color:#48b22b">(');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/wdrtchv.gif">',')</a>');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/lteq12.gif">',' ≤ ');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/gteq.gif">',' ≥ ');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/hfbrdl12.gif">','roundown(');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/hfbrdr12.gif">',')');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/hfbrul14.gif">','roundup(');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/hfbrur14.gif">',')');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/arrlt12.gif">','←');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/memof12.gif">',' ∈ ');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/noteq.gif">','≠');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/bound.gif">','<a style="color:#fd971f">O</a>');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/lambdauc.gif">','<a style="color:#fd971f">λ</a>');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/omega12.gif">','<a style="color:#fd971f">Ω</a>');
        body[0].innerHTML = body[0].innerHTML.replaceAll('â','<a style="color:#fd971f">f</a>');
    body[0].innerHTML = body[0].innerHTML.replaceAll('<img src="../images/scrptf12.gif">','<a style="color:#fd971f">f</a>');
    body[0].innerHTML = body[0].innerHTML.replace(/\<[\w\s="]+>([a-zA-Z\s-]+)<\/font>/g,'<a style="color:#48b22b; font-weight: bold">$1</a>');
    body[0].innerHTML = body[0].innerHTML.replace(/<i[a-zA-Z\"\s=:,\(0-9\);]+>([a-zA-Z0-9]+)<\/i><sup+>([a-zA-Z0-9\s]+)<\/sup>/g,'<i style="color:#fd971f">$1<sup>$2</sup></i>');
    body[0].innerHTML = body[0].innerHTML.replace(/<i[a-zA-Z\"\s=:,\(0-9\);]+>([a-zA-Z0-9]+)<\/i><sub+>([a-zA-Z0-9\s]+)<\/sub>/g,'<i style="color:#fd971f">$1<sub>$2</sub></i>');
    body[0].innerHTML = body[0].innerHTML.replace(/\blg\b/g,'<a style="color: #20c2f7">log </a>');
})();