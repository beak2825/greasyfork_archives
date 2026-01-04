// ==UserScript==
// @name         FlopMaster
// @namespace    https://greasyfork.org/en/users/1469540-davrone
// @version      1.0
// @description  Poker odds assistant
// @author       Davrone
// @match        https://www.torn.com/page.php?sid=holdem
// @run-at       document-body
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535875/FlopMaster.user.js
// @updateURL https://update.greasyfork.org/scripts/535875/FlopMaster.meta.js
// ==/UserScript==

function debugBindErrors(methods) {
  for (let method of methods) {
    console.log(`Testing method: ${method}`);
    try {
      if (this[method] === undefined) {
        console.error(`Method ${method} is undefined!`);
      }
    } catch (e) {
      console.error(`Error checking method ${method}:`, e);
    }
  }
}

let GM_addStyle = function(s) {
    let style = document.createElement("style");
    style.type = "text/css";
    style.textContent = s;
    document.head.appendChild(style);
}

class FloatingSuits {
    constructor(container, options = {}) {
        this.container = container;
        this.suits = [];
        this.options = {
            suitCount: options.suitCount || 30,
            minSize: options.minSize || 16,
            maxSize: options.maxSize || 35,
            minSpeed: options.minSpeed || 20,
            maxSpeed: options.maxSpeed || 60,
            minSwayAmount: options.minSwayAmount || 10,
            maxSwayAmount: options.maxSwayAmount || 40,
            minSwayTime: options.minSwayTime || 2,
            maxSwayTime: options.maxSwayTime || 6
        };

        this.suitSymbols = ['♠', '♥', '♦', '♣'];
        this.suitClasses = ['spades', 'hearts', 'diamonds', 'clubs'];
        this.running = false;
        this.suitElements = [];

        this.init();
    }

    init() {

        this.container.innerHTML = '';
        this.suitElements = [];

        const rect = this.container.getBoundingClientRect();

        for (let i = 0; i < this.options.suitCount; i++) {
            this.createSuit(rect, true);
        }
    }

    createSuit(rect, initial = false) {
        const suitIndex = Math.floor(Math.random() * this.suitSymbols.length);
        const size = Math.floor(Math.random() * (this.options.maxSize - this.options.minSize)) + this.options.minSize;

        const suitElement = document.createElement('div');
        suitElement.className = `floating-suit ${this.suitClasses[suitIndex]}`;
        suitElement.textContent = this.suitSymbols[suitIndex];
        suitElement.style.fontSize = `${size}px`;

        if (Math.random() < 0.2) {
            suitElement.classList.add('gold');
        }

        const x = Math.random() * (rect.width - size);
        const y = initial ? Math.random() * rect.height : -size;

        suitElement.style.left = `${x}px`;
        suitElement.style.top = `${y}px`;

        this.container.appendChild(suitElement);

        const speed = this.options.minSpeed + Math.random() * (this.options.maxSpeed - this.options.minSpeed);
        const sway = this.options.minSwayAmount + Math.random() * (this.options.maxSwayAmount - this.options.minSwayAmount);
        const swayTime = this.options.minSwayTime + Math.random() * (this.options.maxSwayTime - this.options.minSwayTime);
        const rotation = Math.random() * 360;
        const rotationSpeed = (Math.random() - 0.5) * 2;

        suitElement.style.transform = `rotate(${rotation}deg)`;

        this.suitElements.push({
            element: suitElement,
            x: x,
            y: y,
            speed: speed,
            sway: sway,
            swayTime: swayTime,
            swayOffset: Math.random() * Math.PI * 2, // Random starting point
            rotation: rotation,
            rotationSpeed: rotationSpeed,
            size: size
        });

        return this.suitElements[this.suitElements.length - 1];
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.lastTime = performance.now();
            requestAnimationFrame(this.update.bind(this));
        }
    }

    stop() {
        this.running = false;
    }

    update(timestamp) {
        if (!this.running) return;

        const deltaTime = (timestamp - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = timestamp;

        const rect = this.container.getBoundingClientRect();

        for (let i = this.suitElements.length - 1; i >= 0; i--) {
            const suit = this.suitElements[i];

            suit.y += suit.speed * deltaTime;

            const swayX = Math.sin((timestamp / 1000 / suit.swayTime) + suit.swayOffset) * suit.sway;
            suit.x = Math.max(0, Math.min(rect.width - suit.size, suit.x + (swayX * deltaTime)));

            suit.rotation += suit.rotationSpeed * deltaTime * 20;

            suit.element.style.transform = `rotate(${suit.rotation}deg)`;
            suit.element.style.left = `${suit.x}px`;
            suit.element.style.top = `${suit.y}px`;

            if (suit.y > rect.height) {
                suit.element.remove();
                this.suitElements.splice(i, 1);

                this.createSuit(rect);
            }
        }

        requestAnimationFrame(this.update.bind(this));
    }

    setDensity(count) {
        const rect = this.container.getBoundingClientRect();
        const currentCount = this.suitElements.length;

        if (count > currentCount) {

            for (let i = 0; i < count - currentCount; i++) {
                this.createSuit(rect);
            }
        } else if (count < currentCount) {

            const toRemove = currentCount - count;
            for (let i = 0; i < toRemove; i++) {
                if (this.suitElements.length > 0) {
                    const index = Math.floor(Math.random() * this.suitElements.length);
                    this.suitElements[index].element.remove();
                    this.suitElements.splice(index, 1);
                }
            }
        }

        this.options.suitCount = count;
    }
}

class PokerCalculatorModule {
    constructor() {
    this.debugMode = false;
    this.lastProcessTime = 0;
    this.processingThrottle = 1500;
    this.lastUpdateTime = 0;
    this.renderDelayTime = 500;

    this.upgradesToShow = 10;
    this.lastLength = 0;
    this.isHandActive = false;
    this.opponentStats = new Map();

    this.preflopStats = {
        'AA': { wins: 85.2, ties: 0.5, total: 85.2 },
        'KK': { wins: 82.4, ties: 0.5, total: 82.4 },
        'QQ': { wins: 80.0, ties: 0.5, total: 80.0 },
        'JJ': { wins: 77.5, ties: 0.5, total: 77.5 },
        'TT': { wins: 75.1, ties: 0.5, total: 75.1 },
        '99': { wins: 72.1, ties: 0.5, total: 72.1 },
        '88': { wins: 69.1, ties: 0.5, total: 69.1 },
        '77': { wins: 66.2, ties: 0.5, total: 66.2 },
        '66': { wins: 63.3, ties: 0.5, total: 63.3 },
        '55': { wins: 60.3, ties: 0.5, total: 60.3 },
        '44': { wins: 57.0, ties: 0.5, total: 57.0 },
        '33': { wins: 53.7, ties: 0.5, total: 53.7 },
        '22': { wins: 50.3, ties: 0.5, total: 50.3 },

        'AKs': { wins: 66.1, ties: 0.9, total: 67.0 },
        'AQs': { wins: 65.3, ties: 0.8, total: 66.1 },
        'AJs': { wins: 64.6, ties: 0.8, total: 65.4 },
        'ATs': { wins: 63.9, ties: 0.8, total: 64.7 },
        'A9s': { wins: 62.3, ties: 0.7, total: 63.0 },
        'A8s': { wins: 61.4, ties: 0.7, total: 62.1 },
        'A7s': { wins: 60.4, ties: 0.7, total: 61.1 },
        'A6s': { wins: 59.3, ties: 0.7, total: 60.0 },
        'A5s': { wins: 59.2, ties: 0.7, total: 59.9 },
        'A4s': { wins: 58.5, ties: 0.7, total: 59.2 },
        'A3s': { wins: 57.8, ties: 0.7, total: 58.5 },
        'A2s': { wins: 57.1, ties: 0.7, total: 57.8 },

        'AK': { wins: 64.5, ties: 0.9, total: 65.4 },
        'AQ': { wins: 63.6, ties: 0.9, total: 64.5 },
        'AJ': { wins: 62.7, ties: 0.9, total: 63.6 },
        'AT': { wins: 62.0, ties: 0.9, total: 62.9 },
        'A9': { wins: 60.2, ties: 0.9, total: 61.1 },
        'A8': { wins: 59.2, ties: 0.9, total: 60.1 },
        'A7': { wins: 58.2, ties: 0.9, total: 59.1 },
        'A6': { wins: 57.1, ties: 0.9, total: 58.0 },
        'A5': { wins: 56.8, ties: 0.9, total: 57.7 },
        'A4': { wins: 56.2, ties: 0.9, total: 57.1 },
        'A3': { wins: 55.5, ties: 0.9, total: 56.4 },
        'A2': { wins: 54.7, ties: 0.9, total: 55.6 },

        'KQs': { wins: 62.5, ties: 0.9, total: 63.4 },
        'KJs': { wins: 61.7, ties: 0.9, total: 62.6 },
        'KTs': { wins: 60.9, ties: 0.9, total: 61.8 },
        'K9s': { wins: 59.1, ties: 0.9, total: 60.0 },
        'K8s': { wins: 57.6, ties: 0.9, total: 58.5 },
        'K7s': { wins: 56.9, ties: 0.9, total: 57.8 },
        'K6s': { wins: 55.9, ties: 0.9, total: 56.8 },
        'K5s': { wins: 55.1, ties: 0.9, total: 56.0 },
        'K4s': { wins: 54.3, ties: 0.9, total: 55.2 },
        'K3s': { wins: 53.6, ties: 0.9, total: 54.5 },
        'K2s': { wins: 52.9, ties: 0.9, total: 53.8 },

        'KQ': { wins: 60.9, ties: 0.9, total: 61.8 },
        'KJ': { wins: 60.0, ties: 0.9, total: 60.9 },
        'KT': { wins: 59.1, ties: 0.9, total: 60.0 },
        'K9': { wins: 57.3, ties: 0.9, total: 58.2 },
        'K8': { wins: 55.9, ties: 0.9, total: 56.8 },
        'K7': { wins: 55.1, ties: 0.9, total: 56.0 },
        'K6': { wins: 54.1, ties: 0.9, total: 55.0 },
        'K5': { wins: 53.3, ties: 0.9, total: 54.2 },
        'K4': { wins: 52.5, ties: 0.9, total: 53.4 },
        'K3': { wins: 51.7, ties: 0.9, total: 52.6 },
        'K2': { wins: 51.0, ties: 0.9, total: 51.9 },

        'QJs': { wins: 59.4, ties: 0.9, total: 60.3 },
        'QTs': { wins: 58.6, ties: 0.9, total: 59.5 },
        'Q9s': { wins: 56.7, ties: 0.9, total: 57.6 },
        'Q8s': { wins: 55.3, ties: 0.9, total: 56.2 },
        'Q7s': { wins: 54.2, ties: 0.9, total: 55.1 },
        'Q6s': { wins: 53.4, ties: 0.9, total: 54.3 },
        'Q5s': { wins: 52.6, ties: 0.9, total: 53.5 },
        'Q4s': { wins: 51.7, ties: 0.9, total: 52.6 },
        'Q3s': { wins: 51.0, ties: 0.9, total: 51.9 },
        'Q2s': { wins: 50.3, ties: 0.9, total: 51.2 },

        'QJ': { wins: 57.6, ties: 0.9, total: 58.5 },
        'QT': { wins: 56.8, ties: 0.9, total: 57.7 },
        'Q9': { wins: 55.0, ties: 0.9, total: 55.9 },
        'Q8': { wins: 53.5, ties: 0.9, total: 54.4 },
        'Q7': { wins: 52.3, ties: 0.9, total: 53.2 },
        'Q6': { wins: 51.5, ties: 0.9, total: 52.4 },
        'Q5': { wins: 50.7, ties: 0.9, total: 51.6 },
        'Q4': { wins: 49.8, ties: 0.9, total: 50.7 },
        'Q3': { wins: 49.1, ties: 0.9, total: 50.0 },
        'Q2': { wins: 48.4, ties: 0.9, total: 49.3 },

        'JTs': { wins: 57.1, ties: 0.9, total: 58.0 },
        'J9s': { wins: 55.1, ties: 0.9, total: 56.0 },
        'J8s': { wins: 53.7, ties: 0.9, total: 54.6 },
        'J7s': { wins: 52.1, ties: 0.9, total: 53.0 },
        'J6s': { wins: 51.0, ties: 0.9, total: 51.9 },
        'J5s': { wins: 50.1, ties: 0.9, total: 51.0 },
        'J4s': { wins: 49.2, ties: 0.9, total: 50.1 },
        'J3s': { wins: 48.5, ties: 0.9, total: 49.4 },
        'J2s': { wins: 47.8, ties: 0.9, total: 48.7 },

        'JT': { wins: 55.3, ties: 0.9, total: 56.2 },
        'J9': { wins: 53.2, ties: 0.9, total: 54.1 },
        'J8': { wins: 51.7, ties: 0.9, total: 52.6 },
        'J7': { wins: 50.5, ties: 0.9, total: 51.4 },
        'J6': { wins: 49.2, ties: 0.9, total: 50.1 },
        'J5': { wins: 48.3, ties: 0.9, total: 49.2 },
        'J4': { wins: 47.4, ties: 0.9, total: 48.3 },
        'J3': { wins: 46.7, ties: 0.9, total: 47.6 },
        'J2': { wins: 46.0, ties: 0.9, total: 46.9 },

        'T9s': { wins: 53.4, ties: 0.9, total: 54.3 },
        'T8s': { wins: 51.9, ties: 0.9, total: 52.8 },
        'T7s': { wins: 50.5, ties: 0.9, total: 51.4 },
        'T6s': { wins: 49.0, ties: 0.9, total: 49.9 },
        'T5s': { wins: 48.0, ties: 0.9, total: 48.9 },
        'T4s': { wins: 47.1, ties: 0.9, total: 48.0 },
        'T3s': { wins: 46.4, ties: 0.9, total: 47.3 },
        'T2s': { wins: 45.7, ties: 0.9, total: 46.6 },

        'T9': { wins: 51.4, ties: 0.9, total: 52.3 },
        'T8': { wins: 49.9, ties: 0.9, total: 50.8 },
        'T7': { wins: 48.6, ties: 0.9, total: 49.5 },
        'T6': { wins: 47.3, ties: 0.9, total: 48.2 },
        'T5': { wins: 46.1, ties: 0.9, total: 47.0 },
        'T4': { wins: 45.2, ties: 0.9, total: 46.1 },
        'T3': { wins: 44.5, ties: 0.9, total: 45.4 },
        'T2': { wins: 43.8, ties: 0.9, total: 44.7 },

        '98s': { wins: 51.4, ties: 0.9, total: 52.3 },
        '97s': { wins: 49.9, ties: 0.9, total: 50.8 },
        '96s': { wins: 48.4, ties: 0.9, total: 49.3 },
        '95s': { wins: 46.9, ties: 0.9, total: 47.8 },
        '94s': { wins: 46.0, ties: 0.9, total: 46.9 },
        '93s': { wins: 45.3, ties: 0.9, total: 46.2 },
        '92s': { wins: 44.6, ties: 0.9, total: 45.5 },

        '98': { wins: 48.1, ties: 0.9, total: 49.0 },
        '97': { wins: 46.9, ties: 0.9, total: 47.8 },
        '96': { wins: 45.5, ties: 0.9, total: 46.4 },
        '95': { wins: 44.2, ties: 0.9, total: 45.1 },
        '94': { wins: 43.3, ties: 0.9, total: 44.2 },
        '93': { wins: 42.6, ties: 0.9, total: 43.5 },
        '92': { wins: 41.9, ties: 0.9, total: 42.8 },

        '87s': { wins: 49.0, ties: 0.9, total: 49.9 },
        '86s': { wins: 47.5, ties: 0.9, total: 48.4 },
        '85s': { wins: 46.1, ties: 0.9, total: 47.0 },
        '84s': { wins: 45.0, ties: 0.9, total: 45.9 },
        '83s': { wins: 44.3, ties: 0.9, total: 45.2 },
        '82s': { wins: 43.6, ties: 0.9, total: 44.5 },

        '87': { wins: 46.1, ties: 0.9, total: 47.0 },
        '86': { wins: 44.4, ties: 0.9, total: 45.3 },
        '85': { wins: 43.2, ties: 0.9, total: 44.1 },
        '84': { wins: 42.1, ties: 0.9, total: 43.0 },
        '83': { wins: 41.4, ties: 0.9, total: 42.3 },
        '82': { wins: 40.7, ties: 0.9, total: 41.6 },

        '76s': { wins: 46.4, ties: 0.9, total: 47.3 },
        '75s': { wins: 44.9, ties: 0.9, total: 45.8 },
        '74s': { wins: 43.7, ties: 0.9, total: 44.6 },
        '73s': { wins: 43.0, ties: 0.9, total: 43.9 },
        '72s': { wins: 42.3, ties: 0.9, total: 43.2 },

        '76': { wins: 43.6, ties: 0.9, total: 44.5 },
        '75': { wins: 41.8, ties: 0.9, total: 42.7 },
        '74': { wins: 40.7, ties: 0.9, total: 41.6 },
        '73': { wins: 40.0, ties: 0.9, total: 40.9 },
        '72': { wins: 39.3, ties: 0.9, total: 40.2 },

        '65s': { wins: 44.1, ties: 0.9, total: 45.0 },
        '64s': { wins: 42.8, ties: 0.9, total: 43.7 },
        '63s': { wins: 42.2, ties: 0.9, total: 43.1 },
        '62s': { wins: 41.5, ties: 0.9, total: 42.4 },

        '65': { wins: 41.0, ties: 0.9, total: 41.9 },
        '64': { wins: 39.9, ties: 0.9, total: 40.8 },
        '63': { wins: 39.2, ties: 0.9, total: 40.1 },
        '62': { wins: 38.5, ties: 0.9, total: 39.4 },

        '54s': { wins: 42.3, ties: 0.9, total: 43.2 },
        '53s': { wins: 41.7, ties: 0.9, total: 42.6 },
        '52s': { wins: 41.0, ties: 0.9, total: 41.9 },

        '54': { wins: 39.4, ties: 0.9, total: 40.3 },
        '53': { wins: 38.7, ties: 0.9, total: 39.6 },
        '52': { wins: 38.0, ties: 0.9, total: 38.9 },

        '43s': { wins: 40.9, ties: 0.9, total: 41.8 },
        '42s': { wins: 40.2, ties: 0.9, total: 41.1 },

        '43': { wins: 37.7, ties: 0.9, total: 38.6 },
        '42': { wins: 37.0, ties: 0.9, total: 37.9 },

        '32s': { wins: 39.4, ties: 0.9, total: 40.3 },
        '32': { wins: 36.3, ties: 0.9, total: 37.2 }
    };

    this.lastBetAmount = 0;
    this.lastRecommendation = "";
    this.lastPlayerDecision = null;
    this.lastCommunityCount = 0;
    this.messageBoxObserverStarted = false;

    this.lastUpdateCall = 0;

    this.history = {
        correctRecommendations: 0,
        totalHands: 0,
        adjustThresholds() {
            if (this.totalHands > 0) {
                const successRate = this.correctRecommendations / this.totalHands;
                if (successRate < 0.5) {
                    this.raiseThreshold -= 5;
                    this.foldThreshold += 5;
                } else if (successRate > 0.7) {
                    this.raiseThreshold += 5;
                    this.foldThreshold -= 5;
                }
            }
        }
    };

    this.addStyle();

    try {
        const savedOpponents = localStorage.getItem('pokerHelperOpponentStats');
        if (savedOpponents) {
            this.opponentStats = new Map(JSON.parse(savedOpponents));
        }
    } catch (e) {
        console.error("Failed to load saved data:", e);
    }

    this.update = this.update.bind(this);
    this.detectHandEnd = this.detectHandEnd.bind(this);
}

    update() {
        const now = Date.now();
        if (this.lastUpdateTime && now - this.lastUpdateTime < 1000) {
            setTimeout(this.update.bind(this), 1000);
            return;
        }
        this.lastUpdateTime = now;

        let allCards = this.getFullDeck();
        let knownCards = Array.from(document.querySelectorAll("[class*='flipper___'] > div[class*='front___'] > div")).map(e => {
            var card = (e.classList[1] || "null-0").split("_")[0]
                .replace("-A", "-14")
                .replace("-K", "-13")
                .replace("-Q", "-12")
                .replace("-J", "-11");
            if (card == "cardSize") card = "null-0";
            return card;
        });

        let communityCards = knownCards.slice(0, 5);
        let communityCardsCount = communityCards.filter(e => !e.includes("null")).length;
        let isPreFlop = communityCardsCount === 0;

        allCards = this.filterDeck(allCards, communityCards.filter(e => !e.includes("null")));

        if (knownCards.filter(e => !e.includes("null")).length === 0 && communityCardsCount === 0) {
            if (this.isHandActive) {
                this.detectHandEnd();
                this.isHandActive = false;
                document.getElementById("pokerCalc-action").textContent = "Waiting for cards...";
                document.querySelector("#pokerCalc-myHand tbody").innerHTML = "";
                document.querySelector("#pokerCalc-upgrades tbody").innerHTML = "";
                document.querySelector("#pokerCalc-oppPossHands tbody").innerHTML = "";
                document.querySelector("#pokerCalc-preflop tbody").innerHTML = "";

                document.getElementById("pokerCalc-preflop").style.display = "none";
                document.getElementById("pokerCalc-myHand").style.display = "table";
                document.getElementById("pokerCalc-upgrades").style.display = "table";
                document.getElementById("pokerCalc-oppPossHands").style.display = "table";
            }
            setTimeout(this.update.bind(this), 1000);
            return;
        } else {
            this.isHandActive = true;
        }

        if (JSON.stringify(knownCards).length != this.lastLength || communityCardsCount !== this.lastCommunityCount) {
            this.lastCommunityCount = communityCardsCount;

            document.querySelector("#pokerCalc-myHand tbody").innerHTML = "";
            document.querySelector("#pokerCalc-upgrades tbody").innerHTML = "";
            document.querySelector("#pokerCalc-oppPossHands tbody").innerHTML = "";
            document.querySelector("#pokerCalc-preflop tbody").innerHTML = "";

            if (isPreFlop) {
                document.getElementById("pokerCalc-preflop").style.display = "table";
                document.getElementById("pokerCalc-myHand").style.display = "none";
                document.getElementById("pokerCalc-upgrades").style.display = "none";
                document.getElementById("pokerCalc-oppPossHands").style.display = "none";

                this.processPreFlopStats();
            } else {
                document.getElementById("pokerCalc-preflop").style.display = "none";
                document.getElementById("pokerCalc-myHand").style.display = "table";
                document.getElementById("pokerCalc-upgrades").style.display = "table";
                document.getElementById("pokerCalc-oppPossHands").style.display = "table";
                this.processPostFlopStats(knownCards, communityCards, allCards);
            }

            this.lastLength = JSON.stringify(knownCards).length;
        }

        setTimeout(this.update.bind(this), 1000);
    }

    detectHandEnd() {
        this.lastBetAmount = 0;
        this.lastRecommendation = "";
    }

    calculatePreFlopPotential(holeCards, handNotation) {
        const card1Value = parseInt(holeCards[0].split("-")[1]);
        const card2Value = parseInt(holeCards[1].split("-")[1]);
        const hasPair = card1Value === card2Value;
        const isSuited = handNotation.endsWith('s');

        let pairChance = hasPair ? 100 : 32;
        let twoPairChance = 0;
        let tripsChance = hasPair ? 12 : 0;
        let fullHouseChance = 0;
        let straightChance = 0;
        let flushChance = 0;
        let quadsChance = hasPair ? 3 : 0;
        let straightFlushChance = 0;
        let royalFlushChance = 0;

        if (!hasPair) {
            const card1Rank = card1Value;
            const card2Rank = card2Value;
            const gap = Math.abs(card1Rank - card2Rank);

            twoPairChance = 4;

            if (gap <= 4) {
                straightChance = 12 - (gap * 2);
            }

            if (isSuited) {
                flushChance = 6;

                if (gap <= 4) {
                    straightFlushChance = 0.5;

                    if (card1Rank >= 10 && card2Rank >= 10) {
                        royalFlushChance = 0.2;
                    }
                }
            }
        }

        return {
            pairChance,
            twoPairChance,
            tripsChance,
            fullHouseChance,
            straightChance,
            flushChance,
            quadsChance,
            straightFlushChance,
            royalFlushChance
        };
    }

    calculateDrawPotential(holeCards, communityCards) {
        const allCards = [...holeCards, ...communityCards].filter(c => !c.includes("null"));

        let pairChance = 0;
        let twoPairChance = 0;
        let tripsChance = 0;
        let fullHouseChance = 0;
        let straightChance = 0;
        let flushChance = 0;
        let quadsChance = 0;
        let straightFlushChance = 0;
        let royalFlushChance = 0;

        if (allCards.length < 2) return {
            pairChance, twoPairChance, tripsChance, fullHouseChance,
            straightChance, flushChance, quadsChance, straightFlushChance, royalFlushChance
        };

        const ranks = allCards.map(card => parseInt(card.split("-")[1]));
        const suits = allCards.map(card => card.split("-")[0]);

        const rankCounts = {};
        ranks.forEach(rank => {
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        });

        const suitCounts = {};
        suits.forEach(suit => {
            suitCounts[suit] = (suitCounts[suit] || 0) + 1;
        });

        const handObject = this.makeHandObject(allCards);
        const hasPair = this.hasPair(allCards, handObject);
        const hasTwoPair = this.hasTwoPairs(allCards, handObject);
        const hasTrips = this.hasThreeOfAKind(allCards, handObject);
        const hasQuads = this.hasFourOfAKind(allCards, handObject);
        const hasFullHouse = this.hasFullHouse(allCards, handObject);
        const hasStraight = this.hasStraight(allCards, handObject);
        const hasFlush = this.hasFlush(allCards, handObject);
        const hasStraightFlush = this.hasStraightFlush(allCards, handObject);
        const hasRoyalFlush = this.hasRoyalFlush(allCards, handObject);

        if (hasPair) pairChance = 100;
        if (hasTwoPair) twoPairChance = 100;
        if (hasTrips) tripsChance = 100;
        if (hasQuads) quadsChance = 100;
        if (hasFullHouse) fullHouseChance = 100;
        if (hasStraight) straightChance = 100;
        if (hasFlush) flushChance = 100;
        if (hasStraightFlush) straightFlushChance = 100;
        if (hasRoyalFlush) royalFlushChance = 100;

        const communityCount = communityCards.filter(c => !c.includes("null")).length;
        const cardsToBeDealt = 5 - communityCount;

        if (cardsToBeDealt > 0 && !hasRoyalFlush) {
            if (!hasPair && !hasTwoPair && !hasTrips) {
                const pairOptions = Object.values(rankCounts).filter(count => count === 1).length;
                pairChance = Math.min(100, (pairOptions * 3 * cardsToBeDealt / 47) * 100);
            }

            if (hasPair && !hasTwoPair && !hasFullHouse) {
                const unpaired = ranks.filter(rank => rankCounts[rank] === 1);
                twoPairChance = Math.min(100, (unpaired.length * 3 * cardsToBeDealt / 47) * 100);
            }

            if ((hasPair || hasTwoPair) && !hasTrips) {
                const pairRanks = Object.entries(rankCounts)
                    .filter(([rank, count]) => count === 2)
                    .map(([rank]) => parseInt(rank));

                if (pairRanks.length > 0) {
                    tripsChance = Math.min(100, (pairRanks.length * 2 * cardsToBeDealt / 47) * 100);
                }
            }

            if (hasTrips && !hasQuads) {
                const tripRanks = Object.entries(rankCounts)
                    .filter(([rank, count]) => count === 3)
                    .map(([rank]) => parseInt(rank));

                if (tripRanks.length > 0) {
                    quadsChance = Math.min(100, (tripRanks.length * cardsToBeDealt / 47) * 100);
                }
            }

            if (hasTrips && !hasFullHouse) {
                const singleCards = Object.entries(rankCounts)
                    .filter(([rank, count]) => count === 1)
                    .length;

                fullHouseChance = Math.min(100, (singleCards * 3 * cardsToBeDealt / 47) * 100);
            } else if (hasTwoPair && !hasFullHouse) {
                fullHouseChance = Math.min(100, (4 * cardsToBeDealt / 47) * 100);
            }

            if (!hasStraight) {
                const uniqueRanks = [...new Set(ranks)].sort((a, b) => a - b);

                if (uniqueRanks.includes(14)) {
                    uniqueRanks.push(1);
                }

                let outCount = 0;

                for (let i = 0; i <= uniqueRanks.length - 4; i++) {
                    if (uniqueRanks[i+3] - uniqueRanks[i] <= 4) {
                        const gap = uniqueRanks[i+3] - uniqueRanks[i] - 3;
                        if (gap === 0) {
                            outCount = Math.max(outCount, 8);
                        } else if (gap === 1) {
                            outCount = Math.max(outCount, 4);
                        }
                    }
                }

                straightChance = Math.min(100, (outCount * cardsToBeDealt / 47) * 100);
            }

            if (!hasFlush) {
                const maxSuitCount = Math.max(...Object.values(suitCounts).map(count => count || 0));

                if (maxSuitCount >= 4) {
                    flushChance = Math.min(100, (9 * cardsToBeDealt / 47) * 100);
                } else if (maxSuitCount === 3 && communityCount <= 3) {
                    flushChance = Math.min(100, (cardsToBeDealt / 47) * 100);
                }
            }

            if (!hasStraightFlush && flushChance > 0 && straightChance > 0) {
                const flushSuit = Object.entries(suitCounts)
                    .filter(([suit, count]) => count >= 3)
                    .map(([suit]) => suit);

                if (flushSuit.length > 0) {
                    const suitedCards = allCards.filter(card => card.startsWith(flushSuit[0]));
                    const suitedRanks = suitedCards.map(card => parseInt(card.split("-")[1]));

                    const uniqueRanks = [...new Set(suitedRanks)].sort((a, b) => a - b);

                    for (let i = 0; i <= uniqueRanks.length - 3; i++) {
                        if (uniqueRanks[i+2] - uniqueRanks[i] <= 4) {
                            straightFlushChance = Math.min(100, (cardsToBeDealt / 47) * 25);

                            if (uniqueRanks.includes(10) && uniqueRanks.includes(11) &&
                                uniqueRanks.includes(12) && uniqueRanks.includes(13) &&
                                uniqueRanks.includes(14)) {
                                royalFlushChance = 100;
                            } else if (uniqueRanks.some(r => r >= 10) &&
                                      uniqueRanks.every(r => r <= 14)) {
                                royalFlushChance = Math.min(100, (cardsToBeDealt / 47) * 5);
                            }

                            break;
                        }
                    }
                }
            }
        }

        return {
            pairChance: Math.min(100, Math.max(0, Math.round(pairChance))),
            twoPairChance: Math.min(100, Math.max(0, Math.round(twoPairChance))),
            tripsChance: Math.min(100, Math.max(0, Math.round(tripsChance))),
            fullHouseChance: Math.min(100, Math.max(0, Math.round(fullHouseChance))),
            straightChance: Math.min(100, Math.max(0, Math.round(straightChance))),
            flushChance: Math.min(100, Math.max(0, Math.round(flushChance))),
            quadsChance: Math.min(100, Math.max(0, Math.round(quadsChance))),
            straightFlushChance: Math.min(100, Math.max(0, Math.round(straightFlushChance))),
            royalFlushChance: Math.min(100, Math.max(0, Math.round(royalFlushChance)))
        };
    }

    processPreFlopStats() {
        let playerNodes = document.querySelectorAll("[class*='playerMeGateway___']");
        if (!playerNodes || playerNodes.length === 0) return;

        let holeCards = Array.from(playerNodes[0].querySelectorAll("div[class*='front___'] > div")).map(e => {
            var card = (e.classList[1] || "null-0").split("_")[0]
                .replace("-A", "-14")
                .replace("-K", "-13")
                .replace("-Q", "-12")
                .replace("-J", "-11");
            if (card == "cardSize") card = "null-0";
            return card;
        }).filter(c => !c.includes("null"));

        if (holeCards.length !== 2) return;

        const card1 = this.convertToNotation(holeCards[0]);
        const card2 = this.convertToNotation(holeCards[1]);

        if (!card1 || !card2) return;

        const card1Value = parseInt(holeCards[0].split("-")[1]);
        const card2Value = parseInt(holeCards[1].split("-")[1]);
        const hasPair = card1Value === card2Value;

        const suited = holeCards[0].split("-")[0] === holeCards[1].split("-")[0];

        let handNotation;
        if (card1 === card2) {
            handNotation = card1 + card1;
        } else {
            const sortedCards = [card1, card2].sort((a, b) => {
                const values = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10 };
                const valA = values[a] || parseInt(a);
                const valB = values[b] || parseInt(b);
                return valB - valA;
            });

            handNotation = sortedCards[0] + sortedCards[1];
            if (suited) handNotation += 's';
        }

        const winEquity = this.calculatePreflopEquity(handNotation);

        const drawPotentials = this.calculatePreFlopPotential(holeCards, handNotation);

        this.updateProbabilityMeter(winEquity, drawPotentials);

        const handStats = this.preflopStats[handNotation];

        if (handStats) {
            const recommendation = this.getPreFlopRecommendation(handStats.total);
            const actionButton = document.getElementById("pokerCalc-action");
            actionButton.textContent = recommendation;

            actionButton.classList.remove("action-raise", "action-call", "action-fold");

            if (recommendation.includes("Raise")) {
                actionButton.classList.add("action-raise");
            } else if (recommendation.includes("Call")) {
                actionButton.classList.add("action-call");
            } else if (recommendation.includes("Fold")) {
                actionButton.classList.add("action-fold");
            }

            this.lastRecommendation = recommendation;

            let statsHTML = `<tr>
                <td>${handNotation}</td>
                <td>${handStats.wins.toFixed(2)}%</td>
                <td>${handStats.ties.toFixed(2)}%</td>
                <td>${handStats.total.toFixed(2)}%</td>
                <td>${this.getPreflopHandTier(handStats.total)}</td>
            </tr>`;

            document.querySelector("#pokerCalc-preflop tbody").innerHTML = statsHTML;
        } else {
            this.estimateHandStats(handNotation);
        }
    }

    processPostFlopStats(knownCards, communityCards, allCards) {
        let playerNodes = document.querySelectorAll("[class*='playerMeGateway___']");
        playerNodes.forEach(player => {
            let myCards = Array.from(player.querySelectorAll("div[class*='front___'] > div")).map(e => {
                var card = (e.classList[1] || "null-0").split("_")[0]
                    .replace("-A", "-14")
                    .replace("-K", "-13")
                    .replace("-Q", "-12")
                    .replace("-J", "-11");
                if (card == "cardSize") card = "null-0";
                return card;
            });

            let myHand = this.getHandScore(communityCards.concat(myCards));

            if (myHand.score > 0) {
                const drawPotentials = this.calculateDrawPotential(myCards, communityCards);

                let myRank = this.calculateHandRank(myHand, communityCards, allCards);

                const potSize = parseInt(document.querySelector(".pot-display")?.textContent || 0);
                const betToCall = parseInt(document.querySelector(".bet-to-call")?.textContent || 0);
                const potOdds = betToCall / (potSize + betToCall);
                const recommendation = this.getRecommendation(myRank.topNumber, potOdds);

                const actionButton = document.getElementById("pokerCalc-action");
                actionButton.textContent = recommendation;

                actionButton.classList.remove("action-raise", "action-call", "action-fold");

                if (recommendation.includes("Raise") || recommendation.includes("Bet")) {
                    actionButton.classList.add("action-raise");
                } else if (recommendation.includes("Call") || recommendation.includes("Check")) {
                    actionButton.classList.add("action-call");
                } else if (recommendation.includes("Fold")) {
                    actionButton.classList.add("action-fold");
                }

                this.lastRecommendation = recommendation;

                document.querySelector("#pokerCalc-myHand tbody").innerHTML += `<tr><td>Me</td><td>${myHand.description}</td><td>${myRank.rank}</td><td>${myRank.top}</td></tr>`;

                let myUpgrades = {};
                let bestOppHands = {};
                let additionalCards = [];
                let additionalOppCards = [];

                if (communityCards.filter(e => !e.includes("null")).length == 3) {
                    for (let a of allCards) {
                        for (let b of allCards) {
                            if (a > b) additionalCards.push([a, b]);
                        }
                    }
                } else if (communityCards.filter(e => !e.includes("null")).length == 4) {
                    for (let a of allCards) additionalCards.push([a]);
                } else if (communityCards.filter(e => !e.includes("null")).length == 5) {
                    for (let a of allCards) {
                        for (let b of allCards) {
                            if (a > b) additionalOppCards.push([a, b]);
                        }
                    }
                }

                for (let cards of additionalCards) {
                    let thisHand = this.getHandScore(communityCards.concat(cards).concat(myCards));
                    if (thisHand.score > myHand.score) {
                        let type = thisHand.description.split(":")[0];
                        if (thisHand.description.includes("Four of a kind") || thisHand.description.includes("Three of a kind") || thisHand.description.includes("Pair")) {
                            type += ": " + thisHand.description.split("</span>")[1].split("<span")[0].trim() + "s";
                        } else if (thisHand.description.includes("Full house")) {
                            type += ": " + thisHand.description.split("</span>")[1].split("<span")[0].trim() + "s full of " + thisHand.description.split("</span>").reverse()[0].split("</td>")[0] + "s";
                        } else if (thisHand.description.includes("Straight")) {
                            type += ": " + thisHand.description.split("</span>")[1].split("<span")[0].trim() + "-high";
                        } else if (thisHand.description.includes("Two pairs")) {
                            type += ": " + thisHand.description.split("</span>")[1].split("<span")[0].trim() + "s and " + thisHand.description.split("</span>")[3].split("<span")[0].trim() + "s";
                        }

                        if (!myUpgrades.hasOwnProperty(type)) {
                            myUpgrades[type] = { hand: thisHand, type: type, cards: cards, score: thisHand.score, duplicates: 0, chance: 0 };
                        }
                        myUpgrades[type].description = thisHand.description;
                        myUpgrades[type].duplicates++;
                    }
                }

                let topUpgrades = Object.values(myUpgrades).map(e => {
                    const chance = (e.duplicates / additionalCards.length) * 100;

                    const newCommunity = communityCards.concat(e.cards);
                    const remainingDeck = this.filterDeck(allCards, [...e.cards, ...myCards]);
                    const handRank = this.calculateHandRank(e.hand, newCommunity, remainingDeck);

                    return {
                        ...e,
                        chance: chance,
                        rank: handRank.rank || "N/A",
                        top: handRank.top || "N/A"
                    };
                });

                let aggregatedChances = {
                    pairChance: 0,
                    twoPairChance: 0,
                    tripsChance: 0,
                    fullHouseChance: 0,
                    straightChance: 0,
                    flushChance: 0,
                    quadsChance: 0,
                    straightFlushChance: 0,
                    royalFlushChance: 0
                };

                topUpgrades.forEach(upgrade => {
                    const type = upgrade.type.split(':')[0].trim();

                    if (type.includes('Pair') && !type.includes('Two')) {
                        aggregatedChances.pairChance += upgrade.chance;
                    } else if (type.includes('Two pairs')) {
                        aggregatedChances.twoPairChance += upgrade.chance;
                    } else if (type.includes('Three of a kind')) {
                        aggregatedChances.tripsChance += upgrade.chance;
                    } else if (type.includes('Full house')) {
                        aggregatedChances.fullHouseChance += upgrade.chance;
                    } else if (type.includes('Four of a kind')) {
                        aggregatedChances.quadsChance += upgrade.chance;
                    } else if (type.includes('Straight') && !type.includes('flush')) {
                        aggregatedChances.straightChance += upgrade.chance;
                    } else if (type.includes('Flush') && !type.includes('Straight') && !type.includes('Royal')) {
                        aggregatedChances.flushChance += upgrade.chance;
                    } else if (type.includes('Straight flush') && !type.includes('Royal')) {
                        aggregatedChances.straightFlushChance += upgrade.chance;
                    } else if (type.includes('Royal flush')) {
                        aggregatedChances.royalFlushChance += upgrade.chance;
                    }
                });

                if (myHand.description.includes('Pair') && !myHand.description.includes('Two')) {
                    aggregatedChances.pairChance = 100;
                } else if (myHand.description.includes('Two pairs')) {
                    aggregatedChances.pairChance = 100;
                    aggregatedChances.twoPairChance = 100;
                } else if (myHand.description.includes('Three of a kind')) {
                    aggregatedChances.pairChance = 100;
                    aggregatedChances.tripsChance = 100;
                } else if (myHand.description.includes('Straight') && !myHand.description.includes('flush')) {
                    aggregatedChances.straightChance = 100;
                } else if (myHand.description.includes('Flush') && !myHand.description.includes('Straight') && !myHand.description.includes('Royal')) {
                    aggregatedChances.flushChance = 100;
                } else if (myHand.description.includes('Full house')) {
                    aggregatedChances.pairChance = 100;
                    aggregatedChances.twoPairChance = 100;
                    aggregatedChances.tripsChance = 100;
                    aggregatedChances.fullHouseChance = 100;
                } else if (myHand.description.includes('Four of a kind')) {
                    aggregatedChances.pairChance = 100;
                    aggregatedChances.tripsChance = 100;
                    aggregatedChances.quadsChance = 100;
                } else if (myHand.description.includes('Straight flush') && !myHand.description.includes('Royal')) {
                    aggregatedChances.straightChance = 100;
                    aggregatedChances.flushChance = 100;
                    aggregatedChances.straightFlushChance = 100;
                } else if (myHand.description.includes('Royal flush')) {
                    aggregatedChances.straightChance = 100;
                    aggregatedChances.flushChance = 100;
                    aggregatedChances.straightFlushChance = 100;
                    aggregatedChances.royalFlushChance = 100;
                }

                Object.keys(aggregatedChances).forEach(key => {
                    aggregatedChances[key] = Math.min(100, aggregatedChances[key]);
                });

                this.updateProbabilityMeter(myRank.winProbability, aggregatedChances);

                let bestUpgradeChance = -1;
                let bestUpgradeIndex = -1;

                for (let i = 0; i < topUpgrades.length; i++) {
                    if (topUpgrades[i].chance > bestUpgradeChance) {
                        bestUpgradeChance = topUpgrades[i].chance;
                        bestUpgradeIndex = i;
                    }
                }

                let upgradeString = "";
                for (let i = 0; i < topUpgrades.length; i++) {
                    const upgrade = topUpgrades[i];
                    const isBestHand = i === bestUpgradeIndex;
                    upgradeString += `<tr class="${isBestHand ? 'best-hand' : ''}">`;
                    upgradeString += `<td>${upgrade.chance.toFixed(2)}%</td><td>${upgrade.type}</td><td>${upgrade.rank}</td><td>${upgrade.top}</td>`;
                    upgradeString += "</tr>";
                }
                document.querySelector("#pokerCalc-upgrades tbody").innerHTML = upgradeString;

                for (let cards of additionalOppCards) {
                    let oppPossHand = this.getHandScore(communityCards.concat(cards));
                    let type = oppPossHand.description.split(":")[0];
                    if (oppPossHand.description.includes("Four of a kind") || oppPossHand.description.includes("Three of a kind") || oppPossHand.description.includes("Pair")) {
                        type += ": " + oppPossHand.description.split("</span>")[1].split("<span")[0].trim() + "s";
                    } else if (oppPossHand.description.includes("Full house")) {
                        type += ": " + oppPossHand.description.split("</span>")[1].split("<span")[0].trim() + "s full of " + oppPossHand.description.split("</span>").reverse()[0].split("</td>")[0] + "s";
                    } else if (oppPossHand.description.includes("Straight")) {
                        type += ": " + oppPossHand.description.split("</span>")[1].split("<span")[0].trim() + "-high";
                    } else if (oppPossHand.description.includes("Two pairs")) {
                        type += ": " + oppPossHand.description.split("</span>")[1].split("<span")[0].trim() + "s and " + oppPossHand.description.split("</span>")[3].split("<span")[0].trim() + "s";
                    }

                   if (!bestOppHands.hasOwnProperty(type)) {
                        bestOppHands[type] = { hand: oppPossHand, type: type, cards: cards, score: oppPossHand.score, duplicates: 0, chance: 0 };
                    }
                    bestOppHands[type].description = oppPossHand.description;
                    bestOppHands[type].duplicates++;
                }

                let topOppHands = Object.values(bestOppHands);
                topOppHands.forEach(e => {
                    e.chance = (e.duplicates / additionalOppCards.length) * 100;
                });
                topOppHands = topOppHands
                    .sort((a, b) => b.score - a.score)
                    .slice(0, this.upgradesToShow);

                topOppHands.forEach(e => {
                    const newCommunity = communityCards.concat(e.cards);
                    const remainingDeck = this.filterDeck(allCards, e.cards);
                    const thisRank = this.calculateHandRank(e.hand, newCommunity, remainingDeck);
                    e.rank = thisRank.rank;
                    e.top = thisRank.top;
                });

                let bestOppHandScore = -1;
                let bestOppHandIndex = -1;

                for (let i = 0; i < topOppHands.length; i++) {
                    if (topOppHands[i].score > bestOppHandScore) {
                        bestOppHandScore = topOppHands[i].score;
                        bestOppHandIndex = i;
                    }
                }

                let oppHandString = "";
                for (let i = 0; i < topOppHands.length; i++) {
                    const upgrade = topOppHands[i];
                    const isBestHand = i === bestOppHandIndex;
                    oppHandString += `<tr class="${isBestHand ? 'best-opp-hand' : ''}">`;
                    oppHandString += `<td>${upgrade.chance.toFixed(2)}%</td><td>${upgrade.type}</td><td>${upgrade.rank}</td><td>${upgrade.top}</td>`;
                    oppHandString += "</tr>";
                }
                document.querySelector("#pokerCalc-oppPossHands tbody").innerHTML = oppHandString;
            }
        });
    }

    getRecommendation(topNumber, potOdds) {
        const topPercent = topNumber * 100;
        const thresholds = {
            'pre-flop': { raise: 25, fold: 60 },
            'flop': { raise: 20, fold: 50 },
            'turn': { raise: 15, fold: 40 },
            'river': { raise: 10, fold: 30 }
        };
        const betRound = this.getBettingRound();
        const { raise, fold } = thresholds[betRound] || { raise: 20, fold: 50 };

        if (topPercent <= raise) {
            return "Raise/Bet - Strong Hand";
        } else if (topPercent <= fold) {
            if (potOdds > 0 && potOdds < topNumber) {
                return "Call - Pot Odds Favorable";
            }
            return "Call/Check - Moderate";
        } else {
            return "Fold - Weak Hand";
        }
    }

    getBettingRound() {
        const communityCards = Array.from(document.querySelectorAll("[class*='flipper___'] > div[class*='front___'] > div")).slice(0, 5);
        const numCards = communityCards.filter(e => !e.classList.contains("null-0")).length;
        switch (numCards) {
            case 0: return 'pre-flop';
            case 3: return 'flop';
            case 4: return 'turn';
            case 5: return 'river';
            default: return 'unknown';
        }
    }

    addStatisticsTable() {
        const observer = new MutationObserver((mutations, obs) => {
            const reactRoot = document.querySelector("#react-root");
            if (reactRoot) {
                if (!document.getElementById("pokerCalc-div")) {
                    const div = document.createElement("div");
                    div.id = "pokerCalc-div";
                    div.style.position = "relative";
                    div.innerHTML = `
                        <div class="suits-container"></div>
                        <div class="flopmaster-header">
                            <div id="pokerCalc-recommendations">
                                <div class="action-chip">
                                    <div class="chip-inner">
                                        <span id="pokerCalc-action">Waiting for cards...</span>
                                    </div>
                                    <div class="chip-edge"></div>
                                </div>
                            </div>

                            <div id="flopmaster-logo">
                                <div class="logo-container">
                                    <div class="logo-card">
                                        <span class="logo-text">FlopMaster</span>
                                        <div class="logo-suits">
                                            <span class="suit hearts">♥</span>
                                            <span class="suit spades">♠</span>
                                            <span class="suit diamonds">♦</span>
                                            <span class="suit clubs">♣</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="win-probability-meter">
                            <div class="meter-label">Win Probability</div>
                            <div class="meter-container">
                                <div class="meter-groove"></div>
                                <div class="meter-bar" style="width: 0%"></div>
                                <div class="meter-value">0%</div>
                            </div>
                        </div>

                       <div class="mini-meters-container">
    <div class="mini-meter pair-meter">
        <div class="mini-meter-label">Pair</div>
        <div class="mini-meter-container">
            <div class="mini-meter-groove"></div>
            <div class="mini-meter-bar" data-type="pair" style="width: 0%"></div>
            <div class="mini-meter-value">0%</div>
        </div>
    </div>

    <div class="mini-meter two-pair-meter">
        <div class="mini-meter-label">Two Pair</div>
        <div class="mini-meter-container">
            <div class="mini-meter-groove"></div>
            <div class="mini-meter-bar" data-type="twoPair" style="width: 0%"></div>
            <div class="mini-meter-value">0%</div>
        </div>
    </div>

    <div class="mini-meter trips-meter">
        <div class="mini-meter-label">Three of a Kind</div>
        <div class="mini-meter-container">
            <div class="mini-meter-groove"></div>
            <div class="mini-meter-bar" data-type="trips" style="width: 0%"></div>
            <div class="mini-meter-value">0%</div>
        </div>
    </div>

    <div class="mini-meter straight-meter">
        <div class="mini-meter-label">Straight</div>
        <div class="mini-meter-container">
            <div class="mini-meter-groove"></div>
            <div class="mini-meter-bar" data-type="straight" style="width: 0%"></div>
            <div class="mini-meter-value">0%</div>
        </div>
    </div>

    <div class="mini-meter flush-meter">
        <div class="mini-meter-label">Flush</div>
        <div class="mini-meter-container">
            <div class="mini-meter-groove"></div>
            <div class="mini-meter-bar" data-type="flush" style="width: 0%"></div>
            <div class="mini-meter-value">0%</div>
        </div>
    </div>

    <div class="mini-meter full-house-meter">
        <div class="mini-meter-label">Full House</div>
        <div class="mini-meter-container">
            <div class="mini-meter-groove"></div>
            <div class="mini-meter-bar" data-type="fullHouse" style="width: 0%"></div>
            <div class="mini-meter-value">0%</div>
        </div>
    </div>

    <div class="mini-meter quads-meter">
        <div class="mini-meter-label">Four of a Kind</div>
        <div class="mini-meter-container">
            <div class="mini-meter-groove"></div>
            <div class="mini-meter-bar" data-type="quads" style="width: 0%"></div>
            <div class="mini-meter-value">0%</div>
        </div>
    </div>

    <div class="mini-meter straight-flush-meter">
        <div class="mini-meter-label">Straight Flush</div>
        <div class="mini-meter-container">
            <div class="mini-meter-groove"></div>
            <div class="mini-meter-bar" data-type="straightFlush" style="width: 0%"></div>
            <div class="mini-meter-value">0%</div>
        </div>
    </div>

    <div class="mini-meter royal-flush-meter">
        <div class="mini-meter-label">Royal Flush</div>
        <div class="mini-meter-container">
            <div class="mini-meter-groove"></div>
            <div class="mini-meter-bar" data-type="royalFlush" style="width: 0%"></div>
            <div class="mini-meter-value">0%</div>
        </div>
    </div>
</div>

                        <table id="pokerCalc-preflop" style="display: none;">
                            <caption>Pre-Flop Hand Statistics</caption>
                            <thead>
                                <tr>
                                    <th>Hand</th>
                                    <th>Win %</th>
                                    <th>Tie %</th>
                                    <th>Total %</th>
                                    <th>Tier</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                        <table id="pokerCalc-myHand">
                            <caption>Your Hand</caption>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Hand</th>
                                    <th>Rank</th>
                                    <th>Top</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                        <table id="pokerCalc-upgrades">
                            <caption>Your Potential Hands</caption>
                            <thead>
                                <tr>
                                    <th>Chance</th>
                                    <th>Hand</th>
                                    <th>Rank</th>
                                    <th>Top</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                        <table id="pokerCalc-oppPossHands">
                            <caption>Opponent Potential Hands</caption>
                            <thead>
                                <tr>
                                    <th>Chance</th>
                                    <th>Hand</th>
                                    <th>Rank</th>
                                    <th>Top</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    `;
                    reactRoot.after(div);

                    this.initProbabilityMeter();

                    setTimeout(() => {
                        const suitsContainer = document.querySelector('.suits-container');
                        if (suitsContainer) {
                            const floatingSuits = new FloatingSuits(suitsContainer, {
                                suitCount: 25,
                                minSize: 18,
                                maxSize: 42,
                                minSpeed: 10,
                                maxSpeed: 80
                            });

                            window.pokerFloatingSuits = floatingSuits;
                            floatingSuits.start();

                            setTimeout(() => {

                                const fps = window.performance?.now ? 60 : 30; // Simplified - assume 60 FPS for modern browsers
                                if (fps < 40) {
                                    floatingSuits.setDensity(20); // Reduce number of suits on lower-end devices
                                }
                            }, 3000);
                        }
                    }, 500);
                }
                obs.disconnect();
                this.update();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    initProbabilityMeter() {
        const updateMeter = (percentage = 0, handStats = null) => {
            const meterBar = document.querySelector('.meter-bar');
            const meterValue = document.querySelector('.meter-value');

            if (meterBar && meterValue) {
                meterBar.style.transition = 'width 0.8s ease-in-out';
                meterBar.style.width = `${percentage}%`;

                meterValue.textContent = `${percentage.toFixed(1)}%`;

                if (percentage >= 70) {
                    meterBar.style.backgroundColor = '#4CAF50';
                } else if (percentage >= 40) {
                    meterBar.style.backgroundColor = '#FFC107';
                } else {
                    meterBar.style.backgroundColor = '#F44336';
                }

                if (handStats) {
                    this.updateMiniMeters(handStats);
                }
            }
        };

        this.updateProbabilityMeter = updateMeter;

        updateMeter(0);
    }

    updateMiniMeters(stats = {}) {
        const pairChance = stats.pairChance || 0;
        const twoPairChance = stats.twoPairChance || 0;
        const tripsChance = stats.tripsChance || 0;
        const fullHouseChance = stats.fullHouseChance || 0;
        const straightChance = stats.straightChance || 0;
        const flushChance = stats.flushChance || 0;
        const quadsChance = stats.quadsChance || 0;
        const straightFlushChance = stats.straightFlushChance || 0;
        const royalFlushChance = stats.royalFlushChance || 0;

        const pairBar = document.querySelector('.mini-meter-bar[data-type="pair"]');
        const pairValue = pairBar?.parentNode.querySelector('.mini-meter-value');
        if (pairBar && pairValue) {
            pairBar.style.width = `${pairChance}%`;
            pairValue.textContent = `${pairChance.toFixed(1)}%`;
        }

        const twoPairBar = document.querySelector('.mini-meter-bar[data-type="twoPair"]');
        const twoPairValue = twoPairBar?.parentNode.querySelector('.mini-meter-value');
        if (twoPairBar && twoPairValue) {
            twoPairBar.style.width = `${twoPairChance}%`;
            twoPairValue.textContent = `${twoPairChance.toFixed(1)}%`;
        }

        const tripsBar = document.querySelector('.mini-meter-bar[data-type="trips"]');
        const tripsValue = tripsBar?.parentNode.querySelector('.mini-meter-value');
        if (tripsBar && tripsValue) {
            tripsBar.style.width = `${tripsChance}%`;
            tripsValue.textContent = `${tripsChance.toFixed(1)}%`;
        }

        const quadsBar = document.querySelector('.mini-meter-bar[data-type="quads"]');
        const quadsValue = quadsBar?.parentNode.querySelector('.mini-meter-value');
        if (quadsBar && quadsValue) {
            quadsBar.style.width = `${quadsChance}%`;
            quadsValue.textContent = `${quadsChance.toFixed(1)}%`;
        }

        const fullHouseBar = document.querySelector('.mini-meter-bar[data-type="fullHouse"]');
        const fullHouseValue = fullHouseBar?.parentNode.querySelector('.mini-meter-value');
        if (fullHouseBar && fullHouseValue) {
            fullHouseBar.style.width = `${fullHouseChance}%`;
            fullHouseValue.textContent = `${fullHouseChance.toFixed(1)}%`;
        }

        const straightBar = document.querySelector('.mini-meter-bar[data-type="straight"]');
        const straightValue = straightBar?.parentNode.querySelector('.mini-meter-value');
        if (straightBar && straightValue) {
            straightBar.style.width = `${straightChance}%`;
            straightValue.textContent = `${straightChance.toFixed(1)}%`;
        }

        const flushBar = document.querySelector('.mini-meter-bar[data-type="flush"]');
        const flushValue = flushBar?.parentNode.querySelector('.mini-meter-value');
        if (flushBar && flushValue) {
            flushBar.style.width = `${flushChance}%`;
            flushValue.textContent = `${flushChance.toFixed(1)}%`;
        }

        const straightFlushBar = document.querySelector('.mini-meter-bar[data-type="straightFlush"]');
        const straightFlushValue = straightFlushBar?.parentNode.querySelector('.mini-meter-value');
        if (straightFlushBar && straightFlushValue) {
            straightFlushBar.style.width = `${straightFlushChance}%`;
            straightFlushValue.textContent = `${straightFlushChance.toFixed(1)}%`;
        }

        const royalFlushBar = document.querySelector('.mini-meter-bar[data-type="royalFlush"]');
        const royalFlushValue = royalFlushBar?.parentNode.querySelector('.mini-meter-value');
        if (royalFlushBar && royalFlushValue) {
            royalFlushBar.style.width = `${royalFlushChance}%`;
            royalFlushValue.textContent = `${royalFlushChance.toFixed(1)}%`;
        }
    }

    calculatePreflopEquity(handNotation) {
        if (this.preflopStats[handNotation]) {
            return this.preflopStats[handNotation].total;
        }

        const isPair = handNotation.length === 2;
        const isSuited = handNotation.endsWith('s');

        let card1, card2;
        if (isPair) {
            card1 = card2 = this.getCardRank(handNotation[0]);
        } else {
            card1 = this.getCardRank(handNotation[0]);
            card2 = this.getCardRank(handNotation[1].replace('s', ''));
        }

        let equity = 0;

        if (isPair) {
            equity = 50 + (card1 * 2.5);
        } else {
            let baseEquity = (card1 + card2) * 1.5;
            const isConnected = Math.abs(card1 - card2) <= 2;

            if (isSuited) baseEquity += 5;
            if (isConnected) baseEquity += 3;

            equity = baseEquity;
        }

        return Math.min(Math.max(equity, 30), 85);
    }

    getCardRank(cardValue) {
        const values = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10 };
        return values[cardValue] || parseInt(cardValue);
    }

    estimateHandStats(handNotation) {
        const winEquity = this.calculatePreflopEquity(handNotation);

        const isPocketPair = handNotation.length === 2 && handNotation[0] === handNotation[1];
        const isSuited = handNotation.endsWith('s');

        let pairChance = isPocketPair ? 100 : 40;
        let twoPairChance = isPocketPair ? 20 : 5;
        let tripsChance = isPocketPair ? 25 : 0;
        let fullHouseChance = isPocketPair ? 5 : 0;
        let straightChance = 0;
        let flushChance = 0;
        let quadsChance = isPocketPair ? 3 : 0;
        let straightFlushChance = 0;
        let royalFlushChance = 0;

        if (!isPocketPair) {
            const card1 = this.getCardRank(handNotation[0]);
            const card2 = this.getCardRank(handNotation[1].replace('s', ''));
            const isConnected = Math.abs(card1 - card2) <= 3;

            if (isConnected) {
                straightChance = 20 - (Math.abs(card1 - card2) * 5);
            }

            if (isSuited) {
                flushChance = 15;

                if (isConnected) {
                    straightFlushChance = 1;

                    if (card1 >= 10 && card2 >= 10) {
                        royalFlushChance = 0.5;
                    }
                }
            }
        }

        const recommendation = this.getPreFlopRecommendation(winEquity);
        const actionButton = document.getElementById("pokerCalc-action");
        actionButton.textContent = recommendation;

        actionButton.classList.remove("action-raise", "action-call", "action-fold");

        if (recommendation.includes("Raise")) {
            actionButton.classList.add("action-raise");
        } else if (recommendation.includes("Call")) {
            actionButton.classList.add("action-call");
        } else if (recommendation.includes("Fold")) {
            actionButton.classList.add("action-fold");
        }

        this.lastRecommendation = recommendation;

        let statsHTML = `<tr>
            <td>${handNotation}</td>
            <td>${(winEquity * 0.95).toFixed(2)}%</td>
            <td>${(winEquity * 0.05).toFixed(2)}%</td>
            <td>${winEquity.toFixed(2)}%</td>
            <td>${this.getPreflopHandTier(winEquity)}</td>
        </tr>`;

        document.querySelector("#pokerCalc-preflop tbody").innerHTML = statsHTML;

        this.updateProbabilityMeter(winEquity, {
            pairChance,
            twoPairChance,
            tripsChance,
            fullHouseChance,
            straightChance,
            flushChance,
            quadsChance,
            straightFlushChance,
            royalFlushChance
        });
    }

    convertToNotation(card) {
        if (!card || card === "null-0") return null;

        const value = card.split("-")[1];
        switch (value) {
            case "14": return "A";
            case "13": return "K";
            case "12": return "Q";
            case "11": return "J";
            case "10": return "T";
            default: return value;
        }
    }

    getPreflopHandTier(winPercentage) {
        if (winPercentage >= 75) return "Premium";
        if (winPercentage >= 65) return "Strong";
        if (winPercentage >= 55) return "Playable";
        if (winPercentage >= 45) return "Speculative";
        return "Weak";
    }

    getPreFlopRecommendation(winPercentage) {
        const position = this.getPlayerPosition();

        let raiseThreshold, callThreshold;

        switch (position) {
            case 'early':
                raiseThreshold = 70;
                callThreshold = 60;
                break;
            case 'middle':
                raiseThreshold = 65;
                callThreshold = 55;
                break;
            case 'late':
                raiseThreshold = 60;
                callThreshold = 50;
                break;
            case 'button':
            case 'smallBlind':
                raiseThreshold = 55;
                callThreshold = 45;
                break;
            case 'bigBlind':
                raiseThreshold = 60;
                callThreshold = 40;
                break;
            default:
                raiseThreshold = 65;
                callThreshold = 50;
        }

        if (winPercentage < 30) {
            return "Fold - Weak Hand";
        }

        if (winPercentage >= raiseThreshold) {
            return "Raise - Strong Hand";
        } else if (winPercentage >= callThreshold) {
            return "Call - Moderate Hand";
        } else {
            return "Fold - Weak Hand";
        }
    }

    getPlayerPosition() {
        return 'middle';
    }

    getFullDeck() {
        let result = [];
        for (let suit of ["hearts", "diamonds", "spades", "clubs"]) {
            for (let value of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]) {
                result.push(suit + "-" + value);
            }
        }
        return result;
    }

    filterDeck(deck, cards) {
        for (let card of cards) {
            let index = deck.indexOf(card);
            if (index != -1) {
                delete deck[index];
            }
        }
        return deck.filter(e => e != "empty");
    }

    calculateHandRank(myHand, communityCards, allCards) {
        if (!myHand?.score || !Array.isArray(communityCards) || !Array.isArray(allCards) ||
            communityCards.length === 0 || allCards.length === 0) {
            return {
                rank: "N/A",
                top: "N/A",
                topNumber: 0,
                betterHands: 0,
                equalHands: 0,
                worseHands: 0,
                totalHands: 0
            };
        }

        let betterHands = 0;
        let equalHands = 0;
        let worseHands = 0;
        let totalHands = 0;

        const availableCards = allCards.filter(card =>
            card &&
            typeof card === 'string' &&
            !communityCards.includes(card) &&
            !myHand.result.includes(card)
        );

        if (availableCards.length < 2) {
            return {
                rank: "N/A",
                top: "N/A",
                topNumber: 0.5
            };
        }

        for (let i = 0; i < availableCards.length - 1; i++) {
            for (let j = i + 1; j < availableCards.length; j++) {
                const combo = [availableCards[i], availableCards[j]];
                let thisHand = this.getHandScore(communityCards.concat(combo));

                if (thisHand.score > myHand.score) {
                    betterHands++;
                } else if (thisHand.score === myHand.score) {
                    const tieBreaker = this.compareTiedHands(myHand, thisHand);
                    if (tieBreaker > 0) betterHands++;
                    else if (tieBreaker < 0) worseHands++;
                    else equalHands++;
                } else {
                    worseHands++;
                }
                totalHands++;
            }
        }

        if (totalHands === 0) {
            return {
                rank: "N/A",
                top: "N/A",
                topNumber: 0.5
            };
        }

        const trueRank = betterHands + Math.ceil(equalHands / 2);
        const percentile = ((betterHands + equalHands / 2) / totalHands) * 100;

        const winProbability = 100 - percentile;

        return {
            rank: `${trueRank + 1} / ${totalHands}`,
            top: `${percentile.toFixed(1)}%`,
            topNumber: percentile / 100,
            winProbability: winProbability
        };
    }

    compareTiedHands(hand1, hand2) {
        const kickers1 = hand1.result.map(card => parseInt(card.split('-')[1])).sort((a, b) => b - a);
        const kickers2 = hand2.result.map(card => parseInt(card.split('-')[1])).sort((a, b) => b - a);

        for (let i = 0; i < kickers1.length; i++) {
            if (kickers1[i] !== kickers2[i]) {
                return kickers2[i] - kickers1[i];
            }
        }
        return 0;
    }

    prettifyHand(hand) {
        let resultText = "";
        for (let card of hand) {
            if (card != "null-0") {
                resultText += " " + card
                    .replace("diamonds", "<span class='diamonds'>♦</span>")
                    .replace("spades", "<span class='spades'>♠</span>")
                    .replace("hearts", "<span class='hearts'>♥</span>")
                    .replace("clubs", "<span class='clubs'>♣</span>")
                    .replace("-14", "-A")
                    .replace("-13", "K")
                    .replace("-12", "Q")
                    .replace("-11", "J")
                    .replace("-", "");
            }
        }
        return resultText;
    }

    getHandScore(hand) {
        hand = hand.filter(e => !e.includes("null"));

        if (hand.length < 5) { return { description: "", score: 0 }; }

        let resultString = "";
        let resultText = "";
        let handResult;
        let handObject = this.makeHandObject(hand);

        if (handResult = this.hasFourOfAKind(hand, handObject)) {
            resultString += "7";
            resultText += "Four of a kind:";
        } else if (handResult = this.hasFullHouse(hand, handObject)) {
            resultString += "6";
            resultText += "Full house:";
        } else if (handResult = this.hasFlush(hand, handObject)) {
            let isRoyal = this.hasRoyalFlush(hand, handObject);

            if (isRoyal) {
                handResult = isRoyal;
                resultString += "9";
                resultText += "Royal flush:";
            } else {
                let isStraight = this.hasStraightFlush(hand, handObject);

                if (isStraight) {
                    handResult = isStraight;
                    resultString += "8";
                    resultText += "Straight flush:";
                } else {
                    resultString += "5";
                    resultText += "Flush:";
                }
            }
        } else if (handResult = this.hasStraight(hand, handObject)) {
            resultString += "4";
            resultText += "Straight:";
        } else if (handResult = this.hasThreeOfAKind(hand, handObject)) {
            resultString += "3";
            resultText += "Three of a kind:";
        } else if (handResult = this.hasTwoPairs(hand, handObject)) {
            resultString += "2";
            resultText += "Two pairs:";
        } else if (handResult = this.hasPair(hand, handObject)) {
            resultString += "1";
            resultText += "Pair:";
        } else {
            resultString += "0";
            resultText += "High card:";
            handResult = hand.slice(0, 5);
        }

        for (let card of handResult) {
            resultString += parseInt(card.split("-")[1]).toString(16);
        }

        resultText += this.prettifyHand(handResult);

        return { description: resultText, result: handResult, score: parseInt(resultString, 16) };
    }

    makeHandObject(hand) {
        let resultMap = { cards: hand, suits: {}, values: {} };

        hand.sort((a, b) => parseInt(b.split("-")[1]) - parseInt(a.split("-")[1])).filter(e => e != "null-0").forEach(e => {
            let suit = e.split("-")[0];
            let value = e.split("-")[1];

            if (!resultMap.suits.hasOwnProperty(suit)) {
                resultMap.suits[suit] = [];
            }

            if (!resultMap.values.hasOwnProperty(value)) {
                resultMap.values[value] = [];
            }

            resultMap.suits[suit].push(e);
            resultMap.values[value].push(e);
        });

        return resultMap;
    }

    hasRoyalFlush(hand, handObject) {
        for (let suit in handObject.suits) {
            const suitCards = handObject.suits[suit];
            if (suitCards.length >= 5) {
                const values = new Set(suitCards.map(card => parseInt(card.split("-")[1])));
                if ([10, 11, 12, 13, 14].every(value => values.has(value))) {
                    return suitCards
                        .filter(card => parseInt(card.split("-")[1]) >= 10)
                        .sort((a, b) => parseInt(b.split("-")[1]) - parseInt(a.split("-")[1]))
                        .slice(0, 5);
                }
            }
        }
        return null;
    }

    hasStraightFlush(hand, handObject) {
        for (let suit in handObject.suits) {
            const suitCards = handObject.suits[suit];
            if (suitCards.length >= 5) {
                const straightFlush = this.hasStraight(suitCards, this.makeHandObject(suitCards));
                if (straightFlush) {
                    return straightFlush;
                }
            }
        }
        return null;
    }

    hasFourOfAKind(hand, handObject) {
        let quadruplets = Object.values(handObject.values).filter(e => e.length == 4);

        if (quadruplets.length > 0) {
            delete hand[hand.indexOf(quadruplets[0][0])];
            delete hand[hand.indexOf(quadruplets[0][1])];
            delete hand[hand.indexOf(quadruplets[0][2])];
            delete hand[hand.indexOf(quadruplets[0][3])];

            hand = hand.filter(e => e != "empty");

            return quadruplets[0].concat(hand).slice(0, 5);
        }
        return null;
    }

    hasFullHouse(hand, handObject) {
        let triplets = Object.values(handObject.values)
            .filter(e => e.length === 3)
            .sort((a, b) => parseInt(b[0].split("-")[1]) - parseInt(a[0].split("-")[1]));

        if (triplets.length === 0) {
            return null;
        }

        for (let threeOfKind of triplets) {
            const threeValue = parseInt(threeOfKind[0].split("-")[1]);

            const pairs = Object.values(handObject.values)
                .filter(e => e.length >= 2 && parseInt(e[0].split("-")[1]) !== threeValue)
                .sort((a, b) => parseInt(b[0].split("-")[1]) - parseInt(a[0].split("-")[1]));

            if (pairs.length > 0) {
                return threeOfKind.slice(0, 3).concat(pairs[0].slice(0, 2));
            }
        }
        return null;
    }

    hasFlush(hand, handObject) {
        for (let suit in handObject.suits) {
            if (handObject.suits[suit].length >= 5) {
                return handObject.suits[suit]
                    .sort((a, b) => parseInt(b.split("-")[1]) - parseInt(a.split("-")[1]))
                    .slice(0, 5);
            }
        }
        return null;
    }

    hasStraight(hand, handObject) {
        const valueMap = new Map();
        hand.forEach(card => {
            const value = parseInt(card.split("-")[1]);
            if (!valueMap.has(value) || parseInt(valueMap.get(value).split("-")[1]) < value) {
                valueMap.set(value, card);
            }
        });

        const uniqueValues = Array.from(valueMap.keys()).sort((a, b) => b - a);

        for (let i = 0; i <= uniqueValues.length - 5; i++) {
            const possibleStraight = uniqueValues.slice(i, i + 5);
            if (possibleStraight[0] - possibleStraight[4] === 4) {
                return possibleStraight.map(value => valueMap.get(value));
            }
        }

        if (uniqueValues.includes(14) &&
            uniqueValues.includes(2) &&
            uniqueValues.includes(3) &&
            uniqueValues.includes(4) &&
            uniqueValues.includes(5)) {
            return [
                valueMap.get(5),
                valueMap.get(4),
                valueMap.get(3),
                valueMap.get(2),
                valueMap.get(14)
            ];
        }

        return null;
    }

    hasThreeOfAKind(hand, handObject) {
        let triplets = Object.values(handObject.values).filter(e => e.length == 3);

        if (triplets.length > 0) {
            delete hand[hand.indexOf(triplets[0][0])];
            delete hand[hand.indexOf(triplets[0][1])];
            delete hand[hand.indexOf(triplets[0][2])];

            hand = hand.filter(e => e != "empty");

            return triplets[0].concat(hand).slice(0, 5);
        }
        return null;
    }

    hasTwoPairs(hand, handObject) {
        let pairs = Object.values(handObject.values).filter(e => e.length == 2);

        if (pairs.length > 1) {
            delete hand[hand.indexOf(pairs[0][0])];
            delete hand[hand.indexOf(pairs[0][1])];
            delete hand[hand.indexOf(pairs[1][0])];
            delete hand[hand.indexOf(pairs[1][1])];

            hand = hand.filter(e => e != "empty");

            if (parseInt(pairs[0][0].split("-")[1]) > parseInt(pairs[1][0].split("-")[1])) {
                return pairs[0].concat(pairs[1].concat(hand)).slice(0, 5);
            } else {
                return pairs[1].concat(pairs[0].concat(hand)).slice(0, 5);
            }
        }
        return null;
    }

    hasPair(hand, handObject) {
        let pairs = Object.values(handObject.values).filter(e => e.length == 2);

        if (pairs.length > 0) {
            delete hand[hand.indexOf(pairs[0][0])];
            delete hand[hand.indexOf(pairs[0][1])];

            hand = hand.filter(e => e != "empty");

            return pairs[0].concat(hand).slice(0, 5);
        }
        return null;
    }

    addStyle() {
    try {
        const styleText = `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Roboto:wght@400;500;700&display=swap');

        #pokerCalc-div * {
            font-family: 'Roboto', 'Arial', sans-serif;
            box-sizing: border-box;
            color: #fbf7d5;
        }

        .flopmaster-header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            gap: 20px;
        }

        #flopmaster-logo {
            text-align: right;
            padding: 5px 0;
            position: relative;
            flex: 0 0 auto;
        }

        .logo-container {
            position: relative;
            display: inline-block;
            perspective: 1200px;
            transform-style: preserve-3d;
        }

        .logo-card {
            position: relative;
            background: linear-gradient(145deg, #0e7a38 0%, #054122 90%);
            border-radius: 12px;
            padding: 15px 25px;
            box-shadow:
                0 10px 25px rgba(0,0,0,0.6),
                0 0 20px rgba(255,255,255,0.15) inset;
            border: 2px solid rgba(255,215,0,0.4);
            overflow: hidden;
            transform-style: preserve-3d;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            min-width: 240px;
            animation: floatCard 5s ease-in-out infinite alternate;
        }

        .logo-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGMwLTEuMTA1LS44OTUtMi0yLTJzLTIgLjg5NS0yIDJjMCAxLjEwNC44OTUgMiAyIDJzMi0uODk2IDItMnoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L2c+PC9zdmc+');
            opacity: 0.2;
            z-index: 0;
        }

        .logo-card:hover {
            transform: translateY(-5px) rotateX(5deg) rotateY(5deg);
            box-shadow:
                0 15px 25px rgba(0,0,0,0.6),
                0 0 30px rgba(212, 175, 55, 0.4);
            cursor: pointer;
        }

        @keyframes floatCard {
            0% { transform: translateY(0) rotateZ(0deg); }
            50% { transform: translateY(-5px) rotateZ(0.5deg); }
            100% { transform: translateY(-3px) rotateZ(-0.5deg); }
        }

        @keyframes softGreenPulse {
            0% { filter: hue-rotate(-10deg) brightness(0.95); }
            33% { filter: hue-rotate(0deg) brightness(1.05); }
            66% { filter: hue-rotate(10deg) brightness(1.1); }
            100% { filter: hue-rotate(0deg) brightness(1); }
        }

        .logo-text {
            font-size: 35px;
            font-weight: 800;
            font-family: 'Playfair Display', serif;
            letter-spacing: 1px;
            display: block;
            width: 100%;
            text-align: center;
            position: relative;
            z-index: 2;
            color: #fff6c8;
            margin: 5px 0;
            text-shadow:
                0 0 5px #fff,
                0 0 10px #fff,
                0 0 20px #fff,
                0 0 40px #ffb700,
                0 0 80px #ffb700;
            animation: neonGoldGlow 1.5s ease-in-out infinite alternate;
        }

        .logo-suits {
            position: relative;
            display: flex;
            justify-content: space-around;
            padding: 2px 10px;
            margin-top: 5px;
        }

        .logo-suits .suit {
            font-size: 14px;
            transform-origin: center;
            animation: pulsate 3s infinite;
            filter: drop-shadow(0 3px 4px rgba(0,0,0,0.7));
            transition: all 0.3s ease;
            background-image: none !important;
            -webkit-text-fill-color: initial !important;
            -webkit-background-clip: initial !important;
            background-clip: initial !important;
        }

        .logo-suits .suit:hover {
            transform: scale(1.3) translateY(-3px);
            filter: drop-shadow(0 5px 10px rgba(0,0,0,0.8));
        }

        .logo-suits .suit.hearts,
        .logo-suits .suit.diamonds {
            color: #e62222 !important;
            text-shadow: 0 0 5px rgba(230, 34, 34, 0.7);
        }

        .logo-suits .suit.clubs,
        .logo-suits .suit.spades {
            color: #000000 !important;
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
        }

        .suit.hearts { animation-delay: 0s; }
        .suit.diamonds { animation-delay: 0.75s; }
        .suit.clubs { animation-delay: 1.5s; }
        .suit.spades { animation-delay: 2.25s; }

        @keyframes pulsate {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(2); opacity: 1; }
        }

        /* Floating suits animation */
        .suits-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            pointer-events: none;
            z-index: -1;
        }

        .floating-suit {
            position: absolute;
            display: inline-block;
            opacity: 0.12;
            user-select: none;
            transition: transform 0.3s ease;
            z-index: -1;
            will-change: transform, top, left;
        }

        .floating-suit.hearts,
        .floating-suit.diamonds {
            color: #e62222;
            text-shadow: 0 0 3px rgba(230, 34, 34, 0.3);
        }

        .floating-suit.clubs,
        .floating-suit.spades {
            color: #000;
            text-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
        }

        .floating-suit.gold {
            color: #d4af37;
            text-shadow: 0 0 4px rgba(212, 175, 55, 0.5);
        }

        #pokerCalc-div::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5), transparent);
        }

        #pokerCalc-div {
            background: linear-gradient(160deg, #0a5f2a 0%, #052517 100%);
            color: #fbf7d5;
            padding: 25px;
            margin: 15px;
            border-radius: 16px;
            box-shadow:
                0 10px 35px rgba(0,0,0,0.5),
                0 0 40px rgba(0,0,0,0.1) inset;
            border: 3px solid;
            border-image: linear-gradient(45deg, #d4af37, #f1c736, #d4af37) 1;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }

        #pokerCalc-div::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image:
                url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="none" stroke="%23d4af37" stroke-width="0.5" stroke-dasharray="5,5"/></svg>'),
                url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMGE1ZjJhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMwNzRhMjMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4='),
                radial-gradient(circle at 100% 100%, rgba(7,74,35,0.6) 0%, transparent 50%),
                radial-gradient(circle at 0% 0%, rgba(20,140,60,0.3) 0%, transparent 50%);
            opacity: 0.5;
            z-index: -1;
            pointer-events: none;
            animation: moveGrid 20s linear infinite;
        }

        @keyframes moveGrid {
            0% { background-position: 0 0, 0 0, 0 0, 0 0; }
            100% { background-position: 100px 100px, 0 0, 0 0, 0 0; }
        }

        /* 3D Enhanced Win Probability Meter */
        .win-probability-meter {
            margin: 25px auto 15px;
            max-width: 90%;
            position: relative;
        }

        .meter-label {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 5px;
            color: #fbf7d5;
            text-align: center;
            letter-spacing: 0.5px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.7);
            position: relative;
        }

        .meter-container {
            height: 25px;
            position: relative;
            border-radius: 12px;
            background: linear-gradient(to bottom, #052517, #0a5f2a);
            padding: 4px;
            box-shadow:
                0 4px 10px rgba(0,0,0,0.7),
                0 10px 20px rgba(0,0,0,0.3);
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(212, 175, 55, 0.6);
            transform-style: preserve-3d;
            perspective: 500px;
        }

        .meter-groove {
            position: absolute;
            top: 4px;
            left: 4px;
            right: 4px;
            bottom: 4px;
            background: rgba(0,0,0,0.6);
            border-radius: 9px;
            box-shadow:
                inset 0 2px 6px rgba(0,0,0,0.8),
                inset 0 0 3px rgba(0,0,0,0.6);
            background-image:
                linear-gradient(rgba(10,10,10,0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(10,10,10,0.6) 1px, transparent 1px);
            background-size: 5px 5px;
            z-index: 1;
        }

        .meter-bar {
            height: 17px;
            margin-top: 0;
            width: 0%;
            background: linear-gradient(to bottom,
                rgba(255,255,255,0.15) 0%,
                rgba(255,255,255,0) 40%,
                rgba(0,0,0,0.3) 100%),
                linear-gradient(to right, #F44336, #FFC107, #4CAF50);
            border-radius: 8px;
            transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
            position: relative;
            box-shadow:
                0 0 10px rgba(255,255,255,0.3),
                0 1px 1px rgba(255,255,255,0.5) inset,
                0 -1px 1px rgba(0,0,0,0.5) inset;
            z-index: 2;
            transform: translateZ(3px);
        }

        .meter-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
            border-radius: 8px 8px 0 0;
            z-index: 3;
        }

        .meter-container::before {
            content: '';
            position: absolute;
            top: -5px;
            left: 0;
            right: 0;
            height: 10px;
            background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.3));
            z-index: 0;
            transform: rotateX(45deg);
            transform-origin: bottom;
        }

        .meter-container::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 0;
            right: 0;
            height: 10px;
            background: linear-gradient(to top, transparent, rgba(0,0,0,0.3));
            z-index: 0;
            transform: rotateX(-45deg);
            transform-origin: top;
        }

        .meter-value {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            text-shadow: 0 1px 2px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5);
            z-index: 4;
            transform: translateZ(5px);
        }

        /* Mini Meters Styling */
        .mini-meters-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
    margin: 5px auto 15px;
    max-width: 94%;
}

.mini-meter {
    flex: 1 1 30%;
    min-width: 120px;
    margin-bottom: 5px;
}

.mini-meter-label {
    font-size: 11px;
    font-weight: 500;
    margin-bottom: 3px;
    color: #fbf7d5;
    text-align: center;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.7);
}

.mini-meter-container {
    height: 16px;
    position: relative;
    border-radius: 8px;
    background: linear-gradient(to bottom, #052517, #0a5f2a);
    padding: 3px;
    box-shadow:
        0 2px 6px rgba(0,0,0,0.6),
        0 6px 10px rgba(0,0,0,0.2);
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(212, 175, 55, 0.4);
    transform-style: preserve-3d;
}

.mini-meter-groove {
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
    background: rgba(0,0,0,0.6);
    border-radius: 6px;
    box-shadow: inset 0 1px 4px rgba(0,0,0,0.8);
    background-image:
        linear-gradient(rgba(10,10,10,0.6) 1px, transparent 1px),
        linear-gradient(90deg, rgba(10,10,10,0.6) 1px, transparent 1px);
    background-size: 4px 4px;
    z-index: 1;
}

.mini-meter-bar {
    height: 10px;
    margin-top: 0;
    width: 0%;
    border-radius: 5px;
    transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    box-shadow:
        0 0 6px rgba(255,255,255,0.2),
        0 1px 1px rgba(255,255,255,0.3) inset;
    z-index: 2;
    transform: translateZ(2px);
}

/* More vibrant color scheme */
.mini-meter-bar[data-type="pair"] {
    background: #5C6BC0;
}

.mini-meter-bar[data-type="twoPair"] {
    background: #42A5F5;
}

.mini-meter-bar[data-type="trips"] {
    background: #AB47BC;
}

.mini-meter-bar[data-type="fullHouse"] {
    background: #7E57C2;
}

.mini-meter-bar[data-type="straight"] {
    background: #FFA726;
}

.mini-meter-bar[data-type="flush"] {
    background: #66BB6A;
}

.mini-meter-bar[data-type="quads"] {
    background: #EC407A;
}

.mini-meter-bar[data-type="straightFlush"] {
    background: #26C6DA;
}

.mini-meter-bar[data-type="royalFlush"] {
    background: linear-gradient(45deg, #FFEB3B, #FFC107, #FF9800);
    box-shadow: 0 0 10px 2px rgba(255, 215, 0, 0.7);
    animation: royal-glow 2s infinite alternate;
}

@keyframes royal-glow {
    0% { box-shadow: 0 0 5px 1px rgba(255, 215, 0, 0.5); }
    100% { box-shadow: 0 0 15px 3px rgba(255, 215, 0, 0.9); }
}

.mini-meter-bar {
    transition:
        width 0.8s cubic-bezier(0.22, 1, 0.36, 1),
        background-color 0.5s ease;
}

/* Pulse animation for high percentages */
.mini-meter-bar[style*="90%"] {
    animation: high-percent-pulse 1.5s infinite;
}

@keyframes high-percent-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
}

.mini-meter-value {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 10px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.9);
    z-index: 4;
    transform: translateZ(3px);
}

        #pokerCalc-recommendations {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-right: 20px;
        }

        .action-chip {
            position: relative;
            width: 280px;
            height: 80px;
            cursor: pointer;
            overflow: visible;
        }

        .chip-inner {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 40px;
            background: linear-gradient(145deg, #2d2d2d, #151515);
            box-shadow: 0 5px 15px rgba(0,0,0,0.6);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            transition: all 0.3s ease;
            border: 8px dashed rgba(255,255,255,0.15);
        }

        .action-chip:hover .chip-inner {
            box-shadow: 0 8px 25px rgba(0,0,0,0.7);
        }

        .chip-inner::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 40%;
            background: linear-gradient(to bottom, rgba(255,255,255,0.15), transparent);
            pointer-events: none;
            border-radius: 40px 40px 0 0;
        }

        .chip-inner::before {
            content: "";
            position: absolute;
            inset: 8px;
            border-radius: 32px;
            background: radial-gradient(circle at center, #262626, #111111);
            z-index: -1;
        }

        .chip-edge {
            position: absolute;
            width: calc(100% - 16px);
            height: calc(100% - 16px);
            top: 8px;
            left: 8px;
            border-radius: 32px;
            z-index: 1;
            transition: all 0.3s ease;
        }

        #pokerCalc-action {
            color: #fff;
            font-weight: bold;
            font-size: 18px;
            padding: 8px 20px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            text-align: center;
            font-family: 'Roboto', 'Arial Black', Arial, sans-serif;
            position: relative;
            line-height: 1.3;
        }

        #pokerCalc-action::before,
        #pokerCalc-action::after {
            content: "";
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: currentColor;
            opacity: 0.7;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px currentColor;
        }

        #pokerCalc-action::before {
            left: -25px;
        }

        #pokerCalc-action::after {
            right: -25px;
        }

        #pokerCalc-action.action-raise {
            color: #50e150;
            animation: neonGreenGlow 1.5s ease-in-out infinite alternate;
            text-shadow:
                0 0 5px #fff,
                0 0 10px #fff,
                0 0 20px #fff,
                0 0 40px #50e150,
                0 0 80px #50e150;
        }

        #pokerCalc-action.action-raise ~ .chip-edge {
            box-shadow: 0 0 20px 5px rgba(80, 225, 80, 0.4);
            animation: pulse-chip-green 2s infinite alternate;
        }

        #pokerCalc-action.action-call {
            color: #f0ad4e;
            animation: neonOrangeGlow 1.5s ease-in-out infinite alternate;
            text-shadow:
                0 0 5px #fff,
                0 0 10px #fff,
                0 0 20px #fff,
                0 0 40px #f0ad4e,
                0 0 80px #f0ad4e;
        }

        #pokerCalc-action.action-call ~ .chip-edge {
            box-shadow: 0 0 20px 5px rgba(240, 173, 78, 0.4);
            animation: pulse-chip-orange 2s infinite alternate;
        }

        #pokerCalc-action.action-fold {
            color: #f05050;
            animation: neonRedGlow 1.5s ease-in-out infinite alternate;
            text-shadow:
                0 0 5px #fff,
                0 0 10px #fff,
                0 0 20px #fff,
                0 0 40px #f05050,
                0 0 80px #f05050;
        }

        #pokerCalc-action.action-fold ~ .chip-edge {
            box-shadow: 0 0 20px 5px rgba(240, 80, 80, 0.4);
            animation: pulse-chip-red 2s infinite alternate;
        }

        @keyframes pulse-chip-green {
            0% { box-shadow: 0 0 10px 5px rgba(80, 225, 80, 0.4); }
            100% { box-shadow: 0 0 25px 8px rgba(80, 225, 80, 0.7); }
        }

        @keyframes pulse-chip-orange {
            0% { box-shadow: 0 0 10px 5px rgba(240, 173, 78, 0.4); }
            100% { box-shadow: 0 0 25px 8px rgba(240, 173, 78, 0.7); }
        }

        @keyframes pulse-chip-red {
            0% { box-shadow: 0 0 10px 5px rgba(240, 80, 80, 0.4); }
            100% { box-shadow: 0 0 25px 8px rgba(240, 80, 80, 0.7); }
        }

        /* Enhanced Holographic Table Effect */
        #pokerCalc-div table {
            border-collapse: separate;
            border-spacing: 0;
            margin: 25px 0;
            width: 100%;
            border-radius: 12px;
            transition: all 0.3s ease;
            background: linear-gradient(
                135deg,
                rgba(10, 30, 20, 0.8) 0%,
                rgba(20, 60, 40, 0.8) 50%,
                rgba(10, 30, 20, 0.8) 100%
            );
            backdrop-filter: blur(5px);
            border: 1px solid rgba(212, 175, 55, 0.5);
            box-shadow:
                0 0 20px rgba(212, 175, 55, 0.3),
                0 0 40px rgba(212, 175, 55, 0.2);
            position: relative;
            overflow: hidden;
        }

        /* Primary shimmer layer - more visible but still seamless */
        #pokerCalc-div table::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                70deg,
                rgba(255,255,255,0) 0%,
                rgba(255,255,255,0) 35%,
                rgba(255,255,255,0.15) 45%,
                rgba(255,255,255,0.2) 50%,
                rgba(255,255,255,0.15) 55%,
                rgba(255,255,255,0) 65%,
                rgba(255,255,255,0) 100%
            );
            background-size: 200% 200%;
            background-position: 0% 0;
            animation: hologram-flow 12s linear infinite;
            pointer-events: none;
            z-index: 1;
        }

        /* Secondary subtle gold shimmer layer */
        #pokerCalc-div table::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                110deg,
                rgba(212, 175, 55, 0) 0%,
                rgba(212, 175, 55, 0) 40%,
                rgba(212, 175, 55, 0.07) 47%,
                rgba(212, 175, 55, 0.1) 50%,
                rgba(212, 175, 55, 0.07) 53%,
                rgba(212, 175, 55, 0) 60%,
                rgba(212, 175, 55, 0) 100%
            );
            background-size: 200% 200%;
            background-position: 100% 0;
            animation: hologram-flow 18s linear infinite;
            pointer-events: none;
            z-index: 1;
            opacity: 0.9;
        }

        @keyframes hologram-flow {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
        }

        #pokerCalc-div table:hover {
            box-shadow:
                0 12px 20px rgba(0, 0, 0, 0.3),
                0 0 20px rgba(212, 175, 55, 0.4);
            transform: translateY(-3px);
        }

        #pokerCalc-div th {
            background: linear-gradient(145deg, #272727, #1c1c1c);
            color: #fbf7d5;
            padding: 15px 12px;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            border-bottom: 2px solid rgba(212, 175, 55, 0.3);
            position: relative;
            overflow: hidden;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
            z-index: 2;
        }

        #pokerCalc-div th::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(212, 175, 55, 0.5), transparent);
        }

        #pokerCalc-div td {
            background: rgba(26, 26, 26, 0.8);
            padding: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
            transition: all 0.3s ease;
            color: #fbf7d5;
            font-size: 14px;
            z-index: 2;
        }

        #pokerCalc-div tr:hover td {
            background: rgba(40, 40, 40, 0.8);
            transform: translateX(3px);
            box-shadow: -3px 0 10px rgba(0, 0, 0, 0.2);
        }

        #pokerCalc-div tr:last-child td {
            border-bottom: none;
        }

        #pokerCalc-div tbody tr {
            position: relative;
            transition: all 0.3s ease;
        }

        #pokerCalc-div tbody tr:hover {
            background: rgba(212, 175, 55, 0.1);
            transform: scale(1.01);
            z-index: 2;
        }

        #pokerCalc-div caption {
            color: #fbf7d5;
            font-size: 1.2em;
            font-weight: bold;
            margin: 15px 0 10px;
            text-align: left;
            letter-spacing: 1px;
            position: relative;
            padding-left: 40px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
            font-family: 'Playfair Display', serif;
            animation: neonGoldGlow 3s ease-in-out infinite alternate;
        }

        #pokerCalc-div caption::before {
            content: '♠♣♥♦';
            position: absolute;
            left: 3px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.9em;
            letter-spacing: 2px;
        }

        #pokerCalc-div caption::before {
            text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }

        /* Style the individual suit icons in captions */
        #pokerCalc-myHand caption::before,
        #pokerCalc-preflop caption::before {
            content: '♠♣♥♦';
        }

        #pokerCalc-upgrades caption::before {
            content: '♠♣♥♦';
        }

        #pokerCalc-oppPossHands caption::before {
            content: '♠♣♥♦';
        }

        /* Make caption icons black and red */
        #pokerCalc-div caption::before {
            background: linear-gradient(to right,
                black 0%, black 25%,
                black 25%, black 50%,
                #e62222 50%, #e62222 75%,
                #e62222 75%, #e62222 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        #pokerCalc-div td:nth-child(1) {
            font-weight: bold;
            color: #fbf7d5;
            position: relative;
            background: rgba(30, 30, 30, 0.9);
        }

        #pokerCalc-div td:nth-child(3),
        #pokerCalc-div td:nth-child(4) {
            font-weight: bold;
            color: #fbf7d5;
        }

        .rank-up {
            color: #70ff70 !important;
            text-shadow: 0 0 5px rgba(112, 255, 112, 0.5);
        }

        .rank-down {
            color: #ff7070 !important;
            text-shadow: 0 0 5px rgba(255, 112, 112, 0.5);
        }

        .similar-hand td {
            opacity: 0.7;
        }

        .best-hand {
            background: rgba(64, 195, 64, 0.2) !important;
            border-left: 4px solid #40c340 !important;
            animation: glowGreen 2s infinite alternate;
        }

        @keyframes glowGreen {
            0% { box-shadow: inset 0 0 5px rgba(64, 195, 64, 0.5); }
            100% { box-shadow: inset 0 0 15px rgba(64, 195, 64, 0.8); }
        }

        .best-hand td {
            color: #fbf7d5 !important;
            font-weight: bold;
        }

        .best-hand td:first-child {
            position: relative;
        }

        .best-hand td:first-child::before {
            content: '★';
            position: absolute;
            left: -20px;
            top: 50%;
            transform: translateY(-50%);
            color: #40c340;
            animation: starPulse 1.5s infinite alternate;
        }

        @keyframes starPulse {
            0% { transform: translateY(-50%) scale(1); opacity: 0.7; }
            100% { transform: translateY(-50%) scale(1.3); opacity: 1; }
        }

        .potential-best-hand {
            background: rgba(64, 64, 195, 0.2) !important;
            border-left: 4px solid #4040c3 !important;
            animation: glowBlue 2s infinite alternate;
        }

        @keyframes glowBlue {
            0% { box-shadow: inset 0 0 5px rgba(64, 64, 195, 0.5); }
            100% { box-shadow: inset 0 0 15px rgba(64, 64, 195, 0.8); }
        }

        .potential-best-hand td {
            color: #fbf7d5 !important;
            font-weight: bold;
        }

        .best-opp-hand {
            background: rgba(195, 64, 64, 0.2) !important;
            border-left: 4px solid #c34040 !important;
            animation: glowRed 2s infinite alternate;
        }

        @keyframes glowRed {
            0% { box-shadow: inset 0 0 5px rgba(195, 64, 64, 0.5); }
            100% { box-shadow: inset 0 0 15px rgba(195, 64, 64, 0.8); }
        }

        .best-opp-hand td {
            color: #fbf7d5 !important;
            font-weight: bold;
        }

        .ev-positive {
            border-left: 4px solid #40c340 !important;
            box-shadow: inset 3px 0 10px rgba(64, 195, 64, 0.3);
        }

        .ev-negative {
            border-left: 4px solid #c34040 !important;
            box-shadow: inset 3px 0 10px rgba(195, 64, 64, 0.3);
        }

        .bluff-alert {
            animation: pulse-red 1.5s infinite;
            position: relative;
        }

        .bluff-alert::before {
            content: '⚠️';
            position: absolute;
            left: -25px;
            animation: shakeWarning 0.8s infinite;
        }

        @keyframes shakeWarning {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
        }

        @keyframes pulse-red {
            0%, 100% {
                border-color: #c34040;
                box-shadow: 0 0 5px rgba(195, 64, 64, 0.6);
            }
            50% {
                border-color: #ff4040;
                box-shadow: 0 0 15px rgba(255, 64, 64, 0.9);
            }
        }

        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-8px);
            }
        }

        /* Card Icons in Statistics */
        span[class*="spades"], span[class*="hearts"],
        span[class*="clubs"], span[class*="diamonds"] {
            display: inline-block;
            font-size: 16px;
            margin: 0 1px;
            vertical-align: middle;
            filter: drop-shadow(0 2px 2px rgba(0,0,0,0.5));
        }

        span[class*="hearts"], span[class*="diamonds"] {
            color: #ff5555 !important;
        }

        span[class*="spades"], span[class*="clubs"] {
            color: #ffffff !important;
        }

        /* Neon Glow Effects */
        .neon-text {
            text-shadow:
                0 0 5px #fff,
                0 0 10px #fff,
                0 0 20px #fff,
                0 0 40px #0ff,
                0 0 80px #0ff,
                0 0 90px #0ff,
                0 0 100px #0ff,
                0 0 150px #0ff;
            animation: neonGlow 1.5s ease-in-out infinite alternate;
        }

        @keyframes neonGlow {
            from {
                text-shadow:
                    0 0 5px #fff,
                    0 0 10px #fff,
                    0 0 20px #fff,
                    0 0 40px #0ff,
                    0 0 80px #0ff,
                    0 0 90px #0ff,
                    0 0 100px #0ff,
                    0 0 150px #0ff;
            }
            to {
                text-shadow:
                    0 0 2px #fff,
                    0 0 5px #fff,
                    0 0 10px #fff,
                    0 0 20px #0ff,
                    0 0 40px #0ff,
                    0 0 60px #0ff,
                    0 0 70px #0ff,
                    0 0 100px #0ff;
            }
        }

       @keyframes neonGoldGlow {
    from {
        text-shadow:
            0 0 2px #fff,
            0 0 5px #fff,
            0 0 10px #ffb700,
            0 0 20px rgba(255, 183, 0, 0.5);
    }
    to {
        text-shadow:
            0 0 1px #fff,
            0 0 3px #fff,
            0 0 5px #ffb700,
            0 0 10px rgba(255, 183, 0, 0.3);
    }
}

        @keyframes neonGreenGlow {
    from {
        text-shadow:
            0 0 2px #fff,
            0 0 5px #fff,
            0 0 10px rgba(80, 225, 80, 0.4);
    }
    to {
        text-shadow:
            0 0 1px #fff,
            0 0 3px #fff,
            0 0 5px rgba(80, 225, 80, 0.2);
    }
}

       @keyframes neonOrangeGlow {
    from {
        text-shadow:
            0 0 2px #fff,
            0 0 5px #fff,
            0 0 10px rgba(240, 173, 78, 0.4);
    }
    to {
        text-shadow:
            0 0 1px #fff,
            0 0 3px #fff,
            0 0 5px rgba(240, 173, 78, 0.2);
    }
}

        @keyframes neonRedGlow {
    from {
        text-shadow:
            0 0 2px #fff,
            0 0 5px #fff,
            0 0 10px rgba(240, 80, 80, 0.4);
    }
    to {
        text-shadow:
            0 0 1px #fff,
            0 0 3px #fff,
            0 0 5px rgba(240, 80, 80, 0.2);
    }
}
        `;

        const style = document.createElement("style");
        style.type = "text/css";

        if (style.styleSheet) {
            style.styleSheet.cssText = styleText;
        } else {
            style.appendChild(document.createTextNode(styleText));
        }

        document.head.appendChild(style);
    } catch (e) {
        console.error("Error adding styles:", e);

        const minimalStyle = document.createElement("style");
        minimalStyle.textContent = "#pokerCalc-div { font-family: Arial; color: gold; background: #0a5f2a; padding: 20px; }";
        document.head.appendChild(minimalStyle);
    }
}
}

window.pokerCalculator = new PokerCalculatorModule();
window.pokerCalculator.addStatisticsTable();

window.addEventListener("hashchange", () => {
    if (window.location.href.includes("sid=holdem")) {
        if (!document.getElementById("pokerCalc-div")) {
            window.pokerCalculator = new PokerCalculatorModule();
            window.pokerCalculator.addStatisticsTable();
        }
    }
});

window.addEventListener("error", (e) => {
    if (e.message && e.message.includes("pokerCalculator")) {
        console.log("Poker Helper error detected, attempting to recover...");
        try {
            window.pokerCalculator = new PokerCalculatorModule();
            window.pokerCalculator.addStatisticsTable();
        } catch (err) {
            console.error("Could not recover poker helper:", err);
        }
    }
});

(() => {
    setTimeout(() => {
        const div = document.getElementById("pokerCalc-div");
        if (div) {
            const versionInfo = document.createElement("div");
            versionInfo.style.fontSize = "11px";
            versionInfo.style.color = "#d4af37";
            versionInfo.style.textAlign = "right";
            versionInfo.style.marginTop = "10px";
            versionInfo.style.letterSpacing = "0.5px";
            versionInfo.style.fontFamily = "'Roboto', sans-serif";
            versionInfo.style.textShadow = "0 1px 2px rgba(0,0,0,0.8)";
            versionInfo.innerHTML = "FlopMaster v1.0 <span style='opacity:0.7;'></span> <span style='font-size:9px;opacity:0.8;'></span>";
            div.appendChild(versionInfo);
        }
    }, 3000);
})();