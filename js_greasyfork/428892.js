// ==UserScript==
// @name           Futbolcup Duyuru

// @description    Bu script, yöneticinin yapacağı duyuruları oyun içinde almanızı sağlayacak.

// @version        1.0.1.2
// @icon           https://i.ibb.co/TBcPm2m/announcement.png

// @namespace      https://greasyfork.org/users/790242
// @author         Criyessei

// @supportURL     https://board.playzo.de/index.php/User/965-Oguzhan-Ozen/

// @include        /^https?:\/\/futbolcup.net.+/

// @require        https://code.jquery.com/jquery-3.3.1.min.js

// @compatible     chrome
// @compatible     firefox
// @compatible     opera

// @connect        greasyfork.org
// @connect        board.playzo.de

// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest

// @license        MIT

// @run-at         document-body
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/428892/Futbolcup%20Duyuru.user.js
// @updateURL https://update.greasyfork.org/scripts/428892/Futbolcup%20Duyuru.meta.js
// ==/UserScript==

/*globals $*/
/* eslint no-lone-blocks: 0 */

const checkUpdate = true;
const devoloperMode = false;

if(location.protocol!='https:'){ //Routing to secure protocol
    let pageHref = location.href;
    location.href = 'https'+pageHref.substring(pageHref.indexOf(':'));
    return;
}
else if(location.search.indexOf('action=logout')!=-1){
    location.href = location.origin; //Go main page
    return;
}

(async function() {
    'use strict';

    //Check if the script run for first time
    if(GM_getValue('data') == undefined) firstRun();

    //Make sure the game is fully loaded
    await sleep(1000);
    await gameLoad();

    //Check whether there is a new update for the script
    if(checkUpdate){
        let updateDialog = await checkVersion();
        if(updateDialog instanceof $){ //If the update dialog is shown
            await new Promise(function WaitDialogClosed(res, rej){
                let mo = new MutationObserver(function (e) {
                    if (e[0].removedNodes[0] == updateDialog[0]){
                        mo.disconnect();
                        return res();
                    }
                });
                mo.observe(updateDialog[0].parentElement, { childList: true });
            });
        }
    }

    //if a new announcement is published, it will be shown the user
    checkAnnouncement()
        .catch(err => {
        console.error(
            '%c[%c Futbolcup Duyuru %c]%c %cERROR%c|%c ' + err.message+ '\n\t' + err.stack,
            'background-color:black; color:white;',
            'font-weight:bold; background-color:DeepSkyBlue; color:black;',
            'background-color:black; color:white;',
            '',
            'font-weight:bold; color:Maroon',
            'color: gray;',
            ''
        );
    });
})();

function sleep(ms){
    return new Promise(res=> setTimeout(res, ms));
}
function gameLoad(){
    return new Promise(function(res,rej){
        setTimeout(function(){
            if(!$('#body').hasClass('loading')) res(10);
            else{
                let counter=0,
                    a = setInterval(function(){
                        ++counter;
                        if(!$('#body').hasClass('loading')){
                            clearInterval(a);
                            res(counter*50);
                        }
                    },50);
            }
        },10);
    });
}

function firstRun(){
    let data = {};
    data.lastReadAnnouncementId = null;
    GM_setValue('data', data);
}

function checkVersion(){
    let scriptLink = "https://greasyfork.org/scripts/428892-futbolcup-duyuru",
        scriptName = "Futbolcup%20Duyuru",
        versionControlLink = `${scriptLink}/code/${scriptName}.meta.js`,
        downloadLink = `${scriptLink}/code/${scriptName}.user.js`;

    return new Promise((res, rej) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: versionControlLink,
            onload: function(response) {
                let text = response.responseText,
                    b = text.indexOf('@version')+8,
                    b1 = text.indexOf('/',b),
                    version = text.substring(b,b1).trim(),
                    currentVersion = GM_info.script.version;
                if(version!=currentVersion){
                    let header = {
                        css : {'text-align':'center'},
                        content :
                        `<span class="icon" style="background:url(/designs/redesign/images/layout/icons_sprite.png?v=2.2.6.14231) 0 -1180px no-repeat;margin-Right:10px;float:left;margin:6px;"></span>`+
                        `"Futbolcup Duyuru" scriptinin ${version} versiyonu çıktı!!!`
                    };
                    let div = {
                        footer : !0,
                        close  : !0,
                        class  : 'container'
                    };
                    div.content =
                        `<img src="https://image.ibb.co/jrcFap/Untitled.png" style="height:73px; float:left; margin:-15px 0 0 -15px;">`+
                        `<p style="font-size:15px; margin-Bottom:10px; font-weight:bold; color:red; text-align:center;">`+
                        `   Mevcut versiyon ${currentVersion}`+
                        `   <label style="color:green; margin-Left:50px;">Yeni versiyon : ${version}</label>`+
                        `</p>`+
                        `<p style="font-size:14px; font-weight:bold; color:blue;">`+
                        `   Scripti güncellemek istiyorsanız , <a href="${downloadLink}" style="font-size:14px">buraya tıklayın</a>. Açılan sayfadan scripti güncelleyin. Daha sonra bu sayfayı yenileyin!! (F5 yada yenileme butonu)`+
                        `</p>`+
                        `<p style="margin-Top:20px;text-align:center;">${CreateButton('relaodPage', 'Sayfayı Yenile')}</p>`;
                    let updateDialog = showDialog(div,header);
                    $('#relaodPage').click(()=>location.reload());
                    res(updateDialog);
                }
                else{
                    console.log('[Version control] => %cVersion up to date.','color:green;');
                    res();
                }
            },
            onerror: function() {
                console.log('[Version control] => %cFail!','color:red;');
                res(-1);
            }
        });
    });
}
function checkAnnouncement(){
    return new Promise((res, rej) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://board.playzo.de/index.php/Thread/111164-Oyun-%C4%B0%C3%A7i-Duyuru/?pageNo=99999",
            onload: result => {
                try{
                    //Create page
                    let page = $('<html />').html(result.response);

                    //Getting announcements
                    let announcements = page.find('ul.wbbThreadPostList>li[id^="post"]');
                    if(!announcements.length) return rej(new Error("Error code 1"));

                    //Get last announcement
                    let lastAnnon = announcements.last();
                    if(!lastAnnon.attr('id').startsWith('post')) return rej(new Error("Error code 2"));
                    let lastAnnonId = parseInt(lastAnnon.attr('id').replace('post',''));
                    if(isNaN(lastAnnonId)) return rej(new Error("Error code 3"));

                    let data = GM_getValue('data');
                    if((!devoloperMode || false) && data.lastReadAnnouncementId==null){
                        //The announcement published before the script is run for the first time will not be displayed to the user.
                        data.lastReadAnnouncementId = lastAnnonId;
                        GM_setValue('data', data);
                        return res();
                    }

                    //Check whether the last announcement is read
                    let wasntRead = (data.lastReadAnnouncementId || 0) < lastAnnonId;
                    if(!wasntRead) {
                        console.log("Latest announcement["+lastAnnonId+"] is read. data.lastReadAnnouncementId=" + data.lastReadAnnouncementId);
                        return res(); //no any new announcement to show
                    }

                    //Show new announcement
                    showAnnouncement(lastAnnon);

                    //Announcement shown will not be displayed again
                    data.lastReadAnnouncementId = lastAnnonId;
                    GM_setValue('data', data);

                    res();
                }
                catch(err){
                    rej(err);
                }
            },
            onerror: function(err) {
                console.log('[Check Announcement] => %cFail!','color:red;');
                rej(err);
            }
        });
    });
}

function showDialog(div,header=undefined,setMid=true){
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    $('#container > .shadow').show();

    let focus = $('<div>').attr('id',div.id || null).css({
        'padding'   : '15px',
        'width'     : '580px',
        'wordWrap'  : 'break-word',
        'textAlign' : 'center!important',
        'box-sizing': 'border-box'
    }).css(div.css || {}).addClass('focus visible').addClass(div.class || null).html(div.content || '');

    if(typeof header == 'object'){
        let h2 = $('<h2>').css(header.css || {}).html(header.content || '').css({
            width        : '100%',
            paddingLeft  : '0px',
            paddingRight : '0px',
            top          : '0px',
            transform    : 'translateY(-100%)'
        });
        focus.prepend(h2);
    }

    if(div.footer) focus.append('<div class="footer"></div>');

    if(div.close) focus.append('<div class="close" style="position:absolute;top:-46px"></div>');

    $('#container').append(focus);

    setPosition(focus, 190, setMid);
    return focus;
}
function setPosition(focus, topOffset = 190, setMid=true){
    if(setMid){
        //Set In The Midst
        topOffset = 0/*$(window).scrollTop()*/ + ($(window).innerHeight() - focus.height()) / 2;
        if (topOffset < 190) topOffset = 190;
    }
    focus.css({
        'position': 'absolute',
        'top'     : topOffset + 'px',
        'left'    : ($(window).scrollLeft() + ($(window).innerWidth() / 2) - (focus.width() / 2 + focus.parent().offset().left)) + 'px'
    });
}

let styleAdded = false;
function showAnnouncement(newAnnon){
    if(!styleAdded){
        styleAdded = true;

        GM_addStyle(`
#announcement .containerPadding {padding: 14px 21px 14px;}
@media only screen and (max-width: 800px) {
#announcement .containerPadding {padding: 7px;}
}
@media only screen and (min-width: 641px) and (max-width: 800px) {
#announcement .containerPadding {padding-left: 14px;padding-right: 14px;}
}

#announcement .quoteBox {background-color: #eff6ed;clear: both;min-height: 28px;margin-bottom: 4px;position: relative; background-color: #eff6ed; border: 1px solid #365b1e; margin: 3px 0;}
#announcement .quoteBox.containerPadding {padding-left: 54px;}
#announcement .quoteBox::before {content: "‘‘"; color: #888888; font-family: FontAwesome; font-size: 45px; font-weight: bold; position: absolute; left: 12px; top: 1px;}
#announcement .quoteBox > header {padding-bottom: 4px;border-bottom: 1px dotted #365b1e;margin-bottom: 7px;}
#announcement .quoteBox > header > h3 {font-weight: bold;}
#announcement .quoteBox .quoteBox {background-image: none;padding-left: 21px;min-height: 0;}
#announcement .quoteBox .quoteBox::before {display: none;}
#announcement .quoteBox header > h3 > a{color:#894617;cursor: pointer; text-decoration: none;}

@media only screen and (max-width: 800px) {
#announcement .quoteBox::before {font-size: 14px;left: 7px;}
#announcement .quoteBox.containerPadding {padding-left: 28px;}
#announcement .quoteBox .quoteBox {padding-left: 7px;}
}

#announcement .spoilerBox {background-color: #eff6ed;clear: both;padding-bottom: 7px;}
#announcement .spoilerBox > header {margin-bottom: 7px;}
#announcement .spoilerBox > div {overflow: hidden;padding-bottom: 7px;}

#announcement .inlineCode {background-color: #eff6ed;border: 1px solid #365b1e;border-radius: 3px;display: inline-block;font-family: Consolas, 'Courier New', monospace;margin: 0 2px;padding: 0 5px;word-break: break-all;word-wrap: break-word;}
ul.smileyList > li {display: inline;}

#announcement .bbcodeTable {display: inline-block;}
@media screen and (max-width: 800px) {
#announcement .bbcodeTable {display: block;}
}
        `);
    }

    //Set announcement header
    let annonHeaderPrefix = "[Futbolcup Duyuru] ";
    let defaultAnnonHeader = "DUYURU";
    let annonHeader = newAnnon.find('div.messageHeadline > h1:first-child').text().trim();
    if(typeof annonHeader!="string" || annonHeader == "" || annonHeader.length<3) annonHeader = defaultAnnonHeader;


    let header = { //Scriptin açılış menüsünün baş kısmı
        content : annonHeaderPrefix + annonHeader,
        css : {'text-align':'center'}
    };
    let div = { //Scriptin açılış menüsünün içeriği
        footer : !0,
        close  : !0,
        class  : 'container'
    };

    let messageTextDiv = newAnnon.find('div.messageText:first');
    if(!messageTextDiv) throw new Error("Error code 4");

    messageTextDiv.find('.container').removeClass('container')
    messageTextDiv.find('a').attr('target','_blank');

    div.content =
        `<div id="announcement">` + messageTextDiv.html() + '</div>';

    let focus = showDialog(div,header);

    //Görüntü düzenleme
    {
        focus.removeClass('focus');
        focus.css({
            'z-index': 11,
            'text-align': 'left',
            'width': '580px',
            'border-left': '1px solid #747474',
            'border-right': '1px solid #747474'
        });
        focus.find('>h2').css({
            'position':'absolute',
            'left':'-1px',
            'width':'579px'
        });
        focus.find('>div.close').css({
            'right': '-12px',
            'height': '24px',
            'width': '24px',
            'background': 'url(https://futbolcup.net/designs/redesign/images/layout/close.png)',
            'cursor': 'pointer'
        });
        focus.find('>div.footer').css('width', '100%');
        setPosition(focus, 190, true);
    }

    let contentDiv = focus.find('#announcement');

    //Resimleri ayarlama
    {
        contentDiv.find('a.externalURL > img').each(function(){
            let a = $(this).parent();
            a.before(this);
            a.remove();
        });
        let contentWidth = contentDiv.width();
        contentDiv.find('img').each(function(){
            let t = $(this);
            if(t.width() > contentWidth){
                t.attr('width', '100%');
            }
        });
    }

    //Listeleri ayarlama
    {
        contentDiv.find('ul, ol').css({'padding-left':'40px'});
        contentDiv.find('li').css({
            'list-style': 'inherit'
        });
    }
}
function CreateButton(id,value,buttonStyle='',spanStyle=''){
    return `<span class="button disHighlight" id="${id}" style="cursor:pointer; ${buttonStyle}">`+
        `   <a class="button" style="text-decoration:none;">`+
        `      <span style="${spanStyle}">${value}</span>`+
        `   </a>`+
        `</span>`;
}