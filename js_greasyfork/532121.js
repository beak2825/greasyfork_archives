// ==UserScript==
// @name         Secret BO
// @namespace    http://tampermonkey.net/
// @version      v0.0.5
// @description  backoffice service
// @author       Serhat Yalcin
// @match        https://bo.bo-2222eos-gbxc.com/player/financial/*
// @match        https://bo.bo-2222eos-gbxc.com/player/bets/*
// @match        https://bo.bo-2222eos-gbxc.com/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bo-2222eos-gbxc.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532121/Secret%20BO.user.js
// @updateURL https://update.greasyfork.org/scripts/532121/Secret%20BO.meta.js
// ==/UserScript==

(async function() {
    const style = document.createElement('style');
    style.innerHTML = `
:root {
  --top-page-title: 70px;
  --top-financial: 50px
}

ul.notes.feeds {
    font-size: 1.5rem !important;
}
`;
    document.head.appendChild(style);

    const amountInputElement = document.querySelector('input[name="amount"]');
    const bonusDescriptionElement = document.querySelector('textarea[name="description"]');
    const balance = document.querySelector('div[style="font-size: 15px; padding-top: 5px;"]').firstElementChild.firstElementChild.innerText;
    const transactionTypeElement = document.querySelector('#transaction_type');

    const url = location.href;
    const year = new Date().getFullYear();
    const month = new Date().getMonth()+1;
    const day = new Date().getDate();
    const yday = new Date().getDate()-1;
    const tomo = new Date().getDate()+1;
    const userId = location.pathname.replace('/lifetime','').split('/').pop();
    const paramFrom = "?from=" + year + "." + month + "." + day + ".00.00";
    const paramFromYesterday = "?from=" + year + "." + month + "." + yday + ".00.00";
    const paramTo= "&to=" + year + "." + month + "." + day + ".23.59";
    const paramToTomo = "&to=" + year + "." + month + "." + tomo + ".23.59";

    const date = (argDate) => {
        let dmy = argDate.split(" ")[0];
        let dd = dmy.split("/")[0];
        let mm = dmy.split("/")[1];
        let yyyy = dmy.split("/")[2];
        let result = yyyy + "." + mm + "." + dd;

        if (argDate.includes(" ")) {let time = argDate.split(" ")[1]; let hours = time.split(":")[0]; let minutes = time.split(":")[1]; let seconds = time.split(":")[2]; result = result + "." + hours + "." + minutes + "." + seconds;}
        else {result = result + ".00.00.00";}

        return result;
    }

    const formatNumber = (value, isDecimal) => {
        let abc = String(value);

        if (abc.charAt(abc.length - 3) === '.') {

            let tamKisim = abc.split(".")[0];
            let ondalikKisim = abc.split(".")[1];

            let tam = tamKisim.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            let ondalik = tam + "," + ondalikKisim;

            if (isDecimal && ondalikKisim && ondalikKisim !== "00") {
                return ondalik;
            } else {
                return tam;
            }

        } else {
            return abc.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        };

    }

    if(!location.href.includes('from') && !location.href.includes('lifetime') && !location.href.includes("search") && !location.href.includes("bets")) {

        let hour = new Date().getHours();
        if (hour === 23) {window.location.replace(url.split("?")[0] + paramFrom + paramToTomo); return;}
        if (hour === 0 || hour === 1 || hour === 2 || hour === 3) {window.location.replace(url.split("?")[0] + paramFromYesterday + paramTo); return;}

        window.location.replace(url + paramFrom + paramTo);
        return;
    }
    const delay = (sec) => new Promise(resolve => setTimeout(resolve, sec * 1000))
    const username = document.querySelector('.page-title a').innerText
    document.querySelector('title').innerText = username.match(/ ([a-z-A-Z0-9ığüşiöçİĞÜŞİÖÇ \W]+)/)[1].trim()
    const ico = 'data:image/x-icon;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAKoDRC7coUQu3f9ELt3/RC7d/0Qu3f9ELt3/Qy3eawAAAAAAAAAAVQCqA0Mt3aNELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3KJVAKoDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQCqA0Qu3qFELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3KAAAP8CAAAAAAAAAAAAAAAAVQCqA0Qu3KJELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3KJVAKoDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFUAqgNELtyiRC7d/0Qu3f9ELt3/RC7d/0Qu3f9FLtyggAD/AgAAAAAAAAAAAAAAAAAAAAAAAAAAVQCqA0Qu3qFELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3qFVAKoDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAKoDRC7cokQu3f9ELt3/RC7d/0Qu3f9ELt3/RS7eoFUAqgMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQCqA0Qu3KFELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3KFVAKoDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQCqA0Qu3KJELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3qCAAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQCqA0Uu3qBELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3KFVAKoDAAAAAAAAAAAAAAAAAAAAAFUAqgNELtyiRC7d/0Qu3f9ELt3/RC7d/0Qu3f9FLt6gVQCqAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAD/AkMu3KBELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3qFVAKoDAAAAAAAAAABVAKoDRC7cokQu3f9ELt3/RC7d/0Qu3f9ELt3/RS7eoFUAqgMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAD/AkMt3Z9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3qFVAKoDVQCqA0Qu3KJELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3qCAAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAD/AkMt3Z9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3qFELtyiRC7d/0Qu3f9ELt3/RC7d/0Qu3f9FLt6gVQCqAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AkUu3KBELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RS7eoIAA/wIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AkMt3Z9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Mt3KCAAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAD/AkMt3Z9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9DLd2fgAD/AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAP8CQy3dn0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Mt3Z+AAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AkMt3Z9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Mt3KCAAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wJDLd2fRC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3qCAAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8CQy3cn0Qu3f9ELt3/RC7d/0Qu3f9ELt3/Qy3dn0Mt3Z9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3qBVAKoDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AkQt3Z5ELt3/RC7d/0Qu3f9ELt3/RC7d/0Mt3Z+AAP8CgAD/AkMt3KBELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3qCAAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wJELd2eRC7d/0Qu3f9ELt3/RC7d/0Qu3f9DLd2fAAD/AgAAAAAAAAAAgAD/AkUu3qBELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3qBVAKoDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8CRC3dnkQu3f9ELt3/RC7d/0Qu3f9ELt3/Qy3cnwAA/wIAAAAAAAAAAAAAAAAAAAAAgAD/AkUu3qBELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3qBVAKoDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AkQt3Z5ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qt3Z4AAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVQCqA0Uu3qBELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3qCAAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAA/wJDLdyfRC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELd2eAAD/AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAD/AkUu3qBELt3/RC7d/0Qu3f9ELt3/RC7d/0Uu3qBVAKoDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8CQy3dn0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC3dngAA/wIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AACAAP8CRC/dUkQu3eJELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RS7d4kQu3VOAAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AUIu4EJDLtzjRC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9DLtzjQi7gQgAA/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AUIu4EJDLtzjRC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9DLtzjQi7gQgAA/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAP8CRC/dUkQu3eJELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RS7d4kQu3VOAAP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wFBL91SRC7c5UQu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3f9ELt3/RC7d/0Qu3uVELt1TAAD/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAA/wFFLt1DQy/dxUQu3eFELdzVRC3dcQAA/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wFAJuYURTDdJTMz5goAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMzPmCkUw3SVAJtkUAAD/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=='
    document.querySelector('link[rel="shortcut icon"]').setAttribute('href', ico)

    const formBody = document.querySelector('.portlet-body.form .form-body')
    const credits = formBody.querySelectorAll('.portlet-body')[2]

    // document.querySelector(".page-title > h3 a[href]").setAttribute("href", "")
    document.querySelector('.menu-toggler.sidebar-toggler').click();

    const portleys = document.querySelectorAll('.financial .form-body > div.row')
    const wallet = portleys[5]
    wallet.querySelector('.tools > a').click()
    const walletPanel = wallet.querySelector('#DataTables_Table_0_wrapper')
    const walletTable = wallet.querySelector('#DataTables_Table_0_wrapper table')
    const walletSelect = walletPanel.querySelector('#DataTables_Table_0_length select')
    walletSelect.value = '200'
    const event = new Event('change', { bubbles: true });
    await delay(0.5)
    walletSelect.dispatchEvent(event);


    const colorTable = () => {
        const rowsTransactions = document.querySelectorAll("#DataTables_Table_0 tbody tr:not([style*='display: none']):not([style*='background-color: black'])")
        rowsTransactions.forEach((rowTransactions) => {
            let desc
            const type = rowTransactions.querySelector("td:nth-child(2)")
            const process = type.innerText.trim()
            switch (process) {
                case "Deposit (OK)":
                case "Deposit (Manual)":
                    rowTransactions.style.backgroundColor = isOpen ? "rgba(0, 255, 0, 0.2)" : '';
                    rowTransactions.style.fontWeight = isOpen ? "bold" : '';
                    break
                case 'Remove Credits':
                case 'Add Credits':
                    rowTransactions.remove()
                    break
                case "Withdraw (OK)":
                    rowTransactions.style.backgroundColor = isOpen ? "rgba(255, 0, 0, 0.2)" : ''
                    break
                case "Withdraw (Request)":
                    rowTransactions.style.backgroundColor = isOpen ? "rgba(255,165,0, 0.2)" : ''
                    break
                case "Manual Bonus":
                case "Created Bonus":
                    desc = rowTransactions.cells[11].innerText.trim()
                    if (desc.match(/(?:ş|s?)a?ns/)) {
                        rowTransactions.style.backgroundColor = isOpen ? "rgba(155, 0, 255, 0.4)" : ''
                    } else {
                        rowTransactions.style.backgroundColor = isOpen ? "rgba(0, 0, 255, 0.3)" : ''
                    }
                    break
                case "Withdraw (Manual)":
                    rowTransactions.style.backgroundColor = isOpen ? "rgba(220, 20, 60, 0.5)" : ''
                    break
                case "Withdraw (Request)":
                    rowTransactions.style.backgroundColor = isOpen ? "rgba(255,165,0, 0.2)" : ''
                    break
                case "Closed Bonus":
                    rowTransactions.style.backgroundColor = isOpen ? "rgba(75, 0, 125, 0.3)" : ''
                    break;
                case "WonBet":
                case "Cashout":
                case "RollbackBet":
                case "Deposit (Request)":
                case "Deposit (Cancel)":
                    rowTransactions.style.display = "none";
                    break
                default:
                    break
            }
        });
    }


    const numberFormat = (given) => {
        const pattern = /\B(?=(\d{3})+(?!\d))/g;

        return given.replace(pattern, ",");
    }

    const format = async () => {
        const rowTable = document.querySelectorAll("#DataTables_Table_0 tbody tr:not([style*='display: none']):not([style*='background-color: black'])");

        for (let row of rowTable) {
            const withdrawCell = row.querySelector("td:nth-child(6)");
            const insideCell = row.querySelector("td:nth-child(7)");
            const finalCell = row.querySelector("td:nth-child(8)");
            insideCell.innerText = numberFormat(insideCell.innerText);
            finalCell.innerText = numberFormat(finalCell.innerText);
            withdrawCell.innerText = numberFormat(withdrawCell.innerText);
        }

        const creditTable = document.querySelectorAll(".financial .form-body div.row")[5];
        const creditTableRow = creditTable.querySelectorAll("tbody tr:first-child td");

        for (let cell of creditTableRow) {
            cell.innerText = numberFormat(cell.innerText);
        }

        const overallTable = document.querySelectorAll(".financial .form-body div.row")[6];
        const overallTableRow = overallTable.querySelectorAll("tbody tr:nth-child(n+2)");

        for (let trRow of overallTableRow) {
            for (let cell of trRow.querySelectorAll("td")) {
                cell.innerText = numberFormat(cell.innerText);
            }
        }

        const overallFootTable = document.querySelectorAll(".financial .form-body div.row")[6];
        const overallTableFootRow = overallFootTable.querySelector("tfoot tr");

        for (let row of overallTableFootRow.querySelectorAll("td")) {
            row.innerText = numberFormat(row.innerText);
        }

        let mainDeposit = document.querySelector(".page-title > div > div > div > div > span > span");
        mainDeposit.innerText = numberFormat(mainDeposit.innerText);
    }


    let isOpen = false
    const tableHead = document.querySelector("#DataTables_Table_0 thead tr[role='row']")
    const thType = tableHead.querySelector('th:nth-child(2)')
    const thDate = tableHead.querySelector('th:nth-child(3)')
    thType.addEventListener('dblclick', async () => {
        isOpen = true
        colorTable();
        format();
    })
    thDate.addEventListener('click', () => {
        isOpen = false
        colorTable()
    });

    // await delay(0.5);
    // format();

    const shortcutTextArea = (text) => {
        const textArea = document.querySelector("[name='description']");
        switch (text) {
            case "dcd":
                textArea.value = "dc deal ";
                break;
            case "dcgn":
                textArea.value = "dc gün sonu";
                break;
            case "dcl":
                textArea.value = "dc laps 30";
                break;
            case "sl":
                textArea.value = "slot";
                break;
            case "sg":
                textArea.value = "slot gece";
                break;
            case "sf":
                textArea.value = "slot first 30";
                break;
            case "s1":
                textArea.value = "slot first 100";
                break;
            case "sp":
                textArea.value = "spor";
                break;
        }
    }

    const setBonus = (bonusAmount, description) => {
        amountInputElement.value = Math.floor(bonusAmount);
        bonusDescriptionElement.value = description;
        transactionTypeElement.value = "bonus";
        transactionTypeElement.dispatchEvent(new Event("change"));
        amountInputElement.dispatchEvent(new Event("input"));
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    const checkBalance = (depAmount) => {
        if (balance >= 20) {
            alert("HATA Bakiye mevcut!");
            return false;
        } else if (balance >= (depAmount * 5) / 100) {
            alert("HATA Bakiye mevcut!");
            return false;
        }
        return true;
    }

    const descriptionTextArea = document.querySelector("[name='description']");
    descriptionTextArea.addEventListener("input", (e) => shortcutTextArea(e.target.value));

    const observationWalletTable = async () => {
        const rowsTransactions = document.querySelectorAll("#DataTables_Table_0 tbody tr:not([style*='display: none']):not([style*='background-color: black'])");

        const kt = rowsTransactions[0]?.querySelector("td:nth-child(3)")?.textContent?.substring(0, 2);
        let previous = null;
        let depId = 0;
        let cekId = 0;
        let removeCount = 0;


        if (rowsTransactions !== null && rowsTransactions.length !== 0 && walletSelect.value === "200") {
            observerTransactions.disconnect();

            const text = rowsTransactions[0].querySelector("td:nth-child(3)");

            rowsTransactions.forEach((rowTransactions) => {
                const type = rowTransactions.querySelector("td:nth-child(2)");
                const process = type.innerText.trim();

                const cellDate = rowTransactions.cells[2];
                const cellMinus = rowTransactions.cells[5];
                const cellPlus = rowTransactions.cells[6];
                const cellFinal = rowTransactions.cells[7];
                const cellBonusMinus = rowTransactions.cells[8];
                const cellBonusPlus = rowTransactions.cells[9];
                const cellBonusFinal = rowTransactions.cells[10];

                let description = "";
                let withdrawId = "";
                let betId = "";

                cellPlus.textContent = formatNumber(cellPlus.textContent.trim(), false);
                cellMinus.textContent = formatNumber(cellMinus.textContent.trim(), false);
                cellFinal.textContent = formatNumber(cellFinal.textContent.trim(), false);

                switch(process) {
                    case "Deposit (OK)":
                    case "Deposit (Manual)":
                        cellPlus.style.textDecoration = 'underline';
                        cellDate.innerHTML = "<a href='https://bo.bo-2222eos-gbxc.com/player/financial/" + userId + "?from=" + date(cellDate.textContent) + "' style='color:black'><u>" + cellDate.textContent + "</u></a>";

                        cellMinus.classList.remove("text-right");
                        cellMinus.classList.add("text-center");

                        if (!cellMinus.querySelector('input[type="checkbox"]')) {
                            var checkbox = document.createElement("input");
                            checkbox.type = "checkbox";
                            checkbox.style.transform = 'scale(1.5)';

                            depId += 1;
                            checkbox.id = depId;
                            checkbox.classList.add("deposit");

                            checkbox.setAttribute('data-deposit-amount', parseInt(formatNumber(cellPlus.textContent.trim(), false).replace(".","")));
                            cellMinus.appendChild(checkbox);
                        }

                        cellPlus.textContent = formatNumber(cellPlus.textContent.trim(), false);
                        cellPlus.style.cursor = "pointer";

                        if (cellBonusFinal.textContent === "N/A") {cellBonusFinal.textContent = "0";} else {cellBonusFinal.textContent = formatNumber(cellBonusFinal.textContent.trim(), false);}

                        cellPlus.addEventListener("click", () => {
                            const depAmount = parseInt(cellPlus.textContent.trim().replace(".",""));
                            const percentage = prompt("Bonus oranı? (%):", "");
                            let bonusAmount = 0;

                            if (percentage === "slot" || percentage === "st") {
                                bonusAmount = (depAmount * 25) / 100;
                                setBonus(bonusAmount, "slot");
                            } else if (percentage === "slot 30" || percentage === "st 30" || percentage === "sfd" || percentage === "hgs") {
                                bonusAmount = (depAmount * 30) / 100;
                                setBonus(bonusAmount, "slot 30 first dep");
                            } else if (percentage === "dc20" || percentage === "dc 20" || percentage === "dca") {
                                bonusAmount = (depAmount * 20) / 100;
                                setBonus(bonusAmount, "dc 20");
                            } else if (percentage === "slot 100" || percentage === "st 100" || percentage === "hgs 100") {
                                bonusAmount = (depAmount * 100) / 100;
                                setBonus(bonusAmount, "slot 100 first dep");
                            } else if (percentage === "cc") {
                                bonusAmount = (depAmount * 10) / 100;
                                setBonus(bonusAmount, "cc");
                            } else if (percentage === "spor" || percentage === "sr") {
                                bonusAmount = (depAmount * 20) / 100;
                                setBonus(bonusAmount, "spor");
                            } else if (percentage === "vegas" || percentage === "vg") {
                                bonusAmount = (depAmount * 50) / 100;
                                setBonus(bonusAmount, "vegas");
                            } else if (percentage === "dc" || percentage === "dsc") {
                                if (!checkBalance(depAmount)) {
                                    return;
                                }
                                bonusAmount = (depAmount * 25) / 100;
                                setBonus(bonusAmount, "dc");
                            } else if (percentage === "dc 30" || percentage === "dfd" || percentage === "dcfd" || percentage === "dscfd") {
                                if (!checkBalance(depAmount)) {
                                    return;
                                }
                                bonusAmount = (depAmount * 30) / 100;
                                setBonus(bonusAmount, "dc 30 first dep");
                            } else if (percentage === "dgs" || percentage === "dcgs" || percentage === "dscgs") {
                                if (!checkBalance(depAmount)) {
                                    return;
                                }
                                bonusAmount = (depAmount * 25) / 100;
                                setBonus(bonusAmount, "dc gün sonu");
                            } else if (percentage !== null && percentage !== "" && percentage.startsWith("deal ") || percentage.startsWith("d ")) {
                                const bonusPercentage = percentage.split(" ")[1];
                                bonusAmount = (depAmount * bonusPercentage) / 100;
                                setBonus(bonusAmount, "deal " + bonusPercentage);
                            } else if (percentage !== null && percentage !== "" && percentage.startsWith("dc deal ") || percentage.startsWith("dcd ")) {
                                if (!checkBalance(depAmount)) {
                                    return;
                                }

                                const bonusPercentage = percentage.split(" ")[1];
                                bonusAmount = (depAmount * bonusPercentage) / 100;
                                setBonus(bonusAmount, "dc deal " + bonusPercentage);
                            } else if (percentage !== null && percentage !== "" && !isNaN(percentage) && percentage <= 100) {
                                bonusAmount = (depAmount * parseInt(percentage)) / 100;
                                setBonus(bonusAmount, "");
                            }
                        });
                        break;
                    case "Add Credits":
                    case "Remove Credits":
                        if (process === "Remove Credits") {
                            removeCount += 1;
                        }
                        // rowTransactions.style.display = "none";
                        break;
                    case "WonBet":
                    case "Cashout":
                    case "RollbackBet":
                    case "Deposit (Request)":
                    case "Deposit (Cancel)":
                        rowTransactions.style.display = "none";
                        break
                    default:
                        break
                }
            });
            // document.querySelector("#DataTables_Table_0 thead tr:nth-child(2) th").innerText = removeCount === 0 ? "" : removeCount;
            // document.querySelector("#DataTables_Table_0").style.border = removeCount === 0 ? "" : "1px solid red";
        }
    }

    const observerTransactions = new MutationObserver(observationWalletTable);

    const observerConfigTransactions = { childList: true, subtree: true };
    observerTransactions.observe(document, observerConfigTransactions);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && e.altKey) {
            console.log("Alt + " + e.key + " is pressed.");
            document.querySelector("button[value='add']").click();
        }
    });

    const toFloat = (number) => {
        return parseFloat(number);
    }

    const checkDeposit = () => {
        const depositElement = document.querySelector('div.form-body > div.row:nth-child(3) table > tbody > tr:first-child > td:nth-child(2)');
        const withdrawElement = document.querySelector('div.form-body > div.row:nth-child(3) table > tbody > tr:first-child > td:nth-child(6)');
        const deposit = toFloat(depositElement.innerText);
        const withdraw = toFloat(withdrawElement.innerText);

        if (deposit - withdraw > 0) {
            depositElement.style.color = 'green';
            withdrawElement.style.color = 'green';
        } else if (deposit - withdraw <= 0) {
            depositElement.style.color = 'red';
            withdrawElement.style.color = 'red';
        }
    }

    checkDeposit();

    const selectAllNotes = () => {
        const label = document.querySelector('#note > div.portlet-body label > input')
        label.click();
        if (label.checked) {
            clearInterval(labelInterval);
        }
    }

    const labelInterval = setInterval(() => {
        selectAllNotes();
    }, 1000);


    const notesEdit = () => {
        const notesP = document.querySelector("ul.notes.feeds");

        const notes = notesP.querySelectorAll('li');
        if (!notesP) {return}
        if (!notes) {return}
        let isFirstBonusNote = false;

        notes.forEach((note) => {
            const desc = note.querySelector('div.col1 > div > div.cont-col2 > div > span:nth-child(2')
            if (note.innerText.includes('%') && !isFirstBonusNote) {
                console.log(desc.style.color);
                isFirstBonusNote = true;
                desc.style.color = 'red';
                desc.style.fontWeight = "bold";
                console.log(desc.style.color);
            } else if (note.innerText.includes('%') && isFirstBonusNote) {
                desc.style.textDecoration = 'line-through';
                desc.style.textDecorationColor = 'red';
                desc.style.textDecorationThickness = '2px';
                desc.style.fontWeight = "bold";
            }
        });
    }

    notesEdit();

    const createElement = (el, child = null) => {
        const element = document.createElement(el);

        if (child === null) { return element; }

        element.appendChild(child);
        return element;
    }

    const orderPageTitle = () => {
        const pageTitleElement = document.querySelector('div.financial > div.page-title');
        const smallElement = pageTitleElement.querySelector('small');
        const h3Element = pageTitleElement.querySelector('h3');

        smallElement.remove();

        const divElement = createElement('div', h3Element);
        divElement.setAttribute('id', 'order-page-title');
        divElement.appendChild(smallElement);
        pageTitleElement.insertBefore(divElement, pageTitleElement.firstChild);
    }

    orderPageTitle();

    const getInfoPlay = () => {
        const overall = document.querySelector('div.financial div.portlet-body.form > div.form-body > div.row:nth-child(4)');
        const sportElement = overall.querySelector('div.portlet-body tbody > tr:nth-child(2) > td:nth-child(2)');
        const casinoElement = overall.querySelector('div.portlet-body tbody > tr:nth-child(3) > td:nth-child(2)');
        const liveCasinoElement = overall.querySelector('div.portlet-body tbody > tr:nth-child(4) > td:nth-child(2)');

        const sport = toFloat(sportElement.innerText);
        const casino = toFloat(casinoElement.innerText);
        const liveCasino = toFloat(liveCasinoElement.innerText);

        console.log(sport, casino, liveCasino);

        const divContainer = createElement('div');
        divContainer.setAttribute('id', 'info-play');
        const sportTextElement = createElement('h3');
        const casinoTextElement = createElement('h3');
        const liveCasinoTextElement = createElement('h3');

        sportTextElement.innerText = `Sport: ${sport}`;
        casinoTextElement.innerText = `Casino: ${casino}`;
        liveCasinoTextElement.innerText = `Live Casino: ${liveCasino}`;

        divContainer.appendChild(sportTextElement);
        divContainer.appendChild(casinoTextElement);
        divContainer.appendChild(liveCasinoTextElement);

        console.log(divContainer);

        document.querySelector('#order-page-title').appendChild(divContainer);

    }

    // getInfoPlay();
})();