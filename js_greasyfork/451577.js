// ==UserScript==
// @name         Link Copy for Jdownloader
// @version      1.01
// @description  링크 복사
// @author       DandyClubs
// @include      /naughtyblog\.org/
// @include      /maxjav\.com/
// @include      /(8kcosplay\.com|blogjav\.net|thotsgirls\.com)/
// @include      /top-modelz\.org/
// @include      /wetholefans\.com/
// @include      /pornchil\.com\/.*/
// @include      /pornrips\.cc/
// @include      /javpink\.com/
// @include      /siteripbb\.org/
// @include      /javfree\.me/
// @include      /pornobunny\.org/
// @include      /adult-porno\.org/
// @include      /pornrip\.cc/
// @include      /fhdporn\.video/
// @include      /asianscan\.biz/
// @include      /sharepornlink\.com\/.*/
// @include      /javarchive\.com/
// @include      /0xxx\.ws/
// @include      /hpjav\.tv/
// @include      /kbjme\.com\/\d+/
// @include      /av18plus\.com/
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://greasyfork.org/scripts/451572-rootdomain/code/RootDomain.js?version=1095109
// @require      https://greasyfork.org/scripts/451573-copy-link-common-library/code/Copy%20Link%20Common%20Library.js?version=1095463
// @require      https://greasyfork.org/scripts/451574-key-press/code/Key%20Press.js?version=1095111
// @grant	 GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        window.close
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @noframes
// @license      MIT
// @namespace https://greasyfork.org/users/15621
// @downloadURL https://update.greasyfork.org/scripts/451577/Link%20Copy%20for%20Jdownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/451577/Link%20Copy%20for%20Jdownloader.meta.js
// ==/UserScript==


(function() { var css = document.createElement('link'); css.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css'; css.rel = 'stylesheet'; css.type = 'text/css'; document.getElementsByTagName('head')[0].appendChild(css); })();

GM_addStyle (`
@import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@600&family=Noto+Sans+KR:wght@600&family=Noto+Sans:wght@600&display=swap');

.CloseIcon, .CopyIcon, .Minus, .GetTitle {
    text-align: center;
    cursor: pointer;
    color: dodgerblue !important;
    background-color:transparent !important;
    font-style: initial !important;
}
.IconSet {
    word-spacing: .5rem;
    white-space : nowrap;
    background-color:transparent !important;
}

.CopyNotice {
    font-family: 'Nanum Gothic', 'M PLUS Rounded 1c', 'Noto Sans', sans-serif !important;
    margin-left: auto;
    margin-right: auto;
    border-radius: 4px;
    color: white !important;
    background: rgba(255, 110, 0, 0.75) !important;
    padding: .25em 1em;
    white-space: pre;
 	text-shadow: initial !important;
    text-align: left;
    line-height: 1.25em;
	font-weight: initial !important;
	font-style: initial !important;
    display: -webkit-box;
    -webkit-line-clamp: 15;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-transition: height 0.3s ease-in-out;
    -o-transition: height 0.3s ease-in-out;
    transition: height 0.3s ease-in-out;

}
.CopyNotice:not(.active) {
  display: none;
}
.CenterBox {
    right: 50%;
    left: auto;
    top: 1px;
    margin: 0 auto;
    max-width: max-content;
    position: fixed !important;
    word-spacing: .5rem;
    padding: .25em;
    font-style: initial !important;
    text-align: center;
    color: dodgerblue !important;
    background-color:transparent !important;
}
.ToTop {
    font-style: initial !important;
    text-align: center;
    cursor: pointer;
    padding: .25em !important;
    border-radius: .25em !important;
    -webkit-box-sizing: border-box !important;
    box-sizing: border-box !important;
    background-color: rgba(255,255,255,0.5) !important;
}
.State {
    display: inline-block;
    font-weight: bold;
    text-align: right;
    vertical-align: middle;
    font-family: 'Noto Sans', sans-serif !important;
    background-color:transparent !important;
    font-style: italic !important;
    width: 5ch;
}

.CopyButton, .ClearButton {
    font-style: initial !important;
    background-color:transparent !important;
    word-spacing: .5rem;
    cursor: pointer;
}
`);

var CopyLinks = []
var AllCopyLinks = []
var TmpLinksDB = []
var CopyLinksBackup, MakeIconTimer
const PageURL = window.location !== window.parent.location ? document.referrer : document.location.href;
const RootDomain = extractRootDomain(PageURL)
//console.log('RootDomain: ', RootDomain)

var RootDomainDB = JSON.parse(GM_getValue(RootDomain, "[]"))

//console.log(RootDomainDB)

var GetState, searchDB
GetState = RootDomainDB
//console.log(GetState)

var MakerCfg = false
var CfgReleaseDate = false
var Maker = '', ReleaseDate = ''

var GetDPI, DefaultFontSize
var Target, DownloadArea, CopyTitle, CopyOffSetArea, InfoArea, Resolution = '', TitleLast = '', Series ='', Title, ID = '', TitleID, CopyTitleTmp, InfoTitleTmp, CoverImage, MatchWebRegExp, Gallery
var UrlTitle = ''
const SkipFilter = new RegExp('keep2share\.cc\/pr\/|demosaic|upgrade|javascript|SKIP|pixhost\.to\/gallery\/|imgchili\.net\/show|#$|^\/|^(?=.*' + window.location.origin + ')(?!.*\\?site).*$', 'i')
//console.log(SkipFilter)

const SkipClassNames = ['adead_link', 'autohyperlink', 'social-icon']
const JapaneseChar = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/g
const SearchID = /([a-zA-Z]{2,11}-?\d{2,6}[a-zA-Z]?|\d{2,4}[a-zA-Z]{2,7}-?\d{3,6}[a-zA-Z]?|[a-zA-Z]{1,2}-?\d{2}-?\d{2}|[a-zA-Z]{2,7}-?[a-zA-Z]{1,2}\d{2})(.*)/
const SearchFC2ID = /(^FC2.+\d{6})(.*)/
const SearchIDRegExp = /^(\[\s?)?(?=([a-zA-Z]{2,11}-?\d{2,6}[a-zA-Z]?|\d{2,4}[a-zA-Z]{2,7}-?\d{3,6}[a-zA-Z]?|[a-zA-Z]{1,2}-?\d{2}-?\d{2}|[a-zA-Z]{2,7}-?[a-zA-Z]{1,2}\d{2}))(?!(C_\d+|file\d+))(.*)$/
const K2SRegExp = /(.*k2s\.cc\/file\/)(.*\/?)/

async function Start() {
    GetDPI = window.devicePixelRatio
    DefaultFontSize = getDefaultFontSize()
    //console.log('GetDPI: ', GetDPI, 'DefaultFontSize: ', DefaultFontSize)

    document.querySelector("body").insertAdjacentHTML('afterbegin', '<div class="CenterBox" style="display: none"></>')
    document.querySelector("div.CenterBox").insertAdjacentHTML('beforeend', '<i class="ToTop fa-solid fa-circle-chevron-up"></>')
    document.querySelector("div.CenterBox").insertAdjacentHTML('beforeend', '&nbsp;<i class="ClearButton far fa-minus-square"></>')
    document.querySelector("div.CenterBox").insertAdjacentHTML('beforeend', '&nbsp;<i class="CopyButton fas fa-paste"></>')
    document.querySelector("div.CenterBox").insertAdjacentHTML('beforeend', '<i class="State"></>')
    document.querySelector(".ToTop").onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' })
    console.log('Link Copy Start!')
    let CneterBoxFontSize = Number(((1/(GetDPI/1.5))*(16/DefaultFontSize)).toFixed(2)) + 'rem'
    let CenterBoxZIndex = getMaxZIndex() + 1
    let StateFontSize = Number(((1/(GetDPI/1.5))*0.65*(16/DefaultFontSize)).toFixed(2)) + 'rem'
    let StateLineHeight = Number(((1/(GetDPI/1.5))*(16/DefaultFontSize)).toFixed(2)) + 'rem'

    document.querySelector('.CenterBox').style.cssText = `font-size: ${CneterBoxFontSize}; z-index: ${CenterBoxZIndex}; display: block;`
    document.querySelector('.State').style.cssText = `font-size: ${StateFontSize}; line-height: ${StateLineHeight}`
    document.querySelector('.State').textContent = ' ' + GetState.length

    if(/naughtyblog\.org\/.+/.test(PageURL)){
        CopyOffSetArea = document.querySelector('.post-title.entry-title')
        CopyTitle = CopyOffSetArea.innerText

        DownloadArea = document.querySelectorAll('div#download, div#downloadhidden')
        CoverImage = document.querySelector('div.post-content-single p a') ? document.querySelector('div.post-content-single p a').href : ''
        let MatchCast, InfoAreaCast, Title, Cast, SearchCast, SearchTitle, SearchWeb, FirstMatchCast, FirstMatchWeb, InfoCast, SearchWebPoint, SearchCastPoint, Released, ReleasedEn, Episode
        //CopyTitle에서 MatchWeb 찾기
        let MatchWebPoint = CopyTitle.search(/\s-\s/)
        console.log('MatchWebPoint: ' + MatchWebPoint)
        let MatchWeb = MatchWebPoint !== -1 ? CopyTitle.substr(0, MatchWebPoint).replace(/\s/g, '') : CopyTitle
        MatchWebRegExp = new RegExp(MatchWeb.replaceAll("'", ""), 'i')
        console.log('MatchWeb: ' + MatchWeb)

        InfoArea = document.querySelector('div.post-content-single').innerText.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, '\n').replace(/^(\s?(UPDATED|EARLY LEAK)\s?)/gim,'').split(/\n/)
        InfoArea = InfoArea.filter(function(e){return e})
        InfoArea = InfoArea.filter((element) => !/^(http|Size|Download|Watch online|Spare links)/i.test(element));
        console.log('InfoArea: ', InfoArea)
        InfoAreaCast = document.querySelector('div.post-content-single p strong').innerText.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, '\n').replace(/^(\s?(UPDATED|EARLY LEAK)\s?)/gim,'').split(/\n/)
        InfoAreaCast = InfoAreaCast.filter(function(e){return e})
        console.log(InfoAreaCast)

        if(CopyTitle.match(/Updates/i)){
            CoverImage = ''
            MutilSubTitle(MatchWeb, MatchWebPoint, InfoAreaCast, DownloadArea)
        }
        else if(!CopyTitle.match(/Updates/i) && InfoAreaCast.length > 1 ){
            console.log('Mutil SubTitle....')
            MutilSubTitle(MatchWeb, MatchWebPoint, InfoAreaCast, DownloadArea)
        }

        else if(!CopyTitle.match(/SITERIP|OnlyFans|Collection/i)){
            //CopyTitle에서 배우명 찾기
            MatchCast = MatchWebPoint !== -1 ? CopyTitle.substr(MatchWebPoint + 3).split(/&|\s|,|:/) : CopyTitle.match(/.+/)
            MatchCast = MatchCast ? MatchCast.filter(function(e){return e}) : []
            MatchCast = MatchCast ? MatchCast.filter((entry) => isNaN(entry)) : []//숫자 및 단일글자 제거
            MatchCast = MatchCast ? MatchCast.filter((entry) => entry.length > 1) : []//숫자 및 단일글자 제거
            console.log('MatchCast: ' + MatchCast)
            let MatchTitle = MatchWebPoint !== -1 ? CopyTitle.substr(MatchWebPoint+3) : CopyTitle
            console.log('MatchTitle: ' + MatchTitle)
            for (let i = 0; i < InfoArea.length; i++) {
                if(!Cast){
                    Cast = InfoArea[i].match(/Cast\s?:/) ? InfoArea[i].match(/Cast\s?:(.+)/).pop() : ''
                    console.log('Cast: ', Cast)
                }
                //배우명 작품타이틀 찾기
                if(!FirstMatchCast && InfoArea[i].match(/-/g) && !Cast){
                    //배우명 찾기
                    SearchCastPoint = InfoArea[i].search(/\s-\s/)
                    console.log('SearchCastPoint: ' + SearchCastPoint)
                    SearchCast = SearchCastPoint !== -1 ? InfoArea[i].substr(0, SearchCastPoint).split(/\&|\s|,/) : new Array(InfoArea[i])
                    SearchCast = SearchCast ? SearchCast.filter(function(e){return e}) : ''//빈 배열값 제거
                    SearchCast = SearchCast ? SearchCast.filter((entry) => isNaN(entry)) : ''//숫자 제거
                    SearchCast = SearchCast ? SearchCast.filter((entry) => entry.length > 1) : ''//단일글자 제거
                    console.log('SearchCast: ' + SearchCast)
                    MatchCast = MatchCast ? MatchCast.find((val) => {
                        console.log('SearchingCast: ' + val)
                        return SearchCast.includes(val)
                    })
                    :''
                    console.log('MatchCast: ' + MatchCast)
                    //배우명 없는 경우 작품 타이틀로 찾기
                    if(!MatchCast && !SearchTitle){
                        SearchTitle = SearchCastPoint !== -1 ? InfoArea[i].substr(SearchCastPoint + 3) : InfoArea[i]
                        SearchTitle = InfoArea[i].toLowerCase().includes(SearchTitle.toLowerCase()) ? InfoArea[i] : ''
                        console.log('SearchTitle: ' + SearchTitle)
                    }
                    FirstMatchCast = MatchCast ? MatchCast : ''
                    SearchTitle = SearchTitle ? SearchTitle : ''
                    InfoCast = MatchCast && !InfoCast ? InfoArea[i] : ''
                    console.log('FirstMatchCast: ' + FirstMatchCast)
                    console.log('InfoCast: ' + InfoCast)
                }
                //MatchWeb 찾기
                if(!InfoArea[i].match(/^http/) && !FirstMatchWeb){
                    SearchWebPoint = InfoArea[i].match(/(.+)(\.\d+\.\d+.\d+\.)(.+)/) ? InfoArea[i].match(/(.+)(\.\d+\.\d+.\d+\.)(.+)/)
                    : InfoArea[i].match(/(.+)(\.\d{4}\.)(.+)/) ? InfoArea[i].match(/(.+)(\.\d{4}\.)(.+)/) : ''
                    console.log('SearchWebPoint:', InfoArea[i], InfoArea[i].match(/(.+)(\.\d+\.\d+.\d+\.)(.+)/), InfoArea[i].match(/(.+)(\.\d{4}\.)(.+)/))
                    if(SearchWebPoint){
                        SearchWeb = SearchWebPoint[1] && MatchWeb.toLowerCase().match(SearchWebPoint[1].toLowerCase()) ? MatchWeb
                        : (MatchWeb.replace(/\!|'/g, '').toLowerCase()).match(SearchWebPoint[1].toLowerCase()) ? MatchWeb
                        : (MatchWeb.replace(/-|\s|\./g, '').toLowerCase()).match(SearchWebPoint[1].toLowerCase()) ? SearchWebPoint[1]
                        : (MatchWeb.toLowerCase()).match(SearchWebPoint[1].replace(/-|\s/g, '').toLowerCase()) ? SearchWebPoint[1]
                        : MatchWeb + '(' + SearchWebPoint[1] + ')'
                        console.log('SearchWeb: ' + SearchWeb)
                        FirstMatchWeb = SearchWeb ? SearchWeb
                        : ''
                        console.log('FirstMatchWeb 1st: ' + FirstMatchWeb)
                    }
                    else{
                        FirstMatchWeb = CopyTitle === InfoArea[i] ? MatchWeb
                        : InfoArea[i].match(MatchWeb) ? InfoArea[i].match(MatchWeb) : ''
                        var EpisodeTmp = InfoArea[i].match(/^(?!.*S\d+)(?=.*E\d{2,5}).*$/) ? '.' + InfoArea[i].match(/E\d{2,5}/) : ''
                        InfoCast = InfoCast && EpisodeTmp && InfoCast.match(/^(?!.*S\d+)(?=.*E\d{2,5}).*$/) ? InfoCast.replace(/-?\s?E\d{2,5}$/, '').trim() : InfoCast
                        console.log('FirstMatchWeb 2nd: ', FirstMatchWeb, '\nEpisode: ', Episode)
                    }
                }
                if(!Released){
                    Released = InfoArea[i].match(/(.+)(\.\d+\.\d+.\d+\.)(.+)/) ? InfoArea[i].match(/(\.\d+\.\d+.\d+\.)/).pop() : ''
                    console.log('Released: ', Released)
                }
                if(!Episode){
                    Episode = InfoArea[i].match(/^(?!.*S\d+)(?=.*E\d{2,5}).*$/) ? '.' + InfoArea[i].match(/E\d{2,5}/)
                    : EpisodeTmp ? EpisodeTmp
                    : ''
                }

                if(!ReleasedEn){
                    ReleasedEn = InfoArea[i].match(/Released:(.+)/i) ? InfoArea[i].match(/Released:(.+)/i).pop() : ''
                    console.log('ReleasedEn: ', ReleasedEn)
                    ReleasedEn = ReleasedEn ? '.' + ReleasedEn.trim().replace(/,/g, '').replace(/\s/g, '.') + '.' : ''
                    ReleasedEn = ReleasedEn && ReleasedEn.split('.')[1].match(/^[a-zA-Z]/) ? ReleasedEn.replace(ReleasedEn.split('.')[1], getNumericMonth(ReleasedEn.split('.')[1])) : ''
                }

                if(FirstMatchCast && FirstMatchWeb && Released){
                    CopyTitle = Released && InfoCast ? FirstMatchWeb + Episode + Released + InfoCast
                    : Released && !InfoCast && MatchTitle ? FirstMatchWeb + Episode + Released + MatchTitle
                    : FirstMatchWeb + Episode + Released + InfoCast
                    console.log('All Match: ' + CopyTitle)
                    break
                }
                else if(FirstMatchCast && FirstMatchWeb && ReleasedEn){
                    CopyTitle = InfoCast ? FirstMatchWeb + Episode + ReleasedEn + InfoCast
                    : !InfoCast && FirstMatchCast ? FirstMatchWeb + Episode + ReleasedEn + FirstMatchCast
                    : FirstMatchWeb + Episode + ReleasedEn + (InfoCast ? InfoCast : FirstMatchCast)
                    console.log('Some Match: ' + CopyTitle)
                }
                else if(!FirstMatchCast && !FirstMatchWeb && Released){
                    if(CopyTitle === InfoArea[i]){
                        console.log('Same Title: ' + CopyTitle, InfoArea[i])
                    }
                }
                else if(MatchCast == MatchTitle && FirstMatchWeb && Released){
                    InfoCast = InfoCast ? InfoCast : Cast ? '(' + Cast.trim() + ')' : ''
                    CopyTitle = FirstMatchWeb + Episode + Released + InfoCast
                    console.log('MatchCast == MatchTitle: ' + CopyTitle)
                }
                else if(!FirstMatchCast && MatchWeb && FirstMatchWeb && Released && MatchCast){
                    CopyTitle = MatchWeb + "(" + FirstMatchWeb + ")" + Episode + Released + MatchCast.join(' ')
                    console.log('MatchWeb VS FirstMatchWeb: ' + CopyTitle, InfoArea[i])
                }
                else if(i == InfoArea.length -1){
                    console.log( MatchWeb, SearchWeb, Released, ReleasedEn, FirstMatchCast, Episode, InfoCast )
                    InfoCast = InfoCast ? InfoCast : Cast ? '(' + Cast.trim() + ')' : ''
                    console.log('InfoCast: ', InfoCast)
                    Released = Released ? Released : ReleasedEn ? ReleasedEn : ''
                    CopyTitle = MatchWeb && Released && SearchWebPoint && InfoCast ? MatchWeb + '(' + SearchWebPoint[1] + ')' + Episode + Released + InfoCast
                    : MatchWeb && Released && InfoCast ? MatchWeb + Episode + Released + InfoCast
                    : MatchWeb && Released && FirstMatchCast ? MatchWeb + Episode + Released + FirstMatchCast
                    : SearchWeb && !Released && SearchWebPoint && SearchWeb&& InfoCast ? SearchWeb + SearchWebPoint[2] + Episode + InfoCast
                    : MatchWeb && Episode && MatchTitle && InfoCast ? MatchWeb + Episode + MatchTitle + InfoCast
                    : MatchWeb && SearchTitle && !InfoCast && Released ? MatchWeb + Episode + Released + SearchTitle
                    : MatchWeb && MatchTitle && !InfoCast && Released ? MatchWeb + Episode + Released + MatchTitle
                    : MatchWeb && Released && InfoCast ? MatchWeb + Episode + Released + InfoCast
                    : SearchWeb && InfoCast ? SearchWeb + Episode + InfoCast
                    : CopyTitle + InfoCast
                    console.log('End : ', CopyTitle)
                }
            }

            CopyTitle = CopyTitle.replace(/(S\d+):(E\d+)/i, '$1$2')
            CopyTitle = byteLengthOf(CopyTitle, 250)
            CopyTitle = FilenameConvert(CopyTitle) + Resolution

            console.log('CopyTitle: ' + CopyTitle)
            let LinkDB = []
            for (let i = 0; i < DownloadArea.length; i++) {
                let Links = MatchRegex(DownloadArea[i], new RegExp('1080p', 'i'), 'href')
                console.log('1080p: ', Links)
                if(Links?.length > 0){
                    LinkDB.push(...Links)
                }
                else if(!Links?.length){
                    Links = MatchRegex(DownloadArea[i], new RegExp('2160p', 'i'), 'href')
                    console.log('2160p: ', Links)
                    if(Links?.length > 0){
                        LinkDB.push(...Links)
                    }
                    else if(!Links?.length){
                        Links = MatchRegex(DownloadArea[i], new RegExp('720p', 'i'), 'href')
                        console.log('720p: ', Links)
                        if(Links?.length > 0){
                            LinkDB.push(...Links)
                        }
                        else if(!Links?.length){
                            Links = MatchRegex(DownloadArea[i], new RegExp(MatchWeb + '|' + MatchCast, 'i'), 'href')
                            console.log('Links: ', Links)
                            LinkDB.push(...Links)
                        }
                    }
                }
            }
            LinkDB = LinkDB?.length > 0 ? LinkDB.map((entry) => entry.outerHTML) : ''
            console.log('LinkDB: ', LinkDB)
            let container = document.createElement("div")

            LinkDB.forEach((el, i) => {
                const fragment = document.createRange().createContextualFragment(el);
                console.log(fragment.children[0]);
                container.appendChild(fragment.children[0]);
            })
            container.classList.add("DownloadArea")
            document.body.appendChild(container);
            DownloadArea = document.querySelectorAll('div.DownloadArea')
            console.log('DownloadArea: ', DownloadArea)
        }
        if(!document.querySelector('.GetTitle')){
            document.querySelector("div#main-content.main-content-single div div.post-content-single p strong").insertAdjacentHTML('afterend', '&nbsp;&nbsp;<i class="GetTitle fas fa-paste"></>')
        }
        document.querySelector('.GetTitle').addEventListener("click", async function(event){
            event.preventDefault()
            event.target.style.setProperty('color', 'Orange', 'important')
            updateClipboard(CopyTitle)
        })
    }

    else if(/maxjav.com\/\d+/.test(PageURL) && window.top === window.self){
        CopyOffSetArea = document.querySelector('div#content > div > .title')
        CopyTitle = CopyOffSetArea.innerText
        CopyTitle = CopyTitle.match(/\[?.*Subtitle\]?(.+)/) ? CopyTitle.match(/\[.+Subtitle\](.+)/).pop() : CopyTitle
        CopyTitle = CopyTitle.replace(/amp;/g, '').replace(/(\s)?\/(\s)?/g, '／').replace(/(-|–)\sHD/, '').replace(/amp;|\(\s?ブルーレイ版\s?\)|\(ブルーレイディスク版\)|:/g, '').trim()
        console.log(CopyTitle)
        if(!CopyTitle.match(/^Collection/)){
            InfoArea = document.querySelector('div#content > div > .entry > p').innerText.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, '\n').split(/\n\n|\n/)
            InfoArea = InfoArea.filter(function(e){return e})//빈 배열값 제거
            console.log(InfoArea)
            //Series = InfoArea.find(InfoSearch => InfoSearch.match(/シリーズ：?.*/)) ? InfoArea.find(InfoSearch => InfoSearch.match(/シリーズ：?.*/)).replace(/シリーズ：?/, '').trim() : ''
            for (let i = 0; i < InfoArea.length; i++) {
                if(!Title){
                    console.log(CopyTitle.match(SearchID))
                    CopyTitleTmp = CopyTitle.match(SearchIDRegExp) ? CopyTitle.match(SearchID).pop().trim() : ''
                    InfoTitleTmp = InfoArea[i].match(SearchIDRegExp) ? InfoArea[i].match(SearchID).pop().trim() : ''
                    console.log('CopyTitleTmp: ', CopyTitleTmp, '\nInfoTitleTmp: ', InfoTitleTmp)
                    //CopyTitleTmp.match(/[\u3040-\u309f\u30a0-\u30ff]/g) 일본어 히라가나 카타가나 찾기
                    if(CopyTitleTmp && InfoTitleTmp){
                        Title = CopyTitleTmp.toLowerCase() === InfoTitleTmp.toLowerCase() ? CopyTitleTmp
                        : (CopyTitleTmp.match(JapaneseChar) || []).length >= (InfoArea[i].match(JapaneseChar) || []).length ? CopyTitleTmp
                        : (CopyTitleTmp.match(JapaneseChar) || []).length < (InfoArea[i].match(JapaneseChar) || []).length ? InfoTitleTmp
                        : CopyTitleTmp
                        Title = Title.trim() + ' '
                        console.log('Title 1st: ' + Title)
                    }
                    else{
                        Title = CopyTitleTmp && (CopyTitle.match(JapaneseChar) || []).length >= (InfoArea[i].match(JapaneseChar) || []).length ? CopyTitleTmp
                        : InfoTitleTmp && InfoTitleTmp.match(JapaneseChar) && (CopyTitle.match(JapaneseChar) || []).length <= (InfoArea[i].match(JapaneseChar) || []).length ? InfoTitleTmp
                        : (CopyTitle.match(JapaneseChar) || []).length < (InfoArea[i].match(JapaneseChar) || []).length ? InfoArea[i]
                        : CopyTitle.match(JapaneseChar) ? CopyTitle
                        : InfoArea[i].match(JapaneseChar) ? InfoArea[i]
                        : CopyTitle

                        Title = Title.trim() + ' '
                        Title = mbConvertKana(Title, 'rans')
                        console.log('Title 2nd: ' + Title)
                    }
                }
                if(!ID){
                    console.log(CopyTitle.match(SearchID), InfoArea[i].match(SearchID))
                    let TitleID = CopyTitle.match(SearchIDRegExp) ? CopyTitle.match(SearchID)[1] : CopyTitle.match(SearchFC2ID) ? CopyTitle.match(SearchFC2ID)[1] : ''
                    let InfoID = InfoArea[i].match(SearchIDRegExp) ? InfoArea[i].match(SearchID)[1] : InfoArea[i].match(SearchFC2ID) ? InfoArea[i].match(SearchFC2ID)[1] : ''
                    if(TitleID && InfoID && TitleID.replace(/-/g, '').trim().toLowerCase() === InfoID.replace(/-/g, '').trim().toLowerCase()){
                        ID = TitleID.match(/-/g) && InfoID.match(/-/g) ? TitleID
                        : TitleID.match(/-/g) ? TitleID
                        : InfoID.match(/-/g) ? InfoID.match(/-/g)
                        : TitleID
                    }
                    else{
                        ID = TitleID ? TitleID : InfoID
                    }
                    console.log('ID: ' + ID)
                    if(ID){
                        ID = ID.trim() + ' '
                    }
                }
                if(CfgReleaseDate && !ReleaseDate && InfoArea[i].match(/Release Date:/)){
                    ReleaseDate = InfoArea[i].match(/Release Date:(.+)/)[1].replace(/\//g, '-').trim()
                }
                if(MakerCfg && !Maker && InfoArea[i].match(/(Maker|Studio)\s?:(.+)/)){
                    Maker = InfoArea[i].match(/(Maker|Studio)\s?:(.+)/)[2].replace(/(\s)?\/(\s)?/g, '／').trim()
                }
                if(Title && ID && ReleaseDate){
                    break
                }
            }
            Maker = Maker ? '[' + Maker + '] ' : ''
            ReleaseDate = ReleaseDate ? '(' + ReleaseDate + ') ' : ''

            Title = Maker + ID + ReleaseDate + Title

            if(byteLengthOfCheck(Title) > 250){

                let TitleLast = getLastText(Title)

                if(typeof TitleLast == 'undefined' || !TitleLast || TitleLast.length === 0 || TitleLast === "" || !/[^\s]/.test(TitleLast) || /^\s*$/.test(TitleLast) || TitleLast.replace(/\s/g,"") === ""){
                    CopyTitle = byteLengthOf(Title, 250).trim()
                }
                else{
                    Title = Title.split(TitleLast)[0].trim()
                    Title = byteLengthOf(Title, 250 - byteLengthOfCheck(TitleLast))
                    console.log('Title: ', Title, TitleLast)
                    CopyTitle = (Title + TitleLast).trim()
                }
            }
            else CopyTitle = Title.trim()

            console.log('Last Title: ' + CopyTitle)

        }
        //CopyTitle = CopyOffSetArea.textContent.replace(/\s–\s(UltraHD|Full|HD|SD)/, '').trim()
        DownloadArea = document.querySelectorAll('div#content > div > div.entry p')
        CoverImage = DownloadArea[0].querySelector('p img') ? DownloadArea[0].querySelector('p img').src : ''
    }

    else if(/javpink\.com\/\?p/.test(PageURL)){
        CopyOffSetArea = document.querySelector('.item > .title')
        Title = CopyOffSetArea.textContent.trim()
        DownloadArea = document.querySelectorAll('.item > .content')
        CoverImage = DownloadArea[0].querySelector('p img') ? DownloadArea[0].querySelector('p img').src : ''

        for (let i = 0; i < DownloadArea.length; i++) {
            InfoArea = DownloadArea[i].innerText.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, '\n').split(/\n\n|\n/)
        }
        InfoArea = InfoArea.filter(function(e){return e})//빈 배열값 제거
        console.log(InfoArea)
        Series = InfoArea.find(InfoSearch => InfoSearch.match(/シリーズ：?.*/)) ? InfoArea.find(InfoSearch => InfoSearch.match(/シリーズ：?.*/)).replace(/シリーズ：?/, '').trim() : ''

        Title = mbConvertKana(Title, 'rans')
        if(byteLengthOfCheck(Title) > 250){
            let TitleLast = getLastText(Title)

            if(typeof TitleLast == 'undefined' || !TitleLast || TitleLast.length === 0 || TitleLast === "" || !/[^\s]/.test(TitleLast) || /^\s*$/.test(TitleLast) || TitleLast.replace(/\s/g,"") === ""){
                CopyTitle = byteLengthOf(Title, 250).trim()
            }
            else{
                Title = Title.split(TitleLast)[0].trim()
                Title = byteLengthOf(Title, 250 - (byteLengthOfCheck(TitleLast)))
                console.log('Title: ', Title, TitleLast)
                CopyTitle = (Title + TitleLast).trim()
            }
        }
        else CopyTitle = Title.trim()
    }

    else if(/top-modelz.org\/.+html/.test(PageURL)){
        CopyOffSetArea = document.querySelector('.news-detalis h2')
        Title = CopyOffSetArea.textContent.trim()
        DownloadArea = document.querySelectorAll('div#content div#l-content div#dle-content div.news-block div.newspad')
        CoverImage = DownloadArea[0].querySelector('p img') ? DownloadArea[0].querySelector('p img').src : ''
        for (let i = 0; i < DownloadArea.length; i++) {
            InfoArea = DownloadArea[i].innerText.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, '\n').split(/\n\n|\n/)
        }
        InfoArea = InfoArea.filter(function(e){return e})//빈 배열값 제거
        console.log(InfoArea)
        let Released
        for (let i = 0; i < InfoArea.length; i++) {
            if(!Released){
                Released = InfoArea[i].match(/\d+-\d+-\d+/) ? InfoArea[i].match(/\d+-\d+-\d+/) + ' ' : ''
            }
            if(Released){
                break
            }
        }
        CopyTitle = Released ? Released + Title : Title
        CopyTitle = CopyTitle
        CopyTitle = byteLengthOf(CopyTitle, 250)
    }

    else if(/(8kcosplay\.com|blogjav\.net|javfree\.me)\/\d+/.test(PageURL)){
        CopyOffSetArea = document.querySelector('.entry-title')
        if(/javfree\.me/.test(PageURL)){
            DownloadArea = document.querySelectorAll('.entry-content')

            //CoverImage = DownloadArea[0].querySelector('p img') ? DownloadArea[0].querySelector('p img').src : ''
        }
        else{
            DownloadArea = document.querySelectorAll('.entry-content > p')
            CoverImage = DownloadArea[0].querySelector('p img') ? DownloadArea[0].querySelector('p img').src : ''
        }

        Title = CopyOffSetArea.textContent.replace(/\[([a-zA-Z]{2,11}-?\d{2,6}[a-zA-Z]?|\d{2,4}[a-zA-Z]{2,7}-?\d{3,6}[a-zA-Z]?|[a-zA-Z]{1,2}-?\d{2}-?\d{2}|[a-zA-Z]{2,7}-?[a-zA-Z]{1,2}\d{2})\]/, '$1')
        ID = Title.match(SearchFC2ID) ? Title.match(SearchFC2ID)[1] : ''
        console.log('ID: ', ID)
        Title = Title.replace(ID, '').trim()
        Title = Title.split(/\s/).filter(function(e){return e})
        console.log('Title: ', Title)
        if(Title[0].match(/UNCENSORED/)){
            Title.shift()
            Title = Title.join(' ')
        }
        else{
            Title = Title.join(' ')
        }
        for (let i = 0; i < DownloadArea.length; i++) {
            InfoArea = DownloadArea[i].innerText.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, '\n').split(/\n\n|\n/)
        }

        InfoArea = InfoArea.filter(function(e){return e})//빈 배열값 제거
        console.log('InfoArea: ', InfoArea)
        Series = InfoArea.find(InfoSearch => InfoSearch.match(/シリーズ：?.*/)) ? InfoArea.find(InfoSearch => InfoSearch.match(/シリーズ：?.*/)).replace(/シリーズ：?/, '').trim() : ''
        console.log('Series: ', Series)
        Title = mbConvertKana(Title, 'rans')
        console.log(Title, ID)
        if(byteLengthOfCheck(Title) > 250 - byteLengthOfCheck(ID)){
            let TitleLast = getLastText(Title)
            if(typeof TitleLast == 'undefined' || !TitleLast || TitleLast.length === 0 || TitleLast === "" || !/[^\s]/.test(TitleLast) || /^\s*$/.test(TitleLast) || TitleLast.replace(/\s/g,"") === ""){
                CopyTitle = ID + byteLengthOf(Title, 250 - byteLengthOfCheck(ID)).trim()
            }
            else{
                Title = Title.split(TitleLast)[0].trim()
                Title = byteLengthOf(Title, 250 - (byteLengthOfCheck(ID) + byteLengthOfCheck(TitleLast)))
                CopyTitle = (ID + Title + TitleLast).trim()
                if(byteLengthOfCheck(CopyTitle) > 250){
                    console.log('CopyTitle length: ', byteLengthOfCheck(CopyTitle))
                }
            }
        }
        else CopyTitle = ID + Title.trim()
        console.log('CopyTitle: ', CopyTitle)
    }

    else if(/wetholefans.com\/.+/.test(PageURL)){
        CopyOffSetArea = document.querySelector('.post-title #news-title h1')
        console.log(parseFloat(window.getComputedStyle(CopyOffSetArea).fontSize))
        //console.log('CopyOffSetArea: ' + CopyOffSetArea)
        Resolution = !Resolution && CopyOffSetArea && CopyOffSetArea.innerText.match(/[0-9]{3,4}p/) ? ' ' + CopyOffSetArea.innerText.match(/[0-9]{3,4}p/)[0] : ''
        console.log(Resolution)
        CopyTitle = CopyOffSetArea.innerText.replace(/\((UltraHD|Full|HD|SD).+/, '').replace(/\s+/g, ' ').trim()
        CopyTitle = capitalize(CopyTitle)
        DownloadArea = CopyOffSetArea.closest('.story').querySelectorAll('.quote')
        let SearchLinks
        DownloadArea.forEach((LinkEntry) => {
            SearchLinks = LinkEntry.querySelectorAll('a')
        })
        console.log(SearchLinks)
        for (let i = 0; i < SearchLinks.length; i++) {
            if(!ReleaseDate){
                ReleaseDate = SearchLinks[i].textContent.match(/(.+)(\.\d+\.\d+.\d+\.)(.+)/) ? SearchLinks[i].textContent.match(/(\.\d+\.\d+.\d+\.)/).pop() : ''
            }
            else{
                break
            }
        }
        let MatchWebPoint = CopyTitle.search(/\s-\s/)
        let MatchWeb = MatchWebPoint !== -1 ? CopyTitle.substr(0, MatchWebPoint).replace(/\s/g, '') : CopyTitle
        CopyTitle = ReleaseDate ? MatchWeb + ReleaseDate + CopyTitle.substr(MatchWebPoint+3) : CopyTitle
        console.log(CopyTitle)
        CopyTitle = CopyTitle.replace(/\*/g, '＊').replace(/\?/g, '？')
        CopyTitle = byteLengthOf(CopyTitle, 250)

    }

    else{
        if(/(pornchil\.com\/)(?!$).*$/.test(PageURL)){
            CopyOffSetArea = document.querySelector('.inside-article > .entry-content').querySelector('strong > span')
            DownloadArea = document.querySelectorAll('.inside-article > div.entry-content')
            console.log(CopyOffSetArea)
        }
        else if(/javarchive\.com\/\d{4,6}/.test(PageURL)){
            CopyOffSetArea = document.querySelector('div.news > div.first_des') || document.querySelector('.menudd > h1')
            DownloadArea = document.querySelectorAll('.link_archive_innew')
            CoverImage = document.querySelector('div.category_news_phai_chinh > div.news > div.fisrst_sc img:not([src^="data"])') ? document.querySelector('div.category_news_phai_chinh > div.news > div.fisrst_sc img').getAttribute('src') : document.querySelector('div.category_news_phai_chinh > div.news > div.fisrst_sc img').getAttribute('data-src')
            //console.log(CopyOffSetArea, DownloadArea, CoverImage)
        }
        else if(/kbjme\.com\/\d+/.test(PageURL)){
            CopyOffSetArea = document.querySelector('.article_container h1')
            DownloadArea = document.querySelectorAll('div.article_container div.context div#post_content')
            console.log(DownloadArea)
            document.querySelector('.article_container a').href = '#'
            document.querySelector('.article_container a').removeAttribute('target')
        }
        else if(/hpjav.tv\/(ja\/)?\d+/.test(PageURL)){
            CopyOffSetArea = document.querySelector('section div ol li.active')
            CoverImage = document.querySelector('#JKDiv_0') ? GetBackGroundUrl(document.querySelector('#JKDiv_0')) : ''
            let AddElementArea = document.querySelector('div#down_server')
            let observer = new MutationObserver(function(mutations) {
                if (document.querySelector('ul.pricing-table')) {
                    DownloadArea = document.querySelectorAll('ul.pricing-table')
                    console.log('DownloadArea: ', DownloadArea)
                    if(DownloadArea){
                        observer.disconnect()
                        window.scrollTo({ top: 0, behavior: 'auto' })
                        DownloadArea.forEach((LinkEntry) => {
                            LinkEntry.querySelectorAll('a').forEach((aEntry) => {
                                if( RootDomain !== (extractRootDomain(aEntry.href))){
                                    aEntry.classList.remove("dbtn")
                                    aEntry.removeAttribute('type')
                                    aEntry.textContent = aEntry.href
                                    aEntry.insertAdjacentHTML('beforebegin', '<img src=https://www.google.com/s2/favicons?domain=' + extractRootDomain(aEntry.href) +' ></>')
                                }
                            })
                        })
                        keyvent.down('ctrl alt a')                        
                    }
                }
            })
            observer.observe(AddElementArea, { attributes: true, childList: true, subtree: true });
            await sleep(1000)
            document.querySelector('#download_div.btn.btn-info').click()
        }
        else if(/0xxx\.ws\/articles\/\d+/.test(PageURL)){
            CopyOffSetArea = document.querySelector('div.container table#detail-table tbody tr td.taj:not(.levo)')
            DownloadArea = document.querySelectorAll('div.container table#detail-table tbody tr td.dlinks.taj')
            console.log(DownloadArea)
            window.addEventListener('scroll', scrollToTop)
        }
        else if(/pornrips\.cc\/.+/.test(PageURL)){
            CopyOffSetArea = document.querySelector('div#dle-content article div.head h1.title')
            DownloadArea = document.querySelectorAll('div#dle-content article div.story_cont .screenshots, div#dle-content article div.story_cont div.links')
            console.log(DownloadArea)
        }
        else if(/(thotsgirls\.com)\/.+/.test(PageURL)){
            CopyOffSetArea = document.querySelector('.entry-title')
            DownloadArea = document.querySelectorAll('div.entry-content')
            console.log(DownloadArea)
        }
        else if(/fhdporn\.video\/.+/.test(PageURL)){
            CopyOffSetArea = document.querySelector('h1.post-title')
            DownloadArea = document.querySelectorAll('div.post-content')
            console.log(DownloadArea)
        }
        else if(/av18plus\.com/.test(PageURL)){
            CopyOffSetArea = document.querySelector('article.post > h1#post-title')
            DownloadArea = CopyOffSetArea ? CopyOffSetArea.closest('article').querySelectorAll('p') : ''
            console.log(DownloadArea)
        }
        else if(/siteripbb\.org\/.+/.test(PageURL)){
            CopyOffSetArea = document.querySelector('.entry-title')
            DownloadArea = document.querySelectorAll('div.entry-content')
            console.log(DownloadArea)
        }
        else if(/asianscan\.biz\/.*\.html/.test(PageURL)){
            CopyOffSetArea = document.querySelector('div div.content div#dle-content div.mainf3')
            DownloadArea = document.querySelectorAll('div.content div#dle-content div.sscn div.quote')
            console.log(DownloadArea)
        }
        else if(/adult-porno\.org\/.+/.test(PageURL)){
            CopyOffSetArea = document.querySelector('div.full-in h1')
            DownloadArea = document.querySelectorAll('div.quote')
            console.log(DownloadArea)
            Resolution = !Resolution && CopyOffSetArea && CopyOffSetArea.innerText.match(/[0-9]{3,4}p/) ? ' ' + CopyOffSetArea.innerText.match(/[0-9]{3,4}p/)[0] : ''
        }
        else if(/(sharepornlink\.com\/)(?!($|page))(.*)$/.test(PageURL)){
            CopyOffSetArea = document.querySelector('.main-title.title')
            DownloadArea = document.querySelectorAll('div.text p')
            console.log(DownloadArea)
            Resolution = !Resolution && CopyOffSetArea && CopyOffSetArea.innerText.match(/[0-9]{3,4}p/) ? ' ' + CopyOffSetArea.innerText.match(/[0-9]{3,4}p/)[0] : ''
        }
        else if(/pornobunny\.org\/.+/.test(PageURL)){
            CopyOffSetArea = document.querySelector('.titlesf')
            document.querySelector('a.quote-hider-trigger').click()
            let AddElementArea = document.querySelector('div.sstory')
            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        if (mutation.addedNodes[i].nodeType === Node.ELEMENT_NODE) {
                            if (mutation.addedNodes[i].classList.contains('quote')) {
                                DownloadArea = document.querySelectorAll('div.quote')
                                console.log('DownloadArea: ', DownloadArea)
                                if(DownloadArea){
                                    observer.disconnect()
                                    window.scrollTo({ top: 0, behavior: 'auto' })
                                }
                            }
                        }
                    }
                })
            });
            observer.observe(AddElementArea, { childList: true, subtree: true });
            Resolution = !Resolution && CopyOffSetArea && CopyOffSetArea.innerText.match(/[0-9]{3,4}p/) ? ' ' + CopyOffSetArea.innerText.match(/[0-9]{3,4}p/)[0] : ''
        }
        else if(/pornrip\.cc\/.+\.html/.test(PageURL)){
            CopyOffSetArea = document.querySelector('.title.ularge')
            let AddElementArea = document.querySelector('article.main-article section.post-content')
            let observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        console.log(mutation.addedNodes[i])
                        if (mutation.addedNodes[i].nodeName === 'A') {
                            DownloadArea = document.querySelectorAll('article.main-article > section.post-content > div > div.su-spoiler > div.su-spoiler-content')
                            console.log('DownloadArea: ', DownloadArea)
                            if(DownloadArea){
                                observer.disconnect()
                                window.scrollTo({ top: 0, behavior: 'auto' })
                                document.querySelectorAll('a').forEach((aEntry) => {
                                    if(/\?site.+$/.test(aEntry.href)){
                                        aEntry.setAttribute('href', aEntry.href.replace(/\?site.+$/, ''))
                                    }
                                })
                                break
                            }
                        }
                    }
                })
            });
            observer.observe(AddElementArea, { childList: true, subtree: true })
            Resolution = !Resolution && CopyOffSetArea && CopyOffSetArea.innerText.match(/[0-9]{3,4}p/) ? ' ' + CopyOffSetArea.innerText.match(/[0-9]{3,4}p/)[0] : ''
        }
        if(CopyOffSetArea){
            //console.log('InnerText: ', getDirectInnerText(CopyOffSetArea))
            CopyTitle = getDirectInnerText(CopyOffSetArea).replace('–', '-').replace(/\s+/g, ' ').replace(/\[(UltraHD|FullHD|HD).+\].*/, '').replace(/^Japanese porn -|6000Kbps FHD/, '').trim()
            CopyTitle = CopyTitle.match(/(–\sSiterip)\s–.+/) ? CopyTitle.match(/(.+Siterip)\s–.+/)[1] : CopyTitle
            CopyTitle = capitalize(CopyTitle)
            if(byteLengthOfCheck(CopyTitle) > 250){
                let TitleLast = getLastText(CopyTitle)

                if(typeof TitleLast == 'undefined' || !TitleLast || TitleLast.length === 0 || TitleLast === "" || !/[^\s]/.test(TitleLast) || /^\s*$/.test(TitleLast) || TitleLast.replace(/\s/g,"") === ""){
                    Title = byteLengthOf(CopyTitle, 250).trim()
                }
                else{
                    Title = CopyTitle.split(TitleLast)[0].trim()
                    Title = byteLengthOf(Title, 250 - (byteLengthOfCheck(TitleLast)))
                    console.log('Title: ', Title, TitleLast)
                    Title = (Title + TitleLast).trim()
                }
                CopyTitle = Title.trim()
            }
            else CopyTitle = CopyTitle.trim()
        }
    }
}


document.addEventListener("DOMContentLoaded", async function(event) {
    if(!document.querySelector("div.CenterBox")){
        await Start()
    }

    document.addEventListener("click", async (event) => {
        //console.log(event.target)
        if(event.target.classList.contains('ClearButton')){
            event.preventDefault()
            await ClearUrls()
        }
        if(event.target.classList.contains('CopyButton')){
            event.preventDefault()
            await ClipPaste()
        }
        if(event.target.classList.contains('CopyIcon')){
            event.preventDefault()
            CopyGo()
        }
        if(event.target.classList.contains('CloseIcon')){
            window.close()
        }
        if(event.target.classList.contains('Minus')){
            event.preventDefault()
            event.target.style = "color: Orange !important;";
            RemoveDB(listToDo(DownloadArea))
            CheckDB(listToDo(DownloadArea))
        }
    })

    if(CopyOffSetArea && !document.querySelector(".IconSet")){
        CopyOffSetArea.insertAdjacentHTML('afterend', '<div class="IconSet" style="top: auto; left: auto; max-width: max-content; visibility:hidden; position: absolute;"></>')
        document.querySelector(".IconSet").insertAdjacentHTML('beforeend', '<i class="CopyIcon far fa-clone" style ="color: dodgerblue !important; visibility:hidden;"></>')
        document.querySelector(".IconSet").insertAdjacentHTML('beforeend', '&nbsp;<i class="CloseIcon fa-solid fa-square-xmark" style ="color: dodgerblue !important; visibility:hidden"></>')
        document.querySelector(".IconSet").insertAdjacentHTML('beforeend', '&nbsp;<i class="Minus fa-solid fa-magnifying-glass-minus" style ="color: dodgerblue !important; visibility:hidden;"></>')
        document.body.insertAdjacentHTML('beforeend', '<div class="CopyNotice" style="visibility:hidden;"></>')
        document.querySelector(".IconSet").style.visibility = "hidden"
        if(document.hidden){
            document.querySelector(".CopyIcon").style.visibility = "hidden"
        }
        let IconSetZIndex = MaxZIndexFromPoint('.IconSet') + 1
        let IconSetFontSize = Number(((1/(GetDPI/1.5))*(16/DefaultFontSize)).toFixed(2)) + 'rem'
        //document.querySelector('.IconSet').style.cssText = `font-size: ${CneterBoxFontSize}; z-index: ${CenterBoxZIndex}; display: block;`        
        Object.assign(document.querySelector('.IconSet').style, {fontSize: IconSetFontSize, zIndex: IconSetZIndex});

    }

    if(CopyOffSetArea){
        console.log('Make Icon')
        MakeIconTimer = setTimeout(() => MakeIcon(GetDPI), 2000)       
        /*
        window.addEventListener("resize", function(e) {
            console.log(e.type)
            //GetDPI = window.devicePixelRatio
            //DefaultFontSize = getDefaultFontSize()
            //console.log('GetDPI: ', GetDPI, 'DefaultFontSize: ', DefaultFontSize)
            //document.querySelector('.CenterBox').style.setProperty('font-size', Number(((1/(GetDPI/1.5))*(16/DefaultFontSize)).toFixed(2)) + 'rem', 'important');
            //document.querySelector('.State').style.setProperty('font-size', Number(((1/(GetDPI/1.5))*0.65*(16/DefaultFontSize)).toFixed(2)) + 'rem', 'important');
            //document.querySelector('.State').style.setProperty('line-height', Number(((1/(GetDPI/1.5))*(16/DefaultFontSize)).toFixed(2)) + 'rem', 'important');
            //document.querySelector('.CenterBox').style.setProperty('z-index', getMaxZIndex() + 1)
            //document.querySelector(".IconSet").style.setProperty('z-index', MaxZIndexFromPoint('.IconSet') + 1)
            MakeIcon(GetDPI)
        })
        */
    }

})

document.addEventListener("visibilitychange", async function() {    
    //console.log("window is active!" )
    RootDomainDB = JSON.parse(await GM_getValue(RootDomain, '[]'))
    GetState = RootDomainDB
    if(document.querySelector('.CenterBox')){
        document.querySelector('.State').textContent = ' ' + GetState.length
        document.querySelector('.ClearButton').style = "color: dodgerblue !important;";
        document.querySelector('.CopyButton').style = "color: dodgerblue !important;";
    }    
})

async function CopyGo() {
    let TitlePostion = getElementOffset(CopyOffSetArea)
    let TitleHeight = Math.max(TitlePostion.height, parseFloat(window.getComputedStyle(CopyOffSetArea).fontSize))
    let FixTop = Number((TitlePostion.top + TitlePostion.height).toFixed(2))
    let FixLeft = Number((TitlePostion.left + 2).toFixed(2))
    if(/pornchil.com/.test(PageURL)){
        FixLeft = getElementOffset(document.querySelector(".entry-content > h6")).left
    }
    else if(/pornrips\.cc/.test(PageURL)){
        FixLeft = getElementOffset(document.querySelector(".meta_date > .masha_index")).left
    }
    else if(/naughtyblog/.test(PageURL)){
        FixTop = getElementOffset(document.querySelector(".post-title.entry-title")).top + getElementOffset(document.querySelector(".post-title.entry-title")).height
    }
    $('.CopyNotice').css({
        "fontSize": Number(((1/(GetDPI/1.5))*0.6*(16/DefaultFontSize)).toFixed(2)) + 'rem',
        "top": FixTop + window.scrollY
        ,"left": FixLeft + window.scrollX
        , "position": "absolute",
        "z-index": getMaxZIndex() + 1
    })
    event.target.style = "color: Orange !important;"
    await CopyLink()
    let container = document.querySelector('.CopyNotice')
    container.classList.add('active')
    container.style.height = 'auto'
    var height = container.clientHeight + 'px'
    container.style.height = '0px'
    setTimeout(function () {
        container.style.height = height;
        container.style.visibility = "visible"
    }, 0)
    await sleep(3000)
    container.style.height = '0px'
    container.addEventListener('transitionend', function () {
        container.classList.remove('active');
    }, {
        once: true
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getLastText(Text) {
    let byteCheck = '', SearchCharPoint, TitleLastTmp
    let ArrayDB = Text.split(/\s/).filter(function(e){return e})//빈 배열값 제거
    let SeriesExp = new RegExp(Series + '.*')
    let ModelNameExp = new RegExp(/\((?!.*\().*\)/)
    let ModelName

    //console.log(JapaneseChar.test([ArrayDB.length -1]) , ArrayDB[ArrayDB.length -1], ArrayDB[ArrayDB.length -2] + ' ' + ArrayDB[ArrayDB.length -1])
    if(ModelNameExp.test(Text)){
        console.log('Model Name: ', Text.match(ModelNameExp)[0])
        ModelName = Text.match(ModelNameExp) ? Text.match(ModelNameExp)[0] : ''
        Text = Text.replace(ModelNameExp, '').trim()
        console.log(Text)
    }
    if(Series && SeriesExp.test(Text)){
        console.log(Series, SeriesExp)
        //console.log(Text.match(SeriesExp))
        TitleLastTmp = Text.match(SeriesExp) ? Text.match(SeriesExp).pop() : ''
    }
    else if(/朝までハシゴ酒/.test(Text)){
        TitleLastTmp = Text.match(/朝までハシゴ酒.*/)[0]
    }
    else if(/\d+/.test(ArrayDB[ArrayDB.length -1])){
        console.log(ArrayDB[ArrayDB.length -1])
        if(/ファイル\d+/.test(ArrayDB[ArrayDB.length -1])){
            TitleLastTmp = ArrayDB[ArrayDB.length - 2] + ' ' + ArrayDB[ArrayDB.length - 1]
            console.log('1st Match:' , TitleLastTmp)
        }
        else if(JapaneseChar.test(ArrayDB[ArrayDB.length -1])){
            TitleLastTmp = ArrayDB[ArrayDB.length -1]
            console.log('2nd Match:' , TitleLastTmp)
        }
        else if(byteLengthOfCheck(ArrayDB[ArrayDB.length -1]) < 100) {
            TitleLastTmp = ArrayDB[ArrayDB.length - 2] + ' ' + ArrayDB[ArrayDB.length - 1]
            console.log('3th Match:' , TitleLastTmp)
        }
    }
    console.log('TitleLastTmp: ', TitleLastTmp, /\d+/.test(ArrayDB[ArrayDB.length -1]), byteLengthOfCheck(TitleLastTmp))
    if(typeof TitleLastTmp == 'undefined' || !TitleLastTmp || TitleLastTmp.length === 0 || TitleLastTmp === "" || !/[^\s]/.test(TitleLastTmp) || /^\s*$/.test(TitleLastTmp) || TitleLastTmp.replace(/\s/g,"") === ""){
        byteCheck = ''
    }
    else if(TitleLastTmp.match(/\d+/)){
        if(SearchChar(TitleLastTmp, '】')){
            SearchCharPoint = Text.lastIndexOf("【")
            TitleLastTmp = Text.substring(SearchCharPoint)
            console.log('TitleLastTmp: ', TitleLastTmp)
        }
        else if(SearchChar(TitleLastTmp, '、') && TitleLastTmp.length <= 10 ){
            SearchCharPoint = TitleLastTmp.lastIndexOf("、")
            TitleLastTmp = TitleLastTmp.substring(SearchCharPoint + 1)
            console.log('TitleLastTmp: ', TitleLastTmp)
        }
        byteCheck = TitleLastTmp
        console.log('byteCheck: ', byteCheck)
        let FlagPoint = getFlag(byteCheck)
        if (byteLengthOfCheck(byteCheck) >= 100){
            console.log('CheckFlag: ', byteCheck, byteLengthOfCheck(byteCheck))
            let byteCheckTmp = byteCheck.substring(FlagPoint[0])
            if(!JapaneseChar.test(byteCheckTmp)){
                byteCheckTmp = byteCheck.substring(FlagPoint[1])
            }
            if(byteLengthOfCheck(byteCheckTmp) > 250 - byteLengthOfCheck(ID)){
                byteCheckTmp = ''
            }
            byteCheck = byteCheckTmp
        }
        if(!/\d+|【.*】$/.test(byteCheck)){
            byteCheck = ''
        }
        console.log('TitleLast: ' , byteCheck)
    }
    if(ModelName) {
        byteCheck = byteCheck + ModelName
    }
    return byteCheck
}

async function CollectionCoverImage(CoverImage){
    RootDomainDB = JSON.parse(await GM_getValue(RootDomain, '[]'))
    if(CoverImage){
        await UpdateDB(CoverImage, FilenameConvert(CopyTitle) + Resolution)
        await GM_setValue(RootDomain, JSON.stringify(RootDomainDB))
    }
    GetState = RootDomainDB
    document.querySelector('.State').textContent = ' ' + GetState.length
    return CoverImage
}

async function CollectionLinks(DownloadArea){
    RootDomainDB = JSON.parse(await GM_getValue(RootDomain, '[]'))
    var CollectionATag = []
    DownloadArea.forEach((LinkEntry) => {
        LinkEntry.querySelectorAll('a').forEach((aEntry) => {
            if(/\?site.+$/.test(aEntry.href)){
                aEntry.setAttribute('href', aEntry.href.replace(/\?site.+$/, ''))
            }
            CollectionATag.push(aEntry)
        })
    })
    //console.log('CollectionATag: ', CollectionATag )
    CollectionATag = CollectionATag.filter(el => SkipClassNames.some(Skip => !el.classList.contains(Skip))) // SkipClass

    CollectionATag = CollectionATag.filter(el => !SkipFilter.test(el.href)) // SkipFilter

    CollectionATag = CollectionATag.filter(el => ![...el.children].some(e => e.matches('img'))) // LinkItemsChilren


    if(/blogjav/.test(RootDomain)){
        CollectionATag = CollectionATag.filter(el => !el.textContent.match(/\.(mp4|mkv)$/i)) // Skip mp4 mkv
    }
    else if(/javarchive/.test(RootDomain)){
        let RemainCount = CollectionATag.filter(el => !el.textContent.match(/k2s\.cc|part\d\.rar/i)) // Skip k2s part
        //console.log('RemainCount:', RemainCount?.length)
        if(RemainCount?.length){
            CollectionATag = CollectionATag.filter(el => !el.textContent.match(/k2s\.cc|part\d\.rar/i)) // Skip k2s part
        }
        else{
            CollectionATag = CollectionATag.filter(el => !el.textContent.match(/k2s\.cc/i)) // Skip k2s
        }
    }
    //console.log('CollectionATag: ', CollectionATag )
    let SkipLink, SkipClass, LinkItemsChilren
    for (let i = 0; i < CollectionATag.length; i++) {
        Target = CollectionATag[i].href
        if(/naughtyblog.org/.test(RootDomain)){
            if(CollectionATag[i].textContent.match(/SD\.mp4/gi)){
                continue
            }
            else if(!CopyTitle.match(/SITERIP|OnlyFans|Updates|Collection/)){
                Resolution = CollectionATag[i].textContent.match(/[0-9]{3,4}p/) ? '.XXX.' + CollectionATag[i].textContent.match(/[0-9]{3,4}p/)[0] : ''
            }
        }
        if(/blogjav.net/.test(RootDomain)){
            if(Target.match(/\.mp4(\.html)?$/gi)){
                continue
            }
        }
        if(Target){
            if(CopyTitle){
                CopyTitle = FilenameConvert(CopyTitle)
                //CopyLinks += Target + "#Title=" + encodeURI(CopyTitle) + Resolution + "\n"
                UrlTitle = CopyTitle + Resolution
                //console.log('RootDomainDB: ', RootDomainDB)
                //await GM_setValue(Target, "#Title=" + encodeURI(CopyTitle) + Resolution)
            }
            CopyLinks += Target + "\n"

            await UpdateDB(Target, UrlTitle)
        }
    }
    await GM_setValue(RootDomain, JSON.stringify(RootDomainDB))
    GetState = RootDomainDB
    document.querySelector('.State').textContent = ' ' + GetState.length
    console.log(CopyLinks)
    if(CopyLinks?.length){
        return CopyLinks.split("\n").filter((item, i, allItems) => { return i === allItems.indexOf(item)}).join("\n")
    }
    else return null
}


async function UpdateDB(Target, UrlTitle){
    if(Target.match(K2SRegExp)){
        Target = Target.match(K2SRegExp)[1] + Target.match(K2SRegExp)[2].slice(0, 18)
    }
    searchDB = RootDomainDB.find( ({ U }) => U === Target )
    //console.log(RootDomainDB, searchDB)
    if(searchDB){
        searchDB.T = UrlTitle
    }
    else{
        RootDomainDB.push({U : Target , T : UrlTitle})
    }
    //console.log(RootDomainDB)
    return RootDomainDB
}


async function RemoveDB(listToDelete){
    RootDomainDB = RootDomainDB.filter( item => (!listToDelete.includes(item.U)) );
    await GM_setValue(RootDomain, JSON.stringify(RootDomainDB))
    GetState = RootDomainDB
    document.querySelector('.State').textContent = ' ' + GetState.length
}

async function CheckDB(listTo){
    if(GetState.length > 0){
        let Check = RootDomainDB.some( item => (listTo.includes(item.U)))
        //console.log('CheckDB: ', RootDomainDB, listTo, Check)
        if(Check){
            document.querySelector('.Minus').style.visibility = "visible"
        }
        else{
            document.querySelector('.Minus').style.visibility = "hidden"
        }
    }
}

async function CopyLink(){
    var CopyNoticeData = ''
    //console.log('CopyLinks: ', CopyLinks, TmpLinksDB, !CopyLinks?.length, !TmpLinksDB?.length)
    if(!CopyLinks?.length && !TmpLinksDB?.length){
        CopyNoticeData = FilenameConvert(CopyTitle) + "\n"
        AllCopyLinks = await CollectionLinks(DownloadArea)
        //console.log('AllCopyLinks: ', AllCopyLinks)
        if(AllCopyLinks){
            if(CoverImage){
                AllCopyLinks += await CollectionCoverImage(CoverImage)
            }
            JDownloader(AllCopyLinks, FilenameConvert(CopyTitle) + Resolution)
            //updateClipboard(AllCopyLinks)
            CopyNoticeData += AllCopyLinks
            document.querySelector('.CopyNotice').textContent = CopyNoticeData
        }
        else{
            document.querySelector('.CopyNotice').textContent = 'Empty Links'
        }
    }
    else if(TmpLinksDB?.length > 0){
        //console.log('TmpLinksDB: ', TmpLinksDB)

        for (let i = 0; i < TmpLinksDB.length; i++) {
            UpdateDB(TmpLinksDB[i].U, TmpLinksDB[i].T)
            CopyLinks += TmpLinksDB[i].U + '\n'
            //await GM_setValue(TmpLinksDB[i].Key, TmpLinksDB[i].Value)
        }
        await GM_setValue(RootDomain, JSON.stringify(RootDomainDB))
        GetState = RootDomainDB
        //console.log(GetState)
        document.querySelector('.State').textContent = ' ' + GetState.length
        //console.log(TmpLinksDB)
        JDownloaderDB(TmpLinksDB)
        //console.log(JdownloaderData)

        //updateClipboard(CopyLinks)
        CopyNoticeData = CopyLinks
        document.querySelector('.CopyNotice').textContent = CopyNoticeData
    }
    await CheckDB(listToDo(DownloadArea))
    CopyLinks = []
    AllCopyLinks = []
}


function listToDo(Area) {
    let List = [], CheckList = []
    let Target
    try {
        Area.forEach((LinkEntry) => {
            LinkEntry.querySelectorAll('a').forEach((aEntry) => {
                if(CheckList.indexOf(aEntry) === -1){
                    CheckList.push(aEntry)
                }
            })
        })
        for (let i = 0; i < CheckList.length; i++) {
            let SkipLink = SkipFilter.test(CheckList[i].href)
            let LinkItemsChilren = [...CheckList[i].children].filter(e => e.matches('img'))
            if(SkipLink || LinkItemsChilren?.length){
                continue
            }
            Target = CheckList[i].href.replace(/\?site.+/, '')
            if(Target.match(K2SRegExp)){
                Target = Target.match(K2SRegExp)[1] + Target.match(K2SRegExp)[2].slice(0, 18)
            }
            if(List.indexOf(Target) === -1){
                List.push(Target)
            }
        }
        if(CoverImage){
            List.push(CoverImage)
        }
        return List
    } catch (err){
        console.log(err)
        return List
    }

}

async function MutilSubTitle(MatchWeb, MatchWebPoint, InfoAreaCast, DownloadArea) {
    let AreadyAdd = [], CastName, CastNameDB = [], CastFirstTitle, CastLastTitle
    for (let i = 0; i < InfoAreaCast.length; i++) {
        let MatchPoint = InfoAreaCast[i].search(/\s?-\s/)
        console.log('MatchPoint: ', MatchPoint)
        console.log(MatchWeb, InfoAreaCast[i].substr(0, MatchPoint).replace(/\s/g, ''))
        if(MatchPoint !== -1 && MatchWeb !== InfoAreaCast[i].substr(0, MatchPoint).replace(/\s/g, '')){
            CastName = MatchPoint !== -1 ? InfoAreaCast[i].substr(0, MatchPoint).replace(/\s?(,|&|aka.*)\s?/gi, '&').replace(/\s{2}/g, ' ').trim().replace(/\s/g, '.') : ''
            console.log('CastName: ' , CastName)
            if(CastName.match(/&/)){
                CastNameDB = CastName.split('&')
                CastName = CastNameDB[0] + '(.+)\?' + CastNameDB.pop()
            }
        }
        else{
            CastName = ''
        }
        console.log('CastName: ' , CastName)
        console.log(MatchPoint, InfoAreaCast[i].lastIndexOf(' - '))
        CastFirstTitle = MatchPoint !== -1 ? InfoAreaCast[i].slice(MatchPoint + 1, InfoAreaCast[i].length).replace(/\s-\s.*/, '').split(' ') : []
        CastFirstTitle = CastFirstTitle?.length > 0 ? CastFirstTitle.filter((entry) => isNaN(entry)) : []//숫자 및 단일글자 제거
        CastFirstTitle = CastFirstTitle?.length > 0 ? CastFirstTitle.filter((entry) => entry.length > 1) : []//숫자 및 단일글자 제거
        CastFirstTitle = CastFirstTitle?.length > 0 ? CastFirstTitle.shift().trim() : ''
        CastLastTitle = MatchPoint !== -1 ? InfoAreaCast[i].slice(MatchPoint + 1, InfoAreaCast[i].length).replace(/\s-\s.*/, '').split(' ') : []
        //CastLastTitle = MatchPoint !== -1 ? InfoAreaCast[i].slice(MatchPoint + 1, InfoAreaCast[i].lastIndexOf(' - ')).replace(/\s-\s.*/, '').split(' ') : []
        CastLastTitle = CastLastTitle?.length > 0 ? CastLastTitle.filter((entry) => isNaN(entry)) : []//숫자 및 단일글자 제거
        CastLastTitle = CastLastTitle?.length > 0 ? CastLastTitle.filter((entry) => entry.length > 1) : []//숫자 및 단일글자 제거
        CastLastTitle = CastLastTitle?.length > 0 ? CastLastTitle.pop().trim() : ''
        console.log('Cast First & Last Title: ', CastFirstTitle, CastLastTitle)
        DownloadArea = document.querySelectorAll('div#download')
        DownloadArea.forEach((LinkEntry) => {
            let Links
            if(CastName){
                Links = MatchRegex(LinkEntry, new RegExp(CastName + '.*' + CastFirstTitle + '.*' + CastLastTitle, 'i'), 'href')
                if(!Links?.length){
                    Links = MatchRegex(LinkEntry, new RegExp(CastName, 'i'), 'href')
                    if(!Links?.length){
                        console.log('Links Empty...')
                        return
                    }
                }
            }
            else{
                Links = MatchRegex(LinkEntry, new RegExp(CastFirstTitle + '.*' + CastLastTitle, 'i'), 'href')
                if(!Links?.length){
                    Links = MatchRegex(LinkEntry, new RegExp(CastFirstTitle, 'i'), 'href')
                    if(!Links?.length){
                        console.log('Links Empty...')
                        return
                    }
                }
            }
            Links = Links.filter( ( el ) => !AreadyAdd.includes( el )) //이미 추가된 링크 제외
            // 링크가 6개 이상일때 짝수인덱스 값만 가져오기
            if(Links?.length >= 6){
                var filtered = Links.filter(function(element, index, array) {
                    return (index % 2 === 0);
                });
                Links = filtered
            }
            console.log('Links: ', Links)

            for (let j = 0; j < Links.length; j++) {
                let LinkText = Links[j].innerText.search(MatchWebRegExp) ? Links[j].innerText.substr(Links[j].innerText.search(MatchWebRegExp)) : Links[j].innerText
                console.log('LinkText: ', LinkText)

                let Released = LinkText.match(/(.+)(\.\d+\.\d+.\d+\.)(.+)/) ? LinkText.match(/(\.\d+\.\d+.\d+\.)/).pop()
                : MatchWebPoint !== -1 && LinkText.match(new RegExp(MatchWeb + '\\.\\d{4}\\.')) ? LinkText.match(new RegExp(MatchWeb + '\(\\.\\d{4}\\.\)')).pop()
                : ''
                console.log('Released: ', Released)
                let Episode = LinkText.match(/E\d{2,5}/i) ? '.' + LinkText.match(/E\d{2,5}/i) + '.' : ''
                Resolution = LinkText.match(/[0-9]{3,4}p/) ? '.XXX.' + LinkText.match(/[0-9]{3,4}p/)[0] : ''
                let CastTitle = InfoAreaCast[i].substr(MatchPoint + 3) && Episode ? '- ' + InfoAreaCast[i].substr(MatchPoint + 3).replace(/-\sE\d{2,5}/i, '').trim()
                : InfoAreaCast[i].substr(MatchPoint + 3) && !Episode ? '- ' + InfoAreaCast[i].substr(MatchPoint + 3)
                : ''
                console.log('CastTitle: ', CastTitle)
                let CastRegExp = LinkText.match(CastFirstTitle) && LinkText.match(CastLastTitle) ? new RegExp(MatchWeb + Episode + Released + CastName + '.*(' + CastFirstTitle + ')?(.*' + CastLastTitle + ')?', 'i') : ''
                console.log('CastRegExp: ', CastRegExp)
                let Cast = LinkText.match(CastRegExp)
                console.log('Cast: ', Cast)
                Title = CastRegExp && Cast && Cast.length > 1 && Episode ? MatchWeb + Episode + Released + Cast.pop().replace(/\./g, ' ') + CastTitle
                : Episode || Released ? MatchWeb + Episode + Released + InfoAreaCast[i]
                : MatchWeb + ' ' + Released + InfoAreaCast[i]
                Title = Title.replace(/(S\d+):(E\d+)/i, '$1$2')
                Title = FilenameConvert(Title)
                //CopyLinks += Links[j].href + "\n"
                let U = Links[j].href
                let T = Title + Resolution
                console.log(Title, Links[j])
                TmpLinksDB.push({U, T})
                AreadyAdd.push(Links[j])
            }
            if(CoverImage){
                let U = CoverImage
                let T = FilenameConvert(CopyTitle) + Resolution
                TmpLinksDB.push({U, T})
            }
        })
    }
}

async function ClearUrls(){
    document.querySelector('.ClearButton').style = "color: White !important;";
    //document.querySelector('.ClearButton').style.setProperty('font-size', Number(((1/(GetDPI/1.5))*(16/DefaultFontSize)).toFixed(2)) + 'rem', 'important');
    await GM_deleteValue(RootDomain)
    RootDomainDB = JSON.parse(await GM_getValue(RootDomain, '[]'))
    GetState = RootDomainDB
    //console.log(GetState)
    if(document.querySelector('.Minus')){
        document.querySelector('.Minus').style.visibility = "hidden"
    }
    document.querySelector('.State').textContent = ' ' + 0
}

async function ClipPaste(){
    document.querySelector('.CopyButton').style = "color: White !important;";
    //document.querySelector('.CopyButton').style.setProperty('font-size', Number(((1/(GetDPI/1.5))*(16/DefaultFontSize)).toFixed(2)) + 'rem', 'important');
    var ClipPasteData = JSON.parse(await GM_getValue(RootDomain, '[]'))
    JDownloaderDB(ClipPasteData)
    //updateClipboard(ClipPasteData)
}


function MakeIcon(GetDPI) {
    clearTimeout(MakeIconTimer)
    if(CopyOffSetArea){
        let ModArea = CopyOffSetArea
        let OffSetArea
        let IconSet = document.querySelector(".IconSet")
        //console.log(ModArea, ModArea.nodeType)
        if(/kbjme\.com/.test(RootDomain)){
            OffSetArea = ModArea.closest('.article_container')
            OffSetArea.style.setProperty('position', 'relative')
        }
        else if(/javarchive\.com/.test(RootDomain)){
            OffSetArea = ModArea.closest('.category_news_phai_chinh').querySelector('.menudd')
            OffSetArea.style.setProperty('position', 'relative')
        }
        else if(/pornchil\.com/.test(RootDomain)){
            OffSetArea = ModArea.closest('.entry-content')
            OffSetArea.style.setProperty('position', 'relative')
        }
        else if(/top-modelz\.org/.test(RootDomain)){
            OffSetArea = ModArea
            OffSetArea.parentElement.style.setProperty('position', 'relative')
        }
        else if(/pornrips\.cc/.test(RootDomain)){
            OffSetArea = ModArea
            OffSetArea.parentElement.style.setProperty('position', 'relative')
        }
        else{
            OffSetArea = ModArea
            OffSetArea.parentElement.style.setProperty('position', 'relative')
        }
        var GetViewProperty = window.document.defaultView.getComputedStyle(ModArea, null)
        var GetPadding = GetViewProperty.getPropertyValue('padding') || 0
        var verticalalign = GetViewProperty.getPropertyValue('vertical-align') || 'middle'
        var lineheight = GetViewProperty.getPropertyValue('line-height') || '1rem'
        var Top = GetViewProperty.getPropertyValue('top') || 'auto'
        var DisPlay = GetViewProperty.getPropertyValue('display') || 'auto'
        let IconHeight = parseFloat(window.getComputedStyle(IconSet).fontSize)
        let FontHeight = parseFloat(window.getComputedStyle(OffSetArea).fontSize)
        let OffSetAreaElementOffset = getRelativeOffset(OffSetArea)
        let OffSetAreatNodeTextElementOffset = getNodeTextElementOffset(OffSetArea)
        let IconSetElementOffset = getRelativeOffset(IconSet)
        //console.log(OffSetArea.offsetParent, GetPadding)
        if(/javfree|blogjav|javpink|wetholefans/.test(PageURL)){
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top - IconSetElementOffset.height ,
                "left": OffSetAreaElementOffset.width - IconSetElementOffset.width/2
            })
        }
        else if(/naughtyblog|pornrip\.cc/.test(PageURL)) {
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top,
                "left": OffSetAreaElementOffset.width - IconSetElementOffset.width,
                "padding": GetPadding,
            })
        }
        else if(/pornrips\.cc/.test(PageURL)) {
            let MetaView = getRelativeOffset(OffSetArea.parentElement.querySelector('.meta > .meta_views'))
            $('.IconSet').css({
                "top": MetaView.top - IconSetElementOffset.height,
                "left": MetaView.left + IconSetElementOffset.width,
            })
            console.log(getRelativeOffset(MetaView))
        }
        else if(/javarchive/.test(PageURL)) {
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top + OffSetAreaElementOffset.height - IconSetElementOffset.height/2,
                "left": OffSetAreaElementOffset.left + OffSetAreaElementOffset.width - IconSetElementOffset.width
            })
        }
        else if(/kbjme\.com/.test(PageURL)) {            
            $('.IconSet').css({
                "top": getElementOffset(IconSet).height*3/2,
                "left": OffSetAreaElementOffset.right - OffSetAreaElementOffset.width + IconSetElementOffset.width
            })
            //})
        }
        else if(/maxjav\.com/.test(PageURL)) {
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top + IconSetElementOffset.height/2,
                "left": OffSetAreaElementOffset.left + OffSetAreaElementOffset.width - IconSetElementOffset.width
            })
        }
        else if(/0xxx\.ws\/articles\/\d+/.test(PageURL)) {
            //console.log((getElementOffset(OffSetArea).top - getNodeTextElementOffset(OffSetArea).top)/2)
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top,
                "right": IconHeight,
                "padding": GetPadding,
            })
        }
        else if(/top-modelz\.org/.test(PageURL)) {
            //console.log((getElementOffset(OffSetArea).top - getNodeTextElementOffset(OffSetArea).top)/2)
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top,
                "right": IconHeight
            })
        }
        else if(/hpjav\.tv/.test(PageURL)) {
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top - Math.abs(FontHeight - IconHeight)/2,
                "left": OffSetAreaElementOffset.width + IconHeight
            })
        }

        else if(/8kcosplay\.com|fhdporn/.test(PageURL)){
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top - IconHeight,
                "left": OffSetAreaElementOffset.width - IconSetElementOffset.width
            })
        }
        else if(/av18plus\.com/.test(PageURL)){
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top - IconHeight,
                "left": OffSetAreaElementOffset.width - IconSetElementOffset.width
            })
        }
        else if(/pornchil\.com|asianscan/.test(PageURL)){
            $('.IconSet').css({
                "top": 0,
                "left": OffSetAreaElementOffset.width - IconSetElementOffset.width
            })
        }
        else {
            $('.IconSet').css({
                "top": OffSetAreaElementOffset.top,
                "left": OffSetAreaElementOffset.width - IconSetElementOffset.width,
            })
        }
        IconSet.style.visibility = "visible"
        document.querySelector('.CopyIcon').style.visibility = "visible"
        document.querySelector(".CloseIcon").style.visibility = "visible"
        if(DownloadArea){
            CheckDB(listToDo(DownloadArea))
        }
        //console.log(getElementOffset(OffSetArea), getNodeTextElementOffset(OffSetArea), getElementOffset(IconSet), getRelativeOffset(OffSetArea), getRelativeOffset(IconSet), FontHeight, IconHeight )
    }
}


function JDownloader(JdownloaderData, PackageName){
    //console.log(PackageName + '\n' + JdownloaderData)
    if(JdownloaderData){
        let data = new URLSearchParams();
        data.append(`urls`, JdownloaderData);
        data.append(`referer`, PageURL)
        if(PackageName){
            data.append(`package`, PackageName)
        }
        fetch('http://127.0.0.1:9666/flash/add', {
            method: 'POST',
            //mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
            body: data
        })
    }
}

function JDownloaderDB(LinksDB){
    //console.log(LinksDB)
    let uniqueTitle = [...new Set(LinksDB.map( x => x.T ))]
    //console.log(uniqueTitle)
    uniqueTitle.forEach(x => JDownloader(GetMatchLinks(x, LinksDB), x))
}

function GetMatchLinks(text, LinksDB){
    try {
        return LinksDB.filter(u => text.includes(u.T)).map(l => l.U).join('\n')
    } catch(err) {
        console.log(err, text, LinksDB)
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'auto' })
    window.removeEventListener('scroll', scrollToTop)
}


function attrPromise(element, attributeName, attributeValue) {
    return new Promise((resolve,reject) => {
        const observerConfig = {attributes: true, childList: true, subtree: true,};
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName == attributeName && mutation.getAttribute(attributeName) == attributeValue ) {
                    observer.disconnect();
                    resolve(element);
                }
            });
        });

        observer.observe(element, observerConfig);
    });
}
