// ==UserScript==
// @name         Viktory Script
// @namespace    http://tampermonkey.net/
// @version      2024-07-13
// @description  Komputer - an AI for Viktory II
// @author       Stephen Wilbo Montague
// @match        http://gamesbyemail.com/Games/Viktory2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamesbyemail.com
// @downloadURL https://update.greasyfork.org/scripts/493364/Viktory%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/493364/Viktory%20Script.meta.js
// ==/UserScript==



(function() {
    // Begin main script.
    console.log("Hello Viktory.");

    // Wait for page load.
    waitForKeyElements("#Foundation_Elemental_7_savePlayerNotes", () => {

        // Alias the game, add controls.
        const thisGame = Foundation.$registry[7];
        addRunButton("Let Komputer Play", runKomputerClick, thisGame);
        addStopButton("Cancel", stopKomputerClick);

        // Add global error handling.
        window.onerror = function() {
            console.warn(`Caught error. Will reset controls.`);
            clearIntervalsAndTimers();
            resetGlobals(true);
        };

        // Ready
        window.IS_KOMPUTER_READY = true;
   }); // End wait for page load

})(); // End main.


function runKomputerClick(thisGame)
{
    if (window.IS_KOMPUTER_READY)
    {
        resetGlobals();
        styleButtonForRun();
        runKomputer(thisGame);
    }
}


function clearIntervalsAndTimers()
{
  for (var i = setTimeout(function() {}, 0); i > 0; i--) {
    window.clearInterval(i);
    window.clearTimeout(i);
  }
}


function resetGlobals(resetButton = false)
{
    window.stop = false;
    window.moveIntervalId = null;
    window.movingUnitIndex = 0;
    window.moveWave = 0;
    window.isExploring = false;
    window.isBombarding = false;
    window.isUnloading = false;
    window.isBattleSelected = false;
    window.isManeuveringToAttack = false;
    window.IS_KOMPUTER_READY = false;
    if (resetButton)
    {
        resetKomputerButtonStyle(false);
        window.IS_KOMPUTER_READY = true;
    }
    window.currentPlayerTurn = Foundation.$registry[7].perspectiveColor;
}


function runKomputer(thisGame)
{
    if (window.stop === true)
    {
        stopAndReset();
        return;
    }
    console.log("Checking movePhase.");
    // Handle current state
    switch(thisGame.movePhase)
    {
        case 0:
            console.log("Game won.");
            setTimeout(function(){
                window.IS_KOMPUTER_READY = true;
                resetKomputerButtonStyle(true);
                }, 1200);
            break;
        case 2:
            console.log("Placing capital.");
            placeCapital(thisGame);
            break;
        case 5:
            console.log("Movement Wave: " + window.moveWave);
            moveUnits(thisGame);
            break;
        case 6:
            console.log("Retreat is not an option. Returning to battle.");
            thisGame.movePhase = 5;
            thisGame.update();
            break;
        case 11:
            console.log("Placing reserves.");
            placeReserves(thisGame);
            break;
        default:
            console.log("Unhandled movePhase: " + thisGame.movePhase);
    }
}


function moveUnits(thisGame)
{
    const moveIntervalPeriod = 1000;
    const moveDelay = 400;
    setTimeout(async function(){
        switch (window.moveWave)
        {
            case 0: {
                console.log("May move land units.");
                const landUnits = getAvailableLandUnits(thisGame, thisGame.perspectiveColor);
                moveEachUnitByInterval(thisGame, landUnits, moveIntervalPeriod);
                break;
            }
            case 1: {
                console.log("May move frigates.");
                const frigates = getFrigates(thisGame, thisGame.perspectiveColor);
                moveEachUnitByInterval(thisGame, frigates, moveIntervalPeriod);
                break;
            }
            case 2: {
                console.log("May move all available.");
                const landUnits = getAvailableLandUnits(thisGame, thisGame.perspectiveColor);
                const frigates = getFrigates(thisGame, thisGame.perspectiveColor);
                const allMilitaryUnits = landUnits.concat(frigates);
                moveEachUnitByInterval(thisGame, allMilitaryUnits, moveIntervalPeriod);
                break;
            }
            case 3:{
                console.log("Handling all battles.");
                const battlePiece = findNextBattle(thisGame);
                if (battlePiece)
                {
                    fightBattle(thisGame, battlePiece);
                }
                else
                {
                    window.moveWave++;
                    runKomputer(thisGame);
                }
                break;
            }
            case 4: {
                console.log("Ending movement.");
                endMovementPhase(thisGame);
            }
        }
    }, moveDelay);
}


function getAvailableLandUnits(thisGame, color)
{
    let landUnits = [];
    for (const piece of thisGame.pieces)
    {
        // Skip reserve units
        if (piece.valueIndex === - 1)
        {
            continue;
        }
        for (const unit of piece.units)
        {
            if (unit.color === color && unit.type !== "f" && ( unit.canMove() || unit.canBombard()) )
            {
                landUnits.push(unit);
            }
        }
    }
    return landUnits;
}


function getFrigates(thisGame, color)
{
    let frigates = [];
    for (const piece of thisGame.pieces)
    {
        // Skip reserve units
        if (piece.valueIndex === - 1)
        {
            continue;
        }
        for (const unit of piece.units)
        {
            if (unit.color === color && unit.type === "f")
            {
                frigates.push(unit);
            }
        }
    }
    return frigates;
}


async function endMovementPhase(thisGame)
{
    // Reset movement, then restart loop to place reserves, or stop for the next player.
    window.moveWave = 0;
    thisGame.endMyMovement();
    window.moveIntervalId = await setInterval(function(){
        if (thisGame.movePhase === 11)
        {
            clearInterval(window.moveIntervalId);
            runKomputer(thisGame);
        }
        else if(window.currentPLayerTurn !== thisGame.perspectiveColor)
        {
            clearInterval(window.moveIntervalId);
            thisGame.removeExcessPieces(thisGame.perspectiveColor, true);
            window.IS_KOMPUTER_READY = true;
            resetKomputerButtonStyle();
            console.log("Done.");
        }
        else
        {
            thisGame.endMyMovement();
        }
    }, 200);
}


async function moveEachUnitByInterval(thisGame, movableUnits, intervalPeriod)
{
    window.moveIntervalId = await setInterval(function(){
        if (window.stop === true)
        {
            stopAndReset();
            return;
        }
        // Get the next unit and decide if it may move.
        const unit = movableUnits[window.movingUnitIndex];
        const mayMoveThisWave = decideMayMoveThisWave(thisGame, unit);
        const firstMoveWave = 0;
        const finalMoveWave = 2;
        if (mayMoveThisWave)
        {
            const possibleMoves = unit.getMovables();
            if (possibleMoves)
            {
                // Decide best move, or maybe don't accept any move to stay.
                const isEarlyMover = ( window.movingUnitIndex < (movableUnits.length * 0.6) && window.moveWave === firstMoveWave );
                const pieceIndex = getBestMove(thisGame, possibleMoves, unit, isEarlyMover).index;
                const shouldAcceptMove = decideMoveAcceptance(thisGame, unit, pieceIndex);
                if (shouldAcceptMove)
                {
                    // Move unit.
                    let originScreenPoint = unit.screenPoint;
                    moveUnitSimulateMouseDown(thisGame, originScreenPoint, unit);
                    let destinationScreenPoint = thisGame.pieces[pieceIndex].$screenRect.getCenter();
                    moveUnitSimulateMouseUp(thisGame, destinationScreenPoint);
                    // Commit to explore after some processing time.
                    const normalPopup = document.getElementById("Foundation_Elemental_7_overlayCommit");
                    if (normalPopup || document.getElementById("Foundation_Elemental_7_customizeMapDoAll") )
                    {
                        if (normalPopup)
                        {
                            thisGame.overlayCommitOnClick();
                        }
                        setTimeout(function(){
                            const waterPopup = document.getElementById("Foundation_Elemental_7_waterSwap");
                            if (waterPopup)
                            {
                                thisGame.swapWaterForLand();
                                console.log("Water swap!");
                            }
                            setTimeout(function(){
                                const hexTerrain = thisGame.getMapCustomizationData();
                                if (hexTerrain.length > 2)
                                {
                                    thisGame.playOptions.mapCustomizationData = shuffle(hexTerrain);
                                }
                                thisGame.customizeMapDoAll(true);
                                window.isExploring = false;
                            }, 100);
                        }, 400);
                        window.isExploring = true;
                    }
                    // Make sure frigates can unload all cargo
                    if (unit.isFrigate() && unit.hasUnloadables() && (window.moveWave === finalMoveWave) && thisGame.pieces[pieceIndex].isLand())
                    {
                        window.isUnloading = true;
                    }
                    else
                    {
                        window.isUnloading = false
                    }
                } // End if shouldAcceptMove
            } // End if possibleMoves
            window.isManeuveringToAttack = (window.isManeuveringToAttack && !unit.movementComplete) ? true : false;
        }// End if may move
        decideHowToContinueMove(thisGame, movableUnits, unit, finalMoveWave);
    }, intervalPeriod);
}


function decideMayMoveThisWave(thisGame, unit)
{
    if (!unit || !unit.piece || window.isExploring || window.isBombarding)
    {
        return false
    }
    if (!unit.movementComplete || unit.hasUnloadables())
    {
        // Hold back artillery and cavalry who don't have an adjacent frigate and who aren't maneuvering to attack from moving the first wave - to better support any battles started by infantry.
        return ( window.moveWave > 0 ? true : (unit.type === "c" || unit.type === "a") && !hasAdjacentFrigate(thisGame, unit.piece) && !window.isManeuveringToAttack ? false : true );
    }
    return false;
}


function decideHowToContinueMove(thisGame, movableUnits, unit, finalMoveWave)
{
    if (window.isExploring || window.isBombarding || window.isUnloading || window.isManeuveringToAttack)
    {
        // Pass: wait for these to finish.
    }
    // Bombard on the final wave.
    else if (window.moveWave === finalMoveWave &&
             unit && unit.canBombard() && unit.piece && unit.getBombardables())
    {
        window.isBombarding = true;
        bombard(thisGame, unit, unit.getBombardables());
    }
    // Move the next unit next interval.
    else if ( (window.movingUnitIndex + 1) < movableUnits.length )
    {
        window.movingUnitIndex++;
    }
    // Clear interval, reset moving unit index, cue next wave or game action.
    else
    {
        clearInterval(window.moveIntervalId);
        window.movingUnitIndex = 0;
        window.moveWave++;
        runKomputer(thisGame);
    }
}


function getBestMove(thisGame, possibleMoves, unit, isEarlyMover)
{
    let bestMoveScore = -1;
    let bestMoves = [];
    for (const possibleMove of possibleMoves)
    {
        const possibleMoveScore = getMoveScore(thisGame, possibleMove, unit);
        if (possibleMoveScore > bestMoveScore)
        {
            bestMoveScore = possibleMoveScore;
            bestMoves = [];
            bestMoves.push(possibleMove);
        }
        else if (possibleMoveScore === bestMoveScore)
        {
            bestMoves.push(possibleMove);
        }
    }
    return (bestMoves.length > 1 ? getRandomItem(bestMoves) : bestMoves.pop());
}


function getMoveScore(thisGame, possibleMove, unit, isEarlyMover)
{
    const piece = thisGame.pieces.findAtXY(possibleMove.x, possibleMove.y);
    const enemyColor = !thisGame.perspectiveColor * 1;
    if (unit.isFrigate())
    {
        return getFrigateMoveScore(thisGame, piece, unit, enemyColor);
    }
    else
    {
        let score = 0;
        // Convert terrain defenses of [0, 1, 2] to [0.05, 0.1, 0.15].
        const terrainDefenseBonus = 0.1 * (( piece.terrainDefenses() * 0.5 ) + 0.5);
        if (piece.hasRollingOpponent(thisGame.perspectiveColor))
        {
            const defendingUnitCount = piece.countOpponentMilitary(thisGame.perspectiveColor);
            const defendingRollCount = piece.numDefenderRolls(piece.getOpponentColor(thisGame.perspectiveColor));
            const defensivePower = (0.08 * defendingRollCount) + (0.04 * defendingUnitCount);

            // Check enemy cities & towns.
            if (piece.hasOpponentCivilization(thisGame.perspectiveColor))
            {
                // Urgently try to retake a lost capital.
                if (piece.hasCapital(thisGame.perspectiveColor))
                {
                    return 1;
                }
                // Complete any tactical maneuver across open terrain.
                if (window.isManeuveringToAttack && piece.hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor))
                {
                    return 1;
                }
                // Look for undefended enemy towns.
                if (defendingUnitCount === 0)
                {
                    score = piece.hasCapital(enemyColor) ? 0.99 : defendingRollCount === 1 ? 0.98 : 0.96;
                }
                // Then look at weaker enemy towns.
                else
                {
                    score = 1 - defensivePower;
                }
                // Randomly increase the priority of attacks so that:
                // Units will often gather to beseige & surround first, when random is low.
                // Units are able to attack even a heavy defense, when random is high.
                // As noted below, once one unit attacks, usually others follow.
                score += 0.125 * Math.random() + (1 - score) * Math.random() * 0.325;
            }
            // Check enemy in the countryside.
            else
            {
                score = 0.9 - defensivePower;
                // Prioritize enemy beseiging / pinning a friendly town.
                if (hasAdjacentCivilization(thisGame, piece))
                {
                    score += 0.125 * Math.random();
                }
            }
            // More likely join battles already begun, especially artillery and cavalry, but avoid overkill on weak targets.
            if (piece.hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor) && isNotOverkill(thisGame, piece))
            {
                score += unit.type === "i" ? 0.1875 : 0.25;
            }
        }
        // Try to beseige / pin enemy cities and towns, on the safest terrain.
        else if (hasAdjacentEnemyCivilization(thisGame, piece))
        {
            score = 0.7 + terrainDefenseBonus;
            // Maybe maneuver unit before attack.
            // If unit has extra moves close to a battle, pass through open terrain to get more attack vectors.
            const isFirstMoveWave = window.moveWave === 0;
            const remainingMoveAllowance = unit.movementAllowance - unit.spacesMoved;
            const canManeuverBeforeAttack = (possibleMove.spacesNeeded < remainingMoveAllowance);
            const hasOpenTerrain = !piece.isSlowTerrain(thisGame.perspectiveColor, thisGame.player.team.rulerColor);
            const hasMultipleUnits = thisGame.pieces[unit.piece.index].countMilitaryUnits(thisGame.pieces[unit.piece.index].units);
            if (isFirstMoveWave && canManeuverBeforeAttack && hasOpenTerrain && hasMultipleUnits && hasAdjacentBattle(thisGame, piece))
            {
                if (Math.random() < 0.5)
                {
                    // If the unit boards a frigate, don't raise the maneuvering flag, so that the frigate can take control.
                    if (!piece.hasFrigate(thisGame.perspectiveColor))
                    {
                        window.isManeuveringToAttack = true;
                    }
                    return 1;
                }
            }
        }
        // Give importance to own civ defense.
        else if (piece.hasCivilization(thisGame.perspectiveColor))
        {
            const defensivePower = calculateDefensivePower(thisGame, piece);
            const threat = guessThreat(thisGame, piece);
            score = defensivePower < threat ? ( piece.hasCapital(thisGame.perspectiveColor) || (defensivePower < 3) ) ? 0.90 + (0.06 * Math.random()) : 0.8 + (0.125 * Math.random()): 0;
            // Early moving units should concentrate on offense, later units on defense.
            score -= isEarlyMover ? 0.125 : 0;
        }
        // Consider boarding a frigate.
        else if (piece.hasFrigate(thisGame.perspectiveColor))
        {
            score = 0.82;
            // More likely board if others on board.
            if (piece.findFrigate(thisGame.perspectiveColor).cargo.length > 0)
            {
                // Results in a range of [0.945, 0.97625], so it may compete with any other attacking or defending moves, except maximum priority ones.
                // Boarding with enough force to make a difference is often critical to be worthwhile.
                score += 0.125 + (0.03125 * Math.random());
            }
        }
        // Move towards a friend / enemy target, ending on the safest terrain.
        else
        {
            const enemyColor = thisGame.perspectiveColor === 0 ? 1 : 0;
            const enemyArmies = getArmyUnits(thisGame, enemyColor);
            let enemyTarget = enemyArmies ? getRandomItem(enemyArmies) : getRandomItem(thisGame.pieces.getOpponentCivilizations(thisGame.perspectiveColor)).findCivilization(enemyColor);
            const distanceToEnemy = thisGame.distanceBewteenPoints(enemyTarget.piece.boardPoint, piece.boardPoint);
            score = 0.56 + (terrainDefenseBonus / (distanceToEnemy * 4));
            score += hasAdjacentHiddenTerrain(thisGame, piece) ? 0.125 : 0
            score -= isEarlyMover ? 0.125 : 0;
        }
        // Clamp score between [0,1].
        score = score < 0 ? 0 : score > 1 ? 1 : score;
        return score;
    }
}


function getFrigateMoveScore(thisGame, piece, unit, enemyColor)
{
    let score = 0;
    const hasEnemyFrigate = piece.hasFrigate(enemyColor);
    if (unit.hasUnloadables())
    {
        // Loaded frigates should move toward enemy coastal towns.
        const enemyCivs = thisGame.pieces.getOpponentCivilizations(thisGame.perspectiveColor);
        let coastalCivs = [];
        for (const civPiece of enemyCivs)
        {
            if (unit.piece.isPerimeter() && hasAdjacentDeepWater(thisGame, civPiece) || hasAdjacentAccessibleInlandSea(thisGame, civPiece, unit))
            {
                coastalCivs.push(civPiece);
            }
        }
        const targetCivs = coastalCivs.length > 0 ? coastalCivs : enemyCivs;
        const distance = getDistanceToNearestFrigateTarget(thisGame, targetCivs, piece);
        if (distance >= 0)
        {
            score = ( 1 / (distance + 1) ) * 0.7;
        }
        score += distance === 0 ? 1 / (piece.countOpponentMilitary(thisGame.perspectiveColor) + 1) * 0.125 : 0;
        score += piece.hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor) ? 0.0625 : 0;
        if (hasEnemyFrigate)
        {
            score += 0.03125;
        }
    }
    else
    {
        // Unloaded frigates should support friendlies.
        let friendlyArmyUnits = getArmyUnits(thisGame, thisGame.perspectiveColor);
        if (friendlyArmyUnits)
        {
            const distance = getDistanceToNearestUnit(thisGame, friendlyArmyUnits, piece);
            score = ( 1 / (distance + 1) ) * 0.7;
        }
        score += hasAdjacentCivilization(thisGame, piece) ? 0.125 : 0;
        score += hasAdjacentEnemyTown(thisGame, piece) ? 0.03125 : 0;
        if (hasEnemyFrigate && piece.findFrigate(enemyColor).hasUnloadables())
        {
            score += 0.0625;
        }
    }
    // Add small weight for other considerations.
    score += hasAdjacentBattle(thisGame, piece) ? 0.03125 : 0;
    score += hasAdjacentEnemyArmy(thisGame, piece) ? 0.03125 : 0;
    // Clamp to [0,1].
    score = score < 0 ? 0 : score > 1 ? 1 : score;
    return score;
}


function isNotOverkill(thisGame, piece)
{
    const enemyColor = !thisGame.perspectiveColor * 1;
    const defenderUnitCount = piece.getMilitaryUnitCount(enemyColor);
    const defenderRollCount = piece.numDefenderRolls(enemyColor);
    const defenderPower = (2 * defenderRollCount) + defenderUnitCount;
    const attackerUnitCount = piece.getMilitaryUnitCount(thisGame.perspectiveColor);
    const attackerRollCount = piece.numAttackerRolls(thisGame.perspectiveColor);
    const attackerPower = (2 * attackerRollCount) + attackerUnitCount;
    const isOverkill = defenderPower < attackerPower * 0.6 ? true : false;
    return !isOverkill;
}


function calculateDefensivePower(thisGame, piece)
{
    const civDefenderCount = piece.getMilitaryUnitCount(thisGame.perspectiveColor);
    const civRollCount = piece.numDefenderRolls(thisGame.perspectiveColor);
    return (civDefenderCount ? (2 * civRollCount) + civDefenderCount : piece.hasCity(thisGame.perspectiveColor) ? 2 : 1);
}


function guessThreat(thisGame, piece)
{
    const enemyColor = !thisGame.perspectiveColor * 1;
    const enemyArmyUnits = getArmyUnits(thisGame, enemyColor);
    if (!enemyArmyUnits)
    {
        return 0;
    }

    let threatCount = 0;
    let hasInfantry = false;
    let hasCavalry = false;
    let hasArtillery = false;

    for (const unit of enemyArmyUnits)
    {
        let inRangePoints = unit.getMovables();
        if (!inRangePoints)
        {
            continue;
        }
        for (const point of inRangePoints)
        {
            if (point.x === piece.boardPoint.x && point.y === piece.boardPoint.y)
            {
                threatCount++;
                if (!hasInfantry && unit.isInfantry())
                {
                    hasInfantry = true
                    break;
                }
                if (!hasCavalry && unit.isCavalry())
                {
                    hasCavalry = true;
                    break;
                }
                if (!hasArtillery && unit.isArtillery())
                {
                    hasArtillery = true;
                    break;
                }
                break;
            }
        }
    }
    const enemyFrigates = getFrigates(thisGame, enemyColor);
    for (const frigate of enemyFrigates)
    {
        let amphibEnemyCount = 0;
        let inRangePoints = frigate.getMovables();
        if (!inRangePoints)
        {
            continue;
        }
        for (const point of inRangePoints)
        {
            if (point.x === piece.boardPoint.x && point.y === piece.boardPoint.y)
            {
                if (frigate.cargo.length > 0)
                {
                    amphibEnemyCount += frigate.cargo.length;
                    if (!hasInfantry && frigate.carriesCargo("i"))
                    {
                        hasInfantry = true
                    }
                    if (!hasCavalry && frigate.carriesCargo("c"))
                    {
                        hasCavalry = true;
                    }
                    if (!hasArtillery && frigate.carriesCargo("a"))
                    {
                        hasArtillery = true;
                    }
                }
                const frigateCapacity = 3;
                let loadableUnitCount = 0;
                let hasFullCapacityPotential = false;
                if (amphibEnemyCount < frigateCapacity && hasAdjacentEnemyArmy(thisGame, frigate.piece))
                {
                    const adjacentPieceIndices = frigate.piece.getAdjacentIndecies(1);
                    for (const adjacentPieceIndex of adjacentPieceIndices)
                    {
                        loadableUnitCount += thisGame.pieces[adjacentPieceIndex].getMilitaryUnitCount(enemyColor);
                        if (loadableUnitCount + amphibEnemyCount >= frigateCapacity)
                        {
                            hasFullCapacityPotential = true;
                            break;
                        }
                    }
                    amphibEnemyCount = hasFullCapacityPotential ? frigateCapacity : amphibEnemyCount + loadableUnitCount;
                }
            } // End if point === inRange
        } // End for each point
        threatCount += amphibEnemyCount;
    } // End for each frigate
    // Estimate likely number of rolls, based on enemy count & type.
    const attackVectorBonus = threatCount < 2 ? 0 : threatCount < 4 ? 1 : threatCount < 6 ? 2 : threatCount < 10 ? 3 : 4;
    const threatRollCount = attackVectorBonus + hasInfantry + hasCavalry + hasArtillery;
    // Weight to favor rolls and combine to estimate threat.
    return ((2 * threatRollCount) + threatCount);
}


function getDistanceToNearestUnit(thisGame, units, originPiece)
{
    let minDistance = Number.MAX_VALUE;
    for (const unit of units)
    {
        const distance = thisGame.distanceBewteenPoints(unit.piece.boardPoint, originPiece.boardPoint);
        if (distance < minDistance)
        {
            minDistance = distance;
        }
    }
    return minDistance;
}


function getDistanceToNearestFrigateTarget(thisGame, enemyCivs, originPiece)
{
    let distance = -1;
    let minDistance = Number.MAX_VALUE;
    for (const civPiece of enemyCivs)
    {
        distance = thisGame.distanceBewteenPoints(civPiece.boardPoint, originPiece.boardPoint);
        if (distance < minDistance)
        {
            minDistance = distance
        }
    }
    return minDistance;
}


function decideMoveAcceptance(thisGame, unit, destinationIndex)
{
    // Consider guarding a vulnerable or beseiged town vs attacking a nearby enemy.
    if (unit.piece.hasCivilization(thisGame.perspectiveColor))
    {
        const defensivePower = calculateDefensivePower(thisGame, unit.piece);
        const threat = guessThreat(thisGame, unit.piece);
        const isVulnerable = defensivePower < threat;
        if ( isVulnerable || unit.piece.hasAdjacentRollingEnemy(thisGame.perspectiveColor, thisGame.player.team.rulerColor))
        {
            // Going to own capital or from own capital to fight is always approved.
            if (thisGame.pieces[destinationIndex].hasCapital(thisGame.perspectiveColor) || ( unit.piece.hasCapital(thisGame.perspectiveColor) && thisGame.pieces[destinationIndex].hasBattle(thisGame.perspectiveColor)) )
            {
                return true;
            }
            // Cavalry may always join battles that don't have friendly cavalry.
            if (unit.type === "c" && thisGame.pieces[destinationIndex].hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor && !thisGame.pieces[destinationIndex].hasCavalry(thisGame.perspectiveColor)))
            {
                return true;
            }
            // Check if last defender.
            if (unit.piece.getMilitaryUnitCount(thisGame.perspectiveColor) === 1)
            {
                // If not joining a battle, never leave, and otherwise, still rarely leave.
                if (!thisGame.pieces[destinationIndex].hasRollingOpponent(thisGame.perspectiveColor) || Math.random() < 0.9)
                {
                    unit.movementComplete = true;
                    return false;
                }
            }
            // Otherwise maybe stop the move.
            else
            {
                if (Math.random() < 0.2)
                {
                    unit.movementComplete = true;
                    return false
                }
            }
        }
    }
    return true;
}


function bombard(thisGame, unit, bombardablePoints)
{
    bombardUnitsSimulateMouseDown(thisGame, unit);
    const targetPoint = getBestTargetPoint(thisGame, bombardablePoints);
    const targetPiece = thisGame.pieces.findAtPoint(targetPoint);
    const targetScreenPoint = targetPiece.$screenRect.getCenter();
    const fireDelay = 200;
    setTimeout(function(){
        const hasFired = bombardUnitsSimulateMouseUp(thisGame, targetScreenPoint);
        if (hasFired)
        {
            const commitDelay = 200;
            setTimeout(function(){
                thisGame.overlayCommitOnClick();
                // Apply hits.
                const applyHitsDelay = 200;
                setTimeout(function(){
                    if (thisGame.battleData)
                    {
                        const data = thisGame.getBattleData();
                        if (data && data.piece.defenderBattleInfo &&
                            data.piece.defenderBattleInfo.decisionNeeded)
                        {
                            applyHits(thisGame, data.piece.index, data, true);
                        }
                    }
                    const reviewDelay = 800;
                    setTimeout(function(){
                        thisGame.pieces[targetPiece.index].bombardOkClick(thisGame.player.team.color);
                        unit.hasBombarded = unit.noBombard = unit.movementComplete = true;
                        console.log("Bombardment!");
                        window.isBombarding = false;
                    }, reviewDelay)
                }, applyHitsDelay);
            }, commitDelay);
        } // End if hasFired
        else
        {
            // Validation fix for rare bug where unit forever tries to bombard.
            unit.hasBombarded = true;
            unit.noBombard = true;
            unit.movementComplete = true;
            window.isBombarding = false;
        }
    }, fireDelay);
}


function getBestTargetPoint(thisGame, bombardablePoints)
{
    for (const bombardablePoint of bombardablePoints)
    {
        const piece = thisGame.pieces.findAtPoint(bombardablePoint);
        if (piece && piece.hasBattle(thisGame.player.team.color, thisGame.player.team.rulerColor) && piece.hasNonRulingOpponentMilitary(thisGame.perspectiveColor, thisGame.player.team.rulerColor))
        {
            return bombardablePoint;
        }
    }
    return getRandomItem(bombardablePoints);
}


function findNextBattle(thisGame)
{
    for (let piece of thisGame.pieces)
    {
        if (piece.hasBattle(thisGame.player.team.color, thisGame.player.team.rulerColor))
        {
            return piece;
        }
    }
    return null;
}


function fightBattle(thisGame, battlePiece, isReserveBattle = false)
{
    // Clear any exploration popup
    const explorationPopup = document.getElementById("Foundation_Elemental_7_overlayCommit");
    if (explorationPopup || document.getElementById("Foundation_Elemental_7_customizeMapDoAll") )
    {
        if (explorationPopup)
        {
            thisGame.overlayCommitOnClick();
        }
    }
    // Select battle
    if (!window.isBattleSelected)
    {
        thisGame.moveUnitsMouseDown(battlePiece.$screenRect.getCenter());
        window.isBattleSelected = true;
    }
    // Do prebattle artillery
    if (document.getElementById("Foundation_Elemental_7_battleOk"))
    {
        battlePiece.preBattleOkClick(thisGame.player.team.color);
    }
    // Roll loop
    const rollDelay = 200;
    setTimeout(function roll(){
        thisGame.overlayCommitOnClick();
        // Apply hits.
        const applyHitsDelay = 200;
        setTimeout(function(){
            if (thisGame.battleData)
            {
                const data = thisGame.getBattleData();
                if (data && data.piece.attackerBattleInfo &&
                    data.piece.attackerBattleInfo.decisionNeeded ||
                    data.piece.defenderBattleInfo &&
                    data.piece.defenderBattleInfo.decisionNeeded)
                {
                    applyHits(thisGame, battlePiece.index, data);
                }
            }
            // Close battle after review time, if game not won, then reroll or continue game.
            const battleReviewDelay = 1600;
            setTimeout(function(){
                if (thisGame.movePhase !== 0)
                {
                    thisGame.pieces[battlePiece.index].battleOkClick(thisGame.player.team.color);
                    const reRollDelay = 1000;
                    setTimeout(function(){
                        if (document.getElementById("Foundation_Elemental_7_overlayCommit"))
                        {
                            roll();
                        }
                        else
                        {
                            window.isBattleSelected = false;
                            if (!isReserveBattle)
                            {
                                runKomputer(thisGame);
                            }
                        }
                    }, reRollDelay);
                }
                // Game won. Leave battle on screen and end.
                else
                {
                    window.IS_KOMPUTER_READY = true;
                    resetKomputerButtonStyle(true);
                    console.log("Viktory.");
                }
            }, battleReviewDelay);
        }, applyHitsDelay);
    }, rollDelay);

}


function applyHits(thisGame, pieceIndex, battleData, isBombarding = false)
{
    const thisPiece = thisGame.pieces[pieceIndex];
    const attackerColor = thisGame.player.team.color;
    const defenderColor = (attackerColor === 0) ? 1 : 0;
    const attackerHitThreshold = thisGame.getHitThreshold(attackerColor);
    const defenderHitThreshold = thisGame.getHitThreshold(defenderColor);
    const attackerUnitList = thisPiece.getMilitaryUnitList(attackerColor);
    const defenderUnitList = thisPiece.getDefenderUnitList(defenderColor);
    thisPiece.defenderBattleInfo = thisPiece.getBattleInfo(defenderUnitList, battleData.attackerRolls, attackerHitThreshold,true);
    // Choose highest value hits on the defender.
    if (thisPiece.defenderBattleInfo.decisionNeeded)
    {
        const hitCount = thisPiece.defenderBattleInfo.numTacticalHit;
        thisPiece.hitHighestMilitaryUnits(defenderUnitList, hitCount, false);
    }
    // Check if attackers are present, since attackers may be bombarding.
    if (attackerUnitList && attackerUnitList.length > 0)
    {
        thisPiece.attackerBattleInfo = thisPiece.getBattleInfo(attackerUnitList, battleData.defenderRolls, defenderHitThreshold,false);
        // Choose lowest value hits on the attacker.
        if (thisPiece.attackerBattleInfo.decisionNeeded)
        {
            const hitCount = (thisPiece.attackerBattleInfo.numHit - thisPiece.attackerBattleInfo.numTacticalHit);
            thisPiece.hitLowestMilitaryUnits(attackerUnitList, hitCount, false);
        }
    }
    setTimeout(function(){
        if (isBombarding)
        {
            thisPiece.bombardOkClick(attackerColor);
        }
        else
        {
            thisPiece.battleOkClick(attackerColor);
        }
    }, 200);
}


async function placeReserves(thisGame)
{
    clearIntervalsAndTimers();
    window.reserveIntervalId = await setInterval(placeReserveUnit, 1100, thisGame);
}


function placeReserveUnit(thisGame){
    if (window.stop === true)
    {
        stopAndReset();
        return;
    }
    const reserveUnits = thisGame.player.team.reserveUnits;
    const controlsCapital = thisGame.doesColorControlTheirCapital(thisGame.player.team.color);
    let hasPlayableReserveUnit = false;
    if (thisGame.movePhase === 11 && reserveUnits.length > 0)
    {
        for (let i = 0; i < reserveUnits.length; i++)
        {
            if (thisGame.couldPlaceReserveUnit(reserveUnits[i], thisGame.player.team.color, controlsCapital))
            {
                thisGame.reserveOnMouseDown(thisGame, function(){return true},i);
                hasPlayableReserveUnit = true;
                break;
            }
        }
    }
    if (hasPlayableReserveUnit)
    {
        // Place reserve unit.
        const movingUnitType = thisGame.pieces.getNewPiece().movingUnit.type;
        const destinationBoardPoint = (movingUnitType === "t" || movingUnitType === "y") ? (
            getBestBuildable(thisGame) ) : (
            getBestReservable(thisGame, movingUnitType, controlsCapital) );
        const destinationScreenPoint = thisGame.screenRectFromBoardPoint(destinationBoardPoint).getCenter();
        thisGame.placeReserveOnMouseUp(destinationScreenPoint);
        if (document.getElementById("Foundation_Elemental_7_overlayCommit"))
        {
            thisGame.overlayCommitOnClick();
            setTimeout(function(){
                const waterPopup = document.getElementById("Foundation_Elemental_7_waterSwap");
                if (waterPopup)
                {
                    thisGame.swapWaterForLand();
                    console.log("Water swap!");
                }
                setTimeout(function(){
                    thisGame.customizeMapDoAll(true);
                }, 100);
            }, 700);
        }
    }
    // End placing reserves. Check for battles, then make ready for next player.
    else
    {
        const battlePiece = findNextBattle(thisGame);
        if (battlePiece)
        {
            if (!window.isBattleSelected)
            {
                console.log("Handling reserve battle.");
                fightBattle(thisGame, battlePiece, true);
            }
        }
        else
        {
            clearInterval(window.reserveIntervalId);
            thisGame.removeExcessPieces(thisGame.perspectiveColor, true);
            if (window.currentPlayerTurn === thisGame.perspectiveColor)
            {
                thisGame.endMyTurn();
            }
            window.IS_KOMPUTER_READY = true;
            resetKomputerButtonStyle();
            console.log("Done.");
        }
    }
}


function getBestBuildable(thisGame)
{
    let buildablePoints = thisGame.getBuildables(thisGame.player.team.color, thisGame.player.team.rulerColor);
    sortByDistanceToEnemy(thisGame, buildablePoints);
    // Return any closest threatened town point.
    for (const point of buildablePoints)
    {
        const piece = thisGame.pieces.findAtPoint(point);
        if (piece.hasTown(thisGame.perspectiveColor))
        {
            const hasThreat = guessThreat(thisGame, piece) > 0;
            if (hasThreat)
            {
                return point;
            }
        }
    }
    // Note which terrain types are occupied.
    const civilizations = thisGame.pieces.getCivilizations(thisGame.perspectiveColor);
    let hasMountain = false;
    let hasGrass = false;
    let hasForest = false;
    let hasPlain = false;
    for (const civ of civilizations)
    {
        if (civ.isPlain())
        {
            hasPlain = true;
        }
        else if (civ.isGrassland())
        {
            hasGrass = true;
        }
        else if (civ.isForest())
        {
            hasForest = true;
        }
        else if (civ.isMountain())
        {
            hasMountain = true;
        }
        // When occupying one of each terrain type, return buidable point closest to enemy.
        if (hasPlain && hasGrass && hasForest && hasMountain)
        {
            return buildablePoints[0];
        }
    }
    // Else return a terrain type not yet occupied, closest to the enemy.
    let terrainPoint = null;
    if (!hasMountain)
    {
        terrainPoint = findTerrain(thisGame, buildablePoints, "m")
        if (terrainPoint)
        {
            return terrainPoint;
        }
    }
    if (!hasGrass)
    {
        terrainPoint = findTerrain(thisGame, buildablePoints, "g")
        if (terrainPoint)
        {
            return terrainPoint;
        }
    }
    if (!hasForest)
    {
        terrainPoint = findTerrain(thisGame, buildablePoints, "f")
        if (terrainPoint)
        {
            return terrainPoint;
        }
    }
    if (!hasPlain)
    {
        terrainPoint = findTerrain(thisGame, buildablePoints, "p")
        if (terrainPoint)
        {
            return terrainPoint;
        }
    }
    return buildablePoints[0];
}


function findTerrain(thisGame, buildablePoints, terrainValue)
{
    for (const point of buildablePoints)
    {
        const piece = thisGame.pieces.findAtPoint(point);
        if (piece.value === terrainValue)
        {
            return point;
        }
    }
    return null;
}


function getBestReservable(thisGame, movingUnitType, controlsCapital)
{
    // Get reservable points and remove placeholders.
    let reservables = thisGame.pieces.getReservables(thisGame.player.team.color,thisGame.player.team.rulerColor, movingUnitType, controlsCapital);
    for (let i = reservables.length -1; i >= 0; i--)
    {
        if (reservables[i].placeHolderOnly)
		{
			reservables.splice(i, 1);
		}
    }
    // Consider most vulnerable towns first.
    sortByDistanceToEnemy(thisGame, reservables);
    for (const reservable of reservables)
    {
        const piece = thisGame.pieces.findAtPoint(reservable);
        const hasThreat = guessThreat(thisGame, piece) > 0;
        if (hasThreat && !hasArmy(piece, thisGame.perspectiveColor))
        {
            return reservable;
        }
    }
    return ( reservables.length > 1 ? Math.random() < 0.8 ? reservables[0] : reservables[1] : reservables[0] );
}


/// Sorts closest to farthest.
function sortByDistanceToEnemy(thisGame, points)
{
    // Get enemy armies or towns.
    const enemyColor = !thisGame.perspectiveColor * 1;
    let enemyArmies = getArmyUnits(thisGame, enemyColor);
    if (!enemyArmies)
    {
        enemyArmies = [getRandomItem(thisGame.pieces.getOpponentCivilizations(thisGame.perspectiveColor)).findCivilization(enemyColor)];
        if (enemyArmies.length === 0)
        {
            return points;
        }
    }
    let minimumPointToEnemyDistances = []
    // Find the closest distance of each reservable point to all enemies.
    for (const point of points)
    {
        let minDistanceToArmy = Number.MAX_VALUE;
        for (const enemyArmy of enemyArmies)
        {
            const distanceToArmy = thisGame.distanceBewteenPoints(enemyArmy.piece.boardPoint, point);
            if (distanceToArmy < minDistanceToArmy)
            {
                minDistanceToArmy = distanceToArmy;
            }
        }
        minimumPointToEnemyDistances.push(minDistanceToArmy);
    }
    // Sort all reservables based on the closest distance of each to the enemy.
    points.sort(function(a, b){ return minimumPointToEnemyDistances[points.indexOf(a)] - minimumPointToEnemyDistances[points.indexOf(b)] });
}


// Highly specific instructions for the first two turns
function placeCapital(thisGame)
{
    // Explore 5 hexes, handle water.
    let hexOrder = thisGame.getMapCustomizationData();
    const hasWater = (hexOrder.indexOf("w") > -1) ? true : false;
    if (hasWater)
    {
        while (waterCount(hexOrder) > 2)
        {
            thisGame.swapWaterForLand();
            hexOrder = thisGame.getMapCustomizationData();
        }
        thisGame.playOptions.mapCustomizationData = [hexOrder[0], hexOrder[4], hexOrder[1], hexOrder[3], hexOrder[2]].join("");
    }
    thisGame.customizeMapDoAll(true);

    // Place capital & explore adjacent, using a bit of advice from Peter M's strategy guide.
    let pieceIndexChoices = (thisGame.player.team.color === 0) ? [7, 9, 24] : [36, 51, 53];
    let pieceIndex = (thisGame.player.team.color === 0) ? getRandomItem(pieceIndexChoices) : getSecondCapitalPieceIndex(thisGame, pieceIndexChoices);
    let destinationScreenPoint = thisGame.pieces[pieceIndex].$screenRect.getCenter();
    thisGame.placeCapitalMouseDown(destinationScreenPoint);
    thisGame.overlayCommitOnClick();
    const customizeMapDelay1 = 800;
    setTimeout(function(){
        const waterPopup = document.getElementById("Foundation_Elemental_7_waterSwap");
        if (waterPopup)
        {
            thisGame.swapWaterForLand();
            console.log("Water swap!");
        }
        thisGame.customizeMapDoAll(true);
        if (thisGame.player.team.color === 0)
        {
            thisGame.endMyTurn();
            window.IS_KOMPUTER_READY = true;
            resetKomputerButtonStyle();
            console.log("Done.");
        }
        // Place first town based on specific location data. Later reserve phases use other guidance.
        else
        {
            if (thisGame.movePhase === 11)
            {
                thisGame.reserveOnMouseDown(thisGame, function(){return true},0);
                pieceIndex = (pieceIndex < 51) ? pieceIndexChoices[0] : (pieceIndex > 51) ? pieceIndexChoices[1]: getRandomItem(pieceIndexChoices);
                destinationScreenPoint = thisGame.pieces[pieceIndex].$screenRect.getCenter();
                thisGame.placeReserveOnMouseUp(destinationScreenPoint)
                thisGame.overlayCommitOnClick();
                const customizeMapDelay2 = 1000;
                setTimeout(function(){
                    const waterPopup = document.getElementById("Foundation_Elemental_7_waterSwap");
                    if (waterPopup)
                    {
                        thisGame.swapWaterForLand();
                        console.log("Water swap!");
                    }
                    thisGame.customizeMapDoAll(true);
                    thisGame.reserveOnMouseDown(thisGame, function() {return true},0);
                    thisGame.placeReserveOnMouseUp( destinationScreenPoint );
                    thisGame.endMyTurn();
                    window.IS_KOMPUTER_READY = true;
                    resetKomputerButtonStyle();
                    console.log("Done.");
                }, customizeMapDelay2);
            }
        }}, customizeMapDelay1);
}


function waterCount(stringHexData)
{
      let count = 0;
      for (let i = 0; i < stringHexData.length; i++)
      {
          if (stringHexData.charAt(i)==="w")
          {
              count++;
          }
      }
      return count;
}


function getSecondCapitalPieceIndex(thisGame, pieceIndexChoices)
{
    // Usually take the opposite side of the opponent, or if center, play random.
    const randomMoveChance = 0.125;
    if (Math.random() < randomMoveChance || thisGame.pieces[9].hasUnit(0, "C"))
    {
        return pieceIndexChoices.splice(getRandomIndexExclusive(pieceIndexChoices.length), 1);
    }
    else
    {
        const opponentCapitalPiece = thisGame.pieces.findCapitalPiece(0);
        if (opponentCapitalPiece.index < 9)
        {
            return pieceIndexChoices.pop();
        }
        else
        {
            return pieceIndexChoices.shift();
        }
    }
}


function hasAdjacentCivilization(thisGame, piece)
{
      let adjacentPiece;
      return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor));
}


function findAdjacentCivilization(thisGame, piece)
{
      let adjacentPiece;
      return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ||
          ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && adjacentPiece.hasCivilization(thisGame.perspectiveColor)) ? adjacentPiece : null;
}


function hasAdjacentEnemyCivilization(thisGame, piece)
{
    let adjacentPiece;
    return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && adjacentPiece.hasOpponentCivilization(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && adjacentPiece.hasOpponentCivilization(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && adjacentPiece.hasOpponentCivilization(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && adjacentPiece.hasOpponentCivilization(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && adjacentPiece.hasOpponentCivilization(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && adjacentPiece.hasOpponentCivilization(thisGame.perspectiveColor));
}


function hasAdjacentEnemyTown(thisGame, piece)
{
    let adjacentPiece;
    return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && adjacentPiece.hasOpponentTown(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && adjacentPiece.hasOpponentTown(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && adjacentPiece.hasOpponentTown(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && adjacentPiece.hasOpponentTown(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && adjacentPiece.hasOpponentTown(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && adjacentPiece.hasOpponentTown(thisGame.perspectiveColor));
}


function hasAdjacentHiddenTerrain(thisGame, piece)
{
    let adjacentPiece;
    return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && adjacentPiece.hidden) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && adjacentPiece.hidden) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && adjacentPiece.hidden) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && adjacentPiece.hidden) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && adjacentPiece.hidden) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && adjacentPiece.hidden);
}



function hasAdjacentDeepWater(thisGame, piece)
{
    let adjacentPiece;
    return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && adjacentPiece.isPerimeter()) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && adjacentPiece.isPerimeter()) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && adjacentPiece.isPerimeter()) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && adjacentPiece.isPerimeter()) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && adjacentPiece.isPerimeter()) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && adjacentPiece.isPerimeter());
}


function hasAdjacentAccessibleInlandSea(thisGame, piece, unit)
{
    let adjacentPiece;
    return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && adjacentPiece.boardValue === "w" && isAccessibleNow(adjacentPiece, unit)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && adjacentPiece.boardValue === "w" && isAccessibleNow(adjacentPiece, unit)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && adjacentPiece.boardValue === "w" && isAccessibleNow(adjacentPiece, unit)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && adjacentPiece.boardValue === "w" && isAccessibleNow(adjacentPiece, unit)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && adjacentPiece.boardValue === "w" && isAccessibleNow(adjacentPiece, unit)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && adjacentPiece.boardValue === "w" && isAccessibleNow(adjacentPiece, unit));
}


function isAccessibleNow(piece, unit)
{
    if (piece && unit)
    {
        const unitMovablePoints = unit.getMovables();
        if (unitMovablePoints.length)
        {
            for (const point of unitMovablePoints)
            {
                if (point.x === piece.boardPoint.x && point.y === piece.boardPoint.y)
                {
                    return true;
                }
            }
        }
    }
    return false;
}


function hasAdjacentFrigate(thisGame, piece)
{
    let adjacentPiece;
    return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && adjacentPiece.hasFrigate(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && adjacentPiece.hasFrigate(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && adjacentPiece.hasFrigate(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && adjacentPiece.hasFrigate(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && adjacentPiece.hasFrigate(thisGame.perspectiveColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && adjacentPiece.hasFrigate(thisGame.perspectiveColor));
}


function hasAdjacentBattle(thisGame, piece)
{
    let adjacentPiece;
    return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && adjacentPiece.hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && adjacentPiece.hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && adjacentPiece.hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && adjacentPiece.hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && adjacentPiece.hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && adjacentPiece.hasBattle(thisGame.perspectiveColor, thisGame.player.team.rulerColor));
}


function hasAdjacentEnemyArmy(thisGame, piece)
{
    const enemyColor = !thisGame.perspectiveColor * 1;
    let adjacentPiece;
    return ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y)) != null && hasArmy(adjacentPiece, enemyColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y)) != null && hasArmy(adjacentPiece, enemyColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y-1)) != null && hasArmy(adjacentPiece, enemyColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x, piece.boardPoint.y+1)) != null && hasArmy(adjacentPiece, enemyColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x-1, piece.boardPoint.y-1)) != null && hasArmy(adjacentPiece, enemyColor)) ||
        ((adjacentPiece = thisGame.pieces.findAtXY(piece.boardPoint.x+1, piece.boardPoint.y+1)) != null && hasArmy(adjacentPiece, enemyColor));
}


function hasArmy(piece, color)
{
    return (piece.hasInfantry(color) || piece.hasArtillery(color) || piece.hasCavalry(color));
}


function getArmyUnits(thisGame, color)
{
    let armies = [];
    for (const piece of thisGame.pieces)
    {
        // Skip water and reserve pieces
        if (piece.isWater() || piece.valueIndex === - 1)
        {
            continue;
        }
        for (const unit of piece.units)
        {
            if (unit.color === color && unit.isMilitary())
            {
                armies.push(unit);
            }
        }
    }
    return (armies.length > 0 ? armies : null );
}


function getRandomItem(items)
{
    const MAX = items.length;
    const RANDOM_INDEX = getRandomIndexExclusive(MAX);
    return items[RANDOM_INDEX];
}


function getRandomIndexExclusive(max)
{
    return Math.floor(Math.random() * max);
}


function shuffle(string)
{
    // Schwartzian Transform, from anonymous on Stackoverflow - see Wikipedia for description.
    return string.split("").map(v => [v, Math.random()]).sort((a, b) => a[1] - b[1]).map(v => v[0]).join("");
}


function addRunButton(text, onclick, pointerToGame) {
    let style = {position: 'absolute', top: '776px', left:'24px', 'z-index': '9999', "-webkit-transition-duration": "0.6s", "transition-duration": "0.6s", overflow: 'hidden', width: '128px', 'font-size': '10px'}
    let button = document.createElement('button'), btnStyle = button.style
    document.body.appendChild(button) // For now, this works well enough.
    button.setAttribute("class", "button_runKomputer");
    button.innerHTML = text;
    button.id = "KomputerButton";
    button.onclick = function() {onclick(pointerToGame)};
    Object.keys(style).forEach(key => btnStyle[key] = style[key])

    // Add Button Press Transition 1
    const cssButtonClassString1 = `.button_runKomputer:after{content: ""; background: #90EE90; display: block; position: absolute; padding-top: 300%; padding-left: 350%; margin-left: -20px!important; margin-top: -120%; opacity: 0; transition: all 1.0s}`;
    const styleTag1 = document.createElement("style");
    styleTag1.innerHTML = cssButtonClassString1;
    document.head.insertAdjacentElement('beforeend', styleTag1);

    // Add Button Press Transition 2
    const cssButtonClassString2 = `.button_runKomputer:active:after{padding: 0; margin: 0; opacity: 1; transition: 0s}`;
    const styleTag2 = document.createElement("style");
    styleTag2.innerHTML = cssButtonClassString2;
    document.head.insertAdjacentElement('beforeend', styleTag2);
}


function addStopButton(text, onclick)
{
    let style = {position: 'absolute', top: '796px', left:'56px', 'z-index': '9999', "-webkit-transition-duration": "0.2s", "transition-duration": "0.2s", overflow: 'hidden', width: '64px', 'font-size': '10px'}
    let button = document.createElement('button'), btnStyle = button.style
    document.body.appendChild(button) // For now, this works well enough.
    button.setAttribute("class", "button_stopKomputer");
    button.id = "StopKomputerButton";
    button.innerHTML = text;
    button.onclick = function() {onclick()};
    Object.keys(style).forEach(key => btnStyle[key] = style[key])

    // Add Button Press Transition 1
    const cssButtonClassString1 = `.button_stopKomputer:after{content: ""; background: #FF6347; display: block; position: absolute; padding-top: 300%; padding-left: 350%; margin-left: -20px!important; margin-top: -120%; opacity: 0; transition: all 0.4s}`;
    const styleTag1 = document.createElement("style");
    styleTag1.innerHTML = cssButtonClassString1;
    document.head.insertAdjacentElement('beforeend', styleTag1);

    // Add Button Press Transition 2
    const cssButtonClassString2 = `.button_stopKomputer:active:after{padding: 0; margin: 0; opacity: 1; transition: 0s}`;
    const styleTag2 = document.createElement("style");
    styleTag2.innerHTML = cssButtonClassString2;
    document.head.insertAdjacentElement('beforeend', styleTag2);
}


function stopKomputerClick()
{
    window.stop = true;
    styleButtonForStop();
    setTimeout(function(){
        if (window.stop === true)
        {
            window.stop = false;
            resetStopKomputerButtonStyle();
            throw new Error("Force Stop. Possibly no error. Error thrown in case of undetected infinite loop.")
        }
    }, 3000);
}


function stopAndReset()
{
    clearIntervalsAndTimers();
    resetAllButtonStyles();
    resetGlobals(true);
    console.log("Manually Stopped.");
}


function resetAllButtonStyles()
{
    resetKomputerButtonStyle();
    resetStopKomputerButtonStyle();
}


function styleButtonForStop()
{
    let button = document.getElementById("StopKomputerButton");
    button.style.backgroundColor = 'lightpink';
    button.style.color = 'crimson';
    button.innerHTML = "Stopping";
}


function styleButtonForRun()
{
    let button = document.getElementById("KomputerButton");
    button.style.backgroundColor = 'mediumseagreen';
    button.style.color = 'crimson';
    button.innerHTML = "Running";
}


function resetKomputerButtonStyle(isGameWon = false)
{
    let button = document.getElementById("KomputerButton");
    button.style.backgroundColor = '';
    button.style.color = '';
    button.innerHTML = isGameWon ? "Viktory" : "Let Komputer Play";
}


function resetStopKomputerButtonStyle()
{
    let button = document.getElementById("StopKomputerButton");
    button.style.backgroundColor = '';
    button.style.color = '';
    button.innerHTML = "Cancel";
}


// Clone for an original codebase function with a few mods to support automated play.
function moveUnitSimulateMouseDown(thisGame, screenPoint, unit = null)
{
    thisGame.maybeResetReservesByMouseUp();
    thisGame.moveBombardUnitsMouseOut(screenPoint=thisGame.constrainPoint(screenPoint));
    thisGame.maybeHideOverlay();
    if (unit)
    {
        thisGame.setTargetPoints(unit.getMovables());
        thisGame.onLeftMouseUp="moveUnitsMouseUp";
        thisGame.onMouseMove=null;
        thisGame.onMouseOver=null;
        thisGame.onMouseOut=null;
        let piece=thisGame.pieces.getNewPiece();
        piece.setMovingUnit(unit);
    }
    else
    {
        let boardPoint;
        let piece;
        if ((boardPoint=thisGame.boardPointFromScreenPoint(screenPoint)) &&
            (piece=thisGame.pieces.findAtPoint(boardPoint)) &&
            piece.hasBattle(thisGame.player.team.color,thisGame.player.team.rulerColor))
        {
            piece.setBorder(true);
            thisGame.battleIndex=piece.index;
            thisGame.pushMove("Battle",thisGame.logEntry(6,piece.index,piece.boardValue,piece.getOpponentColor(thisGame.player.team.color)),piece,piece.hasPreBattle(thisGame.player.team.color) ? "processPreBattleMove" : "processStartBattleMove",true,"beginBattle","cancel");
            thisGame.update();
        }
        else
        {
            thisGame.showOverlay();
        }
    }
}


// Clone for an original codebase function with a few mods to support automated play.
function moveUnitSimulateMouseUp(thisGame, screenPoint)
{
    thisGame.onMouseMove=null;
    thisGame.onLeftMouseUp=null;
    if (thisGame.lastLoadableUnit)
    {
        thisGame.lastLoadableUnit.setHilite(false);
        thisGame.lastLoadableUnit=null;
    }
    let movingPiece=thisGame.pieces.getNewPiece();
    let boardPoint=thisGame.boardPointFromScreenPoint(screenPoint);
    if (thisGame.isTargetPoint(boardPoint))
    {
        let targetPiece=thisGame.pieces.findAtPoint(boardPoint);
        // Load frigate
        if (movingPiece.movingUnit.isLandUnit() &&
            targetPiece.isWater())
        {
        let oldPiece=movingPiece.movingUnit.piece;
        let loadableUnit=thisGame.militaryUnitFromScreenPoint(screenPoint,null,movingPiece.movingUnit.color,movingPiece.movingUnit.rulerColor,false,false,true);
        let log=thisGame.logEntry(7,oldPiece.index,oldPiece.boardValue,targetPiece.index,targetPiece.boardValue,movingPiece.movingUnit.type,loadableUnit.type);
        loadableUnit.loadCargo(movingPiece.movingUnit);
        movingPiece.setMovingUnit(null);
        oldPiece.updateUnitDisplay();
        loadableUnit.piece.updateUnitDisplay();
        thisGame.setTargetPoints(null);
        let nltd=thisGame.nothingLeftToDo();
        thisGame.pushMove("Load",log,targetPiece,"processMoveUnitMove",nltd,nltd ? "commitEndOfTurn" : null);
        }
        // Unload frigate
        else if (movingPiece.movingUnit.isFrigate() &&
            targetPiece.isLand())
        {
            let oldPiece=movingPiece.movingUnit.piece;
            let log=thisGame.logEntry(8,oldPiece.index,oldPiece.boardValue,targetPiece.index,targetPiece.boardValue,movingPiece.movingUnit.getActiveCargoType(),movingPiece.movingUnit.type);
            // Select first cargo
            movingPiece.movingUnit.activeCargoIndex = 0;
            movingPiece.movingUnit.unloadCargo(targetPiece);
            movingPiece.movingUnit.piece.updateUnitDisplay();
            movingPiece.setMovingUnit(null);
            targetPiece.updateUnitDisplay();
            thisGame.setTargetPoints(null);
            let nltd=thisGame.nothingLeftToDo();
            thisGame.pushMove("Unload",log,targetPiece,"processMoveUnitMove",nltd,nltd ? "commitEndOfTurn" : null);
        }
        else
        {
            let oldPiece=movingPiece.movingUnit.piece;
            let tp=thisGame.getTargetPoint(boardPoint);
            let log=thisGame.logEntry(9,oldPiece.index,oldPiece.boardValue,targetPiece.index,targetPiece.boardValue,movingPiece.movingUnit.type,tp.spacesNeeded);
            movingPiece.movingUnit.moveTo(targetPiece,tp.spacesNeeded,tp.retreatIndex);
            movingPiece.setMovingUnit(null);
            oldPiece.updateUnitDisplay();
            targetPiece.updateUnitDisplay();
            thisGame.setTargetPoints(null);
            let nltd=thisGame.nothingLeftToDo();
            thisGame.pushMove("Move",log,targetPiece,"processMoveUnitMove",nltd,nltd ? "commitEndOfTurn" : null);
        }
    }
    else
    {
        thisGame.setTargetPoints(null);
        thisGame.onLeftMouseUp=null;
        thisGame.onMouseMove="moveBombardUnitsMouseMove";
        thisGame.onMouseOver="moveBombardUnitsMouseMove";
        thisGame.onMouseOut="moveBombardUnitsMouseOut";
        if (movingPiece.movingUnit)
        {
            movingPiece.movingUnit.setVisibility(true);
            let piece=movingPiece.movingUnit.piece;
            movingPiece.setMovingUnit(null);
            if (piece.boardPoint.equals(boardPoint) &&
                piece.hasBattle(thisGame.player.team.color,thisGame.player.team.rulerColor))
            {
                piece.setBorder(true);
                thisGame.battleIndex=piece.index;
                thisGame.pushMove("Battle",thisGame.logEntry(6,piece.index,piece.boardValue,piece.getOpponentColor(thisGame.player.team.color)),piece,piece.hasPreBattle(thisGame.player.team.color) ? "processPreBattleMove" : "processStartBattleMove",true,"beginBattle","cancel");
            }
        }
    }
    thisGame.update();
}


// Clone for an original codebase function with a few mods to support automated play.
function bombardUnitsSimulateMouseDown(thisGame, bombardingUnit = null)
{
    thisGame.maybeResetReservesByMouseUp();
    thisGame.maybeHideOverlay();
    thisGame.bombardingUnit = bombardingUnit;
    if (bombardingUnit)
    {
        let screenPoint = bombardingUnit.screenPoint;
        thisGame.moveBombardUnitsMouseOut(screenPoint = thisGame.constrainPoint(screenPoint));
        thisGame.setTargetPoints(bombardingUnit.getBombardables());
        thisGame.onMouseMove="bombardUnitsMouseMove";
        thisGame.onRightMouseUp="bombardUnitsMouseUp";
        thisGame.onMouseOver=null;
        thisGame.onMouseOut=null;
        let movingPiece = thisGame.pieces.getNewPiece();
        movingPiece.setMovingUnit(new GamesByEmail.Viktory2Unit(null,-1,thisGame.player.team.color,"b"));
        bombardingUnit.setHilite(true);
        movingPiece.center(screenPoint.subtract(2,5));
    }
    else
    {
        thisGame.showOverlay();
    }
}


// Clone for an original codebase function with a few mods to support automated play.
function bombardUnitsSimulateMouseUp(thisGame, screenPoint)
{
    thisGame.onMouseMove = null;
    thisGame.onLeftMouseUp = null;
    let movingPiece = thisGame.pieces.getNewPiece();
    let boardPoint = thisGame.boardPointFromScreenPoint(screenPoint);
    if (thisGame.isTargetPoint(boardPoint))
    {
        movingPiece.snap(boardPoint);
        let targetPiece = thisGame.pieces.findAtPoint(boardPoint);
        thisGame.pushMove("Bombard",thisGame.logEntry(11,thisGame.bombardingUnit.piece.index,thisGame.bombardingUnit.piece.boardValue,targetPiece.index,targetPiece.boardValue,thisGame.bombardingUnit.type,targetPiece.findOpponentMilitary(thisGame.player.team.color).color,targetPiece.countOpponentMilitary(thisGame.player.team.color)),targetPiece,"processBombardUnitMove",true,"beginBombard","cancel");
        thisGame.update();
        return true;
    }
    return false;
}


/**
     * Greasemonkey Wrench by CoeJoder, for public use.
     * Source: https://github.com/CoeJoder/GM_wrench/blob/master/src/GM_wrench.js
	 * Detect and handle AJAXed content.  Can force each element to be processed one or more times.
	 *
	 * @example
	 * GM_wrench.waitForKeyElements('div.comments', (element) => {
	 *   element.innerHTML = 'This text inserted by waitForKeyElements().';
	 * });
	 *
	 * GM_wrench.waitForKeyElements(() => {
	 *   const iframe = document.querySelector('iframe');
	 *   if (iframe) {
	 *     const iframeDoc = iframe.contentDocument || iframe.contentwindow.document;
	 *     return iframeDoc.querySelectorAll('div.comments');
	 *   }
	 *   return null;
	 * }, callbackFunc);
	 *
	 * @param {(string|function)} selectorOrFunction The selector string or function.
	 * @param {function}          callback           The callback function; takes a single DOM element as parameter.  If
	 *                                               returns true, element will be processed again on subsequent iterations.
	 * @param {boolean}           [waitOnce=true]    Whether to stop after the first elements are found.
	 * @param {number}            [interval=300]     The time (ms) to wait between iterations.
	 * @param {number}            [maxIntervals=-1]  The max number of intervals to run (negative number for unlimited).
*/
function waitForKeyElements (selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
    if (typeof waitOnce === "undefined") {
        waitOnce = true;
    }
    if (typeof interval === "undefined") {
        interval = 300;
    }
    if (typeof maxIntervals === "undefined") {
        maxIntervals = -1;
    }
    var targetNodes =
        typeof selectorOrFunction === "function"
    ? selectorOrFunction()
    : document.querySelectorAll(selectorOrFunction);

    var targetsFound = targetNodes && targetNodes.length > 0;
    if (targetsFound) {
        targetNodes.forEach(function (targetNode) {
            var attrAlreadyFound = "data-userscript-alreadyFound";
            var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
            if (!alreadyFound) {
                var cancelFound = callback(targetNode);
                if (cancelFound) {
                    targetsFound = false;
                } else {
                    targetNode.setAttribute(attrAlreadyFound, true);
                }
            }
        });
    }

    if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
        maxIntervals -= 1;
        setTimeout(function () {
            waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
        }, interval);
    }
}
