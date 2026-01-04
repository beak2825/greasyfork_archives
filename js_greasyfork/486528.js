// ==UserScript==
// @name         Генератор хуйни
// @namespace    Генератор_хуйни
// @version      1.6.1
// @description  Создай хуйню!
// @author       Анонимус
// @include      *://2ch.*
// @icon         https://i.imgur.com/XK5x1Zr.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/486528/%D0%93%D0%B5%D0%BD%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%85%D1%83%D0%B9%D0%BD%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/486528/%D0%93%D0%B5%D0%BD%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%85%D1%83%D0%B9%D0%BD%D0%B8.meta.js
// ==/UserScript==

const storage = loadStorage();

const imageSources = {
    'говниме': {url: 'https://thisanimedoesnotexist.ai/results/psi-0.4/seed%seed%.png', argument: 'seed', seedLength: 5},
    'кони': {url: 'https://thisponydoesnotexist.net/v1/w2x-redo/jpgs/seed%seed%.jpg', argument: 'seed', seedLength: 5},
    'кот': {url: 'https://cataas.com/cat?%nocache%'},
    'человек': {url: 'https://thispersondoesnotexist.com/?%nocache%', cropBottom: true},
    'glaza': {url: 'https://www.thisirisdoesnotexist.com/', argument: 'regex', regex: /(?<=\.)\/static\/iris_images\/seed\d+\.png/i, prefix: 'https://www.thisirisdoesnotexist.com'}
}

const elementHtml = `
    <div style='user-select: none;'>
       <a id='hg-generate'><strong>Насрать хуйни</strong></a>
       <a id='hg-config-button'><strong>[настройки]</strong></a>

       <div id='hg-config-wrapper' style='display: none;'>
           <div id='hg-config'>
               <label>Режим <select id='hg-mode'><option tab='random-text'>Тарабарщина</option><option tab='repeat'>Повтор постов</option></select></label>
               <div id='hg-tabs'>
                   <div class='hg-tab' id='hg-tab-random-text' tab='random-text'>
                       <label>Длина слова <input id='hg-word-min' value='5' class='input'/>-<input id='hg-word-max' value='10' class='input'/></label>
                       <label>Длина предложения <input id='hg-sentence-min' value='5' class='input'/>-<input id='hg-sentence-max' value='10' class='input'/></label>
                       <label>Длина параграфа <input id='hg-paragraph-min' value='5' class='input'/>-<input id='hg-paragraph-max' value='10' class='input'/></label>
                       <label>Знаки препинания <select id='hg-punctuation'><option>Точки</option><option>Все</option><option>Нет</option></select></label>
                       <label>Мелкобуквенность <input id='hg-melkobukva' type='checkbox'/></label>
                       <label>Многострочность <input id='hg-mnogostrok' type='checkbox'/></label>
                   </div>
                   <div class='hg-tab' id='hg-tab-repeat' tab='repeat'>
                       <label>Брать посты <input id='hg-repeat-posts-from' value='2' class='input'/>-<input id='hg-repeat-posts-to' value='500' class='input'/></label>
                   </div>
               </div>
               <label>Новая строка после генерации <input id='hg-newline' type='checkbox'/></label>
               <label>
                   <input id='hg-generate-avatar' type='button' class='button desktop' value='Сгенерировать аватарку'/>
                   <select id='hg-generate-avatar-type'>
                       <option>${Object.keys(imageSources).join('</option><option>')}</option>
                   </select>
               </label>
               Сгенерированная картинка<br/>
               <img id='hg-generated-image' width='64' height='64'/> <br/>
           </div>
       </div>
    </div>
`;

const styleElement = document.createElement('style');
document.head.appendChild(styleElement);
styleElement.innerHTML = `
    .hg-tab > *, #hg-config > * {
        margin: 2px 0;
    }

    .hg-tab, #hg-config {
        display: flex;
        flex-direction: column;
    }

    #hg-config input:not([type]) {
        max-width: 50px;
    }
`;

const element = document.createElement('div');

const digits = `0123456789`;
const letters = `abcdefghijklmnopqrstuvwxyz0123456789`;

(function() {
    'use strict';

    element.innerHTML = elementHtml;
    const area = document.querySelector('form#postform .postarea');
    area.parentNode.insertBefore(element, area.nextSibling.nextSibling.nextSibling);

    element.querySelector('#hg-generate').onclick = () => {
        const cfg = buildConfig();
        if (!cfg) return;
        const text = paragraph(cfg);
        for (const field of document.querySelectorAll('#shampoo')) field.value += text;
    };

    const configWrapper = element.querySelector('#hg-config-wrapper');
    element.querySelector('#hg-config-button').onclick = () => {
        configWrapper.style.display = configWrapper.style.display ? '' : 'none';
    };

    element.querySelector('#hg-generate-avatar').onclick = generateAvatar;

    initTabs();

    initInputStorageSync('hg-word-min');
    initInputStorageSync('hg-word-max');
    initInputStorageSync('hg-sentence-min');
    initInputStorageSync('hg-sentence-max');
    initInputStorageSync('hg-paragraph-min');
    initInputStorageSync('hg-paragraph-max');
    initInputStorageSync('hg-repeat-posts-from');
    initInputStorageSync('hg-repeat-posts-to');

    initCheckboxStorageSync('hg-melkobukva');
    initCheckboxStorageSync('hg-mnogostrok');
    initCheckboxStorageSync('hg-newline');

    initSelectStorageSync('hg-punctuation');
    initSelectStorageSync('hg-generate-avatar-type');
    initSelectStorageSync('hg-mode');

    element.querySelector('#hg-mode').onchange();
})();

function initTabs() {
    for (const tab of element.querySelectorAll('#hg-tabs > *')) tab.style.display = 'none';
    const modeSelect = element.querySelector('#hg-mode');

    modeSelect.onchange = () => {
        const name = modeSelect.options[modeSelect.selectedIndex].getAttribute('tab');
        for (const tab of element.querySelectorAll(`#hg-tabs > :not([tab='${name}'])`)) tab.style.display = 'none';
        element.querySelector(`#hg-tabs >[tab='${name}']`).style.display = '';
    };
}

function buildConfig() {
    const cfg = {
        mode: element.querySelector('#hg-mode').selectedIndex,

        wordLengthMin: parseInt(element.querySelector('#hg-word-min').value),
        wordLengthMax: parseInt(element.querySelector('#hg-word-max').value),
        sentenceLengthMin: parseInt(element.querySelector('#hg-sentence-min').value),
        sentenceLengthMax: parseInt(element.querySelector('#hg-sentence-max').value),
        paragraphLengthMin: parseInt(element.querySelector('#hg-paragraph-min').value),
        paragraphLengthMax: parseInt(element.querySelector('#hg-paragraph-max').value),

        melkobukva: element.querySelector('#hg-melkobukva').checked,
        mnogostrok: element.querySelector('#hg-mnogostrok').checked,
        insertNewLine: element.querySelector('#hg-newline').checked,

        punctuation: element.querySelector('#hg-punctuation').selectedIndex,

        repeatPostsFrom: parseInt(element.querySelector('#hg-repeat-posts-from').value),
        repeatPostsTo: parseInt(element.querySelector('#hg-repeat-posts-to').value),
    };

    if (cfg.wordLengthMin == NaN || cfg.wordLengthMax == NaN ||
        cfg.wordLengthMin < 1 ||
        cfg.wordLengthMin > cfg.wordLengthMax) { alert('Неверная длина слова'); return; }

    if (cfg.sentenceLengthMin == NaN || cfg.sentenceLengthMax == NaN ||
        cfg.sentenceLengthMin < 1 ||
        cfg.sentenceLengthMin > cfg.sentenceLengthMax) { alert('Неверная длина предложения'); return; }

    if (cfg.paragraphLengthMin == NaN || cfg.paragraphLengthMax == NaN ||
        cfg.paragraphLengthMin < 1 ||
        cfg.paragraphLengthMin > cfg.paragraphLengthMax) { alert('Неверная длина параграфа'); return; }

    if (cfg.repeatPostsFrom == NaN || cfg.repeatPostsTo == NaN ||
        cfg.repeatPostsFrom < 1 ||
        cfg.repeatPostsFrom > cfg.repeatPostsTo) { alert('Неверное число постов'); return; }

    return cfg;
}

function initInputStorageSync(id) {
    const el = element.querySelector('#' + id);
    const valueKey = id + '_value';
    if (storage[valueKey] !== undefined) el.value = storage[valueKey];
    el.oninput = () => {
        storage[valueKey] = el.value;
        saveStorage();
    }
}

function initCheckboxStorageSync(id) {
    const el = element.querySelector('#' + id);
    const valueKey = id + '_value';
    if (storage[valueKey] !== undefined) el.checked = storage[valueKey];
    el.onchange = () => {
        storage[valueKey] = el.checked;
        saveStorage();
    }
}

function initSelectStorageSync(id) {
    const el = element.querySelector('#' + id);
    const prevOnChange = el.onchange;
    const valueKey = id + '_value';
    if (storage[valueKey] !== undefined) el.selectedIndex = storage[valueKey];
    el.onchange = () => {
        storage[valueKey] = el.selectedIndex;
        saveStorage();
        if (prevOnChange) prevOnChange();
    }
}

async function generateAvatar() {
    const select = element.querySelector('#hg-generate-avatar-type');
    const source = imageSources[select.options[select.selectedIndex].textContent];
    const image = new Image();
    image.crossOrigin = 'anonymous';
    try {
        let arg;
        switch (source.argument) {
            case 'seed':
                image.src = source.url.replace('%seed%', choices(digits, source.seedLength).join(''));
                break;
            case 'regex':
                arg = (await httpGet(source.url)).match(source.regex);
                if (source.prefix) arg = source.prefix + arg;
                image.src = arg;
                break;
            default:
                image.src = source.url;
                break;
        }
        image.src = image.src.replace('%nocache%', `x=${Date.now()}`);

        await image.decode();
    }
    catch (e) {
        alert('Для загрузки с этого источника нужно установить расширение для обхода настроек CORS. ' +
              '(для firefox - CORS Everywhere, для chrome - CORS Unblock)');
        return;
    }

    const imageBitmap = await createImageBitmap(image);

    const scale = Math.random() * 2 + 0.2;
    const crop = Math.round(imageBitmap.width * 0.25 * Math.random());

    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil((imageBitmap.width - crop) * scale);
    canvas.height = Math.ceil((imageBitmap.height - 5 - (source.cropBottom ? 20 : 0)) * scale);

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.scale(scale, scale);
    ctx.drawImage(imageBitmap, -Math.round(crop / 2), 0, imageBitmap.width, imageBitmap.height);

    const mimeType = choice(['image/jpg', 'image/png']);
    const toBlobPromise = new Promise(function(resolve, reject) { canvas.toBlob(resolve, mimeType); });
    const blob = await toBlobPromise;
    blob.name = choices(letters, 5 + Math.floor(Math.random() * 10)).join('') + '.' + mimeType.substring('image/'.length);
    element.querySelector('#hg-generated-image').src = URL.createObjectURL(blob);

    if (!document.body.classList.contains('de-runned')) window.FormFiles.addMultiFiles([blob]);
}

function loadStorage() {
    const json = localStorage.getItem('hueta-generator-storage');
    try {
        return json ? JSON.parse(json) : {};
    }
    catch {
        return {};
    }
}

function saveStorage() {
    localStorage.setItem('hueta-generator-storage', JSON.stringify(storage));
}

function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function choices(array, length) {
    return Array.apply(null, Array(length)).map(i => choice(array));
}

function choiceByChance(chances) {
    const roll = Math.random();
    return chances.find(i => roll <= i[1])[0]
}

function word(cfg) {
    const lenght = cfg.wordLengthMin + Math.round(Math.random() * (cfg.wordLengthMax - cfg.wordLengthMin)) - 1;

    let letter = choiceByChance(chancesForFirstLetter);
    let result = letter;

    for (let i = 0; i < lenght; i++) {
        const nextLetter = choiceByChance(chances[letter]);
        result += nextLetter;
        letter = nextLetter;
    }

    return result;
}

function sentence(cfg) {
    let result = Array.apply(null, Array(cfg.sentenceLengthMin + Math.round(Math.random() * (cfg.sentenceLengthMax - cfg.sentenceLengthMin)))).map(i => word(cfg)).join(' ');

    if (!cfg.melkobukva) result = result.charAt(0).toUpperCase() + result.slice(1);

    return result;
}

function paragraph(cfg) {
    let result;
    switch (cfg.mode) {
        case 0:
            result = randomTextParagraph(cfg);
            break;
        case 1:
            result = repeatTextParagraph(cfg);
            break;
    }
    if (cfg.insertNewLine) result += '\n\n';
    return result;
}

function randomTextParagraph(cfg) {
    const length = cfg.paragraphLengthMin + Math.round(Math.random() * (cfg.paragraphLengthMax - cfg.paragraphLengthMin));
    let result = '';
    for (let i = 0; i < length; i++) {
        result += sentence(cfg);

        switch(cfg.punctuation) {
            case 0:
                result += '. ';
                break;
            case 1:
                result += choiceByChance(punctuationChances);
                break;
            case 2:
                result += ' ';
                break;
        }

        if (cfg.mnogostrok && i < length - 1) result += '\n';
    }

    return result;
}

function repeatTextParagraph(cfg) {
    return choice(
        Array
            .from(document.querySelectorAll('article.post__message'))
            .slice(cfg.repeatPostsFrom, cfg.repeatPostsTo)
            .map(i => i.innerHTML.replace(/<br>/gi, '\n').replace(/(\&gt;){2}\d+(\s\([^\)]+\))?|<[^>]+>|&[^;]+;|https:\/\/\S+/gi, '').trim())
            .filter(i => i)
        ) || '';
}

async function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

// Шансы в формате {'буква': [('буква после', %шанс буквы% + %предыдущий шанс буквы%)]}

const chances = {
    'а': [['б', 0.02535211], ['в', 0.090140834], ['г', 0.10985914], ['д', 0.12112674], ['е', 0.15211265], ['ж', 0.16901405], ['з', 0.23098586], ['и', 0.23661967], ['й', 0.24788727], ['к', 0.3042253], ['л', 0.3887323], ['м', 0.43661964], ['н', 0.5887323], ['п', 0.6197182], ['р', 0.6760562], ['с', 0.74929565], ['т', 0.8422534], ['у', 0.853521], ['ф', 0.8563379], ['х', 0.87323934], ['ц', 0.912676], ['ч', 0.93239427], ['ш', 0.94084495], ['щ', 0.94366187], ['ю', 0.96338016], ['я', 1], ],
    'б': [['а', 0.084337346], ['е', 0.18072289], ['и', 0.22891566], ['к', 0.25301206], ['л', 0.3373494], ['н', 0.36144578], ['о', 0.57831323], ['р', 0.6385542], ['с', 0.68674695], ['у', 0.7831325], ['х', 0.7951807], ['щ', 0.8433734], ['ъ', 0.8554216], ['ы', 0.9638553], ['ю', 0.9879517], ['я', 1], ],
    'в': [['а', 0.1965812], ['в', 0.20512821], ['е', 0.37606838], ['з', 0.3888889], ['и', 0.47008547], ['к', 0.47863248], ['л', 0.52136755], ['м', 0.5256411], ['н', 0.59401715], ['о', 0.78632486], ['р', 0.8034189], ['с', 0.8376069], ['т', 0.86752146], ['у', 0.880342], ['ш', 0.897436], ['ы', 1], ],
    'г': [['а', 0.09782608], ['д', 0.11956521], ['е', 0.17391303], ['и', 0.27173913], ['л', 0.32608694], ['м', 0.3369565], ['н', 0.34782606], ['о', 0.8369564], ['р', 0.96739113], ['с', 0.9782607], ['у', 1], ],
    'д': [['а', 0.16666663], ['в', 0.18939391], ['е', 0.4393938], ['ж', 0.44696954], ['и', 0.5757574], ['к', 0.58333313], ['л', 0.61363614], ['н', 0.712121], ['о', 0.81818163], ['п', 0.8257574], ['р', 0.84848464], ['с', 0.8712119], ['у', 0.9545452], ['х', 0.96212095], ['ы', 0.97727245], ['ь', 0.9848482], ['я', 1], ],
    'е': [['а', 0.007481297], ['б', 0.009975063], ['в', 0.024937656], ['г', 0.057356607], ['д', 0.11471321], ['е', 0.12718204], ['ж', 0.13965087], ['з', 0.16708228], ['и', 0.17206982], ['й', 0.21446383], ['к', 0.2668329], ['л', 0.36907732], ['м', 0.436409], ['н', 0.640898], ['о', 0.65087306], ['п', 0.6558606], ['р', 0.73566115], ['с', 0.8628433], ['т', 0.93017495], ['ф', 0.9351625], ['х', 0.9576064], ['ц', 0.9601001], ['ч', 0.98753154], ['ш', 0.9950128], ['я', 1], ],
    'ж': [['а', 0.125], ['д', 0.40000004], ['е', 0.62500006], ['и', 0.8000001], ['н', 1], ],
    'з': [['а', 0.20792076], ['б', 0.23762372], ['в', 0.31683165], ['г', 0.3465346], ['д', 0.4653465], ['ж', 0.47524747], ['и', 0.51485145], ['к', 0.5346534], ['л', 0.5544554], ['м', 0.60396034], ['н', 0.78217816], ['о', 0.8514851], ['р', 0.88118804], ['у', 0.930693], ['ы', 0.96039593], ['ь', 0.9702969], ['я', 1], ],
    'и': [['а', 0.010025063], ['б', 0.01754386], ['в', 0.07268172], ['г', 0.08270678], ['д', 0.097744375], ['е', 0.21303257], ['ж', 0.2180451], ['з', 0.2706767], ['и', 0.31328323], ['й', 0.36591482], ['к', 0.39097747], ['л', 0.41604012], ['м', 0.4761905], ['н', 0.56390977], ['о', 0.5764411], ['п', 0.5814536], ['р', 0.63408524], ['с', 0.69172937], ['т', 0.7694236], ['у', 0.7744361], ['ф', 0.7794486], ['х', 0.79949874], ['ц', 0.8070175], ['ч', 0.87969923], ['ш', 0.88471174], ['ю', 0.9072681], ['я', 1], ],
    'й': [['д', 0.05263158], ['м', 0.10526316], ['н', 0.42105263], ['р', 0.5263158], ['с', 0.68421054], ['т', 0.84210527], ['ч', 0.8947368], ['ш', 1], ],
    'к': [['а', 0.15189874], ['в', 0.15822786], ['е', 0.1772152], ['и', 0.3417722], ['л', 0.386076], ['м', 0.39240512], ['н', 0.41139245], ['о', 0.70886093], ['р', 0.7531647], ['с', 0.79113936], ['т', 0.9177216], ['у', 0.993671], ['ц', 1], ],
    'л': [['а', 0.100529104], ['г', 0.10582011], ['е', 0.28042325], ['и', 0.4656084], ['л', 0.50264543], ['н', 0.52380943], ['о', 0.69312155], ['с', 0.69841254], ['у', 0.73015857], ['ь', 0.9153437], ['ю', 0.9365077], ['я', 1], ],
    'м': [['а', 0.16129029], ['в', 0.1693548], ['е', 0.37903214], ['и', 0.5403224], ['л', 0.54838693], ['м', 0.56451595], ['н', 0.61290306], ['о', 0.8306449], ['п', 0.862903], ['у', 0.9193546], ['ы', 1], ],
    'н': [['а', 0.13157901], ['г', 0.13684218], ['д', 0.13947375], ['е', 0.22368431], ['и', 0.47105262], ['к', 0.47631577], ['н', 0.56842107], ['о', 0.77368414], ['р', 0.7789473], ['с', 0.80789465], ['т', 0.85789466], ['у', 0.8736841], ['ф', 0.8763157], ['ц', 0.8789473], ['ч', 0.8815789], ['ы', 0.95526314], ['ь', 0.9605263], ['я', 1], ],
    'о': [['б', 0.060194183], ['в', 0.18834953], ['г', 0.27184469], ['д', 0.33980584], ['е', 0.36116508], ['ж', 0.38834953], ['з', 0.44466022], ['и', 0.4524272], ['й', 0.49902916], ['к', 0.5087379], ['л', 0.5572816], ['м', 0.64077675], ['н', 0.6912622], ['о', 0.7048544], ['п', 0.71650493], ['р', 0.7766991], ['с', 0.89902925], ['т', 0.9650487], ['ф', 0.9669904], ['х', 0.9708739], ['ц', 0.9825244], ['ч', 0.9864079], ['ш', 0.99029136], ['щ', 0.99417484], ['я', 1], ],
    'п': [['а', 0.024], ['е', 0.15200001], ['и', 0.16000001], ['л', 0.19200002], ['н', 0.20000002], ['о', 0.5279999], ['п', 0.54399985], ['р', 0.9279996], ['у', 0.9599996], ['ц', 0.96799964], ['ь', 0.9919996], ['я', 1], ],
    'р': [['а', 0.2835819], ['в', 0.29477593], ['г', 0.30596995], ['д', 0.3097013], ['е', 0.45149228], ['ж', 0.4626863], ['з', 0.46641764], ['и', 0.60820866], ['к', 0.61194], ['м', 0.6194027], ['н', 0.64179075], ['о', 0.8694025], ['с', 0.9104473], ['т', 0.92537266], ['у', 0.9477607], ['ч', 0.9514921], ['ш', 0.95895475], ['ы', 0.9813428], ['ь', 0.98507416], ['я', 1], ],
    'с': [['а', 0.030303031], ['б', 0.033333335], ['в', 0.04848485], ['д', 0.051515155], ['е', 0.09696971], ['и', 0.14242426], ['к', 0.26969695], ['л', 0.3363636], ['м', 0.3393939], ['н', 0.3515151], ['о', 0.46969688], ['п', 0.52727264], ['р', 0.53333324], ['с', 0.5878787], ['т', 0.87272704], ['у', 0.90303004], ['х', 0.92121184], ['ц', 0.92424214], ['ч', 0.92727244], ['ш', 0.93636334], ['ь', 0.94545424], ['я', 1], ],
    'т': [['а', 0.105263196], ['в', 0.21981433], ['е', 0.36532518], ['и', 0.5479877], ['к', 0.5603716], ['л', 0.56965953], ['м', 0.5758515], ['н', 0.6160992], ['о', 0.7368423], ['р', 0.80185777], ['с', 0.8359135], ['у', 0.8730652], ['ы', 0.88854504], ['ь', 0.9969042], ['я', 1], ],
    'у': [['а', 0.086538464], ['б', 0.09615385], ['г', 0.13461539], ['д', 0.22115386], ['е', 0.24038462], ['ж', 0.27884617], ['к', 0.28846157], ['л', 0.3269231], ['м', 0.37500003], ['н', 0.41346157], ['п', 0.4615385], ['р', 0.53846157], ['с', 0.6057693], ['т', 0.6923077], ['х', 0.7115385], ['ч', 0.82692313], ['ш', 0.8365385], ['щ', 0.91346157], ['ю', 1], ],
    'ф': [['а', 0.23076925], ['и', 0.61538464], ['л', 0.7692308], ['о', 0.84615386], ['с', 0.9230769], ['у', 1], ],
    'х': [['а', 0.10344827], ['е', 0.20689654], ['м', 0.2413793], ['н', 0.44827586], ['о', 0.89655167], ['р', 0.96551716], ['с', 1], ],
    'ц': [['а', 0.032258064], ['е', 0.29032257], ['и', 1], ],
    'ч': [['а', 0.15116279], ['е', 0.75581414], ['и', 0.8604653], ['н', 0.98837227], ['т', 1], ],
    'ш': [['а', 0.03448276], ['е', 0.34482756], ['и', 0.7586206], ['к', 0.8275861], ['л', 0.9310344], ['н', 1], ],
    'щ': [['а', 0.11538462], ['е', 0.61538464], ['и', 0.8846154], ['н', 0.923077], ['р', 0.96153855], ['ь', 1], ],
    'ъ': [['е', 1], ],
    'ы': [['в', 0.064935066], ['д', 0.077922076], ['е', 0.24675325], ['й', 0.37662336], ['к', 0.4025974], ['л', 0.45454544], ['м', 0.5324675], ['п', 0.5454545], ['р', 0.58441556], ['с', 0.6363636], ['т', 0.66233766], ['х', 0.90909094], ['ч', 0.935065], ['ш', 1], ],
    'ь': [['е', 0.040816326], ['з', 0.08163265], ['к', 0.14285713], ['н', 0.5918367], ['с', 0.67346936], ['т', 0.75510204], ['ч', 0.7755102], ['ш', 0.8163265], ['ю', 0.9795918], ['я', 1], ],
    'э': [['к', 0.3529412], ['л', 0.4117647], ['с', 0.47058824], ['т', 1], ],
    'ю': [['б', 0.03448276], ['д', 0.06896552], ['р', 0.13793103], ['т', 0.51724136], ['ч', 0.62068963], ['щ', 0.96551716], ['э', 1], ],
    'я': [['в', 0.04347826], ['д', 0.108695656], ['е', 0.21739131], ['м', 0.2826087], ['н', 0.32608694], ['с', 0.34782606], ['т', 0.7391304], ['х', 0.8260869], ['ш', 0.847826], ['ю', 0.95652163], ['я', 1], ],
    'ё': [['м', 0.14285715], ['н', 0.42857146], ['с', 0.5714286], ['т', 1], ],
}


const chancesForFirstLetter = [
    ['а', 0.018950438],
    ['б', 0.06268221],
    ['в', 0.15160352],
    ['г', 0.17346941],
    ['д', 0.20991257],
    ['е', 0.2230321],
    ['ж', 0.23032074],
    ['з', 0.25510207],
    ['и', 0.31195337],
    ['к', 0.3644315],
    ['л', 0.37317786],
    ['м', 0.41253644],
    ['н', 0.47667637],
    ['о', 0.54373175],
    ['п', 0.65451896],
    ['р', 0.71865886],
    ['с', 0.8556851],
    ['т', 0.9008746],
    ['у', 0.92565596],
    ['ф', 0.93586004],
    ['х', 0.9431487],
    ['ц', 0.94752187],
    ['ч', 0.9723032],
    ['ш', 0.97376096],
    ['э', 0.99708456],
    ['я', 1],
]

const punctuationChances = [
    ['. ', 0.5],
    ['! ', 0.75],
    ['? ', 1],
];