// ==UserScript==
// @name        아프리카 쪽지 필터링
// @namespace   proundotree
// @include     *://note.afreecatv.com:8133/app/index.php
// @include     *://note.afreecatv.com/app/index.php?page=recv_list
// @include     *://note.afreecatv.com/app/index.php?page=store_list
// @include     *://note.afreecatv.com/app/index.php?page=store_list&nPageNo=1&nListPerPage=15&nNoteCategory=1
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_deleteValue
// @version      1.1.6
// @description  filter for notes in afreeca
// @author       proundotree1
// @downloadURL https://update.greasyfork.org/scripts/381466/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4%20%EC%AA%BD%EC%A7%80%20%ED%95%84%ED%84%B0%EB%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/381466/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4%20%EC%AA%BD%EC%A7%80%20%ED%95%84%ED%84%B0%EB%A7%81.meta.js
// ==/UserScript==
GM_registerMenuCommand("쪽지 필터링", main, "c");
if (GM_getValue("whiteMode") == null){
   GM_setValue("whiteMode", "true")}
var usr_filter = GM_getValue("filters")
var white_mode_val = GM_getValue("whiteMode")
var whitelist = GM_getValue("whiteList");
var szWork = szPageType + '_LIST';
var dataList = {
    'szWork': szWork,
    'nPageNo': nPageNo,
    'nListPerPage': nListPerPage,
    'rand': Math.random(),
    'nNoteCategory': nNoteCategory
};

GM_addStyle("                                           \
#gmPopupContainer {                                     \
position:               absolute;                       \
top:                    15%;                            \
left:                   85%;                            \
padding:                0.3em;                          \
background:             GhostWhite;                     \
border:                 3px double black;               \
border-radius:          1ex;                            \
z-index:                777;                            \
}                                                       \
#gmPopupContainer button{                               \
cursor:                 pointer;                        \
margin:                 1em 1em 0;                      \
border:                 1px outset buttonface;          \
}                                                       \
#gmPrefsContainer {                                     \
position:               absolute;                       \
top:                    15%;                            \
left:                   85%;                            \
padding:                0.3em;                          \
background:             GhostWhite;                     \
border:                 3px double black;               \
border-radius:          1ex;                            \
z-index:                777;                            \
}                                                       \
#gmPopupTemp {                                          \
position:               absolute;                       \
top:                    60%;                            \
left:                   16%;                            \
padding:                30em;                           \
background:             White;                          \
z-index:                777;                            \
}                                                       \
#gmPrefsContainer button{                               \
cursor:                 pointer;                        \
margin:                 1em 1em 0;                      \
border:                 1px outset buttonface;          \
}                                                       \
.tooltip {\
  position: relative;\
  display: inline-block;\
}\
.tooltip .tooltiptext {\
  visibility: hidden;\
  width: 120px;\
  background-color: #000000;\
  color: #FFFFFF;\
  text-align: center;\
  border-radius: 6px;\
  padding: 5px 0;\
  position: absolute;\
  z-index: 777;\
  bottom: 125%;\
  left: 70%;\
  margin-left: -30px;\
  opacity: 0;\
  transition: opacity 0.3s;\
}\
.tooltip:hover .tooltiptext {\
  visibility: visible;\
  opacity: 1;\
}\
");

$(document).ready(function() {
    setTimeout(spray(), 200);
    setTimeout(checked_notes, 100);
    setTimeout(function() {
        $("#gmPopupTemp").remove()
    }, 500);
    setTimeout(function() {
        if (GM_getValue("whiteMode") == "true") {
        setTimeout(whiteModeBox, 0);
        setTimeout(add_white_list, 0);
        $("td.sender a").hover(
            function() {
                $(this).css({
                    color: ""
                });
            }) ;
    }}, 100)
}
)

$("body").append('                                                            \
          <div id="gmPopupTemp">                                              \
          <form>                                                              \
          <p id="Poptemp">&nbsp;</p>                                          \
          </form>                                                             \
          </div>                                                              \
');

// 팝업창 //
function main() {
    $("body").append('                                                               \
          <div id="gmPopupContainer">                                                \
          <form>                                                                     \
          <p id="mainPanel">&nbsp;</p>                                               \
          <legend>키워드 필터</legend>                                                 \
          <button id="gmPrefsBtn" type="button">설정</button>                         \
          <button id="gmCloseDlgBtn" type="button">닫기</button>                      \
          <br><br><input type="checkbox" id="white_mode">화이트리스트 모드</input>       \
          <br><br><legend>체크 후 새로고침</legend>                                      \
          </form>                                                                     \
          </div>                                                                      \
');
    //$("#mainPanel").text("쪽지 필터")

    $("#gmCloseDlgBtn").click(function() {
        $("#gmPopupContainer").remove();
    });



    $("#gmPrefsBtn").click(function() {
        $("#gmPopupContainer").remove();
        $("body").append('                                                  \
            <div id="gmPrefsContainer">                                     \
			<form id="config">                                              \
			<fieldset id="filters">                                         \
			<legend>걸러낼 키워드</legend>                                     \
			</fieldset>                                                     \
			<br><legend>여러 단어 필터</legend>                                \
			<legend>예) 바보, 똥개, 말미잘</legend>                             \
			<legend>콤마로 구분</legend><br>                                   \
			<br><legend>저장 후 새로고침</legend>                               \
			<input type="button" value="추가" class="add" id="add" />         \
			<input type="button" value="저장" class="sav" id="sav"/>          \
			</form></div>                                                    \
');

        $(document).ready(function() {
            if (usr_filter) {
                for (var j = 0; j < usr_filter.length; j++) {
                    lists(j)
                }
            }

            $('.remove').click(function() {
                $(this).parent().remove();
            });

            $("#add").click(function() {
                var intId = $("#filters div").length + 1;
                var fieldWrapper = $("<div class=\"fieldwrapper\" id=\"field" + intId + "\"/>");
                var fName = $("<input type=\"text\" name=\"filters\" class=\"required\" />");
                var removeButton = $("<input type=\"button\" class=\"remove\" value=\"삭제\" />");
                removeButton.click(function() {
                    $(this).parent().remove();
                });
                fieldWrapper.append(fName);
                fieldWrapper.append(removeButton);
                $("#filters").append(fieldWrapper);
            });
            $("#sav").click(function() {
                var usr_filter = [];
                GM_setValue("filters", usr_filter)
                $('input[name=filters]').each(function() {

                    if ($(this).val() != "") {
                        if ($(this).val().indexOf(',') > -1) {
                            usr_filter.push($(this).val().replace(/\s+/g, '').split(','))

                        } else {
                            usr_filter.push($(this).val())
                        }
                        usr_filter = usr_filter.filter(onlyUnique).filter(Boolean);
                    }
                })
                GM_setValue("filters", usr_filter)
                $("#gmPrefsContainer").remove();

            })
        });

    })

    if (GM_getValue("whiteMode") == "true") {
        $('input[id=white_mode]')[0].click()
    }
    $('input[id=white_mode]').change(function() {
            if (this.checked) {

                GM_setValue("whiteMode", "true")
            } else {

                GM_setValue("whiteMode", "false")
            }
        }

    )

}

function whiteModeBox() {
    $("td.sender").prepend('<div class="tooltip"><span style="display:inline-block; \
                        background-color: white; padding:0px;margin:0px;height:13px; \
                        width:13px; overflow:hidden"><input type="checkbox" name="whiteList" /></span> \
                        <span class="tooltiptext">화이트리스트에 등록. 체크 후 새로고침</span> &nbsp\
                        </div>')
}

function add_white_list() {
    if (whitelist == null) {
        whitelist = []
    }
    $('input[name=whiteList]').change(function() {
        if (this.checked) {
            $(this).each(function() {
                var regExp = /\(([^)]+)\)/;
                var matches = regExp.exec($(this).closest('td').find('a')[0].innerText);
                var id = matches[1]
                whitelist.push(id)
                whitelist = whitelist.filter(onlyUnique).filter(Boolean);
                GM_setValue("whiteList", whitelist)
            })
        } else {
            $(this).each(function() {
                var regExp = /\(([^)]+)\)/;
                var matches = regExp.exec($(this).closest('td').find('a')[0].innerText);
                var id = matches[1]
                whitelist = whitelist.filter(function(e) {
                    return e !== id
                })
                GM_setValue("whiteList", whitelist)
            })
        }
    })
}

function whiteDo(res, i, whitelist) {
    var send_id = res["NOTE_INFO"]["list"][i]["send_id"]
    if (!$("input[type=checkbox][name=no]")[i].checked) {
        if (!whitelist.includes(send_id)) {
            $("input[type=checkbox][name=no]")[i].click()
        } else {
            $("input[name=whiteList]")[i].click()

        }
    } else {
        if (whitelist.includes(send_id)) {
            $("input[name=whiteList]")[i].click()
        }
    }
}

function lists(i) {
    var fieldWrapper = $("<div class=\"fieldwrapper\" id=\"field" + (i + 1) + "\"/>");
    var fName = $("<input type=\"text\" name=\"filters\" value=\"" + usr_filter[i] + "\" class=\"required\" />");
    var removeButton = $("<input type=\"button\" class=\"remove\" value=\"삭제\" />");
    removeButton.click(function() {
        $(this).parent().remove();
    });
    fieldWrapper.append(fName);
    fieldWrapper.append(removeButton);
    $("#filters").append(fieldWrapper);
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}



function checked_notes() {
    $("input[type=checkbox][name=no]").change(function() {
        if (this.checked) {
            var tr = $(this).closest('td').closest('tr')
            $(tr).find('.memo_cnt').css({
                color: "#FFFFFF"
            })
            $(tr).find('td.sender a').css({
                color: "#FFFFFF"
            })
        } else {
            tr = $(this).closest('td').closest('tr')
            $(tr).find('.memo_cnt').css({
                color: ""
            })
            $(tr).find('td.sender a').css({
                color: ""
            })
            //setTimeout(chk(tr), 20);

        }
    });
}


function spray() {
    $.ajax({
        url: szAPI,
        data: dataList,
        type: 'GET',
        dataType: 'json',
        success: function(oData) {
            var res = '';
            res = oData;
            FilterDo(res)

        }

    })
}

function FilterDo(res) {
    var notes = res["NOTE_INFO"]["list"]
    var nlength = notes.length
    if (GM_getValue("filters") == null) {
        usr_filter = []
        GM_setValue("filters", usr_filter)
    }
    for (var i = 0; i < nlength; i++) {
        for (var j = 0; j < usr_filter.length; j++) {
            var words = usr_filter[j]
            var note = notes[i]["content"].replace(/[^A-Z가-힣]/ig, "");
            if (typeof(words) == "object") {
                if (words.every(function(itm) {
                        return note.indexOf(itm) != -1
                    })) {
                    $("input[type=checkbox][name=no]")[i].click()

                    var mem = $('.memo_cnt')
                    $(mem[i]).css({
                        color: "#FFFFFF"
                    })
                }
            } else {
                if (note.indexOf(words) != -1) {
                    $("input[type=checkbox][name=no]")[i].click()

                    mem = $('.memo_cnt')
                    $(mem[i]).css({
                        color: "#FFFFFF"
                    })
                }
            }
        }
        if (white_mode_val == "true") {
            whiteDo(res, i, whitelist);
        }
    }
}