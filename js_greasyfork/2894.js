// ==UserScript==
// @name           Sisu Decoder
// @description    Translate Internet slang into normal language.
// @include        http://harddrop.com/*
// @version 0.0.1.20140804044426
// @namespace https://greasyfork.org/users/2233
// @downloadURL https://update.greasyfork.org/scripts/2894/Sisu%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/2894/Sisu%20Decoder.meta.js
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

// https://www.vodacommessaging.co.za/dictionary.asp?t=1
var slang_dict = {}
slang_dict['adn'] = 'Any Day Now'
slang_dict['afaik']= 'As far as I know'
slang_dict['asap'] = 'As soon as possible'
slang_dict['atm'] = 'At the moment'
slang_dict['b2b'] = 'business to business'
slang_dict['ceo'] = 'Chief Executive'
slang_dict['fyi'] = 'For your information'
slang_dict['hth'] = 'Hope this helps'
slang_dict['imo'] = 'In my opinion'
slang_dict['iu2u'] = "It's up to you"
slang_dict['lmk'] = 'Let me know'
slang_dict['lch'] = 'lunch'
slang_dict['md'] = 'managing director'
slang_dict['mtng'] = 'meeting'
slang_dict['msg'] = 'message'
slang_dict['mob'] = 'mobile'
slang_dict['nagi'] = 'Not a good idea'
slang_dict['rgds'] = 'regards'
slang_dict['thx'] = 'thanks'
slang_dict['tia'] = 'Thanks in advance'
slang_dict['wottm']= 'What time'

addEventListener('keydown', function(evt) {
    if(evt.keyCode == 68) // d
    {
        var q = '' + (wnd.getSelection?wnd.getSelection():doc.getSelection?doc.getSelection():doc.selection.createRange().text)
        wnd.getSelection().removeAllRanges()
        q = q.replace(/^\s+|\s+$/g,'').replace(/\s\s+/g,' ')
        if(q.length == 0) { return }
        var translated = ''
        var words = q.split(' '), len = words.length
        for(var i=0; i<len; i++)
        {
            if(words[i].toLowerCase() in slang_dict)
            {
                translated = translated + ' ' + slang_dict[words[i].toLowerCase()]
            }
            else
            {
                translated = translated + ' ' + words[i]
            }
        }
        alert(translated)
    }
}, false)
