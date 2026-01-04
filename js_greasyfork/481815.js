

    // ==UserScript==
    // @name         SDL evo2
    // @version      0.2
    // @license MIT 
    // @description  Extension du jeu seduis-les.fr
    // @match        *://*.seduis-les.fr/seduire_new.php?scen=*
    // @author       Un nouveau Khey, qui remercie "Un Khey Sûr"
    // @grant        none
    // @namespace https://greasyfork.org/users/706973
// @downloadURL https://update.greasyfork.org/scripts/481815/SDL%20evo2.user.js
// @updateURL https://update.greasyfork.org/scripts/481815/SDL%20evo2.meta.js
    // ==/UserScript==
     
     
    let script = [];
    let path = [];
    let playing = false;
    let queueStep = false;
     
    const core = {
        ready: async () => {
            await utils.waitFor(() => {
                const coco = document.getElementById("coco");
                return coco && coco.style && coco.style["background-image"] && coco.style["background-image"] !== "";
            });
        },
     
        isGameOver: () => {
            const coco = document.getElementById("coco");
            return coco.style["background-image"].includes("go.jpg");
        },
     
        getGame: () => {
            const title = document.querySelector("body > div:nth-child(7) > table > tbody > tr > td > table:nth-child(4) > tbody > tr:nth-child(1) > td:nth-child(2)").innerHTML.split(":")[1].trim();
            const question = document.querySelector("#txtItem > table:nth-child(1) > tbody > tr > td:nth-child(2) > table.style7 > tbody > tr > td").innerText.trim();
            const table = document.querySelectorAll("#txtItem > table:nth-child(1) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > a");
            let answers = [];
            let str = question;
     
            for (let elem of table) {
                answers.push(elem.innerText.trim());
            }
     
            answers = answers.sort();
     
            for (let answer of answers) {
                str += answer;
            }
     
            answers = answers.sort();
     
            return {
                title,
                question,
                answers,
                hash: utils.hashCode(str)
            }
        },
     
        getPath: () => {
            return path;
        },
     
        play: () => {
            playing = true;
            core.processScript(core.getGame());
        },
     
        stop: () => {
            queueStep = false;
            playing = false;
        },
     
        step: () => {
            queueStep = true;
            core.processScript(core.getGame());
        },
     
        processScript: (game) => {
            let answer = null;
            let i = 0;
            for (let entry of script) {
                i++;
                if (!entry.h || !entry.r || !entry.q) {
                    alert("invalid line " + i);
                    return;
                }
                if (entry.h === game.hash && entry.q === game.question) {
                    answer = entry.r;
                    break;
                }
            }
     
            const table = document.querySelectorAll("#txtItem > table:nth-child(1) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > a");
            for (let elem of table) {
                if (answer && elem.innerText.trim() === answer) {
                    elem.style["color"] = "green";
                    elem.style["font-weight"] = "bold";
                } else {
                    elem.style["color"] = "black";
                    elem.style["font-weight"] = "normal";
                }
            }
     
     
            if (!answer) {
                core.stop();
                const play = document.getElementById("sdl-play");
                const pause = document.getElementById("sdl-pause");
                play.style["display"] = "inline-block";
                pause.style["display"] = "none";
                return;
            };
     
            if (!playing && !queueStep) return;
            else if (queueStep) queueStep = false;
     
            core.choose(answer);
        },
     
        hook: () => {
            const original = window.showText;
            window.showText = async (nb, sco, com, scen) => {
                const prevGame = core.getGame();
                path.push({
                    q: prevGame.question,
                    r: core.getAnswer(nb, sco, com, scen),
                    h: prevGame.hash,
                });
     
                original(nb, sco, com, scen);
     
                let game;
                while ((game = core.getGame()).hash === prevGame.hash)
                    await utils.sleep(10);
     
                if (!core.isGameOver()) {
                    core.processScript(game);
                }
            };
        },
     
        setScript: (json) => {
            script = json;
            core.processScript(core.getGame());
        },
     
        getAnswer: (nb, sco, com, scen) => {
            const table = document.querySelectorAll("#txtItem > table:nth-child(1) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > a");
            for (let elem of table) {
                const args = /[^\(]+\(([^\)]+)\)/.exec(elem.getAttribute("onclick"))[1].split(",").map(a => parseInt(a));
                if (args[0] == nb && args[1] == sco && args[2] == com && args[3] == scen)
                    return elem.innerText.trim();
            }
     
            return null;
        },
     
        getArgs: (answer) => {
            const table = document.querySelectorAll("#txtItem > table:nth-child(1) > tbody > tr > td:nth-child(2) > table:nth-child(2) > tbody > tr > td > a");
            for (let elem of table) {
                if (elem.innerText.trim() === answer)
                    return /[^\(]+\(([^\)]+)\)/.exec(elem.getAttribute("onclick"))[1].split(",").map(a => parseInt(a));
            }
     
            return null;
        },
     
        choose: (answer) => {
            const args = core.getArgs(answer);
            if (args === null) {
                console.log("can't find arguments for '" + answer + "'");
                return;
            }
     
            window.showText.apply(null, args);
        }
    }
     
    const gui = {
     
        saveJSON: (data, filename) => {
     
            if (!data) {
                console.error("No data")
                return;
            }
     
            if (typeof data === "object") {
                data = JSON.stringify(data, undefined, 4)
            }
     
            var blob = new Blob([data], {
                    type: "text/json"
                }),
                e = document.createEvent("MouseEvents"),
                a = document.createElement("a")
     
            a.download = filename
            a.href = window.URL.createObjectURL(blob);
            a.dataset.downloadurl = ["text/json", a.download, a.href].join(':')
            e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
            a.dispatchEvent(e)
        },
     
        init: () => {
            const parent = document.querySelector("body > div:nth-child(7) > table > tbody > tr > td > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(2)");
            parent.align = "left";
            parent.style["padding-bottom"] = "5px";
            document.head.innerHTML += `
            <style>
                #sdl {
                    padding: 2px;
                    vertical-align: middle;
                }
     
                #sdl button {
                    cursor: pointer;
                    margin-right: 3px;
                    margin: 0;
                    font-size: 18px;
                }
     
                #sdl-player {
                    vertical-align: middle;
                    margin-left: 10px;
                }
     
                #sdl-pcontainer {
                    height: 30px;
                    vertical-align: middle;
                }
     
                #sdl-pcontainer > p {
                    margin: 0;
                    padding: 0;
                    margin-right: 5px;
                }
     
                #sdl-player, #sdl-player > * {
                    display: inline-block;
                }
     
                #sdl-unload, #sdl-player, #sdl-file, #sdl-pause {
                    display: none;
                }
     
            </style>
            `
     
            parent.innerHTML = `
            <div id="sdl">
                <button id="sdl-save" title="exporter la progression en fichier script"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cloud-arrow-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">  <path fill-rule="evenodd" d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/></svg></button>
                <button id="sdl-load" title="importer un fichier script"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cloud-arrow-up-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">  <path fill-rule="evenodd" d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 5.146l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L7.5 6.707V10.5a.5.5 0 0 0 1 0V6.707l1.146 1.147a.5.5 0 0 0 .708-.708z"/></svg></button>
                <button id="sdl-unload" title="decharger le script"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-cloud-slash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">  <path fill-rule="evenodd" d="M3.112 5.112a3.125 3.125 0 0 0-.17.613C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13H11l-1-1H3.781C2.231 12 1 10.785 1 9.318c0-1.365 1.064-2.513 2.46-2.666l.446-.05v-.447c0-.075.006-.152.018-.231l-.812-.812zm2.55-1.45l-.725-.725A5.512 5.512 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773a3.2 3.2 0 0 1-1.516 2.711l-.733-.733C14.498 11.378 15 10.626 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3c-.875 0-1.678.26-2.339.661zm7.984 10.692l-12-12 .708-.708 12 12-.707.707z"/></svg></button>
                <div id="sdl-player">
                    <div id="sdl-pcontainer"><p id="sdl-script">sdl_scene2.json</p></div>
                    <button id="sdl-play" title="jouer tout"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-play-fill" fill="currentColor"><path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg></button>
                    <button id="sdl-pause" title="arrêter"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pause-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">  <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/></svg></button>
                    <button id="sdl-step" title="jouer une étape"><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-skip-end-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">  <path fill-rule="evenodd" d="M12 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>  <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg></button>
                </div>
                <input id="sdl-file" type="file" accept=".json" />
            </div>
            `;
     
            const reader = new FileReader();
     
            const scriptLabel = document.getElementById("sdl-script");
            const player = document.getElementById("sdl-player");
            const file = document.getElementById("sdl-file");
            const load = document.getElementById("sdl-load");
            const unload = document.getElementById("sdl-unload");
            const save = document.getElementById("sdl-save");
            const play = document.getElementById("sdl-play");
            const pause = document.getElementById("sdl-pause");
            const step = document.getElementById("sdl-step");
     
            reader.onload = e => {
                try {
                    core.setScript(JSON.parse(e.target.result));
                    const split = file.value.split("\\");
                    scriptLabel.innerText = split[split.length - 1];
     
                    load.style["display"] = "none";
                    unload.style["display"] = "inline-block";
                    player.style["display"] = "inline-block";
                } catch (e) {
                    alert("can't parse JSON");
                    console.error(e);
                }
            }
     
     
     
            file.addEventListener("change", e => {
                reader.readAsText(e.target.files[0]);
            });
     
            load.addEventListener("click", e => {
                file.click();
            });
     
            unload.addEventListener("click", e => {
                load.style["display"] = "inline-block";
                unload.style["display"] = "none";
                player.style["display"] = "none";
                core.setScript([]);
                core.stop();
            });
     
            save.addEventListener("click", e => {
                gui.saveJSON(core.getPath(), "sdl_" + Math.floor(Date.now() / 1000) + ".json");
            });
     
            play.addEventListener("click", e => {
                play.style["display"] = "none";
                pause.style["display"] = "inline-block";
                core.play();
            });
     
            pause.addEventListener("click", e => {
                play.style["display"] = "inline-block";
                pause.style["display"] = "none";
                core.stop();
            });
     
            step.addEventListener("click", e => {
                core.step();
            });
        }
     
     
     
    }
     
    const utils = {
        sleep: (ms) => {
            return new Promise(resolve => {
                setTimeout(() => resolve(), ms);
            });
        },
     
        waitFor: (fnc) => {
            return new Promise(async resolve => {
                for (;;) {
                    if (fnc() === true) {
                        resolve();
                        return;
                    }
                    await utils.sleep(100);
                }
            });
        },
     
        hashCode: (str) => {
            let hash = 0;
            if (str.length == 0) return hash;
            for (let i = 0; i < str.length; i++) {
                let char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return hash;
        }
    }
     
     
    async function run(){
        await core.ready();
     
        if (core.isGameOver())
            return;
     
        core.hook();
        gui.init();
    }
     
    run();

