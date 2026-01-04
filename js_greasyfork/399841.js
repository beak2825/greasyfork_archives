// ==UserScript==
// @name         TUS: Stock tracking helper
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @description  Helps tracking stocks and opening them
// @author       AllMight [1878147]
// @match        https://www.torn.com/stockexchange.php
// @match        https://www.torn.com/laptop.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399841/TUS%3A%20Stock%20tracking%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/399841/TUS%3A%20Stock%20tracking%20helper.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var css = `
.am-box-title {
background: repeating-linear-gradient(90deg,#2a1d6a,#2a1d6a 2px,#3835a8 0,#3835a8 4px) !important;
display: flex;
align-items: center;
justify-content: space-between;
}

.am-box-title-chevron {
width: 13px;
height: 20px;
fill: white;
margin-right: 10px;
cursor: pointer;
}

.am-box-title-close-chevron {
transform: rotate(-90deg);
}

.am-checkbox-box-content {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(6em, 1fr));
}

.am-buttons-box-content {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(7.5em, 1fr));
}

.am-button-container {
display: flex;
padding: 5px;
align-items: stretch;
}

.am-button-inner-container {
display: flex;
flex-direction: column;
flex: 1;
}

.am-button-icons-container {
display: flex;
align-items: center;
margin-left: 5px;
width: 20.8px;
}

.am-button {
width: 100%;
cursor: pointer;
outline: none;
border: none;
padding: 0.4em 1em;
border-radius: 0.2em;
text-decoration: none;
font-family: 'Roboto',sans-serif;
font-weight: 400;
color: #FFFFFF;
background-color: #3369ff;
box-shadow: inset 0 -0.6em 1em -0.35em rgba(0,0,0,0.17), inset 0 0.6em 2em -0.3em rgba(255,255,255,0.15), inset 0 0 0em 0.05em rgba(255,255,255,0.12);
margin-bottom: 5px;
}

.am-button-amount-input {
width: calc(100% - 20px);
}

.am-alert-mark {
font-size: 1.3rem;
cursor: pointer;
color: red;
}

.am-buy-symbol{
font-size: 1.3rem;
cursor: pointer;
}

.am-refresh-btn {
display: flex;
outline: none;
border: none;
background-color: transparent;
cursor: pointer;
padding: 0;
}

.am-checkbox-label {
display: flex;
position: relative;
padding: 5px;
padding-left: 22px;
cursor: pointer;
font-size: 0.8rem;
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
}

.am-checkbox-label input {
position: absolute;
opacity: 0;
cursor: pointer;
height: 0;
width: 0;
}

.am-checkbox-checkmark {
position: absolute;
top: 4px;
left: 2.4px;
height: 10px;
width: 10px;
background-color: #eee;
border: 2px solid #aa9696;
}

.am-checkbox-label:hover input ~ .am-checkbox-checkmark,
.am-checkbox-label:hover input:checked ~ .am-checkbox-checkmark:after,
.am-checkbox-label:hover input:indeterminate ~ .am-checkbox-checkmark:after {
border-color: #857373
}

.am-checkbox-checkmark:after {
content: "";
position: absolute;
display: none;
}

.am-checkbox-label input:checked ~ .am-checkbox-checkmark:after {
display: block;
left: 3.5px;
top: 1px;
width: 2px;
height: 4px;
border: solid #787878;
border-width: 0 2px 2px 0;
-webkit-transform: rotate(45deg);
-ms-transform: rotate(45deg);
transform: rotate(45deg);
}

.am-checkbox-label input:indeterminate ~ .am-checkbox-checkmark:after {
display: block;
left: 2.5px;
top: 2.5px;
width: 5px;
height: 5px;
background-color: #787878;
border-radius: 50%;
}

.am-checkbox-all-container {
width: 100%;
border-bottom: 1px solid #817777;
margin-bottom: 5px;
}

.am-checkbox-all-label {
width: 42.337px;
margin-bottom: 5px;
}
`;
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);

  var visibleStocksStorageKey = 'am-stock-helper-visible-stocks';
  var stocksAmountsStorageKey = 'am-stock-helper-stocks-amounts';
  var isCheckboxContainerCollapsedStorageKey =
    'am-stock-helper-is-checkbox-container-collapsed';
  var isButtonsContainerCollapsedStorageKey =
    'am-stock-helper-is-buttons-container-collapsed';

  var storage = {
    set visibleStocks(value) {
      localStorage.setItem(visibleStocksStorageKey, JSON.stringify(value));
    },
    get visibleStocks() {
      return JSON.parse(localStorage.getItem(visibleStocksStorageKey));
    },
    set stocksAmounts(value) {
      localStorage.setItem(stocksAmountsStorageKey, JSON.stringify(value));
    },
    get stocksAmounts() {
      return JSON.parse(localStorage.getItem(stocksAmountsStorageKey));
    },
    set isCheckboxContainerCollapsed(value) {
      localStorage.setItem(
        isCheckboxContainerCollapsedStorageKey,
        JSON.stringify(value)
      );
    },
    get isCheckboxContainerCollapsed() {
      return JSON.parse(
        localStorage.getItem(isCheckboxContainerCollapsedStorageKey)
      );
    },
    set isButtonsContainerCollapsed(value) {
      localStorage.setItem(
        isButtonsContainerCollapsedStorageKey,
        JSON.stringify(value)
      );
    },
    get isButtonsContainerCollapsed() {
      return JSON.parse(
        localStorage.getItem(isButtonsContainerCollapsedStorageKey)
      );
    }
  };

  var refreshSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" class="am-alert-mark-svg" title="Refresh page"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
  var chevronSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg>';
  var loadingSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="17.93px" height="20.8px" viewBox="15 15 70 70" preserveAspectRatio="xMidYMid" style=""><circle cx="50" cy="50" fill="none" stroke="#7a6c5a" stroke-width="7" r="31" stroke-dasharray="146.08405839192537 50.69468613064179" transform="rotate(338.526 50 50)"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="0.8928571428571428s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>';

  // TODO: Instead of passing callback function as param add on/off methods
  // TODO: Observe opening the stock by mouse and add alert mark
  // TODO: Change button color based on forecast (very poor, poor, average, good, very good)

  var createBoxContainer = function (
    title,
    isCollapsed,
    collapseStateChangeCb
  ) {
    var container = document.createElement('div');
    container.classList.add('m-top10');
    var titleContainer = document.createElement('div');
    titleContainer.classList.add('title-gray', 'top-round', 'am-box-title');
    var titleElem = document.createTextNode(title);
    var chevronElem = document.createElement('span');
    chevronElem.classList.add('am-box-title-chevron');
    chevronElem.innerHTML = chevronSvg;
    chevronElem.addEventListener('click', function () {
      chevronElem.classList.toggle('am-box-title-close-chevron');
      var isCollapsed = chevronElem.classList.contains(
        'am-box-title-close-chevron'
      );
      contentContainer.style.display = isCollapsed ? 'none' : '';
      collapseStateChangeCb(isCollapsed);
    });
    var contentContainer = document.createElement('div');
    contentContainer.classList.add('bottom-round', 'cont-gray', 'p10');
    if (isCollapsed) {
      contentContainer.style.display = 'none';
      chevronElem.classList.add('am-box-title-close-chevron');
    }
    var hr = document.createElement('hr');
    hr.classList.add('page-head-delimiter', 'm-top10');
    titleContainer.appendChild(titleElem);
    titleContainer.appendChild(chevronElem);
    container.appendChild(titleContainer);
    container.appendChild(contentContainer);
    container.appendChild(hr);
    return {
      containerElem: container,
      contentElem: contentContainer
    };
  };
  var createRefreshButton = function () {
    var btn = document.createElement('button');
    btn.onclick = function () {
      location.reload();
    };
    btn.classList.add('am-refresh-btn');
    btn.innerHTML = refreshSvg;
    return btn;
  };
  var createBuySymbol = function () {
    var alertMark = document.createElement('span');
    alertMark.title = 'Buy shares';
    alertMark.innerHTML = '💲';
    alertMark.classList.add('am-buy-symbol');
    return alertMark;
  };
  var createAlertMark = function () {
    var alertMark = document.createElement('span');
    alertMark.innerHTML = '⚠';
    alertMark.classList.add('am-alert-mark');
    return alertMark;
  };
  var createCheckbox = function (label, checkedCb) {
    var labelElem = document.createElement('label');
    labelElem.classList.add('am-checkbox-label');
    var labelText = document.createTextNode(label);
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('click', function (e) {
      checkedCb(checkbox.checked);
    });
    var checkmark = document.createElement('span');
    checkmark.classList.add('am-checkbox-checkmark');
    labelElem.appendChild(labelText);
    labelElem.appendChild(checkbox);
    labelElem.appendChild(checkmark);
    return {
      element: labelElem,
      check: function (isChecked) {
        checkbox.checked = isChecked;
      },
      setIndeterminate: function (value) {
        checkbox.indeterminate = value;
      }
    };
  };
  var createStockHandler = function (
    text,
    amount,
    clickedCb,
    buyClickedCb,
    alertClickedCb,
    amountChangedCb
  ) {
    var btnElem = document.createElement('button');
    btnElem.classList.add('am-button');
    btnElem.innerText = text;
    btnElem.title = 'Click to load stock info (open stock panel)';
    var clickCb = function () {
      clickedCb();
    };
    btnElem.addEventListener('click', clickCb);
    var amountElem = document.createElement('input');
    amountElem.classList.add('am-button-amount-input');
    amountElem.value = amount || '';
    var getAmount = function () {
      return amountElem.value.length
        ? +amountElem.value.replace(/,/g, '')
        : Infinity;
    };
    var amountElemChangeCb = function () {
      var amount = getAmount();
      if (!isNaN(amount)) {
        amountChangedCb(getAmount());
      }
    };
    amountElem.addEventListener('input', amountElemChangeCb);
    var alertMark = createAlertMark();
    alertMark.style.display = 'none';
    var alertClickCb = function () {
      alertClickedCb();
    };
    alertMark.addEventListener('click', alertClickCb);
    var buySymbol = createBuySymbol();
    buySymbol.style.display = 'none';
    var buyClickCb = function () {
      buyClickedCb();
    };
    buySymbol.addEventListener('click', buyClickCb);
    var loadingIcon = (function () {
      var ghost = document.createElement('div');
      ghost.innerHTML = loadingSvg;
      return ghost.firstElementChild;
    })();
    loadingIcon.style.display = 'none';
    var innerContainer = document.createElement('div');
    innerContainer.classList.add('am-button-inner-container');
    var iconsContainer = document.createElement('div');
    iconsContainer.classList.add('am-button-icons-container');
    var elem = document.createElement('div');
    elem.classList.add('am-button-container');
    innerContainer.appendChild(btnElem);
    innerContainer.appendChild(amountElem);
    iconsContainer.appendChild(loadingIcon);
    iconsContainer.appendChild(alertMark);
    iconsContainer.appendChild(buySymbol);
    window.$(amountElem).tornInputMoney();
    elem.appendChild(innerContainer);
    elem.appendChild(iconsContainer);
    return {
      element: elem,
      remove: function () {
        btnElem.removeEventListener('click', clickCb);
        alertMark.removeEventListener('click', alertClickCb);
        buySymbol.removeEventListener('click', buyClickCb);
        amountElem.removeEventListener('input', amountElemChangeCb);
        elem.remove();
      },
      addIsLoading: function () {
        loadingIcon.style.display = '';
      },
      removeIsLoading: function () {
        loadingIcon.style.display = 'none';
      },
      addBuySymbol: function () {
        buySymbol.style.display = '';
      },
      removeBuySymbol: function () {
        buySymbol.style.display = 'none';
      },
      addAlertMark: function (tooltip) {
        alertMark.title = tooltip;
        alertMark.addEventListener('mouseout', function mouseOut() {
          alertMark.title = tooltip;
          alertMark.removeEventListener('mouseout', mouseOut);
        });
        alertMark.style.display = '';
      },
      removeAlertMark: function () {
        alertMark.style.display = 'none';
      },
      changeButtonTooltip: function (tooltip) {
        btnElem.title = tooltip;
        btnElem.addEventListener('mouseout', function mouseOut() {
          btnElem.title = tooltip;
          btnElem.removeEventListener('mouseout', mouseOut);
        });
      },
      get amount() {
        return getAmount();
      }
    };
  };
  var createChecboxBoxContainer = function (
    stockNames,
    fullStockNames,
    visibleStockNames,
    checkedCb
  ) {
    var boxContainer = createBoxContainer(
      'Stock Helper - Visible stocks',
      storage.isCheckboxContainerCollapsed,
      function (isCollapsed) {
        storage.isCheckboxContainerCollapsed = isCollapsed;
      }
    );
    var allElem = document.createElement('div');
    allElem.classList.add('am-checkbox-all-container');
    var visibleStockNamesCopy = [].slice.apply(visibleStockNames);
    var updateAllCheckboxState = function () {
      if (!visibleStockNamesCopy.length) {
        allCheckBox.check(false);
        allCheckBox.setIndeterminate(false);
      } else if (visibleStockNamesCopy.length !== stockNames.length) {
        allCheckBox.check(true);
        allCheckBox.setIndeterminate(true);
      } else {
        allCheckBox.check(true);
        allCheckBox.setIndeterminate(false);
      }
    };
    var allCheckBox = createCheckbox('All', function (isChecked) {
      if (isChecked) {
        stockNames.forEach(function (name) {
          if (!visibleStockNamesCopy.includes(name)) {
            checkboxElemsByName[name].check(isChecked);
            checkedCb(name, isChecked);
          }
        });
        visibleStockNamesCopy = [].slice.apply(stockNames);
      } else {
        visibleStockNamesCopy.forEach(function (name) {
          if (visibleStockNamesCopy.includes(name)) {
            checkboxElemsByName[name].check(isChecked);
            checkedCb(name, isChecked);
          }
        });
        visibleStockNamesCopy = [];
      }
    });
    allCheckBox.element.classList.add('am-checkbox-all-label');
    var checkboxElemsByName = stockNames.reduce(function (accum, name, i) {
      var checkBox = createCheckbox(name, function (isChecked) {
        if (isChecked) {
          visibleStockNamesCopy.push(name);
        } else {
          visibleStockNamesCopy.splice(visibleStockNamesCopy.indexOf(name), 1);
        }
        updateAllCheckboxState();
        checkedCb(name, isChecked);
      });
      checkBox.element.title = fullStockNames[i];
      accum[name] = checkBox;
      return accum;
    }, {});
    var checkboxElems = Object.values(checkboxElemsByName);
    visibleStockNames.forEach(function (name) {
      checkboxElemsByName[name].check(true);
    });
    updateAllCheckboxState();
    allElem.appendChild(allCheckBox.element);
    boxContainer.contentElem.appendChild(allElem);
    var regularCheckboxContainer = document.createElement('div');
    regularCheckboxContainer.classList.add('am-checkbox-box-content');
    checkboxElems.forEach(function (elem) {
      regularCheckboxContainer.appendChild(elem.element);
    });
    boxContainer.contentElem.appendChild(regularCheckboxContainer);
    return boxContainer.containerElem;
  };
  var createButtonsBoxContainer = function (
    visibleStocNames,
    clickedCb,
    buySymbolClickedCb,
    alertClickedCb,
    amountChangedCb
  ) {
    var boxContainer = createBoxContainer(
      'Stock Helper - Quick shares check',
      storage.isButtonsContainerCollapsed,
      function (isCollapsed) {
        storage.isButtonsContainerCollapsed = isCollapsed;
      }
    );
    boxContainer.contentElem.classList.add('am-buttons-box-content');
    var amounts = storage.stocksAmounts || {};
    var stockHandlersByNameByName = visibleStocNames.reduce(function (
      accum,
      name
    ) {
      var stockHandler = createStockHandler(
        name,
        amounts[name],
        function () {
          clickedCb(name, amounts[name], stockHandler);
        },
        function () {
          buySymbolClickedCb(name);
        },
        function () {
          alertClickedCb(name);
        },
        function (amount) {
          amountChangedCb(name, amount, stockHandler);
          amounts[name] = amount;
          storage.stocksAmounts = amounts;
        }
      );
      boxContainer.contentElem.appendChild(stockHandler.element);
      accum[name] = stockHandler;
      return accum;
    },
    {});
    var refreshBtn = createRefreshButton();
    boxContainer.contentElem.appendChild(refreshBtn);
    return {
      containerElem: boxContainer.containerElem,
      removeButton: function (name) {
        var stockHandler = stockHandlersByNameByName[name];
        stockHandler.remove();
        delete stockHandlersByNameByName[name];
        storage.visibleStocks = Object.keys(stockHandlersByNameByName);
        delete amounts[name];
        storage.stocksAmounts = amounts;
      },
      addButton: function (name) {
        var stockHandler = createStockHandler(
          name,
          null,
          function () {
            clickedCb(name, amounts[name], stockHandler);
          },
          function () {
            buySymbolClickedCb(name);
          },
          function () {
            alertClickedCb(name);
          },
          function (amount) {
            amountChangedCb(name, amount, stockHandler);
            amounts[name] = amount;
            storage.stocksAmounts = amounts;
          }
        );
        boxContainer.contentElem.insertBefore(stockHandler.element, refreshBtn);
        stockHandlersByNameByName[name] = stockHandler;
        storage.visibleStocks = Object.keys(stockHandlersByNameByName);
      }
    };
  };
  var createStockElemWrapper = function (stockElem) {
    var nameElem = stockElem.querySelector('.abbr-name');
    var fullnameElem = stockElem.querySelector('.name');
    var tabWrapElem = stockElem.querySelector('.tabs-wrap');
    var getSharesForSaleElem = function () {
      return stockElem.querySelector('.t-overflow:last-child');
    };
    var getPricePerShareElem = function () {
      return stockElem.querySelector('.t-overflow:nth-child(5)');
    };
    var getIsActive = function () {
      return !!stockElem.querySelector('.ui-accordion-content-active');
    };
    var getIsRendered = function () {
      return !!getSharesForSaleElem();
    };

    return {
      get name() {
        return nameElem.innerText;
      },
      get fullName() {
        return fullnameElem.innerText;
      },
      hide: function () {
        stockElem.style.display = 'none';
      },
      show: function () {
        stockElem.style.display = '';
      },
      get isOpen() {
        return getIsRendered() && getIsActive();
      },
      get isRendered() {
        return getIsRendered();
      },
      open: function (openedCb) {
        if (getIsRendered()) {
          if (getIsActive()) {
            openedCb();
          } else {
            stockElem.firstElementChild.click();
            openedCb();
          }
        } else {
          var callback = function () {
            if (getIsRendered()) {
              observer.disconnect();
              openedCb();
            }
          };
          var observer = new MutationObserver(callback);
          observer.observe(tabWrapElem, { childList: true });
          stockElem.firstElementChild.click();
        }
      },
      close: function () {
        if (getIsActive()) {
          stockElem.firstElementChild.click();
        }
      },
      get sharesForSale() {
        if (!getIsRendered()) {
          return;
        }

        var sharesForSaleElem = getSharesForSaleElem();
        return +sharesForSaleElem.lastChild.textContent
          .trim()
          .replace(/,/g, '');
      },
      get pricePerShare() {
        if (!getIsRendered()) {
          return;
        }

        var pricePerShareElem = getPricePerShareElem();
        return +pricePerShareElem.lastChild.textContent
          .trim()
          .replace(/,/g, '')
          .replace(/\$/g, '');
      },
      scrollAndEnterBuyMode: function () {
        if (!getIsRendered()) {
          return;
        }

        var buyBtn = stockElem.querySelector('.buy-stock').firstElementChild;
        if (!getIsActive()) {
          stockElem.firstElementChild.click();
        }
        buyBtn.scrollIntoView();
        buyBtn.click();
      }
    };
  };
  var stockHelper = function (wrapper) {
    var stocksListElem = wrapper.querySelector('.stock-list');
    var allStockElems = [].slice.apply(stocksListElem.children);
    var allStockElemWrappers = allStockElems.map(createStockElemWrapper);
    var allStockElemWrappersByName = allStockElemWrappers.reduce(function (
      accum,
      stockWrapper
    ) {
      accum[stockWrapper.name] = stockWrapper;
      return accum;
    },
    {});
    var allStocksNames = Object.keys(allStockElemWrappersByName);
    var fullStockNames = allStockElemWrappers.map(function (wrapper) {
      return wrapper.fullName;
    });
    var stocksNamesToShow = storage.visibleStocks || allStocksNames;

    allStockElemWrappers.forEach(function (elemWrapper) {
      if (!stocksNamesToShow.includes(elemWrapper.name)) {
        elemWrapper.hide();
      }
    });

    var alertTooltip = function (stockElemWrapper, amount) {
      return (
        stockElemWrapper.sharesForSale.toLocaleString() +
        ' shares available for ' +
        stockElemWrapper.pricePerShare.toLocaleString() +
        '$ (more than ' +
        amount.toLocaleString() +
        '$), click to buy anyway'
      );
    };
    var buttonsBoxContainer = createButtonsBoxContainer(
      stocksNamesToShow,
      function (name, amount, stockHandler) {
        var stockElemWrapper = allStockElemWrappersByName[name];
        if (stockElemWrapper.isOpen) {
          stockElemWrapper.close();
        } else {
          stockHandler.addIsLoading();
          stockElemWrapper.open(function () {
            stockHandler.removeIsLoading();
            debugger;
            stockHandler.changeButtonTooltip(
              stockElemWrapper.sharesForSale.toLocaleString() +
                ' shares available for ' +
                stockElemWrapper.pricePerShare.toLocaleString() +
                '$'
            );
            if (stockElemWrapper.sharesForSale > 0) {
              if (stockElemWrapper.pricePerShare <= stockHandler.amount) {
                stockHandler.addBuySymbol();
              } else {
                stockHandler.addAlertMark(
                  alertTooltip(stockElemWrapper, amount)
                );
              }
            }
          });
        }
      },
      function (name) {
        var stockElemWrapper = allStockElemWrappersByName[name];
        stockElemWrapper.scrollAndEnterBuyMode();
      },
      function (name) {
        var stockElemWrapper = allStockElemWrappersByName[name];
        stockElemWrapper.scrollAndEnterBuyMode();
      },
      function (name, amount, stockHandler) {
        var stockElemWrapper = allStockElemWrappersByName[name];
        if (stockElemWrapper.isRendered) {
          if (stockElemWrapper.sharesForSale > 0) {
            if (stockElemWrapper.pricePerShare <= stockHandler.amount) {
              stockHandler.removeAlertMark();
              stockHandler.addBuySymbol();
            } else {
              stockHandler.addAlertMark(alertTooltip(stockElemWrapper, amount));
              stockHandler.removeBuySymbol();
            }
          } else {
            stockHandler.removeAlertMark();
            stockHandler.removeBuySymbol();
          }
        }
      }
    );
    var checkboxBoxConatiner = createChecboxBoxContainer(
      allStocksNames,
      fullStockNames,
      stocksNamesToShow,
      function (name, isChcked) {
        var stockElemWrapper = allStockElemWrappersByName[name];
        if (isChcked) {
          buttonsBoxContainer.addButton(name);
          stockElemWrapper.show();
        } else {
          buttonsBoxContainer.removeButton(name);
          stockElemWrapper.close();
          stockElemWrapper.hide();
        }
      }
    );

    wrapper.insertBefore(
      buttonsBoxContainer.containerElem,
      wrapper.children[2]
    );
    wrapper.insertBefore(checkboxBoxConatiner, wrapper.children[2]);
  };

  var computerFrame = document.querySelector('.computer-frame-wrap');

  if (!!computerFrame) {
    var laptopWrapper = computerFrame.querySelector('.content-wrapper');
    var didLoadStockHelper = false;
    var callback = function () {
      var stocksWrapper = computerFrame.querySelector('.stock-main-wrap');
      if (stocksWrapper && !didLoadStockHelper) {
        stockHelper(laptopWrapper);
        didLoadStockHelper = true;
      } else {
        didLoadStockHelper = false;
      }
    };
    var observer = new MutationObserver(callback);
    observer.observe(laptopWrapper, { childList: true });
  } else {
    var regularWrapper = document.querySelector('.content-wrapper');
    stockHelper(regularWrapper);
  }
})();
