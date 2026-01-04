// ==UserScript==
// @name        高校教材云平台书籍信息查看
// @namespace   https://github.com/wu1015/BookDetailForGxjcy
// @supportURL  https://github.com/wu1015/BookDetailForGxjcy/issues
// @match       https://www.gxjcy.cn/index
// @grant       GM_xmlhttpRequest
// @version     1.0
// @license MIT
// @author      wu1015
// @description 平台不再显示ISBN等关键信息，但后台又有数据传出，故写此脚本方便使用。
// @downloadURL https://update.greasyfork.org/scripts/493248/%E9%AB%98%E6%A0%A1%E6%95%99%E6%9D%90%E4%BA%91%E5%B9%B3%E5%8F%B0%E4%B9%A6%E7%B1%8D%E4%BF%A1%E6%81%AF%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493248/%E9%AB%98%E6%A0%A1%E6%95%99%E6%9D%90%E4%BA%91%E5%B9%B3%E5%8F%B0%E4%B9%A6%E7%B1%8D%E4%BF%A1%E6%81%AF%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==


var resJson;
var objLen;
var disStr="书籍信息：\n";
var isbnList=new Array();
var pressNameList=new Array();

function focusList(url,tab){
    GM_xmlhttpRequest({
      url:url,
      method :"POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        "Origin": "https://www.gxjcy.cn/",
        "Referer": "https://www.gxjcy.cn/univ/stuCoursesUtm",
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36'
      },
      onload:function(xhr){
        var xhrJson=JSON.parse(xhr.responseText);
        resJson=xhrJson.rows;
        objLen=Object.keys(xhrJson.rows).length;
        setList(tab);
      }
    });
};

function setList(tab){
  var tmp=objLen;
  while(tmp>0){
    disStr+=resJson[objLen-tmp].kechengName+" "+resJson[objLen-tmp].jiaoshiName+" "+resJson[objLen-tmp].jiaocaiName+"\n"+resJson[objLen-tmp].isbn+" "+resJson[objLen-tmp].pressName+" "+resJson[objLen-tmp].writer;
    disStr+="\n";
    tmp--;
  }
};

function run(){
  console.log("脚本开始");
  try{
    focusList("https://www.gxjcy.cn/univ/stuCoursesUtm/list","tab1");
  }catch(err){

  }
  try{
    focusList("https://www.gxjcy.cn/univ/stuCoursesUtm/biList","tab2");
  }catch(err){

  }
}

function display(){
  var btnDis = document.createElement("button");
  btnDis.innerHTML = "书籍详细信息";
  btnDis.style.position = "fixed";
  btnDis.style.bottom = "20px";
  btnDis.style.right = "20px";
  btnDis.onclick = function() {
    console.log(disStr);
    alert(disStr);
  };
  document.body.appendChild(btnDis);
}

run();
display();

