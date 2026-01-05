// ==UserScript==
// based on https://greasyfork.org/en/scripts/13134-loteria-paragonowa-asystent/code
// @name        Loteria paragonowa - asystent
// @namespace   pl.loteria.paragonowa.asystent
// @include     https://loteriaparagonowa.gov.pl/
// @version     1.02
// @license			GPLv3
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @description Userscript to assist on https://loteriaparagonowa.gov.pl/. Lottery for Polish citizens.
// @description:pl Asystent do loterii paragonowej https://loteriaparagonowa.gov.pl/. Pomaga przy dodawaniu nowych paragonów.
// @downloadURL https://update.greasyfork.org/scripts/14368/Loteria%20paragonowa%20-%20asystent.user.js
// @updateURL https://update.greasyfork.org/scripts/14368/Loteria%20paragonowa%20-%20asystent.meta.js
// ==/UserScript==

// UWAGA: Instalując zgadzasz się na automatyczne zaznaczanie pól 
// _Sprawdziłem poprawność uzupełnionych danych_ oraz 
// _Akceptuję regulamin i wyrażam zgodę na przetwarzanie moich danych_ w formularzu
// dodawania paragonu.

/*  This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

		Niniejszy program jest wolnym oprogramowaniem – możesz go rozpowszechniać dalej
		i/lub modyfikować na warunkach Powszechnej Licencji Publicznej GNU wydanej przez
		Fundację Wolnego Oprogramowania, według wersji 3 tej Licencji lub dowolnej z
		późniejszych wersji.

		Niniejszy program rozpowszechniany jest z nadzieją, iż będzie on użyteczny –
		jednak BEZ ŻADNEJ GWARANCJI, nawet domyślnej gwarancji PRZYDATNOŚCI HANDLOWEJ
		albo PRZYDATNOŚCI DO OKREŚLONYCH ZASTOSOWAŃ. Bliższe informacje na ten temat
		można uzyskać z Powszechnej Licencji Publicznej GNU.

		Kopia Powszechnej Licencji Publicznej GNU powinna zostać ci dostarczona razem z
		tym programem. Jeżeli nie została dostarczona, odwiedź <http://www.gnu.org/licenses/>.
		*/

var mySound = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
storeNip = function(){
    var nrKkasy1=document.getElementById('nr_kasy_1').value;
    var nip=[
        document.getElementById('nip_1').value,
        document.getElementById('nip_2').value,
        document.getElementById('nip_3').value,
        document.getElementById('nip_4').value,
        document.getElementById('nip_5').value,
        document.getElementById('nip_6').value,
        document.getElementById('nip_7').value,
        document.getElementById('nip_8').value,
        document.getElementById('nip_9').value,
        document.getElementById('nip_10').value,
    ];
    localStorage.setItem('asystent_' + nrKkasy1.toUpperCase() , nip.join('-'));
    console.log(nrKkasy1);
    console.log(nip);
    return true;
}
restoreNip=function(){
    var nrKasy = document.getElementById('nr_kasy_1').value.toUpperCase()
    document.getElementById('nr_kasy_1').value=nrKasy;
    var nip=localStorage.getItem('asystent_' + nrKasy)
    if(nip){
        nip = nip.split('-');
        for(var i=1;i<=10;i++){
            document.getElementById('nip_'+i).value=nip[i-1];
            document.getElementById('dzien').focus();
        } 
        mySound.play();
        return true;
    }else return false;
}

var script = document.createElement("script");
script.innerHTML = "function turnOnCheckbox(id){ \n" +
    "if (document.getElementById(id).checked === true); \n" +
    "else if (document.getElementById(id).checked === false)  document.getElementById(id).click(); \n" +
    "}";
document.head.appendChild(script);


    window.setInterval(function () {
        if(document.getElementsByClassName('zglos').length){
    document.getElementsByClassName('zglos')[0].click();
}
    }, 500);

document.getElementById('nr_kasy_1').focus();
document.getElementById('nr_kasy_1').setAttribute("onkeyup", "restoreNip();");
document.getElementById('nip_10').setAttribute("onkeyup", "document.getElementById('dzien').focus();");
document.getElementById('dzien').setAttribute("onkeyup", "if (this.value.length > 1) document.getElementById(\"nr_wydruku\").focus();");
document.getElementById('kwota_zl').setAttribute("onkeyup", "storeNip();");
document.getElementById('kwota_gr').setAttribute("onkeyup", "if (this.value.length > 1) turnOnCheckbox(\'sprawdzone\');");

document.getElementById("zgoda_dane").setAttribute("checked", true);
document.getElementById("sprawdzone").setAttribute("checked", true);

document.getElementById("rok").value = new Date().getFullYear();
document.getElementById("miesiac").value = ("0" + (new Date().getMonth() + 1)).slice(-2);

var captcha = document.getElementById('captcha-operation').innerHTML;
document.getElementById('captcha-input').value = eval(captcha);

document.getElementById('registration-form').setAttribute("onsubmit", "storeNip();");
document.getElementById('email_2').value=document.getElementById('email').value;
document.getElementById('captcha-operation').innerHTML;
