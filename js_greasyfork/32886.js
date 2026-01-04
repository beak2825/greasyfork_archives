// ==UserScript==
// @name         亚马逊图书豆瓣助手
// @namespace    http://weibo.com/maiweili/
// @version      1.1
// @description  尝试在中亚图书页面（存在ISBN数据或者关联页面存在该数据）展示相应的豆瓣图书信息。
// @author       maiweili
// @match        https://www.amazon.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32886/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%9B%BE%E4%B9%A6%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/32886/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%9B%BE%E4%B9%A6%E8%B1%86%E7%93%A3%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
var scr=document.createElement('script');
scr.textContent='var callback;';
document.body.appendChild(scr);

var bList=Array.from(document.querySelectorAll('b'));
var isBook=bList.some(function(key){
    return key.textContent.includes('出版社')||key.textContent.includes('Publisher');
});

if(isBook){
        let isbnNode=bList.find(function(key){
                return key.textContent =='ISBN:';
        });

        var isbnStr;
        if(isbnNode){
                let isbn=isbnNode.nextSibling.textContent.split(',')[0].trim();
                getInfoBox(isbn);
        } else{
                let pages=document.querySelectorAll('.swatchElement .a-button-text');
                if(pages.length-1){
                        let url=pages[pages.length-1].href;
                        if(url=='javascript:void(0)')
                                console.log('缺少ISBN信息');
                        else
                                getAjax(url);
                } else 
                        console.log('缺少ISBN信息');
        }
}

function getAjax(url){
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function () {
                if(xhr.readyState == 4 && xhr.status === 200) {
                        let hasIsbn=xhr.responseText.match(/<li><b>ISBN:<\/b>(.*)<\/li>/);
                        if(hasIsbn){
                                let isbn=hasIsbn[1].split(',')[0].trim();
                                getInfoBox(isbn);
                        } else
                                console.log('缺少ISBN信息');
                }
        };
        xhr.send();
}

function getInfoBox(str){
        var url='https://api.douban.com/v2/book/isbn/'+str+'?fields=id,title,subtitle,rating,origin_tilte,author,translator,publisher,pubdate,binding,pages,series,tags&callback=callback';
        getJSONP(url,show);

        function getJSONP(url,fnc) {
                let script = document.createElement('script');
                callback = function (json) {
                        try {
                                fnc(json);
                        } catch(e){
                                console.log(e);
                        }finally {
                                script.parentNode.removeChild(script);
                        }
                };
                script.src=url;
                document.body.appendChild(script);
        }
        function show(info){
                let box=document.createElement('div');
                box.style='position:fixed; right:10px; bottom:10px; border:none; border-radius:0.5em; background:white; width:30em;padding:1em;';
                let cButton=document.createElement('button');
                cButton.innerHTML='✖';
                cButton.style='position:absolute; top:0px; right:0px; border:none; background:transparent; font-size:1.5em; border-radius:0.5em';
                cButton.addEventListener('click',function(){
                        box.style.display='none';
                });
                box.appendChild(cButton);

                if(info.msg){
                        box.appendChild(document.createTextNode('没找到该图书！'));
                }else{
                        let title;
                        title=info.subtitle? info.title+'：'+info.subtitle: info.title;
                        let header=document.createElement('h2');
                        header.style.marginTop='0px';
                        let headerLink=document.createElement('a');
                        headerLink.innerHTML=title;
                        headerLink.href = 'https://book.douban.com/subject/'+info.id;
                        headerLink.target='_blank_h';
                        header.appendChild(headerLink);
                        box.appendChild(header);

                        let rating=document.createElement('div');
                        rating.style.cssFloat='right';
                        let rn=document.createElement('p');
                        rn.style='font-size:3em;font-weight:bloder;color:green';
                        rn.innerHTML=info.rating.average;
                        rating.appendChild(rn);
                        let pn=document.createElement('p');
                        pn.innerHTML=info.rating.numRaters+'人评价';
                        rating.appendChild(pn);
                        box.appendChild(rating);

                        if(info.origin_tilte){
                                var originTitle=document.createElement('p');
                                originTitle.innerHTML=info.origin_tilte;
                                box.appendChild(originTitle);
                        }

                        let author=document.createElement('p');
                        let aun=info.author.length;
                        let auLinks=[];
                        for(let i=0;i<aun;i++){
                                auLinks[i]=document.createElement('a');
                                auLinks[i].innerHTML=info.author[i];
                                auLinks[i].href='https://book.douban.com/search/'+info.author[i].slice(info.author[i].indexOf(']')+1);
                                auLinks[i].target='_blank_au'+i;
                                author.appendChild(auLinks[i]);
                                author.appendChild(document.createTextNode('（作者）'));
                        }
                        if(info.translator.length){
                                let trn=info.translator.length;
                                let trLinks=[];
                                for(let i=0;i<trn;i++){
                                        trLinks[i]=document.createElement('a');
                                        trLinks[i].innerHTML=info.translator[i];
                                        trLinks[i].href='https://book.douban.com/search/'+info.translator[i].slice(info.translator[i].indexOf(']')+1);
                                        trLinks[i].target='_blank_tr'+i;
                                        author.appendChild(trLinks[i]);
                                        author.appendChild(document.createTextNode('（译者）'));
                                }
                        }
                        box.appendChild(author);

                        let publisher=document.createElement('p');
                        publisher.innerHTML=info.publisher+' '+info.pubdate+' '+info.binding+' '+info.pages+'页';
                        box.appendChild(publisher);

                        if(info.series){
                                let series=document.createElement('p');
                                series.appendChild(document.createTextNode('丛书：'));
                                let seLink=document.createElement('a');
                                seLink.innerHTML=info.series.title;
                                seLink.href='https://book.douban.com/series/'+info.series.id;
                                seLink.target='_blank_se';
                                series.appendChild(seLink);
                                box.appendChild(series);
                        }

                        let ntags=info.tags.length;
                        if(ntags){
                                let tags=document.createElement('p');
                                tags.appendChild(document.createTextNode('豆瓣标签'));
                                let taLinks=[];
                                for(let i=0;i<ntags;i++){
                                        taLinks[i]=document.createElement('a');
                                        taLinks[i].innerHTML=info.tags[i].name;
                                        taLinks[i].href='https://book.douban.com/tag/'+info.tags[i].name;
                                        taLinks[i].target='_blank_ta'+i;
                                        tags.appendChild(document.createTextNode(' '));
                                        tags.appendChild(taLinks[i]);
                                }
                                box.appendChild(tags);
                        }
                }
                Array.from(box.querySelectorAll('a')).forEach(function (k){
                        k.style.textDecoration='none';
                });
                document.body.appendChild(box);
        }
}
})();