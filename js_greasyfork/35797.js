// ==UserScript==
// @name         TieqViet-ize
// @version      1.1.1
// @description  Script này sẽ biến mọi trang web của bạn thành Tiếng Việt sau cải cách :). Thanh menu hiện ở góc phải của màn hình
// @author       Dogekutesky's
// @match        *://*/*
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js
// @resource     https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css
// @grant        none
// @namespace https://greasyfork.org/users/123835
// @downloadURL https://update.greasyfork.org/scripts/35797/TieqViet-ize.user.js
// @updateURL https://update.greasyfork.org/scripts/35797/TieqViet-ize.meta.js
// ==/UserScript==

$('body').after('<tieqviet><div class="popup-tieqviet"> Bạn kó muốn Việt hoá page này?<div><button class="yes">Có</button><button class="no gray">Để sau</button></div></div><style>.popup-tieqviet button{font-family: Arial;font-weight: bold;font-size: 18px;cursor: pointer;width: 90px;height: 45px;margin: 15px 0 0 3px!important;transition: all 0.2s;color: #fff;background: #226fbe;border: 2px dashed #226fbe;border-radius: 7px}.popup-tieqviet button:hover{background: transparent;color: #226fbe}.popup-tieqviet .gray{background: gray;border: 2px dashed gray}.popup-tieqviet .gray:hover{color: gray}.popup-tieqviet{color: black!important;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)!important;right: -220px;top: 10px;padding: 20px!important;background: #fff;border-radius: 5px;width: 200px;position: fixed;font-family: verdana;font-size: 16px;z-index: 99999999;transition: all 0.5s;}.popup-tieqviet:hover{right: 5px;}</style></tieqviet>');
$('.popup-tieqviet button').on('click',function(){
    $('.popup-tieqviet').remove();
});
$('.popup-tieqviet .yes').on('click',function(){
    tieqVietize();
});
function tieqVietize(){
    var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(a){return typeof a;}:function(a){return a&&'function'==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?'symbol':typeof a;},maps=[['k(h|H)','x'],['K(h|H)','X'],['c(?!(h|H))|q','k'],['C(?!(h|H))|Q','K'],['t(r|R)|c(h|H)','c'],['T(r|R)|C(h|H)','C'],['d|g(i|I)|r','z'],['D|G(i|I)|R','Z'],['g(i|\xEC|\xED|\u1EC9|\u0129|\u1ECB|I|\xCC|\xCD|\u1EC8|\u0128|\u1ECA)','z$1'],['G(i|\xEC|\xED|\u1EC9|\u0129|\u1ECB|I|\xCC|\xCD|\u1EC8|\u0128|\u1ECA)','Z$1'],['\u0111','d'],['\u0110','D'],['p(h|H)','f'],['P(h|H)','F'],['n(g|G)(h|H)?','q'],['N(g|G)(h|H)?','Q'],['(g|G)(h|H)','$1'],['t(h|H)','w'],['T(h|H)','W'],['(n|N)(h|H)','$1\'']];var tieqViet=function(a){if('string'!=typeof a)throw new TypeError('Expected a string, got '+('undefined'==typeof a?'undefined':_typeof(a)));return maps.reduce(function(b,c){return a=a.replace(new RegExp(c[0],'g'),c[1]),a;},a);};
    //minified modified version of https://github.com/phanan/tieqviet/blob/master/dist/tieqviet.min.js

    function modifyV(f){
        $(f).find('*:not(iframe):not(style):not(span[data-text="true"])').contents().filter(function(){return (this.nodeType == 3) && this.nodeValue.match(/[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]/); }).each(function() {
            if (!$(this).parent().hasClass('viet-hoa-ed')){
                var text = tieqViet($(this).text());
                //console.log(text);
                this.nodeValue=text;
                $(this).parent().addClass('viet-hoa-ed');
            }
        });
    }
    modifyV('body');
    var observer = new MutationObserver(function(mutations) {
        $(mutations).each(function(){
            modifyV($(this.target));
            //console.log($(this.target));

        });
    });

    var config = {  childList: true, subtree: true };
    observer.observe(document.body,config);
}