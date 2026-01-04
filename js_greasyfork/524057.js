// ==UserScript==
// @name       manga增强
// @namespace   Violentmonkey Scripts
// @match       https://www.mangabz.com/*
// @grant     unsafeWindow
// @license MIT
// @run-at document-end
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant        GM_xmlhttpRequest
// @version    3.0

// @author      伟大的chatgpt、bing
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @resource     element_css https://unpkg.com/element-ui@2.15.6/lib/theme-chalk/index.css
// @require    https://unpkg.com/element-ui@2.15.6/lib/index.js
// @description 2025/1/14 11:52:47
// @downloadURL https://update.greasyfork.org/scripts/524057/manga%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/524057/manga%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==
    // 保存原始的fetch函数


var star =document.querySelector('.detail-info-stars')
if(star!==null){star.style.display='none'}
if(location.href.match(/m(\d+)\/$/))
  {

 //滚动条
GM_addStyle('::-webkit-scrollbar {display:none!important')
//第一页
 GM_addStyle('#cp_image{display:none !important}')
document.querySelector("body > div:nth-child(3) > div").style.display='none'
 //修改底部末尾
var rong_qi=document.createElement('div')
rong_qi.className ='rongqi'
var leftblock=document.createElement('div')
leftblock.className='leftblock'
    leftblock.textContent='⬅上一章'
leftblock.addEventListener('click',function(){

 document.querySelector("body > div:nth-child(3) > div > a:nth-child(1)").click()
})


var rightblock=document.createElement('div')
rightblock.className='rightblock'
    rightblock.textContent='下一章➡'
rightblock.addEventListener('click',function(){
  console.log('您点击了下一章')

  document.querySelector("body > div:nth-child(3) > div:nth-child(1) > a:nth-child(5)").click()
})
    rong_qi.appendChild(leftblock)
    rong_qi.appendChild(rightblock)
    document.querySelector("body > div:nth-child(3)").appendChild(rong_qi)
    GM_addStyle(`
.container{
  width:100%;
}
.rongqi{
      display:flex;
      cursor:default;
      background-color:#272727;
      font-size: 30px;

      height:50px}
.leftblock{  align-items: center;
  width:50%;
text-align: center;
color:white}
.rightblock{width:50%;
    align-items: center;
text-align: center;
color:white;}
.leftblock:hover{
  background-color:black;
}
.rightblock:hover{
  background-color:black;
}
`)
//移除事件监听器
//移除topbar
//全局变量
let info_app
let chapter_index=''
let img_id


var observer=new MutationObserver(function(){
  var top_title=document.querySelector('.top-bar')
  if(top_title){
     top_title.style.display='none'
  document.body.style.paddingTop='0'
  }
  setTimeout(function(){
    observer.disconnect()
  },1000)
})
observer.observe(document.body,{childList:true})
//黑边移除
GM_addStyle('#cp_img>img{margin:auto !important}')
//目录
function mulu(nowChapterUrlNumber){
  console.log('我执行目录功能'+nowChapterUrlNumber)
   var side_bar=document.createElement('div')
 side_bar.setAttribute('class','side_bar')
side_bar.setAttribute('style','width:200px;position:fixed;height:100%;background-color:rgba(72, 72, 72, 0.6);top:0;left:0;opacity:0;overflow-y: scroll')
side_bar.style.setProperty('overflow', 'auto');
    side_bar.style.setProperty('scrollbar-width', 'none');
    side_bar.style.setProperty('-ms-overflow-style', 'none');
var title=document.createElement('h1')
title.textContent='目 录'
title.addEventListener('click',function(){
  window.location.href='https://www.mangabz.com/'+document.querySelector('.top-title a').getAttribute('href')
})
title.setAttribute('style','text-align:center;color:white;padding:10px;cursor:pointer;top:0')
side_bar.appendChild(title)

document.body.appendChild(side_bar)
 document.querySelector('.side_bar').style.opacity='0'
side_bar.addEventListener('mouseleave',function(){
document.querySelector('.side_bar').style.opacity='0'
})
side_bar.addEventListener('mouseenter',function(){
document.querySelector('.side_bar').style.opacity='1'

var gks=document.querySelector('.made_ul')
if(gks){
gks.children[chapter_index].scrollIntoView({ behavior: 'smooth', block: 'center' });
}
})
var top_title_href=document.querySelector('.top-title a')
var top_title_href_text=top_title_href.getAttribute('href')
var mulu_url='https://www.mangabz.com/'+top_title_href_text
//目录
let mulu_list=[]
let chaptersHref=[]
fetch(mulu_url).then(response=>{
  return response.text()
}).then(html=>{
  console.log('我执行了')
  var parse=new DOMParser()
  var doc=parse.parseFromString(html,'text/html')
  var mulu=doc.querySelector('.detail-list-form-con')

var ul=document.createElement('ul')
ul.setAttribute('class','made_ul')
ul.setAttribute('style','padding:5px;text-align:center;margin:0')

var items=Array.from(mulu.querySelectorAll('.detail-list-form-item')) .reverse()
items.forEach(item=>{

  var li=document.createElement('li')
 li.setAttribute('style', 'opacity:0.8;width:200px;height:60px;display:flex;align-items:center;justify-content:center;padding:0;margin:0;');

  var a=document.createElement('a')
  a.setAttribute('style','color:white;padding:10px;opacity:1，width:100%;cursor:pointer;')
  a.href=item.getAttribute('href')
  chaptersHref.push(item.getAttribute('href'))
  a.textContent=item.textContent.trim()
  mulu_list.push(item.textContent.trim())
  li.appendChild(a)
  ul.appendChild(li)
})
side_bar.appendChild(ul)

 var new_mulu=mulu_list.map(item=>{

  var part=item.split(/\s+/);
  return part[0]

})
var now_chapter=nowChapterUrlNumber
chapter_index=chaptersHref.findIndex(item=>item.includes(nowChapterUrlNumber))

  ul.children[chapter_index].scrollIntoView({ behavior: 'smooth', block: 'center' });
var mulu_li=document.querySelectorAll('.made_ul li')
end_li=mulu_li[chapter_index]
end_li.setAttribute('style','background-color: #FE9900; height:60px;color: white; width:200px !important; display:flex; align-items:center; justify-content:center; ')
}).
catch(error=>{
  console.log('警告，出现错误：'+error)
})
 GM_addStyle(`.side_bar li:hover { background-color: #FE9900; height:60px;color: white; width:200px !important; display:flex; align-items:center; justify-content:center; }`);
}
  var nowChapterUrlNumber=location.href.split('/')[3]
    mulu(nowChapterUrlNumber)
//瀑布流式观看漫画从上导线唉
//
//
// https://www.mangabz.com/m197700-p2/chapterimage.ashx?cid=197700&page=2&key=&_cid=197700&_mid=236&_sign=
let nowChapter
let chapterNumber
let all_page = document.querySelector('.bottom-page2').textContent.match(/(\d+)$/)[1]
let manga_list=[]
let end_url_list=[]
let now_img_length
var fragement=document.createDocumentFragment()
var container=document.querySelector('#cp_img')
nowChapter=location.href



async function get_manga_list() {
    for (let i = 1; i <= all_page; i++) {
        let one = location.href;
        let two = location.href.match(/\/m(\d+)/)[1];
        let three = document.querySelector('.top-title a').getAttribute('href').match(/(\d+)/)[1];
        let end_url = `${one}chapterimage.ashx?cid=${two}&page=${i}&key=&_cid=${two}&_mid=${three}&_sign=`;

        let response = await fetch(end_url);
        let data = await response.text();
         eval(data);

d=dm5imagefun()
        let img = document.createElement('img');
        img.setAttribute('class', 'i_made');
        img.src = d[0];
        end_url_list.push(d[0]);
        img.loading = "lazy";
        fragement.appendChild(img);
        container.appendChild(fragement);
        now_img_length = i;


        if (i === all_page) {
            console.log('图片加载完成');
        }
    }
    container.scrollTop = 0;
}

get_manga_list();



//左右键切换章节
  document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            document.querySelector("body > div:nth-child(3) > div > a:nth-child(2)").click()
        }
        if (event.key === 'ArrowRight') {
          document.querySelector("body > div:nth-child(3) > div > a:nth-child(5)").click()
        }
    });
    //右键全屏
    var now_full=true
    document.addEventListener("contextmenu", function(event) {
    if (now_full) {
            info_app.full=false
            document.documentElement.requestFullscreen();
            now_full = false;
    } else {
            info_app.full=true
            event.preventDefault();
            document.exitFullscreen();
            now_full = true;
    }
});

//创建一个vue
   let info = document.createElement('div')
   info.innerHTML=
       `
       <div class="progress-bar">
        <div class="progress-bar-fill"></div>
    </div>
    <div id="info_app" @mouseover="show=1" @mouseleave="show=0"  >
    <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">

      <template v-if="show"><div id="info_rtml" class="info_item"  v-highlight-scale style="cursor:pointer;">
            <div class='submenu'>
                    <div class='submenu_item' @click="download_zip" >下载zip</div>
                    <div class='submenu_item' @click="download_pdf">下载pdf</div>
                </div>
        {{message_do}}
        </div></template>
    </transition>
       <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
        <template v-if="show"><div id="info_rtml" class="info_item" @click="switch_full" v-highlight-scale style="cursor:pointer;">{{message_full}}</div></template>
    </transition>
       <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
        <template v-if="show"><div id="info_rtml" class="info_item" @click="switch_chapter"  v-highlight-scale style="cursor:pointer;">{{message_chapter}}</div></template>
    </transition>
       <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
        <template v-if="show"><div id="info_rtml" class="info_item" @click="switch_mulu" v-highlight-scale style="cursor:pointer;">{{message_mulu}}</div></template>
    </transition>
  <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
        <template v-if="show"><div id="info_rtml" class="info_item" @click="switch_sy" v-highlight-scale style="cursor:pointer;">{{message_sy}}</div></template>
    </transition>

    <template><div id="info_count" class="info_item">{{message_count}}</div></template>
</div>`;
document.body.appendChild(info)

// 定义样式，增加图片之间的间距
let info_style = `
#info_app {
    bottom: 2%;
    right: 2%;
    padding: 5px 5px;
    background: rgba(48,48,48,.7) !important;
    position: fixed;
    color: rgba(255,255,255,.7);
    border-radius: 3px;
    z-index: 99999;
}
.info_item {
text-align: center;
    padding: 5px 0px;
    width: 120px;
    cursor: pointer;
}

.submenu {
    display: none;


}

.info_item:hover .submenu {
    display: block;
}

.submenu_item {
    padding: 5px 0px;

}
 .progress-bar {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 200px;
            height: 20px;
            border: 1px solid #ccc;
            background-color: #f3f3f3;
            display:none;
        }
 .progress-bar-fill {
            width: 0;
            height: 100%;
            background-color: #4caf50;

        }


`;



GM_addStyle(info_style)
    Vue.directive('highlight-scale',{
        bind(el,binding,vnode){
            el.addEventListener('mouseover',function(){
                this.style.transform="scale(1.25)";
                this.style.textShadow = "0 0 10px #E2EAF4"; })
            el.addEventListener('mouseleave',function(){
                this.style.transform="scale(1.0)";
                this.style.textShadow="none"
            })
        }})
var img_number

info_app=new Vue({
  el:'#info_app',
  data:{
    bottom:0,
    img_id:1,
    img_number:all_page,
    show:0,
    full:1,
    chapter:localStorage.getItem('chapter')==='true',
  },
  computed:{
    message_chapter:function(){
      return this.chapter ?'↔分章阅读':'↕一读到底'
    }
    ,
    message_do:function(){
      return '☕下载本话'
    },
    message_count:function(){
      return this.img_id+'/'+all_page
    },
    message_full:function(){
     return this.full ?  '😋进入全屏' : '🥰退出全屏'
    },
    message_mulu:function(){
      return "📑返回目录";
    },
 message_sy:function(){
      return "📖返回首页";
    }
  },
  methods:{
    switch_chapter:function(){
      this.chapter=!this.chapter
    localStorage.setItem('chapter',this.chapter)





    },

    download_pdf:function(){
      if(this.chapter){alert('多章下载会出错')}
      if(now_img_length!==all_page){

        alert(' ❗❗ 图片还没有完全获取，当前获取了'+`${now_img_length}`+'张图片，共有'+all_page+'张图片🥰,最好滑动到底部哦')
        return

  }

  async function  download_pdf(){
      document.querySelector('.progress-bar').style.display = 'block';
    var fill=document.querySelector('.progress-bar-fill');
    var  end = '';

        const { jsPDF } = window.jspdf;

           var imgs = end_url_list

           var download_name=document.title.split('_')[0] + '--' + document.title.split('_')[1];


            let doc = new jsPDF('p', 'mm');

            for (let index = 0; index < imgs.length; index++) {

                    let img = imgs[index];

                    let imgData = await loadImage(img);

                  var one = img.split('/').pop();
                  var two = one.split('?')[0];
                  var end = two.split('.').pop();

                    if (end === 'JPG') {
                        end = 'JPEG';
                    }

                    let imgElement = new Image();
                    imgElement.src = imgData;
                    await new Promise(resolve => {

                        imgElement.onload = resolve;
                    });

                    var imgWidth = imgElement.width;
                    var imgHeight = imgElement.height;


                    let pageOrientation = imgWidth > imgHeight ? 'l' : 'p';

                    if (index === 0) {
                        doc = new jsPDF(pageOrientation, 'mm', [imgWidth * 0.264583, imgHeight * 0.264583]);
                    } else {
                        doc.addPage([imgWidth * 0.264583, imgHeight * 0.264583], pageOrientation);
                    }

                    doc.addImage(imgData, end, 0, 0, imgWidth * 0.264583, imgHeight * 0.264583);
                    var progress=((index+1)/imgs.length)*100
                   fill.style.width=progress+'%'

                    if (index === imgs.length - 1) {
                        doc.save(download_name+'.pdf');
                        document.querySelector('.progress-bar').style.display = 'none';
                    }


            }



    function loadImage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
               headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',  // 模拟浏览器 User-Agent
      'Referer': 'https://image.mangabz.com/'
    },
                onload: function(response) {
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        resolve(reader.result);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(response.response);
                },
                onerror: function(error) {
                    reject('请求图片失败: ' + error);
                }
            });
        });
    }
}
download_pdf()
    },
    download_zip: function() {
    if(this.chapter){alert('多章下载会出错')}
  if (now_img_length!= all_page) {
    alert(' ❗❗ 图片还没有完全获取，当前获取了'+`${now_img_length}`+'张图片，共有'+all_page+'张图片🥰,最好滑动到底部哦')
    return;
  }

            document.querySelector('.progress-bar').style.display = 'block';
    var fill=document.querySelector('.progress-bar-fill');
  var zip = new JSZip();
  Promise.all(end_url_list.map((url, index) => {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        responseType: 'blob',
         headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',  // 模拟浏览器 User-Agent
      'Referer': 'https://image.mangabz.com/'  // 模拟 Referer
    },
        onload: function(response) {

          var one = url.split('/').pop();
          var two = one.split('?')[0];
          var end = two.split('.').pop();
          var img_name = `${index + 1}.${end}`;
          console.log(img_name);
          zip.file(img_name, response.response,{ binary: true });
             var progress=((index+1)/all_page)*100
                   fill.style.width=progress+'%'
          resolve();
        },
        onerror: function(error) {
          reject(error);
        }
      });
    });
  })).then(() => {
    zip.generateAsync({ type: 'blob' }).then((content) => {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      var name = document.title.split('_')[0] + '--' + document.title.split('_')[1];
      a.download = name + '.zip';
      a.click();
       document.querySelector('.progress-bar').style.display = 'none';
    });
  }).catch(error => {
    console.error('下载图片或生成 ZIP 文件时出错:', error);
  });
},

    switch_mulu:function(){
      window.location.href = 'https://www.mangabz.com/' + document.querySelector('.top-title a').getAttribute('href');
    },
    switch_sy:function(){
      window.location.href='https://www.mangabz.com/'
    },
    switch_full:function(){
      this.full=!this.full
      if(!this.full){
         document.documentElement.requestFullscreen();
      }
      else{
           document.exitFullscreen();
      }

    }
    ,

  }

})
    // 获取当前页码

let run=true
function  getCHapter(){

if (info_app.chapter&&run){

 if( info_app.img_id >all_page-5&&info_app.img_id!==all_page){
   console.log('开始加载下一章节')

run=false
// 获取章节编号和漫画ID

var mangaId = MANGABZ_MID;
var imgUrlSet = new Set();
var imgUrl = [];
var i = 1;

async function fetchImages() {

   await fetch(nowChapter).then(re=>{return re.text()}).then(html=>{
         var parser=new DOMParser()
         var doc=parser.parseFromString(html,'text/html')


         let hrefEnd=doc.querySelector("body > div:nth-child(3) > div").lastElementChild.getAttribute('href')


         chapterNumber=hrefEnd.match(/\d+/)[0];
         nowChapter='https://www.mangabz.com'+hrefEnd


       })
  await fetch(nowChapter).then(re=>{return re.text()}).then(html=>{
          let parser=new DOMParser()
         let  doc=parser.parseFromString(html,'text/html')
           //添加一个标题
          let titleStyle=document.createElement('style')
          titleStyle.innerHTML=`
          .imadeTitle{
          background-color:#272727;
          color:white;
          padding:10px;
          text-align:center;
          font-size:30px;

          }
          `
          document.head.appendChild(titleStyle)
          let title=document.createElement('div')
          title.textContent=doc.title.split('_')[1]
          title.className='imadeTitle'
          let cpImg=document.querySelector("#cp_img")
          cpImg.appendChild(title)
        // 获取左右章节按钮元素
let leftEnd = doc.querySelector("body > div:nth-child(3) > div > a:nth-child(1)");
let rightEnd = doc.querySelector("body > div:nth-child(3) > div > a:nth-child(5)");

// 处理左箭头导航
if (leftEnd !== null) {
    // 提取左章节链接
    const leftHref = leftEnd.getAttribute('href'); // 修改变量名避免冲突
    if (leftHref && !leftHref.startsWith('javascript')) { // 过滤无效链接
        const leftUrl = 'https://www.mangabz.com' + (leftHref.startsWith('/') ? leftHref : `/${leftHref}`);

        // 左按钮点击事件
        leftblock.addEventListener('click', () => {
            window.location.href = leftUrl;
        });

        // 左箭头键盘事件
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                window.location.href = leftUrl;
            }
        });
    }
}

// 处理右箭头导航
if (rightEnd !== null) {
    // 提取右章节链接
    const rightHref = rightEnd.getAttribute('href'); // 修改变量名避免冲突
    if (rightHref && !rightHref.startsWith('javascript')) { // 过滤无效链接
        const rightUrl = 'https://www.mangabz.com' + (rightHref.startsWith('/') ? rightHref : `/${rightHref}`);

        // 右按钮点击事件
        rightblock.addEventListener('click', () => {
            window.location.href = rightUrl;
        });

        // 右箭头键盘事件
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                window.location.href = rightUrl;
            }
        });
    }
}


  })

    while (true) {

        var chapterurl = `https://www.mangabz.com/m${chapterNumber}/chapterimage.ashx?cid=${chapterNumber}&page=${i}&key=&_cid=${chapterNumber}&_mid=${mangaId}`;
        console.log(chapterurl)
            let response = await fetch(chapterurl);
            let  data = await response.text();

              eval(data);

          d=dm5imagefun()

            if (!imgUrlSet.has(d[0])) {
                imgUrlSet.add(d[0]);
                imgUrl.push(d[0]);

            } else {

                break;
            }
            i++;

    }


  all_page= Number(all_page) + Number(imgUrl.length);
now_img_length=Number(now_img_length)+Number(imgUrl.length)
console.log(all_page)

    cpImgContainer=document.querySelector("#cp_img")

    imgUrl.forEach((src, index) => {
        var img = document.createElement('img');
        img.setAttribute('class', 'i_made');
        img.src = src;
        cpImgContainer.appendChild(img)

    });
run=true
//发送历史记录
  let uid=MANGABZ_USERID
  let historyUrl=`https://www.mangabz.com/m${chapterNumber}/readHistory.ashx?cid=${chapterNumber}&mid=${mangaId}&page=1&uid=${uid}&language=1`
  console.log(chapterurl)
fetch(historyUrl).then(re=>re.text()).then(data=>{
  console.log('发送成功')
})
  //更新目录
  document.querySelector('.side_bar').remove()
mulu(chapterNumber)
}

fetchImages();


                          }
          }
}
function checkImagesInView() {
  getCHapter()
  document.querySelectorAll('img.i_made').forEach((img, index) => {
    const rect = img.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    if (rect.top >= 0 && rect.top < windowHeight) {
      // 图片在视口中
      info_app.img_id = index + 1;

    }
  });
}

window.addEventListener('scroll', function(){

  checkImagesInView();
});


  }
//批量下载功能
if(location.href.match(/\d+bz\/$/))
  {
  GM_addStyle(GM_getResourceText("element_css"))

var button=document.createElement('button')
button.setAttribute('class','selectButton')
button.textContent='批量下载'
button.setAttribute('style',`
margin-right: 30px;
height: 40px;
    font-size: 14px;
    background-color:#ffffff;
    color: #595959;
    border-radius: 20px;
    position: relative;
    border: 1px solid #ccc;
    width: 100px;
    left: 15px;`)
var parent=document.querySelector('.detial-info-btn-con')
parent.style.display='flex'
parent.appendChild(button)
button.addEventListener('click',download)
    function download(){
      //取消按钮，增加按钮
    document.querySelector('.selectButton').remove()

      //确定下载按钮
    var dobutton=document.createElement('button')
dobutton.setAttribute('class','doButton')
dobutton.textContent='确定下载'
dobutton.setAttribute('style',`
margin-right: 30px;z
height: 40px;
    font-size: 14px;
    background-color: #ffffff;
   margin-right:15px;
    border-radius: 20px;
    position: relative;
    color: #595959;
    border: 1px solid #ccc;
    width: 100px;
    left: 15px;`)

parent.appendChild(dobutton)
      //取消下载按钮
var escbutton=document.createElement('button')
escbutton.setAttribute('class','escbutton')
escbutton.textContent='取消下载'
escbutton.setAttribute('style',`
height: 40px;
    font-size: 14px;
    background-color: #ffffff;
    color: #595959;
    border-radius: 20px;
    position: relative;
    border: 1px solid #ccc;
    width: 100px;
    left: 15px;`)
escbutton.addEventListener('click',function(){
 document.querySelector('#chapterDownload').remove()
  document.querySelector('.escbutton').remove()
  document.querySelector('.doButton').remove()
  parent.appendChild(button)
})
parent.appendChild(escbutton)

      //下载逻辑

         var id = [];//章节id
        var pageNumber = [];//章节页码
        var names = [];//章节名字

        var As = document.querySelectorAll("#chapterlistload a");
        Array.from(As).reverse().forEach(a => {


            var href = a.getAttribute('href');
            var na = a.textContent;
            var name=na.replace(/\s+/g,' ')
            names.push(name.trim());

            var chapterID = href.match(/\d+/)[0];
            id.push(chapterID);

            var span = a.querySelector('span');
            var text = span.textContent;
            var number = text.match(/\d+/)[0];
            pageNumber.push(number);
        });


        var mangaId = MANGABZ_COMIC_MID;
        var downloadApp = document.createElement('div');
        downloadApp.innerHTML = `
      <div id='chapterDownload'>
    下载范围:
    <el-select v-model="begin" placeholder='起始话' style="width: 150px;margin-left:15px; margin-right: 15px;">
        <el-option v-for="(name, index) in names" :key="index" :label="name" :value="index" size="mini">
        </el-option>
    </el-select>
  至
    <el-select v-model="end" placeholder='最终话' style="width: 150px; margin-left: 15px;">
        <el-option v-for="(name, index) in names" :key="index" :label="name" :value="index" size="mini">
        </el-option>
    </el-select>

</div>
`

       var collect=document.querySelector('.detail-info-btn-2.btn_collection')
       collect.after(downloadApp)
var beginIndex
var endIndex
        new Vue({
            el: '#chapterDownload',
              data: {
              end:'',
                begin: '',
                names: names
            },
         watch: {
    begin(newVal) {
      beginIndex=newVal
    },
    end(newVal) {
      endIndex=newVal
    }
  }
        });
document.querySelector('.doButton').addEventListener('click', async function() {
  document.querySelector('#chapterDownload').remove()
  document.querySelector('.escbutton').remove()
  document.querySelector('.doButton').remove()
 button.disabled = true;
   parent.appendChild(button)

  var begin = beginIndex;
  var end = endIndex;
  if (begin > end) {
    var temp = end;
    end = begin;
    begin = temp;
  }

  var chapterZip = new JSZip();
  var allChapterNumber=end-begin+1//记录总章节数字
      // 创建一个下载进度栏
    var progressContainer = document.createElement('div');
    progressContainer.id = 'progress-container';
    progressContainer.style.position = 'fixed';
    progressContainer.style.top = '50px';
    progressContainer.style.right = '10px';
    progressContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    progressContainer.style.padding = '10px';
    progressContainer.style.borderRadius = '5px';
    progressContainer.style.color = 'white';
    progressContainer.style.display = 'flex';
    progressContainer.style.alignItems = 'center';
    progressContainer.style.zIndex = '1000';

    var progressText = document.createElement('span');
    progressText.id = 'progress-text';
    progressText.style.marginRight = '10px';

    var progressBar = document.createElement('progress');
    progressBar.id = 'progress-bar';
    progressBar.style.width = '200px';

    // 设置进度条的初始属性
    progressBar.value = 0;
    progressBar.max = 1;
    progressText.textContent = `下载进度:0/${allChapterNumber}`;

    // 将进度条和文本添加到容器中
    progressContainer.appendChild(progressText);
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);

  var count=0
  for (let index = begin; index <= end; index++) {
    count=count+1
    var imgUrl = [];
    var page = pageNumber[index]; // 总页数
    var folder = chapterZip.folder(names[index]);
    for (let i = 1; i <= page; i++) {
      var chapterurl = `https://www.mangabz.com/m${id[index]}/chapterimage.ashx?cid=${id[index]}&page=${i}&key=&_cid==${id[index]}&_mid=${mangaId}`;

      await fetch(chapterurl)
        .then(response => response.text())
        .then(data => {
         eval(data);
d=dm5imagefun()
          imgUrl.push(d[0]);
        });
    }

    // 等待所有 GM_xmlhttpRequest 完成
    await Promise.all(imgUrl.map((link, imgIndex) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'GET',
          url: link,
          responseType: 'blob',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://image.mangabz.com/*'
          },
          onload: function(response) {
            var one = link.split('/').pop();
            var two = one.split('?')[0];
            var end = two.split('.').pop();
            var img_name = `${imgIndex + 1}.${end}`;
            folder.file(img_name, response.response, { binary: true });
            resolve();


          },
          onerror: function(error) {
            alert(`下载${names[index]}出错`)
            console.log(error)
            resolve()
          }
        });
      });
    }));
  await new Promise(r => setTimeout(r, 500));
  progressBar.value=count/allChapterNumber
progressText.textContent = `下载进度: ${count}/${allChapterNumber}`;
  }
progressText.textContent = `下载完成，开始压缩...`
  // 添加文件完成，开始压缩文件夹
chapterZip.generateAsync({ type: 'blob' },function(progress){
 progressBar.value = progress.percent / 100;
    progressText.textContent = `压缩进度: ${Math.floor(progress.percent)}%`
  }).then(content => {
    document.querySelector('#progress-container').remove()
    button.disabled=false
    var link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    var name = document.querySelector('.detail-info-title');
    if (name == null) {
      name = '没找到名字';
    } else {
      name = name.textContent.trim();
    }
    link.download = name + '.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });
});



    }




  }


