// ==UserScript==
// @name         获取知乎用户文章、回答等数据
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  获取知乎某用户下的文章数据
// @author       Jazzu Lu
//-----------------------------------------------------------
// @require      https://code.jquery.com/jquery-1.9.1.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
//-----------------------------------------------------------
// @require
// @resource css
//-----------------------------------------------------------
// @include      *.zhihu.com/people/*
//-----------------------------------------------------------
// @run-at       document-idle
// @original-author Jazzu Lu
// @original-license GPL License
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/432443/%E8%8E%B7%E5%8F%96%E7%9F%A5%E4%B9%8E%E7%94%A8%E6%88%B7%E6%96%87%E7%AB%A0%E3%80%81%E5%9B%9E%E7%AD%94%E7%AD%89%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/432443/%E8%8E%B7%E5%8F%96%E7%9F%A5%E4%B9%8E%E7%94%A8%E6%88%B7%E6%96%87%E7%AB%A0%E3%80%81%E5%9B%9E%E7%AD%94%E7%AD%89%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

/**
 * 有关导出 xslx 详见  https://github.com/sheetjs/sheetjs
 * **/

/** 工具函数 **/
Date.prototype.format = function (fmt="YYYY-mm-dd HH:MM") {
  let date = this;
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    }
  }
  return fmt;
}
window.$ = $;
window.sleep = (time)=>new Promise(resolve=>{ setTimeout(()=>{ resolve(); },time) })
function toCSV(header,jsonData,fileName){
  //列标题，逗号隔开，每一个逗号就是隔开一个单元格, 类似 `姓名,电话,邮箱`
  let str = header+='\n';
  //增加\t为了不让表格显示科学计数法或者其他格式
  for(let i = 0 ; i < jsonData.length ; i++ ){
    for(let item in jsonData[i]){
      str+=`${jsonData[i][item]},`;
    }
    str+='\n';
  }
  //encodeURIComponent解决中文乱码
  let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
  //通过创建a标签实现
  let link = document.createElement("a");
  link.href = uri;
  //对下载的文件命名
  link.download = `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function toXSL(JSONData, FileName, worksheet) {
  worksheet = worksheet || FileName;
  let th = `<thead>${JSONData.headers.map(h=>`<th>${h.text}</th>`).join('')}</thead>`;
  let tbody = JSONData.data.map(d=> `<tr>${JSONData.headers.map(h=>`<td>${h.type=='link' ? `<a href="${d[h.value]}">${d[h.value]}</a>` : d[h.value]}</td>`).join('')}</tr>`).join('');
  tbody = `<tbody>${tbody}</tbody>`
  let excel = `<table>${th}${tbody}</table>`;
  let excelFile = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>${excel}</body></html>`;
  let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
  let link = document.createElement("a");
  link.href = uri;
  link.style = "visibility:hidden";
  link.download = FileName + ".xls";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
/** 显示右上方的提示信息， 类型有 normal success warning error **/
async function showToast({type = "normal", title = "", content = "", timing = 8*1000}){
  if(!$('.jl_toast_list').length){ $("body").append("<div class='jl_toast_list'></div>") }
  let toastIdx = `jl-${new Date().getTime()}`;
  let curToast = `<div class="jl_toast ${type} ${toastIdx}"><div class="jl_title">${title}</div><div class="jl_content">${content}</div></div>`;
  $('.jl_toast_list').append(curToast);
  $(`.${toastIdx}`).addClass('show');
  setTimeout(async ()=>{
    $(`.${toastIdx}`).removeClass("show");
    await window.sleep(800);
    $(`.${toastIdx}`).remove();
  },timing)
}
function jlLoading(show=true){
  let html = `<div class="jl_loading">
                <div class="wrapper"> 
                  <div class="circle"></div> <div class="circle"></div> <div class="circle"></div>
                  <div class="shadow"></div> <div class="shadow"></div> <div class="shadow"></div>
                </div>
                <style>
                 .jl_loading{width: 100vw;height: 100vh;position: fixed;top: 0;background: #070f1be3;z-index:10000;display: flex;align-items: center;justify-items: center;}
                 .jl_loading .wrapper{ width:200px; height:60px; position: absolute; left:50%; top:50%; transform: translate(-50%, -50%); }
                 .jl_loading .circle{ width:20px; height:20px; position: absolute; border-radius: 50%; background-color: #fff; left:15%; transform-origin: 50%; animation: jl_circle .5s alternate infinite ease; }
                 .jl_loading .circle:nth-child(2){ left:45%; animation-delay: .2s; }
                 .jl_loading .circle:nth-child(3){ left:auto; right:15%; animation-delay: .3s; }
                 @keyframes jl_circle{
                  0% { top:60px; height:5px; border-radius: 50px 50px 25px 25px; transform: scaleX(1.7); }
                  40%{ height:20px; border-radius: 50%; transform: scaleX(1); }
                  100%{ top:0%; }
                 }
                .jl_loading .shadow{ width:20px; height:4px; border-radius: 50%; background-color: rgba(0,0,0,.5); position: absolute; top:62px; transform-origin: 50%; z-index: -1; left:15%; filter: blur(1px); animation: jl_shadow .5s alternate infinite ease; }
                .jl_loading .shadow:nth-child(4){ left: 45%;animation-delay: .2s }
                .jl_loading .shadow:nth-child(5){ left:auto; right:15%; animation-delay: .3s; }
                @keyframes jl_shadow{
                  0%{ transform: scaleX(1.5); }
                  40%{ transform: scaleX(1); opacity: .7; }
                  100%{ transform: scaleX(.2); opacity: .4; }
                }
               </style>
              </div>`;
  if(show){
    !$('.jl_loading').length ? $('body').append(html) : '';
  }else {
    $('.jl_loading').remove();
  }
}

/** ----------------- 入口 ------------------- **/
(function() {
  createCss();    /** 创建 css **/
  let floatWidget = (`<div id='jl_float_container'><div class="jl_export_single">导出本页</div><div class="jl_export_all">导出全部</div></div>`);   /** 左侧小组件 **/
  $("body").append(floatWidget);
  renderBtn();
})();
/** 全局变量 **/
const HEADER_STRING = ["title","link","des","voteUp","commentCount","dateModified","dateCreate"]
const HEADER_OBJ = {title:'标题',link:'链接',des:'描述',voteUp:'赞同',commentCount:'评论',dateCreate:'创建时间',dateModified:'更新时间'}

/** ----------------- 事件 ------------------- **/
async function fetchSingle({scrollTiming = 2000, awaitTiming = 2000}){
  let rows = [];
  $('html, body').animate({ scrollTop: $(document).height() }, scrollTiming);
  await window.sleep(awaitTiming);
  $('.ListShortcut .List-item').each((idx,item)=>{
    /** 处理时间 **/
    let dateCreate = $(item).find('meta[itemprop=dateCreated]').attr('content') || $(item).find('meta[itemprop=datePublished]').attr('content');
    dateCreate = dateCreate ? new Date(dateCreate).format() : '';
    let dateModified = $(item).find('meta[itemprop=dateModified]').attr('content');
    dateModified = dateModified ? new Date(dateModified).format() : '';
    rows.push({
      title: $(item).find('.ContentItem-title a').text(),
      link: 'https:' + $(item).find('.ContentItem-title a').attr('href'),
      des: $(item).find('.RichContent-inner .RichText').text(),
      voteUp: $(item).find('.ContentItem-actions .VoteButton--up').text()?.split(' ')[1] || 0,
      commentCount: $(item).find('meta[itemprop=commentCount]').attr('content'),
      dateCreate, dateModified,
    })
  })
  return rows;
}
async function writeData(timing){
  let JL_DATA = await fetchSingle(timing);
  let oldData = localStorage.getItem('JL_DATA') || '[]';
  oldData = JSON.parse(oldData);
  oldData.push(...JL_DATA);
  localStorage.setItem('JL_DATA',JSON.stringify(oldData));
}
function exportFile(data){
  let sheetName = $('.ProfileMain-header .Tabs-link.is-active').eq(0).text();
  let fileName = $('.ProfileHeader-name').text() + sheetName;
  data.unshift(HEADER_OBJ)
  let ws = XLSX.utils.json_to_sheet(data, {header:HEADER_STRING,skipHeader:true});
  for (const wsKey in ws) {
    if(ws[wsKey]?.v && ws[wsKey]?.v?.indexOf('http')!=-1){
      ws[wsKey].l = {Target:ws[wsKey].v,Tooltip:ws[wsKey].v}
    }
  }
  ws['!cols'] = [ {wpx: 200}, {wpx: 280}, {wpx: 200}, {wpx: 60}, {wpx: 60}, {wpx: 120}, {wpx: 120}, ];
  let wb = { Sheets: {[sheetName]:ws}, SheetNames:[sheetName] }
  console.log('wb=========',data)
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}
async function exportSingle(){
  jlLoading(true);
  let PL_ROWS = await fetchSingle({});
  exportFile(PL_ROWS);

  jlLoading(false);
  showToast({type:"success",content:'导出成功 0.0'})
}
async function exportAll(){
  localStorage.setItem('JL_DATA',[]);   /** 清空数据 **/
  jlLoading(true);
  let allPage = $('.ListShortcut .Pagination .PaginationButton-next').prev().text() || 1;
  allPage = Number(allPage);
  for (let i = 0; i < allPage; i++) {
    await window.sleep(1000);
    $('html, body').animate({ scrollTop: 0 }, 1000);    /** 滑动到上面 **/
    await writeData({awaitTiming:3500});                                        /** 滑动到底部记录数据 **/
    let $nextPage = $('.ListShortcut .Pagination .PaginationButton-next');
    if($nextPage.length){
      $nextPage.trigger('click')
    }else break;
  }
  jlLoading(false);

  /** 导出数据 **/
  let JL_DATA = localStorage.getItem('JL_DATA') || '[]';
  JL_DATA = JSON.parse(JL_DATA);
  exportFile(JL_DATA);
  showToast({type:"success",content:'导出成功 0.0'})
}

/** ----------------- 渲染 DOM ------------------- **/
/** 渲染 Button **/
function renderBtn(){
  $("#jl_float_container .jl_export_single").on("click",exportSingle);
  $("#jl_float_container .jl_export_all").on("click",exportAll);
}

/** ----------------- 渲染 Style ------------------- **/
function createCss(){
  let css = (`
    <style>
      /* toast 样式 */
      .jl_toast{position: fixed;right: -245px;top: 2vh;border-radius:5px;box-shadow: 0 1px 3px rgba(18,18,18,.1);padding: 15px 20px;width: 200px;z-index: 10000;transition: .8s ease all;color:#fff;}
      .jl_toast.show{right: 5px;}
      .jl_toast.normal{background: #009fdc;}  .jl_toast.success{background: #25d028;}
      .jl_toast.warning{background: #fd5b1f;} .jl_toast.error{background: #fe3737;}
      .jl_toast .jl_title{font-size: 16px;} .jl_toast .jl_content{font-size: 14px;}
      /* toast 样式 */
      #jl_snapshot{position: fixed;right: 0;top: 5vh;border: 2px #333 solid;padding: 0;display: none;}
      #jl_float_container{position: fixed;left: -0px;top: 20vh;z-index: 10000;padding: 10px;border: 1px #ddd solid;border-radius:5px;transition: .8s all ease;background: #fff;}
      #jl_float_container:hover{left: 0;}
      #jl_float_container .ma{margin: 10px;}
      #jl_float_container .ml{margin-left: 10px;} #jl_float_container .mr{margin-right: 10px;}
      #jl_float_container .mt{margin-top: 10px;}  #jl_float_container .mb{margin-bottom: 10px;}
      /* 按钮样式 */
      #jl_float_container div{ margin: 5px;border: 1px solid #8b8b8d;padding: 5px 10px;color:#0f1d34;border-radius: 4px;cursor: pointer; }
    </style>
  `)
  $("body").append(css);
}