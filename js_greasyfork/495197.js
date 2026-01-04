// ==UserScript==
// @name         Таминг экзамен
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Поиск ответов на экзаменационные вопросы в игре Taming.io, находиться в разработке, чтобы получть ответ автоматически просто нажмите на кнопку в меню тампермонкей ещё 2 раза!
// @author       futlirox
// @match        https://taming.io/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/495197/%D0%A2%D0%B0%D0%BC%D0%B8%D0%BD%D0%B3%20%D1%8D%D0%BA%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/495197/%D0%A2%D0%B0%D0%BC%D0%B8%D0%BD%D0%B3%20%D1%8D%D0%BA%D0%B7%D0%B0%D0%BC%D0%B5%D0%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const taming = {
        "If someone asks you for your password and email to give you golden apples or help you in any way, who are they?": "A liar, a scammer, and a thief.",
        "What do you risk if you share your account?": "Getting banned",
        "What is the only way to give golden apples to a friend?": "Using the Taming gift code system in the shop.",
        "With whom are you allowed to share your account?": "No one",
        "How long does it take for a score to disappear from your scoreboard without the VIP pass?": "21 days",
        "How many hits does fresh Tamer need to give to a log of wood to reach age 1?": "11",
        "What color is the beard of the mushroom boss?": "He doesn't have one.",
        "What does the baby shark do?": "Triple Jaws.",
        "Which resource can you use to eat in the game?": "Red apples",
        "Can you name your 3 pets the same way?": "Yes.",
        "Does the Reaper have wings?": "Yes",
        "What does the 'Wave effect' option do when activated in the settings?": "It's like playing underwater in the Ocean.",
        "What is the default baby [animal] attack (without any stat points)?": "Varies. SEE EXTRA INFO --> You can open the game in a new tab and open up the Tamodex to easily find the answer. For weight, choosing even numbers should yield the right answer.",
        "What is the default boss [animal] weight (without any stat points)?": "Varies. SEE EXTRA INFO --> You can open the game in a new tab and open up the Tamodex to easily find the answer. Smaller animals usually have smaller weight.",
        "How many different Tamons are there?": "111.",
        "What do clan competitions consist of?": "Capture Totems and earn points",
        "What happens when you kill an octopus boss?": "It cries",
        "Which pet can wear a crown?": "Giant Bee.",
        "Out of all pets, who is the best artist?": "Lynx.",
        "How many different types (and badges) are there?": "13",
        "What colors are the 6 hats without effects in the game?": "Red, Orange, Green, Blue, Cyan, Purple.",
        "What is a 'Tamon'?": "Tameable Monster",
        "What hat increases your chances when taming Tamons?": "Tamer's Cap",
        "In a team, how do you indicate a location to your teammates?": "By marking the minimap with an exclamation point",
        "What is the color of Mauve?": "Mauve",
        "How long does it take for a score to disappear from your scoreboard with the VIP pass?": "31 days.",
        "Can you use a fairy-type Tamon as a mount?": "No",
        "How can you tell the difference between dragon levels just by looking at their head?": "Marks on the nose.",
        "Which Tamon can't you select at the start of the game when playing for the first time?": "A Fox",
        "Which type does not exist?": "Ground / Gold / Steel / Dark. The non-existent type is usually a sub-type of an existing type (e.g. Gold would be a sub-type of Rock).",
        "How many dragons swim in the dragon egg boss?": "3.",
        "What is the flavor of cookies?": "Berries.",
        "How many Z's fly above the head of sleepingTamons?": "2",
        "How many Bosses (not Tamons) are there?": "13.",
        "When can you tame a Tamon?": "When it's asleep",
        "What happens when you buy items from Mauve?": "Golden apples fall from the ceiling of his shop",
        "Can you tame a boss Tamon?": "No.",
        "What causes the failure in preparing a potion?": "A black cat attracted by an insect",
        "What is an Appletor not used for?": "To plant apple trees",
        "What's the recipe for the potion: [potion]?": "Varies, see extra info --> You can just open up the Cooking section of the Profile menu and select the potion it is asking about to get your answer.",
        "Which Tamon is the smallest as a boss?": "Varies, see extra info --> You can open the game in a new tab and open up the Tamodex to easily find the answer. Smaller animals usually have smaller weight.",
        "How to get a Guardian's Heart": "Kill the 3 guardians and collect the chest in the sanctuary.",
        "What are rock-type Tamons afraid of?": "Gammarus.",
        "What happens if you wake up the BMB Siren?": "All of the statues wake up simultaneously",
        "Which Tamon does the least damage as a boss?": "Varies. If one of the answers mention a Shadow, it is most likely the answer due to the low damage dealt by Shadow Tamons.",
        "What do you call the different stages of Tamon evolution?": "Baby - Adult - Boss",
        "What's the maximum OB a Tamon can reach?": "30.",
        "What's the maximum level a Tamon can reach?": "60",
        "Which type has the most weaknesses?": "Plant",
        "Does an arrow deal more damage against a fairy-type Tamon?": "Yes by x1.5",
        "Does an arrow deal more damage against a mounted Tamon?": "Yes by x2.5",
        "Which wild Tamon is a coward as a boss?": "Varies. If the Tamon doesn't attack you upon touching it or going near it, it fits the criteria for being a coward.",
        "Do you necessarily have to kill a Tamon to get its experience?": "No.",
        "Which type has the fewest weaknesses?": "Electric",
        "Which butterfly does not exist?": "The Sun Butterfly.",
        "How many different insect(s) spawn naturally in the biome [biome]?": "The answer varies: 7 in Forest, 1 in Winter, 5 in Darkness, 4 in Desert, 5 in Sea / Ocean.",
        "Which Tamon has different abilities depending on the situation but not of its evolution?": "Giant Mantis, Genie, Flying Squirrel, and Krampus",
        "In which biome can you play football?": "Ocean.",
        "Which Tamon has different abilities depending on its evolution?": "Menhir, Goldfish, Reaper, and all Gazes",
        "What influence does an Tamon's weight have?": "Weight grants a damage bonus against buildings",
        "What's worse than a baby Flying Squirrel in a trash can?": "One baby Mauve in two trash cans.",
        "What is the [Water / Fire / Plant] Statue's weapon?": "The answer varies: Daggers for Plant Statue, Labrys for Water Statue, Katana for Fire Statue",
        "How many different BMBs spawn naturally in the biome [biome]?": "The answer varies: 3 in Forest, 1 in Winter, 4 in Darkness, 1 in Desert, 4 in Ocean.",
        "In food upgrades, what comes before the salad?": "The sandwich",
        "What does BMB stand for?": "Big Mama Boss",
        "What does OB stand for?": "Overbreed",
        "How to make an ice rink appear on the map?": "By attacking the Ice Dragon boss.",
        "How long does the [biome] biome last?": "The answer varies: 960s in Forest, 480s in Winter, 480s in Darkness, 480s in Desert, 480s in Ocean.",
        "How many spots does a Mauve have at boss age?": "16",
        "How many different Tamons are double-typed?": "28.",
        "How many [Apples / Stones] do you need to spend on average so that the probability of [animal] taming is exactly [percent] with a [Appletor / Slingshot] while [NOT] wearing the Lucky Hat?": "Varies, see extra info. This link is crucial for you to find the answer in a reasonable amount of time. For the k value, subtract the base taming chance of the animal from the wanted taming chance. If the question doesn't mention the Lucky Hat, change the p value to 0.95.",
        "How much gold does it take to buy all the hats in the shop (including the Golden Apple Hat)?": "419,700",
        "How many golden apples are needed to upgrade the totem to the maximum level?": "520",
        "What is the probability of a Golden Flower appearing when a biome changes?": "15%",
        "How many different tamons spawn naturally in the various biomes without any tamer intervention being required?": "48.",
        "If you take [1 or 2] Philter(s) of Aging II and [1 or 2] Philter(s) of Aging III what will your level be?": "Varies",
        "What is the probability of a Sea Porous Rock to not appear in the Ocean biome?": "6%",
        "What is the maximum number of buildings you can place?": "104",
        "Which butterfly emanates from the melancholy of the hidden sanctuary?": "The Blue Butterfly.",
        "Which disease can Bulls get?": "There are no diseases in Taming",
        "How much gold does it take to buy all the wings/capes/bags in the shop?": "263,000",
        "Which potion needs [ingredients] to be cooked?": "Varies. You can just open up the Cooking section of the Profile menu and search for the potion whose ingredients match up with the question.",
        "What's the exact probability of failing [number] times in a row the taming of a [animal] with only 3 Elixirs of Influence to help?": "Varies. To solve this, you need to add 15 to the tame chance of the animal, then subtract it from 100, and divide it by 100. Then, attach an exponent to the number (the exponent is the failed tames in a row) and multiply it by 100 for your final result.",
        "Supposed you have 3 Wargs, what's the limit of Tamons you can hold at once?": "More than 6",
        "Your total score is [number], your tenth best score is [number], what's the next minimum score you need to achieve to get the Fire Badge?": "Varies. To solve this, subtract the first number from 2,500,000, the score required for the Fire Badge. Then, add the tenth best score to it (since the next minimum score will replace it, it must be added to make up for that).",
        "What happens if you take three Guardian's Calls simultaneously?": "You spawn with 3 statues and you tame 3 statues.",
        "How many gifts can you unlock in an Adventure season?": "100",
        "What's the minimum sleep time for a [animal]? Assuming a complete circadian cycle.": "Varies. This question is incredibly tedious to solve.",
        "How many cactus are in the desert?": "85",
        "According to Professor Tamon, what is the minimum age required for a Tamer to set off alone on a potentially deadly adventure?": "5 years old",
        "What is the minimum sleep time for a BMB? Assuming a complete circadian cycle.": "15 minutes.",
        "What does the Lucky Hat not increase the probability of?": "Successful taming",
        "What is the probability of successfully taming at least [number] [animals] in [number] attempts without any hat and potion?": "Varies. This link can be used to solve the problem. Make sure to replace the p value with the animal's tame chance.",
    };
    let square = null;
    let input = null;
    let output = null;
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let isOpen = false;
    function createSquare() {
        if (square) return;

        square = document.createElement('div');
        square.id = 'tamerscript-search';
        square.classList.add('hidden');
        square.innerHTML = `
            <div id="tamerscript-header">Поиск ответов (Перетащите)</div>
            <input type="text" id="tamerscript-input" placeholder="Введите запрос...">
            <div id="tamerscript-output"></div>
            <button id="tamerscript-close">Закрыть</button>
        `;
        document.body.appendChild(square);

        input = document.getElementById('tamerscript-input');
        output = document.getElementById('tamerscript-output');

        document.getElementById('tamerscript-close').addEventListener('click', toggleSquare);
        input.addEventListener('input', searchAndDisplay);

        const header = document.getElementById('tamerscript-header');
        header.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);
    }

    function toggleSquare() {
        if (!isOpen) {
            square.classList.remove('hidden');
        } else {
            square.classList.add('hidden');
        }
        isOpen = !isOpen;
    }

    function searchAndDisplay() {
        const query = input.value.trim().toLowerCase();

        if (query === '') {
            output.innerHTML = '<p>Введите запрос для поиска ответа.</p>';
            return;
        }

        const results = Object.entries(taming).filter(([question, answer]) => {
            return question.toLowerCase().includes(query) || answer.toLowerCase().includes(query);
        });

        if (results.length === 0) {
            output.innerHTML = '<p>Нет результатов для вашего запроса.</p>';
            return;
        }

        output.innerHTML = results.map(([question, answer]) => {
            return `<div class="result"><strong>Ответ:</strong><br>${answer}</div>`;
        }).join('');
    }

    function startDragging(e) {
        isDragging = true;
        dragOffsetX = e.clientX - square.offsetLeft;
        dragOffsetY = e.clientY - square.offsetTop;
    }

    function drag(e) {
        if (!isDragging) return;
        square.style.left = `${e.clientX - dragOffsetX}px`;
        square.style.top = `${e.clientY - dragOffsetY}px`;
    }

    function stopDragging() {
        isDragging = false;
    }

    function addSearchInput() {
        const examQuestion = document.querySelector('#exam-question.shadowed');
        if (examQuestion) {
            input.value = examQuestion.textContent.trim();
            searchAndDisplay();
        }
    }

    function openMenu() {
        createSquare();
        toggleSquare();
        addSearchInput();
    }

    GM_registerMenuCommand('Открыть меню поиска ответов', openMenu);

    GM_addStyle(`
        #tamerscript-search {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 350px;
            padding: 20px;
            background-color: rgba(44, 62, 80, 0.95);
            color: white;
            border-radius: 12px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease-in-out;
            transform: translateY(-100vh);
        }

        #tamerscript-search.hidden {
            transform: translateY(-100vh);
        }

        #tamerscript-search:not(.hidden) {
            transform: translateY(0);
        }

        #tamerscript-header {
            width: 100%;
            text-align: center;
            font-weight: bold;
            margin-bottom: 15px;
            cursor: move;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        #tamerscript-input {
            width: 100%;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.2);
            color: white;
        }

        #tamerscript-input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }

        #tamerscript-output {
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
            padding-right: 5px;
            scrollbar-width: thin;
            scrollbar-color: #3498db rgba(255, 255, 255, 0.3);
        }

        #tamerscript-output::-webkit-scrollbar {
            width: 8px;
        }

        #tamerscript-output::-webkit-scrollbar-thumb {
            background-color: #3498db;
            border-radius: 10px;
        }

        .result {
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #666;
            border-radius: 8px;
            background-color: rgba(255, 255, 255, 0.1);
        }

        #tamerscript-close {
            margin-top: 10px;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            background-color: #e74c3c;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
        }

        #tamerscript-close:hover {
            background-color: #c0392b;
        }
    `);
})();