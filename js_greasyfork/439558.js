// ==UserScript==
// 远程调用代码 ：  https://update.greasyfork.org/scripts/439558/jk_loadvuejs.user.js
//  <script src="https://update.greasyfork.org/scripts/439558/jk_loadvuejs.user.js"></script>
//  <script src="https://update.greasyfork.org/scripts/439558/jk_loadvuejs.user.js<?php echo "?v=".rand(1,10000);?>"></script>
////组件是小块的，路由本质是一个自定义组件，但主要是一个完整的界面显示，多个组件组合成的（其中组件需要另外载入），路由组件，就不用再单独组件注册，省得再加载一次；
// @name           jk_loadvue.js
// @namespace       moe.canfire.flf

// @description     descjkvue3loader
// @author          mengzonefire
// @license         MIT
// @match           *
 

// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           GM_info
// @grant           GM_getResourceText
// @grant           GM_addStyle
// @grant           unsafeWindow
// @run-at          document-start
// @connect         *
// @version 0.0.1.20240911093724
// @downloadURL https://update.greasyfork.org/scripts/439558/jk_loadvuejs.user.js
// @updateURL https://update.greasyfork.org/scripts/439558/jk_loadvuejs.meta.js
// ==/UserScript==
/*
vu3_sfc_loader,文件太大1.7M,自己做了个简单点的，可能功能不全
//支持scoped,支持setup语法糖
  <script src="https://unpkg.com/vue@3.4.37/dist/vue.global.prod.js"></script>
  <script src="jk_loadvue.js"></script>
<script>
   const app = Vue.createApp({});
   //myComponent/myComponent.vue
   app.component('my-test', async_vue_component_fromfile("http://.../myComponent/myComponent.vue",{cached:false})  ) 
   app.component('my-test', async_vue_component_fromdir("./myComponent",{cached:false})  )
   app.mount('#app');
</script>

补充说明：
整个vue文件，最提供终其实是一个json;基本如下:

{
    template:'xxxxxx',
    setup(){ //注意这里不是什么 script,直接就是函数；
       return {返回 导出列表}   
    }
}
或
{
  template:'xxxxxx',
  data() { return { // 定义数据 }},
  methods: { // 定义方法 },
    
}
//style最终插入dom
//scoped需要处理，主要是css的局部化，生成改造后的style和template
//setup需要处理，生成改造后的setup(){}

*/


class GridString{
/*
a,b,c
e,f,g,h
x,a,bc
*/
 constructor() {
    this.str_rows=[];
  }//
  init(){ this.str_rows=[];  }
  addrow( str_withDivider){ //addrow("a,b,c,d")
     this.str_rows.push(str_withDivider);
  }
  arr_remove_duplicate(arr){//去重
    const uniquearr=arr.filter((value, index, self) => {
        return self.indexOf(value) === index;
    }); 
    return uniquearr;
  }
  grid_to_unique_cellarr( row_divider ){
     var gcellarr=[];
     for(let rowstr of this.str_rows){
         let arr=rowstr.split( row_divider )
         for(let v of arr) gcellarr.push(v.trim() )
     }

    return this.arr_remove_duplicate(gcellarr);
  }
}//class


var vuefile_content=`
<template>
    <div>
        <p>PHP计数器实例: {{ count }}</p>
        <input @click="myFn" type="button" value="点我加 1">
    </div>
</template>
<script setup >
import {ref, onMounted} from 'vue';
import {reactive} from 'vue';
        const count=ref(45);
        const msg="message";
        function myFn(){
            count.value+= 1;
        }
</script>
<style scoped>
 p,.cls abc{border:3px solid blue;}   
 div{border:3px solid red;}   
</style>
`
vuefile_content=`
<template>
    <div>
        <p>PHP计数器test实例: {{ count }}</p>
        <input @click="myFn" type="button" value="点我加 1">
    </div>
</template>
<script>
import {ref, onMounted} from 'vue';
import {reactive} from 'vue';
 export default{
  data() {
    return { count:ref(0) }
  },
  methods: {  
     myFn(){
         this.count=this.count+1;
            //this.count.value=this.count.value+ 1;
    }
  }
 }
</script>
<style scoped>
 p,.cls abc{border:3px solid blue;}   
 div{border:3px solid red;}   
</style>
`
//配置
const cached_vue=false;
//===============================================================
function async_vue_component_fromfile(url_vuefile){//"http://.../myComponent.vue"
   if(cached_vue==true)return Vue.defineAsyncComponent(() =>__download_parse_vue_sfc_file( url_vuefile )    )
   else return Vue.defineAsyncComponent(() =>__download_parse_vue_sfc_file( url_vuefile+"?tick="+Math.random())    )
}//
function async_vue_component_fromdir(url_vuedir){//"http://.../myComponent"==>/myComponent/myComponent.vue
    url_vuedir=url_vuedir.replace('-','')
    let arr=url_vuedir.split(/[\\\/]/)
    let componentname=arr[arr.length-1];
    if(componentname=='')componentname=arr[arr.length-2];
     let url_vuefile=url_vuedir+'/'+componentname+'.vue';
     //console.log( url_vuefile);
   if(cached_vue==true)return Vue.defineAsyncComponent(() =>__download_parse_vue_sfc_file( url_vuefile )    )
   else return Vue.defineAsyncComponent(() =>__download_parse_vue_sfc_file( url_vuefile+"?tick="+Math.random())    )
}//
async function __download_parse_vue_sfc_file(url_vuefile){
    return new Promise((resolve, reject) => {  
       fetch(url_vuefile)
      .then(response => response.text())
      .then(vuefile_content=> {
          //console.log(vuefile_content)
          let json=__parse_sfcdata_v2(vuefile_content)
          resolve(json);
      })//then
     })//Promise
   }//function; 
//=============================================================== 
function __parse_sfcdata_v2(vuefile_content){
//=============================================================== 
//清除注释
 let re =/\/\*.*?\*\/|\/\/.*?(?:\r?\n|$)/sg;
 let  matchx;
 vuefile_content=vuefile_content.replace(re,'');
 //console.log( vuefile_content );
 
var data={};
  re =/<template([\s\S]*?)>([\s\S]*?)<\/template>/;
  matchx= re.exec(vuefile_content);
data.template_param=matchx[1];
data.template=matchx[2];

  re =/<style([\s\S]*?)>([\s\S]*?)<\/style>/;
  matchx= re.exec(vuefile_content);
data.style_param=matchx[1];
data.style=matchx[2];  
//console.log( matchx );

  re =/<script([\s\S]*?)>([\s\S]*?)<\/script>/;
  matchx= re.exec(vuefile_content);
data.script_param=matchx[1];
data.script=matchx[2];

//处理style scoped,生成新的template与style=================================
if(data.style_param.indexOf('scoped')!=-1){
       let scopedSign1="";
       let scopedSign2="";
       scopedSign1='data-v-'+randomString(5);
       scopedSign2='['+scopedSign1+']';
       //template的标签加上唯一属性，所有style也加上属性
       //<div data-xxxx>   div[data-xxxx]{red;}
       //首先，查到每一标签；加上属性；
       data.template=data.template.replace(/<([a-zA-Z].*?)>/g, (match, p1,p2) => {
              return "<"+p1+" " + scopedSign1 +">";
       });
       //console.log(data.template)
       //首先，查到每一行；再查到每一个单词；
       data.style=data.style.replace(/[\s\n](.*?)\{/g, (match, p1,p2) => {
               return match.replace(/[a-zA-Z_]{1,}/g,(fs)=>{return fs+scopedSign2});
       });
}//if scoped========================================

 //style 加入到 document
  const style = document.createElement('style');
  style.textContent = data.style
  const ref = document.head.getElementsByTagName('style')[0] || null;
  document.head.insertBefore(style, ref);

  dowith_script_part(data);
//  console.log( data.script_inexport );
  let json=new Function('return ' + data.script_inexport )();    //一个json对象
  json.template=data.template;
     
  //console.log(json)
  return json;
//===============================================================    
}//function;

 
//=============================================================
function dowith_script_part(data){
//处理script//import部分
   //提取import{}from中的数据,将ref，onMounted之类，替换为Vue.ref,Vue.onMounted
   //删除import行；得到了data.script_noimport
    let gridstr=new GridString();
    data.script_noimport=data.script.replace(/[\s\n]{1,}import[\s]{1,}\{(.*?)\}[\s]{1,}from.*/g, (match, p1,p2) => {
                   let import_script=p1; 
                   gridstr.addrow(import_script);
               return '';
    });
 
   let quotelist=[];
      let uniquequotelist=  gridstr.grid_to_unique_cellarr(/[,]/)
    //将script中的ref.替换为Vue.ref
      for(let v of uniquequotelist){
        data.script_noimport=data.script_noimport.replaceAll(v,"Vue."+v); 
      }
///得到了data.script_noimport
//如果有setup语法糖
if(data.script_param.indexOf('setup')!=-1){
   data.script_inexport=dowith_setup_soup(data.script_noimport);
}else{//
  regex=/export[\s]{1,}default[\s]{0,}([\s\S]{0,})$/; //\}[\s;]{0,}
  match=regex.exec(data.script_noimport);
  data.script_inexport=match[1]; 
}
}//============================================================= 


 

function randomString(e) {  
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
  a = t.length,
  n = "";
  for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
}////

function dowith_setup_soup( setup_script){
    let tmpscript=setup_script;
  //去除所有的{}，只留下顶层变量与函数
    let re=/\{([\s\S](?!\{)){0,}?\}/;
    while (re.test(tmpscript)) {
       tmpscript=tmpscript.replace(re, '' );
    }
    //提取顶层变量
    let varlist=[];
    let match;
    re=/(?:let|var|const)(.*?)[=;]/g;
    while ((match = re.exec(tmpscript)) !== null) {
            varlist.push( match[1] )
    }
     re=/function(.*?)\(/g;
    while ((match = re.exec(tmpscript)) !== null) {
            varlist.push( match[1] )
    }
     setup_script="{\r\n setup(){\r\n"+setup_script+"\r\n return {"+varlist.join(',')+"     }\r\n}\r\n}";
    return setup_script;
    
}//=================
