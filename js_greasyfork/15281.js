  // ==UserScript==
// @name         Theme WorldAide Jaune
// @namespace     http://www.worldaide.fr/*
// @version      1.0
// @description  enter something useful
// @author       Marentdu93
// @match        http://www.worldaide.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15281/Theme%20WorldAide%20Jaune.user.js
// @updateURL https://update.greasyfork.org/scripts/15281/Theme%20WorldAide%20Jaune.meta.js
// ==/UserScript==
$('#logo img').remove();
$('#logo').append('<a href="http://www.worldaide.fr/"><span></span><img src="http://i.imgur.com/hDuDfHj.png" width="170" height="120" alt=""></a>')

 $(document).ready(function(){

                var css = '#header{background:url(http://image.noelshack.com/fichiers/2014/40/1412102899-header.png) repeat scroll 0 0 #CEC801;box-shadow:0 5px 5px rgba(0,0,0,.3) inset}#content{border-top:4px solid #CEC801;box-shadow:0 -1px 0 rgba(0,0,0,.2)}.profilePage .mast .section.infoBlock h3,.sidebar .section .primaryContent h3,.sidebar .section .secondaryContent h3{padding:4px 7px;margin:-10px -10px 5px;border-bottom:1px solid #CEC801;text-shadow:1px 1px rgba(0,0,0,.4)}.nodeList .categoryStrip{font-weight:700;font-size:12px;font-family:Arial,sans-serif;color:#FFF;text-shadow:1px 1px rgba(0,0,0,.2);background:url(styles/realitygaming/images/main/pattern4-ts.png) repeat-x scroll center bottom #CEC801;padding:5px 10px;margin:0;border-width:1px 1px 0;border-style:solid solid none;border-color:#CEC801;-moz-border-top-colors:none;-moz-border-right-colors:none;-moz-border-bottom-colors:none;-moz-border-left-colors:none;border-image:none;border-radius:3px;min-height:6px}.profilePage .mast .section.infoBlock h3,.sidebar .section .primaryContent h3,.sidebar .section .secondaryContent h3{font-size:13pt;font-family:"Open sans condensed",Arial,sans-serif;color:#FCFCFF;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #CEC801}.sidebar .section{border:1px solid #CEC801;border-radius:4px;background:url(http://i.imgur.com/68gxEWP.jpg)}.footer .pageContent{font-size:11px;color:#A5CAE4;background-color:#CEC801;margin-right:0;margin-left:0;border-top:4px solid #CEC801;overflow:hidden;width:100%}.discussionList .sectionHeaders{font-weight:700;font-size:12px;font-family:Arial,sans-serif;color:#A5CAE4;margin:3px auto 0;border-radius:2px 2px 0 0;text-shadow:1px 1px rgba(0,0,0,.2);padding:0;border-top:4px solid #9C27B0;overflow:hidden;width:100%;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #CEC801} .sectionMain{font-family:Arial;background-color:#FFF;padding:10px;margin:10px auto;border:1px solid #CEC801;border-radius:4px}.Menu .sectionFooter{background-color:#CEC801}.Menu div.primaryContent.menuHeader{color:#FFF!important;text-align:center!important;text-shadow:1px 1px 2px rgba(0,0,0,.6),-1px -1px 2px rgba(0,0,0,.2);color:#FFF!important;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #CEC801;border:none!important}.subHeading{font-weight:700;font-size:12px;font-family:Arial,sans-serif;color:#FFF;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #CEC801;padding:5px 10px;margin:3px auto 0;border-radius:2px 2px 0 0;text-shadow:1px 1px rgba(0,0,0,.2)}.sectionFooter{overflow:hidden;font-weight:700;font-size:12px;font-family:Arial,sans-serif;color:#FFF;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #CEC801;padding:5px 10px;margin:3px auto 0;border-radius:2px 2px 0 0;text-shadow:1px 1px rgba(0,0,0,.2)}.button,.callToAction span{background:url(http://i.imgur.com/cCDUvZI.png) no-repeat scroll 2% 98%,url(http://i.imgur.com/7llfRgy.png) no-repeat scroll 50% 2%,url(http://i.imgur.com/DX8I4hQ.png) no-repeat scroll 98% 2% #CEC801;transition:all .5s ease 0s;box-shadow:0 1px 3px rgba(0,0,0,.6) inset,0 1px 0 rgba(255,255,255,.1)} .heading,.xenForm .formHeader{font-size:11pt;font-family:"Open sans condensed",Arial,sans-serif;color:#F0F7FC;background:url(styles/realitygaming/images/main/pattern3-ts.png) repeat-x scroll center bottom #CEC801;padding:5px 10px;margin-bottom:3px;border-bottom:1px solid #176093;border-top-left-radius:5px;border-top-right-radius:5px}';

    $('head').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = '.menuVisiteur{position:fixed;top:0;left:50px;-webkit-box-shadow:0px 2px 5px rgba(206, 12, 38, 0.22);-moz-box-shadow:0px 2px 5px rgba(206, 12, 38, 0.22);-khtml-box-shadow:0px 2px 5px rgba(206, 12, 38, 0.22);box-shadow:0px 2px 5px rgba(206, 12, 38, 0.22);position:fixed;z-index:2147;-webkit-border-radius:0px 0px 3px 3px;-moz-border-radius:0px 0px 3px 3px;-khtml-border-radius:0px 0px 3px 3px;border-radius:0px 0px 3px 3px;border-top:none!important;border:1px solid rgb(106,155,179);border:1px solid #CEC801;_border:1px solid rgb(106,155,179);background:#CEC801 url("styles/realitygaming/images/main/pattern3-ts.png") repeat-x bottom!important;height:30px;line-height:10px;margin-top:-5px}';

    $('.menuVisiteur').append('<style>' + css + '</style>');
            });


$(document).ready(function(){

                var css = '.memberCard{max-width:850px!important;height:300px!important;box-shadow:none!important;-webkit-border-radius:0px!important;-moz-border-radius:0px!important;-khtml-border-radius:0px!important;border-radius:0px!important;padding-top:40px!important;background-color:rgba(0,0,0,0)!important;background-image:url("styles/premium/cm-rg-5.png"),url("styles/premium/cm-rg-4.png"),url("styles/premium/cm-rg-1.png")!important;background-position:691px 0%,2px 0%,50% 0%!important;background-repeat:no-repeat,no-repeat,no-repeat!important}';

    $('.memberCard').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = 'a:link,a:visited{color: #CEC801;text-decoration:none;transition:background-color 0.3s ease-in-out 0.2s,color 0.3s ease-in-out 0.2s,text-shadow 0.3s ease-in-out 0.2s,visibility 0.3s ease-in-out 0.2s,display 0.3s ease-in-out 0.2s;-webkit-transition:background-color 0.3s ease-in-out 0.2s,color 0.3s ease-in-out 0.2s,text-shadow 0.3s ease-in-out 0.2s,visibility 0.3s ease-in-out 0.2s,display 0.3s ease-in-out 0.2s;-moz-transition:background-color 0.3s ease-in-out 0.2s,color 0.3s ease-in-out 0.2s,text-shadow 0.3s ease-in-out 0.2s,visibility 0.3s ease-in-out 0.2s,display 0.3s ease-in-out 0.2s;';

    $('a:link, a:visited').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = '.PageNav a.currentPage{color:#fff;background:url(rgba.php?r=20&g=122&b=191&a=127);background:#CEC801;_filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#7F147ABF,endColorstr=#7F147ABF);border-color: #CEC801;position:relative}';

    $('.PageNav a.currentPage').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = '.breadcrumb .crust a.crumb{cursor:pointer;color: #CEC801;text-decoration:none;background-color:rgb(252,252,255);padding:0 10px 0 18px;margin-bottom:-1px;border-bottom:1px solid rgb(210,210,210);outline:0 none;-moz-outline-style:0 none;display:block;_border-bottom:none;line-height:30px;transition:none!important;-webkit-transition:none!important;-moz-transition:none!important;-ms-transition:none!important;-o-transition:none!important;height:30px}';

    $('.breadcrumb .crust a.crumb').append('<style>' + css + '</style>');
            });

$(document).ready(function(){

                var css = '::-webkit-scrollbar-thumb{cursor:pointer!important;-webkit-border-radius:10px;-webkit-border-radius:0px;-moz-border-radius:0px;-khtml-border-radius:0px;border-radius:0px;background:#CEC801}';

    $('head').append('<style>' + css + '</style>');
            });
    
    
    
    
     $(document).ready(function(){

                var css = '.node .forumNodeInfo.unread .nodeIcon, .node .categoryForumNodeInfo.unread .nodeIcon{background-image:url(http://i.imgur.com/pYKfiKR.png);background-repeat:no-repeat;background-position:0 -242px}';

    $('head').append('<style>' + css + '</style>');
            });
    
    
    
     $(document).ready(function(){

                var css = '.primaryContent a{color:#CEC801}';

    $('head').append('<style>' + css + '</style>');
            });
    
    
     $(document).ready(function(){

                var css = '.message .publicControls .Author:hover{-webkit-border-radius:3px;-moz-border-radius:3px;-khtml-border-radius:3px;border-radius:3px;color:#CEC801;-webkit-box-shadow:0px 0px 0px 1px rgba(44,110,188,0.4);-moz-box-shadow:0px 0px 0px 1px rgba(44,110,188,0.4);-khtml-box-shadow:0px 0px 0px 1px rgba(44,110,188,0.4);box-shadow:0px 0px 0px 1px rgba(206, 12, 38, 0.34)}';

    $('head').append('<style>' + css + '</style>');
            });
          $(document).ready(function(){

                var css = '.xenOverlay.memberCard{max-width:850px!important;height:300px!important;box-shadow:none!important;-webkit-border-radius:0px!important;-moz-border-radius:0px!important;-khtml-border-radius:0px!important;border-radius:0px!important;padding-top:40px!important;background-color:rgba(0,0,0,0)!important;background-image:url(http://i.imgur.com/SwwuxXY.png),url(http://i.imgur.com/a0O7Mpb.png),url(http://i.imgur.com/kz38PaR.png)!important;background-position:691px 0%,2px 0%,50% 0%!important;background-repeat:no-repeat,no-repeat,no-repeat!important}';

    $('head').append('<style>' + css + '</style>');
            });
    
    $(document).ready(function(){

                var css = '.xenOverlay.memberCard a.close{right:415px!important;top:13px!important;text-align:center;width:26px!important;height:24px!important;overflow:hidden;-webkit-border-radius:6px 6px 0px 0px!important;-moz-border-radius:6px 6px 0px 0px!important;-khtml-border-radius:6px 6px 0px 0px!important;border-radius:6px 6px 0px 0px!important;background:url(http://i.imgur.com/V9bXfOf.png) repeat top;-webkit-box-shadow:2px -1px 3px rgba(0,0,0,0.2);-moz-box-shadow:2px -1px 3px rgba(0,0,0,0.2);-khtml-box-shadow:2px -1px 3px rgba(0,0,0,0.2);box-shadow:2px -1px 3px rgba(0,0,0,0.2)}';

    $('head').append('<style>' + css + '</style>');
            });
$(document).ready(function(){

    var css = '.titleBar h1{color:#CEC801}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.buttonScroll:before{font-family:"FontAwesome";color:#FFF;background: #CEC801;text-shadow:0 0 0 transparent,1px 1px 1px rgba(0,0,0,0.8);padding:4px;border:1px solid rgb(0,0,0);border:1px solid rgba(0,0,0,0.1);_border:1px solid rgb(0,0,0);-webkit-border-radius:2px;-moz-border-radius:2px;-khtml-border-radius:2px;border-radius:2px}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '#taigachat_box{height:300px;border:1px solid #CEC801;padding:5px;margin:5px -2px 0 -2px;overflow:auto;overflow-y:scroll;font-size:11px;background: #FFFFFF url("http://i.imgur.com/dceVS6w.jpg") center no-repeat;-webkit-text-size-adjust:none}';

    $('head').append('<style>' + css + '</style>');

});

$(document).ready(function(){

    var css = '.bbCodeQuote .quoteContainer{overflow:hidden;position:relative;font-style:italic;font-size:9pt;background-color: rgba(206, 176, 12, 0.5);padding:10px;-webkit-border-radius:4px;-moz-border-radius:4px;-khtml-border-radius:4px;border-radius:4px;overflow:auto;min-height:30px}';

    $('head').append('<style>' + css + '</style>');

});




$(document).ready(function(){

    var css = '.bbCodeQuote .attribution{font-size:12px;color: rgb(255, 255, 255);background-color: rgba(147, 12, 206, 0.73);background-repeat:repeat-x;background-position:top;border-bottom: 1px solid rgba(147, 12, 206, 0.75);}';

    $('head').append('<style>' + css + '</style>');

});





$(document).ready(function(){

    var css = '.bbCodeQuote{border-color: rgba(147, 12, 206, 0.79);}';

    $('head').append('<style>' + css + '</style>');

});

$(document).ready(function(){

    var css = '.button.primary{background-color: #CEC801;background-image:none;color:white;text-shadow:none}';

    $('head').append('<style>' + css + '</style>');

});

$(document).ready(function(){

    var css = '.button.primary:hover{background-color:#CEC801;background-image:none;color:white;border:none!important}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.secondaryContent a{color: #CEC801;}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.Popup .PopupControl:hover,.Popup.PopupContainerControl:hover{color:#CEC801;text-decoration:none}}';

    $('head').append('<style>' + css + '</style>');

});

$(document).ready(function(){

    var css = '::-webkit-scrollbar-thumb{cursor:pointer!important;-webkit-border-radius:10px;-webkit-border-radius:0px;-moz-border-radius:0px;-khtml-border-radius:0px;border-radius:0px;background:#CEC801}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '::-webkit-scrollbar-thumb:hover{background:#CEC801}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.helpSideBar a:hover{background-image:none;color:#CEC801!important}';

    $('head').append('<style>' + css + '</style>');

});

$(document).ready(function(){

    var css = '.message .publicControls a.ReplyQuote:hover{text-decoration:none!important;color: #CEC801;}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.message .publicControls a.MultiQuoteControl:hover{text-decoration:none!important;color:#CEC801}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.xenOverlay .section,.xenOverlay .sectionMain{padding:0px;border:5px solid #032A46;-webkit-border-radius:3px;-moz-border-radius:3px;-khtml-border-radius:3px;border-radius:3px;-webkit-box-shadow:0px 20px 39px rgba(0,0,0,0.6);-moz-box-shadow:0px 20px 39px rgba(0,0,0,0.6);-khtml-box-shadow:0px 20px 39px rgba(0,0,0,0.6);box-shadow:0px 20px 39px rgba(0,0,0,0.6);border-color:rgb(3,42,70);border-color: rgba(206, 176, 12, 0.5);_border-color:rgb(3,42,70)}';

    $('head').append('<style>' + css + '</style>');

});

$(document).ready(function(){

    var css = '.button:hover,.callToAction span:hover{border:none!important;background:url("http://i.imgur.com/cCDUvZI.png") no-repeat 98% 0%,url("http://i.imgur.com/7llfRgy.png") no-repeat 2% 98%,url("http://i.imgur.com/DX8I4hQ.png") no-repeat 50% 2%;background-color: #CEC801}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.bbCodeBlock .type{font-size:12px;font-family:Arial,"Helvetica Neue",Helvetica,sans-serif;color: rgb(255, 255, 255);background-color: #CEC801;background-repeat:repeat-x;background-position:top;padding:3px 8px;border-bottom:1px solid rgba(147, 12, 206, 0.14);-webkit-border-top-left-radius:4px;-moz-border-radius-topleft:4px;-khtml-border-top-left-radius:4px;border-top-left-radius:4px;-webkit-border-top-right-radius:4px;-moz-border-radius-topright:4px;-khtml-border-top-right-radius:4px;border-top-right-radius:4px}';

    $('head').append('<style>' + css + '</style>');

});



$(document).ready(function(){

    var css = '.bbCodeBlock pre,.bbCodeBlock .code{font-size:10pt;font-family:Consolas,Courier New,Courier,monospace;background-color: #E4838F;background-repeat:repeat-x;background-position:top;padding:10px;-webkit-border-radius:5px;-moz-border-radius:5px;-khtml-border-radius:5px;border-radius:5px;word-wrap:normal;overflow:auto;line-height:1.24;min-height:30px;max-height:500px;_width:600px;direction:ltr}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.bbCodeBlock{margin:1em 172px 1em 0;border: 1px solid #E4A5A5;-webkit-border-radius:2px;-moz-border-radius:2px;-khtml-border-radius:2px;border-radius:2px}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.sharePage .textHeading{color: #CEC801!important;border-bottom: 1px dotted #CEC801;}';

    $('head').append('<style>' + css + '</style>');

});
$(document).ready(function(){

    var css = '.sidebar .secondaryContent{-webkit-border-radius:4px;-moz-border-radius:4px;-khtml-border-radius:4px;border-radius:4px;background: url(http://i.imgur.com/68gxEWP.jpg) no-repeat;}';

    $('head').append('<style>' + css + '</style>');

});
