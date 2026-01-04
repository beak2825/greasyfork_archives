// ==UserScript==
// @name         bangumi-wiki-editer-enhance
// @namespace    rabbitohh
// @version      v1.1.1
// @description  为维基编辑器增加新功能
// @author       rabbitohh
// @match        *://bgm.tv/subject/*/edit_detail
// @match        *://bangumi.tv/subject/*/edit_detail
// @match        *://chii.in/subject/*/edit_detail
// @icon         https://bgm.tv/img/favicon.ico
// @license      MIT
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/518579/bangumi-wiki-editer-enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/518579/bangumi-wiki-editer-enhance.meta.js
// ==/UserScript==

function convertToISBN13(isbn) {
    isbn = isbn.replace(/[^0-9Xx]/g, "");
    if (isbn.length === 13) {
        return isbn;
    } else if (isbn.length === 10) {
        const base = "978" + isbn.slice(0, -1);
        let sum = 0;
        for (let i = 0; i < base.length; i++) {
            sum += parseInt(base[i]) * (i % 2 === 0 ? 1 : 3);
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        return base + checkDigit;
    } else {
        return 0;
    }
}

function ISBNcvt(isbn) {
    var $ISBN = isbn.next().val();
    $ISBN = convertToISBN13($ISBN);
    if ($ISBN == 0) return '转换失败！';
    isbn.next().val($ISBN);
    return '转换成功！';
}

function MultiAdd() {
    var $loc = $('#infobox_normal input.inputtext.id[value!=""]').last();
    var $cod = $(`
        <p><input class="inputtext id multiKey" tabindex="1024" value="版本:"><input class="inputtext prop multiVal" readonly="true" onclick="addSubProp(this);" value="点此增加输入框:"><input type="button" tabindex="-1" class="multiKeyAdd" onclick="addSubProp(this);"><br clear="all"></p>
        <input class="inputtext id multiSubKey" tabindex="1024" value="版本名"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="别名"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="出版社"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="插图"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="发售日"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="译者"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="页数"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="册数"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="价格"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="ISBN"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="书系"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="出品方"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
        <input class="inputtext id multiSubKey" tabindex="1024" value="官方网站"><input class="inputtext prop multiSubVal" value=""><input type="button" tabindex="-1" class="multiKeyDel"><br clear="all">
    `);
    if($loc.hasClass('multiSubKey'))
    {
        $loc.next().next().next().after($cod);
        return "添加成功！";
    }
    else if($loc.val()=="其他")
    {
        $cod.insertBefore($loc);
        return "添加成功！";
    }
    else
    {
        $loc.next().next().after($cod);
        return "添加成功！";
    }

}

function work1() {
    var $isbn = $('[value="ISBN"]');
    if($isbn.hasClass("multiSubKey")) return;
    $isbn.next().siblings('button').remove();
    var $cvtbutton = $('<button><i class="fas fa-hammer"></i></button>');
    $cvtbutton.css({
        'width': '16px',
        'height': '16px',
        'border-radius': '50%',
        'border': 'solid 1.5px #7a8ca8',
        'align-items': 'center',
        'justify-content': 'center',
        'background-color': '#afc9f0',
        'font-size': '8px',
        'color': 'white',
        'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'padding': '0',
        'cursor': 'pointer',
    });

    $isbn.next().after($cvtbutton);

    $cvtbutton.off('click').on('click', function (event) {
        event.preventDefault();
        alert(ISBNcvt($isbn));
    });
}

function work2()
{
    $('#infobox_wcode').prev('button').remove();
    var $mltbutton = $('<button>添加多版本</button>');
    $mltbutton.insertBefore('#infobox_wcode');
    $mltbutton.css({
        'align-items': 'center',
        'justify-content': 'center',
        'background-color': 'rgba(255,255,255,.5)',
        'font-size': '13px',
        'padding': '0',
        'cursor': 'pointer',
        'margin': '5px',
        'border': 'none',
        'padding': '8px',
        'border-radius': '5px',
    });
    $mltbutton.off('click').on('click', function (event) {
        event.preventDefault();
        alert(MultiAdd());
    });
}


(function () {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
    document.head.appendChild(link);

    const originalWCODEtoNormal = window.WCODEtoNormal;
    window.WCODEtoNormal = function()
    {
        originalWCODEtoNormal.apply(this, arguments);
        work1();
        work2();
    };

    work1();
    work2();
})();
