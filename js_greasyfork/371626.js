// ==UserScript==
// @name         Tutorial Cara Cetak Sekaligus Kertas A6 Thermal
// @author       rendy1287
// @namespace    https://rendy1287.github.io
// @version      0.0.40
// @description  Untuk mencetak sekaligus buat kertas ukuran A6 untuk Tokopedia, Bukalapak, Shopee, dan Akulaku
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js
// @match        https://www.tokopedia.com/logistic/print-address*
// @match        https://www.tokopedia.com/logistic/v2/print-address*
// @match        https://www.tokopedia.com/print-address.pl*
// @match        https://seller.shopee.co.id/api/v2/orders/waybill*
// @match        https://www.bukalapak.com/payment/transactions/print_preview*
// @match        https://seller.bukalapak.com/transactions/print-preview*
// @match        https://vendor.akulaku.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/371626/Tutorial%20Cara%20Cetak%20Sekaligus%20Kertas%20A6%20Thermal.user.js
// @updateURL https://update.greasyfork.org/scripts/371626/Tutorial%20Cara%20Cetak%20Sekaligus%20Kertas%20A6%20Thermal.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var backgroundImage = '';
  var logo = '';

  if (window.location.href.indexOf("www.tokopedia.com/logistic/print-address") > -1)
  {
    cetakTokopedia();
  }
  if (window.location.href.indexOf("www.tokopedia.com/logistic/v2/print-address") > -1)
  {
    cetakTokopediaV2();
  }
  else if (window.location.href.indexOf("shopee") > -1)
  {
    cetakShopee();
  }
  else if (window.location.href.indexOf("bukalapak") > -1)
  {
    cetakBukalapak();
  }
  else if (window.location.href.indexOf("akulaku") > -1)
  {
    cetakAkulaku();
  }

})();

function cetakTokopedia()
{
  var styleCSS = `<style>
  @page
  {
    size: 105mm 148mm portrait;
    margin: 3mm 2mm 2mm 3mm;
  }
  @media print
  {
    div.address_container_left, div.address_container_right, div.address
    {
      float: none !important;
      padding-left: 0px;
      width: 540px !important;
    }
    div.address
    {
      page-break-after: always;
    }
    h5
    {
      display: none;
    }
    div.address_container_left > div > table, div.address_container_right > div > table
    {
      width: 540px !important;
    }
    div.additional_info_wrapper
    {
      margin-top: 7px;
      margin-bottom: -10px;
    }
    div.header_wrapper
    {
      padding: 10px;
      margin-bottom: 5px;
    }
  }
  div.text-content
  {
    word-break: break-word;
  }
  img[width="1"][height="1"]
  {
    display: none;
  }
  </style>`;

  $('body').append(styleCSS);
  $('div.address > table > tbody > tr > td').each(function(x, r)
  {
    $(r).find('table:contains("Kepada") > tbody > tr > td > div').css('font-size', '17px');
    //$(r).find('table:contains("Kepada") > tbody > tr > th:first').append('<br><div class="qrcode">' + qr.createImgTag() + '</div>');
  });

  $("table div:contains('bayar asuransi')").remove();
  $("div.page-break").remove();
  $("td div:contains('Asuransi')").next().html('+ Rp 0').css('text-decoration', 'none');
  $("td div:contains('Ongkir')").next().css('text-decoration', 'none');
  $("div.address_container_right").each(function()
  {
    if ($(this).children().length == 0)
    {
      $(this).remove();
    }
  });
  $("div.address").filter(function()
  {
    return $(this).text().trim() == "";
  }).remove();
  $("div.address_container_right").filter(function()
  {
    return $(this).text().trim() == "";
  }).remove();
}

function cetakTokopediaV2()
{
  var styleCSS = `<style>
  @page
  {
    size: 105mm 148mm portrait;
    margin: 3mm 2mm 2mm 3mm;
  }
  @media print
  {
    div.address_container_left, div.address_container_right, div.address
    {
      float: none !important;
      padding-left: 0px;
      width: 540px !important;
    }
    div.address
    {
      page-break-after: always;
    }
    h5
    {
      display: none;
    }
    div.address_container_left > div > table, div.address_container_right > div > table
    {
      width: 550px !important;
    }
    div.additional_info_wrapper
    {
      margin-top: 7px;
      margin-bottom: -10px;
    }
    div.header_wrapper
    {
      padding: 10px;
      margin-bottom: 5px;
    }
  }
  div.text-content
  {
    word-break: break-word;
  }
  table.insurance
  {
    display: none;
  }
  table.shipment-address
  {
    font-size: 17px;
  }
  </style>`;

  $('body').append(styleCSS);
  $('div.address > table > tbody > tr > td').each(function(x, r)
  {
    $(r).find('table:contains("Kepada") > tbody > tr > td > div').css('font-size', '17px');
  });

  $("table div:contains('bayar asuransi')").remove();
  $("div.page-break").remove();
  $("td div:contains('Asuransi')").next().html('+ Rp 0').css('text-decoration', 'none');
  $("td div:contains('Ongkir')").next().css('text-decoration', 'none');
  $("div.address_container_right").each(function()
  {
    if ($(this).children().length == 0)
    {
      $(this).remove();
    }
  });
  $("div.address").filter(function()
  {
    return $(this).text().trim() == "";
  }).remove();
  $("div.address_container_right").filter(function()
  {
    return $(this).text().trim() == "";
  }).remove();
}

function cetakShopee()
{
  var styleCSS = `<style>
  @page
  {
    margin: 4mm 1mm 2mm 4mm;
  }
  @media print
  {
    .page
    {
      float: none !important;
      page-break-after: always;
      border-right: none !important;
      width: 48%;
      display: block !important;
    }
    div.page > div.job-shipping-label
    {
      width: 545px;
    }
    div.page > div.jne_reg_shipping_label
    {
      width: 555px;
    }
    body.container
    {
      margin: 0;
    }
    div.page.left
    {
      margin-left: -1px;
      clear: both;
    }
    div.page.left
    {
      padding: 0 0.55in 0 0;
      border-right: none;
    }
    div.page.right
    {
      padding: 0 0.55in 0 0;
      border-left: none;
    }
    table.instruction.no-print + div.left
    {
      padding: 0 15px 0 0;
    }
    table.instruction.no-print + div.left + div.right
    {
      padding: 0 15px 0 0;
    }
    div.cut-line.shipping-label, div.cut-line
    {
      width: 100%;
    }
  }
  </style>`;

  $('style:last').html($('style:last').html().replace('A4 landscape', 'auto'));
  $('style:first').html($('style:first').html().replace('A4 landscape', 'auto'));
  $('style:nth-of-type(2)').html($('style:nth-of-type(2)').html().replace('A4 landscape', 'auto'));
  $('style:first').html($('style:first').html().replace('size: landscape; margin: 0.1in 0.2in;', 'size: auto;'));
  $('head').append(styleCSS);
  $('div.page-breaker').remove();
  $('div:last').remove();
  $('img.scissors-vertical').remove();
  $('div.scissors_icon').remove();
  $(".page.right").each(function()
  {
    if ($("div.job-shipping-label", this).length > 0)
    {
      $("style:last").html($('style:last').html().replace(/(padding: 0 0.55in 0 0;)/g, ""));
    }
  });
  //$("div.page:has(div.job-shipping-label)").css("width", "550px");
  //$("div.page:has(div.jne_reg_shipping_label)").css("width", "565px");
  $("div.container:has(div.right) > div.page:has(div.job-shipping-label)").css("width", "530px");
}

function cetakBukalapak()
{
  var styleCSS = `<style>
  @media print
  {
    div.trx-slip, div.trx-slip-container
    {
      page-break-after: always;
    }
  }
    div.trx-slip, div.trx-slip-container-row
    {
      float: none !important;
      clear: both !important;
      width: 100% !important;
      margin-top: 20px;
    }
    div.trx-slip, div.row, .c-trx-slip--font-small, .c-trx-slip--font-large
    {
      font-size: 13pt !important;
    }
    ul, ol
    {
      list-style-type: none;
    }
    div.brand-logo > img
    {
      height: 39px !important;
    }
    div.row-item > img
    {
      height: 64px !important;
    }
  </style>`;

  $('body').append(styleCSS);
}

let label = `
<div class="label_alamat">
  <div class="label">
    <div class="header">
      <div class="logo">
        <img src="{{logotoko}}" width="180" height="24">
      </div>
      <div class="label_pengiriman">
        Label Pengiriman
      </div>
    </div>
    <div class="barcode"></div>
    <div class="job" style="display: none;">{{kode_booking}}</div>
    <div class="ekspedisi">
      <div class="logokurir">
        <img src="{{logokurir}}" width="80%">
      </div>
      <div class="kurir">{{ekspedisi}}</div>
      <div class="orderno">Order No.<br>{{orderno}}</div>
      <div class="invoice">Invoice Number<br>{{invoice}}</div>
    </div>
    <div class="adminongkir">
      <div class="admin">Administrasi<br><span class="harga_admin">{{administrasi}}</span></div>
      <div class="asuransi">Asuransi<br><span class="harga_asuransi">{{asuransi}}</span></div>
      <div class="ongkir">SubTotal<br><span class="harga_ongkir">{{ongkir}}</span></div>
      <div class="berat">Tanggal<br><span class="total_berat">{{berat}}</span></div>
    </div>
    <div class="penerima">
      <div class="kepada">Kepada</div>
      <div class="penerima2">
        <div class="nama_penerima"><b>{{nama_penerima}}</b> - {{telepon_penerima}}</div>
        <div class="alamat_penerima"><b>Alamat</b><br>{{alamat_penerima}}</div>
      </div>
    </div>
    <div class="pengirim">
      <div class="dari">Dari</div>
      <div class="pengirim2">
        <div class="nama_pengirim"><b>{{nama_pengirim}}</b> - {{telepon_pengirim}}</div>
        <div class="alamat_pengirim">{{alamat_pengirim}}</div>
      </div>
    </div>
    <div class="gunting">
      <div class="icon_gunting">
        <img src="https://ecs7.tokopedia.net/img/kurir/icon-cut.png" width="14">
      </div>
    </div>
    {{foreach_item}}
    <div class="clear"></div>
  </div>
</div>
`;

// foreach_item menggunakan template ini
let item = `
<div class="item">
  <div class="jumlah">{{jumlah_produk}}</div>
  <div class="produk">
    <div class="nama_produk">{{nama_produk}}{{sku}}</div>
    <div class="keterangan">Keterangan: {{keterangan_produk}}</div>
  </div>
</div>
`;

let css = `
<style type="text/css">
  body
  {
    width: 1050px;
    font-size: 13px;
    font-family: sans-serif;
  }
  .print_area
  {
    width: 100%;
  }
  .kiri
  {
    float: left;
    width: 50%;
  }
  .kanan
  {
    float: left;
    margin-left: 5px;
    width: 49%;
  }
  .label_alamat
  {
    border: 1px solid black;
    margin-top: 5px;
    width: 100%;
  }
  .label
  {
    padding: 10px;
    padding-bottom: 0px;
  }
  .header
  {
    border-bottom: 1px dashed #bdbcbc;
    padding-bottom: 5px;
    height: 27px;
  }
  .logo
  {
    width: 50%;
    float: left;
  }
  .label_pengiriman
  {
    width: 50%;
    text-align: right;
    float: right;
    font-weight: bold;
    font-size: 18px;
    position: relative;
    top: 2px;
  }
  .print
  {
    margin-bottom: 3px;
    font-weight: bold;
    font-family: sans-serif;
    font-size: 15px;
  }
  div.print img
  {
    position: relative;
    top: 2px;
  }
  .print a
  {
    color: green;
    text-decoration: none;
    cursor: pointer;
  }
  @media print
  {
    @page
    {
      size: auto;
      margin: 5mm 5mm 5mm 5mm;
    }
    .print
    {
      display: none;
    }
    .label_alamat
    {
      page-break-inside: avoid;
      page-break-after: always;
    }
    div.kanan
    {
      clear: both;
    }
  }
  div.barcode, div.job, div.ekspedisi, div.barcode, div.adminongkir, div.penerima, div.pengirim, div.item
  {
    padding-bottom: 5px;
    padding-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
  }
  div.logokurir, div.kurir, div.kepada, div.dari, div.jumlah, div.orderno
  {
    width: 23%;
    float: left;
    line-height: 1.5;
  }
  div.kurir, div.invoice, div.orderno
  {
    position: relative;
    top: 9px;
  }
  div.invoice
  {
    width: 30%;
    float: left;
    line-height: 1.5;
  }
  div.produk
  {
    width: 75%;
    float: left;
  }
  div.penerima2, div.pengirim2
  {
    width: 77%;
    float: left;
    line-height: 1.5;
    font-size: 17px;
  }
  div.kiri, div.adminongkir, div.penerima, div.pengirim, div.clear, div.item
  {
    clear: both;
  }
  div.admin, div.asuransi, div.ongkir
  {
    width: 23%;
    float: left;
    line-height: 1.5;
  }
  div.berat
  {
    width: 30%;
    float: left;
    line-height: 1.5;
  }
  span.harga_ongkir, span.total_berat
  {
    font-size: 13px;
  }
  div.gunting
  {
    padding-top: 5px;
    padding-bottom: 3px;
    border-bottom: 1px dashed #bdbcbc;
    clear: both;
  }
  div.icon_gunting
  {
    position: relative;
    float: right;
    top: -3px;
  }
  div.item
  {
    padding-top: 0px;
  }
  div.keterangan
  {
    font-size: 10px;
    padding-bottom: 10px;
  }

</style>
`;

var js = `<script>
let label = \`
<div class="label_alamat">
  <div class="label">
    <div class="header">
      <div class="logo">
        <img src="{{logotoko}}" width="180" height="24">
      </div>
      <div class="label_pengiriman">
        Label Pengiriman
      </div>
    </div>
    <div class="barcode"></div>
    <div class="job" style="display: none;">{{kode_booking}}</div>
    <div class="ekspedisi">
      <div class="logokurir">
        <img src="{{logokurir}}" width="80%">
      </div>
      <div class="kurir">{{ekspedisi}}</div>
      <div class="orderno">Order No.<br>{{orderno}}</div>
      <div class="invoice">Invoice Number<br>{{invoice}}</div>
    </div>
    <div class="adminongkir">
      <div class="admin">Administrasi<br><span class="harga_admin">{{administrasi}}</span></div>
      <div class="asuransi">Asuransi<br><span class="harga_asuransi">{{asuransi}}</span></div>
      <div class="ongkir">SubTotal<br><span class="harga_ongkir">{{ongkir}}</span></div>
      <div class="berat">Tanggal<br><span class="total_berat">{{berat}}</span></div>
    </div>
    <div class="penerima">
      <div class="kepada">Kepada</div>
      <div class="penerima2">
        <div class="nama_penerima"><b>{{nama_penerima}}</b> - {{telepon_penerima}}</div>
        <div class="alamat_penerima"><b>Alamat</b><br>{{alamat_penerima}}</div>
      </div>
    </div>
    <div class="pengirim">
      <div class="dari">Dari</div>
      <div class="pengirim2">
        <div class="nama_pengirim"><b>{{nama_pengirim}}</b> - {{telepon_pengirim}}</div>
        <div class="alamat_pengirim">{{alamat_pengirim}}</div>
      </div>
    </div>
    <div class="gunting">
      <div class="icon_gunting">
        <img src="https://ecs7.tokopedia.net/img/kurir/icon-cut.png" width="14">
      </div>
    </div>
    {{foreach_item}}
    <div class="clear"></div>
  </div>
</div>
\`;

let item = \`
<div class="item">
  <div class="jumlah">{{jumlah_produk}}</div>
  <div class="produk">
    <div class="nama_produk">{{nama_produk}}{{sku}}</div>
    <div class="keterangan">Keterangan: {{keterangan_produk}}</div>
  </div>
</div>
\`;

function refreshAkulaku(offset, count, status)
{
  $.getJSON('https://vendor.akulaku.com/installment/api/json/vendor/pending/delivery/sales/order/list.do?offset=' + offset + '&count=' + count + '&status=' + status, function()
  {
    console.log( "success" );
  })
  .done(function(data) {
      console.log( "second success" );
      var jumlah = data.data.list.length;
      var list, html = '';

      if (jumlah <= 0)
      {
        alert('Maaf, Halaman Berikutnya Tidak Ada.');
        return;
      }

      var kanan = false;
      var x = 0;

      $.each(data.data.list, function(i) {
          list = data.data.list[i];
          if (x == 0)
          {
              html += '<div class="kiri">';
          }
          else if (x == 3 && kanan == false)
          {
              html += '<div class="kanan">';
              kanan = true;
              x = 0;
          }
          else if (x == 3 && kanan == true)
          {
              html += '<div class="kiri">';
              kanan = false;
              x = 0;
          }

          html += cetakAkulaku3(list);

          x++;
          if (x == 3)
          {
              html += '</div>';
          }
      });

      html += '</div></div>';

      $('div.print_area').html(html);
      $('div.print').html(\`<a onclick="javascript:window.print();"><img src="https://ecs7.tokopedia.net/img/print.png"> Cetak</a>
        <a onclick="javascript:refreshAkulaku(\` + (offset-10 < 0 ? 0 : offset-10) + \`, 10, \` + status + \`);"><img src="https://storystylus.com/wp-content/uploads/2016/03/nav_left_green.png"> Previous</a>
        <a onclick="javascript:refreshAkulaku(\` + (offset+10) + \`, 10, \` + status + \`);"><img src="https://storystylus.com/wp-content/uploads/2016/03/nav_right_green.png"> Next</a>
      \`);
  })
  .fail(function() {
    alert('Error 513: Please try again.');
  })
  .always(function() {
    console.log( "complete" );
  });
}

function cetakAkulaku3(list)
{
    var text             = '';
    var logokurir        = 'https://cdn.tokopedia.net/img/kurir/logo_jne.png'; // https://ecs7.tokopedia.net/img/kurir/logo_sicepat.png
    var logotoko         = 'https://vendor.akulaku.com/image/logo_new.png';

    var nama_toko        = list.vendorName;
    var nama_penerima    = list.customerName;
    var alamat_penerima  = list.street + ' ' + list.roomNumber + '<br>' + list.district + ', ' + list.city + ', ' + list.province + ' ' + list.postcode;
    var telepon_penerima = list.customerPhone;
    var ekspedisi        = 'SiCepat REG';
    var kode_ekspedisi   = 'SiCepat';
        ekspedisi        = '<b>' + ekspedisi.substr(0, ekspedisi.indexOf(' ')) + '</b><br>' + ekspedisi.substr(ekspedisi.indexOf(' ')+1);
        ekspedisi        = ekspedisi.replace('(', '').replace(')', '');
    var ongkir           = 'Rp ' + formatMoney(list.subTotal, 0, ',', '.');
    var nama_pengirim    = list.vendorName;
    var telepon_pengirim = list.vPhone;
    var alamat_pengirim  = list.vDistrict + ', ' + list.vCity;
    var invoice          = list.invoiceNo;
    var administrasi     = '+ Rp 0';
    var asuransi         = '+ Rp 0';
    var logo_asuransi    = '';
    var berat            = timeConverter(list.orderTime);
    var total_harga      = 'Rp ' + list.subTotal;
    var insurance_type   = '';
	var insurance_note   = '';
	var additional_fee   = '';
    var kode_booking     = '';

    if (kode_ekspedisi == 'SiCepat')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_sicepat.png';
    }
    else if (kode_ekspedisi == 'JNE')
    {
        logokurir    = 'https://cdn.tokopedia.net/img/kurir/logo_jne.png';
    }

    text += label;
    text = text.replace('{{logotoko}}', logotoko);
    text = text.replace('{{kode_booking}}', kode_booking);
    text = text.replace('{{logokurir}}', logokurir);
    text = text.replace('{{ekspedisi}}', ekspedisi);
    text = text.replace('{{invoice}}', invoice);
    text = text.replace('{{administrasi}}', administrasi);
    text = text.replace('{{asuransi}}', asuransi);
    text = text.replace('{{ongkir}}', ongkir);
    text = text.replace('{{berat}}', berat);
    text = text.replace('{{nama_penerima}}', nama_penerima);
    text = text.replace('{{telepon_penerima}}', telepon_penerima);
    text = text.replace('{{alamat_penerima}}', alamat_penerima);
    text = text.replace('{{nama_pengirim}}', nama_pengirim);
    text = text.replace('{{telepon_pengirim}}', telepon_pengirim);
    text = text.replace('{{alamat_pengirim}}', alamat_pengirim);

    var print_item = '';
    var harga = 0;

    $.each(list.lineItemVOs, function(i)
    {
        var items = list.lineItemVOs[i];
        var label_item = '';

        var gambar_produk = items.img;
        var nama_produk = items.itemName;
        var jumlah_produk = items.qty + ' buah';
        var keterangan_produk = items.property;
        var sku = items.vendorSkuId;
        var total_harga_barang = 'Rp ' + items.price;

        harga += items.price * items.qty;

        label_item = item;
        label_item = label_item.replace('{{jumlah_produk}}', jumlah_produk);
        label_item = label_item.replace('{{nama_produk}}', nama_produk);
        label_item = label_item.replace('{{keterangan_produk}}', keterangan_produk);

        if (typeof(sku) != 'undefined')
        {
          label_item = label_item.replace('{{sku}}', ' (SKU: ' + sku + ')');
        }

        text = text.replace('{{orderno}}', items.id);
        print_item += label_item;

    });

    //text = text.replace('{{ongkir}}', 'Rp ' + formatMoney(harga, 0, ',', '.'));
    text = text.replace('{{foreach_item}}', print_item);

    return text;
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",")
{
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = '0' + a.getMinutes();
  var sec = '0' + a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min.substr(-2) + ':' + sec.substr(-2) ;
  return time;
}
</script>
`;

var currentPage = '';

function cetakAkulaku()
{
  var initWatcher = '';

  initWatcher = setInterval(function ()
  {
    //console.log('watch');
    if (unsafeWindow.angular)
    {
      //clearInterval(initWatcher);

      if (/index\/processingOrders/.test(window.location.href) && currentPage != 'https://vendor.akulaku.com/#/index/processingOrders')
      {
        $('button.btn.btn-success.btn-sm').first().after('<button type="button" id="cetakAkulaku" class="btn btn-primary btn-sm" style="margin-left: 20px;" data-toggle="button"">Loading...</button>');
        currentPage = 'https://vendor.akulaku.com/#/index/processingOrders';
        cetakAkulaku2(0, 10, 1);
        //showDeadline(1);
      }
      else if (/index\/preparingOrders/.test(window.location.href) && currentPage != 'https://vendor.akulaku.com/#/index/preparingOrders')
      {
        $('button.btn.btn-success.btn-sm').first().after('<button type="button" id="cetakAkulaku" class="btn btn-primary btn-sm" style="margin-left: 20px;" data-toggle="button"">Loading...</button>');
        currentPage = 'https://vendor.akulaku.com/#/index/preparingOrders';
        cetakAkulaku2(0, 10, -1);
        //showDeadline(-1);
      }
      else
      {
        currentPage = window.location.href;
      }
    }
  }, 100);

}

function cetakAkulaku2(offset = 0, count = 10, status = 1)
{
  //https://vendor.akulaku.com/installment/api/json/vendor/delivered/sales/order/list.do?offset=0&count=10
  //https://vendor.akulaku.com/installment/api/json/vendor/pending/delivery/sales/order/list.do?offset=10&count=10&status=1
  console.log('angular: ' + unsafeWindow.angular);
  $.getJSON('https://vendor.akulaku.com/installment/api/json/vendor/pending/delivery/sales/order/list.do?offset=' + offset + '&count=' + count + '&status=' + status, function()
  {
    console.log( "success" );
  })
  .done(function(data) {
      console.log( "second success" );
      var jumlah = data.data.list.length;
      var list, html = '';

      html += '<title>Cetak Slip Alamat</title>';
      html += css;
      html += '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>';
      html += js;
      html += `<div class="print">
        <a onclick="javascript:window.print();"><img src="https://ecs7.tokopedia.net/img/print.png"> Cetak</a>
        <a onclick="javascript:refreshAkulaku(` + (offset-10 < 0 ? 0 : offset-10) + `, 10, ` + status + `);"><img src="https://storystylus.com/wp-content/uploads/2016/03/nav_left_green.png"> Previous</a>
        <a onclick="javascript:refreshAkulaku(` + (offset+10) + `, 10, ` + status + `);"><img src="https://storystylus.com/wp-content/uploads/2016/03/nav_right_green.png"> Next</a>
      </div><div class="print_area">`;

      var kanan = false;
      var x = 0;

      $.each(data.data.list, function(i) {
          list = data.data.list[i];
          if (x == 0)
          {
              html += '<div class="kiri">';
          }
          else if (x == 3 && kanan == false)
          {
              html += '<div class="kanan">';
              kanan = true;
              x = 0;
          }
          else if (x == 3 && kanan == true)
          {
              html += '<div class="kiri">';
              kanan = false;
              x = 0;
          }

          html += cetakAkulaku3(list);

          x++;
          if (x == 3)
          {
              html += '</div>';
          }
      });

      html += '</div></div>';

      //$('button.btn.btn-success.btn-sm').first().after('<button type="button" id="cetakAkulaku" class="btn btn-primary btn-sm" style="margin-left: 20px;" data-toggle="button"">Cetak Sekaligus A6</button>');
      $('#cetakAkulaku').html('Cetak Sekaligus A6');
      $('#cetakAkulaku').click(function()
      {
        var blank = window.open('about:blank', '_blank');
        blank.document.write(html);
      });
  })
  .fail(function() {
    $('#cetakAkulaku').html('Error 513 Please Refresh');
  })
  .always(function() {
    console.log( "complete" );
  });

}

function cetakAkulaku3(list)
{
    var text             = '';
    var logokurir        = 'https://cdn.tokopedia.net/img/kurir/logo_jne.png'; //https://ecs7.tokopedia.net/img/kurir/logo_sicepat.png
    var logotoko         = 'https://vendor.akulaku.com/image/logo_new.png';

    var nama_toko        = list.vendorName;
    var nama_penerima    = list.customerName;
    var alamat_penerima  = list.street + ' ' + list.roomNumber + '<br>' + list.district + ', ' + list.city + ', ' + list.province + ' ' + list.postcode;
    var telepon_penerima = list.customerPhone;
    var ekspedisi        = 'SiCepat REG';
    var kode_ekspedisi   = 'SiCepat';
        ekspedisi        = '<b>' + ekspedisi.substr(0, ekspedisi.indexOf(' ')) + '</b><br>' + ekspedisi.substr(ekspedisi.indexOf(' ')+1);
        ekspedisi        = ekspedisi.replace('(', '').replace(')', '');
    var ongkir           = 'Rp ' + formatMoney(list.subTotal, 0, ',', '.');
    var nama_pengirim    = list.vendorName;
    var telepon_pengirim = list.vPhone;
    var alamat_pengirim  = list.vDistrict + ', ' + list.vCity;
    var invoice          = list.invoiceNo;
    var administrasi     = '+ Rp 0';
    var asuransi         = '+ Rp 0';
    var logo_asuransi    = '';
    var berat            = timeConverter(list.orderTime);
    var total_harga      = 'Rp ' + list.subTotal;
    var insurance_type   = '';
	var insurance_note   = '';
	var additional_fee   = '';
    var kode_booking     = '';

    if  (kode_ekspedisi == 'SiCepat')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_sicepat.png';
    }
    else if (kode_ekspedisi == 'JNE')
    {
        logokurir    = 'https://cdn.tokopedia.net/img/kurir/logo_jne.png';
    }

    text += label;
    text = text.replace('{{logotoko}}', logotoko);
    text = text.replace('{{kode_booking}}', kode_booking);
    text = text.replace('{{logokurir}}', logokurir);
    text = text.replace('{{ekspedisi}}', ekspedisi);
    text = text.replace('{{invoice}}', invoice);
    text = text.replace('{{administrasi}}', administrasi);
    text = text.replace('{{asuransi}}', asuransi);
    text = text.replace('{{ongkir}}', ongkir);
    text = text.replace('{{berat}}', berat);
    text = text.replace('{{nama_penerima}}', nama_penerima);
    text = text.replace('{{telepon_penerima}}', telepon_penerima);
    text = text.replace('{{alamat_penerima}}', alamat_penerima);
    text = text.replace('{{nama_pengirim}}', nama_pengirim);
    text = text.replace('{{telepon_pengirim}}', telepon_pengirim);
    text = text.replace('{{alamat_pengirim}}', alamat_pengirim);

    var print_item = '';
    var harga = 0;

    $.each(list.lineItemVOs, function(i)
    {
        var items = list.lineItemVOs[i];
        var label_item = '';

        var gambar_produk = items.img;
        var nama_produk = items.itemName;
        var jumlah_produk = items.qty + ' buah';
        var keterangan_produk = items.property;
        var sku = items.vendorSkuId;
        var total_harga_barang = 'Rp ' + items.price;

        harga += items.price * items.qty;

        label_item = item;
        label_item = label_item.replace('{{jumlah_produk}}', jumlah_produk);
        label_item = label_item.replace('{{nama_produk}}', nama_produk);
        label_item = label_item.replace('{{keterangan_produk}}', keterangan_produk);

        if (typeof(sku) != 'undefined')
        {
          label_item = label_item.replace('{{sku}}', ' (SKU: ' + sku + ')');
        }

        text = text.replace('{{orderno}}', items.id);
        print_item += label_item;

    });

    //text = text.replace('{{ongkir}}', 'Rp ' + formatMoney(harga, 0, ',', '.'));
    text = text.replace('{{foreach_item}}', print_item);

    return text;
}

function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",")
{
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
  } catch (e) {
    console.log(e)
  }
};

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = '0' + a.getMinutes();
  var sec = '0' + a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min.substr(-2) + ':' + sec.substr(-2) ;
  return time;
}

function showDeadline(status)
{
  var initDeadline = '';
  var i = 0;

  initDeadline = setInterval(function ()
  {
    clearInterval(initDeadline);
    console.log('li time: ' + $('li.time').html());

    if (typeof $('li.time').html() == 'string' && i == 0)
    {
        console.log('awal: '+i);
      i++;
        console.log('akhir: '+i);
      if (status == 1)
      {
        $('li.time').html(function()
        {
          return `
          <div>
            <div>` + $(this).html() + `</div>
            <div style="background-color: #ff3333; color: #ffffff; display: inline-block; border-radius: 5px; width: 87px; margin-left: -3px; text-align: center;">` + Math.floor(Math.random() * 25) + ` Jam</div>
          </div>`;
        });
      }
      else if (status == -1)
      {
        $('li.time').html(function()
        {
          return `
          <div>
            <div>` + $(this).html() + `</div>
            <div style="background-color: #ff3333; color: #ffffff; display: inline-block; border-radius: 5px; width: 87px; margin-left: -3px; text-align: center;">` + Math.floor(Math.random() * 25) + ` Jam</div>
          </div>`;
        });
      }
    }
  }, 100);
}