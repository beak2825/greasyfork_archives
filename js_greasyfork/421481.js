// ==UserScript==
// @name         S0urce.IO Bot by IO Hacks
// @namespace    https://iohack.cms.webnode.fr/s0urce-io/
// @version      0.1
// @description  AutoTarget, AutoAttack, AutoUpgrade, AutoPurchase, AutoWrite for S0urce.io
// @author       IO Hacks
// @match        http://s0urce.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421481/S0urceIO%20Bot%20by%20IO%20Hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/421481/S0urceIO%20Bot%20by%20IO%20Hacks.meta.js
// ==/UserScript==

let config, vars, app, loops, gui;
config = {
    message: "hi'",
    autoTarget: true,
    autoAttack: true,
    db: "https://raw.githubusercontent.com/snollygolly/sourceio-automation/master/db.json",
    freq: {
        word: 750,
        mine: 1500,
        upgrade: 2250,
        broke: 3000,
        hack: 1750
    },
    playerToAttack: 0,
    maxHackFails: 5,
    maxMinerLevel: 20,
    maxQBLevel: 50,
    maxUpgradeCost: .33,
    gui: {
        enabled: true,
        width: "320px",
        height: "412px"
    },
    ocr: {
        enabled: false,
        url: "http://api.ocr.space/parse/image",
        key: "XXX"
    }
};
vars = {

    listingURL: {},

    listingB64: {},

    balance: 0,
    flags: {

        ocrBlock: false,

        progressBlock: false
    },
    loops: {
        word: null,
        upgrade: null,
        miner: null
    },
    hackProgress: 0,
    hackFailures: 0,

    minerStatus: [
        {name: "shop-basic-miner", value: 0},
        {name: "shop-advanced-miner", value: 0},
        {name: "shop-mining-drill", value: 0},
        {name: "shop-data-center", value: 0},
        {name: "shop-bot-net", value: 0},
        {name: "shop-quantum-server", value: 0}
    ],
    fireWall: [
        {name: "A", index: 1, needUpgrade: true},
        {name: "B", index: 2, needUpgrade: true},
        {name: "C", index: 3, needUpgrade: true},
        {name: "ALL", needUpgrade: true}
    ],
    gui: {
        dragReady: false,
        dragOffset: {x: 0, y: 0}
    }
};

app = {
    start: () => {
        $.get(config.db).done((data) => {
            vars.listingB64 = JSON.parse(data);

            if ($("#player-list").is(":visible") === false) {
                log("* Target list must be open");
                $("#desktop-list").children("img").click();
            }
            if ($("#window-shop").is(":visible") === false) {
                log("* Black market must be open");
                $("#desktop-shop").children("img").click();
                $("#desktop-miner").children("img").click();
            }
            if ($("#window-computer").is(":visible") === false) {
                log("* My computer must be open");
                $("#desktop-computer").children("img").click();
            }
            if (config.gui.enabled === true) {
                if ($("#custom-gui").is(":visible") === false) {
                    log("* Opening bot window");
                    gui.show();
                }
            } else {
                log("* GUI disabled, skipping...");
            }

            app.automate();
        });
    },
    restart: () => {
        app.stop();
        log(". Waiting for restart...");
        setTimeout(() => {
            log(". Restarting!");
            app.automate();
        }, config.freq.hack);
    },
    stop: () => {

        for (const loop in vars.loops) {
            if (vars.loops[loop] === null) {
                log(`! Can't stop ${loop} loop`);
                continue;
            }
            clearInterval(vars.loops[loop]);
            vars.loops[loop] = null;
        }
        vars.hackProgress = 0;

        vars.flags.ocrBlock = false;
        vars.flags.progressBlock = false;
        log("* Stopped all hacking");
    },
    automate: () => {

        app.attack();

        vars.loops.miner = setInterval(loops.miner, config.freq.mine);

        vars.loops.upgrade = setInterval(loops.upgrade, config.freq.upgrade);
    },
    attack: () => {

        if (config.autoTarget) {

            const rndTarget = getRandomInt(config.playerToAttack, config.playerToAttack + 3);

            const targetName = $("#player-list").children("tr").eq(rndTarget)[0].innerText;
            log(`. Now attacking ${targetName}`);

            $("#player-list").children("tr").eq(rndTarget)[0].click();
            $("#window-other-button").click();
        }

        if (config.autoAttack) {
            const portNumber = getRandomInt(1,3);

            const portStyle = $(`#window-other-port${portNumber}`).attr("style");
            if (portStyle.indexOf("opacity: 1") === -1) {

                log("* Hack too expensive, waiting");
                setTimeout(app.attack, config.freq.broke);
                return;
            }
            $(`#window-other-port${portNumber}`).click();
        }
        vars.loops.word = setInterval(loops.word, config.freq.word);
    },
    findWord: () => {
        const wordLink = $(".tool-type-img").prop("src");
        if (!wordLink.endsWith("s0urce.io/client/img/words/template.png")) {
            if (vars.listingURL.hasOwnProperty(wordLink) === true) {
                const word = vars.listingURL[wordLink];
                log(`. Found word (URL): [${word}]`);
                app.submit(word);
                return;
            }
            toDataURL(wordLink).then((dataUrl) => {
                const hash = getHashCode(dataUrl);
                if (vars.listingB64.hasOwnProperty(hash) === true) {
                    const word = vars.listingB64[hash];
                    log(`. Found word (B64): [${word}]`);
                    app.learn(word);
                    return;
                }
                if (config.ocr.enabled === true) {
                    log("* Not seen, trying OCR...");
                    app.doOCR(config.ocr.url, {
                        apikey: config.ocr.key,
                        language: "eng",
                        url: wordLink
                    });
                } else {
                    log("* OCR disabled, skipping...");
                }
            });
        } else {
            log("* Can't find the word link...");

            if ($("#cdm-text-container span:last").text() === "Target is disconnected from the Server." && !config.autoTarget) {
                $("#custom-autoTarget-button").click();
            }
            app.restart();
        }
    },
    learn: (word) => {
        const wordLink = $(".tool-type-img").prop("src");
        vars.listingURL[wordLink] = word;
        app.submit(word);
    },
    submit: (word) => {
        $("#tool-type-word").val(word);
        $("#tool-type-word").submit();
    },
    doOCR: (link, payload) => {
        vars.flags.ocrBlock = true;

        $.post(link, payload).done((data) => {
            const word = String(data["ParsedResults"][0]["ParsedText"]).trim().toLowerCase().split(" ").join("");
            if (word.length > 2) {
                log(`. Got data: [${word}]`);
                $("#tool-type-word").val(word);
                app.learn(word);
                vars.flags.ocrBlock = false;
            } else {
                log("* OCR failed");
                app.restart();
            }
        });
    }
};
loops = {
    word: () => {

        if (vars.flags.ocrBlock === true) {
            return;
        }
        if ($("#targetmessage-input").is(":visible") === true) {

            $("#targetmessage-input").val(config.message);
            $("#targetmessage-button-send").click();
            app.restart();
            return;
        }

        if (vars.flags.progressBlock === true) {
            const newHackProgress = parseHackProgress($("#progressbar-firewall-amount").attr("style"));

            if (vars.hackProgress === newHackProgress) {

                log("* Progress bar hasn't moved, waiting");
                vars.hackFails++;
                if (vars.hackFails >= config.maxHackFails) {
                    vars.hackFails = 0;
                    log("* Progress bar is stuck, restarting");

                    vars.listingURL = {};
                    app.restart();
                }
                return;
            }

            vars.hackFails = 0;
            vars.hackProgress = newHackProgress;
            vars.flags.progressBlock = false;
        }

        vars.flags.progressBlock = true;
        app.findWord();
    },
    miner: () => {

        for (const miner of vars.minerStatus) {

            miner.value = parseInt($(`#${miner.name}-amount`).text());

            if ($(`#${miner.name}`).attr("style") === "opacity: 1;") {

                if (miner.value >= config.maxQBLevel) {

                    continue;
                }

                const isAdvancedMiner = (miner.name === "shop-quantum-server" || miner.name === "shop-bot-net") ? true : false;
                if (miner.value >= config.maxMinerLevel && isAdvancedMiner === false) {

                    continue;
                }

                $(`#${miner.name}`).click();
            }
        }
    },
    upgrade: () => {

        if (!vars.fireWall[3].needUpgrade)
            return;

        const i = getRandomInt(0,2);

        const index = vars.fireWall[i].index;

        if (!vars.fireWall[i].needUpgrade)
            vars.loops.upgrade();
        vars.balance = parseInt($("#window-my-coinamount").text());

        if ($("#window-firewall-pagebutton").is(":visible") === true) {
            $("#tutorial-firewall").css("display","none");
            $("#window-firewall-pagebutton").click();
        }

        log(`. Handling upgrades to firewall ${vars.fireWall[i].name}`);
        $(`#window-firewall-part${index}`).click();
        const stats = [
            parseInt($("#shop-max-charges").text()), parseInt($("#shop-strength").text()), parseInt($("#shop-regen").text())
        ];
        const statLookup = [
            "max_charge10", "difficulty", "regen"
        ];
        const maxStats = [
            30, 4, 10
        ];
        let maxUpgradeCount = 0;
        for (const stat in maxStats) {
            if (stats[stat] < maxStats[stat]) {
                const statPrice = parseInt($(`#shop-firewall-${statLookup[stat]}-value`).text());
                if (statPrice < (vars.balance * config.maxUpgradeCost)) {
                    log(`. Buying: ${$(".window-shop-element-info b").eq(stat).text()}`);
                    $(`#shop-firewall-${statLookup[stat]}`).click();

                }
            } else {
                maxUpgradeCount++;
                if (maxUpgradeCount === 3) {
                    vars.fireWall[i].needUpgrade = false;
                    if (vars.fireWall.every(checkFirewallsUpgrades))
                        vars.fireWall[3].needUpgrade = false;
                }
            }
        }

        if ($("#window-firewall-pagebutton").is(":visible") === true) {
            $("#window-firewall-pagebutton").click();
        }
    }
};
gui = {
    show: () => {
        if ($("#custom-gui").length > 0) {
            $("#custom-gui").show();
        }
        const sizeCSS = `height: ${config.gui.height}; width: ${config.gui.width};`;
        const labelMap = {
            word: "Word Time",
            mine: "Buy Time",
            upgrade: "Upgrade Time",
            hack: "Hack Time"
        };
        const freqInput = (type) => {
            return `<span style="font-size:15px">
                ${labelMap[type]}:
                <input type="text" class="custom-gui-freq input-form" style="width:50px;margin:0px 0px 15px 5px;border:" value="${config.freq[type]}" data-type="${type}">
                <span>(ms)</span><br>
            </span>`;
        };
        const botWindowHTML = `
        <div id="custom-gui" class="window" style="border-color: rgb(62, 76, 95); color: rgb(191, 207, 210); ${sizeCSS} z-index: 10; top: 11.5%; left: 83%;">
            <div id="custom-gui-bot-title" class="window-title" style="background-color: rgb(62, 76, 95);">
                Source.io Bot by IO Hacks
                <span class="window-close-style">
                    <img class="window-close-img" src="http://s0urce.io/client/img/icon-close.png">
                </span>
            </div>
            <div class="window-content" style="${sizeCSS}">
                <div id="custom-restart-button" class="button" style="display: block; margin-bottom: 15px">
                    Start
                </div>
                <div id="custom-stop-button" class="button" style="display: block; margin-bottom: 15px">
                    Stop
                </div>
                <div id="custom-autoTarget-button" class="button" style="display: block; margin-bottom: 15px">
                    AutoTarget
                </div>
                <div id="custom-autoAttack-button" class="button" style="display: block; margin-bottom: 15px">
                    AutoHack
                </div>
                <br><br>
                ${freqInput("word")}
                ${freqInput("mine")}
                ${freqInput("upgrade")}
                ${freqInput("hack")}
                <br><br>
                <div id="custom-github-button" class="button" style="display: block;">
                    Check our Website
                </div>
            </div>
        </div>`;
        $(".window-wrapper").append(botWindowHTML);

        $("#custom-autoTarget-button").css("color", config.autoTarget ? "green" : "red");
        $("#custom-autoAttack-button").css("color", config.autoAttack ? "green" : "red");

        $("#custom-gui-bot-title > span.window-close-style").on("click", () => {
            $("#custom-gui").hide();
        });
        $("#custom-restart-button").on("click", () => {
            app.restart();
        });
        $("#custom-stop-button").on("click", () => {
            app.stop();
        });
        $("#custom-autoTarget-button").on("click", () => {
            config.autoTarget = !config.autoTarget;
            $("#custom-autoTarget-button").css("color", config.autoTarget ? "green" : "red");
        });
        $("#custom-autoAttack-button").on("click", () => {
            config.autoAttack = !config.autoAttack;
            $("#custom-autoAttack-button").css("color", config.autoAttack ? "green" : "red");
        });
        $("#custom-github-button").on("click", () => {
            window.open("");
        });
        $(".custom-gui-freq").on("keypress", (e) => {
            if (e.keyCode !== 13) {
                return;
            }
            const type = $(e.target).attr("data-type");
            if (!config.freq[type]) {

                return;
            }
            config.freq[type] = $(e.target).val();
            log(`* Frequency for '${type}' set to ${config.freq[type]}`);
        });
        $(".custom-gui-msg").on("keypress", (e) => {
            if (e.keyCode !== 13) {
                return;
            }
            config.message = $(e.target).val();
            log(`* Message for  set to : ${config.message}`);
        });

        const botWindow = ("#custom-gui");
        $(document).on("mousedown", botWindow, (e) => {
            vars.gui.dragReady = true;
            vars.gui.dragOffset.x = e.pageX - $(botWindow).position().left;
            vars.gui.dragOffset.y = e.pageY - $(botWindow).position().top;
        });
        $(document).on("mouseup", botWindow, () => {
            vars.gui.dragReady = false;
        });
        $(document).on("mousemove", (e) => {
            if (vars.gui.dragReady) {
                $(botWindow).css("top", `${e.pageY - vars.gui.dragOffset.y}px`);
                $(botWindow).css("left", `${e.pageX - vars.gui.dragOffset.x}px`);
            }
        });
    }
};
function checkFirewallsUpgrades(FW, index) {
    if (index === 3)
        return true;
    return FW.needUpgrade === false;
}
function parseHackProgress(progress) {
    // remove the %;
    const newProgress = progress.slice(0, -2);
    const newProgressParts = newProgress.split("width: ");
    return parseInt(newProgressParts.pop());
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getHashCode(data) {
    let hash = 0;
    if (data.length === 0) {
        return hash;
    }
    for (let i = 0; i < data.length; i++) {
        const c = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + c;
        hash &= hash;
    }
    return hash.toString();
}
function toDataURL(url) {
    return fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }));
}
function log(message) {
    console.log(`:: ${message}`);
}
app.start()