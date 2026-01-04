// ==UserScript==
// @name         ColorOmni
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Recolored Omni
// @author       @dsvl0
// @match        https://omni.top-academy.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=top-academy.ru
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/488004/ColorOmni.user.js
// @updateURL https://update.greasyfork.org/scripts/488004/ColorOmni.meta.js
// ==/UserScript==

var Version="0.9";
var Accent0='#0a0a0a80';
var Accent1='#18181880';
var Accent2='#3b3d3c80';
if (getValue('CustomAccent0') === null){Accent0='#0a0a0a80'; Accent1 = '#18181880'; Accent2 = '#3b3d3c80';}
else {Accent0=getValue('CustomAccent0'); Accent1=getValue('CustomAccent1'); Accent2=getValue('CustomAccent2');}

function SettingsInner(){
    var Inner = `
<style>.UpdateCheck {padding:8px; border: none; background: #22222290; color: white; border-radius: 20px; margin-bottom: 10px}</style>
<h3 style="color: wheat; margin-bottom: 12px;">Настройки</h3>
<button class="UpdateCheck" id="CheckBtnUpdate" onClick="CheckUpdateSystem()"> Проверить обновления </button>
<div class="SettingsLine">
<input id="PicInPic" type="checkbox"/>
<label id="PicInPicTxt" for="PicInPic">Включить режим "Картинка в картинке" для фона</label>
</div>
    `;
    return Inner;
}

function setValue(name, value, days=900) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Получаем cookie по имени
function getValue(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// Удаляем cookie по имени
function delValue(name) {
    document.cookie = name+'=; Max-Age=-99999999;';
}

window.CheckUpdateSystem = function(){
    fetch('https://greasyfork.org/ru/scripts/488004-coloromni', {method: 'GET'})
        .then(response => response.text())
        .then(data => {
        var versionRegex = /<dt class="script-show-version"><span>Версия<\/span><\/dt>\s+<dd class="script-show-version"><span>(.*?)<\/span><\/dd>/;

        var match = data.match(versionRegex);

        if (match) {
            var version = match[1];
            console.log(version, '!==', Version, (version!==Version && version!==""))
            if (version!==Version && version!==""){
                if (document.getElementById("CheckBtnUpdate") !== null){
                    document.getElementById("CheckBtnUpdate").textContent = 'Нажмите чтобы обновить';
                    document.getElementById("CheckBtnUpdate").setAttribute('onClick','window.open("https://greasyfork.org/ru/scripts/488004-coloromni")');

                }
            }
        }
    })
        .catch(error => {});
}

window.DocToast = function (InnerHTML){
    if (document.getElementById("DocToastID") ===null) {
        var DocToast = null;
        var TCont = document.createElement('div');
        TCont.id="DocToastID";
        TCont.style=`
    position: fixed;
    width: 100%;
    height: 100%;
    transition: all .8s;
    top: 0;
    overflow: hidden;
    left: 0;
    background: rgb(23 23 23 / 71%);
    z-index: 89999;
        `;
        TCont.innerHTML = `<div id="DocToast-container" style="position: absolute; max-width: 100%; max-height:100%; width: auto; height: auto;top: 50%; overflow: overlay;left: 50%;color: wheat;z-index: 90000;transform: translate(-50%,-50%);background: black;border-radius: 20px; padding: 15px;">
        `+InnerHTML+'<button class="ApplyVideoBG" onClick="CloseDocToast()">OK</button></div>'
        document.querySelector("body").appendChild(TCont);
    }
}

function BackgroundCreate(){
    var ChooseVideo = document.createElement("p");
    ChooseVideo.id="ChooseVideoExtension";
    ChooseVideo.style="top: 0px; left: 0px;";
    ChooseVideo.textContent="Видео-фон";

    var OpenSettings = document.createElement("p");
    OpenSettings.className="topextensionbutton";
    OpenSettings.style="top: 0px; left: 0px;";
    OpenSettings.textContent="Настройки";


    window.SetAccents = function (Acc0, Acc1, Acc2) {
        setValue('CustomAccent0', Acc0);
        setValue('CustomAccent1', Acc1);
        setValue('CustomAccent2', Acc2);
        Accent0 = Acc0; Accent1 = Acc1; Accent2 = Acc2;
    };
    window.SetbackgroundVideo = function (VideoURL) {
        if (VideoURL !== null){
            setValue('BGVideo', VideoURL);
            document.getElementById('VideoPlayBackBg').src=VideoURL;
            document.getElementById("VideoPlayBackBg").removeAttribute('muted');
        }
        MainCss()
        window.CloseDocToast()
    };
    const AllThemeNames=['Без фона', 'Blade Runner','Lonely Samurai','In The Mountains', 'Japan Autumn', 'Komiwave', 'Atelier', '9mm', 'Sachiro', 'DemonSlayer', 'IceWolf', 'Inano'];

    const AllThemePhotos=[null,
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/RayanGosling.jpeg?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/Lone_Samurai_Sekiro_preview.jpg?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/InTheMountain_preview.jpg?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/Old%20House%20Japan%20Autumn%20Leaves%20-%20wallpaperwaifu_preview.jpg?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/komivawe_preview.png?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/gray_preview.jpg?raw=true',
                              'https://raw.githubusercontent.com/0mnr0/WallpaperInJournal/main/WallItems/0109%20(1).gif',
                              'https://raw.githubusercontent.com/0mnr0/WallpaperInJournal/main/WallItems/Pinlin%20koi%201_preview.gif',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/%E9%AC%BC%E6%9D%80%E9%98%9F_x264.jpg?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/IceWolf_preview.jpg?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/%E7%A8%BB%E9%87%8E%E7%9A%84%E5%B0%91%E5%A5%B3_preview.jpg?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/Aesthetic%20Pine%20Forest%20%5B4K%5D_preview.jpg?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/%E7%A7%8B%E6%9E%AB%EF%BC%88%E6%97%A0%E7%BC%9D%EF%BC%89_preview.jpg?raw=true',
                              'https://github.com/0mnr0/WallpaperInJournal/blob/main/WallItems/%E2%80%A2Crimson%E2%80%A2_preview.jpg?raw=true'
                             ];

        const AllVideoLinks=[null,
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/RayanGslingBackground.mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/Lone_Samurai_Sekiro.mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/InTheMountain.mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/Old%20House%20Japan%20Autumn%20Leaves%20-%20wallpaperwaifu.mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/komiwave.mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/gray_we.mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/0109%20(1).mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/Pinlin%20koi%201.mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/%E9%AC%BC%E6%9D%80%E9%98%9F_x264.mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/IceWolf.mp4',
                             'https://github.com/0mnr0/WallpaperInJournal/raw/main/WallItems/%E7%A8%BB%E9%87%8E%E7%9A%84%E5%B0%91%E5%A5%B3.mp4',
                            ]

    const WallpaperEngineLinks=[null,
                                null,
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=2130919433',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=2824047299',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=1837650841',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=2605094298',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=2391553844',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=3030675413',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=3135364491',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=2915222568',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=1884879976',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=3000492313',
                                'https://steamcommunity.com/sharedfiles/filedetails/?id=3021987040'
                               ];
    const AccentStyles=[['#0a0a0a80', '#18181880', '#3b3d3c80'],//Empty
                        ['#380E3280', '#362533A9', '#450D3Aa9'],//Purple
                        ['#89561580', '#613A09a9', '#4E2E06a9'],//Fire
                        ['#2A5B9080', '#234F81a9', '#133E6Da9'],//Ocean
                        ['#160F51a4', '#100A43a9', '#140834a9'],//Space Black
                        ['#B96622a4', '#A55A1Da9', '#904D17a9'],//Camp Fire
                        ['#380E3280', '#362533A9', '#450D3Aa9'],//Purple
                        ['#333333a9', '#3b3b3ba4', '#333333a9'],//Cloudly
                        ['#6b000040', '#cc000060', '#80000070'],//Red Apple
                        ['#1B453Fa9', '#357068a4', '#0C373Da9'],//Lime
                        ['#333333a9', '#3b3b3ba4', '#333333a9'],//Cloudly
                        ['#1B453Fa9', '#357068a4', '#0C373Da9'],//Lime
                        ['#89561580', '#613A09a9', '#4E2E06a9'] //Fire

    ]


    var ChooseThemeContent=`
<style>
.ThemeDeafult {width: 90%; height: 50px; background-position: 50% 25%; border: none; color:white; font-weight: bold; background-size: 120%; transition: all 1s cubic-bezier(0.42, 0, 0.16, 0.99); border-radius: 0px !important;}
.ThemeDeafult:hover {background-size: 100%; height: 160px;}
.ThemeOnTop {border-start-end-radius: 20px !important; border-start-start-radius: 20px !important; }
.ThemeOnEnd {border-end-start-radius: 20px !important; border-end-end-radius: 20px  !important;}
.ThemeFull {width: 100%}
.WallpaperEngineLink {width: 10%; object-fit: contain; height: 50px; position: absolute; padding-left: 1.5%}
</style>


<div id="DocToastCt">
<h3><center>Выберите любое видео:</center></h3>
<p><center>Ссылка на видео автоматически вставится в нужное поле ввода, просто нажмите "Применить":</center></p>

`;
    for (let i = 0; i < AllThemeNames.length; i++) {
        var className= 'ThemeDeafult';
        if (i==0) {className+=' ThemeOnTop'}
        if (i==AllThemeNames.length-1){className+=' ThemeOnEnd'}
        ChooseThemeContent=ChooseThemeContent+`

<button style="background-image: url(`+AllThemePhotos[i]+`);" cursor="pointer" class="`+className+`" onClick="SetbackgroundVideo('`+AllVideoLinks[i]+`'); SetAccents('`+(AccentStyles[i][0])+`','`+(AccentStyles[i][1])+`','`+(AccentStyles[i][2])+`')">
`+AllThemeNames[i]+`
</button>`;
        if (WallpaperEngineLinks[i] !== null){
            ChooseThemeContent=ChooseThemeContent+`
<a target="_blank" href="`+WallpaperEngineLinks[i]+`"><img title="Открыть на платформе Steam" class="WallpaperEngineLink" src="https://res.cloudinary.com/dbzfezrjd/image/upload/v1706525156/BetterJournal/WallpaperIco.png"></a>`
        }
    }
    ChooseThemeContent+=`<button style="width: 100%; margin-top: 12px; background:`+Accent1+`; border: none; color:white; cursor: pointer; border-radius: 200px" onClick='caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key)))); window.location.reload(true);'>Попробовать очистить кэш (Если фон не загружается)</button>
            </div>
            `;
    ChooseVideo.setAttribute('onClick',"DocToast(`"+ChooseThemeContent+"`)");
    document.querySelectorAll(".pull-right.ng-scope")[1].after(ChooseVideo);
    OpenSettings.setAttribute('onClick',"DocToast(`"+SettingsInner()+"`)");
    document.querySelectorAll(".pull-right.ng-scope")[1].after(OpenSettings);

    var videoElement = document.createElement("video");
    videoElement.style = "top: 0px; left: 0px;";
    videoElement.style.width = "100%";
    videoElement.style.height = "100%";
    videoElement.style.objectFit="cover";
    videoElement.id="VideoPlayBackBg";
    videoElement.style.filter="brightness(0.35)";
    videoElement.style.position="fixed";
    videoElement.style.zIndex="-1";
    videoElement.loop = true;
    videoElement.autoplay = true;
    videoElement.disablePictureInPicture=true;
    videoElement.muted = true;
    videoElement.removeAttributecontrols = false;
    videoElement.src = getValue("BGVideo");

    var targetDiv = document.querySelector("main.content");
    targetDiv.before(videoElement);
}

function MainCss(){
    var DarkStyle = document.getElementById('CustomStyleByExtension');
    if (DarkStyle === null){DarkStyle = document.createElement('style');}

    DarkStyle.innerHTML=`
p#ChooseVideoExtension, .topextensionbutton {overflow: hidden; position: relative; display: inline-table;cursor: pointer;padding: 7px; margin: 8px; background-color: `+Accent1+`; color: white; text-align: center; border-radius: 200px !important;}
body{background:`+Accent0+` !important}
.dossier.row .header {background: `+Accent1+`; border-radius: 20px; color: white}
.dossier.row, body.main {background: transparent !important}
body.main {z-index: -2; background-color: `+Accent0.slice(0,7)+` !important}
html {background-color: `+Accent0.slice(0,7)+` !important}
.rating__item.ng-scope {background: `+Accent1+` !important; border-radius: 8px !important; color:white}
.graph__item.ng-scope {background: `+Accent1+` !important; color: white; border-radius: 10px !important;}
.dossier__subjects.subjects {color: white; background: `+Accent1+` !important; border-radius: 10px !important;}
li.list__item.item.ng-scope {color: white; background: `+Accent1+` !important}
.table-video-reports { background: `+Accent1+`; border-radius: 20px}
.table-video-reports * {color: white}
.schedule .internal_wrap, .presents .interna-wrap {box-shadow: none}
.schedule td, .schedule tr, .schedule td div:before, .schedule tr>td:last-child>div:after { background: `+Accent1+`; }
.tabs-global ul li a.active { color: #22aa90 !important; border-bottom-color: none !important; background: `+Accent2+` !important; }
.tabs-global ul li a:after {display: none}
md-select-value#select_value_label_218 {background: `+Accent2+`}
md-select-menu md-content {background: `+Accent1+`; color:white !important}
md-option {color: white !important}
.video-rating-yellow, .video-rating-green {background: transparent; color:white}
md-option[selected] {color: cyan !important;}
md-option {background: `+Accent1+` !important}
.schedule th .blue_bg {background: `+Accent0.slice(0,7)+`;}
button.waves-effect.waves-light.btn.md-button.md-ink-ripple {background: `+(Accent1)+` !important; border-radius: 8px}
#myDialog.md-dialog-container.home_work_modal md-dialog .btn span {background: `+(Accent0.slice(0,7))+` !important}
.hw-md_single .btn span {background: `+(Accent0.slice(0,7))+` !important}
.md-ripple-container {background: `+(Accent1)+` !important; border-radius: 8px}
#myDialog.md-dialog-container.home_work_modal md-dialog .btn span {}
md-option:hover {background: `+Accent2+` !important}
.table-wrapper.paddingLeft.paddingRight { border-radius: 20px; padding: 0 !important; width: 100%; }
input {background: `+Accent2+`; color: white; border-radius: 5px !important;}
table.home_work-table.class_work-table.table.bordered, .presents .table>thead>tr>th {background: `+Accent1+` !important;}
.internal-wrap-global.position-relative, .tabs-global ul li a {box-shadow: none !important;}
md-dialog { border-radius: 20px;overflow-y: clip;background: `+Accent1+`;}
textarea, select#AISelection {background: `+Accent2+`}
md-select-value {color: white !important;}
md-dialog * {color: white !important;}
.page_picker i {background: `+Accent2+`}
.home_work-table .hw_buttons.hw_overdue.automark, .home_work-table .hw_buttons.hw_new, .home_work-table .hw_buttons.hw_checked {background: `+Accent1+`}
span.card-title.activator.ng-binding {color: white;}
div#stud {box-shadow: none;}
.card-internal * {color: white !important;}
.internal-wrap-global md-select {background: `+Accent1+`}
.tabs-global ul li a {background: `+Accent2+` !important; }
.groups .visits_wrap .marks div.hw {background: #ddd559a1}
.groups .visits_wrap .marks div.cw {background: #8ad2d59c}
.internal-wrap-global.position-relative.internal-wrap-global-profile, .profile_page {background: `+Accent1+` !important; color: white !important}
body.main main.content md-sidenav md-content ul.main-menu li.active {background: `+Accent0+`; width: 100%}
.profile_page * {color: white !important}
.internal-wrap-global.position-relative.custom-height-table-wrap { color: white !important; }
.md-dialog-container.ng-scope { z-index: 101 !important; }
.changeUser button {color: white}
body.main main.content toolbar {left: 45px !important}
#myDialog.md-dialog-container.home_work_modal md-dialog {border: solid 2px `+Accent2+`}
.internal_wrap * { color: white !important; }
.internal_wrap {box-shadow: none !important}
toolbar, body.main main.content md-sidenav, body.main main.content toolbar {background: `+Accent1+`}
.SettingsLine { padding: 8px; background: `+Accent1+`; border-radius: 20px;}
.SettingsLine * {cursor: pointer}
.internal-wrap-global .hw-count {background: `+Accent0+`; padding: 5px; border-radius: 10px;}
md-menu-content#cityes {background: #111111; color: white; min-height: fit-content}
button.md-button.md-ink-ripple:hover {background: `+Accent0+`}
button.md-button.md-ink-ripple {color: white;}
.ApplyVideoBG {float: right; margin-top: 12px; background: `+Accent2+`; color: wheat; width: 40%; border-radius: 10px !important; cursor: pointer; padding: 5px; border: solid 2px `+Accent2+`}


.dossier.row .header, toolbar, .dossier.row .dossier__rating .rating__item {transition: background 1s;}

    `;
    if (document.getElementById("CustomStyleByExtension") === null){
        document.querySelector("body").after(DarkStyle);
        DarkStyle.id="CustomStyleByExtension";
    }
}

function RefreshVideo(){

    var VideoURL = getValue('BGVideo');
    if (document.getElementById('VideoPlayBackBg') !== null && VideoURL!== null){
        if (document.getElementById('VideoPlayBackBg').src !== VideoURL){
            document.getElementById('VideoPlayBackBg').src=VideoURL;
        }
    }
}


function CreateFuncs(){
    window.CloseDocToast = function (){
        document.getElementById('DocToastID').style.top='-50%';
        document.getElementById('DocToastID').style.height='50%';
        setTimeout(function(){document.getElementById('DocToastID').remove()},1000)
    }
}

(function() {
    MainCss()
    setInterval(RefreshVideo,1000)
    document.querySelector("body").style.background="black !important";
    setInterval(MainCss, 2000)
    BackgroundCreate()
    CreateFuncs()
})();