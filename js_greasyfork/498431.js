// ==UserScript==
// @name         扇贝单词小助手
// @namespace    http://tampermonkey.net/
// @version      1.9.3
// @homepageURL  https://greasyfork.org/zh-CN/scripts/419996-%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E5%B0%8F%E5%8A%A9%E6%89%8B
// @description  新增翻译小助手，快捷查询中文对应的英文单词。数字小键盘快捷键，数字键3：US发音，数字键4：UK发音，数字5：扇贝单词与柯林斯词典的切换，数字6：例句发音，数字7：真题例句发音，数字0：隐藏展示柯林斯词典中的英文，专注模式，让你更专注背单词，黑暗模式，更护眼。显示/隐藏扇贝例句和柯林斯例句中文翻译的按钮，并关联数字键8，更多快捷键请查看面板或者更新日志与使用说明
// @author       ddrrcc
// @match        https://web.shanbay.com/wordsweb/*
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      youdao.com
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @icon         https://static.baydn.com/static/img/shanbay_favicon.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/js/toastr.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.1/index.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.18.0/js/md5.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.0.0/crypto-js.js
// @require      https://cdn.bootcdn.net/ajax/libs/limonte-sweetalert2/10.12.5/sweetalert2.all.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/498431/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498431/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {

    // 如果哪天翻译小助手不能使用了，可能就是费用不够了，自己可到有道翻译网站自行开通一个账号，将appKey和key填入即可
    let appKey = '1c7773d325ec6c09';
    let key = '0J9Aurlycl0JEUO5iQ4esUhh7qUNHfe0';

    // 定义变量
    var flag; // 用于数字5切换词典
    var flag2; // 用于柯林斯词典真题例句发音
    //const version = 1.8; // 脚本当前版本
    const version = GM_info.script.version;
    const updateURL = GM_info.script.homepage; // url
    const scriptname = GM_info.script.name;
    var font_size; //字体大小
    var tip; // 展开笔记标识
    // var versionMsg = "扇贝单词添加序号";



    $(document.head).append(
        `<link href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.1/theme-chalk/index.min.css" rel="stylesheet"><link href="https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css" rel="stylesheet"><style>.onea:hover{background-color:yellow;}.onediv{z-index: 999;background-color:rgba(255,255,255,1);width:220px;position:fixed;bottom:10px;left:10px;padding:5px;border-radius:15px;box-shadow:1px 1px 9px 0 #888;text-align:center; font-size:smaller}.twodiv:hover{right:2px}.twodiv{z-index: 998;right:-170px;transition:right 1s;background-color:#FFFFFF;width:220px;position:fixed;bottom:10px;padding:5px;border-radius:15px;box-shadow:1px 1px 9px 0 #888;text-align:center;font-size:smaller}  .toast-center-center{top: 50%;left: 50%;margin-top: -30px; margin-left: -150px;}</style>`
    )

    // bootstrap按钮样式
    $(document.head).append(
        `<style>.btn{display:inline-block;font-weight:400;color:#212529;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:transparent;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.btn{transition:none}}.btn:hover{color:#212529;text-decoration:none}.btn.focus,.btn:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.btn.disabled,.btn:disabled{opacity:.65}.btn:not(:disabled):not(.disabled){cursor:pointer}a.btn.disabled,fieldset:disabled a.btn{pointer-events:none}.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}.btn-primary.focus,.btn-primary:focus{color:#fff;background-color:#0069d9;border-color:#0062cc;box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-primary.disabled,.btn-primary:disabled{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:not(:disabled):not(.disabled).active,.btn-primary:not(:disabled):not(.disabled):active,.show>.btn-primary.dropdown-toggle{color:#fff;background-color:#0062cc;border-color:#005cbf}.btn-primary:not(:disabled):not(.disabled).active:focus,.btn-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-secondary{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:hover{color:#fff;background-color:#5a6268;border-color:#545b62}.btn-secondary.focus,.btn-secondary:focus{color:#fff;background-color:#5a6268;border-color:#545b62;box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-secondary.disabled,.btn-secondary:disabled{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:not(:disabled):not(.disabled).active,.btn-secondary:not(:disabled):not(.disabled):active,.show>.btn-secondary.dropdown-toggle{color:#fff;background-color:#545b62;border-color:#4e555b}.btn-secondary:not(:disabled):not(.disabled).active:focus,.btn-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-success{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:hover{color:#fff;background-color:#218838;border-color:#1e7e34}.btn-success.focus,.btn-success:focus{color:#fff;background-color:#218838;border-color:#1e7e34;box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-success.disabled,.btn-success:disabled{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:not(:disabled):not(.disabled).active,.btn-success:not(:disabled):not(.disabled):active,.show>.btn-success.dropdown-toggle{color:#fff;background-color:#1e7e34;border-color:#1c7430}.btn-success:not(:disabled):not(.disabled).active:focus,.btn-success:not(:disabled):not(.disabled):active:focus,.show>.btn-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-info{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:hover{color:#fff;background-color:#138496;border-color:#117a8b}.btn-info.focus,.btn-info:focus{color:#fff;background-color:#138496;border-color:#117a8b;box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-info.disabled,.btn-info:disabled{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:not(:disabled):not(.disabled).active,.btn-info:not(:disabled):not(.disabled):active,.show>.btn-info.dropdown-toggle{color:#fff;background-color:#117a8b;border-color:#10707f}.btn-info:not(:disabled):not(.disabled).active:focus,.btn-info:not(:disabled):not(.disabled):active:focus,.show>.btn-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-warning{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:hover{color:#212529;background-color:#e0a800;border-color:#d39e00}.btn-warning.focus,.btn-warning:focus{color:#212529;background-color:#e0a800;border-color:#d39e00;box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-warning.disabled,.btn-warning:disabled{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:not(:disabled):not(.disabled).active,.btn-warning:not(:disabled):not(.disabled):active,.show>.btn-warning.dropdown-toggle{color:#212529;background-color:#d39e00;border-color:#c69500}.btn-warning:not(:disabled):not(.disabled).active:focus,.btn-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-danger{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:hover{color:#fff;background-color:#c82333;border-color:#bd2130}.btn-danger.focus,.btn-danger:focus{color:#fff;background-color:#c82333;border-color:#bd2130;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-danger.disabled,.btn-danger:disabled{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:not(:disabled):not(.disabled).active,.btn-danger:not(:disabled):not(.disabled):active,.show>.btn-danger.dropdown-toggle{color:#fff;background-color:#bd2130;border-color:#b21f2d}.btn-danger:not(:disabled):not(.disabled).active:focus,.btn-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-light{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:hover{color:#212529;background-color:#e2e6ea;border-color:#dae0e5}.btn-light.focus,.btn-light:focus{color:#212529;background-color:#e2e6ea;border-color:#dae0e5;box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-light.disabled,.btn-light:disabled{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:not(:disabled):not(.disabled).active,.btn-light:not(:disabled):not(.disabled):active,.show>.btn-light.dropdown-toggle{color:#212529;background-color:#dae0e5;border-color:#d3d9df}.btn-light:not(:disabled):not(.disabled).active:focus,.btn-light:not(:disabled):not(.disabled):active:focus,.show>.btn-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-dark{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:hover{color:#fff;background-color:#23272b;border-color:#1d2124}.btn-dark.focus,.btn-dark:focus{color:#fff;background-color:#23272b;border-color:#1d2124;box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-dark.disabled,.btn-dark:disabled{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:not(:disabled):not(.disabled).active,.btn-dark:not(:disabled):not(.disabled):active,.show>.btn-dark.dropdown-toggle{color:#fff;background-color:#1d2124;border-color:#171a1d}.btn-dark:not(:disabled):not(.disabled).active:focus,.btn-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-outline-primary{color:#007bff;border-color:#007bff}.btn-outline-primary:hover{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary.focus,.btn-outline-primary:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-primary.disabled,.btn-outline-primary:disabled{color:#007bff;background-color:transparent}.btn-outline-primary:not(:disabled):not(.disabled).active,.btn-outline-primary:not(:disabled):not(.disabled):active,.show>.btn-outline-primary.dropdown-toggle{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary:not(:disabled):not(.disabled).active:focus,.btn-outline-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-secondary{color:#6c757d;border-color:#6c757d}.btn-outline-secondary:hover{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary.focus,.btn-outline-secondary:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-secondary.disabled,.btn-outline-secondary:disabled{color:#6c757d;background-color:transparent}.btn-outline-secondary:not(:disabled):not(.disabled).active,.btn-outline-secondary:not(:disabled):not(.disabled):active,.show>.btn-outline-secondary.dropdown-toggle{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary:not(:disabled):not(.disabled).active:focus,.btn-outline-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-success{color:#28a745;border-color:#28a745}.btn-outline-success:hover{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success.focus,.btn-outline-success:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-success.disabled,.btn-outline-success:disabled{color:#28a745;background-color:transparent}.btn-outline-success:not(:disabled):not(.disabled).active,.btn-outline-success:not(:disabled):not(.disabled):active,.show>.btn-outline-success.dropdown-toggle{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success:not(:disabled):not(.disabled).active:focus,.btn-outline-success:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-info{color:#17a2b8;border-color:#17a2b8}.btn-outline-info:hover{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info.focus,.btn-outline-info:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-info.disabled,.btn-outline-info:disabled{color:#17a2b8;background-color:transparent}.btn-outline-info:not(:disabled):not(.disabled).active,.btn-outline-info:not(:disabled):not(.disabled):active,.show>.btn-outline-info.dropdown-toggle{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info:not(:disabled):not(.disabled).active:focus,.btn-outline-info:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-warning{color:#ffc107;border-color:#ffc107}.btn-outline-warning:hover{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning.focus,.btn-outline-warning:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-warning.disabled,.btn-outline-warning:disabled{color:#ffc107;background-color:transparent}.btn-outline-warning:not(:disabled):not(.disabled).active,.btn-outline-warning:not(:disabled):not(.disabled):active,.show>.btn-outline-warning.dropdown-toggle{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning:not(:disabled):not(.disabled).active:focus,.btn-outline-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-danger{color:#dc3545;border-color:#dc3545}.btn-outline-danger:hover{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger.focus,.btn-outline-danger:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-danger.disabled,.btn-outline-danger:disabled{color:#dc3545;background-color:transparent}.btn-outline-danger:not(:disabled):not(.disabled).active,.btn-outline-danger:not(:disabled):not(.disabled):active,.show>.btn-outline-danger.dropdown-toggle{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger:not(:disabled):not(.disabled).active:focus,.btn-outline-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-light{color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:hover{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light.focus,.btn-outline-light:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-light.disabled,.btn-outline-light:disabled{color:#f8f9fa;background-color:transparent}.btn-outline-light:not(:disabled):not(.disabled).active,.btn-outline-light:not(:disabled):not(.disabled):active,.show>.btn-outline-light.dropdown-toggle{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:not(:disabled):not(.disabled).active:focus,.btn-outline-light:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-dark{color:#343a40;border-color:#343a40}.btn-outline-dark:hover{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark.focus,.btn-outline-dark:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-outline-dark.disabled,.btn-outline-dark:disabled{color:#343a40;background-color:transparent}.btn-outline-dark:not(:disabled):not(.disabled).active,.btn-outline-dark:not(:disabled):not(.disabled):active,.show>.btn-outline-dark.dropdown-toggle{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark:not(:disabled):not(.disabled).active:focus,.btn-outline-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-link{font-weight:400;color:#007bff;text-decoration:none}.btn-link:hover{color:#0056b3;text-decoration:underline}.btn-link.focus,.btn-link:focus{text-decoration:underline}.btn-link.disabled,.btn-link:disabled{color:#6c757d;pointer-events:none}.btn-group-lg>.btn,.btn-lg{padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}.btn-group-sm>.btn,.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.btn-group-xs>.btn,.btn-xs{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn{display:inline-block;font-weight:400;color:#212529;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:transparent;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.btn{transition:none}}.btn:hover{color:#212529;text-decoration:none}.btn.focus,.btn:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.btn.disabled,.btn:disabled{opacity:.65}.btn:not(:disabled):not(.disabled){cursor:pointer}a.btn.disabled,fieldset:disabled a.btn{pointer-events:none}.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}.btn-primary.focus,.btn-primary:focus{color:#fff;background-color:#0069d9;border-color:#0062cc;box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-primary.disabled,.btn-primary:disabled{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:not(:disabled):not(.disabled).active,.btn-primary:not(:disabled):not(.disabled):active,.show>.btn-primary.dropdown-toggle{color:#fff;background-color:#0062cc;border-color:#005cbf}.btn-primary:not(:disabled):not(.disabled).active:focus,.btn-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-secondary{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:hover{color:#fff;background-color:#5a6268;border-color:#545b62}.btn-secondary.focus,.btn-secondary:focus{color:#fff;background-color:#5a6268;border-color:#545b62;box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-secondary.disabled,.btn-secondary:disabled{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:not(:disabled):not(.disabled).active,.btn-secondary:not(:disabled):not(.disabled):active,.show>.btn-secondary.dropdown-toggle{color:#fff;background-color:#545b62;border-color:#4e555b}.btn-secondary:not(:disabled):not(.disabled).active:focus,.btn-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-success{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:hover{color:#fff;background-color:#218838;border-color:#1e7e34}.btn-success.focus,.btn-success:focus{color:#fff;background-color:#218838;border-color:#1e7e34;box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-success.disabled,.btn-success:disabled{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:not(:disabled):not(.disabled).active,.btn-success:not(:disabled):not(.disabled):active,.show>.btn-success.dropdown-toggle{color:#fff;background-color:#1e7e34;border-color:#1c7430}.btn-success:not(:disabled):not(.disabled).active:focus,.btn-success:not(:disabled):not(.disabled):active:focus,.show>.btn-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-info{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:hover{color:#fff;background-color:#138496;border-color:#117a8b}.btn-info.focus,.btn-info:focus{color:#fff;background-color:#138496;border-color:#117a8b;box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-info.disabled,.btn-info:disabled{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:not(:disabled):not(.disabled).active,.btn-info:not(:disabled):not(.disabled):active,.show>.btn-info.dropdown-toggle{color:#fff;background-color:#117a8b;border-color:#10707f}.btn-info:not(:disabled):not(.disabled).active:focus,.btn-info:not(:disabled):not(.disabled):active:focus,.show>.btn-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-warning{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:hover{color:#212529;background-color:#e0a800;border-color:#d39e00}.btn-warning.focus,.btn-warning:focus{color:#212529;background-color:#e0a800;border-color:#d39e00;box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-warning.disabled,.btn-warning:disabled{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:not(:disabled):not(.disabled).active,.btn-warning:not(:disabled):not(.disabled):active,.show>.btn-warning.dropdown-toggle{color:#212529;background-color:#d39e00;border-color:#c69500}.btn-warning:not(:disabled):not(.disabled).active:focus,.btn-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-danger{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:hover{color:#fff;background-color:#c82333;border-color:#bd2130}.btn-danger.focus,.btn-danger:focus{color:#fff;background-color:#c82333;border-color:#bd2130;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-danger.disabled,.btn-danger:disabled{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:not(:disabled):not(.disabled).active,.btn-danger:not(:disabled):not(.disabled):active,.show>.btn-danger.dropdown-toggle{color:#fff;background-color:#bd2130;border-color:#b21f2d}.btn-danger:not(:disabled):not(.disabled).active:focus,.btn-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-light{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:hover{color:#212529;background-color:#e2e6ea;border-color:#dae0e5}.btn-light.focus,.btn-light:focus{color:#212529;background-color:#e2e6ea;border-color:#dae0e5;box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-light.disabled,.btn-light:disabled{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:not(:disabled):not(.disabled).active,.btn-light:not(:disabled):not(.disabled):active,.show>.btn-light.dropdown-toggle{color:#212529;background-color:#dae0e5;border-color:#d3d9df}.btn-light:not(:disabled):not(.disabled).active:focus,.btn-light:not(:disabled):not(.disabled):active:focus,.show>.btn-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-dark{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:hover{color:#fff;background-color:#23272b;border-color:#1d2124}.btn-dark.focus,.btn-dark:focus{color:#fff;background-color:#23272b;border-color:#1d2124;box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-dark.disabled,.btn-dark:disabled{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:not(:disabled):not(.disabled).active,.btn-dark:not(:disabled):not(.disabled):active,.show>.btn-dark.dropdown-toggle{color:#fff;background-color:#1d2124;border-color:#171a1d}.btn-dark:not(:disabled):not(.disabled).active:focus,.btn-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-outline-primary{color:#007bff;border-color:#007bff}.btn-outline-primary:hover{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary.focus,.btn-outline-primary:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-primary.disabled,.btn-outline-primary:disabled{color:#007bff;background-color:transparent}.btn-outline-primary:not(:disabled):not(.disabled).active,.btn-outline-primary:not(:disabled):not(.disabled):active,.show>.btn-outline-primary.dropdown-toggle{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary:not(:disabled):not(.disabled).active:focus,.btn-outline-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-secondary{color:#6c757d;border-color:#6c757d}.btn-outline-secondary:hover{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary.focus,.btn-outline-secondary:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-secondary.disabled,.btn-outline-secondary:disabled{color:#6c757d;background-color:transparent}.btn-outline-secondary:not(:disabled):not(.disabled).active,.btn-outline-secondary:not(:disabled):not(.disabled):active,.show>.btn-outline-secondary.dropdown-toggle{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary:not(:disabled):not(.disabled).active:focus,.btn-outline-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-success{color:#28a745;border-color:#28a745}.btn-outline-success:hover{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success.focus,.btn-outline-success:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-success.disabled,.btn-outline-success:disabled{color:#28a745;background-color:transparent}.btn-outline-success:not(:disabled):not(.disabled).active,.btn-outline-success:not(:disabled):not(.disabled):active,.show>.btn-outline-success.dropdown-toggle{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success:not(:disabled):not(.disabled).active:focus,.btn-outline-success:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-info{color:#17a2b8;border-color:#17a2b8}.btn-outline-info:hover{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info.focus,.btn-outline-info:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-info.disabled,.btn-outline-info:disabled{color:#17a2b8;background-color:transparent}.btn-outline-info:not(:disabled):not(.disabled).active,.btn-outline-info:not(:disabled):not(.disabled):active,.show>.btn-outline-info.dropdown-toggle{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info:not(:disabled):not(.disabled).active:focus,.btn-outline-info:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-warning{color:#ffc107;border-color:#ffc107}.btn-outline-warning:hover{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning.focus,.btn-outline-warning:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-warning.disabled,.btn-outline-warning:disabled{color:#ffc107;background-color:transparent}.btn-outline-warning:not(:disabled):not(.disabled).active,.btn-outline-warning:not(:disabled):not(.disabled):active,.show>.btn-outline-warning.dropdown-toggle{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning:not(:disabled):not(.disabled).active:focus,.btn-outline-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-danger{color:#dc3545;border-color:#dc3545}.btn-outline-danger:hover{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger.focus,.btn-outline-danger:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-danger.disabled,.btn-outline-danger:disabled{color:#dc3545;background-color:transparent}.btn-outline-danger:not(:disabled):not(.disabled).active,.btn-outline-danger:not(:disabled):not(.disabled):active,.show>.btn-outline-danger.dropdown-toggle{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger:not(:disabled):not(.disabled).active:focus,.btn-outline-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-light{color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:hover{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light.focus,.btn-outline-light:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-light.disabled,.btn-outline-light:disabled{color:#f8f9fa;background-color:transparent}.btn-outline-light:not(:disabled):not(.disabled).active,.btn-outline-light:not(:disabled):not(.disabled):active,.show>.btn-outline-light.dropdown-toggle{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:not(:disabled):not(.disabled).active:focus,.btn-outline-light:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-dark{color:#343a40;border-color:#343a40}.btn-outline-dark:hover{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark.focus,.btn-outline-dark:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-outline-dark.disabled,.btn-outline-dark:disabled{color:#343a40;background-color:transparent}.btn-outline-dark:not(:disabled):not(.disabled).active,.btn-outline-dark:not(:disabled):not(.disabled):active,.show>.btn-outline-dark.dropdown-toggle{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark:not(:disabled):not(.disabled).active:focus,.btn-outline-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-link{font-weight:400;color:#007bff;text-decoration:none}.btn-link:hover{color:#0056b3;text-decoration:underline}.btn-link.focus,.btn-link:focus{text-decoration:underline}.btn-link.disabled,.btn-link:disabled{color:#6c757d;pointer-events:none}.btn-group-lg>.btn,.btn-lg{padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}.btn-group-sm>.btn,.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.btn-block{display:block;width:100%}.btn-group-xs>.btn,.btn-xs{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.navbar-btn.btn-xs{margin-top:14px;margin-bottom:14px}.btn-group-xs>.btn .badge,.btn-xs .badge{top:0;padding:1px 5px}</style>`
    )

    function fond_size(font_size) {
        $(
            ".StudySummaryItem_content__3j9YG > div > div >span:nth-child(3),.BayTrans_paraphrase__2JMIz,.CollinsTrans_pos__3szum,.CollinsTrans_paraphraseList__3SZ3y > li > span:nth-child(3),.index_name__1gkfJ"
        ).css({
            "font-size": font_size + `px`,
            "font-weight": "bold",
        })

        // 扇贝单词添加序号
        var ptotal = $(".BayTrans_paraphrase__2JMIz > p")
        // console.log(ptotal)
        let index = 1
        for (let s of ptotal) {
            // console.log("s",$(s))
            $(s).children().first().before("<span style='font-weight:normal;font-size:15px'>" + index +
                ".&nbsp</span>")
            // s.before("<span style='font-weight:normal;font-size:15px'>" + var1 + ".</span>")
            index++
        }

        ptotal.css({
            "margin-top": "6px"
        })

    }



    // 设置字体大小
    let util = {
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
    };

    let main = {
        /**
         * 配置默认值
         */
        initValue() {
            let value = [{
                name: 'current_val',
                value: 15
            }, {
                name: 'has_init',
                value: false
            }];

            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },

        showSetting() {
            Swal.fire({
                title: '请选择字体大小',
                icon: 'info',
                input: 'range',
                showCancelButton: true,
                confirmButtonText: '保存',
                cancelButtonText: '还原',
                showCloseButton: true,
                inputLabel: '拖动滑块观察字体大小变化',
                inputAttributes: {
                    min: 15,
                    max: 25,
                    step: 0.1
                },
                footer: '<div><div style="text-align: center;">可点击 <svg style="margin: 0 5px;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024"><path d="M514.2 41.4c84.5 0 168.9-.7 253.4.3 45.3.5 86.7 15.4 123.5 42.1 37.6 27.2 64.1 62.8 79.8 106.4 8.5 23.6 13 48 13 73.2 0 166.7 1.4 333.5-.6 500.2-.9 78.3-37.5 139.9-103.7 182.8-38 24.6-80 35.1-125.1 35.1-161.3-.2-322.7.7-484-.4-92.9-.6-161.5-43.8-204.2-126.5-15-29-22.2-60.5-22.2-93.2-.2-167-.8-333.9.3-500.9.4-66.8 28.2-122.4 78.9-166.3 25-21.6 53.7-36.7 85.5-44.9 17.4-4.5 35.6-7.4 53.5-7.6 84-.8 168-.3 251.9-.3zm411.3 690.2c.8-103.6-82.9-191.6-191.1-191.5-106.7.1-190.9 85.1-191.3 191.5-.3 104.8 85.7 190.7 190.2 191.3 105.9.6 192.9-86.2 192.2-191.3zM293.8 540.5c-107.7.2-186.9 85.9-191.2 181.9-5.1 114.4 87.4 200.7 191.1 200.5 102.9-.2 191.3-83 191.4-191 .1-105.9-84.3-190.9-191.3-191.4z"/></svg> 图标 -> 扇贝单词小助手 -> 字体大小设置 打开本页面</div></div>',
                inputValue: util.getValue('current_val')
            }).then((res) => {

                util.setValue('has_init', true);
                if (res.isConfirmed) {
                    font_size = util.getValue('current_val')
                    util.setValue('current_val', res.value);
                    // this.addStyle();
                    // console.log("ces")
                    fond_size(font_size)
                }
                if (res.isDismissed && res.dismiss === "cancel") {
                    util.setValue('current_val', 15);
                    font_size = util.getValue('current_val')
                    fond_size(font_size)
                    // this.addStyle();
                }
            });

            document.getElementById('swal2-input').addEventListener('change', (e) => {
                util.setValue('current_val', e.target.value);
                font_size = util.getValue('current_val')
                // this.addStyle();
                fond_size(font_size)
            })
        },

        registerMenuCommand() {
            GM_registerMenuCommand('字体大小设置', () => {
                this.showSetting();
            });
        },

        init() {
            this.initValue();
            !util.getValue('has_init') && this.showSetting();
            this.registerMenuCommand();

        }
    };
    main.init();






    // 设置通知位置
    toastr.options = {
        positionClass: "toast-center-center"
    };



    // 全屏与退出全屏====================================================

    // 根据浏览器可视区域高度与屏幕实际高度差值判断页面是否为全屏状态
    // 取值17是为了处理页面内容出现滚动条的情况
    var isFull = Math.abs(window.screen.height - window.document.documentElement.clientHeight) <= 17

    window.onresize = function() {
        isFull = Math.abs(window.screen.height - window.document.documentElement.clientHeight) <= 17
    }

    // 阻止F11键默认事件，用HTML5全屏API代替
    window.addEventListener('keydown', function(e) {
        e = e || window.event
        if (e.keyCode == 122 && !isFull) {
            e.preventDefault()
            enterFullScreen()
            document.addEventListener("webkitfullscreenchange", exitF, true);
            document.addEventListener("mozfullscreenchange", exitF, true);
        }

    })


    function exitF() {
        if (!document.webkitIsFullScreen) {
            //退出全屏后执行的代码
            $(".Nav_nav__3kyeO").show();
            $(".Nav_container__sBZA1").show();
            $(".SubNav_itemsWrapper__1mM4u").show();
            toastr.warning("退出专注模式，不要被外界干扰哟！建议开启专注模式！")
            // exitFullScreen()
        }
    }


    // 打开浏览器全屏模式
    function enterFullScreen() {
        $(".Nav_nav__3kyeO").hide();
        $(".Nav_container__sBZA1").hide();
        $(".SubNav_itemsWrapper__1mM4u").hide();
        toastr.success("进入专注模式，更专注于背单词！")
        let el = document.documentElement
        let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el
            .msRequestFullscreen
        if (rfs) { // typeof rfs != "undefined" && rfs
            rfs.call(el)
        } else if (typeof window.ActiveXObject !== 'undefined') {
            // for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
            let wscript = new ActiveXObject('WScript.Shell')
            if (wscript != null) {
                wscript.SendKeys('{F11}')
            }
        }
    }

    // 退出全屏
    function exitFullScreen() {
        $(".Nav_nav__3kyeO").show();
        $(".Nav_container__sBZA1").show();
        $(".SubNav_itemsWrapper__1mM4u").show();
        toastr.warning("退出专注模式，不要被外界干扰哟！建议开启专注模式！")
        let el = document
        let cfs = el.cancelFullScreen || el.mozCancelFullScreen || el.msExitFullscreen || el.webkitExitFullscreen ||
            el.exitFullscreen
        if (cfs) { // typeof cfs != "undefined" && cfs
            cfs.call(el)
        } else if (typeof window.ActiveXObject !== 'undefined') {
            // for IE，这里和fullScreen相同，模拟按下F11键退出全屏
            let wscript = new ActiveXObject('WScript.Shell')
            if (wscript != null) {
                wscript.SendKeys('{F11}')
            }
        }
    }
    // ===================================================================


    // 键盘监听========
    $(document).keydown(function(event, repeat) {
        if (repeat) return
        // 数字键3，o ，US发音
        if (event.keyCode == 99 || event.keyCode == 51 || event.keyCode == 79) {
            $(".index_trump__3bTaM:last").click()
            $(".Pronounce_audio__3xdMh:last").click()
            $(".index_audio__3qoB9:first").click()
            $(".index_trump__2A682:first").click()
            $(".Pronounce_audio__1XmDO:first").click()
        }
        // 数字键4，i，UK发音
        if (event.keyCode == 100 || event.keyCode == 52 || event.keyCode == 73) {
            $(".index_trump__3bTaM:first").click()
            $(".Pronounce_audio__3xdMh:first").click()
            $(".index_audio__3qoB9:last").click()
            $(".Pronounce_audio__1XmDO:last").click()
        }
        // 数字5，u,用于切换扇贝单词与柯林斯词典
        if (event.keyCode == 101 || event.keyCode == 53 || event.keyCode == 85) {
            var msg = $(".index_tab__37Cha.index_active__1bHoy").html()
            if (msg == $(".index_tabNavs__3tWev:eq(0) > p:eq(0)").html()) {
                flag = true;
            } else {
                flag = false;
            }


            if (!flag) {
                $(".index_tabNavs__3tWev:eq(0) > p:eq(0)").click()
                flag = !flag;
                // console.log($(".index_tab__37Cha").html())
                // $(".index_tab__37Cha").trigger("click");
            } else {
                // console.log($(".index_tab__37Cha.index_active__1bHoy").html())
                // $(".index_tab__37Cha.index_active__1bHoy").trigger("click");
                $(".index_tabNavs__3tWev:eq(0) > p:eq(1)").click()
                flag = !flag;
            }
        }

        // 数字键盘6，f,例句发音，将f键改为t键（f键与扇贝原有的快捷键冲突）
        if (event.keyCode == 102 || event.keyCode == 54 || event.keyCode == 84) {
            $(".index_icon__1IK2K:first").click()
            $(".index_icon__1PBqW:first").click()
        }

        // 数字键盘7，,g,真题例句发音
        if (event.keyCode == 103 || event.keyCode == 55 || event.keyCode == 71) {
            $(".index_audio__1mSVg:first > img").click()
        }

        // 数字键盘8，h,例句翻译显示与隐藏
        if (event.keyCode == 104 || event.keyCode == 56 || event.keyCode == 72) {
            $(".btn.btn-primary.index_exampleEN__Ezss_").next().toggle()
        }


        // 数字键盘0，v，隐藏展示柯林斯词典中的英文
        if (event.keyCode == 96 || event.keyCode == 48 || event.keyCode == 86) {
            if (GM_getValue('check5') == 1) {
                // $(".CollinsTrans_senseEn__17oYf").toggle()
                $(".btn.btn-link.btn-xs").prev().prev().toggle()
            } else if (GM_getValue('check5') == 2) {
                // $(".CollinsTrans_senseEn__17oYf").next().toggle()
                $(".btn.btn-link.btn-xs").prev().toggle()
            }
        }

        // 键盘k，相当于2
        if (event.keyCode == 75) {
            // console.log("k按下")
            $(".index_option__1CVr2.index_red__VSPTN").click()
            // 撤销
            // $(".Message_message__w-TNe.alert.middle > div > span").click()
        }
        // 键盘j，相当于1
        if (event.keyCode == 74) {
            // console.log("j按下")
            $(".index_option__1CVr2.index_green__2lFgU").click()
        }

        // 键盘L
        if (event.keyCode == 76) {
            // console.log("l按下")
            $(".StudyPage_nextBtn__1ygGn").click()
        }


        // 键盘回车 拼写模式下点击查看正确答案，继续
        if (event.keyCode == 13) {
            // console.log("enter弹起")
            // console.log($(".index_tenseAnswer__2o47S").length)
            if ($(".index_tenseAnswer__2o47S").length != 0) {
                $(".index_tenseAnswer__2o47S").click()
            } else {
                $(".index_continueBtn__34NqT").click()
            }

        }

    });



    // 显示托盘==============================================
    const html =
        `<div class='onediv'>
        <div style="right:0px;text-align:right;">
        <a title="点我最小化或者还原" class="onea" href="javascript:void(0);">最小化/还原</a>
        </div>
        <div id="showorhide">
        <button type="button" class="btn btn-primary btn-sm" id="open">开启专注模式</button><br/>
        <button type="button" class="btn btn-warning btn-sm" id="close">关闭专注模式</button><br/>
        <button type="button" class="btn btn-info btn-sm" id="change">主题切换</button>
        <div>快捷键提示<br/>
        <!--<input id="oneinput" type="checkbox"/><label for="oneinput">是否默认隐藏柯林斯词典中的英文</label><br/>-->
        <input type="radio" name="selectksl" value="0" checked="checked" id="mr"><label for="mr">柯林斯词典默认显示</label><br>
        <input type="radio" name="selectksl" value="1" id="yw"><label for="yw">隐藏柯林斯词典中的英文</label><br>
        <input type="radio" name="selectksl" value="2" id="zw"><label for="zw">隐藏柯林斯词典中的中文</label><br>
        <input id="twoinput" type="checkbox"/><label for="twoinput">是否默认隐藏例句中的翻译</label><br>
        <input id="threeinput" type="checkbox"/><label for="threeinput">是否开启柯林斯例句自动发音</label><br>
        <input id="fourinput" type="checkbox"/><label for="fourinput">是否开启自动展开共享笔记</label><br>
        J/1：选择1<br>
        K/2：选择2<br>
        O/3：US发音<br>
        I/4：UK发音<br>
        U/5：扇贝与柯林斯切换<br>
        T/6：例句发音<br>
        G/7：真题例句发音<br>
        H/8：例句翻译显示与隐藏<br>
        L/. ：下一个<br>
        V/0：隐藏展示柯林斯词典中的中/英文<br>
        Enter：拼写模式下查看正确答案/继续</div>
        <div style="text-align: center;">可点击 <svg style="margin: 0 5px;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 1024 1024"><path d="M514.2 41.4c84.5 0 168.9-.7 253.4.3 45.3.5 86.7 15.4 123.5 42.1 37.6 27.2 64.1 62.8 79.8 106.4 8.5 23.6 13 48 13 73.2 0 166.7 1.4 333.5-.6 500.2-.9 78.3-37.5 139.9-103.7 182.8-38 24.6-80 35.1-125.1 35.1-161.3-.2-322.7.7-484-.4-92.9-.6-161.5-43.8-204.2-126.5-15-29-22.2-60.5-22.2-93.2-.2-167-.8-333.9.3-500.9.4-66.8 28.2-122.4 78.9-166.3 25-21.6 53.7-36.7 85.5-44.9 17.4-4.5 35.6-7.4 53.5-7.6 84-.8 168-.3 251.9-.3zm411.3 690.2c.8-103.6-82.9-191.6-191.1-191.5-106.7.1-190.9 85.1-191.3 191.5-.3 104.8 85.7 190.7 190.2 191.3 105.9.6 192.9-86.2 192.2-191.3zM293.8 540.5c-107.7.2-186.9 85.9-191.2 181.9-5.1 114.4 87.4 200.7 191.1 200.5 102.9-.2 191.3-83 191.4-191 .1-105.9-84.3-190.9-191.3-191.4z"/></svg> 图标->扇贝单词小助手->字体大小设置<br><a  href="https://docs.qq.com/doc/DRWZhd0lIT2Rua0hQ" class="onea" target="_blank" title="点我查看更新日志与使用说明">更新日志与使用说明</div></div>
        </div>`

    var node = document.createElement('div');
    node.innerHTML = html;
    document.body.appendChild(node);


    // 显示翻译托盘==============================================
    const html2 =
        `<div id="app" class="twodiv">
			
			<el-card class="box-card">
				
			  <div slot="header" class="clearfix">
				翻译小助手
			    <el-input
			      type="textarea"
				  size="medium"
			      :rows="3"
				  :cols="1"
			      placeholder="请输入翻译内容"
			      v-model="textarea" 
				  minlength="0"
				  maxlength="30"
				  show-word-limit
				  @clear="res_clear"
				  @keydown.enter.native="textareaKeydown"
				  clearable
				  
				  >
			    </el-input>
				
			    <el-button style="float: left; padding: 3px 0" @click="res_clear" type="text">清空</el-button>
			    <el-button style="float: right; padding: 3px 0" @click="search" type="text">搜索</el-button>
			  </div>
			  <div style="font-weight:bold;text-align:left;">
					<div>
						<div v-modle="trans_result" v-if="trans_result['uk-phonetic']">
							uk&nbsp/{{trans_result["uk-phonetic"]}}/
							<img  v-if="trans_result['uk-phonetic']!=undefined" @click="palyAudio($event)" style="cursor:pointer" class='imgs' width="22" height="22" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAilBMVEUAAAApwaApvqBO3MoovqEov6Apv6Epv6Iov6EpvqEpv6Eov6EpwKErwKItxKcwxKkov6Epv6ApwKEpwKEtw6Uov6Epv6Eov6Eov6Epv6Epv6EpwKIpwKEpv6Mpw6MuwqMpvqEqwKIrwqEqwqI1yqopv6Apv6EpvqEpvqIowKEovqEov6Eov6EovqAIbtG3AAAALXRSTlMAPugD/fnCbtiftYyFNRYM9Od+VxvGZs28mHNaUjomIdVMLysI7q+odl7p3KuvvkW8AAABfElEQVRIx+3WyXaCMBiG4d9CQEaZBRQc69D2u//bKzUtLfQQSNx5fDdZPRpDQqRnD9GxXihTJwBz1Kw3x1cqWnN13NJ9aXtY4qdK9msvDG0zObtJAVWcBRjCx72YJjYwiA3YmsCuXiHAW6D4v0KmPW9aFidAhCsGmH2bo02IaQXovd9dYhz7xYWaIiDvYmMCNgG3GbQ5sOvgcAI+MCBrxh0w76z4ywRMsY7A59OcSWNyAasZYsCRx4sQ+qYZGN5lMV+zshlsYC+PfR0p/4xYHlMKXSNaA6UCtoCEyAMcBewCHlECnO/BlvK0K7Vpp2B8wUylR2XwR7VW2iQm3yT1HdtzS9LYAQp+MFxpvPo9kp7sy6BiwJVua72kv+UTsAVE/DXUu0OyCdhLo+9NdqJuH+OYdwVYTb1iy2iyI0uMZwx6TIPtwpHrJiJB/lmAc36ehHfdINZqGiux+1j2flfHtDFa7JF0Wsm4DRbyuP03ZZJSWvSGMCPlFvTsMfoEWPe4qIWR/SoAAAAASUVORK5CYII=" >
							<audio v-if="trans_result['uk-speech']!=undefined">
							  <source :src='trans_result["uk-speech"]' type="audio/mpeg">
							  您的浏览器不支持，请使用其他浏览器
							</audio>
							<br>
							us&nbsp/{{trans_result["us-phonetic"]}}/
							<img  v-if="trans_result['us-phonetic']!=undefined" @click="palyAudio($event)" style="cursor:pointer" class='imgs' width="22" height="22" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAilBMVEUAAAApwaApvqBO3MoovqEov6Apv6Epv6Iov6EpvqEpv6Eov6EpwKErwKItxKcwxKkov6Epv6ApwKEpwKEtw6Uov6Epv6Eov6Eov6Epv6Epv6EpwKIpwKEpv6Mpw6MuwqMpvqEqwKIrwqEqwqI1yqopv6Apv6EpvqEpvqIowKEovqEov6Eov6EovqAIbtG3AAAALXRSTlMAPugD/fnCbtiftYyFNRYM9Od+VxvGZs28mHNaUjomIdVMLysI7q+odl7p3KuvvkW8AAABfElEQVRIx+3WyXaCMBiG4d9CQEaZBRQc69D2u//bKzUtLfQQSNx5fDdZPRpDQqRnD9GxXihTJwBz1Kw3x1cqWnN13NJ9aXtY4qdK9msvDG0zObtJAVWcBRjCx72YJjYwiA3YmsCuXiHAW6D4v0KmPW9aFidAhCsGmH2bo02IaQXovd9dYhz7xYWaIiDvYmMCNgG3GbQ5sOvgcAI+MCBrxh0w76z4ywRMsY7A59OcSWNyAasZYsCRx4sQ+qYZGN5lMV+zshlsYC+PfR0p/4xYHlMKXSNaA6UCtoCEyAMcBewCHlECnO/BlvK0K7Vpp2B8wUylR2XwR7VW2iQm3yT1HdtzS9LYAQp+MFxpvPo9kp7sy6BiwJVua72kv+UTsAVE/DXUu0OyCdhLo+9NdqJuH+OYdwVYTb1iy2iyI0uMZwx6TIPtwpHrJiJB/lmAc36ehHfdINZqGiux+1j2flfHtDFa7JF0Wsm4DRbyuP03ZZJSWvSGMCPlFvTsMfoEWPe4qIWR/SoAAAAASUVORK5CYII=" >
							<audio v-if="trans_result['us-speech']!=undefined">
							  <source :src='trans_result["us-speech"]' type="audio/mpeg">
							  您的浏览器不支持，请使用其他浏览器
							</audio>
						</div>
					</div>
				  <span v-for="(items,index) in trans_result.explains" class="text item" >
					{{index+1}}、 {{items.slice(0,50)}}
					<span v-for="item in items.values">
						{{item}}
					</span><br>

				  </span>
				  {{msg}}
				</div>
			</el-card>
			
			
		</div>`
    var node = document.createElement('div');
    node.innerHTML = html2;
    document.body.appendChild(node);




    let vapp = new Vue({
        el: "#app",
        data() {
            return {
                trans_result: [],
                msg: '',
                textarea: '',
            }

        },
        methods: {
            palyAudio: function($event) {

                // $(event.currentTarget).next()[0].play()
                try {

                    event.currentTarget.nextElementSibling.load();
                    event.currentTarget.nextElementSibling.play();
                    // console.log(event.currentTarget.nextElementSibling)
                } catch (e) {
                    //TODO handle the exception
                }
            },

            // 取消多行文本框的回车
            textareaKeydown() {
                let e = window.event || arguments[0];
                // console.log(e,e.keyCode)
                if (e.key == 'Enter' || e.code == 'Enter' || e.keyCode == 13) {
                    e.returnValue = false;
                    vapp.search()
                    return false;
                }
            },

            res_clear() {
                // console.log("清除")
                vapp.trans_result = ''
                vapp.textarea = ""
                vapp.msg = ""
            },
            truncate(q) {
                var len = q.length;
                if (len <= 20) return q;
                return q.substring(0, 10) + len + q.substring(len - 10, len);
            },
            search() {

                // 有道翻译
                let query = vapp.textarea.trim() // 去除前后空格
                // let appKey = '1c7773d325ec6c09';
                // let key = '0J9Aurlycl0JEUO5iQ4esUhh7qUNHfe0';//注意：暴露appSecret，有被盗用造成损失的风险
                let salt = (new Date).getTime();
                let curtime = Math.round(new Date().getTime() / 1000);
                let from = 'auto';
                let to = 'auto';
                let str1 = appKey + vapp.truncate(query) + salt + curtime + key;
                let vocabId = '您的用户词表ID';
                let sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);

                let data3 =
                    "q=" + query +
                    "&appKey=" + appKey +
                    "&salt=" + salt +
                    "&from=" + from +
                    "&to=" + to +
                    "&sign=" + sign +
                    "&signType=" + "v3" +
                    "&curtime=" + curtime

                if (vapp.textarea.trim() != '') {
                    vapp.msg = ''
                    GM_xmlhttpRequest({
                        url: "https://openapi.youdao.com/api",
                        method: "post",
                        headers: {
                            'Content-type': 'application/x-www-form-urlencoded',
                            'Accept': 'application/json, text/plain, */*',
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4484.7 Safari/537.36"
                        },
                        dataType: 'jsonp',
                        // data:data2,
                        data: data3,
                        // data:JSON.stringify(data3),
                        onload: function(data) {
                            if ($.parseJSON((data.response)).basic.explains != undefined) {
                                vapp.trans_result = $.parseJSON((data.response)).basic
                            } else {
                                vapp.trans_result = ''
                                vapp.msg = $.parseJSON((data.response)).translation
                            }
                        }
                    });
                } else {
                    vapp.trans_result = ''
                    vapp.textarea = ''
                    vapp.msg = "翻译内容不能为空！"
                    setTimeout(() => {
                        vapp.msg = ""
                    }, 1500)

                }

            }
        }
    })



    $(".onea").click(() => {
        $('#showorhide').toggle("slow")
    })


    $("#open").click(() => {
        enterFullScreen()
    })
    $("#close").click(() => {
        exitFullScreen()
    })
    $("#change").click(() => {
        changeTheme()
    })


    // $("#oneinput").attr("checked", GM_getValue('check'));
    // $("#oneinput").click(() => {
    // 	GM_setValue('check', $("#oneinput").is(':checked'));
    // })


    $("#twoinput").attr("checked", GM_getValue('check2'));
    $("#twoinput").click(() => {
        GM_setValue('check2', $("#twoinput").is(':checked'));
    })


    $("#threeinput").attr("checked", GM_getValue('check3'));
    $("#threeinput").click(() => {
        GM_setValue('check3', $("#threeinput").is(':checked'));
    })

    $("#fourinput").attr("checked", GM_getValue('check4'));
    $("#fourinput").click(() => {
        GM_setValue('check4', $("#fourinput").is(':checked'));
    })

    // selectksl
    $(`input[name='selectksl'][value=${GM_getValue('check5')}]`).attr("checked", true);
    $("input[name='selectksl']").click((params) => {
        // console.log($("input[name='selectksl']:checked").val())
        GM_setValue('check5', $("input[name='selectksl']:checked").val());
    })

    // ==========================================================





    // 主题切换==================================================================================================
    let theme = "light";
    /**
     * 添加暗色主题
     */
    function addDarkTheme() {
        const style = document.createElement("style");
        style.id = "theme-css-dark"; // 加上id方便后面好查找到进行删除
        style.innerHTML =
            `  html{filter: invert(100%) hue-rotate(180deg);scrollbar-width: none;} ::-webkit-scrollbar{display:none} img,video {filter: invert(100%) hue-rotate(180deg);}`;
        document.querySelector("head").appendChild(style);
    }
    /**
     * 移除暗色主题
     */
    function removeDarkTheme() {
        document.querySelector("#theme-css-dark").remove();
    }
    /**
     * 切换主题
     */
    const changeTheme = () => {
        if (theme === "light") {
            addDarkTheme();
            theme = "dark";
        } else {
            removeDarkTheme();
            theme = "light";
        }
    };
    // ==============================================================================




    // 两个定时器============================================
    var t = setInterval(() => {
        //index_button__9uno8
        if ($(".index_button__9uno8 > span").html() == '开始学习' || $(".index_button__9uno8 > span").html() ==
            '继续学习') {
            clearInterval(t)
            $(".index_button__9uno8").click(() => {
                enterFullScreen()
            })
        }

    }, 800)
    var t3 = setInterval(() => {
        if ($(".StudyDone_checkinBtn__3DuXc").html() == '打卡') {
            clearInterval(t3)
            $(".StudyDone_checkinBtn__3DuXc").click(() => {
                exitFullScreen()
            })
        }
    }, 1000)

    // 展开共享笔记函数
    function show_note(tip) {
        if (tip != undefined && tip.indexOf("展开") > -1) {
            // console.log("123")
            $(".index_unfold__3BwCB > span").click()
            return
        } else {
            tip = $(".index_unfold__3BwCB > span").html()
            // setTimeout(()=>{
            show_note(tip)
            // },100)
        }
    }






    // 用于实时监听DOM================================
    function addBr() {
        let mutationObserver = new MutationObserver(function(mutations) {
            // console.log(mutations);
            // mutations.forEach(function(mutation) {
            // $(".index_icon__1IK2K").after("<h6>数字键6发音</h6>")
            // $(".index_audio__1mSVg:first").after("<h6>数字键7发音</h6>")
            // $(".index_trump__3bTaM:first").after("<h6>数字键4:UK发音</h6>")
            // $(".Pronounce_audio__3xdMh:first").after("<h6>数字键4:UK发音</h6>")
            // $(".index_trump__3bTaM:last").after("<h6>数字键3:US发音</h6>")
            // $(".Pronounce_audio__3xdMh:last").after("<h6>数字键3:US发音</h6>")

            font_size = util.getValue('current_val')
            $(".index_exampleEN__3OIEA,.index_sentenceEn__1Qjgx").after(
                "<button class='btn btn-primary btn-xs'>显示/隐藏翻译</button>")
            // 隐藏例句中的中文
            if (GM_getValue('check2')) {
                $(".btn.btn-primary.btn-xs").next().hide()
            }

            $(".btn.btn-primary.btn-xs").click((event) => {
                var $target = $(event.target);
                $target.next().toggle()
            })

            // 
            // if(GM_getValue('check')){


            $(".CollinsTrans_paraphraseList__3SZ3y > li > span:nth-child(3),.StudySummaryItem_content__3j9YG > div > div >span:nth-child(3)")
                .after(
                    "&nbsp&nbsp<button class='btn btn-link btn-xs' href='javascript:void(0);'>显示/隐藏</button>"
                    )
            // }
            $(".btn.btn-link.btn-xs").click((event) => {
                // 取消冒泡事件
                if (event.stopPropagation()) {
                    event.stopPropagation()
                } else {
                    event.cancelBubble = true // 兼容ie浏览器
                }

                var $target = $(event.target);
                if (GM_getValue('check5') == 1) {
                    $target.prev().prev().toggle()
                } else if (GM_getValue('check5') == 2) {
                    $target.prev().toggle()
                }

            })


            $(
                ".BayTrans_paraphrase__2JMIz > p"
            ).css({
                "font-size": `inherit`,

            })

            // 加粗解释
            fond_size(font_size)



            // $(".CollinsTrans_senseEn__17oYf").after("<br/>")
            // $(".CollinsTrans_senseEn__17oYf").hide()
            // $(".CollinsTrans_paraphraseList__3SZ3y > li > span:nth-child(3)").after($(".CollinsTrans_senseEn__17oYf").html())
            // 隐藏柯林斯词典中的英文
            // if (GM_getValue('check')) {
            // 	$(".CollinsTrans_senseEn__17oYf").hide()
            // }
            // 隐藏柯林斯词典中的英文,中文
            let getDiv = $(".StudySummaryItem_content__3j9YG > div > div");
            if (GM_getValue('check5') == 1) {
                $(".CollinsTrans_senseEn__17oYf").hide()
                $(".StudySummaryItem_content__3j9YG > div > div >span:nth-child(2)").hide()
            } else if (GM_getValue('check5') == 2) {
                $(".CollinsTrans_senseEn__17oYf").next().hide()
                $(".StudySummaryItem_content__3j9YG > div > div >span:nth-child(3)").hide()
            }


            // 柯林斯词典例句自动发音
            if (GM_getValue('check3')) {
                var msg2 = $(".index_tab__37Cha.index_active__1bHoy").html()
                if (msg2 == $(".index_tabNavs__3tWev:eq(0) > p:eq(1)").html()) {
                    flag2 = true;
                } else {
                    flag2 = false;
                }
                if (flag2) {
                    $(".index_audio__1mSVg:first > img").click()
                }
            }

            // 如果智慧词根过期提示，直接关闭
            $(".AppletTip_close__2lEIB").click()


            // 展开笔记
            function listenOne(tip) {
                let mutationObserver = new MutationObserver(function(mutations) {
                    
                    show_note(tip)
                });
                mutationObserver.observe($('.span12.block-center > div > div:last > div:last').get(0), {
                    childList: true
                    // subtree: true
                });
            }


            if (GM_getValue('check4')) {
                tip = $(".index_unfold__3BwCB > span").html()
                try {
                    listenOne(tip)
                } catch (e) {}

            }

            // });
        });
        // mutationObserver.observe($('.span12.block-center').get(0), {
        mutationObserver.observe($('.StudyPage_studyPage__1Ri5C > div').get(0), {
            childList: true
            // subtree: true
        });
        // mutationObserver.disconnect()
    }

    try {
        listenOne()
    } catch (e) {
        //TODO handle the exception
    }
    // 用于实时监听DOM，用这个监听器，去调用另一个监听器
    function listenOne() {
        let mutationObserver = new MutationObserver(function(mutations) {
            // console.log(mutations);
            // mutations.forEach(function(mutation) {

            // clearInterval(show_note_time)


            // 另一个监听器
            try {
                addBr()
            } catch (e) {
                //TODO handle the exception
            }

            // $(".index_trump__3bTaM:first").after("<h6>数字键4:UK发音</h6>")
            // $(".index_trump__3bTaM:last").after("<h6>数字键3:US发音</h6>")
            // clearInterval(show_note_time)
            // });

        });
        mutationObserver.observe($('.Layout_main__2_zw8').get(0), {
            childList: true
            // subtree: true
        });
    }



    function _click_hide_show(event) {
        var $target = $(event.target);
        // console.log($target)
    }


    update()
    // upate
    function update() {
        GM_xmlhttpRequest({
            url: updateURL,
            method: "get",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4484.7 Safari/537.36'
            },
            onload: function(data) {
                // console.log(data)
                const newversion = $(data.response).find('.install-link').attr("data-script-version");
                // console.log(data.status)
                if (data.status == 200) {
                    if (version != newversion) {
                        Swal.fire({
                            icon: 'info',
                            title: '检测到新版本',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            html: `当前《${scriptname}》不是最新版本<br/>当前版本：${version}<br/><p style="color:red">最新版本：${newversion}</p><p style="color:blue">更新日志请查看：<a class="onea" target="_blank" href = "https://docs.qq.com/doc/DRWZhd0lIT2Rua0hQ">更新日志与使用说明</a></p>`,
                            footer: "保持最新版本，更好的体验",
                            confirmButtonText: '更新'
                        }).then((result) => {
                            if (result.value) {
                                window.open("https://greasyfork.org/" + $(data.response).find(
                                    '.install-link').attr("href"), "_self");
                                setTimeout(() => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: '提示',
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        html: "更新后，请点击刷新",
                                        footer: "点击刷新，加载最新版本",
                                        confirmButtonText: '刷新'
                                    }).then((result) => {
                                        if (result.value) {
                                            // GM_openInTab("https://greasyfork.org/"+$(data.response).find('.install-link').attr("href"),{active: true});
                                            window.location.reload();
                                        }
                                    });
                                }, 500)

                            }
                        });
                    }

                } else {
                    console.log("网络错误,错误码：" + data.status)
                }

            },

        });
    }





})();
