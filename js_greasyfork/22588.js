// ==UserScript==
// @name         Ｆｕｌｌｗｉｄｔｈ Ｔｅｘｔ Ｇｅｎｅｒａｔｏｒ
// @namespace    Ｆａｂｉ
// @version      0.5
// @description  ＡＥＳＴＨＥＴＩＣ
// @author       Ｆａｂｉ
// @include        http*://www.taringa.net/mi
// @downloadURL https://update.greasyfork.org/scripts/22588/%EF%BC%A6%EF%BD%95%EF%BD%8C%EF%BD%8C%EF%BD%97%EF%BD%89%EF%BD%84%EF%BD%94%EF%BD%88%20%EF%BC%B4%EF%BD%85%EF%BD%98%EF%BD%94%20%EF%BC%A7%EF%BD%85%EF%BD%8E%EF%BD%85%EF%BD%92%EF%BD%81%EF%BD%94%EF%BD%8F%EF%BD%92.user.js
// @updateURL https://update.greasyfork.org/scripts/22588/%EF%BC%A6%EF%BD%95%EF%BD%8C%EF%BD%8C%EF%BD%97%EF%BD%89%EF%BD%84%EF%BD%94%EF%BD%88%20%EF%BC%B4%EF%BD%85%EF%BD%98%EF%BD%94%20%EF%BC%A7%EF%BD%85%EF%BD%8E%EF%BD%85%EF%BD%92%EF%BD%81%EF%BD%94%EF%BD%8F%EF%BD%92.meta.js
// ==/UserScript==

var reversal_map =
{
    '\u0041': '\uff21',   '\u0042': '\uff22',   '\u0043': '\uff23',  '\u0044': '\uff24',   '\u0045': '\uff25',   '\u0046': '\uff26',
    '\u0047': '\uff27',   '\u0048': '\uff28',   '\u0049': '\uff29',   '\u004a': '\uff2a',   '\u004b': '\uff2b',   '\u004c': '\uff2c',
    '\u004d': '\uff2d',   '\u004e': '\uff2e',   '\u004f': '\uff2f',   '\u0050': '\uff30',   '\u0051': '\uff31',   '\u0052': '\uff32',
    '\u0053': '\uff33',   '\u0054': '\uff34',   '\u0055': '\uff35',   '\u0056': '\uff36',   '\u0057': '\uff37',   '\u0058': '\uff38',
    '\u0059': '\uff39',   '\u005a': '\uff3a',

    '\u0061': '\uff41',   '\u0062': '\uff42',   '\u0063': '\uff43',   '\u0064': '\uff44',   '\u0065': '\uff45',   '\u0066': '\uff46',
    '\u0067': '\uff47',   '\u0068': '\uff48',   '\u0069': '\uff49',   '\u006a': '\uff4a',   '\u006b': '\uff4b',   '\u006c': '\uff4c',
    '\u006d': '\uff4d',   '\u006e': '\uff4e',   '\u006f': '\uff4f',   '\u0070': '\uff50',   '\u0071': '\uff51',   '\u0072': '\uff52',
    '\u0073': '\uff53',   '\u0074': '\uff54',   '\u0075': '\uff55',   '\u0076': '\uff56',   '\u0077': '\uff57',   '\u0078': '\uff58',
    '\u0079': '\uff59',   '\u007a': '\uff5a'
};

var complete_map;

function scramble_text(text)
{
    if(!complete_map)
    {
        complete_map = { };
        for(var key in reversal_map)
        {
            var val = reversal_map[key];
            if(!reversal_map[val])
                complete_map[reversal_map[key]] = key;
            complete_map[key] = val;
        }
    }

    var str = "";

    for (var i = 0; i < text.length; ++i)
    {
        var ch = text.charAt(i);
        var rev = complete_map[ch];
        if(rev)
            str += rev;
        else
            str += ch;
    }

    return str;
}


ＴｏｇｇｌｅＴｅｘｔ = function($ｏｂｊ){
	$ｏｂｊ.val(scramble_text($ｏｂｊ.val()));
}

var ｔｅｍｐＢｔｎ ='<li class="ｘｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄ"><a class="btn g" title="Ａ"><div class="btn-text">Ａ</div></a></li>';

$('.my-shout-attach-options').append(ｔｅｍｐＢｔｎ);
$('.ｘｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄｄ').on('click',function(){
	ＴｏｇｇｌｅＴｅｘｔ($('#my-shout-body-mi'));
});



