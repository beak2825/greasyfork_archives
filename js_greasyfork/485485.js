// ==UserScript==
// @name         Bypass Question Crypt
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  Make text readable to AI and search engines
// @author       @dsvl0
// @match        https://docs.google.com/forms/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485485/Bypass%20Question%20Crypt.user.js
// @updateURL https://update.greasyfork.org/scripts/485485/Bypass%20Question%20Crypt.meta.js
// ==/UserScript==
/* eslint no-eval: 0 */

var TotalAwnsers=[];
var CurerntAwnser=-1;
var Awnsers=[];
var Descriptions=[];
let canAutoFill = true;
let lastTabId = null;

// Данные словаря увеличены в ~1.6 раз (по сравнению с 1.3)

let library = {
    'з0': '30',
    'з1': '31',
    'з2': '32',
    'з3': '33',
    'з4': '34',
    'з5': '35',
    'з6': '36',
    'з7': '37',
    'з8': '38',
    '0з': '03',
    '1з': '13',
    '2з': '23',
    '4з': '43',
    '5з': '53',
    '6з': '63',
    '7з': '73',
    '8з': '83',
    '9з': '93',
    'з9': '39',
    '2з': '23',
    'З0': '30',
    'З1': '31',
    'З2': '32',
    'З3': '33',
    'З4': '34',
    'З5': '35',
    'З6': '36',
    'З7': '37',
    'З8': '38',
    'З9': '39',
    '2-з': '2-3',
    '4з': '43',
    '∅': '0',
    'ᛐ': '1',
    'вIоS': 'BIOS',
    'RISс': "RISC",
    'саснe': 'cache',
    'Саснe': 'Cache',
    'Rам': 'RAM',
    'вlu-rаy': 'Blu-Ray',
    'Rом': 'ROM',
    'СрU': 'CPU',
    'GрU': 'GPU',
    'рSU': 'PSU',
    'USв': 'USB',
    'сISс': 'CISC',
    'рro':'pro',
    'НDD': 'HDD',
    'С:\\':'C:\\',
    'progrам': 'program',
    'аррliсаtion': 'application',
    'Dаtа': 'Data',
    'Iвм': 'IBM',
    'АррLе': 'Apple',
    'МIсRоSоFт': 'Microsoft',
    'INтеL': 'INTEL',
    'амD': 'AMD',
    'wireless': 'wireless',
    'runаs': 'runas',
    'tаsкlist': 'tasklist',
    'Iт':'IT',
    'еssentiаls': 'essentials',
    'сDFS': 'CDFS',
    'GрS': 'GPS',
    'Wер': 'WEP',
    'gрresult': 'gpresult',
    'IDе': 'IDE',
    'gрuрdаte': 'gpupdate',
    'Iр': 'IP',
    'смоS': 'CMOS',
    'NаND': 'NAND',
    'NоR': 'NOR',
    'Etнernet': 'Ethernet',
    'Вluetootн': 'Bluetooth',
    "Nот": "NOT",
    'ХоR': 'ХOR',
    'ВоотмGR':'BootMGR',
    'Вмр': 'Bmp',
    'WаV':' WAV',
    'Рсх': 'Pcx',
    'МвR': 'MBR',
    'аND': 'AND',
    'оR': 'OR',
    'сDR': 'CDR',
    'WмF': 'WMF',
    'Sнift': 'Shift',
    'Аlt': 'Alt',
    'вlu-Rаy': 'Blu-Rаy',
    'Васкsрасe': 'Backspace',
    'SFс': 'sfc',
    '/SсаNNоW': '/scannow',
    'WINDоWS': 'Windows',
    'мемORY':'memory',
    'DIаGNоSтIс': 'diagnostic',
    'Eхт4': 'EXT4',
    'СнкDSк': 'chkdsk',
    'DISкраRт': 'diskpart',
    'Сарs Loск': 'Caps Lock',
    'СарsLoск': 'CapsLock',
    'Рytнon': 'Python',
    'Jаvаsсriрt' : 'Javascript',
    'Сtrl': 'Ctrl',
    'Рнр': 'Php',
    'NAS':'NAS',
    'Рerl': 'Perl',
    '.сoм':'.com',
    'Рnр': 'Pnp',
    'Fат': 'FAT',
    'СDFS': 'CDFS',
    'NтFS': 'NTFS',
    'Gв':'GB',
    'аSсII': 'ASCII',
    'СLI': 'CLI',
    'ОрenGL': 'OpenGL',
    'нoмe': 'home',
    'Uас': 'Uac',
    'VрN':'VPN',
    'рlug':'plug',
    'and':'and',
    'рlаy':'play',
    'еxрlorer':'explorer',
    'Тнeваt':'Thebat',
    'Мozillа': 'Mozilla',
    'ВootмGR':'BootMGR',
    'асtive': 'active',
    'Мiсrosoft': 'Microsoft',
    'оutlooк': 'outlook',
    'тнunderbird': 'thunderbird',
    'tнunderbird': 'thunderbird',
    'Direсtory': 'Directory',
    'АрI': 'API',
    'gмаil.сoм': 'gmail.com',
    'Rах': 'RAX',
    'Фамилия имя': 'Фамилия Имя'

}



function WordsLibrary(sentense){
    let words = sentense.split(' ')
    let new_sentense = '';
    let allKeys = Object.keys(library);
    for (let i=0; i<words.length; i++){
        let word = words[i]

        let worldInLibrary = library[word];
        if (worldInLibrary === undefined){worldInLibrary=word}

        for (let key=0; key<allKeys.length; key++){
            let isInLibrary = worldInLibrary.indexOf(allKeys[key])
            if (isInLibrary > -1){
                worldInLibrary = worldInLibrary.replaceAll(allKeys[key],library[allKeys[key]])
            }
        }
        new_sentense += worldInLibrary
        if (i !== words.length -1){
            new_sentense+= ' '
        }
    }
    return new_sentense

}




function CreateSettingsIfNotCreated(){
    if (document.querySelector('.md0UAd') !== null){
        if (document.getElementById('ByPassAutoText') === null){
            //Автоматически заполнять эту страницу
            let set = document.createElement('input');
            set.type='checkbox'
            set.id='ByPassAutoText'
            set.style='margin-top: 12px';
            let text = document.createElement('label')
            text.textContent = 'Автоматически заполнять эту страницу (Bypass Tsoi Crypt)'
            text.setAttribute("for", "ByPassAutoText");
            document.querySelector('.md0UAd').after(set)
            set.checked = localStorage.getItem('BTSCByPassAutoText') !== null

            let ClearData = document.createElement('button')
            ClearData.textContent = 'Очистить записанные данные входа Bypass Tsoi Crypt'
            ClearData.style='background: #009100; color: #fff; border-radius: 5px; margin-top: 3px; padding: 8px; cursor: pointer; border: solid 2px green';

            set.after(text)
            text.after(ClearData)

            set.addEventListener('change', function() {
                if (this.checked) {
                    localStorage.setItem('BTSCByPassAutoText', 1)
                } else {
                    localStorage.removeItem('BTSCByPassAutoText', 1)
                }
            })

            ClearData.addEventListener('click', function() {
                let conftxt = 'Очистить данные для авто-заполнения? Страница будет перезагружена';
                if (confirm(conftxt)){
                    localStorage.removeItem("BPSForEmail")
                    localStorage.removeItem("BPSName")
                    localStorage.removeItem("BPSGroup");
                    canAutoFill = false;
                    location.reload();
                }
            })
        }
    }
}


function setUserInput(inputElement, value) {
    inputElement.value = value;
    var inputEvent = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(inputEvent);
}


let WaitingTimes = 8;
let previos_checkbox = null;
function SaveAccount(){
    try{
        CreateSettingsIfNotCreated()
        if (document.querySelector('span.EbMsme') !== null && document.querySelector('.md0UAd') !== null && canAutoFill && localStorage.getItem('BTSCByPassAutoText') !== null){
            let settings = {
                forEmail: localStorage.getItem("BPSForEmail"),
                name: localStorage.getItem("BPSName"),
                group: localStorage.getItem("BPSGroup")
            }
            let group = document.querySelectorAll('.d7L4fc');
            let v = 0;
            let group_position = null;
            group.forEach(i => {
                if (i.childNodes[0].getAttribute('aria-checked') === 'true'){
                    group_position = v
                }
                v++;
            })


            if (document.querySelectorAll('input.whsOnd.zHQkBf')[1].value === '' && settings.name !== null && WaitingTimes > 10){
                setUserInput(document.querySelector('input.whsOnd.zHQkBf'), settings.name);
                WaitingTimes = 0;
            } else if (document.querySelectorAll('input.whsOnd.zHQkBf')[1].value === '') {WaitingTimes++}
            if (group_position===null && settings.group !== null){
                if (group[Number(settings.group)].children[0].getAttribute('aria-checked') === 'false'){
                    group[Number(settings.group)].click()
                }
            }

            if (document.querySelector('.rq8Mwb') !== null && document.querySelector('.rq8Mwb').parentElement.getAttribute('aria-checked') !== 'true'){
                document.querySelector('.rq8Mwb').click()
            }


            localStorage.setItem("BPSForEmail", document.querySelector('span.EbMsme').textContent)
            if (document.querySelectorAll('input.whsOnd.zHQkBf')[1].value !== ''){localStorage.setItem("BPSName", document.querySelectorAll('input.whsOnd.zHQkBf')[1].value)}
            if (group_position !== null){localStorage.setItem("BPSGroup", group_position)}
        }
    } catch(e){console.error(e)}
}


function Low(txt){
    txt=txt.replaceAll("А","а").replaceAll("А","а");
    txt=txt.replaceAll("Б","б").replaceAll("Б","б");
    txt=txt.replaceAll("В","в").replaceAll("В","в");
    txt=txt.replaceAll("Г","г").replaceAll("Γ","г");
    txt=txt.replaceAll("Д","д");
    txt=txt.replaceAll("Е","е").replaceAll("E","е");
    txt=txt.replaceAll("Ё","ё");
    txt=txt.replaceAll("Ж","ж");
    txt=txt.replaceAll("З","з").replaceAll("З","з");
    txt=txt.replaceAll("И","и").replaceAll("И","и");
    txt=txt.replaceAll("Й","й").replaceAll("Й","й");
    txt=txt.replaceAll("К","к").replaceAll("К","к");
    txt=txt.replaceAll("Л","л");
    txt=txt.replaceAll("М","м");
    txt=txt.replaceAll("Н","н").replaceAll("Н","н");
    txt=txt.replaceAll("О","о").replaceAll("О","о");
    txt=txt.replaceAll("П","п").replaceAll("Π","п");
    txt=txt.replaceAll("Р","р");
    txt=txt.replaceAll("С","с");
    txt=txt.replaceAll("Т","т").replaceAll("Т","т");
    txt=txt.replaceAll("У","у");
    txt=txt.replaceAll("Ф","ф");
    txt=txt.replaceAll("Х","х");
    txt=txt.replaceAll("Ц","ц");
    txt=txt.replaceAll("Ч","ч");
    txt=txt.replaceAll("Ш","ш");
    txt=txt.replaceAll("Щ","щ");
    txt=txt.replaceAll("Ъ","ъ");
    txt=txt.replaceAll("Ы","ы").replaceAll("Ы","ы");
    txt=txt.replaceAll("Ь","ь");
    txt=txt.replaceAll("Э","э");
    txt=txt.replaceAll("Ю","ю");
    txt=txt.replaceAll("Я","я");
    txt=txt.replaceAll("∅","0");
    txt=txt.replaceAll("∅","0");
    txt=txt.replaceAll("ᛐ","1");

    return txt;

}




function AnalyzeText(){

    const PointsCount = document.querySelectorAll('.nUvMO.FUQCPb')
    for (const item of PointsCount){
        item.style.display="none";
    }


    const span = [...document.querySelectorAll('.M7eMe'), ...document.querySelectorAll('span.aDTYNe.snByac.OvPDhc.OIC90c'), ...document.querySelectorAll(".ulDsOb"), ...document.querySelectorAll(".F9yp7e.ikZYwf.LgNcQe"), ...document.querySelectorAll('.V4d7Ke.OIC90c')];


    for (const element of span){
        let res = element.textContent;
        res = res.replaceAll("A", "А");
        res = res.replaceAll("a", "а");
        res = res.replaceAll("B", "В");
        res = res.replaceAll("C", "С");
        res = res.replaceAll("c", "с");
        res = res.replaceAll("K", "К");
        res = res.replaceAll("k", "к");
        res = res.replaceAll("Λ", "Л");
        res = res.replaceAll("M", "М");
        res = res.replaceAll("m", "м");
        res = res.replaceAll("H", "Н");
        res = res.replaceAll("h", "н");
        res = res.replaceAll("P", "Р");
        res = res.replaceAll("p", "р");
        res = res.replaceAll("3", "З");
        res = res.replaceAll("O", "О");
        res = res.replaceAll("X", "Х");
        res = res.replaceAll("T", "Т");



        res=res[0]+(Low(res.slice(1,res.length)));
        res=WordsLibrary(res);
        if (element.textContent !== res){
            element.textContent = res
        }
    }

    setTimeout(AnalyzeText, 2000);


}

function StylePatcher(){
    let styleDiv = document.createElement('style')
    styleDiv.id='PatchedStyle'
    styleDiv.textContent = `
.Qr7Oae {
    position: relative;
}

* {
font-family: "Google Sans",Roboto,Arial,sans-serif;
letter-spacing: .25px;
}

.z12JJ {margin-right: 12px; width: 100%}
span.M7eMe {
    margin-right: 10px;
}

.googleFloatButton {
    background: transparent;
    color: #5f6368;
    height: fit-content;
    border-radius: 5px;
    margin-top: 3px;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    border: solid 2px #5f636890;
    font-weight: 500;
    position: relative;
    top: -10px;
    padding: 6px;
    right: 0px;
}

.googleFloatButton.butontitle {
    margin-top: 10px;
    top: 0px;
    left: 0px;
    width: 100%;
}

.googleFloatButton.butontitle.butVisible {
    display: block !important;
}

button.googleFloatButton.yandexsearch {
     width: 100%;
     left: 0px;
     border-color: #fb3d1b;
     color: black;
}



    `;
    document.body.appendChild(styleDiv)

}


function rand(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(0));
}

function RandomRadioClick(ListToRandom){
    if (ListToRandom.length !== 0){
        let element = rand(0, ListToRandom.length-1)
        if (ListToRandom[element].getAttribute('aria-checked') === 'false'){
            ListToRandom[element].click()
        } else {
            RandomRadioClick(ListToRandom)
        }
    }

}

function RandomCheckboxClick(ListToRandom){
    if (ListToRandom.length !== 0){
        let element = rand(0, ListToRandom.length-1)
        ListToRandom[element].click()
    }
}


function StartRandomForDiv(content){
    console.log(content)
    let radioButtons = (content.parentElement.parentElement.querySelectorAll('.Od2TWd'))
    let checkboxes = (content.parentElement.parentElement.querySelectorAll('.rq8Mwb'))
    RandomRadioClick(radioButtons)
    RandomCheckboxClick(checkboxes)
}

function SwitchRandomVisibility(){
    let HideAll = document.getElementById('HideAllButton')
    if (document.getElementById('RandomButtonsNotVisible') === null){
        HideAll.textContent = 'Показать добавленные кнопки '
        let styleDiv = document.createElement('style')
        styleDiv.id='RandomButtonsNotVisible'
        styleDiv.textContent = `
        .googleFloatButton {display: none !important}
        `;
        document.head.appendChild(styleDiv)
    } else {
        HideAll.textContent = 'Скрыть добавленные кнопки'
        document.getElementById('RandomButtonsNotVisible').remove()
    }
}





function RandomizeChoice(){
    try{
        if (document.querySelector('.md0UAd') === null || document.querySelector('.md0UAd') === null){
            let allDivs = document.querySelectorAll('.z12JJ')
            allDivs.forEach(div => {
                let RandomChoice = document.createElement('button')
                RandomChoice.textContent = 'Случайный выбор'
                RandomChoice.addEventListener('click', function() {
                    StartRandomForDiv(RandomChoice)
                })
                RandomChoice.className='googleFloatButton';
                div.appendChild(RandomChoice)




                let YandexSearch = document.createElement('button')
                YandexSearch.className = 'googleFloatButton yandexsearch'
                YandexSearch.textContent = 'Найти в Яндекс'
                YandexSearch.addEventListener('click', function() {
                    let ortext = (div.parentElement.querySelector('.M4DNQ').textContent)
                    let searchText = ortext.replace(' ','+')
                    searchText = 'https://yandex.ru/search/?text='+searchText
                    if (false){
                        let variants = YandexSearch.parentElement.querySelectorAll('.snByac:not(.RveJvd)')
                        if (variants.length > 0){
                            variants.forEach(span => {searchText += span.textContent+', ';})
                            searchText+=')'

                        }
                    }
                    searchText.replaceAll('Мой ответ','')
                    window.open(searchText)

                })


                div.before(YandexSearch)
            })
        }


        if (document.querySelector('.md0UAd') === null && document.getElementById("RandomizeAll") === null){
            let titleBar = document.querySelector('.m7w29c.O8VmIc.tIvQIf')
            let RandomAll = document.createElement('button')
            RandomAll.textContent = 'Случайно выбрать где возможно'
            RandomAll.addEventListener('click', function() {
                let allowToRandAll = confirm("Вы точно хотите установить всё случайно? Это перезапишет ваши ответы")
                if (allowToRandAll){
                    let listOfElements = document.querySelectorAll('button.googleFloatButton')
                    listOfElements.forEach( block => {StartRandomForDiv(block)} )
                }
            })
            RandomAll.className='googleFloatButton butontitle';


            let HideAll = document.createElement('button')
            HideAll.textContent = 'Скрыть добавленные кнопки'
            HideAll.id='HideAllButton'
            HideAll.addEventListener('click', function() {
                SwitchRandomVisibility()
            })
            HideAll.className='googleFloatButton butontitle butVisible';
            titleBar.appendChild(HideAll);
            titleBar.appendChild(RandomAll);

        }







        if (document.querySelector('.md0UAd') !== null){
            setTimeout(RandomizeChoice, 150)
        }




    } catch(e) {console.error(e)}
}


(function() {
    StylePatcher()

    setTimeout(RandomizeChoice, 150)

    window.reanalyze = function(){
        AnalyzeText()
    }
    //try{setInterval(SaveAccount, 200)}catch(e){}
    setTimeout(function () { AnalyzeText(); }, 500);

})();
