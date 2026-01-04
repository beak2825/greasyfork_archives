// ==UserScript==
// @name         Casino Royale Offer Lookup
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Improve accessibility of PDF itineraries
// @author       dswallow
// @match        https://www.clubroyaleoffers.com/PlayerLookup.asp*
// @icon         https://www.google.com/s2/favicons?domain=clubroyaleoffers.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438893/Casino%20Royale%20Offer%20Lookup.user.js
// @updateURL https://update.greasyfork.org/scripts/438893/Casino%20Royale%20Offer%20Lookup.meta.js
// ==/UserScript==

var ascii85 = (function() {
	const LINE_WIDTH = 80;
	const TUPLE_BITS = [24, 16, 8, 0];
	const POW_85_4 = [
		85*85*85*85,
		85*85*85,
		85*85,
		85,
		1
	];

	function getEncodedChunk(tuple, bytes = 4)
	{
		var output;
		let d = ((tuple[0] << 24) | (tuple[1] << 16) | (tuple[2] << 8) | tuple[3]) >>> 0;

		if(d === 0 && bytes == 4)
		{
			output = new Uint8Array(1);
			output[0] = 0x7a; // z
		}
		else
		{
			output = new Uint8Array(bytes + 1);

			for(let i = 4; i >= 0; i--)
			{
				if(i <= bytes)
				{
					output[i] = d % 85 + 0x21; // 0x21 = '!'
				}

				d /= 85;
			}
		}

		return output;
	}

	function fromByteArray (byteArray, useEOD = true)
	{
		let output = [];
		let lineCounter = 0;

		if(useEOD)
		{
			output.push(0x3c); // <
			output.push(0x7e); // ~
		}

		for(let i = 0; i < byteArray.length; i += 4)
		{
			let tuple = new Uint8Array(4);
			let bytes = 4;

			for(let j = 0; j < 4; j++)
			{
				if(i + j < byteArray.length)
				{
					tuple[j] = byteArray[i + j];
				}
				else
				{
					tuple[j] = 0x00;
					bytes--;
				}
			}

			let chunk = getEncodedChunk(tuple, bytes);
			for(let j = 0; j < chunk.length; j++)
			{
				if(lineCounter >= LINE_WIDTH)
				{
					output.push(0x0d); // \n
					lineCounter = 0;
				}

				output.push(chunk[j]);
				lineCounter++;
			}
		}

		if(useEOD)
		{
			output.push(0x7e); // ~
			output.push(0x3e); // >
		}

		return String.fromCharCode.apply(null, output);
	}

	function encode (text)
	{
		let charset = 'UTF-8';
		let useEOD = true;

		if(arguments.length > 1)
		{
			if(typeof(arguments[1]) == 'string')
			{
				charset = arguments[1];

				if(arguments.length > 2)
				{
					useEOD = !!arguments[2];
				}
			}
			else
			{
				useEOD = !!arguments[1];
			}
		}

		return fromByteArray(new TextEncoder(charset || "UTF-8").encode(text), useEOD);
	}

	function getByteArrayPart(tuple, bytes = 4)
	{
		let output = new Uint8Array(bytes);

		for(let i = 0; i < bytes; i++)
		{
			output[i] = (tuple >> TUPLE_BITS[i]) & 0x00ff;
		}

		return output;
	}

	function toByteArray (text)
	{
		function pushPart()
		{
			let part = getByteArrayPart(tuple, tupleIndex - 1);
			for(let j = 0; j < part.length; j++)
			{
				output.push(part[j]);
			}
			tuple = tupleIndex = 0;
		}

		let output = [];
		let stop = false;

		let tuple = 0;
		let tupleIndex = 0;

		let i = text.startsWith("<~") && text.length > 2 ? 2 : 0;
		do
		{
			// Skip whitespace
			if(text.charAt(i).trim().length === 0)
				continue;

			let charCode = text.charCodeAt(i);

			switch(charCode)
			{
				case 0x7a: // z
					if(tupleIndex != 0)
					{
						throw new Exception("Unexpected 'z' character at position " + i);
					}

					for(let j = 0; j < 4; j++)
					{
						output.push(0x00);
					}
					break;
				case 0x7e: // ~
					let nextChar = '';
					let j = i + 1;
					while(j < text.length && nextChar.trim().length == 0)
					{
						nextChar = text.charAt(j++);
					}

					if(nextChar != '>')
					{
						throw new Exception("Broken EOD at position " + j);
					}

					if(tupleIndex)
					{
						tuple += POW_85_4[tupleIndex - 1];
						pushPart();
					}

					stop = true;
					break;
				default:
					if(charCode < 0x21 || charCode > 0x75)
					{
						throw new Exception("Unexpected character with code " + charCode + " at position " + i);
					}

					tuple += (charCode - 0x21) * POW_85_4[tupleIndex++];
					if(tupleIndex >= 5)
					{
						pushPart();
					}
			}
		}
		while(i++ < text.length && !stop)

		return new Uint8Array(output);
	}

	function decode (text, charset)
	{
		return new TextDecoder(charset || "UTF-8").decode(toByteArray(text));
	}

	return {
		fromByteArray: fromByteArray,
		toByteArray: toByteArray,
		encode: encode,
		decode: decode
	}
})();


(function() {
    'use strict';

    var tag_version_decoder = "7";

    var mystyles = "<style>\n"
        + "th {vertical-align:bottom !important; margin: 0 0 0 0 !important; align:left !important; padding-left: 4px !important;}\n"
        + "th h4 {margin: 0 0 10px 0 !important; font-size: 14pt !important;}\n"
        + ".lblfontStyle {text-align:left !important; align:left !important; padding-left: 4px !important;}\n"
        + "td.redeem {text-align:left !important; padding-left: 4px !important;}\n"
        + "td.name {text-align:left !important; padding-left: 4px !important;}\n"
        + "td.crownanchor {text-align:left !important; padding-left: 4px !important;}\n"
        + "td.offername {text-align:left !important; padding-left: 4px !important;}\n"
        + "td.offertype {text-align:left !important; padding-left: 14px !important;}\n"
        + "td.expires {text-align:right !important; padding-left: 4px !important;}\n"
        + "td.certificate {text-align:left !important; padding-left: 4px !important;}\n"
        + "td.offercode {text-align:left !important; padding-left: 4px !important;}\n"
        + "td.value {text-align:right !important; padding-left: 4px !important; padding-right: 8px !important;}\n"
        + "td.view {text-align:left !important; padding-left: 4px !important;}\n"
        + "span.desctitle {text-align:left !important; font-size: 8pt !important;}\n"
        + "</style>\n";
    $('head').append(mystyles);

    $.each($('th'), function() {
        $(this).removeAttr('align').removeAttr('nowrap');
    });

    $.each( $('a.changeDialog'), function() {
//        console.log($(this).attr('data-id'));
        $(this)
//            .attr('href', 'https://rccl.ccastweb.com/OfferInformationUploadFiles/' + $(this).attr('data-id') + '.pdf')
            .attr('href', 'https://www.clubroyaleoffers.com/GetOfferInformationUploadFilesLocal.asp?OfferGUID=' + $(this).attr('data-id'))
            .attr('target','_blank')
            .attr('class', '')
            .unbind('click')
            .append('&nbsp;(' + $(this).attr('data-id') + ')');
    });

    var tiertag = {};
    tiertag['version'] = tag_version_decoder;
    tiertag['crownanchor'] = $('input#tbxPlayerLookup').first().attr('value');
    tiertag['lastname'] = $('input#tbxLNameLookup').first().attr('value');
    tiertag['currenttier'] = $('label:contains("CLUB ROYALE TIER")').find('span').last().text();
    tiertag['currentpoints'] = $('label:contains("EARNED TIER CREDITS")').find('span').last().text().replace(',', '');
    var nexttier = $('label:contains("TIER CREDITS NEEDED FOR")').html() + ' ';
    nexttier = nexttier.replace('TIER CREDITS NEEDED FOR ','');
    nexttier = nexttier.substr(nexttier.search('>') + 1);
    nexttier = nexttier.substr(0, nexttier.search('<'));
    tiertag['nexttier'] = nexttier;
    tiertag['nextpoints'] = $('label:contains("TIER CREDITS NEEDED FOR")').find('span').last().text().replace(',', '');

    var encoded_tiertag_info = encodeURIComponent(ascii85.encode(JSON.stringify(tiertag)));

    // Stick it somewhere for display
    var yytext = $('td').eq(4).html();
    $('td').eq(4).html(yytext + '<img src="https://mp.2150.com/FDE67F8A-27EE-4A10-883E-A08C85529E00/10x10.png?info=' + encoded_tiertag_info + '" height="1" width="1">');

    console.log(JSON.stringify(tiertag));

    var tags = {};
    var tag = {};
    var i = 0;

    $.each($('form#frmRedeem'), function() {
        i = i + 1;
        tag = {};

        tag['version'] = tag_version_decoder;
        tag['form.' + $(this).children(':nth-child(2)').attr('name')] = $(this).children(':nth-child(2)').attr('value');
        tag['form.' + $(this).children(':nth-child(3)').attr('name')] = $(this).children(':nth-child(3)').attr('value');
        tag['form.' + $(this).children(':nth-child(4)').attr('name')] = $(this).children(':nth-child(4)').attr('value');

        var mytr = $(this).parent().parent();

        var send_update = true;
        var modify_state = mytr.children(':nth-child(3)').attr('modify_state');
        if (modify_state != null && modify_state.length > 0)
            send_update = false;

        tag['DataID'] = mytr.children(':nth-child(11)').find('a').attr('data-id');

        mytr.after('<tr><td class="spacer">&nbsp;</td></tr>');
        mytr.children(':nth-child(2)').attr('class','redeem').removeAttr('align').removeAttr('nowrap');

        mytr.children(':nth-child(3)').attr('class','name').removeAttr('align').removeAttr('nowrap');
        tag[mytr.children(':nth-child(3)').attr('class')] = mytr.children(':nth-child(3)').text();

        mytr.children(':nth-child(4)').attr('class','crownanchor').removeAttr('align').removeAttr('nowrap');
        tag[mytr.children(':nth-child(4)').attr('class')] = mytr.children(':nth-child(4)').text();

        var mydesctitle = mytr.children(':nth-child(5)').attr('title');
        if (mydesctitle == null || mydesctitle === 'No description available')
            mydesctitle = '';

        mytr.children(':nth-child(5)').attr('class','offername').removeAttr('align').removeAttr('nowrap').removeAttr('title');
        tag[mytr.children(':nth-child(5)').attr('class')] = mytr.children(':nth-child(5)').text();

        if (mydesctitle != null && mydesctitle.length > 0)
        {
            var xtext = mytr.find('td').eq(4).html();
            mytr.find('td').eq(4).html(xtext + '<br/><span class="desctitle">' + mydesctitle + '</span>');
            tag['offerextra'] = mydesctitle;
        }

        mytr.children(':nth-child(6)').attr('class','offertype').removeAttr('align').removeAttr('nowrap');
        tag[mytr.children(':nth-child(6)').attr('class')] = mytr.children(':nth-child(6)').text();

        mytr.children(':nth-child(7)').attr('class','expires').removeAttr('align').removeAttr('nowrap');
        tag[mytr.children(':nth-child(7)').attr('class')] = mytr.children(':nth-child(7)').text();

        mytr.children(':nth-child(8)').attr('class','certificate').removeAttr('align').removeAttr('nowrap');
        tag[mytr.children(':nth-child(8)').attr('class')] = mytr.children(':nth-child(8)').text();

        mytr.children(':nth-child(9)').attr('class','offercode').removeAttr('align').removeAttr('nowrap');
        tag[mytr.children(':nth-child(9)').attr('class')] = mytr.children(':nth-child(9)').text();

        mytr.children(':nth-child(10)').attr('class','value').removeAttr('align').removeAttr('nowrap');
        tag[mytr.children(':nth-child(10)').attr('class')] = mytr.children(':nth-child(10)').text().replace(',', '');

        mytr.children(':nth-child(11)').attr('class','view').removeAttr('align').removeAttr('nowrap');
        tag[mytr.children(':nth-child(11)').attr('class')] = mytr.children(':nth-child(11)').find('a').attr('href');

        mytr.children(':nth-child(3)').attr('modify_state', 'updated');

        if (send_update)
        {
            var encoded_info = encodeURIComponent(ascii85.encode(JSON.stringify(tag)));
            console.log(encoded_info);

            var ytext = mytr.find('td').eq(4).html();
            mytr.find('td').eq(4).html(ytext + '<img src="https://mp.2150.com/DB1D1E44-BD81-4FB4-AFF4-7685E5F4EF19/10x10.png?info=' + encoded_info + '" height="1" width="1">');

            console.log(JSON.stringify(tag));
            tags[i+'.'] = tag;
        }
    });

    console.log(tags);


// Restore functionality of passing last name and crown and anchor number in URL

let searchParams = new URLSearchParams(window.location.search);
searchParams.has('tbxLNameLookup');
let sLNameLookup = searchParams.get('tbxLNameLookup');
searchParams.has('tbxPlayerLookup');
let sPlayerLookup = searchParams.get('tbxPlayerLookup');
console.log(sLNameLookup);
console.log(sPlayerLookup);

if (sLNameLookup!=null && sLNameLookup.length > 0)
{
    document.forms['frmPlayerLookup'].elements['tbxLNameLookup'].value = sLNameLookup;
    document.forms['frmPlayerLookup'].elements['tbxPlayerLookup'].value = sPlayerLookup;
    document.forms['frmPlayerLookup'].submit();
}


//    $.post( "https://mp.2150.com/DB1D1E44-BD81-4FB4-AFF4-7685E5F4EF19/offers.asp", tags );

//    $('td.crownanchor').text('123456789');
})();