// ==UserScript==
// @name         Torn SpyParse
// @namespace    https://github.com/SOLiNARY
// @version      0.3.5.pda
// @description  Parse spy reports & save them in local storage
// @author       Ramin Quluzade, Silmaril [2665762]
// @license      MIT License
// @match        https://www.torn.com/jobs.php*
// @match        https://www.torn.com/companies.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/465219/Torn%20SpyParse.user.js
// @updateURL https://update.greasyfork.org/scripts/465219/Torn%20SpyParse.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';

    const SpyJobs = {
        Army: 10,
        LawFirm: 20,
        TelevisionNetwork: 30,
        None: 0
    }
    const SpyJobsMapping = {
        "Type: Army": SpyJobs.Army,
        "Type: Law Firm": SpyJobs.LawFirm,
        "Type: Television Network": SpyJobs.TelevisionNetwork
    }
    let playerJob = 20;
    let spyReports = {};

    const viewPortWidthPx = window.innerWidth;
    const isMobileView = viewPortWidthPx <= 784;

    const styles = `
div#spy-parse-container {
    font-family: Verdana, Geneva, sans-serif;
    background-color: #CCC;
    text-align: center;
}

#spy-parse-btn {
    right: 20px;
    z-index: 99999;
}

#spy-copy-btn {
    right: 180px;
    z-index: 99999;
}

.float {
    width: 90px;
    height: 50px;
    margin: 0 auto;
    padding: 0;
    display: inline-block;
    line-height: 50px;
    text-align: center;
    top: 40px;
    text-decoration: none;
    position: fixed;
    padding-left: 20px;
    padding-right: 20px;
    background-color: #00144e;
    color: #FFF;
    border-radius: 50px;
    box-shadow: 2px 2px 3px #999;
    font-size: 18px;
}

.my-float {
    margin-top: 22px;
}

#spy-parse-tbl {
    position: fixed;
    top: 103px;
    right: 40px;
    font-family: arial, sans-serif;
    font-size: xx-small;
    border-collapse: collapse;
    width: auto;
}

#spy-parse-tbl tr {
    transition: background-color 400ms cubic-bezier(0.4, 0, 0.2, 1);;
}

#spy-parse-tbl tr td[data-level], td[data-updated] {
    display: none;
}

#spy-parse-tbl td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
    transition: background-color 400ms cubic-bezier(0.4, 0, 0.2, 1);;
}

#spy-parse-tbl tbody tr:nth-child(even) {
    background-color: #d1d1d1;
}

#spy-parse-tbl tbody tr:nth-child(odd) {
    background-color: white;
}
    `;

    if (isTampermonkeyEnabled){
        GM_addStyle(styles);
    } else {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = styles;
        while (document.head == null){
            await sleep(50);
        }
        document.head.appendChild(style);
    }

    let zNode = document.createElement('div');
    zNode.innerHTML = `<a id="spy-copy-btn" href="#" class="float">Copy <i class="fa fa-copy my-float"></i></a><a id="spy-parse-btn" href="#" class="float">Parse <i class="fa fa-search my-float"></i></a><table style="display:none;" id="spy-parse-tbl"><thead><tr><th>Name</th><th ${isMobileView ? 'style="display: none;"' : ''}>Level</th><th>Strength</th><th>Defense</th><th>Speed</th><th>Dexterity</th><th>Total</th><th ${isMobileView ? 'style="display: none;"' : ''}>Updated</th></tr></thead><tbody></tbody>`;
    zNode.setAttribute('id', 'spy-parse-container');
    document.body.appendChild(zNode);
    document.getElementById("spy-parse-btn").addEventListener("click", GetSpyResult, false);
    document.getElementById("spy-copy-btn").addEventListener("click", CopySpyResults, false);

//     if (location.pathname.startsWith("/jobs.php")) {
//         playerJob = SpyJobs.Army;
//     } else if (location.pathname.startsWith("/companies.php")) {
//         let jobTitleBlock = document.querySelector("#mainContainer > div.content-wrapper > div.company-wrap > div.company-details-wrap > ul.company-stats-list.company-info > li:nth-child(1) > div.details-wrap.t-first.t-first-row");
//         if (jobTitleBlock) {
//             try {
//                 playerJob = SpyJobsMapping[jobTitleBlock.innerText];
//             } catch (error) {
//                 playerJob = SpyJobs.None;
//             }
//         }
//     } else {
//         playerJob = SpyJobs.None;
//     }
    console.log("Player job: %s", playerJob);
    if (spyReports == undefined) {
        spyReports = {};
    }

    function CopySpyResults(zEvent) {
        zEvent.preventDefault();
        let copyBtn = zEvent.target;
        let copyBtnHtml = copyBtn.innerHTML;
        const spyReportTemplate = (x) =>
`
Name: ${x.Name}
Level: ${x.Level}
You managed to get the following results:
Strength: ${x.StrengthPrettified}
Speed: ${x.SpeedPrettified}
Dexterity: ${x.DexterityPrettified}
Defense: ${x.DefensePrettified}
Total: ${x.TotalPrettified}
`;
        let spyReportsResult = "";
        for (let key in spyReports) {
            spyReportsResult += spyReportTemplate(spyReports[key]);
        }
        if (Object.entries(spyReports).length > 0) {
            navigator.clipboard.writeText(spyReportsResult)
                .then(function () {
                copyBtn.innerHTML = 'Copied! <i class="fa fa-copy my-float"></i>';
            }, function () {
                copyBtn.innerHTML = 'Failed! <i class="fa fa-copy my-float"></i>';
            });
        } else {
            copyBtn.innerHTML = 'Empty! <i class="fa fa-copy my-float"></i>';
        }
        setTimeout(() => {
            copyBtn.innerHTML = copyBtnHtml;
        }, 1000);
    }

    function GetSpyResult(zEvent) {
        console.log('playerJob', playerJob);
        zEvent.preventDefault();
        let parseBtn = zEvent.target;
        let parseBtnHtml = parseBtn.innerHTML;
        try {
            let spyProfile = GetSpyProfile();
            AddSpyProfile(spyProfile);
            parseBtn.innerHTML = 'Parsed! <i class="fa fa-search my-float"></i>';
            let spyTable = document.querySelector("#spy-parse-tbl");
            spyTable.style.display = 'block';
        } catch (error) {
            console.error(error);
            parseBtn.innerHTML = 'Failed! <i class="fa fa-search my-float"></i>';
        }
        setTimeout(() => {
            parseBtn.innerHTML = parseBtnHtml;
        }, 1000);
    }

    function GetSpyProfile() {
        console.log('get spy profile begin');
        let jobSpecialBlock, userLink, levelSpan;
        switch (playerJob) {
            default:
            case SpyJobs.Army:
                jobSpecialBlock = document.getElementsByName("jobspecial")[0];
                userLink = jobSpecialBlock.querySelector("div > div:nth-child(3) > div > span.desc > a");
                levelSpan = jobSpecialBlock.querySelector("div > div:nth-child(3) > div:nth-child(2) > span.desc");
                break;
            case SpyJobs.LawFirm:
            case SpyJobs.TelevisionNetwork:
                console.log('jobSpecialBlock1', document.getElementsByClassName("specials-cont-wrap")[0]);
                console.log('jobSpecialBlock2', document.getElementsByClassName("specials-cont-wrap")[0].querySelector("div.specials-confirm-cont"));
                jobSpecialBlock = document.getElementsByClassName("specials-cont-wrap")[0].querySelector("div.specials-confirm-cont");
                console.log('userLink', jobSpecialBlock.querySelector("div > div:nth-child(2) > div > span.desc > a"));
                userLink = jobSpecialBlock.querySelector("div > div:nth-child(2) > div > span.desc > a");
                console.log('levelSpan', jobSpecialBlock.querySelector("div > div:nth-child(2) > div:nth-child(2) > span.desc"));
                levelSpan = jobSpecialBlock.querySelector("div > div:nth-child(2) > div:nth-child(2) > span.desc");
                break;
        }
        console.log('constructing spy profile');

        let id = Number(userLink.href.substr(userLink.href.search("XID=") + 4));
        let name = userLink.innerText;
        let level = Number(levelSpan.innerText);
        let strength = 0;
        let defense = 0;
        let speed = 0;
        let dexterity = 0;
        let total = 0;
        if (playerJob == SpyJobs.TelevisionNetwork || playerJob == SpyJobs.LawFirm) {
            let statOffset = playerJob == SpyJobs.TelevisionNetwork ? 1 : 0;
            let statsBlock = jobSpecialBlock.querySelector("div > ul");
            strength = Number(statsBlock.children[0 + statOffset].innerText.substr(10).replaceAll(',', ''));
            if (isNaN(strength)) strength = 0;
            defense = Number(statsBlock.children[3 + statOffset].innerText.substr(9).replaceAll(',', ''));
            if (isNaN(defense)) defense = 0;
            speed = Number(statsBlock.children[1 + statOffset].innerText.substr(7).replaceAll(',', ''));
            if (isNaN(speed)) speed = 0;
            dexterity = Number(statsBlock.children[2 + statOffset].innerText.substr(11).replaceAll(',', ''));
            if (isNaN(dexterity)) dexterity = 0;
            total = Number(statsBlock.children[4 + statOffset].innerText.substr(7).replaceAll(',', ''));
            if (isNaN(total)) total = 0;
        } else if (playerJob == SpyJobs.Army) {
            let statsBlock = jobSpecialBlock.querySelector("div.specials-confirm-cont > div:nth-child(5) > ul");
            let strengthBlock = statsBlock.querySelector("li.left.t-c-border");
            if (strengthBlock.innerText.search("Strength:") > -1) {
                strength = Number(strengthBlock.getElementsByClassName('desc')[0].innerText.replaceAll(',', ''));
                if (isNaN(strength)) strength = 0;
            }
            let defenseBlock = statsBlock.querySelector("li.left.t-r-border");
            if (defenseBlock.innerText.search("Defense:") > -1) {
                defense = Number(defenseBlock.getElementsByClassName('desc')[0].innerText.replaceAll(',', ''));
                if (isNaN(defense)) defense = 0;
            }
            let speedBlock = statsBlock.querySelector("li.left.t-l-border");
            if (speedBlock.innerText.search("Speed:") > -1) {
                speed = Number(speedBlock.getElementsByClassName('desc')[0].innerText.replaceAll(',', ''));
                if (isNaN(speed)) speed = 0;
            }
            let dexterityBlock = statsBlock.querySelector("li.left.b-l-border");
            if (dexterityBlock.innerText.search("Dexterity:") > -1) {
                dexterity = Number(dexterityBlock.getElementsByClassName('desc')[0].innerText.replaceAll(',', ''));
                if (isNaN(dexterity)) dexterity = 0;
            }
            let totalBlock = statsBlock.querySelector("li.left.b-c-border");
            if (totalBlock.innerText.search("Total:") > -1) {
                total = Number(totalBlock.getElementsByClassName('desc')[0].innerText.replaceAll(',', ''));
                if (isNaN(total)) total = 0;
            }
        }
        console.log('get spy profile end');

        return new SpyReport(id, name, level, strength, defense, speed, dexterity, total, new Date());
    }

    function AddSpyProfile(spyProfile) {
        console.log('add spy profile begin');
        const profileTemplate = (x) => `<td data-name>${x.Name}</td><td style="${isMobileView ? "display: none;" : ''}" data-level=${x.Level}>${x.Level}</td><td data-strength=${x.Strength}>${x.StrengthPrettified}</td><td data-defense=${x.Defense}>${x.DefensePrettified}</td><td data-speed=${x.Speed}>${x.SpeedPrettified}</td><td data-dexterity=${x.Dexterity}>${x.DexterityPrettified}</td><td data-total=${x.Total}>${x.TotalPrettified}</td><td style="${isMobileView ? "display: none;" : ''}" data-updated=${x.UpdatedTimeStamp}>${x.UpdatedDate}</td>`;

        let spyTableBody = document.querySelector('#spy-parse-tbl tbody');
        let userRow = spyTableBody.querySelector(`tr[data-id="${spyProfile.Id}"]`);
        if (userRow == null) {
            let userNode = document.createElement('tr');
            userNode.innerHTML = profileTemplate(spyProfile);
            userNode.setAttribute('data-id', spyProfile.Id);
            spyTableBody.appendChild(userNode);
            FlashElement(userNode);
        } else {
            let level = userRow.querySelector('td[data-level]');
            let strength = userRow.querySelector('td[data-strength]');
            let defense = userRow.querySelector('td[data-defense]');
            let speed = userRow.querySelector('td[data-speed]');
            let dexterity = userRow.querySelector('td[data-dexterity]');
            let total = userRow.querySelector('td[data-total]');
            let updated = userRow.querySelector('td[data-updated]');

            let existingSpyProfile = spyReports[spyProfile.Id];
            if (spyProfile.Strength < existingSpyProfile.Strength) spyProfile.Strength = existingSpyProfile.Strength;
            if (spyProfile.Defense < existingSpyProfile.Defense) spyProfile.Defense = existingSpyProfile.Defense;
            if (spyProfile.Speed < existingSpyProfile.Speed) spyProfile.Speed = existingSpyProfile.Speed;
            if (spyProfile.Dexterity < existingSpyProfile.Dexterity) spyProfile.Dexterity = existingSpyProfile.Dexterity;
            if (spyProfile.Total < existingSpyProfile.Total) spyProfile.Total = existingSpyProfile.Total;
            spyProfile.calculateStats();

            if (Number(level.getAttribute('data-level')) !== spyProfile.Level) {
                level.setAttribute('data-level', spyProfile.Level);
                level.innerText = spyProfile.Level;
                FlashElement(level);
            }
            if (Number(strength.getAttribute('data-strength')) !== spyProfile.Strength) {
                strength.setAttribute('data-strength', spyProfile.Strength);
                strength.innerText = spyProfile.StrengthPrettified;
                FlashElement(strength);
            }
            if (Number(defense.getAttribute('data-defense')) !== spyProfile.Defense) {
                defense.setAttribute('data-defense', spyProfile.Defense);
                defense.innerText = spyProfile.DefensePrettified;
                FlashElement(defense);
            }
            if (Number(speed.getAttribute('data-speed')) !== spyProfile.Speed) {
                speed.setAttribute('data-speed', spyProfile.Speed);
                speed.innerText = spyProfile.SpeedPrettified;
                FlashElement(speed);
            }
            if (Number(dexterity.getAttribute('data-dexterity')) !== spyProfile.Dexterity) {
                dexterity.setAttribute('data-dexterity', spyProfile.Dexterity);
                dexterity.innerText = spyProfile.DexterityPrettified;
                FlashElement(dexterity);
            }
            if (Number(total.getAttribute('data-total')) !== spyProfile.Total) {
                total.setAttribute('data-total', spyProfile.Total);
                total.innerText = spyProfile.TotalPrettified;
                FlashElement(total);
            }
            if (updated.getAttribute('data-updated') !== spyProfile.UpdatedTimeStamp) {
                updated.setAttribute('data-updated', spyProfile.UpdatedTimeStamp);
                updated.innerText = spyProfile.UpdatedDate;
                FlashElement(updated);
            }
        }
        localStorage.setItem(`spy-parse-${spyProfile.Id}`, JSON.stringify(spyProfile));
        spyReports[spyProfile.Id] = spyProfile;
        console.log('get spy profile end');
    }

    function FlashElement(element) {
        let previousBackgroundColor = element.style.backgroundColor;
        setTimeout(() => {
            element.style.backgroundColor = "green";
        }, 10);
        setTimeout(() => {
            element.style.backgroundColor = previousBackgroundColor;
        }, 400);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    class SpyReport {
        Id = 0;
        Name = '';
        Level = 0;
        Strength = 0;

        get StrengthPrettified() {
            return this.Strength.toLocaleString('EN');
        }

        Defense = 0;

        get DefensePrettified() {
            return this.Defense.toLocaleString('EN');
        }

        Speed = 0;

        get SpeedPrettified() {
            return this.Speed.toLocaleString('EN');
        }

        Dexterity = 0;

        get DexterityPrettified() {
            return this.Dexterity.toLocaleString('EN');
        }

        Total = 0;

        get TotalPrettified() {
            return this.Total.toLocaleString('EN');
        }

        UpdatedTimeStamp = new Date(0);

        get UpdatedDate() {
            return this.UpdatedTimeStamp.toLocaleDateString('RU');
        }

        constructor(id, name, level, strength, defense, speed, dexterity, total, updated) {
            this.Id = id;
            this.Name = name;
            this.Level = level;
            this.Strength = strength;
            this.Defense = defense;
            this.Speed = speed;
            this.Dexterity = dexterity;
            this.Total = total;
            this.UpdatedTimeStamp = updated;
            this.calculateStats();
        }

        calculateStats() {
            let statsKnown = Number(this.Strength > 0) + Number(this.Defense > 0) + Number(this.Speed > 0) + Number(this.Dexterity > 0) + Number(this.Total > 0);
            if (statsKnown === 4) {
                if (Number(this.Strength === 0)) this.Strength = this.Total - this.Defense - this.Speed - this.Dexterity;
                if (Number(this.Defense === 0)) this.Defense = this.Total - this.Strength - this.Speed - this.Dexterity;
                if (Number(this.Speed === 0)) this.Speed = this.Total - this.Strength - this.Defense - this.Dexterity;
                if (Number(this.Dexterity === 0)) this.Dexterity = this.Total - this.Strength - this.Defense - this.Speed;
                if (Number(this.Total === 0)) this.Total = this.Strength + this.Defense + this.Speed + this.Dexterity;
            }
        }
    }
})();