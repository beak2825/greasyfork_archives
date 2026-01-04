// ==UserScript==
// @name            vue3 异步组件例子
// @namespace       moe.canfire.flf
 
// @description     vueloader use  js
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
// @version 0.0.1.20220314074202
// ==/UserScript==

async function myimport(jsurl,enableCache){
       if(!enableCache) jsurl=jsurl +'?rnd='+Math.random();
        let data = await fetch(jsurl).then(res=>res.text() );
       try{
		 data=data.substr(data.indexOf('{')+0).trim();//
		var json=(new Function("return " + data  ))();
		//自动插入css
		  if( json.css!=undefined ){
                  var style = document.createElement('style');
                  var  head = document.head || document.getElementsByTagName('head')[0]; 
	              style.innerHTML=style.innerHTML+json.css;
                  head.appendChild(style);
		  }///
 		return json;
      }catch (error) { 
           console.log(  jsurl  );
           console.log(    error.name+ error.message );
       }
};//---------------------------

  const app = Vue.createApp({
data:function(){return {
 
 }},//data-----
  methods: {
   
  },//methods-----
  components: {
      test:Vue.defineAsyncComponent(() => myimport("./test.js",false) )
  }
});
   app.use(vant);
   app.use(vant.Lazyload);
  const vm=app.mount('#app');
//////////////////////////////////////
// test.js  //export
 const test = {
    template: `
        这是 <span class=mycss>组件测试</span>
        参数：{{str1}}<br>
    `,
    model: {
      prop: ['str']
    },
    props: {
      str: String
    },
	css:` .mycss{ border:5px solid red;} `
	,
    setup(props) {
      // 在setup里面获取参数值
      const str1 = Vue.ref(props.str)
       return {
        str1
      }
    },
  };

 