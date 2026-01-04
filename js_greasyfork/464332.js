// ==UserScript==
// @name        Pixiv re 打包下载
// @namespace   Violentmonkey Scripts
// @match       *://pixiv.re/*
// @match       *://pixiv.cat/*
// @match       *://pixiv.nl/*
// @grant       none
// @version     1.05
// @run-at      document-start
// @author      -
// @description 自动化下载 pixiv 代理网站的多页作品
// @downloadURL https://update.greasyfork.org/scripts/464332/Pixiv%20re%20%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/464332/Pixiv%20re%20%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(async function(){
console.log("正在加载下载模块");
const {ajax}=await import("https://bspr0002.github.io/javascript/module/ajax.mjs"),
      JSZip=(await import("https://bspr0002.github.io/javascript/module_3rd_party/JSZip.mjs")).default,
      {parseAndGetNodes: arrayHTML}=await import("https://bspr0002.github.io/javascript/module/array_HTML.mjs");
function save(file, saveName) {
  const objectURL = URL.createObjectURL(file), address = document.createElement("a");
  address.href = objectURL;
  address.download = typeof saveName == "string" ? saveName : "";
  address.dispatchEvent(new MouseEvent("click"));
  URL.revokeObjectURL(objectURL);
}
function pa(url){
  return new Promise(function(resolve,reject){
    ajax({url,responseType:'blob',
          success(response){resolve([false,response,this.getResponseHeader("content-type").split("/")[1]])},
          fail(status){if (status==404) {resolve([true])} else reject()},
          error:reject
    })
  });
}
async function download(){
  const id=location.pathname.match(/\d+/)[0],package=new JSZip;
  var i=1;
  while (true) {
    container.innerText=`正在尝试下载第${i}张图片`;
    let result;
    try {result=await pa(`/${id}-${i}.png`)} catch(e) {
      if (confirm(`第${i}张图片下载失败，\n${e.message}\n\n是否重试？不重试将会结束任务`)) {continue} else break
    }
    if (result[0]) break;
    package.file(`${i}.${result[2]}`,result[1]);
    ++i;
  }
  const count=`共下载${i-1}张图片，`;
  container.innerText=count+"下载结束";
  await new Promise(resolve=>requestIdleCallback(resolve,{timeout:100}));
  const name=prompt("请输入打包文件名",id);
  container.innerText=count+"正在打包";
  save(await package.generateAsync({type:'blob'}),(name?name:id)+".zip");
  container.innerText=count+"打包完成，请等待保存";
}
const {documentFragment,nodes:{button,container}}=arrayHTML([
  ["DIV",[
    ["BUTTON","下载整篇",{style:{
      backgroundColor:"#0080FF",
      color:"white",
      padding:"4px",
      borderRadius:"4px",
      border:"none"
    }},"button"]
  ],{style:{
    backgroundColor:"white",
    position:"absolute",
    top:0,
    left:0,
    border:"black 2px solid",
    padding:"4px",
    margin:"4px",
    borderRadius:"8px"
  }},"container"]
]);
button.addEventListener("click", download, {once:true});
document.body.appendChild(documentFragment);
console.log("下载模块加载完成");
})().catch(()=>console.log("下载模块加载失败"));