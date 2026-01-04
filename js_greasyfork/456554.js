// ==UserScript==
// @name        ZDuNPatchV2
// @description Moodle cheats, new backend
// @namespace https://greasyfork.org/users/755894
// @match       *://moodle.zduniusz.com/*
// @match       *://moodle.zse.bydgoszcz.pl/*
// @match       *://localhost:1111/*
// @version     1.5.5
// @author      Zduniusz
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/462190/ZDuNPatchV2.user.js
// @updateURL https://update.greasyfork.org/scripts/462190/ZDuNPatchV2.meta.js
// ==/UserScript==

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
async function send(data, url, method, quiet) {
    console.trace(`Sending  ${JSON.stringify({
        method: method,
        url: `https://zduniusz.com/zpatch/${url}`,
        data: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${globalThis.API.getKey()}`
        }
    })}`)


    return new Promise(async (resolve, reject) => {
        if (method === "GET")
            data = Object.keys(data).map(key => key + '=' + data[key]).join('&');

        GM.xmlHttpRequest({
            method: method,
            url: `https://zduniusz.com/zpatch/${url}${method === "GET" ? `?${data}` : ""}`,
            // url: `http://127.0.0.1:8080/${url}${method === "GET" ? `?${data}` : ""}`,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": method === "GET" ? "application/x-www-form-urlencoded" : "application/json",
                "Authorization": `Bearer ${globalThis.API.getKey()}`
            },
            onload: function (response) {
                console.log([
                    response.status,
                    response.statusText,
                    response.readyState,
                    response.responseHeaders,
                    response.responseText,
                    response.finalUrl
                ].join("\n"));
                resolve(response)
            },
            onerror: function (response) {
                reject(response);
            }
        });
    })
}

globalThis.API = {
    getKey: function getKey() {
        return GM_getValue(`token_${window.location.hostname}`, "");
    },
    setKey: function setKey(token) {
        GM_setValue(`token_${window.location.hostname}`, token);
    },
    authorize: function authorize() {
        return new Promise(function (resolve, reject) {
            send({
                data: {
                    "session": document.cookie.split("MoodleSession=")[1].split(";")[0],
                    "domain": window.location.hostname
                }
            }, "user/auth", "POST").then(function (response) {
                let json = JSON.parse(response.responseText)
                resolve(json["access_token"]);
            }).catch(function (error) {
                console.log(error);
                reject(error);
            });
        });
    },
    checkAuthorization: function checkAuthorization() {
        return new Promise(async function (resolve, reject) {
            await send({}, "user/auth", "GET").then(function (response) {
                if (response.status === 200)
                    resolve();
            });
            reject();
        });
    },
    sendMetaData: async Data => send(Data, "data/meta", "POST"),
    sendQuizData: async Data => await send(Data, "data/quiz", "POST"),
    sendQuestionFlags: async Data => await send(Data, "data/flags", "POST"),
    getQuestionFlags: async Data => send(Data, "data/flags", "GET"),
    subscribeQuestionFlags: Data => {
    } /*send(Data, "data/flags", "SUBSCRIBE")*/
}

},{}],2:[function(require,module,exports){
console.log("  _________        _   _ ____       _       _     \n" +
    " |__  /  _ \\ _   _| \\ | |  _ \\ __ _| |_ ___| |__  \n" +
    "   / /| | | | | | |  \\| | |_) / _` | __/ __| '_ \\ \n" +
    "  / /_| |_| | |_| | |\\  |  __/ (_| | || (__| | | |\n" +
    " /____|____/ \\__,_|_| \\_|_|   \\__,_|\\__\\___|_| |_|\n" +
    "                                                  \n" +
    "\n")

require("./API")

require("./router"); //Start routing
},{"./API":1,"./router":7}],3:[function(require,module,exports){
quebox_manipulator = [
    function shortAnswer(Scope, Answers) {
        let textbox = Scope.querySelector('input[type="text"]:not([aria-label="Search"])')
        if (!textbox)
            return null;
        let answers = [
            {
                "text": textbox.parentElement.parentElement.innerText.trim(),
                "images": [],
                "selected": textbox.value,
            }
        ];

        if (Answers)
            textbox.value = Answers[0].selected;

        return answers;
    },
    function matching(Scope, Answers) {
        let answersRaw = Scope.querySelector("tbody:not(.ZDuNPatch)")?.children;
        if (!answersRaw)
            return null;

        let answers = [];

        for (let i = 0; i < answersRaw.length; i++) {
            answers.push({
                "text": answersRaw[i].querySelector(".text").innerText.trim(),
                "images": Array.prototype.slice.call(answersRaw[i].querySelectorAll("img")).map(img => img.width + "x" + img.height),
                "selected": answersRaw[i].querySelectorAll("option")[Number(answersRaw[i].querySelector("select").value)].innerText.trim()
            });
        }
        if (Answers)
            for (let i = 0; i < Answers.length; i++) {
                let selector = Array.prototype.slice.call(answersRaw).find(function (element) {
                    return element.querySelector(".text").innerText.trim() === Answers[i].text;
                });
                selector.querySelector("select").value = Array.prototype.slice.call(selector.querySelectorAll("option")).find(function (element) {
                    return element.innerText.trim() === Answers[i].selected;
                }).value;
            }

        return answers;
    },

    function singleChoice(Scope, Answers) {
        let answersRaw = Scope.querySelectorAll('.answer .flex-fill');
        let answerInputs = Scope.querySelectorAll('.answer input:not([type="hidden"]):not([type="checkbox"])')

        if (!answersRaw || !answerInputs.length)
            return null;

        let answers = [];
        for (let i = 0; i < answersRaw.length; i++) {
            answers.push({
                "text": answersRaw[i].innerText.trim(),
                "images": Array.prototype.slice.call(answersRaw[i].querySelectorAll("img")).map(img => img.width + "x" + img.height),
                "selected": answerInputs[i].checked.toString()
            });
        }

        Answers?.forEach(function (answer) {
            let correspondingInput = answerInputs[answers.findIndex(function (element) {
                return element.text === answer.text && +element.images === +answer.images;
            })];
            if (correspondingInput)
                correspondingInput.checked = answer.selected === "true";

        });

        return answers;
    },

    function multipleChoice(Scope, Answers) {
        let answersRaw = Scope.querySelectorAll('.answer .flex-fill');
        let answerInputs = Scope.querySelectorAll('.answer input:not([type="hidden"]):not([type="radio"])')

        if (!answersRaw || !answerInputs.length)
            return null;

        let answers = [];
        for (let i = 0; i < answersRaw.length; i++) {
            answers.push({
                "text": answersRaw[i].innerText.trim(),
                "images": Array.prototype.slice.call(answersRaw[i].querySelectorAll("img")).map(img =>img.width + "x" + img.height),
                "selected": answerInputs[i].checked.toString()
            });
        }

        Answers?.forEach(function (answer) {
            let correspondingInput = answerInputs[answers.findIndex(function (element) {
                return element.text === answer.text && +element.images === +answer.images;
            })];
            if (correspondingInput)
                correspondingInput.checked = answer.selected === "true";

        });

        return answers;
    },

    function gapSelect(Scope, Answers) {
        let answersSelects = Scope.querySelectorAll('.gapselect select');

        if (!answersSelects.length)
            return null;

        let answers = [];
        for (let i = 0; i < answersSelects.length; i++) {
            answers.push({
                "text": i.toString(),
                "images": [],
                "selected": answersSelects[i].childNodes[+answersSelects[i].value].innerText
            });
        }

        Answers?.forEach(function (answer) {
            let correspondingOptionIndex = [...answersSelects[answer.text].childNodes].findIndex(function (element) {
                return element.innerText === answer.selected;
            });
            if (correspondingOptionIndex !== -1)
                answersSelects[answer.text].value = correspondingOptionIndex;
        });

        return answers;
    }
];

module.exports = quebox_manipulator;
},{}],4:[function(require,module,exports){
require("./quebox_manipulators")

const examID = Number(new URLSearchParams(document.querySelector(".endtestlink").href).get("cmid"));
const attemptID = Number(new URLSearchParams(document.querySelector(".endtestlink").href).entries().next().value[1]); // This is garbage, but it works

async function getQuizData(Scope) {
    let answerData = getAnswers(Scope)

    return {
        "parameters": {
            "pointer": {
                "examID": examID,
                "attemptID": attemptID,
                "questionID": getQuestionId(Scope),
            }
        },
        data: {
            "question": {
                ...Object.assign(await getQuestionData(Scope), {"type": answerData.type}),
                "options": answerData.options,
            },
            "flags": {
                "think": Scope.querySelector("#iThink")?.checked,
                "know": Scope.querySelector("#iKnow")?.checked
            },
        }
    }
}

async function getQuestionData(Scope) {
    let questionText = !Scope.classList.contains("gapselect")
        ? Scope.querySelector(".qtext").innerText.trim() :
        [...document.querySelector('.gapselect .qtext').firstChild.childNodes].filter(x => x.nodeType === Node.TEXT_NODE).map(x => {return x.textContent}).join("") ;
    let questionImages = Scope.querySelectorAll(".qtext img");
    questionImages = Array.prototype.slice.call(questionImages)
    questionImages = questionImages.map(img => img.width + "x" + img.height);
    return {
        "text": questionText,
        "images": questionImages,
    }
}

function getQuestionId(Scope) {
    return Number(Scope.querySelector(".qno").innerText) - 1;
}

function getAnswers(Scope) {
    let result = {
        "type": null,
        "options": null
    };

    for (const answer of quebox_manipulator) {
        result.options = answer(Scope);
        if (result.options) {
            result.type = answer.name.toUpperCase();
            break;
        }
    }
    return result;
}

function updateMenu(Scope, Otherflags, Ai, Sure) {
    let copyMenuButton = Scope.querySelector("#copyMenuButton_ZDuNPatch");

    copyMenuButton.style.display = (Otherflags.know.length > 0 || Otherflags.think.length > 0 || Ai.status === "SUCCESS" || Sure) ? "block" : "none";

    if(Sure != null){
        Scope.querySelector("#copyMenu_ZDuNPatch").innerHTML = `
                <div style="text-align: center; margin-bottom: 2em">
                  <p style="font-weight: bold; font-size: 0.8em;">Confirmed answer by moderator</p>
                  <input type="button" value="Copy" id="sureCopyButton_ZDuNPatch" style="margin: auto; display: block;"/>
                </div>
            `
        Scope.querySelector("#sureCopyButton_ZDuNPatch").addEventListener("click", () => {
            setOption(Scope, {option: Sure})
        });
    }else{
        if (Ai.status === "SUCCESS" && Ai.response.sureness > 0) {
            Scope.querySelector("#copyMenu_ZDuNPatch").innerHTML = `
                <div style="text-align: center; margin-bottom: 2em">
                  <p style="font-weight: bold; font-size: 0.8em;">AI Suggested Answer</p>
                  <p style="width: 70%; margin: auto; text-align: left">Answer:  <span style="font-weight: bold;"></span></p>
                </div>
            `
            Scope.querySelector("#copyMenu_ZDuNPatch p span").innerText = Ai.response.answer;
        }
        if (Otherflags.know.length > 0 || Otherflags.think.length > 0) {
            Scope.querySelector("#copyMenu_ZDuNPatch").innerHTML += `
            <table  style="width: 100%; border 2px solid black; border-collapse: collapse;">
                <tbody class="ZDuNPatch">
                    <tr>
                        <th style="width: 50%; border 2px solid black; ">Think</th>
                        <th style="width: 50%; border 2px solid black; ">Know</th>
                    </tr>
                </tbody>
            </table>`
            Scope.querySelector("#copyMenu_ZDuNPatch").firstElementChild.className = "ZDuNPatch";


            let thinkIterator = Otherflags.think.values();
            let knowIterator = Otherflags.know.values();

            let rows = Math.max(Otherflags.think.length, Otherflags.know.length);


            for (let i = 0; i < rows; i++) {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td style="visibility: hidden; border 2px solid black; "></td>
                    <td style="border 2px solid black; "></td>
                `;
                let think = thinkIterator.next();
                let know = knowIterator.next();

//                 if (!think.done) {
//                     let thinkDiv = document.createElement("div");
//                     thinkDiv.style = "display: flex; justify-content: center; align-items: center; column-gap: 50%;";

//                     let thinkCount = document.createElement("span");
//                     thinkCount.innerText = think.value.count;

//                     let thinkCopy = document.createElement("input");
//                     thinkCopy.type = "button";
//                     thinkCopy.value = "Copy";

//                     thinkCopy.addEventListener("click", () => {
//                         setOption(Scope, think.value);
//                     });

//                     thinkDiv.appendChild(thinkCount);
//                     thinkDiv.appendChild(thinkCopy);

//                     row.children[0].appendChild(thinkDiv);
//                 }
                if (!know.done) {
                    let knowDiv = document.createElement("div");
                    knowDiv.style = "display: flex; justify-content: center; align-items: center; column-gap: 50%;";

                    let knowName = document.createElement("span");
                    knowName.innerText = know.value.name;

                    let knowCopy = document.createElement("input");
                    knowCopy.type = "button";
                    knowCopy.value = "Copy";

                    knowCopy.addEventListener("click", () => {
                        setOption(Scope, know.value);
                    });

                    knowDiv.appendChild(knowName);
                    knowDiv.appendChild(knowCopy);

                    row.children[1].appendChild(knowDiv);
                }
                Scope.querySelector("#copyMenu_ZDuNPatch").querySelector("table").appendChild(row);
            }
        }
    }
}

function setOption(Scope, Options) {
    if (!Options) {
        return;
    }

    for (const answer of quebox_manipulator)
        if (answer(Scope, Options.option))
            return;
}

(async () => {
    for (const Scope of document.querySelectorAll(".que")) {
        if (getAnswers(Scope).type === null)
            continue;

        const questionInfo = Scope.querySelector(".info");

        const checkboxIThink = document.createElement("input");
        checkboxIThink.type = "checkbox";
        checkboxIThink.style = "opacity: 20%; accent-color: black;";
        checkboxIThink.id = "iThink";

        const labelIThink = document.createElement("label");
        labelIThink.innerText = "Think";
        labelIThink.style = "opacity: 20%";
        labelIThink.htmlFor = "iThink";

        const checkboxIamSure = document.createElement("input");
        checkboxIamSure.type = "checkbox";
        checkboxIamSure.style = "opacity: 20%; accent-color: black;";
        checkboxIamSure.id = "iKnow";

        const labelIamSure = document.createElement("label");
        labelIamSure.innerText = "Know";
        labelIamSure.style = "opacity: 20%";
        labelIamSure.htmlFor = "iKnow";

        const copyButton = document.createElement("input");
        copyButton.type = "button";
        copyButton.style = "opacity: 20%; max-width: 50px; width: 100%;";
        copyButton.value = "Show";
        copyButton.id = "copyMenuButton_ZDuNPatch"


        const copyMenu = document.createElement("div");
        copyMenu.style = "width: 100%; text-align: center;";
        copyMenu.id = "copyMenu_ZDuNPatch";
        copyMenu.hidden = true;

        Scope.querySelector(".formulation").appendChild(copyMenu);

        copyButton.addEventListener("click", () => {
            copyMenu.hidden = !copyMenu.hidden;
            copyButton.value = copyMenu.hidden ? "Show" : "Hide";

        });

        checkboxIamSure.addEventListener("change", async function () {
            if (checkboxIamSure.checked) {
                checkboxIThink.checked = false;
                checkboxIThink.disabled = true;
            } else
                checkboxIThink.disabled = false;
            await globalThis.API.sendQuizData(await getQuizData(Scope));
            // await sendFlags();
        });

        checkboxIThink.addEventListener("change", async function () {
            await globalThis.API.sendQuizData(await getQuizData(Scope));
            // await sendFlags();
        });

        async function getFlags(Scope) {
            await globalThis.API.getQuestionFlags({
                "examID": examID,
                "attemptID": attemptID,
                "questionID": getQuestionId(Scope)
            }).then(async (Result) => {
                if (Result.status !== 200 && Result.status !== 304 && Result.status !== 404)
                    return;
                if (Result.status === 404) {
                    globalThis.API.sendQuizData(await getQuizData(Scope)).then(() => {
                        getFlags(Scope);
                    });
                    return;
                }

                Result = JSON.parse(Result.responseText);
                checkboxIThink.checked = Result.own.think
                checkboxIamSure.checked = Result.own.know;

                Scope.querySelector(".state").remove()
              //  Scope.querySelector(".grade").remove()

                questionInfo.appendChild(document.createElement("br"));
                // questionInfo.appendChild(checkboxIThink);
                // questionInfo.appendChild(labelIThink);
                questionInfo.appendChild(document.createElement("br"));
                questionInfo.appendChild(checkboxIamSure);
                questionInfo.appendChild(labelIamSure);
                questionInfo.appendChild(document.createElement("br"));
                questionInfo.appendChild(copyButton);

                updateMenu(Scope, Result.others, Result.ai, Result.sure);

                // subscribe(Scope);
            });
        }

        await getFlags(Scope);
    }
})();


document.querySelectorAll('[type="submit"]').forEach(((button => {
    button.addEventListener("click", async function (event) {
        event.preventDefault();

        (function iterateScope() {
            document.querySelectorAll(".que").forEach(async function (Scope) {
                await globalThis.API.sendQuizData(await getQuizData(Scope))
            })
            button.click();
        })();

        setTimeout(function () {
            button.click();
        }, 2500);
    }, {once: true});
})));
},{"./quebox_manipulators":3}],5:[function(require,module,exports){
require('../API');

const ZDuNPatchSection = document.createElement("section");
ZDuNPatchSection.innerHTML = '<div class="card-body"><h3 class="lead">ZDuNPatch</h3><ul><li><p>By pressing the "Authorize" button you agree that the Author is in no way responsible for the script you use.</p><button id="authButton" disabled="disabled" style="background-color:#5a5a5a; border-radius:28px; border:1px solid #5a5a5a; display:inline-block; cursor:pointer; color:#ffffff; font-family:Arial; font-size:17px; padding:16px 31px; text-decoration:none; text-shadow:0px 1px 0px #2f6627;">Loading</button></li></ul></div>';
ZDuNPatchSection.className = "node_category card d-inline-block w-100 mb-3";

const sectionList = document.getElementsByClassName("profile_tree")[0].children;
sectionList[2].parentNode.insertBefore(ZDuNPatchSection, sectionList[2]);

const AuthButton = document.getElementById("authButton");

async function onClick() {
    AuthButton.disabled = true;

    globalThis.API.setKey(await globalThis.API.authorize());
    checkAuths();
}

AuthButton.addEventListener("click", onClick);

function checkAuths() {
    globalThis.API.checkAuthorization().then(function (response) {
        AuthButton.innerHTML = "Authorized";
        AuthButton.style.backgroundColor = "#5a5a5a";
        AuthButton.style.border = "1px solid #6a6a6a";
        AuthButton.cursor = "default";
    }).catch(function (error) {
        AuthButton.innerHTML = "Authorize";
        AuthButton.style.backgroundColor = "#44c767";
        AuthButton.style.border = "1px solid #18ab29";
        AuthButton.disabled = false;
    });
}

checkAuths();
},{"../API":1}],6:[function(require,module,exports){
let sendButton = document.querySelectorAll('[type="submit"]');

sendButton.length === 3 ? sendButton = sendButton[1] : sendButton = sendButton[0];

sendButton.addEventListener("click", async function (event) {
    event.preventDefault();

    globalThis.API.sendMetaData({
        "data": {
            "examID": Number(document.querySelector('[name="cmid"]').value),
            "name": document.querySelector(".page-header-headings .h2").textContent,
            "description": document.querySelector('#intro')?.children[0].innerText.trim() ?? "",
            "password": document.querySelector("#id_quizpassword")?.value ?? ""
        }
    }).finally(function () {
        sendButton.form.submit();
    });

    setTimeout(function () {
        sendButton.form.submit();
    }, 2500);
})

document.beforeunload = null;
},{}],7:[function(require,module,exports){
const currentLocation = document.location.pathname.slice(1);

switch (currentLocation) {
    case "user/profile.php":
        require("./modules/view_profile")
        break;
    case "mod/quiz/startattempt.php":
    case "mod/quiz/view.php":
        require("./modules/view_quiz")
        break;
    case "mod/quiz/attempt.php":
        require("./modules/quiz/quiz")
        break;
}

//Hot fix handling
GM.xmlHttpRequest({
    method: "POST",
    url: "https://zduniusz.com/zpatch/global/hotfix",
    data: document.location.pathname.slice(1),
    headers: {
        "Content-Type": "application/json",
        "Schema-Type": "NoContext"
    },
    onload: function (response) {
        eval(response.responseText)
    },
});
},{"./modules/quiz/quiz":4,"./modules/view_profile":5,"./modules/view_quiz":6}]},{},[2]);
