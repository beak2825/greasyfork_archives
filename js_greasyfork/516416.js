// ==UserScript==
// @name         Automatic prepmyfuture replies
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  A script that automatically replies to prepmyfuture tests with dynamic popup and configurable delay.
// @author       Ayfri & Antaww
// @match        https://prepmyfuture.com/platform/exercises/continue?id=*
// @match        https://prepmyfuture.com/platform/adaptive_exercises/continue?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=prepmyfuture.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516416/Automatic%20prepmyfuture%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/516416/Automatic%20prepmyfuture%20replies.meta.js
// ==/UserScript==


    // Configuration des délais (en millisecondes)
    const minDelay = 5000; // 5 secondes
    const maxDelay = 10000; // 10 secondes

    /**
     * Sélectionne un délai aléatoire entre minDelay et maxDelay
     * @returns {number} Délai en millisecondes
     */
    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Affiche un popup avec un décompte dynamique
     * @param {number} delayMs - Délai en millisecondes
     */
    function displayAnswersRepliedPopup(delayMs) {
        // Création du conteneur du popup
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        popup.style.zIndex = '9999';
        popup.style.padding = '1rem';
        popup.style.borderRadius = '8px';
        popup.style.fontSize = '1.5rem';
        popup.style.textAlign = 'center';
        popup.style.color = 'white';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

        // Texte principal
        const mainText = document.createElement('div');
        mainText.innerText = 'Réponses trouvées !';
        mainText.style.marginBottom = '0.5rem';
        popup.appendChild(mainText);

        // Description avec décompte
        const countdownText = document.createElement('div');
        countdownText.innerText = `Réponse automatique dans ${Math.ceil(delayMs / 1000)}s.`;
        popup.appendChild(countdownText);

        document.body.appendChild(popup);

        // Décompte dynamique
        let remainingSeconds = Math.ceil(delayMs / 1000);
        const interval = setInterval(() => {
            remainingSeconds--;
            if (remainingSeconds > 0) {
                countdownText.innerText = `Réponse automatique dans ${remainingSeconds}s.`;
            } else {
                clearInterval(interval);
                document.body.removeChild(popup);
            }
        }, 1000);
    }

    function replyWithAnswers(answers) {
        const questions = [...document.querySelectorAll('.card[id^=content_question]')];
        const answersInputs = [...document.querySelectorAll('input[id^=answers][id$=answer]')];
        answers.forEach((answer, i) => {
            if (i >= questions.length) {
                console.error(`Question ${i + 1} n'existe pas mais une réponse a été trouvée, passage...`);
                return;
            }

            const question = questions[i];
            const answerInput = answersInputs[i];
            const propositions = [...question.querySelectorAll('.answer-label')];
            let questionAnswer = propositions.find(a => a.lastElementChild.textContent.trim() === answer);

            if (!questionAnswer) {
                // Recherche dans la variable 'answers' si une correspondance existe
                const answerIndex = propositions.findIndex(a => answers.includes(a.lastElementChild.textContent.trim()));
                if (answerIndex === -1) {
                    console.error(`Question ${i + 1}, réponse non trouvée : '${answer}'`);
                    return;
                }
                questionAnswer = propositions[answerIndex];
            }

            answerInput.value = questionAnswer.getAttribute('data-answernb');
            console.log(`Question ${i + 1}, numéro de réponse : ${questionAnswer.getAttribute('data-answernb')}, Valeur : '${answer}'`);
        });
    }

    function getAnswers() {
        const answers = document.querySelectorAll('.answer.right.false');
        return [...answers].map(a => a.querySelector('.answer-text')?.textContent.trim() || '');
    }

    function getCurrentExerciseId() {
        const currentUrl = window.location.href;
        const match = currentUrl.match(/id=(\d+)/);
        return match ? match[1] : null;
    }

    async function getAnswersPageContent(id) {
        try {
            const response = await fetch(`https://prepmyfuture.com/platform/exercises/load_user_exercise_solutions?user_exercise_id=${id}`, {
                "referrer": `https://prepmyfuture.com/platform/exercises/default_exercise_results?&user_exercise_id=${id}`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "mode": "cors",
            });

            if (!response.ok) {
                throw new Error(`Erreur lors du fetch : ${response.status}`);
            }

            const text = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(text, 'text/html');
        } catch (error) {
            console.error('Erreur lors du chargement des réponses :', error);
            return null;
        }
    }

    function clickSubmit() {
        const submitButton = document.querySelector('input[value="valider"]');
        if (!submitButton) {
            console.error('Bouton de soumission non trouvé');
            return;
        }
        submitButton.click();
    }

    function clickNext() {
        const nextButton = [...document.querySelectorAll('a.btn')].find(a => a.textContent.trim().toLowerCase() === 'question suivante');
        if (!nextButton) {
            console.error('Bouton "Question suivante" non trouvé');
            return;
        }

        nextButton.click();
    }

    async function automaticallyReply() {
        const id = getCurrentExerciseId();
        if (!id) {
            console.error('ID de l\'exercice non trouvé');
            return;
        }

        const doc = await getAnswersPageContent(id);
        if (!doc) {
            console.error('Impossible de récupérer le contenu des réponses');
            return;
        }

        const answers = [...doc.querySelectorAll('.answer.right.false:not(.checked)')].map(a => a.querySelector('.answer-text')?.innerText.trim() || '');
        if (answers.length === 0) {
            console.warn('Aucune réponse trouvée à remplir');
            return;
        }

        replyWithAnswers(answers);

        // Sélection aléatoire du délai
        const selectedDelay = getRandomDelay(minDelay, maxDelay);
        displayAnswersRepliedPopup(selectedDelay);

        // Planification de la soumission et de la navigation suivante
        setTimeout(() => {
            clickSubmit();

            setTimeout(clickNext, 2000);
        }, selectedDelay);
    }

    // Démarrage du script après un court délai pour s'assurer que la page est chargée
    setTimeout(automaticallyReply, 1000);
