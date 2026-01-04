// ==UserScript==
// @name         מעביר האשכולות
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  תוסף עזר להעברת אשכולות בקלות
// @author       You
// @match        https://www.fxp.co.il/postings.php*
// @match        https://www.fxp.co.il/inlinemod.php*
// @match        https://www.fxp.co.il/forumdisplay.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/428980/%D7%9E%D7%A2%D7%91%D7%99%D7%A8%20%D7%94%D7%90%D7%A9%D7%9B%D7%95%D7%9C%D7%95%D7%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/428980/%D7%9E%D7%A2%D7%91%D7%99%D7%A8%20%D7%94%D7%90%D7%A9%D7%9B%D7%95%D7%9C%D7%95%D7%AA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (
        typeof ISMOBILEFXP !== 'undefined'
        //|| forumname === categoryname
    ) {
        return;
    }

    let buttonColor = ''; // buttons color (optional) - color hex or name
    let ACcolor = ''; // autocomplete color (optional) - color hex or name


    if (location.pathname === "/forumdisplay.php") {
        $("#add_fav").parent().after(`<div style="float: right;margin-top: 4px;padding: 4px;width: 185px;font-family: almoni-dl,arial;">
<div id="add_fastmove" style="cursor: pointer;display: block;font-weight: bold;" class="popupctrl">
<div class="addfavicons"></div>
<div class="noselectfxp">הוסף להעברה מהירה
</div>
</div>
<div id="edit_fastmove" style="cursor: pointer;display: none;" class="popupctrl">
<div class="addfavicons addfaviconson"></div>
<div class="noselectfxp">ערוך העברה מהירה</div>
</div>
<div id="del_fastmove" style="cursor: pointer;display: none; margin-top: 10px;" class="popupctrl">
<div class="addfavicons addfaviconson"></div>
<div class="noselectfxp">הסר מהעברה מהירה
</div>
</div></div>`);

        function addFastmove() {
            let forumNick = prompt('הזן כינוי לפורום או השאר ריק בשביל השם המקורי');

            // בדוק אם המשתמש לחץ על 'ביטול' עבור forumNick
            if (forumNick === null) {
                return false; // אם נלחץ ביטול, צא מהפונקציה
            }

            let color = prompt('הזן קוד או שם של צבע או השאר ריק בשביל הצבע הרגיל');
            if (color === null) {
                return false; // אם נלחץ ביטול, צא מהפונקציה
            }

            if (!forumNick) { // אם השאיר ריק (לא null)
                forumNick = $('.ntitle').eq(0).text().trim();
            }

            if (GM_getValue('fastmove')?.length > 0) {
                let currentForums = GM_getValue('fastmove');
                let newForum = [{ name: forumNick, id: FORUM_ID_FXP, color }];
                let newData = currentForums;
                newForum.forEach(n => {
                    let itemIndex = currentForums.findIndex(o => o.id === n.id);
                    if (itemIndex > -1) {
                        currentForums[itemIndex] = n;
                    } else {
                        currentForums = newData.push(n);
                    }
                });
                GM_setValue('fastmove', newData);
            } else {
                GM_setValue('fastmove', [{ name: $('.ntitle').eq(0).text().trim(), id: FORUM_ID_FXP, color }]);
            }
            return true;
        }

        function editFastmove() {
            let forumNick = prompt('הזן כינוי לפורום או השאר ריק בשביל לא לשנות; כדי לאפס את שם הפורום, יש להזין \'איפוס\'');
            let color = prompt('הזן קוד או שם של צבע או השאר ריק בשביל לא לשנות; כדי לאפס את הצבע, יש להזין \'איפוס\'');

            let currentForums = GM_getValue('fastmove');
            if (!forumNick) forumNick = currentForums.find(o => o.id == FORUM_ID_FXP).name;
            if (!color) color = currentForums.find(o => o.id == FORUM_ID_FXP).color;

            if (forumNick == 'איפוס') forumNick = $('.ntitle').eq(0).text().trim();
            if (color == 'איפוס') color = '';

            forumNick = forumNick.replace(/"/g, '&quot;');

            let newForum = [{ name: forumNick, id: FORUM_ID_FXP, color }];
            let newData = currentForums;
            newForum.forEach(n => {
                let itemIndex = currentForums.findIndex(o => o.id === n.id);
                if (itemIndex > -1) {
                    currentForums[itemIndex] = n;
                } else {
                    currentForums = newData.push(n);
                }
            });
            GM_setValue('fastmove', newData);
        }

        async function deleteFasterMove() {
            let delConfirm = confirm('הסרת פורום מההעברה המהירה אינה ניתנת לשחזור. בטוח שאתה מעוניין?');
            if (delConfirm) {
                let currentForums = GM_getValue('fastmove');
                let delData = currentForums.filter(o => o.id !== FORUM_ID_FXP);
                GM_setValue('fastmove', delData);
                return true;
            } else return false;
        }

        $(document).ready(function () {
            let fastobj = GM_getValue('fastmove');
            if (fastobj?.filter(e => e.id === FORUM_ID_FXP).length > 0) {
                $("#add_fastmove").hide();

                $("#edit_fastmove").show();
                $("#del_fastmove").show();
            }

            $("#add_fastmove").click(function () {
                if (addFastmove()) {
                    $("#add_fastmove").hide();

                    $("#edit_fastmove").show();
                    $("#del_fastmove").show();
                };
            });

            $('#edit_fastmove').click(editFastmove);

            $("#del_fastmove").click(function () {
                if (deleteFasterMove()) {
                    $("#add_fastmove").show();

                    $("#edit_fastmove").hide();
                    $("#del_fastmove").hide();
                }
            });
        });

    } else {
        if (document.title.includes("העבר אשכול") || document.title.includes("העתק אשכול")) {
            $('head').append('<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/themes/base/jquery-ui.min.css">');
            $('head').append(`<link rel="stylesheet" type="text/css" href="https://scripts.remixn.xyz/movethread/my-style.css?v=34">`);
            //$('head').append('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.1/jquery-ui.min.js"></script>');

            let obj = GM_getValue('fastmove');

            if (buttonColor !== null) {
                let style = document.createElement("STYLE");
                style.innerText = `.actionbuttons .group .button:not([type="reset"]) {background: ${buttonColor} !important;}`;
                document.head.appendChild(style);
            }
            if (ACcolor !== null) {
                let style = document.createElement("STYLE");
                style.innerText = `.ui-autocomplete > li > a.ui-state-focus {background: ${ACcolor} !important;}`;
                document.head.appendChild(style);
            }

            let group = $('.group').eq(3);

            $('#destforumid').parent().eq(0).after(`<div class="blockrow ui-widget"><label for="destforumname">חיפוש פורום לפי שם:</label><input id="destforumname" name="destforumname" class="textbox primary ui-autocomplete-input"></div>`);
            //$('#destforumid').parent().eq(0).hide();

            $(function () {
                $('#destforumname').autocomplete({
                    source: function (request, response) {
                        $.ajax({
                            url: "https://www.fxp.co.il/ajax.php?do=forumdisplayqserach&name_startsWith=" + document.getElementById("destforumname").value,
                            crossDomain: true,
                            async: true,
                            success: function (res) {
                                let forums = JSON.parse(res);
                                let forumsSrc = [];
                                for (var i = 0; i < forums.length; i++) {
                                    forumsSrc.push({label: forums[i].title_clean, id: forums[i].forumid });
                                    console.log(forumsSrc);
                                }
                                response(forumsSrc, forums);
                            }
                        });
                    },
                    select: function (event, ui) {
                        console.log(ui);
                        $('#destforumid').val(ui.item.id);
                    },
                    autoFocus: true,
                });
            });

            group.find('input.submitButton').eq(0).click(function () {
                $.ajax({
                    url: "https://www.fxp.co.il/ajax.php?do=forumdisplayqserach&name_startsWith=" + document.getElementById("destforumname").value,
                    crossDomain: true,
                    async: true,
                    success: function (res) {
                        res = JSON.parse(res);
                        $('#destforumid').val(res[0].forumid);
                        group.find('input[type=submit]').eq(0).click();
                    }
                });
            });

            function splitArray(arr, n) {
                return new Array(Math.ceil(arr.length / n))
                    .fill()
                    .map(_ => arr.splice(0, n));
            };

            async function detectColor(forum) {
                if (forum.color !== null) {
                    return `background: ${forum.color} !important`;
                } else return '';
            }

            if (obj.length > 0) {
                group.append("<br>");

                splitArray(obj, 3).forEach(forums => {
                    forums.forEach(forum => {
                        detectColor(forum).then(c => {
                            group.append(`<input style="margin-top: 3px; ${c}" type="button" class="button" value="${forum.name}" id="${forum.id}" title="${forum.name}" name="${forum.name}" tabindex="1" onclick="buttonclick(this.id, this.name)"> `);
                            if (forums.indexOf(forum) == 2) group.append("<br>");
                        });
                    });
                });
            }
        }
    }
})();