// ==UserScript==
// @name         Visual Ability Buttons
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  Creates visual ability buttons for ShuffleIt Dominion
// @author       ceviri
// @match        https://dominion.games/
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/383442/Visual%20Ability%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/383442/Visual%20Ability%20Buttons.meta.js
// ==/UserScript==

// Redundant!
/*
GM_addStyle(`
    .call-button, .call-button-done {
        position:relative;
        margin-bottom:6px;
        display: flex;
        align-items: center;
        z-index: 5000;
        border: 3px solid white;
    }
    .call-button {
        flex-direction: row-reverse;
        background-size: cover;
        background-position: center;
    }
    .call-button-done {
        background-color: black;
        justify-content: center;
        opacity: 0.8;
    }
    .call-button:hover, .call-button-done:hover {
        border-color: green;
    }
    .call-text {
        position: absolute;
        color: white;
        font-family: TrajanPro-Bold;
        font-size: 1.5vh;
        margin: 0 auto;
        background-color: rgba(0, 0, 0, 0.6);
        overflow:hidden;
        padding: 2px;
        z-index: 5001;

       -webkit-user-select: none;
       -moz-user-select: none;
       -ms-user-select: none;
        user-select: none;
    }
    .call-button .call-text {
        display: none;
    }
    .call-button:hover .call-text {
        display: initial;
    }
    .call-button-done .call-text {
        font-size: 3vh;
    }
    .mini-info {
        margin: 2px;
        background-size: cover;
        background-position: center center;
        border: 2px solid orange;
    }
`);

dominion_VAB = {
    state: {scale: 1, cards: []},
    renderSingle: function(entry) {
        var scale = dominion_VAB.state.scale;
        var height = MINI_CARD_HEIGHT * scale / 3;
        var width = MINI_CARD_WIDTH * scale * 1.3;
        var art = publicCardFactory.getNewAnonymousCard(entry.card).miniView.artURL;

        var inner = `<div class="call-text" style="left: 0px;"> ${LANGUAGE.getCardName[entry.card].singular} </div>`

        // Counter
        if (entry.count > 1) {
            inner +=
`
<div class="new-card-counter-container" style="transform:scale(${scale}); top:0px; left:0px; pointer-events: none;">
    <div class="new-card-counter-text-container" style="top:50%;">
        <div class="new-card-counter-text ng-binding" style="left:-50%;">${entry.count}
        </div>
    </div>
</div>`;
        }

        // Context hints
        var miniString = function (c) {
            return `<div class="mini-info"
      style="width: ${width / 5}px; height: ${height * 0.8}px;
             background-image: url(${publicCardFactory.getNewAnonymousCard(c.cardName).miniView.artURL});"> </div>`
                .repeat(c.frequency);
        };
        inner += entry.extras.map(miniString).join('');

        return `<div class="call-button" style="width: ${width}px; height: ${height}px; background-image: url(${art});"
    onclick="publicAbilityClicked({'which':1}, ${entry.index});"> ${inner}
</div>`;
    },

    renderList: function(entries) {
        let inner = entries.map(e => dominion_VAB.renderSingle(e)).join("");

        if (entries.length > 0 && activeGame.openQuestions[0].declineButtonId > 0) {
            $('.done-buttons-area .done-button').css("display", "none");
            var scale = dominion_VAB.state.scale;
            var height = MINI_CARD_HEIGHT * scale / 3;
            var width = MINI_CARD_WIDTH * scale * 1.3;
            inner +=
`<div class="call-button-done" style="width: ${width}px; height: ${height}px;"
onclick="angular.element(document.body).injector().get('answerCollector').sendDecline(7);"> <div class="call-text"> Done </div>
</div>`;
        }

        return `<div class="ability-container" style="overflow: hidden;">${inner}</div>`;
    },

    angular_debug_check: function () {
        if (typeof angular.element(document.body).scope() == 'undefined') {
            angular.reloadWithDebugInfo();
            return false;
        } else {
            return true;
        }
    },

    parse_single_ability: function(ability, context) {
        let card = activeGame.getCardNameById(ability.association);

        let args = [];
        if (ability.logEntryArguments.length > 0) {
            switch (ability.logEntryArguments[0].type) {
                case 0:
                    args.push(...ability.logEntryArguments[0].argument);
                break;

                case 11:
                    args.push({'cardName': ability.logEntryArguments[0].argument,
                             ' frequency': 1});
                break;
            }
        }

        if (card.name == 'Royal Carriage') {
            return -1;
        }

        switch (ability.name.name) {
            case "WATCHTOWER_TRASH_REACTION":
                args.push({'cardName': CardNames.THE_FLAMES_GIFT, 'frequency': 1});
            break;

            case "WATCHTOWER_TOPDECK_REACTION":
                args.push({'cardName': CardNames.THE_MOONS_GIFT, 'frequency': 1});
            break;

            case "CHANGELING_MAY_EXCHANGE":
                return {'card': CardNames.CHANGELING,
                        'extras': ability.logEntryArguments[0].argument};
            break;

            case "DUCHESS_MAY_GAIN":
                return {'card': CardNames.DUCHESS, 'extras': []};
            break;
        }

        return {'card': card, 'extras': args};
    },

    get_RC_info: function(qn) {
        var context = qn.story.context;
        var rcs = {'count': 0, 'indices': [], 'abilities': [], 'root': -1};

        let abilityIndex = 0;
        for (ability of qn.content.elements) {
            let card = activeGame.getCardNameById(ability.association);
            if (card.name == 'Royal Carriage') {
                if (context != -1) {
                    if (!(rcs.indices.includes(ability.association))) {
                        rcs.indices.push(ability.association);
                    }
                    if (rcs.root == -1) {
                        rcs.root = context.argument.description.association;
                    }
                    rcs.abilities.push(abilityIndex);
                    rcs.count++;
                }
            }
            abilityIndex++;
        }
        return rcs;
    },

    parse_RC_entries: function(rcs) {
        let rootName = activeGame.getCardNameById(rcs.root);
        let rcNum = rcs.indices.length;
        let targetCount = ~~(rcs.count / rcNum);

        // Check for "simplistic" scenario
        let inPlays = activeGame.getActivePlayArea().cards;
        let rootIndex = inPlays.indexOf(rcs.root);

        let simplistic = true;

        // Check whether the "chain", starting from the root, is
        // saunavanto, cultist, or vassals preceding one of those.
        if (targetCount == 1) {
            // Very easy case - single card
            return [{'card': CardNames.ROYAL_CARRIAGE,
                     'count': rcNum,
                     'index': rcs.abilities[0],
                     'extras': [{'cardName': rootName, 'frequency': 1}]}];
        } else {
            let start = rootIndex;
            let startName = activeGame.getCardNameById(inPlays[start]).name;
            var vassalCount = 0;
            while (start < inPlays.length &&
                   ["Vassal", "Royal Carriage"].includes(startName)) {
                start++;
                if (startName == "Vassal")
                    vassalCount++;
                startName = activeGame.getCardNameById(inPlays[start]).name;
            }

            for (let i = start;
                 i < inPlays.length - 1 && simplistic;
                 i++) {
                let successor = activeGame.getCardNameById(inPlays[i + 1]).name;
                switch (activeGame.getCardNameById(inPlays[i]).name) {
                    case 'Cultist':
                        if (successor != 'Cultist')
                            simplistic = false;
                    break;
                    case 'Avanto':
                        if (successor != 'Sauna')
                            simplistic = false;
                    break;
                    case 'Sauna':
                        if (successor != 'Avanto')
                            simplistic = false;
                    break;
                    default:
                        simplistic = false;
                    break;
                }
            }
        }

        if (simplistic) {
            var cardOrder = inPlays.map(c => activeGame.getCardNameById(c))
                                .reverse().slice(0, targetCount);

            // Vassal exception
            for (let i = 0; i < vassalCount; i++) {
                cardOrder.pop();
                cardOrder.splice(0, 0, CardNames.VASSAL);
            }
        } else {
            // Panic! It's either Golem or Herald, but we don't know.
            let activeCards = activeGame.model.gameState.cards.map(c=>c.cardName.name);
            if (!activeCards.includes("Herald")) {
                var realRoot = CardNames.GOLEM;
            } else if (!activeCards.includes("Golem")) {
                var realRoot = CardNames.HERALD;
            } else {
                // I give up.
                var realRoot = CardNames.HERALD;
            }
            var cardOrder = [rootName];
            if (rootIndex >= 2 && activeGame.getCardNameById(inPlays[rootIndex - 2]) != realRoot) {
                let prec = activeGame.getCardNameById(inPlays[rootIndex - 1]);
                if ((rootName.name == "Avanto" && prec.name == "Sauna") || 
                    (rootName.name == "Sauna" && prec.name == "Avanto")){
                        cardOrder.push(prec);
                }
            }

            // Filler - this is super unpredictable, so effectively ignore them
            while (cardOrder.length < targetCount - 1) {
                cardOrder.push(rcs.rootName);
            }
            cardOrder = cardOrder.slice(0, targetCount - 1);

            cardOrder.push(realRoot);
        }

        let entries = [{'card': CardNames.ROYAL_CARRIAGE,
                        'count': rcNum,
                        'index': rcs.abilities[0],
                        'extras': [{'cardName': rootName, 'frequency': 1}]}];

        let contained = [rootName];
        for (let i = 0; i < cardOrder.length; i++) {
            if (!contained.includes(cardOrder[i])) {
                entries.push({'card': CardNames.ROYAL_CARRIAGE,
                              'count': rcNum,
                              'index': rcs.abilities[rcNum * i],
                              'extras': [{'cardName': cardOrder[i], 'frequency': 1}]});
                contained.push(cardOrder[i]);
            }
        }

        return entries;
    },

    parse_abilities: function (questions) {
        var nonStacks = new Set(["Archive", "Blessed Village", "Crypt", "Ghost",
                                 "Watchtower", "Prince", "Summon"]);
        var rcs = {'count': 0, 'indices': [], 'abilities': [], 'root': -1};
        var entries = [];
        var reprs = new Object();

        for (qn of questions.filter(x => x.type == 7)) {
            currentCards = qn.content.elements.map(x => activeGame.getCardNameById(x.association).name);

            let abilityIndex = 0;
            for (ability of qn.content.elements) {
                var parsed = dominion_VAB.parse_single_ability(ability, qn.story.context);

                if (parsed != -1) {
                    if (parsed.card in reprs) {
                        reprs[parsed.card].count++;
                    } else if (nonStacks.has(parsed.card.name)){
                        entries.push({'card': parsed.card, 'extras': parsed.extras,
                                      'count': 1, 'index': abilityIndex});
                    } else {
                        reprs[parsed.card] = {'card': parsed.card, 'count': 1,
                                              'index': abilityIndex, 'extras': parsed.extras};
                        entries.push(reprs[parsed.card]);
                    }
                }

                abilityIndex++;
            }

            rcs = dominion_VAB.get_RC_info(qn);
        }

        // RC stuff
        if (rcs.count > 0) {
            entries.push(...dominion_VAB.parse_RC_entries(rcs));
        }
        return entries;
    },

    get_state: function() {
        var currentCards = [];
        for (qn of activeGame.openQuestions) {
            if (qn.type == 7) {
                let getName = (x => activeGame.getCardNameById(x.association).name);
                currentCards = qn.content.elements.map(getName);
            }
        }

        return {'scale': publicPositionProperties.getPileProperties().scale,
                'cards': currentCards};
    },

    check_state: function(current, rendered) {
        if (current.scale != rendered.scale) {
            return false;
        } else if (current.cards.length != rendered.cards.length) {
            return false;
        } else {
            for (let i = 0; i < current.length; i++) {
                if (current.cards[i] != rendered.cards[i]) {
                    return false;
                }
            }
        }
        return true;
    },

    redraw: function() {
        if (angular.element($('.game-area')).length > 0){
            setTimeout(function() {
                var currentState = dominion_VAB.get_state();
                let changed = dominion_VAB.check_state(currentState, dominion_VAB.state);

                dominion_VAB.state = currentState;
                let inner = dominion_VAB.renderList(
                                dominion_VAB.parse_abilities(activeGame.openQuestions));
                if ($('.done-buttons-area .ability-container').length == 0){
                    $('.done-buttons-area').prepend(inner);
                } 

                if (!changed) {
                    $('.done-buttons-area .ability-container').replaceWith(inner);
                }
            }, 100);
        }
    }
}

dominion_VAB.angular_debug_check();
setInterval(dominion_VAB.redraw, 200);
*/