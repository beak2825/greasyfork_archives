// ==UserScript==
// @name         Omni Tools
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  ;)
// @author       You
// @match        https://omni.top-academy.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=top-academy.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487845/Omni%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/487845/Omni%20Tools.meta.js
// ==/UserScript==
var Version = "1.4.1";
var CurrentHomeworks=null;
var CanOpenImage=true;
var UpdateFounded=false;
var TeacherLogin = null;
let FetchesCount = 0;
let URLWaitingList = [];

function FeedbackAi(){
    //Список моделей на сайте
    let AINameList = [
                      'OpenChat 3.5 (Recommended)',
                      'SnowFlake (Recommended)',
                      'Mistral 7B',
                      'Llama 3 8B',
                      'RWKV v5 3B AI Town',
                      'Capybara 7B',
                      'Gemma 7B',
                      'MythoMist 7B']
    //Список используемых нейросетей
    let AIProvidesList = [
                          'openchat/openchat-7b:free',
                          'snowflake/snowflake-arctic-instruct',
                          'mistralai/mistral-7b-instruct:free',
                          'meta-llama/llama-3-8b-instruct:free',
                          'recursal/rwkv-5-3b-ai-town',
                          'nousresearch/nous-capybara-7b:free',
                          'google/gemma-7b-it:free',
                          'gryphe/mythomist-7b:free']

    //Функция отправки запроса с ожиданием ответа
    function sendRequest(method, url, senddata) {
        try{
        return new Promise((resolve, reject) => {
            fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer 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`,
                    "HTTP-Referer": `https://docs.google.com/`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": senddata.ai_model,
                    "messages": [
                        {"role": "user", "content": senddata.promt},
                    ],
                })
            })
                .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
                .then(data => resolve(data["choices"][0]["message"]["content"]))
                .catch(error => reject(error));
        });
        } catch(e){alert(e)}
    }



    let feedbackareas = document.querySelectorAll('textarea.textarea-rev')//Поиск всех textarea для подстановки текста из ИИ
    let stundentinfodiv = document.querySelectorAll('.col-md-12 .col-md-6:nth-child(1)')//Поиск div с описанием студента

    while (document.getElementById('AIButton') !== null){document.getElementById('AIButton').remove()}//Это очищает все созданные кнопки
    while (document.getElementById('AIPromt') !== null){document.getElementById('AIPromt').remove()}//Это очищает все созданные поля промтов

    function PromtPrepare(buttonPosition){
        let informationdiv = stundentinfodiv[buttonPosition]//Получение div под номером buttonPosition из списка
        let information = informationdiv.querySelectorAll('p')//Получение данных об ученике

        let Grade = Math.round(Number(information[4].textContent.replace('Успеваемость: ',''))/120*1000)//Конвертация успреваемости в проценты (я знаю что этот расчёт просто имба)
        if (Grade !== NaN && Grade !== null){
            let PromtText = 'Привет! Я преподаватель в колледже и мне нужно оставить простой и краткий отзыв для ученика, желательно, не более 2 предложений. Прошу тебя помочь с написанием отзыва. Ниже приведена небольшая информация об ученике. Полное имя ученика: '+information[5].textContent.replace('ФИО: ','')+', средняя посещаемость ученика: '+information[3].textContent.replace('Посещаемость: ','')+', средняя успеваемость:'+Grade+'%. (Предмет:'+(information[6].textContent.replace('Предмет:',''))+'). Будет замечательно если ты допустишь как можно меньше грамматических ошибок';
            return PromtText
        } else {
            return false
        }
    }




    function AskAI(i){
        let pressedButton = document.querySelector('.AIButtonAsk'+i)//Поиск нажатой кнопки
        let informationdiv = stundentinfodiv[i]//Поиск требуемого div из списка
        let promt = informationdiv.querySelector('textarea').value//Получение textarea из полученного div и его значения
        let choiced_model_number = AINameList.indexOf(document.getElementById('AISelection').value)//Получение выбранной модели
        pressedButton.textContent = 'Генерация отзыва...'
        pressedButton.disabled='true'
        sendRequest('POST', 'https://omnixtended.loca.lt/askAi', {promt: promt, ai_model:AIProvidesList[choiced_model_number]}).then(res => {
            feedbackareas[i].value = res;
            pressedButton.textContent = 'Сгенерировать заново'
            pressedButton.style.border='none'
            pressedButton.disabled = false;
        }).catch(err=> {
            console.error(err)
            pressedButton.textContent = 'Произошла ошибка :(';
            pressedButton.style.border='solid 2px red'
            pressedButton.disabled = false;
        })
    }

    //Для каждого ученика создаётся своя кнопка и поле с промптом
    for (let i = 0; i<feedbackareas.length; i++){
        //Создание кнопки с вызовом генерации
        let AIButton = document.createElement('button')
        AIButton.id='AIButton'
        AIButton.textContent='Генерация отзыва с помозью AI'
        AIButton.style='margin: 10px 0px 0px 0px; width: 100%'
        AIButton.className= 'waves-effect waves-light btn md-button md-ink-ripple AIButtonAsk'+i
        AIButton.addEventListener('click', function() {
            AskAI(i)
        })


        //Создание поля с промптом
        let AIPromt = document.createElement('textarea')
        AIPromt.id="AIPromt"
        AIPromt.style="width: 100%; height: 60px; border-radius: 10px; font-size: smaller"
        AIPromt.placeholder="Описание студента для нейросети";

        //Заспавнить кнопку после поля ввода
        feedbackareas[i].parentElement.appendChild(AIButton)//Можно использовать parentElement.appendChild вместо after
        //Заспавнить промпт-поле после информации об ученике
        stundentinfodiv[i].appendChild(AIPromt)
        let finalPromt = PromtPrepare(i)//Создание и вставка заготовленного промта для этого ученика
        AIPromt.value = finalPromt
    }

    if(document.getElementById('AISelection') !== null) {document.getElementById('AISelection').remove()}//Сброс выбора поля модельки нейросети при перезапуске
    //Создание выпадающего меню
    let AISelection = document.createElement('select')
    AISelection.id='AISelection'
    AISelection.style='margin: 10px; padding: 4px; border-radius: 5px;'
    let selectionInner='';
    for (let h = 0; h<AINameList.length; h++){
        //Добавлениее списка доступных нейронок в выпадающее меню
        selectionInner+='<option>'+AINameList[h]+'</option>'
    }
    //Применение
    AISelection.innerHTML=selectionInner;
    document.querySelector('span.reviews-container').before(AISelection)

    //Создание кнопки перезапуска (нужна была когда я начинал делать этот код, но сейчас просто фишка)
    if (document.getElementById('AIReload') !== null){document.getElementById('AIReload').remove()}
    let AIReload = document.createElement('button')
    AIReload.id="AIReload";
    AIReload.className = 'waves-effect waves-light btn md-button md-ink-ripple'
    AIReload.style='position: absolute; top: 0px; width: fit-content; right: 10px'
    AIReload.textContent = 'Перезапустить AITools';
    AIReload.addEventListener('click', function() {
        FeedbackAi()//Вызвать эту функцию заново
    })
    document.querySelector('span.reviews-container').appendChild(AIReload)
}
function checkFeedbackOpened(){
    if(document.querySelector('md-dialog.reviews-modal.reviews-modal-comments.layout-padding') !== null && document.getElementById('AIButton') === null){
        setTimeout(FeedbackAi, 1000);
    }
}




function SendPacket(URL, Type, JSONVals){
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();
        xhr.open(Type, URL);
        xhr.setRequestHeader('authority', 'msapi.top-academy.ru');
        xhr.setRequestHeader('method', 'POST');
        xhr.setRequestHeader('path', '/api/v2/auth/login');
        xhr.setRequestHeader('scheme', 'https');
        xhr.setRequestHeader('Accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader('Accept-Language', 'ru_RU, ru');
        xhr.setRequestHeader('UIRequestData', TeacherLogin);

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject(xhr.statusText);
                }
            }
        };
        xhr.onerror = () => reject(xhr.statusText);

        if (URL.indexOf("teacherTools") >= 0) {FetchesCount += 1;}
        if (JSONVals!==null) {
            xhr.setRequestHeader('Content-Type', 'application/json');

            let requestBody = JSONVals;
            if (typeof JSONVals === 'string') {
                requestBody = JSON.parse(JSONVals);
            }
            xhr.send(JSON.stringify(requestBody));
        } else {
            xhr.send();
        }

    });

}
window.SendPacket = SendPacket;

function CreateFullscreenViewAPI(){
                var FullscreenView = document.createElement('div');
                FullscreenView.id="FillScreenViewer"
                FullscreenView.innerHTML=`
            <style>
img#FullscreenImg { max-width: 100%; max-height: 100%; height: 80% !important; object-fit: cover; transition: all 1s;transform: translate(-50%, -50%);left: 50%;top: 50%;position: relative;height: auto;border-radius: 20px;z-index: 9000;display: block;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}
img#FullscreenImg:hover { height: 97% !important; }
.imgActiveImage{ transition: all 1s; border-radius: 20px; width: 100%; max-height: 100px; object-fit: cover; cursor: pointer; }
.imgActiveImage:hover{ max-height: 150px; }
div#FullscreenView {width: 100%; height: 0%; background: #252525de; position: absolute; transition: all .6s; top: 0px; z-index: 102; display: none; }
</style>
            <div id="FullscreenView" onClick="window.CloseImageOnFullscreen()">
            <img id="FullscreenImg">

            </div>`;
                document.querySelector("body").after(FullscreenView)
}

function IsHomeWorksOpened(){
    return document.querySelectorAll("#myDialog.home_work_modal md-dialog").length > 0 // Применить скрипт если окно открылось
}

function CreateStyleIfNotExists(name, content) {
    if (document.getElementById(name) === null) {
        let style = document.createElement('style')
        style.textContent = content;
        style.id = name;
        document.body.appendChild(style)
    }
}


function DisplayRender(res, urlToHomework, placement) {
    CreateStyleIfNotExists('hwPreview', `
                 #myDialog.home_work_modal .hw-md_item {width: 50%; position: relative}
                 .hwPreview {width: 50%; position: absolute; left: 100%; top: 0%; height: 100%}
                 .hwPreview {border-radius: 4px; width:100%; overflow: auto; border: solid 1px #383838; height: 100%; padding: 10px }
                 .hwPreview img {max-width:100%; object-fit: contain; padding: 10px; border-radius: 6px}
                 .hwPreview .pythonReader {white-space: pre;}
                 .hwPreview *[style="min-height:56.7pt"] {display: none;}
                 .md-dialog-container.ng-scope {height: 100% !important; position: fixed}
                 .hw-md_single__select-mark {flex-wrap: wrap;}
                 #myDialog.home_work_modal md-dialog {width: 1160px; left: 50%; transform: translateX(-50%)}
            `);

    if (document.querySelector(`.hwPreview[previewurl="${urlToHomework}"]`) !== null) {return}

    let content = '<span class="NoSucsessLoad"> Не удалось открыть файл (неизвестный тип файла) </span>'

    if (res.displayAs ==='html'){
        content = res.content.replace('href="', 'href="https:\\\\journalui.ru\\HwPreview\\fileReaderCache\\')
    } else if (res.displayAs ==='image'){
        content = res.content
    } else if (res.displayAs ==='pdf'){
        content = '<iframe class="pdfViewer" src="https:\\journalui.ru/homework/pdfPreview/'+res.AdditionalInfo+'"></iframe>'
    }

    let DisplayingDiv = document.createElement('div')
    DisplayingDiv.setAttribute('previewurl', urlToHomework)
    DisplayingDiv.className = 'hwPreview'
    DisplayingDiv.innerHTML = content;
    placement.after(DisplayingDiv)
    FetchesCount = FetchesCount - 1;
    URLWaitingList.splice(URLWaitingList.indexOf(urlToHomework), 1)
    if (res.displayAs ==='python') {
        DisplayingDiv.innerHTML = '';
        let span = document.createElement('span');
        span.className = 'pythonReader';
        span.textContent = res.content;
        DisplayingDiv.appendChild(span);
    }


}

function CreateRemoteViewAPI (urlToHomework, placement) {
    // Скоро загружу обнову на сервер, и запрос будет доступен по ссылке (пишу на момент теста на моём любимом 127.0.0.1:4890)
    // https://journalui.ru/teacherTools/hwPreviewTool

    // P.S. файлы по типу .py начну поддерживать скоро, обновление клиента (этого скрипта) не понадобиться (я надеюсь). А ещё добавлю пару проверок чтобы запрос был разрешён только с омни (код же открытый)
    // Дизайн наверное сделаю приятнее но чуть позже, сейчас времени нету


    if (document.querySelector(`.hwPreview[previewurl="${urlToHomework}"]`) === null && urlToHomework !== null && FetchesCount < 10 && URLWaitingList.indexOf(urlToHomework) == -1) {
        URLWaitingList.push(urlToHomework);
        if (localStorage.getItem(`hwPreviewTool:${urlToHomework}`) !== null) {
            let res = localStorage.getItem(`hwPreviewTool:${urlToHomework}`)
            console.log(`hwPreviewTool:${urlToHomework}`)
            res= JSON.parse(res);
            console.log(`Pulling ${urlToHomework} to storage...`);
            DisplayRender(res, urlToHomework, placement);
        } else {




            SendPacket("https://journalui.ru/teacherTools/hwPreviewTool", "POST", {url: urlToHomework}).then(res => {
                res = JSON.parse(res);
                console.log(`Saving ${urlToHomework} to storage...`);
                localStorage.setItem(`hwPreviewTool:${urlToHomework}`, JSON.stringify(res));
                DisplayRender(res, urlToHomework, placement);
            }).catch(err => {
                console.error(err);
                let DisplayingDiv = document.createElement('div')
                DisplayingDiv.setAttribute('previewurl', urlToHomework);
                DisplayingDiv.className = 'hwPreview'
                DisplayingDiv.textContent = 'Нам не удалось открыть этот файл'
                placement.after(DisplayingDiv) // Предотвращает повторный пинг сервера, убирая нагрузку
                FetchesCount = FetchesCount - 1;
                URLWaitingList.splice(URLWaitingList.indexOf(urlToHomework), 1)
            })
        }
    }
}

function ShowImageIfAvaiable(){
    if (IsHomeWorksOpened()){
        SendPacket("https://omni.top-academy.ru/homework/get-new-homeworks", "POST", null).then(data => {
            data = JSON.parse(data);

            CurrentHomeworks=data.homework.reverse();
            const downloadUrls = CurrentHomeworks.map(obj => obj.download_url_stud);
            const PreviewPlaces = document.querySelectorAll(".hw-md_single_stud-work__outer")

            if (document.getElementById("FillScreenViewer") === null){
                CreateFullscreenViewAPI();
            }


            for (var i=0; i < PreviewPlaces.length; i++){
                try{
                    CreateRemoteViewAPI(downloadUrls[i], PreviewPlaces[i]);
                    if (document.getElementById("ActiveImage"+i) !== null && document.getElementById("ActiveImage"+i).src !== downloadUrls[i]) {document.getElementById("ActiveImage"+i).src = downloadUrls[i]}
                    if (document.getElementById("ActiveImage"+i) === null){
                        var ImgPreviewDiv = document.createElement('div');
                        ImgPreviewDiv.innerHTML=(`
<img class='imgActiveImage' src=`+downloadUrls[i]+` id="ActiveImage`+i+`" onError='NotImage("ActiveImage`+i+`")' style="border-radius:20px; width:100%; cursor:pointer;" onClick="OpenImageOnFullscreen('`+downloadUrls[i]+`')">
`);
                        PreviewPlaces[i].after(ImgPreviewDiv)
                    }
                }catch(e){console.error(e)}
            }





        })
    }
    setTimeout(ShowImageIfAvaiable, 1000)
}



function CheckUpdates(){
    fetch('https://greasyfork.org/ru/scripts/487845-omni-image-preview', {method: 'GET'})
        .then(response => response.text())
        .then(data => {
        var versionRegex = /<dt class="script-show-version"><span>Версия<\/span><\/dt>\s+<dd class="script-show-version"><span>(.*?)<\/span><\/dd>/;

        var match = data.match(versionRegex);

        if (match) {
            var version = match[1];
            if (version!==Version && version!=="" && UpdateFounded==false){
                UpdateFounded=true;
                window.open('https://greasyfork.org/ru/scripts/487845-omni-image-preview')

            } else {
                setTimeout(CheckUpdates, 1800000);
            }
        }
    })
        .catch(error => {});
}


function ProcessLoad(){
    if(IsHomeWorksOpened()){
        setTimeout(ShowImageIfAvaiable, 200)
    } else {
        setTimeout(ProcessLoad, 200)
    }
}

function AccountLog (){
    SendPacket('https://omni.top-academy.ru/profile/get-profile', 'POST', {}).then(res=>{
        res = JSON.parse(res);
        TeacherLogin = encodeURI(res.teach_info.fio_teach.toLowerCase().replace(" ","_"))
        console.log(TeacherLogin)
    })
}

(function() {
    setTimeout(CheckUpdates, 60000);
    setInterval(checkFeedbackOpened, 1000);//
    window.CloseImageOnFullscreen = function () {
        if (CanOpenImage){
            CanOpenImage=false;
            document.getElementById('FullscreenView').style.height='0%'
            setTimeout(function() {document.getElementById('FullscreenView').style.display='none'}, 510);
            setTimeout(CanOpenImage=true, 500);
        }

    };
    window.OpenImageOnFullscreen = function (URL) {
        if (CanOpenImage){
            CanOpenImage=false;
            document.getElementById('FullscreenView').style.display='block';
            setTimeout(function() {document.getElementById('FullscreenView').style.height='100%'}, 10);
            document.getElementById('FullscreenImg').src=URL;
            setTimeout(CanOpenImage=true, 500);
        }
    };
    window.NotImage = function (ID) {
        if (document.getElementById(ID) !== null){
            document.getElementById(ID).style.display="none";
        }
    };
    ProcessLoad();
    setTimeout(AccountLog, 1000)
})();