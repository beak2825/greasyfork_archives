// ==UserScript==
// @name  Change the scope to survev.io, surviv.io, suroi.io, suroi.fpsgo.net and zombsroyale.io
// @name:ru  Изменить прицел в survev.io, surviv.io, suroi.io, suroi.fpsgo.net и zombsroyale.io
// @namespace    https://github.com/AlekPet/
// @version      0.0.8.3.8
// @description  Сhange the scope in the game survev.io, surviv.io, suroi.io, suroi.fpsgo.net and zombsroyale.io
// @description:ru  Изменяет прицел в игре survev.io, surviv.io, suroi.io, suroi.fpsgo.net и zombsroyale.io
// @copyright    2018, AlekPet (https://github.com/AlekPet)
// @author       AlekPet
// @license      MIT; https://opensource.org/licenses/MIT
// @match        *://surviv.io/*
// @match        *://survev.io/*
// @match        *://surviv2.io/*
// @match        *://suroi.io/*
// @match        *://suroi.fpsgo.net/*
// @match        *://2dbattleroyale.com/*
// @match        *://zombsroyale.io/*
// @icon         data:image/jpeg;base64,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
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @require https://code.jquery.com/jquery-3.1.0.min.js
// @resource scopes https://raw.githubusercontent.com/AlekPet/Change-the-scope-to-games/master/assets/json/scopes.json
// @downloadURL https://update.greasyfork.org/scripts/370218/Change%20the%20scope%20to%20survevio%2C%20survivio%2C%20suroiio%2C%20suroifpsgonet%20and%20zombsroyaleio.user.js
// @updateURL https://update.greasyfork.org/scripts/370218/Change%20the%20scope%20to%20survevio%2C%20survivio%2C%20suroiio%2C%20suroifpsgonet%20and%20zombsroyaleio.meta.js
// ==/UserScript==

GM_addStyle(`
.mPanel_cur {
position: fixed;
top: 5%;
left: 50%;
background: #dadada;
max-width: 650px;
width: 650px;
z-index: 50;
border: 1px solid silver;
box-shadow: 2px 2px 5px #847b7b;
margin-left: -325px;
text-align: center;
display: none;
}
.mPanel_cur_title {
background: silver;
font: bold 1em monospace;
padding: 5px;
color: white;
text-shadow: 1px 1px 3px darkblue;
border-bottom: 1px dotted white;
user-select: none;
}
.mPanel_cur_title > div{
float:right;
}
.mPanel_cur_title > div:hover {
color: #d1fffb;
}
.table_box{
display: table
}
.table_box > div{
display: table-cell
}
.rightPanel_options{
text-shadow: 1px 1px 3px darkgreen;
background: linear-gradient(to right, #62a965,#0e2f0e);
color: #ffffff;
border-left: 1px dotted white;
padding: 5px;
}
.rightPanel_options_title {
background: linear-gradient(#69e815,#3f7703);
color: white;
padding: 2px 0;
user-select: none;
}
.rightPanel_options_inside {
border: 1px solid;
width: 150px;
overflow-y: auto;
}
.mPanel_cur_list_box {
background: #ffffff;
width: 80%;
}
.optionFiels {
border-top: 1px dotted;
}
ul.list_cur {
padding: 0;
margin: 0;
height: 550px;
width: 480px;
overflow-y: auto;
display: flex;
flex-direction: row;
flex-wrap: wrap;
}
.list_cur > li {
/*min-width: 88px;
min-height: 88px;
max-height: 120px;
width: 88px;
height: 88px;
overflow: hidden;*/
}
.list_cur > .element_cur_cont {
list-style: none;
display: inline-block;
padding: 5px;
text-align: center;
border: 1px dotted silver;
margin: 5px;
cursor: pointer;
vertical-align: top;
background: linear-gradient(to right bottom, silver,white);
flex: 1 0 88px;
}
.element_cur_cont:hover {
background: linear-gradient(#00ffff75,#dbff005c);
}
.acive_cursor{
background: linear-gradient(#00ffff75,#dbff005c) !important;
}
.element_cur_title {
color: black;
text-shadow: 1px 1px 3px darkgrey;
word-wrap: break-word;
font-size: 0.8em;
}
.mPanel_cur_foot {
background: #757574;
padding: 3px;
border-top: 1px dotted white;
color: antiquewhite;
text-shadow: 1px 1px 3px darkgreen;
}
.infoBlock {
float: right;
}
.infoBlock>a{
font-size: 0.6em;
margin-top: 4px;
padding: 2px;
text-decoration:none;
}
.cur_sel_button_box {
display: inline-block;
}
.cur_button {
border: 1px solid silver;
padding: 3px;
font-size: 0.7em;
cursor: pointer;
user-select: none;
display: inline-block;
margin-left:10px;
}
.add_cur{
background: linear-gradient(#b3b766,#07b994);
color:white
}
.add_cur:hover{
background: linear-gradient(#e7f134,#00ffca);
color: #424242;
}
.create_cur {
background: linear-gradient(#b3b766,#07b994);
color: white;
}
.create_cur {
background: linear-gradient(#ff8a00,#ff6161);
color: white;
}
.del_cur{
display:none;
background:linear-gradient(#b76666,#b90776);
}
.del_cur:hover{
background: linear-gradient(#c12b2b,#d89cc1) !important;
color: white;
}
.checkbox_del_cur {
}
.checkbox_edit_cur {
font-size: 0.6em;
vertical-align: text-top;
background: limegreen;
border: 0;
color: white;
border-radius: 4px;
text-shadow: 1px 1px 3px black;
cursor:pointer;
}
.checkbox_edit_cur:hover {
background: #ff9b00;
}
.zomb_btn-red {
background: rgb(175, 80, 80);
border-bottom: 2px solid rgb(122, 56, 56);
box-shadow: rgb(122, 56, 56) 0px -2px inset;
color: #fff;
cursor: pointer;
font-size: 12px;
position: fixed;
text-shadow: 0 1px 2px rgba(0,0,0,.25);
top: 50%;
right: 0;
display: block;
opacity: 0.7;
transform: translate(0, -20px) rotateZ(-90deg);
transform-origin: bottom right;
height: 25px;
width: 105px;
line-height: 20px;
border: 0;
border-radius: 5px;
box-sizing: border-box;
margin-bottom: 8px;
text-align: center;
text-decoration: none;
z-index:999;
}
.zomb_btn-darken:active, .zomb_btn-darken:hover {
color: inherit;
-webkit-filter: brightness(80%);
filter: brightness(80%);
transition: all .25s ease;
}
.makeCursor_form {
position: fixed;
top: 20%;
left: 50%;
width: 350px;
margin-left: -180px;
border: 1px solid silver;
background: #dadada;
display: none;
box-shadow: 3px 3px 5px silver;
z-index: 5;
}
.makeCursor_form_title {
background: darkgrey;
color: white;
text-shadow: 1px 1px 3px darkolivegreen;
padding: 3px;
border-bottom: 1px dotted;
font: bold 1em monospace;
}
.makeCursor_form_title > div {
float: right;
cursor: pointer;
}
.makeCursor_form_title > div:hover {
color: #d1fffb;
}
.maleCursor_form_body input {
width: 80%;
margin: 5px;
padding: 2px;
border: 1px dotted #04fbc6;
}
.maleCursor_form_body > .form_field{

}
.maleCursor_form_body span {
color: #635e5e;
font: normal 1em monospace;
}
.maleCursor_form_foot {
padding: 5px;
background: whitesmoke;
}
.cur_preview {
border: 1px dotted #0d6b57;
width: 50%;
margin: 10px auto;
padding: 5px;
background: floralwhite;
}
.cur_preview > p {
background: #b7b2b2;
padding: 0px;
margin: 0;
color: white;
}
.cur_preview > img {
margin: 10px;
}
.drawSelf {
font-size: 0.9em;
padding: 3px;
background: #b5c5c3;
}
.drawSelf > a{
font-size: 0.9em;
}
.cur_overlay {
background: #000000cc;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 5;
display:none;
}
img#image_aim {
position: absolute;
z-index: 6;
}
.colorchange_cur {
width: 20px;
height: 20px;
background: radial-gradient(red,orange,yellow,green,cyan,blue,purple);
border-radius: 10px;
display: inline-block;
margin-right: 2px;
transition: 1s all;
}
.colorchange_cur:hover {
background: radial-gradient(purple,blue,cyan,green,yellow,orange,red);
}
.colorChangeButtons{
width: 70px;
margin: 2px;
}
#setChangeColor {
background: linear-gradient(#669ab7,#0773b9);
margin-top: 10px;
}
#setChangeColor:hover {
background: linear-gradient(#00a4ff,#043656);
}
#setDefaultChangeColor {
background: linear-gradient(#b76666,#b90707);
}
#setDefaultChangeColor:hover {
background: linear-gradient(#ff0000,#5f0303);
}
.canvasColor{
width: 128px;
height: 128px;
border: 1px dotted;
margin: 0 auto;
display: table;
}
.canvasColor>div{
display: table-cell;
vertical-align: middle;
}
.font_8{
font-size: 0.8em;
}
.font_7{
font-size: 0.7em;
}
.font_6{
font-size: 0.6em;
}
.rightPanel_options input[type=range]::-webkit-slider-thumb {
    background: #f3f3f3;
}
.rightPanel_options input[type=range] {
    background: #ff7500;
    border: 1px solid black;
    border-radius: 6px;
}
.makeCursor_form input {
    color: black;
}
`);

(function() {
    'use strict';
    const cursorList = JSON.parse(GM_getResourceText('scopes')).scopes || [{name:"Scope 1",cururl:"http://www.rw-designer.com/cursor-view/101646.png",active:false},
                                                                           {name:"Scope 2",cururl:"http://www.rw-designer.com/cursor-view/111928.png",active:false},
                                                                           {name:"Scope 3",cururl:"http://www.rw-designer.com/cursor-view/111937.png",active:false},
                                                                           {name:"Scope 4",cururl:"http://www.rw-designer.com/cursor-view/78056.png",active:false},
                                                                           {name:"Scope 5",cururl:"http://www.rw-designer.com/cursor-view/97540.gif",active:false},
                                                                           {name:"Scope 6",cururl:"https://image.flaticon.com/icons/png/128/487/487009.png",active:false}],
          lang = {
              ru:{
                  form_title: "Выбор прицела",
                  addCrosshair: "Добавить прицел",
                  editCrosshair: "Правка",
                  editComplete: "Прицел был отредактирован!",
                  editEditApply: "Применить изменения",
                  delCrosshair: "Удалить прицел(ы)?",
                  delComplete: "Прицел(ы) были удалены!",
                  selectCrosshair: "Выбрать: ",
                  scopeName: "Название прицела (необяз.)",
                  scopeLink: "Ссылка прицела (png,gif,jpg,cur,base64)",
                  errorName: "Внимание:\nПоле имени не задано, будет использовано случайное название!\nНазвание: ",
                  errorLinkEmpty: "Поле ссылки пустое!",
                  errorLink: "Поле ссылки указано неверно!",
                  errorImage: "Размер изображения больше 128x128 px, или равно 0x0 px, или не определенно!",
                  errorAdd: "Сообщение:\nПрицел не был добавлен из-за неверно заданных параметров!",
                  addComplete: "Сообщение:\nПрицел был успешно добавлен!",
                  name: "Название: ",
                  link: "Ссылка: ",
                  preview: "Предпросмотр",
                  drawSelf: "Нарисовать свой ",
                  drawSelfInstructions: "File > New\nSet size <= 128px\nРисуем прицел\nSave as data URL\nКопиуем код и вставляем в поле Ссылки",
                  scopeSite: "Еще прицелы",
                  createScope: "Создать прицел",
                  alertMesImage: ["Внимание:\nРазмер изображения ","Максимально допустимый размер изображения 128x128px!\nИначе работать не будет!\nПроверить прицел можно, если навести на рисунок..."],
                  selectScope: "Выбрать прицел",
                  form_close: "Закрыть",
                  resetDefault: "Загрузить стандартные",
                  resetDefaultCompete: "Стандартные прицелы были загружены!",
                  resetQuestion: "Вы действительно хотите загрузить стандартные прицелы?\nВсе ваши добавленные прицелы, буду удалены?",
                  resetQuestionFisrt: "Загрузить стандартный набор прицелов?",
                  laserColor: "Цвет луча:\nПо умолчанию: red",
                  laserWidth: "Толщина луча:\nПо умолчанию: 2",
                  laserParmDotted: "Параметры пунктира:\nПо умолчанию: 5,15",
                  laserDottedOn: "Включить пунктир?",
                  rightOptionsTitle: "Опции",
                  selectAll: "Выбрать все",
                  deselectAll: "Убрать выделение",
                  buttonInGame: "Кнопка в игре",
                  buttonInGameInfo: "Показывать кнопку \"Выбрать прицел\" в игре",
                  laserSaveSetting:"Сохранить настройки лазера?",
                  laser: "Лазер",
                  paletteColor: "Палитра цветов:",
                  changeColor: "Изменить цвет/размер",
                  applyColor: "Применить",
                  applyColorHint: "Применить выбранный цвет и размер",
                  resetColor: "Сбросить",
                  resetColorHint: "Установить значение по умолчанию",
                  resetColorAnswer:"Сбросить настройки цвета и размера?",
                  not_selected: "Не выбран",
                  input_colors: ["Красный","Зеленый","Синий"],
                  error_ChangeColor: "Выберите прицел, для редактирования цвета и размера!\nНажмите на радужный кружок, возле прицелов!",
                  scopeSize: "Размер",
                  donate: ["Поддержка","Поддержать автора"]
              },
              en:{
                  form_title: "Select scope",
                  addCrosshair: "Add scope",
                  editCrosshair: "Edit",
                  editComplete: "The scope was edited!",
                  editEditApply: "Apply changes",
                  delCrosshair: "Remove scope(s)?",
                  delComplete: "The scope(s) have been removed!",
                  selectCrosshair: "Select: ",
                  scopeName: "Name for the sight (opt.)",
                  scopeLink: "Sight link (png,gif,jpg,cur,base64)",
                  errorName: "Warning:\nthe name field is not set, a random name will be used!\nName: ",
                  errorLinkEmpty: "The link Field is empty!",
                  errorLink: "The link Field is incorrect!",
                  errorImage: "The image Size is greater than 128x128 px, or equal to 0x0 px, or indefinite!",
                  errorAdd: "Message:\nThe sight was not added due to incorrect parameters!",
                  addComplete: "Message:\nSight was successfully added!",
                  name: "Name: ",
                  link: "Link: ",
                  preview: "Preview",
                  drawSelf: "Draw your own ",
                  drawSelfInstructions: "File > New\nSet size <= 128px\nPaint on canvas\nSave as data URL\nCopy code and past in the Link",
                  scopeSite: "More sights",
                  createScope: "Create sight",
                  alertMesImage: ["Attention:\nImage Size", "The maximum image size is 128x128px!\nOtherwise it will not work!\nIt is possible to check the sight if you look at the picture ..."],
                  selectScope: "Select scope",
                  form_close: "Close",
                  resetDefault: "Load default",
                  resetDefaultCompete: "Standard scopes have been loaded!",
                  resetQuestion: "Do you really want to load standard scopes?\nAll your added scopes will be deleted?",
                  resetQuestionFisrt: "Download the standard set of sights?",
                  laserColor: "Beam color:\nDefault: red",
                  laserWidth: "Beam width:\nDefault: 2",
                  laserParmDotted: "Dashed Parameters:\nDefault: 5,15",
                  laserDottedOn: "Enable dotted line?",
                  rightOptionsTitle: "Options",
                  selectAll: "Select All",
                  deselectAll: "Deselect All",
                  buttonInGame: "Button in the game",
                  buttonInGameInfo: "Show the \"Select Sight\" button in the game",
                  laserSaveSetting: "Save laser settings?",
                  laser: "Laser",
                  paletteColor: "Color palette:",
                  changeColor: "Change color/size",
                  applyColor: "Apply",
                  applyColorHint: "Apply selected color and size",
                  resetColor: "Reset",
                  resetColorHint: "Reset to default",
                  resetColorAnswer:"Do you want to reset the color and size settings?",
                  not_selected: "Not selected",
                  input_colors: ["Red", "Green", "Blue"],
                  error_ChangeColor: "Select the scope, to edit the color and size!\nClick on the rainbow circle, near the scopes!",
                  scopeSize: "Size",
                  donate: ["Donate","Donate to the author"]
              }
          },

          debug = false,

          myVersion = GM_info.script.version,

          defaultCursorImage = "https://github.com/AlekPet/Change-the-scope-to-surviv.io/raw/master/assets/images/default.png",

          nav_platform = window.navigator.platform.toLowerCase(),
          os_var = nav_platform.indexOf("win") > -1 ? "win" : nav_platform.indexOf("mac") ? "mac" : "other"

    var ObjSaveCursors = null, language = 'en-US',
        selLang = lang.en,

        current_game = location.href.includes("zombsroyale.io")?"zombsroyale":"surviv",

        game_support = {
            "surviv":{
                laser : true
            },
            "zombsroyale":{
                laser : false // not correct work!
            }
        }

    language = window.navigator.userLanguage || window.navigator.language

    if(language.includes("ru")) selLang = lang.ru
    if(debug) console.log("Язык:", language, selLang)

    // Functions
    function backdec(c) {
        var rgbal = [],
            dd = c,
            fou = "";

        if (dd.length == 7) {
            for (var i = 0; i < 3; i++) {
                var fl = [];
                switch (i) {
                    case 0:
                        fou = dd.slice(1, 3);
                        break;
                    case 1:
                        fou = dd.slice(3, 5);
                        break;
                    case 2:
                        fou = dd.slice(5, 7);
                        break;
                }
                fou = fou.toLowerCase()
                let ris = "";
                for (var u = 0; u < 2; u++) {
                    var gi = fou.charAt(u)
                    if (gi.search(/[a-f]/ig) != -1) {
                        switch (gi) {
                            case "a":
                                ris = 10;
                                break;
                            case "b":
                                ris = 11;
                                break;
                            case "c":
                                ris = 12;
                                break;
                            case "d":
                                ris = 13;
                                break;
                            case "e":
                                ris = 14;
                                break;
                            case "f":
                                ris = 15;
                                break;
                        }
                    } else {
                        ris = gi
                    }
                    fl.push(ris)
                }
                let f = (fl[0] * Math.pow(16, 1)) + (fl[1] * Math.pow(16, 0))
                rgbal.push(f)
            }
        }
        return rgbal
    }

    function hex(r=0,g=0,b=0) {
        let gf = "",
            hexv = "0123456789ABCDEF",
            rc = (typeof r == "number" && r<256 && r>=0)?Number(r):0,
            gc = (typeof g == "number" && g<256 && g>=0)?Number(g):0,
            bc = (typeof b == "number" && b<256 && b>=0)?Number(b):0,
            valhex = "",
            ff = [rc, gc, bc];
        for (var i = 0; i < 3; i++) {
            let del = ff[i] % 16,
                di = Math.floor(ff[i] / 16);
            if (ff[i] >= 255) {
                valhex += "FF";
            } else if (ff[i] <= 0) {
                valhex += "00";
            } else {
                valhex += hexv.charAt(di) + hexv.charAt(del);
            }
        }
        gf = "#" + valhex;

        return gf;
    }
    // Functions end

    function loadStorage(){
        let ObjSaveCursors_tmp = GM_getValue('ObjSaveCursors');

        ObjSaveCursors = (ObjSaveCursors_tmp) ? JSON.parse(GM_getValue('ObjSaveCursors')) : {
            options: {
                firstRun: true,
                buttonShow: true,
                laserSetting:{enabled:false, color:"red", width: 2, dotted: {enabled: false, lines:"5,15"}}
            },
            cursorList:{},
            currentActive:null
        };
        // Доп. поля опций, если нет
        if(ObjSaveCursors.hasOwnProperty("options")){
            if(!ObjSaveCursors.options.hasOwnProperty("buttonShow")) ObjSaveCursors.options.buttonShow = true
            if(!ObjSaveCursors.options.hasOwnProperty("laserSetting")){
                ObjSaveCursors.options.laserSetting = {enabled:false, color:"red", width: 2, dotted: {enabled: false, lines:"5,15"}}
            }
        }

        if(debug) console.log(ObjSaveCursors)
        return (ObjSaveCursors.hasOwnProperty("options") && ObjSaveCursors.options.firstRun)?true:false
    }

    function saveToStorage(){
        try{
            var save_data = JSON.stringify(ObjSaveCursors);

            if(save_data.length>0 && save_data !== null && save_data !=="" && save_data !== undefined){
                GM_setValue('ObjSaveCursors', save_data);
                if(debug) console.log("Сохраненно: ",ObjSaveCursors);
            }
        }catch(e){
            console.log(e);
        }
    }

    function imageSizes(imgCur){
        let img = $("<img>")
        .one('load', function(){
            return {x:this.naturalWidth/2, y: this.naturalHeight/2}
        })
        .one('error', function(){
            return null
        }).attr('src',imgCur)
        }

    function setGameCursor(urlCur){
        if(current_game == "zombsroyale"){
            // zombsroyale.io
            let x = document.getElementById("#canvas"),
                las = document.getElementById("linebetas")
            $(x).css({cursor:urlCur,transform:"scale(1.42857) !important"})
            $(las).css({cursor:urlCur,transform:"scale(1.42857) !important",position:"absolute",top:0,left:0})
        } else {
            // surviv.io
            let surv_config = detectSurviv()
            $(surv_config.containerGame).css({'cursor': urlCur})
            $(".zomb_menu-option").show()
        }
    }

    function setCursor(cur = "crosshair", imgInside = null){
        if(debug) console.log(cur,imgInside)

        let urlCur = null
        if(cur == "crosshair" || imgInside == null){
            if(debug) console.log('Равен: ', cur)
            urlCur = cur
        } else {
            let x = imgInside.naturalWidth/2,
                y = imgInside.naturalHeight/2,

                set_cursor = cur.change_color && cur.change_color.src_new ? cur.change_color.src_new : cur.cururl

            urlCur = 'url("'+set_cursor+'") '+x+' '+y+', crosshair'

            if(debug) console.log('Применяем:', urlCur)
        }
        setGameCursor(urlCur)
    }

    function imageCursorAim(){
        if(this.checked){
            let imagecheckActive = returnActive(),
                imagesrc = imagecheckActive != null && imagecheckActive.length ? imagecheckActive[0].cururl: defaultCursorImage,
                $img = $("<img>").one('load', function(){

                    $(this).data('coord',{x:this.width/2, y: this.height/2})

                }).attr({'src':imagesrc,'id':'image_aim'})
            $("body").append($img)

            $(document).mousemove(function(event) {
                let imgData = $img.data('coord')
                if(typeof imgData.x == 'number'){
                    let x=event.pageX+1,//-imgData.x-1,
                        y=event.pageY+1//-imgData.y-1

                    $img.css({
                        "top": y + "px",
                        "left": x +"px"
                    });
                }
            })

        } else {
            $(document).off('mousemove')
            $("#image_aim").remove()
            $(document).mousemove = null
        }
    }

    function loadDefaultScopes(firststart = false){
        if(confirm(!firststart?selLang.resetQuestion:selLang.resetQuestionFisrt)){
            let fileScopes = GM_getResourceText('scopes')
            if(fileScopes.length){
                let convertJSON = JSON.parse(fileScopes).scopes
                if(ObjSaveCursors.hasOwnProperty("cursorList")){
                    ObjSaveCursors.cursorList = convertJSON;
                    saveToStorage()
                    alert(selLang.resetDefaultCompete)
                    updatePanel()
                }
            }
        }
    }

    function makeCnavas(canv){
        if(current_game == "surviv"){
            let $canvas = $("#linebetas"),
                $cvs = $(canv),
                ctx
            if($canvas.length == 0){
                $canvas = $('<canvas>').
                css({
                    position: 'absolute',
                    top: 0,
                    left: 0
                })
                    .attr({
                    id:'linebetas',
                    width: parseInt($cvs.attr('width'),10),
                    height: parseInt($cvs.attr('height'),10)
                })

                $canvas.click(null)
                $canvas.insertAfter($cvs)
            }
            if($canvas.get(0).getContext('2d')){
                $canvas = $canvas.get(0)
                ctx = $canvas.getContext('2d')
                $cvs = $cvs.get(0)
                return {ctx: ctx, canvas: $canvas, cvs: $cvs}
            }
        } else {
            let canvas = document.getElementById("linebetas"),
                cvs = document.getElementById("#canvas"),
                ctx
            if(!canvas){
                canvas = document.createElement('canvas')
                canvas.setAttribute("style", "display:none;position:absolute;top:0;left:0;transform:scale(1.42857) !important;")
                canvas.id="linebetas"
                canvas.width=1920
                canvas.height=531
                cvs.parentNode.insertBefore(canvas, cvs.nextSibling)
            }
            if(canvas.getContext('2d')){
                ctx = canvas.getContext('2d')
                return {ctx: ctx, canvas: canvas, cvs: cvs}
            }
        }
        return null
    }

    var mouse_pos = {x:0, y:0}, ticker_frame
    $(document).mousemove(function(event){
        mouse_pos = {x:event.pageX, y:event.pageY}
    })

    function laserUpdate(params, color, widthLine, dotted){
        let w = params.canvas.width,
            h = params.canvas.height
        $(params.canvas).attr({'width': params.cvs.width, 'height': params.cvs.height})
        params.ctx.beginPath()
        if(dotted != null) params.ctx.setLineDash(dotted);
        params.ctx.strokeStyle=color
        params.ctx.lineWidth=widthLine
        params.ctx.moveTo(w/2,h/2)

        let posXY = current_game == "zombsroyale" ? {x:mouse_pos.x/1.42857, y:mouse_pos.y/1.42857} : {x:mouse_pos.x, y:mouse_pos.y}

        os_var == "win" ? params.ctx.lineTo(posXY.x, posXY.y) : os_var == "mac" ? params.ctx.lineTo(2*posXY.x, 2*posXY.y) : params.ctx.lineTo(posXY.x, posXY.y)
        params.ctx.stroke();

        let surv_conf = detectSurviv()
        if(current_game == 'surviv' && ticker_frame.work  && ['surviv.io', 'suroi.io', 'survev.io','suroi.fpsgo.net'].includes(surv_conf.game)) {

            ticker_frame(function(){
                laserUpdate(params, color, widthLine, dotted)
            });
        }

        // Engine not PIXI JS
        if(current_game != 'surviv' && ticker_frame.work) {
            ticker_frame(function(){
                laserUpdate(params, color, widthLine, dotted)
            });
        }
    }

    function stop_ticker(){
        if(debug) console.log("Timer stop!", "Ticker:", ticker_frame, "Laser support:", game_support[current_game].laser)
        if(ticker_frame && game_support[current_game].laser){

            if(current_game == 'surviv'){
                ticker_frame.stop();
            } else {
                const cancel_ticket = window.cancelAnimationFrame || window.mozCancelAnimationFrame
                ticker_frame.work = false
                cancel_ticket(ticker_frame)
            }
        }
    }

    function betaLine(color = "red", widthLine = 2, dotted = null){
        let surv_config = detectSurviv(),
            params = makeCnavas(surv_config.canvas_game)
        if(['suroi.io','suroi.fpsgo.net'].includes(surv_config.game)) params.canvas.style.zIndex = 1

        if(params){
            if(current_game == 'surviv' && surv_config.game == 'surviv.io'){ // surviv PIXI JS
                ticker_frame = new PIXI.ticker.Ticker();
                ticker_frame.stop();
                ticker_frame.add(function(deltaTime){
                    laserUpdate(params, color, widthLine, dotted)
                });
                ticker_frame.start();
            } else { // zombsroyale Unity and suroi.io
                ticker_frame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
                ticker_frame.work = true;
                ticker_frame(function(){
                    laserUpdate(params, color, widthLine, dotted)
                });
                /* Old version update mouse move
                $(document).mousemove(function(event){
                    let w = params.canvas.width,
                        h = params.canvas.height
                    $(params.canvas).attr({'width': params.cvs.width, 'height': params.cvs.height})
                    params.ctx.beginPath()
                    if(dotted != null) params.ctx.setLineDash(dotted);
                    params.ctx.strokeStyle=color
                    params.ctx.lineWidth=widthLine
                    params.ctx.moveTo(w/2,h/2)

                    let posXY = current_game == "zombsroyale" ? {x:event.pageX/1.42857, y:event.pageY/1.42857} : {x:event.pageX, y:event.pageY}

                    os_var == "win" ? params.ctx.lineTo(posXY.x, posXY.y) : os_var == "mac" ? params.ctx.lineTo(2*posXY.x, 2*posXY.y) : params.ctx.lineTo(posXY.x, posXY.y)
                    params.ctx.stroke();
                })*/
            }
        }
    }

    function selectAllScopes(){
        let selectedClass = this.className == 'selectedall' ? true : false

        this.innerText = selectedClass ? selLang.deselectAll : selLang.selectAll

        $(".list_cur input.checkbox_del_cur").each(function(){
            this.checked = selectedClass
        })
        $(".checkbox_del_cur:checked").length ? $(".del_cur").fadeIn('slow').css("display","inline-block").text(`Удалить [${$(".checkbox_del_cur:checked").length}]`):$(".del_cur").fadeOut('slow')
    }

    // zombsroyale.io
    function checkCursorStartup(){
        if(debug) console.log("Game state:",game.currentGameState)
        //if(document.getElementsByTagName("canvas")[0].style.cursor.indexOf("data:image/cur") != -1){
        let states = ["MainMenu","Dead","loading","UiLoadingOverlay","UiGameOver","UiSpectator","UiPatchNotesOverlay","UiLoginOverlay","UiSettingsOverlay","UiConfirmOverlay","UiMapOverlay","UiSeasonOverlay","UiChallengesOverlay","UiLeaveOverlay","VideoAd","Profile","Cosmetics","Shop","Friends","Leaderboards"]
        if(game_support[current_game].laser && game.currentGameState && states.indexOf(game.currentGameState)<0){
            $("#linebetas").show()
            // $(".zomb_btn-red").show()
        } else {
            $("#linebetas").hide()
        }
    }

    function detectSurviv(){
        const default_surviv = {
            containerGame: "#game-area-wrapper",
            containerMenu: ".btn-battle-container",
            game: "surviv.io",
            canvas_game: "#cvs",
            buttonStyleGame: {
                "font-size": "0.7em",
                "position": "fixed",
                "top": "0",
                "left": "5px",
                "width": "80px",
                "height": "20px",
                "line-height": "1.5",
                "opacity": "0.7",
                "z-index": "5",
                "display": ObjSaveCursors.options.buttonShow ? "block" : "none"
            }}

        let surviv_conf = default_surviv

        if(['suroi.io', 'suroi.fpsgo.net'].includes(location.host)){
            Object.assign(surviv_conf, {
                containerGame: "#game-ui",
                containerMenu:"#splash-ui",
                game: location.host,
                canvas_game: 'canvas:not(#canvasChangeColor)',
                buttonStyleGame: {
                    "font-size": "0.7em",
                    "position": "fixed",
                    "top": "0",
                    "left": "0",
                    "height": "20px",
                    "line-height": "1.5",
                    "opacity": "0.7",
                    "z-index": "50",
                    "padding:": "2px",
                    "text-decoration": "none",
                    "color":"white",
                    "margin-top": "0",
                    "cursor":"pointer",
                    "display": ObjSaveCursors.options.buttonShow ? "block" : "none"
                }})
        }

        if(location.host == 'survev.io'){
            Object.assign(surviv_conf, {
                containerGame: "#game-area-wrapper",
                containerMenu:".play-button-container",
                game: "survev.io",
                canvas_game: "#cvs",
                buttonStyleGame: {
                    "font-size": "0.7em",
                    "position": "fixed",
                    "top": "0",
                    "left": "5px",
                    "width": "100px",
                    "height": "20px",
                    "line-height": "1.5",
                    "opacity": "0.7",
                    "z-index": "5",
                    "display": ObjSaveCursors.options.buttonShow ? "block" : "none"
                }})
        }
        return surviv_conf
    }

    function setZindex(){
        ["#server-select-container","#skin-container","#left-joystick-container","#right-joystick-container","#top-left-container","#scopes-container","#action-container","#weapon-ammo-container","#adrenaline-bar-container","#health-bar-container","#killstreak-indicator-container","#spectating-buttons-container","#items-container","#healing-items-container","#ammo-container","#equipment-container","#weapons-container","#settings-tabs-container","#customize-tabs-container","#settings-menu","#game-ui","#splash-ui"].forEach((selector, indx)=>{
            $(selector).css("z-index", indx+2)
        })
    }

    function makeMenuButton(firststart = false){
        let $openSelectCur = null

        if(current_game == "zombsroyale"){
            // zombsroyale.io
            $openSelectCur = $('<a class="zomb_btn-red zomb_btn-darken zomb_menu-option">'+selLang.selectScope+'</a>').click(function(){
                if(firststart && ObjSaveCursors.options.firstRun) {
                    if(debug) console.log("Прицелы не найдены, загрузить стандартные!")
                    loadDefaultScopes(firststart)

                    ObjSaveCursors.options.firstRun = false
                    saveToStorage()
                }
                $(".mPanel_cur").fadeToggle('slow')
            })
            $openSelectCur.insertAfter(".canvas-loading")
            setInterval(checkCursorStartup, 1000);
        } else {
            // surviv.io
            let surv_config = detectSurviv()

            $openSelectCur = $('<a class="btn-green btn-darken menu-option">'+selLang.selectScope+'</a>')
                .css({
                "background": "#af5050",
                "border-bottom": "2px solid #7a3838",
                "box-shadow": "inset 0 -2px #7a3838",
                "margin-top": "15px"
            })
                .click(function(){
                if(firststart && ObjSaveCursors.options.firstRun) {
                    if(debug) console.log("Прицелы не найдены, загрузить стандартные!")
                    loadDefaultScopes(firststart)
                    ObjSaveCursors.options.firstRun = false
                    saveToStorage()
                }

                $(".mPanel_cur").fadeToggle('slow')
            })
            //$openSelectCur.insertAfter("#btn-start-mode-0")
            $openSelectCur.insertAfter(surv_config.containerMenu)
            if(surv_config.game = 'suroi.io'){
                $openSelectCur.css(surv_config.buttonStyleGame)
                setZindex()
            }

            $(surv_config.containerGame).append($openSelectCur.clone(true).css(surv_config.buttonStyleGame).attr("id","buttonInGame"))

            $(".menu-block").css("max-height", "375px")
        }
    }

    function makePanel(firststart){
        let $mPanel = $("<div class='mPanel_cur'>"+
                        "<div class='mPanel_cur_title'>"+selLang.form_title+"  v"+myVersion+"<div style='cursor:pointer;' title='"+selLang.form_close+"'>X</div></div>"+
                        "<div class='table_box'>"+
                        "<div class='mPanel_cur_list_box'><ul class='list_cur'></ul></div>"+
                        "<div class='rightPanel_options'>"+
                        "<div class='rightPanel_options_inside'>"+
                        "<div class='rightPanel_options_title'>"+selLang.rightOptionsTitle+"</div>"+
                        "<div class='optionFiels'><a href='javascript:void(0)' title='"+selLang.selectAll+"' id='selectAlltScopes' style='color: cyan !important;font-size: 0.6em;text-decoration: none;'>"+selLang.selectAll+"</a></div>"+
                        "<div class='optionFiels'><a href='javascript:void(0)' title='"+selLang.resetDefault+"' id='resetDefaultScopes' style='color: cyan !important;font-size: 0.6em;text-decoration: none;'>"+selLang.resetDefault+"</a></div>"+
                        "<div class='optionFiels font_7'>"+selLang.buttonInGame+": <input type='checkbox'"+(ObjSaveCursors.options.buttonShow?"checked":"")+" title='"+selLang.buttonInGameInfo+"' id='buttin_scope_in_game'></div>"+
                        "<div class='optionFiels'>"+selLang.laser+": <input type='checkbox' title='"+selLang.laser+"' id='LineLaser' "+(game_support[current_game].laser && ObjSaveCursors.options.laserSetting.enabled?"checked":"")+ "></div>"+
                        "<div class='optionFiels' style='margin-top: 20%;'><div class='font_8'>"+selLang.changeColor+"</div>"+
                        "<div class='colorRange'>"+
                        "<div class='canvasColor'><div><canvas id='canvasChangeColor' style='width:auto;height:auto;'></canvas></div></div>"+
                        "<div style='padding:2px;'>"+selLang.paletteColor+" <input style='border: 0;background: #ffffff00;' type='color' value='' id='colorInput'></div>"+
                        "<span style='color:red;'>"+selLang.input_colors[0].charAt(0)+"</span>:<input type='range' max='255' min='0' class='rangeColors' style='width: 100px;' value='0' title='"+selLang.input_colors[0]+"'><br>"+
                        "<span style='color:green;'>"+selLang.input_colors[1].charAt(0)+"</span>:<input type='range' max='255' min='0' class='rangeColors' style='width: 100px;' value='0' title='"+selLang.input_colors[1]+"'><br>"+
                        "<span style='color:blue;'>"+selLang.input_colors[2].charAt(0)+"</span>:<input type='range' max='255' min='0' class='rangeColors' style='width: 100px;' value='0' title='"+selLang.input_colors[2]+"'><br>"+
                        "<div>"+
                        "<span style='color:pink;'>"+selLang.scopeSize+":</span><br><input type='range' id='rangeSize' max='128' min='1' step='1' style='width: 100px;' value='0' title='Size scope'><br><span id='rangeSizeValue'>0x0</span>"+
                        "</div>"+
                        "<div id='setChangeColor' class='cur_button colorChangeButtons' title='"+selLang.applyColorHint+"'>"+selLang.applyColor+"</div>"+
                        "<div id='setDefaultChangeColor' class='cur_button colorChangeButtons' title='"+selLang.resetColorHint+"'>"+selLang.resetColor+"</div>"+
                        "</div>"+
                        "</div>"+
                        "<div class='optionFiels'><span style='display: none'>Image aim:<input type='checkbox' id='mouseimgaim' /></span></div>"+
                        "</div>"+
                        "</div>"+
                        "</div>"+
                        "<div class='mPanel_cur_foot'>"+
                        "<div class='cur_sel_button_box'></div>"+
                        "<div class='infoBlock'>"+
                        "<a href='https://docs.google.com/document/d/1XTnSJoJHyQdqxPfmMYoBSyToXHKEW4QnQDAVsL9tcgU' target='_blank' style='color: yellow !important;' title='"+selLang.donate[1]+"'>"+selLang.donate[0]+"</a>"+
                        "<a href='https://github.com/AlekPet' target='_blank' title='AlekPet Guthub ^_^' style=''color: #56fff1 !important;''>AlekPet 2018</a>"+
                        "</div>"+
                        "</div>"+
                        "</div>"),
            $cur_overlay = $("<div class='cur_overlay'>"),
            closeX = $($mPanel).find(".mPanel_cur_title > div").click(function(){
                $mPanel.fadeOut()
            }),
            bInG = $($mPanel).find("#buttin_scope_in_game").change(function(){
                if(ObjSaveCursors.hasOwnProperty("options") && ObjSaveCursors.options.hasOwnProperty("buttonShow")){
                    ObjSaveCursors.options.buttonShow = this.checked
                    saveToStorage();
                    if(debug) console.log('Показывать кнопку в игре:',this.checked)
                    $("#buttonInGame").css("display", this.checked ? "block" : "none")
                }
            }),
            $LineLaser = $($mPanel).find("#LineLaser").change(function(){
                if(game_support[current_game].laser){
                    if(this.checked){
                        let laserSetting = ObjSaveCursors.options.laserSetting,
                            ls_color = laserSetting.color || "red",
                            ls_width = laserSetting.width || "2",
                            ls_dotted_lines = laserSetting.dotted.lines || "5,15",

                            color = prompt(selLang.laserColor, ls_color),
                            widthLine = prompt(selLang.laserWidth, ls_width),
                            dotted_enabled = false,
                            dotted = (dotted_enabled = confirm(selLang.laserDottedOn)) ? prompt(selLang.laserParmDotted, ls_dotted_lines) : null

                        // Save setting
                        if(confirm(selLang.laserSaveSetting)){
                            if(ObjSaveCursors.hasOwnProperty("options") && ObjSaveCursors.options.hasOwnProperty("laserSetting")){
                                ObjSaveCursors.options.laserSetting = {enabled:this.checked, color:color, width: widthLine, dotted: {enabled: dotted_enabled, lines:dotted}}
                                saveToStorage();
                            }
                        }

                        if(dotted != null) dotted = dotted.split(',')

                        betaLine(color,widthLine,dotted)
                    } else {
                        ObjSaveCursors.options.laserSetting.enabled = this.checked
                        saveToStorage();
                        stop_ticker();
                        $("#linebetas").remove()
                    }
                } else {
                    this.checked = false
                    alert("Laser for zombsroyale is being finalized...")
                }
            }),
            // All events click scope delegate
            ListBox = $($mPanel).find(".mPanel_cur_list_box > ul").click(function(event){
                var target = event.target,
                    elem = target

                while(elem !== this){

                    let datas = $(elem).data("el_val") ? $(elem).data("el_val") : null

                    // Change scope
                    if(elem.className.includes("element_cur_cont")){
                        if(elem.title === "Default"){
                            checkActive(null)
                            setCursor("crosshair")
                        } else {
                            let imgInside = $(elem).find("img").get(0)
                            checkActive(datas)
                            setCursor(datas, imgInside)
                        }
                        $(".list_cur > li.acive_cursor").removeClass("acive_cursor")
                        $(elem).addClass("acive_cursor")
                        saveToStorage()
                        break;
                    }

                    // Change color scope
                    if(elem.className.includes("colorchange_cur")){
                        event.stopPropagation();
                        changeColor(datas)
                        break;
                    }

                    // Edit scope
                    if(elem.className.includes("checkbox_edit_cur")){
                        event.stopPropagation();
                        makeFormAddCursor(false, datas)
                        break;
                    }

                    elem = elem.parentNode
                }
            }),
            $selectAll = $($mPanel).find("#selectAlltScopes").click(function(){
                $(this).toggleClass("selectedall")
                selectAllScopes.call(this);
            }),
            resetDefaultScopes = $($mPanel).find("#resetDefaultScopes").click(loadDefaultScopes),
            $addCursor = $("<div class='cur_button add_cur'>").attr('title',selLang.addCrosshair).text(selLang.addCrosshair).click(makeFormAddCursor),
            $delCursor = $("<div class='cur_button del_cur'>").attr('title',selLang.delCrosshair).text(selLang.addCrosshair).click(delCursor),
            $cur_sel_button_box = $($mPanel).find(".cur_sel_button_box").append($addCursor,$delCursor),
            $mouseimgaim = $($mPanel).find("#mouseimgaim").change(function(){
                imageCursorAim.call(this)
            })

        if($LineLaser.is(":checked")){
            if(game_support[current_game].laser){
                let laserSetting = ObjSaveCursors.options.laserSetting,
                    ls_color = laserSetting.color || "red",
                    ls_width = laserSetting.width || "2",
                    ls_dotted_enabled = laserSetting.dotted.enabled || false,
                    ls_dotted_lines = laserSetting.dotted.lines || "5,15"

                ls_dotted_lines =(ls_dotted_enabled && ls_dotted_lines != null)?ls_dotted_lines.split(','):null

                betaLine(ls_color,ls_width,ls_dotted_lines)
            } else {
                $LineLaser.checked = false
            }
        }

        $mPanel.append($cur_overlay);
        $("body").append($mPanel)
    }

    function updatePanel(firststart = false){
        let ListBox = $(".mPanel_cur_list_box > ul").empty(),
            activeTrue = false,

            divDef = $("<li class='element_cur_cont'>").attr('title',"Default"),
            divDefTitle = $("<span class='element_cur_title'>").text("Default"),
            divDefImg = $("<img width='48'>").attr("src", defaultCursorImage),
            divDefImgBox = $("<div class='element_cur_title'>").append(divDefImg)

        divDef.append(divDefImgBox,divDefTitle)
        $(ListBox).append(divDef)

        $.each(ObjSaveCursors.cursorList, function(index, el){
            let self = el,
                divCont = $("<li class='element_cur_cont'>").attr('title',selLang.selectCrosshair+self.name).data("el_val", self),
                divTitle = $("<span class='element_cur_title'>").text(self.name.length>15?self.name.substr(0,12)+"...":self.name),
                divImg = $("<img width='48'>").one('load',function(){
                    $(this).css("cursor","url("+this.src+")"+this.naturalWidth/2+" "+this.naturalHeight/2+", default")
                }).attr("src", self.change_color ? self.change_color.src_new : self.cururl),
                divImgBox = $("<div class='element_cur_title'>").append(divImg),
                delCheck = $("<input class='checkbox_del_cur' type='checkbox' title='Удаление'>").click(function(event){
                    event.stopPropagation();
                }),
                editButton = $("<input type='button' class='checkbox_edit_cur' value='"+selLang.editCrosshair+"' title='"+selLang.editCrosshair+"'>").data("el_val", {element: self, index: index})

            if(/^data:image/i.test(self.cururl)){
                let colorChange = $("<div class='colorchange_cur' title='"+selLang.changeColor+"'>").data("el_val", {element: self, img: divImg, index: index})
                divCont.append($("<p style='margin: 0;padding: 0;border-bottom: 1px dotted silver;'>").append(colorChange,editButton,delCheck),divImgBox,divTitle)
            } else {
                divCont.append($("<p style='margin: 0;padding: 0;border-bottom: 1px dotted silver;'>").append(editButton,delCheck),divImgBox,divTitle)
            }
            $(ListBox).append(divCont)

            if(self.active){
                activeTrue = true
                $(divCont).addClass("acive_cursor")

                divImg.one('load', function(){
                    setCursor(self, this)
                }).one('error', function(){
                    setCursor()
                })
            }
        })

        if(firststart || !activeTrue){
            $(".element_cur_cont:eq(0)").addClass("acive_cursor")
            setCursor("crosshair")
        }

        $(".checkbox_del_cur").on("change",function(){
            $(".checkbox_del_cur:checked").length ? $(".del_cur").fadeIn('slow').css("display","inline-block").text(`Удалить [${$(".checkbox_del_cur:checked").length}]`):$(".del_cur").fadeOut('slow')
        })
    }

    function defaultValueForm(elem){
        $(elem).find("#name_scope,#link_scope,#previewName,#previewImg").each(function(){
            switch(this.id){
                case 'name_scope':
                case 'link_scope': this.value = ''
                    break;
                case 'previewName': this.innerText='Default'
                    break;
                case 'previewImg': this.src = defaultCursorImage
                    break;
            }
        })
        $(".cur_preview").css('cursor','crosshair')
    }

    function ImgSizeData(img, val){
        $(img).one('load', function(){
            const w = this.naturalWidth,
                  h = this.naturalHeight
            if(w>128 || h>128) alert(selLang.alertMesImage[0]+w+"px x "+h+"px!\n"+selLang.alertMesImage[1])
            $(".cur_preview").css('cursor','url('+this.src+'), not-allowed')
            if(this.src !== defaultCursorImage) $(this).data("sizes", {w:w, h:h});
            else $(this).data("sizes", {w:null, h:null})
        }).one('error', function(){
            this.src = defaultCursorImage
            $(".cur_preview").css('cursor','crosshair')
        }).attr('src', val)
    }

    function makeFormAddCursor(editmake = false, params = null){
        let $makeCurForm = $(".makeCursor_form"),
            $cur_overlay = $(".cur_overlay")

        if($makeCurForm.length == 0){
            $makeCurForm = $("<div class='makeCursor_form'>")
            let htmlInner = "<div class='makeCursor_form_title'><span>"+selLang.addCrosshair+"</span><div title='"+selLang.form_close+"'>X</div></div>"+
                "<div class='maleCursor_form_body'>"+
                "<div class='form_field'><span>"+selLang.name+"</span><input type='text' id='name_scope' value='' maxlength='100' placeholder='"+selLang.scopeName+"'></div>"+
                "<div class='form_field'><span>"+selLang.link+"</span><input type='text' id='link_scope' value='' placeholder='"+selLang.scopeLink+"'></div>"+
                "<div class='cur_preview'><p>"+selLang.preview+"</p><img id='previewImg' src='"+defaultCursorImage+"' width='45'><div style='word-break: break-all;' id='previewName'>Default</div></div>"+
                "<div class='drawSelf' title='"+selLang.drawSelfInstructions+"'>"+selLang.drawSelf+"<a target='_blank' href='http://viliusle.github.io/miniPaint/' style='color:blue'>miniPaint</a><br>"+
                "<a target='_blank' title='"+selLang.scopeSite+"' style='color:red' href='https://thenounproject.com/search/?q=crosshairs'>"+selLang.scopeSite+"</a></div>"+
                "</div>"+
                "<div class='maleCursor_form_foot'>"+
                "<div class='cur_button create_cur' id='createCursor' title='"+selLang.createScope+"'>"+selLang.createScope+"</div>"+
                "</div>"

            $makeCurForm.html(htmlInner)

            $(".mPanel_cur").append($makeCurForm)

            $(".makeCursor_form_title > div").click(function(){
                $makeCurForm.fadeOut('slow', function(){
                    $cur_overlay.fadeOut('slow', function(){
                        defaultValueForm($makeCurForm)
                    })
                })
            })

            $("#name_scope").on('input', function(){
                $("#previewName").text($(this).val())
            })
            $("#link_scope").on('input', function(){
                let val = $(this).val().trim()
                ImgSizeData("#previewImg", val)
            })
        }
        // Show form
        $cur_overlay.fadeIn('slow', function(){
            if(editmake){
                $(".makeCursor_form_title > span").text(selLang.addCrosshair)
                $("#createCursor").text(selLang.createScope).off().click(function(){
                    add_edit_Cursor()
                })
            } else {
                $(".makeCursor_form_title > span").text(selLang.editCrosshair)

                $makeCurForm.find("#name_scope").val(params.element.name)
                $makeCurForm.find("#link_scope").val(params.element.cururl)
                ImgSizeData("#previewImg", params.element.cururl)

                $("#createCursor").text(selLang.editEditApply).off().click(function(){
                    if(params !== null && Object.keys(params).length) add_edit_Cursor(params)
                })
            }
            $makeCurForm.fadeIn('fast')
        })
    }

    function add_edit_Cursor(parametri = null){
        let $makeCurForm = $(".makeCursor_form"),
            $cursorName = $makeCurForm.find("#name_scope"),
            $cursorUrl = $makeCurForm.find("#link_scope"),
            $cur_overlay = $(".cur_overlay"),

            $previewImg = $makeCurForm.find("#previewImg")

        let cursorNameVal = $cursorName.val(),
            cursorUrlVal = $cursorUrl.val(),
            errors = false

        if(/^\s*$/i.test(cursorNameVal)){
            cursorNameVal="Croshair_"+Math.floor(Math.random()*10000)
            $cursorName.val(cursorNameVal)
            alert(selLang.errorName+cursorNameVal)
        }

        if(/^\s*$/i.test(cursorUrlVal)){
            alert(selLang.errorLinkEmpty)
            errors = true
        }

        if(!/(?:^https?:\/\/.*\.(?:png|jpg|jpeg|gif|cur|tiff)$|^data:image)/i.test(cursorUrlVal)){
            alert(selLang.errorLink)
            errors = true
        }

        if(!errors){
            const w = $previewImg.data("sizes").w || 0,
                  h = $previewImg.data("sizes").h || 0

            if(w>128 || h>128 || w == 0 || h == 0 || w == null || h == null){
                alert(selLang.errorImage)
                errors = true
            }
        }

        if(errors){
            alert(selLang.errorAdd)
            return
        }

        if(ObjSaveCursors.hasOwnProperty("cursorList")){
            let ovetMessage = selLang.addComplete
            if(parametri == null){
                ObjSaveCursors.cursorList.push({name:cursorNameVal, cururl:cursorUrlVal, active:false})
            } else {
                if(Object.keys(ObjSaveCursors.cursorList).length && Object.keys(parametri).length){
                    ObjSaveCursors.cursorList[parametri.index] = {name:cursorNameVal, cururl:cursorUrlVal, active:false}
                    ovetMessage = selLang.editComplete
                } else return
            }

            saveToStorage()

            $makeCurForm.fadeOut('slow', function(){
                $cur_overlay.fadeOut('slow', function(){
                    defaultValueForm($makeCurForm)
                })
            })

            updatePanel()
            alert(ovetMessage)

        }
    }

    function returnActive(){
        let activetrue = null
        if(ObjSaveCursors.hasOwnProperty("cursorList") && Object.keys(ObjSaveCursors.cursorList).length){
            activetrue = ObjSaveCursors.cursorList.filter((ix,elem)=>{
                return ix.active == true
            })
            return activetrue
        }
    }

    function checkActive(el){
        if(ObjSaveCursors.hasOwnProperty("cursorList") && Object.keys(ObjSaveCursors.cursorList).length){
            ObjSaveCursors.cursorList.map((ix,elem)=>{
                ix.active = false
                return ix.active
            })
            if(el !== null ) el.active = true
        }
    }

    function delCursor(){
        if(confirm(selLang.delCrosshair)){
            let arr_delete_cursors = []
            $(".list_cur").find("input[type=checkbox]").each(function(index,eleme){
                if($(this).is(':checked')){
                    arr_delete_cursors.push(index);
                }
            });
            arr_delete_cursors = arr_delete_cursors.reverse();
            for(var k in arr_delete_cursors){
                ObjSaveCursors.cursorList.splice(arr_delete_cursors[k],1);
            }
            saveToStorage()
            $(".del_cur").fadeOut('slow')
            updatePanel()
            alert(selLang.delComplete)
        }
    }

    function resize(valS){
        let canvas = document.getElementById("canvasChangeColor"),
            ctx = canvas.getContext("2d")

        $("<img>").one("load", function() {
            var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            if(this.naturalWidth >= this.naturalHeight){
                canvas.width = valS;
                canvas.height = canvas.width * this.naturalHeight / this.naturalWidth;
            } else if(this.naturalWidth < this.naturalHeight){
                canvas.width = canvas.height * this.naturalWidth / this.naturalHeight;
                canvas.height = valS;
            }
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
            $("#rangeSizeValue").text(canvas.width+"x"+canvas.height)
        }).attr('src', $("#canvasChangeColor").data("imagesrc"))
    }

    function setSizeParams(can){
        $("#rangeSize").val(can.width >= can.height ? can.width : can.height)
        $("#rangeSizeValue").text(can.width+"x"+can.height)
    }

    function setColorsScope(){
        let can = document.getElementById("canvasChangeColor"),
            ctx = can.getContext("2d"),
            imgData = ctx.getImageData(0, 0, can.width, can.height),
            eli = document.getElementsByClassName("rangeColors"),
            r = parseInt(eli[0].value),
            g = parseInt(eli[1].value),
            b = parseInt(eli[2].value),
            a = 255

        document.getElementById("colorInput").value = hex(r,g,b)

        for (var i = 0; i < imgData.data.length; i += 4) {

            imgData.data[i] = r; //r
            imgData.data[i + 1] = g; //g
            imgData.data[i + 2] = b; //b
            //imgData.data[i + 3] = a; // alpha
        }
        ctx.putImageData(imgData, 0, 0);
        $.data(can, "imagesrc", can.toDataURL("image/png"))
    }

    function setChangeColor(params){
        const eli = document.getElementsByClassName("rangeColors"),
              size = parseInt(document.getElementById("rangeSize").value),
              r=parseInt(eli[0].value),
              g=parseInt(eli[1].value),
              b=parseInt(eli[2].value),
              a = 255,
              canvas = document.getElementById("canvasChangeColor")

        if(Object.keys(ObjSaveCursors.cursorList[params.index]).length && canvas){
            if(!ObjSaveCursors.cursorList[params.index].hasOwnProperty('change_color')){
                ObjSaveCursors.cursorList[params.index].change_color = {colors:{r:r,g:g,b:b,a:a,size:size}, src_new: canvas.toDataURL("image/png")}
            } else {
                ObjSaveCursors.cursorList[params.index].change_color = {colors:{r:r,g:g,b:b,a:a,size:size}, src_new: canvas.toDataURL("image/png")}
            }
            if(debug) console.log("Цвета:",ObjSaveCursors.cursorList[params.index]);
            saveToStorage();
            updatePanel();
        } else alert("Object not found, or canvas not isset!");
    }

    function setDefaultCursorColors(params){
        if(params.element.hasOwnProperty("change_color") && Object.keys(params.element.change_color).length && params.element.change_color.hasOwnProperty("src_new")){
            if(confirm(selLang.resetColorAnswer)){
                delete ObjSaveCursors.cursorList[params.index].change_color
                saveToStorage();
                updatePanel();
                new Array().slice.call(document.getElementsByClassName("rangeColors")).forEach(function(el){el.value = 0})
                document.getElementById("colorInput").value = "#000000";
                params.img.attr('src',params.element.cururl)
                changeColor(params)
            }
        }
    }

    function changeColor(params = null){
        let can, ctx,img, colorInput

        can = document.getElementById("canvasChangeColor")
        ctx = can.getContext("2d")
        colorInput = document.getElementById("colorInput")

        if(params != null && Object.keys(params).length){

            if(params.element.change_color && Object.keys(params.element.change_color.colors).length){
                let colors = params.element.change_color.colors,
                    a = colors.a,
                    inptuts_colors = document.getElementsByClassName("rangeColors")
                inptuts_colors[0].value = colors.r
                inptuts_colors[1].value = colors.g
                inptuts_colors[2].value = colors.b
                colorInput.value = hex(colors.r,colors.g,colors.b)
                $("#rangeSize").data("sizeval",colors.size)
            } else {
                new Array().slice.call(document.getElementsByClassName("rangeColors")).forEach(function(el){el.value = 0})
                colorInput.value = "#000000";
            }

            img = new Image()
            img.onload = function() {
                can.width = this.naturalWidth
                can.height = this.naturalHeight
                ctx.drawImage(this, 0, 0)

                $.data(can, "imagesrc", this.src)
                setSizeParams(can)
            }
            img.src = params.img.attr('src')

            $("#setChangeColor").off().click(setChangeColor.bind(ctx, params))
            $("#setDefaultChangeColor").off().click(setDefaultCursorColors.bind(ctx, params))

        } else {
            can.width = 80
            can.height = 80
            ctx.font="10px Georgia";
            ctx.textAlign="center";
            ctx.fillStyle = "white";
            ctx.fillText(selLang.not_selected.toUpperCase(),can.width/2,can.height/2);

            let eli = document.getElementsByClassName("rangeColors")
            for (let i = 0; i < eli.length; i++) {
                eli[i].addEventListener("input", setColorsScope)
            }

            let boxcolor = document.getElementById("colorInput").addEventListener("input", function(){
                let curColor = this.value,
                    digitColor = backdec(curColor)
                eli[0].value = digitColor[0]
                eli[1].value = digitColor[1]
                eli[2].value = digitColor[2]
                colorInput.value = hex(digitColor[0],digitColor[1],digitColor[2])
                setColorsScope()
            })

            // Size
            $("#rangeSize").on("input", function(){
                resize(this.value)
            })

            $("#setChangeColor").add($("#setDefaultChangeColor")).off().click(function(){
                alert(selLang.error_ChangeColor)
            })
        }
    }

    function init(){
        let firststart = false;
        if(loadStorage()){
            firststart = true
            if(debug) console.log("Первый запуск!", firststart)
        }
        console.log("Current game: ", current_game, "Laser support:", game_support[current_game].laser)
        makeMenuButton(firststart)
        makePanel()
        updatePanel(firststart)
        changeColor()
    }
    window.onload = function(){
        init()
    }
})();
