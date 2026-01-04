// ==UserScript==
// @name         booktruyen.com QuickPaste
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  QuickPaste for Add Chapter
// @author       Mkbyme
// @match        http://*.booktruyen.com/account/add_chapter/*
// @grant        none
// @required https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/371089/booktruyencom%20QuickPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/371089/booktruyencom%20QuickPaste.meta.js
// ==/UserScript==
//create element
function ce(n)
{
    return document.createElement(n);
}
//add style
function addStyle(style)
{
    var s = ce("style"),h = document.head || document.getElementsByTagName("head")[0];
    s.type="text/css";
    s.appendChild(document.createTextNode(style));
    h.appendChild(s);
}
//add CSS
function addCss()
{
    var s = "";
    s+="#qpmk{background-color: #2d2d2d;padding: 3px 15px;color: #ebebeb;border-radius: 5px 5px 0px 0px;margin-bottom: 15px;}";
    s+="#qpmk>.form-group>div{font-size: 13px;color: #bef385;}";
    s+="#qpmk>p{font-size:13px;color: #c7c7c7;text-align: right;}";
    addStyle(s);
}
function createInjectHTML()
{
    var h = "";
    h+="<div id=\"qpmk\"><h3>Đăng Truyện Nhanh  Script</h3><div class=\"form-group\">";
    h+="<div>Ví dụ tên Chương 1, Chương 2, Chương n thì điền \"Chương \" để thực hiện dán tự động<br>";
    h+="<ol><li>Nhập số chương cần đăng = số_hiện_tại + số_chương_đăng</li>";
    h+="<li>Mở tệp chứa nội dung đã convert chọn và copy đoạn chứa số_chương_đăng</li><li>Dán vào DÁN VÀO ĐÂY</li>";
    h+="<li>Nhấn <b>1-Tiếp Tục</b></li><li>Sau khi chuyển trang lần 2 dà soát tên chương và số chương.</li><li>Nhấn <b>2-Đăng Chương</b></li></ol>";
    h+="<span style=\"color:red\">* </span>Trước khi nhấn nút <b class=\"text-info\">Đăng Chương</b> thì phải thực hiện sao chép nội dung truyện trước.</div>";

    h+="<label>Tiêu Đề Chương(để chia tách các chương truyện)</label>";
    h+="<input type=\"text\" id=\"qpmks\" class=\"form-control\" value=\"	Chương \" placeholder=\"Nhập tiêu đề chứa từ cách chương/chapter\"></div>";

    //sign
    h+="<div class=\"form-group\"><label>Chữ Ký (chèn ở cuối mỗi chương)</label><textarea placeholder=\"Nội dung chữ ký, sẽ được thêm vào ở cuối mỗi chương...\" id=\"qpsv\" class=\"form-control\" rows=\"1\"></textarea></div>";
    //end sign
    //option
    h+="<div class=\"form-group\"><label>Tùy chọn</label>";
    h+="<div class=\"form-inline\"><label>Tiêu đề chương lặp <input type=\"checkbox\" id=\"qpoloop\" class=\"form-control\"></label> (dạng Chương 1 abc Chương 1 abc - Nội dung chương)</div>";

    h+="<div class=\"form-group\"><input type=\"button\" value=\"Lưu Thiết Lập\" class=\"form-control btn btn-success\" id=\"qpsaveconfig\"></div>";
    h+="</div>";
    //end option

    h+="<div class=\"form-group\"><label>Dán Vào Đây(CTRL + V)</label>";
    h+="<textarea placeholder=\"dán nội dung vào đây - CTRL + V\" id=\"qpv\" class=\"form-control\" rows=\"5\"></textarea></div>";

    h+="<button type=\"submit\" id=\"qpmkd\" class=\"btn btn-disable\" onclick=\"javascript:;\">1-Tiếp Tục</button><span id=\"qpn\" style=\"margin:0px 15px;font-weight:bold\"></span>";
    h+="<button class=\"btn btn-read\"onclick=\"document.getElementById('btnAddchapter2').click();\">2-Đăng Chương</button><span id=\"qpn\" style=\"margin-left:15px;font-weight:bold\"></span>";
    h+="<p>© by <a href=\"fb.me/mkbyme\">Mkbyme</a></p></div>";
    $(".form-horizontal").before(h);
}
function process()
{
    $("#qpv").on("paste",function(e){
        $(this).val("");

        setTimeout(function(){
            var a = $("#qpv").val(),s=$("#qpmks").val(),st=s.trim(),ta=$("textarea[id^=url]"),loop = $("#qpoloop")[0].checked,error=false,sign=$("#qpsv").val();
            a = a.split("\n"+s).filter(function(entry){return entry.trim()!=="";});
            if(!loop && a.length < ta.length )
                error=true;
            if(loop && (a.length/2) < ta.length )
                error=true;
            //error
            if(error)
            {
                $("#qpn").html("Số chương copy chưa đủ,Cần sao thêm " + ( ta.length - 1 - (loop===true?a.length/2:a.length)) + " chương nữa, Hãy thử lại! <button class=\"btn btn-danger\" onclick=\"javascript:document.getElementById('ok').click();\">Vẫn Đăng</button>").removeClass("text-notify").addClass("text-danger");
                $("#qpv").val("");
                $("#qpmkd").attr("onclick","javascript:void();").removeClass("btn-read").addClass("btn-disable");
                //go on work
                //return false;
            }
            //not loop chapter title do
            if(!loop)
            {
                $.each(ta, (function(k, v) {    
                    if(k < a.length)
                    {
                        var at = a[k],ats=at.substring(0,300).trim().toLowerCase();
                        if(ats.startsWith(st.toLowerCase()))
                            $(this).val(at+"\r\n"+sign);
                        else
                            $(this).val(st+" "+at+"\r\n"+sign);
                    }
                    else
                    {
                        $("#qpv").val("Đã thực hiện được "+k+" /"+(ta.length )+" nhập ban đầu, có thể nhấn Vẫn Đăng để tiếp tục");
                        return false;
                    }
                }));

            }
            //loop chapter title do
            else
            {
                var j = 0,ha = a.length/2;
                $.each(ta, (function(k, v) {    
                    if(k < ha)
                    {
                        var at = a[++j],ats=at.substring(0,300).trim().toLowerCase();
                        if(ats.startsWith(st.toLowerCase()))
                            $(this).val(at+"\r\n"+sign);
                        else
                            $(this).val(st+" "+at+"\r\n"+sign);
                    }
                    else
                    {
                        $("#qpv").val("Đã thực hiện được "+k+" /"+(ta.length)+" nhập ban đầu, có thể nhấn Vẫn Đăng để tiếp tục");
                        return false;
                    }
                    j++;

                }));
            }
            //after insert do
            if(!error){
                $("#qpmkd").attr("onclick","javascript:document.getElementById('ok').click();").removeClass("btn-disable").addClass("btn-read");
                $("#qpn").removeClass("text-danger").addClass("text-notify").text("OK, 1-Nhấn Tiếp Tục sau đó nhấn 2-Đăng Chương");
                $("#qpv").val("Đã thực hiện xong, OK");
            }

        },500);
    });

    $("#qpsaveconfig").on("click",function(e){
        var value="splitTitle="+$("#qpmks").val()+"&optionLoop="+$("#qpoloop")[0].checked+"&sign="+$("#qpsv").val();
        cookieStr = "qpmkconfig=" + escape(value) + "; ";

        var today = new Date();
        var expr = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
        cookieStr += "expires=" + expr.toGMTString() + "; ";

        cookieStr += "path=/; ";
        cookieStr += "domain=booktruyen.com; ";

        document.cookie = cookieStr;

        alert("Đã lưu lại thiết lập");
    });
    qpreadCookies();

}
function qpreadCookies()
{
    cName = "";
    pCOOKIES = new Array();
    pCOOKIES = document.cookie.split('; ');
    for(bb = 0; bb < pCOOKIES.length; bb++){
        NmeVal  = new Array();
        NmeVal  = pCOOKIES[bb].split('=');
        if(NmeVal[0] === "qpmkconfig"){
            cName = unescape(NmeVal[1]);
        }
    }

    var arr = cName.split("&");

    if(arr.length < 2)
        return;
    $("#qpmks").val(arr[0].split("=")[1]);
    $("#qpoloop")[0].checked = (arr[1].split("=")[1] == "true"?true:false);
    $("#qpsv").val(arr[2].split("=")[1]);

}
function init()
{
    addCss();
    createInjectHTML();
    process();
    $("#qpv").focus();
}
init();