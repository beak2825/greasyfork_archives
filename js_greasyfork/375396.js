// ==UserScript==
// @name         BuyTicketButton
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.vebongdaonline.vn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375396/BuyTicketButton.user.js
// @updateURL https://update.greasyfork.org/scripts/375396/BuyTicketButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".box_container").html('<form id="matchFormTop" action="/" method="post"><div class="col-md-8 img_nb"><table style="margin: 0 auto;"><tbody><tr class="row"><td class="col-md-5"><img id="symbol" src="/resources/images/co_vietnam.png" style="height: 70px;" alt="" kasperskylab_antibanner="on"></td><td class="col-md-5"><img id="symbol2" src="/resources/images/co_malaysia.jpg" style="height: 70px;" alt="" kasperskylab_antibanner="on"></td></tr></tbody></table><div class="txt_bot_stadium"><h3>VIỆT NAM - MALAYSIA</h3><p> 19h30 ngày 15/12/2018 - <a id="myBtn" style="text-decoration: underline;">SVĐ Quốc gia Mỹ Đình</a></p></div><!-- The Modal --><div id="myModal" class="modal"><!-- Modal content --><span class="close">×</span><div class="modal-content"><img src="/resources/images/map_mydinh.jpg" style="width: 100% !important; height: 100% !important;" kasperskylab_antibanner="on"></div></div><div style="padding-top:70px;"><!-- <a href="javascript:void(0)" id="video1" class = "btn_login submitChooseSeat">Video Hướng Dẫn Mua Vé</a> --><a href="/resources/guilde.pdf" target="_blank" class="btn_login submitChooseSeat">Hướng Dẫn Mua Vé</a></div><br></div><div class="col-md-4 txt_nb"><h2>ĐTQG Việt Nam - ĐTQG Malaysia</h2><p>Trận chung kết AFF SUZUKI CUP 2018 (Lượt về): ĐTQG Việt Nam - ĐTQG Malaysia</p><input type="hidden" name="matchId" value="28"><input type="hidden" name="stadiumId" value="1"><input type="image" src="/resources/images/btn_buyticket.png" onclick="submitChooseTicket(\'matchFormTop\', event)" class="btn_muave"><br><span style="color: yellow;"><b>THỜI GIAN MỞ BÁN VÉ: BTC sẽ tiến hành mở bán vé theo 04 đợt: 10h00 (2,500 vé), 16h00 (2,500 vé), 22h00 (2,800 vé) ngày 10/12/2018 và 10h00 (2,500 vé) ngày 11/12/2018.<br> Vé được mở bán từ 10h00 ngày 10/12/2018 đến 12h00 ngày 11/12/2018 hoặc cho đến khi hết vé (tuỳ điều kiện nào đến trước).</b></span></div></form>');
})();