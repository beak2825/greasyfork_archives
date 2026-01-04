// ==UserScript==
// @name         yysf_plexus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  外挂程序!
// @author       You
// @match        https://*/*
// @grant        none
// @require  https://unpkg.com/axios/dist/axios.min.js
// @require  https://cdn.bootcss.com/qs/6.7.0/qs.min.js
// @require  http://cdn.staticfile.org/moment.js/2.24.0/moment.js
// @downloadURL https://update.greasyfork.org/scripts/426380/yysf_plexus.user.js
// @updateURL https://update.greasyfork.org/scripts/426380/yysf_plexus.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var qs = Qs;
  var partno = "";
  var titlestr = $('.StandardForm th')[0].innerText;
  var temparr = titlestr.split(" ");
  partno = temparr[4];
  var dateArr = [];
  var oldatt = document.getElementById('txtSerialNo').getAttribute('onchange');
  var temppath = oldatt.split("'")[1];

  document.getElementById('txtSerialNo').removeAttribute('onchange');
  document.getElementById('txtSerialNo').onchange = function () {
    $('.FieldControlCell').append('<p id="temptip">submitting, please wait </p>');
    axios({
      url: vBaseAddress + '/Rendering_Engine/Default.aspx?Request=Show&RequestData=SourceType(Screen)SourceKey(245)&ssAction=Back',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        __EVENTTARGET: 'Screen',
        __EVENTARGUMENT: 'Search',
        RequestKey: 2,
        Layout1$el_285725: partno,
        Layout1$el_385623: 'Custom',
        Layout1$el_385623_dates: 'el_385621$el_385622',
        Layout1$el_285725_hf: partno,
        Layout1$el_285725_hf_last_valid: partno,
        Layout1$el_3204: 'on',
        Layout1$el_24071: 'Main (C1)',
        Layout1$el_24071_hf: '2340',
        Layout1$el_24071_hf_last_valid: 'Main (C1)',
        Layout1$el_81016: 'P',
        panel_row_count_3: 20,
        hdnScreenTitle: 'Inventory',
        //   __VIEWSTATEGENERATOR:'2811E9B3',

      })
    }).then(res => {
      debugger;
      $('#temptip').remove();
      res = res.data;
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(res, "text/html");
      var eles = htmlDoc.getElementsByClassName('AlternateGridRow');
      console.info(eles);
      dateArr = [];
      var serialno = '';
      var date = '';
      var state = '';
      for (var i = 0; i < eles.length; i++) {
        var el = eles[i];
        console.info(el);
        var tds = el.getElementsByTagName('td');
        if (tds.length == 16) {
          serialno = tds[2].innerText;
          date = tds[11].innerText;
          state = tds[10].innerText;
        } else if (tds.length == 14) {
          serialno = tds[0].innerText;
          date = tds[9].innerText;
          state = tds[8].innerText;
        }
        if (serialno && date) {
          dateArr.push({
            serialno,
            date,
            state
          });
          // break;
        }
      }
      console.info(dateArr);
      var serialno = $('#txtSerialNo').val();
      if (dateArr.length <= 0) {
        alert("未获取到库存信息请重试！");
        return false;
      } else {

        var mindate = dateArr[0].date;
        var temp = dateArr.find(v => v.serialno == serialno);
        if (!temp) {
          alert("未找到此序列号，请重试");
          return false;
        } else if (mindate != temp.date) {
          alert("输入的不是最早登记的物料，不符合FIFO原则!");
          return false;
        } else {
          Scan(temppath)
        }
      }
    })

  }

})();
