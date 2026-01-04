'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* 本檔由 mergeFile.js 自動產生, 欲修改code請至src資料夾 */
//start file: main
// ==UserScript==
// @name         ACGN-stock營利統計外掛
// @namespace    http://tampermonkey.net/
// @version      5.19.00
// @description  隱藏著排他力量的分紅啊，請在我面前顯示你真正的面貌，與你締結契約的VIP命令你，封印解除！
// @author       SoftwareSing
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @match        https://test.acgn-stock.com/*
// @match        https://museum.acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33542/ACGN-stock%E7%87%9F%E5%88%A9%E7%B5%B1%E8%A8%88%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/33542/ACGN-stock%E7%87%9F%E5%88%A9%E7%B5%B1%E8%A8%88%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==

//版本號為'主要版本號 + '.' + 次要版本號 + 錯誤修正版本號，ex 8.31.39
//修復導致功能失效的錯誤或更新重大功能提升主要或次要版本號
//優化UI，優化效能，優化小錯誤更新錯誤版本號


//-start file: Language/language
/*************************************/
/**************Language***************/

/**
 * 語言翻譯
 * @param {Array} target 目標語句
 * @return {String} 回傳語句
 */
function translation(target) {
  var language = 'tw';

  return dict[language][target[0]][target[1]];
}

var dict = {
  tw: {
    script: {
      name: 'SoftwareScript',
      updateScript: '更新外掛',
      vip: '外掛VIP',
      about: '關於',
      disconnectReminder: '斷線提醒器',
      trunOnDisconnectReminder: '啟用 斷線提醒器',
      trunOffDisconnectReminder: '關閉 斷線提醒器',
      trunOnDisconnectReminderInfo: '您啟用了 斷線提醒器，將在重新載入網頁後生效',
      trunOffDisconnectReminderInfo: '您關閉了 斷線提醒器，將在重新載入網頁後生效',
      showMostStockholdingCompany: '列出最多持股公司',

      bigLog: '大量紀錄',

      disconnectWarningInfo: function disconnectWarningInfo(dbName, count, stopTime) {
        dbName = dbName || '某個資料';
        count = count || '多';
        stopTime = stopTime || '數';

        return '\u60A8\u5DF2\u8A2A\u554F ' + dbName + ' \u9054 ' + count + ' \u6B21\uFF01\u5EFA\u8B70\u4F11\u606F ' + stopTime + ' \u79D2\u518D\u7E7C\u7E8C\uFF0C\u4EE5\u514D\u88AB\u4F3A\u670D\u5668\u5F37\u5236\u65B7\u7DDA';
      }
    },
    companyList: {
      stockAsset: '持有總值',
      estimatedProfit: '預估分紅',
      estimatedManagerProfit: '預估經理分紅',
      peRatio: '帳面本益比',
      peRatioVip: '排他本益比',
      peRatioUser: '我的本益比'
    },
    accountInfo: {
      estimatedStockTax: '預估股票稅金：',
      estimatedMoneyTax: '預估現金稅金：',
      holdingStockCompaniesNumber: '持股公司總數：',
      stocksAsset: '股票總值：',
      usedInSellOrdersStocksAsset: '賣單股票總值：',
      usedInBuyOrdersMoney: '買單現金總值：',
      estimatedStockProfit: '預估股票分紅：',
      estimatedManagerProfit: '預估經理分紅：',
      estimatedEmployeeBonus: '預估員工分紅：',
      estimatedProductVotingRewards: '預估推薦票獎勵：',

      holdStocksTable: '持股資訊總表',
      holdStocks: '持有股數',
      holdPercentage: '持有比例',
      stockAsset: '股票總值',
      estimatedProfit: '預估分紅',
      vipLevel: 'VIP等級',
      notFoundCompany: 'not found company'
    },
    company: {
      companyId: '公司ID',
      name: '公司名稱',
      chairman: '董事長',
      manager: '經理人',

      grade: '公司評級',
      capital: '資本額',
      price: '股價',
      release: '釋股數',
      profit: '營收',

      vipBonusStocks: 'VIP加成股票數',
      managerBonusRatePercent: '經理分紅百分比',
      capitalIncreaseRatePercent: '資本額注入百分比',

      salary: '員工日薪',
      nextSeasonSalary: '下季員工日薪',
      employeeBonusRatePercent: '員工分紅百分比',
      employeesNumber: '員工數量',
      nextSeasonEmployeesNumber: '下季員工數量',

      tags: '標籤',
      createdAt: '創立時間'
    }
  },
  en: {
    script: {
      name: 'SoftwareScript',
      updateScript: 'update Script',
      vip: 'script VIP',
      about: 'about',
      disconnectReminder: 'DisconnectReminder',
      trunOnDisconnectReminder: 'trun on DisconnectReminder',
      trunOffDisconnectReminder: 'trun off DisconnectReminder',
      trunOnDisconnectReminderInfo: 'You turned on the DisconnectReminder, it will take effect after reloading the page',
      trunOffDisconnectReminderInfo: 'You turned off the DisconnectReminder, it will take effect after reloading the page',
      showMostStockholdingCompany: 'show most stocks company',

      bigLog: 'Big log',

      disconnectWarningInfo: function disconnectWarningInfo(dbName, count, stopTime) {
        dbName = dbName || 'some data';
        count = count || 'many';
        stopTime = stopTime || 'few';

        return 'You have accessed ' + dbName + ' up to ' + count + ' times! Recommended rest ' + stopTime + ' seconds before continuing.';
      }
    },
    companyList: {
      stockAsset: 'Stock asset',
      estimatedProfit: 'Estimated profit',
      estimatedManagerProfit: 'Estimated manager profit',
      peRatio: 'fake P/E Ratio',
      peRatioVip: 'truly P/E Ratio',
      peRatioUser: 'my P/E Ratio'
    },
    accountInfo: {
      estimatedStockTax: 'Estimated stock tax：',
      estimatedMoneyTax: 'Estimated money tax：',
      holdingStockCompaniesNumber: 'Holding stock companies number：',
      stocksAsset: 'Stocks asset：',
      usedInSellOrdersStocksAsset: 'Used in sell orders stocks asset：',
      usedInBuyOrdersMoney: 'Used in buy orders money：',
      estimatedStockProfit: 'Estimated stock profit：',
      estimatedManagerProfit: 'Estimated manager profit：',
      estimatedEmployeeBonus: 'Estimated employee profit：',
      estimatedProductVotingRewards: 'Estimated Product Voting Rewards：',

      holdStocksTable: 'Hold stocks info table',
      holdStocks: 'Hold stock number',
      holdPercentage: 'Hold percentage',
      stockAsset: 'Stock asset',
      estimatedProfit: 'Estimated profit',
      vipLevel: 'VIP level',
      notFoundCompany: 'not found company'
    },
    company: {
      companyId: 'company\'s ID',
      name: 'name',
      chairman: 'chairman',
      manager: 'manager',

      grade: 'grade',
      capital: 'capital',
      price: 'price',
      release: 'release',
      profit: 'profit',

      vipBonusStocks: 'Vip bonus stocks',
      managerBonusRatePercent: 'Manager bonus rate percent',
      capitalIncreaseRatePercent: 'Capital increase rate percent',

      salary: 'Employees daily salary',
      nextSeasonSalary: 'Employees daily salary for next season',
      employeeBonusRatePercent: 'Employee bonus rate percent',
      employeesNumber: 'Employees number',
      nextSeasonEmployeesNumber: 'Employees number for next season',

      tags: 'tags',
      createdAt: 'Created time'
    }
  }
};

/**************Language***************/
/*************************************/

//-end file: Language/language
//
//-start file: Global/MainController
//--start file: User/LoginUser
//---start file: User/User
//----start file: require
/*************************************/
/***************import****************/

var _require = require('./db/dbSeason'),
    getCurrentSeason = _require.getCurrentSeason,
    getInitialVoteTicketCount = _require.getInitialVoteTicketCount;

var _require2 = require('./client/layout/alertDialog.js'),
    alertDialog = _require2.alertDialog;

var _require3 = require('./client/company/helpers.js'),
    getCurrentUserOwnedStockAmount = _require3.getCurrentUserOwnedStockAmount;

var _require4 = require('./common/imports/utils/formatTimeUtils.js'),
    formatDateTimeText = _require4.formatDateTimeText;

var _require5 = require('./db/dbCompanies.js'),
    dbCompanies = _require5.dbCompanies;

var _require6 = require('./db/dbEmployees.js'),
    dbEmployees = _require6.dbEmployees;

var _require7 = require('./db/dbVips.js'),
    dbVips = _require7.dbVips;

var _require8 = require('./db/dbDirectors.js'),
    dbDirectors = _require8.dbDirectors;

var _require9 = require('./db/dbOrders.js'),
    dbOrders = _require9.dbOrders;

var _require10 = require('./db/dbUserOwnedProducts.js'),
    dbUserOwnedProducts = _require10.dbUserOwnedProducts;

var _require11 = require('./db/dbLog.js'),
    dbLog = _require11.dbLog;

/***************import****************/
/*************************************/

//----end file: require
//
//----start file: functions/debugConsole
/*************************************/
/**************DebugMode**************/

var debugMode = false;
//debugMode == true 的時候，會console更多資訊供debug

function debugConsole(msg) {
  if (debugMode) {
    console.log(msg);
  }
}

/**************DebugMode**************/
/*************************************/

//----end file: functions/debugConsole
//
//----start file: functions/getLocalCompanies
/**
 * 獲取在localStorage中的localCompanies
 * @return {Array} localCompanies
 */
function getLocalCompanies() {
  var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];

  return localCompanies;
}

//----end file: functions/getLocalCompanies
//
//----start file: functions/earnPerShare
/**
 * 計算每股盈餘(包含VIP排他)
 * @param {Company} company 公司物件
 * @return {Number} 每股盈餘
 */
function earnPerShare(company) {
  var stocksProfitPercent = 1 - company.managerBonusRatePercent / 100 - company.capitalIncreaseRatePercent / 100 - Meteor.settings.public.companyProfitDistribution.incomeTaxRatePercent / 100;
  if (company.employeesNumber > 0) {
    stocksProfitPercent -= company.employeeBonusRatePercent / 100;
    stocksProfitPercent -= Meteor.settings.public.companyProfitDistribution.employeeProductVotingRewardRatePercent / 100;
  }

  return company.profit * stocksProfitPercent / (company.release + company.vipBonusStocks);
}

//----end file: functions/earnPerShare
//
//----start file: functions/effectiveStocks
/**
 * 依照股票與vipLV計算有效分紅股票
 * @param {Number} stock 股票數
 * @param {Number} vipLevel vip等級
 * @return {Number} 有效的股票數
 */
function effectiveStocks(stock, vipLevel) {
  var vipBonusFactor = Meteor.settings.public.vipParameters[vipLevel || 0].stockBonusFactor;


  return stock * vipBonusFactor;
}

//----end file: functions/effectiveStocks
//
//----start file: functions/computeTax
var taxConfigList = [{
  from: 10000,
  to: 100000,
  ratio: 3,
  balance: 300
}, {
  from: 100000,
  to: 500000,
  ratio: 6,
  balance: 3300
}, {
  from: 500000,
  to: 1000000,
  ratio: 9,
  balance: 18300
}, {
  from: 1000000,
  to: 2000000,
  ratio: 12,
  balance: 48300
}, {
  from: 2000000,
  to: 3000000,
  ratio: 15,
  balance: 108300
}, {
  from: 3000000,
  to: 4000000,
  ratio: 18,
  balance: 198300
}, {
  from: 4000000,
  to: 5000000,
  ratio: 21,
  balance: 318300
}, {
  from: 5000000,
  to: 6000000,
  ratio: 24,
  balance: 468300
}, {
  from: 6000000,
  to: 7000000,
  ratio: 27,
  balance: 648300
}, {
  from: 7000000,
  to: 8000000,
  ratio: 30,
  balance: 858300
}, {
  from: 8000000,
  to: 9000000,
  ratio: 33,
  balance: 1098300
}, {
  from: 9000000,
  to: 10000000,
  ratio: 36,
  balance: 1368300
}, {
  from: 10000000,
  to: 11000000,
  ratio: 39,
  balance: 1668300
}, {
  from: 11000000,
  to: 12000000,
  ratio: 42,
  balance: 1998300
}, {
  from: 12000000,
  to: 13000000,
  ratio: 45,
  balance: 2358300
}, {
  from: 13000000,
  to: 14000000,
  ratio: 48,
  balance: 2748300
}, {
  from: 14000000,
  to: 15000000,
  ratio: 51,
  balance: 3168300
}, {
  from: 15000000,
  to: 16000000,
  ratio: 54,
  balance: 3618300
}, {
  from: 16000000,
  to: 17000000,
  ratio: 57,
  balance: 4098300
}, {
  from: 17000000,
  to: Infinity,
  ratio: 60,
  balance: 4608300
}];

function computeTax(money) {
  var matchTaxConfig = taxConfigList.find(function (taxConfig) {
    return money >= taxConfig.from && money < taxConfig.to;
  });
  if (matchTaxConfig) {
    return Math.ceil(money * matchTaxConfig.ratio / 100) - matchTaxConfig.balance;
  } else {
    return 0;
  }
}

//----end file: functions/computeTax
//

/**
 * 用於存放AccountInfo頁面中的user資訊
 */

var User = function () {
  /**
   * 建構 User
   * @param {String} id userId
   */
  function User(id) {
    _classCallCheck(this, User);

    console.log('create user: ' + id);
    this.userId = id;
    this.name = '';
    this.holdStocks = [];
    this.managers = [];
    this.employee = '';
    this.money = 0;
    this.ticket = 0;

    var load = this.loadFromSessionstorage();
    if (!load) {
      this.saveToSessionstorage();
    }
    console.log('');
  }

  _createClass(User, [{
    key: 'saveToSessionstorage',
    value: function saveToSessionstorage() {
      var _this = this;

      console.log('---start saveToSessionstorage()');

      var sessionUsers = JSON.parse(window.sessionStorage.getItem('sessionUsers')) || [];
      var i = sessionUsers.findIndex(function (x) {
        return x.userId === _this.userId;
      });
      if (i !== -1) {
        //將session裡的資料更新
        sessionUsers[i] = {
          userId: this.userId,
          holdStocks: this.holdStocks,
          managers: this.managers,
          employee: this.employee,
          money: this.money,
          ticket: this.ticket
        };
      } else {
        //之前session裡沒有user資料，將資料丟入
        sessionUsers.push({
          userId: this.userId,
          holdStocks: this.holdStocks,
          managers: this.managers,
          employee: this.employee,
          money: this.money,
          ticket: this.ticket
        });
      }

      window.sessionStorage.setItem('sessionUsers', JSON.stringify(sessionUsers));

      console.log('---end saveToSessionstorage()');
    }
  }, {
    key: 'loadFromSessionstorage',
    value: function loadFromSessionstorage() {
      var _this2 = this;

      console.log('---start loadFromSessionstorage()');

      var sessionUsers = JSON.parse(window.sessionStorage.getItem('sessionUsers')) || [];
      var sUser = sessionUsers.find(function (x) {
        return x.userId === _this2.userId;
      });
      if (sUser !== undefined) {
        this.holdStocks = sUser.holdStocks;
        this.managers = sUser.managers;
        this.employee = sUser.employee;
        this.money = sUser.money;
        this.ticket = sUser.ticket;

        console.log('---end loadFromSessionstorage(): true');

        return true;
      } else {
        console.log('-----loadFromSessionstorage(): not found user: ' + this.userId);
        console.log('-----if is not in creating user, it may be a BUG');
        console.log('---end loadFromSessionstorage(): false');

        return false;
      }
    }
  }, {
    key: 'updateHoldStocks',
    value: function updateHoldStocks() {
      var _this3 = this;

      console.log('---start updateHoldStocks()');

      this.loadFromSessionstorage();

      var serverDirectors = dbDirectors.find({ userId: this.userId }).fetch();
      var isChange = false;

      var _loop = function _loop(c) {
        var i = _this3.holdStocks.findIndex(function (x) {
          return x.companyId === c.companyId;
        });
        if (i !== -1) {
          if (_this3.holdStocks[i].stocks !== c.stocks) {
            isChange = true;
            _this3.holdStocks[i].stocks = c.stocks;
          }
        } else {
          isChange = true;
          _this3.holdStocks.push({ companyId: c.companyId, stocks: c.stocks, vip: null });
        }
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = serverDirectors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var c = _step.value;

          _loop(c);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (isChange) {
        this.saveToSessionstorage();
      }

      console.log('---end updateHoldStocks()');
    }
  }, {
    key: 'updateVips',
    value: function updateVips() {
      var _this4 = this;

      console.log('---start updateVips()');

      this.loadFromSessionstorage();

      var isChange = false;
      var serverVips = dbVips.find({ userId: this.userId }).fetch();

      var _loop2 = function _loop2(serverVip) {
        var i = _this4.holdStocks.findIndex(function (x) {
          return x.companyId === serverVip.companyId;
        });
        if (i !== -1) {
          if (_this4.holdStocks[i].vip !== serverVip.level) {
            isChange = true;
            _this4.holdStocks[i].vip = serverVip.level;
          }
        } else {
          isChange = true;
          _this4.holdStocks.push({ companyId: serverVip.companyId, stocks: 0, vip: serverVip.level });
        }
      };

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = serverVips[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var serverVip = _step2.value;

          _loop2(serverVip);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      if (isChange) {
        this.saveToSessionstorage();
      }

      console.log('---end updateVips()');
    }
  }, {
    key: 'updateManagers',
    value: function updateManagers() {
      var _this5 = this;

      console.log('---start updateManagers()');

      this.loadFromSessionstorage();

      var serverCompanies = dbCompanies.find({ manager: this.userId }).fetch();
      var isChange = false;

      var _loop3 = function _loop3(c) {
        if (_this5.managers.find(function (x) {
          return x.companyId === c._id;
        }) === undefined) {
          isChange = true;
          _this5.managers.push({ companyId: c._id });
        }
      };

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = serverCompanies[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var c = _step3.value;

          _loop3(c);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      if (isChange) {
        this.saveToSessionstorage();
      }

      console.log('---end updateManagers()');
    }
  }, {
    key: 'updateEmployee',
    value: function updateEmployee() {
      console.log('---start updateEmployee()');

      this.loadFromSessionstorage();

      var serverEmployees = dbEmployees.find({ userId: this.userId }).fetch();
      var isChange = false;
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = serverEmployees[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var emp = _step4.value;

          if (emp.employed) {
            if (this.employee !== emp.companyId) {
              isChange = true;
              this.employee = emp.companyId;
            }
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      if (isChange) {
        this.saveToSessionstorage();
      }

      console.log('---end updateEmployee()');
    }
  }, {
    key: 'updateUser',
    value: function updateUser() {
      var _this6 = this;

      console.log('---start updateUser()');

      this.loadFromSessionstorage();

      var isChange = false;
      var serverUsers = Meteor.users.find({ _id: this.userId }).fetch();
      var serverUser = serverUsers.find(function (x) {
        return x._id === _this6.userId;
      });
      debugConsole(serverUser);
      if (serverUser !== undefined) {
        if (this.name !== serverUser.username || this.money !== serverUser.profile.money || this.ticket !== serverUser.profile.voteTickets) {
          isChange = true;
          this.name = serverUser.username;
          this.money = serverUser.profile.money;
          this.ticket = serverUser.profile.voteTickets;
        }
      } else {
        console.log('-----serverUser === undefined');
        debugConsole(serverUsers);
      }

      debugConsole('-----isChange: ' + isChange);
      if (isChange) {
        this.saveToSessionstorage();
      }
      debugConsole(this);

      console.log('---end updateUser()');
    }
  }, {
    key: 'computeCompanyNumber',
    value: function computeCompanyNumber() {
      console.log('---start computeCompanyNumber()');

      var number = 0;
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = this.holdStocks[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var c = _step5.value;

          if (c.stocks > 0) {
            number += 1;
          }
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      console.log('---end computeCompanyNumber(): ' + number);

      return number;
    }
  }, {
    key: 'computeAsset',
    value: function computeAsset() {
      console.log('---start computeAsset()');

      var asset = 0;
      var localCompanies = getLocalCompanies();

      var _loop4 = function _loop4(c) {
        var companyData = localCompanies.find(function (x) {
          return x.companyId === c.companyId;
        });
        if (companyData !== undefined) {
          asset += Number(companyData.price * c.stocks);
        } else {
          console.log('-----computeAsset(): not find companyId: ' + c.companyId);
        }
      };

      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this.holdStocks[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var c = _step6.value;

          _loop4(c);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6.return) {
            _iterator6.return();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      console.log('---end computeAsset(): ' + asset);

      return asset;
    }
  }, {
    key: 'computeProfit',
    value: function computeProfit() {
      console.log('---start computeProfit()');

      var profit = 0;
      var localCompanies = getLocalCompanies();

      var _loop5 = function _loop5(c) {
        var companyData = localCompanies.find(function (x) {
          return x.companyId === c.companyId;
        });
        if (companyData !== undefined) {
          profit += Math.ceil(earnPerShare(companyData) * effectiveStocks(c.stocks, c.vip));
        } else {
          console.log('-----computeProfit(): not find companyId: ' + c.companyId);
        }
      };

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = this.holdStocks[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var c = _step7.value;

          _loop5(c);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }

      console.log('---end computeProfit(): ' + profit);

      return profit;
    }
  }, {
    key: 'computeManagersProfit',
    value: function computeManagersProfit() {
      console.log('---start computeManagersProfit()');

      var managerProfit = 0;
      var localCompanies = getLocalCompanies();

      var _loop6 = function _loop6(c) {
        var companyData = localCompanies.find(function (x) {
          return x.companyId === c.companyId;
        });
        if (companyData !== undefined) {
          managerProfit += Math.ceil(companyData.profit * (companyData.managerBonusRatePercent / 100));
        } else {
          console.log('-----computeManagersProfit(): not find companyId: ' + c.companyId);
        }
      };

      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = this.managers[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var c = _step8.value;

          _loop6(c);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8.return) {
            _iterator8.return();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      console.log('---end computeManagersProfit(): ' + managerProfit);

      return managerProfit;
    }
  }, {
    key: 'computeEmployeeBonus',
    value: function computeEmployeeBonus() {
      var _this7 = this;

      console.log('---start computeEmployeeBonus()');

      var bonus = 0;
      if (this.employee !== '') {
        var localCompanies = getLocalCompanies();
        var _companyData = localCompanies.find(function (x) {
          return x.companyId === _this7.employee;
        });
        if (_companyData !== undefined) {
          if (_companyData.employeesNumber !== 0) {
            var totalBonus = _companyData.profit * (_companyData.employeeBonusRatePercent / 100);
            bonus = Math.floor(totalBonus / _companyData.employeesNumber);
          }
        }
      }

      console.log('---end computeEmployeeBonus(): ' + bonus);

      return bonus;
    }
  }, {
    key: 'computeProductVotingRewards',
    value: function computeProductVotingRewards() {
      var _this8 = this;

      console.log('---start computeProductVotingRewards()');

      var reward = 0;

      //計算系統推薦票回饋
      var systemProductVotingReward = Meteor.settings.public.systemProductVotingReward;

      var totalReward = systemProductVotingReward;
      var initialVoteTicketCount = getInitialVoteTicketCount(getCurrentSeason());
      if (initialVoteTicketCount < 1) {
        //當本季無推薦票可投時無獎勵
        return 0;
      }
      var count = initialVoteTicketCount - this.ticket || 0;
      reward += count >= initialVoteTicketCount ? totalReward : Math.ceil(totalReward * count / 100);

      //計算公司推薦票回饋
      if (this.employee !== '') {
        var employeeProductVotingRewardRatePercent = Meteor.settings.public.companyProfitDistribution.employeeProductVotingRewardRatePercent;

        var localCompanies = getLocalCompanies();
        var _companyData2 = localCompanies.find(function (x) {
          return x.companyId === _this8.employee;
        });
        debugConsole(_companyData2);
        if (_companyData2 !== undefined) {
          if (_companyData2.employeesNumber !== 0) {
            var baseReward = employeeProductVotingRewardRatePercent / 100 * _companyData2.profit;
            //因為沒辦法得知全部員工投票數，以其他所有員工都有投完票來計算
            var totalEmployeeVoteTickets = initialVoteTicketCount * (_companyData2.employeesNumber - 1) + count;
            reward += Math.ceil(baseReward * count / totalEmployeeVoteTickets) || 0;
          } else {
            console.log('-----companyData.employeesNumber === 0');
          }
        } else {
          console.log('-----companyData === undefined');
        }
      }

      console.log('---end computeProductVotingRewards(): ' + reward);

      return reward;
    }
  }, {
    key: 'computeStockTax',
    value: function computeStockTax() {
      var stockTax = computeTax(this.computeTotalStockWealth());
      console.log('---computeStockTax(): ' + stockTax);

      return stockTax;
    }
  }, {
    key: 'computeTotalStockWealth',
    value: function computeTotalStockWealth() {
      var totalStockWealth = this.computeAsset();
      console.log('---computeTotalStockWealth(): ' + totalStockWealth);

      return totalStockWealth;
    }
  }, {
    key: 'computeMoneyTax',
    value: function computeMoneyTax() {
      var moneyTaxMagnification = 1.3;
      var moneyTax = computeTax(this.computeTotalMoney() * moneyTaxMagnification);
      console.log('---computeMoneyTax(): ' + moneyTax);

      return moneyTax;
    }
  }, {
    key: 'computeTotalMoney',
    value: function computeTotalMoney() {
      var totalMoney = this.money + this.computeProfit() + this.computeManagersProfit() + this.computeEmployeeBonus() + this.computeProductVotingRewards();
      console.log('---computeTotalMoney(): ' + totalMoney);

      return totalMoney;
    }
  }, {
    key: 'computeTotalTax',
    value: function computeTotalTax() {
      console.log('---start computeTax()');
      var tax = this.computeMoneyTax() + this.computeStockTax();
      console.log('---end computeTax(): ' + tax);

      return tax;
    }

    /**
     * 依照持股比例排序持有公司並輸出
     * @return {Array} 列表
     */

  }, {
    key: 'findMostStockholdingCompany',
    value: function findMostStockholdingCompany() {
      var localCompanies = getLocalCompanies();
      this.loadFromSessionstorage();
      var holdStocks = JSON.parse(JSON.stringify(this.holdStocks));
      holdStocks.sort(function (a, b) {
        var companyA = localCompanies.find(function (x) {
          return x.companyId === a.companyId;
        });
        var companyB = localCompanies.find(function (x) {
          return x.companyId === a.companyId;
        });
        if (companyA === undefined && companyB === undefined) {
          return 0;
        } else if (companyA === undefined) {
          return 1;
        } else if (companyB === undefined) {
          return -1;
        } else {
          return b.stocks / companyB.release - a.stocks / companyA.release;
        }
      });

      return holdStocks;
    }
  }]);

  return User;
}();

//---end file: User/User
//
//---start file: User/ScriptVip

var ScriptVip = function () {
  /**
   * ScriptVip constructor
   * @param {LoginUser} user LoginUser
   */
  function ScriptVip(user) {
    _classCallCheck(this, ScriptVip);

    this.user = user;
    this.products = [];

    var load = this.loadFromLocalstorage();
    if (!load) {
      this.updateToLocalstorage();
    }
  }

  _createClass(ScriptVip, [{
    key: 'updateToLocalstorage',
    value: function updateToLocalstorage() {
      var _this9 = this;

      var localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
      var i = localScriptVipProducts.findIndex(function (x) {
        return x.userId === _this9.user.userId;
      });
      if (i !== -1) {
        localScriptVipProducts[i].products = this.products;
      } else {
        localScriptVipProducts.push({
          userId: this.user.userId,
          products: this.products
        });
      }
      window.localStorage.setItem('localScriptVipProducts', JSON.stringify(localScriptVipProducts));
    }
  }, {
    key: 'loadFromLocalstorage',
    value: function loadFromLocalstorage() {
      var _this10 = this;

      var localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
      var data = localScriptVipProducts.find(function (x) {
        return x.userId === _this10.user.userId;
      });
      if (data !== undefined) {
        this.products = data.products;

        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'vipLevel',
    value: function vipLevel() {
      var point = 0;
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = this.products[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var product = _step9.value;

          point += product.point * product.amount;
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9.return) {
            _iterator9.return();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      var vipLevelTable = [{ level: 0, point: 390 }, { level: 1, point: Infinity }];

      var _vipLevelTable$find = vipLevelTable.find(function (v) {
        return point < v.point;
      }),
          level = _vipLevelTable$find.level;

      return level;
    }
  }, {
    key: 'updateProducts',
    value: function updateProducts() {
      var _this11 = this;

      this.loadFromLocalstorage();

      var serverUserOwnedProducts = dbUserOwnedProducts.find({ userId: this.user.userId }).fetch();
      var isChange = false;

      var _loop7 = function _loop7(p) {
        var i = _this11.products.findIndex(function (x) {
          return x.productId === p.productId;
        });
        if (i !== -1) {
          isChange = true;
          _this11.products[i].amount = p.amount;
        }
      };

      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = serverUserOwnedProducts[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var p = _step10.value;

          _loop7(p);
        }
      } catch (err) {
        _didIteratorError10 = true;
        _iteratorError10 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion10 && _iterator10.return) {
            _iterator10.return();
          }
        } finally {
          if (_didIteratorError10) {
            throw _iteratorError10;
          }
        }
      }

      if (isChange) {
        this.updateToLocalstorage();
      }
    }
  }]);

  return ScriptVip;
}();

//---end file: User/ScriptVip
//

/**
 * 目前登入中的使用者
 */


var LoginUser = function (_User) {
  _inherits(LoginUser, _User);

  function LoginUser() {
    _classCallCheck(this, LoginUser);

    var id = Meteor.userId();
    console.log('create LoginUser: ' + id);

    var _this12 = _possibleConstructorReturn(this, (LoginUser.__proto__ || Object.getPrototypeOf(LoginUser)).call(this, id));

    _this12.orders = [];
    _this12.scriptVip = new ScriptVip(_this12);

    _this12.directorsCache = [];

    Template.accountDialog.onRendered(function () {
      setTimeout(function () {
        _this12.changeLoginUser();
      }, 1000);
    });

    console.log('');
    return _this12;
  }

  //可能是原本沒登入後來登入了，所以要寫入id，或是分身......


  _createClass(LoginUser, [{
    key: 'changeLoginUser',
    value: function changeLoginUser() {
      var _this13 = this;

      console.log('try to changeLoginUser......');
      var id = Meteor.userId();
      if (id) {
        console.log('LoginUser: new ID: ' + id);
        this.userId = id;
      } else {
        setTimeout(function () {
          _this13.changeLoginUser();
        }, 1000);
      }
    }
  }, {
    key: 'updateFullHoldStocks',
    value: function updateFullHoldStocks() {
      var _this14 = this;

      console.log('---start updateFullHoldStocks()');

      this.loadFromSessionstorage();

      var serverDirectors = dbDirectors.find({ userId: this.userId }).fetch();
      //避免多次不必要的重複寫入，檢查是否與快取的一模一樣
      if (JSON.stringify(serverDirectors) !== JSON.stringify(this.directorsCache)) {
        var oldHoldStocks = this.holdStocks;
        this.holdStocks = [];

        var _loop8 = function _loop8(c) {
          var oldC = oldHoldStocks.find(function (x) {
            return x.companyId === c.companyId;
          });
          //從舊資料中獲取vip等級資訊，避免將vip資訊洗掉
          var vipLevel = oldC !== undefined ? oldC.vip : null;
          _this14.holdStocks.push({ companyId: c.companyId, stocks: c.stocks, vip: vipLevel });
        };

        var _iteratorNormalCompletion11 = true;
        var _didIteratorError11 = false;
        var _iteratorError11 = undefined;

        try {
          for (var _iterator11 = serverDirectors[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
            var c = _step11.value;

            _loop8(c);
          }
        } catch (err) {
          _didIteratorError11 = true;
          _iteratorError11 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion11 && _iterator11.return) {
              _iterator11.return();
            }
          } finally {
            if (_didIteratorError11) {
              throw _iteratorError11;
            }
          }
        }

        this.saveToSessionstorage();
        this.directorsCache = serverDirectors;
      }

      console.log('---end updateFullHoldStocks()');
    }
  }, {
    key: 'updateOrders',
    value: function updateOrders() {
      console.log('---start updateOrders()');

      this.loadFromSessionstorage();

      var serverOrders = dbOrders.find({ userId: this.userId }).fetch();
      if (JSON.stringify(this.orders) !== JSON.stringify(serverOrders)) {
        this.orders = serverOrders;
        this.saveToSessionstorage();
      }

      console.log('---end updateOrders()');
    }
  }, {
    key: 'computeBuyOrdersMoney',
    value: function computeBuyOrdersMoney() {
      console.log('---start computeBuyOrdersMoney()');

      var money = 0;
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        for (var _iterator12 = this.buyOrders[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          var order = _step12.value;

          money += order.unitPrice * (order.amount - order.done);
        }
      } catch (err) {
        _didIteratorError12 = true;
        _iteratorError12 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion12 && _iterator12.return) {
            _iterator12.return();
          }
        } finally {
          if (_didIteratorError12) {
            throw _iteratorError12;
          }
        }
      }

      console.log('---end computeBuyOrdersMoney(): ' + money);

      return money;
    }
  }, {
    key: 'computeSellOrdersAsset',
    value: function computeSellOrdersAsset() {
      console.log('---start computeSellOrdersAsset()');

      var asset = 0;
      var localCompanies = getLocalCompanies();

      var _loop9 = function _loop9(order) {
        var companyData = localCompanies.find(function (x) {
          return x.companyId === order.companyId;
        });
        //以參考價計算賣單股票價值, 如果找不到資料則用賣單價格
        var price = companyData !== undefined ? companyData.price : order.unitPrice;
        asset += price * (order.amount - order.done);
      };

      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        for (var _iterator13 = this.sellOrders[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          var order = _step13.value;

          _loop9(order);
        }
      } catch (err) {
        _didIteratorError13 = true;
        _iteratorError13 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion13 && _iterator13.return) {
            _iterator13.return();
          }
        } finally {
          if (_didIteratorError13) {
            throw _iteratorError13;
          }
        }
      }

      console.log('---end computeSellOrdersAsset(): ' + asset);

      return asset;
    }

    //Override

  }, {
    key: 'computeTotalStockWealth',
    value: function computeTotalStockWealth() {
      var totalStockWealth = _get(LoginUser.prototype.__proto__ || Object.getPrototypeOf(LoginUser.prototype), 'computeTotalStockWealth', this).call(this) + this.computeSellOrdersAsset();
      console.log('---LoginUser.computeTotalStockWealth(): ' + totalStockWealth);

      return totalStockWealth;
    }

    //Override

  }, {
    key: 'computeTotalMoney',
    value: function computeTotalMoney() {
      var totalMoney = _get(LoginUser.prototype.__proto__ || Object.getPrototypeOf(LoginUser.prototype), 'computeTotalMoney', this).call(this) + this.computeBuyOrdersMoney();
      console.log('---LoginUser.computeTotalMoney(): ' + totalMoney);

      return totalMoney;
    }
  }, {
    key: 'vipLevel',
    value: function vipLevel() {
      return this.scriptVip.vipLevel();
    }
  }, {
    key: 'updateProducts',
    value: function updateProducts() {
      this.scriptVip.updateProducts();
    }
  }, {
    key: 'buyOrders',
    get: function get() {
      var buyOrders = [];
      var _iteratorNormalCompletion14 = true;
      var _didIteratorError14 = false;
      var _iteratorError14 = undefined;

      try {
        for (var _iterator14 = this.orders[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
          var order = _step14.value;

          if (order.orderType === '購入') {
            buyOrders.push(order);
          }
        }
      } catch (err) {
        _didIteratorError14 = true;
        _iteratorError14 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion14 && _iterator14.return) {
            _iterator14.return();
          }
        } finally {
          if (_didIteratorError14) {
            throw _iteratorError14;
          }
        }
      }

      return buyOrders;
    }
  }, {
    key: 'sellOrders',
    get: function get() {
      var sellOrders = [];
      var _iteratorNormalCompletion15 = true;
      var _didIteratorError15 = false;
      var _iteratorError15 = undefined;

      try {
        for (var _iterator15 = this.orders[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
          var order = _step15.value;

          if (order.orderType === '賣出') {
            sellOrders.push(order);
          }
        }
      } catch (err) {
        _didIteratorError15 = true;
        _iteratorError15 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion15 && _iterator15.return) {
            _iterator15.return();
          }
        } finally {
          if (_didIteratorError15) {
            throw _iteratorError15;
          }
        }
      }

      return sellOrders;
    }
  }]);

  return LoginUser;
}(User);

//--end file: User/LoginUser
//
//--start file: Global/ScriptView
//---start file: Global/View
/**
 * View
 */


var View = function () {
  /**
   * 建構 View
   * @param {String} name View的name
   */
  function View(name) {
    _classCallCheck(this, View);

    console.log('create View: ' + name);
  }

  /**
   * 創建內部用H2元素的資訊列
   * @param {{name: String, leftText: String, rightText: String, customSetting: {left, right}, textOnly: Boolean}} options 設定
   * @return {jquery.$div} HTML元素
   */


  _createClass(View, [{
    key: 'createH2Info',
    value: function createH2Info(options) {
      var name = options.name || 'defaultName';
      options.customSetting = options.customSetting || {};
      var customSetting = {
        left: options.customSetting.left || '',
        right: options.customSetting.right || ''
      };
      var leftText = options.leftText || '';
      var rightText = options.rightText || '';
      var textOnly = options.textOnly || false;

      var r = '\n      <div class=\'media border-grid-body\' name=\'' + name + '\'>\n        <div class=\'col-6 text-right border-grid\' name=\'' + name + '\' id=\'h2Left\'>\n          <h2 name=\'' + name + '\' id=\'h2Left\' ' + customSetting.left + '>' + leftText + '</h2>\n        </div>\n        <div class=\'col-6 text-right border-grid\' name=\'' + name + '\' id=\'h2Right\'>\n          <h2 name=\'' + name + '\' id=\'h2Right\' ' + customSetting.right + '>' + rightText + '</h2>\n        </div>\n      </div>\n    ';
      if (!textOnly) {
        r = $(r);
      }

      return r;
    }

    /**
     * 創建table元素
     * @param {{name: String, tHead: Array, tBody: Array, customSetting: {table: String, tHead: String, tBody: String}, textOnly: Boolean}} options 設定
     * @return {jquery.$table} table元素
     */

  }, {
    key: 'createTable',
    value: function createTable(options) {
      var name = options.name || 'defaultName';
      options.customSetting = options.customSetting || {};
      var customSetting = {
        table: options.customSetting.table || '',
        tHead: options.customSetting.tHead || '',
        tBody: options.customSetting.tBody || ''
      };
      var tHead = options.tHead || [];
      var tBody = options.tBody || [];
      var textOnly = options.textOnly || false;

      var head = '';
      head += '<tr>';
      var _iteratorNormalCompletion16 = true;
      var _didIteratorError16 = false;
      var _iteratorError16 = undefined;

      try {
        for (var _iterator16 = tHead[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
          var h = _step16.value;

          head += '<th name=' + name + ' ' + customSetting.tHead + '>' + h + '</th>';
        }
      } catch (err) {
        _didIteratorError16 = true;
        _iteratorError16 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion16 && _iterator16.return) {
            _iterator16.return();
          }
        } finally {
          if (_didIteratorError16) {
            throw _iteratorError16;
          }
        }
      }

      head += '</tr>';

      var body = '';
      var _iteratorNormalCompletion17 = true;
      var _didIteratorError17 = false;
      var _iteratorError17 = undefined;

      try {
        for (var _iterator17 = tBody[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
          var row = _step17.value;

          body += '<tr>';
          var _iteratorNormalCompletion18 = true;
          var _didIteratorError18 = false;
          var _iteratorError18 = undefined;

          try {
            for (var _iterator18 = row[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
              var column = _step18.value;

              body += '<td name=' + name + ' ' + customSetting.tBody + '>' + column + '</td>';
            }
          } catch (err) {
            _didIteratorError18 = true;
            _iteratorError18 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion18 && _iterator18.return) {
                _iterator18.return();
              }
            } finally {
              if (_didIteratorError18) {
                throw _iteratorError18;
              }
            }
          }

          body += '</tr>';
        }
      } catch (err) {
        _didIteratorError17 = true;
        _iteratorError17 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion17 && _iterator17.return) {
            _iterator17.return();
          }
        } finally {
          if (_didIteratorError17) {
            throw _iteratorError17;
          }
        }
      }

      var r = '\n      <table border=\'1\' name=' + name + ' ' + customSetting.table + '>\n        <thead name=' + name + '>\n          ' + head + '\n        </thead>\n        <tbody name=' + name + '>\n          ' + body + '\n        </tbody>\n      </table>\n    ';
      if (!textOnly) {
        r = $(r);
      }

      return r;
    }

    /**
     * 創建button元素.
     * size預設為'btn-sm', color預設為'btn-info'
     * @param {{name: String, size: String, color: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
     * @return {jquery.$button} button元素
     */

  }, {
    key: 'createButton',
    value: function createButton(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';
      var size = options.size || 'btn-sm';
      var color = options.color || 'btn-info';
      var text = options.text || 'default';
      var textOnly = options.textOnly || false;

      var r = '\n      <button class=\'btn ' + color + ' ' + size + '\' name=\'' + name + '\' ' + customSetting + '>' + text + '</button>\n    ';
      if (!textOnly) {
        r = $(r);
      }

      return r;
    }

    /**
     * 創建select元素.
     * @param {{name: String, customSetting: String, textOnly: Boolean}} options 設定
     * @return {jquery.$select} select元素
     */

  }, {
    key: 'createSelect',
    value: function createSelect(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';
      var textOnly = options.textOnly || false;

      var r = '\n      <select class=\'form-control\' name=\'' + name + '\' ' + customSetting + '>\n      </select>\n    ';
      if (!textOnly) {
        r = $(r);
      }

      return r;
    }

    /**
     * 創建option元素.
     * text同時用於 顯示文字 與 指定的value
     * @param {{name: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
     * @return {jquery.$option} select元素
     */

  }, {
    key: 'createSelectOption',
    value: function createSelectOption(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';
      var text = options.text || 'defaultText';
      var textOnly = options.textOnly || false;

      var r = '\n      <option name=\'' + name + '\' value=\'' + text + '\' ' + customSetting + '>' + text + '</option>\n    ';
      if (!textOnly) {
        r = $(r);
      }

      return r;
    }

    /**
     * 創建input元素.
     * @param {{name: String, defaultText: String, placeholder: String, type: String, customSetting: String, textOnly: Boolean}} options 設定
     * @return {jquery.$input} input元素
     */

  }, {
    key: 'createInput',
    value: function createInput(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';
      var defaultValue = options.defaultValue || '';
      var placeholder = options.placeholder || '';
      var type = options.type || 'text';
      var textOnly = options.textOnly || false;

      var r = '\n      <input class=\'form-control\'\n        name=\'' + name + '\'\n        type=\'' + type + '\'\n        placeholder=\'' + placeholder + '\'\n        value=\'' + defaultValue + '\'\n        ' + customSetting + '\n      />\n    ';
      if (!textOnly) {
        r = $(r);
      }

      return r;
    }

    /**
     * 創建a元素.
     * 如不需要超連結 僅純顯示文字 請不要設定href,
     * 如不需要新開頁面 則不用設定target
     * @param {{name: String, href: String, target: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
     * @return {jquery.$a} a元素
     */

  }, {
    key: 'createA',
    value: function createA(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';
      var href = options.href ? 'href=\'' + options.href + '\'' : '';
      var target = options.target ? 'target=\'' + options.target + '\'' : '';
      var text = options.text || '';
      var textOnly = options.textOnly || false;

      var r = '\n      <a class=\'float-left\'\n        name=\'' + name + '\'\n        ' + href + '\n        ' + target + '\n        ' + customSetting + '\n      >' + text + '</a>\n    ';
      if (!textOnly) {
        r = $(r);
      }

      return r;
    }

    /**
     * 創建DropDownMenu
     * @param {{name: String, text: String, customSetting: String, textOnly: Boolean}} options 設定
     * @return {jquery.$div} DropDownMenu
     */

  }, {
    key: 'createDropDownMenu',
    value: function createDropDownMenu(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';
      var text = options.text || '';
      var textOnly = options.textOnly || false;

      var r = '\n      <div class=\'note\' name=\'' + name + '\'>\n        <li class=\'nav-item dropdown text-nowrap\' name=\'' + name + '\'>\n          <a class=\'nav-link dropdown-toggle\' href=\'#\' data-toggle=\'dropdown\' name=\'' + name + '\' ' + customSetting + '>' + text + '</a>\n          <div class=\'dropdown-menu px-3 nav-dropdown-menu\'\n            aria-labelledby=\'navbarDropdownMenuLink\'\n            name=\'' + name + '\'>\n            <div name=\'' + name + '\' id=\'afterThis\'>\n            <div name=\'' + name + '\' id=\'beforeThis\'>\n            </div>\n          </div>\n        </li>\n      </div>\n    ';
      if (!textOnly) {
        r = $(r);
      }

      return r;
    }

    /**
     * 創建DropDownMenu的option
     * @param {{name: String, text: String, href: String, target: String, customSetting: String, textOnly: Boolean}} options 設定
     * @return {jquery.$li} DropDownMenu的option
     */

  }, {
    key: 'createDropDownMenuOption',
    value: function createDropDownMenuOption(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';
      var text = options.text || '';
      var href = options.href ? 'href=\'' + options.href + '\'' : '';
      var target = options.target ? 'target=\'' + options.target + '\'' : '';
      var textOnly = options.textOnly || false;

      var r = '\n      <li class=\'nav-item\' name=\'' + name + '\'>\n        <a class=\'nav-link text-truncate\'\n          name=\'' + name + '\'\n          ' + href + '\n          ' + target + '\n          ' + customSetting + '\n        >' + text + '</a>\n      </li>\n    ';
      if (!textOnly) {
        r = $(r);
      }

      return r;
    }
  }]);

  return View;
}();

//---end file: Global/View
//

/**
 * 控制所有頁面都看的到的物件的View
 */


var ScriptView = function (_View) {
  _inherits(ScriptView, _View);

  /**
   * 建構 ScriptView
   * @param {MainController} controller controller
   */
  function ScriptView(controller) {
    _classCallCheck(this, ScriptView);

    var _this15 = _possibleConstructorReturn(this, (ScriptView.__proto__ || Object.getPrototypeOf(ScriptView)).call(this, 'ScriptView'));

    _this15.controller = controller;
    return _this15;
  }

  _createClass(ScriptView, [{
    key: 'displayDropDownMenu',
    value: function displayDropDownMenu() {
      var displayObject = this.createDropDownMenu({
        name: 'softwareScriptMenu',
        text: translation(['script', 'name'])
      });

      $('div[name=\'softwareScriptMenu\']').remove();
      var afterObject = $('div[class=\'note\']')[2];
      displayObject.insertAfter(afterObject);
    }
    /**
     * 在外掛的下拉選單顯示輸入的物件
     * @param {{name: String, text: String, href: String, target: String, customSetting: String}} options 顯示的物件
     * @param {$jquerySelect} beforeObject insertBefore的物件
     * @return {void}
     */

  }, {
    key: 'displayDropDownMenuOption',
    value: function displayDropDownMenuOption(options, beforeObject) {
      var name = options.name;
      var customSetting = options.customSetting;
      var text = options.text;
      var href = options.href;
      var target = options.target;
      var displayObject = this.createDropDownMenuOption({
        name: name,
        customSetting: customSetting,
        text: text,
        href: href,
        target: target
      });

      displayObject.insertBefore(beforeObject);
    }
  }, {
    key: 'displayScriptMenu',
    value: function displayScriptMenu() {
      var _this16 = this;

      var beforeDiv = $('div[id=\'beforeThis\'][name=\'softwareScriptMenu\']')[0];
      this.displayDropDownMenuOption({
        name: 'aboutPage',
        text: translation(['script', 'about']),
        href: '/SoftwareScript/about'
      }, beforeDiv);

      var disconnectReminderSwitch = JSON.parse(window.localStorage.getItem('SoftwareScript.disconnectReminderSwitch'));
      this.displayDropDownMenuOption({
        name: 'disconnectReminderSwitch',
        text: translation(['script', disconnectReminderSwitch ? 'trunOffDisconnectReminder' : 'trunOnDisconnectReminder']),
        href: '#'
      }, beforeDiv);
      $('a[name=\'disconnectReminderSwitch\']')[0].addEventListener('click', function () {
        _this16.controller.switchDisconnectReminder(!disconnectReminderSwitch);
        disconnectReminderSwitch = JSON.parse(window.localStorage.getItem('SoftwareScript.disconnectReminderSwitch'));
        $('a[name=\'disconnectReminderSwitch\']')[0].text = translation(['script', disconnectReminderSwitch ? 'trunOffDisconnectReminder' : 'trunOnDisconnectReminder']);
      });

      this.displayDropDownMenuOption({
        name: 'scriptVipPage',
        text: translation(['script', 'vip']),
        href: '/SoftwareScript/scriptVIP'
      }, beforeDiv);

      var hr = $('<hr name=\'mostStocksCompany\' />');
      hr.insertBefore(beforeDiv);
      this.displayDropDownMenuOption({
        name: 'showMostStockholdingCompany',
        text: translation(['script', 'showMostStockholdingCompany']),
        href: '#',
        customSetting: 'style=\'font-size: 13px;\''
      }, beforeDiv);
      $('a[name=\'showMostStockholdingCompany\']')[0].addEventListener('click', function () {
        _this16.controller.showMostStockholdingCompany();
      });
    }
    /**
     * 顯示最多持股公司列表
     * @param {Array} list 要顯示的列表
     * @return {void}
     */

  }, {
    key: 'displayMostStockholdingCompany',
    value: function displayMostStockholdingCompany(list) {
      $('li[class=\'nav-item\'][name=\'mostStockholdingCompany\']').remove();

      var beforeDiv = $('div[id=\'beforeThis\'][name=\'softwareScriptMenu\']')[0];
      var _iteratorNormalCompletion19 = true;
      var _didIteratorError19 = false;
      var _iteratorError19 = undefined;

      try {
        for (var _iterator19 = list[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
          var company = _step19.value;

          this.displayDropDownMenuOption({
            name: 'mostStockholdingCompany',
            text: company.name,
            href: '/company/detail/' + company.companyId
          }, beforeDiv);
        }
      } catch (err) {
        _didIteratorError19 = true;
        _iteratorError19 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion19 && _iterator19.return) {
            _iterator19.return();
          }
        } finally {
          if (_didIteratorError19) {
            throw _iteratorError19;
          }
        }
      }
    }
  }, {
    key: 'displaySwitchDisconnectReminderInfo',
    value: function displaySwitchDisconnectReminderInfo(disconnectReminderSwitch) {
      alertDialog.alert({
        title: translation(['script', 'name']),
        message: translation(['script', disconnectReminderSwitch ? 'trunOnDisconnectReminderInfo' : 'trunOffDisconnectReminderInfo'])
      });
    }
  }]);

  return ScriptView;
}(View);

//--end file: Global/ScriptView
//
//--start file: Global/CloudUpdater

/**
 * 用來連線雲端以更新資料
 */


var CloudUpdater = function () {
  /**
   * 建構CloudUpdater
   * @param {*} serverType 現在連的股市伺服器
   */
  function CloudUpdater(serverType) {
    _classCallCheck(this, CloudUpdater);

    this.serverType = serverType;

    var myVersion = GM_info.script.version; // eslint-disable-line camelcase
    this.version = Number(myVersion.substr(0, 4));
  }

  /**
   * 以非同步方式取得另外整理過的公司資料 json
   * @param {String} url 資料的網址
   * @return {function} 可以用來更新資料的function
   */


  _createClass(CloudUpdater, [{
    key: 'getWebData',
    value: function getWebData(url) {
      var webObjCache = null;

      var webUrl = String(url);
      var request = new XMLHttpRequest();
      request.open('GET', webUrl); // 非同步 GET
      request.addEventListener('load', function () {
        debugConsole('got webData');
        try {
          webObjCache = JSON.parse(request.responseText);
        } catch (err) {
          webObjCache = request.responseText;
        }
      });
      request.send();

      return function (callback) {
        // 若快取資料存在，則直接回傳快取
        if (webObjCache !== null) {
          callback(webObjCache);

          return;
        }

        // 若無快取資料，則加入事件監聽，等載入後再回傳資料
        request.addEventListener('load', function () {
          callback(webObjCache);
        });
      };
    }
  }, {
    key: 'checkUpdateTime',
    value: function checkUpdateTime(url, localUpdateTime, updater) {
      var _this17 = this;

      var cloud = this.getWebData(url);
      cloud(function (cloudInfo) {
        var cloudTime = cloudInfo.updateTime;
        var conformedVersion = Number(cloudInfo.conformedVersion);
        console.log('cloud url: ' + url);
        console.log(localUpdateTime + ' === ' + cloudTime + ': ' + (localUpdateTime === cloudTime));
        console.log(_this17.version + ' >= ' + conformedVersion + ': ' + (_this17.version >= conformedVersion));
        if (cloudTime === localUpdateTime) {
          console.log('cloud don\'t have new data');
          console.log('');
        } else if (_this17.version >= conformedVersion) {
          console.log('cloud have new data');
          console.log('');
          updater(cloudTime);
        } else {
          console.log('script version(' + _this17.version + ') is too old, can not update');
          console.log('cloud data only supports version ' + conformedVersion + ' or later');
          console.log('');
        }
      });
    }
  }, {
    key: 'checkCompaniesUpdate',
    value: function checkCompaniesUpdate() {
      var _this18 = this;

      var timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptCompany/updateInfo.json';
      var dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptCompany/companies.json';
      if (this.serverType === 'museum') {
        dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/companys.json';
        timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/updateTime.json';
      }

      var updater = function updater(cloudTime) {
        var cloud = _this18.getWebData(dataUrl);
        cloud(function (cloudData) {
          var inputData = cloudData || [];
          window.localStorage.setItem('localCompanies', JSON.stringify(inputData));
          var inputTime = cloudTime || 'null';
          window.localStorage.setItem('localCompaniesUpdateTime', JSON.stringify(inputTime));

          console.log('localCompanies update complete');
        });
      };
      var localCompaniesUpdateTime = JSON.parse(window.localStorage.getItem('localCompaniesUpdateTime')) || 'null';
      this.checkUpdateTime(timeUrl, localCompaniesUpdateTime, updater);
    }
  }, {
    key: 'checkScriptVipProductsUpdate',
    value: function checkScriptVipProductsUpdate() {
      var _this19 = this;

      var timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/updateInfo.json';
      var dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/scriptVipProducts.json';

      var updater = function updater(cloudTime) {
        var cloud = _this19.getWebData(dataUrl);
        cloud(function (cloudData) {
          var inputData = cloudData || [];
          var localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
          var defaultUser = {
            userId: 'default',
            products: inputData
          };
          var j = localScriptVipProducts.findIndex(function (x) {
            return x.userId === defaultUser.userId;
          });
          if (j === -1) {
            localScriptVipProducts.push(defaultUser);
          }
          localScriptVipProducts.forEach(function (user, i, array) {
            array[i].products = inputData;
          });

          window.localStorage.setItem('localScriptVipProducts', JSON.stringify(localScriptVipProducts));

          var inputTime = cloudTime || 'null';
          window.localStorage.setItem('localScriptVipProductsUpdateTime', JSON.stringify(inputTime));

          console.log('scriptVipProducts update complete');
        });
      };
      var localScriptVipProductsUpdateTime = JSON.parse(window.localStorage.getItem('localScriptVipProductsUpdateTime')) || 'null';
      this.checkUpdateTime(timeUrl, localScriptVipProductsUpdateTime, updater);
    }
  }]);

  return CloudUpdater;
}();

//--end file: Global/CloudUpdater
//
//--start file: CompanyListPage/CompanyListController
//---start file: Global/EventController

//監聽頁面，資料準備完成時執行event
//不應該直接呼叫，他應該被繼承
//使用例:
// class CompanyDetailController extends EventController {
//   constructor(user) {
//     super('CompanyDetailController', user);
//     this.templateListener(Template.companyDetailNormalContent, 'Template.companyDetailNormalContent', this.startEvent);
//     this.templateListener(Template.companyDetail, 'Template.companyDetail', this.startEvent2);
//   }
//   startEvent() {
//     console.log('companyDetailNormalContent success');
//     console.log(Meteor.connection._mongo_livedata_collections.employees.find().fetch());
//     console.log('');
//   }
//   startEvent2() {
//     console.log('companyDetail success');
//     console.log(Meteor.connection._mongo_livedata_collections.companies.find().fetch());
//     console.log('');
//   }
// }

/**
 * 頁面的Controller
 */


var EventController = function () {
  /**
   * 建構 EventController
   * @param {String} controllerName 名字
   * @param {LoginUser} loginUser 登入的使用者
   */
  function EventController(controllerName, loginUser) {
    _classCallCheck(this, EventController);

    console.log('create controller: ' + controllerName);
    this.loginUser = loginUser;
  }

  /**
   * 監聽是否載入完成，完成後呼叫callback
   * @param {Template} template 監聽的Template
   * @param {String} templateName 監聽的Template的名字，用於console
   * @param {function} callback callbock
   * @return {void}
   */


  _createClass(EventController, [{
    key: 'templateListener',
    value: function templateListener(template, templateName, callback) {
      template.onCreated(function () {
        var _this20 = this;

        var rIsDataReady = new ReactiveVar(false);
        this.autorun(function () {
          rIsDataReady.set(_this20.subscriptionsReady());
        });
        this.autorun(function () {
          if (rIsDataReady.get()) {
            console.log(templateName + ' loaded');
            callback(templateName);
          } else {
            console.log(templateName + ' is loading');
          }
        });
      });
    }

    /**
     * 資料夾監聽器，監聽到點擊後呼叫callback
     * @param {String} panelFolderKey 資料夾的key
     * @param {Function} callback callback
     * @return {void}
     */

  }, {
    key: 'panelFolderListener',
    value: function panelFolderListener(panelFolderKey, callback) {
      Template.panelFolder.events({
        'click [data-action="togglePanelFolder"]': function clickDataActionTogglePanelFolder(event, templateInstance) {
          var currentTargetKey = templateInstance.$(event.currentTarget).attr('data-key');
          if (currentTargetKey === panelFolderKey) {
            setTimeout(function () {
              callback();
            }, 0);
          }
        }
      });
    }
  }]);

  return EventController;
}();

//---end file: Global/EventController
//
//---start file: Company/Companies
//----start file: Company/Company
/**
 * CompanyObject
 */


var Company = function () {
  /**
   * 建構 Company
   * @param {object} serverCompany 從dbCompanies中擷取出來的單一個company
   */
  function Company(serverCompany) {
    _classCallCheck(this, Company);

    this.companyId = serverCompany._id;
    this.name = serverCompany.companyName;

    this.chairman = serverCompany.chairman || '';
    this.manager = serverCompany.manager || '';

    this.grade = serverCompany.grade;
    this.capital = serverCompany.capital;
    this.price = serverCompany.listPrice;
    this.release = serverCompany.totalRelease;
    this.profit = serverCompany.profit;

    this.vipBonusStocks = 0; //外掛獨有參數
    this.managerBonusRatePercent = serverCompany.managerBonusRatePercent;
    this.capitalIncreaseRatePercent = serverCompany.capitalIncreaseRatePercent;

    this.salary = serverCompany.salary || 1000;
    this.nextSeasonSalary = serverCompany.nextSeasonSalary || 1000;
    this.employeeBonusRatePercent = serverCompany.employeeBonusRatePercent;
    this.employeesNumber = 0;
    this.nextSeasonEmployeesNumber = 0;

    this.tags = serverCompany.tags || [];
    this.createdAt = serverCompany.createdAt.getTime();
  }

  _createClass(Company, [{
    key: 'updateWithDbemployees',
    value: function updateWithDbemployees(serverEmployees) {
      console.log('---start updateWithDbemployees()');

      var employeesNumber = 0;
      var nextSeasonEmployeesNumber = 0;

      var _iteratorNormalCompletion20 = true;
      var _didIteratorError20 = false;
      var _iteratorError20 = undefined;

      try {
        for (var _iterator20 = serverEmployees[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
          var emp = _step20.value;

          if (emp.employed === true && emp.resigned === false) {
            employeesNumber += 1;
          } else if (emp.employed === false && emp.resigned === false) {
            nextSeasonEmployeesNumber += 1;
          }
        }
      } catch (err) {
        _didIteratorError20 = true;
        _iteratorError20 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion20 && _iterator20.return) {
            _iterator20.return();
          }
        } finally {
          if (_didIteratorError20) {
            throw _iteratorError20;
          }
        }
      }

      this.employeesNumber = employeesNumber;
      this.nextSeasonEmployeesNumber = nextSeasonEmployeesNumber;

      console.log('---end updateWithDbemployees()');
    }

    /**
     * 會判斷是不是在companyDetail頁面, 是的話就只取vipBonusStocks用, 不放入其他參數
     * @param {Company} companyData 公司資料
     * @return {void}
     */

  }, {
    key: 'updateWithLocalcompanies',
    value: function updateWithLocalcompanies(companyData) {
      this.vipBonusStocks = companyData.vipBonusStocks; //外掛獨有參數
      var page = FlowRouter.getRouteName();
      if (page !== 'companyDetail') {
        this.grade = companyData.grade;

        this.salary = companyData.salary;
        this.nextSeasonSalary = companyData.nextSeasonSalary;
        this.employeesNumber = companyData.employeesNumber;
        this.nextSeasonEmployeesNumber = companyData.nextSeasonEmployeesNumber;

        this.tags = companyData.tags;
      }
    }
  }, {
    key: 'computePERatio',
    value: function computePERatio() {
      return this.price * this.release / this.profit;
    }
  }, {
    key: 'computePERatioWithVipSystem',
    value: function computePERatioWithVipSystem() {
      return this.price * (this.release + this.vipBonusStocks) / this.profit;
    }
  }, {
    key: 'outputInfo',
    value: function outputInfo() {
      return {
        companyId: this.companyId,
        name: this.name,
        chairman: this.chairman,
        manager: this.manager,

        grade: this.grade,
        capital: this.capital,
        price: this.price,
        release: this.release,
        profit: this.profit,

        vipBonusStocks: this.vipBonusStocks, //外掛獨有參數
        managerBonusRatePercent: this.managerBonusRatePercent,
        capitalIncreaseRatePercent: this.capitalIncreaseRatePercent,

        salary: this.salary,
        nextSeasonSalary: this.nextSeasonSalary,
        employeeBonusRatePercent: this.employeeBonusRatePercent,
        employeesNumber: this.employeesNumber,
        nextSeasonEmployeesNumber: this.nextSeasonEmployeesNumber,

        tags: this.tags,
        createdAt: this.createdAt
      };
    }
  }]);

  return Company;
}();

//----end file: Company/Company
//

/**
 * Company的集合，會創建多個company放在裡面
 */


var Companies = function () {
  function Companies() {
    _classCallCheck(this, Companies);

    this.list = [];
    var serverCompanies = void 0;
    var page = FlowRouter.getRouteName();
    if (page === 'companyDetail') {
      var detailId = FlowRouter.getParam('companyId');
      serverCompanies = dbCompanies.find({ _id: detailId }).fetch();
    } else {
      serverCompanies = dbCompanies.find().fetch();
    }
    var _iteratorNormalCompletion21 = true;
    var _didIteratorError21 = false;
    var _iteratorError21 = undefined;

    try {
      for (var _iterator21 = serverCompanies[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
        var serverCompany = _step21.value;

        var company = new Company(serverCompany);
        this.list.push(company);
      }
    } catch (err) {
      _didIteratorError21 = true;
      _iteratorError21 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion21 && _iterator21.return) {
          _iterator21.return();
        }
      } finally {
        if (_didIteratorError21) {
          throw _iteratorError21;
        }
      }
    }
  }

  _createClass(Companies, [{
    key: 'companyPatch',
    value: function companyPatch() {
      var localCompanies = getLocalCompanies();
      this.list.forEach(function (company, i, list) {
        var companyData = localCompanies.find(function (x) {
          return x.companyId === company.companyId;
        });
        if (companyData !== undefined) {
          list[i].updateWithLocalcompanies(companyData);
        } else {
          list[i].updateWithLocalcompanies({
            companyId: company.companyId,
            name: company.name,
            chairman: company.chairman,
            manager: company.manager,

            grade: 'D',
            capital: company.capital,
            price: company.price,
            release: company.release,
            profit: company.profit,

            vipBonusStocks: 0, //外掛獨有參數
            managerBonusRatePercent: company.managerBonusRatePercent,
            capitalIncreaseRatePercent: company.capitalIncreaseRatePercent,

            salary: 1000,
            nextSeasonSalary: 1000,
            employeeBonusRatePercent: company.employeeBonusRatePercent,
            employeesNumber: 0,
            nextSeasonEmployeesNumber: 0,

            tags: [],
            createdAt: company.createdAt
          });
        }
      });
    }
  }, {
    key: 'updateEmployeesInfo',
    value: function updateEmployeesInfo() {
      console.log('---start updateEmployeesInfo()');

      this.list.forEach(function (company, i, list) {
        var serverEmployees = dbEmployees.find({ companyId: company.companyId }).fetch();
        list[i].updateWithDbemployees(serverEmployees);
      });

      console.log('---end updateEmployeesInfo()');
    }
  }, {
    key: 'updateToLocalstorage',
    value: function updateToLocalstorage() {
      var localCompanies = getLocalCompanies();

      var _loop10 = function _loop10(company) {
        var i = localCompanies.findIndex(function (x) {
          return x.companyId === company.companyId;
        });
        var inputData = company.outputInfo();
        if (i !== -1) {
          localCompanies[i] = inputData;
        } else {
          localCompanies.push(inputData);
        }
      };

      var _iteratorNormalCompletion22 = true;
      var _didIteratorError22 = false;
      var _iteratorError22 = undefined;

      try {
        for (var _iterator22 = this.list[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
          var company = _step22.value;

          _loop10(company);
        }
      } catch (err) {
        _didIteratorError22 = true;
        _iteratorError22 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion22 && _iterator22.return) {
            _iterator22.return();
          }
        } finally {
          if (_didIteratorError22) {
            throw _iteratorError22;
          }
        }
      }

      window.localStorage.setItem('localCompanies', JSON.stringify(localCompanies));
    }

    /**
     * 尋找特定公司
     * 找不到時回傳undefined
     * @param {String} companyId company的ID
     * @return {Company} 找到的公司
     */

  }, {
    key: 'find',
    value: function find(companyId) {
      var _iteratorNormalCompletion23 = true;
      var _didIteratorError23 = false;
      var _iteratorError23 = undefined;

      try {
        for (var _iterator23 = this.list[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
          var company = _step23.value;

          if (company.companyId === companyId) {
            return company;
          }
        }
      } catch (err) {
        _didIteratorError23 = true;
        _iteratorError23 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion23 && _iterator23.return) {
            _iterator23.return();
          }
        } finally {
          if (_didIteratorError23) {
            throw _iteratorError23;
          }
        }
      }

      return undefined;
    }
  }, {
    key: 'computeUserProfit',
    value: function computeUserProfit(loginUser) {
      var userProfit = 0;

      var _loop11 = function _loop11(company) {
        var userHold = loginUser.holdStocks.find(function (x) {
          return x.companyId === company.companyId;
        });
        if (userHold !== undefined) {
          userProfit += earnPerShare(company.outputInfo()) * effectiveStocks(userHold.stocks, userHold.vip);
        }
      };

      var _iteratorNormalCompletion24 = true;
      var _didIteratorError24 = false;
      var _iteratorError24 = undefined;

      try {
        for (var _iterator24 = this.list[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
          var company = _step24.value;

          _loop11(company);
        }
      } catch (err) {
        _didIteratorError24 = true;
        _iteratorError24 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion24 && _iterator24.return) {
            _iterator24.return();
          }
        } finally {
          if (_didIteratorError24) {
            throw _iteratorError24;
          }
        }
      }

      return userProfit;
    }
  }]);

  return Companies;
}();

//---end file: Company/Companies
//
//---start file: CompanyListPage/CompanyListView

/**
 * CompanyList的View
 */


var CompanyListView = function (_View2) {
  _inherits(CompanyListView, _View2);

  /**
   * 建構CompanyListView
   * @param {LoginUser} loginUser LoginUser
   */
  function CompanyListView(loginUser) {
    _classCallCheck(this, CompanyListView);

    var _this21 = _possibleConstructorReturn(this, (CompanyListView.__proto__ || Object.getPrototypeOf(CompanyListView)).call(this, 'CompanyListView'));

    _this21.loginUser = loginUser;

    //強制覆蓋
    Template.companyListCard._callbacks.rendered = [];
    return _this21;
  }

  _createClass(CompanyListView, [{
    key: 'addCardInfo',
    value: function addCardInfo(instance) {
      var _this22 = this;

      function insertAfterLastRow(row) {
        instance.$('.row-info').last().after(row);
      }

      function hideRow(row) {
        row.removeClass('d-flex').addClass('d-none');
      }

      function showRow(row) {
        row.removeClass('d-none').addClass('d-flex');
      }

      var infoRowSample = instance.$('.row-info').last();

      var ownValueRow = infoRowSample.clone();
      ownValueRow.find('p:eq(0)').html(translation(['companyList', 'stockAsset']));
      insertAfterLastRow(ownValueRow);

      var profitRow = infoRowSample.clone();
      profitRow.find('p:eq(0)').html(translation(['company', 'profit']));
      insertAfterLastRow(profitRow);

      var peRatioRow = infoRowSample.clone();
      peRatioRow.find('p:eq(0)').html(translation(['companyList', 'peRatio']));
      insertAfterLastRow(peRatioRow);

      var peRatioVipRow = infoRowSample.clone();
      peRatioVipRow.find('p:eq(0)').html(translation(['companyList', 'peRatioVip']));
      insertAfterLastRow(peRatioVipRow);

      var peRatioUserRow = infoRowSample.clone();
      peRatioUserRow.find('p:eq(0)').html(translation(['companyList', 'peRatioUser']));
      insertAfterLastRow(peRatioUserRow);

      var userProfitRow = infoRowSample.clone();
      userProfitRow.find('p:eq(0)').html(translation(['companyList', 'estimatedProfit']));
      insertAfterLastRow(userProfitRow);

      var managerSalaryRow = infoRowSample.clone();
      managerSalaryRow.find('p:eq(0)').html(translation(['companyList', 'estimatedManagerProfit']));
      insertAfterLastRow(managerSalaryRow);

      instance.autorun(function () {
        var serverCompany = Template.currentData();
        var company = new Company(serverCompany);
        var companyData = _this22.localCompanies.find(function (x) {
          return x.companyId === company.companyId;
        });
        if (companyData !== undefined) {
          company.updateWithLocalcompanies(companyData);
        }

        profitRow.find('p:eq(1)').html('$ ' + Math.round(company.profit));

        var vipBonusStocks = Number(company.vipBonusStocks);
        company.vipBonusStocks = 0;
        var peRatio = company.price / earnPerShare(company);
        company.vipBonusStocks = vipBonusStocks;
        peRatioRow.find('p:eq(1)').html(isFinite(peRatio) ? peRatio.toFixed(2) : '∞');

        var peRatioVip = company.price / earnPerShare(company);
        peRatioVipRow.find('p:eq(1)').html(isFinite(peRatioVip) ? peRatioVip.toFixed(2) : '∞');

        if (Meteor.user()) {
          var stockAmount = getCurrentUserOwnedStockAmount(company.companyId);
          if (stockAmount > 0) {
            var _stockAmount = getCurrentUserOwnedStockAmount(company.companyId);
            var ownValue = _stockAmount * company.price;
            ownValueRow.find('p:eq(1)').html('$ ' + ownValue);
            showRow(ownValueRow);

            var holdC = _this22.loginUser.holdStocks.find(function (x) {
              return x.companyId === company.companyId;
            }) || { vip: null };
            var userProfit = Math.round(earnPerShare(company) * effectiveStocks(_stockAmount, holdC.vip));
            userProfitRow.find('p:eq(1)').html('$ ' + userProfit);
            showRow(userProfitRow);

            var peRatioUser = ownValue / userProfit;
            peRatioUserRow.find('p:eq(1)').html(isFinite(peRatioUser) ? peRatioUser.toFixed(2) : '∞');
            showRow(peRatioUserRow);
          } else {
            hideRow(ownValueRow);
            hideRow(userProfitRow);
            hideRow(peRatioUserRow);
          }

          if (Meteor.userId() !== company.manager) {
            hideRow(managerSalaryRow);
          } else {
            var managerSalary = Math.round(company.profit * (company.managerBonusRatePercent / 100));
            managerSalaryRow.find('p:eq(1)').html('$ ' + managerSalary);
            showRow(managerSalaryRow);
          }
        } else {
          hideRow(ownValueRow);
          hideRow(userProfitRow);
          hideRow(managerSalaryRow);
          hideRow(peRatioUserRow);
        }
      });
    }
  }, {
    key: 'localCompanies',
    get: function get() {
      var nowTime = new Date();
      //避免在短時間內過於頻繁的存取 localStorage
      if (!this.lastGetTime) {
        this.lastGetTime = nowTime;
        this._localCompanies = getLocalCompanies();
      } else if (nowTime.getTime() - this.lastGetTime.getTime() > 3000) {
        this.lastGetTime = nowTime;
        this._localCompanies = getLocalCompanies();
      }

      return this._localCompanies;
    }
  }]);

  return CompanyListView;
}(View);

//---end file: CompanyListPage/CompanyListView
//

/**
 * CompanyList的Controller
 */


var CompanyListController = function (_EventController) {
  _inherits(CompanyListController, _EventController);

  /**
   * 建構 CompanyListController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  function CompanyListController(loginUser) {
    _classCallCheck(this, CompanyListController);

    var _this23 = _possibleConstructorReturn(this, (CompanyListController.__proto__ || Object.getPrototypeOf(CompanyListController)).call(this, 'CompanyListController', loginUser));

    _this23.companyListView = new CompanyListView(_this23.loginUser);

    Template.companyListCard.onRendered(function () {
      var instance = Template.instance();
      _this23.companyListView.addCardInfo(instance);
    });

    _this23.templateListener(Template.companyList, 'Template.companyList', function () {
      _this23.updateUserInfo();
      _this23.useCompaniesInfo();
    });
    return _this23;
  }

  _createClass(CompanyListController, [{
    key: 'updateUserInfo',
    value: function updateUserInfo() {
      this.loginUser.updateFullHoldStocks();
      this.loginUser.updateOrders();
    }
  }, {
    key: 'useCompaniesInfo',
    value: function useCompaniesInfo() {
      var companies = new Companies();
      companies.companyPatch();

      companies.updateToLocalstorage();
    }
  }]);

  return CompanyListController;
}(EventController);

//--end file: CompanyListPage/CompanyListController
//
//--start file: CompanyDetailPage/CompanyDetailController
//---start file: BigLog/LogRecorder

/**
 * 用於紀錄所有log
 */


var LogRecorder = function () {
  //Singleton
  function LogRecorder() {
    _classCallCheck(this, LogRecorder);

    if (!LogRecorder.instance) {
      LogRecorder.instance = this;
      this.localLog = [];
      this.meteorLog = Meteor.connection._mongo_livedata_collections.log;
      console.log('create LogRecorder');
    }

    return LogRecorder.instance;
  }

  _createClass(LogRecorder, [{
    key: 'isAlreadyExists',
    value: function isAlreadyExists(list, log) {
      var old = list.find(function (x) {
        return x._id._str === log._id._str;
      });
      if (old !== undefined) {
        return true;
      } else {
        return false;
      }
    }
    /**
     * 回傳過濾過的log
     * @param {String} att 用於過濾的屬性
     * @param {String} value 符合的值, 通常是字串
     * @return {Array} 過濾後的log
     */

  }, {
    key: 'find',
    value: function find(att, value) {
      var list = [];
      if (att !== undefined && value !== undefined) {
        list = this.localLog.filter(function (x) {
          return x[att] === value;
        });
      } else {
        list = this.localLog;
      }

      return list;
    }
    /**
     * 回傳過濾後的log
     * @param {Funstion} fun 用於過濾的函式
     * @return {Array} 過濾後的log
     */

  }, {
    key: 'filter',
    value: function filter(fun) {
      var list = [];
      if (typeof fun === 'function') {
        list = this.localLog.filter(fun);
      } else {
        list = this.localLog;
      }

      return list;
    }
  }, {
    key: 'push',
    value: function push(serverLog) {
      var _iteratorNormalCompletion25 = true;
      var _didIteratorError25 = false;
      var _iteratorError25 = undefined;

      try {
        for (var _iterator25 = serverLog[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
          var log = _step25.value;

          if (!this.isAlreadyExists(this.localLog, log)) {
            log.softwareScriptStamp = true;
            this.localLog.push(log);
          }
        }
      } catch (err) {
        _didIteratorError25 = true;
        _iteratorError25 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion25 && _iterator25.return) {
            _iterator25.return();
          }
        } finally {
          if (_didIteratorError25) {
            throw _iteratorError25;
          }
        }
      }
    }
  }, {
    key: 'recordServerLog',
    value: function recordServerLog() {
      var serverLog = dbLog.find().fetch();
      this.push(serverLog);
    }

    /**
     * 依照時間排序並回傳, 未輸入陣列則以目前記錄的log去排序
     * @param {Array} list 要排序的陣列
     * @return {Array} 排序完的陣列
     */

  }, {
    key: 'sort',
    value: function sort(list) {
      if (!list) {
        list = this.localLog;
      }
      list.sort(function (a, b) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      return list;
    }
  }], [{
    key: 'instance',
    get: function get() {
      return this._instance;
    },
    set: function set(input) {
      this._instance = input;
    }
  }]);

  return LogRecorder;
}();

//---end file: BigLog/LogRecorder
//
//---start file: BigLog/BigLogView

/**
 * 大量紀錄 的View
 * 用於顯示 大量紀錄 資料夾, 以及顯示大量紀錄
 */


var BigLogView = function (_View3) {
  _inherits(BigLogView, _View3);

  /**
   * 建構 BigLogView
   * @param {String} name 資料夾的名稱
   */
  function BigLogView(name) {
    _classCallCheck(this, BigLogView);

    var _this24 = _possibleConstructorReturn(this, (BigLogView.__proto__ || Object.getPrototypeOf(BigLogView)).call(this, 'create BigLogView'));

    _this24.getDescriptionHtml = Template.displayLog.__helpers[' getDescriptionHtml'];
    _this24.name = String(name);
    return _this24;
  }

  _createClass(BigLogView, [{
    key: 'showBigLogFolder',
    value: function showBigLogFolder() {
      var _this25 = this;

      var intoObject = $('div[class=\'row border-grid-body mt-2\']');
      var intoObject2 = $('div[class=\'row border-grid-body\']');
      if (intoObject.length > 0 || intoObject2.length > 0) {
        var tmpInto = $('div[class=\'col-12 border-grid\'][name=' + this.name + ']');
        if (tmpInto.length < 1) {
          this.displayBigLogFolder();
        }
      } else {
        setTimeout(function () {
          _this25.showBigLogFolder();
        }, 10);
      }
    }
  }, {
    key: 'displayBigLogFolder',
    value: function displayBigLogFolder() {
      var intoObject = $('div[class=\'row border-grid-body mt-2\']').length > 0 ? $('div[class=\'row border-grid-body mt-2\']').first() : $('div[class=\'row border-grid-body\']').first();
      var appendDiv = '<div class=\'col-12 border-grid\' name=' + this.name + '></div>';
      intoObject.append(appendDiv);
      var tmpInto = $('div[class=\'col-12 border-grid\'][name=' + this.name + ']')[0];
      Blaze.renderWithData(Template.panelFolder, { name: this.name, title: '' + translation(['script', 'bigLog']) }, tmpInto);
    }

    /**
     * 顯示大量紀錄
     * @param {Array} localLog 要顯示的紀錄列表
     * @return {void}
     */

  }, {
    key: 'displayBigLog',
    value: function displayBigLog(localLog) {
      var intoObject = $('a[data-key=' + FlowRouter.getRouteName() + '_' + this.name + ']').closest('div[class=\'col-12\']').next('div[class=\'col-12\']').first();
      var _iteratorNormalCompletion26 = true;
      var _didIteratorError26 = false;
      var _iteratorError26 = undefined;

      try {
        for (var _iterator26 = localLog[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
          var log = _step26.value;

          var displayObject = '\n        <div class=\'logData\' style=\'word-break: break-all;\'>\n          <span class=\'text-info\'>(' + formatDateTimeText(log.createdAt) + ')</span>\n          ' + this.getDescriptionHtml(log) + '\n        </div>\n      ';
          intoObject.append(displayObject);
        }
      } catch (err) {
        _didIteratorError26 = true;
        _iteratorError26 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion26 && _iterator26.return) {
            _iterator26.return();
          }
        } finally {
          if (_didIteratorError26) {
            throw _iteratorError26;
          }
        }
      }

      this.displayLogDetailInfo(intoObject);
    }
  }, {
    key: 'displayLogDetailInfo',
    value: function displayLogDetailInfo(intoObject) {
      // 由於試了幾次實在沒辦法直接從伺服器抓出來
      // 本段直接複製自股市Github
      // /client/utils/displayLog.js
      intoObject.find('[data-user-link]').each(function (_, elem) {
        var $link = $(elem);
        var userId = $link.attr('data-user-link');

        // TODO write a helper
        if (userId === '!system') {
          $link.text('系統');
        } else if (userId === '!FSC') {
          $link.text('金管會');
        } else {
          $.ajax({
            url: '/userInfo',
            data: { id: userId },
            dataType: 'json',
            success: function success(_ref) {
              var userName = _ref.name,
                  status = _ref.status;

              if (status === 'registered') {
                var path = FlowRouter.path('accountInfo', { userId: userId });
                $link.html('<a href=\'' + path + '\'>' + userName + '</a>');
              } else {
                $link.text(userName);
              }
            }
          });
        }
      });

      intoObject.find('[data-company-link]').each(function (_, elem) {
        var $link = $(elem);
        var companyId = $link.attr('data-company-link');
        $.ajax({
          url: '/companyInfo',
          data: { id: companyId },
          dataType: 'json',
          success: function success(_ref2) {
            var companyName = _ref2.companyName,
                status = _ref2.status;

            var path = void 0;
            // TODO write a helper
            switch (status) {
              case 'foundation':
                {
                  path = FlowRouter.path('foundationDetail', { foundationId: companyId });
                  break;
                }
              case 'market':
                {
                  path = FlowRouter.path('companyDetail', { companyId: companyId });
                  break;
                }
            }
            $link.html('<a href=\'' + path + '\'>' + companyName + '</a>');
          }
        });
      });

      intoObject.find('[data-product-link]').each(function (_, elem) {
        var $link = $(elem);
        var productId = $link.attr('data-product-link');
        $.ajax({
          url: '/productInfo',
          data: { id: productId },
          dataType: 'json',
          success: function success(_ref3) {
            var url = _ref3.url,
                productName = _ref3.productName;

            $link.html('<a href=\'' + url + '\' target=\'_blank\'>' + productName + '</a>');
          }
        });
      });
    }
  }]);

  return BigLogView;
}(View);

//---end file: BigLog/BigLogView
//

/**
 * CompanyDetail的Controller
 */


var CompanyDetailController = function (_EventController2) {
  _inherits(CompanyDetailController, _EventController2);

  /**
   * 建構 CompanyDetailController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  function CompanyDetailController(loginUser) {
    _classCallCheck(this, CompanyDetailController);

    var _this26 = _possibleConstructorReturn(this, (CompanyDetailController.__proto__ || Object.getPrototypeOf(CompanyDetailController)).call(this, 'CompanyDetailController', loginUser));

    _this26.logRecorder = new LogRecorder();
    _this26.bigLogView = new BigLogView('companyBigLog');

    _this26.whoFirst = null;
    _this26.loaded = null;
    _this26.templateListener(Template.companyDetail, 'Template.companyDetail', function () {
      _this26.useCompaniesInfo();
    });
    _this26.templateListener(Template.companyDetailNormalContent, 'Template.companyDetailNormalContent', function () {
      _this26.useEmployeesInfo();
    });
    _this26.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', function () {
      _this26.useUserOwnedProductsInfo();
    });
    _this26.templateListener(Template.companyLogList, 'Template.companyLogList', function () {
      _this26.useLogInfo();
    });

    Template.companyDetailTable.onRendered(function () {
      _this26.bigLogView.showBigLogFolder();
    });
    _this26.panelFolderListener('companyDetail_companyBigLog', function () {
      var state = $('a[data-key=\'companyDetail_companyBigLog\']').find('i[class=\'fa fa-folder-open\']');
      if (state.length > 0) {
        var detailId = FlowRouter.getParam('companyId');
        var localLog = _this26.logRecorder.find('companyId', detailId);
        localLog = _this26.logRecorder.sort(localLog);
        _this26.bigLogView.displayBigLog(localLog);
      }
    });
    return _this26;
  }

  _createClass(CompanyDetailController, [{
    key: 'useCompaniesInfo',
    value: function useCompaniesInfo() {
      console.log('start useCompaniesInfo()');

      this.companies = new Companies();
      this.companies.companyPatch();

      var detailId = FlowRouter.getParam('companyId');
      if (this.whoFirst === 'employees' && this.loaded === detailId) {
        //這個比較慢執行，employees資料已經載入完成了
        this.companies.updateEmployeesInfo();
        this.companies.updateToLocalstorage();
        this.whoFirst = null;
        this.loaded = null;
      } else {
        this.whoFirst = 'companies';
        this.loaded = detailId;
      }

      console.log('end useCompaniesInfo()');
    }
  }, {
    key: 'useEmployeesInfo',
    value: function useEmployeesInfo() {
      console.log('start useEmployeesInfo');

      var detailId = FlowRouter.getParam('companyId');
      if (this.whoFirst === 'companies' && this.loaded === detailId) {
        //這個比較慢執行，companies已經建好了
        this.companies.updateEmployeesInfo();
        this.companies.updateToLocalstorage();
        this.whoFirst = null;
        this.loaded = null;
      } else {
        this.whoFirst = 'employees';
        this.loaded = detailId;
      }

      console.log('end useEmployeesInfo()');
    }
  }, {
    key: 'useUserOwnedProductsInfo',
    value: function useUserOwnedProductsInfo() {
      this.loginUser.updateProducts();
    }
  }, {
    key: 'useLogInfo',
    value: function useLogInfo() {
      this.logRecorder.recordServerLog();
    }
  }]);

  return CompanyDetailController;
}(EventController);

//--end file: CompanyDetailPage/CompanyDetailController
//
//--start file: AccountInfoPage/AccountInfoController
//---start file: AccountInfoPage/AccountInfoView

/**
 * AccountInfo的View
 */


var AccountInfoView = function (_View4) {
  _inherits(AccountInfoView, _View4);

  function AccountInfoView() {
    _classCallCheck(this, AccountInfoView);

    var _this27 = _possibleConstructorReturn(this, (AccountInfoView.__proto__ || Object.getPrototypeOf(AccountInfoView)).call(this, 'AccountInfoView'));

    _this27.resetDisplayList();
    return _this27;
  }

  _createClass(AccountInfoView, [{
    key: 'resetDisplayList',
    value: function resetDisplayList() {
      this.displayList = {
        companyNumber: false,
        stocksAsset: false,
        sellOrders: false,
        buyOrders: false,
        hrStocks: false, //分隔線
        stocksProfit: false,
        managersProfit: false,
        employeeBonus: false,
        votingReward: false,
        hrProfit: false, //分隔線
        stockTax: false,
        moneyTax: false
      };
    }

    /**
     * 將上方資訊列全部移除, 並顯示上方資訊列間的分隔線
     * @return {void}
     */

  }, {
    key: 'displayHrLine',
    value: function displayHrLine() {
      if ($('hr[name=\'stocksLine\']').length < 1 && $('hr[name=\'profitLine\']').length < 1) {
        $('div[name=\'companyNumber\']').remove();
        $('div[name=\'stocksAsset\']').remove();
        $('div[name=\'sellOrders\']').remove();
        $('div[name=\'buyOrders\']').remove();

        $('div[name=\'stocksProfit\']').remove();
        $('div[name=\'managersProfit\']').remove();
        $('div[name=\'employeeBonus\']').remove();
        $('div[name=\'votingReward\']').remove();

        $('div[name=\'stockTax\']').remove();
        $('div[name=\'moneyTax\']').remove();

        this.resetDisplayList();
      }

      if ($('hr[name=\'stocksLine\']').length < 1) {
        var stocksLine = $('<hr name=\'stocksLine\' />');
        var afterObject = $('h1[class=\'card-title\']')[0];
        stocksLine.insertAfter(afterObject);
        this.displayList.hrStocks = stocksLine;
      }

      if ($('hr[name=\'profitLine\']').length < 1) {
        var profitLine = $('<hr name=\'profitLine\' />');
        var _afterObject = this.displayList.hrStocks || $('h1[class=\'card-title\']')[0];
        profitLine.insertAfter(_afterObject);
        this.displayList.hrProfit = profitLine;
      }
    }
  }, {
    key: 'displayCompanyNumber',
    value: function displayCompanyNumber(companyNumber) {
      var displayObject = this.createH2Info({
        name: 'companyNumber',
        leftText: translation(['accountInfo', 'holdingStockCompaniesNumber']),
        rightText: '' + companyNumber
      });

      $('div[name=\'companyNumber\']').remove();
      var afterObject = $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.companyNumber = displayObject;
    }
  }, {
    key: 'displayStocksAsset',
    value: function displayStocksAsset(stocksAsset) {
      var displayObject = this.createH2Info({
        name: 'stocksAsset',
        leftText: translation(['accountInfo', 'stocksAsset']),
        rightText: '$ ' + stocksAsset
      });

      $('div[name=\'stocksAsset\']').remove();
      var afterObject = this.displayList.companyNumber || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.stocksAsset = displayObject;
    }
  }, {
    key: 'displaySellOrders',
    value: function displaySellOrders(sellOrders) {
      var displayObject = this.createH2Info({
        name: 'sellOrders',
        leftText: translation(['accountInfo', 'usedInSellOrdersStocksAsset']),
        rightText: '$ ' + sellOrders
      });

      $('div[name=\'sellOrders\']').remove();
      var afterObject = this.displayList.stocksAsset || this.displayList.companyNumber || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.sellOrders = displayObject;
    }
  }, {
    key: 'displayBuyOrders',
    value: function displayBuyOrders(buyOrders) {
      var displayObject = this.createH2Info({
        name: 'buyOrders',
        leftText: translation(['accountInfo', 'usedInBuyOrdersMoney']),
        rightText: '$ ' + buyOrders
      });

      $('div[name=\'buyOrders\']').remove();
      var afterObject = this.displayList.sellOrders || this.displayList.stocksAsset || this.displayList.companyNumber || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.buyOrders = displayObject;
    }
  }, {
    key: 'displayStocksProfit',
    value: function displayStocksProfit(stocksProfit) {
      var displayObject = this.createH2Info({
        name: 'stocksProfit',
        leftText: translation(['accountInfo', 'estimatedStockProfit']),
        rightText: '$ ' + stocksProfit
      });

      $('div[name=\'stocksProfit\']').remove();
      var afterObject = this.displayList.hrStocks || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.stocksProfit = displayObject;
    }
  }, {
    key: 'displayManagersProfit',
    value: function displayManagersProfit(managersProfit) {
      var displayObject = this.createH2Info({
        name: 'managersProfit',
        leftText: translation(['accountInfo', 'estimatedManagerProfit']),
        rightText: '$ ' + managersProfit
      });

      $('div[name=\'managersProfit\']').remove();
      var afterObject = this.displayList.stocksProfit || this.displayList.hrStocks || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.managersProfit = displayObject;
    }
  }, {
    key: 'displayEmployeeBonus',
    value: function displayEmployeeBonus(employeeBonus) {
      var displayObject = this.createH2Info({
        name: 'employeeBonus',
        leftText: translation(['accountInfo', 'estimatedEmployeeBonus']),
        rightText: '$ ' + employeeBonus
      });

      $('div[name=\'employeeBonus\']').remove();
      var afterObject = this.displayList.managersProfit || this.displayList.stocksProfit || this.displayList.hrStocks || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.employeeBonus = displayObject;
    }
  }, {
    key: 'displayVotingReward',
    value: function displayVotingReward(votingReward) {
      var displayObject = this.createH2Info({
        name: 'votingReward',
        leftText: translation(['accountInfo', 'estimatedProductVotingRewards']),
        rightText: '$ ' + votingReward
      });

      $('div[name=\'votingReward\']').remove();
      var afterObject = this.displayList.employeeBonus || this.displayList.managersProfit || this.displayList.stocksProfit || this.displayList.hrStocks || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.votingReward = displayObject;
    }
  }, {
    key: 'displayStockTax',
    value: function displayStockTax(stockTax) {
      var displayObject = this.createH2Info({
        name: 'stockTax',
        leftText: translation(['accountInfo', 'estimatedStockTax']),
        rightText: '$ ' + stockTax
      });

      $('div[name=\'stockTax\']').remove();
      var afterObject = this.displayList.hrProfit || this.displayList.hrStocks || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.stockTax = displayObject;
    }
  }, {
    key: 'displayMoneyTax',
    value: function displayMoneyTax(moneyTax) {
      var displayObject = this.createH2Info({
        name: 'moneyTax',
        leftText: translation(['accountInfo', 'estimatedMoneyTax']),
        rightText: '$ ' + moneyTax
      });

      $('div[name=\'moneyTax\']').remove();
      var afterObject = this.displayList.hrProfit || this.displayList.hrStocks || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.moneyTax = displayObject;
    }
  }, {
    key: 'displayHoldStocksTableFolder',
    value: function displayHoldStocksTableFolder() {
      var intoObject = $('div[class=\'row border-grid-body\']').first();
      var appendDiv = '<div class=\'col-12 border-grid\' name=\'holdStocksTable\'></div>';
      intoObject.append(appendDiv);
      var tmpInto = $('div[class=\'col-12 border-grid\'][name=\'holdStocksTable\']')[0];
      Blaze.renderWithData(Template.panelFolder, { name: 'holdStocksTable', title: '' + translation(['accountInfo', 'holdStocksTable']) }, tmpInto);
    }
  }, {
    key: 'displayHoldStocksTable',
    value: function displayHoldStocksTable(tableInfo) {
      var oldTable = $('table[name=\'holdStocksTable\']');
      oldTable.remove();
      //雖然通常來說 oldTable 應該不存在，不過...

      var tHead = tableInfo.tHead || [];
      var tBody = tableInfo.tBody || [];

      var intoObject = $('a[data-key=\'accountInfo_holdStocksTable\']').closest('div[class=\'col-12\']').next('div[class=\'col-12\']').first();
      var displayObject = this.createTable({
        name: 'holdStocksTable',
        tHead: tHead,
        tBody: tBody,
        customSetting: { tBody: 'style=\'min-width: 75px; max-width: 390px;\'' },
        textOnly: true
      });
      intoObject.append(displayObject);
    }
  }]);

  return AccountInfoView;
}(View);

//---end file: AccountInfoPage/AccountInfoView
//

/**
 * AccountInfo的Controller
 */


var AccountInfoController = function (_EventController3) {
  _inherits(AccountInfoController, _EventController3);

  /**
   * 建構 AccountInfoController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  function AccountInfoController(loginUser) {
    _classCallCheck(this, AccountInfoController);

    var _this28 = _possibleConstructorReturn(this, (AccountInfoController.__proto__ || Object.getPrototypeOf(AccountInfoController)).call(this, 'AccountInfoController', loginUser));

    _this28.accountInfoView = new AccountInfoView();
    _this28.logRecorder = new LogRecorder();
    _this28.bigLogView = new BigLogView('accountBigLog');

    _this28.user = null;
    _this28.userId = null;
    _this28.waitList = [];

    _this28.templateListener(Template.accountInfo, 'Template.accountInfo', function () {
      _this28.usersEvent();
    });
    _this28.templateListener(Template.managerTitleList, 'Template.managerTitleList', function () {
      _this28.managersEvent();
    });
    _this28.templateListener(Template.vipTitleList, 'Template.vipTitleList', function () {
      _this28.vipsEvent();
    });
    _this28.templateListener(Template.accountInfoOwnStockList, 'Template.accountInfoOwnStockList', function () {
      _this28.ownStocksEvent();
    });
    _this28.templateListener(Template.accountInfoOwnedProductsPanel, 'Template.accountInfoOwnedProductsPanel', function () {
      _this28.ownProductsEvent();
    });
    _this28.templateListener(Template.accountInfoLogList, 'Template.accountInfoLogList', function () {
      _this28.logEvent();
    });

    Template.accountInfoBasic.onRendered(function () {
      //理論上監聽 accountInfoBasic 不太對，應該監聽 accountInfo
      //不過在切到別的帳號時不會觸發 accountInfo ，倒是一定會觸發 accountInfoBasic
      _this28.showHoldStocksTableFolder();
      _this28.bigLogView.showBigLogFolder();
    });
    _this28.panelFolderListener('accountInfo_holdStocksTable', function () {
      var state = $('a[data-key=\'accountInfo_holdStocksTable\']').find('i[class=\'fa fa-folder-open\']');
      if (state.length > 0) {
        _this28.accountInfoView.displayHoldStocksTable(_this28.holdStocksTableInfo());
      }
    });
    _this28.panelFolderListener('accountInfo_accountBigLog', function () {
      var state = $('a[data-key=\'accountInfo_accountBigLog\']').find('i[class=\'fa fa-folder-open\']');
      if (state.length > 0) {
        var userId = FlowRouter.getParam('userId');
        var localLog = _this28.logRecorder.filter(function (x) {
          if (x.userId) {
            var _iteratorNormalCompletion27 = true;
            var _didIteratorError27 = false;
            var _iteratorError27 = undefined;

            try {
              for (var _iterator27 = x.userId[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
                var user = _step27.value;

                if (user === userId) {
                  return true;
                }
              }
            } catch (err) {
              _didIteratorError27 = true;
              _iteratorError27 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion27 && _iterator27.return) {
                  _iterator27.return();
                }
              } finally {
                if (_didIteratorError27) {
                  throw _iteratorError27;
                }
              }
            }
          }

          return false;
        });
        localLog = _this28.logRecorder.sort(localLog);
        _this28.bigLogView.displayBigLog(localLog);
      }
    });
    return _this28;
  }

  _createClass(AccountInfoController, [{
    key: 'usersEvent',
    value: function usersEvent() {
      console.log('start usersEvent()');

      this.userId = FlowRouter.getParam('userId');
      if (this.userId === undefined) {
        return;
      }

      if (this.userId === this.loginUser.userId) {
        this.user = this.loginUser;
      } else {
        this.user = new User(this.userId);
      }
      this.user.loadFromSessionstorage();
      this.user.updateUser();
      this.user.updateEmployee();

      //顯示資訊
      this.accountInfoView.displayHrLine();

      this.accountInfoView.displayCompanyNumber(this.user.computeCompanyNumber());
      this.accountInfoView.displayStocksAsset(this.user.computeAsset());
      if (this.user.userId === this.loginUser.userId) {
        this.accountInfoView.displaySellOrders(this.user.computeSellOrdersAsset());
        this.accountInfoView.displayBuyOrders(this.user.computeBuyOrdersMoney());
      }

      this.accountInfoView.displayStocksProfit(this.user.computeProfit());
      this.accountInfoView.displayManagersProfit(this.user.computeManagersProfit());
      this.accountInfoView.displayEmployeeBonus(this.user.computeEmployeeBonus());
      this.accountInfoView.displayVotingReward(this.user.computeProductVotingRewards());

      this.accountInfoView.displayStockTax(this.user.computeStockTax());
      this.accountInfoView.displayMoneyTax(this.user.computeMoneyTax());

      //如果有在user資訊載好前就載入的其他資訊，會被丟進等待清單
      //以for迴圈完成清單內的任務
      var _iteratorNormalCompletion28 = true;
      var _didIteratorError28 = false;
      var _iteratorError28 = undefined;

      try {
        for (var _iterator28 = this.waitList[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
          var task = _step28.value;

          if (task.userId === this.userId) {
            task.callback();
          }
        }
      } catch (err) {
        _didIteratorError28 = true;
        _iteratorError28 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion28 && _iterator28.return) {
            _iterator28.return();
          }
        } finally {
          if (_didIteratorError28) {
            throw _iteratorError28;
          }
        }
      }

      this.waitList = [];

      console.log('end usersEvent()');
    }
  }, {
    key: 'managersEvent',
    value: function managersEvent() {
      console.log('start managersEvent()');

      var pageId = FlowRouter.getParam('userId');
      if (pageId === undefined) {
        return;
      }
      if (this.userId === pageId) {
        this.user.updateManagers();

        //顯示資訊
        this.accountInfoView.displayHrLine();
        this.accountInfoView.displayManagersProfit(this.user.computeManagersProfit());
        this.accountInfoView.displayMoneyTax(this.user.computeMoneyTax());
      } else {
        this.waitList.push({
          userId: pageId,
          callback: this.managersEvent
        });
      }

      console.log('end managersEvent()');
    }
  }, {
    key: 'vipsEvent',
    value: function vipsEvent() {
      console.log('start vipsEvent()');

      var pageId = FlowRouter.getParam('userId');
      if (pageId === undefined) {
        return;
      }
      if (this.userId === pageId) {
        this.user.updateVips();

        //顯示資訊
        this.accountInfoView.displayHrLine();
        this.accountInfoView.displayStocksProfit(this.user.computeProfit());
        this.accountInfoView.displayMoneyTax(this.user.computeMoneyTax());
      } else {
        this.waitList.push({
          userId: pageId,
          callback: this.vipsEvent
        });
      }

      console.log('end vipsEvent()');
    }
  }, {
    key: 'ownStocksEvent',
    value: function ownStocksEvent() {
      console.log('start ownStocksEvent()');

      var pageId = FlowRouter.getParam('userId');
      if (pageId === undefined) {
        return;
      }
      if (this.userId === pageId) {
        this.user.updateHoldStocks();

        //顯示資訊
        this.accountInfoView.displayHrLine();
        this.accountInfoView.displayCompanyNumber(this.user.computeCompanyNumber());
        this.accountInfoView.displayStocksAsset(this.user.computeAsset());
        this.accountInfoView.displayStocksProfit(this.user.computeProfit());
        this.accountInfoView.displayStockTax(this.user.computeStockTax());
        this.accountInfoView.displayMoneyTax(this.user.computeMoneyTax());
      } else {
        this.waitList.push({
          userId: pageId,
          callback: this.ownStocksEvent
        });
      }

      console.log('end ownStocksEvent()');
    }
  }, {
    key: 'ownProductsEvent',
    value: function ownProductsEvent() {
      var pageId = FlowRouter.getParam('userId');
      if (pageId === undefined) {
        return;
      }
      if (this.userId === pageId) {
        if (this.user.userId === this.loginUser.userId) {
          this.loginUser.updateProducts();
        }
      } else {
        this.waitList.push({
          userId: pageId,
          callback: this.ownProductsEvent
        });
      }
    }
  }, {
    key: 'logEvent',
    value: function logEvent() {
      this.logRecorder.recordServerLog();
    }
  }, {
    key: 'showHoldStocksTableFolder',
    value: function showHoldStocksTableFolder() {
      var _this29 = this;

      var intoObject = $('div[class=\'row border-grid-body\']');
      if (intoObject.length > 0) {
        var tmpInto = $('div[class=\'col-12 border-grid\'][name=\'holdStocksTable\']');
        if (tmpInto.length < 1) {
          this.accountInfoView.displayHoldStocksTableFolder();
        }
      } else {
        //不知為何，都用 onRendered 了，結果觸發時還是沒有創建...
        setTimeout(function () {
          _this29.showHoldStocksTableFolder();
        }, 10);
      }
    }
  }, {
    key: 'holdStocksTableInfo',
    value: function holdStocksTableInfo() {
      var tHead = [translation(['company', 'name']), translation(['company', 'price']), translation(['company', 'profit']), translation(['company', 'capital']), translation(['accountInfo', 'holdStocks']), translation(['accountInfo', 'holdPercentage']), translation(['accountInfo', 'stockAsset']), translation(['accountInfo', 'estimatedProfit']), translation(['accountInfo', 'vipLevel'])];
      var tBody = [];

      var holdStocks = JSON.parse(JSON.stringify(this.user.holdStocks));
      if (this.user === this.loginUser) {
        var _loop12 = function _loop12(order) {
          var i = holdStocks.findIndex(function (x) {
            return x.companyId === order.companyId;
          });
          if (i !== -1) {
            holdStocks[i].stocks += order.amount - order.done;
          } else {
            holdStocks.push({ companyId: order.companyId, stocks: order.amount - order.done, vip: null });
          }
        };

        var _iteratorNormalCompletion29 = true;
        var _didIteratorError29 = false;
        var _iteratorError29 = undefined;

        try {
          for (var _iterator29 = this.loginUser.sellOrders[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
            var order = _step29.value;

            _loop12(order);
          }
        } catch (err) {
          _didIteratorError29 = true;
          _iteratorError29 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion29 && _iterator29.return) {
              _iterator29.return();
            }
          } finally {
            if (_didIteratorError29) {
              throw _iteratorError29;
            }
          }
        }
      }
      var localCompanies = getLocalCompanies();
      var notFoundList = [];

      var _loop13 = function _loop13(holdC) {
        var companyData = localCompanies.find(function (x) {
          return x.companyId === holdC.companyId;
        });
        if (companyData !== undefined) {
          var row = [];
          row.push('<a href=\'/company/detail/' + companyData.companyId + '\'>' + companyData.name + '</a>');
          row.push(companyData.price);
          row.push(Math.ceil(companyData.profit));
          row.push(companyData.capital);
          row.push(holdC.stocks);
          row.push((holdC.stocks / companyData.release * 100).toFixed(2) + '%');
          row.push(companyData.price * holdC.stocks);
          row.push(Math.ceil(earnPerShare(companyData) * effectiveStocks(holdC.stocks, holdC.vip)));
          var vipLevel = holdC.vip !== null ? holdC.vip : 'x';
          row.push(vipLevel);

          tBody.push(row);
        } else {
          notFoundList.push(holdC);
        }
      };

      var _iteratorNormalCompletion30 = true;
      var _didIteratorError30 = false;
      var _iteratorError30 = undefined;

      try {
        for (var _iterator30 = holdStocks[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
          var holdC = _step30.value;

          _loop13(holdC);
        }

        //未被找到的公司統一放在最後
      } catch (err) {
        _didIteratorError30 = true;
        _iteratorError30 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion30 && _iterator30.return) {
            _iterator30.return();
          }
        } finally {
          if (_didIteratorError30) {
            throw _iteratorError30;
          }
        }
      }

      var _iteratorNormalCompletion31 = true;
      var _didIteratorError31 = false;
      var _iteratorError31 = undefined;

      try {
        for (var _iterator31 = notFoundList[Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
          var holdC = _step31.value;

          var row = [];
          row.push('<a href=\'/company/detail/' + holdC.companyId + '\'>' + translation(['accountInfo', 'notFoundCompany']) + '</a>');
          row.push('???');
          row.push('???');
          row.push('???');
          row.push(holdC.stocks);
          row.push('???');
          row.push('???');
          row.push('???');
          var vipLevel = holdC.vip !== null ? holdC.vip : 'x';
          row.push(vipLevel);

          tBody.push(row);
        }
      } catch (err) {
        _didIteratorError31 = true;
        _iteratorError31 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion31 && _iterator31.return) {
            _iterator31.return();
          }
        } finally {
          if (_didIteratorError31) {
            throw _iteratorError31;
          }
        }
      }

      return { tHead: tHead, tBody: tBody };
    }
  }]);

  return AccountInfoController;
}(EventController);

//--end file: AccountInfoPage/AccountInfoController
//
//--start file: ScriptVipPage/ScriptVipController
//---start file: functions/stripscript
/**
 * 過濾字串
 * @param {String} s 被過濾的字串
 * @return {String} 過濾完的字串
 */


function stripscript(s) {
  var pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~\uFF01@#\uFFE5\u2026\u2026&*\uFF08\uFF09\u2014\u2014|{}\u3010\u3011\u2018\uFF1B\uFF1A\u201D\u201C\'\u3002\uFF0C\u3001\uFF1F]');
  var rs = '';
  for (var _i = 0; _i < s.length; _i += 1) {
    rs = rs + s.substr(_i, 1).replace(pattern, '');
  }

  return rs;
}

//---end file: functions/stripscript
//
//---start file: ScriptVipPage/ScriptVipView

/**
 * ScriptVip頁面的View
 */

var ScriptVipView = function (_View5) {
  _inherits(ScriptVipView, _View5);

  /**
   * 建構 ScriptVipView
   * @param {EventController} controller 控制View的Controller
   */
  function ScriptVipView(controller) {
    _classCallCheck(this, ScriptVipView);

    var _this30 = _possibleConstructorReturn(this, (ScriptVipView.__proto__ || Object.getPrototypeOf(ScriptVipView)).call(this, 'ScriptVipView'));

    _this30.controller = controller;

    var tmpVip = new Blaze.Template('Template.softwareScriptVip', function () {
      // eslint-disable-next-line new-cap
      var page = HTML.Raw('\n        <div class=\'card\' name=\'vip\'>\n          <div class=\'card-block\' name=\'Vip\'>\n            <div class=\'col-5\'>\n              <h1 class=\'card-title mb-1\'>SoftwareScript</h1>\n              <h1 class=\'card-title mb-1\'>  VIP\u529F\u80FD</h1>\n            </div>\n            <div class=\'col-5\'>\u60A8\u662F\u6211\u7684\u6069\u5BA2\u55CE?</div>\n            <div class=\'col-12\'>\n              <hr>\n              <h2 name=\'becomeVip\'>\u6210\u70BAVIP</h2>\n              <hr>\n              <h2 name=\'searchTables\'>\u8CC7\u6599\u641C\u5C0B</h2>\n              <hr>\n              <p>\u5982VIP\u529F\u80FD\u767C\u751F\u554F\u984C\uFF0C\u8ACB\u81F3Discord\u80A1\u5E02\u7FA4\u806F\u7D61SoftwareSing</p>\n            </div>\n          </div>\n        </div>\n      ');

      return page;
    });
    Template.softwareScriptVip = tmpVip;
    return _this30;
  }

  /**
   * 顯示外掛VIP資訊
   * @param {LoginUser} loginUser 登入中的使用者
   * @return {void}
   */


  _createClass(ScriptVipView, [{
    key: 'displayScriptVipProducts',
    value: function displayScriptVipProducts(loginUser) {
      console.log('start displayScriptVipProducts()');

      var localScriptVipProductsUpdateTime = JSON.parse(window.localStorage.getItem('localScriptVipProductsUpdateTime')) || 'null';
      var userVIP = loginUser.vipLevel();
      var info = $('\n      <p>VIP\u689D\u4EF6\u66F4\u65B0\u6642\u9593: ' + localScriptVipProductsUpdateTime + '</p>\n      <p>\u60A8\u76EE\u524D\u7684VIP\u72C0\u614B: \u7B49\u7D1A ' + userVIP + '</p>\n      <p>VIP\u6B0A\u9650: </P>\n      <ul name=\'vipCanDo\'>\n        <li>\u4F7F\u7528\u8CC7\u6599\u641C\u5C0B\u529F\u80FD</li>\n      </ul>\n      <p>\n        VIP\u9EDE\u6578\u9054390\u5373\u53EF\u4F7F\u7528VIP\u529F\u80FD <br />\n        \u70BA\u7372\u5F97\u9EDE\u6578\u53EF\u4EE5\u8CFC\u8CB7\u4EE5\u4E0B\u5546\u54C1\n      </p>\n      <div name=\'scriptVipProducts\' id=\'productList\'>\n      </div>\n    ');
      info.insertAfter($('h2[name=\'becomeVip\']')[0]);

      var productList = [];
      var localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
      var userProducts = localScriptVipProducts.find(function (x) {
        return x.userId === loginUser.userId;
      });
      if (userProducts === undefined) {
        userProducts = localScriptVipProducts.find(function (x) {
          return x.userId === 'default';
        });
      }
      var _iteratorNormalCompletion32 = true;
      var _didIteratorError32 = false;
      var _iteratorError32 = undefined;

      try {
        for (var _iterator32 = userProducts.products[Symbol.iterator](), _step32; !(_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done); _iteratorNormalCompletion32 = true) {
          var p = _step32.value;

          var description = '<a companyId=\'' + p.companyId + '\' href=\'/company/detail/' + p.companyId + '\'>' + p.description + '</a>';
          var out = [description, p.point, p.amount];
          productList.push(out);
        }
      } catch (err) {
        _didIteratorError32 = true;
        _iteratorError32 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion32 && _iterator32.return) {
            _iterator32.return();
          }
        } finally {
          if (_didIteratorError32) {
            throw _iteratorError32;
          }
        }
      }

      var tableObject = this.createTable({
        name: 'scriptVipProducts',
        tHead: ['產品', '點數/個', '持有量'],
        tBody: productList
      });
      tableObject.insertAfter($('div[name=\'scriptVipProducts\'][id=\'productList\']')[0]);

      console.log('end displayScriptVipProducts()');
    }

    /**
     * 顯示SearchTables資訊
     * @param {LoginUser} loginUser 登入中的使用者
     * @return {void}
     */

  }, {
    key: 'displaySearchTables',
    value: function displaySearchTables(loginUser) {
      var _this31 = this;

      console.log('start displaySearchTables()');

      var localCompaniesUpdateTime = JSON.parse(window.localStorage.getItem('localCompaniesUpdateTime')) || 'null';
      var info = $('\n      <p>\n        VIP\u53EF\u4EE5\u7528\u6B64\u529F\u80FD\u641C\u5C0B\u516C\u53F8\u8CC7\u6599<br />\n        \u516C\u53F8\u8CC7\u6599\u70BA \u5F9E\u96F2\u7AEF\u540C\u6B65 \u6216 \u65BC\u700F\u89BD\u80A1\u5E02\u6642\u81EA\u52D5\u66F4\u65B0\uFF0C\u56E0\u6B64\u53EF\u80FD\u8207\u6700\u65B0\u8CC7\u6599\u6709\u6240\u843D\u5DEE<br />\n        \u76EE\u524D\u7684\u96F2\u7AEF\u8CC7\u6599\u66F4\u65B0\u6642\u9593: ' + localCompaniesUpdateTime + '<br />\n        &nbsp;(\u6BCF\u6B21\u91CD\u65B0\u8F09\u5165\u80A1\u5E02\u6642\uFF0C\u6703\u78BA\u8A8D\u96F2\u7AEF\u662F\u5426\u6709\u66F4\u65B0\u8CC7\u6599)\n      </p>\n      <p>&nbsp;</p>\n      <p>\u5404\u9805\u6578\u503C\u540D\u7A31\u5C0D\u7167\u8868(\u4E0D\u5728\u8868\u4E2D\u7684\u6578\u503C\u7121\u6CD5\u4F7F\u7528)\uFF1A\n        <table border=\'1\' name=\'valueNameTable\'>\n          <tr name=\'companyID\'> <td>\u516C\u53F8ID</td> <td>ID</td> </tr>\n          <tr name=\'name\'> <td>\u516C\u53F8\u540D\u7A31</td> <td>name</td> </tr>\n          <tr name=\'chairman\'> <td>\u8463\u4E8B\u9577ID</td> <td>chairman</td> </tr>\n          <tr name=\'manager\'> <td>\u7D93\u7406\u4EBAID</td> <td>manager</td> </tr>\n\n          <tr name=\'grade\'> <td>\u516C\u53F8\u8A55\u7D1A</td> <td>grade</td> </tr>\n          <tr name=\'capital\'> <td>\u8CC7\u672C\u984D</td> <td>capital</td> </tr>\n          <tr name=\'price\'> <td>\u80A1\u50F9</td> <td>price</td> </tr>\n          <tr name=\'release\'> <td>\u7E3D\u91CB\u80A1\u91CF</td> <td>release</td> </tr>\n          <tr name=\'profit\'> <td>\u7E3D\u71DF\u6536</td> <td>profit</td> </tr>\n\n          <tr name=\'vipBonusStocks\'> <td>VIP\u52A0\u6210\u80A1\u6578</td> <td>vipBonusStocks</td> </tr>\n          <tr name=\'managerBonusRatePercent\'> <td>\u7D93\u7406\u5206\u7D05\u6BD4\u4F8B</td> <td>managerBonusRatePercent</td> </tr>\n          <tr name=\'capitalIncreaseRatePercent\'> <td>\u8CC7\u672C\u984D\u6CE8\u5165\u6BD4\u4F8B</td> <td>capitalIncreaseRatePercent</td> </tr>\n\n          <tr name=\'salary\'> <td>\u672C\u5B63\u54E1\u5DE5\u85AA\u6C34</td> <td>salary</td> </tr>\n          <tr name=\'nextSeasonSalary\'> <td>\u4E0B\u5B63\u54E1\u5DE5\u85AA\u6C34</td> <td>nextSeasonSalary</td> </tr>\n          <tr name=\'employeeBonusRatePercent\'> <td>\u54E1\u5DE5\u5206\u7D05%\u6578</td> <td>employeeBonusRatePercent</td> </tr>\n          <tr name=\'employeesNumber\'> <td>\u672C\u5B63\u54E1\u5DE5\u4EBA\u6578</td> <td>employeesNumber</td> </tr>\n          <tr name=\'nextSeasonEmployeesNumber\'> <td>\u4E0B\u5B63\u54E1\u5DE5\u4EBA\u6578</td> <td>nextSeasonEmployeesNumber</td> </tr>\n\n          <tr name=\'tags\'> <td>\u6A19\u7C64 tag (\u9663\u5217)</td> <td>tags</td> </tr>\n          <tr name=\'createdAt\'> <td>\u5275\u7ACB\u6642\u9593</td> <td>createdAt</td> </tr>\n        </table>\n      </p>\n      <p>\u5E38\u7528\u51FD\u5F0F\uFF1A\n        <table border=\'1\' name=\'valueNameTable\'>\n          <tr name=\'\u7B49\u65BC\'>\n            <td bgcolor=\'yellow\'>\u7B49\u65BC (\u8ACB\u75282\u62163\u500B\u7B49\u865F)</td>\n            <td bgcolor=\'yellow\'>==</td>\n          </tr>\n          <tr name=\'OR\'>\n            <td>x OR(\u6216) y</td>\n            <td>(x || y)</td>\n          </tr>\n          <tr name=\'AND\'>\n            <td>x AND y</td>\n            <td>(x && y)</td>\n          </tr>\n          <tr name=\'toFixed()\'>\n            <td>\u628Ax\u56DB\u6368\u4E94\u5165\u81F3\u5C0F\u6578\u9EDEy\u4F4D</td>\n            <td>x.toFixed(y)</td>\n          </tr>\n          <tr name=\'Math.ceil(price * 1.15)\'>\n            <td>\u8A08\u7B97\u6F32\u505C\u50F9\u683C</td>\n            <td>Math.ceil(price * 1.15)</td>\n          </tr>\n          <tr name=\'Math.ceil(price * 0.85)\'>\n            <td>\u8A08\u7B97\u8DCC\u505C\u50F9\u683C</td>\n            <td>Math.ceil(price * 0.85)</td>\n          </tr>\n          <tr name=\'\u672C\u76CA\u6BD4\'>\n            <td>\u672C\u76CA\u6BD4</td>\n            <td>(price * release) / profit</td>\n          </tr>\n          <tr name=\'\u76CA\u672C\u6BD4\'>\n            <td>\u76CA\u672C\u6BD4</td>\n            <td>profit / (price * release)</td>\n          </tr>\n          <tr name=\'\u5305\u542B\'>\n            <td>\u540D\u5B57\u4E2D\u5305\u542B \u8266\u3053\u308C \u7684\u516C\u53F8</td>\n            <td>(name.indexOf(\'\u8266\u3053\u308C\') > -1)</td>\n          </tr>\n        </table>\n      </p>\n      <p>&nbsp;</p>\n      <p> <a href=\'https://hackmd.io/s/SycGT5yIG\' target=\'_blank\'>\u8CC7\u6599\u641C\u5C0B\u7528\u6CD5\u6559\u5B78</a> </p>\n      <p>\n        <select class=\'form-control\' style=\'width: 300px;\' name=\'dataSearchList\'></select>\n        <button class=\'btn btn-info btn-sm\' name=\'createTable\'>\u5EFA\u7ACB\u65B0\u7684\u641C\u5C0B\u8868</button>\n        <button class=\'btn btn-danger btn-sm\' name=\'deleteTable\'>\u522A\u9664\u9019\u500B\u641C\u5C0B\u8868</button>\n        <button class=\'btn btn-danger btn-sm\' name=\'deleteAllTable\'>\u522A\u9664\u6240\u6709</button>\n      </p>\n      <p name=\'showTableName\'> \u8868\u683C\u540D\u7A31\uFF1A <span class=\'text-info\' name=\'tableName\'></span></p>\n      <p name=\'showTableFilter\'>\n        \u904E\u6FFE\u516C\u5F0F\uFF1A<input class=\'form-control\'\n          type=\'text\' name=\'tableFilter\'\n          placeholder=\'\u8ACB\u8F38\u5165\u904E\u6FFE\u516C\u5F0F\uFF0C\u5982: (price>1000)\'>\n        <button class=\'btn btn-info btn-sm\' name=\'addTableFilter\'>\u5132\u5B58\u904E\u6FFE\u516C\u5F0F</button>\n        <button class=\'btn btn-danger btn-sm\' name=\'deleteTableFilter\'>\u522A\u9664\u904E\u6FFE\u516C\u5F0F</button>\n      </p>\n      <p name=\'showTableSort\'>\n        \u6392\u5E8F\u4F9D\u64DA\uFF1A<input class=\'form-control\'\n          type=\'text\' name=\'tableSort\'\n          placeholder=\'\u8ACB\u8F38\u5165\u6392\u5E8F\u516C\u5F0F\uFF0C\u5982: (price)\uFF0C\u5C0F\u5230\u5927\u8ACB\u52A0\u8CA0\u865F: -(price)\'>\n        <button class=\'btn btn-info btn-sm\' name=\'addTableSort\'>\u5132\u5B58\u6392\u5E8F\u516C\u5F0F</button>\n        <button class=\'btn btn-danger btn-sm\' name=\'deleteTableSort\'>\u522A\u9664\u6392\u5E8F\u516C\u5F0F</button>\n      </p>\n      <p>&nbsp;</p>\n      <p name\'showTableColumn\'>\u8868\u683C\u6B04\u4F4D<br />\n        <button class=\'btn btn-info btn-sm\' name=\'addTableColumn\'>\u65B0\u589E\u6B04\u4F4D</button>\n        <table border=\'1\' name\'tableColumn\'>\n          <thead>\n            <th>\u540D\u7A31</th>\n            <th>\u516C\u5F0F</th>\n            <th>\u64CD\u4F5C</th>\n          </thead>\n          <tbody name=\'tableColumn\'>\n          </tbody>\n        </table>\n      </p>\n      <p>&nbsp;</p>\n      <p>\n        <button class=\'btn btn-info\' name=\'outputTable\'>\u8F38\u51FA\u7D50\u679C</button>\n        <button class=\'btn btn-warning\' name=\'clearOutputTable\'>\u6E05\u7A7A\u8F38\u51FA</button>\n      </p>\n      <p name=\'outputTable\'></p>\n      <p>&nbsp;</p>\n    ');
      info.insertAfter($('h2[name=\'searchTables\']')[0]);

      $('button[name=\'deleteAllTable\']')[0].addEventListener('click', function () {
        alertDialog.confirm({
          title: '刪除所有搜尋表',
          message: '\u60A8\u78BA\u5B9A\u8981\u522A\u9664\u6240\u6709\u7684\u8868\u683C\u55CE? <br />\n                (\u5EFA\u8B70\u767C\u751F\u56B4\u91CD\u932F\u8AA4\u81F3\u7121\u6CD5\u64CD\u4F5C\u6642 \u518D\u9019\u9EBC\u505A)',
          callback: function callback(result) {
            if (result) {
              _this31.controller.deleteLocalSearchTables();
            }
          }
        });
      });

      $('button[name=\'createTable\']')[0].addEventListener('click', function () {
        alertDialog.dialog({
          type: 'prompt',
          title: '新建搜尋表',
          message: '\u8ACB\u8F38\u5165\u8868\u683C\u540D\u7A31(\u5982\u6709\u91CD\u8907\u5C07\u76F4\u63A5\u8986\u84CB)',
          inputType: 'text',
          customSetting: '',
          callback: function callback(result) {
            if (result) {
              _this31.controller.createNewSearchTable(result);
            }
          }
        });
      });
      $('button[name=\'deleteTable\']')[0].addEventListener('click', function () {
        var tableName = $('select[name=\'dataSearchList\']')[0].value;
        alertDialog.confirm({
          title: '刪除搜尋表',
          message: '\u60A8\u78BA\u5B9A\u8981\u522A\u9664\u8868\u683C ' + tableName + ' \u55CE?',
          callback: function callback(result) {
            if (result) {
              _this31.controller.deleteSearchTable(tableName);
            }
          }
        });
      });

      this.displaySearchTablesList();
      if ($('select[name=\'dataSearchList\']')[0].value !== '') {
        this.displaySearchTableInfo();
      }

      $('button[name=\'addTableFilter\']')[0].addEventListener('click', function () {
        var tableName = $('select[name=\'dataSearchList\']')[0].value;
        var filter = $('input[name=\'tableFilter\']')[0].value;
        _this31.controller.addSearchTableFilter(tableName, filter);
      });
      $('button[name=\'deleteTableFilter\']')[0].addEventListener('click', function () {
        var tableName = $('select[name=\'dataSearchList\']')[0].value;
        _this31.controller.deleteSearchTableFilter(tableName);
        $('input[name=\'tableFilter\']')[0].value = '';
      });

      $('button[name=\'addTableSort\']')[0].addEventListener('click', function () {
        var tableName = $('select[name=\'dataSearchList\']')[0].value;
        var sort = $('input[name=\'tableSort\']')[0].value;
        _this31.controller.addSearchTableSort(tableName, sort);
      });
      $('button[name=\'deleteTableSort\']')[0].addEventListener('click', function () {
        var tableName = $('select[name=\'dataSearchList\']')[0].value;
        _this31.controller.deleteSearchTableSort(tableName);
        $('input[name=\'tableSort\']')[0].value = '';
      });

      $('button[name=\'addTableColumn\']')[0].addEventListener('click', function () {
        var tableName = $('select[name=\'dataSearchList\']')[0].value;
        alertDialog.dialog({
          type: 'prompt',
          title: '新增欄位',
          message: '\u8ACB\u8F38\u5165\u65B0\u7684\u6B04\u4F4D\u540D\u7A31',
          inputType: 'text',
          customSetting: 'placeholder=\'\u8ACB\u8F38\u5165\u6B04\u4F4D\u540D\u7A31\uFF0C\u5982: \u672C\u76CA\u6BD4\'',
          callback: function callback(newName) {
            if (newName) {
              alertDialog.dialog({
                type: 'prompt',
                title: '新增欄位',
                message: '\u8ACB\u8F38\u5165\u65B0\u7684\u516C\u5F0F',
                inputType: 'text',
                customSetting: 'placeholder=\'\u8ACB\u8F38\u5165\u6B04\u4F4D\u516C\u5F0F\uFF0C\u5982: (profit / (price * stock))\'',
                callback: function callback(newRule) {
                  if (newRule) {
                    _this31.controller.addSearchTableColumn(tableName, newName, newRule);
                    _this31.displaySearchTableColumns(tableName);
                  }
                }
              });
            }
          }
        });
      });

      $('button[name=\'outputTable\']')[0].addEventListener('click', function () {
        if (loginUser.vipLevel() > 0) {
          var tableName = $('span[name=\'tableName\']')[0].innerText;
          if (tableName !== '') {
            var filter = $('input[name=\'tableFilter\']')[0].value;
            _this31.controller.addSearchTableFilter(tableName, filter);
            var sort = $('input[name=\'tableSort\']')[0].value;
            _this31.controller.addSearchTableSort(tableName, sort);

            _this31.displayOutputTable(tableName);
          }
        } else {
          alertDialog.alert('你不是VIP！(怒)');
        }
      });
      $('button[name=\'clearOutputTable\']')[0].addEventListener('click', function () {
        $('table[name=outputTable]').remove();
      });

      console.log('end displaySearchTables()');
    }
  }, {
    key: 'displaySearchTablesList',
    value: function displaySearchTablesList() {
      var _this32 = this;

      console.log('---start displaySearchTablesList()');

      $('option[name=\'dataSearchList\']').remove();
      var localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
      var _iteratorNormalCompletion33 = true;
      var _didIteratorError33 = false;
      var _iteratorError33 = undefined;

      try {
        for (var _iterator33 = localSearchTables[Symbol.iterator](), _step33; !(_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done); _iteratorNormalCompletion33 = true) {
          var t = _step33.value;

          var item = $('<option name=\'dataSearchList\' value=\'' + t.tableName + '\'>' + t.tableName + '</option>');
          $('select[name=\'dataSearchList\']').append(item);
        }
      } catch (err) {
        _didIteratorError33 = true;
        _iteratorError33 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion33 && _iterator33.return) {
            _iterator33.return();
          }
        } finally {
          if (_didIteratorError33) {
            throw _iteratorError33;
          }
        }
      }

      $('select[name=\'dataSearchList\']')[0].addEventListener('change', function () {
        $('table[name=outputTable]').remove();
        _this32.displaySearchTableInfo();
      });

      console.log('---end displaySearchTablesList()');
    }
  }, {
    key: 'displaySearchTableInfo',
    value: function displaySearchTableInfo() {
      console.log('---start displaySearchTableInfo()');

      var selectValue = $('select[name=\'dataSearchList\']')[0].value;
      if (selectValue) {
        var localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
        var thisTable = localSearchTables.find(function (t) {
          return t.tableName === selectValue;
        });
        $('span[name=\'tableName\']')[0].innerText = thisTable.tableName;
        $('input[name=\'tableFilter\']')[0].value = thisTable.filter;
        $('input[name=\'tableSort\']')[0].value = thisTable.sort;

        this.displaySearchTableColumns(thisTable.tableName);
      } else {
        $('span[name=\'tableName\']')[0].innerText = '';
        $('input[name=\'tableFilter\']')[0].value = '';
        $('input[name=\'tableSort\']')[0].value = '';
        $('tr[name=\'tableColumn\']').remove();
      }

      console.log('---end displaySearchTableInfo()');
    }
  }, {
    key: 'displaySearchTableColumns',
    value: function displaySearchTableColumns(tableName) {
      var _this33 = this;

      console.log('---start displaySearchTableColumns()');

      $('tr[name=\'tableColumn\']').remove();
      var localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
      var thisTable = localSearchTables.find(function (t) {
        return t.tableName === tableName;
      });

      var changeColumn = function changeColumn(c) {
        alertDialog.dialog({
          type: 'prompt',
          title: '修改欄位',
          message: '\u8ACB\u8F38\u5165\u65B0\u7684\u6B04\u4F4D\u540D\u7A31',
          inputType: 'text',
          defaultValue: c.columnName,
          customSetting: '',
          callback: function callback(newName) {
            if (newName) {
              alertDialog.dialog({
                type: 'prompt',
                title: '修改欄位',
                message: '\u8ACB\u8F38\u5165\u65B0\u7684\u516C\u5F0F',
                inputType: 'text',
                defaultValue: String(c.rule),
                customSetting: '',
                callback: function callback(newRule) {
                  if (newRule) {
                    _this33.controller.changeSearchTableColumn(tableName, { name: c.columnName, newName: newName }, newRule);
                    _this33.displaySearchTableColumns(tableName);
                  }
                }
              });
            }
          }
        });
      };
      var deleteColumn = function deleteColumn(c) {
        alertDialog.confirm({
          title: '\u522A\u9664 ' + tableName + ' \u7684\u6B04\u4F4D',
          message: '\u60A8\u78BA\u5B9A\u8981\u522A\u9664\u6B04\u4F4D ' + c.columnName + ' \u55CE?',
          callback: function callback(result) {
            if (result) {
              _this33.controller.deleteSearchTableColumn(tableName, c.columnName);
              _this33.displaySearchTableColumns(tableName);
            }
          }
        });
      };

      var _loop14 = function _loop14(c) {
        var t = '\n        <tr name=\'tableColumn\'>\n          <td>' + c.columnName + '</td>\n          <td>' + String(c.rule) + '</td>\n          <td>\n            <button class=\'btn btn-warning btn-sm\' name=\'changeTableColumn\' id=\'' + c.columnName + '\'>\u4FEE\u6539</button>\n            <button class=\'btn btn-danger btn-sm\' name=\'deleteTableColumn\' id=\'' + c.columnName + '\'>\u522A\u9664</button>\n          </td>\n        </tr>\n      ';
        $('tbody[name=\'tableColumn\']').append(t);
        $('button[name=\'changeTableColumn\'][id=\'' + c.columnName + '\']')[0].addEventListener('click', function () {
          changeColumn(c);
        });
        $('button[name=\'deleteTableColumn\'][id=\'' + c.columnName + '\']')[0].addEventListener('click', function () {
          deleteColumn(c);
        });
      };

      var _iteratorNormalCompletion34 = true;
      var _didIteratorError34 = false;
      var _iteratorError34 = undefined;

      try {
        for (var _iterator34 = thisTable.column[Symbol.iterator](), _step34; !(_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done); _iteratorNormalCompletion34 = true) {
          var c = _step34.value;

          _loop14(c);
        }
      } catch (err) {
        _didIteratorError34 = true;
        _iteratorError34 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion34 && _iterator34.return) {
            _iterator34.return();
          }
        } finally {
          if (_didIteratorError34) {
            throw _iteratorError34;
          }
        }
      }

      console.log('---end displaySearchTableColumns()');
    }
  }, {
    key: 'displayOutputTable',
    value: function displayOutputTable(tableName) {
      $('table[name=outputTable]').remove();

      // 需要重整，顯示不應該由SearchTables做
      this.controller.searchTables.outputTable(tableName);
    }
  }]);

  return ScriptVipView;
}(View);

//---end file: ScriptVipPage/ScriptVipView
//
//---start file: ScriptVipPage/SearchTables

/**
 * 操縱搜尋表的物件
 */


var SearchTables = function () {
  function SearchTables() {
    _classCallCheck(this, SearchTables);

    this.tables = [];
    this.loadFromLocalstorage();
  }

  _createClass(SearchTables, [{
    key: 'updateToLocalstorage',
    value: function updateToLocalstorage() {
      window.localStorage.setItem('localSearchTables', JSON.stringify(this.tables));
    }
  }, {
    key: 'loadFromLocalstorage',
    value: function loadFromLocalstorage() {
      this.tables = JSON.parse(window.localStorage.getItem('localSearchTables')) || [];
      if (this.tables.length < 1) {
        this.updateToLocalstorage();
      }
    }

    /**
     * 會刪除所有table, 同時清空localStorage裡table的資料
     * @return {void}
     */

  }, {
    key: 'deleteAllTable',
    value: function deleteAllTable() {
      this.tables = [];
      window.localStorage.removeItem('localSearchTables');
    }

    /**
     * 輸出搜尋表的表頭
     * @param {String} tableName 目標的table名稱
     * @return {Array} table的表頭列
     */

  }, {
    key: 'outputSearchTableHead',
    value: function outputSearchTableHead(tableName) {
      var table = this.tables.find(function (t) {
        return t.tableName === tableName;
      });
      var outputArray = [];
      var _iteratorNormalCompletion35 = true;
      var _didIteratorError35 = false;
      var _iteratorError35 = undefined;

      try {
        for (var _iterator35 = table.column[Symbol.iterator](), _step35; !(_iteratorNormalCompletion35 = (_step35 = _iterator35.next()).done); _iteratorNormalCompletion35 = true) {
          var column = _step35.value;

          outputArray.push(column.columnName);
        }
      } catch (err) {
        _didIteratorError35 = true;
        _iteratorError35 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion35 && _iterator35.return) {
            _iterator35.return();
          }
        } finally {
          if (_didIteratorError35) {
            throw _iteratorError35;
          }
        }
      }

      return outputArray;
    }
    /**
     * 輸出搜尋表的結果, 也就是tBody的內容
     * @param {String} tableName 目標的table名稱
     * @return {Array} tBody的內容
     */

  }, {
    key: 'outputSearchResults',
    value: function outputSearchResults(tableName) {
      var _this34 = this;

      console.log('start outputSearchResults()');

      var table = this.tables.find(function (t) {
        return t.tableName === tableName;
      });
      var localCompanies = getLocalCompanies();
      var outputCompanies = [];
      try {
        if (table.filter) {
          var _iteratorNormalCompletion36 = true;
          var _didIteratorError36 = false;
          var _iteratorError36 = undefined;

          try {
            for (var _iterator36 = localCompanies[Symbol.iterator](), _step36; !(_iteratorNormalCompletion36 = (_step36 = _iterator36.next()).done); _iteratorNormalCompletion36 = true) {
              var company = _step36.value;

              if (this.doInputFunction(company, table.filter)) {
                outputCompanies.push(company);
              }
            }
          } catch (err) {
            _didIteratorError36 = true;
            _iteratorError36 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion36 && _iterator36.return) {
                _iterator36.return();
              }
            } finally {
              if (_didIteratorError36) {
                throw _iteratorError36;
              }
            }
          }
        } else {
          outputCompanies = localCompanies;
        }
      } catch (e) {
        alertDialog.alert('計算失敗！過濾公式出錯');

        return;
      }

      try {
        if (table.sort) {
          outputCompanies.sort(function (a, b) {
            return _this34.doInputFunction(b, table.sort) - _this34.doInputFunction(a, table.sort);
          });
        }
      } catch (e) {
        alertDialog.alert('計算失敗！排序公式出錯');

        return;
      }

      var outputList = [];
      var debugColumnName = '';
      try {
        var _iteratorNormalCompletion37 = true;
        var _didIteratorError37 = false;
        var _iteratorError37 = undefined;

        try {
          for (var _iterator37 = outputCompanies[Symbol.iterator](), _step37; !(_iteratorNormalCompletion37 = (_step37 = _iterator37.next()).done); _iteratorNormalCompletion37 = true) {
            var _company = _step37.value;

            var row = [];
            var _iteratorNormalCompletion38 = true;
            var _didIteratorError38 = false;
            var _iteratorError38 = undefined;

            try {
              for (var _iterator38 = table.column[Symbol.iterator](), _step38; !(_iteratorNormalCompletion38 = (_step38 = _iterator38.next()).done); _iteratorNormalCompletion38 = true) {
                var column = _step38.value;

                debugColumnName = column.columnName;
                var pushValue = this.doInputFunction(_company, column.rule);
                row.push(pushValue);
              }
            } catch (err) {
              _didIteratorError38 = true;
              _iteratorError38 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion38 && _iterator38.return) {
                  _iterator38.return();
                }
              } finally {
                if (_didIteratorError38) {
                  throw _iteratorError38;
                }
              }
            }

            outputList.push(row);
          }
        } catch (err) {
          _didIteratorError37 = true;
          _iteratorError37 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion37 && _iterator37.return) {
              _iterator37.return();
            }
          } finally {
            if (_didIteratorError37) {
              throw _iteratorError37;
            }
          }
        }
      } catch (e) {
        alertDialog.alert('\u8A08\u7B97\u5931\u6557\uFF01\u6B04\u4F4D ' + debugColumnName + ' \u516C\u5F0F\u51FA\u932F');

        return;
      }

      debugConsole('outputList: ');
      debugConsole(outputList);
      console.log('end outputSearchResults(), outputList.length: ' + outputList.length);

      return outputList;
    }

    /**
     * 建立一個新的table
     * @param {String} newTableName table名
     * @return {void}
     */

  }, {
    key: 'addTable',
    value: function addTable(newTableName) {
      var tableName = stripscript(newTableName);
      var newTable = { 'tableName': tableName,
        'filter': null,
        'sort': null,
        'column': [] };
      var i = this.tables.findIndex(function (t) {
        return t.tableName === tableName;
      });
      if (i === -1) {
        this.tables.push(newTable);
      } else {
        this.tables[i] = newTable;
      }

      var companyLink = '(`<a name=\'companyName\' id=\'${ID}\' href=\'/company/detail/${ID}\'>${name}</a>`)';
      this.addTableColumn(tableName, '公司名稱', companyLink);
    }

    /**
     * 刪除指定的table
     * @param {String} tableName 目標的table名稱
     * @return {void}
     */

  }, {
    key: 'deleteTable',
    value: function deleteTable(tableName) {
      var i = this.tables.findIndex(function (t) {
        return t.tableName === tableName;
      });
      this.tables.splice(i, 1);
    }
  }, {
    key: 'addTableSort',
    value: function addTableSort(tableName, sort) {
      var i = this.tables.findIndex(function (t) {
        return t.tableName === tableName;
      });
      this.tables[i].sort = sort;
    }
  }, {
    key: 'deleteTableSort',
    value: function deleteTableSort(tableName) {
      this.addTableSort(tableName, null);
    }
  }, {
    key: 'addTableFilter',
    value: function addTableFilter(tableName, filter) {
      var i = this.tables.findIndex(function (t) {
        return t.tableName === tableName;
      });
      this.tables[i].filter = filter;
    }
  }, {
    key: 'deleteTableFilter',
    value: function deleteTableFilter(tableName) {
      this.addTableFilter(tableName, null);
    }

    /**
     * 在table中增加一個欄位, 名稱重複會自動轉往changeTableColumn
     * @param {String} tableName 目標的table名稱
     * @param {String} columnName 指定的新欄位名稱
     * @param {String} rule 欄位的規則
     * @return {void}
     */

  }, {
    key: 'addTableColumn',
    value: function addTableColumn(tableName, columnName, rule) {
      var i = this.tables.findIndex(function (d) {
        return d.tableName === tableName;
      });
      if (this.tables[i].column.findIndex(function (col) {
        return col.columnName === columnName;
      }) === -1) {
        this.tables[i].column.push({ 'columnName': stripscript(columnName), 'rule': rule });
      } else {
        this.changeTableColumn(tableName, { name: columnName, newName: columnName }, rule);
      }
    }

    /**
     * 改變欄位的 規則 或 名稱
     * @param {String} tableName 目標的table名稱
     * @param {{name: String, newName: String}} columnNames 目標的原名稱, 新名稱
     * @param {String} rule 目標的新規則
     * @return {void}
     */

  }, {
    key: 'changeTableColumn',
    value: function changeTableColumn(tableName, columnNames, rule) {
      var columnName = columnNames.name;
      var newColumnName = columnNames.newName || columnNames.name;

      var i = this.tables.findIndex(function (d) {
        return d.tableName === tableName;
      });
      var tableColumn = this.tables[i].column;
      var j = tableColumn.findIndex(function (col) {
        return col.columnName === columnName;
      });
      this.tables[i].column[j].rule = rule;
      this.tables[i].column[j].columnName = stripscript(newColumnName);
    }

    /**
     * 刪除指定的欄位
     * @param {String} tableName 目標的table名稱
     * @param {String} columnName 目標的column名稱
     * @return {void}
     */

  }, {
    key: 'deleteTableColumn',
    value: function deleteTableColumn(tableName, columnName) {
      var i = this.tables.findIndex(function (d) {
        return d.tableName === tableName;
      });
      var tableColumn = this.tables[i].column;
      var j = tableColumn.findIndex(function (col) {
        return col.columnName === columnName;
      });
      this.tables[i].column.splice(j, 1);
    }

    /**
     * 執行輸入的function, function需以String傳入, 如: '() => employeesNumber > 0'
     * @param {Company} company 輸入的company
     * @param {String} fun 運算的function
     * @return {funReturn} 執行後的回傳值
     */

  }, {
    key: 'doInputFunction',
    value: function doInputFunction(company, fun) {
      /* eslint-disable no-eval, no-unused-vars */
      var ID = company.companyId;
      var Id = company.companyId;
      var id = company.companyId;
      var name = company.name;
      var chairman = company.chairman || '';
      var manager = company.manager || '';

      var grade = company.grade;
      var capital = company.capital;
      var price = company.price;
      var stock = company.release;
      var release = company.release;
      var profit = company.profit;

      var vipBonusStocks = company.vipBonusStocks;
      var managerProfitPercent = company.managerBonusRatePercent;
      var managerBonusRatePercent = company.managerBonusRatePercent;
      var capitalIncreaseRatePercent = company.capitalIncreaseRatePercent;

      var salary = company.salary;
      var nextSeasonSalary = company.nextSeasonSalary;
      var bonus = company.employeeBonusRatePercent;
      var employeeBonusRatePercent = company.employeeBonusRatePercent;
      var employeesNumber = company.employeesNumber;
      var nextSeasonEmployeesNumber = company.nextSeasonEmployeesNumber;

      var tags = company.tags || [];
      var createdAt = company.createdAt;

      debugConsole('=====do=' + fun);

      return eval(fun);
      /* eslint-enable no-eval, no-unused-vars */
    }
  }, {
    key: 'outputTable',
    value: function outputTable(tableName) {
      var _this35 = this;

      console.log('start outputTable()');

      this.loadFromLocalstorage();

      var t = this.tables.find(function (x) {
        return x.tableName === tableName;
      });
      var localCompanies = getLocalCompanies();
      var outputCompanies = [];
      try {
        if (t.filter) {
          var _iteratorNormalCompletion39 = true;
          var _didIteratorError39 = false;
          var _iteratorError39 = undefined;

          try {
            for (var _iterator39 = localCompanies[Symbol.iterator](), _step39; !(_iteratorNormalCompletion39 = (_step39 = _iterator39.next()).done); _iteratorNormalCompletion39 = true) {
              var c = _step39.value;

              if (this.doInputFunction(c, t.filter)) {
                outputCompanies.push(c);
              }
            }
          } catch (err) {
            _didIteratorError39 = true;
            _iteratorError39 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion39 && _iterator39.return) {
                _iterator39.return();
              }
            } finally {
              if (_didIteratorError39) {
                throw _iteratorError39;
              }
            }
          }
        } else {
          outputCompanies = localCompanies;
        }
      } catch (e) {
        alertDialog.alert('計算失敗！過濾公式出錯');

        return;
      }

      try {
        if (t.sort) {
          outputCompanies.sort(function (a, b) {
            return _this35.doInputFunction(b, t.sort) - _this35.doInputFunction(a, t.sort);
          });
        }
      } catch (e) {
        alertDialog.alert('計算失敗！排序公式出錯');

        return;
      }

      var outputList = [];
      var debugColumnName = '';
      try {
        var _iteratorNormalCompletion40 = true;
        var _didIteratorError40 = false;
        var _iteratorError40 = undefined;

        try {
          for (var _iterator40 = outputCompanies[Symbol.iterator](), _step40; !(_iteratorNormalCompletion40 = (_step40 = _iterator40.next()).done); _iteratorNormalCompletion40 = true) {
            var _c = _step40.value;

            var row = {};
            var _iteratorNormalCompletion41 = true;
            var _didIteratorError41 = false;
            var _iteratorError41 = undefined;

            try {
              for (var _iterator41 = t.column[Symbol.iterator](), _step41; !(_iteratorNormalCompletion41 = (_step41 = _iterator41.next()).done); _iteratorNormalCompletion41 = true) {
                var column = _step41.value;

                debugColumnName = column.columnName;
                row[column.columnName] = this.doInputFunction(_c, column.rule);
              }
            } catch (err) {
              _didIteratorError41 = true;
              _iteratorError41 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion41 && _iterator41.return) {
                  _iterator41.return();
                }
              } finally {
                if (_didIteratorError41) {
                  throw _iteratorError41;
                }
              }
            }

            outputList.push(row);
          }
        } catch (err) {
          _didIteratorError40 = true;
          _iteratorError40 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion40 && _iterator40.return) {
              _iterator40.return();
            }
          } finally {
            if (_didIteratorError40) {
              throw _iteratorError40;
            }
          }
        }
      } catch (e) {
        alertDialog.alert('\u8A08\u7B97\u5931\u6557\uFF01\u6B04\u4F4D ' + debugColumnName + ' \u516C\u5F0F\u51FA\u932F');

        return;
      }

      // 需要重整，應該歸類到View裡面
      var thead = '';
      var _iteratorNormalCompletion42 = true;
      var _didIteratorError42 = false;
      var _iteratorError42 = undefined;

      try {
        for (var _iterator42 = t.column[Symbol.iterator](), _step42; !(_iteratorNormalCompletion42 = (_step42 = _iterator42.next()).done); _iteratorNormalCompletion42 = true) {
          var _column = _step42.value;

          thead += '<th style=\'max-width: 390px;\'>' + _column.columnName + '</th>';
        }
      } catch (err) {
        _didIteratorError42 = true;
        _iteratorError42 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion42 && _iterator42.return) {
            _iterator42.return();
          }
        } finally {
          if (_didIteratorError42) {
            throw _iteratorError42;
          }
        }
      }

      var output = '\n        <table border=\'1\' name=\'outputTable\'>\n            <thead name=\'outputTable\'>\n                ' + thead + '\n            </thead>\n            <tbody name=\'outputTable\'>\n            </tbody>\n        </table>\n    ';
      $('p[name=\'outputTable\']').append(output);
      var _iteratorNormalCompletion43 = true;
      var _didIteratorError43 = false;
      var _iteratorError43 = undefined;

      try {
        for (var _iterator43 = outputList[Symbol.iterator](), _step43; !(_iteratorNormalCompletion43 = (_step43 = _iterator43.next()).done); _iteratorNormalCompletion43 = true) {
          var _row = _step43.value;

          var outputRow = '<tr>';
          var _iteratorNormalCompletion44 = true;
          var _didIteratorError44 = false;
          var _iteratorError44 = undefined;

          try {
            for (var _iterator44 = t.column[Symbol.iterator](), _step44; !(_iteratorNormalCompletion44 = (_step44 = _iterator44.next()).done); _iteratorNormalCompletion44 = true) {
              var _column2 = _step44.value;

              outputRow += '<td style=\'max-width: 390px;\'>' + _row[_column2.columnName] + '</td>';
            }
          } catch (err) {
            _didIteratorError44 = true;
            _iteratorError44 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion44 && _iterator44.return) {
                _iterator44.return();
              }
            } finally {
              if (_didIteratorError44) {
                throw _iteratorError44;
              }
            }
          }

          outputRow += '</tr>';
          $('tbody[name=\'outputTable\']').append(outputRow);
        }
      } catch (err) {
        _didIteratorError43 = true;
        _iteratorError43 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion43 && _iterator43.return) {
            _iterator43.return();
          }
        } finally {
          if (_didIteratorError43) {
            throw _iteratorError43;
          }
        }
      }

      console.log('end outputTable()');
    }
  }]);

  return SearchTables;
}();

//---end file: ScriptVipPage/SearchTables
//

/**
 * ScriptVip頁面的Controller
 */


var ScriptVipController = function (_EventController4) {
  _inherits(ScriptVipController, _EventController4);

  /**
   * 建構ScriptVipController
   * @param {LoginUser} loginUser 登入中的使用者
   */
  function ScriptVipController(loginUser) {
    _classCallCheck(this, ScriptVipController);

    var _this36 = _possibleConstructorReturn(this, (ScriptVipController.__proto__ || Object.getPrototypeOf(ScriptVipController)).call(this, 'ScriptVipController', loginUser));

    _this36.searchTables = new SearchTables();
    _this36.scriptVipView = new ScriptVipView(_this36);

    Template.softwareScriptVip.onRendered(function () {
      _this36.scriptVipView.displayScriptVipProducts(_this36.loginUser);
      _this36.scriptVipView.displaySearchTables(_this36.loginUser);
    });
    return _this36;
  }

  _createClass(ScriptVipController, [{
    key: 'deleteLocalSearchTables',
    value: function deleteLocalSearchTables() {
      this.searchTables.deleteAllTable();
      this.searchTables.updateToLocalstorage();
      //有些錯誤會造成addEventListener加入失敗，因此直接重載入網頁
      setTimeout(function () {
        FlowRouter.go('blankPage');
        setTimeout(function () {
          FlowRouter.go('softwareScriptVip');
        }, 10);
      }, 0);
    }
  }, {
    key: 'createNewSearchTable',
    value: function createNewSearchTable(newTableName) {
      this.searchTables.loadFromLocalstorage();
      this.searchTables.addTable(newTableName);
      this.searchTables.updateToLocalstorage();

      this.scriptVipView.displaySearchTablesList();
      $('select[name=\'dataSearchList\']')[0].value = stripscript(newTableName);
      this.scriptVipView.displaySearchTableInfo();
    }
  }, {
    key: 'deleteSearchTable',
    value: function deleteSearchTable(tableName) {
      this.searchTables.loadFromLocalstorage();
      this.searchTables.deleteTable(tableName);
      this.searchTables.updateToLocalstorage();

      this.scriptVipView.displaySearchTablesList();
      this.scriptVipView.displaySearchTableInfo();
    }
  }, {
    key: 'addSearchTableFilter',
    value: function addSearchTableFilter(tableName, filter) {
      this.searchTables.loadFromLocalstorage();
      this.searchTables.addTableFilter(tableName, filter);
      this.searchTables.updateToLocalstorage();
    }
  }, {
    key: 'deleteSearchTableFilter',
    value: function deleteSearchTableFilter(tableName) {
      this.searchTables.loadFromLocalstorage();
      this.searchTables.deleteTableFilter(tableName);
      this.searchTables.updateToLocalstorage();
    }
  }, {
    key: 'addSearchTableSort',
    value: function addSearchTableSort(tableName, sort) {
      this.searchTables.loadFromLocalstorage();
      this.searchTables.addTableSort(tableName, sort);
      this.searchTables.updateToLocalstorage();
    }
  }, {
    key: 'deleteSearchTableSort',
    value: function deleteSearchTableSort(tableName) {
      this.searchTables.loadFromLocalstorage();
      this.searchTables.deleteTableSort(tableName);
      this.searchTables.updateToLocalstorage();
    }
  }, {
    key: 'addSearchTableColumn',
    value: function addSearchTableColumn(tableName, newName, newRule) {
      this.searchTables.loadFromLocalstorage();
      this.searchTables.addTableColumn(tableName, newName, newRule);
      this.searchTables.updateToLocalstorage();
    }
  }, {
    key: 'changeSearchTableColumn',
    value: function changeSearchTableColumn(tableName, columnNames, newRule) {
      this.searchTables.loadFromLocalstorage();
      this.searchTables.changeTableColumn(tableName, columnNames, newRule);
      this.searchTables.updateToLocalstorage();
    }
  }, {
    key: 'deleteSearchTableColumn',
    value: function deleteSearchTableColumn(tableName, columnName) {
      this.searchTables.loadFromLocalstorage();
      this.searchTables.deleteTableColumn(tableName, columnName);
      this.searchTables.updateToLocalstorage();
    }
  }]);

  return ScriptVipController;
}(EventController);

//--end file: ScriptVipPage/ScriptVipController
//
//--start file: AboutPage/AboutController
//---start file: AboutPage/AboutView

var AboutView = function (_View6) {
  _inherits(AboutView, _View6);

  function AboutView() {
    _classCallCheck(this, AboutView);

    var _this37 = _possibleConstructorReturn(this, (AboutView.__proto__ || Object.getPrototypeOf(AboutView)).call(this, 'AboutView'));

    var tmpVip = new Blaze.Template('Template.softwareScriptAbout', function () {
      /* eslint-disable max-len */
      // eslint-disable-next-line new-cap
      var page = HTML.Raw('\n      <div class=\'card\' name=\'about\'>\n        <div class=\'card-block\' name=\'about\'>\n      \n          <div id="readme" class="readme blob instapaper_body">\n            <article class="markdown-body entry-content" itemprop="text">\n              <h1>ACGN-stock\u71DF\u5229\u7D71\u8A08\u5916\u639B / SoftwareScript</h1>\n              <p>A script helps you play\n                <a href="https://acgn-stock.com" rel="nofollow">acgn-stock.com</a>.</p>\n              <p>\u4E00\u500B\u5E6B\u52A9\u4F60\u5728\n                <a href="https://acgn-stock.com" rel="nofollow">acgn-stock.com</a> \u7372\u5F97\u66F4\u8C50\u5BCC\u8A0A\u606F\u7684\u5916\u639B</p>\n              <p>\n                <del>\u7D14\u7CB9\u56E0\u70BA\u4E2D\u6587\u592A\u9577\uFF0C\u6240\u4EE5\u82F1\u6587\u91CD\u65B0\u53D6\u540D\u800C\u4E0D\u662F\u7167\u7FFB</del>\n              </p>\n              <h2>\u767C\u5E03\u9801\u9762</h2>\n              <p>\n                <a href="https://github.com/SoftwareSing/ACGNs-SoftwareScript" target="_blank">GitHub</a>\n              </p>\n              <p>\n                <a href="https://greasyfork.org/zh-TW/scripts/33542" target="_blank">GreasyFork</a>\n              </p>\n              <p></p>\n              <h2>\u76EE\u524D\u7684\u529F\u80FD</h2>\n                <p>\n                  \u76EE\u524D\u7684\u529F\u80FD\u8ACB\u53C3\u8003 \n                  <a href="https://github.com/SoftwareSing/ACGNs-SoftwareScript#%E7%9B%AE%E5%89%8D%E7%9A%84%E5%8A%9F%E8%83%BD" rel="nofollow" target="_blank">GitHub README</a>\n                </p>\n            </article>\n          </div>\n        </div>\n      </div>\n      ');
      /* eslint-enable max-len */

      return page;
    });
    Template.softwareScriptAbout = tmpVip;
    return _this37;
  }

  return AboutView;
}(View);

//---end file: AboutPage/AboutView
//

var AboutController = function (_EventController5) {
  _inherits(AboutController, _EventController5);

  /**
   * AboutScriptController constructor
   * @param {LoginUser} loginUser LoginUser
   */
  function AboutController(loginUser) {
    _classCallCheck(this, AboutController);

    var _this38 = _possibleConstructorReturn(this, (AboutController.__proto__ || Object.getPrototypeOf(AboutController)).call(this, 'AboutScriptController', loginUser));

    _this38.aboutView = new AboutView();
    return _this38;
  }

  return AboutController;
}(EventController);

//--end file: AboutPage/AboutController
//
//--start file: DisconnectReminder/DisconnectReminderController
//---start file: DisconnectReminder/AccessedRecorder


var AccessedRecorder = function () {
  function AccessedRecorder(dbName) {
    var number = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
    var interval = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60000;

    _classCallCheck(this, AccessedRecorder);

    this.name = dbName;
    this.number = number;
    this.interval = interval;
    this.records = [];
  }

  _createClass(AccessedRecorder, [{
    key: 'addRecord',
    value: function addRecord() {
      this.records.push(Date.now());
    }
  }, {
    key: 'getAccessedCount',
    value: function getAccessedCount() {
      var _this39 = this;

      this.records = this.records.filter(function (t) {
        return Date.now() - t < _this39.interval;
      });
      this.records.sort(function (a, b) {
        return a - b; //由小至大
      });

      return { count: this.records.length, firstTime: this.records[0] };
    }
  }, {
    key: 'getWarningInfo',
    value: function getWarningInfo() {
      var shouldWarning = false;

      var _getAccessedCount = this.getAccessedCount(),
          count = _getAccessedCount.count,
          firstTime = _getAccessedCount.firstTime;

      var warningNumber = this.number - 5 > 5 ? this.number - 5 : this.number - 1;
      if (warningNumber < 3) {
        //只能操作不到3次的動作不提醒
        return { shouldWarning: false, count: count, firstTime: firstTime };
      }

      if (count >= warningNumber) {
        shouldWarning = true;
      }

      return { shouldWarning: shouldWarning, count: count, firstTime: firstTime };
    }
  }]);

  return AccessedRecorder;
}();

//---end file: DisconnectReminder/AccessedRecorder
//
//---start file: DisconnectReminder/DisconnectReminderView

var DisconnectReminderView = function (_View7) {
  _inherits(DisconnectReminderView, _View7);

  function DisconnectReminderView() {
    _classCallCheck(this, DisconnectReminderView);

    return _possibleConstructorReturn(this, (DisconnectReminderView.__proto__ || Object.getPrototypeOf(DisconnectReminderView)).call(this, 'DisconnectReminderView'));
  }

  _createClass(DisconnectReminderView, [{
    key: 'displayWarningDialog',
    value: function displayWarningDialog(dbName, count, stopTime) {
      var info = translation(['script', 'disconnectWarningInfo'])(dbName, count, stopTime);
      alertDialog.alert({
        title: translation(['script', 'name']) + ' - ' + translation(['script', 'disconnectReminder']),
        message: info
      });
    }
  }]);

  return DisconnectReminderView;
}(View);

//---end file: DisconnectReminder/DisconnectReminderView
//

var DisconnectReminderController = function (_EventController6) {
  _inherits(DisconnectReminderController, _EventController6);

  function DisconnectReminderController(loginUser) {
    _classCallCheck(this, DisconnectReminderController);

    var _this41 = _possibleConstructorReturn(this, (DisconnectReminderController.__proto__ || Object.getPrototypeOf(DisconnectReminderController)).call(this, 'DisconnectReminderController', loginUser));

    var disconnectReminderSwitch = JSON.parse(window.localStorage.getItem('SoftwareScript.disconnectReminderSwitch'));
    if (!disconnectReminderSwitch) {
      return _possibleConstructorReturn(_this41);
    }

    _this41.disconnectReminderView = new DisconnectReminderView();
    _this41.turnOnAllReminder();
    return _this41;
  }

  _createClass(DisconnectReminderController, [{
    key: 'turnOnAllReminder',
    value: function turnOnAllReminder() {
      // this.accountOwnStocksReminder();
      this.companyProductCenterInfoReminder();
      this.companyMarketingProductsReminder();
      // this.currentUserVoteRecordReminder();
      // this.companyCurrentUserOwnedProductsReminder();

      // this.accuseRecordReminder();
      // this.allRuleAgendaReminder();
      // this.onlinePeopleNumberReminder();
      // this.displayAdvertisingReminder();
      // this.lastImportantAccuseLogDateReminder();
      // this.currentUserUnreadAnnouncementCount();

      this.accountInfoReminder();
      this.employeeListByUserReminder();
      this.accountChairmanTitleReminder();
      this.accountManagerTitleReminder();
      this.accounEmployeeTitleReminder();
      this.accountVipTitleReminder();
      this.accountInfoTaxReminder();
      this.accountInfoLogReminder();
      this.userPlacedStonesReminder();

      this.companyDataForEditReminder();

      // this.ruleAgendaDetailReminder();
      // this.currentRoundReminder();
      // this.currentSeasonReminder();
      // this.currentArenaReminder();
      // this.userCreatedAtReminder();
      // this.userFavoriteReminder();

      this.userOwnedProductsReminder();
      this.companyListReminder();

      // this.adjacentSeasonReminder();
      // this.productListBySeasonIdReminder(); //未限制
      // this.rankListBySeasonIdReminder();

      this.companyVipsReminder();
      // this.currentUserCompanyVipReminder();

      this.foundationListReminder();
      this.foundationDetailReminder();
      this.foundationDataForEditReminder();

      this.companyMiningMachineInfoReminder();
      this.companyStonesReminder();
      this.companyCurrentUserPlacedStonesReminder();
      this.companyLogReminder();
      this.productListByCompanyReminder();
      this.companyDetailReminder();
      this.employeeListByCompanyReminder();
      this.companyDirectorReminder();
      this.companyArenaInfoReminder();

      // this.legacyAnnouncementDetailReminder();
      // this.validateUserReminder();

      // this.announcementListReminder();
      // this.allAdvertisingReminder();
      this.arenaInfoReminder();
      // this.adjacentArenaReminder();
      this.arenaLogReminder();
      // this.fscMembersReminder();

      this.currentUserOrdersReminder();
      this.currentUserDirectorsReminder();
      this.companyOrdersReminder();
    }
  }, {
    key: 'createReminder',
    value: function createReminder(recorder) {
      var _this42 = this;

      return function () {
        recorder.addRecord();

        var _recorder$getWarningI = recorder.getWarningInfo(),
            shouldWarning = _recorder$getWarningI.shouldWarning,
            count = _recorder$getWarningI.count,
            firstTime = _recorder$getWarningI.firstTime;

        if (shouldWarning) {
          _this42.disconnectReminderView.displayWarningDialog(recorder.name, count, Math.ceil((firstTime + recorder.interval - Date.now()) / 1000));
        }
      };
    }
  }, {
    key: 'accountOwnStocksReminder',
    value: function accountOwnStocksReminder() {
      //this.subscribe('accountOwnStocks'
      this.accountOwnStocks = new AccessedRecorder('accountOwnStocks');
      var reminder = this.createReminder(this.accountOwnStocks);
      this.templateListener(Template.fscStock, 'Template.fscStock', reminder);
      this.templateListener(Template.accountInfoOwnStockList, 'Template.accountInfoOwnStockList', reminder);
    }
  }, {
    key: 'companyProductCenterInfoReminder',
    value: function companyProductCenterInfoReminder() {
      //this.subscribe('companyProductCenterInfo'
      this.companyProductCenterInfo = new AccessedRecorder('companyProductCenterInfo');
      var reminder = this.createReminder(this.companyProductCenterInfo);
      this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', reminder);
    }
  }, {
    key: 'companyMarketingProductsReminder',
    value: function companyMarketingProductsReminder() {
      //this.subscribe('companyMarketingProducts'
      this.companyMarketingProducts = new AccessedRecorder('companyMarketingProducts');
      var reminder = this.createReminder(this.companyMarketingProducts);
      this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', reminder);
    }
  }, {
    key: 'currentUserVoteRecordReminder',
    value: function currentUserVoteRecordReminder() {
      //this.subscribe('currentUserVoteRecord'
      this.currentUserVoteRecord = new AccessedRecorder('currentUserVoteRecord', 30, 10000);
      var reminder = this.createReminder(this.currentUserVoteRecord);
      this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', reminder);
      this.templateListener(Template.productInfoBySeasonTable, 'Template.productInfoBySeasonTable', reminder);
      this.templateListener(Template.productCenterByCompany, 'Template.productCenterByCompany', reminder);
    }
  }, {
    key: 'companyCurrentUserOwnedProductsReminder',
    value: function companyCurrentUserOwnedProductsReminder() {
      //this.subscribe('companyCurrentUserOwnedProducts'
      this.companyCurrentUserOwnedProducts = new AccessedRecorder('companyCurrentUserOwnedProducts');
      var reminder = this.createReminder(this.companyCurrentUserOwnedProducts);
      this.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', reminder);
    }
  }, {
    key: 'accuseRecordReminder',
    value: function accuseRecordReminder() {
      //this.subscribe('accuseRecord'
      this.accuseRecord = new AccessedRecorder('accuseRecord', 10);
      var reminder = this.createReminder(this.accuseRecord);
      this.templateListener(Template.accuseRecord, 'Template.accuseRecord', reminder);
    }
  }, {
    key: 'allRuleAgendaReminder',
    value: function allRuleAgendaReminder() {
      //this.subscribe('allRuleAgenda'
      this.allRuleAgenda = new AccessedRecorder('allRuleAgenda', 5);
      var reminder = this.createReminder(this.allRuleAgenda);
      this.templateListener(Template.ruleAgendaList, 'Template.ruleAgendaList', reminder);
    }
  }, {
    key: 'onlinePeopleNumberReminder',
    value: function onlinePeopleNumberReminder() {
      //this.subscribe('onlinePeopleNumber'
      this.onlinePeopleNumber = new AccessedRecorder('onlinePeopleNumber', 5);
      var reminder = this.createReminder(this.onlinePeopleNumber);
      this.templateListener(Template.footer, 'Template.footer', reminder);
    }
  }, {
    key: 'displayAdvertisingReminder',
    value: function displayAdvertisingReminder() {
      //this.subscribe('displayAdvertising'
      this.displayAdvertising = new AccessedRecorder('displayAdvertising', 5);
      var reminder = this.createReminder(this.displayAdvertising);
      this.templateListener(Template.footer, 'Template.footer', reminder);
    }
  }, {
    key: 'lastImportantAccuseLogDateReminder',
    value: function lastImportantAccuseLogDateReminder() {
      //this.subscribe('lastImportantAccuseLogDate'
      this.lastImportantAccuseLogDate = new AccessedRecorder('lastImportantAccuseLogDate');
      var reminder = this.createReminder(this.lastImportantAccuseLogDate);
      this.templateListener(Template.unreadImportantAccuseLogsNotification, 'Template.unreadImportantAccuseLogsNotification', reminder);
    }
  }, {
    key: 'currentUserUnreadAnnouncementCount',
    value: function currentUserUnreadAnnouncementCount() {
      //this.subscribe('currentUserUnreadAnnouncementCount'
      this.currentUserUnreadAnnouncementCount = new AccessedRecorder('currentUserUnreadAnnouncementCount');
      var reminder = this.createReminder(this.currentUserUnreadAnnouncementCount);
      this.templateListener(Template.displayAnnouncementUnreadNotification, 'Template.displayAnnouncementUnreadNotification', reminder);
    }
  }, {
    key: 'accountInfoReminder',
    value: function accountInfoReminder() {
      //this.subscribe('accountInfo'
      this.accountInfo = new AccessedRecorder('accountInfo');
      var reminder = this.createReminder(this.accountInfo);
      this.templateListener(Template.accountInfo, 'Template.accountInfo', reminder);
    }
  }, {
    key: 'employeeListByUserReminder',
    value: function employeeListByUserReminder() {
      //this.subscribe('employeeListByUser'
      this.employeeListByUser = new AccessedRecorder('employeeListByUser');
      var reminder = this.createReminder(this.employeeListByUser);
      this.templateListener(Template.accountInfo, 'Template.accountInfo', reminder);
    }
  }, {
    key: 'accountChairmanTitleReminder',
    value: function accountChairmanTitleReminder() {
      //this.subscribe('accountChairmanTitle'
      this.accountChairmanTitle = new AccessedRecorder('accountChairmanTitle');
      var reminder = this.createReminder(this.accountChairmanTitle);
      this.templateListener(Template.chairmanTitleList, 'Template.chairmanTitleList', reminder);
    }
  }, {
    key: 'accountManagerTitleReminder',
    value: function accountManagerTitleReminder() {
      //this.subscribe('accountManagerTitle'
      this.accountManagerTitle = new AccessedRecorder('accountManagerTitle');
      var reminder = this.createReminder(this.accountManagerTitle);
      this.templateListener(Template.managerTitleList, 'Template.managerTitleList', reminder);
    }
  }, {
    key: 'accounEmployeeTitleReminder',
    value: function accounEmployeeTitleReminder() {
      //this.subscribe('accounEmployeeTitle'
      this.accounEmployeeTitle = new AccessedRecorder('accounEmployeeTitle');
      var reminder = this.createReminder(this.accounEmployeeTitle);
      this.templateListener(Template.employeeTitleList, 'Template.employeeTitleList', reminder);
    }
  }, {
    key: 'accountVipTitleReminder',
    value: function accountVipTitleReminder() {
      //this.subscribe('accountVipTitle'
      this.accountVipTitle = new AccessedRecorder('accountVipTitle');
      var reminder = this.createReminder(this.accountVipTitle);
      this.templateListener(Template.vipTitleList, 'Template.vipTitleList', reminder);
    }
  }, {
    key: 'accountInfoTaxReminder',
    value: function accountInfoTaxReminder() {
      //this.subscribe('accountInfoTax'
      this.accountInfoTax = new AccessedRecorder('accountInfoTax');
      var reminder = this.createReminder(this.accountInfoTax);
      this.templateListener(Template.accountInfoTaxList, 'Template.accountInfoTaxList', reminder);
    }
  }, {
    key: 'accountInfoLogReminder',
    value: function accountInfoLogReminder() {
      //this.subscribe('accountInfoLog'
      this.accountInfoLog = new AccessedRecorder('accountInfoLog');
      var reminder = this.createReminder(this.accountInfoLog);
      this.templateListener(Template.accountInfoLogList, 'Template.accountInfoLogList', reminder);
    }
  }, {
    key: 'userPlacedStonesReminder',
    value: function userPlacedStonesReminder() {
      //this.subscribe('userPlacedStones'
      this.userPlacedStones = new AccessedRecorder('userPlacedStones');
      var reminder = this.createReminder(this.userPlacedStones);
      this.templateListener(Template.accountInfoStonePanel, 'Template.accountInfoStonePanel', reminder);
    }
  }, {
    key: 'companyDataForEditReminder',
    value: function companyDataForEditReminder() {
      //this.subscribe('companyDataForEdit'
      this.companyDataForEdit = new AccessedRecorder('companyDataForEdit', 10);
      var reminder = this.createReminder(this.companyDataForEdit);
      this.templateListener(Template.editCompany, 'Template.editCompany', reminder);
    }
  }, {
    key: 'ruleAgendaDetailReminder',
    value: function ruleAgendaDetailReminder() {
      //this.subscribe('ruleAgendaDetail'
      this.ruleAgendaDetail = new AccessedRecorder('ruleAgendaDetail', 5);
      var reminder = this.createReminder(this.ruleAgendaDetail);
      this.templateListener(Template.ruleAgendaVote, 'Template.ruleAgendaVote', reminder);
      this.templateListener(Template.ruleAgendaDetail, 'Template.ruleAgendaDetail', reminder);
    }
  }, {
    key: 'currentRoundReminder',
    value: function currentRoundReminder() {
      //this.subscribe('currentRound'
      this.currentRound = new AccessedRecorder('currentRound', 5);
      var reminder = this.createReminder(this.currentRound);
      this.templateListener(Template.ruleAgendaVote, 'Template.ruleAgendaVote', reminder);
      this.templateListener(Template.legacyAnnouncement, 'Template.legacyAnnouncement', reminder);
      this.templateListener(Template.ruleAgendaDetail, 'Template.ruleAgendaDetail', reminder);
    }
  }, {
    key: 'currentSeasonReminder',
    value: function currentSeasonReminder() {
      //this.subscribe('currentSeason'
      this.currentSeason = new AccessedRecorder('currentSeason', 5);
      var reminder = this.createReminder(this.currentSeason);
      this.templateListener(Template.nav, 'Template.nav', reminder);
      this.templateListener(Template.legacyAnnouncement, 'Template.legacyAnnouncement', reminder);
    }
  }, {
    key: 'currentArenaReminder',
    value: function currentArenaReminder() {
      //this.subscribe('currentArena'
      this.currentArena = new AccessedRecorder('currentArena', 5);
      var reminder = this.createReminder(this.currentArena);
      this.templateListener(Template.nav, 'Template.nav', reminder);
    }
  }, {
    key: 'userCreatedAtReminder',
    value: function userCreatedAtReminder() {
      //this.subscribe('userCreatedAt'
      this.userCreatedAt = new AccessedRecorder('userCreatedAt');
      var reminder = this.createReminder(this.userCreatedAt);
      this.templateListener(Template.ruleAgendaVote, 'Template.ruleAgendaVote', reminder);
      this.templateListener(Template.ruleAgendaDetail, 'Template.ruleAgendaDetail', reminder);
    }
  }, {
    key: 'userFavoriteReminder',
    value: function userFavoriteReminder() {
      //this.subscribe('userFavorite'
      this.userFavorite = new AccessedRecorder('userFavorite');
      var reminder = this.createReminder(this.userFavorite);
      this.templateListener(Template.nav, 'Template.nav', reminder);
    }
  }, {
    key: 'userOwnedProductsReminder',
    value: function userOwnedProductsReminder() {
      //this.subscribe('userOwnedProducts'
      this.userOwnedProducts = new AccessedRecorder('userOwnedProducts');
      var reminder = this.createReminder(this.userOwnedProducts);
      this.templateListener(Template.accountInfoOwnedProductsPanel, 'Template.accountInfoOwnedProductsPanel', reminder);
    }
  }, {
    key: 'companyListReminder',
    value: function companyListReminder() {
      //this.subscribe('companyList'
      this.companyList = new AccessedRecorder('companyList');
      var reminder = this.createReminder(this.companyList);
      this.templateListener(Template.companyList, 'Template.companyList', reminder);
    }
  }, {
    key: 'adjacentSeasonReminder',
    value: function adjacentSeasonReminder() {
      //this.subscribe('adjacentSeason'
      this.adjacentSeason = new AccessedRecorder('adjacentSeason');
      var reminder = this.createReminder(this.adjacentSeason);
      this.templateListener(Template.productCenterBySeason, 'Template.productCenterBySeason', reminder);
      this.templateListener(Template.seasonalReport, 'Template.seasonalReport', reminder);
    }
  }, {
    key: 'productListBySeasonIdReminder',
    value: function productListBySeasonIdReminder() {
      //this.subscribe('productListBySeasonId'
      this.productListBySeasonId = new AccessedRecorder('productListBySeasonId');
      var reminder = this.createReminder(this.productListBySeasonId);
      this.templateListener(Template.productCenterBySeason, 'Template.productCenterBySeason', reminder);
    }
  }, {
    key: 'rankListBySeasonIdReminder',
    value: function rankListBySeasonIdReminder() {
      //this.subscribe('rankListBySeasonId'
      this.rankListBySeasonId = new AccessedRecorder('rankListBySeasonId', 30);
      var reminder = this.createReminder(this.rankListBySeasonId);
      this.templateListener(Template.seasonalReport, 'Template.seasonalReport', reminder);
    }
  }, {
    key: 'companyVipsReminder',
    value: function companyVipsReminder() {
      //this.subscribe('companyVips'
      this.companyVips = new AccessedRecorder('companyVips');
      var reminder = this.createReminder(this.companyVips);
      this.templateListener(Template.companyVipListPanel, 'Template.companyVipListPanel', reminder);
    }
  }, {
    key: 'currentUserCompanyVipReminder',
    value: function currentUserCompanyVipReminder() {
      //this.subscribe('currentUserCompanyVip'
      this.currentUserCompanyVip = new AccessedRecorder('currentUserCompanyVip');
      var reminder = this.createReminder(this.currentUserCompanyVip);
      this.templateListener(Template.companyVipListPanel, 'Template.companyVipListPanel', reminder);
    }
  }, {
    key: 'foundationListReminder',
    value: function foundationListReminder() {
      //this.subscribe('foundationList'
      this.foundationList = new AccessedRecorder('foundationList');
      var reminder = this.createReminder(this.foundationList);
      this.templateListener(Template.foundationList, 'Template.foundationList', reminder);
    }
  }, {
    key: 'foundationDetailReminder',
    value: function foundationDetailReminder() {
      //this.subscribe('foundationDetail'
      this.foundationDetail = new AccessedRecorder('foundationDetail', 10);
      var reminder = this.createReminder(this.foundationDetail);
      this.templateListener(Template.foundationDetail, 'Template.foundationDetail', reminder);
    }
  }, {
    key: 'foundationDataForEditReminder',
    value: function foundationDataForEditReminder() {
      //this.subscribe('foundationDataForEdit'
      this.foundationDataForEdit = new AccessedRecorder('foundationDataForEdit', 10);
      var reminder = this.createReminder(this.foundationDataForEdit);
      this.templateListener(Template.editFoundationPlan, 'Template.editFoundationPlan', reminder);
    }
  }, {
    key: 'companyMiningMachineInfoReminder',
    value: function companyMiningMachineInfoReminder() {
      //this.subscribe('companyMiningMachineInfo'
      this.companyMiningMachineInfo = new AccessedRecorder('companyMiningMachineInfo');
      var reminder = this.createReminder(this.companyMiningMachineInfo);
      this.templateListener(Template.companyMiningMachine, 'Template.companyMiningMachine', reminder);
    }
  }, {
    key: 'companyStonesReminder',
    value: function companyStonesReminder() {
      //this.subscribe('companyStones'
      this.companyStones = new AccessedRecorder('companyStones');
      var reminder = this.createReminder(this.companyStones);
      this.templateListener(Template.companyMiningMachine, 'Template.companyMiningMachine', reminder);
    }
  }, {
    key: 'companyCurrentUserPlacedStonesReminder',
    value: function companyCurrentUserPlacedStonesReminder() {
      //this.subscribe('companyCurrentUserPlacedStones'
      this.companyCurrentUserPlacedStones = new AccessedRecorder('companyCurrentUserPlacedStones');
      var reminder = this.createReminder(this.companyCurrentUserPlacedStones);
      this.templateListener(Template.companyMiningMachine, 'Template.companyMiningMachine', reminder);
    }
  }, {
    key: 'companyLogReminder',
    value: function companyLogReminder() {
      //this.subscribe('companyLog'
      this.companyLog = new AccessedRecorder('companyLog');
      var reminder = this.createReminder(this.companyLog);
      this.templateListener(Template.foundationLogList, 'Template.foundationLogList', reminder);
      this.templateListener(Template.companyLogList, 'Template.companyLogList', reminder);
    }
  }, {
    key: 'productListByCompanyReminder',
    value: function productListByCompanyReminder() {
      //this.subscribe('productListByCompany'
      this.productListByCompany = new AccessedRecorder('productListByCompany');
      var reminder = this.createReminder(this.productListByCompany);
      this.templateListener(Template.productCenterByCompany, 'Template.productCenterByCompany', reminder);
    }
  }, {
    key: 'companyDetailReminder',
    value: function companyDetailReminder() {
      //this.subscribe('companyDetail'
      this.companyDetail = new AccessedRecorder('companyDetail');
      var reminder = this.createReminder(this.companyDetail);
      this.templateListener(Template.companyDetail, 'Template.companyDetail', reminder);
    }
  }, {
    key: 'employeeListByCompanyReminder',
    value: function employeeListByCompanyReminder() {
      //this.subscribe('employeeListByCompany'
      this.employeeListByCompany = new AccessedRecorder('employeeListByCompany');
      var reminder = this.createReminder(this.employeeListByCompany);
      this.templateListener(Template.companyDetailNormalContent, 'Template.companyDetailNormalContent', reminder);
    }
  }, {
    key: 'companyDirectorReminder',
    value: function companyDirectorReminder() {
      //this.subscribe('companyDirector'
      this.companyDirector = new AccessedRecorder('companyDirector');
      var reminder = this.createReminder(this.companyDirector);
      this.templateListener(Template.companyDirectorList, 'Template.companyDirectorList', reminder);
    }
  }, {
    key: 'companyArenaInfoReminder',
    value: function companyArenaInfoReminder() {
      //this.subscribe('companyArenaInfo'
      this.companyArenaInfo = new AccessedRecorder('companyArenaInfo');
      var reminder = this.createReminder(this.companyArenaInfo);
      this.templateListener(Template.companyArenaInfo, 'Template.companyArenaInfo', reminder);
    }
  }, {
    key: 'legacyAnnouncementDetailReminder',
    value: function legacyAnnouncementDetailReminder() {
      //this.subscribe('legacyAnnouncementDetail'
      this.legacyAnnouncementDetail = new AccessedRecorder('legacyAnnouncementDetail', 5);
      var reminder = this.createReminder(this.legacyAnnouncementDetail);
      this.templateListener(Template.legacyAnnouncement, 'Template.legacyAnnouncement', reminder);
    }
  }, {
    key: 'validateUserReminder',
    value: function validateUserReminder() {
      //this.subscribe('validateUser'
      this.validateUser = new AccessedRecorder('validateUser');
      var reminder = this.createReminder(this.validateUser);
      this.templateListener(Template.accountDialog, 'Template.accountDialog', reminder);
    }
  }, {
    key: 'announcementListReminder',
    value: function announcementListReminder() {
      //this.subscribe('announcementList'
      this.announcementList = new AccessedRecorder('announcementList');
      var reminder = this.createReminder(this.announcementList);
      this.templateListener(Template.announcementList, 'Template.announcementList', reminder);
    }
  }, {
    key: 'allAdvertisingReminder',
    value: function allAdvertisingReminder() {
      //this.subscribe('allAdvertising'
      this.allAdvertising = new AccessedRecorder('allAdvertising', 10);
      var reminder = this.createReminder(this.allAdvertising);
      this.templateListener(Template.advertising, 'Template.advertising', reminder);
    }
  }, {
    key: 'arenaInfoReminder',
    value: function arenaInfoReminder() {
      //this.subscribe('arenaInfo'
      this.arenaInfo = new AccessedRecorder('arenaInfo');
      var reminder = this.createReminder(this.arenaInfo);
      this.templateListener(Template.arenaInfo, 'Template.arenaInfo', reminder);
    }
  }, {
    key: 'adjacentArenaReminder',
    value: function adjacentArenaReminder() {
      //this.subscribe('adjacentArena'
      this.adjacentArena = new AccessedRecorder('adjacentArena');
      var reminder = this.createReminder(this.adjacentArena);
      this.templateListener(Template.arenaInfo, 'Template.arenaInfo', reminder);
    }
  }, {
    key: 'arenaLogReminder',
    value: function arenaLogReminder() {
      //this.subscribe('arenaLog'
      this.arenaLog = new AccessedRecorder('arenaLog');
      var reminder = this.createReminder(this.arenaLog);
      this.templateListener(Template.arenaInfoLogList, 'Template.arenaInfoLogList', reminder);
    }
  }, {
    key: 'fscMembersReminder',
    value: function fscMembersReminder() {
      //this.subscribe('fscMembers'
      this.fscMembers = new AccessedRecorder('fscMembers');
      var reminder = this.createReminder(this.fscMembers);
      this.templateListener(Template.tutorial, 'Template.tutorial', reminder);
    }
  }, {
    key: 'currentUserOrdersReminder',
    value: function currentUserOrdersReminder() {
      //this.subscribe('currentUserOrders'
      this.currentUserOrders = new AccessedRecorder('currentUserOrders');
      var reminder = this.createReminder(this.currentUserOrders);
      this.templateListener(Template.companyOrderBook, 'Template.companyOrderBook', reminder);
    }
  }, {
    key: 'currentUserDirectorsReminder',
    value: function currentUserDirectorsReminder() {
      //this.subscribe('currentUserDirectors'
      this.currentUserDirectors = new AccessedRecorder('currentUserDirectors');
      var reminder = this.createReminder(this.currentUserDirectors);
      this.templateListener(Template.companyOrderBook, 'Template.companyOrderBook', reminder);
    }
  }, {
    key: 'companyOrdersReminder',
    value: function companyOrdersReminder() {
      //this.subscribe('companyOrders'
      this.companyOrders = new AccessedRecorder('companyOrders');
      var reminder = this.createReminder(this.companyOrders);
      this.templateListener(Template.companyOrderList, 'Template.companyOrderList', reminder);
    }
  }, {
    key: 'newReminder',
    value: function newReminder() {
      //this.subscribe('AAAAAAAAAAAAAAAAAA'
      this.AAAAAAAAAAAAAAAAAA = new AccessedRecorder('AAAAAAAAAAAAAAAAAA');
      var reminder = this.createReminder(this.AAAAAAAAAAAAAAAAAA);
      this.templateListener(Template.BBBBBBBBBB, 'Template.BBBBBBBBBB', reminder);
    }
  }]);

  return DisconnectReminderController;
}(EventController);

//--end file: DisconnectReminder/DisconnectReminderController
//

var MainController = function () {
  function MainController() {
    var _this43 = this;

    _classCallCheck(this, MainController);

    this.loginUser = new LoginUser();
    this.serverType = 'normal';
    var currentServer = document.location.href;
    var serverTypeTable = [{ type: /museum.acgn-stock.com/, typeName: 'museum' }, { type: /test.acgn-stock.com/, typeName: 'test' }];
    serverTypeTable.forEach(function (_ref4) {
      var type = _ref4.type,
          typeName = _ref4.typeName;

      if (currentServer.match(type)) {
        _this43.serverType = typeName;
      }
    });
    this.othersScript = [];

    var softwareScriptRoute = FlowRouter.group({
      prefix: '/SoftwareScript',
      name: 'softwareScriptRoute'
    });
    softwareScriptRoute.route('/', {
      name: 'softwareScript',
      action: function action() {
        DocHead.setTitle(Meteor.settings.public.websiteName + ' - ' + translation(['script', 'name']));
      }
    });
    softwareScriptRoute.route('/scriptVIP', {
      name: 'softwareScriptVip',
      action: function action() {
        DocHead.setTitle(Meteor.settings.public.websiteName + ' - ' + translation(['script', 'name']) + ' - ' + translation(['script', 'vip']));
      }
    });
    softwareScriptRoute.route('/about', {
      name: 'softwareScriptAbout',
      action: function action() {
        DocHead.setTitle(Meteor.settings.public.websiteName + ' - ' + translation(['script', 'name']) + ' - ' + translation(['script', 'about']));
      }
    });
    softwareScriptRoute.route('/blankPage', {
      name: 'blankPage',
      action: function action() {
        DocHead.setTitle(Meteor.settings.public.websiteName + ' - blank page');
      }
    });

    this.scriptView = new ScriptView(this);
    this.scriptView.displayDropDownMenu();
    this.scriptView.displayScriptMenu();

    this.companyListController = new CompanyListController(this.loginUser);
    this.companyDetailController = new CompanyDetailController(this.loginUser);
    this.accountInfoController = new AccountInfoController(this.loginUser);
    this.scriptVipController = new ScriptVipController(this.loginUser);
    this.aboutController = new AboutController(this.loginUser);

    this.disconnectReminderController = new DisconnectReminderController(this.loginUser);
  }

  _createClass(MainController, [{
    key: 'checkCloudUpdate',
    value: function checkCloudUpdate() {
      var cloudUpdater = new CloudUpdater(this.serverType);
      cloudUpdater.checkCompaniesUpdate();
      cloudUpdater.checkScriptVipProductsUpdate();
    }
  }, {
    key: 'showMostStockholdingCompany',
    value: function showMostStockholdingCompany() {
      console.log('start showMostStockholdingCompany()');

      var max = 30;
      var holdStocks = this.loginUser.findMostStockholdingCompany();
      var list = [];
      var localCompanies = getLocalCompanies();
      var i = 0;

      var _loop15 = function _loop15(company) {
        i += 1;
        if (i > max) {
          return 'break';
        }

        var companyData = localCompanies.find(function (x) {
          return x.companyId === company.companyId;
        });
        list.push({
          companyId: company.companyId,
          name: companyData ? companyData.name : '[unknow]'
        });
      };

      var _iteratorNormalCompletion45 = true;
      var _didIteratorError45 = false;
      var _iteratorError45 = undefined;

      try {
        for (var _iterator45 = holdStocks[Symbol.iterator](), _step45; !(_iteratorNormalCompletion45 = (_step45 = _iterator45.next()).done); _iteratorNormalCompletion45 = true) {
          var company = _step45.value;

          var _ret15 = _loop15(company);

          if (_ret15 === 'break') break;
        }
      } catch (err) {
        _didIteratorError45 = true;
        _iteratorError45 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion45 && _iterator45.return) {
            _iterator45.return();
          }
        } finally {
          if (_didIteratorError45) {
            throw _iteratorError45;
          }
        }
      }

      this.scriptView.displayMostStockholdingCompany(list);

      console.log('end showMostStockholdingCompany()');
    }
  }, {
    key: 'switchDisconnectReminder',
    value: function switchDisconnectReminder(disconnectReminderSwitch) {
      window.localStorage.setItem('SoftwareScript.disconnectReminderSwitch', JSON.stringify(disconnectReminderSwitch));
      this.scriptView.displaySwitchDisconnectReminderInfo(disconnectReminderSwitch);
    }
  }]);

  return MainController;
}();

//-end file: Global/MainController
//


//這邊記一下每個storage的格式

//localScriptAdUpdateTime       local
//date

//localScriptAd                  local
//{adLinkType: ['_self', '_blank'],
// adLink: ['/company/detail/NJbJuXaJxjJpzAJui', 'https://www.google.com.tw/'],
// adData: ['&nbsp;message&nbsp;', 'miku'],
// adFormat: ['a', 'aLink']}

//localCompaniesUpdateTime        local
//date

//localCompanies規格               local
//{companyID: String, name: String,
// chairman: String, manager: String,
// grade: String, capital: Number,
// price: Number, release: Number, profit: Number,
// vipBonusStocks: Number,
// managerBonusRatePercent: Number,
// capitalIncreaseRatePercent: Number,
// salary: Number, nextSeasonSalary: Number, employeeBonusRatePercent: Number,
// employeesNumber: Number, nextSeasonEmployeesNumber: Number
// tags: Array,
// createdAt: String
//}

//sessionUsers的格式         session
//{userId: 'CWgfhqxbrJMxsknrb',
// holdStocks: [{companyId: aaa, stocks: Number, vip: Number}, {}],
// managers: [{companyId: aaa}, {}],
// employee: 'aaa',
// money: Number,
// ticket: Number}

//localScriptVipProductsUpdateTime        local
//date

//localScriptVipProducts
// {
//   userId: 'CWgfhqxbrJMxsknrb',
//   products: [
//     {
//       productId: '5GEdNG5hjs85ahpxN',
//       point: 100,
//       amount: 0,
//       companyId: 'NH2NhXHkpw8rTuQvx',
//       description: 'ABC'
//     }
//   ]
// }

//localDisplayScriptAd    local
// Boolean

/*************************************/
/*************StartScript*************/

function checkSeriousError() {
  //這個function將會清空所有由本插件控制的localStorage
  //用於如果上一版發生嚴重錯誤導致localStorage錯亂，以致插件無法正常啟動時
  //或是用於當插件更新時，需要重設localStorage

  var seriousErrorVersion = 5.05;
  //seriousErrorVersion會輸入有問題的版本號，當發生問題時我會增加本數字，或是於更新需要時亦會增加
  //使用者本地的數字紀錄如果小於這個數字將會清空所有localStorage

  var lastErrorVersion = Number(window.localStorage.getItem('lastErrorVersion')) || 0;
  //lastErrorVersion = 0;  //你如果覺得現在就有問題 可以把這行的註解取消掉來清空localStorage

  if (Number.isNaN(lastErrorVersion)) {
    lastErrorVersion = 0;
    console.log('reset lastErrorVersion as 0');
  } else {
    console.log('localStorage of lastErrorVersion is work');
  }

  if (lastErrorVersion < seriousErrorVersion) {
    console.log('last version has serious error, start remove all localStorage');
    window.localStorage.removeItem('localCompaniesUpdateTime');
    window.localStorage.removeItem('localCompanies');
    window.localStorage.removeItem('localScriptAdUpdateTime');
    window.localStorage.removeItem('localScriptAd');
    window.localStorage.removeItem('localScriptVipProductsUpdateTime');
    window.localStorage.removeItem('localScriptVipProducts');
    window.localStorage.removeItem('localDisplayScriptAd');
    //window.localStorage.removeItem('localSearchTables');
    window.sessionStorage.removeItem('sessionUsers');

    // 舊資料
    window.localStorage.removeItem('local_CsDatas_UpdateTime');
    window.localStorage.removeItem('local_CsDatas');
    window.localStorage.removeItem('local_scriptAD_UpdateTime');
    window.localStorage.removeItem('local_scriptAD');
    window.localStorage.removeItem('local_dataSearch');
    window.localStorage.removeItem('local_scriptAD_use');
    window.localStorage.removeItem('local_scriptVIP_UpdateTime');
    window.localStorage.removeItem('local_scriptVIP');

    window.localStorage.removeItem('lastErrorVersion');
    lastErrorVersion = seriousErrorVersion;
    window.localStorage.setItem('lastErrorVersion', JSON.stringify(lastErrorVersion));
  }
}

function checkScriptUpdate() {
  var oReq = new XMLHttpRequest();
  var checkScriptVersion = function checkScriptVersion() {
    var obj = JSON.parse(oReq.responseText);
    var myVersion = GM_info.script.version; // eslint-disable-line camelcase
    console.log(obj.version.substr(0, 4) + ',' + myVersion.substr(0, 4) + ',' + (obj.version.substr(0, 4) > myVersion.substr(0, 4)));
    if (obj.version.substr(0, 4) > myVersion.substr(0, 4)) {
      var updateButton = $('\n        <li class=\'nav-item\'>\n          <a class=\'nav-link btn btn-primary\'\n          href=\'https://greasyfork.org/zh-TW/scripts/33542\'\n          name=\'updateSoftwareScript\'\n          target=\'Blank\'\n          >' + translation(['script', 'updateScript']) + '</a>\n        </li>\n      ');
      updateButton.insertAfter($('.nav-item')[$('.nav-item').length - 1]);
    } else {
      setTimeout(checkScriptUpdate, 600000);
    }
  };
  oReq.addEventListener('load', checkScriptVersion);
  oReq.open('GET', 'https://greasyfork.org/scripts/33542.json');
  oReq.send();
}

(function () {
  checkSeriousError();
  checkScriptUpdate();

  setTimeout(startScript, 0);
})();

function startScript() {
  var main = new MainController();
  main.checkCloudUpdate();
}

/*************StartScript*************/
/*************************************/

//end file: main
//
