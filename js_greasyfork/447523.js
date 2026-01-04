// ==UserScript==
// @name            wiChat
// @version         2.2.9
// @author          duma kalinichenko
// @namespace       https://web-industry.pro/
// @description     This userscript does wonderful things
// @match           https://web-industry.planfix.com/*
// @downloadURL https://update.greasyfork.org/scripts/447523/wiChat.user.js
// @updateURL https://update.greasyfork.org/scripts/447523/wiChat.meta.js
// ==/UserScript==

'use strict';

(function () {

    if (!document.wiChatConfig) return false;

    const version = '2.2.9';

    const lkUrl = document.wiChatConfig.lkUrl;
    const authKey = document.wiChatConfig.authKey;

    initObserver();


    function initObserver() {
        const observerConfig = {childList: true, subtree: true};
        const observer = new MutationObserver(hangFruit);
        let mainNode = document.querySelector('.task-card-wrapper');
        if (mainNode) observer.observe(mainNode, observerConfig)

        const bodyObserver = new MutationObserver(function () {
            let newMainNode = document.querySelector('.task-card-wrapper');
            if (mainNode != newMainNode) {
                mainNode = newMainNode;
                observer.disconnect();
                if (mainNode) observer.observe(mainNode, observerConfig);
            }
        });
        bodyObserver.observe(document.body, observerConfig);
    }


    async function hangFruit() {

        let mainNode = document.querySelector('.task-card-wrapper');

        let taskIdNode = document.querySelector('.title-container .favorite-item[data-taskid]');
        if (!taskIdNode) return;
        let taskId = taskIdNode.dataset.taskid;

        let userAvatar = document.querySelector('.main-menu-logined .user-avatar-img');
        if (!userAvatar) return;
        let userAvatarLink = userAvatar.getAttribute('src');
        let userId = userAvatarLink.match(/&id=(\d+)/)[1];
        let userName = userAvatar.getAttribute('title');

        let check = mainNode.dataset.check;

        if (check === undefined) {
            mainNode.dataset.check = 'false';
            do {
                check = await checkShowButtons(userId, taskId);
                await new Promise(resolve => setTimeout(resolve, 1000));
            } while (check === undefined);
            mainNode.dataset.check = check;
        }

        if (check == 'false') return;

        let fields = [];
        let fieldResult = mainNode.querySelector('.task-card-data-custom-59884');
        let fieldLastComment = mainNode.querySelector('.task-card-data-custom-60144');
        if (fieldResult) fields.push(fieldResult);
        if (fieldLastComment) fields.push(fieldLastComment);

        fields.forEach(node => {
            if (node.dataset.processed == 'processed') return true;
            node.dataset.processed = 'processed';
            let textNode = node.querySelector('.task-card-data-custom-value-text');
            let fruitBtn = makeFruitBtn({
                'module': 'Chat',
                'controller': 'Fruit',
                'action': 'textToChat',
                'taskId': taskId,
                'userId': userId,
                'userName': userName
            }, textNode);
            node.style.position = 'relative';
            node.prepend(fruitBtn);
        });

        let actions = mainNode.querySelectorAll('.actions-item-v2[data-iseditable="1"]');

        for (let action of actions) {
            if (action.dataset.processed == 'processed') continue;
            action.dataset.processed = 'processed';

            let actionsItem = action.querySelector('.actions-item-v2-normal');
            if (actionsItem.classList.contains('actions-item-v2-normal-my')) {
                let actionId = action.getAttribute('actionid')
                let fruitBtn = makeFruitBtn({
                    'module': 'Chat',
                    'controller': 'Fruit',
                    'action': 'commentToChat',
                    'actionId': actionId,
                    'userId': userId,
                    'userName': userName
                });
                let bubble = actionsItem.querySelector('.actions-item-v2-normal-bubble');
                bubble.prepend(fruitBtn);
                continue;
            }

            let alertService = action.querySelector('[href="/user/26"]');
            if (alertService !== null) {
                let actionId = action.getAttribute('actionid')
                let fruitBtn = makeFruitBtn({
                    'module': 'Chat',
                    'controller': 'Fruit',
                    'action': 'commentToChat',
                    'actionId': actionId,
                    'userId': userId,
                    'userName': userName
                });
                let bubble = actionsItem.querySelector('.actions-item-v2-normal-bubble');
                bubble.prepend(fruitBtn);
            }
        }
    }


    function checkShowButtons(userId, taskId) {
        return fetch(lkUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'auth': authKey
            },
            body: JSON.stringify({
                'module': 'Chat',
                'controller': 'Fruit',
                'action': 'checkShowButtonsSendFrom',
                'user_id': userId,
                'task_id': taskId,
                'location': window.location.href,
                'version': version
            })
        }).then(async response => {
            let answer = await response.json();
            return String(answer === true);
        }).catch(() => {
            return undefined;
        });
    }


    function makeFruitBtn(body, textNode = null) {
        const fruitBtn = document.createElement('div');
        fruitBtn.id = 'fruitBtn';
        fruitBtn.title = 'Отправить комментарий клиенту в wiChat';
        fruitBtn.style.cssText = 'position:absolute;top:2px;left:4px;z-index:999;width:24px;height:24px;text-align:center;cursor:pointer;';
        fruitBtn.innerHTML = getFruitSvg();

        fruitBtn.addEventListener('click', event => {
            event.stopPropagation();
            if (!confirm('Отправить комментарий клиенту в wiChat?')) return;

            if (textNode) body.text = textNode.innerHTML;

            body.location = window.location.href;
            body.version = version;

            let bodyString = JSON.stringify(body);

            fetch(lkUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'auth': authKey
                },
                body: bodyString
            }).then(async response => {
                let answer = await response.json();
                if (answer === true) {
                    alert('Сообщение отправлено!');
                } else {
                    alert('Что-то пошло не так!');
                }
            }).catch(() => {
                alert('Что-то пошло не так!');
            });
        });

        return fruitBtn;
    }


    function getFruitSvg() {
        return '<svg xmlns="http://www.w3.org/2000/svg" style="max-width:100%;max-height:100%" viewBox="0 0 22.578 22.578"><g stroke-width=".796"><path fill="#349951" d="M-48.34 254.883c-.2.608-.399 1.18-.701 1.576-.302.396-.683.64-1.383.643-.29.002-.366.4-.097.51l2.152.87a.265.265 0 0 0 .306-.08c.453-.574.712-1.095.74-1.668.03-.572-.164-1.16-.529-1.888a.265.265 0 0 0-.488.037z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#349951" d="M-46.664 257.4c-.573.032-1.096.29-1.664.735a.265.265 0 0 0-.084.306l.869 2.15a.265.265 0 0 0 .51-.099c.003-.7.246-1.078.642-1.38.397-.303.97-.5 1.579-.702a.265.265 0 0 0 .035-.488c-.725-.362-1.314-.553-1.887-.522z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#26783f" d="M-46.664 257.4c-.573.032-1.096.29-1.664.735a.265.265 0 0 0-.084.307l.088.218c.567-.442 1.088-.7 1.66-.73.556-.03 1.127.148 1.823.49a.265.265 0 0 0 .064-.499c-.615-.327-1.17-.521-1.887-.52z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#349951" d="M-60.225 253.752a.265.265 0 0 0-.203.24c-.087 1.367.11 2.882 1.051 3.951a.265.265 0 0 0 .078.061l.944.484a.265.265 0 0 0 .382-.209l.221-2.193a.265.265 0 0 0-.16-.27l-.89-.38a8.38 8.38 0 0 1-1.134-1.559.265.265 0 0 0-.289-.125z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#349951" d="M-58.219 251.201a.265.265 0 0 0-.263.18c-.284.847-.796 2.06-.354 3.402a.265.265 0 0 0 .04.076l.567.756a.265.265 0 0 0 .416.01l1.125-1.37a.265.265 0 0 0 0-.335l-.578-.705a7.358 7.358 0 0 1-.709-1.812.265.265 0 0 0-.244-.202zm5.852 0a.265.265 0 0 0-.244.201 7.346 7.346 0 0 1-.703 1.797l-.473.45a.265.265 0 0 0-.053.312l.74 1.451a.265.265 0 0 0 .385.1l.863-.594a.265.265 0 0 0 .102-.135c.442-1.341-.07-2.555-.354-3.402a.265.265 0 0 0-.263-.18z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#26783f" d="m-53.315 253.2-.472.449a.265.265 0 0 0-.053.312l.74 1.451a.265.265 0 0 0 .385.1l.145-.1-.74-1.451a.265.265 0 0 1 .052-.312l.473-.45c.297-.548.54-1.132.697-1.773l-.015-.045c-.124-.298-.464-.208-.508.021a7.727 7.727 0 0 1-.704 1.797zm-5.533 4.744c-.847-1.216-1.193-2.733-1.044-3.993l-.043-.074c-.135-.21-.463-.167-.493.116-.064 1.96.287 3.214 1.13 4.011zm.541-3.16c-.434-1.319.052-2.512.338-3.357a.263.263 0 0 0-.25-.226.272.272 0 0 0-.263.18c-.284.847-.796 2.06-.354 3.402z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#cf113f" d="M-52.323 260.767c1.195-1.247 1.789-3.233.804-5.603v-.001a5.54 5.54 0 0 0-1.31-1.921c-.494-.497-.59-.937-.524-1.431.066-.495.33-1.04.619-1.612.123-.314-.13-.437-.44-.328-.984.344-1.604.79-1.935 1.496a2.896 2.896 0 0 0-.12.299 2.909 2.909 0 0 0-.113-.285c-.332-.72-.963-1.174-1.97-1.522-.102-.051-.194-.023-.293-.015a.265.265 0 0 0-.118.355c.288.573.553 1.117.62 1.612.066.49-.03.927-.512 1.42-1.05.915-1.717 2.403-1.717 4.076 0 1.824.793 3.43 2.011 4.31 1.642.96 4.01.138 4.998-.85z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#b21134" d="M10.427 7.875c-1.309 1.153-2.611 2.721-2.81 4.711-.844 1.11-1.37 2.38-1.534 3.638 3.453 1.35 8.618-2.38 6.688-8.004a6.614 6.614 0 0 0-.684.554c.038-1.175-.882-1.522-1.66-.899z"/><path fill="#349951" d="M-52.852 255.736c-1.051.926-2.044 2.146-2.087 3.621a.265.265 0 0 0 .04.149l.249.394c.081.13.257.164.38.073l1.645-1.205a.265.265 0 0 0 .098-.287l-.16-.555a8.51 8.51 0 0 1 .265-1.924c.052-.309-.254-.39-.43-.266z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#26783f" d="M-54.41 259.357c.042-1.424.968-2.609 1.978-3.522-.097-.212-.304-.19-.42-.099-1.051.926-2.044 2.146-2.087 3.621z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#349951" d="M-49.408 255.258a.265.265 0 0 0-.22.008c-.8.398-2.02.893-2.655 2.154a.265.265 0 0 0 .262.383l1.724-.178a.265.265 0 0 0 .227-.19c.18-.616.43-1.214.785-1.794a.265.265 0 0 0-.123-.383zm3.463 7.221c-.691.184-1.314.29-1.948.308a.265.265 0 0 0-.197.096l-1.347 1.642a.265.265 0 0 0 .22.432c1.421-.09 2.633-1.02 3.537-2.049a.265.265 0 0 0-.265-.43zm.361-3.137a7.353 7.353 0 0 1-1.795.785.265.265 0 0 0-.19.226l-.177 1.725a.265.265 0 0 0 .383.262c1.261-.636 1.755-1.855 2.154-2.654.006-.356-.101-.39-.375-.344z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#b21134" d="M-57.723 250.2c.288.571.553 1.116.62 1.61.066.49-.03.928-.512 1.42-1.05.916-1.717 2.404-1.717 4.077 0 2.49 1.481 5.024 4.123 4.865-2.385-.284-3.594-2.3-3.594-4.865 0-1.673.667-3.161 1.717-4.077.482-.492.578-.93.512-1.42-.067-.494-.332-1.039-.62-1.61a.265.265 0 0 1 .034-.286c-.573-.268-.633.133-.563.285z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#26783f" d="M-49.629 255.266c-.8.398-2.018.892-2.654 2.154a.265.265 0 0 0 .261.383l.367-.038a.265.265 0 0 1-.099-.345c.588-1.166 1.673-1.676 2.466-2.061-.078-.132-.237-.145-.341-.093zm-.363 2.344c-.268-.108-.191-.506.097-.509.7-.003 1.08-.246 1.383-.642.298-.39.494-.951.692-1.55l-.031-.064a.265.265 0 0 0-.489.038c-.2.608-.399 1.18-.7 1.576-.303.396-.684.64-1.384.643-.289.003-.365.4-.097.51zm4.046 4.868c-.69.185-1.313.291-1.947.309a.265.265 0 0 0-.197.095l-1.347 1.643a.265.265 0 0 0 .098.409l1.249-1.522a.265.265 0 0 1 .197-.096c.634-.018 1.257-.124 1.947-.309a.265.265 0 0 1 .167.012l.1-.111c.192-.222-.056-.5-.267-.43zm.362-3.136a7.354 7.354 0 0 1-1.795.785.265.265 0 0 0-.19.227l-.177 1.724a.265.265 0 0 0 .038.162l.14-1.357a.265.265 0 0 1 .189-.227 7.354 7.354 0 0 0 1.795-.785c.115-.074.203-.04.282.003l.093-.188c.136-.289-.207-.474-.375-.344z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#cf113f" d="M-51.146 257.107c-1.166.123-2.374.692-3.344 1.663-1.94 1.94-2.27 4.823-.653 6.44 1.619 1.62 4.503 1.29 6.444-.651 1.94-1.941 2.27-4.824.652-6.442-.809-.809-1.934-1.132-3.1-1.01z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#f0517a" d="M-51.273 258.285c-.865.09-1.76.511-2.475 1.227-1.431 1.43-1.682 3.57-.473 4.779 1.21 1.209 3.348.957 4.78-.475 1.43-1.43 1.681-3.57.472-4.779-.604-.604-1.44-.842-2.304-.752z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path fill="#ececec" d="M-51.242 258.814c.73-.08 1.421.12 1.9.598.958.958.794 2.763-.474 4.031-1.268 1.268-3.074 1.431-4.032.473-.958-.958-.793-2.763.475-4.031.634-.634 1.401-.99 2.13-1.07z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/><path d="M-193.205-77.715a1 1 0 1 0 1.408 0c-.405-.384-1.055-.338-1.408 0zm-1.42 5.656c-.398-.382-1.025-.35-1.408 0a1 1 0 1 0 1.41 0zm-7.063.002a1 1 0 1 0 1.408 0 1.025 1.025 0 0 0-1.408 0zm12.725 1.413a1 1 0 1 0 1.41 0c-.461-.399-1.036-.357-1.41 0zm-11.312 5.656a1 1 0 1 0 1.408 0 1.012 1.012 0 0 0-1.408 0zm7.07 1.414a1 1 0 1 0 1.414 1.416 1 1 0 0 0-.004-1.416h-.002c-.414-.383-1.03-.34-1.408 0z" color="#000" transform="translate(77.318 38.98) scale(.33253)"/><path fill="#349951" d="M-53.99 254.168c-.269.402-.468.737-.631.998a.265.265 0 0 0 .084.365.265.265 0 0 0 .363-.086c.098-.155.24-.375.363-.572.052.116.114.23.155.352a.265.265 0 0 0 .502-.168c-.107-.32-.247-.597-.38-.862-.098-.203-.365-.15-.456-.027zm-2.842-.119a.265.265 0 0 0-.22.146c-.265.53-.557 1.118-.557 1.971a.265.265 0 0 0 .263.264.265.265 0 0 0 .266-.264c0-.516.19-.852.351-1.219.105.167.232.363.317.498a.265.265 0 0 0 .365.086.265.265 0 0 0 .084-.365c-.163-.261-.364-.596-.633-.998a.265.265 0 0 0-.236-.12zm-.727 3.189a.265.265 0 0 0-.173.198c-.119.58-.25 1.223-.03 2.046a.265.265 0 0 0 .324.188.265.265 0 0 0 .188-.324c-.134-.499-.035-.872.025-1.268l.434.4a.265.265 0 0 0 .375-.013.265.265 0 0 0-.014-.373c-.225-.21-.505-.484-.869-.803a.265.265 0 0 0-.26-.05z" color="#000" transform="translate(77.318 -313.013) scale(1.25682)"/></g></svg>';
    }

})();