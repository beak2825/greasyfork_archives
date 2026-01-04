// ==UserScript==
// @name         扇贝单词助手
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  喝水不忘挖井人，本插件是在扇贝单词小助手基础上二次开发。
// @author       q1982069904
// @match        https://web.shanbay.com/wordsweb/*
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      greasyfork.org
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.1/index.min.js
// @grant        unsafeWindow
// @license      q1982069904
// @downloadURL https://update.greasyfork.org/scripts/454444/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454444/%E6%89%87%E8%B4%9D%E5%8D%95%E8%AF%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {

    // 定义变量
    var flag; // 用于数字5切换词典
    var flag2; // 用于柯林斯词典真题例句发音
    //const version = 1.8; // 脚本当前版本
    const version = GM_info.script.version;
    const updateURL = GM_info.script.homepage; // url
    const scriptname = GM_info.script.name;
    var tip; // 展开笔记标识


    var xhflag = -1 //循环flag
    var xfisplay = false
    var xhmutationObserver

    $(document.head).append(
        `<link href="https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.1/theme-chalk/index.min.css" rel="stylesheet">
        <style>
        .mr-2{margin-right: 2px}
        .onediv{z-index: 999;width:240px;position:fixed;bottom:10px;left:10px;text-align:center; }
        .twodiv{z-index: 998;right:0px;;width:400px;position:fixed;bottom:10px;}
        .toast-center-center{top: 50%;left: 50%;margin-top: -30px; margin-left: -150px;}
        .onediv  .bbtn {width: 100%; margin-bottom: 10px; margin-left: 0}
        .xz{animation:fadenum 3s infinite;}@keyframes fadenum{100%{transform:rotate(360deg);}}

        @media (max-width: 768px){
     .Layout_main__2_zw8{
       width: 100% !important;
    }
    .index_center___r_K_{
    width: 100% !important;
    }
    .index_option__1CVr2{
    width: 100% !important;
    }
    .Nav_nav__3kyeO .Nav_container__sBZA1{
    width: 100% !important;
    flex-wrap: wrap;
    }
    .SubNav_subnav__1HR8R .SubNav_container__1zXeP{
    width: 100% !important;
    }
    .StudyPage_studyPage__1Ri5C{
    width: 100% !important;
    }
    .VocabPronounce_vcoabPronounce__2D0UH{
    flex-direction: column;
    flex-wrap: wrap;
    }
    .span9, .span12{
    width: 100% !important;
    }


}



        }

        </style>`
    )

    // bootstrap按钮样式
    $(document.head).append(
        `<style>.btn{display:inline-block;font-weight:400;color:#212529;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:transparent;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.btn{transition:none}}.btn:hover{color:#212529;text-decoration:none}.btn.focus,.btn:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.btn.disabled,.btn:disabled{opacity:.65}.btn:not(:disabled):not(.disabled){cursor:pointer}a.btn.disabled,fieldset:disabled a.btn{pointer-events:none}.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}.btn-primary.focus,.btn-primary:focus{color:#fff;background-color:#0069d9;border-color:#0062cc;box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-primary.disabled,.btn-primary:disabled{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:not(:disabled):not(.disabled).active,.btn-primary:not(:disabled):not(.disabled):active,.show>.btn-primary.dropdown-toggle{color:#fff;background-color:#0062cc;border-color:#005cbf}.btn-primary:not(:disabled):not(.disabled).active:focus,.btn-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-secondary{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:hover{color:#fff;background-color:#5a6268;border-color:#545b62}.btn-secondary.focus,.btn-secondary:focus{color:#fff;background-color:#5a6268;border-color:#545b62;box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-secondary.disabled,.btn-secondary:disabled{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:not(:disabled):not(.disabled).active,.btn-secondary:not(:disabled):not(.disabled):active,.show>.btn-secondary.dropdown-toggle{color:#fff;background-color:#545b62;border-color:#4e555b}.btn-secondary:not(:disabled):not(.disabled).active:focus,.btn-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-success{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:hover{color:#fff;background-color:#218838;border-color:#1e7e34}.btn-success.focus,.btn-success:focus{color:#fff;background-color:#218838;border-color:#1e7e34;box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-success.disabled,.btn-success:disabled{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:not(:disabled):not(.disabled).active,.btn-success:not(:disabled):not(.disabled):active,.show>.btn-success.dropdown-toggle{color:#fff;background-color:#1e7e34;border-color:#1c7430}.btn-success:not(:disabled):not(.disabled).active:focus,.btn-success:not(:disabled):not(.disabled):active:focus,.show>.btn-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-info{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:hover{color:#fff;background-color:#138496;border-color:#117a8b}.btn-info.focus,.btn-info:focus{color:#fff;background-color:#138496;border-color:#117a8b;box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-info.disabled,.btn-info:disabled{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:not(:disabled):not(.disabled).active,.btn-info:not(:disabled):not(.disabled):active,.show>.btn-info.dropdown-toggle{color:#fff;background-color:#117a8b;border-color:#10707f}.btn-info:not(:disabled):not(.disabled).active:focus,.btn-info:not(:disabled):not(.disabled):active:focus,.show>.btn-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-warning{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:hover{color:#212529;background-color:#e0a800;border-color:#d39e00}.btn-warning.focus,.btn-warning:focus{color:#212529;background-color:#e0a800;border-color:#d39e00;box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-warning.disabled,.btn-warning:disabled{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:not(:disabled):not(.disabled).active,.btn-warning:not(:disabled):not(.disabled):active,.show>.btn-warning.dropdown-toggle{color:#212529;background-color:#d39e00;border-color:#c69500}.btn-warning:not(:disabled):not(.disabled).active:focus,.btn-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-danger{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:hover{color:#fff;background-color:#c82333;border-color:#bd2130}.btn-danger.focus,.btn-danger:focus{color:#fff;background-color:#c82333;border-color:#bd2130;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-danger.disabled,.btn-danger:disabled{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:not(:disabled):not(.disabled).active,.btn-danger:not(:disabled):not(.disabled):active,.show>.btn-danger.dropdown-toggle{color:#fff;background-color:#bd2130;border-color:#b21f2d}.btn-danger:not(:disabled):not(.disabled).active:focus,.btn-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-light{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:hover{color:#212529;background-color:#e2e6ea;border-color:#dae0e5}.btn-light.focus,.btn-light:focus{color:#212529;background-color:#e2e6ea;border-color:#dae0e5;box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-light.disabled,.btn-light:disabled{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:not(:disabled):not(.disabled).active,.btn-light:not(:disabled):not(.disabled):active,.show>.btn-light.dropdown-toggle{color:#212529;background-color:#dae0e5;border-color:#d3d9df}.btn-light:not(:disabled):not(.disabled).active:focus,.btn-light:not(:disabled):not(.disabled):active:focus,.show>.btn-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-dark{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:hover{color:#fff;background-color:#23272b;border-color:#1d2124}.btn-dark.focus,.btn-dark:focus{color:#fff;background-color:#23272b;border-color:#1d2124;box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-dark.disabled,.btn-dark:disabled{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:not(:disabled):not(.disabled).active,.btn-dark:not(:disabled):not(.disabled):active,.show>.btn-dark.dropdown-toggle{color:#fff;background-color:#1d2124;border-color:#171a1d}.btn-dark:not(:disabled):not(.disabled).active:focus,.btn-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-outline-primary{color:#007bff;border-color:#007bff}.btn-outline-primary:hover{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary.focus,.btn-outline-primary:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-primary.disabled,.btn-outline-primary:disabled{color:#007bff;background-color:transparent}.btn-outline-primary:not(:disabled):not(.disabled).active,.btn-outline-primary:not(:disabled):not(.disabled):active,.show>.btn-outline-primary.dropdown-toggle{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary:not(:disabled):not(.disabled).active:focus,.btn-outline-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-secondary{color:#6c757d;border-color:#6c757d}.btn-outline-secondary:hover{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary.focus,.btn-outline-secondary:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-secondary.disabled,.btn-outline-secondary:disabled{color:#6c757d;background-color:transparent}.btn-outline-secondary:not(:disabled):not(.disabled).active,.btn-outline-secondary:not(:disabled):not(.disabled):active,.show>.btn-outline-secondary.dropdown-toggle{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary:not(:disabled):not(.disabled).active:focus,.btn-outline-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-success{color:#28a745;border-color:#28a745}.btn-outline-success:hover{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success.focus,.btn-outline-success:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-success.disabled,.btn-outline-success:disabled{color:#28a745;background-color:transparent}.btn-outline-success:not(:disabled):not(.disabled).active,.btn-outline-success:not(:disabled):not(.disabled):active,.show>.btn-outline-success.dropdown-toggle{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success:not(:disabled):not(.disabled).active:focus,.btn-outline-success:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-info{color:#17a2b8;border-color:#17a2b8}.btn-outline-info:hover{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info.focus,.btn-outline-info:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-info.disabled,.btn-outline-info:disabled{color:#17a2b8;background-color:transparent}.btn-outline-info:not(:disabled):not(.disabled).active,.btn-outline-info:not(:disabled):not(.disabled):active,.show>.btn-outline-info.dropdown-toggle{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info:not(:disabled):not(.disabled).active:focus,.btn-outline-info:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-warning{color:#ffc107;border-color:#ffc107}.btn-outline-warning:hover{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning.focus,.btn-outline-warning:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-warning.disabled,.btn-outline-warning:disabled{color:#ffc107;background-color:transparent}.btn-outline-warning:not(:disabled):not(.disabled).active,.btn-outline-warning:not(:disabled):not(.disabled):active,.show>.btn-outline-warning.dropdown-toggle{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning:not(:disabled):not(.disabled).active:focus,.btn-outline-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-danger{color:#dc3545;border-color:#dc3545}.btn-outline-danger:hover{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger.focus,.btn-outline-danger:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-danger.disabled,.btn-outline-danger:disabled{color:#dc3545;background-color:transparent}.btn-outline-danger:not(:disabled):not(.disabled).active,.btn-outline-danger:not(:disabled):not(.disabled):active,.show>.btn-outline-danger.dropdown-toggle{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger:not(:disabled):not(.disabled).active:focus,.btn-outline-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-light{color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:hover{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light.focus,.btn-outline-light:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-light.disabled,.btn-outline-light:disabled{color:#f8f9fa;background-color:transparent}.btn-outline-light:not(:disabled):not(.disabled).active,.btn-outline-light:not(:disabled):not(.disabled):active,.show>.btn-outline-light.dropdown-toggle{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:not(:disabled):not(.disabled).active:focus,.btn-outline-light:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-dark{color:#343a40;border-color:#343a40}.btn-outline-dark:hover{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark.focus,.btn-outline-dark:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-outline-dark.disabled,.btn-outline-dark:disabled{color:#343a40;background-color:transparent}.btn-outline-dark:not(:disabled):not(.disabled).active,.btn-outline-dark:not(:disabled):not(.disabled):active,.show>.btn-outline-dark.dropdown-toggle{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark:not(:disabled):not(.disabled).active:focus,.btn-outline-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-link{font-weight:400;color:#007bff;text-decoration:none}.btn-link:hover{color:#0056b3;text-decoration:underline}.btn-link.focus,.btn-link:focus{text-decoration:underline}.btn-link.disabled,.btn-link:disabled{color:#6c757d;pointer-events:none}.btn-group-lg>.btn,.btn-lg{padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}.btn-group-sm>.btn,.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.btn-group-xs>.btn,.btn-xs{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn{display:inline-block;font-weight:400;color:#212529;text-align:center;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-color:transparent;border:1px solid transparent;padding:.375rem .75rem;font-size:1rem;line-height:1.5;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.btn{transition:none}}.btn:hover{color:#212529;text-decoration:none}.btn.focus,.btn:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.25)}.btn.disabled,.btn:disabled{opacity:.65}.btn:not(:disabled):not(.disabled){cursor:pointer}a.btn.disabled,fieldset:disabled a.btn{pointer-events:none}.btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}.btn-primary.focus,.btn-primary:focus{color:#fff;background-color:#0069d9;border-color:#0062cc;box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-primary.disabled,.btn-primary:disabled{color:#fff;background-color:#007bff;border-color:#007bff}.btn-primary:not(:disabled):not(.disabled).active,.btn-primary:not(:disabled):not(.disabled):active,.show>.btn-primary.dropdown-toggle{color:#fff;background-color:#0062cc;border-color:#005cbf}.btn-primary:not(:disabled):not(.disabled).active:focus,.btn-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(38,143,255,.5)}.btn-secondary{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:hover{color:#fff;background-color:#5a6268;border-color:#545b62}.btn-secondary.focus,.btn-secondary:focus{color:#fff;background-color:#5a6268;border-color:#545b62;box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-secondary.disabled,.btn-secondary:disabled{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-secondary:not(:disabled):not(.disabled).active,.btn-secondary:not(:disabled):not(.disabled):active,.show>.btn-secondary.dropdown-toggle{color:#fff;background-color:#545b62;border-color:#4e555b}.btn-secondary:not(:disabled):not(.disabled).active:focus,.btn-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(130,138,145,.5)}.btn-success{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:hover{color:#fff;background-color:#218838;border-color:#1e7e34}.btn-success.focus,.btn-success:focus{color:#fff;background-color:#218838;border-color:#1e7e34;box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-success.disabled,.btn-success:disabled{color:#fff;background-color:#28a745;border-color:#28a745}.btn-success:not(:disabled):not(.disabled).active,.btn-success:not(:disabled):not(.disabled):active,.show>.btn-success.dropdown-toggle{color:#fff;background-color:#1e7e34;border-color:#1c7430}.btn-success:not(:disabled):not(.disabled).active:focus,.btn-success:not(:disabled):not(.disabled):active:focus,.show>.btn-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(72,180,97,.5)}.btn-info{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:hover{color:#fff;background-color:#138496;border-color:#117a8b}.btn-info.focus,.btn-info:focus{color:#fff;background-color:#138496;border-color:#117a8b;box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-info.disabled,.btn-info:disabled{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-info:not(:disabled):not(.disabled).active,.btn-info:not(:disabled):not(.disabled):active,.show>.btn-info.dropdown-toggle{color:#fff;background-color:#117a8b;border-color:#10707f}.btn-info:not(:disabled):not(.disabled).active:focus,.btn-info:not(:disabled):not(.disabled):active:focus,.show>.btn-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(58,176,195,.5)}.btn-warning{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:hover{color:#212529;background-color:#e0a800;border-color:#d39e00}.btn-warning.focus,.btn-warning:focus{color:#212529;background-color:#e0a800;border-color:#d39e00;box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-warning.disabled,.btn-warning:disabled{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-warning:not(:disabled):not(.disabled).active,.btn-warning:not(:disabled):not(.disabled):active,.show>.btn-warning.dropdown-toggle{color:#212529;background-color:#d39e00;border-color:#c69500}.btn-warning:not(:disabled):not(.disabled).active:focus,.btn-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(222,170,12,.5)}.btn-danger{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:hover{color:#fff;background-color:#c82333;border-color:#bd2130}.btn-danger.focus,.btn-danger:focus{color:#fff;background-color:#c82333;border-color:#bd2130;box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-danger.disabled,.btn-danger:disabled{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-danger:not(:disabled):not(.disabled).active,.btn-danger:not(:disabled):not(.disabled):active,.show>.btn-danger.dropdown-toggle{color:#fff;background-color:#bd2130;border-color:#b21f2d}.btn-danger:not(:disabled):not(.disabled).active:focus,.btn-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(225,83,97,.5)}.btn-light{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:hover{color:#212529;background-color:#e2e6ea;border-color:#dae0e5}.btn-light.focus,.btn-light:focus{color:#212529;background-color:#e2e6ea;border-color:#dae0e5;box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-light.disabled,.btn-light:disabled{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-light:not(:disabled):not(.disabled).active,.btn-light:not(:disabled):not(.disabled):active,.show>.btn-light.dropdown-toggle{color:#212529;background-color:#dae0e5;border-color:#d3d9df}.btn-light:not(:disabled):not(.disabled).active:focus,.btn-light:not(:disabled):not(.disabled):active:focus,.show>.btn-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(216,217,219,.5)}.btn-dark{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:hover{color:#fff;background-color:#23272b;border-color:#1d2124}.btn-dark.focus,.btn-dark:focus{color:#fff;background-color:#23272b;border-color:#1d2124;box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-dark.disabled,.btn-dark:disabled{color:#fff;background-color:#343a40;border-color:#343a40}.btn-dark:not(:disabled):not(.disabled).active,.btn-dark:not(:disabled):not(.disabled):active,.show>.btn-dark.dropdown-toggle{color:#fff;background-color:#1d2124;border-color:#171a1d}.btn-dark:not(:disabled):not(.disabled).active:focus,.btn-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(82,88,93,.5)}.btn-outline-primary{color:#007bff;border-color:#007bff}.btn-outline-primary:hover{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary.focus,.btn-outline-primary:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-primary.disabled,.btn-outline-primary:disabled{color:#007bff;background-color:transparent}.btn-outline-primary:not(:disabled):not(.disabled).active,.btn-outline-primary:not(:disabled):not(.disabled):active,.show>.btn-outline-primary.dropdown-toggle{color:#fff;background-color:#007bff;border-color:#007bff}.btn-outline-primary:not(:disabled):not(.disabled).active:focus,.btn-outline-primary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-primary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.btn-outline-secondary{color:#6c757d;border-color:#6c757d}.btn-outline-secondary:hover{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary.focus,.btn-outline-secondary:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-secondary.disabled,.btn-outline-secondary:disabled{color:#6c757d;background-color:transparent}.btn-outline-secondary:not(:disabled):not(.disabled).active,.btn-outline-secondary:not(:disabled):not(.disabled):active,.show>.btn-outline-secondary.dropdown-toggle{color:#fff;background-color:#6c757d;border-color:#6c757d}.btn-outline-secondary:not(:disabled):not(.disabled).active:focus,.btn-outline-secondary:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-secondary.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.btn-outline-success{color:#28a745;border-color:#28a745}.btn-outline-success:hover{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success.focus,.btn-outline-success:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-success.disabled,.btn-outline-success:disabled{color:#28a745;background-color:transparent}.btn-outline-success:not(:disabled):not(.disabled).active,.btn-outline-success:not(:disabled):not(.disabled):active,.show>.btn-outline-success.dropdown-toggle{color:#fff;background-color:#28a745;border-color:#28a745}.btn-outline-success:not(:disabled):not(.disabled).active:focus,.btn-outline-success:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-success.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.btn-outline-info{color:#17a2b8;border-color:#17a2b8}.btn-outline-info:hover{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info.focus,.btn-outline-info:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-info.disabled,.btn-outline-info:disabled{color:#17a2b8;background-color:transparent}.btn-outline-info:not(:disabled):not(.disabled).active,.btn-outline-info:not(:disabled):not(.disabled):active,.show>.btn-outline-info.dropdown-toggle{color:#fff;background-color:#17a2b8;border-color:#17a2b8}.btn-outline-info:not(:disabled):not(.disabled).active:focus,.btn-outline-info:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-info.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.btn-outline-warning{color:#ffc107;border-color:#ffc107}.btn-outline-warning:hover{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning.focus,.btn-outline-warning:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-warning.disabled,.btn-outline-warning:disabled{color:#ffc107;background-color:transparent}.btn-outline-warning:not(:disabled):not(.disabled).active,.btn-outline-warning:not(:disabled):not(.disabled):active,.show>.btn-outline-warning.dropdown-toggle{color:#212529;background-color:#ffc107;border-color:#ffc107}.btn-outline-warning:not(:disabled):not(.disabled).active:focus,.btn-outline-warning:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-warning.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.btn-outline-danger{color:#dc3545;border-color:#dc3545}.btn-outline-danger:hover{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger.focus,.btn-outline-danger:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-danger.disabled,.btn-outline-danger:disabled{color:#dc3545;background-color:transparent}.btn-outline-danger:not(:disabled):not(.disabled).active,.btn-outline-danger:not(:disabled):not(.disabled):active,.show>.btn-outline-danger.dropdown-toggle{color:#fff;background-color:#dc3545;border-color:#dc3545}.btn-outline-danger:not(:disabled):not(.disabled).active:focus,.btn-outline-danger:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-danger.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.btn-outline-light{color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:hover{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light.focus,.btn-outline-light:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-light.disabled,.btn-outline-light:disabled{color:#f8f9fa;background-color:transparent}.btn-outline-light:not(:disabled):not(.disabled).active,.btn-outline-light:not(:disabled):not(.disabled):active,.show>.btn-outline-light.dropdown-toggle{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}.btn-outline-light:not(:disabled):not(.disabled).active:focus,.btn-outline-light:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-light.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.btn-outline-dark{color:#343a40;border-color:#343a40}.btn-outline-dark:hover{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark.focus,.btn-outline-dark:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-outline-dark.disabled,.btn-outline-dark:disabled{color:#343a40;background-color:transparent}.btn-outline-dark:not(:disabled):not(.disabled).active,.btn-outline-dark:not(:disabled):not(.disabled):active,.show>.btn-outline-dark.dropdown-toggle{color:#fff;background-color:#343a40;border-color:#343a40}.btn-outline-dark:not(:disabled):not(.disabled).active:focus,.btn-outline-dark:not(:disabled):not(.disabled):active:focus,.show>.btn-outline-dark.dropdown-toggle:focus{box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}.btn-link{font-weight:400;color:#007bff;text-decoration:none}.btn-link:hover{color:#0056b3;text-decoration:underline}.btn-link.focus,.btn-link:focus{text-decoration:underline}.btn-link.disabled,.btn-link:disabled{color:#6c757d;pointer-events:none}.btn-group-lg>.btn,.btn-lg{padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem}.btn-group-sm>.btn,.btn-sm{padding:.25rem .5rem;font-size:.875rem;line-height:1.5;border-radius:.2rem}.btn-block{display:block;width:100%}.btn-group-xs>.btn,.btn-xs{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.navbar-btn.btn-xs{margin-top:14px;margin-bottom:14px}.btn-group-xs>.btn .badge,.btn-xs .badge{top:0;padding:1px 5px}</style>`
    )


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


        registerMenuCommand() {
            GM_registerMenuCommand('字体大小设置', () => {
                vapp.showSetting();
            });
        },

        init() {
            this.initValue();
            this.registerMenuCommand();

        }
    };
    main.init();



  // 显示托盘==============================================
    const html =
        `<el-card class='onediv'>
         <div slot="header" class="clearfix">
    <span>扇贝单词助手</span>
    <el-button style="float: right; padding: 3px 0" type="text" @click="leftbox" >{{isleftbox ? '最小化' : '还原'}}</el-button>
  </div>



        <div>
        <el-button class="bbtn" v-if="!isfullScreen" type="primary" iocn="el-icon-full-screen"  @click="enterFullScreen" size="small">开启专注模式</el-button>
        <el-button class="bbtn" v-if="isfullScreen" type="primary" iocn="el-icon-full-screen" @click="exitFullScreen" size="small">关闭专注模式</el-button>
        <el-button class="bbtn" type="primary" @click="btnTheme" :icon="'el-icon-' + (theme == 'light' ? 'sunny' : 'moon-night')" size="small">{{theme == 'light' ? '白天' : '黑夜'}}模式</el-button>
         <el-button  class="bbtn" type="primary" @click="dialogKeyTipVisible = true" icon="el-icon-notebook-2" size="small">查看快捷键</el-button>
        </div>

<!---
        <input type="radio" name="selectksl" value="0" checked="checked" id="mr"><label for="mr">柯林斯词典默认显示</label><br>
        <input type="radio" name="selectksl" value="1" id="yw"><label for="yw">隐藏柯林斯词典中的英文</label><br>
        <input type="radio" name="selectksl" value="2" id="zw"><label for="zw">隐藏柯林斯词典中的中文</label><br>
        --->

        <el-checkbox v-model="isblodFY" @change="setValue('isblodFY', $event)">加粗中文翻译</el-checkbox>
        <el-checkbox v-model="isMyNote" @change="setValue('isMyNote', $event)">默认选择我的笔记</el-checkbox>
        <el-checkbox v-model="ishideFY" @change="setValue('ishideFY', $event)">隐藏例句中的翻译</el-checkbox>
        <el-checkbox v-model="isCollinsFY" @change="setValue('isCollinsFY', $event)">隐藏柯林斯词典中的中文</el-checkbox>
        <!---<el-checkbox v-model="isCollins" @change="setValue('isCollins', $event)">是否开启柯林斯例句自动发音</el-checkbox>--->
        <el-checkbox v-model="isopenNote" @change="setValue('isopenNote', $event)">自动展开共享笔记</el-checkbox>



        </el-card>`
        // 显示翻译托盘==============================================
    const html2 =
        `
			<el-card class="box-card twodiv">
            <div slot="header" class="clearfix">
    <span>拼写句子助手</span>
    <el-button style="float: right; padding: 3px 0" type="text"  @click="rightbox" >{{isrightbox ? '最小化' : '还原'}}</el-button>
  </div>

			    <el-input
			      type="textarea"
				  size="medium"
			      :rows="3"
				  :cols="1"
			      placeholder="请输入内容"
			      v-model="textarea"
				  @keydown.native="textareaKeydown"
				  clearable
                  style="font-size: 20px"
				  >
			    </el-input>
			  </div>
			</el-card>
		`
    const html3 = `
<el-dialog title="请选择字体大小" center :visible.sync="dialogSizeVisible">
<div>拖动滑块观察字体大小变化</div>
<el-slider v-model="fontsize" :min=15 :max=25 @change="changefont" :format-tooltip="function(val) { return val+'px';}"></el-slider>


<span slot="footer" class="dialog-footer">
<el-button type="primary" @click="dialogSizeVisible = false">保 存</el-button>
<el-button @click="dialogSizeVisible = false, fontsize = 15">还 原</el-button>

  </span>
</el-dialog>`;

    const html4 = `
    <el-dialog title="查看快捷键" center :visible.sync="dialogKeyTipVisible">
      <el-table :data="keyDate" border>
    <el-table-column property="tip" label="功能说明"></el-table-column>
    <el-table-column property="key" label="快捷键"></el-table-column>
  </el-table>

</el-dialog>
    `
    var node = $(`<div id="app"></div>`);
    node = node.html(html + html2 + html3 + html4);

    $('#root').append(node);
    var vapp


    vapp = new Vue({
        el: "#app",
        data() {
            return {
                trans_result: [],
                keyDate:  [
                    { tip: '认识、想起来了', key: 'J/1'},
                    { tip: '提示一下、没想起来、撤销', key: 'K/2'},
                    { tip: 'US发音', key: 'O/3'},
                    { tip: 'UK发音', key: 'I/4'},
                    { tip: '扇贝与柯林斯切换', key: 'U/5'},
                    { tip: '例句发音', key: 'T/6'},
                    { tip: '真题例句发音', key: 'G/7'},
                    { tip: '例句翻译显示与隐藏', key: 'H/8'},
                    { tip: '下一个', key: 'L/.'},
                    { tip: '隐藏展示柯林斯词典中的中/英文', key: 'V/0'},
                    { tip: '拼写模式下查看正确答案/继续', key: 'Enter'},
                ],
                msg: '',
                textarea: '',
                theme: GM_getValue('theme') || 'light',
                isfullScreen: false,
                dialogSizeVisible: false,
                dialogKeyTipVisible: false,
                fontsize: 15,
                isopenNote: GM_getValue('isopenNote'),
                isCollins: GM_getValue('isCollins'),
                isCollinsFY: GM_getValue('isCollinsFY'),
                ishideFY: GM_getValue('ishideFY'),
                isblodFY: GM_getValue('isblodFY'),
                isMyNote: GM_getValue('isMyNote'),
                isleftbox: true,
                isrightbox: false,

            }

        },
        mounted: function() {
            let _this = this
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
                    _this.enterFullScreen()
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

                    _this.exitFullScreen()
                }
            }


            $('.twodiv > .el-card__body').css("display" , 'none')
            this.changeTheme()



            // ===================================================================
        },
        methods: {

            leftbox: function() {
                 $('.onediv > .el-card__body').toggle("slow")
                this.isleftbox = !this.isleftbox
            },
            rightbox: function(){
                 $('.twodiv > .el-card__body').toggle("slow")
                this.isrightbox = !this.isrightbox
            },

             // 打开浏览器全屏模式
            enterFullScreen: function () {
                this.isfullScreen = true

                $(".Nav_nav__3kyeO").hide();
                $(".Nav_container__sBZA1").hide();
                $(".SubNav_itemsWrapper__1mM4u").hide();
                this.$message({
                    message: '进入专注模式，更专注于背单词！',
                    type: 'success'
                });

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
            },

            // 退出全屏
            exitFullScreen: function () {
                this.isfullScreen = false
                $(".Nav_nav__3kyeO").show();
                $(".Nav_container__sBZA1").show();
                $(".SubNav_itemsWrapper__1mM4u").show();
                this.$message({
                    message: '退出专注模式，不要被外界干扰哟！建议开启专注模式！',
                    type: 'warning'
                });

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
            },
            //切换主题
            btnTheme: function (){
                this.theme = this.theme == "light" ? 'dark' : 'light'
                GM_setValue('theme', this.theme)
                this.changeTheme(this.theme)
                 this.$message({
                    message: this.theme == 'dark' ? '切换黑夜': '切换白天',
                    type: 'success'
                });

            },
            //切换主题
            changeTheme: function (){
                if (this.theme == "light") {
                   const style = document.createElement("style");
                    style.id = "theme-css-dark"; // 加上id方便后面好查找到进行删除
                    style.innerHTML = `html{filter: invert(100%) hue-rotate(180deg);scrollbar-width: none;} ::-webkit-scrollbar{display:none} img,video {filter: invert(100%) hue-rotate(180deg);}`;
                    document.querySelector("head").appendChild(style);
                } else {
                    document.querySelector("#theme-css-dark").remove();
                }

            },
            showSetting: function() {
                this.dialogSizeVisible = true

            },
            changefont: function(e){
            
            },
            setValue: function(name, e){
                GM_setValue(name, e);
                this.$message({
                    message: '操作成功',
                    type: 'success'
                });

            },
            // 取消多行文本框的回车
            textareaKeydown:function (e) {
                e.stopPropagation();
                return false;
            },

        }
    })







    // 键盘监听========
    $(document).keydown(function(event, repeat) {
        if (repeat) return
        // 数字键3，o ，US发音
        if (event.keyCode == 99 || event.keyCode == 51 || event.keyCode == 79) {
            $(".index_trump__3bTaM:last").click()
            $(".Pronounce_audio__3xdMh:last").click()
        }
        // 数字键4，i，UK发音
        if (event.keyCode == 100 || event.keyCode == 52 || event.keyCode == 73) {
            $(".index_trump__3bTaM:first").click()
            $(".Pronounce_audio__3xdMh:first").click()
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
            $(".index_icon__1IK2K").click()
        }

        // 数字键盘7，,g,真题例句发音
        if (event.keyCode == 103 || event.keyCode == 55 || event.keyCode == 71) {
            $(".index_audio__1mSVg:first > img").click()
        }

        // 数字键盘8，h,例句翻译显示与隐藏
        if (event.keyCode == 104 || event.keyCode == 56 || event.keyCode == 72) {
            $(".btn.btn-primary.btn-xs").next().toggle()
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
 

    // selectksl
    $(`input[name='selectksl'][value=${GM_getValue('check5')}]`).attr("checked", true);
    $("input[name='selectksl']").click((params) => {
        // console.log($("input[name='selectksl']:checked").val())
        GM_setValue('check5', $("input[name='selectksl']:checked").val());
    })

    // ==========================================================





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

            xhmutationObserver && xhmutationObserver.disconnect()
            console.log(mutations);
            // mutations.forEach(function(mutation) {
            // $(".index_icon__1IK2K").after("<h6>数字键6发音</h6>")
            // $(".index_audio__1mSVg:first").after("<h6>数字键7发音</h6>")
            // $(".index_trump__3bTaM:first").after("<h6>数字键4:UK发音</h6>")
            // $(".Pronounce_audio__3xdMh:first").after("<h6>数字键4:UK发音</h6>")
            // $(".index_trump__3bTaM:last").after("<h6>数字键3:US发音</h6>")
            // $(".Pronounce_audio__3xdMh:last").after("<h6>数字键3:US发音</h6>")



            //复读机
            var btn = $("#btnRefresh")
            btn.addClass("btnRefresh")
             $("img[alt=trumpet]").after((index)=>{
                 return `<button type="button"  data-index="${index}" class="el-button el-button--success el-button--mini is-circle btnRefresh" id="btnRefresh"><i class="el-icon-refresh"></i></button>`

             })


        
            $('.btnRefresh').on('click', (e)=> {
                let currentIndex = -1
                xhmutationObserver && xhmutationObserver.disconnect()


                var target = $(e.currentTarget);
                var trumpet = target.parent().find("img[alt=trumpet]")
                $('.btnRefresh i').removeClass("xz")

                if(xhflag == target.data('index'))
                {
                    xhflag = -1
                    return
                }
                trumpet.click()


                currentIndex = xhflag = target.data('index')


                target.find("i").addClass("xz")

                xhmutationObserver = new MutationObserver(function(mutations) {
                    if(mutations[0].target.src.indexOf("iVBORw0KGgoAAAA") != -1)
                    {


                        currentIndex == xhflag && setTimeout(()=>{trumpet.click()}, 3000)
                    }
                });

                xhmutationObserver.observe(trumpet.get(0), {
                    attributes: true
                    // subtree: true
                });



            })


            $(".index_exampleEN__3OIEA, .index_sentenceEn__1Qjgx").after(
                "<button class='optionFY btn btn-primary btn-xs'>显示/隐藏翻译</button>"
            )

            $(".index_exampleEN__3OIEA").after("<button class=' pingxie btn btn-primary btn-xs mr-2'>拼写</button>")



            // 隐藏例句中的中文
            $(".optionFY").click((event) => {
                var $target = $(event.target);
                $target.next().toggle()
            })
            if (GM_getValue('ishideFY')) {
                $(".optionFY").click()
            }

            $(".pingxie").click((event) => {
                var $target = $(event.target);
                $target.prev().toggle()

                if($target.next().next().css("display") == 'none')
                {
                    $target.next().click()
                }
                vapp.rightbox()



            })




            //柯林斯词典
            $(".CollinsTrans_paraphraseList__3SZ3y > li > span:nth-child(3),.StudySummaryItem_content__3j9YG > div > div >span:nth-child(3)")
                .after(
                    "&nbsp&nbsp<button class='btn btn-link btn-xs isCollinsFY' href='javascript:void(0);'>显示/隐藏</button>"
                    )


            $(".isCollinsFY").click((event) => {
                // 取消冒泡事件
                if (event.stopPropagation()) {
                    event.stopPropagation()
                } else {
                    event.cancelBubble = true // 兼容ie浏览器
                }
                var $target = $(event.target);
                $target.prev().toggle()
            })
            if (GM_getValue('isCollinsFY')) {
                $(".isCollinsFY").click()
            }


            $(
                ".BayTrans_paraphrase__2JMIz > p"
            ).css({
                "font-size": `inherit`,

            })

            // 加粗解释

              if(GM_getValue('isblodFY'))
              {
                   $(".StudySummaryItem_content__3j9YG > div > div >span:nth-child(3),.BayTrans_paraphrase__2JMIz,.CollinsTrans_pos__3szum,.CollinsTrans_paraphraseList__3SZ3y > li > span:nth-child(3),.index_name__1gkfJ").css({
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
            if (GM_getValue('isCollins')) {
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


            if (GM_getValue('isopenNote')) {
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





    //update()
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
