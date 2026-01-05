// ==UserScript==
// @name        Pixiv Download Assistant
// @name:ja     Pixiv Download Assistant
// @description Provides some functions to download from pixiv
// @description:ja pixiv に作品の保存を容易にするための機能を追加します
// @namespace   https://greasyfork.org/ja/users/24052-granony
// @author      granony
// @version     0.2.0
// @grant       GM_xmlhttpRequest
// @include     http://www.pixiv.net/member_illust.php?*
// @include     http://www.pixiv.net/novel/show.php?*
// @connect     pixiv.net
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.0.0/jszip.min.js
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/20866/Pixiv%20Download%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/20866/Pixiv%20Download%20Assistant.meta.js
// ==/UserScript==

(function(){
"use strict;";
/*************************************************************************
 * 設定
 *************************************************************************/
 // 現在はなし

/*************************************************************************
 * 共通の処理
 *************************************************************************/
var pixiv = unsafeWindow.pixiv;
if(typeof(pixiv)=="undefined"){
  return;
}

console.log("pda: start");

var directLinkIcon = getDirectLinkIcon();
var isCreatingZip = false;
var metaInfo = getMetaInfo();
console.log(metaInfo);

// ページの種類によって作業を分岐
if(metaInfo.workType=="illust-single"){
  processSingleIllust();
}else if(metaInfo.workType=="manga-single"){
  processSingleManga();
}else if(metaInfo.workType=="illust-multi"){
  if(metaInfo.pageMode=="cover"){
    if(metaInfo.multiIllustDirection=="horizontal"){
      processMultiMangaCover();
    }else if(metaInfo.multiIllustDirection=="vertical"){
      processMultiIllustCover();
    }
  }else if(metaInfo.pageMode=="index"){
    if(metaInfo.multiIllustDirection=="horizontal"){
      processMultiMangaIndex();
    }else if(metaInfo.multiIllustDirection=="vertical"){
      processMultiIllustIndex();
    }
  }
}else if(metaInfo.workType=="ugoira"){
  processUgoira();
}else if(metaInfo.workType=="novel"){
  processNovel();
}

/*************************************************************************
 * 各ページの処理
 *************************************************************************/
/* 1枚で構成されたmanga ページの処理 */
function processSingleManga(){
  var origURL;
  var bigPageURL = "http://www.pixiv.net/member_illust.php?mode=big&illust_id="+metaInfo.workId;
  var zipButton;

  // 原寸画像の URL を取得，その後Zipボタンと直リンクボタンを生成
  GM_xmlhttpRequest({
    method: "GET",
    url: bigPageURL,
    headers: {
      referer: window.location.href,
    },
    onload: function(xhr){
      var parser = new DOMParser();
      var dom = parser.parseFromString(xhr.responseText, "text/html");
      origURL = dom.getElementsByTagName("img")[0].src;
      addDirectLink();
      zipButton = addZipButtonInCoverPage();
      setZipButtonHandlerForSingleIllustManga(zipButton, origURL);
    }
  });
  /* 直リンクボタンを生成する */
  function addDirectLink(){
    addDirectLinkButtonStyle();
    var button = createDirectLinkButton(origURL);
    var worksDisplay = document.getElementsByClassName("works_display")[0];
    var thumbnail = worksDisplay.getElementsByClassName("_work")[0];
    worksDisplay.insertBefore(button, thumbnail);
  }
}

/* 複数枚で構成された漫画について，cover ページの処理 */
function processMultiMangaCover(){
  var zipButton = addZipButtonInCoverPage();
  setZipButtonHandlerForMultiIllustManga(zipButton);
}

/* 複数枚で構成された漫画について，indexページの処理 */
function processMultiMangaIndex(){
  var zipButton = addZipButton();
  setZipButtonHandlerForMultiIllustManga(zipButton);
  
  function addZipButton(){
    var container = document.getElementsByClassName("panel-container")[0];
    var button = document.createElement("li");
    button.innerHTML = 'ZIP';
    button.style = 'display:inline-block; margin-left: 20px; cursor:pointer; background-color: #999; ' +
    'font-weight:bold; color: #FFF; padding:5px; border-radius:5px;';
    container.appendChild(button);
    return button;
  }
}

/* 1枚で構成されたイラストの処理 */
function processSingleIllust(){
  var origURL = document.getElementsByClassName("_illust_modal")[0]
                        .getElementsByTagName("img")[0]
                        .getAttribute("data-src");
  addDirectLink();
  var zipButton = addZipButtonInCoverPage();
  setZipButtonHandlerForSingleIllustManga(zipButton, origURL);
  
  function addDirectLink(){
    addDirectLinkButtonStyle();
    var button = createDirectLinkButton(origURL);
    var worksDisplay = document.getElementsByClassName("works_display")[0];
    var thumbnail = worksDisplay.getElementsByClassName("_layout-thumbnail")[0];
    worksDisplay.insertBefore(button, thumbnail);
  }
}

/* 複数枚で構成されたイラストについて，cover ページの処理 */
function processMultiIllustCover(){
  var zipButton = addZipButtonInCoverPage();
  setZipButtonHandlerForMultiIllustManga(zipButton);
}

/* 複数枚で構成されたイラストについて，index ページの処理 */
function processMultiIllustIndex(){
  addDirectLinks();
  var zipButton = addZipButton();
  setZipButtonHandlerForMultiIllustManga(zipButton);
  
  function addDirectLinks(){
    addDirectLinkButtonStyle();
    var containers = document.getElementsByClassName('item-container');
    for (var i = 0; i < containers.length; i++) {
      (function () {
        var container = containers[i];
        var image = container.getElementsByClassName('image') [0];
        var fsc = container.getElementsByClassName('full-size-container') [0];
        var mangaBigURL = fsc.href;
        GM_xmlhttpRequest({
          method: "GET",
          url: mangaBigURL,
          onload: function(xhr){
            var parser = new DOMParser();
            var dom = parser.parseFromString(xhr.responseText, "text/html");
            var origURL = dom.getElementsByTagName("img")[0].src;
            var uiContainer = document.createElement('div');
            uiContainer.style = 'display:inline-block;position:relative; width:37px;';
            
            var button = createDirectLinkButton(origURL);
            //button.style = "position: absolute; display:block; top:40px;margin: 5px 5px 0 0;";
            button.style.margin = "5px 0 0 0";
            fsc = container.removeChild(fsc);
            uiContainer.appendChild(fsc);
            uiContainer.appendChild(button);
            container.insertBefore(uiContainer, image);
          }
        });
      })();
    }
  }
  function addZipButton() {
    var pageMenu = document.getElementsByClassName('page-menu') [0];
    var button = document.createElement('div');
    button.innerHTML = 'ZIP';
    button.style = 'display:inline-block; margin-left: 5px; cursor:pointer; background-color: #FFF; ' +
    'font-weight:bold; color: #999; padding:5px; border-radius:5px;';
    pageMenu.appendChild(button);
    return button;
  }
}

/* うごイラの処理 */
function processUgoira(){
  var zipButton = addZipButtonInCoverPage();
  zipButton.addEventListener("click",function(){
    if(isCreatingZip){return;}
    isCreatingZip = true;
    zipButton.setAttribute("class", "button-on");
    createZipWrapper();
  });
  
  function createZipWrapper(){
    var framesText="";
    for(var i=0; i<pixiv.context.ugokuIllustFullscreenData.frames.length; i++){
      var frame = pixiv.context.ugokuIllustFullscreenData.frames[i];
      framesText+='{file:"'+frame.file+'", delay:'+frame.delay+'},';
    }
    var player =  document.getElementsByClassName("player")[0];
    var canvas = player.getElementsByTagName("canvas")[0];
    var cstyle = getComputedStyle(canvas,"null");
    var defaultSizeText='width:'+canvas.width+',height:'+canvas.height;
    var ugoiraHTML = getUgoiraHTML(framesText, defaultSizeText);
    var url = pixiv.context.ugokuIllustFullscreenData.src; 
    console.log(url);
    GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    overrideMimeType: 'text/plain; charset=x-user-defined',
    headers: {referer:  window.location.href,},
    onload: function (xhr) {
      var zip = new JSZip();
      zip.file("ugoira.html",ugoiraHTML);
      zip.folder("src").loadAsync(xhr.responseText).then(function(){
        zip.generateAsync({
          type:"blob",
        }).then(function(content){
          isCreatingZip = false;
          zipButton.setAttribute("class", "_button");
          var zipURL = window.URL.createObjectURL(content);
          var zipFileName = getZipFileName();
          makeUserDownloadFile(zipURL, zipFileName);
        });
      });
    },
  });
  }
}
/* 小説の処理 */
function processNovel(){
  var isExpanded = false;
  var zipButton = addZipButtonInCoverPage();
  var expandButton = addExpandButton();
  
  zipButton.addEventListener("click", function(){
    if(isCreatingZip){return;}
    isCreatingZip = true;
    zipButton.setAttribute("class", "button-on");
    createZipWrapper();
  });
  
  expandButton.addEventListener("click", function(){
    if(isExpanded){return;}
    expandButton.setAttribute("class", "button-on");
    expandAllPages(document);
    hideScrollFollower(document);
    hidePageController(document);
    isExpanded = true; // ボタン連打を気にするなら，expandButton 内で設定したほうが良い
  });
  
  function addExpandButton(){
    var buttonContainer = document.createElement("div");
    buttonContainer.style = "display:inline-block; line-height:20px; margin-right:10px; padding-left:0; padding-right:0";
    var button = document.createElement("a");
    button.setAttribute("class", "_button");
    button.innerHTML = "Expand All";
    buttonContainer.appendChild(button);
    var bookmarkContainer = document.getElementsByClassName("bookmark-container")[0];
    bookmarkContainer.insertBefore(buttonContainer, bookmarkContainer.firstChild);
    return button;
  }
  function createZipWrapper(){
    var html = getHTML();
    var links = document.getElementsByTagName("link");
    var imgs = document.getElementsByTagName("img");
    var resourceURLs = [];
    var linkNum = 0;
    var imgNum = 0;
    var resourceNum = 0;
    var downloadedURLs = {};
    var zip = new JSZip();
    zip.file("novel.html", html);
    downloadLinkHref();
    
    /* link 要素が外部のリソースを参照している場合，ダウンロードする */
    function downloadLinkHref(){
      if(linkNum>=links.length){
        downloadResource();
        return;
      }
      var link = links[linkNum];
      linkNum++;
      if(link.rel=="stylesheet" && link.href.match(/^http/) && !downloadedURLs[link.href] ){
        downloadedURLs[link.href]=true;
        console.log(link.href);
        GM_xmlhttpRequest({
          method: "GET",
          url: link.href,
          onload:function(xhr){
            var fileName = getFileName(link.href);
            var file = xhr.responseText;
            storeResourceURLs(file, link.href);
            file = modifyCSS(file);
            zip.folder("src").file(fileName, file);
            downloadLinkHref();
          }
        });
      }else{
        downloadLinkHref();
      }
    }
    
    function downloadBackgroundImage(){
      var bStyle = getComputedStyle(document.body, null);
      if(bStyle.backgroundImage && bStyle.backgroundImage!="none"){
        var url = bStyle.backgroundImage.match(/"([^"]+)/)[1];
        downloadedURLs[url] = true;
        console.log(url);
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          overrideMimeType: 'text/plain; charset=x-user-defined',
          headers: {referer:  window.location },
          onload:function(xhr){
            var file = getFileName(url);
            zip.folder("src").file(file, xhr.responseText,{binary:true});
            downloadImgSrc();
          }
        });
      }else{
        downloadImgSrc();
      }
    }
    
    // スタイルシートを解析して，外部リソースのURLを保存
    function storeResourceURLs(text, stylesheetURL){
      var url0s = text.match(/url\(['"][^data]([^"']+)["']\)/g);
      if(!url0s){return;}
      for (var i=0; i<url0s.length; i++){
        var url0 = url0s[i];
        var url1 = url0.match(/["'](.+)["']/)[1];
        if( url1.match(/(png|jpg|gif)$/) ){
          var url;
          if(url1.match(/^http/)){
            url = url1;
          }else if(url1.match(/^\//)){
            url = getOrigin(stylesheetURL)+url1;
          }else{
            url = getDir(stylesheetURL)+url1;
            console.log(url);
            url = url.replace(/[^/]*?\/\.\.\//,"");
            url = url.replace(/[^/]*?\/\.\//,"");
          }
          resourceURLs.push(url);
          console.log(url);
        }
      }
    }
    
    // スタイルシートのパスを変更
    function modifyCSS(text){
      text = text.replace(/(url\(["'][^data])[^"']+\//g, "$1/");
      return text;
    }
    
    function downloadResource(){
      if(resourceNum>=resourceURLs.length){
        downloadBackgroundImage();
        return;
      }
      var url = resourceURLs[resourceNum];
      resourceNum++;
      if(!downloadedURLs[url] && !url.match(/\.\./)){
        downloadedURLs[url] = true;
        console.log(url);
        GM_xmlhttpRequest({
          method: "GET",
          url: url,
          overrideMimeType: 'text/plain; charset=x-user-defined',
          headers: {referer:  window.location },
          onload: function(xhr){
            var file = getFileName(url);
            zip.folder("src").file(file, xhr.responseText,{binary:true});
            downloadResource();
          }
        });
      }else{
        downloadResource();
      }
    }
    
    function downloadImgSrc(){
      if(imgNum>=imgs.length){
        makeUserDownloadZip();
        return;
      }
      var img = imgs[imgNum];
      imgNum++;
      if(!downloadedURLs[img.src]){
        downloadedURLs[img.src] = true;
        console.log(img.src);
        GM_xmlhttpRequest({
          method: "GET",
          url: img.src,
          overrideMimeType: 'text/plain; charset=x-user-defined',
          headers: {referer:  window.location.href },
          onload:function(xhr){
            var file = getFileName(img.src);
            zip.folder("src").file(file, xhr.responseText,{binary:true});
            downloadImgSrc();
          }
        });
      }else{
        downloadImgSrc();
      }
    }
    
    function makeUserDownloadZip(){
      isCreatingZip = false;
      zipButton.setAttribute("class","_button");
      zip.generateAsync({
        type: 'blob'
      }).then(function (content) {
        var zipURL = window.URL.createObjectURL(content);
        var zipFileName = getZipFileName();
        makeUserDownloadFile(zipURL, zipFileName);
      });
    }
    
    // document のコピーをとり，
    // オフラインの閲覧に適した形式に変更した html をテキストとして返す
    function getHTML(){
      // DOM を変更
      var parser = new DOMParser();
      var serializer = new XMLSerializer();
      var newdoc = parser.parseFromString(serializer.serializeToString(document), "text/html");
      expandAllPages(newdoc);
      removeScript(newdoc);
      hideScrollFollower(newdoc);
      hidePageController(newdoc);
      hideToolMenu(newdoc);
      hideToolBarItems(newdoc);
      // HTML をテキストにし，パスを変更
      var html = new XMLSerializer().serializeToString(newdoc);
      return modifyHTML(html);
    }
  }
  // 全ページを展開する
  // expandButton 経由と zipButton 経由とで呼びだされる
  // isExpanded のフラグは expandButton クリック時にのみセットされている
  function expandAllPages(dom){
    if(isExpanded){return;}
    var novelPages = dom.getElementsByClassName("novel-page");
    for(var i=0; i<novelPages.length; i++){
      var novelPage = novelPages[i];
      novelPage.style.display = "block";
      novelPage.style.borderWidth = "1px";
      novelPage.style.borderColor = "#999999";
      novelPage.style.borderStyle = "none none solid none";
      novelPage.innerHTML = '<p style="text-align:left;color:#999999;margin-bottom:2em;" id="'+(i+1)+'">page: '+(i+1)+'</p>'+novelPage.innerHTML;
    }
   
    var script = document.createElement('script');
    // ページ内遷移を強制するためのアドホックな対処
    script.text = `
      $("a.novel-jump").click(function(event){
        var url = event.currentTarget.href;
        var targetId = url.match(/#(.+)/)[1];
        var target = document.getElementById(targetId);
        var rect = target.getBoundingClientRect();
        var positionY = rect.top + window.pageYOffset;
        window.scrollTo( 0, positionY );
      });
      $("a.novel-jump").click(function(event){event.preventDefault()});
      $("a.novel-jump").mouseup(function(event){event.preventDefault()});
      $(".novel-outline a").click(function(event){
        var url = event.currentTarget.href;
        var targetId = url.match(/#(.+)/)[1];
        var target = document.getElementById(targetId);
        var rect = target.getBoundingClientRect();
        var positionY = rect.top + window.pageYOffset;
        window.scrollTo( 0, positionY );
      });
      $(".novel-outline a").click(function(event){event.preventDefault()});
      $(".novel-outline a").mouseup(function(event){event.preventDefault()});
    `;
    document.head.appendChild(script).remove();
    return dom;
  }
  
  function modifyHTML(html){
    // link href=* のパスを変更
    html = html.replace(/(<link[^>]*?href=")[^"]*\//g, '$1src/');
    // パスの? 以降を削除
    html = html.replace(/(<link[^>]*?href="[^"?]*)\?[^"]*/g,'$1');
    // img src=* のパスを変更
    html = html.replace(/(<img[^>]*?src=")[^"]*\//g, '$1src/');
    // a href=*のパスを変更
    html = html.replace(/(<a[^>]*?href=")\//g, '$1'+getOrigin(window.location.href));
    // 背景画像のパスを変更
    html = html.replace(/(background.*url\(')http[^']*\//g,"$1src/");
    return html;
  }
  
  function hideScrollFollower(dom){
    var scrollFollower = dom.getElementsByClassName("scroll-follower")[0];
    scrollFollower.innerHTML = "";
    //scrollFollower.parentNode.removeChild(scrollFollower);
  }
  
  function hidePageController(dom){    
    var pagers = dom.getElementsByClassName("pager");
    for(var i=0; i<pagers.length; i++){
      pagers[i].innerHTML = "";
    }
  }
  
  function removeScript(dom){
    // なぜか二重ループを回さないと消えない
    for (var j=0; j<10; j++){
      var scripts = dom.getElementsByTagName("script");
      for(var i=0; i<scripts.length; i++){
        var script = scripts[i];
        script.parentNode.removeChild(script);
      }
    }
  }
  
  // 右下の「pixiv sketch」等を非表示にする
  function hideToolMenu(dom){
    var toolMenu = dom.getElementsByClassName("_toolmenu")[0];
    toolMenu.style.display = "none";
    //toolMenu.parentNode.removeChild(toolmenu);
  }
  
  // 右下の「サムネイルフィルター設定」を非表示にする
  function hideToolBarItems(dom){
    var toolbarItems = dom.getElementById("toolbar-items");
    toolbarItems.style.display = "none";
    //toolbarItems.parentNode.removeChild(toolbarItems);
  }
}

/* メタ情報を取得 */
function getMetaInfo(){
  var info = {
    workType: "", // illust-single, illust-multi, manga-single, ugoira, novel
    multiIllustDirection: "", // horizontal, vertical
    pageMode: "", // cover, index
    illustSize: "", // [width, height]
    workId: "",
    workTitle: "",
    authorName: "",
    authorId: "",
  };
  // ユーザーの画像一覧を閲覧時に，ユーザーのIDが取得されてしまうが，害はない
  var url = location.href;
  info.workId = url.match(/id=(\d+)/)[1];

  if(url.match(/novel/)){
    info.workType = "novel";
    info.workTitle = document.getElementsByClassName("work-info")[0]
                             .getElementsByClassName("title")[0].innerHTML;
  }else if(url.match(/mode=medium/)){
    info.pageMode = "cover";
    info.workTitle = document.getElementsByClassName("work-info")[0]
                             .getElementsByClassName("title")[0].innerHTML;
    var worksDisplay = document.getElementsByClassName("works_display")[0];
    if(worksDisplay.getElementsByClassName("_ugoku-illust-player-container")[0]){
      info.workType = "ugoira";  
    }
    else if(worksDisplay.getElementsByClassName("multiple")[0]){
      info.workType = "illust-multi";
      if(worksDisplay.getElementsByClassName("ltr")[0] || worksDisplay.getElementsByClassName("rtl")[0]){
        info.multiIllustDirection = "horizontal";
      }else{
        info.multiIllustDirection = "vertical";
      }
    }
    else{
      if(document.getElementsByClassName("_illust_modal")[0]){
        info.workType = "illust-single";
      }else{
        info.workType = "manga-single";
      }
    }
  }else if(url.match(/mode=manga/)){
    info.pageMode = "index";
    info.workType = "illust-multi";
    
    if(document.getElementsByClassName("_book-viewer")[0]){
      info.multiIllustDirection = "horizontal";
      info.workTitle = document.getElementsByTagName("title")[0].innerHTML;
    }else{
      info.multiIllustDirection = "vertical";
      info.workTitle = document.getElementsByClassName("thumbnail-container")[0]
      .getElementsByTagName("h1")[0].getElementsByTagName("a")[0].innerHTML;
    }
  }
  
  return info;
}

/**************************************************************************
 * 下請けの関数
 **************************************************************************/

function getMimeType(url){
  var suffix = url.match(/.*\.(.+)$/) [1];
  return suffix == 'jpg' ? 'image/jpg' 
       : suffix == 'png' ? 'image/png' 
       : suffix == 'gif' ? 'image/gif' 
       : undefined;
}

function getFileName(url){
  return url.match(/.+\/([^\?#]*)/)[1];
}

function getFileName0(url){
  return url.match(/.+\/(.*)/)[1];
}

function getDir(url){
  return url.match(/^.+\//)[0];
}

function getOrigin(url){
  return url.match(/^.*:\/\/[^/]+/);
}


function modifyImageFileName(name){
  return name.replace(/_p(\d)\./,"_p0$1.");
}

function makeUserDownloadFile(url, fileName){
  var dummy = document.createElement('a');
  dummy.href = url;
  dummy.download = fileName;
  document.body.appendChild(dummy);
  dummy.click();
  document.body.removeChild(dummy);
}

function getZipFileName(){
  var title = metaInfo.workTitle;
  title = title.replace(/[\\\/:\;\*\?\"<>\|]/g,"_");
  return "pixiv_"+metaInfo.workId+"_"+metaInfo.workTitle+".zip";
}

function addZipButtonInCoverPage(){
  var buttonContainer = document.createElement("div");
  buttonContainer.style = "display:inline-block; line-height:20px; margin-right:10px;";
  var button = document.createElement("a");
  button.setAttribute("class", "_button");
  button.innerHTML = "Download as Zip";
  buttonContainer.appendChild(button);
  var bookmarkContainer = document.getElementsByClassName("bookmark-container")[0];
  bookmarkContainer.insertBefore(buttonContainer, bookmarkContainer.firstChild);
  return button;
}

function addDirectLinkButtonStyle(){
  var style = document.createElement("style");
  document.head.appendChild(style);
  style.sheet.insertRule(".pda_direct_link{"+
    "display:inline-block;width:20px;height:20px;padding:5px;margin:5px 0 0 0;"+
    "border-radius: 5px; border-style:none; border-width:1px; border-color:#d6dee5;"+
    "background-image:url("+directLinkIcon+");}",0);
}

function createDirectLinkButton(url){
  var buttonContainer = document.createElement("div");
  buttonContainer.style = "text-align:left;";
  var button = document.createElement("a");
  button.href = url;
  button.setAttribute("class", "pda_direct_link");
  buttonContainer.appendChild(button);
  button.addEventListener('mouseenter', function () {
    button.style.borderStyle = 'solid';
  });
  button.addEventListener('mouseleave', function () {
    button.style.borderStyle = 'none';
  });
  return buttonContainer;
}

function setZipButtonHandlerForSingleIllustManga(zipButton, origURL){
  zipButton.addEventListener("click",function(){
    if(isCreatingZip){return;}
    isCreatingZip = true;
    zipButton.setAttribute("class", "button-on");
    var zip = new JSZip();
    GM_xmlhttpRequest({
      method: "GET",
      url: origURL,
      overrideMimeType: 'text/plain; charset=x-user-defined',
      headers: {referer:  window.location.href,},
      onload:function(xhr){
        var imgFileName = modifyImageFileName(getFileName(origURL));
        zip.file(imgFileName, xhr.responseText,{binary:true});
        zip.generateAsync({
          type: 'blob'
        }).then(function (content) {
          isCreatingZip = false;
          zipButton.setAttribute("class", "_button");
          var zipURL = window.URL.createObjectURL(content);
          var zipFileName = getZipFileName();
          makeUserDownloadFile(zipURL, zipFileName);
        });
      },
    });
  });
}

function setZipButtonHandlerForMultiIllustManga(zipButton){
  zipButton.addEventListener("click", function(){
    if(isCreatingZip){return;}
    isCreatingZip = true;
    if(metaInfo.pageMode=="cover"){
      zipButton.setAttribute("class", "button-on");
      GM_xmlhttpRequest({
      method: "GET",
      url: "http://www.pixiv.net/member_illust.php?mode=manga&illust_id="+metaInfo.workId,
      onload: function(xhr){
        var parser = new DOMParser();
        var dom = parser.parseFromString(xhr.responseText, "text/html");
        createZipWrapper(dom);
      },
    });
    }else{
      createZipWrapper(document);
    }
  });
  function createZipWrapper(dom) {
    var html = new XMLSerializer().serializeToString(dom);
    // manga と illust で処理を分ける必要があるかも（ないかも）
    var totalPage = html.match(/pixiv\.context\.images/g).length-1;
    var pageURLList = [];
    for (var i=0; i<totalPage; i++){
      pageURLList.push("http://www.pixiv.net/member_illust.php?mode=manga_big&illust_id="+metaInfo.workId+"&page="+i);
    }
    var zip = new JSZip();
    var pageNum = 0;
    createZip();
    
    function createZip(){
      zipButton.innerHTML = pageNum+"/"+totalPage;
      var pageURL = pageURLList[pageNum];
      downloadBigPage();
      
      function downloadBigPage(){
        GM_xmlhttpRequest({
          method: "GET",
          url: pageURL,
          onload: function(xhr){
            var parser = new DOMParser();
            var dom = parser.parseFromString(xhr.responseText, "text/html");
            var imageURL = dom.getElementsByTagName("img")[0].src;
            var type = getMimeType(imageURL);
            if (!type) {
              alert('undefined file type for: ' + imageURL);
              return;
            }
            downloadOriginalImage(imageURL);
          }
        });
      }
      function downloadOriginalImage(imageURL){
        console.log(imageURL);
        GM_xmlhttpRequest({
          method: 'GET',
          url: imageURL,
          overrideMimeType: 'text/plain; charset=x-user-defined',
          headers: {
              referer:  window.location.href,
              //origin: getOrigin(window.location.href),
          },
          onload: function (xhr) {
            var file = modifyImageFileName(getFileName(imageURL));
            zip.file(file, xhr.responseText, {
              binary: true
            });
            pageNum++;
            if (pageNum < pageURLList.length) {
              setTimeout(createZip, 1000);
            } else {
              makeUserDownloadZip();
            }
          },
        });
      }
      function makeUserDownloadZip(){
        isCreatingZip = false;
        if(metaInfo.pageMode=="cover"){
          zipButton.setAttribute("class", "_button");
          zipButton.innerHTML = "Downloas as Zip";
        }else{
          zipButton.innerHTML = "ZIP";
        }
        zip.generateAsync({
          type: 'blob'
        }).then(function (content) {
          var zipURL = window.URL.createObjectURL(content);
          var zipFileName = getZipFileName();
          makeUserDownloadFile(zipURL, zipFileName);
        });
      }
    }
  }
}
/***************************************************************************
 * Resources
 ***************************************************************************/
// 直リンク用アイコンの SVG データ
function getDirectLinkIcon(){
  return "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogPCEtLSBDcmVhdGVkIHdpdGggU1ZHLWVkaXQgLSBodHRwOi8vc3ZnLWVkaXQuZ29vZ2xlY29kZS5jb20vIC0tPgoKIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8cmVjdCByeT0iMSIgcng9IjEiIGZpbGw9IiNjY2NjY2MiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI1IiBzdHJva2UtZGFzaGFycmF5PSJudWxsIiBzdHJva2UtbGluZWpvaW49Im51bGwiIHN0cm9rZS1saW5lY2FwPSJudWxsIiBzdHJva2Utb3BhY2l0eT0iMCIgeD0iMiIgeT0iMjIiIHdpZHRoPSIyNiIgaGVpZ2h0PSI3IiBpZD0ic3ZnXzEiLz4KICA8cGF0aCB0cmFuc2Zvcm09InJvdGF0ZSgxODAsIDE1LjAwMiwgMTEuODU1NSkiIGlkPSJzdmdfMiIgZD0ibTQuNTAwMTcsMTEuODMxMjJsMTAuNTAxODMsLTEwLjMzMTM2bDEwLjUwMTgxMSwxMC4zMzEzNmwtNS4yNTA0NDEsMGwwLDEwLjM3OTg0bC0xMC41MDI2NywwbDAsLTEwLjM3OTg0bC01LjI1MDUzLDBsMCwweiIgc3Ryb2tlLW9wYWNpdHk9IjAiIHN0cm9rZS1saW5lY2FwPSJudWxsIiBzdHJva2UtbGluZWpvaW49Im51bGwiIHN0cm9rZS1kYXNoYXJyYXk9Im51bGwiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlPSIjMDAwMDAwIiBmaWxsPSIjY2NjY2NjIi8+CiA8L2c+Cjwvc3ZnPg==";
}

// うごイラビューワー
function getUgoiraHTML(frames, defaultSize){
  var template = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>ugougo</title>
  <script>
    "use strict";
    var frames = [$frames]; // [{file:"000000.jpg",delay:250},{file:"000001.jpg",delay:500},]
    var canvasDefaultSize = {$defaultSize}; // {width: "600", height: "400"}
    var aspectRatio = undefined;
    var frameNum = 0;
    var canvasMode = "default";
    
    // 起動
    window.onload = function(){
      loadImages();
    }
    
    // 全フレームの画像を読み込む
    function loadImages(){
      //console.log("loadImages:",frameNum);
      var frame = frames[frameNum];
      frame.image = document.createElement("img");
      frame.image.addEventListener("load", function(){
        frame.width  = frame.image.width;
        frame.height = frame.image.height;
        if(!aspectRatio){
          aspectRatio = frame.width/frame.height;
        }
        frameNum++;
        if(frameNum>=frames.length){
          frameNum = 0;
          setCanvas();
          drawCanvas();
        }else{
          loadImages();
        }
      });
      frame.image.src = "src/"+frame.file;
    };
   // canvas の設定
   function setCanvas(){
      var canvas = document.getElementById("canvas");
      var changeCanvasPosition = function(){
        var bWidth = document.documentElement.clientWidth;
        var bHeight = document.documentElement.clientHeight;
        canvas.style.left = (bWidth-canvas.width)/2+"px";
        canvas.style.top = (bHeight-canvas.height)/2+"px";
      }
      var changeCanvasSize = function(){
        var bWidth = document.documentElement.clientWidth;
        var bHeight = document.documentElement.clientHeight;
        var fWidth = frames[0].width;
        var fHeight = frames[0].height;
        if(canvasMode=="default"){
          canvas.width = canvasDefaultSize.width;
          canvas.height = canvasDefaultSize.height;
        }else{
          if(bWidth>fWidth && bHeight>fHeight){
            canvas.width  = fWidth;
            canvas.height = fHeight;
          }else{
            if(bHeight*aspectRatio<bWidth){
              canvas.width  = bHeight*aspectRatio;
              canvas.height = bHeight;
            }else{
              canvas.width  = bWidth;
              canvas.height = bWidth/aspectRatio;
            }
          }
        }
      }
      // canvas の click 時, canvasMode を反転させ，canvas のサイズと位置を変更
      canvas.addEventListener("click", function(){
        if(canvasMode=="default"){
          canvasMode = "zoom";
          canvas.className = "zoom";
        }else{
          canvasMode = "default";
          canvas.className = "default";
        }
        changeCanvasSize();
        changeCanvasPosition();
      });
      // Window のサイズ変更時， canvas のサイズと位置を変更
      (function(){
        var resizeTimer = false;
        window.addEventListener('resize', function () {
          if (resizeTimer !== false) {
            clearTimeout(resizeTimer);
          }
          resizeTimer = setTimeout(function () {
            changeCanvasSize();
            changeCanvasPosition();
          }, 50);
        });
      })();
      changeCanvasSize();
      changeCanvasPosition();
    }
    
    // 一定時間毎に canvas に描画
    function drawCanvas(){
      var frame = frames[frameNum];
      var canvas = document.getElementById("canvas");
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(frame.image, 0,0,frame.width,frame.height,0,0,canvas.width,canvas.height);
      frameNum++;
      if(frameNum>=frames.length){frameNum = 0;}
      setTimeout(drawCanvas, frame.delay);
    }
    
  </script>
  <style>
    *{margin:0; padding:0;}
    body{
      background-color: #FFFFFF;
      position: relative;
    }
    #canvas{
      position:absolute;
      margin: auto;
    }
    #canvas.default{
      cursor: zoom-in;
    }
    #canvas.zoom{
      cursor: zoom-out;
    }
  </style>
</head>
<body>
  <canvas id ="canvas" class="default" width=600 height=400>
</body>
</html>`;
  template = template.replace("$frames", frames);
  template = template.replace("$defaultSize", defaultSize);
  return template;
}

})();
