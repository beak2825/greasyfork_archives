// ==UserScript==
// @name         电子书思维导图-书图图
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  微信读书思维导图工具。需要配合chrome插件Alalways Disable Content-Security-Policy使用，否则可以在控制台看到报错（Refused to load the script '<URL>'），无法加载关键js代码文件。
// @author       shututu.cn
// @license MIT
// @match        weread.qq.com/*
// @match        book.douban.com/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_32h.png
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448196/%E7%94%B5%E5%AD%90%E4%B9%A6%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE-%E4%B9%A6%E5%9B%BE%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/448196/%E7%94%B5%E5%AD%90%E4%B9%A6%E6%80%9D%E7%BB%B4%E5%AF%BC%E5%9B%BE-%E4%B9%A6%E5%9B%BE%E5%9B%BE.meta.js
// ==/UserScript==

//根据传入的URL，在head里生成script引用DOM对象
function createScriptLink(url) {
    var scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'text/javascript');
    scriptElement.setAttribute('src', url);
    document.head.appendChild(scriptElement);
    console.log('添加引用：' + (new XMLSerializer()).serializeToString(scriptElement));
}

function doubanBookMindTodo(){
  let url= window.location.href ;
  let [source , bookid] = url.match(/book.douban.com\/subject\/(\d+)/)
  if(!bookid) return console.warn('不是豆瓣读书')
  let text = document.querySelector(`#dir_${bookid}_full`).textContent ;
  text = text.replace(/(第.+章)\s{0,99}\n\s{0,99}/g,'$1 '); //修复章节标题修复，不在同一行。如douban.com/subject/34847879/
  const RegIgnore = /版\s{0,9}权|目\s{0,9}录|前\s{0,9}言|导\s{0,9}读|书\s{0,9}名|序\s{0,9}言|致\s{0,9}谢|附\s{0,9}录|推荐序|献\s{0,9}词|赞\s{0,9}誉|后\s{0,9}记|导\s{0,9}言|译者序|索\s{0,9}引|参考文献|出版说明|内容提要/;
  let lines = text.split('\n').map(i=> i.trim() ).filter(i=>i && !RegIgnore.test(i) && i!= '· · · · · ·     (收起)')
  let findPart , findChapter , findLevel1 , findLevel2 , findCount , parseDic , parsed  , mindTodo ;
  parseDic = {} , parsed = [] , findCount = 0  ;
  findPart = !!text.match(/第\s?.\s?(篇|部分)/) , findChapter = !!text.match(/第\s?.\s?章/), findLevel1 = lines.some(i=> i.match(/^\s?\d\.\d/)), findLevel2 = lines.some(i=> i.match(/^\s?\d\.\d.\d/));
  parsed = lines.map(i=> Object({ level: 1 , title: i.replace(/\s\d+$/g,'')  }))

  if( findPart ) findCount ++ , parsed.forEach(item=>{if( !item.title.match(/^第\s?.\s?(篇|部分)/) ) item.level += 1;} )
  if( findChapter ) findCount ++ , parsed.forEach(item=>{ if( item.level>=findCount && !item.title.match(/^第\s?.{1,4}\s?章/) ) item.level += 1; })
  if( findLevel1 ) findCount ++ , parsed.forEach(item=>{if( item.level>=findCount &&! item.title.match(/^\s?\d{1,3}\.\d/) ) item.level += 1; })
  if( findLevel2 ) findCount ++ , parsed.forEach(item=>{if( item.level>=findCount &&! item.title.match(/^\s?\d{1,3}\.\d{1,3}.\d/) ) item.level += 1;} )
  /*parsed.forEach( item =>{
    if( RegIgnore.test(item.title) ) item.level = 1 ;
  })*/
  parsed.unshift({ level:0 , title: document.querySelector('meta[property="og:title"]').getAttribute('content') } )
  mindTodo = parsed.map(i=> `${ '-'.padStart( i.level*2 +1 ,'  ') } ${i.title}` ).join('\n');
  console.log('find:' , {findPart , findChapter , findLevel1 , findLevel2 , findCount } , parsed )
  return '```mindtodo\n' +mindTodo + '\n```' ;
  //return mindTodo ;
}

const WebSite = 'http://shututu.cn'

function addMindTodoBtn(){
  let {isbn} = getBookDataDouban()
  let url= window.location.href ;
  let [source , bookid] = url.match(/book.douban.com\/subject\/(\d+)/)
  if(!bookid) return console.warn('不是豆瓣读书')
  jQuery('.aside').prepend(`<div class="wrapper" style="padding-bottom: 6px">
   <a href="${WebSite}/${isbn}/mindtodo?isbn=1" target="_blank" rel="nofollow" class="mindTodo" title="点击查看思维导图">思维导图
  </a></div>`)
}
let getBookInfo = async ( url )=>{
	if( !url && window ) url = window.location.href ;
	let res = await axios.get( url ).then(r=>r.data)
	let [srouce , bookStr]  = res.match(/window.__INITIAL_STATE__=(.*);\(function\(\){/) || [] ;
	window.bookInfoObj = JSON.parse(bookStr)
	let { pageTitle , pageKeywords , pageDescription , reader  } = bookInfoObj
	window.bookInfo = Object.assign(  window.bookInfo || {} , reader.bookInfo , { pageTitle , pageKeywords , pageDescription } ) ;
	return window.bookInfo ;
}
function addMindTodoBtnWx(){
    jQuery("div.readerControls.readerControls").prepend(`<button title="导图" class="readerControls_item mind" style="color: white;background-color: #1b88ee;">导图</button>`);
    jQuery("div.readerControls.readerControls .mind").click(async()=>{
        var url= window.location.href ;
        let bookInfo = await getBookInfo(url);
        let {bookId,isbn} = bookInfo; // window.__INITIAL_STATE__.reader.bookId ; //因为作用域报错
        url = url.replace(/.*reader\/(.*)/,'$1').substr(0,23) ;
        //let mindUrl = `localhost:8365/${bookId}/mindtodo?isbn=${isbn}&url=${url}`
        let mindUrl = `${WebSite}/${bookId}/mindtodo?isbn=${isbn}&url=${url}&from=wx`
        window.open(mindUrl,'_blank');
    })
}

var bookData ;
//获取豆瓣的数据
function getBookDataDouban(){
    if(bookData) return bookData ;
    let keywords =  jQuery('meta[name="keywords"]').attr('content')
    let title = jQuery('meta[property="og:title"]').attr('content')
    let description = jQuery('meta[property="og:description"]').attr('content')
    let isbn = jQuery('meta[property="book:isbn"]').attr('content')
    let author = jQuery('meta[property="book:author"]').attr('content')
    let image = jQuery('meta[property="og:image"]').attr('content')
    let url = jQuery('meta[property="og:url"]').attr('content')
    let mindTodo = doubanBookMindTodo();
    let book = { title , desc : description , keywords , isbn , author , image, url , mindTodo }
    bookData = book ;
    return book ;
}

async function isExistMindTodo(isbn){
    let apiUrl = '${WebSite}/api/mindtodo' ;
    let res = await axios.get(`${apiUrl}?exist=1&isbn=`+isbn).then(r=>r.data) ;
    if( res.data ) return ; //已经创建；
    let book = getBookDataDouban()
    res = await axios.post(`${apiUrl}`,book).then(r=>r.data) ;
    console.log('添加思维导图：',res);
    if(res.errno) console.error('添加思维导图：',res.errmsg);
}

if (typeof jQuery == 'undefined') createScriptLink('//unpkg.com/jquery@3.6.0/dist/jquery.js');

createScriptLink('//unpkg.com/axios@0.26.0/dist/axios.min.js');
createScriptLink('//unpkg.com/lodash@4.17.21/lodash.js');
createScriptLink('//unpkg.com/turndown@7.1.1/lib/turndown.browser.umd.js');//转换markdown
createScriptLink('//unpkg.com/turndown-plugin-gfm@1.0.2/dist/turndown-plugin-gfm.js');//转换markdown

(function() {
    'use strict';

    var url= window.location.href ;
    if( url.includes('douban.com')){
        let book = getBookDataDouban()
        console.log('douban',book);
        setTimeout(addMindTodoBtn,50);//addMindTodoBtn();
    }
    if(url.includes('weread.qq.com/web/reader')){
       setTimeout(addMindTodoBtnWx,3000);
    }

    console.log('ebook userscripte');
    // Your code here...
})();

GM_addStyle(`
.mindTodo{width: 100%; height: 80px; font-size: 40px; display: flex; align-items: center; justify-content: center; border-radius: 6px; background-color: #c9c4c4; text-align: justify;}
.active{ background-color: rgb(227, 241, 237); }

`);