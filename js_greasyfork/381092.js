// ==UserScript==
// @name 让我做你的眼
// @namespace Violentmonkey Scripts
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js
// @include      http* 
// @grant GM_xmlhttpRequest
// @grant        GM_addStyle
// @description let me make your eye
//  @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/381092/%E8%AE%A9%E6%88%91%E5%81%9A%E4%BD%A0%E7%9A%84%E7%9C%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/381092/%E8%AE%A9%E6%88%91%E5%81%9A%E4%BD%A0%E7%9A%84%E7%9C%BC.meta.js
// ==/UserScript==
window.onload=function(){
  
  GM_addStyle([
  '.mostcover{position:fixed;top:18%;left:50%;transform: translateX(-50%);width:70%;background:#222;user-select: none;z-index:9999;display:none;border-radius:10px;opacity:.75;color:#fff;}',
  '#mywrapper1{width:100%;font-weight: bold;font-size:9px}',
  '#mywrapper1 tr:nth-child(1){margin-top:0px;}',
  '#mywrapper1 tr{width:100%;height:20px;line-height:20px;text-align: center;margin-top:25px;}',
  '#mywrapper1 tr td{text-align: center!important;}',
  '.fix{display:inline-block}',
  '#mywrapper1 tr .left{width:79%;text-align: center!important;}',
  '#mywrapper1 tr .right{width:20%;text-align: center!important;}',
  '#mywrapper1 tr td div{display: inline-block;margin-left:15px;width:20%;height:15%;border:1px solid #ccc;cursor: pointer;}',
  '#mywrapper1 tr td div:hover{background: #e2e2e2;}',
  '@media screen and (max-width: 800px) {#mostcover {width:96%;}#mywrapper1 tr .left{width:48%;} #ni{display:block;height:267px;overflow-y:scroll;} #mywrapper1 tr .right{width:50%}} #mywrapper1 tr td input{margin:10px 15px 5px;}',
  'tbody::-webkit-scrollbar {/*滚动条整体样式*/ width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/height: 10px;}tbody::-webkit-scrollbar-thumb {/*滚动条里面小方块*/ border-radius: 10px; -webkit-box-shadow: inset 0 0 5px rgba(255,255,255,0.2); background: #fff;}tbody::-webkit-scrollbar-track {/*滚动条里面轨道*/-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);border-radius: 10px;background: #000;}',
  '#ni{display:block;height:400px;overflow-y:scroll;}',
  '#mywrapper1 tr td input{text-align: center!important;font-weight: bold;width:100%;margin:15px;outline: none;height:100%;outline: none;-webkit-appearance: none;border-radius: 7px;color:#000;}',
  '#close_btn{position:absolute;top:0;right:0;font-size: 10px;font-weigaht: bloder;margin-right:15px;margin-top:10px;cursor: pointer;}',
  '#slide_btn{width:10px;height:10px;background:#e73;position:fixed;left:0;top:30%;cursor:pointer;z-index:999999;}'
].join(''))

let reg=/magnet:\?xt=urn:(btih:)?[\u4e00-\u9fa5a-z0-9&=%+.;-]{20,}/ig
let find_result=Array.from(new Set($('body').html().match(reg)));

//console.log(find_result.length)
slide_btn='<div id="slide_btn"></div>'
str='<div class="mostcover" id="mostcover" ><div id="close_btn">X</div><table id="mywrapper1"><thead ><tr class="title" ><td class="left fix">磁力</td><td class="right fix">操作</td></tr></thead><tbody id="ni" class="fix"></tbody></table></div>'
$('body').append(str)
  if(find_result.length){
    $('body').append(slide_btn)

  }
  else{
    return;
  }
$('#close_btn').click(()=>{
  $('#mostcover').css("display","none")
})

$('#slide_btn').click(()=>{
  $('#mostcover').fadeToggle("normal","linear")
})
let str1=``;
for(let i =0;i<find_result.length;i++){
  str1 +=`<tr class="fix"><td class="left fix"><input id="${'input'+i}" type="text" value="${find_result[i]}"></td><td class="right fix"><div id="${'func1'+i}">复制</div><div id="${'func2'+i}">下载</div></td></tr><hr>`
}
console.log(str1)
//console.log(find_result[0],str1)
$('#ni').append(str1)

for(let i =0;i<find_result.length;i++){
  let func1="#func1"+i
  let func2="#func2"+i
  let input = "#input"+i
  $(func1).click(()=>{
    $(input).select();
    document.execCommand("Copy"); // 执行浏览器复制命令
    console.log($(input).val())
  })
  $(func2).click(()=>{
    GM_xmlhttpRequest({
  
  method:"POST",
  url:"http://192.169.6.168:8000/api/magnet",
  data:$(input).val(),
  headers:{
    "Content-Type":"application/json;charset=UTF-8",
    "Cookie":"cookieauth=MTYzODQkOCQxJDFmODU4OTFmMmI5Y2Y0N2ZjMTBlOGU0MDU5MmIxMGUwJGM5NjYwOTE3YmYyNWQ1M2YwMTg5ODBiZWVhOWUxYjdkYzNiZTlkM2ZlMGMzMjM1ODgzNjJlMjkwYmQ5NTgxN2Y=|1551670819",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
  },
  onload:function(response){
   console.log('添加成功')
}
  
})
  })
}

/*
GM_xmlhttpRequest({
  
  method:"POST",
  url:"http://192.169.6.168:8000/api/magnet",
  data:"magnet:?xt=urn:btih:FE889A55BDCFE6603C62B691F476468D366BDBDD",
  headers:{
    "Content-Type":"application/json;charset=UTF-8",
    "Cookie":"cookieauth=MTYzODQkOCQxJDFmODU4OTFmMmI5Y2Y0N2ZjMTBlOGU0MDU5MmIxMGUwJGM5NjYwOTE3YmYyNWQ1M2YwMTg5ODBiZWVhOWUxYjdkYzNiZTlkM2ZlMGMzMjM1ODgzNjJlMjkwYmQ5NTgxN2Y=|1551670819",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
  },
  onload:function(response){
   console.log(response)
}
  
})


*/
  
  
  
}
