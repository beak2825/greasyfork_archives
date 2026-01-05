// ==UserScript==
// @author       @leoncastro
// @namespace    https://github.com/leoncastro
// @name         cb-mini
// @version      0.06.3
// @description  Minimize menus, hide banners and maximize the cam screen on chaturbate.com
// @icon         data:image/png;base64,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
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @include      https://chaturbate.com
// @include      /^(https?:)?\/\/([^\.\/]*\.)?chaturbate\.com\/*.*/
// @exclude      /^(https?:)?\/\/(public|blog|shop|support)\.chaturbate\.com\/*.*/
// @compatible   firefox+greasemonkey
// @compatible   chrome+tampermonkey
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/17189/cb-mini.user.js
// @updateURL https://update.greasyfork.org/scripts/17189/cb-mini.meta.js
// ==/UserScript==
/*
 v0.01: hide popup (body div#main div#overlay)+(body div#main div#entrance_terms)
        hide banner top (body div#header div.ad)
        edit logo (body div#header div.section div.logo-zone strong.logo), smaller
        hide slogan (body div#header div.section div.logo-zone strong.logo+strong)
        hide main menu (body div#header div.nav-bar), except login
        hide sub menu advanced items (body div#main div.top-section div.advanced_search_button_shell)
        edit sub menu position (body div#main div.top-section ul.sub-nav)
        hide banner right (body div#main div.content div.ad)
        hide contents footer extra info (body div#main divcontent div.featured_blog_posts)+(body div#main divcontent div.featured_text)
        resize contents (body div#main div.content)
        hide banner botom (body div#main div.banner)
        hide footer (body div#footer-holder)
 v0.02: make sub menu with blue style like main menu
        style(body div#main div.top-section ul.sub-nav li a) = style(body div#header div.nav-bar ul#nav li a)
        hide login menu too (body div#header div.nav-bar li.login-link)|(body div#header div.nav-bar)
 v0.03: edit sub menu position, now is fixed
 v0.04: require jquery, rewrite some vanilla-js
        remove redirection in external links (a[href^="/external_link/?url="])
        make player on top of bio elements with absolute or fixed position (element.style.position=absolute|fixed)
        add login (body div#header div.nav-bar ul#nav li.login-link) to sub-menu (body div#main div.top-section ul.sub-nav)
        remove watermark on flash video
        remove tip sound
        add a scroll-to-top button
        add href to profile menu link
 v0.05: [css] edit style in home page preview to make it more compact
        [ js] add broadcast menu (body div#header div.nav-bar ul#nav li a[href^="/b/"]) to sub-menu (body div#main div.top-section ul.sub-nav)
        [ js] script optimized for add login in sub-menu
        [css] edit style of scroll-to-top button, now is blue, to make more difference with normal paging buttons
        [css] add paging styles with background, thinking on nightly version
        [ js][css] change style in the night (early nightly version; for now, only background)
        [css] enable advanced search
        [ js] fix absolute image processing
 v0.06: [ js][css] create config section to select options, saved in localStorage
        [ js][css] add custom favorites in preview
        [ js] (option) auto refresh preview images
        [css] (option) full nightly version
        [css] (option) big to_top button support
        [css] (option) show/hide extra details on previews
        [css] (option) show menu interface as text/icon
        [ js] fix .1, dont add broadcast menu on broadcast page
        [ js] fix .2, header size for auto scroll down video process
        [css] fix .3, new svg logo
        [ js] syntax cleanup
*/
//
// // fast vanilla-js code:
// set styles
function add_css(css,id)
{
 var dad,obj;
 dad=document.getElementsByTagName('head')[0];
 dad = dad||document;
 if(id&&(obj=document.getElementById(id)))
 {
  obj.innerHTML=css;
 }
 else
 {
  obj=document.createElement('style');
  if(id)obj.setAttribute('id',id);
  obj.setAttribute('type','text/css');
  obj.innerHTML=css;
  dad.appendChild(obj);
 }
}
add_css(`
body{min-width:0!important;}
#header .ad{display:none!important;}
#header .section{position:fixed;top:0;width:100%;height:36px!important;padding-top:3px;background:#0c6a93;border-bottom:3px solid #f47321;z-index:9900;}
#header .section .logo-zone{padding:0 15px;}
#header .section .logo-zone .logo{width:100px;height:39px;padding:0;background-image:url("https://ssl-ccstatic.highwebmedia.com/images/flashwatermark.png");}
#header .section .logo-zone .logo+strong{display:none;}
#header .section .logo-zone svg image {width:125px;height:36px;}
#header .nav-bar{display:none;}
#main{padding-top:42px;}
#main .top-section{position:fixed;top:0;height:39px;margin-left:140px;padding:0;overflow:hidden;background:#0c6a93;border-bottom:3px solid #f47321;font:inherit;z-index:9900;}
#main .top-section:after{display:inherit;content:inherit;clear:inherit;}
#main .top-section .advanced_search_button_shell{top:10px;right:0;width:20px;height:20px;}
#main .top-section .advanced_search_button,#main .top-section .hide_advanced_search_button{color:transparent;}
#main .top-section .advanced_search_button:after,
#main .top-section .hide_advanced_search_button:after{position:absolute;top:0;left:0;font:1.166em "UbuntuMedium",Arial,Helvetica,sans-serif;text-shadow:1px 1px 0 #000;color:#fff;font-weight:900;cursor:pointer;}
#main .top-section .advanced_search_button:after{content:"+";font-size:2em;}
#main .top-section .hide_advanced_search_button:after{content:"--";font-size:2em;}
#main .top-section .actions{display:none;}
#main .top-section .sub-nav{display:block;position:relative;top:inherit;min-width:0;height:inherit;overflow:inherit;margin:0;padding:6px 0 0;list-style:none;text-shadow:1px 1px 0 #000;font:1.166em "UbuntuMedium",Arial,Helvetica,sans-serif;line-height:30px;z-index:9900;}
#main .top-section .sub-nav li{height:30px;margin:0 20px 0 0;padding:0;line-height:30px;}
#main .top-section .sub-nav li.active{position:relative;margin-right:25px;padding:3px 15px 0 15px;background:#f47321;color:#fff;border-radius:4px 4px 0 0;-webkit-border-radius:4px 4px 0 0;-moz-border-radius:4px 4px 0 0;}
#main .top-section .sub-nav li.selected{font-size:inherit;}
#main .top-section .sub-nav li a{float:left;height:100%;padding:0;background:transparent;color:#fff;border:none;border-radius:none;-webkit-border-radius:none;-moz-border-radius:none;cursor:pointer;}
#main .top-section .sub-nav li a:hover{background:transparent;color:#fff;border-bottom:none;text-decoration:underline;}
#main .top-section .sub-nav li.active a{margin:0;padding:0;background:none;text-decoration:none;}
#main .content{display:block!important;padding:4px!important;}
#main .content .ad{display:none;}
#main .content .ad.top_tags{display:none;}
#main .content .advanced_search_options input#id_show_location, label[for="id_show_location"]{display:none;}
#main .content .c-1{margin:0!important;}
#main .content .c-1>div>h2:empty{margin:0;}
#main .content .c-1 .list{min-width:0!important;}
#main .content .c-1 .list>li{margin:0 0 5px 5px!important;}
#main .content .c-1 .list .thumbnail_label,
#main .content .c-1 .list .thumbnail_label_featured{top:3px;}
#main .content .c-1 .list .details{position:absolute;bottom:0;width:174px;padding:3px;}
#main .content .c-1 .list .details .title{border:none!important;}
#main .content .c-1 .list .details .title>a{position:absolute;left:3px;bottom:3px;width:auto;max-width:135px;min-height:16px;padding:1px 3px;overflow:hidden;text-overflow:ellipsis;background-color:rgba(252,234,219,0.8);}
#main .content .c-1 .list .details .title .age{position:absolute;right:3px;bottom:3px;background-color:rgba(252,234,219,0.8);}
#main .content .c-1 .list>li .details .subject{visibility:hidden;width:174px;height:32px;}
#main .content .c-1 .list>li:hover .details .subject{visibility:visible;margin-bottom:2px;}
#main .content .c-1 .list>li .details .subject li{width:174px;height:32px;background-color:rgba(252,234,219,0.8);border-radius:0;}
#main .content .c-1 .list>li .details .subject li:empty{display:none;}
#main .content .c-1 .list>li .thumbnail_label_exhibitionist+.details .subject{display:none;}
#main .content .c-1 .list>li .details .sub-info{visibility:hidden;width:174px;height:12px;background-color:rgba(252,234,219,0.8);}
#main .content .c-1 .list>li:hover .details .sub-info{visibility:visible;margin-bottom:20px;}
#main .content .c-1 .list>li .thumbnail_label,
#main .content .c-1 .list>li .details>ul{opacity:0.5; -webkit-transition:all 0.5s ease-in-out;transition:all 0.5s ease-in-out;}
#main .content .c-1 .list>li:hover .thumbnail_label,
#main .content .c-1 .list>li:hover .details>ul{opacity:1;}
#main .content .c-1 .paging a:hover{background-color:#fff;border-color:#dc5500;}
#main .content .c-1 .paging .active a{background-color:#dc5500!important;color:#fff!important;border-color:#dc5500!important;}
#main .content .c-1 .section .video-box #player{z-index:90;}
#main .content .paging.to_top{position:fixed!important;bottom:10px;right:10px;opacity:1; -webkit-transition:all 0.5s ease-in-out;transition:all 0.5s ease-in-out;}
#main .content .paging.to_top.on_top{bottom:-10px;opacity:0;}
#main .content .paging.to_top a{background:#71a4d7 url("https://ssl-ccstatic.highwebmedia.com/images/arrow-left-white.png") no-repeat 50% 50%;border:1px solid #3C6793;transform:rotate(90deg);}
#main .content .paging.paging.to_top.big{height:44px;}
#main .content .paging.paging.to_top.big li{width:44px;}
#main .content .paging.paging.to_top.big li a{width:42px;height:42px;background-size:9px;opacity:.5;}
#main .content .paging.paging.to_top.big li a:hover{opacity:1;}
#main .content .featured_blog_posts{display:none;}
#main .content .featured_text{display:none;}
#main .banner{display:none;}
#main #overlay{display:none!important;}
#main #entrance_terms{display:none!important;}
.footer-holder{display:none;}

#config-menu{width:22px;height:22px;margin:5px 0;cursor:pointer;background-repeat:no-repeat;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PGcgZmlsbD0iI0ZGRiI+PHJlY3QgeD0iNiIgeT0iMjIiIHdpZHRoPSIzNiIgaGVpZ2h0PSI0Ii8+PHJlY3QgeD0iNiIgeT0iMTAiIHdpZHRoPSIzNiIgaGVpZ2h0PSI0Ii8+PHJlY3QgeD0iNiIgeT0iMzQiIHdpZHRoPSIzNiIgaGVpZ2h0PSI0Ii8+PC9nPjwvc3ZnPg==");}
#config-menu.show{width:162px;padding:0 0 0 32px;}
#config-menu>div{display:none;cursor:pointer;background-repeat:no-repeat;}
#config-menu.show>div{display:block;float:left;width:22px;height:22px;margin:0 5px;padding:0;}
#config-menu>#toup-size{background:#71a4d7 url("https://ssl-ccstatic.highwebmedia.com/images/arrow-left-white.png") no-repeat 50% 50%;transform:rotate(90deg);border:1px solid #3C6793;border-radius:4px;}
#config-menu>#toup-size.big{background-size:9px;}
#config-menu>#dark-mode{background-image:url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNMjIsMzhjLTQuOCwwLTUtNy01LTd2LTZoMTB2NkMyNywzMSwyNi44LDM4LDIyLDM4eiIvPjxjaXJjbGUgZmlsbD0iI0ZGQTcyNiIgY3g9IjMxIiBjeT0iMTkiIHI9IjIiLz48Y2lyY2xlIGZpbGw9IiNGRkE3MjYiIGN4PSIxMyIgY3k9IjE5IiByPSIyIi8+PHBhdGggZmlsbD0iI0ZGQjc0RCIgZD0iTTMxLDEzYzAtNy42LTE4LTUtMTgsMGMwLDEuMSwwLDUuOSwwLDdjMCw1LDQsOSw5LDlzOS00LDktOUMzMSwxOC45LDMxLDE0LjEsMzEsMTN6Ii8+PHBhdGggZmlsbD0iIzQyNDI0MiIgZD0iTTIyLDRjLTYuMSwwLTEwLDQuOS0xMCwxMWMwLDAuOCwwLDIuMywwLDIuM2wyLDEuN3YtNWwxMi00bDQsNHY1bDItMS43YzAsMCwwLTEuNSwwLTIuM2MwLTQtMS04LTYtOWwtMS0ySDIyeiIvPjxjaXJjbGUgZmlsbD0iIzc4NDcxOSIgY3g9IjI2IiBjeT0iMTkiIHI9IjEiLz48Y2lyY2xlIGZpbGw9IiM3ODQ3MTkiIGN4PSIxOCIgY3k9IjE5IiByPSIxIi8+PHBhdGggZmlsbD0iIzAwOTY4OCIgZD0iTTI3LDMxTDI3LDMxYzAsMC0xLjgsMi01LDJzLTUtMi01LTJTNiwzMyw2LDQ0aDMyQzM4LDMzLDI3LDMxLDI3LDMxeiIvPjxyZWN0IHg9IjM2LjEiIHk9IjYuMSIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MDcxIDAuNzA3MSAtMC43MDcxIDAuNzA3MSAxOS43ODY4IC0yNS43Njk2KSIgZmlsbD0iI0ZGOTgwMCIgd2lkdGg9IjkuOSIgaGVpZ2h0PSI5LjkiLz48cmVjdCB4PSIzNiIgeT0iNiIgZmlsbD0iI0ZGOTgwMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+PGNpcmNsZSBmaWxsPSIjRkZFQjNCIiBjeD0iNDEiIGN5PSIxMSIgcj0iMyIvPjwvc3ZnPg==");}
#config-menu>#dark-mode.night{background-image:url("data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBmaWxsPSIjNDBDNEZGIiBkPSJNNDIuOSw2LjNDNDMuNiw3LjQsNDQsOC42LDQ0LDEwYzAsMy45LTMuMSw3LTcsN2MtMC43LDAtMS4zLTAuMS0xLjktMC4zYzEuMiwyLDMuNCwzLjMsNS45LDMuM2MzLjksMCw3LTMuMSw3LTdDNDgsOS44LDQ1LjksNy4xLDQyLjksNi4zeiIvPjxjaXJjbGUgZmlsbD0iI0IzOUREQiIgY3g9IjMxIiBjeT0iMTkiIHI9IjIiLz48Y2lyY2xlIGZpbGw9IiNCMzlEREIiIGN4PSIxMyIgY3k9IjE5IiByPSIyIi8+PHBvbHlnb24gZmlsbD0iI0IzOUREQiIgcG9pbnRzPSIyMiwzNyAxNywzMSAxNywyNSAyNywyNSAyNywzMSIvPjxwYXRoIGZpbGw9IiNEMUM0RTkiIGQ9Ik0zMSwxM2MwLTcuNi0xOC01LTE4LDBjMCwxLjEsMCw1LjksMCw3YzAsNSw0LDksOSw5czktNCw5LTlDMzEsMTguOSwzMSwxNC4xLDMxLDEzeiIvPjxjaXJjbGUgZmlsbD0iIzY3M0FCNyIgY3g9IjI2IiBjeT0iMTkiIHI9IjEiLz48Y2lyY2xlIGZpbGw9IiM2NzNBQjciIGN4PSIxOCIgY3k9IjE5IiByPSIxIi8+PHBhdGggZmlsbD0iIzY3M0FCNyIgZD0iTTIyLDRjLTYuMSwwLTEwLDQuOS0xMCwxMWMwLDAuOCwwLDIuMywwLDIuM2wyLDEuN3YtNWwxMi00bDQsNHY1bDItMS43YzAsMCwwLTEuNSwwLTIuM2MwLTQtMS04LTYtOWwtMS0ySDIyeiIvPjxwYXRoIGZpbGw9IiM2NzNBQjciIGQ9Ik0yNywzMUwyNywzMWMwLDAtMiwxLTUsMXMtNS0xLTUtMVM2LDMzLDYsNDRoMzJDMzgsMzMsMjcsMzEsMjcsMzF6Ii8+PC9zdmc+");}
#config-menu>#auto-load{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0JGMzYwQyIgZD0iTTcuOSw0MC42di0xLjRjMC0wLjIsMC0wLjMsMC0wLjVsMC40LTMuMWMwLjMtMi40LDAuMi00LjktMC40LTcuM2wtMC45LTMuNmMtMC4xLTAuNS0wLjEtMS4xLDAtMS42TDgsMTkuNmMwLjYtMi40LDAuNy00LjgsMC40LTcuM0w3LjksOS4yYzAtMC4yLDAtMC4zLDAtMC41VjcuNEM3LjksNS41LDkuNCw0LDExLjMsNGgwYzAuNCwwLDAuOSwwLjEsMS4zLDAuMmwwLjYsMC4yYzIuNSwxLDUuMywxLjEsNy45LDAuNGwyLTAuNmMwLjctMC4yLDEuMy0wLjIsMiwwbDAuOCwwLjNjMi43LDAuOSw1LjcsMC44LDguNC0wLjJsMC4zLTAuMUMzNC45LDQuMSwzNS4zLDQsMzUuNyw0aDFjMS45LDAsMy40LDEuNSwzLjQsMy40djEuNGMwLDAuMiwwLDAuMywwLDAuNWwtMC40LDMuMWMtMC4zLDIuNC0wLjIsNC45LDAuNCw3LjNsMC45LDMuNmMwLjEsMC41LDAuMSwxLjEsMCwxLjZMNDAsMjguNGMtMC42LDIuNC0wLjcsNC44LTAuNCw3LjNsMC40LDMuMWMwLDAuMiwwLDAuMywwLDAuNXYxLjRjMCwxLjktMS41LDMuNC0zLjQsMy40aC0xYy0wLjQsMC0wLjktMC4xLTEuMy0wLjJsLTAuMy0wLjFjLTIuNy0xLjEtNS42LTEuMi04LjQtMC4yTDI1LDQzLjdjLTAuNiwwLjItMS4zLDAuMi0yLDBsLTItMC42Yy0yLjYtMC43LTUuNC0wLjYtNy45LDAuNGwtMC42LDAuMmMtMC40LDAuMi0wLjgsMC4yLTEuMywwLjJoMEM5LjQsNDQsNy45LDQyLjUsNy45LDQwLjZ6Ii8+PHBhdGggZmlsbD0iIzNFMjcyMyIgZD0iTTEyLDM4VjEwYzAtMC42LDAuNC0xLDEtMWgyMmMwLjYsMCwxLDAuNCwxLDF2MjhjMCwwLjYtMC40LDEtMSwxSDEzQzEyLjQsMzksMTIsMzguNiwxMiwzOHoiLz48cmVjdCB4PSIyMCIgeT0iMjAuNSIgZmlsbD0iI0JGMzYwQyIgd2lkdGg9IjgiIGhlaWdodD0iMTAuNSIvPjxwYXRoIGZpbGw9IiM1MzZERkUiIGQ9Ik0yNi42LDMwaC01LjNjLTMuMSwwLTUuNiwyLjMtNiw1LjNMMTUsMzloMThsLTAuNC0zLjdDMzIuMywzMi4zLDI5LjcsMzAsMjYuNiwzMHoiLz48cGF0aCBmaWxsPSIjM0Y1MUI1IiBkPSJNMjEuNiwzNC41TDI0LDM1bDIuNC0wLjVjMS40LTAuMywyLjMtMS43LDEuOS0zTDI4LDMwLjJjLTAuNC0wLjEtMC45LTAuMi0xLjQtMC4yaC01LjNjLTAuNSwwLTAuOSwwLjEtMS40LDAuMmwtMC4zLDEuM0MxOS4zLDMyLjgsMjAuMiwzNC4yLDIxLjYsMzQuNXoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNMjQsMzIuNWMtMS43LDAtMi41LTIuNS0yLjUtMi41di0zLjhoNVYzMEMyNi41LDMwLDI1LjcsMzIuNSwyNCwzMi41eiIvPjxwYXRoIGZpbGw9IiNGRkI3NEQiIGQ9Ik0yOC41LDIwYzAtMy44LTktMi41LTksMGMwLDAuNSwwLDQsMCw0LjVjMCwyLjUsMiw0LjUsNC41LDQuNXM0LjUtMiw0LjUtNC41QzI4LjUsMjQsMjguNSwyMC41LDI4LjUsMjB6Ii8+PHBhdGggZmlsbD0iI0ZGNTcyMiIgZD0iTTI0LDE0LjFjLTMuMiwwLTgsMS44LTgsMTEuOXYybDQsM3YtOWw2LjEtMy43TDI4LDIxdjEwbDQtMy4xVjI1YzAtMi4xLTAuNC05LjktNS45LTkuOWwtMC41LTEuMUgyNHoiLz48cGF0aCBmaWxsPSIjRkZCNzREIiBkPSJNMjQsMzVjMCwwLTIuNS0yLjUtMi41LTVjMCwwLDAuNywxLDIuNSwxczIuNS0xLDIuNS0xQzI2LjUsMzMsMjQsMzUsMjQsMzV6Ii8+PGNpcmNsZSBmaWxsPSIjNzg0NzE5IiBjeD0iMjYiIGN5PSIyMy41IiByPSIwLjUiLz48Y2lyY2xlIGZpbGw9IiM3ODQ3MTkiIGN4PSIyMiIgY3k9IjIzLjUiIHI9IjAuNSIvPjwvc3ZnPg==");}
#config-menu>#auto-load.yes{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzY3M0FCNyIgZD0iTTE5IDQ0bDExLTE0SDhNNDAgNXY4Yy05LjQgMC0xNyA3LjYtMTcgMTdoLThDMTUgMTYuMiAyNi4yIDUgNDAgNXoiLz48L3N2Zz4=");}
#config-menu>#hide-info{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzY3M0FCNyIgZD0iTTQwIDExSDIybC00LTRIOGMtMi4yIDAtNCAxLjgtNCA0djdoNDB2LTNjMC0yLjItMS44LTQtNC00bTAgMEg4Yy0yLjIgMC00IDEuOC00IDR2MjJjMCAyLjIgMS44IDQgNCA0aDV2LTEuM2MtLjYtLjMtMS0xLTEtMS43IDAtMSAxLTIgMi0yczIgMSAyIDJjMCAuNy0uNCAxLjQtMSAxLjdWNDFoMTh2LTEuM2MtLjYtLjMtMS0xLTEtMS43IDAtMSAxLTIgMi0yczIgMSAyIDJjMCAuNy0uNCAxLjQtMSAxLjdWNDFoNWMyLjIgMCA0LTEuOCA0LTRWMTVjMC0yLjItMS44LTQtNC00Ii8+PHBhdGggZmlsbD0iI0QxQzRFOSIgZD0iTTIyIDMwcy0yLTMtNy0zLTcgMy03IDN2MmgxNHYtMnptLTMtOWMwIDIuMi0xLjggNC00IDRzLTQtMS44LTQtNCAxLjgtNCA0LTQgNCAxLjggNCA0bTYtM2gxNXYySDI1em0wIDVoMTV2MkgyNXptMCA1aDh2MmgtOHoiLz48L3N2Zz4=");}
#config-menu>#hide-info.clean{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzY3M0FCNyIgZD0iTTQwIDdIOGMtMi4yIDAtNCAxLjgtNCA0djI2YzAgMi4yIDEuOCA0IDQgNGg1di0xLjNjLTAuNi0wLjMtMS0xLTEtMS43YzAtMS4xIDAuOS0yIDItMnMyIDAuOSAyIDJjMCAwLjctMC40IDEuNC0xIDEuN1Y0MWgxOHYtMS4zYy0wLjYtMC4zLTEtMS0xLTEuN2MwLTEuMSAwLjktMiAyLTJzMiAwLjkgMiAyYzAgMC43LTAuNCAxLjQtMSAxLjdWNDFoNWMyLjIgMCA0LTEuOCA0LTRWMTFDNDQgOC44IDQyLjIgNyA0MCA3eiIvPjxjaXJjbGUgZmlsbD0iI0QxQzRFOSIgY3g9IjI0IiBjeT0iMTgiIHI9IjQiLz48cGF0aCBmaWxsPSIjRDFDNEU5IiBkPSJNMzEgMjhjMCAwLTEuOS00LTctNGMtNS4xIDAtNyA0LTcgNHYyaDE0VjI4eiIvPjwvc3ZnPg==");}
#config-menu>#menu-text{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzY3M0FCNyIgZD0iTTI4IDEySDE4djMwaC03VjEySDFWNmgyN1YxMnpNNDcgMjRoLTd2MThoLTVWMjRoLTd2LTVoMTlWMjR6Ii8+PC9zdmc+");}
#config-menu>#menu-text.svgui{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PGNpcmNsZSBmaWxsPSIjRkZDQTI4IiBjeD0iMjQiIGN5PSIyNCIgcj0iMTkiLz48cGF0aCBmaWxsPSIjQzYyODI4IiBkPSJNMTQgMjhzMiA5IDEwIDkgMTAtOSAxMC05LTUgMi0xMCAyLTEwLTItMTAtMnoiLz48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNCNzZDMDkiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTEzIDIxczEuNS0yIDQtMiA0IDIgNCAybTYgMHMxLjUtMiA0LTIgNCAyIDQgMiIvPjwvc3ZnPg==");}

body.night{background-color:#7f7f7f;}
body.night .list>li{background-color:#7F7F7F;}
body.night .content,.night .c-1 .block{background-color:#7F7F7F!important;border-color:#000;}
body.night .video-box,.night #tooltip-subject,.night .tip_shell{background-color:#292929!important;}
body.night .video-box .title,.night .chat-box,.night .chat-box .buttons .active a,.night .chat-list,.night .users-list,.night .settings-list,.night .formborder,
body.night .info-user,.night .info-user .buttons .active a,.night .bio,.night .broadcast_intro,.night .bottompanel{background-color:#0F0F0F!important;}
body.night .video-box,.night #tooltip-subject,.night .settings-list,.night .chat-form .text,.night .bio dd,
body.night .conteststats dt,.night .conteststats h2 span,.night .conteststats dl{color:#C0C0C0!important;}
body.night .chat-list div p span[style], .night .chat-list div p span[style] img{-webkit-filter:invert(1) hue-rotate(180deg);filter:invert(1) hue-rotate(180deg);}
body.night .dark_blue{background-color:#051B29!important;}
body.night .light_blue,.night .dark_light_blue{background-color:#01080C!important;}
body.night #leaderboard .points{color:#FFF!important;}
body.night .tip_shell .green_button_tip,.night .green_button_tip_offline,.night .chat-form .button_send{border-radius:5px;}
body.night .chat-form .emoticon_button{border-radius:10px;}

body.clean .list>li .subject,body.clean .list>li .sub-info{display:none;}

body.svgui #main .top-section .sub-nav li{margin:0 10px 0 0;}
body.svgui #main .top-section .sub-nav a{width:50px;height:50px!important;font-size:0;background-repeat:no-repeat;}
body.svgui #main .top-section .sub-nav a[href*="chaturbate.com"]{background-size:35px 35px;background-position:7.5px 0;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PGcgZmlsbD0iIzI4MzU5MyI+PGNpcmNsZSBjeD0iMzIiIGN5PSIxNSIgcj0iNiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTUiIHI9IjYiLz48cGF0aCBkPSJNNDUuNyAyNGwtMTUuMyAzSDE3LjdMMi40IDI0bDQuMy03LjlDNy44IDE0LjIgOS44IDEzIDEyIDEzaDI0LjJjMi4yIDAgNC4yIDEuMiA1LjMgMy4xbDQuMiA3Ljl6Ii8+PGNpcmNsZSBjeD0iMzciIGN5PSIyOSIgcj0iMTAiLz48Y2lyY2xlIGN4PSIxMSIgY3k9IjI5IiByPSIxMCIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMjciIHI9IjUiLz48L2c+PGNpcmNsZSBmaWxsPSIjNUM2QkMwIiBjeD0iMjQiIGN5PSIyNyIgcj0iMiIvPjxnIGZpbGw9IiMyMTk2RjMiPjxjaXJjbGUgY3g9IjM3IiBjeT0iMjkiIHI9IjciLz48Y2lyY2xlIGN4PSIxMSIgY3k9IjI5IiByPSI3Ii8+PC9nPjxwYXRoIGQ9Ik00MC43IDI2LjdjLTEtMS4xLTIuMy0xLjctMy43LTEuN3MtMi44LjYtMy43IDEuN2MtLjQuNC0uMyAxIC4xIDEuNC40LjQgMSAuMyAxLjQtLjEgMS4yLTEuMyAzLjMtMS4zIDQuNSAwIC4yLjIuNS4zLjcuMy4yIDAgLjUtLjEuNy0uMy40LS4zLjQtLjkgMC0xLjN6TTExIDI1Yy0xLjQgMC0yLjguNi0zLjcgMS43LS40LjQtLjMgMSAuMSAxLjQuNC40IDEgLjMgMS40LS4xIDEuMi0xLjMgMy4zLTEuMyA0LjUgMCAuMi4yLjUuMy43LjMuMiAwIC41LS4xLjctLjMuNC0uNC40LTEgLjEtMS40LTEtMS0yLjQtMS42LTMuOC0xLjZ6IiBmaWxsPSIjOTBDQUY5Ii8+PC9zdmc+");}
body.svgui #main .top-section .sub-nav a[href="/"]{background-size:35px 35px;background-position:7.5px 0;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTQwIDQwdi0xNmg0djBMMjQgNkw0IDI0djBoNHYxNmMwIDEuMiAuOCAyIDIgMmgxMHYtMTRoOHYxNGgxMEMzOS4yIDQyIDQwIDQxLjIgNDAgNDB6Ii8+PC9zdmc+");}
body.svgui #main .content .list .details .title .age.genderf,
body.svgui #main .top-section .sub-nav a[href="/female-cams/"]{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0U5MUU2MyIgZD0iTTI5IDIybDIuNy0yLjNjLTEtMy4zLTQtNS43LTcuNy01LjdzLTYuNyAyLjQtNy43IDUuN0wxOSAyMmwtMyAxNHMxLjUgMiA4IDIgOC0yIDgtMmwtMy0xNHoiLz48cGF0aCBmaWxsPSIjQkYzNjBDIiBkPSJNMjggMTRzLTEtMS00LTEtNCAxLTQgMVY1aDh2OXoiLz48cGF0aCBmaWxsPSIjRkZCNzREIiBkPSJNMjguNiAzNy42TDI4IDQ3aC04bC0uNi05LjRjMSAuMiAyLjYuNCA0LjYuNHMzLjUtLjIgNC42LS40ek0xOSAyMmwtMi43LTIuM2MtLjIuNy0uMyAxLjUtLjMgMi4zdjhsMSAuOCAyLTguOHptMTIuNy0yLjNMMjkgMjJsMiA4LjggMS0uOHYtOGMwLS44IDAtMS42LS4zLTIuM3pNMjQgMTNjMi44IDAgNS0yLjIgNS01cy0yLjItNS01LTUtNSAyLjItNSA1IDIuMiA1IDUgNSIvPjxwYXRoIGZpbGw9IiNGRjU3MjIiIGQ9Ik0yNCAxYy0zIDAtNyAxLTcgMTBsMyAzVjcuNUwyNiA0bDIgMi41VjE0bDMtM2MwLTIgMC05LTUtOWwtLjUtMUgyNHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNMjIgMTR2LTEuNGMuNi4yIDEuMy40IDIgLjRzMS40LS4yIDItLjRWMTRzMCAyLTIgMi0yLTItMi0yem0xIDMzaDJsLTEtOS0xIDl6Ii8+PC9zdmc+");}
body.svgui #main .content .list .details .title .age.genderm,
body.svgui #main .top-section .sub-nav a[href="/male-cams/"]{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzQ1NUE2NCIgZD0iTTE5IDI5djNsMSAxNWg4bDEtMTV2LTMiLz48cGF0aCBmaWxsPSIjMjE5NkYzIiBkPSJNMTYgMjJsMyAydjdoMTB2LTdsMy0yYzAtNC40LTMuNi04LTgtOHMtOCAzLjYtOCA4Ii8+PHBhdGggZmlsbD0iI0ZGOTgwMCIgZD0iTTI2IDExaC00djNzMCAyIDIgMiAyLTIgMi0ydi0zeiIvPjxwYXRoIGZpbGw9IiNGRkI3NEQiIGQ9Ik0xOSAzMXYxbC0zLTJ2LThsMyAydjd6bTEwLTd2OGwzLTJ2LThsLTMgMnptLTUtMTFjMi44IDAgNS0yLjIgNS01cy0yLjItNS01LTUtNSAyLjItNSA1IDIuMiA1IDUgNSIvPjxwYXRoIGZpbGw9IiM0MjQyNDIiIGQ9Ik0yMy44IDFjLTIuNS4yLTQuOCAyLTQuOCA1LjZWOGwxIDFWNmw2LjMtMi4yTDI4IDZ2M2wxLTFWNi44YzAtMi40IDAtNC4yLTMtNC44bC0uNS0xaC0xLjd6Ii8+PHBhdGggZmlsbD0iIzI2MzIzOCIgZD0iTTIzIDQ3bDEtMTUgMSAxNSIvPjwvc3ZnPg==");}
body.svgui #main .content .list .details .title .age.genderc,
body.svgui #main .top-section .sub-nav a[href="/couple-cams/"]{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0ZGOTgwMCIgZD0iTTE1IDEyLjJoLTR2M2wyIC4zIDItLjMiLz48cGF0aCBmaWxsPSIjRkZCNzREIiBkPSJNMjAuNyAzM2wyLjMtMi44LTIuNy04LjYtMyAxTTggMzRsLTMtMnYtNGgzbTUtMTRjLTIuOCAwLTUtMi4yLTUtNXMyLjItNSA1LTUgNSAyLjIgNSA1LTIuMiA1LTUgNSIvPjxwYXRoIGZpbGw9IiM0MjQyNDIiIGQ9Ik0xMi44IDJDMTAuMyAyLjIgOCA0IDggNy42VjlsMSAxVjdsNi4zLTIuMkwxNyA3djNsMS0xVjcuOGMwLTIuNCAwLTQuMi0zLTQuOGwtLjUtMWgtMS43eiIvPjxwYXRoIGZpbGw9IiNFM0YyRkQiIGQ9Ik0xNSAxNS4ybC0yIC4zLTItLjNjLS43IDAtMSAuMy0xIC4zTDEzIDI4bDMtMTIuNS0xLS4zeiIvPjxwYXRoIGZpbGw9IiMzNzQ3NEYiIGQ9Ik0yMSAyM2MtMS00LjItMi41LTYuNi01LjItNy42aC4yTDEzIDI4bC0zLTEyLjVjLTMuMiAxLjItNSA0LTUgNy41djZsMyAydjNsMSAxM2g4bDEtMTN2LTkuNmwxLjcgNS40IDIuNy0xLjZMMjEgMjN6TTExIDE0bDIgMS41LTIgMS41cy0uNi0uMy0uNi0xLjUuNi0xLjUuNi0xLjV6bTQgM2wtMi0xLjUgMi0xLjVzLjUuMy41IDEuNVMxNSAxNyAxNSAxN3oiLz48cGF0aCBmaWxsPSIjRjlBODNEIiBkPSJNMjQgMzNsLTEuNS0zLjIgNC43LTcuNyAyLjUgMS44Ii8+PHBhdGggZmlsbD0iI0Y5QTgzRCIgZD0iTTI1IDIzdjIuNmwzIDJMMjkgNDdoOGwxLTE0IDMtMnYtOGMwLTQuNC0zLjYtOC04LThzLTggMy42LTggOHoiLz48cGF0aCBmaWxsPSIjQkYzNjBDIiBkPSJNMzcgMTVzLTEtMS00LTEtNCAxLTQgMVY2aDh2OXoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNMzUgMTJoLTR2M3MwIDIgMiAyIDItMiAyLTJ2LTN6Ii8+PHBhdGggZmlsbD0iI0ZGQjc0RCIgZD0iTTMzIDE0Yy0yLjggMC01LTIuMi01LTVzMi4yLTUgNS01IDUgMi4yIDUgNS0yLjIgNS01IDUiLz48cGF0aCBmaWxsPSIjRkY1NzIyIiBkPSJNMzMgMmMtMyAwLTcgMS03IDEwbDMgM1Y4LjVMMzUgNWwyIDIuNVYxNWwzLTNjMC0yIDAtOS01LTlsLS41LTFIMzN6Ii8+PHBhdGggZmlsbD0iI0JCREVGQiIgZD0iTTM3LjYgMjNINDFjMC0zLjctMi42LTctNi03LjcgMCAuNS0uNCAxLjctMiAxLjctMS43IDAtMi0xLjItMi0xLjctMy40LjgtNiA0LTYgNy43aDMuNGwtNCAxNXMxLjQgMiA4LjYgMiA4LjYtMiA4LjYtMmwtNC0xNXoiLz48L3N2Zz4=")}
body.svgui #main .content .list .details .title .age.genders,
body.svgui #main .top-section .sub-nav a[href="/trans-cams/"]{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0ZGQjc0RCIgZD0iTTE5IDMxdjFsLTMtMnYtOGwzIDJ2N3ptMTAtN3Y4bDMtMnYtOGwtMyAyem0tNS0xMWMyLjggMCA1LTIuMiA1LTVzLTIuMi01LTUtNS01IDIuMi01IDUgMi4yIDUgNSA1TTI4LjYgMzcuNkwyOCA0N2gtOGwtLjYtOS40YzEgLjIgMi42LjQgNC42LjRzMy41LS4yIDQuNi0uNHoiLz48cGF0aCBmaWxsPSIjRkY5ODAwIiBkPSJNMjIgMTR2LTEuNGMuNi4yIDEuMy40IDIgLjRzMS40LS4yIDItLjRWMTRzMCAyLTIgMi0yLTItMi0yem0xIDMzaDJsLTEtOS0xIDl6Ii8+PHBhdGggZmlsbD0iIzhCQzM0QSIgZD0iTTE2IDIybDMgMnYxNWgxMHYtMTVsMy0yYzAtNC40LTMuNi04LTgtOHMtOCAzLjYtOCA4Ii8+PHBhdGggZmlsbD0iI0ZGOTgwMCIgZD0iTTI0IDEzYy0uNyAwLTEuNC0uMi0yLS40VjE0czAgMiAyIDIgMi0yIDItMnYtMS40Yy0uNi4yLTEuMy40LTIgLjR6Ii8+PHBhdGggZmlsbD0iI0ZGNTcyMiIgZD0iTTIzLjggMWMtMi41LjItNC44IDItNC44IDUuNlY4bDEgMVY2bDYuMy0yLjJMMjggNnYzbDEtMVY2LjhjMC0yLjQgMC00LjItMy00LjhsLS41LTFoLTEuN3oiLz48L3N2Zz4=");}
body.svgui #main .top-section .sub-nav a[href="/auth/login/"]{background-size:35px 35px;background-position:7.5px 0;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0ZGQTAwMCIgZD0iTTMwIDQxbC00IDRoLTRsLTQtNFYyMWgxMnY4bC0yIDIgMiAydjJsLTIgMiAyIDIiLz48cGF0aCBmaWxsPSIjRkZBMDAwIiBkPSJNMzggNy44Yy0uNS0xLjgtMi0zLjEtMy43LTMuNkMzMS45IDMuNyAyOC4yIDMgMjQgM3MtNy45LjctMTAuMyAxLjJDMTIgNC43IDEwLjUgNiAxMCA3LjhjLS41IDEuNy0xIDQuMS0xIDYuNyAwIDIuNi41IDUgMSA2LjcuNSAxLjggMS45IDMuMSAzLjcgMy41IDIuNC42IDYuMSAxLjMgMTAuMyAxLjNzNy45LS43IDEwLjMtMS4yYzEuOC0uNCAzLjItMS44IDMuNy0zLjVzMS00LjEgMS02LjdjMC0yLjctLjUtNS4xLTEtNi44ek0yOSAxM0gxOWMtMS4xIDAtMi0uOS0yLTJWOWMwLS42IDMuMS0xIDctMXM3IC40IDcgMXYyYzAgMS4xLS45IDItMiAyeiIvPjxwYXRoIGZpbGw9IiNENjg2MDAiIGQ9Ik0yMyAyNmgydjE5aC0yeiIvPjwvc3ZnPg==");}
body.svgui #main .top-section .sub-nav a[href="/spy-on-cams/"]{background-size:35px 35px;background-position:7.5px 0;background-image:url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDggNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0iIzQ1NUE2NCIgZD0iTTM2LjMgMzRIMTEuN0w1IDI5czMuMy03IDE5LTcgMTkgNyAxOSA3bC02LjcgNXptMCAwSDExLjdMOCA0MGwxNiAzIDE2LTMiLz48Y2lyY2xlIGZpbGw9IiNGRkE3MjYiIHI9IjIuNSIgY3k9IjI1LjUiIGN4PSIxNC41Ii8+PGNpcmNsZSBmaWxsPSIjRkZBNzI2IiByPSIyLjUiIGN5PSIyNS41IiBjeD0iMzMuNSIvPjxwYXRoIGZpbGw9IiM0MjQyNDIiIGQ9Ik0zNCAyN2wyLTN2LTNIMTJ2M2wyIDMiLz48cGF0aCBmaWxsPSIjRkZCNzREIiBkPSJNMzQgMjEuMmMwLTguNS0yMC01LjUtMjAgMFYyOWMwIDUuNSA0LjUgMTAgMTAgMTBzMTAtNC41IDEwLTEwdi03Ljh6Ii8+PHBhdGggZmlsbD0iIzI2MzIzOCIgZD0iTTE2IDI3bC00LTN2LTJsNCAzIDEgMW0xNSAxbDQtM3YtMmwtNCAzLTEgMSIvPjxwYXRoIGZpbGw9IiMyNjMyMzgiIGQ9Ik0yNi4zIDI1LjZjLS4zIDAtMS43LjQtMi4zLjRzLTItLjQtMi4zLS40TDE1IDI1bC43IDMuM2MuMiAxIC44IDEuNiAxLjYgMiAuNy40IDEuNi43IDIuNy43IDIuMyAwIDMtMiAzLTMgMC0uNi40LTEgMS0xczEgLjQgMSAxYzAgMSAuNyAzIDMgMyAxIDAgMi0uMyAyLjctLjcuOC0uNCAxLjQtMSAxLjYtMkwzMyAyNWwtNi43LjZ6Ii8+PGVsbGlwc2UgZmlsbD0iIzU0NkU3QSIgY3g9IjI0IiBjeT0iMjAiIHJ4PSIxOSIgcnk9IjYiLz48cGF0aCBmaWxsPSIjNjA3RDhCIiBkPSJNMjguNyA1QzI3IDUgMjYgNiAyNCA2cy0yLjgtMS00LjctMWMtMy40IDAtNSA2LjgtNi4zIDEyLjQgMCAzLjQgNyAzLjYgMTEgMy42czExIDAgMTEtMy42QzMzLjUgMTEuNCAzMiA1IDI4LjcgNXoiLz48L3N2Zz4=");}
body.svgui #main .top-section .sub-nav a[href*="/b/"]{background-size:35px 35px;background-position:7.5px 0;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzQ1NUE2NCIgZD0iTTM2LjUgNDRoLTI1Yy0xLjEgMC0xLjgtMS4yLTEuMy0yLjJMMTMgMzdoMjJsMi43IDQuOGMuNiAxLS4xIDIuMi0xLjIgMi4yeiIvPjxjaXJjbGUgZmlsbD0iIzc4OTA5QyIgY3g9IjI0IiBjeT0iMjMiIHI9IjE4Ii8+PHBhdGggZmlsbD0iIzQ1NUE2NCIgZD0iTTI0IDM1Yy02LjYgMC0xMi01LjQtMTItMTJzNS40LTEyIDEyLTEyIDEyIDUuNCAxMiAxMi01LjQgMTItMTIgMTJ6Ii8+PGNpcmNsZSBmaWxsPSIjNDJBNUY1IiBjeD0iMjQiIGN5PSIyMyIgcj0iOSIvPjxwYXRoIGZpbGw9IiM5MENBRjkiIGQ9Ik0yOC44IDIwYy0xLjItMS40LTMtMi4yLTQuOC0yLjJzLTMuNi44LTQuOCAyLjJjLS41LjUtLjQgMS4zLjEgMS44czEuMy40IDEuOC0uMWMxLjUtMS43IDQuMy0xLjcgNS44IDAgLjMuMy42LjQgMSAuNC4zIDAgLjYtLjEuOS0uMy40LS40LjUtMS4zIDAtMS44eiIvPjwvc3ZnPg==");}
body.svgui #main .top-section .sub-nav a[href^="/b/"]{background-size:35px 35px;background-position:7.5px 0;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzdCMUZBMiIgZD0iTTI0IDI4Yy0yLjIgMC00LTEuOC00LTRzMS44LTQgNC00IDQgMS44IDQgNC0xLjggNC00IDR6Ii8+PHBhdGggZD0iTTMxLjYgMzMuNmwtMy0yLjcgMS40LTJjMS4zLTEuNyAyLTMuNiAyLTUuNnMtLjctNC0yLTUuNWwtMS40LTEgMy0yLjdMMzMgMTZjMiAyIDMgNSAzIDhzLTEgNS44LTMgOGwtMS40IDEuNnptLTE1IDBMMTUgMzJjLTItMi0zLTUtMy04czEtNiAzLThsMS4zLTEuNiAzIDIuNy0xLjMgMmMtMS4zIDEtMiAzLTIgNXMuNyA0IDIgNS42bDEuNCAxLjUtMyAyLjR6IiBmaWxsPSIjOUMyN0IwIi8+PHBhdGggZD0iTTM3LjQgMzkuNGwtMy0yLjcgMS4zLTEuNWMyLjgtMyA0LjMtNyA0LjMtMTEuMiAwLTQtMS41LTgtNC4zLTExLjJsLTEuMy0xLjUgMy0yLjYgMS4zIDEuNUM0MiAxNCA0NCAxOSA0NCAyNHMtMiAxMC01LjMgMTRsLTEuMyAxLjR6bS0yNi44IDBMOS4zIDM4QzYgMzQgNCAyOSA0IDI0czItMTAgNS4zLTE0bDEuMy0xLjMgMyAyLjYtMS4zIDEuNUM5LjUgMTUuOCA4IDE5LjggOCAyNGMwIDQgMS41IDggNC4zIDExLjJsMS4zIDEuNS0zIDIuNnoiIGZpbGw9IiNDRTkzRDgiLz48L3N2Zz4=");}
body.svgui #main .top-section .sub-nav a[href*="/p/"]{background-size:35px 35px;background-position:7.5px 0;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzYwN0Q4QiIgZD0iTTM5LjYgMjcuMmwuMi0yLjItLjItMi4yIDQuNS0zLjJjLjYtLjMuOC0xIC41LTEuNEw0MCAxMC44Yy0uMy0uNS0uOC0uNy0xLjMtLjRsLTUgMi4zYy0xLjItMS0yLjQtMS42LTMuOC0yLjJMMjkuMiA1YzAtLjUtLjUtMS0xLTFoLTguNmMtLjUgMC0xIC41LTEgMWwtLjUgNS41Yy0xLjQuNi0yLjcgMS4zLTMuOCAyLjJsLTUtMi4zYy0uNS0uMi0xIDAtMS4zLjRsLTQgNy40Yy0uNC41LS4yIDEgLjIgMS40bDQuNSAzLjItLjIgMi4yLjIgMi4yTDQgMzAuNGMtLjQuMy0uNiAxLS4zIDEuNEw4IDM5LjJjLjMuNS44LjcgMS4zLjRsNS0yLjNjMS4yIDEgMi40IDEuNiAzLjggMi4ybC43IDUuNWMwIC41LjUgMSAxIDFoOC42Yy41IDAgMS0uNSAxLTFsLjUtNS41YzEuNC0uNiAyLjctMS4zIDMuOC0yLjJsNSAyLjNjLjUuMiAxIDAgMS4zLS40bDQuMi03LjRjLjQtLjUuMi0xLS4yLTEuNGwtNC4yLTMuMnpNMjQgMzVjLTUuNSAwLTEwLTQuNS0xMC0xMHM0LjUtMTAgMTAtMTAgMTAgNC41IDEwIDEwLTQuNSAxMC0xMCAxMHoiLz48cGF0aCBmaWxsPSIjNDU1QTY0IiBkPSJNMjQgMTNjLTYuNiAwLTEyIDUuNC0xMiAxMnM1LjQgMTIgMTIgMTIgMTItNS40IDEyLTEyLTUuNC0xMi0xMi0xMnptMCAxN2MtMi44IDAtNS0yLjItNS01czIuMi01IDUtNSA1IDIuMiA1IDUtMi4yIDUtNSA1eiIvPjwvc3ZnPg==");}

#main .list>li .control{display:none;position:absolute;top:0;left;0;}
#main .list>li:hover .control{display:block;}
#main .list>li .control>div{display:none;float:left;width:22px;height:22px;cursor:pointer;}
#main .list>li .control>div.fav{display:block;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0IwQkVDNSIgZD0iTTkuNTQgNDEuM0w2IDQybC43LTMuNTMgMTIuNzQtMTIuNzMgMi44MiAyLjgyIi8+PHBhdGggZmlsbD0iI0NENUYxNCIgZD0iTTI4LjA3IDI3LjFMMjEgMjAuMDUgMzQgOWw1IDUiLz48cGF0aCBmaWxsPSIjRjQ3MzIxIiBkPSJNMzMuNTIgNkwzMi4xIDcuNDJjLS43OC43OC0uNzggMi4wNCAwIDIuODJsNS42NiA1LjY2Yy43OC43OCAyLjA0Ljc4IDIuODIgMEw0MiAxNC40OCAzMy41MiA2em0tNy40IDI5bDEuNDItMS40YzEuOTUtMS45NyAxLjk1LTUuMTMgMC03LjFsLTYuMDYtNi4wNGMtMS45NS0xLjk1LTUuMS0xLjk1LTcuMDcgMEwxMyAyMS44OCAyNi4xMiAzNXoiLz48L3N2Zz4=");}
#main .list>li.fav .control>div.fav{display:block;background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iI0ZGQTUwMCIgZD0iTTI0IDRsNi41IDEzLjIgMTQuNSAyLTEwLjUgMTAuM0wzNyA0NGwtMTMtNy0xMyA3IDIuNS0xNC41TDMgMTkuM2wxNC41LTIiLz48L3N2Zz4=");}

`,'cb-mini');
//
// // jquery on-load code:
(function($,undefined){$(function(){$(document).ready(function(){
// ==jQ==
//
// remove redirection in external links (/external_link/?url=...)
$('a[href]').each(function(i,e){
 var x=$(this).attr('href');
 x=/\/external_link\/\?url=(.*)&domain=.*/i.exec(x);
 if(x&&x[1]&&(x=decodeURIComponent(x[1])))$(this).attr('href',x);
});
// make player on top of bio elements with absolute or fixed position (element.style.position=absolute|fixed)
$('.info-user .bio dl').each(rem_fix);
function rem_fix(i,e)
{
 if( $(this).attr('style') && /(fixed|absolute)/.test($(this).css('position')) )
  // just ignore it, change z-index lower than player
  $(this).css('zIndex',-1);
 $.each($(e).children(),rem_fix);
}
// add login (body div#header div.nav-bar ul#nav li.login-link) to sub-menu (body div#main div.top-section ul.sub-nav)
if(!$('#user_information').length)
  //-v0.04-// $('#main .top-section .sub-nav').append($('<li>'+$('#header .nav-bar .login-link').clone().wrap('<p>').parent().html()+'</li>'));
 $('#main .top-section .sub-nav').append($('#header .nav-bar .login-link').parent().detach()); // -v0.05- //
// add broadcast menu (body div#header div.nav-bar ul#nav li a[href^="/b/"]) to sub-menu (body div#main div.top-section ul.sub-nav)
else if(!$('#mybroadcast-nav-tab').length)
 $('#main .top-section .sub-nav').append($('#header .nav-bar li a[href^="/b/"]').parent().detach());
// remove watermark on flash video
var x=$('#xmovie');
if(x.length)
{
 x.attr('value',x.attr('value').replace('&elu=https://ssl-ccstatic.highwebmedia.com/images/flashwatermark.png',''));
}
else
{
 if(typeof window.EmbedViewerSwf!='undefined')
 {
  var u=window.EmbedViewerSwf;
  window.EmbedViewerSwf=function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t){return u(a,b,c,d,e,f,g,h,i,j,k,l,m,'',o,p,q,r,s,t);};
 }
}
// remove tip sound
window.PlayBeep=function(a){};
window.play_html_sound_level=function(a,b){};
// add a scroll-to-top button
$('#main .content .c-1').after('<ul class="paging to_top on_top"><li><a href="#to_top" class="prev">TOP</a></li></ul>');
$(window).scroll(function(){if($(this).scrollTop()>100)$('.to_top').removeClass('on_top');else $('.to_top').addClass('on_top');});
$('.to_top').click(function(){$('html, body').stop().animate({scrollTop:0},500);return false;});
// add href to profile menu link
x=$('#main .top-section .active a[href="#"]');
if(x.length)x.attr('href',window.location.href);

// create config section to select options, saved in localStorage
$('#main .top-section .sub-nav').prepend('<li><div id="config-menu"></div></li>');
$('#config-menu').click(function(e){$(this).toggleClass('show');});
// set options: option, default, selector, class
[
 ['toup-size',0,'.to_top','big'],
 ['dark-mode',0,'body','night'],
 ['auto-load',0,'#auto-load','yes'],
 ['hide-info',0,'body','clean'],
 ['menu-text',0,'body','svgui'],
 ['favs-list','',null,null]
].forEach(function(o){
 if(o[2])$('#main .top-section .sub-nav #config-menu').append('<div id="'+o[0]+'"></div>');
 if(window.localStorage.getItem(o[0])===null)window.localStorage.setItem(o[0],o[1]);
 if(window.localStorage.getItem(o[0])==1)$('#'+o[0]+(o[2]?','+o[2]:'')).addClass(o[3]);
 if(o[3]!==null)$('#'+o[0]).click(function(e){
  window.localStorage.setItem(o[0],window.localStorage.getItem(o[0])==1?0:1);
  $('#'+o[0]+(o[2]?','+o[2]:'')).toggleClass(o[3]);
  e.preventDefault();
  return false;
 });
});

// change style in the night (now is optional dark-mode)
// setInterval((function(){var x=(new Date()).getHours();if(x>=20||x<8&&window.localStorage.getItem('auto-dark')==1)$('body').addClass('night')})(),20*60*1000);

// auto refresh preview images and add custom favorites in preview:
//  on every reload_room event, sort with favorites first, and replace img.src with no-cache param
//  to set favorites, we add a .control div to the element
if(window.reload_rooms)
{
 // auto refresh preview images: replace img.src with no-cache param
 var listImageRefresh = function(o)
 {
  $(o).find('.list>li>a>img').each(function(){
   var a=(new Date()).getTime(),b=$(this).attr('src'),c=b.replace(/([?&])_=([^&]*)/,'$1_='+a);
   $(this).attr('src',c+(c===b?(/\?/.test(b)?'&':'?')+'_='+a:''));
  });
 };
 var listThumbPreview = function(o,n)
 {
   n=$(n).find('.list>li');
   o=$(o).children('.list');
   $(n).each(function(){$(this).append('<div class="control"><div class="fav"></div></div>');});
   $(o).html('');
   var favs=(window.localStorage.getItem('favs-list')||'').split(',');
   favs.forEach(function(i){
    var e=$(n).find('>a[href="/'+i+'/"]');
    if(e.length)$(o).append((e.parent()).addClass('fav').detach());
   });
   $(n).each(function(){if(!$(this).hasClass('fav'))$(o).append(this);});
 };
 var elemIndirectLoad = function(o,a)
 {
  $('<p>').load(a,function()
  {
   listThumbPreview(o,this);
   if(window.localStorage.getItem('auto-load')==1)listImageRefresh(o);
  });
 };
 $(".endless_page_template").each(function(){listThumbPreview(this,this);});
 // new .control commands
 $('#main .endless_page_template').on('click','.control .fav',function(){
  var p=$(this).parents('.list'),o=$(this).parents('.list>li'),n=0;
  o.toggleClass('fav').detach();
  if(o.hasClass('fav')){p.prepend(o);n=1;}else p.children(':eq('+p.children("li.fav").length+')').before(o);
  var name=o.find('>a').attr('href').split('/').join(''),
  favs=(window.localStorage.getItem('favs-list')||'').split(',').filter(function(v){return v!==name;});
  if(n)favs.unshift(name);
  window.localStorage.setItem('favs-list',favs.join(','));
 });
 // re-define reload functions with new load proccess
 window.reload_rooms.on_timeout=function()
 {
  $.ajaxSetup({cache:false});
  $(".endless_page_template").each(function()
  {
   var href=$(this).attr("data-href")||window.location.href;
   href+=(~href.indexOf('?')?'&':'?')+$("#filter_search_form").serialize();
   elemIndirectLoad(this,href);
  });
  reload_rooms.schedule_refresh();
 };
 window.reload_rooms.schedule_refresh=function()
 {
  setTimeout(window.reload_rooms.on_timeout, window.reload_rooms.delay);
 };
 $("#filter_location_form input[type='checkbox']").click(function()
 {
  $(".searching-note").show();
  $.ajax({type:'POST',url:$("#filter_location_form").attr("action"),data:$("#filter_location_form").serialize(),
   success:function(data)
   {
    elemIndirectLoad($(".endless_page_template"),window.location.href);
    $(".searching-note").hide();
   }
  });
  return true;
 });
 $("#filter_options_form").click(function()
 {
  $(".searching-note").show();
  $.ajax({type:'POST',url:$("#filter_options_form").attr("action"),data:$("#filter_options_form").serialize(),
   success:function(data)
   {
    elemIndirectLoad($(".endless_page_template"),window.location.href);
    $(".searching-note").hide();
   }
  });
  return true;
 });
 $("#filter_search_form input[type='submit']").click(function()
 {
  var skey=$("#id_keywords").val();
  var search_message=interpolate(gettext("Searching for %(skey)s ..."),{skey:skey},true);
  $(".searching-keyword h1").text(search_message);
  $(".searching-keyword").show();
  elemIndirectLoad($(".endless_page_template"),$("#filter_search_form").attr("action")+'?'+$("#filter_search_form").serialize());
  return false;
 });
}
// header size for auto scroll down video process
if(window.resizable_player)window.resizable_player.vertical_buffer=0;
//
// ==/jQ==
});});})(window.jQuery.noConflict(true));
