// ==UserScript==
// @name         Default Template Tokopedia Print
// @author       Tokopedia
// @version      0.0.2
// @description  Default Template Label Print Tokopedia
// @license      MIT License.
// ==/UserScript==
//
// ********************************************************************

let label = `
<div class="label_alamat">
  <div class="label">
    <div class="logo">
      <img src="{{logotoko}}" width="115" height="25">
    </div>
    <div class="barcode"></div>
    <div class="job" style="display: none;">{{kode_booking}}</div>
    <div class="ekspedisi">
      <div class="logokurir">
        <img src="{{logokurir}}" width="80%">
      </div>
      <div class="kurir">{{ekspedisi}}</div>
      <div class="invoice">Nomor Invoice<br>{{invoice}}</div>
    </div>
    <div class="adminongkir">
      <div class="admin">Administrasi<br><span class="harga_admin">{{administrasi}}</span></div>
      <div class="asuransi">Asuransi<br><span class="harga_asuransi">{{asuransi}}</span></div>
      <div class="ongkir">Ongkir<br><span class="harga_ongkir">{{ongkir}}</span></div>
      <div class="berat">Berat<br><span class="total_berat">{{berat}}</span><br></div>
    </div>
    <div class="penerima">
      <div class="kepada">Kepada</div>
      <div class="penerima2">
        <div class="nama_penerima"><b>{{nama_penerima}}</b> - {{telepon_penerima}}</div>
        <div class="alamat_penerima">{{alamat_penerima}}</div>
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
    <div class="nama_produk">{{nama_produk}}</div>
    <div class="keterangan">Keterangan: {{keterangan_produk}}</div>
  </div>
</div>
`;

let css = `
<style type="text/css">
  body
  {
    width: 935px;
    font-size: 12px;
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
  }
  .logo
  {
    width: 100%;
    border-bottom: 1px dashed #bdbcbc;
    padding-bottom: 5px;
  }
  .print
  {
    margin-bottom: 3px;
    font-weight: bold;
    font-family: sans-serif;
    font-size: 15px;
  }
  .print a
  {
    color: green;
    text-decoration: none;
  }
  @media print
  {
    .print
    {
      display: none;
    }
    .label_alamat
    {
      page-break-inside: avoid;
    }
  }
  div.barcode, div.job, div.ekspedisi, div.barcode, div.adminongkir, div.penerima, div.pengirim, div.item
  {
    padding-bottom: 5px;
    padding-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
  }
  div.logokurir, div.kurir, div.kepada, div.dari, div.jumlah
  {
    width: 25%;
    float: left;
  }
  div.invoice
  {
    width: 50%;
    float: left;
  }
  div.produk
  {
    width: 75%;
    float: left;
  }
  div.penerima2, div.pengirim2
  {
    width: 75%;
    float: left;
    line-height: 1.5;
  }
  div.kiri, div.adminongkir, div.penerima, div.pengirim, div.clear, div.item
  {
    clear: both;
  }
  div.admin, div.asuransi, div.ongkir, div.berat
  {
    width: 25%;
    float: left;
    line-height: 1.5;
  }
  span.harga_ongkir, span.total_berat
  {
    font-weight: bold;
    font-size: 16px;
  }
  div.gunting
  {
    border-bottom: 1px dashed #bdbcbc;
    padding-top: 5px;
    padding-bottom: 5px;
    margin-top: 40px;
  }
  div.icon_gunting
  {
    position: relative;
    float: right;
    top: 0px;
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

