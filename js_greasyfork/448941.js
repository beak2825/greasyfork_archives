// ==UserScript==
// @name         PTer Game Torrent Helper
// @author       Beer
// @thanks       开发过程中参考了PTer Torrent Checker、pter-game-uploady脚本基础上修改，感谢原作者！
// @version      0.1.5
// @description  Assist with checking game torrents for PTer.
// @require      https://cdn.staticfile.org/jquery/1.7.1/jquery.min.js
// @match        https://pterclub.com/detailsgame.php?id=*
// @match        https://test.pterclub.com/detailsgame.php?id=*
// @icon         https://pterclub.com/favicon.ico
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/942532-beer
// @downloadURL https://update.greasyfork.org/scripts/448941/PTer%20Game%20Torrent%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/448941/PTer%20Game%20Torrent%20Helper.meta.js
// ==/UserScript==
(() => {

    /* utils */
    var getUrlParam = (key) => {
        const reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        const regArray = location.search.substr(1).match(reg);
        if (regArray) {
            return unescape(regArray[2]);
        }
        return "";
    };

    var getFileExtension = (filename) => {
        let slices = filename.split('.')
        let status = false;
        if(slices.length > 1) {
            for(let i = 0; i < slices.length - 1; i++) {
                if(slices[i]) {
                    status = true;
                }
            }
        }
        if(status) {
            return slices.pop();
        }
        else {
            return "";
        }
    }

    // 获取文件列表
    async function parseFileList(url) {
        let prom = new Promise( function(resolve, reject) {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    resolve(response);
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
        let XMLResponse = await prom;
        let response = XMLResponse.response;
        $(response).find('tr>.filename').each(function () {
            gtt.fileList.push($(this).text());
        });
    }

    function matchName(title,name) {
        let raw_name = name.replaceAll(/[:._–\-&#\$@!！%\^\(+\{\}|\)（）’。？\?'~\*\s]/g, '').replace(/[0-9]{4}$/g, '');
        let pattern = raw_name.replace(/./g,'.*?$&');
        pattern = new RegExp(pattern,'ig');
        return pattern.test(title);
    }

    function getWebInfo(url) {
        return new Promise( (resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                responseType: "json",
                onload: function (response) {
                    resolve(response.responseText);
                },
                onerror: function (error) {
                    resolve('');
                }
            });
        });
    }

    // 获取支持语言
    var language2Code = {
        'Simplified Chinese': 'cn',
        'Chinese Simplified': 'cn',
        'Traditional': 'zh',
        'English': 'en',
        'Japanese': 'jp',
        'German': 'de',
        'French': 'fr',
        'Korean': 'ko',
        'Russian': 'ru',
        '简体中文': 'cn',
        '繁体中文': 'zh',
        '英语': 'en',
        '日语': 'jp',
        '德语': 'de',
        '法语': 'fr',
        '韩语': 'ko',
        '俄语': 'ru'
    };
    async function getSupportedLanguage(key) {
        function parseLanuageString(lanStr) {
            if(lanStr.match(/简体中文|Simplified\ Chinese/i)) {
                gtt.supportedLanguage.push('cn');
            }
            if(lanStr.match(/繁体中文|Traditional\ Chinese/i)) {
                gtt.supportedLanguage.push('zh');
            }
            if(lanStr.match(/英语|English/i)) {
                gtt.supportedLanguage.push('en');
            }
            if(lanStr.match(/日语|Japanese/i)) {
                gtt.supportedLanguage.push('jp');
            }
            if(lanStr.match(/德语|German/i)) {
                gtt.supportedLanguage.push('de');
            }
            if(lanStr.match(/法语|French/i)) {
                gtt.supportedLanguage.push('fr');
            }
            if(lanStr.match(/韩语|Korean/i)) {
                gtt.supportedLanguage.push('ko');
            }
            if(lanStr.match(/俄语|Russian/i)) {
                gtt.supportedLanguage.push('ru');
            }
        }
        let url;
        if (!key.endsWith('/')){
            key += '/'
        }
        if (key.indexOf("store.steampowered.com/") !== -1) {
            gtt.storeLinkValid = true;
            let steamid = /app\/(\d+)/g.exec(key).pop();
            url = "https://store.steampowered.com/api/appdetails?l=schinese&appids="+steamid;
            let steamInfo = await getWebInfo(url);
            if(steamInfo) {
                let languages = JSON.parse(steamInfo)[steamid].data.supported_languages;
                parseLanuageString(languages);
            }
        }
        else if(key.indexOf("epicgames.com") !== -1) {
            gtt.storeLinkValid = true;
            let epicid = /p\/(.+?)\//g.exec(key).pop();
            url ="https://store-content.ak.epicgames.com/api/zh-CN/content/products/"+epicid;
            let EpicInfo = await getWebInfo(url);
            if(EpicInfo) {
                let languageInfoJson = JSON.parse(EpicInfo);
                let languages = languageInfoJson.pages[0].data.requirements.languages[0];
                parseLanuageString(languages);
            }
        }
//        else if(key.indexOf('indienova') !== -1){
//            key = key.substring(0,key.length-1);
//            url = "https://autofill.scatowl.workers.dev/?url="+key;
//        }
        else if(key.indexOf('gog.com') !== -1){
            gtt.storeLinkValid = true;
            key = key.substring(0,key.length-1);
            let gog = await getWebInfo(key)
            if(gog) {
                gog = /(?<=card-product=")\d+(?=")/.exec(gog).pop()
                url = "https://api.gog.com/v2/games/"+gog;
                let GOGInfo = await getWebInfo(url);
                if(GOGInfo) {
                    let languages = JSON.parse(GOGInfo)._embedded.localizations;
                    for(let i = 0; i < languages.length; i++) {
                        let lanCode = languages[i]._embedded.language.code;
                        let lanName = languages[i]._embedded.language.name;
                        if(language2Code[lanName]) {
                            if(gtt.supportedLanguage.indexOf(lanCode) == -1) {
                                gtt.supportedLanguage.push(lanCode);
                            }
                        }
                    }
                }
            }
        }
        return url;
    }

    async function waitInfoLoad() {
        if(gtt.storeLink) {
            await Promise.all([parseFileList(gamePageInfo.filelistUrl), getSupportedLanguage(gtt.storeLink)]);
        }
        else {
            await parseFileList(gamePageInfo.filelistUrl);
        }
    }

    // 游戏页面的元素信息
    var gamePageInfo = {
        url: "https://pterclub.com",
        host: "pterclub.com",
        siteType: "NexusPHP",
        icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="11px" height="11px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">  <image id="image0" width="20" height="20" x="0" y="0"    href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACu1BMVEUAAAD////Cl3f/sZv/88f/NgD/z6j/VAD/AAD/++v/NwCGe33/rGgAAAX/6dgABBr/zqgTL1vxCACLblsAAAwAEzYAAgiZgmoCAwX9AAAFBAb7q3IEAAADAgL217wFAAD//////////////f///f////9IPkDRiEj/mTr/lTr/lTr9mz3InGrZlFv9tXP/3r0AAAAkGh27YRL7gBBsUTKpVBb/exP/j0D/xJIAAAE5KiX1ewT5eQLpfhxhSzbOagv/lU3/7dkAAAArIBqFUSWNUh9+TCOtXxv5fgy0aimFTh6OUh6NWzJROCbneA3/gCf/yp0EAAABAAIAABQAABUNDB2YVhz7hiDCpYoAAAAAABIAAAsTFBmlXRv/fBX/vYQbGB+4ZRb/iCT/+eUBDx6PVSH/fhz/wowAAAAwJyP0jjnTuKXvx6kABUtfOybTcBP/hTD/1K0AAAJONCH8fwaPXCikcUz/unz/rnPpjT/dcg7/cQn/lUf///8AABVqQSL5gQ1iSCy1XhL/eAr+cgr+dgf+fSb/zKQAChyFTyHndw9bQi/TbwvrdgrrfC77rXUUFhumXBrFbhBhQCy8bByuYRWxYhiuYBunXh+OXDSai38AAAAsIB+kXQ9dRzqogmIjHRstKCgOFyoAAyAAAAk9KyPShTM1O0gAAAtWOSP+nksAAwxxRyPtcxv7pmwDAgNALB5zRyZnPh2WYzz82LoEAAABAAEAAAUAAAP/dwD/dAH/cwH/cgDTdRX2fAT+eAD/eAD+dwD4eAP0ewX2egT/eQD/bwb9ewH/egD/dAD/fQD/dgD+fgH/dQD/fAD/cwD+fgPUcRP+cwP/ewDpdgr+ewLzeQX+fAD+eQD9bwP7fQT/fwD/fQH+fQT0ewb/fgHBZxP/fgLYcRD/egfufAv+dgznew3ndwb///9+450wAAAAuXRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkNDA4HASCOq6ipq2FhZxcCh/r8yuT4vjQVtf7+99b3tRYnq8fCyvH70sLBpNv981gIHBsXafLnTRYYH6n1/HOC/NEhafX3Xw+pui4IB5D+zSYdxv7PwHBdj+36egIw3P3c8Pf2/LIaUO773Pfrlx9y+/Tj9e3hyJdGBwOR87dgNikaBw+xuyEkz4ZA6PVdQ6WmqX0YBw0LDAI5k3AAAAABYktHRAH/Ai3eAAAAB3RJTUUH5QQKBzAvYbh7GgAAAUJJREFUGNNjYMAGGBkVFJWgQFlFlZERJMikpq6hqQUGmto6unr6zCwMDAaGRjt37dq9e/euXXuMTUzNzC1YGRksrfbus7bZf+DgocNHbO3sjx5zcGRjcHJ2cXVzP37Uw9PL28fX78RJ/wB2hsCg4JDQsFOnwyMio6JjYs+cjYvnANllkJB47nxSMicDQ0rqhbNp6VwgwYzMi+cuZWXncOfm5V8+X1DIAxTjLSq+cqKktKy8orLq6oHqmlo+oCB/Xf21Aw2NTc0trddv3GxrFwDpFuzovHW0q7vn9p2793r7+oXAfmKYMPH+uUmTp0ydNn3GzFnCYCGR2XMenHs4d978BQsXLRaFhojYkqWPTjxetlycESmYJFasfHLi6SpJZDEGqdVrnj1fu04aWUxGdv2GjZs2b5FDEZTfum37jtkMBAEAezt4kKiqYGgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDQtMTBUMDc6NDg6NDYrMDA6MDBMncp9AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA0LTEwVDA3OjQ4OjQ2KzAwOjAwPcBywQAAAABJRU5ErkJggg==" /></svg>',
        seedDomSelector: '[id^=ktorrent] a[href="report.php?torrent=' + getUrlParam('id') + '"]',
        name: {
            selector: "#top"
        },
        platforms: {
            selector: '#outer>table:eq(0)>tbody>tr:eq(0)>td:eq(1) img'
        },
        description: {
            selector: "#kdescription",
            imgSelector: "#kdescription img[alt='image']",
            storeLinkSelector: "#kdescription .faqlink"
        },
        filelistUrl: "/viewfilelist.php?id=" + getUrlParam('id')
    };

    // 游戏种子信息
    var gtt = {
        $torrentTr: null,
        id: "",
        title: "",
        subtitle: "",
        torrentTitle: "",
        type: "",
        size: "",
        sizeBytes: -1,
        $titleObject: null,
        $subtitleObject: null,
        platforms: [],
        supportedLanguage: [], // 支持的语言，从商店获取 (cn, zh, en, jp, de, fr, ko, ru)
        $description: "",
        $torrentDescription: null,
        tags: {
            gf: false, // 官方
            sub: false, // 中字
            gy: false, // 国语
            bim: false, // 自购
            gg: false, // galgame
            sce: false, // scene
            vs: false, // 可信源
            promotion:'none', // 促销状态
            sticky: false, // 置顶
            checked : false // 已审核
        },
        fileList: [],
        $imgs: null,
        $torrentDescriptionImgs: [],
        storeLink: "",
        storeLinkValid: false
    };

    // 获取种子信息
    var platformList = /Windows|DOS|Linux|Xbox_360|Xbox|Switch|FC_NES|GB_GBC|SFC_SNES|GBA|N64|Virtual_Boy|GameCube|DS|3DS|Wii_WiiU|PS2|PS3|PS4|PS5|PSP|PS_PSOne|PS_Vita|MAC|iOS|MAME|FinalBurn|Kawaks|Nebula|RetroArch|WanderSwan|Android|PC-E|Mega_Drive|Master_System|Game_Gear|Saturn|DreamCast|oculus|GameOther|NeoGeo|NGP_NGPC/g
    gtt.$torrentTr = $(gamePageInfo.seedDomSelector).closest('[id^=ktorrent]').parent();
    gtt.id = getUrlParam('id');
    gtt.$titleObject = $(gamePageInfo.name.selector);
    gtt.title = gtt.$titleObject.text();
    gtt.$subtitleObject = $(gamePageInfo.name.selector).next();
    if(gtt.$subtitleObject.prop('tagName') == 'H1') {
        gtt.subtitle = gtt.$subtitleObject.text();
    }
    else {
        gtt.$subtitleObject = null;
    }
    gtt.torrentTitle = gtt.$torrentTr.find('a[title="点击查看此种子详细资料"]').text();
    gtt.$torrentTr.closest('tr').siblings(':first').find('span:not(.iconimg)').find('img').each(function () {
        console.log($(this));
        let plat = $(this).attr('src').match(platformList)[0]
        if(plat) {
            gtt.platforms.push(plat);
        }
    });
    gtt.$description = $(gamePageInfo.description.selector);
    gtt.$torrentDescription = gtt.$torrentTr.find('#kdescr');
    if(gtt.$torrentTr.find('.chs_tag2-gf').length) {
        gtt.tags.gf = true;
    }
    console.log(gtt.$torrentTr.find('.chs_tag2-sub'));
    if(gtt.$torrentTr.find('.chs_tag2-sub').length) {
        gtt.tags.sub = true;
    }
    if(gtt.$torrentTr.find('.chs_tag2-gy').length) {
        gtt.tags.gy = true;
    }
    if(gtt.$torrentTr.find('.chs_tag2-bim').length) {
        gtt.tags.bim = true;
    }
    if(gtt.$torrentTr.find('.chs_tag2-gg').length) {
        gtt.tags.gg = true;
    }
    if(gtt.$torrentTr.find('.chs_tag2-sce').length) {
        gtt.tags.sce = true;
    }
    if(gtt.$torrentTr.find('.chs_tag2-vs').length) {
        gtt.tags.vs = true;
    }
    if(gtt.$torrentTr.find('.sticky').length) {
        gtt.tags.sticky = true;
    }
    if(gtt.$torrentTr.find('[id^=ckd]').length) {
        gtt.tags.checked = true;
    }
    if(gtt.$torrentTr.find('.pro_30pctdown').length) {
        gtt.tags.promotion = '30%';
    }
    else if(gtt.$torrentTr.find('.pro_50pctdown').length) {
        gtt.tags.promotion = '50%';
    }
    else if(gtt.$torrentTr.find('.pro_free').length) {
        gtt.tags.promotion = 'Free';
    }
    else if(gtt.$torrentTr.find('.pro_free2up').length) {
        gtt.tags.promotion = '2xFree';
    }
    else if(gtt.$torrentTr.find('.pro_2up').length) {
        gtt.tags.promotion = '2x';
    }
    else if(gtt.$torrentTr.find('.pro_50pctdown2up').length) {
        gtt.tags.promotion = '2x50%';
    };
    gtt.$imgs = $(gamePageInfo.description.imgSelector);
    gtt.$torrentDescriptionImgs = gtt.$torrentDescription.find('img');
    let storeLink = $(gamePageInfo.description.storeLinkSelector);
    if(storeLink.length) {
        gtt.storeLink = $(gamePageInfo.description.storeLinkSelector).text();
    }

    /* main tbody and other torrents, get torrent type & size */
    let gameBodyIndex = -1;
    let gameUpdateIndex = 65536;
    let thisTorrentIndex = -1;
    let gameBodyTorrentTr = [];
    let gameBodyTorrentSize = [];
    var gameBodyTorrentAverageSize = -1;
    $('[id^=ktorrent]').closest('tr').siblings().each(function () {
        if(/Game\ \(游戏本体\)/g.test($(this).text())) {
            gameBodyIndex = $(this).index();
        }
        else if(/Update \(更新\)/g.test($(this).text())) {
            gameUpdateIndex = $(this).index();
        }
        else if($.contains(this, gtt.$torrentTr[0] )) {
            thisTorrentIndex = $(this).index();
        }
        else if( ($(this).index() < gameUpdateIndex) && (gameBodyIndex != -1) ) {
            gameBodyTorrentTr.push(this);
        }
    });
    function getTorrentSize(tr) {
        let size = '';
        $(tr).find('div:first span').each(function () {
            let matchList = $(this).text().match(/^\d+(\.\d+)*?\s(TB|GB|MB|KB|B)$/g);
            if(matchList) {
                size = matchList[0];
                return false;
            }
        });
        return size;
    }
    gtt.size = getTorrentSize(gtt.$torrentTr[0]);
    for(let i = 0; i < gameBodyTorrentTr.length; i++) {
        gameBodyTorrentSize.push(getTorrentSize(gameBodyTorrentTr[i]));
    }
    if(gameUpdateIndex == 65536) {
        gtt.type = 'main';
    }
    else if(thisTorrentIndex < gameUpdateIndex) {
        gtt.type = 'main';
    }
    else {
        gtt.type = 'update';
        function string2Bytes(sizeString) {
            let number = parseFloat(sizeString.split(' ')[0]);
            let unit = sizeString.split(' ')[1];
            if(unit == 'TB') {
                number = number * 1024 * 1024 * 1024 * 1024;
            }
            else if(unit == 'GB') {
                number = number * 1024 * 1024 * 1024;
            }
            else if(unit == 'MB') {
                number = number * 1024 * 1024;
            }
            else if(unit == 'KB') {
                number = number * 1024;
            }
            return number;
        }
        function averageSize(sizeList) {
            if(sizeList.length == 0) {
                return -1;
            }
            else {
                let sum = 0;
                for(let i = 0; i < sizeList.length; i++) {
                    sum += string2Bytes(sizeList[i]);
                }
                return sum/sizeList.length;
            }
        }
        gameBodyTorrentAverageSize = averageSize(gameBodyTorrentSize);
        gtt.sizeBytes = string2Bytes(gtt.size);
    }



    // 检查结果样式
    GM_addStyle(`
#checkerContainer {
  background-color: rgb(184, 176, 176);
  width: 940px;
  border: 1px solid;
}
#checkerDiv {

}
.tipRed {
  color: red;
  display: block;
}
.tipGreen {
  color: green;
  display: none;
}
.tipYellow {
  color: yellow;
  display: block;
}
.tipNum {
  color: white;
}
.button {
    background-color: white;
    border: none;
    margin: 4px 2px;
}
`);

    async function check() {
        let checkerContainer = document.createElement('div');
        checkerContainer.id = 'checkerContainer';
        if(gtt.$subtitleObject) {
            gtt.$subtitleObject.after(checkerContainer);
        }
        else {
            gtt.$titleObject.after(checkerContainer);
        }

        let checkerDiv = document.createElement('div');
        checkerDiv.id = 'checkerDiv';
        document.getElementById('checkerContainer').appendChild(checkerDiv);
        let tipRed = 0, tipGreen = 0, tipYellow = 0, tipAll = 0, tipInfo = [];

        // 检查规则
        let scePass = 0;
        let sceTotal = 0;
        // 1 Scene NFO 图片检测: 如果种子标签为Scene且种子简介中没有任何图片，则将日志调整为错误
        if(gtt.tags.sce) {
            if(gtt.$torrentDescriptionImgs.length==0) {
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: '错误: 1.1 Scene NFO 图片检测: 如果种子标签为Scene且种子简介中没有任何图片'});
            }
            else {
                tipGreen += 1;
                scePass += 1;
                console.log('检查通过：1 Scene NFO 图片检测');
            }
            tipAll += 1;
            sceTotal += 1;
        }
        else {
            console.log('跳过检查：1 Scene NFO 图片检测');
        }

        // 2 Scene文件更改检测: 如果种子有 `Scene` 标签且存在以下情况之一，将日志调整为错误 : - 文件数小于等于 3 个; - 文件列表中有 `exe` `iso` 结尾的文件; - 文件列表中没有 `nfo` 结尾的文件
        if(gtt.tags.sce) {
            let status = true;
            if(gtt.fileList.length<4) {
                status = false;
                tipInfo.push({ class:'tipRed', color: 'red', info: '错误: 2.1 Scene文件更改检测: 文件数小于等于 3 个'});
            }
            for(let i = 0; i < gtt.fileList.length; i++) {
                if(getFileExtension(gtt.fileList[i]).match(/EXE|ISO/i)) {
                    status = false;
                    tipInfo.push({ class:'tipRed', color: 'red', info: '错误: 2.2 Scene文件更改检测: 文件列表中有 "exe" "iso" 结尾的文件'});
                    break;
                }
            }
            let hasNfo = false;
            for(let i = 0; i < gtt.fileList.length; i++) {
                if(getFileExtension(gtt.fileList[i]).match(/NFO/i)) {
                    hasNfo = true;
                    break;
                }
            }
            if(!hasNfo) {
                status = false;
                tipInfo.push({ class:'tipRed', color: 'red', info: '错误: 2.3 Scene文件更改检测: 文件列表中没有 "nfo" 结尾的文件'});
            }
            if(status) {
                tipGreen += 1;
                scePass += 1;
                console.log('检查通过：2 Scene文件更改检测');
            }
            else {
                tipRed += 1;
            }
            tipAll += 1;
            sceTotal += 1;
        }
        else {
            console.log('跳过检查：2 Scene文件更改检测');
        }

        // 3 PC游戏配置检测: 如果平台为PC,在简介中未检测到配置相关描述,这调整级别为警告或错误
        let PCGame = false;
        if( (gtt.platforms.indexOf('Windows') != -1) || (gtt.platforms.indexOf('Linux') != -1) || (gtt.platforms.indexOf('MAC') != -1) ) {
            PCGame = true;
        }
        if(PCGame) {
            let description = gtt.$description.text();
            if(!description.match(/配置|requirement|rec/gi)) {
                tipRed += 1;
                tipInfo.push({ class:'tipRed', color: 'red', info: '错误: 3.1 PC游戏配置检测: PC平台游戏未提供配置需求'});
            }
            else if(!description.match(/配置要求|配置需求|System\ requirement/gi)) {
                tipYellow += 1;
                tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告: 3.2 PC游戏配置检测: PC平台游戏配置需求表述不规范'});
            }
            else {
                tipGreen += 1;
                console.log('检查通过：3 PC游戏配置检测');
            }
            tipAll += 1;
        }
        else {
            console.log('跳过检查：3 PC游戏配置检测');
        }

        // 4 游戏中文语言检测
        // 4.1 如果无Steam/GOG/Epic商店链接，警告
        if(!gtt.storeLinkValid) {
            tipYellow += 1;
            tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告：4.1 游戏中文语言检测: 未检测到steam/GOG/Epic商店链接'});
        }
        // 4.2 商店标志的中文支持与标签不一致
        else if(gtt.supportedLanguage.length) {
            if(gtt.tags.sub) {
                if( (gtt.supportedLanguage.indexOf('cn') == -1) && (gtt.supportedLanguage.indexOf('zh') == -1) ) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: '错误: 4.2 游戏中文语言检测：商店标志的中文支持与标签不一致，不应有中字标签'});
                }
                else {
                    tipGreen += 1;
                    console.log('检查通过：4 游戏中文语言检测');
                }
            }
            else {
                if( (gtt.supportedLanguage.indexOf('cn') != -1) || (gtt.supportedLanguage.indexOf('zh') != -1) ) {
                    tipRed += 1;
                    tipInfo.push({ class:'tipRed', color: 'red', info: '错误: 4.2 游戏中文语言检测：商店标志的中文支持与标签不一致，缺少中字标签'});
                }
                else {
                    tipGreen += 1;
                    console.log('检查通过：4 游戏中文语言检测');
                }
            }
        }
        else {
            tipYellow += 1;
            tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告: 4.2 游戏中文语言检测：无法获取到商店中游戏的语言支持情况，请检查网络'});
        }
        tipAll += 1;

        // 5 游戏简介中的图片数量检测
        // 5.1 游戏简介中需要至少4张图片
        if(gtt.$imgs.length < 4) {
            tipRed += 1;
            tipInfo.push({ class:'tipRed', color: 'red', info: '错误: 5.1 游戏简介中的图片数量检测：游戏简介中需要至少4张图片'});
        }
        // 5.2 如果简介开头没有图片（通常为封面），则将日志调整为警告
        else if( (gtt.$description.first().prop('tagName') == 'img') && (gtt.$description.children(':first').find('img').length == 0)) {
            tipYellow += 1;
            tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告：5.2 游戏简介中的图片数量检测: 简介开头没有图片（通常为封面）'});
        }
        else {
            tipGreen += 1;
            console.log('检查通过：5 游戏简介中的图片数量检测');
        }
        tipAll += 1;

        // 6 种子标题检测
        let error = false;
        let warning = false;
        // 6.1 种子标题如果出现中文，则更改日志为警告
        if(/[\u4E00-\u9FA5]+/.test(gtt.torrentTitle)) {
            warning = true;
            tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告：6.1 种子标题检测: 种子标题出现中文'});
        }
        // 6.2 种子标题不能再包含游戏标题，否则将出现日志调整为错误
        if(matchName(gtt.torrentTitle, gtt.title)) {
            error = true;
            tipInfo.push({ class:'tipRed', color: 'red', info: '错误：6.2 种子标题检测: 种子标题不能再包含游戏标题'});
        }
        // 6.3 种子标题里不能出现._等字符，否则将调整为警告，但版本号中的.可以且需要出现
        let titleWoVersion = gtt.torrentTitle.replaceAll(/\d+(\.\d+)+/g, '');
        if( (titleWoVersion.indexOf('\.') != -1) || (titleWoVersion.indexOf('_') != -1) ) {
            warning = true;
            tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告：6.3 种子标题检测: 种子标题里不能出现._等字符'});
        }
        // PC游戏附加规则
        if(PCGame) {
            // 6.4 如果种子标签有可信源且标题中包含ali213或3dm，则检查文件名是否对应包含，否者调整为警告
            if(gtt.tags.vs) {
                function checkFileName(format, name, title, fileList) {
                    if(format.test(title)) {
                        let failCnt = 0;
                        for(let i = 0; i < fileList.length; i++) {
                            if(!format.test(fileList[i])) {
                                failCnt += 1;
                                if( (fileList.length < 2) || (failCnt == 2) ) {
                                    warning = true;
                                    tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告：6.4 种子标题检测: 种子标签有可信源，且标题中包含' + name + '，但超过1个文件文件名不包含'});
                                    break;
                                }
                            }
                        }
                    }
                }
                checkFileName(/ali213/i, 'ali213', gtt.torrentTitle, gtt.fileList);
                checkFileName(/3dm/i, '3dm', gtt.torrentTitle, gtt.fileList);
            }
            // 6.5 如果种子标题没有版本信息，且没有Scene/可信源标签，则将日志调整为错误
            if(!gtt.tags.sce && !gtt.tags.vs) {
                if( !(/v\d+\.?\d/i.test(gtt.torrentTitle) || /Build[. ]?\d+/i.test(gtt.torrentTitle)) ) {
                    error = true;
                    tipInfo.push({ class:'tipRed', color: 'red', info: '错误：6.5 种子标题没有版本信息，且没有Scene/可信源标签'});
                }
            }
        }
        // 6.6 NS游戏附加规则
        let NSGame = false;
        if(gtt.platforms.indexOf('Switch') != -1) {
            NSGame = true;
            let realTorrentName = gtt.torrentTitle.replace(/\s\[(ROM|Western|ISO|RIP|Portable|DRM|Emulator|JPN|Other)\].*$/g, '');
            // 6.6 如果NS平台的游戏有 Scene标签则种子标题 最后应该以 [Format] 结尾，Format可以是 NSP XCI  NSZ
            let formatString = '';
            if(gtt.tags.sce) {
                formatString = realTorrentName.match(/\[(NSP|NSZ|XCI)\]$/g);
                if(!formatString) {
                    error = true;
                    tipInfo.push({ class:'tipRed', color: 'red', info: '错误：6.6 种子标题检测: 有Scene标签的NS平台的游戏，种子标题应该以[NSP]、[XCI]或[NSZ]结尾'});
                }
            }
        // 6.7 如果NS平台的游戏选择没有Scene标签，则种子标题应该以 [TitleID]  [Format] 结尾
            else {
                formatString = realTorrentName.match(/\[[0-9A-Z]+\]\s*\[(NSP|NSZ|XCI)\]$/g);
                if(!formatString) {
                    error = true;
                    tipInfo.push({ class:'tipRed', color: 'red', info: '错误：6.6 种子标题检测: 没有Scene标签的NS平台的游戏，种子标题应该种子标题应该以[TitleID][Format]结尾'});
                }
                if(formatString) {
                    let formats = formatString[0].match(/(NSP|NSZ|XCI)/i);
                    let format = new RegExp("\\." + formats[formats.length-1] + "$", 'i');
                    for(let i = 0; i < gtt.fileList.length; i++) {
                        if(!format.test(gtt.fileList[i])) {
                            warning = true;
                            tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告：6.7 种子标题检测: 有文件名与种子标题[Format]不一致'});
                            break;
                        }
                    }
                }
            }
        }
        if(error) {
            tipRed += 1;
        }
        else if(warning) {
            tipYellow += 1;
        }
        else {
            tipGreen += 1;
            console.log('检查通过：6 种子标题检测');
        }
        tipAll += 1;

        // 7 种子文件内容检测
        warning = false;
        error = false;
        // 有Scene标签的资源只要通过了前面的Scene相关检测，则此处不再检测其内容
        if( !gtt.tags.sce || (scePass != sceTotal)) {
            /*// 废弃：7.1 文件含有.url，txt结尾文件，如没有可信源标签，则将日志调整为错误；如有可信源，则将日志调整为警告
        for(let i = 0; i < gtt.fileList.length; i++) {
            if(/\.(url|txt)$/g.test(gtt.fileList[i])) {
                if(gtt.tags.sce) {
                    warning = true;
                    tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告：7.1 种子文件内容检测: 包含.url或.txt结尾的文件'});
                }
                else {
                    error = true;
                    tipInfo.push({ class:'tipRed', color: 'red', info: '错误：7.1 种子文件内容检测: 包含.url或.txt结尾的文件'});
                }
                break;
            }
        }*/
            // 7.1 如果文件列表里含有 分卷压缩文件且没有Scene或 可信源标签，则将日志调整为 错误
            if(!gtt.tags.vs && !gtt.tags.sce) {
                for(let i = 0; i < gtt.fileList.length; i++) {
                    if(/\.(([r|z](\d+))|(part\d+\.rar))$/g.test(gtt.fileList[i])) {
                        error = true;
                        tipInfo.push({ class:'tipRed', color: 'red', info: '错误：7.1 种子文件内容检测: 包含分卷文件'});
                        break;
                    }
                }
            }
            // 7.2 非PC端游戏，如果在文件列表中发现exe文件，则将日志调整为错误
            if(!PCGame) {
                for(let i = 0; i < gtt.fileList.length; i++) {
                    if(/\.exe$/g.test(gtt.fileList[i])) {
                        error = true;
                        tipInfo.push({ class:'tipRed', color: 'red', info: '错误：7.2 种子文件内容检测: 非PC端游戏包含.exe文件'});
                        break;
                    }
                }
            }
            // NS附加规则
            if(NSGame) {
                // 7.3 NS游戏按照规则一般只能存在一个文件，如果存在多个文件，将日志调整为错误
                if(gtt.fileList.length > 1) {
                    error = true;
                    tipInfo.push({ class:'tipRed', color: 'red', info: '错误：7.3 种子文件内容检测: NS游戏包含多个文件'});
                }
                // 7.4 如果文件后缀不是 NSP XCI NSZ 将日志调整为警告
                else if(!/\.(NSP|XCI|NSZ)/i.test(gtt.fileList[0])) {
                    warning = true;
                    tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告：7.4 种子文件内容检测: NS游戏文件后缀不为NSP、XCI或NSZ'});
                }
            }
            if(error) {
                tipRed += 1;
            }
            else if(warning) {
                tipYellow += 1;
            }
            else {
                tipGreen += 1;
                console.log('检查通过：7 种子文件内容检测');
            }
            tipAll += 1;
        }
        else {
            console.log('跳过检查：7 种子文件内容检测');
        }

        // 8 种子格式检测
        error = false
        warning = false
        // 8.1 如果 种子类型为 dlc 或者 update，且其体积大于 游戏本体 中所有种子体积平均值，则将日志调整为警告
        if(gtt.type == 'update') {
            if(gtt.sizeBytes > gameBodyTorrentAverageSize) {
                warning = true;
                tipInfo.push({ class:'tipYellow', color: 'yellow', info: '警告：8.1 种子格式检测：种子类型为dlc或者update，且其体积大于游戏本体中所有种子体积平均值'});
            }
            // 8.2 对于更新类型的种子，如果其平台为PC (WIN LINUX MAC)，则其格式必须为Other。
            if(PCGame) {
                if(!/\s\[Other\]/g.test(gtt.torrentTitle)) {
                    error = true;
                    tipInfo.push({ class:'tipRed', color: 'red', info: '错误：8.2 种子格式检测: 更新类型的种子，且其平台为PC (WIN LINUX MAC)，但格式不为Other'});
                }
            }
        }
        if(error) {
            tipRed += 1;
        }
        else if(warning) {
            tipYellow += 1;
        }
        else {
            tipGreen += 1;
            console.log('检查通过：8 种子格式检测');
        }
        tipAll += 1;

        // 统计数字点击事件
        function clickRed() {
            let redArr = document.getElementsByClassName('tipRed');
            for (let i = 0; i < redArr.length; i++) {
                if (redArr[i].style.display == 'none') {
                    redArr[i].style.display = 'block';
                } else {
                    redArr[i].style.display = 'none';
                }
            }
        }

        function clickYellow() {
            let yellowArr = document.getElementsByClassName('tipYellow');
            for (let i = 0; i < yellowArr.length; i++) {
                if (yellowArr[i].style.display == 'none') {
                    yellowArr[i].style.display = 'block';
                } else {
                    yellowArr[i].style.display = 'none';
                }
            }
        }

/*        function clickGreen() {
            let greenArr = document.getElementsByClassName('tipGreen');
            for (let i = 0; i < greenArr.length; i++) {
                if (greenArr[i].style.display == 'block') {
                    greenArr[i].style.display = 'none';
                } else {
                    greenArr[i].style.display = 'block';
                }
            }
        }*/

        // 统计数字
        if(tipRed) {
            checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果：<font color="red">错误</font></h1></div>';
            checkerContainer.style.border = 'red';
        }
        else if(tipYellow) {
            checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果：<font color="yellow">警告</font></h1></div>';
            checkerContainer.style.border = 'yellow';
        }
        else {
            checkerContainer.innerHTML = '<div id="checkerClick"><h1 class="tipNum">检查结果：<font color="green">通过</font></h1></div>';
            checkerContainer.style.border = 'green';
        }
        let checkerNum = document.createElement('div');
        checkerNum.id = 'checkerNum';
        document.getElementById('checkerClick').appendChild(checkerNum);
        var checkLog = '<h1 class="tipNum">总计: <span style="color:blue;">' + tipAll +
            '</span> &nbsp; <span id="clickRed" style="cursor:pointer;">错误: <span style="color:red;">' + tipRed +
            '</span></span> &nbsp; <span id="clickYellow" style="cursor:pointer;">警告: <span style="color:yellow;">' + tipYellow +
            '</span></span> &nbsp; <span id="clickGreen" style="cursor:pointer;">通过: <span style="color:green;">' + tipGreen + '</span></span></h1>';
        for(let i = 0; i < tipInfo.length; i++) {
            checkLog += '<h1 class="' + tipInfo[i].class + '"><font  color="' + tipInfo[i].color + '">' + tipInfo[i].info + '</font></h1>';
        }
        checkerNum.innerHTML = checkLog;
        document.getElementById('clickRed').onclick = clickRed;
        document.getElementById('clickYellow').onclick = clickYellow;
        //document.getElementById('clickGreen').onclick = clickGreen;
    }
    async function checkGo() {
        await waitInfoLoad();
        console.log(gtt);
        await check();
    }
    checkGo();
})();
