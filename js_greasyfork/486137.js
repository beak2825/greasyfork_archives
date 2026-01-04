// ==UserScript==
// @name         星月文学电子书下载
// @namespace    https://www.52pojie.cn/thread-1886476-1-1.html
// @version      2024-01-31
// @description  打包下载星月文学电子书下载!
// @author       bh4ger
// @match        https://www.xingyueboke.com/*/
// @icon         https://www.xingyueboke.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486137/%E6%98%9F%E6%9C%88%E6%96%87%E5%AD%A6%E7%94%B5%E5%AD%90%E4%B9%A6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/486137/%E6%98%9F%E6%9C%88%E6%96%87%E5%AD%A6%E7%94%B5%E5%AD%90%E4%B9%A6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var contentList = document.getElementById('content-list')
    if(contentList === null){
        return;
    }
    var bookDescribe = contentList.querySelector('.book-describe').innerText;
    var metas = bookDescribe.split('\n\n');
    var title = metas[0];
    var author = metas[1].split('：')[1];
    var guojia = metas[2].split('：')[1];
    var niandai = metas[3].split('：')[1];
    var description= metas[5];
    var booklist = document.querySelector('.book-list');
    var sections = [];
    var tasks = [];
    booklist.querySelectorAll('a').forEach(function(a,i){
        sections.push({title:a.title,content:i});
        var t = fetch(a.href)
        .then(function(response){
            return response.text()
        })
        .then(function (text) {
            var div = document.createElement('div');
            div.innerHTML = text;
            var nr1=div.querySelector('#nr1 div');
            sections[i].content = nr1.innerHTML;
        });
        tasks.push(t);
    });
    Promise.all(tasks).then(function(){
        var html = ['<!DOCTYPE html>',
                    '<html lang="zh-CN">',
                    '<head>',
                    '<meta charset="utf-8">',
                    '<meta name="author" content="' + author + '">',
                    '<meta name="description" content="'+ description +'">',
                    '<title>' + title + '</title>',
                    '</head>',
                    '<body>',
                    '<article>',
                    '<h1>' + title + ' <small> '+ author +'</small></h1>'];
        sections.forEach(function(section){
            html.push('<section>');
            html.push('<h2>' + section.title + '</h2>');
            html.push(section.content);
            html.push('</section>');
        });
        html.push('</article>');
        html.push('</body>');
        html.push('</html>');
        contentList.querySelector('.book-describe').innerHTML = '<div class="scrolltobt"><a id="download">下载电子书</a><br /></br /><a id="singlePage">单页浏览</a></div>' + contentList.querySelector('.book-describe').innerHTML;
        let a = document.getElementById('download');
        a.href = 'data:text/plain;charset=utf-8,'+html.join('\n').replaceAll('#','@');
        a.download = title + '.html';
        let b=document.getElementById('singlePage');
        b.href='javascript:void(0);';
        b.addEventListener("click",function(){
            let win=window.open("about:blank");
            win.document.write(html.join('\n'));
        });

    });
})();