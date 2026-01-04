// ==UserScript==
// @name        EbayReportHellfest2023
// @description Quick report of hellfest ticket on ebay
// @include     https://www.ebay.fr/itm/*
// @grant       GM_addStyle
// @version     0.0.1.20221020093000
// @namespace https://greasyfork.org/users/972974
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453410/EbayReportHellfest2023.user.js
// @updateURL https://update.greasyfork.org/scripts/453410/EbayReportHellfest2023.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/


var a,b,c,d, len;

a = document.getElementsByTagName("a");
len = a.length;

var vendor_name = "null";
var product_id = 0;

for (var i = 0; i <= len - 1; i++) {
    b = a[i].getAttribute('href');
    const regex = /https:\/\/contact\.ebay\.fr\/ws\/eBayISAPI\.dll\?ShowSellerFAQ&iid=([0-9]*)&requested=(.*?)&redirect=0/gm;
    const str = `https://contact.ebay.fr/ws/eBayISAPI.dll?ShowSellerFAQ&iid=255782593524&requested=vdb.victor&redirect=0&frm=284&rt=nc&ssPageName=PageSellerM2MFAQ_VI&_trksid=p2047675.m3561.l1499`;
    let m;

    while ((m = regex.exec(b)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            console.log(`Found match, group ${groupIndex}: ${match}`);
            if(groupIndex == 2) vendor_name = match;
            if(groupIndex == 1) product_id = match;
        });
    }

    console.log(b); //just to check them out
}

var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Report Hellfest ticket!</button>'
                ;

//zNode.innerHTML = '<form id="myButton" action="/action_page.php" method="post"><label for="fname">First name:</label><input type="text" id="fname" name="fname"><br><br><label for="lname">Last name:</label><input type="text" id="lname" name="lname"><br><br><input type="submit" value="Submit"></form>';


zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    var zNode = document.createElement ('p');
    zNode.innerHTML = 'Done.';
    document.getElementById ("myContainer").appendChild (zNode);

  // The rest of this code assumes you are not using a library.
  // It can be made less verbose if you use one.
  const form = document.createElement('form');
  form.method = "post";
  form.action = "https://ocswf.ebay.fr/rti/send";

    const hiddenField = document.createElement('input');
    hiddenField.type = 'hidden';
    hiddenField.name = 'items';
    hiddenField.value = product_id;
    form.appendChild(hiddenField);

    const hiddenField2 = document.createElement('input');
    hiddenField2.type = 'hidden';
    hiddenField2.name = 'seller';
    hiddenField2.value = vendor_name;
    form.appendChild(hiddenField2);

    const hiddenField3 = document.createElement('input');
    hiddenField3.type = 'hidden';
    hiddenField3.name = 'gbhflag';
    hiddenField3.value = '';
    form.appendChild(hiddenField3);

    const hiddenField4 = document.createElement('input');
    hiddenField4.type = 'hidden';
    hiddenField4.name = 'selected';
    hiddenField4.value = '1714';
    form.appendChild(hiddenField4);

    const hiddenField5 = document.createElement('input');
    hiddenField5.type = 'hidden';
    hiddenField5.name = 'reason-code-1Name';
    hiddenField5.value = '1602';
    form.appendChild(hiddenField5);

    const hiddenField6 = document.createElement('input');
    hiddenField6.type = 'hidden';
    hiddenField6.name = 'dp_reason-code-1';
    hiddenField6.value = 'Objets interdits, contestables ou contrevenants';
    form.appendChild(hiddenField6);

    const hiddenField7 = document.createElement('input');
    hiddenField7.type = 'hidden';
    hiddenField7.name = 'reason-code-2Name disabled=';
    hiddenField7.value = '1711';
    form.appendChild(hiddenField7);

    const hiddenField8 = document.createElement('input');
    hiddenField8.type = 'hidden';
    hiddenField8.name = 'dp_reason-code-2';
    hiddenField8.value = 'Autres objets interdits ou soumis à certaines conditions';
    form.appendChild(hiddenField8);

    const hiddenField9 = document.createElement('input');
    hiddenField9.type = 'hidden';
    hiddenField9.name = 'reason-code-3Name disabled=';
    hiddenField9.value = '1714';
    form.appendChild(hiddenField9);

    const hiddenField10 = document.createElement('input');
    hiddenField10.type = 'hidden';
    hiddenField10.name = 'dp_reason-code-3';
    hiddenField10.value = 'Revente de billets pour événements';
    form.appendChild(hiddenField10);

    const hiddenField11 = document.createElement('input');
    hiddenField11.type = 'hidden';
    hiddenField11.name = 'reason-code-4Name disabled=';
    hiddenField11.value = '';
    form.appendChild(hiddenField11);

    const hiddenField12 = document.createElement('input');
    hiddenField12.type = 'hidden';
    hiddenField12.name = 'useritems';
    hiddenField12.value = product_id;
    form.appendChild(hiddenField12);

  document.body.appendChild(form);
  form.submit();

}

//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str = str.replace (/^[^\/]+\/\*!?/, '').replace (/\s*\*\/\s*\}\s*$/, '').replace (/\/\/.+$/gm, '');
    return str;
}