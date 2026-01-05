// ==UserScript==
// @name        Easy-to-save pixiv novel
// @name:ja     Easy-to-save pixiv novel
// @namespace   https://greasyfork.org/ja/users/24052-granony
// @description Adds button that convert a pixiv novel to an easy-to-save format.
// @description:ja pixiv の小説を保存しやすい形式に変換するためのボタンを追加します．
// @include     http://www.pixiv.net/novel/show.php?id=*
// @version     1.0.1
// @grant       none
// @license     MIT License
// @downloadURL https://update.greasyfork.org/scripts/15837/Easy-to-save%20pixiv%20novel.user.js
// @updateURL https://update.greasyfork.org/scripts/15837/Easy-to-save%20pixiv%20novel.meta.js
// ==/UserScript==
/*
    = Detailed description (Japanese) =
    このスクリプトは pixiv の小説をブラウザで保存しやすい形式 --つまりオフライ
    ンで可読な html ファイル-- に変換するボタンを「ブックマークに追加」ボタン
    の隣に追加します．ボタンを押すと，全てのスクリプトといくつかの装飾が排除さ
    れ，全ページのテキストが現在のウィンドウに表示されます．背景画像を保存する
    ために HTML5 で廃止された属性 (body 要素に対する background 属性) を使用し
    ています．
    
    = Detailed description (English) =
    This scripts adds a button that converts a pixiv novel to an 
    easy-to-save format for browser which is readable html file without network
    access, next to "Add to Bookmarks" button. When you click the button, all
    scripts and some decoration are removed, and all novel pages are shown in
    current window. To save the background image, the script uses an obsolete
    attribute (background attribute for body element).
    
 */
(function(){
  'use strict';
  if(window!=window.parent){return;}
  var convertButton = (function(){
    var button = document.createElement("a");
    button.setAttribute("class", "_button");
    button.innerHTML = 'Convert Easy-to-Save';
    
    button.addEventListener("click",function(){
      var nHead = (function(){
        // ボックスモデル関連のスタイルはおおむね公式のものと同じ値で決め打ち
        // フォント関連はできる限り実際に表示されているスタイルを尊重する
        var headHTML = "";
        var documentTitle = document.title;
        var bodyBackgroundColor  = getComputedStyle(document.body).backgroundColor;
        var novelBackgroundColor = getComputedStyle(
                                     document.getElementsByClassName("novel-body")[0]
                                   ).backgroundColor;
        var novelFontFamily = getComputedStyle(
                                document.getElementsByClassName("novel-pages")[0]
                              ).fontFamily;
        var novelFontSize   = getComputedStyle(
                                document.getElementsByClassName("novel-pages")[0]
                              ).fontSize;
        var novelLineHeight = getComputedStyle(
                                document.getElementsByClassName("novel-pages")[0]
                              ).lineHeight;
        var titleFontSize   = getComputedStyle(
                                document.getElementsByClassName("work-info")[0]
                                        .getElementsByClassName("title")[0]
                              ).fontSize;
        var infoFontSize    = getComputedStyle(
                                document.getElementsByClassName("work-info")[0]
                                     .getElementsByClassName("caption")[0]
                              ).fontSize;
        headHTML += '<head>'+"\n";
        headHTML += '<title>'+documentTitle+'</title>'+"\n";
        headHTML += '<style>'+"\n";
        headHTML += '*{margin:0; padding:0}'+"\n";
        headHTML += 'h1{margin-bottom:15px;}'+"\n";
        headHTML += 'body{background-color:'+ bodyBackgroundColor + ';}'+"\n";
        headHTML += '#wrapper{width:782px; position:relative; margin:20px auto; background-color:white}'+"\n";
        headHTML += '#info{   padding: 15px 20px 0 20px;}'+"\n";
        headHTML += '#info h1{font-size:'+titleFontSize+'}'+"\n";
        headHTML += '#info div{font-size:'+infoFontSize+'}'+"\n";
        headHTML += '#left{width:174px; padding:0 15px 15px 15px; float:left;}'+"\n";
        headHTML += '#right{width:500px; float:right;}';
        headHTML += '#author::before{content:"Author: "}'+"\n";
        headHTML += '#date::before{content:"Date: "}'+"\n";
        headHTML += '#novel{   font-size:'+novelFontSize+
                            '; line-height:'+novelLineHeight+
                            '; padding:54px' +
                            '; background-color:'+novelBackgroundColor+
                            '; font-family:'+novelFontFamily+
                            '; border-width:1px 0 0 0; border-style:solid;'+
                            '; clear:both;}'+"\n";
        headHTML += '.page{border-width:1px 0 0 0; border-style:solid; margin-top:3em;}'+"\n";
        headHTML += '#novel .page:first-child{border:0; margin-top:0}'+"\n";
        headHTML += '.page_num{font-style:italic; font-size:0.8em; color:gray}'+"\n";
        headHTML += '#caption{margin:1em 0}'+"\n";
        headHTML += '.image_container{text-align:center;}'+"\n";
        headHTML += '.caption{text-align:center;}'+"\n"; // caption for inserted images
        headHTML += '#cover{text-align:center;}'+"\n";
        headHTML += '#index{position: relative;}'+"\n";
        headHTML += '#index em{position:absolute; right:0}'+"\n";
        headHTML += '#index li{border-width:0 0 1px 0; border-style:dotted; list-style-type:none;}'+"\n";
        headHTML += '#index a{text-decoration:none}'+"\n";
        headHTML += '</style>'+"\n";
        headHTML += '</head>'+"\n";
        return headHTML;
      })();
      
      var nBody = (function(){
        var bodyHTML = "";
        var currentURL = location.href;
        var topURL = currentURL.replace(/#.*$/,"");
        var novelTitle = document.getElementsByClassName("work-info")[0]
                                 .getElementsByClassName("title")[0].innerHTML;
        var author =(function(){
          var authorHTML = document.getElementsByClassName("novel-header")[0]
                                   .getElementsByClassName("author")[0].textContent;
          var userID = document.getElementById("rpc_u_id").innerHTML;
          var userURL = "http://www.pixiv.net/member.php?id="+userID;
          authorHTML = '<a href="'+userURL+'">'+authorHTML+'</a>';
          return authorHTML;
        })();
        var date       = document.getElementsByClassName("work-info")[0]
                                 .getElementsByClassName("meta")[0]
                                 .getElementsByTagName("li")[0].innerHTML;
        var caption    = document.getElementsByClassName("work-info")[0]
                                 .getElementsByClassName("caption")[0].innerHTML;
        var cover = (function(){
          // シリーズリストが有ったり無かったりなので，
          // img要素を持つ最初の area_new を表紙とみなす．
          var area_news = document.getElementsByClassName("ui-layout-west")[0]
                                  .getElementsByClassName("area_new");
          for(var i=0; i<area_news.length; i++){
            var area_new = area_news[i];
            if(area_new.getElementsByTagName("img").length){
              return area_new.getElementsByTagName("a")[0].innerHTML;
            }
          }
        })();
        var index      = document.getElementById("novel_chapter")
                                 .getElementsByClassName("area_inside")[0].innerHTML;
        var novel = (function(){
          var novelHTML = "";
          // ページ内リンクのために設定されている id が数字のみで構成されていて 
          // HTML の文法違反であるため，そのままではスクリプトなしには機能しない．
          // id のプレフィックスに "page" をつけて，リンクを変更する．
          var insidePageLink = new RegExp('(<a href="#)(\\d+)(" class="novel-jump">)',"img");
          // 改行を適宜はさむ
          var lineBreakTags  = new RegExp('(</p>|<br>)',"img");
          // 特にスタイルの指定されていない大量の span 要素への指定を取り除く
          var decoration     = new RegExp('<span class="vtoken.*?">(.*?)</span>',"img");
          var novelPages = document.getElementsByClassName("novel-pages")[0]
                                   .getElementsByClassName("novel-page");
          for(var i=0; i<novelPages.length; i++){
            var novelPageHTML = novelPages[i].innerHTML;
            novelPageHTML = novelPageHTML.replace(insidePageLink, "$1page$2$3");
            novelPageHTML = novelPageHTML.replace(lineBreakTags,  "$1\n");
            novelPageHTML = novelPageHTML.replace(decoration, "$1");
            novelHTML += '<div id="page'+(i+1)+'" class="page">'+"\n";
            novelHTML += '<span class="page_num">page:'+ (i+1) +'</span>'+"\n";
            novelHTML += novelPageHTML;
            novelHTML += '</div>'+"\n";
          }
          return novelHTML;
        })();
        
        bodyHTML += '<div id="wrapper">'+"\n";
        bodyHTML += '  <div id="info">'+"\n";
        bodyHTML += '    <div id="right">'+"\n";
        bodyHTML += '      <h1 id="title">'   +novelTitle+ '</h1>'+"\n";
        bodyHTML += '      <div id="url"><a href="'+topURL+'">'+topURL+'</a></div>'+"\n";
        bodyHTML += '      <div id="author">' +author+ '</div>'+"\n";
        bodyHTML += '      <div id="date">'   +date+    '</div>'+"\n";
        bodyHTML += '      <div id="caption">'+caption+ '</div>'+"\n";
        bodyHTML += '    </div>'+"\n";
        bodyHTML += '    <div id="left">'+"\n";
        bodyHTML += '      <div id="cover">'  +cover+   '</div>'+"\n"; 
        bodyHTML += '      <div id="index">'  +index+   '</div>'+"\n";
        bodyHTML += '    </div>'+"\n";
        bodyHTML += '  </div>'+"\n";
        bodyHTML += '  <div id="novel">'  +novel+  '</div>'+"\n";
        bodyHTML += '</div>'+"\n";
        return bodyHTML;
      })();
    
      document.head.innerHTML= nHead;
      document.body.innerHTML= nBody;
  
      // 背景画像を HTML ファイルに含めるため，CSS ではなくて，
      // body 要素の background 属性(HTML5では廃止されているが，機能する)として指定する．
      var bodyBackgroundImage  = getComputedStyle(document.body).backgroundImage;
      if(bodyBackgroundImage && bodyBackgroundImage!="none"){
        document.body.setAttribute("background",bodyBackgroundImage.replace(/url\("(.+)"\)/,"$1"));
      }
    }); // button on clicked
    return button;
  })();

  var convertButtonContainer = (function(){
    var container = document.createElement("div");
    var cs = container.style;
    cs.display    = "inline-block";
    cs.position   = "absolute";
    cs.right      = "150px";
    cs.top        = "0px";
    cs.lineHeight = "20px";
    return container;
  })();
  convertButtonContainer.appendChild(convertButton);
  
  // 「ブックマークに追加」ボタンの手前に配置
  var parent = document.getElementsByClassName('action')[0];
  parent.insertBefore(convertButtonContainer,parent.getElementsByClassName('bookmark-container')[0]);

})();
