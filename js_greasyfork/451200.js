// ==UserScript==
// @name         小程序反编译提取分包路径并生成wxml页面即分包跳转路径 ，粘贴到小程序开发者wxml，真机预览点击对应按钮即可获得分包（自用）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   复制appjson内容到输入框 即可一键生成小程序分包所有路径 分包多的情况下可以用  使用网址所有的qq.com
// @author       You
// @match         *://*.qq.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/451200/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%8F%8D%E7%BC%96%E8%AF%91%E6%8F%90%E5%8F%96%E5%88%86%E5%8C%85%E8%B7%AF%E5%BE%84%E5%B9%B6%E7%94%9F%E6%88%90wxml%E9%A1%B5%E9%9D%A2%E5%8D%B3%E5%88%86%E5%8C%85%E8%B7%B3%E8%BD%AC%E8%B7%AF%E5%BE%84%20%EF%BC%8C%E7%B2%98%E8%B4%B4%E5%88%B0%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91%E8%80%85wxml%EF%BC%8C%E7%9C%9F%E6%9C%BA%E9%A2%84%E8%A7%88%E7%82%B9%E5%87%BB%E5%AF%B9%E5%BA%94%E6%8C%89%E9%92%AE%E5%8D%B3%E5%8F%AF%E8%8E%B7%E5%BE%97%E5%88%86%E5%8C%85%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/451200/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%8F%8D%E7%BC%96%E8%AF%91%E6%8F%90%E5%8F%96%E5%88%86%E5%8C%85%E8%B7%AF%E5%BE%84%E5%B9%B6%E7%94%9F%E6%88%90wxml%E9%A1%B5%E9%9D%A2%E5%8D%B3%E5%88%86%E5%8C%85%E8%B7%B3%E8%BD%AC%E8%B7%AF%E5%BE%84%20%EF%BC%8C%E7%B2%98%E8%B4%B4%E5%88%B0%E5%B0%8F%E7%A8%8B%E5%BA%8F%E5%BC%80%E5%8F%91%E8%80%85wxml%EF%BC%8C%E7%9C%9F%E6%9C%BA%E9%A2%84%E8%A7%88%E7%82%B9%E5%87%BB%E5%AF%B9%E5%BA%94%E6%8C%89%E9%92%AE%E5%8D%B3%E5%8F%AF%E8%8E%B7%E5%BE%97%E5%88%86%E5%8C%85%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    GM_addStyle(`
  .input{
  padding-left: 10px;
  width:250px;
  height:100px;

}
  .blue{
  width: 62px;
  padding:2px;
  line-height: 25px;
  font-size: 14px;
  color: white;
  margin:0 2px 2px 0;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  border:1px solid #1e7db9;
  box-shadow: 0 1px 2px #8fcaee inset,0 -1px 0 #497897 inset,0 -2px 3px #8fcaee inset;
  background: -webkit-linear-gradient(top,#42a4e0,#2e88c0)
}
 `)

    var background = document.createElement("div")
    background.id = "background"
    background.innerHTML = "<boby style='position: fixed;padding-left:20px'>  <div ><input id='appid' placeholder='输入APPID' ></input>  <button  class='blue' id ='one'  >执行</button></div> <textArea id='json' class='input' placeholder='复制appjson源码到这里'></textArea></boby> "
    background.setAttribute("style", "position:fixed;bottom:15vh;z-index: 9999999999;  float:right; width:300px;height:200px;background:#707070 "); //背景样式
    document.body.appendChild(background)
    document.getElementById('one')
        .addEventListener('click', function() {
        var appid = document.getElementById("appid")
        .value;
        var json = document.getElementById("json")
        .value
        if (typeof json == 'string') {
            try {
                var jsonStr = JSON.parse(json);
                var sub = jsonStr.subPackages
                for (var i = 0; i < sub.length; i++) {
                    (function(j) {
                        setTimeout(function() {
                            var pa = sub[j].root + sub[j].pages[0]
                            var aaa = '<navigator target="miniProgram" style="float: left;border-style:double;margin:10px;"  open-type="navigate"  path="' + pa + '" app-id="' + appid + '"  >第' + i-- + '个</navigator>'
                            document.writeln(aaa);
                            var test = document.getElementsByTagName('html')[0].innerHTML;
                            navigator.clipboard.writeText(test)
                        }, 1000, j)
                    })(i)
                }
                alert("提取成功，可直接粘贴到wxml页面")
            } catch(e) {
                alert("输入的内容有误,请全选复制APP.json内容")
            }
        }
    })
})();