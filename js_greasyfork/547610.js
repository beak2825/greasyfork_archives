// ==UserScript==
// @name         WSEC
// @namespace    http://tampermonkey.net/
// @version      12324.0.242132
// @description  for friends - rewrite 1. do not share please.
// @author       Buage
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547610/WSEC.user.js
// @updateURL https://update.greasyfork.org/scripts/547610/WSEC.meta.js
// ==/UserScript==
// https://files.buage.dev/files/WSEC.zip
// Content.js - Script d'injection pour le contenu des pages
// Ajouter au début du fichier avec les autres styles

if (!window.location.href.includes("i-manuel.fr")) return;

(() => {
    // Bloque fetch vers BBMUrl et Interaction.aspx
    const oFetch = window.fetch;
    window.fetch = (...a) => a[0]?.match(/(Interaction\.aspx|BBMUrl)/i) ? Promise.reject("blocked") : oFetch(...a);

    // Bloque XHR classiques
    const oXHR = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        if(url.match(/(Interaction\.aspx|BBMUrl)/i)) return; // bloque
        return oXHR.call(this, method, url, ...rest);
    };
})();

let heartbeatInterval = 15;
let currentUsername = "Utilisateur WSEC";

function sendMessage(message) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        const messageData = {
            message: message,
            username: currentUsername,
            timestamp: Date.now()
        };
        ws.send(JSON.stringify(messageData));
    } else {
        console.error("WebSocket non connecté");
    }
}

function sendHeartbeat() {
    if (ws && ws.readyState === WebSocket.OPEN) {
        const heartbeatData = {
            type: "heartbeat",
            timestamp: Date.now()
        };

        ws.send(JSON.stringify(heartbeatData));
    }
}

function startHeartbeat() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
    }

    heartbeatInterval = setInterval(sendHeartbeat, 15000);
    sendHeartbeat();
}

function stopHeartbeat() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}

ws = new WebSocket('wss://wsec-ws.buage.dev/ws');
ws.onopen = function() {
    startHeartbeat();
};

ws.onmessage = function(event) {
    const data = JSON.parse(event.data);

    if (data.questionContent) {
        createResponseToast(data.questionContent, data.message, data.ai || false, data.iconUrl || 'https://wsec-api.buage.dev/cdn/lightbulb.png');
    }
};

const style = document.createElement('style');
style.textContent = `
    @keyframes openToast {
        0% {
            transform: scaleX(0.4);
            transform-origin: 100% 100%;
        }

        100% {
            transform: scaleX(1);
            transform-origin: 100% 100%;
        }
    }
`;
document.head.appendChild(style);

function createToast(title, message, iconUrl) {
    const toast = document.createElement('div');
    const toastMeta = document.createElement('div');
    const toastIcon = document.createElement('img')
    const toastTitle = document.createElement('h3');
    const toastMessage = document.createElement('p')
    const closeToastBtn = document.createElement('span');

    closeToastBtn.textContent = '×';
    closeToastBtn.style.cursor = 'pointer';
    closeToastBtn.style.fontSize = '30px'

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'rgba(255, 255, 255, 0.86)';
    toast.style.backdropFilter = 'blur(10px)';
    toast.style.color = '#282828ff';
    toast.style.padding = '20px';
    toast.style.borderRadius = '50px';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    toast.style.zIndex = '10000';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '12px'
    toast.style.maxWidth = '350px';
    toast.style.animation = 'openToast 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0s 1 normal forwards';

    toastIcon.src = iconUrl;
    toastIcon.alt = 'Mistral Icon';
    toastIcon.style.width = '40px';
    toastIcon.style.height = '40px'

    closeToastBtn.addEventListener('click', () => {
        document.body.removeChild(toast);
    })

    toast.appendChild(toastIcon)
    toastMeta.appendChild(toastTitle);
    toastMeta.appendChild(toastMessage)
    toast.appendChild(toastMeta);
    toast.appendChild(closeToastBtn)

    document.body.appendChild(toast);
}

function createResponseToast(question, content, ai, iconUrl) {
    const toast = document.createElement('div');
    const toastContent = document.createElement('div');
    const toastIcon = document.createElement('img')
    const toastQuestion = document.createElement('h4');
    const toastMessage = document.createElement('p')
    const closeToastBtn = document.createElement('span');

    const denyBtn = document.createElement('div');
    const acceptBtn = document.createElement('div');
    const acceptBtnShare = document.createElement('div');

    acceptBtnShare.textContent = 'Partager & Accepter';
    acceptBtnShare.style.padding = '8px 16px';
    acceptBtnShare.style.backgroundColor = '#ff00b7ff';
    acceptBtnShare.style.color = 'white';
    acceptBtnShare.style.border = 'none';
    acceptBtnShare.style.borderRadius = '4px';
    acceptBtnShare.style.cursor = 'pointer';
    acceptBtnShare.style.fontSize = '14px';

    acceptBtn.textContent = 'Accepter';
    acceptBtn.style.padding = '8px 16px';
    acceptBtn.style.backgroundColor = '#4CAF50';
    acceptBtn.style.color = 'white';
    acceptBtn.style.border = 'none';
    acceptBtn.style.borderRadius = '4px';
    acceptBtn.style.cursor = 'pointer';
    acceptBtn.style.fontSize = '14px';

    denyBtn.textContent = 'Refuser';
    denyBtn.style.padding = '8px 16px';
    denyBtn.style.backgroundColor = '#f44336';
    denyBtn.style.color = 'white';
    denyBtn.style.border = 'none';
    denyBtn.style.borderRadius = '4px';
    denyBtn.style.cursor = 'pointer';
    denyBtn.style.fontSize = '14px';

    closeToastBtn.textContent = '×';
    closeToastBtn.style.cursor = 'pointer';
    closeToastBtn.style.fontSize = '30px'
    closeToastBtn.style.position = 'absolute';
    closeToastBtn.style.top = '40px';
    closeToastBtn.style.right = '40px';

    toastQuestion.textContent = question;
    toastQuestion.style.fontWeight = 'bold';
    toastQuestion.style.fontSize = '15px';

    toastMessage.innerHTML = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('<br>');
    toastMessage.style.fontSize = '14px';
    toastMessage.style.whiteSpace = 'pre-wrap';
    toastMessage.style.wordWrap = 'break-word';

    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.backgroundColor = 'rgba(255, 255, 255, 0.86)';
    toast.style.backdropFilter = 'blur(10px)';
    toast.style.color = '#282828ff';
    toast.style.padding = '40px';
    toast.style.borderRadius = '50px';
    toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    toast.style.zIndex = '10000';
    toast.style.display = 'flex';
    toast.style.flexDirection = 'column';
    toast.style.alignItems = 'left';
    toast.style.maxWidth = '400px';
    toast.style.gap = '12px'
    toast.style.animation = 'openToast 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0s 1 normal forwards';

    toastContent.style.display = 'flex';
    toastContent.style.flexDirection = 'column';
    toastContent.style.gap = '10px';

    toastIcon.src = iconUrl;
    toastIcon.alt = `${ai} Icon`;
    toastIcon.style.width = '40px';
    toastIcon.style.height = '40px'

    closeToastBtn.addEventListener('click', () => {
        document.body.removeChild(toast);
    })

    denyBtn.addEventListener('click', () => {
        document.body.removeChild(toast);
    });

    acceptBtn.addEventListener('click', () => {
        fillResponse(question, content);
        document.body.removeChild(toast);
    });

    acceptBtnShare.addEventListener('click', () => {
        fillResponse(question, content);

        const payload = {
            message: content,
            questionContent: question,
            ai: true,
            type: 'text'
        };

        ws.send(JSON.stringify(payload));
        document.body.removeChild(toast);
    });

    toast.appendChild(toastIcon)
    toastContent.appendChild(toastQuestion);
    toastContent.appendChild(toastMessage)
    toast.appendChild(toastContent);
    toast.appendChild(closeToastBtn)

    toast.appendChild(acceptBtnShare);
    toast.appendChild(acceptBtn);
    toast.appendChild(denyBtn);

    document.body.appendChild(toast);
}

function fillResponse(question, content) {
    console.log("Remplissage de la réponse pour:", question);

    const questionElements = document.querySelectorAll(".question-label h4");
    let questionDiv = null;

    questionElements.forEach(element => {
        if (element.textContent.trim() === question) {
            questionDiv = element.closest("div.questions.encart");
        }
    });

    if (!questionDiv) {
        questionElements.forEach(element => {
            const currentQuestion = element.textContent.trim();
            const normalizedQuestion = question.toLowerCase().replace(/\s+/g, ' ').trim();
            const normalizedCurrentQuestion = currentQuestion.toLowerCase().replace(/\s+/g, ' ').trim();

            if (normalizedCurrentQuestion === normalizedQuestion ||
                normalizedCurrentQuestion.includes(normalizedQuestion) ||
                normalizedQuestion.includes(normalizedCurrentQuestion)) {
                questionDiv = element.closest("div.questions.encart");
            }
        });
    }

    if (!questionDiv) {
        console.warn("Question non trouvée:", question);
        return;
    }

    console.log("Div de question trouvée:", questionDiv);

    let iframe = null;
    const editorContainer = questionDiv.querySelector(".editis-answer-textarea");
    if (editorContainer) {
        const textareaElement = editorContainer.querySelector(".editis-answer");
        if (textareaElement && textareaElement.id) {
            const iframeId = `${textareaElement.id}_ifr`;
            iframe = document.getElementById(iframeId);
        }
    }

    if (!iframe) {
        iframe = questionDiv.querySelector("iframe");
    }

    if (iframe) {
        try {
            console.log("Iframe TinyMCE trouvée:", iframe);
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const bodyElement = iframeDoc.body;
            if (bodyElement) {
                let htmlContent = content
                    .split('\n\n')
                    .map(paragraph => {
                        const lines = paragraph.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                        if (lines.length > 1) {
                            return `<p>${lines.join('<br>')}</p>`;
                        } else if (lines.length === 1) {
                            return `<p>${lines[0]}</p>`;
                        }
                        return '';
                    })
                    .filter(p => p.length > 0)
                    .join('');

                bodyElement.innerHTML = htmlContent;

                const textarea = questionDiv.querySelector("textarea.editis-answer");
                if (textarea) {
                    textarea.value = content;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                }

                console.log("Réponse mise à jour via iframe TinyMCE");
            } else {
                console.warn("Body de l'iframe non trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour via iframe:", error);
        }
    } else {
        console.error("Aucun iframe TinyMCE trouvé pour la question:", question);
    }
}

const questions = document.querySelectorAll('.questions.encart');
questions.forEach(div => {
    const toolbar = document.createElement('div');
    const plusBtn = document.createElement('div');
    const sendBtn = document.createElement('div');
    const askBtn = document.createElement('div');

    toolbar.style.position = 'relative';
    toolbar.style.top = '5px';
    toolbar.style.right = '5px';
    toolbar.style.zIndex = '1000';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '5px';
    toolbar.style.opacity = '0.7';
    toolbar.style.filter = "blur(.5px)";

    plusBtn.textContent = '+';
    plusBtn.style.height = '24px';
    plusBtn.style.width = '24px';
    plusBtn.style.fontSize = '16px';
    plusBtn.style.cursor = 'pointer';
    plusBtn.style.background = 'transparent';
    plusBtn.style.border = 'none';

    sendBtn.textContent = '>';
    sendBtn.style.height = '24px';
    sendBtn.style.width = '24px';
    sendBtn.style.fontSize = '16px';
    sendBtn.style.cursor = 'pointer';
    sendBtn.style.background = 'transparent';
    sendBtn.style.border = 'none';

    askBtn.textContent = '?';
    askBtn.style.height = '24px';
    askBtn.style.width = '24px';
    askBtn.style.fontSize = '16px';
    askBtn.style.cursor = 'pointer';
    askBtn.style.background = 'transparent';
    askBtn.style.border = 'none';

    askBtn.addEventListener('click', async () => {

        const questionElement = div.querySelector(".question-label h4");

        if (!questionElement) {
            console.error("Élément de question non trouvé");
            return;
        }

        const allQuestions = Array.from(document.querySelectorAll('.question-label h4'));
        const questionContent = questionElement.textContent.trim();
        const currentIndex = allQuestions.findIndex(q => q.textContent.trim() === questionContent);

        let context = "";

        if (currentIndex > 0) {
            context = allQuestions
                .slice(0, currentIndex)
                .map(q => q.textContent.trim())
                .join(' | ');
        }

        const miseSituEncart = document.querySelector('.encart.miseSitu');
        let miseSituContext = "";
        if (miseSituEncart) {
            miseSituContext = miseSituEncart.textContent.trim();
        }

        createToast('Envoi a Mistral', 'Cela pourrait prendre quelques secondes.', 'https://wsec-api.buage.dev/cdn/mistral.png');

        let fullQuestion = questionContent;
        if (miseSituContext) {
            fullQuestion = `Contexte:\n${miseSituContext}\n\n${fullQuestion}`;
        }
        if (context) {
            fullQuestion = `Questions précédentes: ${context}\n\n${fullQuestion}`;
        }

        const encodedQuestion = encodeURIComponent(fullQuestion);
        const url = `https://wsec-api.buage.dev/askMistral.php?q=${encodedQuestion}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.response) {
                createResponseToast(questionContent, data.response, 'Mistral', 'https://wsec-api.buage.dev/cdn/mistral.png');
            } else {
                createToast('Erreur', 'Pas de réponse reçue', 'https://imgs.search.brave.com/ClxTN7Tj_Vp2XW248OAPRfXTn1TtIaDxRngT8QSbU_M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZWdp/c3RyeS5ucG1taXJy/b3IuY29tL0Bsb2Jl/aHViL2ljb25zLXN0/YXRpYy1wbmcvbGF0/ZXN0L2ZpbGVzL2Rh/cmsvbWlzdHJhbC1j/b2xvci5wbmc');
            }
        } catch (error) {
            console.error('Erreur lors de la requête:', error);
            createToast('Erreur', 'Erreur lors de la requête à Mistral', 'https://imgs.search.brave.com/ClxTN7Tj_Vp2XW248OAPRfXTn1TtIaDxRngT8QSbU_M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZWdp/c3RyeS5ucG1taXJy/b3IuY29tL0Bsb2Jl/aHViL2ljb25zLXN0/YXRpYy1wbmcvbGF0/ZXN0L2ZpbGVzL2Rh/cmsvbWlzdHJhbC1j/b2xvci5wbmc');
        }
    });

    sendBtn.addEventListener('click', () => {
        const questionElement = div.querySelector(".question-label h4");

        if (!questionElement) {
            console.error("Élément de question non trouvé");
            return;
        }

        const questionContent = questionElement.textContent.trim();

        let answerContent = '';
        const editorContainer = div.querySelector(".editis-answer-textarea");

        if (editorContainer) {
            const textareaElement = editorContainer.querySelector(".editis-answer");
            if (textareaElement && textareaElement.id) {
                const iframeId = `${textareaElement.id}_ifr`;
                const iframe = document.getElementById(iframeId);

                if (iframe) {
                    try {
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                        const bodyElement = iframeDoc.body;
                        if (bodyElement) {
                            answerContent = bodyElement.textContent || bodyElement.innerText;
                        }
                    } catch (error) {
                        console.error("Erreur lors de la lecture de l'iframe:", error);
                    }
                }
            }
        }

        if (!answerContent) {
            const textarea = div.querySelector("textarea.editis-answer");
            if (textarea) {
                answerContent = textarea.value;
            }
        }

        if (!answerContent || answerContent.trim().length === 0) {
            createToast('Erreur', 'La réponse est vide', 'https://imgs.search.brave.com/ClxTN7Tj_Vp2XW248OAPRfXTn1TtIaDxRngT8QSbU_M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZWdp/c3RyeS5ucG1taXJy/b3IuY29tL0Bsb2Jl/aHViL2ljb25zLXN0/YXRpYy1wbmcvbGF0/ZXN0L2ZpbGVzL2Rh/cmsvbWlzdHJhbC1j/b2xvci5wbmc');
            return;
        }

        const payload = {
            message: answerContent,
            questionContent: questionContent,
            ai: false,
            type: 'text'
        };

        try {
            ws.send(JSON.stringify(payload));
            createToast('Succès', 'Réponse envoyée avec succès', 'https://wsec-api.buage.dev/cdn/success.png');
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            createToast('Erreur', 'Erreur lors de l\'envoi de la réponse', 'https://imgs.search.brave.com/ClxTN7Tj_Vp2XW248OAPRfXTn1TtIaDxRngT8QSbU_M/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9yZWdp/c3RyeS5ucG1taXJy/b3IuY29tL0Bsb2Jl/aHViL2ljb25zLXN0/YXRpYy1wbmcvbGF0/ZXN0L2ZpbGVzL2Rh/cmsvbWlzdHJhbC1j/b2xvci5wbmc');
        }
    });

    plusBtn.addEventListener('click', () => {
        const answersPopup = document.createElement('div');
        answersPopup.style.position = 'fixed';
        answersPopup.style.top = '50%';
        answersPopup.style.left = '50%';
        answersPopup.style.transform = 'translate(-50%, -50%)';
        answersPopup.style.backgroundColor = 'rgba(255, 255, 255, 0.89)';
        answersPopup.style.backdropFilter = 'blur(10px)';
        answersPopup.style.padding = '20px';
        answersPopup.style.borderRadius = '20px';
        answersPopup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        answersPopup.style.zIndex = '10001';
        answersPopup.style.height = '600px';
        answersPopup.style.width = '800px';
        answersPopup.style.overflowY = 'auto';
        answersPopup.style.display = "flex";
        answersPopup.style.flexDirection = "column";
        answersPopup.style.gap = "10px";

        const closeAnswersBtn = document.createElement('div');
        closeAnswersBtn.textContent = 'Fermer';
        closeAnswersBtn.style.backgroundColor = '#f44336';
        closeAnswersBtn.style.color = 'white';
        closeAnswersBtn.style.padding = '8px 16px';
        closeAnswersBtn.style.border = 'none';
        closeAnswersBtn.style.width = '96%';
        closeAnswersBtn.style.borderRadius = '4px';
        closeAnswersBtn.style.cursor = 'pointer';
        closeAnswersBtn.style.alignSelf = 'flex-start';

        closeAnswersBtn.addEventListener('click', () => {
            document.body.removeChild(answersPopup);
            answersPopupContent.innerHTML = '';
        });

        answersPopup.appendChild(closeAnswersBtn);

        const answersPopupContent = document.createElement('div');
        answersPopupContent.style.display = 'flex';
        answersPopupContent.style.flexDirection = 'column';
        answersPopupContent.style.gap = '10px';
        answersPopup.appendChild(answersPopupContent);

        fetch('https://wsec-api.buage.dev/getAnswers.php?question=' + encodeURIComponent(div.querySelector(".question-label h4").textContent.trim()))
            .then(response => response.json())
            .then(data => {
                data.answers.forEach(answer => {
                    const answerDiv = document.createElement('div');
                    answerDiv.style.border = '1px solid #ccc';
                    answerDiv.style.padding = '10px';
                    answerDiv.style.borderRadius = '10px';
                    answerDiv.style.backgroundColor = 'rgba(240, 240, 240, 0.8)';
                    answerDiv.style.cursor = 'pointer';

                    const questionElem = document.createElement('h4');
                    questionElem.textContent = answer.question;
                    answerDiv.appendChild(questionElem);

                    const messageElem = document.createElement('p');
                    messageElem.innerHTML = answer.content
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .join('<br>');
                    answerDiv.appendChild(messageElem);

                    answerDiv.addEventListener('click', () => {
                        fillResponse(answer.question, answer.content);
                        document.body.removeChild(answersPopup);
                    });

                    answersPopupContent.appendChild(answerDiv);
                });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des réponses:', error);
                const errorElem = document.createElement('p');
                errorElem.textContent = 'Erreur lors de la récupération des réponses.';
                answersPopupContent.appendChild(errorElem);
            });

        document.body.appendChild(answersPopup);
    });

    toolbar.appendChild(plusBtn);
    toolbar.appendChild(sendBtn);
    toolbar.appendChild(askBtn);
    div.appendChild(toolbar);
});

const createMessageBubble = (username, content, isMistral = false) => {
    const msgDiv = document.createElement('div');
    msgDiv.style.cssText = 'width:90%;display:flex;flex-direction:column;gap:10px;';

    const msgMeta = document.createElement('div');
    msgMeta.style.cssText = 'display:flex;flex-direction:row;gap:7px;align-items:center;';

    const avatar = document.createElement('img');
    avatar.src = isMistral ? 'https://wsec-api.buage.dev/cdn/mistral.png' : 'https://buage.dev/files/Tor.png';
    avatar.style.cssText = 'width:45px;height:45px;border-radius:50%;object-fit:cover;';

    const usernameElem = document.createElement('h3');
    usernameElem.textContent = username;
    usernameElem.style.cssText = 'margin:0;padding:0;font-family:Roboto,sans-serif;font-size:16px;color:#000;';

    const contentElem = document.createElement('p');
    contentElem.innerHTML = content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('<br>');
    contentElem.style.cssText = 'margin:0;padding:0;font-family:Roboto,sans-serif;font-size:14px;color:#6e6e6e;';

    msgMeta.appendChild(avatar);
    msgMeta.appendChild(usernameElem);
    msgDiv.appendChild(msgMeta);
    msgDiv.appendChild(contentElem);

    return { container: msgDiv, content: contentElem };
};

function createKaiPopup() {
    const overlay = document.createElement('div');
    overlay.id = 'kai-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:none;justify-content:center;align-items:center;z-index:99999;';

    const popup = document.createElement('div');
    popup.style.cssText = 'width:900px;height:550px;background-color:rgb(226,226,226);border-radius:20px;border:1px solid rgb(207,207,207);display:flex;padding:30px;flex-direction:column;align-items:center;gap:20px;box-shadow:0 4px 20px rgba(0,0,0,0.3);';

    const header = document.createElement('div');
    header.style.cssText = 'width:100%;';

    const title = document.createElement('h3');
    title.textContent = 'KAI';
    title.style.cssText = 'margin:0;padding:0;font-family:Roboto,sans-serif;font-size:18px;color:#000;';

    const subtitle = document.createElement('p');
    subtitle.textContent = 'Mentionnez @KAI pour poser une question.';
    subtitle.style.cssText = 'margin:0;padding:0;font-family:Roboto,sans-serif;font-size:14px;color:#6e6e6e;';

    const hr = document.createElement('hr');
    hr.style.cssText = 'width:100%;opacity:0.8;border:none;border-top:1px solid #999;margin:10px 0;';

    header.appendChild(title);
    header.appendChild(subtitle);
    header.appendChild(hr);

    const messagesContainer = document.createElement('div');
    messagesContainer.classList.add('messages-container');
    messagesContainer.style.cssText = 'width:100%;gap:20px;display:flex;flex-direction:column;align-items:flex-start;height:100%;overflow-y:auto;padding-right:10px;';

    const inputZone = document.createElement('div');
    inputZone.style.cssText = 'width:100%;height:10%;display:flex;align-items:center;gap:10px;';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Entrez un message ici...';
    input.style.cssText = 'width:100%;height:40px;border-radius:30px;outline:1px solid rgba(176,176,176,0.782);background-color:#cbcbcbb7;border:none;padding:0 15px;color:#000;font-family:Roboto,sans-serif;box-sizing:border-box;';

    inputZone.appendChild(input);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = 'position:absolute;top:40px;right:40px;background:none;border:none;font-size:24px;cursor:pointer;color:#666;';
    closeBtn.onclick = () => overlay.style.display = 'none';

    popup.appendChild(closeBtn);
    popup.appendChild(header);
    popup.appendChild(messagesContainer);
    popup.appendChild(inputZone);

    let mistralResponseHandler = null;

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            const messageText = input.value;
            const hasMistral = messageText.includes('@Mistral');

            if (hasMistral) {
                const { container: userBubble } = createMessageBubble(currentUsername, messageText);
                messagesContainer.appendChild(userBubble);

                const { container: mistralBubble, content: mistralContent } = createMessageBubble('Mistral', '...', true);
                messagesContainer.appendChild(mistralBubble);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;

                mistralResponseHandler = (data) => {
                    mistralContent.innerHTML = data.response
                        .split('\n')
                        .map(line => line.trim())
                        .filter(line => line.length > 0)
                        .join('<br>');
                };

                const payload = {
                    message: messageText,
                    username: currentUsername,
                    timestamp: Date.now()
                };

                ws.send(JSON.stringify(payload));
            } else {
                const { container: msgDiv } = createMessageBubble(currentUsername, messageText);
                messagesContainer.appendChild(msgDiv);
                sendMessage(messageText);
            }

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            input.value = '';
        }
    });

    const oldOnMessage = ws.onmessage;
    ws.onmessage = function(event) {
        oldOnMessage.call(ws, event);

        const data = JSON.parse(event.data);
        console.log("Message WebSocket reçu dans KAI popup:", data);

        if ((data.type === 'mistralResponse' || data.isAi === 1) && data.username === 'Mistral') {
            if (mistralResponseHandler) {
                mistralResponseHandler({ response: data.content });
                mistralResponseHandler = null;
            }
        } else if (data.message && data.username && !data.questionContent && data.type !== 'heartbeat') {
            if (data.username === currentUsername) return;
            const { container: msgDiv } = createMessageBubble(data.username, data.message);
            messagesContainer.appendChild(msgDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    return overlay;
}

const kaiOverlay = createKaiPopup();

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.key === 'c') {
        e.preventDefault();
        kaiOverlay.style.display = kaiOverlay.style.display === 'none' ? 'flex' : 'none';
    }
});

fetch('https://wsec-api.buage.dev/getMessages.php', {
    method: 'GET',
})
.then(response => response.json())
.then(data => {
    data.messages = data.messages.reverse();
    data.messages.forEach(msg => {
        if (msg.content && msg.username && !msg.questionContent) {
            const bubble = createMessageBubble(msg.username, msg.content, msg.isAi);
            document.querySelector('.messages-container').appendChild(bubble.container);
        }
    });
})