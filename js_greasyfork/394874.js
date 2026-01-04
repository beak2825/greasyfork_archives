// ==UserScript==
// @name         showPassword
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  showPassword!
// @author       aweleey
// @resource     show https://i.loli.net/2020/01/09/oi9aZn1RQuTkKCw.png
// @resource     hide https://i.loli.net/2020/01/09/JETHMakd4Cnjs6W.png
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.slim.min.js
// @include      *
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/394874/showPassword.user.js
// @updateURL https://update.greasyfork.org/scripts/394874/showPassword.meta.js
// ==/UserScript==

(function(jq) {
    function password() {
        var btnStyle = [
            'display:none;',
            'position:absolute;',
            'right:5px;',
            'top:50%;',
            'transform:translate(0, -50%);',
            'cursor:pointer'
        ];
        var icon = {
            show: GM_getResourceURL('show'),
            hide: GM_getResourceURL('hide')
        };
        var pwt = jq('input[type="password"]');
        var inputWrap = jq('<div id="sh-wrap" style="position:relative" />');
        var btn = jq(`<img src="${icon.show}" style="${btnStyle.join('')}" />`);

        inputWrap
            .on('mouseenter', function() {
                if (jq(this).children().length > 1) btn.css('right', '24px');
                btn.css('display', 'block');
            })
            .on('mouseleave', function() {
                btn.css('display', 'none');
            });

        btn.on('click', function() {
            var pwType = 'password';
            var input = jq(this).prev();
            var isShow = input.attr('type') === pwType;
            input.attr('type', isShow ? 'text' : pwType);
            jq(this).attr('src', isShow ? icon.hide : icon.show);
        });
        pwt.wrap(inputWrap)
            .after(btn)
            .mouseenter(() => {
                var hasLassPass = jq('#__lpform_password');
                if (hasLassPass.length > 0) {
                    btn.css('display', 'block');
                    btn.css('right', '24px');
                }
            });
    }
    jq(password);
    GM_registerMenuCommand('init', password);
    GM_registerMenuCommand('show', function() {
        var pwd = jq('input[type="password"]').attr('type', 'text');
        // console.log('GM_registerMenuCommand show:');
        setTimeout(() => {
            pwd.attr('type', 'password');
            // console.log('after 3600ms | pwd:', pwd);
        }, 3600);
    });
})(jQuery.noConflict());
