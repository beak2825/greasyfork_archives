// ==UserScript==
// @name         AutoDuo
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      BETA2.0.0
// @description  AutoDuo est un script qui vise à booster les utilisateurs sur Duolingo.
// @author       SkaosDev
// @match        https://*.duolingo.com/*
// @icon         https://th.bing.com/th/id/R.7906a950e1858872efb990b26798ac14?rik=L318gB4YgPpZUg&pid=ImgRaw&r=0
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/504520/AutoDuo.user.js
// @updateURL https://update.greasyfork.org/scripts/504520/AutoDuo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const FINDREACT_TRAVERSEUP = 1;
    const FINDREACT_CLASSNAME = "_3yE3H";
    const APPNAME = "AutoDuo"
    const APPAUTHOR = "SkaosDev"
    const APPVERSION = "Bêta 2.0.0"
    let IS_BTN_CREATE = false;
    let lastOne = 0;
    let solverStart = false;

    const style = document.createElement('style');
    style.textContent = `
    .autoduo_button {
        border: 2px solid black;
        background-color: pink;
        transition: background 0.15s;
        cursor: pointer;
    }
    .autoduo_button:hover {
        background-color: #ff869b;
    }
`;
    document.head.appendChild(style);

    function findReact(dom, traverseUp = 1) {
        const key = Object.keys(dom).find(key => {
            return key.startsWith("__reactFiber$")
            || key.startsWith("__reactInternalInstance$");
        });
        const domFiber = dom[key];
        if (domFiber == null) return null;
        if (domFiber._currentElement) {
            let compFiber = domFiber._currentElement._owner;
            for (let i = 0; i < traverseUp; i++) {
                compFiber = compFiber._currentElement._owner;
            }
            return compFiber._instance;
        }
        const GetCompFiber = fiber => {
            let parentFiber = fiber.return;
            while (typeof parentFiber.type == "string") {
                parentFiber = parentFiber.return;
            }
            return parentFiber;
        };
        let compFiber = GetCompFiber(domFiber);
        for (let i = 0; i < traverseUp; i++) {
            compFiber = GetCompFiber(compFiber);
        }
        return compFiber.stateNode;
    }

    function validAnswer(skip = false){
        if(skip){
            let skipBtn = document.querySelector("._1Qh5D._36g4N._2YF0P._2x7Co._3fo6Q")
            skipBtn.click();
            setTimeout(() => {
                let nextBtn = document.querySelector('._1x5JY._1M9iF._36g4N._2YF0P._3DbUj._1EqMR._1lyVV');
                nextBtn.click();
            },100 );
        }else{
            let validBtn = document.querySelector('._1x5JY._1M9iF._36g4N._2YF0P._3DbUj._38g3s._2oGJR')
            validBtn.click();
            setTimeout(() => {
                validBtn.click();
            },100 );
        }
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    function getCookie(name) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');
        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length, cookie.length);
            }
        }
        return "";
    }

    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '20px';
        overlay.style.right = '20px';
        overlay.style.backgroundColor = 'white';
        overlay.style.padding = '15px';
        overlay.style.borderRadius = '20px';
        overlay.style.border = '2px solid black';
        overlay.style.color = 'black';
        overlay.style.zIndex = '9999';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.minWidth = '300px';

        setCookie('autoLeconLancer', 0, 365);

        let count = parseInt(getCookie('nombreDePractices')) || 0;
        let isStart = parseInt(getCookie('autoLeconLancer')) || 0;

        const counter = document.createElement('div');
        counter.classList.add('counter-autoduo');
        counter.textContent = count;
        counter.style.display = 'inline-block';
        counter.style.margin = '0 10px';

        const minusButton = createButton('-', () => updateCount(-1));
        minusButton.classList.add("minusButton-autoduo")
        minusButton.classList.add('autoduo_button');
        minusButton.style.borderRadius = "15px";
        minusButton.style.aspectRatio = "1/1";
        minusButton.style.width = "26px";
        const plusButton = createButton('+', () => updateCount(1));
        plusButton.classList.add("plusButton-autoduo")
        plusButton.classList.add('autoduo_button');
        plusButton.style.borderRadius = "15px";
        const playButton = createButton('Lancer', startAutoPractice);
        playButton.disabled = count === 0 && isStart === 0;
        playButton.style.marginTop = '30px';
        playButton.classList.add('playButton-autoduo');
        playButton.classList.add('autoduo_button');
        playButton.style.padding = "10px 40px";
        playButton.style.borderRadius = "15px";

        const AppName = document.createElement('h2');
        AppName.textContent = `${APPNAME}`;
        AppName.style.color = "black";
        AppName.style.marginBottom = 0;
        const AppAuthor = document.createElement('p');
        AppAuthor.textContent = `Par ${APPAUTHOR}`;
        AppAuthor.fontSize = `90%`;
        AppAuthor.style.marginBottom = "30px";
        const AppVersion = document.createElement('p');
        AppVersion.textContent = `${APPVERSION}`;
        AppVersion.style.fontSize = "80%"
        AppVersion.style.color = "grey"
        AppVersion.style.marginLeft = "10px"
        AppVersion.style.marginBottom = 0;

        const AppInfo = document.createElement('div');
        AppInfo.style.display = "flex"
        AppInfo.appendChild(AppName)
        AppInfo.appendChild(AppVersion)

        const counterDiv = document.createElement('div');
        const counterText = document.createElement('p');
        counterText.textContent = `Nbr. de leçon:`;
        counterText.style.fontSize = '18px';
        counterText.style.marginBottom = '8px';
        counterText.style.color = 'grey';
        counterText.style.fontSize = "90%"
        counterDiv.appendChild(minusButton);
        counterDiv.appendChild(counter);
        counterDiv.appendChild(plusButton);
        overlay.appendChild(AppInfo)
        overlay.appendChild(AppAuthor)
        overlay.appendChild(counterText)
        overlay.appendChild(counterDiv);
        overlay.appendChild(playButton);

        document.body.appendChild(overlay);
        IS_BTN_CREATE = true;
    }

    function updateCount(change) {
        let count = parseInt(getCookie('nombreDePractices')) || 0;
        let isStart = parseInt(getCookie('autoLeconLancer')) || 0;
        count = Math.max(0, count + change);
        setCookie('nombreDePractices', count, 365);
        let page = window.location.pathname;
        if(page==='/learn'){
            let counter = document.querySelector('.counter-autoduo')
            let playButton = document.querySelector('.playButton-autoduo')
            counter.textContent = count;
            playButton.disabled = count === 0 && isStart === 0;
        }
    }

    function startAutoPractice() {
        let count = parseInt(getCookie('nombreDePractices')) || 0;
        let isStart = parseInt(getCookie('autoLeconLancer')) || 0;
        let playButton = document.querySelector('.playButton-autoduo')
        let plusButton = document.querySelector('.plusButton-autoduo')
        let minusButton = document.querySelector('.minusButton-autoduo')

        if(isStart === 0){
            if (count > 0) {
                playButton.textContent = "..."
                plusButton.disabled = true;
                minusButton.disabled = true;
                setCookie('autoLeconLancer', 1, 365);
                runAutoPractice(count);
            }
        } else {
            setCookie('autoLeconLancer', 0, 365);
            plusButton.disabled = false;
            minusButton.disabled = false;
            playButton.disabled = count === 0;
            playButton.textContent = "Lancer"
        }
    }

    function runAutoPractice() {
        if (getCookie('nombreDePractices') <= 0 || getCookie('autoLeconLancer') === '0') {
            setCookie('autoLeconLancer', 0, 365);
            window.location.href = 'https://www.duolingo.com/learn';
            return;
        }

        window.location.href = 'https://www.duolingo.com/practice';
    }

    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        button.style.margin = '0 5px';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        return button;
    }

    function solve(){
        const data = findReact(document.getElementsByClassName(FINDREACT_CLASSNAME)[0]).props.currentChallenge;
        if(lastOne === data.id){
            const validBtn = document.querySelector('._1x5JY._1M9iF._36g4N._2YF0P._3DbUj._38g3s._2oGJR')
            validBtn.click();
        }else{
            lastOne = data.id;
            GM_log(data)
            if(data.type === "assist" || data.type === "readComprehension" || data.type === "dialogue"){
                document.getElementsByClassName('-XCTI _1VWfn ufykF')[data.correctIndex].click()
                validAnswer()
            }else if(data.type === "name"){
                const inputElement = document.querySelector('.gWidz._3zGeZ._394fY.RpiVp');

                function simulateDetailedInput(inputElement, text) {
                    inputElement.focus();

                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

                    for (let i = 0; i < text.length; i++) {
                        const char = text[i];

                        const keydownEvent = new KeyboardEvent('keydown', { key: char, bubbles: true });
                        inputElement.dispatchEvent(keydownEvent);

                        nativeInputValueSetter.call(inputElement, inputElement.value + char);

                        const syntheticEvent = new Event('input', { bubbles: true });
                        syntheticEvent.simulated = true;
                        inputElement.dispatchEvent(syntheticEvent);

                        const keyupEvent = new KeyboardEvent('keyup', { key: char, bubbles: true });
                        inputElement.dispatchEvent(keyupEvent);
                    }

                    const changeEvent = new Event('change', { bubbles: true });
                    changeEvent.simulated = true;
                    inputElement.dispatchEvent(changeEvent);

                    inputElement.blur();
                }

                simulateDetailedInput(inputElement, data.correctSolutions[0])
                validAnswer()
            }else if(data.type === "translate"){
                if(data.choices.length === 0){
                    const inputElement = document.querySelector('._2OQj6._3zGeZ._394fY.RpiVp');

                    function simulateDetailedTextareaInput(textareaElement, text) {
                        textareaElement.focus();

                        const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;

                        for (let i = 0; i < text.length; i++) {
                            const char = text[i];

                            const keydownEvent = new KeyboardEvent('keydown', {
                                key: char,
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            });
                            textareaElement.dispatchEvent(keydownEvent);

                            nativeTextareaValueSetter.call(textareaElement, textareaElement.value + char);

                            const inputEvent = new InputEvent('input', {
                                bubbles: true,
                                cancelable: true,
                                composed: true,
                                data: char,
                                inputType: 'insertText'
                            });
                            textareaElement.dispatchEvent(inputEvent);

                            const keyupEvent = new KeyboardEvent('keyup', {
                                key: char,
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            });
                            textareaElement.dispatchEvent(keyupEvent);
                        }

                        const changeEvent = new Event('change', {
                            bubbles: true,
                            cancelable: true,
                            composed: true
                        });
                        textareaElement.dispatchEvent(changeEvent);

                        textareaElement.blur();
                    }
                    simulateDetailedTextareaInput(inputElement, data.correctSolutions[0]);
                    validAnswer()
                }else{
                    var choicesLen = document.getElementsByClassName('_1uV0Q _DVHp').length;
                    var choices = [];
                    for(let i = 0; i < choicesLen; i++){
                        choices.push(document.getElementsByClassName('_1uV0Q _DVHp')[i].firstChild.firstChild.lastChild.firstChild.textContent)
                    }
                    var indexToClick = [];
                    let j = 0;
                    for(let i = 0; i < data.correctTokens.length; i++){
                        j = 0;
                        while(data.correctTokens[i] != choices[j]){
                            j++;
                        }
                        choices[j] = 0;
                        indexToClick.push(j)
                    }
                    var choicesClick = document.querySelector('.eSgkc')
                    for(let i = 0; i < indexToClick.length; i++){
                        choicesClick.children[indexToClick[i]].firstChild.firstChild.click()
                    }
                    validAnswer()
                }
            }else if(data.type === "completeReverseTranslation"){
                let correct = data.displayTokens
                const spanElement = document.querySelector('._3uFQ7._2mrQw.RpiVp')
                function simulateDetailedInput(inputElement, text) {
                    inputElement.focus();

                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;

                    for (let i = 0; i < text.length; i++) {
                        const char = text[i];

                        const keydownEvent = new KeyboardEvent('keydown', { key: char, bubbles: true });
                        inputElement.dispatchEvent(keydownEvent);

                        nativeInputValueSetter.call(inputElement, inputElement.value + char);

                        const syntheticEvent = new Event('input', { bubbles: true });
                        syntheticEvent.simulated = true;
                        inputElement.dispatchEvent(syntheticEvent);

                        const keyupEvent = new KeyboardEvent('keyup', { key: char, bubbles: true });
                        inputElement.dispatchEvent(keyupEvent);
                    }

                    const changeEvent = new Event('change', { bubbles: true });
                    changeEvent.simulated = true;
                    inputElement.dispatchEvent(changeEvent);

                    inputElement.blur();
                }
                for(let i = 0; i < correct.length; i++){
                    if(correct[i].isBlank){
                        simulateDetailedInput(spanElement.children[i].lastChild, correct[i].text)
                    }
                }
                validAnswer()
            }else{
                validAnswer(true);
                GM_log('Mode pas ou pas encore pris en charge')
            }
        }
    }

    function addButton() {
        try {
            const parentElement = document.querySelector('.MYehf');
            const button = document.createElement('button');
            button.textContent = 'Résoudre';
            button.addEventListener('click', solve);
            button.style.marginLeft = "20px";
            button.style.marginTop = "1px";
            button.style.marginBottom = "-1px";
            button.style.border = "2px solid black";
            button.style.borderRadius = "15px";
            button.style.padding = "0 25px";
            button.style.backgroundColor = "pink";
            button.style.transition = "background 0.15s";

            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = "#ff869b";
                button.style.cursor = "pointer";
            });

            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = "pink";
                button.style.cursor = "pointer";
            });

            parentElement.style.display = "flex"
            parentElement.appendChild(button)
            IS_BTN_CREATE = true
        }catch(e){
            GM_log("En attente de création des boutons...")
        }
    }

    function createInAutoOverlay(remainingLessons){
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '50%';
        overlay.style.left = '50%';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.transform = 'translate(-50%, -50%)';
        overlay.style.backgroundColor = 'pink';
        overlay.style.color = 'black';
        overlay.style.padding = '50px';
        overlay.style.borderRadius = '25px';
        overlay.style.zIndex = '9999';
        overlay.style.textAlign = 'center';
        overlay.style.border = '2px solid black';
        overlay.style.minWidth = '700px';
        overlay.style.maxWidth = '90%';
        overlay.style.minHeight = '400px';
        overlay.style.maxHeight = '90%';

        const title = document.createElement('h1');
        title.textContent = 'AutoDuo travail !';
        title.style.marginBottom = '10px';
        title.style.fontSize = '24px';

        const lessonCount = document.createElement('p');
        lessonCount.textContent = `Leçon(s) restante(s) : ${remainingLessons}`;
        lessonCount.style.fontSize = '18px';
        lessonCount.style.marginBottom = '0';

        overlay.appendChild(title);
        overlay.appendChild(lessonCount);

        document.body.appendChild(overlay);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addButton);
    } else {
        let page = window.location.pathname;
        setInterval(() => {
            let newPage = window.location.pathname;
            if(page!==newPage){
                page = newPage;
                IS_BTN_CREATE = false;
                const overlay = document.querySelector('div[style*="position: fixed"][style*="bottom: 20px"][style*="right: 20px"]');
                if (overlay) {
                    overlay.remove();
                }
            }
            if(page === "/practice"){
                if(!IS_BTN_CREATE){
                    addButton()
                }
                if(getCookie('autoLeconLancer') === '1'){
                    if(!solverStart){
                        createInAutoOverlay((parseInt(getCookie('nombreDePractices')) || 0));
                        solverStart = true;
                        const solveInterval = setInterval(() => {
                            try {
                                let endButton = document.querySelector('button[data-test="player-practice-again"]');
                                if (endButton) {
                                    clearInterval(solveInterval);
                                    updateCount(-1);
                                    runAutoPractice()
                                }else{
                                    solve();
                                }
                            } catch (e) {
                                console.log("Automatisation en attente...");
                            }
                        }, 1000);
                    }
                }
            }
            if(page === "/learn"){
                if(!IS_BTN_CREATE){
                    createOverlay()
                }
            }
            if(page === "/lesson"){
                try{
                    if(!IS_BTN_CREATE){
                        const pathelement = document.querySelector('._3GuWo._1cTBC._1QQhE')
                        pathelement.children[1]
                        addButton()
                    }
                }catch{
                    const startBtn = document.querySelector('._1x5JY._1M9iF._36g4N._2YF0P._3DbUj._38g3s._2oGJR')
                    startBtn.click()
                }
            }
        }, 500);
    }

    GM_log("Injection réussie !");
})();