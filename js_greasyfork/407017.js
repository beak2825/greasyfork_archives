// ==UserScript==
// @name         虾米wiki助手
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  帮助X友填充资料，目前仅支持deezer的部分自动填写。
// @author       XMAnon
// @match        *://emumo.xiami.com/wiki/addalbum*
// @connect      deezer.com
// @grant        GM_xmlhttpRequest
// Done:
//    wiki页填入资料来源后，点击虾填，将自动填充专辑名，艺人，发行时间信息，公司
//    目前仅支持deezer页面的地址
// Planned:
//    BandCamp,MusicBrainz,Discogs,Spotify
//    Amazon JP, Download and Select Pic File
//
// @downloadURL https://update.greasyfork.org/scripts/407017/%E8%99%BE%E7%B1%B3wiki%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/407017/%E8%99%BE%E7%B1%B3wiki%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

//虾米填专辑，根据参考资料页，自动填充
(function() {
    'use strict';
    //虾填:在添加专辑第一个页面，根据参考资料页面抓取信息

    var editTime = function (rawTime) {
        var time = rawTime.split(' ');
        var output;
        console.log(time);
        var timeMode = [0,1]
        const charMM = ['January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const numMM = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        if (charMM.indexOf(time[0]) >-1 ) //MM-DD-YYYY(US) e.g  December 18, 1992
        {
            output = time[2] + '-' + numMM[(charMM.indexOf(time[0]))%12] + '-' + time[1].replace(',','');
            //console.log(output);
            return output
        }
        else if (charMM.indexOf(time[1]) >-1 )//DD-MM-YYYY(DE,IT,ES,FR) e.g. 18 December 1992 / 18. December 1992
        {
            output = time[2] + '-' + numMM[(charMM.indexOf(time[1]))%12] + '-' + time[0].replace('.','');
            //console.log((charMM.indexOf(time[1]),(charMM.indexOf(time[1]))%12));
            return output;
        }
        //YYYY/MM/DD (JP) --> YYYY/MM/DD
    }
    var getPage = '';//Text Page cache
    var getInfo = {
        title:'',
        artists:'',//could be multiple aka contributors
        release_date:'',
        label:''};//Json obj 专辑名 专辑艺人 发行时间 发行公司
    var getStatus;
    var getData = function (){
        var wikiUrl = document.getElementById("wiki").value;
        switch(true){
            case (wikiUrl.indexOf('deezer.com') > -1):
                //Deezer Album API: https://developers.deezer.com/api/album#infos e.g.https://api.deezer.com/album/xxxxxxxxx
                wikiUrl = "https://api.deezer.com/album/" + wikiUrl.split('/album/')[1].split('/')[0]//URL reformed to API
                break;
                //case (currentUrl.indexOf('bandcamp') > -1):
            default:
                console.warn('Host not matching');
        }
        var details = {
            method: "GET",
            url: wikiUrl,
            headers: {
                "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
                "Accept": "text/xml"            // If not specified, browser defaults will be used.
            },
            onload: function(response) {
                var responseXML = null;
                // Inject responseXML into existing Object (only appropriate for XML content).
                if (!response.responseXML) {
                    responseXML = new DOMParser()
                        .parseFromString(response.responseText, "text/xml");
                }
                getPage = response.responseText;
                getStatus = response.status;
                var getJSON = JSON.parse(getPage);
                console.log('2 got response');
                console.log('response',response);
                console.log('getPage' ,getPage);
                console.log('getJSON' , getJSON);
                console.log('getInfo', getInfo);
                if (getStatus === 200) {
                    switch(true){
                            //                         case (wikiUrl.indexOf('amazon') > -1):
                            //                             //专辑名 专辑艺人 发行时间 发行公司
                            //                             console.log('1');
                            //                             document.getElementById("title").value = getPage.split('dmusicProductTitle_feature_div')[1].split('</h1>')[0].split('<h1')[1].split('>')[1].replace(/&#039;/g,"'");//'会被转成ascii码，暂时只遇到了这一个问题，所以直接replace了
                            //                             document.getElementById("artist").value = getPage.split('ProductInfoArtistLink')[1].split('</a>')[0].split('>')[1].replace(/ & /g,';').replace(/\n/g,'').replace(' feat. ',';').replace(/, /g,';');//只会feat.一次吧，遇到了再说
                            //                             document.getElementById("publishtime").value = editTime(getPage.split('ProductInfoReleaseDate')[1].split('</span>')[0].split('>')[1].replace(/\n/g,''));
                            //                             document.getElementById("company").value = getPage.split('productDetailsTable')[1].split('<li>')[2].split('</li>')[0].split('</strong> ')[1];
                            //                             console.log('Information aquired!');
                            //                             break;
                            //case (currentUrl.indexOf('bandcamp') > -1):
                        case (wikiUrl.indexOf('deezer.com') > -1):
                            //专辑名 专辑艺人 发行时间 发行公司
                            console.log('3 contents transferred');
                            getInfo.title = getJSON.title;
                            getInfo.release_date = getJSON.release_date;
                            getInfo.label = getJSON.label;
                            getInfo.artists = getJSON.contributors[0].name;
                            if(getJSON.contributors.length > 0){
                                for(let i =1;i<getJSON.contributors.length;i++){
                                    getInfo.artists = getInfo.artists + ';' + getJSON.contributors[i].name;
                                }
                            }
                            document.getElementById("title").value = getInfo.title;//
                            document.getElementById("artist").value = getInfo.artists;//
                            document.getElementById("publishtime").value = getInfo.release_date;
                            document.getElementById("company").value = getInfo.label;
                            console.log('Information aquired!');
                            break;
                            //case (currentUrl.indexOf('bandcamp') > -1):
                        default:
                            console.warn('Host not matching');
                    }
                }
                else {
                    console.log('No data fetched!!');
                }
            }
        }
        GM_xmlhttpRequest(details);
        console.log('1 url fetched');
    }
    var xmBtn0 = document.createElement("input");
        xmBtn0.type = "button";
        xmBtn0.value = "  虾填 :P  ";
        xmBtn0.style.color = "blue";
        xmBtn0.title = "点我，根据资料来源自动填充部分相关信息\n\n已支持:  deezer";
        xmBtn0.onclick = getData;
        var wikinode = document.getElementById("wiki").parentNode;
        wikinode.appendChild(xmBtn0);
    //unsafeWindow.getData = getData;
    //虾抓,读取页面信息，生成曲目列表并存储于剪贴板，详见脚本二

})();