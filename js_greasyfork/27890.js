// Blackjack return calculator
// Version 0.1.0
// ==UserScript==
// @name         BlackJack
// @namespace    spaces
// @version      0.1
// @description  black jack helper
// @author       someone
// @match        *.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27890/BlackJack.user.js
// @updateURL https://update.greasyfork.org/scripts/27890/BlackJack.meta.js
// ==/UserScript==


// The number of fractional digits to show when displaying return.
var maxReturnFractionDigits = 4;


// Calculates the "hard" value of a given card (format Array(suit, face value)),
// where "hard value" is the absolute minimum the card is worth and "face value"
// is a string from 2-10 or J/K/Q/A.
function CalculateHardValueOfCard(cardToCalculate) {
    var counter = 0;
    if (["K", "Q", "J", "10"].indexOf(cardToCalculate[1]) > -1) {
        counter = 10;
    } else if (["A", "K", "Q", "J", "10"].indexOf(cardToCalculate[1]) === -1) {
        counter = parseInt(cardToCalculate[1]);
    } else {
        // Ace
        counter = 1;
    }
    return counter;
}


// Represents an individual player or dealer game hand at a particular point.
class BlackjackHand {
    constructor() {
        this.cards = Array();
        this.numCards = 0;
        this.hardTotal = 0;
        this.numAces = 0;
    }
    
    AddCardAsString(cardString) {
        var newCardHardValue = CalculateHardValueOfCard(cardString);
        if (newCardHardValue == 1) {
            this.cards[this.numCards++] = 'A';
            this.numAces++;
        } else {
            this.cards[this.numCards++] = newCardHardValue;
        }
        this.hardTotal += newCardHardValue;
    }
    
    AddCardAsInt(hardCardValue) {
        if (hardCardValue == 1) {
            this.cards[this.numCards++] = 'A';
            this.numAces++;
        } else {
            this.cards[this.numCards++] = hardCardValue;
        }
        
        this.hardTotal += hardCardValue;
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
    
    ToString() {
        var cardString = '';
        for (var i = 0; i < this.numCards; ++i) {
            if (i > 0) {
                cardString += "/";
            }
            cardString += this.cards[i];
        }
        
        return cardString + ' (' + this.GetSoftTotal() + ')';
    }
    
    Clone() {
        var copyOfThis = new BlackjackHand();
        
        copyOfThis.cards = this.cards;
        copyOfThis.numCards = this.numCards;
        copyOfThis.hardTotal = this.hardTotal;
        copyOfThis.numAces = this.numAces;
        
        return copyOfThis;
    }    
}


// Storage for the solution space discovered by searching a particular set of possible configurations.
class ResultProbabilities {
    constructor() {
        this.baseCaseWin = 0;
        this.baseCasePush = 0;
        this.baseCaseLoss = 0;
        this.winOnStand = 0;
        this.pushOnStand = 0;
        this.lossOnStand = 0;
        this.winOnDouble = 0;
        this.pushOnDouble = 0;
        this.lossOnDouble = 0;
        this.winOnBestHitOption = 0;
        this.pushOnBestHitOption = 0;
        this.lossOnBestHitOption = 0;
    }
    
    // Adds the probabilities of an existing ResultProbabilities object to this one.
    AddOther(otherResultProbabilities) {
        this.baseCaseWin += otherResultProbabilities.baseCaseWin;
        this.baseCasePush += otherResultProbabilities.baseCasePush;
        this.baseCaseLoss += otherResultProbabilities.baseCaseLoss;
        this.winOnStand += otherResultProbabilities.winOnStand;
        this.pushOnStand += otherResultProbabilities.pushOnStand;
        this.lossOnStand += otherResultProbabilities.lossOnStand;
        this.winOnDouble += otherResultProbabilities.winOnDouble;
        this.pushOnDouble += otherResultProbabilities.pushOnDouble;
        this.lossOnDouble += otherResultProbabilities.lossOnDouble;
        this.winOnBestHitOption += otherResultProbabilities.winOnBestHitOption;
        this.pushOnBestHitOption += otherResultProbabilities.pushOnBestHitOption;
        this.lossOnBestHitOption += otherResultProbabilities.lossOnBestHitOption;
    }
    
    // Base case probabilities:
    // For the state being explored, no further action (or inaction) is required to know the outcome.
    // One or both players has a natural, has busted, or has a five-card charlie, or else the player
    // has chosen to stand and the dealer has 17+ (or even a five-card charlie).
    AddBaseCaseWinProbability(baseCaseWinSolutionSpace) {
        this.baseCaseWin += baseCaseWinSolutionSpace;
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
        this.winOnStand += winOnStandSolutionSpace;
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
        this.winOnDouble += winOnDoubleSolutionSpace;
    }
    
    AddPushOnDoubleProbability(pushOnDoubleSolutionSpace) {
        this.pushOnDouble += pushOnDoubleSolutionSpace;
    }
    
    AddLossOnDoubleProbability(lossOnDoubleSolutionSpace) {
        this.lossOnDouble += lossOnDoubleSolutionSpace;
    }

    // Hit "best option" probabilities:
    // For the state being explored, the probability of winning/pushing/losing if the player hit
    // and then chose the best option further down the tree.
    // Note: This option is not populated on the first level of the tree, where those results are to be interpreted
    // by the player to make their own choice.
    AddWinOnBestHitOptionProbability(winOnBestHitOptionSolutionSpace) {
        this.winOnBestHitOption += winOnBestHitOptionSolutionSpace;
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
        var winProbability = this.baseCaseWin + this.winOnStand;
        var lossProbability = this.baseCaseLoss + this.lossOnStand;
        return winProbability * 2 / (winProbability + lossProbability);
    }
    
    // Gets the expected return from hitting and then selecting the best option in the state being explored.
    // That is to say, get the proportion of the money put in that the player is likely to get back
    // if they were to hit at this point or if the hand were already decided when they got here.
    GetExpectedBestHitOptionReturn() {
        var winProbability = this.baseCaseWin + this.winOnBestHitOption;
        var lossProbability = this.baseCaseLoss + this.lossOnBestHitOption;
        return winProbability * 2 / (winProbability + lossProbability);
    }
}


// Clones the list of remaining cards with a given card soft value removed.
// Intended for use only when the suit and disambiguation of 10-value cards is not needed.
function RemoveCardAndGetClone(remainingCards, hardCardValueToRemove) {
    var newRemainingCards = [];
    var cardHasBeenRemoved = false;
    for (var i = 0; i < remainingCards.length; ++i) {
        if (cardHasBeenRemoved) {
            newRemainingCards.push(remainingCards[i]);
        } else if (CalculateHardValueOfCard(remainingCards[i]) != hardCardValueToRemove) {
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
        var newCardHardValue = CalculateHardValueOfCard(remainingDeck[i]);
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
    
    console.debug('Calculating probabilities for player ' + playerHand.ToString() + ' vs ' + dealerHand.ToString() + '...');
    
    // Handle the top level of options here, then call the recursive search function.
    var hardValueProbabilityArray = GetHardCardSelectionProbabilityArray(remainingDeck, 1.0);
    
    // Get results for the player standing, first.
    var playerStandResultProbabilities = new ResultProbabilities();
    // Explore the solution space starting with the dealer's undercard.
    console.debug('Exploring player stand...');
    hardValueProbabilityArray.forEach(function(probabilityOfCard, hardValueOfCard, array) {
        // Explore this branch of the solution space.
        CalculateActionProbabilitiesRecursive(remainingDeck, playerHand.Clone(), dealerHand.Clone(),
                                              hardValueOfCard, false, probabilityOfCard, playerStandResultProbabilities);
    });
    
    // Now get results for the player hitting.
    var playerHitResultProbabilities = new ResultProbabilities();
    var hitAndBestOptionWinProbability = 0;
    var hitAndBestOptionPushProbability = 0;
    var hitAndBestOptionLossProbability = 0;
    // Explore the solution space starting with the player's first hit.
    hardValueProbabilityArray.forEach(function(probabilityOfCard, hardValueOfCard, array) {
        // Explore this branch of the solution space.
        console.debug('Exploring player hitting and receiving ' + (hardValueOfCard == 1 ? 'A' : hardValueOfCard) + '...');
        var thisHitResultProbabilities = CalculateActionProbabilitiesRecursive(remainingDeck, playerHand.Clone(), dealerHand.Clone(),
                                              hardValueOfCard, true, probabilityOfCard, playerHitResultProbabilities);
        if (thisHitResultProbabilities.GetExpectedBestHitOptionReturn() >= thisHitResultProbabilities.GetExpectedStandReturn()) {
            hitAndBestOptionWinProbability += thisHitResultProbabilities.baseCaseWin + thisHitResultProbabilities.winOnBestHitOption;
            hitAndBestOptionPushProbability += thisHitResultProbabilities.baseCasePush + thisHitResultProbabilities.pushOnBestHitOption;
            hitAndBestOptionLossProbability += thisHitResultProbabilities.baseCaseLoss + thisHitResultProbabilities.lossOnBestHitOption;
        } else {
            hitAndBestOptionWinProbability += thisHitResultProbabilities.baseCaseWin + thisHitResultProbabilities.winOnStand;
            hitAndBestOptionPushProbability += thisHitResultProbabilities.baseCasePush + thisHitResultProbabilities.pushOnStand;
            hitAndBestOptionLossProbability += thisHitResultProbabilities.baseCaseLoss + thisHitResultProbabilities.lossOnStand;
        }
        
    });
    
    console.debug("\n");
    if (playerStandResultProbabilities.baseCaseWin == 1) {
        console.debug("A winner is you!");
        return;
    }
    
    var standWinProbability = playerStandResultProbabilities.baseCaseWin;
    var standPushProbability = playerStandResultProbabilities.baseCasePush;
    var standLossProbability = playerStandResultProbabilities.baseCaseLoss;
    var expectedStandReturn = standWinProbability * 2 / (standWinProbability + standLossProbability);
    var doubleWinProbability = playerHitResultProbabilities.baseCaseWin + playerHitResultProbabilities.winOnStand;
    var doublePushProbability = playerHitResultProbabilities.baseCasePush + playerHitResultProbabilities.pushOnStand;
    var doubleLossProbability = playerHitResultProbabilities.baseCaseLoss + playerHitResultProbabilities.lossOnStand;
    var expectedDoubleReturn = doubleWinProbability * 2 / (doubleWinProbability + doubleLossProbability);
    var expectedHitAndBestOptionReturn = hitAndBestOptionWinProbability * 2 / (hitAndBestOptionWinProbability + hitAndBestOptionLossProbability);

    console.debug("If you stand, your chances are:"
                  + "\nWin: %" + (standWinProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nPush: %" + (standPushProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nLose: %" + (standLossProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nTotal: %" + ((standWinProbability + standPushProbability + standLossProbability) * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nReturn: " + expectedStandReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }));

    console.debug("If you double, your chances are:"
                  + "\nWin: %" + (doubleWinProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nPush: %" + (doublePushProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nLose: %" + (doubleLossProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nTotal: %" + ((doubleWinProbability + doublePushProbability + doubleLossProbability) * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nReturn: " + expectedDoubleReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }));

    console.debug("If you hit, your chances are:"
                  + "\nWin: %" + (hitAndBestOptionWinProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nPush: %" + (hitAndBestOptionPushProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nLose: %" + (hitAndBestOptionLossProbability * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nTotal: %" + ((hitAndBestOptionWinProbability + hitAndBestOptionPushProbability + hitAndBestOptionLossProbability) * 100).toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits })
                  + "\nReturn: " + expectedHitAndBestOptionReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }));
    
    var expectedReturnHtml = "<h5>Stand return: " + expectedStandReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "</h5>";
    if (playerHand.numCards == 2) {
        expectedReturnHtml += "<h5>Double return: " + expectedDoubleReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "</h5>";
    }
    expectedReturnHtml += "<h5>Hit return: " + expectedHitAndBestOptionReturn.toLocaleString('EN', { maximumFractionDigits : maxReturnFractionDigits }) + "</h5>";
	
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
    }

    // We may not be at a base case, prepare for deeper searches.
    var remainingDeckWithCardRemoved = RemoveCardAndGetClone(remainingDeck, nextCard);
    var hardValueProbabilityArray = GetHardCardSelectionProbabilityArray(remainingDeckWithCardRemoved, segmentProbability);
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
            // Dealer must hit again, and we must go deeper!
            hardValueProbabilityArray.forEach(function(probabilityOfCard, hardValueOfCard, array) {
                CalculateActionProbabilitiesRecursive(remainingDeckWithCardRemoved, playerHand.Clone(), dealerHand.Clone(),
                                                      hardValueOfCard, false, probabilityOfCard, dealerHitResultProbabilities);
            });

            // All dealer hit results are limited by base cases.
            thisActionResultProbabilities.AddBaseCaseWinProbability(dealerHitResultProbabilities.baseCaseWin);
            thisActionResultProbabilities.AddBaseCasePushProbability(dealerHitResultProbabilities.baseCasePush);
            thisActionResultProbabilities.AddBaseCaseLossProbability(dealerHitResultProbabilities.baseCaseLoss);
        }
        
        resultProbabilities.AddOther(thisActionResultProbabilities);
        return thisActionResultProbabilities;
    }
    
    // Calculate stand option results first.
    var thisStandOptionWin = 0;
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

        thisActionResultProbabilities.AddWinOnStandProbability(dealerHitResultProbabilities.baseCaseWin);
        thisActionResultProbabilities.AddPushOnStandProbability(dealerHitResultProbabilities.baseCasePush);
        thisActionResultProbabilities.AddLossOnStandProbability(dealerHitResultProbabilities.baseCaseLoss);
    }
    
    // Calculate hit option results.
    hardValueProbabilityArray.forEach(function(probabilityOfCard, hardValueOfCard, array) {
        var thisHitResultProbabilities = CalculateActionProbabilitiesRecursive(remainingDeckWithCardRemoved, playerHand.Clone(), dealerHand.Clone(),
                                              hardValueOfCard, true, probabilityOfCard, playerHitResultProbabilities);
        if (thisHitResultProbabilities.GetExpectedBestHitOptionReturn() >= thisHitResultProbabilities.GetExpectedStandReturn()) {
            thisActionResultProbabilities.AddWinOnBestHitOptionProbability(thisHitResultProbabilities.baseCaseWin + thisHitResultProbabilities.winOnBestHitOption);
            thisActionResultProbabilities.AddPushOnBestHitOptionProbability(thisHitResultProbabilities.baseCasePush + thisHitResultProbabilities.pushOnBestHitOption);
            thisActionResultProbabilities.AddLossOnBestHitOptionProbability(thisHitResultProbabilities.baseCaseLoss + thisHitResultProbabilities.lossOnBestHitOption);
        } else {
            thisActionResultProbabilities.AddWinOnBestHitOptionProbability(thisHitResultProbabilities.baseCaseWin + thisHitResultProbabilities.winOnStand);
            thisActionResultProbabilities.AddPushOnBestHitOptionProbability(thisHitResultProbabilities.baseCasePush + thisHitResultProbabilities.pushOnStand);
            thisActionResultProbabilities.AddLossOnBestHitOptionProbability(thisHitResultProbabilities.baseCaseLoss + thisHitResultProbabilities.lossOnStand);
        }
    });

    resultProbabilities.AddOther(thisActionResultProbabilities);
    return thisActionResultProbabilities;
}



var playerHand = new BlackjackHand();
playerHand.AddCardAsInt(2);
playerHand.AddCardAsInt(2);
var dealerHand = new BlackjackHand();
dealerHand.AddCardAsInt(10);
    console.debug('Player\'s hand: ' + playerHand.ToString());
    console.debug('Dealer\'s hand: ' + dealerHand.ToString());
    
var remainingDeck = Array();
var i = 0;
for ( ; i < 10; ++i) {
    remainingDeck[i] = Array('NA', '8');
}
for ( ; i < 20; ++i) {
    remainingDeck[i] = Array('NA', '10');
}
for ( ; i < 30; ++i) {
    remainingDeck[i] = Array('NA', '2');
}

CalculateActionProbabilities(remainingDeck, playerHand, dealerHand);

