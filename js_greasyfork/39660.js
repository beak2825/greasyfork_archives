// ==UserScript==
// @name         Tokopedia Cetak Sekaligus Non Gold Merchant
// @author       rendy1287
// @namespace    http://www.github.com/rendy1287
// @source       https://github.com/rendy1287/tokopedia-cetak-sekaligus
// @version      0.07
// @description  Untuk mencetak label alamat pada Tokopedia bagi pengguna Non / Bukan Gold Merchant.
// @license      MIT License.
// @icon         https://ecs7.tokopedia.net/img/favicon.ico
// @match        https://www.tokopedia.com/myshop_order_process.pl*
// @match        https://tokopedia.com/myshop_order_process.pl*
// @include      https://www.tokopedia.com/myshop_order_process.pl*
// @include      https://tokopedia.com/myshop_order_process.pl*
// @run-at       document-end
// @require      https://greasyfork.org/scripts/40090-default-template-tokopedia-label-print/code/Default%20Template%20Tokopedia%20Label%20Print.js?version=262173
// @downloadURL https://update.greasyfork.org/scripts/39660/Tokopedia%20Cetak%20Sekaligus%20Non%20Gold%20Merchant.user.js
// @updateURL https://update.greasyfork.org/scripts/39660/Tokopedia%20Cetak%20Sekaligus%20Non%20Gold%20Merchant.meta.js
// ==/UserScript==
//
//***************** PENGATURAN *************************************//
//
// @logotoko      URL logo toko jika kamu ingin cantumkan logo
//                isikan url image kamu, bisa upload ke image hosting
//                logo recommended size: 115x25 pixel
//
// @ekspedisi     menampilkan logo ekspedisi, isikan true jika
//                ingin menampilkan atau false jika tidak
//
// @invoice       menampilkan nomor invoice, isikan true jika
//                ingin menampilkan atau false jika tidak
//
// @fontsize      ukuran font untuk label
//
//******************************************************************//

const logotoko  = 'https://ecs7.tokopedia.net/img/logo-tokopedia-32.png';
const ekspedisi = true;
const invoice   = true;
const fontsize  = '12px';

//*****************************************************************//
//
//  SCRIPT DI BAWAH INI JANGAN DIUBAH JIKA TIDAK MENGERTI
//
//*****************************************************************//

(function() {
    'use strict';

    var btncetak  = '<style>button.t-c-s{background-color: #3a87ad; border: 1px solid #3a87ad; color: white;}' +
                'button.t-c-s:hover{background-color: #3a679d; border: 1px solid #3a679d; color: white;}</style>' +
                '<button class="btn btn-small mr-5 t-c-s">' +
                '<i class="icon-fax-alt"></i> ' + ($('html').attr('lang') == 'id' ? 'Cetak Sekaligus' : 'Print Multiple') + '</button>';

    $(btncetak).insertAfter('button.confirm-multiple');

    $('button.t-c-s').click(function()
    {
        var html = '';
        var id = '';
        var labelid = [];

        $('input.order_checkbox').each(function ()
        {
            var checked = (this.checked ? $(this).val() : '');
            id += checked;

            if (checked != '')
            {
                labelid.push($(this).parent().parent().prop('id').replace('order-', ''));
            }
        });

        if (id == '')
        {
            var message_error = tokopedia.render_message('error', tokopedia.loc('ERROR_CHOOSE_ORDER'));
            tokopedia.alert($(this).text(), message_error);
            return false;
        }

        html += '<title>Cetak Slip Alamat</title>';
        html += css;
        html += '<div class="print"><a href="javascript:window.print();"><img src="https://ecs7.tokopedia.net/img/print.png"> Cetak</a></div><div class="print_area">';

        var kanan = false;
        var x = 0;

        labelid.forEach(function (a, i)
        {
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

            html += set_print_label(a);

            x++;
            if (x == 3)
            {
                html += '</div>';
            }
        });

        html += '</div></div>';

        $('<div class="cetak_sekaligus"></div>').insertBefore('footer.footer-wrapper');
        $(html).append('div.cetak_sekaligus');

        var blank = window.open('about:blank', '_blank');
        blank.document.write(html);
    });

})();

function set_print_label(id)
{
    var text             = '';
    var logokurir        = 'https://ecs7.tokopedia.net/img/kurir/logo_jne.png';

    var nama_toko        = $('a.break-word').html();
    var nama_penerima    = $('tr#order-' + id + ' td input.dest_receiver_name').val();
    var alamat_penerima  = $('tr#order-' + id + ' td input.dest_address').val();
    var telepon_penerima = /[0-9]{10,}/.exec(alamat_penerima);
        alamat_penerima  = alamat_penerima.replace(/Telp.*/, '');
    var ekspedisi        = $('tr#order-' + id + ' td input.ship_shipping_name').val();
    var kode_ekspedisi   = ekspedisi.substr(0, ekspedisi.indexOf(' '));
        ekspedisi        = '<b>' + ekspedisi.substr(0, ekspedisi.indexOf(' ')) + '</b><br>' + ekspedisi.substr(ekspedisi.indexOf(' ')+1);
        ekspedisi        = ekspedisi.replace('(', '').replace(')', '');
    var ongkir           = $('tr#order-' + id + ' td input.ship_shipping_price').val();
    var nama_pengirim    = ($('tr#order-' + id + ' td input.dropship_name').val() ? '-' : nama_toko);
    var telepon_pengirim = ($('tr#order-' + id + ' td input.dropship_telp').val() ? '' : $('tr#order-' + id + ' td input.shop_phone').val());
    var alamat_pengirim  = $('tr#order-' + id + ' td input.shop_district').val() + ', ' +
                           $('tr#order-' + id + ' td input.shop_province').val() + ', ' + $('tr#order-' + id + ' td input.shop_postal').val();
    var invoice          = $('tr#order-' + id + ' td input.order_invoice').val();
    var administrasi     = '+ Rp 0';
    var asuransi         = ($('tr#order-' + id + ' td input.order_add_price').val() == 'Rp 0' ?
							'+ Rp 0' :
							'<span style="text-decoration: line-through;">+ ' + $('tr#order-' + id + ' td input.order_add_price').val()) + '</span>';
    var logo_asuransi    = '';
    var berat            = /\(.*\)/.exec($('tr#order-' + id + ' td input.order_product_qty').val());
        berat            = berat.toString().replace('(', '').replace(')', '');
    var total_harga      = $('tr#order-' + id + ' td input.order_open_amt').val();
    var insurance_type  = $('tr#order-' + id + ' td input.insurance_type').val();
	var insurance_note  = $('tr#order-' + id + ' td input.insurance_note').val();
	var additional_fee  = $('tr#order-' + id + ' td input.additional_fee').val();
    var kode_booking     = '';

    if (kode_ekspedisi == 'JNE')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_jne.png';
    }
    else if  (kode_ekspedisi == 'SiCepat')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_sicepat.png';
    }
    else if  (kode_ekspedisi == 'J&T')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_jnt.png';
    }
    else if  (kode_ekspedisi == 'Grab')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_grab.png';
    }
    else if  (kode_ekspedisi == 'Go-Send')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_gosend.png';
    }
    else if  (kode_ekspedisi == 'Ninja')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_ninja.png';
    }
    else if  (kode_ekspedisi == 'Wahana')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_wahana.png';
    }
    else if  (kode_ekspedisi == 'Tiki')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_tiki.png';
    }
    else if  (kode_ekspedisi == 'Pos')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_pos.png';
    }
    else if  (kode_ekspedisi == 'First')
    {
        logokurir    = 'https://ecs7.tokopedia.net/img/kurir/logo_first.png';
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

    $('tr#order-' + id + ' td div.products').each(function ()
    {
        var label_item = '';

        var gambar_produk = $(this).find('input.product_pic').val();
        var nama_produk = $(this).find('input.product_name').val();
        var jumlah_produk = $(this).find('input.product_qty').val();
            jumlah_produk = jumlah_produk.substr(0, jumlah_produk.indexOf(' ')) + ' buah';
        var keterangan_produk = $(this).find('input.product_notes').val();
        var total_harga_barang = $(this).find('input.product_subtotal').val();

        label_item = item;
        label_item = label_item.replace('{{jumlah_produk}}', jumlah_produk);
        label_item = label_item.replace('{{nama_produk}}', nama_produk);
        label_item = label_item.replace('{{keterangan_produk}}', keterangan_produk);

        print_item += label_item;

    });

    text = text.replace('{{foreach_item}}', print_item);

    return text;


}