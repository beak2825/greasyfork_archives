// ==UserScript==
// @name         InfoCell
// @namespace    http://tampermonkey.net/
// @version      2024-09-28
// @description  Some infos
// @author       qwd
// @match        https://cellcraft.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cellcraft.io
// @grant        none
// @license      qwd
// @downloadURL https://update.greasyfork.org/scripts/510725/InfoCell.user.js
// @updateURL https://update.greasyfork.org/scripts/510725/InfoCell.meta.js
// ==/UserScript==

function Accounts() {
    var wrapper = document.getElementById("overlays");
    var closeOpen = document.createElement("div");
    closeOpen.innerHTML = (`<div id="OpenClose" style="border-radius: 7px;">
          <img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/dropdown-2425289-2035004.png?f=webp&w=256" style="width: 30px; background-color: white; margin-left: 2%; boder-radius: 7px; cursor: pointer">
       </div>`);
    var altBox = document.createElement("div");
    altBox.innerHTML = (`<div id="altBox" style="border: 2px solid white; width: 300px; height: 300px; overflow-y: auto; scrollbar-color: white; scrollbar-width: thin; background-color: black; color: white; margin-left: 2%; position: absolute; width: 25%; border-radius: 7px;">
       <p style="font-size: 30px; font-weight: 900; display: flex; justify-content: center">Accounts</p>
       <div style="display: flex">
          <p style="margin-left: 1%;">AccountName</p>
          <p style="margin-left: 22%;">Recs</p>
          <p style="margin-left: 5%;">Speeds</p>
       </div>
       <div id="accountBox"></div>
       <button id="addAccount" style="border: 2px solid white; background-color: black; color: white; padding: 5px; margin-left: 94%; border-radius: 7px;">+</button>
    </div>`);
    wrapper.appendChild(closeOpen);
    wrapper.appendChild(altBox);

    var status = 1;
    closeOpen.addEventListener("click", closeOpenFunc);
    function closeOpenFunc() {
    if (status === 0) {
        altBox.style.display="block";
        status++
    }
    else {
        altBox.style.display="none";
        status--
    }
    }

    var addBtn = document.getElementById("addAccount");
    addBtn.addEventListener("click", addAccount);

    var accounts = []; 

    loadAccounts();

    function addAccount() {
        var accountIndex = accounts.length; 
        var accountline = createAccountLine(accountIndex, "", "", ""); 
        document.getElementById("accountBox").appendChild(accountline); 
        accounts.push({ index: accountIndex, name: "", rec: "", speed: "" }); 
        saveAccounts(); 
    }

    function createAccountLine(index, name, rec, speed) {
        var accountline = document.createElement("div");
        accountline.setAttribute('id', `acc${index}`);
        accountline.setAttribute('style', "display: flex; gap: 10px; padding: 5px;");

       
        accountline.innerHTML = `
            <div id="acc${index}name" contenteditable="true" style="width: 200px; color: white; border: 1px solid white; padding: 5px; border-radius: 7px;" placeholder="name">${name}</div>
            <div id="acc${index}rec" contenteditable="true" style="width: 50px; color: white; border: 1px solid white; padding: 5px;border-radius: 7px;" placeholder="rec">${rec}</div>
            <div id="acc${index}speed" contenteditable="true" style="width: 50px; color: white; border: 1px solid white; padding: 5px;border-radius: 7px;" placeholder="speed">${speed}</div>
        `;

       
        attachInputListeners(accountline, index);

       
        var setRecNullBtn = document.createElement("button");
        setRecNullBtn.textContent = "0";
        setRecNullBtn.setAttribute('style', "width: 30px; background-color: #2e3034; border-radius: 7px;");
        setRecNullBtn.addEventListener('click', function() {
            setToNull(index, 'rec');
        });

        var setSpeedNullBtn = document.createElement("button");
        setSpeedNullBtn.textContent = "0";
        setSpeedNullBtn.setAttribute('style', "width: 30px; background-color: #2e3034; border-radius: 7px;");
        setSpeedNullBtn.addEventListener('click', function() {
            setToNull(index, 'speed');
        });

        
        var removeBtn = document.createElement("button");
        removeBtn.textContent = "-";
        removeBtn.setAttribute('style', "width: 30px; background-color: red;");
        removeBtn.addEventListener('click', function() {
            removeAccount(index);
        });

        
        accountline.appendChild(setRecNullBtn);
        accountline.appendChild(setSpeedNullBtn);
        accountline.appendChild(removeBtn);

        return accountline; 
    }

    function attachInputListeners(accountline, index) {
        const nameDiv = accountline.querySelector(`#acc${index}name`);
        const recDiv = accountline.querySelector(`#acc${index}rec`);
        const speedDiv = accountline.querySelector(`#acc${index}speed`);

        nameDiv.addEventListener('input', function() {
            accounts[index].name = this.innerText; 
            saveAccounts();
        });

        recDiv.addEventListener('input', function() {
            accounts[index].rec = this.innerText; 
            saveAccounts();
        });

        speedDiv.addEventListener('input', function() {
            accounts[index].speed = this.innerText; 
            saveAccounts();
        });
    }

    function setToNull(id, field) {
        document.getElementById(`acc${id}${field}`).innerText = "0"; 
        accounts[id][field] = "0"; 
        saveAccounts(); 
    }

    function removeAccount(accountIndex) {
        var accountToRemove = document.getElementById(`acc${accountIndex}`);
        if (accountToRemove) {
            accountToRemove.remove();
        }

        accounts.splice(accountIndex, 1);
        updateAccounts();
        saveAccounts();
    }

    function updateAccounts() {
        accounts.forEach((account, index) => {
            var accountDiv = document.getElementById(`acc${index}`);
            if (accountDiv) {
                accountDiv.setAttribute('id', `acc${index}`);
                var divs = accountDiv.querySelectorAll('div');
                divs[0].setAttribute('id', `acc${index}name`);
                divs[1].setAttribute('id', `acc${index}rec`);
                divs[2].setAttribute('id', `acc${index}speed`);

                divs[0].innerText = account.name; 
                divs[1].innerText = account.rec; 
                divs[2].innerText = account.speed; 

               
                attachInputListeners(accountDiv, index);
            }
        });
    }

    function saveAccounts() {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }

    function loadAccounts() {
        var storedAccounts = localStorage.getItem('accounts'); 
        if (storedAccounts) {
            accounts = JSON.parse(storedAccounts); 
            accounts.forEach(account => {
                var accountIndex = account.index; 
                addAccountFromData(accountIndex, account.name, account.rec, account.speed); 
            });
        }
    }

    function addAccountFromData(index, name, rec, speed) {
        var accountline = createAccountLine(index, name, rec, speed);
        document.getElementById("accountBox").appendChild(accountline); 
    }
}

setTimeout(Accounts, 3000);

function infos() {
    var canvas = document.querySelector(".inner-overlays");
    var box = document.createElement("div");
    box.innerHTML = (`
    <div style="background-color: white; margin-top: 200px; position: absolute; z-index: +1; border-radius: 7px; margin-left: 5%; padding: 20px; width: 300px;">
      Info by qwd
      <div id="Levelq">Level: Loading</div>
      <div id="Progressq">XP Gained: Loading</div>
      <div id="coinsq">Coins: Loading</div>
      <div id="coinsgained">Coins gained: Loading</div>
      <div id="playedq">Played: Loading</div>
    </div>
    `);
    canvas.appendChild(box);

    var level = document.getElementById("Levelq");
    var xpbarRaw = document.querySelector(".exp-bar").textContent;
    var xpbar = parseInt(xpbarRaw);
    var progress = document.getElementById("Progressq");
    var coins = document.getElementById("coinsq");
    var coinsgained = document.getElementById("coinsgained");
    var coinsStatusRawOld = document.getElementById("coinsDash").textContent;
    var coinsStatusOld = parseInt(coinsStatusRawOld);
    function update() {
        var lvl = document.getElementById("level").textContent;
        level.innerHTML = "Level: " + lvl;

        var xpbarNewRaw = document.querySelector(".exp-bar").textContent;
        var xpbarNew = parseInt(xpbarNewRaw);
        var xpProgress = xpbarNew - xpbar;
        progress.innerHTML = "XP Gained: " + xpProgress + "%";

        var coinsStatusRaw = document.getElementById("coinsDash").textContent;
        coins.innerHTML = "Coins: " + coinsStatusRaw;

        var coinsStatus = parseInt(coinsStatusRaw);
        var coinsgainedValue = coinsStatus - coinsStatusOld;
        coinsgained.innerHTML = "Coins gained: " + coinsgainedValue;
    }
    setInterval(update, 2000)

    let seconds = 0;
  var timer = document.getElementById("playedq");

  function formatTimeUnit(unit) {
    return unit < 10 ? '0' + unit : unit;
  }

  function updateTimer() {
    seconds++;

    const days = Math.floor(seconds / (60 * 60 * 24));
    const hours = Math.floor((seconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    let displayTime = '';

    if (days > 0) {
      displayTime += formatTimeUnit(days) + ' d ';
    }
    if (hours > 0 || days > 0) {
      displayTime += formatTimeUnit(hours) + ' h ';
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      displayTime += formatTimeUnit(minutes) + ' m ';
    }

    displayTime += formatTimeUnit(secs) + ' s';
    timer.innerHTML = "Played: " + displayTime;
  }

  setInterval(updateTimer, 1000);
}
setTimeout(infos, 3000);




