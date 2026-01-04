// ==UserScript==
// @name Specter: Customer Orders
// @namespace Vapes Scripts
// @description Automated order magic
// @version  2.0.0
// @grant    none
// @require  https://code.jquery.com/jquery-3.3.1.min.js
// @match https://specter.se/*
// @match https://*.specter.se/*
// @downloadURL https://update.greasyfork.org/scripts/373274/Specter%3A%20Customer%20Orders.user.js
// @updateURL https://update.greasyfork.org/scripts/373274/Specter%3A%20Customer%20Orders.meta.js
// ==/UserScript==

// Specter wrapper
if (window.location.href.indexOf('specter.se') > 1) {
  let params = {}

  var $ = (selector, target) => {
    return jQuery(selector, target ? target : (params.frame ? jQuery(params.frame)[0].contentWindow.document : window.document))
  }

  function load () {
    console.log('Load: gm-specter-customer-orders.js')
  	params.frame = document.getElementsByName('main')[0] || false
    params.target = params.frame ? params.frame.contentDocument : window.document
    params.url = params.frame ? params.frame.contentWindow.location.href : window.location.href

    params.querystrings = (key) => {
      const search = (new URL(params.url)).search.substring(1)
      let obj = search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {}
      return key ? obj[key] : obj
    }

    runScript(params)
  }

  load()

  // Run your functions below
  function runScript (params) {
    if ((params.querystrings()).action === "viewOrder") {

      if (params.frame) {
        params.frame.addEventListener('load', load, true)
      }
      const OTHER = 'Other';
      const MYPACK = 'Mypack';
      const VARUBREV = 'Varubrev'
      const REKOMMENDERAT = 'REK'

      var orderMap = {};
      var orderToolTipMap = {};
      var orders = $('#searchOrder table.centerTable.table-list tbody').first().children().eq(0);
      var tooltips = $('.order-tooltip');

      var structure = {
        init: false,
        loaded: false,
        orders: [],
        selectors: {
          tooltips: [],
          rows: [],
          orders: {},
          elements: {}
        }
      };

      var orderDefault = {
        orderId: null,
        orderIdExternal: null,
        customerId: null,
        datePurchased: null,
        dateDelivery: null,
        customer: null,
        cost: null,
        sign: null,
        shippingMethod: null,
        status: null,
        checked: null,
        note: null,
        needsAge: null,
        isPaused: null,
        isMinor: null,
        isPrioritized: null,
        needsCancel: null,
        isLatestControlled: null,
        matchingAddress: null,
        address: {},
        loaded: false,
        elements: {
          checked: null,
          orderId: null,
          packingStatus: null,
          datePurchased: null,
          dateDelivery: null,
          customer: null,
          cost: null,
          sign: null,
          status: null,
          controls: null,
          tooltipOrder: null
        }
      };

      init();

      function init () {
        if (structure.loaded === false) {
          addClassRules(params, structure);
          if (!structure.init) {
            constructOrders(function () {
              loadOrderToolTips(structure.orders, function () {
                inject(structure.orders);
                addClasses(structure.orders);
                structure.loaded = true;
                hideElements();
              });
              structure.init = true;
            });
          }
        }
      }


      function constructOrders (cb) {
        var orderStructure = [];
        var orders = $('#searchOrder table.centerTable.table-list tbody').first().children();
        var headers = $('.centerTable thead').first().children('tr').children();
        structure.selectors.headers = {
          checked: headers.eq(0),
          orderId: headers.eq(1),
          packingStatus: headers.eq(2),
          datePurchased: headers.eq(3),
          dateDelivery: headers.eq(4),
          payment: headers.eq(5),
          customer: headers.eq(6),
          cost: headers.eq(7),
          status: headers.eq(8),
          controls: headers.eq(9)
        }

        $(orders).each(function (x) {
          var order = {
            elements: {
              row: $(this),
              checked: $(this).find('td').eq(0),
              orderId: $(this).find('td').eq(1),
              packingStatus: $(this).find('td').eq(2),
              datePurchased: $(this).find('td').eq(3),
              dateDelivery: $(this).find('td').eq(4),
              payment: $(this).find('td').eq(5),
              customer: $(this).find('td').eq(6),
              cost: $(this).find('td').eq(7),
              sign: $(this).find('td').eq(8),
              status: $(this).find('td').eq(9),
              controls: $(this).find('td').eq(10),
              tooltipOrder: $(this).find('.order-tooltip')
            }
          }
          var controls = $(order.elements.controls).children('a');
          var note = $(order.elements.controls).find('.tooltip-title');
          var hasNote = note.length > 0;
          if (hasNote) { order.elements.controlNote = note.eq(0) }

          order.elements = Object.assign(order.elements, {
            controlInvoice: $(controls).eq(0),
            controlMail: $(controls).eq(1),
            controlDuplicate: $(controls).eq(2),
            controlPDF: $(controls).eq(3),
            controlEdit: $(controls).eq(4),
            controlCancel: $(controls).eq(5),
            controlRemove: $(controls).eq(6)
          })

          order.note = $(order.elements.controlNote).data('title');
          order.orderId = $(order.elements.orderId).text();
          order.customerId = getParameterByName('customerId', $(order.elements.customer).find('a').first().attr('href'));

          var newOrder = Object.assign({}, orderDefault, order, order.note ? parseNote(order.note) : null);
          orderStructure.push(newOrder);

          checkOrder(newOrder);

          structure.selectors.orders[order.orderId] = newOrder;
          structure.selectors.rows.push($(order));

          $(Object.keys(order.elements)).each(function(index, key) {
            if (!structure.selectors.elements[key]) {
              structure.selectors.elements[key] = [order.elements[key]];
            } else {
              structure.selectors.elements[key].push(order.elements[key]);
            }
          })
        })

        structure.orders.push(orderStructure);
        cb();
      }

      function parseNote (note) {
        if (!note) return;
        note = String(note).toLowerCase();
        return {
          needsAge: ~note.indexOf('ålderskontroll') ? true : false,
          isPaused: ~note.indexOf('pausad') ? true : false,
          isPrioritized: ~note.indexOf('prio') ? true : false,
          isMinor: ~note.indexOf('minderårig') ? true : false,
          needsCancel: ~note.indexOf('avbryt') ? true : false,
          isLatestControlled: ~note.indexOf('***') ? true : false
        }
      }

      function hideElements () {
        var elements = structure.selectors.elements;
        var headers = structure.selectors.headers;
        $(headers.dateDelivery).hide();
        $(elements.controlMail).each(function () { $(this).hide(); })
        $(elements.controlRemove).each(function () { $(this).hide(); })
        $(elements.controlCancel).each(function () { $(this).hide(); })
        $(elements.dateDelivery).each(function () { $(this).hide(); })
        $(elements.vcontrolPDF).each(function () { $(this).hide(); })
      }

      function disableOrder (order) {
        var checkboxCell = $(order.elements.checked);
        var checkbox = checkboxCell.children('input').first();
        checkbox.attr('disabled', true);
        checkbox.hide();
        order.elements.row.addClass('disabled');
      }

      function prioritizeOrder (order) {
        order.elements.row.addClass('prio');
      }

      function setAsLatestControlled (order) {
        var note = $(order.elements.controlNote);
        order.elements.row.addClass('isLatestControlled');
      }

      function checkOrder (order) {
        if (order.needsAge || order.needsCancel || order.isMinor || order.isPaused ) {
          disableOrder(order);
        }
        if (order.isLatestControlled) {
          setAsLatestControlled(order);
        }
        if (order.isPrioritized) {
          prioritizeOrder(order);
        }
      }

      function loadOrderToolTips (orders, cb) {
        $(orders[0]).each(function() {
          var data = loadURL("https://sbm.specter.se/ajaxViewHoover.asp?action=viewOrder&headerId="+this.orderId)
          parser = new DOMParser()
          htmlDoc = parser.parseFromString(data, "text/html")
          var order = structure.selectors.orders[this.orderId]
          var contents = $(htmlDoc).find('table.toolTipTable').children('tbody').first().children()
          order.orderIdExternal = $(contents).eq(2).text().split(' ')[2]
          order.shippingMethod = parseShipping($(contents).eq(order.orderIdExternal ? 8 : 7).children().last().text())
          order.country = $(contents).eq(order.orderIdExternal ? 6 : 5).children().last().text()
          order.loaded = true
        });
        cb()
      }

      function parseShipping(shippingString) {
        var ship = OTHER;
        if (~shippingString.indexOf('MyPack')) { ship = MYPACK; }
        if (~shippingString.indexOf('Varubrev')) { ship = VARUBREV; }
        if (~shippingString.indexOf('Rekommenderat')) { ship = REKOMMENDERAT; }
        return ship;
      }

      function addClasses (orders) {
        $(orders[0]).each(function() {
          var order = this;
          $(Object.keys(order.elements)).each(function(index, key) {
            var element = order.elements[key];
            $(element).addClass('vOrderCell').addClass('v'+key).addClass('vOrderCell-'+order.orderId);
            if (order.loaded === true) {element.addClass('loaded')}
            if (order.shippingMethod === MYPACK) {element.addClass('mypack')}
            if (order.shippingMethod === VARUBREV) {element.addClass('varubrev')}
            if (order.shippingMethod === REKOMMENDERAT) {element.addClass('rekommenderat')}
            if (order.shippingMethod === OTHER) {element.addClass('other')}
            if (order.country !== "Svenska") {element.addClass('notswedish')}
            if (order.country === "Norska") {element.addClass('norge')}
            if (order.country === "Svenska") {element.addClass('sverige')}
            if (order.country === "Danska") {element.addClass('danmark')}
            if (order.country === "Tyska") {element.addClass('tyskland')}
          })
        })
      }

      function addClassRules (params, structure) {
        if (structure.loaded === false) {
          $("<style type='text/css'>.inputListNoBorder { font-size: 30px; }tr.trBg td, tr.trBgTwo td { padding: 5px 0; border-bottom: 1px solid #848484;} .mypack td {background-color:#f4ffb6;} .varubrev td {background-color:#b6ddff;} .rekommenderat td {background-color:#b6ffd0;} .prio td {background-color:#ce98ff;}.disabled td {background-color:#ffcaca;} .isLatestControlled .tooltip-title {outline: 10px solid gold; background: gold;} .flag {width: 15px; position: absolute; margin-left: -110px;}</style>").appendTo($(params.target).find('head').first());
        }
      }

      function inject (orders) {
        if ($('#fraktsatt').length === 0) {
          insertAt($('.centerTable thead tr'), 3, '<td class="listBorder paging-Header" id="fraktsatt">Fraktsätt</td>')
        }
        $(orders[0]).each(function(x) {
          var orderId = this.orderId;
          var ship = this.shippingMethod;
          var flag = '';

          flag = '<img class=\"flag\" src=\"';
          flag = flag + 'https://lipis.github.io/flag-icon-css/flags/4x3/';
          switch (this.country) {
            case 'Svenska':
                flag += 'se';
              break;
            case 'Norska':
                flag += 'no';
              break;
            case 'Danska':
                flag += 'dk';
              break;
            case 'Ryska':
                flag += 'ru';
              break;
            case 'Tyska':
                flag += 'de';
              break;
            default:
          }
          flag = flag + ".svg\" alt=\""+this.country+"\" />";

          if ($('#fra'+orderId).length === 0) {
            insertAt($(this.elements.row), 3, "<td id=\"fra"+orderId+"\">"+flag+ship+"</td>");
          }
        })
      }


      /* HELPERS */

      function getParameterByName(name, url) {
          if (!url) url = window.location.href;
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url);
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
      }

      function insertAt (parent, index, element) {
        var lastIndex = $(parent).eq(0).children().length;
        if (index < 0) { index = Math.max(0, lastIndex + 1 + index); }
        parent.append(element);
        if (index < lastIndex) { parent.children().eq(index).before(parent.children().last()); }
        return parent;
      }

      function triggerMouseEvent (node, eventType) {
        var ev = document.createEvent('MouseEvents');
        ev.initEvent(eventType, true, true);
        node.dispatchEvent(ev);
      }

      function loadURL(url) {
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, false);
        xmlhttp.send();
        var data = xmlhttp.responseText;
        return data;
      }

    }
  }

}
