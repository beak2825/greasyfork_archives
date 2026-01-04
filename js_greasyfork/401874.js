// ==UserScript==
// @name         解析巴哈文章內樓層文字&社群連結預覽小工具
// @namespace    https://home.gamer.com.tw/homeindex.php?owner=xu3u04u48
// @author       xu3u04u48
// @version      1.5.10
// @description  轉換文章內的樓層文字成連結方便穿越不須慢慢搭電梯，及解析文章內的社群連結插入嵌入小工具，方便快速預覽，支援Twitter、Steam、Facebook。
// @icon         https://i2.bahamut.com.tw/anime/baha_s.png
// @match        https://forum.gamer.com.tw/C.php?*
// @match        https://forum.gamer.com.tw/Co.php?*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/401874/%E8%A7%A3%E6%9E%90%E5%B7%B4%E5%93%88%E6%96%87%E7%AB%A0%E5%85%A7%E6%A8%93%E5%B1%A4%E6%96%87%E5%AD%97%E7%A4%BE%E7%BE%A4%E9%80%A3%E7%B5%90%E9%A0%90%E8%A6%BD%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/401874/%E8%A7%A3%E6%9E%90%E5%B7%B4%E5%93%88%E6%96%87%E7%AB%A0%E5%85%A7%E6%A8%93%E5%B1%A4%E6%96%87%E5%AD%97%E7%A4%BE%E7%BE%A4%E9%80%A3%E7%B5%90%E9%A0%90%E8%A6%BD%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function(){
    'use strict';

    document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

    function DOM_ContentReady () {

        //加入twitter貼文的js庫
        var head= document.getElementsByTagName('head')[0];
        var twitter= document.createElement('script');
        twitter.type= 'text/javascript';
        twitter.src= 'https://platform.twitter.com/widgets.js';
        head.appendChild(twitter);

        //加入FB貼文的js庫
        var fb= document.createElement('script');
        fb.type= 'text/javascript';
        fb.src= 'https://connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v6.0';
        head.appendChild(fb);


        //baha網址
        var baha_bsn = new URL(location.href).searchParams.get('bsn');
        var baha_snA = new URL(location.href).searchParams.get('snA');


        //解析文章#字樓
        replaceTextOnPage(/#(\d+)|(\d+)樓/gm,function(from,to,type){
            if(to.match(from) !== null){
                if(to.indexOf("樓") != -1){
                    return to.replace(from,function replacer(match, p1, offset, string) {
                        var split = match.split("樓")
                        return `<a href="https://forum.gamer.com.tw/C.php?bsn=${baha_bsn}&snA=${baha_snA}&to=${split[0]}">${match}</a>`
                    })
                }else if(to.indexOf("#") != -1){
                    return to.replace(from,function replacer(match, p1, offset, string) {
                        var split = match.split("#")
                        return `<a href="https://forum.gamer.com.tw/C.php?bsn=${baha_bsn}&snA=${baha_snA}&to=${split[1]}">#${split[1]}</a>`
                    })
                }
            }
        });


        //解析twitter文章
        replaceTextOnPage(/(https:\/\/(mobile\.|)twitter\.com\/[^<]*)/gm,function(from,to,type){
            if(to.match(from) !== null){
                return to.replace(from,function replacer(match, p1, offset, string) {
                    if(to.indexOf("/status/") != "-1" ){
                        var url = (type == "text") ? match.replace(/https:\/\/mobile\./gm, `https:\/\/`) : ""
                        var fixurl = match.replace(/https:\/\/mobile\./gm, `https:\/\/`)
                        return `${url}<blockquote class="twitter-tweet" data-dnt="true"  data-lang="zh-tw" data-theme="light"><a href="${fixurl}"></a></blockquote>`
                    }
                })
             }
        });


        //解析Steam網址
        replaceTextOnPage(/https:\/\/store\.steampowered\.com\/app\/([0-9]+).*/gm,function(from,to,type){
            if(to.match(from) !== null){
                return to.replace(from,function replacer(match, p1, offset, string) {
                    var url = (type == "text") ? match : ""
                    return `${url}<iframe style="margin-top: 10px; margin-bottom: 10px;" frameborder="0" height="190" src="https://store.steampowered.com/widget/${p1}/" width="100%"></iframe>`
                })
            }
        });


        //解析Facebook網址
        replaceTextOnPage(/(https:\/\/(m|www)\.facebook\.com\/[^<]*)/gm,function(from,to,type){
             if(to.match(from) !== null){
                 return to.replace(from,function replacer(match, p1, offset, string) {
                     if(p1.indexOf("/posts") != "-1" || p1.indexOf("/photos") != "-1" || p1.indexOf("/photo") != "-1" || p1.indexOf("/story") != "-1" || p1.indexOf("/permalink") != "-1" || p1.indexOf("/watch") != "-1"){
                         var url = (type == "text") ? match : ""
                         return `${url}<div style="margin-left: unset !important;width: auto !important;height: unset !important; margin-top: 10px; margin-bottom: 10px;" class="fb-post" data-href="${p1}" data-show-text="true" data-width="688" ></div>`
                     }
               })
             }
        });
    }



    function replaceTextOnPage(from,to){
        getAllTextNodes().forEach(function(key,length){
            var div = document.createElement("span")
            var node = key.value
            if(key.type == "a"){
                var url = new URL(node.href);
                var regex = /^\?url=(.*)/gm;
                var decode_URI = decodeURIComponent(url.search);
                var str = regex.exec(decode_URI)
                if(str !== null){
                    if(to(from,str[1]) != "undefined" && to(from,str[1]) != undefined){
                        div.innerHTML = to(from,str[1],key.type);
                        node.after(div)
                    }
                }
            }else if(key.type == "text"){
                var replace = node.textContent.replace(/\r\n|\n/g,"")
                if(node.parentNode.localName != "a" && replace != "" && to(from,replace) != "undefined" && to(from,replace,node) != undefined){
                    node.textContent = ""
                    div.innerHTML = to(from,replace,key.type);
                    node.after(div)
                }
            }

        });

        function getAllTextNodes(){
            var e = document.getElementsByClassName('c-article__content');
            var result = [];
            (function scanSubTree(node){
                if(node.length >= 1){
                    for(var i = 0; i < node.length; i++){
                        if(node[i].localName == "a"){
                            result.push({'type':'a','value':node[i]});
                        }else if(node[i].nodeType == Node.TEXT_NODE && node[i].localName != "a"){
                            result.push({'type':'text','value':node[i]});
                        }
                        scanSubTree(node[i].childNodes);
                    }
                }
            })(e);
            return result;
        }
    }

})();
