// ==UserScript==
// @name        js_translate
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     0.1.0
// @author      liudonghua123
// @license     MIT
// @description 6/8/2023, 2:23:49 PM
// @downloadURL https://update.greasyfork.org/scripts/468179/js_translate.user.js
// @updateURL https://update.greasyfork.org/scripts/468179/js_translate.meta.js
// ==/UserScript==

// https://www.oschina.net/news/244182/leiming-2-3-released

/*
<script src="https://res.zvo.cn/translate/translate.js"></script>
<script>
translate.setUseVersion2(); //设置使用v2.x 版本
translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认就是 'chinese_simplified' 简体中文。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明。
translate.execute();//进行翻译
</script>
*/

// https://stackoverflow.com/questions/5132488/how-can-i-insert-a-script-into-html-head-dynamically-using-javascript

const dynamicAddScript = (url) => {
    return new Promise(function(resolve, reject){
      const script = document.createElement('script');
      script.onload = resolve;
      script.onerror = reject;
      script.src = url;
      document.head.appendChild(script);
    });
}

function sleep(time){
   return new Promise(function(resolve){
     setTimeout(resolve, time);
   });
}


(async function process() {
  console.info(`loading translate.js ...`)
  await dynamicAddScript('https://res.zvo.cn/translate/translate.js');
  console.info(`loaded translate.js`)
  // TODO: detect the language of current page, only apply translating to non-chinese_simplified webpage
  translate.setUseVersion2(); //设置使用v2.x 版本
  translate.language.setLocal('chinese_simplified'); //设置本地语种（当前网页的语种）。如果不设置，默认就是 'chinese_simplified' 简体中文。 可填写如 'english'、'chinese_simplified' 等，具体参见文档下方关于此的说明。
  translate.execute();//进行翻译
})();
