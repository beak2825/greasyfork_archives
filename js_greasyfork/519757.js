// ==UserScript==
// @name         Me Salva | c h e e t o
// @namespace    http://tampermonkey.net/
// @version      2024-10-12
// @description  God is good, dinner on the table
// @author       marcos10pc
// @match        https://www.mesalva.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain_url=mesalva.com
// @grant        none
// ==/UserScript==

//TODO: fazer opcao pra marcar video como concluido

let notificationCount = 0;

function createAndShowNotification(message) {
    return new Promise((resolve) => {
        if (document.getElementById('notification-styles') === null) {
            const e = document.createElement("style");
            e.id = 'notification-styles';
            e.innerHTML = `
                .notification {
                    position: fixed;
                    right: -320px;
                    background-color: #333;
                    color: #fff;
                    padding: 10px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    width: 320px;
                    height: 60px;
                    transition: right 0.5s ease;
                }
                .notification-content {
                    position: relative;
                    height: 100%;
                }
                .notification-content p {
                    margin: 0;
                    padding-top: 0;
                }
                .progress-bar {
                    position: absolute;
                    bottom: 5px;
                    left: 50%;
                    transform: translateX(-50%);
                    height: 5px;
                    background-color: #555;
                    border-radius: 5px;
                    width: 90%;
                    overflow: hidden;
                }
                .progress-bar div {
                    height: 100%;
                    background-color: #bbb;
                    width: 100%;
                    animation: progress 5s linear forwards;
                }
                @keyframes progress {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0;
                    }
                }
            `;
            document.head.appendChild(e);
        }

        notificationCount++;

        const t = document.createElement("div");
        t.id = `notification-${notificationCount}`;
        t.className = "notification";
        t.style.bottom = `${20 + (notificationCount - 1) * 70}px`;
        t.style.right = "20px";
        t.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
                <div class="progress-bar"><div></div></div>
            </div>
        `;
        document.body.appendChild(t);

        setTimeout(() => {
            t.style.right = "20px";
        }, 10);

        setTimeout(() => {
            t.style.right = "-300px";
            setTimeout(() => {
                t.style.display = "none";
                notificationCount--;
                resolve();
            }, 500);
        }, 5000);
    });
}

createAndShowNotification("sussy baka amongus");
createAndShowNotification("halala marcos10pc");
createAndShowNotification("se vc pagou por isso vc foi scammado");

function abacate(originalUrl) {
    const url = new URL(originalUrl);
    const pathParts = url.pathname.split('/');
    const exerciseId = pathParts[pathParts.length - 1];
    const newPath = `/app/_next/data/bm2l3_QV91OobhF5hOUQF/exercicio/${exerciseId}.json`;
    const params = new URLSearchParams(url.search);
    params.append('content', 'exercicio');
    params.append('content', exerciseId);
    return `https://www.mesalva.com${newPath}?${params.toString()}`;
}

(async function() {
    'use strict';

    let catapimbas = /^https:\/\/www\.mesalva\.com\/app\/exercicio\/[a-z0-9\-]+(\?contexto=[^&]+&lista=[^&]+&modulo=[^&]+)?$/;
    console.log("-- sussy baka amongus marcos10pc --");
    let oldHref = document.location.href;

    const observer = new MutationObserver(async () => {
        if (oldHref !== document.location.href) {
            oldHref = document.location.href;

            if (catapimbas.test(oldHref)) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                let answer_url = abacate(oldHref);
                console.log(`${answer_url}`);

                try {
                    let pre_answer = await fetch(answer_url, {
                        method: "GET",
                    });

                    if (!pre_answer.ok) {
                        alert('uh, deu alguma porra ao tentar pegar resposta');
                        return;
                    }

                    let porra_answer = await pre_answer.json();
                    const caralhos = porra_answer.pageProps.content.children[0].list;
                    const damn = caralhos.find(resposta => resposta.isCorrect === true);

                    if (damn) {
                        console.log(`[DEBUG] -- ${JSON.stringify(damn)} --`);
                        createAndShowNotification(`RESPOSTA: ${damn.letter}`);
                        const buttons = document.querySelectorAll('.exercise-answer__button');
                        let clicked = false;

                        buttons.forEach(button => {
                            const letterElement = button.querySelector('.exercise-answer__letter');
                            if (letterElement && letterElement.textContent.trim() === damn.letter) {
                                button.click();
                                clicked = true;
                            }
                        });
                        if (clicked) {
                            const submitButton = document.querySelector('.btn.btn--primary.btn--size-md.submit-button');
                            if (submitButton) {
                                submitButton.click();

                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const nextButton = document.querySelector('.btn.btn--primary.btn--size-md');
                                if (nextButton) {
                                    nextButton.click();
                                }
                            }
                        }
                    } else {
                        createAndShowNotification("Resposta não encontrada.");
                    }
                } catch (error) {
                    console.error('Erro no fetch:', error);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();