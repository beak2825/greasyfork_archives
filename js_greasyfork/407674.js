// ==UserScript==
// @name         答题Plus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  获得你满意的答案
// @author       Zszen
// @match        http://47.105.51.227:9214/resources/exam/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/407674/%E7%AD%94%E9%A2%98Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/407674/%E7%AD%94%E9%A2%98Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var label = 'Zszen '
    var url = window.location.href;
    var res = /\/\/(.+?\..*?)(\/|\?)/.exec(url);
    var res2 = /\/\/(.+?\..*?)(:|\/|\?)/.exec(url);
    var site = res[1];
    var siteIP = res2[1];
    if(siteIP == '47.105.51.227'){
        var pool_questions = ELs('div',
                                 el=>el.className=='list-group-item shenyue',
                                 el=>{
            var el2 = el.children[0];
            el2.addEventListener('mouseout',()=>{
                //show_div(false);
            });
            el2.addEventListener('mouseover',()=>{
                var title = /\d+、(.*?)\[/.exec(el.textContent)[1];
                console.log("https://www.asklib.com/s/"+title);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://www.asklib.com/s/"+title,
                    onload: function(res) {
                        var txt = res.responseText
                        var links = /\<a href\=\"(.*?)\"\>参考答案\<\/a\>/.exec(txt);
                        console.log("https://www.asklib.com"+links[1]);
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "https://www.asklib.com"+links[1],
                            onload: function(res) {
                                var txt = res.responseText;
                                var d = /\<div class\=\"listleft \">([\d\D]+)\<div class=\"listright\"/.exec(txt)[1]
                                //console.log(d);
                                //var reg = /\>(.+?)\</g;
                                var matches = d.split('\n')
                                var pool_contents = [];
                                for(var k in matches){
                                    var txt_line = matches[k];
                                    txt_line = txt_line.replace(/\<.*?\>/g, '');
                                    txt_line = txt_line.replace(/(\<|\>|\t+| +)/g, '');
                                    //console.log([txt_line])
                                    if(txt_line!=""){
                                        pool_contents.push(txt_line)
                                    }
                                }

                                var pool_quests = [];
                                var answer_title_index = pool_contents.indexOf('参考答案：');
                                pool_quests.push(pool_contents[answer_title_index+1]);
                                var question_title_index = pool_contents.indexOf('问题：');
                                pool_quests.push(pool_contents[question_title_index+1]);
                                pool_quests = pool_quests.concat(pool_contents[question_title_index+2].match(/(A|B|C|D)\.(.(?!\.))*/g));
                                show_div(true, pool_quests.join('\n'));
                            }
                        });
                    }
                });
            })
        }
        );
    }

    function get_div(){
        var div = null;
        if(document.getElementsByClassName('div answers').length==0){
            div = document.createElement('div');
            div.className = 'div answers';
            div.style = "padding:10px;width:200px;height:auto;position:fixed;background-color:#232323;color:#FFEfff;text-decoration-thickness:0.1em;font-size:120%;right:20px;top:100px;opacity:.65;border-radius:10px"
            document.body.appendChild(div);
        }else{
            div = document.getElementsByClassName('div answers')[0];
        }
        return div;
    }

    function show_div(visible, content){
        var div = get_div();
        if(visible){
            div.style.display = 'block';
        }else{
            div.style.display = 'none';
        }
        if(content==null) return;
        div.innerText = content;
    }

    function ELs(tagName, conditionFun, dealFun, parent){
        if(parent==null) parent = document;
        var tags = [...parent.getElementsByTagName(tagName)];
        if(conditionFun){
            tags = tags.filter(conditionFun);
        }
        if(dealFun){
            tags.forEach(dealFun);
        }
        return tags;
    }



    // Your code here...
})();