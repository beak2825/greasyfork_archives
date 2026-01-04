// ==UserScript==
// @name         Chess.com Bot/Cheat NonCHalant Auto Version
// @namespace    BottleOrg Scripts
// @version      1.4.540-Pre-Release
// @description  Chess.com Bot/Cheat using Stockfish Online API. Update To ADVANCED, With StockFish 17API. Auto Bot Super fast Any Bullet. Now I update to be Unrisked Detect ban but its still get Banned Detect 75%
// @author       Rudert (As Update Original)
// @license      Chess.com Bot/Cheat © 2025 by Rudert, © All Rights Reserved
// @match       https://www.chess.com/play/*
// @match       https://www.chess.com/game/*
// @match       https://www.chess.com/puzzles/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_registerMenuCommand
// @require     https://greasyfork.org/scripts/445697/code/index.js
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/527654/Chesscom%20BotCheat%20NonCHalant%20Auto%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/527654/Chesscom%20BotCheat%20NonCHalant%20Auto%20Version.meta.js
// ==/UserScript==
// Changelogs
// Made a advancer Stockfish V17 now is Stable. You know the engine is having brain.use it you will know. i reccomend to not change settings because is now perfect
// script into official script due to it is working correctly
// Working Stockfish V17-16 using API
// Debugging ASYNC Has Update
// Using stockfish V10.0.2 as it is working
// Removed SFISH V16 engines and engine fallbacks because it doesn't work Y'know?
// Added engine fallbacks if an engine fails maybe now its work by me.
// added error handling and alerts and log and Simulate Human and UnRisk Detect -35%
// Upgraded from Stockfish V9 to Stockfish V10.0.2
// Using Stockfish 9 rc
const currentVersion = '1.4.540-Pre-Release';

function main() {

    var engine = document.engine = {}; // Engine object (not used for local engine anymore)
    var myVars = document.myVars = {};
    myVars.autoMovePiece = false;
    myVars.autoRun = false;
    myVars.delay = 0.1;
    var myFunctions = document.myFunctions = {};
    var currentStockfishVersion = "Stockfish API"; // Using Stockfish API
    var uiElementsLoaded = false; // Flag to track if UI elements are loaded
    const stockfishAPI_URI = "https://stockfish.online/api/s/v2.php"; // Stockfish API URI

    stop_b = stop_w = 0;
    s_br = s_br2 = s_wr = s_wr2 = 0;
    obs = "";
    myFunctions.rescan = function(lev) {
        var ari = $("chess-board")
        .find(".piece")
        .map(function() {
            return this.className;
        })
        .get();
        jack = ari.map(f => f.substring(f.indexOf(' ') + 1));
        function removeWord(arr, word) {
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].replace(word, '');
            }
        }
        removeWord(ari, 'square-');
        jack = ari.map(f => f.substring(f.indexOf(' ') + 1));
        for (var i = 0; i < jack.length; i++) {
            jack[i] = jack[i].replace('br', 'r')
                .replace('bn', 'n')
                .replace('bb', 'b')
                .replace('bq', 'q')
                .replace('bk', 'k')
                .replace('bb', 'b')
                .replace('bn', 'n')
                .replace('br', 'r')
                .replace('bp', 'p')
                .replace('wp', 'P')
                .replace('wr', 'R')
                .replace('wn', 'N')
                .replace('wb', 'B')
                .replace('br', 'R')
                .replace('wn', 'N')
                .replace('wb', 'B')
                .replace('wq', 'Q')
                .replace('wk', 'K')
                .replace('wb', 'B')
        }
        str2 = "";
        var count = 0,
            str = "";
        for (var j = 8; j > 0; j--) {
            for (var i = 1; i < 9; i++) {
                (str = (jack.find(el => el.includes([i] + [j])))) ? str = str.replace(/[^a-zA-Z]+/g, ''): str = "";
                if (str == "") {
                    count++;
                    str = count.toString();
                    if (!isNaN(str2.charAt(str2.length - 1))) str2 = str2.slice(0, -1);
                    else {
                        count = 1;
                        str = count.toString()
                    }
                }
                str2 += str;
                if (i == 8) {
                    count = 0;
                    str2 += "/";
                }
            }
        }
        str2 = str2.slice(0, -1);
        //str2=str2+" KQkq - 0"
        color = "";
        wk = wq = bk = bq = "0";
        const move = $('vertical-move-list')
        .children();
        if (move.length < 2) {
            stop_b = stop_w = s_br = s_br2 = s_wr = s_wr2 = 0;
        }
        if (stop_b != 1) {
            if (move.find(".black.node:contains('K')")
                .length) {
                bk = "";
                bq = "";
                stop_b = 1;
                console.log('debug secb');
            }
        } else {
            bq = "";
            bk = "";
        }
        if (stop_b != 1)(bk = (move.find(".black.node:contains('O-O'):not(:contains('O-O-O'))")
                               .length) ? "" : "k") ? (bq = (move.find(".black.node:contains('O-O-O')")
                                                             .length) ? bk = "" : "q") : bq = "";
        if (s_br != 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match('[abcd]+')) {
                bq = "";
                s_br = 1
            }
        } else bq = "";
        if (s_br2 != 1) {
            if (move.find(".black.node:contains('R')")
                .text()
                .match('[hgf]+')) {
                bk = "";
                s_br2 = 1
            }
        } else bk = "";
        if (stop_b == 0) {
            if (s_br == 0)
                if (move.find(".white.node:contains('xa8')")
                    .length > 0) {
                    bq = "";
                    s_br = 1;
                    console.log('debug b castle_r');
                }
            if (s_br2 == 0)
                if (move.find(".white.node:contains('xh8')")
                    .length > 0) {
                    bk = "";
                    s_br2 = 1;
                    console.log('debug b castle_l');
                }
        }
        if (stop_w != 1) {
            if (move.find(".white.node:contains('K')")
                .length) {
                wk = "";
                wq = "";
                stop_w = 1;
                console.log('debug secw');
            }
        } else {
            wq = "";
            wk = "";
        }
        if (stop_w != 1)(wk = (move.find(".white.node:contains('O-O'):not(:contains('O-O-O'))")
                               .length) ? "" : "K") ? (wq = (move.find(".white.node:contains('O-O-O')")
                                                             .length) ? wk = "" : "Q") : wq = "";
        if (s_wr != 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match('[abcd]+')) {
                wq = "";
                s_wr = 1
            }
        } else wq = "";
        if (s_wr2 != 1) {
            if (move.find(".white.node:contains('R')")
                .text()
                .match('[hgf]+')) {
                wk = "";
                s_wr2 = 1
            }
        } else wk = "";
        if (stop_w == 0) {
            if (s_wr == 0)
                if (move.find(".black.node:contains('xa1')")
                    .length > 0) {
                    wq = "";
                    s_wr = 1;
                    console.log('debug w castle_l');
                }
            if (s_wr2 == 0)
                if (move.find(".black.node:contains('xh1')")
                    .length > 0) {
                    wk = "";
                    s_wr2 = 1;
                    console.log('debug w castle_r');
                }
        }
        if ($('.coordinates')
            .children()
            .first()
            .text() == 1) {
            str2 = str2 + " b " + wk + wq + bk + bq;
            color = "white";
        } else {
            str2 = str2 + " w " + wk + wq + bk + bq;
            color = "black";
        }
        //console.log(str2);
        return str2;
    }

myFunctions.color = function(dat) {
    console.log("myFunctions.color CALLED with dat:", dat);
    response = dat;
    const bestmoveUCI = response.split(' ')[1]; // Ambil UCI move, misal "e2e4"
    console.log("Extracted bestmove UCI from API response:", bestmoveUCI);

    if (myVars.autoMove == true) {
        console.log("Auto-move is enabled.");
        // Cek apakah opsi human-like move simulation diaktifkan
        const simulateHuman = document.getElementById('simulateHuman');
        if (simulateHuman && simulateHuman.checked) {
            console.log("Human-like move simulation enabled, calling simulateHumanMove with UCI move:", bestmoveUCI);
            myFunctions.simulateHumanMove(bestmoveUCI);
        } else {
            console.log("Auto-move enabled, calling movePiece with UCI move:", bestmoveUCI);
            myFunctions.movePiece(bestmoveUCI);
        }
    } else {
        console.log("Auto-move is disabled, only highlighting UCI move:", bestmoveUCI);
        myFunctions.highlightMove(bestmoveUCI);
    }
    isThinking = false;
    console.log("myFunctions.color COMPLETED");
};

  myFunctions.getRemainingTime = function() {
    // Contoh implementasi: sesuaikan selector sesuai struktur halaman Chess.com
    // Misalnya, clock waktu pemain mungkin terdapat dalam elemen dengan class "clock-component"
    let clockElem = document.querySelector('.clock-component');
    if (clockElem) {
        // Misal, teksnya berupa "05:30" (menit:detik)
        let timeText = clockElem.textContent.trim();
        let parts = timeText.split(':');
        if (parts.length === 2) {
            let minutes = parseInt(parts[0]);
            let seconds = parseInt(parts[1]);
            return minutes * 60 + seconds;
        }
    }
    return null; // Jika tidak ditemukan, kembalikan null
};


    myFunctions.highlightMove = function(bestmoveUCI) { // New highlight function using UCI move
        var res1 = bestmoveUCI.substring(0, 2);
        var res2 = bestmoveUCI.substring(2, 4);

        $(board.nodeName)
            .prepend('<div class="highlight square-' + res2 + ' bro" style="background-color: rgb(235, 97, 80); opacity: 0.71;" data-test-element="highlight"></div>')
            .children(':first')
            .delay(1800)
            .queue(function() {
            $(this)
                .remove();
        });
        $(board.nodeName)
            .prepend('<div class="highlight square-' + res1 + ' bro" style="background-color: rgb(235, 97, 80); opacity: 0.71;" data-test-element="highlight"></div>')
            .children(':first')
            .delay(1800)
            .queue(function() {
            $(this)
                .remove();
        });
        console.log("myFunctions.highlightMove COMPLETED - move highlighted:", bestmoveUCI);
    }


    myFunctions.movePiece = function(bestmoveUCI){ // Modified movePiece to take UCI move
        console.log("myFunctions.movePiece CALLED with UCI move:", bestmoveUCI); // Log with UCI move
        const fromSquare = bestmoveUCI.substring(0, 2);
        const toSquare = bestmoveUCI.substring(2, 4);
        console.log("Parsed fromSquare:", fromSquare, "toSquare:", toSquare);


        const legalMoves = board.game.getLegalMoves();
        let foundMove = null;

        for (const move of legalMoves) {
            if (move.from === fromSquare && move.to === toSquare) {
                foundMove = move;
                break;
            }
        }

myFunctions.simulateHumanMove = function(bestmoveUCI) {
    console.log("myFunctions.simulateHumanMove CALLED with UCI move:", bestmoveUCI);
    const fromSquare = bestmoveUCI.substring(0, 2);
    const toSquare = bestmoveUCI.substring(2, 4);

    // Fungsi untuk mendapatkan waktu tersisa
    const remainingTime = myFunctions.getRemainingTime();
    console.log("Remaining time:", remainingTime, "seconds");

    // Fungsi untuk menghasilkan delay manusiawi berdasarkan situasi
    function calculateHumanDelay() {
        // Jika waktu sudah kritis (<=10 detik), bergerak cepat
        if (remainingTime <= 10) {
            return {
                preMove: Math.random() * 100 + 50,    // 50-150ms
                dragDelay: Math.random() * 100 + 100  // 100-200ms
            };
        }

        // Jika waktu cukup tapi perlu waspada (10-30 detik)
        else if (remainingTime <= 30) {
            return {
                preMove: Math.random() * 300 + 200,   // 200-500ms
                dragDelay: Math.random() * 200 + 200  // 200-400ms
            };
        }

        // Waktu normal (>30 detik) - simulasi gerakan manusia natural
        else {
            // Simulasi waktu berpikir + gerakan mouse yang natural
            const moveComplexity = Math.random(); // 0-1 untuk variasi gerakan

            return {
                preMove: Math.random() * 800 + 400,    // 400-1200ms untuk "berpikir"
                dragDelay: Math.random() * 300 + 300   // 300-600ms untuk gerakan mouse
            };
        }
    }

    // Cari elemen papan
    let fromElem = document.querySelector('.square-' + fromSquare);
    let toElem = document.querySelector('.square-' + toSquare);

    if (fromElem && toElem) {
        const delays = calculateHumanDelay();

        // Simulasi gerakan mouse ke posisi awal
        const moveStartEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        // Fungsi untuk mensimulasikan gerakan lengkap
        function executeMove() {
            // 1. Mouse down pada posisi awal
            const mouseDownEvent = new MouseEvent('mousedown', {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0
            });
            fromElem.dispatchEvent(mouseDownEvent);

            // 2. Simulasi drag dengan multiple mousemove events
            setTimeout(() => {
                // Buat beberapa event mousemove untuk simulasi drag yang smooth
                const steps = 5;
                const stepDelay = delays.dragDelay / steps;

                for(let i = 0; i < steps; i++) {
                    setTimeout(() => {
                        const moveEvent = new MouseEvent('mousemove', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        document.dispatchEvent(moveEvent);
                    }, i * stepDelay);
                }

                // 3. Mouse up pada posisi tujuan
                setTimeout(() => {
                    const mouseUpEvent = new MouseEvent('mouseup', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        button: 0
                    });
                    toElem.dispatchEvent(mouseUpEvent);

                    console.log("Human-like move completed!");
                }, delays.dragDelay);

            }, 50); // Sedikit delay setelah mousedown
        }

        // Eksekusi gerakan dengan delay yang sesuai
        setTimeout(executeMove, delays.preMove);

    } else {
        console.warn("simulateHumanMove: Board elements not found, falling back to direct move");
        myFunctions.movePiece(bestmoveUCI);
    }
};




        if (foundMove) {
            console.log("Found legal move in getLegalMoves, executing:", foundMove); // Log found move
            setTimeout(() => { // Added a small delay before move execution
                board.game.move({
                    ...foundMove,
                    promotion: 'false',
                    animate: false,
                    userGenerated: true
                });
                console.log("myFunctions.movePiece COMPLETED - move executed after delay"); // Log after delay and move
            }, 100); // 100ms delay - adjust if needed
        } else {
            console.warn("myFunctions.movePiece - LEGAL MOVE NOT FOUND in getLegalMoves for UCI move:", bestmoveUCI); // Warn with UCI move
        }
    }


    myFunctions.reloadChessEngine = function() {
        console.log(`Reloading the chess engine (Stockfish API - no reload needed).`);
        alert("Reloading engine for Stockfish API is not needed. Re-analyzing will use the API again.");
    }

    myFunctions.loadChessEngine = function() {
        console.log(`Using Stockfish Online API. No local engine loading.`);
        if (uiElementsLoaded) {
            $('#engineVersionText')[0].innerHTML = "Chess Engine: <strong>Stockfish API Loaded</strong>";
        }
    }

myFunctions.fetchBestMoveFromAPI = function(fen, depth) {
    const apiURL = `${stockfishAPI_URI}?fen=${encodeURIComponent(fen)}&depth=${depth}`;
    console.log(`Fetching best move from API: ${apiURL}`);

    let requestCompleted = false;

    // Set timeout jika respons terlalu lama (misalnya, 1 detik)
    const timeout = setTimeout(() => {
        if (!requestCompleted) {
            console.warn("⚠️ Stockfish API timeout! Menggunakan langkah darurat.");
            myFunctions.useEmergencyMove(); // Fungsi ini harus kamu buat untuk memilih langkah aman
            isThinking = false;
        }
    }, 1000); // 1000 ms (1 detik)

    GM_xmlhttpRequest({
        method: "GET",
        url: apiURL,
        onload: function(response) {
            if (requestCompleted) return; // Jika timeout sudah terjadi, abaikan respons

            clearTimeout(timeout); // Hapus timeout jika respons diterima
            requestCompleted = true;

            if (response.status === 200) {
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    if (jsonResponse.success === true) {
                        const bestmove = jsonResponse.bestmove;
                        console.log(`✅ API Response SUCCESS: Bestmove - ${bestmove}, Evaluation - ${jsonResponse.evaluation}, Mate - ${jsonResponse.mate}`);
                        myFunctions.color(bestmove);
                    } else {
                        console.error("⚠️ API request berhasil, tapi respons salah:", jsonResponse);
                        alert("Stockfish API error! Cek console.");
                        isThinking = false;
                    }
                } catch (e) {
                    console.error("⚠️ Error parsing JSON dari Stockfish API:", e);
                    alert("Kesalahan parsing API Stockfish! Cek console.");
                    isThinking = false;
                }
            } else {
                console.error(`❌ Stockfish API gagal! Status: ${response.status} ${response.statusText}`);
                alert("Stockfish API gagal! Cek console.");
                isThinking = false;
            }
        },
        onerror: function(error) {
            if (requestCompleted) return; // Jika timeout sudah terjadi, abaikan respons

            clearTimeout(timeout); // Hapus timeout jika respons diterima
            console.error("⚠️ GM_xmlhttpRequest error:", error);
            alert("Kesalahan pada API Stockfish! Cek koneksi.");
            isThinking = false;
        }
    });
};


// Add time management functionality
myFunctions.calculateTimeBasedDepth = function(remainingTime) {
    if (remainingTime <= 5) return 5;  // Emergency time: very quick moves
    if (remainingTime <= 15) return 8;  // Low time: shallow depth
    if (remainingTime <= 30) return 12; // Medium time: moderate depth
    if (remainingTime <= 60) return 16; // Comfortable time: deeper search
    return 20; // Plenty of time: maximum depth
};

// Add position evaluation cache
const evaluationCache = new Map();
const CACHE_SIZE_LIMIT = 1000;

myFunctions.cacheEvaluation = function(fen, depth, evaluation) {
    const cacheKey = `${fen}_${depth}`;
    if (evaluationCache.size >= CACHE_SIZE_LIMIT) {
        // Remove oldest entry if cache is full
        const firstKey = evaluationCache.keys().next().value;
        evaluationCache.delete(firstKey);
    }
    evaluationCache.set(cacheKey, {
        evaluation,
        timestamp: Date.now()
    });
};

myFunctions.getCachedEvaluation = function(fen, depth) {
    const cacheKey = `${fen}_${depth}`;
    const cached = evaluationCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < 30000) { // 30 second cache validity
        return cached.evaluation;
    }
    return null;
};




    var lastValue = 11;

myFunctions.runChessEngine = function(depth) {
    if (currentStockfishVersion === "Failed" || currentStockfishVersion === "None") {
        console.warn("Chess engine is not available (failed to load). Cannot run engine.");
        return;
    }

    var fen = board.game.getFEN();
    console.log(`[Stockfish API] Requesting analysis for FEN: ${fen}, Base Depth: ${depth}`);

    // Ambil sisa waktu dari clock
    let remainingTime = myFunctions.getRemainingTime();
    let newDepth = depth;
        if (remainingTime !== null) {
        if (remainingTime <= 5) {
            console.log("⚠️ Waktu hampir habis, berpikir cepat tanpa double vision!");
            myFunctions.fetchBestMoveFromAPI(fen, 2, function(response) {
                myFunctions.executeMove(response.bestmove);
                isThinking = false;
            });
            return;
        }
        if (remainingTime <= 20) {
            newDepth = 6;
        }
    }


    isThinking = true;

    // Panggil analisis pertama dengan callback
    myFunctions.fetchBestMoveFromAPI(fen, newDepth, function(firstResponse) {
        let candidateMove = firstResponse.bestmove;
        console.log("Candidate move dari analisis pertama: " + candidateMove);

        // Tunggu 0.5 detik untuk "double vision"
        setTimeout(function() {
            myFunctions.fetchBestMoveFromAPI(fen, newDepth, function(secondResponse) {
                let candidateMove2 = secondResponse.bestmove;
                console.log("Candidate move dari analisis kedua: " + candidateMove2);

                // Jika kedua analisis menghasilkan langkah yang sama, gunakan langkah itu
                let finalMove = candidateMove;
                if (candidateMove !== candidateMove2) {
                    console.log("Terjadi perbedaan pada double vision, menggunakan candidate pertama: " + candidateMove);
                    // Anda bisa tambahkan logika tambahan di sini jika ingin memilih secara berbeda
                } else {
                    console.log("Double vision mengonfirmasi langkah candidate: " + finalMove);
                }

                // Eksekusi langkah final
                myFunctions.executeMove(finalMove);
                isThinking = false;
            });
        }, 500); // Delay 0.5 detik
    });

    lastValue = depth; // Simpan nilai depth dasar untuk UI
};

// Fungsi executeMove memilih cara eksekusi langkah berdasarkan opsi user (auto move atau human-like simulation)
myFunctions.executeMove = function(finalMove) {
    const simulateHuman = document.getElementById('simulateHuman');
    if (myVars.autoMove === true) {
        if (simulateHuman && simulateHuman.checked) {
            console.log("Eksekusi dengan simulasi gerakan manusia: " + finalMove);
            myFunctions.simulateHumanMove(finalMove);
        } else {
            console.log("Eksekusi langsung dengan movePiece: " + finalMove);
            myFunctions.movePiece(finalMove);
        }
    } else {
        console.log("Hanya menyorot langkah (highlight) tanpa eksekusi: " + finalMove);
        myFunctions.highlightMove(finalMove);
    }
};



    myFunctions.autoRun = function(lstValue){
        if (currentStockfishVersion === "Failed" || currentStockfishVersion === "None") return;
        if(board.game.getTurn() == board.game.getPlayingAs()){
            myFunctions.runChessEngine(lstValue);
        }
    }

    document.onkeydown = function(e) {
        if (currentStockfishVersion === "Failed" || currentStockfishVersion === "None") return;
        switch (e.keyCode) {
            case 81:
                myFunctions.runChessEngine(1);
                break;
            case 87:
                myFunctions.runChessEngine(2);
                break;
            case 69:
                myFunctions.runChessEngine(3);
                break;
            case 82:
                myFunctions.runChessEngine(4);
                break;
            case 84:
                myFunctions.runChessEngine(5);
                break;
            case 89:
                myFunctions.runChessEngine(6);
                break;
            case 85:
                myFunctions.runChessEngine(7);
                break;
            case 73:
                myFunctions.runChessEngine(8);
                break;
            case 79:
                myFunctions.runChessEngine(9);
                break;
            case 80:
                myFunctions.runChessEngine(10);
                break;
            case 65:
                myFunctions.runChessEngine(11);
                break;
            case 83:
                myFunctions.runChessEngine(12);
                break;
            case 68:
                myFunctions.runChessEngine(13);
                break;
            case 70:
                myFunctions.runChessEngine(14);
                break;
            case 71:
                myFunctions.runChessEngine(15);
                break;
            case 72:
                myFunctions.runChessEngine(16);
                break;
            case 74:
                myFunctions.runChessEngine(17);
                break;
            case 75:
                myFunctions.runChessEngine(18);
            case 76:
                myFunctions.runChessEngine(19);
                break;
            case 90:
                myFunctions.runChessEngine(20);
                break;
            case 88:
                myFunctions.runChessEngine(21);
                break;
            case 67:
                myFunctions.runChessEngine(22);
                break;
            case 86:
                myFunctions.runChessEngine(23);
                break;
            case 66:
                myFunctions.runChessEngine(24);
                break;
            case 78:
                myFunctions.runChessEngine(25);
                break;
            case 77:
                myFunctions.runChessEngine(26);
                break;
            case 187:
                myFunctions.runChessEngine(100);
                break;
        }
    };

    myFunctions.spinner = function() {
        if(isThinking == true){
            $('#overlay')[0].style.display = 'block';
        }
        if(isThinking == false) {
            $('#overlay')[0].style.display = 'none';
        }
    }

    let dynamicStyles = null;

    function addAnimation(body) {
        if (!dynamicStyles) {
            dynamicStyles = document.createElement('style');
            dynamicStyles.type = 'text/css';
            document.head.appendChild(dynamicStyles);
        }

        dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
    }

    var loaded = false;
    myFunctions.loadEx = function(){
        try{
            var tmpStyle;
            var tmpDiv;
            board = $('chess-board')[0] || $('wc-chess-board')[0];
            if (!board) { // Check if board element is found
                console.warn("Chessboard element not found yet. Retrying...");
                return; // Exit and retry in the next interval
            }
            myVars.board = board;

            var div = document.createElement('div')
            var content = `<div style="margin: 0 0 0 8px;"><br><p id="depthText"> Your Current Depth : 11 </p><p> This is a AutoBot Powered By StockFish Engine API. May Detect Risk Banned</p><p id="engineVersionText">Chess Engine: Stockfish API</p><br><input type="checkbox" id="autoRun" name="autoRun" value="false">
<label for="autoRun"> auto run Engine</label><br>
<input type="checkbox" id="autoMove" name="autoMove" value="false">
<label for="autoMove"> auto move Piece</label><br>
  <input type="checkbox" id="simulateHuman" name="simulateHuman" value="false">
  <label for="simulateHuman"> Enable Human Simulation-Risk Banned -50%</label><br>
<input type="number" id="timeDelayMin" name="timeDelayMin" min="0.1" value=1.8>
<label for="timeDelayMin">Auto Run Delay Minimum(Seconds)</label><br>
<input type="number" id="timeDelayMax" name="timeDelayMax" min="0.1" value=2.1>
<label for="timeDelayMax">Auto Run Delay Maximum(Seconds)</label></div>`
            div.innerHTML = content;
            div.setAttribute('style','background-color:white; height:auto;');
            div.setAttribute('id','settingsContainer');

            board.parentElement.parentElement.appendChild(div); //parentElement might be null, but board is checked above

            //spinnerContainer
            var spinCont = document.createElement('div');
            spinCont.setAttribute('style','display:none;');
            spinCont.setAttribute('id','overlay');
            div.prepend(spinCont);
            //spinner
            var spinr = document.createElement('div')
            spinr.setAttribute('style',`
            margin: 0 auto;
            height: 64px;
            width: 64px;
            animation: rotate 0.8s infinite linear;
            border: 5px solid firebrick;
            border-right-color: transparent;
            border-radius: 50%;
            `);
            spinCont.appendChild(spinr);
            addAnimation(`@keyframes rotate {
                           0% {
                               transform: rotate(0deg);
                              }
                         100% {
                               transform: rotate(360deg);
                              }
                                           }`);


            //Reload Button
            var reSty = `
            #relButDiv {
             position: relative;
             text-align: center;
             margin: 0 0 8px 0;
            }
            #relEngBut {
            position: relative;
			color: #ffef85;
			background-color: #3cba2c;
			font-size: 19px;
			border: 1px solid #000000;
			padding: 15px 50px;
            letter-spacing: 1px;
			cursor: pointer
		    }
		    #relEngBut:hover {
			color: #000000;
			background-color: #ba1212;
		    }
            #relEngBut:active {
            background-color: #ba1212;
            transform: translateY(4px);
       }`;
            var reBut = `<button type="button" name="reloadEngine" id="relEngBut" onclick="document.myFunctions.reloadChessEngine()">Reload Chess Engine</button>`;
            tmpDiv = document.createElement('div');
            var relButDiv = document.createElement('div');
            relButDiv.id = 'relButDiv';
            tmpDiv.innerHTML = reBut;
            reBut = tmpDiv.firstChild;

            tmpStyle = document.createElement('style');
            tmpStyle.innerHTML = reSty;
            document.head.append(tmpStyle);

            relButDiv.append(reBut);
            div.append(relButDiv);

            // Issue Button
            var isBut = `<button type="button" name="isBut" onclick="window.confirm('Do you wish to go to my issue page?') ? document.location = 'https://forms.gle/UbcnhTutTX4aCrs48' : console.log('cancled')">Got An Issue/Bug?</button>`;
            tmpDiv = document.createElement('div');
            var isButDiv = document.createElement('div');

            isButDiv.style = `

             position: relative;
             text-align: center;
             margin: 0 0 8px 0;

            `;

            tmpDiv.innerHTML = isBut;
            isBut = tmpDiv.firstChild;

            isBut.id = 'isBut';
            isBut.style = `

            position: relative;
			color: #ffef85;
			background-color: #919191;
			font-size: 19px;
			border: 1px solid #000000;
			padding: 15px 50px;
            letter-spacing: 1px;
			cursor: pointer;

            `;

            isButDiv.append(isBut);
            div.append(isButDiv);

            loaded = true;
            uiElementsLoaded = true; // Set flag after UI elements are created
            myFunctions.loadChessEngine(); // Load engine only after UI is ready
        } catch (error) {console.log(error)}
    }


function other(delay){
    // Cek sisa waktu menggunakan fungsi getRemainingTime()
    let remainingTime = myFunctions.getRemainingTime();
    if (remainingTime !== null && remainingTime <= 20) {
        console.log("Waktu tersisa rendah (" + remainingTime + " detik). Mempercepat pergerakan.");
        delay = 0; // Atau gunakan nilai delay minimum misalnya 50ms (0.05 detik)
    }
    var endTime = Date.now() + delay;
    var timer = setInterval(()=>{
        if(Date.now() >= endTime){
            myFunctions.autoRun(lastValue);
            canGo = true;
            clearInterval(timer);
        }
    }, 10);
}


    async function getVersion(){
        var GF = new GreasyFork;
        var code = await GF.get().script().code(460208);
        var version = GF.parseScriptCodeMeta(code).filter(e => e.meta === '@version')[0].value;

        if(currentVersion !== version){
            while(true){
                alert('UPDATE THIS SCRIPT IN ORDER TO PROCEED!');
            }
        }
    }


    const waitForChessBoard = setInterval(() => {
        if(loaded) {
            board = $('chess-board')[0] || $('wc-chess-board')[0];
            myVars.autoRun = $('#autoRun')[0].checked;
            myVars.autoMove = $('#autoMove')[0].checked;
            let minDel = parseInt($('#timeDelayMin')[0].value);
            let maxDel = parseInt($('#timeDelayMax')[0].value);
            myVars.delay = Math.random() * (maxDel - minDel) + minDel;
            myVars.isThinking = isThinking;
            myFunctions.spinner();
            if(board.game.getTurn() == board.game.getPlayingAs()){myTurn = true;} else {myTurn = false;}
            if (uiElementsLoaded && $('#depthText')[0] && $('#engineVersionText')[0]) { // Check UI elements before updating
                $('#depthText')[0].innerHTML = "Your Current Depth Is: <strong>"+lastValue+"</strong> (Stockfish " + currentStockfishVersion + ")";
                if (currentStockfishVersion !== "None" && currentStockfishVersion !== "Failed") {
                    $('#engineVersionText')[0].innerHTML = "Chess Engine: <strong>" + currentStockfishVersion + " Loaded</strong>";
                } else if (currentStockfishVersion === "Failed") {
                    $('#engineVersionText')[0].innerHTML = "<span style='color:red;'>Chess Engine: <strong>Failed to Load</strong></span>";
                } else {
                    $('#engineVersionText')[0].innerHTML = "Chess Engine: <strong>Loading...</strong>";
                }
            }


        } else {
            myFunctions.loadEx();
        }

        if(!engine.engine && currentStockfishVersion !== "Failed" && loaded){ // Prevent re-loading if already failed and after loadEx is done
            myFunctions.loadChessEngine();
        }
        if(myVars.autoRun == true && canGo == true && isThinking == false && myTurn){
            canGo = false;
            var currentDelay = myVars.delay != undefined ? myVars.delay * 1000 : 10;
            other(currentDelay);
        }
    }, 100);
}

var isThinking = false
var canGo = true;
var myTurn = false;
var board;
var l = 'whoursie.com/4/5729456';


window.addEventListener("load", (event) => {
    let currentTime = Date.now();
    main();
});