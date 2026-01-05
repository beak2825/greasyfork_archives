// ==UserScript==
// @name           WME URComments Polish List
// @description    This script is meant to facilitate the handling of URs in Polish language. To be used with the main script URComments
// @namespace      RickZabel@gmail.com
// @grant          none
// @grant          GM_info
// @version        0.0.3
// @include     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @include        https://www.waze.com/*/editor*
// @include        https://www.waze.com/editor*
// @include        https://beta.waze.com/*
// @exclude      https://www.waze.com/*user/*editor/*
// @author         Rick Zabel '2014
// @license        MIT/BSD/X11
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZCWxU1xW9M39mPB5v431fMLYJdmpjthQUVsdlS9IQQkpIIDRhl5pKQUpbKkAEpakQIhVVRUytQIGwihCaBkgItQELQosxdrDZ7Njjbbx7vM0+f3ruZDz1NmTGhEj59tOb//979553313fl9jtdvqpXbLHRVgikTz0NbdJkyYJERERUp1OJ1Wr1WJLS4tYXFxswzu7s408+XFJ2g1oSUZGhtzf318piqLKx8dHZbPZFFKpVMC9TRAEs8lk0uNe39vbaywvL7eMBP5HAz179myZxWLxxfNg3IZHRkbG5OTkpEPSkQAs1Wq1nQUFBVXt7e2twNSGMdx3yuVyQ2FhofVHBw01kCsUigA8i1m9evXc3Nzc5TExMRMhUfnAOZC6VaPRlJ8+ffrzM2fOXMW9BvgazWZzD9TG8qOBZgnr9fqg5OTklPfff39bUlLSfL3ZKvmmqZ2q2rqoy2h2jAtSKmhsaBD9LDqUVAqZ/fbt29c2b978IfS9HCqjUalUXf0Sfyygp0+f7kB8584d6bhx4/xTU1PT9uzZk69WB2derdHSxQf1ZLTaRpyrlAmUkxpH05OiqbGxoWrjxo07Wltbb0KFNNevX+/FENEBmqUyWvCTJ0+WDPEKrh4S8oFXiDp+/HhedHT0M6fKvqWbDa0e0Z0YG05LMpPp/v37xWvXrn0XqlRWX1+vraysNEkfZu38zE1zXHPmzOH53ARuAQEBUuieBM2OJoaFhSl27NixAPr7TGFVo8eA+eKxPAc7Nen111/PgX5HxMXF+TIsmSe+1bkbEuintKamRoBeyqxWq6Knp0eA2xJAUAJ3Zce9+PTTT9tkMpkF7opgQEEwwjU6g4kKKhu83sWCynrKjg2jhQsXPrd///4L2Dkm0iv9PntiSUIF5JmZmSpMCsI2hwNMNBYSC4+QgLUkoE909vF4HoP3kVhY+Pz589Mh/czi+layiqLXoK2inXhuVFRUUlZWViIE45eSkiI8LCKyZAUAZbfki8sfxhA4bdq0+GXLluUmJCRMBqCxkHQY9E2BdxwY2iDtqtra2hsHDhy4jIVOYTqV8BIDr3ERakd/r0Xn9nf/9aBNx4YpmTlzZtrNmzcvBwUFuQXNIZaDgRJS84eDV8+bN2/cqlWr1rF+AqTMbDFRU72WdI29ZNZbSaGSKdQx/jFRcdExERGTZ6Snp/8GYbmGiXVBPQZeyyakOvrtX/7X7e/+S2f4ziXCPoIhaam73MMBGJcvBgXBP4bv3LnztSlTpmwAWOW9svtU/kkd1V/rINE23ONIBQnFTQuh1OciZXHJsSn8TBwy7NitB67g7O53/yX8386sHOqhgnbZSCrBEoaOqpVKZXReXt5W6OfC5uZGuvjnW9RU2v1QPbRZ7aS50kbVl5spY2kHLdg4i0L9lNRtMrvGDNx+d7/7rxCVj6Nva2vTArARPts21BClHR0dPqy7MKgIAOYItrD8ZgUdWXmFtCVdZIfYPGsILufqsBsipYYHjTpQpYWrCXjEixcv3oKX6oNXGgRasmDBAhkyMD+MCd21a9dKAF5QUVxB598uJZvR5nB9njZHcOm20oOva2lKfAT5yASvAXN0nIy5zc3NJRUVFd/CvvpY26QDsjABhqMEw0AYXQZ0eG1TUwOd+30pr9QrwA7Q+JfapVT0j1sE46BF4xO9Bv1sehIDF8+ePfsR7KmF01UOG/06LUGIFIKDg33hwtRvvPHGagzyOf9uMVlNVrdEx+ZEUdZLSZSYlkBymYK6ejrp/rVqupFfTT3NBodNNd1pp6IjJTRzxSRHcsR5hyfXL9LiaWJcOOcvJ/Pz8wvgSjud+bXLe0iR3yogIb+JEyeOiY+Pn1VRUkHaMt3I5Y5CSs/unkTjJ4wf9FwdGEJT54VQ1px0Or21kKqLWhGdZHRpXwn5h6goZ9F4ig5UEecgBsvIwghVKSHhRPjsYIIgv3jrrbfeMxqNWrhQA0DbXaChGhKkjwpI2W/JkiXsh4XS4xq3SdSczRnDAA+8fBS+9OKOuZS/4jPS1fUhlRTo0z8VUGeHjua+Ng3pp47+U9viGv8Egkp0oB+NCQlEehrI6mhEarpvw4YNfzMYDM3IEntPnjxpG1QjsmogPCtgnX6JiYnZJrPRISW7OBy0b4Ccsudkfu/2KuQ+NGXtGPrij9+QiD8b/vyDVWSDfVQ0dTrGBPjI6YUnk+mJyGDOF+wACCj1Xx47duwQ9Pge7ruReJmcdePgwjY8PFzKtRoinxKpZFJjbSNXESOCCc8IIgQdj/QyeUI8AkupA3DChCiaujCTyps7KF7tT2mQ7oSYMJJJyFp840beoUOHjiBM17OHAG8DUgTzgCJ3eDXOKSUsU4ZtUSDHUHc0drlVjYAYpcfWLyBL6KczY/kkkkgl9CQqE27skZAb30Cuve/ChQuFiA9aCM9YVFRke1gl7gKN1UkQtlnaUq7bLMglyA3omGzPA0VjdZODDjJwOrXlIl3PKiOFv5ySc8IoKT2BkMt8AL4VXMjCyPq+D+ywcw+AtbNKoFnkKplctItDPIZArx6cRWOSx3oMuvhgFfXTsejtVH2tyZHspuZGENwru68upAt9UDeLp4DJWXUQJyFI6kVMtvX19XWExquHBQsL/PX9As8T+Suffk0PLjcOCjZkl3CFR5Fjwnh3O2BDlv4kyJvA5QDNFYczizK3t7fXxMbHkVQhcUhpYCvaW0H7Vp+iqsoHDwX87xNF9MWOkmHzuTHdmLg4gg5XMz/m6+RPXkkamZOIbeItMty7d++WXCan1LnRHOaHtbpbzVT4QZljxTbRRof/8E/au+oEHd3+LxewygtNI87llga6TP/u3bulzI/5Mn+vz/JQMNpQdXCmrj948GBRbm7uqqmvjfOpOKsZcdK317T0l5c/JptJpM7671LV+jJCFvixw0O01ejcV++vphFU0XT48OEi2I+e8yrm77WkCwsLRURDM3S6j8t0RKPC1CfSaOysGLd61VrZSR11XYOetWl01Frd6XYO00sbP47gKQpRkmmZH/Nl/l6DZhMBWOT+FnY7nbt37z4Bwfcs3jaLfIOUXmd4IzWmw/SYLtNnPsyP+XrjOQaBhqO3wmfqwUBXVVVVjVj/kTooxL48fzYJPsKIRuVp4/lMh+kxXabPfJgf8x0taEcph2TbzPEev1v27t174dKlS6fGpqTSm0fnU0C4alQS5nk8n+mA3idMl+kzH+bntFAaLWiWNm+VHv6zHX3D1q1bD3/11VcnksYki7898yvKfGkMOHgGlsdlvphMPI/nMx3QO8R0nfT1Tn5en8e5zvIGFrZc6fDBDIhHwJfGvvLKK7NXrFjxa+QoIVptA109WUqlJ2uot1M/jKBcIaOpq9Jo+tIsio6O5RjQgWToo6NHj15C1G2AHrfA+PggxAgDdOUZ3pwlDgU9CDhcUgDcUxisPDIkJCQBCflzTz311BzUkUG1dTX01+c/Iat5sLd6YefPadaiGQy2+/r16wV79uz5rLOzUwNazdDhNtDqGQr4hwDtAg7GCpVK5YeQq4bUQyCpSDCOfeedd55HHTm/8MwV+nTzVdekJ+cn0Zu7XubsrWLNmjUfYpfq0Jqw8HaEah0KjT5OOYcC/qFAu87xAF6u0+mU2FJ/gOZTnkg8jz9w4MCm5OTkjL+/fYxun9eQOiqAfvf5ShQOEt26deve1Wg0d0FbC3VoR+tBns7StTgNzz7SIedoDJFGOGfmbbYhxzZBWj0A3c6SQ2vYtm1bPpKrruXvLSJ1tD+9ujeHfJV+Yl5e3n4EjkoGDJVoY8A8f0ColgykP6qvDCPp9NKlS6UlJSUyqIYMDAU+u8MYmfNLlD+kHQbgcYsXL56xadOm9XpDr9RPFUAFBQVfbtmy5Qho1rFb4zVjjhH31sDAQCvcHJ+7WLu7u22IitaBn94eRT1cugxg/CXKl8/vMEbOF/d8tIBxfIIaivvI7du3/zInJ2d2XV1dzcqVKz+EZDlb4tPzHrw3YryZQXNihN0y8yIw1xAREWE8d+5cv7o8EmhpSkqKHGWPH0Cr+XiMz4TZk3Apxh6tHziYx+J3KNYSCA+xaOfOnVeqq6ubQUuH941o7NYYlJULC4w14Z0ehtyLe37XY8SFOtD6HWa7d1newEVwkcuqwODQs5T5k4EvepY+PxMgMTkWwc9l4Gtfv379ebwX0QS89+HzE/Qc7fhs28qVCcYL/LUAcy0Od65QCJj7g3xmtrPBREVFOXJrMOdi1wYAnLbKISHWbWbOC+vg+XzPjZUV4/mrq5V7bpC2o7jghnszABv4EJH9NPhY+w9fHhl0dna2FQQNXE1gK01wdQpIhMexWjgAcyXt7LmxivEnGTvXmUyDF8D3zm13nCszcNZrVhN4HRaC2Z37G5X36P/YjtJLCA0NlfIRA38UQi+BtCT8Ycj5hVUy/NhAcIFgb8H3SqVSZCH4+fmJ7DmgguLjiIhDvwmyG+SyTALmHvtYLNIOcHaei5S0H5X9UYPL/wQYAOwQASZqvrLnAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/23536/WME%20URComments%20Polish%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/23536/WME%20URComments%20Polish%20List.meta.js
// ==/UserScript==


var UrcommentsPolishVersion = GM_info.script.version; 
//var UrcommentsPolishVersion = "0.0.2"; //manually change this version number to match the script's version 
var UrcommentsPolishUpdateMessage = "yes"; // yes alert the user, no has a silent update.
var UrcommentsPolishVersionUpdateNotes = "URC Polish List has been updated to " + UrcommentsPolishVersion;
UrcommentsPolishVersionUpdateNotes = UrcommentsPolishVersionUpdateNotes + "\n" + "-improved text of 'Missing Road' and 'Turn not allowed (unknown junction)'\n -added speed limit responses\n\n ! Editing should be fun for everybody ¡";

if (UrcommentsPolishUpdateMessage === "yes") {
    if (localStorage.getItem('UrcommentsPolishVersion') !== UrcommentsPolishVersion) {
        alert(UrcommentsPolishVersionUpdateNotes);
        localStorage.setItem('UrcommentsPolishVersion', UrcommentsPolishVersion);
    }
}

/* 0.0.2 - initial version
 */
//I will try not to update this file but please ALWAYS KEEP AN EXTERNAL BACKUP of your comments. The main script might force and update to this file and than you will loose your custom comments. By making this a separate script, we try to limit how often this would happen, but be warned, it will eventually happen!
//if you are using quotes in your titles or comments they must be properly escaped. example "This is \"quoted\" in your comment",
//if you wish to have text on the next line, use \r. example "Line1\rLine2",
//if you wish to have blank lines in your messages use \r\r. example "Paragraph1\r\rParagraph2",
//Custom Configuration: this allows your "reminder", and close as "not identified" messages to be named what ever you would like.
//the position in the list that the reminder message is at. (starting at 0 counting titles, comments, and ur status). in my list this is "Reminder"
window.UrcommentsPolishReminderPosistion = 12;

//this is the note that is added to the the reminder link (option disabled, not necessary at this moment)
window.UrcommentsPolishReplyInstructions = 'To reply, please either use the Waze app or go to '; //followed by the URL

//the position of the close as Not Identified message (starting at 0 counting titles, comments, and ur status). In this list this is "Close without reply"
window.UrcommentsPolishCloseNotIdentifiedPosistion = 15;

//This is the list of Waze's default UR types. edit this list to match the titles used in your area! 
//You must have these titles in your list for the auto text insertion to work!
window.UrcommentsPolishdef_names = [];
window.UrcommentsPolishdef_names[6] = "Nieprawidłowy skręt"; //"Incorrect turn";
window.UrcommentsPolishdef_names[7] = "Błędny adres"; //"Incorrect address";
window.UrcommentsPolishdef_names[8] = "Błędna trasa"; //"Incorrect route";
window.UrcommentsPolishdef_names[9] = "Brak ronda"; //"Missing roundabout";
window.UrcommentsPolishdef_names[10] = "Ogólny błąd"; //"General error";
window.UrcommentsPolishdef_names[11] = "Zakaz skrętu"; //"Turn not allowed";
window.UrcommentsPolishdef_names[12] = "Nieprawidłowe skrzyżowanie"; //"Incorrect junction";
window.UrcommentsPolishdef_names[13] = "Brak mostu lub przejazdu"; //"Missing bridge overpass";
window.UrcommentsPolishdef_names[14] = "Złe wskazówki jazdy"; //"Wrong driving direction";
window.UrcommentsPolishdef_names[15] = "Brak zjazdu"; //"Missing Exit";
window.UrcommentsPolishdef_names[16] = "Brak drogi"; //"Missing Road";
window.UrcommentsPolishdef_names[18] = "Brakujący punkt orientacyjny"; //"Missing Landmark";
window.UrcommentsPolishdef_names[19] = "Blocked Road"; //"Blocked Road";
window.UrcommentsPolishdef_names[21] = "Missing Street Name"; //"Missing Street Name";
window.UrcommentsPolishdef_names[22] = "Incorrect Street Prefix or Suffix"; //"Incorrect Street Prefix or Suffix";
window.UrcommentsPolishdef_names[23] = "Ograniczenie prędkości";  //speed limit ur type is number 23;

//below is all of the text that is displayed to the user while using the script
window.UrcommentsPolishURC_Text = [];
window.UrcommentsPolishURC_Text_tooltip = [];
window.UrcommentsPolishURC_USER_PROMPT = [];
window.UrcommentsPolishURC_URL = [];

//zoom out links
window.UrcommentsPolishURC_Text[0] = "Oddal na 0 i zamknij zgłoszenie";
window.UrcommentsPolishURC_Text_tooltip[0] = "Maksymalne oddalenie i zamknięcie okna zgłoszenia";

window.UrcommentsPolishURC_Text[1] = "Oddal na 2 i zamknij zgłoszenie";   	 
window.UrcommentsPolishURC_Text_tooltip[1] = "Oddalenie do poziomu 2 i zamknięcie okna zgłoszenia";

window.UrcommentsPolishURC_Text[2] = "Oddal na 3 i zamknij zgłoszenie";
window.UrcommentsPolishURC_Text_tooltip[2] = "Oddalenie do poziomu 3 i zamknięcie okna zgłoszenia";

window.UrcommentsPolishURC_Text_tooltip[3] = "Odśwież mapę";

window.UrcommentsPolishURC_Text_tooltip[4] = "Ilość pokazywanych zgłoszeń";

//tab names
window.UrcommentsPolishURC_Text[5] = "Komentarze";
window.UrcommentsPolishURC_Text[6] = "Filtrowanie zgłoszeń";
window.UrcommentsPolishURC_Text[7] = "Ustawienia";

//UR Filtering Tab
window.UrcommentsPolishURC_Text[8] = "Naciśnij, jeśli potrzebujesz pomocy";
window.UrcommentsPolishURC_Text_tooltip[8] = "Instrukcje filtrowania zgłoszeń";
window.UrcommentsPolishURC_URL[8] = "https://docs.google.com/presentation/d/1zwdKAejRbnkUll5YBfFNrlI2I3Owmb5XDIbRAf47TVU";

window.UrcommentsPolishURC_Text[9] = "Włącz filtrowanie zgłoszeń przez URComments";
window.UrcommentsPolishURC_Text_tooltip[9] = "Włączanie lub wyłączanie filtrowania zgłoszeń przez skrypt URComments";

window.UrcommentsPolishURC_Text[10] = "Włącz statystyki pod zgłoszeniami";
window.UrcommentsPolishURC_Text_tooltip[10] = "Włącza lub wyłącza pokazywanie ilości komentarzy i dni od ostatniej akcji pod zgłoszeniem";

window.UrcommentsPolishURC_Text[12] = "Ukryj Oczekujące";
window.UrcommentsPolishURC_Text_tooltip[12] = "Pokazuje tylko te zgłoszenia, które wymagają Twojej uwagi (ukrywa oczekujące na odpowiedź)";

window.UrcommentsPolishURC_Text[13] = "Pokaż tylko zgłoszenia z moimi komentarzami";
window.UrcommentsPolishURC_Text_tooltip[13] = "Ukrywa zgłoszenia, które nie zostały skomentowane przez Ciebie";

window.UrcommentsPolishURC_Text[14] = "Pokaż zgłoszenia innych po terminie przypomnienia + zamknięcia";
window.UrcommentsPolishURC_Text_tooltip[14] = "Pokazuje zgłoszenia skomentowane przez innych, których minął zarówno termin przypomnienia, jak i zamknięcia";

window.UrcommentsPolishURC_Text[15] = "Ukryj zgłoszenia wymagające przypomnienia";
window.UrcommentsPolishURC_Text_tooltip[15] = "Ukrywa zgłoszenia, które wymagają wysłania przypomnienia";

window.UrcommentsPolishURC_Text[16] = "Ukryj zgłoszenia z odpow. użytkowników";
window.UrcommentsPolishURC_Text_tooltip[16] = "Ukrywa zgłoszenia zawierające odpowiedzi użytkowników";

window.UrcommentsPolishURC_Text[17] = "Ukryj zgłoszenia do zamknięcia";
window.UrcommentsPolishURC_Text_tooltip[17] = "Ukrywa zgłoszenia, które wymagają zamknięcia";

window.UrcommentsPolishURC_Text[18] = "Ukryj zgłoszenia bez komentarzy";
window.UrcommentsPolishURC_Text_tooltip[18] = "Ukrywa zgłoszenia, które nie mają komentarzy";

window.UrcommentsPolishURC_Text[19] = "Ukryj zgłoszenia bez treści i komentarzy";
window.UrcommentsPolishURC_Text_tooltip[19] = "Ukrywa zgłoszenia, które nie mają opisu i komentarzy";

window.UrcommentsPolishURC_Text[20] = "Ukryj zgłoszenia z treścią, bez komentarzy";
window.UrcommentsPolishURC_Text_tooltip[20] = "Ukrywa zgłoszenia, które mają opis, ale nie zawierają komentarzy";

window.UrcommentsPolishURC_Text[21] = "Ukryj zamknięte zgłoszenia";
window.UrcommentsPolishURC_Text_tooltip[21] = "Ukrywa zamknięte zgłoszenia";

window.UrcommentsPolishURC_Text[22] = "Ukryj oznaczone UR";
window.UrcommentsPolishURC_Text_tooltip[22] = "Ukrywa zgłoszenia, które są oznaczone tagami skryptu URO [notka]";

window.UrcommentsPolishURC_Text[23] = "Dni przypomnienia: ";
window.UrcommentsPolishURC_Text_tooltip[23] = "Ilość dni od ostatniej odpowiedzi, wskazująca na konieczność wysłania przypomnienia";

window.UrcommentsPolishURC_Text[24] = "Dni zamknięcia: ";
window.UrcommentsPolishURC_Text_tooltip[23] = "Ilość dni od ostatniej odpowiedzi, wskazująca na konieczność zamknięcia zgłoszenia";

//settings tab
window.UrcommentsPolishURC_Text[25] = "Autom. wprowadzenie komentarza do zgłoszenia";
window.UrcommentsPolishURC_Text_tooltip[25] = "Autom. wprowadzenie komentarza do tych zgłoszeń, które jeszcze nie mają komentarzy";

window.UrcommentsPolishURC_Text[26] = "Autom. przypomnienie o skomentowaniu zgłoszenia";
window.UrcommentsPolishURC_Text_tooltip[26] = "Autom. wstawienie przypomnienia w zgłoszeniach, które są starsze niż wskazane w polu “Dni przypomnienia” i mają tylko jeden komentarz";

window.UrcommentsPolishURC_Text[27] = "Autom. zbliżenie na nowym zgłoszeniu";
window.UrcommentsPolishURC_Text_tooltip[27] = "Autom. zbliżenie podczas otwierania zgłoszenia bez komentarzy i podczas wysyłki przypomnień";

window.UrcommentsPolishURC_Text[28] = "Autom. wyśrodkowanie na zgłoszeniu";
window.UrcommentsPolishURC_Text_tooltip[28] = "Autom. wyśrodkowanie mapy przy obecnym poziomie powiększenia (musi być mniejsze niż 3), jeżeli zgłoszenie ma komentarze";

window.UrcommentsPolishURC_Text[29] = "Autom. zaznaczenie statusu";
window.UrcommentsPolishURC_Text_tooltip[29] = "Pomija wysłanie wiadomości do Zgłaszającego o braku odpowiedzi na pytania, a następnie w zależności od wyboru dla tego komentarza ustawia status na Otwarty, Rozwiązany, Niezidentyfikowany";

window.UrcommentsPolishURC_Text[30] = "Autom. zapis przy odpowiedzi z kategorii Rozwiązany lub Niezidentyfikowany";
window.UrcommentsPolishURC_Text_tooltip[30] = "Jeżeli jest zaznaczone Autom. zaznaczenie statusu, ta opcja spowoduje zapisanie po wybraniu komentarza i naciśnięciu przycisku Wyślij";

window.UrcommentsPolishURC_Text[31] = "Autom. zamknięcie okna z komentarzem";
window.UrcommentsPolishURC_Text_tooltip[31] = "Dla zgłoszeń, które nie wymagają zapisania, ta opcja spowoduje zamknięcie okna zgłoszenia po naciśnięciu przycisku Wyślij";

window.UrcommentsPolishURC_Text[32] = "Autom. odświeżenie mapy po skomentowaniu";
window.UrcommentsPolishURC_Text_tooltip[32] = "Odświeża mapę po wyborze komentarza i naciśnięciu przycisku Wyślij. Nie dotyczy to tych wiadomości, które wymagają zapisu, gdyż zapis automatycznie odświeża mapę. Obecnie nie jest to wymagane, ale zostało, gdyby Waze wprowadził zmiany";

window.UrcommentsPolishURC_Text[33] = "Autom. oddalenie po skomentowaniu";
window.UrcommentsPolishURC_Text_tooltip[33] = "Po kliknięciu na komentarz z listy i naciśnięciu Wyślij w oknie zgłoszenia, poziom zbliżenia mapy zostanie przywrócony do poprzedniego poziomu";

window.UrcommentsPolishURC_Text[34] = "Autom. przełączenie do listy komentarzy";
window.UrcommentsPolishURC_Text_tooltip[34] = "Autom. przełączenie do listy komentarzy po załadowaniu strony oraz otworzeniu zgłoszenia. Gdy okno zgłoszenia jest zamknięte nastąpi przełączenie do poprzedniej listy ";

window.UrcommentsPolishURC_Text[35] = "Wiadomość zamknięcia - łącze dwukrotne kliknięcie (autom. wysyłka)";
window.UrcommentsPolishURC_Text_tooltip[35] = "Dodaje dodatkowe łącze do komentarza zamknięcia. Dwukrotne kliknięcie autom. wyśle komentarz do okna zgłoszenia i naciśnie Wyślij a następnie uruchomi wszystkie inne opcje, które są włączone";

window.UrcommentsPolishURC_Text[36] = "Wszystkie komentarze - łącze dwukrotne kliknięcie (autom. wysyłka)";
window.UrcommentsPolishURC_Text_tooltip[36] = "Dodaje dodatkowe łącze do każdego komentarza z listy, które po dwukrotnym naciśnięciu automatycznie wyśle komentarz do okna zgłoszenia i naciśnie Wyślij, a następnie uruchomi wszystkie inne opcje, które są włączone";

window.UrcommentsPolishURC_Text[37] = "Lista komentarzy";
window.UrcommentsPolishURC_Text_tooltip[37] = "Pokazuje wybraną listę komentarzy. Dodatek obsługuje osobiste listy użytkownika. Jeśli chcesz dodać własną listę komentarzy do tego skryptu lub masz sugestie do komentarzy ogólnych, napisz do mnie rickzabel w aplikacji waze lub przez @gmail";

window.UrcommentsPolishURC_Text[38] = "Wyłącz przyciski Następne / Zrobione";
window.UrcommentsPolishURC_Text_tooltip[38] = "Wyłącza przyciski Następne.. oraz Zrobione znajdujące się na dole okna zgłoszenia";

window.UrcommentsPolishURC_Text[39] = "Przestań śledzić zgłoszenie po skomentowaniu";
window.UrcommentsPolishURC_Text_tooltip[39] = "Odznacza opcję śledzenia zgłoszenia po jego skomentowaniu";

window.UrcommentsPolishURC_Text[40] = "Autom. wysyłka przypomnień";
window.UrcommentsPolishURC_Text_tooltip[40] = "Automatyczna wysyłka przypomnień do zgloszeń skomentowanych przez Ciebie i widocznych na ekranie";

window.UrcommentsPolishURC_Text[41] = "Replace tag name with editor names";
window.UrcommentsPolishURC_Text_tooltip[41] = "When a UR has the logged in editors name in it replace the tag type with the editors name";

window.UrcommentsPolishURC_Text[42] = "(Dwukrotne kliknięcie)";//double click to close links
window.UrcommentsPolishURC_Text_tooltip[42] = "Kliknij dwukrotne w tym miejscu, aby wysłać automatyczny komentarz";

window.UrcommentsPolishURC_Text[43] = "Nie pokazuj nazwy w tabliczce pod zgłoszeniem";
window.UrcommentsPolishURC_Text_tooltip[43] = "Ukrywa nazwy na tabliczkach pod zgłoszeniem, gdy zawiera tag URO";

window.UrcommentsPolishURC_USER_PROMPT[0] = "URComments - Masz plik ze starszą wersją własnych komentarzy lub zawierający błędną składnię, które uniemożliwiają jego wczytanie. Brakuje: ";

window.UrcommentsPolishURC_USER_PROMPT[1] = "URComments - Na Twojej liście własnych komentarzy brakuje następujących pozycji: ";

window.UrcommentsPolishURC_USER_PROMPT[2] = "Nie mogę znaleźć listy. Listę oraz instrukcję można znaleźć pod adresem https://wiki.waze.com/wiki/User:Rickzabel/UrComments/";

window.UrcommentsPolishURC_USER_PROMPT[3] = "URComments - Nie możesz ustawić Dni zamknięcia na zero";

window.UrcommentsPolishURC_USER_PROMPT[4] = "URComments - aby używać linków z dwukrotnym kliknięciem musisz mieć włączoną funkcję automatycznego ustawiania statusu zgłoszeń";

window.UrcommentsPolishURC_USER_PROMPT[5] = "Kończę pracę FilterURs2 ponieważ filtrowanie, liczenie i automatyczne przypomnienia są wyłączone";

window.UrcommentsPolishURC_USER_PROMPT[6] = "URComments: Za długo wczytuję zgłoszenia, próbuję ponownie."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPolishURC_USER_PROMPT[7] = "URComments: Dodaję przypomnienie do zgłoszenia: "; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPolishURC_USER_PROMPT[8] = "Filtrowanie zgłoszeń przez URComment wyłączone - aktywne są filtry URO"; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPolishURC_USER_PROMPT[9] = "UrComments wykrył, że masz niezapisane zmiany!\n\nZ włączoną funkcją Autom. zapisu i z niezapisanymi zmianami nie możesz wysyłać komentarzy, które wymagają od skryptu zapisu. Zapisz swoje zmiany i ponownie kliknij komentarz, który chcesz wysłać.";

window.UrcommentsPolishURC_USER_PROMPT[10] = "URComments: Nie mogę znaleźć okna komentarza! Ten skrypt wymaga do działania otwartego okna zgłoszenia."; //this message is shown across the top of the map in a orange box, length must be kept short

window.UrcommentsPolishURC_USER_PROMPT[11] = "URComments wyśle przypomnienia do zgłoszeń widocznych na ekranie, zgodnie z ustawieniem Dni przypomnienia. UWAGA: używając tą funkcję nie należy zostawiać otwartych zgłoszeń, chyba że jest pytanie, które wymaga odpowiedzi od zgłaszającego, gdyż skrypt wyśle Przypomnienia do otwartych zgłoszeń. "; //conformation message/ question


//The comment array should follow the following format,
// "Title",     * is what will show up in the URComment tab
// "comment",   * is the comment that will be sent to the user currently 
// "URStatus"   * this is action to take when the option "Auto Click Open, Solved, Not Identified" is on. after clicking send it will click one of those choices. usage is. "Open", or "Solved",or "NotIdentified",
// to have a blank line in between comments on the list add the following without the comment marks // there is an example below after "Clear Comments"
// "<br>",
// "",
// "",

//there is an example just after the "Clear comments" message

//if you are using quotes in your titles or comments, they must be properly escaped. Example "This is \"quoted\" in your comment",
//if you wish to have text in your comment starting on the next line, use \r (backslash r). For example: "Here is the first text\rThis text starts on a new line",
//if you wish to have blank lines in your message, use \r\r. For example: "This will be paragraph 1\r\rAnd here is paragraph 2",


//Polish list

window.UrcommentsPolishArray2 = [
"Stare zgłoszenie",//Old URs
"Przepraszamy za późną odpowiedź.\r\rCzy możemy prosić o przesłanie szczegółów problemu, jeżeli nadal go pamiętasz?\r\rDziękujemy!",
"Open",

"Niejasne zgłoszenie",//Unclear URs
"Dziękujemy za zgłoszenie!\r\rNiestety aplikacja Waze nie przesłała nam wystarczającej ilości informacji, aby rozwiązać Twój problem. Czy możesz spróbować dokładniej go opisać?\r\rDziękujemy!",
"Open",

"Potrzebny opis problemu",//Include Users Description
"Dziękujemy za zgłoszenie!\r\rNiestety nie do końca rozumiemy w czym tkwi problem przesłany w zgłoszeniu: \"$URD\".\r\rCo możemy poprawić?",
"Open",

"Użytkownik pojechał trasą wyznaczoną przez Waze",
"Dziękujemy za zgłoszenie!\r\rWygląda na to, że pojechałeś/pojechałaś trasą wyznaczoną przez Waze. Możesz powiedzieć co poszło nie tak?\r\rDziękujemy!",
"Open",

"Przypomnienie", //Reminder message - do not change the text behind // (rz, mo)
"To tylko przypomnienie: Nadal nie otrzymaliśmy odpowiedzi na Twoje zgłoszenie. Jeżeli wkrótce nie otrzymamy od Ciebie informacji uznamy, że wszystko jest w porządku i możemy je zamknąć.\r\rZ góry dziękujemy za pomoc :)",
"Open",

"Zamknij - brak odpowiedzi", //Close without reply - do not change the text behind // (rz, mo)
"Problem nie był dla nas jasny i do tej pory nie otrzymaliśmy odpowiedzi, w związku z czym zamykamy zgłoszenie. Jeżeli problem, który miał być zgłoszony wystąpi ponownie, będziemy wdzięczni za wysłanie zgłoszenia.\r\rDziękujemy!",
"NotIdentified",

"Rozwiązane",// Solved
"Twoje zgłoszenie pomogło nam poprawić błąd mapy. Zmiany powinny być widoczne w aplikacji w ciągu kilku dni. Status aktualizacji map można sprawdzić pod adresem https://status.waze.com (serwer INTL).\r\rDziękujemy za pomoc!",
"Solved",


"Dodano ograniczenie prędkości",
"Dodaliśmy ograniczenie prędkości zgodnie z przesłanym zgłoszeniem.  Zmiany powinny być widoczne w aplikacji w ciągu kilku dni. Status aktualizacji map można sprawdzić pod adresem https://status.waze.com (serwer INTL).\r\rDziękujemy za pomoc w udoskonalaniu mapy!", 
"Solved",

"Clear comments",
"",
"Open",

"<br>",
"",
"",

"Pozostałe komentarze",
"",
"",

"Niedozwolony zakręt (nieprawidłowe skrzyżowanie)",
"Dziękujemy za zgłoszenie! Niestety aplikacja Waze nie przesłała nam wystarczającej ilości informacji nt. manewru. Jeśli to możliwe, najbardziej pomocne będzie podanie nazw ulic oraz kierunek niedozwolonego manewru.\r\rDziękujemy!",
"Open",

"Dodaj nową drogę",
"Dziękujemy za zgłoszenie! Drogę można dodać również z poziomu aplikacji w menu Zgłoszenia > Błąd mapy > Buduj drogę. W trakcie jazdy zostanie zarejestrowany ślad widoczny na mapie. Po zakończeniu należy nacisnąć ikonę walca > Zakończ budowę.\r\rDodatkowe informacje o nowej drodze (np. jej nazwa, typ, kierunkowość, prędkość) możesz wysłać w osobnym zgłoszeniu błędu mapy.\r\rDziękujemy!",
"Open",

"Dodaj fotoradar",
"Dziękujemy za zgłoszenie! W celu zgłoszenia urządzenia wybierz Zgłoszenia > Fotoradar i wybierz jego typ: Prędkość, Czerwone światło lub Atrapa. Po otrzymaniu zgłoszenia nasi edytorzy dodadzą go do mapy.\r\rProsimy pamiętać, że w ten sposób zgłasza się wyłącznie urządzenia stacjonarne a nie kontrole.\r\rDziękujemy!",
"NotIdentified",

"Numer domu",
"Zarejestrowaliśmy numer domu w Waze i myślimy, że to powinno rozwiązać problem. Zmiany są dostępne w aplikacji zazwyczaj w ciągu kilku dni. Jeśli ta lokalizacja jest w zapisanych wynikach wyszukiwania lub w Ulubionych, prosimy usuń ją i wprowadź cel ponownie. Będziemy wdzięczni za ponowienie zgłoszenia, jeśli problem będzie występował dalej.\r\rDziękujemy!",
"Solved",

"Brakujące Miejsce - dodane",
"Dziękujemy za zgłoszenie!\r\rDodaliśmy miejsce zgodnie ze wskazaniem.\r\rPo znalezieniu brakującego miejsca, zamiast wysyłać zgłoszenie, można je od razu dodać z poziomu aplikacji naciskając Zgłoszenia > Miejsca. Dodając zdjęcie upewnij się, że nie zawiera ono informacji prywatnych (nr rejestracyjny, twarze osób postronnych) oraz jest dobrej jakości.\r\rDziękujemy!",
"Solved",

"Brakujące Miejsce - nienaniesione",
"Dziękujemy za zgłoszenie!\r\rNiestety na podstawie przesłanych informacji nie byliśmy w stanie dodać miejsca. Prosimy pamiętać, że najłatwiej dodać miejsce z poziomu aplikacji naciskając Zgłoszenia > Miejsca. Dodając zdjęcie upewnij się, że nie zawiera ono informacji prywatnych (nr rejestracyjny, twarze osób postronnych) oraz jest dobrej jakości.\r\rZ góry dziękujemy!",
"NotIdentified",

"Nieznany adres",
"Dziękujemy za zgłoszenie!\r\rWaze nie podaje nam Twojego miejsca startu i celu. Jeśli chcesz, możesz nam je przesłać, w celu rozwiązania problemu.\r\rDziękujemy!",
"Open",

"Nieprawidłowe wyniki wyszukiwania",
"Dziękujemy za zgłoszenie!\r\rWyniki wyszukiwania w Waze pochodzą z różnych źródeł i nie zawsze mogą być poprawne. Możesz dodać prawidłową lokalizację do bazy Waze naciskając menu Zgłoszenia > Miejsca. Dodając zdjęcie upewnij się, że nie zawiera ono informacji prywatnych (nr rejestracyjny, twarze osób postronnych) oraz jest dobrej jakości.",
 "Open",

"Aktualizacja wyników wyszukiwania",
"Aby otrzymać aktualne wyniki wyszukiwania, usuń lokalizację z Twojej historii nawigacji i/lub Ulubionych i wyszukaj lokalizację ponownie po aktualizacji map. Upewnij się, że wybierzesz rezultat wyszukiwania z bazy Waze. Zostawimy to zgłoszenie otwarte jeszcze przez kilka dni, w razie gdybyś potrzebował dodatkowej pomocy.\r\rDziękujemy!",
"Open",

"Wyczyść cache TTS",
"Prawdopodobnie problemem jest pamięć podręczna funkcji Text-to-Speech. W polu wyszukiwania wpisz cc@tts i naciśnij Wyszukaj. Otrzymasz wiadomość, że plik TTS został wyczyszczony. Spróbuj wyznaczyć następną trasę mając połączenie z WiFi. Dzięki temu wymowa nazw ulic będzie mogła się poprawnie i szybko ściągnąć.\r\rDziękujemy!",
 "Open",

"Odświeżenie",
"Prosimy spróbuj odświeżyć mapę. Wejdź do Menu głównego, naciśnij kółko zębate i dalej Widok i mapa > Odśwież mapę mojego regionu. Jeśli to nie pomoże, możesz wyczyścić cache aplikacji w menedżerze aplikacji (dla Android). Ostatecznym rozwiązaniem problemu jest reset aplikacji przez wpisanie w polu wyszukiwania ##@resetapp i kliknięcie Wyszukaj.",
"Open",

"Błąd aplikacji",
 "Niestety wygląda to na błąd aplikacji, na który edytorzy nic nie poradzą. Prosimy o zgłoszenie go przez tą stronę https://support.google.com/waze/answer/6276841?hl=en",
"NotIdentified",

"Najdłuższa trasa",
"Możliwość wyznaczania trasy przez Waze jest ograniczona do ok. 1.000 mil/1.500 km. Jadąc dalej należy podzielić trasę na etapy i wybrać cel znajdujący się poniżej tych limitów, jako cel pośredni.",
"NotIdentified",

"Prawidłowa trasa",
"Dziękujemy za zgłoszenie!\r\rPrzyjrzeliśmy się zgłoszeniu i nie zidentyfikowaliśmy żadnych błędów mapy. Wygląda na to, że Waze wyznaczył trasę prawidłowo. Spróbuj pojechać kilka razy wyznaczoną trasą, być może faktycznie będzie szybsza. Jeśli nie, Waze nauczy się tego, że jest ona wolniejsza a szybsza trasa stanie się trasą domyślną.",
"NotIdentified",

"Objazdy / Dziwnie wyznaczona trasa",
"Dziękujemy za Twoje zgłoszenie!\r\rNie znaleźliśmy niczego na mapie, co mogło by wyjaśnić dlaczego Waze wyznaczył trasę w taki sposób. Waze wyznacza czasami skomplikowane objazdy, żeby zaoszczędzić kilka sekund. Przykro nam, ale edytorzy mapy niestety nie będą w tej sytuacji Tobie pomóc.",
"NotIdentified",

"Złe dane GPS",
"Dziękujemy za zgłoszenie!\r\rPrawdopodobnie Twoje urządzenie ma problemy z danymi GPS. Sygnał GPS nie przenika przez wysokie budynki. Prosimy upewnij się, że urządzenie widzi niebo. Możesz sprawdzić jakość sygnału dowolną aplikacją GPS.",
"NotIdentified",

"Zamknięcie drogi lub korek",
"Dziękujemy za zgłoszenie!\r\rJeżeli napotkasz korek, zgłoś go przez funkcję Zgłoszenia > Korek. W przypadku całkowitej blokady drogi możesz użyć funkcji Zgłoszenia > Zamknięcia. Waze poprowadzi Ciebie oraz innych z pominięciem zamkniętego odcinka. \rJeżeli jest to zamknięcie długoterminowe, napisz nam: Jak długo droga jest/będzie (szacunkowo) zamknięta? Skąd dokąd droga jest zamknięta?\r\rZ góry dziękujemy za pomoc!",
 "Open",
			
"<br>",
"",
"",


//Default URs 6 through 22 are the different types of UR that a user can submit from the app and the Live Map. Do not change them, thanks!
"Domyślne odpowiedzi do zgłoszeń",
"",
"",

/*
"Nieprawidłowy skręt", //6
"Dziękujemy za zgłoszenie!\r\rCzy możesz nam napisać co było nie tak? Czy jest to sytuacja tymczasowa (np. z uwagi na roboty drogowe) czy też stała zmiana?",
"Open",

"Błędna trasa", //8
"Dziękujemy za zgłoszenie!\r\rAplikacja nie przesłała nam wystarczającej ilości informacji, żeby rozwiązać zgłoszony problem. Czy możesz nam opisać na czym polegał problem z wyznaczoną przez Waze trasą? Czy możesz nam napisać jaki cel podróży został wprowadzony do Waze?",
"Open",
*/

"Ogólny błąd", //10
"Dziękujemy za zgłoszenie!\r\rNiestety nie otrzymaliśmy wystarczającej ilości informacji, żeby rozwiązać zgłoszony problem. Czy możesz napisać nam coś więcej o napotkanym błędzie?",
"Open",

"Zakaz skrętu", //11
"Dziękujemy za zgłoszenie!\r\rCzy możesz napisać nam dlaczego skręt nie jest dozwolony? Czy jest to tymczasowa (np. z uwagi na roboty drogowe) czy stała zmiana?",
"Open",

"Nieprawidłowe skrzyżowanie", //12
"Dziękujemy za zgłoszenie!\r\rAplikacja nie przesłała nam wystarczającej ilości informacji, żeby rozwiązać zgłoszony problem. Czy możesz opisać nam co jest nie tak ze skrzyżowaniem?",
 "Open",

"Brak mostu lub przejazdu", //13
"Dziękujemy za zgłoszenie!\r\rCzy możesz nam napisać, którego mostu lub przejazdu brakuje? Gdy jedziesz z dużą prędkością, w celu zachowania czytelności mapy Waze nie zawsze pokazują szczegóły otoczenia.",
"Open",

"Złe wskazówki jazdy", //14
"Dziękujemy za zgłoszenie!\r\rAplikacja nie przesłała nam wystarczającej ilości informacji, żeby rozwiązać zgłoszony problem. Czy możesz nam opisać na czym polegał problem z wyznaczoną przez Waze trasą i/lub wskazać jaki cel podróży został wprowadzony?",
"Open",

"Brak zjazdu", //15
"Dziękujemy za zgłoszenie!\r\rAplikacja nie przesłała nam wystarczającej ilości informacji, żeby rozwiązać zgłoszony problem. Czy możesz napisać nam coś więcej o brakującym zjeździe?",
"Open",

"Brak drogi", //16
"Dziękujemy za zgłoszenie!\r\rKtórej drogi Twoim zdaniem brakuje? Drogę można dodać również z poziomu aplikacji w menu Zgłoszenia > Błąd mapy > Buduj drogę. W trakcie jazdy zostanie zarejestrowany ślad widoczny na mapie. Po zakończeniu należy nacisnąć ikonę walca > Zakończ budowę.\r\rDodatkowe informacje o drodze (np. jej nazwa, typ, kierunkowość, prędkość) możesz wysłać w osobnym zgłoszeniu błędu mapy.",
"Open",

"Błędny adres", //7
"Dziękujemy za zgłoszenie!\r\rAplikacja nie przesłała nam wystarczającej ilości informacji, żeby rozwiązać zgłoszony problem. Czy możesz nam napisać jaki cel podróży został wprowadzony do Waze? Jaki masz problem z tym adresem?",
"Open",

"Brakujący punkt orientacyjny", //18
"Dziękujemy za zgłoszenie.\r\rZawsze, gdy znajdziesz miejsce, którego nie ma w aplikacji, możesz je dodać w sekcji Zgłoszenia > Miejsce. Dodając zdjęcie pamiętaj, że nie może zawierać ono informacji prywatnych (nr rejestracyjny, twarze osób postronnych) oraz jest dobrej jakości.",
"Open",

"Brak ronda", //9
"Dziękujemy za zgłoszenie!\r\rCzy możesz napisać jak najwięcej informacji o rondzie, którego Twoim zdaniem brakuje?",
"Open",

"Ograniczenie prędkości", //23 Speed Limit
"Otrzymaliśmy zgłoszenie nieprawidłowego ograniczenia prędkości. Czy możemy prosić o wskazanie między którymi skrzyżowaniami ono obowiązuje? Istotna jest również informacja, czy ograniczenie jest tymczasowe (np. z uwagi na roboty drogowe) czy stałe?\r\rZ góry dziękujemy za pomoc!",
"Open"


//End of Default URs

];
//end of the Polish list`