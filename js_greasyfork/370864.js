// ==UserScript==
// @name         Company Stock Autofill
// @namespace    LordBusiness.CSU
// @version      3.2
// @description  Updates company stock based on given numbers or percentages.
// @author       LordBusiness
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/370864/Company%20Stock%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/370864/Company%20Stock%20Autofill.meta.js
// ==/UserScript==

const APIkey = (localStorage.getItem("APIkey") === null)?false:localStorage.APIkey;
const get_api = async (selection, key = APIkey, ID = "", part = "company") => {
    const response = await fetch(`https://api.torn.com/${part}/${ID}?selections=${selection}&key=${key}`)
    console.info(`API Request sent! ${part} - ${selection}`)
    return response.json()
}

const flush = () => {
    localStorage.removeItem("APIkey");
    localStorage.setItem("Presets", "");
    localStorage.setItem("userChoice", "setToday");
    localStorage.setItem("lbsSA", "{}");
    location.reload();
}

if (localStorage.getItem("lbsSA") === null) {
    localStorage.setItem("lbsSA", "{}");
}
const lbsSA = JSON.parse(localStorage.lbsSA);
const savelbsSA = () => {localStorage.lbsSA = JSON.stringify(lbsSA)}

if(location.href.startsWith("https://www.torn.com/companies.php")) {
    GM_addStyle(`
.lbsAutofill{
    padding: 0 10px 10px 10px
}
.lbsAutofill .head{
    border-bottom: 1px solid #ccc;
    position: relative;
    line-height: 29px
}
.lbsAutofill .head .l-delimiter,.lbsAutofill .head .r-delimiter{
    height: 2px;
    width: 94px;
    position: absolute
}
.lbsAutofill ul{
    padding-top: 4px
}
.lbsAutofill ul li{
    line-height: 28px
}
.last_action_icon {
    cursor: pointer;
    vertical-align: middle;
    display: inline-block;
    background-image: url(/images/v2/sidebar_icons_desktop_2017.png);
    background-repeat: no-repeat;
    background-position-y: -785px;
    width: 34px;
    height: 30px;
}
#lbsloneParent {
    display: flex;
}
#lbslonePercent {
    background: white;
    border: 1px solid #CCC;
    padding: 5px;
    border-radius: 5px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 100ms;
}
#lbslPlabel {
    line-height: 24px;
    padding-right: 5px;
}
#lbslonePercent:empty:not(:focus):before {
    content:attr(data-text);
    color: grey;
    cursor: text;
}
#lbslonePercent[contentEditable="false"] {
    opacity: 0.5;
}
.last_action_icon {
    cursor: pointer;
    display: inline-block;
    background-image: url(/images/v2/sidebar_icons_desktop_2017.png);
    background-repeat: no-repeat;
    background-position-y: -787px;
    width: 34px;
    height: 23px;
    position: absolute;
    right: 0;
    top: 4px;
}
.awesome-employee {
    color: #006600;
}
.not-that-great {
    color: #ffb100;
}
.lbsSAinp {
    width: 200px;
    border: 1px solid #ccc;
    line-height: 14px !important;
    padding: 5px;
    text-align: left;
    vertical-align: middle;
}
.lbsmaxWithdraw {
    cursor: pointer;
}
`);

    if (localStorage.getItem("Presets") === null) {
        localStorage.setItem("Presets", "");
    }

    if (localStorage.getItem("userChoice") === null) {
        localStorage.setItem("userChoice", "setToday");
    }

    const Presets = localStorage.Presets;
    const userChoice = localStorage.userChoice;
    const PriceArray = (function() {
        if(userChoice == "calcPercent" && !Presets.includes("%")) {
            return Presets.split(",");
        } else {
            return [];
        }
    })();

    const triggerEvent = (el, type) => {
       if ('createEvent' in document) {
            const e = document.createEvent('HTMLEvents');
            e.initEvent(type, false, true);
            el.dispatchEvent(e);
        }
    }

    const inputStuff = (target, val) => {
        target.focus();
        target.value = val;
        triggerEvent(target, 'keydown');
        triggerEvent(target, 'keypress');
        triggerEvent(target, 'keyup');
        target.blur();
    }
    const displayStock = (PricesAr, node) => {
        const stockItem = node.querySelectorAll(".stock-list li")
        for(let i = 0; i < PricesAr.length; i++) {
            if(isNaN(PricesAr[i]) || PricesAr[i] <= 0) continue;
            const itemInp = stockItem[i].querySelector(".quantity > input")
            inputStuff(itemInp, PricesAr[i]);
        }
    }

    const calcPercent = () => {
        get_api("detailed").then((resSize) => {
            const maxStorage = parseInt(resSize.company_detailed.upgrades.storage_space);
            for(const Price of Presets.split(",")) {
                PriceArray.push(parseInt(parseFloat(Price) * maxStorage / 100));
            }
        })
    }

    if(userChoice == "calcPercent" && Presets.includes("%")) {
        calcPercent();
    }

    const calcPrice = (node) => {
        get_api("stock").then((resStock) => {
            if(resStock.error != undefined) {
                localStorage.removeItem("APIkey");
                location.reload();
                return;
            }
            const stockItems = [];
            for (let item in resStock.company_stock) {
                if(stockItems.length == 0) {
                    stockItems.push(item);
                } else {
                    for(let i = 0; i < stockItems.length; i++) {
                        var stockItemelem = parseInt(resStock.company_stock[stockItems[i]].rrp);
                        var currentelem = parseInt(resStock.company_stock[item].rrp);
                        if(stockItemelem >= currentelem) {
                            if((stockItemelem == currentelem) && (String(item).localeCompare(stockItems[i]) == 1)) {
                                if(++i == stockItems.length) {
                                    stockItems.push(item);
                                    break;
                                }
                            }
                            stockItems.splice(i, 0, item);
                            break;
                        }
                        else if(i == stockItems.length-1) {
                            stockItems.push(item);
                            break;
                        }
                    }
                }
            }

            for(let i = 0; i < stockItems.length; i++) {
                let stockItem = resStock.company_stock[stockItems[i]];
                let sold_amount = parseInt(stockItem.sold_amount);
                let in_stock = parseInt(stockItem.in_stock);
                let on_order = parseInt(stockItem.on_order);

                if(userChoice == "setToday") {
                    PriceArray.push(sold_amount)
                } else {
                    PriceArray[i] = PriceArray[i] - in_stock - on_order;
                }
            }
            displayStock(PriceArray, node);
        })
    }
    const typingStuff = () => {
        let inp = document.getElementById("lbslonePercent");
        let inpt = inp.innerText;
        if(APIkey) {
            localStorage.setItem("Presets", inpt.replace(/\s/g, ""));
        } else {
            if(inpt.length == 16) {
                inp.contentEditable = "false";
                get_api("profile", inpt).then((response) => {
                    if(response.error != undefined) {
                        inp.contentEditable = "true";
                    } else {
                        localStorage.setItem("APIkey", inpt);
                        location.reload();
                    }
                });
            }
        }
    }
    const cleanPastinPut = (e) => {
        e.preventDefault();
        document.execCommand("insertHTML", false, e.clipboardData.getData("text/plain"));
        typingStuff();
    }
    const disableInput = () => {
        document.getElementById("lbslonePercent").contentEditable = document.getElementById("lbspreset-percent").checked;
    }
    const choiceClick = (e) => {
        localStorage.userChoice = e.target.value;
        disableInput();
    }
    const observerStock = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.tagName === 'FORM') {
                    observerStock.disconnect();
                    const stockWrap = node.querySelector('.stock-list-wrap')
                    stockWrap.insertAdjacentHTML('beforebegin',
`<div class="lbsAutofill">
    <div class="head t-gray-6 bold">
        <p>Autofill Stock:</p>
        <div class="l-delimiter" ></div>
        <div class="r-delimiter"></div>
        <div class="clear"></div>
    </div>
    <ul role="radiogroup">
        <li>
            <input id="lbsprev" class="radio-css" type="radio" name="stockAutofill" value="setToday">
            <label for="lbsprev" class="marker-css">Use the amount sold from the previous day (Experimental)</label>
        </li>
        <li>
            <input id="lbspreset-percent" class="radio-css" type="radio" name="stockAutofill" value="calcPercent">
            <label for="lbspreset-percent" class="marker-css">Use preset percentages or values</label>
        </li>
    </ul>
   <div id="lbsloneParent">
        <span id="lbslPlabel">Presets:</span>
        <div id="lbslonePercent" contenteditable="true" data-text="Enter percentages or values separated by commas here..">${Presets}</div>
   </div>
</div>`)
                    node.querySelector('#lbslonePercent').addEventListener('keyup', typingStuff);
                    node.querySelector('#lbslonePercent').addEventListener('paste', cleanPastinPut);
                    for(let radionode of node.querySelectorAll('#lbsprev, #lbspreset-percent')) {
                        radionode.addEventListener('click', choiceClick);
                    }
                    if(userChoice == "calcPercent") {
                        document.getElementById("lbspreset-percent").checked = true;
                    } else {
                        document.getElementById("lbsprev").checked = true;
                    }
                    if(!APIkey) {
                        document.getElementById("lbslPlabel").innerHTML = '<span class="t-red bold">API key: </span>';
                        document.getElementById("lbslonePercent").setAttribute("data-text", "Enter API key here..");
                    } else {
                        calcPrice(node);
                        disableInput();
                    }
                }
            }
        }
    })

    // It wouldn't be right if I did not give credit to tos [1976582] for the original idea.
    const toggleLastAction = (iconsTitle, memberUL) => {
        if (iconsTitle.innerText === 'Rank') {
            iconsTitle.childNodes[0].nodeValue = 'Last Action'
            for (const li of memberUL.children) {
                const lastActionDIV = li.querySelector('.last-action')
                const memberID = lastActionDIV.getAttribute('data-member-ID')
                get_api("profile", APIkey, memberID, "user").then((res) => {
                    const lastAction = res.last_action
                    li.querySelector('.rank .employee-rank-drop-list').classList.toggle('hide')
                    lastActionDIV.innerText = lastAction
                    if (lastAction.includes('minute')) lastActionDIV.classList.add('awesome-employee')
                    if (lastAction.includes('hour') && parseInt(lastAction.split(' ')[0]) < 12) lastActionDIV.classList.add('t-green')
                    if (lastAction.includes('hour') && parseInt(lastAction.split(' ')[0]) >= 12) lastActionDIV.classList.add('not-that-great')
                    if (lastAction.includes('day')) lastActionDIV.classList.add('t-red')
                    lastActionDIV.classList.toggle('hide')
                })
            }
        }
        else {
            iconsTitle.childNodes[0].nodeValue = 'Rank'
            for (const li of memberUL.children) {
                li.querySelector('.rank .employee-rank-drop-list').classList.toggle('hide')
                li.querySelector('.last-action').classList.toggle('hide')
            }
        }
    }

    const observerEmployee = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'FORM') {
                    const iconsTitle = node.querySelector('.employee-list-title .rank')
                    const memberUL = node.querySelector('.employee-list')
                    iconsTitle.insertAdjacentHTML('beforeend', `<i class="last_action_icon" title="Show last action of all employees."></i>`)
                    node.querySelector('.last_action_icon').addEventListener('click', () => { toggleLastAction(iconsTitle, memberUL) })
                    for (const li of memberUL.children) {
                        const memberID = li.getAttribute('data-user')
                        li.querySelector('.rank .employee-rank-drop-list').insertAdjacentHTML('afterend', `<div class="last-action hide" data-member-id="${memberID}"></div>`)
                    }
                }
            }
        }
    })

    const lbsmaxWithdraw = () => {
        const maxWithdraw = document.querySelector(".lbsmaxWithdraw").innerText.replace(/[^0-9]/g, '');
        const withdrawInp = document.querySelector(".funds-wrap.withdraw").querySelector(".input-money[type=text]");
        inputStuff(withdrawInp, maxWithdraw);
    }
    const observerFunds = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {

                console.log("yepo", node);
                if (node.classList && node.classList.contains("funds-wrap")) {
                    const fundsWrap = document.querySelector("#funds > .withdraw");
                    const funds = fundsWrap.querySelector(".bold").innerText.replace(/[^0-9]/g, '');
                    get_api("employees").then((res) => {
                        var sumOfWages = 0
                        for (const key in res.company_employees) {
                            sumOfWages += parseInt(res.company_employees[key].wage);
                        }
                        const newWage = ' <span class="lbsmaxWithdraw">(Max: $' + (funds - (sumOfWages * 7)).toLocaleString() + ')</span>';

                        fundsWrap.querySelector(".m-bottom5").innerHTML += newWage;
                        document.querySelector(".lbsmaxWithdraw").addEventListener('click', lbsmaxWithdraw);
                    });
                    return;
                }
            }
        }
    })

    /*
     * The below feature allows you to retrieve your API key even if you use incognito mode.
     * To use, simply type [API]Your16digitAPIkey[/API] in your notebook. Then, once you're in your company page, simply open your notebook up.
     */
    const Notebook = "[class^=entries-info] [class^=viewport] [class^=overview] [class^=edit-note]";
    const observerNotebook = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (document.querySelector(Notebook) !== null) {
                    let APIregex = /.*?\[API\]([\w\d]{16})\[\/API\].*?/igm;
                    let NotebookregAr = APIregex.exec(document.querySelector(Notebook).value);
                    if(NotebookregAr !== null) {
                        let API = NotebookregAr[1];
                        get_api("profile", API).then((response) => {
                            if(response.error == undefined) {
                                localStorage.setItem("APIkey", API);
                                observerNotebook.disconnect();
                                location.reload();
                                return;
                            }
                        });
                    }
                }
            }
        }
    })

    const justChecked = (e) => {
        lbsSA[e.target.name] = e.target.checked;
        if(APIkey) {
            document.querySelector('.lbsSAinp').disabled = !lbsSA.lbsSAnotet;
        }
        savelbsSA();
    }
    const autocheck = () => {
        const inptElement = document.querySelector('.lbsSAinp');
        for(let lbsch of document.querySelectorAll(".lbsSAcompanyop .lbsch")) {
            let lbsop = lbsch.querySelector(".choice-container input");
            let lbsopn = lbsop.name
            if(lbsSA.hasOwnProperty(lbsopn)) {
                lbsop.checked = lbsSA[lbsopn];
            } else {
                lbsSA[lbsopn] = false;
            }
        }
        if(!lbsSA.hasOwnProperty("minimumTrains")) {
            lbsSA.minimumTrains = "10";
        }
        if(APIkey) {
            inptElement.value = lbsSA.minimumTrains;
            inptElement.disabled = !lbsSA.lbsSAnotet;
        }
        savelbsSA();
    }

    const lbsSAverdict = (color, verdict) => {
        const verdictEl = document.querySelector('.lbsSAverdict')
        const oppcolor = (color == "green")?"red":"green";
        verdictEl.classList.add("t-" + color)
        verdictEl.classList.remove("t-" + oppcolor);
        verdictEl.innerHTML = verdict;
    }

    const lbsSAinpClicked = () => {
        const inptElement = document.querySelector('.lbsSAinp');
        const inp = inptElement.value;

        inptElement.disabled = true;
        if(APIkey) {
            if(!isNaN(parseInt(inp))) {
                lbsSA.minimumTrains = inp
                lbsSAverdict("green", "Saved!");
            } else {
                lbsSAverdict("red", "Please check your input.");
            }
        } else if(inp.length == 16) {
            get_api("profile", inp, "", "user").then((response) => {
                if(response.error != undefined) {
                    lbsSAverdict("red", response.error.error);
                } else {
                    localStorage.setItem("APIkey", inp);
                    lbsSAverdict("green", "Hello, " + response.name);
                    location.reload();
                }
            });
        } else {
            lbsSAverdict("red", "Your API key has to be 16 characters long.");
        }
        inptElement.disabled = false;
        savelbsSA();
    }
    const lbsSAplaceholder = (APIkey)?"Enter minimum number of trains...":"Enter your API key here...";
    const observerCompanyOps = new MutationObserver((mutations) => {
        console.info("here");
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                console.info(node);
                if (node.classList && node.classList.contains("company-name")) {
                    console.info("Here");
                    document.querySelector(".d .manage-company .edit-profile .company-name").insertAdjacentHTML('beforebegin',
`<div class="p10 lbsSAcompanyop">
    <div class="bold">Company options</div>
    <div class="m-top10 lbsch">
        <div class="choice-container">
            <input class="checkbox-css" type="checkbox" id="lbsSAlast" name="lbsSAlast">
            <label for="lbsSAlast" class="marker-css">Show Last Action button in the employees tab.</label>
        </div>
    </div>
    <div class="m-top10 lbsch">
        <div class="choice-container">
            <input class="checkbox-css" type="checkbox" id="lbsSAon" name="lbsSAon">
            <label for="lbsSAon" class="marker-css">Turn on the Stock Autofill helper.</label>
        </div>
    </div>
    <div class="m-top10 lbsch">
        <div class="choice-container">
            <input class="checkbox-css" type="checkbox" id="lbsSAfunds" name="lbsSAfunds">
            <label for="lbsSAfunds" class="marker-css">Show the maximum amount of cash you can withdraw in the funds tab.</label>
        </div>
    </div>
    <div class="m-top10 lbsch">
        <div class="choice-container">
            <input class="checkbox-css" type="checkbox" id="lbsSAsidet" name="lbsSAsidet">
            <label for="lbsSAsidet" class="marker-css">Show number of trains in the sidebar.</label>
        </div>
    </div>
    <div class="m-top10 lbsch">
        <div class="choice-container">
            <input class="checkbox-css" type="checkbox" id="lbsSAnotet" name="lbsSAnotet">
            <label for="lbsSAnotet" class="marker-css">Notify every 15 minutes if you have more than the specified minimum number of trains.</label>
        </div>
    </div>
        <div class="m-top10">
            <input class="m-right10 lbsSAinp" type="text" name="lbsSAinp" placeholder="${lbsSAplaceholder}">
            <span class="btn-wrap silver lbsSAsubmit">
                <span class="btn" role="button">SET</span>
            </span>
            <span class="m-left10 bold lbsSAverdict"></span>
        </div>
    <div class="m-top10">
        <div class="choice-container">
            <input class="checkbox-css" type="checkbox" id="lbsSAreset" name="lbsSAreset">
            <label for="lbsSAreset" class="marker-css">Reset script to default. <span class="bold t-red">Do not click this unless you face problems.</span></label>
        </div>
    </div>
</div>
<div class="big-delimiter"></div>`);
                    autocheck();
                    for(let lbsinp of document.querySelectorAll(".lbsSAcompanyop .lbsch .choice-container input")) {
                        lbsinp.addEventListener('click', justChecked);
                    }
                    document.querySelector('.lbsSAsubmit').addEventListener('click', lbsSAinpClicked);
                    document.querySelector('#lbsSAreset').addEventListener('click', flush);
                    return;
                }
            }
        }
    })
    if(APIkey) {
        if(lbsSA.lbsSAlast) {
            observerEmployee.observe(document.querySelector('#employees'), { subtree: true, childList: true })
        } if(lbsSA.lbsSAon) {
            observerStock.observe(document.querySelector('#stock'), { subtree: true, childList: true })
        } if(lbsSA.lbsSAfunds) {
            observerFunds.observe(document.querySelector('#funds'), { subtree: true, childList: true })
        }
    } else {
        observerNotebook.observe(document.querySelector("[class*=chat-box-notebook]"), { subtree: true, childList: true })
    }
    observerCompanyOps.observe(document.querySelector('#edit-profile'), { subtree: true, childList: true })
}
const showTrainCount = (trainCount) => {
    try {
        if(lbsSA.lbsSAsidet) {
            document.getElementsByClassName("lbsSAtrains")[0].querySelector("[class^=value]").innerHTML = trainCount;
        }
    } catch(ex) {
        console.info(ex);
    }
}
const refreshTrains = () => {
    get_api("detailed").then((resTrain) => {
        const trainsAvailable = resTrain.company_detailed.trains_available;
        lbsSA.prevTrains = String(trainsAvailable);
        savelbsSA();
        showTrainCount(trainsAvailable);
    });
}
const redirectToComp = () => {
    window.location.replace("https://www.torn.com/companies.php");
}
if(APIkey) {
    if(lbsSA.lbsSAsidet) {
        GM_addStyle(`
.lbsSAflashing {
    animation: trainFlash 1.5s infinite;
}
@keyframes trainFlash{
    0%,100%{color:#000}
    50%{color:#d83500}
    60%{color:#b3382c}
}`);
        const sidebar = document.getElementById("sidebar");
        const prevTrains = parseInt(lbsSA.prevTrains);
        if(isNaN(prevTrains)) {
            refreshTrains();
        }
        if (sidebar !== null) { //&& prevTrains != 0) {
            const subheads = sidebar.querySelector("[class^=points_]");
            const divClone = subheads.querySelector("[class^=point-block_]").cloneNode(true);
            divClone.classList.add("lbsSAtrains");
            console.log("div", divClone)
            divClone.querySelector("[class^=name]").innerHTML = "Trains:";
            const divCloneval = divClone.querySelector("[class^=value]");
            divCloneval.classList = divCloneval.classList.item(0);
            divCloneval.innerHTML = prevTrains;
            if(lbsSA.lbsSAnotet && prevTrains >= lbsSA.minimumTrains) {
                divClone.classList.add("lbsSAflashing");
            }
            subheads.appendChild(divClone);
            document.getElementsByClassName("lbsSAtrains")[0].addEventListener('click', refreshTrains)
        }
    }

    if(lbsSA.lbsSAnotet) {
        const lastNotif = lbsSA.lastNotif;
        if(lastNotif) {
            if(Date.now() - parseInt(lastNotif) > 900000) {
                get_api("detailed").then((resTrain) => {
                    const trainsAvailable = resTrain.company_detailed.trains_available;
                    lbsSA.prevTrains = String(trainsAvailable);
                    if(trainsAvailable >= lbsSA.minimumTrains) {
                        const textnotify = 'A wise master never wastes his ' + trainsAvailable + ' trains.';
                        GM_notification({title: 'Train your employees!!', text: textnotify, timeout: '7', onclick: redirectToComp});
                        showTrainCount(trainsAvailable);
                    }
                    lbsSA.lastNotif = Date.now();
                    savelbsSA();
                });
            }
        } else {
            lbsSA.lastNotif = Date.now();
            savelbsSA();
        }
    }
}