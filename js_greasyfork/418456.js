// ==UserScript==
// @name        Homie (NS Version)
// @namespace    hardy.homie.ns
// @version      1.0
// @description  Records Stocks Transactions
// @author       Hardy [2131687], Anxiety
// @match        https://www.torn.com/stockexchange.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect    script.google.com
// @connect    loudsoul.glitch.me
// @downloadURL https://update.greasyfork.org/scripts/418456/Homie%20%28NS%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/418456/Homie%20%28NS%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var toBeSent = {"stocks": {}};
    let listOfStocks = ['BAG', 'CNC', 'ELBT', 'EVL', 'EWM', 'FHG', 'GRN', 'HRG', 'IIL', 'IOU', 'ISTC', 'LSC', 'MCS', 'MSG', 'PRN', 'SLAG', 'SYM', 'SYS', 'TCB', 'TCC', 'TCHS', 'TCM', 'TCP', 'TCSE', 'TCT', 'TGP', 'TMI', 'TSBC', 'WLT', 'WSSB', 'YAZ'];
    function getUserID() {
        const name = "uid=";
        let decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    createIcons();
    $(document).ajaxComplete((event, jqXHR, ajaxObj) => {
        let url = ajaxObj.url;
        let data = ajaxObj.data;
        if (jqXHR.responseText) {
            if (url.includes("stockexchange.php?") && url.includes("step=buy2")) {
                let response = new DOMParser().parseFromString(jqXHR.responseText, 'text/html');
                let text = response.querySelector(".stock-main-wrap div .info-msg-cont .info-msg .delimiter .msg").innerText.trim();
                if (text.startsWith("You have bought")) {
                    createIcons();
                    let obj = {};
                    obj.stocks = {};
                    obj.stocks.shares = parseInt(retrieve(url, "shares"));
                    obj.stocks.cost = parseInt(retrieve(url, "cost"));
                    obj.stocks.price = obj.stocks.cost/obj.stocks.shares;
                    obj.stocks.seller = "System";
                    obj.stocks.sellerId = 0;
                    obj.stocks.stamp = Date.now();
                    let regexPattern = obj.stocks.shares === 1? /\sshare\sin\s(.*?)\sat\sa\s/: /\sshares\sin\s(.*?)\sat\sa\s/;
                    obj.stocks.stockName = regexPattern.exec(text)[1];
                    obj.stocks.type = "buy";
                    sendData(obj, "POST", 1);

                }
            } else if (ajaxObj.url.includes("stockexchange.php?") && ajaxObj.url.includes("&step=profile")) {
                const foo = new DOMParser().parseFromString(jqXHR.responseText, 'text/html');
                const stockData = foo.getElementsByClassName("column properties right")[0].innerHTML;
                const req_data = {
                    "userID": getUserID(),
                    "url": ajaxObj.url,
                    "stockData": stockData
                }
                const app_url = "http://loudsoul.glitch.me/stocks/";
                console.log(req_data);
                GM_xmlhttpRequest({
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "POST",
                    data: JSON.stringify(req_data),
                    url: app_url,
                    onload: function(e) {
                        console.log(`Data for stock ID ${ajaxObj.url.split("&ID=")[1].split("&")[0]} was sent to the server!`);
                    }
                });
            }
        }
    });

    if (window.location.href.includes("stockexchange.php?step=portfolio")) {
        let array = [];
        let stockList = document.querySelector(".stock-main-wrap .stock-cont").children;
        for (const item of stockList) {
            let info = item.querySelector(".item .info");
            let obj = {}
            obj.acronym = item.getAttribute("data-stock").toUpperCase();
            obj.shares = parseInt(info.querySelector(".b-price-wrap .first-row").innerText.replace(/\s/g, "").split(":")[1].replace(/,/g, ""));
            obj.current_price = info.querySelector(".b-price-wrap .second-row").innerText.replace(/\s/g, "").split("$")[1].replace(/,/g, "").split("S")[0];
            obj.price = info.querySelector(".c-price-wrap .second-row").innerText.replace(/\s/g, "").split(":$")[1].replace(/,/g, "").split("S")[0];
            obj.time = info.querySelector(".length-wrap .first-row").innerText.replace(/\s/g, "").split(":")[1].split("(")[0];
            obj.worth = info.querySelector(".c-price-wrap .first-row").innerText.replace(/\s/g, "").split("$")[1].replace(/,/g, "");
            let changeclass = info.querySelector(".length-wrap .second-row .prop-wrap .change")
            let sign = changeclass.querySelector(".arrow-change-icon").getAttribute("aria-label") === "stock price is down"? "-": "";

            obj.change = sign + changeclass.innerText.replace(/\s/g, "").replace(/,/g, "").split("$")[1].split("(")[0];
            obj.loss_profit = Math.round(obj.change * obj.shares);
            obj.percent = sign+changeclass.innerText.replace(/,/g, "").replace(/\s/g, "").split("(")[1].split("%")[0];
            obj.boughtTotal = Math.round(obj.shares*obj.price);
            array.push(obj);
        }
        let dict = {};
        dict.stocks = {};
        dict.stocks.data = array;
        dict.stocks.type = "portfolio"
        sendData(dict, "POST", 1);

    }
    function sendData(data, callMethod, responseFunction) {
        let url = GM_getValue("link");
        if (url == "" || url === null || typeof url == "undefined") {
            if (responseFunction == 2) {
                document.querySelector(".homieConfirmation").innerHTML = '<label class="homieErrorLabel">Please enter the webapp url and try again.</label>';
            }
        } else {
            console.log(data);
            if (responseFunction == 2) {
                document.querySelector(".homieConfirmation").innerHTML = '<label class="homieSuccessLabel">Sending data...</label>';
            }
            GM_xmlhttpRequest({
                method: callMethod,
                data: JSON.stringify(data),
                url: url,
                onload: function(e) {
                    if (responseFunction == 2) {
                        document.querySelector(".homieConfirmation").innerHTML = '<label class="homieSuccessLabel">Data sent!!</label>';
                    }
                },
                onerror: (error) => {
                    console.log(error);
                    if (responseFunction == 2) {
                        document.querySelector(".homieConfirmation").innerHTML = '<label class="homieErrorLabel">Error!! Check console for details!</label>'
                    }
                },
                ontimeout: (error) => {
                    console.log("Request timed out!")
                    if (responseFunction == 2) {
                        document.querySelector(".homieConfirmation").innerHTML = '<label class="homieErrorLabel">Request timed out. Try again later!</label>';
                    }
                }
            });
        }
    }
    function retrieve(string, argName) {
        return string.split(`${argName}=`)[1].split("&")[0];
    }
    function createIcons() {
        var htmlIcon1 = '<span class="icon-wrap svg-icon-wrap"><span class="link-icon-svg homieTrade"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path id="homie-icon" d="M19 11V9h-8V5H9v4H5v2h4v8h2v-8h8m0-8c.5 0 1 .2 1.39.61C20.8 4 21 4.5 21 5v14c0 .5-.2 1-.61 1.39c-.39.41-.89.61-1.39.61H5c-.5 0-1-.2-1.39-.61C3.2 20 3 19.5 3 19V5c0-.5.2-1 .61-1.39C4 3.2 4.5 3 5 3h14z" fill="#626262"/></svg></div></span></span><span id="homietitle">Update Sheet</span>';
        var htmlIcon2 = '<span class="icon-wrap svg-icon-wrap"><span class="link-icon-svg homieOptions"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><path id="homie-icon1" d="M512.5 390.6c-29.9 0-57.9 11.6-79.1 32.8c-21.1 21.2-32.8 49.2-32.8 79.1c0 29.9 11.7 57.9 32.8 79.1c21.2 21.1 49.2 32.8 79.1 32.8c29.9 0 57.9-11.7 79.1-32.8c21.1-21.2 32.8-49.2 32.8-79.1c0-29.9-11.7-57.9-32.8-79.1a110.96 110.96 0 0 0-79.1-32.8zm412.3 235.5l-65.4-55.9c3.1-19 4.7-38.4 4.7-57.7s-1.6-38.8-4.7-57.7l65.4-55.9a32.03 32.03 0 0 0 9.3-35.2l-.9-2.6a442.5 442.5 0 0 0-79.6-137.7l-1.8-2.1a32.12 32.12 0 0 0-35.1-9.5l-81.2 28.9c-30-24.6-63.4-44-99.6-57.5l-15.7-84.9a32.05 32.05 0 0 0-25.8-25.7l-2.7-.5c-52-9.4-106.8-9.4-158.8 0l-2.7.5a32.05 32.05 0 0 0-25.8 25.7l-15.8 85.3a353.44 353.44 0 0 0-98.9 57.3l-81.8-29.1a32 32 0 0 0-35.1 9.5l-1.8 2.1a445.93 445.93 0 0 0-79.6 137.7l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.2 56.5c-3.1 18.8-4.6 38-4.6 57c0 19.2 1.5 38.4 4.6 57l-66 56.5a32.03 32.03 0 0 0-9.3 35.2l.9 2.6c18.1 50.3 44.8 96.8 79.6 137.7l1.8 2.1a32.12 32.12 0 0 0 35.1 9.5l81.8-29.1c29.8 24.5 63 43.9 98.9 57.3l15.8 85.3a32.05 32.05 0 0 0 25.8 25.7l2.7.5a448.27 448.27 0 0 0 158.8 0l2.7-.5a32.05 32.05 0 0 0 25.8-25.7l15.7-84.9c36.2-13.6 69.6-32.9 99.6-57.5l81.2 28.9a32 32 0 0 0 35.1-9.5l1.8-2.1c34.8-41.1 61.5-87.4 79.6-137.7l.9-2.6c4.3-12.4.6-26.3-9.5-35zm-412.3 52.2c-97.1 0-175.8-78.7-175.8-175.8s78.7-175.8 175.8-175.8s175.8 78.7 175.8 175.8s-78.7 175.8-175.8 175.8z" fill="#626262"/></svg></div></span></span><span id="homietitle1">Settings</span>';

        let stockIcon = document.querySelector('a[aria-labelledby="stockexchange"]') || document.querySelector('a[aria-labelledby="your-portfolio"]');
        let parent = stockIcon.parentNode;
        let newElement = document.createElement('a');
        newElement.id = "homie_create_box";
        newElement.setAttribute("role",
                                "button");
        newElement.setAttribute("aria-labelledby",
                                "homie");
        newElement.setAttribute("href",
                                "#");
        newElement.className = 'homie t-clear h c-pointer  m-icon line-h24 right';
        newElement.innerHTML = htmlIcon1;
        parent.insertBefore(newElement,
                            document.querySelector(".links-footer"));

        let anotherNewElement = document.createElement('a');
        anotherNewElement.id = "homie_create_options_box";
        anotherNewElement.setAttribute("role",
                                       "button");
        anotherNewElement.setAttribute("aria-labelledby",
                                       "homie1");
        anotherNewElement.setAttribute("href",
                                       "#");
        anotherNewElement.className = 'homie1 t-clear h c-pointer  m-icon line-h24 right';
        anotherNewElement.innerHTML = htmlIcon2;
        parent.insertBefore(anotherNewElement,
                            document.querySelector(".links-footer"));
    }
    function createTradeInfoBox() {
        let boxHtml = '<div class="homie_modal"></div>';
        if (!document.querySelector(".homie_modal")) {
            $(".content-wrapper").prepend(boxHtml);
            resetBox();
        }
    }
    function resetBox() {
        document.querySelector(".homie_modal").innerHTML = '<div class="homie_header">Homie</div><div class="homie_modal_content"><p id="labelType" style="margin-bottom:10px;">Transaction Type</p><input type="radio" name="transaction_type" value="sold" id="homieIsSold"><label for="homieIsSold" style="margin-left:10px; margin-bottom:10px;">Shares sold</label><br><br><input type="radio" name="transaction_type" value="buy" id="homieIsBought"><label for="homieIsBought" style="margin-left:10px; margin-bottom:10px;">Shares bought</label><br><br><p style="margin-bottom:10px;">Select name of the stock:</p><select id="homieStockAcronym"></select><br><br><p id="labelAmount">Enter numbers of shares traded:</p><input type="text" class="homieInputBox1" id="homieShareAmount" placeholder="Enter number of shares"><br><br><p id="labelCost">Total value of shares:</p><input type="text" class="homieInputBox1" id="homieMoney" placeholder="Value of shares"><br><br><p id="labelName">Name of Player you traded with:</p><input type="text" class="homieInputBox" id="homie_player_name" placeholder="Name of player you traded with"><br><br><p id="labelId">User Id of the player your traded with:</p><input type="number" id="homieUserId" class="homieInputBox" placeholder="User ID of that player" min="1"><br><br><p style="margin-bottom:10px;" id="labelTime">Select approximate time of trade:</p><input type="datetime-local" id="homieTradeTime"><br><br><button id="homieSendData">Send</button><button id="homieReset">Reset</button><button id="homieCloseModal">Close</button><div class="homieConfirmation"></div></div>';
        let array = [];
        for (const stock of listOfStocks) {
            array.push(`<option value="${stock.toLowerCase()}">${stock}</option>`);
        }
        document.querySelector("#homieStockAcronym").innerHTML = array.join("");
        var now = new Date();
        //now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
        document.querySelector("#homieTradeTime").value = now.toISOString().slice(0, 16);
    }
    function createSettingsBox() {
        if (!document.querySelector(".homieSettingsBox")) {
            let savedUrl = GM_getValue("link");
            var placeholderHTML;
            if (savedUrl === null || savedUrl == "" || typeof savedUrl == "undefined") {
                placeholderHTML = ' placeholder="Enter Webapp URL here"';
            } else {
                placeholderHTML = ' value="'+savedUrl+'"';
            }
            $(".content-wrapper").prepend('<div class="homieSettingsBox"><div class="homie_header">Settings</div><div class="homieSettingsContent"><p>Enter the Webapp URL:</p><input type="text" class="homieInputBox" id="homieUrl"'+placeholderHTML+'><br><br><button id="homieSaveUrl">Save</button><button id="homieCloseSetting">Close</button><div class="homieSettingsConfirm"></div></div></div>');

        }
    }
    function resetLabels() {
        let nodes = document.querySelectorAll(".homie_modal_content p");
        for (const p of nodes) {
            let html = p.innerHTML.split("<")[0];
            p.innerHTML = html;
        }
    }
    document.addEventListener("click", function(e) {
        if (e.target.id == "homietitle" || e.target.id == "homie-icon" || e.target.id == "homie_create_box") {
            createTradeInfoBox();
        } else if (e.target.id == "homietitle1" || e.target.id == "homie-icon1" || e.target.id == "homie_create_options_box") {
            createSettingsBox();
        } else if (e.target.id == "homieReset") {
            resetBox();
            toBeSent = {
                "stocks": {}};
        } else if (e.target.id == "homieCloseModal") {
            document.querySelector(".homie_modal").remove();
            toBeSent = {
                "stocks": {}};
        } else if (e.target.id == "homieSendData") {
            toBeSent = {
                "stocks": {}};
            resetLabels();
            let type = document.querySelector('input[name="transaction_type"]:checked');
            let stock = document.querySelector("#homieStockAcronym").value.toUpperCase();
            let amount = document.querySelector("#homieShareAmount").value;
            let cost = document.querySelector("#homieMoney").value;
            let playerName = document.querySelector("#homie_player_name").value;
            let playerId = document.querySelector("#homieUserId").value;
            let time = new Date(document.querySelector("#homieTradeTime").value).getTime();
            let dict = {
                "errors": 0
            };
            if (isNaN(time)) {
                dict.errors += 1;
                document.querySelector("#labelTime").innerHTML = 'Select approximate time of trade:<label class="homieErrorLabel">Please select a valid date and time!</label>';
            }
            if (playerId === "" || playerId === null || typeof playerId == "undefined") {
                dict.errors += 1;
                document.querySelector("#labelId").innerHTML = 'User Id of the player your traded with:<label class="homieErrorLabel">Please enter the Id of the user!</label>';
            }
            if (playerName === "" || playerName === null || typeof playerName == "undefined") {
                dict.errors += 1;
                document.querySelector("#labelName").innerHTML = 'Name of Player you traded with:<label class="homieErrorLabel">Please enter the name of the user!</label>';
            }
            if (cost == 0 || cost == "" || cost === null || typeof cost == "undefined" || document.querySelector("#homieMoney").getAttribute("isError") == "yes") {
                dict.errors += 1;
                document.querySelector("#labelCost").innerHTML = 'Total value of shares:<label class="homieErrorLabel">Please enter a valid amount. Only non-numerical characters that are supported are $ . , k m b</label>';
            }
            if (amount == 0 || amount == "" || amount === null || typeof amount == "undefined" || document.querySelector("#homieShareAmount").getAttribute("isError") == "yes") {
                dict.errors += 1;
                document.querySelector("#labelAmount").innerHTML = 'Enter numbers of shares traded:<label class="homieErrorLabel">Please enter a valid amount. Only non-numerical characters that are supported are $ . , k m b</label>';
            }
            if (type === null || typeof type == "undefined" || type == "") {
                dict.errors += 1;
                document.querySelector("#labelType").innerHTML = 'Transaction Type:<label class="homieErrorLabel">Please select the type of transaction!</label>';
            }
            if (dict.errors === 0) {
                toBeSent.stocks.type = type.value;
                let noun = type.value === "buy"? "seller": "buyer";
                toBeSent.stocks[noun] = playerName;
                let nounId = type.value === "buy"? "sellerId": "buyerId";
                toBeSent.stocks[nounId] = playerId;
                toBeSent.stocks.stockName = stock;
                toBeSent.stocks.shares = parseInt(amount);
                toBeSent.stocks.cost = parseInt(cost);
                toBeSent.stocks.price = parseInt(cost)/parseInt(amount);
                toBeSent.stocks.stamp = time;
                let confirmationDiv = document.querySelector(".homieConfirmation");
                confirmationDiv.innerHTML = '<p>Are you sure you want to send the data to your webapp?</p><button id="homieSendyes">Yes</button><button id="homieSendNo">No</button>';

            }
        } else if (e.target.id == "homieSendNo") {
            document.querySelector(".homieConfirmation").innerHTML = "";
            toBeSent = {
                "stocks": {}};
        } else if (e.target.id == "homieSendyes") {
            sendData(toBeSent, "POST", 2);
            console.log(toBeSent);
        } else if (e.target.id == "homieCloseSetting") {
            document.querySelector(".homieSettingsBox").remove();
        } else if (e.target.id == "homieSaveUrl") {
            let url = document.querySelector("#homieUrl").value;
            let notifDiv = document.querySelector(".homieSettingsConfirm");
            if (url === null || url == "" || typeof url == "undefined") {
                notifDiv.innerHTML = '<label class="homieErrorLabel">Please enter the webapp url.</label>';
            } else {
                GM_setValue('link', url);
                notifDiv.innerHTML = '<label class="homieSuccessLabel">Webapp URL saved.</label>';
            }
        }

    });
    document.addEventListener("input",
                              function(g) {
        if (g.target.className == "homieInputBox1") {
            let inpu = document.getElementById(g.target.id).value;
            if (inpu == "" || inpu.startsWith("N") || inpu == "$") {
                return;
            } else {
                let inp = inpu.replace(/,/g, "").replace(/\$/g, "").replace(/\s/g, "");
                let val = inp.split("");
                let lastLetter = val[val.length -1];
                //console.log(lastLetter);
                var digits;
                if (lastLetter == "b" || lastLetter == "B") {
                    val.splice(val.length-1, 1);
                    digits = parseFloat(val.join(""))*1000000000.0
                } else if (lastLetter == "k" || lastLetter == "K") {
                    val.splice(val.length-1, 1);
                    digits = parseFloat(val.join(""))*1000.0;
                } else if (lastLetter == "m" || lastLetter == "M") {
                    val.splice(val.length-1, 1);
                    digits = parseFloat(val.join(""))*1000000.0
                } else {
                    let joined = val.join("");
                    if (joined.includes(".")) {
                        digits = joined.replace(/./g, "h")
                    } else {
                        digits = joined;
                    }
                }
                if (isNaN(parseInt(digits))) {
                    g.target.setAttribute("isError", "yes");

                    g.target.value = val.join("");
                    //console.log(val);
                } else {
                    g.target.value = digits;
                    g.target.setAttribute("isError", "no");
                }
            }
        }
    });
    GM_addStyle(`
.homieInputBox, .homieInputBox1 { margin: 9px; padding: 5px; border-radius: 10px; border: 2px solid #ddd; font-size: 15px; width: 70%; }

.homieErrorLabel {margin-left: 5px; font-weight: normal; color: red;}

.homieSuccessLabel {margin-left: 5px; font-weight: normal; color: green; }

.homie_modal input, .homie_modal select { margin-left: 9px; }

input[isError="yes"] { background-color: #ffbfb1; }

.homie_modal p, .homieSettingsContent p { font-weight: bold; margin-left: 9px; }

.homie_modal button, .homieSettingsContent button { color: white; padding: 5px 15px; display: inline-block; font-size: 16px; border-radius: 5px; transition-duration: 0.4s; margin: 9px; }

#homieReset { background-color: #4e82b3; }

#homieSendData:hover, #homieSendData:active, #homieSaveUrl:hover, #homieSaveUrl:active { background-color: #60c682; }

#homieSendData, #homieSaveUrl { background-color: #42ae68; }

#homieReset:hover, #homieReset:active { background-color: #4294f2; }

#homieCloseModal, #homieCloseSetting { background-color: #c62d2d; }

#homieCloseModal:hover, #homieCloseModal:active, #homieCloseSetting:hover, #homieCloseSetting:active { background-color: #ec6969; }

.homie_modal_content, .homieSettingsContent { font-family: Helvetica; font-size: 1rem; padding: 10px; border-radius: 8px; background-color: rgb(242, 242, 242);}

.homie_header { background-color: #0d0d0d; border: 2px solid #000; border-radius: 0.5em 0.5em 0 0; text-indent: 0.5em; font-size: 18px; color: #ffff; }

.homieConfirmation, .homieSettingsConfirm {text-align: center; margin-top: 10px;}

.homieConfirmation button {color: #3d39bd;}

.homieConfirmation button:hover, .homieConfirmation button:active {color: #6a9add;}

.homieSettingsBox,.homie_modal {margin-top: 9px; margin-bottom: 12px;}
`);

})();