// ==UserScript==
// @name         Neopets: Closet Emptier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script empties any removable closet items on the page! It's really ugly I apologize
// @author       Houndoom
// @match        https://www.neopets.com/closet.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/461863/Neopets%3A%20Closet%20Emptier.user.js
// @updateURL https://update.greasyfork.org/scripts/461863/Neopets%3A%20Closet%20Emptier.meta.js
// ==/UserScript==

window.onload = (
    function() {
        const element = document.getElementById("content").getElementsByClassName("content")[0];
        element.insertAdjacentHTML ("afterbegin",'<center><input id=\"closetClearer\" type=\"button\" value=\"Clear Closet Page\"/></center>');
        const closetClearer = document.getElementById("closetClearer");
        closetClearer.onclick = function () {
            $("form").each(function() {
                if($(this).attr('action') == "process_closet.phtml"){
                    let hasClothesToRemove = false;
                    $(this).find("tr").each(function() {
                        var closetRow = [];
                        var closetData = $(this).find('td');
                        if (closetData.length == 6 && closetData.find('input').length && closetData.find('input').attr('type') == "text") {
                            closetData.each(function() {
                                closetRow.push($(this).text());
                            });
                            closetData.find('input').val(closetRow[4]);
                            hasClothesToRemove = true;
                        }
                    });
                    if (hasClothesToRemove) {
                        $(this).submit();
                    }
                }
            });
        }
    });

