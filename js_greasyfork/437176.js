// ==UserScript==
// @name         资源库专用搜索脚本
// @namespace    感谢Ganzy的朋友
// @version      0.21
// @description  点击展开目录即可将全部展开，然后Ctrl+F组合键搜索就可以了
// @author       感谢Ganzy的朋友
// @match        http://ziyuanhuishequ.ys168.com/
// @match        http://ziyuanhuishequ.ys168.com//
// @match        http://ziyuanhuishequ.uepan.com/
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/437176/%E8%B5%84%E6%BA%90%E5%BA%93%E4%B8%93%E7%94%A8%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/437176/%E8%B5%84%E6%BA%90%E5%BA%93%E4%B8%93%E7%94%A8%E6%90%9C%E7%B4%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    var button = document.createElement("input"); //创建一个input对象（提示框按钮）
    button.setAttribute("type", "button");
    button.setAttribute("value", "点我全部展开目录，然后Ctrl+F组合键搜索");
    button.onclick = function(){ getGame(); };
    button.style.width = "350px";
    button.style.height = "50px";
    button.style.align = "center";
    button.style.marginLeft = "250px";
    button.style.marginBottom = "10px";
    button.style.background = "lightblue";
    button.style.border = "1px solid " + "#b46300";//52
    button.style.color = "red";
    var x = document.getElementById("kjbt");
    x.appendChild(button);
})();

function getGame() {
    var gameUlList = document.getElementById('menuList');
    for (var i = 0; i < gameUlList.childElementCount; i++) {
        var gameLi = gameUlList.getElementsByTagName("li")[i];
       // _ml.dj(gameLi);

        var id = gameLi.id.replace("ml_","");
        var url = "http://cb.ys168.com/f_ht/ajcx/wj.aspx?cz=dq&jsq=0&mlbh=" + id + "&wjpx=1&_dlmc=ziyuanhuishequ&_dlmm=";
        getList(url, gameLi);
        var menuShow = document.getElementsByClassName("menu");
        menuShow[i].style.display="block";

    }
}

function getList(url, gameLi) {
    console.log(url);
    GM_xmlhttpRequest({
        method: 'get',
        url: url,
        synchronous: true,
        headers: {
            "Referer": "http://cb.ys168.com/f_ht/ajcx/000ht.html?bbh=1131",
            "Cache-Control": "no-cache"
        },
        onload: function(response){
          try{
              var nowText = response.responseText.split("x.ckzt = true;")[1].substring(3);
          gameLi.querySelector(".menu").innerHTML = nowText;
          var menuShow = gameLi.getElementsByClassName("menu");
              for (var i = 0; i < menuShow.length; i++) {
                  menuShow[i].style.display="block";
              }
          }catch (e){
              console.log(response.responseText);
          }

        }
    });
}

let Common = {
    /**
         * html文本转换为Document对象 https://jsperf.com/domparser-vs-createelement-innerhtml/3
         * @param {String} text
         * @returns {Document}
         */
    parsetext: function (text) {
        try {
            let doc = document.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = text;
            return doc;
        }
        catch (e) {
            alert('parse error');
        }
    }
}