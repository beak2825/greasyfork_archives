// ==UserScript==
// @name        JKLM Cheat dictionary
// @namespace   JKLM Cheat dictionary
// @author      Macadelic
// @version     1.8
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @description JKLM.FUN Overlay
// @match        https://jklm.fun/*
// @match        https://*.jklm.fun/games/bombparty/
// @match        https://jklm.macadelic.me/*
// @license MIT
// @match        *://*.jklm.dannyhpy.wip.la/*
// @match        https://*.jklm.macadelic.me/games/bombparty/
// @match        http://jklm.macadelic.me/*
// @match        http://*.jklm.macadelic.me/games/bombparty/
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/490969/JKLM%20Cheat%20dictionary.user.js
// @updateURL https://update.greasyfork.org/scripts/490969/JKLM%20Cheat%20dictionary.meta.js
// ==/UserScript==

//-----------------------------------------------------------------------------------------------------------------------------------
function roomScript(){
    console.log("Room Script started")

    var dictionary = null
    var selectedWords = null
    var highlightSyllable = true
    var highlightBonusLetters = false
    var showFloatingElement = false
    var sortMode = "random"
    var syllable = null
    var currentPlayerBonusLetters = null
    var newDictionary = null

    function sendMessageToGame(message, data){
        if (typeof data !== 'undefined') {
            document.querySelector('iframe').contentWindow.postMessage({name:message, data: data }, '*')
        } else {
            document.querySelector('iframe').contentWindow.postMessage({name:message}, '*')
        }
    }

    //Message Listener
    window.addEventListener("message", function(event) {
        if (event.data.name === "selectedWordsChange"){
            selectedWords = event.data.data.selectedWords
        }
        if (event.data.name === "updateGameVariables"){
            syllable = event.data.data.syllable
            currentPlayerBonusLetters = event.data.data.currentPlayerBonusLetters
        }
        if (event.data.name === "display"){
            displayWords()
        }
        if(event.data.name === "updateNewDictionary"){
            newDictionary = event.data.data.newDictionary
            updateNewWordsCounter()
        }
    });

    //------------------------------------------------------------------------------------------------------HTML
    // Ajout du bouton de cheat dans les onglets
    $(".tabs").append(`<a href="#" class="cheat" title="Cheat">🔧</a>`);

    // Ajout du panneau cheat dans la barre latérale
    $(".sidebar").append(`<div class="cheat pane" hidden></div>`);

    // Modification du style des étiquettes dans les paramètres sombres
    $(".darkSettings > fieldset .label").css("background-color", "rgba(255, 255, 255, 0.1)");

    // Remplissage du panneau cheat avec les paramètres
    $(".sidebar > .pane.cheat").html(`
    <div class="darkSettings darkScrollbar">
        <fieldset>
            <div class="setting display">
                <div class="label">🖥️ Affichage</div>
                <div class="field" id="wordDisplay"></div>
            </div>
        </fieldset>
        <fieldset>
            <div class="setting dictionnary">
                <div class="label ">📙 Dictionnaire</div>
                <div class="field"></div>
            </div>
        </fieldset>
        <fieldset>
            <div class="setting misc">
                <div class="label">⚙️ Options</div>
                <div class="field"></div>
            </div>
        </fieldset>
    </div>
    `);


    $(".pane.cheat .dictionnary > .field").html(`
    <p>Sélectionner un fichier texte contenant le dictionnaire à charger (format .txt)</p>
    <p>Il est possible de fournir un fichier texte contenant l'occurrence de chaque mot, avec le format "mot;occurrence" pour chaque ligne</p>
    <div class="formGroup" id="formGroupDictionary" title="Importer une liste de mots.">
        <input type="file" accept="text/plain" id="importDictionnary" />
        <br><br>
        <input type="button" id="downloadDictionary" value="Exporter le nouveau dictionnaire"></input>
        <br><br>
        <label id="wordCountLabel"></label>
        <br>
        <label id="newWordDictionary"></label>
    </div>
    `);

    $(".pane.cheat .display > .field").html(`
    <p>Un dictionnaire doit être fourni pour l'affichage des mots</p>
    `);

    $(".pane.cheat .misc > .field").html(`
    <p>Gérer les paramètres liés à l'affichage des mots</p>
    <div class="formGroup" title="Mettre en surbrillance dans l'affichage">
        <label>Mettre en surbrillance la syllabe</label>
        <select id="highlightSyllable" data-type="boolean">
            <option value="1" selected>Activé</option>
            <option value="2">Désactivé</option>
        </select>
        <label>Mettre en surbrillance les lettres bonus</label>
        <select id="highlightBonusLetters" data-type="boolean">
            <option value="1">Activé</option>
            <option value="2" selected>Désactivé</option>
        </select>
        <label>Afficher une fenêtre flotante</label>
        <select id="showWordFloat" data-type="boolean">
            <option value="1">Activé</option>
            <option value="2" selected>Désactivé</option>
        </select>
    </div>
    <label>Triage l'affichage des mots</label>
    <select id="sortMode">
        <option value="1" selected>Aléatoire</option>
        <option value="2">Occurrence</option>
        <option value="3">Lettres bonus</option>
        <option value="4">Mot court</option>
        <option value="5">Mot long</option>
    </select>
    `);

    //--------------------------------------------------------------------------------------Ecouteurs d'événements
    // Gestion du clic sur les onglets
    $(".tabs > a").on("click", (event) => {
        const clickedTab = $(event.target),
              clickedTabClass = clickedTab.attr("class").split(" ")[0];
        if ("cheat" !== clickedTabClass) return;
        const activeTabClass = $(".tabs > a.active").attr("class").split(" ")[0],
              activeTab = $(".tabs > a.active");
        $(`.sidebar > .${activeTabClass}.pane`).prop("hidden", true);
        activeTab.removeClass("active");
        $(`.sidebar > .pane.${clickedTabClass}`).prop("hidden", false);
        clickedTab.addClass("active");
    });

    $(".darkSettings > fieldset .label").each((index, labelElement) => {
        const $label = $(labelElement);
        $label.css("cursor", "pointer");
        $label.next().hide();
        $label.on("click", () => {
            if ($('div.setting.chat').length > 0){$label.next().next().toggle()}
            else{$label.next().toggle()}
        });
    });

    // Écouteur d'événements pour détecter le changement dans le champ de fichier
    $('#importDictionnary').on('change', async function(event) {
        const file = event.target.files[0];
        processFile(file)
    });

    $("#showWordFloat").on("change", function() {
        const selectedValue = $(this).val();
        if (selectedValue === "1") {showFloatingElement = true}
        else if (selectedValue === "2") {showFloatingElement = false}
        sendMessageToGame("showFloatingElement", {"show":showFloatingElement})

    })

    $("#highlightSyllable").on("change", function() {
        const selectedValue = $(this).val();
        if (selectedValue === "1") {highlightSyllable = true}
        else if (selectedValue === "2") {highlightSyllable = false}
        if (dictionary != null && syllable != null){
            displayWords()
            sendMessageToGame("updateHighlightVariables", {"highlightSyllable":highlightSyllable,"highlightBonusLetters":highlightBonusLetters})
            sendMessageToGame("displayFloatingElement")
        }

    });

    $("#highlightBonusLetters").on("change", function() {
        const selectedValue = $(this).val();
        if (selectedValue === "1") {highlightBonusLetters = true}
        else if (selectedValue === "2") {highlightBonusLetters = false}
        if (dictionary != null && syllable != null){
            displayWords()
            sendMessageToGame("updateHighlightVariables", {"highlightSyllable":highlightSyllable,"highlightBonusLetters":highlightBonusLetters})
            sendMessageToGame("displayFloatingElement")
        }
    });

    $("#sortMode").on("change", function() {
        const selectedValue = $(this).val();
        if (selectedValue === "1") {sortMode = "random"}
        else if (selectedValue === "2") {sortMode = "occurrence"}
        else if (selectedValue === "3") {sortMode = "bonusLetters"}
        else if (selectedValue === "4") {sortMode = "shortWords"}
        else if (selectedValue === "5") {sortMode = "longWords"}
        if (dictionary != null && syllable != null){
            sendMessageToGame("sortModeChange", {"sortMode":sortMode})
            displayWords()
            sendMessageToGame("displayFloatingElement")
        }
    });

    $("#downloadDictionary").on("click", function() {
        if (dictionary == null){
            alert("Une erreur s'est produite. Veuillez d'abord importer un dictionnaire.")
        }
        else if (dictionary != null && newDictionary == null){
            alert("Une erreur s'est produite. Aucun nouveau mot n'a été enregistré.")
        }
        else if (dictionary != null && newDictionary != null){
            var finalDic = dictionaryMerge(dictionary, newDictionary)
            downloadFile(finalDic,"newDictionary")
        }
    });

    //--------------------------------------------------------------------------------------Fontions

    function processFile(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            const lines = content.split('\n'); // Divise le contenu en lignes
            dictionary = lines.map(line => {
                const [word, occurrences] = line.split(';').map(item => item.trim()); // Sépare le mot de ses occurrences et enlève les espaces vides
                return { word, occurrences: occurrences ? parseInt(occurrences) : 1 }; // Si aucune occurrence n'est spécifiée, attribue 1
            });
            const wordCount = dictionary.length;
            $('#wordCountLabel').text(`✅ ${wordCount} mots chargés`);
            sendMessageToGame("dictionaryLoaded", dictionary)
        };
        reader.readAsText(file);
    }

    function downloadFile(data, name) {
        var fileContent = '';
        for (var key in data) {
            fileContent += data[key].word + ";" + data[key].occurrences + "\n";
        }
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    function dictionaryMerge(dictionary1, dictionary2) {
        // Créer un dictionnaire temporaire pour le deuxième dictionnaire
        var tempDictionary = {};
        for (var j = 0; j < dictionary2.length; j++) {
            var word2 = dictionary2[j].word;
            var occurrences2 = dictionary2[j].occurrences;
            tempDictionary[word2] = occurrences2;
        }

        // Parcourir le premier dictionnaire et fusionner les occurrences
        for (var k = 0; k < dictionary1.length; k++) {
            var word1 = dictionary1[k].word;
            var occurrences1 = dictionary1[k].occurrences;
            if (word1 in tempDictionary) {
                tempDictionary[word1] += occurrences1;
            } else {
                tempDictionary[word1] = occurrences1;
            }
        }

        // Convertir le dictionnaire temporaire en tableau d'objets
        var mergedDictionary = [];
        for (var word in tempDictionary) {
            mergedDictionary.push({ "word": word, "occurrences": tempDictionary[word] });
        }

        return mergedDictionary;
    }

    function updateNewWordsCounter(){
        $('#newWordDictionary').text(`📊 ${newDictionary.length} nouvelles occurrences chargés`);
    }

    function displayWords() {
        $("#wordDisplay").empty();

        selectedWords.forEach(wordObj => {
            var highlightedWord = wordObj.word.toUpperCase();
            var syllableUpperCase = syllable.toUpperCase();
            const syllableIndex = highlightedWord.indexOf(syllableUpperCase);

            // Vérifier si highlightSyllable et highlightBonusLetters sont activés en même temps
            const isHighlightSyllable = highlightSyllable;
            const isHighlightBonusLetters = highlightBonusLetters;
            const isBothActivated = isHighlightSyllable && isHighlightBonusLetters;

            // Si les deux sont activés en même temps, choisir de prioriser l'un
            if (isBothActivated) {
                highlightedWord = highlightedWord.toLowerCase()
                const bonusLetters = currentPlayerBonusLetters;
                let syllabeIndex = highlightedWord.indexOf(syllable);
                let syllabeEndIndex = syllabeIndex + syllable.length;
                let coloredWord = ''
                for (let i = 0; i < highlightedWord.length; i++) {
                    let lettre = highlightedWord[i];
                    if (i === syllabeIndex) {
                        coloredWord += "<span style='color: #00ff00;'>" + syllable.toUpperCase() + "</span>";
                        i = syllabeEndIndex - 1;
                    } else if (i >= syllabeIndex && i < syllabeEndIndex) {
                        continue;
                    } else if (bonusLetters[lettre]) {
                        coloredWord += "<span style='color: red;'>" + lettre.toUpperCase() + "</span>";
                    } else {
                        coloredWord += lettre.toUpperCase();
                    }
                }
                highlightedWord = coloredWord;
            } else {
                // Si l'un ou l'autre est activé, ou aucun
                if (isHighlightSyllable){
                    highlightedWord = highlightedWord.substring(0, syllableIndex) +
                        "<span style='color: #00ff00;'>" + syllable.toUpperCase() + "</span>" +
                        highlightedWord.substring(syllableIndex + syllable.length);
                }

                if (isHighlightBonusLetters) {
                    const bonusLetters = currentPlayerBonusLetters;
                    let coloredWord = "";
                    highlightedWord.split('').forEach(letter => {
                        const uppercaseLetter = letter.toUpperCase();
                        if (bonusLetters.hasOwnProperty(uppercaseLetter.toLowerCase()) && bonusLetters[uppercaseLetter.toLowerCase()] > 0) {
                            coloredWord += "<span style='color: red;'>" + letter + "</span>";
                        } else {
                            coloredWord += letter;
                        }
                    });
                    highlightedWord = coloredWord;
                }
            }

            const wordElement = $("<div>").html(highlightedWord);
            wordElement.css({
                "color": "white",
                "text-align": "left",
                "font-size": "20px"
            });

            $("#wordDisplay").append(wordElement);
        });
    }
}


//-----------------------------------------------------------------------------------------------------------------------------------
function gameScript(){
    console.log("Room Script started")

    var playersList = []
    var selectedWords = null
    var currentSyllable = null
    var currentPlayerPeerId = null
    var currentPlayerBonusLetters = null
    var usedWords = []
    var dictionary = null
    var sortMode = "random"
    var highlightSyllable = true
    var highlightBonusLetters = false
    var newDictionary = []
    let initialMouseX;
    let initialMouseY;
    let initialElementX;
    let initialElementY;
    let isDragging = false;

    function sendMessageToRoom(message, data){
        if (typeof data !== 'undefined') {
            window.parent.postMessage({ name: message, data: data }, "*");
        } else {
            window.parent.postMessage({ name: message }, "*");
        }
    }

    //Message Listener
    window.addEventListener("message", function(event) {
        if(event.data.name === "dictionaryLoaded"){
            dictionary = event.data.data
            display()
        }
        if(event.data.name === "showFloatingElement"){
            showFloating(event.data.data)
        }
        if(event.data.name === "sortModeChange"){
            sortMode = event.data.data.sortMode
            if (dictionary != null && currentSyllable != null){
                selectWords()
            }
        }
        if (event.data.name === "displayFloatingElement"){
            displayFloatingElement()
        }
        if (event.data.name === "updateHighlightVariables"){
            updateHighlightVariables(event.data.data)
        }
    });

    //---------------------------------------------------------------------------------HTML

    //Floating Element
    $(".middle").append(`
        <div id="floatingElement" class="floating-element" hidden>
            <div class="field" id="wordDisplayFloating"></div>
        </div>
        <style>
        .floating-element {
            position: absolute;
            background-color: rgba(241, 241, 241, 0.05);
            padding: 10px;
            cursor: move;
            border-radius: 10px;
        },
        </style>`)

    //---------------------------------------------------------------------------------Element listeners

    $("#floatingElement").mousedown(function(event) {
        isDragging = true;
        initialMouseX = event.clientX;
        initialMouseY = event.clientY;
        initialElementX = $("#floatingElement").offset().left;
        initialElementY = $("#floatingElement").offset().top;
    });

    $(document).mouseup(function() {
        isDragging = false;
    });

    $(document).mousemove(function(event) {
        if (isDragging) {
            const deltaX = event.clientX - initialMouseX;
            const deltaY = event.clientY - initialMouseY;

            // Limites de déplacement à l'intérieur de la zone parente
            const parentWidth = $(".middle").width();
            const parentHeight = $(".middle").height();
            const elementWidth = $("#floatingElement").width();
            const elementHeight = $("#floatingElement").height();

            // Calculer les nouvelles positions de l'élément flottant
            let newLeft = initialElementX + deltaX;
            let newTop = initialElementY + deltaY;

            // Limiter le déplacement à l'intérieur de la zone parente
            if (newLeft < 0) {
                newLeft = 0;
            } else if (newLeft + elementWidth > parentWidth) {
                newLeft = parentWidth - elementWidth;
            }

            if (newTop < 0) {
                newTop = 0;
            } else if (newTop + elementHeight > parentHeight) {
                newTop = parentHeight - elementHeight;
            }

            // Déplacer l'élément flottant aux nouvelles positions calculées
            $("#floatingElement").css({
                "left": newLeft + "px",
                "top": newTop + "px"
            });
        }
    });


    //--------------------------------------------------------------------------------------------------Fonctions

    class Player {
        constructor(peerId = null, nickname = null, language = null, roles = null){
            this.peerId = peerId;
            this.nickname = nickname;
            this.language = language;
            this.roles = roles;
            this.bonusLetters = [];
            this.word = "";
        }

        updateGeneralInfo(jsonData) {
            this.auth(jsonData[2].auth)
            this.language(jsonData[2].language)
            this.nickname(jsonData[2].nickname)
            this.peerId(jsonData[2].peerId)
            this.roles(jsonData[2].roles)
        }

        updateGameInfo() {
            this.word = ""
        }
    }

    function addPlayer(json){
        playersList.push(new Player(json.profile.peerId,json.profile.nickname,json.profile.language,json.profile.roles))
    }

    function findPlayerByPeerId(playerPeerId) {
        const player = playersList.find(player => player.peerId === playerPeerId);
        return player || null;
    }

    function removeDuplicatesByPeerId(players) {
        const uniqueIds = new Set();
        const filteredList = players.filter(player => {
            if (!uniqueIds.has(player.peerId)) {
                uniqueIds.add(player.peerId);
                return true;
            }
            return false;
        });
        return filteredList;
    }

    function removePlayer(peerIdToRemove){
        const indexToRemove = playersList.findIndex(player => player.peerId === peerIdToRemove);
        if (indexToRemove !== -1) {
            playersList.splice(indexToRemove, 1);
        }
    }

    function filterPositiveValues(dictionary) {
        const filteredDictionary = {};
        for (const letter in dictionary) {
            if (dictionary.hasOwnProperty(letter) && dictionary[letter] > 0) {
                filteredDictionary[letter] = dictionary[letter];
            }
        }
        return filteredDictionary;
    }

    function addNewWord(word) {
        var existingWord = newDictionary.find(entry => entry.word === word);
        if (existingWord) {
            existingWord.occurrence++;
        } else {
            newDictionary.push({ "word": word, "occurrences": 1 });
        }
    }

    function selectWords(){
        if (sortMode == "random"){
            selectRandomWords()
        }
        else if (sortMode == "occurrence"){
            selectWordsWithMostOccurrence()
        }
        else if (sortMode == "bonusLetters"){
            selectWordsWithSyllableAndBonusLetters()
        }
        else if (sortMode == "shortWords"){
            selectShortWords()
        }
        else if (sortMode == "longWords"){
            selectLongWords()
        }
        sendMessageToRoom("selectedWordsChange", {"selectedWords":selectedWords})
        sendMessageToRoom("display")
    }

    function selectRandomWords() {
        const wordsWithSyllable = dictionary.filter(word => word.word.includes(currentSyllable) && !usedWords.includes(word.word));
        const numWordsToShow = Math.min(wordsWithSyllable.length, 10);
        const shuffledWords = shuffleArray(wordsWithSyllable);
        selectedWords = shuffledWords.slice(0, numWordsToShow);
    }

    function selectShortWords() {
        const wordsWithSyllable = dictionary.filter(word => word.word.includes(currentSyllable) && !usedWords.includes(word.word));
        const sortedWords = wordsWithSyllable.sort((a, b) => a.word.length - b.word.length);
        selectedWords = sortedWords.slice(0, 10);
    }

    function selectLongWords() {
        const wordsWithSyllable = dictionary.filter(word => word.word.includes(currentSyllable) && !usedWords.includes(word.word));
        const sortedWords = wordsWithSyllable.sort((a, b) => b.word.length - a.word.length);
        selectedWords = sortedWords.slice(0, 10);
    }

    function selectWordsWithMostOccurrence() {
        const wordsWithSyllable = dictionary.filter(word => {
            return word.word.includes(currentSyllable) && !usedWords.includes(word.word);
        });
        const sortedWords = wordsWithSyllable.sort((a, b) => b.occurrences - a.occurrences);
        const numWordsToShow = Math.min(sortedWords.length, 10);
        selectedWords = sortedWords.slice(0, numWordsToShow);
    }

    function selectWordsWithSyllableAndBonusLetters() {
        const filteredWords = dictionary.filter(word => {
            if (word.word.includes(currentSyllable) && !usedWords.includes(word.word)) {
                const wordLetters = word.word.toLowerCase().split('');
                let missingBonusLettersCount = 0;
                for (const letter of wordLetters) {
                    if (currentPlayerBonusLetters[letter] > 0) {
                        missingBonusLettersCount++;
                    }
                }
                word.missingBonusLetters = missingBonusLettersCount;
                return true;
            }
            return false;
        })
        const sortedWords = filteredWords.sort((a, b) => b.missingBonusLetters - a.missingBonusLetters);
        selectedWords = sortedWords.slice(0, 10);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateGameVariables(syllable, currentPlayerBonusLetters){
        sendMessageToRoom("updateGameVariables", {"syllable":currentSyllable, "currentPlayerBonusLetters":currentPlayerBonusLetters})
    }

    function display(){
        if (dictionary != null && currentSyllable != null){
            selectWords()
            if (selectedWords != null){
                sendMessageToRoom("display")
                displayFloatingElement()
            }
        }
    }

    function updateHighlightVariables(data){
        highlightSyllable = data.highlightSyllable
        highlightBonusLetters = data.highlightBonusLetters
    }

    function displayFloatingElement(){

        $("#wordDisplayFloating").empty();

        selectedWords.forEach(wordObj => {
            var highlightedWord = wordObj.word.toUpperCase();
            var syllableUpperCase = currentSyllable.toUpperCase()
            const syllableIndex = highlightedWord.indexOf(syllableUpperCase);

            // Vérifier si highlightSyllable et highlightBonusLetters sont activés en même temps
            const isHighlightSyllable = highlightSyllable;
            const isHighlightBonusLetters = highlightBonusLetters;
            const isBothActivated = isHighlightSyllable && isHighlightBonusLetters;

            // Si les deux sont activés en même temps, choisir de prioriser l'un
            if (isBothActivated) {
                let highlightedWordBis = wordObj.word.toLowerCase()
                const bonusLetters = currentPlayerBonusLetters;
                let syllabeIndex = highlightedWordBis.indexOf(currentSyllable);
                let syllabeEndIndex = syllabeIndex + currentSyllable.length;
                let coloredWord = ''
                for (let i = 0; i < highlightedWordBis.length; i++) {
                    let lettre = highlightedWordBis[i];
                    if (i === syllabeIndex) {
                        coloredWord += "<span style='color: #00ff00;'>" + currentSyllable.toUpperCase() + "</span>";
                        i = syllabeEndIndex - 1;
                    } else if (i >= syllabeIndex && i < syllabeEndIndex) {
                        continue;
                    } else if (bonusLetters[lettre]) {
                        coloredWord += "<span style='color: red;'>" + lettre.toUpperCase() + "</span>";
                    } else {
                        coloredWord += lettre.toUpperCase();
                    }
                }
                highlightedWord = coloredWord;
            } else {
                // Si l'un ou l'autre est activé, ou aucun
                if (isHighlightSyllable){
                    highlightedWord = highlightedWord.substring(0, syllableIndex) +
                        "<span style='color: #00ff00;'>" + currentSyllable.toUpperCase() + "</span>" +
                        highlightedWord.substring(syllableIndex + currentSyllable.length);
                }

                if (isHighlightBonusLetters) {
                    const bonusLetters = currentPlayerBonusLetters;
                    let coloredWord = "";
                    highlightedWord.split('').forEach(letter => {
                        const uppercaseLetter = letter.toUpperCase();
                        if (bonusLetters.hasOwnProperty(uppercaseLetter.toLowerCase()) && bonusLetters[uppercaseLetter.toLowerCase()] > 0) {
                            coloredWord += "<span style='color: red;'>" + letter + "</span>";
                        } else {
                            coloredWord += letter;
                        }
                    });
                    highlightedWord = coloredWord;
                }
            }

            const wordElement = $("<div>").html(highlightedWord);
            wordElement.css({
                "color": "white",
                "text-align": "left",
                "font-size": "20px"
            });
            $("#wordDisplayFloating").append(wordElement);
        });
    }

    function showFloating(data) {
        var show = data.show
        if (show) {$("#floatingElement").prop("hidden", false);}
        else {$("#floatingElement").prop("hidden", true);}
    }

    //-----------------------------------------------------------------------------------------------------------Sockets
    socket.on("setup", (setup) =>{
            for (const player of setup.players) {playersList.push(new Player(player.profile.peerId,player.profile.nickname,player.profile.language,player.profile.roles));}
            switch (setup.milestone.name) {
                case "round":
                    var currentPlayer = findPlayerByPeerId(setup.milestone.currentPlayerPeerId)
                    var bonusLetters = filterPositiveValues(currentPlayer.bonusLetters)
                    currentSyllable = setup.milestone.syllable
                    currentPlayerPeerId = setup.milestone.currentPlayerPeerId
                    currentPlayerBonusLetters = bonusLetters
                    updateGameVariables(currentSyllable, currentPlayerBonusLetters)
                    display()
                    playersList.forEach(player => {
                        player.updateGameInfo();
                        const bonusLettersObj = setup.milestone.playerStatesByPeerId[player.peerId];
                        if (bonusLettersObj && bonusLettersObj.bonusLetters) {
                            player.bonusLetters = bonusLettersObj.bonusLetters;
                        }
                    });
                    break;
                case "seating":
                    break;
            }
        })
        socket.on("setMilestone", (milestone) => {
            switch (milestone.name) {
                case "round":
                    var currentPlayer = findPlayerByPeerId(milestone.currentPlayerPeerId)
                    var bonusLetters = filterPositiveValues(currentPlayer.bonusLetters)
                    currentSyllable = milestone.syllable
                    currentPlayerPeerId = milestone.currentPlayerPeerId
                    currentPlayerBonusLetters = bonusLetters
                    updateGameVariables(currentSyllable, currentPlayerBonusLetters)
                    display()
                    playersList.forEach(player => {
                        player.updateGameInfo();
                        const bonusLettersObj = milestone.playerStatesByPeerId[player.peerId];
                        if (bonusLettersObj && bonusLettersObj.bonusLetters) {
                            player.bonusLetters = bonusLettersObj.bonusLetters;
                        }
                    });
                    break;
                case "seating":
                    playersList = []
                    break;
            }
        });
        socket.on("setPlayerWord", (playerPeerId, word, isSend) => {
            let currentPlayer = findPlayerByPeerId(playerPeerId)
            currentPlayer.word = word
        })

		socket.on("nextTurn", (playerPeerId, syllable, turnWithSameSyllable) => {
            let currentPlayer = findPlayerByPeerId(playerPeerId)
            var bonusLetters = filterPositiveValues(currentPlayer.bonusLetters)
            currentSyllable = syllable
            currentPlayerPeerId = playerPeerId
            currentPlayerBonusLetters = bonusLetters
            updateGameVariables(currentSyllable, currentPlayerBonusLetters)
            display()
        });
        socket.on("correctWord", ({ playerPeerId, bonusLetters }) => {
            let currentPlayer = findPlayerByPeerId(playerPeerId)
            currentPlayer.bonusLetters = bonusLetters
            var correctWord = currentPlayer.word.replace(/[^a-zA-Z-']/gi, '')
            usedWords.push(correctWord)
            addNewWord(correctWord)
            sendMessageToRoom("updateNewDictionary", {"newDictionary":newDictionary})
        });
        socket.on("addPlayer", (playerInformations) => {
            addPlayer(playerInformations);
        });
        socket.on("removePlayer", (playerPeerId) => {
            removePlayer(playerPeerId);
        });

}

//-----------------------------------------------------------------------------------------------------------------------------------
window.addEventListener("load", function() {
    if (window.top == window.self){ //Room
        roomScript();
    }
    else if (window.top !== window.self) { //Game
        gameScript();
    }
});
