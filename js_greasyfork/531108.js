// ==UserScript==
// @name        etopfun_roulette_jackpot
// @namespace   etopfun_roulette_jackpot
// @match       https://etopfun.com/*/roulette/
// @match       https://www.etopfun.com/*/roulette/
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0.9
// @author      HVD
// @license     MIT
// @description etopfun roulette jackpot
// @downloadURL https://update.greasyfork.org/scripts/531108/etopfun_roulette_jackpot.user.js
// @updateURL https://update.greasyfork.org/scripts/531108/etopfun_roulette_jackpot.meta.js
// ==/UserScript==

GM_addStyle(`

span.inserted-last, span.inserted-last:hover {
    width: 288px;
    font-weight: bold;
    color: white !important;
    font-family: system-ui, sans-serif;
    font-size: 16px;
    text-transform: uppercase;
    cursor: pointer;
}

#jp-bet-count, #jp-bet-total {
    font-weight: bold;
    color: white !important;
    font-family: system-ui, sans-serif;
    font-size: 16px;
    text-transform: uppercase;
}

.jp-reset-btn {
    color: black !important;
}

span.inserted-last hr {
    width: 50%;
    margin: 10px auto;
    border: none;
    height: 2px;
    background-color: white;
}

.price-container {
    position: fixed;
    top: 150px;
    right: 125px;
    background: #f8f9fa;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #ccc;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    max-width: 400px;
}
.price-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
#priceInput {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
}
#resultBox {
    background: #333;
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    overflow-y: auto;
}

.jp-end-active {
    color: #08e508;
    font-weight: bold;
}

`);


(function() {

    let lastJackpotRoundCount = 0,
        lastx7RoundCount = 0,
        jackpotBetCount = GM_getValue('jackpotBetCount', 0),
        jackpotBetValue = GM_getValue('jackpotBetValue', 0),
        selectedAmount = 0;

    const formulaBase = [
        { price: 1, rounds: 12 },
        { price: 2, rounds: 6 },
        { price: 3, rounds: 4 },
        { price: 4, rounds: 3 },
        { price: 5, rounds: 3 },
        { price: 6, rounds: 2 },
        { price: 8, rounds: 3 },
        { price: 10, rounds: 3 },
        { price: 12, rounds: 2 },
        { price: 14, rounds: 2 },
        { price: 16, rounds: 1 },
        { price: 18, rounds: 1 },
        { price: 20, rounds: 1 }
    ];

    const betFormula = formulaBase.reduce((acc, { price, rounds }, i, arr) => {
        let start = i === 0 ? 1 : acc[i - 1].end + 1;
        let end = start + rounds - 1;
        acc.push({ range: rounds === 1 ? `vòng ${start}` : `vòng ${start} đến ${end}`, price, end, rounds });
        return acc;
    }, []);

    function _display(num) {
      return Number((num).toFixed(2));
    }

    async function findTheLastJackpot() {
        try {

            const infoElement = document.querySelector('span.inserted-last');
            infoElement.style.visibility = 'hidden';

            const response = await fetch(`${location.origin}/api/coinflip/jackpot/infolist.do?page=1&rows=150&lang=en&t=${new Date().getTime()}`);
            const json = await response.json();
            if (json?.datas?.list) {

                let last10WinNum = [...VNEngine.define.inst.last10WinNum].reverse();
                if (json.datas.list[0].id != last10WinNum[0].id) {
                    const apiWinIdPosition = last10WinNum.findIndex(win => win.id === json.datas.list[0].id);
                    if (apiWinIdPosition > 0) {
                        const missingWin = last10WinNum.slice(0, apiWinIdPosition);
                        json.datas.list = [...missingWin, ...json.datas.list];
                    }
                }

                const jackpotPosition = json.datas.list.findIndex(item => item.winpick === 'd');
                if (jackpotPosition !== -1) {
                    lastJackpotRoundCount = jackpotPosition;
                }

                const x7Position = json.datas.list.findIndex(item => item.winpicksub === 'c1' || item.winpicksub === 'c14');
                if (x7Position !== -1) {
                    lastx7RoundCount = x7Position;
                }

                let x14 = `<span class="jp-x14">⟳ JACKPOT: ${lastJackpotRoundCount} TRẬN TRƯỚC</span>`;
                let x7 = `<span class="jp-x7">WIN X7: ${lastx7RoundCount} TRẬN TRƯỚC</span>`;
                infoElement.innerHTML = `${x14} <hr> ${x7}`;
                infoElement.style.visibility = 'unset';
            }
        } catch (error) {
            console.error('Error fetching jackpot data:', error);
        }
    }

    function updateJackpotView() {
        document.getElementById('jp-bet-count').textContent = `Số lần đặt JP: ${jackpotBetCount}`;
        document.getElementById('jp-bet-total').textContent = `Tổng tiền: ${Number(jackpotBetValue.toFixed(2))}`;
    }

    function resetFormula() {

        document.querySelectorAll(".jp-calculator").forEach(el => el.classList.remove("jp-end-active"));

        let currentProgress = betFormula.find(item => jackpotBetCount < item.end);
        if (currentProgress) {
            document.querySelector(`#jp-end${currentProgress.end}`)?.classList.add("jp-end-active");
        }
        if (!document.querySelector(".jp-end-active")) {
            document.querySelector(`#jp-end${betFormula[0].end}`)?.classList.add("jp-end-active");
        }
    }

    function resetJackpotCount() {
        jackpotBetCount = 0;
        jackpotBetValue = 0;
        GM_setValue("jackpotBetCount", jackpotBetCount);
        GM_setValue("jackpotBetValue", jackpotBetValue);
        updateJackpotView();
        resetFormula();
    }

    function showJackpotSummary() {
        document.querySelector('.triple-jackpot-button')?.insertAdjacentHTML('afterbegin',
            `<span id="jp-bet-count"></span>&nbsp;&nbsp;|&nbsp;&nbsp;<span id="jp-bet-total"></span>
            <button type="button" class="jp-reset-btn roll-btn">Reset</button>`);
        updateJackpotView();
    }

    document.body.addEventListener('click', e => {

        const target = e.target;

        if (target.matches('.count-right span[role="button"]') || target.closest('div.item_box')) {
            let selectedAmountElement = document.querySelector('#selected-amount');
            if (!selectedAmountElement) {
                document.querySelector('.modal-body-tab').insertAdjacentHTML('beforeend', `<div><div class="btn btn-info" disabled><span id="selected-amount">Đã chọn: 0</span></div></div>`);
                selectedAmountElement = document.querySelector('#selected-amount');
            }
            selectedAmount = Number(VNEngine.define.inst.selectedList.reduce((acc, item) => acc + item.value, 0).toFixed(2));
            selectedAmountElement.textContent = `Đã chọn: ${selectedAmount} \$`;
            return;
        }

        if (target.matches('.jp-reset-btn')) {
            resetJackpotCount();
            return;
        }

        if (target.closest('span.inserted-last')) {
            findTheLastJackpot();
            return;
        }

    });


    let firstRun = true;

    (function wait() {

        if (VNEngine?.define?.inst) {

            document.body.insertAdjacentHTML("beforeend", `
                <div class="price-container">
                    <div class="price-box">
                        <input type="text" id="priceInput" placeholder="Nhập số tiền cược">
                        <div id="resultBox"></div>
                    </div>
                </div>
            `);

            let inputBox = document.getElementById("priceInput");
            let resultBox = document.getElementById("resultBox");

            inputBox.addEventListener("input", () => {
                inputBox.value = inputBox.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); // Only allow numbers & one decimal

                const multiplier = parseFloat(inputBox.value);
                if (isNaN(multiplier)) return (resultBox.innerHTML = "");

                let cumulative = 0, total = 0;
                resultBox.innerHTML = betFormula.map(({ range, price, end, rounds }) => {
                    cumulative += rounds; // Cumulative sum of all previous rounds
                    price = price * multiplier;
                    let subtotal = (price * rounds) + total; // Current subtotal
                    total = subtotal; // Update total
                    return `<p class="jp-calculator" id="jp-end${end}" title="${_display(price)} * ${rounds} + ${_display(total - (price * rounds))} = ${_display(total)}">${range} => ${_display(price)} $</p>`;

                }).join("") + `<hr><p class="total-row">Yêu cầu vốn: ${_display(total)} $</p>`;

                resetFormula();
            });

            const openOrig = XMLHttpRequest.prototype.open;
            const sendOrig = XMLHttpRequest.prototype.send;

            XMLHttpRequest.prototype.open = function (method, url, ...args) {
                if (url.includes('listroll.do')) {
                    const selectedAmountElement = document.querySelector('#selected-amount');
                    if (selectedAmountElement) {
                        selectedAmount = 0;
                        selectedAmountElement.textContent = `Đã chọn: 0`;
                    }
                }
                this._isJoinBet = url.includes('jackpot/join.do');
                return openOrig.apply(this, [method, url, ...args]);
            };

            XMLHttpRequest.prototype.send = function (body) {
                if (this._isJoinBet) {
                    this.addEventListener('readystatechange', function () {
                        if (this.readyState === 4 && VNEngine.define.inst.pick === 'd') {
                            try {
                                const response = JSON.parse(this.responseText);
                                if (response.statusCode === 200) {
                                    jackpotBetCount++;
                                    jackpotBetValue += Number(selectedAmount.toFixed(2));

                                    GM_setValue("jackpotBetCount", jackpotBetCount);
                                    GM_setValue("jackpotBetValue", jackpotBetValue);

                                    updateJackpotView();

                                    let currentIndex = betFormula.findIndex(item => item.end === jackpotBetCount);
                                    let nextProgress = currentIndex !== -1 ? betFormula[currentIndex + 1] : null;
                                    if (nextProgress) {
                                        document.querySelectorAll(".jp-calculator").forEach(el => el.classList.remove("jp-end-active"));
                                        document.querySelector(`#jp-end${nextProgress.end}`)?.classList.add("jp-end-active");
                                    }
                                }
                            } catch (error) {
                                console.error('⚠️ Error parsing response:', error);
                            }
                        }
                    });
                }
                return sendOrig.apply(this, [body]);
            };

            const _parseCoinMsg = VNEngine.define.inst.parseCoinMsg;
            VNEngine.define.inst.parseCoinMsg = (data) => {

                _parseCoinMsg(data);

                let type = data.type;
                let datas = data.datas;

                if (type == 3) {

                    if (datas.winpicksub === 'd') {
                        lastJackpotRoundCount = 0;
                        if (jackpotBetCount > 0) {
                            VNEngine.dialog.confirm('', "JACKPOT RỒI! RESET LẠI BẢNG ĐẾM KHÔNG?", () => resetJackpotCount(), () => {});
                            if (VNEngine.define.inst.pick === 'd') {
                                let totalWon = selectedAmount * 13;
                                let profit = totalWon - jackpotBetValue;
                                resultBox.innerHTML += `<p>Lần cuối lãi: ${_display(profit)} $</p>`;
                            }
                        }
                    }
                    else lastJackpotRoundCount++;

                    if (['c1', 'c14'].some(keyword => datas.winpicksub === keyword)) lastx7RoundCount = 0;
                    else lastx7RoundCount++;

                    let x14 = `<span class="jp-x14">⟳ JACKPOT: ${lastJackpotRoundCount} TRẬN TRƯỚC</span>`;
                    let x7 = `<span class="jp-x7">WIN X7: ${lastx7RoundCount} TRẬN TRƯỚC</span>`;
                    document.querySelector('span.inserted-last').innerHTML = `${x14} <hr> ${x7}`;

                    const mapWinpick = win => win === 'c1' ? 'a' : win === 'c14' ? 'b' : win;
                    const last10WinNum = [...VNEngine.define.inst.last10WinNum].slice(-3);
                    const winGrouped = last10WinNum.map(win => mapWinpick(win.winpicksub));
                    const allSameWinPick = new Set(winGrouped).size === 1;
                    if (allSameWinPick) {
                        new Audio('https://www.myinstants.com/media/sounds/brave-browser-timer-sound.mp3').play();
                    }

                    if (lastJackpotRoundCount === 25) {
                        new Audio('https://www.myinstants.com/media/sounds/slot-machine-jackpot-sound-effect.mp3').play();
                    }

                    return;
                }

                if (type == 13 && firstRun) {
                    firstRun = false;
                    findTheLastJackpot();
                    showJackpotSummary();
                }

            };

            return;
        }

        requestAnimationFrame(wait);

    })();


})();