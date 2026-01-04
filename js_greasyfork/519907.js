// ==UserScript==
// @name         Git Helper 
// @namespace    http://tampermonkey.net/
// @version      10.1
// @description  Guide git de l'installation aux commandes usuelles 
// @author       yglsan
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519907/Git%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/519907/Git%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Ajout de Bootstrap via CDN pour les styles
    const bootstrapStyle = document.createElement("link");
    bootstrapStyle.href = "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css";
    bootstrapStyle.rel = "stylesheet";
    document.head.appendChild(bootstrapStyle);

    const gitSections = [
        {
            section: "Commandes essentielles (15 principales)",
            details: [
                {
                    command: "git init",
                    usage: "git init",
                    explanation: "Initialise un nouveau dépôt Git dans le répertoire actuel.",
                    advice: "Utilisez cette commande lorsque vous commencez un nouveau projet Git. Elle est souvent la première commande exécutée dans un nouveau répertoire.",
                    example: "Exemple : `git init` dans le répertoire de votre projet pour initialiser le dépôt."
                },
                {
                    command: "git clone",
                    usage: "git clone [URL_du_dépôt]",
                    explanation: "Clone un dépôt distant sur votre machine locale.",
                    advice: "Utilisez cette commande pour récupérer une copie locale d'un projet existant hébergé sur GitHub, GitLab, etc.",
                    example: "Exemple : `git clone https://github.com/username/repository.git`"
                },
                {
                    command: "git add",
                    usage: "git add [fichier|dossier|.]",
                    explanation: "Ajoute des fichiers ou des modifications à l'index pour préparer un commit.",
                    advice: "Important pour préparer les fichiers à être commités. Vous pouvez utiliser un point `.` pour ajouter tous les fichiers modifiés dans le répertoire.",
                    example: "Exemple : `git add .` pour ajouter tous les fichiers modifiés dans le répertoire."
                },
                {
                    command: "git commit -m",
                    usage: "git commit -m '[message]'",
                    explanation: "Enregistre les changements de l'index dans l'historique avec un message de commit.",
                    advice: "Utilisez des messages clairs et descriptifs pour vos commits. Par exemple, 'Ajout de la fonctionnalité X' ou 'Correction du bug Y'.",
                    example: "Exemple : `git commit -m 'Ajout de la fonctionnalité de recherche'`"
                },
                {
                    command: "git commit -am",
                    usage: "git commit -am '[message]'",
                    explanation: "Effectue un commit en ajoutant tous les fichiers suivis modifiés, sans avoir besoin de `git add`.",
                    advice: "Cette commande est très pratique lorsque vous travaillez fréquemment sur un même fichier ou un groupe de fichiers.",
                    example: "Exemple : `git commit -am 'Correction des bugs'`"
                },
                {
                    command: "git status",
                    usage: "git status",
                    explanation: "Affiche l'état actuel du dépôt, les fichiers modifiés, ajoutés ou non suivis.",
                    advice: "Utilisez `git status` fréquemment pour vérifier l'état de vos fichiers avant de faire un commit ou de pousser vos changements.",
                    example: "Exemple : `git status`"
                },
                {
                    command: "git log",
                    usage: "git log",
                    explanation: "Affiche l'historique des commits dans le dépôt.",
                    advice: "Utilisez `git log --oneline` pour avoir une vue d'ensemble plus concise de l'historique des commits.",
                    example: "Exemple : `git log --oneline`"
                },
                {
                    command: "git branch",
                    usage: "git branch [nom]",
                    explanation: "Crée une nouvelle branche locale.",
                    advice: "Créez des branches pour chaque nouvelle fonctionnalité ou correction de bug afin de maintenir une structure claire de votre code.",
                    example: "Exemple : `git branch feature-xyz`"
                },
                {
                    command: "git checkout",
                    usage: "git checkout [branche|fichier]",
                    explanation: "Bascule vers une autre branche ou restaure un fichier dans son dernier état.",
                    advice: "Utilisez cette commande pour passer d'une branche à l'autre. N'oubliez pas de valider vos modifications avant de changer de branche.",
                    example: "Exemple : `git checkout feature-xyz`"
                },
                {
                    command: "git switch",
                    usage: "git switch [branche]",
                    explanation: "Permet de changer de branche, remplaçant `git checkout` dans ce contexte.",
                    advice: "La commande `git switch` est une alternative plus simple et intuitive à `git checkout` pour le changement de branche.",
                    example: "Exemple : `git switch feature-xyz`"
                },
                {
                    command: "git merge",
                    usage: "git merge [branche]",
                    explanation: "Fusionne les changements de la branche spécifiée dans la branche courante.",
                    advice: "Assurez-vous de tester vos changements localement avant de fusionner, et résolvez les conflits si nécessaire.",
                    example: "Exemple : `git merge feature-xyz`"
                },
                {
                    command: "git push",
                    usage: "git push [remote] [branche]",
                    explanation: "Pousse les commits locaux vers un dépôt distant.",
                    advice: "Utilisez cette commande pour partager vos changements avec d'autres personnes travaillant sur le projet. Assurez-vous que votre branche est à jour avant de pousser.",
                    example: "Exemple : `git push origin main`"
                },
                {
                    command: "git pull",
                    usage: "git pull [remote] [branche]",
                    explanation: "Récupère les modifications du dépôt distant et les fusionne avec la branche courante.",
                    advice: "Avant de pousser vos changements, utilisez `git pull` pour vous assurer que vous travaillez sur la version la plus récente du code.",
                    example: "Exemple : `git pull origin main`"
                },
                {
                    command: "git reset",
                    usage: "git reset [--soft|--hard] [commit]",
                    explanation: "Réinitialise l'index ou la branche actuelle à un état donné. `--hard` efface les modifications locales.",
                    advice: "Utilisez `git reset --soft` pour revenir à un commit précédent tout en conservant les modifications dans votre répertoire de travail.",
                    example: "Exemple : `git reset --hard HEAD~1`"
                },
                {
                    command: "git stash",
                    usage: "git stash",
                    explanation: "Sauvegarde les changements non validés temporairement, permettant de revenir à un état propre.",
                    advice: "Cette commande est utile lorsque vous devez changer de branche sans vouloir valider vos changements en cours.",
                    example: "Exemple : `git stash`"
                }
            ]
        }
    ];

    // Fonction pour installer Git (instructions pour chaque plateforme)
    function getInstallInstructions() {
        return `
        <h4>Installation de Git :</h4>
        <ul>
            <li><b>Windows :</b> Téléchargez Git à partir de <a href="https://git-scm.com/download/win" target="_blank">Git pour Windows</a> et suivez les instructions de l'installateur.</li>
            <li><b>MacOS :</b> Utilisez Homebrew : <code>brew install git</code> ou téléchargez l'installateur à partir de <a href="https://git-scm.com/download/mac" target="_blank">Git pour Mac</a>.</li>
            <li><b>Linux (Ubuntu) :</b> Exécutez <code>sudo apt install git</code> dans le terminal.</li>
            <li><b>Linux (Fedora) :</b> Exécutez <code>sudo dnf install git</code> dans le terminal.</li>
            <li><b>Linux (Arch) :</b> Exécutez <code>sudo pacman -S git</code> dans le terminal.</li>
        </ul>
        <p>Après l'installation, vérifiez que Git est bien installé en exécutant la commande : <code>git --version</code>.</p>
        `;
    }

    // Création du panneau
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "10px";
    panel.style.right = "10px";
    panel.style.width = "500px";
    panel.style.maxHeight = "80vh";
    panel.style.overflowY = "auto";
    panel.style.backgroundColor = "white";
    panel.style.color = "black";
    panel.style.border = "1px solid #ccc";
    panel.style.borderRadius = "10px";
    panel.style.padding = "20px";
    panel.style.zIndex = "9999";
    panel.style.display = "none"; // initialement caché

    // Contenu du panneau : Recherche et explication
    const title = document.createElement("h3");
    title.textContent = "Git Helper";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.classList.add("form-control");
    searchInput.placeholder = "Recherche par mots clés...";

    const resultsContainer = document.createElement("div");
    resultsContainer.style.marginTop = "10px";

    // bouton pour fermer le panneau
    const closeButton = document.createElement("button");
    closeButton.classList.add("btn", "btn-danger");
    closeButton.textContent = "Fermer l'application";
    closeButton.onclick = function () {
        panel.style.display = "none";
    };

    // bouton pour afficher l'installation de Git
    const installButton = document.createElement("button");
    installButton.classList.add("btn", "btn-info");
    installButton.textContent = "Installation de Git";
    installButton.onclick = function () {
        resultsContainer.innerHTML = getInstallInstructions();
    };

    // bouton pour afficher des explications détaillées
    const explanationButton = document.createElement("button");
    explanationButton.classList.add("btn", "btn-primary");
    explanationButton.textContent = "Afficher les explications";
    explanationButton.onclick = function () {
        resultsContainer.innerHTML = gitSections[0].details.map(command => `
            <div>
                <strong>${command.command}</strong> : ${command.explanation} <br>
                <em>Conseil :</em> ${command.advice}<br>
                <em>Exemple :</em> ${command.example}<br><br>
            </div>
        `).join('');
    };

    panel.appendChild(title);
    panel.appendChild(searchInput);
    panel.appendChild(installButton);
    panel.appendChild(explanationButton);
    panel.appendChild(resultsContainer);
    panel.appendChild(closeButton);

    // panneau
    document.body.appendChild(panel);

    // Fonction de recherche
    function searchCommands(query) {
        const lowerQuery = query.toLowerCase();
        const matches = gitSections[0].details.filter(command => {
            return command.command.toLowerCase().includes(lowerQuery) || command.explanation.toLowerCase().includes(lowerQuery);
        });

        resultsContainer.innerHTML = "";
        matches.forEach(command => {
            const commandElem = document.createElement("div");
            commandElem.innerHTML = `<strong>${command.command}</strong> : ${command.explanation}`;
            resultsContainer.appendChild(commandElem);
        });
    }

    // Event listener pour la recherche
    searchInput.addEventListener("input", function () {
        searchCommands(searchInput.value);
    });

    // Fonction de raccourci clavier pour ouvrir/fermer le panneau
    document.addEventListener("keydown", function (event) {
        if ((event.ctrlKey && event.key === "G") || (event.metaKey && event.key === "G")) {  // Raccourci Ctrl+G ou Cmd+G
            if (panel.style.display === 'none') {
                panel.style.display = 'block';
                explanationButton.click();
            } else {
                panel.style.display = 'none';
            }
        }
    });
})();
