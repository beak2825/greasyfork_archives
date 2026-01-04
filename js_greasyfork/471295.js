// ==UserScript==
// @name       chess-helper
// @namespace  chess-helper
// @version    0.0.1
// @author     monkey
// @icon       https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png
// @match      https://www.chess.com/*
// @run-at     document-end
// ==/UserScript==

(function() {
  "use strict";
  let playerIsWhiteCache = false;
  const playerIsWhite = () => {
    if (playerIsWhiteCache)
      return playerIsWhiteCache;
    const firstCoordinateIsEight = document.querySelector(".coordinates").childNodes[0].textContent === "8";
    playerIsWhiteCache = firstCoordinateIsEight;
    return firstCoordinateIsEight;
  };
  const init$1 = () => {
    playerIsWhite();
  };
  const configService = { playerIsWhite, init: init$1 };
  const createElement = ({
    type,
    classes
  }) => {
    const element = document.createElement(type);
    classes.forEach((c) => element.classList.add(c));
    return element;
  };
  const getBoard = () => {
    const board = document.querySelector("chess-board");
    if (!board)
      return null;
    return board;
  };
  const domService = { createElement, getBoard };
  const chessMoves = {
    pawn: [
      {
        x: 0,
        y: 1,
        condition: ["base"]
      },
      {
        x: 0,
        y: 2,
        condition: ["isFirstMove"]
      },
      {
        y: 1,
        x: 1,
        condition: ["canAttack"]
      },
      {
        y: 1,
        x: -1,
        condition: ["canAttack"]
      }
    ],
    rook: [
      {
        y: "n",
        x: 0
      },
      {
        y: 0,
        x: "n"
      }
    ],
    bishop: [
      {
        y: "n1",
        x: "n1"
      }
    ],
    queen: [
      {
        y: "n1",
        x: "n1"
      },
      {
        y: "n",
        x: 0
      },
      {
        y: 0,
        x: "n"
      }
    ],
    knight: [
      {
        y: 2,
        x: 1,
        condition: ["always"]
      },
      {
        y: 2,
        x: -1,
        condition: ["always"]
      },
      {
        y: -2,
        x: 1,
        condition: ["always"]
      },
      {
        y: -2,
        x: -1,
        condition: ["always"]
      },
      {
        y: 1,
        x: 2,
        condition: ["always"]
      },
      {
        y: 1,
        x: -2,
        condition: ["always"]
      },
      {
        y: -1,
        x: 2,
        condition: ["always"]
      },
      {
        y: -1,
        x: -2,
        condition: ["always"]
      }
    ],
    king: [
      {
        y: 1,
        x: 0,
        condition: ["isSafe"]
      },
      {
        y: 1,
        x: 1,
        condition: ["isSafe"]
      },
      {
        y: 1,
        x: -1,
        condition: ["isSafe"]
      },
      {
        y: -1,
        x: 0,
        condition: ["isSafe"]
      },
      {
        y: -1,
        x: 1,
        condition: ["isSafe"]
      },
      {
        y: -1,
        x: -1,
        condition: ["isSafe"]
      },
      {
        y: 0,
        x: 1,
        condition: ["isSafe"]
      },
      {
        y: 0,
        x: -1,
        condition: ["isSafe"]
      },
      // castling moves
      {
        y: 0,
        x: 2,
        condition: ["isSafe", "isFirstMove", "towerUntouched", "castling"]
      },
      {
        y: 0,
        x: -2,
        condition: ["isSafe", "isFirstMove", "towerUntouched", "castling"]
      }
    ]
  };
  const chessTypes = {
    p: "pawn",
    r: "rook",
    n: "knight",
    b: "bishop",
    q: "queen",
    k: "king"
  };
  const ALTERATION_FIRST = 10;
  const ALTERATION_LAST = 1;
  const Square = (square, metaData, startSquare = null) => {
    startSquare = startSquare ?? Number(square);
    let current = Number(square);
    let isOnPiece = false;
    let id = crypto.randomUUID();
    let isOnEnemyPiece = false;
    let isOnEndOfBoard = false;
    let isOutsideBoard = false;
    let isActivePiece = true;
    let canAttack = true;
    const validate = () => {
      const info = squareService.getCurrentLocationPieceInfo(
        current,
        startSquare
      );
      if (info) {
        isOnPiece = info.isOnPiece;
        isOnEnemyPiece = info.isOnEnemyPiece;
      } else {
        isOnPiece = false;
        isOnEnemyPiece = false;
      }
      if (squareService.isLocatedOnEndOfBoard(current)) {
        isOnEndOfBoard = true;
      }
      if (squareService.isOutsideOfBoard(current)) {
        isOutsideBoard = true;
      }
    };
    validate();
    const getFirst = () => Number(String(current).charAt(0));
    const getLast = () => Number(String(current).charAt(1));
    const moveRight = () => {
      current += ALTERATION_FIRST;
      validate();
      return Square(current, metaData, startSquare);
    };
    const moveLeft = () => {
      current -= ALTERATION_FIRST;
      validate();
      return Square(current, metaData, startSquare);
    };
    const moveUp = () => {
      current += ALTERATION_LAST;
      validate();
      return Square(current, metaData, startSquare);
    };
    const moveDown = () => {
      current -= ALTERATION_LAST;
      validate();
      return Square(current, metaData, startSquare);
    };
    const setActivePiece = (active) => {
      isActivePiece = active;
    };
    const setCanAttack = (attacking) => {
      canAttack = attacking;
    };
    return {
      getStartSquareNumber: () => startSquare,
      getStartSquare: () => Square(startSquare, metaData),
      getFirst,
      getLast,
      getCurrent: () => current,
      getMetaData: () => metaData,
      getId: () => id,
      moveRight,
      moveLeft,
      moveUp,
      moveDown,
      setActivePiece,
      setCanAttack,
      isActivePiece: () => isActivePiece,
      canAttack: () => canAttack,
      isOnPiece: () => isOnPiece,
      isOnEnemyPiece: () => isOnEnemyPiece,
      isOnEndOfBoard: () => isOnEndOfBoard,
      isOutsideBoard: () => isOutsideBoard,
      isOnRow: (row) => getLast() === row,
      getSquare: () => Square(current, metaData, startSquare)
    };
  };
  const handleRepeatedMoveUntilBreak = (square, moves2, callback) => {
    let tempSquare = square.getSquare();
    while (true) {
      tempSquare = callback(tempSquare);
      if ((tempSquare == null ? void 0 : tempSquare.isOutsideBoard()) || tempSquare === null) {
        break;
      }
      if (tempSquare.isOnPiece()) {
        if (tempSquare.isOnEnemyPiece()) {
          moves2.push(tempSquare.getSquare());
        } else {
          tempSquare.setActivePiece(false);
          moves2.push(tempSquare.getSquare());
        }
        break;
      }
      moves2.push(tempSquare.getSquare());
    }
  };
  const handleAxis = (axis, square, moveOnAxis) => {
    const isPositive = moveOnAxis > 0;
    const isNegative = moveOnAxis < 0;
    if (isPositive) {
      for (let i = 0; i < moveOnAxis; i++) {
        if (axis === "y")
          square.moveUp();
        if (axis === "x")
          square.moveRight();
      }
    }
    if (isNegative) {
      for (let i = 0; i > moveOnAxis; i--) {
        if (axis === "y")
          square.moveDown();
        if (axis === "x")
          square.moveLeft();
      }
    }
  };
  const prepareKingMove = (move, metaData) => {
    var _a;
    const x = move.x;
    const y = move.y;
    if (Number.isNaN(x) || Number.isNaN(y)) {
      console.log("Both need to be numbers");
      return null;
    }
    const square = Square(metaData.square, metaData);
    if ((_a = move.condition) == null ? void 0 : _a.includes("castling")) {
      return null;
    }
    handleAxis("x", square, x);
    handleAxis("y", square, y);
    return square;
  };
  const prepareKnightMove = (move, metaData) => {
    const x = move.x;
    const y = move.y;
    if (Number.isNaN(x) || Number.isNaN(y)) {
      console.log("Both need to be numbers");
      return null;
    }
    const square = Square(metaData.square, metaData);
    handleAxis("x", square, x);
    handleAxis("y", square, y);
    return square;
  };
  const prepareN1Moves = (move, metaData) => {
    let moves2 = [];
    if (move.x !== "n1" || move.y !== "n1") {
      console.log("Both need to be n1");
      return moves2;
    }
    const startSquare = Square(metaData.square, metaData);
    handleRepeatedMoveUntilBreak(startSquare, moves2, (square) => {
      square.moveUp();
      return square.moveRight();
    });
    handleRepeatedMoveUntilBreak(startSquare, moves2, (square) => {
      square.moveUp();
      return square.moveLeft();
    });
    handleRepeatedMoveUntilBreak(startSquare, moves2, (square) => {
      square.moveDown();
      return square.moveRight();
    });
    handleRepeatedMoveUntilBreak(startSquare, moves2, (square) => {
      square.moveDown();
      return square.moveLeft();
    });
    return moves2;
  };
  const prepareNMoves = (move, metaData) => {
    let moves2 = [];
    if (move.x === "n" && move.y === "n") {
      console.log("handle special case");
      return moves2;
    }
    if (move.x !== "n" && move.y !== "n") {
      console.log("Cannot have both x and y as n");
      return moves2;
    }
    const handleVertical = move.y === "n";
    const square = Square(metaData.square, metaData);
    if (handleVertical) {
      handleRepeatedMoveUntilBreak(
        square,
        moves2,
        (square2) => square2.moveUp()
      );
      handleRepeatedMoveUntilBreak(
        square,
        moves2,
        (square2) => square2.moveDown()
      );
    } else {
      handleRepeatedMoveUntilBreak(
        square,
        moves2,
        (square2) => square2.moveRight()
      );
      handleRepeatedMoveUntilBreak(
        square,
        moves2,
        (square2) => square2.moveLeft()
      );
    }
    return moves2;
  };
  const preparePawnMove = (move, metaData) => {
    var _a, _b, _c, _d, _e, _f, _g;
    let square = Square(metaData.square, metaData);
    const isWhitePiece = metaData.isWhite;
    const checkIfFirstMove = (square2) => {
      if (isWhitePiece) {
        return square2.getSquare().isOnRow(2);
      } else {
        return square2.getSquare().isOnRow(7);
      }
    };
    const isFirstMove = checkIfFirstMove(square);
    const handleAxis2 = (axis, move2, callbacks) => {
      const value = move2[axis];
      if (value !== 0 && Number.isInteger(value)) {
        let x = value;
        const isPositive = x > 0;
        if (isWhitePiece) {
          for (let i = 0; i < Math.abs(x); i++) {
            if (isPositive) {
              callbacks.whiteAndPositive(square);
            } else {
              callbacks.whiteAndNegative(square);
            }
            if (square.isOnPiece()) {
              break;
            }
          }
        } else {
          for (let i = 0; i < Math.abs(x); i++) {
            if (isPositive) {
              callbacks.blackAndPositive(square);
            } else {
              callbacks.blackAndNegative(square);
            }
            if (square.isOnPiece()) {
              break;
            }
          }
        }
      }
    };
    handleAxis2("y", move, {
      blackAndPositive: (square2) => square2.moveDown(),
      blackAndNegative: (square2) => square2.moveUp(),
      whiteAndPositive: (square2) => square2.moveUp(),
      whiteAndNegative: (square2) => square2.moveDown()
    });
    handleAxis2("x", move, {
      blackAndPositive: (square2) => square2.moveLeft(),
      blackAndNegative: (square2) => square2.moveRight(),
      whiteAndPositive: (square2) => square2.moveRight(),
      whiteAndNegative: (square2) => square2.moveLeft()
    });
    if (((_a = move == null ? void 0 : move.condition) == null ? void 0 : _a.includes("isFirstMove")) && !isFirstMove) {
      return null;
    }
    if (((_b = move == null ? void 0 : move.condition) == null ? void 0 : _b.includes("isFirstMove")) && isFirstMove && square.isOnPiece()) {
      square.setCanAttack(false);
      square.setActivePiece(false);
      return square;
    }
    if (((_c = move == null ? void 0 : move.condition) == null ? void 0 : _c.includes("isFirstMove")) && isFirstMove) {
      square.setCanAttack(false);
      return square;
    }
    if (((_d = move == null ? void 0 : move.condition) == null ? void 0 : _d.includes("canAttack")) && !square.isOnEnemyPiece()) {
      square.setActivePiece(false);
      return square;
    }
    if (((_e = move == null ? void 0 : move.condition) == null ? void 0 : _e.includes("canAttack")) && square.isOnEnemyPiece()) {
      square.setCanAttack(true);
      return square;
    }
    if (!((_f = move == null ? void 0 : move.condition) == null ? void 0 : _f.includes("canAttack")) && square.isOnPiece()) {
      square.setActivePiece(false);
      square.setCanAttack(false);
      return square;
    }
    if ((_g = move == null ? void 0 : move.condition) == null ? void 0 : _g.includes("base")) {
      square.setCanAttack(false);
      return square;
    }
    return square;
  };
  const moveService = {
    preparePawnMove,
    prepareKnightMove,
    prepareKingMove,
    prepareNMoves,
    prepareN1Moves
  };
  const clearSquare = (board) => {
    var _a, _b;
    const toRemove = board.querySelectorAll(".doRemove");
    for (const element of toRemove) {
      (_a = element == null ? void 0 : element.parentNode) == null ? void 0 : _a.removeChild(element);
    }
    const highlightsToRemove = board.querySelectorAll(".highlight");
    for (const element of highlightsToRemove) {
      (_b = element == null ? void 0 : element.classList) == null ? void 0 : _b.remove("highlight");
    }
  };
  const getCurrentLocationPieceInfo = (square, start) => {
    if (square === start)
      return null;
    const isOnPiece = (current2) => {
      var _a;
      return (_a = current2 == null ? void 0 : current2.className) == null ? void 0 : _a.includes("piece");
    };
    const startSquare = Array.from(
      document.querySelectorAll(`.square-${start}`)
    ).find((e) => isOnPiece(e));
    const current = Array.from(
      document.querySelectorAll(`.square-${square}`)
    ).find((e) => isOnPiece(e));
    const metaData = getMetaDataForSquare(startSquare);
    const isBlackPiecePlaying = !metaData.isWhite;
    const isStandingOnWhitePiece = (current2) => {
      const metaData2 = getMetaDataForSquare(current2);
      return (metaData2 == null ? void 0 : metaData2.isWhite) ?? false;
    };
    const isOnEnemy = isBlackPiecePlaying && isStandingOnWhitePiece(current) || !isBlackPiecePlaying && !isStandingOnWhitePiece(current);
    return {
      isOnPiece: isOnPiece(current),
      isOnEnemyPiece: isOnPiece(current) ? isOnEnemy : false
    };
  };
  const isLocatedOnEndOfBoard = (square) => {
    const first = Number(String(square).charAt(0));
    const last = Number(String(square).charAt(1));
    if (first === 8 || first === 1)
      return true;
    if (last === 8 || last === 1)
      return true;
    return false;
  };
  const isOutsideOfBoard = (square) => {
    const first = Number(String(square).charAt(0));
    const last = Number(String(square).charAt(1));
    if (!first || !last)
      return true;
    if (first > 8 || first < 1)
      return true;
    if (last > 8 || last < 1)
      return true;
    return false;
  };
  const getPossibleMoveSquares = (moves2, metaData) => {
    let totalMoves = [];
    for (const move of moves2) {
      let tempMoves = [];
      switch (metaData.type) {
        case "pawn":
          const pawnMove = moveService.preparePawnMove(move, metaData);
          if (pawnMove)
            tempMoves = [pawnMove];
          break;
        case "rook":
          tempMoves = moveService.prepareNMoves(move, metaData);
          break;
        case "bishop":
          tempMoves = moveService.prepareN1Moves(move, metaData);
          break;
        case "queen":
          const isNMove = move.x === "n" || move.y === "n";
          if (isNMove) {
            tempMoves = moveService.prepareNMoves(move, metaData);
          } else {
            tempMoves = moveService.prepareN1Moves(move, metaData);
          }
          break;
        case "knight":
          const knightMove = moveService.prepareKnightMove(
            move,
            metaData
          );
          if (knightMove)
            tempMoves = [knightMove];
          break;
        case "king":
          const kingMove = moveService.prepareKingMove(move, metaData);
          if (kingMove)
            tempMoves = [kingMove];
          break;
        default:
          console.log("Not implemented yet");
      }
      totalMoves = [...totalMoves, ...tempMoves];
    }
    return totalMoves;
  };
  const getMetaDataForSquare = (target) => {
    var _a;
    if (target instanceof SVGElement)
      return null;
    if (!((_a = target == null ? void 0 : target.className) == null ? void 0 : _a.includes("piece")))
      return null;
    const data = target.className.split(" ");
    let pieceInfo = data[1];
    let squareInfo = data[2];
    if (pieceInfo.includes("square")) {
      const temp = pieceInfo;
      pieceInfo = squareInfo;
      squareInfo = temp;
    }
    const square = squareInfo.split("-")[1];
    const pieceAbbreviation = pieceInfo[1];
    return {
      isWhite: pieceInfo.startsWith("b") ? false : true,
      type: chessTypes[pieceAbbreviation],
      square: Number(square),
      element: target
    };
  };
  const squareService = {
    clearSquare,
    isOutsideOfBoard,
    getCurrentLocationPieceInfo,
    isLocatedOnEndOfBoard,
    getPossibleMoveSquares,
    getMetaDataForSquare
  };
  const moves = [];
  const addMoves = (square) => {
    if (!square)
      return;
    const validate = (square2) => {
      if (squareService.isOutsideOfBoard(square2.getCurrent()))
        return;
      moves.push(square2);
    };
    if (Array.isArray(square)) {
      square.forEach(validate);
      return;
    }
    validate(square);
  };
  const getMoves = () => {
    return moves;
  };
  const clearMoves = () => {
    moves.length = 0;
  };
  const displayMoveService = { addMoves, getMoves, clearMoves };
  const getCurrentEnemyPieces = () => {
    const enemyPieces = Array.from(document.querySelectorAll(".piece")).filter(
      (element) => {
        const metaData = squareService.getMetaDataForSquare(element);
        return (metaData == null ? void 0 : metaData.isWhite) !== configService.playerIsWhite();
      }
    );
    return enemyPieces;
  };
  const getCurrentUserPieces = () => {
    const userPieces = Array.from(document.querySelectorAll(".piece")).filter(
      (element) => {
        const metaData = squareService.getMetaDataForSquare(element);
        return (metaData == null ? void 0 : metaData.isWhite) === configService.playerIsWhite();
      }
    );
    return userPieces;
  };
  const getPossibleEnemyMoves = () => {
    const enemies = getCurrentEnemyPieces().map(
      (element) => squareService.getMetaDataForSquare(element)
    );
    const possibleEnemyMoves = enemies.reduce(
      (accumulator, enemy) => {
        const moves2 = chessMoves[enemy.type];
        const possibleMoves = squareService.getPossibleMoveSquares(
          moves2,
          enemy
        );
        return [
          ...accumulator,
          ...possibleMoves.filter((s) => s.canAttack())
        ];
      },
      []
    );
    return possibleEnemyMoves;
  };
  const getPossibleUserMoves = () => {
    const userPieces = getCurrentUserPieces().map(
      (element) => squareService.getMetaDataForSquare(element)
    );
    const possibleUserMoves = userPieces.reduce(
      (accumulator, userPiece) => {
        const moves2 = chessMoves[userPiece.type];
        const possibleMoves = squareService.getPossibleMoveSquares(
          moves2,
          userPiece
        );
        return [
          ...accumulator,
          ...possibleMoves.filter((s) => s.canAttack())
        ];
      },
      []
    );
    return possibleUserMoves;
  };
  const pieceService = {
    getPossibleEnemyMoves,
    getPossibleUserMoves,
    getCurrentEnemyPieces,
    getCurrentUserPieces
  };
  const BACKGROUND_COLORS = {
    green: "lightgreen",
    gray: "lightgray",
    red: "red",
    orange: "orange"
  };
  const showPiecesInDanger = ({
    board,
    currentUserPieces,
    possibleEnemyMoves,
    allPossibleUserMoves
  }) => {
    currentUserPieces.forEach((piece) => {
      const squareMetaData = squareService.getMetaDataForSquare(piece);
      const isPieceInDanger = possibleEnemyMoves.some(
        (s) => s.getCurrent() === squareMetaData.square
      );
      const possibleMovesExludedCurrentPiece = allPossibleUserMoves.filter(
        (s) => {
          return piece.isEqualNode(s.getMetaData().element) === false;
        }
      );
      const pieceHasBackup = possibleMovesExludedCurrentPiece.some((s) => {
        return s.getCurrent() === squareMetaData.square;
      });
      const element = domService.createElement({
        type: "div",
        classes: [
          "capture-hint",
          `square-${squareMetaData.square}`,
          "doRemove"
        ]
      });
      if (isPieceInDanger && pieceHasBackup) {
        element.style.borderColor = BACKGROUND_COLORS.orange;
      } else if (isPieceInDanger) {
        element.style.borderColor = BACKGROUND_COLORS.red;
      }
      if (isPieceInDanger) {
        element.style.borderWidth = "8px";
        element.style.opacity = "0.5";
        board == null ? void 0 : board.appendChild(element);
      }
    });
  };
  const showPossibleMoves = ({
    board,
    activeMoves,
    possibleEnemyMoves
  }) => {
    activeMoves.forEach((square) => {
      if (square === null || square === void 0)
        return;
      if (square.getCurrent() === square.getStartSquareNumber())
        return;
      if (square.isOnPiece() && !square.isOnEnemyPiece())
        return;
      const classes = ["hint", `square-${square.getCurrent()}`, "doRemove"];
      if (square.isOnEnemyPiece())
        classes.push("enemy");
      const element = domService.createElement({
        type: "div",
        classes
      });
      const isPossibleEnemyMove = possibleEnemyMoves.some(
        (s) => s.getCurrent() === square.getCurrent()
      );
      const isUserPiece = configService.playerIsWhite() && square.getMetaData().isWhite || !configService.playerIsWhite() && !square.getMetaData().isWhite;
      const pieceCoveredByAmount = possibleEnemyMoves.filter(
        (s) => s.getCurrent() === square.getCurrent()
      ).length;
      let color = BACKGROUND_COLORS.gray;
      if (isUserPiece) {
        if (isPossibleEnemyMove && square.isOnEnemyPiece()) {
          color = BACKGROUND_COLORS.orange;
        } else if (isPossibleEnemyMove) {
          color = BACKGROUND_COLORS.orange;
        } else if (square.isOnEnemyPiece()) {
          color = BACKGROUND_COLORS.green;
        }
        if (pieceCoveredByAmount > 1) {
          element.textContent = pieceCoveredByAmount.toString();
          element.style.display = "grid";
          element.style.placeItems = "center";
        }
      }
      element.style.backgroundColor = color;
      element.style.opacity = "0.5";
      board == null ? void 0 : board.appendChild(element);
    });
  };
  const showPossibleFreeCaptures = ({
    board,
    allPossibleUserMoves,
    possibleEnemyMoves
  }) => {
    allPossibleUserMoves.forEach((square) => {
      if (square === null || square === void 0)
        return;
      if (square.getCurrent() === square.getStartSquareNumber())
        return;
      if (square.isOnPiece() && !square.isOnEnemyPiece())
        return;
      if (!square.isOnEnemyPiece())
        return;
      const isPossibleEnemyMove = possibleEnemyMoves.some(
        (s) => s.getCurrent() === square.getCurrent()
      );
      const isUserPiece = configService.playerIsWhite() && square.getMetaData().isWhite || !configService.playerIsWhite() && !square.getMetaData().isWhite;
      const classes = [
        "capture-hint",
        `square-${square.getCurrent()}`,
        "doRemove"
      ];
      const element = domService.createElement({
        type: "div",
        classes
      });
      if (isUserPiece && !isPossibleEnemyMove) {
        element.style.borderWidth = "8px";
        element.style.borderColor = BACKGROUND_COLORS.green;
        element.style.opacity = "0.5";
        board == null ? void 0 : board.appendChild(element);
      }
    });
  };
  const displayMoves = () => {
    const board = domService.getBoard();
    const possibleEnemyMoves = pieceService.getPossibleEnemyMoves();
    const moves2 = displayMoveService.getMoves();
    const activeMoves = moves2.filter((s) => s.isActivePiece());
    const currentUserPieces = pieceService.getCurrentUserPieces();
    const allPossibleUserMoves = pieceService.getPossibleUserMoves();
    showPiecesInDanger({
      board,
      currentUserPieces,
      possibleEnemyMoves,
      allPossibleUserMoves
    });
    showPossibleMoves({ board, activeMoves, possibleEnemyMoves });
    showPossibleFreeCaptures({
      board,
      allPossibleUserMoves,
      possibleEnemyMoves
    });
  };
  const displayService = { displayMoves };
  let firstRun = true;
  const addLeftClickEvent = () => {
    const board = domService.getBoard();
    if (board === null)
      return false;
    board.addEventListener("click", () => {
      squareService.clearSquare(board);
      displayMoveService.clearMoves();
    });
    return true;
  };
  const addRightClickEvent = () => {
    if (firstRun) {
      configService.init();
      firstRun = false;
    }
    const board = domService.getBoard();
    if (board === null)
      return false;
    board.addEventListener("contextmenu", (e) => {
      squareService.clearSquare(board);
      displayMoveService.clearMoves();
      const target = e.target;
      const metaData = squareService.getMetaDataForSquare(target);
      if (metaData === null)
        return;
      const moves2 = chessMoves[metaData.type];
      const possibleMoves = squareService.getPossibleMoveSquares(
        moves2,
        metaData
      );
      displayMoveService.addMoves(possibleMoves);
      displayService.displayMoves();
    });
    return true;
  };
  const eventService = { addLeftClickEvent, addRightClickEvent };
  const main = () => {
    try {
      const leftClickSuccess = eventService.addLeftClickEvent();
      const rightClickSuccess = eventService.addRightClickEvent();
      if (!leftClickSuccess || !rightClickSuccess)
        return false;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  const IS_TM_SCRIPT = document.readyState === "interactive";
  const TIMEOUT_BEFORE_START = 2e3;
  const init = () => {
    let success = true;
    try {
      success = main();
    } catch (error) {
      console.error(error);
      success = false;
    }
    if (success) {
      console.log("%c Chess helper initialized!", "color: lightgreen");
    } else {
      console.error("%c Failed to initialize application", "color: lightred");
    }
  };
  const run = () => {
    console.log("%c Chess helper starting...", "color: lightblue");
    const boardExists = domService.getBoard();
    if (boardExists) {
      init();
      return;
    }
    console.log("%c Board not found, waiting...", "color: lightblue");
    const startup = setInterval(() => {
      const correctBoard = domService.getBoard();
      if (correctBoard) {
        clearInterval(startup);
        init();
      }
    }, TIMEOUT_BEFORE_START);
  };
  if (IS_TM_SCRIPT) {
    window.onload = () => {
      setTimeout(run, TIMEOUT_BEFORE_START);
    };
  } else {
    run();
  }
})();
