// ==UserScript==
// @name        BlueCat Address Manager Show Dependent Records
// @namespace   *
// @description Show dependent record for IP - Host Records in BlueCat Address Manager
// @include     */app*
// @version     2
// @grant       none
// @author      Marius Galm
// @copyright   2018, Marius Galm
// @license		MIT
// @require     http://code.jquery.com/jquery-latest.min.js
// @icon        https://www.bluecatnetworks.com/wp-content/uploads/2018/03/cropped-bluecat-favicon-50x50.png
// @downloadURL https://update.greasyfork.org/scripts/375011/BlueCat%20Address%20Manager%20Show%20Dependent%20Records.user.js
// @updateURL https://update.greasyfork.org/scripts/375011/BlueCat%20Address%20Manager%20Show%20Dependent%20Records.meta.js
// ==/UserScript==

if (document.readyState === "interactive" ) {
    var page = document.childNodes[2].nodeValue;
    if (/ Page: IP4AddressPage /.test(page)) {
        var subtab = document.getElementsByClassName("TabPanelLabelActive")[0];
        if (/Details/.test(subtab.innerHTML.trim())) {
            var outertable = document.getElementById("outerTable");
            if (outertable != null) {
                if (outertable.getElementsByClassName("empty-table").length !== 1) {
					var added = false;
                    Array.prototype.slice.call(outertable.getElementsByTagName("a")).forEach( function(obj) {
                        if ((obj.offsetParent.className == "skinImage")&&(added==false)) {
                            if (obj.href.includes("HostRecord")) {
                                addButton();
                                added=true;
                            }
                        }
                    });
                }
            }
        }
    }
}

function addButton() {
    var dialogFeet = document.getElementsByClassName('dialog-ft');
    var foot = dialogFeet[1].getElementsByClassName('dialog-c')[0];
    var node = document.createElement("span");
    node.innerHTML='<input type="button" id="getButton" value="Get Dependent">';
    foot.appendChild(node);
    var lable = document.getElementById('getButton');
    lable.addEventListener("click",() => { getRecords(); },false);
    var node2 = document.createElement("span");
    node2.innerHTML='<input hidden type="button" id="hideButton" value="Hide Dependent" style="width: 85px">';
    foot.appendChild(node2);
    var lable2 = document.getElementById('hideButton');
    lable2.addEventListener("click",() => { hideRecords(); },false);
}

function hideRecords() {
    $('#hideButton').attr('value', 'Hiding...');
    $('.hideMe').remove();
    $('#hideButton').attr('hidden', 'true');
    $('#getButton').removeAttr('hidden');
    $('#hideButton').attr('value', 'Hide Dependent');
}

function getRecords() {
    var outertable = document.getElementById("outerTable");
    if ((outertable != null)||(outertable !== undefined)) {
        if (outertable.getElementsByClassName("empty-table").length !== 1) {
            Array.prototype.slice.call(outertable.getElementsByTagName("a")).forEach( function(obj) {
                if (obj.offsetParent.className == "skinImage") {
                    if (obj.href.includes("HostRecord")) {
                        $('#getButton').attr('value', 'Loading...');
                        $.get(obj.href, function(data, status){
                            var table = $.trim($(data).find("#outerTable").html());
                            var code = $.parseHTML(table);
                            var thisclass = "value-table list-row-even";
                            if ($("#"+obj.id).closest("table").closest("tr").hasClass("value-table list-row-odd")) {
                                thisclass = "value-table list-row-odd";
                            }
                            var row = $('<tr class="hideMe" style="border-bottom:1pt solid black;"><td class="'+thisclass+'" style="padding-left: 50px; vertical-align:top"> --> Dependent Records:<td class="content" id="tab_'+obj.id+'"></td></tr>');
                            $("#"+obj.id).closest("table").closest("tr").after(row);
                            $('#tab_'+obj.id).html(code);
                            $('#getButton').attr('hidden', 'true');
                            $('#getButton').attr('value', 'Get Dependent');
                            $('#hideButton').removeAttr('hidden');
                        });

                    }
                }
            });
        }
    }
}