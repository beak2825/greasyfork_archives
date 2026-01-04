// ==UserScript==
// @name        	Tokopedia - Cetak Hemat
// @namespace   	www.dkijaya.com
// @version       2019.05.31
// @description   Cetak Slip Hemat Kertas dan Tinta utk 2 Order Konfirmasi
// @author        Capjago
// @include     https://www.tokopedia.com/print-address*
// @include			https://www.tokopedia.com/logistic/print-address*
// @downloadURL https://update.greasyfork.org/scripts/373372/Tokopedia%20-%20Cetak%20Hemat.user.js
// @updateURL https://update.greasyfork.org/scripts/373372/Tokopedia%20-%20Cetak%20Hemat.meta.js
// ==/UserScript==
var sheet = document.createElement('style')
sheet.innerHTML = 'body { margin: 0 0;} div.address_container_left { width: auto; float: left; } ';
document.body.appendChild(sheet);

var head2 = document.getElementsByTagName('tr');
var head3 = document.getElementsByTagName('h5');
var head5 = document.getElementsByTagName('div');
var head4 = document.getElementsByTagName('img');
head3[0].style.display = 'none';
var Text1 = '';
var i=0;
var ii=0;
var k=0;

	var namatag = ['header_wrapper ','textbox_wrapper'];
  for (var a = 0; a < namatag.length; a++)
  {
    var divsToHide = document.getElementsByClassName(namatag[a]);
    for (var i = 0; i < divsToHide.length; i++)	
    { 
      divsToHide[i].style.display = 'none'; 
    }
  }    
var label1 = document.getElementsByTagName('td');
for (k = 0; k < label1.length; k++)
{
	if ( label1[k].textContent == 'Label Pengiriman'){ label1[k].parentNode.style.display = 'none'; }
}

for (i = 0; i < head5.length; i++) {
  if (CekPrefix(head5[i].textContent, 'JNE') || CekPrefix(head5[i].textContent, 'Wahana') ) {
     head5[i+4].style.display = 'none';
     head5[i+5].style.display = 'none';
     head5[i+6].style.display = 'none';
     head5[i+7].style.display = 'none';
     head5[i+8].style.display = 'none';
     head5[i+9].style.display = 'none';
     head5[i+10].style.display = 'none';
     head5[i+11].style.display = 'none';
  }
  /*
  if (CekPrefix(head5[i].textContent, 'Wahana')) {
     head5[i+4].style.display = 'none';
     head5[i+5].style.display = 'none';
     head5[i+6].style.display = 'none';
     head5[i+7].style.display = 'none';
     head5[i+8].style.display = 'none';
     head5[i+9].style.display = 'none';
     head5[i+10].style.display = 'none';
     head5[i+11].style.display = 'none';
  } */
  if (CekPrefix(head5[i].textContent, 'Go-Send')) { head5[i+12].style.display = 'none'; }

  if (CekPrefix(head5[i].textContent, ' Paket ini')){ head5[i].style.display = 'none'; }

  if ( head5[i].textContent == 'Kode Booking Ini Bukan No Resi Pengiriman') {
     head5[i-1].style.display = 'none';
     head5[i].style.display = 'none';
     head5[i+1].style.display = 'none';
  }

  if (CekPrefix(head5[i].textContent, 'Kepada')) {
     head5[i].style.fontSize = "14px";
     head5[i+1].style.fontSize = "14px";
     head5[i+2].style.fontWeight= "bold";
  }
}

for (ii = 0; ii < head4.length; ii++)
{
    if (head4[ii].id)
    {
        // Show Barcode Kode Booking tapi kecil aja.
        head4[ii].style.height = '25px';
      //head4[ii].style.height = '100%';
    } else { head4[ii].style.display = 'none';}
}

function CekPrefix(str, prefix) {
  //return str.indexOf(prefix) === 0;
  return str.startsWith(prefix);
}