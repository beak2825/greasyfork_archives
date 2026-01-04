// ==UserScript==
// @name         划词菜单(搜索+翻译+保存+转到)
// @namespace    https://greasyfork.org/
// @version      250123.17
// @description  搜索引擎和翻译接口可自定义；大范围划词，检测到划词文本包含网址(非超链接)出现“转到”按钮，多个网址只能跳转首个
// @author       You
// @license      MIT
// @run-at       document-end
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/507301/%E5%88%92%E8%AF%8D%E8%8F%9C%E5%8D%95%28%E6%90%9C%E7%B4%A2%2B%E7%BF%BB%E8%AF%91%2B%E4%BF%9D%E5%AD%98%2B%E8%BD%AC%E5%88%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507301/%E5%88%92%E8%AF%8D%E8%8F%9C%E5%8D%95%28%E6%90%9C%E7%B4%A2%2B%E7%BF%BB%E8%AF%91%2B%E4%BF%9D%E5%AD%98%2B%E8%BD%AC%E5%88%B0%29.meta.js
// ==/UserScript==

!function() {const $=(e)=>{return document.querySelector(e)},$$=(e)=>{return document.querySelectorAll(e)};

  /*搜索引擎和翻译接口*/
  const apis = [

/**模板**

  {
    name: '',
    api: ''
  },

******/
  {
    name: "yandex搜索",
    api: "https://yandex.com/search/touch/?text="
  },
  {
    name: 'bing搜索',
    api: 'https://cn.bing.com/search?q='
  },
  {
    name: "百度搜索",
    api: "https://www.baidu.com/s?wd="
  },
  {
    name: "夸克搜索",
    api: "https://quark.sm.cn/s?q="
  },
  {
    name: "百度翻译",
    api: "https://fanyi.baidu.com/?tpltype=sigma#zd/zd/"
  },
  {
    name: "yandex翻译",
    api: "https://translate.yandex.com/?source_lang=en&target_lang=zh&text="
  },

  ];
  
  let swipesTimer,text='',menu,endY,eStart,

  openUrl=(a,b)=>{window.open(a+b)},
  
  blobDownload=(content,filename='.txt')=>{
    let alink=document.createElement('a');
    alink.download=filename;
    alink.style.display='none';
    alink.href=URL.createObjectURL(new Blob([content]));
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink);
  },

  saveText=()=>{
    let save = document.createElement("span");
    save.innerHTML = "\u4fdd\u5b58\u9009\u4e2d";
    save.addEventListener("click",function(){blobDownload(text)});
    menu.appendChild(save);
    },

  goTo=()=>{
    let getUrl = text.match(/((https?:\/\/(\w[\w-]*\.)+[A-Za-z]{2,5}|(https?:\/\/)?((0|1\d?\d?|2(\d?|[0-4]\d|5[0-5])|[3-9]\d?)\.){3}(0|1\d?\d?|2(\d?|[0-4]\d|5[0-5])|[3-9]\d?)|(\w[\w-]*\.)+(com|cn|org|net|cc|top|xyz|vip|info|tv|gov|edu))(?!\w)(:\d+)?(\/([\x21-\x7e]*[\w\/=])?)?)/i)[0];
    if (getUrl) {
      let link = document.createElement("span");
      link.id = "abcLink";
      link.innerHTML = "\u8f6c\u5230";
      link.addEventListener("click",function(){
        -1==getUrl.indexOf("http") ? openUrl("http://", getUrl) : openUrl("", getUrl);
      });
      menu.appendChild(link);
    }
  },

  selectAll=()=>{
    let select = document.createElement("span");
    select.innerHTML = "全选";
    select.addEventListener("click",function(){
    window.getSelection().selectAllChildren($('html'));

/*另外一种实现方法
let range = document.createRange();
let referenceNode = $('html');
range.selectNode(referenceNode);
window.getSelection().removeAllRanges();
window.getSelection().addRange(range);
*/

});
    menu.appendChild(select);
},

  extSelect=()=>{
    let select = document.createElement("span");
    select.innerHTML = "扩选";
    select.addEventListener("click",function(){
		window.getSelection().selectAllChildren(eStart);

});
    menu.appendChild(select);
},

  extSelectAndCopy=()=>{
    let select = document.createElement("span");
    select.innerHTML = "扩选并复制";
    select.addEventListener("click",function(){
		window.getSelection().selectAllChildren(eStart);
		setTimeout(function(){$('#abcLength').click();},1000);
});
    menu.appendChild(select);
},

  copyText=()=>{
    let doCopy = document.createElement("span");
    doCopy.id='abcLength';
    doCopy.innerHTML = "复制";
    doCopy.addEventListener("click",function(){GM_setClipboard(text);});
    menu.appendChild(doCopy);
    },

  main=()=>{
    text = window.getSelection().toString().trim();

    if(text){
   
eStart=window.getSelection().getRangeAt(0).startContainer.parentNode;

if(endY>document.documentElement.clientHeight/2){
    $("#abcWords").style.bottom='auto';
    $("#abcWords").style.top='20%';
    }else{
    $("#abcWords").style.bottom='20%';
    $("#abcWords").style.top='auto';
    }
    menu.style.display = "block";
    $('#abcLength').innerHTML=`复制选中[${text.length}]`;
    goTo();
    }
  },

  swipes=()=>{
    menu.style.display = "none";
    $("#abcLink")&&$("#abcLink").remove();
    clearTimeout(swipesTimer);
    swipesTimer = setTimeout(main, 750);
  }

  if (!$("#abcWords")) {
    let adDiv = document.createElement("div");
    adDiv.id = "abcWords";
    adDiv.style.cssText = "display:none;width:100%;position:fixed;bottom:0px;z-index:9999999999;text-align:center;margin:4px auto;padding:4px;-webkit-tap-highlight-color:rgba(0,0,0,0);";
    document.body.appendChild(adDiv);
    let spanStyle = document.createElement("style");
    spanStyle.innerHTML = "#abcWords span{display:inline-block!important;background:#6a6a6a!important;color:#fff!important;font-size:20px!important;line-height:24px!important;margin:4px!important;padding:4px;!importantborder:1px solid #c5c5c5;border-radius:5px;}";
    document.body.appendChild(spanStyle);
    
    menu=$("#abcWords");

    apis.forEach((i)=>{
      let addApi = document.createElement("span");
      addApi.innerHTML = i.name;
      addApi.setAttribute("data-api", i.api);
      addApi.onclick = function(){
        openUrl(this.getAttribute("data-api"),encodeURIComponent(text));
      };
      menu.appendChild(addApi);
    });

    saveText();
    selectAll();
	extSelect();
	extSelectAndCopy();
    copyText();

  }

  document.addEventListener("selectionchange", swipes);
  document.addEventListener("touchstart",function(e){endY=e.changedTouches[0].clientY;});

}();