// ==UserScript==
// @name         AutoCookie2 Upgrade Details
// @namespace    https://xvicario.us/scripts/
// @version      0.1
// @description  Definitions for Cookie Cliker's Upgrades
// @author       Brian Maurer aka XVicarious
// @match        http://orteil.dashnet.org/cookieclicker/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    Game.upgradeDetails = [
      [[0], [0, 1, 2], 2], // Cursor
      [[0], [3], [function() {
        return Game.objectIncreasedBy(0, 0.1);
      }]],
      [[0], [4], [function() {
        return Game.objectIncreasedBy(0, 0.5);
      }]],
      [[0], [5], [function() {
        return Game.objectIncreasedBy(0, 5);
      }]],
      [[0], [6], [function() {
        return Game.objectIncreasedBy(0, 50);
      }]],
      [[0], [43], [function() {
        return Game.objectIncreasedBy(0, 500);
      }]],
      [[0], [82], [function() {
        return Game.objectIncreasedBy(0, 5000);
      }]],
      [[0], [109], [function() {
        return Game.objectIncreasedBy(0, 50000);
      }]],
      [[0], [188], [function() {
        return Game.objectIncreasedBy(0, 500000);
      }]],
      [[0], [189], [function() {
        return Game.objectIncreasedBy(0, 5000000);
      }]],
      [[1], [7, 8, 9, 44, 110, 192, 294, 397, 428], [2]], // Grandma
      [[2], [10, 11, 12, 45, 111, 193, 295, 308, 429], [2]], // Farm
      [[3], [16, 17, 18, 47, 113, 195, 296, 309, 430], [2]], // Mine
      [[4], [13, 14, 15, 46, 112, 194, 297, 310, 431], [2]], // Factory
      [[5], [232, 233, 234, 235, 236, 237, 298, 311, 432], [2]], // Bank
      [[6], [238, 239, 240, 241, 242, 243, 299, 312, 433], [2]], // Temple
      [[7], [244, 245, 246, 247, 248, 249, 300, 313, 434], [2]], // Wizard Tower
      [[8], [19, 20, 21, 48, 114, 196, 301, 314, 435], [2]], // Shipment
      [[9], [22, 23, 24, 49, 115, 197, 302, 315, 436], [2]], // Alchemy Lab
      [[10], [25, 26, 27, 50, 116, 198, 303, 316, 437], [2]], // Portal
      [[11], [28, 29, 30, 51, 117, 199, 304, 317, 438], [2]], // Time Machine
      [[12], [99, 100, 101, 118, 200, 305, 318, 439], [2]], // Antimatter Condenser
      [[13], [175, 176, 177, 178, 179, 201, 306, 319, 440], [2]], // Prism
      [[14], [416, 417, 418, 419, 420, 421, 422, 423, 441], [2]], // Chancemaker
      [[-1], [33, 34, 35, 36, 37], [function() { // Global
        return 0.01 / Game.globalCpsMult + 1;
      }]],
      [[-1], [38, 39, 40, 41, 42, 80, 81, 88, 89, 90, 104, 105, 106, 107, 150,
              151, 92, 93, 94, 95, 96, 97, 98, 125, 126, 127, 128, 344, 134,
              135, 136, 137, 138, 139, 140, 143, 144, 145, 146, 147, 148, 149,
              169, 170, 171, 172, 173, 174], [function() {
        return 0.02 / Game.globalCpsMult + 1;
      }]],
      [[-1], [258, 259, 260, 261, 262, 263, 120, 121, 122, 123, 401, 402, 202,
              203, 204, 205, 206, 207, 230, 231], [function() {
        return 0.03 / Game.globalCpsMult + 1;
      }]],
      [[-1], [256, 257, 338, 339, 340, 341, 342, 343, 350, 351, 352, 403, 404,
              405, 406, 407, 345, 346, 347, 348, 349], [function() {
        return 0.04 / Game.globalCpsMult + 1;
      }]],
      [[-1], [330], [function() {
        return 0.05 / Game.globalCpsMult + 1;
      }]],
      [[-1], [334, 335, 336, 337, 400], [function() {
        return 0.1 / Game.globalCpsMult + 1;
      }]],
      [[1, 2], [57], [2, function() {
        return (Game.ObjectsById[2].storedCps * Game.ObjectsById[1].amount) / 10000 + 1;
      }]],
      [[1, 3], [58], [2, function() {
        return (Game.ObjectsById[3].storedCps * Game.ObjectsById[1].amount) / 20000 + 1;
      }]],
      [[1, 4], [59], [2, function() {
        return (Game.ObjectsById[4].storedCps * Game.ObjectsById[1].amount) / 30000 + 1;
      }]],
      [[1, 5], [250], [2, function() {
        return (Game.ObjectsById[5].storedCps * Game.ObjectsById[1].amount) / 40000 + 1;
      }]],
      [[1, 6], [251], [2, function() {
        return (Game.ObjectsById[6].storedCps * Game.ObjectsById[1].amount) / 50000 + 1;
      }]],
      [[1, 7], [252], [2, function() {
        return (Game.ObjectsById[7].storedCps * Game.ObjectsById[1].amount) / 60000 + 1;
      }]],
      [[1, 8], [60], [2, function() {
        return (Game.ObjectsById[8].storedCps * Game.ObjectsById[1].amount) / 70000 + 1;
      }]],
      [[1, 9], [61], [2, function() {
        return (Game.ObjectsById[9].storedCps * Game.ObjectsById[1].amount) / 80000 + 1;
      }]],
      [[1, 10], [62], [2, function() {
        return (Game.ObjectsById[10].storedCps * Game.ObjectsById[1].amount) / 90000 + 1;
      }]],
      [[1, 11], [63], [2, function() {
        return (Game.ObjectsById[11].storedCps * Game.ObjectsById[1].amount) / 100000 + 1;
      }]],
      [[1, 12], [103], [2, function() {
        return (Game.ObjectsById[12].storedCps * Game.ObjectsById[1].amount) / 110000 + 1;
      }]],
      [[1, 13], [180], [2, function() {
        return (Game.ObjectsById[13].storedCps * Game.ObjectsById[1].amount) / 120000 + 1;
      }]],
      [[1, 14], [415], [2, function() {
        return (Game.ObjectsById[14].storedCps * Game.ObjectsById[1].amount) / 130000 + 1;
      }]],
      [[2, 11], [0], [function() {
        return (Game.ObjectsById[2].storedCps * Game.ObjectsById[11].amount) / 10000 + 1;
      }]],
      [[-1], [31], [function() {
        return 0.1 * Game.milkProgress + 1;
      }]],
      [[-1], [32], [function() {
        return 0.125 * Game.milkProgress + 1;
      }]],
      [[-1], [54], [function() {
        return 0.15 * Game.milkProgress + 1;
      }]],
      [[-1], [108], [function() {
        return 0.175 * Game.milkProgress + 1;
      }]],
      [[-1], [187, 320, 321, 322, 425, 442], [function() {
        return 0.2 * Game.milkProgress + 1;
      }]],
    ];
})();