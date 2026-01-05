// ==UserScript==
// @name       Primel Dozenator
// @namespace  http://userscripts.org/users/322169
// @version    1.0.3
// @description  Converts the site-generated numbers on Dozensonline into side-by-side dozenal and decimal, Rosetta Stone like.
// @include    http://z13.invisionfree.com/DozensOnline/*
// @copyright  2016, John Volan
// @downloadURL https://update.greasyfork.org/scripts/13303/Primel%20Dozenator.user.js
// @updateURL https://update.greasyfork.org/scripts/13303/Primel%20Dozenator.meta.js
// ==/UserScript==

(function() {
    var dChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var zChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Ӿ', 'Ɛ'];
    var intPrefix = '';
    var fractPrefix = ''
    var point = '.';
    var dozenal = '<sub>z</sub>';
    var decimal = '<sub>d</sub>';
    var annotateSingleDigit = false;
    // 'd' for "decimal".
    function toDozenal(dText) {
        dText += '';
        var number = 0;
        for (var i = 0; i < dText.length; i++) {
            if (dText[i] == ',') continue;
            number *= 10;
            number += dChars.indexOf(dText[i]);
        }
        
        if (number < 10) return number + '';
        
        var text = '';
        var pow = Math.floor(Math.log(number) / (Math.log(12) || 1));
        do {
            var digit = Math.floor(number / Math.pow(12, pow));
            text += zChars[digit];
            number -= digit * Math.pow(12, pow--);
        }
        while (pow >= 0 || number > 0);
        
        return text;
    }
    
    function addCommas(text) {
        text += '';
        text = text.replace(',',''); // first remove any commas
        var withCommas = '';
        var end = text.length-1;
        for (var i = 0; i < end; i++) {
            withCommas += text[i];
            if ((end-i) % 3 == 0) {
                withCommas += ',';
            }
        }
        withCommas += text[end];
        return withCommas;
    }
    
    function convert(dText) {
        if (! annotateSingleDigit && Math.abs(dText) < 10) {
            return dText
        } else {  
            return addCommas(toDozenal(dText)) + dozenal + '&nbsp;=&nbsp;' + dText + decimal;
        }
    }
    
    function convertStacked(dText) {
       return addCommas(toDozenal(dText)) + dozenal + '<br>' + addCommas(dText) + decimal;
    }
    
    function convertYear(dText) {
        return toDozenal(dText) + dozenal + '&nbsp;=&nbsp;' + dText + decimal;
    }
    
    function convertFract(dText) {
        if (!dText) return '';
        
        dText += '';
        var number = 0;
        var inFract = false, fractLength = 0;
        var isPerCent = false;
        for (var i = 0; i < dText.length; i++) {
            if (dText[i] == '.') {
                inFract = true;
                continue;
            }
            if (dText[i] == '%') {
                isPerCent = true;
                break;
            }
            if (inFract) fractLength++;
            number *= 10;
            number += dChars.indexOf(dText[i]);
        }
        
        number /= Math.pow(10, fractLength) * (isPerCent ? 100 : 1);
        return createFract(number, fractLength, isPerCent);
    }
    
    function createFract(number, fractLength, makePerGross) {
        if (makePerGross) number *= 144;
        
        var text = '';
        var pow = Math.floor(Math.log(number) / (Math.log(12) || 1));
        pow = Math.max(pow, 0);
        do {
            var digit = Math.floor(number / Math.pow(12, pow));
            text += zChars[digit];
            number -= digit * Math.pow(12, pow--);
        }
        while (pow >= 0);
        
        if (fractLength > 0) {
          text += point;
        }
		
        // Calculate an extra place to use in rounding
        for (pow = -1; pow >= -fractLength - 1; pow--) {
            var digit = Math.floor(number / Math.pow(12, pow));
            text += zChars[digit];
            number -= digit * Math.pow(12, pow);
        }
        
        return fractPrefix + round(text) + (makePerGross ? '%' : '') + dozenal;
    }
    
    // 'z' for "dozenal".
    function round(zText) {
        if (zText[zText.length - 1] == point)
            return round(zText.substr(0, zText.length - 1) + zChars[11]) + point;
        else if (zChars.indexOf(zText[zText.length - 1]) >= 6) {
            if (zText[zText.length - 2] == zChars[11])
                return round(zText.substr(0, zText.length - 1)) + zChars[0];
            else {
                if (zText[zText.length - 2] == point)
                    return zText.substr(0, zText.length - 3) + zChars[zChars.indexOf(zText[zText.length - 3]) + 1] + point;
                else
                    return zText.substr(0, zText.length - 2) + zChars[zChars.indexOf(zText[zText.length - 2]) + 1];
            }
        }
        else {
            return zText.substr(0, zText.length - 1);
        }
    }
    
    // 's' for "sexagesimal".
    function convertTime(sText, am) {
        sText += '';
        var hour = sText.substr(0, 2) % 12 + (am == 'AM' ? 0 : 12);
            var minute = sText.substr(3, 2) * 1;
        var minutes = hour * 60 + minute;
        var trices = Math.round(minutes * 60 / 50);
        var breathers = Math.floor(trices / 12);
        var dwells = Math.floor(breathers / 12);
        var trice = trices % 12;
        var breather = breathers % 12;
        var dwell = dwells % 12;
        return zChars[dwell] + zChars[breather] + zChars[trice]; 
    }
    
    function convertDateWithSeparator(dText, separator) {
        dText += '';
        var month = dText.match(/\b[A-Za-z]{3}/);
        var day = dText.match(/\b\d\d?(?=[ a-z])/);
        var zDay = toDozenal(day);
        if (day < 12) zDay = '0' + zDay;
        if (day < 10) day = '0' + day;
        var year = dText.match(/\d{4}/);
        var zDate = '(' + month + ' ' + zDay + ' ' + toDozenal(year) + ')' + dozenal;
        var dDate = '(' + month + ' ' + day + ' ' + year + ')' + decimal;
        return zDate + separator + dDate;        
    }
    
    function convertDate(dText) {
        return convertDateWithSeparator(dText, '&nbsp;=&nbsp;');
    }
    
    function convertDateStacked(dText) {
        return convertDateWithSeparator(dText, '<br>');
    }
    
    // 's' for "sexagesimal".
    function convertDateTimeWithSep(dText, separator) {
        dText += '';
        var month = dText.match(/[A-Za-z]{3}/);
        var day = dText.match(/\b\d\d?(?=[ a-z])/);
        var zDay = toDozenal(day);
        if (day < 12) zDay = '0' + zDay;
        if (day < 10) day = '0' + day;
        var year = dText.match(/\d{4}/);
        var time = dText.match(/\b\d\d:\d\d/);
        var am = dText.match(/[AP]M/);
        var zDateTime = '(' + month + ' ' + zDay + ' ' + toDozenal(year) + ', trice ' + convertTime(time, am) + ')' + dozenal;
        var dDateTime = '(' + month + ' ' + day + ' ' + year + ', ' + time + ' ' + am + ')' + decimal;
        return zDateTime + separator + dDateTime;
    }
    
    // 's' for "sexagesimal".
    function convertDateTime(dText) {
        return convertDateTimeWithSep(dText, '&nbsp;=&nbsp;')
    }
    
    // 's' for "sexagesimal".
    function convertDateTimeStacked(dText) {
        return convertDateTimeWithSep(dText, '<br>')
    }
    
    function elConvert(element, pattern) {
        element.innerHTML = element.innerHTML.replace(pattern, convert(element.innerHTML.match(pattern)));
    }
    
    function elConvertStacked(element, pattern) {
        element.innerHTML = element.innerHTML.replace(pattern, convertStacked(element.innerHTML.match(pattern)));
    }
    
    function elConvertFract(element, pattern) {
        element.innerHTML = element.innerHTML.replace(pattern, convertFract(element.innerHTML.match(pattern)));
    }
    
    function toDozenalMultifield(text, pattern) {
        try {
            text += '';
            var matches = text.match(pattern);
            var startPos = 0;
            for (var i = 0; i < matches.length; i++) {
                var match = matches[i];
                startPos += text.substring(startPos).search(pattern);
                var split = [text.substr(0, startPos), text.substr(startPos, match.length), text.substr(startPos + match.length)];
                var result = toDozenal(match);
                text = split[0] + result + split[2];
                startPos += result.length;
            }
        } catch (e) {
            console.log(e);
        }
        return text;
    }
    
    function elConvertMultifield(element, pattern) {
        element.innerHTML = element.innerHTML + decimal + '=' + toDozenalMultifield(element.innerHTML, pattern);
    }
    
    function elConvertGlobal(element, pattern) {
        var matches = element.innerHTML.match(pattern);
        var startPos = 0;
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            startPos += element.innerHTML.substring(startPos).search(pattern);
            var split = [element.innerHTML.substr(0, startPos), element.innerHTML.substr(startPos, match.length), element.innerHTML.substr(startPos + match.length)];
            var result = convert(match);
            element.innerHTML = split[0] + result + split[2];
            startPos += result.length;
        }
    }
    
    function elCreateFract(element, pattern, number, fractLength, makePerGross) {
        var dFract = element.innerHTML.match(pattern);
        var zFract = createFract(number, fractLength, makePerGross);
        var fract = zFract + '&nbsp;=&nbsp;' + dFract + decimal;
        element.innerHTML = element.innerHTML.replace(pattern, fract);
    }
    
    function elConvertTime(element, pattern) {
        var match = element.innerHTML.match(pattern) + '';
        element.innerHTML = element.innerHTML.replace(match, convertTime(match.substr(0, 5), match.substr(6) == 'AM'));
    }
    
    function elConvertDate(element, pattern) {
        var match = element.innerHTML.match(pattern) + '';
        element.innerHTML = element.innerHTML.replace(match, convertDate(match));
    }
    
    function elConvertDateTime(element, pattern) {
        var match = element.innerHTML.match(pattern) + '';
        element.innerHTML = element.innerHTML.replace(match, convertDateTime(match));
    }
    
    function elConvertDateTimeStacked(element, pattern) {
        var match = element.innerHTML.match(pattern) + '';
        element.innerHTML = element.innerHTML.replace(match, convertDateTimeStacked(match));
    }
    
    function elConvertYear(element) {
        var pattern = /\d{4}(?= )/;
        element.innerHTML = element.innerHTML.replace(pattern, convertYear(element.innerHTML.match(pattern)));
    }
    
    function txtConvert(textNode, pattern) {
        textNode.textContent = textNode.textContent.replace(pattern, convert(textNode.textContent.match(pattern)));
    }
    
    (function() {
        var el, els, i;
        
        // Common elements:
		
		    // Inbox count:
        el = document.querySelector('b+a');
        elConvert(el);

    		// Page creation time (in the footer (class=row4), in a <b> tag)
        el = document.querySelector('.row4[align=center]>b');
        var creationTimeSeconds = parseFloat(el.innerHTML);
        var creationTimeJiffs = creationTimeSeconds / 50 * 1728;
        el.innerHTML = el.innerHTML.replace(/.+/, creationTimeSeconds + decimal);        
        el = document.querySelector('.row4[align=center][style]');
        el.innerHTML = el.innerHTML.replace('seconds', 'seconds = <b>' + createFract(creationTimeJiffs, 4) + '</b> jiffs');

        // Invision copyright year
        elConvertYear(el, /\d{4}(?= )/);
        
        // Terms of use update date (second hyperlink in footer)
        el = document.querySelector('.row4[align=center]>a:nth-of-type(2)');
        var match = el.innerHTML.match(/\d+\/\d+\/\d+\b/);
        el.innerHTML = el.innerHTML.replace(match, match + decimal + ' = ' + toDozenalMultifield(match, /\d+\b/g) + dozenal);
        
        if (document.location.search == '?act=idx' || (document.location.search == '' && document.title.indexOf(' ') == -1) || document.location.search.indexOf('?c=') != -1) {
            // Main page
            
            // Last Visit Date
            el = document.querySelector('#navstrip+br+div');
            elConvertDateTime(el, /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            
            // Topic and Reply Counts
            els = document.querySelectorAll('.row2[align]');
            for (i = 0; i < els.length; i++)
                elConvertStacked(els[i], /.+/);
            
            // Last Post Date
            els = document.querySelectorAll('.row2[nowrap]');
            for (i = 0; i < els.length; i++) {
                elConvertDateTimeStacked(els[i], /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            }
            
//             el = document.querySelector('div>a+a+a');
//             el.innerHTML = el.innerHTML.replace('10', zChars[10] + dozenal);
            
            el = document.querySelector('.pformstrip');
            elConvert(el, /\d+/);
            el.innerHTML = el.innerHTML.replace('15 minutes', '16<sub>z</sub> trices = 15<sub>d</sub> minutes');
            
            // Board Statistics
            els = document.querySelectorAll('.row4:last-child>b');
            for (i = 0; i < els.length - 1; i++) {
                el = els[i];
                if (el.innerHTML.match(/[0-9,]+/) == el.innerHTML)
                    elConvert(el, /.+/);
                if (el.innerHTML.match(/\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/) == el.innerHTML)
                    elConvertDateTime(els[i], /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            }
			
			// Overall Top 10[d] Posters
			el = document.querySelector('a[href*="max_results"]');
			el.innerHTML = el.innerHTML.replace('Overall top 10 posters','Overall top ' + zChars[10] + '<sub>z</sub> = 10<sub>d</sub> posters');
        }
        else if (document.location.search.indexOf('showforum=') != -1 || document.location.search.indexOf('act=SF') != -1 || document.location.search.indexOf('?c=') != -1) {
            
            // Topic list
            
            // Replies/Views counts
            els = document.querySelectorAll('.row4:nth-child(5)>a, .row4:nth-child(6), .row2:nth-child(6)');
            for (i = 0; i < els.length; i++)
                if (els[i].innerHTML.indexOf('-') == -1)
                    elConvertStacked(els[i], /.+/);
            
            // Last Post Date
            els = document.querySelectorAll('.row4:nth-child(7), .row2:nth-child(7)');
            for (i = 0; i < els.length; i++) {
                elConvertDateTimeStacked(els[i], /\b\d\d?[a-z]{2} [A-Za-z]+ \d{4} - \d\d:\d\d [AP]M/);
            }
            
            // Subforum List
           
            // Topics/Replies counts
            els = document.querySelectorAll('.row2:nth-child(3), .row2:nth-child(4)');
            for (i = 0; i < els.length; i++)
                elConvertStacked(els[i], /\d+(?! )/);
            
            // Last Post Info Date
            els = document.querySelectorAll('.row2:nth-child(5)');
            for (i = 0; i < els.length; i++) {
                elConvertDateTimeStacked(els[i], /\b[A-Za-z]+ \d\d? \d{4}, \d\d:\d\d [AP]M/);
            }
            
            // Showing x of y topics sorted by ...
            els = document.querySelectorAll('.darkrow2');
            el = els[els.length - 1];
            var dCount = el.innerHTML.match(/\d+ of \d+/);
            dCount += '';
            if (dCount) {
                var x = el.innerHTML.match(/\b\d+(?= of)/);
                var y = el.innerHTML.match(/\b\d+(?= topics)/);
                var zCount = '(' + toDozenal(x) + ' of ' + toDozenal(y) + ')' + dozenal;
                dCount = '(' + dCount + ')' + decimal;
                el.innerHTML = el.innerHTML.replace(/\d+ of \d+/, zCount + ' = ' + dCount);
            }

            // Users/Guests/Anonymous browsing this forum
            el = els[els.length - 2];
            elConvertGlobal(el, /\d+(?= )/g);

            // Multi-page breadcrumb:
            // Non-links: (total) [current]
            els = document.querySelectorAll('[width="20%"]');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                // Make sure to include only digits that are followed by ] or ) but not );
                elConvertGlobal(el, /\d+(?=[\)\]](?!;))/g);
            }
            // Page links:
            els = document.querySelectorAll('[width="20%"]>a');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                elConvert(el, /\d+/);
            }
            
            // Individual topic page links
            els = document.querySelectorAll('.row4>span>a');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                elConvert(el, /\d+/);
            }
//             els = document.querySelectorAll('.row2:nth-child(3)');
//             for (i = 0; i < els.length; i++)
//                 elConvert(els[i], /.+/);
            
//             els = document.querySelectorAll('.row2:nth-child(4)');
//             for (i = 0; i < els.length; i++)
//                 if (els[i].innerHTML != els[i].innerText)
//                     break;
//                 else
//                     elConvert(els[i], /.+/);
            
            
        }
        else if (document.location.search.indexOf('showtopic=') != -1 || document.location.search.indexOf('act=ST') != -1) {
            // Topic Thread
            
            // Message posted date
            els = document.querySelectorAll('.row4>.postdetails');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                elConvertDateTime(el, /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            }
            
            // Message author stats
            els = document.querySelectorAll('.post1>.postdetails, .post2>.postdetails');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                var postCount = el.innerHTML.match(/Posts: [\d,]+/) + '';
                postCount = postCount.match(/[\d,]+/);
                postCount = 'Posts: ' + convert(postCount);
                el.innerHTML = el.innerHTML.replace(/Posts: [\d,]+/, postCount);
                
                var memberNum = el.innerHTML.match(/Member No\.: [\d,]+/) + '';
                memberNum = memberNum.match(/[\d,]+/);
                memberNum = 'Member No.: ' + convert(memberNum);
                el.innerHTML = el.innerHTML.replace(/Member No\.: [\d,]+/, memberNum);
                
                var joinedDate = el.innerHTML.match(/\d\d?-[A-Za-z]+ \d\d<br>/) + '';
                joinedDate = joinedDate.replace(' ', ' 20').replace('-', ' ');
                joinedDate = '<br>' + convertDateStacked(joinedDate);
                el.innerHTML = el.innerHTML.replace(/\d\d?-[A-Za-z]+ \d\d/, joinedDate);
               
            }
            
            // Multi-page breadcrumb:
            // Non-links: (total) [current]
            els = document.querySelectorAll('[width="20%"]');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                // Make sure to include only digits that are followed by ] or ) but not );
                if (el.innerHTML.match(/\d+(?=[\)\]](?!;))/)) {
                    elConvertGlobal(el, /\d+(?=[\)\]](?!;))/g);
                }
            }
            // Page links:
            els = document.querySelectorAll('[width="20%"]>a');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                if (el.innerHTML.match(/Topic Options/)) {
                    continue; // skip
                }
                if (el.innerHTML.match(/\d+/)) {
                    elConvert(el, /\d+/);
                }
            }
            
            // Quote banners
            els = document.querySelectorAll('td:only-child:not([id])');
            for (i = 0; i < els.length; i++) {
                el = els[i];
			          elConvertDateTime(el, /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            }
            
            // Survey
            els = document.querySelectorAll('.tablepad');
            if (els.length == 2) {
                
                // Votes
                els = document.querySelectorAll('.tablepad>*>*>*>.row1>b');
                var votes = new Array(els.length);
                for (i = 0; i < els.length; i++) {
                    el = els[i];
                    votes[i] = parseInt(el.innerHTML.match(/\d+/));
                    elConvert(el, /\d+/);
                }
                
                // Total Votes
                el = document.querySelector('.tablepad>*>*>*>.row1:only-child');
                var totalVotes = parseInt(el.innerHTML.match(/\d+/));
                elConvert(el, /\d+/);
                
                if (totalVotes == 0)
                    totalVotes = 1;
                
                els = document.querySelectorAll('.tablepad>*>*>*>.row1:last-child:not(:first-child)');
                for (i = 0; i < els.length; i++) {
                    el = els[i];
                    elCreateFract(el, /\d{1,3}\.\d\d%(?=])/, votes[i] / totalVotes, 2, true);
                }
            }
            
            // Active Users Strip
            el = document.querySelector('.activeuserstrip');
            elConvertGlobal(el, /\d+/g);
            
            // Where is this used?
            els = document.querySelectorAll('.edit');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                elConvertDateTime(el, /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            }
        }
        else if (document.location.search.indexOf('act=Post') != -1 || document.title.substr(0, 28) == 'Dozensonline -> Replying in ') {
            // Editing a new reply or an existing post, with or without Quote
            
            els = document.querySelectorAll('td.row4:last-child');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                elConvertDateTime(el, /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            }
            
            els = document.querySelectorAll('div.pformstrip');
            for (i = 0; i < els.length; i++) {
                if (els[i].innerHTML == 'Last 10 Posts [ In reverse order ]') {
                    el = els[i];
                    elConvert(el, /\d\d?/);
                    break;
                }
            }
            
            // Quote banners
            els = document.querySelectorAll('td:only-child:not([id])');
            for (i = 0; i < els.length; i++) {
                el = els[i];
			          elConvertDateTime(el, /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            }
        }
        else if (document.location.search.indexOf('showuser=') != -1) {
            // Viewing a user's profile
            
            
            els = document.querySelectorAll('.row1>b');
            
            // Total Cumulative Posts
            el = els[0];
            elConvert(els[0], /[\d,]+/);
            
            // Percentage of total forum posts
            el = el.parentNode;
            var percentagePosts = el.innerHTML.match(/\d{1,3}\.\d\d%/) + '';
            percentagePosts = parseFloat(percentagePosts) / 100;
            elCreateFract(el, /\d{1,3}\.\d\d%/, percentagePosts, 2, true);
            
            // Posts per day
            el = els[1];
            var postsPerDay = el.innerHTML.match(/\d+\.\d+/) + '';
            postsPerDay = parseFloat(postsPerDay);
            elCreateFract(el, /\d+\.\d+/, postsPerDay, 1, false);
            
            // Joined date
            el = els[2];
            var joinedDate = el.innerHTML.match(/\d\d?-[A-Za-z]+ \d\d/) + '';
            joinedDate = joinedDate.replace(' ', ' 20').replace('-', ' ');
            joinedDate = convertDate(joinedDate);
            el.innerHTML = el.innerHTML.replace(/\d\d?-[A-Za-z]+ \d\d/, joinedDate);
            
            els = document.querySelectorAll('.row1');
            
            // Last Activity
            el = els[3];
            elConvertDateTime(el, /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            
            // User's local time
            el = els[4];
            elConvertDateTime(el, /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            
            // Birthday
            el = els[12];
            elConvertDate(el, /\d\d? [A-Za-z]+ \d{4}/);

        }
        else if (document.location.search.indexOf('act=Search') != -1) {
            // Find all topisc by this member
            
            // Replies/Views counts
            els = document.querySelectorAll('.row4:nth-child(6), .row2:nth-child(7)');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                elConvertStacked(els[i], /.+/);
            }
            
            // Last Action date
            els = document.querySelectorAll('.row2:nth-child(8)');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                elConvertDateTimeStacked(el, /\b[A-Za-z]{3} \d\d? \d{4}, \d\d:\d\d [AP]M/);
            }
            
            // Page links:
            els = document.querySelectorAll('a[title="Jump to page..."]');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                el = el.parentNode;
                // Make sure to include only digits that are followed by ] or ) but not );
                if (el.innerHTML.match(/\d+(?=[\)\]](?!;))/)) {
                    elConvertGlobal(el, /\d+(?=[\)\]](?!;))/g);
                }
                // Page links:
                var links = el.querySelectorAll('a');
                for (var j = 0; j < links.length; j++) {
                    var link = links[j];
                    if (link.innerHTML.match(/Pages|Last/)) {
                        continue; // skip
                    }
                    if (link.innerHTML.match(/\d+/)) {
                        elConvert(link, /\d+/);
                    }
                }
            }
            
            // Topic Page links:
            els = document.querySelectorAll('.row4>table>tbody>tr>td>span>a');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                elConvert(el, /\d+/);
            }
            
        }
        else if (document.location.search.indexOf('act=Msg') != -1) {
            // Private Message
            
            // Not sure it has anything to convert.

//             els = document.querySelectorAll('.row1');
//             for (i = 0; i < els.length; i++)
//                 elConvertFract(els[i], /\d{1,3}%/);
            
//             els = document.querySelectorAll('.dlight>td:nth-child(4)');
//             for (i = 0; i < els.length; i++) {
//                 el = els[i];
//                 elConvert(el, /\d\d?/);
//                 elConvert(el, /\d{4}/);
//                 if (tgmTime)
//                     elConvertTime(el, /\d\d:\d\d [AP]M/);
//             }
            
//             elConvertGlobal(document.querySelector('i'), /\d+/g)
        }
        else if (document.location.search.indexOf('act=Members') != -1 || document.title == 'Member List' ) {
            // Member List
            
            els = document.querySelectorAll('.row4[width="20%"]');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                var joinedDate = el.innerHTML.match(/\d\d?-[A-Za-z]+ \d\d/) + '';
                joinedDate = joinedDate.replace(' ', ' 20').replace('-', ' ');
                joinedDate = convertDateStacked(joinedDate);
                el.innerHTML = el.innerHTML.replace(/\d\d?-[A-Za-z]+ \d\d/, joinedDate);
            }
               
            els = document.querySelectorAll('.row4[width="10%"]');
            for (i = 0; i < els.length; i++) {
                el = els[i];
                el.innerHTML = el.innerHTML.replace(',','');
                elConvertStacked(el, /\d+/);
            }
        }
    })();
})();

