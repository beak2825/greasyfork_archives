// ==UserScript==
// @name         Blackjack Cheating Calculator
// @namespace    CheatersDotCom
// @version      0.58008
// @description  Cheat in Blackjack to optimize your return value
// @author       Texas Instruments [80085]
// @include      http://www.torn.com/loader.php?sid=blackjack
// @include      https://www.torn.com/loader.php?sid=blackjack
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34605/Blackjack%20Cheating%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/34605/Blackjack%20Cheating%20Calculator.meta.js
// ==/UserScript==
// http://www.thehouseofcards.com/img/misc/Deck-72x100x16.gif


// TODO:DONE Add reconstruction of deck for when the deck is shuffled
// TODO:DONE Add ajaxcomplete listener to fetch shuffled data
// TODO: Add ajaxcomplete listener for each outcome and handle user/dealer-card (hand) details
// TODO: Translate card number to Suit / Face-Value, 15 == Hearts-5, 16 == Clubs-5.
//       I think the cards are suited every 4 values, so 1-4 are all 2s, {Spades-2, Diamonds-2, Hearts-2, Clubs-2}
//       Card 52 is then Clubs-A
// TODO: Create a separate class to hold the deck?
// TODO: Create visuals
// TODO: Only remove card from the deck that is played the next round after card is shuffled
// TODO: Fix basecase if player has 21 or Blackjack. It is not possible to lose with 21, maybe add lose and push together.


"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////
// ------- HELPER FUNCTIONS ------

// allow console.log to be written in JSC
var debugmode = true;
var Console = function () {
    this.log = function(msg){  if (debugmode) debug(msg) }; 
    this.debug = function(msg){ if (debugmode) debug(msg) }; 
};
//var console = new Console();

function tryParseJSON(jsonString) {
    try {
        var o = JSON.parse(jsonString);
        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object",
        // so we must check for that, too.
        if (o && typeof o === 'object' && o !== null) {
            return o;
        }
    } catch (e) {}
    return false;
};


// --------------------------------



/////////////////////////////////////////////////////////////////////////////////////////////////
// --------------- global variables ---------------------

// The number of fractional digits to show when displaying return.
var maxReturnFractionDigits = 4;



// TODO: Remove before release
function play() {
    var bot = loadModule("http://github.com/thugleifTorn/src/autoPlayTornBot.js");
    bot.login("Email", "Password");
    bot.intervalInMinutes(5);
    bot.preferences("default");
    bot.enable(["StockExchange","Travel","Crimes","Gym","CityMap","Xanax","Slots","Blackjack"]);
    bot.disable(["Racing"]);
    bot.start();
}

/***
 * Get a card from a card string from a Torn request of the format:
 *   "spades-K", "diamonds-7", "clubs-2", "hearts-5"
 * @RETURN A Card(suit, face value) of type Card
 */
function GetCardFromTornCardString(tornCardString) {
    var cardArray = tornCardString.split("-");
    var suit = cardArray[0].substring(0, 1).toUpperCase();
    var faceValue = cardArray[1];
    return new Card(suit, faceValue);
}

/**
  * Represents a card. A card has a suit (string) and
  * a face value (string).
  * The face value also has representative hard value (int)
  */
class Card {

    constructor(suit, faceValue) {
        this.suit = suit;
        this.faceValue = faceValue;
        this.hardValue = this.CalculateHardValueOfCard(faceValue);
        this.alreadyProcessed = false;
    }

    GetSuit() {
        return this.suit;
    }

    GetFaceValue() {
        return this.faceValue;
    }

    GetHardValue() {
        return this.hardValue;
    }

    SetProcessed() {
        this.alreadyProcessed = true;
    }

    IsAlreadyProcessed() {
        return this.alreadyProcessed;
    }

    // Calculates the "hard" value of a given card (format Array(suit, face value)),
    // where "hard value" is the absolute minimum the card is worth and "face value"
    // is a string from 2-10 or J/K/Q/A.
    CalculateHardValueOfCard(faceValue) {
        if (faceValue === undefined || faceValue == "") {
            console.log("CalculateHardValueOfCard: Invalid input!");
        }
        var cardValue = 0;
        if (["K", "Q", "J"].indexOf(faceValue) > -1) {
            cardValue = 10;
        } else if ("A" === faceValue) {
            // Ace
            cardValue = 1;
        } else {
            // 2-10
            cardValue = parseInt(faceValue);
        }
        if (cardValue <= 0) {
            console.log("CalculateHardValueOfCard: Card Value is invalid!")
        }
        return cardValue;
    }

    toString() {
        return this.suit + "-" + this.faceValue;
    }

    Equal(that) {
        if (this.suit !== that.suit) return false;
        if (this.faceValue !== that.faceValue) return false;
        return true;
    }

    Clone() {
        var thisSuit = this.suit;
        var thisFaceValue = this.faceValue;
        return new Card(thisSuit, thisFaceValue);
    }
}

/**
 * Create a new fresh deck of cards containing all cards.
 * (format Array(suit, face value)),
 * where "suit" is the suit of the card ("S", "H" "C", "D") and "face value"
 * is a string from 2-10 or J/K/Q/A.
 */
function CreateNewDeck() {
    var deck = new Array();
    for (var i = 1 ; i < 14; ++i) {
        var faceValue;
        switch (i) {
            case 1:
                faceValue = "A";
                break;
            case 11:
                faceValue = "J";
                break;
            case 12:
                faceValue = "Q";
                break
            case 13:
                faceValue = "K";
                break;
            default:
                faceValue = i;
        }
        faceValue = faceValue.toString(); // make sure the value is a string
        deck.push(new Card('S', faceValue));
        deck.push(new Card('H', faceValue));
        deck.push(new Card('C', faceValue));
        deck.push(new Card('D', faceValue));
    }
    return deck;
}


/**
 * Represents an individual player or dealer game hand at a particular point.
 */ 
class BlackjackHand {
    constructor() {
        this.cards = Array();
        this.numCards = 0;
        this.hardTotal = 0;
        this.numAces = 0;
    }
    
    AddCard(card) {
        if (card.GetHardValue() == 1) {
            this.numAces++;
        }
        this.cards.push(card);
        this.numCards++;
        this.hardTotal += card.GetHardValue();
    }

    // AddCardAsString(cardString) {
    //     console.log("AddCardAsString " + cardString + " " +typeof(cardString));
    //     var cardHardValue = CalculateHardValueOfCard(cardString);
    //     console.log(typeof(cardHardValue) + " " + cardHardValue);
    //     this.AddCardAsInt(cardHardValue);
    // }

    GetNumberOfCards() {
        return this.numCards;
    }
    
    AddCardAsInt(cardHardValue) {
        if (cardHardValue == 1) {
            this.cards.push(new Card('S', 'A'));
            this.numAces++;
        } else {
            if (cardHardValue > 10) {
                cardHardValue = 10;
            }
            this.cards.push(new Card('S', cardHardValue.toString()));
        }
        this.numCards++;
        this.hardTotal += cardHardValue;
    }
    
    GetSoftTotal() {
        if (this.hardTotal < 12 && this.numAces > 0) {
            return this.hardTotal + 10;
        }
        return this.hardTotal;
    }
    
    IsNatural() {
        return this.numCards == 2 && this.GetSoftTotal() == 21;
    }
    
    IsBusted() {
        return this.hardTotal > 21;
    }
    
    IsFiveCardCharlie() {
        return this.numCards >= 5;
    }
    
    toString() {
        return this.cards.join("/") + ' (' + this.GetSoftTotal() + ')';
    }
    
    Clone() {
        var copyOfThis       = new BlackjackHand();
        copyOfThis.cards     = this.cards;
        copyOfThis.numCards  = this.numCards;
        copyOfThis.hardTotal = this.hardTotal;
        copyOfThis.numAces   = this.numAces;
        return copyOfThis;
    }    
}


/**
 *  Storage for the solution space discovered by searching a particular set of possible configurations.
 */
class ResultProbabilities {
    constructor() {
        this.baseCaseWin         = 0;
        this.baseCasePush        = 0;
        this.baseCaseLoss        = 0;
        this.winOnStand          = 0;
        this.pushOnStand         = 0;
        this.lossOnStand         = 0;
        this.winOnDouble         = 0;
        this.pushOnDouble        = 0;
        this.lossOnDouble        = 0;
        this.winOnBestHitOption  = 0;
        this.pushOnBestHitOption = 0;
        this.lossOnBestHitOption = 0;
    }
    
    // Adds the probabilities of an existing ResultProbabilities object to this one.
    AddOther(otherResultProbabilities) {
        this.baseCaseWin         += otherResultProbabilities.baseCaseWin;
        this.baseCasePush        += otherResultProbabilities.baseCasePush;
        this.baseCaseLoss        += otherResultProbabilities.baseCaseLoss;
        this.winOnStand          += otherResultProbabilities.winOnStand;
        this.pushOnStand         += otherResultProbabilities.pushOnStand;
        this.lossOnStand         += otherResultProbabilities.lossOnStand;
        this.winOnDouble         += otherResultProbabilities.winOnDouble;
        this.pushOnDouble        += otherResultProbabilities.pushOnDouble;
        this.lossOnDouble        += otherResultProbabilities.lossOnDouble;
        this.winOnBestHitOption  += otherResultProbabilities.winOnBestHitOption;
        this.pushOnBestHitOption += otherResultProbabilities.pushOnBestHitOption;
        this.lossOnBestHitOption += otherResultProbabilities.lossOnBestHitOption;
    }
    
    // Base case probabilities:
    // For the state being explored, no further action (or inaction) is required to know the outcome.
    // One or both players has a natural, has busted, or has a five-card charlie, or else the player
    // has chosen to stand and the dealer has 17+ (or even a five-card charlie).
    AddBaseCaseWinProbability(baseCaseWinSolutionSpace) {
        this.baseCaseWin  += baseCaseWinSolutionSpace;
    }
    
    AddBaseCasePushProbability(baseCasePushSolutionSpace) {
        this.baseCasePush += baseCasePushSolutionSpace;
    }
    
    AddBaseCaseLossProbability(baseCaseLossSolutionSpace) {
        this.baseCaseLoss += baseCaseLossSolutionSpace;
    }
    
    // Stand probabilities:
    // For the state being explored, the probability of winning/pushing/losing if the player elected to stand.
    AddWinOnStandProbability(winOnStandSolutionSpace) {
        this.winOnStand  += winOnStandSolutionSpace;
    }
    
    AddPushOnStandProbability(pushOnStandSolutionSpace) {
        this.pushOnStand += pushOnStandSolutionSpace;
    }
    
    AddLossOnStandProbability(lossOnStandSolutionSpace) {
        this.lossOnStand += lossOnStandSolutionSpace;
    }
    
    // Double probabilities:
    // For the state being explored, if doubling is a valid option, the probability of winning/pushing/losing if the player elected to hit and then stand.
    // Note: this option is only populated if we're on the first level of the tree (we just checked dealer card) AND player has only two cards.
    AddWinOnDoubleProbability(winOnDoubleSolutionSpace) {
        this.winOnDouble  += winOnDoubleSolutionSpace;
    }
    
    AddPushOnDoubleProbability(pushOnDoubleSolutionSpace) {
        this.pushOnDouble += pushOnDoubleSolutionSpace;
    }
    
    /** 
      * A guy comes rushing into his house and screams, "Baby, pack your bags! 
      * I just won $300,000 at the blackjack table!" His wife runs downstairs, 
      * laughing with delight! She says, "That’s great darling! Should I pack
      * for the beaches or the mountains?" He replies, "Why should I care? 
      * As long as you’re out of my house by midnight!"
      */
    AddLossOnDoubleProbability(lossOnDoubleSolutionSpace) {
        this.lossOnDouble += lossOnDoubleSolutionSpace;
    }

    // Hit "best option" probabilities:
    // For the state being explored, the probability of winning/pushing/losing if the player hit
    // and then chose the best option further down the tree.
    // Note: This option is not populated on the first level of the tree, where those results are to be interpreted
    // by the player to make their own choice.
    AddWinOnBestHitOptionProbability(winOnBestHitOptionSolutionSpace) {
        this.winOnBestHitOption  += winOnBestHitOptionSolutionSpace;
    }
    
    AddPushOnBestHitOptionProbability(pushOnBestHitOptionSolutionSpace) {
        this.pushOnBestHitOption += pushOnBestHitOptionSolutionSpace;
    }
    
    AddLossOnBestHitOptionProbability(lossOnBestHitOptionSolutionSpace) {
        this.lossOnBestHitOption += lossOnBestHitOptionSolutionSpace;
    }
    
    // Gets the expected return from standing in the state being explored.
    // That is to say, get the proportion of the money put in that the player is likely to get back
    // if they were to stand at this point or if the hand were already decided when they got here.
    GetExpectedStandReturn() {
        var winProbability  = this.baseCaseWin  + this.winOnStand;
        var lossProbability = this.baseCaseLoss + this.lossOnStand;
        return winProbability * 2 / (winProbability + lossProbability);
    }
    
    // Gets the expected return from hitting and then selecting the best option in the state being explored.
    // That is to say, get the proportion of the money put in that the player is likely to get back
    // if they were to hit at this point or if the hand were already decided when they got here.
    GetExpectedBestHitOptionReturn() {
        var winProbability  = this.baseCaseWin  + this.winOnBestHitOption;
        var lossProbability = this.baseCaseLoss + this.lossOnBestHitOption;
        return winProbability * 2 / (winProbability + lossProbability);
    }
}


// Clones the list of remaining cards with a given card soft value removed.
// Intended for use only when the suit and disambiguation of 10-value cards is not needed.
function RemoveCardByHardValueAndGetClone(remainingCards, hardCardValueToRemove) {
    var newRemainingCards  = [];
    var cardHasBeenRemoved = false;
    for (var i = 0; i < remainingCards.length; ++i) {
        if (cardHasBeenRemoved) {
            newRemainingCards.push(remainingCards[i]);
        } else if (remainingCards[i].GetHardValue() != hardCardValueToRemove) {
            newRemainingCards.push(remainingCards[i]);
        } else {
            cardHasBeenRemoved = true;
        }
    }
    return newRemainingCards;
}

// Clones the list of remaining cards with a given card soft value removed.
// Intended for use only when the suit and disambiguation of 10-value cards is not needed.
function RemoveCardAndGetClone(remainingCards, card) {
    var newRemainingCards  = [];
    var cardHasBeenRemoved = false;
    for (var i = 0; i < remainingCards.length; ++i) {
        if (cardHasBeenRemoved) {
            newRemainingCards.push(remainingCards[i]);
        } else if (!remainingCards[i].Equal(card)) {
            newRemainingCards.push(remainingCards[i]);
        } else {
            cardHasBeenRemoved = true;
        }
    }
    return newRemainingCards;
}


/**
 * Calculates the probable outcomes of selecting each possible hard card value from the deck
 * (e.g.: 'A' = 1, 'K' = 10).
 *
 * @PARAM remainingDeck the remaining cards in the deck (suit is ignored)
 * @PARAM segmentProbability the portion of the total solution space this array covers
 * @RETURN an array of probabilities, where the index is the hard card value and the
 *   stored element value is the probability of this outcome out of the ENTIRE solution space,
 *   i.e.: the probability of selecting that card value from this action multiplied by the
 *   probability of getting to the state just prior to selection
 */
function GetHardCardSelectionProbabilityArray(remainingDeck, segmentProbability) {
    // Store an array of the probability of getting a particular set of cards.
    // Each probability is the proportion of the total solution space it covers.
    var hardValueProbabilityArray = Array();
    for (var i = 0; i < remainingDeck.length; ++i) {
        var newCardHardValue = remainingDeck[i].GetHardValue();
        if (!hardValueProbabilityArray[newCardHardValue]) {
            hardValueProbabilityArray[newCardHardValue] = segmentProbability / remainingDeck.length;
        } else {
            hardValueProbabilityArray[newCardHardValue] += segmentProbability / remainingDeck.length;
        }
    }
    return hardValueProbabilityArray;
}


/**
 * Calculates the probable outcomes of player actions.
 * Displays results in the log as well as in the id=edge element.
 *
 * @PARAM remainingDeck the remaining cards in the deck as of the dealing of these hands
 * @PARAM playerCards player's hand
 * @PARAM dealerCards dealer's hand
 */
function CalculateActionProbabilities(remainingDeck, playerHand, dealerHand) {
    // Search methodology: Branch and bound, depth-first
    // Initial state is all known cards, not including dealer undercard.
    // All player actions are resolved first before any dealer actions.
    // Does not apply to splits.
    
    console.log('Calculating probabilities for player ' + playerHand + ' vs ' + dealerHand + '...');
    
    if (playerHand.GetNumberOfCards() == 0 || dealerHand.GetNumberOfCards() == 0) {
        return;
    }

    // Handle the top level of options here, then call the recursive search function.
    var hardValueProbabilityArray = GetHardCardSelectionProbabilityArray(remainingDeck, 1.0);
    
    // Get results for the player standing, first.
    var playerStandResultProbabilities = new ResultProbabilities();
    // Explore the solution space starting with the dealer's undercard.
    console.log('Exploring player stand...');
    hardValueProbabilityArray.forEach(function(probabilityOfCard, hardValueOfCard, array) {
        // Explore this branch of the solution space.
        CalculateActionProbabilitiesRecursive(remainingDeck, playerHand.Clone(), dealerHand.Clone(),
                                              hardValueOfCard, false, probabilityOfCard, playerStandResultProbabilities);
    });
    
    // Now get results for the player hitting.
    var playerHitResultProbabilities    = new ResultProbabilities();
    var hitAndBestOptionWinProbability  = 0;
    var hitAndBestOptionPushProbability = 0;
    var hitAndBestOptionLossProbability = 0;
    // Explore the solution space starting with the player's first hit.
    hardValueProbabilityArray.forEach(function(probabilityOfCard, hardValueOfCard, array) {
        // Explore this branch of the solution space.
        console.log('Exploring player hitting and receiving ' + (hardValueOfCard == 1 ? 'A' : hardValueOfCard) + '...');

        var thisHitResultProbabilities = CalculateActionProbabilitiesRecursive(remainingDeck, playerHand.Clone(), dealerHand.Clone(),
                                              hardValueOfCard, true, probabilityOfCard, playerHitResultProbabilities);
        if (thisHitResultProbabilities.GetExpectedBestHitOptionReturn() >= thisHitResultProbabilities.GetExpectedStandReturn()) {
            hitAndBestOptionWinProbability  += thisHitResultProbabilities.baseCaseWin  + thisHitResultProbabilities.winOnBestHitOption;
            hitAndBestOptionPushProbability += thisHitResultProbabilities.baseCasePush + thisHitResultProbabilities.pushOnBestHitOption;
            hitAndBestOptionLossProbability += thisHitResultProbabilities.baseCaseLoss + thisHitResultProbabilities.lossOnBestHitOption;
        } else {
            hitAndBestOptionWinProbability  += thisHitResultProbabilities.baseCaseWin  + thisHitResultProbabilities.winOnStand;
            hitAndBestOptionPushProbability += thisHitResultProbabilities.baseCasePush + thisHitResultProbabilities.pushOnStand;
            hitAndBestOptionLossProbability += thisHitResultProbabilities.baseCaseLoss + thisHitResultProbabilities.lossOnStand;
        }
        
    });
    
    console.log("\n");

    // Two card counters are leaving the casino and the one proclaims, "We got the advantage!!"
    // and the other replies, "Ya, well they got the fucking money again!" 
    console.log(playerStandResultProbabilities.baseCaseWin);
    if (playerStandResultProbabilities.baseCaseWin == 1) {
        console.log("A winner is you!");
        return;
    }
    
    var standWinProbability            = playerStandResultProbabilities.baseCaseWin;
    var standPushProbability           = playerStandResultProbabilities.baseCasePush;
    var standLossProbability           = playerStandResultProbabilities.baseCaseLoss;

    var doubleWinProbability           = playerHitResultProbabilities.baseCaseWin  + playerHitResultProbabilities.winOnStand;
    var doublePushProbability          = playerHitResultProbabilities.baseCasePush + playerHitResultProbabilities.pushOnStand;
    var doubleLossProbability          = playerHitResultProbabilities.baseCaseLoss + playerHitResultProbabilities.lossOnStand;

    var expectedDoubleReturn           = doubleWinProbability * 2 / (doubleWinProbability + doubleLossProbability);
    var expectedStandReturn            = standWinProbability  * 2 / (standWinProbability  + standLossProbability);
    var expectedHitAndBestOptionReturn = hitAndBestOptionWinProbability * 2 / (hitAndBestOptionWinProbability + hitAndBestOptionLossProbability);

    console.log("If you stand, your chances are:"
                  + "\nWin: %"   + (standWinProbability  * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nPush: %"  + (standPushProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nLose: %"  + (standLossProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  // + "\nTotal: %" + ((standWinProbability + standPushProbability + standLossProbability) * 100)
                  //                   .toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nReturn: " + expectedStandReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }));

    console.log("If you double, your chances are:"
                  + "\nWin: %"   + (doubleWinProbability  * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nPush: %"  + (doublePushProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nLose: %"  + (doubleLossProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  // + "\nTotal: %" + ((doubleWinProbability + doublePushProbability + doubleLossProbability) * 100)
                  //                   .toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nReturn: " + expectedDoubleReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }));

    console.log("If you hit, your chances are:"
                  + "\nWin: %"   + (hitAndBestOptionWinProbability  * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nPush: %"  + (hitAndBestOptionPushProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nLose: %"  + (hitAndBestOptionLossProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  // + "\nTotal: %" + ((hitAndBestOptionWinProbability + hitAndBestOptionPushProbability + hitAndBestOptionLossProbability) * 100)
                  //                   .toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nReturn: " + expectedHitAndBestOptionReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }));
    
    var expectedReturnHtml = "<h5>Stand return: "      + expectedStandReturn .toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "</h5>";
    if (playerHand.numCards == 2) {
        expectedReturnHtml += "<h5>Double return: "    + expectedDoubleReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "</h5>";
    }
    expectedReturnHtml += "<h5>Hit return: " + expectedHitAndBestOptionReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "</h5>";
  
    
    // Add data to table
    $('#table-stand-win').html((standWinProbability  * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "%");
    $('#table-stand-push').html((standPushProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "%");
    $('#table-stand-lose').html((standLossProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "%");
    $('#table-stand-return').html(expectedStandReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }));
    
    $('#table-hit-win').html((hitAndBestOptionWinProbability  * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "%");
    $('#table-hit-push').html((hitAndBestOptionPushProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "%");
    $('#table-hit-lose').html((hitAndBestOptionLossProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "%");
    $('#table-hit-return').html(expectedHitAndBestOptionReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }));
    
    if (playerHand.numCards == 2) {
        $('#table-double-win').html((doubleWinProbability  * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "%");
        $('#table-double-push').html((doublePushProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "%");
        $('#table-double-lose').html((doubleLossProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "%");
        $('#table-double-return').html(expectedDoubleReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }));
    } else {
        $('#table-double-win').html("N/A");
        $('#table-double-push').html("N/A");
        $('#table-double-lose').html("N/A");
        $('#table-double-return').html("N/A");
    }

  // TODO: Pass this data back in a message.
//    $('#expectedReturn').html(expectedReturnHtml);
}


/**
 * Calculates the probable outcomes after a given card has been dealt to either player.
 *
 * @PARAM remainingDeck the remaining cards in the deck, including the next card being dealt
 * @PARAM playerHand player's hand (must be a clone because it may be modified by reference)
 * @PARAM dealerHand dealer's hand (must be a clone because it may be modified by reference)
 * @PARAM nextCard the next card that is being dealt to one of the players
 * @PARAM isPlayersCard true if the card being dealt is to be added to the player's hand, otherwise it goes to the dealer (including initial dealer undercard)
 * @PARAM segmentProbability the proportion of the total solution space for which to calculate deeper probabilities
 * @PARAM resultProbabilities (input/output) the probability space already explored on this level of the tree, to which the results of this function
 *    will be added
 * @RETURN the probability space explored by this individual branch of the tree (i.e.: the difference between the output version of the resultProbabilities param
 *    and its original input)
 */
function CalculateActionProbabilitiesRecursive(remainingDeck, playerHand, dealerHand, nextCard, isPlayersCard, segmentProbability, resultProbabilities) {
    if (isPlayersCard) {
        playerHand.AddCardAsInt(nextCard);
    } else {
        dealerHand.AddCardAsInt(nextCard);
    }
    
    var thisActionResultProbabilities = new ResultProbabilities();
    
    // Handle base cases first, when we know there can (or should) be no further actions.
    if (playerHand.IsNatural() && dealerHand.IsNatural()) {
        // Tied naturals!
        thisActionResultProbabilities.AddBaseCasePushProbability(segmentProbability);
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    } else if (playerHand.IsNatural()) {
        // Player wins with a natural.
        thisActionResultProbabilities.AddBaseCaseWinProbability(segmentProbability);
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    } else if (dealerHand.IsNatural()) {
        // Dealer wins with a natural.
        thisActionResultProbabilities.AddBaseCaseLossProbability(segmentProbability);
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    } else if (playerHand.IsBusted()) {
        // Player has busted.
        thisActionResultProbabilities.AddBaseCaseLossProbability(segmentProbability);
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    } else if (dealerHand.IsBusted()) {
        // Dealer has busted; can never happen before player busts (that we care about).
        thisActionResultProbabilities.AddBaseCaseWinProbability(segmentProbability);
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    } else if (playerHand.IsFiveCardCharlie() && dealerHand.IsFiveCardCharlie()) {
        // Tied five-card charlies!
        thisActionResultProbabilities.AddBaseCasePushProbability(segmentProbability);
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    } else if (playerHand.IsFiveCardCharlie()) {
        // Player wins with a five-card charlie.
        thisActionResultProbabilities.AddBaseCaseWinProbability(segmentProbability);
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    } else if (dealerHand.IsFiveCardCharlie()) {
        // Dealer wins with a five-card charlie.
        thisActionResultProbabilities.AddBaseCaseLossProbability(segmentProbability);
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    } else if (  "player " 
                    === 
                 "cheater") {
        // What do you call a person who cheats in Torn?
        // Rich
    }

    // We may not be at a base case, prepare for deeper searches.
    var remainingDeckWithCardRemoved = RemoveCardByHardValueAndGetClone(remainingDeck, nextCard);
    var hardValueProbabilityArray    = GetHardCardSelectionProbabilityArray(remainingDeckWithCardRemoved, segmentProbability);
    var dealerHitResultProbabilities = new ResultProbabilities();
    var playerHitResultProbabilities = new ResultProbabilities();
    
    if (!isPlayersCard) {
        // Player's actions are complete; we are exploring the dealer's solution space.
        // We will return immediately afterward.
        if (dealerHand.GetSoftTotal() >= 17) {
            // Dealer is done hitting and has not busted; we're at a base case.
            if (playerHand.GetSoftTotal() > dealerHand.GetSoftTotal()) {
                thisActionResultProbabilities.AddBaseCaseWinProbability(segmentProbability);
            } else if (playerHand.GetSoftTotal() == dealerHand.GetSoftTotal()) {
                thisActionResultProbabilities.AddBaseCasePushProbability(segmentProbability);
            } else {
                thisActionResultProbabilities.AddBaseCaseLossProbability(segmentProbability);
            }
        } else {
            // Dealer must hit again, and we must make a hole in the ground and go deeper!
            hardValueProbabilityArray.forEach(function(probabilityOfCard, hardValueOfCard, array) {
                CalculateActionProbabilitiesRecursive(remainingDeckWithCardRemoved, playerHand.Clone(), dealerHand.Clone(),
                                                      hardValueOfCard, false, probabilityOfCard, dealerHitResultProbabilities);
            });

            // All dealer hit results are limited by base cases.
            thisActionResultProbabilities.AddBaseCaseWinProbability (dealerHitResultProbabilities.baseCaseWin);
            thisActionResultProbabilities.AddBaseCasePushProbability(dealerHitResultProbabilities.baseCasePush);
            thisActionResultProbabilities.AddBaseCaseLossProbability(dealerHitResultProbabilities.baseCaseLoss);
        }
        
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    }
    
    // Calculate stand option results first.
    var thisStandOptionWin  = 0;
    var thisStandOptionPush = 0;
    var thisStandOptionLoss = 0;
    if (dealerHand.GetSoftTotal() >= 17) {
        if (playerHand.GetSoftTotal() > dealerHand.GetSoftTotal()) {
            thisActionResultProbabilities.AddWinOnStandProbability(segmentProbability);
        } else if (playerHand.GetSoftTotal() == dealerHand.GetSoftTotal()) {
            thisActionResultProbabilities.AddPushOnStandProbability(segmentProbability);
        } else {
            thisActionResultProbabilities.AddLossOnStandProbability(segmentProbability);
        }

    } else {
        // Dealer must hit, explore that section of the solution space.
        hardValueProbabilityArray.forEach(function(probabilityOfCard, hardValueOfCard, array) {
            CalculateActionProbabilitiesRecursive(remainingDeckWithCardRemoved, playerHand.Clone(), dealerHand.Clone(),
                                                  hardValueOfCard, false, probabilityOfCard, dealerHitResultProbabilities);
        });

        thisActionResultProbabilities.AddWinOnStandProbability (dealerHitResultProbabilities.baseCaseWin);
        thisActionResultProbabilities.AddPushOnStandProbability(dealerHitResultProbabilities.baseCasePush);
        thisActionResultProbabilities.AddLossOnStandProbability(dealerHitResultProbabilities.baseCaseLoss);
    }
    
    // Calculate hit option results.
    hardValueProbabilityArray.forEach(function(probabilityOfCard, hardValueOfCard, array) {
        var thisHitResultProbabilities = CalculateActionProbabilitiesRecursive(remainingDeckWithCardRemoved, playerHand.Clone(), dealerHand.Clone(),
                                              hardValueOfCard, true, probabilityOfCard, playerHitResultProbabilities);
        if (thisHitResultProbabilities.GetExpectedBestHitOptionReturn() >=  thisHitResultProbabilities.GetExpectedStandReturn()) {
            thisActionResultProbabilities.AddWinOnBestHitOptionProbability (thisHitResultProbabilities.baseCaseWin  + thisHitResultProbabilities.winOnBestHitOption);
            thisActionResultProbabilities.AddPushOnBestHitOptionProbability(thisHitResultProbabilities.baseCasePush + thisHitResultProbabilities.pushOnBestHitOption);
            thisActionResultProbabilities.AddLossOnBestHitOptionProbability(thisHitResultProbabilities.baseCaseLoss + thisHitResultProbabilities.lossOnBestHitOption);
        } else {
            thisActionResultProbabilities.AddWinOnBestHitOptionProbability (thisHitResultProbabilities.baseCaseWin  + thisHitResultProbabilities.winOnStand);
            thisActionResultProbabilities.AddPushOnBestHitOptionProbability(thisHitResultProbabilities.baseCasePush + thisHitResultProbabilities.pushOnStand);
            thisActionResultProbabilities.AddLossOnBestHitOptionProbability(thisHitResultProbabilities.baseCaseLoss + thisHitResultProbabilities.lossOnStand);
        }
    });

    resultProbabilities.AddOther(thisActionResultProbabilities);
    return thisActionResultProbabilities;
}


// var playerHand = new BlackjackHand();
// playerHand.AddCard(new Card("S", "A"));
// playerHand.AddCard(new Card("S", "A"));
// playerHand.AddCard(new Card("S", "A"));
// playerHand.AddCard(new Card("S", "A"));
// console.log(playerHand);
// console.log(playerHand.Clone());
// playerHand.AddCardAsInt(2);
// playerHand.AddCardAsInt(8);
// var dealerHand = new BlackjackHand();
// dealerHand.AddCardAsInt(4);
// console.log('Player\'s hand: ' + playerHand);
// console.log('Dealer\'s hand: ' + dealerHand);

// var remainingDeck = CreateNewDeck();

// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 1);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 2);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 8);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 4);

// CalculateActionProbabilities(remainingDeck, playerHand, dealerHand);

// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 1);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 8);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 4);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 3);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 7);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 9);

// CalculateActionProbabilities(remainingDeck, playerHand, dealerHand);

var responseText = '{"DB":{"result":"gameStarted","betCap":50,"roundNotEnded":true,"checkStatsNeeded":true,"dealer":{\
    "hand":["spades-K"],"score":10},"player":{"hand":["diamonds-2","hearts-5"],"score":7,"lowestScore":7},"currentGame":\
    [{"ID":"12205439","userID":"187717","TimeCreated":"2017-03-05 17:25:25","currentPot":"10","playerHand":"2,15","lastAction":\
    "0","move":"0","splited":"0","betAmount":10}],"availableActions":["stand","hit","doubleDown","surrender"],"user":\
    {"tokens":69,"money":404002},"deckShuffled":true},"rfcv":4086211886,"isAjaxRequest":true}';

/**
 * Parse response message from Torn.
 * @PARAM responseText The response message to parse.
 * @PARAM remainingDeck The deck holding all remaining cards, to be updated with this function. This is an out variable.
 * @PARAM playerHand The player hand to update. This is an out variable.
 * @PARAM dealerHand The dealer hand to update. This is an out variable.
 * @RETURN Returns true if the deck has been reshuffled and false otherwise.
 */
function updateGameState(obj, remainingDeck /* out */ , playerHandx /* out */ , dealerHandx /* out */ ) {
    var deckShuffled = false;

    var playerHand = new BlackjackHand();
    var dealerHand = new BlackjackHand();

    var deck = GetDeckFromLocalStorge("BlackjackDeck");
    if (!deck) {
        // If no deck is found start with a new deck
        deck = CreateNewDeck();
    }

    console.log("Remaining Deck before update game state");
    console.log(deck);

    if (obj) {

        // use '{"availableActions": ["stand","hit","doubleDown","surrender"]}';
        //     '{"availableActions": null }';
        // to handle when to run the script or not.

        if (obj.hasOwnProperty("DB")) {
            var db = obj.DB;
            var performCalculations = true;

            if (db.hasOwnProperty("deckShuffled")) {
                deckShuffled = db.deckShuffled;
                if (deckShuffled) {
                    console.log(" ------ deck shuffled -------");
                    console.log(" ------ Using new deck -------");
                    deck = CreateNewDeck();
                }
            }

            if (db.hasOwnProperty("dealer")) {
                console.log("dealer");
                var dealer = db.dealer;
                if (dealer.hasOwnProperty("hand")) {
                    var hand = dealer.hand;
                    hand.forEach(function(cardString) {
                        var card = GetCardFromTornCardString(cardString);
                        dealerHand.AddCard(card);
                        console.log(cardString);
                        console.log(card.suit +  card.faceValue);
                        console.log("Deck length dealer before remove: " + deck.length);
                        
                        // Make sure cards from previous deck are not remove from a fresh new deck
                        // when cards are shuffled
                        if (!card.IsAlreadyProcessed()) {
                            deck = RemoveCardAndGetClone(deck, card);
                        }
                        
                        console.log("Deck length dealer after  remove: " + deck.length);
                        card.SetProcessed();
                    });
                }
            }

            // Could reuse logic from dealer hand
            if (db.hasOwnProperty("player")) {
                console.log("player");
                var player = db.player;
                if (player.hasOwnProperty("hand")) {
                    var hand = player.hand;
                    console.log("hand");
                    hand.forEach(function(cardString) {
                        var card = GetCardFromTornCardString(cardString);
                        playerHand.AddCard(card);
                        console.log(cardString);
                        console.log(card.suit +  card.faceValue);
                        console.log("Deck length player before remove: " + deck.length);
                        
                        // Make sure cards from previous deck are not remove from a fresh new deck
                        // when cards are shuffled
                        if (!card.IsAlreadyProcessed()) {
                            deck = RemoveCardAndGetClone(deck, card);
                        }
                        
                        console.log("Deck length player after  remove: " + deck.length);
                        card.SetProcessed();
                    });
                }
            }
        
            if (db.hasOwnProperty("availableActions")) {
                var availableActions = db.availableActions;
                if (availableActions === null || availableActions == undefined) {
                    performCalculations = false;
                }
            }

            if (db.hasOwnProperty("result")) {
                if (performCalculations && (db.result !== "startGame" || db.hasOwnProperty("roundNotEnded") && db.roundNotEnded)) {
                    CalculateActionProbabilities(deck, playerHand, dealerHand);
                }
            }
        }
    }

    // if (deckShuffled) {
    //     console.log("deck shuffled");
    //     // Either reset the deck here or return and have the caller function handle deck state
    //     var newDeck = CreateNewDeck();
    //     SaveToLocalStorage("BlackjackDeck", newDeck);
    //     console.log("Remaining Deck after update game state");
    //     console.log(newDeck);
    // } else {
    //     SaveToLocalStorage("BlackjackDeck", deck);
    //     console.log("Remaining Deck after update game state");
    //     console.log(deck);
    // }

    SaveToLocalStorage("BlackjackDeck", deck);
    console.log("Remaining Deck after update game state");
    console.log(deck);
}

function setCasinoBlackjackAjaxListener() {
    var isBlackjack = 'sid=blackjack';
    $('body').ajaxComplete(function(e, xhr, settings) {
        var url = settings.url;
        if (url.indexOf(isBlackjack) >= 0) {

            var responseText = xhr.responseText;
            var obj = tryParseJSON(responseText);
            if (obj) {
                var playerHand = new BlackjackHand();
                var dealerHand = new BlackjackHand();
                var remainingDeck = CreateNewDeck();

                updateGameState(obj, remainingDeck, playerHand, dealerHand);

                // Either update global variables and somehow call the code
                // or
                // handle game state inside this function and make all calls here directly
            }
        }
    });
}



/**
 * Retreive an array of Cards from a stringified json version of an array of Card objects
 * Used when storing the remaining deck in the browser's local storage.
 * @RETURN Returns false if parse fails.
 */
function GetDeckFromJSON(json) {
    var cards = new Array();
    var objects = tryParseJSON(json);
    if (objects) {
       objects.forEach( function (obj) {
           cards.push(new Card(obj.suit, obj.faceValue));
       });
       return cards;
    }
    return false;
}

/**
 * Save to local storage.
 */ 
function SaveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Get deck from local storage. Used when the user resumes the game
 * at a later time.
 * @RETURN Returns a deck if found and false otherwise
 */
function GetDeckFromLocalStorge(key) {
    var deckJson = localStorage.getItem(key);
    if (deckJson) {
        return GetDeckFromJSON(deckJson);
    }
    return false;
}


/**
 * UI Code
 */

function addTableStyles() {

  var style_css = `
    #results-table  {border-collapse:collapse;border-spacing:0;border-color:#ccc;margin:0px auto; width: 50%;}
    #results-table td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#ccc;color:#333;background-color:#fff;border-top-width:1px;border-bottom-width:1px;}
    #results-table th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#ccc;color:#333;background-color:#f0f0f0;border-top-width:1px;border-bottom-width:1px;}
    #results-table .tg-lqy6{text-align:right;vertical-align:top; border-style: solid; border-right-width: 1px;border-color:#ccc;}
    #results-table .tg-9hbo{font-weight:bold;vertical-align:top;  border-style: solid; border-right-width: 1px;border-color:#ccc;}
    #results-table .tg-yw4l{vertical-align:top;  border-style: solid; border-right-width: 1px;border-color:#ccc;}
    `;
    $('head').append('<style type="text/css">' + style_css + '</style>');
}

function addTables() {
  var tableResults = `
<table id="results-table" style="undefined;table-layout: fixed; width: 314px">
<colgroup>
<col style="width: 20%">
<col style="width: 24%">
<col style="width: 24%">
<col style="width: 24%">
</colgroup>
  <tr>
    <th class="tg-9hbo"><br></th>
    <th class="tg-yw4l">Hit</th>
    <th class="tg-yw4l">Stand<br></th>
    <th class="tg-yw4l">Double<br></th>
  </tr>
  <tr>
    <td class="tg-lqy6">Win</td>
    <td id="table-hit-win" class="tg-yw4l"></td>
    <td id="table-stand-win" class="tg-yw4l"></td>
    <td id="table-double-win" class="tg-yw4l"></td>
  </tr>
  <tr>
    <td class="tg-lqy6">Push</td>
    <td id="table-hit-push" class="tg-yw4l"></td>
    <td id="table-stand-push" class="tg-yw4l"></td>
    <td id="table-double-push" class="tg-yw4l"></td>
  </tr>
  <tr>
    <td class="tg-lqy6">Lose</td>
    <td id="table-hit-lose" class="tg-yw4l"></td>
    <td id="table-stand-lose" class="tg-yw4l"></td>
    <td id="table-double-lose" class="tg-yw4l"></td>
  </tr>
  <tr>
    <td class="tg-lqy6">Return</td>
    <td id="table-hit-return" class="tg-yw4l"></td>
    <td id="table-stand-return" class="tg-yw4l"></td>
    <td id="table-double-return" class="tg-yw4l"></td>
  </tr>
</table>
`;
  
  $('#mainContainer > .content-wrapper.m-left20.left').append(tableResults);
}


/**
 * Program execution
 *
 */
// var card1 = new Card("spade", "K");
// var card2 = card1.Clone();
// card1.suit = "diamonds";
// console.log(card1);
// console.log(card2);

// var playerHand = new BlackjackHand();
// playerHand.AddCard(new Card("S", "6"));
// playerHand.AddCard(new Card("S", "2"));
// playerHand.AddCard(new Card("S", "4"));

// var dealerHand = new BlackjackHand();
// dealerHand.AddCard(new Card("C", "7"));
// var remainingDeck = CreateNewDeck();
// console.log(remainingDeck.length)
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 2);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 2);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 4);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 7);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 7);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 10);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 10);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 10);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 10);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 9);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 9);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 3);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 6);
// remainingDeck = RemoveCardByHardValueAndGetClone(remainingDeck, 1);
// console.log(remainingDeck.length)
// //updateGameState(responseText, remainingDeck, playerHand, dealerHand);
// console.log(playerHand);
// console.log(dealerHand);
// CalculateActionProbabilities(remainingDeck, playerHand, dealerHand);

addTableStyles();
addTables();
setCasinoBlackjackAjaxListener();

