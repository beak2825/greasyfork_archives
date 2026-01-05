// ==UserScript==
// @name        livetube func addition
// @namespace   us0305
// @description 放送情報を動画下にも表示
// @include     http*://*livetube.cc/*/*
// @version     0.0.0.3a
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15154/livetube%20func%20addition.user.js
// @updateURL https://update.greasyfork.org/scripts/15154/livetube%20func%20addition.meta.js
// ==/UserScript==
(function () {
  var B_TIME = '00:00:00'; //前回コメントスクロール再生時間
  var B_CNUM = 0; //前回コメントスクロール要素(div)位置
  var B_TOP = 0; //前回コメントスクロールTop位置
  var AUTO_COUNT; //setInterval(roopTimeCount, 1000)
  var AUTO_SCROLL; //setInterval(CommentScroll('lvcom_count'),10000)
  var AUTO_UPDATE; //setInterval(updateDesc,60000)
  function isInteger(x) {
    return Math.round(x) === x;
  }
  function isTimeString(str) {
    var regexp;
    var keta = str.split(':');
    regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;
    /*
    switch (keta.size) {
      case 1:
        regexp = /^([0-5]?[0-9])/;
        break;
      case 2:
        regexp = /^([0-5]?[0-9]):([0-5]?[0-9])$/;
        break;
      case 3:
        regexp = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;
        break;
    }
    */
    if (regexp.test(str)) {
      return true;
    } else {
      return false;
    }
  }
  var main = (function update() {
    if (window != parent) {
      return;
    }
    if (getVideoStatus() == '[録画]') {
      /* Timestomp (録画再生モード Past video) */
      var coms = document.getElementById('comments');
      if (coms) {
        InitCommentScroll();
        var o = coms.getElementsByTagName('div')
        for (var i = 0; i < o.length; i++)
        {
          if (o[i].getAttribute('pos_in_sec')) {
            //alert(o[i].getAttribute("pos_in_sec"));
            var sec = o[i].getAttribute('pos_in_sec');
            var h = '' + (sec / 36000 | 0) + (sec / 3600 % 10 | 0);
            var m = '' + (sec % 3600 / 600 | 0) + (sec % 3600 / 60 % 10 | 0);
            var s = '' + (sec % 60 / 10 | 0) + (sec % 60 % 10);
            var hms = h + ':' + m + ':' + s;
            //alert(hms);
            o[i].title = hms;
          } else {
            //alert('pos_in_sec not found');
          }
        }
      } else {
        //alert('#comments not found');
      }
    } else {
      AUTO_UPDATE = setInterval(updateDesc, 60000);
    }
    InitDescription();
  }) ();
  function InitDescription() {
    var desc = document.getElementById('read_entry_box');
    var cdesc = desc.cloneNode(true);
    var vbgcolor = (cdesc.currentStyle || document.defaultView.getComputedStyle(cdesc, '')).backgroundColor;
    mainRemover();
    var mainDesc = document.createElement('div');
    mainDesc.id = 'outside_description';
    mainDesc.style.display = 'block';
    cdesc.id = 'read_entry_description';
    cdesc.style.padding = '0.75em';
    var view = document.getElementById('play_view');
    if (view) {
      var t = '<div id="red_open_close" style="background:url(/images/navimg.02.png) no-repeat -120px 0px;width:13px;height:12px;float:right;"></div>';
      t = t + '<div id="red_update" style="cursor:pointer;">[放送情報]↻</div>';
      mainDesc.style.position = view.style.position;
      mainDesc.style.width = view.style.width;
      mainDesc.style.marginLeft = view.style.marginLeft;
      mainDesc.style.marginRight = view.style.marginRight;
      mainDesc.style.backgroundColor = vbgcolor;
      // addDescription
      mainDesc.innerHTML = t;
      mainDesc.appendChild(cdesc);
      view.parentNode.insertBefore(mainDesc, view.nextSibling);
      // addOpenCloseEvent
      var redoc = document.getElementById('red_open_close');
      redoc.addEventListener('click', function () {
        var cdesc = document.getElementById('read_entry_description');
        if (cdesc) {
          if (cdesc.style.display != 'none') {
            cdesc.style.display = 'none';
          } else {
            //alert('open & update');
            cdesc.style.display = 'block';
            cdesc.innerHTML = desc.innerHTML;
          }
        }
      }, false);
      // addUpdateEvent
      var redud = document.getElementById('red_update');
      redud.addEventListener('click', updateDesc, false);
    }
  }
  function mainRemover() {
    var checkmain = document.getElementById('outside_description');
    if (checkmain) {
      //Overloaded prevention
      checkmain.remove();
    }
  }
  function updateDesc() {
    var desc = document.getElementById('read_entry_box');
    var cdesc = document.getElementById('read_entry_description');
    if (cdesc) {
      //alert('update');
      cdesc.innerHTML = desc.innerHTML;
    }
  }
  function InitCommentScroll() {
    var node = [
      '<div id="lvcom_scroll" style="position:absolute; z-index:200; top:0px; left:0px; width:75%; font-size:12px;">',
      ' <input type="text" id="lvcom_count" value="00:00:00" readonly="readonly" style="width:70px;height:12px;" title="自動カウント用時間表示(直接編集不可)"></input>',
      ' <span id="lvcom_help" style="cursor:pointer;">大幅に時間がズレている場合、手動で再生時間を入力して合わせて下さい<span style="color:#FF0000;font-weight: bold;">[この文を省略]</span>:</span>',
      ' <input id="lvcom_txt" type="text" placeholder="00:00:00" value="00:00:00" style="width:70px;height:12px;" title="自動カウント用時間合わせ入力"></input>',
      ' <input id="lvcom_btn" type="button" class="btn" value="時間合わせ" title="時間合わせとスクロール"></input>',
      ' <input id="lvcom_auto_switch" type="button" class="btn" title="自動カウント・自動スクロールのOnOff切り替え" value="状態:自動on"></input>',
      '</div>'
    ].join('\n');
    var base = document.getElementById('comment_input_view_01');
    base.innerHTML += node;
    // スクロールボタン押下
    $('#lvcom_btn').click(function () {
      //alert('時間検索開始');
      CommentScroll('lvcom_txt');
      document.getElementById('lvcom_count').value = document.getElementById('lvcom_txt').value;
      clearInterval(AUTO_COUNT);
      AUTO_COUNT = setInterval(roopTimeCount, 1000);
    });
    // コメントクリックしたとき　コメント時の動画再生時間を取得
    $('span').click(function () {
      //alert('span.click');
      if (this.getAttribute('onclick')) {
        //alert(this.getAttribute('onclick') + " = " + this.parentNode.parentNode.getAttribute('title'));
        document.getElementById('lvcom_count').value = this.parentNode.parentNode.getAttribute('title');
        document.getElementById('lvcom_txt').value = this.parentNode.parentNode.getAttribute('title');
        CommentScroll('lvcom_txt');
        clearInterval(AUTO_COUNT);
        AUTO_COUNT = setInterval(roopTimeCount, 1000);
      } else {
        //alert('onclick not found');
      }
    });
    // 省略ボタン
    $('#lvcom_help').click(function () {
      if (this.innerHTML == '[説明文表示]') {
        this.innerHTML = '大幅に時間がズレている場合、手動で再生時間を入力して合わせて下さい<span style="color:#FF0000;font-weight: bold;">[この文を省略]</span>:';
      } else {
        this.innerHTML = '[説明文表示]';
      }
    });
    // 自動スクロールOn/Off切り替え ※input checkboxだとイベント動かない。 jqueryでも同様(change/on/clickなど全て)。liveTube側で加工されてしまう。
    var lv_check = document.getElementById('lvcom_auto_switch');
    lv_check.addEventListener('click', function () {
      //alert('lvcom_auto_swith');
      if (this.value != '状態:自動on') {
        clearInterval(AUTO_COUNT);
        clearInterval(AUTO_SCROLL);
        AUTO_COUNT = setInterval(roopTimeCount, 1000);
        AUTO_SCROLL = setInterval(function () {
          CommentScroll('lvcom_count');
        }, 10000);
        this.value = '状態:自動on';
      } else {
        clearInterval(AUTO_COUNT);
        clearInterval(AUTO_SCROLL);
        this.value = '状態:自動off';
      }
    }, false);
    // 自動スクロール
    AUTO_COUNT = setInterval(roopTimeCount, 1000);
    AUTO_SCROLL = setInterval(function () {
      CommentScroll('lvcom_count');
    }, 10000);
  }
  function Chk_lvtxtTime(ctrlName) {
    console.log('Chk_lvtxtTime Start:' + ctrlName);
    var lvtxt = document.getElementById(ctrlName).value;
    if (lvtxt.length == 0) document.getElementById(ctrlName).value = '00:00:00';
    console.log('Chk_lvtxtTime Step2');
    if (lvtxt.length > 2 && lvtxt.indexOf(':') != - 1) {
      console.log('Date check');
      if (!isTimeString(lvtxt)) {
        alert('再生時間を正しく入力して下さい');
        return false;
      }
    } else {
      console.log('Int check');
      if (!isInteger(Number(lvtxt.replace(/:/g, '')))) {
        alert('再生時間を正しく入力して下さい');
        return false;
      }
      //alert('Date check');

      if (!isTimeString(lvtxt)) {
        alert('再生時間を正しく入力して下さい');
        return false;
      }
    }
    console.log('Chk_lvtxtTime End');
    return true;
  }
  function CommentScroll(ctrlName) {
    console.log('CommentScroll Start:' + ctrlName);
    if (Chk_lvtxtTime(ctrlName) == false) return;
    var PREV_TIME = '99:59:59';
    var PREV_CNUM = 0;
    var lvtxt = document.getElementById(ctrlName).value;
    var coms = document.getElementById('comments');
    var o = coms.getElementsByTagName('div');
    var start = 0;
    //var max = o[o.length - 1].getAttribute('pos_in_sec');
    // 前回スクロール時間との比較で検索開始位置を変更
    if ((Number(B_TIME.replace(/:/g, '')) <= Number(lvtxt.replace(/:/g, '')))) start = B_CNUM;
    for (var i = start; i < o.length; i++)
    {
      if (o[i].getAttribute('pos_in_sec')) {
        if (lvtxt == o[i].getAttribute('title')) {
          //alert('lvtxt == o[B_CNUM]');
          B_CNUM = i;
          B_TIME = o[B_CNUM].getAttribute('title');
          break;
        } else {
          //alert('lvtxt != o[B_CNUM]');
          var cnum = Number(o[i].getAttribute('title').replace(/:/g, ''));
          var lvnum = Number(lvtxt.replace(/:/g, ''));
          //var pnum = Number(PREV_TIME.replace(/:/g, ''));
          if (cnum > lvnum) {
            B_CNUM = PREV_CNUM;
            B_TIME = o[PREV_CNUM].getAttribute('title');
            break;
          }
        }
        PREV_CNUM = i;
        PREV_TIME = o[PREV_CNUM].getAttribute('title');
      } else {
        //alert('pos_in_sec not found');
      }
    }
    console.log(' CommentScroll:' + B_CNUM + ',' + B_TIME + ',' + B_TOP);
    var pane = document.getElementById('right_pane');
    var rect = o[B_CNUM].getBoundingClientRect();
    //console.log(pane.scrollTop + ',' + rect.top);
    // コメント位置までスクロールさせる
    var barsize = ((window.innerHeight + window.scrollTop) >= pane.getBoundingClientRect().height) ? 18 : 0;
    //pane.scrollTop = (rect.top + pane.scrollTop) - (pane.getBoundingClientRect().height - rect.height - barsize);
    pane.scrollTop = (rect.top + pane.scrollTop) - 16;
    B_TOP = pane.scrollTop;
  }
  function getVideoStatus() {
    var state = document.getElementById('breadcrumbs').getElementsByClassName('xright') [0].innerHTML.match(/\[.*\]/) [0];
    //alert(state);
    return state;
  }
  function roopTimeCount() {
    var time = document.getElementById('lvcom_count').value.split(':');
    var plus = [
      0,
      0,
      0
    ];
    var hms = '';
    for (var i = time.length - 1; i >= 0; i--)
    {
      if (i == time.length - 1) time[i] = Number(time[i]) + 1
      time[i] = Number(time[i]) + plus[i];
      if ((time[i] >= 60) && (i != 0)) {
        time[i] = '0' + time[i] % 10;
        plus[i - 1] = 1;
        hms = time[i] + hms;
        hms = ':' + hms;
      } else {
        if (time[i] < 10) time[i] = '0' + time[i];
        hms = time[i] + hms;
        if (i != 0) hms = ':' + hms;
      }
    }
    //alert(time + ',' + hms);

    document.getElementById('lvcom_count').value = hms;
  }
}) ();