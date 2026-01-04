// ==UserScript==
// @name         manhuafree.com界面修改
// @namespace   Violentmonkey Scripts
// @match       https://manhuafree.com/*
// @match       https://m.g-mh.org/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @version     1.0
// @run-at document-start
// @require     https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @author      52lcx
// @description 小小改动
// @downloadURL https://update.greasyfork.org/scripts/526725/manhuafreecom%E7%95%8C%E9%9D%A2%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/526725/manhuafreecom%E7%95%8C%E9%9D%A2%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==


GM_addStyle('::-webkit-scrollbar {display:none!important')
// 去广告
let adList = ['#uptopButton', '.adshow.height-2', '.my-2', '.grid.grid-cols-2.gap-8.sm\\:gap-6.sm\\:grid-cols-4.m-5.md\\:m-0', '.mb-1.mt-10.mx-5.md\\:mx-0.text-center',
              '.container.px-1.mt-2', '#chapterNav','#navad','.flex.flex-row.justify-center.space-x-4.py-8','.pb-14','.adshow'];
for (let ad of adList) {
    GM_addStyle(`${ad} { display: none !important; }`);
}



// if (location.href=='https://manhuafree.com/user/bookmark'){

// // }
// //  let  suibainxiangde=document.querySelector('.hidden.md\\:flex').lastChild.lastChild
//  if(suibainxiangde){
//    suibainxiangde.style.visibility='hidden';
//  }
if(!/[a-zA-Z]/.test(location.href.split('/').pop())&&location.href.includes('manhua')&&location.href.split('/').length>5){
   GM_addStyle('.bg-default-100 { background-color: #272727 !important; }');
let target =document.body


    let urlObsrve = new MutationObserver(callback1);

function callback1(mutations, observer) {
    // 遍历所有变动记录
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            // 检查新增节点中是否有目标元素
            const url = document.querySelector("#chapterContent");
            if (url) {
                observer.disconnect();
                app();
                console.log('停止观察了');
                return; // 找到后立即退出，避免后续处理
            }
        }
    }
}

    urlObsrve.observe(target, { childList: true });

  setTimeout(function(){
    urlObsrve.disconnect()
  },5000)
  }
  let observer=new MutationObserver(callback)
  function callback(){

    console.log('所有 script 元素已被删除')

  if(location.href=='https://manhuafree.com/'){
var history = document.querySelector("#HistorMangaList");

if(history){
  history.addEventListener('mouseover', function() {
  history.style.flexWrap = 'wrap';
});

history.addEventListener('mouseleave', function() {
  history.style.flexWrap = 'nowrap';
});

}

}
    let iframes=document.querySelectorAll('iframe')
    if(iframes)
      {
        iframes.forEach(iframe=>{
          iframe.remove()
          console.log('移除成功')
        })


      }

  }

   // observer.observe(document.body,{childList:true,subtree:true})
    observer.observe(document,{childList:true,subtree:true})
  setTimeout(function(){
     observer.disconnect()
    console.log('停止观察')
  },10000)

function app(){
  //左右键切换章节
  document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            document.querySelector("#prevchapterb").click()
        }
        if (event.key === 'ArrowRight') {
          document.querySelector("#nextchapterb").click()
        }
    });
    //右键全屏
    var now_full=true
    document.addEventListener("contextmenu", function(event) {
    if (now_full) {
            infoApp.full=false
            document.documentElement.requestFullscreen();
            now_full = false;
    } else {
            infoApp.full=true
            event.preventDefault();
            document.exitFullscreen();
            now_full = true;
    }
});

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
  GM_addStyle('.flex-col{display:none!important}')

    if(localStorage.getItem('dark') === 'true'){
       GM_addStyle('.bg-default-100 { background-color: #272727 !important; }');
    }
  else{
     GM_addStyle('.bg-default-100 { background-color:#edecea!important; }');
  }


    let info = `
    <div id="info" @mouseover="show=1" @mouseleave="show=0" >
    <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
           <template v-if="show"><div id="info_switch" class="info_item" @click="switch_full" v-highlight-scale style="cursor:pointer;">{{message_full}}</div></template>
        </transition>
        <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
           <template v-if="show"><div id="info_switch" class="info_item" @click="switch_mulu" v-highlight-scale style="cursor:pointer;">{{message_mulu}}</div></template>
        </transition>
   <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
          <template v-if="show"><div id="info_switch" class="info_item" @click="switch_sy" v-highlight-scale style="cursor:pointer;">{{message_sy}}</div></template>
        </transition>
    <transition name="custom-classes-transition" enter-active-class="animate__animated animate__fadeIn" leave-active-class="animate__animated animate__fadeOut">
          <template v-if="show"><div id="info_switch" class="info_item" @click="switch_night" v-highlight-scale style="cursor:pointer;">{{message_switch}}</div></template>
        </transition>
        <template><div id="info_count" class="info_item">{{message_count}}</div></template>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', info);

    let info_style = `#info {
    text-align:center;
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
        padding: 5px 0px;
        width: 120px;
        cursor: pointer;
    }
    .submenu {
        display: none;
    }
    #info_download:hover .submenu {
        display: block;
    }
    .submenu_item {
        padding: 5px 0px;
    }`;


    GM_addStyle(info_style);
    let datams=document.querySelector("#chapterContent").getAttribute('data-ms')

    //let allpageLength = document.querySelectorAll("#chapcontent noscript").length;
    let allpageLength
    let datasc=document.querySelector("#chapterContent").getAttribute('data-cs')
    let infoApp = new Vue({
        el: '#info',
        data: {
            id: 1,
            dark: localStorage.getItem('dark') === 'true',
            show: false,
          full:!document.fullscreen,
          allpageLength:0,
        },
      created(){
  let url=`https://api-get-v2.mgsearcher.com/api/chapter/getinfo?m=${datams}&c=${datasc}`
  console.log(url)
        fetch(url)
    .then(re => re.json())
    .then(data => {
       this.allpageLength= data.data.info.images.images.length
    });
      },
        computed: {
          message_full:function(){
            return  this.full ? '🔍进入全屏':'⏹退出全屏'
          }
          ,
          message_sy:function(){
            return '📖返回首页'
          },
          message_mulu:function(){
            return '📑返回目录'
          },
            message_count: function() {
                return this.id + '/' + this.allpageLength;
            },
            message_switch: function() {
                return this.dark ?  '🌕日间模式':'🌑黑夜模式';
            }
        },
        methods: {
          switch_full:function(){
            this.full=!this.full
            if(this.full){
              document.exitFullscreen()
            }
            else{
                document.documentElement.requestFullscreen()
            }
          },
          switch_sy:function(){
            window.location.href='https://manhuafree.com/'
          },
          switch_mulu:function(){
            window.location.href="https://manhuafree.com"+document.querySelector("#backManga").getAttribute('href')
          },
            switch_night: function() {
                this.dark = !this.dark;
                localStorage.setItem('dark', this.dark);
              if(this.dark){
 GM_addStyle('.bg-default-100 { background-color: #272727 !important; }');
;
              }
              else{
GM_addStyle('.bg-default-100 { background-color:#edecea!important; }')

              }

            }
        },
    //   watch:{
    //   allpageLength(newVal,oldVal){
    //     console.log(newVal)
    //   }
    // }
    });
 window.addEventListener('scroll',function(){
  let imgs= document.querySelectorAll('#chapcontent > .w-full.h-full');
imgs.forEach((img,index)=>{
let rect=img.getBoundingClientRect()
let windowHeight=window.innerHeight || document.documentElement.clientHeight
if(rect.top>0&&rect.top<windowHeight){
  infoApp.id = index + 1;

}
})
 })
 //目录
  let muludata=[]
  async function mulu(){
      let muluUrl=`https://api-get-v2.mgsearcher.com/api/manga/get?mid=${datams}&mode=all`
    await fetch(muluUrl).then(re=>re.json()).then(data=>{

let slugs=data.data.slug

  let da=data.data.chapters
  muludata=da.map(chapter=>({
    id: chapter.id,
    title:chapter.attributes.title,
    href:'https://manhuafree.com/manga/'+slugs+'/'+chapter.attributes.slug
 }))

 })
console.log(muludata)
   let sidebar =document.createElement('div')
    sidebar.innerHTML=   `
    <div id="sidebarapp" @mouseenter="open" @mouseleave="close" >
         <ul>
            <li v-for="item in chapters" :key="item.id" @click='switch_chapter(item.href)'>{{ item.title }}</li>
        </ul>

    </div>`;
    document.body.appendChild(sidebar)
    let sidebarStyle=`

#sidebarapp {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
   background-color:rgba(27,27,27,0.8);
  display: flex;
  flex-direction: column; /* 确保子元素垂直排列 */
}

ul {
  overflow-y: auto; /* 启用垂直滚动 */
  padding: 0;
  margin: 0;
  list-style: none;
}

li {

  height:50px;
  color:white;
  padding: 10px;

  cursor: pointer;
  text-align: center; /* 字体居中 */
}

li:hover {
  background-color: rgb(255, 191, 11,0.8);
}

    `
document.querySelector('#sidebarapp').style.opacity='0'
let chapterIndex
GM_addStyle(sidebarStyle)
    let sidebarapp=new Vue({
      el:"#sidebarapp",
      data:{

        chapters:muludata},
      methods:{
        open:function(){
          if(!chapterIndex){
            console.log('你做的很好')
            chapterIndex = muludata.findIndex(chapter => chapter.id == datasc);}

    console.log(chapterIndex)
   document.querySelectorAll('#sidebarapp li')[chapterIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelectorAll('#sidebarapp li')[chapterIndex].style.backgroundColor='rgb(255, 191, 11,0.8)'
         document.querySelector('#sidebarapp').style.opacity='1'

        },
        close:function(){
       document.querySelector('#sidebarapp').style.opacity='0'
        },
        switch_chapter:function(url){
          window.location.href=url
        }
      }
    })
    console.log(datasc)


  }

mulu()
}
