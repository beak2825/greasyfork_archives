         // ==UserScript==
// @name         Theme rouge
// @namespace     https://realitygaming.fr/*
// @version      1.0
// @description  enter something useful
// @author       Marentdu93
// @match        https://realitygaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13312/Theme%20rouge.user.js
// @updateURL https://update.greasyfork.org/scripts/13312/Theme%20rouge.meta.js
// ==/UserScript==

$(document).ready(function(){

                var css = '#header{background:url(http://image.noelshack.com/fichiers/2014/40/1412102899-header.png) repeat scroll 0 0 #FF0000;box-shadow:0 5px 5px rgba(0,0,0,.3) inset}#content{border-top:4px solid #FF0000;box-shadow:0 -1px 0 rgba(0,0,0,.2)}.profilePage .mast .section.infoBlock h3,.sidebar .section .primaryContent h3,.sidebar .section .secondaryContent h3{padding:4px 7px;margin:-10px -10px 5px;border-bottom:1px solid #D7EDFC;text-shadow:1px 1px rgba(0,0,0,.4)}.nodeList .categoryStrip{font-weight:700;font-size:12px;font-family:Arial,sans-serif;color:#FFF;text-shadow:1px 1px rgba(0,0,0,.2);background:url(styles/realitygaming/images/main/pattern4-ts.png) repeat-x scroll center bottom #FF0000;padding:5px 10px;margin:0;border-width:1px 1px 0;border-style:solid solid none;border-color:#FF0000;-moz-border-top-colors:none;-moz-border-right-colors:none;-moz-border-bottom-colors:none;-moz-border-left-colors:none;border-image:none;border-radius:3px;min-height:6px}.profilePage .mast .section.infoBlock h3,.sidebar .section .primaryContent h3,.sidebar .section .secondaryContent h3{font-size:13pt;font-family:"Open sans condensed",Arial,sans-serif;color:#FCFCFF;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #FF0000}.sidebar .section{border:1px solid #FF0000;border-radius:4px}.footer .pageContent{font-size:11px;color:#A5CAE4;background-color:#FF0000;margin-right:0;margin-left:0;border-top:4px solid #FF0000;overflow:hidden;width:100%}.discussionList .sectionHeaders{font-weight:700;font-size:12px;font-family:Arial,sans-serif;color:#A5CAE4;margin:3px auto 0;border-radius:2px 2px 0 0;text-shadow:1px 1px rgba(0,0,0,.2);padding:0;border-top:4px solid #FF0000;overflow:hidden;width:100%;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #FF0000} .sectionMain{font-family:Arial;background-color:#FFF;padding:10px;margin:10px auto;border:1px solid #FF0000;border-radius:4px}.Menu .sectionFooter{background-color:#FF0000}.Menu div.primaryContent.menuHeader{color:#FFF!important;text-align:center!important;text-shadow:1px 1px 2px rgba(0,0,0,.6),-1px -1px 2px rgba(0,0,0,.2);color:#FFF!important;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #FF0000;border:none!important}.subHeading{font-weight:700;font-size:12px;font-family:Arial,sans-serif;color:#FFF;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #FF0000;padding:5px 10px;margin:3px auto 0;border-radius:2px 2px 0 0;text-shadow:1px 1px rgba(0,0,0,.2)}.sectionFooter{overflow:hidden;font-weight:700;font-size:12px;font-family:Arial,sans-serif;color:#FFF;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #FF0000;padding:5px 10px;margin:3px auto 0;border-radius:2px 2px 0 0;text-shadow:1px 1px rgba(0,0,0,.2)}.button,.callToAction span{background:url(styles/realitygaming/images/gaming/ps3-r.png) no-repeat scroll 2% 98%,url(styles/realitygaming/images/gaming/xbox-r.png) no-repeat scroll 50% 2%,url(styles/realitygaming/images/gaming/ps4.png) no-repeat scroll 98% 2% #FF0000;transition:all .5s ease 0s;box-shadow:0 1px 3px rgba(0,0,0,.6) inset,0 1px 0 rgba(255,255,255,.1)} .heading,.xenForm .formHeader{font-size:11pt;font-family:"Open sans condensed",Arial,sans-serif;color:#F0F7FC;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #FF0000;padding:5px 10px;margin-bottom:3px;border-bottom:1px solid #176093;border-top-left-radius:5px;border-top-right-radius:5px}';

    $('head').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = '.menuVisiteur{position:fixed;top:0;left:50px;-webkit-box-shadow:0px 2px 5px #032A46;-moz-box-shadow:0px 2px 5px #032A46;-khtml-box-shadow:0px 2px 5px #032A46;box-shadow:0px 2px 5px #032A46;position:fixed;z-index:2147;-webkit-border-radius:0px 0px 3px 3px;-moz-border-radius:0px 0px 3px 3px;-khtml-border-radius:0px 0px 3px 3px;border-radius:0px 0px 3px 3px;border-top:none!important;border:1px solid rgb(106,155,179);border:1px solid #FF0000;_border:1px solid rgb(106,155,179);background:#FF0000 url("styles/realitygaming/images/main/pattern3-ts.png") repeat-x bottom!important;height:30px;line-height:10px;margin-top:-5px}';

    $('.menuVisiteur').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = '.memberCard{max-width:850px!important;height:300px!important;box-shadow:none!important;-webkit-border-radius:0px!important;-moz-border-radius:0px!important;-khtml-border-radius:0px!important;border-radius:0px!important;padding-top:40px!important;background-color:rgba(0,0,0,0)!important;background-image:url("styles/premium/cm-rg-5.png"),url("styles/premium/cm-rg-4.png"),url("styles/premium/cm-rg-1.png")!important;background-position:691px 0%,2px 0%,50% 0%!important;background-repeat:no-repeat,no-repeat,no-repeat!important}';

    $('.memberCard').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = 'a:link,a:visited{color: #FF0000;text-decoration:none;transition:background-color 0.3s ease-in-out 0.2s,color 0.3s ease-in-out 0.2s,text-shadow 0.3s ease-in-out 0.2s,visibility 0.3s ease-in-out 0.2s,display 0.3s ease-in-out 0.2s;-webkit-transition:background-color 0.3s ease-in-out 0.2s,color 0.3s ease-in-out 0.2s,text-shadow 0.3s ease-in-out 0.2s,visibility 0.3s ease-in-out 0.2s,display 0.3s ease-in-out 0.2s;-moz-transition:background-color 0.3s ease-in-out 0.2s,color 0.3s ease-in-out 0.2s,text-shadow 0.3s ease-in-out 0.2s,visibility 0.3s ease-in-out 0.2s,display 0.3s ease-in-out 0.2s;';

    $('a:link, a:visited').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = '.PageNav a.currentPage{color:#fff;background:url(rgba.php?r=20&g=122&b=191&a=127);background:rgba(254, 128, 1, 0.55);_filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#7F147ABF,endColorstr=#7F147ABF);border-color: #FF0000;position:relative}';

    $('.PageNav a.currentPage').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = '.breadcrumb .crust a.crumb{cursor:pointer;color: #FF0000;text-decoration:none;background-color:rgb(252,252,255);padding:0 10px 0 18px;margin-bottom:-1px;border-bottom:1px solid rgb(210,210,210);outline:0 none;-moz-outline-style:0 none;display:block;_border-bottom:none;line-height:30px;transition:none!important;-webkit-transition:none!important;-moz-transition:none!important;-ms-transition:none!important;-o-transition:none!important;height:30px}';

    $('.breadcrumb .crust a.crumb').append('<style>' + css + '</style>');
            });