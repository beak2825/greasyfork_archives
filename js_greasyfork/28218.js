// ==UserScript==
// @name         Translator for Whatsapp
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/zh-CN/scripts/28218-translator-for-whatsapp
// @version      2.7.0
// @description  Translator for Whatsapp web
// @author       JedLiu
// @match        https://web.whatsapp.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28218/Translator%20for%20Whatsapp.user.js
// @updateURL https://update.greasyfork.org/scripts/28218/Translator%20for%20Whatsapp.meta.js
// ==/UserScript==

(function() {
'use strict';
/*************************************************************

       ATTENTION:
       All supported languages
       Remove // if you want to include this for translation

*************************************************************/
var all_languages = [
    {id:'zh-CN', name:'Chinese Simplified'},
    //{id:'zh-TW', name:'Chinese Traditional'},
    //{id:'af', name:'Afrikaans'},
    //{id:'sq', name:'Albanian'},
    {id:'ar', name:'Arabic'},
    //{id:'hy', name:'Armenian'},
    //{id:'az', name:'Azerbaijani'},
    //{id:'eu', name:'Basque'},
    //{id:'be', name:'Belarusian'},
    //{id:'bn', name:'Bengali'},
    //{id:'bs', name:'Bosnian'},
    //{id:'bg', name:'Bulgarian'},
    //{id:'ca', name:'Catalan'},
    //{id:'ceb', name:'Cebuano'},
    //{id:'ny', name:'Chichewa'},
    //{id:'co', name:'Corsican'},
    //{id:'hr', name:'Croatian'},
    //{id:'cs', name:'Czech'},
    //{id:'da', name:'Danish'},
    //{id:'nl', name:'Dutch'},
    {id:'en', name:'English'},
    //{id:'eo', name:'Esperanto'},
    //{id:'et', name:'Estonian'},
    //{id:'tl', name:'Filipino'},
    //{id:'fi', name:'Finnish'},
    {id:'fr', name:'French'},
    //{id:'fy', name:'Frisian'},
    //{id:'gl', name:'Galician'},
    //{id:'ka', name:'Georgian'},
    {id:'de', name:'German'},
    //{id:'el', name:'Greek'},
    //{id:'gu', name:'Gujarati'},
    //{id:'ht', name:'Haitian Creole'},
    //{id:'ha', name:'Hausa'},
    //{id:'haw', name:'Hawaiian'},
    //{id:'iw', name:'Hebrew'},
    {id:'hi', name:'Hindi'},
    //{id:'hmn', name:'Hmong'},
    //{id:'hu', name:'Hungarian'},
    //{id:'is', name:'Icelandic'},
    //{id:'ig', name:'Igbo'},
    //{id:'id', name:'Indonesian'},
    //{id:'ga', name:'Irish'},
    {id:'it', name:'Italian'},
    {id:'ja', name:'Japanese'},
    //{id:'jw', name:'Javanese'},
    //{id:'kn', name:'Kannada'},
    //{id:'kk', name:'Kazakh'},
    //{id:'km', name:'Khmer'},
    {id:'ko', name:'Korean'},
    //{id:'ku', name:'Kurdish (Kurmanji)'},
    //{id:'ky', name:'Kyrgyz'},
    //{id:'lo', name:'Lao'},
    //{id:'la', name:'Latin'},
    //{id:'lv', name:'Latvian'},
    //{id:'lt', name:'Lithuanian'},
    //{id:'lb', name:'Luxembourgish'},
    //{id:'mk', name:'Macedonian'},
    //{id:'mg', name:'Malagasy'},
    //{id:'ms', name:'Malay'},
    //{id:'ml', name:'Malayalam'},
    //{id:'mt', name:'Maltese'},
    //{id:'mi', name:'Maori'},
    //{id:'mr', name:'Marathi'},
    //{id:'mn', name:'Mongolian'},
    //{id:'my', name:'Myanmar (Burmese)'},
    //{id:'ne', name:'Nepali'},
    //{id:'no', name:'Norwegian'},
    //{id:'ps', name:'Pashto'},
    //{id:'fa', name:'Persian'},
    //{id:'pl', name:'Polish'},
    {id:'pt', name:'Portuguese'},
    //{id:'ma', name:'Punjabi'},
    //{id:'ro', name:'Romanian'},
    {id:'ru', name:'Russian'},
    //{id:'sm', name:'Samoan'},
    //{id:'gd', name:'Scots Gaelic'},
    //{id:'sr', name:'Serbian'},
    //{id:'st', name:'Sesotho'},
    //{id:'sn', name:'Shona'},
    //{id:'sd', name:'Sindhi'},
    //{id:'si', name:'Sinhala'},
    //{id:'sk', name:'Slovak'},
    //{id:'sl', name:'Slovenian'},
    //{id:'so', name:'Somali'},
    {id:'es', name:'Spanish'},
    //{id:'su', name:'Sudanese'},
    //{id:'sw', name:'Swahili'},
    //{id:'sv', name:'Swedish'},
    //{id:'tg', name:'Tajik'},
    //{id:'ta', name:'Tamil'},
    //{id:'te', name:'Telugu'},
    //{id:'th', name:'Thai'},
    //{id:'tr', name:'Turkish'},
    //{id:'uk', name:'Ukrainian'},
    //{id:'ur', name:'Urdu'},
    //{id:'uz', name:'Uzbek'},
    {id:'vi', name:'Vietnamese'},
    //{id:'cy', name:'Welsh'},
    //{id:'xh', name:'Xhosa'},
    //{id:'yi', name:'Yiddish'},
    //{id:'yo', name:'Yoruba'},
    //{id:'zu', name:'Zulu'}
];

var SOURCE_LANGUAGE = 'en',
    TRANSLATED_LANGUAGE = 'es';

var $ = $ || window.$,
    addListenerInterval = null,
    translateInterval = null,
    translateTimeout = null,
    translate_enabled = true,
    translate_ready = false,
    translate_string = '',
    custom_style = '.language_selected{background-color: #00bfa5;}',
    image_uri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFZklEQVR42sWXe0xTVxzHv5drWXkIKBQfE61Y2DIyR3Sy+FrqRgRF1IFD54IawU03dUE2I3ukxTgqPuYjK6KOZRndnFPYJoEpcUunokNxYnFT4wOQp9A/BshD4N6zc1sKvaWV0C7xhEt/59Hf93N+5/c7uWXwlBtjMV6JeBnz5r0KhmGG/BIhxKYPtLW1Qaf7Aa30c9gA4eFTof+9KJ5l2WzaDRhakIhs+sdT6/T5C5cSFi9JaB82wHsb1iFz5/ZmJ8UFy2Jv9JdN1DoLQGwnrcXWvbsJsYsWmB574n1jan/ZpHSXAU4VFA0CKCj4FaGhCjwXGiJI9s8LY6Ehij4gog4IlLsOkPzORptQiDvEajwmJhqLYqL6AWRjJrsGIDjiOF6kah2Jzs4upKRuwxtLYxE1/3WLcD9A4Nhg5wFsE+7q1Wuoq2tAZKQSUqnUdOaGihvQao8gdcsmKBTBgwDGjJviHMBOTbo40NRhebkBWYe+wpLFMViwYD4d47F7zwF0d3cjbVtq/zprgLHjFcMH2LAhGZmagRywympos47i5s1b2PpRCm78/Q9OnSrCh6mbIZdPtBUHzxP1+AkhrgHY1nl7ewcyd+9Da2sbOjs6sGLFMsydM8ueuCkCzwaFOg9g75Lp6elBru4YSkuvwF3ijqTk1XAPDEdF3TOgmn3AZoDG1hH6kkov/QCY7RGZPBtbKs9/c/v4inbucWsfwPpkUQ5YFldVV+Pb3GMwNhuR8GYcymhSGh7wePTCDirJ2LsJRZ+Dx/vtouritJjGUu1gAGFRVfUDFBf/RqugHMHBcqxKfAsyWQDdJY/ss904V69wRVx4+No/NGz9+Z1iAMuiO3fuQvfdcURHRSIiYroo20+W+yLvuo8r4ia77pyGsQJIgiYjnVg7fdwL3Gtm8fyYHtE5mgF8HYrHvsRhpBQouQPcb4ZDEAGg4UKmGWC9APB5Oken3Czi2wtHoqJ+BD6JbsX0oMf9DgRx4bEnPmEUQXZiL4RXCv0tQFPIOIwC3f0AwPLl8cjO2l9IJxZaxP+qkZhCL2EJPp7fgmlBXaZMF8TzDb52w540h8PicIILdPezFMDKwwxaOuxXBBUfAJBIJMjSfuH12jzlmtzLHgG/XJcq3T39lJaqkDId6u3R9Qj07oXOMFlZUumttBVn3QhykzhanoDuIoNDqwgO64GTVwaLC02IQGPJLth9/5oYd1w1clyY2lsmN/Vr9RlMnT7DZM/57KGKlfqqbRNubghBWgyPT/MZXL4PHHybwENCo5IDel+IxS0ReCIA6+6t9vSfBAHCGmBhRqPqEe+nts32jDgOE0YDiUcYcPSoFk4lSIli8IGOh6FGLG4G2MU8vOgAYErCCRXv5qkWbAHiRb8qhmm6aJpbtHKLqvi2p9o6w8f6EOSs5XGvCbh011xJnu7AshkMzlQQaAo4kbjw0N1TgN32AdIOnJHPnDmbniAm2Zvvpf5+vsbQMjU7XTObR0IEUFHTV8Z96wJ9gNFeQPxBDo+6xFeyANB0yQGAj18AdmQVyuWKsCdCHCsFGlpo8q2jZfUvkPK9OOGm0W/uXcli32kOP5Vxomqg4acAe+DwR8BQEMIR5JURzJhMoF4KaM8S5F8Vh9mNes/bzMLYRrD2aI8Ijoafaf7zCQAWCNX+fPm4oODVljEvb19lpZFRCuI9nKOrVpxw9ubp7ocGsNdSc2pVl2t91a6IC30q7hzAjK0177NSvy9dEafNSBNQZizdO3wARdzXXv5hy36kzqKFY3ZGnPDc+qoTS/I6G8qGD8C4SeAfFg/WY5TpzZ2Y/1l+qgzYZKAcbd+2O+pK0dVkMPsbLsD/3f4DRTYAbJ65vloAAAAASUVORK5CYII=',
    send_translation_image = 'data:image/png;base64,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',
    custom_html = '<div class="tranlate-bottom">'
+'<div style="margin-top:10px;margin-right:30px;margin-left:20px;"><input type="text" id="originalTextInput" placeholder="Type your message and press Enter to send the translated message" style="width:100%;border:0px;height:30px;border-radius:8px;padding:6px;" autocomplete="off" selectable/></div>'
+ '<div style="margin:20px;min-height:20px" id="translatedMessage"></div>'
+ '</div>',
    html_language1 = '<div class="menu-item" style="display:table"><button title="Click for translation help!" class="trans_help_btn"><img alt="Translator" draggable="false" src="data:'+ image_uri +'" style="width:32px;height:32px;"/></button></div>',
    username = '',
    is_debug = true,
    lan_select = '',
    help_url = 'https://greasyfork.org/zh-CN/scripts/28218-translator-for-whatsapp',
    readyTranslation = '';


//For menu html
for(var i=0;i<all_languages.length;i++){
    lan_select = lan_select + '<option value="'+ all_languages[i].id +'">' + all_languages[i].name +'</option>';
}

var lan_select_1 = '<span style="padding-left:5px;padding-right:5px;color:green;font-size:10pt;">From:</span><select class="languageSelect1" style="padding-right:5px;width: 126px; text-align-last:center;">' + lan_select + '</select>';
var lan_select_2 = '<span style="padding-left:20px;padding-right:5px;color:green;font-size:10pt;">To:</span><select class="languageSelect" style="padding-right:5px;width: 126px; text-align-last:center;border-bottom-width: 0px !important;"><option value="off">OFF</option>' + lan_select + '</select>';
html_language1 = html_language1 + '<div style="display:table;"><div style="display:table-row">'+ lan_select_1 +'</div><div style="display:table-row">'+ lan_select_2 +'</div></div>';

//Add style
var customStyleNode = document.createElement('style');
customStyleNode.textContent = custom_style;
document.querySelector('head').appendChild(customStyleNode);

//Replace all function
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

//Show debug
var debugMessage = function(mes){
    if(is_debug){
        console.info(mes);
    }
};

//Show error message
var showError = function(err){
    alert(err);
    console.error(err);
};

//Translate
//sl - source language
//dl - target language
//txt - content to be translated
//cb - callback after translation
var translate = function(sl,dl,txt,cb){
    debugMessage('Source:'+ txt);
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://translate.googleapis.com/translate_a/single?client=gtx&sl="+ sl + "&tl=" + dl +"&dt=t&q=" + encodeURI(txt),
        onload: function(response) {
            var _r = JSON.parse(response.responseText);;
            translate_string = '';
            for(var i=0; i<_r[0].length;i++){
                translate_string += _r[0][i][0];
            }
            debugMessage('Translation:'+translate_string);
            cb.apply({text: translate_string});
        }
    });
};

//Add translation bindings
var addTranslateFunc = function(selectChange){
    if(!username){
        showError('Can not get the username');
        return;
    }

    if(selectChange){
        GM_setValue(username, $('.languageSelect').val());
        GM_setValue(username+'_o', $('.languageSelect1').val());
    }

    TRANSLATED_LANGUAGE = GM_getValue(username) ? GM_getValue(username) : TRANSLATED_LANGUAGE;
    SOURCE_LANGUAGE = GM_getValue(username+'_o') ? GM_getValue(username+'_o') : SOURCE_LANGUAGE;

    //Menu
    debugMessage('Set original language to: ' + SOURCE_LANGUAGE + ', translate to: '+ TRANSLATED_LANGUAGE);
    $('.languageSelect').val(TRANSLATED_LANGUAGE);
    $('.languageSelect1').val(SOURCE_LANGUAGE);

    //Add translation input
    var $_input_body = $('footer span .copyable-text');
    if(TRANSLATED_LANGUAGE !== 'off' && $('.tranlate-bottom').length === 0){
        console.log($_input_body);
        $('footer').append($(custom_html));

        // cant bind whatsapp translator plugin error
        if($_input_body === null || $_input_body.length !== 1){
            showError('Error binding for Whatsapp translator plugin!');
        }

        //translate sent or received messages
        console.log('$(#main)', $('#main'));
        $('#main').on('click', 'span.copyable-text span', function(){
            console.log('translate sent or received messages');
            if(TRANSLATED_LANGUAGE!='off'){
                var $_t_this = $(this);
                console.log('translate to language:'+ SOURCE_LANGUAGE);
                translate('auto', SOURCE_LANGUAGE, $(this).text(), function(){
                    $_t_this.html(this.text);
                });
            }
        });

        const sendMessage = function() {
            setTimeout(function(){
                $('footer p.copyable-text').parent().focus();
                setTimeout(function(){
                    document.execCommand("selectAll");
                    setTimeout(function(){
                        let content = $('#translatedMessage').html();
                        document.execCommand("insertText", false, content);
                        setTimeout(function(){
                            $('[data-icon="wds-ic-send-filled"]').click();
                            setTimeout(function(){
                                $('#translatedMessage').html('');
                                $('#originalTextInput').val('').focus();
                            },200);
                        },200);
                    }, 200);
                }, 200);
            }, 200);
        }

        $('#originalTextInput').keyup(function(event){
            if (event.which == 13) {
                debugMessage('Waiting translation');
                retry(
                    function(){console.log('translate_ready',translate_ready); return translate_ready;},
                    sendMessage,
                    function(){showError('Translation failed. Please retry!');}
                );
                return false;
            }else{
                var $_translate_input_1 = $('#translatedMessage');
                $_translate_input_1.html('Typing...');
                translate_ready = false;
                delay(function(){
                    var _input = $.trim(document.getElementById('originalTextInput').value);
                    if(_input.length>2 && _input != readyTranslation){
                        translate(SOURCE_LANGUAGE, TRANSLATED_LANGUAGE, _input, function(){
                            $_translate_input_1.html(this.text);
                            translate_ready = true;
                        });
                    }else{
                        $_translate_input_1.html('');
                        readyTranslation = '';
                    }
                }, 1000);
            }
        });

        //focus the input
        delay(function(){$('#originalTextInput').focus();}, 500);

        //visit the help page
        $('.trans_help_btn').on('click', function(){
            window.open(help_url,'_blank');
        });
    }else if(TRANSLATED_LANGUAGE === 'off' && $('.tranlate-bottom').length !== 0){
        //remove bindings
        $('.tranlate-bottom').remove();
    }
};

//Add listener when user activates a new chat
addListenerInterval = setInterval(function(){
    var $_div_chat = $('#pane-side');
    //console.log('div_chat_length', $_div_chat.length);
    if($_div_chat.length){

        //console.log('found #pane-side');

        var contacts = document.querySelector('div[role="grid"]').children;
        if(!contacts || contacts.length === 0){
            showError('Not able to get the contacts sidebar');
            return;
        }

        const selector = contacts[0].className.split(' ').join('.');
        //console.log('The selector: div.'+selector);

        //更新会经常导致这个地方需要修改
        $('#pane-side').on('click','div.'+selector, function(){

            //Get the username
            //username = escape($(this).find('.chat-title').text());
            console.info($(this));
            var _tusername = '';
            $(this).find('span').each(function(i,x){
                if(x.hasAttribute('title')) {
                    //console.info(x.title);
                    _tusername = x.title;
                    return false;
                }
            });
            if(_tusername !== ''){username = escape(_tusername);}
            else{showError('Not able to get the user name');}

            debugMessage('Chat menu clicked');

            //Return if the translation input is added
            if($('.languageSelect').length>0){return;}

            var $header = $('#main header div:first').next();
            if($header.length != 1){showError('Not able to insert translate menu');}
            $header.after($(html_language1));

            //Bind lanaguage select change event
            $('.languageSelect').on('change', function(){
                addTranslateFunc(true);
            });
            $('.languageSelect1').on('change', function(){
                addTranslateFunc(true);
            });

            //Apply the translate function
            addTranslateFunc();
        });

        clearInterval(addListenerInterval);
    }
}, 1000);

//Delay function
var delay = (function(){
    var timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

//Retry function
function retry(checkCallback, successCallback, failCallback, delay=500, tries=30) {
    if(tries && checkCallback() !== true){
        setTimeout(retry.bind(this, checkCallback, successCallback, failCallback, delay, tries-1), delay);
    }else if(tries<=0){
        failCallback();
    }else{
        successCallback();
    }
}
})();