// ==UserScript==
// @name        Chessploit
// @description Tingkatkan performa catur Anda dengan analisis pergerakan real-time dan sistem bantuan strategi yang mutakhir
// @homepageURL https://chessploit.techbin.fun
// @supportURL  https://github.com/dimasbayusujiwo/Chessploit/tree/main#kenapa-tidak-berhasil
// @match       https://psyyke.github.io/A.C.A.S/*
// @match       http://localhost/*
// @match       https://www.chess.com/*
// @match       https://lichess.org/*
// @match       https://playstrategy.org/*
// @match       https://www.pychess.org/*
// @match       https://chess.org/*
// @match       https://papergames.io/*
// @match       https://vole.wtf/kilobytes-gambit/
// @match       https://chess.coolmath-games.com/*
// @match       https://www.coolmathgames.com/0-chess/*
// @match       https://immortal.game/*
// @match       https://chessarena.com/*
// @match       http://chess.net/*
// @match       https://www.freechess.club/*
// @match       https://*chessclub.com/*
// @match       https://gameknot.com/*
// @match       https://chesstempo.com/*
// @match       https://www.redhotpawn.com/*
// @match       https://www.chessanytime.com/*
// @match       https://chessworld.net/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_registerMenuCommand
// @grant       GM_openInTab
// @grant       GM_addStyle
// @grant       GM_setClipboard
// @grant       GM_notification
// @grant       unsafeWindow
// @run-at      document-start
// @require     https://greasyfork.org/scripts/470418-commlink-js/code/CommLinkjs.js
// @require     https://greasyfork.org/scripts/470417-universalboarddrawer-js/code/UniversalBoardDrawerjs.js
// @icon        https://raw.githubusercontent.com/dimasbayusujiwo/Chessploit/main/assets/images/grey-logo.png
// @version     1.0.0
// @namespace   Dimas
// @author      Dimas
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/479582/Chessploit.user.js
// @updateURL https://update.greasyfork.org/scripts/479582/Chessploit.meta.js
// ==/UserScript==

/*

 ▄████▄   ██░ ██ ▓█████   ██████   ██████  ██▓███   ██▓     ▒█████   ██▓▄▄▄█████▓
▒██▀ ▀█  ▓██░ ██▒▓█   ▀ ▒██    ▒ ▒██    ▒ ▓██░  ██▒▓██▒    ▒██▒  ██▒▓██▒▓  ██▒ ▓▒
▒▓█    ▄ ▒██▀▀██░▒███   ░ ▓██▄   ░ ▓██▄   ▓██░ ██▓▒▒██░    ▒██░  ██▒▒██▒▒ ▓██░ ▒░
▒▓▓▄ ▄██▒░▓█ ░██ ▒▓█  ▄   ▒   ██▒  ▒   ██▒▒██▄█▓▒ ▒▒██░    ▒██   ██░░██░░ ▓██▓ ░ 
▒ ▓███▀ ░░▓█▒░██▓░▒████▒▒██████▒▒▒██████▒▒▒██▒ ░  ░░██████▒░ ████▓▒░░██░  ▒██▒ ░ 
░ ░▒ ▒  ░ ▒ ░░▒░▒░░ ▒░ ░▒ ▒▓▒ ▒ ░▒ ▒▓▒ ▒ ░▒▓▒░ ░  ░░ ▒░▓  ░░ ▒░▒░▒░ ░▓    ▒ ░░   
  ░  ▒    ▒ ░▒░ ░ ░ ░  ░░ ░▒  ░ ░░ ░▒  ░ ░░▒ ░     ░ ░ ▒  ░  ░ ▒ ▒░  ▒ ░    ░    
░         ░  ░░ ░   ░   ░  ░  ░  ░  ░  ░  ░░         ░ ░   ░ ░ ░ ▒   ▒ ░  ░      
░ ░       ░  ░  ░   ░  ░      ░        ░               ░  ░    ░ ░   ░           
░                                                                                

Chessploit
/*
  ______         _____  ______  _______
 |  ____ |      |     | |_____] |_____| |
 |_____| |_____ |_____| |_____] |     | |_____

*/

const debugModeActivated = false;
const onlyUseDevelopmentBackend = false;

const domain = window.location.hostname.replace('www.', '');
const greasyforkURL = 'https://greasyfork.org/en/scripts/479582';

const backendConfig = {
    'hosts': { 'prod': 'chessploit.techbin.fun', 'dev': 'localhost' },
    'path': '/'
};

const currentBackendUrlKey = 'currentBackendURL';

const isBackendUrlUpToDate = Object.values(backendConfig.hosts).some(x => GM_getValue(currentBackendUrlKey)?.includes(x));

function constructBackendURL(host) {
    const protocol = window.location.protocol + '//';
    const hosts = backendConfig.hosts;

    return protocol + (host || (hosts?.prod || hosts?.path)) + backendConfig.path;
}

function isRunningOnBackend() {
    const hostsArr = Object.values(backendConfig.hosts);

    const foundHost = hostsArr.find(host => host === window?.location?.host);
    const isCorrectPath = window?.location?.pathname?.includes(backendConfig.path);

    const isBackend = typeof foundHost === 'string' && isCorrectPath;

    if(isBackend) {
        GM_setValue(currentBackendUrlKey, constructBackendURL(foundHost));

        return true;
    }

    return false;
}

function prependProtocolWhenNeeded(url) {
    if(!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'http://' + url;
    }

    return url;
}

function getCurrentBackendURL(skipGmStorage) {
    if(onlyUseDevelopmentBackend) {
        return constructBackendURL(backendConfig.hosts?.dev);
    }

    const gmStorageUrl = GM_getValue(currentBackendUrlKey);

    if(skipGmStorage || !gmStorageUrl) {
        return constructBackendURL();
    }

    return prependProtocolWhenNeeded(gmStorageUrl);
}

if(!isBackendUrlUpToDate) {
    GM_setValue(currentBackendUrlKey, getCurrentBackendURL(true));
}

function createInstanceVariable(dbValue) {
    return {
        set: (instanceID, value) => GM_setValue(dbValues[dbValue](instanceID), { value, 'date': Date.now() }),
        get: instanceID => {
            const data = GM_getValue(dbValues[dbValue](instanceID));

            if(data?.date) {
                data.date = Date.now();

                GM_setValue(dbValues[dbValue](instanceID), data);
            }

            return data?.value;
        }
    }
}

const tempValueIndicator = '-temp-value-';
const dbValues = {
    AcasConfig: 'AcasConfig',
    playerColor: instanceID => 'playerColor' + tempValueIndicator + instanceID,
    turn: instanceID => 'turn' + tempValueIndicator + instanceID,
    fen: instanceID => 'fen' + tempValueIndicator + instanceID
};

const instanceVars = {
    playerColor: createInstanceVariable('playerColor'),
    turn: createInstanceVariable('turn'),
    fen: createInstanceVariable('fen')
};

if(isRunningOnBackend()) {
    // expose variables and functions
    unsafeWindow.USERSCRIPT = {
        'GM_info': GM_info,
        'GM_getValue': val => GM_getValue(val),
        'GM_setValue': (val, data) => GM_setValue(val, data),
        'GM_deleteValue': val => GM_deleteValue(val),
        'GM_listValues': val => GM_listValues(val),
        'tempValueIndicator': tempValueIndicator,
        'dbValues': dbValues,
        'instanceVars': instanceVars,
        'CommLinkHandler': CommLinkHandler,
    };

    return;
}






/*
 _______ _     _ _______ _______ _______      _______ _____ _______ _______ _______
 |       |_____| |______ |______ |______      |______   |      |    |______ |______
 |_____  |     | |______ ______| ______|      ______| __|__    |    |______ ______|


Code below this point only runs on chess sites, not on the GUI itself.
*/

function getUniqueID() {
    return ([1e7]+-1e3+4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

const commLinkInstanceID = getUniqueID();

const blacklistedURLs = [
    constructBackendURL(backendConfig?.hosts?.prod),
    constructBackendURL(backendConfig?.hosts?.dev),
    'https://www.chess.com/play',
    'https://lichess.org/',
    'https://chess.org/',
    'https://papergames.io/en/chess',
    'https://playstrategy.org/',
    'https://www.pychess.org/',
    'https://www.coolmathgames.com/0-chess',
    'https://chess.net/'
];

const configKeys = {
    'engineElo': 'engineElo',
    'moveSuggestionAmount': 'moveSuggestionAmount',
    'arrowOpacity': 'arrowOpacity',
    'displayMovesOnExternalSite': 'displayMovesOnExternalSite',
    'showMoveGhost': 'showMoveGhost',
    'showOpponentMoveGuess': 'showOpponentMoveGuess',
    'onlyShowTopMoves': 'onlyShowTopMoves',
    'maxMovetime': 'maxMovetime',
    'chessVariant': 'chessVariant',
    'chessFont': 'chessFont',
    'useChess960': 'useChess960',
    'onlyCalculateOwnTurn': 'onlyCalculateOwnTurn'
};

const config = {};

Object.values(configKeys).forEach(key => {
    config[key] = {
        get:  () => getGmConfigValue(key, commLinkInstanceID),
        set: null
    };
});

let BoardDrawer = null;
let chessBoardElem = null;
let chesscomVariantBoardCoordsTable = null;
let chesscomVariantPlayerColorsTable = null;
let activeSiteMoveHighlights = [];
let inactiveGuiMoveMarkings = [];

let lastBoardRanks = null;
let lastBoardFiles = null;

let lastBoardSize = null;
let lastPieceSize = null;

let lastBoardOrientation = null;

let isUserMouseDown = false;

const supportedSites = {};

const pieceNameToFen = {
    'pawn': 'p',
    'knight': 'n',
    'bishop': 'b',
    'rook': 'r',
    'queen': 'q',
    'king': 'k'
};

const arrowStyles = {
    'best': `
        fill: limegreen;
        opacity: ${getConfigValue(configKeys.arrowOpacity)/100 || '0.9'};
        stroke: rgb(0 0 0 / 50%);
        stroke-width: 2px;
        stroke-linejoin: round;
    `,
    'secondary': `
        fill: dodgerblue;
        opacity: ${getConfigValue(configKeys.arrowOpacity)/100 || '0.7'};
        stroke: rgb(0 0 0 / 50%);
        stroke-width: 2px;
        stroke-linejoin: round;
    `,
    'opponent': `
        fill: crimson;
        stroke: rgb(0 0 0 / 25%);
        stroke-width: 2px;
        stroke-linejoin: round;
        display: none;
        opacity: ${getConfigValue(configKeys.arrowOpacity)/100 || '0.3'};
    `
};

const CommLink = new CommLinkHandler(`frontend_${commLinkInstanceID}`, {
    'singlePacketResponseWaitTime': 1500,
    'maxSendAttempts': 3,
    'statusCheckInterval': 1,
    'silentMode': true
});

// manually register a command so that the variables are dynamic
CommLink.commands['createInstance'] = async () => {
    return await CommLink.send('mum', 'createInstance', {
        'domain': domain,
        'instanceID': commLinkInstanceID,
        'chessVariant': getChessVariant(),
        'playerColor': getPlayerColorVariable()
    });
}

CommLink.registerSendCommand('ping', { commlinkID: 'mum', data: 'ping' });
CommLink.registerSendCommand('pingInstance', { data: 'ping' });
CommLink.registerSendCommand('log');
CommLink.registerSendCommand('updateBoardOrientation');
CommLink.registerSendCommand('updateBoardFen');
CommLink.registerSendCommand('calculateBestMoves');

CommLink.registerListener(`backend_${commLinkInstanceID}`, packet => {
    try {
        switch(packet.command) {
            case 'ping':
                return `pong (took ${Date.now() - packet.date}ms)`;
            case 'getFen':
                return getFen();
            case 'removeSiteMoveMarkings':
                boardUtils.removeBestMarkings();
                return true;
            case 'markMoveToSite':
                boardUtils.markMove(packet.data);
                return true;
        }
    } catch(e) {
        return null;
    }
});

const boardUtils = {
    markMove: moveObj => {
        if(!getConfigValue(configKeys.displayMovesOnExternalSite)) return;

        const [from, to] = moveObj.player;
        const [opponentFrom, opponentTo] = moveObj.opponent;
        const ranking = moveObj.ranking;

        const existingExactSameMoveObj = activeSiteMoveHighlights.find(obj => {
            const [activeFrom, activeTo] = obj.player;
            const [activeOpponentFrom, activeOpponentTo] = obj.opponent;

            return from == activeFrom
                && to == activeTo
                && opponentFrom == activeOpponentFrom
                && opponentTo == activeOpponentTo;
        });

        activeSiteMoveHighlights.map(obj => {
            const [activeFrom, activeTo] = obj.player;

            const existingSameMoveObj = from == activeFrom && to == activeTo;

            if(existingSameMoveObj) {
                obj.promotedRanking = 1;
            }

            return obj;
        });

        const exactSameMoveDoesNotExist = typeof existingExactSameMoveObj !== 'object';

        if(exactSameMoveDoesNotExist) {

            const showOpponentMoveGuess = getConfigValue(configKeys.showOpponentMoveGuess);

            const opponentMoveGuessExists = typeof opponentFrom == 'string';

            const arrowStyle = ranking == 1 ? arrowStyles.best : arrowStyles.secondary;

            let opponentArrowElem = null;

            // create player move arrow element
            const arrowElem = BoardDrawer.createShape('arrow', [from, to],
                { style: arrowStyle }
            );

            // create opponent move arrow element
            if(opponentMoveGuessExists && showOpponentMoveGuess) {
                opponentArrowElem = BoardDrawer.createShape('arrow', [opponentFrom, opponentTo],
                    { style: arrowStyles.opponent }
                );

                const squareListener = BoardDrawer.addSquareListener(from, type => {
                    if(!opponentArrowElem) {
                        squareListener.remove();
                    }

                    switch(type) {
                        case 'enter':
                            opponentArrowElem.style.display = 'inherit';
                            break;
                        case 'leave':
                            opponentArrowElem.style.display = 'none';
                            break;
                    }
                });
            }

            activeSiteMoveHighlights.push({
                ...moveObj,
                'opponentArrowElem': opponentArrowElem,
                'playerArrowElem': arrowElem
            });
        }

        boardUtils.removeOldMarkings();
        boardUtils.paintMarkings();
    },
    removeOldMarkings: () => {
        const markingLimit = getConfigValue(configKeys.moveSuggestionAmount);
        const showGhost = getConfigValue(configKeys.showMoveGhost);

        const exceededMarkingLimit = activeSiteMoveHighlights.length > markingLimit;

        if(exceededMarkingLimit) {
            const amountToRemove = activeSiteMoveHighlights.length - markingLimit;

            for(let i = 0; i < amountToRemove; i++) {
                const oldestMarkingObj = activeSiteMoveHighlights[0];

                activeSiteMoveHighlights = activeSiteMoveHighlights.slice(1);

                if(oldestMarkingObj?.playerArrowElem?.style) {
                    oldestMarkingObj.playerArrowElem.style.fill = 'grey';
                    oldestMarkingObj.playerArrowElem.style.opacity = '0';
                    oldestMarkingObj.playerArrowElem.style.transition = 'opacity 2.5s ease-in-out';
                }

                if(oldestMarkingObj?.opponentArrowElem?.style) {
                    oldestMarkingObj.opponentArrowElem.style.fill = 'grey';
                    oldestMarkingObj.opponentArrowElem.style.opacity = '0';
                    oldestMarkingObj.opponentArrowElem.style.transition = 'opacity 2.5s ease-in-out';
                }

                if(showGhost) {
                    inactiveGuiMoveMarkings.push(oldestMarkingObj);
                } else {
                    oldestMarkingObj.playerArrowElem?.remove();
                    oldestMarkingObj.opponentArrowElem?.remove();
                }
            }
        }

        if(showGhost) {
            inactiveGuiMoveMarkings.forEach(markingObj => {
                const activeDuplicateArrow = activeSiteMoveHighlights.find(x => {
                    const samePlayerArrow = x.player?.toString() == markingObj.player?.toString();
                    const sameOpponentArrow = x.opponent?.toString() == markingObj.opponent?.toString();

                    return samePlayerArrow && sameOpponentArrow;
                });

                const duplicateExists = activeDuplicateArrow ? true : false;

                const removeArrows = () => {
                    inactiveGuiMoveMarkings = inactiveGuiMoveMarkings.filter(x => x.playerArrowElem != markingObj.playerArrowElem);

                    markingObj.playerArrowElem?.remove();
                    markingObj.opponentArrowElem?.remove();
                }

                if(duplicateExists) {
                    removeArrows();
                } else {
                    setTimeout(removeArrows, 2500);
                }
            });
        }
    },
    paintMarkings: () => {
        const newestBestMarkingIndex = activeSiteMoveHighlights.findLastIndex(obj => obj.ranking == 1);
        const newestPromotedBestMarkingIndex = activeSiteMoveHighlights.findLastIndex(obj => obj?.promotedRanking == 1);
        const lastMarkingIndex = activeSiteMoveHighlights.length - 1;

        const isLastMarkingBest = newestBestMarkingIndex == -1 && newestPromotedBestMarkingIndex == -1;
        const bestIndex = isLastMarkingBest ? lastMarkingIndex : Math.max(...[newestBestMarkingIndex, newestPromotedBestMarkingIndex]);

        let bestMoveMarked = false;

        activeSiteMoveHighlights.forEach((markingObj, idx) => {
            const isBestMarking = idx == bestIndex;

            if(isBestMarking) {
                markingObj.playerArrowElem.style.cssText = arrowStyles.best;

                const playerArrowElem = markingObj.playerArrowElem
                const opponentArrowElem = markingObj.opponentArrowElem;

                // move best arrow element on top (multiple same moves can hide the best move)
                const parentElem = markingObj.playerArrowElem.parentElement;

                parentElem.appendChild(playerArrowElem);

                if(opponentArrowElem) {
                    parentElem.appendChild(opponentArrowElem);
                }

                bestMoveMarked = true;
            } else {
                markingObj.playerArrowElem.style.cssText = arrowStyles.secondary;
            }
        });
    },
    removeBestMarkings: () => {
        activeSiteMoveHighlights.forEach(markingObj => {
            markingObj.opponentArrowElem?.remove();
            markingObj.playerArrowElem?.remove();
        });

        activeSiteMoveHighlights = [];
    },
    setBoardOrientation: orientation => {
        if(BoardDrawer) {
            if(debugModeActivated) console.warn('setBoardOrientation', orientation);

            BoardDrawer.setOrientation(orientation);
        }
    },
    setBoardDimensions: dimensionArr => {
        if(BoardDrawer) {
            if(debugModeActivated) console.warn('setBoardDimensions', dimensionArr);

            BoardDrawer.setBoardDimensions(dimensionArr);
        }
    }
};

function displayImportantNotification(title, text) {
    if(typeof GM_notification === 'function') {
        GM_notification({ title: title, text: text });
    } else {
        alert(`[${title}]` + '\n\n' + text);
    }
}

function filterInvisibleElems(elementArr, inverse) {
    return [...elementArr].filter(elem => {
        const style = getComputedStyle(elem);
        const bounds = elem.getBoundingClientRect();

        const isHidden =
            style.visibility === 'hidden' ||
            style.display === 'none' ||
            style.opacity === '0' ||
            bounds.width == 0 ||
            bounds.height == 0;

        return inverse ? isHidden : !isHidden;
    });
}

function getElementSize(elem) {
    const rect = elem.getBoundingClientRect();

    if(rect.width !== 0 && rect.height !== 0) {
        return { width: rect.width, height: rect.height };
    }

    const computedStyle = window.getComputedStyle(elem);
    const width = parseFloat(computedStyle.width);
    const height = parseFloat(computedStyle.height);

    return { width, height };
}

function extractElemTransformData(elem) {
    const computedStyle = window.getComputedStyle(elem);
    const transformMatrix = new DOMMatrix(computedStyle.transform);

    const x = transformMatrix.e;
    const y = transformMatrix.f;

    return [x, y];
}

function getElemCoordinatesFromTransform(elem, config) {
    const onlyFlipX = config?.onlyFlipX;
    const onlyFlipY = config?.onlyFlipY;

    lastBoardSize = getElementSize(chessBoardElem);

    const [files, ranks] = getBoardDimensions();

    lastBoardRanks = ranks;
    lastBoardFiles = files;

    const boardOrientation = getPlayerColorVariable();

    let [x, y] = extractElemTransformData(elem);

    const boardDimensions = lastBoardSize;
    let squareDimensions = boardDimensions.width / lastBoardRanks;

    const normalizedX = Math.round(x / squareDimensions);
    const normalizedY = Math.round(y / squareDimensions);

    if(onlyFlipY || boardOrientation === 'w') {
        const flippedY = lastBoardFiles - normalizedY - 1;

        return [normalizedX, flippedY];
    } else {
        const flippedX = lastBoardRanks - normalizedX - 1;

        return [flippedX, normalizedY];
    }
}

function getElemCoordinatesFromLeftBottomPercentages(elem) {
    if(!lastBoardRanks || !lastBoardFiles) {
        const [files, ranks] = getBoardDimensions();

        lastBoardRanks = ranks;
        lastBoardFiles = files;
    }

    const boardOrientation = getPlayerColorVariable();

    const leftPercentage = parseFloat(elem.style.left?.replace('%', ''));
    const bottomPercentage = parseFloat(elem.style.bottom?.replace('%', ''));

    const x = Math.max(Math.round(leftPercentage / (100 / lastBoardRanks)), 0);
    const y = Math.max(Math.round(bottomPercentage / (100 / lastBoardFiles)), 0);

    if (boardOrientation === 'w') {
        return [x, y];
    } else {
        const flippedX = lastBoardRanks - (x + 1);
        const flippedY = lastBoardFiles - (y + 1);

        return [flippedX, flippedY];
    }
}

function getElemCoordinatesFromLeftTopPixels(elem) {
    const pieceSize = getElementSize(elem);

    const leftPixels = parseFloat(elem.style.left?.replace('px', ''));
    const topPixels = parseFloat(elem.style.top?.replace('px', ''));

    const x = Math.max(Math.round(leftPixels / pieceSize.width), 0);
    const y = Math.max(Math.round(topPixels / pieceSize.width), 0);

    const boardOrientation = getPlayerColorVariable();

    if (boardOrientation === 'w') {
        const flippedY = lastBoardFiles - (y + 1);

        return [x, flippedY];
    } else {
        const flippedX = lastBoardRanks - (x + 1);

        return [flippedX, y];
    }
}

function updateChesscomVariantBoardCoordsTable() {
    chesscomVariantBoardCoordsTable = {};

    const boardElem = getBoardElem();
    const [boardWidth, boardHeight] = getBoardDimensions();
    const boardOrientation = getBoardOrientation();

    const squareElems = getSquareElems(boardElem);

    let squareIndex = 0;

    for(let x = 0; x < boardWidth; x++) {
        for(let y = boardHeight; y > 0; y--) {
            const squareElem = squareElems[squareIndex];
            const id = squareElem?.dataset?.theme;

            if(id) {
                if(boardOrientation === 'b') {
                    chesscomVariantBoardCoordsTable[id] = [boardWidth - (x + 1), boardHeight - y];
                } else {
                    chesscomVariantBoardCoordsTable[id] = [x, y - 1];
                }
            }

            squareIndex++;
        }
    }
}

function updateChesscomVariantPlayerColorsTable() {
    let colors = [];

    document.querySelectorAll('*[data-color]').forEach(pieceElem => {
        const colorCode = Number(pieceElem?.dataset?.color);

        if(!colors?.includes(colorCode)) {
            colors.push(colorCode);
        }
    });

    if(colors?.length > 1) {
        colors = colors.sort((a, b) => a - b);

        chesscomVariantPlayerColorsTable = { [colors[0]]: 'w', [colors[1]]: 'b' };
    }
}

function getBoardDimensionsFromSize() {
    const boardDimensions = getElementSize(chessBoardElem);

    lastBoardSize = getElementSize(chessBoardElem);

    const boardWidth = boardDimensions?.width;
    const boardHeight = boardDimensions.height;

    const boardPiece = getPieceElem();

    if(boardPiece) {
        const pieceDimensions = getElementSize(boardPiece);

        lastPieceSize = getElementSize(boardPiece);

        const boardPieceWidth = pieceDimensions?.width;
        const boardPieceHeight = pieceDimensions?.height;

        const boardRanks = Math.floor(boardWidth / boardPieceWidth);
        const boardFiles = Math.floor(boardHeight / boardPieceHeight);

        const ranksInAllowedRange = 0 < boardRanks && boardRanks <= 69;
        const filesInAllowedRange = 0 < boardFiles && boardFiles <= 69;

        if(ranksInAllowedRange && filesInAllowedRange) {
            return [boardRanks, boardFiles];
        }
    }
}

function defaultTurnFromMutation(mutationArr) {
    const allChessPieceElems = getPieceElem(true);

    const attributeMutationArr = mutationArr.filter(m => allChessPieceElems.includes(m.target));
    const movedChessPieceElem = attributeMutationArr?.[0]?.target;

    if(movedChessPieceElem) {
        const pieceFen = getPieceElemFen(movedChessPieceElem);

        if(pieceFen) {
            const newTurn = getFenPieceOppositeColor(pieceFen);

            if(newTurn?.length === 1) {
                instanceVars.turn.set(commLinkInstanceID, newTurn);

                return newTurn;
            }
        }
    }
}

function chessCoordinatesToIndex(coord) {
    const x = coord.charCodeAt(0) - 97;
    let y = null;

    const lastHalf = coord.slice(1);

    if(lastHalf === ':') {
        y = 9;
    } else {
        y = Number(coord.slice(1)) - 1;
    }

    return [x, y];
}

function getGmConfigValue(key, instanceID) {
    const config = GM_getValue(dbValues.AcasConfig);

    const instanceValue = config?.instance?.[instanceID]?.[key];
    const globalValue = config?.global?.[key];

    if(instanceValue !== undefined) {
        return instanceValue;
    }

    if(globalValue !== undefined) {
        return globalValue;
    }

    return null;
}

function getConfigValue(key) {
    return config[key]?.get();
}

function setConfigValue(key, val) {
    return config[key]?.set(val);
}

function squeezeEmptySquares(fenStr) {
    return fenStr.replace(/1+/g, match => match.length);
}

function getPlayerColorVariable() {
    return instanceVars.playerColor.get(commLinkInstanceID);
}

function getFenPieceColor(pieceFenStr) {
    return pieceFenStr == pieceFenStr.toUpperCase() ? 'w' : 'b';
}

function getFenPieceOppositeColor(pieceFenStr) {
    return getFenPieceColor(pieceFenStr) == 'w' ? 'b' : 'w';
}

function convertPieceStrToFen(str) {
    if(!str || str.length !== 2) {
        return null;
    }

    const firstChar = str[0].toLowerCase();
    const secondChar = str[1];

    if(firstChar === 'w') {
        return secondChar.toUpperCase();
    } else if (firstChar === 'b') {
        return secondChar.toLowerCase();
    }

    return null;
}

function getCanvasPixelColor(canvas, [xPercentage, yPercentage], debug) {
    const ctx = canvas.getContext('2d');

    const x = xPercentage * canvas.width;
    const y = yPercentage * canvas.height;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const pixel = imageData.data;
    const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;

    if(debug) {
        const clonedCanvas = document.createElement('canvas');
              clonedCanvas.width = canvas.width;
              clonedCanvas.height = canvas.height;

        const clonedCtx = clonedCanvas.getContext('2d');
              clonedCtx.drawImage(canvas, 0, 0);

        clonedCtx.fillStyle = 'red';
        clonedCtx.beginPath();
        clonedCtx.arc(x, y, 1, 0, Math.PI * 2);
        clonedCtx.fill();

        const dataURL = clonedCanvas.toDataURL();

        console.log(canvas, pixel, dataURL);
    }

    return brightness < 128 ? 'b' : 'w';
}

function canvasHasPixelAt(canvas, [xPercentage, yPercentage], debug) {
    xPercentage = Math.min(Math.max(xPercentage, 0), 100);
    yPercentage = Math.min(Math.max(yPercentage, 0), 100);

    const ctx = canvas.getContext('2d');
    const x = xPercentage * canvas.width;
    const y = yPercentage * canvas.height;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const pixel = imageData.data;

    if(debug) {
        const clonedCanvas = document.createElement('canvas');
              clonedCanvas.width = canvas.width;
              clonedCanvas.height = canvas.height;

        const clonedCtx = clonedCanvas.getContext('2d');
              clonedCtx.drawImage(canvas, 0, 0);

        clonedCtx.fillStyle = 'red';
        clonedCtx.beginPath();
        clonedCtx.arc(x, y, 1, 0, Math.PI * 2);
        clonedCtx.fill();

        const dataURL = clonedCanvas.toDataURL();

        console.log(canvas, pixel, dataURL);
    }

    return pixel[3] !== 0;
}

function getSiteData(dataType, obj) {
    const pathname = window.location.pathname;

    let dataObj = { pathname };

    if(obj && typeof obj === 'object') {
        dataObj = { ...dataObj, ...obj };
    }

    const dataHandlerFunction = supportedSites[domain]?.[dataType];

    if(typeof dataHandlerFunction !== 'function') {
        return null;
    }

    const result = dataHandlerFunction(dataObj);

    //if(debugModeActivated) console.warn('GET_SITE_DATA', '| DATA_TYPE:', dataType, '| INPUT_OBJ:', obj, '| DATA_OBJ:', dataObj, '| RESULT:', result);

    return result;
}

function addSupportedChessSite(domain, typeHandlerObj) {
    supportedSites[domain] = typeHandlerObj;
}

function getBoardElem() {
    const boardElem = getSiteData('boardElem');

    return boardElem || null;
}

function getPieceElem(getAll) {
    const boardElem = getBoardElem();

    const boardQuerySelector = (getAll ? query => [...boardElem?.querySelectorAll(query)] : boardElem?.querySelector?.bind(boardElem));

    if(typeof boardQuerySelector !== 'function')
        return null;

    const pieceElem = getSiteData('pieceElem', { boardQuerySelector, getAll });

    return pieceElem || null;
}

function getSquareElems(element) {
    const squareElems = getSiteData('squareElems', { element });

    return squareElems || null;
}

function getChessVariant() {
    const chessVariant = getSiteData('chessVariant');

    return chessVariant || null;
}

function getBoardOrientation() {
    const boardOrientation = getSiteData('boardOrientation');

    return boardOrientation || null;
}

function getPieceElemFen(pieceElem) {
    const pieceFen = getSiteData('pieceElemFen', { pieceElem });

    return pieceFen || null;
}

// this function gets called a lot, needs to be optimized
function getPieceElemCoords(pieceElem) {
    const pieceCoords = getSiteData('pieceElemCoords', { pieceElem });

    return pieceCoords || null;
}

function getBoardDimensions() {
    const boardDimensionArr = getSiteData('boardDimensions');

    if(boardDimensionArr) {
        lastBoardRanks = boardDimensionArr[0];
        lastBoardFiles = boardDimensionArr[1];

        return boardDimensionArr;
    } else {
        lastBoardRanks = 8;
        lastBoardFiles = 8;

        return [8, 8];
    }
}

function isMutationNewMove(mutationArr) {
    const isNewMove = getSiteData('isMutationNewMove', { mutationArr });

    return isNewMove || false;
}

function getMutationTurn(mutationArr) {
    const turn = getSiteData('turnFromMutation', { mutationArr });

    return turn || getPlayerColorVariable();
}

function getFen(onlyBasic) {
    const [boardRanks, boardFiles] = getBoardDimensions();

    if(debugModeActivated) console.warn('getFen()', 'onlyBasic:', onlyBasic, 'Ranks:', boardRanks, 'Files:', boardFiles);

    const board = Array.from({ length: boardFiles }, () => Array(boardRanks).fill(1));

    function getBasicFen() {
        const pieceElems = getPieceElem(true);
        const isValidPieceElemsArray = Array.isArray(pieceElems) || pieceElems instanceof NodeList;

        if(isValidPieceElemsArray) {
            pieceElems.forEach(pieceElem => {
                const pieceFenCode = getPieceElemFen(pieceElem);
                const pieceCoordsArr = getPieceElemCoords(pieceElem);

                if(debugModeActivated) console.warn('pieceElem', pieceElem, 'pieceFenCode', pieceFenCode, 'pieceCoordsArr', pieceCoordsArr);

                try {
                    const [xIdx, yIdx] = pieceCoordsArr;

                    board[boardFiles - (yIdx + 1)][xIdx] = pieceFenCode;
                } catch(e) {
                    if(debugModeActivated) console.error(e);
                }
            });
        }

        return squeezeEmptySquares(board.map(x => x.join('')).join('/'));
    }

    function getBoardPiece(fenCoord) {
        const indexArr = chessCoordinatesToIndex(fenCoord);

        return board?.[boardFiles - (indexArr[1] + 1)]?.[indexArr[0]];
    }

    // Works on 8x8 boards only
    function getRights() {
        let rights = '';

        // check for white
        const e1 = getBoardPiece('e1'),
              h1 = getBoardPiece('h1'),
              a1 = getBoardPiece('a1');

        if(e1 == 'K' && h1 == 'R') rights += 'K';
        if(e1 == 'K' && a1 == 'R') rights += 'Q';

        //check for black
        const e8 = getBoardPiece('e8'),
              h8 = getBoardPiece('h8'),
              a8 = getBoardPiece('a8');

        if(e8 == 'k' && h8 == 'r') rights += 'k';
        if(e8 == 'k' && a8 == 'r') rights += 'q';

        return rights ? rights : '-';
    }

    const basicFen = getBasicFen();

    if(debugModeActivated) console.warn('basicFen', basicFen);

    if(onlyBasic) {
        return basicFen;
    }

    // FEN structure: [fen] [player color] [castling rights] [en passant targets] [halfmove clock] [fullmove clock]
    const fullFen = `${basicFen} ${getPlayerColorVariable()} ${getRights()} - - -`;

    return fullFen;
}

function resetCachedValues() {
    chesscomVariantBoardCoordsTable = null;
    chesscomVariantPlayerColorsTable = null;
}

function onNewMove(mutationArr, bypassFenChangeDetection) {
    const currentFullFen = getFen();
    const lastFullFen = instanceVars.fen.get(commLinkInstanceID);

    const fenChanged = currentFullFen !== lastFullFen;

    setTimeout(() => {
        if(getFen() !== instanceVars.fen.get(commLinkInstanceID)) {
            onNewMove(null, true);
        }
    }, 500);

    if(fenChanged || bypassFenChangeDetection) {
        if(debugModeActivated) console.warn('NEW MOVE DETECTED!');

        resetCachedValues();

        boardUtils.setBoardDimensions(getBoardDimensions());

        const lastPlayerColor = getPlayerColorVariable();

        updatePlayerColor();

        const playerColor = getPlayerColorVariable();
        const orientationChanged = playerColor != lastPlayerColor;

        if(orientationChanged) {
            CommLink.commands.log(`Player color (e.g. board orientation) changed from ${lastPlayerColor} to ${playerColor}!`);

            resetCachedValues();

            instanceVars.turn.set(commLinkInstanceID, playerColor);

            CommLink.commands.log(`Turn updated to ${playerColor}!`);
        }

        boardUtils.removeBestMarkings();

        CommLink.commands.updateBoardFen(currentFullFen);

        const turn = mutationArr ? getMutationTurn(mutationArr) : playerColor;
        const onlyCalculateOwnTurn = getConfigValue(configKeys.onlyCalculateOwnTurn);

        if(debugModeActivated) console.warn('TURN:', turn, '| PLAYERCOLOR:', playerColor, '| ORIENTATION_CHANGED:', orientationChanged, '| ONLY_CALC_OWN_TURN:', onlyCalculateOwnTurn);

        if(orientationChanged || !onlyCalculateOwnTurn || turn === playerColor) {
            CommLink.commands.calculateBestMoves(currentFullFen);
        }
    }
}

function observeNewMoves() {
    let lastProcessedFen = null;

    const boardObserver = new MutationObserver(mutationArr => {
        if(debugModeActivated) console.log(mutationArr);

        if(isMutationNewMove(mutationArr))
        {
            if(debugModeActivated) console.warn('Mutation is a new move:', mutationArr);

            if(domain === 'chess.org')
            {
                setTimeout(() => onNewMove(mutationArr), 250);
            }
            else
            {
                onNewMove(mutationArr);
            }
        }
    });

    boardObserver.observe(chessBoardElem, { childList: true, subtree: true, attributes: true });
}

async function updatePlayerColor() {
    const boardOrientation = getBoardOrientation();

    const boardOrientationChanged = lastBoardOrientation !== boardOrientation;
    const boardOrientationDiffers = BoardDrawer && BoardDrawer?.orientation !== boardOrientation;

    if(boardOrientationChanged || boardOrientationDiffers) {
        lastBoardOrientation = boardOrientation;

        instanceVars.playerColor.set(commLinkInstanceID, boardOrientation);
        instanceVars.turn.set(commLinkInstanceID, boardOrientation);

        boardUtils.setBoardOrientation(boardOrientation);

        await CommLink.commands.updateBoardOrientation(boardOrientation);
    }
}






/*
 _______ _____ _______ _______      _______  _____  _______ _______ _____ _______ _____ _______
 |______   |      |    |______      |______ |_____] |______ |         |   |______   |   |
 ______| __|__    |    |______      ______| |       |______ |_____  __|__ |       __|__ |_____

Code below this point handles chess site specific things. (e.g. which element is the board or the pieces)
*/

addSupportedChessSite('chess.com', {
    'boardElem': obj => {
        const pathname = obj.pathname;

        if(pathname?.includes('/variants')) {
            return document.querySelector('.TheBoard-layers');
        }

        return document.querySelector('#board-layout-chessboard > .board');
    },

    'pieceElem': obj => {
        const pathname = obj.pathname;
        const getAll = obj.getAll;

        if(pathname?.includes('/variants')) {
            const filteredPieceElems = filterInvisibleElems(document.querySelectorAll('.TheBoard-layers *[data-piece]'))
                .filter(elem => elem?.dataset?.piece?.toLowerCase() !== 'x');

            return getAll ? filteredPieceElems : filteredPieceElems[0];
        }

        return obj.boardQuerySelector('.piece');
    },

    'squareElems': obj => {
        const pathname = obj.pathname;
        const element = obj.element;

        if(pathname?.includes('/variants')) {
            return [...element.querySelectorAll('.square')];
        }
    },

    'chessVariant': obj => {
        const pathname = obj.pathname;

        if(pathname?.includes('/variants')) {
            const variant = pathname.match(/variants\/([^\/]*)/)?.[1]
                .replaceAll('-chess', '')
                .replaceAll('-', '');

            const replacementTable = {
                'doubles-bughouse': 'bughouse',
                'paradigm-chess30': 'paradigm'
            };

            return replacementTable[variant] || variant;
        }
    },

    'boardOrientation': obj => {
        const pathname = obj.pathname;

        if(pathname?.includes('/variants')) {
            const playerNumberStr = document.querySelector('.playerbox-bottom [data-player]')?.dataset?.player;

            if(!playerNumberStr)
                return 'w';

            return playerNumberStr === '0' ? 'w' : 'b';
        }

        const boardElem = getBoardElem();

        return boardElem?.classList.contains('flipped') ? 'b' : 'w';
    },

    'pieceElemFen': obj => {
        const pathname = obj.pathname;
        const pieceElem = obj.pieceElem;

        let pieceColor = null;
        let pieceName = null;

        if(pathname?.includes('/variants')) {
            if(!chesscomVariantPlayerColorsTable) {
                updateChesscomVariantPlayerColorsTable();
            }

            const pieceFenStr = pieceElem?.dataset?.piece;

            pieceColor = chesscomVariantPlayerColorsTable[pieceElem?.dataset?.color];
            pieceName = pieceElem?.dataset?.piece;
        } else {
            const pieceStr = [...pieceElem.classList].find(x => x.match(/^(b|w)[prnbqk]{1}$/));

            [pieceColor, pieceName] = pieceStr.split('');
        }

        return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
    },

    'pieceElemCoords': obj => {
        const pathname = obj.pathname;
        const pieceElem = obj.pieceElem;

        if(pathname?.includes('/variants')) {
            if(!chesscomVariantBoardCoordsTable) {
                updateChesscomVariantBoardCoordsTable();
            }

            const pieceBoundary = pieceElem.getBoundingClientRect();
            const elementsBehindPieceElem = document.elementsFromPoint(pieceBoundary.x, pieceBoundary.y);

            const squareElem = elementsBehindPieceElem?.find(x => x?.classList?.contains('square'));

            //console.log(squareElem?.dataset?.theme, chesscomVariantBoardCoordsTable[squareElem?.dataset?.theme]);

            const coords = chesscomVariantBoardCoordsTable[squareElem?.dataset?.theme];

            return coords;
        }

        return pieceElem.classList.toString()
            ?.match(/square-(\d)(\d)/)
            ?.slice(1)
            ?.map(x => Number(x) - 1);
    },

    'boardDimensions': obj => {
        const pathname = obj.pathname;

        if(pathname?.includes('/variants')) {
            const squaresContainerElem = document.querySelector('.TheBoard-squares');

            let ranks = 0;
            let files = 0;

            [...squaresContainerElem.childNodes].forEach((x, i) => {
                const visibleChildElems = filterInvisibleElems([...x.childNodes]);

                if(visibleChildElems?.length > 0) {
                    ranks = ranks + 1;

                    if(visibleChildElems.length > files) {
                        files = visibleChildElems.length;
                    }
                }
            });

            //console.log([ranks, files]);

            return [ranks, files];
        } else {
            return [8, 8];
        }
    },

    'isMutationNewMove': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        if(pathname?.includes('/variants')) {
            return mutationArr.find(m => m.type === 'childList') ? true : false;
        }

        if(mutationArr.length == 1)
            return false;

        const modifiedHoverSquare = mutationArr.find(m => m?.target?.classList?.contains('hover-square')) ? true : false;
        const modifiedHighlight = mutationArr.find(m => m?.target?.classList?.contains('highlight')) ? true : false;
        const modifiedElemPool = mutationArr.find(m => m?.target?.classList?.contains('element-pool')) ? true : false;

        return (mutationArr.length >= 4 && !modifiedHoverSquare)
            || mutationArr.length >= 7
            || modifiedHighlight
            || modifiedElemPool;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('lichess.org', {
    'boardElem': obj => {
        return document.querySelector('cg-board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('piece:not(.ghost)');
    },

    'chessVariant': obj => {
        const variantLinkElem = document.querySelector('.variant-link');

        if(variantLinkElem) {
            let variant = variantLinkElem?.innerText?.toLowerCase()?.replaceAll(' ', '-');

            const replacementTable = {
                'correspondence': 'chess',
                'koth': 'kingofthehill',
                'three-check': '3check'
            };

            return replacementTable[variant] || variant;
        }
    },

    'boardOrientation': obj => {
        const filesElem = document.querySelector('coords.files');

        return filesElem?.classList?.contains('black') ? 'b' : 'w';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceColor = pieceElem?.classList?.contains('white') ? 'w' : 'b';
        const elemPieceName = [...pieceElem?.classList]?.find(className => Object.keys(pieceNameToFen).includes(className));

        if(pieceColor && elemPieceName) {
            const pieceName = pieceNameToFen[elemPieceName];

            return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        const key = pieceElem?.cgKey;

        if(key) {
            return chessCoordinatesToIndex(key);
        }
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('playstrategy.org', {
    'boardElem': obj => {
        return document.querySelector('cg-board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('piece[class*="-piece"]:not(.ghost)');
    },

    'chessVariant': obj => {
        const variantLinkElem = document.querySelector('.variant-link');

        if(variantLinkElem) {
            let variant = variantLinkElem?.innerText
                ?.toLowerCase()
                ?.replaceAll(' ', '-');

            const replacementTable = {
                'correspondence': 'chess',
                'koth': 'kingofthehill',
                'three-check': '3check',
                'five-check': '5check',
                'no-castling': 'nocastle'
            };

            return replacementTable[variant] || variant;
        }
    },

    'boardOrientation': obj => {
        const cgWrapElem = document.querySelector('.cg-wrap');

        return cgWrapElem.classList?.contains('orientation-p1') ? 'w' : 'b';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const playerColor = getPlayerColorVariable();
        const pieceColor = pieceElem?.classList?.contains('ally') ? playerColor : (playerColor == 'w' ? 'b' : 'w');

        let pieceName = null;

        [...pieceElem?.classList]?.forEach(className => {
            if(className?.includes('-piece')) {
                const elemPieceName = className?.split('-piece')?.[0];

                if(elemPieceName && elemPieceName?.length === 1) {
                    pieceName = elemPieceName;
                }
            }
        });

        if(pieceColor && pieceName) {
            return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        const key = pieceElem?.cgKey;

        if(key) {
            return chessCoordinatesToIndex(key);
        }
    },

    'boardDimensions': obj => {
        return getBoardDimensionsFromSize();
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('pychess.org', {
    'boardElem': obj => {
        return document.querySelector('cg-board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('piece[class*="-piece"]:not(.ghost)');
    },

    'chessVariant': obj => {
        const variantLinkElem = document.querySelector('#main-wrap .tc .user-link');

        if(variantLinkElem) {
            let variant = variantLinkElem?.innerText
                ?.toLowerCase()
                ?.replaceAll(' ', '')
                ?.replaceAll('-', '');

            const replacementTable = {
                'correspondence': 'chess',
                'koth': 'kingofthehill',
                'nocastling': 'nocastle',
                'gorogoro+': 'gorogoro',
                'oukchaktrang': 'cambodian'
            };

            return replacementTable[variant] || variant;
        }
    },

    'boardOrientation': obj => {
        const cgWrapElem = document.querySelector('.cg-wrap');

        return cgWrapElem.classList?.contains('orientation-black') ? 'b' : 'w';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const playerColor = getPlayerColorVariable();
        const pieceColor = pieceElem?.classList?.contains('ally') ? playerColor : (playerColor == 'w' ? 'b' : 'w');

        let pieceName = null;

        [...pieceElem?.classList]?.forEach(className => {
            if(className?.includes('-piece')) {
                const elemPieceName = className?.split('-piece')?.[0];

                if(elemPieceName && elemPieceName?.length === 1) {
                    pieceName = elemPieceName;
                }
            }
        });

        if(pieceColor && pieceName) {
            return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        const key = pieceElem?.cgKey;

        if(key) {
            return chessCoordinatesToIndex(key);
        }
    },

    'boardDimensions': obj => {
        return getBoardDimensionsFromSize();
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('chess.org', {
    'boardElem': obj => {
        return document.querySelector('.cg-board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('piece:not(.ghost)');
    },

    'chessVariant': obj => {
        const variantNum = unsafeWindow?.GameConfig?.instance?.variant;
        const variant = GameConfig?.VARIANT_NAMES?.[variantNum]?.toLowerCase();

        if(variant) {
            const replacementTable = {
                'standard': 'chess'
            };

            return replacementTable[variant] || variant;
        }
    },

    'boardOrientation': obj => {
        const filesElem = document.querySelector('coords.files');

        return filesElem?.classList?.contains('black') ? 'b' : 'w';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceColor = pieceElem?.classList?.contains('white') ? 'w' : 'b';
        const elemPieceName = [...pieceElem?.classList]?.find(className => Object.keys(pieceNameToFen).includes(className));

        if(pieceColor && elemPieceName) {
            const pieceName = pieceNameToFen[elemPieceName];

            return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return getElemCoordinatesFromTransform(pieceElem);
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        if(isUserMouseDown) {
            return false;
        }

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('chess.coolmath-games.com', {
    'boardElem': obj => {
        return document.querySelector('.cg-board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('piece:not(.ghost)');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        const boardElem = getBoardElem();

        return boardElem.classList?.contains('orientation-black') ? 'b' : 'w';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceColor = pieceElem?.classList?.contains('white') ? 'w' : 'b';
        const elemPieceName = [...pieceElem?.classList]?.find(className => Object.keys(pieceNameToFen).includes(className));

        if(pieceColor && elemPieceName) {
            const pieceName = pieceNameToFen[elemPieceName];

            return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return getElemCoordinatesFromLeftBottomPercentages(pieceElem?.parentElement);
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        if(isUserMouseDown) {
            return false;
        }

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('papergames.io', {
    'boardElem': obj => {
        return document.querySelector('#chessboard');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('*[data-piece][data-square]');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        const boardElem = getBoardElem();

        if(boardElem) {
            const firstRankText = [...boardElem.querySelector('.coordinates').childNodes]?.[0].textContent;

            return firstRankText == 'h' ? 'b' : 'w';
        }
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        return convertPieceStrToFen(pieceElem?.dataset?.piece);
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        const key = pieceElem?.dataset?.square;

        if(key) {
            return chessCoordinatesToIndex(key);
        }
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 12;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('vole.wtf', {
    'boardElem': obj => {
        return document.querySelector('#board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('*[data-t][data-l][data-p]:not([data-p="0"]');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        return 'w';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceNum = Number(pieceElem?.dataset?.p);
        const pieceFenStr = 'pknbrq';

        if(pieceNum > 8) {
            return pieceFenStr[pieceNum - 9].toUpperCase();
        } else {
            return pieceFenStr[pieceNum - 1];
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return [Number(pieceElem?.dataset?.l), 7 - Number(pieceElem?.dataset?.t)];
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 12;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('immortal.game', {
    'boardElem': obj => {
        return document.querySelector('div.pawn.relative, div.knight.relative, div.bishop.relative, div.rook.relative, div.queen.relative, div.king.relative')?.parentElement?.parentElement;
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('div.pawn.relative, div.knight.relative, div.bishop.relative, div.rook.relative, div.queen.relative, div.king.relative');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        const coordA = [...document.querySelectorAll('svg text[x]')]
            .find(elem => elem?.textContent == 'a');

        const coordAX = Number(coordA?.getAttribute('x')) || 10;

        return coordAX < 15 ? 'w' : 'b';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceColor = pieceElem?.classList?.contains('white') ? 'w' : 'b';
        const elemPieceName = [...pieceElem?.classList]?.find(className => Object.keys(pieceNameToFen).includes(className));

        if(pieceColor && elemPieceName) {
            const pieceName = pieceNameToFen[elemPieceName];

            return pieceColor === 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return getElemCoordinatesFromTransform(pieceElem?.parentElement);
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        if(isUserMouseDown) {
            return false;
        }

        return mutationArr.length >= 5;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('chessarena.com', {
    'boardElem': obj => {
        return document.querySelector('cg-board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('cg-piece:not(*[style*="visibility: hidden;"])');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        const titlesElem = document.querySelector('cg-titles');

        return titlesElem?.classList?.contains('rotated') ? 'b' : 'w';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceColor = pieceElem?.className?.[0];
        const elemPieceName = pieceElem?.className?.[1];

        if(pieceColor && elemPieceName) {
            const pieceName = elemPieceName; // pieceNameToFen[elemPieceName]

            return pieceColor === 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return getElemCoordinatesFromTransform(pieceElem, { 'onlyFlipY': true });
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        if(isUserMouseDown) {
            return false;
        }

        return mutationArr.find(m => m?.attributeName === 'style') ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});


addSupportedChessSite('chess.net', {
    'boardElem': obj => {
        return document.querySelector('cg-board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('piece:not(.ghost)');
    },

    'chessVariant': obj => {
        const variantLinkElem = document.querySelector('.variant-link');

        if(variantLinkElem) {
            let variant = variantLinkElem?.innerText?.toLowerCase()?.replaceAll(' ', '-');

            const replacementTable = {
                'correspondence': 'chess',
                'koth': 'kingofthehill',
                'three-check': '3check'
            };

            return replacementTable[variant] || variant;
        }
    },

    'boardOrientation': obj => {
        const filesElem = document.querySelector('coords.files');

        return filesElem?.classList?.contains('black') ? 'b' : 'w';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceColor = pieceElem?.classList?.contains('white') ? 'w' : 'b';
        const elemPieceName = [...pieceElem?.classList]?.find(className => Object.keys(pieceNameToFen).includes(className));

        if(pieceColor && elemPieceName) {
            const pieceName = pieceNameToFen[elemPieceName];

            return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        const key = pieceElem?.cgKey;

        if(key) {
            return chessCoordinatesToIndex(key);
        }
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('freechess.club', {
    'boardElem': obj => {
        return document.querySelector('cg-board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('piece:not(.ghost)');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        const filesElem = document.querySelector('coords.files');

        return filesElem?.classList?.contains('black') ? 'b' : 'w';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceColor = pieceElem?.classList?.contains('white') ? 'w' : 'b';
        const elemPieceName = [...pieceElem?.classList]?.find(className => Object.keys(pieceNameToFen).includes(className));

        if(pieceColor && elemPieceName) {
            const pieceName = pieceNameToFen[elemPieceName];

            return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        const key = pieceElem?.cgKey;

        if(key) {
            return chessCoordinatesToIndex(key);
        }
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('play.chessclub.com', {
    'boardElem': obj => {
        return document.querySelector('cg-board');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('piece:not(.ghost)');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        const filesElem = document.querySelector('coords.files');

        return filesElem?.classList?.contains('black') ? 'b' : 'w';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceColor = pieceElem?.classList?.contains('white') ? 'w' : 'b';
        const elemPieceName = [...pieceElem?.classList]?.find(className => Object.keys(pieceNameToFen).includes(className));

        if(pieceColor && elemPieceName) {
            const pieceName = pieceNameToFen[elemPieceName];

            return pieceColor == 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        const key = pieceElem?.cgKey;

        if(key) {
            return chessCoordinatesToIndex(key);
        }
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('gameknot.com', {
    'boardElem': obj => {
        return document.querySelector('#chess-board-acboard');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('*[class*="square_"] > img[src*="chess36."][style*="visible"]');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        return document.querySelector('#chess-board-my-side-color .player_white') ? 'w' : 'b';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const left = Number(pieceElem.style.left.replace('px', ''));
        const top = Number(pieceElem.style.top.replace('px', ''));

        const pieceColor = left >= 0 ? 'w' : 'b';
        const pieceName = 'kqrnbp'[(top * -1) / 60];

        return pieceColor === 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return getElemCoordinatesFromLeftTopPixels(pieceElem.parentElement);
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        if(isUserMouseDown) {
            return false;
        }

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('chesstempo.com', {
    'boardElem': obj => {
        return document.querySelector('.ct-board-squares');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('*[class*="ct-pieceClass"][class*="ct-piece-"]');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        return document.querySelector('.ct-coord-column').innerText === 'a' ? 'w' : 'b';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceNameClass = [...pieceElem.classList].find(x => x?.includes('ct-piece-'));
        const colorNameCombo = pieceNameClass?.split('ct-piece-')?.pop();

        const elemPieceColor = colorNameCombo.startsWith('white') ? 'w' : 'b';
        const elemPieceName = colorNameCombo.substring(5);

        const pieceName = pieceNameToFen[elemPieceName];

        return elemPieceColor === 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return [pieceElem?.ct?.piece?.piece?.column, pieceElem?.ct?.piece?.piece?.row];
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 4;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('redhotpawn.com', {
    'boardElem': obj => {
        return document.querySelector('#board-0_1');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('li.piece[id*="-pc-"]');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        const aCoordLeftStyleNum = Number([...document.querySelectorAll('.boardCoordinate')]
            .find(elem => elem?.innerText === 'a')
            ?.style?.left?.replace('px', ''));

        return aCoordLeftStyleNum < 200 ? 'w' : 'b';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        return (pieceElem?.id?.match(/-pc-(.*?)-/) || [])[1];
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return getElemCoordinatesFromLeftTopPixels(pieceElem);
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        if(isUserMouseDown) {
            return false;
        }

        return mutationArr.length >= 4;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('chessanytime.com', {
    'boardElem': obj => {
        return document.querySelector('#play');
    },

    'pieceElem': obj => {
        const getAll = obj.getAll;

        const pieceElems = [...document.querySelectorAll('canvas.canvas_piece')].filter(elem => canvasHasPixelAt(elem, [0.5, 0.5]));

        return getAll ? pieceElems : pieceElems[0];
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        return document.querySelector('#play_coordy0')?.innerText === '8' ? 'w' : 'b';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const pieceTypeCoordPercentages = [
            { 'name' : 'k', 'coords': [52/60, 26/60] },
            { 'name' : 'q', 'coords': [8/60, 16/60] },
            { 'name' : 'n', 'coords': [51/60, 42/60] },
            { 'name' : 'b', 'coords': [9/60, 50/60] },
            { 'name' : 'r', 'coords': [45/60, 15/60] },
            { 'name' : 'p', 'coords': [0.5, 0.5] }
        ];

        const pieceColorCoordPercentages = {
            'k': [42/60, 27/60],
            'q': [30/60, 50/60],
            'n': [38/60, 41/60],
            'b': [30/60, 20/60]
        };

        let pieceName = null;

        for(obj of pieceTypeCoordPercentages) {
            const isThisPiece = canvasHasPixelAt(pieceElem, obj.coords);

            if(isThisPiece) {
                pieceName = obj.name;

                break;
            }
        }

        if(pieceName) {
            const colorCoords = pieceColorCoordPercentages[pieceName] || [0.5, 0.5];

            const pieceColor = getCanvasPixelColor(pieceElem, colorCoords);

            return pieceColor === 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return getElemCoordinatesFromLeftTopPixels(pieceElem);
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        if(isUserMouseDown) {
            return false;
        }

        return mutationArr.length >= 7;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

addSupportedChessSite('chessworld.net', {
    'boardElem': obj => {
        return document.querySelector('#ChessWorldChessBoard');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('img[src*="merida"');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        return document.querySelector('div[style*="boardb.jpg"]') ? 'w' : 'b';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const [elemPieceColor, elemPieceName] = pieceElem
            ?.src
            ?.split('/')
            ?.pop()
            ?.replace('.png', '')
            ?.split('_');

        const pieceColor = elemPieceColor === 'white' ? 'w' : 'b';
        const pieceName = pieceNameToFen[elemPieceName];

        return pieceColor === 'w' ? pieceName.toUpperCase() : pieceName.toLowerCase();
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        return chessCoordinatesToIndex(pieceElem?.id);
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        return mutationArr.length >= 2;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});

/* The site is very shitty I don't feel like finishing this
addSupportedChessSite('chessfriends.com', {
    'boardElem': obj => {
        return document.querySelector('div[id*="id_board_"');
    },

    'pieceElem': obj => {
        return obj.boardQuerySelector('img[name][id*="id_piece_"][src*="/pieces/"]');
    },

    'chessVariant': obj => {
        return 'chess';
    },

    'boardOrientation': obj => {
        const firstSquareTop = document.querySelector('*[id*="id_square_00_"]')?.style?.top;

        return firstSquareTop === '0px' ? 'w' : 'b';
    },

    'pieceElemFen': obj => {
        const pieceElem = obj.pieceElem;

        const dataStr = pieceElem.getAttribute('name');

        if(dataStr?.length === 2) {
            const pieceColor = dataStr[0];
            const elemPieceName = dataStr[1];

            return pieceColor == 'w' ? elemPieceName.toUpperCase() : elemPieceName.toLowerCase();
        }
    },

    'pieceElemCoords': obj => {
        const pieceElem = obj.pieceElem;

        //console.log(getElemCoordinatesFromLeftTopPixels(pieceElem));

        return getElemCoordinatesFromLeftTopPixels(pieceElem);
    },

    'boardDimensions': obj => {
        return [8, 8];
    },

    'isMutationNewMove': obj => {
        const mutationArr = obj.mutationArr;

        if(isUserMouseDown) {
            return false;
        }

        return mutationArr.length >= 4
            || mutationArr.find(m => m.type === 'childList') ? true : false
            || mutationArr.find(m => m?.target?.classList?.contains('last-move')) ? true : false;
    },

    'turnFromMutation': obj => {
        const pathname = obj.pathname;
        const mutationArr = obj.mutationArr;

        return defaultTurnFromMutation(mutationArr);
    }
});*/

