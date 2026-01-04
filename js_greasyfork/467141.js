// ==UserScript==
// @name         css/js自动高亮
// @namespace    https://www.yiuios.com/
// @version      0.11
// @description  大多浏览器只有查看html的代码有自动高亮，而css和js都没有，本插件就是为了解决查看css和js没有高亮的烦恼
// @author       Sam
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yiuios.com
// @grant        GM_addStyle
// @match      *://*/*.js?*
// @match      *://*/*.css?*
// @match      *://*/*.js
// @match      *://*/*.css
// @run-at      document-end
// @license Sam
// @downloadURL https://update.greasyfork.org/scripts/467141/cssjs%E8%87%AA%E5%8A%A8%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/467141/cssjs%E8%87%AA%E5%8A%A8%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

const $plus = {
    loadScript(url){
        let script = document.createElement('script');
        script.setAttribute('src',url);
        document.querySelector('head').appendChild(script);
        return new Promise(function(resolve,reject){
            script.onload = resolve;
        });
    },
    ext:(function(){
        let path = window.location.protocol+"//"+window.location.host+""+window.location.pathname;
        console.log(path,'【Path】');
        return path.match(/([^\.]+?)$/)[1]
    })(),
    loadCss(url){
        let style = document.createElement('link');
        style.setAttribute('rel','stylesheet');
        style.setAttribute('href',url);
        document.querySelector('head').appendChild(style);
    },
    beautify(el,html){
        if($plus.beautified) return;
        let srcList = {
            js:'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify.min.js',
            css:'https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify-css.min.js',
        }

        $plus.loadScript(srcList[$plus.ext]).then(()=>{
            if($plus.ext == 'js') el.innerHTML = js_beautify(html);
            if($plus.ext == 'css') el.innerHTML = css_beautify(html);
            $plus.beautified = true;
            $plus.initHighLight();
        });
    },
    beautified:false,
    initHighLight(){
        document.querySelectorAll('pre code').forEach(function(item,index){
            let html = item.innerHTML;
            hljs.highlightBlock(item);
            let lines = item.innerHTML.split("\n");
            let row = lines.length;
            let fsc = parseInt(window.getComputedStyle(item).fontSize) / 16;
            let rw = row.toString().length * fsc;

            for(let k in lines){
                lines[k] = '<span class="codeno" style="width:'+(rw)+'rem;" data-num="'+(parseInt(k)+1) +'" ></span>'+lines[k];
            }
            let newid = 'codebox_'+index;
            item.setAttribute('id',newid);
            item.innerHTML = ('<span class="codenobg" style="width:'+(rw+1)+'rem;"></span>'+lines.join("\n"));

            if(!$plus.beautified){
                let toolbar = document.createElement('div');
                toolbar.classList.add('toolbar');
                document.body.appendChild(toolbar);


                let btnCopy = document.createElement('div');
                btnCopy.classList.add('btn');
                btnCopy.innerHTML = '复制';
                toolbar.appendChild(btnCopy)

                btnCopy.addEventListener('click',function(){
                    let contentbox = document.createElement('textarea');
                    contentbox.style.opacity = 0;
                    contentbox.style.pointerEvents = 'none';
                    contentbox.value = item.innerText.replace(/(\n[\s\t]*\r*\n)/g, '\n').replace(/^[\n\r\n\t]*|[\n\r\n\t]*$/g, '');
                    document.body.appendChild(contentbox);
                    contentbox.select();
                    document.execCommand('copy');
                    document.body.removeChild(contentbox);
                    btnCopy.innerText = '已复制';
                    setTimeout(function(){
                        btnCopy.innerText = '复制';
                    },1000);
                })

                let btnBeautify = document.createElement('div');
                btnBeautify.classList.add('btn');
                btnBeautify.innerHTML = '美化';
                toolbar.appendChild(btnBeautify)
                btnBeautify.addEventListener('click',function(){
                    $plus.beautify(item,html);
                });
            }

            item.style.paddingLeft = (rw+2)+'rem'
        });
    }
};


(function() {
    'use strict';

    GM_addStyle(`
      .article-body{color:#f8f8f2;}
      .article-body pre{line-height: 1.2;font-size:14px;border-radius:0.5rem;overflow:hidden;position:relative;}
      .article-body pre code{overflow:hidden;}
      .article-body pre .codenobg{display:block;position:absolute;left:0;top:0;height:100%;font-weight:lighter;}
      .article-body pre code{position:relative;}
      .article-body pre .codeno{position:absolute;left:0px;text-align:right;color:#888;padding-right:0.4rem;padding-left:0.4rem;}
      .article-body pre .codeno::before{content:attr(data-num);}
      .article-body .toolbar{position: fixed; left: 0px; top: 0px; width: 100%; box-sizing: border-box; display: flex; justify-content: flex-end; padding: 10px;}
      .article-body .toolbar .btn{cursor:pointer;background-color:rgba(0,0,0,0.6);color:#FFF;padding:0.5rem;line-height:1;border-radius:0.5rem;font-size:12px;margin-right:5px;}
   `);

    $plus.loadCss('https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/monokai-sublime.min.css');



    let pre = document.querySelector('pre');

    console.log($plus.ext)

    pre.innerHTML = ( `<code class="language-${$plus.ext}">` + pre.innerHTML +'</code>' );

    $plus.loadScript('//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js').then(()=>{
        $plus.initHighLight();
    });

    document.body.style.backgroundColor = '#23241f';
    document.body.style.lineHeight = 1.5;
    document.body.classList.add('article-body');
    document.body.style.margin = 0;

})();