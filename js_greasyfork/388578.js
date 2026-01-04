// ==UserScript==
// @name         eForm輔助工具
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       Kai
// @match        http://eformtest/eform/*
// @match        http://v-misdev2/eform/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.8/js/select2.min.js
// @downloadURL https://update.greasyfork.org/scripts/388578/eForm%E8%BC%94%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/388578/eForm%E8%BC%94%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $('head').append('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">');
    $('head').append('<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.8/css/select2.min.css" rel="stylesheet" />');

    $('head').append('<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>');
    $('head').append('<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>');

    $('body').prepend('<div id="content"></div>');

    function SelectSearch() {
        $('#content').append('<div id="mytoolbar" class="container-fluid"></div><hr/>');
        // 建立物件
        var deptObj = '<select id="select_dept"></select>';
        var accountObj = '<select id="select_account"></select>';
        var favObj = '<select id="select_fav" data-placeholder="請選擇">';
        var ulfavObj = '<div id="div_fav"></div>';
        var addfavList = '<button id="add_fav" type="button" class="btn btn-primary btn-sm">加入常用</button>';
        var deletefavList = '<button id="delete_fav" type="button" class="btn btn-danger btn-sm">刪除</button>';
        var clearfavList = '<button id="clear_fav" type="button" class="btn btn-danger btn-sm">清空</button>';
        var switchUser = '<button name="switch_user" type="button" class="btn btn-primary btn-sm">切換</button>';
        var userName = `<label class="text-danger">${$($('font[class="default"]')[0]).text()}</label>`;
        $('#mytoolbar').append(`<div class="row">
                                  <div class="col-2 text-right">快速搜尋：</div>
                                  <div class="col-10">
                                      <div class="row">
                                          <div class="col-6">${deptObj} ${accountObj} ${addfavList} ${clearfavList}</div>
                                          <div class="col-6">
                                          </div>
                                      </div>
                                  </div>
                               </div>`);
        $('#mytoolbar').append(`<div class="row">
                                  <div class="col-2 text-right">切換身分：</div>
                                  <div class="col-10">
                                      <div class="row">
                                          ${ulfavObj}
                                      </div>
                                  </div>
                               </div>`);

        // 單位下拉選單
        IniDeptOption();
        // 人下拉選單
        IniAccountOption();

        // 常用清單下拉選單
        InitFavOption();
        // 常用清單連結
        InitDivFav();

        // 加入清空常用按鈕
        AddClearFavBtn();
        // 加入常用按鈕
        AddFavBtn();
        // 加入切換按鈕
        AddSwitchUserBtn();
        // 加入刪除已選擇常用按鈕
        AddDeleteFavBtn();
    }

    // 單位下拉選單
    function IniDeptOption() {
        // 複製一份選項
        $('select[name="DeptID"]  option').clone().appendTo('#select_dept');
        // 當單位變動
        $('#select_dept').change(function () {
            //
            $('select[name="DeptID"]').val($(this).val());
            MagicFilter2("EinForm0", "DeptID");

            IniAccountOption();
        });

        $('#select_dept').select2({ width: "30%" });
    }

    // 人下拉選單
    function IniAccountOption() {
        $('#select_account option').remove();
        $('select[name="AccountID"] option').clone().appendTo('#select_account');

        // 當人變動
        $('#select_account').change(function () {
            $('select[name="AccountID"]').val($(this).val());
        });

        $('#select_account').select2({ width: "30%" });
    }

    // 加入常用按鈕
    function AddFavBtn() {
        $('#add_fav').click(function () {
            var deptID = $("#select_dept :selected").val();
            var deptName = $("#select_dept :selected").text().trim();
            var accountID = $("#select_account :selected").val();
            var accountName = $("#select_account :selected").text().trim();

            var result = [];
            var favList = localStorage.getItem("favList");
            if (favList) {
                result = JSON.parse(favList);
            }
            result.push({ 'deptID': deptID, 'deptName': deptName, 'accountID': accountID, 'accountName': accountName });

            var norepeat = [...new Set(result.map(item => JSON.stringify(item)))].map(item => JSON.parse(item));
            localStorage.setItem("favList", JSON.stringify(norepeat));

            InitFavOption();
        });
    }

    // 加入清空常用按鈕
    function AddClearFavBtn() {
        $('#clear_fav').click(function () {
            localStorage.setItem("favList", []);
            InitFavOption();
        });
    }

    // 常用清單下拉選單
    function InitFavOption() {
        $('#select_fav option').remove();
        $('#select_fav').append(`<option></option>`);
        var favList = localStorage.getItem("favList");
        if (favList) {
            var listObj = JSON.parse(favList);
            $.each(listObj, function (i, v) {
                $('#select_fav').append(`<option value="${v.deptID},${v.accountID}">${v.deptName}_${v.accountName}</option>`);
            });
        }

        $('#select_fav').change(function () {
            var data = $('#select_fav :selected').val().split(',');
            $('select[name="DeptID"]').val(data[0]);
            MagicFilter2("EinForm0", "DeptID");
            $('select[name="AccountID"]').val(data[1]);

            //$('#select_dept').val(data[0]);
            //$('#select_account').val(data[1]);
        });

        $("#select_fav").select2({ width: "40%" });
    }

    // 常用清單連結
    function InitDivFav() {
        $('#div_fav').empty();
        var favList = localStorage.getItem("favList");
        if (favList) {
            var listObj = JSON.parse(favList);
            var row = 0;
            $.each(listObj, function (i, v) {
                $('#div_fav').append(`<ul id="ul_${row}" class="list-group list-group-horizontal-sm"></ul>`);
                $(`#ul_${row}`).append(`<li class="list-group-item"><a class="text-nowrap user-link" href="#" data-deptid="${v.deptID}" data-accountid="${v.accountID}" data-toggle="tooltip" title="${v.deptName}_${v.accountName}">${v.accountName}</a></li>`);
                if ((i+1) % 13 == 0) {
                    row++;
                }
            });
        }

        $('.user-link').click(function(){
            var deptid = $(this).data('deptid');
            var accountid = $(this).data('accountid');
            $('select[name="DeptID"]').val(deptid);
            MagicFilter2("EinForm0", "DeptID");
            $('select[name="AccountID"]').val(accountid);

            $('form[name="EinForm0"]').submit();
        });
    }

    // 加入切換按鈕
    function AddSwitchUserBtn() {
        $('[name="switch_user"]').click(function () {
            $('form[name="EinForm0"]').submit();
        });
    }

    // 加入刪除已選擇常用按鈕
    function AddDeleteFavBtn() {
        $('#delete_fav').click(function () {
            var data = $('#select_fav :selected').val().split(',');
            var favList = localStorage.getItem("favList");
            if (favList) {
                var listObj = JSON.parse(favList);
                $.each(listObj, function (i, v) {
                    if (v.deptID == data[0] && v.accountID == data[1]) {
                        localStorage.setItem("favList", JSON.stringify(listObj.filter(item => item != v)));
                    }
                });
            }
            InitFavOption();
        });
    }

    // 將下拉選單變為搜尋式下拉選單
    SelectSearch();


    // 快速填值
    function InputText() {
        $('#content').append('<div id="myfunbar" class="container-fluid"></div><hr/>');

        var allInput = '<input type="text" class="form-control" id="inputText" placeholder="如果原本有值則不變更" />';

        $('#myfunbar').append(`<div class="row form-inline">
                              <div class="col-2 text-right">快速填值：</div>
                              <div class="col-10">所有輸入框：${allInput}</div>
                           </div>`);

        $('#inputText').change(function () {
            var result = $('#inputText').val();
            $.each($('table input[type="text"], table textarea'), function(i, v){
                if ($(v).val().length == 0){
                    $(v).val(result);
                }
            });
            //$('table input[type="text"]').val(result);
            //$('table textarea').val(result);
        });
    }
    //InputText();
})();