// ==UserScript==
// @name         7Speaking Enhanced Bot
// @namespace    https://github.com/pdelagrange
// @version      1.7
// @description  Automatize 7speaking with GUI
// @author       pdelagrange
// @match        https://user.7speaking.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/488089/7Speaking%20Enhanced%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/488089/7Speaking%20Enhanced%20Bot.meta.js
// ==/UserScript==


//TO FIX: https://user.7speaking.com/quiz/kds/33/0/2
// document.querySelector('.question-container').__reactInternalInstance$oalysof46k.memoizedProps.children[5].props.children[0].props.children.props.answerOptions.answer


(async () => {
    const closeSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">\n' +
        '          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7071 1.70711C14.0976 1.31658 14.0976 0.683417 13.7071 0.292893C13.3166 -0.0976311 12.6834 -0.0976311 12.2929 0.292893L7 5.58579L1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L5.58579 7L0.292893 12.2929C-0.0976311 12.6834 -0.0976311 13.3166 0.292893 13.7071C0.683417 14.0976 1.31658 14.0976 1.70711 13.7071L7 8.41421L12.2929 13.7071C12.6834 14.0976 13.3166 14.0976 13.7071 13.7071C14.0976 13.3166 14.0976 12.6834 13.7071 12.2929L8.41421 7L13.7071 1.70711Z" fill="black" />\n' +
        '        </svg>';

    const botSvg = '<svg width="50px" height="50px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M14 2C14 2.74028 13.5978 3.38663 13 3.73244V4H20C21.6569 4 23 5.34315 23 7V19C23 20.6569 21.6569 22 20 22H4C2.34315 22 1 20.6569 1 19V7C1 5.34315 2.34315 4 4 4H11V3.73244C10.4022 3.38663 10 2.74028 10 2C10 0.895431 10.8954 0 12 0C13.1046 0 14 0.895431 14 2ZM4 6H11H13H20C20.5523 6 21 6.44772 21 7V19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19V7C3 6.44772 3.44772 6 4 6ZM15 11.5C15 10.6716 15.6716 10 16.5 10C17.3284 10 18 10.6716 18 11.5C18 12.3284 17.3284 13 16.5 13C15.6716 13 15 12.3284 15 11.5ZM16.5 8C14.567 8 13 9.567 13 11.5C13 13.433 14.567 15 16.5 15C18.433 15 20 13.433 20 11.5C20 9.567 18.433 8 16.5 8ZM7.5 10C6.67157 10 6 10.6716 6 11.5C6 12.3284 6.67157 13 7.5 13C8.32843 13 9 12.3284 9 11.5C9 10.6716 8.32843 10 7.5 10ZM4 11.5C4 9.567 5.567 8 7.5 8C9.433 8 11 9.567 11 11.5C11 13.433 9.433 15 7.5 15C5.567 15 4 13.433 4 11.5ZM10.8944 16.5528C10.6474 16.0588 10.0468 15.8586 9.55279 16.1056C9.05881 16.3526 8.85858 16.9532 9.10557 17.4472C9.68052 18.5971 10.9822 19 12 19C13.0178 19 14.3195 18.5971 14.8944 17.4472C15.1414 16.9532 14.9412 16.3526 14.4472 16.1056C13.9532 15.8586 13.3526 16.0588 13.1056 16.5528C13.0139 16.7362 12.6488 17 12 17C11.3512 17 10.9861 16.7362 10.8944 16.5528Z" fill="#000000"/>\n' +
        '</svg>';
    ////////////////////////
    ////      GUI        ///
    ////////////////////////


    async function addFixedButton() {
        const button = document.createElement('div');
        button.innerHTML = botSvg;
        button.style.position = 'fixed';
        button.style.width = '50px';
        button.style.height = '50px';
        button.style.top = '0';
        button.style.right = '0';
        button.style.zIndex = '9999999';
        button.style.cursor = 'pointer';
        button.addEventListener('click', () => {
            openGui();
        })
        document.body.insertBefore(button, document.body.lastChild)

    }

    function createTitleContainer() {
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'center';
        titleContainer.style.width = '100%';
        titleContainer.style.justifyContent = 'space-evenly';

        const title = document.createElement('h3');
        title.textContent = "7Speaking Enhanced Bot";
        title.style.margin = '0';
        title.style.fontSize = '18px';


        titleContainer.appendChild(title);
        return titleContainer;
    }

    function createContentContainer() {
        const contentContainer = document.createElement('div');
        contentContainer.style.flex = '2';
        contentContainer.style.display = 'flex';
        contentContainer.style.alignItems = 'center';
        contentContainer.style.flexDirection = 'column';

        const stopButton = document.createElement('button')
        stopButton.style.padding = "10px 20px";
        stopButton.style.fontSize = "16px";
        stopButton.style.cursor = "pointer";
        stopButton.style.background = "#007bff";
        stopButton.style.color = "#FFF";
        stopButton.style.border = "none";
        stopButton.style.borderRadius = "5px";
        stopButton.style.transition = "background-color 0.3s ease";
        stopButton.addEventListener('mouseover', () => {
            stopButton.style.background = "#0056b3"
        });
        stopButton.addEventListener('mouseout', () => {
            stopButton.style.backgroundColor = '#007bff';
        });
        stopButton.addEventListener('click', () => {
            setIsStopped(!getIsStopped());
            stopButton.textContent = getIsStopped() ? "Start" : "Stop";
            if (!getIsStopped()) {
                routes();
            }
        })
        stopButton.textContent = getIsStopped() ? "Start" : "Stop";

        const nbExercise = document.createElement('h3');
        nbExercise.textContent = "Nombre d'exercices terminés: " + getNbExerciseMade();

        const closeButton = document.createElement('div');
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.innerHTML = closeSvg;
        closeButton.addEventListener('click', () => {
            closeGui();
        })


        contentContainer.appendChild(nbExercise);
        contentContainer.appendChild(closeButton);
        contentContainer.appendChild(stopButton);

        return contentContainer;
    }

    function closeGui() {
        document.body.firstChild.remove();
    }

    function openGui() {
        const container = document.createElement('div');
        container.style.width = '300px';
        container.style.padding = '1rem 0';
        container.style.background = "#ffffff";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.flexDirection = "column";
        container.style.borderRadius = "0.5em";
        container.style.boxShadow = "0 10px 20px rgba(black, 0.2)";
        container.style.position = 'relative';


        const bodyCopy = document.createElement('div');
        bodyCopy.style.position = "absolute";
        bodyCopy.style.height = "100%";
        bodyCopy.style.width = "100%";
        bodyCopy.style.zIndex = "99999";
        bodyCopy.style.display = "flex";
        bodyCopy.style.alignItems = "center";
        bodyCopy.style.justifyContent = "center";
        bodyCopy.style.backgroundColor = "rgba(0,0,0,0.4)";

        container.appendChild(createTitleContainer());
        container.appendChild(createContentContainer());
        bodyCopy.appendChild(container);
        document.body.insertBefore(bodyCopy, document.body.firstChild);
    }


    ////////////////////////
    ////      UTILS      ///
    ////////////////////////

    function getIsStopped() {
        return GM_getValue("isStopped", true);
    }

    function setIsStopped(value) {
        GM_setValue("isStopped", value);
    }

    function getNbExerciseMade() {
        return GM_getValue("nb", 0);
    }

    function incrNb() {
        const previous = getNbExerciseMade();
        GM_setValue("nb", previous + 1);
    }

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

    function isPath(regex) {
        return regex.test(location.pathname);
    }

    function error(message) {
        alert(message);
        throw new Error(message);
    }

    async function waitForQuerySelector(selector) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const e = document.querySelector(selector);

                if (e) {
                    clearInterval(interval);
                    resolve(e);
                } else {
                    console.log(selector + ' not found, retrying')
                }
            }, 1000);
        });
    }

    function getReactElement(e) {
        for (const key in e) {
            if (key.startsWith('__reactInternalInstance$')) {
                return e[key];
            }
        }
        return null;
    }


    ///////////////////////////////////
    ////      COMPLETION QUIZ      ////
    ///////////////////////////////////
    async function findAnswer() {
        const e = await document.querySelector('.question-container');
        let container = getReactElement(e);
        const answer = container.memoizedProps.children[5].props.children[0].props.children.props.answerOptions.answer[0].value;
        if (answer) {
            return answer;
        } else {
            throw Error("Cannot find answer");
        }
    }

    function getAnswerType() {
        if (document.querySelector('.question__form input')) {
            return 'input';
        } else if (document.querySelector('.answer-container button')) {
            return 'button';
        }
    }

    function responseQuestion(type, answer) {
        switch (type) {
            case 'input':
                const input = getReactElement(document.querySelector('.question__form input'));
                input.memoizedProps.onChange({currentTarget: {value: answer}, isTrusted: true});
                break;
            case 'button':
                const buttons = document.querySelectorAll('.answer-container button');
                for (const button of buttons) {
                    if (button.querySelector('.question__customLabel').innerText.trim() === answer.toString().trim()) {
                        button.click();
                    }
                }
                break;
        }
    }

    async function submitQuestion() {
        const submitButton = document.querySelector('.question__form button[type=submit]');
        if (submitButton) {
            submitButton.click();
            await wait(200);
            submitButton.click();
        } else {
            throw new Error("Cannot find submit button");
        }
    }

    function quizIsFinished() {
        return !document.querySelector('.question-container');
    }


    async function completeQuiz() {
        await waitForQuerySelector('.question-container');

        while (!quizIsFinished()) {
            const answer = await findAnswer();
            const type = getAnswerType();
            responseQuestion(type, answer);
            await submitQuestion();
        }
        incrNb();
        const finishButton = await waitForQuerySelector('.button.more.back');
        finishButton.click();
        routes();
    }


    async function routes() {
        if (getIsStopped()) {
            return;
        }
        if (isPath(/^\/user\/progress/)) {
            // Click on the show more button
            const button = await waitForQuerySelector('.ShowMore-button.MuiChip-clickable');
            button.click();
            const items = document.querySelectorAll('.barChart-container.showMoreList .barChart-item')
            items.forEach(item => {
                const note = item.querySelector('.barChart-graph .barChart__values .barChart__vCurrent').textContent;

                if (note !== "5.0") {
                    const title = item.querySelector('.barChart_theme').textContent;
                    console.log('note de', title, ':', note);
                    console.log('Focus sur', title);

                    item.querySelector('.barChart__bottom .quiz__btn').click();
                    routes();
                }
            })
            // In case he has 5.0 everywhere, we go to the first one
            items[0].querySelector('.barChart__bottom .quiz__btn').click();
            await routes();
        } else if (isPath(/^\/quiz/)) {
            completeQuiz();
        } else {
            await wait(200);
            location.href = "/user/progress";
            await routes();
        }
    }


    function initProgram() {
        addFixedButton();
        routes();
    }


    // Handle when document is ready to start the script with routes method.
    if (document.readyState === 'complete') {
        initProgram();
    } else {
        window.addEventListener('load', async () => {
            initProgram();
        });
    }
})();
