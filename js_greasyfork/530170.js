// ==UserScript==
// @name    Alarm_For_New_Ticket
// @version  1.0.5
// @description Alarm Played When New Ticket Will Be Arrive.
// @license MIT
// @grant    none
// @include     https://clients.netafraz.com/admin/supporttickets.php*
// @namespace https://netafraz.com
// @downloadURL https://update.greasyfork.org/scripts/530170/Alarm_For_New_Ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/530170/Alarm_For_New_Ticket.meta.js
// ==/UserScript==
// Programmed and developed by Farshad_Mehryar

var alarm = new Audio('https://assets.mixkit.co/active_storage/sfx/2364/2364.wav');
//var alarm = new Audio('https://www.setasringtones.com/storage/ringtones/9/f5080f48229eb2e243115bf2fb41cbba.mp3');

alarm.volume = 0.3;

(function () {
    'use strict';

    function runScript() {

        // Sort Table 1 : Check Flag
        setTimeout(() => {//1
            if (document.getElementById("sortabletbl1")) {//2
                var sTable1Bodies = document.getElementById("sortabletbl1").tBodies[0];
                if (sTable1Bodies.rows.length > 0) {//3
                    for (var i = 1; i < sTable1Bodies.rows.length; i++) {//4
                        var tr = sTable1Bodies.getElementsByTagName("tr")[i];
                        var td3 = tr.getElementsByTagName("td")[3];
                        var td5 = tr.getElementsByTagName("td")[5];
                        var td6 = tr.getElementsByTagName("td")[6];
                        if (td5.innerText != 'در حال رسیدگی' && td5.innerText != 'نگه داشته شده' && !td3.getElementsByTagName("button")[0]){
                            if (td5.innerText == 'در انتظار پاسخ' || td5.innerText == 'پاسخ مشتری') {//5
                                alarm.play();
                                break;
                            }// end if 5
                        }
                    }// end for 4
                }//end if 3
            }//end if 2
        }, 10000); //end setTimeout 1

        setTimeout(() => {//1
            if (document.getElementById("sortabletbl2")) {//2
                var sTable2Bodies = document.getElementById("sortabletbl2").tBodies[0];
                if (sTable2Bodies.rows.length > 0) {//3
                    for (var i = 1; i < sTable2Bodies.rows.length; i++) {//4
                        var tr = sTable2Bodies.getElementsByTagName("tr")[i];
                        var td2 = tr.getElementsByTagName("td")[2];
                        var td3 = tr.getElementsByTagName("td")[3];
                        var td4 = tr.getElementsByTagName("td")[4];
                        var td5 = tr.getElementsByTagName("td")[5];
                        var td6 = tr.getElementsByTagName("td")[6];
                        var dep_edari = "اداری";
                        var dep_mali = "امور مالی";
                        var dep_tamas = "تماس";
                        var dep_fata = "فتا";
                        var dep_taqhyirDore = "تغییر دوره";
                        var dep_tafkik = "تفکیک";
                        var dep_bazgardani = "باز گردانی";
                        var dep_sooEstefade = "سوء استفاده";
                        var dep_omoomi = "عمومی";
                        var staff_mehryar = "مهریار";
                        var staff_amiri = "امیری";
                        var staff_abdolrahim = "عبدالرحیم";
                        var staff_moohebat = "موهبت";
                        var staff_dehghani = "دهقانی";
                        var staff_shareghi = "شارقی";
                        var staff_maveddat = "مودت";
                        var staff_none = "none";
                        if (td2.innerText.includes(dep_omoomi) || td2.innerText.includes(dep_fata) || td2.innerText.includes(dep_tamas) ||
                            td2.innerText.includes(dep_mali) || td2.innerText.includes(dep_edari) ||
                            td2.innerText.includes(dep_taqhyirDore) || td2.innerText.includes(dep_tafkik) ||
                            td2.innerText.includes(dep_bazgardani) || td2.innerText.includes(dep_sooEstefade)){
                            if (!td2.innerText.includes(staff_abdolrahim)
                                && !td2.innerText.includes(staff_mehryar)
                                && !td2.innerText.includes(staff_dehghani)
                                && !td2.innerText.includes(staff_maveddat)
                                && !td2.innerText.includes(staff_amiri)
                                && !td2.innerText.includes(staff_shareghi)
                                && !td2.innerText.includes(staff_moohebat)){
                                if (td5.innerText != 'در حال رسیدگی' && td5.innerText != 'نگه داشته شده' && !td3.getElementsByTagName("button")[0]
                                    && td4.innerText != 'Refund Bot' && !td3.innerText.includes('4964516')){
                                    //if (td6.innerText == "0h 0m" || td6.innerText == "0h 5m")
                                    if (!td3.innerText.includes("عودت وجه جدید")) {//5
                                        alarm.play();
                                        break;
                                    }// end if 5
                                }
                            }
                        }
                    }// end for 4
                }//end if 3
            }//end if 2
        }, 15000); //end setTimeout 1
    }

    if (document.readyState === "complete") {
        runScript();
    } else {
        document.addEventListener("readystatechange", function () {
            if (document.readyState === "complete") {
                runScript();
            }
        });
    }
})();