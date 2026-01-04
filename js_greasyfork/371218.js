// ==UserScript==
// @name         BookTruyen.com QuickPaste
// @namespace    mkbyme.quickpaste
// @version      0.1
// @description  QuickPaste for Add Chapter
// @author       Mkbyme
// @match        http://*.booktruyen.com/account/add_chapter/*
// @grant        none
// @homepageURL https://www.facebook.com/mkbyme
// @supportURL https://www.facebook.com/mkbyme
// @license GPL-3.0-or-later
// @collaborator mkbyme
// @required https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @required https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @required https://cdnjs.cloudflare.com/ajax/libs/jquery-highlighttextarea/3.1.3/jquery.highlighttextarea.min.js
// @downloadURL https://update.greasyfork.org/scripts/371218/BookTruyencom%20QuickPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/371218/BookTruyencom%20QuickPaste.meta.js
// ==/UserScript==
//create element
var CookieOptions = CookieOptions || {};
var $ = $ || window.$ || window.jQuery;
var Constant = Constant || {};
/*
 * Contant
 */
Constant = {
    CookiesName: 'qpmkconfig'
}
/*
 * Cookies key
 */
CookieOptions = {
    SplitTitle: "splitTitle",
    OptionLoop: "optionLoop",
    SignEnd: "signEnd",
    SignStart: "signStart",
};
/*
 * format string
 */
function format(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ?
            args[number] :
            match;
    });
}
/*
 * create new DOM elements
 */
function ce(n) {
    console.log($.highlightTextarea);
    return document.createElement(n);
}
/*
 * inject style to head of html
 */
function addStyle(style) {
    var s = ce("style"),
        h = document.head || document.getElementsByTagName("head")[0];
    s.type = "text/css";
    s.appendChild(document.createTextNode(style));
    h.appendChild(s);
}
/*
 * add quickpaste css
 */
function addCss() {
    var s = "";
    s += "#qpmk{background-color: #2d2d2d;padding: 3px 15px;color: #ebebeb;border-radius: 5px 5px 0px 0px;margin-bottom: 15px;}";
    s += "#qpmk>.form-group>div{font-size: 13px;color: #bef385;}";
    s += "#qpmk>p{font-size:13px;color: #c7c7c7;text-align: right;}";
    addStyle(s);
}
/*
 * template inject
 */
function createInjectHTML() {
    var h = "";
    h += "<div id=\"qpmk\"><h3>Đăng Truyện Nhanh  Script</h3><div class=\"form-group\">";
    h += "<div>Ví dụ tên Chương 1, Chương 2, Chương n thì điền \"Chương \" để thực hiện dán tự động<br>";
    h += "<ol><li>Nhập số chương cần đăng = số_hiện_tại + số_chương_đăng</li>";
    h += "<li>Mở tệp chứa nội dung đã convert chọn và copy đoạn chứa số_chương_đăng</li><li>Dán vào DÁN VÀO ĐÂY</li>";
    h += "<li>Dà soát tên chương và số chương.</li><li>Nhấn <b>Đăng Chương</b></li></ol>";
    h += "<span style=\"color:red\">* </span>Trước khi nhấn nút <b class=\"text-info\">Đăng Chương</b> thì phải thực hiện sao chép nội dung truyện trước.</div>";

    h += "<label>Tiêu Đề Chương(để chia tách các chương truyện)</label>";
    h += "<input type=\"text\" id=\"qpSplitString\" class=\"form-control\" value=\"	Chương \" placeholder=\"Nhập tiêu đề chứa từ cách chương/chapter\"></div>";

    //sign
    h += "<div class=\"form-group\"><label>Chữ Ký (chèn ở đầu mỗi chương)</label><textarea placeholder=\"Nội dung chữ ký, sẽ được thêm vào ở đầu mỗi chương...\" id=\"qpSignStart\" class=\"form-control\" rows=\"2\"></textarea></div>";
    h += "<div class=\"form-group\"><label>Chữ Ký (chèn ở cuối mỗi chương)</label><textarea placeholder=\"Nội dung chữ ký, sẽ được thêm vào ở cuối mỗi chương...\" id=\"qpSignEnd\" class=\"form-control\" rows=\"2\"></textarea></div>";
    //end sign
    //option
    h += "<div class=\"form-group\"><label>Tùy chọn</label>";
    h += "<div class=\"form-inline\"><label>Tiêu đề chương lặp <input type=\"checkbox\" id=\"qpOptionLoop\" class=\"form-control\"></label> (dạng Chương 1 abc Chương 1 abc - Nội dung chương)</div>";

    h += "<div class=\"form-group\"><input type=\"button\" value=\"Lưu Thiết Lập\" class=\"form-control btn btn-success\" id=\"qpSaveConfig\"></div>";
    h += "</div>";
    //end option

    h += "<div class=\"form-group\"><label>Dán Vào Đây(CTRL + V)</label>";
    h += "<textarea placeholder=\"dán nội dung vào đây - CTRL + V\" id=\"qpValidate\" class=\"form-control\" rows=\"5\"></textarea></div>";

    h += "<span id=\"qpNoti\" style=\"margin:0px 15px;font-weight:bold\"></span>";
    h += "<button class=\"btn btn-read\"onclick=\"document.getElementsByName('Newchapper')[0].click();\">Đăng Chương</button><span id=\"qpNoti\" style=\"margin-left:15px;font-weight:bold\"></span>";
    h += "<p>© by <a href=\"fb.me/mkbyme\">Mkbyme</a></p></div>";

    var example = '<div class="container">'
 + '    <button type="button" class="btn btn-default btn-success" id="myBtn">Xem ví dụ</button>'
 + '    <!-- Modal -->'
 + '    <div class="modal fade" id="myModal" role="dialog">'
 + '        <div class="modal-dialog modal-lg">'
 + '            <!-- Modal content-->'
 + '            <div class="modal-content">'
 + '                <div class="modal-header">'
 + '                    <button type="button" class="close" data-dismiss="modal">&times;</button>'
 + '                    <h3><span class="glyphicon glyphicon-info-sign"></span> Ví dụ các loại lặp chương</h3>'
 + '                </div>'
 + '                <div class="modal-body">'
 + '                    <p><strong>Ví dụ không cần tích <b>Tùy chọn <span style="color:green">Tiêu đề chương lặp</span></b></strong> (chọn và copy sau đó dán để test)</p>'
 + '<pre>Chương 10: Lôi Hỏa Thánh Điển\r\n\r\n'
 + 'Chứng kiến một khối lại một khối tinh xảo bánh ngọt bị Nhiếp Ly, \r\n'
 + 'Đỗ Trạch cùng Lục Phiêu tiêu diệt gọn gàng, những thế gia kia đám\r\n'
 + 'đệ tử trong nội tâm đều phiền muộn hư mất, vì cái gì chính mình\r\n'
 + 'không có đãi ngộ như vậy?\r\n'
 + '\r\n'
 + 'Chương 11: Uy hiếp\r\n'
 + 'Nhiếp Ly nhìn xem nổi trận lôi đình Thẩm Tú, cười nhạt một tiếng nói: \r\n'
 + '"Thẩm Tú Đạo sư thật đúng là bác học. '
 + 'Chẳng lẽ Thẩm Tú Đạo sư xem qua trên thế giới này tất cả sách hay sao?" \r\n'
 + 'Kiếp trước Thẩm Tú cũng là như vậy man không nói đạo lý.\r\n'
 + '</pre>'
 + '                    <br />'
 + '                    <p><strong>Ví dụ cần tích <b>Tùy chọn <span style="color:green">Tiêu đề chương lặp</span></b></strong> (chọn và copy sau đó dán để test)</p>'
 + '<pre>Chương 10: Lôi Hỏa Thánh Điển\r\n\r\n'
 + 'Chương 10: Lôi Hỏa Thánh Điển\r\n\r\n'
 + 'Chứng kiến một khối lại một khối tinh xảo bánh ngọt bị Nhiếp Ly, \r\n'
 + 'Đỗ Trạch cùng Lục Phiêu tiêu diệt gọn gàng, những thế gia kia đám\r\n'
 + ' đệ tử trong nội tâm đều phiền muộn hư mất, vì cái gì chính mình\r\n'
 + ' không có đãi ngộ như vậy?\r\n'
 + ' \r\n'
 + 'Chương 11: Uy hiếp\r\n\r\n'
 + 'Chương 11: Uy hiếp\r\n\r\n'
 + 'Nhiếp Ly nhìn xem nổi trận lôi đình Thẩm Tú, cười nhạt một tiếng nói: \r\n'
 + '"Thẩm Tú Đạo sư thật đúng là bác học. '
 + 'Chẳng lẽ Thẩm Tú Đạo sư xem qua trên thế giới này tất cả sách hay sao?" \r\n'
 + 'Kiếp trước Thẩm Tú cũng là như vậy man không nói đạo lý.\r\n'
 + '</pre>'
 + '                </div>'
 + '                <div class="modal-footer">'
 + '                    <button type="submit" class="btn btn-default btn-default" data-dismiss="modal"><span class="glyphicon glyphicon-remove"></span> Đóng</button>'
 + '                  '
 + '                </div>'
 + '            </div>'
 + '        </div>'
 + '    </div>'
 + '</div>';

    h += example;

    $(".form-horizontal").before(h);
}
/*
 * process copy and paste data
 */
function process() {
    $("#qpValidate").on("paste", function (e) {
        $(this).val("");

        setTimeout(function () {
            var content = $("#qpValidate").val(),
                splitStr = $("#qpSplitString").val(),
                splitStrTrim = splitStr.trim(),
                lstChapterTitle = $("input[name^=title]"),
                lstChapterContent = $("textarea[name^=content"),
                isLoopChapterTitle = $("#qpOptionLoop")[0].checked,
                isError = false,
                signStartStr = $("#qpSignStart").val(),
                signEndStr = $("#qpSignEnd").val();

            content = content.split("\n" + splitStr).filter(function (entry) {
                return entry.trim() !== "";
            });
            if (!isLoopChapterTitle && content.length < lstChapterContent.length) {
                isError = true;
            }
            if (isLoopChapterTitle && (content.length / 2) < lstChapterContent.length) {
                isError = true;
            }
            //error
            if (isError) {
                $("#qpNoti").html("Số chương copy chưa đủ, cần sao thêm " + (lstChapterContent.length - 1 - (isLoopChapterTitle === true ? content.length / 2 : content.length)) + " chương nữa, Hãy thử lại! <button class=\"btn btn-danger\" onclick=\"javascript:document.getElementsByName('Newchapper')[0].click();\">Vẫn Đăng</button>").removeClass("text-notify").addClass("text-danger");
                $("#qpValidate").val("");
                //go on work
            }
            //not loop chapter title do
            var splitStrTrimLower = splitStrTrim.toLowerCase();
            var contentLength = isLoopChapterTitle ? (content.length / 2) : content.length;
            $.each(lstChapterContent, (function (key, value) {
                if (key < contentLength) {
                    if (key < lstChapterTitle.length) {
                        //loop chapter skip first loop, and take next
                        var idx = isLoopChapterTitle ? (key * 2 + 1) : key;

                        var chapterContent = content[idx].trim().split("\n"),
                            chapterTitleTrim = chapterContent.length > 0 ? chapterContent.shift(0).trim().toLowerCase() : "";

                        if (chapterTitleTrim.startsWith(splitStrTrimLower)) {
                            $(lstChapterTitle[key]).val(capString(chapterTitleTrim));
                            $(this).val(signStartStr + "\r\n" + chapterContent.join("\r\n") + "\r\n\r\n" + signEndStr);
                        } else {
                            $(lstChapterTitle[key]).val(capString(splitStrTrim + " " + chapterTitleTrim));
                            $(this).val(signStartStr + "\r\n" + chapterContent.join("\r\n") + "\r\n\r\n" + signEndStr);
                        }
                    }
                } else {
                    $("#qpValidate").val("Đã thực hiện được " + key + " /" + (lstChapterContent.length) + " nhập ban đầu, có thể nhấn Vẫn Đăng để tiếp tục");
                    return false;
                }
            }));
            //after insert do
            if (!isError) {
                $("#qpNoti").removeClass("text-danger").addClass("text-notify").text("OK, 1-Nhấn Tiếp Tục sau đó nhấn 2-Đăng Chương");
                $("#qpValidate").val("Đã thực hiện xong, OK");
            }
        }, 500);
    });

    $("#qpSaveConfig").on("click", function (e) {
        var formatStr = CookieOptions.SplitTitle + "={0}&" +
            CookieOptions.OptionLoop + "={1}&" +
            CookieOptions.SignEnd + "={2}&" +
            CookieOptions.SignStart + "={3}";

        var value = format(formatStr, $("#qpSplitString").val(), $("#qpOptionLoop")[0].checked, $("#qpSignEnd").val(), $("#qpSignStart").val());

        var cookieStr = Constant.CookiesName + "=" + escape(value) + "; ";

        var today = new Date();
        var expr = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        cookieStr += "expires=" + expr.toGMTString() + "; ";
        cookieStr += "path=/; ";
        cookieStr += "domain=" + window.location.host + "; ";

        document.cookie = cookieStr;

        alert("Đã lưu lại thiết lập");
    });
    qpreadCookies();
}
/*
 * upper first char of each word in string
 */
function capString(str) {
    var buffer = '';
    if (str && typeof str === 'string') {
        var arr = str.split(" ").filter(function (entry) {
            return entry.trim() !== "";
        });
        var buffArr = [];
        for (var i = 0; i < arr.length; i++) {
            var s = arr[i];
            if (s.length > 0) {
                buffArr.push(s.charAt(0).toUpperCase() + s.slice(1));
            }
        }
        buffer = buffArr.join(" ");
    }
    return buffer;
}
/*
 * read cookies
 */
function qpreadCookies() {
    var configCookieData = "";
    var cookies = document.cookie.split('; ');
    for (var ii = 0; ii < cookies.length; ii++) {
        var nameValue = cookies[ii].split('=');
        if (nameValue && nameValue[0] === Constant.CookiesName) {
            configCookieData = unescape(nameValue[1]);
            break;
        }
    }
    if (configCookieData) {
        var arr = configCookieData.split("&");
        var configObject = {};
        for (var i = 0, l = arr.length; i < l; i++) {
            var splitData = [];
            var str = arr[i];
            if (typeof str === 'string' && (splitData = str.split('=')).length === 2) {
                configObject[splitData[0]] = splitData[1];
            }
        }
        $("#qpSplitString").val(configObject[CookieOptions.SplitTitle] ? configObject[CookieOptions.SplitTitle] : "");
        $("#qpOptionLoop").val(configObject[CookieOptions.OptionLoop] === "true" ? true : false);
        $("#qpSignEnd").val(configObject[CookieOptions.SignEnd] ? configObject[CookieOptions.SignEnd] : "");
        $("#qpSignStart").val(configObject[CookieOptions.SignStart] ? configObject[CookieOptions.SignStart] : "");

        delete configObject;
    }
}
/*
 * run
 */
function init() {
    addCss();
    createInjectHTML();
    process();
    $("#qpValidate").focus();
    //show example
    $(document).ready(function () {
        $("#myBtn").click(function () {
            $("#myModal").modal();
        });
    });
}
init();