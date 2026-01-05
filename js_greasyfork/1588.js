// ==UserScript==
// @name        Virtonomics: Product Quality Calculator
// @namespace   virtonomics
// @include     *virtonomic*.*/*/main/unit/view/*/supply
// @version     1.1
// @grant       none
// @description Adds calculator to factory supply page
// @downloadURL https://update.greasyfork.org/scripts/1588/Virtonomics%3A%20Product%20Quality%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/1588/Virtonomics%3A%20Product%20Quality%20Calculator.meta.js
// ==/UserScript==
// Written to work in all realms and languages

var run = function() {

    if (window.top != window.self) { //-- Don't run on frames or iframes
       return;
     }
    
    var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    $ = win.$;
        
    // calculate weighted average quality of inputs       
    function CalcProdQlty() {
        var total = 0;
        var pcs = 0;

        var qlty = document.getElementsByName("qlty");
        var numProducts = qlty.length;

        var tech = parseFloat(document.getElementById("techLvl").value);
        var qMod = parseFloat(document.getElementById("qltyMod").value);
            
        for (var i=0;i<numProducts;i++) {
            var nRow = productRow.eq(i);
            var nTbl = $("tbody", nRow).eq(1);
            var cRow = $("tr", nTbl).eq(0);
            var amtReq = parseFloat($("td", cRow).eq(1).html().replace(/ /g,''));
            var q = parseFloat(qlty[i].value);       
            pcs += amtReq;
            total += amtReq * q;
        }
        var avgQlty = total / pcs;

        // calculate product quality
        var t = Math.pow(tech, 0.65);
        var m = 1 + (qMod / 100);
        var i = Math.sqrt(avgQlty);
        var productQuality = t * m * i;
        console.log (productQuality);

        document.getElementById("prodQlty").value = productQuality.toFixed(2);
    }

    // check for factory subdivision
    if (/workshop/i.test (document.body.innerHTML) ) {
        console.log("factory subdivision found");
        var tbl = $("table.infoblock")[0];
        h1 = $("th", tbl).eq(0);
        h2 = $("th", tbl).eq(1);

        var ph1 = h1.parent()[0];

        var cell = document.createElement("th");
        var cellText = document.createTextNode('Technology:  ');
        cell.appendChild(cellText);
        ph1.insertBefore(cell,ph1.childNodes[0]);

        var cell = document.createElement("td");
        var input = document.createElement('input'); 
        input.setAttribute("type", "text");
        input.setAttribute("id", "techLvl");
        input.setAttribute("name", "tech");
        input.setAttribute("style", "width:50px");
        cell.appendChild(input);
        ph1.insertBefore(cell,ph1.childNodes[1]);

        var ph2 = h2.parent()[0];
        var tblBody = h2.parent().parent()[0];

        var cell = document.createElement("th");
        var cellText = document.createTextNode('Quality Modifier:  ');
        cell.appendChild(cellText);
        ph2.insertBefore(cell,ph2.childNodes[0]);

        var cell = document.createElement("td");
        var input = document.createElement('input'); 
        input.setAttribute("type", "text");
        input.setAttribute("value", "0");
        input.setAttribute("id", "qltyMod");
        input.setAttribute("name", "modifier");
        input.setAttribute("style", "width:50px");
        cell.appendChild(input);
        ph2.insertBefore(cell,ph2.childNodes[1]);

        var row = document.createElement("tr");

        var cell = document.createElement("th");
        var cellText = document.createTextNode('Product Quality:  ');
        cell.appendChild(cellText);
        row.appendChild(cell);

        var cell = document.createElement("td");
        var input = document.createElement('input'); 
        input.setAttribute("type", "text");
        input.setAttribute("id", "prodQlty");
        input.setAttribute("name", "outputQlty");
        input.setAttribute("style", "width:50px");
        cell.appendChild(input);
        row.appendChild(cell);

        var cell = document.createElement("td");
        var input=document.createElement("input");
        input.type="button";
        input.value="Calc";
        input.onclick = CalcProdQlty;
        cell.appendChild(input);
        row.appendChild(cell);

        tblBody.appendChild(row);

        var tbl2 = $("table.list")[0];
        tb = $("tbody", tbl2).eq(1);
        tr = $("tr", tbl2);

        var productRow = $('tr[id^="product_row_"]');
        var product = $("img[src^='/img/products']");
        var numInputs = product.length;

        for (var i=0;i<numInputs;i++) {
            var pProduct = product.parent().parent().parent().parent()[i];    
            var cell = document.createElement("td");
            var input = document.createElement('input'); 
            input.setAttribute("type", "text");

            var newRow = productRow.eq(i);
            var newTbl = $("tbody", newRow).eq(2);
            var curRow = $("tr", newTbl).eq(1);

            $(curRow).css("background-color","orange");
            $( "td", curRow ).eq( 1 ).css( "background-color", "yellow" );
            stockQlty = $( "td", curRow ).eq( 1 ).html();

            input.setAttribute("value", stockQlty);
            input.setAttribute("name", "qlty");
            input.setAttribute("style", "width:50px");
            cell.appendChild(input);
            pProduct.insertBefore(cell,pProduct.childNodes[0]);
        }
    }
}

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);