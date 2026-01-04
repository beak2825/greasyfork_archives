// ==UserScript==
// @name         General Favoriates Adder
// @namespace    https://greasyfork.org/zh-CN/scripts/424020-general-favoriates-adder
// @version      0.21.4.27
// @description  General Favoriates Adder for pixiv.net or other websites
// @author       MangoPomelo
// @include      /^https?://safebooru\.org/index\.php.*id=.*$/
// @include      /^https?://www\.pixiv\.net/artworks/.*$/
// @include      /^https?://hitomi\.la/(doujinshi|gamecg|cg|manga)/.*?\.html$/
// @include      /^https?://nozomi\.la/post/.*?\.html$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424020/General%20Favoriates%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/424020/General%20Favoriates%20Adder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window != window.top){return undefined;} // iframe is not allowed

    let MODE = "PRODUCTION"; // "TUNNING" if want to tune the threshold and create new pattern, else use "PRODUCTION"
    let TEMPLATE = "{author}\t{URL}\t{character}\t{full_color}"; // placeholders must corresponding to the subjects in CONFIG
    let BUTTON = `
        <div class="btn-circle-extract">
            <svg id="extract" viewBox="0 0 1024 1024" width="24px" height="24px">
                <path d="M160.41 522.24l90.47-90.47 45.21 45.26-90.42 90.42a192 192 0 0 0 271.36 271.82l90.47-90.47 45.21 45.21-90.47 90.47a256 256 0 0 1-361.83-362.24z m678.86-45.21l-90.47 90.42 45.21 45.26 90.47-90.47a256 256 0 0 0-362.24-361.83l-90.47 90.47 45.26 45.21 90.42-90.42a192 192 0 0 1 271.82 271.36z" fill="#ffffff"></path><path d="M341.35 642.97a42.7 42.7 0 1 0 60.16 60.62l302.08-302.08a42.65 42.65 0 1 0-60.62-60.16L341.35 642.97z" fill="#ffffff"></path>
            </svg>
            <svg id="check" width="21px" height="15px" viewBox="13 17 21 15">
                <polyline points="32.5 18.5 20 31 14.5 25.5"></polyline>
            </svg>
        </div>
    `;
    let [MAIN_H, MAIN_S, MAIN_L] = [197, 85, 63]; // use HSL, not RGB
    let STYLE = `
        <style>
            /* Based on: https://dribbble.com/shots/4525196-Jelly-Download */
            .btn-circle-extract {
                position: fixed;
                bottom: 28px;
                left: 20px;
                height: 48px;
                width: 48px;
                margin: auto;
                border-radius: 100%;
                background: #FFF;
                opacity: 0.97;
                cursor: pointer;
                overflow: hidden;
                box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16), 0px 1px 2px hsla(${MAIN_H}deg, ${MAIN_S}%, ${MAIN_L}%, 0.5);
                transition: all 0.5s ease;
                transition: bottom 1s ease;
                z-index: 999;
            }

            .btn-circle-extract::before {
                content: "";
                position: absolute;
                top: 2px;
                left: 2px;
                right: 2px;
                bottom: 2px;
                border-radius: 50%;
                background: radial-gradient(circle, hsl(${MAIN_H}deg ,${MAIN_S * .75}%, ${MAIN_L}%) 0%, hsl(${MAIN_H}deg, ${MAIN_S}%, ${MAIN_L}%) 60%, hsl(${MAIN_H-5}deg, ${MAIN_S * .5}%, ${MAIN_L-5}%) 63%, hsl(0deg, 0%, 100%) 65%);
            }

            .btn-circle-extract svg {
                stroke-width: 2;
                stroke-linecap: round;
                stroke-linejoin: round;
                fill: none;
            }

            .btn-circle-extract svg#extract {
                position: absolute;
                top: 12px;
                left: 12px;
            }

            .btn-circle-extract svg#check {
                position: absolute;
                top: 17px;
                left: 13px;
                stroke: white;
                transform: scale(0);
            }

            .btn-circle-extract.done {
                animation: rubberBand 0.8s;
            }

            .btn-circle-extract.done:after {
                transform: translateX(50%);
                transition: transform 0.4s ease;
                transition-delay: 0.7s;
            }

            .btn-circle-extract.done #extract {
                transform: scale(0);
                transition: all 0.2s ease;
            }

            .btn-circle-extract.done #check {
                transform: scale(1);
                transition: all 0.2s ease;
                transition-delay: 0.2s;
            }

            @keyframes rubberBand {
                from {
                    transform: scale(1, 1, 1);
                }

                30% {
                    transform: scale3d(1.15, 0.75, 1);
                }

                40% {
                    transform: scale3d(0.75, 1.15, 1);
                }

                50% {
                    transform: scale3d(1.1, 0.85, 1);
                }

                65% {
                    transform: scale3d(0.95, 1.05, 1);
                }

                75% {
                    transform: scale3d(1.05, 0.95, 1);
                }

                to {
                    transform: scale3d(1, 1, 1);
                }
            }
        </style>
    `;
    let CALLBACK = () => {
        document.querySelector(".btn-circle-extract").onclick = function() {
            document.querySelector(".btn-circle-extract").classList.add("done");
        };
    };
    let CONFIG = {
        "author": {
            "type": "is",
            "resultMap": res => res? res.replace(/@.+/, ""): "",
            "evaluations": [
                "#root > div:nth-child(2) > div.sc-1nr368f-0.kCKAFN > div > div.sc-1nr368f-3.iHKGIi > aside > section.sc-171jvz-1.sc-171jvz-3.sc-10r3j8-0.f30yhg-3.dfhJPe > h2 > div > div > a > div:nth-child(1)", // pixiv.net
                "#tag-sidebar > li.tag-type-artist.tag > a", // safebooru.org
                "body > div.container > div.content > div.gallery > h2", "body > div.container > div.content > div > div > table > tbody > tr:nth-child(1) > td:nth-child(2) > ul > li > a", // hitomi.la
                "body > div > div.sidebar > ul > li > a.artist", // nozomi.la
            ]
        },
        "URL": {
            "type": "is",
            "resultMap": x => window.location.href.replace(location.hash, "")
        },
        "character": {
            "type": "is",
            "ranker": {
                "threshold": 0,
                "patterns": [
                    {"reg": /^.*_.*$/, "weight": 5},
                    {"reg": /^.* .*$/, "weight": 3},
                    {"reg": /^.*\(.*\)$/, "weight": 15},
                    {"reg": /^.*・.*$/, "weight": 15},
                    {"reg": /^[ァ-ヴー]{4}$/u, "weight": 1},
                    {"reg": /^[ァ-ヴー]{2,3}$/u, "weight": 5},
                    {"reg": /^[ァ-ヴー]+$/u, "weight": 2},
                    {"reg": /^[一-龠ァ-ヴー]{2,5}$/u, "weight": 3},
                    {"reg": /^[一-龠]{3,4}$/u, "weight": 6},
                    {"reg": /^[一-龠]{1,3}[ァ-ヴーぁ-ゔ]{2,3}$/u, "weight": 5},
                ]
            },
            "evaluations": [
                "#root > div:nth-child(2) > div.sc-1nr368f-0.kCKAFN > div > div.sc-1nr368f-3.iHKGIi > main > section > div.sc-171jvz-0.ketmXG > div > figcaption > div.sc-1u8nu73-13.KzfRK > div > footer > ul > li > span > span:nth-child(1)", // pixiv.net
                "#tag-sidebar > li.tag-type-character.tag > a", // safebooru.org
                "body > div > div.content > div > div > table > tbody > tr:nth-child(5) > td:nth-child(2) > ul > li", // hitomi.la
                "body > div > div.sidebar > ul > li > a.character", // nozomi.la
            ]
        },
        "full_color": {
            "type": "has",
            "featureTags": ["Full Color"],
            "resultMap": res => (res || /.*(cg|post|artworks).*/.test(window.location.href))? "True": "False",
            "evaluations": [
                "#root > div:nth-child(2) > div.sc-1nr368f-0.kCKAFN > div > div.sc-1nr368f-3.iHKGIi > main > section > div.sc-171jvz-0.ketmXG > div > figcaption > div.sc-1u8nu73-13.KzfRK > div > footer > ul > li > span > span:nth-child(1)", // pixiv.net
                "#tag-sidebar > li.tag-type-general > a", // safebooru.org
                "body > div > div.content > div > div > table > tbody > tr > td:nth-child(2) > ul > li", // hitomi.la
                "body > div > div.sidebar > ul > li > a.general", // nozomi.la
            ]
        }
    };

    // Codes below

    class HasVerifier {
        constructor(subject) {
            this.dataLoaded = false;
            if (subject !== undefined) {
                // if subject exists
                this.setData(subject);
            }
        }
        setData(subject) {
            this.subject = subject;
            this.type = CONFIG[subject].type.toLowerCase();
            this.featureTags = CONFIG[subject].featureTags;
            this.resultMap = CONFIG[subject].resultMap? CONFIG[subject].resultMap: res => res? "true": "false";
            this.evaluations = CONFIG[subject].evaluations;

            if (this.type != 'has') {
                throw Error("<Class HasVerifier>: Only the type 'has' is accepted in HasVerifier, do you mean to use <Class IsVerifier>?")
            }

            this.dataLoaded = true;
            return this;
        }
        verify() {

            if (this.dataLoaded == false) {
                throw Error("<Class HasVerifier>: The configuration hasn't been loaded, use .setData(subj) to load the data")
            }

            let result = false;
            for (let selector of this.evaluations) {
                const candidates = document.querySelectorAll(selector);
                const tags =  [...candidates].map(elem => elem.innerText);
                const tagsToCheck = this.featureTags;
                for (let tag of tags) {
                    for (let tagToCheck of tagsToCheck) {
                        if (tag.includes(tagToCheck)) {
                            result = true;
                            return this.resultMap(result);
                        }
                    }
                }
            }
            return this.resultMap(result);
        }
    }

    class IsVerifier {
        constructor(subject) {
            this.dataLoaded = false;
            if (subject !== undefined) {
                // if subject exists
                this.setData(subject);
            }
        }
        setData(subject) {
            // TODO: use destruction
            this.subject = subject;
            this.type = CONFIG[subject].type.toLowerCase();
            this.resultMap = CONFIG[subject].resultMap? CONFIG[subject].resultMap: res => res? res: "";
            this.evaluations = CONFIG[subject].evaluations? CONFIG[subject].evaluations: [];
            this.patterns = CONFIG[subject].ranker? CONFIG[subject].ranker.patterns? CONFIG[subject].ranker.patterns: [{"reg": /.*/, "weight": 1}]: [{"reg": /.*/, "weight": 1}];
            this.threshold = CONFIG[subject].ranker? CONFIG[subject].ranker.threshold? CONFIG[subject].ranker.threshold: 0: 0;

            if (this.type != 'is') {
                throw Error("<Class IsVerifier>: Only the type 'is' is accepted in IsVerifier, do you mean to use <Class HasVerifier>?")
            }

            this.dataLoaded = true;
            return this;
        }
        verify() {

            if (this.dataLoaded == false) {
                throw Error("<Class IsVerifier>: The configuration hasn't been loaded, use .setData(subj) to load the data")
            }

            let globalCandidates = [];
            for (let selector of this.evaluations) {
                const candidates = document.querySelectorAll(selector);
                const tags = [...candidates].map(elem => elem.innerText);
                globalCandidates = [...globalCandidates, ...tags];
            }

            let highestScore = -1;
            let correspondingCandidate = "";
            for (let candidate of globalCandidates) {
                if (MODE == "TUNNING") {
                    console.log(`${candidate}:`);
                }
                let score = 0;
                for (let pattern of this.patterns) {
                    let reg = pattern.reg;
                    if (reg.test(candidate)) {
                        score += pattern.weight;
                        if (MODE == "TUNNING") {
                            console.log(`  ${reg} +${pattern.weight}`);
                        }
                    }
                }
                if (score > highestScore) {
                    highestScore = score;
                    correspondingCandidate = candidate;
                }
                if (MODE == "TUNNING") {
                    console.log(`  (${score}/${this.threshold})`);
                }
            }
            return this.resultMap(highestScore >= this.threshold? correspondingCandidate: null);
        }
    }

    class Verifier {
        constructor(subject) {
            this.innerHasVerifier = new HasVerifier();
            this.innerIsVerifier = new IsVerifier();
            this.currentVerifier = null;

            this.dataLoaded = false;
            if (subject !== undefined) {
                // if subject exists
                this.setData(subject);
            }
        }
        setData(subject) {
            const type = CONFIG[subject].type.toLowerCase();
            if (type == 'is') {
                this.currentVerifier = this.innerIsVerifier;
            } else if (type == 'has') {
                this.currentVerifier = this.innerHasVerifier;
            } else {
                throw Error('<Class Verifier>: Type must be either "is" or "has"');
            }
            this.dataLoaded = true;
            this.currentVerifier.setData(subject);
            return this;
        }
        verify() {

            if (this.dataLoaded == false) {
                throw Error("<Class Verifier>: The configuration hasn't been loaded, use .setData(subj) to load the data")
            }

            return this.currentVerifier.verify();
        }
    }

    class Formatter {
        fill(pairs) {
            let newString = `${TEMPLATE}`;
            for (let subject in pairs) {
                let key = subject;
                let value = pairs[subject];
                newString = newString.replace("{" + key + "}", value);
            }
            return newString;
        }
    }

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    const extract = () => {
        let elem = document.querySelector(".btn-circle-extract");
        let v = new Verifier();
        let f = new Formatter();
        let pairs = {};
        for (let subject in CONFIG) {
            let value = v.setData(subject).verify();
            pairs[subject] = value;
        }
        let result = f.fill(pairs);
        copyToClipboard(result);

        setTimeout(()=>{
            elem.style.bottom = "-200px";
        }, 3000);
        setTimeout(()=>{
            elem.remove();
        }, 5000);
    };

    (()=>{
        document.querySelector('head').insertAdjacentHTML('afterbegin', STYLE);
        document.querySelector("body").insertAdjacentHTML('afterbegin', BUTTON);
        document.querySelector(".btn-circle-extract").addEventListener("click", extract);
        if (CALLBACK !== undefined) {
            CALLBACK();
        }
    })();

})();
