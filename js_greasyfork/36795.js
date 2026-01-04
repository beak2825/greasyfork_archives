// ==UserScript==
// @name         QQ音乐下载
// @namespace    https://y.qq.com/portal/player.html
// @version      0.1
// @description  替换QQ音乐下载地址 直接下载
// @author       KuangKe
// @match        https://y.qq.com/portal/player.html
// @match        http://y.qq.com/portal/player.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36795/QQ%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/36795/QQ%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function ClassKuangKeConsole()
{

}
ClassKuangKeConsole.prototype.log = function(pObj)
/**
 *重写Console.log
 **/
{
  console.log(pObj);
  console.log("KuangKeConsole--------------------------------------------");
};
window.KuangKeConsole = new ClassKuangKeConsole();

function KuangKeMusicDown(pObj){
    var vData = pObj['data']['items'][0];
    var $vA = $("a#music-down-" + vData['songmid']);
    $vA.attr("href", "http://dl.stream.qqmusic.qq.com/" + vData['filename'] + "?vkey=" + vData['vkey'] + "&guid=" + $vA.attr('data-guid') + "&uin=0&fromtag=" + $vA.attr('data-fromtag'));
}
window.KuangKeMusicDown = KuangKeMusicDown;

function KuangKeNull()
{
}

(function() {
    'use strict';

    var vIntervalId = setInterval(function(){
        if(typeof($) != "undefined")
        {
            var vJQAudioBox = $("audio#h5audio_media");
            var vCurrentMusic = vJQAudioBox.attr("src");
            if(vJQAudioBox.length == 0 || '' === vCurrentMusic || typeof(vCurrentMusic) == 'undefined')
            {//没有音乐播放

            }
            else
            {//有音乐播放
                clearInterval(vIntervalId);
                vIntervalId = 0;
                //取参数
                var vQueryString = vCurrentMusic.substr(vCurrentMusic.indexOf("?"));
                var vParam = vQueryString.split("&");
                var vguid = '';
                var vfromtag = '';
                var vIndex = 0;
                for(vIndex = 0;vIndex < vParam.length;vIndex++)
                {
                  if(-1 != vParam[vIndex].indexOf('guid'))
                  {
                     var vtempguid = vParam[vIndex].split('=');
                     vguid = vtempguid[1];
                  }
                  if(-1 != vParam[vIndex].indexOf('fromtag'))
                  {
                     var vtempfromtag = vParam[vIndex].split('=');
                     vfromtag = vtempfromtag[1];
                  }
                }
                var vJQSongList = $("ul#song_box li");
                var vHead = window.document.getElementsByTagName('head')[0];
                var vSongList = JSON.parse(localStorage.y_playlist);
                for(vIndex = 0; vIndex < vSongList.length;vIndex++)
                {
                    var $this = vJQSongList.eq(vIndex);
                    var vMusicHref = $this.find("div.songlist__artist a").attr("href");
                    var vCid = vSongList[vIndex]['albumid'];
                    var vMediaid = vSongList[vIndex]['songmid'];
                    var vFileName = 'C400' + vMediaid;
                    var vScriptSrc = "https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=0&jsonpCallback=KuangKeMusicDown&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&cid=205361747&callback=KuangKeMusicDown&uin=0&songmid=" + vMediaid + "&filename=" + vFileName + ".m4a&guid=" + vguid + "&liu=" + (new Date()).getTime();
                    var vScript = window.document.createElement("script");
                    vScript.setAttribute('src', vScriptSrc);
                    vScript.setAttribute('type', 'text/javascript');
                    vHead.appendChild(vScript);

                    $this.find("a.js_down").replaceWith("\
                        <a id=\"music-down-" + vMediaid + "\" data-guid=\"" + vguid + "\" data-fromtag=\"" + vfromtag + "\" href=\"http://www.hao123.com/\" target=\"_blank\" class=\"list_menu__item\" title=\"下载111\">\
                        <i class=\"list_menu__icon_down\"></i>\
                        <span class=\"icon_txt\">下载1</span>\
                        </a>\
                    ");
                }
            }
        }
    }, 100);
    // Your code here...
})();