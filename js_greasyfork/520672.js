// ==UserScript==
// @name         QQ阅读快捷搜索
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  可以便捷的搜索书籍 可以复制并下载内容
// @author       twjx
// @match        *://book.qq.com/*
// @require        https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @require        https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require        https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @require        https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js
// @license MIT
// @resource       swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520672/QQ%E9%98%85%E8%AF%BB%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/520672/QQ%E9%98%85%E8%AF%BB%E5%BF%AB%E6%8D%B7%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    globalThis.data=''
    window.data=''
    function xml(type,src){
        var xhr = new XMLHttpRequest()
        xhr.open(type, src)
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                globalThis.data =(xhr.response)
            }
        }
    }
    function process_data(text){
    var textdata={
        book_id:Number(text.split('class="book-large result-item" data-v-d9d70480 data-v-73bb9c88>')[0].replace('<div mulan-bid="','').replace('" ','')),
        book_name:text.split('<a title="')[1].split('" href=')[0],
        book_introduce:text.split('<p class="intro" data-v-d9d70480>')[1].split('</p> <p class="other')[0],
        book_type:text.split('data-v-d9d70480>\n            ·')[1].split('\n')[0],
        book_status:text.split('data-v-d9d70480>·')[1].split('<')[0],
        word_count:text.split('data-v-d9d70480>·')[2].split('<')[0],
        isfree:text.includes('会员'),
    }
    return textdata
    }
    function  logdata(textdata){
        var text='书名:《'+textdata.book_name+'》 类型:"'+textdata.book_type+'" 状态:'+textdata.book_status+' 需要会员:'+textdata.isfree+' 字数:'+textdata.word_count+'\n简介:'+textdata.book_introduce;
        return text
    }
    function download(name, text) {
        var dld = document.createElement('a');
        dld.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
        dld.setAttribute('download', name);
        /*if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            dld.dispatchEvent(event);
        }*/
        dld.click();
}
    async function geta(){
        globalThis.aatext=''
    var num=document.querySelector('.content input').value.split('-')
    for(let x=Number(num[0]);x<Number(num[1])+1;x++){
        await setTimeout(()=>{
             copyxml('GET','https://book.qq.com/book-read/'+location.href.split('/')[4]+'/'+x)
        },1000)
    }
}
function copyxml(type,src){
        var xhr = new XMLHttpRequest()
        xhr.open(type, src)
        xhr.send()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                window.data =xhr.response
                aatext+=('第'+src.replace('https://book.qq.com/book-read/'+location.href.split('/')[4]+'/','')+'章  '+data.split('</div> <div class="footer"')[0].split('data-v-20a21e26><p>')[1].replaceAll('<p>','').replaceAll('</p>',''))
                window.data=''
                xhr.abort()
            }
        }
    }
    if(location.href=='https://book.qq.com/%E5%86%85%E5%AE%B9%E5%B1%95%E5%BC%80'){
        document.querySelector('.error').innerHTML='<div class="text">详细内容\n'+localStorage.qqcopytext+'</div><style>div{word-wrap: break-word;color: #333;line-height: 1.6;margin-bottom: 1.6em;word-break: break-word;font-size: 1em;text-align: justify;text-indent: 2em;}</style>'
        window.onclose=function(){
            localStorage.qqcopytext=''
        }
    }
    var main = {
        "search" : async()=>{
            var f=await prompt('请输入要搜索的书籍');
            xml('GET','https://book.qq.com/so/'+String(f))
            setTimeout(async()=>{
            var data1=data.split('<div class="result-list" data-v-73bb9c88>')[1].split('</div></a></div> <!----></div> <!----></div> <div class="hot-search" data-v-73bb9c88><div class="title" data-v-73bb9c88>热门搜索</div>')[0].split('</div></a></div>')
            var text=''
            var num=1
            for(let x of data1){
                text+=num+logdata(process_data(x))+'\n'
                num+=1
            }
            var f1=await prompt('已获取书籍内容 输入书籍所对应的数字即可转到对应页\n如果内容未完全展开请输入"内容展开"\n'+text)
            console.log(process_data(data1[Number(f1)-1]))
            if(f1=='内容展开'){
                localStorage.qqcopytext=text
                open('https://book.qq.com/%E5%86%85%E5%AE%B9%E5%B1%95%E5%BC%80')

            }
            if('1234567891011121314151617'.indexOf(Number(f1))!==-1){
                open('https://book.qq.com/book-detail/'+process_data(data1[Number(f1)-1]).book_id)
            }
            },500)
        },
        "copy" : ()=>{
            navigator.clipboard.writeText(document.querySelector('.chapter-content').innerText)
        },
        "copyplus" : ()=>{
            var a=document.createElement('div')
            document.body.appendChild(a)
             a.innerHTML=`<div class="dialog"><div class="content"><div class="text">输入下载的章节 实例 1-10</div><input class="input"></input><button>确定</button></div></div><style>.dialog {position: fixed;top: 0;left: 0;width: 100%;height: 100%;overflow: auto;background-color: rgba(0, 0, 0, 0.4);}.content {width: 500px;height: 400px;margin: 100px auto;background-color: #fefefe;border-radius: 10px;box-shadow: 0 0 5px 5px darkgray;}.text{position: relative;left: 100px;top: 50px;font-size: medium;}.input{position: relative;left: 100px;top: 70px;border-color: black;border-style: solid;border-width: 2px;border-radius: 10px;}button {position: relative;left: -10px;top: 110px;width: 55px;height: 30px;font-size: 14px;color: white;background-color:darkslategray;border: 0px;border-radius: 10px}</style>`
            document.querySelector('.content button').addEventListener('click',async()=>{
                var c=confirm('点击开始获取数据')
                if(c==true){
                    await geta()
                    setTimeout(()=>{download(document.title.split('_')[0],aatext)},2000)
                }
            })
        },
    };
    window.gui = new lil.GUI({ title: 'qq阅读辅助器' });
    window.gui.domElement.style.userSelect = 'none';
    var page = gui.addFolder('搜索');
    page.add(main, 'search').name('搜索书籍')
    var page1 = gui.addFolder('复制')
    if(location.href.includes('book-read')){
        page1.add(main,'copy').name('复制这一章内容')
        page1.add(main,'copyplus').name('下载指定文章内容')
    }
})();