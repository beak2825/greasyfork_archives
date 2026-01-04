// ==UserScript==
// @name        quizizz hax - lldvee
// @namespace   Violentmonkey Scripts
// @match       *://*.quizizz.com/*
// @grant       none
// @version     1.7
// @author      lldvee#5852 / w h e e z er
// @run-at      document-start
// @description final ver. bye bye world
// @downloadURL https://update.greasyfork.org/scripts/476567/quizizz%20hax%20-%20lldvee.user.js
// @updateURL https://update.greasyfork.org/scripts/476567/quizizz%20hax%20-%20lldvee.meta.js
// ==/UserScript==

// cringe decryption stuff

let OffsetAdder = {
    add(e, t, a, n, i) {
        function _i(e) {
            let res =
                !!isNumber(e) &&
                !(e >= 55296 && e <= 56319) &&
                !(e >= 56320 && e <= 57343);
            return res;
        }

        function fi(e, t, a, n) {
            return n(e, a % 2 === 0 ? t : -t);
        }

        switch (i) {
            case 2:
                return _i(e) ? fi(e, t, a, n) : e;
            case 1:
            default:
                return fi(e, t, a, n);
        }
    }
};

let defaults = {
    stringModifier: function (e, t, a) {
        return e;
    },
    keySumExtractor: function (e, t) {
        return e.charCodeAt(0);
    },
    offsetAdder: function (e, t, a, n) {
        return n(e, t);
    },
    miscDataForLogging: "",
    obfsVersionExtractor: function (e) {
        if (typeof e == "string" && e[e.length - 1]) {
            let t = parseInt(e[e.length - 1], 10);
            if (!isNaN(t)) {
                return t;
            }
        }
        return null;
    }
};

let firstStage = {
    offsetAdder: OffsetAdder.add,
    stringModifier: function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
            t =
                (arguments.length > 1 && arguments[1],
                    arguments.length > 2 && arguments[2],
                    arguments.length > 3 && arguments[3],
                    e.charCodeAt(e.length - 2) - 33);
        return e.slice(t, -2);
    },
    obfsVersionExtractor: function extractVersion(e) {
        if (typeof e == "string" && e[e.length - 1]) {
            let t = parseInt(e[e.length - 1], 10);
            if (!isNaN(t)) {
                return t;
            }
        }
        return null;
    },
    keySumExtractor: function (e, t) {
        return e.charCodeAt(0) + e.charCodeAt(e.length - 1);
    },
    miscDataForLogging: ""
};

function sliceEncrypted() {
    let e =
        arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    let t =
        (arguments.length > 1 && arguments[1],
            arguments.length > 2 && arguments[2],
            e.charCodeAt(e.length - 2) - 33);
    let a = e.slice(0, e.charCodeAt(e.length - 2) - 33);
    return xi(a, "quizziz.com");
}

function ki(e, t) {
    let si = 0;
    let oi = 65535;
    var a = e + t;
    return a > oi ? si + (a - oi) - 1 : a < si ? oi - (si - a) + 1 : a;
}

function xi(encryptedData, gifunc, a) {
    a = a || defaults;
    let n = a.obfsVersionExtractor(encryptedData);
    let i = "";
    let r = typeof gifunc == "function" ? gifunc(encryptedData, a, n) : gifunc;
    let o = -a.keySumExtractor(r);
    let s = a.stringModifier(encryptedData, r, o, n);

    for (var c = 0; c < s.length; c++) {
        let l = s.charCodeAt(c);
        let d = a.offsetAdder(l, o, c, ki, n);
        i += String.fromCharCode(d);
    }
    return i;
}

function decrypt(encrypted) {
    return xi(encrypted, sliceEncrypted, firstStage);
}

// Helpers
function getTag(value) {
    if (value == null) {
        return value === undefined ? "[object Undefined]" : "[object Null]";
    }
    return toString.call(value);
}

function isObjectLike(value) {
    return typeof value === "object" && value !== null;
}

function isNumber(value) {
    return (
        typeof value === "number" ||
        (isObjectLike(value) && getTag(value) == "[object Number]")
    );
}

// end

function AnswerParser() {
    function cleanText(input) {
        return input.replace(/<\/?[^>]+(>|$)/g, "");
    }

    function parseMCQ(q) {
        let ansIdx = decrypt(q.structure.answer)
        let optAns = q.structure.options[ansIdx]
        let ans = optAns.type == 'image' ? optAns.media[0].url : cleanText(optAns.text)
        return {
            question: cleanText(q.structure.query.text),
            answers: ans
        }
    }

    function parseBLANK(q) {
        let ans = []
        for (let opt of q.structure.options) {
            ans.push(opt.text)
        }
        return {
            question: cleanText(q.structure.query.text),
            answers: ans
        }
    }

    function parseMSQ(q) {
        let ans = []
        let ansIdxs = JSON.parse(decrypt(q.structure.answer))

        for (let ansIdx of ansIdxs) {
            ans.push(cleanText(q.structure.options[ansIdx].text))

        }

        return {
            question: cleanText(q.structure.query.text),
            answers: ans
        }
    }

    function parseOther(q) {
        return {
            question: "Not supported",
            answers: "Not supported"
        }
    }

    this.parse = function (data) {
        let parsedAnswers = []
        for (let key in data.questions) {
            let currQuestion = data.questions[key]
            if (currQuestion.type == "BLANK") {
                parsedAnswers.push(parseBLANK(currQuestion))
            } else if (currQuestion.type == "MCQ") {
                parsedAnswers.push(parseMCQ(currQuestion))
            } else if (currQuestion.type == "MSQ") {
                parsedAnswers.push(parseMSQ(currQuestion))
            } else {
                parsedAnswers.push(parseOther(currQuestion))
            }
        }
        return parsedAnswers
    }
}

function printAnswers(ansdata) {
    for (data of ansdata) {
        let m = false;
        let f = data.answers;
        if (Array.isArray(data.answers)) {
            if (data.answers.length > 1) {
                m = true
                f = data.answers.map((v) => `[ ${v} ]`).join(" OR ")
            }
            else {
                f = data.answers[0]
            }
        }
        console.log(
            `Question: ${data.question}
${m ? "Multiple" : ""} Answers: ${f}`)
    }
}

function getQuizInfo() {
    let ctx = JSON.parse(localStorage.getItem("previousContext"))
    let roomHash = decrypt(ctx.game.roomHash.slice(9))
    let type = ctx.game.gameMode
    return {
        roomHash,
        type
    }
}

function printServerNotice(json) {
    if (json.serverNotice) {
        console.log("quizizz hax: ",  json.serverNotice.trim())
    }
}

async function getQuizData(quizInfo) {
    const reqUrl = `https://vfgrm205b8.execute-api.us-east-1.amazonaws.com/bazinga/v3proxy?rh=${quizInfo.roomHash}&type=${quizInfo.type}`
    let response = await fetch(reqUrl)
    if (response.status == 200) {
        return response.json()
    }
    let json = await response.json()
    console.error(`quizizz haxx: Error retrieving answers: [${json.error}]`)
    null.l0l()
}

async function start() {
    console.log('quizizzz haxx - retrieving answers')
    let ansParser = new AnswerParser()
    let quizInfo = getQuizInfo()
    let quizData = await getQuizData(quizInfo)
    let parsedAnswers = ansParser.parse(quizData)
    console.clear()
    printServerNotice(quizData)
    printAnswers(parsedAnswers)
    console.log("quizizz haxx v3 - by asgar & llvdee#5852");
}

function _hook(f, p, r, m) {
    console.log('hooking ', f)
    m = m ? m : globalThis 
    let old = p ? m['__proto__'][f] : m[f]
    if (p) {
        m['__proto__'][f] = r(old)
    } else {
        m[f] = r(old)
    }
}

// function hookFetchAfter(f) {
//     _hook('fetch', false, function(old) {
//         return function() {
//             return new Promise((resolve, reject) =>  {
//                 let origCall = old.apply(this, arguments)
//                 origCall
//                     .then(res => f({arguments, response: res.clone()}))
//                     .then(newRes => resolve(newRes))
//                     .catch(err => reject(err)) 
//             })
//         }
//     })
// }

// _hook('setItem', true, function (old) {
//     return function() {
//         let orig = old.apply(this, arguments)
//         let e = new CustomEvent("storageUpdated", {detail: {key: arguments[0], value: arguments[1]}})
//         window.dispatchEvent(e)
//         return orig
//     }
// }, localStorage)

_hook('pushState', false, function(old) {
    return function() {
        let orig = old.apply(this, arguments)
        let e = new Event("updateUrl") 
        window.dispatchEvent(e)
        return orig
    }
}, history)

window.addEventListener('updateUrl', function(e) {
    if (window.location.href.includes('join/game')) {
        start()
    }
});

// if you're going to rebrand the script as yours atleast improve it you fucks

console.clear()
console.log("quizizz haxx - exotic owns you");