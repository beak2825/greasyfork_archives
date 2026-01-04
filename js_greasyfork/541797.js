// ==UserScript==
// @name         Synthèse vocale des messages Grok
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ajoute la synthèse vocale aux messages Grok (voix en français uniquement).
// @author       Jonathan Laurendeau
// @match        https://grok.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @connect      texttospeech.responsivevoice.org
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541797/Synth%C3%A8se%20vocale%20des%20messages%20Grok.user.js
// @updateURL https://update.greasyfork.org/scripts/541797/Synth%C3%A8se%20vocale%20des%20messages%20Grok.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script TTS Grok démarré (version Web Audio API).");

    // État global pour gérer la lecture audio en cours
    let activePlayback = {
        source: null, // Le nœud AudioBufferSourceNode
        context: null, // Le contexte AudioContext
        buffer: null, // Le buffer AudioBuffer (nécessaire pour reprendre)
        startTime: 0, // Position dans le buffer où la lecture a commencé (pour offset de reprise)
        startContextTime: 0, // Temps du contexte au début de la lecture (pour calculer la position actuelle)
        pausedTime: 0, // Position dans le buffer où la lecture a été mise en pause
        button: null, // Référence au bouton ayant déclenché la lecture
        messageElement: null, // Référence à l'élément du message contenant le bouton
        isPlaying: false, // Drapeau d'état simple
        stopReason: null // Drapeau ajouté : 'paused' ou null (terminé naturellement/annulé)
    };

    // Fonction pour créer l'icône SVG du bouton audio (lecture)
    function createAudioSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.classList.add("lucide", "lucide-volume-2", "size-4"); // Classe pour l'icône de volume

        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.setAttribute("points", "11 5 6 9 2 9 2 15 6 15 11 19 11 5");
        svg.appendChild(polygon);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07");
        svg.appendChild(path);

        return svg;
    }

    // Fonction pour créer l'icône SVG du bouton de pause
    function createPauseSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");
        svg.classList.add("lucide", "lucide-pause", "size-4"); // Classe pour l'icône de pause

        const rect1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect1.setAttribute("x", "6");
        rect1.setAttribute("y", "4");
        rect1.setAttribute("width", "4");
        rect1.setAttribute("height", "16");
        svg.appendChild(rect1);

        const rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect2.setAttribute("x", "14");
        rect2.setAttribute("y", "4");
        rect2.setAttribute("width", "4");
        rect2.setAttribute("height", "16");
        svg.appendChild(rect2);

        return svg;
    }

    // Fonction auxiliaire pour remplacer l'icône à l'intérieur d'un bouton
    function replaceButtonIcon(buttonElement, newSvgElement) {
        const span = buttonElement.querySelector('span');
        if (span && span.firstElementChild) {
            span.replaceChild(newSvgElement, span.firstElementChild);
        }
    }

    // Fonction pour créer l'élément du bouton audio
    function createAudioButton(messageTextElement, messageElement) {
        const button = document.createElement('button');

        // Copie des classes pour le style et la visibilité au survol/focus
        button.classList.add(
            'inline-flex', 'items-center', 'justify-center', 'gap-2', 'whitespace-nowrap', 'text-sm',
            'font-medium', 'leading-[normal]', 'cursor-pointer', 'focus-visible:outline-none',
            'focus-visible:ring-1', 'focus-visible:ring-ring', 'disabled:cursor-not-allowed',
            'transition-colors', 'duration-100', '[&_svg]:duration-100', '[&_svg]:pointer-events-none',
            '[&_svg]:shrink-0', '[&_svg]:-mx-0.5', 'select-none', 'text-fg-secondary',
            'hover:text-fg-primary', 'hover:bg-button-ghost-hover', 'disabled:hover:text-fg-secondary',
            'disabled:hover:bg-transparent', '[&_svg]:hover:text-fg-primary', 'h-8', 'w-8',
            'rounded-full', 'opacity-0',
            'group-focus-within:opacity-100', 'group-hover:opacity-100',
            '[.last-response_&]:opacity-100', 'disabled:opacity-0', 'group-focus-within:disabled:opacity-60',
            'group-hover:disabled:opacity-60', '[.last-response_&]:disabled:opacity-60'
        );

        button.setAttribute('type', 'button');
        button.setAttribute('aria-label', 'Écouter le message');
        // Classe personnalisée pour l'identification
        button.classList.add('grok-tts-button');

        const span = document.createElement('span');
        span.style.opacity = '1';
        span.style.transform = 'none';

        const svg = createAudioSVG(); // Commence avec l'icône de lecture
        span.appendChild(svg);
        button.appendChild(span);

        // Ajoute l'écouteur d'événements pour le clic
        button.addEventListener('click', async () => {
            console.log("Bouton TTS Grok cliqué !");

            const clickedButton = button;
            const clickedMessageElement = messageElement; // Utilise l'élément de message passé

            // --- Gestion de la logique Pause/Reprise ---
            // Vérifie si le message de ce bouton est celui en cours de lecture ou en pause
            if (activePlayback.messageElement === clickedMessageElement) {
                if (activePlayback.isPlaying) {
                    // Ce bouton est en lecture, donc le mettre en pause
                    console.log("Mise en pause de la lecture.");
                    const elapsedContextTime = activePlayback.context.currentTime - activePlayback.startContextTime;
                    activePlayback.pausedTime = activePlayback.startTime + elapsedContextTime; // Calcule le temps de pause

                    console.log(`Pause à la position du buffer : ${activePlayback.pausedTime.toFixed(3)}s (temps écoulé du contexte : ${elapsedContextTime.toFixed(3)}s)`);

                    // Définir stopReason AVANT d'arrêter
                    activePlayback.stopReason = 'paused';
                    activePlayback.source.stop(); // Arrête la source actuelle (déclenche onended)
                    // isPlaying sera défini à false dans le gestionnaire onended si stopReason est 'paused'
                    // L'icône sera changée dans le gestionnaire onended si stopReason est 'paused'
                    return; // Arrête ici, ne passe pas à une nouvelle lecture
                } else if (activePlayback.pausedTime > 0) {
                    // Ce bouton était en pause, reprendre la lecture à partir de la position de pause
                    console.log("Reprise de la lecture à partir de", activePlayback.pausedTime.toFixed(3), "secondes.");
                    console.log("État de l'AudioContext avant reprise :", activePlayback.context ? activePlayback.context.state : 'null');

                    // Vérifie si le contexte et le buffer sont disponibles depuis l'état de pause
                    if (activePlayback.context && activePlayback.buffer) {
                        // Vérifie l'état du contexte et le reprend si nécessaire
                        if (activePlayback.context.state === 'suspended') {
                            console.log("AudioContext suspendu, tentative de reprise du contexte.");
                            try {
                                await activePlayback.context.resume();
                                console.log("AudioContext repris.");
                            } catch (e) {
                                console.error("Échec de la reprise de l'AudioContext :", e);
                                // Impossible de reprendre, réinitialise l'état et l'icône
                                activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                                replaceButtonIcon(clickedButton, createAudioSVG());
                                return; // Impossible de continuer avec la reprise
                            }
                        } else if (activePlayback.context.state !== 'running') {
                            // Gérer d'autres états inattendus si nécessaire, bien que 'suspended' soit le plus courant
                            console.warn("AudioContext dans un état inattendu :", activePlayback.context.state, "Réinitialisation de l'état.");
                            activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                            replaceButtonIcon(clickedButton, createAudioSVG());
                            return;
                        }

                        // Poursuit avec la création et le démarrage de la source maintenant que le contexte est probablement en cours d'exécution
                        const newSource = activePlayback.context.createBufferSource();
                        newSource.buffer = activePlayback.buffer;
                        newSource.connect(activePlayback.context.destination);

                        // Met à jour l'état global pour la lecture reprise
                        activePlayback.source = newSource;
                        activePlayback.startTime = activePlayback.pausedTime; // Commence à l'endroit où il était en pause
                        activePlayback.startContextTime = activePlayback.context.currentTime; // Enregistre le nouveau temps de démarrage
                        activePlayback.isPlaying = true;
                        activePlayback.pausedTime = 0; // Réinitialise le temps de pause car nous reprenons

                        // Définit le gestionnaire onended pour le NOUVEAU nœud source
                        newSource.onended = () => {
                            console.log("Lecture terminée ou arrêtée.");
                            // Réinitialise l'état et l'icône uniquement si cette source est celle actuellement active
                            if (activePlayback.source === newSource) {
                                if (activePlayback.stopReason === 'paused') {
                                    console.log("Lecture mise en pause, préservation de l'état pour reprise.");
                                    activePlayback.stopReason = null; // Efface la raison
                                    activePlayback.source = null; // Annule le nœud source terminé
                                    activePlayback.isPlaying = false; // Assure que isPlaying est false après pause
                                    // L'icône a déjà été changée lors du clic
                                } else {
                                    console.log("Lecture terminée naturellement, réinitialisation de l'état.");
                                    replaceButtonIcon(clickedButton, createAudioSVG());
                                    // Réinitialise l'état global
                                    activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                                }
                            } else {
                                console.log("Événement de fin pour une source non actuelle. Ignorer la réinitialisation de l'état.");
                            }
                        };

                        try {
                            console.log(`Tentative de reprise à l'offset : ${activePlayback.startTime.toFixed(3)}s`);
                            // start(when, offset, duration) - démarre immédiatement (0), à partir de l'offset calculé
                            newSource.start(0, activePlayback.startTime);
                            replaceButtonIcon(clickedButton, createPauseSVG()); // Change l'icône pour pause
                            console.log("Lecture reprise démarrée.");
                        } catch (e) {
                            console.error("Erreur lors du démarrage de la lecture reprise :", e);
                            replaceButtonIcon(clickedButton, createAudioSVG()); // Réinitialise l'icône en cas d'erreur
                            // Réinitialise l'état global en cas d'erreur
                            activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                        }
                    } else {
                        console.error("Impossible de reprendre : AudioContext ou Buffer non disponible depuis l'état précédent.");
                        // Réinitialise l'état car nous ne pouvons pas reprendre
                        activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                        replaceButtonIcon(clickedButton, createAudioSVG()); // Réinitialise l'icône en cas d'erreur
                    }
                    return; // Arrête ici, lecture reprise
                }
            }

            // --- Gestion de l'arrêt de la lecture actuelle et démarrage d'une nouvelle ---
            // Si nous arrivons ici, cela signifie qu'il faut démarrer une nouvelle lecture (première fois, clic sur un autre bouton, ou reprise échouée)

            // Arrête d'abord toute lecture active en cours
            if (activePlayback.source) {
                console.log("Arrêt de la lecture actuelle pour démarrer une nouvelle.");
                // Définit stopReason à null avant d'arrêter, pour que onended sache que ce n'est pas une pause
                activePlayback.stopReason = null;
                activePlayback.source.stop();
                // Le gestionnaire onended de l'ANCIENNE source réinitialisera l'état
                // L'icône de l'ANCIEN bouton sera réinitialisée dans le gestionnaire onended
            }

            // Réinitialise immédiatement l'état global avant de démarrer un NOUVEAU cycle de lecture
            // Cela garantit un état propre si l'état précédent était corrompu ou provenait d'un autre message
            activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };

            // Maintenant, démarre la nouvelle lecture pour le bouton cliqué
            console.log("Démarrage d'une nouvelle lecture.");

            // Désactive le bouton pendant la récupération/traitement
            clickedButton.disabled = true;
            replaceButtonIcon(clickedButton, createPauseSVG()); // Suppose le succès et affiche l'icône de pause immédiatement

            const text = messageTextElement.textContent;
            const cleanedText = text.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Supprime les espaces de largeur nulle
            const encodedText = encodeURIComponent(cleanedText);
            const audioUrl = `https://texttospeech.responsivevoice.org/v1/text:synthesize?lang=fr-FR&engine=g1&pitch=0.5&rate=0.5&volume=1&key=kvfbSITh&gender=male&text=${encodedText}`; // Note : La clé doit être gérée correctement si exposée/publiquement utilisée

            console.log("URL audio générée pour récupération :", audioUrl.substring(0, 200) + (audioUrl.length > 200 ? '...' : ''));

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: audioUrl,
                        responseType: "arraybuffer",
                        onload: resolve,
                        onerror: reject,
                        ontimeout: reject
                    });
                });

                clickedButton.disabled = false; // Réactive le bouton après la tentative de récupération
                console.log("Statut de GM_xmlhttpRequest onload :", response.status);

                if (response.status === 200) {
                    const audioData = response.response;
                    console.log("Données audio reçues (ArrayBuffer).");

                    try {
                        // Crée un nouveau AudioContext pour cette session de lecture si aucun n'existe ou s'il est fermé
                        let audioContext = activePlayback.context;
                        if (!audioContext || audioContext.state === 'closed') {
                            audioContext = new (window.AudioContext || window.webkitAudioContext)();
                            console.log("Nouveau AudioContext créé.");
                        }

                        // S'assure que le contexte est en cours d'exécution (important pour la première lecture)
                        if (audioContext.state === 'suspended') {
                            console.log("AudioContext suspendu, tentative de reprise du contexte pour la lecture initiale.");
                            try {
                                await audioContext.resume();
                                console.log("AudioContext repris.");
                            } catch (e) {
                                console.error("Échec de la reprise de l'AudioContext pour la lecture initiale :", e);
                                // Impossible de continuer, réinitialise l'icône et l'état
                                replaceButtonIcon(clickedButton, createAudioSVG());
                                activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                                return; // Arrête l'exécution
                            }
                        }

                        const audioBuffer = await audioContext.decodeAudioData(audioData);
                        console.log("Données audio décodées avec succès.");

                        const source = audioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(audioContext.destination);

                        // Met à jour l'état global AVANT de démarrer la lecture
                        activePlayback.source = source;
                        activePlayback.context = audioContext; // Stocke le contexte
                        activePlayback.buffer = audioBuffer; // Stocke le buffer pour une éventuelle reprise
                        activePlayback.startTime = 0; // Commence depuis le début
                        activePlayback.startContextTime = audioContext.currentTime; // Enregistre le temps du contexte au démarrage
                        activePlayback.button = clickedButton;
                        activePlayback.messageElement = clickedMessageElement;
                        activePlayback.isPlaying = true;
                        activePlayback.pausedTime = 0; // S'assure que le temps de pause est à 0 pour un nouveau démarrage
                        activePlayback.stopReason = null; // S'assure que la raison d'arrêt est null pour un nouveau démarrage

                        // Définit le gestionnaire onended pour la source nouvellement créée
                        source.onended = () => {
                            console.log("Lecture terminée ou arrêtée.");
                            // Réinitialise l'état et l'icône uniquement si cette source est celle actuellement active
                            // et que ce n'était pas un arrêt initié par une pause
                            if (activePlayback.source === source) {
                                if (activePlayback.stopReason === 'paused') {
                                    console.log("Lecture mise en pause, préservation de l'état pour reprise.");
                                    activePlayback.stopReason = null; // Efface la raison
                                    activePlayback.source = null; // Annule le nœud source terminé
                                    activePlayback.isPlaying = false; // Assure que isPlaying est false après pause
                                    // L'icône a déjà été changée lors du clic
                                } else {
                                    console.log("Lecture terminée naturellement, réinitialisation de l'état.");
                                    replaceButtonIcon(clickedButton, createAudioSVG());
                                    // Réinitialise l'état global
                                    activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                                }
                            } else {
                                console.log("Événement de fin pour une source non actuelle. Ignorer la réinitialisation de l'état.");
                            }
                        };

                        console.log("Tentative de lecture audio via Web Audio API...");
                        source.start(0); // Joue immédiatement depuis le début
                        // replaceButtonIcon(clickedButton, createPauseSVG()); // Icône changée plus tôt, remettre ici si vous voulez attendre le succès

                    } catch (audioError) {
                        console.error("Erreur lors du décodage ou de la lecture audio avec Web Audio API :", audioError);
                        clickedButton.disabled = false; // Réactive le bouton en cas d'erreur
                        replaceButtonIcon(clickedButton, createAudioSVG()); // Réinitialise l'icône en cas d'erreur
                        // Réinitialise l'état global en cas d'erreur
                        activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                    }

                } else {
                    console.error(`Échec de la récupération des données audio : Statut HTTP ${response.status}`);
                    console.error("Détails de la réponse :", response);
                    clickedButton.disabled = false; // Réactive le bouton en cas d'erreur
                    replaceButtonIcon(clickedButton, createAudioSVG()); // Réinitialise l'icône en cas d'erreur
                    // Réinitialise l'état global en cas d'erreur
                    activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
                }

            } catch (gmError) {
                console.error("Erreur réseau ou de délai d'attente GM_xmlhttpRequest :", gmError);
                clickedButton.disabled = false; // Réactive le bouton en cas d'erreur
                replaceButtonIcon(clickedButton, createAudioSVG()); // Réinitialise l'icône en cas d'erreur
                // Réinitialise l'état global en cas d'erreur
                activePlayback = { source: null, context: null, buffer: null, startTime: 0, startContextTime: 0, pausedTime: 0, button: null, messageElement: null, isPlaying: false, stopReason: null };
            }
        });

        return button;
    }

    // Fonction pour traiter un conteneur de message unique
    function processMessage(messageElement) {
        // Vérifie si nous avons déjà ajouté le bouton à ce message
        if (messageElement.classList.contains('grok-audio-added')) {
            return;
        }

        // Trouve l'élément de texte du message (la balise <p> à l'intérieur de la bulle de message)
        const messageTextElement = messageElement.querySelector('.message-bubble p');
        // Trouve le conteneur où se trouvent les boutons d'action
        const actionsContainer = messageElement.querySelector('.flex.flex-row.flex-wrap > .flex.items-center.gap-\\[2px\\]');

        if (messageTextElement && actionsContainer) {
            console.log("Message et actions trouvés, ajout du bouton TTS.");
            // Crée le bouton audio et passe les références du texte et de l'élément de message
            const audioButton = createAudioButton(messageTextElement, messageElement);

            if (audioButton) {
                // Ajoute le nouveau bouton au conteneur des actions
                actionsContainer.appendChild(audioButton);

                // Marque cet élément de message pour ne pas le traiter à nouveau
                messageElement.classList.add('grok-audio-added');
                console.log("Bouton audio ajouté et message marqué.");
            } else {
                console.error("Échec de la création de l'élément du bouton audio.");
            }

        } else {
            // console.log("Impossible de trouver les éléments nécessaires pour le traitement du message sur un élément de message potentiel.");
        }
    }

    // Configure un MutationObserver pour surveiller les nouveaux nœuds ajoutés au DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Vérifie si le nœud ajouté est lui-même un conteneur de message
                        if (node.matches('.relative.group.flex.flex-col')) {
                            processMessage(node);
                        }
                        // Vérifie également si le nœud ajouté contient des conteneurs de messages
                        node.querySelectorAll('.relative.group.flex.flex-col').forEach(processMessage);
                    }
                });
            }
        });
    });

    // Commence à observer le corps pour les changements
    console.log("Démarrage de MutationObserver sur document.body");
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("MutationObserver démarré.");

    // Traite également les messages qui pourraient déjà être présents lorsque le script s'exécute
    console.log("Traitement des messages existants au chargement de la page.");
    document.querySelectorAll('.relative.group.flex.flex-col').forEach(processMessage);
    console.log("Traitement des messages existants terminé.");
})();