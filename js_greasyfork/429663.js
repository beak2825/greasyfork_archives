// ==UserScript==
// @name         TTV test
// @namespace    http://tampermonkey.net/
// @version      4.6
// @description  Đăng truyện nhanh TTV
// @author       HA
// @match        https://tangthuvien.net/dang-chuong/story/*
// @grant        none
// @required https://code.jquery.com/jquery-3.2.1.min.js
// @copyright 2021, by HA
// @license AGPL-3.0-only
// @collaborator HA
// @downloadURL https://update.greasyfork.org/scripts/429663/TTV%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/429663/TTV%20test.meta.js
// ==/UserScript==

// Khai báo biến headerSign và footerSign với giá trị mặc định
var headerSign = "";
var footerSign = "";

var dăngnhanhTTV = dăngnhanhTTV ? dăngnhanhTTV : {};
dăngnhanhTTV = {
    YEAR_ALIVE: 2021,
    //số chương tối đa được đăng.
    MAX_CHAPTER_POST: 10,
    //đếm số chương dự định dăng
    CHAP_NUMBER: 1,
    //số thứ tự của chương trong danh sách
    CHAP_STT: 1,
    //số đánh của chương
    CHAP_SERIAL: 1,
    //đếm số chương dự định đăng gốc
    CHAP_NUMBER_ORIGINAL: 1,
    //số thứ tự của chương trong danh sách gốc
    CHAP_STT_ORIGINAL: 1,
    //số đánh của chương gốc
    CHAP_SERIAL_ORIGINAL: 1,

    /*
     * thực hiện tạo form add chapter
     */
    addNewChapter: function () {
        var me = this;
        if ((me.CHAP_NUMBER + 1) <= me.MAX_CHAPTER_POST) {
            me.updateChapNumber(true);
            var chap_vol = parseInt(jQuery('.chap_vol').val());
            var chap_vol_name = jQuery('.chap_vol_name').val();

            var html = '<div data-gen="MK_GEN" id="COUNT_CHAP_' + me.CHAP_NUMBER + '_MK">';
            html += '<div class="col-xs-12 form-group"></div><div class="form-group"><label class="col-sm-2" for="chap_stt">STT</label><div class="col-sm-8"><input  class="form-control"  required name="chap_stt[' + me.CHAP_NUMBER + ']" value="' + me.CHAP_STT + '" placeholder="Số thứ tự của chương" type="text"/></div></div><div class="form-group"><label class="col-sm-2" for="chap_number">Chương thứ..</label><div class="col-sm-8"><input  value="' + me.CHAP_SERIAL + '" required class="form-control" name="chap_number[' + me.CHAP_NUMBER + ']" placeholder="Chương thứ.. (1,2,3..)" type="text"/>                </div>                </div>' +
                '<div class="form-group"><label class="col-sm-2" for="chap_name">Quyển số</label><div class="col-sm-8"><input class="form-control" name="vol[' + me.CHAP_NUMBER + ']" placeholder="Quyển số" type="number" value="' + chap_vol + '" required/></div></div>' +
                '<div class="form-group"> <label class="col-sm-2" for="chap_name">Tên quyển</label><div class="col-sm-8"><input class="form-control chap_vol_name" name="vol_name[' + me.CHAP_NUMBER + ']" placeholder="Tên quyển" type="text" value="' + chap_vol_name + '" /> </div> </div>' +
                '<div class="form-group"><label class="col-sm-2" for="chap_name">Tên chương</label><div class="col-sm-8"><input required class="form-control" name="chap_name[' + me.CHAP_NUMBER + ']" placeholder="Tên chương" type="text"/> </div> </div> <div class="form-group"> <label class="col-sm-2" for="introduce">Nội dung</label> <div class="col-sm-8"> <textarea maxlength="75000"  style="color:#000;font-weight: 400;"  required class="form-control"  name="introduce[' + me.CHAP_NUMBER + ']" rows="20" placeholder="Nội dung" type="text"></textarea> </div> </div><div class="form-group">                <label class="col-sm-2" for="adv">Quảng cáo</label>            <div class="col-sm-8">                <textarea maxlength="1000" class="form-control"  name="adv[' + me.CHAP_NUMBER + ']" placeholder="Quảng cáo" type="text"></textarea>               </div></div>';
            html += "</div>";
            jQuery('#add-chap').before(html);
        }
        else {
            var chapterLeft = me.MAX_CHAPTER_POST - me.CHAP_NUMBER;
            chapterLeft = chapterLeft < 0 ? 0 : chapterLeft;
            alert('Bạn nên đăng tối đa ' + me.MAX_CHAPTER_POST + ' chương một lần, số chương đã tạo ' + me.CHAP_NUMBER + ' chương, bạn có thể đăng thêm ' + chapterLeft + ' chương nữa.');
        }
    },
    /*
     * @isSilent - tạo thầm lặng
     * thực hiện thêm số chương cần add theo số lượt.
     */
    createListAddChapter: function (isSilent) {
        var me = this;
        var chapterAdd = 0;
        chapterAdd = parseInt(jQuery("#qpNumberOfChapter").val());
        if ((me.CHAP_NUMBER + chapterAdd) <= me.MAX_CHAPTER_POST) {
            for (var i = 0; i < chapterAdd; i++) {
                me.addNewChapter();
            }
            if (!isSilent) {
                alert('Đã tạo thêm ' + chapterAdd + ' chương, hãy copy và dán nội dung cần đăng.');
            }
        }
        else {
            alert('Bạn nên đăng tối đa ' + me.MAX_CHAPTER_POST + ' chương một lần, số chương đã tạo ' + me.CHAP_NUMBER + ' chương, bạn có thể đăng thêm ' + (me.MAX_CHAPTER_POST - me.CHAP_NUMBER) + ' chương nữa.');
        }
    },
    /*
     * xóa chapter
     */
    removeLastedPost: function () {
        var me = this;
        jQuery("#COUNT_CHAP_" + me.CHAP_NUMBER + "_MK").remove();
        //xóa bỏ
        me.updateChapNumber();
    },
    /*
     * cập nhật số chương
     * @isAdd {bool} - thêm chương, hay xóa true - thêm chương
     */
    updateChapNumber: function (isAdd) {
        var me = this;
        try {
            if (isAdd) {
                var chap_stt = parseInt(jQuery('.chap_stt1').val());
                var chap_serial = parseInt(jQuery('.chap_serial').val());
                if (parseInt(jQuery('#chap_stt').val()) > chap_stt) {
                    chap_stt = parseInt(jQuery('#chap_stt').val());
                }
                if (parseInt(jQuery('#chap_serial').val()) > chap_serial) {
                    chap_serial = parseInt(jQuery('#chap_serial').val());
                }
                me.CHAP_STT = chap_stt;
                me.CHAP_SERIAL = chap_serial;

                me.CHAP_NUMBER++;
                me.CHAP_STT++;
                me.CHAP_SERIAL++;
            }
            else {
                if (me.CHAP_NUMBER > me.CHAP_NUMBER_ORIGINAL) {
                    me.CHAP_NUMBER--;
                }
                if (me.CHAP_STT > me.CHAP_STT_ORIGINAL) {
                    me.CHAP_STT--;
                }
                if (me.CHAP_SERIAL > me.CHAP_SERIAL_ORIGINAL) {
                    me.CHAP_SERIAL--;
                }
            }
            jQuery('#chap_number').val(me.CHAP_NUMBER);
            jQuery('#chap_stt').val(me.CHAP_STT);
            jQuery('#chap_serial').val(me.CHAP_SERIAL);
            jQuery('#countNumberPost').text(me.CHAP_NUMBER);
        }
        catch (e) {
            console.log("Lỗi: " + e);
        }
    },
    /*
     * cập nhật số thứ tự chương
     */
    /*
     * tạo element inject
     */
    createEl: function (n) {
        return document.createElement(n);
    },
    /*
     * thêm style
     */
    addStyle: function (style) {
        var me = this;
        var s = me.createEl("style"),
            h = document.getElementById('HA');
        s.type = "text/css";
        s.appendChild(document.createTextNode(style));
        h.appendChild(s);
    },
    /*
     * thêm css
     *
     */
    addCss: function () {
        var me = this;
        var s = '#HA{background-color: rgb(255, 255, 255)!important;padding: 3px 15px;color: black!important;border-radius: 5px 0px 0px 5px;margin-bottom: 15px;position: fixed;right: 10px;top: 10px;max-width: 400px;z-index: 9999;box-shadow: -2px 0 5px rgba(0,0,0,0.1);} #HA>.form-group>div{font-size: 13px;color: black !important;} #HA>p{font-size:13px;color: black!important;text-align: right;} #HA .HA-option{ padding:5px;border:1px dashed #4CAF50;border-radius:5px;margin-bottom:32px; } #HA .HA-option-label{ width: 100%; background-color: black; padding: 10px; border-radius: 5px 5px 0px 0px; margin: 0; } #qpn{max-height: 300px; overflow-y: auto; margin-top: 10px; font-size: 12px;} #qpn div {font-size: 12px; margin: 2px 0;}';
        me.addStyle(s);
    },
    /*
     * tạo thẻ HTML inject
     */
    createInjectHTML: function () {
        var me = this;
        var h = '<div id="HA"> <div class="form-group"> </div> <center> <h3>CÔNG CỤ ĐĂNG NHANH</h3> </center> <div class="form-group"> <textarea placeholder="Nội dung truyện" id="qpContent" class="form-control" rows="5"></textarea> <div class="form-group" id="qpAdv" class="form-control" rows="2"></div> <div class="form-group"> <button type="button" id="qpButtonSubmit" class="btn btn-default" style="margin-right: 10px;" onclick="javascript:;">Đăng chương</button> <button type="button" id="qpButtonSplit" class="btn btn-info" onclick="javascript:;">Tách chương</button> <span id="qpn" style="margin:0px 15px;font-weight:bold"></span> </div> </div> <center><label>TỔNG SỐ CHƯƠNG: <span id="countNumberPost" style="color:#ff0000; font-weight:bold">0</span> </label></center> <h4></h4> <label>Chuỗi chia tách chương</label> <div class="form-group"> <input type="text" id="qpSplitValue" class="form-control" value="/[c|C]hương\\s?\\d+\\s?:?\\s?/" > </div> <div class="form-group" id="qpSplitValueReplace"> </div>  <div class="form-group"> <input type="number" placeholder="Thêm" value="9" id="qpNumberOfChapter" class="form-control"> <div class="input-group"><div class="button-group"><center><input type="button" id="qpButtonRemoveEmpty" value="Xóa chương trống" class="btn btn-danger" /></center> </div> </div></div> <label style="color: #bef385;"><input type="checkbox" id="qpOptionLoop" class="form-control" style="height:10px;width: 10px;display: inline-block;">Tên chương lặp lại</label> <div class="form-group"> <b><center><input type="button" value="Lưu Thiết Lập" class="btn btn-success" id="qpSaveConfig"></center></b> </div></div>';

        jQuery(".list-in-user").before(h);
    },
    /*
     * thực hiện xử lý sao chép
     */
    performAction: function () {
        try {
            var me = this;
            var a = jQuery("#qpContent").val(),
                s = jQuery("#qpSplitValue").val(),
                st = jQuery('#qpSplitValueReplace').val().trim(),
                titles = jQuery("[name^=chap_name]"),
                contents = jQuery("[name^=introduce]"),
                advs = jQuery("[name^=adv]"),
                loop = jQuery("#qpOptionLoop")[0].checked,
                error = false,
                advContent = jQuery("#qpAdv").val();
            if (s.startsWith('/') && s.endsWith('/') && s.length > 0) {
                s = new RegExp(s.substring(1, s.length - 1));
            }
            a = a.split(s).filter(function (entry) {
                return entry.trim() !== "";
            });
            if (!loop && a.length < titles.length) {
                error = true;
            }
            if (loop && (a.length / 2) < titles.length) {
                error = true;
            }
            //error
            if (error) {
                // Điều chỉnh nội dung thông báo dựa trên số lượng chương
                var errorMessage = "Số chương copy chưa đủ, cần sao thêm " + (titles.length - 1 - (loop === true ? a.length / 2 : a.length)) + " chương nữa.";

                // Chỉ hiển thị nút xóa chương trống trong thông báo khi không đủ 10 chương
                if (titles.length < 10) {
                    errorMessage += " Hoặc bỏ các chương thừa <button class=\"btn btn-danger\" onclick=\"javascript:document.getElementById('qpButtonRemoveEmpty').click();\">Xóa chương trống</button> và Đăng chương.";
                } else {
                    errorMessage += " Hoặc bỏ các chương thừa và Đăng chương.";
                }

                jQuery("#qpn").html(errorMessage).removeClass("text-notify").addClass("text-danger");
                jQuery("#qpContent").val("");
                jQuery("#qpButtonSubmit").removeClass("btn-read").addClass("btn-disable");

                // Nút xóa chương trống mặc định luôn hiển thị
                jQuery("#qpButtonRemoveEmpty").show();
            }
            var splitTitle = st.toLowerCase();
            //not loop chapter title do
            if (!loop) {
                jQuery.each(titles, (function (k, v) {
                    if (k < a.length) {
                        var at = a[k].trim(),
                            content = at.split('\n'),
                            originalTitle = content.shift().trim(),
                            title = originalTitle.toLowerCase();
                        originalTitle = me.ucFirst(originalTitle);
                        if (title.startsWith(splitTitle)) {
                            titles[k].value = originalTitle;
                            contents[k].value = headerSign + "\r\n" + content.join('\n') + "\r\n" + footerSign;
                            advs[k].value = advContent;
                        }
                        else {
                            titles[k].value = st + " " + originalTitle;
                            contents[k].value = headerSign + "\r\n" + content.join('\n') + "\r\n" + footerSign;
                            advs[k].value = advContent;
                        }
                    }
                    else {
                        jQuery("#qpContent").val("Đã thực hiện được " + k + " /" + (titles.length) + " nhập ban đầu, có thể nhấn Xóa chương trống, sau đó nhấn Đăng chương");
                        return false;
                    }
                }));
            }
            //loop chapter title do
            else {
                var j = 0,
                    ha = a.length / 2;
                jQuery.each(titles, (function (k, v) {
                    if (k < ha) {
                        var at = a[++j].trim(),
                            content = at.split('\n'),
                            /*bỏ qua chương đầu tiên*/
                            originalTitle = content.shift().trim(),
                            title = '';
                        //originalTitle = content.shift().trim();
                        title = originalTitle.toLowerCase();
                        if (title === '') {
                            //lấy tiêu đề cho đến khi thấy text
                            while (title === '' && content.length > 0) {
                                originalTitle = content.shift().trim();
                                title = originalTitle.toLowerCase();
                            }
                        }
                        originalTitle = me.ucFirst(originalTitle);
                        if (title.startsWith(splitTitle)) {
                            titles[k].value = originalTitle;
                            contents[k].value = headerSign + "\r\n" + content.join('\n') + "\r\n" + footerSign;
                            advs[k].value = advContent;
                        }
                        else {
                            titles[k].value = st + " " + originalTitle;
                            contents[k].value = headerSign + "\r\n" + content.join('\n') + "\r\n" + footerSign;
                            advs[k].value = advContent;
                        }
                    }
                    else {
                        jQuery("#qpContent").val("Đã thực hiện được " + k + " /" + (titles.length) + " nhập ban đầu, có thể nhấn Vẫn Đăng để tiếp tục");
                        return false;
                    }
                    j++;
                }));
            }
            //after insert do
            if (!error) {
                //sự kiện nhấn đăng chương
                jQuery("#qpButtonSubmit").removeClass("btn-disable").addClass("btn-success");
                jQuery("#qpContent").val("Đã thực hiện xong, OK");
            }
        }
        catch (e) {
            console.log("Lỗi: " + e);
        }
    },
    /*
     * xóa bỏ các chương trống
     */
    removeEmptyList: function () {
        try {
            var me = this;
            var titles = jQuery("[name^=chap_name]"),
                count = 0;
            //xóa lỗi
            jQuery("#qpn").html('');
            if (titles && titles.length) {
                for (var i = 0; i < titles.length; i++) {
                    var t = titles[i];
                    if (t) {
                        if (!t.value) {
                            if (t.parentElement.parentElement.parentElement.tagName != 'FORM') {
                                t.parentElement.parentElement.parentElement.remove();
                            }
                            me.updateChapNumber();
                            count++;
                        }
                    }
                }
            }
            alert('Đã loại bỏ ' + count + ' chương trống. Đã có thể nhấn Đăng chương');
        }
        catch (e) {
            console.log("Lỗi: " + e);
        }
    },
    /*
     * thực hiện xử lý dán
     */
    registerEvents: function () {
        var me = this;
        // Chỉ xóa nội dung khi paste, không tự động tách chương
        jQuery("#qpContent").on("paste", function (e) {
            jQuery(this).val("");
            // Không tự động tách chương nữa
        });

        // Đã xóa sự kiện thêm chapter

        // Thêm sự kiện cho nút tách chương
        jQuery("#qpButtonSplit").on('click', function(e) {
            e.preventDefault();
            me.splitChapters();
        });
        //xóa chapter
        jQuery("#qpButtonRemoveLast").on('click', function (e) {
            e.preventDefault();
            dăngnhanhTTV.removeLastedPost();
        });
        //gen danh sách chapter
        jQuery("#qpButtonGenChapter").on('click', function (e) {
            e.preventDefault();
            dăngnhanhTTV.createListAddChapter();
        });
        //xóa danh sách đã gen
        jQuery("#qpButtonResetChapter").on('click', function (e) {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn xóa toàn bộ danh sách đã tạo, chú ý sẽ xóa toàn bộ nội dung đã dán trước đó')) {
                var count = jQuery('[data-gen="MK_GEN"]').length;
                jQuery('[data-gen="MK_GEN"]').remove();
                for (var i = 0; i < count; i++) {
                    me.updateChapNumber();
                }
            }
        });
        /*
         * lưu cookies
         */
        jQuery("#qpSaveConfig").on("click", function (e) {
            e.preventDefault();
            me.saveCookies();
        });
        jQuery('#qpButtonRemoveEmpty').on('click', function (e) {
            e.preventDefault();
            me.removeEmptyList();
        });
        jQuery('#qpButtonTitleReplace').on('click', function (e) {
            e.preventDefault();
            me.replaceTitle();
        });
        //nhấn đăng chương
        jQuery("#qpButtonSubmit").on('click', function (e) {
            e.preventDefault();
            jQuery('form button[type=submit]')[0].click();
        });
        //đọc từ cookies
        me.readCookies();
    },
    /*
     * save Cookies
     */
    saveCookies: function () {
        try {
            var value = "splitTitle=" + jQuery("#qpSplitValue").val() +
                "&optionLoop=" + jQuery("#qpOptionLoop")[0].checked +
                '&numberChapter=' + jQuery('#qpNumberOfChapter').val() +
                '&splitValueReplace=' + jQuery('#qpSplitValueReplace').val() +
                '&textTitleFind=' + jQuery('#qpTextTitleFind').val() +
                '&textTitleReplace=' + jQuery('#qpTextTitleReplace').val();

            var cookieStr = "HAconfig=" + escape(value) + "; ";
            var today = new Date();
            var expr = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            cookieStr += "expires=" + expr.toGMTString() + "; ";
            cookieStr += "path=/; ";
            cookieStr += "domain=tangthuvien.net; ";

            document.cookie = cookieStr;

            alert("Đã lưu lại thiết lập");
        }
        catch (e) {
            console.log("Lỗi: " + e);
        }
    },
    /*
     * thực hiện đọc cookies
     */
    readCookies: function () {
        try {
            var name = "",
                pCOOKIES = [];
            pCOOKIES = document.cookie.split('; ');
            for (var bb = 0; bb < pCOOKIES.length; bb++) {
                var nameArr = [];
                nameArr = pCOOKIES[bb].split('=');
                if (nameArr[0] === "HAconfig") {
                    name = unescape(nameArr[1]);
                    break;
                }
            }
            var arr = name.split("&");
            if (arr.length > 7) {
                jQuery("#qpSplitValue").val(arr[0].split("=")[1]);
                jQuery("#qpOptionLoop")[0].checked = (arr[1].split("=")[1] == "true" ? true : false);
                jQuery("#qpNumberOfChapter").val(arr[4].split("=")[1]);
                jQuery("#qpSplitValueReplace").val(arr[5].split("=")[1]);
                jQuery("#qpTextTitleFind").val(arr[6].split("=")[1]);
                jQuery("#qpTextTitleReplace").val(arr[7].split("=")[1]);
            }
        }
        catch (e) {
            console.log("Lỗi: " + e);
        }
    },
    /*
     * lấy chuỗi copy right
     */
    setCopyRight: function () {
        try {
            var me = this;
            var str = "© " + me.YEAR_ALIVE;
            var d = new Date(),
                y = d.getFullYear();
            if (y > me.YEAR_ALIVE) {
                str += " - " + y;
            }
            jQuery('#mkcopyright').text(str);
        }
        catch (e) {
            console.log("Lỗi: " + e);
        }
    },
    /*
     * thay thế ký tự trong tiêu đề
     */
    replaceTitle: function () {
        var me = this,
            titles = jQuery("[name^=chap_name]"),
            replaceVal = jQuery("#qpTextTitleReplace").val(),
            findVal = jQuery("#qpTextTitleFind").val();
        if (findVal.startsWith('/') && findVal.endsWith('/') && findVal.length > 2) {
            var re = findVal.substring(1, findVal.length - 1);
            findVal = new RegExp(re);
        }
        if (titles && titles.length > 0) {
            for (var i = 0; i < titles.length; i++) {
                var t = titles[i];
                if (t && t.value) {
                    t.value = t.value.replace(findVal, replaceVal);
                }
            }
            alert('Đã thay thế xong.');
        }
    },
    /*
     * uppercase đầu tiền của chuỗi
     */
    ucFirst:function(str){
        if(str && typeof str==='string' && str.length > 0){
            let fst = str[0].toUpperCase();
            str = str.length === 1? fst: fst + str.substring(1);
        }
        return str;
    },
    /*
     * init QuickPost
     */
    init: function () {
        try {
            var me = this;
            var chap_number = parseInt(jQuery('#chap_number').val());
            var chap_stt = parseInt(jQuery('.chap_stt1').val());
            var chap_serial = parseInt(jQuery('.chap_serial').val());
            if (parseInt(jQuery('#chap_stt').val()) > chap_stt) {
                chap_stt = parseInt(jQuery('#chap_stt').val());
            }
            if (parseInt(jQuery('#chap_serial').val()) > chap_serial) {
                chap_serial = parseInt(jQuery('#chap_serial').val());
            }
            //khởi tạo hằng số
            me.CHAP_NUMBER = me.CHAP_NUMBER_ORIGINAL = chap_number;
            me.CHAP_STT = me.CHAP_STT_ORIGINAL = chap_stt;
            me.CHAP_SERIAL = me.CHAP_STT_ORIGINAL = chap_serial;

            me.createInjectHTML();
            me.addCss();
            me.registerEvents();
            me.setCopyRight();
            me.createListAddChapter(true);
            jQuery('#qpNumberOfChapter').attr('max', me.MAX_CHAPTER_POST);
            jQuery("#qpContent").focus();
        }
        catch (e) {
            console.log("Lỗi: " + e);
        }
    },
    // Hàm để sao chép văn bản vào clipboard
    copyToClipboard: function(text) {
        // Tạo một element textarea tạm thời
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);

        // Chọn và sao chép nội dung
        textarea.select();
        document.execCommand('copy');

        // Xóa textarea
        document.body.removeChild(textarea);
    },

    splitChapters: function() {
        var me = this;
        try {
            var content = jQuery("#qpContent").val(),
                regex = jQuery("#qpSplitValue").val(),
                st = jQuery('#qpSplitValueReplace').val().trim(),
                advContent = jQuery("#qpAdv").val(),
                loop = jQuery("#qpOptionLoop")[0].checked; // Lấy trạng thái checkbox "Tên chương lặp lại"

            if (regex.startsWith('/') && regex.endsWith('/') && regex.length > 0) {
                regex = new RegExp(regex.substring(1, regex.length - 1));
            }

            var chapters = content.split(regex).filter(function(entry) {
                return entry.trim() !== '';
            });

            // Kiểm tra xem có chương nào có nội dung lớn hơn 20.000 ký tự không
            var largeChapters = [];
            for (var i = 0; i < chapters.length; i++) {
                if (chapters[i].length > 20000) {
                    largeChapters.push(i);
                }
            }

            // Nếu có chương lớn, chia đều chúng
            if (largeChapters.length > 0) {
                for (var i = 0; i < largeChapters.length; i++) {
                    var index = largeChapters[i];
                    var largeChapter = chapters[index];
                    var lines = largeChapter.split('\n');
                    var chapterTitle = lines.shift().trim(); // Lấy tiêu đề

                    var contentToSplit = lines.join('\n');
                    var contentLength = contentToSplit.length;

                    // Tính toán số chương cần chia
                    var numSubChapters = Math.ceil(contentLength / 15000); // Chia khoảng 15k mỗi chương
                    var chunkSize = Math.floor(contentLength / numSubChapters);

                    // Tạo các chương con
                    var subChapters = [];
                    var startPos = 0;

                    for (var j = 0; j < numSubChapters; j++) {
                        var endPos = (j === numSubChapters - 1) ? contentLength : startPos + chunkSize;

                        // Tìm điểm kết thúc câu gần nhất để chia
                        if (j < numSubChapters - 1) {
                            var lookAhead = Math.min(200, contentLength - endPos);
                            var segment = contentToSplit.substring(endPos, endPos + lookAhead);
                            var sentenceEnd = segment.indexOf('. ');

                            if (sentenceEnd !== -1) {
                                endPos += sentenceEnd + 1; // +1 để bao gồm dấu chấm
                            }
                        }

                        var subContent = contentToSplit.substring(startPos, endPos);
                        var subTitle = chapterTitle + " (Phần " + (j + 1) + "/" + numSubChapters + ")";
                        subChapters.push(subTitle + "\n" + subContent);

                        startPos = endPos;
                    }

                    // Thay thế chương lớn bằng các chương con
                    chapters.splice(index, 1, ...subChapters);

                    // Cập nhật lại các index trong largeChapters vì mảng chapters đã thay đổi
                    for (var k = i + 1; k < largeChapters.length; k++) {
                        largeChapters[k] += numSubChapters - 1;
                    }
                }
            }

            var numberOfNewChapters = chapters.length;
            if (numberOfNewChapters > 0) {
                // Lấy tất cả form hiện tại
                var titles = jQuery("[name^=chap_name]"),
                    contents = jQuery("[name^=introduce]"),
                    advs = jQuery("[name^=adv]"),
                    chapNumbers = jQuery("[name^=chap_number]");

                // Chỉ điền nội dung vào các form hiện có
                var formsToFill = Math.min(numberOfNewChapters, titles.length);

                // Xử lý khi không có chương lặp lại
                if (!loop) {
                    for (var i = 0; i < formsToFill; i++) {
                        var chapterContent = chapters[i].trim();

                        if (chapterContent) {
                            var lines = chapterContent.split('\n');
                            var originalTitle = lines.shift().trim();
                            var title = originalTitle.toLowerCase();

                            originalTitle = me.ucFirst(originalTitle);

                            if (title.startsWith(st.toLowerCase())) {
                                titles[i].value = originalTitle;
                            } else {
                                titles[i].value = st + " " + originalTitle;
                            }
                        }

                        // Đếm số ký tự trước khi thêm header và footer
                        var charCount = lines.join('\n').length;

                        // Thêm nội dung chương không có thông báo số ký tự trong nội dung
                        contents[i].value = headerSign + "\r\n" + lines.join('\n') + "\r\n" + footerSign;

                        // Thêm thông báo số ký tự bên dưới form introduce
                        var introduceTextarea = contents[i];
                        var countDisplay = document.createElement('div');
                        countDisplay.className = 'char-count-info';
                        countDisplay.style.color = 'blue';
                        countDisplay.style.fontWeight = 'bold';
                        countDisplay.style.marginTop = '5px';
                        countDisplay.innerHTML = 'Chương này có: ' + charCount + ' ký tự';

                        // Nếu đã có thông báo trước đó, xóa nó đi
                        var existingCount = introduceTextarea.parentNode.querySelector('.char-count-info');
                        if (existingCount) {
                            existingCount.remove();
                        }

                        // Thêm thông báo mới
                        introduceTextarea.parentNode.appendChild(countDisplay);

                        advs[i].value = advContent;
                    }
                }
                // Xử lý khi có chương lặp lại
                else {
                    var j = 0;
                    var totalChapters = Math.floor(chapters.length / 2);
                    var formsToFill = Math.min(totalChapters, titles.length);

                    for (var i = 0; i < formsToFill; i++) {
                        // Lặp qua từng cặp chương (tiêu đề + nội dung)
                        if (j + 1 < chapters.length) {
                            // Lấy chương thứ nhất cho tiêu đề
                            var titleContent = chapters[j].trim();
                            var titleLines = titleContent.split('\n');
                            var originalTitle = titleLines.shift().trim();
                            originalTitle = me.ucFirst(originalTitle);

                            // Lấy chương thứ hai cho nội dung
                            var contentChapter = chapters[j + 1].trim();
                            var contentLines = contentChapter.split('\n');
                            // Bỏ qua tiêu đề của phần nội dung
                            contentLines.shift();

                            // Đặt tiêu đề
                            var title = originalTitle.toLowerCase();
                            if (title.startsWith(st.toLowerCase())) {
                                titles[i].value = originalTitle;
                            } else {
                                titles[i].value = st + " " + originalTitle;
                            }

                            // Đặt nội dung
                            contents[i].value = headerSign + "\r\n" + contentLines.join('\n') + "\r\n" + footerSign;
                            advs[i].value = advContent;

                            j += 2; // Chuyển đến cặp tiếp theo
                        }
                    }
                }

                // Đếm số ký tự trong mỗi chương
                var charCounts = [];
                var totalChars = 0;

                for (var i = 0; i < formsToFill; i++) {
                    if (contents[i] && contents[i].value) {
                        // Đếm số ký tự (không bao gồm header, footer và dòng thông báo số ký tự)
                        var contentWithoutMetadata = contents[i].value.replace(headerSign, '').replace(footerSign, '').replace(/\n--------------\nChương này có: \d+ ký tự\.\r\n/, '');
                        var chars = contentWithoutMetadata.length;
                        charCounts.push(chars);
                        totalChars += chars;
                    }
                }

                // Thông báo kết quả
                if (numberOfNewChapters > titles.length) {
                    jQuery("#qpn").html("Đã tách được " + numberOfNewChapters + " chương, nhưng chỉ có " + titles.length + " form. Vui lòng thêm chương thủ công hoặc <button class=\"btn btn-danger\" onclick=\"javascript:document.getElementById('qpButtonRemoveEmpty').click();\">Xóa chương trống</button> nếu cần.").removeClass("text-notify").addClass("text-warning");
                    // Luôn giữ nút xóa chương trống hiển thị
                    // Không ẩn nút xóa chương trống nữa
                } else if (numberOfNewChapters < titles.length) {
                    jQuery("#qpn").html("Đã tách thành " + numberOfNewChapters + " chương nhưng có " + titles.length + " form. Bạn có thể <button class=\"btn btn-danger\" onclick=\"javascript:document.getElementById('qpButtonRemoveEmpty').click();\">Xóa chương trống</button> nếu cần.").removeClass("text-notify").addClass("text-warning");
                    // Luôn giữ nút xóa chương trống hiển thị
                    // Không cần thay đổi nút xóa chương trống trong thông báo
                } else {
                    var charCountText = "Đã tách thành " + numberOfNewChapters + " chương và điền vào các form hiện có.";
                    jQuery("#qpn").html(charCountText).removeClass("text-danger").addClass("text-notify");
                    // Luôn giữ nút xóa chương trống hiển thị
                    // Không ẩn nút xóa chương trống nữa
                }

                // Kiểm tra xem có chia chương lớn không
                var hasLargeChapters = largeChapters.length > 0;
                var summaryText = "Đã tách thành " + numberOfNewChapters + " chương và điền vào " + formsToFill + " form.";

                // Hiển thị nút "Xóa chương trống" khi số chương điền vào form < 10
                if (formsToFill < 10) {
                    jQuery("#qpButtonRemoveEmpty").show();
                } else {
                    jQuery("#qpButtonRemoveEmpty").hide();
                }

                if (hasLargeChapters) {
                    summaryText += " (Đã chia nhỏ " + largeChapters.length + " chương lớn hơn 20.000 ký tự)";
                    jQuery("#qpn").html("Đã tách thành " + numberOfNewChapters + " chương. Có " + largeChapters.length + " chương lớn đã được chia nhỏ tự động.").removeClass("text-danger").addClass("text-notify");
                }

                // Sao chép những chương chưa được điền vào form
                if (numberOfNewChapters > formsToFill) {
                    var unusedChapters = chapters.slice(loop ? formsToFill * 2 : formsToFill);
                    if (unusedChapters.length > 0) {
                        var clipboardText = "";

                        // Giữ nguyên tiêu đề chương từ nội dung gốc
                        if (loop) {
                            // Xử lý theo cặp tiêu đề-nội dung
                            for (var i = 0; i < unusedChapters.length; i += 2) {
                                if (i + 1 < unusedChapters.length) {
                                    // Lấy nội dung và tiêu đề nguyên bản
                                    var titleContent = unusedChapters[i].trim();
                                    var contentContent = unusedChapters[i+1].trim();

                                    // Thêm vào clipboard
                                    clipboardText += "Chương " + (formsToFill + Math.ceil(i/2) + 1) + ": " + titleContent + "\n\n";
                                    clipboardText += contentContent + "\n\n";
                                } else {
                                    // Chỉ còn tiêu đề
                                    clipboardText += "Chương " + (formsToFill + Math.ceil(i/2) + 1) + ": " + unusedChapters[i].trim() + "\n\n";
                                }
                            }
                        } else {
                            // Xử lý từng chương riêng lẻ
                            for (var i = 0; i < unusedChapters.length; i++) {
                                // Thêm "Chương chap_number:" vào trước nội dung trong clipboard
                                clipboardText += "Chương " + (formsToFill + i + 1) + ": " + unusedChapters[i].trim() + "\n\n";
                            }
                        }

                        me.copyToClipboard(clipboardText);

                        summaryText += " Đã sao chép " + unusedChapters.length + " chương còn lại vào clipboard.";
                        jQuery("#qpn").html(jQuery("#qpn").html() + "<br>Đã sao chép " + unusedChapters.length + " chương còn lại vào clipboard.").addClass("text-success");
                    }
                }

                jQuery("#qpContent").val(summaryText);
                jQuery("#qpButtonSubmit").removeClass("btn-disable").addClass("btn-success");

                // Thêm thông báo về clipboard
                jQuery("<div>", {
                    id: "clipboard-notification",
                    style: "position: fixed; top: 20px; right: 20px; background-color: #4CAF50; color: white; padding: 10px; border-radius: 5px; z-index: 10000; display: none;"
                }).text("Đã sao chép chương còn lại vào clipboard!").appendTo("body");

                // Hiển thị và ẩn thông báo
                if (numberOfNewChapters > formsToFill) {
                    jQuery("#clipboard-notification").fadeIn(500).delay(3000).fadeOut(500);
                }
            }
        } catch(e) {
            console.log("Lỗi khi tách chương: " + e);
        }
    }
};

dăngnhanhTTV.init();