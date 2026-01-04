// ==UserScript==
// @name        ジョブカン employee 改造
// @namespace   hamada.y
// @match       https://ssl.jobcan.jp/employee*
// @grant       none
// @version     1.3.5
// @author      hamada.y
// @description 2020/11/22 18:51
// @require https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment-with-locales.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-timepicker/1.13.18/jquery.timepicker.min.js
// @resource tpcss https://cdnjs.cloudflare.com/ajax/libs/jquery-timepicker/1.13.18/jquery.timepicker.min.css
// @grant GM_addStyle
// @grant GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/422218/%E3%82%B8%E3%83%A7%E3%83%96%E3%82%AB%E3%83%B3%20employee%20%E6%94%B9%E9%80%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/422218/%E3%82%B8%E3%83%A7%E3%83%96%E3%82%AB%E3%83%B3%20employee%20%E6%94%B9%E9%80%A0.meta.js
// ==/UserScript==



/********************************************************************************
 * ユーザースクリプト
 ********************************************************************************/

$(function(){
  if($("#jim-init").length){
    return;  //拡張機能版が有効なら何もしない
  }

  スタイルシートを追加()
  全体共通_改造_begin();
  
  //======================================================================
  // 各画面の改造
  //======================================================================
  if (url_match("attendance")){
    出勤簿_改造()
  }
  if (url_match("adit/modify")){
    打刻修正_改造()
  }
  if (url_match("shift-pattern-request")){
    シフト申請_改造()
  }
  if (url_match("holiday/new")){
    休暇申請_改造()
  }
  if (url_match("holiday/?$|holiday/\\?.*")){
    休暇申請一覧_改造()
  }
  if (url_match("over-work/new")){
    残業申請_改造()
  }
  if (url_match("holidayworking/new")){
    休日出勤申請_改造()
  }
  if (url_match("edit-info/?$")){
    スタッフ設定_改造()
  }
  //=============================
  
  
  全体共通_改造_end()
  
  
  function 全体共通_改造_begin(){
    //------------------------------------------------
    // シフト申請のメニューなど最初から展開しておく
    //------------------------------------------------
    $(".dropup .dropdown-menu")
      .removeClass("dropdown-menu")
      .addClass("eg2-dropdown-menu")

    $(".dropup .list-group-item:not('.active')")
      .css("background-color", "#d3d3d3")

    $(".dropup svg.bi").remove()  // グループの右に出てる「>」は邪魔なので消す
    $(".dropup > a").css("pointer-events", "none")

    //----------------------------------------------
    // 申請メニューに新規作成ボタン［＋］を追加する
    //----------------------------------------------
    $("#menu_order a").wrap(`<div class="eg2-dropdown-item-wrapper">`)
    $(".eg2-dropdown-item-wrapper").append(/*html*/`

      <a 
        class="eg2-submenu-add-button"
        data-toggle="tooltip"
        data-placement="right"
      >
        <i class="fa fa-plus" aria-hidden="true" style="font-size: 1.2rem;"></i>
      </a>

    `)

    $(".eg2-submenu-add-button").each(function(){
      var add_href = $(this).prev("a").attr("href") + '/new'
      var 申請タイプ = $(this).prev("a").text()
      $(this).attr({
        href: add_href,
        title: "新規" + 申請タイプ,
      })
    })

    //----------------------------------------------
    // その他、見た目のカスタマイズ
    //----------------------------------------------

    // カレンダーボタンの大きさ調整
    var cal_btn_scale = 1.5
    $("svg.bi-calendar-check").css({
      transform: "scale("+cal_btn_scale+")",
    })

    var cal_scale = 1.25
    $("span[id^='cal']").css({
      transform: "scale("+cal_scale+")",
      "z-index": 9999,
    })
  }

  function 全体共通_改造_end(){
    $('[data-toggle="tooltip"]').tooltip()
  }


  function 出勤簿_改造(){

    const $table = $("#search-result > div.table-responsive.text-nowrap > table");
    $table.find("td:contains('法休'), td:contains('公休')").closest("tr").addClass("holiday")

    $table.find("thead tr").prepend(`<th>申請</th>`)
    $table.find("tbody tr").prepend(`<td class="eg2-td-申請"></td>`)
    $table.find("tfoot th").attr({colspan: 3})

    $table.find("tbody tr").each(function(){
      let is_holiday = $(this).hasClass("holiday")
      let $申請td = $(this).find(".eg2-td-申請")

      $申請td.append(/*html*/`

        <button class="eg2 eg2-出勤簿-申請追加 btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-plus" aria-hidden="true"></i>
        </button>
        <div class="eg2 eg2-出勤簿-申請メニュー dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item eg2-shift-pattern-request">シフト</a>
          <a class="dropdown-item eg2-holiday-new not-show-in-holiday">休暇</a>
          <a class="dropdown-item eg2-over-work-new not-show-in-holiday">残業</a>
          <a class="dropdown-item eg2-holidayworking-new show-in-holiday">休日出勤</a>
        </div>

      `)

      const param = $(this)
        .find("a[href*='modify']")
        .attr("href").match(/\?.*/)[0]

      $申請td.find(".eg2-shift-pattern-request")       .attr({href: "/employee/shift-pattern-request" + param})
      $申請td.find(".eg2-holiday-new")       .attr({href: "/employee/holiday/new" + param})
      $申請td.find(".eg2-over-work-new")      .attr({href: "/employee/over-work/new" + param})
      $申請td.find(".eg2-holidayworking-new").attr({href: "/employee/holidayworking/new" + param})
    })

  }

  function 打刻修正_改造(){
    // 時刻入力で「:」を入れた場合に自動で除去する
    $("#ter_time").change(function(){
      $(this).val( $(this).val().replace(":","") )
    })
    // // 時刻入力にシンプルなピッカーを追加
    // $("#ter_time").timepicker({
    //   scrollDefault: "now",
    //   show2400: true,
    //   timeFormat: "H:i",
    // })
  }

  function シフト申請_改造(){
    setTimeout(function(){
      let scroll_to = null
      let $target_a = null
      if ($target_a = $("a[href*='"+location.search+"']")){
        scroll_to = $target_a.offset().top - 200
      }
      if (scroll_to){
        $("html").animate({scrollTop: scroll_to},'fast')
      }
    }, 300)
  }

  function 休暇申請_改造(){
    let params = get_param_from_current_url()

    setTimeout(function(){
      if (params.year && params.month && params.day){
        $("#holiday_year , #to_holiday_year ").val(params.year)
        $("#holiday_month, #to_holiday_month").val(params.month)
        $("#holiday_day  , #to_holiday_day  ").val(params.day)
        $("#holiday_day  , #to_holiday_day  ").change()
      }
    }, 200)

    $("div.card").append("<div class='card-body' id='申請一覧'>")
    $.ajax("https://ssl.jobcan.jp/employee/holiday")
      .then(function(r){
        var $table = $(r).find("table").eq(1)
        $table.find("th:nth-child(5), td:nth-child(5)").remove()
        $table.appendTo("#申請一覧")
      })


  }


  function 休暇申請一覧_改造(){
    let $申請table = $("main > div > div > div > div.table-responsive.text-nowrap > table");
    $申請table.find("tbody tr").each(function(){
      let 休暇日 = $(this).find("td:nth-child(2)").text()
      let 期間 = $(this).find("td:nth-child(6)").text()
      let 内容 = $(this).find("td:nth-child(4)").text()
      let grp = 内容.match(/有休|振休|夏季休暇|育児参加特別|欠勤|忌引休暇|慶事休暇|看護休暇/)
      if (grp){
        休暇区分 = grp[0]
      } else {
        休暇区分 = 内容
      }

      let $a = create_link_add_google_calendar(休暇区分, 休暇日, 期間)
      $a.append('<i class="fa fa-calendar-plus-o" style="font-size: 1.5rem; margin-left: 5px;"></i>')

      $(this).find("td:nth-child(2)").append($a)

    })
  }

  function 残業申請_改造(){
    // テンプレ入れ込み
    $("[name='description']").val(localStorage.jim__template残業理由)

    // urlパラメータの処理
    let params = get_param_from_current_url()

    setTimeout(function(){
      if (params.year && params.month && params.day){
        $("#over_work_year ").val(params.year)
        $("#over_work_month").val(params.month)
        $("#over_work_day  ").val(params.day)
        $("#over_work_day  ").change()
      }
    }, 200)


    $("form.card").append("<div class='card-body' id='申請一覧'>")
    $.ajax("https://ssl.jobcan.jp/employee/over-work")
      .then(function(r){
        var $table = $(r).find("table").eq(1)
        $table.find("th:nth-child(4), td:nth-child(4)").remove()
        $table.appendTo("#申請一覧")
      })

    $("select[name='end[h]']").val(18); // 18は20時のこと

    // 残業理由のテンプレート化ボタン
    $("table:nth-child(1) > tbody > tr:nth-child(1) > th").css({width: "100px"})

    let $th残業理由 = $("table:nth-child(1) > tbody > tr:nth-child(3) > th")
    $th残業理由
      .append(
        $(`<button>`).attr({
          id: "eg2-残業理由テンプレート化", 
          "class": "btn jbc-btn-secondary",
          "data-toggle": "tooltip",
          title: "現在の値：" + localStorage.jim__template残業理由,
          style: "font-size: 0.8rem; margin: 5px 0",
        }).text("テンプレート化")
      ).promise().done(function(){
        $("#eg2-残業理由テンプレート化").on("click", function(){
          localStorage.jim__template残業理由 = $("[name='description']").val()
          return false;
        })
      })

  }

  function 休日出勤申請_改造(){
    let params = get_param_from_current_url()

    setTimeout(function(){
      if (params.year && params.month && params.day){
        $("#holidayworking_year ").val(params.year)
        $("#holidayworking_month").val(params.month)
        $("#holidayworking_day  ").val(params.day)
        $("#holidayworking_day  ").change()
      }
    }, 200)


    $("form.card").append("<div class='card-body' id='申請一覧'>")
    $.ajax("https://ssl.jobcan.jp/employee/holidayworking")
      .then(function(r){
        var $table = $(r).find("table").eq(1)
        $table.find("th:nth-child(6), td:nth-child(6)").remove()
        $table.appendTo("#申請一覧")
      })
  }


  function スタッフ設定_改造(){
    return false;
    // todo 実装中

    $("main div.jbc-container").append(/*html*/`

  <div style="height:40px"></div>

  <h2 class="mb-3">ユーザースクリプト設定 <span style="color:#aaaaaa; font-size:1.5rem;">（リアルタイム保存）</span></h2>

  <div class="row">
    <div class="col-lg-8">
      <div class="card jbc-card">

        <div class="card-body">
          <table class="table jbc-table jbc-table-fixed table-borderless">
            <tbody>
              <tr>
                <th scope="row" class="jbc-text-sub jbc-title text-nowrap text-right" style="width: 170px;">
                  <span class="jbc-title-text">カレンダーボタンのサイズ</span></th>
                  <td><input class="form-control jbc-form-control " type="text" name="tel" id="cal-btn-size" value="">
                  <div class="invalid-feedback">"電話番号"は半角数字で入力してください</div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>

    `)
  }


  function スタイルシートを追加(){
    // timepickerのcss
    const tp_css = GM_getResourceText("tpcss")
    GM_addStyle(tp_css)

    GM_addStyle(/*html*/`

  <style type="text/css">
    .eg2 a, a.eg2 {
      text-decoration: none !important;
    }

    /* サイドメニューの背景色変更 */

    /* メニューにマウスホバーしたときの背景色を薄水色に */
    .jbc-sidemenu .list-group-item:hover
    , .jbc-sidemenu .dropdown-item:hover {
      background-color: #b7d6dc;
    }
    /* アクティブなメニューの背景色をタイトルと同じ水色に */
    .jbc-sidemenu .list-group-item.active {
      background-color: #1eb8d9;
    }
    /* アクティブなメニューにマウスホバーしたときの背景色を少し暗めに */
    .jbc-sidemenu .list-group-item.active:hover {
      background-color: #369eb4;
    }


    /* サブメニューをインデント、高さを少し増やす */
    #sidemenu .dropdown-item.menu-btn.py-2 {
      line-height: 2.5rem;
      padding-left: 50px;
    }
    /* サブメニュー末尾に罫線をつける */
    #sidemenu .dropup {
      position: relative;
      border-bottom: solid 1px #bfbfbf;
    }

    /*=================================
     * 出勤簿用
     * ================================*/
    tr.holiday .not-show-in-holiday {
      display: none;
    }
    tr:not(.holiday) .show-in-holiday {
      display: none;
    }

    /*=================================
     * 申請メニュー用
     * ================================*/
    #menu_order a.eg2-submenu-add-button {
      text-decoration: none;
      padding: 0 20px;
    }
    .eg2-dropdown-item-wrapper {
      display: table;
      width: 100%;
      height: 50px;
    }
    .eg2-dropdown-item-wrapper a {
      display: table-cell;
      vertical-align: middle;
    }
    .eg2-submenu-add-button {
      height: 100%;
      background-color: #4d4d4d;
      color: #b4d3ff;
    }
    .eg2-submenu-add-button:hover {
      background-color: #b7d6dc;
      color: #333333;
    }
    #menu_order .dropdown-item {
      width: 200px;
    }
    #sidemenu .dropdown-item {
      vertical-align: middle;
    }


  </style>

    `)


  }

  /********************************************************************************
   * 共通関数
   ********************************************************************************/
  function url_match(url_pattern){
    var current = window.location.href
    return (current.match(new RegExp(url_pattern)) != null)
  }

  function get_param_from_current_url(){
    let url = new URLSearchParams(window.location.search)
    return Object.fromEntries(url)
  }

  function create_link_add_google_calendar(区分, 開始日, 期間){
    return $("<a>")
      .attr({
        href: generate_url_add_google_calendar(区分, 開始日, 期間),
        target: "_blank",
        "data-toggle": "tooltip",
        title: "Googleカレンダーに登録",
      })
  }

  function generate_url_add_google_calendar(区分, 開始日, 期間){
    let 件名 = get_苗字() + '　' + 区分;
    let m_開始日 = moment(new Date(開始日))
    let m_終了日 = null
    let 期間_日 = null
    let grp = null
    if (grp = 期間.match(/(\d+)日/)){
      期間_日 = parseInt(grp[1])
    } else {
      期間_日 = 1;
      件名 += ' (' + 期間 + ')'
    }
    m_終了日 = moment(new Date(開始日)).add(期間_日, 'days') 

    url_param = {
      //https://www.google.com/calendar/render?action=TEMPLATE&text=ほげ 有休&dates=20200501T120000/20200501T140000&location=東京都千代田区霞ヶ関1-1-1&trp=true&trp=undefined&trp=true&sprop=
      action: "TEMPLATE",
      text: 件名,
      dates: m_開始日.format("YYYYMMDD") + '/' + m_終了日.format("YYYYMMDD"),
    }
    return "https://www.google.com/calendar/render?" + (new URLSearchParams(url_param)).toString()
  }

  function get_苗字(){
    return $("#rollover-menu-link").text().match(/^(.*?)[ ]/)[1] // 最初のスペースまでが苗字
  }
})


