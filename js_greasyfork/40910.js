// ==UserScript==
// @name         accessibility_网页工具箱
// @namespace    https://www.zhihu.com/people/yin-xiao-bo-11
// @version      0.2.5
// @description  提供一些小功能，增强使用屏幕阅读器访问网页的体验
// @author       Veg
// @include    http://*/*
// @include    https://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40910/accessibility_%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/40910/accessibility_%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

function $query(selector) {
var arr =  [];
var element=document.querySelectorAll(selector);
for (var i=0, l=element.length; i<l; i++) {
if(element[i].offsetParent !== null) {
arr.push(element[i]);
}
}
return arr.length;
}

document.body.addEventListener("keydown", function (k) {
if(k.altKey&&k.ctrlKey&&k.shiftKey&&k.keyCode==37) {
    var xx = document.activeElement;
    alert(xx);
    var f = xx.parentNode;
    alert(f.innerHTML);
}
//清除页面焦点
  if (k.ctrlKey && k.altKey && k.keyCode == 187) {
    document.activeElement.blur();
  }

  webPageLocationSave(k);
  imgTabindex(k);
  webStatistics(k);
}, null);
(function () {
GM_xmlhttpRequest({
method : "GET",
headers: {"Accept": "Content-Type:application/json"},
url : "https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=DmRzeWmTGgwPuPrFyHPhxLFH&client_secret=iYUz9bmANfuDBhlpacObRCq4qutDHfSe",
onload : function (response) {
var data=response.responseText;
var datas=JSON.parse(data);
accessToken=datas.access_token;
}
});
  var audio = document.createElement("audio");
  audio.className = "audio-audios";
  audio.src = "";
  audio.volume = 1;
  document.body.appendChild(audio);
})();
//网页位置保存
function webPageLocationSave(k) {
  var element = document.activeElement;
  var href = element.getAttribute('href');
  if (k.ctrlKey && k.shiftKey && k.keyCode == 49) {
    if (element.tagName == 'A') {
      localStorage.setItem('key1', href);
      alert('保存成功');
    }
    else {
      alert('只能在链接元素上保存位置！');
    }
  }
  if (k.shiftKey && k.altKey && k.keyCode == 49) {
    var name = localStorage.getItem('key1');
    var hrefs = '[href="' + name + '"]';
    document.querySelector(hrefs).focus();
  }
  //2
  if (k.ctrlKey && k.shiftKey && k.keyCode == 50) {
    if (element.tagName == 'A') {
      localStorage.setItem('key2', href);
      alert('保存成功');
    }
    else {
      alert('只能在链接元素上保存位置！');
    }
  }
  if (k.shiftKey && k.altKey && k.keyCode == 50) {
    var name = localStorage.getItem('key2');
    var hrefs = '[href="' + name + '"]';
    document.querySelector(hrefs).focus();
  }
  //3
  if (k.ctrlKey && k.shiftKey && k.keyCode == 51) {
    if (element.tagName == 'A') {
      localStorage.setItem('key3', href);
      alert('保存成功');
    }
    else {
      alert('只能在链接元素上保存位置！');
    }
  }
  if (k.shiftKey && k.altKey && k.keyCode == 51) {
    var name = localStorage.getItem('key3');
    var hrefs = '[href="' + name + '"]';
    document.querySelector(hrefs).focus();
  }
  //4
  if (k.ctrlKey && k.shiftKey && k.keyCode == 52) {
    if (element.tagName == 'A') {
      localStorage.setItem('key4', href);
      alert('保存成功');
    }
    else {
      alert('只能在链接元素上保存位置！');
    }
  }
  if (k.shiftKey && k.altKey && k.keyCode == 52) {
    var name = localStorage.getItem('key4');
    var hrefs = '[href="' + name + '"]';
    document.querySelector(hrefs).focus();
  }
  //5
  if (k.ctrlKey && k.shiftKey && k.keyCode == 53) {
    if (element.tagName == 'A') {
      localStorage.setItem('key5', href);
      alert('保存成功');
    }
    else {
      alert('只能在链接元素上保存位置！');
    }
  }
  if (k.shiftKey && k.altKey && k.keyCode == 53) {
    var name = localStorage.getItem('key5');
    var hrefs = '[href="' + name + '"]';
    document.querySelector(hrefs).focus();
  }
  //6
  if (k.ctrlKey && k.shiftKey && k.keyCode == 54) {
    if (element.tagName == 'A') {
      localStorage.setItem('key6', href);
      alert('保存成功');
    }
    else {
      alert('只能在链接元素上保存位置！');
    }
  }
  if (k.shiftKey && k.altKey && k.keyCode == 54) {
    var name = localStorage.getItem('key6');
    var hrefs = '[href="' + name + '"]';
    document.querySelector(hrefs).focus();
  }
  //7
  if (k.ctrlKey && k.shiftKey && k.keyCode == 55) {
    if (element.tagName == 'A') {
      localStorage.setItem('key7', href);
      alert('保存成功');
    }
    else {
      alert('只能在链接元素上保存位置！');
    }
  }
  if (k.shiftKey && k.altKey && k.keyCode == 55) {
    var name = localStorage.getItem('key7');
    var hrefs = '[href="' + name + '"]';
    document.querySelector(hrefs).focus();
  }
  //8
  if (k.ctrlKey && k.shiftKey && k.keyCode == 56) {
    if (element.tagName == 'A') {
      localStorage.setItem('key8', href);
      alert('保存成功');
    }
    else {
      alert('只能在链接元素上保存位置！');
    }
  }
  if (k.shiftKey && k.altKey && k.keyCode == 56) {
    var name = localStorage.getItem('key8');
    var hrefs = '[href="' + name + '"]';
    document.querySelector(hrefs).focus();
  }
  //9
  if (k.ctrlKey && k.shiftKey && k.keyCode == 57) {
    if (element.tagName == 'A') {
      localStorage.setItem('key9', href);
      alert('保存成功');
    }
    else {
      alert('只能在链接元素上保存位置！');
    }
  }
  if (k.shiftKey && k.altKey && k.keyCode == 57) {
    var name = localStorage.getItem('key9');
    var hrefs = '[href="' + name + '"]';
    document.querySelector(hrefs).focus();
  }


}

//图片 tabindex
function imgTabindex(k) {
  var img = document.querySelectorAll('img');
  for (var i = 0, l = img.length; i < l; i++) {
    if (k.altKey && k.keyCode == 221) {
      img[i].setAttribute('tabindex', '0');
    }
    if (k.altKey && k.keyCode == 219) {
      img[i].removeAttribute('tabindex', '0');
    }
  }
}

// 网页综述统计
function webStatistics(k) {
  if (k.ctrlKey && k.altKey && k.keyCode == 222) {
var link=$query('a[href],[role="link"]');
    if (link > 0) {
      var links = "链接" + link + "个；";
    } else {
      var links = "";
    }
    var button = $query('button,[role="button"],input[type="button"]');
    if (button > 0) {
      var buttons = "按钮" + button + "个；";
    } else {
      var buttons = "";
    }
var input=$query('input[type="text"],[role="textbox"], textarea');
    if (input > 0) {
      var inputs = "文本框" + input + "个；";
    } else {
      var inputs = "";
    }
    var select = 
$query('select,[role="combobox"]');
    if (select > 0) {
      var selects = "组合框" + select + "个；";
    } else {
      var selects = "";
    }
    var checkbox = $query('input[type="checkbox"],[role="checkbox"]');
    if (checkbox > 0) {
      var checkboxs = "复选框" + checkbox + "个；";
    } else {
      var checkboxs = "";
    }
    var heading = $query('h1,h2,h3,h4,h5,h6');
    if (heading > 0) {
      var headings = "标题" + heading + "个；"
    } else {
      headings = "";
    }
    var img = $query('img[src]');
    if (img.length > 0) {
      var imgs = "图片" + img + "张；"
    } else {
      imgs = "";
    }
    var statistics = links + buttons + inputs + selects + checkboxs + headings + imgs;
voiceTTS(statistics);
  }
}

document.body.addEventListener("click", function (k) {
  var t = k.target;
  var tag = t.tagName;
  if (tag == 'P' || tag == 'DIV' || tag == 'SPAN') {
    t.setAttribute('tabindex', '-1');
    t.focus();
  }
}, null);
function voiceTTS(TTStext) {
  var zhText = encodeURI(TTStext);
  var parameter = "&vol=7&per=0&spd=9&pit=7";
  var voicebbUrl = "https://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=xiaobo&tok="+accessToken+"&tex=" + zhText + parameter;
  var audio = document.querySelector('audio.audio-audios'); {
    if (audio !== null) {
      audio.src = voicebbUrl;
      audio.play();
    }
  }
}



(function() {
all();
function all() {
let em = document.querySelectorAll('em');
for (let i=0, l=em.length; i<l; i++) {
let parent = em[i].parentNode;
let parent2 = em[i].parentNode.parentNode;
if (parent2.tagName === 'H3') {
parent2.setAttribute('aria-label', parent2.innerText);
}
if (parent.tagName == 'A') {
parent.setAttribute('aria-label', parent.innerText);
}
else {
let parent2 = parent.parentNode;
if (parent2.tagName == 'A') {
parent2.setAttribute('aria-label', parent2.innerText);
}
else {
em[i].setAttribute('aria-label', em[i].innerText);
}
}

// em[i].setAttribute('aria-label', em[i].innerText);
}
let strong = document.querySelectorAll('strong');
for (let i=0, l = strong.length; i<l; i++) {
strong[i].setAttribute('aria-label', strong[i].innerText);
}
}
/*
let mos = new MutationObserver( (mutationRecord) => {
all();
});
mos.observe(document.documentElement, {
'childList': true,
'subtree': true
});
*/
})();

