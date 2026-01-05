// ==UserScript==
// @name         Xossip Better Live
// @namespace    http://tampermonkey.net/
// @version      2.051
// @description  Better Xossip Live Functionality
// @author       Casinaar
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require https://greasyfork.org/scripts/30498-xpcommon/code/XPCommon.js?version=208842
// @require https://greasyfork.org/scripts/31785-caretcode/code/CaretCode.js?version=208325
// @include      https://www.xossip.com/livenewreply.php*
// @include      https://xossip.com/livenewreply.php*
// @include      https://www.desiproject.com/livenewreply.php*
// @include      https://desiproject.com/livenewreply.php*
// @include      https://216.158.70.98/livenewreply.php*
// @include      https://www.xossip.rocks/livenewreply.php*
// @include      https://xossip.rocks/livenewreply.php*
// @include      https://www.exbii.com/livenewreply.php*
// @include      https://exbii.com/livenewreply.php*
// @downloadURL https://update.greasyfork.org/scripts/30238/Xossip%20Better%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/30238/Xossip%20Better%20Live.meta.js
// ==/UserScript==

this.$ = window.jQuery.noConflict(true);

var adminmode = false;  //set to true to remove 10s limit

var hidevar,keys,key_len,orig_title,textbox,table_anchor;
var observerConfig = {subtree: true,childList:true};
var targetNode = document.getElementById('row1');
var target = document.getElementById('qr_posting_msg');
var count=0;
var currindex = 0;
var flagcnt=0;
var codelink_stock,i;
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        $("#spy_table img[src*='smile'],#spy_table img[src*='smilie']").on('click',function(){insertSmileyCode(this);});
        $("#spy_table img[src*='customavatars']").on('click',function(){insertImage(this);});
        $('#spy_table .pagetext').on('dblclick',function(){doubleTapped(this);});
        if(document[hidevar]){
            count++;
            document.title="("+count+") "+orig_title;
        }
    });
});
function doubleTapped(x)
{
    var quoteobj=$(x).clone();
    if($(quoteobj).find('div').length>0)
        $(quoteobj).find('div').remove();
    quotePost(parseImg(codeParser(quoteobj[0])));
}
var observer1 = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
        flagcnt++;
        if(flagcnt==2&&!adminmode&&hidevar==="webkitHidden")
        {
            $('#qr_submit').prop('disabled','true');
            setTimeout(function(){$('#qr_submit').removeAttr('disabled');},10000);
            flagcnt=0;
        }
    });
});

$(document).ready(function(){
    orig_title = document.title;
    $([window, document]).on('focusin',function(){
        document.title=orig_title;
        count=0;
    });
    codelink_stock = Object.keys(XPsmileys)
        .filter(XPsmileys.hasOwnProperty.bind(XPsmileys))
        .reduce(function(obj, key) {
        obj[XPsmileys[key]] = key;
        return obj;
    }, {});
    keys = Object.keys(codelink_stock);
    key_len = keys.length;
    wrapperFunctions();
});

function wrapperFunctions()
{
    stripBBCodes = function(x){return x.replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '');};
    if((navigator.userAgent).match(/(Chrome|Edge|UCBrowser|OPR)/))
    {
        hidevar = "webkitHidden";
        parseImg = function(x){$(x).find('img').replaceWith(function(){return "[img]"+$(this)[0].src+"[/img]";});return x;};
        codeParser = function(x){ $(x).find('img').replaceWith(function(){return XPsmileys[$(this).attr('src')];});return x;};
        textbox = $('#vB_Editor_QR_textarea');
        getCurrentText = function(){return $(textbox).val();};
        getStrippedText = function(){return stripBBCodes(getCurrentText());};
        getLookupText = function(x){return x.substring(x.lastIndexOf(':'));};
        getTableInsertCoords = function(){return $(textbox)[0].getBoundingClientRect();};
        insertImage = function(x){$(textbox).val($(textbox).val()+'[img]'+$(x)[0].src+'[/img]').focus();$(textbox).focus();};
        quotePost = function(x){$(textbox).val(($(textbox).val()+'[QUOTE]'+x.innerText+'[/QUOTE]'));$(textbox).focus();};
        clickMenuAdd = function(x,currtext){$(textbox).val(currtext.substring(0,currtext.lastIndexOf(':'))+$(x).html());};
        enterMenuAdd = function(currtext){$(textbox).val(currtext.substring(0,currtext.lastIndexOf(':'))+$('.vbmenu_hilite').html());};
        getCaretObj = function(){return getCaretCoordinates($(textbox)[0],$(textbox)[0].selectionEnd);};
        sSmileyCommon();
        insertSmileyCode = function(x){var sourc = $(x)[0].src;sourc = XPsmileys[sourc.substring(sourc.indexOf('/images/'))];if(sourc === undefined) insertImage(x);else $(textbox).val($(textbox).val()+sourc);$(textbox).focus();};
        textbox.css('background-color','#ffffff');
    }
    else if((navigator.userAgent).match(/(Firefox)/))
    {
        hidevar = "hidden";
        setTimeout(function(){textbox = $('#vB_Editor_QR_iframe').contents().find('.wysiwyg');sSmileyCommon();textbox.css('background-color','#ffffff');},5000);
        parseImg = function(x){return x;};
        codeParser = function(x){return x;};
        insertImage = function(x){$(textbox).html($(textbox).html().replace('<br>','')+'[img]'+$(x)[0].src+'[/img]').focus();};
        getCurrentText = function(){return $(textbox).html().replace(/<br>/g,'&#10;');};
        getStrippedText = function(){return stripBBCodes(getCurrentText());};
        getLookupText = function(x){return x.substring(x.lastIndexOf(':')).replace(/&#10;/g,'');};
        getTableInsertCoords = function(){var tmp =  $('#vB_Editor_QR_iframe')[0].getBoundingClientRect();return {left:tmp.left,top:tmp.bottom};};
        clickMenuAdd = function(x,currtext){$(textbox).html(currtext.substring(0,currtext.lastIndexOf(':')).replace(/&#10;/g,'<br>')+$(x).html());};
        enterMenuAdd = function(currtext){$(textbox).html(currtext.substring(0,currtext.lastIndexOf(':')).replace(/&#10;/g,'<br>')+$('.vbmenu_hilite').html());};
        getCaretObj = function(){return {left:0,top:0};};
        quotePost = function(x){var tmp = $(x).html();if($(textbox).find('br').length!==0)$(textbox).find('br').last().before('[QUOTE]'+tmp+"[/QUOTE]");else$(textbox).append('[QUOTE]'+tmp+"[/QUOTE]");};
        insertSmileyCode = function(x){if($(textbox).find('br').length!==0)$(textbox).find('br').last().before($(x).clone());else$(textbox).append($(x).clone());};
    }
}
function sSmileyCommon()
{
    $('#qr_submit').click(function(){
        $('#userfield_menu').remove();
    });
    $(textbox).keydown(function (e){
        if($('#userfield_menu').length==1)
        {
            if(e.keyCode == 38)
            {
                $('.vbmenu_option').removeClass('vbmenu_hilite');
                e.preventDefault();
                $($('.vbmenu_option')[--currindex]).toggleClass('vbmenu_hilite');
                if(currindex<=1){currindex=$('.vbmenu_option').length;}
            }
            else if(e.keyCode == 40)
            {
                $('.vbmenu_option').removeClass('vbmenu_hilite');
                e.preventDefault();
                $($('.vbmenu_option')[++currindex]).toggleClass('vbmenu_hilite');
                if(currindex>=$('.vbmenu_option').length-1){currindex=0;}
            }
        }
    });
    $(textbox).on('input',function(){
        $('#userfield_menu').remove();
        var currtext=getCurrentText();
        var strippedtext=getStrippedText();
        if(strippedtext.substring(strippedtext.lastIndexOf(' ')+1).charAt(0)==':')
        {
            currindex=0;
            var lookuptext = getLookupText(currtext);
            var matched = smileyLookupAndTableGen(lookuptext);
            var caret = getCaretObj();
            var rect = getTableInsertCoords();
            if(matched !== "<tr><td style='background-color:#344E90; color:white;' colspan='2'><strong><center>Smiley Suggestions</center></strong></td></tr>")
                $('#qr_scroll')[0].outerHTML+='<div id="userfield_menu" class="vbmenu_popup" style="position: absolute; z-index: 50; clip: rect(auto auto auto auto); left: '+(rect.left+caret.left+window.scrollX)+'px; top: '+(rect.top+caret.top+window.scrollY)+'px;"><table cellpadding="4" cellspacing="1" border="1"><tbody><table cellpadding="4" cellspacing="1" border="1"><tbody>'+matched+'</tbody></table></tbody></table></div>';
            $('.vbmenu_hilite,.vbmenu_option').click(function(){
                currtext = getCurrentText();
                clickMenuAdd($(this),currtext);
                $('#userfield_menu').remove();
                $(textbox).focus();
            });
            $(textbox).keydown(function(e){
                if(e.keyCode == 13 && $('.vbmenu_hilite').length>0)
                {
                    currtext = getCurrentText();
                    e.preventDefault();
                    enterMenuAdd(currtext);
                    $('#userfield_menu').remove();
                    $(textbox).focus();
                }
            });
        }
    });
}
function smileyLookupAndTableGen(scode)
{
    var x;
    var tblcont="";
    tblcont="<tr><td style='background-color:#344E90; color:white;' colspan='2'><strong><center>Smiley Suggestions</center></strong></td></tr>";
    for(x=0;x<key_len&&scode.length>1;x++)
        if(~keys[x].indexOf(scode))
            tblcont+='<tr><td class="vbmenu_option" onmouseover="this.classList.add(\'vbmenu_hilite\')" onmouseleave="this.classList.remove(\'vbmenu_hilite\')">'+keys[x]+'</td><td style="background-color:#F5F5FF"><center><img src="'+codelink_stock[keys[x]]+'"></img></center></td></tr>';
    return tblcont;
}
observer.observe(targetNode, observerConfig);
observer1.observe(target, { attributes : true, attributeFilter : ['style'] });
