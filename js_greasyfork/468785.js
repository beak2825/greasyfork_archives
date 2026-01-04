// ==UserScript==
// @name         zz123歌曲下载
// @namespace    Aice.Fu_gwTools
// @version      0.2
// @description  zz123歌曲一键下载
// @author       Aice.Fu
// @match        https://zz123.com/
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/468785/zz123%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/468785/zz123%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {

    var currPlay =  document.getElementsByClassName('player-download-btn link-download-app')[0];
    var musicName = document.getElementsByClassName('track-song color-link-content-primary')[0].innerText;
    var singer = document.getElementsByClassName('track-singer color-link-content-secondary')[0].innerText;
    if (currPlay!== null && typeof(currPlay) === 'object'){
        currPlay.id="downLoad_F";
        var loginFrom = document.getElementById("login-modal"); //去除登录窗口弹窗
        loginFrom.parentNode.removeChild(loginFrom);
        currPlay.addEventListener('click', function() {      //下载按钮功能替换
            var dataId = currPlay.getAttribute("data-id");  //得到歌曲id
            var xhr = new XMLHttpRequest();
            //console.log('https://zz123.com/play/'+dataId+'.htm');
            xhr.open('GET','https://zz123.com/search/?key='+musicName+singer);
            xhr.send();
            xhr.onreadystatechange = function(){
                if (xhr.readyState === 4 && xhr.status === 200)
                {   console.log(dataId);
                 var hRex = null;
                 hRex = /pageSongArr=(\[.*\])/.exec(xhr.responseText);
                 var playJs = JSON.parse(hRex[1]);
                 for (var i = 0; i < playJs.length; i++) {  //获取歌曲地址
                     if (playJs[i].id == dataId) {
                         //                             var pA = document.createElement("a");
                         //                             pA.href =  playJs[i].mp3;
                         //                             //pA.download =  musicName+'-'+ singer;
                         //                             pA.target ="_blank";
                         //                             pA.click();
                         console.log(playJs[i].mp3);
                         downlad(playJs[i].mp3,musicName+'-'+ singer);
                     }
                 }
                }
            };
        });
    }

    function downlad (urls,fileName){
        GM_xmlhttpRequest({
            url: urls ,
            method: 'GET',
            timeout: 10000,
            responseType : 'blob',
            headers: {
                'Content-Type':'blob'
            },
            onload: function(responseDetails)
            {
                const url = window.URL.createObjectURL(responseDetails.response);
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank'
                a.download = fileName;
                a.click();
            }
        });
    }


})();