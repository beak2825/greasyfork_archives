/* eslint-disable */
//after Babel
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// ==UserScript==
// @name         ACGN-stock營利統計外掛
// @namespace    http://tampermonkey.net/
// @version      5.00.00
// @description  隱藏著排他力量的分紅啊，請在我面前顯示你真正的面貌，與你締結契約的VIP命令你，封印解除！
// @author       SoftwareSing
// @match        http://acgn-stock.com/*
// @match        https://acgn-stock.com/*
// @match        https://test.acgn-stock.com/*
// @match        https://museum.acgn-stock.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39150/ACGN-stock%E7%87%9F%E5%88%A9%E7%B5%B1%E8%A8%88%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/39150/ACGN-stock%E7%87%9F%E5%88%A9%E7%B5%B1%E8%A8%88%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==

//版本號為'主要版本號 + '.' + 次要版本號 + 錯誤修正版本號，ex 8.31.39
//修復導致功能失效的錯誤或更新重大功能提升主要或次要版本號
//優化UI，優化效能，優化小錯誤更新錯誤版本號
//本腳本修改自 'ACGN股票系統每股營利外掛 2.200 by papago89'


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
// managerProfitPercent: 0.05,
// salary: Number, nextSeasonSalary: Number, bonus: Number,
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
/*************************************/
/*************StartScript*************/

function checkSeriousError() {
  //這個function將會清空所有由本插件控制的localStorage
  //用於如果上一版發生嚴重錯誤導致localStorage錯亂，以致插件無法正常啟動時
  //或是用於當插件更新時，需要重設localStorage

  var seriousErrorVersion = 4.999999;
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
    window.localStorage.removeItem('localSearchTables');
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
  main.showScriptAd();
}

/*************StartScript*************/
/*************************************/
/*************************************/
/***************import****************/

var _require = require('./db/dbSeason'),
    getCurrentSeason = _require.getCurrentSeason,
    getInitialVoteTicketCount = _require.getInitialVoteTicketCount;

var _require2 = require('./client/layout/alertDialog.js'),
    alertDialog = _require2.alertDialog;

var _require3 = require('./db/dbCompanies.js'),
    dbCompanies = _require3.dbCompanies;

var _require4 = require('./db/dbEmployees.js'),
    dbEmployees = _require4.dbEmployees;

var _require5 = require('./db/dbVips.js'),
    dbVips = _require5.dbVips;

var _require6 = require('./db/dbDirectors.js'),
    dbDirectors = _require6.dbDirectors;

var _require7 = require('./db/dbOrders.js'),
    dbOrders = _require7.dbOrders;

var _require8 = require('./db/dbUserOwnedProducts.js'),
    dbUserOwnedProducts = _require8.dbUserOwnedProducts;

/***************import****************/
/*************************************/
/*************************************/
/**************function***************/

/**
 * 計算每股盈餘(包含VIP排他)
 * @param {Company} company 公司物件
 * @return {Number} 每股盈餘
 */


function earnPerShare(company) {
  var stocksProfitPercent = 1 - company.managerProfitPercent - 0.15;
  if (company.employeesNumber > 0) {
    stocksProfitPercent -= company.bonus * 0.01;
  }

  return company.profit * stocksProfitPercent / (company.release + company.vipBonusStocks);
}

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

/**
 * 過濾字串
 * @param {String} s 被過濾的字串
 * @return {String} 過濾完的字串
 */
function stripscript(s) {
  var pattern = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>/?~\uFF01@#\uFFE5\u2026\u2026&*\uFF08\uFF09\u2014\u2014|{}\u3010\u3011\u2018\uFF1B\uFF1A\u201D\u201C\'\u3002\uFF0C\u3001\uFF1F]');
  var rs = '';
  for (var i = 0; i < s.length; i += 1) {
    rs = rs + s.substr(i, 1).replace(pattern, '');
  }

  return rs;
}

/**************function***************/
/*************************************/
/*************************************/
/****************class****************/

var MainController = function () {
  function MainController() {
    var _this = this;

    _classCallCheck(this, MainController);

    this.loginUser = new LoginUser();
    this.serverType = 'normal';
    var currentServer = document.location.href;
    var serverTypeTable = [{ type: /museum.acgn-stock.com/, typeName: 'museum' }, { type: /test.acgn-stock.com/, typeName: 'test' }];
    serverTypeTable.forEach(function (_ref) {
      var type = _ref.type,
          typeName = _ref.typeName;

      if (currentServer.match(type)) {
        _this.serverType = typeName;
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
    softwareScriptRoute.route('/blankPage', {
      name: 'blankPage',
      action: function action() {
        DocHead.setTitle(Meteor.settings.public.websiteName + ' - blank page');
      }
    });

    this.scriptView = new ScriptView();
    this.scriptView.dispalyDropDownMenu();
    this.scriptView.displayScriptMenu();

    this.companyListController = new CompanyListController(this.loginUser);
    this.companyDetailController = new CompanyDetailController(this.loginUser);
    this.accountInfoController = new AccountInfoController(this.loginUser);
    this.scriptVipController = new ScriptVipController(this.loginUser);
  }

  _createClass(MainController, [{
    key: 'checkCloudUpdate',
    value: function checkCloudUpdate() {
      var cloudUpdater = new CloudUpdater(this.serverType);
      cloudUpdater.checkCompaniesUpdate();
      cloudUpdater.checkScriptAdUpdate();
      cloudUpdater.checkScriptVipProductsUpdate();
    }
  }, {
    key: 'showScriptAd',
    value: function showScriptAd() {
      var scriptAd = new ScriptAd();
      scriptAd.removeScriptAd();
      scriptAd.displayScriptAd();
    }
  }]);

  return MainController;
}();

/**
 * 用來連線雲端以更新資料
 * @param {String} serverType 現在連的股市伺服器
 */


var CloudUpdater = function () {
  function CloudUpdater(serverType) {
    _classCallCheck(this, CloudUpdater);

    this.serverType = serverType;
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
      var cloud = this.getWebData(url);
      cloud(function (cloudTime) {
        console.log('cloud url: ' + url);
        console.log(localUpdateTime + ' === ' + cloudTime + ': ' + (localUpdateTime === cloudTime));
        if (cloudTime === localUpdateTime) {
          console.log('cloud don\'t have new data');
          console.log('');
        } else {
          console.log('cloud have new data');
          console.log('');
          updater(cloudTime);
        }
      });
    }
  }, {
    key: 'checkCompaniesUpdate',
    value: function checkCompaniesUpdate() {
      var _this2 = this;

      var timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptCompany/updateTime.json';
      var dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptCompany/companies.json';
      if (this.serverType === 'museum') {
        dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/companys.json';
        timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-museum/script/company/updateTime.json';
      }

      var updater = function updater(cloudTime) {
        var cloud = _this2.getWebData(dataUrl);
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
    key: 'checkScriptAdUpdate',
    value: function checkScriptAdUpdate() {
      var _this3 = this;

      var timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptAD/updateTime.json';
      var dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptAD/AD.json';

      var updater = function updater(cloudTime) {
        var cloud = _this3.getWebData(dataUrl);
        cloud(function (cloudData) {
          var inputData = cloudData || [];
          window.localStorage.setItem('localScriptAd', JSON.stringify(inputData));
          var inputTime = cloudTime || 'null';
          window.localStorage.setItem('localScriptAdUpdateTime', JSON.stringify(inputTime));

          var scriptAd = new ScriptAd();
          scriptAd.removeScriptAd();
          scriptAd.displayScriptAd();

          console.log('scriptAd update complete');
        });
      };
      var localScriptAdUpdateTime = JSON.parse(window.localStorage.getItem('localScriptAdUpdateTime')) || 'null';
      this.checkUpdateTime(timeUrl, localScriptAdUpdateTime, updater);
    }
  }, {
    key: 'checkScriptVipProductsUpdate',
    value: function checkScriptVipProductsUpdate() {
      var _this4 = this;

      var timeUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/updateTime.json';
      var dataUrl = 'https://acgnstock-data.firebaseio.com/ACGNstock-normal/scriptVIP/scriptVipProducts.json';

      var updater = function updater(cloudTime) {
        var cloud = _this4.getWebData(dataUrl);
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

var ScriptVip = function () {
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
      var _this5 = this;

      var localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
      var i = localScriptVipProducts.findIndex(function (x) {
        return x.userId === _this5.user.userId;
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
      var _this6 = this;

      var localScriptVipProducts = JSON.parse(window.localStorage.getItem('localScriptVipProducts')) || [];
      var data = localScriptVipProducts.find(function (x) {
        return x.userId === _this6.user.userId;
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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.products[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var product = _step.value;

          point += product.point * product.amount;
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
      var _this7 = this;

      this.loadFromLocalstorage();

      var serverUserOwnedProducts = dbUserOwnedProducts.find({ userId: this.user.userId }).fetch();
      var isChange = false;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        var _loop = function _loop() {
          var p = _step2.value;

          var i = _this7.products.findIndex(function (x) {
            return x.productId === p.productId;
          });
          if (i !== -1) {
            isChange = true;
            _this7.products[i].amount = p.amount;
          }
        };

        for (var _iterator2 = serverUserOwnedProducts[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          _loop();
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
        this.updateToLocalstorage();
      }
    }
  }]);

  return ScriptVip;
}();

//監聽頁面，資料準備完成時執行event
//不應該直接呼叫，他應該被繼承
//使用例:
// class CompanyDetailController extends EventController {
//   constructor(user) {
//     super('CompanyDetailController', user);
//     this.templateListener(Template.companyDetailContentNormal, 'Template.companyDetailContentNormal', this.startEvent);
//     this.templateListener(Template.companyDetail, 'Template.companyDetail', this.startEvent2);
//   }
//   startEvent() {
//     console.log('companyDetailContentNormal success');
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
 * 建構頁面的Controller
 * @param {String} controllerName 名字
 * @param {LoginUser} loginUser 登入的使用者
 */


var EventController = function () {
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
        var _this8 = this;

        var rIsDataReady = new ReactiveVar(false);
        this.autorun(function () {
          rIsDataReady.set(_this8.subscriptionsReady());
        });
        this.autorun(function () {
          if (rIsDataReady.get()) {
            console.log(templateName + ' loaded');
            callback();
          } else {
            console.log(templateName + ' is loading');
          }
        });
      });
    }
  }]);

  return EventController;
}();

/**
 * View
 * @param {String} name View的name
 */


var View = function () {
  function View(name) {
    _classCallCheck(this, View);

    console.log('create View: ' + name);
  }

  /**
   * 創建內部用H2元素的資訊列
   * @param {{name: String, leftText: String, rightText: String, customSetting: {left, right}}} options 設定
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

      var r = $('\n      <div class=\'media border-grid-body\' name=\'' + name + '\'>\n        <div class=\'col-6 text-right border-grid\' name=\'' + name + '\' id=\'h2Left\'>\n          <h2 name=\'' + name + '\' id=\'h2Left\' ' + customSetting.left + '>' + leftText + '</h2>\n        </div>\n        <div class=\'col-6 text-right border-grid\' name=\'' + name + '\' id=\'h2Right\'>\n          <h2 name=\'' + name + '\' id=\'h2Right\' ' + customSetting.right + '>' + rightText + '</h2>\n        </div>\n      </div>\n    ');

      return r;
    }

    /**
     * 創建table元素
     * @param {{name: String, tHead: Array, tBody: Array, customSetting: {table: String, tHead: String, tBody: String}}} options 設定
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

      var head = '';
      head += '<tr>';
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = tHead[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var h = _step3.value;

          head += '<th name=' + name + ' ' + customSetting.tHead + '>' + h + '</th>';
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

      head += '</tr>';

      var body = '';
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = tBody[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var row = _step4.value;

          body += '<tr>';
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = row[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var column = _step5.value;

              body += '<td name=' + name + ' ' + customSetting.tBody + '>' + column + '</td>';
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

          body += '</tr>';
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

      var r = $('\n      <table border=\'1\' name=' + name + ' ' + customSetting.table + '>\n        <thead name=' + name + '>\n          ' + head + '\n        </thead>\n        <tbody name=' + name + '>\n          ' + body + '\n        </tbody>\n      </table>\n    ');

      return r;
    }

    /**
     * 創建button元素.
     * size預設為'btn-sm', color預設為'btn-info'
     * @param {{name: String, size: String, color: String, text: String, customSetting: String}} options 設定
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

      var r = $('\n      <button class=\'btn ' + color + ' ' + size + '\' name=\'' + name + '\' ' + customSetting + '>' + text + '</button>\n    ');

      return r;
    }

    /**
     * 創建select元素.
     * @param {{name: String, customSetting: String}} options 設定
     * @return {jquery.$select} select元素
     */

  }, {
    key: 'createSelect',
    value: function createSelect(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';

      var r = $('\n      <select class=\'form-control\' name=\'' + name + '\' ' + customSetting + '>\n      </select>\n    ');

      return r;
    }

    /**
     * 創建option元素.
     * text同時用於 顯示文字 與 指定的value
     * @param {{name: String, text: String, customSetting: String}} options 設定
     * @return {jquery.$option} select元素
     */

  }, {
    key: 'createSelectOption',
    value: function createSelectOption(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';
      var text = options.text || 'defaultText';

      var r = $('\n      <option name=\'' + name + '\' value=\'' + text + '\' ' + customSetting + '>' + text + '</option>\n    ');

      return r;
    }

    /**
     * 創建input元素.
     * @param {{name: String, defaultText: String, placeholder: String, type: String, customSetting: String}} options 設定
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

      var r = $('\n      <input class=\'form-control\'\n        name=\'' + name + '\'\n        type=\'' + type + '\'\n        placeholder=\'' + placeholder + '\'\n        value=\'' + defaultValue + '\'\n        ' + customSetting + '\n      />\n    ');

      return r;
    }

    /**
     * 創建a元素.
     * 如不需要超連結 僅純顯示文字 請不要設定href,
     * 如不需要新開頁面 則不用設定target
     * @param {{name: String, href: String, target: String, text: String, customSetting: String}} options 設定
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

      var r = $('\n      <a class=\'float-left\'\n        name=\'' + name + '\'\n        ' + href + '\n        ' + target + '\n        ' + customSetting + '\n      >' + text + '</a>\n    ');

      return r;
    }

    /**
     * 創建DropDownMenu
     * @param {{name: String, text: String, customSetting: String}} options 設定
     * @return {jquery.$div} DropDownMenu
     */

  }, {
    key: 'createDropDownMenu',
    value: function createDropDownMenu(options) {
      var name = options.name || 'defaultName';
      var customSetting = options.customSetting || '';
      var text = options.text || '';

      var r = $('\n      <div class=\'note\' name=\'' + name + '\'>\n        <li class=\'nav-item dropdown text-nowrap\' name=\'' + name + '\'>\n          <a class=\'nav-link dropdown-toggle\' href=\'#\' data-toggle=\'dropdown\' name=\'' + name + '\' ' + customSetting + '>' + text + '</a>\n          <div class=\'dropdown-menu px-3 nav-dropdown-menu\'\n            aria-labelledby=\'navbarDropdownMenuLink\'\n            name=\'' + name + '\'>\n            <div name=\'' + name + '\' id=\'afterThis\'>\n            </div>\n          </div>\n        </li>\n      </div>\n    ');

      return r;
    }

    /**
     * 創建DropDownMenu的option
     * @param {{name: String, text: String, href: String, target: String, customSetting: String}} options 設定
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

      var r = $('\n      <li class=\'nav-item\' name=\'' + name + '\'>\n        <a class=\'nav-link text-truncate\'\n          name=\'' + name + '\'\n          ' + href + '\n          ' + target + '\n          ' + customSetting + '\n        >' + text + '</a>\n      </li>\n    ');

      return r;
    }
  }]);

  return View;
}();

/**
 * 控制所有頁面都看的到的物件的View
 */


var ScriptView = function (_View) {
  _inherits(ScriptView, _View);

  function ScriptView() {
    _classCallCheck(this, ScriptView);

    return _possibleConstructorReturn(this, (ScriptView.__proto__ || Object.getPrototypeOf(ScriptView)).call(this, 'ScriptView'));
  }

  _createClass(ScriptView, [{
    key: 'dispalyDropDownMenu',
    value: function dispalyDropDownMenu() {
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
     * @param {$jquerySelect} afterObject insertAfter的物件
     * @return {void}
     */

  }, {
    key: 'dispalyDropDownMenuOption',
    value: function dispalyDropDownMenuOption(options, afterObject) {
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

      displayObject.insertAfter(afterObject);
    }
  }, {
    key: 'displayScriptMenu',
    value: function displayScriptMenu() {
      this.dispalyDropDownMenuOption({
        name: 'scriptVipPage',
        text: translation(['script', 'vip']),
        href: '/SoftwareScript/scriptVIP'
      }, $('div[id=\'afterThis\'][name=\'softwareScriptMenu\']')[0]);
    }
  }]);

  return ScriptView;
}(View);

/**
 * 外掛廣告
 */


var ScriptAd = function () {
  function ScriptAd() {
    _classCallCheck(this, ScriptAd);

    console.log('create: ScriptAd');
  }

  /**
   * 回傳廣告顯示的文字
   * @param {Boolean} demo 是否用於demo
   * @return {String} HTML代碼
   */


  _createClass(ScriptAd, [{
    key: 'createAdMsg',
    value: function createAdMsg(demo) {
      var demoType = demo ? 'demo=\'true\'' : 'demo=\'false\'';
      var localScriptAd = JSON.parse(window.localStorage.getItem('localScriptAd')) || {};
      var msg = '<a class=\'float-left\' name=\'scriptAd\' id=\'0\'>&nbsp;&nbsp;</a>';
      var linkNumber = 0;

      if (localScriptAd.adFormat) {
        for (var _i = 0; _i < localScriptAd.adFormat.length; _i += 1) {
          if (localScriptAd.adFormat[_i] === 'a') {
            msg += '<a class=\'float-left\' name=\'scriptAd\' id=\'' + (_i + 1) + '\' ' + demoType + '>' + localScriptAd.adData[_i] + '</a>';
          } else if (localScriptAd.adFormat[_i] === 'aLink') {
            var linkType = localScriptAd.adLinkType[linkNumber];
            var type = '';
            if (linkType === '_blank' || linkType === '_parent' || linkType === '_top') {
              type = 'target=\'' + linkType + '\'';
            }
            var href = 'href=\'' + localScriptAd.adLink[linkNumber] + '\'';
            msg += '<a class=\'float-left\' name=\'scriptAd\' id=\'' + (_i + 1) + '\' ' + demoType + ' ' + type + ' ' + href + '>' + localScriptAd.adData[_i] + '</a>';

            linkNumber += 1;
          }
        }
      }

      return msg;
    }
  }, {
    key: 'displayScriptAd',
    value: function displayScriptAd() {
      var msg = this.createAdMsg(false);
      var afterObject = $('a[class=\'text-danger float-left\'][href=\'https://github.com/mrbigmouth/acgn-stock/issues\']')[0];
      $(msg).insertAfter(afterObject);
    }
  }, {
    key: 'removeScriptAd',
    value: function removeScriptAd() {
      $('a[name=\'scriptAd\'][demo=\'false\']').remove();
    }
  }]);

  return ScriptAd;
}();

/**
 * 用於存放AccountInfo頁面中的user資訊
 * @param {String} id userId
 */


var User = function () {
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
      var _this10 = this;

      console.log('---start saveToSessionstorage()');

      var sessionUsers = JSON.parse(window.sessionStorage.getItem('sessionUsers')) || [];
      var i = sessionUsers.findIndex(function (x) {
        return x.userId === _this10.userId;
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
      var _this11 = this;

      console.log('---start loadFromSessionstorage()');

      var sessionUsers = JSON.parse(window.sessionStorage.getItem('sessionUsers')) || [];
      var sUser = sessionUsers.find(function (x) {
        return x.userId === _this11.userId;
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
      var _this12 = this;

      console.log('---start updateHoldStocks()');

      this.loadFromSessionstorage();

      var serverDirectors = dbDirectors.find({ userId: this.userId }).fetch();
      var isChange = false;
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        var _loop2 = function _loop2() {
          var c = _step6.value;

          var i = _this12.holdStocks.findIndex(function (x) {
            return x.companyId === c.companyId;
          });
          if (i !== -1) {
            if (_this12.holdStocks[i].stocks !== c.stocks) {
              isChange = true;
              _this12.holdStocks[i].stocks = c.stocks;
            }
          } else {
            isChange = true;
            _this12.holdStocks.push({ companyId: c.companyId, stocks: c.stocks, vip: null });
          }
        };

        for (var _iterator6 = serverDirectors[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          _loop2();
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

      if (isChange) {
        this.saveToSessionstorage();
      }

      console.log('---end updateHoldStocks()');
    }
  }, {
    key: 'updateVips',
    value: function updateVips() {
      var _this13 = this;

      console.log('---start updateVips()');

      this.loadFromSessionstorage();

      var isChange = false;
      var serverVips = dbVips.find({ userId: this.userId }).fetch();
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        var _loop3 = function _loop3() {
          var serverVip = _step7.value;

          var i = _this13.holdStocks.findIndex(function (x) {
            return x.companyId === serverVip.companyId;
          });
          if (i !== -1) {
            if (_this13.holdStocks[i].vip !== serverVip.level) {
              isChange = true;
              _this13.holdStocks[i].vip = serverVip.level;
            }
          } else {
            isChange = true;
            _this13.holdStocks.push({ companyId: serverVip.companyId, stocks: 0, vip: serverVip.level });
          }
        };

        for (var _iterator7 = serverVips[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          _loop3();
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

      if (isChange) {
        this.saveToSessionstorage();
      }

      console.log('---end updateVips()');
    }
  }, {
    key: 'updateManagers',
    value: function updateManagers() {
      var _this14 = this;

      console.log('---start updateManagers()');

      this.loadFromSessionstorage();

      var serverCompanies = dbCompanies.find({ manager: this.userId }).fetch();
      var isChange = false;
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        var _loop4 = function _loop4() {
          var c = _step8.value;

          if (_this14.managers.find(function (x) {
            return x.companyId === c._id;
          }) === undefined) {
            isChange = true;
            _this14.managers.push({ companyId: c._id });
          }
        };

        for (var _iterator8 = serverCompanies[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          _loop4();
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
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = serverEmployees[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var emp = _step9.value;

          if (emp.employed) {
            if (this.employee !== emp.companyId) {
              isChange = true;
              this.employee = emp.companyId;
            }
          }
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

      if (isChange) {
        this.saveToSessionstorage();
      }

      console.log('---end updateEmployee()');
    }
  }, {
    key: 'updateUser',
    value: function updateUser() {
      var _this15 = this;

      console.log('---start updateUser()');

      this.loadFromSessionstorage();

      var isChange = false;
      var serverUsers = Meteor.users.find({ _id: this.userId }).fetch();
      var serverUser = serverUsers.find(function (x) {
        return x._id === _this15.userId;
      });
      if (serverUser !== undefined) {
        if (this.name !== serverUser.username && this.money !== serverUser.profile.money && this.ticket !== serverUser.profile.voteTickets) {
          isChange = true;
          this.name = serverUser.username;
          this.money = serverUser.profile.money;
          this.ticket = serverUser.profile.voteTickets;
        }
      }

      if (isChange) {
        this.saveToSessionstorage();
      }

      console.log('---end updateUser()');
    }
  }, {
    key: 'computeCompanyNumber',
    value: function computeCompanyNumber() {
      console.log('---start computeCompanyNumber()');

      var number = 0;
      var _iteratorNormalCompletion10 = true;
      var _didIteratorError10 = false;
      var _iteratorError10 = undefined;

      try {
        for (var _iterator10 = this.holdStocks[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
          var _c = _step10.value;

          if (_c.stocks > 0) {
            number += 1;
          }
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

      console.log('---end computeCompanyNumber(): ' + number);

      return number;
    }
  }, {
    key: 'computeAsset',
    value: function computeAsset() {
      console.log('---start computeAsset()');

      var asset = 0;
      var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      var _iteratorNormalCompletion11 = true;
      var _didIteratorError11 = false;
      var _iteratorError11 = undefined;

      try {
        var _loop5 = function _loop5() {
          var c = _step11.value;

          var companyData = localCompanies.find(function (x) {
            return x.companyId === c.companyId;
          });
          if (companyData !== undefined) {
            asset += Number(companyData.price * c.stocks);
          } else {
            console.log('-----computeAsset(): not find companyId: ' + c.companyId);
          }
        };

        for (var _iterator11 = this.holdStocks[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
          _loop5();
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

      console.log('---end computeAsset(): ' + asset);

      return asset;
    }
  }, {
    key: 'computeProfit',
    value: function computeProfit() {
      console.log('---start computeProfit()');

      var profit = 0;
      var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      var _iteratorNormalCompletion12 = true;
      var _didIteratorError12 = false;
      var _iteratorError12 = undefined;

      try {
        var _loop6 = function _loop6() {
          var c = _step12.value;

          var companyData = localCompanies.find(function (x) {
            return x.companyId === c.companyId;
          });
          if (companyData !== undefined) {
            profit += Math.ceil(earnPerShare(companyData) * effectiveStocks(c.stocks, c.vip));
          } else {
            console.log('-----computeProfit(): not find companyId: ' + c.companyId);
          }
        };

        for (var _iterator12 = this.holdStocks[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
          _loop6();
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

      console.log('---end computeProfit(): ' + profit);

      return profit;
    }
  }, {
    key: 'computeManagersProfit',
    value: function computeManagersProfit() {
      console.log('---start computeManagersProfit()');

      var managerProfit = 0;
      var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      var _iteratorNormalCompletion13 = true;
      var _didIteratorError13 = false;
      var _iteratorError13 = undefined;

      try {
        var _loop7 = function _loop7() {
          var c = _step13.value;

          var companyData = localCompanies.find(function (x) {
            return x.companyId === c.companyId;
          });
          if (companyData !== undefined) {
            managerProfit += Math.ceil(companyData.profit * companyData.managerProfitPercent);
          } else {
            console.log('-----computeManagersProfit(): not find companyId: ' + c.companyId);
          }
        };

        for (var _iterator13 = this.managers[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
          _loop7();
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

      console.log('---end computeManagersProfit(): ' + managerProfit);

      return managerProfit;
    }
  }, {
    key: 'computeEmployeeBonus',
    value: function computeEmployeeBonus() {
      var _this16 = this;

      console.log('---start computeEmployeeBonus()');

      var bonus = 0;
      if (this.employee !== '') {
        var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
        var _companyData = localCompanies.find(function (x) {
          return x.companyId === _this16.employee;
        });
        if (_companyData !== undefined) {
          if (_companyData.employeesNumber !== 0) {
            var totalBonus = _companyData.profit * _companyData.bonus * 0.01;
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
      var _this17 = this;

      console.log('---start computeProductVotingRewards()');

      var reward = 0;

      //計算系統推薦票回饋
      var systemProductVotingReward = Meteor.settings.public.systemProductVotingReward;

      var totalReward = systemProductVotingReward;
      var initialVoteTicketCount = getInitialVoteTicketCount(getCurrentSeason());
      var count = initialVoteTicketCount - this.ticket;
      reward += count >= initialVoteTicketCount ? totalReward : Math.ceil(totalReward * count / 100);

      //計算公司推薦票回饋
      if (this.employee !== '') {
        var employeeProductVotingRewardFactor = Meteor.settings.public.employeeProductVotingRewardFactor;

        var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
        var _companyData2 = localCompanies.find(function (x) {
          return x.companyId === _this17.employee;
        });
        if (_companyData2 !== undefined) {
          if (_companyData2.employeesNumber !== 0) {
            var baseReward = employeeProductVotingRewardFactor * _companyData2.profit;
            //因為沒辦法得知全部員工投票數，以其他所有員工都有投完票來計算
            var totalEmployeeVoteTickets = initialVoteTicketCount * (_companyData2.employeesNumber - 1) + count;
            reward += Math.ceil(baseReward * count / totalEmployeeVoteTickets);
          }
        }
      }

      console.log('---end computeProductVotingRewards(): ' + reward);

      return reward;
    }
  }, {
    key: 'computeTotalWealth',
    value: function computeTotalWealth() {
      var totalWealth = this.money + this.computeAsset() + this.computeProfit() + this.computeManagersProfit() + this.computeEmployeeBonus() + this.computeProductVotingRewards();
      console.log('---computeTotalWealth(): ' + totalWealth);

      return totalWealth;
    }
  }, {
    key: 'computeTax',
    value: function computeTax() {
      console.log('---start computeTax()');

      var totalWealth = this.computeTotalWealth();

      var taxRateTable = [{ asset: 10000, rate: 0.00, adjustment: 0 }, { asset: 100000, rate: 0.03, adjustment: 300 }, { asset: 500000, rate: 0.06, adjustment: 3300 }, { asset: 1000000, rate: 0.09, adjustment: 18300 }, { asset: 2000000, rate: 0.12, adjustment: 48300 }, { asset: 3000000, rate: 0.15, adjustment: 108300 }, { asset: 4000000, rate: 0.18, adjustment: 198300 }, { asset: 5000000, rate: 0.21, adjustment: 318300 }, { asset: 6000000, rate: 0.24, adjustment: 468300 }, { asset: 7000000, rate: 0.27, adjustment: 648300 }, { asset: 8000000, rate: 0.30, adjustment: 858300 }, { asset: 9000000, rate: 0.33, adjustment: 1098300 }, { asset: 10000000, rate: 0.36, adjustment: 1368300 }, { asset: 11000000, rate: 0.39, adjustment: 1668300 }, { asset: 12000000, rate: 0.42, adjustment: 1998300 }, { asset: 13000000, rate: 0.45, adjustment: 2358300 }, { asset: 14000000, rate: 0.48, adjustment: 2748300 }, { asset: 15000000, rate: 0.51, adjustment: 3168300 }, { asset: 16000000, rate: 0.54, adjustment: 3618300 }, { asset: 17000000, rate: 0.57, adjustment: 4098300 }, { asset: Infinity, rate: 0.60, adjustment: 4608300 }];

      var _taxRateTable$find = taxRateTable.find(function (e) {
        return totalWealth < e.asset;
      }),
          rate = _taxRateTable$find.rate,
          adjustment = _taxRateTable$find.adjustment;

      var tax = Math.ceil(totalWealth * rate - adjustment);

      console.log('---end computeTax(): ' + tax);

      return tax;
    }
  }]);

  return User;
}();

/**
 * 目前登入中的使用者
 */


var LoginUser = function (_User) {
  _inherits(LoginUser, _User);

  function LoginUser() {
    _classCallCheck(this, LoginUser);

    var id = Meteor.userId();
    console.log('create LoginUser: ' + id);

    var _this18 = _possibleConstructorReturn(this, (LoginUser.__proto__ || Object.getPrototypeOf(LoginUser)).call(this, id));

    _this18.orders = [];
    _this18.scriptVip = new ScriptVip(_this18);

    _this18.directorsCache = [];

    Template.accountDialog.onRendered(function () {
      setTimeout(function () {
        _this18.changeLoginUser();
      }, 1000);
    });

    console.log('');
    return _this18;
  }

  //可能是原本沒登入後來登入了，所以要寫入id，或是分身......


  _createClass(LoginUser, [{
    key: 'changeLoginUser',
    value: function changeLoginUser() {
      var _this19 = this;

      console.log('try to changeLoginUser......');
      var id = Meteor.userId();
      if (id) {
        console.log('LoginUser: new ID: ' + id);
        this.userId = id;
      } else {
        setTimeout(function () {
          _this19.changeLoginUser();
        }, 1000);
      }
    }
  }, {
    key: 'updateFullHoldStocks',
    value: function updateFullHoldStocks() {
      var _this20 = this;

      console.log('---start updateFullHoldStocks()');

      this.loadFromSessionstorage();

      var serverDirectors = dbDirectors.find({ userId: this.userId }).fetch();
      //避免多次不必要的重複寫入，檢查是否與快取的一模一樣
      if (JSON.stringify(serverDirectors) !== JSON.stringify(this.directorsCache)) {
        var oldHoldStocks = this.holdStocks;
        this.holdStocks = [];
        var _iteratorNormalCompletion14 = true;
        var _didIteratorError14 = false;
        var _iteratorError14 = undefined;

        try {
          var _loop8 = function _loop8() {
            var c = _step14.value;

            var oldC = oldHoldStocks.find(function (x) {
              return x.companyId === c.companyId;
            });
            //從舊資料中獲取vip等級資訊，避免將vip資訊洗掉
            var vipLevel = oldC !== undefined ? oldC.vip : null;
            _this20.holdStocks.push({ companyId: c.companyId, stocks: c.stocks, vip: vipLevel });
          };

          for (var _iterator14 = serverDirectors[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
            _loop8();
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
      var _iteratorNormalCompletion15 = true;
      var _didIteratorError15 = false;
      var _iteratorError15 = undefined;

      try {
        for (var _iterator15 = this.orders[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
          var order = _step15.value;

          if (order.orderType === '購入') {
            money += order.unitPrice * (order.amount - order.done);
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

      console.log('---end computeBuyOrdersMoney(): ' + money);

      return money;
    }
  }, {
    key: 'computeSellOrdersAsset',
    value: function computeSellOrdersAsset() {
      console.log('---start computeSellOrdersAsset()');

      var asset = 0;
      var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      var _iteratorNormalCompletion16 = true;
      var _didIteratorError16 = false;
      var _iteratorError16 = undefined;

      try {
        var _loop9 = function _loop9() {
          var order = _step16.value;

          if (order.orderType === '賣出') {
            var _companyData3 = localCompanies.find(function (x) {
              return x.companyId === order.companyId;
            });
            //以參考價計算賣單股票價值, 如果找不到資料則用賣單價格
            var price = _companyData3 !== undefined ? _companyData3.price : order.unitPrice;
            asset += price * (order.amount - order.done);
          }
        };

        for (var _iterator16 = this.orders[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
          _loop9();
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

      console.log('---end computeSellOrdersAsset(): ' + asset);

      return asset;
    }

    //Override

  }, {
    key: 'computeTotalWealth',
    value: function computeTotalWealth() {
      var totalWealth = _get(LoginUser.prototype.__proto__ || Object.getPrototypeOf(LoginUser.prototype), 'computeTotalWealth', this).call(this) + this.computeBuyOrdersMoney() + this.computeSellOrdersAsset();
      console.log('---LoginUser.computeTotalWealth(): ' + totalWealth);

      return totalWealth;
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
  }]);

  return LoginUser;
}(User);

/**
 * CompanyObject
 * @param {object} serverCompany 從dbCompanies中擷取出來的單一個company
 */


var Company = function () {
  function Company(serverCompany) {
    _classCallCheck(this, Company);

    this.companyId = serverCompany._id;
    this.name = serverCompany.companyName;

    this.chairman = serverCompany.chairman;
    this.manager = serverCompany.manager;

    this.grade = serverCompany.grade;
    this.capital = serverCompany.capital;
    this.price = serverCompany.listPrice;
    this.release = serverCompany.totalRelease;
    this.profit = serverCompany.profit;

    this.vipBonusStocks = 0; //外掛獨有參數
    this.managerProfitPercent = 0.05; //未來會有的

    this.salary = serverCompany.salary;
    this.nextSeasonSalary = serverCompany.nextSeasonSalary;
    this.bonus = serverCompany.seasonalBonusPercent;
    this.employeesNumber = 0;
    this.nextSeasonEmployeesNumber = 0;

    this.tags = serverCompany.tags;
    this.createdAt = serverCompany.createdAt.getTime();
  }

  _createClass(Company, [{
    key: 'updateWithDbemployees',
    value: function updateWithDbemployees(serverEmployees) {
      console.log('---start updateWithDbemployees()');

      var employeesNumber = 0;
      var nextSeasonEmployeesNumber = 0;

      var _iteratorNormalCompletion17 = true;
      var _didIteratorError17 = false;
      var _iteratorError17 = undefined;

      try {
        for (var _iterator17 = serverEmployees[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
          var emp = _step17.value;

          if (emp.employed === true && emp.resigned === false) {
            employeesNumber += 1;
          } else if (emp.employed === false && emp.resigned === false) {
            nextSeasonEmployeesNumber += 1;
          }
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
        this.bonus = companyData.bonus;
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
        managerProfitPercent: this.managerProfitPercent,

        salary: this.salary,
        nextSeasonSalary: this.nextSeasonSalary,
        bonus: this.bonus,
        employeesNumber: this.employeesNumber,
        nextSeasonEmployeesNumber: this.nextSeasonEmployeesNumber,

        tags: this.tags,
        createdAt: this.createdAt
      };
    }
  }]);

  return Company;
}();

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
    var _iteratorNormalCompletion18 = true;
    var _didIteratorError18 = false;
    var _iteratorError18 = undefined;

    try {
      for (var _iterator18 = serverCompanies[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
        var serverCompany = _step18.value;

        var company = new Company(serverCompany);
        this.list.push(company);
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
  }

  _createClass(Companies, [{
    key: 'companyPatch',
    value: function companyPatch() {
      var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
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
            managerProfitPercent: 0.05,

            salary: 1000,
            nextSeasonSalary: 1000,
            bonus: 5,
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
      var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      var _iteratorNormalCompletion19 = true;
      var _didIteratorError19 = false;
      var _iteratorError19 = undefined;

      try {
        var _loop10 = function _loop10() {
          var company = _step19.value;

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

        for (var _iterator19 = this.list[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
          _loop10();
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

      window.localStorage.setItem('localCompanies', JSON.stringify(localCompanies));
    }
  }, {
    key: 'computeUserProfit',
    value: function computeUserProfit(loginUser) {
      var userProfit = 0;
      var _iteratorNormalCompletion20 = true;
      var _didIteratorError20 = false;
      var _iteratorError20 = undefined;

      try {
        var _loop11 = function _loop11() {
          var company = _step20.value;

          var userHold = loginUser.holdStocks.find(function (x) {
            return x.companyId === company.companyId;
          });
          if (userHold !== undefined) {
            userProfit += earnPerShare(company.outputInfo()) * effectiveStocks(userHold.stocks, userHold.vip);
          }
        };

        for (var _iterator20 = this.list[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
          _loop11();
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

      return userProfit;
    }
  }]);

  return Companies;
}();

/****************class****************/
/*************************************/
/*************************************/
/*************companyList*************/

/**
 * CompanyList的Controller
 * @param {LoginUser} loginUser 登入中的使用者
 */


var CompanyListController = function (_EventController) {
  _inherits(CompanyListController, _EventController);

  function CompanyListController(loginUser) {
    _classCallCheck(this, CompanyListController);

    var _this21 = _possibleConstructorReturn(this, (CompanyListController.__proto__ || Object.getPrototypeOf(CompanyListController)).call(this, 'CompanyListController', loginUser));

    _this21.templateListener(Template.companyList, 'Template.companyList', function () {
      _this21.updateUserInfo();
      _this21.useCompaniesInfo();
    });
    return _this21;
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

/*************companyList*************/
/*************************************/
/*************************************/
/************companyDetail************/

/**
 * CompanyDetail的Controller
 * @param {LoginUser} loginUser 登入中的使用者
 */


var CompanyDetailController = function (_EventController2) {
  _inherits(CompanyDetailController, _EventController2);

  function CompanyDetailController(loginUser) {
    _classCallCheck(this, CompanyDetailController);

    var _this22 = _possibleConstructorReturn(this, (CompanyDetailController.__proto__ || Object.getPrototypeOf(CompanyDetailController)).call(this, 'CompanyDetailController', loginUser));

    _this22.whoFirst = null;
    _this22.loaded = null;
    _this22.templateListener(Template.companyDetail, 'Template.companyDetail', function () {
      _this22.useCompaniesInfo();
    });
    _this22.templateListener(Template.companyDetailContentNormal, 'Template.companyDetailContentNormal', function () {
      _this22.useEmployeesInfo();
    });
    _this22.templateListener(Template.companyProductCenterPanel, 'Template.companyProductCenterPanel', function () {
      _this22.useUserOwnedProductsInfo();
    });
    return _this22;
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
  }]);

  return CompanyDetailController;
}(EventController);

/************companyDetail************/
/*************************************/
/*************************************/
/*************accountInfo*************/

/**
 * AccountInfo的Controller
 * @param {LoginUser} loginUser 登入中的使用者
 */


var AccountInfoController = function (_EventController3) {
  _inherits(AccountInfoController, _EventController3);

  function AccountInfoController(loginUser) {
    _classCallCheck(this, AccountInfoController);

    var _this23 = _possibleConstructorReturn(this, (AccountInfoController.__proto__ || Object.getPrototypeOf(AccountInfoController)).call(this, 'AccountInfoController', loginUser));

    _this23.accountInfoView = new AccountInfoView();

    _this23.user = null;
    _this23.userId = null;
    _this23.waitList = [];

    _this23.templateListener(Template.accountInfo, 'Template.accountInfo', function () {
      _this23.usersEvent();
    });
    _this23.templateListener(Template.managerTitleList, 'Template.managerTitleList', function () {
      _this23.managersEvent();
    });
    _this23.templateListener(Template.vipTitleList, 'Template.vipTitleList', function () {
      _this23.vipsEvent();
    });
    _this23.templateListener(Template.accountInfoOwnStockList, 'Template.accountInfoOwnStockList', function () {
      _this23.ownStocksEvent();
    });
    _this23.templateListener(Template.accountInfoOwnedProductsPanel, 'Template.accountInfoOwnedProductsPanel', function () {
      _this23.ownProductsEvent();
    });
    return _this23;
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

      this.accountInfoView.displayTax(this.user.computeTax());

      //如果有在user資訊載好前就載入的其他資訊，會被丟進等待清單
      //以for迴圈完成清單內的任務
      var _iteratorNormalCompletion21 = true;
      var _didIteratorError21 = false;
      var _iteratorError21 = undefined;

      try {
        for (var _iterator21 = this.waitList[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
          var task = _step21.value;

          if (task.userId === this.userId) {
            task.callback();
          }
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

      this.waitList = [];

      console.log('end usersEvent()');
    }
  }, {
    key: 'managersEvent',
    value: function managersEvent() {
      console.log('start managersEvent()');

      var pageId = FlowRouter.getParam('userId');
      if (this.userId === undefined) {
        return;
      }
      if (this.userId === pageId) {
        this.user.updateManagers();

        //顯示資訊
        this.accountInfoView.displayHrLine();
        this.accountInfoView.displayManagersProfit(this.user.computeManagersProfit());
        this.accountInfoView.displayTax(this.user.computeTax());
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
      if (this.userId === undefined) {
        return;
      }
      if (this.userId === pageId) {
        this.user.updateVips();

        //顯示資訊
        this.accountInfoView.displayHrLine();
        this.accountInfoView.displayStocksProfit(this.user.computeProfit());
        this.accountInfoView.displayTax(this.user.computeTax());
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
      if (this.userId === undefined) {
        return;
      }
      if (this.userId === pageId) {
        this.user.updateHoldStocks();

        //顯示資訊
        this.accountInfoView.displayHrLine();
        this.accountInfoView.displayCompanyNumber(this.user.computeCompanyNumber());
        this.accountInfoView.displayStocksAsset(this.user.computeAsset());
        this.accountInfoView.displayStocksProfit(this.user.computeProfit());
        this.accountInfoView.displayTax(this.user.computeTax());
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
      if (this.userId === undefined) {
        return;
      }
      this.loginUser.updateProducts();
    }
  }]);

  return AccountInfoController;
}(EventController);

/**
 * AccountInfo的View
 */


var AccountInfoView = function (_View2) {
  _inherits(AccountInfoView, _View2);

  function AccountInfoView() {
    _classCallCheck(this, AccountInfoView);

    var _this24 = _possibleConstructorReturn(this, (AccountInfoView.__proto__ || Object.getPrototypeOf(AccountInfoView)).call(this, 'AccountInfoView'));

    _this24.resetDisplayList();
    return _this24;
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
        tax: false
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

        $('div[name=\'tax\']').remove();

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
    key: 'displayTax',
    value: function displayTax(tax) {
      var displayObject = this.createH2Info({
        name: 'tax',
        leftText: translation(['accountInfo', 'estimatedTax']),
        rightText: '$ ' + tax
      });

      $('div[name=\'tax\']').remove();
      var afterObject = this.displayList.hrProfit || this.displayList.hrStocks || $('h1[class=\'card-title\']')[0];
      displayObject.insertAfter(afterObject);
      this.displayList.tax = displayObject;
    }
  }]);

  return AccountInfoView;
}(View);

/*************accountInfo*************/
/*************************************/
/*************************************/
/**************scriptVIP**************/

/**
 * ScriptVip頁面的Controller
 * @param {LoginUser} loginUser 登入中的使用者
 */


var ScriptVipController = function (_EventController4) {
  _inherits(ScriptVipController, _EventController4);

  function ScriptVipController(loginUser) {
    _classCallCheck(this, ScriptVipController);

    var _this25 = _possibleConstructorReturn(this, (ScriptVipController.__proto__ || Object.getPrototypeOf(ScriptVipController)).call(this, 'ScriptVipController', loginUser));

    _this25.searchTables = new SearchTables();
    _this25.scriptVipView = new ScriptVipView(_this25);

    Template.softwareScriptVip.onRendered(function () {
      _this25.scriptVipView.displayScriptVipProducts(_this25.loginUser);
      _this25.scriptVipView.displayScriptAdInfo(_this25.loginUser);
      _this25.scriptVipView.displaySearchTables(_this25.loginUser);
    });
    return _this25;
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

/**
 * ScriptVip頁面的View
 * @param {EventController} controller 控制View的Controller
 */


var ScriptVipView = function (_View3) {
  _inherits(ScriptVipView, _View3);

  function ScriptVipView(controller) {
    _classCallCheck(this, ScriptVipView);

    var _this26 = _possibleConstructorReturn(this, (ScriptVipView.__proto__ || Object.getPrototypeOf(ScriptVipView)).call(this, 'ScriptVipView'));

    _this26.controller = controller;
    _this26.scriptAd = new ScriptAd();

    var tmpVip = new Blaze.Template('Template.softwareScriptVip', function () {
      // eslint-disable-next-line new-cap
      var page = HTML.Raw('\n        <div class=\'card\' name=\'vip\'>\n          <div class=\'card-block\' name=\'Vip\'>\n            <div class=\'col-5\'>\n              <h1 class=\'card-title mb-1\'>SoftwareScript</h1>\n              <h1 class=\'card-title mb-1\'>  VIP\u529F\u80FD</h1>\n            </div>\n            <div class=\'col-5\'>\u60A8\u662F\u6211\u7684\u6069\u5BA2\u55CE?</div>\n            <div class=\'col-12\'>\n              <hr>\n              <h2 name=\'becomeVip\'>\u6210\u70BAVIP</h2>\n              <hr>\n              <h2 name=\'scriptAd\'>\u5916\u639B\u5EE3\u544A</h2>\n              <hr>\n              <h2 name=\'searchTables\'>\u8CC7\u6599\u641C\u5C0B</h2>\n              <hr>\n              <p>\u5982VIP\u529F\u80FD\u767C\u751F\u554F\u984C\uFF0C\u8ACB\u81F3Discord\u80A1\u5E02\u7FA4\u806F\u7D61SoftwareSing</p>\n            </div>\n          </div>\n        </div>\n      ');

      return page;
    });
    Template.softwareScriptVip = tmpVip;
    return _this26;
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
      var info = $('\n      <p>VIP\u689D\u4EF6\u66F4\u65B0\u6642\u9593: ' + localScriptVipProductsUpdateTime + '</p>\n      <p>\u60A8\u76EE\u524D\u7684VIP\u72C0\u614B: \u7B49\u7D1A ' + userVIP + '</p>\n      <p>VIP\u6B0A\u9650: </P>\n      <ul name=\'vipCanDo\'>\n        <li>\u95DC\u9589\u5916\u639B\u5EE3\u544A</li>\n        <li>\u4F7F\u7528\u8CC7\u6599\u641C\u5C0B\u529F\u80FD</li>\n      </ul>\n      <p>\n        VIP\u9EDE\u6578\u9054390\u5373\u53EF\u4F7F\u7528VIP\u529F\u80FD <br />\n        \u70BA\u7372\u5F97\u9EDE\u6578\u53EF\u4EE5\u8CFC\u8CB7\u4EE5\u4E0B\u5546\u54C1\n      </p>\n      <div name=\'scriptVipProducts\' id=\'productList\'>\n      </div>\n    ');
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
      var _iteratorNormalCompletion22 = true;
      var _didIteratorError22 = false;
      var _iteratorError22 = undefined;

      try {
        for (var _iterator22 = userProducts.products[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
          var _p = _step22.value;

          var description = '<a companyId=\'' + _p.companyId + '\' href=\'/company/detail/' + _p.companyId + '\'>' + _p.description + '</a>';
          var out = [description, _p.point, _p.amount];
          productList.push(out);
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

      var tableObject = this.createTable({
        name: 'scriptVipProducts',
        tHead: ['產品', '點數/個', '持有量'],
        tBody: productList
      });
      tableObject.insertAfter($('div[name=\'scriptVipProducts\'][id=\'productList\']')[0]);

      console.log('end displayScriptVipProducts()');
    }

    /**
     * 顯示外掛AD資訊
     * @param {LoginUser} loginUser 登入中的使用者
     * @return {void}
     */

  }, {
    key: 'displayScriptAdInfo',
    value: function displayScriptAdInfo(loginUser) {
      var _this27 = this;

      console.log('start displayScriptAdInfo()');

      var localScriptAdUpdateTime = JSON.parse(window.localStorage.getItem('localScriptAdUpdateTime')) || 'null';
      var msg = this.scriptAd.createAdMsg(true);
      var info = $('\n      <p>\n        \u76EE\u524D\u7684\u5EE3\u544A\u66F4\u65B0\u6642\u9593: ' + localScriptAdUpdateTime + ' <br />\n        \u76EE\u524D\u7684\u5EE3\u544A\u5167\u5BB9: <br />\n        ' + msg + '\n      </p>\n      <p>\n        <button class=\'btn btn-info btn-sm\' name=\'openAd\'>\u958B\u555F\u5916\u639B\u5EE3\u544A</button>\n        <button class=\'btn btn-danger btn-sm\' name=\'closeAd\'>\u95DC\u9589\u5916\u639B\u5EE3\u544A</button>\n      </p>\n    ');
      info.insertAfter($('h2[name=\'scriptAd\']')[0]);

      if (loginUser.vipLevel() < 1) {
        $('button[name=\'closeAd\']')[0].disabled = true;
      } else {
        $('button[name=\'closeAd\']')[0].addEventListener('click', function () {
          window.localStorage.setItem('localDisplayScriptAd', JSON.stringify(false));
          _this27.scriptAd.removeScriptAd();
        });
      }

      $('button[name=\'openAd\']')[0].addEventListener('click', function () {
        window.localStorage.setItem('localDisplayScriptAd', JSON.stringify(true));
        if ($('a[name=\'scriptAd\'][demo=\'false\']').length < 1) {
          _this27.scriptAd.displayScriptAd();
        }
      });

      console.log('end displayScriptAdInfo()');
    }

    /**
     * 顯示SearchTables資訊
     * @param {LoginUser} loginUser 登入中的使用者
     * @return {void}
     */

  }, {
    key: 'displaySearchTables',
    value: function displaySearchTables(loginUser) {
      var _this28 = this;

      console.log('start displaySearchTables()');

      var localCompaniesUpdateTime = JSON.parse(window.localStorage.getItem('localCompaniesUpdateTime')) || 'null';
      var info = $('\n      <p>\n        VIP\u53EF\u4EE5\u7528\u6B64\u529F\u80FD\u641C\u5C0B\u516C\u53F8\u8CC7\u6599<br />\n        \u516C\u53F8\u8CC7\u6599\u70BA \u5F9E\u96F2\u7AEF\u540C\u6B65 \u6216 \u65BC\u700F\u89BD\u80A1\u5E02\u6642\u81EA\u52D5\u66F4\u65B0\uFF0C\u56E0\u6B64\u53EF\u80FD\u8207\u6700\u65B0\u8CC7\u6599\u6709\u6240\u843D\u5DEE<br />\n        \u76EE\u524D\u7684\u96F2\u7AEF\u8CC7\u6599\u66F4\u65B0\u6642\u9593: ' + localCompaniesUpdateTime + '<br />\n        &nbsp;(\u6BCF\u6B21\u91CD\u65B0\u8F09\u5165\u80A1\u5E02\u6642\uFF0C\u6703\u78BA\u8A8D\u96F2\u7AEF\u662F\u5426\u6709\u66F4\u65B0\u8CC7\u6599)\n      </p>\n      <p>&nbsp;</p>\n      <p>\u5404\u9805\u6578\u503C\u540D\u7A31\u5C0D\u7167\u8868(\u4E0D\u5728\u8868\u4E2D\u7684\u6578\u503C\u7121\u6CD5\u4F7F\u7528)\uFF1A\n        <table border=\'1\' name=\'valueNameTable\'>\n          <tr name=\'companyID\'> <td>\u516C\u53F8ID</td> <td>ID</td> </tr>\n          <tr name=\'name\'> <td>\u516C\u53F8\u540D\u7A31</td> <td>name</td> </tr>\n          <tr name=\'chairman\'> <td>\u8463\u4E8B\u9577ID</td> <td>chairman</td> </tr>\n          <tr name=\'manager\'> <td>\u7D93\u7406\u4EBAID</td> <td>manager</td> </tr>\n\n          <tr name=\'grade\'> <td>\u8CC7\u672C\u984D</td> <td>grade</td> </tr>\n          <tr name=\'capital\'> <td>\u516C\u53F8\u8A55\u7D1A</td> <td>capital</td> </tr>\n          <tr name=\'price\'> <td>\u80A1\u50F9</td> <td>price</td> </tr>\n          <tr name=\'release\'> <td>\u7E3D\u91CB\u80A1\u91CF</td> <td>release</td> </tr>\n          <tr name=\'profit\'> <td>\u7E3D\u71DF\u6536</td> <td>profit</td> </tr>\n\n          <tr name=\'vipBonusStocks\'> <td>VIP\u52A0\u6210\u80A1\u6578</td> <td>vipBonusStocks</td> </tr>\n          <tr name=\'managerProfitPercent\'> <td>\u7D93\u7406\u5206\u7D05\u6BD4\u4F8B</td> <td>managerProfitPercent</td> </tr>\n\n          <tr name=\'salary\'> <td>\u672C\u5B63\u54E1\u5DE5\u85AA\u6C34</td> <td>salary</td> </tr>\n          <tr name=\'nextSeasonSalary\'> <td>\u4E0B\u5B63\u54E1\u5DE5\u85AA\u6C34</td> <td>nextSeasonSalary</td> </tr>\n          <tr name=\'bonus\'> <td>\u54E1\u5DE5\u5206\u7D05%\u6578</td> <td>bonus</td> </tr>\n          <tr name=\'employeesNumber\'> <td>\u672C\u5B63\u54E1\u5DE5\u4EBA\u6578</td> <td>employeesNumber</td> </tr>\n          <tr name=\'nextSeasonEmployeesNumber\'> <td>\u4E0B\u5B63\u54E1\u5DE5\u4EBA\u6578</td> <td>nextSeasonEmployeesNumber</td> </tr>\n\n          <tr name=\'tags\'> <td>\u6A19\u7C64 tag (\u9663\u5217)</td> <td>tags</td> </tr>\n          <tr name=\'createdAt\'> <td>\u5275\u7ACB\u6642\u9593</td> <td>createdAt</td> </tr>\n        </table>\n      </p>\n      <p>\u5E38\u7528\u51FD\u5F0F\uFF1A\n        <table border=\'1\' name=\'valueNameTable\'>\n          <tr name=\'\u7B49\u65BC\'>\n            <td bgcolor=\'yellow\'>\u7B49\u65BC (\u8ACB\u75282\u62163\u500B\u7B49\u865F)</td>\n            <td bgcolor=\'yellow\'>==</td>\n          </tr>\n          <tr name=\'OR\'>\n            <td>x OR(\u6216) y</td>\n            <td>(x || y)</td>\n          </tr>\n          <tr name=\'AND\'>\n            <td>x AND y</td>\n            <td>(x && y)</td>\n          </tr>\n          <tr name=\'toFixed()\'>\n            <td>\u628Ax\u56DB\u6368\u4E94\u5165\u81F3\u5C0F\u6578\u9EDEy\u4F4D</td>\n            <td>x.toFixed(y)</td>\n          </tr>\n          <tr name=\'Math.ceil(price * 1.15)\'>\n            <td>\u8A08\u7B97\u6F32\u505C\u50F9\u683C</td>\n            <td>Math.ceil(price * 1.15)</td>\n          </tr>\n          <tr name=\'Math.ceil(price * 0.85)\'>\n            <td>\u8A08\u7B97\u8DCC\u505C\u50F9\u683C</td>\n            <td>Math.ceil(price * 0.85)</td>\n          </tr>\n          <tr name=\'\u672C\u76CA\u6BD4\'>\n            <td>\u672C\u76CA\u6BD4</td>\n            <td>(price * release) / profit</td>\n          </tr>\n          <tr name=\'\u76CA\u672C\u6BD4\'>\n            <td>\u76CA\u672C\u6BD4</td>\n            <td>profit / (price * release)</td>\n          </tr>\n          <tr name=\'\u5305\u542B\'>\n            <td>\u540D\u5B57\u4E2D\u5305\u542B \u8266\u3053\u308C \u7684\u516C\u53F8</td>\n            <td>(name.indexOf(\'\u8266\u3053\u308C\') > -1)</td>\n          </tr>\n        </table>\n      </p>\n      <p>&nbsp;</p>\n      <p> <a href=\'https://hackmd.io/s/SycGT5yIG\' target=\'_blank\'>\u8CC7\u6599\u641C\u5C0B\u7528\u6CD5\u6559\u5B78</a> </p>\n      <p>\n        <select class=\'form-control\' style=\'width: 300px;\' name=\'dataSearchList\'></select>\n        <button class=\'btn btn-info btn-sm\' name=\'createTable\'>\u5EFA\u7ACB\u65B0\u7684\u641C\u5C0B\u8868</button>\n        <button class=\'btn btn-danger btn-sm\' name=\'deleteTable\'>\u522A\u9664\u9019\u500B\u641C\u5C0B\u8868</button>\n        <button class=\'btn btn-danger btn-sm\' name=\'deleteAllTable\'>\u522A\u9664\u6240\u6709</button>\n      </p>\n      <p name=\'showTableName\'> \u8868\u683C\u540D\u7A31\uFF1A <span class=\'text-info\' name=\'tableName\'></span></p>\n      <p name=\'showTableFilter\'>\n        \u904E\u6FFE\u516C\u5F0F\uFF1A<input class=\'form-control\'\n          type=\'text\' name=\'tableFilter\'\n          placeholder=\'\u8ACB\u8F38\u5165\u904E\u6FFE\u516C\u5F0F\uFF0C\u5982: (price>1000)\'>\n        <button class=\'btn btn-info btn-sm\' name=\'addTableFilter\'>\u5132\u5B58\u904E\u6FFE\u516C\u5F0F</button>\n        <button class=\'btn btn-danger btn-sm\' name=\'deleteTableFilter\'>\u522A\u9664\u904E\u6FFE\u516C\u5F0F</button>\n      </p>\n      <p name=\'showTableSort\'>\n        \u6392\u5E8F\u4F9D\u64DA\uFF1A<input class=\'form-control\'\n          type=\'text\' name=\'tableSort\'\n          placeholder=\'\u8ACB\u8F38\u5165\u6392\u5E8F\u516C\u5F0F\uFF0C\u5982: (price)\uFF0C\u5C0F\u5230\u5927\u8ACB\u52A0\u8CA0\u865F: -(price)\'>\n        <button class=\'btn btn-info btn-sm\' name=\'addTableSort\'>\u5132\u5B58\u6392\u5E8F\u516C\u5F0F</button>\n        <button class=\'btn btn-danger btn-sm\' name=\'deleteTableSort\'>\u522A\u9664\u6392\u5E8F\u516C\u5F0F</button>\n      </p>\n      <p>&nbsp;</p>\n      <p name\'showTableColumn\'>\u8868\u683C\u6B04\u4F4D<br />\n        <button class=\'btn btn-info btn-sm\' name=\'addTableColumn\'>\u65B0\u589E\u6B04\u4F4D</button>\n        <table border=\'1\' name\'tableColumn\'>\n          <thead>\n            <th>\u540D\u7A31</th>\n            <th>\u516C\u5F0F</th>\n            <th>\u64CD\u4F5C</th>\n          </thead>\n          <tbody name=\'tableColumn\'>\n          </tbody>\n        </table>\n      </p>\n      <p>&nbsp;</p>\n      <p>\n        <button class=\'btn btn-info\' name=\'outputTable\'>\u8F38\u51FA\u7D50\u679C</button>\n        <button class=\'btn btn-warning\' name=\'clearOutputTable\'>\u6E05\u7A7A\u8F38\u51FA</button>\n      </p>\n      <p name=\'outputTable\'></p>\n      <p>&nbsp;</p>\n    ');
      info.insertAfter($('h2[name=\'searchTables\']')[0]);

      $('button[name=\'deleteAllTable\']')[0].addEventListener('click', function () {
        alertDialog.confirm({
          title: '刪除所有搜尋表',
          message: '\u60A8\u78BA\u5B9A\u8981\u522A\u9664\u6240\u6709\u7684\u8868\u683C\u55CE? <br />\n                (\u5EFA\u8B70\u767C\u751F\u56B4\u91CD\u932F\u8AA4\u81F3\u7121\u6CD5\u64CD\u4F5C\u6642 \u518D\u9019\u9EBC\u505A)',
          callback: function callback(result) {
            if (result) {
              _this28.controller.deleteLocalSearchTables();
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
              _this28.controller.createNewSearchTable(result);
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
              _this28.controller.deleteSearchTable(tableName);
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
        _this28.controller.addSearchTableFilter(tableName, filter);
      });
      $('button[name=\'deleteTableFilter\']')[0].addEventListener('click', function () {
        var tableName = $('select[name=\'dataSearchList\']')[0].value;
        _this28.controller.deleteSearchTableFilter(tableName);
        $('input[name=\'tableFilter\']')[0].value = '';
      });

      $('button[name=\'addTableSort\']')[0].addEventListener('click', function () {
        var tableName = $('select[name=\'dataSearchList\']')[0].value;
        var sort = $('input[name=\'tableSort\']')[0].value;
        _this28.controller.addSearchTableSort(tableName, sort);
      });
      $('button[name=\'deleteTableSort\']')[0].addEventListener('click', function () {
        var tableName = $('select[name=\'dataSearchList\']')[0].value;
        _this28.controller.deleteSearchTableSort(tableName);
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
                    _this28.controller.addSearchTableColumn(tableName, newName, newRule);
                    _this28.dispalySearchTableColumns(tableName);
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
            _this28.controller.addSearchTableFilter(tableName, filter);
            var sort = $('input[name=\'tableSort\']')[0].value;
            _this28.controller.addSearchTableSort(tableName, sort);

            _this28.displayOutputTable(tableName);
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
      var _this29 = this;

      console.log('---start displaySearchTablesList()');

      $('option[name=\'dataSearchList\']').remove();
      var localSearchTables = JSON.parse(window.localStorage.getItem('localSearchTables')) || 'null';
      var _iteratorNormalCompletion23 = true;
      var _didIteratorError23 = false;
      var _iteratorError23 = undefined;

      try {
        for (var _iterator23 = localSearchTables[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
          var t = _step23.value;

          var item = $('<option name=\'dataSearchList\' value=\'' + t.tableName + '\'>' + t.tableName + '</option>');
          $('select[name=\'dataSearchList\']').append(item);
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

      $('select[name=\'dataSearchList\']')[0].addEventListener('change', function () {
        $('table[name=outputTable]').remove();
        _this29.displaySearchTableInfo();
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

        this.dispalySearchTableColumns(thisTable.tableName);
      } else {
        $('span[name=\'tableName\']')[0].innerText = '';
        $('input[name=\'tableFilter\']')[0].value = '';
        $('input[name=\'tableSort\']')[0].value = '';
        $('tr[name=\'tableColumn\']').remove();
      }

      console.log('---end displaySearchTableInfo()');
    }
  }, {
    key: 'dispalySearchTableColumns',
    value: function dispalySearchTableColumns(tableName) {
      var _this30 = this;

      console.log('---start dispalySearchTableColumns()');

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
                    _this30.controller.changeSearchTableColumn(tableName, { name: c.columnName, newName: newName }, newRule);
                    _this30.dispalySearchTableColumns(tableName);
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
              _this30.controller.deleteSearchTableColumn(tableName, c.columnName);
              _this30.dispalySearchTableColumns(tableName);
            }
          }
        });
      };

      var _iteratorNormalCompletion24 = true;
      var _didIteratorError24 = false;
      var _iteratorError24 = undefined;

      try {
        var _loop12 = function _loop12() {
          var c = _step24.value;

          var t = '\n        <tr name=\'tableColumn\'>\n          <td>' + c.columnName + '</td>\n          <td>' + String(c.rule) + '</td>\n          <td>\n            <button class=\'btn btn-warning btn-sm\' name=\'changeTableColumn\' id=\'' + c.columnName + '\'>\u4FEE\u6539</button>\n            <button class=\'btn btn-danger btn-sm\' name=\'deleteTableColumn\' id=\'' + c.columnName + '\'>\u522A\u9664</button>\n          </td>\n        </tr>\n      ';
          $('tbody[name=\'tableColumn\']').append(t);
          $('button[name=\'changeTableColumn\'][id=\'' + c.columnName + '\']')[0].addEventListener('click', function () {
            changeColumn(c);
          });
          $('button[name=\'deleteTableColumn\'][id=\'' + c.columnName + '\']')[0].addEventListener('click', function () {
            deleteColumn(c);
          });
        };

        for (var _iterator24 = thisTable.column[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
          _loop12();
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

      console.log('---end dispalySearchTableColumns()');
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
      var _iteratorNormalCompletion25 = true;
      var _didIteratorError25 = false;
      var _iteratorError25 = undefined;

      try {
        for (var _iterator25 = table.column[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
          var column = _step25.value;

          outputArray.push(column.columnName);
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
      var _this31 = this;

      console.log('start outputSearchResults()');

      var table = this.tables.find(function (t) {
        return t.tableName === tableName;
      });
      var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      var outputCompanies = [];
      try {
        if (table.filter) {
          var _iteratorNormalCompletion26 = true;
          var _didIteratorError26 = false;
          var _iteratorError26 = undefined;

          try {
            for (var _iterator26 = localCompanies[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
              var _company = _step26.value;

              if (this.doInputFunction(_company, table.filter)) {
                outputCompanies.push(_company);
              }
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
            return _this31.doInputFunction(b, table.sort) - _this31.doInputFunction(a, table.sort);
          });
        }
      } catch (e) {
        alertDialog.alert('計算失敗！排序公式出錯');

        return;
      }

      var outputList = [];
      var debugColumnName = '';
      try {
        var _iteratorNormalCompletion27 = true;
        var _didIteratorError27 = false;
        var _iteratorError27 = undefined;

        try {
          for (var _iterator27 = outputCompanies[Symbol.iterator](), _step27; !(_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done); _iteratorNormalCompletion27 = true) {
            var _company2 = _step27.value;

            var row = [];
            var _iteratorNormalCompletion28 = true;
            var _didIteratorError28 = false;
            var _iteratorError28 = undefined;

            try {
              for (var _iterator28 = table.column[Symbol.iterator](), _step28; !(_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done); _iteratorNormalCompletion28 = true) {
                var column = _step28.value;

                debugColumnName = column.columnName;
                var pushValue = this.doInputFunction(_company2, column.rule);
                row.push(pushValue);
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

            outputList.push(row);
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
      var chairman = company.chairman;
      var manager = company.manager;

      var grade = company.grade;
      var capital = company.capital;
      var price = company.price;
      var stock = company.release;
      var release = company.release;
      var profit = company.profit;

      var vipBonusStocks = company.vipBonusStocks;
      var managerProfitPercent = company.managerProfitPercent;

      var salary = company.salary;
      var nextSeasonSalary = company.nextSeasonSalary;
      var bonus = company.bonus;
      var employeesNumber = company.employeesNumber;
      var nextSeasonEmployeesNumber = company.nextSeasonEmployeesNumber;

      var tags = company.tags;
      var createdAt = company.createdAt;

      debugConsole('=====do=' + fun);

      return eval(fun);
      /* eslint-enable no-eval, no-unused-vars */
    }
  }, {
    key: 'outputTable',
    value: function outputTable(tableName) {
      var _this32 = this;

      console.log('start outputTable()');

      this.loadFromLocalstorage();

      var t = this.tables.find(function (x) {
        return x.tableName === tableName;
      });
      var localCompanies = JSON.parse(window.localStorage.getItem('localCompanies')) || [];
      var outputCompanies = [];
      try {
        if (t.filter) {
          var _iteratorNormalCompletion29 = true;
          var _didIteratorError29 = false;
          var _iteratorError29 = undefined;

          try {
            for (var _iterator29 = localCompanies[Symbol.iterator](), _step29; !(_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done); _iteratorNormalCompletion29 = true) {
              var _c2 = _step29.value;

              if (this.doInputFunction(_c2, t.filter)) {
                outputCompanies.push(_c2);
              }
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
            return _this32.doInputFunction(b, t.sort) - _this32.doInputFunction(a, t.sort);
          });
        }
      } catch (e) {
        alertDialog.alert('計算失敗！排序公式出錯');

        return;
      }

      var outputList = [];
      var debugColumnName = '';
      try {
        var _iteratorNormalCompletion30 = true;
        var _didIteratorError30 = false;
        var _iteratorError30 = undefined;

        try {
          for (var _iterator30 = outputCompanies[Symbol.iterator](), _step30; !(_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done); _iteratorNormalCompletion30 = true) {
            var _c3 = _step30.value;

            var row = {};
            var _iteratorNormalCompletion31 = true;
            var _didIteratorError31 = false;
            var _iteratorError31 = undefined;

            try {
              for (var _iterator31 = t.column[Symbol.iterator](), _step31; !(_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done); _iteratorNormalCompletion31 = true) {
                var column = _step31.value;

                debugColumnName = column.columnName;
                row[column.columnName] = this.doInputFunction(_c3, column.rule);
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

            outputList.push(row);
          }
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
      } catch (e) {
        alertDialog.alert('\u8A08\u7B97\u5931\u6557\uFF01\u6B04\u4F4D ' + debugColumnName + ' \u516C\u5F0F\u51FA\u932F');

        return;
      }

      // 需要重整，應該歸類到View裡面
      var thead = '';
      var _iteratorNormalCompletion32 = true;
      var _didIteratorError32 = false;
      var _iteratorError32 = undefined;

      try {
        for (var _iterator32 = t.column[Symbol.iterator](), _step32; !(_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done); _iteratorNormalCompletion32 = true) {
          var _column = _step32.value;

          thead += '<th style=\'max-width: 390px;\'>' + _column.columnName + '</th>';
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

      var output = '\n        <table border=\'1\' name=\'outputTable\'>\n            <thead name=\'outputTable\'>\n                ' + thead + '\n            </thead>\n            <tbody name=\'outputTable\'>\n            </tbody>\n        </table>\n    ';
      $('p[name=\'outputTable\']').append(output);
      var _iteratorNormalCompletion33 = true;
      var _didIteratorError33 = false;
      var _iteratorError33 = undefined;

      try {
        for (var _iterator33 = outputList[Symbol.iterator](), _step33; !(_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done); _iteratorNormalCompletion33 = true) {
          var _row = _step33.value;

          var outputRow = '<tr>';
          var _iteratorNormalCompletion34 = true;
          var _didIteratorError34 = false;
          var _iteratorError34 = undefined;

          try {
            for (var _iterator34 = t.column[Symbol.iterator](), _step34; !(_iteratorNormalCompletion34 = (_step34 = _iterator34.next()).done); _iteratorNormalCompletion34 = true) {
              var _column2 = _step34.value;

              outputRow += '<td style=\'max-width: 390px;\'>' + _row[_column2.columnName] + '</td>';
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

          outputRow += '</tr>';
          $('tbody[name=\'outputTable\']').append(outputRow);
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

      console.log('end outputTable()');
    }
  }]);

  return SearchTables;
}();

/**************scriptVIP**************/
/*************************************/
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
      vip: '外掛VIP'
    },
    accountInfo: {
      estimatedTax: '預估稅金：',
      holdingStockCompaniesNumber: '持股公司總數：',
      stocksAsset: '股票總值：',
      usedInSellOrdersStocksAsset: '賣單股票總值：',
      usedInBuyOrdersMoney: '買單現金總值：',
      estimatedStockProfit: '預估股票分紅：',
      estimatedManagerProfit: '預估經理分紅：',
      estimatedEmployeeBonus: '預估員工分紅：',
      estimatedProductVotingRewards: '預估推薦票獎勵：'
    }
  },
  en: {
    script: {
      name: 'SoftwareScript',
      updateScript: 'update Script',
      vip: 'script VIP'
    },
    accountInfo: {
      estimatedTax: 'Estimated tax：',
      holdingStockCompaniesNumber: 'Holding stock companies number：',
      stocksAsset: 'Stocks asset：',
      usedInSellOrdersStocksAsset: 'Used in sell orders stocks asset：',
      usedInBuyOrdersMoney: 'Used in buy orders money：',
      estimatedStockProfit: 'Estimated stock profit：',
      estimatedManagerProfit: 'Estimated manager profit：',
      estimatedEmployeeBonus: 'Estimated employee profit：',
      estimatedProductVotingRewards: 'Estimated Product Voting Rewards：'
    }
  }
};
