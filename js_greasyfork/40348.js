// ==UserScript==
// @name         Workers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Amigo57
// @match        *://*.e-sim.org/company.html?id=*&y


// @downloadURL https://update.greasyfork.org/scripts/40348/Workers.user.js
// @updateURL https://update.greasyfork.org/scripts/40348/Workers.meta.js
// ==/UserScript==

(function() {
     document.body.style.backgroundImage = `none` ;
    var priceEls4 = document.getElementsByClassName("dataTable");
    var price4 ;
    if(!document.getElementsByClassName("dataTable")[0]){
    document.body.innerHTML = `<center><span style="
    font-size: 33px;
    color: #fffdfd;
    ##: white
    padding:  5px;
    font-style: italic;
    background: #0000008f;
    border:  1px solid;
    border-radius:  8px;
">No Workers</span></center>`
    ;
    }

    if(document.getElementsByClassName("dataTable")[1])
{
    price4 = priceEls4[1].innerHTML;
} else {
        price4 = priceEls4[0].innerHTML;


//    document.body.innerHTML = `<span style="
//    font-size: 33px;
//    color: #fffdfd;
//    ##: white
//    padding:  5px;
//    font-style: italic;
//    background: #0000008f;
//    border:  1px solid;
//    border-radius:  8px;
//">You have not permission</span>`
//    ;
}

     document.body.innerHTML = `<center><table id="list" class="dataTable " style="float:left;margin: auto;width: 330px;">` + price4 +`
<table id="sal" style="display:none" class="bbTable"><tbody><tr><td>eco</td><td>salary</td></tbody></table>
<iframe id="amk" width="45%" height="300px" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen="" style="
    margin-left: 60px;
    /* padding: 0px; */
    float:  left;
"></iframe></center>
`;
insertwt(22,6.9);
insertwt(21,6.6);
insertwt(20,6.4);
insertwt(19,6.1);
insertwt(18,5.9);
insertwt(17,5.7);
insertwt(16,5.5);
insertwt(15,5.2);
insertwt(14,4.9);
insertwt(13,4.6);
insertwt(12,4.4);
insertwt(11,4.2);
insertwt(10,3.9);
insertwt(9,3.6);
insertwt(8,3.2);
insertwt(7,3.0);
insertwt(6,2.7);
insertwt(5,2.4);
insertwt(4,2.1);
insertwt(3,1.8);
insertwt(2,1.5);
insertwt(1,1.3);


$('.dataTable  tr').each(function(){
    $(this).children('td').eq(2).html('Salary');
    $(this).append('<td></td>');
});



   var table = document.getElementsByClassName("dataTable")[0];
 if(!table.rows[0].cells[4])
{
document.body.innerHTML = `<center><span style="
    font-size: 33px;
    color: #fffdfd;
    ##: white
    padding:  5px;
    font-style: italic;
    background: #0000008f;
    border:  1px solid;
    border-radius:  8px;
">You have not permission</span></center>`
    ;
}

    table.rows[0].cells[4].innerText= "Donate";


    for (var r = 1, n = table.rows.length; r < n; r++) {
        var url = document.getElementsByClassName("profileLink")[r-1].getAttribute("href");
        var id = url.substring(url.lastIndexOf('=') + 1);
        var skill = parseInt(table.rows[r].cells[1].innerText,10);
         table.rows[r].cells[2].innerText= document.getElementById('sal').rows[skill].cells[1].innerText;
         table.rows[r].cells[4].innerHTML= `<button onclick="document.getElementById('amk').src = 'https://suna.e-sim.org/donateMoney.html?id=` + id + `&y' ;">Donate</button>`;
        }



//alert(document.getElementsByClassName("dataTable")[0].rows[1].cells[1].innerText);


function insertwt(b,c,d,e,f,g) {
    var table = document.getElementById('sal');
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = b;
    cell2.innerHTML = c;
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle(`body {padding:0px !important;margin:0px;color:black;text-align:center`);
    addGlobalStyle(`#productivityTable {width: auto !important;;background: #f2f2f2b0 !important;}`);
    addGlobalStyle(`#productivityTable > tbody > tr > td > div:first-child {
    color: red;
    font-weight: bold;
}`);
    addGlobalStyle(`.dataTable>tbody>tr:first-child>td {
    background: #0000ff7a;
}`);
    addGlobalStyle(`.dataTable{font-size:14px;text-align:center;border-spacing:0;border-radius:6px;-moz-border-radius:6px;-o-border-radius:6px;-webkit-border-radius:6px;box-shadow:0 0 2px rgba(0,0,0,0.4);-o-box-shadow:0 0 2px rgba(0,0,0,0.4);-webkit-box-shadow:0 0 2px rgba(0,0,0,0.4);-moz-box-shadow:0 0 2px rgba(0,0,0,0.4);border-collapse:inherit;border:1px solid #888;word-wrap:break-word}`);
    addGlobalStyle(`.dataTable tr td{padding:2px;height:35px;border-right:1px solid #777;border-bottom:1px solid #777;border-left:0;border-top:0;background:#f2f2f2;padding:.4em!important;font-size:.9em;font-family:'Open Sans',Arial,sans-serif;text-shadow:0 0 2px white,0 1px 1px white}`);
    addGlobalStyle(`.dataTable>tbody>tr:first-child>td{background-image:url('../img/bg.png');height:33px;font-size:11px;font-weight:normal!important;text-transform:uppercase!important;text-align:center;padding:.6em .2em!important;text-shadow:none!important;color:#f2f2f2!important;border-right:0;text-shadow:0 0 2px #f2f2f2,0 1px 1px #f2f2f2;border-color:#111}`);
    addGlobalStyle(`.dataTable tr:first-child>td:first-child{border-top-left-radius:5px;border-top:0;border-left:0}`);
    addGlobalStyle(`.dataTable tr>td:last-child{border-right:0}`);
    addGlobalStyle(`.dataTable tr:first-child>td:last-child{border-top-right-radius:5px;border-right:0}`);
    addGlobalStyle(`.dataTable tr:last-child>td:first-child{border-bottom-left-radius:5px}`);
    addGlobalStyle(`.dataTable tr:last-child>td{border-bottom:0}`);
    addGlobalStyle(`.dataTable tr:last-child>td:last-child{border-bottom-right-radius:5px;border-bottom:0;border-right:0}`);





})();