// ==UserScript==
// @name         获取小红薯个人信息页面数据
// @run-at document-start
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  个人信息页面数据点赞数据
// @author       choukin
// @match        https://www.xiaohongshu.com/user/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require https://unpkg.com/ajax-hook@3.0.2/dist/ajaxhook.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475883/%E8%8E%B7%E5%8F%96%E5%B0%8F%E7%BA%A2%E8%96%AF%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF%E9%A1%B5%E9%9D%A2%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/475883/%E8%8E%B7%E5%8F%96%E5%B0%8F%E7%BA%A2%E8%96%AF%E4%B8%AA%E4%BA%BA%E4%BF%A1%E6%81%AF%E9%A1%B5%E9%9D%A2%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    // Your code here...
    let datas = []
    let page = 1
    let hasMore = true
    window.ah.proxy({
    //请求发起前进入
    onRequest: (config, handler) => {
        console.log(config.url)
        handler.next(config);
    },
    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
        console.log(err.type)
        handler.next(err)
    },
    //请求成功后进入
    onResponse: (response, handler) => {
        const { config} = response
        console.log(config.url.indexOf('//edith.xiaohongshu.com/api/sns/web/v1/user_posted'))
         if (config.url.indexOf('//edith.xiaohongshu.com/api/sns/web/v1/user_posted')>-1) {
             const res = JSON.parse(response.response)
             const body = JSON.parse(config.body)
             console.log(res)
             hasMore = res.data.has_more
             const notes = res.data.notes
             if (notes){
                datas = datas.concat(notes.map((item=>{
                    return {
                        id: item.note_id,
                        title: item.display_title,
                         likecount:item.interact_info.liked_count
                    }
                })))
            }
            if(page===1){
                page++;
                setText('解析中')
               window.setTimeout(autoScroll,1000)
            }

        }
        handler.next(response)
    }
})


function inputValue(value){
 document.querySelector('.search-input').value = value
}

 function renderResult(flag){
    $(function() {
     const tableHtml = renderTable()
     const end = flag?'解析结束':'解析中'
     $('#result').html(`<div>${end}</div><div>获取数据共：${datas.length} 条</div><div>${tableHtml}</div><div>${JSON.stringify(datas,null,2)}</div>`);
    });
 }


function renderTable(){
  let tablehtml = '';
      for(var i = 0; i < datas.length; i ++) {
          const item = datas[i]
        tablehtml += `<tr><td>${item.title}</td><td>${item.likecount}</td></tr>`;
      }

    return `<table><tr><td>标题</th><td>点赞量</th></tr>${tablehtml}</table>`

}




window.onload=function(){

//inputValue('5266162509')
//document.querySelector('.search-icon').click()
const initData =  window.__INITIAL_STATE__.user.notes.value[0]
console.log(initData)
if(initData){
datas = datas.concat(initData.map((item=>{
                    return {
                        id: item.id,
                        title: item.noteCard.displayTitle,
                         likecount:item.noteCard.interactInfo.likedCount
                    }
})))
if(page===1){
                page++;
                setText('解析中')
    window.setTimeout(autoScroll,1000)
}

}
createElement()
    //renderResult()

}

function createElement(){
   const result = document.createElement('div')
   result.id = 'result'
    result.style.padding = '1vw';
    result.style.width = '100vw';
    result.style.height = '100vh';
    result.style.margin = '0 auto';
    result.style.border = '1px solid #DDD';
    result.style.display= 'fiexd'
    result.style.background = 'rgb(5 107 0 / 59%)';
    result.style.color = 'white';
    result.style.position = 'fixed';
    result.style.top = 0;
    result.style.left=0;
    result.style.overflow = 'auto'
    result.innerText = '开始解析...'
   document.body.append(result)

}
function setText(text){
    const result = document.getElementById('result')
    if(result){
      result.innerText = text
    }
}




function autoScroll(){
    var height = document.body.clientHeight;
    var number = 0; //控制结束累加器
    var length = 0; //控制每次翻滚长度
    var frequency = 10000; //控制总时间
    var time = setInterval(function(){
    number += 1;
    if(!hasMore){
        console.log('url')
        console.log('所有的结果',datas)
        setText('解析完成')
        clearInterval(time);
        renderResult(1)
    } else {
        //length += height /frequency ;
        length += height /2 ;
        document.documentElement.scrollTop = length;
        renderResult()
    }

    },1000); //每隔100MS翻滚一次
}
})();