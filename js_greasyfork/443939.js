// ==UserScript==
// @name         Dragon Money Crash Repeater
// @namespace    Script for DragonMoney Casino
// @version      1.13
// @description  Script for DragonMoney Casino
// @author       HotDro4illa
// @icon         https://drgn2r.casino/img/coin-large.94f54501.png
// @match        */games/crash
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443939/Dragon%20Money%20Crash%20Repeater.user.js
// @updateURL https://update.greasyfork.org/scripts/443939/Dragon%20Money%20Crash%20Repeater.meta.js
// ==/UserScript==

(function () {
  ("use strict");
  window.lastbet = false;
  window.lastpressed = new Date();
  window.prevsel = "disabled";
  function moveOptionUp() {
    var selectList = document.getElementById("selectList");
    var selectedOption = selectList.options[selectList.selectedIndex];
    if (selectedOption.previousElementSibling) {
      selectedOption.selected = false;
      selectedOption.previousElementSibling.selected = true;
    }
    selectList.dispatchEvent(new Event("change"));
  }

  function moveOptionDown() {
    var selectList = document.getElementById("selectList");
    var selectedOption = selectList.options[selectList.selectedIndex];
    if (selectedOption.nextElementSibling) {
      selectedOption.selected = false;
      selectedOption.nextElementSibling.selected = true;
    }
    selectList.dispatchEvent(new Event("change"));
  }
  function disableElement() {
    var selectElement = document.getElementById("selectList");
    var autovivodElement = document.getElementById("autovivod");
    const imitc = document.querySelector("#imitation");
    const autoviv = document.querySelector("#autovivod");
    const monc = document.querySelector(".money");
    const percslider = document.querySelector("#percslider");
    const minbet = document.querySelector("#minbet");
    window.realmoney = monc.innerText;
    selectElement.addEventListener("change", function () {
      window.prevsel = selectList.options[selectList.selectedIndex].value;
      window.lastbet = false;
      if (window.prevsel !== "disabled") {
        autovivodElement.disabled = true;
        percslider.disabled = true;
        minbet.disabled = true;
      } else {
        autovivodElement.disabled = false;
        percslider.disabled = false;
        minbet.disabled = false;
      }
    });
    autoviv.addEventListener("change", function () {
      if (autoviv.checked) {
        selectElement.disabled = true;
      } else {
        selectElement.disabled = false;
      }
    });
    imitc.addEventListener("click", function () {
      if (imitc.checked) {
        monc.innerText = "10000";
      } else {
        monc.innerText = window.realmoney;
      }
    });
    const value1 = document.querySelector("#value1");
    const input1 = document.querySelector("#minbet");
    value1.textContent = input1.value;
    input1.addEventListener("input", (event) => {
      value1.textContent = event.target.value;
    });
    const value2 = document.querySelector("#value2");
    const input2 = document.querySelector("#percslider");
    value2.textContent = input2.value;
    input2.addEventListener("input", (event) => {
      value2.textContent = event.target.value;
    });
    document
      .querySelector("#moveOptionDown")
      .addEventListener("click", moveOptionDown);
    document
      .querySelector("#moveOptionUp")
      .addEventListener("click", moveOptionUp);
  }
  function update_select() {
    function addNamesToSelectList() {
      const selectList = document.getElementById("selectList");
      const nameElements = document.getElementsByClassName("name");
      var onlyNames = [];
      nameElements.forEach((elem) => {
        onlyNames.push(nameElements.innerText);
      });
      selectList.innerHTML = "";
      for (let i = 0; i < nameElements.length; i++) {
        var name = nameElements[i].innerText;
        const option = document.createElement("option");
        option.selected = false;
        if (name == "Ставка") {
          name = "disabled";
        }
        if (window.prevsel) {
          if (!onlyNames.includes(window.prevsel)) {
            onlyNames.push(window.prevsel);
            option.value = window.prevsel;
            option.text = window.prevsel;
            option.selected = true;
            selectList.appendChild(option);
          } else {
            if (name == window.prevsel) {
              option.selected = true;
            }
          }
        }
        option.value = name;
        option.text = i + ") " + name;

        selectList.appendChild(option);
      }
      //console.log(nameElements);
    }

    // Create a MutationObserver to detect changes in the elements with class "bets"
    const observer = new MutationObserver(function (mutations) {
      addNamesToSelectList();
    });

    // Start observing changes in the elements with class "bets"
    const betsElements = document.getElementsByClassName(
      "base-card-cont room-rates-cont room-rates-crash"
    );
    for (let i = 0; i < betsElements.length; i++) {
      observer.observe(betsElements[i], { childList: true, subtree: true });
    }
  }

  function makeviv(mutation) {
    const previouslySelectedOption =
      selectList.options[selectList.selectedIndex];
    const butt = document.getElementsByClassName(
      "button button button--md button--"
    )[0];
    const imit = document.querySelector("#imitation").checked;
    const monc = document.querySelector(".money");
    if (mutation.addedNodes[0]) {
      if (mutation.addedNodes[0].className == "x-rate") {
        if (butt.innerText == "Вывести деньги") {
          if (imit) {
            butt.innerText = "Сделать ставку";
            const price = document.querySelectorAll(".input")[1];
            let myPrice = Number(price.value || 1);
            koeff = Number(
              document
                .querySelector(".multiplier-view")
                .innerText.replace("x", "")
            );
            monc.innerText = String(
              Number(monc.innerText) + Math.round(myPrice * koeff)
            );
          } else {
            butt.click();
          }
        }
      }
    }
  }
  function makebet(elem) {
    const previouslySelectedOption =
      selectList.options[selectList.selectedIndex];
    const autoviv = document.querySelector("#autovivod");
    const butt = document.getElementsByClassName(
      "button button button--md button--"
    )[0];
    const imit = document.querySelector("#imitation").checked;
    const monc = document.querySelector(".money");
    const price = document.querySelectorAll(".input")[1];
    const mult = document.querySelector(".multiplier-view");
    if (
      Number(mult.innerText.replace("x", "")) > 1 ||
      mult.className == "multiplier-view no-schedule-end"
    ) {
      return;
    }
    var myPrice, newPrice;
    if (elem.innerText == previouslySelectedOption.text || autoviv.checked) {
      if (butt.innerText == "Сделать ставку") {
        if (!autoviv.checked) {
          newPrice = Number(
            elem.parentElement.parentElement.children[1].children[0].innerText
          );
          myPrice = Number(price.value || 1);
          let oldPrice = Number(window.lastbet || newPrice);
          let resPrice = Math.round(myPrice * (newPrice / oldPrice));
          price.value = String(resPrice);
          price.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          myPrice = Number(price.value || 1);
          newPrice = myPrice;
        }
        if (imit) {
          butt.innerText = "Вывести деньги";
          monc.innerText = String(Number(monc.innerText) - myPrice);
        } else {
          butt.click();
        }
        window.lastpressed = new Date();
        window.lastbet = newPrice;
      }
    }
  }

  function stealing() {
    const autoviv = document.querySelector("#autovivod");
    function addNamesToSelectList(mutations) {
      const selectList = document.getElementById("selectList");

      const previouslySelectedOption =
        selectList.options[selectList.selectedIndex];
      if (
        previouslySelectedOption.text == "disabled" ||
        mutations[0].target.className != "cont-right"
      ) {
        if (!autoviv.checked) {
          return;
        }
      }
      if (mutations[0].target.parentElement.children[0].children[1]) {
        if (
          mutations[0].target.parentElement.children[0].children[1].innerText ==
          previouslySelectedOption.text
        ) {
          mutations.forEach((mutation) => {
            makeviv(mutation);
          });
        } else {
          if (autoviv.checked) {
            const money_one = document.querySelectorAll(".money-one");
            var bigBets = 0;
            for (elem of money_one) {
              if (
                Number(elem.innerText) >=
                Number(document.querySelector("#minbet").value)
              ) {
                bigBets++;
              }
            }
            var curBets = 0;
            for (elem of money_one) {
              if (
                Number(elem.innerText) >=
                  Number(document.querySelector("#minbet").value) &&
                elem.nextSibling.className == "money-two"
              ) {
                elem.setAttribute("style", "background:green");
                curBets++;
                if (
                  curBets >=
                  Math.round(
                    bigBets *
                      Number(document.querySelector("#percslider").value)
                  )
                ) {
                  elem.setAttribute("style", "background:purple");
                  mutations.forEach((mutation) => {
                    makeviv(mutation);
                  });
                }
              }
            }
          }
        }
      }
    }

    // Create a MutationObserver to detect changes in the elements with class "bets"
    const observer = new MutationObserver(function (mutations) {
      addNamesToSelectList(mutations);
    });

    // Start observing changes in the elements with class "bets"
    const betsElements = document.getElementsByClassName(
      "base-card-cont room-rates-cont room-rates-crash"
    );
    for (let i = 0; i < betsElements.length; i++) {
      observer.observe(betsElements[i], { childList: true, subtree: true });
    }
  }

  function stealing2() {
    const autoviv = document.querySelector("#autovivod");
    function addNamesToSelectList(mutations) {
      const mult = document.querySelector(".multiplier-view");
      if (
        Number(mult.innerText.replace("x", "")) > 1 ||
        mult.className == "multiplier-view no-schedule-end"
      ) {
        return;
      }
      if (new Date() - window.lastpressed < 1000) {
        return;
      }
      const butt = document.getElementsByClassName(
        "button button button--md button--"
      )[0];

      const selectList = document.getElementById("selectList");
      const previouslySelectedOption =
        selectList.options[selectList.selectedIndex];
      if (
        previouslySelectedOption.text == "disabled" ||
        mutations[0].target.className != "bets"
      ) {
        if (!autoviv.checked) {
          return;
        }
      }
      if (autoviv.checked) {
        const money_one = document.querySelectorAll(".money-one");
        var bigBets = 0;
        for (elem of money_one) {
          if (
            Number(elem.innerText) >=
            Number(document.querySelector("#minbet").value)
          ) {
            elem.setAttribute("style", "border:solid 1px green");
            bigBets++;
          }
        }
        if (bigBets > 0) {
          bets = document.getElementsByClassName("name");
          for (let elem of bets) {
            makebet(elem);
          }
        }
      } else {
        bets = document.getElementsByClassName("name");
        for (let elem of bets) {
          makebet(elem);
        }
      }
    }

    // Create a MutationObserver to detect changes in the elements with class "bets"
    const observer = new MutationObserver(function (mutations) {
      addNamesToSelectList(mutations);
    });

    // Start observing changes in the elements with class "bets"
    const betsElements = document.getElementsByClassName(
      "base-card-cont room-rates-cont room-rates-crash"
    );
    for (let i = 0; i < betsElements.length; i++) {
      observer.observe(betsElements[i], { childList: true, subtree: true });
    }

    // Create a MutationObserver to detect changes in the elements with class "bets"
    const observer2 = new MutationObserver(function () {
      const mult = document.querySelector(".multiplier-view");
      const butt = document.getElementsByClassName(
        "button button button--md button--"
      )[0];
      if (mult.className == "multiplier-view no-schedule-end") {
        butt.innerText = "Сделать ставку";
      }
    });

    observer2.observe(document.querySelector(".multiplier-view"), {
      attributes: true,
    });

    for (let i = 0; i < betsElements.length; i++) {
      observer.observe(betsElements[i], { childList: true, subtree: true });
    }
  }

  function checkURLAndWait() {
    // Check if URL contains "/games/crash"
    if (window.location.href.includes("/games/crash")) {
      // Wait for element with class "bid-block-cont"
      const waitForElement = () => {
        return new Promise((resolve) => {
          const checkElementExists = () => {
            const element =
              document.querySelector(".bid-block-cont") &&
              document.querySelector(".bets");
            if (element) {
              resolve(element);
            } else {
              setTimeout(checkElementExists, 200);
            }
          };
          checkElementExists();
        });
      };

      // Usage example
      waitForElement().then((element) => {
        console.log(
          "Element with class 'bid-block-cont' has appeared:",
          element
        );
        // Do something with the element here
        document.querySelector(".hitch-hiking").insertAdjacentHTML(
          "afterend",
          `<div><input type="checkbox" id="imitation">
		<label for="imitation">Imitation</label><br>
	
		<input type="checkbox" id="autovivod">
		<label for="autovivod">Autovivod</label><br>
	
		<select id="selectList">
    <option value="disabled">disabled</option>
		</select>
    <br>
      <button class="button" id="moveOptionUp">Move Up</button>
  <button class="button" id="moveOptionDown">Move Down</button>
    <br>
    <input type="range" id="minbet" value="10000" name="slider" min="0" max="40000" step="1000"><span><output id="value1"></output></span>
    <br>
<input type="range" id="percslider" value="0.50" name="slider" min="0" max="1" step="0.1"><span><output id="value2"></output></span>
</div>`
        );
        update_select();
        disableElement();
        stealing();
        stealing2();
      });
    }
  }

  // Call the function when the page loads
  checkURLAndWait();
})();

