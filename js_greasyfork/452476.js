// ==UserScript==
// @name             聯盟戰地排行榜
// @namespace        http://tampermonkey.net/
// @version          0.5
// @description      聯盟戰地排行榜整合
// @author           Killua115
// @license          MIT
// @match            https://event.beanfun.com/mapleStory/E20170713/*
// @match            https://tw-event.beanfun.com/MapleStory/Event/E20170713/*
// @icon             https://tw.beanfun.com/favicon.ico
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_getResourceText
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      event.beanfun.com
// @downloadURL https://update.greasyfork.org/scripts/452476/%E8%81%AF%E7%9B%9F%E6%88%B0%E5%9C%B0%E6%8E%92%E8%A1%8C%E6%A6%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/452476/%E8%81%AF%E7%9B%9F%E6%88%B0%E5%9C%B0%E6%8E%92%E8%A1%8C%E6%A6%9C.meta.js
// ==/UserScript==



$(function () {
    var DataGet = new Data.Get();
    DataGet.Server();
    //DataGet.RankList("0",1,0);
    $('.action').keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $('#butSearchRank').click();
            return false;
        }
    });
});




//伺服器
var Data = {};

Data.Get = function () {
    this.Server = function () {
        $.ajax({
            type: "POST",
            url: "Default.aspx/GetServer",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                this.ResultServer = response;
                var data = JSON.parse(response.d);
                var jsonData = JSON.parse(data.data);
                var htmlData = "<select>";
                for (var i = 1; i <= jsonData.length; i++) {
                    var ser = jsonData[i - 1].GameWorldID;
                    switch (ser) {
                        case 11:
                            ser = 7;
                            break;
                        case 13:
                            ser = 8;
                            break;
                        case 22:
                        case 10:
                            ser = 9;
                            break;
                        case 14:
                        case 15:
                        case 16:
                        case 17:
                        case 18:
                        case 19:
                        case 20:
                        case 21:
                            ser = 12;
                            break;
                        default:

                    }

                    htmlData += '<option value="' + ser + '">' + jsonData[i - 1].GameWorldName + '</option>';
                }
                htmlData += '</select>';
                $("body > div.tab-content > form > div.sel-server").append(htmlData);
                $('select')[0].remove();
                $("select").change(function () {
                    var DataGet = new Data.Get();
                    var type = $('#hfType').val();
                    DataGet.RankList(type, 1, this.value);
                });
            },
            failure: function (response) {
                console.log("Error");
            }
        });
    }
    this.RankList = function (type, page, server) {

        //初始化 頁數
        if (page == null) {
            page = 1;
        }
        //初始化 種類
        if (type == null) {
            type = "0";
        }
        //初始化 伺服器
        if (server == null) {
            server = 0;
        }
        if (!((Number.isInteger(page))|(Number.isInteger(server)))) {
            alert('參數有誤，請重新整理');
            return;
        }
        
        $('#hfServer').val(server);
        
        $.ajax({
            type: "POST",
            url: "Default.aspx/GetRankList",
            data: JSON.stringify({ type: type, page: page, serverID: server }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var htmlData = '';
                var data = JSON.parse(response.d);

                if (data.code == "9999") {
                    alert(data.message);
                    return;
                }
                var jsonData = JSON.parse(data.data);
                if (jsonData.length > 0) {
                    for (var i = 1; i <= jsonData.length; i++) {
                        htmlData += '<div class="row">';
                        htmlData += '            <div class="rank0"><span>' +  jsonData[i - 1].Rank_DPS + '</span></div>';
                        //htmlData += '            <div class="avatar"><img src="<%# getAvatar(' + jsonData[i - 1].CharacterLook + ')%>"></div>';
                        htmlData += '            <div class="avatar"><img src="' + jsonData[i - 1].Avatar_CharacterLookURL + '"></div>';
                        //htmlData += '            <div class="avatar"><img src="images/90x902.png"></div>';
                        htmlData += '            <div class="wrap">';
                        htmlData += '                <div class="id">';
                        htmlData += '                    <span>名稱</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].CharacterName + '</span>';
                        htmlData += '                </div>';
                        htmlData += '                <div class="role">';
                        htmlData += '                    <span>職業</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].JobName + '</span>';
                        htmlData += '                </div>';
                        htmlData += '                <div class="point">';
                        htmlData += '                    <span>分數</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].UnionDPS + '</span>';
                        htmlData += '                </div>';
                        htmlData += '            </div>';
                        htmlData += '            <div class="change ' + jsonData[i - 1].Rank_DPS_Change + '">持平</div>';
						
						htmlData += '                <div class="rank"><span>' + jsonData[i - 1].Rank_Level + '</span></div>';
						htmlData += '            <div class="wrap">';
						htmlData += '                <div class="point">';
                        htmlData += '                    <span>分數</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].UnionLevel + '</span>';
                        htmlData += '                </div>';
						htmlData += '                <div class="change ' + jsonData[i - 1].Rank_Level_Change + '">持平</div>';
						htmlData += '                <div class="id">';
                        htmlData += '                    <span>等級</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].Level + '</span>';
                        htmlData += '                </div>';
						htmlData += '                <div class="date">';
                        htmlData += '                    <span>資料時間</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].ImportTime + '</span>';
                        htmlData += '                </div>';
						htmlData += '            </div>';
						
                        htmlData += '        </div>';
                    }
					$(".th").html('');
					$('.table-th').append('<div class="th"></div><div class="th"></div><div class="th"></div><div class="th"></div><div class="th"></div>');
                    $("#content").html('').append(htmlData);
                    

                    $("#content .row .rank").each(function (i) {
                        if ($("span", this).html() == i + 1) {
                            $(this).addClass("rank" + (i + 1));
                        }
                    });

                    //分頁隱藏
                    $('body > div.tab-content > div.pager').css("display", "");

                    var pager = new Imtech.Pager();
                    pager.paragraphsPerPage = 10; // set amount elements per page
                    pager.pagingContainer = $('#content'); // set of main container
                    pager.paragraphs = $('div.row', pager.pagingContainer); // set of required containers
                    pager.showPage(page);
                } else {
                    $("#table").html('');
                    //分頁隱藏
                    $('body > div.tab-content > div.pager').css("display", "none");

                    alert("目前無資料。");
                }
                
            },
            failure: function (response) {
                console.log("Error");
            }
        });
    }
    this.SeachRank = function (Type, Name, server) {
        if (server == null) {
            server = 0;
        }
        if (Name == null) {
            Name = "";
        }

        if (Type == null) {
            Type = "0";
        }

        if (Name == "") {
            alert('請輸入角色名稱。');
            return;
        }

        $.ajax({
            type: "POST",
            url: "Default.aspx/GetSearchRank",
            data: JSON.stringify({ Type: Type, Name: Name, serverID: server }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var htmlData = '';
                var data = JSON.parse(response.d);
                if (data.code == "9999") {
                    alert(data.message);
                    return;
                }

                var jsonData = JSON.parse(data.data);
                
                if (jsonData.length > 0) {
                    for (var i = 1; i <= jsonData.length; i++) {
                        htmlData += '<div class="row">';
                        htmlData += '            <div class="rank0"><span>' +  jsonData[i - 1].Rank_DPS + '</span></div>';
                        //htmlData += '            <div class="avatar"><img src="<%# getAvatar(' + jsonData[i - 1].CharacterLook + ')%>"></div>';
                        htmlData += '            <div class="avatar"><img src="' + jsonData[i - 1].Avatar_CharacterLookURL + '"></div>';
                        //htmlData += '            <div class="avatar"><img src="images/90x902.png"></div>';
                        htmlData += '            <div class="wrap">';
                        htmlData += '                <div class="id">';
                        htmlData += '                    <span>名稱</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].CharacterName + '</span>';
                        htmlData += '                </div>';
                        htmlData += '                <div class="role">';
                        htmlData += '                    <span>職業</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].JobName + '</span>';
                        htmlData += '                </div>';
                        htmlData += '                <div class="point">';
                        htmlData += '                    <span>分數</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].UnionDPS + '</span>';
                        htmlData += '                </div>';
                        htmlData += '            </div>';
                        htmlData += '            <div class="change ' + jsonData[i - 1].Rank_DPS_Change + '">持平</div>';
						
						htmlData += '                <div class="rank"><span>' + jsonData[i - 1].Rank_Level + '</span></div>';
						htmlData += '            <div class="wrap">';
						htmlData += '                <div class="point">';
                        htmlData += '                    <span>分數</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].UnionLevel + '</span>';
                        htmlData += '                </div>';
						htmlData += '                <div class="change ' + jsonData[i - 1].Rank_Level_Change + '">持平</div>';
						htmlData += '                <div class="id">';
                        htmlData += '                    <span>等級</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].Level + '</span>';
                        htmlData += '                </div>';
						htmlData += '                <div class="date">';
                        htmlData += '                    <span>資料時間</span>';
                        htmlData += '                    <span>' + jsonData[i - 1].ImportTime + '</span>';
                        htmlData += '                </div>';
						htmlData += '            </div>';
						
                        htmlData += '        </div>';
                    }

                    $("#content").html('').append(htmlData);

                    $("#content .row .rank").each(function (i) {
                        if ($("span", this).html() == i + 1) {
                            $(this).addClass("rank" + (i + 1));
                        }
                    });

                    var html = '';
                    $('div.row', $('#content')).slice(0, 9).each(function () {
                        html += '<div class="row">' + $(this).html() + '</div>';
                    });

                    $('#table').html(html);
                    $('body > div.tab-content > div.pager').css("display", "none");
                    $('#txtName').val('');
                } else {
                    $('#txtName').val('');
                    alert("查無此角色ID或該名角色ID未在10000名排行榜名單內。");
                }
                
            },
            failure: function (response) {
                console.log("Error");
            }
        });
    }
}

