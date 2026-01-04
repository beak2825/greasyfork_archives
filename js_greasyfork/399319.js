// ==UserScript==
// @name         GBT小组游戏空间游戏全部展开
// @namespace    拂晓神剑
// @version      0.2
// @description  点击显示游戏即可将全部游戏展开，然后Ctrl+F组合键搜索就可以了
// @author       拂晓神剑
// @match        http://gbtgame.ys168.com/
// @require      https://cdn.jsdelivr.net/npm/jquery@2.2.4/dist/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/399319/GBT%E5%B0%8F%E7%BB%84%E6%B8%B8%E6%88%8F%E7%A9%BA%E9%97%B4%E6%B8%B8%E6%88%8F%E5%85%A8%E9%83%A8%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/399319/GBT%E5%B0%8F%E7%BB%84%E6%B8%B8%E6%88%8F%E7%A9%BA%E9%97%B4%E6%B8%B8%E6%88%8F%E5%85%A8%E9%83%A8%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    var button = document.createElement("input"); //创建一个input对象（提示框按钮）
    button.setAttribute("type", "button");
    button.setAttribute("value", "显示游戏");
    button.onclick = function(){ getGame(); };
    button.style.width = "80px";
    button.style.align = "center";
    button.style.marginLeft = "250px";
    button.style.marginBottom = "10px";
    button.style.background = "#b46300";
    button.style.border = "1px solid " + "#b46300";//52
    button.style.color = "white";
    var x = document.getElementById("kjbt");
    x.appendChild(button);
})();

function getGame() {
    var gameUlList = document.getElementById('menuList');
    for (var i = 0; i < gameUlList.childElementCount; i++) {
        var gameLi = gameUlList.getElementsByTagName("li")[i];
        var id = gameLi.id.replace("ml_","");
        var url = "http://cc.ys168.com/f_ht/ajcx/wj.aspx?cz=dq&jsq=0&mlbh=" + id + "&wjpx=1&_dlmc=gbtgame&_dlmm=";
        getList(url, gameLi);
        var menuShow = document.getElementsByClassName("menu");
        menuShow[i].style.display="block";
    }
}

function getList(url, gameLi) {
    GM_xmlhttpRequest({
        method: 'get',
        url: url,
        synchronous: true,
        headers: {
            "Referer": "http://cc.ys168.com/f_ht/ajcx/000ht.html?bbh=1131",
            "Cache-Control": "no-cache"
        },
        onload: function (result) {
            gameLi.getElementsByTagName("ul")[0].innerHTML = result.responseText;
            //console.log(result.responseText);
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