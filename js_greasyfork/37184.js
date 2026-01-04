// ==UserScript==
// @name         cointracking.info cointrends filterheaders userscript
// @namespace    http://estyles.nl/
// @version      0.6.2
// @description  go to https://cointracking.info/coin_trends.php to see it
// @author       ES
// @match        http*://cointracking.info/coin_trends.php*
// @match        http*://cointracking.info/stats.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37184/cointrackinginfo%20cointrends%20filterheaders%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/37184/cointrackinginfo%20cointrends%20filterheaders%20userscript.meta.js
// ==/UserScript==

(function () {
  'use strict';



    $('.highcharts-container').each(function(){
        var toggleLegItems = $('<button class="toggleLegItems">hideAll</button>');
        toggleLegItems.on('click',function(){
            var toggState = $(this).text() === 'hideAll';
            toggState = !toggState;
            var legItems = toggState ? '.highcharts-legend-item.highcharts-legend-item-hidden' : '.highcharts-legend-item:not(".highcharts-legend-item-hidden")';
            $(this).text(!toggState ? 'showAll' : 'hideAll');
            $(this).next().find('.highcharts-container').find(legItems).each(function(){
                $(this).click();
            });
        });
        $(this).closest('.contentbox > div[id]').before(toggleLegItems);
    });

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
      return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  var cssString = `
.headerInput {
font-size: 13px;
width: calc(100% - 18px - 6px);
margin: 0;
}

.headerCheckbox {
display: block;
width: 18px;
height: 18px;
float: left;
margin: 2px 0px;
}

.contentbox.l, .main-nav, .header {
width: 100%;
}
.contentbox {
box-sizing: border-box;
}
table.dataTable thead th, table.dataTable thead td {
min-width: 62px;
}
.wrapper {
max-width: 100%;
width: 1720px;
}
`;
  addGlobalStyle(cssString);

  $(document).ready(function () {
    var ii = 0;

    var buttonObj = {
      controls: [{
          pos: 4,
          id: 'cap',
          title: 'market cap',
          default: 100000000,
          step: 5000000
        },
        {
          pos: 6,
          id: '1h',
          title: '1h change',
          default: 1,
          step: 1
        },
        {
          pos: 7,
          id: '24h',
          title: '24h change',
          default: 1,
          step: 1
        },
        {
          pos: 8,
          id: '1w',
          title: '1w change',
          default: 1,
          step: 1
        },
        {
          pos: 9,
          id: '30d',
          title: '30d change',
          default: 1,
          step: 1
        },
        {
          pos: 5,
          id: '24vol',
          title: '24 hour volume',
          default: 100000,
          step: 50000
        },
        {
          pos: 3,
          id: 'coinVal',
          title: 'CoinValue',
          default: 1,
          step: 0.5
        },
        {
          pos: 11,
          id: 'vpmc',
          title: '24h Volume per Market Cap',
          default: 0.01,
          step: 0.01
        }
      ]
    };

    var addColObj = {
      cols: [{
          pos: 4,
          id: 'vpcap',
          title: '24h Volume per Market Cap',
          default: 100000000,
          step: 10000000,
          content: function (args) {
            var vpm = parseFloat($(this).find('td').eq(args.m).text().replace(/,/g, '')) / parseFloat($(this).find('td').eq(args.v).text().replace(/,/g, ''));
            vpm = vpm && vpm != 'Infinity' ? vpm : 0;
            return (Math.round(vpm * 100)) / 100;
          },
          v: 3,
          m: 4
        },
        {
          pos: 11,
          id: 'cmplink',
          title: 'CoinMarketCap Link',
          content: function (args) {
            var coinName = $(this).find('td').eq(args.nameCol).contents().filter(function () {
              return this.nodeType == 3;
            })[0].nodeValue.replace(' ','-').replace('token','-token');
            var coinLink = 'https://coinmarketcap.com/currencies/' + coinName + '/#markets';
            var link = "<a href='" + coinLink + "' target='_blank'>" + coinName + "</a>";
            return link;
          },
          nameCol: 1
        }
      ]
    };

    for (var buttonIdx in buttonObj.controls) {
      // put in dom
      var button = buttonObj.controls[buttonIdx];
      var ctrl = $('<br /><input type="number" value="' + button.default+'" step="' + button.step + '" id="' + button.id + 'Input" class="headerInput" /><input type="checkbox" id="' + button.id + 'Filter" class="headerCheckbox"></input>');
      $('tr[role="row"] th:nth-of-type(' + button.pos + ')').append(ctrl);
      // init vals
      $('#' + button.id + 'Input').val(localStorage.getItem(button.id + "Input") || button.default);
      $('#' + button.id + 'Filter').prop("checked", localStorage.getItem(button.id + 'Filter') == 'true' || false);
      $('#' + button.id + 'Filter').prop("indeterminate", localStorage.getItem(button.id + 'FilterBelow') == 'true' || false);
      //console.log($('#' + button.id + 'Filter'));
      //$('#'+ button.id + 'Filter, #'+ button.id + 'Input').data('id', button.id);
      //$('#'+ button.id + 'Filter, #'+ button.id + 'Input').data('pos', button.pos);

      $('#' + button.id + 'Filter').on('input change', function (event) {
        localStorage.setItem($(this).prop('id'), $(this).prop("checked"));
        localStorage.setItem($(this).prop('id') + "Below", $(this).prop("indeterminate"));
      });
      $('#' + button.id + 'Input').on('input change', function (event) {
        localStorage.setItem($(this).prop('id'), $(this).val());
      });
    }

    $('select[name="all_currencies_length"]').val(localStorage.getItem('all_currencies_length') || 1000).trigger('change').trigger('input');
    // await data load to filter.
    waitToFilter();

    // store listlenght local
    $('select[name="all_currencies_length"]').on('input change', function (event) {
      localStorage.setItem('all_currencies_length', $('select[name="all_currencies_length"]').val());
    });

    // bind clicks func to call filter / cb states
    $('.headerInput').on('input click', function (event) {
      event.stopPropagation();
      var filterCbId = '#' + $(this).prop('id').replace('Input', 'Filter');
      if ($(filterCbId).prop('checked') || $(filterCbId).prop('indeterminate')) {
        doFilterAll();
      }
    });
    $('.headerCheckbox').on('input click', function (event) {
      event.stopPropagation();
      tristate(this);
      doFilterAll();
    });
    $('th').on('input click', function (event) {
      event.stopPropagation();
      doFilterAll();
    });
    $('select[name="all_currencies_length"]').on('change', function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      waitToFilter();
    });
    $('.dataTables_paginate').on('click', function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      waitToFilter();
    });

    // debounced filter wrapper
    var doFilterAll = debounce(function () {
      for (var colIdx in addColObj.cols) {
        var col = addColObj.cols[colIdx];
        $('.' + col.id).remove();
      }
      $('tr[role="row"]').show();
      for (var buttonIdx in buttonObj.controls) {
        var button = buttonObj.controls[buttonIdx];
        doFilter(button.id, button.pos);
      }
      doAddCols();
    }, 500, false);

    function waitToFilter() {
      console.log('pending refilter');
      var checkDone = setInterval(function () {
        if ($('.dataTables_empty').length <= 0) {
          doFilterAll();
          clearInterval(checkDone);
          console.log('called refilter');
        }
      }, 750);
    }

    function doAddCols() {
      for (var colIdx in addColObj.cols) {
        var col = addColObj.cols[colIdx];
        $('.' + col.id).remove();
        $('#all_currencies thead,#all_currencies tfoot').find('tr').each(function () {
          var colHtml = $('<th width="100" tabindex="0" aria-controls="all_currencies" align="right" rowspan="1" colspan="1" style="width: 80px;" class="' + col.id + '">' + col.title + '</th>');
          $(this).find('th').eq(col.pos).after(colHtml);
        });
        $('#all_currencies tbody').find('tr[role="row"]:visible').each(function () {
          var colHtml = col.content.call(this, col) || '';
          $(this).find('td').eq(col.pos).after($('<td class="' + col.id + '">' + colHtml + '</td>'));
        });
      }
    }

    function doFilter(butId, butPos) {
      console.log('called doFilter', ii, butId, butPos);
      ii++;
      var capInVal = parseFloat($('#' + butId + 'Input').val());
      if ($('#' + butId + 'Filter').is(':checked')) {

        //console.log('cc', prevCapInVal, capInVal, prevCapInVal < capInVal);
        $('tr[role="row"]:visible td:nth-of-type(' + butPos + ')').each(function () {
          if (parseFloat($(this).text().replace(/[, %]/g, '')) < capInVal) {
            $(this).parent('tr[role="row"]').hide();
          }
        });

      } else if ($('#' + butId + 'Filter').prop("indeterminate")) {

        $('tr[role="row"]:visible td:nth-of-type(' + butPos + ')').each(function () {
          if (parseFloat($(this).text().replace(/[, %]/g, '')) > capInVal) {
            $(this).parent('tr[role="row"]').hide();
          }
        });

      }
    }

    function tristate(cb) {
      if (cb.readOnly) cb.checked = cb.readOnly = false;
      else if (!cb.checked) cb.readOnly = cb.indeterminate = true;
    }

    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    }

  });
})();