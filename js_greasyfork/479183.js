// ==UserScript==
// @name         Better Journal
// @version      2.6.3
// @description  Repainted and more functionally Journal
// @author       @dsvl0
// @match        https://journal.top-academy.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=top-academy.ru
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1212116
// @downloadURL https://update.greasyfork.org/scripts/479183/Better%20Journal.user.js
// @updateURL https://update.greasyfork.org/scripts/479183/Better%20Journal.meta.js
// ==/UserScript==
/* eslint no-eval: 0 */

let AmIADeveloper = false

let Version = GM_info.script.version;
let UpdateFound=false;
let SettingsCreated=false;

let timeout=40;
let loadedtimes=0;
let PanelSpawned=0;//For Average Marks
let LoadedBearer=null;
var AllThemeDivs=null;
var ShiftTime = 0;
let Ticks=0;

let StyleLoaded=0;

let userInfo = null;

const today = new Date();
const month = today.getMonth();
const day = today.getDate();

let OriginalAvatar=null;

var IgnoreUpdate = false;



//Cherry
//// 583B53 362533 450D3A 340A2C


let Accent_MainBg="#333333";
let Accent0="#3b3b3b";
let Accent1="#333333";
let Accent2="#2C2C2C";
let Accent3="#101010";
let Accent_ActDay="#2D782D";//Shed

let SettingHeight="0";

var UserInfo = null;// Need to identificate user on BetterJournal Server
let UserCId=null;

var Leader1Info = null;
var Leader1Names = null;
var Leader1Amounts = null;
var Leader1Photo = null;
var Leader1IDS = null;

var Leader2Info = null;
var Leader2Names = null;
var Leader2Amounts = null;
var Leader2Photo = null;
var Leader2IDS = null;
var Leader2Positions = null;

var StudentsCount = 0;
var StudentsStreamCount = 0;

var NeedToMark=true;
var canSiteRKM = true;

var WallPaperInner = '<p> Не удалось получить список обоев </p>';
var XTendedDeInject = false;


function CreateSettings(){
    try{
        SettingHeight=1050;

        const ThemeNum = Number(localStorage.getItem("BJ.DefStyle"));
        var MainFloat = document.querySelectorAll('router-outlet')[(document.querySelectorAll('router-outlet').length)-1]
        var newDiv = document.createElement('div');
        const InputStyle=`
        border-radius: 7px;
        cursor: text;
        height: fit-content;
        margin-bottom: 3px;

        margin-left: 10px;
        width: -webkit-fill-available;
        border: solid 1px white;
        background: `+Accent3.slice(0,7)+`;
        padding-left: 5px;
        color: white;
        `;

        // 1 checkbox = + 30 px
        newDiv.className = 'BJSettings';
        newDiv.id="SettingsID";
        newDiv.style.width="-webkit-fill-available";
        newDiv.style.borderRadius="25px";
        newDiv.style.position="relative";
        newDiv.style.marginLeft="18px";
        newDiv.style.overflow="hidden";
        newDiv.style.height="0px";
        newDiv.style.marginRight="13px";
        newDiv.style.paddingBottom="10px";
        newDiv.style.marginBottom="10px";
        newDiv.style.overflowY='auto';
        newDiv.style.transition="all 0.7s ";
        newDiv.style.paddingLeft="10px";
        newDiv.style.paddingRight="10px";
        newDiv.style.opacity="0";
        newDiv.style.background=Accent0;


        var Div00 = document.createElement('div');
        Div00.style.marginTop="10px";
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = "Check1";

        var label = document.createElement('label')
        label.style.marginLeft="10px";
        label.style.color="white";

        label.setAttribute("for", "Check1");
        label.appendChild(document.createTextNode('Видео на заднем плане по ссылке: '));



        var HtmlApplyLink = document.createElement('button');
        HtmlApplyLink.style.padding="5px";
        HtmlApplyLink.style.marginLeft="5px";
        HtmlApplyLink.style.marginRight="5px";
        HtmlApplyLink.style.cursor="pointer";
        HtmlApplyLink.style.background=Accent0;
        HtmlApplyLink.style.color="white";
        HtmlApplyLink.style.borderRadius="4000px";
        HtmlApplyLink.textContent="Применить";

        var HtmlVideoLink = document.createElement('input');
        HtmlVideoLink.id="HTMLIdVideoLink";
        HtmlVideoLink.type = "text";
        HtmlVideoLink.placeholder="Ссылка на видео (URL)"
        HtmlVideoLink.style=InputStyle;

        var HtmlThemeChooseLink = document.createElement('button');
        HtmlThemeChooseLink.id="AllVideoPlayGrounds"
        HtmlThemeChooseLink.style="color: white; padding: 5px; cursor: pointer"
        HtmlThemeChooseLink.textContent="Все видеофоны";
        HtmlThemeChooseLink.addEventListener('click', function() {
            DocToast(WallPaperInner, false, 'min-width: 36%')
        });

        if (localStorage.getItem("BJ.VideoPlayback") !== null) {HtmlVideoLink.value=localStorage.getItem("BJ.VideoPlayback")}
        if (localStorage.getItem("BJ.VideoPlayback")!==null){checkbox.checked=true;}


        checkbox.addEventListener('change', function() {
            if (this.checked === false){
                localStorage.removeItem("BJ.VideoPlayback");
                document.getElementById('MovingBG').style.display='none';
                document.getElementById('ColorMovement').style.display='none';
                document.getElementById('VideoPlayBackBg').remove()
            } else {
                localStorage.setItem("BJ.VideoPlayback", HtmlThemeChooseLink.value);
                document.getElementById('MovingBG').style.display='display';
                document.getElementById('ColorMovement').style.display='flex';
            }
        });

        HtmlApplyLink.onclick = function() {
            if (checkbox.checked){
                localStorage.setItem("BJ.VideoPlayback", HtmlVideoLink.value);
                var VideoId = document.getElementById("VideoPlayBackBg");
                VideoId.remove();
            }
        };



        var Div00_Live = document.createElement('div');
        Div00_Live.id="MovingBG"
        Div00_Live.style.marginTop="5px";
        Div00_Live.style.marginLeft="20px";
        var checkbox_Live = document.createElement('input');
        checkbox_Live.type = "checkbox";
        checkbox_Live.id = "Check1_Live";
        checkbox_Live.checked = localStorage.getItem("BJ.AnimatedVideoBackground") === 'true'
        checkbox_Live.addEventListener('change', function() {
            Toast('Применяем изменения...')
            localStorage.setItem("BJ.AnimatedVideoBackground",this.checked);
            if (this.checked === false){
                document.removeEventListener('mousemove', mouseMoveHandler);
                setTimeout(function() {
                    if (localStorage.getItem("BJ.AnimatedVideoBackground") !== 'true') document.getElementById('VideoPlayBackBg').style.transition="all ease .7s, filter .5s";
                    document.getElementById('VideoPlayBackBg').style.transform=null;
                    setTimeout(function() {
                        document.getElementById('VideoPlayBackBg').style.transition="scale ease 1s, filter .5s";
                    }, 800)
                }, 1000)
            } else {
                CreateMovingBg()
            }
        });

        var label_Live = document.createElement('label')
        label_Live.style.marginLeft="10px";
        label_Live.style.color="white";
        label_Live.setAttribute("for", "Check1_Live");
        label_Live.appendChild(document.createTextNode('Создать движение для видео-фона (экспериметнально) '));



        var Div00_ColorMovement = document.createElement('div');
        Div00_ColorMovement.id="ColorMovement"
        Div00_ColorMovement.style.marginBottom="5px";
        Div00_ColorMovement.style.display="flex";
        Div00_ColorMovement.style.marginLeft="20px";
        var checkbox_ColorMovement = document.createElement('input');
        checkbox_ColorMovement.type = "checkbox";
        checkbox_ColorMovement.id = "Check1_ColorMovement";
        checkbox_ColorMovement.checked = localStorage.getItem("BJ.ColorMovementDegrees") !== null
        checkbox_ColorMovement.addEventListener('change', function() {

            let ColorMovementSliderValue = document.getElementById('ColorMovementSliderID')
            if (this.checked){
                localStorage.setItem("BJ.ColorMovementDegrees", ColorMovementSliderValue.value)
                ColorMovementSliderValue.removeAttribute('disabled')
                window.ColorMovementChange(document.getElementById('ColorMovementSliderID').value)
                try{
                    document.getElementById('video#VideoPlayBackBg').style.filter="hue-rotate("+ColorMovementSliderValue.value+"deg)"
                }catch(e){}
            } else {
                localStorage.removeItem("BJ.ColorMovementDegrees")
                ColorMovementSliderValue.setAttribute('disabled', true)
            }
        });

        window.ColorMovementChange = function(value){
            let totalPercent = (value/360*100).toFixed(2)+''
            document.getElementById('Label_ColorMovementVisiblePercent').textContent = totalPercent.slice(0,4)+'%'
            localStorage.setItem("BJ.ColorMovementDegrees",value)
        }


        var FlexDiv = document.createElement('div')
        FlexDiv.style="width: 100%";
        var ColorMovementSlider = document.createElement('input');
        ColorMovementSlider.max="360";
        ColorMovementSlider.min="0";
        ColorMovementSlider.id="ColorMovementSliderID"
        ColorMovementSlider.type="range"
        ColorMovementSlider.setAttribute('oninput',"window.ColorMovementChange(this.value)")
        ColorMovementSlider.step="1";
        ColorMovementSlider.value="0";
        ColorMovementSlider.style='top: 2px; position: relative; left: 2px; width: 15%'


        var label_ColorMovement = document.createElement('label')
        label_ColorMovement.style.margin="0";
        label_ColorMovement.style.marginLeft="10px";
        label_ColorMovement.style.color="white";
        label_ColorMovement.id="Label_ColorMovement"
        label_ColorMovement.setAttribute("for", "Check1_ColorMovement");
        label_ColorMovement.appendChild(document.createTextNode('Сдвиг RGB цветов для окрашивания фона в новые цвета: '));

        var label_ColorMovementPercent = document.createElement('label')
        label_ColorMovementPercent.style.margin="0";
        label_ColorMovementPercent.style.marginLeft="10px";
        label_ColorMovementPercent.className = 'HighLightedText';
        label_ColorMovementPercent.id="Label_ColorMovementVisiblePercent"
        label_ColorMovementPercent.appendChild(document.createTextNode('0.00%'));

        FlexDiv.appendChild(label_ColorMovement)
        FlexDiv.appendChild(ColorMovementSlider)
        FlexDiv.appendChild(label_ColorMovementPercent)




        var Div01 = document.createElement('div');
        var checkbox2 = document.createElement('input');
        checkbox2.type = "checkbox";
        checkbox2.id = "Check2";

        var label0 = document.createElement('label')
        label0.style.marginLeft="10px";
        label0.style.color="white";
        label0.setAttribute("for", "Check2");
        label0.appendChild(document.createTextNode('Сделать использование боковой панели приятнее'));
        if (localStorage.getItem("BJ.LiteBar")!==null){checkbox2.checked=true;}

        var Div03 = document.createElement('div');
        Div03.style.marginLeft='20px';
        Div03.id="BJ_Div03";
        var checkbox03 = document.createElement('input');
        checkbox03.type = "checkbox";
        checkbox03.id = "Check03";

        var label03 = document.createElement('label')
        label03.style.marginLeft="10px";
        label03.style.color="white";
        label03.setAttribute("for", "Check03");
        label03.appendChild(document.createTextNode('Прозрачность боковой панели: '));



        function TransSet(){
            var RangeSlide = document.createElement('p');
            RangeSlide.className = 'HighLightedText';
            RangeSlide.textContent=Number(localStorage.getItem("BJ.TransparentPanel"))+"%";
            RangeSlide.id = "RangeTransBarSlide";

            var TransparencySlider = document.createElement('input');
            TransparencySlider.max="99";
            TransparencySlider.min="0";
            TransparencySlider.id="TransparencySliderID"
            TransparencySlider.type="range"
            TransparencySlider.step="1";
            TransparencySlider.style='top: 2px; position: relative;'



            if (document.getElementById('TransparencySliderID') === null){
                TransparencySlider.value=localStorage.getItem("BJ.TransparentPanel")
                Div03.appendChild(TransparencySlider);
            }
            TransparencySlider.value=0;
            if (localStorage.getItem("BJ.TransparentPanel") !== null) {TransparencySlider.value = Number(localStorage.getItem("BJ.TransparentPanel"))}


            if (document.getElementById('RangeTransBarSlide') === null){
                Div03.appendChild(RangeSlide);
            }

            window.CreateTransparencyListener = function(){
                TransparencySlider.addEventListener("input", (event) => {
                    let RangeSlide = document.getElementById('RangeTransBarSlide')
                    let TargetValue = event.target.value
                    if (checkbox03.checked){
                        if (TargetValue<10) TargetValue="0"+TargetValue;
                        RangeSlide.textContent=(event.target.value)+"%";
                        localStorage.setItem("BJ.TransparentPanel", TargetValue)
                    }
                })
            }
            window.CreateTransparencyListener()

        }
        if (localStorage.getItem("BJ.TransparentPanel")!==null){checkbox03.checked=true; }

        checkbox03.addEventListener('change', function() {
            console.log(this.checked)
            if (this.checked) {
                TransSet()
                if (localStorage.getItem("BJ.TransparentPanel")===0 || localStorage.getItem("BJ.TransparentPanel")===null) {
                    localStorage.setItem("BJ.TransparentPanel", 10)
                }
                document.getElementById("RangeTransBarSlide").style.display='inline-block';
                document.getElementById("TransparencySliderID").removeAttribute('disabled');

            } else {
                document.getElementById("RangeTransBarSlide").style.display='none';
                document.getElementById("TransparencySliderID").disabled='true';
                localStorage.removeItem("BJ.TransparentPanel");
            }
        });



        checkbox2.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.LiteBar","1");
                document.getElementById("Check03").removeAttribute('disabled')
            } else {
                localStorage.removeItem("BJ.LiteBar");
                var OverlayElement = document.getElementById("LiteBarId");
                OverlayElement.remove();
                document.getElementById("Check03").setAttribute('disabled', true)
            }
        });

        var Div04 = document.createElement('div');
        var checkbox04 = document.createElement('input');
        checkbox04.type = "checkbox";
        checkbox04.id = "Check04";

        var label04 = document.createElement('label')
        label04.style.marginLeft="10px";
        label04.style.color="white";
        label04.setAttribute("for", "Check04");
        label04.appendChild(document.createTextNode('Убрать изображение с бокового меню'));
        checkbox04.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.NonBarImage","1");
                if (localStorage.getItem("BJ.BarLink") !== null) {alert('Отключите параметр "Своё фото на боковой панели" для применения функции')}
            } else {
                localStorage.removeItem("BJ.NonBarImage");
            }
        });
        if (localStorage.getItem("BJ.NonBarImage")!==null){checkbox04.checked=true;}




        if (document.getElementsByClassName("select-univercity")[1].textContent === 'Группа: 9/2-РПО-23/1' || document.getElementsByClassName("select-univercity")[1].textContent === 'Группа: 9/1-РПО-23/1' ){
            var Div000 = document.createElement('div');
            Div000.style.display = 'flex'
            var checkbox000 = document.createElement('input');
            checkbox000.type = "checkbox";
            checkbox000.id = "Check000";

            var label000 = document.createElement('label')
            label000.style = "margin-left: 10px; color:white;";
            label000.setAttribute("for", "Check000");
            label000.appendChild(document.createTextNode('Дайте уникальное имя для Миненко Алексей Павловича: '));

            var ALM_Name = document.createElement('input');
            ALM_Name.id="ALMName";
            ALM_Name.style=InputStyle;
            ALM_Name.type = "text";
            if (localStorage.getItem("BJ.ALPName") !== null) {ALM_Name.value=localStorage.getItem("BJ.ALPName")}
            if (localStorage.getItem("BJ.ALPName")!==null){checkbox000.checked=true;}

            checkbox000.addEventListener('change', function() {
                if (this.checked){
                    localStorage.setItem("BJ.ALPName", ALM_Name.value);
                } else {
                    localStorage.removeItem("BJ.ALPName");
                }
            });
            ALM_Name.addEventListener('input', function (evt) {
                if (checkbox000.checked){
                    localStorage.setItem("BJ.ALPName", ALM_Name.value);
                }
            });
        }



        var Div9 = document.createElement('div');
        Div9.style.display='flex';
        var checkbox9 = document.createElement('input');
        checkbox9.type = "checkbox";
        checkbox9.id = "Check9";

        var label9 = document.createElement('label')
        label9.style.marginLeft="10px";
        label9.style.color="white";
        label9.setAttribute("for", "Check9");
        label9.appendChild(document.createTextNode('Установите свою аватарку. Её не смогут увидель люди (по URL) (Поддерживается GIF):'));

        var AVTLink = document.createElement('input');
        AVTLink.id="AVTLink";
        AVTLink.type = "text";
        AVTLink.style = InputStyle;
        if (localStorage.getItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink") !== null) {AVTLink.value=localStorage.getItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink")}
        if (localStorage.getItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink")!==null){checkbox9.checked=true;}
        checkbox9.addEventListener('change', function() {
            if (this.checked){
                localStorage.setItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink", AVTLink.value);
            } else {
                localStorage.removeItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink");
            }
        });
        AVTLink.addEventListener('input', function (evt) {
            if (checkbox9.checked){
                localStorage.setItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink", AVTLink.value);
            }
        });


        var Div10 = document.createElement('div');
        var checkbox10 = document.createElement('input');
        checkbox10.type = "checkbox";
        checkbox10.id = "Check10";

        var label10 = document.createElement('label')
        label10.style.marginLeft="10px";
        label10.style.color="white";
        label10.setAttribute("for", "Check10");
        label10.appendChild(document.createTextNode('Закрепить и минимизировать верхнюю панель'));
        checkbox10.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.LevBar","1");
            } else {
                localStorage.removeItem("BJ.LevBar");
                if (document.getElementById("LevitationBar") !== null) {
                    document.getElementById("LevitationBar").removeAttribute("id");
                }
            }
        });
        if (localStorage.getItem("BJ.LevBar")!==null){checkbox10.checked=true;}


        var Div12 = document.createElement('div');
        var checkbox12 = document.createElement('input');
        checkbox12.type = "checkbox";
        checkbox12.id = "Check12";

        var label12 = document.createElement('label')
        label12.style.marginLeft="10px";
        label12.style.color="white";
        label12.setAttribute("for", "Check12");
        label12.appendChild(document.createTextNode('Оптимизация контента на главной странице (Оставляет последние 70 элементов в графе "Ваши награды")'));
        if (localStorage.getItem("BJ.OMP")!==null){checkbox12.checked=true;}
        checkbox12.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.OMP","1");
            } else {
                localStorage.removeItem("BJ.OMP");
            }
        });



        var Div13 = document.createElement('div');
        var checkbox13 = document.createElement('input');
        checkbox13.type = "checkbox";
        checkbox13.id = "Check13";
        var label13 = document.createElement('label')
        label13.style.marginLeft="10px";
        label13.style.color="white";
        label13.appendChild(document.createTextNode('Автоматически отправлять оценки о учителях'));
        if (localStorage.getItem("BJ.AutoMark") !== null){
            checkbox13.checked=true;
        }

        label13.setAttribute("for", "Check13");
        checkbox13.addEventListener('change', function() {
            if (this.checked) {
                if (confirm("Внимание! Вы не сможете регулировать оценки отправляемые расширением. Все оценки будут по умолчанию отправлятся с оценкой в 5 звезд. Продолжить?")){
                    localStorage.setItem("BJ.AutoMark","1");
                } else {
                    this.checked = false;
                }
            } else {
                localStorage.removeItem("BJ.AutoMark");
            }
        });


        var Div14 = document.createElement('div');
        var checkbox14 = document.createElement('input');
        checkbox14.type = "checkbox";
        checkbox14.id = "Check14";

        var label14 = document.createElement('label')
        label14.style.marginLeft="10px";
        label14.style.color="white";
        label14.setAttribute("for", "Check14");
        label14.appendChild(document.createTextNode('Убрать индикатор непрочитанных уведомлений (Только на боковой панели)'));
        if (localStorage.getItem("BJ.HideNewsPopup")!==null){checkbox14.checked=true;}
        checkbox14.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.HideNewsPopup","1");
            } else {
                localStorage.removeItem("BJ.HideNewsPopup");
            }
        });

        var Div15 = document.createElement('div');
        var checkbox15 = document.createElement('input');
        checkbox15.type = "checkbox";
        checkbox15.id = "Check15";

        var label15 = document.createElement('label')
        label15.style.marginLeft="10px";
        label15.style.color="white";
        label15.setAttribute("for", "Check15");
        label15.appendChild(document.createTextNode('Убрать индикатор непрочитанных материалов (Только на боковой панели)'));
        if (localStorage.getItem("BJ.HideMaterialsPopup")!==null){checkbox15.checked=true;}
        checkbox15.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.HideMaterialsPopup","1");
            } else {
                localStorage.removeItem("BJ.HideMaterialsPopup");
            }
        });




        var Div17 = document.createElement('div');
        var checkbox17 = document.createElement('input');
        checkbox17.type = "checkbox";
        checkbox17.id = "Check17";

        var label17 = document.createElement('label')
        label17.style.marginLeft="10px";
        label17.style.color="white";
        label17.setAttribute("for", "Check17");
        label17.appendChild(document.createTextNode('Автоматически заполнять время, затраченное на домашнее задание'));
        if (localStorage.getItem("BJ.AutoTimeSpend")!==null){checkbox17.checked=true;}
        checkbox17.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.AutoTimeSpend","1");
            } else {
                localStorage.removeItem("BJ.AutoTimeSpend");
            }
        });

        var Div18 = document.createElement('div');
        var checkbox18 = document.createElement('input');
        checkbox18.type = "checkbox";
        checkbox18.id = "Check18";

        var label18 = document.createElement('label')
        label18.style.marginLeft="10px";
        label18.style.color="white";
        label18.setAttribute("for", "Check18");
        label18.appendChild(document.createTextNode('Создавать обводку элементов под цвет темы'));
        if (localStorage.getItem("BJ.ThemedBorder")!==null){checkbox18.checked=true;}
        checkbox18.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.ThemedBorder","1");
            } else {
                localStorage.removeItem("BJ.ThemedBorder");
            }
        });



        var Div19 = document.createElement('div');
        Div19.style.display='flex';
        var checkbox19 = document.createElement('input');
        checkbox19.type = "checkbox";
        checkbox19.id = "Check19";

        var label19 = document.createElement('label')
        label19.style.marginLeft="10px";
        label19.style.color="white";
        label19.setAttribute("for", "Check19");
        label19.appendChild(document.createTextNode('Своё фото на боковой панели: '));
        var BarLink = document.createElement('input');
        BarLink.id="BarLink";
        BarLink.type = "text";
        BarLink.style = InputStyle;
        if (localStorage.getItem("BJ.BarLink") !== null) {BarLink.value=localStorage.getItem("BJ.BarLink")}
        if (localStorage.getItem("BJ.BarLink")!==null){checkbox19.checked=true;}
        checkbox19.addEventListener('change', function() {
            if (this.checked){
                localStorage.setItem("BJ.BarLink", BarLink.value);
            } else {
                localStorage.removeItem("BJ.BarLink");
            }
        });
        BarLink.addEventListener('input', function (evt) {
            if (checkbox19.checked){
                localStorage.setItem("BJ.BarLink", BarLink.value);
            }
        })

        if (localStorage.getItem("BJ.BarLink")!==null){checkbox19.checked=true; BarLink.value=localStorage.getItem("BJ.BarLink")}



        var CustomTheme = document.createElement('div');
        let TransparencyDeafultValue = localStorage.getItem("BJ.CustomThemeTransparency")
        CustomTheme.id="CustomThemeDivId"
        CustomTheme.style=`float: right; width:0; transition: all 1s; white-space:nowrap; background: `+Accent_MainBg+`; border-radius: 18px; overflow: hidden; margin-right: 10px; margin-left: 10px; right: 0px; position: absolute;`
        CustomTheme.innerHTML=`<div id="CustomThemeDivCreating" style="margin-left: 10px; margin-right: 10px;">

<h3 style="text-align: center">Создайте свою тему</h3>
<span>Главный цвет: </span> <input type="color" id="MainClolorSwitch" value="`+Accent_MainBg.slice(0,7)+`" style="border-radius: 5px;"/><br/><br/>
<span>Акцент 0: </span> <input type="color" id="Accent0Switch" value="`+Accent0.slice(0,7)+`" style="border-radius: 5px; margin-top: 2px;"/><br/>
<span>Акцент 1: </span> <input type="color" id="Accent1Switch" value="`+Accent1.slice(0,7)+`" style="border-radius: 5px; margin-top: 2px;"/><br/>
<span>Акцент 2: </span> <input type="color" id="Accent2Switch" value="`+Accent2.slice(0,7)+`" style="border-radius: 5px; margin-top: 2px;"/><br/>
<span>Акцент 3: </span> <input type="color" id="Accent3Switch" value="`+Accent3.slice(0,7)+`" style="border-radius: 5px; margin-top: 2px;"/><br/>

<span>Прозрачность блоков: </span> <input type="range" max="99" min="0" id="AccentTransparencySwitch" step="0.2" value="`+TransparencyDeafultValue+`" style="border-radius: 5px; margin-top: 2px;"/><span id="TransparencyValue" class="HighLightedText">`+TransparencyDeafultValue+`%</span><br/>

</div>`;



        var Div014 = document.createElement('div');
        var checkbox014 = document.createElement('input');
        checkbox014.type = "checkbox";
        checkbox014.id = "Check014";

        var label014 = document.createElement('label')
        label014.style.marginLeft="10px";
        label014.style.color="white";
        label014.setAttribute("for", "Check014");
        label014.appendChild(document.createTextNode('Скрыть раздел проверенных но не принятых домашних заданий'));
        checkbox014.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.HidePasswdHW","1");
            } else {
                localStorage.removeItem("BJ.HidePasswdHW");
            }
        });
        if (localStorage.getItem("BJ.HidePasswdHW")!==null){checkbox014.checked=true;}


        var Div015 = document.createElement('div');
        var checkbox015 = document.createElement('input');
        checkbox015.type = "checkbox";
        checkbox015.id = "Check015";

        var label015 = document.createElement('label')
        label015.style.marginLeft="10px";
        label015.style.color="white";
        label015.setAttribute("for", "Check015");
        label015.appendChild(document.createTextNode('Выделять домашние задания крайний срок которых заканчивается сегодня или завтра'));
        checkbox015.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.ShowBurningHW","1");
            } else {
                localStorage.removeItem("BJ.ShowBurningHW");
            }
        });
        if (localStorage.getItem("BJ.ShowBurningHW") !== null){checkbox015.checked=true;}


        var Div016 = document.createElement('div');
        var checkbox016 = document.createElement('input');
        checkbox016.type = "checkbox";
        checkbox016.id = "Check016";

        var label016 = document.createElement('label')
        label016.style.marginLeft="10px";
        label016.style.color="white";
        label016.setAttribute("for", "Check016");
        label016.appendChild(document.createTextNode('Круговое меню вместо бокового (на кнопку ~)'));
        checkbox016.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.CircularMenu","1");
            } else {
                localStorage.removeItem("BJ.CircularMenu");
            }
        });
        if (localStorage.getItem("BJ.CircularMenu") !== null){checkbox016.checked=true;}



        var Div017_1 = document.createElement('div');
        Div017_1.style.marginLeft='20px';
        var checkbox017_1 = document.createElement('input');
        checkbox017_1.type = "checkbox";
        checkbox017_1.id = "Check017_1";

        var label017_1 = document.createElement('label')
        label017_1.style.marginLeft="10px";
        label017_1.style.color="white";
        label017_1.setAttribute("for", "Check017_1");
        label017_1.appendChild(document.createTextNode('Включить возможность нажатия правой кнопки мыши для вызова меню'));
        checkbox017_1.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.RightClickToOpenCircular","1");
            } else {
                localStorage.removeItem("BJ.RightClickToOpenCircular");
            }
        });
        if (localStorage.getItem("BJ.RightClickToOpenCircular") !== null){checkbox017_1.checked=true;}


        var Div017 = document.createElement('div');
        Div017.style.marginLeft='20px';
        var checkbox017 = document.createElement('input');
        checkbox017.type = "checkbox";
        checkbox017.id = "Check017";

        var label017 = document.createElement('label')
        label017.style.marginLeft="10px";
        label017.style.color="white";
        label017.setAttribute("for", "Check017");
        label017.appendChild(document.createTextNode('Показывать стандартное боковое меню при октрытии кругового'));
        checkbox017.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.CircularMenuShowOriginalbar","1");
            } else {
                localStorage.removeItem("BJ.CircularMenuShowOriginalbar");
            }
        });
        if (localStorage.getItem("BJ.CircularMenuShowOriginalbar") !== null){checkbox017.checked=true;}



        var Div018 = document.createElement('div');
        var checkbox018 = document.createElement('input');
        checkbox018.type = "checkbox";
        checkbox018.id = "Check018";

        var label018 = document.createElement('label')
        label018.style.marginLeft="10px";
        label018.style.color="white";
        label018.setAttribute("for", "Check018");
        label018.appendChild(document.createTextNode('Миниатюрные часы в углу сайта'));
        checkbox018.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.ShowMiniClock","1");
            } else {
                localStorage.removeItem("BJ.ShowMiniClock");
                document.getElementById('HClockDiv').remove()
            }
        });
        if (localStorage.getItem("BJ.ShowMiniClock") !== null){checkbox018.checked=true;}


        function SetAutoCustomThemeWidth(){
            if (document.getElementById("ThemeCS").checked === false){
                for (var item of AllThemeDivs){
                    item.style.width="100%";
                }
                document.getElementById("CustomThemeDivId").style.width="0%";
            }
        }


        var Div019 = document.createElement('div');
        var checkbox019 = document.createElement('input');
        checkbox019.type = "checkbox";
        checkbox019.id = "Check019";

        var label019 = document.createElement('label')
        label019.style.marginLeft="10px";
        label019.style.color="white";
        label019.setAttribute("for", "Check019");
        label019.appendChild(document.createTextNode('Скрывать всплывающие окна'));
        checkbox019.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.HideAnyPopups","1");
            } else {
                localStorage.removeItem("BJ.HideAnyPopups");
                document.getElementById('HClockDiv').remove()
            }
        });
        if (localStorage.getItem("BJ.HideAnyPopups") !== null){checkbox019.checked=true;}




        var Div020 = document.createElement('div');
        var checkbox020 = document.createElement('input');
        checkbox020.type = "checkbox";
        checkbox020.id = "Check020";

        checkbox020.checked = localStorage.getItem('BJ.HideMeAway') !== null

        var label020 = document.createElement('label')
        label020.style.marginLeft="10px";
        label020.style.color="white";
        label020.setAttribute("for", "Check020");
        let clVal = 'DocToast(`<p>Сайт академии собирает не мало статистики, это явление наблюдается даже<br>без расширения, поэтому эта настройка постарается максимально приватизировать <br>действия на Journal (не полностью, всё что возможно) <br></br> Эта настройка плохо влияет на расширение, делая его медленным и нестабильным.<br>Не рекомендуется включать "Просто-так"</p> <br></br> Большую часть статистики нужно отключать вручную. Для этого нажмите Ctrl+Shift+I -> Элементы -> Прослушиватели событий, и удалите каждый элемент который видите в списке`)'
        label020.innerHTML="Частично запретить сайту Journal слежку действий <button style='width: 45px' onClick='"+clVal+"'>(?)</button>"
        checkbox020.addEventListener('change', function() {
            Toast('Для применения изменений перезагрузите страницу')
            if (this.checked) {
                localStorage.setItem("BJ.HideMeAway","1");
            } else {
                localStorage.removeItem("BJ.HideMeAway");
            }
        });



        var Div021 = document.createElement('div');
        var checkbox021 = document.createElement('input');
        checkbox021.type = "checkbox";
        checkbox021.id = "Check021";
        checkbox021.checked = localStorage.getItem('BJ.NotifiesAutoRead') !== null

        var label021 = document.createElement('label')
        label021.style.marginLeft="10px";
        label021.style.color="white";
        label021.setAttribute("for", "Check021");
        label021.innerHTML="Автоматически читать все уведомления"
        checkbox021.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.NotifiesAutoRead","1");
                ReadAllNews()
            } else {
                localStorage.removeItem("BJ.NotifiesAutoRead");
            }
        });


        var Div022 = document.createElement('div');
        var checkbox022 = document.createElement('input');
        checkbox022.type = "checkbox";
        checkbox022.id = "Check022";
        checkbox022.checked = localStorage.getItem("BJ.FunnySetting") !== null

        var label022 = document.createElement('label')
        label022.style.marginLeft="10px";
        label022.style.color="white";
        label022.setAttribute("for", "Check022");
        label022.appendChild(document.createTextNode('Весёлая настройка'));
        checkbox022.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.FunnySetting","1");
            } else {
                localStorage.removeItem("BJ.FunnySetting");
            }
        });

        var Div023 = document.createElement('div');
        var checkbox023 = document.createElement('input');
        checkbox023.type = "checkbox";
        checkbox023.id = "Check023";
        checkbox023.checked = localStorage.getItem("BJ.DontLoadNewHWTotalLine") !== null

        var label023 = document.createElement('label')
        label023.style.marginLeft="10px";
        label023.style.color="white";
        label023.setAttribute("for", "Check023");
        label023.appendChild(document.createTextNode('Пропускать загрузку новой статистики ДЗ на главном экране'));
        checkbox023.addEventListener('change', function() {
            if (this.checked) {
                localStorage.setItem("BJ.DontLoadNewHWTotalLine","1");
            } else {
                localStorage.removeItem("BJ.DontLoadNewHWTotalLine");
            }
        });


        var Div1 = document.createElement('div');
        const radio1 = document.createElement("input");
        radio1.type = "radio";
        radio1.name = "Themes";
        radio1.id = "Theme1";
        radio1.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",0); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===0){radio1.checked=true;}

        var label1 = document.createElement('label')
        label1.style.marginLeft="10px";
        label1.style.color="white";
        label1.setAttribute("for", "Theme1");
        label1.appendChild(document.createTextNode('Classic Gray Theme'));




        var Div2 = document.createElement('div');
        const radio2 = document.createElement("input");
        radio2.type = "radio";
        radio2.name = "Themes";
        radio2.id = "Theme2";
        radio2.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",1); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===1){radio2.checked=true;}
        var label2 = document.createElement('label')
        label2.style.marginLeft="10px";
        label2.style.color="white";
        label2.setAttribute("for", "Theme2");
        label2.appendChild(document.createTextNode('Light Mint Theme'));



        var Div3 = document.createElement('div');
        const radio3 = document.createElement("input");
        radio3.type = "radio";
        radio3.name = "Themes";
        radio3.id = "Theme3";
        radio3.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",2); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===2){radio3.checked=true;}
        var label3 = document.createElement('label')
        label3.style.marginLeft="10px";
        label3.style.color="white";
        label3.setAttribute("for", "Theme3");
        label3.appendChild(document.createTextNode('Rayan Gosling Theme'));

        var Div4 = document.createElement('div');
        const radio4 = document.createElement("input");
        radio4.type = "radio";
        radio4.name = "Themes";
        radio4.id = "Theme4";
        radio4.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",3); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===3){radio4.checked=true;}

        var label4 = document.createElement('label')
        label4.style.marginLeft="10px";
        label4.style.color="white";
        label4.setAttribute("for", "Theme4");
        label4.appendChild(document.createTextNode('Deep Ocean Theme'));


        var Div5 = document.createElement('div');
        const radio5 = document.createElement("input");
        radio5.type = "radio";
        radio5.name = "Themes";
        radio5.id = "Theme5";
        radio5.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",4); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===4){radio5.checked=true;}

        var label5 = document.createElement('label')
        label5.style.marginLeft="10px";
        label5.style.color="white";
        label5.setAttribute("for", "Theme5");
        label5.appendChild(document.createTextNode('Light Fire Theme'));


        var Div6 = document.createElement('div');
        const radio6 = document.createElement("input");
        radio6.type = "radio";
        radio6.name = "Themes";
        radio6.id = "Theme6";
        radio6.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",5); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===5){radio6.checked=true;}

        var label6 = document.createElement('label')
        label6.style.marginLeft="10px";
        label6.style.color="white";
        label6.setAttribute("for", "Theme6");
        label6.appendChild(document.createTextNode('Cloudly Weather Theme'));

        var Div7 = document.createElement('div');
        const radio7 = document.createElement("input");
        radio7.type = "radio";
        radio7.name = "Themes";
        radio7.id = "Theme7";
        radio7.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",6); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===6){radio7.checked=true;}

        var label7 = document.createElement('label')
        label7.style.marginLeft="10px";
        label7.style.color="white";
        label7.setAttribute("for", "Theme7");
        label7.appendChild(document.createTextNode('Space Black Theme'));

        var Div8 = document.createElement('div');
        const radio8 = document.createElement("input");
        radio8.type = "radio";
        radio8.name = "Themes";
        radio8.id = "Theme8";
        radio8.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",7); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===7){radio8.checked=true;}

        var label8 = document.createElement('label')
        label8.style.marginLeft="10px";
        label8.style.color="white";
        label8.setAttribute("for", "Theme8");
        label8.appendChild(document.createTextNode('Camp Fire Theme'));

        var Div11 = document.createElement('div');
        const radio11 = document.createElement("input");
        radio11.type = "radio";
        radio11.name = "Themes";
        radio11.id = "Theme11";
        radio11.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",8); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===8){radio11.checked=true;}

        var label11 = document.createElement('label')
        label11.style.marginLeft="10px";
        label11.style.color="white";
        label11.setAttribute("for", "Theme11");
        label11.appendChild(document.createTextNode('Red Apple Theme'));


        var Div12S = document.createElement('div');
        const radio12S = document.createElement("input");
        radio12S.type = "radio";
        radio12S.name = "Themes";
        radio12S.id = "Theme12S";
        radio12S.addEventListener('change', e => { if(e.target.checked){localStorage.setItem("BJ.SetStyle",9); localStorage.removeItem("BJ.CustomTheme"); SetAutoCustomThemeWidth()}});
        if (ThemeNum===9){radio12S.checked=true;}

        var label12S = document.createElement('label')
        label12S.style.marginLeft="10px";
        label12S.style.color="white";
        label12S.setAttribute("for", "Theme12S");
        label12S.appendChild(document.createTextNode('Early Rose Theme'));


        var DivCustomTheme = document.createElement('div');
        DivCustomTheme.id="DivCustomThemeID"
        const AllDivs=[Div1, Div2, Div3, Div4, Div5, Div6, Div7, Div8, Div11, Div12S, DivCustomTheme];
        AllThemeDivs=AllDivs;

        const radioCS = document.createElement("input");
        radioCS.type = "radio";
        radioCS.name = "Themes";
        radioCS.id = "ThemeCS";
        radioCS.addEventListener('change', e => {
            if(e.target.checked){
                for (const item of AllDivs){item.style.width="49%";}
                CustomTheme.style.width="49%";
            }
            if(false){
                for (const item of AllDivs){item.style.width="100%"}
                CustomTheme.style.width="0%";
            }});
        if (localStorage.getItem("BJ.CustomTheme") !==null){
            radioCS.checked=true;
            for (const item of AllDivs){item.style.width="48%";}
            CustomTheme.style.width="48%";

        }

        var labelCS = document.createElement('label')
        labelCS.style.marginLeft="10px";
        labelCS.style.color="white";
        labelCS.setAttribute("for", "ThemeCS");
        labelCS.appendChild(document.createTextNode('Своя тема'));



        Div00.appendChild(checkbox);
        Div00.appendChild(label);
        Div00.appendChild(HtmlApplyLink);
        Div00.appendChild(HtmlThemeChooseLink)
        Div00.appendChild(HtmlVideoLink);
        newDiv.appendChild(Div00);

        Div00_Live.appendChild(checkbox_Live)
        Div00_Live.appendChild(label_Live)
        newDiv.appendChild(Div00_Live);

        Div00_ColorMovement.appendChild(checkbox_ColorMovement)
        Div00_ColorMovement.appendChild(FlexDiv)
        newDiv.appendChild(Div00_ColorMovement);

        Div01.appendChild(checkbox2);
        Div01.appendChild(label0);
        newDiv.appendChild(Div01);




        Div03.appendChild(checkbox03);
        Div03.appendChild(label03);
        newDiv.appendChild(Div03);
        if (localStorage.getItem("BJ.TransparentPanel")!==null){TransSet();}


        Div04.appendChild(checkbox04);
        Div04.appendChild(label04);
        newDiv.appendChild(Div04);

        if(document.getElementsByClassName("select-univercity")[1].textContent === 'Группа: 9/2-РПО-23/1' || document.getElementsByClassName("select-univercity")[1].textContent === 'Группа: 9/1-РПО-23/1'){
            Div000.appendChild(checkbox000);
            Div000.appendChild(label000);
            Div000.appendChild(ALM_Name);
            newDiv.appendChild(Div000);
        } else {
            SettingHeight=SettingHeight-55;
        }



        Div9.appendChild(checkbox9);
        Div9.appendChild(label9);
        Div9.appendChild(AVTLink);
        newDiv.appendChild(Div9);

        Div10.appendChild(checkbox10);
        Div10.appendChild(label10);
        newDiv.appendChild(Div10);

        Div12.appendChild(checkbox12);
        Div12.appendChild(label12);
        newDiv.appendChild(Div12);

        Div13.appendChild(checkbox13);
        Div13.appendChild(label13);
        newDiv.appendChild(Div13);

        Div15.appendChild(checkbox15);
        Div15.appendChild(label15);
        newDiv.appendChild(Div15);


        Div14.appendChild(checkbox14);
        Div14.appendChild(label14);
        newDiv.appendChild(Div14);



        Div17.appendChild(checkbox17);
        Div17.appendChild(label17);
        newDiv.appendChild(Div17);

        Div18.appendChild(checkbox18);
        Div18.appendChild(label18);
        newDiv.appendChild(Div18);

        Div19.appendChild(checkbox19);
        Div19.appendChild(label19);
        Div19.appendChild(BarLink);
        newDiv.appendChild(Div19);
        newDiv.appendChild(CustomTheme);


        Div020.appendChild(checkbox020);
        Div020.appendChild(label020);
        newDiv.appendChild(Div020);


        Div021.appendChild(checkbox021);
        Div021.appendChild(label021);
        newDiv.appendChild(Div021);


        Div014.appendChild(checkbox014);
        Div014.appendChild(label014);
        newDiv.appendChild(Div014);

        Div015.appendChild(checkbox015);
        Div015.appendChild(label015);
        newDiv.appendChild(Div015);

        Div016.appendChild(checkbox016);
        Div016.appendChild(label016);
        newDiv.appendChild(Div016);

        Div017.appendChild(checkbox017);
        Div017.appendChild(label017);
        newDiv.appendChild(Div017);

        Div017_1.appendChild(checkbox017_1);
        Div017_1.appendChild(label017_1);
        newDiv.appendChild(Div017_1);

        Div023.appendChild(checkbox023);
        Div023.appendChild(label023);
        newDiv.appendChild(Div023);

        Div018.appendChild(checkbox018);
        Div018.appendChild(label018);
        newDiv.appendChild(Div018);




        Div022.appendChild(checkbox022);
        Div022.appendChild(label022);
        if (randomIntFromInterval(0,1) === 1 || localStorage.getItem('BJ.FunnySetting') !== null) {newDiv.appendChild(Div022);}

        Div1.appendChild(radio1);
        Div1.appendChild(label1);
        Div1.style.width="100%";
        Div1.style.transition="all 1s";
        Div1.style.background="#333333";
        newDiv.appendChild(Div1);

        Div2.appendChild(radio2);
        Div2.appendChild(label2);
        Div2.style.width="100%";
        Div2.style.transition="all 1s";
        Div2.style.background="#357068a4";
        newDiv.appendChild(Div2);

        Div3.appendChild(radio3);
        Div3.appendChild(label3);
        Div3.style.background="#583B53a4";
        Div3.style.width="100%";
        Div3.style.transition="all 1s";
        newDiv.appendChild(Div3);

        Div4.appendChild(radio4);
        Div4.appendChild(label4);
        Div4.style.width="100%";
        Div4.style.transition="all 1s";
        Div4.style.background="#2A5B90a4";
        newDiv.appendChild(Div4);

        Div5.appendChild(radio5);
        Div5.appendChild(label5);
        Div5.style.background="#895615a4";
        Div5.style.width="100%";
        Div5.style.transition="all 1s";
        newDiv.appendChild(Div5);
        newDiv.style.display="none";

        Div6.appendChild(radio6);
        Div6.appendChild(label6);
        Div6.style.background="#333333a9";
        Div6.style.width="100%";
        Div6.style.transition="all 1s";
        newDiv.appendChild(Div6);
        newDiv.style.display="none";

        Div7.appendChild(radio7);
        Div7.appendChild(label7);
        Div7.style.background="#100A43a9";
        newDiv.appendChild(Div7);
        Div7.style.width="100%";
        Div7.style.transition="all 1s";
        newDiv.style.display="none";

        Div8.appendChild(radio8);
        Div8.appendChild(label8);
        Div8.style.width="100%";
        Div8.style.transition="all 1s";
        Div8.style.background="#B96622a4";
        newDiv.appendChild(Div8);
        newDiv.style.display="none";


        Div11.appendChild(radio11);
        Div11.style.width="100%";
        Div11.style.transition="all 1s";
        Div11.appendChild(label11);
        Div11.style.background="#C81E1Ea4";
        newDiv.appendChild(Div11);
        newDiv.style.display="none";

        Div12S.appendChild(radio12S);
        Div12S.style.width="100%";
        Div12S.style.transition="all 1s";
        Div12S.appendChild(label12S);
        Div12S.style.background="#b2707080";
        newDiv.appendChild(Div12S);
        newDiv.style.display="none";

        DivCustomTheme.appendChild(radioCS);
        DivCustomTheme.style.width="100%";
        DivCustomTheme.style.transition="all 1s";
        DivCustomTheme.appendChild(labelCS);
        DivCustomTheme.style.background="-webkit-gradient(linear, 0% 0%, 100% 0%, from(rgb(18 194 68)), to(rgb(73 30 232)))";
        newDiv.appendChild(DivCustomTheme);
        newDiv.style.display="none";

        let Nums=0;
        CustomTheme.style.height=((AllDivs.length)*32)+"px";
        for (const item of AllDivs){
            if (Nums===0){
                item.style.borderStartStartRadius="18px";
                item.style.borderStartEndRadius="18px";
            } else {
                if (Nums===(AllDivs.length-1)){
                    item.style.borderEndStartRadius="18px";
                    item.style.borderEndEndRadius="18px";
                }
            }
            item.style.paddingLeft="10px";
            Nums=Nums+1;
        }
        SettingHeight=SettingHeight+"px";
        MainFloat.before(newDiv);

        const MainBgAccentPicker = document.getElementById("MainClolorSwitch");
        const Accent0Picker = document.getElementById("Accent0Switch");
        const Accent1Picker = document.getElementById("Accent1Switch");
        const Accent2Picker = document.getElementById("Accent2Switch");
        const Accent3Picker = document.getElementById("Accent3Switch");

        MainBgAccentPicker.addEventListener("input", function(){
            Accent_MainBg=MainBgAccentPicker.value+localStorage.getItem("BJ.CustomThemeTransparency");
            localStorage.setItem("BJ.CustomTheme", MainBgAccentPicker.value+"|"+Accent0Picker.value+"|"+Accent1Picker.value+"|"+Accent2Picker.value+"|"+Accent3Picker.value);
            SetStyle(-9)
        }, false);

        Accent0Picker.addEventListener("input", function(){
            Accent_MainBg=Accent0Picker.value+localStorage.getItem("BJ.CustomThemeTransparency");
            localStorage.setItem("BJ.CustomTheme", MainBgAccentPicker.value+"|"+Accent0Picker.value+"|"+Accent1Picker.value+"|"+Accent2Picker.value+"|"+Accent3Picker.value);
            SetStyle(-9)
        }, false);

        Accent1Picker.addEventListener("input", function(){
            Accent_MainBg=Accent1Picker.value+localStorage.getItem("BJ.CustomThemeTransparency");
            localStorage.setItem("BJ.CustomTheme", MainBgAccentPicker.value+"|"+Accent0Picker.value+"|"+Accent1Picker.value+"|"+Accent2Picker.value+"|"+Accent3Picker.value);
            SetStyle(-9)
        }, false);

        Accent2Picker.addEventListener("input", function(){
            Accent_MainBg=Accent2Picker.value+localStorage.getItem("BJ.CustomThemeTransparency");
            localStorage.setItem("BJ.CustomTheme", MainBgAccentPicker.value+"|"+Accent0Picker.value+"|"+Accent1Picker.value+"|"+Accent2Picker.value+"|"+Accent3Picker.value);
            SetStyle(-9)
        }, false);

        Accent3Picker.addEventListener("input", function(){
            Accent_MainBg=Accent3Picker.value+localStorage.getItem("BJ.CustomThemeTransparency");
            localStorage.setItem("BJ.CustomTheme", MainBgAccentPicker.value+"|"+Accent0Picker.value+"|"+Accent1Picker.value+"|"+Accent2Picker.value+"|"+Accent3Picker.value);
            SetStyle(-9)
        }, false);

        document.getElementById('AccentTransparencySwitch').addEventListener("input", function(){
            document.getElementById('TransparencyValue').textContent = this.value +'%'
            let fixedValue = (Number(this.value)).toFixed(0)
            if (fixedValue<10) {fixedValue = '0'+fixedValue}
            localStorage.setItem("BJ.CustomThemeTransparency", fixedValue)
            SetStyle(-9)
        }, false);

        if (localStorage.getItem("BJ.CustomTheme") !==null){
            for (const item of AllDivs){item.style.width="49%";}
            CustomTheme.style.width="49%";
        }


        if (localStorage.getItem("BJ.ColorMovementDegrees") === null) ColorMovementSlider.disabled = true
        else {window.ColorMovementChange(Number(localStorage.getItem("BJ.ColorMovementDegrees"))); document.getElementById('ColorMovementSliderID').value = localStorage.getItem("BJ.ColorMovementDegrees")}
        if (localStorage.getItem("BJ.TransparentPanel") !== null){ window.CreateTransparencyListener(); }
    } catch(e) {console.error(e)}
}



function SetStyle(StyleNumber){
    try{
        const SmthChanged=false;
        Accent_MainBg="#333333";
        Accent0="#3b3b3b";
        Accent1="#333333";
        Accent2="#222222";
        Accent3="#101010";



        if (localStorage.getItem("BJ.CustomTheme") === null){localStorage.setItem("BJ.DefStyle", StyleNumber)}

        if(StyleNumber==1){// Grass
            Accent_MainBg="#1B453Fa9";
            Accent0="#357068a4";
            Accent1="#0C373Da9";
            Accent2="#1F6F63a9";
            Accent3="#126054a9";
        }

        if(StyleNumber==2){// Cherry
            Accent_MainBg="#380E32a9";
            Accent0="#583B53a4";
            Accent1="#362533A9";
            Accent2="#450D3Aa9";
            Accent3="#340A2Ca9";
        }

        if(StyleNumber==3){// Ocean
            Accent_MainBg="#203D5Da9";
            Accent0="#2A5B90a4";
            Accent1="#234F81a9";
            Accent2="#133E6Da9";
            Accent3="#062A52a9";
        }

        if(StyleNumber==4){// Fire
            Accent_MainBg="#3C1D01a9";
            Accent0="#895615a4";
            Accent1="#74460Ca9";
            Accent2="#613A09a9";
            Accent3="#4E2E06a9";
        }

        if(StyleNumber==5){// Cloudly
            Accent_MainBg="#333333a9";
            Accent0="#3b3b3ba4";
            Accent1="#333333a9";
            Accent2="#222222a9";
            Accent3="#101010a9";
        }

        if(StyleNumber==6){// Space Black
            Accent_MainBg="#14092Ea9";
            Accent0="#160F51a4";
            Accent1="#100A43a9";
            Accent2="#140834a9";
            Accent3="#0C0524a9";
        }
        if(StyleNumber==7){// Camp Fire
            Accent_MainBg="#78260080";//78260080
            Accent0="#B96622a4";//B96622a4
            Accent1="#A55A1Da9";//A55A1Da9
            Accent2="#904D17a9";//904D17a9
            Accent3="#7A3F10a9";//7A3F10a9
        }
        if(StyleNumber==8){// Red Apple
            Accent_MainBg="#6b000040";//78260080
            Accent0="#C81E1Ea4";//B96622a4
            Accent1="#cc0000a9";//A55A1Da9
            Accent2="#800000a9";//904D17a9
            Accent3="#330000a9";//7A3F10a9
        }
        if(StyleNumber==9){// Cloudly
            Accent_MainBg="#df626280";//78260080
            Accent0="#b2707080";//B96622a4
            Accent1="#a26d6d80";//A55A1Da9
            Accent2="#92545480";//904D17a9
            Accent3="#78454580";//7A3F10a9
        }
        if(localStorage.getItem("BJ.CustomTheme") !== null){// Cloudly
            let TrancparensyValue = localStorage.getItem("BJ.CustomThemeTransparency")
            if (TrancparensyValue === null) {TrancparensyValue="80"}

            var CustomColors = (localStorage.getItem("BJ.CustomTheme")).split("|")


            console.log(CustomColors[0]+TrancparensyValue, CustomColors[1]+TrancparensyValue, CustomColors[2]+TrancparensyValue, CustomColors[3]+TrancparensyValue, CustomColors[4]+TrancparensyValue)
            Accent_MainBg=CustomColors[0]+TrancparensyValue;//78260080
            Accent0=CustomColors[1]+TrancparensyValue;//B96622a4
            Accent1=CustomColors[2]+TrancparensyValue;//A55A1Da9
            Accent2=CustomColors[3]+TrancparensyValue;//904D17a9
            Accent3=CustomColors[4]+TrancparensyValue;//7A3F10a9
        }else{
            try{
                document.getElementById("CustomThemeDivId").style.background=Accent_MainBg;
                document.getElementById("MainClolorSwitch").value=Accent_MainBg.slice(0,7);
                document.getElementById("Accent0Switch").value=Accent0.slice(0,7);
                document.getElementById("Accent1Switch").value=Accent1.slice(0,7);
                document.getElementById("Accent2Switch").value=Accent2.slice(0,7);
                document.getElementById("Accent3Switch").value=Accent3.slice(0,7);

            }catch(e){}
        }
        document.getElementById("OpenSettings_BJ").style.background=Accent3;
    }catch(e){}
    localStorage.setItem("BJ.SetStyle","-inf");
}


//SendPacket()
function SendPacket(URL, Type, JSONVals, RefreshBearer){
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();
        xhr.open(Type, URL);
        xhr.setRequestHeader('authority', 'msapi.top-academy.ru');
        xhr.setRequestHeader('method', Type);
        xhr.setRequestHeader('path', '/api/v2/auth/login');
        xhr.setRequestHeader('scheme', 'https');
        xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader('Accept-Language', 'ru_RU, ru');
        xhr.setRequestHeader('Authorization', 'Bearer '+LoadedBearer);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject({status: xhr.status, error: xhr.statusText});
                }
            }
        };
        xhr.onerror = () => reject(xhr.statusText);

        if (JSONVals!==null && JSONVals!== undefined) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            let requestBody = JSONVals
            if (typeof(JSONVals) === 'string') {requestBody = JSON.parse(JSONVals);}
            xhr.send(JSON.stringify(requestBody));
        } else {
            xhr.send();
        }
        if (RefreshBearer) {GetBearer()}

    });

}




function ReadAllNews(){
    SendPacket('https://msapi.top-academy.ru/api/v2/news/operations/latest-news', 'GET', null, false).then(response => {
        const list = JSON.parse(response);
        for (let i = 0; i < list.length; i++) {
            let news_id_number = Number(list[i].id_bbs);
            let sendValue = { news_id: news_id_number };
            SendPacket('https://msapi.top-academy.ru/api/v2/news/operations/set-view', 'POST', sendValue, false).then(s=>{console.log('sucsessfully readed!')}).catch(e=>{});
        }
    }).catch(e => {});
}

window.ShowHomework = function(LessonName, name, url){
    window.YesThisImageIsNotImage = function(){
        document.getElementById('IsItImageLoader').style.display='none'
        document.getElementById('ImageNotSucsess').textContent='Это домашнее задание не имеет изображения'
    }
    window.YesThisImageIsImage = function(){
        document.getElementById('IsItImageLoader').style.opacity=1
        document.getElementById('ImageNotSucsess').textContent=''
    }

    DocToast('<div><h4>'+LessonName+'</h4><h6>'+name+`</h6></div><br>
    <p id="ImageNotSucsess">Проверка задания на наличие изображения...</p>
    <img style="opacity: 1" onload="window.YesThisImageIsImage()" src="`+url+`" id="IsItImageLoader" onerror="window.YesThisImageIsNotImage()"> </img>
    `)
}

window.RegImages = function(){ShowImagesInHomework()}

function ShowImagesInHomework(){
    let current_list = document.querySelectorAll('.col.d-flex.flex-column.item.iphone-click.status3')
    let missed_list = document.querySelectorAll('.col.d-flex.flex-column.item.iphone-click.status0')
    let oncheck_list = document.querySelectorAll('.col.d-flex.flex-column.item.iphone-click.status2')
    let checked_list = document.querySelectorAll('.col.d-flex.flex-column.item.iphone-click.status1')
    let passed_list = document.querySelectorAll('.col.d-flex.flex-column.item.iphone-click.status5')

    //For CurrentList
    let currentListMax = undefined;
    SendPacket('https://msapi.top-academy.ru/api/v2/count/page-counters?counter_type=100', 'GET', null, false).then(maxValueOf => {
        maxValueOf = new Function('return ' + maxValueOf)();
        currentListMax = maxValueOf.counter

        SendPacket('https://msapi.top-academy.ru/api/v2/homework/operations/list?page=1&status=3&type=0&group_id=9', 'GET', null, false).then(r => {
            r = new Function('return ' + r)();
            for (let i = 0; i < current_list.length; i++){
                let item = r[i]
                let div = document.createElement('div')
                div.style="position:absolute; top: 40px"
                let clickval = `ShowHomework('`+item.name_spec+`','`+item.completion_time+`','`+item.file_path+`')`
                div.innerHTML=`<img style="width:40px;" id="ImgPreview`+i+`" src="https://github.com/0mnr0/WallpaperInJournal/blob/main/res/pear.png?raw=true" onclick="`+clickval+`"></img>`
                current_list[i].appendChild(div)
            }

        })
    })

}



function GetBearer(){
    try{
        var Bearer = null;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://msapi.top-academy.ru/api/v2/auth/login');
        xhr.setRequestHeader('path', '/api/v2/auth/login');
        xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader('Accept-Language', 'ru_RU, ru');
        xhr.setRequestHeader('Authorization', 'Bearer null');
        xhr.setRequestHeader('Content-Type', 'application/json');

        const requestBody = {
            "application_key": "6a56a5df2667e65aab73ce76d1dd737f7d1faef9c52e8b8c55ac75f565d8e8a6",
            "id_city": null,
            "password": localStorage.getItem("BJ.PCAPassword"),
            "username": localStorage.getItem("BJ.PCALogin")
        }
        xhr.send(JSON.stringify(requestBody));


        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                Bearer=JSON.parse(xhr.responseText).access_token;
                UserCId=JSON.parse(xhr.responseText).city_data.id_city;
                var Status=JSON.parse(xhr.responseText).status;
                if (Status === "401" || Status === 401){GetBearer()}
                else{LoadedBearer=Bearer}
            }
        });

        setTimeout(function(){return (Bearer)} , 100)

    }catch(e){
        return -1;
        setTimeout(GetBearer, 1000)
    }
}



function CheckUpdateSystem(){
    if (!IgnoreUpdate){
        fetch('https://greasyfork.org/ru/scripts/479183-better-journal', {method: 'GET'})
            .then(response => response.text())
            .then(data => {
            var versionRegex = /<dt class="script-show-version"><span>Версия<\/span><\/dt>\s+<dd class="script-show-version"><span>(.*?)<\/span><\/dd>/;
            var match = data.match(versionRegex);

            if (match) {
                var version = match[1];
                if (version!==Version){
                    if (version!==""){
                        UpdateFound=true;
                        if (document.getElementById("CheckUpdates_BJ") !== null){
                            document.getElementById("CheckUpdates_BJ").style.display="none";
                        }
                    }
                }
            } else {
                UpdateFound=false;
            }
        }).catch(error => {});
    }
}

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}


window.GetBearer = function(){return LoadedBearer}

function LoadDefult(){
    try{

        let percentToDo = 0;
        let percentInReview = 0;
        let percentOverdue = 0;
        let percentChecked = 0;
        if (document.querySelector("span.all-count")!==null && document.getElementById("HomeworkContentID") !== null && document.getElementById("HomeworkContentID").innerHTML === '' || document.querySelector("span.all-count")!==null && document.getElementById("CPB_BJ") === null || document.getElementById("CPB_BJ") !== null && document.querySelector("span.all-count")!==null && Ticks%100 === 0 ){
            let totalAssignments = Number(document.querySelector("span.all-count").textContent);
            if (totalAssignments === 0) {totalAssignments=1;}
            let toDo = Number(document.querySelector("span.open").textContent);
            let inReview = Number(document.querySelector("span.inspection").textContent);
            let overdue = Number(document.querySelector("span.lose").textContent);
            let checked = Number(document.querySelector("span.done").textContent);
            checked = checked + (totalAssignments - toDo - inReview - overdue - checked)

            percentToDo = (toDo / totalAssignments) * 100;
            percentInReview = (inReview / totalAssignments) * 100;
            percentOverdue = (overdue / totalAssignments) * 100;
            percentChecked = (checked / totalAssignments) * 100;


            if (document.getElementById("HomeworkContentID")!==null || Ticks%100 === 0) {
                document.getElementById("HomeworkContentID").innerHTML=`<h5 style="margin-top: 10px"></font><b><font color="#d772cf">Текущие: `+toDo+`</font>, <font color="#f5d47d">На проверке: `+inReview+`</font>, <font color="#d91842">Просрочено: `+overdue+`</font>, <font color="#188194">Проверено: `+checked+`</font></b>, <b><font color="#188194">Всего: `+totalAssignments+`</font></b></h5>`
            }
        }


        if (document.getElementById("CPB_BJ") === null && document.querySelector("span.all-count")!==null || document.getElementById("CPB_BJ") !== null && document.querySelector("span.all-count")!==null && Ticks%100 === 0 ) {
            var styleTag2 = null;
            if (document.getElementById("CPB_BJ") === null){
                styleTag2 = document.createElement('style');
            } else {
                styleTag2 = document.getElementById("CPB_BJ");
            }



            var CustomProgressBar=`
.bar {width: 100%;height: 13px; border-radius: 20px; background-color: #b3b3b3;color: white;text-align: center; margin-top: 10px;}
.OpenedHW {width: `+percentToDo+`%;
        height: 100%;
        background-color: #d772cf;
        float: left;
        transition: all 2s;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

.Checking {
        width: `+percentInReview+`%;
        height: 100%;
        background-color: #f5d47d;
        transition: all 2s;
        float: left;
    }

.Outdated {
        width: `+percentOverdue+`%;
        height: 100%;
        background-color: #d91842;
        transition: all 2s;
        float: left;
}
.CheckedHWs {
        width: `+percentChecked+`%;
        height: 100%;
        background-color: #188194;
        border-top-right-radius: 8px;
        transition: all 2s;
        border-bottom-right-radius: 8px;
        float: left;
}

img#Pear{
animation: PearAnim 2s ease-in-out infinite;
}

@keyframes PearAnim {
  0% {
    scale: 0.8;
  }
  50% {
    scale: 1.2;
  }
  100% {
    scale: 0.8;
   }
}

`;


            if (percentToDo === 0){
                CustomProgressBar=CustomProgressBar+`
                .Checking {border-top-left-radius: 10px; border-bottom-left-radius: 10px;}
                `;
            }
            if (percentInReview === 0 && percentToDo === 0){
                CustomProgressBar=CustomProgressBar+`
                .Outdated {border-top-left-radius: 10px; border-bottom-left-radius: 10px;}
                `;
            }
            if (percentOverdue === 0 && percentInReview === 0 && percentToDo === 0){
                CustomProgressBar=CustomProgressBar+`
                .CheckedHWs {border-top-left-radius: 10px; border-bottom-left-radius: 10px;}
                `;
            }
            if (document.getElementById("CPB_BJ") === null){
                styleTag2.id = 'CPB_BJ';
                var dynamicStyleCss2 = document.createTextNode(CustomProgressBar);
                styleTag2.appendChild(dynamicStyleCss2);
                var header2 = document.getElementsByTagName('body')[0];
                header2.appendChild(styleTag2);
            } else {
                styleTag2.textContent=CustomProgressBar;
            }
        }
        if (document.getElementById("FontIsLoaded") === null){
            var FontLoader = document.createElement('link')
            FontLoader.href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300;1,300&display=swap"
            FontLoader.rel="stylesheet";
            document.querySelector('head').appendChild(FontLoader)
            FontLoader.id="FontIsLoaded";
        }
        var days = ['Вc','Пн','Вт','Ср','Чт','Пт','Сб'];
        var n = new Date().getDay();
        var curTime = new Date().toLocaleTimeString('en-US', {hour12: false, hour: '2-digit', minute: '2-digit'});
        if (localStorage.getItem("BJ.ShowMiniClock") !== null && document.getElementById('HClockDiv') === null && Ticks%20 === 0) {
            var HClock = document.createElement('div')
            HClock.className='noselect'
            HClock.id='HClockDiv';
            HClock.style='position: fixed; bottom: 50px; z-index: 1000; right: 50px; font-size: 45px'
            HClock.innerHTML='<span id="HClock">'+curTime+'<span style="font-size: 10px">'+days[n]+'</span></span>'
            document.body.appendChild(HClock)
        } else if (localStorage.getItem("BJ.ShowMiniClock") !== null && document.getElementById('HClock') !== null && Ticks%20 === 0){
            document.getElementById('HClock').innerHTML='<span id="HClock">'+curTime+'<span style="font-size: 10px">'+days[n]+'</span></span>'
        }//Defs()

        var DeafContent=`
body {background: black}
button#stucked {z-index: 3; position: relative; background: `+Accent3+`; color: white}
* { font-family: Rubik !important;}
.header {position: relative; z-index: 3}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}

.message button {
    margin: 2px;
}

input {outline: none !important}

.avatar {height: 65px; width: 65px}

button {cursor: pointer}


.HighLightedText {
    background: transparent;
    border: 2px solid;
    color: wheat;
    border-radius: 10px;
    display: inline-block;
    line-height: 15px;
    margin-left: 2px;
    padding-inline: 5px;
}

.modal-title, .title-block p {color: white}
button#OpenSettings_BJ:hover {scale: 1.05; rotate: 15deg}
::-webkit-scrollbar {background: `+Accent3.slice(0,4)+` !important; border-radius: 15px; width: 7px;}
::-webkit-scrollbar-thumb {background: `+Accent0.slice(0,4)+` !important; border-radius: 15px; -webkit-box-shadow: none;}
.progress-section .lessons-by-subjects th, .progress-section .lessons-by-subjects__grade {background: `+Accent1+`}
.progress-section .lessons-by-subjects__grade.pass {background: #b27070}
.progress-section .lessons-by-subjects__grade.lateness {background: #a8a457}
.progress-section .lessons-by-subjects .rating__control-work {background: #6ebd79}

.toast-container .toast, .toast-container .toast:hover  {background-color: `+Accent2+`; border-radius: 20px; color:white; box-shadow: 0 0 12px `+Accent3+`; width: auto;}
.toast-container .toast {padding: 10px 15px 10px 50px}
.dropdown-menu {background: `+Accent1+` !important; border-radius: 200px; min-width: auto !important; color: white;}
a.dropdown-item.selected-leng {color:white !important}
.toast-container .toast .ng-star-inserted {margin: inherit}
.toast-container .toast .notification-success {height: 0px}
.text-homework-wrap, .text-homework-answer-wrap {background: `+Accent0+`;padding: 20px;border-radius: 30px;}
.toast-container .toast .ng-star-inserted .message {padding-left: 47px; padding-bottom: 25px}
.wrap-counts {background-color: `+Accent_MainBg+`}
.my-purchases .accordion .panel-group .panel {background: transparent; border-radius: 20px}
.my-purchases .accordion .panel-group .panel .card .card-header, .card-body {color: white; background: `+Accent3+`}
.my-purchases .accordion .panel-group .panel .card .card-header * {color: white}
.my-purchases .accordion .header-accordion .detailed {width: auto}
.my-purchases .accordion .header-accordion {margin-bottom: 10px}
.my-purchases {padding-bottom: 0px}
.modal-product .product-block .product-img .on-hover {display: none}
.text-homework-wrap .center h6, .text-homework-answer-wrap .center h6 {color: wheat}
.text-homework-wrap .center .file-drop-description, .text-homework-answer-wrap .center .file-drop-description {color: white}
a.button.malachite.referral-link{display:none}
.my-purchases .accordion .panel-group .panel .card .show {background: transparent}
.my-purchases .accordion .panel-group .panel .card .show .card-body .product .number span {background: `+Accent3+`}
.btn-malachite, .signal-section .item .signal-form-container .body-form form .submit .button-block button, button, .homework-help, .homework-help, a.button.malachite.referral-link {border-radius: 4000px !important;}
.navbar {background-color: `+Accent0+`; color: white; box-shadow = 1px 1px 15px rgb(66 66 66); margin=0 auto; width=fit-content}
nav.navbar.navbar-expand-lg.justify-content-between{color:white}
html{background: `+Accent_MainBg.slice(0,7)+`}
button#CheckUpdates_BJ {background-color: `+Accent_MainBg+` !important}
div#SettingsID {background-color: `+Accent0+` !important}
input {background: `+Accent3+` !important}
.homeworks-section .item-homework .item-container .item .item-header .name-spec {width: 68%}
.homeworks-section .item-homework .item-container .item .item-header .name-spec .all-name-spec {top: -80%; left: 0%; border-radius: 12px;}
.wrap {background-color: `+Accent_MainBg.slice(0,7)+`}
button#AllVideoPlayGrounds {background-color: `+Accent0+`}
span{color: white !important}
div#CustomThemeDivId {background: `+Accent_MainBg+` !important; bottom: -35px}
.info-content {left: 0% !important; height: fit-content; background: `+Accent3.slice(0,7)+` !important; border-radius: 22px !important}
.homeworks-section .item-homework .item-container .item .item-header .info-content .footer-info {padding-bottom: 10px; border: solid 2px `+Accent0.slice(0.7)+`; border-radius: 15px; text-align: center; margin-left: -10px; margin-right: -10px}
span.dropdown.dropdown-langs {display: none}
.homeworks-section .item-homework .show-more {border: solid 2px `+Accent0.slice(0,7)+`; padding: 4px; border-radius: 12px; background: `+Accent_MainBg+`; color: white;  padding-left:10px; padding-right:10px;}
span.badge-counter {background: `+Accent0.slice(0,7)+` !important}
p.title {font-size: 20px; background: `+Accent_MainBg+`; margin: 0; width: fit-content; padding: 3px; z-index: 2; position: relative; padding-left: 20px; padding-right: 20px; border-radius: 12px;border: solid 2px `+Accent0+`}
.sidebar-parent-block .sidebar .sidebar-content .shop-nav-link .shop-image, .sidebar-parent-block .sidebar.active .sidebar-content .shop-nav-link .shop-image {background: `+Accent0.slice(0,7)+`}
.sidebar-parent-block .sidebar.active ul.sidebar-nav li a:before, .sidebar-parent-block .sidebar ul.sidebar-nav li a:before {background-color: `+Accent0.slice(0,7)+`}
.sidebar-parent-block .sidebar.active ul.sidebar-nav li:hover a:before, .sidebar-parent-block .sidebar.active .open-sidebar-nav li .active::before {background-color: `+Accent0.slice(0,7)+`}
.sidebar-parent-block .sidebar.active .open-sidebar-nav li .active {background: `+Accent3+`; padding: 2px; border-radius: 10px; border-bottom: none; width: min-content; display: block}
.sidebar-parent-block .sidebar ul.sidebar-nav li .side-text {overflow: visible}
.homepage-wrapper .part-homeworks .homeworks-content .count-holder.items .open {color: #d772cf !important}
.homepage-wrapper .part-homeworks .homeworks-content .count-holder.items .done {color: #188194 !important}
.homepage-wrapper .part-homeworks .homeworks-content .count-holder.items .inspection {color: #f5d47d !important}
.homepage-wrapper .part-homeworks .homeworks-content .count-holder.items .lose {color: #d91842 !important}
.interview-content {background-color: `+Accent0+` !important; border-radius: 15px; color: white;}
.profile-item a span.badge-counter {display: none}
h1.display-2.py-2.text-truncate.m-5 {color: `+Accent3.slice(0,7)+`}
.auth-decoration {border-top: 15px solid `+Accent0.slice(0,7)+`;border-right: 15px solid `+Accent0.slice(0,7)+`;}
.btn-auth {background-color: `+Accent_MainBg.slice(0,7)+`; border:none; padding-left: 25px; padding-right: 25px; transition: all .3s}
.btn-auth:hover {scale: 1.08}
.btn-primary:hover {background-color: `+Accent3.slice(0,7)+`; border:none}
 .test-block .item .content-test-block {background-color: `+Accent0+`; border-radius: 25px;}
 div#SettingsID div label, div#SettingsID div checkbox, div#SettingsID div button {white-space: nowrap}
 .content-test-block *{color: white}
 .test-block .item .content-test-block .footer-question .list ul .active, .test-block .item .content-test-block .footer-question .finish button {background-color: `+Accent3+`}
 .test-block .item .content-test-block .answers input:checked ~ .text-answers {color: wheat}
.modal-content {background: transparent;}
.photo-requirments-info-content {background: `+Accent2+` !important}
a#UpdateButtonCreatedBJ {background-color: `+Accent_MainBg+`}
.test-block .item .content-test-block .answers textarea {background-color: `+Accent3+`; color: white; border-radius: 25px; }
.LeaderSwitch {background: `+Accent2+`;border: solid 3px `+Accent1+`; padding: 4px; border-radius: 10px; cursor: pointer}
.homepage-wrapper .inner:hover, button#SaveButtonInSettings:hover {scale: 1.012}
.homepage-wrapper .inner .part-rating .rating-content .rating p {color: white}
.homepage-wrapper .part-payments .payments-content .info-circle p {color: white}
.form-control {color: white !important; background: `+Accent2+` !important; transition: all .3s; border: solid 2px `+Accent3+`; border-radius: 5px}
.form-control:focus {border: solid 2px `+Accent1+`}
.form-control:hover{scale: 1.02; border: solid 2px `+Accent2+`}
.form-control:active{scale: 1.04; border: solid 2px `+Accent0+`}
.avatar {cursor: pointer}
/* Change the white to any color */
input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus,input:-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px `+Accent1+` inset !important;
    color: white !important;
}
bs-tooltip-container.tooltip.in.tooltip-top.bs-tooltip-top.top.market-tooltip.show {background: transparent !important}
ul.sidebar-nav.open-sidebar-nav li { scale: 1.0; transition: scale .3s; }
ul.sidebar-nav.open-sidebar-nav li:hover { scale: 1.08; }

.homeworks-section .items-homework .item-container .item {background: transparent}
.homeworks-section .items-homework .item-container .item .item-header .name-spec:hover .all-name-spec {background: `+Accent1+`}
.homeworks-section .items-homework .item-container .item-footer {background: transparent !important; border-end-end-radius: 20px; border-end-start-radius: 20px}
.homeworks-section .items-homework .item-container .item .on-hover {background: `+Accent1+`}
.text-homework-wrap .text-homework-title, .text-homework-answer-wrap .text-homework-title {color: white}

.homeworks-section .items-homework .item-container .item {background: `+Accent1+`; border-radius: 20px}
.homeworks-section .items-homework .item-container .item .item-header {
background: transparent
}

button {border: solid 2px `+Accent3+`; outline: none !important}
button.DocToastClickOK{float: right; min-width: fit-content; margin-top: 12px; position: relative; background: `+Accent3+`; color: wheat; width: 25%; border-radius: 10px !important; cursor: pointer; transition: all .3s}
button.DocToastClickOK:hover{border: solid 2px wheat}
.homepage-wrapper .part-payments .payments-content .pay-image, .homepage-wrapper .part-payments .payments-content .cards .card-item.card1, .homepage-wrapper .part-payments .payments-content .cards .card-item.card2 {background: `+Accent_MainBg.slice(0,7)+` !important}
.TextOnImg {
top: 80%;
width: 100%;
}
.overflow {position: relative; z-index: 2;}
.wrap[_ngcontent-c6] {border-radius: 10px; background: `+Accent3+`; position: relative; z-index: 3}
.homeworks-section .items-homework .item-container .item .item-header .info-content .header-info, .homeworks-section .items-homework .item-container .item .item-header .info-content p {color: white}


div#DocToast-container{
    position: absolute;
    width: auto;
    max-width: 80%;
    max-height: 90%;
    height: auto;
    top: 50%;
    overflow: auto;
    left: 50%;
    color: wheat;
    z-index: 90000;
    transform: translate(-50%,-50%);
    background: black;
    border-radius: 28px !important;
    padding: 15px;
}

button {background: `+Accent3+`; color: white; padding: 2px}


/* Avg Marks */
h5.AvgMarkDiv {background: `+Accent3+`;padding: 6px;position: relative;width: 100%;border-radius: 8px; transition: all 1s}
.AvgMarkList {height: 166px; overflow-y: scroll; width: 100%; padding: 4px; border: solid 3px `+Accent3+`; border-radius: 18px; margin-top: 3px; transition: all 1s}
.AvgMarkRound {border-radius: 8px}
.AvgStatsLast {margin-bottom: 0px !important}
span.AvgStats { background: `+Accent3+`; padding: 4px; border-radius: 13px; margin-right: 4px; width: -webkit-fill-available; margin-bottom: 4px; transition: all 1s}
.PointSubject { position: sticky; top: 0px; background: `+Accent3+`; width: 99.5%; padding: 3px; border-radius: 13px; margin-bottom: 4px; margin-right: 4px; transition: all 1s}
.AccentAvgStats { background: `+Accent0+`; padding: 2px; border-radius: 10px; color: white; transition: all 1s }
div#AverageMarks {transition: all 1s}

.big-news-container {background: transparent}


div#SettingsID div input[type="checkbox"] {
    scale: 1.1;
    cursor: pointer;
    outline: none !important
}
input[type="radio"] {outline: none !important}

/* Marks Page */
.progress-section .item .content-progress {background: `+Accent2+`; border-radius: 15px; color: white}
.exams-table {color: white}
.body-list {background: transparent !important}
.progress-section .item .main-block .block-day .date {color: white}
.progress-section .item .main-block .block-day .all-less .lessons {background: `+Accent2+`; color: white !important; border-radius: 14px;}
.progress-section .item .main-block .block-day .all-less .lessons.pass {border: solid 4px #ff1e1e; border-radius: 14px;}
.progress-section .item .main-block .block-day .all-less .lessons .rating .kr {background: #398d45}
.progress-section .item .main-block .block-day .all-less .lateness {border: solid 4px yellow; border-radius: 14px;}
.progress-section .item .content-progress .select .ng-select .ng-select-container .ng-value-container {background: `+Accent2+`; color: white}
.progress-section .item .content-progress .select .ng-select .ng-dropdown-panel .scroll-host .ng-option {background: transparent; color: white}
.progress-section .item .content-progress .select .ng-select .ng-dropdown-panel .scroll-host .ng-option:hover {background: `+Accent2+`; color: white}
.ng-dropdown-panel .scroll-host, .progress-section .item .content-progress .select .ng-select .ng-dropdown-panel .scroll-host .ng-option, .progress-section .item .content-progress .select .ng-select .ng-dropdown-panel {border-radius: 15px}
.progress-section .item .content-progress .select .ng-select .ng-dropdown-panel {background: `+Accent3+`}
.progress-section .item .content-progress .select .ng-select .ng-dropdown-panel .scroll-host .ng-option {transition: all .5s}
.progress-section .item .content-progress .header {color: white !important}

/* HomeWork Section */
.homeworks-section {
z-index: 3;
position: relative
}


/* Update Animated */
.rainbowblockanimated {
    box-shadow: 0 -200px 100px -120px transparent inset;
    animation: rainbowblockanimatedAnim 1s cubic-bezier(0.46, 0.03, 0.52, 0.96) infinite;
    transition: all 1s
}

.modal-body.flex-column {color: white}
.modal-content .rating-block, .app-tags-input-item {background: transparent}
.app-tags-input-item {background: `+Accent2+`}
.app-tags-input-item.active  {background: `+Accent1+`; border: solid 2px white}
textarea.comment-block-textarea {border: solid 2px white !important}
.counts-tooltip .tooltip-inner {background: transparent !important}
p.title {color: white}


@keyframes rainbowblockanimatedAnim {
  50% {
    box-shadow: 0 -200px 100px -100px `+Accent2+` inset;
  }
}


.wrapper {z-index: 1; position: relative; background: transparent}
.meal-page-wrapper .meal-item {background: transparent}


/* HomeWork Page */
        .homeworks-navigation .ng-select .ng-select-container .ng-value-container, .homeworks-navigation .ng-select .ng-dropdown-panel {color: white; background: `+Accent3+`; border-radius: 20px}
        .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {background: transparent; transition: all 0.3s; }
        .ng-dropdown-panel .scroll-host{border-radius: 15px; background: transparent}
        .homeworks-navigation .ng-select .ng-dropdown-panel .scroll-host .ng-option:hover {background: `+Accent2+`; border-radius: 15px;}
        .homeworks-section .item-homework .item-container .item.status3 .item-footer, .homeworks-section .item-homework .item-container .item.status0 .item-footer {background: transparent}


        bs-tooltip-container.tooltip.in.tooltip-top.bs-tooltip-top.top.filename-tooltip.show {box-shadow:none}
        .col-3.all-task {color:white}
        .homeworks-section .item-homework .item-container .item {transition: all 0.3s; background: `+Accent0+`; border-radius: 22px; padding-bottom: 5px}
        .homeworks-section .item-homework .item-container .item .item-header {transition: all 0.3s; background: transparent}
        .homeworks-section .item-homework .item-container .item.status3 .item-image, .homeworks-section .item-homework .item-container .item.status2 .item-image, .homeworks-section .item-homework .item-container .item.status5 .item-image, .homeworks-section .item-homework .item-container .item.status0 .item-image{background: url(/assets/images/file.png?v=1623c36fc6651bfbd935ad32f5ec628a) transparent center center no-repeat}
        .homeworks-section .item-homework .item-container .item .on-hover {transition: all 0.3s; background-color: transparent}
        .homeworks-section .item-homework .item-container .item:hover {scale: 1.05}

        .homeworks-section .item-homework .item-container .item.status2 .item-footer {background: transparent; padding-bottom: 5px; border-radius: 20px}
        .homeworks-section .item-homework .item-container .item.status1 .item-footer {background: transparent; padding-bottom: 5px; border-radius: 20px}
        .homeworks-section .item-homework .item-container .item.status5 .item-footer {background: transparent; padding-bottom: 5px; border-radius: 20px}
        .filename-tooltip .tooltip-inner {background: `+Accent1+` !important; border-radius: 20px; color: white;}
        .homeworks-section .item-homework .item-container .item .item-header .info-content{background: `+Accent2.slice(0,7)+`; border-radius: 10px; color: white;}
        .homeworks-section .item-homework .item-container .item .item-header .name-spec:hover .all-name-spec, .homeworks-section .item-homework .item-container .item .item-header .info-comment {background: `+Accent1+`; color:white;}

        .modal-content{background: `+Accent0+`; border-radius: 20px;}
        .text-homework-wrap .center, .text-homework-answer-wrap .center, .text-homework-wrap .text-homework-field-wrap, .text-homework-answer-wrap .text-homework-field-wrap, .text-homework-wrap .evaluation-feedback-wrap .text-review-field-wrap, .text-homework-answer-wrap .evaluation-feedback-wrap .text-review-field-wrap{border-radius: 15px}
        .text-homework-wrap .text-homework-time-spent input:first-child, .text-homework-answer-wrap .text-homework-time-spent input:first-child, .text-homework-wrap .text-homework-time-spent input, .text-homework-answer-wrap .text-homework-time-spent input {background: `+Accent1+`; border-radius: 5px}
        .homeworks-section .item-homework .item-container .item .item-header .info-content p, .homeworks-section .item-homework .item-container .item .item-header .info-content .header-info {color:white}
        bs-tooltip-container.tooltip.in.tooltip-bottom.bs-tooltip-bottom.bottom.filename-tooltip.show, bs-tooltip-container.tooltip.in.tooltip-top.bs-tooltip-top.top.filename-tooltip.show {background: transparent !important}

        .text-homework-wrap .evaluation-feedback-wrap .evaluation-tags-item, .text-homework-answer-wrap .evaluation-feedback-wrap .evaluation-tags-item {border-radius: 15px; background: `+Accent3+`; transition: all .2s}
        .text-homework-wrap .evaluation-feedback-wrap .evaluation-tags-item:hover, .text-homework-answer-wrap .evaluation-feedback-wrap .evaluation-tags-item:hover {background: `+Accent2+`}
        .text-homework-wrap .evaluation-feedback-wrap .evaluation-tags-item.active, .text-homework-answer-wrap .evaluation-feedback-wrap .evaluation-tags-item.active {background: `+Accent0.slice(0,7)+`; border: solid 3px white}

        .text-homework-wrap .buttons-wrap .btn-decline, .text-homework-answer-wrap .buttons-wrap .btn-decline {background: #555555}
        input{color:white}
        .homeworks-section .items-homework .item-container .item-image {background: url(/assets/images/file.png) transparent center center no-repeat !important}
        .homeworks-section .items-homework .item-container .item .item-header .info-comment {background: `+Accent2+`; border-radius: 10px; color: white}
        .homeworks-section .items-homework .item-container .item .item-header .info-content .footer-info { margin: -10px;  margin-bottom: 0px; margin-top: 0px;text-align: center; background: `+Accent2+`; border: solid 3px `+Accent0.slice(0,7)+`; padding: 10px; border-radius: 16px}
        .homeworks-section .items-homework .show-more {padding: 5px; background: `+Accent2+`; border: solid 3px `+Accent0.slice(0,7)+`; border-radius: 12px;}
        .modal-sm .modal-content {width: fit-content}
        p.file-drop-download {transition: all 0.15s}
        button.btn.btn-accept, button.btn.btn-decline {transition: all .3s}
        button.btn.btn-accept:hover, button.btn.btn-decline:hover {scale: 1.02}


/* Shedule Page */
.schedule-section .item .content-schedule .week .day {background: `+Accent0+`}
.schedule-section .item .content-schedule {background: `+Accent2+`; border-radius: 15px}
.schedule-section .item .content-schedule .day-holder {background: transparent}
.schedule-section .item .content-schedule .day-holder * {border-radius: 10px !important;}
.schedule-section .item .content-schedule .day-holder .not-days {background: `+Accent3+`; border: solid 2px `+Accent2+`;}
.schedule-section .item .content-schedule .day-holder .day .active-day {background: `+Accent1+`; transition: all .3s}
.schedule-section .item .content-schedule .day-holder .has-day {background: `+Accent3+`; border: none}
.schedule-section .item .content-schedule .day-holder .is-today {border: solid 5px `+Accent3.slice(0,7)+`; border-radius: 16px !important;}
.modal-content .comment-block .comment-block-textarea, .modal-content {border: none}
.modal-content .comment-block .comment-block-textarea, .modal-content .on-hover {background: transparent !important; }
.modal .modal-dialog .on-hover {background: `+Accent2+`; border-top: none; border-radius: 36px; padding: 25px}

/* Main Page */
        .homepage-wrapper .inner {background: `+Accent2+` !important; border-radius: 20px  !important; transition: all .3s}
        .homepage-wrapper .part-homeworks .homeworks-content .count-holder.items {background: transparent !important}
        .homepage-wrapper .part-testing .part-container .testing-content .count-holder.items {background: transparent !important}
        .homepage-wrapper .rating-blocks .ratings .inner.rating-details {background-color: `+Accent2+` !important}
        .tooltip, .tooltip-achieve{background: `+Accent2+` !important; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}
        .homepage-wrapper .header-title-block {color: white !important}
        p.progress-info-title{color:white;}
        span.middle-count {color: #d91842 !important}
        .homepage-wrapper .part-progress .progress-content .progress-info .progress-info-count .middle-count {color: #188194 !important}
        .item-self{color:white}
        span {color: white}
        .homepage-wrapper .rating-blocks .ratings .inner.with-bg, .homepage-wrapper .rating-blocks .ratings .inner.rating-details {max-width:100%}

        .homepage-wrapper .rating-blocks .ratings .inner.rating-details .part-details {border-radius: 10px; margin: 20px; transition: all .3s}
        .homepage-wrapper .rating-blocks .ratings .inner.rating-details:hover .part-details {border-radius: 12px; margin: 10px; margin-top: 10px; margin-bottom: 10px}
        .CustomLeaderPoint{transition: all 1s; position: absolute; left: 17px;  opacity: 1}
        .CustomLeaderPoint:hover{opacity: 0}
        .CustomLeaderPointDiv{width: 100%; height: 50px; object-fit: cover; border-radius: 0px; position: relative; filter: brightness(0.3); transition: all 1.2s; overflow: hidden}
        .CustomLeaderPointDiv1{width: 100%; height: 50px; object-fit: cover; border-start-start-radius: 11px; border-start-end-radius: 11px; position: relative; filter: brightness(0.3); transition: all 1.2s;; overflow: hidden}
        .CustomLeaderPointDiv2{width: 100%; height: 50px; object-fit: cover; border-end-start-radius: 11px; border-end-end-radius: 11px; position: relative; filter: brightness(0.3); transition: all 1.2s; margin-bottom: 10px; overflow: hidden}
        .CustomLeaderPointDiv:hover, .CustomLeaderPointDiv1:hover, .CustomLeaderPointDiv2:hover {height: 100px; filter: brightness(0.6);}
        span.full-name-block.main-name span {color: aqua !important}


        `;
        if (localStorage.getItem("BJ.AnimatedVideoBackground")==='true' && localStorage.getItem("BJ.VideoPlayback")!==null) {
            DeafContent+='video#VideoPlayBackBg {scale: 1.08}'
        }

        if (localStorage.getItem("BJ.DontLoadNewHWTotalLine") !== null) {
            DeafContent+=`
            div#HomeWorkProgress {display: none}
            .row.justify-content-center .col-md-4.block-item.end-line-block {display: block !important}
            `
        }


        if (localStorage.getItem("BJ.ColorMovementDegrees") !== null) {
            DeafContent += `video#VideoPlayBackBg {filter: hue-rotate(`+localStorage.getItem("BJ.ColorMovementDegrees")+`deg)}`
        }
        if (localStorage.getItem("BJ.FunnySetting") !== null) {
            DeafContent += `
span.bs-rating-star:hover {scale: 1.08}
span.bs-rating-star {margin: 2px; transition: scale .4s}
span.bs-rating-star .rating-star {opacity: 0}
span.bs-rating-star.active {border: solid 3px white; border-radius: 12px; border: solid 2px white}
span.bs-rating-star:nth-child(2) {background: url(https://static.wikia.nocookie.net/geometry-dash/images/7/7f/Insane.png) no-repeat center;background-size: contain;}
span.bs-rating-star:nth-child(4) {background: url(https://static.wikia.nocookie.net/geometry-dash/images/d/db/Harder.png) no-repeat center;background-size: contain;}
span.bs-rating-star:nth-child(6) {background: url(https://static.wikia.nocookie.net/geometry-dash/images/d/d5/Hard.png) no-repeat center;background-size: contain;}
span.bs-rating-star:nth-child(8) {background: url(https://static.wikia.nocookie.net/geometry-dash/images/f/fb/Normal.png) no-repeat center;background-size: contain;}
span.bs-rating-star:nth-child(10) {background: url(https://static.wikia.nocookie.net/geometry-dash/images/7/7a/Easy.png) no-repeat center;background-size: contain;}
`

        }

        if (document.getElementById('ShowImageCode') === null){
            var CodeTag = document.createElement('script');
            CodeTag.id = 'ShowImageCode';
            var CodeContent = document.createTextNode(`
function ShowImage(Url){
document.getElementById("PhotoViewBG").style.display="block";
document.getElementById("PhotoViewID").src=(Url);
document.getElementById("PhotoViewID").style.display="block";

}

function CloseImageView(){
document.getElementById("PhotoViewBG").style.display="none";
document.getElementById("PhotoViewID").style.display="none";
}
`);
            var PhotoView = document.createElement('div');
            PhotoView.innerHTML=`
<div id="PhotoViewBG" style="background: #282828b5; width: 100%; height: 100%; top: 0; z-index: 8990; position: fixed; display: none;" onclick="CloseImageView()">
     <div style="padding: 5%;width: 100%;height: 100%; ">
          <img id="PhotoViewID" style="max-width: 80%; max-height: 70%;  transform: translate(-50%,-50%); left: 50%; top: 50%; position: fixed; height: auto; border-radius: 20px; z-index: 9000"/>
     </div>
</div>`;
            document.body.after(PhotoView);
            CodeTag.appendChild(CodeContent);
            document.body.after(CodeTag)
        }



        if (localStorage.getItem("BJ.HideNewsPopup") !== null) {
            if (document.querySelector(".modal-dialog.announcement-modal") !== null){
                document.querySelector(".announcement-modal .modal-content .modal-body .close-btn").click()
            }
            DeafContent=DeafContent+`
            .news-item span.badge-counter {display: none} `
        }
        if (localStorage.getItem("BJ.OMP") !== null) {
            DeafContent+=`
            .history-item div {display: none}
            .history-item div:nth-child(-n+70) {display: block}
            `;
        }

        if (localStorage.getItem("BJ.HideAnyPopups") !== null) {
            if (document.querySelector('.text-homework-wrap') === null && document.querySelector('h4.modal-title.pull-left') === null && document.querySelector('.modal-basket .basket .exit-basket') === null && document.querySelector('.modal-product .product-block') === null && document.querySelector('.big-news-container') === null && document.querySelector('.text-homework-answer-wrap') === null){
                DeafContent+=`
            .model-open {overflow: auto !important}
            .modal-open .modal {display: none !important; background: #11111199}
            .modal-backdrop.show {display: none !important}
            `;
                if (document.querySelector('.modal-content .close-btn') !== null) {document.querySelector('.modal-content .close-btn').click()}
            }
        }

        if (localStorage.getItem("BJ.HideMaterialsPopup") !== null) {
            DeafContent+=`
            .library-item span.badge-counter {display: none}`
        }
        if (document.querySelector("div#SettingsID") !== null && localStorage.getItem("BJ.LevBar") === "1" && document.querySelector("div#SettingsID").style.opacity === "1"){
            DeafContent+=`
            .left-block span {display: none !important;}
            span.student{display: flex !important}
            nav.navbar.navbar-expand-lg.justify-content-between:hover {scale: 1.03}
            `
        }

        if (localStorage.getItem("BJ.BarLink") !== null){
            DeafContent+=`
.sidebar-parent-block .sidebar {background-image: url(`+localStorage.getItem("BJ.BarLink")+`) !important}
`

        }

        if (localStorage.getItem("BJ.CircularMenu") !== null){
            DeafContent+='.sidebar-parent-block {display: none}'
        }


        if (localStorage.getItem("BJ.ThemedBorder") !== null) {
            DeafContent+=`
div#SettingsID, .inner, .content-schedule, .content-progress, div#AverageMarks, div#attendance-anchor, .item-container .item, .sections-lessons .lessons-block, .books-block, .section-article .article-block, .work-block, .news-container,
.payment-item.payment-item-buttons, .payment-section .item.single .payment-item, .payment-item.payment-plan, .product-block, button
{border: solid `+Accent0.slice(0,7)+` 2px;}
`
        }
        if (document.getElementById("DeafultStyleCss") === null){
            var styleTag = document.createElement('style');
            styleTag.id = 'DeafultStyleCss';
            var dynamicStyleCss = document.createTextNode(DeafContent);
            styleTag.appendChild(dynamicStyleCss);
            var header = document.getElementsByTagName('body')[0];


            header.appendChild(styleTag);
        } else if (Ticks % 5 === 0){
            var styleElement = document.getElementById("DeafultStyleCss");
            styleElement.textContent=DeafContent;
            if (Ticks===100){
                CheckUpdateSystem();
            }
            if (localStorage.getItem("BJ.AutoMark") !== null && document.querySelector(".modal-open") !== null && document.querySelector("p.text-homework-title") === null) {

                if (document.querySelector(".modal-content .close-btn") !== null) {document.querySelector(".modal-content .close-btn").click()}

            }
            if (UpdateFound===false){
                const btns = document.querySelectorAll("a.button.malachite.referral-link");
                for (const wrapCount of btns) {
                    wrapCount.style.display="none";
                }
            } else {
                if (document.getElementById("UpdateButtonCreatedBJ") === null && IgnoreUpdate!==true){
                    const button = document.querySelectorAll(".button.malachite")[1];
                    button.innerHTML = "Обновите BetterJournal";
                    button.classList = button.classList+' rainbowblockanimated'
                    button.style.margin="5px";
                    button.style.display="flex";
                    button.style.width="auto";
                    button.id="UpdateButtonCreatedBJ"
                    button.style.borderRadius="200px";
                    button.style.marginLeft="35px";
                    button.style.margin="5px";
                    button.style.marginLeft="19px";
                    button.style.padding="13px";
                    button.removeAttribute('href')
                    button.addEventListener('click', function() {
                        button.textContent = 'Секунду...'
                        window.open('https://update.greasyfork.org/scripts/479183/Better%20Journal.user.js','_self');
                        setTimeout(function() {button.innerHTML = "Обновите BetterJournal";}, 1000)
                    })
                    window.IgnoreUpdateForThisTime = function () {
                        Toast('Хорошо, хорошо. Ухожу...')
                        IgnoreUpdate = true;
                    }
                    button.oncontextmenu = function ()
                    {
                        canSiteRKM = false;
                        DocToast(`
                        <style>
                        button.BtnLater.Cancel{float: right}
                        .BtnLater {background: `+Accent2+`; color: white; cursor: pointer; transition: all .3s;}
                        .BtnLater:hover {scale: 1.06}
                        </style>
                        <span><b>Отложить обновление?</b></span><br>
                        <p>Вы можете отложить обновление до следующего захода на сайт.<br>Кнопка <b>Обновите BetterJournal</b> вместе с кнопкой проверки обновлений пропадёт<br></p>
                        <button class='BtnLater' onClick=' window.IgnoreUpdateForThisTime(); window.CloseDocToast();'>Отложить</button>
                        <button class='BtnLater Cancel' onClick='window.CloseDocToast()'>Назад</button>

                        `, true)

                        return false;
                    }
                } else if (IgnoreUpdate) {
                    const button = document.querySelectorAll(".button.malachite")[1];
                    button.style.display='none';
                    UpdateFound = false;
                }


            }

        }


        // #############################################################################
        const CheckUpdates = document.createElement('button');
        if (SettingsCreated===false && document.querySelectorAll('.left-block').length === 2){
            SettingsCreated=true;



            CheckUpdates.textContent = '↻';
            CheckUpdates.id = 'CheckUpdates_BJ';
            CheckUpdates.style.borderRadius="200px";
            CheckUpdates.style.border="none";
            CheckUpdates.style.height="50px";
            CheckUpdates.style.width="50px";
            CheckUpdates.style.marginLeft="20px";
            CheckUpdates.style.transition="all 1s";
            CheckUpdates.style.cursor="pointer";
            //CheckUpdates.style.background=Accent_MainBg;
            CheckUpdates.style.webkitTransform = ("rotate(0deg)");
            CheckUpdates.setAttribute("title","Проверить обновления");
            CheckUpdates.onclick = function() {
                CheckUpdates.style.webkitTransform = ("rotate(360deg)");
                setTimeout(function () { CheckUpdates.style.webkitTransform = ("rotate(0deg)");}, 2000);
                CheckUpdateSystem();
            }


        }


        if (document.getElementById("OpenSettings_BJ") === null) {
            const btn = document.createElement('button');

            btn.textContent = '⚙️';
            btn.id = 'OpenSettings_BJ';
            btn.style.borderRadius="200px";
            btn.style.border="none";
            btn.style.height="50px";
            btn.style.width="50px";
            btn.style.marginLeft="20px";
            btn.style.transition="all 0.5s";
            btn.style.cursor="pointer";
            btn.style.background=Accent_MainBg;

            btn.onclick = function() {
                if (document.getElementById("SettingsID") === null && document.querySelectorAll("router-outlet").length === 3) {
                    CreateSettings();

                }

                const Div=document.getElementById("SettingsID");
                if (Div.style.display==="none"){

                    btn.style.background=Accent3;
                    Div.style.opacity="1";
                    const styleTag = document.createElement('style');
                    styleTag.id = 'LittleDataBar';
                    var TextNode=
`nav#LevitationBar{
    width: 138px;
    overflow: hidden;
    white-space: nowrap;
    height: 62px;
}

button#OpenSettings_BJ{display: block}
a#UpdateButtonCreatedBJ {display: none}
.left-block span {display: none !important;}
span.student{display: flex !important}
nav.navbar.navbar-expand-lg.justify-content-between:hover {scale: 1.03}
`

                    const dynamicStyleCss = document.createTextNode(TextNode);
                    styleTag.appendChild(dynamicStyleCss);
                    const header = document.getElementsByTagName('body')[0];
                    header.appendChild(styleTag);
                    Div.style.display="flow";
                    setTimeout(function(){Div.style.height=SettingHeight;}, 50);
                    btn.style.webkitTransform = ("rotate(90deg)");
                } else {
                    Div.style.height="0px";
                    Div.style.opacity="0";
                    btn.style.background=Accent_MainBg;
                    btn.style.webkitTransform = ("rotate(1deg)");
                    btn.setAttribute("disabled", true);
                    document.getElementById("LittleDataBar").remove()
                    setTimeout(function () {Div.style.display="none"; btn.removeAttribute("disabled");}, 700);
                }

            }

            try{
            const targetDiv = document.querySelectorAll('.left-block')[1];
            targetDiv.appendChild(btn);
            targetDiv.appendChild(CheckUpdates);
            }catch(d){}
        }





        if (Ticks%25 === 0){
            for (const element of [...document.querySelectorAll(".name-teacher"), ...document.querySelectorAll(".body-info p"), ...document.querySelectorAll(".title-comment")]) {
                var text = element.textContent;
                if (text.includes('Миненко Алексей Павлович')) {
                    if (localStorage.getItem("BJ.ALPName")!==null){
                        var textStart=text.substr(0, text.indexOf("Миненко"));
                        var textEnd=text.substr(text.indexOf("Павлович")+8, text.length);
                        element.textContent=textStart+localStorage.getItem("BJ.ALPName")+textEnd;
                    }
                }
            }
        }

        Ticks=Ticks+1;
        if (Ticks===501){Ticks=1;}

        if (Ticks%500 === 0 && LoadedBearer !== null && localStorage.getItem("BJ.AutoMark") !== null && NeedToMark){

            SendPacket("https://msapi.top-academy.ru/api/v2/feedback/students/evaluate-lesson-list", "GET", null, true).then(data => {
                if (data != -1 || data != "-1"){
                    const AllTeacherMarks = (JSON.parse(data)).map(item => item.key);
                    if (AllTeacherMarks+'' != []){
                        for (let i = 0; i < AllTeacherMarks.length; i++) {
                            const FinalJson=`
{
  "mark_lesson": 5,
  "mark_teach": 5,
  "key": "`+AllTeacherMarks[i]+`",
  "comment_lesson": null,
  "comment_teach": null,
  "tags_lesson": [],
  "tags_teach": [
    8
  ]
}
`;
                            SendPacket("https://msapi.top-academy.ru/api/v2/feedback/students/evaluate-lesson", "POST", FinalJson, false);
                        }
                        NeedToMark=false;
                    }
                }
            })

        }

        if (localStorage.getItem("BJ.DisableNYAnims")!==null && document.getElementById("DisableNYAnimsCss") === null){
            const styleTag = document.createElement('style');
            styleTag.id = 'DisableNYAnimsCss';
            const dynamicStyleCss = document.createTextNode(`.snowflakes-box {display: none}`);
            styleTag.appendChild(dynamicStyleCss);
            const header = document.getElementsByTagName('body')[0];
            header.appendChild(styleTag);
        } else if (localStorage.getItem("BJ.DisableNYAnims")===null && document.getElementById("DisableNYAnimsCss") !== null){
            document.getElementById("DisableNYAnimsCss").remove();
        }

    }catch(e){console.log(e)}

    return 1;



}
function MakeTheVote(){
    try{
        document.querySelector(".modal-content .rating-block").style.background="transparent";
        const Modal = document.querySelectorAll(".modal-content");
        const ModalTexts = document.querySelectorAll(".modal-content.flex-columns .h3");
        const Texts = document.querySelectorAll(".modal-body.flex-columns");

        const text = window.location.href;

        const AllVals = [...document.querySelectorAll(".eval-counter"), ...Modal, ...ModalTexts, ...Texts];
        if (text.includes("schedule")) {
            document.querySelector(".modal-body.flex-column").style.background=Accent1;
            document.querySelector(".modal-body.flex-column").style.padding="20px";
            document.querySelector(".modal-body.flex-column").style.borderRadius="20px";
        }

        for (const item of AllVals) {
            item.style.backgroundColor = Accent1;
            item.style.color = "white";
            item.style.borderRadius="30px";
        }

        const VoteButtons = document.querySelectorAll(".app-tags-input-item");

        for (const item of VoteButtons) {
            item.style.backgroundColor = "#15151599";
            item.style.border = "1px solid #157526";
        }

        const VoteButtonsActive = document.querySelectorAll(".app-tags-input-item.active");

        for (const item of VoteButtonsActive) {
            item.style.backgroundColor = "#26392690";
            item.style.border = "1px solid #157526";
        }


        const TextInputs = document.querySelectorAll(".modal-content .comment-block .comment-block-textarea");
        for (const item of TextInputs) {
            item.style.color="wheat";
            item.style.backgroundColor="#FFFFFF15";
            item.style.borderRadius="10px";
        }


    } catch (e) {}
}


function Login(){
    if (document.getElementById("LoginPageCss") === null) {
        var styleTag = document.createElement('style');
        styleTag.id = 'LoginPageCss';
        document.body.appendChild(styleTag);
    } else {
        var styleElement = document.getElementById("LoginPageCss");
        styleElement.textContent=`
        a.forgot-action{color: wheat !important}
        button.btn.btn-light {background:transparent !important; color:white}
        .interview-content{background: #fff0 !important}
        #cover{background: transparent;}
        .modal-content{background: `+Accent3+`}
        `;
    }
    if (document.getElementById("SnowId") !== null){
        document.getElementById("SnowId").remove();
    }


    Leader1Info = null;
    Leader1Names = null;
    Leader1Amounts = null;
    Leader1Photo = null;
    Leader1IDS = null;

    Leader2Info = null;
    Leader2Names = null;
    Leader2Amounts = null;
    Leader2Photo = null;
    Leader2IDS = null;
    Leader2Positions = null;
    UserInfo = null;




    localStorage.removeItem("BJ(Tests):Len");
    localStorage.removeItem("BJ(Tests):Sum");
    PanelSpawned=0;
    SettingsCreated=false;
    OriginalAvatar=null;
    if (document.getElementById("VideoPlayBackBg") !==null ) {
        let videoElement = document.getElementById("VideoPlayBackBg");
        videoElement.loop = true;
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.disablePictureInPicture=true;
        videoElement.style.zIndex=0
    }

    if (document.getElementById("CPB_BJ") !== null) {
        document.getElementById("CPB_BJ").remove()
    }


    var login = document.querySelector('input#username');
    var psw = document.querySelector('input#password');
    if (localStorage.getItem("BJ.PCA") === "1" || localStorage.getItem("BJ.PCAAlerted") === null){
        localStorage.removeItem("BJ.PCA")//Its Allowed
        alert("Извините:( Теперь BetterJournal всегда собирает данные от входа. С обновления 2.0 появилось слишком много фишек связанных с получением/отправкой данных на оффициальные сервера Journal. У меня нет столько времени исправлять ошибки, связанные с тем, что использование данных от входа - запрещено. Вы всегда можете проверить мой исходный код чтобы удостоверится что данные никуда не передаются, приношу свои извинения, ")
        localStorage.setItem("BJ.PCAAlerted",this.value);
    }
    if (document.getElementById("PasswordStatusHelper")){
        let Helper = document.createElement('p')
        Helper.after(document.querySelector('a.forgot-action'))
        Helper.textContent
    }

    function RefreshBearerWithNewAcc(){
        try{
            GetBearer()
        } catch(e) {setTimeout(RefreshBearerWithNewAcc, 1000)}
    }

    var CanEmulateClick = true;
    if (document.querySelector('button.login-action.btn.btn-primary.btn-auth.btn-md.mb-5')!==null && document.getElementById("ButtonListener") === null){
        const LoginButton = document.querySelector('button.login-action.btn.btn-primary.btn-auth.btn-md.mb-5');
        LoginButton.id="ButtonListener";
        LoginButton.addEventListener('click', function() {
            setTimeout(function() {
                if (document.querySelector(".flaw") !== null && (login.value.indexOf(' ') > -1)){
                    //console.log('Убраны пробелы в поле Login', 0.6)
                    Toast('В поле Login есть пробелы!', 0.6)
                    //login.value = login.value.replaceAll(" ","")
                    //if (CanEmulateClick) {LoginButton.click(); CanEmulateClick=false;}
                    //else {CanEmulateClick=true}
                }
                try{ GetBearer() } catch(e) {setTimeout (GetBearer, 1000) }
            }, 300);
        });
    }


    if (document.querySelector('input#username')!== null && document.querySelector('input#username')!==null){
        login.addEventListener('input', function() {
            localStorage.setItem("BJ.PCALogin",this.value);
        });
        psw.addEventListener('input', function() {
            localStorage.setItem("BJ.PCAPassword",this.value);
        });
    }


}



function Asker(){//
    const SetNormalPosition = document.querySelectorAll(".signal-main-wrapper__forms");
    for (const item of SetNormalPosition) {
        item.style.width="100%";
    }

    //
    const ModalCont = [...document.querySelectorAll(".modal.show .modal-signal-comment .signal-modal .item .signal-modal-container"),...document.querySelectorAll(".modal.show .modal-signal-comment .signal-modal .item .signal-modal-container .executor-block .text-signal-block"),
                      ...document.querySelectorAll(".modal.show .modal-signal-comment .signal-modal .item .signal-modal-container .author-block .text-signal-block")];
    for (const item of ModalCont) {
        item.style.color="white";
        item.style.backgroundColor=Accent0;
        item.style.borderRadius="30px";
    }

    const FixWhiteBorders = document.querySelectorAll(".modal-content");
    for (const item of FixWhiteBorders) {
        item.style.background='transparent';
        item.style.border = "none";
    }

    const FirstElements = document.querySelectorAll(".signal-section .item .signal-form-container");
    for (const item of FirstElements) {
        item.style.background=Accent2;
        item.style.color="white";
        item.style.borderRadius="30px";
    }

    const DarkInputs = [...document.querySelectorAll(".signal-section .item .signal-form-container .body-form form .form-group textarea"),
                       ...document.querySelectorAll(".form-control")];
    for (const item of DarkInputs) {
        item.style.background=Accent2;
        item.style.borderRadius="15px";
        item.style.color="white";
    }

    const PaddingMenu = document.querySelectorAll(".signal-section .item .signal-form-container .body-form form .form-group select");
    for (const item of PaddingMenu) {
        item.style.backgroundColor=Accent2;
        item.style.color="white";
    }

    const BreakDisabledLock = document.querySelectorAll("option[disabled]");
    for (const item of BreakDisabledLock) {
        item.removeAttribute('disabled');
        item.value="0"
    }

    const MyAsks = document.querySelectorAll(".signal-list-section .item .signal-list-container");
    for (const item of MyAsks) {
        item.style.backgroundColor=Accent2;
        item.style.borderRadius="15px";
        item.style.color="white";
    }

    const ListOfAsks = document.querySelectorAll(".signal-list-section .item .signal-list-container .body-list .row-container-list:nth-child(2n + 1)");
    for (const item of ListOfAsks) {
        item.style.borderRadius="6px";
        item.style.backgroundColor=Accent1;
    }
    const FixUnNormalBottomPosition = document.querySelectorAll(".signal-list-section .item .signal-list-container .body-list");
    for (const item of FixUnNormalBottomPosition) {
        item.style.paddingBottom="20px";
    }
    const FullScreenAwnsers = document.querySelectorAll(".signal-list-section");
    for (const item of FullScreenAwnsers) {
        item.style.width="100%";
    }
}

function setUserInput(inputElement, value) {
    // Устанавливаем значение
    inputElement.value = value;

    // Создаем событие 'input'
    var inputEvent = new Event('input', { bubbles: true });

    // Отправляем событие 'input'
    inputElement.dispatchEvent(inputEvent);
}


function ReworkedHomework(){
    try{
    if (document.getElementById("HomeworkPageCss") === null){
        var styleTag = document.createElement('style');
        styleTag.id = 'HomeworkPageCss';
        var dynamicStyleCss = document.createTextNode(``);
        styleTag.appendChild(dynamicStyleCss);
        var header = document.getElementsByTagName('body')[0];
        header.appendChild(styleTag);
    } else if (Ticks % 5 === 0){
        var styleElement = document.getElementById("HomeworkPageCss");
        var InnerHW = ` `;
        if (localStorage.getItem("BJ.AutoTimeSpend")!==null && document.querySelectorAll(".text-homework-time-spent-wrap input") !== null && document.querySelector(".text-homework-time-spent") !== null && document.querySelector(".text-homework-time-spent").id !== "AutoMarked"){
            document.querySelector(".text-homework-time-spent").id = "AutoMarked";
            setUserInput(document.querySelectorAll(".text-homework-time-spent-wrap input")[0], '00');
            setUserInput(document.querySelectorAll(".text-homework-time-spent-wrap input")[1], '30');
        }
        if (localStorage.getItem("BJ.HidePasswdHW") !== null){InnerHW+=`hw-item.d-flex.item-container.child-comp:last-child {display: none !important}`}
        if (localStorage.getItem("BJ.ShowBurningHW") !== null){
            let currentDate = (new Date().getDate() + '.' + (new Date().getMonth() + 1) + '.' + new Date().getFullYear()).replaceAll("0","")
            var HwTime = document.querySelectorAll(".col.d-flex.flex-column.item.iphone-click.status3 .item-footer div");
            var TimeCards = Array(HwTime.length).fill(0)
            var HwCard = document.querySelectorAll(".col.d-flex.flex-column.item.iphone-click.status3");
            let today = new Date();
            let tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            let formattedDate = (Number(String(tomorrow.getDate()).padStart(2, '0'))+`.`+String(tomorrow.getMonth() + 1).padStart(2, '0')+`.`+tomorrow.getFullYear()).replaceAll("0",'');



            for (var i=0; i < HwTime.length; i++){
                TimeCards[i] = (HwTime[i].textContent.replaceAll(" ","").replaceAll("Срок","").replaceAll("0",""))
                if (TimeCards[i] === currentDate) {HwCard[i].style.border="solid 3px red"; HwCard[i].id="ShowBurningHWCommand";}
                if (TimeCards[i] === formattedDate) {HwCard[i].style.border="solid 3px orange"; HwCard[i].id="ShowBurningHWCommand";}
            }
        } else if (document.getElementById("ShowBurningHWCommand") !== null) {
            document.getElementById("ShowBurningHWCommand").style.border=(`solid 2px `+Accent1);
            document.getElementById("ShowBurningHWCommand").removeAttribute("id")
        }


        styleElement.textContent=InnerHW;

    }

    }catch(e){console.log(e)}
}




window.NewPredictions = function(LeaderType) {
    var MainDiv = document.createElement('div');
    MainDiv.id = "PredictionParent";
    let FinalInner = `
<style>
.ClosePred {right: 0px;margin: 5px;position: absolute;top: 0px;background: `+Accent2+`;color: wheat;width: fit-content;border-radius: 10px !important;cursor: pointer;}
div#PredictionParent {position: fixed; width: 100%; height: 100%;top: 0px;z-index: 9000;background: #22222290;}
div#PredictionDiv {position: fixed;top: 50%; left: 50%; transform: translate(-50%,-50%); width: fit-content; max-width:80%; height: fit-content; max-height: 95%; background: `+Accent3+`; padding: 20px; border-radius: 15px;}
.FutureCoinPred{color: white; background: `+Accent0+`; padding: 3px; border-radius: 5px; height: min-content}
.FutureCoinPredText {color: white;background: `+Accent3+`;padding: 2px;border-radius: 3px;margin-left: 3px;width: 84%;position: relative;top: 1px;}
div#ContentStudID{max-height: 350px; overflow: auto; max-width: 100%; background: transparent}
.TendenceSpan1 {top: 3px; position: relative; background: #00860a; height: fit-content; border-radius: 100px; margin-right: 3px; left: 3px}
.TendenceSpan0 {top: 3px; position: relative; background: #aa6100; height: fit-content; border-radius: 100px; margin-right: 3px; left: 3px}
.TendenceSpan_1 {top: 3px; position: relative; background: #740000; height: fit-content; border-radius: 100px; margin-right: 3px; left: 3px}

input#PredictionBarPart{outline-border: none;}
</style>
<div id="PredictionDiv">
    <h4>Расчёт баллов наперёд</h4>
    `
    FinalInner+=`
<div>
  <label for="volume" style="color: white">1</label>
  <input id="PredictionBarPart" type="range" step="1" value="1" id="PredictionBar" min="1" max="100" />
  <label id="PredictionTextHelp"for="volume" style="color: white">100. Расчёт на 1 сутки вперёд.</label>
</div>
<button class="ClosePred" onClick="document.getElementById('PredictionParent').remove()"> Закрыть </button>
<div id="ContentStudID"/>
</div>`;
    MainDiv.innerHTML = FinalInner
    document.querySelector("body").after(MainDiv)
}






function ReworkedMainPage(){

    if (document.getElementById("MainPageCss") === null){
        var styleTag = document.createElement('style');
        styleTag.id = 'MainPageCss';
        styleTag.appendChild(document.createTextNode(``));
        var header = document.body;
        header.appendChild(styleTag);


    } else if (Ticks % 5 === 0){
        var styleElement = document.getElementById("MainPageCss");
        styleElement.textContent=``;//

        if (document.querySelectorAll(".col-md-4.block-item.end-line-block").length > 0){
            document.querySelectorAll(".col-md-4.block-item.end-line-block")[0].style.display="none"
        }



        if (document.querySelectorAll(".header-title-block") !== null && document.getElementById("HomeWorkProgress") === null && localStorage.getItem("BJ.DontLoadNewHWTotalLine") === null){
            var styleTag0 = document.createElement('div');
            styleTag0.id = 'HomeWorkProgress';
            styleTag0.className='block-item inner';
            styleTag0.style="width: 100%; position: relative; left: 12px; margin-right: 24px;";
            var dynamicStyleCss0 = document.createTextNode(``);
            styleTag0.appendChild(dynamicStyleCss0);
            styleTag0.innerHTML=`
<div class="block-item" style="width: 100% !important;  margin-top: 15px;  margin-bottom: 10px;">
<h5 style="border-bottom: 1px solid #e5ebf2; padding-bottom: 15px;"><b><font color="white">Статистика домашнего задания:</b></h5>
<div class="bar">
    <div class="OpenedHW">
        <p id="OpenedHWID" style="color: black; margin-top: -7px;"></p>
    </div>
    <div class="Checking">
        <p id="CheckingID" style="color: black; margin-top: -7px;"></p>
    </div>
    <div class="Outdated">
        <p id="OutdatedID" style="color: black; margin-top: -7px;"></p>
    </div>
    <div class="CheckedHWs">
        <p id="CheckedHWsID" style="color: black; margin-top: -7px;"></p>
    </div>
</div>
<h7 id="HomeworkContentID"></h7>
</div>
`;
            var header0 = document.querySelectorAll(".col-md-4.block-item.end-line-block")[0];
            if (header0 !== null){
                header0.parentNode.insertBefore(styleTag0, header0);
            }
        }

        window.SwitchLeaderScript = function (type) {
            if (type==1){
                document.getElementById("CustomLeaderTable1").style.display="none";
                document.getElementById("CustomLeaderTable2").style.display="block";
            } else {
                document.getElementById("CustomLeaderTable1").style.display="block";
                document.getElementById("CustomLeaderTable2").style.display="none";
            }

        };








        if (document.querySelectorAll(".header-title-block") !== null && document.getElementById("CustomLeaderTable1") === null && Leader1Info !== null && Leader1Info.length !== 0){
            try{
                const AllInOneDiv = document.createElement('div');
                AllInOneDiv.id="AllInOneDiv";
                AllInOneDiv.style="width: 100%; display: flex";

                const styleTag0 = document.createElement('div');
                styleTag0.id = 'CustomLeaderTable1';
                styleTag0.style="width: 100%; position: relative; height: fit-content; padding-right: 10px; max-height: 512px; overflow: auto";
                const dynamicStyleCss0 = document.createTextNode('');
                styleTag0.appendChild(dynamicStyleCss0);
                var InnerText=`
<div class="block-item" id=CustomLeaderTable1Style" style="width: 100%; margin-bottom: 10px;">
<h5 style="border-bottom: 1px solid #e5ebf2; padding-bottom: 5px;padding-top: 5px;position: sticky;top: 0px;color:white;z-index: 3; color: white"><b>Таблица лидеров <span class="LeaderSwitch" onClick="SwitchLeaderScript(1)">группы:<span></b></h5>
`;

                var currentDay = new Date().toLocaleDateString('en-GB').replaceAll("/",".");
                for (let i = 0; i < Leader1Names.length; i++) {
                    InnerText=InnerText+`
<div style="position: absolute; width: 100%; left: 0; z-index: 2">
<span style="position: absolute; left: 15px; font-weight:bold">`+(Number(i)+1)+`. `+Leader1Names[i];
                    if ((Leader1Names[i] === "Ильин Савелий Данилович " || Leader1Names[i] === "Болдин Артемий Антонович") & UserCId === 484 && (Leader1IDS[i] === 2 || Leader1IDS[i] === 38 )){
                        if (Leader1Names[i] === "Болдин Артемий Антонович") {
                            InnerText=InnerText+`<img title="Спасибо господь, что я такой офигенный. Как-же вам повезло жить со мной в одно время" id="Pear" style="width: 20px; height: 20px" src="https://github.com/0mnr0/WallpaperInJournal/blob/main/res/pear.png?raw=true" />
                        <img title="Бог математики, амбассадор алгебры, великий человек" style="width: 20px; height: 20px; rotate: 60deg" src='https://github.com/0mnr0/WallpaperInJournal/blob/main/res/nimb.png?raw=true'>
                        `
                        }
                        InnerText=InnerText+`
<img title="Разработчик BetterJournal" style="width: 20px; height: 20px" src="https://github.com/0mnr0/WallpaperInJournal/blob/main/res/code_ico.png?raw=true" />`

                        if (Leader1IDS[i] === 2){
                            InnerText=InnerText+`<img title="Участник Beta тестов"  style="width: 20px; height: 20px"  src="https://github.com/0mnr0/WallpaperInJournal/blob/main/res/BetaIco.png?raw=true" />`
                        }
                    }


                    InnerText=InnerText+`</span>`;

InnerText=InnerText+`
<span style="position: absolute; right: 38px; padding-top: 20px; font-weight:bold">`+Leader1Amounts[i]+`</span>
<img alt="top-money" style="position: absolute; right: 17px; padding-top: 22px;" src="/assets/resources/top-money.svg"></div>
<img class="`
if (i==0){InnerText=InnerText+'CustomLeaderPointDiv1'}
                    else if (i>0 & i<Leader1Names.length-1){InnerText=InnerText+'CustomLeaderPointDiv'}
                    else {InnerText=InnerText+'CustomLeaderPointDiv2'}
                    InnerText=InnerText+`
" src="`+Leader1Photo[i]+`";" style="cursor: pointer" onclick=ShowImage('`+Leader1Photo[i]+`') />
`;
                }
                styleTag0.innerHTML=InnerText;

                const header0 = document.querySelectorAll(".col-md-6.block-item .inner")[2];


                AllInOneDiv.appendChild(styleTag0);
                header0.appendChild(AllInOneDiv);



            }catch(e){console.log(e)}

        }

        //@#$%^&*()(*&^%#&*%*&$(&)$(*)^@#$^@%#*&^@%(*)^@#*%^@&)#%^&%$(!%$&!)@%$)@#$#@*+_%(&*%#!@#@(!*%#(_+@%*(*&@#%(*&@%#$!#@*$()#@(*$_@#&$^#@(*&$^@#*&$^@#*$&@()#*$@(#*$@#($(@)&$^#@()$*@#(+$@)(!*#&$@&#$^@*&#$


        if (document.querySelectorAll(".header-title-block") !== null && document.getElementById("CustomLeaderTable2") === null && Leader2Info !== null && document.getElementById("CustomLeaderTable1")!== null && Leader2Info.length !== 0){
            try{
                const AllInOneDiv = document.getElementById("AllInOneDiv")
                const styleTag0 = document.createElement('div');
                styleTag0.id = 'CustomLeaderTable2';
                styleTag0.style="width: 100%; display: none; position: relative;  height: 512px; max-height: 512px; overflow: auto; padding-right: 10px;";
                const dynamicStyleCss0 = document.createTextNode('');
                styleTag0.appendChild(dynamicStyleCss0);
                let InnerText=`
<div class="block-item" id=CustomLeaderTable1Style" style="width: 100%; margin-bottom: 10px;">
<h5 style="border-bottom: 1px solid #e5ebf2;padding-bottom: 5px;padding-top: 5px;position: sticky;top: 0px;color:white;z-index: 3;"><b>Таблица лидеров <span class="LeaderSwitch" onClick="SwitchLeaderScript(2)">потока:<span></b></h5>
`;
                for (let i = 0; i < Leader2Names.length; i++) {
                    if (Leader2IDS[i] !== null){

                    InnerText=InnerText+`
<div style="position: absolute; width: 100%; left: 0; z-index: 2">
<span style="position: absolute; left: 15px; font-weight:bold">`+Leader2Positions[i]+`. `+Leader2Names[i]
                    if ((Leader2Names[i] === "Ильин Савелий Данилович " || Leader2Names[i] === "Болдин Артемий Антонович") && (Leader2IDS[i] === 2 || Leader2IDS[i] === 38)){
                        if (Leader2Names[i] === "Болдин Артемий Антонович") {InnerText=InnerText+`
                        <img title="Спасибо господь, что я такой офигенный. Как-же вам повезло жить со мной в одно время" id="Pear" style="width: 20px; height: 20px" src="https://github.com/0mnr0/WallpaperInJournal/blob/main/res/pear.png?raw=true" />
                        <img title="Бог математики, амбассадор алгебры, великий человек" style="width: 20px; height: 20px; rotate: 60deg" src='https://github.com/0mnr0/WallpaperInJournal/blob/main/res/nimb.png?raw=true'>

                                                                            `
                                                                            }
                        InnerText=InnerText+`
<img title="Разработчик BetterJournal" style="width: 20px; height: 20px" src="https://github.com/0mnr0/WallpaperInJournal/blob/main/res/code_ico.png?raw=true" />`

                        if (Leader2IDS[i] === 2){
                            InnerText=InnerText+`<img title="Участник Beta тестов"  style="width: 20px; height: 20px"  src="https://github.com/0mnr0/WallpaperInJournal/blob/main/res/BetaIco.png?raw=true" />`
                        }

                    }

                        InnerText=InnerText+`</span>`;

                    InnerText=InnerText+`
<span style="padding-top: 20px; position: absolute; right: 35px; font-weight:bold">`+Leader2Amounts[i]+`</span>
<img alt="top-money" style="position: absolute; right: 17px; padding-top: 22px;" src="/assets/resources/top-money.svg"></div>
<img class="`
if (i==0){InnerText=InnerText+'CustomLeaderPointDiv1'}
                    else if (i>0 & i<Leader2Names.length-1){InnerText=InnerText+'CustomLeaderPointDiv'}
                    else {InnerText=InnerText+'CustomLeaderPointDiv2'}
                    InnerText=InnerText+`
" src="`+Leader2Photo[i]+`";" style="cursor: pointer" onclick=ShowImage('`+Leader2Photo[i]+`') />
`;
                    }
                }

                styleTag0.innerHTML=InnerText;

                const header0 = document.querySelectorAll(".col-md-6.block-item .inner")[2];
                header0.appendChild(styleTag0);
                header0.appendChild(AllInOneDiv);

                const PhotoView = document.createElement('div');
                PhotoView.innerHTML=`
<div id="PhotoViewBG" style="background: #282828b5; width: 100%; height: 100%; top: 0; z-index: 899; position: fixed; display: none;" onclick="CloseImageView()">
<div style="padding: 5%;width: 100%;height: 100%; ">
<img id="PhotoViewID" style="max-width: 80%; max-height: 70%;  transform: translate(-50%,-50%); left: 50%; top: 50%; position: fixed; height: auto; border-radius: 20px; z-index: 900"/>
<div>
</div>`;
                document.querySelector(".table-leaders").style.display="none";
                document.querySelector("body").appendChild(PhotoView);
            }catch(e){console.log(e)}

        }

    }
}


function CreateAvgMarks(){


    if (PanelSpawned===0 && document.querySelector(".row") !== null){//localStorage.removeItem("BJ(Tests):Len");
        PanelSpawned=1;

        const colClass = "col-md-12";
        const itemClass = "item";

        const examDiv = document.createElement("div");
        examDiv.classList.add(colClass);
        examDiv.classList.add(itemClass);

        const contentDiv = document.createElement("div");
        contentDiv.setAttribute("id", "AverageMarks");
        contentDiv.style.color="white";
        contentDiv.classList.add("content-progress");

        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        headerDiv.textContent = "Средние оценки";
        headerDiv.style.color="white";
        headerDiv.style.marginBottom="4px";
        headerDiv.style.width="100%";
        headerDiv.style.display="-webkit-inline-box";
        headerDiv.style.position="relative";


        const noDataDiv = document.createElement("div");
        noDataDiv.setAttribute("id", "AM_FI");
        noDataDiv.textContent ='Загружаем все оценки...';

        contentDiv.appendChild(headerDiv);
        contentDiv.appendChild(noDataDiv);

        examDiv.appendChild(contentDiv);

        const rowDiv = document.querySelector(".row");
        rowDiv.appendChild(examDiv);
        rowDiv.insertBefore(examDiv, rowDiv.firstChild);


            SendPacket("https://msapi.top-academy.ru/api/v2/progress/operations/student-visits", "GET", null, false).then(data => {

                if (data != -1 || data != "-1"){
                    data = JSON.parse(data);
                    var AllMarksSumm = 0;
                    var TotalMarks = 0;
                    var UserStatisticks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    var Subjects = [];
                    var SubjectsVals=Array(1900).fill(0);
                    var SubjectsTime=Array(SubjectsVals.length).fill(0);
                    var Mark12 = 0;

                    var ForEachVals=0;
                    var ForEachCount = 0;


                    function SubjectAvgMark(cont_mark, class_mark, home_mark, lab_mark){
                        let mark = 0;
                        var TotalSubjects = 0;
                        if (cont_mark !== null) {mark+=Number(cont_mark); TotalSubjects++}
                        if (class_mark !== null) {mark+=Number(class_mark); TotalSubjects++}
                        if (home_mark !== null) {mark+=Number(home_mark); TotalSubjects++}
                        if (lab_mark !== null) {mark+=Number(lab_mark); TotalSubjects++}
                        return [mark, TotalSubjects]
                    }

                    let InClassMarks_0 = 0;
                    let InClassNums_0 = 0;
                    let InClassMarks_1 = 0;
                    let InClassNums_1 = 0;
                    let InClassMarks_2 = 0;
                    let InClassNums_2 = 0;
                    let InClassMarks_3 = 0;
                    let InClassNums_3 = 0;

                    let StudentActivity = 0;
                    let AllStudentLessonsCount=0;
                    data.forEach(item => {
                        AllStudentLessonsCount++;
                        if (item.status_was===1){StudentActivity++;}

                        if (item.control_work_mark !== null && Number(item.class_work_mark !== 0)) {
                            UserStatisticks[Number(item.control_work_mark) - 1]++;
                            AllMarksSumm = AllMarksSumm + Number(item.control_work_mark);
                            TotalMarks++;
                        }

                        if (item.class_work_mark !== null && Number( item.class_work_mark !== 0)) {
                            AllMarksSumm = AllMarksSumm + Number(item.class_work_mark);
                            TotalMarks++;
                            UserStatisticks[Number(item.class_work_mark) - 1]++;
                        }
                        if (item.home_work_mark !== null && Number(item.home_work_mark !== 0)) {
                            AllMarksSumm = AllMarksSumm + Number(item.home_work_mark);
                            TotalMarks++;
                            UserStatisticks[Number(item.home_work_mark) - 1]++;
                        }
                        if (item.lab_work_mark !== null && Number(item.lab_work_mark !== 0)) {
                            AllMarksSumm = AllMarksSumm + Number(item.lab_work_mark);
                            TotalMarks++;
                            UserStatisticks[Number(item.lab_work_mark) - 1]++;
                        }
                    });


                    data.forEach(item => {
                        var SubjectPlace = Subjects.indexOf(item.spec_name)
                        if (SubjectPlace === -1){Subjects.push(item.spec_name); SubjectPlace = Subjects.indexOf(item.spec_name);}
                        else {
                            var ret = SubjectAvgMark(item.control_work_mark, item.class_work_mark, item.home_work_mark, item.lab_work_mark)
                            SubjectsVals[SubjectPlace] += ret[0];
                            SubjectsTime[SubjectPlace] += ret[1];
                        }
                    })

                    var SubjStrings=Array(SubjectsVals.length).fill(0)
                    for (var i=0; i<Subjects.length; i++){
                        SubjStrings[i]=(Subjects[i]+": <font class='AccentAvgStats'>"+ ((SubjectsVals[i]/SubjectsTime[i])+'').slice(0,5) + "</font>")
                    }
                    SubjStrings.sort()

                    noDataDiv.textContent ='Загружаем все тесты...';
                    let ExamsSum = 0
                    let ExamsNums = 0;
                    SendPacket("https://msapi.top-academy.ru/api/v2/progress/operations/student-exams", "GET", null, false).then(data => {

                        data = JSON.parse(data);
                        let TestLen = 0;
                        let TestSum = 0;
                        data.forEach(item => {
                            if (item.mark !== null && item.mark !== 0){
                                AllMarksSumm=AllMarksSumm+Number(item.mark);
                                TotalMarks++;
                                ExamsSum += Number(item.mark)
                                ExamsNums++;
                                TestLen++;
                                TestSum+=Number(item.mark)
                                noDataDiv.innerHTML ='Сумма всех оценок: '+AllMarksSumm+", Всего оценок: "+TotalMarks;
                            }
                        })

                        let MaterialsSumm = 0;
                        let MaterialsNums = 0;

                        SendPacket("https://msapi.top-academy.ru/api/v2/library/operations/list?material_type=7&recommended_type=0", "GET", null, false).then(data => {
                            if (data != -1 || data != "-1"){
                                data = JSON.parse(data);

                                data.forEach(item => {
                                    if (item.last_mark !== null && item.last_mark !== 0){
                                        AllMarksSumm=AllMarksSumm+Number(item.last_mark);
                                        TotalMarks++;
                                        MaterialsSumm += Number(item.last_mark)
                                        MaterialsNums++;
                                        if (Number(item.last_mark) === 12) {Mark12++}
                                        noDataDiv.innerHTML ='Сумма всех оценок: '+AllMarksSumm+", Всего оценок: "+TotalMarks;

                                    }
                                })


                                const AverageMark=(AllMarksSumm/TotalMarks)
                                const InClassWork = ((InClassMarks_0/InClassNums_0) + (InClassMarks_1/InClassNums_1) + (InClassMarks_2/InClassNums_2)) / 3
                                const testAvg = (InClassWork + (ExamsSum/ExamsNums) + (MaterialsSumm/MaterialsNums))/3;
                                const ColorPallete=['#FF0000','#EB1700','#D82E00','#C44500','#B15C00','#9E7300','#8A8B00','#77A200','#64B900','#50D000','#3DE700','#2AFF00']
                                var inn =`
                                <h5 class="AvgMarkDiv">Средняя оценка: <b><font color=`+ColorPallete[Math.round(AverageMark-1)]+`> `+(AverageMark.toPrecision(3))+`</font></b>   (`+(AverageMark.toPrecision(6))+`)<br></h5>
                                <div class="AvgMarkList">
                                `
                                for (let i=0; i<12; i++){
                                    inn+=`<span class="AvgStats`;
                                    if (i==11){inn+=" AvgStatsLast";}
                                    inn+=`"> Кол-во оценок <font class="AvgMarkRound" style="background: `+ColorPallete[i]+`60"> "`+(i+1)+`"</font>: `+UserStatisticks[i]+`</span><br>`
                                }
                                inn+=`
                                </div>
                                <div class="AvgMarkList">
                                <span class="PointSubject"> Средняя оценка предметов </span>
                                `;
                                for (let i =0; i<SubjStrings.length; i++){
                                    if (Number(SubjStrings[i]) !== 0){
                                        inn+=`<span class="AvgStats`;
                                        if (i==SubjStrings.length-1){inn+=" AvgStatsLast";} if(i==0) {inn+=" AvgStatsFirst";}
                                        inn+=`">`+SubjStrings[i]+`</span><br>`;
                                    }
                                }
                                inn+=`
                                </div>
                                `;
                                inn+='<span class="AvgStats" style="margin-top: 5px"> Средняя посещаеммость: <b>'+(((StudentActivity/AllStudentLessonsCount)*100)+'').slice(0,5)+'%</b></span>'
                                noDataDiv.innerHTML = inn;



                            }

                        })


                    })

                }


            })

    }
}







function Marks(){

    if (document.querySelectorAll("router-outlet").length === 4){
        document.querySelectorAll("router-outlet")[3].remove()
    }


    const FixPadPanel = document.querySelectorAll(".ng-dropdown-panel .ng-dropdown-panel-items .ng-option");
    for (const item of FixPadPanel) {
        item.style.background=Accent1;
    }
    const FixMARKSItem = document.querySelectorAll(".circle");
    for (const item of FixMARKSItem) {
        item.style.color="lightgray";
    }


    const PadMenu = document.querySelectorAll(".ng-select .ng-select-container");
    const LeftPanel = document.querySelectorAll(".left-block-graph");
    const RightPanel = document.querySelectorAll(".right-block-graph");
    const AllVals = [...PadMenu, ...LeftPanel, ...RightPanel, ...document.querySelectorAll(".no-data"), ...document.querySelectorAll(".lessons"), ...document.querySelectorAll(".date")];



    for (const item of AllVals) {
        item.style.color="White";
    }


    for (const element of document.querySelectorAll('.progress-section .item .content-progress .exams-table .body-list:nth-child(2n)')) {
        element.style.backgroundColor = 'transparent';
        element.style.color = 'white';
    }
    for (const element of [...document.querySelectorAll('.exams-table'), ...document.querySelectorAll('.spec')]) {
        element.style.color = 'wheat'
    }
    for (const element of document.querySelectorAll('.progress-section .item .content-progress .exams-table .list-head .data .info .info-content, .progress-section .item .content-progress .exams-table .body-list .data .info .info-contents')){
        element.style.background=Accent2;
        element.style.borderRadius="20px";
    }
    for (const element of document.querySelectorAll('.tooltip, .tooltip-achieve')) {
        element.style.background = Accent_MainBg;
        element.style.borderRadius="10px";
    }
    for (const element of document.querySelectorAll('.tooltip-inner')) {
        element.style.background = 'transparent';
    }



    const konrab=document.querySelectorAll('.progress-section .item .main-block .block-day .all-less .lessons .kr');
    for (const element of konrab) {
        element.style.borderRadius="10px";
        element.style.background = '#4a7250';
    }

    const elements = document.querySelectorAll('.progress-section .item .content-progress .select .ng-select .ng-select-container .ng-value-container');

    for (const element of elements) {
        element.style.backgroundColor = Accent1;
        element.style.Color='white';
    }

    const FixSomeContent=document.querySelectorAll('.progress-section .item .content-progress .description .circle');
    for (const element of FixSomeContent) {
        element.style.Color='white';
    }



    const ComeInTime = document.querySelectorAll('.progress-section .item .main-block .block-day .all-less .lessons');

    for (const element of ComeInTime) {
        element.style.borderRadius="10px";
        element.style.backgroundColor = '#535353';
    }

    const Late = document.querySelectorAll('.progress-section .item .main-block .block-day .all-less .pass');

    for (const element of Late ) {
        element.style.borderRadius="10px";
        element.style.backgroundColor = '#48273a';
    }

    const Lates = document.querySelectorAll('.progress-section .item .main-block .block-day .all-less .lateness');
    for (const element of Lates) {
        element.style.border = '2px solid yellow';
    }

    try{CreateAvgMarks();}catch(e){if (Number(localStorage.getItem("BJ:Debug"))===1) {console.log(e)} else {console.log("Failed To Execute CreateAvgMarks function:",e)}}
    var TestsVal = 0;
    if (Number(localStorage.getItem("BJ(Tests):Len"))!==0){

        TestsVal = Number(localStorage.getItem("BJ(Tests):Sum") / Number(localStorage.getItem("BJ(Tests):Len")));

    }




}


function Materials(){
    const MaterialCard = [...document.querySelectorAll('.sections-lessons .lessons-block'), ...document.querySelectorAll('.section-libs .books-block'), ...document.querySelectorAll('.section-video .video-block'),
                          ...document.querySelectorAll('.section-article .article-block'),...document.querySelectorAll('.sections-lessons .lessons-block .lesson-info .full-lesson-info'),
                         ...document.querySelectorAll('.section-article .article-block .text-article .article-description:hover .all-description'),
                         ...document.querySelectorAll('.sections-lessons .lessons-block .lesson-title .full-lesson-theme')
                         ];
    for (const element of MaterialCard) {
        element.style.color="white";
        element.style.borderRadius = '20px';
        element.style.background = Accent2;
        element.style.boxShadow = '0px 2px 15px #000000';
    }

    const MaterialCardFix_LastElements = [...document.querySelectorAll('.section-work .work-block .item-header'), ...document.querySelectorAll('.section-tests .test-block-index .header'),
                                          ...document.querySelectorAll('.section-work .work-block .item-footer'),
                                          ...document.querySelectorAll('.section-work .work-block .cover-block'),
                                          ...document.querySelectorAll('.section-tests .test-block-index .test-block-footer')
                         ];
    for (const element of MaterialCardFix_LastElements) {
        element.style.color="white";
        //element.style.borderRadius = '20px';
        element.style.background = Accent2;
        element.style.boxShadow = '0px 2px 15px #000000';
    }


    const MaterialCardRound = [...document.querySelectorAll(".sections-lessons .lessons-block .lessons-cover .has-image"), ...document.querySelectorAll('.sections-lessons .lessons-block')];
    MaterialCardRound.forEach((element) => {
        element.style.borderRadius = "15px";
    });

    const LeftButtonPanel = document.querySelectorAll(".materials-section .libs-nav ul li");
    for (const element of LeftButtonPanel) {
        element.style.background=Accent2;
        element.style.color="white";
        element.style.borderRadius = "20px";

    }

    if (document.querySelector(".modal-content")!==null) {
        document.querySelector(".modal-content").style.background=Accent3
        document.querySelector(".modal-content").style.borderRadius="20px";
    };

    const Divs = document.querySelectorAll(".materials-section .libs-nav ul li a");
    for (const element of Divs) {
        element.style.color="#d3edd7";

    }//

    const PadMenu = document.querySelectorAll(".title-group .form-group .ng-select .ng-dropdown-panel .scroll-host .ng-option");
    for (const element of PadMenu) {
        element.style.background="#111111";
    }

    const FixHints_Page5 = document.querySelectorAll(".section-work .work-block .item-header .info .info-content");
    for (const element of FixHints_Page5) {
        element.style.background="#101010cf";
    }


    const PadMenuRePaint = document.querySelectorAll(".title-group .form-group .ng-select .ng-select-container .ng-value-container");
    for (const element of PadMenuRePaint) {
        element.style.color="white";
        element.style.background=Accent3;
    }

    const PadMenuActive = document.querySelectorAll(".title-group .form-group .ng-select .ng-dropdown-panel .scroll-host .ng-option:hover");
    for (const element of PadMenuActive) {
        element.style.background=Accent0;
    }

    const AllVals = [...(document.querySelectorAll(".test-block-index"))];
    const AllNums=[...(document.querySelectorAll(".section-tests .test-block-index .proxy .count-checked"))];
    localStorage.setItem("BJ(Tests):Len", AllVals.length);
    let summ=0;
    const AllHints = [...(document.querySelectorAll(".section-tests .test-block-index .header .info-content"))];
    for (const element of AllHints) {element.style.background="#0e0e0ef5";}

    const TestPressed = document.querySelectorAll(".popup-test");
    for (const element of TestPressed) {element.style.background='transparent'; element.style.color="white";}

    if (AllVals.length!==0){


        AllNums.forEach((Pane) => {
            summ=summ+Number(Pane.textContent)
        });
    }
    localStorage.setItem("BJ(Tests):Sum", summ);



}


function MainFloat(){
    const Hints2 = document.querySelectorAll(".navbar");
    const secondElement = Hints2[1];
    secondElement.style.borderRadius = "40px";


    const PosFt = document.querySelectorAll(".pos-f-t");
    for (const Ipos of PosFt){
        Ipos.style.background = Accent_MainBg;
        Ipos.style.paddingTop = "30px";
        Ipos.style.paddingLeft = "35px";
        Ipos.style.paddingRight = "35px";
    }
}


function NewsPage(){
    const Lists = document.querySelectorAll(".news-section .item .news-container");
    for (const item of Lists){
        item.style.background=Accent2;
        item.style.color="white";
    }
    const NewsPaper = document.querySelectorAll(".big-news-container");
    for (const item of NewsPaper){
        item.style.background=Accent2;
        item.style.borderRadius="20px";
    }

    const FixBCont = [...document.querySelectorAll("b"), ...document.querySelectorAll("div")];
    for (const item of FixBCont){
        item.style.color="white";
    }
    const Modals = document.querySelectorAll(".modal-content");
    for (const item of Modals){
        item.style.background="transparent";
        item.style.border="none";
    }
}


function Awards(){
    const Lists = document.querySelectorAll(".awards-section .item .content-awards");
    for (const item of Lists){
        item.style.backgroundColor=Accent2;
        item.style.borderRadius="20px";
        item.style.color="white";
    }
    const FixUnRounded = document.querySelectorAll(".row");
    for (const item of FixUnRounded){
        item.style.marginLeft= '0px';
    }

    const HowToGetIt = document.querySelectorAll(".description-of-awards");
    for (const item of HowToGetIt){
        item.style.background=Accent3;
        item.style.color="white";
        item.style.height="100%";
        item.style.borderRadius="30px";
    }


}


function FeedBack(){
    const TopPane = document.querySelectorAll(".feedback-col.grey-border");
    TopPane.forEach((Pane) => {
        Pane.style.backgroundColor = Accent2;
        Pane.style.borderradius="15px";
    });
    const AllTexts = document.querySelectorAll(".div");
    TopPane.forEach((Pane) => {
        Pane.style.color = "white";
    });
        const DescriptionOfAwards = document.querySelectorAll(".feedback-section[_ngcontent-c6] .item[_ngcontent-c6] .feedback-col[_ngcontent-c6]");
    for (const item of DescriptionOfAwards){item.style.borderRadius="40px";}

}




function Payment(){//
    const FirstElement = document.querySelectorAll(".payment-section .item .payment-item");
    for (const item of FirstElement){
        item.style.background = Accent2;
        item.style.borderRadius = "25px";
    }
    const FixThisUglyButton = document.querySelectorAll(".button-check");
    for (const item of FixThisUglyButton) {
        item.style.width="100%";
    }
    const SecondFixThisUglyButton = document.querySelectorAll(".payment-section .item .payment-item .button-check a");
    for (const item of SecondFixThisUglyButton) {
        item.style.width="100%";
        item.style.borderRadius="10px";
    }

    const AllDivs = [...document.querySelectorAll(".title"), ...document.querySelectorAll(".table-row")];
    for (const item of AllDivs) {
        item.style.color="wheat";
    }
    const AllSpans = document.querySelectorAll("span");
    for (const item of AllSpans) {
        item.style.color="white";
    }
}

function Cabinet(){

    const WhiteElement=document.querySelectorAll('.item.profile-block');
    for (const item of WhiteElement){
        item.style.background = 'transparent';
    }

    const AllItems = [...document.querySelectorAll(".item.progress-block"),...document.querySelectorAll('.item.profile-achieve.no-refs'),...document.querySelectorAll('.span'),
                      ...document.querySelectorAll('.profile-block[_ngcontent-c7] .conteiner-profile[_ngcontent-c7] .form[_ngcontent-c7] form[_ngcontent-c7] .form-block[_ngcontent-c7] .form-group[_ngcontent-c7] .form-control[_ngcontent-c7]')];

    for (const item of AllItems){
        item.style.color="white";
        item.style.background = Accent1;
        item.style.borderRadius="30px";
    }

    const ProfImage = document.querySelectorAll(".profile-img");
    for (const item of ProfImage){
        item.style.background = "#ffffff0f";
    }

    const VlsInputs = document.querySelectorAll("textarea.form-control.address.ng-pristine.ng-valid.ng-touched");
    for (const item of VlsInputs){
        item.style.background = Accent3;
        item.style.color="white";
    }


    const TextAreas = [...document.querySelectorAll("input.form-control.fio.ng-untouched.ng-pristine"),...document.querySelectorAll(".profile-block[_ngcontent-c6] .conteiner-profile[_ngcontent-c6] .form[_ngcontent-c6] form[_ngcontent-c6] .form-block[_ngcontent-c6] .form-group[_ngcontent-c6] .form-control[_ngcontent-c6]")];
    for (const item of TextAreas){
        item.style.color="white";
        item.style.backgroundColor = Accent3;
    }

    try{
        const Hint = document.querySelectorAll(".photo-requirments-info-content");
        for (const item of Hint){
            item.style.color="white";
            item.style.backgroundColor = Accent1+"d9";
            item.style.borderRadius="15px";
        }
    }catch(e){}

    try{
        const ChangePassWordPanel = document.querySelectorAll(".item[_ngcontent-c6]");
        for (const item of ChangePassWordPanel){
            item.style.color="white";
            item.style.backgroundColor = Accent2;
        }
        const NewPasswords = [...document.querySelectorAll("input#oldPassword"), ...document.querySelectorAll("input#newPassword"), ...document.querySelectorAll("input#repeatNewPassword")];
        for (const item of NewPasswords){
            item.style.color="white";
            item.style.backgroundColor = "#353535";
        }
    } catch(e){}

}


function FAQ(){
    const Cards = document.querySelectorAll(".faq-section .item .faq-item");
    for (const item of Cards){
        item.style.color="white";
        item.style.backgroundColor = 'transparent';
    }
    const CardsFix = document.querySelectorAll(".faq-section .panel-group .panel-default .card-header");
    for (const item of CardsFix){
        item.style.color="white";
        item.style.backgroundColor = Accent0;
    }
    const MakeShadows = document.querySelectorAll(".faq-section .panel-group .panel .card");
    for (const item of MakeShadows){
        item.style.background='transparent';
        item.style.boxShadow="0px 0px 15px rgb(6 6 6 / 64%)";
    }
    const Awnsers = document.querySelectorAll(".faq-section .panel-group .panel-default .panel-collapse .panel-body");
    for (const item of Awnsers){
        item.style.background=Accent0;
    }



}


function Market(){
    const ProductItems = document.querySelectorAll(".shop-section .item .product-block");
    for (const item of ProductItems){
        item.style.background=Accent2;
        item.style.color="wheat";
        item.style.borderRadius="20px";
    }
    const ProductItemsHover = document.querySelectorAll(".shop-section .item .product-block .product-img .on-hover");
    for (const item of ProductItemsHover){
        item.style.backgroundColor="rgb(255 255 255 / 0%)";
        item.style.border="3px solid rgb(196 196 196 / 35%)"
        item.style.borderStartStartRadius="20px";
        item.style.borderStartEndRadius="20px";
    }


    const Spans = document.querySelectorAll(".span");
    for (const item of Spans){
        item.style.color="wheat";
    }

    const LockedButton = document.querySelectorAll("button");
    for (const item of LockedButton) {
        item.removeAttribute('disabled');
    }



    const ShopItems = document.querySelectorAll(".modal-basket .basket");
    ShopItems.forEach((Pane) => {
        Pane.style.backgroundColor=Accent2;
        Pane.style.borderRadius="25px";
        Pane.style.color="white";
    });

    const ModCont = document.querySelectorAll(".modal-content");
    for (const item of ModCont) {
        item.style.height = "0px";
        item.style.padding = "0px 0";
    }

    const ItemsList = document.querySelectorAll(".modal-basket .basket .product");
    ItemsList.forEach((Pane) => {
        Pane.style.borderRadius="20px";
        Pane.style.backgroundColor=Accent1;
        Pane.style.color="white";
    });

    const Purshs = document.querySelectorAll(".my-purchases");
    Purshs.forEach((Pane) => {
        Pane.style.borderRadius="20px";
        Pane.style.backgroundColor=Accent1;
        Pane.style.color="white";
    });

    const PurshsList = document.querySelectorAll(".my-purchases .accordion .header-accordion");
    PurshsList.forEach((Pane) => {
        Pane.style.borderRadius="20px";
        Pane.style.backgroundColor=Accent2;
        Pane.style.color="white";
    });




    //
    const MakeButtonsBlack = document.querySelectorAll(".modal-basket .basket .product .counter .minus, .modal-basket .basket .product .counter .plus");
    for (const item of MakeButtonsBlack) {
        item.style.backgroundColor="black";
    }

    const MakeDescBlack = document.querySelectorAll(".modal-basket .basket .block-all .all-container");
    for (const item of MakeDescBlack) {
        item.style.borderRadius="15px";
        item.style.backgroundColor=Accent1;
    }

    const BlackInput = document.querySelectorAll(".modal-basket .basket .comment .comment-field textarea");
    for (const item of BlackInput) {
        item.style.color="white";
        item.style.backgroundColor=Accent1;
    }

    const DisabledButton = document.querySelectorAll(".shop-section .item .not-available .item-footer button");
    for (const item of DisabledButton) {
        item.style.backgroundColor="#4D4542";
    }

    const ProdBlock = document.querySelectorAll(".modal-product .product-block");
    for (const item of ProdBlock) {
        item.style.color="white";
        item.style.backgroundColor=Accent2;
        item.style.borderRadius="20px";
    }

    const Spans2 = document.querySelectorAll("span");
    for (const item of Spans2) {
        item.style.color="white";
    }

}



function AdministrationPage(){
    const Blocks = document.querySelectorAll(".contacts-section .item .contacts-block");
    for (const item of Blocks){
        item.style.color="white";
        item.style.borderRadius="30px";
        item.style.background=Accent2;
    }
}

function SpawnUnAvaiable(){
    var li = document.querySelector(".vacancy-item");
    li.innerHTML = "<a href=\"/ru/main/vacancy/page\"><span class=\"side-text\" id=\"vacancy\" style=\"color: white;\">Вакансии</span></a>";

    var li2 = document.querySelector(".meal-item");
    li2.innerHTML = "<a href=\"/ru/main/meal/page\"><span class=\"side-text\" id=\"meal\" style=\"color: white;\">Питание</span></a>";

    var li3 = document.querySelector(".food-pay-item");
    li3.innerHTML = "<a href=\"/ru/main/food-pay/page\"><span class=\"side-text\" id=\"food-pay\" style=\"color: white;\">Оплата питния</span></a>";
}


function LiteBar(){
    if (document.getElementById("LiteBarId") === null){
        var Add='';
        if (localStorage.getItem("BJ.DefStyle") === "0"){Add='a4';}
        var styleTag = document.createElement('style');
        styleTag.id = 'LiteBarId';
        var dynamicStyleCss = document.createTextNode(`
        .overlay {display: none;}
        .sidebar-parent-block .sidebar ul.sidebar-nav li:hover {background: transparent}
        .sidebar-parent-block .sidebar{transition: all 0.5s;}
        .sidebar-parent-block .sidebar.active ul.sidebar-nav {margin: 0; padding: 0 20px; margin-top: 13px}
        .sidebar-parent-block .sidebar .sidebar-content, .sidebar-parent-block .sidebar.active .sidebar-content{background:`+Accent_MainBg+Add+`;}
        .sidebar-parent-block .sidebar .sidebar-content, .sidebar-parent-block .sidebar.active .sidebar-content::-webkit-scrollbar-thumb { background-color: transparent !important; }
        .sidebar-parent-block .sidebar .sidebar-content, .sidebar-parent-block .sidebar.active .sidebar-content::-webkit-scrollbar-track {background-color: transparent !important;}
        `);

        styleTag.appendChild(dynamicStyleCss);
        var header = document.getElementsByTagName('body')[0];
        header.appendChild(styleTag);
    } else {
        var Add2='';
        if (localStorage.getItem("BJ.LiteBar") === "1") {
            Add2 = `.sidebar-parent-block .sidebar .sidebar-content, .sidebar-parent-block .sidebar.active .sidebar-content, .wrap .sidebar-parent-top-block .sidebar .sidebar-content{background:`+Accent_MainBg
        }
        if (localStorage.getItem("BJ.TransparentPanel") !== null) {
            Add2 = `.sidebar-parent-block .sidebar .sidebar-content, .sidebar-parent-block .sidebar.active .sidebar-content, .wrap .sidebar-parent-top-block .sidebar .sidebar-content{background:`+(Accent_MainBg.slice(0,7)+localStorage.getItem("BJ.TransparentPanel"))
        }

        if (localStorage.getItem("BJ.DefStyle") === "0"){Add2=Add2+'a4';}
        if (Add2!==""){Add2=Add2+"}"}
        var LiteBarElement = document.getElementById('LiteBarId');
        LiteBarElement.textContent=`
        .overlay {display: none;}
        .sidebar-parent-block .sidebar ul.sidebar-nav li:hover {background: transparent}
        .sidebar-parent-block .sidebar{transition: all 0.5s;}
        .sidebar-parent-block .sidebar.active ul.sidebar-nav {margin: 0; padding: 0 20px; margin-top: 13px}
        .sidebar-parent-block .sidebar .sidebar-content, .sidebar-parent-block .sidebar.active .sidebar-content{background:`+Accent_MainBg+Add+`;}
        .sidebar-content { overflow: hidden; }
        `+Add2;
    }


}


function CoinCssSpawn(){
    if (document.getElementById("HintFix") === null){
        var styleTag = document.createElement('style');
        styleTag.id = 'HintFix';
        var dynamicStyleCss = document.createTextNode(`
        .counts-tooltip {background: `+Accent_MainBg+` !important;}
        .counts-tooltip .tooltip-inner {background: transparent; color: white}`);
        styleTag.appendChild(dynamicStyleCss);
        var header = document.getElementsByTagName('body')[0];
        header.appendChild(styleTag);
    } else {

        var HintStyle = document.getElementById("HintFix");

        if (localStorage.getItem("BJ.LevBar") === "1"){
            MainFloat()
            HintStyle.textContent=`
            .counts-tooltip {display: none;}
            .right-block .logout-link {margin-left: 15px; padding-right: 5px}
            .justify-content-between .left-block .user-full-name {display: none}
            .counts-tooltip .tooltip-inner {display: none;}
            .justify-content-between {padding: 0px; width: fit-content; position: fixed; right: 40px; z-index: 4}
            .wrapper {padding-top: 0px}
            bs-tooltip-container.tooltip.in.tooltip-bottom.bs-tooltip-bottom.bottom.counts-tooltip.star.show, bs-tooltip-container.tooltip.in.tooltip-auto.bs-tooltip-auto.auto.counts-tooltip.show.bottom{display:none};
            `;

        } else {
            HintStyle.textContent=`
        .counts-tooltip {background: `+Accent_MainBg+` !important;}
        .counts-tooltip .tooltip-inner {background: transparent; color: white}`;
        }
    }
}

function TransBar(State){
    if (State===true){
        var styleTag = document.createElement('style');
        styleTag.id = 'TransBar';
        var dynamicStyleCss = document.createTextNode(`
        .sidebar-parent-block .sidebar .sidebar-content {background: transparent}
        .sidebar-parent-block .sidebar {background-image: none; border-right: solid 2px `+Accent0+`}
        .sidebar-parent-block .sidebar.active .sidebar-content {background: transparent}`);
        styleTag.appendChild(dynamicStyleCss);
        var header = document.getElementsByTagName('body')[0];
        header.appendChild(styleTag);
    } else {
        var StTag = document.getElementById("TransBar");
        if (StTag!==null){
            StTag.remove();
        }
    }
}

function NonImageBar(State){
    if (document.getElementById("NonIMGCss") === null && State===true){
        var styleTag = document.createElement('style');
        styleTag.id = 'NonIMGCss';
        var dynamicStyleCss = document.createTextNode(`
        .sidebar-parent-block .sidebar, .wrap .sidebar-parent-top-block .sidebar {background-image: none}`);
        styleTag.appendChild(dynamicStyleCss);
        var header = document.getElementsByTagName('body')[0];
        header.appendChild(styleTag);
    } else if (State===false) {
        if (document.getElementById("NonIMGCss") !== null){
            document.getElementById("NonIMGCss").remove();
        }
    }
}



function MainCssStyle(){
    //Flowing_()
    if (localStorage.getItem("BJ.CircularMenu") !== null && document.getElementById('FlowingCircularMenu') === null){
        let CirclarMenuHTML = document.createElement('div');
        CirclarMenuHTML.id='FlowingCircularMenu';
        document.body.appendChild(CirclarMenuHTML)
    } else if (document.getElementById('FlowingCircularMenu') !== null && document.getElementById('FlowingCss')===null){
        let CirclarMenuHTML = document.getElementById('FlowingCircularMenu');
        if (document.getElementById('FlowingCss')===null){
            var FlowCss=document.createElement('style')
            FlowCss.id='FlowingCss'
            FlowCss.textContent=`


.menu-toggler:hover + label,
.menu-toggler:hover + label:before,
.menu-toggler:hover + label:after,{
  background: white;
}
.menu-toggler:checked + label {
  background: transparent;
}
.menu-toggler:checked + label:before,
.menu-toggler:checked + label:after,{
  top:0;
  width:40px;
  transform-origin: 50% 50%;
}
.menu-toggler:checked + label:before {
  transform: rotate(45deg) translateY(-15px) translateX(-15px);
}
.menu-toggler:checked + label:after {
  transform: rotate(-45deg);
}
.menu-toggler:checked ~ ul .menu-item {
  opacity: 1;
}
.menu-item:nth-child(1) {
  transform: rotate(0deg) translate(-110px);
}
.menu-item:nth-child(2) {
  transform: rotate(60deg) translateX(-110px);
}
.menu-item:nth-child(3) {
  transform: rotate(120deg) translateX(-110px);
}
.menu-item:nth-child(4) {
  transform: rotate(180deg) translateX(-110px);
}
.menu-item:nth-child(5) {
  transform: rotate(240deg) translateX(-110px);
}
.menu-item:nth-child(6) {
  transform: rotate(300deg) translateX(-110px);
}
.menu-toggler:checked ~ ul .menu-item a {
  pointer-events:auto;
}
.menu-toggler + label {
  width: 40px;
  height: 5px;
  display: block;
  z-index: 1;
  border-radius: 2.5px;
  background: rgba(230, 239, 250, 0.9);
  transition: transform 0.5s top 0.5s;
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.menu-toggler + label:before,
.menu-toggler + label:after {
  width: 40px;
  height: 5px;
  display: block;
  z-index: 1;
  border-radius: 2.5px;
  background: rgba(255, 255, 255, 0.7);
  transition: transform 0.5s top 0.5s;
  content: "";
  position: absolute;
  display: block;
  left: 0;
}
.menu-toggler + label:before {
  top: 10px;
}
.menu-toggler + label:after {
  top: -10px;
}
.menu-item {
  position: absolute;
  display: block;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 80px;
  height: 80px;
  opacity: 1;
  transition: 0.5s;
}
.menu-item a {
  display: block;
  width: inherit;
  cursor: pointer;
  height: inherit;
  line-height: 80px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(230, 230, 250, 0.7);
  border-radius: 50%;
  text-align: center;
  text-decoration: none;
  font-size: 40px;
  pointer-events: none;
  transition: 0.2s;
}
.menu-item a:hover {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  color: white;
  background: rgba(255, 255, 255, 0.3);
  font-size: 44.44px
}
.CircularCloseImage {
    opacity: 0.8;
    width: 60px;
    position: absolute;
    margin-top: 12px;
    top: 50%;
    cursor: pointer;
    left: 50%;
    transform: translate(-50%, -50%);
}
.CircularSecondHint {
    display: flex;
    position: absolute !important;
    rotate: -60deg !important;
    padding-top: 110%;
}
.CircularThirdHint {
    display: flex;
    position: absolute !important;
    rotate: -120deg !important;
    padding-top: 140%;
    padding-left: 32.5%;
}
.CircularThirdHintReverse {
    display: flex;
    position: absolute !important;
    rotate: -240deg !important;
    padding-top: 140%;
    padding-right: 108%;
}
.CircularFourthHint {
    display: flex;
    position: absolute !important;
    rotate: -180deg !important;
    padding-top: 140%;
}
.CircularLastHintReverse {
    display: flex;
    position: absolute !important;
    rotate: -300deg !important;
    padding-top: 100%;
}
li.menu-item label center {
    width: -webkit-fill-available;
    cursor: pointer
}
.menu-item {cursor: pointer}
.menu-item:hover {scale: 1.06}
.menu-item label {width: -webkit-fill-available; cursor: pointer; color: white; position: relative; top: -10px}
#FirstButton {mask: url(/assets/resources/main.svg) no-repeat 50% 50%}
#SecondButton {
    mask: url(/assets/resources/calendar.svg) no-repeat 50% 50%;
    rotate: -60deg;
    left: 2px;
    position: absolute;
    cursor: pointer;
    z-index: 200;
    mask-size: 78%
}
#ThirdButton {
    mask: url(/assets/resources/line.svg) no-repeat 50% 50%;
    rotate: -120deg;
    left: 2px;
    position: absolute;
    cursor: pointer;
    z-index: 200;
    mask-size: 74%
}
#ThirdButtonR {
    mask:url(/assets/resources/pen.svg) no-repeat 50% 50%;
    rotate: -240deg;
    left: 2px;
    position: absolute;
    cursor: pointer;
    z-index: 200;
    mask-size: 70%
}
#FourthButton {
    mask: url(/assets/resources/tasks.svg) no-repeat 50% 50%;
    rotate: -180deg;
    left: 2px;
    position: absolute;
    cursor: pointer;
    z-index: 200;
    mask-size: 80%
}
#LastButton {
    mask: url(/assets/resources/shopping.svg) no-repeat 50% 50%;
    rotate: -300deg;
    left: 2px;
    position: absolute;
    cursor: pointer;
    z-index: 200;
    mask-size: 70%
}

.CurrentCountOfHW {
    position: fixed;
    width: 25px;
    height: 25px;
    text-align: center;
    rotate: 180deg;
    left: 0px;
    bottom: 0px;
    border-radius: 200px;
    scale: 0.9;
    display: none;
    background: `+Accent3+`;
    z-index: 90;
    border: solid 2px `+Accent0+`;
}

.CurrentCountOfFeedBack {
    position: absolute;
    bottom: -20px;
    left: 30px;
    width: 25px;
    height: 25px;
    text-align: center;
    rotate: 120deg;
    border-radius: 200px;
    scale: 0.9;
    display: none;
    background: #101010;
    z-index: 90;
    border: solid 2px #3b3b3b;
}

#WhatsWithUpdate {position: absolute; right: 0px; padding: 2px; cursor: pointer; bottom: 0px; outline: none; opacity: 0.5; margin: 5px}

            div#FlowingCircularMenu {position: fixed; top: 50%; left: 50%; width: 100%; height: 100%; z-index: 90030; transform: translate(-50%, -50%); display: none;}
            #CircularClose{position: relative; height: 10%; transform: translate(-50%, -50%); display: block;  top: 50%; left: 50%; border-radius: 2000px;)
            `
            document.body.appendChild(FlowCss)

        }
        window.TildaKeyPress = function() {
            if (localStorage.getItem('BJ.CircularMenu') !== null){
            try{
            if (document.getElementById('FlowingCircularMenu').style.display !== 'block'){
                let FreeSideBar = document.createElement('style')
                FreeSideBar.id='FreeSideBarCircular'
                if (localStorage.getItem('BJ.CircularMenuShowOriginalbar') !==null){
                FreeSideBar.textContent = `
                     .sidebar-parent-block {display: block !important; z-index: 90031; position: absolute; opacity: 0.75;}
                     .sidebar-parent-block .sidebar .sidebar-content, .sidebar-parent-block .sidebar.active .sidebar-content, .wrap .sidebar-parent-top-block .sidebar .sidebar-content {background: transparent !important}
                `;
                }
                document.body.after(FreeSideBar)
                if (document.querySelector('li.homeworks-item a span.badge-counter') !== null){
                    document.getElementById('CurrentCountOfHW').style.display = 'block'
                    document.getElementById('CurrentCountOfHW').textContent = document.querySelector('li.homeworks-item a span.badge-counter').textContent
                }

                document.getElementById('FlowingCircularMenu').style.background = Accent3
                document.getElementById('FlowingCircularMenu').style.display = 'block'
                if (document.querySelector('.feedback-item a span.badge-counter') !== null && document.querySelector('.feedback-item a span.badge-counter').textContent !== '') {
                    document.getElementById('CurrentCountOfFeedBack').textContent = document.querySelector('.feedback-item a span.badge-counter').textContent
                    document.getElementById('CurrentCountOfFeedBack').style.display = 'block'
                } else {document.getElementById('CurrentCountOfFeedBack').style.display = 'none'}

            } else {
                window.CloseCircularMenu()
                document.getElementById('CurrentCountOfFeedBack').style.display = 'none';
            }}catch(ee){console.error(ee)}
            }
        }



        window.CloseCircularMenu = function(){
            document.getElementById('FlowingCircularMenu').style.display = 'none'
            while (document.getElementById('FreeSideBarCircular') !== null){
                document.getElementById('FreeSideBarCircular').remove()
            }
        }
        CirclarMenuHTML.innerHTML=`

<nav class="menu" id="FlowingMenu">
  <img src="https://github.com/0mnr0/WallpaperInJournal/blob/main/res/close_circular.png?raw=true" class="CircularCloseImage" onclick="CloseCircularMenu()">
  <ul>
    <li class="menu-item" onClick="document.querySelector('li.main-item a').click(); CloseCircularMenu()">
      <a class="fas fa-cat" id="FirstButton"></a>
      <label><center>Главная</center></label>
    </li>
    <li class="menu-item" onClick="document.querySelector('li.schedule-item a').click(); CloseCircularMenu()">
      <a id='SecondButton'></a>
      <label class="CircularSecondHint"><center>Расписание</center></label>
    </li>
    <li class="menu-item" onClick="document.querySelector('li.progress-item a').click(); CloseCircularMenu()">
      <a id='ThirdButton'></a>
      <label class="CircularThirdHint"><center>Оценки</center></label>
    </li>
    <li class="menu-item" onClick="document.querySelector('li.homeworks-item a').click(); CloseCircularMenu()">
      <span id='CurrentCountOfHW' class='CurrentCountOfHW'></span>
      <a id='FourthButton'></a>
      <label class="CircularFourthHint"><center>Домашка</center></label>
    </li>
    <li class="menu-item" onClick="document.querySelector('li.feedback-item a').click(); CloseCircularMenu()">
      <span id='CurrentCountOfFeedBack' class='CurrentCountOfFeedBack'></span>
      <a id='ThirdButtonR'></a>
      <label class="CircularThirdHintReverse"><center>Отзывы</center></label>
    </li>
    <li class="menu-item" onClick="document.querySelector('.shop-nav-link a').click(); CloseCircularMenu()">
      <a id="LastButton"></a>
      <label class="CircularLastHintReverse"><center>Магазин</center></label>
    </li>
  </ul>
</nav>
        `;
    }



    if (document.querySelector("nav.navbar.navbar-expand-lg.justify-content-between") !== null && document.getElementById("MainBetterJournalCss") === null){
        var styleTag = document.createElement('style');
        styleTag.id = 'MainBetterJournalCss';
        var dynamicStyleCss = document.createTextNode('');
        styleTag.appendChild(dynamicStyleCss);
        var header = document.getElementsByTagName('body')[0];
        header.appendChild(styleTag);
    } else {
        if (document.getElementById("MainBetterJournalCss") !== null){
            var Style=document.getElementById("MainBetterJournalCss");

            const Content=`
            html {background: `+Accent3.slice(0,7)+`;}
            nav.navbar.navbar-expand-lg.justify-content-between {transition: all 0.3s}
            .homepage-wrapper .inner, button#SaveButtonInSettings {transition: all 0.5s}
            button#SaveButtonInSettings {background: `+Accent_MainBg+`}
            .app-tags-input-item {transition: all .5s}
            .app-tags-input-item:hover {scale: 1.1}
            .app-tags-input-item:active {scale: 1.2}
            .rating-star {transition: all .5s}
            .rating-star:hover {scale: 1.06}
            .rating-star:active {scale: 1.12}
            body{background: black}
            .my-8.bg-gradient-gray {background: black}
            .modal-content .comment-block .comment-block-textarea, .modal-content .on-hover {outline: none; border: solid 2px `+Accent1+`; background: transparent; border: none !important}
            .modal-content .comment-block .comment-block-textarea, .modal-content {color:white; background: `+Accent2+` !important; border-radius: 20px; transition: all .3s}
            .modal-content .confirm-evaluation .btn-default {background: `+Accent3+`; color: white; transition: all .5s; outline: none}
            .modal-content h3:after {display: none}
            .modal-content .confirm-evaluation .btn-default:hover {background: `+Accent1.slice(0,7)+`; scale:1.02}
            .modal-content .confirm-evaluation .btn-default:active {background: `+Accent0.slice(0,7)+`; scale:1.04}
            .modal-content .bonus-text .crystal-bonus:after {top: 0px; height: -webkit-fill-available;}
            .app-tags-input-item {background: `+Accent3+` !important}
            .app-tags-input-item.active {background: `+Accent0.slice(0,7)+` !important}
            .modal-content .rating-block {background: transparent}
            .rating-star svg polygon.filled {fill: #ebb422;}
            .rating-star svg polygon {transition: all .4s}
            h3, h4, .modal-content .eval-counter, .modal-content .eval-details, .modal-content .eval-details, .modal-content .comment-block {color:white}
            p {color: white}
            `;



            Style.textContent=Content;

        }
    }

    try{
        if (document.querySelector("a.fio-stud") !== null && localStorage.getItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink")!==null){
            const Avatars = document.querySelectorAll(".avatar");
            Avatars.forEach(Avatar => {
                console.warn(Avatar)
                if (OriginalAvatar===null){OriginalAvatar=Avatar.src};

                Avatar.name="Modded";
                if (Avatar.src !== localStorage.getItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink")){
                    Avatar.src = localStorage.getItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink");
                }
            })
        } else if (document.querySelector("a.fio-stud")!== null && localStorage.getItem("BJ."+document.querySelector("a.fio-stud").textContent+"AVTLink")===null && OriginalAvatar!==null){
            const Avt = document.querySelectorAll(".avatar")[1];
            Avt.src=OriginalAvatar;
            OriginalAvatar=null;

        }
    }catch(e){console.error(e)}
}


function LevBar(){

    var NavBar = document.querySelectorAll("nav.navbar.navbar-expand-lg.justify-content-between")[1];

    var CssCode=`
        .justify-content-between{ padding: 0px; }
        .justify-content-between .left-block .user-full-name {display: none;}
        bs-tooltip-container.tooltip.in.tooltip-auto.bs-tooltip-auto.auto.counts-tooltip.show{display: none;  }
        nav.navbar.navbar-expand-lg.justify-content-between {position: fixed; z-index: 900; right: 25px; top:25px; border-radius:40px }
        .right-block .logout-link{margin-right: 10px}
        .dropup, .dropright, .dropdown, .dropleft {dispay: none;}
        nav#LevitationBar:hover {background: `+Accent2+` !important}
        span.dropdown.dropdown-langs {display: none;}
        .right-block .align-self-end .img-logout-block{margin-left: 10px;}
        .wrap-counts{padding: 0 0px; transition: all .5s}
        .avatar {transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)}
        .avatar:hover {scale: 1.15}
        .avatar:active {scale: 1.2}
        span#all-pricess{margin-left: 5px}
        .pos-f-t{display:none;}
        .justify-content-between .wrap-counts .count-item, span#all-pricess{cursor: default}
        `;
    if (window.location.href === "https://journal.top-academy.ru/ru/main/market/page/index" || window.location.href.includes("https://journal.top-academy.ru/ru/main/library/page/index")){
        CssCode=CssCode+'nav.navbar.navbar-expand-lg.justify-content-between {top:65px;}'
    }
    let Avt = document.querySelectorAll(".avatar")[1];
    Avt.setAttribute('onClick','ShowImage(this.src)')



    if (localStorage.getItem("BJ.LevBar") === "1" && document.getElementById("LevitationBar") === null){
        NavBar.id='LevitationBar';
        NavBar.style.transition="all .3s"
        const wrapper = document.querySelectorAll(".wrapper")[0];
        wrapper.parentNode.insertBefore(NavBar, wrapper);

        var styleTag = document.createElement('style');
        styleTag.id = 'LevitationBarCss';
        var dynamicStyleCss = document.createTextNode(CssCode);

        styleTag.appendChild(dynamicStyleCss);
        var header = document.getElementsByTagName('body')[0];
        header.appendChild(styleTag);


    } else {
        if (document.getElementById("LevitationBarCss") !== null && localStorage.getItem("BJ.LevBar") === null){
            document.getElementById("LevitationBarCss").remove();
        }
        if (document.getElementById("LevitationBarCss") !== null && localStorage.getItem("BJ.LevBar") !== null){
            document.getElementById("LevitationBarCss").textContent=CssCode;


        }
    }
}


function Main(){
    try{ if (localStorage.getItem("BJ.LevBar") === null) {MainFloat();}} catch (e){}
    if (StyleLoaded===0){SetStyle(Number(localStorage.getItem("BJ.DefStyle"))); StyleLoaded=1;}



    if (localStorage.getItem("BJ.SetStyle")!=="-inf"){
        SetStyle(Number(localStorage.getItem("BJ.SetStyle")));
    }


    if (localStorage.getItem("BJ.LiteBar")!==null && document.querySelectorAll(".sidebar-parent-block").length === 1 && Ticks%2 === 0){
        LiteBar();
    }



    if (localStorage.getItem("BJ.NonBarImage") !== null && document.querySelectorAll(".sidebar-parent-block").length === 1){
        if (Ticks%2 === 0) {NonImageBar(true);}
    } else {
        NonImageBar(false);
    }



    if (localStorage.getItem("BJ.TransparentPanel") === "1" && document.getElementById("TransBar") === null && document.querySelectorAll(".sidebar-parent-block .sidebar .sidebar-content").length === 1) {
        TransBar(true);
    } else if (localStorage.getItem("BJ.TransparentPanel") === null){
        TransBar(false);
    }


    if (document.querySelectorAll("nav.navbar.navbar-expand-lg.justify-content-between").length === 2) {
        LevBar();
    }


    if (Leader1Info === null & Ticks%20 === 0){
        SendPacket("https://msapi.top-academy.ru/api/v2/dashboard/progress/leader-group", "GET", null, false).then(data => {
            data = JSON.parse(data);
            Leader1Names = (data.map(item => item.full_name));
            Leader1Amounts = (data.map(item => item.amount));
            Leader1Photo = (data.map(item => item.photo_path));
            Leader1IDS = (data.map(item => item.id));
            Leader1Info=1;
        })
    }



    if (Leader2Info === null & Ticks%20 === 0){
        SendPacket("https://msapi.top-academy.ru/api/v2/dashboard/progress/leader-stream", "GET", null, false).then(data => {
            data = JSON.parse(data);
            Leader2Names = (data.map(item => item.full_name));
            Leader2Amounts = (data.map(item => item.amount));
            Leader2Photo = (data.map(item => item.photo_path));
            Leader2IDS = (data.map(item => item.id));
            Leader2Positions =(data.map(item => item.position));
            Leader2Info=1;
        })
    }


    try{

        if (localStorage.getItem("BJ.VideoPlayback")!==null && document.getElementById("VideoPlayBackBg") === null){
            var videoElement = document.createElement("video");
            videoElement.muted = true;
            videoElement.src = localStorage.getItem("BJ.VideoPlayback");
            videoElement.style.width = "100%";
            videoElement.style.height = "100%";
            videoElement.style.objectFit="cover";
            videoElement.id="VideoPlayBackBg";
            videoElement.style.position="fixed";
            videoElement.style.transition='scale 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0s, filter .5s';
            videoElement.loop = true;
            videoElement.preload="none"
            videoElement.autoplay = true;
            videoElement.disablePictureInPicture=true;
            if (localStorage.getItem("BJ.AnimatedVideoBackground") === 'true'){
                CreateMovingBg()
            }
            document.body.prepend(videoElement);

        }

    }catch(e) {console.error(e)}



    try{


        let PageType = "Main";

        if (document.querySelectorAll(".count-item.with-link").length === 2 && Ticks%2 === 0){
            CoinCssSpawn();
        }


        const text = window.location.href;


        if (text==='https://journal.top-academy.ru/index' && document.getElementById('stucked')===null || text==='https://journal.top-academy.ru/' && document.getElementById('stucked') === null || text==='https://journal.top-academy.ru/index/' && document.getElementById('stucked')===null) {
            var btn = document.createElement('button');
            var bodycontent = document.querySelector('body');
            btn.textContent = 'Застряли здесь? P.S - Нужно будет зайти в аккаунт от BetterJournal ;)';
            btn.id='stucked';
            btn.onclick = function() {
                localStorage.removeItem("aa5d5ab0fb3d70a5fea857cc7b7ebc23");
                localStorage.removeItem("c5de26e0c59acb1c9d41a3daefa00a27");
                localStorage.removeItem("d86c828583c5c6160e8acfee88ba1590");
                localStorage.removeItem("ddbeba04afa6b1d93593c13484133b87");
                window.location.reload(true);
            };
            bodycontent.appendChild(btn);
        }



        if (text.includes("dashboard")) {
            PageType="Main";
        }
        if (text.includes("schedule")) {
            PageType="SHEDULE";
        }
        if (text.includes("homework")) {
            PageType="Home";
        }
        if (text.includes("progress")) {
            PageType="Marks";
        } else {PanelSpawned=0;}
        if (text.includes("library")) {
            PageType="Materials";
        }
        if (text.includes("news")) {
            PageType="News";
        }
        if (text.includes("auth")) {
            PageType="Login";
        }
        if (text.includes("rewards")) {
            PageType="Awards";
        }
        if (text.includes("feedback")) {
            PageType="FeedBack";
        }
        if (text.includes("payment")) {
            PageType="Payment";
        }
        if (text.includes("settings")) {
            PageType="Cabinet";
        }
        if (text.includes("faq")) {
            PageType="FAQ";
        }
        if (text.includes("contacts")) {
            PageType="Adminis";
        }
        if (text.includes("signal")) {
            PageType="Asker";
        }
        if (text.includes("market")) {
            PageType="Market";
        }


        if (localStorage.getItem("BJ.Debug") === "1") {console.log("PageType = "+PageType);}



        //localStorage.getItem("BJ:UnlockUnavaiable")
        //localStorage.setItem("BJ:Debug", "1");



        if (Ticks%2 === 0){MainCssStyle();}
        if (Ticks%100 == 0){MainFloat()}
        if (loadedtimes<11){
            loadedtimes=loadedtimes+1;
        }
        else {
            timeout=70;
        }

        try{
            var startTime = performance.now()

            if (PageType!=="Login"){
                if (document.querySelector(".modal-content .eval-details.centered") !==null) {}//MakeTheVote();}
                loadedtimes=100;
                LoadDefult();
            }


            if (PageType==="Login"){
                Login();
            } else {if (document.getElementById("LoginPageCss") !== null) {document.getElementById("LoginPageCss").remove()}}


            if (PageType==="Main"){
                ReworkedMainPage();
            }

            if (PageType==="SHEDULE"){
                if ( document.querySelectorAll("router-outlet").length !== 3){
                    document.querySelectorAll("router-outlet")[3].remove()
                }
            }

            if (PageType==="Home"){
                ReworkedHomework();
            }
            if (PageType==="Marks"){
                if (document.querySelectorAll("router-outlet").length === 4){
                    document.querySelectorAll("router-outlet")[3].remove()
                }
                CreateAvgMarks()
                //Marks();
            }
            if (PageType==="Materials"){
                Materials();
            }
            if (PageType==="News"){
                NewsPage();
            }
            if (PageType==="Awards"){
                Awards();
            }
            if (PageType==="FeedBack"){
                FeedBack();
            }
            if (PageType==="Payment"){
                Payment();
            }
            if (PageType==="Cabinet"){
                Cabinet();
            }
            if (PageType==="FAQ"){
                FAQ();
            }
            if (PageType==="Adminis"){
                AdministrationPage();
            }
            if (PageType==="Asker"){
                Asker();
            }
            if (PageType==="Market"){
                Market();
            }



        } catch(e){
                console.log(e);


        }

    } catch(e){
        console.log(e);
    }

    if (XTendedDeInject === false) {setTimeout(Main, 100)}

};



function ShowMiniShedule(){
    Toast("Получаем расписание...", 1)

    var Xmas = new Date();
    var year=((Xmas.getYear())+1900)+'-';
            var month=(Xmas.getMonth())+1;
            var day=(Xmas.getDate());
            var DateAsk=null;
            var URLToday = 'https://msapi.top-academy.ru/api/v2/schedule/operations/get-by-date?date_filter='+year+month+'-'+day;

            var DayNums = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31 ,30 ,31]
            if (day+1 > DayNums[month-1]){
                if (month==12){
                    month=1
                    day=1
                } else {
                    month=month+1
                    day=1
                }
            } else {
                day=day+1
            }

            DateAsk=month+'-'+(Number(day))

            var URL = 'https://msapi.top-academy.ru/api/v2/schedule/operations/get-by-date?date_filter='+year+DateAsk

            var InnerToast='<div style="display: flex"> <div style="text-align: center; width: 50%"> <h2>Расписание на сегодня:</h2>';

            SendPacket(URLToday, 'GET', null, false).then(data => {
                if (data != -1 || data != "-1"){
                    const SheduleData = (JSON.parse(data));
                    const room_name = SheduleData.map(item => item.room_name)
                    let started_at = SheduleData.map(item => item.started_at)
                    let finished_at = SheduleData.map(item => item.finished_at)
                    const teacher_name = SheduleData.map(item => item.teacher_name)
                    const subjects = SheduleData.map(item => item.subject_name)
                    let CurTime = Xmas.getHours() +":"+Xmas.getMinutes()



                    let IRL_SheduleUpdate = false;
                    if (subjects.length != 0){
                        for (var sub in subjects){
                            started_at = SheduleData.map(item => item.started_at)
                            finished_at = SheduleData.map(item => item.finished_at)
                            const TimeStartHours = (Number(started_at[sub].split(":")[0])*60)
                            const TimeStartMinutes = (Number(started_at[sub].split(":")[1]))
                            const TimeEndHours = (Number(finished_at[sub].split(":")[0])*60)
                            const TimeEndMinutes = (Number(finished_at[sub].split(":")[1]))
                            let NowHours = (Number(CurTime.split(":")[0])*60)
                            let NowMinutes = (Number(CurTime.split(":")[1]))
                            let passed = (TimeEndHours + TimeEndMinutes) - (NowHours + NowMinutes)
                            let percent = (1 - (passed/90))

                            function CalculatePercentLesson(){
                                let Xmas = new Date();
                                let CurTime = Xmas.getHours() +":"+Xmas.getMinutes()
                                NowHours = (Number(CurTime.split(":")[0])*60)
                                NowMinutes = (Number(CurTime.split(":")[1]))
                                passed = (TimeEndHours + TimeEndMinutes) - (NowHours + NowMinutes)
                                percent = (1 - (passed/90))
                                let PercentBar=document.getElementById('PGBar')
                                console.log('CalcLoader...')
                                if (PercentBar !== null && percent <= 100.001){
                                    console.log('Calced:',percent)
                                    try{
                                    PercentBar.value=percent;
                                    let PercentVal = document.getElementById('PercentBar')
                                    let PercentNum = Number(percent*100)+''.slice(0,4)
                                    PercentVal.textContent=PercentNum.slice(0,4)+'%'
                                    setTimeout(function() {CalculatePercentLesson()}, 2000)
                                    }catch(e){console.error(e)}
                                }
                            }



                            InnerToast+=`
<div style="border: 2px solid `+Accent_MainBg.slice(0,7)+`; border-radius: 20px; margin-bottom: 3px; padding: 10px;`
                            if (teacher_name[sub]=="Миненко Алексей Павлович"){InnerToast+=`background-image: url('https://github.com/0mnr0/WallpaperInJournal/blob/main/res/LegendaryTeacher.png?raw=true'); background-size: 100%; background-position: top;`}
                            InnerToast+='">';
                            if (percent>0 && percent<1.0001){
                                if (!IRL_SheduleUpdate) {
                                    IRL_SheduleUpdate=true;
                                    console.log('CalculatePercentLesson calling...')
                                    setTimeout(CalculatePercentLesson, 3300);
                                }

                                InnerToast+=`
                                <div style="display: flex">
                                <progress value="`+percent+`" id="PGBar" max="1" style="margin-top: 5px; margin-right: 5px; vertical-align: bottom; width: 90%; accent-color: `+Accent1+`"></progress>
                                <p id="PercentBar" style="display: contents; margin-left: 5px">`+((percent*100)+'').slice(0,4)+`%</p>
                                </div>
                            `;
                            }

                            InnerToast+=`
<h3>`+subjects[sub]+`</h3>
<h5>`+teacher_name[sub]+`</h5>
<h6>`+started_at[sub]+' - '+finished_at[sub]+',  '+room_name[sub]+`</h6>`;

                            InnerToast+=`

</div>`}

                    } else {
                        InnerToast+='<p> Тут пусто :) </p>'
                    }
                }
                InnerToast+='</div><div style="text-align: center; margin-left: 15px; width: 50%"><h2>Расписание на завтра:</h2>'
                SendPacket(URL, 'GET', null, false).then(data => {
                    if (data != -1 || data != "-1"){
                        const SheduleData = (JSON.parse(data));
                        const room_name = SheduleData.map(item => item.room_name)
                        const started_at = SheduleData.map(item => item.started_at)
                        const finished_at = SheduleData.map(item => item.finished_at)
                        const teacher_name = SheduleData.map(item => item.teacher_name)
                        const subjects = SheduleData.map(item => item.subject_name)
                        if (subjects.length != 0){
                            for (var sub in subjects){

                                InnerToast+=`
<div style="border: 2px solid `+Accent_MainBg.slice(0,7)+`; border-radius: 20px; margin-bottom: 3px; padding: 10px; `
                                if (teacher_name[sub]=="Миненко Алексей Павлович"){InnerToast+=`background-image: url('https://github.com/0mnr0/WallpaperInJournal/blob/main/res/LegendaryTeacher.png?raw=true'); background-size: 100%; background-position: top;`}
                                InnerToast+='">';
                                InnerToast+=`
<h3>`+subjects[sub]+`</h3>
<h5>`+teacher_name[sub]+`</h5>
<h6>`+started_at[sub]+' - '+finished_at[sub]+',  '+room_name[sub]+`</h6>
</div>`}

                        } else {
                            InnerToast+='<p> Тут пусто :) </p>'
                        }
                        InnerToast+='</div></div>'
                        DocToast(InnerToast)

                    } else {
                        Toast("Не удалось получить расписание на завтра.", 1)
                    }
                })

            })
}

function SheduleGet(){
    document.addEventListener('keydown', function(event) {
        if (document.querySelector('.text-homework-wrap, .text-homework-answer-wrap')===null && event.key == "Shift" && (Date.now() - ShiftTime) < 250 && (Date.now() - ShiftTime) > 50 && document.getElementById("DocToastID") === null && window.location.href !== 'https://journal.top-academy.ru/ru/auth/login/index'){
            ShowMiniShedule()
            ShiftTime=0
        } else if (event.key == "Shift"){
            if ((Date.now() - ShiftTime) < 250 && document.getElementById("DocToastID") !== null){
                document.getElementById('DocToastID').style.top='-50%';
                document.getElementById('DocToastID').style.height='50%';
                setTimeout(function(){document.getElementById('DocToastID').remove(); document.getElementById('overWriteDocToastCss').remove()},1000)
            }
            ShiftTime=Date.now()
        }
    });
}

function parseEvents(){
    fetch('https://raw.githubusercontent.com/0mnr0/WallpaperInJournal/main/BetterJournalEvents/oldExtensionEvents.json', {cache: "no-cache"})
        .then(response => {return response.text();})
        .then(data => {
        data = new Function('return ' + data)();
        for (let events in data) {
            let event = data[events]
            if (event.enabledForDev === undefined) {event.enabledForDev = false}
            console.log(event.enabled, '||', event.enabledForDev,'===',AmIADeveloper)
            if (event.enabled || event.enabledForDev === AmIADeveloper){
                let ToastTitle = event.eventTitle;
                let ToastDesc = event.eventDescription;
                Toast(ToastTitle, event.showDuration, ToastDesc, event.buttons);
            }
        }
    })
        .catch(e => {console.error(e)});

}

 window.DocToast = function(InnerHTML, RemoveDeafultOkButton) {
    DocToast(InnerHTML, RemoveDeafultOkButton)
}

//DocToast
function DocToast(InnerHTML, RemoveDeafultOkButton, AdditionalCSS){
    if (AdditionalCSS === null || AdditionalCSS === undefined || AdditionalCSS === false) {AdditionalCSS=''}
    if (RemoveDeafultOkButton === undefined) {RemoveDeafultOkButton=false}
    if (document.getElementById("DocToastID") ===null) {
        var DocToast = null;
        var TCont = document.createElement('div');
        TCont.id="DocToastID";
        let finalDocToastCss=document.createElement('style')
        finalDocToastCss.id='overWriteDocToastCss'
        let DocToastCss=`
        #DocToastID{
    position: fixed;
    width: 100%;
    height: 50%;
    transition: all .6s;
    top: -50%;
    overflow: hidden;
    left: 50%;
    transform: translate(-50%,-50%);
    background: `+Accent3+`;
    z-index: 89999;
    }
        `;
        DocToastCss+='div#DocToast-container{'+AdditionalCSS+'}'
        finalDocToastCss.textContent=DocToastCss
        document.body.after(finalDocToastCss)


        TCont.style=finalDocToastCss;

        window.CloseDocToastExtra = function(){document.getElementById('DocToastID').remove(); canSiteRKM=true; document.getElementById('overWriteDocToastCss').remove()}
        window.CloseDocToast = function(){
            document.getElementById('DocToastID').style.top='-50%';
            document.getElementById('DocToastID').style.height='50%';

            setTimeout(function(){document.getElementById('DocToastID').remove(); document.getElementById('overWriteDocToastCss').remove()}, 600)
            canSiteRKM=true;
        }
        var TContInner = '<div id="DocToast-container">';
        TContInner+=InnerHTML
        if (RemoveDeafultOkButton !== true) TContInner+='<button class="DocToastClickOK" onClick="window.CloseDocToast()">OK</button></div>'

        TCont.innerHTML = TContInner
        document.querySelector("body").appendChild(TCont);
        var CodeTag = document.createElement('script');
        var CodeContent = document.createTextNode(`
function PushToVLink(Url){
document.getElementById("HTMLIdVideoLink").value=Url;
document.getElementById("DocToastID").remove()
}
`);
        CodeTag.appendChild(CodeContent);
        TCont.appendChild(CodeTag)
        DocToast = document.querySelector("div#DocToast")
        setTimeout(function() {
            document.getElementById("DocToastID").style.height = "100%";
            document.getElementById("DocToastID").style.top = "50%";
        }, 10)
    } else {
        Toast("Не удалось открыть DocToast, уже открыт другой экземпляр", 1)
    }
}

window.CloseToastById = function(id) {
    document.getElementById("ToastID"+id).style="opacity: 0; transition: 1s;"
    setTimeout(function () { document.getElementById("ToastID"+id).remove()}, 600);
}


function Toast(TextMessage, ShowSeconds, TextDescription, Buttons) {
    window.Toast(TextMessage, ShowSeconds, TextDescription, Buttons)
}

//Toast() //Toastn() // Toast()n
window.Toast = function(TextMessage, ShowSeconds, TextDescription, Buttons){
    if (ShowSeconds === undefined){ShowSeconds=1} else {ShowSeconds=Number(ShowSeconds)}
    if (TextDescription === undefined || TextDescription===null) {TextDescription='';}
    try{
        TextMessage=TextMessage.replaceAll("\n","<br/>")
        const Time=ShowSeconds*1000;
        const ToastID = randomIntFromInterval(1,900000);
        if (document.getElementById("ToastID"+ToastID) !==null) {Toast()}
        else{
            var ToastContainer = document.querySelector("div#toast-container");

            if (ToastContainer === null){//
                var TCont = document.createElement('div');
                TCont.classname='overlay-container';
                TCont.innerHTML = '<div id="toast-container" class="toast-top-right toast-container"></div>'
                document.querySelector("body").appendChild(TCont);
                ToastContainer = document.querySelector("div#toast-container")
            }



            var newDiv = document.createElement('div');
            newDiv.className = "toast-success toast ng-trigger ng-trigger-flyInOut";
            newDiv.id="ToastID"+ToastID;
            newDiv.style="opacity: 0; transition: all .5s";
            let finalInner = '<div class="message">'+TextMessage+'<br>'
            if (TextDescription !== undefined && TextDescription !== null && TextDescription !== '') {finalInner+= '<span style="font-size: 15px">'+TextDescription+'</span>'}
            if (Buttons !== null && Buttons!== undefined) {
                let ButtonInner = '';
                finalInner+="<div style='display: flex'>"
                for (let AllbtnData in Buttons){
                    let btnData = Buttons[AllbtnData]
                    if (btnData.action === null) {btnData.action = 'window.CloseToastById(`'+ToastID+'`)'}
                    try{
                        ButtonInner='<button onClick="'+btnData.action+'">'+btnData.text+'</button>'
                        finalInner+=ButtonInner
                    } catch(e) {console.error(e)}
                }
                finalInner+="</div>"
            }

            finalInner+='</div>'; newDiv.innerHTML = finalInner;
            ToastContainer.appendChild(newDiv);

            setTimeout(function () { newDiv.style="opacity: 1; transition: .2s;"}, 200);
            setTimeout(function () { window.CloseToastById(ToastID) }, Time+1000);


        }
    }catch(e){console.error(e)}
}


document.addEventListener('keyup', function(event) {
    if (event.keyCode === 192) {
        try{
            window.TildaKeyPress()
        } catch(e){}
    }
});

document.oncontextmenu = function (){
    setTimeout( function() { if (localStorage.getItem('BJ.RightClickToOpenCircular') !== null && canSiteRKM) {window.TildaKeyPress()} }, 10)
    return (localStorage.getItem('BJ.RightClickToOpenCircular') === null)
}

function moveElement(x, y) {
    if (localStorage.getItem("BJ.AnimatedVideoBackground") === 'true'){
        const element = document.getElementById('VideoPlayBackBg');
        const rect = element.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        let newX = (x - centerX) / 100;
        let newY = (y - centerY) / 100;

        const maxOffset = 50;
        newX = Math.max(Math.min(newX, maxOffset), -maxOffset);
        newY = Math.max(Math.min(newY, maxOffset), -maxOffset);

        element.style.transform = `translate(${newX}px, ${newY}px)`;
    } else {document.removeEventListener('mousemove', mouseMoveHandler);}
}




const mouseMoveHandler = (event) => {
    moveElement(event.clientX, event.clientY);
};

function CreateMovingBg(){
    document.addEventListener('mousemove', mouseMoveHandler);
}

function GetUserAge(){
    if (userInfo === null){
        if (localStorage.getItem('BJ.Stat.LastUAd') !== null){
            return Number(localStorage.getItem('BJ.Stat.LastUAd'))
        } else {
            return 0
        }
    } else {
        return new Date().getFullYear() - new Date(userInfo.birthday).getFullYear() - (new Date() < new Date(new Date().getFullYear() + '-' + userInfo.birthday.slice(5)) ? 1 : 0);
    }
}


function parseWallpapers(){

    window.setWallpaper = function (isForBigBoys, src, preview) {

        if (isForBigBoys) {Toast("Контент этих обоев может иметь неприемлимый контент не подходящий для лиц младше 18 лет", 1)}
        document.getElementById('VideoPlayBackBg').src = src
        if (document.getElementById('VideoPlayBackBg').poster !== preview){
            document.getElementById('VideoPlayBackBg').poster = preview
        }
        document.getElementById('HTMLIdVideoLink').value = src
        localStorage.setItem('BJ.VideoPlayback', src)
    }

    function GenerateListByTag(SearchTag, TagName){
        let currentwallnum = 0;
        let returningInner = '';
        for (let wallitem in SearchTag){
            var item = SearchTag[wallitem]
            if (item.dev === false || item.dev === undefined){
                currentwallnum++;
                let ClassName = "WallPaperItemButton";
                let installButtonClass = "installbutton ";
                if (item.wallpaperEngineLink !== null && item.wallpaperEngineLink !== undefined) {installButtonClass+='WEngineExists'}
                if (currentwallnum === 1) {ClassName+=" WallStartDiv"}
                if (currentwallnum === SearchTag.length) {ClassName+=" WallEndDiv"}
                if (item.forBigBoysOnly === true) {ClassName+=" forBigBoysOnly"}
                if ((item.forBigBoysOnly === false && TagName==='all') || TagName!=='all'){
                    if ((item.forBigBoysOnly === true && GetUserAge() >= 16) || item.forBigBoysOnly === false){
                        if (item.visible){
                            returningInner+=`
                <div class="WallItemLine">
                    <img class="`+ClassName+`" loading="eager" src="`+item.wallpaperPreview+`"> </img>
                    <div class="WallInfoDiv">
                         <span class="title">`+item.wallpaperName+`</span>
                         <div class="tag"><div class="tagContent"><span class="tagItem">#</span>`+item.tag+`</div></div>


                         <div class="installdiv">
                             <button class="`+installButtonClass+`" onClick="window.setWallpaper(`+item.forBigBoysOnly+`, '`+item.wallpaperVideoLink+`', '`+item.wallpaperPreview+`')"> Установить </button>
                             <button class="WEngineButton`+installButtonClass+`" onClick="window.open('`+item.wallpaperEngineLink+`', '_blank')"></button>
                         </div>
                    </div>
                </div>
            `;
                        } else {return ''}
                    }
                }
            }
        }
        return returningInner
    }


    fetch('https://raw.githubusercontent.com/0mnr0/WallpaperInJournal/main/BetterJournalEvents/oldExtensionWallpapers.json', {cache: "no-store"})
        .then(response => {return response.text();})
        .then(data => {

        data = new Function('return ' + data)();

        let ListOfTags = ['Все']
        let ListOfWallpapers= {all: []};
        for (const wallpaperList in data){
            let wallpaper = data[wallpaperList]
            let WallPapaerTag = (wallpaper.tag).replaceAll(" ","")
            eval('if (ListOfWallpapers.'+WallPapaerTag+' === undefined) {ListOfWallpapers.'+WallPapaerTag+' = []; ListOfWallpapers.'+WallPapaerTag+'.push(wallpaper)} else {ListOfWallpapers.'+WallPapaerTag+'.push(wallpaper)}')
            if (!ListOfTags.includes(WallPapaerTag)) {ListOfTags.push(WallPapaerTag);} // Creating List of tags
            ListOfWallpapers.all.push(wallpaper)
        }

        window.RefreshWithNewFilter = function(){
            var newTag = document.getElementById("WallPaperChoose").value;
            let SearchItem = eval('ListOfWallpapers.'+newTag);
            document.querySelector('.ListOfWallpapers').innerHTML='';
            document.querySelector('.ListOfWallpapers').innerHTML=GenerateListByTag(SearchItem, newTag)
        }

        WallPaperInner=`
    <style>
    div#DocToast-container * {color: white !important; background-size: contain}
    .WallpaperChoose {width: 100%;}
    input#SearchID {outline: none; border: solid 2px `+Accent0+`; background: `+Accent3+`; border-radius: 30px}
    p{margin: 0}
    #MargR {padding-right: 12px; align-content: center}
    .ListOfWallpapers {margin-top: 10px; display: inline-grid; width: 100%}
    select#WallPaperChoose {outline: none; background: black; border: solid 2px `+Accent2+`; color: white; border-radius: 10px; padding: 5px; width: 100%}
    .WallPaperItemButton {max-width: 620px; width: 60%; max-height: 100px; height: -webkit-fill-available; object-fit: cover; min-width: 230px; filter: brightness(0.7);}
    .WallStartDiv {border-start-start-radius: 20px; border-start-end-radius: 20px}
    .forBigBoysOnly {border: solid 3px red}
    .WallItemLine:hover {scale: 1.015; filter: brightness(1)}
    .WallItemLine {transition: all .4s; filter: brightness(0.9); display: flex; height: 85px}
    .WallEndDiv {border-end-start-radius: 20px; border-end-end-radius: 20px}
    .WallInfoDiv {width: 40%}
    .WallInfoDiv span.title {margin: 2px; text-align: center; width: 100%}
    .tag { z-index: 2; font-size: xx-small; text-align: center; padding: 5px; margin: 3px; position: absolute; align-content: center; left: 0px; top: 0px}
    .tagContent {width: fit-content; display: inline-block; background: #2a2a2ad6; border-radius: 10px; padding-left: 4px; padding-right: 4px}
    span.tagItem {font-size: small;}
    #VideoWallpaperBackground {position: absolute;top: 0px; z-index: 80000;width: 100%;background: transparent; height: 100%; object-fit: cover}
    .installdiv {display: flex; bottom: 0px; position: absolute; width: 40%}
    .WallInfoDiv button {cursor: pointer; outline: none}
    button.installbutton:hover {border: solid 2px gray}
    button.installbutton {bottom: 0px; transition: all .2s; position: relative; border-radius: 10px !important; width: -webkit-fill-available; margin-left: 13px}
    button.WEngineButtoninstallbutton {display: none}
    button.WEngineButtoninstallbutton.WEngineExists {width: 20%; display: block; margin-left: 2px; border-radius: 10px !important; border: solid 2px #0075ff; background-image: url('https://github.com/0mnr0/WallpaperInJournal/blob/main/res/wallpaper_engine.png?raw=true'); background-repeat: no-repeat; background-position: center;}
    button.installbutton.WEngineExists { margin-left: 13px; width: 80%}
    </style>


<h4> Каталог обоев </h4>
<h6> Вы можете найти желаемый видео-фон по тэгам: </h6>
    <div class="WallpaperChoose">
     <div style="display: flex">
     <p id="MargR"> Поиск: </p>
        <select name="WallPaperChoose" id="WallPaperChoose" onchange="RefreshWithNewFilter()">`
           for (let tag in ListOfWallpapers){
               let VisibleTag = tag
               VisibleTag=VisibleTag.replace("all","Всё").replace("Fantastic","Фантастика").replace("Mems","Мемы").replace("Cars","Автомобили").replace("Anime","Аниме").replace("Films","Фильмы").replace("Nature","Природа").replace("PixelArt","Пиксель Арт").replace("Games","Игры")
               WallPaperInner+='<option value="'+tag+'">'+VisibleTag+'</option>'
           }
        WallPaperInner+=`</select>
      </div>
      <div class="ListOfWallpapers">`
        let SearchItem = eval('ListOfWallpapers.all')

        WallPaperInner+=GenerateListByTag(SearchItem, 'all')
        WallPaperInner+=`
      </div>
    </div>`;

    })
        .catch(e => {console.error(e); WallPaperInner = '<p>Не удалось получить список обоев </p> <br><p>Данные ошибки: <br><font color="red"> '+e+'</font></p> <button onClick="BJ_parseWallpapers()">Попробовать снова</button>'})
}
window.BJ_parseWallpapers = function(){WallPaperInner=''; window.CloseDocToastExtra(); parseWallpapers()}

function parseUserinfo(){
    setTimeout(function() {
        SendPacket('https://msapi.top-academy.ru/api/v2/settings/user-info', 'GET', null, false)
            .then(data => {
            userInfo = new Function('return ' + data)();
            localStorage.setItem('BJ.Stat.LastUAd', new Date().getFullYear() - new Date(userInfo.birthday).getFullYear() - (new Date() < new Date(new Date().getFullYear() + '-' + userInfo.birthday.slice(5)) ? 1 : 0))
        })
    }, 1000)
}

function RegisterPacet(){
    window.SendPacet = function(URL, Type, JSONVals, RefreshBearer){
        return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            xhr.open(Type, URL);
            xhr.setRequestHeader('authority', 'msapi.top-academy.ru');
            xhr.setRequestHeader('method', Type);
            xhr.setRequestHeader('path', '/api/v2/auth/login');
            xhr.setRequestHeader('scheme', 'https');
            xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
            xhr.setRequestHeader('Accept-Language', 'ru_RU, ru');
            xhr.setRequestHeader('Authorization', 'Bearer '+LoadedBearer);

            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(jsonify(xhr.responseText));
                    } else {
                        reject({status: xhr.status, error: xhr.statusText});
                    }
                }
            };
            xhr.onerror = () => reject(xhr.statusText);

            if (JSONVals!==null && JSONVals!== undefined) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                let requestBody = JSONVals
                if (typeof(JSONVals) === 'string') {requestBody = JSON.parse(JSONVals);}
                xhr.send(JSON.stringify(requestBody));
            } else {
                xhr.send();
            }
            if (RefreshBearer) {GetBearer()}

        });

    }
    window.jsonify = function(object){
        return new Function('return ' + object)();
    }
}



function jsonify(object){ return new Function('return ' + object)(); }


function NewHomework(){
    function CreateStyle(){
        if (document.getElementById('HomeworkStylishment') === null){
            let StyleElement = document.createElement('style')
            StyleElement.id='HomeworkStylishment'
            StyleElement.textContent = `
        .HomeworkCard {cursor: deafult; background: #00000099; padding: 10px; z-index: 3; border-radius: 12px; margin: 10px}
        .HomeworkCard h4 {cursor: context-menu}

        `;
            document.querySelector('.item-homework').appendChild(StyleElement)

        }
    }

    function CreateHomework(title, id){
        CreateStyle()
        let MainCard = document.createElement('div')
        MainCard.className='HomeworkCard'
        MainCard.id="HomeworkCard"+id
        MainCard.innerHTML=`
    <h4>`+title+`<h4>
    `
        document.querySelector('.item-homework').appendChild(MainCard)
    }


    document.querySelector('.item-homework').innerHTML=''
    let current_value_maximum = NaN;
    SendPacet('https://msapi.top-academy.ru/api/v2/count/page-counters?counter_type=100','GET',null, false,).then(currelt_count=>{
        console.log(currelt_count);
        current_value_maximum = currelt_count[0].counter
        SendPacet('https://msapi.top-academy.ru/api/v2/homework/operations/list?page=1&status=3&type=0&group_id=9', 'GET', null, false).then(current_list=>{
            console.log(current_list)
            for (let ci in current_list){
                let item = current_list[ci]
                CreateHomework(item.name_spec, item.id)
            }
        })
    })
}

window.journalXTendedInit = function(){
    if (typeof window.journalXTended === 'function' && XTendedDeInject === false){
        Toast('Кажется вы в списке доверенных тестировщиков если Better Journal нашел функции XTended версии!', 3)
        XTendedDeInject = true;
        setTimeout(function(){
            try{document.getElementById('OpenSettings_BJ').remove()} catch(e) {}
            try{document.getElementById('ShowImageCode').remove()} catch(e) {}
            try{document.getElementById('HintFix').remove()} catch(e) {}
            try{document.getElementById('HomeworkPageCss').remove()} catch(e) {}
            try{document.getElementById('DeafultStyleCss').remove()} catch(e) {}
            try{document.getElementById('PhotoViewBG').parentElement.remove()} catch(e) {}
        }, 140)
    }
}

function XTCheck(){
    window.journalXTendedInit()
}


(function() {

    if (localStorage.getItem("BJ.DefStyle") === null || localStorage.getItem("BJ.DefStyle") === '0') {localStorage.setItem("BJ.DefStyle",5)}
    setTimeout(Main, 100);
    setTimeout(XTCheck, 200);
    document.querySelector("html").style.background="black";
    LoadDefult()
    GetBearer();
    Main();
    SheduleGet() // SetupListener for Fast Schedule


    parseUserinfo()
    parseEvents()
    parseWallpapers()
    let btns = {
      0:{
        action: "DocToast('<span> Перейдите по ссылке <b>chrome://extensions/</b> и установите флажок <b>Режим разработчика</b>. Мы надеемся это требование скоро пропадёт ')",
        text: "Включить режим разработчика"
      },
      1:{
        action: " Toast('Хорошо, больше это сообщение не появится', 1); localStorage.setItem('BJ.DontShowDevTools', 1)",
        text: "Больше не показывать"
      }
    }
    Toast("Hmmm", 1, `<a href="https://www.journalui.ru" target="_blank"> 🤔 </a>`, null)
    if (localStorage.getItem('BJ.DontShowDevTools') === null){Toast("Пожалуйста, включите режим разработчика", 4, "Tampermonkey теперь требует включение режима разработчика для загрузки скрипта", btns)}
    if (localStorage.getItem("BJ.CustomThemeTransparency") === null) {localStorage.setItem("BJ.CustomThemeTransparency", "80")}

    if (localStorage.getItem('BJ.HideMeAway') !== null){
        setTimeout(function(){
            if (localStorage.getItem('BJ.HideMeAway') !== null){
                for (var i = 0; i <= 100000 ; i++) {
                    window.clearInterval(i);
                    window.clearTimeout(i);
                    if(window.mozCancelAnimationFrame)window.mozCancelAnimationFrame(i); // Firefox
                }
                Main()
            }
        }, 10000)
    }
    if (localStorage.getItem('BJ.NotifiesAutoRead') !== null) {setTimeout(ReadAllNews, 4000)}

    if (localStorage.getItem("BJ.Update2.6.3") === null){
        try{
            DocToast( `
<style>
.GuestureTutorial {height: auto; overflow: hidden; color: white; transition: all 1s; border-start-start-radius: 15px; border-start-end-radius: 15px; background: `+Accent3+`;width: 100%;padding: 5px}
.UpdateAdded{background: `+Accent3+`;width: 100%; padding: 5px; margin-top: 3px}
.UpdateChanged{background: `+Accent3+`;width: 100%; padding: 5px; margin-top: 3px;}
.UpdateRemoved{background: `+Accent3+`;width: 100%; padding: 5px; margin-top: 3px;}
.LastDiv {border-end-start-radius: 15px; border-end-end-radius: 15px;}
.NothingRemoved {display: none}
</style>

<h4 style="text-align: center: width: 100%"><b>Обновление 2.6.3!</b></h4>
<div class="GuestureTutorial" id="GuestureHint" style=""><p><b> </b></p>
<h5> Это техническое обновление. Подготовка к уходу с Tampermonkey</h5>
<div style="display: none">
<span> Так как установка Better Journal становится всё сложнее, было принято решение оставить Better Journal и перейти к отдельномау расширеню.
</span>
<span> Но момент 23 октября могу сказать что расширение появится в Chrome Webstore в любом случае. Вопрос - когда. Я бы не хотел торопить события и сделать всё максимально круто к запуску. На текущий момент количество анимаций в новом расширении кратно превосходит количество анимаций в BetterJournal</span>
<span> Появится огромная кастомизация, скорость запуска уменьшиться в разы, настройки будут выглядеть абсолютно по-другому, да и вприницпе там ещё много чего интересного. Вам осталось только ждать. Как только дата выхода расширения будет примерно ясна - сразу дам знать.
</span>
<br><br>
</div>
</div>



<div class="UpdateChanged "><b style="color: white  !important;">Изменено:</b><br>
<span>
+ Добавлена возможность пропустить загрузку новой статистики ДЗ на главном экране <br>
~ Исправлена настройка кастомной аватарки <br>
</span>
</div>

`)
            localStorage.setItem("BJ.Update2.6.3", 1)
        } catch(e){}
    }

})();