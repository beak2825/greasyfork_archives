// ==UserScript==
// @name         اعفاء من العمل التطبيقي رقمنة
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  يقوم باعفاء من الاعمال التطبيقية! بشكل جماعي بحيث يكتب معفى في العمود رقم 7 لجدول معلومات القسم
// @author       حاجي
// @match        https://amatti.education.gov.dz/scolarite/bulletin/abs_disp
// @downloadURL https://update.greasyfork.org/scripts/369398/%D8%A7%D8%B9%D9%81%D8%A7%D8%A1%20%D9%85%D9%86%20%D8%A7%D9%84%D8%B9%D9%85%D9%84%20%D8%A7%D9%84%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%D9%8A%20%D8%B1%D9%82%D9%85%D9%86%D8%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/369398/%D8%A7%D8%B9%D9%81%D8%A7%D8%A1%20%D9%85%D9%86%20%D8%A7%D9%84%D8%B9%D9%85%D9%84%20%D8%A7%D9%84%D8%AA%D8%B7%D8%A8%D9%8A%D9%82%D9%8A%20%D8%B1%D9%82%D9%85%D9%86%D8%A9.meta.js
// ==/UserScript==


var zNode       = document.createElement ('div');
zNode.innerHTML = '<label>&nbsp;</label><button id="myButton" type="button" class="ui fluid button green inverted biarabi">'
                + 'اعفاء من الاعمال التطبيقية</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
//document.body.appendChild (zNode);

    var targetElement = document.querySelectorAll("[class='four fields']");
            targetElement[0].appendChild(zNode);


//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {

m7();
}




            function m7() {
                var division = $('#division').val();
                var matiere = $('#matiere').val();
                var annee = $('#annee_school').val();
                if ((division === '') || (division === null))
                {
                    alertify.error('الرجاء اختيار الفوج التربوي ');
                    return;
                }

                            $("#tableDiv").empty();

                            $.ajax({
                                url: "https://amatti.education.gov.dz/scolarite/bulletin/abs_disp/eleves_div",
                                data: {annee: annee, division: division, matiere: matiere, 'isAjax': true},
                                type: "POST",
                                "dataType": "json",
                                success: function (data) {
                                    if (data.reponse === 0)
                                    {
                                        alertify.error('لقد تم تأكيد النقاط لا يمكن الاستمرار في العملية ');
                                        $('.ui.dimmer').removeClass('active');
                                        return;

                                    }
                                    var tableHeaders = '';
                                    var tbody = '';
                                    var i = 0;
                                    tableHeaders += '<tr class="noExl" hidden="true">';
                                    $.each(data.columns, function (v, val) {
                                        tableHeaders += "<td>" + v + "</td>";
                                        i = i + 1;
                                    });
                                    tableHeaders += '</tr>';
                                    var i = 0;
                                    tableHeaders += '<thead><tr id="affiche">';
                                    $.each(data.columns, function (v, val) {
                                        tableHeaders += " <td>" + val + "</td>";
                                        i = i + 1;
                                    });
                                    tableHeaders += '</tr></thead>';
                                    $.each(data.data, function (x, val) {

                                        var j = 2;
                                        tbody += "<tr>";
                                        $.each(val, function (z, toz) {
                                            if (j == 2) {
                                                id = toz;

                                            }
                                            if (j <= 5)
                                            {
                                                tbody += "<td>" + toz + "</td>";
                                                j = j + 1;
                                            }
                                            else
                                            {
                                                if (j==7) {tbody += "<td id='" + id + j + "td' ondblclick='edit_combo(this.id)' > معفى</td>";
                                                j = j + 1;} else
                                                tbody += "<td id='" + id + j + "td' ondblclick='edit_combo(this.id)' ></td>";
                                                j = j + 1;

                                            }
                                        });
                                        tbody += "</tr>";
                                    });
                                    $("#tableDiv").empty();
                                    $("#tableDiv").append('<table id="displayTable" class="ui celled selectable striped table biarabi">' + tableHeaders + tbody + '</table>');
                                    //$("#tableDiv").find("table thead tr").append(tableHeaders);
                                    $('.ui.dimmer').removeClass('active');
                                    $('#valider').show();
                                }


                            });

                        ;
            }
