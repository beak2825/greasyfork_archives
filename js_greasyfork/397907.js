// ==UserScript==
// @name         扩展设计器网页审核回复模版
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://ext.mblock.cc/
// @match        https://ext.makeblock.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397907/%E6%89%A9%E5%B1%95%E8%AE%BE%E8%AE%A1%E5%99%A8%E7%BD%91%E9%A1%B5%E5%AE%A1%E6%A0%B8%E5%9B%9E%E5%A4%8D%E6%A8%A1%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/397907/%E6%89%A9%E5%B1%95%E8%AE%BE%E8%AE%A1%E5%99%A8%E7%BD%91%E9%A1%B5%E5%AE%A1%E6%A0%B8%E5%9B%9E%E5%A4%8D%E6%A8%A1%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Your code here...
    window.onload = ()=>{
        addjQuery(()=>{
            allFunction();
        });
    }

function allFunction(){
    //add css
    let style = document.createElement('style');
    let allData;
    let csss = `
      .button-reply {
          z-index: 1; position: fixed; top: 60px; z-index: 999 !important; right: 20px;
       }
      .aside {
        padding: 105px 0 20px; background: white;
        width: 300px; height: 100%; position: fixed; right: 0; top: 0; transform: translateX(100%); transition: transform .4s; z-index: 2; box-shadow: -2px 2px 5px 0 rgba(0,0,0,.4);
        overflow-y: auto;
       }
      .aside.active {transform: translateX(0%);}
      .each-rw {padding: 15px 15px; border-bottom: 1px solid rgba(0,0,0,0.1); cursor: pointer;}
      .each-rw:hover {background: #f2f8ff;}
      .hint {color: #b2b2b2;}
      .copiedPrompt {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        top: 70px;
        color: red;
        opacity: 0;
        padding: 10px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.4);
        box-shadow: 0 10px 24px rgba(8, 15, 26, 0.16);
        -webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
       }
      .copiedPrompt.active {opacity: 1;}
      label.filter {display: inline-block;padding: 3px 10px;cursor: pointer;}
      .switch-wrap {display:flex; flex-wrap: wrap;}
    `
    style.innerText = csss;
    document.head.appendChild(style);



    //mock data
   /* let data = [{
      text: 'Congrats! You could create demos based on your extension in the community: http://planet.mblock.cc/, and then paste the demo work link into your "extesion homepage" section in the extension builder.',
      hint: "当用户扩展审核通过时"
    },{
      text: "Congrats your extension passed. However, please add more content (like blocks) for your extension to make it better and more interesting for users of mBlock",
      hint: "当扩展积木较少，但是没有大问题时"
    },{
      text: "Congrats your extension passed. However, please choose a meaningful cover that is more related to the functionality of your extension. This will help others know what your extension is about.",
      hint: "当扩展没有大问题，但封面图片不相关或者无实际意义时"
    },{
      text: "Congrats! However, please add more details for your next update. We will release an extension market soon, those description will be important as your extension info.",
      hint: "当扩展没有大问题，但更新说明过于简短时"
    },];

    let zhData = [{
      text: '审核通过！如果想让更多人学会使用您的扩展，可以到作品社区使用您的扩展创建作品，展示如何使用您的扩展：http://mblock.makeblock.com/ 然后可以在扩展设计器中将作品主页链接更新到扩展主页一栏，方便使用者查看案例',
      hint: "当用户扩展审核通过时"
    },{
      text: "恭喜您的扩展审核通过，但是内容仍然需要一定程度的完善和丰富，建议您可以多增加一些积木。",
      hint: "当扩展积木较少，但是没有大问题时"
    },{
      text: "恭喜您的扩展审核通过，但是出于扩展展示的目的，请您为自己的扩展更换更合适，更能表现您扩展特色，以及增加扩展吸引力的封面",
      hint: "当扩展没有大问题，但封面图片不相关或者无实际意义时"
    },];
    */



    //
     console.log("you‘re using扩展设计器网页脚本")
    let aside = document.createElement('div'); /*侧边栏*/
    let reviewWrap = document.createElement('div'); /*侧边栏里wrap*/
    aside.classList.add('aside');
    
    document.body.appendChild(aside); /*页面插入checkbox*/

    fillInCategory(); /*植入checkbox*/
    aside.appendChild(reviewWrap); /*植入评论wrap*/
    reviewWrap.classList.add('reviews');

    let asideState = false /*侧边栏状态*/

    let copiedPrompt = document.createElement('p'); /*已复制 提示文字*/
    copiedPrompt.classList.add('copiedPrompt');
    //copiedPrompt.textContent = '已填充回复！'
    copiedPrompt.textContent = '已复制到剪切板！'

    let btnEl = document.createElement('button'); /*弹出按钮*/
    btnEl.textContent = '回复模版'
    btnEl.classList.add('button-reply')
    btnEl.classList.add('ant-btn')
    btnEl.classList.add('ant-btn-primary')
    btnEl.classList.add('ant-btn-lg')
    btnEl.setAttribute('id','template')
//    console.log(btnEl);
    document.body.appendChild(btnEl);
    btnEl.addEventListener('click', (e)=>{
      switchPopState(asideState);
      asideState = !asideState;
      e.stopPropagation();
    })
    document.body.addEventListener('click', ()=>{
      if(asideState) switchPopState(true);
      asideState = false;
    })
    aside.addEventListener('click', (e)=>{
     e.stopPropagation();
    })


    //将数据放入侧边栏中
   // window.addEventListener('load', ()=>{

    fetch('https://hobart.avosapps.us/api/audit/content/query')
        .then(e=>e.json())
        .then((e)=>{
          console.log(e)
          let {data} = e;
          allData = data;
          dataToDOM(data)
          aside.parentNode.appendChild(copiedPrompt);
      })

   // })
    
    showExtensionID();


    /*
    *评论数据DOM渲染
    */
    function dataToDOM(data){
    let els = document.createDocumentFragment();
     $('.aside .reviews').empty();
     data.forEach(e=>{
      let el = `
        <div class='each-rw' title='点击以填充到评论框'>
          <p class='text'>${e.text}</p>
          <p class='hint'>${'注: '+e.hint}</p>
        </div>
       `
      let $el = $(el)
      els.appendChild($el[0]);

      $el.on('click', ()=>{
        let $reason = document.querySelector('#reason');
        if(!$reason) {
          copiedPrompt.textContent = '请先打开评论框'
          triggerToast(3000);
          return
        };
        
        //$reason.value = e.text;
        triggerToast(3000);
       copyText(e.text, ()=>{
           copiedPrompt.textContent = '已复制到剪切板！'
           triggerToast(3000);
       })
      })
    })
      reviewWrap.appendChild(els);
    }

    /*
    *切换侧边栏弹出方法
    */
    function switchPopState(state){
       if(!state) {
          aside.classList.add('active')
          btnEl.innerText = '关闭'
       }else{
          aside.classList.remove('active')
          btnEl.innerText = '回复模版'
       }
    }

    /*复制到剪切板*/
    function copyText(text, callback){ // text: 要复制的内容， callback: 回调
        var tag = document.createElement('input');
        tag.setAttribute('id', 'cp_hgz_input');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_hgz_input').select();
        document.execCommand('copy');
        document.getElementById('cp_hgz_input').remove();
        if(callback) {callback(text)}
    }

   /*触发提示框*/
   function triggerToast(time){
    if(!time) time = 3000;
    copiedPrompt.classList.add('active');
       let id = setTimeout(()=>{
          copiedPrompt.classList.remove('active');
          window.clearTimeout(id);
       },time)
   }

   /*填充分类选项*/
   function fillInCategory(){
    let categoryDOM = `
        <div class='switch-wrap'>
            <label for='ad_Checkbox1' class='filter'>所有
                <input name="selector[]" id="ad_Checkbox1" class="ads_Checkbox" type="checkbox" value="all" checked/>
           </label>
            <label for='ad_Checkbox2' class='filter'>
            中文
            <input name="selector[]" id="ad_Checkbox2" class="ads_Checkbox" type="checkbox" value="zh" />
            </label>
            <label for='ad_Checkbox3' class='filter'>
                英文
            <input name="selector[]" id="ad_Checkbox3" class="ads_Checkbox" type="checkbox" value="en" />
            </label>
           <label for='ad_Checkbox4' class='filter'>
                通过
            <input name="selector[]" id="ad_Checkbox4" class="ads_Checkbox" type="checkbox" value="1" />
            </label>
          <label for='ad_Checkbox5' class='filter'>
            不通过
            <input name="selector[]" id="ad_Checkbox5" class="ads_Checkbox" type="checkbox" value="0" />
        </label>
        </div>
        `
    let $categoryDOM = $(categoryDOM);
    $(aside).append($categoryDOM[0]);

    $('.ads_Checkbox').on('change', function(){
        var val = [];
        $(':checkbox:checked').each(function(i){
          val[i] = $(this).val();
        });
        if(val.includes('all')) {
            dataToDOM(allData)
        }else{
         let data = Datafilter(val, allData);
         dataToDOM(data);
        }
     });


   }
}



    function showExtensionID(){
      $('.table-list-item').each((index,e)=>{
        let href = $(e).find('.list-cell a').attr('href');
         if(href) {
             let id = href.split('/');
            id = id[id.length-1];
            id = id.replace('.mext', "");
             $(e).append(`<div>ID: ${id}</div>`)
         };
      })
    }

    function Datafilter(val, allData){
      console.log(val);
        let data = [];
       if(val.length && val.length > 0) {
         allData.forEach(e=>{
           val.forEach(i=>{
               if(i === '0' || i === '1') { i = i - 0; console.log(i)}
            if(e.lang === i || e.resloveType === i) {
              data.push(e)
            }
           })
         })
       }
        return data
    }


    /*移动按钮位置*/
//     dragElement(document.getElementById("template"));

//     function dragElement(elmnt) {
//         console.log(elmnt);
//       var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
//       elmnt.addEventListener('mousedown', dragMouseDown);

//       function dragMouseDown(e) {
//           console.log(e)
//         e = e || window.event;
//         e.preventDefault();
//         // get the mouse cursor position at startup:
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         document.onmouseup = closeDragElement;
//         // call a function whenever the cursor moves:
//         document.onmousemove = elementDrag;
//       }

//       function elementDrag(e) {
//         e = e || window.event;
//         e.preventDefault();
//         // calculate the new cursor position:
//         pos1 = pos3 - e.clientX;
//         pos2 = pos4 - e.clientY;
//         pos3 = e.clientX;
//         pos4 = e.clientY;
//         // set the element's new position:
//         elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
//         elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
//       }

//       function closeDragElement() {
//         // stop moving when mouse button is released:
//         document.onmouseup = null;
//         document.onmousemove = null;
//       }
//     }


    /*添加jQuery*/
    function addjQuery(fn){
      let location = window.location;
        let jQueryURL;
        if(location.host === 'ext.mblock.cc') {
            jQueryURL = `https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js`
        }else {
            jQueryURL = `https://code.jquery.com/jquery-3.4.1.min.js`
        };
        let JQscript = document.createElement('script');
        JQscript.type = 'text/javascript';
        document.body.appendChild(JQscript);
        JQscript.onload = fn;
        JQscript.src = jQueryURL;
    }

    })();