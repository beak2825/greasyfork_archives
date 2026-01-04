// ==UserScript==
// @name         truyen.tangthuvien.vn QuickPost
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Thực hiện đăng truyện nhanh trên trang https://truyen.tangthuvien.vn/dang-chuong/story
// @author       Mkbyme
// @match        https://truyen.tangthuvien.vn/dang-chuong/story/*
// @grant        none
// @required https://code.jquery.com/jquery-3.2.1.min.js
// @copyright 2018, mkbyme (Nguyen Xuan Cuong)
// @license AGPL-3.0-only
// @collaborator mkbyme
// @downloadURL https://update.greasyfork.org/scripts/39213/truyentangthuvienvn%20QuickPost.user.js
// @updateURL https://update.greasyfork.org/scripts/39213/truyentangthuvienvn%20QuickPost.meta.js
// ==/UserScript==

var TangThuVienQuickPost = TangThuVienQuickPost ? TangThuVienQuickPost : {};
TangThuVienQuickPost = {
    //năm phát hành
    YEAR_ALIVE: 2018,
    //số chương tối đa được phép đăng trong 1 lần.
    MAX_CHAPTER_POST: 50,
    //đếm số chương dự định post
    CHAP_NUMBER: 1,
    //số thứ tự của chương trong danh sách
    CHAP_STT: 1,
    //số đánh của chương
    CHAP_SERIAL: 1,
    //đếm số chương dự định post gốc
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
                '<div class="form-group"><label class="col-sm-2" for="chap_name">Tên chương</label><div class="col-sm-8"><input required class="form-control" name="chap_name[' + me.CHAP_NUMBER + ']" placeholder="Tên chương" type="text"/> </div> </div> <div class="form-group"> <label class="col-sm-2" for="introduce">Nội dung</label> <div class="col-sm-8"> <textarea maxlength="75000"  style="color:#000;font-weight: 400;"  required class="form-control"  name="introduce[' + me.CHAP_NUMBER + ']" rows="10" placeholder="Nội dung" type="text"></textarea> </div> </div><div class="form-group">                <label class="col-sm-2" for="adv">Quảng cáo</label>            <div class="col-sm-8">                <textarea maxlength="1000" class="form-control"  name="adv[' + me.CHAP_NUMBER + ']" rows="2" placeholder="Quảng cáo" type="text"></textarea>                </div></div>';
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
            h = document.getElementById('qpmk');
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
        var s = '#qpmk{background-color: #2d2d2d!important;;padding: 3px 15px;color: #ebebeb!important;;border-radius: 5px 5px 0px 0px;margin-bottom: 15px;} #qpmk>.form-group>div{font-size: 13px;color: #bef385 !important;} #qpmk>p{font-size:13px;color: #c7c7c7!important;;text-align: right;} #qpmk .qpmk-option{ padding:5px;border:1px dashed #4CAF50;border-radius:5px;margin-bottom:32px; } #qpmk .qpmk-option-label{ width: 100%; background-color: #4CAF50; padding: 10px; border-radius: 5px 5px 0px 0px; margin: 0; }';
        me.addStyle(s);
    },
    /*
   * tạo thẻ HTML inject
   */
    createInjectHTML: function () {
        var me = this;
        var h = '<div id="qpmk"> <h3>Đăng Truyện Nhanh Script</h3> <div class="form-group"> <div> Ví dụ tên Chương 1, Chương 2, Chương n thì điền "Chương \d" để thực hiện dán tự động(Hỗ trợ dùng regex để tìm và tách truy cập <a href="https://regex101.com">https://regex101.com</a> để test)<br> <ol> <li>Nhập số chương cần đăng(ví dụ 10)</li> <li>Mở tệp chứa nội dung đã convert chọn và copy đoạn chứa chương cần đăng (đoạn chứa 10 chương)</li> <li>Dán vào DÁN VÀO ĐÂY</li> <li>Nhấn <b>Đăng Chương</b></li> </ol> <span style="color:red">* </span>Trước khi nhấn nút <b class="text-info">Đăng Chương</b> thì phải thực hiện sao chép nội dung truyện trước. </div> </div> <label>Dán Vào Đây(CTRL + V)</label> <div class="form-group"> <textarea placeholder="Dán nội dung vào đây - CTRL + V" id="qpContent" class="form-control" rows="5"></textarea> <textarea placeholder="Nội dung quảng cáo của truyen.tangthuvien.vn" id="qpAdv" class="form-control" rows="2"></textarea> <div class="form-group"> <button type="button" id="qpButtonSubmit" class="btn btn-primary" onclick="javascript:;">Đăng chương</button> <span id="qpn" style="margin:0px 15px;font-weight:bold"></span> </div> </div> <label>TỔNG SỐ CHƯƠNG CẦN ĐĂNG <span id="countNumberPost" style="color:#b6ff00; font-weight:bold">0</span> CHƯƠNG</label> <h4 class="qpmk-option-label">Thiết lập</h4> <div class="qpmk-option"> <label>Tiêu Đề Chương(để chia tách các chương truyện)</label> <div class="form-group"> <label style="color: white;">Chuỗi hoặc regex để tách chương</label> <input type="text" id="qpSplitValue" class="form-control" value="/[c|C]hương\\s?\\d+\\s?:?\\s?/" placeholder="Regex tìm kiếm đặt trong /chuỗi_regex/ hoặc chuỗi ký tự để tách chương/chapter"> </div> <div class="form-group"> <label style="color: white;">Thay thế với</label> <input type="text" id="qpSplitValueReplace" class="form-control" value="" placeholder="Chuỗi dùng để thay thế cho từ chương/chapter khi sử dụng regex để phân tách" title="Do sử dụng regex thì khi nối vào vẫn sẽ hiện giá trị regex nên cần trường thay thế"> </div> <label style="color: white;">Nhập số chương cần đăng</label> <div class="form-group"> <input type="number" placeholder="Nhập số chương cần đăng" value="2" id="qpNumberOfChapter" class="form-control" max="50" min="0"> <div class="input-group"> <div class="button-group"> <input type="button" id="qpButtonGenChapter" value="Tạo danh sách chương" title="Tạo ra thêm số nhập nội dung đăng bằng SỐ CHƯƠNG CẦN ĐĂNG" class="btn btn-primary" /> <input type="button" id="qpButtonAddChapter" value="Thêm 1 chương" title="Thêm một chương vào sau chương cuối cùng" class="btn btn-primary" /> </div> </div> <div class="input-group"> <div class="button-group"> <input type="button" id="qpButtonResetChapter" value="Xóa danh sách chương" title="Xóa toàn bộ vùng đã tạo" class="btn btn-danger" /> <input type="button" id="qpButtonRemoveLast" value="Xóa chương cuối" title="Loại bỏ chương cuối" class="btn btn-danger" /> <input type="button" id="qpButtonRemoveEmpty" value="Xóa chương trống" title="Loại bỏ chương không có nội dung sau dán" class="btn btn-danger" />  </div> </div> </div> <label>Chữ Ký (chèn ở đầu mỗi chương)</label> <div class="form-group"> <textarea placeholder="Nội dung chữ ký, sẽ được thêm vào ở đầu mỗi chương..." id="qpHeaderSign" class="form-control" rows="1"></textarea> </div> <label>Chữ Ký (chèn ở cuối mỗi chương)</label> <div class="form-group"> <textarea placeholder="Nội dung chữ ký, sẽ được thêm vào ở cuối mỗi chương..." id="qpFooterSign" class="form-control" rows="1"></textarea> </div> <label>Thay thế các giá trị trong tiêu đề chương</label> <div class="form-inline"> <div class="form-group"> <input type="text" placeholder="Regex tìm kiếm đặt trong /chuỗi_regex/ hoặc chuỗi tìm kiếm" id="qpTextTitleFind" class="form-control"> </div> <div class="form-group"> <input type="text" placeholder="Thay thế bằng" id="qpTextTitleReplace" class="form-control"> </div> <div class="form-group"> <input type="button" value="Thay thế" class="btn btn-primary" id="qpButtonTitleReplace"> </div> </div> <label>Tùy chọn</label> <div class="form-group"> <div class="form-group"> <label style="color: #bef385;"><input type="checkbox" id="qpOptionLoop" class="form-control" style="height:10px;width: 10px;display: inline-block;">Tiêu đề chương lặp </label> (dạng Chương 1 abc Chương 1 abc - Nội dung chương) </div> <div class="form-group"> <input type="button" value="Lưu Thiết Lập" class="form-control btn btn-success" id="qpSaveConfig"> </div> </div> </div> <p><span id="mkcopyright">© 2018</span> by <a href="fb.me/mkbyme">Mkbyme</a></p> </div>';

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
                advContent = jQuery("#qpAdv").val(),
                footerSign = jQuery("#qpFooterSign").val(),
                headerSign = jQuery("#qpHeaderSign").val();
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
                jQuery("#qpn").html("Số chương copy chưa đủ, cần sao thêm " + (titles.length - 1 - (loop === true ? a.length / 2 : a.length)) + " chương nữa. Hoặc bỏ các chương thừa   <button class=\"btn btn-danger\" onclick=\"javascript:document.getElementById('qpButtonRemoveEmpty').click();\">Xóa chương trống</button> và Đăng chương.").removeClass("text-notify").addClass("text-danger");
                jQuery("#qpContent").val("");
                jQuery("#qpButtonSubmit").removeClass("btn-read").addClass("btn-disable");
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
        jQuery("#qpContent").on("paste", function (e) {
            jQuery(this).val("");
            setTimeout(function () {
                me.performAction();
            }, 500);
        });

        //thêm chapter
        jQuery("#qpButtonAddChapter").on('click', function (e) {
            e.preventDefault();
            TangThuVienQuickPost.addNewChapter();
        });
        //xóa chapter
        jQuery("#qpButtonRemoveLast").on('click', function (e) {
            e.preventDefault();
            TangThuVienQuickPost.removeLastedPost();
        });
        //gen danh sách chapter
        jQuery("#qpButtonGenChapter").on('click', function (e) {
            e.preventDefault();
            TangThuVienQuickPost.createListAddChapter();
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
                "&footerSign=" + jQuery("#qpFooterSign").val() +
                '&headerSign=' + jQuery("#qpHeaderSign").val() +
                '&numberChapter=' + jQuery('#qpNumberOfChapter').val() +
                '&splitValueReplace=' + jQuery('#qpSplitValueReplace').val() +
                '&textTitleFind=' + jQuery('#qpTextTitleFind').val() +
                '&textTitleReplace=' + jQuery('#qpTextTitleReplace').val();

            var cookieStr = "qpmkconfig=" + escape(value) + "; ";
            var today = new Date();
            var expr = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
            cookieStr += "expires=" + expr.toGMTString() + "; ";
            cookieStr += "path=/; ";
            cookieStr += "domain=tangthuvien.vn; ";

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
                if (nameArr[0] === "qpmkconfig") {
                    name = unescape(nameArr[1]);
                    break;
                }
            }
            var arr = name.split("&");
            if (arr.length > 7) {
                jQuery("#qpSplitValue").val(arr[0].split("=")[1]);
                jQuery("#qpOptionLoop")[0].checked = (arr[1].split("=")[1] == "true" ? true : false);
                jQuery("#qpFooterSign").val(arr[2].split("=")[1]);
                jQuery("#qpHeaderSign").val(arr[3].split("=")[1]);
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
    }
};

TangThuVienQuickPost.init();
